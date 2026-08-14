import type { Problem } from '../../types'

export const palindromePartitioning: Problem = {
  id: 'palindrome-partitioning',
  leetcodeId: 131,
  title: 'Palindrome Partitioning',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'backtracking',
  authored: true,
  statement:
    'Given a string `s`, partition it so that every substring in the partition is a palindrome. Return all possible palindrome partitionings of `s`.',
  examples: [
    { input: 's = "aab"', output: '[["a","a","b"],["aa","b"]]' },
    { input: 's = "a"', output: '[["a"]]' },
  ],
  constraints: ['1 <= s.length <= 16', 's contains only lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a short string (≤16 chars), lowercase only. Output: every way to cut it into consecutive substrings where each piece reads the same forwards and backwards — a list of full partitions, not just a list of palindromic substrings.',
      rubric: ['Notes pieces must be consecutive and cover the whole string', 'Distinguishes "list every valid partition" from "list palindromic substrings"'],
    },
    whatToFind: {
      modelAnswer:
        'A cut-placement enumeration: decide, at every position, how long the next palindromic piece is, and only continue down a cut choice when the piece it produces is actually a palindrome.',
      rubric: ['Frames it as choosing cut lengths at each position', 'Notes each choice is validated (must be a palindrome) before recursing further'],
    },
    constraintsHint: {
      modelAnswer:
        's.length ≤ 16 is a strong enumeration signal: there are 2¹⁵ possible cut-placements between the 15 gaps between characters, so exponential exploration is intended and expected to be fast enough.',
      rubric: ['Reads n ≤ 16 as licensing exponential enumeration over cut positions', 'Connects it to the 2ⁿ⁻¹ possible cut placements'],
    },
    bruteForce: {
      modelAnswer:
        'Enumerate all 2ⁿ⁻¹ ways to place cuts between characters (bitmask over gaps), build the resulting pieces for each mask, and check every piece is a palindrome before keeping the partition. Correct, but it fully materializes and checks partitions that fail early — no early exit as soon as one piece is not a palindrome.',
      rubric: ['Bitmask-over-cut-positions enumeration described', 'Notes it validates whole partitions instead of failing fast on the first bad piece'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Checking a full partition after building it wastes time exploring cut placements whose very first piece already fails to be a palindrome — there is no reason to keep choosing later cuts once an earlier piece is invalid. Backtrack instead: try each possible next-piece length starting at the current position, and only recurse into the remainder when that piece passes the palindrome check; if it fails, abandon the branch immediately. Pattern: Backtracking.',
      rubric: ['Names the waste: invalid partitions explored to completion instead of pruned early', 'Proposes checking each candidate piece before recursing (fail fast)'],
      acceptedPatterns: ['backtracking', 'dp'],
    },
    algorithm: {
      modelAnswer:
        'dfs(start, path): if start === s.length, record a copy of path; else for end from start+1 to s.length, let piece = s.slice(start, end); if piece is a palindrome (two-pointer check), push piece, dfs(end, path), pop. Start dfs(0, []). Time O(n · 2ⁿ) worst case (2ⁿ partitions, O(n) each to build/check), space O(n) for recursion plus the current path. Precomputing an isPalindrome[i][j] table via DP is a valid optimization to avoid re-checking substrings, though not required for correctness here.',
      rubric: [
        'Tries every next-cut length from the current start position',
        'Validates the candidate piece as a palindrome before recursing, and only records at start === s.length',
        'States roughly O(n · 2ⁿ) time and mentions DP-precomputed palindrome table as an optional speedup',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Enumerating all cut placements and checking each full partition works but wastes effort completing partitions whose first piece already fails to be a palindrome. I\'ll backtrack instead: at each position try every possible length for the next piece, check if it\'s a palindrome, and only recurse into the rest of the string if it is — abandoning immediately otherwise. n ≤ 16 confirms exponential search over cut placements is intended. Time roughly O(n · 2ⁿ), space O(n) for the recursion and current path; a DP table of palindromic substrings can speed up the repeated checks but isn\'t required.',
      rubric: ['States the fail-fast-on-invalid-piece insight versus checking whole partitions', 'Connects n ≤ 16 to exponential search and states the complexity'],
    },
  },
  code: {
    signature: 'export function partition(s: string): string[][] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: ['aab'], expected: [['a', 'a', 'b'], ['aa', 'b']], label: 'example' },
      { args: ['a'], expected: [['a']], label: 'single character' },
      { args: ['aa'], expected: [['a', 'a'], ['aa']], label: 'two same characters' },
      { args: ['ab'], expected: [['a', 'b']], label: 'no palindromic merge possible', hidden: true },
      { args: ['aba'], expected: [['a', 'b', 'a'], ['aba']], label: 'whole string is a palindrome', hidden: true },
      {
        args: ['aabb'],
        expected: [['a', 'a', 'b', 'b'], ['a', 'a', 'bb'], ['aa', 'b', 'b'], ['aa', 'bb']],
        label: 'multiple independent palindrome pairs',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function partition(s: string): string[][] {\n  const out: string[][] = []\n  const path: string[] = []\n  const isPalindrome = (str: string): boolean => {\n    let lo = 0\n    let hi = str.length - 1\n    while (lo < hi) {\n      if (str[lo] !== str[hi]) return false\n      lo++\n      hi--\n    }\n    return true\n  }\n  const dfs = (start: number) => {\n    if (start === s.length) {\n      out.push([...path])\n      return\n    }\n    for (let end = start + 1; end <= s.length; end++) {\n      const piece = s.slice(start, end)\n      if (isPalindrome(piece)) {\n        path.push(piece)\n        dfs(end)\n        path.pop()\n      }\n    }\n  }\n  dfs(0)\n  return out\n}\n',
    complexity: { time: 'O(n · 2ⁿ)', space: 'O(n) recursion (output excluded)' },
  },
}
