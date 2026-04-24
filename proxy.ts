import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require auth
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/periksa')

  if (!isPublicRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*', '/periksa/:path*'],
}
