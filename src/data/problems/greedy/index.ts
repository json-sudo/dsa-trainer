import type { AnyProblem } from '../../types'
import { jumpGame } from './jump-game'
import { gasStation } from './gas-station'
import { jumpGameII } from './jump-game-ii'
import { handOfStraights } from './hand-of-straights'
import { partitionLabels } from './partition-labels'
import { validParenthesisString } from './valid-parenthesis-string'
import { mergeTripletsToFormTarget } from './merge-triplets-to-form-target'

export const greedyProblems: AnyProblem[] = [
  jumpGame,
  gasStation,
  jumpGameII,
  handOfStraights,
  partitionLabels,
  validParenthesisString,
  mergeTripletsToFormTarget,
]
