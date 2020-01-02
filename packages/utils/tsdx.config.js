// const rollup_plugin_typescript = require("tsdx/node_modules/rollup-plugin-typescript2");
const external = require('rollup-plugin-peer-deps-external')
const utils_1 = require("tsdx/dist/utils");
// const { getCustomTransformers } = require('@yuyi919/ts-transformer-awesome')

// const resolve = (path) => {
//   return path.join(__dirname, path)
// }
// const nameCache = fs.readJsonSync(resolve('./name_cache.json'))
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const pkg = require('./package.json')
const cache = {};

const filter = [
  'babel-plugin-transform-async-to-promises/helpers',
  'mobx',
  'rxjs'
]
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    // console.log(options)
    const { plugins } = config;
    // swap out rollup-plugin-typescript2
    config.plugins = plugins.map(p => {
      // if (p && p.name === 'terser') {
      //   const p = require('./config/terser').terserPlugin
      //   // console.log(p)
      //   return p
      // } else
      if (p && p.name === "rpt2") {
        return false
      //   return rollup_plugin_typescript({
      //     typescript: require('typescript'),
      //     cacheRoot: `./node_modules/.cache/.rts2_cache_${options.format}`,
      //     tsconfig: options.tsconfig,
      //     transformers: [
      //       (service) => getCustomTransformers({
      //         program: service.getProgram(),
      //         importLibs: [
      //           // '@material-ui/core',
      //           // "@material-ui/icons",
      //           "lodash"
      //         ]
      //       })
      //     ],
      //     rollupCommonJSResolveHack: false,
      //     tsconfigDefaults: {
      //       compilerOptions: {
      //         sourceMap: true,
      //         declaration: true,
      //         jsx: 'react',
      //       },
      //     },
      //     tsconfigOverride: {
      //       compilerOptions: {
      //         target: 'esnext',
      //       },
      //     },
      //     check: false
      //   });
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
      input: require.resolve('./lib/index.js'), //config.input,
      // cache: isDevelopment ? cache : undefined,
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
