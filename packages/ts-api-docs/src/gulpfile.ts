
import createApiTask, { createMainApiTask, createDependApiTask } from './gulp/ApiExtractor';
import ApiExtractorFix from './gulp/ApiExtractorFix';
import replace from 'gulp-replace';
import colors from 'colors';
import { MarkdownAction, YamlAction } from './cli';
import gulp from 'gulp'
import { series, parallel, logger, shell, shellTask, task } from '@yuyi919/gulp-awesome';
import { DOC_SERVE_PORT, DOC_ACTION_TYPE, projectName, resolve, resolveTmpDir, depends, resolveModuleDTS, paths } from './resolve';

/**
 * 注册gulp.task
 */
export function init() {

  const taskMainApiExtractor = task('api:main', createMainApiTask());
  const taskTreeApiExtractor = task('api:all', createApiTask());
  const taskApiFix = task('api:fix', ApiExtractorFix.createApiTask());
  const taskDocFix = task('doc:fix', ApiExtractorFix.createApiFixedTask({
    items: [
      { name: projectName }
    ]
  }));

  const taskCleanApiJson = task('api:clean', shellTask(`rimraf ${resolveTmpDir('./**/*.*')}`))

  const build = task('doc:build',
    () => gulp.src('.', { read: false })
      .pipe(logger('Exec')(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`))
      .pipe(logger('Exec')(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`))
      .pipe(logger('Exec')(`docfx build ${resolveTmpDir('./document/docfx.json')}`))
      .pipe(shell(`docfx build ${resolveTmpDir('./document/docfx.json')}`))
      .pipe(logger('Run server with:')(colors.cyan(colors.underline(`docfx serve ./docs`))))
    // .pipe(shell('docfx serve ./docs'))
  );

  const serveCmd = `docfx ${resolve('./document/docfx.json', true)}  --serve -p ${DOC_SERVE_PORT}`
  const prebuild = task('prebuild', series(
    task(`输出到${resolve('./document', true)}`, () => gulp.src(
      resolveTmpDir('./document/**/*.*')
    ).pipe(gulp.dest(resolve('./document', true)))),
    task('completed', () => {
      const runner = gulp.src('.', { read: false })
        .pipe(logger('Exec')(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`))
        .pipe(logger('Exec')(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`))
        .pipe(logger('Run docfx-build with:')(colors.cyan(colors.underline(`docfx build ./documents/docfx.json`))))
        .pipe(logger('Run docfx-serve with:')(colors.cyan(colors.underline(serveCmd))))
      return DOC_ACTION_TYPE === 'serve' ? runner.pipe(shell(serveCmd)) : runner
    })
  ));


  const taskUseTmpTemplate = task(
    'doc:templateTmp',
    () => gulp.src(resolve('./config/document/**'))
      .pipe(replace('"../docs"', `"${resolve('./docs', true)}"`))
      .pipe(gulp.dest(resolveTmpDir('./document')))
  );
  const taskCleanDocTmp = task('clean:doctmp', shellTask(`rimraf ${resolveTmpDir('./document/**')}`));
  // const outputTemplate = task('doc:template', () => gulp.src(resolve('./config/document/**')).pipe(gulp.dest('./document')));
  const taskDocGenerateMeta = task('doc:generateMeta', parallel(
    task('markdown:articles', async () => {
      const action = new MarkdownAction(resolveTmpDir(`./etc`), resolveTmpDir(`./document/articles`));
      return await action.onExecute(resolve('.', true));
    }),
    task('ymlfile:src', async () => {
      const action = new YamlAction(resolveTmpDir(`./etc`), resolveTmpDir(`./document/src`));
      return await action.onExecute();
    }),
    // shellTask(`api-documenter markdown -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/articles`)}`),
    // shellTask(`api-documenter yaml -i ${resolveTmpDir(`./etc`)} -o ${resolveTmpDir(`./document/src`)}`)
  ))

  task('default', series(
    taskCleanApiJson,
    // taskMainApiExtractor,
    taskTreeApiExtractor,
    // (async (done) => {
    //   const tasks = [];
    //   const results = await Promise.all(depends.map(resolveModuleDTS));
    //   for (const [moduleName, dtsPath] of results) {
    //     tasks.push(createDependApiTask(moduleName, dtsPath));
    //   }
    //   console.error(tasks);
    //   return gulp.parallel(tasks)(done);
    // }),
    taskApiFix,
    taskCleanDocTmp,
    taskUseTmpTemplate,
    taskDocGenerateMeta,
    taskDocFix,
    (({
      html: build
    })[DOC_ACTION_TYPE]) || prebuild
  ))
}
