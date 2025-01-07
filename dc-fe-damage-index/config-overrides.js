// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const { merge } = require('webpack-merge');
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const { getWebpackConfig } = require('@corva/dc-platform-shared/cjs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = (env, argv) => {
  return merge(
    getWebpackConfig(env, argv),
    // NOTE: Custom webpack 4 plugins and module rules can be provided here
    {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
    }
  );
};
