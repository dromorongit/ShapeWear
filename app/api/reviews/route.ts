import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import mongoose from 'mongoose'
import { connectDb } from '@/lib/db/connect'
import Review from '@/lib/db/models/Review'
import Product from '@/lib/db/models/Product'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5

const submissionTimestamps = new Map<string, number[]>()

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = submissionTimestamps.get(ip) || []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  submissionTimestamps.set(ip, recent)
  return recent.length >= RATE_LIMIT_MAX
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
  }

  await connectDb()

  const body = (await request.json()) as {
    productId?: string
    reviewerName?: string
    reviewerEmail?: string
    rating?: number
    comment?: string
    status?: string
  }

  const { productId, reviewerName, reviewerEmail, rating, comment } = body

  if (!productId || typeof productId !== 'string') {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  const product = await Product.findOne({ _id: productId, isActive: true }).lean().exec()

  if (!product) {
    return NextResponse.json({ error: 'Product not found or no longer available' }, { status: 404 })
  }

  const trimmedName = typeof reviewerName === 'string' ? reviewerName.trim() : ''
  const trimmedComment = typeof comment === 'string' ? comment.trim() : ''

  if (!trimmedName) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  if (trimmedName.length > 100) {
    return NextResponse.json({ error: 'Name must be 100 characters or less' }, { status: 400 })
  }

  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Please select a rating' }, { status: 400 })
  }

  if (!trimmedComment) {
    return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
  }

  if (trimmedComment.length > 1000) {
    return NextResponse.json({ error: 'Comment must be 1000 characters or less' }, { status: 400 })
  }

  if (typeof reviewerEmail === 'string' && reviewerEmail.trim().length > 0) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(reviewerEmail.trim())) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
    }
  }

  await Review.create({
    productId: new mongoose.Types.ObjectId(productId),
    reviewerName: trimmedName,
    reviewerEmail: typeof reviewerEmail === 'string' && reviewerEmail.trim().length > 0 ? reviewerEmail.trim() : undefined,
    rating,
    comment: trimmedComment,
    status: 'pending',
  })

  const timestamps = submissionTimestamps.get(ip) || []
  timestamps.push(Date.now())
  submissionTimestamps.set(ip, timestamps)

  return NextResponse.json({ received: true }, { status: 201 })
}
