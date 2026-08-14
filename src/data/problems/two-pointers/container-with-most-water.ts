import type { Problem } from '../../types'

export const containerWithMostWater: Problem = {
  id: 'container-with-most-water',
  leetcodeId: 11,
  title: 'Container With Most Water',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'two-pointers',
  authored: true,
  statement:
    'You are given an array `heights` of n non-negative integers, where each value is a vertical line at index i. Choose two lines that, together with the x-axis, form a container holding the most water. Return the maximum area (water cannot lean — it is capped by the shorter line).',
  examples: [
    {
      input: 'heights = [1,8,6,2,5,4,8,3,7]',
      output: '49',
      explanation: 'Lines at i=1 (h=8) and i=8 (h=7): min(8,7) × (8−1) = 49.',
    },
    { input: 'heights = [1,1]', output: '1' },
  ],
  constraints: ['2 <= n <= 10^5', '0 <= heights[i] <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an array of non-negative heights, up to 10⁵ long. Output: a single integer — the best area min(h[i], h[j]) × (j − i) over all pairs. No mutation needed.',
      rubric: ['Names the area formula explicitly', 'Single-number output over all pairs'],
    },
    whatToFind: {
      modelAnswer: 'A max-min optimization: maximize a function of pairs. Not a search for a specific pair — an optimum over all of them.',
      rubric: ['Identifies pairwise maximization', 'Notes the answer is one number, pairs need not be reported'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10⁵ rules out the O(n²) pair scan (~10¹⁰). Budget O(n) or O(n log n); O(1) extra space is plausible since only a running best is needed.',
      rubric: ['Rejects O(n²) from the bound', 'States the ~O(n) budget'],
    },
    bruteForce: {
      modelAnswer: 'Try every pair of lines: nested loops over i < j computing min(h[i], h[j]) × (j − i), keeping the max. O(n²) time, O(1) space.',
      rubric: ['All-pairs enumeration with the area formula', 'States O(n²) time', 'States space'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Most pairs are provably dominated: for any pair, the shorter line caps the area, so pairing that shorter line with anything narrower can never win — yet the brute force checks all of those anyway. Start at maximum width and always discard the shorter end. Pattern: Two Pointers (inward).',
      rubric: ['Names the waste: dominated pairs still checked', 'States the discard-the-shorter-side argument'],
      acceptedPatterns: ['two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'l = 0, r = n−1, best = 0. While l < r: area = min(heights[l], heights[r]) × (r − l); update best; move the pointer at the *shorter* line inward (either on ties). Every step retires one line permanently. Time O(n), space O(1).',
      rubric: [
        'Widest start, inward movement of the shorter side',
        'Handles the tie case (move either) without stalling',
        'States O(n)/O(1)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Naively I\'d check every pair of lines — O(n²), too slow for 10⁵. But the shorter line caps the area, so from the widest container I can always discard the shorter end: nothing it could form later is better. That\'s the two-pointer exchange argument. I\'ll sweep inward keeping a running best. Time O(n), space O(1).',
      rubric: ['Template followed with the domination argument stated', 'Complexity claimed at the end'],
    },
  },
  code: {
    signature: 'export function maxArea(heights: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, label: 'example' },
      { args: [[1, 1]], expected: 1, label: 'two lines' },
      { args: [[4, 4, 4, 4, 4, 4]], expected: 20, label: 'all equal heights' },
      { args: [[9, 8, 7, 6, 5, 4, 3, 2, 1]], expected: 20, label: 'descending heights', hidden: true },
      { args: [[0, 0, 0]], expected: 0, label: 'all zero', hidden: true },
      { args: [[1, 2, 4, 3]], expected: 4, label: 'best pair inside', hidden: true },
    ],
    referenceSolution:
      'export function maxArea(heights: number[]): number {\n  let l = 0\n  let r = heights.length - 1\n  let best = 0\n  while (l < r) {\n    best = Math.max(best, Math.min(heights[l], heights[r]) * (r - l))\n    if (heights[l] < heights[r]) l++\n    else r--\n  }\n  return best\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
