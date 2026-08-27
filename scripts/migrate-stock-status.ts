import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import { connectDb } from '../lib/db/connect'
import Product from '../lib/db/models/Product'

async function migrate() {
  await connectDb()
  const products = await Product.find({}).lean().exec()

  let updated = 0
  for (const doc of products) {
    const totalStock = (Number(doc.stock) || 0) + doc.variants.reduce((sum: number, v: { stock: number }) => sum + (Number(v.stock) || 0), 0)
    const stockStatus = totalStock === 0 ? 'out-of-stock' : totalStock <= 5 ? 'low-stock' : 'in-stock'
    if (doc.stockStatus !== stockStatus) {
      await Product.findByIdAndUpdate(doc._id, { stockStatus })
      updated++
    }
  }

  console.log(`Migration complete. ${updated} of ${products.length} products updated.`)
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
