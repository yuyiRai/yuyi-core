-- IupSubmenu Example in IupLua 
-- Creates a dialog with a menu with three submenus. One of the submenus has a submenu, which has another submenu. 
local iup = require( "iuplua" )
require( "iupluacontrols" )

-- Creates a text, sets its value and turns on text readonly mode 
local text = iup.text {value = "This text is here only to compose", expand = "YES"}

-- Creates items of menu file
local item_new = iup.item {title = "New"}
local item_open = iup.item {title = "Open"}
local item_close = iup.item {title = "Close"}
local item_exit = iup.item {title = "Exit"}

-- Creates items of menu edit
local item_copy = iup.item {title = "Copy"}
local item_paste = iup.item {title = "Paste"}

-- Creates items for menu triangle
local item_equilateral = iup.item {title = "Equilateral"}
local item_isoceles = iup.item {title = "Isoceles"}
local item_scalenus = iup.item {title = "Scalenus"}

-- Creates menu triangle
local menu_triangle = iup.menu {item_equilateral, item_isoceles, item_scalenus}

-- Creates submenu triangle
local submenu_triangle = iup.submenu {menu_triangle; title = "Triangle"}

-- Creates items of menu create
local item_line = iup.item {title = "Line"}
local item_circle = iup.item {title = "Circle"}

-- Creates menu create
local menu_create = iup.menu {item_line, item_circle, submenu_triangle}

-- Creates submenu create
local submenu_create = iup.submenu {menu_create; title = "创建"}

-- Creates items of menu help
local item_help = iup.item {title = "帮助"}

-- Creates menus of the main menu
local menu_file = iup.menu {item_new, item_open, item_close, iup.separator{}, item_exit }
local menu_edit = iup.menu {item_copy, item_paste, iup.separator{}, submenu_create}
local menu_help = iup.menu {item_help}

-- Creates submenus of the main menu
local submenu_file = iup.submenu {menu_file; title = "File"}
local submenu_edit = iup.submenu {menu_edit; title = "Edit"}
local submenu_help = iup.submenu {menu_help; title = "Help"}

-- Creates main menu with file submenu
local menu = iup.menu {submenu_file, submenu_edit, submenu_help}

-- Creates dialog with a text, sets its title and associates a menu to it
local dlg = iup.dialog {text; 
  title="IupSubmenu Example",
  OPACITY = 255, -- 0-255
  RESIZE = "NO",
  menu = menu,
  size = "700x320"
}
-- Shows dialog in the center of the screen

function item_help:action ()
  iup.Message ("Warning", "Only Help and Exit items performs an operation")
  return iup.DEFAULT
end
function item_exit:action ()
  return iup.CLOSE
end
local tmp = {
  file = '**'
}
-- 定义显示回调
function dlg:show_cb()
  -- local colordlg = iup.colorbrowser{}
  -- iup.Popup(colordlg, iup.CENTER, iup.CENTER)
  res, inf, outf = iup.GetParam("Title", nil, [[
      Input File %f[SAVE,,,]
      Output File %f[SAVE,,,]
    ]], "*", "*")
      
    if res ~= 0 and inf ~= nil and outf ~= nil then	
      iup.Message("Files", inf .. outf)
    end

  -- print("onShow")
end

function text:dropfiles_cb(filepath, num, x, y)
  -- print(filepath, iup.IGNORE)
  tmp.file = filepath
  return iup.IUP_IGNORE
end

local function showDialog()
  dlg:show()
  -- local MessageBox = require("MessageBox")
  -- MessageBox.alarm("test")
  if (iup.MainLoopLevel()==0) then
    iup.MainLoop()
  end
end

_G["Frame"] = showDialog
package.loaded["Frame"] = showDialog
return showDialog