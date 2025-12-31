'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"

function generateStockNumber() {
  return `KDG-${Math.floor(1000 + Math.random() * 9000)}` 
}

export async function createVehicleAction(data: any) {
  try {
    const featuresToCreate = [
      { key: "Engine Size", value: `${data.engineSizeCC} cc` },
      { key: "Mileage", value: `${data.mileage} km` },
      { key: "Fuel Type", value: data.fuelType },
      { key: "Transmission", value: data.transmission },
      { key: "Condition", value: data.condition || "USED" },
      ...(data.customSpecs || []) 
    ].filter(f => f.value && f.value !== "");

    const vehicle = await prisma.vehicle.create({
      data: {
        stockNumber: generateStockNumber(),
        make: data.brand,
        model: data.model,
        year: parseInt(data.year),
        bodyType: data.type,
        listingPrice: parseFloat(data.sellingPrice || "0"),
        status: "DRAFT",
        features: {
          create: featuresToCreate.map(f => ({
            key: f.key,
            value: f.value
          }))
        },
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

  } catch (error: any) {
    console.error("Failed to create vehicle:", error)
    // Return the error message so we can alert it in the UI
    return { success: false, error: error.message || "Database Error" }
  }
}