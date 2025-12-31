import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for clean, Swiss-style typography
import { Header } from "./components/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Trust Rides | Premium Auto Dealership",
  description: "Curated selection of premium vehicles.",
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