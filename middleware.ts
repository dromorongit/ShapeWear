import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminToken, AUTH_COOKIE } from './lib/auth'
import { verifyAffiliateToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  let response = NextResponse.next()

  const ref = request.nextUrl.searchParams.get('ref')
  if (ref) {
    response.cookies.set('sc_ref', ref, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })
  }

  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  const isLoginPage = pathname === '/admin/login'
  const isLoginApi = pathname === '/api/admin/auth/login'
  const isRegisterApi = pathname === '/api/admin/auth/register'

  if (isAdminPage || isAdminApi) {
    if (isLoginPage || isLoginApi || isRegisterApi) {
      return response
    }

    const token = request.cookies.get(AUTH_COOKIE)?.value

    if (!token) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      verifyAdminToken(token)
      return response
    } catch {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  const isAffiliatePage = pathname.startsWith('/affiliate')
  const isAffiliateApi = pathname.startsWith('/api/affiliate')

  if (isAffiliatePage || isAffiliateApi) {
    const isAffiliateLoginPage = pathname === '/affiliate/login'
    const isAffiliateRegisterPage = pathname === '/affiliate/register'
    const isAffiliateLoginApi = pathname === '/api/affiliate/auth/login'
    const isAffiliateRegisterApi = pathname === '/api/affiliate/auth/register'

    if (
      isAffiliateLoginPage ||
      isAffiliateRegisterPage ||
      isAffiliateLoginApi ||
      isAffiliateRegisterApi
    ) {
      return response
    }

    const token = request.cookies.get('affiliate_session')?.value

    if (!token) {
      if (isAffiliateApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/affiliate/login', request.url))
    }

    try {
      await verifyAffiliateToken(token)
      return response
    } catch {
      if (isAffiliateApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/affiliate/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
