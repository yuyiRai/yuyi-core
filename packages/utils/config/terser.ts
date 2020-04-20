import { terser } from "./rollup-plugin-terser";
import replacer from 'rollup-plugin-replace';
import { Constant$ } from "../src/Constransts";
import { get } from 'lodash';

const Constants: typeof Constant$ & {
  [key: string]: string;
} = Object.entries(Constant$).reduce((r, [k, v]) => {
  return typeof v === 'string' ? Object.assign(r, { [v]: k }) : r;
}, Constant$) as any;
// console.log(Constants);

function replacerConstantsValues(formatter: (value: string, key: string) => string, ...keys: string[]) {
  return keys.reduce((r, key) => {
    return typeof Constants[key] === 'string' ? { ...r, [key]: formatter(Constants[key], key) } : r;
  }, {});
}

export const vars = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  staticVarName: 'K$'
}
export function getTerser(nameCache: any, minify = true, mangle = minify, debug = !minify) {
  const _$$_keys = get(nameCache, 'props.props', {});
  const includeKeys = Object.keys(_$$_keys).filter(i => /^\$_\$\$/.test(i));
  const replacerMap = includeKeys.reduce((r, k) => Object.assign(r, {
    [k.replace(/^\$/, '')]: (path: string) => {
      console.log(path, _$$_keys[k])
    return `"${_$$_keys[k]}"`
  } }), {});
  // console.log(staticVarName, replacerMap)
  // 不启用粉碎，或启用debug模式时
  if (mangle && debug) {
    nameCache = {};
  }
  console.log(minify, mangle, debug)
  return [
    replacer({
      values: {
        "process.env.NODE_ENV": `"${process.env.NODE_ENV || "production"}"`,
        "__DEV__": `${debug}`,
      }
    }),
    ...(minify && mangle && !debug ? [
      replacer({
        exclude: ['./lib/Constransts.js', 'tslib'],
        values: {
          ...replacerConstantsValues(
            value => `${vars.staticVarName}.${value}`,
            Constants.KEY_DESIGN_TYPE,
            Constants.KEY_DESIGN_PARAMTYPES,
            Constants.KEY_DESIGN_RETURNTYPE,
            Constants.KEY_OBJ,
            Constants.KEY_FUNC,
            Constants.KEY_CONSTRUCTOR
          ),
          ...replacerMap
        },
        delimiters: ["\"", "\""]
      }),
      replacer({
        values: {
          [`Object.defineProperty(exports, "__esModule",`]: `${vars.staticVarName}.${Constant$.DEFINED_ESMODULE.name}(exports,`,
          'Object.defineProperty': `${vars.staticVarName}.OBJ_defineProperty$`
        },
        delimiters: ["", ""]
      }),
      replacer({
        values: {
          ...replacerConstantsValues(
            value => `[${vars.staticVarName}.${value}]`,
            Constants.KEY_PROTOTYPE,
            Constants.Key_useDeprecatedSynchronousErrorHandling$$
          )
        },
        delimiters: ["\.", ""]
      })
    ] : []),
    terser({
      // @ts-ignore
      sourcemap: true,
      output: {
        preamble: "var " + vars.staticVarName + '={};',
        beautify: !minify,
        comments: debug
      },
      nameCache,
      compress: Object.assign({
        passes: 0,
        global_defs: {
          "@Constant$": vars.staticVarName
        }
      }, !minify ? {} : {
        keep_infinity: true,
        pure_getters: true,
        // keep_classnames: /Suite/,
        passes: 10
      }),
      // @ts-ignore
      mangle: mangle ? {
        properties: {
          keep_quoted: true,
          regex: /(?!(__mobx))^_|^\$\$|\$\$$|(^([A-Z0-9$_])+$)|Constant\$|\_(.*?)\$$/,
          debug,
          reserved: ['__esModule'],
        },
        toplevel: true
      } : undefined,
      ecma: 5,
      toplevel: true,
      warnings: true,
    })
  ];
}

// module.exports.default = terserPlugin
