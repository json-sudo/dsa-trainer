import type { AnyProblem } from '../../types'
import { validParentheses } from './valid-parentheses'
import { dailyTemperatures } from './daily-temperatures'
import { minStack } from './min-stack'
import { evaluateReversePolishNotation } from './evaluate-reverse-polish-notation'
import { generateParentheses } from './generate-parentheses'
import { carFleet } from './car-fleet'

export const stackProblems: AnyProblem[] = [
  validParentheses,
  dailyTemperatures,
  minStack,
  evaluateReversePolishNotation,
  generateParentheses,
  carFleet,
  {
    id: 'largest-rectangle-in-histogram',
    leetcodeId: 84,
    title: "Largest Rectangle in Histogram",
    difficulty: 'hard',
    mode: 'practice',
    topicId: 'stack',
    authored: false,
    acceptedPatterns: ['monotonic-stack'],
  },
]
