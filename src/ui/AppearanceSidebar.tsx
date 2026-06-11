import { AppearancePanel } from './AppearancePanel'

interface AppearanceSidebarProps {
  className?: string
}

export function AppearanceSidebar({ className = '' }: AppearanceSidebarProps) {
  return (
    <aside className={`app-appearance-sidebar glass-panel ${className}`}>
      <div className="appearance-sidebar__header">
        <h2 className="appearance-sidebar__title">Appearance</h2>
      </div>
      <div className="appearance-sidebar__content">
        <AppearancePanel />
      </div>
    </aside>
  )
}
