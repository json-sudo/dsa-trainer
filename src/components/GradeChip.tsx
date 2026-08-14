import type { Grade } from '../lib/grading'

export function gradeColors(grade: Grade | undefined): { color: string; bg: string } {
  if (!grade) return { color: 'var(--c-muted)', bg: 'color-mix(in srgb, var(--c-ink) 6%, transparent)' }
  if (grade.startsWith('A'))
    return { color: 'var(--c-ok-text)', bg: 'color-mix(in srgb, var(--c-ok) 12%, transparent)' }
  if (grade.startsWith('B'))
    return { color: 'var(--c-accent-guided)', bg: 'color-mix(in srgb, var(--c-accent-guided) 10%, transparent)' }
  return { color: 'var(--c-warn)', bg: 'color-mix(in srgb, var(--c-warn) 12%, transparent)' }
}

export function GradeChip({ grade }: { grade: Grade }) {
  const { color, bg } = gradeColors(grade)
  return (
    <span
      className="rounded-[5px] px-[7px] py-[3px] font-mono text-[11px] font-semibold"
      style={{ color, background: bg }}
    >
      {grade}
    </span>
  )
}

export function DifficultyBadge({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) {
  const styles = {
    easy: { color: 'var(--c-ok-text)', background: 'color-mix(in srgb, var(--c-ok) 10%, transparent)' },
    medium: { color: 'var(--c-warn)', background: 'color-mix(in srgb, var(--c-warn) 12%, transparent)' },
    hard: { color: 'var(--c-err)', background: 'color-mix(in srgb, var(--c-err) 10%, transparent)' },
  }[difficulty]
  return (
    <span className="rounded-[5px] px-2 py-[3px] font-mono text-[10.5px] font-semibold uppercase" style={styles}>
      {difficulty}
    </span>
  )
}
