import { H3Event, defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { username, password } = body

  // TODO: Replace with actual database authentication
  if (username === 'admin' && password === 'admin123') {

    await setUserSession(event, {
      user: {
        username,
        role: 'admin'
      }
    })
    
    return {
      success: true,
      user: {
        username,
        role: 'admin'
      }
    }
  }

  throw createError({
    statusCode: 401,
    message: '아이디 또는 비밀번호가 올바르지 않습니다.'
  })
})
