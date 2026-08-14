import { Link } from 'react-router-dom'
import type { Problem } from '../data/types'
import { formatClock, STEP_LABELS } from '../lib/grading'
import { topicById } from '../data/roadmap'
import type { Attempt } from '../lib/store'
import { useSettings, setTheme } from '../state/appState'
import { DifficultyBadge } from '../components/GradeChip'
import DarkThemeIcon from '../assets/dark.icon'

export function WizardHeader({ problem, attempt, viewStep }: { problem: Problem; attempt: Attempt; viewStep: number }) {
  const isPractice = problem.mode === 'practice'
  const accent = isPractice ? 'var(--c-accent-practice)' : 'var(--c-accent-guided)'
  const settings = useSettings()

  return (
    <header className="flex h-[52px] flex-none items-center gap-4 border-b border-line bg-surface px-5">
      <Link
        to={`/topic/${problem.topicId}`}
        className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-[13px] font-medium text-ink-3 no-underline hover:bg-ink/6 hover:text-ink"
      >
        ← {topicById[problem.topicId].name}
      </Link>
      <div className="h-5 w-px bg-ink/12" />
      <div className="text-sm font-semibold">{problem.title}</div>
      <DifficultyBadge difficulty={problem.difficulty} />
      <span
        className="rounded-[5px] border px-2 py-[3px] font-mono text-[10.5px] font-semibold tracking-[.8px]"
        style={{
          color: accent,
          borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
        }}
      >
        {problem.mode.toUpperCase()}
      </span>
      {viewStep >= 9 && (
        <span className="ml-2 font-mono text-[11px] font-semibold tracking-[1px]" style={{ color: accent }}>
          STEP {viewStep} OF 10 — {STEP_LABELS[viewStep - 1].toUpperCase()}
        </span>
      )}
      <div className="ml-auto flex items-center gap-4">
        <div className="font-mono text-xs font-medium text-muted">
          {isPractice && (
            <>
              step <span className="text-ink">{formatClock(attempt.stepSeconds[viewStep] ?? 0)}</span> ·{' '}
            </>
          )}
          total <span className="text-ink">{formatClock(attempt.totalSec)}</span>
        </div>
        <Link
          to="/patterns"
          className="rounded-[6px] px-3 py-1.5 text-[13px] font-medium text-ink-3 no-underline hover:bg-ink/6 hover:text-ink"
        >
          Patterns
        </Link>
        <button
          type="button"
          onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className="cursor-pointer rounded-[6px] border-none bg-transparent px-2 py-1.5 text-[13px] font-medium text-ink-3 hover:bg-ink/6 hover:text-ink"
        >
          {settings.theme === 'dark' ? '☀' : <DarkThemeIcon />}
        </button>
      </div>
    </header>
  )
}
