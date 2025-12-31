import Link from "next/link"
import { prisma } from "@repo/database"
import { ImageManager } from "../../../components/image-manager"
import { EditForm } from "../../../components/edit-form"
import { ChevronLeft } from "lucide-react"

export const dynamic = "force-dynamic";

export default async function VehicleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // 1. Fetch Vehicle Data AND Feature Templates in parallel
  const [rawVehicle, templates] = await Promise.all([
    prisma.vehicle.findUnique({
      where: { id },
      include: { 
          images: { orderBy: { id: 'asc' } }, 
          features: true,
          costs: true 
      }
    }),
    prisma.featureTemplate.findMany({ orderBy: { label: 'asc' } }) 
  ])

  if (!rawVehicle) return <div>Vehicle not found</div>

  // 2. SERIALIZATION: Convert Decimals to Strings
  const vehicle = {
    ...rawVehicle,
    listingPrice: rawVehicle.listingPrice.toString(),
    // FIX: Explicitly type 'c' as any to pass build strictness
    costs: rawVehicle.costs.map((c: any) => ({
        ...c,
        amount: c.amount.toString()
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-32">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-2">
          <Link href="/vehicles" className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
            <p className="text-gray-500 text-sm font-mono">STOCK: {vehicle.stockNumber}</p>
          </div>
        </div>

        {/* 1. Image Manager */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <ImageManager vehicleId={vehicle.id} initialImages={vehicle.images} />
        </div>

        {/* 2. Metadata Editor */}
        <EditForm 
            vehicle={vehicle} 
            features={vehicle.features} 
            costs={vehicle.costs}
            templates={templates} 
        />

      </div>
    </div>
  )
}