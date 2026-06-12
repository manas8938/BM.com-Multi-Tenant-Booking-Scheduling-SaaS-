'use client'
// 'use client' required for useState — unlike NestJS where all code runs server-side
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  name: string
  placeholder?: string
  minLength?: number
  autoComplete?: string
}

export function PasswordInput({ name, placeholder, minLength, autoComplete }: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        name={name}
        type={show ? 'text' : 'password'}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-11 border border-ink-700 rounded-xl text-sm text-white placeholder:text-stone-500 bg-ink-900 focus:outline-none focus:ring-2 focus:ring-ember-500/30 focus:border-ember-500 transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-stone-300 transition-colors rounded"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {/* Eye = visible (click to hide), EyeOff = hidden (click to show) */}
        {show ? <Eye size={16} strokeWidth={2} /> : <EyeOff size={16} strokeWidth={2} />}
      </button>
    </div>
  )
}
