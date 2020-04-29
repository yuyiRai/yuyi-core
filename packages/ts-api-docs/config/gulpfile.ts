
import createApiTask, { createMainApiTask } from './ApiExtractor';
import ApiExtractorFix from './ApiExtractorFix';
import replace from 'gulp-replace';
import colors from 'colors';
import { logger, shell, shellTask, task } from '@yuyi919/gulp-awesome'
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

task('api:main', apiMain);
task('api:all', apiTree);
task('api:fix', apiFix);
task('doc:fix', docFix);

const build = task('build', () => {
  gulp.src('.', { read: false })
    .pipe(logger('Exec')(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`))
    .pipe(logger('Exec')(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`))
    .pipe(shell(`docfx build ${resolveTmpDir('./document/docfx.json')}`))
    .pipe(logger('Run server with:')(colors.cyan(colors.underline(`docfx serve ./docs`))))
    // .pipe(shell('docfx serve ./docs'))
  
})


const tmpTemplate = task('doc:templateTmp', () =>
  gulp.src(resolve('./config/document/**'))
    .pipe(replace('"../docs"', `"${resolve('./docs', true)}"`))
    .pipe(gulp.dest(resolveTmpDir('./document')))
)
const outputTemplate = task('doc:template', () => gulp.src(resolve('./config/document/**')).pipe(gulp.dest('./document')))
gulp.task('default', gulp.series(
  apiMain,
  apiTree,
  apiFix,
  tmpTemplate,
  gulp.parallel(
    shellTask(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`),
    // shell.task("api-documenter yaml -i ./etc -o ./document/src"),
    shellTask(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`)
  ),
  build
  // docFix
));
