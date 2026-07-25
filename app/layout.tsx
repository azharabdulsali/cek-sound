import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ceksound.com'),
  title: 'CekSound — Deteksi Audio Deepfake dengan AI',
  description:
    'Verifikasi keaslian audio Anda secara instan. Deteksi deepfake dan audio AI-generated gratis dengan teknologi forensik berbasis machine learning.',
  keywords: ['deepfake', 'audio', 'deteksi', 'AI', 'verifikasi', 'suara', 'forensik', 'audio palsu'],
  openGraph: {
    title: 'CekSound — Deteksi Audio Deepfake dengan AI',
    description:
      'Verifikasi keaslian audio Anda secara instan. Deteksi deepfake dan audio AI-generated gratis.',
    url: 'https://ceksound.com',
    siteName: 'CekSound',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CekSound — Deteksi Audio Deepfake dengan AI',
    description:
      'Verifikasi keaslian audio Anda secara instan. Deteksi deepfake dan audio AI-generated gratis.',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
