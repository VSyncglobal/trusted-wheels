import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

// Use Geist Sans/Mono if available, or system fonts for now
export const metadata: Metadata = {
  title: "Admin | Trusted Wheels",
  description: "Dealership Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-subtle-black antialiased font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 ml-64 p-8 bg-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}