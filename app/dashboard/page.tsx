'use client'

import { CheckCircle2, Shield, PlusSquare, Image as ImageIcon } from 'lucide-react'
import { AppLayout } from '@/components/app-layout'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Selamat Datang Kembali!
          </h1>
          <p className="text-slate-400">
            Kelola dan analisis audio deepfake Anda dengan mudah
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left shadow-sm">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">0</p>
            <p className="text-sm font-medium text-slate-400">Audio Diperiksa</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left shadow-sm">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4">
              <PlusSquare className="w-6 h-6 text-pink-500" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">0</p>
            <p className="text-sm font-medium text-slate-400">Audio Dibuat</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left shadow-sm">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">0</p>
            <p className="text-sm font-medium text-slate-400">Total Galeri</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/periksa" className="bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-xl p-5 flex items-center gap-4 group">
               <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Shield className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h3 className="text-white font-bold text-lg leading-tight">Periksa Keaslian Audio</h3>
                 <p className="text-emerald-100 text-sm">Analisis audio untuk mendeteksi deepfake AI</p>
               </div>
            </Link>
            
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 opacity-60 rounded-xl p-5 flex items-center gap-4 cursor-not-allowed">
               <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                 <PlusSquare className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h3 className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                   Buat Audio Baru 
                   <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Soon</span>
                 </h3>
                 <p className="text-pink-100 text-sm">Generate audio baru dari teks</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
