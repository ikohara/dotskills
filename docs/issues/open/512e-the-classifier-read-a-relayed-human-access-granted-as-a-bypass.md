---
id: "512e"
title: "the classifier read a relayed `human-access: granted` as a bypass"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-47

The auto-mode permission classifier blocked Kanri's own attempt to relay a
`human-access: granted` line to a peer Jisso, flagging it as an "Auto-Mode
Bypass". The grant itself only routed the action through the human — exactly the
escalation path the Human access section prescribes — yet affirming that grant
was read as a bypass attempt in its own right.

Stopping and surfacing this to the human directly, rather than retrying with
different phrasing or different tools, is what the permission-laundering
guidance calls for, and is what happened. The practical effect was that the
tanto grant mechanism was short-circuited for this one case: the human resolved
it by going straight to the Jisso's own window, through no Kanri grant at all.

The question is whether a `human-access: granted` line needs a channel other
than a peer `SendMessage` when the classifier cannot distinguish "do it myself"
from "tell a peer the human may do it". Every grant the protocol has today
travels as peer prose, so the failure is not specific to this one line.

Related: issue-c30e (Hosa's standing grant, promised at the handshake but never
given there) — the same section's other unstated edge.
