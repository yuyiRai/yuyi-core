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
  "static/bin/?51.dll",
  "./?51.dll",
  "./?5.1.dll",
  "./?.dll"
}, ";")..";"    --搜索clua模块

require("YuyiCore")
-- IupFileDlg Example in IupLua 
-- Shows a typical file-saving dialog. 

require( "iuplua" )
if (YuyiCore.tableIncludes(arg, "--open")) then 
  -- Creates a file dialog and sets its type, title, filter and filter info

  local filedlg = iup.filedlg{dialogtype = "OPEN", title = "打开Exo", 
                        filter = "*.exo", filterinfo = "(*.exo) Aviutl Exo files",
                        directory="c:\\windows"} 
  function filedlg:dropdata_cb(type, data, size, x, y) 
    YuyiCore.PrintTable({ type, data, size, x, y })
  end
  -- Shows file dialog in the center of the screen
  filedlg:popup(iup.ANYWHERE, iup.ANYWHERE)

  -- Gets file dialog status
  local status = filedlg.status
  if status == "1" then 
    iup.Message("New file", filedlg.value)
  elseif status == "0" then 
    iup.Message("File already exists", filedlg.value)
  elseif status == "-1" then 
    iup.Message("IupFileDlg","Operation canceled")
  end
  os.exit(0)
end
local show = require("utils/Frame")

show()
