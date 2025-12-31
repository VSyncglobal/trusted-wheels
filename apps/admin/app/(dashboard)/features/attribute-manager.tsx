'use client'

import { useState } from "react"
import { Plus, X, Tag } from "lucide-react"
import { addAttribute, removeAttribute } from "./actions"

export function AttributeManager({ 
  title, 
  type, 
  items 
}: { 
  title: string, 
  type: string, 
  items: { id: string, value: string }[] 
}) {
  const [newValue, setNewValue] = useState("")
  const [isPending, setIsPending] = useState(false)

  const handleAdd = async () => {
    if (!newValue.trim()) return
    setIsPending(true)
    await addAttribute(type, newValue)
    setNewValue("")
    setIsPending(false)
  }

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
       <div className="flex items-center gap-3 mb-6">
         <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
            <Tag size={20} />
         </div>
         <h3 className="font-extrabold text-black text-lg">{title}</h3>
       </div>

       {/* List of Tags */}
       <div className="flex flex-wrap gap-2 mb-6 min-h-[60px]">
          {items.map((item) => (
            <div key={item.id} className="group flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:border-red-200 hover:bg-red-50 transition-all">
               {item.value}
               <button 
                 onClick={() => removeAttribute(item.id)}
                 className="text-gray-300 hover:text-red-500 transition-colors"
               >
                 <X size={14} />
               </button>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-400 italic py-2">No items yet.</p>}
       </div>

       {/* Add Input */}
       <div className="flex gap-2">
         <input 
           value={newValue}
           onChange={(e) => setNewValue(e.target.value)}
           placeholder={`Add new ${title.toLowerCase()}...`}
           className="flex-1 bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-colors"
           onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
         />
         <button 
           onClick={handleAdd} 
           disabled={isPending}
           className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
         >
           <Plus size={20} />
         </button>
       </div>
    </div>
  )
}