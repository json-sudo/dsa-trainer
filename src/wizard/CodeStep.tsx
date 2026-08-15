import { useCallback, useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { Problem } from '../data/types'
import { runTests, RUN_TIMEOUT_MS } from '../lib/executor'
import type { Attempt } from '../lib/store'
import { useSettings } from '../state/appState'
import { STEP_SHORT_LABELS } from '../lib/grading'
import { Markdown } from './Markdown'

export function CodeStep({
  problem,
  attempt,
  update,
  onSubmit,
  onBack,
}: {
  problem: Problem
  attempt: Attempt
  update: (patch: Partial<Attempt> | ((a: Attempt) => Attempt)) => void
  onSubmit: () => void
  onBack: () => void
}) {
  const settings = useSettings()
  const isGuided = problem.mode === 'guided'

  const [code, setCode] = useState(
    attempt.code ?? (isGuided ? problem.code.referenceSolution : problem.code.signature),
  )
  const [running, setRunning] = useState(false)
  const [compare, setCompare] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(0)
  const [openChunk, setOpenChunk] = useState<number | null>(0)
  const run = attempt.lastRun
  const ran = !!run
  const accent = isGuided ? 'var(--c-accent-guided)' : 'var(--c-accent-practice)'

  const doRun = useCallback(async () => {
    if (running) return
    setRunning(true)
    const result = await runTests({
      userCode: code,
      tests: problem.code.tests,
      signature: problem.code.signature,
      harness: problem.code.harness,
      orderInsensitive: problem.code.orderInsensitive,
      runNumber: (attempt.lastRun?.runNumber ?? 0) + 1,
    })
    update((prev) => ({ ...prev, code, lastRun: result }))
    setRunning(false)
  }, [code, running, problem, attempt.lastRun?.runNumber, update])

  useEffect(() => {
    const t = setTimeout(() => {
      update((prev) => (prev.code === code ? prev : { ...prev, code }))
    }, 800)
    return () => clearTimeout(t)
  }, [code, update])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        void doRun()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doRun])

  const visibleTests = problem.code.tests.filter((t) => !t.hidden || ran)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-none gap-[3px] border-b border-line bg-surface px-5 py-2">
        {STEP_SHORT_LABELS.map((label, i) => (
          <div
            key={label}
            title={label}
            className="h-1 flex-1 rounded-[2px]"
            style={{
              background:
                i < 8 ? accent : i === 8 ? `color-mix(in srgb, ${accent} 45%, transparent)` : 'var(--c-line)',
            }}
          />
        ))}
      </div>
      <div className="flex min-h-0 flex-1">
        <aside className="w-[440px] flex-none overflow-y-auto border-r border-line bg-surface px-5 py-[18px]">
          <div className="kicker mb-2.5 text-faint">PROBLEM STATEMENT</div>
          <p className="mb-3 mt-0 text-[13px] leading-[1.65] text-ink-2">
            <Markdown text={problem.statement} />
          </p>
          {problem.examples.slice(0, 1).map((ex, i) => (
            <div
              key={i}
              className="mb-4 rounded-[8px] border border-ink/8 bg-bg px-3.5 py-3 font-mono text-xs leading-[1.7]"
            >
              <div>
                <span className="text-faint">Input:</span> {ex.input}
              </div>
              <div>
                <span className="text-faint">Output:</span> {ex.output}
              </div>
            </div>
          ))}
          <div className="kicker mb-2 text-faint">STARTER SIGNATURE</div>
          <div className="mb-4 whitespace-prewrap rounded-[8px] border border-ink/8 bg-bg px-3.5 py-3 font-mono text-xs leading-[1.7] text-ink-2">
            {problem.code.signature.split('\n')[0]}
          </div>
          {attempt.answers[7] && (
            <div className="border-t border-ink/8 pt-3.5">
              <div className="kicker mb-2 text-faint">YOUR PLAN (STEP 7)</div>
              <div className="text-[12.5px] leading-[1.7] text-muted">{attempt.answers[7]}</div>
            </div>
          )}
          {compare && ran && (
            <div className="mt-4 border-t border-ink/8 pt-3.5">
              <div className="kicker mb-2 text-guided">REFERENCE SOLUTION</div>
              <div className="overflow-x-auto whitespace-pre rounded-[8px] border border-guided/25 bg-bg px-3.5 py-3 font-mono text-[11.5px] leading-[1.75] text-ink-2">
                {problem.code.referenceSolution}
              </div>
              <div className="mt-2.5 flex flex-col gap-1.5 text-xs leading-[1.5] text-ink-2">
                <div>
                  <span className="font-mono text-[11px] font-semibold text-guided">
                    {problem.code.complexity.time} time
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[11px] font-semibold text-guided">
                    {problem.code.complexity.space} space
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-none items-center border-b border-line bg-sunken">
            <div className="flex items-center gap-2 border-r border-line bg-surface px-4 py-2 font-mono text-xs font-medium text-ink-2">
              <span className="size-2 rounded-[2px] bg-[#4078f2]" />
              solution.ts
              {code !== (isGuided ? problem.code.referenceSolution : problem.code.signature) && (
                <span className="text-faint">●</span>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2.5 pr-3.5">
              <label
                className="flex items-center gap-[7px] text-xs"
                style={{ color: ran ? 'var(--c-ink-tertiary)' : 'var(--c-faint)', cursor: ran ? 'pointer' : 'not-allowed' }}
              >
                <button
                  type="button"
                  onClick={() => ran && setCompare((c) => !c)}
                  disabled={!ran}
                  title={ran ? 'Show reference solution' : 'Available after your first run'}
                  className="flex h-[17px] w-[30px] rounded-[9px] border-none p-0.5"
                  style={{
                    background: compare
                      ? 'var(--c-accent-guided)'
                      : ran
                        ? 'color-mix(in srgb, var(--c-ink) 25%, transparent)'
                        : 'var(--c-line)',
                    justifyContent: compare ? 'flex-end' : 'flex-start',
                    cursor: ran ? 'pointer' : 'not-allowed',
                  }}
                >
                  <span className="block size-[13px] rounded-full bg-white" />
                </button>
                Compare with reference
              </label>
            </div>
          </div>
          {isGuided && problem.incrementalBuild && (
            <div className="flex-none border-b border-line bg-surface px-4 py-2.5">
              <div className="kicker mb-1.5 text-guided">INCREMENTAL BUILD — READ EACH CHUNK, THEN THE WHOLE</div>
              <div className="flex flex-col gap-1">
                {problem.incrementalBuild.map((chunk, i) => (
                  <div key={i} className="overflow-hidden rounded-[8px] border border-guided/25">
                    <button
                      type="button"
                      onClick={() => setOpenChunk(openChunk === i ? null : i)}
                      className="flex w-full cursor-pointer items-center gap-2 border-none bg-guided/5 px-3 py-1.5 text-left font-mono text-[11.5px] font-medium text-ink-2 hover:bg-guided/10"
                    >
                      {chunk.label}
                      <span className="ml-auto text-[10px] text-faint">{openChunk === i ? '▾' : '▸'}</span>
                    </button>
                    {openChunk === i && (
                      <pre className="m-0 overflow-x-auto border-t border-guided/15 bg-bg px-3 py-2 font-mono text-[11.5px] leading-[1.7] text-ink-2">
                        <code>{chunk.code}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="min-h-0 flex-1">
            <Editor
              language="typescript"
              theme={settings.theme === 'dark' ? 'vs-dark' : 'light'}
              value={code}
              onChange={(v) => setCode(v ?? '')}
              options={{
                fontSize: 13,
                fontFamily: "'IBM Plex Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>
          <div className="flex max-h-[420px] flex-none flex-col border-t border-line bg-surface">
            <div className="flex flex-none items-center gap-3 px-4 py-2.5">
              <button
                type="button"
                onClick={() => void doRun()}
                disabled={running}
                className="primary-btn h-[34px] px-4 text-[13px]"
                style={{ background: accent }}
              >
                {running ? 'Running…' : '▶ Run tests'}{' '}
                <span className="font-mono text-[10.5px] font-medium opacity-75">⌘⏎</span>
              </button>
              {run ? (
                <>
                  <span
                    className="font-mono text-xs font-semibold"
                    style={{ color: run.passed === run.total ? 'var(--c-ok-text)' : 'var(--c-err)' }}
                  >
                    {run.passed} / {run.total} passing
                  </span>
                  <span className="font-mono text-[11.5px] font-medium text-faint">
                    run #{run.runNumber} · {(run.durationMs / 1000).toFixed(2)}s
                  </span>
                </>
              ) : (
                <span className="text-[12.5px] text-faint">No runs yet this attempt — results appear here.</span>
              )}
              <button type="button" onClick={onBack} className="ghost-btn ml-auto h-[34px] text-[13px]">
                ← Back
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!ran}
                className="ghost-btn h-[34px] text-[13px]"
                style={{ opacity: ran ? 1 : 0.5, cursor: ran ? 'pointer' : 'not-allowed' }}
                title={ran ? undefined : 'Run the tests at least once first'}
              >
                Submit &amp; grade →
              </button>
            </div>
            {run && (
              <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 pb-3.5">
                {run.error && (
                  <div className="rounded-[8px] border border-err/45 bg-err/10 px-3 py-2.5 text-xs leading-[1.6] text-err">
                    {run.error}
                  </div>
                )}
                {run.cases.map((c, i) => {
                  const isTimeout = c.status === 'timeout'
                  const isPass = c.status === 'pass'
                  const open = expanded === i
                  return (
                    <div
                      key={i}
                      className="overflow-hidden rounded-[8px] border"
                      style={{
                        borderColor: isPass
                          ? 'color-mix(in srgb, var(--c-ok) 30%, transparent)'
                          : `color-mix(in srgb, var(--c-err) ${isTimeout ? 45 : 30}%, transparent)`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setExpanded(open ? null : i)}
                        className="flex w-full cursor-pointer items-center gap-2.5 border-none px-3 py-2 text-left font-mono text-xs font-medium"
                        style={{
                          background: isPass
                            ? 'color-mix(in srgb, var(--c-ok) 5%, transparent)'
                            : `color-mix(in srgb, var(--c-err) ${isTimeout ? 10 : 5}%, transparent)`,
                        }}
                      >
                        <span
                          className="font-semibold"
                          style={{ color: isPass ? 'var(--c-ok-text)' : 'var(--c-err)' }}
                        >
                          {isTimeout ? '⏱ TIMEOUT' : isPass ? '✓ PASS' : '✕ FAIL'}
                        </span>
                        <span className="text-ink-2">{c.name}</span>
                        <span className="ml-auto" style={{ color: isTimeout ? 'var(--c-err)' : 'var(--c-faint)' }}>
                          {isTimeout ? `> ${RUN_TIMEOUT_MS} ms` : `${c.ms} ms`}
                        </span>
                      </button>
                      {isTimeout && (
                        <div className="border-t border-err/20 px-3 py-2.5 text-xs leading-[1.6] text-err">
                          Your code ran past {RUN_TIMEOUT_MS / 1000}s — likely an infinite loop. Check your loop
                          conditions: does every branch make progress?
                        </div>
                      )}
                      {open && !isTimeout && (
                        <div className="border-t px-3 py-2.5 font-mono text-[11.5px] leading-[1.8]" style={{ borderColor: 'var(--c-line)' }}>
                          <div>
                            <span className="text-faint">input</span>{'    '}
                            <span className="text-ink-2">
                              {problem.code.tests[i].args.map((a) => JSON.stringify(a)).join(', ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-faint">expected</span>{' '}
                            <span className="text-ok-text">{c.expected}</span>
                          </div>
                          <div>
                            <span className="text-faint">actual</span>{'   '}
                            <span style={{ color: isPass ? 'var(--c-ok-text)' : 'var(--c-err)' }}>{c.actual}</span>
                          </div>
                          {c.consoleOutput && c.consoleOutput.length > 0 && (
                            <>
                              <div className="mt-1.5 text-faint">console:</div>
                              {c.consoleOutput.map((line, j) => (
                                <div key={j} className="text-muted">
                                  {line}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
                {!ran &&
                  visibleTests.map((t, i) => (
                    <div key={i} className="rounded-[8px] border border-line px-3 py-2 font-mono text-xs text-muted">
                      {t.label ?? `case ${i + 1}`}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
