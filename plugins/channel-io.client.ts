// Channel.io plugin (client-only)
import { defineNuxtPlugin, useRuntimeConfig, useCookie, useRouter, onNuxtReady } from '#imports'
import * as ChannelService from '@channel.io/channel-web-sdk-loader'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  const config = useRuntimeConfig()
  const pluginKey = config.public.channelPluginKey as string | undefined

  // Provide ChannelService for global access: `useNuxtApp().$channel`
  nuxtApp.provide('channel', ChannelService)

  // If no plugin key, do nothing (avoid throwing on dev/stage without key)
  if (!pluginKey) {
    if (import.meta.dev) {
      console.warn('[ChannelTalk] Missing public.channelPluginKey. Skipping boot.')
    }
    return
  }

  const router = useRouter()

  // Get language from i18n cookie (cookie name is 'i18n_redirected')
  const langCookie = useCookie<string>('i18n_redirected')
  // Be defensive with access to .value to satisfy strict types
  const cookieLang = (langCookie as unknown as { value?: string }).value
  const lang = (cookieLang || (navigator.language?.startsWith('ko') ? 'ko' : 'en')) as 'ko' | 'en'

  // Guard to boot only once
  const w = window as unknown as { __channelBooted?: boolean }

  const boot = async () => {
    if (w.__channelBooted) return
    try {
      await ChannelService.loadScript()
      ChannelService.boot({
        pluginKey,
        // Channel supports locale via 'language' option: 'en' | 'ko'
        language: lang
      })
      w.__channelBooted = true
    } catch (e) {
      console.error('[ChannelTalk] Failed to load/boot:', e)
    }
  }

  // Boot when app is ready on client
  onNuxtReady(() => {
    void boot()

    // SPA page tracking (recommended by docs for SPA)
    router.afterEach(() => {
      try {
        // setPage helps workflows/marketing attribution between virtual pages
        // Call only if booted
        const svc = ChannelService as unknown as { setPage?: () => void }
        if ((w.__channelBooted === true) && typeof svc.setPage === 'function') {
          svc.setPage()
        }
      } catch {
        // ignore
      }
    })
  })
})
