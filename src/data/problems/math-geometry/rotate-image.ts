import type { Problem } from '../../types'

export const rotateImage: Problem = {
  id: 'rotate-image',
  leetcodeId: 48,
  title: 'Rotate Image',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'math-geometry',
  authored: true,
  statement:
    'Given an `n × n` matrix, rotate it 90° clockwise **in place** (modify the matrix; allocating another matrix is not allowed) and return it.',
  examples: [
    { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
    { input: 'matrix = [[1]]', output: '[[1]]' },
  ],
  constraints: ['1 <= n <= 20', '-1000 <= matrix[i][j] <= 1000'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a square matrix (squareness is essential — rectangular can\'t rotate in place). Output: the same matrix rotated 90° clockwise, mutated in place.',
      rubric: ['Squareness flagged as load-bearing', 'In-place mutation contract'],
      teachingNote:
        'Check the target mapping immediately with one concrete cell: (row r, col c) → (row c, col n−1−r). Writing the coordinate map down before anything else grounds every later step.',
    },
    whatToFind: {
      modelAnswer: 'A rearrangement by a fixed permutation of positions — every cell moves to a known destination; no values are computed.',
      rubric: ['Fixed-permutation framing', 'Pure movement, no computation'],
      teachingNote:
        'Rotations, spirals, and zeroing tasks are all *index choreography*. The taxonomy answer "rearrange by formula" tells you the work is in decomposing the movement, not in any algorithmic search.',
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 20 — 400 cells, speed is a non-issue. "In place" is the entire constraint: the naive rotated copy is O(n²) space and explicitly banned.',
      rubric: ['Recognizes in-place as the real constraint', 'Speed dismissed explicitly'],
      teachingNote:
        'When a constraint bans the easy answer ("without division", "in place", "one pass"), the problem is *about* that ban. Organize your whole approach around it.',
    },
    bruteForce: {
      modelAnswer: 'Build a new matrix with result[c][n−1−r] = matrix[r][c], then copy back: O(n²) time, O(n²) space — banned by the statement.',
      rubric: ['Copy-rotate stated with the correct mapping', 'Space violation named'],
      teachingNote:
        'Even for a banned approach, write the mapping formula — the in-place solution must produce the same mapping, so the brute force doubles as your correctness oracle.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The copy duplicates every cell when the rotation decomposes into two self-inverse in-place moves: transpose (swap across the main diagonal) then reverse each row — their composition is exactly the clockwise map. Pattern: Math (transformation decomposition).',
      rubric: ['Transpose + row-reverse decomposition', 'Verifies the composition equals the target map'],
      acceptedPatterns: ['math'],
      teachingNote:
        'Verify the decomposition on one cell: (r,c) −transpose→ (c,r) −row-reverse→ (c, n−1−r) ✓ matches the target. A 10-second spot check beats a mental proof every time. (Counter-clockwise = transpose + reverse *columns*.)',
    },
    algorithm: {
      modelAnswer:
        'Pass 1 — transpose: for r < c, swap [r][c] with [c][r] (upper triangle only, or cells swap back). Pass 2 — reverse each row with two pointers. Time O(n²), space O(1).',
      rubric: [
        'Triangle-limited transpose loop (no double swap)',
        'Per-row two-pointer reverse',
        'States O(n²)/O(1)',
      ],
      teachingNote:
        'The transpose bug is iterating the full square — every pair swaps twice and nothing changes. Loop c from r+1, and say why aloud; that "why" is what the interviewer is grading.',
    },
    interviewScript: {
      modelAnswer:
        'The straightforward rotated copy is banned — in place is the whole game. A 90° clockwise rotation factors into two moves that are each trivially in-place: transpose across the main diagonal, then reverse every row; checking one cell, (r,c) → (c,r) → (c, n−1−r), confirms the composition. Two clean O(n²) passes, O(1) extra space.',
      rubric: ['Template adapted: constraint → decomposition → verification', 'Cell-check verification mentioned'],
      teachingNote:
        'The one-cell verification in the script is deliberate: decomposition claims are cheap, demonstrated checks are convincing. Make "let me verify with (0,1)" part of your standard patter.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Verify the decomposition on one cell before coding',
      code: '// target map: (r, c) -> (c, n-1-r)\n// transpose:   (r, c) -> (c, r)\n// row-reverse: (c, r) -> (c, n-1-r)   ✓ composition matches',
    },
    {
      label: '2. Transpose — upper triangle only, or every pair swaps back',
      code: 'for (let r = 0; r < n; r++) {\n  for (let c = r + 1; c < n; c++) {   // c starts at r+1!\n    ;[matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]]\n  }\n}',
    },
    {
      label: '3. Reverse each row',
      code: 'for (const row of matrix) row.reverse()\n// counter-clockwise would instead reverse COLUMNS after transposing',
    },
  ],
  code: {
    signature: 'export function rotate(matrix: number[][]): number[][] {\n  // rotate in place, then return the matrix\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]], label: 'example 3×3' },
      { args: [[[1]]], expected: [[1]], label: 'single cell' },
      { args: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]], label: '2×2' },
      {
        args: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]],
        expected: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]],
        label: '4×4',
        hidden: true,
      },
      { args: [[[-1, -2], [-3, -4]]], expected: [[-3, -1], [-4, -2]], label: 'negatives', hidden: true },
    ],
    referenceSolution:
      'export function rotate(matrix: number[][]): number[][] {\n  const n = matrix.length\n  for (let r = 0; r < n; r++) {\n    for (let c = r + 1; c < n; c++) {\n      ;[matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]]\n    }\n  }\n  for (const row of matrix) row.reverse()\n  return matrix\n}\n',
    complexity: { time: 'O(n²)', space: 'O(1)' },
  },
}
