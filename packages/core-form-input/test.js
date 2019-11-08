var terser = require("terser")
const path = require('path')

var code = {
  "demo.js": `
    var state = {
      count_$: 0,
      _count2: 0
    };
    state.count_$++;
    state._count2++;
  `,
};
const nameCache = {}
const options = {
  nameCache,
  compress: {
    keep_infinity: true,
    pure_getters: true,
    passes: 10,
  },
  mangle: {
    properties: {
      builtins: true,
      // debug: true,
      regex: /((^_)|([_$]$))/,
      keep_quoted: true
    },
    toplevel: true
  },
  warnings: true,
  toplevel: true
};
const result = terser.minify(code, options);
console.log(result.code, nameCache)