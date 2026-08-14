import type { Problem } from '../../types'

export const wordLadder: Problem = {
  id: 'word-ladder',
  leetcodeId: 127,
  title: 'Word Ladder',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'advanced-graphs',
  authored: true,
  statement:
    'Given `beginWord`, `endWord`, and a `wordList`, return the length of the **shortest transformation sequence** from `beginWord` to `endWord` — each step changes exactly one letter and must land in `wordList` — or `0` if none exists. `beginWord` need not be in the list.',
  examples: [
    { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit → hot → dot → dog → cog.' },
    { input: 'same but wordList lacks "cog"', output: '0' },
  ],
  constraints: ['1 <= word length <= 10', '1 <= wordList.length <= 5000', 'all words same length, lowercase'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: start word, target word, dictionary (all equal length). Output: the *count of words* in the shortest chain (start included), 0 if unreachable or target absent.',
      rubric: ['Length counts words, not steps', 'Target-absent → 0 shortcut'],
    },
    whatToFind: {
      modelAnswer: 'Shortest path in an implicit graph: words are vertices, one-letter differences are edges. "Shortest" + unweighted = the giveaway.',
      rubric: ['Words-as-graph reframe', 'Shortest-unweighted identified'],
    },
    constraintsHint: {
      modelAnswer:
        '5000 words × length 10: pairwise adjacency checks are 2.5×10⁷·10 — borderline. Better: generate each word\'s ≤ 26·10 neighbors directly (or wildcard buckets h_t). Budget O(N·L·26).',
      rubric: ['Rejects/flags pairwise O(N²·L)', 'Neighbor-generation (or bucket) alternative'],
    },
    bruteForce: {
      modelAnswer:
        'DFS all transformation sequences tracking the best length: exponential path count, and DFS cannot claim "shortest" without exhausting everything.',
      rubric: ['Exhaustive path search named', 'Notes DFS lacks the shortest guarantee until exhaustion'],
    },
    wasteAndPattern: {
      modelAnswer:
        'DFS explores long chains before short ones and revisits words along different paths — but the first time BFS reaches any word is provably via a shortest route, so each word needs visiting once. Level-by-level expansion from beginWord, removing visited words. Pattern: BFS.',
      rubric: ['Waste: deep exploration + revisits', 'First-BFS-arrival-is-shortest argument'],
      acceptedPatterns: ['bfs'],
    },
    algorithm: {
      modelAnswer:
        'wordSet from the list; if endWord absent → 0. Queue = [beginWord], level = 1. Per level: for each word, try all L·25 single-letter mutations; any mutation in wordSet is enqueued and *deleted from the set* (visited). Return level+1 when endWord is generated. Time O(N·L·26), space O(N·L).',
      rubric: [
        'Mutation generation against a set (not pairwise scan)',
        'Delete-on-enqueue as the visited mechanism',
        'Level counting returns word count',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be searching all transformation chains — exponential, and depth-first can\'t certify shortest. Model words as a graph with edges between one-letter neighbors: shortest chain in an unweighted graph is BFS by definition. I\'ll expand level by level, generating each word\'s 26·L mutations against a hash set and deleting words once reached. Time O(N·L·26), space O(N·L).',
      rubric: ['Template followed with the implicit-graph + BFS-guarantee', 'Mutation-vs-pairwise choice justified'],
    },
  },
  code: {
    signature: 'export function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5, label: 'example' },
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0, label: 'target missing' },
      { args: ['a', 'c', ['a', 'b', 'c']], expected: 2, label: 'single letter words' },
      { args: ['hot', 'dog', ['hot', 'dog']], expected: 0, label: 'two-letter gap unreachable', hidden: true },
      { args: ['hot', 'dot', ['dot']], expected: 2, label: 'direct neighbor', hidden: true },
      {
        args: ['red', 'tax', ['ted', 'tex', 'red', 'tax', 'tad', 'den', 'rex', 'pee']],
        expected: 4,
        label: 'branching ladder',
        hidden: true,
      },
    ],
    referenceSolution:
      "export function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {\n  const wordSet = new Set(wordList)\n  if (!wordSet.has(endWord)) return 0\n  let frontier = [beginWord]\n  let level = 1\n  wordSet.delete(beginWord)\n  while (frontier.length > 0) {\n    const next: string[] = []\n    for (const word of frontier) {\n      for (let i = 0; i < word.length; i++) {\n        for (let c = 97; c <= 122; c++) {\n          const mutated = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1)\n          if (mutated === endWord) return level + 1\n          if (wordSet.has(mutated)) {\n            wordSet.delete(mutated)\n            next.push(mutated)\n          }\n        }\n      }\n    }\n    frontier = next\n    level++\n  }\n  return 0\n}\n",
    complexity: { time: 'O(N·L·26)', space: 'O(N·L)' },
  },
}
