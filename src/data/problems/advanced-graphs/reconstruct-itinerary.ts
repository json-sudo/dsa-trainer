import type { Problem } from '../../types'

export const reconstructItinerary: Problem = {
  id: 'reconstruct-itinerary',
  leetcodeId: 332,
  title: 'Reconstruct Itinerary',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'advanced-graphs',
  authored: true,
  statement:
    'You are given a list of airline `tickets`, each `[from, to]`, all departing from `"JFK"`-reachable itineraries. Reconstruct and return the itinerary that uses every ticket exactly once, starting at `"JFK"`. If multiple valid itineraries exist, return the one that is lexicographically smallest when read as a sequence of airport codes. It is guaranteed a valid itinerary using every ticket exists.',
  examples: [
    { input: 'tickets = [["MUC","LHR"],["JFK","MUC"],["LHR","SFO"],["SFO","SJC"]]', output: '["JFK","MUC","LHR","SFO","SJC"]' },
    {
      input: 'tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]',
      output: '["JFK","ATL","JFK","SFO","ATL","SFO"]',
      explanation: 'Another valid itinerary is ["JFK","SFO","ATL","JFK","ATL","SFO"] but it is larger lexicographically.',
    },
    { input: 'tickets = [["JFK","A"],["A","JFK"]]', output: '["JFK","A","JFK"]' },
  ],
  constraints: [
    '1 <= tickets.length <= 300',
    'every from and to is a 3-letter uppercase airport code',
    'a valid itinerary using every ticket exists',
    'itinerary must start at "JFK"',
  ],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 300 directed edges (tickets), each usable exactly once, guaranteed to admit at least one itinerary starting at "JFK" that uses all of them. Output: the specific itinerary (array of airport codes, length = tickets.length + 1) that is lexicographically smallest among all valid ones.',
      rubric: ['Notes every ticket must be used exactly once (not "a" path, "the" full traversal)', 'Notes the tie-break is lexicographic smallest'],
    },
    whatToFind: {
      modelAnswer:
        'This is an Eulerian path problem: find a walk starting at JFK that traverses every edge exactly once. Among all such walks, the constraints guarantee at least one exists; we additionally need the lexicographically smallest one.',
      rubric: [
        'Identifies it as an Eulerian-path traversal (use every edge once), not a shortest-path or simple-path search',
        'Notes the search space is orderings of ticket usage, tie-broken lexicographically',
      ],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 300 tickets means brute-force permutation search over orderings is out of the question. Because a valid Eulerian path is guaranteed to exist, we don\'t need to detect infeasibility — we just need a traversal method that is guaranteed to consume every edge and naturally produces the lexicographically smallest option when destinations are explored in sorted order.',
      rubric: ['Rules out brute-force permutation search given the guarantee of feasibility', 'Connects "explore smallest destination first" to the lexicographic requirement'],
    },
    bruteForce: {
      modelAnswer:
        'Backtracking: from the current airport, try each unused ticket to a destination in sorted order, recurse, and undo if the recursion fails to use all tickets; return the first (hence lexicographically smallest) complete itinerary found. Correct, but can backtrack over many dead-end partial paths before finding one that consumes every ticket. Worst case exponential in ticket count.',
      rubric: ['Describes sorted-order DFS with backtracking/undo on dead ends', 'Notes potential exponential blowup from backtracking']
    },
    wasteAndPattern: {
      modelAnswer:
        'Backtracking repeatedly explores prefixes that dead-end, undoing work already done. The key insight (Hierholzer\'s algorithm) is that in a graph guaranteed to have an Eulerian path, a DFS that always greedily takes the smallest available edge next never truly needs to backtrack destructively — any node it "gets stuck" at (no edges left) must be the end of some closed sub-tour, so appending it to the route in post-order (after all its neighbors are exhausted) and then reversing the whole sequence yields a valid Eulerian path directly, no undo required. Pattern: DFS (Hierholzer\'s algorithm / post-order edge exhaustion).',
      rubric: ['Names the waste: backtracking undoes already-explored dead ends', 'States the post-order-then-reverse Hierholzer\'s idea (no explicit undo needed)'],
      acceptedPatterns: ['dfs'],
    },
    algorithm: {
      modelAnswer:
        'Build `adj: Map<string, string[]>` from each `from` to the list of its destinations sorted in DESCENDING order (so `.pop()` removes the lexicographically smallest remaining destination in O(1) amortized). DFS from "JFK": at node `u`, while `adj.get(u)` is non-empty, pop the smallest destination `v` and recurse into `v`. Only after the while-loop exits (all of `u`\'s edges are exhausted) push `u` onto a `route` array — this is post-order. After the initial call returns, reverse `route` to get the itinerary. Time O(E log E) for the initial sort (or O(E) with a pre-sorted/bucketed structure), O(E) for the traversal itself since each ticket is consumed exactly once; space O(E) for the adjacency map and recursion stack.',
      rubric: [
        'Adjacency lists sorted descending per source, using pop() for O(1) smallest-first consumption',
        'Appends the current node to the route only AFTER its while-loop over edges is exhausted (post-order), not before',
        'Reverses the accumulated post-order route to get the final itinerary',
      ],
    },
    interviewScript: {
      modelAnswer:
        'This is an Eulerian path: use every ticket exactly once, tie-broken lexicographically. Brute-force backtracking tries destinations in sorted order but wastes work undoing dead-end prefixes. Since a valid Eulerian path is guaranteed to exist, Hierholzer\'s algorithm avoids backtracking entirely: build adjacency lists sorted descending so I can pop the smallest destination in O(1), DFS greedily consuming the smallest edge at each step, and record a node in the route only once all its edges are exhausted (post-order). Reversing that post-order sequence gives the lexicographically smallest valid itinerary. Time O(E log E), space O(E).',
      rubric: ['Follows the template end-to-end', 'States the post-order-then-reverse mechanism and why no backtracking is needed'],
    },
  },
  code: {
    signature: 'export function findItinerary(tickets: string[][]): string[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [[['MUC', 'LHR'], ['JFK', 'MUC'], ['LHR', 'SFO'], ['SFO', 'SJC']]],
        expected: ['JFK', 'MUC', 'LHR', 'SFO', 'SJC'],
        label: 'example: single chain',
      },
      {
        args: [[['JFK', 'SFO'], ['JFK', 'ATL'], ['SFO', 'ATL'], ['ATL', 'JFK'], ['ATL', 'SFO']]],
        expected: ['JFK', 'ATL', 'JFK', 'SFO', 'ATL', 'SFO'],
        label: 'example: lexicographic tie-break with a revisited node',
      },
      { args: [[['JFK', 'A'], ['A', 'JFK']]], expected: ['JFK', 'A', 'JFK'], label: 'two-airport round trip' },
      {
        args: [[['JFK', 'KUL'], ['JFK', 'NRT'], ['NRT', 'JFK']]],
        expected: ['JFK', 'NRT', 'JFK', 'KUL'],
        label: 'Hierholzer must not get stuck taking the greedy-but-wrong smallest edge first',
        hidden: true,
      },
      {
        args: [[['JFK', 'A'], ['A', 'B'], ['B', 'JFK'], ['JFK', 'C']]],
        expected: ['JFK', 'A', 'B', 'JFK', 'C'],
        label: 'requires a full loop back through JFK before the final leg',
        hidden: true,
      },
      { args: [[['JFK', 'A']]], expected: ['JFK', 'A'], label: 'single ticket', hidden: true },
    ],
    referenceSolution:
      'export function findItinerary(tickets: string[][]): string[] {\n  const adj = new Map<string, string[]>()\n  for (const [from, to] of tickets) {\n    if (!adj.has(from)) adj.set(from, [])\n    adj.get(from)!.push(to)\n  }\n  for (const dests of adj.values()) {\n    dests.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)) // descending, so pop() gives smallest\n  }\n\n  const route: string[] = []\n  function visit(u: string): void {\n    const dests = adj.get(u)\n    while (dests && dests.length > 0) {\n      const v = dests.pop()!\n      visit(v)\n    }\n    route.push(u)\n  }\n  visit(\'JFK\')\n  return route.reverse()\n}\n',
    complexity: { time: 'O(E log E)', space: 'O(E)' },
  },
}
