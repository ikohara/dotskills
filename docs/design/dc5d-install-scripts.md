---
id: "dc5d"
title: install scripts — link-user (global) and copy-project (project-local)
created: 2026-05-28
updated: 2026-05-28
---

## Shape

Two install entry points sit at the repo root, one per delivery mechanism:

- `link-user.{bat,sh}` — link `./skills/*` into the user-level skills
  directory of a target tool (`~/.{tool}/skills/`). Windows uses `mklink /J`
  (junction); Unix uses `ln -s`. The contents stay live with the worktree:
  edits in `./skills/` are immediately visible to every project on the host.
- `copy-project.{bat,sh}` — recursively copy `./skills/*` into a specific
  project's skills directory (`<project>/.{tool}/skills/`). The project gets a
  snapshot decoupled from the worktree; subsequent edits in `./skills/` do
  not propagate.

The split exists because the two delivery shapes have incompatible trade-offs.
Linking gives one-source-of-truth across all projects on the host but couples
every project to the worktree's HEAD. Copying gives per-project isolation
(useful when the project's skills need to be checked in, vendored, or shipped
to teammates who don't share the worktree) at the cost of explicit re-copy on
update.

## Targets

Both scripts accept the same target alphabet, alphabetically ordered in
`usage` and `resolve_dest`:

| Target   | link-user destination          | copy-project destination               |
| -------- | ------------------------------ | -------------------------------------- |
| `agents` | `~/.agents/skills/`            | `<project>/.agents/skills/`            |
| `claude` | `~/.claude/skills/`            | `<project>/.claude/skills/`            |
| `kilo`   | `~/.kilo/skills/`              | `<project>/.kilo/skills/`              |

`link-user` accepts multiple targets in one invocation (`link-user.sh claude
agents`); `copy-project` accepts one target per invocation so positional
skill-name filtering stays unambiguous.

## CLI

```text
link-user.{bat,sh}   <target> [<target> ...]
copy-project.{bat,sh} [--force] <target> <project-path> [<skill> ...]
```

`copy-project` arguments:

- `<target>` — one of the targets above.
- `<project-path>` — existing directory; the destination
  `<project-path>/.<tool>/skills/` is created if absent.
- `<skill>` — zero or more skill names; when given, only those skills are
  copied (each must exist as `./skills/<name>/`). When omitted, every
  `./skills/*/` is copied.
- `--force` — when a destination skill directory already exists, remove it
  and re-copy. Without the flag, an existing destination is skipped.

## Conflict handling

For each skill, per invocation:

| State                          | Without `--force` | With `--force`            |
| ------------------------------ | ----------------- | ------------------------- |
| Destination absent             | copy → `[ok]`     | copy → `[ok]`             |
| Destination present            | `[skip]`          | remove + copy → `[ok]`    |
| Copy/remove fails              | `[fail]`          | `[fail]`                  |

`link-user` keeps its existing semantics: existing destinations are always
skipped (junctions/symlinks are cheap to recreate manually; there is no
intermediate state to preserve), so no `--force` is added.

## Output format

Both scripts emit a header and one line per skill, sharing the same prefix
vocabulary:

```text
=== claude -> /path/to/dest ===
[ok]    wayaku
[skip]  shoroku (already exists)
[fail]  kisou
```

When `./skills/` contains no entries: `[warn] No skills found in <root>/skills/`.

## Exit codes

- `0` — every selected skill resulted in `[ok]` or `[skip]`.
- `1` — any of: invalid arguments, unknown target, missing project path,
  unknown skill name, or one or more `[fail]` lines.

`link-user` adopts the same `[fail] ⇒ exit 1` rule alongside the rename, so
the two scripts behave identically on failure.

## Validation order

1. No arguments → print usage, exit 1.
2. Unknown flag (only `--force` is recognized by `copy-project`) → print
   usage, exit 1.
3. Unknown `<target>` → `[err] Unknown target: <name>` + usage, exit 1.
4. `copy-project` only: `<project-path>` does not exist or is not a directory
   → `[err] Project path not found: <path>`, exit 1.
5. `copy-project` only: any positional `<skill>` not found at
   `./skills/<skill>/` → `[err] Unknown skill: <name>`, exit 1.
6. `./skills/` empty → `[warn]` and exit 0 (consistent with link-user today).

## Mechanics

- bash (`copy-project.sh`): `cp -R` for the copy; `rm -rf` first when
  `--force` and the destination exists.
- cmd (`copy-project.bat`): `xcopy /E /I /Y /Q` for the copy; `rmdir /S /Q`
  first when `--force` and the destination exists.
- Both scripts compute the source root from their own location, not the
  caller's CWD, so they remain runnable from any directory.

## Related

- `README.md` — Install section documents both scripts side by side.
- `AGENTS.md` (root) — "Always do" rule references `link-user.{bat,sh}` for
  the post-edit smoke-link check.
