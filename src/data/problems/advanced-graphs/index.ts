import type { AnyProblem } from '../../types'
import { networkDelayTime } from './network-delay-time'
import { minCostToConnectAllPoints } from './min-cost-to-connect-all-points'
import { cheapestFlightsWithinKStops } from './cheapest-flights-within-k-stops'
import { alienDictionary } from './alien-dictionary'
import { wordLadder } from './word-ladder'

export const advancedGraphsProblems: AnyProblem[] = [
  networkDelayTime,
  minCostToConnectAllPoints,
  cheapestFlightsWithinKStops,
  {
    id: 'reconstruct-itinerary',
    leetcodeId: 332,
    title: "Reconstruct Itinerary",
    difficulty: 'hard',
    mode: 'practice',
    topicId: 'advanced-graphs',
    authored: false,
    acceptedPatterns: ['dfs'],
  },
  {
    id: 'swim-in-rising-water',
    leetcodeId: 778,
    title: "Swim in Rising Water",
    difficulty: 'hard',
    mode: 'practice',
    topicId: 'advanced-graphs',
    authored: false,
    acceptedPatterns: ['heap','binary-search'],
  },
  alienDictionary,
  wordLadder,
]
