import { prisma } from "@repo/database"
import { notFound } from "next/navigation"
import { PrintButton } from "./print-button" // <--- Import the Client Component

export const dynamic = "force-dynamic"

export default async function PrintInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const invoice = await prisma.invoice.findUnique({
    where: { id }
  })

  if (!invoice) return notFound()

  // Parse items from JSON
  const items = invoice.items as any[]

  return (
    <div className="min-h-screen bg-white text-black p-8 md:p-12 print:p-0">
      
      {/* PRINT CONTROLS (Hidden when printing) */}
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center print:hidden">
         <a href="/invoices" className="text-sm font-bold text-gray-500 hover:text-black">← Back to Dashboard</a>
         
         {/* Replaced the raw button with the Client Component */}
         <PrintButton /> 
      </div>

      {/* INVOICE SHEET (A4 Aspect Ratio approx) */}
      <div className="max-w-3xl mx-auto border border-gray-200 p-12 shadow-lg print:shadow-none print:border-none print:w-full print:max-w-none bg-white">
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b border-black pb-8 mb-8">
           <div>
              <h1 className="text-4xl font-extrabold tracking-tight uppercase">Trust Rides</h1>
              <p className="text-sm font-medium mt-2">Ridgeways, Kiambu Road</p>
              <p className="text-sm font-medium">Nairobi, Kenya</p>
              <p className="text-sm font-medium text-gray-500 mt-1">+254 700 000 000</p>
           </div>
           <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Invoice</h2>
              <p className="text-xl font-bold mt-1">{invoice.number}</p>
              <div className="mt-4 text-sm">
                 <p><span className="font-bold text-gray-500">Date Issued:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                 <p><span className="font-bold text-gray-500">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
           </div>
        </div>

        {/* BILL TO */}
        <div className="mb-12">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bill To</h3>
           <p className="text-lg font-bold">{invoice.clientName}</p>
           <p className="text-sm text-gray-600">{invoice.clientPhone}</p>
           {invoice.clientEmail && <p className="text-sm text-gray-600">{invoice.clientEmail}</p>}
           {invoice.clientKRA && <p className="text-sm text-gray-600 mt-1">KRA PIN: {invoice.clientKRA}</p>}
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full mb-12">
           <thead>
              <tr className="border-b-2 border-black">
                 <th className="text-left py-2 text-xs font-bold uppercase tracking-widest">Description</th>
                 <th className="text-center py-2 text-xs font-bold uppercase tracking-widest w-20">Qty</th>
                 <th className="text-right py-2 text-xs font-bold uppercase tracking-widest w-32">Price</th>
                 <th className="text-right py-2 text-xs font-bold uppercase tracking-widest w-32">Total</th>
              </tr>
           </thead>
           <tbody className="text-sm">
              {items.map((item, idx) => (
                 <tr key={idx} className="border-b border-gray-100">
                    <td className="py-4 font-medium">{item.desc}</td>
                    <td className="py-4 text-center text-gray-500">{item.qty}</td>
                    <td className="py-4 text-right text-gray-500">{Number(item.price).toLocaleString()}</td>
                    <td className="py-4 text-right font-bold">{Number(item.price * item.qty).toLocaleString()}</td>
                 </tr>
              ))}
           </tbody>
        </table>

        {/* TOTALS */}
        <div className="flex justify-end">
           <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                 <span>Subtotal</span>
                 <span>{Number(invoice.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500">
                 <span>VAT (16%)</span>
                 <span>{Number(invoice.tax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold border-t-2 border-black pt-3 mt-2">
                 <span>Total</span>
                 <span>KES {Number(invoice.total).toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* FOOTER */}
        <div className="mt-20 pt-8 border-t border-gray-100 text-center">
           <p className="text-sm font-bold">Thank you for your business!</p>
           <p className="text-xs text-gray-400 mt-1">Payment details: MPESA Paybill 000000 | Bank AC: 000-000-000</p>
        </div>

      </div>
    </div>
  )
}