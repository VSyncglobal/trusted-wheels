'use client'

import Link from "next/link";
import { Car, Truck, Zap, Activity } from "lucide-react";
import { useEffect, useState } from "react";

// Fallback data
const DEFAULT_CATEGORIES = [
  "SUV", "Sedan", "Pickup Truck", "Crossover", "Hatchback", "Coupe"
];

function getIcon(name: string) {
  if (name.includes("Truck")) return Truck;
  if (name.includes("Electric")) return Zap;
  return Car;
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<string[]>([]); // Initialize empty

  // FIX: Using DEFAULT_CATEGORIES as initial state prevents the need for an effect
  // But if we want to simulate fetching, we keep the effect
  useEffect(() => {
    // If fetching logic existed, it would go here.
    // Since we are using static defaults for now, we can just set them directly
    setCategories(DEFAULT_CATEGORIES);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
         
         <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-4xl font-extrabold text-black tracking-tight mb-2">Browse by Type</h2>
               <p className="text-gray-500 font-medium">Find the perfect match for your lifestyle.</p>
            </div>
            <Link href="/inventory" className="text-sm font-bold text-blue-600 hover:text-black transition-colors uppercase tracking-widest flex items-center gap-2">
               View All Inventory <Activity size={16}/>
            </Link>
         </div>

         {categories.length === 0 ? (
            <div className="p-12 text-center bg-gray-50 rounded-3xl">
               <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {categories.slice(0, 5).map((cat) => {
                  const Icon = getIcon(cat);
                  return (
                     <Link 
                       key={cat} 
                       href={`/inventory?type=${cat}`}
                       className="group flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-black hover:text-white p-8 rounded-[2rem] transition-all duration-300"
                     >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                           <Icon size={28} strokeWidth={1.5} />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-wider">{cat}</span>
                     </Link>
                  )
               })}
               <Link 
                 href="/inventory"
                 className="group flex flex-col items-center justify-center gap-4 bg-blue-50 hover:bg-blue-600 hover:text-white p-8 rounded-[2rem] transition-all duration-300"
               >
                  <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                     <Activity size={28} strokeWidth={1.5} />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-wider">View All</span>
               </Link>
            </div>
         )}

      </div>
    </section>
  )
}