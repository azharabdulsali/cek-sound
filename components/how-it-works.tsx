'use client'

import { Mic, Cpu, FileText } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Mic,
      emoji: '🎙️',
      title: 'Input Audio',
      description: 'Unggah file audio atau rekam langsung menggunakan mikrofon Anda.',
      color: 'from-purple-100 to-blue-100',
    },
    {
      icon: Cpu,
      emoji: '⚙️',
      title: 'Analisis Forensik AI',
      description: 'Model canggih kami menganalisis pola akustik dan karakteristik ucapan Anda.',
      color: 'from-blue-100 to-cyan-100',
    },
    {
      icon: FileText,
      emoji: '📊',
      title: 'Dapatkan Verifikasi Instan',
      description: 'Terima laporan detail dengan skor kepercayaan dan wawasan analisis mendalam.',
      color: 'from-cyan-100 to-green-100',
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-20 px-4 sm:px-6 lg:px-8 flex items-center bg-gradient-to-b from-slate-50 via-white to-blue-50 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center mb-3 sm:mb-4 text-balance animate-slide-up">
          Cara Kerjanya
        </h2>
        <p className="text-center text-slate-600 text-base sm:text-lg mb-12 sm:mb-16 max-w-2xl mx-auto animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
          Tiga langkah sederhana untuk memverifikasi keaslian audio Anda dengan AI terdepan
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="relative animate-bounce-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 sm:top-14 left-1/2 w-full h-1.5 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 transform -translate-x-1/2 translate-x-12 rounded-full"></div>
                )}

                <div className="relative z-10 text-center">
                  <div className={`w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl border-4 border-white transform hover:scale-110 transition-transform duration-300 group`}>
                    <span className="text-3xl sm:text-4xl lg:text-5xl group-hover:animate-float">{step.emoji}</span>
                  </div>
                  <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 rounded-full mb-2 sm:mb-3">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">
                      Langkah {index + 1}
                    </p>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 text-pretty">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-pretty px-2">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
