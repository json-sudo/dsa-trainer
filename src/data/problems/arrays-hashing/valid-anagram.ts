import type { Problem } from '../../types'

export const validAnagram: Problem = {
  id: 'valid-anagram',
  leetcodeId: 242,
  title: 'Valid Anagram',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'arrays-hashing',
  authored: true,
  statement:
    'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s` — the same characters, same multiplicity, any order.',
  examples: [
    { input: 's = "anagram", t = "nagaram"', output: 'true' },
    { input: 's = "rat", t = "car"', output: 'false' },
  ],
  constraints: ['1 <= s.length, t.length <= 5 * 10^4', 'lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two strings, possibly different lengths. Output: a boolean — same multiset of characters. Different lengths is an instant false, worth checking first.',
      rubric: ['Notes length mismatch is an instant false', 'Frames the answer as a multiset-equality check'],
    },
    whatToFind: {
      modelAnswer: 'Whether two strings have identical character frequency counts, ignoring order entirely.',
      rubric: ['States the task as frequency-count equality', 'Explicitly discards ordering as irrelevant'],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 5×10⁴ characters, lowercase-only: a single O(n) pass with a 26-slot count array (or map) comfortably fits; sorting both strings (O(n log n)) would also pass but does needless extra work.',
      rubric: ['Derives O(n) as achievable from the size/alphabet', 'Notes sorting is a valid but slower alternative'],
    },
    bruteForce: {
      modelAnswer: 'Sort both strings and compare them character-by-character (or with string equality). O(n log n) time, O(n) space for the sorted copies.',
      rubric: ['Names the sort-and-compare approach', 'States O(n log n) time'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Sorting reorders the whole string just to align matching characters — but I only need to know each character\'s count, not its position. Tally counts for `s`, then decrement for each character of `t`; if anything goes negative or a leftover count remains, they aren\'t anagrams. Pattern: Frequency Map.',
      rubric: ['Names the waste: sorting to align characters that only need counting', 'Proposes count/decrement via a frequency map'],
      acceptedPatterns: ['freq-map'],
    },
    algorithm: {
      modelAnswer:
        'If s.length !== t.length, return false immediately. Build a 26-length count array from s (increment per char). Walk t, decrementing; if any count goes negative, return false early. After the walk, all counts are exactly zero, so return true. Time O(n), space O(1) (fixed 26 slots).',
      rubric: ['Length mismatch short-circuit', 'Single count array incremented for s, decremented for t', 'States O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'Sorting both strings and comparing is a correct O(n log n) baseline, but it reorders data I only need to count. Since the alphabet is fixed lowercase letters, I\'ll tally character counts from s in a 26-slot array, then decrement while scanning t — any negative count or nonzero leftover means not an anagram. Time O(n), space O(1).',
      rubric: ['Follows the script template end-to-end', 'States the count-array insight and final complexity'],
    },
  },
  code: {
    signature: 'export function isAnagram(s: string, t: string): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['anagram', 'nagaram'], expected: true, label: 'example: true' },
      { args: ['rat', 'car'], expected: false, label: 'example: false' },
      { args: ['a', 'ab'], expected: false, label: 'different lengths' },
      { args: ['aacc', 'ccac'], expected: false, label: 'same letters, different counts', hidden: true },
      { args: ['a', 'a'], expected: true, label: 'single character match', hidden: true },
      { args: ['ab', 'ba'], expected: true, label: 'simple permutation', hidden: true },
    ],
    referenceSolution:
      'export function isAnagram(s: string, t: string): boolean {\n  if (s.length !== t.length) return false\n  const counts = new Array(26).fill(0)\n  for (let i = 0; i < s.length; i++) counts[s.charCodeAt(i) - 97]++\n  for (let i = 0; i < t.length; i++) {\n    const idx = t.charCodeAt(i) - 97\n    counts[idx]--\n    if (counts[idx] < 0) return false\n  }\n  return true\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
