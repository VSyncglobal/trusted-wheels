import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/auth/'], // Keep sensitive areas private
    },
    // Point them to the sitemap we just made
    sitemap: 'https://trustrides.co.ke/sitemap.xml', 
  }
}