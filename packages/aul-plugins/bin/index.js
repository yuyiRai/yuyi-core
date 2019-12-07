const fs = require('fs-extra')
process.stdout.write(process.argv[2])
fs.writeJSON('./app.json', process.argv)
