import type { Problem } from '../../types'

export const wordSearch: Problem = {
  id: 'word-search',
  leetcodeId: 79,
  title: 'Word Search',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'backtracking',
  authored: true,
  statement:
    'Given an `m × n` grid of letters `board` and a string `word`, return `true` if the word can be traced through **horizontally or vertically adjacent** cells, using each cell at most once.',
  examples: [
    { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
    { input: 'same board, word = "SEE"', output: 'true' },
    { input: 'same board, word = "ABCB"', output: 'false', explanation: 'B would be reused.' },
  ],
  constraints: ['1 <= m, n <= 6', '1 <= word.length <= 15', 'uppercase/lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a tiny grid (≤ 36 cells) and a word ≤ 15 chars. Output: boolean — existence of one valid path. Adjacency is 4-directional; the no-reuse rule makes paths self-avoiding.',
      rubric: ['4-adjacency and no-reuse stated', 'Existence (first hit wins), not enumeration'],
    },
    whatToFind: {
      modelAnswer: 'Existence of a self-avoiding path spelling the word — a constrained path search from every possible start.',
      rubric: ['Path-existence framing', 'All starting cells considered'],
    },
    constraintsHint: {
      modelAnswer:
        'Bounds (36 cells, 15 letters) permit exponential search — worst case ~36·3¹⁴, pruned hard in practice. Tiny bounds again signal DFS + backtracking, not clever data structures.',
      rubric: ['Reads tiny bounds as exponential-search license', 'Estimates the branch factor (3 after the first step)'],
    },
    bruteForce: {
      modelAnswer:
        'Enumerate every self-avoiding path of length |word| and compare each to the word: generates paths blindly before checking letters — astronomically many at length 15.',
      rubric: ['Blind path enumeration named', 'Notes checking happens after generation'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Almost every path dies at its *first* wrong letter, yet blind enumeration builds it to full length. Check the letter at each step and recurse only on matches, un-marking cells on the way back. Pattern: Backtracking (DFS with visited-marking).',
      rubric: ['Waste: extending paths already mismatched', 'Match-check-per-step with unmark on return'],
      acceptedPatterns: ['backtracking', 'dfs'],
    },
    algorithm: {
      modelAnswer:
        'For each cell equal to word[0]: dfs(r, c, i) — if letters mismatch or out of bounds, fail; if i is the last index, succeed. Mark the cell (e.g. overwrite with "#"), try 4 neighbors with i+1, restore the cell, return any success. Time O(m·n·3^L), space O(L) recursion.',
      rubric: [
        'Per-start DFS with in-place marking and restore',
        'Base cases (mismatch, bounds, completion) correct',
        'States O(m·n·3^L)/O(L)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be enumerating all self-avoiding paths of the word\'s length and comparing — paths die at their first wrong letter, so building them fully is waste. I\'ll DFS from each matching start cell, checking the next letter before recursing, marking cells in place to prevent reuse and restoring them on backtrack. Time O(m·n·3^L) worst case with heavy practical pruning, space O(L).',
      rubric: ['Template followed with die-at-first-mismatch pruning', 'Mark/restore mechanics mentioned'],
    },
  },
  code: {
    signature: 'export function exist(board: string[][], word: string): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'],
        expected: true,
        label: 'example snake path',
      },
      {
        args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'SEE'],
        expected: true,
        label: 'path with turn',
      },
      {
        args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCB'],
        expected: false,
        label: 'reuse forbidden',
      },
      { args: [[['A']], 'A'], expected: true, label: 'single cell hit', hidden: true },
      { args: [[['A']], 'AB'], expected: false, label: 'word longer than grid', hidden: true },
      {
        args: [[['A', 'A', 'A'], ['A', 'A', 'A'], ['A', 'A', 'A']], 'AAAAAAAAA'],
        expected: true,
        label: 'full-grid snake',
        hidden: true,
      },
      {
        args: [[['a', 'b'], ['c', 'd']], 'abdc'],
        expected: true,
        label: 'perimeter walk',
        hidden: true,
      },
    ],
    referenceSolution:
      "export function exist(board: string[][], word: string): boolean {\n  const m = board.length\n  const n = board[0].length\n  const dfs = (r: number, c: number, i: number): boolean => {\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[i]) return false\n    if (i === word.length - 1) return true\n    const saved = board[r][c]\n    board[r][c] = '#'\n    const found =\n      dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1)\n    board[r][c] = saved\n    return found\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (dfs(r, c, 0)) return true\n    }\n  }\n  return false\n}\n",
    complexity: { time: 'O(m·n·3^L)', space: 'O(L) recursion' },
  },
}
