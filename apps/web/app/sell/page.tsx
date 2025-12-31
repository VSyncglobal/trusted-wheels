'use client'

import { useState, useTransition } from "react"
import { submitListingRequest } from "./actions"
// FIXED: Removed unused Loader2 import
import { ArrowRight, CheckCircle2 } from "lucide-react"

// Styles
const inputClass = "w-full border-b border-gray-300 bg-transparent py-3 text-lg text-strong-black placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1"

export default function SellPage() {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await submitListingRequest(formData)
      if (result.success) {
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        alert(result.message)
      }
    })
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-strong-black mb-4">Received.</h1>
        <p className="text-gray-500 max-w-md text-lg leading-relaxed">
          Thank you for submitting your vehicle details. <br/>
          Our acquisition team will review your submission and contact you within 24 hours.
        </p>
        <button 
           onClick={() => window.location.href = "/"}
           className="mt-8 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600"
        >
          Return Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-24 px-6">
      
      {/* Header */}
      <div className="mb-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-strong-black mb-6">
          Sell Your Car.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
          We are always looking for premium inventory. 
          Fill out the form below to receive a competitive valuation. 
          Seamless process. Immediate payment.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-16">
        
        {/* Section 1: Vehicle */}
        <section className="space-y-8">
           <h2 className="text-sm font-bold text-strong-black border-l-2 border-black pl-4">1. The Vehicle</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <label className={labelClass}>Make</label>
                <input name="make" required placeholder="e.g. Mercedes-Benz" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Model</label>
                <input name="model" required placeholder="e.g. C-Class" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <input name="year" type="number" required placeholder="2020" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mileage (Km)</label>
                <input name="mileage" type="number" required placeholder="45,000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Condition</label>
                <select name="condition" className={inputClass}>
                   <option value="Excellent">Excellent (Like New)</option>
                   <option value="Good">Good (Minor Wear)</option>
                   <option value="Fair">Fair (Visible Wear)</option>
                   <option value="Needs Work">Needs Work</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Expected Price (KES)</label>
                <input name="price" type="number" placeholder="Optional" className={inputClass} />
              </div>
           </div>
        </section>

        {/* Section 2: Contact */}
        <section className="space-y-8">
           <h2 className="text-sm font-bold text-strong-black border-l-2 border-black pl-4">2. Your Details</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <label className={labelClass}>Full Name</label>
                <input name="name" required placeholder="John Doe" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input name="phone" required type="tel" placeholder="0700 000 000" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Email Address</label>
                <input name="email" type="email" placeholder="john@example.com" className={inputClass} />
              </div>
           </div>
        </section>

        {/* Submit */}
        <div className="pt-8">
          <button 
            type="submit" 
            disabled={isPending}
            className="group w-full md:w-auto flex items-center gap-4 bg-strong-black text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {isPending ? "Submitting..." : "Submit for Valuation"}
            {!isPending && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>

      </form>
    </div>
  )
}