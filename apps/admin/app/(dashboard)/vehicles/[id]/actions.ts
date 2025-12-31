'use server'

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
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

// 1. Generate Presigned URL (Used by Client during "Save")
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

// 2. The "Commit" Action (Runs on Save)
export async function updateVehicleGallery(
  vehicleId: string, 
  newImages: { url: string; key: string }[], 
  deletedImageIds: string[]
) {
  try {
    // A. Find the keys of images we are about to delete (to remove from S3)
    const imagesToDelete = await prisma.vehicleImage.findMany({
      where: { id: { in: deletedImageIds } },
      select: { url: true } 
    })

    // B. Database Transaction: Create New + Delete Old
    await prisma.$transaction([
      // Create new records
      prisma.vehicleImage.createMany({
        data: newImages.map(img => ({
          vehicleId,
          url: img.url,
          // We could store 'key' in DB if we added a column, 
          // but for now we derive it or just delete DB record.
        }))
      }),
      // Delete old records
      prisma.vehicleImage.deleteMany({
        where: { id: { in: deletedImageIds } }
      })
    ])

    // C. Clean up S3 Objects (Fire and forget, or await)
    // Note: We attempt to derive key from URL or just accept DB deletion is enough 
    // If you want strict S3 cleanup, you'd parse the Key from the URL here.
    /* for (const img of imagesToDelete) {
       // Extract key from URL logic would go here
       // await s3.send(new DeleteObjectCommand({ ... }))
    } 
    */

    revalidatePath(`/vehicles/${vehicleId}`)
    return { success: true }
  } catch (e) {
    console.error("Gallery sync failed:", e)
    return { success: false }
  }
}
// ... (Keep existing imports and S3 functions) ...

// --- NEW UPDATE ACTION ---
export async function updateVehicleDetails(vehicleId: string, data: any) {
  try {
    // 1. Format Fixed Features
    const fixedFeatures = [
      { key: "Engine Size", value: `${data.engineSizeCC} cc` },
      { key: "Mileage", value: `${data.mileage} km` },
      { key: "Fuel Type", value: data.fuelType },
      { key: "Transmission", value: data.transmission },
      { key: "Condition", value: data.condition || "USED" },
    ].filter(f => f.value && f.value !== "")

    // 2. Combine with Custom Specs
    const allFeatures = [
        ...fixedFeatures, 
        ...(data.customSpecs || [])
    ]

    // 3. Transaction: Update Base Fields + Replace Features
    await prisma.$transaction(async (tx) => {
      // A. Update Core Fields
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: {
          make: data.brand,
          model: data.model,
          year: parseInt(data.year),
          bodyType: data.type,
          listingPrice: parseFloat(data.sellingPrice || "0"),
          status: data.status, // Allow status updates (DRAFT/PUBLISHED)
        }
      })

      // B. Update Internal Costs (Upsert or Create)
      if (data.basePrice) {
         // Simple logic: If exists, update amount. If not, create.
         // For a real accounting system, you'd add a NEW cost line item. 
         // Here we just maintain the "Base Purchase Cost".
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

      // C. Update Features (Delete All -> Re-create)
      // This is the safest way to handle renames/deletions in a KV store
      await tx.vehicleFeature.deleteMany({
        where: { vehicleId }
      })
      
      if (allFeatures.length > 0) {
        await tx.vehicleFeature.createMany({
            data: allFeatures.map(f => ({
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