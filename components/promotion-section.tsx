'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function PromotionSection() {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="mx-auto relative">
        {/* CTA Card */}
        <div className="relative bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-3xl p-10 sm:p-16 text-center overflow-hidden shadow-2xl shadow-primary/20">
          {/* Animated background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full mb-8 text-sm text-white/90 font-medium">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Gratis untuk semua pengguna
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight">
              Siap Melindungi<br />
              <span className="text-blue-200">Suara Anda?</span>
            </h2>

            <p className="text-lg sm:text-xl text-blue-100/80 mb-10 max-w-xl mx-auto text-balance">
              Bergabunglah sekarang dan dapatkan akses ke detector audio deepfake terdepan dengan AI forensik paling canggih.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white hover:bg-blue-50 text-primary px-8 py-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                <Link href="/register">
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02]">
                <Link href="/login">
                  Sudah Punya Akun
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
