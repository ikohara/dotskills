# Install Scripts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename `link.{bat,sh}` → `link-user.{bat,sh}`, add `copy-project.{bat,sh}` for project-local installation, normalize exit codes, and update docs. All changes land as one commit per the user's preference.

**Architecture:** Two install entry points at the repo root. `link-user` creates `mklink /J` (Windows) or `ln -s` (Unix) into `~/.{tool}/skills/` (existing behavior, renamed). `copy-project` recursively copies `./skills/*` into `<project>/.{tool}/skills/` for snapshot installs.

**Tech Stack:** POSIX Bash (`set -euo pipefail`) + Windows cmd batch (`@echo off`, `setlocal enabledelayedexpansion`). No new test framework — verification is smoke testing against a temp directory.

**Spec:** [docs/design/dc5d-install-scripts.md](../../design/dc5d-install-scripts.md)

---

## File Structure

**Created:**

- `copy-project.sh` — POSIX bash version of the project-local copy script.
- `copy-project.bat` — Windows cmd version, mirroring `copy-project.sh`.

**Renamed (`git mv`):**

- `link.sh` → `link-user.sh`
- `link.bat` → `link-user.bat`

**Modified after rename:**

- `link-user.sh` — usage text "Usage: link.sh" → "Usage: link-user.sh"; add `[fail] ⇒ exit 1` aggregation.
- `link-user.bat` — usage text "Usage: link.bat" → "Usage: link-user.bat"; add `[fail] ⇒ exit /b 1` aggregation.
- `README.md` — `link.{bat,sh}` references; new `copy-project` paragraph in Install section.
- `AGENTS.md` — "Always do" rule mentions `link.{bat,sh}` → `link-user.{bat,sh}`.

Each shell script lives at the repo root and computes its source root from its own path (`$(dirname "$0")` or `%~dp0`), so the scripts are runnable from any CWD.

---

## Conventions for this plan

- **Smoke test pattern.** Whenever a task changes script behavior, the verify step creates a throwaway temp directory, runs the script, asserts directory/file existence + expected stdout substrings, then removes the temp directory. Bash uses `mktemp -d`; cmd uses `%TEMP%\dotskills-smoke-<rand>`.
- **No batch commits.** Per `AGENTS.md`, do not run `git commit` until Task 11. Stage incrementally with `git add` as you go.
- **Run from repo root.** All commands assume CWD = `c:\Users\0000105523\devel\dotskills`.

---

## Task 1: Rename `link.sh` → `link-user.sh` and update internals

**Files:**

- Rename: `link.sh` → `link-user.sh`
- Modify: `link-user.sh:8` (usage heredoc heading)

**Steps:**

- [ ] **Step 1: Rename via git**

```bash
git mv link.sh link-user.sh
```

- [ ] **Step 2: Update the usage heading inside the script**

In `link-user.sh`, change line 8 from:

```text
Usage: link.sh <target> [<target> ...]
```

to:

```text
Usage: link-user.sh <target> [<target> ...]
```

- [ ] **Step 3: Smoke test — usage prints with new name**

```bash
./link-user.sh 2>&1 | head -1
```

Expected: `Usage: link-user.sh <target> [<target> ...]`

- [ ] **Step 4: Stage**

```bash
git add link-user.sh link.sh
```

---

## Task 2: Rename `link.bat` → `link-user.bat` and update internals

**Files:**

- Rename: `link.bat` → `link-user.bat`
- Modify: `link-user.bat:55` (usage echo)

**Steps:**

- [ ] **Step 1: Rename via git**

```bash
git mv link.bat link-user.bat
```

- [ ] **Step 2: Update the usage echo inside the script**

In `link-user.bat`, change line 55 from:

```text
echo Usage: link.bat ^<target^> [^<target^> ...]
```

to:

```text
echo Usage: link-user.bat ^<target^> [^<target^> ...]
```

- [ ] **Step 3: Smoke test — usage prints with new name**

Run in PowerShell:

```powershell
cmd /c link-user.bat 2>&1 | Select-Object -First 1
```

Expected: `Usage: link-user.bat <target> [<target> ...]`

- [ ] **Step 4: Stage**

```bash
git add link-user.bat link.bat
```

---

## Task 3: Add `[fail] ⇒ exit 1` aggregation to `link-user.sh`

**Files:**

- Modify: `link-user.sh:43-65` (the `link_target` function)

**Rationale:** Per spec, both scripts return exit 1 if any skill resulted in `[fail]`. `link-user.sh` currently always exits 0.

**Steps:**

- [ ] **Step 1: Replace the `link_target` function**

Locate the current `link_target() { ... }` (lines 43–70) and replace its body so the failure count is tracked and returned. Final shape:

```bash
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
```

- [ ] **Step 2: Replace the final loop to propagate failures**

At the bottom of the file, the current code is:

```bash
for target in "$@"; do
    link_target "$target"
done
```

Replace it with:

```bash
exit_code=0
for target in "$@"; do
    link_target "$target" || exit_code=1
done
exit "$exit_code"
```

- [ ] **Step 3: Smoke test — happy path returns 0**

```bash
tmp="$(mktemp -d)"
HOME="$tmp" ./link-user.sh claude
echo "exit=$?"
ls "$tmp/.claude/skills/"
rm -rf "$tmp"
```

Expected: `exit=0` and the directory listing shows the symlinks (one per `./skills/*` entry).

- [ ] **Step 4: Smoke test — forced failure returns 1**

Force a failure by pointing `ln` at a read-only destination:

```bash
tmp="$(mktemp -d)"
mkdir -p "$tmp/.claude/skills"
chmod a-w "$tmp/.claude/skills"
HOME="$tmp" ./link-user.sh claude
echo "exit=$?"
chmod a+w "$tmp/.claude/skills"
rm -rf "$tmp"
```

Expected: `exit=1` and `[fail]` lines for each skill.

- [ ] **Step 5: Stage**

```bash
git add link-user.sh
```

---

## Task 4: Add `[fail] ⇒ exit /b 1` aggregation to `link-user.bat`

**Files:**

- Modify: `link-user.bat:22` (top-level loop), `link-user.bat:32-52` (`:link_target` label)

**Steps:**

- [ ] **Step 1: Replace the top-level loop**

Change line 22 from:

```text
for %%T in (%*) do call :link_target "%%~T"
exit /b 0
```

to:

```text
set "EXIT_CODE=0"
for %%T in (%*) do (
    call :link_target "%%~T"
    if errorlevel 1 set "EXIT_CODE=1"
)
exit /b !EXIT_CODE!
```

- [ ] **Step 2: Update `:link_target` to return failures**

Change the body of the `:link_target` label so the inner `mklink` error sets a per-target return value. Replace lines 32–52 with:

```text
:link_target
call :resolve_dest "%~1"
if not exist "!DEST!" mkdir "!DEST!"
echo === %~1 -^> !DEST! ===
set "found="
set "target_failed=0"
for /d %%S in ("%ROOT%\skills\*") do (
    set "found=1"
    set "link=!DEST!\%%~nxS"
    if exist "!link!" (
        echo [skip] %%~nxS ^(already exists^)
    ) else (
        mklink /J "!link!" "%%~fS" >nul 2>&1
        if errorlevel 1 (
            echo [fail] %%~nxS
            set "target_failed=1"
        ) else (
            echo [ok]   %%~nxS
        )
    )
)
if not defined found echo [warn] No skills found in %ROOT%\skills\
exit /b !target_failed!
```

(Note the closing changes from `goto :eof` to `exit /b !target_failed!`.)

- [ ] **Step 3: Smoke test — happy path returns 0**

In PowerShell:

```powershell
$tmp = New-Item -ItemType Directory (Join-Path $env:TEMP "dotskills-smoke-$([guid]::NewGuid().ToString('N').Substring(0,8))")
$env:USERPROFILE_ORIG = $env:USERPROFILE
$env:USERPROFILE = $tmp.FullName
cmd /c link-user.bat claude
"exit=$LASTEXITCODE"
Get-ChildItem "$($tmp.FullName)\.claude\skills"
$env:USERPROFILE = $env:USERPROFILE_ORIG
Remove-Item $tmp.FullName -Recurse -Force
```

Expected: `exit=0` and a directory listing of junctions matching `./skills/*`.

- [ ] **Step 4: Smoke test — failure returns 1**

mklink requires Administrator or Developer Mode; if not available locally, simulate by pre-creating a regular file at the destination (causes `[skip]` not `[fail]`). For `[fail]`, run as a non-admin in a context where `mklink /J` fails:

```powershell
$tmp = New-Item -ItemType Directory (Join-Path $env:TEMP "dotskills-smoke-$([guid]::NewGuid().ToString('N').Substring(0,8))")
$env:USERPROFILE_ORIG = $env:USERPROFILE
$env:USERPROFILE = $tmp.FullName
New-Item -ItemType File "$($tmp.FullName)\.claude\skills" -Force | Out-Null
cmd /c link-user.bat claude
"exit=$LASTEXITCODE"
$env:USERPROFILE = $env:USERPROFILE_ORIG
Remove-Item $tmp.FullName -Recurse -Force
```

If creating a file where the script expects a dir is not enough to trigger `[fail]` reliably, skip this verification and rely on Task 9's combined smoke test.

Expected (when triggered): `exit=1` and `[fail]` lines.

- [ ] **Step 5: Stage**

```bash
git add link-user.bat
```

---

## Task 5: Update `README.md`

**Files:**

- Modify: `README.md:10-21` (Install section)

**Steps:**

- [ ] **Step 1: Replace the Install section**

Locate the Install section (currently lines 10–21). Replace with:

```markdown
## Install

Pick one of two install strategies depending on whether skills should live
host-wide or inside a single project.

### Host-wide (link via the worktree)

Run `link-user.{bat,sh} <target> [<target> ...]` to junction (Windows) /
symlink (Unix) every skill in `./skills/` into the target tool's user-level
skills directory. Edits in this worktree are immediately visible to every
project on the host.

```console
./link-user.sh claude
```

Targets: `agents` (for Codex, etc.), `claude`, `kilo`.

### Project-local (copy a snapshot)

Run `copy-project.{bat,sh} [--force] <target> <project-path> [<skill> ...]`
to copy every skill in `./skills/` into a specific project's skills
directory. Subsequent worktree edits do not propagate — re-run with
`--force` to update.

```console
./copy-project.sh claude ../myproj           # all skills
./copy-project.sh claude ../myproj wayaku    # only one skill
./copy-project.sh --force claude ../myproj   # overwrite existing
```

Or copy a folder from `skills/` directly into your project's `.agents/skills/`
or `.claude/skills/`.
```

(The opening `\`\`\`` for the fenced block above is just `\`\`\`console` — render in your editor; do not change other content.)

- [ ] **Step 2: Verify markdownlint passes**

```bash
npx markdownlint-cli2 README.md
```

Expected: no errors.

- [ ] **Step 3: Stage**

```bash
git add README.md
```

---

## Task 6: Update `AGENTS.md`

**Files:**

- Modify: `AGENTS.md:33`

**Steps:**

- [ ] **Step 1: Update the "Always do" reference**

Replace line 33:

```text
- Verify changes touching `skills/` still link correctly via `link.{bat,sh}`.
```

with:

```text
- Verify changes touching `skills/` still link correctly via `link-user.{bat,sh}`.
```

- [ ] **Step 2: Verify markdownlint passes**

```bash
npx markdownlint-cli2 AGENTS.md
```

Expected: no errors.

- [ ] **Step 3: Stage**

```bash
git add AGENTS.md
```

---

## Task 7: Create `copy-project.sh`

**Files:**

- Create: `copy-project.sh`

**Full file content:**

```bash
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
```

**Steps:**

- [ ] **Step 1: Write the file**

Use `Write` to create `copy-project.sh` with the content above.

- [ ] **Step 2: Make executable**

```bash
chmod +x copy-project.sh
```

- [ ] **Step 3: Smoke test — usage on no args**

```bash
./copy-project.sh; echo "exit=$?"
```

Expected: usage text on stderr, `exit=1`.

- [ ] **Step 4: Smoke test — unknown target**

```bash
./copy-project.sh bogus /tmp; echo "exit=$?"
```

Expected: `[err] Unknown target: bogus`, then usage, `exit=1`.

- [ ] **Step 5: Smoke test — missing project path**

```bash
./copy-project.sh claude /does/not/exist; echo "exit=$?"
```

Expected: `[err] Project path not found: /does/not/exist`, `exit=1`.

- [ ] **Step 6: Smoke test — unknown skill name**

```bash
tmp="$(mktemp -d)"
./copy-project.sh claude "$tmp" bogus_skill; echo "exit=$?"
rm -rf "$tmp"
```

Expected: `[err] Unknown skill: bogus_skill`, `exit=1`.

- [ ] **Step 7: Smoke test — happy path, all skills**

```bash
tmp="$(mktemp -d)"
./copy-project.sh claude "$tmp"
ls "$tmp/.claude/skills/"
rm -rf "$tmp"
```

Expected: `=== claude -> .../.claude/skills ===`, `[ok]` for each `./skills/*` entry, and the listing shows each skill as a regular directory (not a symlink).

- [ ] **Step 8: Smoke test — filter to one skill**

```bash
tmp="$(mktemp -d)"
./copy-project.sh claude "$tmp" wayaku
ls "$tmp/.claude/skills/"
rm -rf "$tmp"
```

Expected: only `wayaku` appears.

- [ ] **Step 9: Smoke test — skip on existing**

```bash
tmp="$(mktemp -d)"
./copy-project.sh claude "$tmp" wayaku
./copy-project.sh claude "$tmp" wayaku
echo "exit=$?"
rm -rf "$tmp"
```

Expected: second run prints `[skip] wayaku (already exists)`, `exit=0`.

- [ ] **Step 10: Smoke test — --force overwrites**

```bash
tmp="$(mktemp -d)"
./copy-project.sh claude "$tmp" wayaku
touch "$tmp/.claude/skills/wayaku/MARKER"
./copy-project.sh --force claude "$tmp" wayaku
test -f "$tmp/.claude/skills/wayaku/MARKER" && echo "MARKER survived (BAD)" || echo "MARKER removed (GOOD)"
rm -rf "$tmp"
```

Expected: `MARKER removed (GOOD)`.

- [ ] **Step 11: Lint via shellcheck**

```bash
shellcheck copy-project.sh
```

Expected: no findings.

- [ ] **Step 12: Stage**

```bash
git add copy-project.sh
```

---

## Task 8: Create `copy-project.bat`

**Files:**

- Create: `copy-project.bat`

**Full file content:**

```text
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
if "%~1"=="" (
    for /d %%S in ("%ROOT%\skills\*") do (
        if defined SKILLS (set "SKILLS=!SKILLS!;%%~fS") else (set "SKILLS=%%~fS")
    )
) else (
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
)

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
```

**Steps:**

- [ ] **Step 1: Write the file**

Use `Write` to create `copy-project.bat` with the content above.

- [ ] **Step 2: Smoke test — usage**

In PowerShell:

```powershell
cmd /c copy-project.bat
"exit=$LASTEXITCODE"
```

Expected: usage text and `exit=1`.

- [ ] **Step 3: Smoke test — unknown target**

```powershell
cmd /c copy-project.bat bogus C:\
"exit=$LASTEXITCODE"
```

Expected: `[err] Unknown target: bogus`, then usage, `exit=1`.

- [ ] **Step 4: Smoke test — missing project path**

```powershell
cmd /c copy-project.bat claude C:\does\not\exist
"exit=$LASTEXITCODE"
```

Expected: `[err] Project path not found: ...`, `exit=1`.

- [ ] **Step 5: Smoke test — unknown skill**

```powershell
$tmp = New-Item -ItemType Directory (Join-Path $env:TEMP "dotskills-smoke-$([guid]::NewGuid().ToString('N').Substring(0,8))")
cmd /c copy-project.bat claude $tmp.FullName bogus_skill
"exit=$LASTEXITCODE"
Remove-Item $tmp.FullName -Recurse -Force
```

Expected: `[err] Unknown skill: bogus_skill`, `exit=1`.

- [ ] **Step 6: Smoke test — happy path, all skills**

```powershell
$tmp = New-Item -ItemType Directory (Join-Path $env:TEMP "dotskills-smoke-$([guid]::NewGuid().ToString('N').Substring(0,8))")
cmd /c copy-project.bat claude $tmp.FullName
"exit=$LASTEXITCODE"
Get-ChildItem "$($tmp.FullName)\.claude\skills"
Remove-Item $tmp.FullName -Recurse -Force
```

Expected: `[ok]` per skill, `exit=0`, the listing shows real directories (not junctions).

- [ ] **Step 7: Smoke test — filter to one skill**

```powershell
$tmp = New-Item -ItemType Directory (Join-Path $env:TEMP "dotskills-smoke-$([guid]::NewGuid().ToString('N').Substring(0,8))")
cmd /c copy-project.bat claude $tmp.FullName wayaku
Get-ChildItem "$($tmp.FullName)\.claude\skills"
Remove-Item $tmp.FullName -Recurse -Force
```

Expected: only `wayaku`.

- [ ] **Step 8: Smoke test — skip then --force**

```powershell
$tmp = New-Item -ItemType Directory (Join-Path $env:TEMP "dotskills-smoke-$([guid]::NewGuid().ToString('N').Substring(0,8))")
cmd /c copy-project.bat claude $tmp.FullName wayaku
cmd /c copy-project.bat claude $tmp.FullName wayaku
"first second exit=$LASTEXITCODE"
New-Item -ItemType File "$($tmp.FullName)\.claude\skills\wayaku\MARKER" | Out-Null
cmd /c copy-project.bat --force claude $tmp.FullName wayaku
if (Test-Path "$($tmp.FullName)\.claude\skills\wayaku\MARKER") { "MARKER survived (BAD)" } else { "MARKER removed (GOOD)" }
Remove-Item $tmp.FullName -Recurse -Force
```

Expected: second run prints `[skip]`, third run removes MARKER (`MARKER removed (GOOD)`).

- [ ] **Step 9: Stage**

```bash
git add copy-project.bat
```

---

## Task 9: End-to-end smoke test (Bash and PowerShell)

This task verifies that link-user and copy-project coexist cleanly and that both rename paths still resolve.

- [ ] **Step 1: Bash — link-user, all targets, then status**

```bash
tmp="$(mktemp -d)"
HOME="$tmp" ./link-user.sh agents claude kilo
echo "exit=$?"
ls "$tmp/.agents/skills/" "$tmp/.claude/skills/" "$tmp/.kilo/skills/"
rm -rf "$tmp"
```

Expected: `exit=0`, all three directories populated with symlinks.

- [ ] **Step 2: Bash — copy-project after link-user (different roots, no interference)**

```bash
tmp="$(mktemp -d)"
mkdir "$tmp/proj"
HOME="$tmp" ./link-user.sh claude
./copy-project.sh claude "$tmp/proj"
test -L "$tmp/.claude/skills/wayaku" && echo "host: symlink OK"
test -d "$tmp/proj/.claude/skills/wayaku" && ! test -L "$tmp/proj/.claude/skills/wayaku" && echo "proj: real dir OK"
rm -rf "$tmp"
```

Expected: both "OK" lines.

- [ ] **Step 3: Verify no `link.bat` or `link.sh` left behind**

```bash
test ! -e link.sh && test ! -e link.bat && echo "rename clean"
```

Expected: `rename clean`.

- [ ] **Step 4: Grep for lingering references to the old names**

```bash
git grep -nE 'link\.(bat|sh)' || echo "no lingering references"
```

Expected: `no lingering references`. If anything matches outside of git history (e.g., `docs/issues/`, `docs/decisions/`), update those references too and re-stage.

---

## Task 10: Run pre-commit

- [ ] **Step 1: Run pre-commit on all staged files**

```bash
pre-commit run --files link-user.sh link-user.bat copy-project.sh copy-project.bat README.md AGENTS.md docs/design/dc5d-install-scripts.md
```

Expected: all hooks pass. If a hook auto-fixes a file (e.g., shfmt, markdownlint-cli2 fix), re-stage with `git add <file>` and re-run.

If hooks fail with content the author should fix, fix inline, re-stage, re-run. Do not skip hooks.

---

## Task 11: Ask for commit approval, then commit

Per `AGENTS.md`: "Wait for explicit user approval before committing." Do NOT run `git commit` until the user confirms.

- [ ] **Step 1: Stage the spec and summarize**

```bash
git add docs/design/dc5d-install-scripts.md docs/superpowers/plans/2026-05-28-install-scripts.md
git status
git diff --staged --stat
```

- [ ] **Step 2: Ask the user**

Prompt: "Staged: link-user.{bat,sh} (rename + exit-1 aggregation), copy-project.{bat,sh} (new), README.md + AGENTS.md (refs), docs/design/dc5d-install-scripts.md (spec). Commit?"

- [ ] **Step 3: On approval, commit**

```bash
git commit -m "$(cat <<'EOF'
feat(install): add copy-project + rename link to link-user

- Rename link.{bat,sh} -> link-user.{bat,sh} to disambiguate from the
  new project-local copy-project.{bat,sh}.
- copy-project copies ./skills/* into <project>/.{tool}/skills/, with
  optional --force overwrite and optional positional skill filter.
- Normalize exit codes: both scripts now exit 1 on any [fail].
- README.md install section documents both strategies side by side.
- docs/design/dc5d-install-scripts.md records the current shape.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: Verify**

```bash
git log -1 --stat
```

Expected: one new commit listing all touched files.

---

## Self-Review Checklist

Run through this before handing off to execution:

- [x] **Spec coverage** — every section of `dc5d-install-scripts.md` maps to a task: Shape/Targets (Tasks 5–6), CLI (Tasks 7–8), Conflict handling (Task 7 Step 9–10, Task 8 Step 8), Output format (all run smoke tests), Exit codes (Tasks 3–4 + 7–8), Validation order (Task 7 Steps 3–6, Task 8 Steps 2–5), Mechanics (Tasks 7–8 file content), Related (Tasks 5–6).
- [x] **No placeholders** — no TBD / TODO / "add appropriate error handling" / "similar to Task N" / unspecified code.
- [x] **Type consistency** — function `resolve_dest` retained in link-user; new `resolve_subdir` introduced consistently in both copy-project variants; output prefixes (`[ok]`, `[skip]`, `[fail]`, `[err]`, `[warn]`) used identically across all four scripts.
