import type { Problem } from '../../types'

export const findMedianFromDataStream: Problem = {
  id: 'find-median-from-data-stream',
  leetcodeId: 295,
  title: 'Find Median from Data Stream',
  difficulty: 'hard',
  mode: 'guided',
  topicId: 'heap',
  authored: true,
  statement:
    'Implement a class `MedianFinder` supporting `addNum(num)` — add an integer to a running stream — and `findMedian()` — return the median of all numbers added so far. A `MinHeap` utility is available.',
  examples: [
    {
      input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()',
      output: '1.5, then 2',
      explanation: 'Median of [1,2] is 1.5; median of [1,2,3] is 2.',
    },
  ],
  constraints: ['-10^5 <= num <= 10^5', 'up to 5 * 10^4 addNum calls', 'findMedian called only when at least one number has been added'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a stream of integers arriving one at a time via addNum, interleaved with findMedian queries. Output: the median of everything seen so far, at each query. State must persist and update incrementally — no re-sorting from scratch each time is implied but not required by the contract itself.',
      rubric: ['Streaming/incremental framing (state persists across calls)', 'Median = middle value(s) of the running multiset'],
      teachingNote:
        'The word "stream" is the signal: this is not "given an array, find the median" — it\'s "maintain a moving statistic under insertion". That distinction picks the whole approach.',
    },
    whatToFind: {
      modelAnswer:
        'A structure that keeps the numbers *partitioned* around the median at all times, so the median is readable in O(1) after each insert rather than recomputed by sorting.',
      rubric: ['Partition-around-the-median framing', 'O(1) query goal named'],
      teachingNote:
        'The key mental leap: you don\'t need the full sorted order, only which half each number belongs to. That\'s a weaker, cheaper invariant than "keep everything sorted".',
    },
    constraintsHint: {
      modelAnswer:
        'Up to 5×10⁴ addNum calls. Full re-sort per call is O(n log n) per insert → O(n² log n) total, roughly 5×10⁴ · 17 · 5×10⁴ ≈ 4×10¹⁰ — far too slow. Need each addNum to be O(log n) and findMedian O(1).',
      rubric: ['States full-resort-per-call is too slow with the arithmetic', 'Derives the O(log n) insert / O(1) query budget'],
      teachingNote:
        'Do the multiplication out loud — "5×10⁴ inserts times O(n log n) each" — so the interviewer sees you deriving the budget, not guessing at "heap sounds right".',
    },
    bruteForce: {
      modelAnswer:
        'Keep a plain array; on findMedian, sort it and read the middle element(s): O(n log n) per query. Or keep it sorted via insertion (binary search the index, O(n) shift): O(n) per addNum, O(1) findMedian. Either way one operation stays linear or worse.',
      rubric: ['Sort-on-query or sorted-insert baseline', 'Identifies at least one operation stuck at O(n) or worse'],
      teachingNote:
        'Two brute forces exist here — sort-on-query and keep-sorted. Naming both, and which operation each sacrifices, shows a fuller grasp than picking one at random.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Keeping the whole collection sorted is more information than the median needs — only the boundary between the lower and upper half matters, and only the two elements straddling that boundary need to be found quickly. Split into two heaps: a max-heap of the lower half, a min-heap of the upper half, each capped at O(1) from the median. Pattern: Heap (two-heap median).',
      rubric: ['Waste: full sort order is more than the median requires', 'Two-heap split at the median boundary'],
      acceptedPatterns: ['heap'],
      teachingNote:
        'The two-heap trick generalizes: whenever you need a running k-th-order-statistic (median, percentile) under streaming insertion, "two heaps split at the boundary" is the pattern — worth stating as a transferable idea.',
    },
    algorithm: {
      modelAnswer:
        'Two heaps: `lower` — a max-heap simulated with the provided MinHeap by negating keys — and `upper`, a genuine MinHeap. addNum(x): push x onto lower (negated key); pop lower\'s max and push it onto upper to keep order; if upper grows larger than lower, pop upper\'s min back onto lower. Sizes now differ by at most 1, lower never smaller than upper. findMedian: if sizes equal, average the two tops; else return lower\'s top (negate back).',
      rubric: [
        'Insert-then-rebalance-by-one-transfer sequence',
        'Size-difference invariant (at most 1, lower >= upper) maintained',
        'findMedian reads tops only, negating lower\'s key back',
      ],
      teachingNote:
        'Always push into `lower` first, then transfer — never branch on "is x less than the current median?" up front. The push-then-shuffle version is simpler to get right and self-corrects even on the first insert.',
    },
    interviewScript: {
      modelAnswer:
        'A running median needs the boundary between the lower and upper half, not a fully sorted stream — full sort is O(n log n) per query, sorted-insert is O(n) per insert; neither hits O(log n) both ways. I\'ll split the data into two heaps at that boundary: a max-heap for the lower half, a min-heap for the upper half, rebalanced after every insert so their sizes differ by at most one. The median then reads directly off the top(s) in O(1); each insert is O(log n) for the heap push plus a possible one-element transfer.',
      rubric: ['States why full-sort is too slow with numbers', 'Explains the rebalance-to-size-difference-1 invariant and O(log n)/O(1) split'],
      teachingNote:
        'This script is a strong template for any "maintain a running statistic" design problem: name the invariant that makes the query cheap, then show inserts preserve it.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Two heaps: lower half (max via negation) and upper half',
      code: 'export class MedianFinder {\n  private lower = new MinHeap<number>()   // simulated max-heap: keys pushed negated\n  private upper = new MinHeap<number>()   // genuine min-heap\n  // ...\n}',
    },
    {
      label: '2. addNum: always land in lower first, then correct order',
      code: 'addNum(num: number): void {\n  this.lower.push(-num, num)                    // negate key -> max-heap behavior\n  const moved = this.lower.pop()!\n  this.upper.push(moved, moved)                 // send lower\'s max up to keep order\n  // ...\n}',
    },
    {
      label: '3. Rebalance so sizes differ by at most 1 (lower can lead by one)',
      code: 'if (this.upper.size > this.lower.size) {\n  const back = this.upper.pop()!\n  this.lower.push(-back, back)\n}',
    },
    {
      label: '4. findMedian reads only the top(s)',
      code: 'findMedian(): number {\n  if (this.lower.size > this.upper.size) return this.lower.peek()!\n  return (this.lower.peek()! + this.upper.peek()!) / 2   // even split -> average both tops\n}',
    },
  ],
  code: {
    signature:
      'export class MedianFinder {\n  addNum(num: number): void {\n    // your code here\n  }\n  findMedian(): number {\n    return 0\n  }\n}\n',
    harness: 'class-design',
    tests: [
      {
        args: [
          ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'],
          [[], [1], [2], [], [3], []],
        ],
        expected: [null, null, null, 1.5, null, 2],
        label: 'example sequence',
      },
      {
        args: [
          ['MedianFinder', 'addNum', 'findMedian'],
          [[], [5], []],
        ],
        expected: [null, null, 5],
        label: 'single element',
      },
      {
        args: [
          ['MedianFinder', 'addNum', 'addNum', 'addNum', 'addNum', 'findMedian'],
          [[], [1], [2], [3], [4], []],
        ],
        expected: [null, null, null, null, null, 2.5],
        label: 'four elements even split',
      },
      {
        args: [
          ['MedianFinder', 'addNum', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'],
          [[], [-1], [-2], [-3], [], [-4], []],
        ],
        expected: [null, null, null, null, -2, null, -2.5],
        label: 'negative numbers',
        hidden: true,
      },
      {
        args: [
          ['MedianFinder', 'addNum', 'findMedian', 'addNum', 'findMedian', 'addNum', 'findMedian'],
          [[], [3], [], [1], [], [2], []],
        ],
        expected: [null, null, 3, null, 2, null, 2],
        label: 'descending arrival order',
        hidden: true,
      },
      {
        args: [
          ['MedianFinder', 'addNum', 'addNum', 'addNum', 'addNum', 'addNum', 'findMedian'],
          [[], [5], [5], [5], [5], [5], []],
        ],
        expected: [null, null, null, null, null, null, 5],
        label: 'duplicate values',
        hidden: true,
      },
    ],
    referenceSolution:
      'export class MedianFinder {\n  private lower = new MinHeap<number>()\n  private upper = new MinHeap<number>()\n\n  addNum(num: number): void {\n    this.lower.push(-num, num)\n    const moved = this.lower.pop()!\n    this.upper.push(moved, moved)\n    if (this.upper.size > this.lower.size) {\n      const back = this.upper.pop()!\n      this.lower.push(-back, back)\n    }\n  }\n\n  findMedian(): number {\n    if (this.lower.size > this.upper.size) return this.lower.peek()!\n    return (this.lower.peek()! + this.upper.peek()!) / 2\n  }\n}\n',
    complexity: { time: 'O(log n) per addNum, O(1) per findMedian', space: 'O(n)' },
  },
}
