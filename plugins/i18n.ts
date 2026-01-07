import { defineNuxtPlugin } from '#app'
import { createI18n } from 'vue-i18n'
import en from '../locales/en/index.json'
import ko from '../locales/ko/index.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'ko',
    messages: {
      en,
      ko
    }
  })

  vueApp.use(i18n)
})
