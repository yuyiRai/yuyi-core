#!/usr/bin/env node
const readline = require("readline");
const pathlib = require("path")
const { main, help } = require("../dist/pfv-extractor.cjs.production.min");

if (process.argv.length < 3) {
  console.log(help().replace(pathlib.basename(__filename), pathlib.basename(process.argv0)))
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  rl.on('line', function (line) {
    eval(line)
    process.exit()
  })
} else {
  try {
    main().then(() => { }).catch(e => process.stdout.write(e.message))
  } catch (error) {
    process.stdout.write(error.message)
  }
}
