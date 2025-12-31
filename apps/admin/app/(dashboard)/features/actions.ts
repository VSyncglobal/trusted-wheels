'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"

// --- EXISTING ACTIONS ---

export async function addTemplate(formData: FormData) {
  const label = formData.get("label") as string
  const rawOptions = formData.get("options") as string
  
  const options = rawOptions.split(",").map(s => s.trim()).filter(s => s.length > 0)
  
  await prisma.featureTemplate.create({
    data: {
      label,
      type: "DROPDOWN",
      options,
      isMandatory: false
    }
  })
  revalidatePath("/features")
}

export async function deleteTemplate(id: string) {
  await prisma.featureTemplate.delete({ where: { id } })
  revalidatePath("/features")
}

// --- NEW ACTIONS FOR SUB-FEATURES ---

export async function addOptionToTemplate(templateId: string, newOption: string) {
  if (!newOption) return

  const template = await prisma.featureTemplate.findUnique({ where: { id: templateId } })
  if (!template) return

  // Prevent duplicates
  const updatedOptions = Array.from(new Set([...template.options, newOption]))

  await prisma.featureTemplate.update({
    where: { id: templateId },
    data: { options: updatedOptions }
  })
  revalidatePath("/features")
}

export async function removeOptionFromTemplate(templateId: string, optionToRemove: string) {
  const template = await prisma.featureTemplate.findUnique({ where: { id: templateId } })
  if (!template) return

  const updatedOptions = template.options.filter(opt => opt !== optionToRemove)

  await prisma.featureTemplate.update({
    where: { id: templateId },
    data: { options: updatedOptions }
  })
  revalidatePath("/features")
}