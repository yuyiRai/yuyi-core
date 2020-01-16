const { windef, utils, Key } = require('windows-registry');
// const path = require('path')
// const iconv = require('iconv-lite')

utils.elevate(process.execPath, './index.js', function (err, result) { console.log(result); });

// utils.elevate()
