const rollup_plugin_typescript = require("rollup-plugin-typescript2");
const external = require('rollup-plugin-peer-deps-external')
const rollup_plugin_terser = require("rollup-plugin-terser");
const resolve = require("rollup-plugin-node-resolve");
// const { transformers } = require('./transformers')
const utils_1 = require("tsdx/dist/utils");
const commonjs = require("rollup-plugin-commonjs");
const package = require('./package.json')
const copy = require("rollup-plugin-copy-glob")


const modulePathResolve = (moduleName, path) => {
  return pathlib.resolve(require.resolve(moduleName).replace(/(src|dist)(.*)$/, ''), path)
}
const filter = [
  'babel-plugin-transform-async-to-promises/helpers'
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
    config.plugins.unshift(
      copy([
        // { files: modulePathResolve('@yuyi919/kakasi', './bin/*.*'), dest: 'bin' },
        { files: 'src/**/*.json', dest: '.' },
      ])
    )
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
