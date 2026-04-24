'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Music, LogOut, User, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

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
      // Gunakan window.location untuk force full page reload
      // agar Next.js router cache bersih dan sesi Supabase benar-benar terhapus
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-slate-500">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">CekSound</span>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700 max-w-[180px] truncate">
                {fullName}
              </span>
            </div>

            <button
              id="dashboard-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-full px-3 py-1.5 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center text-center">
          {/* Success icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-blue-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          {/* Welcome text */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Selamat Datang,{' '}
            <span className="text-blue-600">{fullName}</span>! 👋
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-md">
            Anda berhasil masuk ke CekSound. Halaman dashboard akan segera hadir.
          </p>

          {/* Info badge */}
          <div className="mt-8 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-700 font-medium">
              {user?.email}
            </span>
          </div>

          {/* Card placeholder */}
          <div className="mt-12 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Analisis', value: '—', desc: 'Segera hadir' },
              { label: 'Audio Asli', value: '—', desc: 'Segera hadir' },
              { label: 'Audio Palsu', value: '—', desc: 'Segera hadir' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:shadow-md hover:shadow-slate-100 transition-shadow"
              >
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-300 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
