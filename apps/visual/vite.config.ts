import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The same setup a web app uses: react-native aliased to react-native-web,
// and the library's web build (dist/web) through its package exports.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { 'react-native': 'react-native-web' },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js'],
  },
})
