import * as gulp from 'gulp'
import { TaskFunction } from 'gulp'
import replace from 'gulp-replace'
import shell from 'gulp-shell'
import { reduce } from "lodash";
import { paths, relativePaths } from "../yuyi-core-env/config/paths";
import colors from 'colors';
import console = require('console');

const stringTemplate = require('./config/stringTemplate.json')

const keys = Object.keys(stringTemplate.ch).sort((a: string, b: string) => b.length - a.length)
keys.push(`\{\{this\}\}`)
gulp.task('pre-init', function () {
  console.log(keys)
  return keys.reduce(
    (pipe, key) => pipe.pipe(
      replace(new RegExp(`([a-z0-9"' ])\>${key}`, 'g'), `$1\>{{#localize}}${key}{{/localize}}`)
    ),
    gulp.src('./bin-origin/default/partials/**/*.hbs')
  ).pipe(gulp.dest('./bin/default/partials'))
})
const pre: typeof gulp.series = (...func: any[]) => {
  return gulp.series('pre-init', ...func)
}


const startIndex = process.argv.findIndex(key => /^typedoc/.test(key)) + 1
const arg = process.argv.splice(startIndex, process.argv.length - startIndex)

// 生成文档
gulp.task("typedoc", shell.task(require('./typedoc.ts').getExecStr()))
const defaultTask = gulp.series('typedoc');

// watch 模式
gulp.task("typedoc-watch", gulp.parallel('typedoc', function () {
  const run = `gulp --require ${
    paths.requirePath
  } -f ${
    paths.typedocGulpFile
  } --cwd ${
    process.cwd()
  } typedoc`

  console.log(colors.cyan(run))
  gulp.watch(
    ["src/**/*.ts", "src/**/*.tsx", paths.typedocConfigAsync, paths.typedocConfig], 
    shell.task(run)
  )
}))

// 预先生产模板
gulp.task('typedoc-init', pre('typedoc'))
gulp.task("typedoc-watch-init", pre('typedoc-watch'))

// 默认直接生成文档即可
gulp.task('default', defaultTask)