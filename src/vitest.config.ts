import { defineConfig, type ViteUserConfig } from 'vitest/config'

// Tests render the components with react-native-web in jsdom (a simulated browser).
//
// They run twice, once per platform build:
//   web     resolves *.web.ts(x) first    (e.g. systemFont.web.ts) — what web apps get
//   native  resolves *.native.ts(x) first (e.g. systemFont.ts)     — what iOS/Android apps get
// The native run still renders through react-native-web, so it checks each
// component's behaviour (props, callbacks, state), not how iOS or Android draws it.
const project = (name: 'web' | 'native'): ViteUserConfig => ({
  resolve: {
    alias: [{ find: /^react-native$/, replacement: 'react-native-web' }],
    extensions: [`.${name}.tsx`, `.${name}.ts`, '.tsx', '.ts', '.mjs', '.js', '.json'],
  },
  test: {
    name,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**'],
    // react-native-web ships ESM without file extensions, so let Vite load it.
    server: { deps: { inline: ['react-native-web'] } },
  },
})

export default defineConfig({
  test: {
    projects: [project('web'), project('native')],
  },
})
