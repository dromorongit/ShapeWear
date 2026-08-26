import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  productName: string
  slug: string
  mainImage: string
  shape: string
  size: string
  sku: string
  price: number
  quantity: number
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'fulfilled' | 'cancelled'

export interface IOrder extends Document {
  customerName: string
  phone: string
  email?: string
  deliveryAddress: string
  orderNote?: string
  items: IOrderItem[]
  subtotal: number
  status: OrderStatus
  paystackReference?: string
  paystackTransactionId?: string
  paystackAmount?: number
  paystackPaidAt?: Date
  affiliateId?: mongoose.Types.ObjectId
  referralCode?: string
  commissionRate?: number
  commissionAmount?: number
  commissionStatus?: 'none' | 'pending' | 'confirmed'
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    slug: { type: String, required: true },
    mainImage: { type: String, required: true },
    shape: { type: String, required: true },
    size: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    deliveryAddress: { type: String, required: true },
    orderNote: { type: String, trim: true, default: '' },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'fulfilled', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paystackReference: { type: String, unique: true, sparse: true, index: true },
    paystackTransactionId: { type: String },
    paystackAmount: { type: Number },
    paystackPaidAt: { type: Date },
    affiliateId: { type: Schema.Types.ObjectId, ref: 'Affiliate', index: true },
    referralCode: { type: String, index: true },
    commissionRate: { type: Number },
    commissionAmount: { type: Number },
    commissionStatus: {
      type: String,
      enum: ['none', 'pending', 'confirmed'],
      default: 'none',
    },
  },
  { timestamps: true }
)

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

export default Order
