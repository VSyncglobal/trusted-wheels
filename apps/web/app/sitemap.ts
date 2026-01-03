import { MetadataRoute } from 'next'
import { prisma } from "@repo/database"
import { BLOG_POSTS } from '../lib/blog-data' // Import the blogs

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trustrides.co.ke' 

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/inventory',
    '/sell',
    '/financing',
    '/contact',
    '/blog', // Don't forget the main blog index
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }))

  // 2. Dynamic Vehicle Routes (Database)
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, updatedAt: true }
  })

  const vehicleRoutes = vehicles.map((vehicle) => ({
    url: `${baseUrl}/inventory/${vehicle.id}`,
    lastModified: vehicle.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 3. Dynamic Blog Routes (From your Data File)
  // This is the missing piece for your SEO strategy
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...vehicleRoutes, ...blogRoutes]
}