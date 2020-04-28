
import createApiTask, { createMainApiTask } from './ApiExtractor';
import ApiExtractorFix from './ApiExtractorFix';
import * as gulp from 'gulp';
import shell from 'gulp-shell';
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

gulp.task('doc:template', () => gulp.src(resolve('./config/document/**')).pipe(gulp.dest('./document')))
gulp.task('default', gulp.series(
  apiMain,
  apiTree,
  // apiFix,
  // 'doc:template',
  // gulp.parallel(
  //   shell.task(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${`./document/articles`}`),
  //   // shell.task("api-documenter yaml -i ./etc -o ./document/src"),
  //   shell.task(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${`./document/src`}`)
  // ),
  // docFix
));
