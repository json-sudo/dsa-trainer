import type { Problem } from '../../types'

export const validateBinarySearchTree: Problem = {
  id: 'validate-binary-search-tree',
  leetcodeId: 98,
  title: 'Validate Binary Search Tree',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'trees',
  authored: true,
  statement:
    'Given the `root` of a binary tree, return `true` if it is a valid binary search tree: every node\'s left subtree contains only values **strictly less**, its right subtree only values **strictly greater**, and both subtrees are themselves BSTs.',
  examples: [
    { input: 'root = [2,1,3]', output: 'true' },
    { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: '3 sits in the right subtree of 5 but is smaller.' },
  ],
  constraints: ['1 <= number of nodes <= 10^4', '-2^31 <= node.val <= 2^31 - 1'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: any binary tree. Output: boolean. The trap: the BST property is about *entire subtrees*, not just direct children — and duplicates are invalid (strict inequalities).',
      rubric: ['Whole-subtree (not parent-child) requirement flagged', 'Strictness / duplicate handling noted'],
    },
    whatToFind: {
      modelAnswer: 'Verify a global invariant: every node lies within the (min, max) window imposed by its ancestors.',
      rubric: ['Reframes as per-node ancestor window', 'Existence of one violation ⇒ false'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 10⁴ → O(n) single traversal. Values span the full 32-bit range, so initial bounds must be ±Infinity (or null), not ±2³¹ — a sentinel-value bug waiting to happen.',
      rubric: ['O(n) budget', 'Warns about integer sentinels vs Infinity/null bounds'],
    },
    bruteForce: {
      modelAnswer:
        'For every node, scan its whole left subtree for a max and right subtree for a min, checking the windows: O(n²) on skewed trees, O(h) space.',
      rubric: ['Per-node subtree scan', 'States O(n²) degenerate', 'States space'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Subtree scans recompute ranges the recursion could carry: descending left *tightens the max*, descending right *tightens the min*. Passing the window down validates each node in O(1). (Equivalently: an inorder walk must be strictly increasing.) Pattern: DFS (bounds propagation).',
      rubric: ['Waste: recomputing subtree extrema per node', 'Bounds-passing (or inorder-monotone) insight'],
      acceptedPatterns: ['dfs'],
    },
    algorithm: {
      modelAnswer:
        'valid(node, lo, hi): null → true; node.val must satisfy lo < val < hi else false; recurse left with (lo, val) and right with (val, hi). Start with (−∞, +∞). Time O(n), space O(h).',
      rubric: ['Window recursion with strict comparisons', 'Initial infinite bounds', 'States O(n)/O(h)'],
    },
    interviewScript: {
      modelAnswer:
        'The naive check scans each node\'s entire subtrees for min/max — O(n²) when skewed. The property is really an ancestor-imposed window: going left caps the maximum, going right raises the minimum, so one DFS carrying (lo, hi) validates every node in constant time each. I\'ll recurse with ±Infinity starting bounds and strict comparisons. Time O(n), space O(h).',
      rubric: ['Template followed with the window-propagation insight', 'Strictness and complexity stated'],
    },
  },
  code: {
    signature:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function isValidBST(root: TreeNode | null): boolean {\n  // your code here\n}\n',
    harness: 'tree',
    tests: [
      { args: [{ $tree: [2, 1, 3] }], expected: true, label: 'example valid' },
      { args: [{ $tree: [5, 1, 4, null, null, 3, 6] }], expected: false, label: 'example invalid' },
      { args: [{ $tree: [1] }], expected: true, label: 'single node' },
      { args: [{ $tree: [5, 4, 6, null, null, 3, 7] }], expected: false, label: 'deep violation across subtree', hidden: true },
      { args: [{ $tree: [2, 2, 2] }], expected: false, label: 'duplicates invalid', hidden: true },
      { args: [{ $tree: [3, 1, 5, 0, 2, 4, 6] }], expected: true, label: 'perfect valid BST', hidden: true },
    ],
    referenceSolution:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function isValidBST(root: TreeNode | null): boolean {\n  const valid = (node: TreeNode | null, lo: number, hi: number): boolean => {\n    if (!node) return true\n    if (node.val <= lo || node.val >= hi) return false\n    return valid(node.left, lo, node.val) && valid(node.right, node.val, hi)\n  }\n  return valid(root, -Infinity, Infinity)\n}\n',
    complexity: { time: 'O(n)', space: 'O(h) recursion' },
  },
}
