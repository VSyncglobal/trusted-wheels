import Link from 'next/link';
import { 
  LayoutDashboard, 
  Car, 
  PieChart, 
  SlidersHorizontal, 
  Users, 
  LogOut, 
  FileText,
  Receipt 
} from 'lucide-react';
import { handleSignOut } from "../actions"; 
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full p-4 gap-6 relative">
       
        {/* BACKGROUND GLOW */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* SIDEBAR */}
        <aside className="w-64 hidden md:flex flex-col bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-white/60 h-full p-6 z-10 relative">
          <div className="mb-12 px-2 flex items-center gap-4">
             <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-500/30 shrink-0">TW</div>
             <div>
                <h1 className="font-extrabold text-black text-lg leading-none tracking-tight">Trust Rides</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Admin OS</p>
             </div>
          </div>
          
          <nav className="space-y-2 flex-1">
            <NavLink href="/" icon={<LayoutDashboard size={20} />}>Dashboard</NavLink>
            <NavLink href="/vehicles" icon={<Car size={20} />}>Inventory</NavLink>
            <NavLink href="/finance" icon={<PieChart size={20} />}>Finance</NavLink>
            <NavLink href="/invoices" icon={<Receipt size={20} />}>Invoices</NavLink>
            <NavLink href="/requests" icon={<Users size={20} />}>Requests</NavLink>
            <div className="pt-4 pb-2"><p className="px-4 text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">Configuration</p></div>
            <NavLink href="/features" icon={<SlidersHorizontal size={20} />}>Features</NavLink>
            <NavLink href="/invoices/create" icon={<FileText size={20} />}>Generator</NavLink>
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100/50">
             <form action={handleSignOut}>
                <button type="submit" className="flex items-center gap-3 w-full text-gray-400 hover:text-red-600 transition-colors text-xs font-bold uppercase tracking-widest group px-4 py-3 rounded-xl hover:bg-red-50">
                  <LogOut size={16} /> Sign Out
                </button>
             </form>
          </div>
        </aside>

        {/* MAIN CONTENT BUBBLE */}
        <main className="flex-1 h-full relative z-10">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white/60 overflow-y-auto scrollbar-hide">
            <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-full">
              {children}
            </div>
          </div>
        </main>
    </div>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="group flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-500 transition-all duration-300
      hover:bg-white hover:text-blue-600 hover:shadow-lg hover:shadow-gray-100 hover:scale-[1.02]"
    >
      <span className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300">{icon}</span>
      {children}
    </Link>
  )
}