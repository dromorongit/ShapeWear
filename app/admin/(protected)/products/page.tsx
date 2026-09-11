import { connectDb } from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import ProductTableClient from './ProductTableClient'
import Button from '@/components/ui/Button'
import { getPagination } from '@/lib/pagination'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  await connectDb()
  const { page, limit, skip } = getPagination(await searchParams, { defaultLimit: 50, maxLimit: 200 })

  const [products, totalCount] = await Promise.all([
    Product.find({})
      .lean()
      .select(
        'slug name mainImage price salePrice stock stockStatus variants isActive isFeatured category tags'
      )
      .limit(limit)
      .skip(skip)
      .exec(),
    Product.countDocuments({}),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / limit))

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
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="font-body text-small text-ink/60">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/admin/products?page=${page - 1}`}
                className="font-body text-small text-pink hover:underline"
              >
                Previous
              </a>
            )}
            {page < totalPages && (
              <a
                href={`/admin/products?page=${page + 1}`}
                className="font-body text-small text-pink hover:underline"
              >
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
