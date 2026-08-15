import type { Problem } from '../../types'

export const linkedListCycle: Problem = {
  id: 'linked-list-cycle',
  leetcodeId: 141,
  title: 'Linked List Cycle',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'linked-list',
  authored: true,
  statement:
    'Given the `head` of a singly linked list, return `true` if the list contains a cycle — some node\'s `next` pointer loops back to a node already on the path from `head` — and `false` otherwise. (LeetCode\'s examples describe the list as `values` plus an integer `pos`, the index the tail connects back to, with `-1` meaning no cycle. The harness builds that list for you; your function receives a real `ListNode` chain and must not assume `values`/`pos`.)',
  examples: [
    { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'Tail (-4) connects back to index 1 (value 2)' },
    { input: 'head = [1,2], pos = 0', output: 'true', explanation: 'Tail (2) connects back to index 0 (value 1)' },
    { input: 'head = [1], pos = -1', output: 'false', explanation: 'No cycle — tail\'s next is null' },
  ],
  constraints: ['0 <= values.length <= 10^4', '-10^5 <= values[i] <= 10^5', '-1 <= pos < values.length'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: the head of a singly linked list (possibly null, possibly cyclic). Output: a boolean — does traversal from head ever revisit a node. Node values and the example `pos` index do not matter; only pointer identity does.',
      rubric: ['States output is a pure existence boolean', 'Notes node values themselves are irrelevant to the answer'],
      teachingNote: 'Note explicitly that values can repeat legitimately (e.g. two different nodes holding the same number) — cycle detection must be about node identity, not value equality.',
    },
    whatToFind: {
      modelAnswer: 'Whether following `next` pointers from head enters an infinite loop — equivalently, whether two differently-paced pointers walking the list are ever forced to land on the same node.',
      rubric: ['Reduces to detecting a repeated node during traversal', 'Frames it via two pointers at different paces'],
      teachingNote: 'The "two differently-paced walkers must eventually coincide on a loop" framing is exactly Floyd\'s cycle detection — plant that idea here so the algorithm step feels inevitable.',
    },
    constraintsHint: {
      modelAnswer:
        'Up to 1e4 nodes. A hash set of visited node references gives O(n) time, O(n) space — correct and simple. Nothing in the constraints forces better, but O(1) extra space is achievable and is the expected "clever" answer for this classic problem.',
      rubric: ['Notes hash-set approach is O(n)/O(n) and valid', 'Notes O(1)-space alternative exists and is preferred'],
      teachingNote: 'This is a case where constraints don\'t force the optimization — the O(1)-space slow/fast solution is preferred purely because it\'s the well-known better answer, worth stating that distinction.',
    },
    bruteForce: {
      modelAnswer: 'Walk from head, storing each visited node reference in a Set; if a node is ever revisited (already in the set), return true; if the walk reaches null, return false. O(n) time, O(n) space.',
      rubric: ['Hash-set-of-visited-nodes approach', 'States O(n) time, O(n) space'],
      teachingNote: 'Say clearly that the set stores node *references*, not values — storing values would misfire on lists with legitimate duplicate values.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The visited set spends O(n) memory just to detect "have I been here before" — but a second pointer moving twice as fast achieves the same detection with no memory: if there\'s a cycle, the fast pointer eventually laps the slow one and they land on the same node; if there\'s no cycle, fast hits null first. Pattern: Two Pointers (Floyd\'s tortoise and hare, different speeds).',
      rubric: ['Waste: O(n) space just to remember visited nodes', 'Names the different-speed two-pointer (Floyd\'s) technique'],
      acceptedPatterns: ['two-pointers'],
      teachingNote: 'This is the flagship "different-speed" two-pointer pattern, distinct from the more common converge-from-both-ends variant — worth naming that distinction explicitly.',
    },
    algorithm: {
      modelAnswer:
        'slow = head, fast = head. While fast and fast.next are both non-null: slow = slow.next, fast = fast.next.next; if slow === fast, a cycle exists, return true. If the loop exits (fast or fast.next hit null), there\'s no cycle, return false. Time O(n), space O(1).',
      rubric: ['Slow advances one step, fast advances two per iteration', 'Loop guard checks both fast and fast.next for null', 'Equality is reference (node) comparison, not value'],
      teachingNote: 'The loop guard must check fast.next before fast.next.next, or a non-cyclic list of even length throws on a null dereference — a common bug worth calling out proactively.',
    },
    interviewScript: {
      modelAnswer:
        'This reduces to detecting whether traversal from head ever revisits a node. A hash set of visited node references does this in O(n) time but O(n) space. I can drop the space entirely with Floyd\'s tortoise-and-hare: a slow pointer moving one step and a fast pointer moving two steps per iteration — if there\'s a cycle, fast eventually laps slow and they meet; if not, fast reaches null first. O(n) time, O(1) space.',
      rubric: ['Template followed: reduction, brute force, waste, pattern', 'States final complexity'],
      teachingNote: 'Canonical enough that interviewers expect the O(1)-space answer by name ("Floyd\'s" / "tortoise and hare") — say the name, don\'t just describe the mechanics.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Two pointers starting together at head',
      code: 'let slow = head\nlet fast = head',
    },
    {
      label: '2. Fast moves twice as fast as slow, each iteration',
      code: 'while (fast !== null && fast.next !== null) {\n  slow = slow!.next\n  fast = fast.next.next',
    },
    {
      label: '3. If they ever meet, fast lapped slow — there\'s a cycle',
      code: '  if (slow === fast) return true\n}',
    },
    {
      label: '4. Fast ran off the end without meeting slow — no cycle',
      code: 'return false',
    },
  ],
  code: {
    signature:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function hasCycle(head: ListNode | null): boolean {\n  // your code here\n}\n',
    harness: 'linked-list',
    tests: [
      { args: [{ $list: [3, 2, 0, -4], $pos: 1 }], expected: true, label: 'example: tail loops back to index 1' },
      { args: [{ $list: [1, 2], $pos: 0 }], expected: true, label: 'example: tail loops back to head' },
      { args: [{ $list: [1], $pos: -1 }], expected: false, label: 'single node, no cycle' },
      { args: [{ $list: [], $pos: -1 }], expected: false, label: 'empty list', hidden: true },
      { args: [{ $list: [1], $pos: 0 }], expected: true, label: 'single node self-loop', hidden: true },
      { args: [{ $list: [1, 2, 3, 4, 5], $pos: -1 }], expected: false, label: 'longer list with no cycle', hidden: true },
    ],
    referenceSolution:
      'interface ListNode { val: number; next: ListNode | null }\n\nexport function hasCycle(head: ListNode | null): boolean {\n  let slow: ListNode | null = head\n  let fast: ListNode | null = head\n  while (fast !== null && fast.next !== null) {\n    slow = slow!.next\n    fast = fast.next.next\n    if (slow === fast) return true\n  }\n  return false\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
