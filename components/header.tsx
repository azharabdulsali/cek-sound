'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { AudioLines } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <AudioLines className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">CekSound</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Fitur
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Cara Kerja
          </a>
          <div className="flex items-center gap-2.5 ml-2">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm" className="border-border text-foreground hover:bg-accent">
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg shadow-primary/20">
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="border-border text-foreground text-xs px-2.5">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm" className="bg-gradient-to-r from-primary to-purple-500 text-white text-xs px-2.5">
            <Link href="/register">Daftar</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
