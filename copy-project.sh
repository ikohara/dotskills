#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
    cat <<'EOF'
Usage: copy-project.sh [--force] <target> <project-path> [<skill> ...]

Copy every skill in ./skills/ (or only the named ones) into the target
tool's skills directory inside the given project.

Targets:
    agents   <project-path>/.agents/skills/   (Codex, etc.)
    claude   <project-path>/.claude/skills/   (Claude)
    kilo     <project-path>/.kilo/skills/     (Kilo)

Options:
    --force   Overwrite an existing skill directory at the destination.
              Without this flag, existing entries are skipped.
EOF
}

resolve_subdir() {
    case "$1" in
        agents) printf '%s\n' ".agents/skills" ;;
        claude) printf '%s\n' ".claude/skills" ;;
        kilo) printf '%s\n' ".kilo/skills" ;;
        *) return 1 ;;
    esac
}

FORCE=0
if [ $# -gt 0 ] && [ "$1" = "--force" ]; then
    FORCE=1
    shift
fi

if [ $# -lt 2 ]; then
    usage >&2
    exit 1
fi

TARGET="$1"
PROJECT="$2"
shift 2

if ! SUBDIR="$(resolve_subdir "$TARGET")"; then
    echo "[err] Unknown target: $TARGET" >&2
    echo >&2
    usage >&2
    exit 1
fi

if [ ! -d "$PROJECT" ]; then
    echo "[err] Project path not found: $PROJECT" >&2
    exit 1
fi

skills=()
if [ $# -eq 0 ]; then
    for d in "$ROOT"/skills/*/; do
        [ -d "$d" ] || continue
        skills+=("${d%/}")
    done
else
    for name in "$@"; do
        if [ ! -d "$ROOT/skills/$name" ]; then
            echo "[err] Unknown skill: $name" >&2
            exit 1
        fi
        skills+=("$ROOT/skills/$name")
    done
fi

DEST="$PROJECT/$SUBDIR"
mkdir -p "$DEST"
echo "=== $TARGET -> $DEST ==="

if [ ${#skills[@]} -eq 0 ]; then
    echo "[warn] No skills found in $ROOT/skills/" >&2
    exit 0
fi

exit_code=0
for skill_dir in "${skills[@]}"; do
    name="$(basename "$skill_dir")"
    link="$DEST/$name"
    if [ -e "$link" ]; then
        if [ "$FORCE" -eq 1 ]; then
            if ! rm -rf "$link"; then
                echo "[fail] $name (could not remove existing)" >&2
                exit_code=1
                continue
            fi
        else
            echo "[skip] $name (already exists)"
            continue
        fi
    fi
    if cp -R "$skill_dir" "$link"; then
        echo "[ok]   $name"
    else
        echo "[fail] $name" >&2
        exit_code=1
    fi
done

exit "$exit_code"
