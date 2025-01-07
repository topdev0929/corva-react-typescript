const path = require('path');

const { getWebpackConfig } = require('@corva/dc-platform-shared/cjs');
const { merge } = require('webpack-merge');

module.exports = (env, argv) => {
  return merge(
    getWebpackConfig(env, argv),
    // NOTE: Custom webpack 5 plugins and module rules can be provided here
    {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
    }
  );
};
