import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { problemById } from '../data'
import { topicById } from '../data/roadmap'
import type { Problem } from '../data/types'
import { canAccessTopic } from '../lib/locks'
import { draftFor, newAttempt, PERSIST_INTERVAL_MS, type Attempt } from '../lib/store'
import { flushAttempt, getAppState, useAppState, useSettings } from '../state/appState'
import { StatementAside } from '../wizard/StatementAside'
import { StepRail } from '../wizard/StepRail'
import { StepBody } from '../wizard/StepBody'
import { CodeStep } from '../wizard/CodeStep'
import { GradeScreen } from '../wizard/GradeScreen'
import { WizardHeader } from '../wizard/WizardHeader'

export function WizardPage() {
  const { problemId } = useParams()
  const settings = useSettings()
  const state = useAppState()
  const problem = problemId ? problemById[problemId] : undefined
  if (!problem || !problem.authored) return <Navigate to="/" replace />
  const topic = topicById[problem.topicId]
  if (topic && !canAccessTopic(topic, state, settings.freeLearn)) return <Navigate to="/" replace />
  return <Wizard problem={problem} />
}

function Wizard({ problem }: { problem: Problem }) {
  const [attempt, setAttempt] = useState<Attempt>(() => {
    const draft = draftFor(getAppState(), problem.id)
    return draft ?? newAttempt(problem.id, problem.mode)
  })

  const [viewStep, setViewStep] = useState(attempt.currentStep)
  const attemptRef = useRef(attempt)
  attemptRef.current = attempt

  const update = useCallback((patch: Partial<Attempt> | ((a: Attempt) => Attempt)) => {
    setAttempt((prev) => (typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }))
  }, [])

  const flush = useCallback(() => {
    flushAttempt(attemptRef.current)
  }, [])

  useEffect(() => {
    if (attempt.finishedAt) flush()
  }, [attempt.finishedAt, flush])

  useEffect(() => {
    const interval = setInterval(flush, PERSIST_INTERVAL_MS)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', flush)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [flush])

  useEffect(() => {
    const interval = setInterval(() => {
      const a = attemptRef.current
      if (a.finishedAt) return
      update((prev) => ({
        ...prev,
        totalSec: prev.totalSec + 1,
        stepSeconds: {
          ...prev.stepSeconds,
          [prev.currentStep]: (prev.stepSeconds[prev.currentStep] ?? 0) + 1,
        },
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [update])

  const goToStep = useCallback(
    (step: number) => {
      setViewStep(step)
      update((prev) =>
        step > prev.currentStep && !prev.finishedAt ? { ...prev, currentStep: step } : prev,
      )
    },
    [update],
  )

  const restart = useCallback(() => {
    const fresh = newAttempt(problem.id, problem.mode)
    setAttempt(fresh)
    setViewStep(1)
  }, [problem.id, problem.mode])

  const header = <WizardHeader problem={problem} attempt={attempt} viewStep={viewStep} />

  if (viewStep === 9) {
    return (
      <div className="mx-auto flex h-screen w-full min-w-[1200px] flex-col bg-bg">
        {header}
        <CodeStep
          problem={problem}
          attempt={attempt}
          update={update}
          onSubmit={() => goToStep(10)}
          onBack={() => setViewStep(8)}
        />
      </div>
    )
  }

  if (viewStep === 10) {
    return (
      <div className="min-h-screen min-w-[1200px] bg-bg">
        {header}
        <GradeScreen problem={problem} attempt={attempt} update={update} onRetry={restart} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-screen w-full min-w-[1200px] flex-col bg-bg">
      {header}
      <div className="flex min-h-0 flex-1">
        <StepRail
          mode={problem.mode}
          attempt={attempt}
          viewStep={viewStep}
          onSelect={(s) => setViewStep(s)}
        />
        <main className="flex-1 overflow-y-auto px-10 pb-16 pt-8">
          <div className="mx-auto max-w-[720px]">
            <StepBody
              problem={problem}
              attempt={attempt}
              step={viewStep}
              update={update}
              onNext={() => goToStep(viewStep + 1)}
              onBack={viewStep > 1 ? () => setViewStep(viewStep - 1) : undefined}
            />
          </div>
        </main>
        <StatementAside problem={problem} />
      </div>
    </div>
  )
}
