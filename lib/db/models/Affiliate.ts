import mongoose, { Schema, Document, Model } from 'mongoose'

export type AffiliateStatus = 'pending' | 'approved' | 'rejected'

export interface IAffiliate extends Document {
  name: string
  email: string
  passwordHash: string
  referralCode: string
  status: AffiliateStatus
  commissionRate: number
  totalClicks: number
  totalSales: number
  totalCommissionEarned: number
  totalCommissionPaid: number
  createdAt: Date
  updatedAt: Date
}

const AffiliateSchema = new Schema<IAffiliate>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    referralCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    commissionRate: { type: Number, default: 10, min: 0 },
    totalClicks: { type: Number, default: 0, min: 0 },
    totalSales: { type: Number, default: 0, min: 0 },
    totalCommissionEarned: { type: Number, default: 0, min: 0 },
    totalCommissionPaid: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

const Affiliate: Model<IAffiliate> =
  mongoose.models.Affiliate || mongoose.model<IAffiliate>('Affiliate', AffiliateSchema)

export default Affiliate
