# ADR-006: Client-Side Persistence with localStorage

## Status

Accepted

## Context

The application needs to persist user data across sessions:

- Leaderboard entries (solve times)
- Optional player nickname
- Onboarding completion flag (existing)

Browser storage must not leak into the domain or rendering layers (ADR-003).

## Decision

Use `localStorage` for client-side persistence, implemented exclusively in the `src/state/` layer.

### Key naming

All keys use the prefix `cube-engine-`:

- `cube-engine-onboarding-complete` — onboarding flag (existing)
- `cube-engine-leaderboard` — leaderboard entries
- `cube-engine-player-name` — optional nickname

### Schema versioning

Structured data is stored as a versioned JSON envelope:

```json
{
  "version": 1,
  "entries": [...]
}
```

On read, validate the envelope and each entry. Corrupt, missing, or unsupported version data returns safe defaults (empty array) without throwing into the UI.

### Defensive I/O

Follow the pattern established in `uiStore.ts`:

- Typed `browser()` helper for optional `localStorage` access
- try/catch around all read/write/remove operations
- Never assume storage is available (private browsing, quota exceeded)

### What is persisted

| Data | Persisted | Notes |
|------|-----------|-------|
| Leaderboard entries | Yes | Max 50 entries, sorted by time |
| Player nickname | Yes | Optional string |
| Onboarding flag | Yes | Existing behavior |
| Timer state | No | In-memory only; mid-solve state is not restored on reload |
| Cube state | No | Out of scope |

## Consequences

### Positive

- Simple, no backend required
- Consistent with existing onboarding pattern
- Domain remains pure and testable

### Negative

- Data is device-local only
- Storage quota limits apply
- No cross-device sync

## Alternatives Considered

### Zustand persist middleware

Rejected to keep explicit validation and schema versioning per key rather than persisting entire store snapshots.

### IndexedDB

Rejected as over-engineering for a small leaderboard list.
