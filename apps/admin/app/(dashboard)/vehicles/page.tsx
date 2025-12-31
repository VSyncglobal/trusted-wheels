import Link from "next/link";
import Image from "next/image";
import { prisma } from "@repo/database";
import { Plus, Edit2, Gauge, Calendar, SlidersHorizontal } from "lucide-react";
import { Search } from "../../../components/search"; 

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";

  // Filter Logic
  const vehicles = await prisma.vehicle.findMany({
    where: {
      OR: [
        { make: { contains: query, mode: "insensitive" } },
        { model: { contains: query, mode: "insensitive" } },
        { stockNumber: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1 },
      features: true
    }
  });

  return (
    <div className="space-y-8">
      
      {/* HEADER WITH SEARCH */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Inventory</h1>
          <p className="text-gray-500 font-medium mb-6">Manage your fleet. Total: {vehicles.length} units.</p>
          
          <div className="flex gap-4">
             <Search placeholder="Search make, model, or stock #..." />
             <button className="bg-white border-2 border-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm hover:border-black hover:text-black transition-colors flex items-center gap-2">
                <SlidersHorizontal size={18} /> Filters
             </button>
          </div>
        </div>

        <Link href="/vehicles/create" className="btn-primary flex items-center gap-2 shadow-blue-500/30 shrink-0 h-fit self-end md:self-auto mb-1">
           <Plus size={20} strokeWidth={3} /> Add Vehicle
        </Link>
      </div>

      {/* INVENTORY LIST */}
      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="p-12 text-center bg-white/50 backdrop-blur-md rounded-[2rem] border border-gray-200">
            <p className="text-gray-400 font-bold text-lg">No vehicles found.</p>
            {query && <p className="text-gray-400 text-sm">Try adjusting your search terms.</p>}
          </div>
        ) : (
          // FIX: Explicitly type 'car' as any
          vehicles.map((car: any) => {
            const mileage = car.features.find((f: any) => f.key === "Mileage")?.value || "N/A";
            
            return (
              <div key={car.id} className="group bg-white/70 backdrop-blur-sm p-4 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row gap-6 items-center">
                
                {/* THUMBNAIL */}
                <div className="relative w-full md:w-48 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                  {car.images[0] ? (
                    <Image 
                      src={car.images[0].url} 
                      alt="Car" fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold text-xs uppercase">No Image</div>
                  )}
                  <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm
                    ${car.status === 'PUBLISHED' ? 'bg-green-500/90 text-white' : 
                      car.status === 'SOLD' ? 'bg-red-500/90 text-white' : 
                      'bg-white/90 text-black'}`}>
                    {car.status}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider w-fit mx-auto md:mx-0">
                      {car.stockNumber}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{car.bodyType}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-black mb-1">
                    {car.year} {car.make} <span className="text-gray-500">{car.model}</span>
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><Gauge size={14}/> {mileage}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"/>
                    <span className="flex items-center gap-1"><Calendar size={14}/> {car.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* PRICE & ACTIONS */}
                <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                  <p className="text-xl font-extrabold text-black">
                    KES {Number(car.listingPrice).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/vehicles/${car.id}`} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors flex items-center gap-2">
                      <Edit2 size={14} /> Edit
                    </Link>
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>
    </div>
  );
}