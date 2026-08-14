import type { Problem } from '../../types'

export const combinationSum: Problem = {
  id: 'combination-sum',
  leetcodeId: 39,
  title: 'Combination Sum',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'backtracking',
  authored: true,
  statement:
    'Given an array of **distinct** positive integers `candidates` and a target `target`, return all unique combinations of `candidates` that sum to `target`, in any order. The same number may be chosen from `candidates` an **unlimited** number of times; two combinations are unique if the frequency of any candidate differs.',
  examples: [
    { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
    { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' },
  ],
  constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', 'all candidates distinct', '1 <= target <= 40', 'unlimited reuse per candidate'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a set of distinct positive candidates and a target sum, reuse unlimited. Output: every multiset of candidates summing exactly to target, no duplicate combinations (order within a combination doesn\'t matter, only the multiset of values).',
      rubric: ['Unlimited reuse per candidate registered', 'No duplicate combinations by value-multiset'],
      teachingNote:
        'Say "multiset" out loud, not "array" — [2,2,3] and [2,3,2] are the same combination. That word choice is what prevents an accidental permutation-generating bug.',
    },
    whatToFind: {
      modelAnswer: 'Enumerate every way to build target as a sum of candidates, where each candidate can repeat, without generating the same multiset twice.',
      rubric: ['Sum-construction framing', 'Dedup-by-multiset requirement named'],
      teachingNote:
        'This is Subsets\' choose/recurse/un-choose skeleton, plus two new moves: allow revisiting the same index (reuse), and stop early once the running sum exceeds target (pruning).',
    },
    constraintsHint: {
      modelAnswer:
        'target <= 40, candidates[i] >= 2, so depth is bounded (<=20 picks of the smallest candidate). len(candidates) <= 30 keeps branching modest. No time limit forces cleverness — pure backtracking with sum-pruning is intended.',
      rubric: ['Depth bound derived from target / min candidate', 'Reads bounds as backtracking-with-pruning license'],
      teachingNote:
        'target/min(candidates) bounds recursion depth — a quick way to sanity-check a backtracking solution won\'t blow the stack or run forever, even before coding it.',
    },
    bruteForce: {
      modelAnswer:
        'Try every possible reuse-count sequence up to target via unrestricted recursion (recurse into all candidates from index 0 at every step, not just from the current index onward): correct, but generates permutations of the same multiset repeatedly — [2,3] and [3,2] both produced then need dedup.',
      rubric: ['Unrestricted (permutation-style) recursion baseline', 'Notes it produces value-duplicate combinations needing post-hoc dedup'],
      teachingNote:
        'Naming the *specific* flaw — "recursing from index 0 every time re-derives permutations" — is more convincing than a vague "it\'s inefficient". Be precise about where the duplication comes from.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The waste is regenerating the same multiset in every order and then filtering duplicates after the fact. Fix at generation time: only recurse into candidates at index >= the current index, so combinations are built in non-decreasing index order — each multiset is produced exactly once. Allow reuse by recursing with the *same* index (not i+1) when picking candidates[i] again. Pattern: Backtracking.',
      rubric: ['Waste: permutation regeneration + post-filter', 'Fix: non-decreasing index order eliminates duplicates at the source'],
      acceptedPatterns: ['backtracking'],
      teachingNote:
        'The single index-order rule ("never go back to an earlier index") is the load-bearing idea of this whole family (Combination Sum I/II/III, Subsets). Isolate it explicitly — it\'s worth more than the code around it.',
    },
    algorithm: {
      modelAnswer:
        'Sort candidates (enables early pruning, optional but clean). dfs(start, remaining, path): if remaining === 0, record [...path]; if remaining < 0 or start === n, return. For i from start to n−1: if candidates[i] > remaining, break (sorted → nothing further fits); push candidates[i]; dfs(i, remaining − candidates[i], path) — note same i, allowing reuse; pop. Time O(target^(target/min)) worst case, bounded by problem size.',
      rubric: [
        'start index prevents duplicate multisets; recursing with same i allows reuse',
        'remaining === 0 records, remaining < 0 (or sorted break) prunes',
        'Push/recurse/pop discipline with the copy on record',
      ],
      teachingNote:
        'Sorting first turns "skip candidates that overshoot" into an early `break` instead of a `continue` — a small win that meaningfully prunes wide branches once remaining gets small.',
    },
    interviewScript: {
      modelAnswer:
        'Naively recursing into every candidate at every step regenerates each valid multiset in every order — a permutation-style blowup that then needs dedup. I\'ll fix that at generation time: only ever advance the start index forward or stay put, never go back — staying put on the same index is what allows reuse of a candidate, advancing it is what guarantees non-decreasing order and thus no duplicate combinations. Base cases: remaining hits 0 → record the path; goes negative → prune. Sorting first lets me break early once a candidate overshoots. Time is bounded by target and the smallest candidate, space O(target) for recursion depth.',
      rubric: ['Names the permutation-regeneration flaw and its index-order fix', 'States the reuse-via-same-index mechanism and the prune/record base cases'],
      teachingNote:
        'This script is the one to reuse verbatim (with tiny edits) for Combination Sum II and III — recognizing the family lets you answer follow-ups almost instantly.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Sort first, shared path + recursion skeleton',
      code: 'const sorted = [...candidates].sort((a, b) => a - b)   // enables early break once a candidate overshoots\nconst out: number[][] = []\nconst path: number[] = []\nconst dfs = (start: number, remaining: number) => {\n  // ...\n}',
    },
    {
      label: '2. Base cases: exact hit records, negative prunes',
      code: 'if (remaining === 0) {\n  out.push([...path])   // copy! path keeps mutating after this\n  return\n}\nif (remaining < 0) return   // overshoot -> dead branch',
    },
    {
      label: '3. Choose from start onward — same index allows reuse',
      code: 'for (let i = start; i < sorted.length; i++) {\n  if (sorted[i] > remaining) break        // sorted -> nothing further fits either\n  path.push(sorted[i])\n  dfs(i, remaining - sorted[i])            // i, not i+1: this candidate can repeat\n  path.pop()\n}',
    },
    {
      label: '4. Kick it off',
      code: 'dfs(0, target)\nreturn out',
    },
  ],
  code: {
    signature: 'export function combinationSum(candidates: number[], target: number): number[][] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]], label: 'example one' },
      { args: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]], label: 'example two' },
      { args: [[2], 1], expected: [], label: 'no combination possible' },
      { args: [[3], 9], expected: [[3, 3, 3]], label: 'single candidate reused', hidden: true },
      { args: [[2, 4], 4], expected: [[2, 2], [4]], label: 'exact single-candidate and pair', hidden: true },
      { args: [[5, 3, 2], 5], expected: [[2, 3], [5]], label: 'unsorted input order', hidden: true },
    ],
    referenceSolution:
      'export function combinationSum(candidates: number[], target: number): number[][] {\n  const sorted = [...candidates].sort((a, b) => a - b)\n  const out: number[][] = []\n  const path: number[] = []\n  const dfs = (start: number, remaining: number) => {\n    if (remaining === 0) {\n      out.push([...path])\n      return\n    }\n    if (remaining < 0) return\n    for (let i = start; i < sorted.length; i++) {\n      if (sorted[i] > remaining) break\n      path.push(sorted[i])\n      dfs(i, remaining - sorted[i])\n      path.pop()\n    }\n  }\n  dfs(0, target)\n  return out\n}\n',
    complexity: { time: 'O(target^(target / min(candidates)))', space: 'O(target / min(candidates)) recursion (output excluded)' },
  },
}
