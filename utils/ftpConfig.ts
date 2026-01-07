/**
 * FTP 설정
 * 이 파일은 .gitignore에 포함되어 있어 로컬에서 생성해야 합니다.
 * 환경 변수에서 값을 가져옵니다.
 */

export const ftpConfig = {
  host: process.env.FTP_HOST || 'localhost',
  username: process.env.FTP_ID || process.env.FTP_USERNAME || '',
  password: process.env.FTP_PASSWORD || '',
  secure: process.env.FTP_SECURE === 'true' || false,
  baseUrl: process.env.FTP_BASE_URL || (process.env.FTP_HOST ? `https://${process.env.FTP_HOST}` : 'https://example.com')
}

