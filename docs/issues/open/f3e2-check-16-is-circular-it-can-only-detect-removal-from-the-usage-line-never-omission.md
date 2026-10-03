---
id: "f3e2"
title: "check 16 is circular — it can detect a subcommand removed from the usage line, never one added to the script and omitted from it"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-03
---

Source: session 2026-09-14

Found by the tanto-cost run's batch F task 21 reviewer (2026-09-14),
recorded in `.tanto/tanto-cost/batch-F-report.md`, "Rulings" and "Shoroku
candidates" (landed as written under R-30's resolution; not fixable inside
this plan).

Check 16, added by task 21 to
`docs/notes/tanto-consistency-checks.md`, greps the usage line for a
hardcoded alternation of the same seven subcommand names the usage line is
supposed to contain, and expects a count of `7`. The check's own prose
states its purpose: "a subcommand the script implements and the usage line
omits is invisible" — but the mechanism it uses cannot see that failure
mode at all. An eighth subcommand added to `passage-check.js` and left out
of the usage line leaves the alternation's count at `7`, exactly the
passing value, because the check only ever looks for the seven names it
already knows to look for. It would catch a subcommand's name being
*removed* from the usage line — the count would drop below `7` — but never
one being *added and omitted*, which is the failure its own sentence names.

Not fixable inside the tanto-cost plan: `docs/notes/tanto-consistency-checks.md`'s
passage under task 21 has already landed.

The non-circular form, named by the reviewer: count the script's own
`run*`-shaped dispatch functions (or whatever internal registry lists the
subcommands `passage-check.js` implements) and expect that count to equal
the usage line's own count — two independent counts compared against each
other, rather than one count compared against a copy of itself.

Related: R-30, issue-c526, issue-9d84 (the same run's other consistency-note
premise gaps).

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
