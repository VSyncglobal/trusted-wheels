import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6 pointer-events-none">
      {/* The Container: 
         - Pointer-events-auto allows clicking links while header lets clicks pass through sides 
         - Backdrop blur + minimal opacity for "Floating" feel
      */}
      <nav className="pointer-events-auto flex items-center gap-12 px-8 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/20">
        
        {/* Left Nav: The Core Marketplace Actions (Buy & Sell) */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/inventory" className="hover:text-black transition-colors">Inventory</Link>
          <Link href="/sell" className="hover:text-black transition-colors">Sell Your Car</Link>
        </div>

        {/* Logo (Center) */}
        <Link href="/" className="text-xl font-bold tracking-tighter text-black">
          Trust Rides
        </Link>

        {/* Right Nav: Services & Support */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/financing" className="hover:text-black transition-colors">Financing</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
        </div>
        
        {/* Mobile Menu Icon (Placeholder) */}
        <div className="md:hidden w-6 h-6 bg-black rounded-full" />
      </nav>
    </header>
  );
}