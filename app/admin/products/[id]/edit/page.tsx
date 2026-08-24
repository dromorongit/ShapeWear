import { notFound } from 'next/navigation'
import { connectDb } from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import ProductForm from '@/components/admin/ProductForm'
import type { ProductFormData } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function AdminEditProductPage({
  params,
}: {
  params: { id: string }
}) {
  await connectDb()
  const product = await Product.findById(params.id).lean().exec()

  if (!product) {
    notFound()
  }

  const initialData: ProductFormData = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: String(product.price),
    salePrice: product.salePrice ? String(product.salePrice) : '',
    category: product.category,
    tags: product.tags.join(', '),
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    variants: product.variants,
    mainImage: product.mainImage,
    additionalImages: product.additionalImages,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Edit Product
        </h2>
        <p className="mt-1 font-body text-small text-ink/60">
          Update product details and variants.
        </p>
      </div>
      <ProductForm initialData={initialData} productId={params.id} />
    </div>
  )
}
