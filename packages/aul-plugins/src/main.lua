local wx = require "wx"
require("YuyiCore")

Frame = wx.wxFrame(wx.NULL, wx.wxID_ANY, "wxLua Minimal Demo",
                   wx.wxDefaultPosition, wx.wxSize(450, 450),
                   wx.wxDEFAULT_FRAME_STYLE)


-- create a simple file menu
local fileMenu = wx.wxMenu()
fileMenu:Append(wx.wxID_EXIT, "E&xit", "Quit the program")
-- create a simple help menu
local helpMenu = wx.wxMenu()
helpMenu:Append(wx.wxID_ABOUT, "&About",
                "About the wxLua Minimal Application")

-- create a menu bar and append the file and help menus
local menuBar = wx.wxMenuBar()
menuBar:Append(fileMenu, "&File")
menuBar:Append(helpMenu, "&Help")
-- attach the menu bar into the frame
Frame:SetMenuBar(menuBar)

-- create a simple status bar
Frame:CreateStatusBar(1)
Frame:SetStatusText("Welcome to wxLua.")

-- connect the selection event of the exit menu item to an
-- event handler that closes the window
Frame:Connect(wx.wxID_EXIT, wx.wxEVT_COMMAND_MENU_SELECTED,
              function (event) Frame:Close(true) end )
-- connect the selection event of the about menu item
Frame:Connect(wx.wxID_ABOUT, wx.wxEVT_COMMAND_MENU_SELECTED,
        function (event)
            wx.wxMessageBox('This is the "About" dialog of the Minimal wxLua sample.',
                            "About wxLua",
                            wx.wxOK + wx.wxICON_INFORMATION,
                            Frame)
        end )

-- finally, show the frame window
-- local html = wx.wxLuaHtmlWindow(Frame, 999, wx.wxDefaultPosition, wx.wxDefaultSize, wx.wxLC_REPORT + wx.wxLC_SINGLE_SEL + wx.wxLC_HRULES + wx.wxLC_VRULES, "htmlWindow")
-- print(wx.wxWebView(Frame))
-- print(string.len("你好啊!"))
-- Create a URL drop target, this has nothing to do with the HTML win, just a demo.
-- local urlDropTarget = wx.wxLuaURLDropTarget()
-- urlDropTarget.OnData = function(self, x, y, def)
--     print("URL OnData ", x, y, def)
--     return self:_OnData(x, y, def)
-- end
-- urlDropTarget.OnDropURL = function(self, x, y, text)
--     print("URL OnDropURL ", x, y, text)
--     return true
-- end
-- if #arg > 0 then
--   print(arg[1])
-- end
-- html:SetDropTarget(urlDropTarget)
-- html:LoadPage("https://blog.codingnow.com/2013/01/binding_c_object_for_lua.html")
-- html:GetOpenedPage()

Frame:Show(true)
wx.wxGetApp():MainLoop()
