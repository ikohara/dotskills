#!/usr/bin/env bash
set -euo pipefail
# Run from the project root (this script's dir is <root>/scripts), not the caller's cwd.
cd "$(dirname "$0")/.."
if [ "$#" -eq 0 ]; then
    uv tool run pre-commit run --all-files
else
    uv tool run pre-commit run --files "$@"
fi
