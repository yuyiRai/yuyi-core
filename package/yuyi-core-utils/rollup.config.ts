import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import json from 'rollup-plugin-json'
import typescript from 'rollup-plugin-typescript2';
import ttypescript from 'ttypescript';
import external from 'rollup-plugin-peer-deps-external'


const pkg = require('./package.json')
export default {
  input: `src/index.ts`,
  output: [
    { file: pkg.main, name: 'Utils', exports: 'named', format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'es', exports: 'named', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    external(),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        target: 'es5'
      },
      check: false,
      exclude: ['**/*.test.*', '**/*.spec.*'],
      typescript: ttypescript,
      useTsconfigDeclarationDir: true
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
