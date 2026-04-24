'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Music } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 sm:w-8 h-7 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Music className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <span className="text-base sm:text-xl font-bold text-slate-900 whitespace-nowrap">CekSound</span>
        </div>

        <nav className="hidden sm:flex items-center gap-4 lg:gap-6">
          <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors text-xs sm:text-sm font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors text-xs sm:text-sm font-medium">
            How it Works
          </a>
          <div className="flex items-center gap-2 lg:gap-3">
            <Button asChild variant="outline" size="sm" className="border-slate-300 text-slate-900 hover:bg-slate-100 text-xs lg:text-sm px-2 sm:px-3">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs lg:text-sm px-2 sm:px-3">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </nav>

        <div className="sm:hidden flex items-center gap-1.5">
          <Button asChild variant="outline" size="sm" className="border-slate-300 text-slate-900 text-xs px-2">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
