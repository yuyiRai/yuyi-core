----@Platform
--
--
--track0:配置ID,0,10,0,1
--track1:行寬(字数),1,100,20,1
--track2:track2,0,1000,100,1
--track3:track3,0,1000,100,1
--dialog:行首字符,prefix="　「";行末字符,suffix="。？！」";段落分割符,szSeparator="。！？…";特殊字符,special="十予暴能表";
--check0:Debug,0
require("TrpgScript/TextPanel")
TextPanel.setPlatform(obj.check0 and obj.check0~=0, obj.track1, prefix, suffix)
