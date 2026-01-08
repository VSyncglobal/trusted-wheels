'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

// Slide data
const SLIDES = [
  {
    id: 1,
    // OLD IMAGE 2 (Moved to 1)
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
    title: "The Standard For Premium.",
    subtitle: "A curated collection of verified pre-owned vehicles at Ridgeways.",
    link: "/inventory",
    cta: "View Inventory"
  },
  {
    id: 2,
    // OLD IMAGE 3 (Moved to 2)
    image: "https://images.unsplash.com/photo-1714213624189-9a9fc8a0736a?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Flexible Financing.",
    subtitle: "Drive now, pay later. Tailored plans for your budget.",
    link: "/financing",
    cta: "Calculate Payments"
  },
  {
    id: 3,
    // OLD IMAGE 1 (Moved to 3)
    image: "https://pub-bcbae634d5ab431596deadb2dad2322e.r2.dev/vehicles/WhatsApp%20Image%202026-01-02%20at%2012.59.55%20AM.jpeg",
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
    <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-black">
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"}`}
        >
          <Image 
            src={slide.image} 
            alt={slide.title} 
            fill 
            // UPDATED LOGIC:
            // Index 2 (3rd slide) is aligned to the CENTER.
            // Index 0 & 1 (1st and 2nd slides) remain aligned to the BOTTOM.
            className={`opacity-60 object-cover ${index === 2 ? "object-center" : "object-bottom"}`}
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6 md:px-12 max-w-[1400px] mx-auto z-10">
        <div className="max-w-4xl space-y-2">
          <div key={current} className="animate-in slide-in-from-bottom-4 fade-in duration-700">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white leading-tight">
              {SLIDES[current].title}
            </h1>
            <p className="text-sm md:text-base text-gray-300 mt-2 max-w-lg">
              {SLIDES[current].subtitle}
            </p>
            <div className="mt-4">
              <Link 
                href={SLIDES[current].link}
                className="inline-flex items-center gap-2 bg-white text-black px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-sm"
              >
                {SLIDES[current].cta} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-6 right-6 flex gap-1.5">
          {SLIDES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-0.5 transition-all duration-300 ${idx === current ? "w-8 bg-white" : "w-3 bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}