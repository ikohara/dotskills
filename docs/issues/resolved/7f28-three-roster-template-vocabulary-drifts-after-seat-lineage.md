---
id: "7f28"
title: three roster-template vocabulary drifts after seat-lineage — an Events shape that misstates a /clear, an unreconciled second `cleared:` payload, and a Status value the enumeration omits
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-23
---

Source: shoroku seat-lineage

Three small drifts landed on the roster template and its enumerations when the
`cleared` vocabulary generalized (decision-ded8). They are one reading, so they
are one issue.

**1 — the `cleared:` Events shape reads as if `/clear` renamed the window.**
`templates/roster.md`'s Events catalogue carries `cleared: <old name> → <new
name>`, but a `/clear` does not rename a window, so the rendered line will read
`cleared: dotskills-a1 → dotskills-a1`. A shape that carries information would
be `cleared: <name> [<ref>] — <old role> → <new role>`.

**2 — a second `cleared:` payload now coexists with it, unreconciled.** The
Kept-Kanri fix of the `seat-lineage` fix wave introduced `cleared: stale
transcript, row rewritten in place` in `roles/kanri.md`, and nothing reconciles
that form with the template's. The reviewer's own recommendation was to raise
it as a shoroku item rather than edit it inside the wave.

**3 — `idle since <HH:MM>` is an unlisted seventh Status value.**
`roles/kanri.md` writes `idle since <HH:MM>` into the roster's Status column,
which the enumerations in `SKILL.md` and `templates/roster.md` do not list.
Either the enumeration gains the value, or the fact moves out of the Status
column.

All three sites are under `skills/tanto/`, outside `docs/`, which is why they
are carried here rather than fixed by a write-out.

Related: issue-e18b is the same class of enumeration drift in `SKILL.md`'s
Artifacts row; issue-de29 is the Stage column's own missing value.

A template-consistency gap, not a user-stated need, so no paired requirement.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 2.8).
Item 1: the handshake-by-name route to `cleared` retired, and the `cleared:`
Events shape left `templates/roster.md` with its last writer; `cleared` has
two routes left, `release:` and a `no-role` reply. Item 2 was already gone
from `roles/kanri.md`. Item 3: `idle since` is the suffix
`(idle since <HH:MM>)` of a `live` cell, which `roles/kanri.md` now says
Kanri appends and `SKILL.md`'s status list names beside the seven words.
