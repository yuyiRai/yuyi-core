import colors from 'colors';
import fs from 'fs-extra';
import { Package } from 'normalize-package-data';
import path from 'path';
import publish from '../src/modules/publish';
import { main } from './params';
// console.log(version, description)


export function requireCwdFile(pathStr: string) {
  const filePath = pathStr && path.join(process.cwd(), pathStr)
  if (filePath && fs.pathExistsSync(filePath)) {
    console.log(colors.cyan('require file ' + filePath))
    return require(filePath) || true
  } else {
    return null
  }
}

try {
  const r = main
  // console.log(r, other)
  if (r.execFile) {
    var install = require('./exec-base').install
    // console.error(r)
    install(r.compiler)
    requireCwdFile(r.execFile)
  } else if (r.usePublish) {
    const pkg: Package = requireCwdFile(r.usePublish)
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
