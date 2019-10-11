-- IupFileDlg Example in IupLua
-- Shows a typical file-saving dialog.
local FileDialog = require "FileDialog"
FileDialog.callDialog("TEST")
-- local app = require("main")
-- local co = coroutine.wrap(
-- function ()
-- --  print("resume args:"..a..","..b)
--   app()
--   coroutine.yield()
--   return app
--   end
-- )
-- co()
-- local value = io.read()						-- 等待输入，即生产数据
-- print("produce: ", value)
-- co()