'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        console.error('[Login Error]', error)
        if (error.message.includes('Invalid login credentials')) {
          setServerError('Email atau password salah. Silakan coba lagi.')
        } else if (error.message.includes('Email not confirmed')) {
          setServerError(
            'Email Anda belum dikonfirmasi. Silakan cek inbox (dan folder spam) untuk link konfirmasi dari Supabase, atau nonaktifkan "Confirm email" di Supabase Dashboard → Authentication → Providers → Email.'
          )
        } else {
          setServerError(`Error: ${error.message} (status: ${error.status})`)
        }
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('[Login Catch Error]', err)
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
          <h1 className="text-2xl font-bold mb-1">Selamat datang kembali</h1>
          <p className="text-blue-100 text-sm">Masuk untuk melanjutkan ke CekSound</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          {serverError && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
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
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
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
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
              Daftar sekarang
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
