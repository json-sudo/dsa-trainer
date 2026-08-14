import type { Problem } from '../../types'

export const nonOverlappingIntervals: Problem = {
  id: 'non-overlapping-intervals',
  leetcodeId: 435,
  title: 'Non-overlapping Intervals',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'intervals',
  authored: true,
  statement:
    'Given `intervals` `[start, end)`, return the **minimum number of intervals to remove** so the rest are non-overlapping. Touching intervals do not overlap.',
  examples: [
    { input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1', explanation: 'Remove [1,3].' },
    { input: 'intervals = [[1,2],[1,2],[1,2]]', output: '2' },
    { input: 'intervals = [[1,2],[2,3]]', output: '0' },
  ],
  constraints: ['1 <= intervals.length <= 10^5', '-5 * 10^4 <= start < end <= 5 * 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 10⁵ half-open intervals. Output: the minimal removal count. Equivalent flip: keep the maximum number of pairwise-compatible intervals.',
      rubric: ['Min-removals ⇔ max-kept flip stated', 'Half-open (touching OK) convention'],
    },
    whatToFind: {
      modelAnswer: 'Maximum set of mutually non-overlapping intervals (classic activity selection), then n minus that.',
      rubric: ['Names activity selection', 'Removal count derived from kept count'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10⁵: subset enumeration is out; interval-DP O(n²) (10¹⁰) is out. O(n log n) — a sort plus greedy sweep — is the budget.',
      rubric: ['Rejects both exponential and quadratic', 'Sort+sweep budget'],
    },
    bruteForce: {
      modelAnswer:
        'DP after sorting: longest chain ending at each interval (LIS-style over compatibility): O(n²) transitions — correct but 10¹⁰ at this n.',
      rubric: ['Quadratic chain-DP described', 'States O(n²) and why it fails here'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The DP considers every predecessor, but one exchange argument kills that: among compatible choices, the interval ending *earliest* never hurts — it leaves maximal room. Sort by end; sweep keeping anything that starts at/after the last kept end. Pattern: Sort + Sweep with a Greedy exchange proof.',
      rubric: ['Waste: predecessor scans vs a forced local choice', 'Earliest-end exchange argument stated'],
      acceptedPatterns: ['sort-sweep', 'greedy'],
    },
    algorithm: {
      modelAnswer:
        'Sort by end. kept = 0, lastEnd = −∞. For each [s, e]: if s ≥ lastEnd → kept++, lastEnd = e. Answer n − kept. Time O(n log n), space O(1) extra.',
      rubric: ['Sort-by-end (not start!)', 'Keep condition s ≥ lastEnd', 'Answer as n − kept'],
    },
    interviewScript: {
      modelAnswer:
        'Minimum removals is maximum kept, which is activity selection. A quadratic chain DP works but 10⁵ forbids it — and greedy is provably optimal: keeping the compatible interval that ends earliest can never be worse, since any other choice occupies strictly more of the timeline. Sort by end, sweep, count keeps, subtract from n. Time O(n log n), space O(1).',
      rubric: ['Template followed with the exchange argument', 'Sort-by-end emphasized'],
    },
  },
  code: {
    signature: 'export function eraseOverlapIntervals(intervals: number[][]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1, label: 'example' },
      { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2, label: 'identical intervals' },
      { args: [[[1, 2], [2, 3]]], expected: 0, label: 'touching ok' },
      { args: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expected: 2, label: 'long interval loses', hidden: true },
      { args: [[[5, 6]]], expected: 0, label: 'single interval', hidden: true },
      { args: [[[-3, -1], [-2, 0], [-1, 1]]], expected: 1, label: 'negative coordinates', hidden: true },
    ],
    referenceSolution:
      'export function eraseOverlapIntervals(intervals: number[][]): number {\n  const sorted = [...intervals].sort((a, b) => a[1] - b[1])\n  let kept = 0\n  let lastEnd = -Infinity\n  for (const [s, e] of sorted) {\n    if (s >= lastEnd) {\n      kept++\n      lastEnd = e\n    }\n  }\n  return intervals.length - kept\n}\n',
    complexity: { time: 'O(n log n)', space: 'O(1) extra' },
  },
}
