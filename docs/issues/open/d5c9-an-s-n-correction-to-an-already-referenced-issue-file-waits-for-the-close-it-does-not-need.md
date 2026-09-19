---
id: "d5c9"
title: "an `S-n` correction to an already-referenced issue file's own prose waits for the topic's close, though nothing else requires it to"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: session 2026-09-17

A procedural gap in the close-gated shoroku model, found in kuchidome's
`residency-retention` run: that topic's Kaiseki reports had already
diagnosed and fixed a symptom that a later Kikaku decision still referred to
as "the stall". The underlying `S-n` rows carried the real, corrected
finding, but the *issue file's own prose* stayed unrevised until the topic's
close, because nothing in the recommend/check/apply cycle runs until T2. A
decision made between a topic's opening and its close reads whatever the
referenced issue file says today, not what the ledger's own pending rows
already know — so a stale issue file can actively mislead a decision made
mid-topic, not just sit outdated.

Worth considering whether some class of `S-n` candidate — specifically, a
correction to an issue file another in-flight decision is actively citing —
should get a lighter-weight interim write instead of waiting for the topic's
close, rather than running the whole recommend/check/apply cycle early.

Reported by Hosa `kuchidome-6b [d17de0]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-15 (delayed in transit — original addressee no longer live; relayed
by this repository's own Kanri 2026-09-17).
