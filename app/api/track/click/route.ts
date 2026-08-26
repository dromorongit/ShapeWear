import { NextResponse } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'

export async function POST(request: Request) {
  try {
    await connectDb()

    const body = (await request.json()) as { code?: string }

    const { code } = body

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    const trimmedCode = code.trim()

    const cookieName = `sc_click_counted_${trimmedCode}`
    const existingCookie = request.headers.get('cookie')?.includes(`${cookieName}=`)

    if (existingCookie) {
      return NextResponse.json({ success: true, counted: false })
    }

    const affiliate = await Affiliate.findOne({
      referralCode: trimmedCode,
      status: 'approved',
    }).lean().exec()

    if (!affiliate) {
      return NextResponse.json({ success: true, counted: false })
    }

    await Affiliate.findOneAndUpdate(
      { referralCode: trimmedCode },
      { $inc: { totalClicks: 1 } }
    ).exec()

    const response = NextResponse.json({ success: true, counted: true })
    response.cookies.set(cookieName, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}
