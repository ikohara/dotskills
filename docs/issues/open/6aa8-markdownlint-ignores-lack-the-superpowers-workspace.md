---
id: "6aa8"
title: the markdownlint ignores lack .superpowers/**, so the editor flags untracked workspace files the commit path never lints
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-12
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

Since 2026-09-11 the ignore list quoted above is three entries, not two —
`docs/superpowers/**`, `skills/tanto/templates/**`, and
`skills/kisou/templates/*.md` — and `.superpowers/**` is still not among
them.

The tanto-workspace plan (2026-09-12) is **not** the plan that resolves this.
It gives the new `.tanto/` tree a same-shaped fix of its own — an
in-directory `.markdownlint-cli2.yaml` holding `config:` and, indented two
spaces beneath it, `default: false`, written by whichever role finds it absent
— which silences the editor for that tree without touching any repository
configuration. That is a reusable shape, and design-4807 records it. But this
issue's actual complaint is that `.superpowers/**` is missing from the
repository's **root** `.markdownlint-cli2.yaml` `ignores`, and that file is a
linter configuration: out of a tanto plan's scope, never edited without
explicit approval, and (per this issue's own text) belonging in dotrepo's
template rather than here. The SDD workspace is still flagged by the editor;
only the new tree is quiet.
