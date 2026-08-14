import type { Problem } from '../../types'

export const maximumSubarray: Problem = {
  id: 'maximum-subarray',
  leetcodeId: 53,
  title: "Maximum Subarray (Kadane's)",
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'dp-1d',
  authored: true,
  statement: 'Given an integer array `nums` (negatives allowed), return the **largest sum** of any non-empty contiguous subarray.',
  examples: [
    { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1].' },
    { input: 'nums = [1]', output: '1' },
    { input: 'nums = [5,4,-1,7,8]', output: '23' },
  ],
  constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a non-empty integer array with negatives possible. Output: the max contiguous sum — non-empty, so an all-negative array returns its largest (least negative) element, not 0.',
      rubric: ['All-negative case: answer is the max element', 'Contiguity emphasized'],
    },
    whatToFind: {
      modelAnswer: 'Max over all O(n²) contiguous ranges of their sum — an optimization with per-position substructure: the best subarray ending at i either extends the best ending at i−1 or restarts.',
      rubric: ['Extend-or-restart substructure stated', 'Max-over-ranges framing'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10⁵ → O(n²) range enumeration (~10¹⁰ with sums) is out; budget O(n). Negatives are why prefix tricks or DP are needed at all — all-positive would be trivial (whole array).',
      rubric: ['O(n) budget derived', 'Notes negatives create the problem'],
    },
    bruteForce: {
      modelAnswer: 'Two nested loops over (start, end) with a running sum per start: O(n²) time, O(1) space.',
      rubric: ['Pair enumeration with running sum', 'States O(n²)'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The brute force re-examines every prefix of every start — but a subarray ending at i is just (best ending at i−1) + nums[i], or a restart at nums[i] when that best was negative dead weight. One value carries all history. Pattern: DP (Kadane) — equivalently a One Pass with running state.',
      rubric: ['Waste: overlapping range sums recomputed', 'Extend-or-restart recurrence (drop negative prefix)'],
      acceptedPatterns: ['dp', 'one-pass'],
    },
    algorithm: {
      modelAnswer:
        'endingHere = nums[0], best = nums[0]. For i ≥ 1: endingHere = max(nums[i], endingHere + nums[i]); best = max(best, endingHere). Return best. Time O(n), space O(1).',
      rubric: ['Kadane loop with both maxes', 'Initialization from nums[0] (handles all-negative)', 'States O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be summing every (start, end) range — O(n²), too slow at 10⁵. The best subarray ending at each index either extends its predecessor or restarts when the running sum has gone negative — a one-variable DP known as Kadane\'s algorithm. I\'ll sweep once carrying "best ending here" and a global best, initialized from the first element so all-negative arrays work. Time O(n), space O(1).',
      rubric: ['Template followed with extend-or-restart', 'All-negative initialization detail'],
    },
  },
  code: {
    signature: 'export function maxSubArray(nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, label: 'example' },
      { args: [[1]], expected: 1, label: 'single element' },
      { args: [[5, 4, -1, 7, 8]], expected: 23, label: 'mostly positive' },
      { args: [[-3, -1, -2]], expected: -1, label: 'all negative', hidden: true },
      { args: [[-1, 10, -1]], expected: 10, label: 'peak in middle', hidden: true },
      { args: [[2, -1, 2, -1, 2]], expected: 4, label: 'survive small dips', hidden: true },
    ],
    referenceSolution:
      'export function maxSubArray(nums: number[]): number {\n  let endingHere = nums[0]\n  let best = nums[0]\n  for (let i = 1; i < nums.length; i++) {\n    endingHere = Math.max(nums[i], endingHere + nums[i])\n    best = Math.max(best, endingHere)\n  }\n  return best\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
