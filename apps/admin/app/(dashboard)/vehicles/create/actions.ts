'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// --- VALIDATION SCHEMA ---
const VehicleSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  type: z.string().min(1, "Body Type is required"),
  condition: z.string().optional().default("Foreign Used"),
  sellingPrice: z.coerce.number().min(0, "Price cannot be negative"),
  basePrice: z.coerce.number().optional(), // For internal costs
  
  // Specs
  engineSizeCC: z.string().optional(),
  mileage: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  
  // Custom Specs Array
  customSpecs: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional()
})

// --- HELPERS ---

function generateStockNumber() {
  const date = new Date();
  const yy = date.getFullYear().toString().slice(-2);
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); 
  // Result: KDG-2412-5839
  return `KDG-${yy}${mm}-${random}`;
}

// --- ACTIONS ---

export async function createVehicleAction(formData: any) {
  try {
    // 1. Validate Input
    const result = VehicleSchema.safeParse(formData);
    
    if (!result.success) {
      // FIX 1: Use .issues instead of .errors
      const errorMessage = result.error.issues.map(issue => issue.message).join(", ");
      return { success: false, error: "Validation failed: " + errorMessage }
    }

    const data = result.data;

    // 2. Construct Feature List
    const rawFeatures = [
      { key: "Engine Size", value: data.engineSizeCC ? `${data.engineSizeCC} cc` : "" },
      { key: "Mileage", value: data.mileage ? `${data.mileage} km` : "" },
      { key: "Fuel Type", value: data.fuelType },
      { key: "Transmission", value: data.transmission },
      // Spread custom specs
      ...(data.customSpecs || []) 
    ];

    // FIX 2: Add Type Predicate so TS knows 'value' is strictly string
    const featuresToCreate = rawFeatures.filter(
      (f): f is { key: string; value: string } => !!f.value && f.value !== ""
    );

    // 3. Database Transaction
    const vehicle = await prisma.vehicle.create({
      data: {
        // Core Fields
        stockNumber: generateStockNumber(),
        make: data.brand,
        model: data.model,
        year: data.year,
        bodyType: data.type,
        condition: data.condition, 
        listingPrice: data.sellingPrice,
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
                amount: data.basePrice,
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