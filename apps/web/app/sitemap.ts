import { MetadataRoute } from 'next'
import { prisma } from "@repo/database"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // REPLACE with your actual production domain
  const baseUrl = 'https://trustrides.co.ke' 

  // 1. Get all published vehicles to feed to the AI crawlers
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, updatedAt: true }
  })

  const vehicleUrls = vehicles.map((vehicle) => ({
    url: `${baseUrl}/inventory/${vehicle.id}`,
    lastModified: vehicle.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/inventory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...vehicleUrls,
  ]
}