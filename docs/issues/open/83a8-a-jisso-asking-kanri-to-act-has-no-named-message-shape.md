---
id: "83a8"
title: a Jisso asking Kanri to act has no named message shape
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-40

Batch B2's task 12 (Verification 7, a `SendMessage` to a background session)
needed the *sending* session to be Kanri's own: a dispatched subagent cannot
substitute, since a reply routes to the sender's own conversation regardless of
which subagent nominally calls the tool. The Jisso asked Kanri to perform that
send, in a plain cross-session message — not through `human-needed:`, not
through a batch report's Rulings section, not through any named channel.

Kanri judged the request in scope (bounded, reversible, no escalation, directly
serving a task the plan's own Batches table assigns) and did it. But
`SKILL.md`'s Messages section names no shape for it, and the one-boss rule's
text ("Only Kanri messages Jisso") anticipates a Jisso *reporting* to Kanri, not
asking Kanri to *act*.

What needs deciding: the shape of such a request, its limits (what a Jisso may
and may not ask the controller session to perform on its behalf), and where the
rule is stated — the Messages section, or `roles/jisso.md`'s own text on what a
task whose implementer must be the controller session is permitted to ask for.

Related: the design's own record of such a task is in design-4807, "What the
executor's loop assumes"; decision-b59a (a wake-up is spent only on a decision)
bounds what may reach Kanri as a message at all.
