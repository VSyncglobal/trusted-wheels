import { HeroSlider } from "./components/hero-slider";
import { CategoryGrid } from "./components/category-grid";
import { prisma } from "@repo/database";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface VehicleSummary {
  id: string;
  year: number;
  make: string;
  model: string;
  stockNumber: string;
  listingPrice: number | string; 
  bodyType: string;
  images: { url: string }[];
  features: { key: string; value: string }[];
}

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
    take: 12,
  });
}

export default async function Page() {
  const [vehicles, otherVehicles] = await Promise.all([
    getFeaturedVehicles(),
    getOtherVehicles()
  ]);

  // --- 1. CORE ORGANIZATION SCHEMA ---
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Trust Rides Kenya',
    url: 'https://trustrides.co.ke',
    description: 'Trusted dealership for foreign used and locally used cars in Nairobi.',
    areaServed: 'Kenya',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'KE'
    }
  };

  // --- 2. FAQ SCHEMA (CRITICAL FOR SEO VISIBILITY) ---
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do you offer car financing in Kenya?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Trust Rides offers flexible car financing options and bank financing arrangements for both employed and self-employed individuals in Kenya.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are your cars locally used or foreign used?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We stock a mix of high-quality Foreign Used (Imports) mostly from Japan/UK and verified Locally Used vehicles.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I import a specific car through Trust Rides?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer a dedicated import service. Tell us the engine CC, make, and model you want, and we will handle the purchase, shipping, and clearance.'
        }
      }
    ]
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Inject Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <HeroSlider />
      <CategoryGrid />

      {/* LATEST ARRIVALS */}
      <section className="space-y-3 pt-4 pb-8 px-2 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-sm md:text-lg font-bold text-black tracking-tight">Latest Arrivals</h2>
           <Link href="/inventory" className="text-[10px] font-bold uppercase text-gray-400 hover:text-black">View All</Link>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-2">
          {vehicles.length === 0 ? (
            <div className="w-full py-8 bg-gray-50 border border-dashed border-gray-200 text-center rounded-lg">
              <p className="text-gray-400 italic text-[10px]">No inventory currently published.</p>
            </div>
          ) : (
            (vehicles as unknown as VehicleSummary[]).map((car) => (
              <Link key={car.id} href={`/inventory/${car.id}`} className="group relative min-w-[32%] md:min-w-[160px] lg:min-w-[200px] snap-center block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100 mb-1.5">
                  {car.images[0] ? (
                    <Image src={car.images[0].url} alt={car.model} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold text-[8px]">NO IMAGE</div>
                  )}
                  <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md px-1 py-0.5 rounded text-[7px] font-bold text-white uppercase tracking-wider">
                     {car.stockNumber}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold text-black shadow-sm">
                    {Number(car.listingPrice).toLocaleString()}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] md:text-xs font-bold text-black group-hover:text-gray-600 transition-colors truncate">{car.year} {car.make} {car.model}</h3>
                  <p className="text-[9px] text-gray-500 mt-0.5 truncate">{car.bodyType}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* EXPLORE MORE */}
      {otherVehicles.length > 0 && (
        <section className="py-8 px-2 bg-gray-50 border-t border-gray-200">
           <div className="max-w-[1600px] mx-auto">
              <h2 className="text-sm md:text-lg font-extrabold text-black tracking-tight mb-4 text-center">Explore More</h2>
              
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                 {(otherVehicles as unknown as VehicleSummary[]).map((car) => (
                    <Link key={car.id} href={`/inventory/${car.id}`} className="group bg-white rounded-lg p-2 shadow-sm hover:shadow-lg transition-all duration-300">
                       <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-gray-100 mb-1.5">
                          {car.images[0] ? (
                             <Image src={car.images[0].url} alt={car.model} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-[8px] font-bold">NO IMAGE</div>
                          )}
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-[7px] font-bold">
                             {car.year}
                          </div>
                       </div>
                       <h3 className="font-bold text-black text-[9px] md:text-[10px] truncate">{car.make} {car.model}</h3>
                       <p className="text-[9px] text-gray-500 font-medium mt-0.5 truncate">KES {Number(car.listingPrice).toLocaleString()}</p>
                    </Link>
                 ))}
              </div>
              <div className="text-center mt-6">
                 <Link href="/inventory" className="inline-block px-6 py-2 bg-black text-white text-[10px] font-bold rounded-lg hover:bg-gray-800 transition-all shadow-lg">
                    View Full Inventory
                 </Link>
              </div>
           </div>
        </section>
      )}

      {/* Value Props & SEO Content Block */}
      <section className="py-8 border-t border-black/5 px-4 max-w-[1600px] mx-auto w-full bg-white">
         <div className="grid grid-cols-3 gap-2 text-center md:text-left mb-8">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-black">Verified History</h3>
              <p className="text-[8px] text-gray-500 leading-relaxed hidden md:block">Every vehicle undergoes a rigorous background check.</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-black">Transparent Pricing</h3>
              <p className="text-[8px] text-gray-500 leading-relaxed hidden md:block">No hidden fees or markups.</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-black">Paperwork Handled</h3>
              <p className="text-[8px] text-gray-500 leading-relaxed hidden md:block">We manage the transfer process.</p>
            </div>
         </div>
         
         {/* SEO CONTENT FOOTER: Helps keyword density */}
         <div className="border-t border-dashed border-gray-200 pt-6">
            <h4 className="text-[10px] font-bold text-gray-900 mb-2">Popular Cars for Sale in Kenya</h4>
            <p className="text-[9px] text-gray-500 leading-relaxed">
              Trust Rides is your premier destination for finding the best <strong>1500cc cars for sale</strong>, 
              <strong>hybrid SUVs</strong>, and reliable <strong>Toyota cars in Nairobi</strong>. 
              Whether you are looking for a fuel-efficient Mazda Demio, a robust Toyota Prado, or a 
              luxury Mercedes Benz, our inventory is verified for quality. We simplify the car buying process 
              with transparent pricing and handled paperwork.
            </p>
         </div>
      </section>
    </div>
  );
}