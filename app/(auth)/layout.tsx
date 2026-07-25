import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CekSound — Masuk / Daftar',
  description: 'Masuk atau daftar untuk menggunakan CekSound',
  robots: { index: false, follow: true },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  )
}
