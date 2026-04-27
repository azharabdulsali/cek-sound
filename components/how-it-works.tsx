'use client'

import { Upload, Cpu, FileCheck } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      emoji: '🎙️',
      title: 'Upload Audio',
      description: 'Unggah file audio Anda dalam format MP3, WAV, atau format audio lainnya.',
      color: 'from-primary to-blue-400',
    },
    {
      icon: Cpu,
      emoji: '⚙️',
      title: 'Analisis AI',
      description: 'Model AI canggih kami menganalisis pola akustik dan karakteristik suara secara mendalam.',
      color: 'from-purple-500 to-pink-400',
    },
    {
      icon: FileCheck,
      emoji: '📊',
      title: 'Hasil Instan',
      description: 'Terima laporan detail dengan skor kepercayaan dan klasifikasi audio secara real-time.',
      color: 'from-emerald-500 to-teal-400',
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4 bg-primary/10 px-3 py-1 rounded-full">
            <Cpu className="w-4 h-4" />
            Cara Kerja
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Tiga Langkah{' '}
            <span className="gradient-text">Sederhana</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verifikasi keaslian audio Anda dengan AI terdepan dalam hitungan detik
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-purple-500/20 to-emerald-500/20" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Step number circle */}
              <div className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl relative group-hover:scale-105 transition-transform duration-300`}>
                <span className="text-4xl">{step.emoji}</span>
                {/* Step number badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border-2 border-border rounded-full flex items-center justify-center text-sm font-bold text-foreground shadow-sm">
                  {index + 1}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
