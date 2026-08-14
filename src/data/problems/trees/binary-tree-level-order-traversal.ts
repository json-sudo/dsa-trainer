import type { Problem } from '../../types'

export const binaryTreeLevelOrderTraversal: Problem = {
  id: 'binary-tree-level-order-traversal',
  leetcodeId: 102,
  title: 'Binary Tree Level Order Traversal',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'trees',
  authored: true,
  statement:
    'Given the `root` of a binary tree, return the values level by level: an array of arrays, one inner array per depth, left to right. (The harness builds the tree from a level-order array with `null`s.)',
  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
    { input: 'root = [1]', output: '[[1]]' },
    { input: 'root = []', output: '[]' },
  ],
  constraints: ['0 <= number of nodes <= 2000', '-1000 <= node.val <= 1000'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a binary tree root (possibly null). Output: array of per-level arrays, top to bottom, left to right — the grouping *by depth* is the whole problem.',
      rubric: ['Null root → empty array', 'Output grouped by depth, ordered within levels'],
      teachingNote:
        'The output shape is the algorithm hint: "grouped by level" is precisely what breadth-first order produces. Reading the output type carefully often answers step 6 early.',
    },
    whatToFind: {
      modelAnswer: 'A traversal/construct task: visit every node once, grouped by distance from the root.',
      rubric: ['Identifies full traversal grouped by depth', 'No search/optimization involved'],
      teachingNote:
        '"Distance from root" = level. Whenever grouping or ordering is by distance, the queue-based traversal is the natural fit; depth-first can do it too but must carry the depth along.',
    },
    constraintsHint: {
      modelAnswer: 'Up to 2000 nodes — any O(n) traversal is fine. The constraint block is calm; the test is whether you produce clean level grouping, not performance.',
      rubric: ['O(n) traversal obviously sufficient', 'Recognizes the technique-over-speed setup'],
      teachingNote:
        'When constraints are loose, tell the interviewer explicitly: "n is small, so this is about the traversal structure, not optimization." It shows calibration.',
    },
    bruteForce: {
      modelAnswer:
        'Compute the tree height, then for each level d run a full DFS collecting nodes at depth d: O(n·h) time — up to O(n²) on a degenerate tree — O(h) space.',
      rubric: ['Per-level re-traversal described', 'States O(n·h) / O(n²) degenerate', 'States space'],
      teachingNote:
        'This brute force re-walks the whole tree once per level. It\'s worth knowing because its waste (revisiting) is so visible — the queue removes exactly that.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Each per-level DFS revisits every ancestor path already walked. A queue visits each node exactly once *in level order for free*: children enqueue behind the current level. Snapshot the queue size to know where one level ends. Pattern: BFS.',
      rubric: ['Waste: repeated ancestor walks per level', 'Queue yields level order inherently'],
      acceptedPatterns: ['bfs'],
      teachingNote:
        'Your rule of thumb: DFS answers "what does each subtree give me?", BFS answers "what happens level by level / nearest first?". This one is the purest BFS specimen — internalize the level-size snapshot trick.',
    },
    algorithm: {
      modelAnswer:
        'If root null → []. queue = [root]. While queue non-empty: size = queue.length; pop exactly size nodes, pushing their values into one level array and enqueuing their children; append the level. Time O(n), space O(w) for the widest level.',
      rubric: [
        'Level-size snapshot loop stated',
        'Children enqueued during the level drain',
        'States O(n) time, O(width) space',
      ],
      teachingNote:
        'The `size = queue.length` snapshot before draining is the entire trick — everything popped within that inner loop belongs to one level, everything pushed belongs to the next.',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be one full traversal per level — O(n·h), quadratic on skewed trees. Level grouping is what breadth-first order gives natively: a queue processes each node once, and snapshotting the queue length marks level boundaries. I\'ll BFS with the size-snapshot loop. Time O(n), space O(w) for the widest level.',
      rubric: ['Template followed with the BFS-gives-levels-free insight', 'Complexity stated'],
      teachingNote:
        'Note the space claim is O(width), not O(n) hand-waving — precision about *which* dimension drives memory is a senior tell.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Guard the empty tree, seed the queue',
      code: 'if (!root) return []\nconst out: number[][] = []\nconst queue: TreeNode[] = [root]',
    },
    {
      label: '2. Snapshot the queue size — that count IS one level',
      code: 'while (queue.length > 0) {\n  const size = queue.length   // freeze before draining\n  const level: number[] = []\n  // everything popped in this inner loop belongs to the current level',
    },
    {
      label: '3. Drain the level, enqueue its children (the next level)',
      code: 'for (let i = 0; i < size; i++) {\n  const node = queue.shift()!\n  level.push(node.val)\n  if (node.left) queue.push(node.left)     // lands BEHIND the snapshot\n  if (node.right) queue.push(node.right)\n}\nout.push(level)',
    },
  ],
  code: {
    signature:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function levelOrder(root: TreeNode | null): number[][] {\n  // your code here\n}\n',
    harness: 'tree',
    tests: [
      { args: [{ $tree: [3, 9, 20, null, null, 15, 7] }], expected: [[3], [9, 20], [15, 7]], label: 'example' },
      { args: [{ $tree: [1] }], expected: [[1]], label: 'single node' },
      { args: [{ $tree: [] }], expected: [], label: 'empty tree' },
      { args: [{ $tree: [1, 2, null, 3, null, 4] }], expected: [[1], [2], [3], [4]], label: 'left-skewed chain', hidden: true },
      { args: [{ $tree: [1, 2, 3, 4, 5, 6, 7] }], expected: [[1], [2, 3], [4, 5, 6, 7]], label: 'perfect tree', hidden: true },
      { args: [{ $tree: [1, null, 2, null, 3] }], expected: [[1], [2], [3]], label: 'right-skewed chain', hidden: true },
    ],
    referenceSolution:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function levelOrder(root: TreeNode | null): number[][] {\n  if (!root) return []\n  const out: number[][] = []\n  const queue: TreeNode[] = [root]\n  while (queue.length > 0) {\n    const size = queue.length\n    const level: number[] = []\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift()!\n      level.push(node.val)\n      if (node.left) queue.push(node.left)\n      if (node.right) queue.push(node.right)\n    }\n    out.push(level)\n  }\n  return out\n}\n',
    complexity: { time: 'O(n)', space: 'O(w) — widest level' },
  },
}
