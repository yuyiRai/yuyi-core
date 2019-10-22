import { Args } from '@yuyi919/utils/src/NodeUtils';
import colors from 'colors';
try {
const args = new Args({
  version: "0.0.1",
  description: `
  `
})
args.addArgument(['-c', '--config'], { action: 'storeTrue', dest: 'config' })
const sub = args.parser.addSubparsers({ title: 'exec', help: 'exec *.ts file' })
const subparser = sub.addParser("exec", { })
subparser.addArgument('<file>', {
  action: 'store',
  type: 'string'
})
subparser.addArgument(['-v', '-version'], {
  action: 'storeTrue',
  dest: "showVersion"
})
  const [r, other] = args.parser.parseKnownArgs()
  console.log(r, other)
} catch (error) {
  
}


console.log(colors.cyan('run git commit -a -m "NEXT"'))