import { connectDb } from '@/lib/db/connect'
import SiteSettings from '@/lib/db/models/SiteSettings'
import type { ISiteSettings } from '@/lib/db/models/SiteSettings'

export interface SiteSettingsData {
  isMaintenanceMode: boolean
  maintenanceMessage: string
  maintenanceEstimatedReturn: Date | null
  createdAt: Date
  updatedAt: Date
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  isMaintenanceMode: false,
  maintenanceMessage: "We're currently making some updates. Please check back shortly.",
  maintenanceEstimatedReturn: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  await connectDb()
  const doc = (await SiteSettings.findOne({ singletonKey: 'site-settings-singleton' })
    .lean()
    .exec()) as unknown as (ISiteSettings & { _id: { toString(): string } }) | null

  if (!doc) {
    return { ...DEFAULT_SETTINGS }
  }

  return {
    isMaintenanceMode: doc.isMaintenanceMode ?? false,
    maintenanceMessage: doc.maintenanceMessage ?? DEFAULT_SETTINGS.maintenanceMessage,
    maintenanceEstimatedReturn: doc.maintenanceEstimatedReturn ?? null,
    createdAt: doc.createdAt ?? new Date(),
    updatedAt: doc.updatedAt ?? new Date(),
  }
}
