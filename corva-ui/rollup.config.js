import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import postcss from 'rollup-plugin-postcss';
import visualizer from 'rollup-plugin-visualizer';
import externals from 'rollup-plugin-node-externals';
import renameNodeModules from 'rollup-plugin-rename-node-modules';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import postcssImport from 'postcss-import';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalBuild = process.env.NODE_ENV === 'local';
// NOTE: Prod build for npmjs registry
const isProduction = process.env.NODE_ENV === 'production';

/**
 * @type {import('rollup').RollupOptions}
 */
const getConfig = commandArguments => {
  return [
    {
      input: isLocalBuild ? './src/exampleApp/index.js' : ['./src/index.js'],
      plugins: [
        replace({
          preventAssignment: true, // Prevent accidental global variable replacements
          values: {
            "import moment from 'moment';": "import moment from 'moment-timezone';",
            "const moment = require('moment');": "const moment = require('moment-timezone');",
          },
        }),
        postcss({
          extract: false,
          minimize: isProduction,
          plugins: [postcssImport()],
          autoModules: false,
          modules: {
            globalModulePaths: [/node_modules/, /global/],
          },
        }),
        // NOTE: This plugin automatically adds all devDeps and peerDeps as externals
        // Those dependencies will NOT be bundled
        !isLocalBuild && externals({ deps: true }),
        resolve({ browser: true, extensions }),
        !isDevelopment &&
          typescript({
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
              exclude: ['**/*.stories.*'],
            },
          }),
        babel({
          exclude: 'node_modules/**',
          extensions,
          babelHelpers: 'runtime',
        }),
        commonjs({ include: 'node_modules/**' }),
        json(),
        copy({
          targets: [
            {
              src: './src/styles',
              dest: './dist',
            },
            {
              src: './src/types.d.ts',
              dest: './dist',
            },
          ],
        }),

        isLocalBuild && injectProcessEnv({ NODE_ENV: 'development' }),
        // NOTE: Use terser and cleanup only for production build without active watcher
        isProduction && terser(),
        isProduction && cleanup({ comments: false }),

        // NOTE: See https://github.com/rollup/rollup/issues/3684
        !isLocalBuild && renameNodeModules('ext-esm'),

        isProduction &&
          visualizer({
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        isLocalBuild && serve({ open: true, contentBase: ['public', 'dist'], port: 10001 }),
        isLocalBuild && livereload({ watch: 'dist' }),
      ],
      output: {
        format: commandArguments.format,
        preserveModules: !isLocalBuild,
        preserveModulesRoot: 'src',
        sourcemap: !isProduction,
        ...(isLocalBuild
          ? { file: `dist/${commandArguments.format === 'cjs' ? 'cjs-' : ''}bundle.js` }
          : { dir: `dist${commandArguments.format === 'cjs' ? '/cjs-bundle' : ''}` }),
      },
      external: isLocalBuild ? [] : [/@babel\/runtime/],
      treeshake: true,
    },
  ];
};

export default getConfig;
