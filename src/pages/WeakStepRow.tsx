import { STEP_LABELS } from '../lib/grading'

export function WeakStepRow({ w, rank }: { w: { step: number; avg: number; count: number }; rank: number }) {
  const rankColor = rank === 0 ? 'var(--c-err)' : rank < 3 ? 'var(--c-warn)' : 'var(--c-muted)'
  const barColor = w.avg < 1.1 ? 'var(--c-err)' : w.avg < 1.6 ? 'var(--c-warn)' : 'var(--c-ok)'
  return (
    <div>
      <div className="mb-[5px] flex items-baseline gap-2">
        <span className="font-mono text-[11px] font-semibold" style={{ color: rankColor }}>
          #{rank + 1}
        </span>
        <span className="text-[13px] font-semibold">{STEP_LABELS[w.step - 1]}</span>
        <span className="ml-auto font-mono text-[11px] font-semibold" style={{ color: rankColor }}>
          {w.avg.toFixed(1)}/2
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-[3px] bg-ink/6">
        <div className="h-full rounded-[3px]" style={{ width: `${(w.avg / 2) * 100}%`, background: barColor }} />
      </div>
      <div className="mt-[5px] text-[11.5px] text-muted">
        {w.avg.toFixed(1)}/2 across {w.count} scored attempt{w.count === 1 ? '' : 's'}
      </div>
    </div>
  )
}
