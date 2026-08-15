import type { Problem } from '../../types'

export const largestRectangleInHistogram: Problem = {
  id: 'largest-rectangle-in-histogram',
  leetcodeId: 84,
  title: 'Largest Rectangle in Histogram',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'stack',
  authored: true,
  statement:
    'Given an array `heights` representing the heights of histogram bars of width 1 standing side by side, return the area of the largest rectangle that can be formed within the histogram.',
  examples: [
    { input: 'heights = [2,1,5,6,2,3]', output: '10', explanation: 'The rectangle spans indices 2-3 (heights 5,6) capped at height 5: width 2 × height 5 = 10.' },
    { input: 'heights = [2,4]', output: '4' },
  ],
  constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an array of non-negative bar heights, width 1 each, up to 10⁵ bars. Output: a single integer — the maximum-area axis-aligned rectangle that fits entirely under the skyline.',
      rubric: ['Notes width-1 bars and non-negative heights', 'Output is one max-area integer'],
    },
    whatToFind: {
      modelAnswer:
        'For every possible rectangle height h, the widest contiguous span of bars all at least h — I need the best (height × width) over all such spans, which reduces to: for each bar, how far can a rectangle at that bar\'s height extend left and right before hitting something shorter.',
      rubric: ['Frames it as height × widest-span-at-that-height', 'Connects to each bar\'s left/right extent at its own height'],
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10⁵ rules out checking every pair of bars as rectangle boundaries (O(n²), up to 10¹⁰) — O(n) or O(n log n) is the target, meaning each bar\'s left/right extent must be found in amortized O(1).',
      rubric: ['Derives O(n)-ish budget from n up to 10⁵', 'States each bar\'s extent must be found in amortized constant time'],
    },
    bruteForce: {
      modelAnswer:
        'For each bar i, expand left and right while heights stay >= heights[i] to find its maximal span, compute area, track the max. O(n) per bar in the worst case gives O(n²) total, O(1) extra space.',
      rubric: ['Names the per-bar left/right expansion', 'States O(n²) time'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The waste is re-walking left/right from every bar when a bar\'s left boundary is really "the nearest shorter bar to its left" — a value that a monotonic stack can hand me for free as I sweep once. Keep a stack of indices with increasing heights; when a shorter bar arrives, everything taller sitting on the stack has just found its right boundary (this bar) and its left boundary (whatever is now below it on the stack) simultaneously — pop and finalize it. Pattern: Monotonic Stack.',
      rubric: ['Names the waste: repeated per-bar boundary search', 'Proposes an increasing monotonic stack that resolves both boundaries on pop'],
      acceptedPatterns: ['monotonic-stack'],
    },
    algorithm: {
      modelAnswer:
        'Stack of indices with strictly increasing heights. Iterate i from 0 to n inclusive, using a sentinel height of 0 at i === n to flush the stack. At each i, while the stack is non-empty and heights[stack.top] >= currentHeight, pop top: its rectangle height is heights[top]; its width is i − stack.top(new) − 1 if the stack is still non-empty after popping, else i (it extends back to index 0). Compute area = heights[top] * width and track the max. After the while loop, push i (skip pushing the sentinel index n). Return the max. Time O(n) since each index is pushed and popped exactly once, space O(n).',
      rubric: [
        'Monotonic increasing stack of indices with a sentinel 0-height pass to flush at the end',
        'Correct width formula using the new stack top (or the flush index if stack empties)',
        'States O(n) time, O(n) space, each index pushed/popped once',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force expands left and right from every bar to find its maximal span — O(n²), wasteful because a bar\'s left/right boundary is just "the nearest shorter bar", something I can track once with a monotonic stack instead of re-deriving per bar. I keep a stack of indices with increasing heights; whenever a shorter bar arrives, every taller bar above it on the stack has both its boundaries fixed — the new shorter bar on the right, whatever\'s below it on the stack on the left — so I pop and compute its area. A sentinel zero-height pass at the end flushes anything left. Each index is pushed and popped once: O(n) time, O(n) space.',
      rubric: ['Follows the script template end-to-end', 'States the monotonic-stack boundary-resolution insight and final complexity'],
    },
  },
  code: {
    signature: 'export function largestRectangleArea(heights: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[2, 1, 5, 6, 2, 3]], expected: 10, label: 'example' },
      { args: [[2, 4]], expected: 4, label: 'two bars' },
      { args: [[1, 1, 1, 1]], expected: 4, label: 'flat histogram' },
      { args: [[0]], expected: 0, label: 'single zero bar', hidden: true },
      { args: [[6, 2, 5, 4, 5, 1, 6]], expected: 12, label: 'classic mixed heights', hidden: true },
      { args: [[5, 4, 3, 2, 1]], expected: 9, label: 'strictly decreasing', hidden: true },
      { args: [[1, 2, 3, 4, 5]], expected: 9, label: 'strictly increasing', hidden: true },
    ],
    referenceSolution:
      'export function largestRectangleArea(heights: number[]): number {\n  const stack: number[] = []\n  let maxArea = 0\n  const n = heights.length\n  for (let i = 0; i <= n; i++) {\n    const currentHeight = i === n ? 0 : heights[i]\n    while (stack.length > 0 && heights[stack[stack.length - 1]] >= currentHeight) {\n      const top = stack.pop() as number\n      const height = heights[top]\n      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1\n      maxArea = Math.max(maxArea, height * width)\n    }\n    if (i < n) stack.push(i)\n  }\n  return maxArea\n}\n',
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
}
