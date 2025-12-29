"use server";

import { prisma } from "@repo/database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Define the shape of the data we expect from the form
type VehicleFormData = {
  brand: string;
  model: string;
  year: string; // Form sends string, DB needs Int
  type: string;
  condition: "USED" | "NEW";
  engineSizeCC: string; // Form sends string
  transmission: "AUTOMATIC" | "MANUAL" | "CVT";
  fuelType: "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC";
  mileage: string;
  isAccidentFree: boolean;
  basePrice: string;
  sellingPrice: string;
  customSpecs: { key: string; value: string }[];
};

export async function createVehicleAction(data: VehicleFormData) {
  // 1. Create a slug (URL friendly string)
  // e.g. "Toyota Land Cruiser" -> "toyota-land-cruiser-123456"
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const slug = `${data.brand}-${data.model}-${data.year}-${randomSuffix}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  try {
    // 2. Write to Database using Transaction (All or Nothing)
    await prisma.vehicle.create({
      data: {
        slug,
        status: "DRAFT", // Always start as Draft
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year),
        type: data.type,
        condition: data.condition === "NEW" ? "NEW" : "USED",
        
        // Specs
        engineSizeCC: parseInt(data.engineSizeCC) || 0,
        transmission: data.transmission,
        fuelType: data.fuelType,
        mileageKm: parseInt(data.mileage) || 0,
        isAccidentFree: data.isAccidentFree,

        // Financials
        basePrice: parseFloat(data.basePrice) || 0,
        sellingPrice: parseFloat(data.sellingPrice) || 0,

        // Custom Features (The Extensibility Layer)
        features: {
          create: data.customSpecs.map((spec, index) => ({
            key: spec.key,
            value: spec.value,
            sortOrder: index,
          })),
        },
      },
    });

    // 3. Clear Cache & Redirect
    revalidatePath("/inventory");
    return { success: true };
    
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    return { success: false, error: "Database operation failed" };
  }
}