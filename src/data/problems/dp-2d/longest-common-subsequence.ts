import type { Problem } from '../../types'

export const longestCommonSubsequence: Problem = {
  id: 'longest-common-subsequence',
  leetcodeId: 1143,
  title: 'Longest Common Subsequence',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'dp-2d',
  authored: true,
  statement:
    'Given strings `text1` and `text2`, return the length of their longest **common subsequence** — characters in order in both strings, not necessarily contiguous. Return `0` if none.',
  examples: [
    { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: '"ace".' },
    { input: 'text1 = "abc", text2 = "abc"', output: '3' },
    { input: 'text1 = "abc", text2 = "def"', output: '0' },
  ],
  constraints: ['1 <= text1.length, text2.length <= 1000', 'lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two strings up to 1000 chars each. Output: a length only. "Subsequence" ≠ "substring" — gaps allowed, order preserved.',
      rubric: ['Subsequence vs substring distinction made', 'Length-only output'],
      teachingNote:
        'Underline "subsequence" and say what it permits (gaps) and preserves (order). Half the wrong answers to this family come from silently solving the substring version.',
    },
    whatToFind: {
      modelAnswer:
        'Max length of a shared ordered selection — with two-index substructure: comparing prefixes text1[0..i) and text2[0..j), last characters either match (extend) or one must be dropped.',
      rubric: ['Two-prefix state named', 'Match-or-drop case analysis'],
      teachingNote:
        '"Two sequences" is the loudest 2-D DP tell there is. The state is almost always (prefix of A, prefix of B) — say the state before hunting the recurrence.',
    },
    constraintsHint: {
      modelAnswer: '1000 × 1000 = 10⁶ prefix pairs — an O(n·m) table fits comfortably. Anything exponential (subsequence enumeration: 2¹⁰⁰⁰) is absurd; the bounds point straight at the quadratic table.',
      rubric: ['n·m table budget computed', 'Exponential enumeration dismissed by the numbers'],
      teachingNote:
        'Two strings of length ~10³ each ⇒ ~10⁶ cell budget is the signature arithmetic of 2-D DP. Do this multiplication out loud; it *is* the algorithm selection.',
    },
    bruteForce: {
      modelAnswer:
        'Enumerate all subsequences of text1 (2ⁿ) and check each against text2 for subsequence-ness: O(2ⁿ · m) — dead on arrival at n = 1000.',
      rubric: ['Subsequence enumeration named', '2ⁿ blowup stated'],
      teachingNote:
        'When the brute force is this hopeless, don\'t belabor it — state it in one breath and move to the waste. Time spent here is time not spent on the recurrence.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The enumeration re-answers the same question — "LCS of these two prefixes" — astronomically often, but only (n+1)(m+1) distinct prefix pairs exist. dp[i][j]: match → 1 + dp[i−1][j−1]; else max(drop from either). Pattern: DP (2-D).',
      rubric: ['(n+1)(m+1) distinct states argument', 'Both recurrence branches written'],
      acceptedPatterns: ['dp'],
      teachingNote:
        'The recurrence has exactly two shapes — diagonal+1 on match, max-of-neighbors otherwise — and this pair reappears in Edit Distance and friends with small mutations. Learn it as the *parent* recurrence of the family.',
    },
    algorithm: {
      modelAnswer:
        '(n+1)×(m+1) table of zeros (row/column 0 = empty prefix). Fill row-major: dp[i][j] = text1[i−1] === text2[j−1] ? dp[i−1][j−1] + 1 : max(dp[i−1][j], dp[i][j−1]). Answer dp[n][m]. Time O(n·m), space O(n·m) (or two rolling rows → O(m)).',
      rubric: [
        'Zero-padded borders as base case',
        'Correct index offset (i−1 into the strings)',
        'Rolling-row space note',
      ],
      teachingNote:
        'The +1 padding trick (row 0 = empty prefix) removes every boundary if. Adopt it as your default DP table layout and off-by-ones largely disappear.',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be enumerating subsequences — 2ⁿ, hopeless. Two sequences means a 2-D DP over prefix pairs: only about a million exist at these bounds. dp[i][j] is the LCS of the first i and first j characters — matching last characters extend the diagonal, otherwise I drop a character from whichever side, taking the max. I\'ll fill a zero-padded table bottom-up. Time O(n·m), space O(n·m), reducible to two rows.',
      rubric: ['Template followed with the state definition sentence', 'Complexity incl. space reduction'],
      teachingNote:
        'Notice the script *defines the table meaning* in one sentence mid-flight. In DP interviews, that sentence is the deliverable; code is transcription.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Zero-padded (n+1)×(m+1) table — row/column 0 = empty prefix',
      code: '// dp[i][j] = LCS length of text1[0..i) and text2[0..j)\nconst dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))\n// the padding removes every boundary if-check',
    },
    {
      label: '2. Matching last characters ride the diagonal',
      code: "if (text1[i - 1] === text2[j - 1]) {\n  dp[i][j] = dp[i - 1][j - 1] + 1   // extend the shared subsequence\n}\n// note the i-1/j-1 offsets: row i corresponds to character i-1",
    },
    {
      label: '3. Otherwise drop a character from either side, keep the best',
      code: 'else {\n  dp[i][j] = Math.max(\n    dp[i - 1][j],   // drop from text1\n    dp[i][j - 1],   // drop from text2\n  )\n}',
    },
    {
      label: '4. Fill row-major; the corner is the answer',
      code: 'return dp[n][m]   // O(n·m) time; two rolling rows would give O(m) space',
    },
  ],
  code: {
    signature: 'export function longestCommonSubsequence(text1: string, text2: string): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['abcde', 'ace'], expected: 3, label: 'example' },
      { args: ['abc', 'abc'], expected: 3, label: 'identical' },
      { args: ['abc', 'def'], expected: 0, label: 'disjoint' },
      { args: ['a', 'a'], expected: 1, label: 'single chars', hidden: true },
      { args: ['bsbininm', 'jmjkbkjkv'], expected: 1, label: 'sparse overlap', hidden: true },
      { args: ['abcba', 'abcbcba'], expected: 5, label: 'palindromic strings', hidden: true },
    ],
    referenceSolution:
      'export function longestCommonSubsequence(text1: string, text2: string): number {\n  const n = text1.length\n  const m = text2.length\n  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))\n  for (let i = 1; i <= n; i++) {\n    for (let j = 1; j <= m; j++) {\n      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])\n    }\n  }\n  return dp[n][m]\n}\n',
    complexity: { time: 'O(n·m)', space: 'O(n·m)' },
  },
}
