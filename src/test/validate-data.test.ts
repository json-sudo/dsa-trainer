/**
 * Data validation (`npm run validate-data`): every authored problem has all
 * required fields, and every reference solution passes its own test cases in
 * Node. Doubles as the spec's "reference solutions × test cases" test.
 */
import { describe, expect, it } from 'vitest'
import { allProblems, authoredProblems } from '../data'
import { topics } from '../data/roadmap'
import { patternById, patterns } from '../data/patterns'
// @ts-expect-error plain-JS catalog module
import { catalog } from '../../scripts/catalog.mjs'
import { runAllCases } from '../lib/nodeRunner'
import { entryName } from '../lib/executor'

type CatalogRow = [string, number, string, string, string, string[], boolean]
const catalogRows: Record<string, CatalogRow[]> = catalog

describe('catalog coverage', () => {
  it('has all 126 problems registered (116 authored, 10 stubs)', () => {
    expect(allProblems).toHaveLength(126)
    expect(authoredProblems()).toHaveLength(116)
  })

  it('every topic lists 7 problems in catalog order (2 guided then 5 practice)', () => {
    for (const topic of topics) {
      expect(topic.problemIds, topic.id).toHaveLength(7)
      const rows = catalogRows[topic.id]
      expect(topic.problemIds, topic.id).toEqual(rows.map((r) => r[0]))
    }
  })

  it('v1-flagged problems are authored; unflagged are stubs', () => {
    for (const [topicId, rows] of Object.entries(catalogRows)) {
      for (const [slug, lc, title, diff, mode, patterns, v1] of rows) {
        const problem = allProblems.find((p) => p.id === slug)
        expect(problem, `${topicId}/${slug}`).toBeDefined()
        expect(problem!.authored, `${slug} authored flag`).toBe(v1)
        expect(problem!.leetcodeId, slug).toBe(lc)
        expect(problem!.title, slug).toBe(title)
        expect(problem!.difficulty, slug).toBe(diff)
        expect(problem!.mode, slug).toBe(mode)
        expect(problem!.topicId, slug).toBe(topicId)
        const accepted = problem!.authored
          ? problem!.steps.wasteAndPattern.acceptedPatterns
          : problem!.acceptedPatterns
        expect(accepted.length, `${slug} acceptedPatterns`).toBeGreaterThan(0)
        expect(accepted[0], `${slug} primary pattern`).toBe(patterns[0])
        for (const p of accepted) expect(patternById[p], `${slug} pattern ${p}`).toBeDefined()
      }
    }
  })
})

describe('patterns data', () => {
  it('every PatternId has a primer with tells and a code template', () => {
    expect(patterns).toHaveLength(21)
    for (const p of patterns) {
      expect(p.when.length, p.id).toBeGreaterThan(20)
      expect(p.firstMove.length, p.id).toBeGreaterThan(20)
      expect(p.complexity.length, p.id).toBeGreaterThan(3)
      expect(p.tells.length, p.id).toBeGreaterThanOrEqual(3)
      expect(p.codeTemplate.length, `${p.id} codeTemplate`).toBeGreaterThan(60)
      expect(p.codeTemplate, `${p.id} codeTemplate comments`).toContain('//')
    }
  })
})

describe('authored problem schema', () => {
  for (const problem of authoredProblems()) {
    describe(problem.id, () => {
      it('has statement, examples, constraints', () => {
        expect(problem.statement.length).toBeGreaterThan(40)
        expect(problem.examples.length).toBeGreaterThan(0)
        expect(problem.constraints.length).toBeGreaterThan(0)
      })

      it('has model answers and rubrics for steps 2–8', () => {
        const steps = [
          problem.steps.inputsOutputs,
          problem.steps.whatToFind,
          problem.steps.constraintsHint,
          problem.steps.bruteForce,
          problem.steps.wasteAndPattern,
          problem.steps.algorithm,
          problem.steps.interviewScript,
        ]
        for (const step of steps) {
          expect(step.modelAnswer.length).toBeGreaterThan(20)
          expect(step.rubric.length).toBeGreaterThanOrEqual(2)
        }
        if (problem.mode === 'guided') {
          for (const step of steps) {
            expect(step.teachingNote, `${problem.id} guided teachingNote`).toBeTruthy()
          }
        }
      })

      it('has >=5 test cases including a labeled edge case', () => {
        expect(problem.code.tests.length).toBeGreaterThanOrEqual(5)
        expect(
          problem.code.tests.some((t) => t.label && t.label.length > 0),
          'at least one labeled edge case',
        ).toBe(true)
        expect(problem.code.tests.some((t) => t.hidden)).toBe(true)
      })

      if (problem.mode === 'guided') {
        it('has an incremental build of 3–5 labeled chunks (guided step 9)', () => {
          expect(problem.incrementalBuild, `${problem.id} incrementalBuild`).toBeDefined()
          expect(problem.incrementalBuild!.length).toBeGreaterThanOrEqual(3)
          expect(problem.incrementalBuild!.length).toBeLessThanOrEqual(5)
          for (const chunk of problem.incrementalBuild!) {
            expect(chunk.label.length).toBeGreaterThan(3)
            expect(chunk.code.length).toBeGreaterThan(10)
          }
        })
      }

      it('has a parsable signature and stated complexity', () => {
        expect(() => entryName(problem.code.signature)).not.toThrow()
        expect(problem.code.complexity.time).toBeTruthy()
        expect(problem.code.complexity.space).toBeTruthy()
      })

      it('reference solution passes all its own test cases', () => {
        const results = runAllCases(problem, problem.code.referenceSolution)
        for (const r of results) {
          expect(
            r.pass,
            `${problem.id} · ${r.label}: expected ${JSON.stringify(r.expected)}, got ${JSON.stringify(
              r.actual,
            )}${r.error ? ` (${r.error})` : ''}`,
          ).toBe(true)
        }
      })
    })
  }
})
