import type { Problem } from '../../types'

export const surroundedRegions: Problem = {
  id: 'surrounded-regions',
  leetcodeId: 130,
  title: 'Surrounded Regions',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'graphs',
  authored: true,
  statement:
    'Given an `m x n` matrix `board` containing `"X"` and `"O"`, flip every `"O"` that is **surrounded** by `"X"` into `"X"`. A region of `"O"`s is *not* surrounded if it is connected (4-directionally, through other `"O"`s) to any cell on the border of the board. Modify `board` in place and return it.',
  examples: [
    {
      input: 'board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]',
      explanation: 'The 3-cell "O" region is interior and gets flipped; the border-connected "O" at row 3 survives.',
    },
    { input: 'board = [["X"]]', output: '[["X"]]' },
  ],
  constraints: ['1 <= m, n <= 200', 'board[i][j] is "X" or "O"'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an m×n grid of "X"/"O" (up to 200×200), mutated in place. Output: the same grid with interior "O"s flipped to "X" — but "O"s reachable from the border, however far inside they wind, must be left alone.',
      rubric: ['Notes in-place mutation on up to 200×200', 'Distinguishes border-connected "O"s (kept) from fully enclosed ones (flipped)'],
    },
    whatToFind: {
      modelAnswer:
        'This is a connectivity classification task, not a per-cell local check: whether an "O" survives depends on whether it has *any* path of "O"s reaching the border, which can only be answered by exploring connected regions, not by looking at each cell\'s immediate neighbors.',
      rubric: ['Frames it as connectivity/reachability to the border, not a local rule', 'Rejects a per-cell neighbor-only check as insufficient'],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 200×200 = 4×10⁴ cells means the whole board must be processed in roughly linear time — O(m·n) — ruling out anything that re-explores regions repeatedly. The real difficulty is figuring out which "O"s are safe before flipping anything, since flipping the wrong ones first would corrupt later connectivity checks.',
      rubric: ['Derives an O(m·n) budget from the grid size', 'Notes ordering matters: must identify all safe cells before flipping any'],
    },
    bruteForce: {
      modelAnswer:
        'For every "O", run a fresh DFS/BFS to check whether it can reach the border, and flip it if not. Correct, but a shared region gets re-explored once per cell inside it — O((m·n)²) in the worst case (e.g., one giant connected "O" region).',
      rubric: ['Per-cell independent reachability search described', 'States the redundant re-exploration cost for shared regions'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Re-running a full search from every "O" in the same connected region repeats identical work — once a region is known to touch the border (or not), every cell in it shares that answer. Flip the direction of the search: start from the border cells themselves, flood-fill inward through "O"s exactly once, and mark everything reached as safe. Pattern: DFS/Flood Fill.',
      rubric: ['Names the waste: shared regions re-explored per contained cell', 'Proposes flood-filling once from the border instead of once per interior cell'],
      acceptedPatterns: ['dfs'],
    },
    algorithm: {
      modelAnswer:
        'For every "O" on the border (row 0, row m−1, col 0, col n−1), DFS/BFS through 4-directionally connected "O"s, temporarily marking each visited one as "#" (safe, do-not-flip). After all border-seeded searches finish, do one full pass over the board: any remaining "O" (never marked "#") had no path to the border, so flip it to "X"; any "#" is restored back to "O". Time O(m·n) — every cell is visited a constant number of times — space O(m·n) worst-case recursion/queue.',
      rubric: [
        'Seeds flood-fill only from border "O"s, marking reachable ones as safe (e.g. "#")',
        'Final pass flips untouched "O"s to "X" and restores "#" back to "O"',
        'States O(m·n) time / O(m·n) space',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Checking every "O" independently for border-reachability re-explores the same connected region once per cell in it — up to O((m·n)²) on a large region. Flipping the search direction fixes it: start from the border "O"s and flood-fill inward, marking every reachable "O" as safe with a temporary marker. Anything never marked after that is truly enclosed. One final pass flips the unmarked "O"s to "X" and restores the safe markers back to "O". Every cell is visited a constant number of times, so it\'s O(m·n) time and O(m·n) space for the search.',
      rubric: ['States the redundant-reexploration waste and the border-seeded flood-fill fix', 'Describes the two-pass structure (mark safe, then flip) and final complexity'],
    },
  },
  code: {
    signature: 'export function solve(board: string[][]): string[][] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [
          [
            ['X', 'X', 'X', 'X'],
            ['X', 'O', 'O', 'X'],
            ['X', 'X', 'O', 'X'],
            ['X', 'O', 'X', 'X'],
          ],
        ],
        expected: [
          ['X', 'X', 'X', 'X'],
          ['X', 'X', 'X', 'X'],
          ['X', 'X', 'X', 'X'],
          ['X', 'O', 'X', 'X'],
        ],
        label: 'example',
      },
      { args: [[['X']]], expected: [['X']], label: 'single cell X' },
      { args: [[['O']]], expected: [['O']], label: 'single cell O is on the border' },
      {
        args: [[['O', 'O'], ['O', 'O']]],
        expected: [['O', 'O'], ['O', 'O']],
        label: 'all border, nothing enclosed',
        hidden: true,
      },
      {
        args: [
          [
            ['X', 'X', 'X'],
            ['X', 'O', 'X'],
            ['X', 'X', 'X'],
          ],
        ],
        expected: [
          ['X', 'X', 'X'],
          ['X', 'X', 'X'],
          ['X', 'X', 'X'],
        ],
        label: 'fully enclosed single O',
        hidden: true,
      },
      {
        args: [
          [
            ['O', 'X', 'X', 'O'],
            ['X', 'O', 'O', 'X'],
            ['X', 'O', 'O', 'X'],
            ['O', 'X', 'X', 'O'],
          ],
        ],
        expected: [
          ['O', 'X', 'X', 'O'],
          ['X', 'X', 'X', 'X'],
          ['X', 'X', 'X', 'X'],
          ['O', 'X', 'X', 'O'],
        ],
        label: 'corner border Os survive, interior block flips',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function solve(board: string[][]): string[][] {\n  const m = board.length\n  if (m === 0) return board\n  const n = board[0].length\n  const stack: [number, number][] = []\n  for (let i = 0; i < m; i++) {\n    for (let j = 0; j < n; j++) {\n      const isBorder = i === 0 || i === m - 1 || j === 0 || j === n - 1\n      if (isBorder && board[i][j] === \'O\') stack.push([i, j])\n    }\n  }\n  const dirs = [\n    [1, 0],\n    [-1, 0],\n    [0, 1],\n    [0, -1],\n  ]\n  while (stack.length > 0) {\n    const [r, c] = stack.pop()!\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== \'O\') continue\n    board[r][c] = \'#\'\n    for (const [dr, dc] of dirs) stack.push([r + dr, c + dc])\n  }\n  for (let i = 0; i < m; i++) {\n    for (let j = 0; j < n; j++) {\n      if (board[i][j] === \'O\') board[i][j] = \'X\'\n      else if (board[i][j] === \'#\') board[i][j] = \'O\'\n    }\n  }\n  return board\n}\n',
    complexity: { time: 'O(m · n)', space: 'O(m · n)' },
  },
}
