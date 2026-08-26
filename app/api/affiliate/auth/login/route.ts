import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import { signAffiliateToken, getAffiliateCookieOptions } from '@/lib/auth'

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

    const affiliate = await Affiliate.findOne({
      email: email.trim().toLowerCase(),
    }).lean().exec()

    if (!affiliate) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, affiliate.passwordHash)

    if (!match) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await signAffiliateToken({ affiliateId: affiliate._id.toString() })
    const response = NextResponse.json({ success: true })
    response.cookies.set('affiliate_session', token, getAffiliateCookieOptions())
    return response
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
