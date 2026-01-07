declare module '#app' {
  interface PageMeta {
    middleware?: string | string[]
  }
}

// Nuxt auto-imports
declare const definePageMeta: (meta: { middleware?: string | string[] }) => void
declare const navigateTo: (path: string) => void
declare const useCookie: (name: string) => any
declare const defineNuxtRouteMiddleware: (middleware: (to: any) => any) => any

export {}
