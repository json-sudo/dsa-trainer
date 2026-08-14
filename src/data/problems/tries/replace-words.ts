import type { Problem } from '../../types'

export const replaceWords: Problem = {
  id: 'replace-words',
  leetcodeId: 648,
  title: 'Replace Words',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'tries',
  authored: true,
  statement:
    'Given a `dictionary` of roots and a `sentence` of space-separated words, replace every word that starts with a root by its **shortest** matching root. Return the resulting sentence.',
  examples: [
    { input: 'dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"', output: '"the cat was rat by the bat"' },
    { input: 'dictionary = ["a","b","c"], sentence = "aadsfasf absbs bbab cadsfafs"', output: '"a a b c"' },
  ],
  constraints: [
    '1 <= dictionary.length <= 1000',
    '1 <= dictionary[i].length <= 100',
    '1 <= sentence words <= 1000, word length <= 1000',
    'lowercase English letters',
  ],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 1000 roots and a sentence of up to 1000 words. Output: the sentence with each word replaced by its *shortest* matching root (if any). Shortest-match is the subtle bit.',
      rubric: ['Shortest-root rule flagged', 'Words without roots pass through unchanged'],
    },
    whatToFind: {
      modelAnswer: 'Per word: the shortest dictionary root that is a prefix of it — a repeated prefix query against a fixed dictionary.',
      rubric: ['Per-word shortest-prefix-in-set query', 'Dictionary fixed across queries'],
    },
    constraintsHint: {
      modelAnswer:
        'Worst volume: 1000 words × 1000 roots × 100 chars = 10⁸ comparisons for the naive pairing — borderline-too-slow and obviously wasteful. Budget: O(total root chars + total sentence chars).',
      rubric: ['Multiplies the volumes to reject pairwise checks', 'Linear-in-total-characters budget'],
    },
    bruteForce: {
      modelAnswer: 'For each word, test every root with startsWith and keep the shortest match: O(words × roots × rootLen), ~10⁸ worst case.',
      rubric: ['Pairwise startsWith loop', 'States the blown-up product complexity'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Each word re-compares the same root prefixes ("cat", "car", "care" share "ca…"). Build a trie of roots once; then each word walks it character by character and stops at the *first* end-marker — which is automatically the shortest root. Pattern: Trie.',
      rubric: ['Waste: shared root prefixes re-tested per word', 'First-end-marker = shortest-root insight'],
      acceptedPatterns: ['trie'],
    },
    algorithm: {
      modelAnswer:
        'Insert all roots into a trie. For each sentence word, walk the trie: on a node with isEnd, replace with the prefix so far; on a missing child, keep the original word. Join with spaces. Time O(total root chars + total sentence chars), space O(total root chars).',
      rubric: ['Trie build then per-word walk with early stop', 'First isEnd wins (shortest)', 'States linear complexity'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be testing every root against every word — about 10⁸ character comparisons, and it re-walks shared root prefixes constantly. A trie stores those prefixes once: each word then walks at most its own length, and the first end-of-root marker hit is by construction the shortest root. Build once, query cheap. Time O(total characters), space O(dictionary characters).',
      rubric: ['Template followed with first-marker-is-shortest', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function replaceWords(dictionary: string[], sentence: string): string {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [['cat', 'bat', 'rat'], 'the cattle was rattled by the battery'],
        expected: 'the cat was rat by the bat',
        label: 'example',
      },
      { args: [['a', 'b', 'c'], 'aadsfasf absbs bbab cadsfafs'], expected: 'a a b c', label: 'single-char roots' },
      { args: [['catt', 'cat', 'bat', 'rat'], 'the cattle was rattled by the battery'], expected: 'the cat was rat by the bat', label: 'shortest root wins' },
      { args: [['ac', 'ab'], 'it is abnormal that this solution is accepted'], expected: 'it is ab that this solution is ac', label: 'sibling roots', hidden: true },
      { args: [['xyz'], 'no words match here'], expected: 'no words match here', label: 'no replacements', hidden: true },
      { args: [['e', 'k', 'c', 'harqp', 'h', 'gsafc'], 'aa bb cc ee'], expected: 'aa bb c e', label: 'partial matches only', hidden: true },
    ],
    referenceSolution:
      "export function replaceWords(dictionary: string[], sentence: string): string {\n  interface Node { children: Map<string, Node>; isEnd: boolean }\n  const makeNode = (): Node => ({ children: new Map(), isEnd: false })\n  const root = makeNode()\n  for (const word of dictionary) {\n    let node = root\n    for (const ch of word) {\n      let next = node.children.get(ch)\n      if (!next) {\n        next = makeNode()\n        node.children.set(ch, next)\n      }\n      node = next\n    }\n    node.isEnd = true\n  }\n  const shorten = (word: string): string => {\n    let node = root\n    for (let i = 0; i < word.length; i++) {\n      const next = node.children.get(word[i])\n      if (!next) return word\n      if (next.isEnd) return word.slice(0, i + 1)\n      node = next\n    }\n    return word\n  }\n  return sentence.split(' ').map(shorten).join(' ')\n}\n",
    complexity: { time: 'O(total characters)', space: 'O(dictionary characters)' },
  },
}
