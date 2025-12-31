'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"

export async function updateRequestStatus(formData: FormData) {
  const id = formData.get("id") as string
  const status = formData.get("status") as any // 'CONTACTED' | 'REJECTED'

  await prisma.listingRequest.update({
    where: { id },
    data: { status }
  })

  revalidatePath("/requests")
}