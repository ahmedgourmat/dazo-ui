import { defineConfig, type RolldownOptions } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import pkg from './package.json' with { type: 'json' }

// Never bundle peer dependencies (or their subpaths, e.g. react/jsx-runtime).
const deps = Object.keys(pkg.peerDependencies ?? {})
const external = (id: string): boolean =>
  deps.some((dep) => id === dep || id.startsWith(`${dep}/`))

// Each platform build tries its own files first:
//   import './systemFont'  →  native build: systemFont.native.ts → systemFont.ts
//                          →  web build:    systemFont.web.ts    → systemFont.ts
const extensions = {
  native: ['.native.tsx', '.native.ts', '.tsx', '.ts'],
  web: ['.web.tsx', '.web.ts', '.tsx', '.ts'],
} as const

type Platform = keyof typeof extensions
type Format = 'es' | 'cjs'

// dazo-ui/server and dazo-ui/next only make sense on the web (server rendering
// through react-native-web), so the native builds leave them out.
const inputs = {
  native: { index: 'index.ts' },
  web: { index: 'index.ts', 'server/index': 'server/index.tsx', 'server/next': 'server/next.tsx' },
} as const

const build = (platform: Platform, format: Format, types = false): RolldownOptions => ({
  input: { ...inputs[platform] },
  platform: 'neutral',
  external,
  // dazo-ui/next starts with 'use client' so Next.js runs it on the client side of
  // the tree. Rolldown keeps the directive (one output file per module) but warns
  // that bundling could drop it; that warning is expected for this one file.
  onLog(level, log, handler) {
    if (log.code === 'MODULE_LEVEL_DIRECTIVE' && /server[\\/]next\.tsx$/.test(log.id ?? '')) return
    handler(level, log)
  },
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
