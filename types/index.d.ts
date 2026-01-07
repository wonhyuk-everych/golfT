/// <reference types="@nuxt/types" />

declare module '#app' {
  interface PageMeta {
    auth?: boolean
    middleware?: string | string[]
  }

  interface NuxtApp {
    $channel: typeof import('@channel.io/channel-web-sdk-loader')
  }
}

// Nuxt runtime config
declare module '@nuxt/schema' {
  interface RuntimeConfig {
    apiSecret: string
    public: {
      apiBase: string
      tossPaymentsClientKey: string
      channelPluginKey: string
    }
  }
}

// Extend route middleware
declare module 'nuxt/app' {
  interface MiddlewareDefinition {
    auth: typeof import('../middleware/auth')['default']
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $channel: typeof import('@channel.io/channel-web-sdk-loader')
  }
}
