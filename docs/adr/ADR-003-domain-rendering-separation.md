# ADR-003: Domain Logic Independent of Rendering

## Status

Accepted

## Context

The cube engine represents puzzle mechanics.

Rendering represents visualization.

Coupling these concerns would reduce testability and future portability.

## Decision

The cube domain must not depend on:

- React
- Three.js
- React Three Fiber
- Zustand
- Browser APIs

Allowed dependencies:

- TypeScript
- Domain modules

Dependency direction:

Domain → State → UI → Rendering

Never the reverse.

## Consequences

### Positive

- High testability
- Renderer can be replaced
- Solver can operate without UI

### Negative

- Requires mapping domain state to visual state

## Alternatives Considered

### Rendering-Aware Domain Objects

Rejected because it tightly couples puzzle logic to visualization.