'use client'

export function HeroSection() {
  return (
    <section className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-slate-50 relative overflow-hidden animate-in fade-in duration-1000">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-40 sm:w-64 h-40 sm:h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-32 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
        {/* Emoji decoration */}
        <div className="mb-4 sm:mb-6 text-5xl sm:text-7xl lg:text-8xl animate-bounce-in">
          🎙️
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 text-balance animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
          Deteksi Deepfake Suara dengan Presisi <span className="text-blue-600">AI</span>
        </h1>

        <p className="text-base sm:text-lg lg:text-2xl text-slate-600 text-balance mb-6 sm:mb-8 animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
          Lindungi diri Anda dari manipulasi audio. Verifikasi instan apakah suara adalah manusia asli atau hasil rekayasa AI dengan model forensik kami yang canggih.
        </p>
      </div>
    </section>
  )
}
