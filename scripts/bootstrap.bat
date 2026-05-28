@echo off
rem Install the pre-commit hook (lint / format on every commit).
rem Neutralizes any global core.hooksPath while running 'uvx pre-commit install'
rem (so a globally-configured hook manager cannot divert the install), then pins
rem local core.hooksPath to .git/hooks.
setlocal

git config --local --unset-all core.hooksPath >nul 2>&1

set "GIT_CONFIG_GLOBAL=NUL"
uvx pre-commit install
set "UVX_EXIT=%ERRORLEVEL%"
set "GIT_CONFIG_GLOBAL="
if not "%UVX_EXIT%"=="0" exit /b %UVX_EXIT%

git config --local core.hooksPath .git/hooks

echo pre-commit hook installed at .git/hooks/
