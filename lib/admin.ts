import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, AUTH_COOKIE } from './auth'

export async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await verifyAdminToken(token)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE)?.value
    if (!token) return false
    await verifyAdminToken(token)
    return true
  } catch {
    return false
  }
}
