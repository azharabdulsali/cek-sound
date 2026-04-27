'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-secondary" />
    )
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <button
      id="theme-toggle-btn"
      onClick={cycleTheme}
      className="w-9 h-9 rounded-xl bg-secondary hover:bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
      title={`Tema: ${theme === 'light' ? 'Terang' : theme === 'dark' ? 'Gelap' : 'Sistem'}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' && <Sun className="w-4 h-4" />}
      {theme === 'dark' && <Moon className="w-4 h-4" />}
      {theme === 'system' && <Monitor className="w-4 h-4" />}
    </button>
  )
}
