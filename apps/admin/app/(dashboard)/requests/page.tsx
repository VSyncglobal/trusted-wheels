import { prisma } from "@repo/database";
import { CheckCircle, XCircle, Clock, Phone, Mail } from "lucide-react";
import { updateRequestStatus } from "./actions"; // We will create this next

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const requests = await prisma.listingRequest.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
           <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Valuation Requests</h1>
           <p className="text-gray-500 font-medium">Incoming leads from "Sell Your Car" form.</p>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {requests.length === 0 ? (
           <div className="p-16 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
             <p className="text-gray-400 font-bold">No requests found.</p>
           </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row gap-6 lg:items-center">
               
               {/* STATUS INDICATOR */}
               <div className={`w-2 h-full absolute left-0 top-0 bottom-0 rounded-l-[2rem] 
                 ${req.status === 'PENDING' ? 'bg-amber-500' : req.status === 'CONTACTED' ? 'bg-blue-500' : req.status === 'REJECTED' ? 'bg-gray-200' : 'bg-green-500'}`} 
               />

               {/* MAIN INFO */}
               <div className="flex-1 pl-4">
                  <div className="flex items-center gap-3 mb-2">
                     <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-lg 
                       ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                       {req.status}
                     </span>
                     <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                       <Clock size={12}/> {new Date(req.createdAt).toLocaleDateString()}
                     </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-black">
                    {req.year} {req.make} {req.model}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs font-bold text-gray-500">
                     <div>
                        <span className="block text-[10px] text-gray-300 uppercase tracking-widest">Mileage</span>
                        {req.mileage.toLocaleString()} km
                     </div>
                     <div>
                        <span className="block text-[10px] text-gray-300 uppercase tracking-widest">Condition</span>
                        {req.condition}
                     </div>
                     <div>
                        <span className="block text-[10px] text-gray-300 uppercase tracking-widest">Expected</span>
                        {req.expectedPrice ? `KES ${Number(req.expectedPrice).toLocaleString()}` : 'N/A'}
                     </div>
                  </div>
               </div>

               {/* CONTACT CARD */}
               <div className="bg-gray-50 p-4 rounded-2xl min-w-[250px]">
                  <h4 className="font-extrabold text-black text-sm mb-3">{req.name}</h4>
                  <div className="space-y-2">
                     <a href={`tel:${req.phone}`} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
                        <Phone size={14} className="text-blue-500"/> {req.phone}
                     </a>
                     {req.email && (
                       <a href={`mailto:${req.email}`} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
                          <Mail size={14} className="text-blue-500"/> {req.email}
                       </a>
                     )}
                  </div>
               </div>

               {/* ACTIONS */}
               <div className="flex flex-row lg:flex-col gap-2">
                  <StatusButton id={req.id} status="CONTACTED" label="Mark Contacted" icon={<CheckCircle size={16}/>} current={req.status} />
                  <StatusButton id={req.id} status="REJECTED" label="Reject Offer" icon={<XCircle size={16}/>} current={req.status} />
               </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Client Component for Buttons (Inline for simplicity)
import { ButtonHTMLAttributes } from "react";
function StatusButton({ id, status, label, icon, current }: any) {
  if (current === status || current === 'REJECTED') return null; // Hide if already set
  
  return (
    <form action={updateRequestStatus}>
       <input type="hidden" name="id" value={id} />
       <input type="hidden" name="status" value={status} />
       <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-xs font-bold uppercase hover:bg-black hover:text-white transition-all w-full justify-center">
         {icon} {label}
       </button>
    </form>
  )
}