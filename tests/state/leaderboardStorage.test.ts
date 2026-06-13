import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addLeaderboardEntry,
  clearLeaderboard,
  createLeaderboardEntry,
  loadLeaderboard,
  loadPlayerName,
  savePlayerName,
} from '../../src/state/leaderboardStorage'

const storage = new Map<string, string>()

beforeEach(() => {
  storage.clear()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  })
})

describe('leaderboardStorage', () => {
  it('returns empty leaderboard when storage is empty', () => {
    expect(loadLeaderboard()).toEqual([])
  })

  it('persists and loads entries sorted by time', () => {
    const slow = createLeaderboardEntry('Alice', 12000, 40, 20)
    const fast = createLeaderboardEntry('Bob', 8000, 35, 20)
    addLeaderboardEntry(slow)
    addLeaderboardEntry(fast)

    const entries = loadLeaderboard()
    expect(entries).toHaveLength(2)
    expect(entries[0].playerName).toBe('Bob')
    expect(entries[1].playerName).toBe('Alice')
  })

  it('returns empty array for corrupt data', () => {
    storage.set('cube-engine-leaderboard', '{not json')
    expect(loadLeaderboard()).toEqual([])
  })

  it('returns empty array for invalid schema version', () => {
    storage.set('cube-engine-leaderboard', JSON.stringify({ version: 99, entries: [] }))
    expect(loadLeaderboard()).toEqual([])
  })

  it('clears leaderboard', () => {
    addLeaderboardEntry(createLeaderboardEntry('Test', 5000, 20, 15))
    expect(loadLeaderboard()).toHaveLength(1)
    clearLeaderboard()
    expect(loadLeaderboard()).toEqual([])
  })

  it('persists player name', () => {
    savePlayerName('Speedy')
    expect(loadPlayerName()).toBe('Speedy')
    savePlayerName('')
    expect(loadPlayerName()).toBe('')
  })

  it('defaults anonymous player name in entries', () => {
    const entry = createLeaderboardEntry('', 5000, 20, 15)
    expect(entry.playerName).toBe('Anonymous')
  })
})
