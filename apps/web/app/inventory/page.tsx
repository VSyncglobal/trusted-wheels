import { prisma } from "@repo/database";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

// Helper to fetch unique brands for the filter sidebar
async function getBrands() {
  const result = await prisma.vehicle.groupBy({
    by: ['make'],
    where: { status: 'PUBLISHED' },
    _count: true
  });
  return result.map(r => ({ label: r.make, count: r._count }));
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; make?: string; q?: string; min?: string; max?: string }>;
}) {
  const params = await searchParams;
  
  // 1. Build the Intelligent Query
  const where: any = { status: "PUBLISHED" };

  if (params.type) where.bodyType = { equals: params.type, mode: 'insensitive' };
  if (params.make) where.make = { equals: params.make, mode: 'insensitive' };
  if (params.q) {
    where.OR = [
      { make: { contains: params.q, mode: 'insensitive' } },
      { model: { contains: params.q, mode: 'insensitive' } }
    ];
  }
  
  // Price Range Logic
  if (params.min || params.max) {
    where.listingPrice = {};
    if (params.min) where.listingPrice.gte = parseFloat(params.min);
    if (params.max) where.listingPrice.lte = parseFloat(params.max);
  }

  // 2. Fetch Data
  const [vehicles, brands] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: { images: { take: 1 }, features: true },
      orderBy: { createdAt: 'desc' }
    }),
    getBrands()
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20"> {/* pt-24 accounts for fixed navbar */}
      
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
           
           {/* --- INTELLIGENT SIDEBAR (Left) --- */}
           <aside className="w-full lg:w-64 shrink-0 space-y-8">
              
              {/* Search Box */}
              <div className="relative">
                 <form action="/inventory">
                   <input 
                     name="q" 
                     defaultValue={params.q} 
                     placeholder="Search keyword..." 
                     className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-black transition-colors"
                   />
                   <Search className="absolute left-3 top-3.5 text-gray-400" size={16}/>
                 </form>
              </div>

              {/* Brands Filter */}
              <div>
                 <h3 className="font-extrabold text-black mb-4 uppercase text-xs tracking-widest">Brands</h3>
                 <div className="space-y-2">
                    <Link 
                      href="/inventory" 
                      className={`block text-sm font-bold ${!params.make ? 'text-blue-600' : 'text-gray-500 hover:text-black'}`}
                    >
                      All Brands
                    </Link>
                    {brands.map(b => (
                      <Link 
                        key={b.label} 
                        href={`/inventory?make=${b.label}`}
                        className={`flex justify-between text-sm font-medium group ${params.make === b.label ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                      >
                         <span>{b.label}</span>
                         <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full group-hover:bg-gray-300">{b.count}</span>
                      </Link>
                    ))}
                 </div>
              </div>

              {/* Type Filter */}
              <div>
                 <h3 className="font-extrabold text-black mb-4 uppercase text-xs tracking-widest">Body Type</h3>
                 <div className="flex flex-wrap gap-2">
                    {["SUV", "Sedan", "Truck", "Coupe", "Hatchback"].map(type => (
                       <Link 
                         key={type} 
                         href={`/inventory?type=${type}`}
                         className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${params.type === type ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-600 hover:border-black'}`}
                       >
                         {type}
                       </Link>
                    ))}
                 </div>
              </div>

           </aside>


           {/* --- MAIN GRID (Right) --- */}
           <div className="flex-1">
              <div className="mb-6 flex items-end justify-between">
                 <h1 className="text-3xl font-extrabold text-black tracking-tight">
                    {params.make || "All Inventory"} 
                    <span className="text-gray-400 ml-2 text-lg font-medium">{vehicles.length} results</span>
                 </h1>
              </div>

              {vehicles.length === 0 ? (
                 <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">No vehicles match your criteria.</p>
                    <Link href="/inventory" className="text-blue-600 text-sm font-bold mt-2 inline-block">Clear Filters</Link>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {vehicles.map(car => (
                      <Link key={car.id} href={`/inventory/${car.id}`} className="group bg-white p-4 rounded-[1.5rem] border border-gray-100 hover:shadow-xl transition-all duration-300">
                         <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4">
                            {car.images[0] ? (
                               <Image 
                                 src={car.images[0].url} 
                                 alt={car.model} 
                                 fill 
                                 className="object-cover transition-transform duration-700 group-hover:scale-105"
                               />
                            ) : (
                               <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold text-xs">NO IMAGE</div>
                            )}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
                               KES {Number(car.listingPrice).toLocaleString()}
                            </div>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{car.year} • {car.bodyType}</p>
                            <h3 className="text-lg font-extrabold text-black group-hover:text-blue-600 transition-colors">{car.make} {car.model}</h3>
                            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500 border-t border-gray-50 pt-3">
                               <span>{car.features.find(f => f.key === "Mileage")?.value || "N/A"}</span>
                               <span className="w-1 h-1 bg-gray-300 rounded-full"/>
                               <span>{car.features.find(f => f.key === "Fuel Type")?.value || "N/A"}</span>
                               <span className="w-1 h-1 bg-gray-300 rounded-full"/>
                               <span>{car.features.find(f => f.key === "Transmission")?.value || "Automatic"}</span>
                            </div>
                         </div>
                      </Link>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}