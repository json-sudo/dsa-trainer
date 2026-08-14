import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Problem } from '../data/types'
import {
  computeGrade,
  formatClock,
  GRADE_QUALIFIER,
  softTargetSec,
  STEP_LABELS,
  type SelfScore,
} from '../lib/grading'
import type { Attempt } from '../lib/store'
import { Markdown } from './Markdown'
import { GuidedCompleteScreen } from './GuidedCompleteScreen'

export const STEP_KEYS = {
  2: 'inputsOutputs',
  3: 'whatToFind',
  4: 'constraintsHint',
  5: 'bruteForce',
  6: 'wasteAndPattern',
  7: 'algorithm',
  8: 'interviewScript',
} as const

export function GradeScreen({
  problem,
  attempt,
  update,
  onRetry,
}: {
  problem: Problem
  attempt: Attempt
  update: (patch: Partial<Attempt> | ((a: Attempt) => Attempt)) => void
  onRetry: () => void
}) {
  const [review, setReview] = useState(false)
  const isPractice = problem.mode === 'practice'

  const breakdown = useMemo(() => {
    if (!isPractice) return undefined
    const selfScores: Record<number, SelfScore> = {}
    for (const s of attempt.stepScores) selfScores[s.step] = s.score
    return computeGrade({
      selfScores,
      patternVerdict: attempt.patternPick?.verdict ?? 'wrong',
      testsPassed: attempt.lastRun?.passed ?? 0,
      testsTotal: attempt.lastRun?.total ?? problem.code.tests.length,
    })
  }, [isPractice, attempt.stepScores, attempt.patternPick, attempt.lastRun, problem])

  useEffect(() => {
    if (attempt.finishedAt) return
    update((prev) => ({
      ...prev,
      finishedAt: new Date().toISOString(),
      currentStep: 10,
      totalScore: breakdown?.total,
      grade: breakdown?.grade,
    }))
  }, [attempt.finishedAt, breakdown, update])

  const target = softTargetSec(problem.difficulty)
  const underTarget = attempt.totalSec <= target

  const weakest = breakdown ? breakdown.weakestStep : undefined
  const weakestTip =
    weakest !== undefined
      ? weakest === 9
        ? 'Fix: re-run against the failing cases and step through your loop bounds — passing tests carry 30% of the grade.'
        : `Fix: ${problem.steps[STEP_KEYS[weakest as keyof typeof STEP_KEYS]].rubric[0]}.`
      : undefined

  if (!isPractice) {
    return (
      <GuidedCompleteScreen
        problem={problem}
        attempt={attempt}
        onRetry={onRetry}
        review={review}
        setReview={setReview}
      />
    )
  }

  const bars = [2, 3, 4, 5, 6, 7, 8, 9].map((step) => {
    const norm = breakdown?.perStep[step] ?? 0
    const selfScore = attempt.stepScores.find((s) => s.step === step)?.score
    const display =
      step === 9
        ? `${attempt.lastRun?.passed ?? 0}/${attempt.lastRun?.total ?? problem.code.tests.length}`
        : step === 6
          ? `${Math.round(norm * 2 * 10) / 10}/2`
          : `${selfScore ?? 0}/2`
    return { step, norm, display }
  })

  const barColor = (norm: number) =>
    norm >= 0.99 ? 'var(--c-ok)' : norm >= 0.5 ? 'var(--c-warn)' : 'var(--c-err)'

  return (
    <div className="mx-auto max-w-[880px] px-8 pb-24 pt-9">
      <div className="mb-[22px] flex items-stretch gap-7">
        <div className="flex w-60 flex-none flex-col items-center justify-center rounded-[12px] border border-ink/14 bg-surface p-6">
          <div className="font-mono text-[64px] font-semibold leading-none tracking-[-2px]">
            {breakdown?.total ?? 0}
          </div>
          <div className="mt-3 rounded-[6px] bg-guided/10 px-3 py-1 font-mono text-[13px] font-semibold text-guided">
            {breakdown?.grade} — {breakdown ? GRADE_QUALIFIER[breakdown.grade] : ''}
          </div>
          <div className="mt-3.5 font-mono text-[11.5px] font-medium text-muted">
            total <span className="text-ink">{formatClock(attempt.totalSec)}</span> · target{' '}
            {formatClock(target)}{' '}
            <span style={{ color: underTarget ? 'var(--c-ok-text)' : 'var(--c-warn)' }}>
              {underTarget ? '✓' : '✕'}
            </span>
          </div>
        </div>
        <div className="flex-1 rounded-[12px] border border-ink/14 bg-surface px-[22px] py-[18px]">
          <div className="kicker mb-3 text-faint">PER-STEP SCORES</div>
          <div className="flex flex-col gap-[7px]">
            {bars.map((b) => (
              <div key={b.step} className="flex items-center gap-3">
                <span className="w-[150px] flex-none truncate text-xs font-medium text-ink-3">
                  {STEP_LABELS[b.step - 1]}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-[4px] bg-ink/7">
                  <div
                    className="h-full rounded-[4px]"
                    style={{ width: `${b.norm * 100}%`, background: barColor(b.norm) }}
                  />
                </div>
                <span
                  className="w-[34px] flex-none text-right font-mono text-[11px] font-semibold"
                  style={{ color: barColor(b.norm) }}
                >
                  {b.display}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {weakest !== undefined && (
        <div className="mb-6 flex items-start gap-3 rounded-[10px] border border-warn/35 bg-warn/7 px-[18px] py-3.5">
          <span className="kicker mt-px flex-none rounded-[4px] bg-warn/14 px-[7px] py-[3px] text-[10px] tracking-[.8px] text-warn">
            WEAKEST STEP
          </span>
          <div className="text-[13.5px] leading-[1.55] text-ink-2">
            <span className="font-semibold">
              {STEP_LABELS[weakest - 1]} ({bars.find((b) => b.step === weakest)?.display}).
            </span>{' '}
            {weakestTip}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="h-10 cursor-pointer rounded-[9px] border-none bg-practice px-[22px] text-sm font-semibold text-white hover:bg-practice-hover"
        >
          Retry problem
        </button>
        {!review && (
          <button type="button" onClick={() => setReview(true)} className="ghost-btn h-10 text-[13.5px]">
            Show me the model answer
          </button>
        )}
        <span className="text-xs text-faint">Every retry counts as a new attempt.</span>
      </div>

      {review && (
        <div className="mt-8 border-t-2 border-ink/10 pt-[26px]">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="m-0 text-[17px] font-semibold">Full review</h2>
            <span className="text-[12.5px] text-muted">
              every step's model answer, then the reference solution
            </span>
          </div>
          <div className="mb-5 flex flex-col gap-2.5">
            {([2, 3, 4, 5, 6, 7, 8] as const).map((step) => {
              const selfScore = attempt.stepScores.find((s) => s.step === step)?.score ?? 0
              const color =
                selfScore === 2 ? 'var(--c-ok-text)' : selfScore === 1 ? 'var(--c-warn)' : 'var(--c-err)'
              return (
                <div key={step} className="rounded-[10px] border border-ink/13 bg-surface px-[18px] py-3.5">
                  <div className="mb-2 flex items-baseline gap-2.5">
                    <span className="font-mono text-[10px] font-semibold tracking-[.8px] text-practice">
                      STEP {step}
                    </span>
                    <span className="text-[13.5px] font-semibold">{STEP_LABELS[step - 1]}</span>
                    <span className="ml-auto font-mono text-[11px] font-semibold" style={{ color }}>
                      you: {selfScore}/2
                    </span>
                  </div>
                  <div className="text-[13px] leading-[1.6] text-ink-2">
                    <Markdown text={problem.steps[STEP_KEYS[step]].modelAnswer} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mb-[22px] rounded-[10px] border border-guided/35 bg-surface px-[18px] py-4">
            <div className="kicker mb-2.5 text-guided">
              REFERENCE SOLUTION — {problem.code.complexity.time.toUpperCase()} TIME ·{' '}
              {problem.code.complexity.space.toUpperCase()} SPACE
            </div>
            <div className="overflow-x-auto whitespace-pre rounded-[8px] border border-ink/8 bg-bg px-3.5 py-3 font-mono text-xs leading-[1.75] text-ink-2">
              {problem.code.referenceSolution}
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/topic/${problem.topicId}`}
              className="inline-flex h-[38px] items-center rounded-[9px] bg-ink px-5 text-[13.5px] font-semibold text-bg no-underline hover:opacity-90"
            >
              Next problem →
            </Link>
            <Link
              to={`/topic/${problem.topicId}`}
              className="ghost-btn inline-flex h-[38px] items-center no-underline"
            >
              Back to topic
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
