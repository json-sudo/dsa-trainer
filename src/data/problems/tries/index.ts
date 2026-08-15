import type { AnyProblem } from '../../types'
import { implementTrie } from './implement-trie'
import { designAddAndSearchWords } from './design-add-and-search-words'
import { longestCommonPrefix } from './longest-common-prefix'
import { replaceWords } from './replace-words'
import { mapSumPairs } from './map-sum-pairs'
import { searchSuggestionsSystem } from './search-suggestions-system'
import { wordSearchIi } from './word-search-ii'

export const triesProblems: AnyProblem[] = [
  implementTrie,
  designAddAndSearchWords,
  longestCommonPrefix,
  replaceWords,
  mapSumPairs,
  searchSuggestionsSystem,
  wordSearchIi,
]
