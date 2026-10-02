---
id: "e525"
title: a same-window handover keeps no trail of the predecessor's transcript path, so `--share` skips it
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-4

A same-window Kanri handover rewrites the roster's one Kanri row in place,
and neither the roster nor the ledger keeps the predecessor's transcript
path once it is overwritten — unlike a rename, which the Events log records.
At a plan close on 2026-09-22, two predecessor tenures'
transcripts (`dotskills-10 [58f333]`, `dotskills-39 [e78b52]`) could not be
located for the close's `--share` measurement, which ran over the 13
transcripts the session could find (95%) and skipped two Kanri tenures'
usage entirely.

A `resumed:` or `handover accepted:` Events line already names the old
name; it does not name the old transcript path, which is the one thing
`--share` needs. The remedy to decide: have that Events line carry the old
transcript path. Issue-9ca6 covers the archive side, not this one.
