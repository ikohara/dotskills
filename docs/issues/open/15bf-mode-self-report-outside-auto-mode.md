---
id: "15bf"
title: mode= self-report in the tanto handshake outside auto mode
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-06
---

The tanto handshake line carries `mode=`, which a session fills with `auto`
when its system prompt says auto mode is active and `unknown` otherwise.
Whether a session in the default or another permission mode can report
anything better than `unknown` is not known.

Observed 2026-09-06: the envelope of a cross-session message carries a
`from-mode` attribute (`prompting` for a session in default mode), so the
receiver may already know more about the sender's mode than the sender can
state about itself.

To do: at the first Jisso handshake under a real plan, compare what Jisso
reports in `mode=` with the envelope's `from-mode`. If the envelope is
reliable, Kanri's not-`auto` warning for Jisso can key on the envelope and
`mode=` can be dropped from the line; that is a design update to the
handshake.
