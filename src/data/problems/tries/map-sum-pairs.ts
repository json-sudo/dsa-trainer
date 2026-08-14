import type { Problem } from '../../types'

export const mapSumPairs: Problem = {
  id: 'map-sum-pairs',
  leetcodeId: 677,
  title: 'Map Sum Pairs',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'tries',
  authored: true,
  statement:
    'Design a class `MapSum` with `insert(key, val)` — inserts or, if `key` already exists, **overwrites** its value — and `sum(prefix)`, which returns the sum of values for every stored key that starts with `prefix` (0 if none do).',
  examples: [
    {
      input: 'insert("apple", 3), sum("ap"), insert("app", 2), sum("ap")',
      output: '3, 5',
      explanation: 'After inserting "app", "ap" covers both "apple" (3) and "app" (2).',
    },
    {
      input: 'insert("apple", 3), insert("apple", 5), sum("apple")',
      output: '5',
      explanation: 'Re-inserting "apple" overwrites 3 with 5, it does not add to it.',
    },
  ],
  constraints: [
    '1 <= key.length, prefix.length <= 50',
    'lowercase English letters',
    '1 <= val <= 1000',
    'up to 50 calls to insert and sum',
    'inserting an existing key overwrites its value',
  ],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a stream of insert(key, val) and sum(prefix) calls. Output: sum() returns a number — the total of every stored value whose key starts with the prefix. The sharp edge: insert on a key that already exists replaces its value rather than adding a new pair, so I can\'t just accumulate blindly.',
      rubric: ['Names the two operations and sum() output shape', 'Flags overwrite-on-reinsert as the tricky contract detail'],
    },
    whatToFind: {
      modelAnswer:
        'A design task combining exact key storage (for overwrite correctness) with prefix aggregation (for sum) — I need both "what is this key currently worth" and "total value under this prefix" to stay in sync.',
      rubric: ['Identifies two responsibilities: exact-value tracking and prefix aggregation', 'Notes they must stay consistent through overwrites'],
    },
    constraintsHint: {
      modelAnswer:
        'Tiny scale (≤50 calls, keys ≤50 chars) means performance is a non-issue — any correct design is fast enough. The real constraint is correctness under re-insertion: values up to 1000 with overwrite semantics is what breaks naive "add delta blindly" implementations.',
      rubric: ['Notes scale is small enough that any reasonable design is fast', 'Focuses on overwrite correctness as the actual difficulty'],
    },
    bruteForce: {
      modelAnswer:
        'Store all pairs in a plain Map<string, number> (key → val, insert naturally overwrites). For sum(prefix), iterate every stored key, check startsWith, and add up matches. O(N·L) per sum call where N is stored keys — correct but rescans everything on every query.',
      rubric: ['Map-based exact storage that handles overwrite for free', 'Linear scan-and-filter for sum(), with its cost stated'],
    },
    wasteAndPattern: {
      modelAnswer:
        'sum() re-walks every stored key from scratch even though many share the queried prefix — the shared prefix path is recomputed per key instead of being tracked once. Build a trie over the keys where each node caches the running sum of every key passing through it; sum(prefix) then becomes a single O(L) walk to that node\'s cached total instead of an O(N·L) scan. Pattern: Trie + Hash Map.',
      rubric: ['Names the waste: prefix membership recomputed per stored key on every sum() call', 'Proposes per-node cached sums in a trie, keyed off the exact map for overwrite deltas'],
      acceptedPatterns: ['trie', 'hash-map'],
    },
    algorithm: {
      modelAnswer:
        'Keep a Map<string, number> of key → exact value as ground truth, plus a trie of characters where each node stores `sum` = total value of all keys passing through it. insert(key, val): look up the old value in the map (0 if absent), compute delta = val − old, set map.set(key, val), then walk/create the trie path for key and add delta to node.sum at every node along the way (root through the last char). sum(prefix): walk the trie along prefix; if the path breaks, return 0; otherwise return the sum stored at the node where the walk ends. Time O(L) per call, space O(total characters stored).',
      rubric: [
        'Delta computed against the map before mutating (newVal − oldVal, defaulting old to 0)',
        'Delta applied to every trie node along the full key path on insert',
        'sum() returns 0 on a broken path and the cached node sum otherwise',
      ],
    },
    interviewScript: {
      modelAnswer:
        'A plain hash map handles insert with overwrite trivially, but sum(prefix) then has to scan every stored key and check startsWith — O(N·L) per query, wasteful since many keys share the prefix path. I\'ll keep the map as the source of truth for exact values (so overwrite deltas are easy to compute) and layer a trie on top where each node caches the sum of everything through it. insert computes delta = newVal − oldVal and adds it to every node along the key\'s path; sum just walks to the prefix node and reads its cached total. Both operations become O(L). Space O(total characters).',
      rubric: ['States the map-scan waste and the shared-prefix insight', 'Explains the delta trick for overwrite correctness and final O(L) per call'],
    },
  },
  code: {
    signature:
      'export class MapSum {\n  insert(key: string, val: number): void {\n    // your code here\n  }\n  sum(prefix: string): number {\n    return 0\n  }\n}\n',
    harness: 'class-design',
    tests: [
      {
        args: [
          ['MapSum', 'insert', 'sum', 'insert', 'sum'],
          [[], ['apple', 3], ['ap'], ['app', 2], ['ap']],
        ],
        expected: [null, null, 3, null, 5],
        label: 'example sequence',
      },
      {
        args: [
          ['MapSum', 'insert', 'insert', 'sum'],
          [[], ['apple', 3], ['apple', 5], ['apple']],
        ],
        expected: [null, null, null, 5],
        label: 'overwrite replaces, does not add',
      },
      {
        args: [
          ['MapSum', 'sum'],
          [[], ['a']],
        ],
        expected: [null, 0],
        label: 'no keys stored yet',
      },
      {
        args: [
          ['MapSum', 'insert', 'insert', 'insert', 'sum', 'sum'],
          [[], ['bee', 2], ['bear', 3], ['bell', 4], ['be'], ['bee']],
        ],
        expected: [null, null, null, null, 9, 2],
        label: 'branching prefixes',
        hidden: true,
      },
      {
        args: [
          ['MapSum', 'insert', 'sum', 'insert', 'sum', 'sum'],
          [[], ['a', 1], ['a'], ['a', 10], ['a'], ['b']],
        ],
        expected: [null, null, 1, null, 10, 0],
        label: 'single-char key overwrite plus unrelated prefix',
        hidden: true,
      },
      {
        args: [
          ['MapSum', 'insert', 'insert', 'sum', 'insert', 'sum'],
          [[], ['abc', 5], ['abd', 6], ['ab'], ['abc', 1], ['ab']],
        ],
        expected: [null, null, null, 11, null, 7],
        label: 'overwrite updates the aggregated prefix sum',
        hidden: true,
      },
    ],
    referenceSolution:
      'class MapSumNode {\n  children = new Map<string, MapSumNode>()\n  sum = 0\n}\n\nexport class MapSum {\n  private exact = new Map<string, number>()\n  private root = new MapSumNode()\n\n  insert(key: string, val: number): void {\n    const old = this.exact.get(key) ?? 0\n    const delta = val - old\n    this.exact.set(key, val)\n    let node = this.root\n    node.sum += delta\n    for (const ch of key) {\n      let next = node.children.get(ch)\n      if (!next) {\n        next = new MapSumNode()\n        node.children.set(ch, next)\n      }\n      next.sum += delta\n      node = next\n    }\n  }\n\n  sum(prefix: string): number {\n    let node = this.root\n    for (const ch of prefix) {\n      const next = node.children.get(ch)\n      if (!next) return 0\n      node = next\n    }\n    return node.sum\n  }\n}\n',
    complexity: { time: 'O(L) per operation', space: 'O(total characters)' },
  },
}
