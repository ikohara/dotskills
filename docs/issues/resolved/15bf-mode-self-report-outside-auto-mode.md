---
id: "15bf"
title: mode= self-report in the tanto handshake outside auto mode
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-10
---

The tanto handshake line carries `mode=`, which a session fills with `auto`
when its system prompt says auto mode is active and `unknown` otherwise.
Whether a session in the default or another permission mode can report
anything better than `unknown` is not known.

Measured 2026-09-06, at the first Jisso handshake under a real plan: the
envelope's `from-mode` attribute is **not** the sender's permission mode. Jisso
reported `mode=auto` in its handshake while the envelope of the same message
carried `from-mode="prompting"` — and `prompting` was the value on every Sekkei
message too, in both directions, with no permission prompt observed anywhere in
the run. The attribute most likely means "the sender is mid-turn", not "the
sender is in the default permission mode". Only the `mode=` self-report carries
the permission mode, so the envelope cannot replace it.

This closes the comparison the issue was opened to make, and it removes the
option of keying Kanri's not-`auto` warning on the envelope: there is nothing
there to key on.

To do: the original question stands and is now the only one left — can a session
outside auto mode report anything better than `unknown` about its own permission
mode? If it can, `mode=` becomes informative in every direction rather than only
when the answer is `auto`. If it cannot, the field stays a one-bit signal and
Kanri's warning stays keyed on the absence of `auto`. Measure it the next time a
role is started outside auto mode.

Resolved by the tanto-sweep plan's task 13 (P13.3), which rewrites
`SKILL.md`'s `mode=` paragraph: `unknown` is the measured ceiling, not a
gap — a session outside auto mode carries no statement of which permission
mode is active, only the harness's line that tools run behind a
user-selected one, so nothing better than `unknown` can be reported and
Kanri's warning stays keyed on the absence of `auto`, as measured on
2026-09-10.
