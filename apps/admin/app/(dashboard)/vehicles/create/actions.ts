'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"

// Helper to generate a temporary stock number
function generateStockNumber() {
  return `KDG-${Math.floor(1000 + Math.random() * 9000)}` 
}

export async function createVehicleAction(data: any) {
  try {
    // 1. Construct the Feature List (Core Specs + Custom Specs)
    const featuresToCreate = [
      { key: "Engine Size", value: `${data.engineSizeCC} cc` },
      { key: "Mileage", value: `${data.mileage} km` },
      { key: "Fuel Type", value: data.fuelType },
      { key: "Transmission", value: data.transmission },
      { key: "Condition", value: data.condition || "USED" },
      // Spread in the custom specs from the UI
      ...(data.customSpecs || []) 
    ].filter(f => f.value && f.value !== "");

    // 2. Database Transaction
    const vehicle = await prisma.vehicle.create({
      data: {
        // Required Fields
        stockNumber: generateStockNumber(), // Auto-generate for now
        make: data.brand,
        model: data.model,
        year: parseInt(data.year),
        bodyType: data.type,
        listingPrice: parseFloat(data.sellingPrice || "0"),
        status: "DRAFT",

        // Relations
        features: {
          create: featuresToCreate.map(f => ({
            key: f.key,
            value: f.value
          }))
        },
        
        // Internal Finance Record
        costs: data.basePrice ? {
            create: {
                description: "Base Purchase Cost",
                amount: parseFloat(data.basePrice),
                dateIncurred: new Date()
            }
        } : undefined
      }
    })

    // 3. Revalidate and Return
    revalidatePath('/')
    return { success: true, vehicleId: vehicle.id }

  } catch (error) {
    console.error("Failed to create vehicle:", error)
    return { success: false, error: "Database transaction failed" }
  }
} // <--- THIS BRACE WAS MISSING

// --- NEW FUNCTION FOR DROPDOWNS ---
export async function getFeatureTemplates() {
  return await prisma.featureTemplate.findMany({
    orderBy: { label: 'asc' }
  });
}