import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/affiliate/', '/api/', '/cart', '/checkout', '/order-confirmation'],
      },
    ],
    sitemap: 'https://shapewearcloset.com/sitemap.xml',
  }
}