import { prisma } from "@repo/database";
import Link from "next/link";
import { 
  DollarSign, Car, Users, FileText, ArrowUpRight, 
  Clock, Plus 
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [vehicleCount, soldCount, requestCount, totalValue] = await Promise.all([
    prisma.vehicle.count({ where: { status: "PUBLISHED" } }),
    prisma.vehicle.count({ where: { status: "SOLD" } }),
    prisma.listingRequest.count({ where: { status: "PENDING" } }),
    prisma.vehicle.aggregate({
      where: { status: "PUBLISHED" },
      _sum: { listingPrice: true }
    })
  ]);

  const recentActivity = [
    { id: 1, action: "Stock Added", details: "2018 Toyota Prado TX-L", time: "2h ago", color: "text-green-600 bg-green-50" },
    { id: 2, action: "Price Adjustment", details: "Mercedes C200 (Reduced)", time: "4h ago", color: "text-blue-600 bg-blue-50" },
    { id: 3, action: "Inquiry", details: "Request for financing (John Doe)", time: "5h ago", color: "text-amber-600 bg-amber-50" },
  ];

  return { 
    vehicleCount, soldCount, requestCount, 
    totalValue: totalValue._sum.listingPrice || 0,
    recentActivity 
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Dashboard</h1>
          <p className="text-gray-500 font-medium">Ridgeways Yard • Real-time Overview</p>
        </div>
        <div className="flex gap-4">
          <Link href="/invoices/create" className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:border-black hover:text-black transition-all bg-white">
            Create Invoice
          </Link>
          <Link href="/vehicles/create" className="btn-primary flex items-center gap-2 shadow-blue-500/30">
            <Plus size={20} strokeWidth={3} /> Add Vehicle
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard 
          label="Inventory Value" 
          value={`KES ${(Number(stats.totalValue) / 1000000).toFixed(1)}M`} 
          icon={<DollarSign size={24} />}
          accent="text-blue-600"
          bg="bg-blue-50"
        />
        <GlassCard 
          label="Active Vehicles" 
          value={stats.vehicleCount.toString()} 
          icon={<Car size={24} />}
          accent="text-indigo-600"
          bg="bg-indigo-50"
        />
        <GlassCard 
          label="Pending Requests" 
          value={stats.requestCount.toString()} 
          icon={<Users size={24} />}
          accent="text-amber-600"
          bg="bg-amber-50"
          alert={stats.requestCount > 0}
        />
        <GlassCard 
          label="Units Sold" 
          value={stats.soldCount.toString()} 
          icon={<FileText size={24} />}
          accent="text-emerald-600"
          bg="bg-emerald-50"
        />
      </div>

      {/* ACTIVITY & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white/50 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/80">
            <h3 className="font-bold text-xl text-black">Recent Activity</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">View All</button>
          </div>
          <div className="p-4 space-y-2">
            {stats.recentActivity.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-black group-hover:text-blue-600 transition-colors">{item.action}</p>
                    <p className="text-sm text-gray-500 font-medium">{item.details}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-300 group-hover:text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-xl shadow-blue-500/40 p-8 text-white flex flex-col justify-between relative overflow-hidden">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
           
           <div>
             <h3 className="text-2xl font-bold mb-6">Quick Management</h3>
             <div className="space-y-4">
               <QuickLink href="/requests" label="Review Valuation Requests" count={stats.requestCount} />
               <QuickLink href="/features" label="Manage Feature Dropdowns" />
               <QuickLink href="/settings" label="Update Store Hours" />
             </div>
           </div>

           <button className="mt-8 w-full bg-white text-blue-700 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-50 hover:scale-[1.02] transition-all shadow-lg">
             Download Monthly Report
           </button>
        </div>

      </div>
    </div>
  );
}

// --- VISUAL COMPONENTS ---

function GlassCard({ label, value, icon, accent, bg, alert }: any) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 
      ${alert ? 'border-amber-400 ring-4 ring-amber-50' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${bg} ${accent}`}>
          {icon}
        </div>
        {alert && <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping" />}
      </div>
      <h3 className="text-4xl font-extrabold text-black tracking-tight">{value}</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">{label}</p>
    </div>
  )
}

function QuickLink({ href, label, count }: any) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
      <span className="text-sm font-bold text-white/90">{label}</span>
      {count > 0 ? (
        <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{count} New</span>
      ) : (
        <ArrowUpRight size={16} className="text-white/50 group-hover:text-white" />
      )}
    </Link>
  )
}