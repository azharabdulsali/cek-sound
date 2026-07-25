'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Apa itu CekSound?',
    answer:
      'CekSound adalah alat web gratis untuk mendeteksi deepfake audio dan memverifikasi keaslian rekaman suara menggunakan teknologi machine learning.',
  },
  {
    question: 'Bagaimana cara kerja CekSound?',
    answer:
      'Unggah file audio atau rekam langsung dari mikrofon. Model AI kami akan menganalisis pola akustik dan memberikan hasil klasifikasi beserta skor kepercayaan secara instan.',
  },
  {
    question: 'Format audio apa yang didukung?',
    answer:
      'CekSound mendukung format MP3, WAV, FLAC, OGG, dan format audio lainnya. Ukuran file maksimal 10MB dengan durasi maksimal 10 detik.',
  },
  {
    question: 'Apakah CekSound gratis?',
    answer:
      'Ya, CekSound dapat digunakan secara gratis. Daftar akun untuk menyimpan riwayat deteksi audio Anda.',
  },
  {
    question: 'Seberapa akurat deteksi deepfake?',
    answer:
      'Model machine learning kami dilatih dengan ribuan sampel audio asli dan hasil manipulasi AI. Setiap hasil analisis dilengkapi skor kepercayaan untuk membantu Anda membuat keputusan.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors cursor-pointer"
      >
        <span className="text-sm font-semibold text-foreground pr-4">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export function FAQSection() {
  return (
    <section id="faq" className="w-full py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-3xl">
        {/* Section divider */}
        <div className="flex items-center gap-3 mb-10 sm:mb-16">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            FAQ
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance tracking-tight">
            Pertanyaan <span className="text-primary">Umum</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Jawaban atas pertanyaan yang sering ditanyakan tentang CekSound
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  )
}
