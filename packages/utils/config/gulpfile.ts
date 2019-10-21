
import createApiTask from './ApiExtractor';
import ApiExtractorFix from './ApiExtractorFix'
import * as gulp from 'gulp'
import shell from 'gulp-shell'

const apiAll = createApiTask()
const apiFix = ApiExtractorFix.createApiTask()
const docFix = ApiExtractorFix.createApiFixedTask({
  items: [
    { name: '@yuyi919/utils' }
  ]
})

gulp.task('api:all', apiAll)
gulp.task('api:fix', apiFix)
gulp.task('doc:fix', docFix)


console.log('all', apiAll);
gulp.task('default', gulp.series(
  apiAll,
  apiFix,
  gulp.parallel(
    shell.task("api-documenter markdown -i ./etc -o ./document/articles"),
    // shell.task("api-documenter yaml -i ./etc -o ./document/src"),
    shell.task("api-documenter yaml -i ./etc -o ./document/src")
  ),
  docFix
))