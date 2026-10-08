---
id: "af21"
title: The carrier rule is in no skill text
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-08
---

Source: shoroku run-owned-seats S-108

The rule that a close's recommender names a Carrier for each issue it files —
a topic the order places, or `Kept` — and reads the liveness table beside the
pile is written only in Kikaku decision files of 2026-10-03, 2026-10-05, and
2026-10-06, which are untracked and local to one machine. No text of the tanto
skill (the recommend dispatch in `roles/kanri.md`, "Session exit" in
`SKILL.md`) and none of the shoroku skill names a Carrier or the table.

The rule was applied at the shoki-seat close, where the decision file was a
source row the recommender read (36 lines with `Carrier` and 28 with `Kept` in
that recommendation), and dropped at the run-owned-seats close, where it was
not (three hotfix-lane carriers, no `Kept`, no liveness reading, about fifty
issue files), until the human's kessai answer asked for the lines. The same
holds for that decision's by-hand runs of `scripts/issue-liveness.js` and
`scripts/issues-by-finder.js` at each close, the condition issue-de42 waits
on.

To decide: where a standing per-close rule lives, so that whoever writes the
recommender's dispatch carries it. The carrier set changes with every order
decision, so the text has to point at the order's holder and cannot list the
topics. Kin: issue-de42 and issue-13a1.

Carrier topic: `tanto-feedback`.

2026-10-08, `roster-ledger`'s close (shoroku roster-ledger S-12): read from
`docs/issues/` on `main` on 2026-10-07, 54 of the 138 issues created since the
triage (2026-10-02 or later) carry no carrier line at all — the rule's absence
from the skill text, measured.
