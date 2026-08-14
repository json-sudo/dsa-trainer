import type { Problem } from '../../types'

export const setMatrixZeroes: Problem = {
  id: 'set-matrix-zeroes',
  leetcodeId: 73,
  title: 'Set Matrix Zeroes',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'math-geometry',
  authored: true,
  statement:
    'Given an `m × n` matrix, if a cell is `0`, set its **entire row and column** to `0` — in place, and return the matrix. Aim for O(1) extra space.',
  examples: [
    { input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]' },
    { input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]' },
  ],
  constraints: ['1 <= m, n <= 200', '-2^31 <= value <= 2^31 - 1', 'follow-up: O(1) extra space'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: any m×n integer matrix. Output: the same matrix with rows/columns of *original* zeros wiped — the original/derived distinction is the entire trap.',
      rubric: ['Original-vs-written zeros distinction stated', 'In-place + O(1)-space goal'],
    },
    whatToFind: {
      modelAnswer: 'Mark which rows and columns contained a zero, then apply the wipe — a two-phase mark-then-apply rearrangement.',
      rubric: ['Two-phase (mark, apply) decomposition', 'Per-row/per-column flags identified'],
    },
    constraintsHint: {
      modelAnswer:
        'Naive in-place zeroing as you scan cascades (written zeros trigger more wipes) — phases must be separated. O(m+n) flag arrays are easy; the O(1) follow-up reuses row 0 and column 0 *as* the flags.',
      rubric: ['Cascade hazard named', 'First-row/column-as-storage idea'],
    },
    bruteForce: {
      modelAnswer:
        'Copy the matrix; scan the copy for zeros and wipe rows/columns in the original: O(m·n) time but O(m·n) extra space.',
      rubric: ['Copy-based two-phase', 'Space cost named'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The copy stores m·n cells to answer m+n boolean questions ("does row i / column j get wiped?"). Store those booleans *inside* the matrix: row 0 and column 0 become the flag arrays, with two scalars remembering their own fate. Pattern: Math (in-place markers).',
      rubric: ['Waste: m·n storage for m+n bits', 'Border-as-flag-storage scheme'],
      acceptedPatterns: ['math'],
    },
    algorithm: {
      modelAnswer:
        'Scalars firstRowZero / firstColZero from scanning the borders. Scan interior: a zero at (r,c) sets matrix[r][0] = 0 and matrix[0][c] = 0. Wipe interior rows/cols per those flags (interior first!). Finally wipe row 0 / column 0 per the scalars. Time O(m·n), space O(1).',
      rubric: [
        'Border scalars captured before marking',
        'Interior wiped before the borders',
        'States O(m·n)/O(1)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'The trap is cascading — zeros I write must not trigger wipes — so it\'s mark-then-apply. Flag arrays cost O(m+n); the follow-up packs those flags into row 0 and column 0 themselves, with two scalars preserving the borders\' own fate, applying interior wipes before border wipes. Time O(m·n), space O(1).',
      rubric: ['Template followed: trap → phases → in-matrix flags', 'Ordering detail (interior first) stated'],
    },
  },
  code: {
    signature: 'export function setZeroes(matrix: number[][]): number[][] {\n  // modify in place, then return the matrix\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]], label: 'example' },
      {
        args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]],
        expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]],
        label: 'zeros in first row',
      },
      { args: [[[1, 2], [3, 4]]], expected: [[1, 2], [3, 4]], label: 'no zeros' },
      { args: [[[0]]], expected: [[0]], label: 'single zero cell', hidden: true },
      { args: [[[1], [0], [3]]], expected: [[0], [0], [0]], label: 'single column', hidden: true },
      {
        args: [[[1, 0, 3], [4, 5, 6]]],
        expected: [[0, 0, 0], [4, 0, 6]],
        label: 'zero only in first row',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function setZeroes(matrix: number[][]): number[][] {\n  const m = matrix.length\n  const n = matrix[0].length\n  let firstRowZero = false\n  let firstColZero = false\n  for (let c = 0; c < n; c++) if (matrix[0][c] === 0) firstRowZero = true\n  for (let r = 0; r < m; r++) if (matrix[r][0] === 0) firstColZero = true\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      if (matrix[r][c] === 0) {\n        matrix[r][0] = 0\n        matrix[0][c] = 0\n      }\n    }\n  }\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0\n    }\n  }\n  if (firstRowZero) for (let c = 0; c < n; c++) matrix[0][c] = 0\n  if (firstColZero) for (let r = 0; r < m; r++) matrix[r][0] = 0\n  return matrix\n}\n',
    complexity: { time: 'O(m·n)', space: 'O(1)' },
  },
}
