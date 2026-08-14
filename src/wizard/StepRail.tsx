import type { Mode } from '../data/types'
import { STEP_LABELS } from '../lib/grading'
import type { Attempt } from '../lib/store'

export function StepRail({
  mode,
  attempt,
  viewStep,
  onSelect,
}: {
  mode: Mode
  attempt: Attempt
  viewStep: number
  onSelect: (step: number) => void
}) {
  const accent = mode === 'practice' ? 'var(--c-accent-practice)' : 'var(--c-accent-guided)'
  const scoreFor = (step: number) => attempt.stepScores.find((s) => s.step === step)?.score

  return (
    <nav className="w-[236px] flex-none overflow-y-auto border-r border-line bg-surface px-2.5 py-3.5">
      <div className="kicker px-2.5 pb-2.5 text-[10px] tracking-[1.2px] text-faint">
        {mode === 'practice' ? 'WIZARD · 10 STEPS' : 'WALKTHROUGH · 10 STEPS'}
      </div>
      <div className="flex flex-col gap-0.5">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const done = n < attempt.currentStep
          const current = n === viewStep
          const future = n > attempt.currentStep
          const score = mode === 'practice' ? scoreFor(n) : undefined
          return (
            <button
              key={n}
              type="button"
              disabled={future}
              onClick={() => onSelect(n)}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-[7px] border-none bg-transparent px-2.5 py-[7px] text-left disabled:cursor-default"
              style={{
                background: current ? `color-mix(in srgb, ${accent} 10%, transparent)` : undefined,
                color: future ? 'var(--c-faint)' : 'var(--c-ink)',
              }}
            >
              {done ? (
                <svg width="16" height="16" viewBox="0 0 16 16" className="flex-none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" fill={accent} />
                  <path
                    d="M4.8 8.2l2.1 2.1 4-4.4"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : current ? (
                <span
                  className="grid size-4 flex-none place-items-center rounded-full border-2"
                  style={{ borderColor: accent }}
                >
                  <span className="size-1.5 rounded-full" style={{ background: accent }} />
                </span>
              ) : (
                <span className="grid size-4 flex-none place-items-center rounded-full border-[1.5px] border-ink/20 font-mono text-[8px] font-medium text-faint">
                  {n}
                </span>
              )}
              <span
                className={`flex-1 truncate text-[12.5px] ${current ? 'font-semibold' : 'font-medium'}`}
              >
                {n}. {label}
              </span>
              {score !== undefined && (
                <span
                  className="font-mono text-[10px] font-semibold"
                  style={{
                    color:
                      score === 2 ? 'var(--c-ok-text)' : score === 1 ? 'var(--c-warn)' : 'var(--c-err)',
                  }}
                >
                  {score}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {mode === 'guided' && (
        <div className="mx-2.5 mt-4 rounded-[8px] bg-guided/6 px-3 py-2.5 text-[11.5px] leading-[1.5] text-guided">
          Guided mode: model answers are shown as you go. Nothing is scored — read, absorb, move on.
        </div>
      )}
    </nav>
  )
}
