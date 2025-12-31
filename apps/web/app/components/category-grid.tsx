import { prisma } from "@repo/database";
import Link from "next/link";
import { Car, ChevronRight, Truck, Zap, Shield } from "lucide-react";

export async function CategoryGrid() {
  // 1. Fish for the "Body Type" template
  const bodyTypeTemplate = await prisma.featureTemplate.findFirst({
    where: { 
      label: { equals: "Body Type", mode: "insensitive" } 
    }
  });

  // 2. Extract options, or default to empty if not found
  const categories = bodyTypeTemplate?.options || [];

  // Helper to map icon based on name (Optional visual flair)
  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("suv") || n.includes("4x4")) return Shield;
    if (n.includes("truck") || n.includes("pickup")) return Truck;
    if (n.includes("electric") || n.includes("hybrid")) return Zap;
    return Car;
  };

  return (
    <section className="py-12 bg-white px-6">
       <div className="flex items-center justify-between mb-8 max-w-[1400px] mx-auto w-full">
         <h2 className="text-2xl font-bold text-black tracking-tight">Browse by Type</h2>
       </div>

       {categories.length === 0 ? (
         <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed">
            <p className="text-gray-400">Configure "Body Type" in Admin Panel to see categories here.</p>
         </div>
       ) : (
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[1400px] mx-auto">
            {categories.slice(0, 5).map((cat) => {
              const Icon = getIcon(cat);
              return (
                <Link 
                  key={cat} 
                  href={`/inventory?type=${cat}`} // Filters inventory by this type
                  className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-black hover:bg-white hover:shadow-lg transition-all"
                >
                   <div className="p-3 bg-white rounded-full text-gray-400 group-hover:text-black group-hover:bg-gray-100 transition-colors shadow-sm">
                     <Icon size={24} strokeWidth={2} />
                   </div>
                   <span className="text-sm font-bold text-gray-600 group-hover:text-black">{cat}</span>
                </Link>
              )
            })}
            
            <Link href="/inventory" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-gray-400 hover:text-black">
               <div className="p-3"><ChevronRight size={24}/></div>
               <span className="text-sm font-bold">View All</span>
            </Link>
         </div>
       )}
    </section>
  )
}