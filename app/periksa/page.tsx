'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Shield, UploadCloud, Link as LinkIcon, Loader2, FileAudio, CheckCircle2 } from 'lucide-react'

export default function PeriksaPage() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<'Asli' | 'Deepfake' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUrl('')
      setResult(null)
      setError(null)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setFile(null)
    setResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file && !url) {
      setError('Pilih file audio atau masukkan URL terlebih dahulu')
      return
    }

    setIsUploading(true)
    setError(null)
    setResult(null)

    try {
      let formData = new FormData()

      if (file) {
        formData.append('audio', file)
      } else if (url) {
        // Untuk demo ini, jika pakai URL, kita perlu fetch di client dulu lalu kirim sebagai file,
        // atau backend dimodifikasi untuk menerima URL.
        // Asumsi simpel: kita fetch di client lalu masukkan ke form data.
        try {
          const res = await fetch(url)
          if (!res.ok) throw new Error('Gagal mengunduh audio dari URL')
          const blob = await res.blob()
          // Extract filename from URL or use a default
          const filename = url.split('/').pop() || 'audio-from-url.wav'
          formData.append('audio', blob, filename)
        } catch (e: any) {
           throw new Error(`Gagal memproses URL: ${e.message}`)
        }
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat menganalisis audio')
      }

      setResult(data.result)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold">Periksa Keaslian Audio</h1>
          </div>
          <p className="text-slate-400 ml-13">
            Analisis file audio Anda untuk mendeteksi apakah itu dibuat oleh AI (Deepfake)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Upload */}
          <div className="space-y-6">
            {/* Upload File */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <UploadCloud className="w-5 h-5 text-slate-500" />
                Upload Audio
              </h3>
              
              <label 
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  file ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <>
                      <FileAudio className="w-10 h-10 text-blue-500 mb-3" />
                      <p className="mb-2 text-sm font-semibold text-blue-700">{file.name}</p>
                      <p className="text-xs text-blue-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                      <p className="mb-2 text-sm font-semibold text-slate-700">Pilih file audio untuk dianalisis</p>
                      <p className="text-xs text-slate-500">MP3, WAV hingga 10MB</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="audio/mp3,audio/wav"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Use URL */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <LinkIcon className="w-5 h-5 text-slate-500" />
                Atau Gunakan URL
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  placeholder="https://example.com/audio.mp3"
                  value={url}
                  onChange={handleUrlChange}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isUploading || (!file && !url)}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menganalisis
                    </>
                  ) : (
                    'Analisis'
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
              )}
            </div>
          </div>

          {/* Result Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[400px]">
            <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-4">
              Hasil Analisis
            </h3>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              {!result && !isUploading && (
                <>
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400">Upload audio untuk memulai analisis</p>
                </>
              )}

              {isUploading && (
                <>
                  <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
                  <p className="text-emerald-400 font-medium">Model AI sedang bekerja...</p>
                  <p className="text-slate-500 text-sm mt-2">Mengekstrak fitur audio dan menjalankan inferensi</p>
                </>
              )}

              {result === 'Asli' && (
                <div className="animate-in zoom-in duration-300">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 mx-auto">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2">Asli</h2>
                  <p className="text-emerald-400 font-medium bg-emerald-500/10 px-4 py-2 rounded-lg inline-block border border-emerald-500/20">
                    Audio ini natural dan direkam oleh manusia.
                  </p>
                </div>
              )}

              {result === 'Deepfake' && (
                <div className="animate-in zoom-in duration-300">
                  <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6 mx-auto">
                    <Shield className="w-12 h-12 text-red-400" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2">Deepfake</h2>
                  <p className="text-red-400 font-medium bg-red-500/10 px-4 py-2 rounded-lg inline-block border border-red-500/20">
                    Audio ini terindikasi kuat dihasilkan oleh AI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
