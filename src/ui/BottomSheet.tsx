import type { ReactNode } from 'react'
import { cn } from './cn'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-x-0 top-[var(--spacing-header)] bottom-0 z-50 bg-black/50 lg:hidden"
        role="presentation"
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed bottom-[var(--spacing-toolbar)] left-1/2 z-[51] flex w-full max-w-full -translate-x-1/2 flex-col lg:hidden',
          'max-h-[65vh] overflow-hidden',
          'max-sm:rounded-t-2xl sm:max-w-[400px] sm:rounded-2xl',
          'animate-[sheet-up_0.25s_ease]',
        )}
      >
        <div
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/20"
          aria-hidden="true"
        />
        {children}
      </div>
    </>
  )
}
