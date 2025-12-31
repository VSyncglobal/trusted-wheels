'use client'

import { useState } from "react"
import Link from "next/link"
import { updateInvoiceAction } from "./actions"
import { Plus, Trash2, Save, Printer, ArrowLeft } from "lucide-react"

export function EditInvoiceForm({ invoice }: { invoice: any }) {
  // Handle items array safely
  const initialItems = Array.isArray(invoice.items) ? invoice.items : []
  
  const [items, setItems] = useState<any[]>(initialItems)
  const [status, setStatus] = useState(invoice.status)

  const addItem = () => {
    setItems([...items, { id: Date.now(), desc: "", qty: 1, price: 0 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter((i: any) => i.id !== id))
  }

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map((i: any) => i.id === id ? { ...i, [field]: value } : i))
  }

  // Live Calculations
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0)
  const tax = subtotal * 0.16
  const total = subtotal + tax

  // Wrapper for the Server Action
  const handleSubmit = async (formData: FormData) => {
    await updateInvoiceAction(invoice.id, formData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
           <Link href="/invoices" className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><ArrowLeft size={20}/></Link>
           <div>
              <h1 className="text-2xl font-extrabold text-black">Edit Invoice</h1>
              <p className="text-sm font-bold text-gray-400">{invoice.number}</p>
           </div>
        </div>
        <Link 
          href={`/invoices/${invoice.id}/print`} 
          target="_blank"
          className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 flex items-center gap-2"
        >
           <Printer size={16}/> Print View
        </Link>
      </div>

      <form action={handleSubmit} className="space-y-8">
        
        {/* DETAILS CARD */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 grid grid-cols-2 gap-6">
           <h3 className="col-span-2 text-xs font-extrabold uppercase text-gray-400 border-b border-gray-200 pb-2">Details</h3>
           
           <input name="clientName" defaultValue={invoice.clientName} required placeholder="Client Name" className="input-field" />
           
           <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-blue-600 uppercase">Status</label>
              <select 
                name="status" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="input-field"
              >
                 <option value="DRAFT">Draft</option>
                 <option value="SENT">Sent</option>
                 <option value="PAID">Paid</option>
                 <option value="OVERDUE">Overdue</option>
                 <option value="VOID">Void</option>
              </select>
           </div>
           
           <input name="clientPhone" defaultValue={invoice.clientPhone} required placeholder="Phone" className="input-field" />
           <input name="clientEmail" defaultValue={invoice.clientEmail || ""} placeholder="Email" className="input-field" />
           <input name="clientKRA" defaultValue={invoice.clientKRA || ""} placeholder="KRA PIN" className="input-field" />
        </div>

        {/* ITEMS CARD */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
           <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
              <h3 className="text-xs font-extrabold uppercase text-gray-400">Line Items</h3>
              <button type="button" onClick={addItem} className="text-xs font-bold flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800">
                <Plus size={12} /> Add Item
              </button>
           </div>
           
           <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center">
                   <input 
                     placeholder="Description" 
                     className="input-field text-sm"
                     value={item.desc}
                     onChange={(e) => updateItem(item.id, "desc", e.target.value)}
                   />
                   <input 
                     type="number" placeholder="Qty" className="input-field w-20 text-sm text-center"
                     value={item.qty}
                     onChange={(e) => updateItem(item.id, "qty", parseInt(e.target.value))}
                   />
                   <input 
                     type="number" placeholder="Price" className="input-field w-32 text-sm text-right"
                     value={item.price}
                     onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value))}
                   />
                   <button type="button" onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 p-2">
                     <Trash2 size={18} />
                   </button>
                </div>
              ))}
           </div>
           
           <input type="hidden" name="items" value={JSON.stringify(items)} />
        </div>

        {/* TOTALS */}
        <div className="flex justify-end">
           <div className="w-72 bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                <span>Tax (16%)</span>
                <span>{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-xl text-black">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="fixed bottom-6 right-6 md:right-12 z-50">
           <button type="submit" className="btn-primary shadow-2xl shadow-blue-900/40 text-lg px-8 py-4 rounded-full flex items-center gap-3">
             <Save size={24} /> Update Invoice
           </button>
        </div>

      </form>
    </div>
  )
}