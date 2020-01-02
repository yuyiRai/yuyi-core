package.path = package.path..";"..table.concat({
  "src/?.lua",
  "src/YuyiCore/?.lua",
  "src/TrpgScript/?.lua",
  "./?.lua",
  "lib/?.lua",
  "utils/?.lua",
  "src/lib/?.lua",
  "src/utils/?.lua"
}, ";")..";"    --搜索lua模块
package.cpath = package.cpath..";"..table.concat({
  "static/scripts/?.dll",
  "static/bin/?.dll",
  "static/bin/?51.dll"
}, ";")..";"    --搜索clua模块
require("YuyiCore")
local show = require("utils/Frame")

show()
