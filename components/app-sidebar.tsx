'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShieldCheck, PlusSquare, Image as ImageIcon, Settings } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Periksa', href: '/periksa', icon: ShieldCheck },
  { name: 'Buat', href: '#', icon: PlusSquare, isSoon: true },
  { name: 'Galeri', href: '#', icon: ImageIcon, isSoon: false },
  { name: 'Pengaturan', href: '#', icon: Settings, isSoon: false },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 flex-shrink-0 h-[calc(100vh-4rem)] sm:h-screen sticky top-0 sm:top-0 hidden sm:flex flex-col">
      <div className="p-4 pt-6 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.isSoon ? '#' : item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-500 font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                } ${item.isSoon ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={(e) => item.isSoon && e.preventDefault()}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </div>
                {item.isSoon && (
                  <span className="bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    Soon
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
