import { Args } from '@yuyi919/utils/dist/NodeUtils';
import colors from 'colors';
import fs from 'fs-extra'
import path from 'path'
import { Package } from 'normalize-package-data';
import publish from '../src/modules/publish'

const pkgPath = path.join(__dirname, '../package.json')
const { version, description = '' } = require(pkgPath)
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

const args = new Args({
  version,
  description
})

const sub = args.parser.addSubparsers({ title: 'actions', description: 'anothers' })

const commitParser = sub.addParser("commit", {
  help: 'dev commit',
  version
})
commitParser.addArgument(["-p", "--push"], {
  action: 'storeTrue',
  dest: "push",
  defaultValue: false
})

const pubParser = sub.addParser("pub", {
  help: 'dev publish',
  version
})
pubParser.addArgument(["-p", "--package"], {
  action: 'store',
  type: 'string',
  dest: "usePublish",
  defaultValue: './package.json'
})
pubParser.addArgument(["-g", "--global-module"], {
  action: 'storeTrue',
  dest: "isGlobalModule"
})

const execParser = sub.addParser("exec", {
  help: 'exec *.ts file',
  version
})
execParser.addArgument('execFile', {
  action: 'store',
  type: 'string',
  metavar: '<file>',
  defaultValue: 'unknown'
})

try {
  const [r, other] = args.parser.parseKnownArgs()
  // console.log(r, other)

  if (r.execFile) {
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
