import { prisma } from "@repo/database"
import { notFound } from "next/navigation"
import { EditInvoiceForm } from "./edit-invoice-form"

// This forces the page to be dynamic (always fetch fresh data)
export const dynamic = "force-dynamic"

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // 1. Fetch Data (Server Side)
  const rawInvoice = await prisma.invoice.findUnique({ 
    where: { id } 
  })
  
  if (!rawInvoice) return notFound()

  // 2. Convert Decimal types to Strings
  // This is CRITICAL. You cannot pass Prisma 'Decimal' objects to Client Components.
  const invoice = {
    ...rawInvoice,
    subtotal: rawInvoice.subtotal.toString(),
    tax: rawInvoice.tax.toString(),
    total: rawInvoice.total.toString(),
  }
  
  // 3. Render Client Form
  return <EditInvoiceForm invoice={invoice} />
}