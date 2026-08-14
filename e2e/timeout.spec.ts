import { test, expect } from '@playwright/test'

/**
 * Worker timeout: submit an infinite loop and confirm the app stays
 * responsive and reports the timeout. A draft at step 9 is seeded through
 * localStorage (drafts are a persistence feature) to land on the code step.
 */
test('infinite loop times out without hanging the app', async ({ page }) => {
  const draft = {
    version: 1,
    attempts: [
      {
        id: 'seeded-timeout-attempt',
        problemId: 'two-sum',
        mode: 'practice',
        startedAt: new Date().toISOString(),
        currentStep: 9,
        answers: { 2: 'a', 3: 'b', 4: 'c', 5: 'd', 6: 'e', 7: 'plan', 8: 'script' },
        revealed: [2, 3, 4, 5, 6, 7, 8],
        patternPick: { pattern: 'hash-map', verdict: 'correct' },
        stepScores: [2, 3, 4, 5, 6, 7, 8].map((step) => ({ step, score: 2, elapsedSec: 10 })),
        stepSeconds: {},
        totalSec: 300,
      },
    ],
  }
  await page.addInitScript((state) => {
    window.localStorage.setItem('dsa-trainer/v1', JSON.stringify(state))
  }, draft)

  await page.goto('/#/problem/two-sum')
  await expect(page.getByText(/STEP 9 OF 10/)).toBeVisible()

  const editor = page.locator('.monaco-editor').first()
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await page.waitForFunction(() => {
    const m = (window as unknown as { monaco?: { editor: { getModels(): unknown[] } } }).monaco
    return !!m && m.editor.getModels().length > 0
  })
  await page.evaluate((value) => {
    const m = (window as unknown as {
      monaco: { editor: { getModels(): { setValue(v: string): void }[] } }
    }).monaco
    m.editor.getModels()[0].setValue(value)
  }, 'export function twoSum(nums: number[], target: number): number[] {\n  while (true) {}\n  return []\n}')

  await page.getByRole('button', { name: /Run tests/ }).click()
  await expect(page.getByText('⏱ TIMEOUT')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText(/ran past 3s — likely an infinite loop/)).toBeVisible()

  // The app is still responsive: navigation works immediately.
  await page.getByRole('link', { name: 'Patterns' }).click()
  await expect(page.getByText('Patterns reference')).toBeVisible()
})
