'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Shield, AlertTriangle, BarChart3, Loader2, AudioLines } from 'lucide-react'
import { AppLayout } from '@/components/app-layout'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type HistoryItem = {
  id: string
  filename: string
  audio_url: string
  result_label: string
  prob_asli: number
  prob_deepfake: number
  created_at: string
}

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Pengguna')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
          setUserName(userData.user.user_metadata?.full_name?.split(' ')[0] || userData.user.email?.split('@')[0] || 'Pengguna')

          const { data, error } = await supabase
            .from('detection_history')
            .select('*')
            .order('created_at', { ascending: false })

          if (error) throw error
          if (data) setHistory(data)
        }
      } catch (err) {
        console.error('Error fetching history:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  // Compute stats
  const totalChecked = history.length
  const deepfakeCount = history.filter(h => h.result_label === 'Deepfake').length
  const asliCount = history.filter(h => h.result_label === 'Asli').length

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-primary/15 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Selamat Datang, {userName}! 👋
            </h1>
            <p className="text-blue-100/80">
              Kelola dan analisis audio deepfake Anda dengan mudah
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total Diperiksa</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : totalChecked}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Audio Asli</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : asliCount}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Deepfake Terdeteksi</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : deepfakeCount}
            </p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">Aksi Cepat</h2>
          <Link
            href="/periksa"
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 rounded-xl p-5 flex items-center gap-4 group transition-all duration-300 hover:shadow-lg hover:shadow-primary/15 hover:scale-[1.01]"
          >
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">Periksa Keaslian Audio</h3>
              <p className="text-blue-100/70 text-sm">Upload dan analisis audio untuk mendeteksi deepfake AI</p>
            </div>
          </Link>
        </div>

        {/* Detection History */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-foreground">Riwayat Deteksi</h2>
            {!loading && history.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
                {history.length} hasil
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Audio</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-center">Skor</th>
                  <th className="px-5 py-3.5">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Memuat riwayat...</p>
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center">
                      <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <AudioLines className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">Belum ada riwayat deteksi audio</p>
                      <Link href="/periksa" className="text-primary text-sm font-medium hover:underline">
                        Mulai periksa audio →
                      </Link>
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <p className="font-medium text-foreground truncate max-w-[200px]" title={item.filename}>
                            {item.filename}
                          </p>
                          {item.audio_url && (
                            <audio controls src={item.audio_url} className="h-8 w-48 rounded-lg" />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          item.result_label === 'Deepfake'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}>
                          {item.result_label === 'Deepfake' ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {item.result_label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`font-bold text-sm ${
                            item.result_label === 'Deepfake' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {item.result_label === 'Deepfake'
                              ? `${(item.prob_deepfake * 100).toFixed(1)}%`
                              : `${(item.prob_asli * 100).toFixed(1)}%`
                            }
                          </span>
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.result_label === 'Deepfake' ? 'bg-red-500' : 'bg-emerald-500'
                              }`}
                              style={{
                                width: `${item.result_label === 'Deepfake'
                                  ? (item.prob_deepfake * 100)
                                  : (item.prob_asli * 100)
                                }%`
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-sm">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
