import type { Problem } from '../../types'

export const spiralMatrix: Problem = {
  id: 'spiral-matrix',
  leetcodeId: 54,
  title: 'Spiral Matrix',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'math-geometry',
  authored: true,
  statement:
    'Given an `m x n` matrix, return all elements of the matrix in **spiral order** — right along the top, down the right edge, left along the bottom, up the left edge, then shrink inward and repeat.',
  examples: [
    { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' },
    { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]' },
  ],
  constraints: ['1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an m×n matrix. Output: a flat array of all m·n elements visited in the right→down→left→up spiral order, shrinking inward each full loop. Every element appears exactly once.',
      rubric: ['Output length must equal m*n', 'Direction cycle right/down/left/up stated'],
      teachingNote:
        'Get the candidate to trace the 3x3 example by hand before coding — a manual walk surfaces the boundary-shrinking behavior that\'s otherwise easy to get subtly wrong.',
    },
    whatToFind: {
      modelAnswer:
        'A traversal order, not a search — there is no target to find, just a deterministic path visiting every cell once. The real content of the problem is correctly managing four shrinking boundaries as edges get consumed.',
      rubric: ['Recognizes this as pure traversal, not search/optimization', 'Names boundary management as the core difficulty'],
      teachingNote:
        'This is a good moment to flag that "math/geometry" problems on this list are often more about meticulous index bookkeeping than clever algorithmic insight — precision is the skill being tested.',
    },
    constraintsHint: {
      modelAnswer:
        'm, n ≤ 10 → at most 100 elements. There\'s no algorithmic complexity concern at all here; the constraints exist purely to keep hand-tracing feasible for the interviewer, not to hint at a technique.',
      rubric: ['Notes the tiny size rules out any complexity concern', 'Understands this step is about correctness, not performance'],
      teachingNote:
        'Worth naming explicitly when a constraints step has nothing to say about complexity — not every problem\'s constraints gate the algorithm choice, and recognizing that is itself a skill.',
    },
    bruteForce: {
      modelAnswer:
        'Simulate step by step with a "visited" boolean grid: walk in the current direction, and whenever the next cell is out of bounds or already visited, turn 90° clockwise. Correct and simple, but the extra O(m·n) visited grid is unnecessary bookkeeping.',
      rubric: ['Visited-grid simulation with turn-on-blocked logic described', 'Notes the extra grid as avoidable overhead'],
      teachingNote:
        'The visited-grid version is a perfectly acceptable *answer* on its own — frame it as "waste" only in the sense of extra space, not as wrong or inelegant, so as not to undersell a valid approach.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The visited grid is redundant: at any moment, the set of unvisited cells is always exactly the current rectangular sub-region — its boundaries are fully described by four shrinking pointers (top, bottom, left, right), no per-cell membership check needed. Walk each of the four edges of that rectangle, then shrink the corresponding boundary inward and repeat. Pattern: boundary-pointer simulation.',
      rubric: ['Waste: per-cell visited tracking when the frontier is always a clean rectangle', 'Proposes four shrinking boundary pointers'],
      acceptedPatterns: ['math'],
      teachingNote:
        'The key realization to elicit: "unvisited" is never a scattered set here, it\'s always a contiguous shrinking rectangle — that invariant is what license the O(1)-extra-space boundary approach.',
    },
    algorithm: {
      modelAnswer:
        'Maintain top=0, bottom=m-1, left=0, right=n-1. While top<=bottom and left<=right: walk left→right along row top, then top++; walk top→bottom along column right, then right--; if top<=bottom, walk right→left along row bottom, then bottom--; if left<=right, walk bottom→top along column left, then left++. The two guarded final legs prevent re-visiting a row/column already consumed by an earlier leg when the remaining region is a single row or column. O(m·n) time, O(1) extra space (excluding output).',
      rubric: [
        'Four boundary pointers with correct shrink order (top, right, bottom, left)',
        'Guards the third and fourth legs against single-row/column collapse',
        'States O(m*n)/O(1) extra',
      ],
      teachingNote:
        'The guards on legs 3 and 4 are the single most common bug source — walk through a 1×n or m×1 matrix by hand to show why an unguarded bottom-row or left-column pass would double-count.',
    },
    interviewScript: {
      modelAnswer:
        'The unvisited region is always a clean shrinking rectangle, so instead of a visited grid I track four boundary pointers — top, bottom, left, right — and walk each edge of the current rectangle in turn, shrinking the corresponding boundary after each edge. The tricky part is guarding the bottom-row and left-column passes so a collapsed single row or column doesn\'t get walked twice. O(m·n) time, O(1) extra space.',
      rubric: ['Template followed: names the rectangle invariant, presents the four-pointer walk, flags the collapse guard', 'Complexity stated'],
      teachingNote:
        'Proactively naming the collapse-guard edge case before being asked about it is a strong signal — it shows the candidate has already stress-tested their own mental model.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Four boundaries describe the current unvisited rectangle',
      code: 'let top = 0, bottom = matrix.length - 1\nlet left = 0, right = matrix[0].length - 1\nconst result: number[] = []',
    },
    {
      label: '2. Walk the top row and right column, shrinking after each',
      code: 'while (top <= bottom && left <= right) {\n  for (let j = left; j <= right; j++) result.push(matrix[top][j])\n  top++\n  for (let i = top; i <= bottom; i++) result.push(matrix[i][right])\n  right--',
    },
    {
      label: '3. Bottom row and left column — guarded, since a collapsed rectangle may already be fully consumed',
      code: '  if (top <= bottom) {\n    for (let j = right; j >= left; j--) result.push(matrix[bottom][j])\n    bottom--\n  }\n  if (left <= right) {\n    for (let i = bottom; i >= top; i--) result.push(matrix[i][left])\n    left++\n  }\n}',
    },
    {
      label: '4. Return the accumulated spiral order',
      code: 'return result',
    },
  ],
  code: {
    signature: 'export function spiralOrder(matrix: number[][]): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5], label: 'example 3x3' },
      { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7], label: 'example 3x4' },
      { args: [[[1]]], expected: [1], label: 'single cell' },
      { args: [[[1], [2], [3]]], expected: [1, 2, 3], label: 'single column', hidden: true },
      { args: [[[1, 2, 3]]], expected: [1, 2, 3], label: 'single row', hidden: true },
      { args: [[[1, 2], [3, 4]]], expected: [1, 2, 4, 3], label: '2x2 square', hidden: true },
    ],
    referenceSolution:
      'export function spiralOrder(matrix: number[][]): number[] {\n  let top = 0, bottom = matrix.length - 1\n  let left = 0, right = matrix[0].length - 1\n  const result: number[] = []\n  while (top <= bottom && left <= right) {\n    for (let j = left; j <= right; j++) result.push(matrix[top][j])\n    top++\n    for (let i = top; i <= bottom; i++) result.push(matrix[i][right])\n    right--\n    if (top <= bottom) {\n      for (let j = right; j >= left; j--) result.push(matrix[bottom][j])\n      bottom--\n    }\n    if (left <= right) {\n      for (let i = bottom; i >= top; i--) result.push(matrix[i][left])\n      left++\n    }\n  }\n  return result\n}\n',
    complexity: { time: 'O(m * n)', space: 'O(1) extra' },
  },
}
