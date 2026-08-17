import { describe, expect, it } from 'vitest'
import { linkedListCycle } from '../data/problems/linked-list/linked-list-cycle'
import { minStack } from '../data/problems/stack/min-stack'
import { buildWorkerSource, entryName } from './executor'
import { runAllCases } from './nodeRunner'

describe('entryName', () => {
  it('reads the function or class name out of a starter signature', () => {
    expect(entryName('export function hasCycle(head: ListNode | null): boolean {\n}\n')).toBe('hasCycle')
    expect(entryName('export class MinStack {\n}\n')).toBe('MinStack')
  })

  it('throws when the signature has no function or class', () => {
    expect(() => entryName('const x = 1')).toThrow(/Cannot find entry name/)
  })
})

describe('buildWorkerSource', () => {
  it('embeds lockdown, shared harness helpers, and the user entry', () => {
    const source = buildWorkerSource({
      userCode: 'export function foo(x: number) { return x + 1 }',
      tests: [{ args: [1], expected: 2, label: 'plus one' }],
      entry: 'foo',
      harness: 'plain',
    })
    expect(source).toContain('indexedDB')
    expect(source).toContain('fetch')
    expect(source).toContain('importScripts')
    expect(source).toContain('buildCycle')
    expect(source).toContain('invokeEntry')
    expect(source).toContain('resolveArg')
    expect(source).toContain('foo')
  })
})

describe('linked list cycle judging', () => {
  it('trains the interview signature: Floyd on head, not (values, pos)', () => {
    expect(linkedListCycle.code.signature).toMatch(/hasCycle\(head: ListNode/)
    expect(linkedListCycle.code.harness).toBe('linked-list')
    expect(linkedListCycle.code.tests[0]?.args[0]).toEqual({ $list: [3, 2, 0, -4], $pos: 1 })
    expect(linkedListCycle.code.referenceSolution).toMatch(/function hasCycle\(head/)
    expect(linkedListCycle.code.referenceSolution).not.toMatch(/function hasCycle\(values/)
  })

  it('passes a Floyd walk that never sees values or pos', () => {
    const floyd = `
      export function hasCycle(head) {
        let slow = head, fast = head
        while (fast && fast.next) {
          slow = slow.next
          fast = fast.next.next
          if (slow === fast) return true
        }
        return false
      }
    `
    const results = runAllCases(linkedListCycle, floyd)
    expect(results.every((r) => r.pass)).toBe(true)
  })
})

describe('class-design harness', () => {
  it('runs a MinStack sequence the same way the worker would', () => {
    const results = runAllCases(minStack, minStack.code.referenceSolution)
    expect(results.every((r) => r.pass)).toBe(true)
  })
})
