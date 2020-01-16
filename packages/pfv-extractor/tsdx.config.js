const rollup_plugin_typescript = require("tsdx/node_modules/rollup-plugin-typescript2");
const replacer = require('rollup-plugin-replace');
const pathlib = require('path')
// const { transformers } = require('./transformers')
const utils_1 = require("tsdx/dist/utils");
const copy = require("rollup-plugin-copy-glob")

const commonjs = require("rollup-plugin-commonjs");
// const ts = require("@wessberg/rollup-plugin-ts");
// const path = require('path')
// const fs = require('fs-extra')
const { getCustomTransformers } = require('@yuyi919/ts-transformer-awesome')

const resolve = (path) => {
  return pathlib.join(__dirname, path)
}
const modulePathResolve = (moduleName, path) => {
  return pathlib.resolve(require.resolve(moduleName).replace(/(src|dist)(.*)$/, ''), path)
}
// const nameCache = fs.readJsonSync(resolve('./name_cache.json'))

const filter = [
  // 'babel-plugin-transform-async-to-promises/helpers',
  // 'lodash',
  // 'fs-extra',
  // '@yuyi919',
  // 'mobx',
  // "@yuyi919/kakasi",
  "argparse"
  // 'encoding-japanese'
]
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    // console.log(options)
    const { plugins } = config;
    // swap out rollup-plugin-typescript2
    config.plugins = plugins.reduce((r, p) => {
      // p && console.log(p.name)
      if (!p)
        return r
      if (p.name === 'node-resolve')
        return r.concat([p, commonjs({})])
      if (p.name === "rpt2") {
        return r.concat([
          rollup_plugin_typescript({
            typescript: require('typescript'),
            cacheRoot: `./node_modules/.cache/.rts2_cache_${options.format}`,
            tsconfig: options.tsconfig,
            transformers: [
              (service) => getCustomTransformers({
                program: service.getProgram(),
                importLibs: [
                  '@material-ui/core',
                  "@material-ui/icons",
                  "lodash"
                ]
              })
            ],
            rollupCommonJSResolveHack: false,
            tsconfigDefaults: {
              compilerOptions: {
                sourceMap: true,
                declaration: true,
                jsx: 'react',
              },
            },
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
    console.log('hack', config.input)
    config.plugins.unshift(
      replacer({
        values: {
          'require.resolve': 'require("path").resolve',
          // 'path_1.default.join(kuromojiDir, "..", "dict");': 'path_1.default.join(kuromojiDir, "assets/kuromoji/dict");',
        },
        delimiters: ["", ""]
      })
    )
    config.plugins.unshift(
      copy([
        // { files: modulePathResolve('@yuyi919/kakasi', './bin/*.*'), dest: 'bin' },
        { files: modulePathResolve('kuromoji', './dict/*.*'), dest: 'assets/kuromoji/dict' },
      ])
    )
    // const ts = require("@wessberg/rollup-plugin-ts");
    return {
      ...config,
      // input: "./lib/index.js",
      // Tell Rollup which packages to ignore
      external: (id) => {
        if (filter.some(s => id.indexOf(s) > -1)) {
          return true;
        }
        return false //|| utils_1.external(id);
      }
    };
  }
};
