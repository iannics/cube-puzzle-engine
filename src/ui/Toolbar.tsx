import { useAnimationStore, useCubeStore, useUiStore } from '../state'
import { Button } from './Button'
import { cn } from './cn'
import { useIsCompact } from './useMediaQuery'

function DiceIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  )
}

function VideoCameraIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="7" cy="5.5" r="2.5" />
      <circle cx="17" cy="5.5" r="2.5" />
      <rect x="5" y="9" width="14" height="9" rx="1.5" />
      <path d="M19 11.5l4-2v5l-4-2v-1z" />
    </svg>
  )
}

export function Toolbar() {
  const isCompact = useIsCompact()
  const mode = useAnimationStore((state) => state.mode)
  const scramble = useCubeStore((state) => state.scramble)
  const reset = useCubeStore((state) => state.reset)
  const scrambleMoveCount = useUiStore((state) => state.scrambleMoveCount)
  const instantScramble = useUiStore((state) => state.instantScramble)
  const requestCameraReset = useUiStore((state) => state.requestCameraReset)
  const setScrambleMoveCount = useUiStore((state) => state.setScrambleMoveCount)
  const mobileSheetOpen = useUiStore((state) => state.mobileSheetOpen)
  const setMobileSheetOpen = useUiStore((state) => state.setMobileSheetOpen)
  const toggleAppearancePanel = useUiStore((state) => state.toggleAppearancePanel)
  const appearancePanelOpen = useUiStore((state) => state.appearancePanelOpen)
  const mobileAppearanceOpen = useUiStore((state) => state.mobileAppearanceOpen)
  const openShortcuts = useUiStore((state) => state.openShortcuts)

  const isBusy = mode !== 'idle'
  const appearanceOpen = appearancePanelOpen || mobileAppearanceOpen

  const handleScramble = () => {
    scramble(scrambleMoveCount, !instantScramble)
  }

  return (
    <footer
      className={cn(
        'z-10 flex items-center border-t border-surface-border bg-[rgba(15,17,23,0.9)] backdrop-blur-sm',
        'min-h-[var(--spacing-toolbar)] pb-[env(safe-area-inset-bottom,0px)]',
        'pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]',
        isCompact ? 'justify-between gap-1 px-2' : 'justify-center gap-2 px-4',
      )}
    >
      {isCompact && (
        <div className="flex shrink-0 items-center gap-1">
          <Button
            icon
            active={mobileSheetOpen}
            onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
            aria-label={mobileSheetOpen ? 'Hide panel' : 'Show panel'}
            aria-expanded={mobileSheetOpen}
            title="Panel"
          >
            ☰
          </Button>
          <Button
            icon
            active={appearanceOpen}
            onClick={toggleAppearancePanel}
            aria-label={appearanceOpen ? 'Close appearance' : 'Appearance settings'}
            aria-expanded={appearanceOpen}
            title="Appearance"
          >
            ◐
          </Button>
          <Button
            icon
            onClick={openShortcuts}
            aria-label="Keyboard shortcuts"
            title="Shortcuts (?)"
          >
            ?
          </Button>
        </div>
      )}

      <div className={cn('flex items-center gap-1', isCompact ? 'gap-1' : 'gap-2')}>
        <label className="sr-only" htmlFor="scramble-length">
          Scramble length
        </label>
        <select
          id="scramble-length"
          className={cn(
            'h-11 min-w-12 rounded-md border border-surface-border bg-surface px-1.5',
            'text-sm font-medium text-text-primary',
            'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-45',
            isCompact && 'min-w-11 px-1',
          )}
          value={scrambleMoveCount}
          onChange={(event) => setScrambleMoveCount(Number(event.target.value) as 15 | 20 | 25)}
          disabled={isBusy}
          title="Scramble length"
        >
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
        </select>
        <Button
          variant="warm"
          onClick={handleScramble}
          disabled={isBusy}
          title="Scramble cube (X)"
          aria-label="Scramble cube"
        >
          <span className="hidden lg:inline">Scramble</span>
          <span className="lg:hidden">
            <DiceIcon />
          </span>
        </Button>
        <Button variant="danger" onClick={() => reset()} disabled={isBusy} title="Reset to solved (0)">
          <span className="hidden lg:inline">Reset</span>
          <span className="lg:hidden" aria-hidden="true">
            ↺
          </span>
        </Button>
        <Button
          onClick={requestCameraReset}
          title="Reset camera view (V)"
          aria-label="Reset camera view"
        >
          <span className="hidden lg:inline">Reset view</span>
          <span className="lg:hidden">
            <VideoCameraIcon />
          </span>
        </Button>
      </div>
    </footer>
  )
}
