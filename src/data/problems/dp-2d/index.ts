import type { AnyProblem } from '../../types'
import { uniquePaths } from './unique-paths'
import { longestCommonSubsequence } from './longest-common-subsequence'
import { targetSum } from './target-sum'
import { coinChangeII } from './coin-change-ii'
import { interleavingString } from './interleaving-string'
import { editDistance } from './edit-distance'

export const dp2dProblems: AnyProblem[] = [
  uniquePaths,
  longestCommonSubsequence,
  targetSum,
  coinChangeII,
  interleavingString,
  editDistance,
  {
    id: 'longest-increasing-path-in-a-matrix',
    leetcodeId: 329,
    title: "Longest Increasing Path in a Matrix",
    difficulty: 'hard',
    mode: 'practice',
    topicId: 'dp-2d',
    authored: false,
    acceptedPatterns: ['dfs','dp'],
  },
]
