# ADR-002: Generic NxN Cube Engine

## Status

Accepted

## Context

The initial product targets a 3x3 Rubik's Cube.

Future support may include:

- 2x2
- 4x4
- 5x5

Retrofitting support later would require significant domain changes if the engine is hardcoded for 3x3.

## Decision

The domain model is size-agnostic.

Example:

```ts
new Cube(3);
new Cube(4);
new Cube(5);
```

Rotations are implemented as generic layer transformations rather than fixed 3x3 face operations.

## Consequences

### Positive

- Future-proof domain model
- Minimal additional complexity
- Supports future puzzle sizes

### Negative

- Slightly more complex initial implementation

## Alternatives Considered

### Cube3x3-Specific Engine

Rejected because it would create a migration barrier for future cube sizes.