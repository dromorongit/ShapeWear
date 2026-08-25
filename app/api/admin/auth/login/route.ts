import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDb } from '@/lib/db/connect'
import Admin from '@/lib/db/models/Admin'
import { signAdminToken, getAuthCookieOptions, AUTH_COOKIE } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await connectDb()

    const body = (await request.json()) as {
      email?: string
      password?: string
    }

    const { email, password } = body

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).lean().exec()

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, admin.passwordHash)

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
