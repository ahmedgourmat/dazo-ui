import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts', 'index.web.ts', 'index.native.ts'],
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
    'react-native-svg',
    'lucide-react-native',
    'lucide-react',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})