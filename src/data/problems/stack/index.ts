import type { AnyProblem } from '../../types'
import { validParentheses } from './valid-parentheses'
import { dailyTemperatures } from './daily-temperatures'
import { minStack } from './min-stack'
import { evaluateReversePolishNotation } from './evaluate-reverse-polish-notation'
import { generateParentheses } from './generate-parentheses'
import { carFleet } from './car-fleet'
import { largestRectangleInHistogram } from './largest-rectangle-in-histogram'

export const stackProblems: AnyProblem[] = [
  validParentheses,
  dailyTemperatures,
  minStack,
  evaluateReversePolishNotation,
  generateParentheses,
  carFleet,
  largestRectangleInHistogram,
]
