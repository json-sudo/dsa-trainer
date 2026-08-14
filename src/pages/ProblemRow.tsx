import { useNavigate } from 'react-router-dom'
import { DifficultyBadge } from '../components/GradeChip'
import { attemptsFor, bestGrade, draftFor } from '../lib/store'
import { useAppState } from '../state/appState'
import type { AnyProblem } from '../data/types'
import { gradeTextColor } from './TopicPage'

export function ProblemRow({ problem }: { problem: AnyProblem }) {
  const state = useAppState()
  const navigate = useNavigate()

  if (!problem.authored) {
    return (
      <div className="flex items-center gap-3.5 rounded-[10px] border border-dashed border-ink/18 bg-sunken px-[18px] py-[13px] text-faint">
        {problem.mode === 'guided' && (
          <span className="rounded-[4px] bg-ink/6 px-[7px] py-[3px] font-mono text-[9.5px] font-semibold tracking-[.8px]">
            GUIDED
          </span>
        )}
        <span className="text-sm font-semibold">{problem.title}</span>
        <span className="ml-auto rounded-[5px] border border-ink/15 px-2 py-[3px] font-mono text-[11px] font-medium">
          Not yet authored
        </span>
      </div>
    )
  }

  const attempts = attemptsFor(state, problem.id)
  const best = bestGrade(state, problem.id)
  const draft = draftFor(state, problem.id)
  const isGuided = problem.mode === 'guided'

  const border = draft
    ? 'border-practice/45'
    : isGuided
      ? 'border-guided/35 border-l-[3px] border-l-guided'
      : 'border-ink/14'

  return (
    <button
      type="button"
      onClick={() => navigate(`/problem/${problem.id}`)}
      className={`flex w-full cursor-pointer items-center gap-3.5 rounded-[10px] border bg-surface px-[18px] py-[13px] text-left text-ink hover:shadow-[0_3px_12px_rgba(28,27,24,.09)] ${border} ${
        isGuided ? '' : 'hover:border-practice'
      }`}
    >
      {isGuided && (
        <span className="rounded-[4px] bg-guided/10 px-[7px] py-[3px] font-mono text-[9.5px] font-semibold tracking-[.8px] text-guided">
          GUIDED
        </span>
      )}
      <span className="text-sm font-semibold">{problem.title}</span>
      <DifficultyBadge difficulty={problem.difficulty} />
      {draft && (
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-practice">
          <span className="size-1.5 rounded-full bg-practice" />
          draft · step {draft.currentStep} of 10
        </span>
      )}
      <span className="ml-auto flex items-center gap-3">
        {attempts.length > 0 ? (
          <span className="font-mono text-xs font-medium text-muted">
            {attempts.length} attempt{attempts.length === 1 ? '' : 's'}
            {best && (
              <>
                {' · best '}
                <span className="font-semibold" style={{ color: gradeTextColor(best) }}>
                  {best}
                </span>
              </>
            )}
          </span>
        ) : (
          <span className="font-mono text-xs font-medium text-faint">not attempted</span>
        )}
        {draft && (
          <span className="rounded-[7px] bg-practice px-3 py-1.5 text-xs font-semibold text-white">Resume</span>
        )}
      </span>
    </button>
  )
}
