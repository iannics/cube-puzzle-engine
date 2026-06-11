import { useEffect, useRef } from 'react'
import { useUiStore } from '../state'

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
      className="dialog-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeShortcuts()
      }}
    >
      <div
        ref={dialogRef}
        className="dialog glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        tabIndex={-1}
      >
        <h2 id="shortcuts-title" className="dialog__title">
          Keyboard shortcuts
        </h2>

        <section className="shortcuts-section">
          <h3>Face turns</h3>
          <ul className="shortcuts-list">
            <li>
              <span>Quarter turn</span> <kbd>R L U D F B</kbd>
            </li>
            <li>
              <span>Prime (counter-clockwise)</span> <kbd>Shift + face</kbd>
            </li>
            <li>
              <span>Half turn</span> <kbd>2 + face</kbd>
            </li>
          </ul>
        </section>

        <section className="shortcuts-section">
          <h3>Slice turns</h3>
          <ul className="shortcuts-list">
            <li>
              <span>Middle slices</span> <kbd>M E S</kbd>
            </li>
            <li>
              <span>Prime slice</span> <kbd>Shift + M/E/S</kbd>
            </li>
          </ul>
        </section>

        <section className="shortcuts-section">
          <h3>View</h3>
          <ul className="shortcuts-list">
            <li>
              <span>Zoom</span> <kbd>Scroll / Pinch</kbd>
            </li>
            <li>
              <span>Orbit</span> <kbd>Drag background</kbd>
            </li>
            <li>
              <span>Reset camera</span> <kbd>V</kbd>
            </li>
          </ul>
        </section>

        <section className="shortcuts-section">
          <h3>Puzzle</h3>
          <ul className="shortcuts-list">
            <li>
              <span>Scramble</span> <kbd>X</kbd>
            </li>
            <li>
              <span>Undo</span> <kbd>Ctrl+Z</kbd>
            </li>
            <li>
              <span>Reset solved</span> <kbd>0</kbd>
            </li>
            <li>
              <span>This help</span> <kbd>?</kbd>
            </li>
          </ul>
        </section>

        <button type="button" className="btn btn--primary" onClick={closeShortcuts}>
          Close
        </button>
      </div>
    </div>
  )
}
