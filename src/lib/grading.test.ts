import { describe, expect, it } from 'vitest'
import { computeGrade, gradeBand, STEP_WEIGHTS, type SelfScore } from './grading'

const allScores = (v: SelfScore): Record<number, SelfScore> => ({ 2: v, 3: v, 4: v, 5: v, 6: v, 7: v, 8: v })

describe('grade computation', () => {
  it('weights sum to 100', () => {
    expect(Object.values(STEP_WEIGHTS).reduce((a, b) => a + b, 0)).toBe(100)
  })

  it('all 2s + correct pattern + all tests passing = 100 (grade A)', () => {
    const g = computeGrade({ selfScores: allScores(2), patternVerdict: 'correct', testsPassed: 6, testsTotal: 6 })
    expect(g.total).toBe(100)
    expect(g.grade).toBe('A')
  })

  it('all 0s + wrong pattern + no tests passing = 0 (grade D)', () => {
    const g = computeGrade({ selfScores: allScores(0), patternVerdict: 'wrong', testsPassed: 0, testsTotal: 6 })
    expect(g.total).toBe(0)
    expect(g.grade).toBe('D')
  })

  it('an accepted alternate pattern earns full pattern credit', () => {
    const correct = computeGrade({ selfScores: allScores(2), patternVerdict: 'correct', testsPassed: 6, testsTotal: 6 })
    const alternate = computeGrade({ selfScores: allScores(2), patternVerdict: 'alternate', testsPassed: 6, testsTotal: 6 })
    expect(alternate.total).toBe(correct.total)
  })

  it('wrong pattern costs exactly half the step-6 weight', () => {
    const right = computeGrade({ selfScores: allScores(2), patternVerdict: 'correct', testsPassed: 6, testsTotal: 6 })
    const wrong = computeGrade({ selfScores: allScores(2), patternVerdict: 'wrong', testsPassed: 6, testsTotal: 6 })
    // totals are rounded, so the gap is 100 minus the rounded remainder
    expect(right.total - wrong.total).toBe(100 - Math.round(100 - STEP_WEIGHTS[6] / 2))
  })

  it('partial test passes scale the 30% code weight', () => {
    const half = computeGrade({ selfScores: allScores(2), patternVerdict: 'correct', testsPassed: 3, testsTotal: 6 })
    expect(half.total).toBe(100 - 15)
  })

  it('zero total tests yields zero code credit (not NaN)', () => {
    const g = computeGrade({ selfScores: allScores(2), patternVerdict: 'correct', testsPassed: 0, testsTotal: 0 })
    expect(g.total).toBe(70)
    expect(Number.isNaN(g.total)).toBe(false)
  })

  it('missing self-scores are treated as 0', () => {
    const g = computeGrade({ selfScores: {}, patternVerdict: 'correct', testsPassed: 6, testsTotal: 6 })
    expect(g.total).toBe(Math.round(30 + STEP_WEIGHTS[6] / 2))
  })

  it('flags the weakest step', () => {
    const scores = allScores(2)
    scores[5] = 0
    const g = computeGrade({ selfScores: scores, patternVerdict: 'correct', testsPassed: 6, testsTotal: 6 })
    expect(g.weakestStep).toBe(5)
  })
})

describe('grade bands', () => {
  it('maps totals to letter bands', () => {
    expect(gradeBand(100)).toBe('A')
    expect(gradeBand(92)).toBe('A')
    expect(gradeBand(88)).toBe('A-')
    expect(gradeBand(81)).toBe('B+')
    expect(gradeBand(72)).toBe('B')
    expect(gradeBand(65)).toBe('C+')
    expect(gradeBand(51)).toBe('C')
    expect(gradeBand(30)).toBe('D')
  })
})
