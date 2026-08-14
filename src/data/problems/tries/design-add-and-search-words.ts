import type { Problem } from '../../types'

export const designAddAndSearchWords: Problem = {
  id: 'design-add-and-search-words',
  leetcodeId: 211,
  title: 'Design Add and Search Words',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'tries',
  authored: true,
  statement:
    'Implement a class `WordDictionary` with `addWord(word)` and `search(word)`, where `search` returns true if any added word matches — `word` may contain `.` as a wildcard matching **any single letter**. All strings are lowercase letters.',
  examples: [
    {
      input: 'addWord("bad"), addWord("dad"), addWord("mad"), search("pad"), search("bad"), search(".ad"), search("b..")',
      output: 'false, true, true, true',
      explanation: '".ad" and "b.." both match stored words via wildcard.',
    },
  ],
  constraints: ['1 <= word.length <= 25', 'lowercase letters and "." only in search', 'up to 10^4 addWord/search calls', 'up to 2 wildcard "." per search call in practice, but not guaranteed'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a stream of addWord/search calls. Output: booleans, where search\'s pattern may contain "." matching any single character. This is Implement Trie plus one twist: search is no longer a single deterministic path.',
      rubric: ['API-design framing carried over from plain trie', 'Wildcard breaks the single-path walk'],
      teachingNote:
        'Name the delta from the plain trie explicitly: same structure, but search becomes pattern matching, not lookup. That reframing is the whole problem.',
    },
    whatToFind: {
      modelAnswer:
        'A structure supporting fast prefix-shared storage (trie) plus a search that, on a wildcard character, must explore *every* branch at that position instead of picking one.',
      rubric: ['Trie for storage reused', 'Wildcard forces branching search, not lookup'],
      teachingNote:
        'The wildcard turns a walk into a search: "at this position, try all children" is textbook DFS/backtracking layered on top of the trie.',
    },
    constraintsHint: {
      modelAnswer:
        'word.length <= 25, up to 10⁴ calls. Deterministic chars still cost O(1) per step; a wildcard fans out to <=26 children, so a search with w wildcards costs up to O(26^w) in the worst case — acceptable since w is small in practice for this problem\'s tests.',
      rubric: ['Deterministic vs wildcard cost distinguished', 'Notes worst case is exponential in wildcard count but bounded by word length'],
      teachingNote:
        'Be honest about the worst case (26^w) rather than hand-waving it away — then note *why* it\'s fine here: short words, sparse dictionaries, and few wildcards per query in practice.',
    },
    bruteForce: {
      modelAnswer:
        'Store all words in an array. search(pattern): scan every stored word, compare char by char treating "." as always-match. O(N·L) per search — correct, but re-derives the trie\'s exact motivation from Implement Trie, now with a pattern-match twist.',
      rubric: ['Array-scan baseline with wildcard-aware comparison', 'States O(N·L) per call'],
      teachingNote:
        'This is literally the same brute force as Implement Trie — call that out. Reusing a prior insight quickly is exactly what interviewers want to see.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The scan re-walks shared prefixes across words, same waste as before — a trie removes that. What\'s new: at a wildcard position, instead of following one child, DFS into *all* children of the current node and continue the match from each, backtracking if a branch fails. Pattern: Trie + DFS.',
      rubric: ['Shared-prefix waste named (trie fix carried over)', 'DFS-over-all-children insight for wildcard positions'],
      acceptedPatterns: ['trie', 'dfs'],
      teachingNote:
        'This problem is a clean composition of two patterns you already know — say exactly that. "Trie for storage, DFS for the wildcard fan-out" is the one-sentence design.',
    },
    algorithm: {
      modelAnswer:
        'TrieNode = { children: Map<char, TrieNode>, isEnd: boolean }. addWord: same as plain trie insert. search(word): dfs(node, i): if i === word.length, return node.isEnd; ch = word[i]; if ch !== ".", follow node.children.get(ch) if present, else false; if ch === ".", try dfs(child, i+1) for every child of node, return true if any succeeds. Call dfs(root, 0).',
      rubric: [
        'addWord unchanged from plain-trie insert',
        'search recurses with an index; "." fans out over all children, else follows one child',
        'Base case at i === word.length checks isEnd',
      ],
      teachingNote:
        'Write search as dfs(node, i) — passing the index instead of slicing the string avoids O(L) substring copies per recursive call, a small but real efficiency habit.',
    },
    interviewScript: {
      modelAnswer:
        'This is Implement Trie with one twist: search patterns can contain "." as a single-char wildcard. Storage stays a trie — addWord is the standard insert. Search becomes a DFS over the trie: at a literal character, follow the one matching child; at a wildcard, try every child and recurse, succeeding if any branch reaches a node with isEnd true at the end of the pattern. Worst case exponential in the wildcard count, but bounded by word length and sparse in practice.',
      rubric: ['Names the delta from plain trie explicitly', 'Explains wildcard-fan-out DFS and states the worst case honestly'],
      teachingNote:
        'A strong signal in this script is explicitly connecting back to Implement Trie — showing you build on prior structures rather than reinventing from scratch.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Same node shape and insert as a plain trie',
      code: 'class TrieNode {\n  children = new Map<string, TrieNode>()\n  isEnd = false\n}\n\n// addWord walks/creates per char, flags the last node — identical to Implement Trie',
    },
    {
      label: '2. search recurses with an index, not a substring',
      code: 'private dfs(node: TrieNode, word: string, i: number): boolean {\n  if (i === word.length) return node.isEnd   // consumed the whole pattern\n  const ch = word[i]\n  // ...\n}',
    },
    {
      label: '3. Literal character: follow the one matching child',
      code: 'if (ch !== \'.\') {\n  const next = node.children.get(ch)\n  return next !== undefined && this.dfs(next, word, i + 1)\n}',
    },
    {
      label: '4. Wildcard: fan out over every child, succeed if any branch matches',
      code: 'for (const child of node.children.values()) {\n  if (this.dfs(child, word, i + 1)) return true   // short-circuit on first success\n}\nreturn false',
    },
  ],
  code: {
    signature:
      'export class WordDictionary {\n  addWord(word: string): void {\n    // your code here\n  }\n  search(word: string): boolean {\n    return false\n  }\n}\n',
    harness: 'class-design',
    tests: [
      {
        args: [
          ['WordDictionary', 'addWord', 'addWord', 'addWord', 'search', 'search', 'search', 'search'],
          [[], ['bad'], ['dad'], ['mad'], ['pad'], ['bad'], ['.ad'], ['b..']],
        ],
        expected: [null, null, null, null, false, true, true, true],
        label: 'example sequence',
      },
      {
        args: [
          ['WordDictionary', 'search'],
          [[], ['a']],
        ],
        expected: [null, false],
        label: 'search empty dictionary',
      },
      {
        args: [
          ['WordDictionary', 'addWord', 'search', 'search'],
          [[], ['a'], ['a'], ['.']],
        ],
        expected: [null, null, true, true],
        label: 'single char word and wildcard',
      },
      {
        args: [
          ['WordDictionary', 'addWord', 'search'],
          [[], ['ab'], ['a']],
        ],
        expected: [null, null, false],
        label: 'no partial-length match',
        hidden: true,
      },
      {
        args: [
          ['WordDictionary', 'addWord', 'addWord', 'search'],
          [[], ['ab'], ['ac'], ['a.']],
        ],
        expected: [null, null, null, true],
        label: 'wildcard fans out across siblings',
        hidden: true,
      },
      {
        args: [
          ['WordDictionary', 'addWord', 'search'],
          [[], ['abc'], ['...']],
        ],
        expected: [null, null, true],
        label: 'all wildcards',
        hidden: true,
      },
    ],
    referenceSolution:
      'class TrieNode {\n  children = new Map<string, TrieNode>()\n  isEnd = false\n}\n\nexport class WordDictionary {\n  private root = new TrieNode()\n\n  addWord(word: string): void {\n    let node = this.root\n    for (const ch of word) {\n      let next = node.children.get(ch)\n      if (!next) {\n        next = new TrieNode()\n        node.children.set(ch, next)\n      }\n      node = next\n    }\n    node.isEnd = true\n  }\n\n  search(word: string): boolean {\n    return this.dfs(this.root, word, 0)\n  }\n\n  private dfs(node: TrieNode, word: string, i: number): boolean {\n    if (i === word.length) return node.isEnd\n    const ch = word[i]\n    if (ch !== \'.\') {\n      const next = node.children.get(ch)\n      return next !== undefined && this.dfs(next, word, i + 1)\n    }\n    for (const child of node.children.values()) {\n      if (this.dfs(child, word, i + 1)) return true\n    }\n    return false\n  }\n}\n',
    complexity: { time: 'O(L) deterministic, up to O(26^w · L) with w wildcards', space: 'O(total characters)' },
  },
}
