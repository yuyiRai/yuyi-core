const rollupPluginTerser = require("rollup-plugin-terser");
// import typescript from 'rollup-plugin-typescript2';
// import ttypescript from 'ttypescript';
// import minify from 'rollup-plugin-babel-minify'
// import { InputOptions, OutputOptions } from 'rollup'

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const cache = {};
const nameCache = {}
const staticVarName = "K$"
const terserPlugin = rollupPluginTerser.terser({
  sourcemap: true,
  output: {
    preamble: "var " + staticVarName + '={};',
    // beautify: true,
    comments: false,
  },
  nameCache: nameCache,
  compress: {
    keep_infinity: true,
    pure_getters: true,
    // keep_classnames: /Suite/,
    passes: 10,
    global_defs: {
      "process.env.NODE_ENV": process.env.NODE_ENV || "production",
      "@__DEV__": ((process.env.NODE_ENV || "production") === "development") + '',
      // "global.Constant$": "global.K",
      // "@Object": staticVarName + ".OBJECT",
      // "@Object.defineProperty": staticVarName + ".OBJ_defineProperty$",
      "@Constant$": staticVarName,
      // "@K$": staticVarName,
    }
  },
  mangle: {
    properties: {
      keep_quoted: true,
      regex: /^_|^\$\$|\$\$$|(^([A-Z0-9$_])+$)|Constant\$|\_(.*?)\$$/,
      // debug: true,
      // @ts-ignore
      // undeclared: true,
      reserved: ['__esModule', '__mobxDecorators'],
    },
    toplevel: true
  },
  ecma: 5,
  toplevel: true,
  warnings: true,
})

module.exports = {
  terserPlugin
}
exports = {
  terserPlugin
}
// module.exports.default = terserPlugin
