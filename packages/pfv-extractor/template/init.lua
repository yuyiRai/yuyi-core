----@初始化
--track0:編號,0,20,0,1
--track1:口部件的Layer号,0,100,0,1
--track2:反転,-1,3,-1,1
--track3:縮小率,0.01,100,100,0.01
--dialog:全体初始化/chk,local isInit=0;初始化参数,local initParams=1;識別用Tag,local p_tag="${tag}";Ptkl,local ptkl="";使用minipsd/chk,local useMin=0;;
--check0:复制脚本到剪贴板,1
local lib = require("./lib")(package)
local params = require("./${paramsFileName}")

local userDir="${absoluteDir}" -- User目録
local psd_n="${psdName}" --psd文件名
local pfv_n="${pfvName}" --pfv文件名
local psd_n_min="${minPsdName}" --minipsd文件名

if useMin == 1 then
  psd_n = psd_n_min
end

local ptfk = userDir.."/"..psd_n.."|"..pfv_n

obj.setfont("Times New Roman Greek",35,3,0xff0000,0x000000)
obj.load("text","error: "..ptfk,0,0)
obj.setoption("dst","tmp")
obj.draw(0,0,0,1)

local o={ -- オプション設定
	lipsync = obj.track1    ,-- 口パク準備のレイヤー番号
	scene = obj.track0    ,-- シーン番号
	mpslider = 0    ,-- 多目的スライダーのレイヤー番号
	tag = p_tag    ,-- 識別用タグ

	-- 口パク準備のデフォルト設定
	ls_locut = 100    ,-- ローカット
	ls_hicut = 1000    ,-- ハイカット
	ls_threshold = 20    ,-- しきい値
	ls_sensitivity = 1    ,-- 感度

	-- 以下は書き換えないでください
	ptkf = ptfk,
	ptkl = ptkl	
}
PSD,subobj=require("PSDToolKit").PSDState.init(obj,o)

if obj.track2 ~= -1 then
  PSD:addstate("L." .. obj.track0)
end

if obj.check0 or obj.check0 then
  lib.setClipboard(lib.getScriptsText(psd_n, obj.track1, obj.track0, p_tag, ptfk, ptkl))
else
  lib.clearClipboard()
end

if isInit==1 then
  for i=1, #params do
    PSD:addstate(params[i], initParams)
  end
end
