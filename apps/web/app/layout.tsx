import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; 
import { Header } from "./components/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  // This sets the base domain for all pages
  metadataBase: new URL('https://trustrides.co.ke'),
  
  // CRITICAL CHANGE: Removed "alternates: { canonical: '/' }" from here.
  // We will set specific canonicals on individual pages instead.

  verification: {
    google: 'c5bf3052e24c6abd', 
    yandex: '0b50747eab7a073b', 
  },

  title: {
    default: "Trust Rides | Premium Cars for Sale in Kenya",
    template: "%s | Trust Rides Kenya",
  },
  description: "The most trusted dealership for foreign used and locally used cars in Nairobi. We stock Toyota, Subaru, Mercedes, and Land Rover. 1500cc to 4000cc verified imports.",
  applicationName: 'Trust Rides Kenya',
  authors: [{ name: 'Trust Rides Sales Team' }],
  generator: 'Next.js',
  keywords: [
    "Cars for sale Nairobi", "Cars for sale Mombasa", "Car dealers Nakuru", "Autos for sale Kisumu", "Eldoret car bazaars", "Thika Road car dealers", "Kiambu Road showrooms",
    "Toyota Kenya", "Honda Kenya", "Mazda Kenya", "Subaru Kenya", "Mercedes Benz Kenya", "Nissan Kenya", "Volkswagen Kenya", "Land Rover Kenya",
    "Buy car Kenya", "Import cars Kenya", "Car financing Nairobi", "Asset finance car loans", "Trade in cars Kenya",
    "Toyota Fielder", "Mazda Demio", "Toyota Vitz", "Subaru Forester", "Toyota Prado", "Isuzu D-Max", "Nissan Note",
    "1500cc cars for sale", "Cheap cars under 1 million", "SUV for sale Kenya", "7 Seater cars Kenya", "Hybrid cars Kenya"
  ],
  
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },

  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://trustrides.co.ke",
    siteName: "Trust Rides Kenya",
    title: "Trust Rides | Verified Cars for Sale in Nairobi",
    description: "Find your dream car in Nairobi. Verified imports, transparent pricing, and trusted service.",
    images: [{ url: "/og.image.jpg", width: 1200, height: 630, alt: "Trust Rides Premium Inventory" }],
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
        <main className="flex-1 w-full">
          {children}
        </main>
        
        <footer className="py-8 text-center text-[10px] text-gray-400 uppercase tracking-widest border-t border-gray-200 mt-12 bg-white">
          <div className="mb-4 space-x-4">
             <a href="/blog" className="hover:text-black transition-colors">Blog & Reviews</a>
             <a href="/inventory" className="hover:text-black transition-colors">Inventory</a>
             <a href="/contact" className="hover:text-black transition-colors">Contact</a>
          </div>
          <div>
            © {new Date().getFullYear()} Trust Rides. Nairobi, Kenya.
          </div>
        </footer>
      </body>
    </html>
  );
}