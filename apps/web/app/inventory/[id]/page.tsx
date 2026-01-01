import { prisma } from "@repo/database";
import Link from "next/link";
import { ArrowLeft, Check, Fuel, Settings2, ShieldCheck, type LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { InventoryActions } from "../../components/inventory-actions";
import { VehicleGallery } from "../../components/vehicle-gallery";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Feature {
  id: string
  key: string
  value: string
}

// 1. AI & SOCIAL METADATA (Open Graph)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const car = await prisma.vehicle.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' }, take: 1 } }
  });
  
  if (!car) return { title: "Vehicle Not Found" };

  const title = `${car.year} ${car.make} ${car.model} | Trust Rides Kenya`;
  const description = `Buy this ${car.condition || 'Foreign Used'} ${car.year} ${car.make} ${car.model} in Nairobi. Price: KES ${Number(car.listingPrice).toLocaleString()}. Verified history.`;

  return { 
    title,
    description,
    openGraph: {
        title,
        description,
        images: car.images[0] ? [{ url: car.images[0].url }] : [],
        type: "article",
        siteName: "Trust Rides"
    }
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      features: true
    }
  });

  if (!vehicle) return notFound();

  const getFeat = (key: string) => vehicle.features.find((f: Feature) => f.key === key)?.value || "N/A";
  
  const coreKeys = ["Engine Size", "Mileage", "Fuel Type", "Transmission", "Condition"];
  const customFeatures = vehicle.features.filter((f: Feature) => !coreKeys.includes(f.key));

  // --- 2. AI STRUCTURED DATA (The Secret Sauce) ---
  // We keep mileage here for Google/AI to know the car's value, even if hidden from UI
  const mileage = getFeat("Mileage").replace(/\D/g, "") || "0";
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle', 
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    image: vehicle.images.map(img => img.url),
    description: `For sale in Nairobi: ${vehicle.year} ${vehicle.make} ${vehicle.model}. ${vehicle.condition || 'Foreign Used'}.`,
    brand: {
      '@type': 'Brand',
      name: vehicle.make,
    },
    model: vehicle.model,
    vehicleConfiguration: `${vehicle.bodyType} - ${getFeat("Engine Size")}`,
    productionDate: vehicle.year,
    fuelType: getFeat("Fuel Type"),
    vehicleTransmission: getFeat("Transmission"),
    mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: mileage,
        unitCode: 'KMT' // Code for Kilometers
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price: vehicle.listingPrice.toString(),
      itemCondition: 'https://schema.org/UsedCondition', 
      availability: 'https://schema.org/InStock',
      areaServed: 'Kenya',
      seller: {
        '@type': 'AutoDealer',
        name: 'Trust Rides Kenya'
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Inject Data for AI Bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="fixed top-6 left-6 z-40 hidden xl:block">
        <Link href="/inventory" className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-sm">
            <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 lg:p-12 pt-24 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 xl:col-span-8">
               <VehicleGallery images={vehicle.images} />
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-12 space-y-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                             <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">{vehicle.bodyType}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4 leading-[1.1]">
                            {vehicle.year} {vehicle.make} <br/>
                            <span className="text-gray-500">{vehicle.model}</span>
                        </h1>
                        <p className="text-3xl font-bold text-blue-600">KES {Number(vehicle.listingPrice).toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 py-8 border-y border-gray-100">
                        {/* Note: Mileage SpecItem is REMOVED from UI as requested */}
                        <SpecItem icon={Settings2} label="Engine" value={getFeat("Engine Size")} />
                        <SpecItem icon={Fuel} label="Fuel" value={getFeat("Fuel Type")} />
                        <SpecItem icon={ShieldCheck} label="Trans." value={getFeat("Transmission")} />
                    </div>

                    {customFeatures.length > 0 && (
                        <div>
                            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Additional Features</h3>
                            <div className="flex flex-wrap gap-2">
                                {customFeatures.map((feat: Feature) => (
                                    <span key={feat.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700">
                                        <Check size={12} className="text-green-600" />
                                        {feat.key}: {feat.value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                        <InventoryActions 
                            price={Number(vehicle.listingPrice)} 
                            vehicleId={vehicle.id}
                            vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            stockNumber={vehicle.stockNumber}
                        />
                        <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-wider font-bold">Verified by Trust Rides • {vehicle.status}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) {
    return (
        <div>
            <span className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase mb-1">
                <Icon size={14} /> {label}
            </span>
            <span className="text-lg font-bold text-black">{value}</span>
        </div>
    )
}