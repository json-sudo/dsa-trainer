import type { Problem } from '../../types'

export const reorderList: Problem = {
  id: 'reorder-list',
  leetcodeId: 143,
  title: 'Reorder List',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'linked-list',
  authored: true,
  statement:
    'Given the head of a singly linked list `L0 → L1 → … → Ln`, reorder it **in place** to `L0 → Ln → L1 → Ln−1 → L2 → …` and return the head. Only pointers may be changed, not values.',
  examples: [
    { input: 'head = [1,2,3,4]', output: '[1,4,2,3]' },
    { input: 'head = [1,2,3,4,5]', output: '[1,5,2,4,3]' },
  ],
  constraints: ['1 <= list length <= 5 * 10^4', '1 <= node.val <= 1000', 'O(1) extra space expected'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a non-empty list head. Output: the same nodes interleaved front, back, front+1, back−1, … — in place, values untouched.',
      rubric: ['Interleave-from-both-ends shape stated', 'In-place, pointer-only contract'],
    },
    whatToFind: {
      modelAnswer:
        'A rearrangement that needs the list\'s back half in reverse order alongside its front half — decomposable into: find middle, reverse back half, merge alternately.',
      rubric: ['Decomposes into middle + reverse + interleave', 'Identifies rearrangement (no values computed)'],
    },
    constraintsHint: {
      modelAnswer:
        'n up to 5×10⁴ with O(1) space expected: no array of nodes (that\'s the O(n)-space shortcut). Everything must come from pointer walks — which the three known sub-moves provide.',
      rubric: ['O(1)-space expectation excludes the node array', 'Notes each sub-move is a known O(1)-space technique'],
    },
    bruteForce: {
      modelAnswer:
        'Copy node references into an array, then relink by index picking front/back alternately: O(n) time but O(n) space. Correct; violates the space expectation.',
      rubric: ['Array-of-nodes approach', 'O(n) space flaw named', 'States complexity'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The array only exists to walk the list backward — but reversing the second half *in place* gives backward traversal for free. Slow/fast pointers find the middle; the reversal is the Reverse Linked List move; then two pointers zip the halves. Pattern: Two Pointers (slow/fast + rewire).',
      rubric: ['Waste: array simulates backward walk that reversal provides', 'Three-phase pointer plan'],
      acceptedPatterns: ['two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'Phase 1: slow/fast to the middle; cut the list after slow. Phase 2: reverse the second half (prev/cur dance). Phase 3: alternate-splice nodes from the two halves (first half is equal or one longer). Time O(n), space O(1).',
      rubric: [
        'Middle-find with the cut after slow',
        'In-place reversal of the back half',
        'Alternating splice with odd/even length handled',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be indexing all nodes in an array and re-linking — linear space, and the problem expects constant. The reorder is "front half zipped with reversed back half", and each piece is a standard O(1)-space move: slow/fast for the middle, in-place reversal, then a two-pointer merge. I\'ll do those three phases. Time O(n), space O(1).',
      rubric: ['Template followed with the three-phase decomposition', 'Complexity stated'],
    },
  },
  code: {
    signature:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function reorderList(head: ListNode | null): ListNode | null {\n  // reorder in place, then return the head\n}\n',
    harness: 'linked-list',
    tests: [
      { args: [{ $list: [1, 2, 3, 4] }], expected: { $list: [1, 4, 2, 3] }, label: 'even length' },
      { args: [{ $list: [1, 2, 3, 4, 5] }], expected: { $list: [1, 5, 2, 4, 3] }, label: 'odd length' },
      { args: [{ $list: [1] }], expected: { $list: [1] }, label: 'single node' },
      { args: [{ $list: [1, 2] }], expected: { $list: [1, 2] }, label: 'two nodes', hidden: true },
      { args: [{ $list: [1, 2, 3] }], expected: { $list: [1, 3, 2] }, label: 'three nodes', hidden: true },
      { args: [{ $list: [1, 1, 2, 2, 3, 3] }], expected: { $list: [1, 3, 1, 3, 2, 2] }, label: 'duplicates', hidden: true },
    ],
    referenceSolution:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function reorderList(head: ListNode | null): ListNode | null {\n  if (!head || !head.next) return head\n  let slow: ListNode = head\n  let fast: ListNode | null = head\n  while (fast.next && fast.next.next) {\n    slow = slow.next!\n    fast = fast.next.next\n  }\n  let second: ListNode | null = slow.next\n  slow.next = null\n  let prev: ListNode | null = null\n  while (second) {\n    const next: ListNode | null = second.next\n    second.next = prev\n    prev = second\n    second = next\n  }\n  let first: ListNode | null = head\n  let rev: ListNode | null = prev\n  while (rev) {\n    const n1: ListNode | null = first!.next\n    const n2: ListNode | null = rev.next\n    first!.next = rev\n    rev.next = n1\n    first = n1\n    rev = n2\n  }\n  return head\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
