import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signAdminToken, getAuthCookieOptions, AUTH_COOKIE } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const passwordHash = process.env.ADMIN_PASSWORD_HASH

    if (!passwordHash) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const password = typeof body.password === 'string' ? body.password : ''
    const match = await bcrypt.compare(password, passwordHash)

    if (!match) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await signAdminToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set(AUTH_COOKIE, token, getAuthCookieOptions())
    return response
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
