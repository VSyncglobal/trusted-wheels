import { prisma } from "@repo/database";
import Link from "next/link";
import { Plus, Search, FileText, MoreHorizontal, Calendar, User, DollarSign, CheckCircle2, Clock, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// --- HELPERS ---
const statusColors = {
  DRAFT: "bg-gray-100 text-gray-500",
  SENT: "bg-blue-50 text-blue-600",
  PAID: "bg-emerald-50 text-emerald-600",
  OVERDUE: "bg-red-50 text-red-600",
  VOID: "bg-gray-200 text-gray-600 line-through"
};

const statusIcons = {
  DRAFT: FileText,
  SENT: FileText, 
  PAID: CheckCircle2,
  OVERDUE: XCircle,
  VOID: XCircle
};

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Invoices</h1>
          <p className="text-gray-500 font-medium">Manage billing & track payments.</p>
        </div>
        <Link href="/invoices/create" className="btn-primary flex items-center gap-2 shadow-blue-500/30">
           <Plus size={20} /> Create Invoice
        </Link>
      </div>

      {/* SEARCH (Placeholder) */}
      <div className="relative">
         <input 
           placeholder="Search invoices by client or number..." 
           className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
         />
         <Search className="absolute left-4 top-4.5 text-gray-400" size={20}/>
      </div>

      {/* LIST */}
      <div className="space-y-4">
         {invoices.length === 0 ? (
            <div className="p-12 text-center bg-white/50 border border-dashed border-gray-200 rounded-[2rem]">
               <FileText size={48} className="mx-auto text-gray-300 mb-4" />
               <p className="text-gray-400 font-bold">No invoices generated yet.</p>
            </div>
         ) : (
           // FIX: Explicitly type 'inv' as any to pass build strictness
           invoices.map((inv: any) => (
             <div key={inv.id} className="group bg-white/70 backdrop-blur-sm p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center">
                
                {/* ICON & ID */}
                <div className="flex items-center gap-4 min-w-[200px]">
                   <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${statusColors[inv.status as keyof typeof statusColors]}`}>
                      {/* @ts-ignore */}
                      <statusIcons.DRAFT size={20} /> 
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">#{inv.number}</p>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${statusColors[inv.status as keyof typeof statusColors]}`}>
                        {inv.status}
                      </span>
                   </div>
                </div>

                {/* CLIENT */}
                <div className="flex-1">
                   <h3 className="font-extrabold text-lg text-black mb-1">{inv.clientName}</h3>
                   <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1"><User size={12}/> {inv.clientPhone}</span>
                      <span className="flex items-center gap-1"><Calendar size={12}/> Due {new Date(inv.dueDate).toLocaleDateString()}</span>
                   </div>
                </div>

                {/* TOTAL */}
                <div className="text-right min-w-[150px]">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                   <h3 className="text-2xl font-extrabold text-black tracking-tight">
                     KES {Number(inv.total).toLocaleString()}
                   </h3>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 justify-end">
                   <Link href={`/invoices/${inv.id}`} className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-black hover:text-white transition-colors">
                      <MoreHorizontal size={20} />
                   </Link>
                </div>

             </div>
           ))
         )}
      </div>

    </div>
  )
}