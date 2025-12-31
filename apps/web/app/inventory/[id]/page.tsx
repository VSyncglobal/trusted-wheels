import { prisma } from "@repo/database";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Calendar, Gauge, Fuel, Settings2, ShieldCheck, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { InventoryActions } from "../../components/inventory-actions";

// Force dynamic rendering to ensure we always show the latest status
export const dynamic = "force-dynamic";

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.vehicle.findUnique({
    where: { id },
    select: { make: true, model: true, year: true }
  });
  
  if (!car) return { title: "Vehicle Not Found" };
  return { 
    title: `${car.year} ${car.make} ${car.model} | Trust Rides`,
    description: `View full specifications and photos for this ${car.year} ${car.make} ${car.model}.`
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 2. Data Fetching
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      images: { orderBy: { id: 'asc' } },
      features: true
    }
  });

  if (!vehicle) return notFound();

  // Helper to extract feature values safely
  const getFeat = (key: string) => vehicle.features.find(f => f.key === key)?.value || "N/A";
  
  // Separate Core Specs from Custom Features for the UI
  const coreKeys = ["Engine Size", "Mileage", "Fuel Type", "Transmission", "Condition"];
  const customFeatures = vehicle.features.filter(f => !coreKeys.includes(f.key));

  return (
    <div className="min-h-screen bg-off-white">
      
      {/* NAVIGATION BAR (Internal) */}
      <div className="fixed top-24 left-6 z-40 hidden xl:block">
        <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
            <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* LEFT COLUMN: IMMERSIVE GALLERY (Scrolls) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-gray-100 flex flex-col gap-1 p-1 lg:min-h-screen">
            {vehicle.images.length === 0 ? (
                <div className="h-[50vh] flex items-center justify-center text-gray-400 uppercase tracking-widest text-sm">
                    No Images Available
                </div>
            ) : (
                vehicle.images.map((img, idx) => (
                    <div key={img.id} className="relative w-full aspect-[4/3] lg:aspect-[16/10]">
                        <Image
                            src={img.url}
                            alt={`${vehicle.make} ${vehicle.model} - View ${idx + 1}`}
                            fill
                            className="object-cover"
                            priority={idx === 0}
                            sizes="(max-width: 1024px) 100vw, 70vw"
                        />
                    </div>
                ))
            )}
        </div>

        {/* RIGHT COLUMN: STICKY DETAILS (Fixed) */}
        <div className="lg:col-span-5 xl:col-span-4 relative bg-white">
            <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto scrollbar-hide">
                <div className="p-8 md:p-12 flex flex-col gap-10 min-h-full">
                    
                    {/* 1. HEADER */}
                    <div className="mt-12 lg:mt-20">
                        <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                             <span>Stock #{vehicle.stockNumber}</span>
                             <span>•</span>
                             <span>{vehicle.bodyType}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-strong-black leading-[0.9] tracking-tight mb-2">
                            {vehicle.year} {vehicle.make} <br/>
                            <span className="text-gray-500">{vehicle.model}</span>
                        </h1>
                        <p className="text-2xl font-medium text-strong-black mt-6">
                            KES {Number(vehicle.listingPrice).toLocaleString()}
                        </p>
                    </div>

                    {/* 2. CORE SPECS GRID */}
                    <div className="grid grid-cols-2 gap-y-8 gap-x-4 py-8 border-y border-black/5">
                        <div>
                            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                                <Gauge size={14} /> Mileage
                            </span>
                            <span className="text-lg font-medium text-strong-black">{getFeat("Mileage")}</span>
                        </div>
                        <div>
                            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                                <Settings2 size={14} /> Engine
                            </span>
                            <span className="text-lg font-medium text-strong-black">{getFeat("Engine Size")}</span>
                        </div>
                        <div>
                            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                                <Fuel size={14} /> Fuel
                            </span>
                            <span className="text-lg font-medium text-strong-black">{getFeat("Fuel Type")}</span>
                        </div>
                        <div>
                            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                                <ShieldCheck size={14} /> Transmission
                            </span>
                            <span className="text-lg font-medium text-strong-black">{getFeat("Transmission")}</span>
                        </div>
                    </div>

                    {/* 3. DETAILED FEATURES */}
                    {customFeatures.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-strong-black uppercase tracking-widest mb-6">Features</h3>
                            <ul className="grid grid-cols-1 gap-3">
                                {customFeatures.map((feat) => (
                                    <li key={feat.id} className="flex items-start gap-3 text-sm text-gray-600">
                                        <Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                                        <span>
                                            <span className="font-semibold text-gray-900">{feat.key}:</span> {feat.value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    
                    {/* 4. ACTIONS (Interactive Component) */}
                    <InventoryActions 
                        price={Number(vehicle.listingPrice)} 
                        vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        stockNumber={vehicle.stockNumber}
                    />
                    
                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-wider">
                        Verified by Trust Rides • {vehicle.status}
                    </p>


                    </div>

                </div>
            </div>
        </div>

      </div>

  );
}