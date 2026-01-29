# Google Feeds 업로드 Cron 설정

## 사전 준비

```bash
# SFTP 키 파일 권한 설정
chmod 600 ~/google_feeds/google_actions_center

# 스크립트 실행 권한 설정
chmod +x scripts/upload-google-feeds.sh

# config.sh 파일 생성 및 설정
cp scripts/config.sh.example scripts/config.sh  # 필요시
vim scripts/config.sh
```

## Cron 설정

```bash
# crontab 편집 (ubuntu 사용자로 실행 - sudo 사용 시 HOME 경로가 /root로 설정되어 문제 발생)
crontab -e

# 매일 새벽 2시 실행
0 2 * * * /home/ubuntu/apl_golf/scripts/upload-google-feeds.sh

# 매일 오전 9시 실행
0 9 * * * /home/ubuntu/apl_golf/scripts/upload-google-feeds.sh

# 설정 확인
crontab -l

# 참고: crontab 저장 후 cron이 자동으로 변경사항을 감지하므로 재시작 불필요
# 주의: sudo crontab -e를 사용하면 HOME 경로가 /root로 설정되어 config.sh의 $HOME/google_feeds 경로가 잘못됩니다
```

## 수동 실행 및 로그 확인

```bash
# 실행
./scripts/upload-google-feeds.sh

# 최신 로그 확인
ls -lt ~/google_feeds/uploadResult_*.log | head -1 | awk '{print $NF}' | xargs tail -f
```

## 주요 변경사항

- **source 실행 호환성**: `source`로 실행해도 정상 동작하도록 수정 (`BASH_SOURCE` 사용)
- **SFTP 메시지 크기 제한 해결**: OpenSSH 버전 차이로 인한 SFTP 프로토콜 메시지 크기 제한(256KB) 문제 해결
  - **원인**: Ubuntu OpenSSH 8.9p1은 배치 모드에서 메시지 크기 제한을 엄격하게 적용
  - **해결**: 파일을 50개 단위로 분할 처리 (`generate.ts`)
  - **해결**: 각 파일을 개별 SFTP 세션으로 업로드 (`upload-google-feeds.sh`)
- **파일 분할**: Google Feeds 파일이 50개 이상일 경우 자동으로 `_0001`, `_0002`, `_0003` 형식으로 분할

## 설정 파일

`scripts/config.sh`에서 다음 설정 가능:
- `ENV`: `dev` 또는 `production`
- `API_URL`: API 엔드포인트
- `FEEDS_DIR`: 파일 저장 디렉토리 (기본: `$HOME/google_feeds`)
- `SFTP_HOST`, `SFTP_PORT`, `SFTP_USER`, `SFTP_KEY`: SFTP 연결 정보
