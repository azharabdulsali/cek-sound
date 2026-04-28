'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AudioLines, LogOut, User, Loader2, Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { AppSidebar } from './app-sidebar'
import { ThemeToggle } from './theme-toggle'
import Link from 'next/link'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
        return
      }
      setUser(session.user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login')
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await supabase.auth.signOut()
    } finally {
      window.location.href = '/login'
    }
  }

  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Pengguna'

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center animate-pulse">
            <AudioLines className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Topbar — only visible on <768px */}
      <header className="md:hidden bg-card border-b border-border flex items-center justify-between px-4 h-14 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center">
            <AudioLines className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-foreground">CekSound</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -mr-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay — only on <768px */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-14 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-card border-b border-border p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-accent text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/periksa"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-accent text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Periksa Audio
              </Link>
              <Link
                href="/pengaturan"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-accent text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pengaturan
              </Link>
            </nav>
            <div className="mt-4 pt-4 border-t border-border">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 text-sm font-medium w-full"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar — visible md+ (tablet & desktop) */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop / Tablet Topbar — hidden on mobile */}
        <header className="hidden md:flex bg-card border-b border-border h-16 items-center justify-between px-5 lg:px-6 sticky top-0 z-30">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center">
              <AudioLines className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-foreground">CekSound</span>
          </Link>

          {/* User info + theme + logout */}
          <div className="flex items-center gap-2 lg:gap-3">
            <ThemeToggle />

            <div className="flex items-center gap-2 bg-accent rounded-full px-3 py-1.5 border border-border">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground max-w-[120px] lg:max-w-[150px] truncate">
                {fullName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-9 h-9 rounded-full bg-accent hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              title="Keluar"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
