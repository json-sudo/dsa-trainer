import type { Problem } from '../../types'

export const lowestCommonAncestorOfABst: Problem = {
  id: 'lowest-common-ancestor-of-a-bst',
  leetcodeId: 235,
  title: 'Lowest Common Ancestor of a BST',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'trees',
  authored: true,
  statement:
    'Given a **binary search tree** and the values `p` and `q` of two nodes in it, return the **value** of their lowest common ancestor — the deepest node that has both among its descendants (a node counts as its own descendant).',
  examples: [
    { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', output: '6' },
    { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4', output: '2', explanation: 'A node can be its own ancestor.' },
  ],
  constraints: ['2 <= number of nodes <= 10^5', 'all values unique', 'p and q exist in the tree', 'BST property holds'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a BST root and two existing values p, q. Output: the LCA node\'s value. "BST" in the title is the structural gift — ordered subtrees.',
      rubric: ['Registers the BST property as central', 'Self-ancestor case noted'],
    },
    whatToFind: {
      modelAnswer: 'Locate the split point: the deepest node where p and q are no longer on the same side — that node is the LCA.',
      rubric: ['LCA = first divergence point', 'Framed as a search down one path'],
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10⁵: general-tree LCA is O(n), but the BST property should cut this to O(h) — one root-to-answer walk. Uniqueness + guaranteed existence remove edge handling.',
      rubric: ['Aims at O(h) using BST ordering', 'Guarantees simplify the contract'],
    },
    bruteForce: {
      modelAnswer:
        'Ignore the BST: compute root-to-p and root-to-q paths with DFS, then compare paths for the last shared node. O(n) time, O(h) space — works on any tree, wastes the ordering.',
      rubric: ['Two-paths-compare approach', 'States O(n)', 'Notes it ignores BST ordering'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The full traversal explores subtrees the ordering already excludes: comparing p and q with the current value tells me which single child to descend into. Both smaller → go left; both larger → go right; otherwise I\'m at the split. Pattern: DFS (BST-guided descent).',
      rubric: ['Waste: exploring subtrees ordering rules out', 'Both-smaller/both-larger/split trichotomy'],
      acceptedPatterns: ['dfs'],
    },
    algorithm: {
      modelAnswer:
        'node = root. Loop: if p < node.val and q < node.val → node = node.left; else if p > node.val and q > node.val → node = node.right; else return node.val (split point or equal to one of them). Time O(h), space O(1) iterative.',
      rubric: ['Iterative descent with the trichotomy', 'Returns at the split/equality point', 'States O(h)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'On a general tree I\'d collect both root paths and compare — O(n). But this is a BST: comparing p and q against the current node tells me exactly which side both live on, so I can walk a single path and stop at the first divergence, which is the LCA by definition. Time O(h), space O(1).',
      rubric: ['Template followed with the single-path descent insight', 'Complexity stated as O(h)'],
    },
  },
  code: {
    signature:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): number {\n  // your code here\n}\n',
    harness: 'tree',
    tests: [
      { args: [{ $tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5] }, 2, 8], expected: 6, label: 'example' },
      { args: [{ $tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5] }, 2, 4], expected: 2, label: 'ancestor is p itself' },
      { args: [{ $tree: [2, 1] }, 2, 1], expected: 2, label: 'two nodes' },
      { args: [{ $tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5] }, 3, 5], expected: 4, label: 'deep pair', hidden: true },
      { args: [{ $tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5] }, 0, 5], expected: 2, label: 'pair spanning subtree', hidden: true },
      { args: [{ $tree: [5, 3, 6, 2, 4, null, null, 1] }, 1, 4], expected: 3, label: 'skewed side', hidden: true },
    ],
    referenceSolution:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): number {\n  let node = root\n  while (node) {\n    if (p < node.val && q < node.val) node = node.left\n    else if (p > node.val && q > node.val) node = node.right\n    else return node.val\n  }\n  return -1\n}\n',
    complexity: { time: 'O(h)', space: 'O(1)' },
  },
}
