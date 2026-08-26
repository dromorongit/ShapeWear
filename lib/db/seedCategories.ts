import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import { connectDb } from './connect'
import Category from './models/Category'

const CATEGORIES = [
  'Corset',
  'Bra',
  'Skims Bodysuits',
  'Padded Shapers',
  'Faja',
  'Silicon Shapers',
  'Travel Sets',
  'General Fashion Clothing',
]

async function seedCategories() {
  await connectDb()

  for (const name of CATEGORIES) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    await Category.findOneAndUpdate(
      { name },
      { name, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  }

  console.log(`Upserted ${CATEGORIES.length} categories`)
  await mongoose.disconnect()
}

seedCategories().catch((err) => {
  console.error('Category seed failed:', err)
  process.exit(1)
})
