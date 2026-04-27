'use client'

import { Shield, CheckCircle, Lock } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      emoji: '🚨',
      title: 'Cegah Penipuan',
      description: 'Deteksi panggilan suara palsu dan percobaan peniruan identitas sebelum menyebabkan kerugian.',
      gradient: 'from-red-500/10 to-orange-500/10',
      iconGradient: 'from-red-500 to-orange-500',
      borderHover: 'hover:border-red-500/30',
    },
    {
      icon: CheckCircle,
      emoji: '✅',
      title: 'Verifikasi Informasi',
      description: 'Konfirmasi keaslian konten audio di media, wawancara, dan komunikasi penting.',
      gradient: 'from-emerald-500/10 to-teal-500/10',
      iconGradient: 'from-emerald-500 to-teal-500',
      borderHover: 'hover:border-emerald-500/30',
    },
    {
      icon: Lock,
      emoji: '🔐',
      title: 'Amankan Identitas',
      description: 'Lindungi diri dari kloning suara dan manipulasi audio yang tidak sah.',
      gradient: 'from-primary/10 to-purple-500/10',
      iconGradient: 'from-primary to-purple-500',
      borderHover: 'hover:border-primary/30',
    },
  ]

  return (
    <section id="features" className="w-full py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4 bg-primary/10 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4" />
            Fitur Unggulan
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Mengapa Harus{' '}
            <span className="gradient-text">CekSound</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deepfake audio menimbulkan risiko nyata di era digital. Tetap terlindungi dengan solusi kami.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-card border border-border rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${feature.borderHover}`}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.iconGradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{feature.emoji}</span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                {/* Animated underline */}
                <div className={`mt-6 h-1 w-0 bg-gradient-to-r ${feature.iconGradient} group-hover:w-full transition-all duration-500 rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
