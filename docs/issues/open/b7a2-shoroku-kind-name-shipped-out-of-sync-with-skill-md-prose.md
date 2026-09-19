---
id: "b7a2"
title: shoroku kind name shipped out of sync with SKILL.md prose, no mid-tenure agent-list recheck
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: inbox 2026-09-17-shoroku-kind-name-drift-no-mid-tenure-recheck

Two related gaps, reported from kuchidome (a different repository running
the same tanto skill), corroborated here:

1. `templates/tanto.json`'s `subagents` map shipped `shoroku.recommend`/
   `shoroku.apply` as two separate keys while `SKILL.md`'s own prose named
   a single `shoroku` key — the two shipped artifacts disagreed. In this
   repository the split is intentional: it is exactly what the in-flight
   plan `docs/superpowers/plans/2026-09-15-shoroku-at-close.md` lands onto
   `skills/tanto/**`, batch by batch (Task 1's own commit subject: "the
   shoroku kind splits in two and twelve kinds become thirteen").
2. A session's own available-`subagent_type` list can change mid-tenure
   with no protocol-level warning, because `$CLAUDE_CONFIG_DIR/agents/` is
   shared machine-wide (across every repository and every session) and the
   skill's Start sequence only writes/counts definitions once, at a role's
   own start. Two independent triggers observed the same day: a
   cross-repository race (another repository's own session, mid-split,
   overwrote shared definitions), and a same-repository trigger — this
   repository's own Kanri moves the shared tree between `main` (pre-split
   `tanto.json`) and the topic branch (post-split) for unrelated reasons
   mid-tenure, so both `tanto-shoroku.md` and
   `tanto-shoroku-recommend.md`/`tanto-shoroku-apply.md` coexisted on disk
   at once, each "correct" for whichever branch wrote it.

Proposed fix: once the split lands in this repository, reconcile the two
artifacts for good; and state in `SKILL.md`, wherever a `subagent_type`
dispatch is documented, that a long-tenured session should re-check its own
current available-agent-types before a `shoroku`-kind dispatch specifically
(the one kind now known to have drifted), or more generally whenever its
own tenure has grown long since its Start sequence ran.

Reported by `kuchidome-eb [e0615a]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-17.
