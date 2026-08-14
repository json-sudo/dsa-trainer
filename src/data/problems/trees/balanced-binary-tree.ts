import type { Problem } from '../../types'

export const balancedBinaryTree: Problem = {
  id: 'balanced-binary-tree',
  leetcodeId: 110,
  title: 'Balanced Binary Tree',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'trees',
  authored: true,
  statement:
    'Given a binary tree, determine if it is height-balanced — for every node, the height difference between its left and right subtrees is at most 1.',
  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: 'true' },
    { input: 'root = [1,2,2,3,3,null,null,4,4]', output: 'false', explanation: 'Node 2 (left child of root) has subtrees of height 2 and 0.' },
  ],
  constraints: ['0 <= number of nodes <= 5000', '-10^4 <= node.val <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a binary tree root (possibly null). Output: a single boolean over the *entire* tree — but it depends on a per-node local property (height difference ≤ 1) holding everywhere, not just at the root.',
      rubric: ['Notes the global answer depends on a property checked at every node', 'Handles the null/empty tree case'],
    },
    whatToFind: {
      modelAnswer: 'Whether every node in the tree satisfies |height(left) − height(right)| ≤ 1, simultaneously with computing heights themselves.',
      rubric: ['Names the per-node height-difference condition', 'Notes heights and the balance check are naturally computed together'],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 5000 nodes: an O(n) or O(n log n) solution both pass easily, but a naive per-node height recomputation is O(n²) worst case on a skewed tree (5000² = 2.5×10⁷ — still passes here, but is the "obviously wasteful" baseline to improve on).',
      rubric: ['Notes O(n) is the ideal target', 'Identifies O(n²) as the naive baseline and roughly bounds it'],
    },
    bruteForce: {
      modelAnswer:
        'For every node, independently compute the height of its left and right subtrees (a separate DFS each time) and check the difference is ≤ 1, recursing to do the same at every other node. O(n²) worst case — each height computation walks a subtree, and this repeats at every node.',
      rubric: ['Names the recompute-height-at-every-node approach', 'States the O(n²) worst case and why'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Recomputing a subtree\'s height separately at every ancestor re-walks the same nodes over and over. A single post-order DFS can return *both* a subtree\'s height and whether it (and everything below it) is already balanced, in one bottom-up pass. Pattern: DFS (post-order height + balance fused).',
      rubric: ['Names the waste: repeated height recomputation across ancestors', 'Proposes fusing height computation and the balance check into one post-order pass'],
      acceptedPatterns: ['dfs'],
    },
    algorithm: {
      modelAnswer:
        'Post-order helper returns a height, or a sentinel (e.g. -1) meaning "already found unbalanced below". At each node: recurse left and right; if either returned the sentinel, or |leftHeight − rightHeight| > 1, propagate the sentinel up immediately; otherwise return 1 + max(leftHeight, rightHeight). Root call: sentinel means false, anything else means true. Time O(n), space O(h) recursion.',
      rubric: ['Single post-order pass returning height or an unbalanced sentinel', 'Short-circuits/propagates the sentinel once found', 'States O(n) time, O(h) space'],
    },
    interviewScript: {
      modelAnswer:
        'The naive approach recomputes each subtree\'s height independently at every node it\'s nested under — O(n²) on a skewed tree. Instead I\'ll fuse the height computation with the balance check in one post-order DFS: each call returns the subtree\'s height, or a sentinel meaning "unbalanced somewhere below", so an imbalance found deep in the tree short-circuits back to the root in one pass. Time O(n), space O(h) for the recursion stack.',
      rubric: ['Follows the script template end-to-end', 'States the fused-post-order insight and final complexity'],
    },
  },
  code: {
    signature:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function isBalanced(root: TreeNode | null): boolean {\n  // your code here\n}\n',
    harness: 'tree',
    tests: [
      { args: [{ $tree: [3, 9, 20, null, null, 15, 7] }], expected: true, label: 'example: balanced' },
      { args: [{ $tree: [1, 2, 2, 3, 3, null, null, 4, 4] }], expected: false, label: 'example: unbalanced' },
      { args: [{ $tree: [] }], expected: true, label: 'empty tree' },
      { args: [{ $tree: [1] }], expected: true, label: 'single node', hidden: true },
      { args: [{ $tree: [1, 2, null, 3, null, 4] }], expected: false, label: 'deep left skew', hidden: true },
      { args: [{ $tree: [1, 2, 3, 4, 5, 6, 7] }], expected: true, label: 'full balanced tree', hidden: true },
    ],
    referenceSolution:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function isBalanced(root: TreeNode | null): boolean {\n  function height(node: TreeNode | null): number {\n    if (node === null) return 0\n    const left = height(node.left)\n    if (left === -1) return -1\n    const right = height(node.right)\n    if (right === -1) return -1\n    if (Math.abs(left - right) > 1) return -1\n    return 1 + Math.max(left, right)\n  }\n  return height(root) !== -1\n}\n',
    complexity: { time: 'O(n)', space: 'O(h)' },
  },
}
