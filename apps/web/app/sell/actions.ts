'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"

export async function submitListingRequest(formData: FormData) {
  try {
    // 1. Validate & Parse
    const rawData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: parseInt(formData.get("year") as string),
      mileage: parseInt(formData.get("mileage") as string),
      condition: formData.get("condition") as string,
      expectedPrice: formData.get("price") ? parseFloat(formData.get("price") as string) : null,
    }

    if (!rawData.name || !rawData.phone || !rawData.make || !rawData.model) {
      return { success: false, message: "Missing required fields." }
    }

    // 2. Create Record
    await prisma.listingRequest.create({
      data: {
        ...rawData,
        status: "PENDING"
      }
    })

    // 3. Return Success
    return { success: true, message: "Request submitted successfully." }

  } catch (error) {
    console.error("Submission failed:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}