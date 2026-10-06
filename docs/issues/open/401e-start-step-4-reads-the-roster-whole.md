---
id: "401e"
title: Start step 4 reads the roster whole, so an unshrunk roster starts a successor 70000 tokens in
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-07
---

Source: shoroku tanto-issue-triage S-34

A successor Kanri's Start cost about 70000 tokens of context before any act
of its own. `.tanto/roster.md` had grown to 376 lines and 66 KB because the
archive move had been left undone across five tenures, and Start step 4
cold-reads the roster whole. The tenure began at `context=158856` and
crossed its own ceiling (`baseline=88518 + 2 x 65000 = 218518`) at
`context=220131`, after only the archive move and one topic opening — a
handover signal 4 inside the first hour with no batch in flight.

A roster that a close does not shrink makes every later tenure's ceiling a
hole. The cause, the undone archive move, is already filed: issue-fb90 (its
finding that the roster's Events log is never pruned) and issue-2f88 (item
1, the archive move's procedure). The proposal here is a change to Start
step 4 itself: read only the table rows of live seats (a `grep` for
`| live |`) and the last Events lines. That changes the Start sequence, so
it is a decision.

**2026-10-07, from inbox 2026-10-06-kanri-context-cost-and-close-gaps — the
handover's reads, too.** One spawned Kanri began at `context=148581`
(baseline 89,220, ceiling 219,220) after reading `SKILL.md` and
`roles/kanri.md` once, and was at 203,988 after accepting the handover, four
acks and the Measurements rows: about one act of room was left when the
human's first answer arrived. The 82 KB ledger and the 33 KB roster were
each read in part and still cost about 25 KB of context.
`templates/kanri-handover.md` names the ledger section to read for open
questions and rulings, but none for Progress, the Session events tail or
Measurements, and says nothing about reading the roster by its table
headings. The report's two levers, both in the handover template: name the
sections to read (Progress, Open questions, the Session events tail,
Measurements), and read the roster with `Grep` for its headings.
