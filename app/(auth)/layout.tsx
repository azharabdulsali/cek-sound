import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CekSound - Masuk / Daftar',
  description: 'Masuk atau daftar untuk menggunakan CekSound',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
