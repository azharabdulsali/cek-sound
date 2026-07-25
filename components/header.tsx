'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { AudioLines } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <AudioLines className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground tracking-tight">CekSound</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-5">
          <a href="#features" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide">
            Fitur
          </a>
          <a href="#how-it-works" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide">
            Cara Kerja
          </a>
          <a href="#faq" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide">
            FAQ
          </a>
          <div className="flex items-center gap-2 ml-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="text-foreground text-xs font-medium px-3">
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-4 rounded-lg">
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className="sm:hidden flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="text-foreground text-[11px] px-1.5">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] px-2.5 rounded-lg">
            <Link href="/register">Daftar</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
