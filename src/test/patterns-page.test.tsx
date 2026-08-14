import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PatternsPage } from '../pages/PatternsPage'
import { patterns } from '../data/patterns'

describe('patterns reference page', () => {
  it('lists every pattern primer with a jump link', () => {
    render(
      <MemoryRouter>
        <PatternsPage />
      </MemoryRouter>,
    )
    expect(patterns.length).toBe(21)
    for (const p of patterns) {
      // Jump link in the sidebar…
      const link = screen.getByRole('link', { name: p.name })
      expect(link).toHaveAttribute('href', `#p-${p.id}`)
      // …and a card with the primer fields.
      const card = document.getElementById(`p-${p.id}`)
      expect(card).not.toBeNull()
      expect(card!.textContent).toContain(p.when)
      expect(card!.textContent).toContain(p.firstMove)
      expect(card!.textContent).toContain(p.complexity)
      // The generic code template renders as a read-only block.
      expect(card!.querySelector('pre code')).not.toBeNull()
      expect(card!.querySelector('pre code')!.textContent).toBe(p.codeTemplate)
    }
  })
})
