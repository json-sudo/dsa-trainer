import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { topicById, topics } from '../data/roadmap'
import { problemsForTopic } from '../data'
import { averageScore, completedProblems } from '../lib/store'
import { gradeBand } from '../lib/grading'
import { useAppState } from '../state/appState'
import { ProblemRow } from './ProblemRow'

export function gradeTextColor(grade: string): string {
  if (grade.startsWith('A')) return 'var(--c-ok-text)'
  if (grade.startsWith('B')) return 'var(--c-accent-guided)'
  return 'var(--c-warn)'
}

export function TopicPage() {
  const { topicId } = useParams()
  const state = useAppState()
  const [primerOpen, setPrimerOpen] = useState(true)
  const topic = topicId ? topicById[topicId] : undefined

  const derived = useMemo(() => {
    if (!topic) return undefined
    const problems = problemsForTopic(topic.id)
    const authored = problems.filter((p) => p.authored)
    const completed = completedProblems(state, topic.problemIds).length
    const avg = averageScore(state, topic.problemIds)
    const unlocks = topics.filter((t) => t.prerequisites.includes(topic.id)).map((t) => t.name)
    return { problems, authored, completed, avg, unlocks }
  }, [state, topic])

  if (!topic || !derived) return <Navigate to="/" replace />
  const { problems, authored, completed, avg, unlocks } = derived
  const pct = authored.length > 0 ? completed / authored.length : 0
  const circumference = 2 * Math.PI * 17

  const guided = problems.filter((p) => p.mode === 'guided')
  const practice = problems.filter((p) => p.mode === 'practice')

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader />
      <div className="mx-auto max-w-[920px] px-8 pb-20 pt-8">
        <Link
          to="/"
          className="-ml-[9px] inline-flex items-center gap-1.5 rounded-[6px] px-[9px] py-[5px] text-[13px] font-medium text-ink-3 no-underline hover:bg-ink/6 hover:text-ink"
        >
          ← Roadmap
        </Link>
        <div className="mb-[26px] mt-3.5 flex items-center gap-4">
          <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="17" fill="none" stroke="var(--c-line)" strokeWidth="5" />
            <circle
              cx="22"
              cy="22"
              r="17"
              fill="none"
              stroke={pct >= 1 ? 'var(--c-ok)' : 'var(--c-accent-guided)'}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${(pct * circumference).toFixed(1)} ${circumference.toFixed(1)}`}
              transform="rotate(-90 22 22)"
            />
          </svg>
          <div>
            <h1 className="m-0 text-2xl font-semibold leading-[1.2]">{topic.name}</h1>
            <div className="mt-[5px] font-mono text-xs font-medium text-muted">
              {completed}/{authored.length} authored problems done
              {avg !== undefined && (
                <>
                  {' · avg '}
                  <span className="font-semibold" style={{ color: gradeTextColor(gradeBand(avg)) }}>
                    {gradeBand(avg)}
                  </span>
                </>
              )}
              {unlocks.length > 0 && <> · unlocks {unlocks.join(', ')}</>}
            </div>
          </div>
        </div>

        <div className="mb-7 overflow-hidden rounded-[10px] border border-ink/14 bg-surface">
          <button
            type="button"
            onClick={() => setPrimerOpen((open) => !open)}
            className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-[18px] py-[13px] text-left hover:bg-ink/3"
          >
            <span className="kicker text-guided">PATTERN PRIMER — {topic.primerTitle}</span>
            <span className="ml-auto text-[11px] text-faint">{primerOpen ? '▾ collapse' : '▸ expand'}</span>
          </button>
          {primerOpen && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 border-t border-ink/7 px-[18px] pb-[18px] pt-1">
              <div className="pt-3">
                <div className="kicker mb-[5px] text-[10px] text-faint">WHEN TO USE</div>
                <div className="text-[13px] leading-[1.55] text-ink-2">{topic.primer.when}</div>
              </div>
              <div className="pt-3">
                <div className="kicker mb-[5px] text-[10px] text-faint">FIRST MOVE</div>
                <div className="text-[13px] leading-[1.55] text-ink-2">{topic.primer.firstMove}</div>
              </div>
              <div>
                <div className="kicker mb-[5px] text-[10px] text-faint">COMPLEXITY</div>
                <div className="font-mono text-[12.5px] font-medium text-ink-2">{topic.primer.complexity}</div>
              </div>
              <div>
                <div className="kicker mb-[5px] text-[10px] text-faint">TELLS</div>
                <div className="text-[13px] leading-[1.55] text-ink-2">{topic.primer.tells}</div>
              </div>
            </div>
          )}
        </div>

        <div className="kicker mb-2.5 text-[10.5px] tracking-[1.2px] text-faint">GUIDED WALKTHROUGHS</div>
        <div className="mb-[26px] flex flex-col gap-2">
          {guided.map((p) => (
            <ProblemRow key={p.id} problem={p} />
          ))}
        </div>
        <div className="kicker mb-2.5 text-[10.5px] tracking-[1.2px] text-faint">PRACTICE</div>
        <div className="flex flex-col gap-2">
          {practice.map((p) => (
            <ProblemRow key={p.id} problem={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
