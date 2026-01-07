#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import sys
import re
from pathlib import Path
from typing import Optional, Dict, Any, List

import pandas as pd


CITY_MAP = {
    "방콕": "BKK",        # Bangkok
    "파타야": "UTP",      # U-Tapao Rayong Pattaya International
    "후아힌": "HHQ",      # Hua Hin
    "치앙마이": "CNX",     # Chiang Mai
    "푸켓": "HKT",        # Phuket
    "칸차나부리": "CAB",
    "카오야이": "CYY",
    "끄라비": "KBV",
}

COUNTRY_CODE = "TH"
DEFAULT_CHECK_IN = 14
DEFAULT_CHECK_OUT = 12

# Expected Excel column headers (Korean)
COLS = {
    "name_kr": "호텔 명",
    "name_en": "호텔 영문 명",
    "grade": "호텔 등급",
    "address": "주소",
    "home_page": "홈페이지",
    "city_name": "도시 정보",
    "refund_info": "환불 안내",
    "service_info": "서비스",

    # Locale text columns
    "explain": "호텔 설명",
    "tour": "주변 관광지",
    "transportation": "교통 정보",
    "language_desc": "언어 지원",
    "room_facility": "호텔 시설 및 서비스",
    "extra_charge": "유로 옵션",
}


def sql_escape(s: str) -> str:
    if s is None:
        return ""
    # Normalize newlines and escape backslashes and single quotes for MySQL
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    s = s.replace("\\", "\\\\").replace("'", "\\'")
    return s


def to_int_or_none(val: Optional[str]) -> Optional[int]:
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
    # Extract first integer sequence (e.g., "5성급" -> 5)
    m = re.search(r"(-?\d+)", s)
    if not m:
        return None
    try:
        return int(m.group(1))
    except Exception:
        return None


def clean_text(val: Any) -> Optional[str]:
    if val is None:
        return None
    if pd.isna(val):
        return None
    s = str(val).strip()
    if not s:
        return None
    return s


def val_str(s: Optional[str]) -> str:
    return "NULL" if s is None else f"'{sql_escape(s)}'"


def val_int(i: Optional[int]) -> str:
    return "NULL" if i is None else str(i)


def get_col(df_row: pd.Series, header: str) -> Optional[str]:
    # Safely fetch and clean a value from the row by column header
    if header not in df_row:
        return None
    return clean_text(df_row[header])


def generate_sql_lines(row: pd.Series, row_idx: int) -> List[str]:
    lines: List[str] = []

    # Extract fields from row
    name_kr = get_col(row, COLS["name_kr"])
    name_en = get_col(row, COLS["name_en"])
    grade = to_int_or_none(get_col(row, COLS["grade"]))
    address = get_col(row, COLS["address"])
    home_page = get_col(row, COLS["home_page"])
    city_name = get_col(row, COLS["city_name"])

    refund_info = get_col(row, COLS["refund_info"])
    service_info = get_col(row, COLS["service_info"])

    explain = get_col(row, COLS["explain"])
    tour = get_col(row, COLS["tour"])
    transportation = get_col(row, COLS["transportation"])
    language_desc = get_col(row, COLS["language_desc"])
    room_facility = get_col(row, COLS["room_facility"])
    extra_charge = get_col(row, COLS["extra_charge"])

    # Required checks
    if city_name is None or city_name not in CITY_MAP:
        lines.append(f"-- SKIP row {row_idx}: Unknown or missing city '{city_name}'")
        return lines

    if name_kr is None:
        lines.append(f"-- SKIP row {row_idx}: Missing required '호텔 명'")
        return lines

    if address is None:
        lines.append(f"-- SKIP row {row_idx}: Missing required '주소'")
        return lines

    city_code = CITY_MAP[city_name]

    # hotel insert
    hotel_columns = [
        "`name_kr`", "`name_en`", "`country_code`", "`city_code`",
        "`grade`", "`check_in`", "`check_out`", "`address`", "`home_page`",
        "`created_member_idx`",
    ]
    hotel_values = [
        val_str(name_kr),
        val_str(name_en),
        val_str(COUNTRY_CODE),
        val_str(city_code),
        val_int(grade),
        str(DEFAULT_CHECK_IN),
        str(DEFAULT_CHECK_OUT),
        val_str(address),
        val_str(home_page),
        "1",
    ]

    lines.append(
        "INSERT INTO `hotel` ({cols}) VALUES ({vals});".format(
            cols=", ".join(hotel_columns),
            vals=", ".join(hotel_values),
        )
    )
    lines.append("SET @hid := LAST_INSERT_ID();")

    # hotel_info insert (only requested columns + language + created_member_idx)
    info_columns = [
        "`hotel_idx`", "`refund_info`", "`service_info`", "`language`", "`created_member_idx`"
    ]
    info_values = [
        "@hid",
        val_str(refund_info),
        val_str(service_info),
        val_str("KR"),
        "1",
    ]
    lines.append(
        "INSERT INTO `hotel_info` ({cols}) VALUES ({vals});".format(
            cols=", ".join(info_columns),
            vals=", ".join(info_values),
        )
    )

    # locale_text inserts (only when present)
    locale_map = [
        ("hotel.explain", explain),
        ("hotel.tour", tour),
        ("hotel.transportation", transportation),
        ("hotel.language", language_desc),
        ("hotel.room_facility", room_facility),
        ("hotel.extra_charge", extra_charge),
    ]
    for category, text in locale_map:
        if text is None:
            continue
        lines.append(
            "INSERT INTO `locale_text` (`target_idx`, `target_category`, `long_text`, `created_member_idx`) "
            f"VALUES (@hid, '{sql_escape(category)}', '{sql_escape(text)}', 1);"
        )

    # spacer
    lines.append("")
    return lines


def run(excel_path: Path, sheet_name: str, out_path: Path) -> None:
    if not excel_path.exists():
        print(f"[ERROR] Excel file not found: {excel_path}", file=sys.stderr)
        sys.exit(1)

    try:
        df = pd.read_excel(excel_path, sheet_name=sheet_name, dtype=str, engine="openpyxl")
    except Exception as e:
        print(f"[ERROR] Failed to read Excel: {e}", file=sys.stderr)
        sys.exit(1)

    # Ensure output directory
    out_path.parent.mkdir(parents=True, exist_ok=True)

    lines: List[str] = []
    lines.append("-- Generated by excel_to_sql_hotel.py")
    lines.append(f"-- Source: {excel_path.name}, Sheet: {sheet_name}")
    lines.append("SET NAMES utf8mb4;")
    lines.append("START TRANSACTION;")
    lines.append("")

    total = len(df.index)
    generated = 0
    skipped = 0

    for idx, row in df.iterrows():
        row_lines = generate_sql_lines(row, idx + 1)
        if row_lines and not any(
            l.startswith("INSERT INTO `hotel`") for l in row_lines
        ):
            skipped += 1
        else:
            # Count only rows that produced a hotel insert
            if any(l.startswith("INSERT INTO `hotel`") for l in row_lines):
                generated += 1
        lines.extend(row_lines)

    lines.append("COMMIT;")
    lines.append(f"-- Summary: total={total}, inserted={generated}, skipped={skipped}")

    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"[OK] SQL written to: {out_path}")
    print(f"[INFO] Summary: total={total}, inserted={generated}, skipped={skipped}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate SQL inserts for hotel data from an Excel sheet."
    )
    parser.add_argument(
        "--excel", "-e", required=True, help="Path to the source Excel file"
    )
    parser.add_argument(
        "--sheet", "-s", default="호텔_입력", help="Excel sheet name (default: 호텔_입력)"
    )
    parser.add_argument(
        "--out",
        "-o",
        default=None,
        help="Output .sql file path (default: server/sql/output/hotel_inserts.sql relative to project root)",
    )
    args = parser.parse_args()

    excel_path = Path(args.excel).expanduser().resolve()
    # Default output path: server/sql/output/hotel_inserts.sql (relative to this script directory)
    script_dir = Path(__file__).resolve().parent
    default_out = (script_dir / "output" / "hotel_inserts.sql").resolve()
    out_path = Path(args.out).expanduser().resolve() if args.out else default_out

    run(excel_path, args.sheet, out_path)


if __name__ == "__main__":
    main()