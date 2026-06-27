import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = publicPaths.some(p => pathname.startsWith(p))
  const authCookie = request.cookies.get('decisionos-auth')

  // Platform admin bypasses tenant auth
  if (pathname.startsWith('/platform')) {
    return NextResponse.next()
  }

  if (!isPublic && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (isPublic && authCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] }
