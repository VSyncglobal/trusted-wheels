'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"

// Helper to generate a temporary stock number
function generateStockNumber() {
  return `KDG-${Math.floor(1000 + Math.random() * 9000)}` 
}

export async function createVehicleAction(data: any) {
  try {
    // 1. Construct Feature List
    const featuresToCreate = [
      { key: "Engine Size", value: data.engineSizeCC ? `${data.engineSizeCC} cc` : "" },
      { key: "Mileage", value: data.mileage ? `${data.mileage} km` : "" },
      { key: "Fuel Type", value: data.fuelType },
      { key: "Transmission", value: data.transmission },
      // Spread custom specs (Allows duplicates)
      ...(data.customSpecs || []) 
    ].filter(f => f.value && f.value !== "");

    // 2. Database Transaction
    const vehicle = await prisma.vehicle.create({
      data: {
        // Core Fields
        stockNumber: generateStockNumber(),
        make: data.brand,
        model: data.model,
        year: parseInt(data.year),
        bodyType: data.type,
        condition: data.condition || "Foreign Used", // <--- SAVING TO DB COLUMN
        listingPrice: parseFloat(data.sellingPrice || "0"),
        status: "DRAFT",

        // Relations: Features
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

    revalidatePath('/')
    return { success: true, vehicleId: vehicle.id }

  } catch (error) {
    console.error("Failed to create vehicle:", error)
    return { success: false, error: "Database transaction failed" }
  }
}

// Dropdowns Helper
export async function getFeatureTemplates() {
  return await prisma.featureTemplate.findMany({
    orderBy: { label: 'asc' }
  });
}