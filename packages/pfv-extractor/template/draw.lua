----@描画_${characterName}
--track0:反転,-1,3,-1,1
--track1:縮小率,0.01,100,100,0.01
--track2:オフセットX,-5000,5000,0,1
--track3:オフセットY,-5000,5000,0,1
--dialog:Debug offset,debugOffset={0,0};只在活動狀態展示debug信息/chk,guiOnly=0;
--check0:Debug,0
require("./lib")(package)
local params = require("./${paramsFileName}")

if obj.track0 ~= -1 then
  PSD:addstate("L." .. obj.track0)
end
PSD.scale = obj.track1/100
PSD.offsetx = obj.track2
PSD.offsety = obj.track3
local ok, msg = pcall(PSD.render, PSD, obj)
if not ok then require("PSDToolKit").print(obj, msg) end

if obj.getinfo("saving") ~= true and (guiOnly ~= 1 or obj.getoption("gui")) and obj.check0 and type(debugOffset) == 'table' then
  local txt = {}
  for i=1, #params do
    local param = params[i]
    local current = param.current or {}
    table.insert(txt, param.name..":"..(current[2] and (current[2]) or "默認"))
  end
	obj.copybuffer("tmp", "obj")
	obj.setoption("dst", "tmp")
	obj.setfont("Times New Roman Greek",35,3,0xff0000,0xffffff)
	obj.load("text", table.concat(txt, "\n"), 0, obj.time)
	obj.draw(debugOffset[1] or 0, debugOffset[2] or 0, 0, 1)
	obj.load("tempbuffer")
end
