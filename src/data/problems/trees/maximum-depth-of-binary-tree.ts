import type { Problem } from '../../types'

export const maximumDepthOfBinaryTree: Problem = {
  id: 'maximum-depth-of-binary-tree',
  leetcodeId: 104,
  title: 'Maximum Depth of Binary Tree',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'trees',
  authored: true,
  statement:
    'Given the `root` of a binary tree, return its maximum depth — the number of nodes on the longest path from the root down to a leaf.',
  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
    { input: 'root = [1,null,2]', output: '2' },
  ],
  constraints: ['0 <= number of nodes <= 10^4', '-100 <= node.val <= 100'],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: a tree root, possibly null. Output: one integer — node count along the longest root-to-leaf path; empty tree is 0.',
      rubric: ['Empty tree → 0 stated', 'Depth counted in nodes, not edges'],
    },
    whatToFind: {
      modelAnswer: 'A max over root-to-leaf path lengths — an aggregate computed from subtree aggregates: depth(node) = 1 + max(depth(left), depth(right)).',
      rubric: ['Writes the subtree recurrence', 'Identifies max-aggregation'],
    },
    constraintsHint: {
      modelAnswer: '10⁴ nodes — O(n) visit-each-once is expected. Recursion depth equals tree height, fine here; mention the stack-overflow caveat for hostile depths.',
      rubric: ['O(n) budget', 'Recursion-depth caveat mentioned'],
    },
    bruteForce: {
      modelAnswer:
        'Enumerate every root-to-leaf path explicitly (collecting paths), then take the longest: O(n·h) time and space from materializing paths.',
      rubric: ['Path enumeration named', 'States the O(n·h) blowup'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Materialized paths recompute shared prefixes — every path re-lists its ancestors. Each subtree\'s depth is a single number computable once from its children\'s numbers. Pattern: DFS (post-order aggregation).',
      rubric: ['Waste: shared prefixes re-listed per path', 'One-number-per-subtree insight'],
      acceptedPatterns: ['dfs'],
    },
    algorithm: {
      modelAnswer: 'depth(node): if null return 0; return 1 + max(depth(left), depth(right)). One post-order pass. Time O(n), space O(h) recursion.',
      rubric: ['Three-line recursion with null base case', 'States O(n)/O(h)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be listing every root-to-leaf path and measuring — that re-walks shared ancestors. Depth is compositional: a node\'s depth is one plus the max of its children\'s depths, so a single post-order DFS computes it bottom-up. Time O(n), space O(h) for the recursion stack.',
      rubric: ['Template followed with the compositional insight', 'Complexity stated'],
    },
  },
  code: {
    signature:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function maxDepth(root: TreeNode | null): number {\n  // your code here\n}\n',
    harness: 'tree',
    tests: [
      { args: [{ $tree: [3, 9, 20, null, null, 15, 7] }], expected: 3, label: 'example' },
      { args: [{ $tree: [1, null, 2] }], expected: 2, label: 'right child only' },
      { args: [{ $tree: [] }], expected: 0, label: 'empty tree' },
      { args: [{ $tree: [0] }], expected: 1, label: 'single node', hidden: true },
      { args: [{ $tree: [1, 2, null, 3, null, 4] }], expected: 4, label: 'left-skewed chain', hidden: true },
      { args: [{ $tree: [1, 2, 3, 4, null, null, null, 5] }], expected: 4, label: 'deep left branch', hidden: true },
    ],
    referenceSolution:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function maxDepth(root: TreeNode | null): number {\n  if (!root) return 0\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))\n}\n',
    complexity: { time: 'O(n)', space: 'O(h) recursion' },
  },
}
