import type { Problem } from '../../types'

export const interleavingString: Problem = {
  id: 'interleaving-string',
  leetcodeId: 97,
  title: 'Interleaving String',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'dp-2d',
  authored: true,
  statement:
    'Given strings `s1`, `s2`, and `s3`, determine whether `s3` can be formed by interleaving `s1` and `s2` — that is, whether `s3` can be split into chunks that come alternately (in any pattern) from `s1` and `s2` while preserving each string\'s own internal character order.',
  examples: [
    { input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"', output: 'true' },
    { input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"', output: 'false' },
    { input: 's1 = "", s2 = "", s3 = ""', output: 'true' },
  ],
  constraints: ['0 <= s1.length, s2.length <= 100', '0 <= s3.length <= 200', 'all strings consist of lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: three strings, s1 and s2 up to length 100 each, s3 up to length 200. Output: a boolean — can s3 be split into pieces that interleave from s1 and s2, each keeping its own left-to-right order.',
      rubric: ['Notes the three string lengths and that s3 must equal s1.length + s2.length', 'Output is a yes/no feasibility question'],
    },
    whatToFind: {
      modelAnswer:
        'A feasibility question over a 2D space of "how much of s1 and how much of s2 have I consumed so far" — at each prefix pair, does some interleaving reach it? Not "find the interleaving", just whether one exists.',
      rubric: ['Frames it as existence, not reconstruction', 'Recognizes state = (chars consumed from s1, chars consumed from s2)'],
    },
    constraintsHint: {
      modelAnswer:
        'First a hard filter: if s1.length + s2.length !== s3.length, immediately false — no interleaving can match a different total length. With both lengths ≤ 100, an O(n·m) DP table (up to ~10⁴ cells) is comfortably in budget; exponential branching over interleavings is not.',
      rubric: ['States the length-mismatch short-circuit', 'Derives an O(n·m) budget from the 100×100 bound'],
    },
    bruteForce: {
      modelAnswer:
        'Recursively try: does s3 continue with s1\'s next char (recurse consuming from s1) or s2\'s next char (recurse consuming from s2)? Branches on every s3 position where both options are available. Without memoization this revisits the same (i, j) state exponentially — O(2^(n+m)) time.',
      rubric: ['Describes the two-way branch (take next char from s1 or s2)', 'Names the exponential blowup from re-solving shared states'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The recursion re-derives the same "can (i chars of s1, j chars of s2) reach here" answer over and over — it only depends on (i, j), not on how we got there. Cache it: dp[i][j] = true iff s3\'s first i+j characters are achievable using exactly i from s1 and j from s2. Pattern: DP.',
      rubric: ['Names the waste: repeated recomputation of identical (i, j) subproblems', 'States the dp[i][j] definition precisely'],
      acceptedPatterns: ['dp'],
    },
    algorithm: {
      modelAnswer:
        'dp[i][j] = true if s3[0..i+j) is formable from s1[0..i) and s2[0..j). Base case dp[0][0] = true. Transition: dp[i][j] = (dp[i-1][j] && s1[i-1] === s3[i+j-1]) || (dp[i][j-1] && s2[j-1] === s3[i+j-1]) — the last character of the current s3 prefix either came from s1 (if that leaves a valid smaller state) or from s2. Fill row by row (or column by column); answer is dp[n][m]. Time O(n·m), space O(n·m) (or O(min(n,m)) rolling the smaller dimension).',
      rubric: [
        'States the transition correctly (OR of two "did the last char come from s1 / s2" cases)',
        'States the base case dp[0][0] = true',
        'States O(n·m) time, and space (full table or rolling)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Naive recursion branches into "take from s1" or "take from s2" at every position, which re-solves the same (i, j) state repeatedly — exponential. This is a DP problem because the state is exactly the pair (chars consumed from s1, chars consumed from s2), and each state\'s answer only depends on smaller states. First I check s1.length + s2.length === s3.length as a fast reject. Then I build dp[i][j] = "s3\'s first i+j chars are interleavable from s1[0..i) and s2[0..j)", with dp[i][j] true if either the last s3 char matches s1[i-1] and dp[i-1][j] holds, or it matches s2[j-1] and dp[i][j-1] holds. Answer is dp[n][m]. O(n·m) time and space.',
      rubric: ['Follows the script template end-to-end', 'States the length pre-check and the dp transition with correct complexity'],
    },
  },
  code: {
    signature: 'export function isInterleave(s1: string, s2: string, s3: string): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['aabcc', 'dbbca', 'aadbbcbcac'], expected: true, label: 'example true' },
      { args: ['aabcc', 'dbbca', 'aadbbbaccc'], expected: false, label: 'example false' },
      { args: ['', '', ''], expected: true, label: 'all empty' },
      { args: ['a', '', 'a'], expected: true, label: 's2 empty, s1 matches', hidden: true },
      { args: ['', 'b', 'a'], expected: false, label: 'length mismatch short-circuit', hidden: true },
      { args: ['abc', 'abc', 'aabcbc'], expected: true, label: 'requires backtracking-style choice', hidden: true },
    ],
    referenceSolution:
      'export function isInterleave(s1: string, s2: string, s3: string): boolean {\n  const n = s1.length\n  const m = s2.length\n  if (n + m !== s3.length) return false\n  const dp: boolean[] = new Array(m + 1).fill(false)\n  dp[0] = true\n  for (let j = 1; j <= m; j++) {\n    dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1]\n  }\n  for (let i = 1; i <= n; i++) {\n    dp[0] = dp[0] && s1[i - 1] === s3[i - 1]\n    for (let j = 1; j <= m; j++) {\n      const fromS1 = dp[j] && s1[i - 1] === s3[i + j - 1]\n      const fromS2 = dp[j - 1] && s2[j - 1] === s3[i + j - 1]\n      dp[j] = fromS1 || fromS2\n    }\n  }\n  return dp[m]\n}\n',
    complexity: { time: 'O(n·m)', space: 'O(min(n, m)) (rolling array)' },
  },
}
