import fs from 'fs'

export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    https: {
      key: fs.readFileSync('./certs/localhost+3-key.pem', 'utf8'),
      cert: fs.readFileSync('./certs/localhost+3.pem', 'utf8')
    },
    host: '0.0.0.0',
    port: 3000
  },
  
  server: {
    https: {
      key: fs.readFileSync('./certs/localhost+3-key.pem', 'utf8'),
      cert: fs.readFileSync('./certs/localhost+3.pem', 'utf8')
    },
    host: '0.0.0.0',
    port: 3000
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/_variables.scss" as *;'
        }
      }
    }
  },

  css: [
    '@/assets/styles/course-detail.scss'
  ],

  plugins: [
    {
      src: '~/plugins/v-calendar.ts',
      mode: 'client'
    },
    {
      src: '~/plugins/channel-io.client.ts',
      mode: 'client'
    }
  ],

  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils', '@nuxtjs/device', '@nuxt/eslint', '@nuxtjs/i18n'],

  eslint: {
    // options here
  },

  app: {
    head: {
      title: '골프 T',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  runtimeConfig: {
    tossPaymentsSecretKey: process.env.TOSS_SECRET_ID,
    public: {
      apiBase: '/api',
      tossPaymentsClientKey: process.env.TOSS_CLIENT_ID,
      channelPluginKey: process.env.CHANNEL_ID,
      oauth: {
        kakao: {
          clientId: process.env.KAKAO_CLIENT_ID,
          redirectUri: 'https://golft.co.kr/api/auth/kakao-callback'
        },
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          redirectUri: 'https://golft.co.kr/api/auth/google-callback'
        },
        naver: {
          clientId: process.env.NAVER_CLIENT_ID,
          redirectUri: 'https://golft.co.kr/api/auth/naver-callback'
        }
      }
    }
  },

  compatibilityDate: '2025-03-14',

  i18n: {
    vueI18n: './plugins/i18n.ts'
  },

  script:[
    {src: 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js'}
  ]
})
