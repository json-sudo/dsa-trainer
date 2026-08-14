import type { Problem } from '../../types'

export const longestCommonPrefix: Problem = {
  id: 'longest-common-prefix',
  leetcodeId: 14,
  title: 'Longest Common Prefix',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'tries',
  authored: true,
  statement: 'Given an array of strings `strs`, return the longest prefix shared by **all** of them. Return `""` if there is none.',
  examples: [
    { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
    { input: 'strs = ["dog","racecar","car"]', output: '""' },
  ],
  constraints: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 200 lowercase strings (some possibly empty). Output: the shared prefix string — possibly empty. Any empty input string forces "".',
      rubric: ['Empty-string input case noted', 'Output is a string, possibly empty'],
    },
    whatToFind: {
      modelAnswer: 'The longest string that prefixes every input — an intersection over prefixes, shrinking-only as more strings are considered.',
      rubric: ['All-strings intersection framing', 'Monotone shrinking observation'],
    },
    constraintsHint: {
      modelAnswer:
        'Tiny bounds (≤ 4×10⁴ total chars): the character-by-character scan is already optimal-enough. The trie framing matters conceptually — the answer is the trie\'s unary spine from the root.',
      rubric: ['Recognizes O(total chars) is optimal here', 'Names the trie interpretation'],
    },
    bruteForce: {
      modelAnswer:
        'Take the first string; for each prefix length from longest down, test it against all others: O(n·L²) worst case from re-testing overlapping prefixes.',
      rubric: ['Prefix-shrinking check described', 'States the L² re-test waste'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Testing prefixes independently re-compares the same leading characters. Compare *one column at a time* (vertical scan) and stop at the first mismatch — or insert all into a Trie and walk while nodes have exactly one child and no word-end. Pattern: Trie (vertical scan is the flat equivalent).',
      rubric: ['Waste: overlapping prefix re-comparison', 'Column scan or unary-spine trie walk'],
      acceptedPatterns: ['trie'],
    },
    algorithm: {
      modelAnswer:
        'Vertical scan: for column i from 0: take strs[0][i]; if any string is shorter than i+1 or differs at i, return strs[0].slice(0, i). Return strs[0] if it survives. Time O(total chars), space O(1). (Trie version: build, then walk single-child non-end nodes.)',
      rubric: ['Column-wise scan with early exit', 'Handles shortest-string termination', 'States O(total chars)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be testing each candidate prefix against every string — re-comparing the same leading characters repeatedly. The shared prefix dies at the first column where strings disagree, so I\'ll scan column by column and stop at the first mismatch; equivalently it\'s the unary spine of a trie of all the strings. Time O(total characters), space O(1).',
      rubric: ['Template followed with the column/trie duality', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function longestCommonPrefix(strs: string[]): string {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [['flower', 'flow', 'flight']], expected: 'fl', label: 'example' },
      { args: [['dog', 'racecar', 'car']], expected: '', label: 'no common prefix' },
      { args: [['single']], expected: 'single', label: 'one string' },
      { args: [['abc', 'abc', 'abc']], expected: 'abc', label: 'identical strings', hidden: true },
      { args: [['', 'abc']], expected: '', label: 'empty string present', hidden: true },
      { args: [['ab', 'abc', 'abcd']], expected: 'ab', label: 'shortest string is the answer', hidden: true },
    ],
    referenceSolution:
      "export function longestCommonPrefix(strs: string[]): string {\n  const first = strs[0]\n  for (let i = 0; i < first.length; i++) {\n    for (const s of strs) {\n      if (i >= s.length || s[i] !== first[i]) return first.slice(0, i)\n    }\n  }\n  return first\n}\n",
    complexity: { time: 'O(total characters)', space: 'O(1)' },
  },
}
