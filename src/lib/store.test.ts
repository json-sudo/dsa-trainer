import { describe, expect, it } from 'vitest'
import {
  loadState,
  saveState,
  newAttempt,
  draftFor,
  attemptsFor,
  bestGrade,
  completedProblems,
  averageScore,
  exportJSON,
  importJSON,
  resetAll,
  STORAGE_KEY,
  type Attempt,
} from './store'

function finished(problemId: string, grade: Attempt['grade'], totalScore: number): Attempt {
  return {
    ...newAttempt(problemId, 'practice'),
    finishedAt: new Date().toISOString(),
    currentStep: 10,
    grade,
    totalScore,
    totalSec: 600,
  }
}

describe('persistence', () => {
  it('starts empty and survives a save/load round-trip', () => {
    expect(loadState()).toEqual({ version: 1, attempts: [] })
    const state = { version: 1 as const, attempts: [finished('two-sum', 'A', 95)] }
    saveState(state)
    expect(loadState()).toEqual(state)
  })

  it('recovers from corrupted storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadState()).toEqual({ version: 1, attempts: [] })
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99 }))
    expect(loadState()).toEqual({ version: 1, attempts: [] })
  })

  it('keeps a draft (attempt without finishedAt) resumable', () => {
    const draft = { ...newAttempt('two-sum', 'practice'), currentStep: 5, answers: { 2: 'my answer' } }
    saveState({ version: 1, attempts: [draft] })
    const reloaded = loadState()
    const found = draftFor(reloaded, 'two-sum')
    expect(found?.id).toBe(draft.id)
    expect(found?.currentStep).toBe(5)
    expect(found?.answers[2]).toBe('my answer')
    expect(attemptsFor(reloaded, 'two-sum')).toHaveLength(0)
  })

  it('export/import round-trips and rejects malformed payloads', () => {
    const state = { version: 1 as const, attempts: [finished('two-sum', 'B+', 84)] }
    saveState(state)
    const json = exportJSON()
    resetAll()
    expect(loadState().attempts).toHaveLength(0)
    const imported = importJSON(json)
    expect(imported).toEqual(state)
    expect(loadState()).toEqual(state)
    expect(() => importJSON('{"version":2,"attempts":[]}')).toThrow()
    expect(() => importJSON('{"version":1,"attempts":[{"nope":true}]}')).toThrow()
  })
})

describe('derived queries', () => {
  it('bestGrade is the max over attempts', () => {
    saveState({
      version: 1,
      attempts: [finished('two-sum', 'C+', 62), finished('two-sum', 'A-', 88), finished('two-sum', 'B', 74)],
    })
    expect(bestGrade(loadState(), 'two-sum')).toBe('A-')
  })

  it('completedProblems counts distinct finished problems only', () => {
    saveState({
      version: 1,
      attempts: [
        finished('two-sum', 'A', 95),
        finished('two-sum', 'B', 74),
        newAttempt('group-anagrams', 'guided'),
      ],
    })
    expect(completedProblems(loadState(), ['two-sum', 'group-anagrams', 'top-k-frequent-elements'])).toEqual([
      'two-sum',
    ])
  })

  it('averageScore averages finished scored attempts', () => {
    saveState({ version: 1, attempts: [finished('a', 'A', 90), finished('b', 'B', 70)] })
    expect(averageScore(loadState())).toBe(80)
    expect(averageScore(loadState(), ['a'])).toBe(90)
    expect(averageScore(loadState(), ['zzz'])).toBeUndefined()
  })
})
