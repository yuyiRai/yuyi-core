import { Args } from '@yuyi919/utils/src/NodeUtils';
import colors from 'colors';
import fs from 'fs-extra'
import path from 'path'

try {
  const args = new Args({
    version: "0.0.1",
    description: `
    `
  })
  args.addArgument(['-c', '--config'], { action: 'storeTrue', dest: 'config' })
  const sub = args.parser.addSubparsers({ title: 'actions', description: 'anothers' })
  const subparser = sub.addParser("exec", { help: 'exec *.ts file' })
  subparser.addArgument('<file>', {
    action: 'store',
    type: 'string'
  })
  subparser.addArgument(['-v', '-version'], {
    action: 'storeTrue',
    dest: "showVersion"
  })
  const [r, other] = args.parser.parseKnownArgs()
  // console.log(r, other)
  const filePath = r['<file>'] && path.join(process.cwd(), r['<file>'])
  if (filePath && fs.pathExistsSync(filePath)) {
    console.log(colors.cyan('require file ' + filePath))
    require(filePath)
  }
} catch (error) {
  
}

