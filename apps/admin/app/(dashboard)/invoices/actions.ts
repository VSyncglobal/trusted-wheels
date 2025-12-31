'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createInvoice(formData: FormData) {
  const rawData = {
    clientName: formData.get("clientName") as string,
    clientEmail: formData.get("clientEmail") as string,
    clientPhone: formData.get("clientPhone") as string,
    clientKRA: formData.get("clientKRA") as string,
    dueDate: new Date(formData.get("dueDate") as string),
    // Items are passed as hidden JSON string for simplicity in this form
    items: JSON.parse(formData.get("items") as string),
  }

  // Calculate Totals
  const subtotal = rawData.items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0)
  const taxRate = 0.16 // 16% VAT (Adjust as needed)
  const tax = subtotal * taxRate
  const total = subtotal + tax

  // Generate Invoice Number (Simple Auto-Increment Simulation)
  const count = await prisma.invoice.count()
  const number = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`

  await prisma.invoice.create({
    data: {
      number,
      clientName: rawData.clientName,
      clientEmail: rawData.clientEmail,
      clientPhone: rawData.clientPhone,
      clientKRA: rawData.clientKRA,
      items: rawData.items,
      subtotal,
      tax,
      total,
      dueDate: rawData.dueDate,
      status: "DRAFT"
    }
  })

  revalidatePath("/invoices")
  redirect("/invoices")
}