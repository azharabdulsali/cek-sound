'use client'

import { Upload, Cpu, FileCheck } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      step: '01',
      title: 'Upload Audio',
      description: 'Rekam atau unggah file audio dalam format MP3, WAV, FLAC, atau format lainnya.',
    },
    {
      icon: Cpu,
      step: '02',
      title: 'Analisis AI',
      description: 'Model machine learning menganalisis pola akustik dan karakteristik suara.',
    },
    {
      icon: FileCheck,
      step: '03',
      title: 'Hasil Instan',
      description: 'Terima laporan dengan skor kepercayaan dan klasifikasi real-time.',
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 relative">
      <div className="mx-auto max-w-5xl relative z-10">
        {/* Section divider */}
        <div className="flex items-center gap-3 mb-10 sm:mb-16">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Proses
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance tracking-tight">
            Tiga Langkah{" "}
            <span className="text-primary">Sederhana</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Verifikasi keaslian audio dalam hitungan detik
          </p>
        </div>

        {/* Steps — horizontal on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[17%] right-[17%] h-px bg-border" />

          {steps.map((step) => (
            <div key={step.step} className="relative text-center group">
              {/* Step circle */}
              <div className="w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center mx-auto mb-5 relative z-10 group-hover:border-primary/30 transition-colors">
                <step.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Step label */}
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary/60 mb-2 block">
                Langkah {step.step}
              </span>

              <h3 className="text-base font-bold text-foreground mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
