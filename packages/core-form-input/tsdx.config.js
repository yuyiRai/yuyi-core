const rollup_plugin_typescript = require("rollup-plugin-typescript2");
const external = require('rollup-plugin-peer-deps-external')
const { transformers } = require('./transformers')
const utils_1 = require("tsdx/dist/utils");
// const ts = require("@wessberg/rollup-plugin-ts");

const filter = [
  'babel-plugin-transform-async-to-promises/helpers',
  '@material-ui/core'
]
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    // console.log(options)
    const { plugins } = config;
    // swap out rollup-plugin-typescript2
    config.plugins = plugins.map(p => {
      if (p && p.name === "rpt2") {
        // return ts({
        //   tsconfig: tsconfig => {
        //     return {
        //       ...tsconfig,
        //       target: "ESNext",
        //       sourceMap: true,
        //       declaration: true
        //     };
        //   },
        //   transpileOnly: true,
        //   transformers,
        //   transpiler: "babel"
        // });
        return rollup_plugin_typescript({
          typescript: require('typescript'),
          cacheRoot: `./node_modules/.cache/.rts2_cache_${options.format}`,
          tsconfig: options.tsconfig,
          transformers,
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
        });
      }
      return p;
    });
    config.plugins.unshift(external({
      includeDependencies: true
    }))
    // config.plugins.shift(multiEntry());
    // config.plugins.push(
    //   visualizer({
    //     filename: `${pjson.name}.stats.html`,
    //     title: `${pjson.name} Rollup Report (${now.toDateString()})`,
    //     sourcemap: true
    //   })
    // );

    console.log('hack', config.input)
    // const ts = require("@wessberg/rollup-plugin-ts");
    return {
      ...config,
      input: config.input,
      // Tell Rollup which packages to ignore
      external: (id) => {
        if (filter.some(s => id.indexOf(s) > -1)) {
          return false;
        }
        return utils_1.external(id);
      }
    };
  }
};