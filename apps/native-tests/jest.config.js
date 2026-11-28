const path = require('node:path')

// The folder of a package as installed for this test project.
const local = (name) => path.dirname(require.resolve(`${name}/package.json`))

/**
 * Renders dazo-ui with React Native itself (issue #81). The library's Vitest
 * suite renders through react-native-web in a simulated browser; this one
 * loads `dist/native`, the build iOS and Android apps get, through the
 * `react-native` export condition that React Native's Jest preset sets.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  preset: 'react-native',
  testMatch: ['<rootDir>/tests/**/*.test.tsx'],
  // A cold cache (always the case in CI) compiles React Native inside the first
  // tests that touch it, which takes longer than Jest's default 5 seconds.
  testTimeout: 30_000,
  // pnpm keeps packages under node_modules/.pnpm/<name>@<version>/node_modules/<name>,
  // so the preset's pattern needs that prefix to keep compiling React Native.
  transformIgnorePatterns: [
    'node_modules/(?!(?:\.pnpm/[^/]+/node_modules/)?(?:(?:jest-)?react-native|@react-native(?:-community)?)/)',
  ],
  // dazo-ui is linked from ../../src, whose own node_modules has the React and
  // React Native its Vitest suite uses. One copy of each, the ones an Expo SDK 54
  // app has, or hooks break ("Invalid hook call").
  moduleNameMapper: {
    '^react$': local('react'),
    '^react/(.*)$': `${local('react')}/$1`,
    '^react-native$': local('react-native'),
    '^react-native/(.*)$': `${local('react-native')}/$1`,
  },
}
