import type { Problem } from '../../types'

export const meetingRooms: Problem = {
  id: 'meeting-rooms',
  leetcodeId: 252,
  title: 'Meeting Rooms',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'intervals',
  authored: true,
  statement:
    'Given meeting time `intervals` `[start, end)`, return `true` if one person could attend **all** meetings (no two overlap). A meeting may start exactly when another ends.',
  examples: [
    { input: 'intervals = [[0,30],[5,10],[15,20]]', output: 'false' },
    { input: 'intervals = [[7,10],[2,4]]', output: 'true' },
  ],
  constraints: ['0 <= intervals.length <= 10^4', '0 <= start < end <= 10^6'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: possibly-empty meeting intervals, half-open ([start, end)) so back-to-back is fine. Output: boolean — any overlap anywhere means false.',
      rubric: ['Half-open convention (back-to-back OK)', 'Empty input → true'],
    },
    whatToFind: {
      modelAnswer: 'Existence of *any* overlapping pair — a single conflict decides the answer.',
      rubric: ['Existence-of-conflict framing', 'Early exit on first conflict'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10⁴: pairwise O(n²) ≈ 5×10⁷ borderline; sorting O(n log n) is comfortable and makes conflicts adjacent.',
      rubric: ['Budget comparison', 'Sorting-makes-conflicts-adjacent preview'],
    },
    bruteForce: {
      modelAnswer: 'Check every pair for overlap (a.start < b.end && b.start < a.end): O(n²), O(1) space.',
      rubric: ['Pairwise overlap test written correctly', 'States O(n²)'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Almost all pairs are provably disjoint by ordering — sorted by start, a conflict can only exist between *neighbors* (if meeting i doesn\'t clash with i+1, it can\'t clash with anything later). Pattern: Sort + Sweep.',
      rubric: ['Waste: testing pairs ordering already separates', 'Neighbor-only-conflict claim'],
      acceptedPatterns: ['sort-sweep'],
    },
    algorithm: {
      modelAnswer: 'Sort by start; for each adjacent pair, if intervals[i].end > intervals[i+1].start → false. Else true. Time O(n log n), space O(1) extra.',
      rubric: ['Adjacent-only check after sort', 'Strict > for the half-open convention', 'States O(n log n)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be testing all pairs — O(n²). After sorting by start, any conflict must appear between adjacent meetings: if I fit before my immediate successor, I fit before everyone later too. So: sort, scan neighbors, fail on the first end-past-start. Time O(n log n), space O(1).',
      rubric: ['Template followed with the neighbor argument', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function canAttendMeetings(intervals: number[][]): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: false, label: 'example conflict' },
      { args: [[[7, 10], [2, 4]]], expected: true, label: 'example ok' },
      { args: [[]], expected: true, label: 'no meetings' },
      { args: [[[1, 5], [5, 8]]], expected: true, label: 'back-to-back allowed', hidden: true },
      { args: [[[1, 5], [4, 6], [7, 8]]], expected: false, label: 'middle overlap', hidden: true },
      { args: [[[3, 4]]], expected: true, label: 'single meeting', hidden: true },
    ],
    referenceSolution:
      'export function canAttendMeetings(intervals: number[][]): boolean {\n  const sorted = [...intervals].sort((a, b) => a[0] - b[0])\n  for (let i = 0; i + 1 < sorted.length; i++) {\n    if (sorted[i][1] > sorted[i + 1][0]) return false\n  }\n  return true\n}\n',
    complexity: { time: 'O(n log n)', space: 'O(1) extra' },
  },
}
