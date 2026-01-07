# APL Golf (Nuxt3)

## 프로젝트
- 골프장/도시형 골프 예약 및 코스/커뮤니티 등 사용자 기능과, 운영자(Admin) 관리 기능을 포함한 Nuxt3 기반 웹 애플리케이션입니다.
- 프론트(Nuxt/Vue)와 서버 API(Nitro, `server/api`)가 동일 프로젝트 내에 구성되어 있습니다.

## 기술 스택 / 언어
- Frontend: Nuxt 3, Vue 3, TypeScript, TailwindCSS, SCSS
- Backend: Nuxt Nitro(Server Routes), TypeScript
- Data: MySQL(`mysql2`), 일부 Admin 영역 Prisma 사용
- i18n: `locales/` 기반 다국어(ko/en)
- node 18.20.8

## 프로젝트 구조(요약)
- `pages/`: 라우팅 페이지(사용자/어드민)
- `components/`: 공통/도메인별 Vue 컴포넌트
- `composables/`: 컴포저블(인증/세션, API 호출 등)
- `server/api/`: 서버 API 라우트(Nitro)
- `server/middleware/`: 서버 미들웨어(보호 라우트 등)
- `middleware/`: Nuxt 라우트 미들웨어(클라이언트 라우팅 가드)
- `types/`: 프로젝트 타입 정의
- `utils/`: 포맷터/캐시/FTP 등 유틸
- `assets/`, `public/`: 정적 리소스(이미지/아이콘/스타일)

---
## 서버 접속 방법
서버는 gabia 클라우드 콘솔로 SSH pem 키를 통해 접속 가능 pem 키는 파일에 동봉
FTP, mysql 서버는 가비아 서비스 사용 아이디_비번 엑셀 파일에 접속 정보 기재

## 운영 로그 수집
- NODE_ENV=production 일 때만 오류 로그를 파일로 적재합니다.
- 기본 경로는 프로젝트 루트의 `logs/` 디렉토리이며 `LOG_DIR` 환경 변수로 변경할 수 있습니다.
- 로그 파일은 `app-error-YYYY-MM-DD.log` 형식으로 생성되며 최대 30일간 보관됩니다.
- 로그는 압축(`.gz`)되어 저장되며 개별 파일 크기는 20MB를 초과하면 회전됩니다.

## 라이브러리 설치
- 신규 라이브러리 추가할 경우 배포 전 라이브러리 설치가 필요 하다
```cli
npm install
npm audit fix
npm run build
```

### 서비스 구동
서비스 구동은 systemctl 로 service 로 정의함
```cli
sudo systemctl start apl-golf         # 서비스 시작 커맨드
sudo systemctl restart apl-golf       # 서비스 재시작 커맨드
sudo systemctl status apl-golf        # 서비스 상태 커맨드
sudo journalctl -u apl-golf -f        # 로그 팔로우
```
### 서비스 파일 위치
/etc/systemd/system/apl-golf.service

### 코드 위치
/home/ubuntu/apl_golf

### 로그 위치
/home/ubuntu/log

### 키값 정보
.env.production 파일에 키값들이 정의되어 있다.

---
## Nginx
HTTPS 를 위해 Nginx 를 사용

### nginx 구동
sudo systemctl restart nginx

### nginx 위치 
/etc/nginx

---
## HTTPS
HTTPS 는 무료 서비스인 Let`s Encrypt 서비스를 사용 한달에 한번씩 인증서 자동 갱신 필요
- crontab 으로 한달에 한번씩 인증서 자동 갱신 되고 있음

### https 발급 과정
1. sudo certbot --nginx -d golft.co.kr
2. 포트 80 이 접속이 되어야 한다 (gabia 보안그룹 80 오픈)

### https 인증서 확인
sudo certbot certificates 

### https 인증서 갱신
sudo certbot renew

### https 인증서 갱신 가능한지 확인하는 과정
sudo certbot renew --dry-run

### https 인증서 자동 갱신 설정
sudo crontab -e
0 3 1 * * /usr/bin/certbot renew --renew-hook="sudo service nginx restart"