import { useMemo, useRef, useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { topics } from '../data/roadmap'
import { problemById } from '../data'
import {
  averageScore,
  completedProblems,
  exportJSON,
  finishedAttempts,
  importJSON,
  resetAll,
} from '../lib/store'
import { isUnlocked } from '../lib/locks'
import { formatClock, gradeBand, GRADE_PCT } from '../lib/grading'
import { replaceState, useAppState, reloadFromStorage } from '../state/appState'
import { WeakStepRow } from './WeakStepRow'

function gradeColor(grade: string | undefined): string {
  if (!grade) return 'transparent'
  if (grade.startsWith('A')) return 'var(--c-ok)'
  if (grade.startsWith('B')) return 'var(--c-accent-guided)'
  return 'var(--c-warn)'
}

export function ProgressPage() {
  const state = useAppState()
  const fileInput = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const finished = finishedAttempts(state)
  const solved = new Set(finished.map((a) => a.problemId)).size
  const avg = averageScore(state)

  const topicRows = useMemo(() => {
    const completedByTopic: Record<string, number> = {}
    for (const topic of topics) {
      completedByTopic[topic.id] = completedProblems(state, topic.problemIds).length
    }
    return topics.map((topic) => {
      const unlocked = isUnlocked(topic, completedByTopic)
      const topicAvg = averageScore(state, topic.problemIds)
      const grade = topicAvg === undefined ? undefined : gradeBand(topicAvg)
      const done = completedByTopic[topic.id]
      const authored = topic.problemIds.filter((id) => problemById[id]?.authored).length
      return { topic, unlocked, grade, done, authored }
    })
  }, [state])

  const weakRows = useMemo(() => {
    const byStep = new Map<number, { sum: number; count: number }>()
    for (const attempt of finished) {
      for (const s of attempt.stepScores) {
        const agg = byStep.get(s.step) ?? { sum: 0, count: 0 }
        agg.sum += s.score
        agg.count += 1
        byStep.set(s.step, agg)
      }
    }
    return [...byStep.entries()]
      .map(([step, { sum, count }]) => ({ step, avg: sum / count, count }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 5)
  }, [finished])

  const historyRows = useMemo(
    () =>
      [...state.attempts]
        .sort((a, b) => (b.finishedAt ?? b.startedAt).localeCompare(a.finishedAt ?? a.startedAt))
        .map((a) => {
          const problem = problemById[a.problemId]
          const topic = topics.find((t) => t.id === problem?.topicId)
          return {
            id: a.id,
            date: new Date(a.finishedAt ?? a.startedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            problem: problem?.title ?? a.problemId,
            topic: topic?.name ?? '',
            mode: a.mode,
            grade: a.mode === 'practice' && a.grade ? a.grade : '—',
            time: a.finishedAt ? formatClock(a.totalSec) : 'draft',
          }
        }),
    [state],
  )

  const onImport = async (file: File) => {
    try {
      const next = importJSON(await file.text())
      replaceState(next)
      setImportError(null)
    } catch (err) {
      setImportError(String(err instanceof Error ? err.message : err))
    }
  }

  const download = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dsa-trainer-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader subtitle="Progress" />
      <div className="mx-auto max-w-[1100px] px-8 pb-24 pt-8">
        <div className="mb-6 flex items-baseline gap-3.5">
          <h1 className="m-0 text-2xl font-semibold">Progress</h1>
          <span className="font-mono text-xs font-medium text-muted">
            {solved} problems · {finished.length} attempts · avg {avg === undefined ? '—' : gradeBand(avg)}
          </span>
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={download} className="ghost-btn">
              Export JSON
            </button>
            <button type="button" onClick={() => fileInput.current?.click()} className="ghost-btn">
              Import JSON
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void onImport(f)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset ALL progress? This wipes every attempt and cannot be undone.')) {
                  resetAll()
                  reloadFromStorage()
                }
              }}
              className="h-8 cursor-pointer rounded-[7px] border border-err/40 bg-surface px-3.5 text-[12.5px] font-medium text-err hover:border-err hover:bg-err/6"
            >
              Reset all data…
            </button>
          </div>
        </div>
        {importError && (
          <div className="mb-4 rounded-[8px] border border-err/40 bg-err/6 px-4 py-2.5 text-[13px] text-err">
            Import failed: {importError}
          </div>
        )}

        <div className="mb-6 flex items-start gap-5">
          <div className="flex-[1.4] rounded-[12px] border border-ink/14 bg-surface px-[22px] py-[18px]">
            <div className="kicker mb-3 text-faint">GRADES BY TOPIC</div>
            <div className="flex flex-col gap-1.5">
              {topicRows.map(({ topic, unlocked, grade, done, authored }) => (
                <div key={topic.id} className="flex items-center gap-3">
                  <span
                    className={`w-[170px] flex-none truncate text-[12.5px] font-medium ${
                      unlocked ? 'text-ink' : 'text-faint/80'
                    }`}
                  >
                    {topic.name}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-[4px] bg-ink/6">
                    <div
                      className="h-full rounded-[4px]"
                      style={{
                        width: grade ? `${GRADE_PCT[grade]}%` : '0%',
                        background: gradeColor(grade),
                      }}
                    />
                  </div>
                  <span
                    className={`w-[66px] flex-none text-right font-mono text-[11px] font-medium ${
                      grade ? 'text-ink-3' : 'text-faint/70'
                    }`}
                  >
                    {grade ? `${grade} · ${done}/${authored}` : unlocked ? 'no attempts' : 'locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-[12px] border border-ink/14 bg-surface px-[22px] py-[18px]">
            <div className="kicker mb-1 text-faint">WEAKEST WIZARD STEPS</div>
            <div className="mb-3.5 text-[11.5px] text-faint">
              avg self-score across all {finished.length} attempts
            </div>
            {weakRows.length === 0 ? (
              <div className="text-[12.5px] text-faint">No scored attempts yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {weakRows.map((w, i) => (
                  <WeakStepRow key={w.step} w={w} rank={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-ink/14 bg-surface">
          <div className="kicker px-[22px] pb-3 pt-4 text-faint">ATTEMPT HISTORY</div>
          <div className="grid grid-cols-[110px_1fr_130px_100px_90px_90px] gap-x-4 border-b border-ink/8 px-[22px] pb-2 font-mono text-[10px] font-semibold tracking-[.8px] text-faint">
            <span>DATE</span>
            <span>PROBLEM</span>
            <span>TOPIC</span>
            <span>MODE</span>
            <span>GRADE</span>
            <span className="text-right">TIME</span>
          </div>
          {historyRows.length === 0 ? (
            <div className="px-[22px] py-4 text-[12.5px] text-faint">No attempts yet.</div>
          ) : (
            historyRows.map((h) => (
              <div
                key={h.id}
                className="grid grid-cols-[110px_1fr_130px_100px_90px_90px] items-center gap-x-4 border-b border-ink/5 px-[22px] py-[9px] text-[12.5px] hover:bg-ink/2"
              >
                <span className="font-mono text-[11.5px] font-medium text-muted">{h.date}</span>
                <span className="font-medium">{h.problem}</span>
                <span className="text-muted">{h.topic}</span>
                <span
                  className="font-mono text-[10px] font-semibold tracking-[.6px]"
                  style={{ color: h.mode === 'guided' ? 'var(--c-accent-guided)' : 'var(--c-accent-practice)' }}
                >
                  {h.mode.toUpperCase()}
                </span>
                <span
                  className="font-mono text-[11.5px] font-semibold"
                  style={{ color: h.grade === '—' ? 'var(--c-faint)' : gradeColor(h.grade) }}
                >
                  {h.grade}
                </span>
                <span className="text-right font-mono text-[11.5px] font-medium text-muted">{h.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
