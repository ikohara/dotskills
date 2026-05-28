@echo off
setlocal enabledelayedexpansion

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

if "%~1"=="" (
    call :usage
    exit /b 1
)

rem Validate every target before doing anything.
for %%T in (%*) do (
    call :resolve_dest "%%~T"
    if not defined DEST (
        echo [err] Unknown target: %%~T
        call :usage
        exit /b 1
    )
)

set "EXIT_CODE=0"
for %%T in (%*) do (
    call :link_target "%%~T"
    if errorlevel 1 set "EXIT_CODE=1"
)
exit /b !EXIT_CODE!

:resolve_dest
set "DEST="
if /i "%~1"=="agents" set "DEST=%USERPROFILE%\.agents\skills"
if /i "%~1"=="claude" set "DEST=%USERPROFILE%\.claude\skills"
if /i "%~1"=="kilo"   set "DEST=%USERPROFILE%\.kilo\skills"
goto :eof

:link_target
call :resolve_dest "%~1"
if not exist "!DEST!" mkdir "!DEST!"
echo === %~1 -^> !DEST! ===
set "found="
set "target_failed=0"
for /d %%S in ("%ROOT%\skills\*") do (
    set "found=1"
    set "link=!DEST!\%%~nxS"
    if exist "!link!" (
        echo [skip] %%~nxS ^(already exists^)
    ) else (
        mklink /J "!link!" "%%~fS" >nul 2>&1
        if errorlevel 1 (
            echo [fail] %%~nxS
            set "target_failed=1"
        ) else (
            echo [ok]   %%~nxS
        )
    )
)
if not defined found echo [warn] No skills found in %ROOT%\skills\
exit /b !target_failed!

:usage
echo Usage: link-user.bat ^<target^> [^<target^> ...]
echo.
echo Link every skill in .\skills\ into the target tool's user-level skills
echo directory via junction.
echo.
echo Targets:
echo     agents   %%USERPROFILE%%\.agents\skills\   (Codex, etc.)
echo     claude   %%USERPROFILE%%\.claude\skills\   (Claude)
echo     kilo     %%USERPROFILE%%\.kilo\skills\     (Kilo)
goto :eof
