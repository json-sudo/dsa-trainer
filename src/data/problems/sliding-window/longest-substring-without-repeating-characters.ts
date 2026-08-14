import type { Problem } from '../../types'

export const longestSubstringWithoutRepeatingCharacters: Problem = {
  id: 'longest-substring-without-repeating-characters',
  leetcodeId: 3,
  title: 'Longest Substring Without Repeating Characters',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'sliding-window',
  authored: true,
  statement:
    'Given a string `s`, return the length of the longest **substring** (contiguous) that contains no repeated characters.',
  examples: [
    { input: 's = "abcabcbb"', output: '3', explanation: '"abc" — "abca" would repeat the a.' },
    { input: 's = "bbbbb"', output: '1' },
    { input: 's = "pwwkew"', output: '3', explanation: '"wke". "pwke" is a subsequence, not a substring.' },
  ],
  constraints: ['0 <= s.length <= 5 * 10^4', 's consists of ASCII characters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: one string, possibly empty, up to 5×10⁴ chars. Output: a single integer length — not the substring itself. "Substring" means contiguous; that word is load-bearing.',
      rubric: ['Notes possibly-empty input', 'Flags substring = contiguous (vs subsequence)'],
      teachingNote:
        'Circle the word "substring" every time. Half of sliding-window applicability rests on the target being *contiguous* — a subsequence version would be a different problem entirely.',
    },
    whatToFind: {
      modelAnswer:
        'A max-length search over contiguous runs satisfying a property (all characters distinct). "Longest run satisfying X" is the canonical variable-size window shape.',
      rubric: ['Identifies longest-contiguous-run-with-property', 'Recognizes the max (not count/enumerate) goal'],
      teachingNote:
        '"Longest/shortest contiguous X" should trigger the window reflex before you even think about implementation. Say the category, then verify the property is window-friendly in step 6.',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 5×10⁴: O(n²) substring enumeration (~2.5×10⁹ with the inner check) is out; budget O(n). ASCII alphabet means a fixed-size map/set of at most ~128 live entries — O(1) auxiliary space in practice.',
      rubric: ['Derives O(n) budget from the bound', 'Uses the bounded alphabet for O(1)-ish space'],
      teachingNote:
        'When the structure hint ("ASCII", "lowercase") bounds the alphabet, say what it buys: constant-size bookkeeping. Interviewers score you on *using* constraints, not reciting them.',
    },
    bruteForce: {
      modelAnswer:
        'For every start index, extend until a repeat appears (checking membership with a set), tracking the best length. O(n²) time in the worst case, O(min(n, alphabet)) space.',
      rubric: ['Every-start extension described', 'States O(n²) time', 'States space'],
      teachingNote:
        'This brute force is already half the insight: it extends a window rightward. The waste is only in how it *restarts* — see the next step. Good brute forces are often one observation away from the optimum.',
    },
    wasteAndPattern: {
      modelAnswer:
        'When a repeat of character c appears, the brute force restarts from start+1 — but every start position up to and including the previous occurrence of c is doomed for the same reason. The window can jump its left edge directly past that occurrence, never moving left. Both edges only advance → linear. Pattern: Sliding Window (variable size).',
      rubric: ['Names the waste: restarting over doomed prefixes', 'States the monotone left-edge insight'],
      acceptedPatterns: ['sliding-window'],
      teachingNote:
        'The test for window-friendliness: when the constraint breaks, does shrinking from the left monotonically restore it? Here yes — dropping chars can only remove duplicates. If shrinking could *break* validity, the window pattern doesn\'t apply.',
    },
    algorithm: {
      modelAnswer:
        'Keep last-seen index per character and a left edge l. For each r: if s[r] was seen at index ≥ l, move l to that index + 1. Update best = max(best, r − l + 1) and record s[r] → r. One pass, each edge advances at most n times. Time O(n), space O(min(n, alphabet)).',
      rubric: [
        'Window with last-seen map and jumping left edge',
        'Best updated per step; both edges monotone',
        'States O(n) time and bounded space',
      ],
      teachingNote:
        'The last-seen map (jump directly) is a refinement of the shrink-while-invalid loop (step left repeatedly). Either passes; mentioning both shows depth. The invariant to state: "the window [l..r] never contains a repeat".',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be extending from every start index — O(n²), too slow at 5×10⁴. This looks like a variable sliding window because I want the longest contiguous run under a constraint that shrinking repairs: on a repeat, every start up to the previous occurrence is invalid, so the left edge only moves forward. I\'ll sweep right, tracking last-seen positions. Time O(n), space O(alphabet).',
      rubric: ['Template followed with the monotone-left-edge justification', 'Complexity stated'],
      teachingNote:
        'Notice the script defends *why* the window works (shrinking repairs the constraint), not just that it exists. That one clause is the difference between pattern-matching and understanding.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Window state: last-seen index per char + left edge',
      code: 'const lastSeen = new Map<string, number>()\nlet best = 0\nlet l = 0   // invariant: s[l..r] never contains a repeat',
    },
    {
      label: '2. On a repeat inside the window, JUMP the left edge past it',
      code: 'const prev = lastSeen.get(s[r])\nif (prev !== undefined && prev >= l) l = prev + 1\n// prev >= l matters: an occurrence BEFORE the window must not drag l backward ("abba")',
    },
    {
      label: '3. Every position updates the best and records itself',
      code: 'best = Math.max(best, r - l + 1)\nlastSeen.set(s[r], r)\n// both edges only move forward -> O(n) total',
    },
  ],
  code: {
    signature: 'export function lengthOfLongestSubstring(s: string): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['abcabcbb'], expected: 3, label: 'example' },
      { args: ['bbbbb'], expected: 1, label: 'all same char' },
      { args: ['pwwkew'], expected: 3, label: 'repeat mid-window' },
      { args: [''], expected: 0, label: 'empty string', hidden: true },
      { args: ['au'], expected: 2, label: 'all unique', hidden: true },
      { args: ['abba'], expected: 2, label: 'left edge must not move backward', hidden: true },
    ],
    referenceSolution:
      'export function lengthOfLongestSubstring(s: string): number {\n  const lastSeen = new Map<string, number>()\n  let best = 0\n  let l = 0\n  for (let r = 0; r < s.length; r++) {\n    const prev = lastSeen.get(s[r])\n    if (prev !== undefined && prev >= l) l = prev + 1\n    best = Math.max(best, r - l + 1)\n    lastSeen.set(s[r], r)\n  }\n  return best\n}\n',
    complexity: { time: 'O(n)', space: 'O(min(n, alphabet))' },
  },
}
