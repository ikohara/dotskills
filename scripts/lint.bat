@echo off
rem No args: lint everything. --all-files only sees git ls-files, so surface
rem untracked files first. Args: lint just those paths; pre-commit
rem routes each path to the hooks whose files:/types: match.
setlocal
rem Run from the project root (this script's dir is <root>/scripts), not the caller's cwd.
cd /d "%~dp0.."
if "%~1"=="" (
  git add --intent-to-add .
  uv tool run pre-commit run --all-files
) else (
  uv tool run pre-commit run --files %*
)
rem A bare trailing endlocal resets the exit code to 0; expand ERRORLEVEL on the
rem same line so the pre-commit result propagates to the caller.
endlocal & exit /b %ERRORLEVEL%
