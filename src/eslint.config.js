import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Same setup as apps/web, minus react-refresh (that one is for Vite apps, not libraries).
export default defineConfig([
  globalIgnores(['dist', 'coverage', '.turbo']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },
  {
    // Build scripts and config files run in Node.
    files: ['scripts/**/*.js', '*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
])
