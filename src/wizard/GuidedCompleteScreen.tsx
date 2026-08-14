import { Link } from 'react-router-dom'
import type { Problem } from '../data/types'
import { formatClock, STEP_LABELS } from '../lib/grading'
import type { Attempt } from '../lib/store'
import { Markdown } from './Markdown'
import { STEP_KEYS } from './GradeScreen'

export function GuidedCompleteScreen({
  problem,
  attempt,
  onRetry,
  review,
  setReview,
}: {
  problem: Problem
  attempt: Attempt
  onRetry: () => void
  review: boolean
  setReview: (review: boolean) => void
}) {
  return (
    <div className="mx-auto max-w-[880px] px-8 pb-24 pt-9">
      <div className="mb-6 rounded-[12px] border border-guided/35 bg-surface px-7 py-6">
        <div className="kicker mb-2 text-guided">WALKTHROUGH COMPLETE</div>
        <div className="text-lg font-semibold">
          {problem.title} — total {formatClock(attempt.totalSec)}
        </div>
        <p className="mb-0 mt-2 text-[13.5px] leading-[1.6] text-muted">
          Guided walkthroughs aren't scored. The sequence you just walked — I/O, goal, budget, brute
          force, waste → pattern, design, script, code — is the exact one to run on every practice
          problem.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          to={`/topic/${problem.topicId}`}
          className="inline-flex h-[36px] items-center rounded-[7px] bg-ink px-5 text-[13.5px] font-semibold text-bg no-underline"
        >
          Back to topic
        </Link>
        <button type="button" onClick={onRetry} className="ghost-btn h-[36px]">
          Walk through again
        </button>
        {!review && (
          <button type="button" onClick={() => setReview(true)} className="ghost-btn h-[36px]">
            Show the full walkthrough
          </button>
        )}
      </div>
      {review && (
        <div className="mt-8 border-t-2 border-ink/10 pt-[26px]">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="m-0 text-[17px] font-semibold">Full walkthrough</h2>
            <span className="text-[12.5px] text-muted">
              every step's model answer, the incremental build, then the reference solution
            </span>
          </div>
          <div className="mb-5 flex flex-col gap-2.5">
            {([2, 3, 4, 5, 6, 7, 8] as const).map((step) => (
              <div key={step} className="rounded-[10px] border border-ink/13 bg-surface px-[18px] py-3.5">
                <div className="mb-2 flex items-baseline gap-2.5">
                  <span className="font-mono text-[10px] font-semibold tracking-[.8px] text-guided">
                    STEP {step}
                  </span>
                  <span className="text-[13.5px] font-semibold">{STEP_LABELS[step - 1]}</span>
                </div>
                <div className="text-[13px] leading-[1.6] text-ink-2">
                  <Markdown text={problem.steps[STEP_KEYS[step]].modelAnswer} />
                </div>
              </div>
            ))}
          </div>
          {problem.incrementalBuild && (
            <div className="mb-5 rounded-[10px] border border-guided/35 bg-surface px-[18px] py-4">
              <div className="kicker mb-2.5 text-guided">INCREMENTAL BUILD</div>
              <div className="flex flex-col gap-2.5">
                {problem.incrementalBuild.map((chunk, i) => (
                  <div key={i}>
                    <div className="mb-1 font-mono text-[11.5px] font-medium text-ink-2">{chunk.label}</div>
                    <pre className="m-0 overflow-x-auto rounded-[8px] border border-ink/8 bg-bg px-3.5 py-2.5 font-mono text-xs leading-[1.7] text-ink-2">
                      <code>{chunk.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-[10px] border border-guided/35 bg-surface px-[18px] py-4">
            <div className="kicker mb-2.5 text-guided">
              REFERENCE SOLUTION — {problem.code.complexity.time.toUpperCase()} TIME ·{' '}
              {problem.code.complexity.space.toUpperCase()} SPACE
            </div>
            <div className="overflow-x-auto whitespace-pre rounded-[8px] border border-ink/8 bg-bg px-3.5 py-3 font-mono text-xs leading-[1.75] text-ink-2">
              {problem.code.referenceSolution}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
