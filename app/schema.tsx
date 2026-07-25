export function WebAppSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CekSound',
    description:
      'Deteksi deepfake audio dan verifikasi keaslian suara dengan teknologi machine learning.',
    url: 'https://ceksound.com',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    inLanguage: 'id',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema() {
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

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
