import type { Problem } from '../../types'

export const kthSmallestElementInABst: Problem = {
  id: 'kth-smallest-element-in-a-bst',
  leetcodeId: 230,
  title: 'Kth Smallest Element in a BST',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'trees',
  authored: true,
  statement:
    'Given the root of a **binary search tree** and an integer `k`, return the `k`-th smallest value among all node values in the tree (1-indexed).',
  examples: [
    { input: 'root = [3,1,4,null,2], k = 1', output: '1' },
    { input: 'root = [5,3,6,2,4,null,null,1], k = 3', output: '3' },
  ],
  constraints: ['1 <= number of nodes <= 10^4', '0 <= node.val <= 10^4', '1 <= k <= number of nodes'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a BST root and an integer k. Output: the k-th smallest value across the whole tree. "BST" is the structural gift — an ordering property I should exploit rather than treating this as a generic tree.',
      rubric: ['Registers the BST property as central to the approach', 'Output is a rank query (k-th smallest), 1-indexed'],
    },
    whatToFind: {
      modelAnswer:
        'A way to visit BST nodes in ascending sorted order and stop at the k-th one — I don\'t need to see the whole tree if I can visit values in order and count as I go.',
      rubric: ['Connects "k-th smallest" to visiting nodes in sorted order', 'Notes the traversal can potentially stop early once k is reached'],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 10⁴ nodes: an O(n) full traversal easily fits, but the BST property lets me do better — an in-order traversal visits values in ascending order for free, and I can stop as soon as I\'ve counted k of them, giving O(h + k) instead of always touching every node.',
      rubric: ['Notes O(n) is affordable but O(h+k) is achievable and better', 'Connects in-order traversal to ascending order specifically because it\'s a BST'],
    },
    bruteForce: {
      modelAnswer:
        'Do a full traversal (any order), collect all values into an array, sort the array, and return index k-1. O(n log n) time, O(n) space — correct, but ignores that a BST\'s in-order traversal is already sorted, so sorting is redundant work.',
      rubric: ['Names collect-then-sort as the baseline', 'States O(n log n) and identifies the sort as redundant given BST structure'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Sorting re-derives an order the tree already encodes: an in-order traversal (left, node, right) of a BST visits values in ascending order automatically, no sort needed. Further, if I traverse iteratively with an explicit stack, I can stop the instant I\'ve visited the k-th node instead of walking the entire tree. Pattern: DFS (in-order, early-stop).',
      rubric: ['Names the waste: sorting values that in-order traversal already yields sorted', 'Proposes in-order DFS with early stopping at the k-th visit'],
      acceptedPatterns: ['dfs'],
    },
    algorithm: {
      modelAnswer:
        'Iterative in-order traversal with an explicit stack: push all left children from root down to null; then repeatedly pop a node, count it (count++, if count === k return node.val), and push all left children of its right subtree. This visits nodes in ascending order and stops as soon as the k-th is found, so at most O(h + k) nodes are ever touched — better than a full O(n) traversal when k is small. Time O(h + k), space O(h).',
      rubric: ['Uses an explicit stack pushing left children to simulate in-order DFS', 'Counts visits and returns as soon as count reaches k (early stop)', 'States O(h + k) time / O(h) space and why it beats a full traversal'],
    },
    interviewScript: {
      modelAnswer:
        'Collecting all values and sorting is O(n log n), but a BST\'s in-order traversal already produces ascending order for free — sorting is redundant. I\'ll do an iterative in-order traversal with an explicit stack rather than recursion, so I can stop the moment I\'ve counted the k-th node instead of walking the whole tree; that gives O(h + k) time instead of always paying O(n), which matters a lot when k is small relative to the tree size. Space is O(h) for the stack.',
      rubric: ['Follows the script template end-to-end', 'States the iterative-with-early-stop advantage and final O(h+k)/O(h) complexity'],
    },
  },
  code: {
    signature:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function kthSmallest(root: TreeNode | null, k: number): number {\n  // your code here\n}\n',
    harness: 'tree',
    tests: [
      { args: [{ $tree: [3, 1, 4, null, 2] }, 1], expected: 1, label: 'example smallest' },
      { args: [{ $tree: [5, 3, 6, 2, 4, null, null, 1] }, 3], expected: 3, label: 'example k=3' },
      { args: [{ $tree: [1] }, 1], expected: 1, label: 'single node' },
      { args: [{ $tree: [5, 3, 6, 2, 4, null, null, 1] }, 6], expected: 6, label: 'largest value (k = size)', hidden: true },
      { args: [{ $tree: [3, 1, 4, null, 2] }, 4], expected: 4, label: 'k equals node count', hidden: true },
      { args: [{ $tree: [7, 3, 9, 1, 5, 8, 10] }, 5], expected: 8, label: 'k targets root in balanced tree', hidden: true },
    ],
    referenceSolution:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function kthSmallest(root: TreeNode | null, k: number): number {\n  const stack: TreeNode[] = []\n  let node = root\n  let count = 0\n  while (stack.length > 0 || node) {\n    while (node) {\n      stack.push(node)\n      node = node.left\n    }\n    node = stack.pop()!\n    count++\n    if (count === k) return node.val\n    node = node.right\n  }\n  return -1\n}\n',
    complexity: { time: 'O(h + k)', space: 'O(h)' },
  },
}
