import type { Problem } from '../../types'

export const coinChange: Problem = {
  id: 'coin-change',
  leetcodeId: 322,
  title: 'Coin Change',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'dp-1d',
  authored: true,
  statement:
    'Given `coins` of distinct denominations and an `amount`, return the **fewest** coins needed to make exactly that amount (unlimited supply of each coin), or `-1` if impossible. `amount = 0` needs `0` coins.',
  examples: [
    { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '5 + 5 + 1.' },
    { input: 'coins = [2], amount = 3', output: '-1' },
    { input: 'coins = [1], amount = 0', output: '0' },
  ],
  constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: ≤12 denominations (unlimited supply) and an amount ≤ 10⁴. Output: minimum coin *count*, −1 when unreachable, 0 for amount 0. Count only — the actual coins aren\'t needed.',
      rubric: ['Unlimited supply registered', 'Count-only output + both sentinels'],
      teachingNote:
        '"Fewest/most ways to build a number from pieces" is the DP doorway. Also note what\'s *not* asked (the coin list itself) — reconstructing solutions is extra machinery you shouldn\'t build unprompted.',
    },
    whatToFind: {
      modelAnswer: 'A minimization over all ways to compose the amount — optimal substructure: the best way to make `a` ends with some coin `c`, leaving the best way to make `a − c`.',
      rubric: ['States the optimal substructure sentence', 'Min over last-coin choices'],
      teachingNote:
        'Force yourself to say the substructure aloud: "the answer for `a` is 1 + the best answer among `a − c`". If you can\'t phrase a problem this way, DP is the wrong tool; if you can, you\'re halfway done.',
    },
    constraintsHint: {
      modelAnswer:
        'amount ≤ 10⁴ × 12 coins = 1.2×10⁵ state-transitions — tiny. The greedy trap: huge denominations don\'t make greedy valid (coins = [1,3,4], amount 6: greedy 4+1+1 = 3, optimal 3+3 = 2).',
      rubric: ['States × choices budget computed', 'Names the greedy counterexample'],
      teachingNote:
        'Your known confusion runs the other way too — people over-apply DP to pair-sums, and under-apply it here by greedy instinct. The [1,3,4]/6 counterexample is worth memorizing verbatim as your anti-greedy test.',
    },
    bruteForce: {
      modelAnswer:
        'Recursively try every coin from the remaining amount: branching factor 12, depth up to amount → exponential (12^depth) with massive repetition of subamounts.',
      rubric: ['Recursive enumeration described', 'Exponential + repeated subproblems named'],
      teachingNote:
        'Say "the recursion tree recomputes the same remaining-amount many times" — identifying *repeated subproblems* (not just slowness) is what licenses DP, and interviewers listen for that exact observation.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The waste is exact recomputation: minCoins(7) is re-derived along every path that reaches 7. There are only `amount + 1` distinct subproblems — cache them, or build bottom-up: dp[a] = fewest coins for amount a. Pattern: DP (1-D, unbounded).',
      rubric: ['Waste: identical subamounts recomputed', 'Only amount+1 distinct states → table'],
      acceptedPatterns: ['dp'],
      teachingNote:
        'The state-count argument ("only amount+1 distinct questions exist") converts exponential to linear-ish and is the entire justification of DP. Count states before writing any recurrence.',
    },
    algorithm: {
      modelAnswer:
        'dp[0] = 0, dp[1..amount] = ∞. For a from 1 to amount: dp[a] = 1 + min(dp[a − c]) over coins c ≤ a. Answer dp[amount], −1 if still ∞. Time O(amount × coins), space O(amount).',
      rubric: [
        'Base case dp[0] = 0 and ∞ initialization',
        'Correct transition over coins ≤ a',
        'States O(amount·coins)/O(amount)',
      ],
      teachingNote:
        'Define the table meaning in one sentence *before* writing the loop — "dp[a] = fewest coins summing to exactly a". Every DP bug traces back to a fuzzy table definition.',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be recursively trying every coin from every remaining amount — exponential, and it recomputes the same subamounts constantly. Greedy fails (coins 1,3,4 for amount 6). This is a 1-D DP: only amount+1 distinct subproblems exist, and dp[a] = 1 + min over coins of dp[a−c]. I\'ll fill the table bottom-up from dp[0]=0. Time O(amount·coins), space O(amount); unreachable stays ∞ → −1.',
      rubric: ['Template followed incl. the greedy counterexample', 'Recurrence + complexity stated'],
      teachingNote:
        'Preempting "why not greedy?" with the counterexample — before the interviewer asks — is a scripted senior move on every coin problem. Bake it into your opener.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Define the table in a sentence, then the base case',
      code: '// dp[a] = fewest coins summing to exactly a\nconst dp = new Array(amount + 1).fill(Infinity)   // Infinity = "not yet reachable"\ndp[0] = 0                                         // zero coins make zero',
    },
    {
      label: '2. The recurrence: best way to make a ends with some coin c',
      code: 'for (let a = 1; a <= amount; a++) {\n  for (const c of coins) {\n    if (c <= a && dp[a - c] + 1 < dp[a]) {\n      dp[a] = dp[a - c] + 1   // one more coin than the best for the remainder\n    }\n  }\n}',
    },
    {
      label: '3. Unreachable stays Infinity → −1',
      code: 'return dp[amount] === Infinity ? -1 : dp[amount]',
    },
  ],
  code: {
    signature: 'export function coinChange(coins: number[], amount: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 2, 5], 11], expected: 3, label: 'example' },
      { args: [[2], 3], expected: -1, label: 'impossible' },
      { args: [[1], 0], expected: 0, label: 'zero amount' },
      { args: [[1, 3, 4], 6], expected: 2, label: 'greedy trap', hidden: true },
      { args: [[186, 419, 83, 408], 6249], expected: 20, label: 'large amount', hidden: true },
      { args: [[5], 5], expected: 1, label: 'exact single coin', hidden: true },
    ],
    referenceSolution:
      'export function coinChange(coins: number[], amount: number): number {\n  const dp = new Array(amount + 1).fill(Infinity)\n  dp[0] = 0\n  for (let a = 1; a <= amount; a++) {\n    for (const c of coins) {\n      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount]\n}\n',
    complexity: { time: 'O(amount · coins)', space: 'O(amount)' },
  },
}
