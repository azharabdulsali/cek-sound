import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require auth
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)
  const isDashboardRoute = pathname.startsWith('/dashboard')

  // We can't reliably check Supabase sessions in proxy
  // because Supabase stores tokens client-side (localStorage).
  // Route protection is handled on the client side (dashboard page).
  // Here we just pass through all requests.

  if (!isPublicRoute && !isDashboardRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*'],
}
