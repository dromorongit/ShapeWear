import { SignJWT, jwtVerify } from 'jose'

export const AUTH_COOKIE = 'admin_session'
export const AFFILIATE_JWT_COOKIE = 'affiliate_session'

const getAdminSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function signAdminToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getAdminSecret())
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, getAdminSecret())
  return payload as { role: string }
}

export function getAuthCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 8 * 60 * 60,
  }
}

const getAffiliateSecret = () => {
  const secret = process.env.AFFILIATE_JWT_SECRET
  if (!secret) throw new Error('AFFILIATE_JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function signAffiliateToken(payload: { affiliateId: string }) {
  return new SignJWT({ ...payload, role: 'affiliate' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getAffiliateSecret())
}

export async function verifyAffiliateToken(token: string) {
  const { payload } = await jwtVerify(token, getAffiliateSecret())
  return payload as { affiliateId: string; role: string }
}

export function getAffiliateCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  }
}
