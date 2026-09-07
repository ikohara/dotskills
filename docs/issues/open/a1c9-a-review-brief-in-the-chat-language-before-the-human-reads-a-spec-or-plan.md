---
id: "a1c9"
title: a review brief of the decisions, in the chat language, before the human reads a spec or plan
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-07
---

Under `tanto` the human's checkpoints are the spec and the plan: Sekkei
writes each, the human reviews it in Sekkei's window under the standing
grant, and the plan is committed on the human's OK (decision-1f5f keeps
req-3c4d's confirmation at that approval and at the escalated shoroku
items). Each document is long English prose — the kanri-lifecycle spec was
about 1,100 lines and its plan 3,400; the boundary-rules spec is 700 — and
the `wayaku` translation the human reads is the whole document again in
Japanese (about 1.2M sonnet tokens for the previous pair). The human said on
2026-09-07, at the boundary-rules spec review, that reading the full
translation of every spec and plan is too much, and asked for a pre-read: a
third party lists only the points that need the human's judgment, concisely
and in the language of the chat, so the human confirms those and reads the
rest only where a point sends them. The brief is language-neutral by design:
it takes the chat's language as the repository's i18n convention already
prescribes for user-facing text, and Japanese is only this human's case.

What such a brief would carry, each item as one question with a pointer to
the section that answers it: the scope and what was excluded; every choice
made among alternatives, with the rejected ones and their reasons; anything
that adds to or changes a requirement or an ADR; the deferred items; and for
a plan, the batch cut, the replacement boundary, and what each batch
verifies. A spec under `tanto` already carries most of this in its Fixed
inputs, Rejected, Deferred items, and Shoroku candidates sections, so the
brief is a selection rendered in the chat language, not new analysis.

Open, for the plan that takes this up:

- **Who writes it.** The human asked for a third party, not the author.
  Kanri is the human's counterpart and already cold-reads the plan, but it
  reads after the commit, so a Kanri pre-read moves part of that read before
  the human's review and is a protocol change. A subagent on
  `subagents.drafter` or `subagents.default` dispatched by Sekkei keeps
  Kanri's cold read where it is, at the cost of the author briefing its own
  work.
- **What the human's answer means.** Whether an OK on the brief is the
  confirmation req-3c4d requires, or the brief is a guide into the
  translated document and the OK still goes on the document. The first
  shortens the checkpoint; the second keeps it as it is and only cuts the
  reading.
- **Where it lives.** Next to the `.wayaku/` copy, or in the topic directory
  as `.superpowers/sdd/<topic>/review-brief.md`; and whether the `wayaku`
  full translation is still made when a brief exists.

Not in the boundary-rules plan, by the human's word; filed so it is not
lost.

Related: req-04f5 (the human's interrupt budget), req-3c4d (the human's
confirmation), decision-1f5f (Kanri as the human's delegate), the `wayaku`
skill.
