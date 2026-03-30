const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// force Metro to resolve react and react-native
// ALWAYS from the mobile app — never from the library
config.resolver.extraNodeModules = {
  'react':             path.resolve(workspaceRoot, 'node_modules/react'),
  'react-native':      path.resolve(workspaceRoot, 'node_modules/react-native'),
  'react-dom':         path.resolve(workspaceRoot, 'node_modules/react-dom'),
}

module.exports = config