import type { Problem } from '../../types'

export const minimumSizeSubarraySum: Problem = {
  id: 'minimum-size-subarray-sum',
  leetcodeId: 209,
  title: 'Minimum Size Subarray Sum',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'sliding-window',
  authored: true,
  statement:
    'Given an array of **positive** integers `nums` and a positive integer `target`, return the length of the shortest contiguous subarray whose sum is ≥ `target`. Return `0` if none exists.',
  examples: [
    { input: 'target = 7, nums = [2,3,1,2,4,3]', output: '2', explanation: '[4,3] has sum 7.' },
    { input: 'target = 4, nums = [1,4,4]', output: '1' },
    { input: 'target = 11, nums = [1,1,1,1,1,1,1,1]', output: '0' },
  ],
  constraints: ['1 <= target <= 10^9', '1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^4  (all positive)'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an array of strictly positive integers (up to 10⁵) and a large target. Output: the minimum length of a qualifying contiguous run, or 0. Positivity is the structural gift.',
      rubric: ['Flags all-positive values as significant', 'Output is a min length with a 0 sentinel'],
    },
    whatToFind: {
      modelAnswer: 'Shortest contiguous run with sum ≥ target — a minimization over windows with a threshold condition.',
      rubric: ['Shortest-run-with-property identified', 'Notes ≥ (not ==) threshold'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 10⁵ → O(n) or O(n log n). Because all values are positive, window sums are strictly monotone in both directions: growing adds, shrinking subtracts — exactly the property a two-edge sweep needs. (With negatives this would need prefix sums instead.)',
      rubric: ['Budget stated', 'Positivity → monotone window sums (window applicability)'],
    },
    bruteForce: {
      modelAnswer: 'For every start, extend until the sum reaches target and record the length: O(n²) time, O(1) space.',
      rubric: ['Every-start extension', 'States O(n²)', 'States space'],
    },
    wasteAndPattern: {
      modelAnswer:
        'When the window [l..r] first reaches the target, the brute force restarts from l+1 recomputing sums that differ only by nums[l]. Keep the running sum: subtract when advancing l, add when advancing r — both edges move only forward. Pattern: Sliding Window (variable, shrink-to-minimize).',
      rubric: ['Waste: sum recomputation across overlapping starts', 'Running sum with both edges monotone'],
      acceptedPatterns: ['sliding-window'],
    },
    algorithm: {
      modelAnswer:
        'sum = 0, l = 0, best = ∞. For each r: sum += nums[r]; while sum ≥ target: best = min(best, r − l + 1), sum −= nums[l], l++. Return best or 0. The inner while shrinks aggressively because every valid window should be minimized. Time O(n) (each index enters and leaves once), space O(1).',
      rubric: [
        'Grow-then-shrink-while-valid loop (shrink records answers)',
        'Amortized O(n) argument (each element enters/leaves once)',
        'Returns 0 sentinel when never valid',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be extending from every start — O(n²), too slow for 10⁵. Since all numbers are positive, window sums grow when I expand and shrink when I contract, so this is a classic variable sliding window: expand right until valid, then shrink left while still valid, recording the minimum. Time O(n), space O(1).',
      rubric: ['Template followed with positivity justification', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function minSubArrayLen(target: number, nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [7, [2, 3, 1, 2, 4, 3]], expected: 2, label: 'example' },
      { args: [4, [1, 4, 4]], expected: 1, label: 'single element suffices' },
      { args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0, label: 'no valid subarray' },
      { args: [15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]], expected: 2, label: 'answer mid-array', hidden: true },
      { args: [6, [6]], expected: 1, label: 'single-element array', hidden: true },
      { args: [10, [1, 2, 3, 4]], expected: 4, label: 'whole array needed', hidden: true },
    ],
    referenceSolution:
      'export function minSubArrayLen(target: number, nums: number[]): number {\n  let sum = 0\n  let l = 0\n  let best = Infinity\n  for (let r = 0; r < nums.length; r++) {\n    sum += nums[r]\n    while (sum >= target) {\n      best = Math.min(best, r - l + 1)\n      sum -= nums[l]\n      l++\n    }\n  }\n  return best === Infinity ? 0 : best\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
