'use client'

import { Shield, CheckCircle, Lock } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      emoji: '🚨',
      title: 'Cegah Penipuan',
      description: 'Deteksi panggilan suara palsu dan percobaan peniruan identitas sebelum mereka menyebabkan kerusakan.',
      color: 'from-red-50 to-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      icon: CheckCircle,
      emoji: '✓',
      title: 'Verifikasi Informasi',
      description: 'Konfirmasi keaslian konten audio di media, wawancara, dan komunikasi penting Anda.',
      color: 'from-green-50 to-green-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Lock,
      emoji: '🔐',
      title: 'Amankan Identitas',
      description: 'Lindungi diri dari kloning suara dan manipulasi audio yang tidak sah.',
      color: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ]

  return (
    <section id="features" className="w-full py-20 px-4 sm:px-6 lg:px-8 flex items-center bg-gradient-to-b from-white via-slate-50 to-white animate-in fade-in slide-in-from-bottom-8 duration-1000 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center mb-3 sm:mb-4 text-balance animate-slide-up">
          Mengapa Deteksi Deepfake Suara?
        </h2>
        <p className="text-center text-slate-600 text-base sm:text-lg mb-12 sm:mb-16 max-w-2xl mx-auto animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
          Deepfake audio menimbulkan risiko nyata di era digital. Tetap terlindungi dengan solusi kami.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${feature.color} border-2 border-slate-200 hover:border-slate-400 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-bounce-in cursor-pointer group`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 sm:w-16 h-14 sm:h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-2 group-hover:animate-rotate transition-all duration-300`}>
                    <span className="text-2xl sm:text-3xl">{feature.emoji}</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed group-hover:text-slate-700 transition-colors">
                  {feature.description}
                </p>
                <div className="mt-4 h-1 w-0 bg-gradient-to-r from-slate-400 to-slate-300 group-hover:w-full transition-all duration-500"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
