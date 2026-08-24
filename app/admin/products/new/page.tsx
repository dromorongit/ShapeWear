import ProductForm from '@/components/admin/ProductForm'

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          New Product
        </h2>
        <p className="mt-1 font-body text-small text-ink/60">
          Create a new product for your store.
        </p>
      </div>
      <ProductForm />
    </div>
  )
}
