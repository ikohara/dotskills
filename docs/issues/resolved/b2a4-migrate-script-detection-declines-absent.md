---
id: "b2a4"
title: migrate auto-detection silently declines absent scripts
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-06-17
---

The migrate-mode pre-flight detection rule for `scripts`:

> **Existing scripts** → set `scripts`: top-level `{setup,Setup}.{bat,sh}`
> or `{run,Run}.{bat,sh}`, and `{scripts,Scripts}/{build,Build,test,Test,
> lint,Lint}.{bat,sh}` each imply the matching `scripts=name` value.

works fine when scripts already exist — kisou wires them up. The
**implicit reverse** rule is the bug: an *absent* script is treated as
a *declined* one. No follow-up question is asked, so the user is never
given a chance to opt into a script they don't already have.

This is inconsistent with `dirs`, which genuinely is "a fact about the
existing project" (an absent `src/` means the project has no source
dir, end of story). `scripts=`, by contrast, expresses **intent** —
"the project should have this script" — not a fact. A user may very
well want to ADD a script that wasn't there before.

Discovered concretely on `dotskills` (commit `7558bb8`): the migrate
created `scripts/bootstrap.{bat,sh}` (mandatory) but didn't ask whether
the user also wanted `setup` / `run` / `build` / `test` / `lint`. The
user actually wanted `lint` (a thin wrapper around
`uv tool run pre-commit run --all-files`) but had to add it by hand
after the migrate.

## Suggested fix

Split the `scripts` question in migrate mode:

1. **Detected** (auto-selected from disk; surface for confirmation).
2. **Add anything else?** — explicit prompt for the not-yet-present
   slots.

Phrasing: present the detected scripts as a pre-checked list and ask
"any others to add?" Today the spec implicitly skips the second
prompt, treating absence as "decline."

`dirs` keeps its current behavior (an existence-based fact, not
intent).

## Resolution

migrate's scripts question is now two-part: confirm the detected scripts, then
explicitly ask about the not-yet-present slots so a user can opt into a script
the repo lacks. `dirs` keeps its existence-based behavior (a fact, not an
intent). See `SKILL.md` Step 3 (migrate).
