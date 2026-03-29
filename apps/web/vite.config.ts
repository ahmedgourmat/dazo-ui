import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'react-native',
        replacement: 'react-native-web',
      },
    ],
    extensions: [
      '.web.tsx', '.web.ts',
      '.tsx', '.ts',
      '.jsx', '.js',
    ],
  },
  optimizeDeps: {
    include: ['react-native-web'],
    exclude: ['react-native'],
    // tell Vite to crawl into your library source too
    entries: [
      '../../src/index.ts',
      './src/**/*.tsx',
    ],
  },
})