/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const postCssImportPlugin = require('postcss-import');
const postCssUlrPlugin = require('postcss-url');

module.exports = {
  stories: [
    '../storybook/stories/**/*.stories.js',
    '../storybook/stories/**/*.stories.mdx',
    '../src/components/**/*.stories.js',
    '../src/components/**/*.stories.jsx',
    '../src/components/**/*.stories.ts',
    '../src/components/**/*.stories.tsx',
  ],
  addons: [
    {
      name: "@storybook/addon-styling",
      options: {
        cssBuildRule: {
          test: /\.(css|scss)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]--[hash:base64:5]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    postCssImportPlugin,
                    postCssUlrPlugin,
                  ],
                },
              },
            },
            'sass-loader',
          ],
          include: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../storybook')],
        },
      },
    },
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
    '@storybook/addon-storysource',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    'storybook-addon-external-links',
    '@storybook/addon-mdx-gfm'
  ],
  staticDirs: ['../public'],
  framework: "@storybook/react-webpack5",
  docs: {
    autodocs: true,
  }
};
