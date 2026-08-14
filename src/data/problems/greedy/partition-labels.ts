import type { Problem } from '../../types'

export const partitionLabels: Problem = {
  id: 'partition-labels',
  leetcodeId: 763,
  title: 'Partition Labels',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'greedy',
  authored: true,
  statement:
    'Partition a string `s` into as **many** parts as possible so that no letter appears in more than one part, and return the list of part sizes (parts concatenate back to `s` in order).',
  examples: [
    { input: 's = "ababcbacadefegdehijhklij"', output: '[9,7,8]', explanation: '"ababcbaca" | "defegde" | "hijhklij".' },
    { input: 's = "eccbbbbdec"', output: '[10]' },
  ],
  constraints: ['1 <= s.length <= 500', 'lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: a lowercase string. Output: sizes of the parts, in order, maximizing the *number* of parts under the letters-don\'t-cross rule.',
      rubric: ['Sizes (not substrings) returned', 'Maximize count of parts'],
    },
    whatToFind: {
      modelAnswer:
        'The finest valid partition: each part must extend at least to the last occurrence of every letter it contains — cut at the earliest point where the running obligation closes.',
      rubric: ['Obligation-window (last occurrence) framing', 'Earliest-valid-cut = most parts'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 500, 26 letters — trivial volume. Precompute each letter\'s last index once; then one sweep decides all cuts. Budget O(n).',
      rubric: ['Last-occurrence precompute named', 'O(n) sweep budget'],
    },
    bruteForce: {
      modelAnswer:
        'Try every cut position recursively, validating each candidate part by scanning the rest of the string for letter reuse: exponential cut choices × O(n) validation.',
      rubric: ['Recursive cut trial', 'Exponential + revalidation waste'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Cut trials re-derive information the string states once: each letter\'s final position. With last[] known, a part\'s required end is just a running max — when the index reaches it, cutting *now* is provably optimal (waiting only merges parts). Pattern: Greedy + Sort/Sweep flavor (One Pass with a running boundary).',
      rubric: ['Waste: re-scanning for last occurrences', 'Running-max boundary + cut-when-closed rule'],
      acceptedPatterns: ['greedy', 'sort-sweep'],
    },
    algorithm: {
      modelAnswer:
        'Pass 1: last[c] = final index of each letter. Pass 2: start = 0, end = 0; for each i: end = max(end, last[s[i]]); if i === end: record size i − start + 1, start = i + 1. Time O(n), space O(26).',
      rubric: ['Two-pass structure', 'Cut condition i === end', 'States O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be trying cut points recursively with rescans for letter reuse — exponential. The constraint really says: a part containing letter c must reach c\'s last occurrence. So I\'ll precompute last positions, sweep with a running "required end" max, and cut exactly when the index closes it — earliest cuts give the most parts. Time O(n), space O(26).',
      rubric: ['Template followed with the obligation-window insight', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function partitionLabels(s: string): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['ababcbacadefegdehijhklij'], expected: [9, 7, 8], label: 'example' },
      { args: ['eccbbbbdec'], expected: [10], label: 'single part' },
      { args: ['a'], expected: [1], label: 'single char' },
      { args: ['abcdef'], expected: [1, 1, 1, 1, 1, 1], label: 'all distinct', hidden: true },
      { args: ['abab'], expected: [4], label: 'full overlap', hidden: true },
      { args: ['caedbdedda'], expected: [1, 9], label: 'early single then rest', hidden: true },
    ],
    referenceSolution:
      'export function partitionLabels(s: string): number[] {\n  const last = new Map<string, number>()\n  for (let i = 0; i < s.length; i++) last.set(s[i], i)\n  const out: number[] = []\n  let start = 0\n  let end = 0\n  for (let i = 0; i < s.length; i++) {\n    end = Math.max(end, last.get(s[i])!)\n    if (i === end) {\n      out.push(i - start + 1)\n      start = i + 1\n    }\n  }\n  return out\n}\n',
    complexity: { time: 'O(n)', space: 'O(26)' },
  },
}
