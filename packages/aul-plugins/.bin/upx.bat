@echo off
REM echo exec path: %cd%\\.bin
set Upx=%cd%\\.bin\\upx-3.95-win64\upx.exe

upx "%Upx%" %1% --overlay=copy