---
id: "7bd1"
title: "`record --peer-reading` accepts only a single-token name and drops a multi-word one"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-29

The ledger assigned S-29 twice; this is the row whose source is
`batch-A-verdict.md`.

`skills/tanto/scripts/boundary.js`'s `PEER` regex,
`^(\S+)\s+(\S+(?:\s+\[[^\]]+\])?)\s+(transcript:.*)$`, accepts only a
single-token name before the optional `[ref]` bracket. A multi-word session
name does not match, so the whole `record` call aborts ("record wrote nothing
— it did not find a --peer-reading that parses"), or the line has to be
dropped for the rest of the record to land.

At the bg-seat-ergonomics batch A boundary, both the Keikaku's roster name
(`bg seat ergonomics design [26bb75]`) and the batch's Jisso name
(`bg-seat-ergonomics bash invocation [e92e99]`) failed. The second call
dropped the Keikaku line so the mandatory record could complete; the reading
survived only because the roster's Residency table already held it.

The names the spawner now gives are hyphenated (decision-7c87), but a
human-renamed window, a tab seat, or a seat from before the spawner's naming
still breaks the parse. The fix: a name is any text before the optional
`[ref]` bracket and the `transcript:` field, with a test for a multi-word
name.
