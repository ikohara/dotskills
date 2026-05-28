#!/usr/bin/env bash
set -euo pipefail
uv tool run pre-commit run --all-files
