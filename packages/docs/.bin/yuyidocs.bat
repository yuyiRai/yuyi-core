@echo off

set rootpath= %1/node_modules
set allparam=

:param
set str=%2
if "%str%"=="" (
    goto end
)
set allparam=%allparam% %str%
shift /0
goto param

:end
if "%allparam%"=="" (
    goto eof
)

rem remove left right blank
:intercept_left
if "%allparam:~0,1%"==" " set "allparam=%allparam:~1%"&goto intercept_left

:intercept_right
if "%allparam:~-1%"==" " set "allparam=%allparam:~0,-1%"&goto intercept_right

:eof
node --max_old_space_size=2096 -r %rootpath%/@yuyi/env/config/run-ts.js %rootpath%/@yuyi/docs/main.ts %allparam%

pause