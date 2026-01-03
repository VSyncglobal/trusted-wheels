import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import { Header } from "./components/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://trustrides.co.ke'),
  title: {
    default: "Trust Rides | Premium Cars for Sale in Kenya",
    template: "%s | Trust Rides Kenya",
  },
  description: "The most trusted dealership for foreign used and locally used cars in Nairobi. We stock Toyota, Subaru, Mercedes, and Land Rover. 1500cc to 4000cc verified imports.",
  keywords: [
    // --- INTENT ---
    "Buy car Kenya", "Cars for sale Nairobi", "Import car to Kenya", "Car financing Kenya", "Asset finance car loans",
    // --- POPULAR MODELS (2025 Trends) ---
    "Toyota Fielder for sale", "Mazda Demio price Kenya", "Toyota Vitz for sale Nairobi", "Subaru Forester XT", "Toyota Prado TX", "Isuzu D-Max for sale", "Nissan Note e-Power",
    // --- BUDGET & CATEGORY ---
    "Cars under 1 million Kenya", "Cheap cars for sale", "SUV for sale Kenya", "7 Seater cars Kenya", "Hybrid cars Kenya", "Manual cars for sale",
    // --- LOCATIONS ---
    "Car dealers Kiambu Road", "Cars for sale Mombasa", "Car bazaar Nakuru", "Eldoret car dealers",
    // --- TRUST & SERVICES ---
    "Verified used cars", "Car import duty calculator", "NTSA transfer Kenya", "Car valuation services", "Trust Rides"
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://trustrides.co.ke",
    siteName: "Trust Rides Kenya",
    title: "Trust Rides | Verified Cars for Sale in Nairobi",
    description: "Find your dream car in Nairobi. Verified imports, transparent pricing, and trusted service.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Trust Rides Premium Inventory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust Rides Kenya",
    description: "Premium cars for sale in Nairobi. Verified history and transparent pricing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-off-white min-h-screen flex flex-col`}>
        <Header />
        {/* Main content with padding for fixed header */}
        <main className="flex-1 w-full">
          {children}
        </main>
        
        {/* SEO FOOTER: Traffic Magnets for High Visibility */}
        <footer className="py-12 text-center text-[10px] text-gray-400 uppercase tracking-widest border-t border-gray-200 mt-12 bg-white">
          <div className="max-w-5xl mx-auto px-6 mb-6">
             <p className="mb-3 font-bold text-gray-900">Trending Searches</p>
             <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] text-gray-500">
                <span>NTSA TIMS Account</span> • 
                <span>Fuel Prices in Kenya Today</span> • 
                <span>Traffic Fines Kenya</span> • 
                <span>Import Duty Calculator</span> • 
                <span>Car Insurance Rates</span> • 
                <span>Toyota Vitz vs Mazda Demio</span> •
                <span>Best First Car in Kenya</span>
             </div>
          </div>
          <div className="border-t border-gray-100 pt-6">
            © {new Date().getFullYear()} Trust Rides. Nairobi, Kenya.
          </div>
        </footer>
      </body>
    </html>
  );
}