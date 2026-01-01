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
  listingPrice: number | unknown;
  make: string;
  model: string;
  year: number;
  bodyType: string;
  images: { url: string }[];
  features: VehicleFeature[];
}

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
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-[1600px] mx-auto px-2">
        <div className="flex flex-col lg:flex-row gap-4">
           
           {/* --- SIDEBAR FILTER (Restored) --- */}
           <aside className="w-full lg:w-44 shrink-0 space-y-4">
              {/* Search */}
              <div className="relative">
                 <form action="/inventory">
                   <input 
                     name="q" 
                     defaultValue={params.q} 
                     placeholder="Search..." 
                     className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-7 pr-2 text-[10px] font-bold outline-none focus:border-black transition-colors"
                   />
                   <Search className="absolute left-2 top-2 text-gray-400" size={12}/>
                 </form>
              </div>

              {/* Brands Filter */}
              <div>
                 <h3 className="font-extrabold text-black mb-1.5 uppercase text-[9px] tracking-widest flex items-center gap-2">
                    Brands <span className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-[8px]">{brands.length}</span>
                 </h3>
                 <div className="space-y-0.5 max-h-[250px] overflow-y-auto pr-1 scrollbar-hide">
                    <Link href="/inventory" className={`block text-[10px] font-bold py-0.5 ${!params.make ? 'text-blue-600' : 'text-gray-400 hover:text-black'}`}>
                      All
                    </Link>
                    {brands.map((b: CountResult) => (
                      <Link 
                        key={b.label} 
                        href={`/inventory?make=${b.label}`}
                        className={`flex justify-between items-center text-[10px] font-medium py-0.5 group ${params.make === b.label ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                      >
                         <span className="truncate pr-1">{b.label}</span>
                         <span className="text-[8px] text-gray-400">{b.count}</span>
                      </Link>
                    ))}
                 </div>
              </div>

              {/* Body Type Filter */}
              <div>
                 <h3 className="font-extrabold text-black mb-1.5 uppercase text-[9px] tracking-widest flex items-center gap-2">
                    Body Type
                 </h3>
                 <div className="space-y-0.5">
                    {bodyTypes.map((type: CountResult) => (
                       <Link 
                         key={type.label} 
                         href={`/inventory?type=${type.label}`}
                         className={`flex justify-between items-center text-[10px] font-medium py-0.5 group ${params.type === type.label ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                       >
                         <span className="truncate pr-1">{type.label}</span>
                         <span className="text-[8px] text-gray-400">{type.count}</span>
                       </Link>
                    ))}
                 </div>
              </div>
           </aside>

           {/* --- MAIN GRID --- */}
           <div className="flex-1">
              <div className="mb-2 flex items-end justify-between px-1">
                 <div>
                    <h1 className="text-sm font-extrabold text-black tracking-tight capitalize">
                        {params.make || params.type || "All Inventory"}
                    </h1>
                 </div>
                 <span className="text-[9px] font-bold text-gray-400">{vehicles.length} cars</span>
              </div>

              {vehicles.length === 0 ? (
                 <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <Car size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400 font-bold text-[10px]">No vehicles found.</p>
                    <Link href="/inventory" className="text-blue-600 text-[10px] font-bold mt-1 inline-block hover:underline">Clear Filters</Link>
                 </div>
              ) : (
                // UPDATED: grid-cols-3 on mobile to allow 3 items across as requested
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                   {(vehicles as unknown as Vehicle[]).map((car: Vehicle) => (
                      <Link key={car.id} href={`/inventory/${car.id}`} className="group bg-white p-1.5 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300">
                         
                         <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-gray-100 mb-1.5">
                            {car.images[0] ? (
                               <Image 
                                 src={car.images[0].url} 
                                 alt={car.model} 
                                 fill 
                                 className="object-cover transition-transform duration-700 group-hover:scale-105"
                               />
                            ) : (
                               <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold text-[8px]">NO IMAGE</div>
                            )}
                            
                            <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md px-1 py-0.5 rounded text-[6px] font-bold text-white uppercase tracking-wider">
                               {car.stockNumber}
                            </div>

                            <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-md px-1 py-0.5 rounded text-[8px] font-bold shadow-sm text-black">
                               {Number(car.listingPrice).toLocaleString()}
                            </div>
                         </div>
                         
                         <div className="px-0.5">
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 truncate">{car.year} • {car.bodyType}</p>
                            <h3 className="text-[10px] font-extrabold text-black group-hover:text-blue-600 transition-colors truncate">{car.make} {car.model}</h3>
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