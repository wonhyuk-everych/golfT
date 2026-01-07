import { defineEventHandler, createError, getUserSession } from '#imports'

// Server-side guard for admin API endpoints
export default defineEventHandler(async (event) => {
  const path = event.path || ''

  // Only protect API endpoints under /api/admin
  if (!path.startsWith('/api/admin')) return

  // Allow health or public endpoints here if any (none for now)
  // if (path === '/api/admin/auth/some-public') return

  const session = await getUserSession(event)
  const role = session?.user?.role

  if (role !== 'A') {
    // 존재를 숨기기 위해 404로 응답
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found'
    })
  }
})
