import type { Problem } from '../../types'

export const implementTrie: Problem = {
  id: 'implement-trie',
  leetcodeId: 208,
  title: 'Implement Trie (Prefix Tree)',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'tries',
  authored: true,
  statement:
    'Implement a class `Trie` with `insert(word)`, `search(word)` (true if the exact word was inserted), and `startsWith(prefix)` (true if any inserted word begins with `prefix`). All strings are lowercase letters.',
  examples: [
    {
      input: 'insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")',
      output: 'true, false, true, true',
      explanation: '"app" is a prefix of "apple" but only a stored word after its own insert.',
    },
  ],
  constraints: ['1 <= word.length, prefix.length <= 2000', 'lowercase English letters', 'up to 3 * 10^4 calls'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a stream of insert/search/startsWith calls. Output: booleans distinguishing "stored word" from "prefix of a stored word" — that distinction forces an explicit end-of-word marker.',
      rubric: ['API-design framing', 'Word-vs-prefix distinction → end marker'],
      teachingNote:
        'The search/startsWith split is the entire design pressure: both walk the same path; only the final check differs (end flag vs mere existence). Notice contract subtleties like this at the I/O step.',
    },
    whatToFind: {
      modelAnswer: 'Design a structure whose lookup cost depends on the *query length*, not on how many words are stored.',
      rubric: ['Cost-per-query-length goal named', 'Independence from dictionary size'],
      teachingNote:
        'This sentence — "cost proportional to the key, not the collection" — is the trie\'s entire reason to exist. Say it and the interviewer knows you understand *why*, not just *how*.',
    },
    constraintsHint: {
      modelAnswer:
        '3×10⁴ calls with words up to 2000 chars: per-call work must be O(word). Lowercase-only → each node needs at most 26 children (array or map).',
      rubric: ['Per-call O(L) budget derived', '26-way branching from the alphabet'],
      teachingNote:
        'Multiply calls × length before choosing a design: 3×10⁴ × 2000 = 6×10⁷ character steps — fine. A per-call scan over all stored words would not be. Budget math first, structure second.',
    },
    bruteForce: {
      modelAnswer:
        'Store words in an array or hash set: insert O(1), search O(1) via the set, but startsWith must scan every stored word — O(N·L) per call, up to 6×10⁷ character comparisons each time.',
      rubric: ['Set-based baseline with the startsWith scan flaw', 'States the per-call blowup'],
      teachingNote:
        'A hash set nails 2 of the 3 operations — always locate *which* operation breaks the naive design. Here it\'s startsWith; the trie is what fixes exactly that.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The scan re-compares shared prefixes over and over — "app" is re-walked inside every word starting with it. Store the prefixes *once* as tree paths: each node is one character step, shared by all words through it. Pattern: Trie.',
      rubric: ['Waste: shared prefixes re-compared per word', 'Prefixes-as-shared-paths insight'],
      acceptedPatterns: ['trie'],
      teachingNote:
        'Tries are deduplicated prefixes. When a problem\'s waste is "re-walking common prefixes", the trie is the answer even if the word "prefix" never appears in the statement.',
    },
    algorithm: {
      modelAnswer:
        'Node = { children: Map<char, Node>, isEnd: boolean }. insert: walk/create per char, set isEnd at the last. search: walk; false on a missing child; return isEnd. startsWith: same walk; return true on arrival. All O(L) time, O(total chars) space.',
      rubric: [
        'Node shape with children + isEnd',
        'Three walks with correct terminal checks',
        'States O(L) per op / O(total chars) space',
      ],
      teachingNote:
        'insert/search/startsWith share one traversal helper — write `walk(s)` once and the class shrinks to a few lines. DRY code under interview pressure reads as fluency.',
    },
    interviewScript: {
      modelAnswer:
        'A hash set handles insert and exact search but startsWith degenerates to scanning every word — O(N·L) per call. The waste is re-comparing shared prefixes, so I\'ll store them once: a trie where each node maps a character to the next node and flags word-ends. All three operations become single O(L) walks. Space O(total characters).',
      rubric: ['Template followed with the which-op-breaks analysis', 'Per-op complexity stated'],
      teachingNote:
        'Design-problem scripts replace "brute force is slow" with "the naive structure breaks on operation X". Keep the same template rhythm; swap the nouns.',
    },
  },
  incrementalBuild: [
    {
      label: '1. The node shape: children map + end-of-word flag',
      code: 'class TrieNode {\n  children = new Map<string, TrieNode>()\n  isEnd = false   // distinguishes stored words from mere prefixes\n}',
    },
    {
      label: '2. One shared walk powers both queries',
      code: 'private walk(s: string): TrieNode | null {\n  let node = this.root\n  for (const ch of s) {\n    const next = node.children.get(ch)\n    if (!next) return null   // path breaks -> not present\n    node = next\n  }\n  return node                // node where the string ends\n}',
    },
    {
      label: '3. Insert: create-as-you-walk, flag the last node',
      code: 'insert(word: string): void {\n  let node = this.root\n  for (const ch of word) {\n    let next = node.children.get(ch)\n    if (!next) {\n      next = new TrieNode()\n      node.children.set(ch, next)   // shared by every word through here\n    }\n    node = next\n  }\n  node.isEnd = true\n}',
    },
    {
      label: '4. The two queries differ only in the final check',
      code: 'search(word: string): boolean {\n  const node = this.walk(word)\n  return node !== null && node.isEnd   // must be a stored WORD\n}\nstartsWith(prefix: string): boolean {\n  return this.walk(prefix) !== null    // mere existence suffices\n}',
    },
  ],
  code: {
    signature:
      'export class Trie {\n  insert(word: string): void {\n    // your code here\n  }\n  search(word: string): boolean {\n    return false\n  }\n  startsWith(prefix: string): boolean {\n    return false\n  }\n}\n',
    harness: 'class-design',
    tests: [
      {
        args: [
          ['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search'],
          [[], ['apple'], ['apple'], ['app'], ['app'], ['app'], ['app']],
        ],
        expected: [null, null, true, false, true, null, true],
        label: 'example sequence',
      },
      {
        args: [
          ['Trie', 'startsWith', 'search'],
          [[], ['a'], ['a']],
        ],
        expected: [null, false, false],
        label: 'empty trie queries',
      },
      {
        args: [
          ['Trie', 'insert', 'search', 'search', 'startsWith'],
          [[], ['ab'], ['a'], ['ab'], ['ab']],
        ],
        expected: [null, null, false, true, true],
        label: 'prefix is not a word',
        hidden: true,
      },
      {
        args: [
          ['Trie', 'insert', 'insert', 'search', 'search', 'startsWith'],
          [[], ['cat'], ['car'], ['cat'], ['car'], ['ca']],
        ],
        expected: [null, null, null, true, true, true],
        label: 'branching words',
        hidden: true,
      },
      {
        args: [
          ['Trie', 'insert', 'search', 'startsWith', 'startsWith'],
          [[], ['z'], ['z'], ['z'], ['zz']],
        ],
        expected: [null, null, true, true, false],
        label: 'single char word',
        hidden: true,
      },
    ],
    referenceSolution:
      'class TrieNode {\n  children = new Map<string, TrieNode>()\n  isEnd = false\n}\n\nexport class Trie {\n  private root = new TrieNode()\n\n  private walk(s: string): TrieNode | null {\n    let node = this.root\n    for (const ch of s) {\n      const next = node.children.get(ch)\n      if (!next) return null\n      node = next\n    }\n    return node\n  }\n\n  insert(word: string): void {\n    let node = this.root\n    for (const ch of word) {\n      let next = node.children.get(ch)\n      if (!next) {\n        next = new TrieNode()\n        node.children.set(ch, next)\n      }\n      node = next\n    }\n    node.isEnd = true\n  }\n\n  search(word: string): boolean {\n    const node = this.walk(word)\n    return node !== null && node.isEnd\n  }\n\n  startsWith(prefix: string): boolean {\n    return this.walk(prefix) !== null\n  }\n}\n',
    complexity: { time: 'O(L) per operation', space: 'O(total characters)' },
  },
}
