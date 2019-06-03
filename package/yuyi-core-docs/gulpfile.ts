import * as gulp from 'gulp'
import { TaskFunction } from 'gulp'
import replace from 'gulp-replace'
import shell from 'gulp-shell'
import { reduce } from "lodash";
import { paths, relativePaths } from "yuyi-core-env/config/paths";

const stringTemplate = require('./config/stringTemplate.json')

const keys = Object.keys(stringTemplate.ch).sort((a: string, b: string) => b.length - a.length)
keys.push(`\{\{this\}\}`)
gulp.task('pre-init', function () {
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


const paramData = {
  // typedoc样式配置
  "theme": relativePaths.typedocTheme,
  // typedoc配置文件
  "options": relativePaths.typedocConfig,
  // 根据路径配置模块展示
  "external-modulemap": `".*\/src\/([\\w-_]+)\/"`,
  // 本地化配置
  "localize": "ch",
  "templateStrings": relativePaths.typedocStringTemplate,
  "toc": 1
}
const execStr = `typedoc ${reduce(paramData, (argStr, value, key) => {
  return `${argStr} --${key} ${value}`
}, '')} ${relativePaths.clintSrc}`

// 生成文档
gulp.task("typedoc", shell.task([execStr]))
const defaultTask = gulp.series('typedoc');

// watch 模式
gulp.task("typedoc-watch", gulp.parallel('typedoc', function () {
  gulp.watch(["src/**/*.ts", "src/**/*.tsx"], defaultTask)
}))

// 预先生产模板
gulp.task('typedoc-init', pre('typedoc'))
gulp.task("typedoc-watch-init", pre('typedoc-watch'))

// 默认直接生成文档即可
gulp.task('default', defaultTask)