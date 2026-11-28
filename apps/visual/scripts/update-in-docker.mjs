// Writes the reference screenshots (tests/__screenshots__/*.png) from Linux,
// in the same Docker image CI compares them in, so they match pixel for pixel.
// Needs Docker running. Usage: pnpm --filter visual test:visual:update
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Keep in step with @playwright/test in package.json and the CI workflows.
const IMAGE = 'mcr.microsoft.com/playwright:v1.65.1-noble'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '../../..')
const screenshots = path.resolve(here, '../tests/__screenshots__')

const steps = [
  'set -e',
  // Work on a copy without the host's node_modules, which hold binaries built for the host system.
  'mkdir /work',
  'tar -C /repo --exclude=node_modules --exclude=dist --exclude=.turbo --exclude=.git -cf - . | tar -C /work -xf -',
  'cd /work',
  'npm install --global pnpm@9.0.0 --silent',
  'pnpm install --frozen-lockfile',
  // dazo-ui first; the test's web server builds the fixture page itself.
  'pnpm turbo run build --filter=dazo-ui',
  'cd apps/visual',
  'CI=1 npx playwright test --update-snapshots=all',
  'rm -f /out/*.png',
  'cp tests/__screenshots__/*.png /out/',
]

execFileSync(
  'docker',
  ['run', '--rm', '--ipc=host', '-v', `${repo}:/repo:ro`, '-v', `${screenshots}:/out`, IMAGE, 'bash', '-c', steps.join('\n')],
  { stdio: 'inherit' },
)
console.log(`Reference screenshots written to ${screenshots}`)
