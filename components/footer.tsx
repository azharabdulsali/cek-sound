'use client'

import { AudioLines } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-card/50 py-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <Link href="/" className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center">
                <AudioLines className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">CekSound</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              &copy; {currentYear} CekSound. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Cara Kerja
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
