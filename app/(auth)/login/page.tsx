'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AudioLines, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle'

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
            'Email Anda belum dikonfirmasi. Silakan cek inbox (dan folder spam) untuk link konfirmasi dari Supabase.'
          )
        } else {
          setServerError(`Error: ${error.message}`)
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
      {/* Theme toggle */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="bg-card rounded-xl shadow-xl border border-border overflow-hidden">
        {/* Header — clean, no gradient */}
        <div className="px-7 pt-7 pb-0">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <AudioLines className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">CekSound</span>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1 tracking-tight">Selamat datang kembali</h1>
          <p className="text-sm text-muted-foreground">Masuk untuk melanjutkan ke CekSound</p>
        </div>

        {/* Form */}
        <div className="px-7 py-7">
          {serverError && (
            <div className="mb-5 flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
              <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-destructive text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-medium text-foreground tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@contoh.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background
                    ${errors.email
                      ? 'border-destructive bg-destructive/5 text-destructive'
                      : 'border-border text-foreground placeholder-muted-foreground hover:border-primary/30'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-xs font-medium text-foreground tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  {...register('password')}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-lg border text-sm transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background
                    ${errors.password
                      ? 'border-destructive bg-destructive/5 text-destructive'
                      : 'border-border text-foreground placeholder-muted-foreground hover:border-primary/30'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm mt-1 cursor-pointer disabled:cursor-not-allowed"
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
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Back to home */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          &larr; Kembali ke beranda
        </Link>
      </p>
    </div>
  )
}
