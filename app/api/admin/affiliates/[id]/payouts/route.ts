import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import AffiliatePayout from '@/lib/db/models/AffiliatePayout'
import { requireAdmin } from '@/lib/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()

  const payouts = await AffiliatePayout.find({ affiliateId: params.id })
    .lean()
    .sort({ paidAt: -1 })
    .exec()

  return NextResponse.json(
    payouts.map((p) => ({
      ...p,
      id: p._id.toString(),
      affiliateId: p.affiliateId.toString(),
    }))
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()

  const affiliate = await Affiliate.findById(params.id).lean().exec()

  if (!affiliate) {
    return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
  }

  const body = await request.json()
  const amount = Number(body.amount)
  const note = typeof body.note === 'string' ? body.note.trim() : ''

  if (Number.isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
  }

  const payout = await AffiliatePayout.create({
    affiliateId: params.id,
    amount,
    note: note || '',
    paidAt: new Date(),
  })

  await Affiliate.findOneAndUpdate(
    { _id: params.id },
    { $inc: { totalCommissionPaid: amount } }
  ).exec()

  return NextResponse.json({
    ...payout.toObject(),
    id: payout._id.toString(),
    affiliateId: payout.affiliateId.toString(),
  })
}
