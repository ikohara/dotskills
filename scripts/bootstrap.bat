@echo off
rem Install the pre-commit hook (lint / format on every commit).
setlocal
rem Run from the project root (this script's dir is <root>/scripts), not the
rem caller's cwd.
cd /d "%~dp0.."
rem Guard: this project must be its own git root (.git lives here). A subdir of
rem a larger repo would scope the hook to the wrong repository -- make this its
rem own git repo/submodule, or scaffold it as a subtree subproject.
if not exist ".git" (
  echo ERROR: no .git in "%CD%": this project is not its own git root. See CONTRIBUTING.md.
  exit /b 1
)

rem powershell lints with PSScriptAnalyzer via pwsh (language: system); the
rem commit hook cannot fall back, so require pwsh + the module up front.
where pwsh >nul 2>nul
if errorlevel 1 (
  echo ERROR: PowerShell 7 ^(pwsh^) not found. See CONTRIBUTING.md.
  exit /b 1
)
pwsh -NoProfile -Command "if (Get-Module -ListAvailable -Name PSScriptAnalyzer) { exit 0 } else { exit 1 }" >nul 2>nul
if errorlevel 1 (
  echo ERROR: PSScriptAnalyzer module not found. See CONTRIBUTING.md.
  exit /b 1
)

rem Neutralizes any global core.hooksPath while running 'uvx pre-commit install'
rem (so a globally-configured hook manager cannot divert the install), then pins
rem local core.hooksPath to this repo's real hooks dir.
git config --local --unset-all core.hooksPath >nul 2>&1

set "GIT_CONFIG_GLOBAL=NUL"
uvx pre-commit install
set "UVX_EXIT=%ERRORLEVEL%"
set "GIT_CONFIG_GLOBAL="
if not "%UVX_EXIT%"=="0" exit /b %UVX_EXIT%

git config --local core.hooksPath .git/hooks
echo pre-commit hook installed at .git/hooks/
