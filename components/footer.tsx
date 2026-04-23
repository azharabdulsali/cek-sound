'use client'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 py-12 animate-in fade-in duration-1000 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-float"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="animate-slide-up">
            <p className="text-slate-700 font-bold text-base">
              CekSound
            </p>
            <p className="text-slate-600 text-sm">
              &copy; {currentYear} CekSound. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs mt-2 font-medium">
              Verifikasi keaslian audio dengan teknologi AI terdepan
            </p>
          </div>
          <div className="flex items-center gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <a href="#privacy" className="text-slate-600 hover:text-blue-600 text-sm transition-colors font-medium group relative">
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <div className="w-1 h-6 bg-slate-300"></div>
            <a href="#api" className="text-slate-600 hover:text-blue-600 text-sm transition-colors font-medium group relative">
              API Documentation
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
