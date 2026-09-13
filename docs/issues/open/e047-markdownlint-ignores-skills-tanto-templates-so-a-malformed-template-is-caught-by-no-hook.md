---
id: "e047"
title: "`.markdownlint-cli2.yaml` ignores `skills/tanto/templates/**`, so a malformed template is caught by no hook in this repository"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the tanto-cost run's batch D task 15 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-D-report.md`, "Shoroku candidates".

`.markdownlint-cli2.yaml` ignores `skills/**/templates/**` — a deliberate,
repository-wide rule (issue-6aa8 documents the ignore list; the templates
under `skills/tanto/templates/` are one of the directories it covers). One
consequence, not previously recorded: nothing else checks a template's
Markdown *structure* either. A broken heading level, an unclosed fence, or
a malformed table in a file under that path passes `./scripts/lint.sh`
clean, because the one hook that would notice is the one this ignore rule
turns off for exactly that path.

Measured on the tanto-cost run's batch D: task 15 created
`templates/kikaku-decision.md`, and its reviewer had to read the file's
structure by hand to confirm it — one H1, three H2s, no skipped heading
level, no tables or fences to malform, every line under 80 columns — because
no automated check would have caught a defect if one had been there.

Not urgent and not unique to this file: every template under
`skills/tanto/templates/` and `skills/shoroku/templates/` (if any) shares
the same blind spot. A narrower structural check — heading-level
continuity and fence-balance only, skipping the placeholder-content rules
that made markdownlint unsuitable here — would close it without reopening
issue-6aa8's original problem.

Related: issue-6aa8 (the ignore rule this gap is a consequence of).
