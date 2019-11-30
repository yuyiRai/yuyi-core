const { Args } = require('@yuyi919/utils/dist/NodeUtils');
const path = require('path');

const pkgPath = path.join(__dirname, '../package.json')
const { version, description = '' } = require(pkgPath)

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
for (const p of [args.parser, execParser, commitParser, pubParser]) {
  p.addArgument(['-c', '--compiler'], {
    action: 'store',
    type: 'string',
    metavar: '<module_name>',
    defaultValue: 'typescript'
  })
}

const [main, other] = args.parser.parseKnownArgs()

console.log(main)
exports.main = main
exports.other = other

