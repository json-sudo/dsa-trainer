import type { AnyProblem } from '../../types'
import { networkDelayTime } from './network-delay-time'
import { minCostToConnectAllPoints } from './min-cost-to-connect-all-points'
import { cheapestFlightsWithinKStops } from './cheapest-flights-within-k-stops'
import { reconstructItinerary } from './reconstruct-itinerary'
import { swimInRisingWater } from './swim-in-rising-water'
import { alienDictionary } from './alien-dictionary'
import { wordLadder } from './word-ladder'

export const advancedGraphsProblems: AnyProblem[] = [
  networkDelayTime,
  minCostToConnectAllPoints,
  cheapestFlightsWithinKStops,
  reconstructItinerary,
  swimInRisingWater,
  alienDictionary,
  wordLadder,
]
