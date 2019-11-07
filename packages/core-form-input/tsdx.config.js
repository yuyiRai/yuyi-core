module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    console.log(options)
    return config; // always return a config.
  },
};