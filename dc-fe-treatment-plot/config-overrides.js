const { resolve } = require('path');
const { merge } = require('webpack-merge');
const { getWebpackConfig } = require('@corva/dc-platform-shared/cjs');

module.exports = (env, argv) => {
  const baseConfig = getWebpackConfig(env, argv);
  const extendedConfig = merge(baseConfig, getExtendedConfig());
  replaceLoaderWith(extendedConfig, 'css-loader', cssLoader);
  return extendedConfig;
};

function replaceLoaderWith(extendedConfig, loaderName, nextLoader) {
  extendedConfig.module.rules = extendedConfig.module.rules.filter(rule => {
    if (Array.isArray(rule.use)) {
      for (const use of rule.use) {
        if (typeof use === 'string' && use === loaderName) return true;
        if (use?.loader === loaderName) return false;
      }

      return true;
    }

    if (rule.use?.loader === loaderName) return false;

    return true;
  });

  extendedConfig.module.rules.push(nextLoader);
}
const getExtendedConfig = () => {
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        // NOTE: Enable this when linking corva/ui
        // react: resolve('./node_modules/react'),
      },
    },
  };
};

const cssLoader = {
  test: /\.css$/i,
  use: [
    'style-loader',
    { loader: 'css-loader', options: { modules: false, importLoaders: 1 } },
    {
      loader: 'postcss-loader',
      options: { postcssOptions: { plugins: ['postcss-preset-env'] } },
    },
  ],
};
