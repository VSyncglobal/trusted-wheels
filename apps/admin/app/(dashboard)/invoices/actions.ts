'use server'

import { prisma } from "@repo/database"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Renamed to match the import in your page
export async function createInvoiceAction(formData: FormData) {
  const rawData = {
    clientName: formData.get("clientName") as string,
    clientEmail: formData.get("clientEmail") as string,
    clientPhone: formData.get("clientPhone") as string,
    clientKRA: formData.get("clientKRA") as string,
    dueDate: new Date(formData.get("dueDate") as string),
    items: JSON.parse(formData.get("items") as string),
    
    // We now read these from the form data, respecting the VAT toggle you added
    subtotal: parseFloat(formData.get("subtotal") as string),
    tax: parseFloat(formData.get("tax") as string),
    total: parseFloat(formData.get("total") as string),
  }

  // Generate Invoice Number
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
      subtotal: rawData.subtotal,
      tax: rawData.tax,
      total: rawData.total,
      dueDate: rawData.dueDate,
      status: "DRAFT"
    }
  })

  revalidatePath("/invoices")
  redirect("/invoices")
}