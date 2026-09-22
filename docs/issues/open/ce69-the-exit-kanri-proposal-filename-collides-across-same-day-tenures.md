---
id: "ce69"
title: the exit-kanri proposal filename collides across same-day tenures of one window
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-46

`<date>-<name>-proposal.md` names the exit-kanri proposal by calendar date and
bare window name only. It has no room for a second tenure of the same name on
the same day — which is exactly what a reboot-driven same-window handover
produces, and what this topic produced.

That tenure avoided overwriting a never-rewritten file by borrowing the `-2`
suffix documented for post-close learning. The borrowing worked, but the
mechanism was designed for "what a close teaches after the first proposal", not
for "a second same-day tenure of the same window", so the suffix now means two
different things depending on which file carries it.

The decision is what the filename keys on when the window name recurs same-day:
the transcript path (the identity the landed design already treats as
authoritative, decision-8320), or a plain sequence number with the `-2` suffix
reserved for its original meaning.
