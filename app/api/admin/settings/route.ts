import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import SiteSettings from '@/lib/db/models/SiteSettings'
import { getSiteSettings } from '@/lib/db/queries/settings'
import { requireAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const settings = await getSiteSettings()
  return NextResponse.json(settings)
}

interface PatchBody {
  isMaintenanceMode?: boolean
  maintenanceMessage?: string
  maintenanceEstimatedReturn?: string | null
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const body = (await request.json()) as PatchBody

  const update: Record<string, unknown> = {}

  if (typeof body.isMaintenanceMode === 'boolean') {
    update.isMaintenanceMode = body.isMaintenanceMode
  }

  if (typeof body.maintenanceMessage === 'string') {
    update.maintenanceMessage = body.maintenanceMessage.trim()
  }

  if ('maintenanceEstimatedReturn' in body) {
    if (body.maintenanceEstimatedReturn === null || body.maintenanceEstimatedReturn === undefined) {
      update.maintenanceEstimatedReturn = null
    } else if (body.maintenanceEstimatedReturn !== '') {
      const parsed = new Date(body.maintenanceEstimatedReturn)
      if (!isNaN(parsed.getTime())) {
        update.maintenanceEstimatedReturn = parsed
      }
    }
  }

  await connectDb()

  await SiteSettings.findOneAndUpdate(
    { singletonKey: 'site-settings-singleton' },
    { $set: update },
    { new: true, upsert: true, timestamps: true }
  ).exec()

  revalidatePath('/', 'layout')

  const settings = await getSiteSettings()
  return NextResponse.json(settings)
}
