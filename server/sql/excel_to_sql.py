#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import math
import os
import re
import sys
from typing import Any, Dict, Optional

import pandas as pd


CITY_CODE_MAP = {
    "방콕": "BKK",        # Bangkok
    "파타야": "UTP",      # Pattaya
    "후아힌": "HHQ",      # Hua Hin
    "치앙마이": "CNX",    # Chiang Mai
    "푸켓": "HKT",        # Phuket
    "칸차나부리": "CAB",
    "카오야이": "CYY",
}

COUNTRY_CODE = "TH"

# Column keys expected from Excel (left) -> internal canonical keys (right)
COLUMN_MAP = {
    "name(eng)": "name_en",
    "name(korean)": "name_kr",
    "country": "country",
    "city": "city",
    "hole no.": "hole_no",
    "address": "address",
    "tel": "phone",
    "homepage": "website",
    "max golfer": "max_golfer",
    "1 player avail": "single_play",
    "2 player avail": "double_play",
    "course designer": "course_designer",
    "price option": "price_option",
    "difficulty": "difficulty",
    "night golf": "night_golf_yn",
    "fairway grass": "fairway_info",
    "green grass": "green_info",
    "location": "airport_time",
    "google map": "map_url",
    "short introduction": "description",
    # locale_text
    "caddy policy": "caddy_policy",
    "cart policy": "cart_policy",
    "caddy tip": "caddy_tip",
    "rain chek": "rain_check",   # note: sheet may have a typo
    "rain check": "rain_check",
    "gallary": "gallery_fee",    # note: sheet may have a typo
    "gallery": "gallery_fee",
}

# Accept a few common label variants by lowercasing and trimming
CANON_KEYS = {k.lower().strip(): v for k, v in COLUMN_MAP.items()}


def is_nan(v: Any) -> bool:
    return v is None or (isinstance(v, float) and math.isnan(v))


def to_str(v: Any) -> str:
    if is_nan(v):
        return ""
    s = str(v).strip()
    # pandas sometimes renders numbers like 1.0 -> "1.0"; normalize if integer-like
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
    # remove non-digits except colon
    s = s.replace(",", "").strip()
    m = re.fullmatch(r"-?\d+", s)
    if m:
        try:
            return int(s)
        except Exception:
            return None
    # sometimes like "18홀" or "18 hole"
    m2 = re.search(r"(-?\d+)", s)
    if m2:
        try:
            return int(m2.group(1))
        except Exception:
            return None
    return None


def parse_airport_time(v: Any) -> Optional[int]:
    """
    Convert time text to minutes.
    Examples:
        "60분" -> 60
        "1:20분" -> 80
        "1:20" -> 80
        "1시간 20분" -> 80
        "90" -> 90
    """
    if is_nan(v):
        return None
    s = to_str(v).lower()
    if not s:
        return None

    # "1:20" or "1:20분"
    m = re.search(r"(\d+)\s*:\s*(\d+)", s)
    if m:
        h = int(m.group(1))
        mnt = int(m.group(2))
        return h * 60 + mnt

    # "1시간 20분"
    mh = re.search(r"(\d+)\s*시간", s)
    mm = re.search(r"(\d+)\s*분", s)
    if mh or mm:
        h = int(mh.group(1)) if mh else 0
        mnt = int(mm.group(1)) if mm else 0
        return h * 60 + mnt

    # plain number -> treat as minutes
    mnum = re.search(r"(\d+)", s)
    if mnum:
        return int(mnum.group(1))

    return None


def map_city(v: Any) -> Optional[str]:
    s = to_str(v)
    if not s:
        return None
    return CITY_CODE_MAP.get(s, None)


def map_yesno_workday(v: Any) -> Optional[str]:
    """
    가능 -> Y
    불가능 -> N
    평일만 가능 -> W
    Accept a few variants.
    """
    s = to_str(v)
    if not s:
        return None
    s = s.replace(" ", "").lower()
    if s in ["가능", "yes", "y", "o", "ok", "true"]:
        return "Y"
    if s in ["불가능", "no", "n", "x", "false"]:
        return "N"
    if s in ["평일만가능", "weekdaysonly", "weekdayonly", "w"]:
        return "W"
    # fallback: exact uppercase if already Y/N/W
    if s.upper() in ["Y", "N", "W"]:
        return s.upper()
    return None


def map_price_option(v: Any) -> Optional[str]:
    """
    L : 럭셔리, H: 상급, N: 가성비
    """
    s = to_str(v).upper()
    if not s:
        return None
    if s.startswith("L") or "럭셔리" in s:
        return "L"
    if s.startswith("H") or "상급" in s:
        return "H"
    if s.startswith("N") or "가성비" in s:
        return "N"
    return None


def map_difficulty(v: Any) -> Optional[int]:
    """
    난이도 상 : 3, 중 : 2, 하 : 1
    """
    s = to_str(v)
    if not s:
        return None
    s = s.strip()
    if s in ["3", "상", "상급", "hard", "high"]:
        return 3
    if s in ["2", "중", "medium", "mid"]:
        return 2
    if s in ["1", "하", "easy", "low"]:
        return 1
    # Try to extract a digit
    m = re.search(r"(\d)", s)
    if m:
        d = int(m.group(1))
        if d in (1, 2, 3):
            return d
    return None


def map_night_golf(v: Any) -> Optional[str]:
    """
    'O' -> Y, 'X' -> N
    Also accept YES/NO.
    """
    s = to_str(v).strip().upper()
    if not s:
        return None
    if s in ["O", "Y", "YES", "TRUE"]:
        return "Y"
    if s in ["X", "N", "NO", "FALSE"]:
        return "N"
    return None


def sql_escape(value: str) -> str:
    # Escape single quotes by doubling them for SQL string literals
    return value.replace("'", "''")


def sql_str_or_null(value: Optional[str]) -> str:
    if value is None:
        return "NULL"
    return f"'{sql_escape(value)}'"


def sql_int_or_null(value: Optional[int]) -> str:
    if value is None:
        return "NULL"
    return str(value)


def row_to_course_values(row: Dict[str, Any]) -> Dict[str, Any]:
    # Fixed country code
    country = COUNTRY_CODE

    return {
        "name_en": to_str(row.get("name_en")),
        "name_kr": to_str(row.get("name_kr")),
        "country": country,
        "city": map_city(row.get("city")),
        "hole_no": to_int(row.get("hole_no")),
        "address": to_str(row.get("address")),
        "phone": to_str(row.get("phone")),
        "website": to_str(row.get("website")),
        "max_golfer": to_int(row.get("max_golfer")),
        "single_play": map_yesno_workday(row.get("single_play")),
        "double_play": map_yesno_workday(row.get("double_play")),
        "course_designer": to_str(row.get("course_designer")),
        "price_option": map_price_option(row.get("price_option")),
        "difficulty": map_difficulty(row.get("difficulty")),
        "night_golf_yn": map_night_golf(row.get("night_golf_yn")),
        "fairway_info": to_str(row.get("fairway_info")),
        "green_info": to_str(row.get("green_info")),
        "airport_time": parse_airport_time(row.get("airport_time")),
        "map_url": to_str(row.get("map_url")),
        "description": to_str(row.get("description")),
        # locale_text source columns
        "caddy_policy": to_str(row.get("caddy_policy")),
        "cart_policy": to_str(row.get("cart_policy")),
        "caddy_tip": to_str(row.get("caddy_tip")),
        "rain_check": to_str(row.get("rain_check")),
        "gallery_fee": to_str(row.get("gallery_fee")),
    }


def make_golf_course_insert(vals: Dict[str, Any]) -> str:
    columns = [
        "name_en", "name_kr", "country", "city", "hole_no", "address", "phone", "website",
        "max_golfer", "single_play", "double_play", "course_designer", "price_option",
        "difficulty", "night_golf_yn", "fairway_info", "green_info", "airport_time",
        "map_url", "description",
    ]
    # Map each to SQL literal
    sql_values = [
        sql_str_or_null(vals.get("name_en") or None),
        sql_str_or_null(vals.get("name_kr") or None),
        sql_str_or_null(vals.get("country") or None),
        sql_str_or_null(vals.get("city") or None),
        sql_int_or_null(vals.get("hole_no")),
        sql_str_or_null(vals.get("address") or None),
        sql_str_or_null(vals.get("phone") or None),
        sql_str_or_null(vals.get("website") or None),
        sql_int_or_null(vals.get("max_golfer")),
        sql_str_or_null(vals.get("single_play") or None),
        sql_str_or_null(vals.get("double_play") or None),
        sql_str_or_null(vals.get("course_designer") or None),
        sql_str_or_null(vals.get("price_option") or None),
        sql_int_or_null(vals.get("difficulty")),
        sql_str_or_null(vals.get("night_golf_yn") or None),
        sql_str_or_null(vals.get("fairway_info") or None),
        sql_str_or_null(vals.get("green_info") or None),
        sql_int_or_null(vals.get("airport_time")),
        sql_str_or_null(vals.get("map_url") or None),
        sql_str_or_null(vals.get("description") or None),
    ]

    return (
        "INSERT INTO golf_course ("
        + ", ".join(columns)
        + ") VALUES ("
        + ", ".join(sql_values)
        + ");"
    )


def make_locale_text_inserts(vals: Dict[str, Any], include_empty: bool = False) -> str:
    """
    Generate locale_text inserts, using @gid as the target_idx which must be set from LAST_INSERT_ID().
    Only insert rows with non-empty text unless include_empty=True.
    """
    pairs = [
        ("golf_course.caddy_covenants", vals.get("caddy_policy")),
        ("golf_course.cart_covenants", vals.get("cart_policy")),
        ("golf_course.caddy_rule", vals.get("caddy_tip")),
        ("golf_course.rain_check", vals.get("rain_check")),
        ("golf_course.gallery_fee", vals.get("gallery_fee")),
    ]

    stmts = []
    for category, text in pairs:
        text = text if text is not None else ""
        if include_empty or text.strip() != "":
            stmts.append(
                "INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) "
                f"VALUES (@gid, '{category}', '{sql_escape(text)}', 1);"
            )
    return "\n".join(stmts)


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalize dataframe columns to our canonical keys using CANON_KEYS mapping.
    """
    new_cols = []
    for c in df.columns:
        key = str(c).lower().strip()
        new_cols.append(CANON_KEYS.get(key, key))
    df = df.copy()
    df.columns = new_cols
    return df


def process_excel(excel_path: str, sheet_name: str, output_sql_path: str, include_empty_locale: bool = False) -> None:
    if not os.path.exists(excel_path):
        raise FileNotFoundError(f"Excel file not found: {excel_path}")

    df = pd.read_excel(excel_path, sheet_name=sheet_name)
    df = normalize_columns(df)

    lines = []
    for idx, row in df.iterrows():
        values = row_to_course_values(row.to_dict())
        # golf_course insert
        lines.append(make_golf_course_insert(values))
        # retrieve last inserted PK
        lines.append("SET @gid = LAST_INSERT_ID();")
        # locale_text inserts
        lt = make_locale_text_inserts(values, include_empty=include_empty_locale)
        if lt:
            lines.append(lt)
        # separator for readability
        lines.append("-- ------------------------------------------------------------")

    sql_text = "\n".join(lines).strip() + "\n"

    os.makedirs(os.path.dirname(output_sql_path), exist_ok=True)
    with open(output_sql_path, "w", encoding="utf-8") as f:
        f.write(sql_text)

    print(f"Wrote SQL for {len(df)} rows to: {output_sql_path}")


def main():
    parser = argparse.ArgumentParser(description="Generate SQL inserts from Excel for golf_course and locale_text.")
    parser.add_argument("--excel", default="./apl_golf_data.xlsx", help="Path to Excel file (e.g., data.xlsx)")
    parser.add_argument("--sheet", default="골프장_입력", help="Sheet name to read")
    parser.add_argument("--out", default="./golf_course_insert.sql", help="Output .sql file path")
    parser.add_argument(
        "--include-empty-locale",
        action="store_true",
        help="If set, also insert locale_text rows even when text is empty",
    )
    args = parser.parse_args()

    try:
        process_excel(args.excel, args.sheet, args.out, include_empty_locale=args.include_empty_locale)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()