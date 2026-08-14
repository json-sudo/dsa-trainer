import type { Problem } from '../../types'

export const lastStoneWeight: Problem = {
  id: 'last-stone-weight',
  leetcodeId: 1046,
  title: 'Last Stone Weight',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'heap',
  authored: true,
  statement:
    'You have `stones` with positive weights. Each turn, smash the two **heaviest** together: equal weights → both destroyed; else the heavier survives with the difference. Return the last stone\'s weight, or `0` if none remain.',
  examples: [
    { input: 'stones = [2,7,4,1,8,1]', output: '1', explanation: '8&7→1, 4&2→2, 2&1→1, 1&1→0, leaving [1].' },
    { input: 'stones = [1]', output: '1' },
  ],
  constraints: ['1 <= stones.length <= 30', '1 <= stones[i] <= 1000'],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: up to 30 positive weights. Output: one number (0 if everything annihilates). The process repeatedly consumes the two current maxima.',
      rubric: ['Simulation consuming two maxima per round', '0 sentinel for empty end state'],
    },
    whatToFind: {
      modelAnswer: 'Simulate to termination — the answer is whatever the process leaves. The only real question is how to fetch "two largest" efficiently as the multiset mutates.',
      rubric: ['Identifies simulation (no closed form)', 'Repeated dynamic max extraction is the crux'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 30 — even repeated re-sorting passes. The problem is a *technique* rehearsal: a mutating collection with repeated extract-max is the priority queue\'s home turf.',
      rubric: ['Notes any approach passes at this size', 'Reads it as a priority-queue drill'],
    },
    bruteForce: {
      modelAnswer: 'Each round, sort (or scan twice) to find the two heaviest, smash, reinsert: O(n² log n) with re-sorting. Fine at n = 30, wasteful in principle.',
      rubric: ['Re-sort/rescan per round', 'States the complexity', 'Acknowledges it passes here'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Re-sorting rebuilds total order after a change that displaced at most one element — the collection is *almost* the same each round. A heap maintains exactly the needed invariant (max on top) under insertion and removal in O(log n). Pattern: Heap. (Max-heap via negated keys on the MinHeap utility.)',
      rubric: ['Waste: full reorder after a one-element change', 'Heap maintains the invariant incrementally'],
      acceptedPatterns: ['heap'],
    },
    algorithm: {
      modelAnswer:
        'Push all weights with negated keys (max-heap). While size ≥ 2: pop two → a ≥ b; if a ≠ b push a − b. Return the remaining element or 0. Time O(n log n), space O(n).',
      rubric: ['Negated-key max-heap trick', 'Smash-and-reinsert loop with the equal case', 'States O(n log n)/O(n)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be re-sorting every round to find the two heaviest — rebuilding total order after a single change. This is the textbook priority-queue situation: I only ever need the current maximum, under inserts and removals. I\'ll keep a max-heap (min-heap with negated keys), popping two and pushing back the difference until one or zero stones remain. Time O(n log n), space O(n).',
      rubric: ['Template followed with the incremental-invariant insight', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function lastStoneWeight(stones: number[]): number {\n  // MinHeap is available: push(key, value), pop(), peek(), peekKey(), size\n}\n',
    harness: 'plain',
    tests: [
      { args: [[2, 7, 4, 1, 8, 1]], expected: 1, label: 'example' },
      { args: [[1]], expected: 1, label: 'single stone' },
      { args: [[3, 3]], expected: 0, label: 'mutual annihilation' },
      { args: [[10, 4]], expected: 6, label: 'two unequal', hidden: true },
      { args: [[1, 1, 1]], expected: 1, label: 'odd equal stones', hidden: true },
      { args: [[1000, 999, 999, 1000]], expected: 0, label: 'pairs cancel', hidden: true },
    ],
    referenceSolution:
      'export function lastStoneWeight(stones: number[]): number {\n  const heap = new MinHeap<number>()\n  for (const s of stones) heap.push(-s, s)\n  while (heap.size >= 2) {\n    const a = heap.pop()!\n    const b = heap.pop()!\n    if (a !== b) heap.push(-(a - b), a - b)\n  }\n  return heap.size === 1 ? heap.peek()! : 0\n}\n',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
  },
}
