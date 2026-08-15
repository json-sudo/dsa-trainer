import type { Mode } from '../data/types'
import type { Grade, PatternVerdict, SelfScore } from './grading'
import type { CaseResult } from './executor'

export const STORAGE_KEY = 'dsa-trainer/v1'
export const SETTINGS_KEY = 'dsa-trainer/settings'

export interface StepScoreEntry {
  step: number
  score: SelfScore
  elapsedSec: number
}

export interface StoredRun {
  runNumber: number
  cases: CaseResult[]
  durationMs: number
  passed: number
  total: number
  error?: string
}

export interface Attempt {
  id: string
  problemId: string
  mode: Mode
  startedAt: string
  /** Absent ⇒ draft. */
  finishedAt?: string
  currentStep: number
  answers: Record<number, string>
  patternPick?: { pattern: string; verdict: PatternVerdict }
  /** Steps whose model answer has been revealed (practice mode). */
  revealed: number[]
  stepScores: StepScoreEntry[]
  /** Elapsed seconds per step, keyed by step number (persists with drafts). */
  stepSeconds: Record<number, number>
  totalSec: number
  code?: string
  lastRun?: StoredRun
  totalScore?: number
  grade?: Grade
}

export interface AppState {
  version: 1
  attempts: Attempt[]
}

export interface Settings {
  theme: 'light' | 'dark'
  freeLearn: boolean
}

/** Unfinished visits shorter than this are not kept as drafts. */
export const DRAFT_KEEP_SEC = 3 * 60

export function shouldPersistAttempt(attempt: Attempt): boolean {
  return !!attempt.finishedAt || attempt.totalSec >= DRAFT_KEEP_SEC
}

const emptyState: AppState = { version: 1, attempts: [] }

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(emptyState)
    const parsed = JSON.parse(raw)
    if (parsed?.version !== 1 || !Array.isArray(parsed.attempts)) return structuredClone(emptyState)
    return parsed as AppState
  } catch {
    return structuredClone(emptyState)
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return {
      theme: parsed?.theme === 'dark' ? 'dark' : 'light',
      freeLearn: parsed?.freeLearn === true,
    }
  } catch {
    return { theme: 'light', freeLearn: false }
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function exportJSON(): string {
  return JSON.stringify(loadState(), null, 2)
}

export function importJSON(raw: string): AppState {
  const parsed = JSON.parse(raw)
  if (parsed?.version !== 1 || !Array.isArray(parsed.attempts)) {
    throw new Error('Not a DSA Trainer export: expected { version: 1, attempts: [...] }')
  }
  for (const a of parsed.attempts) {
    if (typeof a.id !== 'string' || typeof a.problemId !== 'string') {
      throw new Error('Malformed attempt entry in import')
    }
  }
  saveState(parsed)
  return parsed
}

export function resetAll(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function newAttempt(problemId: string, mode: Mode): Attempt {
  return {
    id: `${problemId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    problemId,
    mode,
    startedAt: new Date().toISOString(),
    currentStep: 1,
    answers: {},
    revealed: [],
    stepScores: [],
    stepSeconds: {},
    totalSec: 0,
  }
}

/* ---------- Derived queries (never stored) ---------- */

export function finishedAttempts(state: AppState): Attempt[] {
  return state.attempts.filter((a) => a.finishedAt)
}

export function draftFor(state: AppState, problemId: string): Attempt | undefined {
  return state.attempts.find((a) => a.problemId === problemId && !a.finishedAt)
}

export function attemptsFor(state: AppState, problemId: string): Attempt[] {
  return state.attempts.filter((a) => a.problemId === problemId && a.finishedAt)
}

export function bestGrade(state: AppState, problemId: string): Grade | undefined {
  const order: Grade[] = ['A', 'A-', 'B+', 'B', 'C+', 'C', 'D']
  const grades = attemptsFor(state, problemId)
    .map((a) => a.grade)
    .filter((g): g is Grade => !!g)
  return order.find((g) => grades.includes(g))
}

/** Distinct problems in this topic with at least one finished attempt. */
export function completedProblems(state: AppState, problemIds: string[]): string[] {
  const finished = new Set(finishedAttempts(state).map((a) => a.problemId))
  return problemIds.filter((id) => finished.has(id))
}

export function averageScore(state: AppState, problemIds?: string[]): number | undefined {
  const scored = finishedAttempts(state).filter(
    (a) => a.totalScore !== undefined && (!problemIds || problemIds.includes(a.problemId)),
  )
  if (scored.length === 0) return undefined
  return Math.round(scored.reduce((sum, a) => sum + (a.totalScore ?? 0), 0) / scored.length)
}

/** Average self-score (0–2) per wizard step across all scored attempts. */
export function weakestSteps(state: AppState): { step: number; avg: number; count: number }[] {
  const byStep = new Map<number, { sum: number; count: number }>()
  for (const attempt of finishedAttempts(state)) {
    for (const entry of attempt.stepScores) {
      const agg = byStep.get(entry.step) ?? { sum: 0, count: 0 }
      agg.sum += entry.score
      agg.count += 1
      byStep.set(entry.step, agg)
    }
  }
  return [...byStep.entries()]
    .map(([step, { sum, count }]) => ({ step, avg: sum / count, count }))
    .sort((a, b) => a.avg - b.avg)
}
