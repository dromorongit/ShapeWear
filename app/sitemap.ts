import { MetadataRoute } from 'next'
import { getProductSlugs } from '@/lib/db/queries/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shapewearcloset.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: 'weekly', priority: 0.5 },
  ]

  const slugs = await getProductSlugs()
  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}