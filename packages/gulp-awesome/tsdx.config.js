const rollup_plugin_typescript = require("rollup-plugin-typescript2");
const external = require('rollup-plugin-peer-deps-external')
const rollup_plugin_terser = require("rollup-plugin-terser");
const resolve = require("rollup-plugin-node-resolve");
// const { transformers } = require('./transformers')
const utils_1 = require("tsdx/dist/utils");
const commonjs = require("rollup-plugin-commonjs");
const package = require('./package.json')
// const ts = require("@wessberg/rollup-plugin-ts");
// const path = require('path')
// const fs = require('fs-extra')
const getCustomTransformers = require('@yuyi919/ts-transformer-awesome').default
// const v = getCustomTransformers({})
// const resolve = (path) => {
//   return path.join(__dirname, path)
// }
// const nameCache = fs.readJsonSync(resolve('./name_cache.json'))

const filter = [
  'babel-plugin-transform-async-to-promises/helpers',
  'gulp-',
  'dayjs',
  'lodash',
  'through2',
  'tslib',
  'colors',
  'iconv-lite'
]
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    // console.log(options)
    const { plugins } = config;
    // plugins.push(resolve())
    // swap out rollup-plugin-typescript2

    config.plugins = plugins.reduce((r, p) => {
      // p && console.log(p.name)
      if (!p)
        return r
      if (p.name === 'node-resolve') {
        console.log('node-resolve', 'commonjs')
        return r.concat([p, commonjs({})])
      }
      if (p.name === "rpt2") {
        return r.concat([
          rollup_plugin_typescript({
            typescript: require('ttypescript'),
            cacheRoot: `./node_modules/.cache/.rts2_cache_${options.format}`,
            tsconfig: options.tsconfig,
            rollupCommonJSResolveHack: false,
            // transformers: [
            //   (service) => getCustomTransformers({
            //     program: service.getProgram(),
            //     importLibs: [
            //       "lodash"
            //     ]
            //   })
            // ],
            tsconfigOverride: {
              compilerOptions: {
                target: 'esnext',
              },
            },
            check: false
          })
        ])
      }
      return r.concat([p])
    }, []);
    return {
      ...config,
      external: (id) => {
        if (filter.some(s => id.indexOf(s) > -1)) {
          return false;
        }
        return false || utils_1.external(id);
      }
    };
  }
};
