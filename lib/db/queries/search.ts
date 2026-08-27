import { Types } from 'mongoose'
import { connectDb } from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import type { IProductVariant, StockStatus } from '@/lib/db/models/Product'

export interface ProductCardData {
  id: string
  slug: string
  name: string
  mainImage: string
  price: number
  salePrice: number | null
  stockStatus: StockStatus
  variants: IProductVariant[]
  averageRating: number
  reviewCount: number
}

interface RawProductCard {
  _id: Types.ObjectId
  slug: string
  name: string
  mainImage: string
  price: number
  salePrice: number | null
  stockStatus: StockStatus
  variants: IProductVariant[]
  averageRating: number
  reviewCount: number
}

const CARD_PROJECTION = 'slug name mainImage price salePrice stockStatus variants averageRating reviewCount'

function toProductCard(doc: RawProductCard): ProductCardData {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    mainImage: doc.mainImage,
    price: doc.price,
    salePrice: doc.salePrice,
    stockStatus: doc.stockStatus,
    variants: doc.variants,
    averageRating: doc.averageRating,
    reviewCount: doc.reviewCount,
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function searchProducts(query: string, limit = 20): Promise<ProductCardData[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  await connectDb()

  // Case-insensitive regex match across name, category, and tags.
  // NOTE: For a small catalog this is sufficient. Once the catalog grows,
  // replace with a MongoDB $text index (see Product model) for relevance-ranked search.
  const safe = escapeRegex(trimmed)
  const pattern = new RegExp(safe, 'i')
  const filter = {
    isActive: true,
    $or: [{ name: pattern }, { category: pattern }, { tags: pattern }],
  }

  const docs = (await Product.find(filter)
    .lean()
    .select(CARD_PROJECTION)
    .limit(limit)
    .exec()) as unknown as RawProductCard[]

  return docs.map(toProductCard)
}
