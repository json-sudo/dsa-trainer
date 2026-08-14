import type { Problem } from '../../types'

export const kClosestPointsToOrigin: Problem = {
  id: 'k-closest-points-to-origin',
  leetcodeId: 973,
  title: 'K Closest Points to Origin',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'heap',
  authored: true,
  statement:
    'Given an array of `points` `[x, y]` on the plane and an integer `k`, return the `k` points closest to the origin (Euclidean distance). The answer is unique up to order; return in any order.',
  examples: [
    { input: 'points = [[1,3],[-2,2]], k = 1', output: '[[-2,2]]', explanation: '√8 < √10.' },
    { input: 'points = [[3,3],[5,-1],[-2,4]], k = 2', output: '[[3,3],[-2,4]]' },
  ],
  constraints: ['1 <= k <= points.length <= 10^4', '-10^4 <= x, y <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 10⁴ coordinate pairs and k. Output: k points, any order. Distances only ever get *compared*, so squared distance x²+y² suffices — no sqrt.',
      rubric: ['Any-order output noted', 'Squared-distance (skip sqrt) observation'],
    },
    whatToFind: {
      modelAnswer: 'Top-k selection under a computed key (distance) — the k smallest keys, values attached.',
      rubric: ['Selection by derived key', 'k smallest (not largest) direction stated'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10⁴: sorting is 10⁴·14 ≈ trivial, O(n log k) heap is the idiomatic step up. Integer coordinates keep squared distances exact (≤ 2×10⁸, safe).',
      rubric: ['Budgets compared (n log n vs n log k)', 'Squared distances stay exact integers'],
    },
    bruteForce: {
      modelAnswer: 'Sort all points by squared distance, take the first k: O(n log n) time, O(n) space. Correct baseline.',
      rubric: ['Sort-and-slice named', 'States O(n log n)'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Sorting ranks every point when only membership in the best-k matters — the order of the rejected n−k points is discarded work. Max-heap of size k keyed by distance: a new point either beats the current worst-of-the-best or is skipped. Pattern: Heap (top-k by key).',
      rubric: ['Waste: ordering points that only need rejecting', 'Size-k heap with evict-worst rule'],
      acceptedPatterns: ['heap'],
    },
    algorithm: {
      modelAnswer:
        'Max-heap (negated keys) of ≤ k entries keyed by x²+y², storing the point. Push each; pop when size exceeds k. Drain the heap for the answer. Time O(n log k), space O(k).',
      rubric: ['Key/value heap usage with negation', 'Cap-at-k eviction', 'States O(n log k)/O(k)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be sorting all points by distance and slicing — O(n log n), ordering everything when I need an unordered best-k. This is a top-k heap: keep a max-heap of k candidates keyed by squared distance (comparisons don\'t need the square root), evicting the farthest whenever a closer point arrives. Time O(n log k), space O(k).',
      rubric: ['Template followed with the membership-not-order insight', 'sqrt-skip and complexity stated'],
    },
  },
  code: {
    signature: 'export function kClosest(points: number[][], k: number): number[][] {\n  // MinHeap is available: push(key, value), pop(), peek(), peekKey(), size\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: [[[1, 3], [-2, 2]], 1], expected: [[-2, 2]], label: 'example' },
      { args: [[[3, 3], [5, -1], [-2, 4]], 2], expected: [[3, 3], [-2, 4]], label: 'example 2' },
      { args: [[[0, 1]], 1], expected: [[0, 1]], label: 'single point' },
      { args: [[[1, 0], [0, 1], [-1, 0], [0, -1]], 4], expected: [[1, 0], [0, 1], [-1, 0], [0, -1]], label: 'k equals n', hidden: true },
      { args: [[[10000, 10000], [0, 0], [1, 1]], 2], expected: [[0, 0], [1, 1]], label: 'extreme coordinates', hidden: true },
      { args: [[[2, 2], [2, -2], [3, 0]], 2], expected: [[2, 2], [2, -2]], label: 'distance tie among winners', hidden: true },
    ],
    referenceSolution:
      'export function kClosest(points: number[][], k: number): number[][] {\n  const heap = new MinHeap<number[]>()\n  for (const p of points) {\n    const d = p[0] * p[0] + p[1] * p[1]\n    heap.push(-d, p)\n    if (heap.size > k) heap.pop()\n  }\n  const out: number[][] = []\n  while (heap.size > 0) out.push(heap.pop()!)\n  return out\n}\n',
    complexity: { time: 'O(n log k)', space: 'O(k)' },
  },
}
