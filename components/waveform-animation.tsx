'use client'

import './waveform.css'

export function WaveformAnimation() {
  const bars = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-1 py-8">
      {bars.map((i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}
