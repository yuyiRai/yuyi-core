import fs from 'fs-extra'
import * as gulp from 'gulp'
import { isObject, unset, set, isEqual, pick, escapeRegExp } from 'lodash'
import jeditor from 'gulp-json-editor'
import JSON5 from 'json5'

JSON.parse = JSON5.parse;
const suffix = '.api.json'
const files = fs.readdirSync('./etc')
  .filter(name => new RegExp(`^(.*?)${escapeRegExp(suffix)}$`).test(name))
  .map(name => name.replace(suffix, ''))

function taskFactroy(name: string) {
  const src = `./etc/${name}${suffix}`
  return function () {
    return gulp.src(src, { allowEmpty: true }).pipe(jeditor(function (json) {
      console.error(`modify ${src} name to ${name}`)
      set(json, 'name', name)
      return json
    })).pipe(gulp.dest('./etc/'));
  }
}

gulp.task('default', gulp.parallel(files.map(name => taskFactroy(name))))