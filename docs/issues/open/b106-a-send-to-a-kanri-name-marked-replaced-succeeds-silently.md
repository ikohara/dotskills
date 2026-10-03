---
id: "b106"
title: a send to a Kanri name the roster has since marked `replaced` succeeds silently, so the recovery has no trigger
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-134

A Jisso sent its batch report's path to the roster's first data row as read
at that moment (`dotskills-kanri-1a08`). `SendMessage` answered
`success: true` ("in that session's inbox, not yet read"). When the
`close:` line arrived, the first data row read `dotskills-kanri-c38a`, and
`1a08` was marked `replaced`.

No error came back and no `no-role` fired, so the role file's recovery —
hold the line and re-send to the roster's first row, read fresh — had no
trigger. The boundary was accepted all the same (the verdict file exists);
how the successor came to read the report is in nothing the Jisso holds.

A report line to a replaced name is a delivery to a session nobody reads.
The Jisso learns of it only if it re-reads the roster at its next wake-up,
which the `close:` line happened to make it do. The recovery rests on a
signal that does not fire for this case; with a line that has an outward
effect, the loss would be silent.

Beside issue-c820 (resuming onto a live peer's bare name has no proactive
warning) and item 8 of issue-2f88 (the receiving side: a Jisso's sender
check). A decision: whether a sender re-reads the roster before every report
line, or the handover forwards lines that reach the predecessor.
