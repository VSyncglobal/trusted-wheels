'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// 1. Generate Presigned URL
export async function getPresignedUploadUrl(filename: string, fileType: string) {
  const uniqueId = crypto.randomUUID()
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "")
  const key = `vehicles/${uniqueId}-${cleanFilename}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  })

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 })
  const publicUrl = `${process.env.AWS_PUBLIC_DOMAIN}/${key}`

  return { signedUrl, publicUrl, key }
}

// 2. Commit Gallery Changes
export async function updateVehicleGallery(
  vehicleId: string, 
  newImages: { url: string; key: string }[], 
  deletedImageIds: string[]
) {
  try {
    await prisma.$transaction([
      prisma.vehicleImage.createMany({
        data: newImages.map(img => ({
          vehicleId,
          url: img.url,
          order: 0 // Default order, can be updated later
        }))
      }),
      prisma.vehicleImage.deleteMany({
        where: { id: { in: deletedImageIds } }
      })
    ])

    revalidatePath(`/vehicles/${vehicleId}`)
    return { success: true }
  } catch (e) {
    console.error("Gallery sync failed:", e)
    return { success: false }
  }
}

// 3. Update Vehicle Details (Core Logic)
export async function updateVehicleDetails(vehicleId: string, data: any) {
  try {
    // 1. Prepare Features
    const fixedFeatures = [
      { key: "Engine Size", value: data.engineSizeCC ? `${data.engineSizeCC} cc` : "" },
      { key: "Mileage", value: data.mileage ? `${data.mileage} km` : "" },
      { key: "Fuel Type", value: data.fuelType },
      { key: "Transmission", value: data.transmission },
    ].filter(f => f.value && f.value !== "")

    const allFeatures = [
        ...fixedFeatures, 
        ...(data.customSpecs || []) 
    ]

    // 2. Transaction
    // FIX: Explicitly type 'tx' as any to pass build strictness
    await prisma.$transaction(async (tx: any) => {
      // A. Update Core Fields (Including new 'condition' column)
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: {
          make: data.brand,
          model: data.model,
          year: parseInt(data.year),
          bodyType: data.type,
          condition: data.condition, 
          stockNumber: data.stockNumber,
          listingPrice: parseFloat(data.sellingPrice || "0"),
          status: data.status,
        }
      })

      // B. Update Finance/Cost
      if (data.basePrice) {
         const existingCost = await tx.vehicleCost.findFirst({
            where: { vehicleId, description: "Base Purchase Cost" }
         })

         if (existingCost) {
            await tx.vehicleCost.update({
                where: { id: existingCost.id },
                data: { amount: parseFloat(data.basePrice) }
            })
         } else {
            await tx.vehicleCost.create({
                data: {
                    vehicleId,
                    description: "Base Purchase Cost",
                    amount: parseFloat(data.basePrice),
                    dateIncurred: new Date()
                }
            })
         }
      }

      // C. Update Features
      await tx.vehicleFeature.deleteMany({
        where: { vehicleId }
      })
      
      if (allFeatures.length > 0) {
        await tx.vehicleFeature.createMany({
            data: allFeatures.map((f: any) => ({
                vehicleId,
                key: f.key,
                value: f.value
            }))
        })
      }
    })

    revalidatePath(`/vehicles/${vehicleId}`)
    revalidatePath(`/vehicles`)
    return { success: true }

  } catch (error) {
    console.error("Update failed:", error)
    return { success: false, error: "Database update failed" }
  }
}