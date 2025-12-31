'use server'

import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";

// --- 1. FETCH TEMPLATES ---
// This populates the "Quick Add" dropdown in Step 2
export async function getFeatureTemplates() {
  try {
    const templates = await prisma.featureTemplate.findMany({
      orderBy: { label: 'asc' },
    });
    return templates;
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return [];
  }
}

// --- 2. CREATE VEHICLE ---
export async function createVehicleAction(data: any) {
  try {
    // 1. Generate a Stock Number (Simple logic: Year + Random 4 digits)
    const stockNumber = `TW-${new Date().getFullYear().toString().slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Prepare Data
    // We separate the "Core" fields from the "Custom" features
    const { customSpecs, ...coreData } = data;

    // 3. Database Transaction
    // We use nested writes to create the Vehicle AND its Features in one go
    await prisma.vehicle.create({
      data: {
        // --- Core Fields ---
        stockNumber,
        make: coreData.brand, // Map 'brand' to 'make'
        model: coreData.model,
        year: parseInt(coreData.year),
        bodyType: coreData.type,
        condition: coreData.condition || "USED",
        listingPrice: parseFloat(coreData.sellingPrice) || 0,
        
        // Note: Ideally, add these columns to your Vehicle schema if they don't exist,
        // or add them to the features list below. Assuming columns exist:
        // engineSize: parseInt(coreData.engineSizeCC) || 0,
        // mileage: parseInt(coreData.mileage) || 0,
        // transmission: coreData.transmission,
        // fuelType: coreData.fuelType,

        status: "PUBLISHED", // Default to published for now

        // --- Relations ---
        features: {
          create: [
            // A. Add the Standard Specs as features (if they aren't columns on your main table)
            { key: "Engine Size", value: `${coreData.engineSizeCC} cc` },
            { key: "Mileage", value: `${coreData.mileage} km` },
            { key: "Transmission", value: coreData.transmission },
            { key: "Fuel Type", value: coreData.fuelType },
            
            // B. Add the Custom Specs from the Dynamic List
            ...customSpecs.map((spec: any) => ({
              key: spec.key,
              value: spec.value
            }))
          ]
        },
        
        // Handle images separately or create a placeholder for now
        // images: { create: [] } 
      }
    });

    revalidatePath("/vehicles");
    revalidatePath("/"); // Update dashboard stats
    return { success: true };

  } catch (error) {
    console.error("Create Vehicle Error:", error);
    return { success: false, error: "Database creation failed" };
  }
}