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

-- local rikky_module = require("rikky_module")
-- rikky_module.getinfo("text", 1)
-- <?
-- local rikky_module = require("rikky_module")
-- obj.mes(rikky_module.getinfo("text", 1).."1234")
-- ?>


local testTxt = [[
　分かりましたよ。でも明日は急に帰省して両親に会いたいような…」
「ふざけないでください！ゆかりさんがそこまで親孝行をする人なわけがないです！」
相当ひどい言い回しだ。
だがいくら私でも、ここまで熱情のこもった誘い方をされて、何一つ反応がないほど冷酷ではないのだ。
「うん…まあいいでしょう、此方のATフィールドを気にしないのであれば。」

「やったぁー！ありがとうゆかりさん！」
「どういたしました、ごちそうさまです。」
「あそう言えば！ゆか姉の電話番号っていくつだっけ？また連絡取らなきゃいけないですしね。」
「えっと、ちょっと待って…忘れちゃいましたね。」
「そりゃそうですよね！」
じゃああかりに掛けてくださいね。あかりの番号は…」
]] --YuyiCore.readFile('./test.txt')

local loaded = require 'lib.YuyiCore'


-- local std = require "std.table"
-- print(std.empty())
print(loaded)
local function result(r)
  YuyiCore.writeFile(
    './result.txt',
    r
  )
  -- print(r)
end
local function tableResult(r, j)
  result(YuyiCore.joinTable(r, j))
end

-- local mixed = table.concat(YuyiCore.stringToChars("。！？…」", true), ',')
-- print(mixed)
-- print(table.concat(YuyiCore.keys(), ','))

local splitstr = YuyiCore.getMixedPertten({
  "。！？…",
  -- { "…", false } --可选替换模式时（分隔后不保留分隔的字符）
}, "」") -- 保留字符，与之相邻的不会被当作分隔符
-- YuyiCore.stringToChars(testTxt)
-- print(YuyiCore.getStringLength("　分かりましたよ。でも明日は急に帰省して"))
-- print(string.byte('。'), string.byte('。', 2))
print('split:'..YuyiCore.toString(splitstr))
-- print('\227\128\141')
-- print('testTxt:'..string.byte(testTxt, 10))
-- print(string.find(testTxt, splitstr))
-- print(string.byte('！'))
-- YuyiCore.tableResult()
-- print(YuyiCore.toUnicode(string.byte('！')))
-- tableResult(
--   YuyiCore.stringToChars(testTxt),
--   ","
-- )
-- print(#string.match("\n　", '([^%z][%c%S]+)'))

-- function options()
-- end

-- YuyiCore.flatReduceMap
local function formatter(text)
  return table.concat(
    YuyiCore.chunkString(text, 20, YuyiCore.stringToChars("　「"), YuyiCore.stringToChars("。？！」")), 
    '\n'
  )
end

result(formatter(testTxt))
tableResult(
  YuyiCore.splitStrMul(formatter(testTxt), splitstr),
  "---------"
)


-- tableResult(YuyiCore.StringToTable(testTxt))

local testEnv = {}

testEnv.obj = { ['time'] = 1 }
testEnv.obj = {}

-- require 'src.lib.YuyiCore'

-- function ExecuteJs(path)
--   if nil == path then
--     print("open file for dir fail")
--     return
--   end
--   local msg = ''
--   local index = 0
--   local myfile = os.execute("forever start -o out.log -e err.log "..path, "r")
--   if nil == myfile then
--     print("open file for dir fail")
--   end

--   for cnt in myfile:lines() do
--     msg = msg..Condition(index > 0, '\n', '')..cnt
--     index = index + 1
--   end
--   -- 鍏抽???????????????????????????????????
--   myfile:close()
--   return msg
-- end


-- function Condition(epxect, ifTrue, ifFalse)
--   if epxect then
--     return ifTrue
--   else
--     return ifFalse
--   end
-- end
-- ExecuteJs()

-- local msg = arg[001] or testTxt

-- function PrintTable (t)
--  for i=0, #t do
--   print(t[i+1])
--  end
-- end
