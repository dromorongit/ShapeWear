import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAffiliatePayout extends Document {
  affiliateId: mongoose.Types.ObjectId
  amount: number
  note?: string
  paidAt: Date
  createdAt: Date
  updatedAt: Date
}

const AffiliatePayoutSchema = new Schema<IAffiliatePayout>(
  {
    affiliateId: {
      type: Schema.Types.ObjectId,
      ref: 'Affiliate',
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true, default: '' },
    paidAt: { type: Date, required: true },
  },
  { timestamps: true }
)

const AffiliatePayout: Model<IAffiliatePayout> =
  mongoose.models.AffiliatePayout ||
  mongoose.model<IAffiliatePayout>('AffiliatePayout', AffiliatePayoutSchema)

export default AffiliatePayout
