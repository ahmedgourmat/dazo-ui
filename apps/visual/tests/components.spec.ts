import { expect, test, type Page } from '@playwright/test'

// One screenshot per section of src/Fixtures.tsx, in light and dark, plus the
// states that need an interaction: keyboard focus, hover, and an open Select.

const sections = ['buttons', 'text', 'inputs', 'choices', 'select-file', 'form-field', 'table', 'status', 'skeleton', 'surfaces']
const schemes = ['light', 'dark'] as const

const open = async (page: Page, scheme: (typeof schemes)[number]) => {
  await page.goto(`/?scheme=${scheme}`)
  await expect(page.getByTestId('surfaces')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
}

for (const scheme of schemes) {
  test.describe(scheme, () => {
    test.use({ colorScheme: scheme })

    for (const section of sections) {
      test(section, async ({ page }) => {
        await open(page, scheme)
        await expect(page.getByTestId(section)).toHaveScreenshot(`${section}-${scheme}.png`)
      })
    }

    test('keyboard focus ring', async ({ page }) => {
      await open(page, scheme)
      // The ring shows only when focus comes from the keyboard.
      await page.keyboard.press('Shift')
      await page.getByTestId('focus-target').focus()
      await expect(page.getByTestId('buttons')).toHaveScreenshot(`buttons-focus-${scheme}.png`)
    })

    test('hover', async ({ page }) => {
      await open(page, scheme)
      await page.getByTestId('hover-target').hover()
      await expect(page.getByTestId('buttons')).toHaveScreenshot(`buttons-hover-${scheme}.png`)
    })

    test('open Select', async ({ page }) => {
      await open(page, scheme)
      await page.getByTestId('select-target').click()
      await expect(page.getByRole('dialog', { name: 'Plan' }).getByRole('radio', { name: 'Pro' })).toBeVisible()
      await expect(page).toHaveScreenshot(`select-open-${scheme}.png`)
    })
  })
}
