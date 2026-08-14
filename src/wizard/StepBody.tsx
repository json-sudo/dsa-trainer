import { useEffect } from 'react'
import type { Problem, StepContent, PatternId } from '../data/types'
import { patterns, patternName } from '../data/patterns'
import type { SelfScore, PatternVerdict } from '../lib/grading'
import type { Attempt } from '../lib/store'
import { Markdown } from './Markdown'
import { PatternFeedback } from './PatternFeedback'

const STEP_META: Record<number, { key: keyof Problem['steps'] | null; title: string; hint: string }> = {
  1: {
    key: null,
    title: 'Read the problem',
    hint: 'Read the statement, the examples, and every constraint line. Out loud if you can — this is the interview.',
  },
  2: {
    key: 'inputsOutputs',
    title: 'State the inputs & outputs',
    hint: 'What data structures come in, what exactly must come out? Arrays? Strings? Indices or values?',
  },
  3: {
    key: 'whatToFind',
    title: 'What must be found?',
    hint: 'Existence, count, group, shortest, max/min, rearrange, or construct — name the category.',
  },
  4: {
    key: 'constraintsHint',
    title: 'Constraints → complexity budget',
    hint: 'What do the bounds imply? n ≤ 10⁵ means O(n) or O(n log n). Note any structural hints (sorted, lowercase, unique).',
  },
  5: {
    key: 'bruteForce',
    title: 'Describe the brute force',
    hint: 'Say it as you would to an interviewer: the approach in one or two sentences, then its time and space complexity.',
  },
  6: {
    key: 'wasteAndPattern',
    title: 'What does brute force waste? → pick the pattern',
    hint: 'Name the wasted work in a sentence — the waste names the pattern. Then pick the pattern from the list.',
  },
  7: {
    key: 'algorithm',
    title: 'Design the algorithm',
    hint: 'Plain language or pseudocode: apply the pattern to this problem’s data shape, and state the target complexity.',
  },
  8: {
    key: 'interviewScript',
    title: 'Write your interview script',
    hint: '3–5 sentences you’d say before coding: "Brute force would be ___, that’s slow because ___, this looks like ___ because ___, I’ll use ___, complexity ___." Say it out loud.',
  },
}

export function StepBody({
  problem,
  attempt,
  step,
  update,
  onNext,
  onBack,
}: {
  problem: Problem
  attempt: Attempt
  step: number
  update: (patch: Partial<Attempt> | ((a: Attempt) => Attempt)) => void
  onNext: () => void
  onBack?: () => void
}) {
  const meta = STEP_META[step]
  const isPractice = problem.mode === 'practice'
  const accent = isPractice ? 'var(--c-accent-practice)' : 'var(--c-accent-guided)'
  const content: StepContent | undefined = meta.key ? problem.steps[meta.key] : undefined
  const revealed = attempt.revealed.includes(step)
  const answer = attempt.answers[step] ?? ''
  const score = attempt.stepScores.find((s) => s.step === step)?.score
  const isPatternStep = step === 6
  const pick = attempt.patternPick

  const canReveal = answer.trim().length > 0 && (!isPatternStep || !!pick?.pattern)
  const canAdvance = !isPractice || step === 1 || (revealed && score !== undefined)

  const reveal = () => {
    if (!canReveal || revealed) return
    update((prev) => {
      let patternPick = prev.patternPick
      if (isPatternStep && patternPick) {
        const accepted = problem.steps.wasteAndPattern.acceptedPatterns
        const verdict: PatternVerdict =
          patternPick.pattern === accepted[0]
            ? 'correct'
            : accepted.includes(patternPick.pattern as PatternId)
              ? 'alternate'
              : 'wrong'
        patternPick = { ...patternPick, verdict }
      }
      return { ...prev, revealed: [...prev.revealed, step], patternPick }
    })
  }

  const setScore = (value: SelfScore) => {
    update((prev) => ({
      ...prev,
      stepScores: [
        ...prev.stepScores.filter((s) => s.step !== step),
        { step, score: value, elapsedSec: prev.stepSeconds[step] ?? 0 },
      ],
    }))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return
      if (isPractice && step > 1 && !revealed) {
        if (canReveal) reveal()
      } else if (canAdvance) {
        onNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <>
      <div className="font-mono text-[11px] font-semibold tracking-[1.2px]" style={{ color: accent }}>
        STEP {step} OF 10
      </div>
      <h1 className="mb-1.5 mt-2 text-[22px] font-semibold leading-[1.3]">{meta.title}</h1>
      <p className="mb-6 mt-0 text-[13.5px] text-muted">{meta.hint}</p>

      {step === 1 && (
        <div className="mb-5 rounded-[10px] border border-ink/14 bg-surface px-[18px] py-4 text-sm leading-[1.65] text-ink-2">
          <Markdown text={problem.statement} />
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              className="mt-3 rounded-[8px] border border-ink/8 bg-bg px-3.5 py-3 font-mono text-xs leading-[1.7]"
            >
              <div>
                <span className="text-faint">Input:</span> {ex.input}
              </div>
              <div>
                <span className="text-faint">Output:</span> {ex.output}
              </div>
              {ex.explanation && <div className="mt-1.5 text-faint"># {ex.explanation}</div>}
            </div>
          ))}
          <div className="kicker mb-2 mt-4 text-faint">CONSTRAINTS</div>
          <div className="font-mono text-xs leading-[1.9] text-ink-3">
            {problem.constraints.map((c, i) => (
              <div key={i}>{c}</div>
            ))}
          </div>
        </div>
      )}

      {step > 1 && isPractice && (
        <div className="mb-4 rounded-[10px] border border-ink/14 bg-surface px-[18px] py-4">
          <div className="mb-2.5 flex items-baseline gap-2">
            <div className="kicker text-faint">YOUR ANSWER</div>
            {revealed && (
              <div className="ml-auto text-[11.5px] text-faint">committed — editing locked after reveal</div>
            )}
          </div>
          {revealed ? (
            <div className="text-sm leading-[1.6] text-ink-2">{answer}</div>
          ) : (
            <textarea
              value={answer}
              autoFocus
              onChange={(e) => update((prev) => ({ ...prev, answers: { ...prev.answers, [step]: e.target.value } }))}
              placeholder="Type your answer before revealing the model…"
              rows={4}
              className="w-full resize-y rounded-[8px] border border-ink/14 bg-bg p-3 font-sans text-sm leading-[1.6] text-ink outline-offset-2"
            />
          )}
          {isPatternStep && (
            <div className="mt-3 border-t border-ink/8 pt-3">
              <div className="kicker mb-2 text-faint">PATTERN</div>
              {revealed ? (
                <PatternFeedback problem={problem} pick={pick} />
              ) : (
                <select
                  value={pick?.pattern ?? ''}
                  onChange={(e) =>
                    update((prev) => ({
                      ...prev,
                      patternPick: { pattern: e.target.value, verdict: 'wrong' },
                    }))
                  }
                  className="h-9 w-64 rounded-[7px] border border-ink/20 bg-surface px-2 text-[13px] text-ink"
                >
                  <option value="" disabled>
                    Select a pattern…
                  </option>
                  {patterns.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      )}

      {step > 1 && isPractice && !revealed && (
        <div className="flex items-center gap-3">
          <button type="button" onClick={reveal} disabled={!canReveal} className="primary-btn" style={{ background: accent }}>
            Reveal model answer <span className="font-mono text-[11px] font-medium opacity-75">⏎</span>
          </button>
          {onBack && (
            <button type="button" onClick={onBack} className="ghost-btn h-9">
              Back
            </button>
          )}
          {!canReveal && (
            <span className="text-xs text-faint">
              {isPatternStep ? 'Type your waste sentence and pick a pattern first.' : 'Type an answer first.'}
            </span>
          )}
        </div>
      )}

      {content && (revealed || !isPractice) && (
        <>
          <div
            className="mb-4 rounded-[10px] px-[18px] py-4"
            style={{
              background: isPractice ? `color-mix(in srgb, ${accent} 5%, transparent)` : 'var(--c-surface)',
              border: `1px solid color-mix(in srgb, ${accent} ${isPractice ? '30' : '35'}%, transparent)`,
            }}
          >
            <div className="kicker mb-2.5" style={{ color: accent }}>
              MODEL ANSWER
            </div>
            <div className="text-sm leading-[1.6] text-ink-2">
              <Markdown text={content.modelAnswer} />
            </div>
            {isPatternStep && (
              <div className="mt-2.5 font-mono text-xs font-medium" style={{ color: accent }}>
                pattern: {problem.steps.wasteAndPattern.acceptedPatterns.map(patternName).join(' or ')}
              </div>
            )}
          </div>

          {!isPractice && content.teachingNote && (
            <div className="mb-4 rounded-[10px] border border-guided/25 bg-guided/5 px-[18px] py-4">
              <div className="kicker mb-2.5 text-guided">TEACHING NOTE</div>
              <div className="text-[13.5px] leading-[1.65] text-ink-2">
                <Markdown text={content.teachingNote} />
              </div>
            </div>
          )}

          {isPractice && (
            <div className="mb-5 rounded-[10px] border border-ink/14 bg-surface px-[18px] py-4">
              <div className="kicker mb-3 text-faint">RUBRIC — SCORE 2 IF ALL, 1 IF MOST</div>
              <div className="flex flex-col gap-[9px] text-[13.5px] text-ink-2">
                {content.rubric.map((r, i) => (
                  <div key={i} className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[11px] font-semibold text-ok">✓</span>
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {(step === 1 || !isPractice || revealed) && (
        <div className="flex items-center gap-3.5 rounded-[10px] border border-ink/14 bg-surface px-[18px] py-3.5">
          {isPractice && step > 1 && (
            <>
              <div className="text-[13.5px] font-semibold">Score yourself</div>
              <div className="flex gap-2">
                {([0, 1, 2] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setScore(v)}
                    aria-pressed={score === v}
                    className="h-[34px] w-10 cursor-pointer rounded-[7px] border font-mono text-sm font-semibold"
                    style={
                      score === v
                        ? { background: v === 2 ? accent : 'var(--c-ink)', color: '#fff', borderColor: 'transparent' }
                        : { background: 'var(--c-surface)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }
                    }
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="text-xs text-faint">
                {score === undefined
                  ? '0 — missed it / 1 — partial / 2 — nailed it'
                  : ['0 — missed it', '1 — partial', '2 — nailed it'][score]}
              </div>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            {onBack && (
              <button type="button" onClick={onBack} className="ghost-btn h-9">
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              disabled={!canAdvance}
              className="primary-btn"
              style={{ background: accent, opacity: canAdvance ? 1 : 0.5 }}
            >
              {step === 1 ? "I've read it — next" : 'Next step'}{' '}
              <span className="font-mono text-[11px] font-medium opacity-75">⏎</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
