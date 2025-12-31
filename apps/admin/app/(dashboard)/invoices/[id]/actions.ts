'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateInvoiceAction(invoiceId: string, formData: FormData) {
  const rawData = {
    clientName: formData.get("clientName") as string,
    clientEmail: formData.get("clientEmail") as string,
    clientPhone: formData.get("clientPhone") as string,
    clientKRA: formData.get("clientKRA") as string,
    status: formData.get("status") as any, // PAID, SENT, etc.
    // Items are passed as hidden JSON string
    items: JSON.parse(formData.get("items") as string),
  }

  // Recalculate Totals
  const subtotal = rawData.items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0)
  const tax = subtotal * 0.16
  const total = subtotal + tax

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      clientName: rawData.clientName,
      clientEmail: rawData.clientEmail,
      clientPhone: rawData.clientPhone,
      clientKRA: rawData.clientKRA,
      items: rawData.items,
      status: rawData.status,
      subtotal,
      tax,
      total,
    }
  })

  revalidatePath("/invoices")
  revalidatePath(`/invoices/${invoiceId}`)
  redirect("/invoices")
}