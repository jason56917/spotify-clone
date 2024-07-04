import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// 所有路由預設都是公開的，需要自行設定要保護的路由
const isProtectedRoute = createRouteMatcher([
  '/liked(.*)'
  // '/dashboard(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth()
      .protect()

    return NextResponse.next()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}