'use client'
// useFormStatus — reads pending state of the nearest parent <form> without prop drilling
import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  children: React.ReactNode
  loadingText?: string
}

export function SubmitButton({ children, loadingText = 'Please wait...' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ember-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-ember-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
