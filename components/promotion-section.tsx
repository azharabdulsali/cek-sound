'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function PromotionSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative overflow-hidden min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-28 sm:w-36 lg:w-44 h-28 sm:h-36 lg:h-44 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
        <div className="inline-flex items-center gap-2 bg-white bg-opacity-10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 animate-slide-up text-xs sm:text-sm" style={{ animationDelay: '0.1s' }}>
          <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-300" />
          <span className="font-semibold text-white">Jadilah bagian dari komunitas verifikasi audio</span>
          <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-300" />
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 text-balance animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Siap Melindungi<br /> <span className="text-blue-200">Suara Anda?</span>
        </h2>

        <p className="text-base sm:text-lg lg:text-2xl text-blue-100 text-balance mb-3 sm:mb-4 px-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Bergabunglah dengan ribuan pengguna yang sudah memverifikasi keaslian audio mereka.
        </p>

        <p className="text-sm sm:text-base lg:text-lg text-blue-200 text-balance mb-8 sm:mb-12 max-w-2xl mx-auto px-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          Daftar sekarang dan dapatkan akses ke detector audio deepfake terdepan dengan AI forensik paling canggih.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Button 
            className="bg-white hover:bg-yellow-100 text-blue-600 px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group w-full sm:w-auto"
          >
            Daftar Sekarang
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline"
            className="border-2 border-white hover:bg-white hover:bg-opacity-10 text-white px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
          >
            Pelajari Lebih Lanjut
          </Button>
        </div>
      </div>
    </section>
  )
}
