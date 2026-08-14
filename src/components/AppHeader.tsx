import { Link, NavLink } from 'react-router-dom'
import { useAppState, useSettings, setTheme } from '../state/appState'
import { averageScore, finishedAttempts } from '../lib/store'
import { gradeBand } from '../lib/grading'
import DarkThemeIcon from '../assets/dark.icon'

const navLinkClass =
  'px-3 py-1.5 rounded-[6px] text-[13px] font-medium text-ink-3 hover:bg-ink/6 hover:text-ink no-underline'

export function AppHeader({ subtitle }: { subtitle?: string }) {
  const state = useAppState()
  const settings = useSettings()
  const solved = new Set(finishedAttempts(state).map((a) => a.problemId)).size
  const avg = averageScore(state)

  return (
    <header className="flex h-[52px] flex-none items-center gap-6 border-b border-line bg-surface px-7">
      <Link to="/" className="flex items-center gap-2.5 text-ink no-underline">
        <div className="grid size-[22px] place-items-center rounded-[6px] bg-ink font-mono text-[11px] font-semibold text-bg">
          D
        </div>
        <div className="text-sm font-semibold">DSA Trainer</div>
      </Link>
      {subtitle ? (
        <div className="text-[13.5px] font-semibold text-ink-3">{subtitle}</div>
      ) : (
        <div className="ml-3 flex items-center gap-[18px] font-mono text-xs font-medium text-muted">
          <span>
            <span className="text-ink">{solved}</span> problems
          </span>
          <span className="text-ink/20">·</span>
          <span>
            avg <span className="text-ink">{avg === undefined ? '—' : gradeBand(avg)}</span>
          </span>
        </div>
      )}
      <nav className="ml-auto flex items-center gap-1">
        <NavLink to="/patterns" className={navLinkClass}>
          Patterns
        </NavLink>
        <NavLink to="/progress" className={navLinkClass}>
          Progress
        </NavLink>
        <button
          type="button"
          onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
          className={`${navLinkClass} cursor-pointer border-none bg-transparent`}
          aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {settings.theme === 'dark' ? '☀ Light' : `${<DarkThemeIcon />} Dark`}
        </button>
      </nav>
    </header>
  )
}
