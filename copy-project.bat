@echo off
setlocal enabledelayedexpansion

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

set "FORCE=0"
if /i "%~1"=="--force" (
    set "FORCE=1"
    shift
)

if "%~1"=="" (
    call :usage
    exit /b 1
)
if "%~2"=="" (
    call :usage
    exit /b 1
)

set "TARGET=%~1"
set "PROJECT=%~2"
shift
shift

call :resolve_subdir "%TARGET%"
if not defined SUBDIR (
    echo [err] Unknown target: %TARGET%
    echo.
    call :usage
    exit /b 1
)

if not exist "%PROJECT%\" (
    echo [err] Project path not found: %PROJECT%
    exit /b 1
)

rem Build the skill list. If %1 is set, treat remaining args as filters.
set "SKILLS="
if not "%~1"=="" goto :collect_filters
for /d %%S in ("%ROOT%\skills\*") do (
    if defined SKILLS (set "SKILLS=!SKILLS!;%%~fS") else (set "SKILLS=%%~fS")
)
goto :filters_done

:collect_filters
if "%~1"=="" goto :filters_done
if not exist "%ROOT%\skills\%~1\" (
    echo [err] Unknown skill: %~1
    exit /b 1
)
if defined SKILLS (set "SKILLS=!SKILLS!;%ROOT%\skills\%~1") else (set "SKILLS=%ROOT%\skills\%~1")
shift
goto :collect_filters

:filters_done

set "DEST=%PROJECT%\%SUBDIR%"
if not exist "%DEST%" mkdir "%DEST%"
echo === %TARGET% -^> %DEST% ===

if not defined SKILLS (
    echo [warn] No skills found in %ROOT%\skills\
    exit /b 0
)

set "EXIT_CODE=0"
for %%S in ("!SKILLS:;=" "!") do (
    call :copy_one "%%~S"
    if errorlevel 1 set "EXIT_CODE=1"
)
exit /b !EXIT_CODE!

:copy_one
set "SRC=%~1"
for %%N in ("%SRC%") do set "NAME=%%~nxN"
set "LINK=%DEST%\!NAME!"
if exist "!LINK!" (
    if "!FORCE!"=="1" (
        rmdir /s /q "!LINK!" >nul 2>&1
        if exist "!LINK!" (
            echo [fail] !NAME! ^(could not remove existing^)
            exit /b 1
        )
    ) else (
        echo [skip] !NAME! ^(already exists^)
        exit /b 0
    )
)
xcopy /E /I /Y /Q "!SRC!" "!LINK!" >nul 2>&1
if errorlevel 1 (
    echo [fail] !NAME!
    exit /b 1
) else (
    echo [ok]   !NAME!
    exit /b 0
)

:resolve_subdir
set "SUBDIR="
if /i "%~1"=="agents" set "SUBDIR=.agents\skills"
if /i "%~1"=="claude" set "SUBDIR=.claude\skills"
if /i "%~1"=="kilo"   set "SUBDIR=.kilo\skills"
goto :eof

:usage
echo Usage: copy-project.bat [--force] ^<target^> ^<project-path^> [^<skill^> ...]
echo.
echo Copy every skill in .\skills\ (or only the named ones) into the target
echo tool's skills directory inside the given project.
echo.
echo Targets:
echo     agents   ^<project-path^>\.agents\skills\   (Codex, etc.)
echo     claude   ^<project-path^>\.claude\skills\   (Claude)
echo     kilo     ^<project-path^>\.kilo\skills\     (Kilo)
echo.
echo Options:
echo     --force   Overwrite an existing skill directory at the destination.
echo               Without this flag, existing entries are skipped.
goto :eof
