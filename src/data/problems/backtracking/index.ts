import type { AnyProblem } from '../../types'
import { subsets } from './subsets'
import { combinationSum } from './combination-sum'
import { permutations } from './permutations'
import { subsetsIi } from './subsets-ii'
import { letterCombinationsOfAPhoneNumber } from './letter-combinations-of-a-phone-number'
import { wordSearch } from './word-search'
import { palindromePartitioning } from './palindrome-partitioning'

export const backtrackingProblems: AnyProblem[] = [
  subsets,
  combinationSum,
  permutations,
  subsetsIi,
  letterCombinationsOfAPhoneNumber,
  wordSearch,
  palindromePartitioning,
]
