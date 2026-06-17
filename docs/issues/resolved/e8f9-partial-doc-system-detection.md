---
id: "e8f9"
title: kisou pre-flight detection is binary for the doc-system (no partial state)
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-06-17
---

kisou's migrate pre-flight detection treats the doc-system as binary:
"`{docs,Documents}/AGENTS.md` and per-type files present ⇒ installed;
absent ⇒ install everything." Real repos can sit in **partial states**
— e.g., `docs/issues/deferred/` and `docs/issues/resolved/` exist but
`docs/AGENTS.md` and `docs/issues/AGENTS.md` do not (this was the
state of `dotskills` before the kisou migrate at commit `7558bb8`).

The current rule classifies that as "not installed" and runs a full
install. It happened to work cleanly on `dotskills` because:

- `mkdir -p` is idempotent — the existing status subdirs were
  preserved.
- kisou's "leave existing scripts / `docs/superpowers/` alone" rule
  saved the other custom paths.

But the rule's coarseness could surprise a future user. Examples that
would behave oddly:

- A repo with `docs/issues/in-progress/` (non-standard status subdir)
  — kisou wouldn't recognize / preserve it specially.
- A repo with `docs/requirements/` populated but no `AGENTS.md` — kisou
  would drop its `docs/requirements/AGENTS.md` alongside the existing
  files (probably fine, but unverified).
- A repo with `docs/AGENTS.md` present but no per-type files — kisou
  currently sees "installed" and skips the per-type files entirely.

## Suggested fix

Make detection finer-grained — distinguish "no doc-system",
"partial doc-system" (some files / dirs present, others missing), and
"full doc-system". On partial, list what's present and missing,
propose to add only what's missing, surface non-standard subdirs for
the user to keep / move / drop.

Adjacent to `5e7f-kisou-template-upgrade-path` but distinct: that one
is about evolving the template after a scaffold; this one is about
detecting incomplete initial installs.

## Resolution

Doc-system detection in migrate is now three-state (`none` / `partial` /
`full`). On `partial`, kisou lists present vs. missing artifacts and adds only
what is missing, and surfaces non-standard subdirs as kept + naming-exempt (per
issue `543b`). See `SKILL.md` Step 3 (migrate).
