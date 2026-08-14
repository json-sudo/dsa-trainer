import { COMPLETED_PER_PREREQ, topicById } from '../data/roadmap'
import type { Topic } from '../data/types'

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

/** Names of prerequisite topics still missing completions, for the lock tooltip. */
export function missingPrereqs(topic: Topic, completedByTopic: Record<string, number>): string[] {
  return topic.prerequisites
    .filter((p) => (completedByTopic[p] ?? 0) < COMPLETED_PER_PREREQ)
    .map((p) => topicById[p].name)
}

export function lockTooltip(topic: Topic, completedByTopic: Record<string, number>): string {
  const missing = missingPrereqs(topic, completedByTopic)
  return `Complete ${COMPLETED_PER_PREREQ} problems in ${missing.join(' and ')}`
}
