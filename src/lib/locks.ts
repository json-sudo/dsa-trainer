import { COMPLETED_PER_PREREQ, topicById, topics } from '../data/roadmap'
import type { Topic } from '../data/types'
import { completedProblems, type AppState } from './store'

/**
 * Locking rule: a topic is locked until EVERY prerequisite topic has at least
 * COMPLETED_PER_PREREQ (2) completed problems. Arrays & Hashing (no
 * prerequisites) is always unlocked.
 *
 * @param completedByTopic topicId → number of distinct completed problems
 */
export function isUnlocked(topic: Topic, completedByTopic: Record<string, number>): boolean {
  return topic.prerequisites.every((p) => (completedByTopic[p] ?? 0) >= COMPLETED_PER_PREREQ)
}

export function completedByTopic(state: AppState): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const topic of topics) {
    counts[topic.id] = completedProblems(state, topic.problemIds).length
  }
  return counts
}

/** Route access: free-learn mode opens every topic; otherwise the DAG lock applies. */
export function canAccessTopic(topic: Topic, state: AppState, freeLearn: boolean): boolean {
  return freeLearn || isUnlocked(topic, completedByTopic(state))
}

export function missingPrereqs(topic: Topic, completedByTopic: Record<string, number>): string[] {
  return topic.prerequisites
    .filter((p) => (completedByTopic[p] ?? 0) < COMPLETED_PER_PREREQ)
    .map((p) => topicById[p].name)
}

export function lockTooltip(topic: Topic, completedByTopic: Record<string, number>): string {
  const missing = missingPrereqs(topic, completedByTopic)
  return `Complete ${COMPLETED_PER_PREREQ} problems in ${missing.join(' and ')}`
}
