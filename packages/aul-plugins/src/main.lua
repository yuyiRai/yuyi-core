package.path = package.path..table.concat({
  "src/?.lua",
  "src/TrpgScript/?.lua",
  "./?.lua",
  "lib/?.lua",
  "clib/?.dll",
  "clib/?51.dll",
  "utils/?.lua",
  "src/lib/?.lua",
  "src/utils/?.lua"
}, ";")    --搜索lua模块
require("YuyiCore")
local show = require("utils/Frame")

show()
