module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './pages',
            rootPathPrefix: '@pages',
          },
          {
            rootPathSuffix: './components',
            rootPathPrefix: '@components',
          },
          {
            rootPathSuffix: './composables',
            rootPathPrefix: '@composables',
          },
          {
            rootPathSuffix: './utils',
            rootPathPrefix: '@utils',
          },
        ],
      },
    ],
  ],
};
