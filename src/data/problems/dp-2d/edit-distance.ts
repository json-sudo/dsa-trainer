import type { Problem } from '../../types'

export const editDistance: Problem = {
  id: 'edit-distance',
  leetcodeId: 72,
  title: 'Edit Distance',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'dp-2d',
  authored: true,
  statement:
    'Given `word1` and `word2`, return the minimum number of operations — insert a character, delete a character, or replace a character — to convert `word1` into `word2`.',
  examples: [
    { input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse → rorse → rose → ros.' },
    { input: 'word1 = "intention", word2 = "execution"', output: '5' },
  ],
  constraints: ['0 <= word1.length, word2.length <= 500', 'lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two strings, either possibly empty. Output: minimum operation count with three ops allowed. Empty cases anchor everything: distance to "" is the other string\'s length.',
      rubric: ['Three operations enumerated', 'Empty-string base cases stated'],
    },
    whatToFind: {
      modelAnswer:
        'Minimum edit script length — with two-prefix substructure: converting word1[0..i) to word2[0..j) ends in a delete, insert, or replace/match, each leaving a smaller prefix pair.',
      rubric: ['Two-prefix state named', 'Ops mapped to the three neighbor cells'],
    },
    constraintsHint: {
      modelAnswer: '500 × 500 = 2.5×10⁵ prefix pairs — the classic 2-D table fits with ease. Two strings again → (i, j) state.',
      rubric: ['Table size computed', 'Two-strings → two-index state reflex'],
    },
    bruteForce: {
      modelAnswer:
        'Recursively try all three operations at every mismatch: 3^(n+m) paths, endlessly re-solving the same prefix pairs.',
      rubric: ['Ternary recursion described', 'Exponential + overlap stated'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Only (n+1)(m+1) distinct prefix-pair questions exist against 3^(n+m) explored paths. dp[i][j]: match → diagonal; else 1 + min(delete dp[i−1][j], insert dp[i][j−1], replace dp[i−1][j−1]). Pattern: DP (2-D, LCS\'s sibling).',
      rubric: ['State-count argument', 'All three transitions mapped to cells'],
      acceptedPatterns: ['dp'],
    },
    algorithm: {
      modelAnswer:
        '(n+1)×(m+1) table; row 0 = j (all inserts), column 0 = i (all deletes). Fill: chars equal → dp[i−1][j−1]; else 1 + min of the three neighbors. Answer dp[n][m]. Time O(n·m), space O(n·m) (rolling rows → O(m)).',
      rubric: ['Border initialization = lengths', 'Correct min-of-three transition', 'Space-reduction note'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be recursing over all three operations at each mismatch — 3^(n+m). Two strings means prefix-pair DP: dp[i][j] is the distance between the first i and j characters; equal last characters ride the diagonal free, otherwise one plus the cheapest of delete, insert, or replace — the three neighboring cells. Borders are the all-insert/all-delete cases. Time O(n·m), space O(n·m) or two rows.',
      rubric: ['Template followed with the ops→cells mapping', 'Borders and complexity stated'],
    },
  },
  code: {
    signature: 'export function minDistance(word1: string, word2: string): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['horse', 'ros'], expected: 3, label: 'example' },
      { args: ['intention', 'execution'], expected: 5, label: 'example 2' },
      { args: ['', 'abc'], expected: 3, label: 'empty source' },
      { args: ['abc', ''], expected: 3, label: 'empty target', hidden: true },
      { args: ['same', 'same'], expected: 0, label: 'identical strings', hidden: true },
      { args: ['a', 'b'], expected: 1, label: 'single replace', hidden: true },
    ],
    referenceSolution:
      'export function minDistance(word1: string, word2: string): number {\n  const n = word1.length\n  const m = word2.length\n  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))\n  for (let i = 0; i <= n; i++) dp[i][0] = i\n  for (let j = 0; j <= m; j++) dp[0][j] = j\n  for (let i = 1; i <= n; i++) {\n    for (let j = 1; j <= m; j++) {\n      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1]\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    }\n  }\n  return dp[n][m]\n}\n',
    complexity: { time: 'O(n·m)', space: 'O(n·m)' },
  },
}
