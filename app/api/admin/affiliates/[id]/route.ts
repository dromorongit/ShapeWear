import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import { requireAdmin } from '@/lib/admin'

export async function GET(
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

  return NextResponse.json({
    ...affiliate,
    id: affiliate._id.toString(),
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()

  const body = await request.json()

  const update: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (body.status !== 'approved' && body.status !== 'rejected') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    update.status = body.status
  }

  if (body.commissionRate !== undefined) {
    const rate = Number(body.commissionRate)
    if (Number.isNaN(rate) || rate < 0 || rate > 100) {
      return NextResponse.json({ error: 'Commission rate must be between 0 and 100' }, { status: 400 })
    }
    update.commissionRate = rate
  }

  const affiliate = await Affiliate.findByIdAndUpdate(params.id, update, { new: true }).lean().exec()

  if (!affiliate) {
    return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...affiliate,
    id: affiliate._id.toString(),
  })
}
