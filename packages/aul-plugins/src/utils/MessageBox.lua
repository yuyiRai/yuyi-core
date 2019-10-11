local iup = require( "iuplua" )
local defaultParam = { "确定", "取消" }
local MessageBox = {}
function MessageBox.alarm(title, message, ...)
  local param = { ... }
  -- iup.Message("test", #param)
  local i = #param
  while i < 3 do
    table.insert(param, i, defaultParam[i])
    i = i + 1
  end
  -- iup.Message("test", #param)
  local r = iup.Alarm(title or "title", message or "message", param[1], param[2], param[3])
  -- Shows a message for each selected button
  if r == 1 then
    iup.Message("Save file", "File saved successfully - leaving program")
  elseif r == 2 then
    iup.Message("Save file", "File not saved - leaving program anyway")
  elseif r == 3 then
    iup.Message("Save file", "Operation canceled")
  end
  return r;
end
local function Example()
  MessageBox.alarm("title", "message")
end


return MessageBox, Example