
    --指rootName, pfv是[お気に入り], ?有一?是Layer
    local controlType = "お気に入り"
    local fileName = "紲星あかり"
    local params = {
      controlType = controlType,
      name = fileName
    }
    --按索引存?各params的name
    local paramsDisplay = {}
    --按索引存?各params的options的name
    local optionsDisplay = {}
    
    --*紲星あかり/服: ["看板","袖なし","学生","日常"]
    optionsDisplay[1] = {
      "\138\197\148\194","\145\179\130\200\130\181","\138\119\144\182","\147\250\143\237"
    }
    --常用表互相?接
    paramsDisplay[1] = "\149\158"
    params[1] = {
      name = paramsDisplay[1],
      display = optionsDisplay[1]
    }
    params[paramsDisplay[1]] = params[1]
    --S.お気に入り/*紲星あかり/服~看板
    params[1][1] = "S."..controlType.."/*"..fileName.."/\149\158\126\138\197\148\194"
    --S.お気に入り/*紲星あかり/服~袖なし
    params[1][2] = "S."..controlType.."/*"..fileName.."/\149\158\126\145\179\130\200\130\181"
    --S.お気に入り/*紲星あかり/服~学生
    params[1][3] = "S."..controlType.."/*"..fileName.."/\149\158\126\138\119\144\182"
    --S.お気に入り/*紲星あかり/服~日常
    params[1][4] = "S."..controlType.."/*"..fileName.."/\149\158\126\147\250\143\237"
  

    --*紲星あかり/姿勢: ["伸ばし","§￣ー￣)","グッ","グー","Yeahー","Yeahー2","見ろ、私の腕","見て、この包丁","いただきます","まったく！","頭抱え","ドヤー","さぁ？","さぁ？２","どうだ？","どうだ？２","どうだ？３","食事","食事２","食事３"]
    optionsDisplay[2] = {
      "\144\76\130\206\130\181","\129\152\129\80\129\91\129\80\41","\131\79\131\98","\131\79\129\91","\89\101\97\104\129\91","\89\101\97\104\129\91\50","\140\169\130\235\129\65\142\132\130\204\152\114","\140\169\130\196\129\65\130\177\130\204\149\239\146\154","\130\162\130\189\130\190\130\171\130\220\130\183","\130\220\130\193\130\189\130\173\129\73","\147\170\149\248\130\166","\131\104\131\132\129\91","\130\179\130\159\129\72","\130\179\130\159\129\72\130\81","\130\199\130\164\130\190\129\72","\130\199\130\164\130\190\129\72\130\81","\130\199\130\164\130\190\129\72\130\82","\144\72\142\150","\144\72\142\150\130\81","\144\72\142\150\130\82"
    }
    --常用表互相?接
    paramsDisplay[2] = "\142\112\144\168"
    params[2] = {
      name = paramsDisplay[2],
      display = optionsDisplay[2]
    }
    params[paramsDisplay[2]] = params[2]
    --S.お気に入り/*紲星あかり/姿勢~伸ばし
    params[2][1] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\144\76\130\206\130\181"
    --S.お気に入り/*紲星あかり/姿勢~§￣ー￣)
    params[2][2] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\129\152\129\80\129\91\129\80\41"
    --S.お気に入り/*紲星あかり/姿勢~グッ
    params[2][3] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\131\79\131\98"
    --S.お気に入り/*紲星あかり/姿勢~グー
    params[2][4] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\131\79\129\91"
    --S.お気に入り/*紲星あかり/姿勢~Yeahー
    params[2][5] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\89\101\97\104\129\91"
    --S.お気に入り/*紲星あかり/姿勢~Yeahー2
    params[2][6] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\89\101\97\104\129\91\50"
    --S.お気に入り/*紲星あかり/姿勢~見ろ、私の腕
    params[2][7] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\140\169\130\235\129\65\142\132\130\204\152\114"
    --S.お気に入り/*紲星あかり/姿勢~見て、この包丁
    params[2][8] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\140\169\130\196\129\65\130\177\130\204\149\239\146\154"
    --S.お気に入り/*紲星あかり/姿勢~いただきます
    params[2][9] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\130\162\130\189\130\190\130\171\130\220\130\183"
    --S.お気に入り/*紲星あかり/姿勢~まったく！
    params[2][10] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\130\220\130\193\130\189\130\173\129\73"
    --S.お気に入り/*紲星あかり/姿勢~頭抱え
    params[2][11] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\147\170\149\248\130\166"
    --S.お気に入り/*紲星あかり/姿勢~ドヤー
    params[2][12] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\131\104\131\132\129\91"
    --S.お気に入り/*紲星あかり/姿勢~さぁ？
    params[2][13] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\130\179\130\159\129\72"
    --S.お気に入り/*紲星あかり/姿勢~さぁ？２
    params[2][14] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\130\179\130\159\129\72\130\81"
    --S.お気に入り/*紲星あかり/姿勢~どうだ？
    params[2][15] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\130\199\130\164\130\190\129\72"
    --S.お気に入り/*紲星あかり/姿勢~どうだ？２
    params[2][16] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\130\199\130\164\130\190\129\72\130\81"
    --S.お気に入り/*紲星あかり/姿勢~どうだ？３
    params[2][17] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\130\199\130\164\130\190\129\72\130\82"
    --S.お気に入り/*紲星あかり/姿勢~食事
    params[2][18] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\144\72\142\150"
    --S.お気に入り/*紲星あかり/姿勢~食事２
    params[2][19] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\144\72\142\150\130\81"
    --S.お気に入り/*紲星あかり/姿勢~食事３
    params[2][20] = "S."..controlType.."/*"..fileName.."/\142\112\144\168\126\144\72\142\150\130\82"
  

    --*紲星あかり/表情: ["普通に","ほうー","おはよう","ねーねー","あはは","やった！","だめか…","ぐぬぬ…！","でもでも！","怒るよ！","これしかないか…","ええー","でも…","へへ","ぐへへ","やばい！","むかつく","さぁー？","ほっほー","まずい…","あわわー ","そうなの？","そうなんだ…","げっ！？","はっ！？","はっ！？ 2","なし","自爆"]
    optionsDisplay[3] = {
      "\149\129\146\202\130\201","\130\217\130\164\129\91","\130\168\130\205\130\230\130\164","\130\203\129\91\130\203\129\91","\130\160\130\205\130\205","\130\226\130\193\130\189\129\73","\130\190\130\223\130\169\129\99","\130\174\130\202\130\202\129\99\129\73","\130\197\130\224\130\197\130\224\129\73","\147\123\130\233\130\230\129\73","\130\177\130\234\130\181\130\169\130\200\130\162\130\169\129\99","\130\166\130\166\129\91","\130\197\130\224\129\99","\130\214\130\214","\130\174\130\214\130\214","\130\226\130\206\130\162\129\73","\130\222\130\169\130\194\130\173","\130\179\130\159\129\91\129\72","\130\217\130\193\130\217\129\91","\130\220\130\184\130\162\129\99","\130\160\130\237\130\237\129\91\32","\130\187\130\164\130\200\130\204\129\72","\130\187\130\164\130\200\130\241\130\190\129\99","\130\176\130\193\129\73\129\72","\130\205\130\193\129\73\129\72","\130\205\130\193\129\73\129\72\32\50","\130\200\130\181","\142\169\148\154"
    }
    --常用表互相?接
    paramsDisplay[3] = "\149\92\143\238"
    params[3] = {
      name = paramsDisplay[3],
      display = optionsDisplay[3]
    }
    params[paramsDisplay[3]] = params[3]
    --S.お気に入り/*紲星あかり/表情~普通に
    params[3][1] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\149\129\146\202\130\201"
    --S.お気に入り/*紲星あかり/表情~ほうー
    params[3][2] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\217\130\164\129\91"
    --S.お気に入り/*紲星あかり/表情~おはよう
    params[3][3] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\168\130\205\130\230\130\164"
    --S.お気に入り/*紲星あかり/表情~ねーねー
    params[3][4] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\203\129\91\130\203\129\91"
    --S.お気に入り/*紲星あかり/表情~あはは
    params[3][5] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\160\130\205\130\205"
    --S.お気に入り/*紲星あかり/表情~やった！
    params[3][6] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\226\130\193\130\189\129\73"
    --S.お気に入り/*紲星あかり/表情~だめか…
    params[3][7] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\190\130\223\130\169\129\99"
    --S.お気に入り/*紲星あかり/表情~ぐぬぬ…！
    params[3][8] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\174\130\202\130\202\129\99\129\73"
    --S.お気に入り/*紲星あかり/表情~でもでも！
    params[3][9] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\197\130\224\130\197\130\224\129\73"
    --S.お気に入り/*紲星あかり/表情~怒るよ！
    params[3][10] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\147\123\130\233\130\230\129\73"
    --S.お気に入り/*紲星あかり/表情~これしかないか…
    params[3][11] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\177\130\234\130\181\130\169\130\200\130\162\130\169\129\99"
    --S.お気に入り/*紲星あかり/表情~ええー
    params[3][12] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\166\130\166\129\91"
    --S.お気に入り/*紲星あかり/表情~でも…
    params[3][13] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\197\130\224\129\99"
    --S.お気に入り/*紲星あかり/表情~へへ
    params[3][14] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\214\130\214"
    --S.お気に入り/*紲星あかり/表情~ぐへへ
    params[3][15] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\174\130\214\130\214"
    --S.お気に入り/*紲星あかり/表情~やばい！
    params[3][16] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\226\130\206\130\162\129\73"
    --S.お気に入り/*紲星あかり/表情~むかつく
    params[3][17] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\222\130\169\130\194\130\173"
    --S.お気に入り/*紲星あかり/表情~さぁー？
    params[3][18] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\179\130\159\129\91\129\72"
    --S.お気に入り/*紲星あかり/表情~ほっほー
    params[3][19] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\217\130\193\130\217\129\91"
    --S.お気に入り/*紲星あかり/表情~まずい…
    params[3][20] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\220\130\184\130\162\129\99"
    --S.お気に入り/*紲星あかり/表情~あわわー 
    params[3][21] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\160\130\237\130\237\129\91\32"
    --S.お気に入り/*紲星あかり/表情~そうなの？
    params[3][22] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\187\130\164\130\200\130\204\129\72"
    --S.お気に入り/*紲星あかり/表情~そうなんだ…
    params[3][23] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\187\130\164\130\200\130\241\130\190\129\99"
    --S.お気に入り/*紲星あかり/表情~げっ！？
    params[3][24] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\176\130\193\129\73\129\72"
    --S.お気に入り/*紲星あかり/表情~はっ！？
    params[3][25] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\205\130\193\129\73\129\72"
    --S.お気に入り/*紲星あかり/表情~はっ！？ 2
    params[3][26] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\205\130\193\129\73\129\72\32\50"
    --S.お気に入り/*紲星あかり/表情~なし
    params[3][27] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\130\200\130\181"
    --S.お気に入り/*紲星あかり/表情~自爆
    params[3][28] = "S."..controlType.."/*"..fileName.."/\149\92\143\238\126\142\169\148\154"
  

    --*紲星あかり/顔色: ["通常","(%2fω＼*)1","(%2fω＼*)2","(%2fω＼*)3","冷静1","冷静2","冷静3","緊張1","緊張2","緊張3","緊張6","まずい1","まずい2","まずい3","黒"]
    optionsDisplay[4] = {
      "\146\202\143\237","\40\37\50\102\131\214\129\95\42\41\49","\40\37\50\102\131\214\129\95\42\41\50","\40\37\50\102\131\214\129\95\42\41\51","\151\226\144\195\49","\151\226\144\195\50","\151\226\144\195\51","\139\217\146\163\49","\139\217\146\163\50","\139\217\146\163\51","\139\217\146\163\54","\130\220\130\184\130\162\49","\130\220\130\184\130\162\50","\130\220\130\184\130\162\51","\141\149"
    }
    --常用表互相?接
    paramsDisplay[4] = "\138\231\144\70"
    params[4] = {
      name = paramsDisplay[4],
      display = optionsDisplay[4]
    }
    params[paramsDisplay[4]] = params[4]
    --S.お気に入り/*紲星あかり/顔色~通常
    params[4][1] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\146\202\143\237"
    --S.お気に入り/*紲星あかり/顔色~(%2fω＼*)1
    params[4][2] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\40\37\50\102\131\214\129\95\42\41\49"
    --S.お気に入り/*紲星あかり/顔色~(%2fω＼*)2
    params[4][3] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\40\37\50\102\131\214\129\95\42\41\50"
    --S.お気に入り/*紲星あかり/顔色~(%2fω＼*)3
    params[4][4] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\40\37\50\102\131\214\129\95\42\41\51"
    --S.お気に入り/*紲星あかり/顔色~冷静1
    params[4][5] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\151\226\144\195\49"
    --S.お気に入り/*紲星あかり/顔色~冷静2
    params[4][6] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\151\226\144\195\50"
    --S.お気に入り/*紲星あかり/顔色~冷静3
    params[4][7] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\151\226\144\195\51"
    --S.お気に入り/*紲星あかり/顔色~緊張1
    params[4][8] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\139\217\146\163\49"
    --S.お気に入り/*紲星あかり/顔色~緊張2
    params[4][9] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\139\217\146\163\50"
    --S.お気に入り/*紲星あかり/顔色~緊張3
    params[4][10] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\139\217\146\163\51"
    --S.お気に入り/*紲星あかり/顔色~緊張6
    params[4][11] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\139\217\146\163\54"
    --S.お気に入り/*紲星あかり/顔色~まずい1
    params[4][12] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\130\220\130\184\130\162\49"
    --S.お気に入り/*紲星あかり/顔色~まずい2
    params[4][13] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\130\220\130\184\130\162\50"
    --S.お気に入り/*紲星あかり/顔色~まずい3
    params[4][14] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\130\220\130\184\130\162\51"
    --S.お気に入り/*紲星あかり/顔色~黒
    params[4][15] = "S."..controlType.."/*"..fileName.."/\138\231\144\70\126\141\149"
  

    --*紲星あかり/左腕: ["伸ばし","グッ","グッ2","グッ3","グー","グー2","グー3","グー4","チョキ","パー","パー2","指さし","腰当て","b","さぁ？","いただきます","丼持ち","食事","股抑え","頭抱え","髪結え用"]
    optionsDisplay[5] = {
      "\144\76\130\206\130\181","\131\79\131\98","\131\79\131\98\50","\131\79\131\98\51","\131\79\129\91","\131\79\129\91\50","\131\79\129\91\51","\131\79\129\91\52","\131\96\131\135\131\76","\131\112\129\91","\131\112\129\91\50","\142\119\130\179\130\181","\141\152\147\150\130\196","\98","\130\179\130\159\129\72","\130\162\130\189\130\190\130\171\130\220\130\183","\152\165\142\157\130\191","\144\72\142\150","\140\210\151\125\130\166","\147\170\149\248\130\166","\148\175\140\139\130\166\151\112"
    }
    --常用表互相?接
    paramsDisplay[5] = "\141\182\152\114"
    params[5] = {
      name = paramsDisplay[5],
      display = optionsDisplay[5]
    }
    params[paramsDisplay[5]] = params[5]
    --S.お気に入り/*紲星あかり/左腕~伸ばし
    params[5][1] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\144\76\130\206\130\181"
    --S.お気に入り/*紲星あかり/左腕~グッ
    params[5][2] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\79\131\98"
    --S.お気に入り/*紲星あかり/左腕~グッ2
    params[5][3] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\79\131\98\50"
    --S.お気に入り/*紲星あかり/左腕~グッ3
    params[5][4] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\79\131\98\51"
    --S.お気に入り/*紲星あかり/左腕~グー
    params[5][5] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\79\129\91"
    --S.お気に入り/*紲星あかり/左腕~グー2
    params[5][6] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\79\129\91\50"
    --S.お気に入り/*紲星あかり/左腕~グー3
    params[5][7] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\79\129\91\51"
    --S.お気に入り/*紲星あかり/左腕~グー4
    params[5][8] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\79\129\91\52"
    --S.お気に入り/*紲星あかり/左腕~チョキ
    params[5][9] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\96\131\135\131\76"
    --S.お気に入り/*紲星あかり/左腕~パー
    params[5][10] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\112\129\91"
    --S.お気に入り/*紲星あかり/左腕~パー2
    params[5][11] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\131\112\129\91\50"
    --S.お気に入り/*紲星あかり/左腕~指さし
    params[5][12] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\142\119\130\179\130\181"
    --S.お気に入り/*紲星あかり/左腕~腰当て
    params[5][13] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\141\152\147\150\130\196"
    --S.お気に入り/*紲星あかり/左腕~b
    params[5][14] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\98"
    --S.お気に入り/*紲星あかり/左腕~さぁ？
    params[5][15] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\130\179\130\159\129\72"
    --S.お気に入り/*紲星あかり/左腕~いただきます
    params[5][16] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\130\162\130\189\130\190\130\171\130\220\130\183"
    --S.お気に入り/*紲星あかり/左腕~丼持ち
    params[5][17] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\152\165\142\157\130\191"
    --S.お気に入り/*紲星あかり/左腕~食事
    params[5][18] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\144\72\142\150"
    --S.お気に入り/*紲星あかり/左腕~股抑え
    params[5][19] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\140\210\151\125\130\166"
    --S.お気に入り/*紲星あかり/左腕~頭抱え
    params[5][20] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\147\170\149\248\130\166"
    --S.お気に入り/*紲星あかり/左腕~髪結え用
    params[5][21] = "S."..controlType.."/*"..fileName.."/\141\182\152\114\126\148\175\140\139\130\166\151\112"
  

    --*紲星あかり/右腕: ["伸ばし","グッ","グー","グー2","グー3","チー","パー","パー2","指さし","腰当て","b","さぁ？","いただきます","お箸","食事","胸隠し","顔さし"]
    optionsDisplay[6] = {
      "\144\76\130\206\130\181","\131\79\131\98","\131\79\129\91","\131\79\129\91\50","\131\79\129\91\51","\131\96\129\91","\131\112\129\91","\131\112\129\91\50","\142\119\130\179\130\181","\141\152\147\150\130\196","\98","\130\179\130\159\129\72","\130\162\130\189\130\190\130\171\130\220\130\183","\130\168\148\162","\144\72\142\150","\139\185\137\66\130\181","\138\231\130\179\130\181"
    }
    --常用表互相?接
    paramsDisplay[6] = "\137\69\152\114"
    params[6] = {
      name = paramsDisplay[6],
      display = optionsDisplay[6]
    }
    params[paramsDisplay[6]] = params[6]
    --S.お気に入り/*紲星あかり/右腕~伸ばし
    params[6][1] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\144\76\130\206\130\181"
    --S.お気に入り/*紲星あかり/右腕~グッ
    params[6][2] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\131\79\131\98"
    --S.お気に入り/*紲星あかり/右腕~グー
    params[6][3] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\131\79\129\91"
    --S.お気に入り/*紲星あかり/右腕~グー2
    params[6][4] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\131\79\129\91\50"
    --S.お気に入り/*紲星あかり/右腕~グー3
    params[6][5] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\131\79\129\91\51"
    --S.お気に入り/*紲星あかり/右腕~チー
    params[6][6] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\131\96\129\91"
    --S.お気に入り/*紲星あかり/右腕~パー
    params[6][7] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\131\112\129\91"
    --S.お気に入り/*紲星あかり/右腕~パー2
    params[6][8] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\131\112\129\91\50"
    --S.お気に入り/*紲星あかり/右腕~指さし
    params[6][9] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\142\119\130\179\130\181"
    --S.お気に入り/*紲星あかり/右腕~腰当て
    params[6][10] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\141\152\147\150\130\196"
    --S.お気に入り/*紲星あかり/右腕~b
    params[6][11] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\98"
    --S.お気に入り/*紲星あかり/右腕~さぁ？
    params[6][12] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\130\179\130\159\129\72"
    --S.お気に入り/*紲星あかり/右腕~いただきます
    params[6][13] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\130\162\130\189\130\190\130\171\130\220\130\183"
    --S.お気に入り/*紲星あかり/右腕~お箸
    params[6][14] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\130\168\148\162"
    --S.お気に入り/*紲星あかり/右腕~食事
    params[6][15] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\144\72\142\150"
    --S.お気に入り/*紲星あかり/右腕~胸隠し
    params[6][16] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\139\185\137\66\130\181"
    --S.お気に入り/*紲星あかり/右腕~顔さし
    params[6][17] = "S."..controlType.."/*"..fileName.."/\137\69\152\114\126\138\231\130\179\130\181"
  

    --*紲星あかり/眉: ["通常01","通常02","通常03","怒01","怒02","哀01","哀02","困01","困02","困03"]
    optionsDisplay[7] = {
      "\146\202\143\237\48\49","\146\202\143\237\48\50","\146\202\143\237\48\51","\147\123\48\49","\147\123\48\50","\136\163\48\49","\136\163\48\50","\141\162\48\49","\141\162\48\50","\141\162\48\51"
    }
    --常用表互相?接
    paramsDisplay[7] = "\148\251"
    params[7] = {
      name = paramsDisplay[7],
      display = optionsDisplay[7]
    }
    params[paramsDisplay[7]] = params[7]
    --S.お気に入り/*紲星あかり/眉~通常01
    params[7][1] = "S."..controlType.."/*"..fileName.."/\148\251\126\146\202\143\237\48\49"
    --S.お気に入り/*紲星あかり/眉~通常02
    params[7][2] = "S."..controlType.."/*"..fileName.."/\148\251\126\146\202\143\237\48\50"
    --S.お気に入り/*紲星あかり/眉~通常03
    params[7][3] = "S."..controlType.."/*"..fileName.."/\148\251\126\146\202\143\237\48\51"
    --S.お気に入り/*紲星あかり/眉~怒01
    params[7][4] = "S."..controlType.."/*"..fileName.."/\148\251\126\147\123\48\49"
    --S.お気に入り/*紲星あかり/眉~怒02
    params[7][5] = "S."..controlType.."/*"..fileName.."/\148\251\126\147\123\48\50"
    --S.お気に入り/*紲星あかり/眉~哀01
    params[7][6] = "S."..controlType.."/*"..fileName.."/\148\251\126\136\163\48\49"
    --S.お気に入り/*紲星あかり/眉~哀02
    params[7][7] = "S."..controlType.."/*"..fileName.."/\148\251\126\136\163\48\50"
    --S.お気に入り/*紲星あかり/眉~困01
    params[7][8] = "S."..controlType.."/*"..fileName.."/\148\251\126\141\162\48\49"
    --S.お気に入り/*紲星あかり/眉~困02
    params[7][9] = "S."..controlType.."/*"..fileName.."/\148\251\126\141\162\48\50"
    --S.お気に入り/*紲星あかり/眉~困03
    params[7][10] = "S."..controlType.."/*"..fileName.."/\148\251\126\141\162\48\51"
  

    --*紲星あかり/目: ["通常01","通常02","通常03","通常04","通常05","ウインク01","ウインク02","通常やや閉じ","通常02やや閉じ","通常03やや閉じ","通常閉じかけ","通常02閉じかけ","通常03閉じかけ","閉じ01","閉じ02","ーー","ーー泣き","＞＜","ＴＴ","三白眼","三白眼02","三白眼03","白目01","白目02","白目03","白目04","白目05","白目06","白目07","レイプ目01","レイプ目02","レイプ目03","レイプ目04","レイプ目05","ぐるぐる","ギャグ","ゲス顔"]
    optionsDisplay[8] = {
      "\146\202\143\237\48\49","\146\202\143\237\48\50","\146\202\143\237\48\51","\146\202\143\237\48\52","\146\202\143\237\48\53","\131\69\131\67\131\147\131\78\48\49","\131\69\131\67\131\147\131\78\48\50","\146\202\143\237\130\226\130\226\149\194\130\182","\146\202\143\237\48\50\130\226\130\226\149\194\130\182","\146\202\143\237\48\51\130\226\130\226\149\194\130\182","\146\202\143\237\149\194\130\182\130\169\130\175","\146\202\143\237\48\50\149\194\130\182\130\169\130\175","\146\202\143\237\48\51\149\194\130\182\130\169\130\175","\149\194\130\182\48\49","\149\194\130\182\48\50","\129\91\129\91","\129\91\129\91\139\131\130\171","\129\132\129\131","\130\115\130\115","\142\79\148\146\138\225","\142\79\148\146\138\225\48\50","\142\79\148\146\138\225\48\51","\148\146\150\218\48\49","\148\146\150\218\48\50","\148\146\150\218\48\51","\148\146\150\218\48\52","\148\146\150\218\48\53","\148\146\150\218\48\54","\148\146\150\218\48\55","\131\140\131\67\131\118\150\218\48\49","\131\140\131\67\131\118\150\218\48\50","\131\140\131\67\131\118\150\218\48\51","\131\140\131\67\131\118\150\218\48\52","\131\140\131\67\131\118\150\218\48\53","\130\174\130\233\130\174\130\233","\131\77\131\131\131\79","\131\81\131\88\138\231"
    }
    --常用表互相?接
    paramsDisplay[8] = "\150\218"
    params[8] = {
      name = paramsDisplay[8],
      display = optionsDisplay[8]
    }
    params[paramsDisplay[8]] = params[8]
    --S.お気に入り/*紲星あかり/目~通常01
    params[8][1] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\48\49"
    --S.お気に入り/*紲星あかり/目~通常02
    params[8][2] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\48\50"
    --S.お気に入り/*紲星あかり/目~通常03
    params[8][3] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\48\51"
    --S.お気に入り/*紲星あかり/目~通常04
    params[8][4] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\48\52"
    --S.お気に入り/*紲星あかり/目~通常05
    params[8][5] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\48\53"
    --S.お気に入り/*紲星あかり/目~ウインク01
    params[8][6] = "S."..controlType.."/*"..fileName.."/\150\218\126\131\69\131\67\131\147\131\78\48\49"
    --S.お気に入り/*紲星あかり/目~ウインク02
    params[8][7] = "S."..controlType.."/*"..fileName.."/\150\218\126\131\69\131\67\131\147\131\78\48\50"
    --S.お気に入り/*紲星あかり/目~通常やや閉じ
    params[8][8] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\130\226\130\226\149\194\130\182"
    --S.お気に入り/*紲星あかり/目~通常02やや閉じ
    params[8][9] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\48\50\130\226\130\226\149\194\130\182"
    --S.お気に入り/*紲星あかり/目~通常03やや閉じ
    params[8][10] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\48\51\130\226\130\226\149\194\130\182"
    --S.お気に入り/*紲星あかり/目~通常閉じかけ
    params[8][11] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\149\194\130\182\130\169\130\175"
    --S.お気に入り/*紲星あかり/目~通常02閉じかけ
    params[8][12] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\48\50\149\194\130\182\130\169\130\175"
    --S.お気に入り/*紲星あかり/目~通常03閉じかけ
    params[8][13] = "S."..controlType.."/*"..fileName.."/\150\218\126\146\202\143\237\48\51\149\194\130\182\130\169\130\175"
    --S.お気に入り/*紲星あかり/目~閉じ01
    params[8][14] = "S."..controlType.."/*"..fileName.."/\150\218\126\149\194\130\182\48\49"
    --S.お気に入り/*紲星あかり/目~閉じ02
    params[8][15] = "S."..controlType.."/*"..fileName.."/\150\218\126\149\194\130\182\48\50"
    --S.お気に入り/*紲星あかり/目~ーー
    params[8][16] = "S."..controlType.."/*"..fileName.."/\150\218\126\129\91\129\91"
    --S.お気に入り/*紲星あかり/目~ーー泣き
    params[8][17] = "S."..controlType.."/*"..fileName.."/\150\218\126\129\91\129\91\139\131\130\171"
    --S.お気に入り/*紲星あかり/目~＞＜
    params[8][18] = "S."..controlType.."/*"..fileName.."/\150\218\126\129\132\129\131"
    --S.お気に入り/*紲星あかり/目~ＴＴ
    params[8][19] = "S."..controlType.."/*"..fileName.."/\150\218\126\130\115\130\115"
    --S.お気に入り/*紲星あかり/目~三白眼
    params[8][20] = "S."..controlType.."/*"..fileName.."/\150\218\126\142\79\148\146\138\225"
    --S.お気に入り/*紲星あかり/目~三白眼02
    params[8][21] = "S."..controlType.."/*"..fileName.."/\150\218\126\142\79\148\146\138\225\48\50"
    --S.お気に入り/*紲星あかり/目~三白眼03
    params[8][22] = "S."..controlType.."/*"..fileName.."/\150\218\126\142\79\148\146\138\225\48\51"
    --S.お気に入り/*紲星あかり/目~白目01
    params[8][23] = "S."..controlType.."/*"..fileName.."/\150\218\126\148\146\150\218\48\49"
    --S.お気に入り/*紲星あかり/目~白目02
    params[8][24] = "S."..controlType.."/*"..fileName.."/\150\218\126\148\146\150\218\48\50"
    --S.お気に入り/*紲星あかり/目~白目03
    params[8][25] = "S."..controlType.."/*"..fileName.."/\150\218\126\148\146\150\218\48\51"
    --S.お気に入り/*紲星あかり/目~白目04
    params[8][26] = "S."..controlType.."/*"..fileName.."/\150\218\126\148\146\150\218\48\52"
    --S.お気に入り/*紲星あかり/目~白目05
    params[8][27] = "S."..controlType.."/*"..fileName.."/\150\218\126\148\146\150\218\48\53"
    --S.お気に入り/*紲星あかり/目~白目06
    params[8][28] = "S."..controlType.."/*"..fileName.."/\150\218\126\148\146\150\218\48\54"
    --S.お気に入り/*紲星あかり/目~白目07
    params[8][29] = "S."..controlType.."/*"..fileName.."/\150\218\126\148\146\150\218\48\55"
    --S.お気に入り/*紲星あかり/目~レイプ目01
    params[8][30] = "S."..controlType.."/*"..fileName.."/\150\218\126\131\140\131\67\131\118\150\218\48\49"
    --S.お気に入り/*紲星あかり/目~レイプ目02
    params[8][31] = "S."..controlType.."/*"..fileName.."/\150\218\126\131\140\131\67\131\118\150\218\48\50"
    --S.お気に入り/*紲星あかり/目~レイプ目03
    params[8][32] = "S."..controlType.."/*"..fileName.."/\150\218\126\131\140\131\67\131\118\150\218\48\51"
    --S.お気に入り/*紲星あかり/目~レイプ目04
    params[8][33] = "S."..controlType.."/*"..fileName.."/\150\218\126\131\140\131\67\131\118\150\218\48\52"
    --S.お気に入り/*紲星あかり/目~レイプ目05
    params[8][34] = "S."..controlType.."/*"..fileName.."/\150\218\126\131\140\131\67\131\118\150\218\48\53"
    --S.お気に入り/*紲星あかり/目~ぐるぐる
    params[8][35] = "S."..controlType.."/*"..fileName.."/\150\218\126\130\174\130\233\130\174\130\233"
    --S.お気に入り/*紲星あかり/目~ギャグ
    params[8][36] = "S."..controlType.."/*"..fileName.."/\150\218\126\131\77\131\131\131\79"
    --S.お気に入り/*紲星あかり/目~ゲス顔
    params[8][37] = "S."..controlType.."/*"..fileName.."/\150\218\126\131\81\131\88\138\231"
  

    --*紲星あかり/口: ["開き01","開き02","開き03","閉じ01","閉じ02","閉じ03","にしし01","にしし02","にしし03","くっ","口小","口中","あわわ","かぱー","わなわな","にへら","栗","くわっ","ぐぬぬ","3","ぴゅー","ぶえっくしゅ","ω","にゃーんｊ","むすー","ベー","テヘペロ","もぐもぐ01","もぐもぐ02","よだれ01","よだれ02","嘔吐","ゴムくわえ"]
    optionsDisplay[9] = {
      "\138\74\130\171\48\49","\138\74\130\171\48\50","\138\74\130\171\48\51","\149\194\130\182\48\49","\149\194\130\182\48\50","\149\194\130\182\48\51","\130\201\130\181\130\181\48\49","\130\201\130\181\130\181\48\50","\130\201\130\181\130\181\48\51","\130\173\130\193","\140\251\143\172","\140\251\146\134","\130\160\130\237\130\237","\130\169\130\207\129\91","\130\237\130\200\130\237\130\200","\130\201\130\214\130\231","\140\73","\130\173\130\237\130\193","\130\174\130\202\130\202","\51","\130\210\130\227\129\91","\130\212\130\166\130\193\130\173\130\181\130\227","\131\214","\130\201\130\225\129\91\130\241\130\138","\130\222\130\183\129\91","\131\120\129\91","\131\101\131\119\131\121\131\141","\130\224\130\174\130\224\130\174\48\49","\130\224\130\174\130\224\130\174\48\50","\130\230\130\190\130\234\48\49","\130\230\130\190\130\234\48\50","\154\113\147\102","\131\83\131\128\130\173\130\237\130\166"
    }
    --常用表互相?接
    paramsDisplay[9] = "\140\251"
    params[9] = {
      name = paramsDisplay[9],
      display = optionsDisplay[9]
    }
    params[paramsDisplay[9]] = params[9]
    --S.お気に入り/*紲星あかり/口~開き01
    params[9][1] = "S."..controlType.."/*"..fileName.."/\140\251\126\138\74\130\171\48\49"
    --S.お気に入り/*紲星あかり/口~開き02
    params[9][2] = "S."..controlType.."/*"..fileName.."/\140\251\126\138\74\130\171\48\50"
    --S.お気に入り/*紲星あかり/口~開き03
    params[9][3] = "S."..controlType.."/*"..fileName.."/\140\251\126\138\74\130\171\48\51"
    --S.お気に入り/*紲星あかり/口~閉じ01
    params[9][4] = "S."..controlType.."/*"..fileName.."/\140\251\126\149\194\130\182\48\49"
    --S.お気に入り/*紲星あかり/口~閉じ02
    params[9][5] = "S."..controlType.."/*"..fileName.."/\140\251\126\149\194\130\182\48\50"
    --S.お気に入り/*紲星あかり/口~閉じ03
    params[9][6] = "S."..controlType.."/*"..fileName.."/\140\251\126\149\194\130\182\48\51"
    --S.お気に入り/*紲星あかり/口~にしし01
    params[9][7] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\201\130\181\130\181\48\49"
    --S.お気に入り/*紲星あかり/口~にしし02
    params[9][8] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\201\130\181\130\181\48\50"
    --S.お気に入り/*紲星あかり/口~にしし03
    params[9][9] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\201\130\181\130\181\48\51"
    --S.お気に入り/*紲星あかり/口~くっ
    params[9][10] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\173\130\193"
    --S.お気に入り/*紲星あかり/口~口小
    params[9][11] = "S."..controlType.."/*"..fileName.."/\140\251\126\140\251\143\172"
    --S.お気に入り/*紲星あかり/口~口中
    params[9][12] = "S."..controlType.."/*"..fileName.."/\140\251\126\140\251\146\134"
    --S.お気に入り/*紲星あかり/口~あわわ
    params[9][13] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\160\130\237\130\237"
    --S.お気に入り/*紲星あかり/口~かぱー
    params[9][14] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\169\130\207\129\91"
    --S.お気に入り/*紲星あかり/口~わなわな
    params[9][15] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\237\130\200\130\237\130\200"
    --S.お気に入り/*紲星あかり/口~にへら
    params[9][16] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\201\130\214\130\231"
    --S.お気に入り/*紲星あかり/口~栗
    params[9][17] = "S."..controlType.."/*"..fileName.."/\140\251\126\140\73"
    --S.お気に入り/*紲星あかり/口~くわっ
    params[9][18] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\173\130\237\130\193"
    --S.お気に入り/*紲星あかり/口~ぐぬぬ
    params[9][19] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\174\130\202\130\202"
    --S.お気に入り/*紲星あかり/口~3
    params[9][20] = "S."..controlType.."/*"..fileName.."/\140\251\126\51"
    --S.お気に入り/*紲星あかり/口~ぴゅー
    params[9][21] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\210\130\227\129\91"
    --S.お気に入り/*紲星あかり/口~ぶえっくしゅ
    params[9][22] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\212\130\166\130\193\130\173\130\181\130\227"
    --S.お気に入り/*紲星あかり/口~ω
    params[9][23] = "S."..controlType.."/*"..fileName.."/\140\251\126\131\214"
    --S.お気に入り/*紲星あかり/口~にゃーんｊ
    params[9][24] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\201\130\225\129\91\130\241\130\138"
    --S.お気に入り/*紲星あかり/口~むすー
    params[9][25] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\222\130\183\129\91"
    --S.お気に入り/*紲星あかり/口~ベー
    params[9][26] = "S."..controlType.."/*"..fileName.."/\140\251\126\131\120\129\91"
    --S.お気に入り/*紲星あかり/口~テヘペロ
    params[9][27] = "S."..controlType.."/*"..fileName.."/\140\251\126\131\101\131\119\131\121\131\141"
    --S.お気に入り/*紲星あかり/口~もぐもぐ01
    params[9][28] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\224\130\174\130\224\130\174\48\49"
    --S.お気に入り/*紲星あかり/口~もぐもぐ02
    params[9][29] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\224\130\174\130\224\130\174\48\50"
    --S.お気に入り/*紲星あかり/口~よだれ01
    params[9][30] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\230\130\190\130\234\48\49"
    --S.お気に入り/*紲星あかり/口~よだれ02
    params[9][31] = "S."..controlType.."/*"..fileName.."/\140\251\126\130\230\130\190\130\234\48\50"
    --S.お気に入り/*紲星あかり/口~嘔吐
    params[9][32] = "S."..controlType.."/*"..fileName.."/\140\251\126\154\113\147\102"
    --S.お気に入り/*紲星あかり/口~ゴムくわえ
    params[9][33] = "S."..controlType.."/*"..fileName.."/\140\251\126\131\83\131\128\130\173\130\237\130\166"
  

    --*紲星あかり/頭飾り: ["なし","通常","通常逆","ヘッドンホホ"]
    optionsDisplay[10] = {
      "\130\200\130\181","\146\202\143\237","\146\202\143\237\139\116","\131\119\131\98\131\104\131\147\131\122\131\122"
    }
    --常用表互相?接
    paramsDisplay[10] = "\147\170\143\252\130\232"
    params[10] = {
      name = paramsDisplay[10],
      display = optionsDisplay[10]
    }
    params[paramsDisplay[10]] = params[10]
    --S.お気に入り/*紲星あかり/頭飾り~なし
    params[10][1] = "S."..controlType.."/*"..fileName.."/\147\170\143\252\130\232\126\130\200\130\181"
    --S.お気に入り/*紲星あかり/頭飾り~通常
    params[10][2] = "S."..controlType.."/*"..fileName.."/\147\170\143\252\130\232\126\146\202\143\237"
    --S.お気に入り/*紲星あかり/頭飾り~通常逆
    params[10][3] = "S."..controlType.."/*"..fileName.."/\147\170\143\252\130\232\126\146\202\143\237\139\116"
    --S.お気に入り/*紲星あかり/頭飾り~ヘッドンホホ
    params[10][4] = "S."..controlType.."/*"..fileName.."/\147\170\143\252\130\232\126\131\119\131\98\131\104\131\147\131\122\131\122"
  

    --*紲星あかり/マイク: ["なし","通常","通常逆"]
    optionsDisplay[11] = {
      "\130\200\130\181","\146\202\143\237","\146\202\143\237\139\116"
    }
    --常用表互相?接
    paramsDisplay[11] = "\131\125\131\67\131\78"
    params[11] = {
      name = paramsDisplay[11],
      display = optionsDisplay[11]
    }
    params[paramsDisplay[11]] = params[11]
    --S.お気に入り/*紲星あかり/マイク~なし
    params[11][1] = "S."..controlType.."/*"..fileName.."/\131\125\131\67\131\78\126\130\200\130\181"
    --S.お気に入り/*紲星あかり/マイク~通常
    params[11][2] = "S."..controlType.."/*"..fileName.."/\131\125\131\67\131\78\126\146\202\143\237"
    --S.お気に入り/*紲星あかり/マイク~通常逆
    params[11][3] = "S."..controlType.."/*"..fileName.."/\131\125\131\67\131\78\126\146\202\143\237\139\116"
  

    --*紲星あかり/@効果: ["涙","湯気","食事","キラーン","怒マーク","吐息","ため息","汗","縦線"]
    optionsDisplay[12] = {
      "\151\220","\147\146\139\67","\144\72\142\150","\131\76\131\137\129\91\131\147","\147\123\131\125\129\91\131\78","\147\102\145\167","\130\189\130\223\145\167","\138\190","\143\99\144\252"
    }
    --常用表互相?接
    paramsDisplay[12] = "\64\140\248\137\202"
    params[12] = {
      name = paramsDisplay[12],
      display = optionsDisplay[12]
    }
    params[paramsDisplay[12]] = params[12]
    --S.お気に入り/*紲星あかり/@効果~涙
    params[12][1] = "S."..controlType.."/*"..fileName.."/\64\140\248\137\202\126\151\220"
    --S.お気に入り/*紲星あかり/@効果~湯気
    params[12][2] = "S."..controlType.."/*"..fileName.."/\64\140\248\137\202\126\147\146\139\67"
    --S.お気に入り/*紲星あかり/@効果~食事
    params[12][3] = "S."..controlType.."/*"..fileName.."/\64\140\248\137\202\126\144\72\142\150"
    --S.お気に入り/*紲星あかり/@効果~キラーン
    params[12][4] = "S."..controlType.."/*"..fileName.."/\64\140\248\137\202\126\131\76\131\137\129\91\131\147"
    --S.お気に入り/*紲星あかり/@効果~怒マーク
    params[12][5] = "S."..controlType.."/*"..fileName.."/\64\140\248\137\202\126\147\123\131\125\129\91\131\78"
    --S.お気に入り/*紲星あかり/@効果~吐息
    params[12][6] = "S."..controlType.."/*"..fileName.."/\64\140\248\137\202\126\147\102\145\167"
    --S.お気に入り/*紲星あかり/@効果~ため息
    params[12][7] = "S."..controlType.."/*"..fileName.."/\64\140\248\137\202\126\130\189\130\223\145\167"
    --S.お気に入り/*紲星あかり/@効果~汗
    params[12][8] = "S."..controlType.."/*"..fileName.."/\64\140\248\137\202\126\138\190"
    --S.お気に入り/*紲星あかり/@効果~縦線
    params[12][9] = "S."..controlType.."/*"..fileName.."/\64\140\248\137\202\126\143\99\144\252"
  
    params.keys = paramsDisplay
    params.display = optionsDisplay
    function params.get(key, value)
      local param = params[key]
      if value and value ~= nil then
        return param[value], param.display[value]
      end
      return param, param.name
    end
    return params
  