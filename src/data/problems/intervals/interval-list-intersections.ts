import type { Problem } from '../../types'

export const intervalListIntersections: Problem = {
  id: 'interval-list-intersections',
  leetcodeId: 986,
  title: 'Interval List Intersections',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'intervals',
  authored: true,
  statement:
    'Given two lists of closed intervals, `firstList` and `secondList`, where each list is already sorted by start time and each list\'s own intervals are pairwise disjoint, return the sorted list of intervals representing the intersection of the two lists.',
  examples: [
    {
      input: 'firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]',
      output: '[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]',
    },
    { input: 'firstList = [[1,3],[5,9]], secondList = []', output: '[]' },
    { input: 'firstList = [[1,7]], secondList = [[3,10]]', output: '[[3,7]]' },
  ],
  constraints: ['0 <= firstList.length, secondList.length <= 1000', 'firstList[i].length === secondList[i].length === 2', 'each list is sorted by start and internally disjoint'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two lists (up to 1000 intervals each), each already sorted by start and internally non-overlapping. Output: the sorted list of intersection intervals between the two lists.',
      rubric: ['Notes both lists are pre-sorted and internally disjoint — a structural gift to exploit', 'Output is the intersection intervals, in order'],
    },
    whatToFind: {
      modelAnswer:
        'For every pair of intervals across the two lists that overlap, compute their overlap region. It\'s an exhaustive-but-structured pairing problem, not a single existence check.',
      rubric: ['Identifies the need to find all overlapping pairs and their overlap regions', 'Notes it is exhaustive across both lists, not a single answer'],
    },
    constraintsHint: {
      modelAnswer:
        'n, m ≤ 1000 makes an O(n·m) all-pairs check (10⁶) technically survivable, but the sorted structure of both lists screams O(n+m): since both lists are sorted by start, I never need to re-compare an interval against ones I\'ve already fully passed.',
      rubric: ['Notes O(n·m) is survivable but wasteful given the sorted structure', 'Derives the O(n+m) budget from "already sorted, use it"'],
    },
    bruteForce: {
      modelAnswer:
        'For every interval in firstList, scan all of secondList checking for overlap ([lo,hi] = [max(starts), min(ends)], valid if lo <= hi) and collect hits. O(n·m) time, O(1) extra space beyond output.',
      rubric: ['Describes the nested-loop overlap check', 'States O(n·m) time'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The nested scan keeps re-checking secondList intervals that already ended before the current firstList interval even started, or that start well past where firstList is looking — both lists being sorted means I can walk them with two pointers, only ever comparing the current front of each. Pattern: Two Pointers.',
      rubric: ['Names the waste: re-scanning intervals that are provably too early or too late given sortedness', 'Proposes a two-pointer walk over both lists in lockstep'],
      acceptedPatterns: ['two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'Two pointers i (into firstList) and j (into secondList), both starting at 0. While both in bounds: let a = firstList[i], b = secondList[j]; compute lo = max(a[0], b[0]), hi = min(a[1], b[1]); if lo <= hi, push [lo, hi] to the result — that\'s a valid intersection. Then advance whichever interval ends first: if a[1] < b[1], i++, else j++ (advance both on a tie). The interval with the smaller end can never intersect anything further in the other list, so it\'s safe to retire. Time O(n+m), space O(1) extra.',
      rubric: [
        'States the lo/hi overlap formula and the "push if lo <= hi" check',
        'States the correct advance rule: retire whichever interval ends first',
        'States O(n+m) time',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force checks every pair across both lists — O(n·m), which works at these bounds but ignores that both lists are already sorted by start. That sortedness makes this a two-pointers problem: I walk one pointer through each list, and at each step compute the overlap of the current pair as [max(starts), min(ends)] — if that range is valid I emit it. Then I advance whichever of the two current intervals ends first, since it can\'t possibly overlap anything later in the other list. One pass through both lists together, O(n+m) time, O(1) extra space.',
      rubric: ['Follows the script template end-to-end', 'States the overlap formula and advance rule with correct complexity'],
    },
  },
  code: {
    signature: 'export function intervalIntersection(firstList: number[][], secondList: number[][]): number[][] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [[[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]]],
        expected: [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]],
        label: 'example',
      },
      { args: [[[1, 3], [5, 9]], []], expected: [], label: 'empty second list' },
      { args: [[[1, 7]], [[3, 10]]], expected: [[3, 7]], label: 'single overlapping pair' },
      { args: [[], []], expected: [], label: 'both empty', hidden: true },
      { args: [[[1, 3], [5, 7]], [[2, 2]]], expected: [[2, 2]], label: 'single-point intersection', hidden: true },
      { args: [[[1, 2]], [[3, 4]]], expected: [], label: 'no overlap at all', hidden: true },
    ],
    referenceSolution:
      'export function intervalIntersection(firstList: number[][], secondList: number[][]): number[][] {\n  const result: number[][] = []\n  let i = 0\n  let j = 0\n  while (i < firstList.length && j < secondList.length) {\n    const a = firstList[i]\n    const b = secondList[j]\n    const lo = Math.max(a[0], b[0])\n    const hi = Math.min(a[1], b[1])\n    if (lo <= hi) result.push([lo, hi])\n    if (a[1] < b[1]) i++\n    else j++\n  }\n  return result\n}\n',
    complexity: { time: 'O(n + m)', space: 'O(1) extra (output excluded)' },
  },
}
