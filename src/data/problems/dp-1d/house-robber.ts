import type { Problem } from '../../types'

export const houseRobber: Problem = {
  id: 'house-robber',
  leetcodeId: 198,
  title: 'House Robber',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'dp-1d',
  authored: true,
  statement:
    'Given `nums` where `nums[i]` is the money in house `i`, return the maximum you can rob without ever robbing two **adjacent** houses.',
  examples: [
    { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Houses 0 and 2.' },
    { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Houses 0, 2, 4.' },
  ],
  constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: a non-empty array of non-negative values. Output: one number — the best total under the no-two-adjacent rule. Selection is implicit; only the sum is returned.',
      rubric: ['Adjacency constraint stated', 'Sum-only output'],
    },
    whatToFind: {
      modelAnswer: 'A max-value subset selection under a positional constraint. Substructure: the best over the first i houses either skips house i or takes it plus the best through i−2.',
      rubric: ['Take-or-skip decomposition stated', 'Max-optimization category'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 100 — trivially small; the problem is a recurrence-writing exercise. Non-negative values mean skipping is never *forced* by negatives.',
      rubric: ['Size irrelevant, technique central', 'Non-negativity observation'],
    },
    bruteForce: {
      modelAnswer: 'Enumerate every subset without adjacent pairs and take the best sum: exponential (Fibonacci-many valid subsets), re-deriving overlapping suffixes constantly.',
      rubric: ['Subset enumeration named', 'Exponential + overlap stated'],
    },
    wasteAndPattern: {
      modelAnswer:
        'All that branching collapses into one question per index: "best through house i" — recomputed exponentially by the brute force, but only n distinct. dp[i] = max(dp[i−1], nums[i] + dp[i−2]); two rolling variables suffice. Pattern: DP (1-D).',
      rubric: ['n distinct states argument', 'The take/skip recurrence written'],
      acceptedPatterns: ['dp'],
    },
    algorithm: {
      modelAnswer:
        'prev2 = 0, prev1 = 0. For each x: cur = max(prev1, x + prev2); shift prev2 = prev1, prev1 = cur. Return prev1. Time O(n), space O(1).',
      rubric: ['Rolling two-variable form', 'Correct shift order', 'States O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be enumerating all non-adjacent subsets — exponential with massive overlap. Each house poses one binary question whose answer depends only on the two previous answers: rob it (value + best through i−2) or skip it (best through i−1). That\'s a 1-D DP compressible to two rolling variables. Time O(n), space O(1).',
      rubric: ['Template followed with the two-variable compression', 'Recurrence stated inline'],
    },
  },
  code: {
    signature: 'export function rob(nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 2, 3, 1]], expected: 4, label: 'example' },
      { args: [[2, 7, 9, 3, 1]], expected: 12, label: 'example 2' },
      { args: [[5]], expected: 5, label: 'single house' },
      { args: [[3, 10]], expected: 10, label: 'two houses', hidden: true },
      { args: [[0, 0, 0]], expected: 0, label: 'all zeros', hidden: true },
      { args: [[400, 1, 1, 400]], expected: 800, label: 'ends beat middle', hidden: true },
    ],
    referenceSolution:
      'export function rob(nums: number[]): number {\n  let prev2 = 0\n  let prev1 = 0\n  for (const x of nums) {\n    const cur = Math.max(prev1, x + prev2)\n    prev2 = prev1\n    prev1 = cur\n  }\n  return prev1\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
