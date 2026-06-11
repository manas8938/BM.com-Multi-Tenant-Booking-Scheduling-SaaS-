'use client'
import { Trash2 } from 'lucide-react'

export function DeleteButton({ confirm: confirmMsg = 'Delete this item? This cannot be undone.' }: { confirm?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmMsg)) e.preventDefault()
      }}
      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
      title="Delete"
    >
      <Trash2 size={14} />
    </button>
  )
}
