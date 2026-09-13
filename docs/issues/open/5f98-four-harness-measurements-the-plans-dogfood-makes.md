---
id: "5f98"
title: three of the plan's four harness measurements contradicted the design; one (a definition's effort) is still open and needs a different instrument
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-14
---

Deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
2). Four facts about the harness were assumed by the design and measured at
task 23 of the tanto-cost plan (2026-09-14), under a `human-needed:` grant
(a definition loads only at session start, so none of the four was
measurable from any already-running session): recorded in
`.superpowers/sdd/2026-09-12-tanto-cost/task-23-report.md` and
`.tanto/tanto-cost/batch-F-report.md` ("The dogfood — three of four
measurements contradict the design" and "Deferred item 2, scored").

**Q1 — does a new session see a definition written moments before it
starts? Closed, confirms.** A fresh session listed 19 agent types: six
built-in plus all thirteen `tanto-*` (the twelve kinds plus the probe),
checked name by name. Caveat: a **subagent's own** agent-type list, as
opposed to a session's, still shows zero `tanto-*` — a subagent context is
not a session, and this does not reopen the question, but it bounds what
the confirmation licenses.

**Q2 — is a definition's `effort:` key honored by a dispatch that names it?
Still open, and leaning negative.** The probe dispatch bound the right
kind and model (its own meta records `{"agentType":"tanto-probe-effort",
…, "model":"haiku"}`, resolved to `claude-haiku-4-5-20251001`), but the
subagent's own transcript shows `perTurnEffort: null` and **no `effort` key
at all** — by the test the spec itself chose (a transcript-field read),
the effort half of decision-03f9 is unverified. The same meta block that
omits any trace of effort records the model twice, which is what tips this
from neutral to weak negative evidence: the harness demonstrably writes
down what it bound, and effort left nothing. **The instrument itself was
the wrong one** — a subagent's transcript is not where a bound effort would
show up; closing this needs a **behavioral** probe (a task whose measurable
output differs by effort level), not another transcript-field read.

**Q3 — which transcript field follows a `/effort` change? Closed —
`effort`, not `perTurnEffort`; `perTurnEffort` stays `null` in both the
session's and the subagent's transcript.** An attached verdict — that this
overturns the handshake's stated read order and the actual behavior is the
reverse — was traced by the batch F reviewer and **withdrawn**: the shipped
command at `skills/tanto/SKILL.md:287` was run against synthetic records
including the exact measured shape (`perTurnEffort: null` + `effort: "low"`),
and it correctly printed `effort=low`, because its `sort -r` fallback logic
requires a **quoted string** and an unquoted `null` never enters the match
set. **The handshake is not broken.** What is wrong is two sentences of
prose — `SKILL.md:199-201` and `:302-306` say the fallback fires "when
[`perTurnEffort`] is **absent**", but the measured case has it present and
`null`; the implemented (and correct) condition is "absent **or not a
quoted string**". A future editor who "corrected" the command to match the
sentence would break it. This prose fix is a candidate for the
whole-branch review's fix wave, not this issue.

**Q4 — does `/clear` change a session's name? Closed — no.** `/clear` kept
both the name and the `[ref]` (`dotskills-68 [ad0c6e]` before and after)
and changed only the **transcript path**
(`9e87f2d9-…` → `c34cb3d0-…`) — the inverse of a resume, which keeps the
transcript and changes the name. `SKILL.md`'s Resuming section calls the
transcript path "the identity that survives" a resume; `/clear` is the one
place that identity does not survive, worth naming explicitly wherever the
skill discusses a Kikaku or Hosa row surviving `/clear`.

Not closing this issue: Q2 stays open, and its resolution needs a new
measurement design (a behavioral probe), not a re-run of this one. The
effort half of decision-03f9 remains unverified.
