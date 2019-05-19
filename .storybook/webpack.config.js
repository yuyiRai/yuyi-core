const { getResolveConfig, useTsLoader, useCDNAuto, addBabelPlugins, disableEsLint, globalEntry } = require('../config-overrides')
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
  // console.log(config)
  return config;
};