import type { AnyProblem } from '../../types'
import { uniquePaths } from './unique-paths'
import { longestCommonSubsequence } from './longest-common-subsequence'
import { targetSum } from './target-sum'
import { coinChangeII } from './coin-change-ii'
import { interleavingString } from './interleaving-string'
import { editDistance } from './edit-distance'
import { longestIncreasingPathInAMatrix } from './longest-increasing-path-in-a-matrix'

export const dp2dProblems: AnyProblem[] = [
  uniquePaths,
  longestCommonSubsequence,
  targetSum,
  coinChangeII,
  interleavingString,
  editDistance,
  longestIncreasingPathInAMatrix,
]
