#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import math
import os
import re
import sys
from typing import Any, Dict, Optional

import pandas as pd

# Fixed values
COUNTRY_CODE = "TH"
DEFAULT_COURSE_IDX = 1
DEFAULT_CADDY_CODE = 1
DEFAULT_CREATED_MEMBER_IDX = 7

# Exchange rate: 1 THB = 43.04 KRW
DEFAULT_TBH_TO_KRW = 43.04

# City mapping
CITY_CODE_MAP = {
    "방콕": "BKK",      # Bangkok
    "파타야": "UTP",    # U-Tapao Rayong Pattaya
    "후아힌": "HHQ",    # Hua Hin
    "치앙마이": "CNX",   # Chiang Mai
    "푸켓": "HKT",      # Phuket
    "칸차나부리": "CAB",
    "카오야이": "CYY",
}

# Column label normalization: excel header -> canonical key
COLUMN_MAP = {
    "name": "name",
    "nickname": "nick_name",
    "golf course": "golf_course",
    "year": "age",
    "height": "height",
    "country": "country",
    "city": "city",
    "no working day": "day_off",
    "play golf": "play_golf",
    "language": "language",
    "laungage": "language",  # handle common typo
    "ability": "ability",
    "caddy tip": "caddy_tip",
    "reservation fee": "reservation_fee",  # optional, if present
}
CANON_KEYS = {k.lower().strip(): v for k, v in COLUMN_MAP.items()}


def is_nan(v: Any) -> bool:
    return v is None or (isinstance(v, float) and math.isnan(v))


def to_str(v: Any) -> str:
    if is_nan(v):
        return ""
    s = str(v).strip()
    if re.fullmatch(r"-?\d+\.0+", s):
        try:
            s = str(int(float(s)))
        except Exception:
            pass
    return s


def to_int(v: Any) -> Optional[int]:
    if is_nan(v):
        return None
    s = to_str(v)
    if not s:
        return None
    s = s.replace(",", "").strip()
    m = re.search(r"(-?\d+)", s)
    if not m:
        return None
    try:
        return int(m.group(1))
    except Exception:
        return None


def parse_amount(v: Any) -> Optional[float]:
    """Extract a numeric amount from text like '500', '500THB', '500 바트', '500.0'."""
    if is_nan(v):
        return None
    s = to_str(v)
    if not s:
        return None
    s = s.replace(",", "")
    m = re.search(r"-?\d+(?:[.,]\d+)?", s)
    if not m:
        return None
    try:
        return float(m.group(0).replace(",", "").replace(" ", ""))
    except Exception:
        return None


def map_city_code(v: Any) -> Optional[str]:
    name = to_str(v)
    if not name:
        return None
    return CITY_CODE_MAP.get(name)


def sql_escape(value: str) -> str:
    return value.replace("'", "''")


def sql_str_or_null(value: Optional[str]) -> str:
    if value is None:
        return "NULL"
    return f"'{sql_escape(value)}'"


def sql_int_or_null(value: Optional[int]) -> str:
    if value is None:
        return "NULL"
    return str(value)


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    new_cols = []
    for c in df.columns:
        key = str(c).lower().strip()
        new_cols.append(CANON_KEYS.get(key, key))
    out = df.copy()
    out.columns = new_cols
    return out


def row_to_caddy_values(row: Dict[str, Any], rate_tbh_to_krw: float) -> Optional[Dict[str, Any]]:
    name = to_str(row.get("name"))
    if not name:
        print("Skip row: missing name", file=sys.stderr)
        return None

    city_code = map_city_code(row.get("city"))
    if not city_code:
        print(f"Skip row '{name}': unknown or missing city -> {to_str(row.get('city'))}", file=sys.stderr)
        return None

    # Day off: empty or '-' -> empty string
    raw_day_off = to_str(row.get("day_off"))
    day_off = "" if raw_day_off == "" or raw_day_off == "-" else raw_day_off

    # Golf experience: any non-empty value -> 'Y', else 'N'
    golf_experience = "Y" if to_str(row.get("play_golf")) != "" else "N"

    # Amounts: convert THB -> KRW
    tip_thb = parse_amount(row.get("caddy_tip")) or 0.0
    price_krw = int(round(tip_thb * rate_tbh_to_krw))

    # If a separate reservation_fee column exists, use it; otherwise mirror tip
    res_fee_thb = parse_amount(row.get("reservation_fee"))
    reservation_fee_krw = int(round((res_fee_thb if res_fee_thb is not None else tip_thb) * rate_tbh_to_krw))

    return {
        "course_idx": DEFAULT_COURSE_IDX,
        "caddy_code": DEFAULT_CADDY_CODE,
        "name": name,
        "nick_name": (to_str(row.get("nick_name")) or None),
        "age": to_int(row.get("age")),
        "height": to_int(row.get("height")),
        "country_code": COUNTRY_CODE,
        "city_code": city_code,
        "language": (to_str(row.get("language")) or None),
        "specialty": (to_str(row.get("ability")) or None),
        "day_off": day_off,  # empty string allowed (NOT NULL constraint is not set)
        "golf_experience": golf_experience,
        "price": price_krw,
        "reservation_fee": reservation_fee_krw,
        "caddy_status": "Y",
        "created_member_idx": DEFAULT_CREATED_MEMBER_IDX,
    }


def make_caddy_insert(vals: Dict[str, Any]) -> str:
    columns = [
        "course_idx",
        "caddy_code",
        "name",
        "nick_name",
        "age",
        "height",
        "country_code",
        "city_code",
        "language",
        "specialty",
        "day_off",
        "golf_experience",
        "price",
        "reservation_fee",
        "caddy_status",
        "created_member_idx",
    ]
    sql_values = [
        str(vals["course_idx"]),
        str(vals["caddy_code"]),
        sql_str_or_null(vals.get("name")),
        sql_str_or_null(vals.get("nick_name")),
        sql_int_or_null(vals.get("age")),
        sql_int_or_null(vals.get("height")),
        sql_str_or_null(vals.get("country_code")),
        sql_str_or_null(vals.get("city_code")),
        sql_str_or_null(vals.get("language")),
        sql_str_or_null(vals.get("specialty")),
        f"'{sql_escape(vals.get('day_off', ''))}'",  # must be empty string when no value
        sql_str_or_null(vals.get("golf_experience")),
        str(int(vals.get("price", 0))),
        str(int(vals.get("reservation_fee", 0))),
        sql_str_or_null(vals.get("caddy_status")),
        str(vals.get("created_member_idx", DEFAULT_CREATED_MEMBER_IDX)),
    ]
    return (
        "INSERT INTO caddy ("
        + ", ".join(columns)
        + ") VALUES ("
        + ", ".join(sql_values)
        + ");"
    )


def process_excel(excel_path: str, sheet_name: str, output_sql_path: str, rate_tbh_to_krw: float) -> None:
    if not os.path.exists(excel_path):
        raise FileNotFoundError(f"Excel file not found: {excel_path}")

    df = pd.read_excel(excel_path, sheet_name=sheet_name)
    df = normalize_columns(df)

    lines = []
    count_inserts = 0

    for _, row in df.iterrows():
        vals = row_to_caddy_values(row.to_dict(), rate_tbh_to_krw)
        if not vals:
            continue
        lines.append(make_caddy_insert(vals))
        lines.append("-- ------------------------------------------------------------")
        count_inserts += 1

    sql_text = "\n".join(lines).strip() + ("\n" if lines else "")

    os.makedirs(os.path.dirname(output_sql_path) or ".", exist_ok=True)
    with open(output_sql_path, "w", encoding="utf-8") as f:
        f.write(sql_text)

    print(f"Wrote SQL for {count_inserts} rows to: {output_sql_path}")


def main():
    global DEFAULT_COURSE_IDX, DEFAULT_CADDY_CODE, DEFAULT_CREATED_MEMBER_IDX
    parser = argparse.ArgumentParser(description="Generate SQL inserts for caddy from Excel.")
    parser.add_argument("--excel", default="./apl_golf_data.xlsx", help="Path to Excel file")
    parser.add_argument("--sheet", default="캐디_입력", help="Sheet name to read")
    parser.add_argument("--out", default="./caddy_insert.sql", help="Output .sql file path")
    parser.add_argument("--rate", type=float, default=DEFAULT_TBH_TO_KRW, help="THB to KRW exchange rate")
    # Optional overrides for fixed values (default per requirements)
    parser.add_argument("--course-idx", type=int, default=DEFAULT_COURSE_IDX)
    parser.add_argument("--caddy-code", type=int, default=DEFAULT_CADDY_CODE)
    parser.add_argument("--created-member-idx", type=int, default=DEFAULT_CREATED_MEMBER_IDX)
    args = parser.parse_args()

    DEFAULT_COURSE_IDX = args.course_idx
    DEFAULT_CADDY_CODE = args.caddy_code
    DEFAULT_CREATED_MEMBER_IDX = args.created_member_idx

    try:
        process_excel(args.excel, args.sheet, args.out, rate_tbh_to_krw=args.rate)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()