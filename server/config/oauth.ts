// 소셜 로그인 설정
export const oauthConfig = {
  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_SECRET_ID,
    redirectUri: 'https://golft.co.kr/api/auth/kakao-callback'
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_ID,
    redirectUri: 'https://golft.co.kr/api/auth/google-callback'
  },
  naver: { //TODO 본계정으로 바꿔야함
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_SECRET_ID,
    redirectUri: 'https://golft.co.kr/api/auth/naver-callback'
  }
}
