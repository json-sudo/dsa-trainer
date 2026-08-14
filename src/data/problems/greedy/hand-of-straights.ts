import type { Problem } from '../../types'

export const handOfStraights: Problem = {
  id: 'hand-of-straights',
  leetcodeId: 846,
  title: 'Hand of Straights',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'greedy',
  authored: true,
  statement:
    'Given an array `hand` of card values and an integer `groupSize`, return `true` if the cards can be rearranged into groups of exactly `groupSize` **consecutive** cards.',
  examples: [
    { input: 'hand = [1,2,3,6,2,3,4,7,8], groupSize = 3', output: 'true', explanation: '[1,2,3], [2,3,4], [6,7,8].' },
    { input: 'hand = [1,2,3,4,5], groupSize = 4', output: 'false', explanation: '5 cards can\'t form groups of 4.' },
  ],
  constraints: ['1 <= hand.length <= 10^4', '0 <= hand[i] <= 10^9', '1 <= groupSize <= hand.length'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: card values (duplicates common, values to 10⁹) and a group size. Output: boolean partitionability into consecutive runs. Divisibility of the count is an instant pre-check.',
      rubric: ['Divisibility pre-check named', 'Duplicates as the working difficulty'],
    },
    whatToFind: {
      modelAnswer: 'Whether a perfect partition into fixed-length consecutive runs exists — a constructive feasibility question over *counts* of each value.',
      rubric: ['Partition feasibility framing', 'Counts (not positions) are the state'],
    },
    constraintsHint: {
      modelAnswer:
        'Values to 10⁹ kill any counting-array indexed by value; a frequency map + sorted distinct values is the shape. n ≤ 10⁴ → O(n log n) budget from sorting.',
      rubric: ['Value range forces a map over an array', 'Sort-based budget'],
    },
    bruteForce: {
      modelAnswer:
        'Backtracking: repeatedly pick any remaining card, try to build its group, undo on failure: exponential branching over which card starts which group.',
      rubric: ['Backtracking over group choices', 'Exponential blowup named'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The search explores orderings that can\'t matter: the *smallest* remaining card has no choice — it must start a group (nothing smaller can cover it). Forced moves cascade: take the min, consume a run from its count upward; any missing count fails immediately. Pattern: Greedy + Freq Map.',
      rubric: ['Forced-move argument for the minimum card', 'Count-consumption cascade'],
      acceptedPatterns: ['greedy', 'freq-map'],
    },
    algorithm: {
      modelAnswer:
        'If n % groupSize ≠ 0 → false. Count into a map; sort distinct values. For each value v in order, while count[v] > 0: let c = count[v]; for w in v..v+groupSize−1, count[w] must be ≥ c → subtract c (batch-consume all c groups starting at v). Fail on shortfall. Time O(n log n), space O(n).',
      rubric: [
        'Divisibility gate',
        'Batch consumption (c groups at once) from each starting value',
        'States O(n log n)/O(n)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Backtracking over which card starts which group is exponential — but the smallest remaining card has no freedom: it must begin a run. That forced move makes greedy safe: sort the distinct values, and for each with cards left, consume full runs upward in the frequency map, failing on any gap. Time O(n log n), space O(n), after the obvious divisibility check.',
      rubric: ['Template followed with the forced-move proof', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function isNStraightHand(hand: number[], groupSize: number): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 2, 3, 6, 2, 3, 4, 7, 8], 3], expected: true, label: 'example' },
      { args: [[1, 2, 3, 4, 5], 4], expected: false, label: 'indivisible count' },
      { args: [[1, 1, 2, 2, 3, 3], 3], expected: true, label: 'interleaved duplicates' },
      { args: [[1, 1, 2, 3], 2], expected: false, label: 'missing partner', hidden: true },
      { args: [[42], 1], expected: true, label: 'groups of one', hidden: true },
      { args: [[8, 10, 12], 3], expected: false, label: 'gaps break runs', hidden: true },
    ],
    referenceSolution:
      'export function isNStraightHand(hand: number[], groupSize: number): boolean {\n  if (hand.length % groupSize !== 0) return false\n  const counts = new Map<number, number>()\n  for (const card of hand) counts.set(card, (counts.get(card) ?? 0) + 1)\n  const values = [...counts.keys()].sort((a, b) => a - b)\n  for (const v of values) {\n    const c = counts.get(v)!\n    if (c === 0) continue\n    for (let w = v; w < v + groupSize; w++) {\n      const have = counts.get(w) ?? 0\n      if (have < c) return false\n      counts.set(w, have - c)\n    }\n  }\n  return true\n}\n',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
  },
}
