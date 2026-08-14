import type { AnyProblem } from '../../types'
import { singleNumber } from './single-number'
import { countingBits } from './counting-bits'
import { numberOf1Bits } from './number-of-1-bits'
import { reverseBits } from './reverse-bits'
import { missingNumber } from './missing-number'
import { sumOfTwoIntegers } from './sum-of-two-integers'
import { reverseInteger } from './reverse-integer'

export const bitManipulationProblems: AnyProblem[] = [
  singleNumber,
  countingBits,
  numberOf1Bits,
  reverseBits,
  missingNumber,
  sumOfTwoIntegers,
  reverseInteger,
]
