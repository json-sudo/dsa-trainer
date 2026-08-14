import type { Problem } from '../../types'

export const reverseLinkedList: Problem = {
  id: 'reverse-linked-list',
  leetcodeId: 206,
  title: 'Reverse Linked List',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'linked-list',
  authored: true,
  statement:
    'Given the `head` of a singly linked list, reverse it and return the new head. (In this trainer, lists are built from arrays by the harness — your function receives a real `ListNode` chain with `{ val, next }` nodes.)',
  examples: [
    { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
    { input: 'head = [1,2]', output: '[2,1]' },
    { input: 'head = []', output: '[]' },
  ],
  constraints: ['0 <= list length <= 5000', '-5000 <= node.val <= 5000'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: the head node of a singly linked list (possibly null). Output: the head of the same nodes re-linked in reverse — reuse nodes, don\'t copy values.',
      rubric: ['Possibly-null head handled in the contract', 'Rewire nodes, not copy values'],
      teachingNote:
        'Linked-list problems are about *pointers*, not values. Say early that you\'ll rewire `next` pointers in place — copying values into an array and back is the answer interviewers are filtering out.',
    },
    whatToFind: {
      modelAnswer: 'A rearrange task: invert every next pointer so the tail becomes the head. No search, no computation over values.',
      rubric: ['Identifies pure pointer rearrangement', 'Values never inspected'],
      teachingNote:
        'When nothing about the *values* matters, complexity budgets are almost always O(n)/O(1) and the whole difficulty is bookkeeping. Slow down and name your pointers.',
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 5000 — any linear approach passes; the real constraint is idiomatic: O(1) extra space is expected for the iterative version (an array copy would be O(n) space).',
      rubric: ['Notes speed is not the issue', 'O(1)-space expectation stated'],
      teachingNote:
        'Small bounds don\'t mean "anything goes" — they shift the test from performance to *technique*. The interviewer wants the three-pointer dance, not an array detour.',
    },
    bruteForce: {
      modelAnswer: 'Copy values into an array, reverse it, and rebuild (or overwrite) the list: O(n) time but O(n) extra space, and it dodges the pointer work the problem exists to test.',
      rubric: ['Array-copy approach named', 'O(n) space called out as the flaw'],
      teachingNote:
        'This brute force is *correct* — say so, then discard it for the right reason (space + it avoids the skill under test). Knowing why an easy answer is unsatisfying is part of the interview.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The array wastes space storing what the pointers already encode — order. Reversal only needs, at each node, a handle on the *previous* node: walk with two pointers (prev, cur), flipping one edge per step. Pattern: Two Pointers (iterative rewire).',
      rubric: ['Waste: duplicating order the pointers encode', 'prev/cur edge-flip walk proposed'],
      acceptedPatterns: ['two-pointers'],
      teachingNote:
        'The "waste" framing here is space, not time. The pattern menu still applies: prev/cur is the fast/slow family — two pointers moving in lockstep with one link flipped between them.',
    },
    algorithm: {
      modelAnswer:
        'prev = null, cur = head. While cur: next = cur.next (save before breaking!); cur.next = prev; prev = cur; cur = next. Return prev. Empty and single-node lists fall out naturally. Time O(n), space O(1).',
      rubric: [
        'Three-name dance with next saved before overwriting',
        'Returns prev (not cur/head)',
        'States O(n)/O(1) and the trivial edge cases',
      ],
      teachingNote:
        'The one bug everyone writes once: overwriting cur.next before saving it. Say "save next first" aloud as you code — narrating the dance is exactly what a senior does at the whiteboard.',
    },
    interviewScript: {
      modelAnswer:
        'The lazy approach copies values to an array and reverses — linear space and it sidesteps the pointer work. This is an in-place rewiring problem: I\'ll walk prev and cur down the list, flipping one next pointer per step, saving the forward node before each flip. When cur runs off the end, prev is the new head. Time O(n), space O(1).',
      rubric: ['Template adapted: names the rewire plan and the saved-next detail', 'Complexity stated'],
      teachingNote:
        'Reverse Linked List is the foundational rewiring move — Reorder List, Palindrome List, and Reverse Between all embed it. Narrate it until it\'s muscle memory.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Two names: prev trails, cur leads',
      code: 'let prev: ListNode | null = null   // the already-reversed part\nlet cur = head                     // the still-forward part',
    },
    {
      label: '2. The four-line dance — save next BEFORE breaking the link',
      code: 'while (cur) {\n  const next = cur.next   // save first! this link is about to be cut\n  cur.next = prev         // flip one edge\n  prev = cur              // advance prev\n  cur = next              // advance cur\n}',
    },
    {
      label: '3. prev ends on the old tail — the new head',
      code: 'return prev   // NOT cur (cur is null when the loop exits)',
    },
  ],
  code: {
    signature:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function reverseList(head: ListNode | null): ListNode | null {\n  // your code here\n}\n',
    harness: 'linked-list',
    tests: [
      { args: [{ $list: [1, 2, 3, 4, 5] }], expected: { $list: [5, 4, 3, 2, 1] }, label: 'example' },
      { args: [{ $list: [1, 2] }], expected: { $list: [2, 1] }, label: 'two nodes' },
      { args: [{ $list: [] }], expected: { $list: [] }, label: 'empty list' },
      { args: [{ $list: [7] }], expected: { $list: [7] }, label: 'single node', hidden: true },
      { args: [{ $list: [1, 1, 2, 2] }], expected: { $list: [2, 2, 1, 1] }, label: 'duplicate values', hidden: true },
      { args: [{ $list: [-1, 0, 1] }], expected: { $list: [1, 0, -1] }, label: 'negatives', hidden: true },
    ],
    referenceSolution:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function reverseList(head: ListNode | null): ListNode | null {\n  let prev: ListNode | null = null\n  let cur = head\n  while (cur) {\n    const next = cur.next\n    cur.next = prev\n    prev = cur\n    cur = next\n  }\n  return prev\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
