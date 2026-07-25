'use client'

import { AudioLines } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
              <AudioLines className="w-3 h-3 text-primary" />
            </div>
            <span className="text-xs font-bold text-foreground tracking-tight">CekSound</span>
            <span className="text-xs text-muted-foreground">
              &copy; {currentYear}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-xs">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Cara Kerja
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
