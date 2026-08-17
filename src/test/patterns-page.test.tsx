import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { PatternsPage } from '../pages/PatternsPage'
import { patterns } from '../data/patterns'

describe('patterns reference page', () => {
  it('lists every pattern primer with a jump control', () => {
    render(
      <MemoryRouter>
        <PatternsPage />
      </MemoryRouter>,
    )
    expect(patterns.length).toBe(21)
    for (const p of patterns) {
      expect(screen.getByRole('button', { name: p.name })).toBeInTheDocument()
      const card = document.getElementById(`p-${p.id}`)
      expect(card).not.toBeNull()
      expect(card!.textContent).toContain(p.when)
      expect(card!.textContent).toContain(p.firstMove)
      expect(card!.textContent).toContain(p.complexity)
      expect(card!.querySelector('pre code')).not.toBeNull()
      expect(card!.querySelector('pre code')!.textContent).toBe(p.codeTemplate)
    }
  })

  it('scrolls to the pattern card without changing the hash route', async () => {
    const user = userEvent.setup()
    const scrollIntoView = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView

    render(
      <MemoryRouter initialEntries={['/patterns']}>
        <PatternsPage />
      </MemoryRouter>,
    )

    const target = patterns[0]
    await user.click(screen.getByRole('button', { name: target.name }))
    expect(scrollIntoView).toHaveBeenCalled()
    expect(document.getElementById(`p-${target.id}`)).not.toBeNull()
  })

  it('does not treat a jump click as a HashRouter navigation', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/#/patterns')
    render(
      <HashRouter>
        <Routes>
          <Route path="/" element={<div>roadmap</div>} />
          <Route path="/patterns" element={<PatternsPage />} />
        </Routes>
      </HashRouter>,
    )
    expect(screen.getByText('JUMP TO')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: patterns[0].name }))
    expect(window.location.hash).toMatch(/patterns/)
    expect(screen.queryByText('roadmap')).not.toBeInTheDocument()
    expect(screen.getByText('JUMP TO')).toBeInTheDocument()
  })
})
