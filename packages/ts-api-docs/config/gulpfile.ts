
import createApiTask, { createMainApiTask, createDependApiTask } from './ApiExtractor';
import ApiExtractorFix from './ApiExtractorFix';
import replace from 'gulp-replace';
import colors from 'colors';
import { MarkdownAction, YamlAction } from '..';
import { logger, shell, shellTask, task } from '@yuyi919/gulp-awesome'
import * as gulp from 'gulp';
import { projectName, resolve, resolveTmpDir, depends, resolveModuleDTS, paths } from './resolve';
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
    .pipe(logger('Exec')(`docfx build ${resolveTmpDir('./document/docfx.json')}`))
    .pipe(shell(`docfx build ${resolveTmpDir('./document/docfx.json')}`))
    .pipe(logger('Run server with:')(colors.cyan(colors.underline(`docfx serve ./docs`))))
    // .pipe(shell('docfx serve ./docs'))
  
})


const tmpTemplate = task('doc:templateTmp', () =>
  gulp.src(resolve('./config/document/**'))
    .pipe(replace('"../docs"', `"${resolve('./docs', true)}"`))
    .pipe(gulp.dest(resolveTmpDir('./document')))
)
const cleanDocTmp = task('clean:doctmp', shellTask(`rimraf ${resolveTmpDir('./document/**')}`))
const outputTemplate = task('doc:template', () => gulp.src(resolve('./config/document/**')).pipe(gulp.dest('./document')))

gulp.task('default', gulp.series(
  // apiMain,
  apiTree,
  // (async (done) => {
  //   const tasks = [];
  //   const results = await Promise.all(depends.map(resolveModuleDTS));
  //   for (const [moduleName, dtsPath] of results) {
  //     tasks.push(createDependApiTask(moduleName, dtsPath));
  //   }
  //   console.error(tasks);
  //   return gulp.parallel(tasks)(done);
  // }),
  apiFix,
  cleanDocTmp,
  tmpTemplate,
  gulp.parallel(
    task('markdown:articles', async () => {
      const action = new MarkdownAction(resolveTmpDir(`./etc`), resolveTmpDir(`./document/articles`))
      return await action.onExecute(resolve('.', true))
    }),
    task('ymlfile:src', async () => {
      const action = new YamlAction(resolveTmpDir(`./etc`), resolveTmpDir(`./document/src`));
      return await action.onExecute();
    }),
    // shellTask(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`),
    // shellTask(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`)
  ),
  docFix,
  build
));
