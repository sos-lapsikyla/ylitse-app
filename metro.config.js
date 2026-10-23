
const {
  getDefaultConfig,
  mergeConfig,
} = require('@react-native/metro-config');

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    assetPlugins: ['react-native-svg-asset-plugin'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
