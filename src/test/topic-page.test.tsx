import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TopicPage } from '../pages/TopicPage'
import { reloadFromStorage, setFreeLearn } from '../state/appState'

beforeEach(() => {
  localStorage.clear()
  reloadFromStorage()
})

function renderTopic(topicId: string) {
  return render(
    <MemoryRouter initialEntries={[`/topic/${topicId}`]}>
      <Routes>
        <Route path="/" element={<div>roadmap</div>} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('topic route locks', () => {
  it('sends a locked topic URL back to the roadmap', () => {
    renderTopic('two-pointers')
    expect(screen.getByText('roadmap')).toBeInTheDocument()
  })

  it('opens the topic after unlock-all', () => {
    setFreeLearn(true)
    renderTopic('two-pointers')
    expect(screen.getByRole('heading', { name: 'Two Pointers' })).toBeInTheDocument()
  })

  it('always opens the root topic', () => {
    renderTopic('arrays-hashing')
    expect(screen.getByRole('heading', { name: 'Arrays & Hashing' })).toBeInTheDocument()
  })
})
