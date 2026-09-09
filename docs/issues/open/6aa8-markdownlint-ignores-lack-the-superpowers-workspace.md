---
id: "6aa8"
title: the markdownlint ignores lack .superpowers/**, so the editor flags untracked workspace files the commit path never lints
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

`.markdownlint-cli2.yaml` ignores `docs/superpowers/**` and
`skills/**/templates/**` and nothing else. `.superpowers/` is the superpowers
plugin's own workspace — `subagent-driven-development`'s `sdd-workspace`
script creates `.superpowers/sdd/<plan-basename>/` and writes `*` into
`.superpowers/sdd/.gitignore`; `brainstorming`'s visual companion uses
`.superpowers/brainstorm/` — and `tanto` keeps its roster, ledgers, prompts,
reports, and briefs there too. Every Markdown file under it is untracked by
construction.

The commit path never sees those files: pre-commit runs on tracked or named
paths, `git ls-files .superpowers` is empty, so `--all-files` and every
commit skip them. The VS Code markdownlint extension reads the same
configuration and does lint them, so a session that opens a brief or a ledger
sees warnings — on 2026-09-09 Sekkei reported MD038 on the review brief's
` — ` code spans — and may spend a turn on them. Noise, with no effect on any
commit.

The fix is one line, `.superpowers/**` in the config's `ignores`. This
repository's `.markdownlint-cli2.yaml` is a copy of dotrepo's base scaffold,
so the line belongs in dotrepo's template and flows in by refresh; a hand
edit here would be overwritten. Linter configuration is also on the
repository's never-edit-without-approval list, which is why this is an issue
and not a commit. Related: req-04f5 (tanto's workspace), the kisou / dotrepo
boundary.
