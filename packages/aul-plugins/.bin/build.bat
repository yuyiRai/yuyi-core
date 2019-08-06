@echo off
set Plua=%cd%\\.bin\\wxluafreeze.lua
set Pexe=%cd%\\.bin\\wxluafreeze.exe
set Out=%2%
for /f "delims=" %%i in ("%Out%") do (
  set Out=%%~dpi
)
if not exist %Out% ( mkdir %Out% )

glue "C:\Program Files (x86)\LuaDist\bin\wsrlua.exe" "%1" "%2"