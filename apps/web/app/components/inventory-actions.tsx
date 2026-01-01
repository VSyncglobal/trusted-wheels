'use client'

import { useState, useEffect } from "react"
import { Calculator, MessageCircle, X, Check, Share2 } from "lucide-react"

interface InventoryActionsProps {
  price: number
  vehicleName: string
  stockNumber: string
  vehicleId?: string
}

export function InventoryActions({ price, vehicleName, stockNumber }: InventoryActionsProps) {
  const [activeModal, setActiveModal] = useState<"NONE" | "FINANCE" | "INQUIRY">("NONE")
  const [copied, setCopied] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModal !== "NONE") {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => { document.body.style.overflow = "auto" }
  }, [activeModal])

  const handleShare = async () => {
    const shareData = {
      title: vehicleName,
      text: `Check out this ${vehicleName} (Stock: ${stockNumber}) on Trust Rides.`,
      url: window.location.href,
    }

    // 1. Try Native Mobile Share (Best for Phones)
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        console.log("Error sharing:", err)
      }
    }

    // 2. Fallback to Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      } catch (err) {
        console.error("Clipboard API failed:", err)
      }
    }

    // 3. Fallback for older browsers / non-secure contexts (e.g., local dev IP)
    try {
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      
      // Avoid scrolling to bottom
      textArea.style.top = "0"
      textArea.style.left = "0"
      textArea.style.position = "fixed"

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (successful) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error("Fallback copy failed:", err)
      alert("Unable to copy link manually.")
    }
  }

  return (
    <>
      {/* 1. THE ACTION BUTTONS */}
      <div className="mt-auto pt-10 space-y-4">
        <button 
          onClick={() => setActiveModal("INQUIRY")}
          className="w-full bg-black text-white h-14 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} /> Enquire Now
        </button>
        <div className="flex gap-4">
          <button 
            onClick={handleShare}
            className="flex-1 border border-gray-200 h-12 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? <Check size={14} className="text-green-600"/> : <Share2 size={14} />} 
            {copied ? "Copied" : "Share"}
          </button>
          <button 
            onClick={() => setActiveModal("FINANCE")}
            className="flex-1 border border-gray-200 h-12 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Calculator size={14} /> Finance
          </button>
        </div>
      </div>

      {/* 2. THE MODAL OVERLAY */}
      {activeModal !== "NONE" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setActiveModal("NONE")}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveModal("NONE")}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* A. FINANCE CALCULATOR */}
            {activeModal === "FINANCE" && (
              <FinanceCalculator price={price} />
            )}

            {/* B. INQUIRY FORM */}
            {activeModal === "INQUIRY" && (
              <InquiryForm vehicleName={vehicleName} stockNumber={stockNumber} />
            )}
          </div>
        </div>
      )}
    </>
  )
}

// --- SUB-COMPONENT: FINANCE CALCULATOR ---
function FinanceCalculator({ price }: { price: number }) {
  const [deposit, setDeposit] = useState(price * 0.2) // 20% default
  const [months, setMonths] = useState(48) // 4 years
  const [rate, setRate] = useState(13) // 13% interest

  // Simple PMT Formula
  const calculateMonthly = () => {
    const principal = price - deposit
    const monthlyRate = rate / 100 / 12
    if (monthlyRate === 0) return principal / months
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  }

  const monthlyPayment = calculateMonthly()

  return (
    <div className="p-8">
      <h3 className="text-xl font-bold text-black mb-1">Finance Calculator</h3>
      <p className="text-xs text-gray-500 mb-6">Estimate your monthly repayments.</p>

      <div className="space-y-6">
        <div>
           <div className="flex justify-between text-xs font-bold uppercase text-gray-400 mb-2">
             <span>Vehicle Price</span>
             <span>KES {price.toLocaleString()}</span>
           </div>
           <div className="h-1 bg-gray-100 rounded-full w-full" />
        </div>

        <div>
           <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Deposit (KES)</label>
           <input 
             type="number" 
             value={deposit}
             onChange={(e) => setDeposit(Number(e.target.value))}
             className="w-full p-3 border border-gray-200 rounded-sm font-medium focus:border-black outline-none transition-colors"
           />
           <input 
             type="range" min="0" max={price} step="10000"
             value={deposit} onChange={(e) => setDeposit(Number(e.target.value))}
             className="w-full mt-3 accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
           />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Duration (Months)</label>
              <select 
                value={months} 
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-sm bg-white font-medium focus:border-black outline-none"
              >
                {[12, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m} Months</option>)}
              </select>
           </div>
           <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Interest Rate (%)</label>
              <input 
                type="number" 
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-sm font-medium focus:border-black outline-none"
              />
           </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 text-center">
           <p className="text-xs font-bold uppercase text-gray-400 mb-1">Estimated Monthly Payment</p>
           <p className="text-3xl font-bold text-black">
             KES {Math.round(monthlyPayment).toLocaleString()}
           </p>
           <p className="text-[10px] text-gray-400 mt-2">
             *Estimates only. Subject to bank approval.
           </p>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENT: INQUIRY FORM ---
function InquiryForm({ vehicleName, stockNumber }: { vehicleName: string, stockNumber: string }) {
  const sendWhatsApp = () => {
    const PHONE_NUMBER = "254705124564" 
    const message = `Hi, I am interested in the ${vehicleName} (Stock: ${stockNumber}). Is it still available?`
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="p-8">
       <h3 className="text-xl font-bold text-black mb-1">Make an Inquiry</h3>
       <p className="text-xs text-gray-500 mb-8">Speak directly to our sales team.</p>
       
       <div className="space-y-4">
          <button 
            onClick={sendWhatsApp}
            className="w-full bg-[#25D366] text-white h-14 rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-colors shadow-sm"
          >
            <MessageCircle className="fill-white" /> Continue to WhatsApp
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase bg-white px-2 text-gray-400">Or Call Us</div>
          </div>

          <a 
            href="tel:+254705124564"
            className="w-full border border-gray-200 text-black h-14 rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
          >
            +254 705 124 564
          </a>
       </div>
    </div>
  )
}