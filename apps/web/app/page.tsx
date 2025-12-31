import { HeroSlider } from "./components/hero-slider";
import { CategoryGrid } from "./components/category-grid";
import { prisma } from "@repo/database";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getFeaturedVehicles() {
  return await prisma.vehicle.findMany({
    where: { status: "PUBLISHED" },
    include: { images: { orderBy: { id: 'asc' }, take: 1 }, features: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

async function getOtherVehicles() {
  return await prisma.vehicle.findMany({
    where: { status: "PUBLISHED" },
    include: { images: { orderBy: { id: 'asc' }, take: 1 }, features: true },
    orderBy: { updatedAt: "desc" },
    skip: 10, 
    take: 8,
  });
}

export default async function Page() {
  const [vehicles, otherVehicles] = await Promise.all([
    getFeaturedVehicles(),
    getOtherVehicles()
  ]);

  return (
    <div className="flex flex-col gap-0">
      
      <HeroSlider />
      <CategoryGrid />

      {/* LATEST ARRIVALS */}
      <section className="space-y-8 py-24 px-6 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center justify-between">
           <h2 className="text-3xl font-bold text-black tracking-tight">Latest Arrivals</h2>
           <Link href="/inventory" className="text-xs font-bold uppercase text-gray-400 hover:text-black">View All</Link>
        </div>
        
        <div className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
          {vehicles.length === 0 ? (
            <div className="w-full py-20 bg-gray-50 border border-dashed border-gray-200 text-center rounded-lg">
              <p className="text-gray-400 italic">No inventory currently published.</p>
            </div>
          ) : (
            // FIX: Explicitly type 'car' as any
            vehicles.map((car: any) => (
              <Link key={car.id} href={`/inventory/${car.id}`} className="group relative min-w-[300px] md:min-w-[400px] snap-center block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-100 mb-4">
                  {car.images[0] ? (
                    <Image src={car.images[0].url} alt={car.model} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold text-xs">NO IMAGE</div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                     {car.stockNumber}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-black shadow-sm">
                    KES {Number(car.listingPrice).toLocaleString()}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black group-hover:text-gray-600 transition-colors">{car.year} {car.make} {car.model}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {/* FIX: Explicitly type 'f' as any */}
                    {car.bodyType} • {car.features.find((f: any) => f.key === "Mileage")?.value || "0 km"}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* EXPLORE MORE */}
      {otherVehicles.length > 0 && (
        <section className="py-24 px-6 bg-gray-50 border-t border-gray-200">
           <div className="max-w-[1400px] mx-auto">
              <h2 className="text-3xl font-extrabold text-black tracking-tight mb-12 text-center">Explore More</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {/* FIX: Explicitly type 'car' as any */}
                 {otherVehicles.map((car: any) => (
                    <Link key={car.id} href={`/inventory/${car.id}`} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
                       <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4">
                          {car.images[0] ? (
                             <Image src={car.images[0].url} alt={car.model} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs font-bold">NO IMAGE</div>
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-[10px] font-bold">
                             {car.year}
                          </div>
                       </div>
                       <h3 className="font-bold text-black text-lg">{car.make} {car.model}</h3>
                       <p className="text-sm text-gray-500 font-medium mt-1">KES {Number(car.listingPrice).toLocaleString()}</p>
                    </Link>
                 ))}
              </div>
              <div className="text-center mt-12">
                 <Link href="/inventory" className="inline-block px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg">
                    View Full Inventory
                 </Link>
              </div>
           </div>
        </section>
      )}

      {/* VALUE PROPS */}
      <section className="grid md:grid-cols-3 gap-12 py-24 border-t border-black/5 px-6 max-w-[1400px] mx-auto w-full bg-white">
         <div className="space-y-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black font-bold">1</div>
          <h3 className="text-lg font-bold text-black">Verified History</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Every vehicle undergoes a rigorous background check. No hidden accidents.</p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black font-bold">2</div>
          <h3 className="text-lg font-bold text-black">Transparent Pricing</h3>
          <p className="text-sm text-gray-500 leading-relaxed">The price you see is the price you pay. No hidden fees or markups.</p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black font-bold">3</div>
          <h3 className="text-lg font-bold text-black">Paperwork Handled</h3>
          <p className="text-sm text-gray-500 leading-relaxed">We manage the transfer process from start to finish, driving peace of mind.</p>
        </div>
      </section>

    </div>
  );
}