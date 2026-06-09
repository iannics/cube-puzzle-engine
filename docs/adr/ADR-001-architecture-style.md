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

Top-level modules:

- cube
- solver
- rendering
- tutorial
- ui
- shared

Domain boundaries are enforced through folder structure and import rules.

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