import { paths } from '../yuyi-core-env/config/paths'
import { exec } from "shelljs";
import { concat, filter } from 'lodash'
import Args from '../yuyi-core-env/scripts/args'
import classnames from 'classnames';
const args = new Args()
  .addArgument(['--watch', '-w'], {
    action: 'appendConst',
    constant: 'watch'
  })
  .addArgument(['--init', '-i'], {
    action: 'appendConst',
    constant: 'init'
  }).init()

// 继承相对路径运行
exec(`gulp --require ${
  paths.requirePath
} -f ${
  paths.typedocGulpFile
} --cwd ${
  process.cwd()
} ${
  classnames(['typedoc', args]).split(' ').join('-')
}`)

