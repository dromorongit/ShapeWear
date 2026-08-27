'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
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

interface CategoryOption {
  id: string
  name: string
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

const SHAPES = ['Hourglass', 'Fajas', 'Latex']
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

interface ProductFormProps {
  initialData?: ProductFormData
  productId?: string
}

export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialData ?? emptyProduct())
  const [mainPreview, setMainPreview] = useState<string | null>(initialData?.mainImage ?? null)
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>(
    initialData?.additionalImages ?? []
  )
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingAdditional, setUploadingAdditional] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [categoryError, setCategoryError] = useState('')

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
      setMainPreview(initialData.mainImage)
      setAdditionalPreviews(initialData.additionalImages)
    }
  }, [initialData])

  useEffect(() => {
    let cancelled = false
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories')
        if (!res.ok) throw new Error('Failed to load categories')
        const data = await res.json()
        if (!cancelled) {
          setCategories(data)
        }
      } catch {
        if (!cancelled) {
          setCategories([])
        }
      }
    }
    fetchCategories()
    return () => {
      cancelled = true
    }
  }, [])

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

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const res = await fetch('/api/admin/cloudinary-signature')
    if (!res.ok) throw new Error('Failed to get upload signature')
    const { signature, timestamp, apiKey, cloudName, folder } = await res.json()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', String(timestamp))
    formData.append('signature', signature)
    formData.append('folder', folder)
    formData.append('transformation', JSON.stringify({ quality: 'auto', format: 'auto' }))

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    )

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      throw new Error(`Upload failed: ${err}`)
    }

    const data = await uploadRes.json()
    return data.secure_url
  }

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingMain(true)
    try {
      const url = await uploadToCloudinary(file)
      setMainPreview(url)
      updateField('mainImage', url)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploadingMain(false)
    }
  }

  const handleAdditionalImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadingAdditional(true)
    try {
      const urls: string[] = []
      for (const file of files) {
        const url = await uploadToCloudinary(file)
        urls.push(url)
      }
      setAdditionalPreviews((prev) => [...prev, ...urls])
      updateField('additionalImages', [...form.additionalImages, ...urls])
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploadingAdditional(false)
    }
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index))
    updateField(
      'additionalImages',
      form.additionalImages.filter((_, i) => i !== index)
    )
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setCategoryError('')
    setAddingCategory(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add category')
      const created: CategoryOption = { id: data.id, name: data.name }
      setCategories((prev) => [...prev, created])
      updateField('category', created.name)
      setNewCategoryName('')
      setShowAddCategory(false)
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : 'Failed to add category')
    } finally {
      setAddingCategory(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const payload = {
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }

    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
    const method = productId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setErrorMessage(data.error || 'Failed to save product')
      return
    }

    setSuccessMessage('Product saved successfully!')
    setTimeout(() => {
      window.location.href = '/admin/products'
    }, 800)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="rounded-md bg-blush p-4 font-body text-body text-pink">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4 font-body text-body text-red-600">
          {errorMessage}
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
            label="Price (GH₵)"
            type="number"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            required
          />
          <Input
            label="Sale Price (GH₵, optional)"
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
              onChange={(e) => {
                updateField('category', e.target.value)
                if (e.target.value !== '__add_new') {
                  setShowAddCategory(false)
                }
              }}
              className="w-full rounded-md border border-ink/10 bg-white px-3 py-2 font-body text-body text-ink focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="__add_new">+ Add new category</option>
            </select>
            {form.category === '__add_new' && !showAddCategory && (
              <button
                type="button"
                onClick={() => setShowAddCategory(true)}
                className="mt-2 font-body text-small text-pink hover:underline"
              >
                + Add new category
              </button>
            )}
            {showAddCategory && (
              <form onSubmit={handleAddCategory} className="mt-3 flex flex-col gap-2">
                <Input
                  label="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. New Collection"
                  required
                />
                {categoryError && (
                  <p className="font-body text-small text-red-600">{categoryError}</p>
                )}
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={addingCategory}>
                    {addingCategory ? 'Adding...' : 'Create & Select'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAddCategory(false)
                      setNewCategoryName('')
                      setCategoryError('')
                      updateField('category', '')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
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
            disabled={uploadingMain}
            required
            className="block w-full text-small text-ink/70 file:mr-4 file:rounded-md file:border-0 file:bg-pink file:px-3 file:py-1.5 file:text-small file:font-medium file:text-white hover:file:bg-pink/90 disabled:opacity-50"
          />
          {uploadingMain && (
            <p className="mt-2 font-body text-small text-ink/60">Uploading main image...</p>
          )}
          {mainPreview && !uploadingMain && (
            <div className="mt-3 relative inline-block h-32 w-32 rounded-md border border-ink/10 overflow-hidden">
              <Image src={mainPreview} alt="Main preview" fill className="object-cover" />
            </div>
          )}
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
            disabled={uploadingAdditional}
            className="block w-full text-small text-ink/70 file:mr-4 file:rounded-md file:border-0 file:bg-pink file:px-3 file:py-1.5 file:text-small file:font-medium file:text-white hover:file:bg-pink/90 disabled:opacity-50"
          />
          {uploadingAdditional && (
            <p className="mt-2 font-body text-small text-ink/60">Uploading additional images...</p>
          )}
          {additionalPreviews.length > 0 && !uploadingAdditional && (
            <div className="mt-3 flex flex-wrap gap-3">
              {additionalPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative h-24 w-24 rounded-md border border-ink/10 overflow-hidden"
                >
                  <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
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
