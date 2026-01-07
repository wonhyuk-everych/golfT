#!/usr/bin/env python3
import os
import sys
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime, timezone
from typing import Optional

import requests
import mysql.connector
from mysql.connector import Error as MySQLError

API_URL = "https://api.exchangerate-api.com/v4/latest/KRW"
TARGET_CURRENCY = "THB"

def setup_logger() -> logging.Logger:
    logger = logging.getLogger("money_exchange")
    logger.setLevel(logging.INFO)

    # Console handler
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.INFO)
    ch_formatter = logging.Formatter("%(asctime)s %(levelname)s: %(message)s")
    ch.setFormatter(ch_formatter)
    logger.addHandler(ch)

    # Optional rotating file log (set LOG_FILE path via env if you want file logs)
    log_file = os.getenv("LOG_FILE")
    if log_file:
        fh = RotatingFileHandler(log_file, maxBytes=2_000_000, backupCount=3)
        fh.setLevel(logging.INFO)
        fh.setFormatter(ch_formatter)
        logger.addHandler(fh)

    return logger

def get_env(name: str, default: Optional[str] = None, required: bool = False) -> Optional[str]:
    val = os.getenv(name, default)
    if required and (val is None or val == ""):
        raise ValueError(f"Required environment variable {name} is not set")
    return val

def fetch_thb_per_krw(logger: logging.Logger) -> float:
    # API is already base KRW, so rates["THB"] is THB per 1 KRW.
    timeout = (5, 10)  # (connect, read) seconds
    try:
        resp = requests.get(API_URL, timeout=timeout)
        resp.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"HTTP error while fetching exchange rates: {e}")
        raise

    try:
        data = resp.json()
        rates = data.get("rates", {})
        thb = rates.get(TARGET_CURRENCY)
        if thb is None:
            raise KeyError(f"{TARGET_CURRENCY} not found in rates")
        if not isinstance(thb, (int, float)):
            raise TypeError(f"Unexpected THB rate type: {type(thb)}")
        logger.info(f"Fetched rate: 1 KRW = {thb} {TARGET_CURRENCY}")
        return float(thb)
    except (ValueError, KeyError, TypeError) as e:
        logger.error(f"Failed to parse API response: {e}")
        raise

def insert_rate_into_mysql(logger: logging.Logger, rate: float) -> None:
    host = "my8003.gabiadb.com"
    port = 3306
    user = "golft"
    password = "mydreamis76@"
    database = "golft"

    conn = None
    try:
        conn = mysql.connector.connect(
            host=host, port=port, user=user, password=password, database=database
        )
        cursor = conn.cursor()
        # Table and column per your spec:
        # INSERT INTO bart_exchange_rate (bart_exchange_rate) VALUES (#THB rate#)
        sql = "INSERT INTO bart_exchange_rate (bart_exchange_rate) VALUES (%s)"
        cursor.execute(sql, (rate,))
        conn.commit()
        logger.info("Inserted THB rate into MySQL successfully.")
    except MySQLError as e:
        logger.error(f"MySQL error: {e}")
        raise
    finally:
        try:
            if cursor:  # type: ignore
                cursor.close()
        except Exception:
            pass
        try:
            if conn:
                conn.close()
        except Exception:
            pass

def main() -> int:
    logger = setup_logger()
    logger.info("Starting money_exchange job...")

    try:
        rate = fetch_thb_per_krw(logger)
        insert_rate_into_mysql(logger, rate)
        logger.info("Job completed successfully.")
        return 0
    except Exception as e:
        logger.error(f"Job failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())