const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Root of the entire monorepo
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro resolve packages from monorepo root AND mobile node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Force Metro to resolve symlinks (critical for pnpm)
config.resolver.unstable_enableSymlinks = true;

module.exports = config;