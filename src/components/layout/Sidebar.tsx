"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ClipboardList,
  Users,
  MonitorCog,
  BarChart3,
  Settings,
  BadgeDollarSign,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: Package,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Boxes,
  },
  {
    name: "Production",
    href: "/production",
    icon: ClipboardList,
  },
  {
    name: "CNC Files",
    href: "/cnc",
    icon: MonitorCog,
  },
  {
   name: "Piecework",
   href: "/piecework",
   icon: Users,
  },
  {
   name: "Payroll",
   href: "/payroll",
   icon: BadgeDollarSign,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col">

      <div className="border-b border-slate-800 p-6">

        <div className="flex justify-center">
          <Image
            src="/images/aurora-logo.png"
            alt="Aurora Outdoor Furniture"
            width={170}
            height={170}
            priority
          />
        </div>

        <h2 className="mt-4 text-center text-xl font-bold text-white">
          Aurora Outdoor Furniture
        </h2>

        <p className="text-center text-sm text-slate-400">
          Production Management
        </p>

      </div>

      <nav className="flex-1 p-4 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
               pathname === item.href
                 ? "bg-blue-600 text-white shadow-lg"
                 : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}

      </nav>

      <div className="border-t border-slate-800 p-4 text-center text-xs text-slate-500">
        Aurora Outdoor Furniture
      </div>

    </aside>
  );
}