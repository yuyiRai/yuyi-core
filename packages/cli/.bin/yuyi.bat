@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe" --max_old_space_size=2096 "%~dp0\..\react-scripts\bin\react-scripts.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  --max_old_space_size=2096 -r "%~dp0\..\@yuyi\cli\config\run-ts.js" %*
)