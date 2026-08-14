import type { Problem } from '../../types'

export const kokoEatingBananas: Problem = {
  id: 'koko-eating-bananas',
  leetcodeId: 875,
  title: 'Koko Eating Bananas',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'binary-search',
  authored: true,
  statement:
    'Koko has `piles` of bananas and `h` hours. Each hour she picks one pile and eats up to `k` bananas from it (a pile smaller than `k` still consumes the whole hour). Return the **minimum** integer eating speed `k` that finishes every pile within `h` hours.',
  examples: [
    { input: 'piles = [3,6,7,11], h = 8', output: '4' },
    { input: 'piles = [30,11,23,4,20], h = 5', output: '30' },
    { input: 'piles = [30,11,23,4,20], h = 6', output: '23' },
  ],
  constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: pile sizes (up to 10⁴ piles, sizes to 10⁹) and an hour budget h. Output: one integer — the minimum speed k. Hours per pile at speed k is ceil(pile / k).',
      rubric: ['States the ceil(pile/k) cost model', 'Output is the minimal feasible k'],
      teachingNote:
        'Nothing here is sorted and nothing is an index — yet this is a binary-search problem. Note at the I/O stage that the *answer* is a number in a known range [1, max(piles)]. That range is your search space.',
    },
    whatToFind: {
      modelAnswer: 'The minimum value of k satisfying a feasibility condition (total hours ≤ h). A min-search over a numeric parameter, not over the array.',
      rubric: ['Identifies minimize-a-parameter-under-feasibility', 'Search space is k values, not array positions'],
      teachingNote:
        '"Minimum X such that condition holds" is the search-on-answer tell. The array is only consulted to *evaluate* a candidate, never searched itself.',
    },
    constraintsHint: {
      modelAnswer:
        'k ranges to 10⁹ → can\'t try every speed. Feasibility check is O(n) = 10⁴. 10⁹ candidates × 10⁴ is hopeless linearly, but log₂(10⁹) ≈ 30 checks × 10⁴ = 3×10⁵ — trivially fast if I can binary search.',
      rubric: ['Rules out linear scan of speeds via the 10⁹ range', 'Computes the ~30-probe log budget'],
      teachingNote:
        'The give-away pair: a *huge numeric range* for the answer plus a *cheap feasibility check*. Whenever you see bounds like 10⁹ on a parameter, ask "is feasibility monotone in this parameter?"',
    },
    bruteForce: {
      modelAnswer: 'Try k = 1, 2, 3, … computing total hours for each until one fits: O(max(piles) · n) — up to 10¹³ operations. Correct, absurdly slow.',
      rubric: ['Increasing-k linear scan', 'States O(maxPile · n)', 'Notes it is far over budget'],
      teachingNote:
        'Even a hopeless brute force earns credit for defining the *feasibility function* — hours(k) = Σ ceil(pile/k) ≤ h. Write that function first; the optimization is just how you probe it.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Feasibility is monotone: if speed k works, every speed above k works too. The linear scan wastes probes on speeds a single comparison could eliminate wholesale — halving the range each time keeps all the information. Pattern: Binary Search (on the answer).',
      rubric: ['States the monotonicity of feasible(k) explicitly', 'Halving eliminates half the candidates per probe'],
      acceptedPatterns: ['binary-search'],
      teachingNote:
        'Monotone feasibility is the *license* for binary search on the answer — always say it before claiming the pattern. If feasibility weren\'t monotone, halving would be unsound.',
    },
    algorithm: {
      modelAnswer:
        'lo = 1, hi = max(piles). While lo < hi: mid = ⌊(lo+hi)/2⌋; if Σ ceil(pile/mid) ≤ h, the answer is mid or lower → hi = mid; else lo = mid + 1. Return lo. Invariant: the answer is always in [lo, hi]. Time O(n log maxPile), space O(1).',
      rubric: [
        'Correct lo/hi bounds and the feasible→hi=mid branch',
        'States the invariant (answer within [lo, hi])',
        'States O(n log maxPile)',
      ],
      teachingNote:
        'The lower-bound template (hi = mid on success, lo = mid + 1 on failure, loop while lo < hi) lands exactly on the minimal feasible value with no off-by-one. Memorize this one shape and derive the rest.',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be trying every speed from 1 upward — O(maxPile · n), up to 10¹³ operations. This looks like binary search on the answer because feasibility is monotone in the speed: if k works, k+1 works. I\'ll search [1, max(piles)], probing with an O(n) hours check, keeping the invariant that the answer stays inside my range. Time O(n log maxPile), space O(1).',
      rubric: ['Template followed with monotonicity stated as the license', 'Complexity stated'],
      teachingNote:
        'Interviewers grade search-on-answer scripts on one word: *monotone*. Say it explicitly; it is the entire proof.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Write the feasibility check first — hours needed at speed k',
      code: 'const hoursAt = (k: number) => {\n  let hours = 0\n  for (const pile of piles) hours += Math.ceil(pile / k)   // partial pile still costs a full hour\n  return hours\n}',
    },
    {
      label: '2. Bound the answer space',
      code: 'let lo = 1                     // slowest possible speed\nlet hi = Math.max(...piles)    // any faster than the biggest pile is wasted',
    },
    {
      label: '3. Lower-bound binary search on the monotone predicate',
      code: 'while (lo < hi) {\n  const mid = Math.floor((lo + hi) / 2)\n  if (hoursAt(mid) <= h) hi = mid   // mid works -> answer is mid or lower\n  else lo = mid + 1                 // mid fails -> answer is above\n}\nreturn lo                           // smallest feasible speed',
    },
  ],
  code: {
    signature: 'export function minEatingSpeed(piles: number[], h: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[3, 6, 7, 11], 8], expected: 4, label: 'example' },
      { args: [[30, 11, 23, 4, 20], 5], expected: 30, label: 'hours equal piles' },
      { args: [[30, 11, 23, 4, 20], 6], expected: 23, label: 'one spare hour' },
      { args: [[1000000000], 2], expected: 500000000, label: 'single huge pile', hidden: true },
      { args: [[1], 1000000000], expected: 1, label: 'tiny pile, huge budget', hidden: true },
      { args: [[312884470], 968709470], expected: 1, label: 'overflow-ish bounds', hidden: true },
    ],
    referenceSolution:
      'export function minEatingSpeed(piles: number[], h: number): number {\n  let lo = 1\n  let hi = Math.max(...piles)\n  const hoursAt = (k: number) => {\n    let hours = 0\n    for (const pile of piles) hours += Math.ceil(pile / k)\n    return hours\n  }\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2)\n    if (hoursAt(mid) <= h) hi = mid\n    else lo = mid + 1\n  }\n  return lo\n}\n',
    complexity: { time: 'O(n log maxPile)', space: 'O(1)' },
  },
}
