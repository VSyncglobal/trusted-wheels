'use client'

import { useState } from "react"
import { createInvoice } from "../actions"
import { Plus, Trash2, Save, FileText } from "lucide-react"

export default function CreateInvoicePage() {
  const [items, setItems] = useState([{ id: 1, desc: "", qty: 1, price: 0 }])

  const addItem = () => {
    setItems([...items, { id: Date.now(), desc: "", qty: 1, price: 0 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  // Live Calculations
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0)
  const tax = subtotal * 0.16
  const total = subtotal + tax

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
          <p className="text-sm text-gray-500">Create a commercial invoice</p>
        </div>
        <div className="text-right">
           <p className="text-xs font-bold uppercase text-gray-400">Date</p>
           <p className="font-mono text-gray-900">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <form action={createInvoice} className="space-y-8">
        
        {/* 1. Client Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 gap-6">
           <h3 className="col-span-2 text-sm font-bold uppercase text-gray-400 border-b border-gray-100 pb-2">Bill To</h3>
           <input name="clientName" required placeholder="Client Name / Company" className="p-2 border rounded" />
           <input name="clientKRA" placeholder="KRA PIN" className="p-2 border rounded" />
           <input name="clientEmail" type="email" placeholder="Email Address" className="p-2 border rounded" />
           <input name="clientPhone" required placeholder="Phone Number" className="p-2 border rounded" />
           <div className="col-span-2">
             <label className="text-xs font-bold uppercase text-gray-400">Due Date</label>
             <input name="dueDate" type="date" required className="w-full p-2 border rounded mt-1" />
           </div>
        </div>

        {/* 2. Line Items */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold uppercase text-gray-400">Line Items</h3>
              <button type="button" onClick={addItem} className="text-xs font-bold flex items-center gap-1 bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
                <Plus size={12} /> Add Item
              </button>
           </div>
           
           <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                   <input 
                     placeholder="Description (e.g. 2020 Mercedes Benz C200)" 
                     className="flex-1 p-2 border rounded text-sm"
                     value={item.desc}
                     onChange={(e) => updateItem(item.id, "desc", e.target.value)}
                   />
                   <input 
                     type="number" placeholder="Qty" className="w-20 p-2 border rounded text-sm"
                     value={item.qty}
                     onChange={(e) => updateItem(item.id, "qty", parseInt(e.target.value))}
                   />
                   <input 
                     type="number" placeholder="Price" className="w-32 p-2 border rounded text-sm"
                     value={item.price}
                     onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value))}
                   />
                   <button type="button" onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}
           </div>
           
           {/* Hidden input to pass items to server action */}
           <input type="hidden" name="items" value={JSON.stringify(items)} />
        </div>

        {/* 3. Totals */}
        <div className="flex justify-end">
           <div className="w-64 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (16%)</span>
                <span>{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
           <button type="button" className="px-6 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Save Draft</button>
           <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
             <Save size={18} /> Generate Invoice
           </button>
        </div>

      </form>
    </div>
  )
}