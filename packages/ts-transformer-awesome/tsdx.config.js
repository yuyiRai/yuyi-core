const rollup_plugin_typescript = require("rollup-plugin-typescript2");
const external = require('rollup-plugin-peer-deps-external')
const rollup_plugin_terser = require("rollup-plugin-terser");
const resolve = require("rollup-plugin-node-resolve");
// const { transformers } = require('./transformers')
const utils_1 = require("tsdx/dist/utils");
const package = require('./package.json')
// const ts = require("@wessberg/rollup-plugin-ts");
// const path = require('path')
// const fs = require('fs-extra')
// const getCustomTransformers = require('@yuyi919/ts-transformer-awesome').default
// const v = getCustomTransformers({})
// const resolve = (path) => {
//   return path.join(__dirname, path)
// }
// const nameCache = fs.readJsonSync(resolve('./name_cache.json'))

const filter = [
  'babel-plugin-transform-async-to-promises/helpers',
  // '@material-ui/core',
  // "ts-is-kind",
  // "tslib",
  // '@avensia-oss/ts-transform-hoist-objects-in-props',
  // 'reflect-metadata',
  // 'ts-import-plugin',
  // 'ts-nameof',
  // 'ts-optchain',
  // 'ts-plugin-mmlpx',
  // 'ts-transform-react-constant-elements',
  // 'ts-transformer-enumerate',
  // 'ts-transformer-keys',
  // 'ts-transformer-minify-privates',
  // 'tsx-control-statements',
  // 'typescript-is',
  // 'typescript-transform-macros',
  // 'typescript-transform-paths',
  // 'typesmith'
]
console.log(filter)
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    // console.log(options)
    const { plugins } = config;
    plugins.push(resolve())
    // swap out rollup-plugin-typescript2
    config.plugins = plugins.map(p => {
      if (p && p.name === "rpt2") {
        return rollup_plugin_typescript({
          typescript: require('typescript'),
          cacheRoot: `./node_modules/.cache/.rts2_cache_${options.format}`,
          tsconfig: options.tsconfig,
          // transformers: [
          //   (service) => getCustomTransformers({
          //     program: service.getProgram(),
          //     importLibs: [
          //       '@material-ui/core',
          //       "@material-ui/icons",
          //       "lodash"
          //     ]
          //   })
          // ],
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
    // config.plugins.unshift(external({
    //   includeDependencies: true
    // }))
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
