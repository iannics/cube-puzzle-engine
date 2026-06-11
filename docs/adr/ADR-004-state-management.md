# ADR-004: Zustand for Application State

## Status

Accepted

## Context

The application requires:

- Cube state orchestration
- Animation state
- UI state
- Tutorial progress

Redux Toolkit and XState were considered.

## Decision

Use Zustand.

Separate stores:

- `cubeStore` — implemented (`src/state/cubeStore.ts`)
- `animationStore` — implemented (`src/state/animationStore.ts`)
- `uiStore` — planned (general UI chrome, settings, panels)
- `tutorialStore` — planned (tutorial step progress and gating)

Business logic remains in domain modules.

Stores coordinate application behavior.

## Consequences

### Positive

- Minimal boilerplate
- Simple mental model
- Strong TypeScript support

### Negative

- Less opinionated than Redux Toolkit

## Alternatives Considered

### Redux Toolkit

Rejected due to additional complexity and ceremony.

### XState

Rejected because workflow complexity does not justify state machines.