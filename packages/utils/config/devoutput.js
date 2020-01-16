const gulp = require('gulp')
const shell = require('gulp-shell')

gulp.task('pub', function watchDistTODO() {
  return gulp.src('dist/**', { ignore: ['dist/index.js'] }).pipe(
    gulp.dest('..\\..\\..\\FXQ\\WebApp\\FXQ\\storybook\\@yuyi\\utils\\dist')
  )
})
gulp.task("build", shell.task('yarn build'))
gulp.task('default', gulp.series(
  "build",
  "pub"
))

gulp.task('watch', watch)

function watch() {
  gulp.watch('dist/**', "default")
}
