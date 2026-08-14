import type { Problem } from '../../types'

export const gasStation: Problem = {
  id: 'gas-station',
  leetcodeId: 134,
  title: 'Gas Station',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'greedy',
  authored: true,
  statement:
    'There are `n` gas stations in a circle. `gas[i]` is the fuel at station i; `cost[i]` is the fuel needed to travel from station i to station i+1. Starting with an empty tank at some station, return the **starting station index** that lets you complete the circuit once, or `-1` if none exists. If a solution exists, it is guaranteed unique.',
  examples: [
    { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3', explanation: 'Start at station 3: 4-1+5=8→5, 5-2+1=4→2, 2-3+2=1→3, 3-4+3=2→4, 4-5+4=3, back to 3 with fuel to spare.' },
    { input: 'gas = [2,3,4], cost = [3,4,3]', output: '-1', explanation: 'Total gas (9) < total cost (10) — impossible from anywhere.' },
  ],
  constraints: ['n == gas.length == cost.length', '1 <= n <= 10^5', '0 <= gas[i], cost[i] <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two parallel arrays gas[] and cost[] over a circular route of n stations. Output: the unique feasible starting index, or -1. "Complete the circuit" means the running tank never goes negative for a full lap starting there.',
      rubric: ['Circular route + parallel arrays understood', 'Feasibility = tank never negative for the whole lap'],
      teachingNote:
        'Get the candidate to state the circularity explicitly — station i+1 wraps to 0 after n-1 — since that\'s what makes naive per-start simulation O(n²) instead of O(n).',
    },
    whatToFind: {
      modelAnswer:
        'A starting index s such that the prefix sums of (gas[i] - cost[i]), taken in circular order from s, never dip below zero. Equivalently, find the starting point after which the cumulative net-fuel curve stays non-negative throughout the lap.',
      rubric: ['Frames it as a running-sum-never-negative condition', 'Ties feasibility to net = gas[i] - cost[i] per station'],
      teachingNote:
        'Reducing gas/cost to a single net array per station is the key reframing — from here it looks like "find the rotation of an array whose prefix sums stay non-negative", a much more familiar shape.',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10^5 rules out the O(n²) "try every start, simulate the full lap" approach — that\'s up to 10^10 operations. Need O(n). Values are non-negative and bounded, so no overflow concerns; the structure has to come from a smarter single pass.',
      rubric: ['O(n^2) explicitly ruled out by n up to 10^5', 'Signals need for a single O(n) pass'],
      teachingNote:
        '10^5 squared is the loudest possible hint toward linear or n log n — say the arithmetic out loud, it\'s a fast way to justify the pivot to greedy.',
    },
    bruteForce: {
      modelAnswer:
        'Try every station as a start; simulate a full lap, tracking tank = 0 and adding gas[i]-cost[i] at each step, failing if it ever goes negative. O(n) per start, O(n) starts → O(n²) total.',
      rubric: ['Full-lap simulation per candidate start described', 'States O(n^2)'],
      teachingNote:
        'This is the natural first instinct and is worth stating cleanly before optimizing — it also doubles as the correctness definition the greedy solution must match.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Re-simulating from scratch at every candidate start re-derives information already known: if starting at s fails at station f (tank first goes negative there), then *no* station between s and f can be a valid start either — each of them enters f\'s failure with an equal-or-worse deficit, since the segment from s to that station only added non-negative-then-failing net fuel. So on failure, jump the candidate straight past f. Track one running total across the whole array; whenever it dips negative, reset candidate = next station and reset the running tank to 0. Pattern: one-pass greedy with a global feasibility check.',
      rubric: [
        'Waste: reprocessing stations already known to be infeasible starts',
        'States the "no start between s and f works" argument',
      ],
      acceptedPatterns: ['greedy', 'one-pass'],
      teachingNote:
        'The "no station strictly between s and the failure point can be a valid start" claim is the load-bearing proof of this whole algorithm — if the candidate can\'t articulate *why*, they\'re pattern-matching, not understanding.',
    },
    algorithm: {
      modelAnswer:
        'First check feasibility globally: if sum(gas) < sum(cost), return -1 (total fuel can\'t cover total cost regardless of start). Otherwise walk once: totalTank = 0, currentTank = 0, start = 0. For each i: diff = gas[i]-cost[i]; totalTank += diff; currentTank += diff; if currentTank < 0, set start = i+1 and currentTank = 0 (abandon this segment as a candidate). After the loop, if totalTank >= 0, return start (guaranteed unique and correct), else -1.',
      rubric: [
        'Global sum(gas) < sum(cost) short-circuit check',
        'Single pass with candidate reset on negative currentTank',
        'Returns start only after confirming feasibility via totalTank',
      ],
      teachingNote:
        'Note the two-total trick: totalTank answers "is *any* start feasible at all", currentTank answers "is *this* candidate segment surviving" — conflating them is the most common bug.',
    },
    interviewScript: {
      modelAnswer:
        'Feasibility only depends on prefix sums of gas[i]-cost[i] around the circle staying non-negative, so brute force would simulate a full lap from every start — O(n²), too slow for n up to 10^5. The key insight: if a running tank starting at s first goes negative at station f, no station strictly between s and f can be a valid start either, since each starts that segment with an equal-or-worse deficit. So one pass suffices: reset the candidate start right after any point the running tank goes negative, and separately track the total sum across the whole route to confirm feasibility exists at all. O(n) time, O(1) space.',
      rubric: ['Template followed: waste named, greedy reset argument stated', 'Complexity given'],
      teachingNote:
        'This script is a good rep for "prove the greedy is safe before presenting it" — interviewers specifically probe this problem for whether the candidate can justify the reset rule, not just recite it.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Global feasibility gate: total gas must cover total cost',
      code: 'let totalTank = 0\nlet currentTank = 0\nlet start = 0',
    },
    {
      label: '2. One pass, tracking both the global total and the current segment',
      code: 'for (let i = 0; i < gas.length; i++) {\n  const diff = gas[i] - cost[i]\n  totalTank += diff\n  currentTank += diff',
    },
    {
      label: '3. On a deficit, abandon this segment — no station before the failure point could have worked either',
      code: '  if (currentTank < 0) {\n    start = i + 1        // next station becomes the new candidate\n    currentTank = 0       // fresh segment starts clean\n  }\n}',
    },
    {
      label: '4. Feasible only if the whole-route total is non-negative',
      code: 'return totalTank >= 0 ? start : -1',
    },
  ],
  code: {
    signature: 'export function canCompleteCircuit(gas: number[], cost: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3, label: 'example unique solution' },
      { args: [[2, 3, 4], [3, 4, 3]], expected: -1, label: 'total gas below total cost' },
      { args: [[5], [4]], expected: 0, label: 'single station feasible' },
      { args: [[3], [4]], expected: -1, label: 'single station infeasible', hidden: true },
      { args: [[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]], expected: 4, label: 'deficit forces a late reset', hidden: true },
      { args: [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]], expected: 0, label: 'exactly-break-even every station', hidden: true },
    ],
    referenceSolution:
      'export function canCompleteCircuit(gas: number[], cost: number[]): number {\n  let totalTank = 0\n  let currentTank = 0\n  let start = 0\n  for (let i = 0; i < gas.length; i++) {\n    const diff = gas[i] - cost[i]\n    totalTank += diff\n    currentTank += diff\n    if (currentTank < 0) {\n      start = i + 1\n      currentTank = 0\n    }\n  }\n  return totalTank >= 0 ? start : -1\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
