'use client'

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

export function VehicleGallery({ images }: { images: any[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Handle Keyboard Navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isModalOpen) return
    if (e.key === "Escape") setIsModalOpen(false)
    if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [isModalOpen, images.length])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-[2rem] text-gray-400 font-bold uppercase tracking-widest">
        No Images Available
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        
        {/* MAIN CANVAS (Click to Open Lightbox) */}
        <div 
          className="relative aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] bg-gray-100 border border-gray-200 shadow-sm group cursor-zoom-in"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={images[selectedIndex].url}
            alt="Vehicle Main View"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          
          {/* Zoom Hint Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
             <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                <ZoomIn size={16} className="text-black"/>
                <span className="text-xs font-bold text-black uppercase tracking-widest">Expand View</span>
             </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest pointer-events-none">
             {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {/* THUMBNAIL STRIP */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                idx === selectedIndex 
                  ? 'border-blue-600 shadow-lg scale-105 ring-2 ring-blue-100' 
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
              }`}
            >
              <Image 
                src={img.url} 
                alt={`View ${idx + 1}`} 
                fill 
                className="object-cover" 
              />
            </button>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
           
           {/* Close Button */}
           <button 
             onClick={() => setIsModalOpen(false)}
             className="absolute top-6 right-6 z-[70] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
           >
             <X size={24} />
           </button>

           {/* Navigation Buttons (Desktop) */}
           <button 
             onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
             className="absolute left-6 z-[70] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors hidden md:block"
           >
             <ChevronLeft size={32} />
           </button>

           <button 
             onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
             className="absolute right-6 z-[70] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors hidden md:block"
           >
             <ChevronRight size={32} />
           </button>

           {/* Main Image Container */}
           <div className="relative w-full h-full max-w-[90vw] max-h-[85vh] flex items-center justify-center">
              <Image
                src={images[selectedIndex].url}
                alt="Expanded View"
                fill
                className="object-contain"
                quality={100}
                priority
              />
           </div>

           {/* Mobile Footer Nav */}
           <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 md:hidden z-[70]">
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
                className="p-4 bg-white/20 text-white rounded-full"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
                className="p-4 bg-white/20 text-white rounded-full"
              >
                <ChevronRight size={24} />
              </button>
           </div>

           {/* Counter */}
           <div className="absolute top-6 left-6 text-white/50 font-mono text-sm z-[70]">
              {selectedIndex + 1} / {images.length}
           </div>

        </div>
      )}
    </>
  )
}