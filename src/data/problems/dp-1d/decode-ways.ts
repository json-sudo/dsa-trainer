import type { Problem } from '../../types'

export const decodeWays: Problem = {
  id: 'decode-ways',
  leetcodeId: 91,
  title: 'Decode Ways',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'dp-1d',
  authored: true,
  statement:
    'A message of digits can be decoded by mapping "1"→\'A\', "2"→\'B\', …, "26"→\'Z\'. Given a digit string `s`, return the number of ways it can be decoded. A "0" is only ever valid as the second digit of a two-digit code ("10" or "20") — it can never stand alone or lead a two-digit code.',
  examples: [
    { input: 's = "12"', output: '2', explanation: '"AB" (1,2) or "L" (12).' },
    { input: 's = "226"', output: '3', explanation: '"BZ" (2,26), "VF" (22,6), "BBF" (2,2,6).' },
    { input: 's = "06"', output: '0', explanation: 'Leading zero — no valid decoding.' },
  ],
  constraints: ['1 <= s.length <= 100', 's contains only digits', 's may contain leading zeros as a trap case'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a digit string up to length 100, which may itself be malformed (leading/embedded zeros). Output: a count of valid decodings — a number, not the decodings themselves, which hints the answer can be built incrementally rather than by enumerating strings.',
      rubric: ['Notes output is a count, suggesting incremental counting over enumeration', 'Flags that s may contain zeros that break decodability'],
    },
    whatToFind: {
      modelAnswer:
        'A counting task over ways to split the string into 1- or 2-digit valid codes — structurally identical to counting paths/tilings: at each position I either take 1 step (one digit) or 2 steps (two digits), and I need the number of ways to reach the end.',
      rubric: ['Recognizes it as counting valid splits, not listing them', 'Draws the 1-step/2-step analogy to step-counting DP'],
    },
    constraintsHint: {
      modelAnswer:
        's.length ≤ 100 is tiny — even an O(n²) or exponential-looking recursion over positions is fine at this scale, so the constraint isn\'t forcing a specific complexity so much as confirming a per-position DP (O(n)) will trivially fit and any correct recursive approach with memoization is acceptable.',
      rubric: ['Notes n ≤ 100 is small enough that even naive memoized recursion fits', 'Concludes an O(n) DP is comfortably sufficient, not strictly demanded by scale alone'],
    },
    bruteForce: {
      modelAnswer:
        'Recurse from position i: if s[i] !== \'0\', count decode(i+1) ways using one digit; if the two-digit substring s[i..i+1] is between "10" and "26", add decode(i+2). Base case: reaching the end contributes 1 way. Without memoization this re-solves the same suffix positions repeatedly — exponential, O(2ⁿ) in the worst case (all digits 1 or 2, maximal branching).',
      rubric: ['States the one-digit / two-digit branch recursion with the validity checks', 'Notes unmemoized recursion recomputes overlapping suffixes, O(2ⁿ)'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The recursion re-solves decode(i) independently every time a different earlier branch reaches position i — but decode(i) only ever depends on decode(i+1) and decode(i+2), so its value is the same no matter which path arrived there. Cache it: dp[i] = number of ways to decode the suffix starting at i, filled from the end backward (or an equivalent forward formulation counting prefixes). Pattern: DP.',
      rubric: ['Names the waste: identical suffix subproblems solved repeatedly across branches', 'Proposes memoizing/tabulating by position since decode(i) depends only on i'],
      acceptedPatterns: ['dp'],
    },
    algorithm: {
      modelAnswer:
        'Let dp[i] = number of ways to decode the first i characters, dp[0] = 1 (empty prefix), dp[1] = 1 if s[0] !== \'0\' else 0. For i from 2 to n: dp[i] = 0; if s[i-1] !== \'0\', dp[i] += dp[i-1] (take the last digit alone); if the two-char substring s[i-2..i-1] parses between 10 and 26 inclusive, dp[i] += dp[i-2] (take the last two digits together). Answer is dp[n]. Time O(n), space O(n) (rollable to O(1) with two running variables since only the last two dp values are ever needed).',
      rubric: [
        'Correct dp[i] recurrence combining dp[i-1] (single digit, non-zero) and dp[i-2] (two digits, 10-26)',
        'Handles dp[0]=1 and the leading-zero dp[1] edge case correctly',
        'States O(n) time and notes it rolls to O(1) space',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Naive recursion branching on one-digit vs two-digit decodes at each position resolves the same suffix repeatedly across different call paths — exponential blowup. Since decode(i) depends only on decode(i+1) and decode(i+2), I\'ll build it bottom-up: dp[i] is the ways to decode the first i characters, adding dp[i-1] when the last digit alone is valid (non-zero) and dp[i-2] when the last two digits form 10-26. dp[0]=1 handles the empty prefix, and I\'m careful with a leading "0" giving 0 ways. That\'s O(n) time, and since I only ever need the last two values, I can roll it down to O(1) space.',
      rubric: ['States the overlapping-suffix waste and the dp[i-1]/dp[i-2] recurrence', 'Mentions the zero-handling edge case and the O(n) time / O(1)-rollable space'],
    },
  },
  code: {
    signature: 'export function numDecodings(s: string): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['12'], expected: 2, label: 'example AB or L' },
      { args: ['226'], expected: 3, label: 'example BZ, VF, BBF' },
      { args: ['06'], expected: 0, label: 'leading zero is invalid' },
      { args: ['0'], expected: 0, label: 'single zero' },
      { args: ['10'], expected: 1, label: 'zero valid only as second digit' },
      { args: ['100'], expected: 0, label: 'zero cannot follow another zero-forming gap', hidden: true },
      { args: ['27'], expected: 1, label: 'two digits over 26 must split', hidden: true },
      { args: ['1111111111'], expected: 89, label: 'long all-ones fibonacci-like growth', hidden: true },
      { args: ['2101'], expected: 1, label: 'zeros forcing a unique decoding', hidden: true },
    ],
    referenceSolution:
      'export function numDecodings(s: string): number {\n  const n = s.length\n  if (n === 0) return 0\n  let prev2 = 1 // dp[i-2], starts as dp[0] = 1\n  let prev1 = s[0] !== \'0\' ? 1 : 0 // dp[1]\n  for (let i = 2; i <= n; i++) {\n    let current = 0\n    if (s[i - 1] !== \'0\') current += prev1\n    const twoDigit = Number(s.slice(i - 2, i))\n    if (twoDigit >= 10 && twoDigit <= 26) current += prev2\n    prev2 = prev1\n    prev1 = current\n  }\n  return prev1\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
