import { prisma } from "@repo/database";
import Link from "next/link";
import { 
  DollarSign, TrendingUp, PieChart, Download, 
  FileText, ArrowUpRight, Activity 
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getFinanceData() {
  // 1. Get Aggregates
  const [sold, published, draft, archived] = await Promise.all([
    prisma.vehicle.aggregate({ where: { status: "SOLD" }, _sum: { listingPrice: true }, _count: true }),
    prisma.vehicle.aggregate({ where: { status: "PUBLISHED" }, _sum: { listingPrice: true }, _count: true }),
    prisma.vehicle.aggregate({ where: { status: "DRAFT" }, _sum: { listingPrice: true }, _count: true }),
    prisma.vehicle.aggregate({ where: { status: "ARCHIVED" }, _count: true })
  ]);

  // 2. Get Recent Transactions (Recently Sold)
  const recentSales = await prisma.vehicle.findMany({
    where: { status: "SOLD" },
    orderBy: { updatedAt: "desc" },
    take: 5,
    // ADDED 'year: true' HERE to fix the error
    select: { 
      id: true, 
      make: true, 
      model: true, 
      year: true, // <--- This was missing
      listingPrice: true, 
      updatedAt: true, 
      stockNumber: true 
    }
  });

  return { sold, published, draft, archived, recentSales };
}

export default async function FinancePage() {
  const data = await getFinanceData();

  // Helper for currency format
  const fmt = (n: any) => `KES ${Number(n || 0).toLocaleString()}`;

  return (
    <div className="space-y-10 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Financial Intelligence</h1>
          <p className="text-gray-500 font-medium">Cash flow analysis & asset valuation.</p>
        </div>
        <div className="flex gap-4">
           {/* The Invoice Generator is now a utility ACCESSED from here */}
           <Link href="/invoices/create" className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:border-black hover:text-black transition-all bg-white flex items-center gap-2">
             <FileText size={18}/> Generator Tool
           </Link>
           <button className="btn-primary flex items-center gap-2 shadow-blue-500/30">
             <Download size={20} /> Export Report
           </button>
        </div>
      </div>

      {/* 1. HIGH LEVEL METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Realized Revenue */}
        <div className="bg-emerald-50/50 backdrop-blur-md p-8 rounded-[2rem] border border-emerald-100 shadow-xl shadow-emerald-100/50">
           <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl"><DollarSign size={24}/></div>
             <span className="bg-white/80 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">Realized</span>
           </div>
           <h3 className="text-4xl font-extrabold text-black tracking-tight">{fmt(data.sold._sum.listingPrice)}</h3>
           <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-wide">Total Sales Volume ({data.sold._count} Units)</p>
        </div>

        {/* Asset Value */}
        <div className="bg-blue-50/50 backdrop-blur-md p-8 rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-100/50">
           <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-blue-100 text-blue-700 rounded-2xl"><PieChart size={24}/></div>
             <span className="bg-white/80 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-blue-800">Projected</span>
           </div>
           <h3 className="text-4xl font-extrabold text-black tracking-tight">{fmt(data.published._sum.listingPrice)}</h3>
           <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-wide">Active Inventory Value ({data.published._count} Units)</p>
        </div>

        {/* Pipeline Value */}
        <div className="bg-amber-50/50 backdrop-blur-md p-8 rounded-[2rem] border border-amber-100 shadow-xl shadow-amber-100/50">
           <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-amber-100 text-amber-700 rounded-2xl"><Activity size={24}/></div>
             <span className="bg-white/80 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-amber-800">Pipeline</span>
           </div>
           <h3 className="text-4xl font-extrabold text-black tracking-tight">{fmt(data.draft._sum.listingPrice)}</h3>
           <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-wide">Work In Progress ({data.draft._count} Units)</p>
        </div>
      </div>

      {/* 2. RECENT TRANSACTIONS LIST */}
      <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
         <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-white/80">
            <h3 className="text-2xl font-extrabold text-black">Recent Transactions</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-black uppercase tracking-widest">View All Ledger</button>
         </div>
         
         <div className="p-6">
            {data.recentSales.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium">No sales recorded yet.</div>
            ) : (
              <table className="w-full">
                <thead className="text-left text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                  <tr>
                    <th className="pb-4 pl-4">Vehicle</th>
                    <th className="pb-4">Stock #</th>
                    <th className="pb-4">Date Sold</th>
                    <th className="pb-4 text-right pr-4">Amount</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold text-gray-700">
                  {data.recentSales.map((sale) => (
                    <tr key={sale.id} className="group hover:bg-white hover:shadow-lg transition-all rounded-xl">
                      <td className="py-4 pl-4 rounded-l-xl text-black">{sale.year} {sale.make} {sale.model}</td>
                      <td className="py-4 text-blue-600">{sale.stockNumber}</td>
                      <td className="py-4 text-gray-500">{new Date(sale.updatedAt).toLocaleDateString()}</td>
                      <td className="py-4 text-right pr-4 text-emerald-600 font-extrabold">{fmt(sale.listingPrice)}</td>
                      <td className="py-4 rounded-r-xl text-center">
                        <Link href={`/vehicles/${sale.id}`} className="text-gray-300 hover:text-black"><ArrowUpRight size={18}/></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
         </div>
      </div>

    </div>
  )
}