import type { Problem } from '../../types'

export const minimumIntervalToIncludeEachQuery: Problem = {
  id: 'minimum-interval-to-include-each-query',
  leetcodeId: 1851,
  title: 'Minimum Interval to Include Each Query',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'intervals',
  authored: true,
  statement:
    'You are given a 2D array `intervals` where `intervals[i] = [left_i, right_i]` (inclusive), and an array `queries`. For each `queries[j]`, find the size (`right - left + 1`) of the SMALLEST interval that contains `queries[j]` (i.e. `left <= queries[j] <= right`), or `-1` if no interval contains it. Return the answers in an array in the same order as `queries`.',
  examples: [
    {
      input: 'intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]',
      output: '[3,3,1,4]',
      explanation: 'query=4 is contained by [4,4] (size 1), the smallest of the intervals covering it.',
    },
    { input: 'intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]', output: '[2,-1,4,6]' },
    { input: 'intervals = [[1,10]], queries = [5]', output: '[10]' },
  ],
  constraints: [
    '1 <= intervals.length <= 10^5',
    '1 <= queries.length <= 10^5',
    'intervals[i].length == 2',
    '1 <= left_i <= right_i <= 10^7',
    '1 <= queries[j] <= 10^7',
  ],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 10^5 intervals and up to 10^5 independent query points. Output: for each query, in original query order, the size of the smallest interval covering it, or -1. Both arrays can be large, so any O(intervals × queries) approach is out of budget.',
      rubric: ['States output must preserve original query order despite needing to process queries out of order internally', 'Flags that both array sizes rule out an O(n·m) approach'],
    },
    whatToFind: {
      modelAnswer:
        'For each query point, among all intervals containing it, the minimum-size one — an "interval stabbing" query repeated for many points, where we want the tightest covering interval each time.',
      rubric: ['Identifies this as interval-stabbing (does this interval cover this point) repeated per query', 'Notes we want the minimum-size covering interval, not just any covering interval'],
    },
    constraintsHint: {
      modelAnswer:
        'With 10^5 intervals and 10^5 queries, checking every interval against every query is 10^10 — far too slow. But if both intervals and queries are sorted by their start/value, a pointer over intervals only ever needs to move forward as queries increase, and a heap can track the currently-active intervals ordered by size — giving O((n+m) log n).',
      rubric: ['Derives that pairwise checking (O(n·m)) is infeasible from the given bounds', 'Connects sorting both arrays to enabling a single forward pass with a heap'],
    },
    bruteForce: {
      modelAnswer:
        'For each query, scan every interval, check `left <= q <= right`, and track the minimum size among matches (or -1 if none match). O(n·m) time where n = intervals.length, m = queries.length; O(1) extra space beyond the output. Correct but rescans the full interval list independently for every single query.',
      rubric: ['Describes scanning all intervals per query', 'States O(n·m) time and that work is not shared across queries'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The brute force rescans intervals whose start is far below the current query every single time, and ignores that as queries are processed in increasing order, once an interval\'s start is behind us it stays behind us — and once an interval\'s end falls behind the current query, it can never cover any later (larger) query either. Sort both intervals (by start) and queries (by value); walk a pointer through intervals that only ever advances, feeding "started" intervals into a min-heap keyed by size, and lazily discard heap entries whose end has already fallen behind the current query. Pattern: Heap + sort-and-sweep (offline processing in sorted query order).',
      rubric: ['Names the waste: repeatedly rescanning intervals whose relevance to the current query is already resolved', 'Proposes sorting both arrays and sweeping with a heap ordered by interval size, discarding stale (expired) entries lazily'],
      acceptedPatterns: ['heap', 'sort-sweep'],
    },
    algorithm: {
      modelAnswer:
        'Sort `intervals` by `left` ascending. Build `order = queries.map((v, i) => ({ value: v, originalIndex: i }))` and sort `order` by `value` ascending. Maintain an intervals-pointer `p = 0` (starts at 0, only ever advances) and a `MinHeap<{ end: number }>` keyed by interval size (`right - left + 1`). For each `{ value, originalIndex }` in sorted `order`: while `p < intervals.length` and `intervals[p][0] <= value`, push that interval into the heap keyed by its size and increment `p`; then while the heap is non-empty and its top `end < value`, pop it (that interval\'s right end is already behind this query, so it can never cover this or any later query — lazy deletion); the answer for this query is the heap\'s top key if non-empty, else `-1`; write it into `result[originalIndex]`. Return `result`. Time O((n + m) log n) — each interval is pushed/popped from the heap at most once across the whole run, and the intervals-pointer only moves forward; space O(n + m).',
      rubric: [
        'Sorts intervals by start and queries by value (tracking original indices) before the single forward sweep',
        'Intervals-pointer only ever advances forward across the entire run (never resets per query)',
        'Lazily pops heap entries whose end is behind the current query before reading the top as the answer',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force checks every interval against every query — O(n·m), far too slow at 10^5 each, and it repeats work a sorted sweep can share. Sorting queries ascending and intervals by start lets me advance an intervals-pointer forward only, pushing each newly-started interval into a min-heap keyed by size; I lazily discard heap entries whose end has fallen behind the current query, since increasing queries can never re-enter them. The heap top after that cleanup is the smallest covering interval\'s size, or -1 if empty. I write each answer back at its original query index. Time O((n+m) log n), space O(n+m).',
      rubric: ['Follows the template end-to-end', 'States the lazy-deletion heap mechanism and final complexity'],
    },
  },
  code: {
    signature:
      'export function minInterval(intervals: number[][], queries: number[]): number[] {\n  // MinHeap is available: push(key, value), pop(), peek(), peekKey(), size\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [[[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]],
        expected: [3, 3, 1, 4],
        label: 'example: overlapping intervals of varying size',
      },
      {
        args: [[[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22]],
        expected: [2, -1, 4, 6],
        label: 'example: some queries have no covering interval',
      },
      { args: [[[1, 10]], [5]], expected: [10], label: 'single interval, single query' },
      { args: [[[1, 5], [6, 10]], [3, 8, 11]], expected: [5, 5, -1], label: 'disjoint intervals, one uncovered query', hidden: true },
      {
        args: [[[1, 100], [10, 20], [15, 25]], [5, 18, 30]],
        expected: [100, 11, 100],
        label: 'nested small interval preferred over covering large one',
        hidden: true,
      },
      {
        args: [[[3, 3], [1, 5]], [3, 1, 5]],
        expected: [1, 5, 5],
        label: 'queries not given in sorted order, single-point interval preferred',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function minInterval(intervals: number[][], queries: number[]): number[] {\n  const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0])\n  const order = queries.map((value, originalIndex) => ({ value, originalIndex }))\n  order.sort((a, b) => a.value - b.value)\n\n  const result = new Array(queries.length).fill(-1)\n  const heap = new MinHeap<{ end: number }>()\n  let p = 0\n\n  for (const { value, originalIndex } of order) {\n    while (p < sortedIntervals.length && sortedIntervals[p][0] <= value) {\n      const [left, right] = sortedIntervals[p]\n      heap.push(right - left + 1, { end: right })\n      p++\n    }\n    while (heap.size > 0 && heap.peek()!.end < value) {\n      heap.pop()\n    }\n    if (heap.size > 0) {\n      result[originalIndex] = heap.peekKey()!\n    }\n  }\n\n  return result\n}\n',
    complexity: { time: 'O((n + m) log n)', space: 'O(n + m)' },
  },
}
