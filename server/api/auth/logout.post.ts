import { H3Event } from 'h3'
import { defineEventHandler } from '#imports'

export default defineEventHandler(async (event: H3Event) => {
  await clearUserSession(event)
  
  return {
    success: true
  }
})
