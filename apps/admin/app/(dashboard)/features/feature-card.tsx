'use client'

import { useState, useTransition } from "react"
import { Trash, Plus, X } from "lucide-react"
import { addOptionToTemplate, removeOptionFromTemplate, deleteTemplate } from "./actions"

export function FeatureCard({ template }: { template: any }) {
  const [isPending, startTransition] = useTransition()
  const [newOption, setNewOption] = useState("")

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOption) return
    startTransition(async () => {
       await addOptionToTemplate(template.id, newOption)
       setNewOption("")
    })
  }

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <h4 className="font-extrabold text-black text-lg">{template.label}</h4>
          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{template.options.length} items</span>
        </div>
        <button 
            onClick={() => { if(confirm("Delete entire category?")) startTransition(() => deleteTemplate(template.id)) }} 
            className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
            <Trash size={16} />
        </button>
      </div>
      
      {/* Options List */}
      <div className="flex flex-wrap gap-2 mb-6 flex-1 content-start">
        {template.options.map((opt: string, i: number) => (
          <span key={i} className="group/tag flex items-center gap-1 text-xs font-bold bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg shadow-sm hover:border-red-200 hover:bg-red-50 transition-colors">
            {opt}
            <button 
                disabled={isPending}
                onClick={() => startTransition(() => removeOptionFromTemplate(template.id, opt))}
                className="text-gray-300 hover:text-red-500 ml-1 opacity-0 group-hover/tag:opacity-100 transition-opacity"
            >
                <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Add New Option Input */}
      <form onSubmit={handleAddOption} className="relative mt-auto">
        <input 
            type="text" 
            placeholder="Add sub-feature..." 
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            disabled={isPending}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <button 
            type="submit" 
            disabled={!newOption || isPending}
            className="absolute right-2 top-2 p-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-0"
        >
            <Plus size={14} />
        </button>
      </form>
    </div>
  )
}