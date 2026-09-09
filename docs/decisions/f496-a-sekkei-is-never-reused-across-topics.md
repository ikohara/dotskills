---
id: "f496"
title: a Sekkei is never reused across topics
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-09
updated: 2026-09-09
---

## Context

Under tanto a Sekkei session runs one topic's spec dialogue, writes the spec
and the plan, and answers Kanri's cold read. Twice the resident Kanri gave a
Sekkei that had finished one topic the next one instead of asking the human
to create a new session: review-brief went to the boundary-rules Sekkei, and
that worked at no visible cost, which design-4807 recorded as a measured fact.
On 2026-09-09 Kanri proposed the same for the requirement-extraction Sekkei
and the context-cost topic, and first ruled a middle rule — reuse only when
the old session's context is short (the context-cost ledger's `S-1`). The
human then set the rule this record keeps, in the context-cost spec dialogue:
"Sekkei って、どうせ human との対話が必要になるから、再利用したって human の
手が必要になるでしょ".

The cost the human named is context: a Sekkei that carried a large spec, a
plan, two reviews, and a dry run re-reads all of it at every wake-up of the
next topic, while everything a successor needs from it is on disk — the
committed spec and plan, the dialogue record, the reviews, the spec inputs
Kanri writes. The Account & Usage measurements of the same day (the
context-cost design, "The cost, measured") put a session's charge on its
context length first.

## Options

- **Reuse a finished Sekkei for the next topic** when one is live, as the
  Delete table allowed ("or keep it for the next spec"), saving a session
  creation.
- **Reuse only when its context is short**, Kanri judging from the previous
  topic's size — the `S-1` rule of 2026-09-09.
- **Never reuse across topics**: a Sekkei exits when its plan is landed and
  cold-read, and the next topic gets a new session.

## Decision

Never reuse across topics. Reuse spares the human nothing, because the next
spec needs the human's dialogue whether the session is old or new, and the
context a kept session carries is the one cost the human is not asked to
pay in hands. The other reuse cases were reviewed from the same viewpoint
and stand: Jisso within a plan (a replacement needs the human's hands and
the in-plan state is in the SDD ledger); Kanri across plans (req-04f5 and
decision-de63, the between-plans work having no other owner); Kaiseki per
case; and a resume after an editor restart, which is the same context under
a new name and not a reuse. The context-cost ledger's `S-1` is superseded by
this record.

## Consequences

- The Delete table's Sekkei row loses its last clause: Sekkei is done when
  its plan is landed and cold-read, and is deleted after its exit shoroku;
  the Create table is unchanged, and the human may still decline a Sekkei.
- One more session creation per topic, and one more exit shoroku; the
  previous topic's record reaches the successor through the spec inputs,
  the dialogue file, and the committed documents, as it did for the
  requirement-extraction Sekkei created fresh on 2026-09-09.
- design-4807's bullet that a kept Sekkei given the next topic costs none is
  reversed at the context-cost T2; the review-brief reuse stays recorded as
  the case that made the cost invisible because the previous topic was
  small.
- Related: req-04f5 (the human is interrupted only at defined checkpoints;
  the spec dialogue is one), decision-de63, design-4807, the context-cost
  design of 2026-09-09.
