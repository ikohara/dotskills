#!/usr/bin/env bash
# Install the pre-commit hook (lint / format on every commit).
# Neutralizes any global core.hooksPath while running 'uvx pre-commit install'
# (so a globally-configured hook manager cannot divert the install), then pins
# local core.hooksPath to .git/hooks.
set -eu

git config --local --unset-all core.hooksPath 2>/dev/null || true

GIT_CONFIG_GLOBAL=/dev/null uvx pre-commit install

git config --local core.hooksPath .git/hooks

echo "pre-commit hook installed at .git/hooks/"
