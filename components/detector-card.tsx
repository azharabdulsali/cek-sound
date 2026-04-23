'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Cloud, Mic } from 'lucide-react'
import { WaveformAnimation } from './waveform-animation'
import { ResultDisplay } from './result-display'
import './detector.css'

export function DetectorCard() {
  const [activeTab, setActiveTab] = useState('upload')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setIsAnalyzing(true)
      setTimeout(() => {
        setShowResults(true)
        setIsAnalyzing(false)
      }, 3000)
    }
  }

  const handleRecordStart = () => {
    setIsRecording(true)
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsRecording(false)
      setShowResults(true)
      setIsAnalyzing(false)
    }, 5000)
  }

  const handleAnalyzeAnother = () => {
    setShowResults(false)
    setIsAnalyzing(false)
    setIsRecording(false)
  }

  return (
    <section id="detector-section" className="w-full py-12 px-4 bg-slate-50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-slate-200 shadow-xl bg-white">
        <div className="p-8">
          {showResults ? (
            <>
              <ResultDisplay onAnalyzeAnother={handleAnalyzeAnother} />
            </>
          ) : (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
                  <TabsTrigger value="upload" className="data-[state=active]:bg-white">
                    Upload Audio
                  </TabsTrigger>
                  <TabsTrigger value="record" className="data-[state=active]:bg-white">
                    Record Live
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                  {isAnalyzing ? (
                    <div className="text-center space-y-4">
                      <p className="text-slate-600 font-medium">Analyzing audio...</p>
                      <WaveformAnimation />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="audio-upload">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                          <Cloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-700 font-medium">
                            Drag &amp; drop your audio file (.mp3, .wav)
                          </p>
                          <p className="text-slate-500 text-sm mt-2">or click to browse</p>
                        </div>
                      </label>
                      <input
                        id="audio-upload"
                        type="file"
                        accept=".mp3,.wav,.m4a,audio/*"
                        onChange={handleUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="record" className="space-y-6">
                  {isAnalyzing ? (
                    <div className="text-center space-y-4">
                      <p className="text-slate-600 font-medium">
                        {isRecording ? 'Recording...' : 'Analyzing audio...'}
                      </p>
                      <WaveformAnimation />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 space-y-6">
                      <button
                        onClick={handleRecordStart}
                        className="mic-button"
                        aria-label="Start recording"
                      >
                        <Mic className="w-8 h-8" />
                      </button>
                      <p className="text-slate-600 font-medium">Click to start recording</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </Card>
      </div>
    </section>
  )
}
