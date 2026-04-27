'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Settings, Lock, User, Mail, Loader2, CheckCircle2, AlertTriangle, Eye, EyeOff, AudioLines } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export default function PengaturanPage() {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Profile state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setFullName(user.user_metadata?.full_name || '')
          setEmail(user.email || '')
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setProfileLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok')
      return
    }

    setPasswordLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setPasswordError(error.message)
      } else {
        setPasswordSuccess('Password berhasil diubah!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setPasswordSuccess(null), 3000)
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Terjadi kesalahan')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)

    if (fullName.trim().length < 2) {
      setProfileError('Nama minimal 2 karakter')
      return
    }

    setProfileSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      })

      if (error) {
        setProfileError(error.message)
      } else {
        setProfileSuccess('Profil berhasil diperbarui!')
        setTimeout(() => setProfileSuccess(null), 3000)
      }
    } catch (err: any) {
      setProfileError(err.message || 'Terjadi kesalahan')
    } finally {
      setProfileSaving(false)
    }
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-primary/15 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Pengaturan</h1>
            </div>
            <p className="text-blue-100/80 ml-[52px]">
              Kelola profil dan preferensi akun Anda
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Profil</h2>
                <p className="text-sm text-muted-foreground">Informasi dasar akun Anda</p>
              </div>
            </div>

            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="settings-name" className="block text-sm font-medium text-foreground">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="settings-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                      placeholder="Nama lengkap Anda"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="settings-email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="settings-email"
                      type="email"
                      value={email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm bg-muted text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                </div>

                {profileSuccess && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2.5">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {profileError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 disabled:from-muted disabled:to-muted disabled:text-muted-foreground text-white font-semibold py-2.5 px-6 rounded-xl transition-all text-sm cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-primary/20 disabled:shadow-none flex items-center gap-2"
                >
                  {profileSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Profil'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Change Password Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Ganti Password</h2>
                <p className="text-sm text-muted-foreground">Perbarui kata sandi akun Anda</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="block text-sm font-medium text-foreground">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-border text-sm bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirm-new-password" className="block text-sm font-medium text-foreground">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="confirm-new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-border text-sm bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    placeholder="Ulangi password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {passwordError}
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading || !newPassword || !confirmPassword}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-muted disabled:text-muted-foreground text-white font-semibold py-2.5 px-6 rounded-xl transition-all text-sm cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 disabled:shadow-none flex items-center gap-2"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengubah...
                  </>
                ) : (
                  'Ganti Password'
                )}
              </button>
            </form>
          </div>

          {/* Appearance Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <AudioLines className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Tampilan</h2>
                <p className="text-sm text-muted-foreground">Sesuaikan tampilan aplikasi</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Tema Warna</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Pilih antara terang, gelap, atau ikuti sistem</p>
                </div>
                {mounted && (
                  <div className="flex items-center gap-1 bg-muted rounded-xl p-1 border border-border">
                    <button
                      onClick={() => setTheme('light')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-card text-foreground shadow-sm border border-border'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Terang
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-card text-foreground shadow-sm border border-border'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Gelap
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        theme === 'system'
                          ? 'bg-card text-foreground shadow-sm border border-border'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Sistem
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                <AudioLines className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Tentang Aplikasi</h2>
                <p className="text-sm text-muted-foreground">Informasi tentang CekSound</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versi Aplikasi</span>
                <span className="text-foreground font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span className="text-foreground font-medium">Next.js 16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Engine</span>
                <span className="text-foreground font-medium">ONNX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
