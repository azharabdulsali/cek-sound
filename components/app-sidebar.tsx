"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  PlusSquare,
  Image as ImageIcon,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Periksa Audio", href: "/periksa", icon: ShieldCheck },
  { name: "Text To Speech", href: "#", icon: PlusSquare, isSoon: true },
  { name: "Voice Changer", href: "#", icon: ImageIcon, isSoon: true },
  { name: "Pengaturan", href: "/pengaturan", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0 h-screen sticky top-0 hidden sm:flex flex-col">
      <div className="p-4 pt-6 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.isSoon ? "#" : item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                } ${item.isSoon ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={(e) => item.isSoon && e.preventDefault()}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </div>
                {item.isSoon && (
                  <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
