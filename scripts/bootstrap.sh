#!/usr/bin/env bash
# Install the pre-commit hook (lint / format on every commit).
set -euo pipefail
# Run from the project root (this script's dir is <root>/scripts), not the
# caller's cwd.
cd "$(dirname "$0")/.."
# Guard: this project must be its own git root (.git lives here). A subdir of
# a larger repo would scope the hook to the wrong repository -- make this its
# own git repo/submodule, or scaffold it as a subtree subproject.
if [ ! -e .git ]; then
    echo "ERROR: no .git in $(pwd): this project is not its own git root. See CONTRIBUTING.md." >&2
    exit 1
fi

# powershell lints with PSScriptAnalyzer via pwsh (language: system); the
# commit hook cannot fall back, so require pwsh + the module up front.
if ! command -v pwsh >/dev/null 2>&1; then
    echo "ERROR: PowerShell 7 (pwsh) not found. See CONTRIBUTING.md." >&2
    exit 1
fi
if ! pwsh -NoProfile -Command "if (Get-Module -ListAvailable -Name PSScriptAnalyzer) { exit 0 } else { exit 1 }" >/dev/null 2>&1; then
    echo "ERROR: PSScriptAnalyzer module not found. See CONTRIBUTING.md." >&2
    exit 1
fi

# Neutralizes any global core.hooksPath while running 'uvx pre-commit install'
# (so a globally-configured hook manager cannot divert the install), then pins
# local core.hooksPath to this repo's real hooks dir.
git config --local --unset-all core.hooksPath >/dev/null 2>&1 || true

GIT_CONFIG_GLOBAL=/dev/null uvx pre-commit install

git config --local core.hooksPath .git/hooks

echo "pre-commit hook installed at .git/hooks/"
