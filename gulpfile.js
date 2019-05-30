var gulp = require('gulp');
// var program = require('yuyi-core-tts-glup')

const shell = require('gulp-shell')

// var bundle = program({
//   dest: 'lib',
//   src: 'lib/**/*.js'
// });

// gulp.task('bundle', bundle);
gulp.task('ttscDev', shell.task([
  'ttsc --project tsconfig.dev.json'
]))
gulp.task('ttscProd', shell.task([
  'ttsc --project tsconfig.prod.json'
]))
gulp.task('ttsc', gulp.parallel('ttscDev', 'ttscProd'))

gulp.task('default', gulp.parallel('ttscDev', 'ttscProd'));

