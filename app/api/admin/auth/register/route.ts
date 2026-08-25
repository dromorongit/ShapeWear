import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDb } from '@/lib/db/connect'
import Admin from '@/lib/db/models/Admin'
import { signAdminToken, getAuthCookieOptions, AUTH_COOKIE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDb()

    const body = (await request.json()) as {
      email?: string
      password?: string
    }

    const { email, password } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email.trim())) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    try {
      await Admin.create({
        email: email.trim().toLowerCase(),
        passwordHash,
        singletonKey: 'admin-singleton',
      })
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
        return NextResponse.json({ error: 'An admin account already exists' }, { status: 409 })
      }
      throw error
    }

    const token = await signAdminToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set(AUTH_COOKIE, token, getAuthCookieOptions())
    return response
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
