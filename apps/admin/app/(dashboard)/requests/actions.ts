'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"

// Original generic action (optional, keeping for safety)
export async function updateRequestStatus(formData: FormData) {
  const id = formData.get("id") as string
  const status = formData.get("status") as any 

  await prisma.listingRequest.update({
    where: { id },
    data: { status }
  })

  revalidatePath("/requests")
}

// --- NEW REQUIRED ACTIONS ---

export async function markAsContacted(id: string) {
  await prisma.listingRequest.update({
    where: { id },
    data: { status: "CONTACTED" }
  })
  revalidatePath("/requests")
}

export async function markAsRejected(id: string) {
  await prisma.listingRequest.update({
    where: { id },
    data: { status: "REJECTED" }
  })
  revalidatePath("/requests")
}