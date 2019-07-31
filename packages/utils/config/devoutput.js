const gulp = require('gulp')
const shell = require('gulp-shell')

function watch() {
  gulp.watch('../dist/**', function watchDistTODO() {
    return gulp.src('../dist/**').pipe(
      gulp.dest('..\\..\\..\\..\\FXQ\\WebApp\\FXQ\\.storybook\\@yuyi\\utils\\dist')
    )
  })
}

gulp.task('default', gulp.parallel(
  watch,
  shell.task('yarn start'),
  shell.task('yarn tsc:watch')
))

gulp.task('watch', watch)