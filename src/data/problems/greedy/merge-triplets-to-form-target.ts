import type { Problem } from '../../types'

export const mergeTripletsToFormTarget: Problem = {
  id: 'merge-triplets-to-form-target',
  leetcodeId: 1899,
  title: 'Merge Triplets to Form Target',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'greedy',
  authored: true,
  statement:
    'Given an array of `triplets`, where `triplets[i] = [x, y, z]`, and a `target = [x, y, z]`, you may repeatedly "merge" any two triplets by taking their elementwise maximum. Return true if you can choose some subset of the triplets and merge them (in any order) to form exactly `target`.',
  examples: [
    { input: 'triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]', output: 'true', explanation: 'Merge [2,5,3] and [1,7,5] to get [2,7,5].' },
    { input: 'triplets = [[3,4,5],[4,5,6]], target = [3,2,5]', output: 'false' },
    { input: 'triplets = [[2,5,3],[2,3,4],[1,2,5],[5,2,3]], target = [5,5,5]', output: 'true' },
  ],
  constraints: ['1 <= triplets.length <= 10^5', 'triplets[i].length === 3', '1 <= triplets[i][j], target[j] <= 1000'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 10⁵ triplets of three positive integers each, plus a target triplet. Output: a boolean — can some subset of the triplets, merged via elementwise max, produce exactly target.',
      rubric: ['Notes merge = elementwise max, and target must be matched exactly on all three coordinates', 'Notes the subset choice — not all triplets need to be used'],
    },
    whatToFind: {
      modelAnswer:
        'A per-coordinate coverage question: for the merge to land exactly on target, each of the three coordinates needs at least one surviving triplet whose value on that axis equals target\'s — and no surviving triplet can exceed target on any axis.',
      rubric: ['Identifies the per-axis "some triplet hits it exactly" requirement', 'Notes that exceeding target on any axis disqualifies a triplet']
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10⁵ rules out anything examining subsets (2^n) — the budget is a single O(n) scan. That points at a per-triplet local decision (keep or discard) rather than any combinatorial search over merge orders.',
      rubric: ['Rules out subset/combinatorial search from n ≤ 10⁵', 'Lands on an O(n) single-pass budget'],
    },
    bruteForce: {
      modelAnswer:
        'Try every subset of triplets, merge each subset (elementwise max), and check if any equals target. O(2^n) subsets, each merge O(n) — astronomically over budget for n up to 10⁵.',
      rubric: ['Describes subset enumeration + merge-and-compare', 'States the exponential cost'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Most subsets are wasted work: a triplet that exceeds target on any coordinate can never appear in a valid merge (max would push that axis past target), so it can be discarded up front without ever considering it in a subset. Among the rest, order and grouping don\'t matter — only whether each axis eventually gets hit exactly by some surviving triplet. Pattern: Greedy — filter invalid triplets, then track per-axis coverage in one pass.',
      rubric: ['Names the waste: subsets built from triplets that could never be valid', 'States the discard rule (any coordinate exceeding target disqualifies the triplet)'],
      acceptedPatterns: ['greedy'],
    },
    algorithm: {
      modelAnswer:
        'For each triplet [x, y, z]: if x > target[0] or y > target[1] or z > target[2], skip it — it can never be part of a valid merge. Otherwise, check which coordinates it matches exactly and mark those as "hit" (three booleans, or a hit-count). After scanning all triplets, return true iff all three coordinates have been hit by at least one surviving triplet. Time O(n), space O(1).',
      rubric: [
        'States the discard-if-exceeds-target filter',
        'States the per-axis exact-match tracking with three flags/counters',
        'Concludes true iff all three flags are set, and states O(n)/O(1)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would try every subset of triplets and merge them — O(2^n), impossible at n = 10⁵. This is a greedy problem: first, any triplet with a coordinate exceeding target can never be used, since elementwise max can only push a result up, never down — so I discard those immediately. Among the survivors, merging is really "for each axis, does some triplet hit it exactly" — order and grouping don\'t matter. I scan once, discard bad triplets, and mark which of the three target coordinates get hit exactly; true iff all three are covered. O(n) time, O(1) space.',
      rubric: ['Follows the script template end-to-end', 'States the discard rule and the per-axis coverage check with complexity'],
    },
  },
  code: {
    signature: 'export function mergeTriplets(triplets: number[][], target: number[]): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]], expected: true, label: 'example true' },
      { args: [[[3, 4, 5], [4, 5, 6]], [3, 2, 5]], expected: false, label: 'example false, no triplet ever hits 2' },
      { args: [[[2, 5, 3], [2, 3, 4], [1, 2, 5], [5, 2, 3]], [5, 5, 5]], expected: true, label: 'multiple survivors combine' },
      { args: [[[5, 5, 5]], [5, 5, 5]], expected: true, label: 'single triplet exactly equals target', hidden: true },
      { args: [[[6, 5, 5]], [5, 5, 5]], expected: false, label: 'one axis exceeds target, whole triplet discarded', hidden: true },
      { args: [[[1, 1, 1], [1, 1, 1]], [1, 1, 2]], expected: false, label: 'no triplet ever hits the third axis', hidden: true },
    ],
    referenceSolution:
      'export function mergeTriplets(triplets: number[][], target: number[]): boolean {\n  let hitX = false\n  let hitY = false\n  let hitZ = false\n  for (const [x, y, z] of triplets) {\n    if (x > target[0] || y > target[1] || z > target[2]) continue\n    if (x === target[0]) hitX = true\n    if (y === target[1]) hitY = true\n    if (z === target[2]) hitZ = true\n  }\n  return hitX && hitY && hitZ\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
