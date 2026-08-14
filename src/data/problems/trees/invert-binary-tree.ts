import type { Problem } from '../../types'

export const invertBinaryTree: Problem = {
  id: 'invert-binary-tree',
  leetcodeId: 226,
  title: 'Invert Binary Tree',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'trees',
  authored: true,
  statement: 'Given the root of a binary tree, invert it — swap the left and right child of every node — and return the new root.',
  examples: [
    { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Every node\'s two children swap places.' },
    { input: 'root = [2,1,3]', output: '[2,3,1]' },
    { input: 'root = []', output: '[]' },
  ],
  constraints: ['0 <= number of nodes <= 100', '-100 <= Node.val <= 100'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a binary tree root (possibly null). Output: the same tree with every node\'s left/right children swapped, mirrored top to bottom. Every node participates — none are skipped.',
      rubric: ['Every node swaps its two children', 'Empty tree is a valid, trivial input'],
      teachingNote:
        'State plainly that the mirror is *total* — not just the top level. Interviewers plant this because a shallow read ("swap root\'s children") stops one level too early.',
    },
    whatToFind: {
      modelAnswer: 'Apply the same local transformation — swap left and right — at every node in the tree, recursively.',
      rubric: ['Local operation (swap) applied uniformly', 'Recursive/whole-tree framing, not just root'],
      teachingNote:
        'This is the cleanest possible "same operation, every node" problem — a good place to anchor the general DFS-on-trees mental model before harder variants.',
    },
    constraintsHint: {
      modelAnswer: 'Up to 100 nodes: any traversal is instant. The constraint exists only to bound recursion depth, not to force an iterative solution.',
      rubric: ['Recognizes tiny n removes performance pressure', 'Notes recursion depth is bounded, not a concern'],
      teachingNote:
        'When n is this small, say so and move on — spending time optimizing a 100-node traversal signals poor calibration, not rigor.',
    },
    bruteForce: {
      modelAnswer:
        'There isn\'t a slower alternative worth naming — the direct recursive swap already visits each node once. The "naive" version and the optimal version coincide.',
      rubric: ['Acknowledges no meaningfully worse baseline exists', 'Still commits to a concrete traversal plan'],
      teachingNote:
        'Some problems don\'t have a real brute force to beat — say that explicitly rather than inventing a strawman. Confidently naming "there\'s nothing to improve on" is itself a skill.',
    },
    wasteAndPattern: {
      modelAnswer:
        'No redundant work to eliminate — each node is touched exactly once regardless of order. The only design choice is *how* to visit every node: recursive DFS (swap then recurse into both, now-swapped, children) is the natural fit for a tree-shaped problem. Pattern: DFS.',
      rubric: ['No waste to cut — visit-once is already optimal', 'DFS chosen for its natural fit on tree recursion'],
      acceptedPatterns: ['dfs'],
      teachingNote:
        'When there\'s no waste to eliminate, the "pattern" step becomes about picking the cleanest traversal shape rather than fixing a flaw. Still name the pattern out loud — DFS — so the interviewer hears the vocabulary.',
    },
    algorithm: {
      modelAnswer:
        'invert(node): if node is null, return null. Swap node.left and node.right. Recurse: invert(node.left); invert(node.right). Return node. Base case handles both the empty tree and leaf children. Time O(n), space O(h) recursion.',
      rubric: ['Null base case first', 'Swap before or consistent with recursing into swapped children', 'States O(n)/O(h)'],
      teachingNote:
        'A classic bug: recursing into left/right *before* swapping, then swapping the wrong pointers — or swapping twice. Write the swap as one destructuring line to avoid a temp-variable slip.',
    },
    interviewScript: {
      modelAnswer:
        'Every node needs the same treatment — swap its children — so this is a uniform recursive transform, not a search. Base case: null returns null. Otherwise swap left/right, then recurse into both children (now the swapped ones — order doesn\'t matter since both get inverted regardless), and return the node. One pass touches every node once: O(n) time, O(h) space for the call stack.',
      rubric: ['Frames it as uniform transform not search', 'States O(n)/O(h) with the base case named'],
      teachingNote:
        'Keep the script short — this is an easy problem and a bloated script under-calibrates. State the invariant (base case + swap + recurse), the complexity, and stop.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Base case: nothing to invert',
      code: 'function invertTree(root: TreeNode | null): TreeNode | null {\n  if (root === null) return root   // empty subtree mirrors to itself\n  // ...\n}',
    },
    {
      label: '2. Swap this node\'s two children',
      code: '[root.left, root.right] = [root.right, root.left]   // one-line swap, no temp var',
    },
    {
      label: '3. Recurse into both — they need the same treatment',
      code: 'invertTree(root.left)\ninvertTree(root.right)\n// order doesn\'t matter: both subtrees get fully inverted regardless',
    },
    {
      label: '4. Return the (now-inverted) root',
      code: 'return root',
    },
  ],
  code: {
    signature:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function invertTree(root: TreeNode | null): TreeNode | null {\n  // your code here\n}\n',
    harness: 'tree',
    tests: [
      { args: [{ $tree: [4, 2, 7, 1, 3, 6, 9] }], expected: { $tree: [4, 7, 2, 9, 6, 3, 1] }, label: 'example' },
      { args: [{ $tree: [2, 1, 3] }], expected: { $tree: [2, 3, 1] }, label: 'three nodes' },
      { args: [{ $tree: [] }], expected: { $tree: [] }, label: 'empty tree' },
      { args: [{ $tree: [1] }], expected: { $tree: [1] }, label: 'single node', hidden: true },
      { args: [{ $tree: [1, 2] }], expected: { $tree: [1, null, 2] }, label: 'only left child', hidden: true },
      { args: [{ $tree: [1, null, 2] }], expected: { $tree: [1, 2] }, label: 'only right child', hidden: true },
    ],
    referenceSolution:
      'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nexport function invertTree(root: TreeNode | null): TreeNode | null {\n  if (root === null) return root\n  ;[root.left, root.right] = [root.right, root.left]\n  invertTree(root.left)\n  invertTree(root.right)\n  return root\n}\n',
    complexity: { time: 'O(n)', space: 'O(h)' },
  },
}
