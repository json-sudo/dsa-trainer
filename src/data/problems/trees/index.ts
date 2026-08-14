import type { AnyProblem } from '../../types'
import { invertBinaryTree } from './invert-binary-tree'
import { binaryTreeLevelOrderTraversal } from './binary-tree-level-order-traversal'
import { maximumDepthOfBinaryTree } from './maximum-depth-of-binary-tree'
import { balancedBinaryTree } from './balanced-binary-tree'
import { lowestCommonAncestorOfABst } from './lowest-common-ancestor-of-a-bst'
import { validateBinarySearchTree } from './validate-binary-search-tree'
import { kthSmallestElementInABst } from './kth-smallest-element-in-a-bst'

export const treesProblems: AnyProblem[] = [
  invertBinaryTree,
  binaryTreeLevelOrderTraversal,
  maximumDepthOfBinaryTree,
  balancedBinaryTree,
  lowestCommonAncestorOfABst,
  validateBinarySearchTree,
  kthSmallestElementInABst,
]
