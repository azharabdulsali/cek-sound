'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function PromotionSection() {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-4xl relative">
        {/* CTA Card — solid primary, no gradient, no animated orbs */}
        <div className="relative bg-primary rounded-xl p-6 sm:p-10 lg:p-14 text-center overflow-hidden">
          {/* Subtle scanline overlay */}
          <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 text-balance leading-tight tracking-tight">
              Siap Melindungi
              <br />
              Audio Anda?
            </h2>

            <p className="text-sm sm:text-base text-primary-foreground/70 mb-8 max-w-md mx-auto leading-relaxed">
              Bergabung dan mulai verifikasi audio dengan deteksi deepfake
              berbasis machine learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-background hover:bg-background/90 text-foreground px-7 py-5 rounded-lg font-semibold text-sm transition-all duration-200 group"
              >
                <Link href="/register">
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground px-7 py-5 rounded-lg font-semibold text-sm transition-all duration-200"
              >
                <Link href="/login">Sudah Punya Akun</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
