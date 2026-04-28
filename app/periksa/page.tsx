'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Shield, UploadCloud, Loader2, FileAudio, CheckCircle2, AlertTriangle, RotateCcw, AudioLines, Mic, Square, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type AnalysisResult = {
  result: 'Asli' | 'Deepfake'
  prob_asli: number
  prob_deepfake: number
  filename: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_DURATION = 10 // 10 seconds

export default function PeriksaPage() {
  const [file, setFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const validateFile = (f: File): string | null => {
    if (f.size > MAX_FILE_SIZE) {
      return `File terlalu besar (${(f.size / (1024 * 1024)).toFixed(1)} MB). Maksimal 10MB.`
    }
    if (!f.type.startsWith('audio/')) {
      return 'File harus berupa audio (MP3, WAV, dll)'
    }
    return null
  }

  const validateDuration = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const audio = new Audio(url)
      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration > MAX_DURATION) {
          resolve(`Durasi audio terlalu panjang (${audio.duration.toFixed(1)}s). Maksimal ${MAX_DURATION} detik.`)
        } else {
          resolve(null)
        }
      })
      audio.addEventListener('error', () => {
        resolve(null) // Let the server handle invalid audio
      })
    })
  }

  const setAudioFile = async (f: File) => {
    // Validate size and type
    const sizeError = validateFile(f)
    if (sizeError) {
      setError(sizeError)
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(f)

    // Validate duration
    const durationError = await validateDuration(url)
    if (durationError) {
      URL.revokeObjectURL(url)
      setError(durationError)
      return
    }

    // Clean old URL
    if (audioUrl) URL.revokeObjectURL(audioUrl)

    setFile(f)
    setAudioUrl(url)
    setAnalysisResult(null)
    setError(null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await setAudioFile(e.target.files[0])
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await setAudioFile(e.dataTransfer.files[0])
    }
  }, [audioUrl])

  // ── Recording Functions ──
  const startRecording = async () => {
    setError(null)
    setAnalysisResult(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const recordedFile = new File([blob], `rekaman-${Date.now()}.webm`, { type: 'audio/webm' })

        if (audioUrl) URL.revokeObjectURL(audioUrl)
        const url = URL.createObjectURL(blob)

        setFile(recordedFile)
        setAudioUrl(url)
        setIsRecording(false)
        setRecordingTime(0)

        // Stop all tracks
        stream.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      setRecordingTime(0)

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const next = prev + 0.1
          if (next >= MAX_DURATION) {
            stopRecording()
          }
          return next
        })
      }, 100)

    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Izin mikrofon ditolak. Silakan izinkan akses mikrofon di pengaturan browser.')
      } else if (err.name === 'NotFoundError') {
        setError('Mikrofon tidak ditemukan. Pastikan perangkat memiliki mikrofon.')
      } else {
        setError(`Gagal memulai rekaman: ${err.message}`)
      }
    }
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Pilih file audio atau rekam suara terlebih dahulu')
      return
    }

    setIsUploading(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append('audio', file)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const responseText = await response.text()
      let data: any
      try {
        data = JSON.parse(responseText)
      } catch {
        throw new Error(
          response.ok
            ? 'Server mengembalikan respons yang tidak valid. Pastikan Flask API berjalan.'
            : `Server error (${response.status}): ${responseText.substring(0, 200)}`
        )
      }

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat menganalisis audio')
      }

      const result: AnalysisResult = {
        result: data.result,
        prob_asli: data.details?.prob_asli || 0,
        prob_deepfake: data.details?.prob_deepfake || 0,
        filename: data.filename || file.name,
      }

      setAnalysisResult(result)

      // Simpan riwayat jika user login
      if (data.audio_url) {
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
          try {
            await supabase.from('detection_history').insert({
              user_id: userData.user.id,
              filename: result.filename,
              audio_url: data.audio_url,
              result_label: result.result,
              prob_asli: result.prob_asli,
              prob_deepfake: result.prob_deepfake,
            })
          } catch (insertError) {
            console.error('Gagal menyimpan riwayat:', insertError)
          }
        }
      }

    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setFile(null)
    setAudioUrl(null)
    setAnalysisResult(null)
    setError(null)
    setIsRecording(false)
    setRecordingTime(0)
    if (timerRef.current) clearInterval(timerRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  const probAsliPercent = analysisResult ? (analysisResult.prob_asli * 100).toFixed(1) : '0'
  const probDeepfakePercent = analysisResult ? (analysisResult.prob_deepfake * 100).toFixed(1) : '0'

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-2xl p-5 sm:p-8 text-white shadow-xl shadow-primary/15 mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Periksa Keaslian Audio</h1>
            </div>
            <p className="text-blue-100/80 text-sm sm:text-base mt-1 pl-[52px]">
              Upload file audio atau rekam langsung dari mikrofon (maks 10 detik, 10MB)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Upload / Record Panel — 3 cols */}
          <div className="lg:col-span-3 space-y-4">
            {/* Upload or Record */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-muted-foreground" />
                  Upload Audio
                </h3>
                <span className="text-xs text-muted-foreground">atau</span>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Mic className="w-5 h-5 text-muted-foreground" />
                  Rekam Mikrofon
                </h3>
              </div>

              {/* Recording UI */}
              {isRecording ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  {/* Recording indicator */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border-2 border-red-500/30">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                    </div>
                    {/* Pulse rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" />
                  </div>

                  <div className="text-center">
                    <p className="text-foreground font-semibold">Merekam...</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {recordingTime.toFixed(1)}s / {MAX_DURATION}s
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-100"
                      style={{ width: `${(recordingTime / MAX_DURATION) * 100}%` }}
                    />
                  </div>

                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer"
                  >
                    <Square className="w-4 h-4" />
                    Berhenti
                  </button>
                </div>
              ) : (
                <>
                  {/* Dropzone */}
                  <label
                    className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                      isDragOver
                        ? 'border-primary bg-primary/5 scale-[1.01]'
                        : file
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border hover:border-primary/30 hover:bg-accent/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center py-6">
                      {file ? (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                            <FileAudio className="w-6 h-6 text-primary" />
                          </div>
                          <p className="mb-1 text-sm font-semibold text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                            <UploadCloud className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="mb-1 text-sm font-semibold text-foreground">
                            {isDragOver ? 'Lepaskan file di sini' : 'Pilih atau seret file audio'}
                          </p>
                          <p className="text-xs text-muted-foreground">MP3, WAV, FLAC, OGG — Maks 10MB, 10 detik</p>
                        </>
                      )}
                    </div>
                    <input
                      id="audio-upload"
                      type="file"
                      className="hidden"
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </label>

                  {/* Record button */}
                  <div className="mt-3 flex justify-center">
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30 rounded-xl font-medium text-sm transition-all cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                      Rekam dari Mikrofon
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Audio Preview */}
            {audioUrl && !isRecording && (
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <AudioLines className="w-4 h-4 text-primary" />
                  Preview Audio
                </p>
                <audio
                  controls
                  src={audioUrl}
                  className="w-full h-10 rounded-lg"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                id="analyze-btn"
                onClick={handleAnalyze}
                disabled={isUploading || !file || isRecording}
                className="flex-1 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 disabled:from-muted disabled:to-muted disabled:text-muted-foreground text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <AudioLines className="w-4 h-4" />
                    Analisis Audio
                  </>
                )}
              </button>

              {(file || analysisResult) && !isRecording && (
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all text-sm font-medium cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Result Panel — 2 cols */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm h-full min-h-[300px] lg:min-h-[400px] flex flex-col">
              <h3 className="font-bold text-foreground mb-4 pb-4 border-b border-border">
                Hasil Analisis
              </h3>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                {/* Empty State */}
                {!analysisResult && !isUploading && (
                  <div className="animate-fade-in-up">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 mx-auto">
                      <Shield className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground text-sm">Upload atau rekam audio untuk memulai analisis</p>
                  </div>
                )}

                {/* Loading State */}
                {isUploading && (
                  <div className="animate-fade-in-up">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    <p className="text-primary font-medium text-sm">Model AI sedang bekerja...</p>
                    <p className="text-muted-foreground text-xs mt-1">Mengekstrak fitur audio dan menjalankan inferensi</p>

                    {/* Animated bars */}
                    <div className="flex items-end justify-center gap-1 mt-6 h-8">
                      {[20,28,16,32,24,14,30,18,26,22,34,20,28,16,30,24].map((h, i) => (
                        <div
                          key={i}
                          className="sound-wave-bar animate-wave w-1 rounded-full"
                          style={{
                            height: `${h}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Result: Asli */}
                {analysisResult?.result === 'Asli' && (
                  <div className="w-full animate-fade-in-up space-y-6">
                    <div>
                      <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4 mx-auto ring-4 ring-emerald-500/10">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground mb-1">Asli</h2>
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        Audio ini direkam oleh manusia
                      </p>
                    </div>

                    {/* Score bars */}
                    <div className="w-full space-y-3 text-left">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground font-medium">Asli</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{probAsliPercent}%</span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-progress-fill transition-all"
                            style={{ width: `${probAsliPercent}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground font-medium">Deepfake</span>
                          <span className="text-red-500 font-bold">{probDeepfakePercent}%</span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full animate-progress-fill transition-all"
                            style={{ width: `${probDeepfakePercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result: Deepfake */}
                {analysisResult?.result === 'Deepfake' && (
                  <div className="w-full animate-fade-in-up space-y-6">
                    <div>
                      <div className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center mb-4 mx-auto ring-4 ring-red-500/10">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground mb-1">Deepfake</h2>
                      <p className="text-red-500 text-sm font-medium">
                        Audio ini terindikasi dihasilkan oleh AI
                      </p>
                    </div>

                    {/* Score bars */}
                    <div className="w-full space-y-3 text-left">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground font-medium">Deepfake</span>
                          <span className="text-red-500 font-bold">{probDeepfakePercent}%</span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full animate-progress-fill transition-all"
                            style={{ width: `${probDeepfakePercent}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground font-medium">Asli</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{probAsliPercent}%</span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-progress-fill transition-all"
                            style={{ width: `${probAsliPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
