---
id: "d0d7"
title: the Kept default for a row whose gone items all read `no commit found` was read two ways and overridden by the human on all 33 rows
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-89

The tanto-issue-triage round rules say, in rule 1's last sentence and the
spec's Deferred item 5, that "a row whose gone items all read `no commit
found` is Kept with that fact noted". The sentence sits inside the Landed
rule, and nothing says which destinations it closes.

- **Two readings** (S-78, S-94). Read as a destination, it bars Assigned and
  Merged too. Round 1's recommendation held 20 such rows under Assigned
  (29fd, 2d69, 38f5, 4210, 483c, 4d53, 52ef, 58fe, 647b, 7c11, 87fd, 91f6,
  9f2c, a4c7, a4e2, b1e4, c391, c841, d0f4, ebd9), so the reading decided 20
  of its 50 items. R-7 read it as closing Merged and Assigned; R-10 left
  Re-hung out of it.
- **The carrier destinations closed to most of the pile** (S-89). With R-7,
  Landed, Assigned and Merged are closed to every such row: 22 of round 1's
  50, 17 of round 2a's 40, 16 of round 2b's 39. An issue whose gap is open
  and plainly belongs to a carrier topic stays under Kept, the carrier named
  in its Reason only.
- **Review passes either reading** (S-90). The first reading (Assigned and
  Merged allowed) was reviewed clean by both opus reviewers and still
  overruled; a rule read two ways passes review under either.
- **The human overrode the default in bulk** (S-111). The default covered
  33 rows that the recommender itself said "would otherwise be Assigned" (or
  Merged), and the human moved every one of them (24 + 1 in sitting 1, 3 in
  sitting 2, 5 in sitting 3; R-14 supersedes R-7 and R-10 for them). A
  default the human overrides in bulk is the wrong default.

Decision needed before the next triage: the round template and the spec say
which destinations the sentence closes — most likely Landed only, the case
decision-f706's honesty concern is about. Beside issue-8aa6 (hand-Landed
rows) and issue-d0a3 (whether a fuzzier trace is worth building).
