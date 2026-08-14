import type { Problem } from '../../types'

export const kthLargestElementInAStream: Problem = {
  id: 'kth-largest-element-in-a-stream',
  leetcodeId: 703,
  title: 'Kth Largest Element in a Stream',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'heap',
  authored: true,
  statement:
    'Design a class `KthLargest` that maintains the k-th largest element of a growing stream. `KthLargest(k, nums)` initializes it with an initial array. `add(val)` inserts `val` into the stream and returns the current k-th largest element.',
  examples: [
    {
      input: 'KthLargest(3, [4,5,8,2]), add(3), add(5), add(10), add(9), add(4)',
      output: '4, 5, 5, 8, 8',
      explanation: 'After each add, return the 3rd largest element seen so far.',
    },
  ],
  constraints: ['1 <= k <= 10^4', '0 <= nums.length <= 10^4', 'at least k elements exist after each add call', 'up to 10^4 calls to add'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an initial array plus a stream of `add` calls. Output: after every insertion, the current k-th largest value seen so far — an API-design task, not a single function.',
      rubric: ['Recognizes the design-a-data-structure framing', 'Notes the answer must be recomputed correctly after every insertion'],
    },
    whatToFind: {
      modelAnswer: 'A structure that tracks "the k largest elements seen so far" and can report the smallest of *those* — which is exactly the k-th largest overall — cheaply after each insert.',
      rubric: ['Reduces "k-th largest overall" to "smallest of the k largest"', 'Frames it as maintained state across calls'],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 10⁴ add calls, k up to 10⁴: re-sorting everything on every call is O(n log n) per call — too slow at scale. Each add should cost close to O(log k), independent of how large the stream has grown.',
      rubric: ['Flags full re-sort per call as too slow at this volume', 'Targets O(log k) per add'],
    },
    bruteForce: {
      modelAnswer: 'Keep all seen elements in an array; on every add, push the value then sort the whole array and read index length−k. O(n log n) per add, O(n) space.',
      rubric: ['Names the store-everything-and-resort approach', 'States O(n log n) per add'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Sorting re-orders elements that are already known to be smaller than the current k-th largest and can never affect future answers — I only need to remember the k largest. Keep a min-heap capped at size k: push the new value, and if the heap exceeds k, pop its minimum (the smallest of the "top k" is discarded). The heap\'s current minimum is always the answer. Pattern: Heap (fixed-size min-heap of the top k).',
      rubric: ['Names the waste: sorting/storing elements below the current top-k', 'Proposes a size-capped min-heap holding only the top k'],
      acceptedPatterns: ['heap'],
    },
    algorithm: {
      modelAnswer:
        'Constructor: push every initial value into a MinHeap, then pop down to size k if it started larger. add(val): push val; if heap.size > k, pop the minimum. Return heap.peek() (the current minimum of the top k = the k-th largest overall). Time O(log k) per add, O(k) space.',
      rubric: ['Heap capped at size k via pop-after-push', 'peek() after every add returns the answer', 'States O(log k) per op, O(k) space'],
    },
    interviewScript: {
      modelAnswer:
        'Re-sorting the whole stream on every add is O(n log n) per call and wastes effort re-ordering values below the top k, which can never change the answer. I only need the k largest seen so far, so I\'ll keep a min-heap capped at size k: push each new value, evict the minimum whenever the heap exceeds k, and the heap\'s minimum is always the current k-th largest. Each add is O(log k), with O(k) space overall.',
      rubric: ['Follows the script template end-to-end', 'States the capped-min-heap insight and final complexity'],
    },
  },
  code: {
    signature:
      'export class KthLargest {\n  constructor(k: number, nums: number[]) {\n    // your code here\n  }\n  add(val: number): number {\n    return 0\n  }\n}\n',
    harness: 'class-design',
    tests: [
      {
        args: [
          ['KthLargest', 'add', 'add', 'add', 'add', 'add'],
          [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]],
        ],
        expected: [null, 4, 5, 5, 8, 8],
        label: 'example sequence',
      },
      {
        args: [
          ['KthLargest', 'add', 'add'],
          [[1, []], [-3], [-2]],
        ],
        expected: [null, -3, -2],
        label: 'k = 1, empty initial array',
      },
      {
        args: [
          ['KthLargest', 'add', 'add', 'add'],
          [[2, [0]], [-1], [1], [-2]],
        ],
        expected: [null, -1, 0, 0],
        label: 'k = 2, building up from one element',
        hidden: true,
      },
      {
        args: [
          ['KthLargest', 'add', 'add', 'add'],
          [[3, [5, 5, 5]], [5], [5], [5]],
        ],
        expected: [null, 5, 5, 5],
        label: 'duplicate values',
        hidden: true,
      },
      {
        args: [
          ['KthLargest', 'add'],
          [[4, [7, 7, 7, 7]], [10]],
        ],
        expected: [null, 7],
        label: 'k equals initial array length',
        hidden: true,
      },
    ],
    referenceSolution:
      'export class KthLargest {\n  private k: number\n  private heap = new MinHeap<number>()\n\n  constructor(k: number, nums: number[]) {\n    this.k = k\n    for (const n of nums) this.add(n)\n  }\n\n  add(val: number): number {\n    this.heap.push(val, val)\n    if (this.heap.size > this.k) this.heap.pop()\n    return this.heap.peek()!\n  }\n}\n',
    complexity: { time: 'O(log k) per add', space: 'O(k)' },
  },
}
