const { getResolveConfig, useTsLoader, useCDNAuto, addBabelPlugins, disableEsLint, globalEntry } = require('../config-overrides')

var _plugin = _interopRequireDefault(require("vue-loader/lib/plugin"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function webpack(config) {
  return Object.assign({}, config, {
    plugins: [...config.plugins, new _plugin.default()],
    module: Object.assign({}, config.module, {
      rules: [...config.module.rules, {
        test: /\.vue$/,
        loader: require.resolve('vue-loader'),
        options: {}
      }]
    }),
    resolve: Object.assign({}, config.resolve, {
      extensions: [...config.resolve.extensions, '.vue'],
      alias: Object.assign({}, config.resolve.alias, {
        vue$: require.resolve('vue/dist/vue.esm.js')
      })
    })
  });
}

function babelDefault(config) {
  return Object.assign({}, config, {
    presets: [...config.presets, require.resolve('babel-preset-vue')]
  });
}

module.exports = (...args) => {
  const [{ config }] = args
  // console.log(config.module.rules)
  // webpack(config)
  // addBabelPlugins(
  //   "jsx-control-statements",
  //   "styled-components",
  //   "babel-plugin-ts-nameof"
  // ).forEach(hack => hack(config))
  config.module.rules.forEach(load => {
    if (load.loader && load.loader.indexOf('babel-loader') > -1) {
      load.options.plugins = [...load.options.plugins, "jsx-control-statements",
        "styled-components",
        "babel-plugin-ts-nameof"]
    }
  })
  globalEntry(config)
  disableEsLint()(config)
  getResolveConfig()(config)
  useCDNAuto()(config)
  // config.plugins = config.plugins.filter(config => !config.typescript)
  useTsLoader()(config)
  const r = webpack(config)
  console.log(r, r.module.rules)
  return r;
};