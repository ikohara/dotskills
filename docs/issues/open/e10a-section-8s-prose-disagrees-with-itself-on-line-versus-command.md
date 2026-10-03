---
id: "e10a"
title: "the consistency note's §8 prose disagrees with itself on line versus command"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-10-03
---

Source: shoroku tanto-project-config

Found by the Jisso of the `tanto-project-config` run at Batch B (2026-09-16),
parked as a plan-mandated quality minor on task 7 and carried as S-36 in that
run's ledger.

`docs/notes/tanto-consistency-checks.md` §8 is internally inconsistent after
Batch B on two counts:

- it counts its checks by "line", though the fifth check is now a five-line
  shell block, so "the fifth line" names something that is not a line; and
- the two sentences the plan's own passages added (P7.5's "the fifth line
  reads…" against P7.6's "…the fallback line the fifth command echoes")
  disagree with each other on whether the unit is a line or a command.

Beside the wording, the fourth §8 command carries no failure guard while the
new fifth one does; the note's prose explains the asymmetry rather than
resolving it. A wording pass plus a failure guard on the fourth command to
match the fifth's closes both.

Filed rather than fixed because both strings are byte-exact landed plan text,
and editing a check that a landed passage pins needs its own verification.

Related: issue-9d84 (the note's hand-maintained expected values go stale),
issue-f3e2 (check 16 is circular), issue-c526 (check 3 asserts a citation
pattern the design does not use) — the same class, all filed against this note.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
