import type { Problem } from '../../types'

export const meetingRoomsIi: Problem = {
  id: 'meeting-rooms-ii',
  leetcodeId: 253,
  title: 'Meeting Rooms II',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'intervals',
  authored: true,
  statement:
    'Given an array of meeting time intervals `[start, end]`, return the **minimum number of conference rooms** required so that no two meetings needing the same room ever overlap.',
  examples: [
    { input: 'intervals = [[0,30],[5,10],[15,20]]', output: '2', explanation: '[0,30] overlaps both others, but [5,10] and [15,20] never overlap each other.' },
    { input: 'intervals = [[7,10],[2,4]]', output: '1', explanation: 'The two meetings don\'t overlap at all.' },
  ],
  constraints: ['1 <= intervals.length <= 10^4', '0 <= start < end <= 10^6'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a list of [start, end) meeting intervals. Output: a single integer — the peak number of meetings simultaneously in progress at any instant. Rooms needed = max concurrency over the whole timeline.',
      rubric: ['Reframes "rooms needed" as "peak concurrency"', 'Treats intervals as [start, end) — touching endpoints don\'t overlap'],
      teachingNote:
        'Confirm the endpoint convention (does a meeting ending at 10 conflict with one starting at 10?) — LeetCode treats them as non-overlapping, and getting this backwards silently breaks the two-pointer sweep later.',
    },
    whatToFind: {
      modelAnswer:
        'The maximum number of intervals that are simultaneously active at any single point in time — the maximum overlap depth of the interval set.',
      rubric: ['Names it explicitly as max overlap depth / max concurrency', 'Understands the answer is a single peak value, not per-interval counts'],
      teachingNote:
        'This is the generic "interval scheduling → concurrency" reduction; the same reframing underlies many interval problems (car pooling, max simultaneous events, etc).',
    },
    constraintsHint: {
      modelAnswer:
        'Up to 10^4 intervals rules out O(n²) pairwise-overlap checking (10^8, borderline-to-slow and inelegant) but easily supports an O(n log n) sort-based sweep.',
      rubric: ['O(n^2) pairwise check identified as the naive baseline', 'O(n log n) sort flagged as the target'],
      teachingNote:
        'Interval problems almost always resolve to "sort by an endpoint, then sweep" — naming that pattern family early orients the rest of the derivation.',
    },
    bruteForce: {
      modelAnswer:
        'For every point in time (or every interval start), count how many intervals contain it, by checking against all others: O(n²) pairwise overlap comparisons to find the peak.',
      rubric: ['Pairwise overlap counting described', 'States O(n^2)'],
      teachingNote:
        'A cleaner brute-force framing than "check all pairs" is "for each interval start, count overlapping intervals" — same complexity, but it foreshadows the sweep\'s event-based thinking.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Checking every pair re-derives overlap information that a chronological sweep gives for free: process start and end events in time order, incrementing a counter on a start and decrementing on an end — the running counter *is* the concurrency at that instant, and its max over the sweep is the answer. Pattern: sort + two-pointer sweep over separated start/end arrays (a min-heap of active end times is an equivalent, if more heavyweight, formulation).',
      rubric: [
        'Waste: pairwise recomputation of overlap that a time-ordered sweep avoids',
        'Describes the increment-on-start / decrement-on-end running counter',
      ],
      acceptedPatterns: ['sort-sweep', 'heap'],
      teachingNote:
        'Mentioning the heap alternative (push end times, pop when the next start ≥ the smallest end) shows breadth, but the sorted-two-pointer sweep is strictly simpler here and should be the one actually implemented.',
    },
    algorithm: {
      modelAnswer:
        'Split into two sorted arrays: starts[] and ends[], each sorted ascending. Walk both with pointers s=0, e=0 and rooms=0, maxRooms=0. While s < n: if starts[s] < ends[e], a new meeting begins before the earliest active one ends — rooms++, s++; else an active meeting has ended — rooms--, e++. Track maxRooms after each increment. Return maxRooms. O(n log n) time (sort), O(n) space.',
      rubric: [
        'Separate sorted starts/ends arrays with independent pointers',
        'Correct comparison: strict start < end advances the start pointer',
        'Tracks and returns the running max, not the final count',
      ],
      teachingNote:
        'The comparison direction (starts[s] < ends[e], not <=) is exactly the endpoint convention from step 1 made concrete — walk through a boundary case like [5,10],[10,15] to confirm it resolves to 1 room, not 2.',
    },
    interviewScript: {
      modelAnswer:
        'The answer is the peak number of simultaneously active meetings, so instead of pairwise-checking all n² interval pairs, I sort start times and end times separately and sweep both in chronological order: each start before the next end bumps the room count, each end frees one, and I track the running maximum. That max concurrency is the room count. O(n log n) for the sort, O(n) extra space for the two arrays.',
      rubric: ['Template followed: reframe as concurrency, name the O(n^2) waste, present the sweep', 'Complexity stated'],
      teachingNote:
        'A strong closer here is proactively mentioning the min-heap-of-end-times variant as functionally equivalent but with worse constants — shows the candidate isn\'t just pattern-matching one memorized solution.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Split into independently sorted start/end arrays',
      code: 'const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b)\nconst ends = intervals.map((iv) => iv[1]).sort((a, b) => a - b)',
    },
    {
      label: '2. Two pointers walk the timeline in chronological order',
      code: 'let s = 0, e = 0\nlet rooms = 0\nlet maxRooms = 0',
    },
    {
      label: '3. A start before the earliest active end needs a new room; an end frees one',
      code: 'while (s < starts.length) {\n  if (starts[s] < ends[e]) {\n    rooms++          // new meeting begins, no room free yet\n    s++\n    maxRooms = Math.max(maxRooms, rooms)\n  } else {\n    rooms--          // earliest active meeting ended, room freed\n    e++\n  }\n}',
    },
    {
      label: '4. Peak concurrency is the room count',
      code: 'return maxRooms',
    },
  ],
  code: {
    signature: 'export function minMeetingRooms(intervals: number[][]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: 2, label: 'example needs 2 rooms' },
      { args: [[[7, 10], [2, 4]]], expected: 1, label: 'example non-overlapping' },
      { args: [[[1, 5]]], expected: 1, label: 'single meeting' },
      { args: [[[5, 10], [10, 15]]], expected: 1, label: 'touching endpoints do not overlap', hidden: true },
      { args: [[[1, 10], [2, 6], [3, 9], [4, 8]]], expected: 4, label: 'fully nested intervals all overlap', hidden: true },
      { args: [[[1, 4], [4, 5], [2, 3], [3, 6]]], expected: 2, label: 'mixed overlaps peak at two', hidden: true },
    ],
    referenceSolution:
      'export function minMeetingRooms(intervals: number[][]): number {\n  const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b)\n  const ends = intervals.map((iv) => iv[1]).sort((a, b) => a - b)\n  let s = 0, e = 0\n  let rooms = 0\n  let maxRooms = 0\n  while (s < starts.length) {\n    if (starts[s] < ends[e]) {\n      rooms++\n      s++\n      maxRooms = Math.max(maxRooms, rooms)\n    } else {\n      rooms--\n      e++\n    }\n  }\n  return maxRooms\n}\n',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
  },
}
