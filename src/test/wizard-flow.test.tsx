import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { WizardPage } from '../pages/WizardPage'
import { getAppState, reloadFromStorage, setFreeLearn } from '../state/appState'
import { draftFor, newAttempt, saveState, type Attempt } from '../lib/store'

vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="editor-mock" />,
}))

function renderWizard(problemId: string) {
  return render(
    <MemoryRouter initialEntries={[`/problem/${problemId}`]}>
      <Routes>
        <Route path="/" element={<div>roadmap</div>} />
        <Route path="/problem/:problemId" element={<WizardPage />} />
        <Route path="/topic/:topicId" element={<div>topic page</div>} />
        <Route path="/patterns" element={<div>patterns page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

function seedDraft(attempt: Attempt) {
  saveState({ version: 1, attempts: [attempt] })
  reloadFromStorage()
}

beforeEach(() => {
  localStorage.clear()
  reloadFromStorage()
})

describe('practice mode wizard flow', () => {
  it('blocks advance until the answer is typed, revealed, and scored', async () => {
    const user = userEvent.setup()
    renderWizard('two-sum')

    // Step 1: read the problem.
    expect(screen.getByText('STEP 1 OF 10')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /I've read it/ }))

    // Step 2: no reveal without an answer.
    expect(screen.getByText('STEP 2 OF 10')).toBeInTheDocument()
    const reveal = screen.getByRole('button', { name: /Reveal model answer/ })
    expect(reveal).toBeDisabled()
    expect(screen.queryByText('MODEL ANSWER')).not.toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(/Type your answer/), 'array in, indices out')
    expect(reveal).toBeEnabled()
    await user.click(reveal)

    // Model answer + rubric now visible; advance still blocked until scored.
    expect(screen.getByText('MODEL ANSWER')).toBeInTheDocument()
    expect(screen.getByText(/RUBRIC/)).toBeInTheDocument()
    const next = screen.getByRole('button', { name: /Next step/ })
    expect(next).toBeDisabled()

    await user.click(screen.getByRole('button', { name: '1' }))
    expect(next).toBeEnabled()
    await user.click(next)
    expect(screen.getByText('STEP 3 OF 10')).toBeInTheDocument()
  })

  it('lets the user go back to review an earlier step whose answer stays locked', async () => {
    const user = userEvent.setup()
    renderWizard('two-sum')
    await user.click(screen.getByRole('button', { name: /I've read it/ }))
    await user.type(screen.getByPlaceholderText(/Type your answer/), 'step two answer')
    await user.click(screen.getByRole('button', { name: /Reveal model answer/ }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: /Next step/ }))
    expect(screen.getByText('STEP 3 OF 10')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('STEP 2 OF 10')).toBeInTheDocument()
    // The scored answer is shown committed — no textarea to edit it.
    expect(screen.getByText('step two answer')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/Type your answer/)).not.toBeInTheDocument()
  })

  it('locks the committed answer after reveal', async () => {
    const user = userEvent.setup()
    renderWizard('two-sum')
    await user.click(screen.getByRole('button', { name: /I've read it/ }))
    await user.type(screen.getByPlaceholderText(/Type your answer/), 'my committed answer')
    await user.click(screen.getByRole('button', { name: /Reveal model answer/ }))
    expect(screen.queryByPlaceholderText(/Type your answer/)).not.toBeInTheDocument()
    expect(screen.getByText('my committed answer')).toBeInTheDocument()
    expect(screen.getByText(/editing locked after reveal/)).toBeInTheDocument()
  })
})

describe('guided mode wizard flow', () => {
  it('shows the model answer and teaching note immediately with no scoring, never blocking', async () => {
    const user = userEvent.setup()
    renderWizard('group-anagrams')

    await user.click(screen.getByRole('button', { name: /I've read it/ }))
    expect(screen.getByText('STEP 2 OF 10')).toBeInTheDocument()
    expect(screen.getByText('MODEL ANSWER')).toBeInTheDocument()
    expect(screen.getByText('TEACHING NOTE')).toBeInTheDocument()
    expect(screen.queryByText('Score yourself')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Reveal/ })).not.toBeInTheDocument()

    const next = screen.getByRole('button', { name: /Next step/ })
    expect(next).toBeEnabled()
    await user.click(next)
    expect(screen.getByText('STEP 3 OF 10')).toBeInTheDocument()
  })
})

describe('pattern picker auto-grading (step 6)', () => {
  function draftAtStep6(problemId: string): Attempt {
    const attempt = newAttempt(problemId, 'practice')
    return {
      ...attempt,
      currentStep: 6,
      answers: { 2: 'a', 3: 'b', 4: 'c', 5: 'd' },
      revealed: [2, 3, 4, 5],
      stepScores: [
        { step: 2, score: 2, elapsedSec: 5 },
        { step: 3, score: 2, elapsedSec: 5 },
        { step: 4, score: 2, elapsedSec: 5 },
        { step: 5, score: 2, elapsedSec: 5 },
      ],
    }
  }

  async function pickAndReveal(pattern: string) {
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText(/Type your answer/), 'the waste sentence')
    await user.selectOptions(screen.getByRole('combobox'), pattern)
    await user.click(screen.getByRole('button', { name: /Reveal model answer/ }))
  }

  it('marks the primary pattern correct', async () => {
    seedDraft(draftAtStep6('top-k-frequent-elements'))
    renderWizard('top-k-frequent-elements')
    expect(screen.getByText('STEP 6 OF 10')).toBeInTheDocument()
    await pickAndReveal('freq-map')
    expect(screen.getByText('✓ correct')).toBeInTheDocument()
  })

  it('marks a secondary accepted pattern as an acceptable alternative', async () => {
    seedDraft(draftAtStep6('top-k-frequent-elements'))
    renderWizard('top-k-frequent-elements')
    await pickAndReveal('heap')
    expect(screen.getByText('✓ acceptable alternative')).toBeInTheDocument()
  })

  it('marks a wrong pattern and names the expected ones', async () => {
    seedDraft(draftAtStep6('top-k-frequent-elements'))
    renderWizard('top-k-frequent-elements')
    await pickAndReveal('binary-search')
    expect(screen.getByText('✕ not the pattern')).toBeInTheDocument()
    expect(screen.getByText(/expected Freq Map or Heap/)).toBeInTheDocument()
  })
})

describe('locks, back, and short visits', () => {
  it('sends locked-topic URLs back to the roadmap', () => {
    renderWizard('valid-palindrome')
    expect(screen.getByText('roadmap')).toBeInTheDocument()
  })

  it('opens a locked-topic problem after unlock-all', () => {
    setFreeLearn(true)
    renderWizard('valid-palindrome')
    expect(screen.getByText('STEP 1 OF 10')).toBeInTheDocument()
  })

  it('goes back from the code step to step 8', async () => {
    const user = userEvent.setup()
    const attempt = newAttempt('two-sum', 'practice')
    seedDraft({
      ...attempt,
      currentStep: 9,
      totalSec: 200,
      answers: { 2: 'a', 3: 'b', 4: 'c', 5: 'd', 6: 'e', 7: 'plan', 8: 'script' },
      revealed: [2, 3, 4, 5, 6, 7, 8],
      patternPick: { pattern: 'hash-map', verdict: 'correct' },
      stepScores: [2, 3, 4, 5, 6, 7, 8].map((step) => ({ step, score: 2 as const, elapsedSec: 10 })),
    })
    renderWizard('two-sum')
    expect(screen.getByTestId('editor-mock')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '← Back' }))
    expect(screen.getByText('STEP 8 OF 10')).toBeInTheDocument()
  })

  it('does not keep a resume draft if the visit is under 3 minutes', () => {
    const { unmount } = renderWizard('two-sum')
    expect(screen.getByText('STEP 1 OF 10')).toBeInTheDocument()
    unmount()
    expect(draftFor(getAppState(), 'two-sum')).toBeUndefined()
  })
})
