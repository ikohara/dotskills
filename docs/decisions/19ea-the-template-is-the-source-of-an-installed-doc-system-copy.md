---
id: "19ea"
title: the template is the source of an installed doc-system copy, and byte equality with the expanded template is the invariant
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-11
updated: 2026-09-11
---

## Context

decision-9f4b makes kisou the sole installer of the doc-system, so every
installed `{docs,Documents}/**/AGENTS.md` starts as an expanded template. It
never said which side leads afterwards. This repository answered by drifting:
the `notes/` and `reports/` `AGENTS.md` copies differ from their templates by a
rewrap only (issue-acc0), and on 2026-09-11 they measured as the only two
LF-only files among the copies — a tool rewrote them after checkout. Nothing
tracked it, and nothing said whether the fix was to rewrap the copies or to
adopt the rewrap into the templates. The kisou refresh design spec of
2026-09-11 put the direction question to the human.

## Options

- **The copy may lead and the template catches up** (Q-6 B) — makes every
  installed copy a candidate source, so a refresh can no longer tell drift from
  an intended edit.
- **Case by case** (Q-6 C) — a per-file judgment call each time, which is
  exactly what the instrument exists to remove.
- **The template leads** (Q-6 A) — chosen.

## Decision

The template is the source of an installed doc-system copy.

- Nobody edits an installed `{docs,Documents}/**/AGENTS.md` copy directly. A
  wanted change goes into the template first and reaches the copy through
  refresh.
- The invariant is **byte equality** between the copy and the expanded
  template, enforced up to line endings, a byte-order mark, the count of
  blank lines between two sections, and the text before a target's first
  heading — the preamble, which the check reports as a note and never
  writes; counted by the whole-branch review on 2026-09-11 and corrected
  here the same day, before this ADR left its branch. The first two
  exemptions are the spec's, the fourth the review's;
  the third was added at the plan stage on 2026-09-11 and approved by the human
  at the plan's review gate, because comparing trailing blank lines makes a
  `replace` on a file's last section never converge — the trailing-newline
  normalization trims what `apply` writes — which is a permanently failing
  check, and so a permanently failing hook, on a tree nobody can level.
- A difference that is **only line-wrapping** is a divergence, and is proposed
  for replacement: it breaks the invariant that makes a copy trustworthy.
- An **author-added section** — a heading the template does not have — is kept
  and reported, never written and never moved.

## Consequences

- This repository wires the check as a pre-commit hook, so a template body edit
  and the `kisou migrate` that levels this repository's copies are one commit
  from now on.
- Every template must be markdownlint-clean as expanded, because the copies are
  linted with `--fix` and the templates are not — that asymmetry is the
  standing drift generator issue-acc0 records.
- A copy differing from its expanded template only in the count of blank lines
  between two sections is not reported. That is the price of convergence, and a
  rewrap does not reach it.
- Downstream repositories enforce the invariant by wiring `$KISOU` into their
  own hook, or not at all; kisou installs no hook on their behalf.
