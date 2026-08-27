// DESTRUCTIVE: This script deletes ALL documents from the Product and Review collections.
// It is intended to be run manually once when transitioning from test/mock data to real content.
// Do NOT run this automatically or as part of a build step.
// Category, Affiliate, AffiliatePayout, Order, and Admin collections are NOT touched.

import { connectDb } from './connect'
import Product from './models/Product'
import Review from './models/Review'

async function clearMockData() {
  await connectDb()

  const productResult = await Product.deleteMany({})
  const reviewResult = await Review.deleteMany({})

  console.log(`Cleared ${productResult.deletedCount} Product documents`)
  console.log(`Cleared ${reviewResult.deletedCount} Review documents`)
  console.log('Done. Category, Affiliate, AffiliatePayout, Order, and Admin collections were not affected.')
}

clearMockData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to clear mock data:', err)
    process.exit(1)
  })
