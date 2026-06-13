import { useEffect, useRef } from 'react'
import { useUiStore } from '../state'
import { Button } from './Button'
import { cn } from './cn'

export function ShortcutsDialog() {
  const shortcutsOpen = useUiStore((state) => state.shortcutsOpen)
  const closeShortcuts = useUiStore((state) => state.closeShortcuts)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shortcutsOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeShortcuts()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [shortcutsOpen, closeShortcuts])

  if (!shortcutsOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeShortcuts()
      }}
    >
      <div
        ref={dialogRef}
        className={cn(
          'glass-panel w-full max-w-md max-h-[85vh] overflow-auto rounded-2xl p-6',
          'animate-[dialog-enter_0.2s_ease]',
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        tabIndex={-1}
      >
        <h2 id="shortcuts-title" className="mb-4 text-[1.1rem] font-semibold">
          Keyboard shortcuts
        </h2>

        <section className="mb-4">
          <h3 className="mb-2 text-[0.75rem] uppercase tracking-wider text-text-muted">Face turns</h3>
          <ul className="m-0 list-none p-0">
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Quarter turn</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">R L U D F B</kbd>
            </li>
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Prime (counter-clockwise)</span>{' '}
              <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">Shift + face</kbd>
            </li>
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Half turn</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">2 + face</kbd>
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h3 className="mb-2 text-[0.75rem] uppercase tracking-wider text-text-muted">Slice turns</h3>
          <ul className="m-0 list-none p-0">
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Middle slices</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">M E S</kbd>
            </li>
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Prime slice</span>{' '}
              <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">Shift + M/E/S</kbd>
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h3 className="mb-2 text-[0.75rem] uppercase tracking-wider text-text-muted">View</h3>
          <ul className="m-0 list-none p-0">
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Zoom</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">Scroll / Pinch</kbd>
            </li>
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Orbit</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">Drag background</kbd>
            </li>
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Reset camera</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">V</kbd>
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h3 className="mb-2 text-[0.75rem] uppercase tracking-wider text-text-muted">Puzzle</h3>
          <ul className="m-0 list-none p-0">
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Scramble</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">X</kbd>
            </li>
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Undo</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">Ctrl+Z</kbd>
            </li>
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>Reset solved</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">0</kbd>
            </li>
            <li className="flex justify-between py-1 text-[0.85rem]">
              <span>This help</span> <kbd className="rounded-sm border border-surface-border bg-black/35 px-1.5 py-0.5 font-mono text-[0.75rem]">?</kbd>
            </li>
          </ul>
        </section>

        <Button variant="primary" onClick={closeShortcuts}>
          Close
        </Button>
      </div>
    </div>
  )
}
