import { exec } from "shelljs";
import Args from './args';
const type = ['patch', 'minor', 'major']
const args = new Args().addArgument(['-t', '-type'], {
  action: 'store',
  choices: type,
  dest: 'type',
  constant: 'patch',
  defaultValue: 'patch',
  help: `'patch', 'minor', 'major'`
}).init()

console.log(args)

if (!type.includes(args.type)) {
  throw new Error()
}

exec(`yarn version --new-version ${args.type} && git add .`)
exec('git commit -a -m "NEXT"')
exec('git push --set-upstream origin master')
// exec('yarn publish')