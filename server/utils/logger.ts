import fs from 'node:fs'
import path from 'node:path'

import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import type TransportStream from 'winston-transport'

const isProduction = process.env.NODE_ENV === 'production'
const logDir = process.env.LOG_DIR || path.resolve(process.cwd(), 'logs')

if (isProduction && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const transports: TransportStream[] = []

if (isProduction) {
  transports.push(
    new DailyRotateFile({
      level: 'error',
      dirname: logDir,
      filename: 'app-error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  )
}

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports
})

const serializeError = (value: unknown): unknown => {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    }
  }

  if (Array.isArray(value)) {
    return value.map(serializeError)
  }

  if (value && typeof value === 'object') {
    return value
  }

  return { value }
}

export const logError = (message: unknown, meta?: unknown) => {
  if (!isProduction) {
    return
  }

  const normalizedMessage = typeof message === 'string'
    ? message
    : message instanceof Error
      ? message.message
      : 'Application error'

  const payload = meta ? serializeError(meta) : message instanceof Error ? serializeError(message) : undefined

  logger.error(normalizedMessage, payload as Record<string, unknown> | undefined)
}

export default logger
