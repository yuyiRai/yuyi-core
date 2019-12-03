import wasm from '@yuyi/wasm-rollup'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import rollup_plugin_terser from "rollup-plugin-terser"

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
let cache = {};
const nameCache = {}
const staticVarName = "K$"
export default {
  input: 'lib/index.js',
  output: { file: 'dist/index.umd.js', format: 'umd', exports: 'named', name: 'yuyiUtils', sourcemap: true },
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
    // external(),
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
          passes: 20,
          global_defs: {
            "process.env.NODE_ENV": process.env.NODE_ENV || "production",
            // "global.Constant$": "global.K",
            "@K$": staticVarName,
            "@Constant$": staticVarName,
          }
        },
        parse: {

        },
        mangle: {
          properties: {
            keep_quoted: true,
            regex: /^_|^\$\$|\$\$$|(^([A-Z0-9$_])+$)|Constant\$/,
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
