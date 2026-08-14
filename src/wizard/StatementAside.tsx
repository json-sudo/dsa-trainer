import { useState } from 'react'
import type { Problem } from '../data/types'
import { Markdown } from './Markdown'

export function StatementAside({ problem }: { problem: Problem }) {
  const [open, setOpen] = useState(true)
  return (
    <aside className="w-[356px] flex-none overflow-y-auto border-l border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-2 border-x-0 border-b border-t-0 border-solid border-ink/8 bg-transparent px-[18px] py-[13px] text-left hover:bg-ink/3"
      >
        <span className="kicker text-faint">PROBLEM STATEMENT</span>
        <span className="ml-auto text-[11px] text-faint">{open ? '▾ collapse' : '▸ expand'}</span>
      </button>
      {open && (
        <div className="px-[18px] py-4 text-[13px] leading-[1.65] text-ink-2">
          <div className="mb-2 text-sm font-semibold text-ink">{problem.title}</div>
          <div className="mb-3">
            <Markdown text={problem.statement} />
          </div>
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              className="mb-3 rounded-[8px] border border-ink/8 bg-bg px-3.5 py-3 font-mono text-xs leading-[1.7]"
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
          <div className="kicker mb-2 text-faint">CONSTRAINTS</div>
          <div className="font-mono text-xs leading-[1.9] text-ink-3">
            {problem.constraints.map((c, i) => (
              <div key={i}>{c}</div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
