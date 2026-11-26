// Copies the repo's README.md and LICENSE into the package before it is
// packed or published (the "prepack" script), so npm shows the same README
// as GitHub and the package carries its license. The copies are gitignored:
// the files at the repo root are the ones to edit.
import { copyFileSync } from 'node:fs'

for (const file of ['README.md', 'LICENSE']) {
  copyFileSync(new URL(`../../${file}`, import.meta.url), new URL(`../${file}`, import.meta.url))
}

console.log('copy-root-docs: copied README.md and LICENSE from the repo root')
