@echo off
REM echo exec path: %cd%\\.bin
set Plua=%cd%\\.bin\\wxluafreeze.lua
set Pexe=%cd%\\.bin\\wxluafreeze.exe
set Out=%2%
for /f "delims=" %%i in ("%Out%") do (
  set Out=%%~dpi
)
REM FOR /F "delims==" %%i IN (%Out%) DO @echo    %%~fi
if not exist %Out% ( mkdir %Out% )
REM echo outpath: %Out%

lua "%Plua%" "%Pexe%" "%1" "%2"