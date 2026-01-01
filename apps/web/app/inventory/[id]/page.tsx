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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const car = await prisma.vehicle.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' }, take: 1 } }
  });
  
  if (!car) return { title: "Vehicle Not Found" };

  const title = `${car.year} ${car.make} ${car.model} | Trust Rides Kenya`;
  const description = `Buy this ${car.condition || 'Foreign Used'} ${car.year} ${car.make} ${car.model}. Price: KES ${Number(car.listingPrice).toLocaleString()}.`;

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

  const mileage = getFeat("Mileage").replace(/\D/g, "") || "0";
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle', 
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    image: vehicle.images.map(img => img.url),
    description: `For sale in Nairobi: ${vehicle.year} ${vehicle.make} ${vehicle.model}. ${vehicle.condition || 'Foreign Used'}.`,
    brand: { '@type': 'Brand', name: vehicle.make },
    model: vehicle.model,
    vehicleConfiguration: `${vehicle.bodyType} - ${getFeat("Engine Size")}`,
    productionDate: vehicle.year,
    fuelType: getFeat("Fuel Type"),
    vehicleTransmission: getFeat("Transmission"),
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: mileage, unitCode: 'KMT' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price: vehicle.listingPrice.toString(),
      itemCondition: 'https://schema.org/UsedCondition', 
      availability: 'https://schema.org/InStock',
      areaServed: 'Kenya',
      seller: { '@type': 'AutoDealer', name: 'Trust Rides Kenya' }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="fixed top-28 left-4 z-40 hidden xl:block">
        <Link href="/inventory" className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-sm">
            <ArrowLeft size={12} /> Back
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto p-3 pt-24 lg:p-4 lg:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
            <div className="lg:col-span-7 xl:col-span-8">
               <VehicleGallery images={vehicle.images} />
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-20 space-y-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest">{vehicle.bodyType}</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-1 leading-tight">
                            {vehicle.year} {vehicle.make} <span className="text-gray-500">{vehicle.model}</span>
                        </h1>
                        <p className="text-lg font-bold text-blue-600">KES {Number(vehicle.listingPrice).toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100">
                        <SpecItem icon={Settings2} label="Engine" value={getFeat("Engine Size")} />
                        <SpecItem icon={Fuel} label="Fuel" value={getFeat("Fuel Type")} />
                        <SpecItem icon={ShieldCheck} label="Trans." value={getFeat("Transmission")} />
                    </div>

                    {customFeatures.length > 0 && (
                        <div>
                            <h3 className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Features</h3>
                            <div className="flex flex-wrap gap-1">
                                {customFeatures.slice(0, 10).map((feat: Feature) => (
                                    <span key={feat.id} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[9px] font-bold text-gray-700">
                                        <Check size={8} className="text-green-600" />
                                        {feat.key}: {feat.value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <InventoryActions 
                            price={Number(vehicle.listingPrice)} 
                            vehicleId={vehicle.id}
                            vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            stockNumber={vehicle.stockNumber}
                        />
                        <p className="text-center text-[8px] text-gray-400 mt-2 uppercase tracking-wider font-bold">Verified by Trust Rides • {vehicle.status}</p>
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
        <div className="flex flex-col">
            <span className="flex items-center gap-1 text-[8px] font-extrabold text-gray-400 uppercase mb-0.5">
                <Icon size={10} /> {label}
            </span>
            <span className="text-xs font-bold text-black truncate">{value}</span>
        </div>
    )
}