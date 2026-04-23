'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import './result.css'

interface ResultDisplayProps {
  onAnalyzeAnother: () => void
}

export function ResultDisplay({ onAnalyzeAnother }: ResultDisplayProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-500" />
          <h2 className="text-3xl font-bold text-orange-600">
            98% Probability of AI Generation
          </h2>
        </div>
        <p className="text-slate-600">Analysis complete</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-medium">Confidence Score</span>
          <span className="text-slate-900 font-bold text-lg">98%</span>
        </div>
        <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
          <div className="confidence-bar" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-slate-600 text-sm font-medium mb-2">Vocal Tract Analysis</p>
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Anomalous
          </Badge>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-slate-600 text-sm font-medium mb-2">Background Noise</p>
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Synthetic
          </Badge>
        </div>
      </div>

      <Button
        onClick={onAnalyzeAnother}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Analyze Another Audio
      </Button>
    </div>
  )
}
