import type { Problem } from '../../types'

export const wordBreak: Problem = {
  id: 'word-break',
  leetcodeId: 139,
  title: 'Word Break',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'dp-1d',
  authored: true,
  statement:
    'Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be segmented into a sequence of one or more dictionary words (words may be reused).',
  examples: [
    { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true' },
    { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true' },
    { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false' },
  ],
  constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', '1 <= word length <= 20', 'lowercase; dictionary words distinct'],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: a string ≤ 300 chars and a reusable dictionary. Output: boolean — segmentability only, not the segmentation itself.',
      rubric: ['Reuse allowed noted', 'Boolean (no reconstruction) output'],
    },
    whatToFind: {
      modelAnswer: 'Existence of one full segmentation — with substructure: s[0..i) is breakable iff some dictionary word ends at i with a breakable prefix before it.',
      rubric: ['Prefix-breakability substructure stated', 'Existence framing'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 300, words ≤ 20: n × maxWordLen × wordLookup ≈ 300·20 with a set — trivial. The exponential risk is only in naive recursion on adversarial inputs ("aaaa…b").',
      rubric: ['Budget from n · maxLen with set lookups', 'Adversarial exponential case recognized'],
    },
    bruteForce: {
      modelAnswer:
        'Recursively try every dictionary word as a prefix and recurse on the rest: exponential on inputs like "aaaa…ab" with words {a, aa, aaa} — the same suffixes re-solved endlessly.',
      rubric: ['Prefix-recursion described', 'The classic blowup input named'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Only n+1 distinct suffix questions exist ("is s[i..] breakable?"), but the recursion re-answers them exponentially often. Tabulate: dp[i] = breakability of the first i chars, built left to right with a word set (check the last ≤ 20 chars only). Pattern: DP (1-D over prefixes).',
      rubric: ['n+1 distinct states argument', 'dp over prefixes with bounded lookback'],
      acceptedPatterns: ['dp'],
    },
    algorithm: {
      modelAnswer:
        'wordSet + maxLen. dp[0] = true. For i from 1 to n: dp[i] = OR over j in [i − maxLen, i) of dp[j] && wordSet.has(s.slice(j, i)). Answer dp[n]. Time O(n · maxLen) substring checks, space O(n).',
      rubric: ['dp[0]=true base', 'Bounded-lookback inner loop', 'States complexity'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be trying every word as a prefix recursively — exponential on adversarial repeats because identical suffixes are re-solved. There are only n+1 distinct questions ("is this prefix breakable?"), so I\'ll fill dp[i] left to right, checking only the last maxWordLen positions against a hash set. Time O(n·maxLen), space O(n).',
      rubric: ['Template followed with distinct-states argument', 'Bounded lookback optimization mentioned'],
    },
  },
  code: {
    signature: 'export function wordBreak(s: string, wordDict: string[]): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['leetcode', ['leet', 'code']], expected: true, label: 'example' },
      { args: ['applepenapple', ['apple', 'pen']], expected: true, label: 'word reuse' },
      { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false, label: 'near miss' },
      { args: ['a', ['a']], expected: true, label: 'single char', hidden: true },
      { args: ['aaaaaaaaaaaaaaaaaaab', ['a', 'aa', 'aaa', 'aaaa']], expected: false, label: 'adversarial blowup input', hidden: true },
      { args: ['cars', ['car', 'ca', 'rs']], expected: true, label: 'overlapping options', hidden: true },
    ],
    referenceSolution:
      'export function wordBreak(s: string, wordDict: string[]): boolean {\n  const wordSet = new Set(wordDict)\n  const maxLen = Math.max(...wordDict.map((w) => w.length))\n  const n = s.length\n  const dp = new Array(n + 1).fill(false)\n  dp[0] = true\n  for (let i = 1; i <= n; i++) {\n    for (let j = Math.max(0, i - maxLen); j < i; j++) {\n      if (dp[j] && wordSet.has(s.slice(j, i))) {\n        dp[i] = true\n        break\n      }\n    }\n  }\n  return dp[n]\n}\n',
    complexity: { time: 'O(n · maxWordLen)', space: 'O(n)' },
  },
}
