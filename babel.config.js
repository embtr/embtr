module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            src: './src',
            resources: './resources',
            assets: './assets',
          },
        },
      ],
      'react-native-reanimated/plugin'
    ],
  };
};
