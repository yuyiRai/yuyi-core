import wasm from '@yuyi/wasm-rollup';
import copy from 'rollup-plugin-copy-glob'
import fs from 'fs-extra';
import { castArray } from 'lodash';
import path from 'path';
import { InputOptions, OutputOptions, rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { getTerser } from './terser';
// import analyze from 'rollup-plugin-analyzer'
import visualizer from 'rollup-plugin-visualizer'


export class NameCache {
  static path = path.join(__dirname, './nameCache.json')
  static read(): { vars: NameCache.CacheEntires, props: NameCache.CacheEntires } {
    return fs.existsSync(NameCache.path) ? fs.readJSONSync(NameCache.path) : { vars: { props: {} }, props: { props: {} }}
  }
  static write(data: any) {
    return fs.writeJSONSync(path.join(__dirname, './nameCache.json'), data, { spaces: 2 })
  }
}
export namespace NameCache {
  export type CacheEntires = { props: IKeyValueMap<string> }
}

const nameCache = NameCache.read()

const ignoredWarn = {
  'NAMESPACE_CONFLICT': false,
  'NON_EXISTENT_EXPORT': false,
  'UNUSED_EXTERNAL_IMPORT': false,
  'CIRCULAR_DEPENDENCY': false
}


const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const pkg = require('../package.json');
const now = new Date(Date.now());
const cache = {};

const modeOptions = {
  libs(minify = true) {
    return {
      minify,
      input: {
        "index": 'lib/index',
        "TypeLib": 'lib/TypeLib',
        "EventEmitter": 'lib/EventEmitter',
        "CustomUtils": 'lib/CustomUtils',
        "OptionsUtils": 'lib/OptionsUtils',
        "LodashExtra": 'lib/LodashExtra',
        "PropertyUtils": 'lib/PropertyUtils',
        "TimeBuffer": 'lib/TimeBuffer',
        "WasmLoader": 'lib/WasmLoader',
        "Constransts": 'lib/Constransts',
        "NodeUtils": 'lib/NodeUtils'
      },
      output: [
        { dir: path.dirname(pkg.main) + '/lib', format: 'cjs', exports: 'named', sourcemap: true }
      ]
    }
  },
  node: (minify = false) => ({
    minify,
    mangle: false,
    input: 'lib/NodeUtils',
    output: [
      {
        file: 'dist/NodeUtils.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      }
    ]
  }),
  helpersOnly: (minify = false) => ({
    minify,
    mangle: false,
    input: 'lib/Constransts',
    output: [
      { file: 'dist/Constransts.js', format: 'cjs', exports: 'named', sourcemap: true },
      { file: 'dist/Constransts.umd.js', format: 'umd', exports: 'named', name: 'yuyiUtils', sourcemap: true }
    ]
  }),
  dev: () => ({
    minify: false,
    mangle: true,
    debug: true,
    input: 'lib/index.export',
    output: [
      { file: 'dist/index.cjs.development.js', format: 'cjs', exports: 'named', name: 'yuyiUtils', sourcemap: true },
    ]
  }),
  cjs: (minify = true) => ({
    minify,
    mangle: minify,
    debug: false,
    input: 'lib/index.export',
    output: [
      { file: 'dist/index.cjs.production.min.js', format: 'cjs', exports: 'named', name: 'yuyiUtils', sourcemap: true },
    ]
  }),
  umd: (minify = true) => ({
    minify,
    mangle: minify,
    input: 'lib/index',
    output: [
      { file: 'dist/index.production.umd.js', format: 'umd', exports: 'named', name: 'yuyiUtils', sourcemap: true },
    ]
  })
}

type ConfigKey = keyof typeof modeOptions

function getConfig({ mode = 'cjs', ...other }: { mode: ConfigKey | ConfigKey[]; }) {
  if (mode instanceof Array) {
    return mode.map(mode => getConfig({ mode, ...other}))
  }
  const { minify, mangle = minify, debug = false, ...assignOptions } = modeOptions[mode]() as any
  const visualizerPlugin = (opt: { open: boolean } = { open: false }) => {
    return visualizer({
      // summaryOnly: true,
      filename: `../../reports/${pkg.name.split('\/')[1]}/${mode}.stats.html`,
      title: `${pkg.name} Rollup Report (${now.toDateString()})`,
      sourcemap: true,
      template: "treemap",
      ...opt
    });
  }
  const config: InputOptions & { output: OutputOptions | OutputOptions[] } = {
    // const config = {
    ...assignOptions,
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
      copy([
        { files: "lib/**/*.d.ts", dest: 'dist' },
        { files: "lib/**/*.d.ts.map", dest: 'dist' },
        { files: "config/index.js", dest: 'dist' }
      ]),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        // presets: [['@babel/preset-env', { 
        //   corejs: 2,
        //   useBuiltIns: 'usage'
        // }]],
        // presets: [["@babel/preset-env", { "modules": 'commonjs' }]],
        plugins: [['@babel/transform-runtime', { useESModules: true }], '@babel/plugin-syntax-dynamic-import']
      }),
      // wasm({
      //   sync: [
      //     // 不在这里登陆过的只能使用() => import("..")的方式
      //     'wasm/program.wasm'
      //   ]
      // }),
      external(),
      resolve(),
      commonjs(),
      json(),
      ...getTerser(nameCache, minify, mangle, debug),
      sourceMaps(),
      visualizerPlugin()
    ],
  }
  return config
}

const config = [
  getConfig({ mode: 'cjs' }),
  getConfig({ mode: 'dev' }),
  getConfig({ mode: 'node' }),
  // // getConfig({ mode: 'libs' }),
  // getConfig({ mode: 'helpersOnly' })
]
export default config;


(async () => {
  const resList = []
  for (const option of config) {
    resList.push({
      res: await rollup({
        ...option,
        onwarn(warning, handler) {
          if (!/node_modules/.test(warning.importer) && ignoredWarn[warning.code] !== false) {
            // console.log(warning)
            handler(warning)
          }
        }
      }),
      config: option
    })
  }
  for (const { res, config } of resList) {
    const generater = castArray(config.output).map(output => res.write({
      ...output,
      banner: '/* @yuyi919/utils */'
    }))
    for await (const r of generater) {
    }
  }
  NameCache.write(nameCache)
  // console.log('write', nameCache)
})()
