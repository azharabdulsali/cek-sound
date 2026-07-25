'use client'

import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: ShieldAlert,
      label: '01',
      title: 'Cegah Penipuan',
      description: 'Deteksi panggilan suara palsu dan percobaan peniruan identitas sebelum menyebabkan kerugian.',
      accent: 'text-red-500',
      accentBg: 'bg-red-500/10',
      borderHover: 'hover:border-red-500/30',
    },
    {
      icon: CheckCircle2,
      label: '02',
      title: 'Verifikasi Informasi',
      description: 'Konfirmasi keaslian konten audio di media, wawancara, dan komunikasi penting.',
      accent: 'text-emerald-500',
      accentBg: 'bg-emerald-500/10',
      borderHover: 'hover:border-emerald-500/30',
    },
    {
      icon: Lock,
      label: '03',
      title: 'Amankan Identitas',
      description: 'Lindungi diri dari kloning suara dan manipulasi audio yang tidak sah.',
      accent: 'text-primary',
      accentBg: 'bg-primary/10',
      borderHover: 'hover:border-primary/30',
    },
  ]

  return (
    <section id="features" className="w-full py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-5xl">
        {/* Section header — data-label style */}
        <div className="flex items-center gap-3 mb-10 sm:mb-16">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Fitur
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance tracking-tight">
            Mengapa{" "}
            <span className="text-primary">CekSound</span>?
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Deepfake audio menimbulkan risiko nyata. Tetap terlindungi dengan
            deteksi berbasis machine learning.
          </p>
        </div>

        {/* Feature cards — clean, icon-only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.label}
              className={`group relative bg-card border border-border rounded-xl p-5 sm:p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${feature.borderHover}`}
            >
              {/* Label number */}
              <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50 mb-4 block">
                {feature.label}
              </span>

              {/* Icon */}
              <div className={`w-11 h-11 ${feature.accentBg} rounded-lg flex items-center justify-center mb-5`}>
                <feature.icon className={`w-5 h-5 ${feature.accent}`} />
              </div>

              <h3 className="text-base font-bold text-foreground mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
