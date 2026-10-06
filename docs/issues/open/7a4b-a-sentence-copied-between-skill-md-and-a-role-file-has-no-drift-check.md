---
id: "7a4b"
title: A sentence copied between SKILL.md and a role file has no drift check
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-99

The seat check's sentence about `wake` errors lives in
`skills/tanto/SKILL.md` ("The address") and again, word for word, in
`skills/tanto/roles/kanri.md` ("Sending to a seat", the paragraph beginning
"Any other error from `wake`"). R-12 ruled the failed-wake count at the first
copy and the Replace row and left the second copy out. The boundary caught a
backticked word in the README, but nothing mechanical compares the two
copies; only a cold read of the rework prompt (R-13) kept them agreeing.

A sweep that lists the sentences `SKILL.md` and `roles/*.md` share, run at the
boundary beside the backticked-word sweep, would have named it.

Carrier: Kept — a shared-sentence sweep beside the plan's own fences; a
decision about the fences a plan writes, not about `passage-check.js`.
