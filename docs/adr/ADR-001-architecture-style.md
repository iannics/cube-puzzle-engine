# ADR-001: Modular Monolith with Lightweight Domain-Driven Design

## Status

Accepted

## Context

The project contains several distinct domains:

- Cube Engine
- Solver
- Rendering
- Tutorial System
- UI

The project is developed by a single engineer and does not require the complexity of Clean Architecture or Hexagonal Architecture.

## Decision

Use a Modular Monolith organized around domains.

Top-level source modules (under `src/`):

- `domain` — cube engine (pure logic; ADR concept: "cube")
- `solver` — planned; algorithms read domain state and output moves
- `render` — Three.js / R3F visualization (ADR concept: "rendering")
- `state` — Zustand orchestration
- `ui` — React input and chrome
- `tutorial` — planned; tutorial content and step logic

Domain boundaries are enforced through folder structure and import rules.

Commit scopes use `cube` for domain changes and `rendering` for `src/render/` changes.

## Consequences

### Positive

- Simple navigation
- Low cognitive overhead
- Scales well for a solo project
- Easy for contributors to understand

### Negative

- Fewer explicit architectural enforcement mechanisms than Clean Architecture

## Alternatives Considered

### Clean Architecture

Rejected due to excessive complexity for project size.

### Hexagonal Architecture

Rejected because the project has a single frontend runtime and few external integrations.