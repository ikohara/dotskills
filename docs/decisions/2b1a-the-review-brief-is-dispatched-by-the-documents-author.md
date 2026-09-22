---
id: "2b1a"
title: the review brief is dispatched by the document's author, not by Kanri
status: accepted
supersedes: []
superseded_by: null
amends: ["ace0"]
amended_by: ["b59a"]
created: 2026-09-13
updated: 2026-09-22
---

## Context

decision-ace0 put the brief writer in Kanri's hand: Kanri dispatches a
read-only subagent when the author sends `review-ready:`, checks the brief's
form, and answers `brief: <path>`. It rejected the author dispatching its own
brief writer on the ground that the author would be briefing its own work.

The cost work of 2026-09-12 re-read that ground. The third party ace0 asked
for is the subagent's context isolation, not the hand that dispatches it: a
subagent shares no context with the session that dispatched it, and the
prompt is the fixed template. What Kanri's hand adds is two message hops and
a copy of the brief in the context of the session that is moving to a cheaper
family and off judgment work, while the author waits idle for a path it could
have named itself.

## Options

- **Keep Kanri as the dispatcher** (ace0's choice). One more session in the
  loop for a document it does not read.
- **The author dispatches the brief writer** — Sekkei for the spec brief,
  Keikaku for the plan brief — with the form check moved into `SKILL.md` as
  one copy the two authors cite, and the author forbidden to edit the brief:
  on a failed form check it dispatches once more, and on a second failure it
  sends the brief as it stands with one line to the human.

The commissioner-bias argument, which is why the whole-branch review stays
Kanri's, does not apply here: a brief selects and renders the document's own
judgment points for the human, and a point that misreads the document is
caught by the human's answer or by Kanri's cold read.

## Decision

The second option. This amends decision-ace0's **dispatcher clause** only:
the brief writer is dispatched by the document's author, and the author runs
the form check. The author then sends Kanri one line,
`review-ready: <document path>; brief: <brief path>`, which Kanri records in
the ledger and acts on no further; the `brief: <path>` reply and the
idle-until-brief wait are gone.

The rest of decision-ace0 stands: the brief's form, its language, the
read-only third party that writes it, and the human's answers to its points
as the confirmation the review asks for.

## Consequences

- Two message hops and Kanri's copy of the brief leave the flow; Kanri's cold
  read is untouched and still falls after the commit.
- The form check has one copy in `SKILL.md` that both authors cite, rather
  than living in Kanri's role file.
- A brief whose form fails twice reaches the human as it stands, with a line
  saying so — the author never edits it, so the third-party property survives
  a bad run.
- The reasoning is the tanto-cost design of 2026-09-12; design-4807 records
  the resulting dispatch table.
