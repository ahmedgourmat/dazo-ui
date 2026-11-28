import { defineConfig, devices } from '@playwright/test'

const linux = process.platform === 'linux'

/**
 * Screenshot tests (issue #81). The reference screenshots in
 * tests/__screenshots__ come from Linux, in the same Docker image CI uses
 * (mcr.microsoft.com/playwright:v1.65.1-noble), because fonts and
 * anti-aliasing differ between systems. On Windows and macOS, screenshots go
 * to a per-system folder that git ignores, for comparing your own changes
 * locally. See CONTRIBUTING.md.
 */
export default defineConfig({
  testDir: 'tests',
  snapshotPathTemplate: linux
    ? '{testDir}/__screenshots__/{arg}{ext}'
    : '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:4180',
    viewport: { width: 860, height: 900 },
    deviceScaleFactor: 1,
    // Components skip their animations; CSS ones are stopped by `animations` below.
    reducedMotion: 'reduce',
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide' },
  },
  // The production build of the fixture page, like a real web app ships.
  webServer: {
    command: 'pnpm build && pnpm preview',
    url: 'http://localhost:4180',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
