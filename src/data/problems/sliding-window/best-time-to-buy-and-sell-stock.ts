import type { Problem } from '../../types'

export const bestTimeToBuyAndSellStock: Problem = {
  id: 'best-time-to-buy-and-sell-stock',
  leetcodeId: 121,
  title: 'Best Time to Buy and Sell Stock',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'sliding-window',
  authored: true,
  statement:
    'Given an array `prices` where `prices[i]` is the stock price on day `i`, choose a single day to buy and a later day to sell to maximize profit. Return the max profit, or `0` if no profit is possible.',
  examples: [
    { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 1 (price 1), sell on day 4 (price 6): 6-1 = 5' },
    { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'Prices only fall — no transaction is profitable' },
  ],
  constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a sequence of daily prices. Output: the largest `prices[j] - prices[i]` over all pairs with i < j (buy before sell), floored at 0 if nothing beats not trading.',
      rubric: ['States the ordering constraint i < j (buy-then-sell)', 'Floors at 0'],
      teachingNote: 'The i < j constraint is easy to drop mentally — say it out loud, it\'s what rules out just taking max - min blindly.',
    },
    whatToFind: {
      modelAnswer: 'For every day, the best possible sell profit is today\'s price minus the minimum price seen on any earlier day — maximize that over all days.',
      rubric: ['Reduces to "today\'s price minus min-so-far", maximized over days', 'Notes buy day is implicitly whichever day set the running min'],
      teachingNote: 'This reduction is the whole algorithm in one sentence — once said, coding it is mechanical.',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 1e5 — an O(n²) all-pairs scan is 10^10 operations, too slow. Prices are non-negative bounded ints but that\'s not the lever here; the lever is that "min so far" only needs a single running value, giving O(n) time in one pass.',
      rubric: ['States n rules out O(n²)', 'Identifies single running minimum is enough — no need to store all past prices'],
      teachingNote: 'n=1e5 with an obvious O(n²) brute force is the textbook signal to hunt for an O(n) one-pass reduction using a running aggregate.',
    },
    bruteForce: {
      modelAnswer: 'Try every buy day i and every sell day j > i, track the max of prices[j] - prices[i]. O(n²) time, O(1) space.',
      rubric: ['Nested loop over all buy/sell pairs', 'States O(n²)'],
      teachingNote: 'State the brute force even though it\'s obviously too slow — it grounds the "waste" argument that follows.',
    },
    wasteAndPattern: {
      modelAnswer:
        'For a fixed sell day j, only the *smallest* price among days before j can ever be the best buy — every other earlier price is strictly worse and re-scanning them each time is pure waste. Track a running minimum while sweeping once left to right, and at each day compute price - runningMin. Pattern: One Pass with a running aggregate (a size-1 sliding window of "best buy so far").',
      rubric: ['Waste: re-scanning all earlier prices when only the min matters', 'Running-minimum one-pass replaces the inner loop'],
      acceptedPatterns: ['one-pass', 'sliding-window'],
      teachingNote: 'This is the simplest form of "sliding window": the window is just "everything before today," summarized by a single running minimum — no left pointer needed because we never shrink the window from the left.',
    },
    algorithm: {
      modelAnswer:
        'minPrice = prices[0], maxProfit = 0. For each price starting at index 1: if price < minPrice, update minPrice; else compute price - minPrice and update maxProfit if larger. Return maxProfit. Time O(n), space O(1).',
      rubric: ['Single pass tracking running min', 'Profit computed and compared each day the price isn\'t a new min', 'States O(n)/O(1)'],
      teachingNote: 'Either branch structure (if-new-min else compute-profit, or compute-profit-then-update-min) works — just be consistent and explain the one you pick.',
    },
    interviewScript: {
      modelAnswer:
        'The answer is the max of price[j] - price[i] for i < j. Brute force checks all O(n²) pairs; but for any sell day, only the minimum price before it matters, and I can track that minimum in a single running variable while sweeping once. So one pass: keep a running min price seen so far, and at each day update the best profit as today\'s price minus that running min. O(n) time, O(1) space.',
      rubric: ['Template followed: reduction, brute force, waste, pattern', 'States final complexity'],
      teachingNote: 'Good problem to practice saying "running aggregate replaces an inner loop" crisply — that phrase generalizes to many one-pass problems.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Track the lowest price seen so far and the best profit so far',
      code: 'let minPrice = prices[0]\nlet maxProfit = 0',
    },
    {
      label: '2. One pass: either a new low, or a candidate profit',
      code: 'for (let i = 1; i < prices.length; i++) {\n  if (prices[i] < minPrice) {\n    minPrice = prices[i]        // new best day to have bought\n  } else {\n    maxProfit = Math.max(maxProfit, prices[i] - minPrice)\n  }\n}',
    },
    {
      label: '3. Best profit found across the whole sweep',
      code: 'return maxProfit',
    },
  ],
  code: {
    signature: 'export function maxProfit(prices: number[]): number {\n\n}\n',
    harness: 'plain',
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5, label: 'example profitable case' },
      { args: [[7, 6, 4, 3, 1]], expected: 0, label: 'strictly decreasing, no profit' },
      { args: [[1, 2]], expected: 1, label: 'two days, simple profit' },
      { args: [[3]], expected: 0, label: 'single day, no possible transaction', hidden: true },
      { args: [[2, 4, 1, 7]], expected: 6, label: 'min appears after an early high', hidden: true },
      { args: [[1, 1, 1, 1]], expected: 0, label: 'constant prices', hidden: true },
    ],
    referenceSolution:
      'export function maxProfit(prices: number[]): number {\n  let minPrice = prices[0]\n  let maxProfit = 0\n  for (let i = 1; i < prices.length; i++) {\n    if (prices[i] < minPrice) {\n      minPrice = prices[i]\n    } else {\n      maxProfit = Math.max(maxProfit, prices[i] - minPrice)\n    }\n  }\n  return maxProfit\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
