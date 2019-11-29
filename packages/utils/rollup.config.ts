import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import json from 'rollup-plugin-json'
// import typescript from 'rollup-plugin-typescript2';
// import ttypescript from 'ttypescript';
import external from 'rollup-plugin-peer-deps-external'
import minify from 'rollup-plugin-babel-minify'
import rollup_plugin_terser from "rollup-plugin-terser";
import wasm from '@yuyi/wasm-rollup'
import path from 'path'

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const pkg = require('./package.json')
let cache = {};
const nameCache = {}
const staticVarName = "K$"
export default {
  input: {
    "index": 'lib/index.js',
    "NodeUtils": 'lib/NodeUtils'
  },
  output: [
    // { dir: path.dirname(pkg.main), name: 'Utils', exports: 'named', format: 'es', sourcemap: true },
    // { dir: path.dirname(pkg.main), format: 'es', exports: 'named', sourcemap: true },
    { dir: path.dirname(pkg.main), format: 'cjs', exports: 'named', sourcemap: true },
    // { dir: 'dist/umd', format: 'umd', exports: 'named', libraryName: 'Utils', sourcemap: true },
  ],
  cache: isDevelopment ? cache : false,
  treeshake: isProduction,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ["argparse", "fs"],
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
    ...(isDevelopment ? [] : [
      rollup_plugin_terser.terser({
        sourcemap: true,
        output: {
          preamble: "var " + staticVarName + ';',
          // beautify: true,
          comments: false,
        },
        nameCache: nameCache,
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 22,
          global_defs: {
            "process.env.NODE_ENV": process.env.NODE_ENV || "production",
            // "global.Constant$": "global.K",
            "@Object": staticVarName + ".OBJECT",
            // "@Object.defineProperty": staticVarName + ".OBJ_defineProperty$",
            "@Constant$": staticVarName,
            "@K$": staticVarName,
          }
        },
        parse: {

        },
        mangle: {
          properties: {
            keep_quoted: true,
            regex: /^_|^\$\$|\$\$$|(^([A-Z0-9$_])+$)|Constant\$|\_(.*?)\$$/,
            // debug: true,
            // @ts-ignore
            // undeclared: true,
            reserved: ['__esModule', '__mobxDecorators'],
          },
          toplevel: true
        },
        ecma: 5,
        toplevel: true,
        warnings: true,
      })
    ]),
    // Resolve source maps to the original source
    sourceMaps(),
  ],
}

setTimeout(() => {
  console.log(nameCache)
}, 10000);
