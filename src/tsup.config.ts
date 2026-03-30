import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: false,
  treeshake: true,
  tsconfig: 'tsconfig.json',
  external: [
    'react',
    'react-native',
    'react-native-web',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})