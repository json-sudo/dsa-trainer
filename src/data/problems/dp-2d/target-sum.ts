import type { Problem } from '../../types'

export const targetSum: Problem = {
  id: 'target-sum',
  leetcodeId: 494,
  title: 'Target Sum',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'dp-2d',
  authored: true,
  statement:
    'Given non-negative integers `nums` and a `target`, assign `+` or `-` to every element; return **how many** assignments make the expression equal `target`.',
  examples: [
    { input: 'nums = [1,1,1,1,1], target = 3', output: '5' },
    { input: 'nums = [1], target = 1', output: '1' },
  ],
  constraints: ['1 <= nums.length <= 20', '0 <= nums[i] <= 1000', 'sum(nums) <= 1000', '-1000 <= target <= 1000'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: ≤20 non-negative numbers (total ≤ 1000) and a possibly-negative target. Output: a *count* of sign assignments. Zeros matter — each zero doubles the count (±0 both work).',
      rubric: ['Count (not existence/max) output', 'Zeros-double-count subtlety'],
    },
    whatToFind: {
      modelAnswer:
        'Count of ways to split nums into a plus-set P and minus-set N with sum(P) − sum(N) = target — algebra: sum(P) = (total + target) / 2, a subset-sum *count*.',
      rubric: ['The subset-sum reduction derived', 'Parity/negativity feasibility check implied'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 20 invites 2²⁰ ≈ 10⁶ enumeration — passable. But sum ≤ 1000 is the better hint: states are (index, running sum) with ≤ 20×2001 of them, so DP is linear-ish. If (total + target) is odd or negative, the answer is 0 immediately.',
      rubric: ['Both budgets computed (2²⁰ vs 20·2001)', 'The odd/negative early exit'],
    },
    bruteForce: {
      modelAnswer: 'Try both signs recursively for each element: O(2ⁿ) — about 10⁶ at n = 20, borderline-acceptable but recomputing identical (index, sum) states.',
      rubric: ['Full binary recursion', 'States O(2ⁿ) and the state overlap'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Distinct (index, running-sum) pairs number only n × (2·sum+1), yet the recursion revisits them exponentially. Either memoize that state, or reduce to counting subsets with sum (total+target)/2 and run the classic 0/1 knapsack-count table. Pattern: DP (2-D state; Backtracking accepted given n ≤ 20).',
      rubric: ['State-count argument', 'Knapsack-count reduction or memoized recursion'],
      acceptedPatterns: ['dp', 'backtracking'],
    },
    algorithm: {
      modelAnswer:
        's = (total + target) / 2; return 0 if total < |target| or (total + target) odd. dp[j] = ways to hit sum j; dp[0] = 1; for each num, for j from s down to num: dp[j] += dp[j − num]. Answer dp[s]. The *reverse* j loop enforces use-once. Time O(n·s), space O(s).',
      rubric: [
        'Feasibility pre-checks',
        'Reverse iteration for 0/1 semantics',
        'States O(n·s)/O(s)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be trying both signs everywhere — 2²⁰, about a million, workable but wasteful since (index, sum) states repeat. Algebra tightens it: plus-set sum must equal (total + target)/2, so this is counting subsets hitting a fixed sum — 0/1 knapsack counting with a 1-D rolled table iterated backward, after odd/negative feasibility checks. Time O(n·sum), space O(sum).',
      rubric: ['Template followed incl. the algebraic reduction', 'Reverse-loop detail stated'],
    },
  },
  code: {
    signature: 'export function findTargetSumWays(nums: number[], target: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 1, 1, 1, 1], 3], expected: 5, label: 'example' },
      { args: [[1], 1], expected: 1, label: 'single element' },
      { args: [[1], 2], expected: 0, label: 'unreachable target' },
      { args: [[0, 0, 1], 1], expected: 4, label: 'zeros double the count', hidden: true },
      { args: [[100], -100], expected: 1, label: 'negative target', hidden: true },
      { args: [[1, 2, 3, 4, 5], 3], expected: 3, label: 'several ways', hidden: true },
    ],
    referenceSolution:
      'export function findTargetSumWays(nums: number[], target: number): number {\n  const total = nums.reduce((a, b) => a + b, 0)\n  if (total < Math.abs(target) || (total + target) % 2 !== 0) return 0\n  const s = (total + target) / 2\n  const dp = new Array(s + 1).fill(0)\n  dp[0] = 1\n  for (const num of nums) {\n    for (let j = s; j >= num; j--) {\n      dp[j] += dp[j - num]\n    }\n  }\n  return dp[s]\n}\n',
    complexity: { time: 'O(n·sum)', space: 'O(sum)' },
  },
}
