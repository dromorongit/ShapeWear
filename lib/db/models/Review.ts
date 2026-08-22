import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId
  reviewerName: string
  reviewerEmail?: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    reviewerName: { type: String, required: true, trim: true },
    reviewerEmail: { type: String, trim: true, lowercase: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
)

ReviewSchema.index({ productId: 1, status: 1 })

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)

export default Review
