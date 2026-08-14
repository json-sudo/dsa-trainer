import type { Problem } from '../../types'

export const coinChangeII: Problem = {
  id: 'coin-change-ii',
  leetcodeId: 518,
  title: 'Coin Change II',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'dp-2d',
  authored: true,
  statement:
    'Given coins of distinct denominations (unlimited supply) and an `amount`, return the number of **combinations** that make the amount. Order does not matter: `1+2` and `2+1` are the same combination.',
  examples: [
    { input: 'amount = 5, coins = [1,2,5]', output: '4', explanation: '5, 2+2+1, 2+1+1+1, 1+1+1+1+1.' },
    { input: 'amount = 3, coins = [2]', output: '0' },
    { input: 'amount = 10, coins = [10]', output: '1' },
  ],
  constraints: ['1 <= coins.length <= 300', '1 <= coins[i] <= 5000, distinct', '0 <= amount <= 5000'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: distinct denominations, unlimited supply, amount ≤ 5000. Output: a count of *combinations* — unordered. The order-doesn\'t-matter clause is the crux of the whole problem.',
      rubric: ['Combinations-vs-permutations distinction front and center', 'amount 0 → 1 (empty combination)'],
    },
    whatToFind: {
      modelAnswer: 'Count unordered multisets of coins summing to the amount — a counting DP where the loop structure itself must prevent double-counting reorderings.',
      rubric: ['Multiset counting framing', 'Anticipates the double-count hazard'],
    },
    constraintsHint: {
      modelAnswer: '300 coins × 5000 amount = 1.5×10⁶ transitions — a 2-D-collapsible table fits easily. Answers can be large but stay in double precision here.',
      rubric: ['coins × amount budget', 'No overflow concern at these bounds'],
    },
    bruteForce: {
      modelAnswer:
        'Recursively subtract any coin at each step and count paths hitting 0: counts *sequences*, so 1+2 and 2+1 both count — wrong answer, and exponential besides.',
      rubric: ['Names the wrongness (sequence counting), not just slowness', 'Exponential noted'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The recursion\'s waste is symmetric duplication: every permutation of one combination is separately explored. Impose canonical order structurally — process coins one at a time, outer loop over coins: dp[j] += dp[j − coin] then means "combinations using only coins seen so far". Pattern: DP (unbounded knapsack count; loop order is the answer).',
      rubric: ['Waste: permutations of one multiset re-counted', 'Coin-outer loop as canonical ordering'],
      acceptedPatterns: ['dp'],
    },
    algorithm: {
      modelAnswer:
        'dp[0] = 1, rest 0. For each coin (outer), for j from coin to amount (inner, ascending — unlimited reuse): dp[j] += dp[j − coin]. Answer dp[amount]. Swapping the loops would count permutations; iterating j descending would forbid reuse. Time O(coins·amount), space O(amount).',
      rubric: [
        'Coin-outer / ascending-j-inner with both "wrong variant" contrasts',
        'dp[0]=1 base',
        'States complexity',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Naive recursion counts sequences — 1+2 and 2+1 both — which is wrong before it\'s slow. To count each multiset once I\'ll fix a canonical coin order structurally: outer loop over coins, inner ascending over amounts, so dp[j] always means "combinations from the coins considered so far". Ascending inner allows unlimited reuse; this is unbounded-knapsack counting. Time O(coins·amount), space O(amount).',
      rubric: ['Template adapted: correctness first, the loop-order fix', 'Both loop-variant contrasts mentioned'],
    },
  },
  code: {
    signature: 'export function change(amount: number, coins: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [5, [1, 2, 5]], expected: 4, label: 'example' },
      { args: [3, [2]], expected: 0, label: 'impossible' },
      { args: [10, [10]], expected: 1, label: 'single coin exact' },
      { args: [0, [7]], expected: 1, label: 'zero amount (empty combination)', hidden: true },
      { args: [500, [3, 5, 7, 8, 9, 10, 11]], expected: 35502874, label: 'large count', hidden: true },
      { args: [4, [1, 2]], expected: 3, label: 'order must not matter', hidden: true },
    ],
    referenceSolution:
      'export function change(amount: number, coins: number[]): number {\n  const dp = new Array(amount + 1).fill(0)\n  dp[0] = 1\n  for (const coin of coins) {\n    for (let j = coin; j <= amount; j++) {\n      dp[j] += dp[j - coin]\n    }\n  }\n  return dp[amount]\n}\n',
    complexity: { time: 'O(coins · amount)', space: 'O(amount)' },
  },
}
