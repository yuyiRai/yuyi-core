
import createApiTask, { createMainApiTask } from './ApiExtractor';
import ApiExtractorFix from './ApiExtractorFix';
import replace from 'gulp-replace'
import { logger, shell } from '@yuyi919/gulp-awesome'
import * as gulp from 'gulp';
import { projectName, resolve, resolveTmpDir } from './resolve';
const apiMain = createMainApiTask();
const apiTree = createApiTask();
const apiFix = ApiExtractorFix.createApiTask();
const docFix = ApiExtractorFix.createApiFixedTask({
  items: [
    { name: projectName }
  ]
});

gulp.task('api:main', apiMain);
gulp.task('api:all', apiTree);
gulp.task('api:fix', apiFix);
gulp.task('doc:fix', docFix);

gulp.task('build', () => {
  gulp.src('.', { read: false })
    .pipe(shell(`docfx build ${resolveTmpDir('./document/docfx.json')}`))
    .pipe(logger.log(`run server with: docfx serve ./docs`))
    .pipe(shell('docfx serve ./docs'))
  
})

gulp.task('doc:templateTmp', () =>
  gulp.src(resolve('./config/document/**'))
    .pipe(replace('"../docs"', `"${resolve('./docs', true)}"`))
    .pipe(gulp.dest(resolveTmpDir('./document')))
)
gulp.task('doc:template', () => gulp.src(resolve('./config/document/**')).pipe(gulp.dest('./document')))
gulp.task('default', gulp.series(
  // apiMain,
  // apiTree,
  // apiFix,
  'doc:templateTmp',
  // gulp.parallel(
  //   shellTask.task(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`),
  //   // shell.task("api-documenter yaml -i ./etc -o ./document/src"),
  //   shellTask.task(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`)
  // ),
  'build'
  // docFix
));
