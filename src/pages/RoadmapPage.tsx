import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { GradeChip } from '../components/GradeChip'
import { CANVAS, topics } from '../data/roadmap'
import { problemsForTopic } from '../data'
import { isUnlocked, lockTooltip } from '../lib/locks'
import { averageScore, completedProblems } from '../lib/store'
import { gradeBand } from '../lib/grading'
import { useAppState } from '../state/appState'

const RING_CIRCUMFERENCE = 2 * Math.PI * 13

export function RoadmapPage() {
  const state = useAppState()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<string | null>(null)

  const derived = useMemo(() => {
    const completedByTopic: Record<string, number> = {}
    for (const topic of topics) {
      completedByTopic[topic.id] = completedProblems(state, topic.problemIds).length
    }
    return topics.map((topic) => {
      const problems = problemsForTopic(topic.id)
      const authored = problems.filter((p) => p.authored)
      const completed = completedProblems(state, topic.problemIds).length
      const avg = averageScore(state, topic.problemIds)
      const unlocked = isUnlocked(topic, completedByTopic)
      return {
        topic,
        authoredCount: authored.length,
        completed,
        grade: avg === undefined ? undefined : gradeBand(avg),
        unlocked,
        tooltip: unlocked ? '' : lockTooltip(topic, completedByTopic),
        pct: authored.length > 0 ? completed / authored.length : 0,
      }
    })
  }, [state])

  const nodeById = Object.fromEntries(derived.map((d) => [d.topic.id, d]))

  return (
    <div className="min-h-screen min-w-[1440px] bg-bg">
      <AppHeader />
      <div className="relative mx-auto" style={{ width: CANVAS.width, height: CANVAS.height }}>
        <svg
          width={CANVAS.width}
          height={CANVAS.height}
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="arr"
              viewBox="0 0 8 8"
              refX={6}
              refY={4}
              markerWidth={7}
              markerHeight={7}
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="color-mix(in srgb, var(--c-ink) 30%, transparent)" />
            </marker>
          </defs>
          {topics.flatMap((topic) =>
            topic.prerequisites.map((prereqId) => {
              const from = nodeById[prereqId]
              const to = nodeById[topic.id]
              const x1 = from.topic.x
              const y1 = from.topic.y + CANVAS.nodeHeight
              const x2 = to.topic.x
              const y2 = to.topic.y
              const d = `M ${x1} ${y1} C ${x1} ${y1 + 56}, ${x2} ${y2 - 56}, ${x2} ${y2 - 5}`
              return (
                <path
                  key={`${prereqId}->${topic.id}`}
                  d={d}
                  fill="none"
                  stroke={
                    to.unlocked
                      ? 'color-mix(in srgb, var(--c-accent-guided) 45%, transparent)'
                      : 'var(--c-line)'
                  }
                  strokeWidth={1.5}
                  markerEnd="url(#arr)"
                />
              )
            }),
          )}
        </svg>
        {derived.map(({ topic, unlocked, tooltip, completed, authoredCount, grade, pct }) => (
          <div
            key={topic.id}
            className="absolute w-[208px]"
            style={{ left: topic.x - CANVAS.nodeWidth / 2, top: topic.y }}
            onMouseEnter={() => setHovered(topic.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {unlocked ? (
              <button
                type="button"
                onClick={() => navigate(`/topic/${topic.id}`)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-[10px] border border-ink/14 bg-surface px-3.5 py-[11px] text-left text-ink shadow-[0_1px_2px_rgba(28,27,24,.05)] hover:border-guided hover:shadow-[0_3px_12px_rgba(28,27,24,.1)]"
              >
                <svg width="34" height="34" viewBox="0 0 34 34" className="flex-none" aria-hidden="true">
                  <circle cx="17" cy="17" r="13" fill="none" stroke="var(--c-line)" strokeWidth="4" />
                  <circle
                    cx="17"
                    cy="17"
                    r="13"
                    fill="none"
                    stroke={pct >= 1 ? 'var(--c-ok)' : 'var(--c-accent-guided)'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(pct * RING_CIRCUMFERENCE).toFixed(1)} ${RING_CIRCUMFERENCE.toFixed(1)}`}
                    transform="rotate(-90 17 17)"
                  />
                </svg>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold leading-[1.25]">{topic.name}</div>
                  <div className="mt-[3px] font-mono text-[11px] font-medium text-muted">
                    {completed}/{authoredCount} done
                  </div>
                </div>
                {grade ? <GradeChip grade={grade} /> : null}
              </button>
            ) : (
              <>
                <div
                  tabIndex={0}
                  onFocus={() => setHovered(topic.id)}
                  onBlur={() => setHovered(null)}
                  aria-label={`${topic.name} — locked. ${tooltip}`}
                  className="flex cursor-not-allowed items-center gap-2.5 rounded-[10px] border border-dashed border-ink/18 bg-sunken px-3.5 py-3 text-faint"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" className="flex-none" aria-hidden="true">
                    <rect x="2.5" y="6" width="9" height="6.5" rx="1.5" fill="var(--c-faint)" />
                    <path
                      d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6"
                      fill="none"
                      stroke="var(--c-faint)"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div className="text-[13.5px] font-semibold leading-[1.25]">{topic.name}</div>
                </div>
                {hovered === topic.id && (
                  <div
                    role="tooltip"
                    className="absolute left-1/2 top-[calc(100%+8px)] z-10 -translate-x-1/2 whitespace-nowrap rounded-[7px] bg-ink px-[11px] py-[7px] text-xs leading-[1.4] text-bg shadow-[0_4px_14px_rgba(28,27,24,.25)]"
                  >
                    {tooltip}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1440px] items-center gap-5 px-7 pb-10 text-xs text-muted">
        <span className="inline-flex items-center gap-[7px]">
          <span className="size-2.5 rounded-[3px] border border-ink/30 bg-surface" />
          Unlocked
        </span>
        <span className="inline-flex items-center gap-[7px]">
          <span className="size-2.5 rounded-[3px] border border-dashed border-ink/30 bg-sunken" />
          Locked — hover for requirement
        </span>
        <span className="ml-auto font-mono">unlock rule: ≥2 completed problems in every prerequisite</span>
      </div>
    </div>
  )
}
