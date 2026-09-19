---
id: "5050"
title: "`scripts/lint.sh <directory>` lints nothing and exits 0"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-30

`scripts/lint.sh` and `scripts/lint.bat` pass their arguments to pre-commit as
`--files`. pre-commit types a directory argument as `directory`, every hook
skips it with `(no files to check)`, and the run exits `0`. A caller who lints
a directory therefore gets a green result having checked nothing.

Measured: this is what let F-1 through on the `bug-report-hold` plan — a plan
step written by an opus/high drafter and read by a Keikaku reviewer, both of
whom took the exit status at face value.

Either `lint.sh` expands a directory argument (`git ls-files -- "$@"`) or it
refuses one with a non-zero exit. A silent success is the defect; both fixes
remove it.

Worth a line in the Windows/Bash pitfalls memory as well, since the same silent
skip is not specific to this repository's wrapper.
