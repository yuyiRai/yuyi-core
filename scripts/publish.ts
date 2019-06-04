import colors from 'colors'
import shell from 'shelljs'
console.log(`${colors.yellow('welcome')} ${colors.cyan('publish!')}`)

shell.exec('yarn run init')

process.exit()