import gulp from 'gulp';
import shell from 'gulp-shell';
var convertEncoding = require('gulp-convert-encoding');

gulp.task("iuplib", () => {
  return gulp.src(["./scripts/clib/**/*.dll"]).pipe(
    gulp.dest("./build/bin")
  );
});
// gulp.task("iupsrc", () => {
//   return gulp.src(["**/*.lua"], { cwd: "./src", ignore: ["main.lua"] }).pipe(
//     gulp.dest("build", { cwd: './' })
//   );
// })

gulp.task("build-main", shell.task("ts-node ./scripts/build.ts main.lua"))
gulp.task("build-lib", shell.task("ts-node ./scripts/build.ts TrpgScript/TextPanel.lua,YuyiCore.lua"));

gulp.task("build-bin", gulp.parallel(
  gulp.series([
    "build-main",
    shell.task("ciuplua lib/main.lua build/bin/main.exe")
  ]),
  "iuplib"
));

gulp.task("obj2build", () => {
  return gulp.src(["src/**/*.obj"])
    .pipe(convertEncoding({ from: 'utf-8', to: 'Shift-JIS' }))
    .pipe(gulp.dest("build/scripts"))
})

gulp.task("lib2build", () => {
  return gulp.src(["lib/**/*.lua"], { ignore: ["lib/main.lua"] })
    .pipe(gulp.dest("build/scripts"))
})

gulp.task("build-script", gulp.series(
  gulp.series([
    "build-lib",
  ]),
  gulp.parallel(["lib2build", "obj2build"])
))

// 构建输出到英文版aviutl目录
gulp.task("script2Aviutl_en", () => {
  return gulp.src(["build/scripts/**"]).pipe(
    gulp.dest("C:\\AVIUTL\\AVIUTL_EN\\Script")
  );
})

gulp.task("watch-scripts", () => {
  return gulp.watch(["src/**/*.lua", "src/**/*.obj"], gulp.series([
    "build-script",
    "script2Aviutl_en"
  ]))
})

gulp.task("default", () => {
  return gulp.src(["build/scripts/**"]).pipe(
    gulp.dest("C:\\AVIUTL\\AVIUTL_EN\\Script")
  )
})
