import type { Problem } from '../../types'

export const minimumWindowSubstring: Problem = {
  id: 'minimum-window-substring',
  leetcodeId: 76,
  title: 'Minimum Window Substring',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'sliding-window',
  authored: true,
  statement:
    'Given two strings `s` and `t`, return the shortest substring of `s` that contains every character of `t` (including duplicates, i.e. at least as many of each character as `t` has). Return `""` if no such substring exists.',
  examples: [
    { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
    { input: 's = "a", t = "a"', output: '"a"' },
    { input: 's = "a", t = "aa"', output: '""', explanation: 's only has one \'a\', t needs two.' },
  ],
  constraints: ['1 <= s.length, t.length <= 10^5', 's and t consist of English letters (upper/lowercase)'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two strings s and t, both up to 10⁵ chars, letters can repeat and case matters as distinct characters. Output: the shortest contiguous substring of s covering t\'s full multiset of characters, or "" if impossible.',
      rubric: ['Notes character counts (multiset) matter, not just distinct presence', 'Output is shortest substring or "" when impossible'],
    },
    whatToFind: {
      modelAnswer:
        'A shortest-window search: find the minimum-length contiguous range of s whose character multiset is a superset of t\'s character multiset.',
      rubric: ['Frames it as minimum-length contiguous range', 'Superset-of-multiset condition, not just distinct chars'],
    },
    constraintsHint: {
      modelAnswer:
        '|s| up to 10⁵ means checking every substring (O(n²) or worse with a fresh scan each time) is too slow; O(|s| + |t|) is the target. That budget points at a window that only ever expands or shrinks, never restarts from scratch.',
      rubric: ['Derives near-linear budget from |s| up to 10⁵', 'Connects budget to a window that never rescans from scratch'],
    },
    bruteForce: {
      modelAnswer:
        'For every pair of start/end indices, build the substring\'s frequency map and check it covers t\'s frequency map. O(n²) substrings times O(n) to check/build each = O(n³) (or O(n²) with smarter incremental counting), all clearly too slow.',
      rubric: ['Names the all-substrings enumeration', 'States the resulting polynomial blowup (n² or worse)'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The waste is re-deriving each candidate window\'s character counts from scratch instead of updating counts incrementally as a window slides. Expand the right edge accumulating counts; once the window fully covers t, shrink the left edge while it stays valid, tracking the smallest valid window seen — never restart from zero. Pattern: Sliding Window.',
      rubric: ['Names the waste: recomputing window contents from scratch per candidate', 'Proposes incrementally expand-then-shrink window with running counts'],
      acceptedPatterns: ['sliding-window'],
    },
    algorithm: {
      modelAnswer:
        'Build need: freq map of t, and `required` = number of distinct characters in need. Expand r over s, incrementing a window freq map; when a character\'s window count first reaches its need count, increment `have`. Once have === required, the window is valid: shrink l while it stays valid, updating best (start, length) each time it shrinks to a new valid window, and decrementing `have` when a needed character\'s window count drops below its requirement as l advances past it. Continue expanding r until it exhausts s. Return the best substring, or "" if none found. Time O(|s| + |t|), space O(|t|) (distinct chars in t, bounded by alphabet size).',
      rubric: [
        'Two frequency maps (need vs window) with a have/required covered-count',
        'Expand right to find validity, shrink left while still valid, tracking the smallest window',
        'States O(|s| + |t|) time and handles the "" no-answer case',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force checks every substring\'s character counts from scratch — O(n²) or worse, and it wastes work re-deriving counts a sliding window could maintain incrementally. This is a variable sliding-window problem: expand the right edge accumulating a window frequency map against t\'s need map, and once every required character count is met, shrink the left edge while it\'s still valid, recording the smallest window seen each time. That gives the minimum window in one pass. Time O(|s| + |t|), space O(|t|).',
      rubric: ['Follows the script template end-to-end', 'States the expand-then-shrink insight and final complexity'],
    },
  },
  code: {
    signature: 'export function minWindow(s: string, t: string): string {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC', label: 'example' },
      { args: ['a', 'a'], expected: 'a', label: 'single char match' },
      { args: ['a', 'aa'], expected: '', label: 'not enough occurrences' },
      { args: ['ab', 'b'], expected: 'b', label: 'window is single char within larger s', hidden: true },
      { args: ['aa', 'aa'], expected: 'aa', label: 'whole string is the window', hidden: true },
      { args: ['abc', 'd'], expected: '', label: 'character not present at all', hidden: true },
      { args: ['bba', 'ab'], expected: 'ba', label: 'window not at start', hidden: true },
    ],
    referenceSolution:
      'export function minWindow(s: string, t: string): string {\n  if (t.length === 0 || s.length < t.length) return \'\'\n  const need = new Map<string, number>()\n  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1)\n  const required = need.size\n  const window = new Map<string, number>()\n  let have = 0\n  let bestStart = -1\n  let bestLen = Infinity\n  let l = 0\n  for (let r = 0; r < s.length; r++) {\n    const ch = s[r]\n    if (need.has(ch)) {\n      window.set(ch, (window.get(ch) ?? 0) + 1)\n      if (window.get(ch) === need.get(ch)) have++\n    }\n    while (have === required) {\n      if (r - l + 1 < bestLen) {\n        bestLen = r - l + 1\n        bestStart = l\n      }\n      const lch = s[l]\n      if (need.has(lch)) {\n        const count = (window.get(lch) ?? 0) - 1\n        window.set(lch, count)\n        if (count < (need.get(lch) as number)) have--\n      }\n      l++\n    }\n  }\n  return bestStart === -1 ? \'\' : s.slice(bestStart, bestStart + bestLen)\n}\n',
    complexity: { time: 'O(|s| + |t|)', space: 'O(|t|)' },
  },
}
