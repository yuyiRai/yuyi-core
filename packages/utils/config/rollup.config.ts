import fs from 'fs-extra';
import path from 'path';
import { InputOptions, OutputOptions, RollupCache } from 'rollup';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy-glob';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import sourceMaps from 'rollup-plugin-sourcemaps';
// import analyze from 'rollup-plugin-analyzer'
import visualizer from 'rollup-plugin-visualizer';
import { getTerser } from './terser';
import { IKeyValueMap } from '../src/Constransts';

// const babelPluginTsdx = require("tsdx/dist/babelPluginTsdx");

export class Cache<T = any> {

  constructor(public name: string, public cache: T = {} as T) {
  }
  get path() {
    return path.join(__dirname, './.cache/' + this.name + 'Cache.json');
  }

  read(): T {
    this.cache = Cache.read<T>(this);
    return this.cache;
  }

  write(data: T = this.cache) {
    // console.log('write', data)
    return Cache.write(this, data);
  }

  static read<T>(cache: Cache<T>): T {
    return fs.existsSync(cache.path) ? fs.readJSONSync(cache.path) : cache.cache;
  }
  static write<T>(cache: Cache<T>, data: T) {
    return fs.writeJSONSync(cache.path, data, { spaces: 2 });
  }
}

export type CacheEntires = { props: IKeyValueMap<string>; };

const nameCache = new Cache<{ vars: CacheEntires, props: CacheEntires; }>('name', { vars: { props: {} }, props: { props: {} } });

export const ignoredWarn = {
  'NAMESPACE_CONFLICT': false,
  'NON_EXISTENT_EXPORT': false,
  'UNUSED_EXTERNAL_IMPORT': false,
  'CIRCULAR_DEPENDENCY': false
};

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV !== 'development';
const pkg = require('../package.json');
const now = new Date(Date.now());

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
    };
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
  testUtils: (minify = false) => ({
    minify,
    mangle: false,
    input: 'lib/TestUtils',
    output: [
      {
        file: 'dist/TestUtils.js',
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
      {
        file: 'dist/index.umd.min.js', globals: { lodash: '_' }, format: 'umd', exports: 'named', name: 'yuyiUtils', sourcemap: true },
    ] as OutputOptions[]
  })
};

type ConfigKey = keyof typeof modeOptions;

function getConfig({ mode = 'cjs', ...other }: { mode: ConfigKey | ConfigKey[]; minify?: boolean; }) {
  if (mode instanceof Array) {
    return mode.map(mode => getConfig({ mode, ...other }));
  }
  const { minify, mangle = minify, debug = false, ...assignOptions } = modeOptions[mode](other.minify) as any;
  const visualizerPlugin = (opt: { open: boolean; } = { open: false }) => {
    return visualizer({
      // summaryOnly: true,
      filename: `../../reports/${pkg.name.split('\/')[1]}/${mode}.stats.html`,
      title: `${pkg.name} Rollup Report (${now.toDateString()})`,
      sourcemap: true,
      template: "treemap",
      ...opt
    });
  };
  const filter = [
    'babel-plugin-transform-async-to-promises/helpers',
    'mobx',
    'rxjs',
    'immer',
    'core-decorators',
    // 'lodash',
    'tslib',
    'dayjs'
  ];

  const complieCache = new Cache<RollupCache>('complie' + mode, { modules: [] });
  const config: InputOptions & { output: OutputOptions | OutputOptions[]; } = {
    // const config = {
    ...assignOptions,
    complieCache,
    cache: complieCache.read(),
    inlineDynamicImports: false,
    treeshake: isProduction,
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: (id) => {
      if (mode === 'umd' || filter.some(s => id.indexOf(s) > -1)) {
        return false;
      }
      return require("tsdx/dist/utils").external(id);
    },
    watch: {
      include: ['lib/**'],
    },
    onwarn(warning, handler) {
      if (!/node_modules/.test(warning.importer) && ignoredWarn[warning.code] !== false) {
        // console.log(warning)
        handler(warning);
      }
    },
    // @ts-ignore
    plugins: [
      // babelPluginTsdx.babelPluginTsdx({
      //   exclude: 'node_modules/**',
      //   // extensions: [...core_1.DEFAULT_EXTENSIONS, 'ts', 'tsx'],
      //   // passPerPreset: true,
      //   custom: {
      //     // targets: opts.target === 'node' ? { node: '8' } : undefined,
      //     // extractErrors: true,
      //     format: 'cjs',
      //   },
      // }),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        presets: [['@babel/preset-env', {
          "corejs": 2,
          'useBuiltIns': 'entry'
        }]],
        // presets: [["@babel/preset-env", { "modules": 'commonjs' }]],
        plugins: [
          // ['@babel/transform-runtime', { useESModules: true }],
          '@babel/plugin-syntax-dynamic-import'
        ]
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
      ...getTerser(nameCache.read(), minify, mangle, debug),
      sourceMaps(),
      visualizerPlugin(),
      copy([
        { files: "lib/**/*.d.ts", dest: 'dist' },
        { files: "lib/**/*.d.ts.map", dest: 'dist' },
        { files: "config/index.js", dest: 'dist' }
      ])
    ],
  };
  return config;
}

const config = Object.assign([
  getConfig({ mode: 'cjs' }),
  getConfig({ mode: 'dev' }),
  getConfig({ mode: 'node' }),
  // getConfig({ mode: 'libs' }),
  getConfig({ mode: 'umd', minify: false }),
  getConfig({ mode: 'testUtils' }),
  getConfig({ mode: 'helpersOnly' })
] as (InputOptions & ({ output: OutputOptions | OutputOptions[]; complieCache: Cache<RollupCache>; }))[], {
  nameCache
});
export default config;

