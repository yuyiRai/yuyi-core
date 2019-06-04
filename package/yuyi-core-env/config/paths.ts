import fs from 'fs-extra';
import path from 'path';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637

/**
 * 本项目的目录
 */
export const envDirectory: string = path.join(fs.realpathSync(__dirname), '..');
export const clintDirectory: string = fs.realpathSync(process.cwd());
export const resolveProject = (relativePath: string) => path.resolve(envDirectory, relativePath);
export const resolveApp = (relativePath: string) => path.resolve(clintDirectory, relativePath);

export const envPublicUrl = process.env.PUBLIC_URL;

export const getPublicUrl = (clintPackageJson: string) => {
  console.log(clintPackageJson)
  return envPublicUrl || require(clintPackageJson).homepage;
}


export const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

/**
 * Resolve file paths in the same order as webpack
 * @param resolveFn 
 * @param filePath 
 */
export const resolveModule = (resolveFn: typeof resolveProject, filePath: string) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

export const distKeyName = {
  jsDir: 'js',
  cssDir: 'css',
  publicDir: 'static',
  distDir: 'dist',
  entryHtmlName: 'index.html',
  entryJsName: 'index.js'
}

const pathsBase = {
  requirePath: resolveProject('./config/run-ts.js'),
  typedocGulpFile: resolveProject('../yuyi-core-docs/gulpfile.ts'),
  typedocConfig: resolveProject('../yuyi-core-docs/typedoc.json'),
  typedocConfigAsync: resolveProject('../yuyi-core-docs/typedoc.ts'),
  typedocStringTemplate: resolveProject('../yuyi-core-docs/config/stringTemplate.json'),
  typedocTheme: resolveProject('../yuyi-core-docs/bin/default'),
  dotenv: resolveApp('.env'),
  clintPath: resolveApp('.'),
  clintDist: resolveApp('dist'),
  clintBuild: resolveApp('build'),
  clintDepregistry: resolveApp('dist/registry.json'),
  clintPublic: resolveApp('public'),
  clintLib: resolveApp('lib'),
  clintHtml: resolveApp('public/index.html'),
  clintIndexJs: resolveModule(resolveApp, 'src/index'),
  clintPackageJson: resolveApp('package.json'),
  clintSrc: resolveApp('src'),
  clintTsConfig: resolveProject('tsconfig.json'),
  clintTsConfigDev: resolveProject('tsconfig.dev.json'),
  clintNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
};
export type BasePaths = typeof pathsBase
export type BasePathKeys = keyof BasePaths
export const paths: BasePaths = {...pathsBase}


export const pathSearcher = <K extends BasePathKeys>(dir: BasePaths[K], suffix: string = "*") => {
  return path.join(dir, `**/*.${suffix}`)
};
export function preventPath(path: string) {
  if (!fs.existsSync(path)) {
    fs.ensureDirSync(path)
  }
  return path
}

export const relativePaths: BasePaths = Object.entries(pathsBase).reduce(
  (obj, [key, value]) => {
    return value ? ({...obj, [key]: path.relative(process.cwd(), value) }) : obj
  }, {}
) as BasePaths;


export default {
  ...paths,
  clintDistMainHTML: path.join(paths.clintDist, distKeyName.entryHtmlName),
  clintDistCssDir: path.join(paths.clintDist, distKeyName.cssDir),
  clintDistScriptsDir: path.join(paths.clintDist, distKeyName.jsDir),
  clintDistPublicDir: path.join(paths.clintDist, distKeyName.publicDir),
  clintJsMatcher: pathSearcher(paths.clintLib, 'js'),
  clintTsMatcher: [pathSearcher(paths.clintSrc, 'ts'), pathSearcher(paths.clintSrc, 'tsx'), `!${pathSearcher(paths.clintSrc, 'd.ts')}`],
  clintDTsMatcher: pathSearcher(paths.clintLib, 'd.ts'),
  clintCssMatcher: pathSearcher(paths.clintSrc, 'css'),
  clintSvgMatcher: pathSearcher(paths.clintSrc, 'svg'),
  clintEntryJs: path.join(paths.clintLib, distKeyName.entryJsName),
  clintBrowserifyCache: path.join(paths.clintDist, 'browserify-cache.json'),
};