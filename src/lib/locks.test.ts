import { describe, expect, it } from 'vitest'
import { isUnlocked, lockTooltip, missingPrereqs, canAccessTopic } from './locks'
import { topicById, topics } from '../data/roadmap'

describe('lock logic', () => {
  it('Arrays & Hashing (the root) is always unlocked', () => {
    expect(isUnlocked(topicById['arrays-hashing'], {})).toBe(true)
  })

  it('a topic stays locked until its prerequisite has 2 completed problems', () => {
    const twoPointers = topicById['two-pointers']
    expect(isUnlocked(twoPointers, {})).toBe(false)
    expect(isUnlocked(twoPointers, { 'arrays-hashing': 1 })).toBe(false)
    expect(isUnlocked(twoPointers, { 'arrays-hashing': 2 })).toBe(true)
    expect(isUnlocked(twoPointers, { 'arrays-hashing': 4 })).toBe(true)
  })

  it('multi-prerequisite topics require ALL parents (Trees needs Binary Search and Linked List)', () => {
    const trees = topicById['trees']
    expect([...trees.prerequisites].sort()).toEqual(['binary-search', 'linked-list'])
    expect(isUnlocked(trees, { 'binary-search': 2 })).toBe(false)
    expect(isUnlocked(trees, { 'linked-list': 2 })).toBe(false)
    expect(isUnlocked(trees, { 'binary-search': 2, 'linked-list': 2 })).toBe(true)
  })

  it('2-D DP requires both Graphs and 1-D DP', () => {
    const dp2 = topicById['dp-2d']
    expect([...dp2.prerequisites].sort()).toEqual(['dp-1d', 'graphs'])
    expect(isUnlocked(dp2, { graphs: 2, 'dp-1d': 1 })).toBe(false)
    expect(isUnlocked(dp2, { graphs: 2, 'dp-1d': 2 })).toBe(true)
  })

  it('tooltip names every missing prerequisite', () => {
    const dp2 = topicById['dp-2d']
    expect(missingPrereqs(dp2, {})).toEqual(['Graphs', '1-D DP'])
    expect(lockTooltip(dp2, { graphs: 2 })).toBe('Complete 2 problems in 1-D DP')
    expect(lockTooltip(dp2, {})).toBe('Complete 2 problems in Graphs and 1-D DP')
  })

  it('every non-root topic is locked with no progress; the DAG has exactly one root', () => {
    const roots = topics.filter((t) => t.prerequisites.length === 0)
    expect(roots.map((t) => t.id)).toEqual(['arrays-hashing'])
    for (const t of topics) {
      if (t.id !== 'arrays-hashing') expect(isUnlocked(t, {}), t.id).toBe(false)
    }
  })

  it('free-learn mode opens every topic regardless of prerequisites', () => {
    const empty = { version: 1 as const, attempts: [] }
    expect(canAccessTopic(topicById['two-pointers'], empty, false)).toBe(false)
    expect(canAccessTopic(topicById['two-pointers'], empty, true)).toBe(true)
    expect(canAccessTopic(topicById['arrays-hashing'], empty, false)).toBe(true)
  })
})
