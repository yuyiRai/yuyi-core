const { cd, exec, echo, touch } = require("shelljs")

exec('git add .')
exec('git commit -a -m "NEXT"')
exec('git push --set-upstream origin master')
exec('npm version patch && npm publish')