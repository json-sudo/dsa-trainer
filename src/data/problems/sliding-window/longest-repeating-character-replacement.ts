import type { Problem } from '../../types'

export const longestRepeatingCharacterReplacement: Problem = {
  id: 'longest-repeating-character-replacement',
  leetcodeId: 424,
  title: 'Longest Repeating Character Replacement',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'sliding-window',
  authored: true,
  statement:
    'You are given a string `s` of uppercase English letters and an integer `k`. You may change at most `k` characters to any other uppercase letter. Return the length of the longest substring you can make consist of a single repeated character.',
  examples: [
    { input: 's = "ABAB", k = 2', output: '4', explanation: 'Replace both A\'s (or both B\'s).' },
    { input: 's = "AABABBA", k = 1', output: '4', explanation: 'Replace the middle A: "AABBBBA" → "BBBB".' },
  ],
  constraints: ['1 <= s.length <= 10^5', 's consists of uppercase English letters', '0 <= k <= s.length'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an uppercase string up to 10⁵ and a replacement budget k. Output: one integer — the longest achievable uniform substring length. Contiguity again.',
      rubric: ['Names both inputs incl. the budget k', 'Output is a length of a contiguous run'],
    },
    whatToFind: {
      modelAnswer:
        'Longest contiguous window that can be made uniform within budget — i.e. window where (window length − count of most frequent char) ≤ k.',
      rubric: ['Reformulates the condition as len − maxFreq ≤ k', 'Identifies max-length over windows'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 10⁵ → O(n) or O(n log n). Uppercase-only means 26 counters; the window\'s max frequency is over 26 values, effectively O(1) to maintain approximately.',
      rubric: ['Budget from bound', '26-letter alphabet noted for counting'],
    },
    bruteForce: {
      modelAnswer:
        'Check every substring: count its most frequent character and test len − maxFreq ≤ k. O(n²) substrings × O(1) amortized counting → O(n²) time, O(26) space. ~10¹⁰ at n = 10⁵, over budget.',
      rubric: ['All-substring check with the uniformity test', 'States O(n²)', 'States space'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Substrings overlap almost entirely — counts differ by one char between neighbors, yet the brute force recounts from scratch. Slide a window keeping 26 running counts: grow right; if len − maxFreq > k, shift left once. Pattern: Sliding Window.',
      rubric: ['Waste: recounting overlapping windows', 'Window with running freq counts + violation test'],
      acceptedPatterns: ['sliding-window'],
    },
    algorithm: {
      modelAnswer:
        'freq[26], l = 0, maxFreq = 0 (historical max is enough — the window never needs to shrink below the best seen). For each r: bump freq, update maxFreq; if (r − l + 1) − maxFreq > k, decrement freq[s[l]] and l++. Answer is the final window size (it never shrinks). Time O(n), space O(1).',
      rubric: [
        'Maintains counts + max frequency while sliding',
        'Uses the never-shrink (or shrink-while-invalid) window correctly',
        'States O(n)/O(1)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be testing every substring for "fixable with k changes" — O(n²), too slow at 10⁵. This looks like a sliding window because the validity condition, window length minus the top character count ≤ k, degrades as I grow and repairs as I shrink. I\'ll keep 26 running counts and slide. Time O(n), space O(1).',
      rubric: ['Template followed with the len − maxFreq ≤ k condition named', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function characterReplacement(s: string, k: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['ABAB', 2], expected: 4, label: 'example' },
      { args: ['AABABBA', 1], expected: 4, label: 'example 2' },
      { args: ['A', 0], expected: 1, label: 'single char, no budget' },
      { args: ['ABCDE', 0], expected: 1, label: 'zero budget all distinct', hidden: true },
      { args: ['AAAA', 2], expected: 4, label: 'already uniform', hidden: true },
      { args: ['ABBB', 2], expected: 4, label: 'budget exceeds need', hidden: true },
    ],
    referenceSolution:
      'export function characterReplacement(s: string, k: number): number {\n  const freq = new Array(26).fill(0)\n  let l = 0\n  let maxFreq = 0\n  for (let r = 0; r < s.length; r++) {\n    const idx = s.charCodeAt(r) - 65\n    freq[idx]++\n    maxFreq = Math.max(maxFreq, freq[idx])\n    if (r - l + 1 - maxFreq > k) {\n      freq[s.charCodeAt(l) - 65]--\n      l++\n    }\n  }\n  return s.length - l\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
