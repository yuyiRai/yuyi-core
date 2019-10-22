import { exec } from "shelljs";

export default function publish(args: {
  git?: boolean;
  pub?: boolean;
  push?: boolean;
  type?: 'patch' | 'major' | 'minor';
  access?: string;
  after?: string;
}) {
  if (args.git) {
    exec(`git add .`)
  }
  if (args.pub) {
    exec(`yarn version --new-version ${args.type || 'patch'} && git add .`)
  }
  if (args.git) {
    exec('git commit -a -m "NEXT"')
    if (args.push) {
      exec('git push --set-upstream origin master')
    }
  }
  if (args.pub) {
    exec(['yarn publish', args.access && '--access=' + args.access || ''].join(' '))
  }
  if (args.after) {
    exec(args.after)
  }
}