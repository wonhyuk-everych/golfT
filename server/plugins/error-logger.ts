import { defineNitroPlugin } from '#imports'
import type { H3Event } from 'h3'
import type { NitroRuntimeHooks } from 'nitropack'

import { logError } from '~/server/utils/logger'

type RequestMeta = {
  method?: string
  url?: string | null
  userAgent?: string
  ip?: string | null
}

const buildRequestMeta = (event: H3Event): RequestMeta => {
  const req = event.node.req

  return {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: (req.headers['x-forwarded-for'] as string | undefined) || req.socket?.remoteAddress || null
  }
}

type ErrorHook = NonNullable<NitroRuntimeHooks['error']>

export default defineNitroPlugin((nitroApp) => {
  if (process.env.NODE_ENV === 'production') {
    const originalConsoleError = console.error.bind(console)
    console.error = (...args: unknown[]) => {
      const [first, ...rest] = args
      if (first instanceof Error) {
        logError(first, rest)
      } else if (rest.length > 0) {
        logError(first, rest)
      } else {
        logError(first)
      }

      originalConsoleError(...args)
    }
  }

  nitroApp.hooks.hook('error', ((error: unknown, context) => {
    if (context?.event) {
      logError(error, buildRequestMeta(context.event))
    } else {
      logError(error)
    }
  }) as ErrorHook)
})
