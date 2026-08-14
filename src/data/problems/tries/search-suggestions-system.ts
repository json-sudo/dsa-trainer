import type { Problem } from '../../types'

export const searchSuggestionsSystem: Problem = {
  id: 'search-suggestions-system',
  leetcodeId: 1268,
  title: 'Search Suggestions System',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'tries',
  authored: true,
  statement:
    'Given an array of `products` and a `searchWord`, return, for each prefix of `searchWord` (typed one letter at a time), up to three lexicographically smallest products that start with that prefix.',
  examples: [
    {
      input: 'products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"',
      output: '[["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]',
    },
    { input: 'products = ["havana"], searchWord = "havana"', output: '[["havana"] × 6]' },
  ],
  constraints: [
    '1 <= products.length <= 1000',
    '1 <= products[i].length <= 3000, total <= 2 * 10^4 chars',
    '1 <= searchWord.length <= 1000',
    'lowercase English letters',
  ],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 1000 product names and a search word typed letter by letter. Output: one list per prefix — the ≤3 lexicographically smallest matches. Sorted order in the output is a loud hint.',
      rubric: ['Per-prefix output lists (searchWord.length of them)', '"Lexicographically smallest three" flagged'],
    },
    whatToFind: {
      modelAnswer: 'For each of the growing prefixes: the top-3 smallest strings in a fixed set matching that prefix — repeated prefix-range queries.',
      rubric: ['Repeated growing-prefix queries', 'Top-3-sorted selection per query'],
    },
    constraintsHint: {
      modelAnswer:
        'Volumes are small (2×10⁴ total chars, 1000 queries): sort-once O(n log n) then cheap per-prefix narrowing fits easily. In sorted order, all matches of a prefix are *contiguous* — and each longer prefix narrows the previous range.',
      rubric: ['Sorted-matches-are-contiguous observation', 'Ranges only narrow as the prefix grows'],
    },
    bruteForce: {
      modelAnswer: 'For each prefix, filter all products with startsWith, sort the matches, take three: O(L · n log n) with repeated sorting — wasteful though borderline-passable here.',
      rubric: ['Filter+sort per prefix', 'Names the repeated-sort waste', 'States complexity'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Re-filtering and re-sorting ignores two facts: sorted once, prefix matches are one contiguous block, and each typed letter can only *shrink* the previous block. Keep left/right bounds and advance them as the prefix grows (or walk a trie storing top-3 per node). Pattern: Trie — Two Pointers over the sorted list is the accepted equivalent.',
      rubric: ['Waste: refiltering/resorting a narrowing range', 'Sort once + advancing bounds (or per-node top-3 trie)'],
      acceptedPatterns: ['trie', 'two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'Sort products. l = 0, r = n−1. For each prefix length i: advance l while products[l] lacks the prefix (short or wrong char at i); retreat r similarly; answer for this prefix = products[l..min(l+2, r)]. Bounds move monotonically → total O(n log n + n·L) worst, effectively linear here. Space O(1) extra.',
      rubric: [
        'Sort once, then monotone l/r narrowing per typed char',
        'Slice of ≤3 from the live range',
        'States the complexity',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be filtering and sorting the products for every typed letter — repeated work over a shrinking set. After one sort, every prefix\'s matches form a contiguous block that only narrows as letters are typed, so I\'ll keep two pointers as the block\'s bounds and emit up to three entries from the left edge each step. A trie with per-node top-3 lists is the same idea structurally. Time O(n log n) for the sort plus a linear sweep; space O(1) extra.',
      rubric: ['Template followed with the contiguous-narrowing-block insight', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function suggestedProducts(products: string[], searchWord: string): string[][] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'], 'mouse'],
        expected: [
          ['mobile', 'moneypot', 'monitor'],
          ['mobile', 'moneypot', 'monitor'],
          ['mouse', 'mousepad'],
          ['mouse', 'mousepad'],
          ['mouse', 'mousepad'],
        ],
        label: 'example',
      },
      {
        args: [['havana'], 'havana'],
        expected: [['havana'], ['havana'], ['havana'], ['havana'], ['havana'], ['havana']],
        label: 'single product full match',
      },
      {
        args: [['bags', 'baggage', 'banner', 'box', 'cloths'], 'bags'],
        expected: [['baggage', 'bags', 'banner'], ['baggage', 'bags', 'banner'], ['baggage', 'bags'], ['bags']],
        label: 'shrinking matches',
      },
      {
        args: [['havana'], 'tatiana'],
        expected: [[], [], [], [], [], [], []],
        label: 'no matches at all',
        hidden: true,
      },
      {
        args: [['a', 'ab', 'abc', 'abcd', 'abcde'], 'ab'],
        expected: [['a', 'ab', 'abc'], ['ab', 'abc', 'abcd']],
        label: 'nested prefixes cap at three',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function suggestedProducts(products: string[], searchWord: string): string[][] {\n  const sorted = [...products].sort()\n  const out: string[][] = []\n  let l = 0\n  let r = sorted.length - 1\n  for (let i = 0; i < searchWord.length; i++) {\n    const ch = searchWord[i]\n    while (l <= r && (sorted[l].length <= i || sorted[l][i] !== ch)) l++\n    while (l <= r && (sorted[r].length <= i || sorted[r][i] !== ch)) r--\n    out.push(sorted.slice(l, Math.min(l + 3, r + 1)))\n  }\n  return out\n}\n',
    complexity: { time: 'O(n log n + n·L)', space: 'O(1) extra (output excluded)' },
  },
}
