import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import { generateReferralCode } from '@/lib/affiliate'

export async function POST(request: Request) {
  try {
    await connectDb()

    const body = (await request.json()) as {
      name?: string
      email?: string
      password?: string
    }

    const { name, email, password } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email.trim())) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existing = await Affiliate.findOne({ email: normalizedEmail }).lean().exec()
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    let referralCode = generateReferralCode(name.trim())
    let attempts = 0

    while (attempts < 5) {
      const duplicate = await Affiliate.findOne({ referralCode }).lean().exec()
      if (!duplicate) break
      referralCode = generateReferralCode(name.trim())
      attempts++
    }

    if (attempts >= 5) {
      return NextResponse.json(
        { error: 'Could not generate a unique referral code. Please try again.' },
        { status: 500 }
      )
    }

    await Affiliate.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      referralCode,
      status: 'pending',
    })

    return NextResponse.json(
      {
        success: true,
        message:
          'Thanks for registering! Your account is pending approval. You will be able to log in and access your referral link once approved.',
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
