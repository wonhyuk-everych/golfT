# Google Feeds 업로드 Cron 설정

## 스크립트 위치
`scripts/upload-google-feeds.sh`

## Cron 설정 방법

### 1. Crontab 편집
```bash
crontab -e
```

### 2. Cron 작업 추가
매일 새벽 2시에 실행 (예시):
```bash
0 2 * * * /home/ubuntu/apl_golf/scripts/upload-google-feeds.sh
```

매일 오전 9시에 실행:
```bash
0 9 * * * /home/ubuntu/apl_golf/scripts/upload-google-feeds.sh
```

**참고**: 스크립트는 자체적으로 로그 파일을 생성하므로 (`scripts/uploadResult_*.log`), cron 출력 리다이렉션은 선택사항입니다. 필요시 추가 로그를 위해 다음과 같이 설정할 수 있습니다:
```bash
0 2 * * * /home/ubuntu/apl_golf/scripts/upload-google-feeds.sh >> /home/ubuntu/google_feeds_cron.log 2>&1
```

### 3. Cron 문법 설명
```
* * * * * 명령어
│ │ │ │ │
│ │ │ │ └─ 요일 (0-7, 0과 7은 일요일)
│ │ │ └─── 월 (1-12)
│ │ └───── 일 (1-31)
│ └─────── 시 (0-23)
└───────── 분 (0-59)
```

## 필수 사전 준비

1. **SFTP 키 파일 위치 확인**
   - 기본 경로: `$HOME/google_feeds/google_actions_center`
   - 다른 경로 사용 시 `scripts/config.sh` 파일의 `SFTP_KEY` 변수 수정

2. **SFTP 키 파일 권한 설정**
   ```bash
   chmod 600 ~/google_feeds/google_actions_center
   ```

3. **스크립트 실행 권한 확인**
   ```bash
   chmod +x scripts/upload-google-feeds.sh
   ```

4. **로그 디렉토리 확인**
   - 로그 파일: `$HOME/google_feeds/uploadResult_YYYYMMDD_HHMMSS.log`
   - 이전 로그는 `$HOME/google_feeds/old_logs/` 디렉토리로 자동 이동됨

## 수동 실행 테스트

```bash
# 스크립트 직접 실행
./scripts/upload-google-feeds.sh

# 또는 심볼릭 링크로 실행 (google_feeds 디렉토리에서)
cd ~/google_feeds
ln -s /path/to/project/scripts/upload-google-feeds.sh upload-google-feeds.sh
./upload-google-feeds.sh

# 최신 로그 확인
ls -lt ~/google_feeds/uploadResult_*.log | head -1 | awk '{print $NF}' | xargs tail -f

# 또는 특정 로그 파일 확인
tail -f ~/google_feeds/uploadResult_20260112_140000.log
```

## 환경 변수 커스터마이징

`scripts/config.sh` 파일을 수정하여 설정 변경 가능:
- `ENV`: 환경 설정 (`dev` 또는 `production`)
- `API_URL`: API 엔드포인트 URL (기본: `https://localhost:3000/api/google-feeds/generate`)
- `FEEDS_DIR`: Google Feeds 파일 디렉토리 (기본: `$HOME/google_feeds`)
- `SFTP_HOST`: SFTP 호스트 (기본: `partnerupload.google.com`)
- `SFTP_PORT`: SFTP 포트 (기본: `19321`)
- `SFTP_USER`: SFTP 사용자 (환경에 따라 자동 설정: `dev` → `feeds-3d3zhz`, `production` → `feeds-fv51a7`)
- `SFTP_KEY`: SFTP 키 파일 경로 (기본: `$HOME/google_feeds/google_actions_center`)

**참고**: `scripts/config.sh` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
