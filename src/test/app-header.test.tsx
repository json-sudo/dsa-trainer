import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { reloadFromStorage, setTheme } from '../state/appState'

beforeEach(() => {
  localStorage.clear()
  reloadFromStorage()
})

afterEach(() => {
  setTheme('light')
  localStorage.clear()
  reloadFromStorage()
})

describe('AppHeader theme toggle', () => {
  it('shows the moon icon in light mode, not [object Object]', () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    )
    const toggle = screen.getByRole('button', { name: 'Switch to dark theme' })
    expect(toggle).toBeInTheDocument()
    expect(toggle.textContent).not.toMatch(/\[object Object\]/)
    expect(toggle.querySelector('svg')).not.toBeNull()
  })

  it('shows a sun glyph after switching to dark mode', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    const toggle = screen.getByRole('button', { name: 'Switch to light theme' })
    expect(toggle.textContent).toContain('☀')
    expect(toggle.textContent).not.toMatch(/\[object Object\]/)
  })

  it('round-trips theme through setTheme', () => {
    setTheme('dark')
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })
})
