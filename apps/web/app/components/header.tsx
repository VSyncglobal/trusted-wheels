'use client'

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 px-4 pointer-events-none">
      
      {/* Navbar Container */}
      <nav className="pointer-events-auto relative flex items-center justify-between gap-6 md:gap-12 px-6 py-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-gray-100 w-auto max-w-full">
        
        {/* Left Nav (Desktop) */}
        <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-500">
          <Link href="/inventory" className="hover:text-black transition-colors">Inventory</Link>
          <Link href="/sell" className="hover:text-black transition-colors">Sell</Link>
        </div>

        {/* Logo */}
        <Link 
          href="/" 
          className="text-lg font-extrabold tracking-tighter text-black shrink-0" 
          onClick={() => setIsOpen(false)}
        >
          Trust Rides
        </Link>

        {/* Right Nav (Desktop) */}
        <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-500">
          <Link href="/financing" className="hover:text-black transition-colors">Financing</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1 text-black hover:bg-gray-100 rounded-full transition-colors ml-2"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="pointer-events-auto mt-2 w-full max-w-[260px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex flex-col p-1.5">
            <Link 
              href="/inventory" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors text-center uppercase tracking-widest"
            >
              Inventory
            </Link>
            <Link 
              href="/sell" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors text-center uppercase tracking-widest"
            >
              Sell Your Car
            </Link>
            <Link 
              href="/financing" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors text-center uppercase tracking-widest"
            >
              Financing
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors text-center uppercase tracking-widest"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}