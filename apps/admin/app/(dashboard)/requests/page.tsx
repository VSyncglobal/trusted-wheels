import { prisma } from "@repo/database"
import { CheckCircle, XCircle, Clock, ArrowRight, Phone, Mail, Car } from "lucide-react"
import { markAsContacted, markAsRejected } from "./actions"

export const dynamic = "force-dynamic"

export default async function RequestsPage() {
  const requests = await prisma.listingRequest.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Incoming Leads</h1>
          <p className="text-gray-500 font-medium">Review and process "Sell Your Car" submissions.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
           <Clock size={16}/> Pending: {requests.filter((r: any) => r.status === "PENDING").length}
        </div>
      </div>

      <div className="space-y-4">
         {requests.length === 0 ? (
            <div className="p-12 text-center bg-white/50 border border-dashed border-gray-200 rounded-[2rem]">
               <Car size={48} className="mx-auto text-gray-300 mb-4" />
               <p className="text-gray-400 font-bold">No new requests found.</p>
            </div>
         ) : (
           // FIX: Explicitly type 'req' as any to pass build strictness
           requests.map((req: any) => (
             <div key={req.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row gap-6 lg:items-center">
                
                {/* STATUS INDICATOR */}
                <div className={`shrink-0 w-2 self-stretch rounded-full ${
                    req.status === 'PENDING' ? 'bg-amber-400' :
                    req.status === 'CONTACTED' ? 'bg-blue-500' :
                    req.status === 'CONVERTED' ? 'bg-emerald-500' : 'bg-red-200'
                }`}/>

                {/* VEHICLE INFO */}
                <div className="flex-1 min-w-[200px]">
                   <h3 className="text-xl font-extrabold text-black">{req.year} {req.make} {req.model}</h3>
                   <div className="flex flex-wrap gap-3 mt-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{req.mileage.toLocaleString()} KM</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{req.condition}</span>
                      {req.expectedPrice && <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">Expected: KES {Number(req.expectedPrice).toLocaleString()}</span>}
                   </div>
                </div>

                {/* CONTACT INFO */}
                <div className="flex-1 min-w-[200px] border-l border-gray-100 pl-6 space-y-2">
                   <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                      <UserIcon /> {req.name}
                   </div>
                   <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <Phone size={12}/> {req.phone}
                   </div>
                   {req.email && (
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                         <Mail size={12}/> {req.email}
                      </div>
                   )}
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2 lg:ml-auto">
                   {req.status === "PENDING" && (
                     <>
                        <form action={markAsContacted.bind(null, req.id)}>
                           <button className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
                              <CheckCircle size={14}/> Mark Contacted
                           </button>
                        </form>
                        <form action={markAsRejected.bind(null, req.id)}>
                           <button className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
                              <XCircle size={14}/> Reject
                           </button>
                        </form>
                     </>
                   )}
                   {req.status === "CONTACTED" && (
                      <button className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">
                         Convert to Stock <ArrowRight size={14}/>
                      </button>
                   )}
                   {['CONVERTED', 'REJECTED'].includes(req.status) && (
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{req.status}</span>
                   )}
                </div>

             </div>
           ))
         )}
      </div>

    </div>
  )
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )
}