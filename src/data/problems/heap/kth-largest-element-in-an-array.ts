import type { Problem } from '../../types'

export const kthLargestElementInAnArray: Problem = {
  id: 'kth-largest-element-in-an-array',
  leetcodeId: 215,
  title: 'Kth Largest Element in an Array',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'heap',
  authored: true,
  statement:
    'Given an integer array `nums` and an integer `k`, return the k-th **largest** element (counting duplicates, i.e. the k-th in descending sorted order). A `MinHeap` utility with `push(key, value)`, `pop()`, `peek()`, `peekKey()`, and `size` is available.',
  examples: [
    { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
    { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
  ],
  constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an unsorted array (duplicates count separately) and k. Output: one value — the k-th largest in sorted-descending terms, *not* the k-th distinct.',
      rubric: ['Duplicates-count-separately noted', 'Single value output'],
      teachingNote:
        'Read selection problems twice: "k-th largest counting duplicates" and "k-th distinct" are different problems. Confirming which one — out loud — costs five seconds and prevents a wrong solution.',
    },
    whatToFind: {
      modelAnswer: 'A selection (order statistic): one rank\'s value, without needing the rest of the order.',
      rubric: ['Names selection/order-statistic', 'Full sort explicitly unnecessary'],
      teachingNote:
        '"Find the k-th X" is the selection category. The taxonomy step matters because selection has a dedicated toolset (heap of size k, quickselect) that "sort it" thinking never reaches.',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10⁵: O(n log n) sorting passes, but the interesting budgets are O(n log k) (heap) and O(n) average (quickselect). Small value range (±10⁴) even allows O(n + range) counting sort — worth naming.',
      rubric: ['Distinguishes log n vs log k budgets', 'Notes the counting-sort option from the value range'],
      teachingNote:
        'When k is small relative to n, log k ≪ log n is the whole point of the heap approach. Train the reflex: "do I need the whole order, or just k of it?"',
    },
    bruteForce: {
      modelAnswer: 'Sort descending and index k−1: O(n log n) time, O(n) space (or in-place). Completely correct — the baseline to beat.',
      rubric: ['Sort-and-index stated', 'O(n log n) stated', 'Acknowledged as correct-but-improvable'],
      teachingNote:
        'Sorting is a *fine* interview answer if you immediately add "but it orders everything when I need one rank — I can do better with a size-k heap." Name the improvement before being asked.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Sorting establishes the exact position of all n elements when only one rank matters — n log n comparisons mostly spent ordering elements that provably can\'t be the answer. Keep just the k largest seen so far in a min-heap: anything smaller than its top can never be the k-th largest. Pattern: Heap (top-k).',
      rubric: ['Waste: full ordering for one rank', 'Size-k min-heap invariant stated'],
      acceptedPatterns: ['heap'],
      teachingNote:
        'The inversion trips people: to track the k *largest*, use a *min*-heap — its top is the weakest member, the one candidates must beat. Say "the heap top is my current k-th largest" and the design explains itself.',
    },
    algorithm: {
      modelAnswer:
        'Min-heap of size ≤ k. For each x: push; if size > k, pop (evicts the smallest). After the pass the top is the k-th largest. Time O(n log k), space O(k). (Mention quickselect O(n) average as the alternative.)',
      rubric: [
        'Push-then-evict loop keeping size k',
        'Final top = answer justified',
        'States O(n log k)/O(k); quickselect mentioned',
      ],
      teachingNote:
        'The MinHeap utility keys by number: push(x, x) here. In problems where the value isn\'t the priority (points by distance), the key/value split earns its keep.',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be sorting and indexing — O(n log n), fine but it orders 10⁵ elements to learn one rank. This looks like a top-k heap problem: a min-heap capped at size k holds the k best so far, its top being the current k-th largest; each element either beats the top or is discarded. Time O(n log k), space O(k). If asked to push further: quickselect averages O(n).',
      rubric: ['Template followed with the capped-heap invariant', 'Both complexities stated'],
      teachingNote:
        'Offering the quickselect upgrade unprompted — one sentence, no code — is exactly the calibrated flex interviews reward.',
    },
  },
  incrementalBuild: [
    {
      label: '1. A MIN-heap tracks the k LARGEST — its top is the weakest keeper',
      code: 'const heap = new MinHeap<number>()\n// invariant: the heap holds the k best seen so far;\n// heap.peek() is the current k-th largest',
    },
    {
      label: '2. Push each element, evict the weakest past size k',
      code: 'for (const x of nums) {\n  heap.push(x, x)              // key = value here\n  if (heap.size > k) heap.pop()   // the smallest of k+1 can never be the answer\n}',
    },
    {
      label: '3. After the pass, the top is the answer',
      code: 'return heap.peek()!   // O(n log k) total, O(k) space',
    },
  ],
  code: {
    signature: 'export function findKthLargest(nums: number[], k: number): number {\n  // MinHeap is available: push(key, value), pop(), peek(), peekKey(), size\n}\n',
    harness: 'plain',
    tests: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5, label: 'example' },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4, label: 'duplicates count' },
      { args: [[1], 1], expected: 1, label: 'single element' },
      { args: [[7, 7, 7, 7], 3], expected: 7, label: 'all equal', hidden: true },
      { args: [[-1, -2, -3], 1], expected: -1, label: 'all negative', hidden: true },
      { args: [[2, 1], 2], expected: 1, label: 'k equals n', hidden: true },
    ],
    referenceSolution:
      'export function findKthLargest(nums: number[], k: number): number {\n  const heap = new MinHeap<number>()\n  for (const x of nums) {\n    heap.push(x, x)\n    if (heap.size > k) heap.pop()\n  }\n  return heap.peek()!\n}\n',
    complexity: { time: 'O(n log k)', space: 'O(k)' },
  },
}
