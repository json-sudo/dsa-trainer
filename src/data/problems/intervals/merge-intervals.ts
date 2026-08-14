import type { Problem } from '../../types'

export const mergeIntervals: Problem = {
  id: 'merge-intervals',
  leetcodeId: 56,
  title: 'Merge Intervals',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'intervals',
  authored: true,
  statement:
    'Given an array of `intervals` `[start, end]`, merge all overlapping intervals and return the non-overlapping result covering the same ranges. Touching intervals (`[1,4]` and `[4,5]`) merge.',
  examples: [
    { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' },
  ],
  constraints: ['1 <= intervals.length <= 10^4', '0 <= start <= end <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 10⁴ [start, end] pairs in arbitrary order. Output: the merged, disjoint intervals (canonically sorted by start). Touching endpoints count as overlap here — a contract detail to confirm.',
      rubric: ['Arbitrary input order noted', 'Touching-counts-as-overlap confirmed'],
      teachingNote:
        'Interval problems live and die on endpoint conventions. Ask (or state) whether [1,4] and [4,5] merge before writing anything — interviewers plant this ambiguity deliberately.',
    },
    whatToFind: {
      modelAnswer: 'Group transitive overlaps and collapse each group to its hull [min start, max end] — a grouping-then-aggregate task over ranges.',
      rubric: ['Transitive overlap grouping named', 'Hull aggregation per group'],
      teachingNote:
        'Note the word *transitive*: [1,3],[2,6],[5,9] all merge though 1–3 and 5–9 don\'t touch. Chained overlap is why sorted adjacency (not pairwise checks) is the right lens.',
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10⁴: pairwise overlap checking with union-find machinery is O(n²) ≈ 10⁸ — needless. Sorting is 10⁴·14 — trivially cheap. Budget O(n log n), the sort dominating.',
      rubric: ['Rejects pairwise O(n²)', 'Sort-dominated budget stated'],
      teachingNote:
        'For intervals, "can I afford to sort?" is almost always yes and almost always decisive. Sorted-by-start is the normal form in which interval reasoning becomes linear.',
    },
    bruteForce: {
      modelAnswer:
        'Repeatedly scan all pairs, merging any overlapping two until stable: each pass O(n²) and up to n passes — O(n³) worst case, plus fiddly bookkeeping.',
      rubric: ['Merge-until-stable pairwise scheme', 'States the cubic worst case'],
      teachingNote:
        'This brute force is worth articulating badly-on-purpose: its "until stable" loop is the smell. Fix-point iteration over pairs almost always means an ordering was ignored.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Pairwise scans keep rediscovering an ordering fact: after sorting by start, an interval can only merge with its *immediate* running predecessor — anything overlapping arrives adjacent. Sort once, sweep once, extending or emitting. Pattern: Sort + Sweep.',
      rubric: ['Waste: rediscovering adjacency the sort provides', 'Only-the-running-interval-matters claim'],
      acceptedPatterns: ['sort-sweep'],
      teachingNote:
        'The provable claim to say: "after sorting by start, overlaps are contiguous". That sentence converts a graph problem (overlap components) into a linear scan — it is the entire pattern.',
    },
    algorithm: {
      modelAnswer:
        'Sort by start. current = first. For each next: if next.start ≤ current.end → current.end = max(current.end, next.end); else emit current, current = next. Emit the last. The max() matters — a later interval can be nested. Time O(n log n), space O(n) output.',
      rubric: [
        'Sweep with extend-or-emit',
        'max(end) for nested intervals (not blind overwrite)',
        'States O(n log n)',
      ],
      teachingNote:
        'The nested-interval bug — writing current.end = next.end instead of max — passes the base example and fails on [[1,10],[2,3]]. Keep that test in your head as the standard trap.',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be pairwise merge-until-stable — up to cubic and messy. Sorted by start, any overlap must be with the interval I\'m currently building, since everything overlapping arrives adjacent. So: sort, sweep once, extend the running interval with max(end) or emit and restart. Time O(n log n) from the sort, linear sweep, O(n) output.',
      rubric: ['Template followed with the adjacency-after-sort claim', 'Complexity stated'],
      teachingNote:
        'Your interval reflex check: this is Sort + Sweep, not Heap — the heap variant (Meeting Rooms II) is for counting *simultaneous* overlaps, not flattening them. Name the sibling to show you know the difference.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Sort by start — overlaps become adjacent',
      code: 'const sorted = [...intervals].sort((a, b) => a[0] - b[0])\n// after this, anything that merges with me arrives immediately after me',
    },
    {
      label: '2. Sweep: extend the running interval or emit it',
      code: 'let [start, end] = sorted[0]\nfor (const [s, e] of sorted.slice(1)) {\n  if (s <= end) {\n    end = Math.max(end, e)   // max! a nested interval must not SHRINK the end\n  } else {\n    out.push([start, end])   // gap -> flush\n    start = s\n    end = e\n  }\n}',
    },
    {
      label: '3. Flush the final running interval',
      code: 'out.push([start, end])   // the classic forgotten line\nreturn out',
    },
  ],
  code: {
    signature: 'export function merge(intervals: number[][]): number[][] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], label: 'example' },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]], label: 'touching merge' },
      { args: [[[3, 4]]], expected: [[3, 4]], label: 'single interval' },
      { args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]], label: 'nested intervals', hidden: true },
      { args: [[[5, 6], [1, 2]]], expected: [[1, 2], [5, 6]], label: 'unsorted disjoint input', hidden: true },
      { args: [[[1, 4], [0, 0]]], expected: [[0, 0], [1, 4]], label: 'zero-length interval', hidden: true },
    ],
    referenceSolution:
      'export function merge(intervals: number[][]): number[][] {\n  const sorted = [...intervals].sort((a, b) => a[0] - b[0])\n  const out: number[][] = []\n  let [start, end] = sorted[0]\n  for (let i = 1; i < sorted.length; i++) {\n    const [s, e] = sorted[i]\n    if (s <= end) {\n      end = Math.max(end, e)\n    } else {\n      out.push([start, end])\n      start = s\n      end = e\n    }\n  }\n  out.push([start, end])\n  return out\n}\n',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
  },
}
