import { create } from 'zustand'
import { isSolved, type CubeState } from '../domain'
import {
  addLeaderboardEntry,
  clearLeaderboard,
  createLeaderboardEntry,
  loadLeaderboard,
  loadPlayerName,
  savePlayerName,
  type LeaderboardEntry,
} from './leaderboardStorage'

export type TimerStatus = 'idle' | 'ready' | 'running' | 'stopped'

type BrowserGlobals = {
  setInterval?: (handler: () => void, timeout: number) => number
  clearInterval?: (id: number) => void
  performance?: { now: () => number }
}

function browser(): BrowserGlobals {
  return globalThis as BrowserGlobals & typeof globalThis
}

function now(): number {
  return browser().performance?.now() ?? Date.now()
}

interface SessionStore {
  timerStatus: TimerStatus
  elapsedMs: number
  lastSolveMs: number | null
  lastSolveMoveCount: number | null
  lastSolveScrambleLength: number | null
  solveDialogOpen: boolean
  playerName: string
  leaderboard: LeaderboardEntry[]
  startedAt: number | null
  tickIntervalId: number | null

  onScrambleReady: () => void
  onTimerReset: () => void
  onFirstMove: () => void
  checkSolve: (cube: CubeState, moveCount: number, scrambleLength: number) => void
  setPlayerName: (name: string) => void
  saveLastSolve: () => void
  dismissSolveDialog: () => void
  refreshLeaderboard: () => void
  clearAllLeaderboard: () => void
}

function clearTickInterval(tickIntervalId: number | null): null {
  if (tickIntervalId !== null) browser().clearInterval?.(tickIntervalId)
  return null
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  timerStatus: 'idle',
  elapsedMs: 0,
  lastSolveMs: null,
  lastSolveMoveCount: null,
  lastSolveScrambleLength: null,
  solveDialogOpen: false,
  playerName: loadPlayerName(),
  leaderboard: loadLeaderboard(),
  startedAt: null,
  tickIntervalId: null,

  onScrambleReady: () => {
    const { tickIntervalId } = get()
    set({
      timerStatus: 'ready',
      elapsedMs: 0,
      lastSolveMs: null,
      lastSolveMoveCount: null,
      lastSolveScrambleLength: null,
      solveDialogOpen: false,
      startedAt: null,
      tickIntervalId: clearTickInterval(tickIntervalId),
    })
  },

  onTimerReset: () => {
    const { tickIntervalId } = get()
    set({
      timerStatus: 'idle',
      elapsedMs: 0,
      lastSolveMs: null,
      lastSolveMoveCount: null,
      lastSolveScrambleLength: null,
      solveDialogOpen: false,
      startedAt: null,
      tickIntervalId: clearTickInterval(tickIntervalId),
    })
  },

  onFirstMove: () => {
    const { timerStatus, tickIntervalId } = get()
    if (timerStatus !== 'ready') return
    if (tickIntervalId !== null) browser().clearInterval?.(tickIntervalId)

    const startedAt = now()
    const id = browser().setInterval?.(() => {
      set({ elapsedMs: now() - startedAt })
    }, 47)

    set({
      timerStatus: 'running',
      elapsedMs: 0,
      startedAt,
      tickIntervalId: id ?? null,
    })
  },

  checkSolve: (cube, moveCount, scrambleLength) => {
    const { timerStatus, startedAt, tickIntervalId } = get()
    if (timerStatus !== 'running') return
    if (!isSolved(cube)) return

    const finalMs = startedAt !== null ? now() - startedAt : get().elapsedMs

    set({
      timerStatus: 'stopped',
      elapsedMs: finalMs,
      lastSolveMs: finalMs,
      lastSolveMoveCount: moveCount,
      lastSolveScrambleLength: scrambleLength,
      solveDialogOpen: true,
      startedAt: null,
      tickIntervalId: clearTickInterval(tickIntervalId),
    })
  },

  setPlayerName: (name) => {
    savePlayerName(name)
    set({ playerName: name })
  },

  saveLastSolve: () => {
    const { lastSolveMs, lastSolveMoveCount, lastSolveScrambleLength, playerName } = get()
    if (lastSolveMs === null || lastSolveMoveCount === null || lastSolveScrambleLength === null) return

    const entry = createLeaderboardEntry(
      playerName,
      lastSolveMs,
      lastSolveMoveCount,
      lastSolveScrambleLength,
    )
    const leaderboard = addLeaderboardEntry(entry)
    set({ leaderboard, solveDialogOpen: false })
  },

  dismissSolveDialog: () => set({ solveDialogOpen: false }),

  refreshLeaderboard: () => set({ leaderboard: loadLeaderboard() }),

  clearAllLeaderboard: () => {
    clearLeaderboard()
    set({ leaderboard: [] })
  },
}))
