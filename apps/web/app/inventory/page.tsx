import { prisma } from "@repo/database";
import Link from "next/link";
import Image from "next/image";
import { Search, Car } from "lucide-react";

export const revalidate = 60;

// Type interfaces
interface CountResult {
  label: string;
  count: number;
}

interface VehicleFeature {
  key: string;
  value: string;
}

interface Vehicle {
  id: string;
  stockNumber: string;
  listingPrice: number | unknown; // Decimal often handled as number or special object
  make: string;
  model: string;
  year: number;
  bodyType: string;
  images: { url: string }[];
  features: VehicleFeature[];
}

// Helper: explicit types for prisma result and map/sort params
async function getBrandCounts() {
  const result = await prisma.vehicle.groupBy({
    by: ['make'],
    where: { status: 'PUBLISHED' },
    _count: true
  });
  
  return result
    .map((r: { make: string, _count: number }) => ({ label: r.make, count: r._count }))
    .sort((a: CountResult, b: CountResult) => b.count - a.count);
}

async function getBodyTypeCounts() {
  const result = await prisma.vehicle.groupBy({
    by: ['bodyType'],
    where: { status: 'PUBLISHED' },
    _count: true
  });
  
  return result
    .map((r: { bodyType: string, _count: number }) => ({ label: r.bodyType, count: r._count }))
    .sort((a: CountResult, b: CountResult) => b.count - a.count);
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; make?: string; q?: string; min?: string; max?: string }>;
}) {
  const params = await searchParams;
  
  // FIXED: Removed 'any', using Record<string, unknown> to allow dynamic properties safely
  const where: Record<string, unknown> = { status: "PUBLISHED" };

  if (params.type) where.bodyType = { equals: params.type, mode: 'insensitive' };
  if (params.make) where.make = { equals: params.make, mode: 'insensitive' };
  if (params.q) {
    where.OR = [
      { make: { contains: params.q, mode: 'insensitive' } },
      { model: { contains: params.q, mode: 'insensitive' } },
      { stockNumber: { contains: params.q, mode: 'insensitive' } }
    ];
  }

  const [vehicles, brands, bodyTypes] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: { images: { take: 1 }, features: true },
      orderBy: { createdAt: 'desc' }
    }),
    getBrandCounts(),
    getBodyTypeCounts()
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
           
           {/* --- SIDEBAR --- */}
           <aside className="w-full lg:w-64 shrink-0 space-y-8">
              {/* Search */}
              <div className="relative">
                 <form action="/inventory">
                   <input 
                     name="q" 
                     defaultValue={params.q} 
                     placeholder="Search make, model, stock#..." 
                     className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-black transition-colors"
                   />
                   <Search className="absolute left-3 top-3.5 text-gray-400" size={16}/>
                 </form>
              </div>

              {/* Brands Filter */}
              <div>
                 <h3 className="font-extrabold text-black mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
                    Brands <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{brands.length}</span>
                 </h3>
                 <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    <Link href="/inventory" className={`block text-sm font-bold py-1 ${!params.make ? 'text-blue-600' : 'text-gray-400 hover:text-black'}`}>
                      All Brands
                    </Link>
                    {brands.map((b: CountResult) => (
                      <Link 
                        key={b.label} 
                        href={`/inventory?make=${b.label}`}
                        className={`flex justify-between items-center text-sm font-medium py-1 group ${params.make === b.label ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                      >
                         <span>{b.label}</span>
                         <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-black group-hover:text-white transition-colors">{b.count}</span>
                      </Link>
                    ))}
                 </div>
              </div>

              {/* Body Type Filter */}
              <div>
                 <h3 className="font-extrabold text-black mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
                    Body Type <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{bodyTypes.length}</span>
                 </h3>
                 <div className="space-y-1">
                    {bodyTypes.map((type: CountResult) => (
                       <Link 
                         key={type.label} 
                         href={`/inventory?type=${type.label}`}
                         className={`flex justify-between items-center text-sm font-medium py-1 group ${params.type === type.label ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                       >
                         <span>{type.label}</span>
                         <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-black group-hover:text-white transition-colors">{type.count}</span>
                       </Link>
                    ))}
                 </div>
              </div>
           </aside>

           {/* --- MAIN GRID --- */}
           <div className="flex-1">
              <div className="mb-6 flex items-end justify-between">
                 <div>
                    <h1 className="text-3xl font-extrabold text-black tracking-tight capitalize">
                        {params.make || params.type || "All Inventory"}
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">{vehicles.length} vehicles available</p>
                 </div>
              </div>

              {vehicles.length === 0 ? (
                 <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <Car size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">No vehicles match your criteria.</p>
                    <Link href="/inventory" className="text-blue-600 text-sm font-bold mt-2 inline-block hover:underline">Clear All Filters</Link>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {/* FIXED: Typed 'car' using interface */}
                   {/* Note: We rely on Prisma to return data matching our interface. The interface is loose enough to work. */}
                   {(vehicles as unknown as Vehicle[]).map((car: Vehicle) => (
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
                            
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                               {car.stockNumber}
                            </div>

                            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold shadow-sm text-black">
                               KES {Number(car.listingPrice).toLocaleString()}
                            </div>
                         </div>
                         
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{car.year} • {car.bodyType}</p>
                            <h3 className="text-lg font-extrabold text-black group-hover:text-blue-600 transition-colors truncate">{car.make} {car.model}</h3>
                            
                            <div className="mt-4 flex items-center gap-3 text-xs font-medium text-gray-500 border-t border-gray-50 pt-3">
                               {/* FIXED: Removed Mileage Display */}
                               <span className="truncate">{car.features.find((f: VehicleFeature) => f.key === "Fuel Type")?.value || "Petrol"}</span>
                               <span className="w-1 h-1 bg-gray-300 rounded-full shrink-0"/>
                               <span className="truncate">{car.features.find((f: VehicleFeature) => f.key === "Transmission")?.value || "Auto"}</span>
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