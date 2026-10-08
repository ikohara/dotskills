---
id: "652f"
title: the shoroku check brief has no outcome by destination before its lines
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-ec9eae4

Item #45 of that copy.

The check brief lists each adopt item as one long line in the
recommendation's order. A human answering by exception needs the outcome by
destination first — which files the apply will create or edit, grouped, as a
short table before the lines, or the lines grouped by destination. At the
close that reported it, that digest was made by hand.

`templates/shoroku-brief.md` orders the lines by the recommendation's numbers
and carries no digest by destination. Adding one is a change to the brief's
form, which `SKILL.md`'s "The brief's form" checks, so it is a decision — and
the one that bounds the brief's size is issue-76df's.

Related: issue-76df, issue-4aab.
