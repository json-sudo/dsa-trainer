import { describe, expect, it } from 'vitest'
import { buildCycle, buildList, buildTree, listToArray, treeToArray, MinHeap } from './harness'
import { canonicalize, resultsEqual } from './compare'

describe('linked-list harness', () => {
  it('round-trips arrays through buildList/listToArray', () => {
    for (const arr of [[], [1], [1, 2, 3], [-1, 0, 1], [5, 5, 5]]) {
      expect(listToArray(buildList(arr))).toEqual(arr)
    }
  })

  it('builds a proper chain', () => {
    const head = buildList([1, 2])
    expect(head?.val).toBe(1)
    expect(head?.next?.val).toBe(2)
    expect(head?.next?.next).toBeNull()
  })

  it('buildCycle wires tail.next to the node at pos', () => {
    const head = buildCycle([3, 2, 0, -4], 1)
    expect(head?.val).toBe(3)
    const two = head?.next
    const zero = two?.next
    const neg4 = zero?.next
    expect(two?.val).toBe(2)
    expect(neg4?.val).toBe(-4)
    expect(neg4?.next).toBe(two)
  })

  it('buildCycle with pos < 0 leaves a linear list', () => {
    const head = buildCycle([1, 2], -1)
    expect(head?.next?.next).toBeNull()
  })
})

describe('tree harness', () => {
  it('round-trips level-order arrays through buildTree/treeToArray', () => {
    const fixtures: (number | null)[][] = [
      [],
      [1],
      [3, 9, 20, null, null, 15, 7],
      [1, 2, null, 3],
      [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5],
      [1, null, 2, null, 3],
    ]
    for (const arr of fixtures) {
      expect(treeToArray(buildTree(arr))).toEqual(arr)
    }
  })

  it('places children correctly', () => {
    const root = buildTree([1, 2, 3, null, 4])
    expect(root?.left?.val).toBe(2)
    expect(root?.right?.val).toBe(3)
    expect(root?.left?.left).toBeNull()
    expect(root?.left?.right?.val).toBe(4)
  })
})

describe('comparators', () => {
  it('deep-compares nested arrays and objects', () => {
    expect(resultsEqual([[1, 2], [3]], [[1, 2], [3]])).toBe(true)
    expect(resultsEqual([[1, 2], [3]], [[1, 2], [4]])).toBe(false)
    expect(resultsEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true)
  })

  it('order-insensitive comparison accepts reordered groups (Group Anagrams shape)', () => {
    const a = [['eat', 'tea'], ['bat']]
    const b = [['bat'], ['tea', 'eat']]
    expect(resultsEqual(a, b, true)).toBe(true)
    expect(resultsEqual(a, b, false)).toBe(false)
    expect(resultsEqual([['x']], [['y']], true)).toBe(false)
  })

  it('order-insensitive comparison handles flat arrays (Top-K shape)', () => {
    expect(resultsEqual([1, 2], [2, 1], true)).toBe(true)
    expect(resultsEqual([1, 2], [2, 3], true)).toBe(false)
  })

  it('canonicalize is stable for primitives and non-arrays', () => {
    expect(canonicalize('abc')).toBe('abc')
    expect(canonicalize(5)).toBe(5)
    expect(canonicalize(null)).toBe(null)
  })
})

describe('MinHeap', () => {
  it('pops values in key order', () => {
    const heap = new MinHeap<string>()
    heap.push(3, 'c')
    heap.push(1, 'a')
    heap.push(2, 'b')
    expect(heap.peek()).toBe('a')
    expect(heap.peekKey()).toBe(1)
    expect(heap.pop()).toBe('a')
    expect(heap.pop()).toBe('b')
    expect(heap.pop()).toBe('c')
    expect(heap.pop()).toBeUndefined()
  })

  it('handles duplicates and negative keys', () => {
    const heap = new MinHeap<number>()
    for (const k of [5, -2, 5, 0, -2]) heap.push(k, k)
    const out: number[] = []
    while (heap.size > 0) out.push(heap.pop()!)
    expect(out).toEqual([-2, -2, 0, 5, 5])
  })
})
