import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { WizardPage } from '../pages/WizardPage'
import { reloadFromStorage, getAppState } from '../state/appState'
import { newAttempt, saveState, type Attempt } from '../lib/store'

vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="editor-mock" />,
}))

function finishedRunDraft(problemId: string): Attempt {
  const attempt = newAttempt(problemId, 'practice')
  return {
    ...attempt,
    currentStep: 10,
    answers: { 2: 'a', 3: 'b', 4: 'c', 5: 'd', 6: 'e', 7: 'plan', 8: 'script' },
    revealed: [2, 3, 4, 5, 6, 7, 8],
    patternPick: { pattern: 'hash-map', verdict: 'correct' },
    stepScores: [2, 3, 4, 5, 6, 7, 8].map((step) => ({ step, score: 1 as const, elapsedSec: 30 })),
    code: 'export function twoSum() {}',
    lastRun: { runNumber: 1, cases: [], durationMs: 100, passed: 3, total: 6 },
    totalSec: 900,
  }
}

function renderWizard(problemId: string) {
  return render(
    <MemoryRouter initialEntries={[`/problem/${problemId}`]}>
      <Routes>
        <Route path="/problem/:problemId" element={<WizardPage />} />
        <Route path="/topic/:topicId" element={<div>topic page</div>} />
        <Route path="/patterns" element={<div>patterns page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  reloadFromStorage()
})

describe('grade screen', () => {
  it('finalizes the attempt with per-step scores and a weighted total', async () => {
    saveState({ version: 1, attempts: [finishedRunDraft('two-sum')] })
    reloadFromStorage()
    renderWizard('two-sum')

    expect(screen.getByText('PER-STEP SCORES')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '← Back' })).not.toBeInTheDocument()
    expect(screen.getByText('WEAKEST STEP')).toBeInTheDocument()
    const finished = getAppState().attempts.find((a) => a.finishedAt)
    expect(finished).toBeDefined()
    expect(finished!.totalScore).toBeGreaterThan(0)
    expect(finished!.grade).toBeDefined()
  })

  it('retry starts a fresh attempt and keeps the old one in history', async () => {
    const user = userEvent.setup()
    saveState({ version: 1, attempts: [finishedRunDraft('two-sum')] })
    reloadFromStorage()
    renderWizard('two-sum')

    await user.click(screen.getByRole('button', { name: 'Retry problem' }))
    expect(screen.getByText('STEP 1 OF 10')).toBeInTheDocument()

    const attempts = getAppState().attempts
    expect(attempts.filter((a) => a.problemId === 'two-sum' && a.finishedAt)).toHaveLength(1)
    expect(attempts.filter((a) => a.problemId === 'two-sum' && !a.finishedAt)).toHaveLength(0)
  })

  it('declining the retry reveals the full model walkthrough with the reference solution', async () => {
    const user = userEvent.setup()
    saveState({ version: 1, attempts: [finishedRunDraft('two-sum')] })
    reloadFromStorage()
    renderWizard('two-sum')

    expect(screen.queryByText('Full review')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show me the model answer' }))
    expect(screen.getByText('Full review')).toBeInTheDocument()
    for (const step of [2, 3, 4, 5, 6, 7, 8]) {
      expect(screen.getByText(`STEP ${step}`)).toBeInTheDocument()
    }

    expect(screen.getByText(/REFERENCE SOLUTION/)).toBeInTheDocument()
    expect(screen.getByText(/const seen = new Map/)).toBeInTheDocument()
  })
})
