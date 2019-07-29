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
  const r = plugins.filter(plugin => !defaultPlugins.find(df => isEqual(df, plugin)))
  return r.length > 0 ? r.concat(plugins) : undefined
}

function taskFactroy(folder: string) {
  const srcs = ['./packages/' + folder + '/tsconfig.json']
  return function () {
    return gulp.src(srcs, { allowEmpty: true }).pipe(jeditor(function (json) {
      console.error('loading', json.extends, json.extends === './tsconfig.json')
      const { references, extends: extendsC, include, exclude, compilerOptions, ...other } = json

      if (json.extends !== './tsconfig.json') {
        set(json, 'extends', '../../tsconfig.json')
      }
      const { rootDir, baseUrl, paths } = definedRoot(compilerOptions, true)
      const { outDir, declarationDir } = definedOutput()
      const { plugins, types, ...otherCompilerOptions } = compilerOptions;
      const forceOptions = {
        composite: true,
        rootDir, baseUrl, paths, outDir, declarationDir,
        tsBuildInfoFile: '../.tsBuildInfo/' + folder.replace('yuyi-core-', '') + '.json',
        incremental: true,
        plugins: diffPlugins(plugins),
        types
      }
      if (folder !== 'env') {
        forceOptions.types = Array.from(new Set((types || []).concat(["@yuyi/env/types/global"])))
      }

      Object.keys(otherCompilerOptions).forEach(key => {
        if (key in forceOptions || isEqual(otherCompilerOptions[key], defaultCompilerOptions[key])) {
          // console.log(key, compilerOptions)
          unset(otherCompilerOptions, key)
        }
      })
      const r = {
        extends: (extendsC !== './tsconfig.json' ? '../../tsconfig.json' : extendsC),
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