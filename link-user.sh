#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
    cat <<'EOF'
Usage: link-user.sh <target> [<target> ...]

Link every skill in ./skills/ into the target tool's user-level skills
directory via symlink.

Targets:
    agents   ~/.agents/skills/   (Codex, etc.)
    claude   ~/.claude/skills/   (Claude)
    kilo     ~/.kilo/skills/     (Kilo)
EOF
}

if [ $# -eq 0 ]; then
    usage
    exit 1
fi

resolve_dest() {
    case "$1" in
        agents) printf '%s\n' "$HOME/.agents/skills" ;;
        claude) printf '%s\n' "$HOME/.claude/skills" ;;
        kilo) printf '%s\n' "$HOME/.kilo/skills" ;;
        *) return 1 ;;
    esac
}

for target in "$@"; do
    if ! resolve_dest "$target" >/dev/null; then
        echo "[err] Unknown target: $target" >&2
        echo >&2
        usage >&2
        exit 1
    fi
done

link_target() {
    local target="$1"
    local dest
    dest="$(resolve_dest "$target")"

    mkdir -p "$dest"
    echo "=== $target -> $dest ==="

    local skill_dir name link
    local found=0
    local failed=0
    for skill_dir in "$ROOT"/skills/*/; do
        [ -d "$skill_dir" ] || continue
        found=1
        skill_dir="${skill_dir%/}"
        name="$(basename "$skill_dir")"
        link="$dest/$name"
        if [ -e "$link" ] || [ -L "$link" ]; then
            echo "[skip] $name (already exists)"
        elif ln -s "$skill_dir" "$link"; then
            echo "[ok]   $name"
        else
            echo "[fail] $name" >&2
            failed=$((failed + 1))
        fi
    done
    if [ "$found" -eq 0 ]; then
        echo "[warn] No skills found in $ROOT/skills/" >&2
    fi
    return "$failed"
}

exit_code=0
for target in "$@"; do
    link_target "$target" || exit_code=1
done
exit "$exit_code"
