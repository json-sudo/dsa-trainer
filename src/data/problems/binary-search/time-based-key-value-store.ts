import type { Problem } from '../../types'

export const timeBasedKeyValueStore: Problem = {
  id: 'time-based-key-value-store',
  leetcodeId: 981,
  title: 'Time Based Key-Value Store',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'binary-search',
  authored: true,
  statement:
    'Design a time-based key-value store class `TimeMap` that supports storing multiple values for the same key at different timestamps, and retrieving the key\'s value at a certain timestamp. Implement `set(key, value, timestamp)` which stores the key with the value at the given time, and `get(key, timestamp)` which returns the value associated with `key` at the largest stored timestamp ≤ the given `timestamp`, or `""` if there is none. `set` calls for a given key arrive with **strictly increasing** timestamps.',
  examples: [
    {
      input: 'set("foo","bar",1); get("foo",1); get("foo",3); set("foo","bar2",4); get("foo",4); get("foo",5)',
      output: '"bar", "bar", "bar2", "bar2"',
      explanation: 'get("foo",1) finds the exact timestamp; get("foo",3) finds the largest timestamp ≤ 3, still 1.',
    },
  ],
  constraints: [
    '1 <= key.length, value.length <= 100',
    '1 <= timestamp <= 10^7',
    'set calls for the same key are strictly increasing in timestamp',
    'up to 2 * 10^5 total set/get calls',
  ],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a stream of set(key, value, timestamp) and get(key, timestamp) calls, with set timestamps strictly increasing per key. Output: get returns the value stored at the latest timestamp not exceeding the query, or "" if none exists. This is a data-structure design task, not one pure function.',
      rubric: ['Recognizes the design-a-class framing with two operations', 'Notes set timestamps are strictly increasing per key — an ordering guarantee'],
    },
    whatToFind: {
      modelAnswer:
        'For get, I need the most recent snapshot of a key\'s value that existed at or before a given time — effectively "floor" lookup in a per-key timeline.',
      rubric: ['Frames get as a floor/predecessor search over timestamps', 'Recognizes each key has its own independent timeline'],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 2×10⁵ calls total means each operation needs to be well under linear-in-history — O(log n) per get is the target. The strictly-increasing timestamp guarantee means each key\'s stored entries are automatically sorted by time, which is exactly what enables binary search.',
      rubric: ['Derives an O(log n)-per-get target from the 2×10⁵ call volume', 'Connects strictly-increasing timestamps to "already sorted, no extra sort needed"'],
    },
    bruteForce: {
      modelAnswer:
        'Store all (timestamp, value) pairs per key in a list; on get, scan the list backward for the first timestamp ≤ query. O(1) set, O(k) get where k is entries for that key — fine for few calls, too slow at 2×10⁵ operations against a long history.',
      rubric: ['Names the linear-scan-per-get approach', 'States its complexity and why it can be too slow at scale'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The backward scan re-walks entries I already know are sorted by time (since set arrives with strictly increasing timestamps) — that sortedness is free binary-search structure I\'m throwing away. Store each key\'s entries in an array appended in order, and binary search that array for the floor of the query timestamp. Pattern: Hash Map (key → array) + Binary Search.',
      rubric: ['Names the waste: linear scan over an already-sorted-by-construction array', 'Proposes hash map of key to sorted timestamp array plus binary search for the floor'],
      acceptedPatterns: ['binary-search', 'hash-map'],
    },
    algorithm: {
      modelAnswer:
        'Maintain `Map<string, {timestamp:number, value:string}[]>`. set: append {timestamp, value} to the array for that key (already sorted since timestamps strictly increase). get: look up the key\'s array (empty if unseen); binary search for the rightmost entry with timestamp ≤ query — track the best index found while narrowing lo/hi; return its value, or "" if none. Time: O(1) set, O(log n) get where n is entries for that key; space O(total entries).',
      rubric: ['set is O(1) append, relying on the increasing-timestamp guarantee', 'get performs binary search for the floor, handling the "no valid entry" case as ""', 'States O(1) set / O(log n) get complexity'],
    },
    interviewScript: {
      modelAnswer:
        'A linear backward scan per get works but wastes the fact that timestamps for a key arrive strictly increasing — that means each key\'s history is already sorted, so I can binary search it. I\'ll store a hash map from key to an append-only array of {timestamp, value}, and get does a binary search for the largest timestamp not exceeding the query, returning "" if the array is empty or every entry is too late. Set is O(1), get is O(log n).',
      rubric: ['Follows the script template end-to-end, adapted to a design problem', 'States the per-key sorted array plus binary search insight and complexity'],
    },
  },
  code: {
    signature:
      'export class TimeMap {\n  set(key: string, value: string, timestamp: number): void {\n    // your code here\n  }\n  get(key: string, timestamp: number): string {\n    return \'\'\n  }\n}\n',
    harness: 'class-design',
    tests: [
      {
        args: [
          ['TimeMap', 'set', 'get', 'get', 'set', 'get', 'get'],
          [[], ['foo', 'bar', 1], ['foo', 1], ['foo', 3], ['foo', 'bar2', 4], ['foo', 4], ['foo', 5]],
        ],
        expected: [null, null, 'bar', 'bar', null, 'bar2', 'bar2'],
        label: 'example sequence',
      },
      {
        args: [
          ['TimeMap', 'get'],
          [[], ['missing', 1]],
        ],
        expected: [null, ''],
        label: 'unseen key returns empty string',
      },
      {
        args: [
          ['TimeMap', 'set', 'get'],
          [[], ['a', 'v1', 5], ['a', 2]],
        ],
        expected: [null, null, ''],
        label: 'query before earliest timestamp',
      },
      {
        args: [
          ['TimeMap', 'set', 'set', 'set', 'get', 'get', 'get', 'get'],
          [[], ['k', 'v1', 1], ['k', 'v2', 3], ['k', 'v3', 5], ['k', 0], ['k', 2], ['k', 4], ['k', 100]],
        ],
        expected: [null, null, null, null, '', 'v1', 'v2', 'v3'],
        label: 'multiple timestamps floor lookup',
        hidden: true,
      },
      {
        args: [
          ['TimeMap', 'set', 'set', 'get'],
          [[], ['x', 'a', 1], ['y', 'b', 1], ['x', 1]],
        ],
        expected: [null, null, null, 'a'],
        label: 'independent keys do not interfere',
        hidden: true,
      },
      {
        args: [
          ['TimeMap', 'set', 'get'],
          [[], ['k', 'val', 10000000], ['k', 10000000]],
        ],
        expected: [null, null, 'val'],
        label: 'large timestamp exact match',
        hidden: true,
      },
    ],
    referenceSolution:
      'export class TimeMap {\n  private store = new Map<string, { timestamp: number; value: string }[]>()\n\n  set(key: string, value: string, timestamp: number): void {\n    if (!this.store.has(key)) this.store.set(key, [])\n    this.store.get(key)!.push({ timestamp, value })\n  }\n\n  get(key: string, timestamp: number): string {\n    const entries = this.store.get(key)\n    if (!entries || entries.length === 0) return \'\'\n    let lo = 0\n    let hi = entries.length - 1\n    let result = \'\'\n    while (lo <= hi) {\n      const mid = (lo + hi) >> 1\n      if (entries[mid].timestamp <= timestamp) {\n        result = entries[mid].value\n        lo = mid + 1\n      } else {\n        hi = mid - 1\n      }\n    }\n    return result\n  }\n}\n',
    complexity: { time: 'O(1) set / O(log n) get', space: 'O(n)' },
  },
}
