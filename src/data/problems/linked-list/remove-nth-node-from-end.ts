import type { Problem } from '../../types'

export const removeNthNodeFromEnd: Problem = {
  id: 'remove-nth-node-from-end',
  leetcodeId: 19,
  title: 'Remove Nth Node From End',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'linked-list',
  authored: true,
  statement:
    'Given the head of a linked list and an integer `n`, remove the `n`-th node **from the end** and return the head. Aim for a single pass.',
  examples: [
    { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]' },
    { input: 'head = [1], n = 1', output: '[]' },
    { input: 'head = [1,2], n = 1', output: '[1]' },
  ],
  constraints: ['1 <= list length <= 30', '1 <= n <= list length', 'follow-up: one pass'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a list head and n counted from the *end* (guaranteed valid). Output: the head after unlinking that node — which may be the head itself when n equals the length.',
      rubric: ['n counts from the end', 'Removing the head is a live case'],
    },
    whatToFind: {
      modelAnswer: 'Locate the (length − n)-th node\'s *predecessor* and splice around its target — a position-finding plus unlink task.',
      rubric: ['Needs the predecessor, not the node itself', 'Position defined relative to the end'],
    },
    constraintsHint: {
      modelAnswer:
        'Tiny list, so two passes (count then walk) trivially works — the follow-up "one pass" is the technique being probed. Singly linked: no backward walking, so the end-relative position must be simulated forward.',
      rubric: ['Recognizes one-pass as the real test', 'No backward traversal in singly linked lists'],
    },
    bruteForce: {
      modelAnswer: 'Two passes: measure length L, walk to node L−n−1, unlink. O(n) time, O(1) space — fine, but two traversals.',
      rubric: ['Count-then-walk described', 'Correctly places the predecessor index', 'Notes double traversal'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The first pass exists only to learn "n from the end" — but a second pointer trailing n nodes behind a lead pointer encodes that distance *while* walking. When the lead hits the end, the trailer is at the predecessor. A dummy head covers head-removal. Pattern: Two Pointers (offset walk).',
      rubric: ['Waste: full pass just to measure', 'Fixed-gap two-pointer walk + dummy head'],
      acceptedPatterns: ['two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'dummy → head. lead = dummy advanced n+1 steps; trail = dummy. Advance both until lead is null; now trail.next is the target: trail.next = trail.next.next. Return dummy.next. Time O(n), one pass, space O(1).',
      rubric: ['Gap of n+1 from dummy so trail lands on the predecessor', 'Dummy handles removing the first node', 'One pass O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'The straightforward way is two passes — count the length, then walk to the predecessor. To do it in one pass, I\'ll run two pointers with a fixed gap of n+1 starting from a dummy head: when the leader falls off the end, the trailer sits exactly before the node to remove, and the dummy makes head-removal uniform. Time O(n), space O(1), single pass.',
      rubric: ['Template followed with the fixed-gap insight', 'Dummy-head edge case named'],
    },
  },
  code: {
    signature:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {\n  // your code here\n}\n',
    harness: 'linked-list',
    tests: [
      { args: [{ $list: [1, 2, 3, 4, 5] }, 2], expected: { $list: [1, 2, 3, 5] }, label: 'example' },
      { args: [{ $list: [1] }, 1], expected: { $list: [] }, label: 'remove only node' },
      { args: [{ $list: [1, 2] }, 1], expected: { $list: [1] }, label: 'remove tail' },
      { args: [{ $list: [1, 2] }, 2], expected: { $list: [2] }, label: 'remove head', hidden: true },
      { args: [{ $list: [1, 2, 3] }, 3], expected: { $list: [2, 3] }, label: 'n equals length', hidden: true },
      { args: [{ $list: [5, 4, 3, 2, 1] }, 5], expected: { $list: [4, 3, 2, 1] }, label: 'longer head removal', hidden: true },
    ],
    referenceSolution:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {\n  const dummy: ListNode = { val: 0, next: head }\n  let lead: ListNode | null = dummy\n  for (let i = 0; i < n + 1; i++) lead = lead!.next\n  let trail: ListNode = dummy\n  while (lead) {\n    lead = lead.next\n    trail = trail.next!\n  }\n  trail.next = trail.next!.next\n  return dummy.next\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
