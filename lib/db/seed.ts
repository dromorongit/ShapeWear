import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import { connectDb } from './connect'
import Product from './models/Product'
import Review from './models/Review'
import { mockProducts } from '../mockProducts'
import { mockReviews } from '../mockReviews'

async function seed() {
  await connectDb()

  await Product.deleteMany({})
  await Review.deleteMany({})

  const insertedProducts = await Product.insertMany(
    mockProducts.map(({ id: _id, ...rest }) => rest)
  )

  const productIdMap = new Map<string, string>()
  mockProducts.forEach((p, index) => {
    productIdMap.set(p.id, insertedProducts[index]._id.toString())
  })

  const reviewDocs = mockReviews.map((r) => ({
    productId: productIdMap.get(r.productId)!,
    reviewerName: r.reviewerName,
    rating: r.rating,
    comment: r.comment,
    status: r.status,
  }))

  await Review.insertMany(reviewDocs)

  console.log('Seed completed successfully')
  console.log(`Inserted ${insertedProducts.length} products and ${reviewDocs.length} reviews`)

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
