import type { Problem } from '../../types'

export const wordSearchIi: Problem = {
  id: 'word-search-ii',
  leetcodeId: 212,
  title: 'Word Search II',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'tries',
  authored: true,
  statement:
    'Given an `m × n` grid of letters `board` and a list of strings `words`, return all words from `words` that can be traced through horizontally or vertically adjacent cells, using each cell at most once per word. Return the found words in any order.',
  examples: [
    {
      input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
      output: '["eat","oath"]',
      explanation: '"pea" has no \'p\' in the board and "rain" has no \'a\' adjacent to any \'r\'.',
    },
  ],
  constraints: ['1 <= m, n <= 12', '1 <= words.length <= 3 * 10^4', '1 <= words[i].length <= 10', 'lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a small grid (up to 12×12) and a list of up to 3×10⁴ candidate words. Output: the subset of words traceable through 4-adjacent, non-reused cells, in any order.',
      rubric: ['Notes the grid size vs. the potentially large word list', 'Output is a subset in any order (no ordering guarantee)'],
    },
    whatToFind: {
      modelAnswer:
        'Existence of a self-avoiding path for each candidate word, but batched across many words at once rather than solved independently — the words share massive prefix overlap I should exploit.',
      rubric: ['Frames each word as a path-existence search like single Word Search', 'Notices words share prefixes that a per-word search would re-walk'],
    },
    constraintsHint: {
      modelAnswer:
        'Running an independent single-word search (O(m·n·4^L) each) for up to 3×10⁴ words would re-walk the same board region over and over for words sharing a prefix — the grid is small, so the real cost driver is the word count, and that\'s exactly what shared-prefix search collapses.',
      rubric: ['Identifies word count (not grid size) as the dominant cost if searched independently', 'Connects shared prefixes to redundant re-searching'],
    },
    bruteForce: {
      modelAnswer:
        'For each word independently, run a DFS/backtracking search from every cell matching its first letter (like single Word Search). Correct, but with W words of length up to L it repeats the same board exploration up to W times even when words share prefixes: roughly O(W · m·n·4^L).',
      rubric: ['Names running single Word Search per word independently', 'States the repeated-exploration cost tied to word count'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The waste is re-exploring the same board paths once per word that shares a prefix with another word — "oa" gets walked separately for every word starting "oa". Merge all words into one trie first, then do a single DFS over the board that walks the trie alongside it: one board exploration serves every word simultaneously, and a path dies the moment it falls off the trie. Pattern: Trie + Backtracking.',
      rubric: ['Names the waste: repeated board exploration for shared prefixes across words', 'Proposes merging words into one trie and doing one combined DFS over the board'],
      acceptedPatterns: ['trie', 'backtracking'],
    },
    algorithm: {
      modelAnswer:
        'Build a trie of all words: each node has a children map and an optional `word` field set at the node completing that word. DFS from every board cell with the trie root as the starting context: at (r, c, node), if out of bounds, already visited, or board[r][c] has no matching child under node, stop. Otherwise descend to the child node; if that node has `.word` set, record it in results and clear `.word` to `undefined` (so the same word found via another path isn\'t added twice — the node itself must stay, since its children may still complete longer words). Mark board[r][c] visited (overwrite with a sentinel like "#"), recurse into all 4 neighbors with the descended node, then restore board[r][c]. Time O(m·n·4^L) worst case bounded by the trie depth, space O(sum of word lengths) for the trie plus O(L) recursion.',
      rubric: [
        'Trie built once over all words with a word-completion marker per node',
        'Single combined DFS over the board following the trie, marking/restoring visited cells',
        'Clears the word marker (not the node) on a hit to prevent duplicate results, states complexity',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Searching for each word independently re-walks the same board region whenever words share a prefix — wasteful given up to 3×10⁴ words. So I merge every word into one trie first, then run a single DFS from each board cell that descends the trie in step with the board: a path dies as soon as the current cell has no matching trie child. Whenever I land on a node marked as a complete word, I record it and clear that marker so it\'s never added twice, while leaving the node itself intact for any longer words through it. One board exploration now serves all words at once. Time O(m·n·4^L) bounded by trie depth, space O(total word characters).',
      rubric: ['Follows the script template end-to-end', 'States the single-trie-DFS insight and final complexity'],
    },
  },
  code: {
    signature: 'export function findWords(board: string[][], words: string[]): string[] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      {
        args: [
          [
            ['o', 'a', 'a', 'n'],
            ['e', 't', 'a', 'e'],
            ['i', 'h', 'k', 'r'],
            ['i', 'f', 'l', 'v'],
          ],
          ['oath', 'pea', 'eat', 'rain'],
        ],
        expected: ['eat', 'oath'],
        label: 'classic example',
      },
      {
        args: [
          [
            ['a', 'b'],
            ['c', 'd'],
          ],
          ['ab', 'cd', 'ac', 'bd', 'abcd'],
        ],
        expected: ['ab', 'ac', 'bd', 'cd'],
        label: '2x2 grid, several findable, one impossible order',
      },
      {
        args: [[['a']], ['a', 'b']],
        expected: ['a'],
        label: 'single cell board',
      },
      {
        args: [
          [
            ['a', 'b'],
            ['c', 'd'],
          ],
          ['xyz'],
        ],
        expected: [],
        label: 'no word present at all',
        hidden: true,
      },
      {
        args: [[['a', 'a']], ['a']],
        expected: ['a'],
        label: 'reachable from two cells but reported once',
        hidden: true,
      },
      {
        args: [[['a', 'a']], ['aaa']],
        expected: [],
        label: 'not enough distinct cells (no reuse)',
        hidden: true,
      },
      {
        args: [
          [
            ['a', 'b'],
            ['b', 'a'],
          ],
          ['ab', 'ba'],
        ],
        expected: ['ab', 'ba'],
        label: 'multiple words each with multiple paths',
        hidden: true,
      },
    ],
    referenceSolution:
      "class TrieNode {\n  children = new Map<string, TrieNode>()\n  word: string | undefined = undefined\n}\n\nexport function findWords(board: string[][], words: string[]): string[] {\n  const root = new TrieNode()\n  for (const word of words) {\n    let node = root\n    for (const ch of word) {\n      let next = node.children.get(ch)\n      if (!next) {\n        next = new TrieNode()\n        node.children.set(ch, next)\n      }\n      node = next\n    }\n    node.word = word\n  }\n\n  const m = board.length\n  const n = board[0].length\n  const result: string[] = []\n\n  const dfs = (r: number, c: number, node: TrieNode): void => {\n    if (r < 0 || r >= m || c < 0 || c >= n) return\n    const ch = board[r][c]\n    if (ch === '#') return\n    const next = node.children.get(ch)\n    if (!next) return\n    if (next.word !== undefined) {\n      result.push(next.word)\n      next.word = undefined\n    }\n    board[r][c] = '#'\n    dfs(r + 1, c, next)\n    dfs(r - 1, c, next)\n    dfs(r, c + 1, next)\n    dfs(r, c - 1, next)\n    board[r][c] = ch\n  }\n\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      dfs(r, c, root)\n    }\n  }\n\n  return result\n}\n",
    complexity: { time: 'O(m·n·4^L) bounded by trie depth', space: 'O(total word characters)' },
  },
}
