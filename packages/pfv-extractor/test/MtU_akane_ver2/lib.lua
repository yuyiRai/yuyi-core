local store = {}

local function writeFile(path, content)
  local f = io.open(path, "w")
  f:write(content)
  f:close()
  return f
end

local function useOptions(obj) 
  local options = { obj.track0, obj.track1, obj.track2, obj.track3 }
  local useDebug = obj.check0 or obj.check0 == 1
  return options, useDebug
end

local function print(obj, msg, use)
  if use then
    obj.setfont("Times New Roman Greek",35,3,0xff0000,0x000000)
    obj.load("text",msg,0,obj.time)
    obj.setoption("dst","tmp")
    obj.draw(0,0,0,1)
  end
end

local function setClipboard(msg)
  if msg ~= store.lastMsg then
    writeFile("./pfv_loader.cache", msg)
	  os.execute("CHCP 932 && clip < ./pfv_loader.cache")
    store.lastMsg = msg
  end
end

local function getScriptsText(psdName, lipsync, scene, p_tag, ptfk, ptkl)
  return [[<?--]]..psdName..[[
o={ -- オプション設定
lipsync = ]]..lipsync..[[    ,-- 口パク準備のレイヤー番号
scene = ]]..scene..[[    ,-- シーン番号
mpslider =  0   ,-- 多目的スライダーのレイヤー番号
tag = ]]..p_tag..[[    ,-- 識別用タグ

-- 口パク準備のデフォルト設定
ls_locut = 100    ,-- ローカット
ls_hicut = 1000    ,-- ハイカット
ls_threshold = 20    ,-- しきい値
ls_sensitivity = 1    ,-- 感度

-- 以下は書き換えないでください
ptkf="]]..ptfk..[[",ptkl="]]..ptkl..[["}
PSD,subobj=require("PSDToolKit").PSDState.init(obj,o)?>]]
end

return function ()
  package.path = package.path..";"..table.concat({
    "Script/PSDToolKit/?.lua",
    "PSDToolKit/?.lua",
    "?.lua",
  }, ";")..";"
  package.cpath = package.cpath..";"..table.concat({
    "Script/PSDToolKit/?.dll",
    "Script/?.dll",
    "?.dll",
  }, ";")..";"
  
  return {
    useOptions = useOptions,
    print = print,
    setClipboard = setClipboard,
    getScriptsText = getScriptsText
  }
end
