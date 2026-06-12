import { AppearancePanel } from './AppearancePanel'
import { Button } from './Button'
import { cn } from './cn'

interface AppearanceSidebarProps {
  className?: string
  onClose?: () => void
  sheet?: boolean
}

export function AppearanceSidebar({ className = '', onClose, sheet = false }: AppearanceSidebarProps) {
  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col overflow-hidden bg-[rgba(15,17,23,0.85)] backdrop-blur-md',
        sheet
          ? 'w-full border-0'
          : 'w-[var(--spacing-sidebar)] border-l border-surface-border',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="m-0 text-[0.9rem] font-semibold">Appearance</h2>
        {onClose && (
          <Button icon onClick={onClose} aria-label="Close appearance panel" title="Close">
            ✕
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        <AppearancePanel />
      </div>
    </aside>
  )
}
