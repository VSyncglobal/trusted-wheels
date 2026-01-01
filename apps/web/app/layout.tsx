import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for clean, Swiss-style typography
import { Header } from "./components/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://trustrides.co.ke'), // Replace with your actual live domain
  title: {
    default: "Trust Rides | Premium Cars for Sale in Kenya",
    template: "%s | Trust Rides Kenya",
  },
  description: "Discover reliable foreign used and locally used cars for sale in Nairobi. We stock high-quality Toyota, Mercedes, BMW, and Land Rovers with verified history.",
  keywords: [
    "Cars for sale Kenya", 
    "Car dealers Nairobi", 
    "Buy cars Kenya", 
    "Import cars Kenya", 
    "Toyota Prado Kenya", 
    "Mercedes Benz Kenya", 
    "Luxury cars Nairobi",
    "Trust Rides",
    "Used cars Kenya"
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://trustrides.co.ke",
    siteName: "Trust Rides Kenya",
    title: "Trust Rides | Premium Cars for Sale in Kenya",
    description: "Find your dream car in Nairobi. Verified imports, transparent pricing, and trusted service.",
    images: [
      {
        url: "/og-image.jpg", // Ensure you add an image at public/og-image.jpg
        width: 1200,
        height: 630,
        alt: "Trust Rides Premium Inventory",
      },
    ],
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
        {/* Main content has padding-top to account for the fixed header visual space */}
        <main className="flex-1 pt-32 px-6 pb-20 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
        
        <footer className="py-12 text-center text-xs text-gray-400 uppercase tracking-widest border-t border-gray-200 mx-6">
          © {new Date().getFullYear()} Trust Rides. Nairobi, Kenya.
        </footer>
      </body>
    </html>
  );
}