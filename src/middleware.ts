import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/users(.*)',
    '/public(.*)',
  ],

  async afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: ['/((?!.*\\..*|_next|favicon.ico).*)', '/', '/(api|trpc)(.*)'],
}
