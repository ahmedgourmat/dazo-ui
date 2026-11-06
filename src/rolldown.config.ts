import { defineConfig, type RolldownOptions } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import pkg from './package.json' with { type: 'json' }

// Never bundle peer dependencies (or their subpaths, e.g. react/jsx-runtime).
const deps = Object.keys(pkg.peerDependencies ?? {})
const external = (id: string): boolean =>
  deps.some((dep) => id === dep || id.startsWith(`${dep}/`))

// Each platform build tries its own files first:
//   import './button'  →  native build: button.native.tsx → button.tsx
//                      →  web build:    button.web.tsx    → button.tsx
const extensions = {
  native: ['.native.tsx', '.native.ts', '.tsx', '.ts'],
  web: ['.web.tsx', '.web.ts', '.tsx', '.ts'],
} as const

type Platform = keyof typeof extensions
type Format = 'es' | 'cjs'

const build = (platform: Platform, format: Format, types = false): RolldownOptions => ({
  input: { index: 'index.ts' },
  platform: 'neutral',
  external,
  resolve: { extensions: [...extensions[platform]] },
  transform: { jsx: 'react-jsx' },
  // .d.ts files are generated once, by Oxc (isolatedDeclarations is on in tsconfig.json).
  // Types are identical on every platform, so only the web ESM build emits them.
  plugins: types ? [dts({ generator: 'oxc' })] : [],
  output: {
    dir: `dist/${platform}`,
    format,
    preserveModules: true, // one output file per source file → tree-shakeable
    preserveModulesRoot: '.',
    entryFileNames: format === 'es' ? '[name].js' : '[name].cjs',
    sourcemap: true,
  },
})

export default defineConfig([
  build('web', 'es', true),
  build('web', 'cjs'),
  build('native', 'es'),
  build('native', 'cjs'),
])
