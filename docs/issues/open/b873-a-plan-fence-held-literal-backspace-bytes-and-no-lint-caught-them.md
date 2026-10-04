---
id: "b873"
title: a plan fence held two literal backspace bytes where `\b` was meant, and no lint caught them
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-51

The `shoki-seat` plan's fence 5 (How a batch is verified, check 5) held two
literal backspace bytes (0x08) where `\b` was meant, so the check failed on
correct code at batch A's boundary. It was the word-boundary repair the plan
review had asked for (anchoring a negation filter, see
`docs/notes/authoring-a-passage-plan.md`), typed through a tool that turned
`\b` into a control character. The cold read and the plan review did not see
it, because the byte is invisible in the editor and in `Read` output; it was
found with `cat -A` and confirmed with `grep -P '\x08'`.

`passage-check.js lint` accepts control characters in a fence. A plan lint
that rejects every control character other than tab and newline would have
caught it. Kin issue-4210 (two lint checks the `O`-needle set deserves).

Carrier topic: `passage-check-hardening`.
