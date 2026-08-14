import type { Problem } from '../../types'

export const addTwoNumbers: Problem = {
  id: 'add-two-numbers',
  leetcodeId: 2,
  title: 'Add Two Numbers',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'linked-list',
  authored: true,
  statement:
    'You are given two non-empty linked lists `l1` and `l2` representing two non-negative integers. The digits are stored in **reverse order** (the ones digit is the head), and each node contains a single digit. Add the two numbers and return the sum as a linked list, in the same reversed-digit format.',
  examples: [
    { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807.' },
    { input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]', output: '[8,9,9,9,0,0,0,1]' },
  ],
  constraints: ['1 <= list length <= 100', '0 <= node.val <= 9', 'no leading zero except the number 0 itself'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two non-empty digit lists, each digit 0-9, stored ones-digit-first. Output: their sum as a list in the same reversed format. Reversed storage means I add from the head, matching how grade-school addition works from the ones place.',
      rubric: ['Notes digits are reversed (ones-first), which matches natural addition order', 'Output must be a new list in the same reversed format'],
    },
    whatToFind: {
      modelAnswer:
        'A digit-by-digit addition with carry propagation, where the two lists may have different lengths and the final carry can produce an extra leading digit.',
      rubric: ['Identifies carry propagation as the core mechanic', 'Notes unequal lengths and a possible trailing carry digit must be handled'],
    },
    constraintsHint: {
      modelAnswer:
        'Lists up to length 100 — tiny, so no complexity pressure; the real risk is correctness at the edges: different-length lists and a final carry that adds a new node beyond both lists\' ends.',
      rubric: ['Recognizes size gives no complexity pressure', 'Flags the different-length and trailing-carry edge cases as the real challenge'],
    },
    bruteForce: {
      modelAnswer:
        'Convert both lists to numbers (or strings), add them, then build a new reversed-digit list from the result. Works, but for very long lists this risks numeric overflow, and it\'s solving a problem the list structure already lets me do directly with a single pass.',
      rubric: ['Names the convert-to-number-then-rebuild approach', 'Notes overflow risk or that it bypasses the natural single-pass structure'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Converting to a full integer does extra work (and risks overflow) to solve something addition-with-carry already does incrementally — the lists are already digit-aligned from the ones place, exactly how manual addition proceeds. Walk both lists together, add corresponding digits plus carry, one node at a time. Pattern: One Pass (dual pointer with carry).',
      rubric: ['Names the waste: full numeric conversion when digit-by-digit addition works directly', 'Proposes a single simultaneous walk carrying a running carry value'],
      acceptedPatterns: ['one-pass'],
    },
    algorithm: {
      modelAnswer:
        'Use a dummy head node and a running carry = 0. Loop while l1, l2, or carry is truthy: sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry; carry = Math.floor(sum/10); append a new node with sum % 10; advance l1 and l2 if present. Return dummy.next. Time O(max(m,n)), space O(max(m,n)) for the output list.',
      rubric: ['Uses a dummy head to simplify list building', 'Loop condition covers l1, l2, AND leftover carry', 'States O(max(m,n))/O(max(m,n))'],
    },
    interviewScript: {
      modelAnswer:
        'Converting both lists to full numbers works but risks overflow on long lists and ignores that the reversed storage already hands me digits in addition order. So I walk both lists together with a running carry, exactly like manual addition, building a new list with a dummy head and continuing as long as either list has nodes or a carry remains. Time O(max(m,n)), space O(max(m,n)) for the result.',
      rubric: ['Follows the script template end-to-end', 'States the dual-pointer-with-carry insight and final complexity'],
    },
  },
  code: {
    signature:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {\n  // your code here\n}\n',
    harness: 'linked-list',
    tests: [
      { args: [{ $list: [2, 4, 3] }, { $list: [5, 6, 4] }], expected: { $list: [7, 0, 8] }, label: 'example' },
      { args: [{ $list: [0] }, { $list: [0] }], expected: { $list: [0] }, label: 'both zero' },
      { args: [{ $list: [9, 9, 9, 9, 9, 9, 9] }, { $list: [9, 9, 9, 9] }], expected: { $list: [8, 9, 9, 9, 0, 0, 0, 1] }, label: 'different lengths with final carry' },
      { args: [{ $list: [5] }, { $list: [5] }], expected: { $list: [0, 1] }, label: 'single digit carries', hidden: true },
      { args: [{ $list: [1, 8] }, { $list: [0] }], expected: { $list: [1, 8] }, label: 'one operand is zero', hidden: true },
      { args: [{ $list: [2, 4, 9] }, { $list: [5, 6, 4, 9] }], expected: { $list: [7, 0, 4, 0, 1] }, label: 'carry propagates through longer list', hidden: true },
    ],
    referenceSolution:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {\n  const dummy: ListNode = { val: 0, next: null }\n  let cur = dummy\n  let carry = 0\n  let a: ListNode | null = l1\n  let b: ListNode | null = l2\n  while (a || b || carry) {\n    const sum = (a ? a.val : 0) + (b ? b.val : 0) + carry\n    carry = Math.floor(sum / 10)\n    cur.next = { val: sum % 10, next: null }\n    cur = cur.next\n    if (a) a = a.next\n    if (b) b = b.next\n  }\n  return dummy.next\n}\n',
    complexity: { time: 'O(max(m,n))', space: 'O(max(m,n))' },
  },
}
