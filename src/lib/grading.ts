export type Grade = 'A' | 'A-' | 'B+' | 'B' | 'C+' | 'C' | 'D'
export type SelfScore = 0 | 1 | 2
export type PatternVerdict = 'correct' | 'alternate' | 'wrong'

export const STEP_LABELS = [
  'Read the problem',
  'Inputs & outputs',
  'What must be found',
  'Constraints → budget',
  'Brute force',
  'Pick the pattern',
  'Design the algorithm',
  'Interview script',
  'Code & tests',
  'Grade',
] as const

export const STEP_KEYS = {
  2: 'inputsOutputs',
  3: 'whatToFind',
  4: 'constraintsHint',
  5: 'bruteForce',
  6: 'wasteAndPattern',
  7: 'algorithm',
  8: 'interviewScript',
} as const

export const STEP_SHORT_LABELS = [
  '1 read',
  '2 i/o',
  '3 goal',
  '4 budget',
  '5 brute',
  '6 pattern',
  '7 design',
  '8 script',
  '9 code',
  '10 grade',
] as const

/**
 * Fixed weights (spec decision): breakdown steps 2–5 = 30% (7.5 each),
 * pattern step 6 = 15%, algorithm step 7 = 15%, interview script step 8 = 10%,
 * code step 9 = 30%.
 */
export const STEP_WEIGHTS: Record<number, number> = {
  2: 7.5,
  3: 7.5,
  4: 7.5,
  5: 7.5,
  6: 15,
  7: 15,
  8: 10,
  9: 30,
}

export interface GradeInput {
  /** Self scores for steps 2–8, keyed by step number. */
  selfScores: Record<number, SelfScore>
  patternVerdict: PatternVerdict
  testsPassed: number
  testsTotal: number
}

export interface GradeBreakdown {
  total: number
  grade: Grade
  /** Normalized 0–1 achievement per scored step (2–9). */
  perStep: Record<number, number>
  weakestStep: number
}

/**
 * Step 6 is half auto (pattern pick: any accepted pattern = full credit) and
 * half self-scored (the "what does brute force waste" sentence).
 */
export function computeGrade(input: GradeInput): GradeBreakdown {
  const perStep: Record<number, number> = {}
  for (const step of [2, 3, 4, 5, 7, 8]) {
    perStep[step] = (input.selfScores[step] ?? 0) / 2
  }
  const patternAuto = input.patternVerdict === 'wrong' ? 0 : 1
  perStep[6] = 0.5 * patternAuto + 0.5 * ((input.selfScores[6] ?? 0) / 2)
  perStep[9] = input.testsTotal > 0 ? input.testsPassed / input.testsTotal : 0

  let total = 0
  for (const [step, weight] of Object.entries(STEP_WEIGHTS)) {
    total += weight * perStep[Number(step)]
  }
  total = Math.round(total)

  let weakestStep = 2
  for (const step of Object.keys(STEP_WEIGHTS).map(Number)) {
    if (perStep[step] < perStep[weakestStep]) weakestStep = step
  }

  return { total, grade: gradeBand(total), perStep, weakestStep }
}

export function gradeBand(total: number): Grade {
  if (total >= 92) return 'A'
  if (total >= 86) return 'A-'
  if (total >= 80) return 'B+'
  if (total >= 70) return 'B'
  if (total >= 60) return 'C+'
  if (total >= 50) return 'C'
  return 'D'
}

export const GRADE_QUALIFIER: Record<Grade, string> = {
  A: 'excellent',
  'A-': 'strong',
  'B+': 'good',
  B: 'solid',
  'C+': 'shaky',
  C: 'needs work',
  D: 'retry this one',
}

/** Approximate % for rendering a grade as a bar (matches the design mock). */
export const GRADE_PCT: Record<Grade, number> = {
  A: 95,
  'A-': 90,
  'B+': 85,
  B: 78,
  'C+': 65,
  C: 55,
  D: 40,
}

/** Soft per-problem time targets (cosmetic only — never a penalty). */
export function softTargetSec(difficulty: 'easy' | 'medium' | 'hard'): number {
  return difficulty === 'easy' ? 20 * 60 : difficulty === 'medium' ? 25 * 60 : 35 * 60
}

export function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
