module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    // NOTE: Starting from Babel 8, "automatic" will be the default runtime for this plugin
    ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    [
      'babel-plugin-root-import',
      {
        rootPathSuffix: 'src',
        rootPathPrefix: '~',
      },
    ],
    !process.env.IS_STORYBOOK_BUILD && [
      'file-loader',
      {
        name: '[hash].[ext]',
        extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'],
        publicPath: '/static/media',
        outputPath: '/dist/assets',
        context: '',
        limit: 0,
      },
    ],
  ].filter(Boolean),
};
