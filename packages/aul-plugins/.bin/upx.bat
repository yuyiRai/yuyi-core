@echo off
REM echo exec path: %cd%\\.bin
set exec_p=%cd%\\.bin\\upx-3.95-win64\\upx.exe
set outPath=%cd%\%2%
if exist %outPath% (
  del %outPath%
)
set exec=%exec_p% --best -o %2 %1 --keep-resource=build/YuyiCore.lua
echo %exec%
%exec%
