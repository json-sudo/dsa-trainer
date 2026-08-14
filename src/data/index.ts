import type { AnyProblem, Problem } from './types'
import { topics } from './roadmap'
import { arraysHashingProblems } from './problems/arrays-hashing'
import { twoPointersProblems } from './problems/two-pointers'
import { slidingWindowProblems } from './problems/sliding-window'
import { stackProblems } from './problems/stack'
import { binarySearchProblems } from './problems/binary-search'
import { linkedListProblems } from './problems/linked-list'
import { treesProblems } from './problems/trees'
import { triesProblems } from './problems/tries'
import { heapProblems } from './problems/heap'
import { backtrackingProblems } from './problems/backtracking'
import { graphsProblems } from './problems/graphs'
import { advancedGraphsProblems } from './problems/advanced-graphs'
import { dp1dProblems } from './problems/dp-1d'
import { dp2dProblems } from './problems/dp-2d'
import { greedyProblems } from './problems/greedy'
import { intervalsProblems } from './problems/intervals'
import { mathGeometryProblems } from './problems/math-geometry'
import { bitManipulationProblems } from './problems/bit-manipulation'

export const allProblems: AnyProblem[] = [
  ...arraysHashingProblems,
  ...twoPointersProblems,
  ...slidingWindowProblems,
  ...stackProblems,
  ...binarySearchProblems,
  ...linkedListProblems,
  ...treesProblems,
  ...triesProblems,
  ...heapProblems,
  ...backtrackingProblems,
  ...graphsProblems,
  ...advancedGraphsProblems,
  ...dp1dProblems,
  ...dp2dProblems,
  ...greedyProblems,
  ...intervalsProblems,
  ...mathGeometryProblems,
  ...bitManipulationProblems,
]

export const problemById: Record<string, AnyProblem> = Object.fromEntries(
  allProblems.map((p) => [p.id, p]),
)

/** Problems for a topic in catalog order (2 guided then 5 practice). */
export function problemsForTopic(topicId: string): AnyProblem[] {
  const topic = topics.find((t) => t.id === topicId)
  if (!topic) return []
  return topic.problemIds.map((id) => problemById[id]).filter(Boolean)
}

export function authoredProblems(): Problem[] {
  return allProblems.filter((p): p is Problem => p.authored)
}
