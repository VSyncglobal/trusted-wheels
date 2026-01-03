'use client'

import Link from "next/link";
import { Car, Truck, Zap, Box, Key, Bus } from "lucide-react";
import { useState } from "react";

// UPDATED: Categories tailored exactly to your provided data rules
const CATEGORIES = [
  "SUV",
  "Hatchback(kadudu)",
  "Station Wagon",
  "Crossover",
  "Van",
  "Van / Minivan",
  "Pickup / Double Cab",
  "Truck",
  "Sedan (Saloon)"
];

function getIcon(name: string) {
  const n = name.toLowerCase();
  
  if (n.includes("pickup") || n.includes("truck")) return Truck;
  if (n.includes("van") || n.includes("minivan")) return Bus; // Using Bus icon for Vans/Minivans for distinction
  if (n.includes("electric")) return Zap;
  // Specific check for the tailored hatchback name
  if (n.includes("hatchback")) return Box; 
  if (n.includes("station wagon")) return Car; // Station wagons often look like long cars
  if (n.includes("sedan") || n.includes("saloon")) return Car;
  if (n.includes("suv") || n.includes("crossover")) return Car;
  
  return Car;
}

export function CategoryGrid() {
  const [categories] = useState<string[]>(CATEGORIES);

  return (
    <section className="py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-4">
         
         {/* Flex container with horizontal scroll for mobile, centered content */}
         <div className="flex items-center justify-between overflow-x-auto gap-2 scrollbar-hide">
            <h2 className="text-xs font-extrabold text-black uppercase tracking-wider shrink-0 mr-4 hidden md:block">
              Browse Type
            </h2>

            <div className="flex gap-2 min-w-max">
               {categories.map((cat) => {
                  const Icon = getIcon(cat);
                  // Clean up display label if needed, or keep exactly as is. 
                  // Keeping "Hatchback(tududu)" as requested, but maybe "Hatchback" is cleaner for UI? 
                  // The prompt implies "hatchbacks will filter to hatchbacks(tududu)", likely meaning the link value.
                  // For now, I will display the full name to ensure accuracy with your specific request, 
                  // but you can change the children of the span to `cat.split('(')[0]` if you want cleaner labels.
                  return (
                     <Link 
                       key={cat} 
                       href={`/inventory?type=${encodeURIComponent(cat)}`}
                       className="group flex items-center gap-2 bg-gray-50 hover:bg-black hover:text-white px-3 py-2 rounded-lg transition-all duration-200 border border-transparent"
                     >
                        <Icon size={14} className="text-gray-400 group-hover:text-white" />
                        <span className="font-bold text-[10px] uppercase tracking-wide">{cat}</span>
                     </Link>
                  )
               })}
            </div>
            
             <Link href="/inventory" className="text-[10px] font-bold text-blue-600 hover:text-black uppercase shrink-0 ml-4 hidden md:block">
               View All
            </Link>
         </div>

      </div>
    </section>
  )
}