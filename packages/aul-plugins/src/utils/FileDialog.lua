local FileDialog = {}
function FileDialog.callDialog(title, dialogtype)
  local type = (function ()
    if dialogtype == 1 then
      return "OPEN"
    else
      return "SAVE"
    end
  end)()
  local iup = require("iuplua")

  -- Creates a file dialog and sets its type, title, filter and filter info
  local filedlg = iup.filedlg{dialogtype = type, title = title or "File save",
                        filter = "*.lua", filterinfo = "Lua",
                        directory="c:\\windows"}
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
end

_G["FileDialog"] = FileDialog
package.loaded["FileDialog"] = FileDialog
return FileDialog