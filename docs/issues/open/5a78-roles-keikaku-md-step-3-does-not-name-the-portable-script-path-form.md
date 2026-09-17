---
id: "5a78"
title: "`roles/keikaku.md` Step 3 does not name the portable form for the instrument path, and a drafter dispatch reintroduced an absolute personal path"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Measured on `shoroku-at-close`, and caught twice independently. That topic's
Keikaku dispatched its `plan.draft` subagent with an absolute path under the
personal config directory for `passage-check.js` in every task's Verify step —
in violation of `AGENTS.md`'s "Never do: ... user-specific paths". Keikaku's own
dry run caught it before dispatching `plan.review`, and `plan.review` caught it
again independently as its own first finding. Both landed on the same fix, the
portable form `tanto-sweep-2` established:

```text
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" ...
```

`roles/keikaku.md` names neither `$TANTO` nor that form anywhere, so the next
Keikaku's dispatch prompt can reintroduce the absolute path exactly as this one
did. One line in Step 3, where the drafter is dispatched, closes it.

That the defect reached two instruments before it was stopped is the argument
for stating the form rather than relying on the dry run.

A process gap, not a user-stated need, so no paired requirement.
