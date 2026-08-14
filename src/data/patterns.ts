import type { PatternId, PatternInfo } from './types'

/**
 * The fixed pattern list for the step-6 picker plus one primer per pattern
 * (when / first move / complexity / tells) and a generic TypeScript code
 * template — the templates render on the Patterns reference page only.
 */
export const patterns: PatternInfo[] = [
  {
    id: 'hash-set',
    name: 'Hash Set',
    when: 'You only need membership: "have I seen X?", uniqueness checks, or O(1) "does X exist" inside a scan.',
    firstMove: 'Add each element as you go; check the set before adding, or preload it and query while scanning.',
    complexity: 'O(n) · O(n)',
    tells: ['contains duplicate', 'seen before', 'longest consecutive', 'cycle of values'],
    codeTemplate:
      'const seen = new Set<number>()      // values met so far\nfor (const x of nums) {\n  if (seen.has(x)) return true         // membership answers the question\n  seen.add(x)                          // record after checking\n}\nreturn false',
  },
  {
    id: 'hash-map',
    name: 'Hash Map',
    when: 'You need "have I seen X?" plus a payload — value→index, value→node, key→answer — inside one pass.',
    firstMove: 'Iterate once; store what the current element would need to pair with.',
    complexity: 'O(n) · O(n)',
    tells: ['two sum', 'first duplicate', 'group by', 'map old→new nodes'],
    codeTemplate:
      'const seen = new Map<number, number>()   // value -> index (or payload)\nfor (let i = 0; i < nums.length; i++) {\n  const need = target - nums[i]          // what would complete me?\n  const j = seen.get(need)               // O(1) lookup instead of a rescan\n  if (j !== undefined) return [j, i]\n  seen.set(nums[i], i)                   // store AFTER checking (handles dups)\n}',
  },
  {
    id: 'freq-map',
    name: 'Freq Map',
    when: 'Counts decide the answer: anagrams, top-k by frequency, "can these be grouped into hands".',
    firstMove: 'Count everything first (or maintain counts in a window); then reason over the counts, not the raw data.',
    complexity: 'O(n) · O(k)',
    tells: ['anagram', 'top k frequent', 'count occurrences', 'same letters'],
    codeTemplate:
      'const counts = new Map<string, number>()          // element -> occurrences\nfor (const x of items) {\n  counts.set(x, (counts.get(x) ?? 0) + 1)         // build counts in one pass\n}\n// then reason over counts, not raw data:\nfor (const [value, count] of counts) {\n  // e.g. bucket by count, compare two count maps, ...\n}',
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    when: 'Sorted data or a pairwise objective where one end can be safely discarded — or fast/slow for compaction and cycles.',
    firstMove: 'Pointers at both ends; define the invariant that lets you move one inward. For in-place edits: slow writes, fast scans.',
    complexity: 'O(n) · O(1)',
    tells: ['sorted array', 'pair summing to', 'max area/width', 'remove in place', 'detect cycle'],
    codeTemplate:
      'let l = 0                              // left edge\nlet r = nums.length - 1                // right edge\nwhile (l < r) {\n  const value = combine(nums[l], nums[r])   // area, sum, ...\n  if (value === target) return answer\n  if (value < target) l++              // too small -> need a bigger left\n  else r--                             // too big  -> need a smaller right\n}',
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    when: 'Best/longest/shortest contiguous run — fixed size k, or a variable constraint that grows and shrinks monotonically.',
    firstMove: 'Expand right greedily; shrink left only while the window violates the constraint.',
    complexity: 'O(n) · O(k)',
    tells: ['longest substring without…', 'subarray of size k', 'smallest subarray with sum ≥'],
    codeTemplate:
      'let l = 0                                  // window left edge\nlet best = 0\nfor (let r = 0; r < s.length; r++) {\n  admit(s[r])                              // extend right: add s[r] to state\n  while (violates()) {                     // constraint broken?\n    remove(s[l])                           // shrink from the left only\n    l++\n  }\n  best = Math.max(best, r - l + 1)         // window is valid here\n}',
  },
  {
    id: 'prefix',
    name: 'Prefix',
    when: 'Many range queries, or every position needs "everything to my left / right" precomputed.',
    firstMove: 'One pass building running totals (or products); answer = combine prefix and suffix at each index.',
    complexity: 'O(n) · O(n)',
    tells: ['range sum', 'product except self', 'subarray sum equals k', 'equilibrium'],
    codeTemplate:
      'const out = new Array(n).fill(1)\nlet prefix = 1                          // product/sum of everything left of i\nfor (let i = 0; i < n; i++) {\n  out[i] = prefix                       // left side contribution\n  prefix *= nums[i]\n}\nlet suffix = 1                          // everything right of i\nfor (let i = n - 1; i >= 0; i--) {\n  out[i] *= suffix                      // combine both sides\n  suffix *= nums[i]\n}',
  },
  {
    id: 'stack',
    name: 'Stack',
    when: 'Nested structure that must open and close in order, or evaluation where the newest item is resolved first.',
    firstMove: 'Push opens/operands; on a close/operator, pop and resolve the top.',
    complexity: 'O(n) · O(n)',
    tells: ['valid parentheses', 'reverse polish', 'decode nested', 'min stack'],
    codeTemplate:
      "const stack: string[] = []              // holds unresolved opens\nfor (const ch of s) {\n  if (isOpen(ch)) {\n    stack.push(ch)                      // defer until its close arrives\n  } else {\n    const top = stack.pop()             // newest open must match first\n    if (!matches(top, ch)) return false\n  }\n}\nreturn stack.length === 0               // everything closed",
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    when: 'Nearest greater/smaller element, or spans that resolve when a new element defeats older ones.',
    firstMove: 'Keep the stack sorted; pop everything the new element defeats and answer those pops.',
    complexity: 'O(n) · O(n)',
    tells: ['next greater', 'daily temperatures', 'largest rectangle', 'car fleet'],
    codeTemplate:
      'const stack: number[] = []              // indices, values decreasing\nfor (let i = 0; i < nums.length; i++) {\n  while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {\n    const j = stack.pop()!              // nums[i] answers index j\n    answer[j] = i - j                   // e.g. distance to next greater\n  }\n  stack.push(i)                         // i now waits for ITS answer\n}',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    when: 'Sorted (or rotated-sorted) data and you need a position — or the answer itself is monotonic: if x works, all beyond x works.',
    firstMove: 'Define lo/hi and the invariant each mid comparison preserves; for search-on-answer, write feasible(x) first.',
    complexity: 'O(log n) · O(1)',
    tells: ['sorted', 'rotated', 'first/last occurrence', 'minimize the maximum', 'smallest k such that'],
    codeTemplate:
      'let lo = 1                              // smallest candidate answer\nlet hi = maxCandidate                   // largest candidate answer\nwhile (lo < hi) {\n  const mid = Math.floor((lo + hi) / 2)\n  if (feasible(mid)) hi = mid           // mid works -> answer is mid or lower\n  else lo = mid + 1                     // mid fails -> answer is above mid\n}\nreturn lo                               // smallest feasible value',
  },
  {
    id: 'heap',
    name: 'Heap',
    when: 'Repeatedly need the current min/max, or the k best of a stream — sorting everything is wasted work.',
    firstMove: 'Keep a heap of size k; compare each element against the top.',
    complexity: 'O(n log k) · O(k)',
    tells: ['k largest', 'k closest', 'merge k lists', 'median of stream', 'most frequent first'],
    codeTemplate:
      'const heap = new MinHeap<number>()      // top = weakest of the k best\nfor (const x of nums) {\n  heap.push(x, x)                       // key decides priority\n  if (heap.size > k) heap.pop()         // evict the weakest -> size stays k\n}\nreturn heap.peek()                      // k-th largest overall',
  },
  {
    id: 'dfs',
    name: 'DFS',
    when: 'Explore all of a component or subtree: connectivity, islands, path properties, validating structure.',
    firstMove: 'Recurse (or explicit stack), marking visited on entry; ask what each node needs from its children.',
    complexity: 'O(V+E) · O(V)',
    tells: ['number of islands', 'all paths', 'connected components', 'max depth', 'validate'],
    codeTemplate:
      "const dfs = (r: number, c: number): void => {\n  if (outOfBounds(r, c) || grid[r][c] !== '1') return   // stop conditions first\n  grid[r][c] = '0'                    // mark visited ON ENTRY\n  dfs(r + 1, c)                       // then explore all neighbors\n  dfs(r - 1, c)\n  dfs(r, c + 1)\n  dfs(r, c - 1)\n}",
  },
  {
    id: 'bfs',
    name: 'BFS',
    when: 'Shortest path / minimum steps in an unweighted graph or grid, or level-by-level processing.',
    firstMove: 'Queue + visited set; process a full level before the next, counting levels as distance.',
    complexity: 'O(V+E) · O(V)',
    tells: ['minimum moves', 'nearest', 'level order', 'spreads each minute'],
    codeTemplate:
      'let frontier = [start]                  // everything at distance d\nconst visited = new Set([start])\nlet distance = 0\nwhile (frontier.length > 0) {\n  const next = []                       // distance d + 1\n  for (const node of frontier) {\n    if (node === goal) return distance\n    for (const nb of neighbors(node)) {\n      if (!visited.has(nb)) {\n        visited.add(nb)                 // mark when ENQUEUED, not dequeued\n        next.push(nb)\n      }\n    }\n  }\n  frontier = next\n  distance++                            // one level fully processed\n}',
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    when: 'Enumerate combinations/permutations/paths under constraints — the output itself is exponential.',
    firstMove: 'Choose → recurse → un-choose; prune the moment a branch is invalid.',
    complexity: 'O(b^d) · O(d)',
    tells: ['all subsets', 'all permutations', 'generate valid…', 'word search'],
    codeTemplate:
      'const path: number[] = []               // current partial choice\nconst dfs = (start: number) => {\n  record([...path])                     // copy! path keeps mutating\n  for (let i = start; i < nums.length; i++) {\n    if (invalid(nums[i])) continue      // prune before recursing\n    path.push(nums[i])                  // choose\n    dfs(i + 1)                          // recurse\n    path.pop()                          // un-choose (backtrack)\n  }\n}\ndfs(0)',
  },
  {
    id: 'dp',
    name: 'DP',
    when: 'Optimal/count answer where brute force re-solves identical subproblems; state is an index (1-D) or two (2-D).',
    firstMove: 'Define dp[i] (or dp[i][j]) in one sentence; write the recurrence and base case before any code.',
    complexity: 'O(states·choices) · O(states)',
    tells: ['fewest coins', 'number of ways', 'edit distance', 'house robber', 'word break'],
    codeTemplate:
      '// 1) say it: "dp[a] = best answer for subproblem a"\nconst dp = new Array(amount + 1).fill(Infinity)\ndp[0] = 0                               // 2) base case\nfor (let a = 1; a <= amount; a++) {     // 3) fill in dependency order\n  for (const c of choices) {\n    if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1)   // 4) recurrence\n  }\n}\nreturn dp[amount]',
  },
  {
    id: 'greedy',
    name: 'Greedy',
    when: 'A local rule provably never hurts the global optimum — commit one choice at a time, never look back.',
    firstMove: 'Find the exchange argument ("furthest reach / earliest end is never worse"), often after sorting.',
    complexity: 'O(n log n) · O(1)',
    tells: ['minimum jumps', 'maximum number of…', 'can you reach', 'partition into fewest'],
    codeTemplate:
      'let maxReach = 0                        // one number summarizes the past\nfor (let i = 0; i < nums.length; i++) {\n  if (i > maxReach) return false        // stuck: nothing reaches here\n  maxReach = Math.max(maxReach, i + nums[i])   // the greedy commit\n}\nreturn true\n// before coding: say WHY the local choice never hurts (exchange argument)',
  },
  {
    id: 'sort-sweep',
    name: 'Sort + Sweep',
    when: 'Intervals or events where order by start/end unlocks a single linear pass: merging, rooms, overlaps.',
    firstMove: 'Sort by start (or end for greedy removal); sweep comparing each start against the running end.',
    complexity: 'O(n log n) · O(n)',
    tells: ['merge intervals', 'meeting rooms', 'insert interval', 'overlapping'],
    codeTemplate:
      'const sorted = [...intervals].sort((a, b) => a[0] - b[0])   // by start\nlet [start, end] = sorted[0]            // the running interval\nfor (const [s, e] of sorted.slice(1)) {\n  if (s <= end) {\n    end = Math.max(end, e)              // overlap -> extend (max! not overwrite)\n  } else {\n    emit([start, end])                  // gap -> flush and restart\n    start = s\n    end = e\n  }\n}\nemit([start, end])                      // don\'t forget the last one',
  },
  {
    id: 'one-pass',
    name: 'One Pass',
    when: 'A single scan with O(1) running state (best so far, current sum, carry) already answers the question.',
    firstMove: 'Name the running state, its update rule, and what you take the max/min of.',
    complexity: 'O(n) · O(1)',
    tells: ['best time to buy', 'maximum subarray', 'single scan', 'running total'],
    codeTemplate:
      'let bestSoFar = -Infinity               // the answer over prefix seen\nlet state = 0                           // e.g. min price, running sum\nfor (const x of nums) {\n  state = update(state, x)              // O(1) state transition\n  bestSoFar = Math.max(bestSoFar, value(state, x))\n}\nreturn bestSoFar',
  },
  {
    id: 'trie',
    name: 'Trie',
    when: 'Many strings share prefixes and you query by prefix: autocomplete, dictionaries, shortest-root replacement.',
    firstMove: 'Node = children map + end-of-word flag; insert/search walk one character per level.',
    complexity: 'O(L) per op · O(total chars)',
    tells: ['prefix', 'starts with', 'autocomplete', 'dictionary', 'suggestions'],
    codeTemplate:
      'interface Node { children: Map<string, Node>; isEnd: boolean }\nconst root: Node = { children: new Map(), isEnd: false }\n// insert: one node per character, shared across words\nlet node = root\nfor (const ch of word) {\n  if (!node.children.has(ch)) {\n    node.children.set(ch, { children: new Map(), isEnd: false })\n  }\n  node = node.children.get(ch)!\n}\nnode.isEnd = true                       // marks "a word ends here"',
  },
  {
    id: 'union-find',
    name: 'Union-Find',
    when: 'Dynamic connectivity: merging groups and asking "same set?" as edges arrive.',
    firstMove: 'parent[] with path compression; union by rank; count components as you merge.',
    complexity: 'O(α(n)) per op · O(n)',
    tells: ['accounts merge', 'redundant connection', 'provinces', 'connected components'],
    codeTemplate:
      'const parent = Array.from({ length: n }, (_, i) => i)   // self-rooted\nconst find = (x: number): number => {\n  if (parent[x] !== x) parent[x] = find(parent[x])      // path compression\n  return parent[x]\n}\nconst union = (a: number, b: number): boolean => {\n  const ra = find(a)\n  const rb = find(b)\n  if (ra === rb) return false           // already connected\n  parent[ra] = rb                       // merge the groups\n  return true\n}',
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    when: 'XOR cancellation, masks as sets, or arithmetic without operators.',
    firstMove: 'Ask what XOR/AND of the whole input collapses to; n & (n−1) clears the lowest set bit.',
    complexity: 'O(n) · O(1)',
    tells: ['single number', 'count bits', 'without +', 'appears twice except one'],
    codeTemplate:
      '// XOR fold: pairs cancel (a ^ a = 0), order irrelevant\nlet acc = 0\nfor (const x of nums) acc ^= x          // pairs vanish, the single survives\nreturn acc\n\n// Kernighan: count set bits by clearing the lowest one\nwhile (n !== 0) {\n  n = n & (n - 1)                       // clears exactly one 1-bit\n  count++\n}',
  },
  {
    id: 'math',
    name: 'Math',
    when: 'The trick is an observation, not a data structure: matrix decompositions, digit cycles, fast power.',
    firstMove: 'Look for the invariant or decomposition (rotate = transpose + reverse; pow halves the exponent).',
    complexity: 'problem-specific',
    tells: ['rotate matrix', 'in place', 'pow(x,n)', 'digits', 'spiral'],
    codeTemplate:
      '// decompose the transform into self-inverse in-place moves,\n// then verify on ONE concrete cell before coding.\n// 90° clockwise = transpose, then reverse each row:\nfor (let r = 0; r < n; r++) {\n  for (let c = r + 1; c < n; c++) {     // upper triangle only (else double-swap)\n    ;[m[r][c], m[c][r]] = [m[c][r], m[r][c]]\n  }\n}\nfor (const row of m) row.reverse()      // (r,c) -> (c, n-1-r)  ✓',
  },
]

export const patternById: Record<PatternId, PatternInfo> = Object.fromEntries(
  patterns.map((p) => [p.id, p]),
) as Record<PatternId, PatternInfo>

export function patternName(id: PatternId): string {
  return patternById[id]?.name ?? id
}
