import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { requireAdmin } from '@/lib/admin'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: 'shapewear-closet', quality: 'auto', fetch_format: 'auto' },
    process.env.CLOUDINARY_API_SECRET!
  )

  return NextResponse.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: 'shapewear-closet',
    quality: 'auto',
    fetchFormat: 'auto',
  })
}
