import { NextResponse } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import { checkRateLimit, recordRequest, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = getClientIp(request)

  if (checkRateLimit(`track:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

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

    recordRequest(`track:${ip}`)
    return NextResponse.json({ success: true, counted: true })
  } catch {
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}
