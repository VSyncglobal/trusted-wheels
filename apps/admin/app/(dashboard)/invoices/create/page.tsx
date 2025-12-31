'use client'

import { useState } from "react"
import { createInvoiceAction } from "../actions"
import { Plus, Trash2, Save, FileText, CheckSquare, Square } from "lucide-react"

export default function CreateInvoicePage() {
  // FIX: Type the state explicitly
  const [items, setItems] = useState<any[]>([{ id: Date.now(), desc: "", qty: 1, price: 0 }])
  const [isTaxable, setIsTaxable] = useState(true) 
  const [isPending, setIsPending] = useState(false)

  const addItem = () => setItems([...items, { id: Date.now(), desc: "", qty: 1, price: 0 }])
  const removeItem = (id: number) => setItems(items.filter((i) => i.id !== id))
  
  // FIX: Explicitly type 'i'
  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map((i: any) => i.id === id ? { ...i, [field]: value } : i))
  }

  // Calculations
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0)
  const taxRate = isTaxable ? 0.16 : 0 
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    formData.append("items", JSON.stringify(items))
    formData.append("subtotal", subtotal.toString())
    formData.append("tax", tax.toString())
    formData.append("total", total.toString())
    
    await createInvoiceAction(formData)
    setIsPending(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><FileText size={24}/></div>
        <div><h1 className="text-3xl font-extrabold text-black">New Invoice</h1><p className="text-gray-500 font-medium">Create and send billings.</p></div>
      </div>

      <form action={handleSubmit} className="space-y-8">
        
        {/* CLIENT DETAILS */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 grid grid-cols-2 gap-6">
           <h3 className="col-span-2 text-xs font-extrabold uppercase text-gray-400 border-b border-gray-200 pb-2">Client Details</h3>
           <input name="clientName" required placeholder="Client Name" className="input-field" />
           <input name="clientPhone" required placeholder="Phone" className="input-field" />
           <input name="clientEmail" placeholder="Email (Optional)" className="input-field" />
           <input name="clientKRA" placeholder="KRA PIN (Optional)" className="input-field" />
           <div className="col-span-2"><input name="dueDate" type="date" required className="input-field" title="Due Date" /></div>
        </div>

        {/* ITEMS */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
           <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
              <h3 className="text-xs font-extrabold uppercase text-gray-400">Line Items</h3>
              <button type="button" onClick={addItem} className="text-xs font-bold flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800"><Plus size={12} /> Add Item</button>
           </div>
           <div className="space-y-4">
              {/* FIX: Explicitly type 'item' in loop */}
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center">
                   <input placeholder="Description" className="input-field text-sm" value={item.desc} onChange={(e) => updateItem(item.id, "desc", e.target.value)} />
                   <input type="number" placeholder="Qty" className="input-field w-20 text-sm text-center" value={item.qty} onChange={(e) => updateItem(item.id, "qty", parseInt(e.target.value))} />
                   <input type="number" placeholder="Price" className="input-field w-32 text-sm text-right" value={item.price} onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value))} />
                   <button type="button" onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                </div>
              ))}
           </div>
        </div>

        {/* TOTALS & TAX TOGGLE */}
        <div className="flex justify-end">
           <div className="w-80 bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm space-y-4">
              
              <button 
                type="button" 
                onClick={() => setIsTaxable(!isTaxable)}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                 {isTaxable ? <CheckSquare size={20} className="text-blue-600"/> : <Square size={20} className="text-gray-400"/>}
                 <span className="text-sm font-bold text-gray-700">Apply VAT (16%)</span>
              </button>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500 font-bold"><span>Subtotal</span><span>{subtotal.toLocaleString()}</span></div>
                <div className={`flex justify-between text-sm font-bold ${isTaxable ? 'text-gray-500' : 'text-gray-300 line-through'}`}>
                    <span>Tax (16%)</span><span>{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-xl text-black">
                    <span>Total</span><span>KES {total.toLocaleString()}</span>
                </div>
              </div>
           </div>
        </div>

        <div className="fixed bottom-6 right-6 z-50">
           <button disabled={isPending} type="submit" className="btn-primary shadow-2xl shadow-blue-900/40 text-lg px-8 py-4 rounded-full flex items-center gap-3">
             <Save size={24} /> {isPending ? "Saving..." : "Create Invoice"}
           </button>
        </div>
      </form>
    </div>
  )
}