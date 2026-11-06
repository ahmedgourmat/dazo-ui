// Creates a .d.cts twin for every .d.ts in dist/web.
//
// rolldown-plugin-dts only emits types for the ESM build. TypeScript treats a
// .d.ts file in a "type": "module" package as ESM, so require() users would get
// ESM types for CJS code. The .d.cts copies point their imports at the .cjs
// files, so TypeScript reads them as CommonJS types.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  )

let count = 0
for (const file of walk('dist/web')) {
  if (!file.endsWith('.d.ts')) continue

  const source = readFileSync(file, 'utf8')
    // './button.js' → './button.cjs' (TypeScript then resolves './button.d.cts')
    .replace(/(['"])(\.{1,2}\/[^'"]+)\.js\1/g, '$1$2.cjs$1')
    // the declaration map belongs to the .d.ts file
    .replace(/^\/\/# sourceMappingURL=.*$/m, '')

  writeFileSync(file.slice(0, -'.d.ts'.length) + '.d.cts', source)
  count++
}

console.log(`emit-cjs-types: wrote ${count} .d.cts files`)
