'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(72, 'Password maksimal 72 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    setSuccessMessage(null)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      })

      if (error) {
        console.error('[Register Error]', error)
        if (error.message.includes('User already registered')) {
          setServerError('Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.')
        } else if (error.message.includes('Password should be')) {
          setServerError('Password terlalu lemah. Gunakan kombinasi huruf dan angka.')
        } else {
          setServerError(`Error: ${error.message} (status: ${error.status})`)
        }
        return
      }

      // Check if email confirmation is required
      setSuccessMessage(
        'Pendaftaran berhasil! Jika Anda mengaktifkan konfirmasi email di Supabase, cek inbox Anda terlebih dahulu sebelum login. Jika tidak, Anda langsung bisa login.'
      )
      setTimeout(() => {
        router.push('/login')
      }, 4000)
    } catch (err) {
      console.error('[Register Catch Error]', err)
      setServerError('Terjadi kesalahan koneksi. Pastikan API Key Supabase sudah benar.')
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CekSound</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Buat akun baru</h1>
          <p className="text-blue-100 text-sm">Daftar gratis dan mulai verifikasi audio Anda</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          {/* Success message */}
          {successMessage && (
            <div className="mb-5 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Error message */}
          {serverError && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="register-fullname" className="block text-sm font-medium text-slate-700">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="register-fullname"
                  type="text"
                  autoComplete="name"
                  placeholder="Nama lengkap Anda"
                  {...register('fullName')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    ${errors.fullName
                      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300'
                      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 hover:border-slate-300'
                    }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@contoh.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    ${errors.email
                      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300'
                      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 hover:border-slate-300'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  {...register('password')}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    ${errors.password
                      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300'
                      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 hover:border-slate-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-slate-700">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Ulangi password Anda"
                  {...register('confirmPassword')}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    ${errors.confirmPassword
                      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300'
                      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 hover:border-slate-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Back to home */}
      <p className="mt-4 text-center text-xs text-slate-400">
        <Link href="/" className="hover:text-slate-600 transition-colors">
          ← Kembali ke beranda
        </Link>
      </p>
    </div>
  )
}
