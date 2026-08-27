import mongoose, { Schema, Document, Model } from 'mongoose'

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export interface IProductVariant {
  shape: string
  size: string
  sku: string
  stock: number
}

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  salePrice: number | null
  stock: number
  mainImage: string
  additionalImages: string[]
  category: string
  shapes: string[]
  sizes: string[]
  variants: IProductVariant[]
  stockStatus: StockStatus
  isFeatured: boolean
  isActive: boolean
  tags: string[]
  averageRating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    shape: { type: String, required: true },
    size: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { _id: false }
)

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    mainImage: { type: String, required: true },
    additionalImages: { type: [String], default: [] },
    // Stored as plain string matching Category.name for simpler queries at this scale.
    category: { type: String, required: true, index: true },
    shapes: { type: [String], required: true },
    sizes: { type: [String], required: true },
    variants: { type: [ProductVariantSchema], default: [] },
    stockStatus: {
      type: String,
      enum: ['in-stock', 'low-stock', 'out-of-stock'],
      required: true,
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    tags: { type: [String], default: [] },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

ProductSchema.index({ isActive: 1, isFeatured: 1 })

ProductSchema.pre<IProduct>('save', function () {
  if (!this.isModified('variants')) return
  const totalStock = this.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
  if (totalStock === 0) {
    this.stockStatus = 'out-of-stock'
  } else if (totalStock <= 5) {
    this.stockStatus = 'low-stock'
  } else {
    this.stockStatus = 'in-stock'
  }
})

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product
