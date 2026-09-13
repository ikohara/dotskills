---
id: "ace0"
title: the review brief is written by a third party Kanri dispatches, and the human's answers to its points are the confirmation the review asks for
status: accepted
supersedes: []
superseded_by: null
amends: ["1f5f"]
amended_by: ["2b1a"]
created: 2026-09-09
updated: 2026-09-13
---

## Context

decision-1f5f preserves req-3c4d's confirmation at two points — the approval
of the plan the run executes, and the escalated shoroku items — and says
nothing about how the first is given. Under `tanto` the human gave it by
reading the spec and the plan: long English prose, a spec of about a thousand
lines and a plan of about three thousand, read through a full translation into
the chat's language that cost more than a million tokens per pair. On
2026-09-07 the human said this is too much (issue-a1c9): a third party should
list only the points that need the human's judgment, concisely and in the
chat's language, each with a pointer into the document, so the human confirms
those and reads the rest only where a point sends them. The review-brief
design of 2026-09-08 answered it, and the human's answers to that design's own
brief, and then to its plan's, were the first two uses — before the rule was
in the skill.

## Options

- **(a) Sekkei dispatches the brief writer.** Keeps Kanri's cold read where
  it is and needs no new line in the contract. Rejected: the author briefs its
  own work, which the human's "third party" excludes; the brief would inherit
  the spec's blind spots.
- **(b) Kanri pre-reads the document and writes the brief itself.** Kanri is
  the human's counterpart and not the author. Rejected: the top family's
  context is spent twice on every document, and Kanri's cold read — which is
  meant to be cold — moves before the commit.
- **(c) Kanri dispatches a read-only subagent on the reviewer tier, checks
  the brief's form only, and hands the path to Sekkei.** Kanri is not the
  author and a subagent is not a session, so the two-session ceiling and the
  cold read are untouched.
- **(d) The status quo:** the human reads the full translation and answers
  on the document. Rejected by the human.

## Decision

Option (c). The brief writer is a read-only subagent on `subagents.reviewer`,
dispatched by Kanri when Sekkei sends `review-ready: <path>`, writing
`.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`
from `templates/review-brief.md` in the chat's language. Kanri checks the
brief's **form** — the sections, the four tags, the three parts of a point,
pointers that are the document's own headings — and never reads the document
to validate it, so its cold read stays after the commit. Then Kanri answers
`brief: <path>`, and Sekkei puts the brief's text verbatim in its review
request.

The confirmation req-3c4d requires is given on the brief's points, with the
document as the referent: `all OK`, or one line per point, recorded by Sekkei
in `dialogue.md` in the brief's reply shape. A requirement or ADR item the
human has already answered in the brief is still escalated under
decision-1f5f; the escalation then confirms the wording, not the substance.

This amends decision-1f5f in one part: its first preservation point, the
approval of the plan, is now given on the brief's points rather than on the
document read whole. The adoption rule, the T2 split into propose and apply,
and the second preservation point stand unchanged.

## Consequences

- The human reads a spec or a plan where a point sends them, not whole, and
  answers a numbered list rather than composing a review; the checkpoint's
  authority is unchanged, its reading is shortened.
- A point the writer misses is caught where it was before: by Sekkei's own
  review and by Kanri's cold read after the commit.
- A brief costs one reviewer-tier subagent per document — measured at about
  78k tokens for a spec of 758 lines and 110k for a plan of 3087, on `opus`,
  on 2026-09-08 and 2026-09-09.
- The human's escalations at T1 narrow to wording, because the substance was
  answered in the brief.
- The human's own words in the spec dialogue are kept in `dialogue.md`, so
  Kanri, the brief writer, and the write-outs read them and not Sekkei's
  paraphrase.
- Reversing this — the human back on the whole document — is a superseding
  ADR, because req-04f5's interrupt budget now rests on the brief.
