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

// 4. Always load these packages from the mobile app, never from dazo-ui's own
//    node_modules. The app pins the versions Expo SDK 54 expects, while the
//    linked library (../../src) can resolve different ones. Two copies of React
//    crash with "Invalid hook call", and two copies of react-native-svg fail to
//    register their native views.
const singletons = ['react', 'react-native', 'react-native-svg'];
const appOrigin = path.join(projectRoot, 'package.json');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = singletons.some(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`),
  );
  return context.resolveRequest(
    isSingleton ? { ...context, originModulePath: appOrigin } : context,
    moduleName,
    platform,
  );
};

module.exports = config;