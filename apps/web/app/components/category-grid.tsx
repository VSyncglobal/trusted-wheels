import { prisma } from "@repo/database";
import Link from "next/link";
import { Car, ChevronRight, Truck, Zap, Shield, Search } from "lucide-react";

export async function CategoryGrid() {
  // 1. Fish for the "Body Type" template (Case Insensitive)
  const bodyTypeTemplate = await prisma.featureTemplate.findFirst({
    where: { label: { equals: "Body Type", mode: "insensitive" } }
  });

  const categories = bodyTypeTemplate?.options || [];

  // Helper to map icon based on name
  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("suv") || n.includes("4x4")) return Shield;
    if (n.includes("truck") || n.includes("pickup")) return Truck;
    if (n.includes("electric") || n.includes("hybrid")) return Zap;
    return Car;
  };

  return (
    <section className="py-12 bg-white px-6 border-b border-gray-100">
       <div className="max-w-[1400px] mx-auto w-full">
         
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-black tracking-tight">Browse by Type</h2>
            <Link href="/inventory" className="text-xs font-bold uppercase text-gray-400 hover:text-black flex items-center gap-1">
               See Full Inventory <ChevronRight size={14}/>
            </Link>
         </div>

         {categories.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
               <p className="text-gray-400 font-bold text-sm">System Configuration Required</p>
               <p className="text-gray-400 text-xs mt-1">Please add "Body Type" options in the Admin Panel.</p>
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.slice(0, 5).map((cat) => {
                  const Icon = getIcon(cat);
                  return (
                    <Link 
                      key={cat} 
                      href={`/inventory?type=${cat}`} 
                      className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-black hover:bg-white hover:shadow-lg transition-all"
                    >
                       <div className="p-3 bg-white rounded-full text-gray-400 group-hover:text-black group-hover:bg-gray-100 transition-colors shadow-sm">
                         <Icon size={24} strokeWidth={2} />
                       </div>
                       <span className="text-sm font-bold text-gray-600 group-hover:text-black text-center">{cat}</span>
                    </Link>
                  )
                })}
                
                {/* View All Card */}
                <Link href="/inventory" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-gray-400 hover:text-black">
                   <div className="p-3"><Search size={24}/></div>
                   <span className="text-sm font-bold">More Options</span>
                </Link>
            </div>
         )}
       </div>
    </section>
  )
}