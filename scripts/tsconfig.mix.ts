import fs from 'fs-extra'
import * as gulp from 'gulp'
import { isObject, unset, set, isEqual, pick } from 'lodash'
import jeditor from 'gulp-json-editor'
import JSON5 from 'json5'
import DefaultOptions from '../tsconfig.json'
import envDefaultOptions from '../tsconfig.env.json'

const defaultCompilerOptions = { ...envDefaultOptions.compilerOptions, ...DefaultOptions.compilerOptions }
type CompilerOptions = typeof defaultCompilerOptions;
JSON.parse = JSON5.parse;

const dirs = fs.readdirSync('./packages').filter(name => !/demo/.test(name))
console.error(dirs)

const getAppendPaths = (appendDir: string = "") => ({
  "@": ["./" + appendDir],
  "@/*": appendDir ? ["./" + appendDir + "/*"] : ["./*"]
})

function definedPaths(other: CompilerOptions, useSrc = true) {
  const appendPaths = getAppendPaths(useSrc ? "src" : "")
  const paths = other.paths
  const pathKeys = Array.from(
    new Set([...(isObject(paths) ? Object.keys(paths) : []), ...Object.keys(appendPaths)])
  )
  return pathKeys.reduce((obj, key) => obj[key] ? obj : Object.assign(obj, { [key]: appendPaths[key] }), paths || {})
}

function definedRoot(other: CompilerOptions, srcOnly = true) {
  const pathStr = srcOnly ? './src' : './'
  return { rootDir: pathStr, baseUrl: pathStr, paths: definedPaths(other, !srcOnly) }
}
function definedOutput() {
  return {
    declarationDir: './types',
    outDir: './lib'
  }
}

function diffPlugins(plugins: CompilerOptions['plugins'] = []) {
  const defaultPlugins = defaultCompilerOptions.plugins
  plugins = Array.from(new Set(plugins.map(i=>JSON.stringify(i)))).map(i => JSON.parse(i))
  const r = plugins.filter(plugin => !defaultPlugins.find(df => isEqual(df, plugin)))
  return r.length > 0 ? r.concat(defaultPlugins) : undefined
}

const whiteList = ['./tsconfig.json', '../../node_modules/assemblyscript/std/assembly.json']

function taskFactroy(folder: string) {
  const srcs = ['./packages/' + folder + '/tsconfig.json']
  return function () {
    return gulp.src(srcs, { allowEmpty: true }).pipe(jeditor(function (json) {
      console.error('loading', json.extends, json.extends === './tsconfig.json')
      const { references, extends: extendsC, include, exclude, compilerOptions, ...other } = json

      if (!whiteList.includes(json.extends)) {
        set(json, 'extends', '../../tsconfig.json')
      }
      const { rootDir, baseUrl, paths } = definedRoot(compilerOptions, folder !== 'core')
      const { outDir, declarationDir } = definedOutput()
      const { plugins, types, ...otherCompilerOptions } = compilerOptions;
      const forceOptions = {
        composite: true,
        rootDir, baseUrl, paths, outDir, declarationDir,
        tsBuildInfoFile: '../.tsBuildInfo/' + folder.replace('yuyi-', '') + '.json',
        incremental: true,
        plugins: diffPlugins(plugins),
        types
      }
      if (folder !== 'env' && folder !== 'core') {
        forceOptions.types = Array.from(new Set((types || []).concat(["@yuyi919/env/types/global"])))
      }

      Object.keys(otherCompilerOptions).forEach(key => {
        if (key in forceOptions || isEqual(otherCompilerOptions[key], defaultCompilerOptions[key])) {
          // console.log(key, compilerOptions)
          unset(otherCompilerOptions, key)
        }
      })
      const r = {
        extends: (!whiteList.includes(extendsC) ? '../../tsconfig.json' : extendsC),
        references,
        compilerOptions: {
          ...forceOptions,
          ...otherCompilerOptions
        },
        ...other,
        include,
        exclude
      }
      // console.log(r, rootDir, baseUrl, paths)
      return r
    })).pipe(gulp.dest("./packages/" + folder));
  }
}

gulp.task('default', gulp.series(dirs.map(name => taskFactroy(name))))