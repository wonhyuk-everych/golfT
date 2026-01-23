#!/usr/bin/env bash
# set -e 제거 (에러 시에도 계속 진행), set -u도 제거 (변수 미설정 허용)
set -o pipefail

# Google Feeds 생성 및 SFTP 업로드 스크립트
# 사용법: ./scripts/upload-google-feeds.sh

# 스크립트 디렉토리 (설정 파일 로드용)
# source로 실행될 때를 대비하여 BASH_SOURCE 사용
if [ -n "${BASH_SOURCE[0]}" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
elif [ -n "$0" ] && [ "$0" != "-bash" ] && [ "$0" != "-zsh" ] && [ "$0" != "bash" ] && [ "$0" != "zsh" ]; then
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
else
    # source로 실행되고 BASH_SOURCE가 없는 경우 (sh 등), 현재 디렉토리 사용
    SCRIPT_DIR="$(pwd)"
fi

# 원래 작업 디렉토리 저장 (스크립트 종료 후 복원하기 위해)
ORIGINAL_DIR="$(pwd)"

# 설정 파일 로드 (FEEDS_DIR을 먼저 확인하기 위해)
CONFIG_FILE="$SCRIPT_DIR/config.sh"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "ERROR: 설정 파일을 찾을 수 없습니다: $CONFIG_FILE"
    echo "scripts/config.sh 파일을 생성해주세요."
    exit 1
fi

# 설정 파일 소스 (FEEDS_DIR 로드)
source "$CONFIG_FILE"

# 로그 디렉토리는 FEEDS_DIR로 설정
LOG_DIR="$FEEDS_DIR"

# old_logs 디렉토리 생성
OLD_LOG_DIR="$LOG_DIR/old_logs"
mkdir -p "$OLD_LOG_DIR"

# 기존 로그를 old_logs 디렉토리로 이동 (timestamp 포함 로그 파일이 있으면)
if ls "$LOG_DIR"/uploadResult_*.log 1> /dev/null 2>&1; then
    mv "$LOG_DIR"/uploadResult_*.log "$OLD_LOG_DIR/" 2>/dev/null || true
fi

# 새로운 로그 파일 생성 (timestamp 포함)
TIMESTAMP_LOG=$(date '+%Y%m%d_%H%M%S')
LOG_FILE="$LOG_DIR/uploadResult_${TIMESTAMP_LOG}.log"

# 설정 파일은 이미 위에서 로드됨

# 로그 함수 (stderr도 로그 파일에 기록)
log() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$msg" | tee -a "$LOG_FILE"
}

# 에러 처리
error_exit() {
    log "ERROR: $1"
    log "=== Google Feeds 업로드 실패 ==="
    # exit 제거
}

# 성공 로그
success_exit() {
    log "SUCCESS: $1"
    log "=== Google Feeds 업로드 성공 ==="
    # exit 제거
}

log "=== Google Feeds 업로드 시작 ==="

# 1. API 호출하여 파일 생성
log "API 호출 중: $API_URL"
RESPONSE=$(curl -k -s "$API_URL" 2>&1) || {
    log "ERROR: API 호출 실패: $RESPONSE"
    error_exit "API 호출 실패"
}

# 2. 응답 파싱 (jq 사용 또는 기본 파싱)
log "API 응답: $RESPONSE"

if command -v jq >/dev/null 2>&1; then
    # jq가 있으면 사용
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false' 2>/dev/null)
    TIMESTAMP=$(echo "$RESPONSE" | jq -r '.timestamp // ""' 2>/dev/null)
    ERROR_MSG=$(echo "$RESPONSE" | jq -r '.error // ""' 2>/dev/null)
    
    log "파싱된 값 - SUCCESS: [$SUCCESS], TIMESTAMP: [$TIMESTAMP]"
    
    if [ "$SUCCESS" != "true" ]; then
        error_exit "API 응답 실패: ${ERROR_MSG:-$RESPONSE}"
    fi
    
    # 파일 목록 추출 (files가 배열인지 확인)
    FILES=$(echo "$RESPONSE" | jq -r 'if .files and (.files | type) == "array" then .files[] else empty end' 2>/dev/null)
else
    # jq가 없으면 기본 파싱
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[^,}]*' | cut -d':' -f2 | tr -d ' "' || echo "false")
    TIMESTAMP=$(echo "$RESPONSE" | grep -o '"timestamp":[^,}]*' | cut -d':' -f2 | tr -d ' "' || echo "")
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4 || echo "")
    
    if [ "$SUCCESS" != "true" ]; then
        error_exit "API 응답 실패: ${ERROR_MSG:-$RESPONSE}"
    fi
    
    # 파일 목록 추출 (더 정확한 방법)
    # JSON 배열에서 파일명만 추출하여 각 줄에 하나씩 출력
    FILES=$(echo "$RESPONSE" | sed -n 's/.*"files":\[\([^]]*\)\].*/\1/p' | sed 's/"//g' | sed 's/,/\n/g' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | grep -v '^$')
fi

if [ -z "$TIMESTAMP" ]; then
    error_exit "timestamp를 찾을 수 없습니다"
fi

log "파일 생성 성공 (timestamp: $TIMESTAMP)"

# 4. 파일 존재 확인
log "생성된 파일 확인 중..."
log "파일 목록: $FILES"
MISSING_FILES=()
FILE_COUNT=0

# 파일 목록이 비어있는지 확인
if [ -z "$FILES" ]; then
    error_exit "파일 목록이 비어있습니다"
fi

# 파일 목록을 배열로 변환 (개행으로 구분)
# heredoc 대신 파일로 리다이렉트하여 변수 업데이트 보장
TEMP_FILE_LIST=$(mktemp)
printf '%s\n' "$FILES" > "$TEMP_FILE_LIST"

while IFS= read -r file || [ -n "$file" ]; do
    [ -z "$file" ] && continue  # 빈 줄 건너뛰기
    FILE_PATH="$FEEDS_DIR/$file"
    if [ ! -f "$FILE_PATH" ]; then
        MISSING_FILES+=("$file")
        log "경고: 파일을 찾을 수 없습니다: $FILE_PATH"
    else
        FILE_COUNT=$((FILE_COUNT + 1))
        log "파일 확인됨: $file"
    fi
done < "$TEMP_FILE_LIST"

rm -f "$TEMP_FILE_LIST"

# FILE_COUNT 기본값 설정 (안전장치)
FILE_COUNT=${FILE_COUNT:-0}

log "파일 확인 루프 완료. 확인된 파일 수: $FILE_COUNT"

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    error_exit "일부 파일이 없습니다: ${MISSING_FILES[*]}"
fi

# FILE_COUNT가 제대로 설정되었는지 다시 확인
FILE_COUNT=${FILE_COUNT:-0}
log "모든 파일 확인 완료 (총 ${FILE_COUNT}개)"

# 5. SFTP 키 파일 확인
if [ ! -f "$SFTP_KEY" ]; then
    log "ERROR: SFTP 키 파일을 찾을 수 없습니다: $SFTP_KEY"
    log "파일은 성공적으로 생성되었습니다: $FEEDS_DIR"
    log "SFTP 업로드를 건너뜁니다 (키 파일이 필요합니다)"
    error_exit "SFTP 키 파일이 없어 업로드를 건너뜁니다"
    # 키 파일이 없으면 업로드 단계를 건너뜀
    # 원래 디렉토리로 복원 후 종료
    cd "$ORIGINAL_DIR" || true
    exit 0
fi

log "SFTP 키 파일 확인됨: $SFTP_KEY"
chmod 600 "$SFTP_KEY" || log "경고: SFTP 키 파일 권한 설정 실패"

# 6. SFTP로 파일 업로드
log "SFTP로 파일 업로드 시작..."
cd "$FEEDS_DIR" || error_exit "디렉토리 이동 실패: $FEEDS_DIR"

# SFTP 배치 명령 생성
# - Ubuntu의 OpenSSH 8.9p1은 배치 모드에서 여러 파일을 한 번에 보낼 때 메시지 크기 제한(256KB)에 걸림
# - macOS의 OpenSSH 10.0p2는 더 관대하므로 로컬에서는 작동하지만 서버에서는 실패
# - 해결: 각 파일을 개별 SFTP 세션으로 업로드
TEMP_SFTP_CMDS_FILE=$(mktemp)
printf '%s\n' "$FILES" > "$TEMP_SFTP_CMDS_FILE"

# 각 파일을 개별 SFTP 세션으로 업로드 (Ubuntu 서버 호환성)
UPLOAD_FAILED=0
UPLOADED_COUNT=0
SFTP_OUTPUT_ALL=""

while IFS= read -r file || [ -n "$file" ]; do
    [ -z "$file" ] && continue
    
    log "업로드 중: $file"
    
    # 각 파일마다 개별 SFTP 세션 생성 (메시지 크기 제한 회피)
    TEMP_SFTP_BATCH_FILE=$(mktemp)
    echo "put $file" > "$TEMP_SFTP_BATCH_FILE"
    echo "bye" >> "$TEMP_SFTP_BATCH_FILE"
    
    SFTP_OUTPUT=$(sftp -P "$SFTP_PORT" -i "$SFTP_KEY" -b "$TEMP_SFTP_BATCH_FILE" "$SFTP_USER@$SFTP_HOST" 2>&1)
    SFTP_EXIT_CODE=$?
    
    SFTP_OUTPUT_ALL+="$SFTP_OUTPUT"$'\n'
    
    rm -f "$TEMP_SFTP_BATCH_FILE"
    
    if [ $SFTP_EXIT_CODE -eq 0 ]; then
        UPLOADED_COUNT=$((UPLOADED_COUNT + 1))
        log "업로드 성공: $file"
    else
        UPLOAD_FAILED=1
        log "업로드 실패: $file (exit code: $SFTP_EXIT_CODE)"
        log "SFTP 출력: $SFTP_OUTPUT"
    fi
done < "$TEMP_SFTP_CMDS_FILE"

rm -f "$TEMP_SFTP_CMDS_FILE"

# 원래 디렉토리로 복원
cd "$ORIGINAL_DIR" || true

if [ $UPLOAD_FAILED -eq 0 ] && [ $UPLOADED_COUNT -eq $FILE_COUNT ]; then
    log "SFTP 업로드 성공"
    log "SFTP 출력: $SFTP_OUTPUT_ALL"
    success_exit "모든 파일이 성공적으로 업로드되었습니다 (timestamp: $TIMESTAMP, 파일 수: $UPLOADED_COUNT)"
else
    log "SFTP 출력: $SFTP_OUTPUT_ALL"
    error_exit "SFTP 업로드 실패 (성공: $UPLOADED_COUNT/$FILE_COUNT)"
fi
