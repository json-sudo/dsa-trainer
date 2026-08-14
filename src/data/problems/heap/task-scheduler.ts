import type { Problem } from '../../types'

export const taskScheduler: Problem = {
  id: 'task-scheduler',
  leetcodeId: 621,
  title: 'Task Scheduler',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'heap',
  authored: true,
  statement:
    'Given `tasks` (uppercase letters, one CPU interval each) and a cooldown `n`, identical tasks must be at least `n` intervals apart; the CPU may idle. Return the **minimum** number of intervals to finish all tasks.',
  examples: [
    { input: 'tasks = ["A","A","A","B","B","B"], n = 2', output: '8', explanation: 'A B idle A B idle A B.' },
    { input: 'tasks = ["A","C","A","B","D","B"], n = 1', output: '6', explanation: 'No idling needed.' },
    { input: 'tasks = ["A","A","A","B","B","B"], n = 3', output: '10' },
  ],
  constraints: ['1 <= tasks.length <= 10^4', '0 <= n <= 100', 'tasks are uppercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a multiset of ≤26 task types (up to 10⁴ tasks) and cooldown n. Output: the minimal total intervals *including idles*. Order of execution is mine to choose.',
      rubric: ['Output counts idle slots too', 'Scheduling order is a free choice'],
    },
    whatToFind: {
      modelAnswer: 'A min-length schedule under a spacing constraint — an optimization where only the *count* of the schedule matters, not the schedule itself.',
      rubric: ['Minimize schedule length framing', 'Notes only the length is demanded'],
    },
    constraintsHint: {
      modelAnswer:
        '26 task types max — per-type counts are tiny. n ≤ 100 bounds the frame length. Signals: reason over *frequencies*, and the bottleneck is the most frequent task; a closed-form frame bound exists.',
      rubric: ['Frequencies (26 counters) as the working data', 'Most-frequent-task-as-bottleneck intuition'],
    },
    bruteForce: {
      modelAnswer:
        'Simulate interval by interval, greedily running the available task with the highest remaining count (rescanning 26 counts each tick): O(totalIntervals × 26) — actually fine, but the rescan and the simulation itself are avoidable.',
      rubric: ['Tick simulation with rescans', 'States its cost', 'Notes it passes but overworks'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The simulation re-derives "which task is most urgent" every tick — a priority ordering a max-heap maintains directly (process in cooldown-sized batches, re-queueing survivors). Even better, the answer has a closed form driven by the max frequency: frames of size n+1 anchored by the most frequent task. Pattern: Heap (simulation) or Greedy (formula) — both accepted.',
      rubric: ['Waste: re-deriving priority per tick', 'Frame/formula insight or heap batching described'],
      acceptedPatterns: ['heap', 'greedy'],
    },
    algorithm: {
      modelAnswer:
        'Formula: maxCount = highest frequency, ties = number of task types at maxCount. Frames: (maxCount − 1) full frames of size (n + 1), then the ties finish: candidate = (maxCount − 1)(n + 1) + ties. Answer = max(candidate, tasks.length) — when tasks are plentiful, no idling is ever needed. Time O(t + 26), space O(26).',
      rubric: [
        'Frame formula with the ties term',
        'max(candidate, total) for the no-idle case',
        'States O(t) time',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be simulating tick by tick, rescanning task counts for the most urgent runnable — workable but it re-derives priorities constantly. The bottleneck is the most frequent task: it forces (maxCount−1) frames of n+1 slots, finished by however many task types tie that maximum; every other task fills the gaps. So the answer is max((maxCount−1)(n+1) + ties, total tasks). Time O(t), space O(26). A max-heap simulation is the structural fallback if the formula feels risky.',
      rubric: ['Template followed with the bottleneck-frame argument', 'The no-idle max() case mentioned'],
    },
  },
  code: {
    signature: 'export function leastInterval(tasks: string[], n: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [['A', 'A', 'A', 'B', 'B', 'B'], 2], expected: 8, label: 'example' },
      { args: [['A', 'C', 'A', 'B', 'D', 'B'], 1], expected: 6, label: 'no idles needed' },
      { args: [['A', 'A', 'A', 'B', 'B', 'B'], 3], expected: 10, label: 'bigger cooldown' },
      { args: [['A'], 100], expected: 1, label: 'single task', hidden: true },
      { args: [['A', 'A', 'A', 'A'], 0], expected: 4, label: 'zero cooldown', hidden: true },
      { args: [['A', 'A', 'B', 'B', 'C', 'C'], 2], expected: 6, label: 'all tie at max', hidden: true },
    ],
    referenceSolution:
      'export function leastInterval(tasks: string[], n: number): number {\n  const counts = new Array(26).fill(0)\n  for (const t of tasks) counts[t.charCodeAt(0) - 65]++\n  const maxCount = Math.max(...counts)\n  const ties = counts.filter((c) => c === maxCount).length\n  const candidate = (maxCount - 1) * (n + 1) + ties\n  return Math.max(candidate, tasks.length)\n}\n',
    complexity: { time: 'O(t)', space: 'O(26)' },
  },
}
