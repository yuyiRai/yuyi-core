
import createApiTask, { createMainApiTask, createDependApiTask } from './gulp/ApiExtractor';
import ApiExtractorFix from './gulp/ApiExtractorFix';
import replace from 'gulp-replace';
import colors from 'colors';
import { MarkdownAction, YamlAction } from './cli';
import { logger, shell, shellTask, task } from '@yuyi919/gulp-awesome';
import * as gulp from 'gulp';
import { DOC_ACTION_TYPE, projectName, resolve, resolveTmpDir, depends, resolveModuleDTS, paths } from './resolve';

/**
 * 注册gulp.task
 */
export function init() {
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
    return gulp.src('.', { read: false })
      .pipe(logger('Exec')(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`))
      .pipe(logger('Exec')(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`))
      .pipe(logger('Exec')(`docfx build ${resolveTmpDir('./document/docfx.json')}`))
      .pipe(shell(`docfx build ${resolveTmpDir('./document/docfx.json')}`))
      .pipe(logger('Run server with:')(colors.cyan(colors.underline(`docfx serve ./docs`))));
    // .pipe(shell('docfx serve ./docs'))

  });
  const prebuild = task('prebuild', () => {
    return gulp.series(
      () => gulp.src('.', { read: false })
        .pipe(logger('Exec')(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`))
        .pipe(logger('Exec')(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`))
        .pipe(logger('Run docfx-build with:')(colors.cyan(colors.underline(`docfx build ./documents/docfx.json`)))),
      task(`输出到${resolve('./document', true)}`, () => gulp.src(
        resolveTmpDir('./document/*')
      ).pipe(gulp.dest(resolve('./document', true))))
    )

  });


  const tmpTemplate = task('doc:templateTmp', () =>
    gulp.src(resolve('./config/document/**'))
      .pipe(replace('"../docs"', `"${resolve('./docs', true)}"`))
      .pipe(gulp.dest(resolveTmpDir('./document')))
  );
  const cleanDocTmp = task('clean:doctmp', shellTask(`rimraf ${resolveTmpDir('./document/**')}`));
  // const outputTemplate = task('doc:template', () => gulp.src(resolve('./config/document/**')).pipe(gulp.dest('./document')));

  gulp.task('default', gulp.series(
    // task('cleanApiJson', shellTask(`rimraf ${resolveTmpDir('./*.api.json')}`)),
    // // apiMain,
    // apiTree,
    // // (async (done) => {
    // //   const tasks = [];
    // //   const results = await Promise.all(depends.map(resolveModuleDTS));
    // //   for (const [moduleName, dtsPath] of results) {
    // //     tasks.push(createDependApiTask(moduleName, dtsPath));
    // //   }
    // //   console.error(tasks);
    // //   return gulp.parallel(tasks)(done);
    // // }),
    // apiFix,
    // cleanDocTmp,
    // tmpTemplate,
    // gulp.parallel(
    //   task('markdown:articles', async () => {
    //     const action = new MarkdownAction(resolveTmpDir(`./etc`), resolveTmpDir(`./document/articles`));
    //     return await action.onExecute(resolve('.', true));
    //   }),
    //   task('ymlfile:src', async () => {
    //     const action = new YamlAction(resolveTmpDir(`./etc`), resolveTmpDir(`./document/src`));
    //     return await action.onExecute();
    //   }),
    //   // shellTask(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`),
    //   // shellTask(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`)
    // ),
    // docFix,
    ({
      html: build,
      docfx: prebuild
    })[DOC_ACTION_TYPE]
  ));

}
