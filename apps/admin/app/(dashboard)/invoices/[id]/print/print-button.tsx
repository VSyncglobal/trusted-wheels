'use client'

import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 flex items-center gap-2 transition-colors"
    >
      <Printer size={16} /> Print PDF
    </button>
  )
}