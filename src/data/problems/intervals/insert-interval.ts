import type { Problem } from '../../types'

export const insertInterval: Problem = {
  id: 'insert-interval',
  leetcodeId: 57,
  title: 'Insert Interval',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'intervals',
  authored: true,
  statement:
    'Given `intervals` sorted by start and pairwise **non-overlapping**, insert `newInterval`, merging as needed, and return the result (still sorted and disjoint). Do it in one pass.',
  examples: [
    { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]' },
    { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]' },
  ],
  constraints: ['0 <= intervals.length <= 10^4', 'sorted by start, non-overlapping', '0 <= start <= end <= 10^5'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an already-sorted, disjoint interval list plus one new interval. Output: the same invariants restored after insertion. The pre-sortedness is the asset to preserve, not discard.',
      rubric: ['Pre-sorted/disjoint invariants registered', 'Empty list and boundary insertions live'],
    },
    whatToFind: {
      modelAnswer: 'Construct the updated list: everything strictly before the new interval, one merged hull for everything overlapping it, everything strictly after.',
      rubric: ['Three-zone decomposition (before/overlap/after)', 'Merged hull = min/max of the overlap zone'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10⁴ and the input is *already sorted* — re-sorting (O(n log n)) throws away the gift; the structure supports a single O(n) pass.',
      rubric: ['One-pass O(n) target', 'Names re-sorting as waste'],
    },
    bruteForce: {
      modelAnswer: 'Append the new interval and run full Merge Intervals: O(n log n) sort + sweep. Correct, but re-sorts a list that was already sorted.',
      rubric: ['Append-and-remerge described', 'Identifies the redundant sort'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The general merger re-derives an order we were handed. Disjoint + sorted means the overlap zone is one contiguous run: emit intervals ending before newInterval untouched, absorb the overlapping run into a min/max hull, emit the rest untouched. Pattern: Sort + Sweep (sweep only — the sort came free).',
      rubric: ['Waste: re-sorting sorted input', 'Contiguous-overlap-zone argument'],
      acceptedPatterns: ['sort-sweep'],
    },
    algorithm: {
      modelAnswer:
        'Phase 1: push intervals with end < newStart. Phase 2: while interval.start ≤ newEnd, fold into newInterval (min start, max end); push the hull. Phase 3: push the rest. Time O(n), space O(n) output.',
      rubric: ['Three-phase single pass', 'Correct overlap condition (≤ with touching semantics)', 'States O(n)'],
    },
    interviewScript: {
      modelAnswer:
        'I could append and re-run the generic merge — O(n log n) — but that re-sorts input the problem promises is sorted. Since the list is disjoint and ordered, everything overlapping the new interval forms one contiguous run: I\'ll emit the strictly-before prefix, fold the run into a single min/max hull, then emit the suffix. One pass, O(n) time, O(n) output.',
      rubric: ['Template followed with the contiguous-run insight', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function insert(intervals: number[][], newInterval: number[]): number[][] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[1, 3], [6, 9]], [2, 5]], expected: [[1, 5], [6, 9]], label: 'example' },
      {
        args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]],
        expected: [[1, 2], [3, 10], [12, 16]],
        label: 'multi-merge',
      },
      { args: [[], [5, 7]], expected: [[5, 7]], label: 'empty list' },
      { args: [[[1, 5]], [2, 3]], expected: [[1, 5]], label: 'nested inside existing', hidden: true },
      { args: [[[3, 5]], [1, 2]], expected: [[1, 2], [3, 5]], label: 'insert before all', hidden: true },
      { args: [[[1, 5]], [6, 8]], expected: [[1, 5], [6, 8]], label: 'insert after all', hidden: true },
    ],
    referenceSolution:
      'export function insert(intervals: number[][], newInterval: number[]): number[][] {\n  const out: number[][] = []\n  let [ns, ne] = newInterval\n  let i = 0\n  while (i < intervals.length && intervals[i][1] < ns) {\n    out.push(intervals[i])\n    i++\n  }\n  while (i < intervals.length && intervals[i][0] <= ne) {\n    ns = Math.min(ns, intervals[i][0])\n    ne = Math.max(ne, intervals[i][1])\n    i++\n  }\n  out.push([ns, ne])\n  while (i < intervals.length) {\n    out.push(intervals[i])\n    i++\n  }\n  return out\n}\n',
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
}
