import { AppHeader } from '../components/AppHeader'
import { patterns } from '../data/patterns'

export function PatternsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="sticky top-0 z-20">
        <AppHeader subtitle="Patterns reference" />
      </div>
      <div className="mx-auto flex max-w-[1180px] items-start gap-9 px-8 pb-24 pt-7">
        <nav className="sticky top-[76px] max-h-[calc(100vh-100px)] w-[210px] flex-none overflow-y-auto">
          <div className="kicker mb-2 text-[10px] tracking-[1.2px] text-faint">JUMP TO</div>
          <div className="flex flex-col gap-px">
            {patterns.map((p) => (
              <a
                key={p.id}
                href={`#p-${p.id}`}
                className="rounded-[6px] px-2.5 py-[5px] text-[12.5px] font-medium text-ink-3 no-underline hover:bg-ink/6 hover:text-ink"
              >
                {p.name}
              </a>
            ))}
          </div>
        </nav>
        <div className="grid flex-1 grid-cols-2 gap-3.5">
          {patterns.map((p) => (
            <div
              key={p.id}
              id={`p-${p.id}`}
              className="scroll-mt-[76px] rounded-[10px] border border-ink/13 bg-surface px-[18px] py-4"
            >
              <div className="mb-[11px] flex items-baseline gap-2.5">
                <div className="text-[14.5px] font-semibold">{p.name}</div>
                <div className="ml-auto font-mono text-[11px] font-medium text-guided">{p.complexity}</div>
              </div>
              <div className="flex flex-col gap-2 text-[12.5px] leading-[1.55] text-ink-2">
                <div>
                  <span className="kicker mr-1.5 text-[9.5px] tracking-[.8px] text-faint">WHEN</span>
                  {p.when}
                </div>
                <div>
                  <span className="kicker mr-1.5 text-[9.5px] tracking-[.8px] text-faint">FIRST MOVE</span>
                  {p.firstMove}
                </div>
                <div>
                  <span className="kicker mr-1.5 text-[9.5px] tracking-[.8px] text-faint">TELLS</span>
                  <span className="italic text-muted">{p.tells.map((t) => `“${t}”`).join(', ')}</span>
                </div>
                <div>
                  <div className="kicker mb-1.5 text-[9.5px] tracking-[.8px] text-faint">TEMPLATE</div>
                  <pre className="m-0 overflow-x-auto rounded-[8px] border border-ink/8 bg-bg px-3 py-2.5 font-mono text-[11px] leading-[1.7] text-ink-2">
                    <code>{p.codeTemplate}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
