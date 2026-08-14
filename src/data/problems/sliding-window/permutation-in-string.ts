import type { Problem } from '../../types'

export const permutationInString: Problem = {
  id: 'permutation-in-string',
  leetcodeId: 567,
  title: 'Permutation in String',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'sliding-window',
  authored: true,
  statement:
    'Given two lowercase strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1` as a **substring** — i.e. some contiguous window of `s2` uses exactly the letters of `s1`.',
  examples: [
    { input: 's1 = "ab", s2 = "eidbaooo"', output: 'true', explanation: '"ba" is a window of s2.' },
    { input: 's1 = "ab", s2 = "eidboaoo"', output: 'false' },
  ],
  constraints: ['1 <= s1.length, s2.length <= 10^4', 's1 and s2 consist of lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: pattern s1 and text s2, both lowercase, up to 10⁴. Output: boolean — existence only, no positions. A permutation match means identical letter counts, so order inside the window is irrelevant.',
      rubric: ['Boolean existence output', 'Permutation ⇔ equal letter counts stated'],
    },
    whatToFind: {
      modelAnswer:
        'Existence of a fixed-length window (|s1|) of s2 whose frequency profile equals s1\'s. Fixed size is given by the pattern length — this is the fixed-window variant.',
      rubric: ['Fixed window size |s1| identified', 'Match condition = frequency equality'],
    },
    constraintsHint: {
      modelAnswer:
        'Both up to 10⁴: comparing counts naively per window is O(26·n) = fine; O(n·|s1|) recounting (10⁸) is the thing to avoid. Lowercase → two 26-slot count arrays.',
      rubric: ['Budget analysis distinguishing O(26n) from O(n·m)', '26-array observation'],
    },
    bruteForce: {
      modelAnswer:
        'For every start in s2, count the next |s1| characters and compare to s1\'s counts: O(n·m) time (10⁸ worst case), O(26) space.',
      rubric: ['Per-start recount described', 'States O(n·m)', 'States space'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Adjacent windows differ by exactly two characters, yet the brute force recounts all m each time. Slide a fixed window: add the entering char, remove the leaving one, track how many of the 26 letters currently match. Pattern: Sliding Window (fixed) — Freq Map is the bookkeeping.',
      rubric: ['Waste: full recount for a 2-char delta', 'Incremental add/remove with match tracking'],
      acceptedPatterns: ['sliding-window', 'freq-map'],
    },
    algorithm: {
      modelAnswer:
        'Count s1 into need[26]. Initialize window counts over s2[0..m−1] and a matches counter (letters where window count equals need). Slide: for each new r, update the entering and leaving letters\' counts, adjusting matches on each transition into/out of equality; if matches === 26, return true. Time O(n + 26), space O(1).',
      rubric: [
        'Fixed window with incremental count updates',
        'The matches-of-26 (or per-slide array compare) check',
        'States O(n)/O(1)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be recounting an |s1|-sized block at every position of s2 — O(n·m), up to 10⁸ operations. This looks like a fixed sliding window because a permutation match is just frequency equality and adjacent windows differ by two characters. I\'ll slide, updating 26 counts incrementally and tracking matched letters. Time O(n), space O(1).',
      rubric: ['Template followed with frequency-equality insight', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function checkInclusion(s1: string, s2: string): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['ab', 'eidbaooo'], expected: true, label: 'example' },
      { args: ['ab', 'eidboaoo'], expected: false, label: 'example 2' },
      { args: ['a', 'a'], expected: true, label: 'single char match' },
      { args: ['abc', 'ab'], expected: false, label: 'pattern longer than text', hidden: true },
      { args: ['adc', 'dcda'], expected: true, label: 'match at end', hidden: true },
      { args: ['aab', 'baa'], expected: true, label: 'exact-length window with duplicates', hidden: true },
    ],
    referenceSolution:
      'export function checkInclusion(s1: string, s2: string): boolean {\n  const m = s1.length\n  const n = s2.length\n  if (m > n) return false\n  const need = new Array(26).fill(0)\n  const have = new Array(26).fill(0)\n  for (let i = 0; i < m; i++) {\n    need[s1.charCodeAt(i) - 97]++\n    have[s2.charCodeAt(i) - 97]++\n  }\n  let matches = 0\n  for (let c = 0; c < 26; c++) if (need[c] === have[c]) matches++\n  if (matches === 26) return true\n  for (let r = m; r < n; r++) {\n    const add = s2.charCodeAt(r) - 97\n    const drop = s2.charCodeAt(r - m) - 97\n    if (have[add] === need[add]) matches--\n    have[add]++\n    if (have[add] === need[add]) matches++\n    if (have[drop] === need[drop]) matches--\n    have[drop]--\n    if (have[drop] === need[drop]) matches++\n    if (matches === 26) return true\n  }\n  return false\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
