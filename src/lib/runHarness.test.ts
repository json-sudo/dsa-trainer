import { describe, expect, it } from 'vitest'
import { buildCycle, buildList, buildTree, listToArray, treeToArray } from './harness'
import {
  invokeEntry,
  lockdownWorkerGlobals,
  resolveActual,
  resolveArg,
  resolveExpected,
} from './runHarness'

describe('resolveArg / resolveExpected / resolveActual', () => {
  it('builds a linear list from $list without $pos', () => {
    const head = resolveArg({ $list: [1, 2] }, buildList, buildCycle, buildTree) as {
      val: number
      next: { val: number; next: null } | null
    }
    expect(head.val).toBe(1)
    expect(head.next?.val).toBe(2)
    expect(head.next?.next).toBeNull()
  })

  it('builds a cycle when $pos is present', () => {
    const head = resolveArg({ $list: [3, 2, 0, -4], $pos: 1 }, buildList, buildCycle, buildTree) as {
      next: { next: { next: { next: unknown } } }
    }
    expect(head.next.next.next.next).toBe(head.next)
  })

  it('builds a tree from $tree and leaves plain args alone', () => {
    const root = resolveArg({ $tree: [1, 2, 3] }, buildList, buildCycle, buildTree) as {
      val: number
      left: { val: number }
      right: { val: number }
    }
    expect(root.val).toBe(1)
    expect(root.left.val).toBe(2)
    expect(root.right.val).toBe(3)
    expect(resolveArg(7, buildList, buildCycle, buildTree)).toBe(7)
  })

  it('unwraps marker expected values and converts actual nodes back to arrays', () => {
    expect(resolveExpected({ $list: [1, 2] })).toEqual([1, 2])
    expect(resolveExpected({ $tree: [1, null, 2] })).toEqual([1, null, 2])
    expect(resolveExpected(true)).toBe(true)
    expect(
      resolveActual(buildList([1, 2]), { $list: [1, 2] }, listToArray as (h: unknown) => unknown, treeToArray),
    ).toEqual([1, 2])
    expect(resolveActual(true, true, listToArray as (h: unknown) => unknown, treeToArray)).toBe(true)
  })
})

describe('invokeEntry', () => {
  it('calls a plain function with the resolved args', () => {
    expect(invokeEntry((a: number, b: number) => a + b, [2, 3], 'plain', 'add')).toBe(5)
  })

  it('runs a class-design method sequence and maps undefined to null', () => {
    class Box {
      n: number
      constructor(n: number) {
        this.n = n
      }
      add(x: number) {
        this.n += x
      }
      get() {
        return this.n
      }
    }
    expect(
      invokeEntry(Box, [['Box', 'add', 'get'], [[1], [2], []]], 'class-design', 'Box'),
    ).toEqual([null, null, 3])
  })

  it('names the missing entry in the error', () => {
    expect(() => invokeEntry(undefined, [], 'plain', 'foo')).toThrow(/Function foo/)
    expect(() => invokeEntry(undefined, [], 'class-design', 'Bar')).toThrow(/Class Bar/)
  })
})

describe('lockdownWorkerGlobals', () => {
  it('clears fetch and indexedDB on the global object', () => {
    const g = globalThis as unknown as Record<string, unknown>
    const prevFetch = g.fetch
    const prevIdb = g.indexedDB
    g.fetch = () => undefined
    g.indexedDB = { open: () => undefined }
    try {
      lockdownWorkerGlobals()
      expect(g.fetch).toBeUndefined()
      expect(g.indexedDB).toBeUndefined()
    } finally {
      g.fetch = prevFetch
      g.indexedDB = prevIdb
    }
  })
})
