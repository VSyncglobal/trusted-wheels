import { prisma } from "@repo/database";
import Link from "next/link";
import { 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Helper for Status Styles
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "OVERDUE": return "bg-red-100 text-red-700 border-red-200";
      case "SENT": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-500 border-gray-200"; // DRAFT
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID": return <CheckCircle2 size={14} />;
      case "OVERDUE": return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Invoices</h1>
          <p className="text-gray-500 font-medium">Manage billing and payment records.</p>
        </div>
        <Link 
          href="/invoices/create" 
          className="btn-primary flex items-center gap-2 shadow-blue-500/30"
        >
           <Plus size={20} strokeWidth={3} /> New Invoice
        </Link>
      </div>

      {/* INVOICE LIST */}
      <div className="space-y-4">
        {invoices.length === 0 ? (
          <div className="p-16 text-center bg-white/50 backdrop-blur-md rounded-[2rem] border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FileText size={32} />
            </div>
            <p className="text-gray-400 font-bold text-lg">No invoices found.</p>
            <p className="text-gray-400 text-sm mb-6">Create your first invoice to track payments.</p>
            <Link href="/invoices/create" className="text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline">
                Create Now
            </Link>
          </div>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} className="group bg-white/70 backdrop-blur-sm p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center">
               
               {/* ICON & ID */}
               <div className="flex items-center gap-4 min-w-[180px]">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest">Invoice</span>
                    <span className="text-lg font-bold text-black">{inv.number}</span>
                  </div>
               </div>

               {/* CLIENT */}
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-gray-400"/>
                    <span className="text-sm font-bold text-black">{inv.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <Calendar size={12}/> Due: {new Date(inv.dueDate).toLocaleDateString()}
                  </div>
               </div>

               {/* STATUS */}
               <div>
                 <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${getStatusColor(inv.status)}`}>
                    {getStatusIcon(inv.status)} {inv.status}
                 </span>
               </div>

               {/* AMOUNT */}
               <div className="text-right min-w-[120px]">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
                  <span className="text-xl font-extrabold text-black">KES {Number(inv.total).toLocaleString()}</span>
               </div>

               {/* ACTIONS */}
               <div className="flex gap-2">
                 <Link 
                   href={`/invoices/${inv.id}/print`} 
                   className="p-3 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                   title="Print PDF"
                 >
                   <Printer size={20} />
                 </Link>
                 <Link 
                   href={`/invoices/${inv.id}`} 
                   className="p-3 rounded-xl hover:bg-black hover:text-white text-gray-400 transition-colors"
                   title="Edit Invoice"
                 >
                   <MoreHorizontal size={20} />
                 </Link>
               </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}