import type { ButtonHTMLAttributes } from 'react'
import { cn } from './cn'

export type ButtonVariant = 'default' | 'primary' | 'warm' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: boolean
  active?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-surface border-surface-border hover:enabled:bg-white/10 hover:enabled:border-white/[0.18]',
  primary:
    'bg-accent/20 border-accent/45 hover:enabled:bg-accent/25 hover:enabled:border-accent/55',
  warm:
    'bg-accent-warm/15 border-accent-warm/40 hover:enabled:bg-accent-warm/20',
  danger:
    'bg-danger/12 border-danger/35 hover:enabled:bg-danger/18',
}

export function Button({
  className,
  variant = 'default',
  icon = false,
  active = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 border rounded-md',
        'text-sm font-medium text-text-primary cursor-pointer transition-colors',
        'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        'disabled:opacity-45 disabled:cursor-not-allowed',
        icon ? 'p-0 size-11 min-h-11 min-w-11' : 'min-h-11 min-w-11 px-4',
        active && 'bg-accent/15 border-accent/45 text-accent',
        !active && variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
