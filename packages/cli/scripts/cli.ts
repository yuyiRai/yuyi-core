import colors from 'colors';
import fs from 'fs-extra';
import { Package } from 'normalize-package-data';
import path from 'path';
import publish from '../src/modules/publish';
import { main } from './params';
import { Register } from 'ts-node'

function join(str: string, ...arr: string[]) {
  return arr.filter(i => i).join(str)
}
function formatter(str: string) {
  str = str.replace(/\[(.*?)\]/ig, colors.underline(colors.yellow(`$1`)))
  str = str.replace(/\`(.*?)\`/ig, colors.bgWhite(colors.black(`$1`)))
  str = str.replace(/\((.*?)\)/ig, colors.hidden(colors.grey(`$1`)))
  return colors.cyan(str)
}

function logger(message: string, source: string = 'cli') {
  console.log(join('',
    source && colors.green(`[${source}]> `),
    formatter(message)
  ))
}
 
export function requireCwdFile(pathStr: string, action: 'require' | 'exec' | 'read config' = 'require') {
  const filePath = pathStr && path.resolve(pathStr)
  if (filePath && fs.pathExistsSync(filePath)) {
    logger(action + `: [${filePath}]`)
    return require(filePath) || true
  } else {
    return null
  }
}

export default (tsconfig: string, loader: Register) => {
  try {
    console.log(main)
    if (main.debug) {
      logger('use `debug` mode (123)')
    }
    logger(`loaded tsconfig: [${tsconfig}]`)
    const r = main
    // console.log(r, other)
    if (r.execFile) {
      // console.error(r)
      return requireCwdFile(r.execFile, "exec")
    } else if (r.usePublish) {
      const pkg: Package = requireCwdFile(r.usePublish, "read config")
      if (pkg) {
        // console.log(pkg)
        publish({
          pub: true,
          access: 'public',
          after: r.isGlobalModule && `yarn global add ${pkg.name}@latest` || null
        })
      }
    } else if ('push' in r) {
      publish({
        git: true,
        push: r.push
      })
    }
  } catch (error) {
    console.error(error)
    process.exit(0)
  }

  return null
}
