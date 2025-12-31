import Link from 'next/link';
import { LayoutDashboard, Car, FileText, Settings, SlidersHorizontal } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold tracking-tight">TRUSTED WHEELS</h1>
        <p className="text-xs text-gray-400">Admin Console</p>
      </div>
      
      <nav className="space-y-1 flex-1">
        <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Overview" />
        <NavItem href="/vehicles" icon={<Car size={20} />} label="Inventory" />
        <NavItem href="/invoices/create" icon={<FileText size={20} />} label="Invoices" />
        <NavItem href="/features" icon={<SlidersHorizontal size={20} />} label="Features" />
      </nav>

      <div className="border-t border-gray-100 pt-4">
        <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }: any) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-black transition-colors">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}