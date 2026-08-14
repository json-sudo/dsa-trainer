import type { Problem } from '../../types'

export const mergeTwoSortedLists: Problem = {
  id: 'merge-two-sorted-lists',
  leetcodeId: 21,
  title: 'Merge Two Sorted Lists',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'linked-list',
  authored: true,
  statement:
    'You are given the heads of two sorted singly linked lists, `list1` and `list2`. Splice them into one sorted list (reusing the existing nodes) and return its head.',
  examples: [
    { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
    { input: 'list1 = [], list2 = []', output: '[]' },
    { input: 'list1 = [], list2 = [0]', output: '[0]' },
  ],
  constraints: ['0 <= combined length <= 100', '-100 <= node.val <= 100', 'both lists sorted non-decreasing'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two sorted (possibly empty) list heads. Output: one sorted list built by splicing the original nodes — no new nodes, no value copying.',
      rubric: ['Both-may-be-empty noted', 'Splice existing nodes requirement'],
    },
    whatToFind: {
      modelAnswer: 'A construct-by-interleaving task: repeatedly choose the smaller current head. The merge step of merge sort, on lists.',
      rubric: ['Names the take-smaller-head loop', 'Recognizes the merge-sort merge'],
    },
    constraintsHint: {
      modelAnswer: 'Tiny bounds — technique over speed. Sortedness of both inputs is the structure: the global next element is always one of two candidates.',
      rubric: ['Notes the two-candidate invariant from sortedness', 'Speed not the issue'],
    },
    bruteForce: {
      modelAnswer: 'Collect all values into an array, sort, rebuild a list: O(n log n) time, O(n) space, ignores that the inputs are already sorted.',
      rubric: ['Collect-and-sort named', 'Points at the wasted pre-sortedness', 'States complexity'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Sorting redoes work the inputs already did — each list is sorted, so the merged order is decidable one comparison at a time. Walk a pointer down each list, appending the smaller; a dummy head kills the empty/first-node special cases. Pattern: Two Pointers (with dummy head).',
      rubric: ['Waste: re-sorting sorted data', 'Dummy-head two-pointer splice proposed'],
      acceptedPatterns: ['two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'dummy = new node, tail = dummy. While both lists non-empty: attach the smaller head to tail, advance that list and tail. Attach whichever list remains. Return dummy.next. Time O(n+m), space O(1).',
      rubric: ['Dummy + tail append loop', 'Remainder attachment (no node lost)', 'States O(n+m)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be dumping both lists into an array and sorting — O(n log n) and it wastes that the inputs are sorted. Since each list is sorted, the next output node is always the smaller of the two current heads: a two-pointer merge. I\'ll use a dummy head to avoid special-casing the first node, splicing in place. Time O(n+m), space O(1).',
      rubric: ['Template followed with the two-candidate insight', 'Dummy-head mentioned'],
    },
  },
  code: {
    signature:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {\n  // your code here\n}\n',
    harness: 'linked-list',
    tests: [
      { args: [{ $list: [1, 2, 4] }, { $list: [1, 3, 4] }], expected: { $list: [1, 1, 2, 3, 4, 4] }, label: 'example' },
      { args: [{ $list: [] }, { $list: [] }], expected: { $list: [] }, label: 'both empty' },
      { args: [{ $list: [] }, { $list: [0] }], expected: { $list: [0] }, label: 'one empty' },
      { args: [{ $list: [1, 2, 3] }, { $list: [4, 5] }], expected: { $list: [1, 2, 3, 4, 5] }, label: 'no interleaving', hidden: true },
      { args: [{ $list: [5] }, { $list: [1, 2] }], expected: { $list: [1, 2, 5] }, label: 'first list wins late', hidden: true },
      { args: [{ $list: [-3, 0, 3] }, { $list: [-2, -1] }], expected: { $list: [-3, -2, -1, 0, 3] }, label: 'negatives', hidden: true },
    ],
    referenceSolution:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {\n  const dummy: ListNode = { val: 0, next: null }\n  let tail = dummy\n  let a = list1\n  let b = list2\n  while (a && b) {\n    if (a.val <= b.val) {\n      tail.next = a\n      a = a.next\n    } else {\n      tail.next = b\n      b = b.next\n    }\n    tail = tail.next\n  }\n  tail.next = a ?? b\n  return dummy.next\n}\n',
    complexity: { time: 'O(n + m)', space: 'O(1)' },
  },
}
