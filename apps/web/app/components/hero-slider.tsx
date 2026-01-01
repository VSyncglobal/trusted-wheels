'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

// You can swap these URLs with your uploaded S3 images later
const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920",
    title: "The Standard For Premium.",
    subtitle: "A curated collection of verified pre-owned vehicles at Ridgeways.",
    link: "/inventory",
    cta: "View Inventory"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
    title: "Flexible Financing.",
    subtitle: "Drive now, pay later. Tailored plans for your budget.",
    link: "/financing",
    cta: "Calculate Payments"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1920",
    title: "Sell Your Car.",
    subtitle: "Immediate valuation and payment. No hassle.",
    link: "/sell",
    cta: "Get Offer"
  }
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"}`}
        >
           <Image 
             src={slide.image} 
             alt={slide.title} 
             fill 
             className="object-cover opacity-60"
             priority={index === 0}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col justify-end pb-24 px-6 md:px-12 max-w-[1400px] mx-auto z-10">
        <div className="max-w-4xl space-y-6">
           <div key={current} className="animate-in slide-in-from-bottom-4 fade-in duration-700">
             <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
               {SLIDES[current].title}
             </h1>
             <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-xl">
               {SLIDES[current].subtitle}
             </p>
             <div className="mt-8">
               <Link 
                 href={SLIDES[current].link}
                 className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
               >
                 {SLIDES[current].cta} <ArrowRight size={18} />
               </Link>
             </div>
           </div>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-12 right-6 md:right-12 flex gap-2">
           {SLIDES.map((_, idx) => (
             <button 
               key={idx}
               onClick={() => setCurrent(idx)}
               className={`h-1 transition-all duration-300 ${idx === current ? "w-12 bg-white" : "w-4 bg-white/30"}`}
             />
           ))}
        </div>
      </div>
    </section>
  )
}