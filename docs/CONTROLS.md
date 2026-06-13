# Controls Reference

## Mouse and touch

| Action | Input |
|--------|-------|
| Turn a layer | Drag a sticker face |
| Orbit camera | Drag empty space around the cube |
| Zoom | Scroll wheel or pinch |
| Reset camera | Double-click the canvas, or press `V`, or use **Reset view** |

On touch devices, face drags require slightly more movement before a turn starts (8px vs 4px on mouse) to reduce accidental turns.

## Keyboard — face turns

| Key | Move |
|-----|------|
| `R` `L` `U` `D` `F` `B` | Quarter turn clockwise |
| `Shift` + face key | Prime (counter-clockwise), e.g. `R'` |
| `2` then face key | Half turn, e.g. `R2` |

## Keyboard — slice turns

| Key | Move |
|-----|------|
| `M` `E` `S` | Middle slice clockwise |
| `Shift` + slice key | Prime slice |

## Keyboard — puzzle and view

| Key | Action |
|-----|--------|
| `X` | Scramble |
| `0` | Reset to solved |
| `Ctrl+Z` / `Cmd+Z` | Undo last move |
| `V` | Reset camera view |
| `?` | Open shortcuts dialog |
| `Escape` | Close dialogs |

## Toolbar

- **Scramble** — generates a WCA-style random scramble (default 20 moves)
- **Copy** — copies the current scramble string
- **Reset** — returns the cube to solved (confirmation dialog; right-click Reset to toggle “don’t ask again”)
- **Reset view** — restores the default inspection camera angle

## Accessibility

- All puzzle actions are available from the keyboard without a pointer.
- The app announces each committed move to screen readers via a live region.
- Enable **Reduce motion** in your OS settings to disable idle cube float and speed up animations.
