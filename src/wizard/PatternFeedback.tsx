import type { Problem, PatternId } from '../data/types'
import { patternName } from '../data/patterns'
import type { Attempt } from '../lib/store'

export function PatternFeedback({
  problem,
  pick,
}: {
  problem: Problem
  pick: Attempt['patternPick']
}) {
  if (!pick) return null
  const accepted = problem.steps.wasteAndPattern.acceptedPatterns
  const styles = {
    correct: { color: 'var(--c-ok-text)', label: '✓ correct' },
    alternate: { color: 'var(--c-accent-guided)', label: '✓ acceptable alternative' },
    wrong: { color: 'var(--c-err)', label: '✕ not the pattern' },
  }[pick.verdict]
  return (
    <div className="text-[13px]">
      <span className="font-semibold">{patternName(pick.pattern as PatternId) ?? pick.pattern}</span>{' '}
      <span className="font-mono text-xs font-semibold" style={{ color: styles.color }}>
        {styles.label}
      </span>
      {pick.verdict === 'wrong' && (
        <span className="ml-2 text-muted">
          expected {accepted.map(patternName).join(' or ')}
        </span>
      )}
    </div>
  )
}
