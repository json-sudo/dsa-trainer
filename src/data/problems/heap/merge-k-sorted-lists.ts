import type { Problem } from '../../types'

export const mergeKSortedLists: Problem = {
  id: 'merge-k-sorted-lists',
  leetcodeId: 23,
  title: 'Merge k Sorted Lists',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'heap',
  authored: true,
  statement:
    'You are given `k` linked lists, each already sorted in ascending order. Merge them into one sorted list and return it. The real LeetCode signature is `mergeKLists(lists: ListNode[]): ListNode` — an array of linked-list heads. This trainer\'s `linked-list` harness marker can only resolve a single top-level list per argument, so it cannot represent "an array of several linked lists" in one parameter. Instead, `lists` is passed here as a plain array of arrays: `lists: number[][]`, where each inner array is the already-sorted values of one input list, and you return the fully merged, sorted values as a flat `number[]`. A `MinHeap` utility is available.',
  examples: [
    { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
    { input: 'lists = []', output: '[]' },
    { input: 'lists = [[]]', output: '[]' },
  ],
  constraints: [
    '0 <= lists.length <= 10^4',
    '0 <= lists[i].length <= 500',
    '-10^4 <= lists[i][j] <= 10^4',
    'each lists[i] is sorted in ascending order',
  ],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: k already-sorted lists (given as arrays of values here, since a single top-level list marker can\'t carry k separate lists). Output: one flat array containing every value from every list, in ascending order. Total element count N can be up to a few million, so any per-element work must stay cheap.',
      rubric: [
        'States output is one fully merged, ascending array across all k lists',
        'Notes both k (list count) and N (total elements) as relevant sizes',
      ],
    },
    whatToFind: {
      modelAnswer:
        'A k-way merge: at every step, among the k lists\' current front elements, find the smallest and emit it. This is the natural generalization of merging two sorted lists (from merge sort) to k of them.',
      rubric: [
        'Frames the task as a k-way merge, not k independent 2-way merges done blindly',
        'Recognizes only the current front of each list can possibly be the next-smallest overall',
      ],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 10^4 lists and 500 elements each means N can reach ~5×10^6 total values. Repeatedly scanning all k fronts to find the minimum is O(N·k) — too slow when both are large. A heap holding one candidate per list caps the per-step cost at O(log k), giving O(N log k) overall.',
      rubric: ['Derives that O(N·k) is too slow from the given bounds', 'Names O(N log k) as the achievable budget'],
    },
    bruteForce: {
      modelAnswer:
        'Repeatedly scan the current front element of all k lists, pick the smallest, advance that list, and append the value to the result; repeat until every list is exhausted. Correct, but each of the N output elements costs an O(k) linear scan. O(N·k) time, O(N) space for the output.',
      rubric: ['Describes scanning all k fronts per output element', 'States O(N·k) time'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The linear scan over k fronts wastes time re-comparing candidates that haven\'t changed since the last pick — only the one list that just got advanced has a new front value. A min-heap holding exactly one (value, list) candidate per non-exhausted list turns "find the smallest of k" into an O(log k) pop, and "one list advanced" into a single O(log k) push. Pattern: Heap (k-way merge).',
      rubric: ['Names the waste: re-scanning all k candidates when only one changed', 'Proposes a heap holding one candidate per list'],
      acceptedPatterns: ['heap'],
    },
    algorithm: {
      modelAnswer:
        'Track a pointer (list index, element index) into each of the k input arrays. Push the first element of every non-empty list into a `MinHeap<{ listIdx: number; elemIdx: number }>` keyed by that element\'s value. Repeatedly pop the minimum entry: append its value to the result, then if `elemIdx + 1` is still within that list, push `(listIdx, elemIdx + 1)` keyed by the new value. Stop when the heap is empty. Time O(N log k) — each of the N elements is pushed and popped once, each op costing O(log k) since the heap never holds more than k entries; space O(k) for the heap plus O(N) for the output.',
      rubric: [
        'Heap seeded with one entry per non-empty list, keyed by value',
        'On pop, advances that specific list and pushes its next element if one exists',
        'States O(N log k) time',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force is a k-way merge done by linear scan: at every output step, compare all k current fronts to find the min — O(N·k), wasteful because only one front changes between steps. A min-heap holding one candidate per list fixes that: pop the smallest in O(log k), and if that list has more elements push its next value. Repeat until the heap empties. Time O(N log k), space O(k) for the heap plus O(N) for the output.',
      rubric: ['Follows the template end-to-end', 'States the k-candidate heap invariant and final complexity'],
    },
  },
  code: {
    signature:
      'export function mergeKLists(lists: number[][]): number[] {\n  // MinHeap is available: push(key, value), pop(), peek(), peekKey(), size\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6], label: 'example: three lists' },
      { args: [[]], expected: [], label: 'no lists at all' },
      { args: [[[]]], expected: [], label: 'single empty list' },
      { args: [[[5], [1], [3]]], expected: [1, 3, 5], label: 'single-element lists', hidden: true },
      { args: [[[1, 2, 3], [], [4, 5]]], expected: [1, 2, 3, 4, 5], label: 'one empty list among non-empty ones', hidden: true },
      { args: [[[-3, -1, 2], [-2, 0, 4], [1]]], expected: [-3, -2, -1, 0, 1, 2, 4], label: 'negative values mixed in', hidden: true },
    ],
    referenceSolution:
      'export function mergeKLists(lists: number[][]): number[] {\n  const heap = new MinHeap<{ listIdx: number; elemIdx: number }>()\n  for (let i = 0; i < lists.length; i++) {\n    if (lists[i].length > 0) heap.push(lists[i][0], { listIdx: i, elemIdx: 0 })\n  }\n  const result: number[] = []\n  while (heap.size > 0) {\n    const value = heap.peekKey()!\n    const { listIdx, elemIdx } = heap.pop()!\n    result.push(value)\n    const nextIdx = elemIdx + 1\n    if (nextIdx < lists[listIdx].length) {\n      heap.push(lists[listIdx][nextIdx], { listIdx, elemIdx: nextIdx })\n    }\n  }\n  return result\n}\n',
    complexity: { time: 'O(N log k)', space: 'O(k + N)' },
  },
}
