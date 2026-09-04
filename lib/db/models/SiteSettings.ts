import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISiteSettings extends Document {
  singletonKey: string
  isMaintenanceMode: boolean
  maintenanceMessage: string
  maintenanceEstimatedReturn?: Date | null
  createdAt: Date
  updatedAt: Date
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    singletonKey: { type: String, required: true, unique: true, default: 'site-settings-singleton' },
    isMaintenanceMode: { type: Boolean, required: true, default: false },
    maintenanceMessage: {
      type: String,
      required: true,
      default: "We're currently making some updates. Please check back shortly.",
    },
    maintenanceEstimatedReturn: { type: Date, default: null },
  },
  { timestamps: true }
)

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema)

export default SiteSettings
