import type { Problem } from '../../types'

export const slidingWindowMaximum: Problem = {
  id: 'sliding-window-maximum',
  leetcodeId: 239,
  title: 'Sliding Window Maximum',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'sliding-window',
  authored: true,
  statement:
    'Given an integer array `nums` and a window size `k`, return an array of the maximum value in each contiguous window of size `k` as it slides from the start of `nums` to the end.',
  examples: [
    { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]' },
    { input: 'nums = [1], k = 1', output: '[1]' },
  ],
  constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an integer array up to 10⁵ elements and a window size k ≤ n. Output: an array of length n − k + 1, the max of each contiguous size-k window as it slides one step at a time.',
      rubric: ['Notes output length n − k + 1', 'Describes windows sliding one step at a time'],
    },
    whatToFind: {
      modelAnswer:
        'A running-maximum-under-a-shrinking-and-growing-window task: report the max for every window position, where consecutive windows overlap in all but two elements.',
      rubric: ['Frames it as max-per-window across all positions', 'Notices consecutive windows overlap heavily'],
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10⁵ means recomputing each window\'s max from scratch (O(k) per window, O(n·k) total) can hit ~10¹⁰ in the worst case — far too slow. O(n) overall is the target, which means each element should be examined only a constant amortized number of times.',
      rubric: ['Derives that O(n·k) is too slow from n up to 10⁵', 'States the O(n) amortized-per-element target'],
    },
    bruteForce: {
      modelAnswer:
        'For each window start, scan its k elements to find the max. O(n·k) time overall, O(1) extra space (O(n−k+1) for the output).',
      rubric: ['Names the per-window linear scan', 'States O(n·k) time'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The waste: rescanning a window\'s elements when most of them were already scanned in the previous window, and worse, scanning candidates that can never be the max again because a larger element sits ahead of them in the window. Keep a deque of indices with strictly decreasing values — discard from the back any index whose value is beaten by the new element (it\'s dead weight forever), and discard from the front any index that has fallen out of the window. The front is always the current max. Pattern: Monotonic Stack (as a deque) inside a Sliding Window.',
      rubric: ['Names the waste: rescanning + keeping candidates that can never win again', 'Proposes a monotonic decreasing deque of indices'],
      acceptedPatterns: ['monotonic-stack', 'sliding-window'],
    },
    algorithm: {
      modelAnswer:
        'Maintain a deque of indices whose values are strictly decreasing. For each i: pop from the back while nums[back] <= nums[i] (they\'re now useless — a bigger, more-recent value beats them for the rest of their lifetime); push i to the back. Pop from the front if it has slid out of the window, i.e. front <= i − k. Once i >= k − 1, the front index holds the current window\'s max — append nums[front] to the result. Each index is pushed once and popped at most once, so total work is O(n). Space O(k) for the deque.',
      rubric: [
        'Deque of indices, strictly decreasing values, pops stale-smaller from back before push',
        'Pops out-of-window index from front, records front as max once window is full size',
        'States O(n) time with amortized reasoning (each index in/out once)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force rescans all k elements per window — O(n·k), and it wastes effort on elements that can never become the max again once a bigger element appears after them in the window. That points at a monotonic deque: I keep indices with strictly decreasing values, drop smaller trailing values from the back when a bigger one arrives, and drop indices that fell out of the window from the front. The front is always the window\'s max. Each index enters and leaves the deque once, so it\'s O(n) time overall, O(k) space.',
      rubric: ['Follows the script template end-to-end', 'States the monotonic-deque insight and final complexity'],
    },
  },
  code: {
    signature: 'export function maxSlidingWindow(nums: number[], k: number): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7], label: 'example' },
      { args: [[1], 1], expected: [1], label: 'single element window equals array' },
      { args: [[9, 8, 7, 6], 2], expected: [9, 8, 7], label: 'strictly decreasing' },
      { args: [[4, 4, 4, 4], 2], expected: [4, 4, 4], label: 'all equal values', hidden: true },
      { args: [[1, 2, 3, 4, 5], 5], expected: [5], label: 'window size equals array length', hidden: true },
      { args: [[5, 3, 8, 2, 9, 1], 3], expected: [8, 8, 9, 9], label: 'mixed values', hidden: true },
    ],
    referenceSolution:
      'export function maxSlidingWindow(nums: number[], k: number): number[] {\n  const deque: number[] = []\n  const result: number[] = []\n  for (let i = 0; i < nums.length; i++) {\n    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {\n      deque.pop()\n    }\n    deque.push(i)\n    if (deque[0] <= i - k) {\n      deque.shift()\n    }\n    if (i >= k - 1) {\n      result.push(nums[deque[0]])\n    }\n  }\n  return result\n}\n',
    complexity: { time: 'O(n)', space: 'O(k)' },
  },
}
