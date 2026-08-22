import { Types } from 'mongoose'
import { connectDb } from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import type { IProductVariant, StockStatus } from '@/lib/db/models/Product'
import type { MockProduct } from '@/lib/mockProducts'

export interface ProductCardData {
  id: string
  slug: string
  name: string
  mainImage: string
  price: number
  salePrice: number | null
  stockStatus: StockStatus
  variants: IProductVariant[]
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
}

interface RawProductSlug {
  _id: Types.ObjectId
  slug: string
}

interface RawProductFull {
  _id: Types.ObjectId
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  salePrice: number | null
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
  createdAt: Date
  updatedAt: Date
}

const CARD_PROJECTION = 'slug name mainImage price salePrice stockStatus variants'

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
  }
}

function toProduct(doc: RawProductFull): MockProduct {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    description: doc.description,
    shortDescription: doc.shortDescription,
    price: doc.price,
    salePrice: doc.salePrice,
    mainImage: doc.mainImage,
    additionalImages: doc.additionalImages,
    category: doc.category,
    shapes: doc.shapes,
    sizes: doc.sizes,
    variants: doc.variants,
    stockStatus: doc.stockStatus,
    isFeatured: doc.isFeatured,
    isActive: doc.isActive,
    tags: doc.tags,
  }
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  await connectDb()
  const docs = (await Product.find({ isActive: true, isFeatured: true })
    .lean()
    .select(CARD_PROJECTION)
    .limit(limit)
    .exec()) as unknown as RawProductCard[]
  return docs.map(toProductCard)
}

export async function getAllActiveProducts(): Promise<ProductCardData[]> {
  await connectDb()
  const docs = (await Product.find({ isActive: true })
    .lean()
    .select(CARD_PROJECTION)
    .exec()) as unknown as RawProductCard[]
  return docs.map(toProductCard)
}

export async function getProductBySlug(slug: string): Promise<MockProduct | null> {
  await connectDb()
  const doc = (await Product.findOne({ slug, isActive: true })
    .lean()
    .exec()) as unknown as RawProductFull | null
  return doc ? toProduct(doc) : null
}

export async function getRelatedProducts(
  category: string,
  excludeSlug: string,
  limit = 4
): Promise<ProductCardData[]> {
  await connectDb()
  const docs = (await Product.find({ category, isActive: true, slug: { $ne: excludeSlug } })
    .lean()
    .select(CARD_PROJECTION)
    .limit(limit)
    .exec()) as unknown as RawProductCard[]
  return docs.map(toProductCard)
}

export async function getProductSlugs(): Promise<string[]> {
  await connectDb()
  const docs = (await Product.find({ isActive: true })
    .lean()
    .select('slug')
    .exec()) as unknown as RawProductSlug[]
  return docs.map((doc) => doc.slug)
}

export async function getProductsByCategory(category: string): Promise<ProductCardData[]> {
  await connectDb()
  const docs = (await Product.find({ category, isActive: true })
    .lean()
    .select(CARD_PROJECTION)
    .exec()) as unknown as RawProductCard[]
  return docs.map(toProductCard)
}
