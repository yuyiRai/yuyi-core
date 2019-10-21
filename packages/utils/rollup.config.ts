import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import json from 'rollup-plugin-json'
// import typescript from 'rollup-plugin-typescript2';
// import ttypescript from 'ttypescript';
import external from 'rollup-plugin-peer-deps-external'
import minify from 'rollup-plugin-babel-minify'
import wasm from '@yuyi/wasm-rollup'
import path from 'path'

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const pkg = require('./package.json')
let cache = {};
export default {
  input: `lib/index.js`,
  output: [
    // { dir: path.dirname(pkg.main), name: 'Utils', exports: 'named', format: 'es', sourcemap: true },
    // { dir: path.dirname(pkg.main), format: 'es', exports: 'named', sourcemap: true },
    { dir: path.dirname(pkg.main), format: 'cjs', exports: 'named', sourcemap: true },
  ],
  cache: isDevelopment ? cache : false,
  treeshake: isProduction,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ["lodash", "argparse", "fs"],
  watch: {
    include: 'lib/**',
  },
  plugins: [
    wasm({
      sync: [
        // 不在这里登陆过的只能使用() => import("..")的方式
        'wasm/program.wasm'
      ]
    }),
    external(),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    // typescript({
    //   rollupCommonJSResolveHack: true,
    //   clean: true,
    //   tsconfig: 'tsconfig.prod.json',
    //   tsconfigOverride: {
    //     target: 'es5'
    //   },
    //   check: false,
    //   exclude: ['**/*.test.*', '**/*.spec.*', '../../node_modules'],
    //   typescript: ttypescript,
    //   useTsconfigDeclarationDir: true
    // }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    ...(isDevelopment ? [] : [minify({
      // 清除注释
      comments: false,
      // 清除debugger
      removeDebugger: true,
      // 清除console
      removeConsole: true
    })]),
    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
