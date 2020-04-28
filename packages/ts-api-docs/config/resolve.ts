import path from 'path';


declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CWD: string;
      DOC_PROJECT_NAME: string;
    }
  }
}


const { CWD, DOC_PROJECT_NAME: projectName, DOC_MAIN_POINT } = process.env
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
export function requireResolve(target: string, extname = '.d.ts') {
  return require.resolve(target, {
    paths: [CWD]
  }).replace('.js', extname).replace(/\\/g, '/');
}
export const paths = {
  mainTemplate: resolve('./config/api-extractor.main.template.json'),
  template: resolve('./config/api-extractor.template.json'),
  tmpProjectDir: resolveTmpDir(),
  tmpEtcDir: resolveTmpDir('./etc')
};
export { CWD, projectName, DOC_MAIN_POINT }
