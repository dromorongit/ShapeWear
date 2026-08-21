'use client'

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export interface ProductVariant {
  shape: string
  size: string
  sku: string
  stock: number
}

export interface ProductFormData {
  name: string
  slug: string
  description: string
  shortDescription: string
  price: string
  salePrice: string
  category: string
  tags: string
  isFeatured: boolean
  isActive: boolean
  variants: ProductVariant[]
  mainImage: string | null
  additionalImages: string[]
}

const emptyVariant = (): ProductVariant => ({
  shape: '',
  size: '',
  sku: '',
  stock: 0,
})

const emptyProduct = (): ProductFormData => ({
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  price: '',
  salePrice: '',
  category: '',
  tags: '',
  isFeatured: false,
  isActive: true,
  variants: [emptyVariant()],
  mainImage: null,
  additionalImages: [],
})

const CATEGORIES = [
  'Waist Trainer',
  'Body Shaper',
  'Butt Lifter',
  'Tummy Control',
]

const SHAPES = ['Hourglass', 'Fajas', 'Latex']
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

interface ProductFormProps {
  initialData?: ProductFormData
  onSubmit?: (data: ProductFormData) => void
}

export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialData ?? emptyProduct())
  const [mainPreview, setMainPreview] = useState<string | null>(initialData?.mainImage ?? null)
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>(
    initialData?.additionalImages ?? []
  )
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
      setMainPreview(initialData.mainImage)
      setAdditionalPreviews(initialData.additionalImages)
    }
  }, [initialData])

  const updateField = useCallback(<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    updateField('slug', slug)
  }

  const addVariant = () => {
    updateField('variants', [...form.variants, emptyVariant()])
  }

  const removeVariant = (index: number) => {
    updateField('variants', form.variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    updateField(
      'variants',
      form.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setMainPreview(preview)
    updateField('mainImage', preview)
  }

  const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const previews = files.map((file) => URL.createObjectURL(file))
    setAdditionalPreviews((prev) => [...prev, ...previews])
    updateField('additionalImages', [...form.additionalImages, ...previews])
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index))
    updateField(
      'additionalImages',
      form.additionalImages.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting product:', form)
    if (onSubmit) {
      onSubmit(form)
    } else {
      setSuccessMessage('Product saved successfully! (Check console for data)')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="rounded-md bg-blush p-4 font-body text-body text-pink">
          {successMessage}
        </div>
      )}
      <Card className="p-5 space-y-5">
        <h3 className="font-display text-lg font-semibold text-ink">
          Basic Information
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Product Name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
          <div>
            <Input
              label="Slug"
              value={form.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              required
            />
            <button
              type="button"
              onClick={generateSlug}
              className="mt-1.5 font-body text-small text-pink hover:underline"
            >
              Auto-generate from name
            </button>
          </div>
        </div>
        <Input
          label="Short Description"
          value={form.shortDescription}
          onChange={(e) => updateField('shortDescription', e.target.value)}
          required
        />
        <div>
          <label className="mb-1.5 block font-body text-small font-medium text-ink">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
            className="w-full rounded-md border border-ink/10 bg-white px-3 py-2 font-body text-body text-ink placeholder:text-ink/40 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
            required
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Price (GHS)"
            type="number"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            required
          />
          <Input
            label="Sale Price (GHS, optional)"
            type="number"
            value={form.salePrice}
            onChange={(e) => updateField('salePrice', e.target.value)}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-body text-small font-medium text-ink">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full rounded-md border border-ink/10 bg-white px-3 py-2 font-body text-body text-ink focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => updateField('tags', e.target.value)}
            placeholder="e.g. sale, bestseller, waist"
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => updateField('isFeatured', e.target.checked)}
              className="h-4 w-4 rounded border-ink/20 text-pink focus:ring-pink"
            />
            <span className="font-body text-small text-ink">Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => updateField('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-ink/20 text-pink focus:ring-pink"
            />
            <span className="font-body text-small text-ink">Active</span>
          </label>
        </div>
      </Card>

      <Card className="p-5 space-y-5">
        <h3 className="font-display text-lg font-semibold text-ink">
          Images
        </h3>
        <div>
          <label className="mb-1.5 block font-body text-small font-medium text-ink">
            Main Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImage}
            className="block w-full text-small text-ink/70 file:mr-4 file:rounded-md file:border-0 file:bg-pink file:px-3 file:py-1.5 file:text-small file:font-medium file:text-white hover:file:bg-pink/90"
          />
          {mainPreview && (
            <div className="mt-3 relative inline-block h-32 w-32 rounded-md border border-ink/10 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainPreview} alt="Main preview" className="h-full w-full object-cover" />
            </div>
          )}
          <p className="mt-2 font-body text-small text-ink/50">
            Placeholder for Cloudinary integration - Phase 9.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block font-body text-small font-medium text-ink">
            Additional Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImages}
            className="block w-full text-small text-ink/70 file:mr-4 file:rounded-md file:border-0 file:bg-pink file:px-3 file:py-1.5 file:text-small file:font-medium file:text-white hover:file:bg-pink/90"
          />
          {additionalPreviews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {additionalPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative h-24 w-24 rounded-md border border-ink/10 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-white text-xs hover:bg-ink"
                    aria-label={`Remove image ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 font-body text-small text-ink/50">
            Placeholder for Cloudinary integration - Phase 9.
          </p>
        </div>
      </Card>

      <Card className="p-5 space-y-5">
        <h3 className="font-display text-lg font-semibold text-ink">
          Variants
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="px-3 py-2 font-body text-small font-medium text-ink/60">Shape</th>
                <th className="px-3 py-2 font-body text-small font-medium text-ink/60">Size</th>
                <th className="px-3 py-2 font-body text-small font-medium text-ink/60">SKU</th>
                <th className="px-3 py-2 font-body text-small font-medium text-ink/60">Stock</th>
                <th className="px-3 py-2 font-body text-small font-medium text-ink/60"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {form.variants.map((variant, index) => (
                <tr key={index}>
                  <td className="px-3 py-2">
                    <select
                      value={variant.shape}
                      onChange={(e) => updateVariant(index, 'shape', e.target.value)}
                      className="w-full rounded-md border border-ink/10 bg-white px-2 py-1.5 font-body text-small text-ink focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
                    >
                      <option value="">Select</option>
                      {SHAPES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={variant.size}
                      onChange={(e) => updateVariant(index, 'size', e.target.value)}
                      className="w-full rounded-md border border-ink/10 bg-white px-2 py-1.5 font-body text-small text-ink focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
                    >
                      <option value="">Select</option>
                      {SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      className="h-9"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      value={String(variant.stock)}
                      onChange={(e) => updateVariant(index, 'stock', Number(e.target.value) || 0)}
                      className="h-9"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="font-body text-small text-red-600 hover:underline"
                      disabled={form.variants.length === 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" variant="secondary" onClick={addVariant}>
          Add Variant Row
        </Button>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            window.location.href = '/admin/products'
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          Save Product
        </Button>
      </div>
    </form>
  )
}
