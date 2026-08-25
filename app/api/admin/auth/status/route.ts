import { NextResponse } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Admin from '@/lib/db/models/Admin'

export async function GET() {
  try {
    await connectDb()
    const count = await Admin.countDocuments().exec()
    return NextResponse.json({ adminExists: count > 0 })
  } catch {
    return NextResponse.json({ adminExists: false })
  }
}
