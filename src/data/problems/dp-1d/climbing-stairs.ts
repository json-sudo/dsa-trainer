import type { Problem } from '../../types'

export const climbingStairs: Problem = {
  id: 'climbing-stairs',
  leetcodeId: 70,
  title: 'Climbing Stairs',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'dp-1d',
  authored: true,
  statement:
    'You are climbing a staircase of `n` steps. Each move you climb either 1 or 2 steps. Return the number of **distinct ways** to reach the top.',
  examples: [
    { input: 'n = 2', output: '2', explanation: '1+1, or 2.' },
    { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' },
  ],
  constraints: ['1 <= n <= 45'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a single integer n (step count). Output: a count of distinct 1/2-step move sequences that sum to n. Order matters (1+2 ≠ 2+1) — this is compositions, not partitions.',
      rubric: ['Counts ordered sequences, not sets', 'Output is a plain count, not the sequences themselves'],
      teachingNote:
        'Say "ordered" out loud early — confusing this with partition-counting (unordered) is the most common first-minute slip on this problem.',
    },
    whatToFind: {
      modelAnswer:
        'The number of ways to reach step n equals the number of ways to reach step n−1 (then take a final 1-step) plus the number of ways to reach step n−2 (then take a final 2-step). Two disjoint, exhaustive last-move cases.',
      rubric: ['Decomposes by the last move taken', 'Recognizes the two cases are disjoint and exhaustive'],
      teachingNote:
        '"What was the last move?" is the standard lever for turning a counting problem into a recurrence — it works whenever moves are drawn from a small fixed set.',
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 45 keeps the values small (Fibonacci-shaped growth, well within 32-bit range at n=45), so overflow is a non-issue — but naive recursion on the same recurrence is exponential and n=45 alone would already be slow without memoization.',
      rubric: ['Notes the recurrence is Fibonacci-shaped', 'Flags naive recursion as exponential despite small n'],
      teachingNote:
        'Small n can mislead into thinking brute force is fine — walk through why 2^45 recursive calls is not, even though n itself looks tiny.',
    },
    bruteForce: {
      modelAnswer:
        'Recurse directly: ways(n) = ways(n-1) + ways(n-2), base cases ways(0)=1, ways(1)=1. Correct, but recomputes the same subproblems exponentially many times: O(2^n) time.',
      rubric: ['States the recursive base cases correctly', 'Names the complexity as exponential'],
      teachingNote:
        'This is literally naive Fibonacci — if the candidate has ever hand-traced the Fibonacci call tree and seen the repeated subcalls, they already have the waste argument.',
    },
    wasteAndPattern: {
      modelAnswer:
        'ways(k) gets recomputed once for every path through the call tree that reaches k — exponentially many times for the same answer. Cache each ways(k) the first time it is computed (memoization), or better, build it bottom-up since each state only needs the previous two. Pattern: 1D DP.',
      rubric: ['Waste: repeated recomputation of identical subproblems', 'Proposes caching/bottom-up as the fix'],
      acceptedPatterns: ['dp'],
      teachingNote:
        'The jump from "memoize" to "just keep the last two values" is the space-optimization insight worth stating explicitly: a linear DP array is itself often wasteful when only a fixed window of history is read.',
    },
    algorithm: {
      modelAnswer:
        'Track only the last two values: prev2 = ways(0) = 1, prev1 = ways(1) = 1. For i from 2 to n: current = prev1 + prev2; shift prev2 = prev1, prev1 = current. Return prev1 (or 1 directly if n < 2). O(n) time, O(1) space — no array needed.',
      rubric: ['Two running variables replace a full DP array', 'Correct shift/update order each iteration', 'States O(n)/O(1)'],
      teachingNote:
        'This is the moment to name "rolling variables" as the space-optimized cousin of tabulation — most 1D DPs that only look back a constant number of steps compress this way.',
    },
    interviewScript: {
      modelAnswer:
        'The last move to reach step n was either a 1-step from n−1 or a 2-step from n−2, giving ways(n) = ways(n-1) + ways(n-2) — Fibonacci in disguise. Naive recursion recomputes shared subproblems exponentially; since each state only depends on the previous two, I don\'t even need a full DP array — two rolling variables suffice. O(n) time, O(1) space.',
      rubric: ['Template followed: decompose by last move, name the waste, land on O(1)-space iteration', 'Complexity stated'],
      teachingNote:
        'Ending on "I don\'t need an array" signals space-consciousness beyond just getting a correct DP — interviewers weight that follow-through highly on easy problems.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Handle the trivial base cases',
      code: 'if (n <= 2) return n   // 1 step: 1 way; 2 steps: 2 ways (1+1, 2)',
    },
    {
      label: '2. Seed the rolling pair for steps 1 and 2',
      code: 'let prev2 = 1   // ways(1)\nlet prev1 = 2   // ways(2)',
    },
    {
      label: '3. Roll forward: each step is the sum of the previous two',
      code: 'let current = prev1\nfor (let i = 3; i <= n; i++) {\n  current = prev1 + prev2   // last move was 1-step or 2-step\n  prev2 = prev1\n  prev1 = current\n}',
    },
    {
      label: '4. Return the final rolled value',
      code: 'return current',
    },
  ],
  code: {
    signature: 'export function climbStairs(n: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [2], expected: 2, label: 'example n=2' },
      { args: [3], expected: 3, label: 'example n=3' },
      { args: [1], expected: 1, label: 'n=1 base case' },
      { args: [4], expected: 5, label: 'n=4', hidden: true },
      { args: [5], expected: 8, label: 'n=5', hidden: true },
      { args: [45], expected: 1836311903, label: 'n=45 upper bound, no overflow', hidden: true },
    ],
    referenceSolution:
      'export function climbStairs(n: number): number {\n  if (n <= 2) return n\n  let prev2 = 1\n  let prev1 = 2\n  let current = prev1\n  for (let i = 3; i <= n; i++) {\n    current = prev1 + prev2\n    prev2 = prev1\n    prev1 = current\n  }\n  return current\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
