----@操作_${paramsName}
----${paramOptions}
--dialog:默認/chk,local useDefault=1;${dialogs}
--check0:Debug,1
local lib = require("./lib")(package)
local defaultOptions = { default1, default2, default3, default4 }
local options, useDebug = lib.useOptions(obj)
local params = require("./${paramsFileName}")

lib.print(obj, "需要画布", useDebug)
-- local txt = {}
local indexParam = nil
local paramTitle = nil
local paramKeys = { "${paramKeys}" }
for i=1,#paramKeys do
  indexParam = options[i]
  local param = params[paramKeys[i]]
  if useDebug then
    paramTitle = param.display[indexParam]
    param.current = { indexParam, paramTitle }
  end
  if indexParam ~= 0 then
	  PSD:addstate(param, indexParam)
	elseif useDefault and useDefault == 1 then 
	  PSD:addstate(param, defaultOptions[i])
	end
end
