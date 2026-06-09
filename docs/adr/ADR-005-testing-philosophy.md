# ADR-005: Invariant-Driven Testing

## Status

Accepted

## Context

The most critical part of the application is the correctness of cube transformations.

Traditional coverage metrics alone do not guarantee correctness.

## Decision

Testing focuses on invariants.

Examples:

- Move + Inverse = Identity
- Four Quarter Turns = Identity
- Serialization Round Trip Preserves State
- Generated Scrambles Produce Valid States

Testing Pyramid:

- Unit Tests
- Integration Tests
- E2E Tests

Domain logic receives the highest testing priority.

## Consequences

### Positive

- High confidence in cube correctness
- Detects regression in move logic

### Negative

- Requires additional invariant definitions

## Alternatives Considered

### Coverage-Driven Testing

Rejected because high coverage does not guarantee mathematical correctness.