import { exec } from "shelljs";
import Args from './args';
import colors from 'colors';
const type = ['patch', 'minor', 'major']
const args = new Args().addArgument(['-t', '-type'], {
  action: 'store',
  choices: type,
  dest: 'type',
  constant: 'patch',
  defaultValue: 'patch',
  help: `'patch', 'minor', 'major'`
}).addArgument(
  ['-p', '-push'], {
    action: 'storeTrue',
    dest: 'push'
  }
).init()

console.log(args)

if (!type.includes(args.type)) {
  throw new Error()
}

console.log(colors.cyan('run git commit -a -m "NEXT"'))
try {
  exec(`git add .`)
  // exec(`yarn version --new-version ${args.type} && git add .`)
  exec('git commit -a -m "NEXT"')
  if (args.push) {
    exec('git push --set-upstream origin master')
  }
  // exec('yarn publish')
} catch (error) {

}