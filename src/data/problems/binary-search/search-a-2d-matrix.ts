import type { Problem } from '../../types'

export const searchA2dMatrix: Problem = {
  id: 'search-a-2d-matrix',
  leetcodeId: 74,
  title: 'Search a 2D Matrix',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'binary-search',
  authored: true,
  statement:
    'Given an `m x n` matrix where each row is sorted in ascending order and the first integer of each row is greater than the last integer of the previous row, and an integer `target`, return `true` if `target` is in the matrix, else `false`. Your algorithm must run in **O(log(m*n))** time.',
  examples: [
    { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', output: 'true' },
    { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', output: 'false' },
  ],
  constraints: ['1 <= m, n <= 100', '-10^4 <= matrix[i][j], target <= 10^4', 'each row sorted ascending', 'row starts exceed the previous row\'s end'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an m×n matrix with a global sorted-ish property (rows sorted, and each row start exceeds the previous row\'s end) and a target. Output: whether target exists anywhere in the matrix.',
      rubric: ['States the matrix property: rows sorted AND row starts exceed previous row ends', 'Output is a boolean existence check'],
    },
    whatToFind: {
      modelAnswer:
        'Whether the special structure — every row continues where the last left off — makes the whole matrix behave like one long sorted array, so I can search it as such.',
      rubric: ['Recognizes the matrix is effectively one flattened sorted sequence', 'Frames this as an existence/search problem, not enumeration'],
    },
    constraintsHint: {
      modelAnswer:
        'm, n ≤ 100 means m*n ≤ 10⁴, and the problem explicitly demands O(log(m*n)) — that\'s a strong signal for binary search over the full matrix treated as 1D, not a per-row O(log n) search that\'s still O(m log n) overall.',
      rubric: ['Notes the explicit O(log(m*n)) requirement rules out row-by-row search', 'Connects m*n ≤ 10⁴ to a single binary search over the flattened matrix'],
    },
    bruteForce: {
      modelAnswer:
        'Scan every cell with nested loops, or binary search each row individually. Full scan is O(m*n); per-row binary search is O(m log n). Both work but miss the stronger global structure.',
      rubric: ['Names either full scan or per-row binary search as the baseline', 'States its complexity and notes it underuses the global ordering'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Searching row by row treats each row as independent, but the "row starts exceed previous row ends" guarantee means the matrix, read left-to-right top-to-bottom, is literally one sorted array — I\'m wasting the fact that I could binary search across the *whole* thing at once instead of per-row. Pattern: Binary Search over an implicit 1D index.',
      rubric: ['Names the waste: treating rows independently when the whole matrix is globally sorted', 'Proposes mapping a flat index to (row, col) for one binary search'],
      acceptedPatterns: ['binary-search'],
    },
    algorithm: {
      modelAnswer:
        'Let rows = matrix.length, cols = matrix[0].length. Binary search lo=0, hi=rows*cols-1 over a virtual flat array: mid = (lo+hi)>>1, row = Math.floor(mid/cols), col = mid % cols, compare matrix[row][col] to target and narrow the range as usual. Time O(log(m*n)), space O(1).',
      rubric: ['Correctly derives row/col from a flat mid index using cols', 'Standard binary search narrowing logic (lo/hi update)', 'States O(log(m*n))/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'A per-row binary search would be O(m log n) and ignores that rows link up end-to-start into one continuous sorted sequence. So I treat the matrix as a flattened sorted array of size m*n and binary search it directly, converting the midpoint index to (row, col) with division and modulo by the column count. Time O(log(m*n)), space O(1).',
      rubric: ['Follows the script template end-to-end', 'States the flatten-then-binary-search insight and final complexity'],
    },
  },
  code: {
    signature:
      'export function searchMatrix(matrix: number[][], target: number): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [
          [
            [1, 3, 5, 7],
            [10, 11, 16, 20],
            [23, 30, 34, 60],
          ],
          3,
        ],
        expected: true,
        label: 'target present',
      },
      {
        args: [
          [
            [1, 3, 5, 7],
            [10, 11, 16, 20],
            [23, 30, 34, 60],
          ],
          13,
        ],
        expected: false,
        label: 'target absent',
      },
      { args: [[[1]], 1], expected: true, label: 'single cell match' },
      { args: [[[1]], 2], expected: false, label: 'single cell miss', hidden: true },
      {
        args: [
          [
            [1, 3],
            [5, 7],
            [9, 11],
          ],
          9,
        ],
        expected: true,
        label: 'target at row start',
        hidden: true,
      },
      {
        args: [
          [
            [1, 3, 5, 7],
            [10, 11, 16, 20],
            [23, 30, 34, 60],
          ],
          60,
        ],
        expected: true,
        label: 'target at last cell',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function searchMatrix(matrix: number[][], target: number): boolean {\n  const rows = matrix.length\n  const cols = matrix[0].length\n  let lo = 0\n  let hi = rows * cols - 1\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1\n    const row = Math.floor(mid / cols)\n    const col = mid % cols\n    const val = matrix[row][col]\n    if (val === target) return true\n    if (val < target) lo = mid + 1\n    else hi = mid - 1\n  }\n  return false\n}\n',
    complexity: { time: 'O(log(m*n))', space: 'O(1)' },
  },
}
