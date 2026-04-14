import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl
 
  // 1. PUBLIC PATHS (No Auth Required)
  const isPublicPath = [
    '/',
    '/login',
    '/signup',
    '/dashboard', // Allow guests to see the tool grid
    '/ai-hub/lead-scraper', // Basic Scrape tool (Public)
    '/seo/keyword-lab',     // Basic Research tool (Public)
    '/seo/serp-analyzer'    // Basic SEO tool (Public)
  ].some(path => pathname === path || (path !== '/' && pathname.startsWith(path)))
 
  if (isPublicPath || pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return NextResponse.next()
  }
 
  // 2. PROTECTED PATHS (Pro/Auth Required)
  // Everything else in these clusters is gated
  const isProtectedPath = 
    pathname.startsWith('/missions') || 
    pathname.startsWith('/autopilot') || 
    pathname.startsWith('/agency') ||
    pathname.startsWith('/factory') ||
    pathname.startsWith('/marketplace') ||
    pathname.startsWith('/developers') ||
    pathname.startsWith('/settings')
 
  if (isProtectedPath) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
