import wasm from '@yuyi/wasm-rollup';
import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import sourceMaps from 'rollup-plugin-sourcemaps';
// import { terserPlugin } from "./config/terser";
const terserPlugin = require('./config/terser').terserPlugin
// import typescript from 'rollup-plugin-typescript2';
// import ttypescript from 'ttypescript';
// import minify from 'rollup-plugin-babel-minify'
// import { InputOptions, OutputOptions } from 'rollup'

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const pkg = require('./package.json')
const cache = {};
// const config: InputOptions & { output: OutputOptions | OutputOptions[] } = {

function getConfig({ minify = false } = {}) {
// const config: InputOptions & { output: OutputOptions | OutputOptions[] } = {
  const config = {
    input: minify ? 'lib/index' : {
      "index": 'lib/index',
      // "TypeLib": 'lib/TypeLib',
      // "MobxUtils": 'lib/MobxUtils',
      // "EventEmitter": 'lib/EventEmitter',
      // "CustomUtils": 'lib/CustomUtils',
      // "OptionsUtils": 'lib/OptionsUtils',
      // "LodashExtra": 'lib/LodashExtra',
      // "PropertyUtils": 'lib/PropertyUtils',
      // "WasmLoader": 'lib/WasmLoader',
      // "TimeBuffer": 'lib/TimeBuffer',
      "NodeUtils": 'lib/NodeUtils'
    },
    output: minify ? [
      { file: 'dist/index.min.js', format: 'cjs', exports: 'named', sourcemap: true },
    ] : [
      // { dir: path.dirname(pkg.main), name: 'Utils', exports: 'named', format: 'es', sourcemap: true },
      // { dir: path.dirname(pkg.module), dynamicImportFunction: "import", format: 'es', exports: 'named', sourcemap: true },
      { dir: path.dirname(pkg.main), format: 'cjs', exports: 'named', sourcemap: true },
      // { dir: 'dist/umd', format: 'umd', exports: 'named', libraryName: 'Utils', sourcemap: true },
    ],
    cache: isDevelopment ? cache : false,
    inlineDynamicImports: false,
    treeshake: isProduction,
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: ["benchmark", "argparse", "fs"],
    watch: {
      include: ['lib/**'],
    },
    // @ts-ignore
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }], '@babel/plugin-syntax-dynamic-import']
      }),
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
      ...(!minify || isDevelopment ? [] : [terserPlugin]),
      // Resolve source maps to the original source
      sourceMaps(),
    ],
  }
  return config
}

export default [
  getConfig({}),
  getConfig({ minify: true })
]
