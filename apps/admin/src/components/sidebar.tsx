"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, FileText, Settings, PlusCircle, PieChart } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Car },
  { label: "Create Vehicle", href: "/create", icon: PlusCircle },
  { label: "Requests", href: "/requests", icon: FileText },
  { label: "Finance", href: "/finance", icon: PieChart },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-off-white border-r border-grey-200 flex flex-col p-6 z-50"
    >
      {/* Brand Identity */}
      <div className="mb-10 pl-3">
        <h1 className="text-xl font-bold tracking-tight text-subtle-black">
          Trusted Wheels
        </h1>
        <p className="text-xs text-grey-500 font-mono mt-1">ADMIN CONSOLE</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 hover:bg-grey-100"
            >
              {/* Active State Indicator (Motion) */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-grey-200 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <Icon 
                size={18} 
                className={clsx(
                  "transition-colors",
                  isActive ? "text-strong-black" : "text-grey-500 group-hover:text-grey-700"
                )} 
              />
              <span className={clsx(
                "text-sm font-medium",
                isActive ? "text-strong-black" : "text-grey-600 group-hover:text-grey-900"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User / Footer */}
      <div className="mt-auto pt-6 border-t border-grey-200">
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-grey-300" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-subtle-black">Admin User</span>
            <span className="text-[10px] text-grey-500">Super Admin</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}