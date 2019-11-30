#!/usr/bin/env node
"use strict";
var path = require('path');
var install = require('./exec-base').install
var { main } = require('./params')
install(main.compiler)

// console.log(process.cwd(), process.argv, process.argv[2])
require(path.join(__dirname, './cli.ts'))
