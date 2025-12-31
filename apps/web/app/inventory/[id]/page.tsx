import { prisma } from "@repo/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, CheckCircle2, Phone, MessageCircle, Calendar, 
  Gauge, Zap, Settings, ShieldCheck, MapPin
} from "lucide-react";
import { InventoryActions } from "../../components/inventory-actions";
import { HeroSlider } from "../../components/hero-slider"; 

export const revalidate = 60; // ISR Cache

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      features: true
    }
  });

  if (!vehicle || vehicle.status !== 'PUBLISHED') return notFound();

  // Helper to extract feature values safely
  // FIX: Explicitly type 'f' as any
  const getFeat = (key: string) => vehicle.features.find((f: any) => f.key === key)?.value || "N/A";
  
  // Separate Core Specs from Custom Features for the UI
  const coreKeys = ["Engine Size", "Mileage", "Fuel Type", "Transmission", "Condition"];
  // FIX: Explicitly type 'f' as any
  const extraFeatures = vehicle.features.filter((f: any) => !coreKeys.includes(f.key));

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. HERO SECTION (Mobile Slider / Desktop Grid) */}
      <div className="lg:h-[85vh] relative bg-black">
         <HeroSlider images={vehicle.images} />
         
         <Link href="/inventory" className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-black transition-all">
            <ArrowLeft size={24} />
         </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 -mt-20 relative z-10">
         <div className="grid lg:grid-cols-3 gap-12">
            
            {/* 2. MAIN DETAILS */}
            <div className="lg:col-span-2 space-y-8">
               
               {/* Header Card */}
               <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">{vehicle.condition}</span>
                           <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">{vehicle.stockNumber}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-2">
                           {vehicle.year} {vehicle.make} {vehicle.model}
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">{vehicle.bodyType} • {getFeat("Engine Size")}</p>
                     </div>
                     <div className="text-left md:text-right">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Cash Price</p>
                        <h2 className="text-4xl font-extrabold text-blue-600 tracking-tight">
                           KES {Number(vehicle.listingPrice).toLocaleString()}
                        </h2>
                     </div>
                  </div>

                  {/* Key Specs Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                     <SpecItem icon={Gauge} label="Mileage" value={getFeat("Mileage")} />
                     <SpecItem icon={Zap} label="Fuel" value={getFeat("Fuel Type")} />
                     <SpecItem icon={Settings} label="Trans." value={getFeat("Transmission")} />
                     <SpecItem icon={Calendar} label="Year" value={vehicle.year.toString()} />
                  </div>
               </div>

               {/* Description / Extra Features */}
               <div className="bg-gray-50 p-10 rounded-[2.5rem]">
                  <h3 className="text-2xl font-bold text-black mb-6">Vehicle Features</h3>
                  {extraFeatures.length > 0 ? (
                     <div className="grid md:grid-cols-2 gap-4">
                        {/* FIX: Explicitly type 'feat' as any */}
                        {extraFeatures.map((feat: any) => (
                           <div key={feat.id} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200/50">
                              <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                              <div>
                                 <p className="text-xs font-bold text-gray-400 uppercase">{feat.key}</p>
                                 <p className="font-bold text-black">{feat.value}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <p className="text-gray-500 italic">No additional features listed.</p>
                  )}
               </div>

            </div>

            {/* 3. SIDEBAR ACTIONS */}
            <div className="space-y-6">
               <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-8">
                  <h3 className="text-xl font-extrabold text-black mb-6">Interested?</h3>
                  
                  {/* Client Interaction Component */}
                  <InventoryActions vehicleId={vehicle.id} vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
                  
                  <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                     <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
                        <ShieldCheck className="text-blue-600" size={20}/>
                        <span>Verified Inspection Report</span>
                     </div>
                     <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
                        <MapPin className="text-blue-600" size={20}/>
                        <span>Available at Ridgeways Yard</span>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  )
}

function SpecItem({ icon: Icon, label, value }: any) {
   return (
      <div className="flex items-center gap-3">
         <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <Icon size={18} />
         </div>
         <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
            <p className="text-sm font-bold text-black truncate">{value}</p>
         </div>
      </div>
   )
}