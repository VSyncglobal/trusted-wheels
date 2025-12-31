'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"

export async function addAttribute(type: string, value: string) {
  if (!value) return
  
  try {
    await prisma.attribute.create({
      data: { type, value }
    })
    revalidatePath('/features')
    revalidatePath('/vehicles/create') // Update the form too
  } catch (e) {
    // Ignore duplicates silently or handle error
    console.error("Failed to add attribute", e)
  }
}

export async function removeAttribute(id: string) {
  try {
    await prisma.attribute.delete({ where: { id } })
    revalidatePath('/features')
    revalidatePath('/vehicles/create')
  } catch (e) {
    console.error("Failed to delete attribute", e)
  }
}