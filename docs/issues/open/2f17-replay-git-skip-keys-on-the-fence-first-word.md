---
id: "2f17"
title: "`replay`'s `git` skip keys on the fence's first word, so an assignment-prefixed git command runs in the applied tree"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-10-03
---

Source: shoroku tanto

Observed at the kisou-refresh plan stage (2026-09-11), by Sekkei, while
authoring the plan's `diff` base expression. `passage-check.js replay` runs
every `bash` and `console` fence of a plan inside the applied scratch tree,
and skips a git command by testing the fence's **first word** against `git`.
A fence written

```text
BASE=$(git log --diff-filter=A --format=%H -1 -- <path>)^ && node "$TANTO/scripts/passage-check.js" diff --plan <plan> --base "$BASE"
```

has first word `BASE=$(git`, is not skipped, and runs in a directory that is
not a repository — a `fatal: not a git repository` on stderr, reported as a
`DIFFERS` rather than a skip. Neither is a failure under `replay`'s rules, so
nothing is reported wrongly; the cost is noise in every dry run, and a reader
who has to place it.

The kisou-refresh plan never shipped such a fence: its base expression is
inlined as the `--base "$(git log …)^"` argument of a `node` command, and
that command is skipped by a `replay-skip:` pattern the plan declares. So this
is an observation about a shape the next plan may well want — a variable
assignment is the natural way to name a base once and use it twice — rather
than a defect met.

The fix is small: test the command after stripping a leading run of
`NAME=value` words (and a leading `export`), or test whether any
`git` word occurs before the first `&&`, `;`, or `|`. Either keeps the rule
keyed on what the command does rather than on how its line begins.

Under contract rule 11: the change edits `skills/tanto/scripts/passage-check.js`,
so it rides with a rule-11 plan or a Kanri hotfix, not with a kisou plan.

Related: issue-7481 (the instrument), issue-7c11 (the lead grammar's
backtick limit, found at the same plan stage), issue-909c (the base
expression this fence shape was written for).

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
