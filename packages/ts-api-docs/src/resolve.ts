import path from 'path';
import glob from 'glob'
import fs from 'fs-extra'


declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CWD: string;
      DOC_PROJECT_NAME: string;
      DOC_ACTION_TYPE: "html" | "serve" | "docfx" | "md";
      DOC_SERVE_PORT: string;
    }
  }
}


var { CWD, DOC_SERVE_PORT = '8009', DOC_ACTION_TYPE = 'docfx', DOC_PROJECT_NAME: projectName, DOC_DEPENDS, DOC_MAIN_POINT } = process.env
var depends: string[] = (typeof DOC_DEPENDS === 'string' && DOC_DEPENDS.split(',') || [])

export function resolve(target: string, out = false, ...paths: string[]) {
  return out ? resolveTarget(target, ...paths) : resolveCli(target, ...paths);
}
function resolveCli(target: string, ...paths: string[]) {
  return path.join(__dirname, '..', target, ...paths).replace(/\\/g, '/');
}
function resolveTarget(target: string, ...paths: string[]) {
  return path.join(process.env.CWD, target, ...paths).replace(/\\/g, '/');
}
export function resolveTmpDir(...paths: string[]) {
  return resolve(`./.tmp/api/${projectName}`, false, ...paths)
}
export function resolveConfigDir(...paths: string[]) {
  return resolve(`./config`, false, ...paths);
}
export function requireResolve(target: string, extname = '.d.ts') {
  return require.resolve(target, {
    paths: [CWD]
  }).replace('.js', extname).replace(/\\/g, '/');
}

export async function resolveModuleDTS(target: string): Promise<[string, string]> {
  return new Promise(r => {
    try {
      const short = requireResolve(path.join(target, 'index.d.ts'));
      if (fs.existsSync(short)) {
        return r(short);
      }
    } catch (error) {
      
    }
    const dir = path.parse(requireResolve(path.join(target, 'package.json'))).dir;
    // console.error(dir)
    glob('**/index.d.ts', { cwd: dir }, (error, paths) => {
      const short = paths.sort((a, b) => a.length - b.length)[0]
      if (short) {
        console.error(dir, short);
        r(path.join(dir, short).replace(/\\/g, '/'));
      }
    });
  }).then(path => {
    console.error([target, path])
    return [target, path] as [string, string]
  })
  // console.error({ ...paths });
  // console.error(target, path.join(CWD, 'node_modules', target));
  // console.error(requireResolve(path.join(target, 'index.d.ts')));
}


export const paths = {
  docFxTemplate: resolve('./config/template/memberpage.2.43.2/content'),
  mainTemplate: resolve('./config/api-extractor.main.template.json'),
  template: resolve('./config/api-extractor.template.json'),
  tmpProjectDir: resolveTmpDir(),
  tmpEtcDir: resolveTmpDir('./etc')
};
export { CWD, projectName, DOC_MAIN_POINT, DOC_ACTION_TYPE, DOC_SERVE_PORT, depends }
