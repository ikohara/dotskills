---
id: "e3a1"
title: kisou case detection fails on case-insensitive filesystems
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-05-28
---

The migrate-mode pre-flight detection in `kisou` SKILL.md says "any
Pascal-cased structural dir observed (e.g., `Documents/`, `Source/`, `Tests/`)
⇒ `case=PascalCase`." Naive `test -d Pascal/` falsely matches a lowercase
`pascal/` on Windows/NTFS and macOS default APFS/HFS+, both of which are
case-insensitive by default.

Discovered during the first real migrate run on `dotskills`
(commit `1caf975`): the detection script reported `Scripts/ : exists
(=> case=PascalCase)` even though the actual on-disk dir is lowercase
`scripts/`. The on-disk canonical case has to be queried directly (e.g.,
`ls -d */`, `compgen -G`, or `git ls-files`).

Spec & SKILL.md need a tweak: the detection rule must check the FS's
canonical case (not just dir-existence), or implementations on case-insensitive
filesystems will mis-set `case`. Re-flowing one detected Pascal-cased dir
through PascalCase mapping then cascades to all `{{name}}` expansions, so the
blast radius is large.

## Reproducer

On Windows (Git Bash) inside any repo whose top-level dirs are lowercase:

```bash
test -d Scripts/ && echo "match"  # prints "match" — wrong
ls -d Scripts/ 2>/dev/null         # silent — actually no such dir
```

## Suggested fix

Replace dir-existence checks with canonical-case enumeration:

```bash
# List actual dir names (case-preserved).
for d in */; do
  [ "$d" = "Documents/" ] && case_hint=PascalCase
done
```

Or via git's case-sensitive index:

```bash
git ls-files | cut -d/ -f1 | sort -u | grep -E '^(Documents|Source|Tests|Scripts)$'
```
