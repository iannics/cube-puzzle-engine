const LEADERBOARD_KEY = 'cube-engine-leaderboard'
const PLAYER_NAME_KEY = 'cube-engine-player-name'
const MAX_ENTRIES = 50
const SCHEMA_VERSION = 1

type BrowserGlobals = {
  localStorage?: {
    getItem: (key: string) => string | null
    setItem: (key: string, value: string) => void
    removeItem: (key: string) => void
  }
}

function browser(): BrowserGlobals {
  return globalThis as BrowserGlobals & typeof globalThis
}

export interface LeaderboardEntry {
  id: string
  playerName: string
  timeMs: number
  moveCount: number
  scrambleLength: number
  completedAt: string
}

interface LeaderboardEnvelope {
  version: number
  entries: LeaderboardEntry[]
}

function isValidEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  return (
    typeof entry.id === 'string' &&
    typeof entry.playerName === 'string' &&
    typeof entry.timeMs === 'number' &&
    entry.timeMs >= 0 &&
    typeof entry.moveCount === 'number' &&
    entry.moveCount >= 0 &&
    typeof entry.scrambleLength === 'number' &&
    entry.scrambleLength > 0 &&
    typeof entry.completedAt === 'string'
  )
}

function parseEnvelope(raw: string): LeaderboardEntry[] {
  const parsed: unknown = JSON.parse(raw)
  if (typeof parsed !== 'object' || parsed === null) return []
  const envelope = parsed as LeaderboardEnvelope
  if (envelope.version !== SCHEMA_VERSION || !Array.isArray(envelope.entries)) return []
  return envelope.entries.filter(isValidEntry)
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = browser().localStorage?.getItem(LEADERBOARD_KEY)
    if (!raw) return []
    return parseEnvelope(raw).sort((a, b) => a.timeMs - b.timeMs)
  } catch {
    return []
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]): void {
  const envelope: LeaderboardEnvelope = { version: SCHEMA_VERSION, entries }
  browser().localStorage?.setItem(LEADERBOARD_KEY, JSON.stringify(envelope))
}

export function addLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  try {
    const entries = [...loadLeaderboard(), entry]
      .sort((a, b) => a.timeMs - b.timeMs)
      .slice(0, MAX_ENTRIES)
    saveLeaderboard(entries)
    return entries
  } catch {
    return loadLeaderboard()
  }
}

export function clearLeaderboard(): void {
  try {
    browser().localStorage?.removeItem(LEADERBOARD_KEY)
  } catch {
    // localStorage may be unavailable.
  }
}

export function loadPlayerName(): string {
  try {
    return browser().localStorage?.getItem(PLAYER_NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

export function savePlayerName(name: string): void {
  try {
    if (name.trim()) {
      browser().localStorage?.setItem(PLAYER_NAME_KEY, name.trim())
    } else {
      browser().localStorage?.removeItem(PLAYER_NAME_KEY)
    }
  } catch {
    // localStorage may be unavailable.
  }
}

export function createLeaderboardEntry(
  playerName: string,
  timeMs: number,
  moveCount: number,
  scrambleLength: number,
): LeaderboardEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    playerName: playerName.trim() || 'Anonymous',
    timeMs,
    moveCount,
    scrambleLength,
    completedAt: new Date().toISOString(),
  }
}
