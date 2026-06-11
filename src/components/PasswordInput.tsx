'use client'
// 'use client' needed for useState — unlike NestJS where all code is server-side, Next.js splits at component boundaries
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
        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}
