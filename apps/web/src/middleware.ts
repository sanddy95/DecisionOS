import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authCookie = request.cookies.get('decisionos-auth')
  const platformCookie = request.cookies.get('decisionos-platform-auth')

  // Platform admin routes — separate auth
  if (pathname.startsWith('/platform')) {
    if (pathname === '/platform/login') {
      // Already authed as platform admin → go to platform dashboard
      if (platformCookie) return NextResponse.redirect(new URL('/platform', request.url))
      return NextResponse.next()
    }
    // All other /platform/* → require platform auth cookie
    if (!platformCookie) return NextResponse.redirect(new URL('/platform/login', request.url))
    return NextResponse.next()
  }

  // Tenant org dashboard routes
  const isPublic = publicPaths.some(p => pathname.startsWith(p))
  if (!isPublic && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (isPublic && authCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] }
