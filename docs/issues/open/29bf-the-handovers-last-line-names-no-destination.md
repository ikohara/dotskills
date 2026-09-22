---
id: "29bf"
title: the handover's last line names no destination
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-65

The outgoing Kanri's closing line — "Kanri hands over … handover written" — is
followed by nothing. The successor's id reaches the human only by running
`tanto`, and that is also the window in which a second Kanri can be spawned. So
the one action the human takes to find out where the run went is the action the
launcher most wants them not to take just then.

An `attention` request raised by the successor's own first act, carrying
`kanri: <name> — claude attach <id>`, closes both gaps at once: the human is
told where the run went without asking, and the reason to run `tanto` inside the
double-spawn window disappears.

This needs the design's word on the notice mechanism's vocabulary, not only a
line in a role file — which is why it sits here beside the launcher-side
successor check rather than being written as a fix.

Related: decision-345b (the handover fires on its signal and the successor is
spawned), decision-1c07 (the spawner is the notifier), issue-7202 (the
launcher-side successor check's own deferred residues).
