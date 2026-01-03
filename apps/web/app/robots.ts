import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://trustrides.co.ke'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Block bots from backend/admin areas
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Vital for indexing
  }
}