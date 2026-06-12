'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

// Avoids hydration mismatch — theme is only known client-side after mount
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center justify-center w-9 h-9 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
