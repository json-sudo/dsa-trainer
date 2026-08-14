import { test, expect, type Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

async function typeIntoMonaco(page: Page, code: string) {
  const editor = page.locator('.monaco-editor').first()
  await expect(editor).toBeVisible({ timeout: 30_000 })
  // Set content through the Monaco model — keyboard input trips over
  // auto-closing brackets and produces mangled code.
  await page.waitForFunction(() => {
    const m = (window as unknown as { monaco?: { editor: { getModels(): unknown[] } } }).monaco
    return !!m && m.editor.getModels().length > 0
  })
  await page.evaluate((value) => {
    const m = (window as unknown as {
      monaco: { editor: { getModels(): { setValue(v: string): void }[] } }
    }).monaco
    m.editor.getModels()[0].setValue(value)
  }, code)
}

/** Complete one practice step: type, reveal, score 2, next. */
async function practiceStep(page: Page, pattern?: string) {
  await page.getByPlaceholder('Type your answer before revealing the model…').fill('my answer for this step')
  if (pattern) {
    await page.locator('select').selectOption(pattern)
  }
  await page.getByRole('button', { name: /Reveal model answer/ }).click()
  await page.getByRole('button', { name: '2', exact: true }).click()
  await page.getByRole('button', { name: /Next step/ }).click()
}

test('full journey: roadmap → guided walkthrough → practice problem → grade → progress', async ({ page }) => {
  await page.goto('/')

  // Roadmap: 18 topics, Arrays & Hashing unlocked with progress, others locked.
  await expect(page.getByText('DSA Trainer')).toBeVisible()
  await expect(page.getByText('Arrays & Hashing')).toBeVisible()
  await expect(page.getByText('unlock rule: ≥2 completed problems in every prerequisite')).toBeVisible()
  await expect(page.getByRole('button', { name: /Arrays & Hashing/ })).toContainText('0/4 done')

  // Locked node: not a button, tooltip on hover names the missing prerequisite.
  expect(await page.getByRole('button', { name: /Two Pointers/ }).count()).toBe(0)
  await page.getByText('Two Pointers').hover()
  await expect(page.getByRole('tooltip')).toHaveText('Complete 2 problems in Arrays & Hashing')

  // Into the topic page.
  await page.getByRole('button', { name: /Arrays & Hashing/ }).click()
  await expect(page.getByRole('heading', { name: 'Arrays & Hashing' })).toBeVisible()
  await expect(page.getByText('PATTERN PRIMER — HASHING')).toBeVisible()
  await expect(page.getByText('Not yet authored').first()).toBeVisible()
  // Problem rows carry difficulty badges.
  await expect(page.getByRole('button', { name: /Group Anagrams/ })).toContainText('medium')
  await expect(page.getByRole('button', { name: /Two Sum/ }).first()).toContainText('easy')

  // Guided walkthrough: Group Anagrams, all 10 steps.
  await page.getByRole('button', { name: /Group Anagrams/ }).click()
  await expect(page.getByText('STEP 1 OF 10')).toBeVisible()
  await page.getByRole('button', { name: /I've read it/ }).click()
  for (let step = 2; step <= 8; step++) {
    await expect(page.getByText(`STEP ${step} OF 10`)).toBeVisible()
    await expect(page.getByText('MODEL ANSWER', { exact: true })).toBeVisible()
    await expect(page.getByText('TEACHING NOTE', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: /Next step/ }).click()
  }
  // Step 9 (guided): incremental build chunks above an editor prefilled with
  // the reference solution — running it passes everything.
  await expect(page.getByText(/INCREMENTAL BUILD/)).toBeVisible()
  await expect(page.getByText('1. Buckets keyed by a canonical signature')).toBeVisible()
  await page.getByRole('button', { name: /Run tests/ }).click()
  await expect(page.getByText('6 / 6 passing')).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: /Submit & grade/ }).click()
  await expect(page.getByText('WALKTHROUGH COMPLETE')).toBeVisible()
  // The full walkthrough (model answers + incremental build + reference) is one click away.
  await page.getByRole('button', { name: 'Show the full walkthrough' }).click()
  await expect(page.getByText('Full walkthrough')).toBeVisible()
  await expect(page.getByText('INCREMENTAL BUILD', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Back to topic' }).click()

  // Practice problem: Two Sum, typed answers all the way.
  await page.getByRole('button', { name: /Two Sum/ }).click()
  await expect(page.getByText('STEP 1 OF 10')).toBeVisible()
  await page.getByRole('button', { name: /I've read it/ }).click()
  // Per-step and total timers are always visible in practice mode.
  await expect(page.getByText(/step \d{2}:\d{2} · total \d{2}:\d{2}/)).toBeVisible()
  for (let step = 2; step <= 8; step++) {
    await expect(page.getByText(`STEP ${step} OF 10`)).toBeVisible()
    await practiceStep(page, step === 6 ? 'hash-map' : undefined)
  }

  // Step 9: failing code first, with console output captured per case.
  await expect(page.getByText(/STEP 9 OF 10/)).toBeVisible()
  await typeIntoMonaco(
    page,
    'export function twoSum(nums: number[], target: number): number[] {\n  console.log("debug", nums.length)\n  return []\n}',
  )
  await page.getByRole('button', { name: /Run tests/ }).click()
  await expect(page.getByText('0 / 6 passing')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('✕ FAIL').first()).toBeVisible()
  await expect(page.getByText('console:')).toBeVisible()
  await expect(page.getByText('debug 4')).toBeVisible()

  // Fix it and pass.
  await typeIntoMonaco(
    page,
    'export function twoSum(nums: number[], target: number): number[] {\n' +
      '  const seen = new Map<number, number>()\n' +
      '  for (let i = 0; i < nums.length; i++) {\n' +
      '    const j = seen.get(target - nums[i])\n' +
      '    if (j !== undefined) return [j, i]\n' +
      '    seen.set(nums[i], i)\n' +
      '  }\n' +
      '  return []\n' +
      '}',
  )
  await page.getByRole('button', { name: /Run tests/ }).click()
  await expect(page.getByText('6 / 6 passing')).toBeVisible({ timeout: 30_000 })

  // Reference comparison unlocks after a run.
  await page.getByText('Compare with reference').click()
  await expect(page.getByText('REFERENCE SOLUTION')).toBeVisible()

  // Grade screen.
  await page.getByRole('button', { name: /Submit & grade/ }).click()
  await expect(page.getByText('PER-STEP SCORES')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Retry problem' })).toBeVisible()

  // Decline retry → full review sheet.
  await page.getByRole('button', { name: 'Show me the model answer' }).click()
  await expect(page.getByText('Full review')).toBeVisible()
  await expect(page.getByText(/REFERENCE SOLUTION/)).toBeVisible()

  // Back on the topic page the attempt count and best grade show.
  await page.getByRole('link', { name: 'Back to topic' }).click()
  await expect(page.getByRole('button', { name: /Two Sum/ }).first()).toContainText(/1 attempt · best/)

  // Two completed problems in Arrays & Hashing unlock its dependents immediately.
  await page.getByRole('link', { name: '← Roadmap' }).click()
  await expect(page.getByRole('button', { name: /Arrays & Hashing/ })).toContainText('2/4 done')
  await expect(page.getByRole('button', { name: /Two Pointers/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Stack/ })).toBeVisible()
  expect(await page.getByRole('button', { name: /Sliding Window/ }).count()).toBe(0)

  // Progress page shows the stats cards and the attempts.
  await page.goto('/#/progress')
  await expect(page.getByText('GRADES BY TOPIC')).toBeVisible()
  await expect(page.getByText('WEAKEST WIZARD STEPS')).toBeVisible()
  await expect(page.getByText('ATTEMPT HISTORY')).toBeVisible()
  await expect(page.getByText('Two Sum', { exact: true })).toBeVisible()
  await expect(page.getByText('Group Anagrams')).toBeVisible()
})

test('theme toggle switches to dark and persists across reloads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.getByRole('button', { name: /Switch to dark theme/ }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.getByText('DSA Trainer')).toBeVisible()
  await expect(page.locator('html')).toHaveClass(/dark/)
})
