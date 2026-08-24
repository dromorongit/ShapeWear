import { connectDb } from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import ProductTableClient from './ProductTableClient'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  await connectDb()
  const products = await Product.find({})
    .lean()
    .select(
      'slug name mainImage price salePrice stockStatus variants isActive isFeatured category tags'
    )
    .exec()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Products
          </h2>
          <p className="mt-1 font-body text-small text-ink/60">
            Manage your product catalog.
          </p>
        </div>
        <a href="/admin/products/new">
          <Button>Add Product</Button>
        </a>
      </div>
      <ProductTableClient products={products.map((p) => ({ ...p, id: p._id.toString() }))} />
    </div>
  )
}
