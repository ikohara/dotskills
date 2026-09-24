# The bg-seat-ergonomics dogfood

This report covers the `bg-seat-ergonomics` plan's dogfood run: the rework
that names each background seat at its spawn, turns the CLI's background
isolation off per seat, makes the `sessionId` every seat's identity with
`boundary.js census` as its one signal, resumes a Kanri that left the listing,
and renames the shoroku vocabulary to one name with no stage word. It records
the facts of that run which belong to a dated, frozen record: how the topic's
size was read at placement against at the plan, one first exercise of a
contract clause, and the cost of every stage's dispatches. The plan wrote no
dogfood report of its own; this one is written at its close, on the precedent
of `docs/reports/2026-09-22-tanto-bg-seats-dogfood.md`.

## Scope: the topic grew from "small" to medium in its spec dialogue

The Kikaku decision placed the topic before `experience-layer` on the ground
that "every item below is a small change". The human added the terminology
pass mid-dialogue (D-5), and the spec review's findings widened the plan's
needle list to 23 strings over `SKILL.md`, the seven role files, the
templates, and the README. The plan that resulted ran four implementation
batches and a fix wave.

The order decision's reasoning still holds — every item lowers the human's
attention cost during `experience-layer` — but its size premise did not, and
the next order decision reads a topic's size at placement with that in mind.

## A second topic's live Sekkei ran beside this topic's batches

`bg-seat-fixes`'s Sekkei handshook and received orders naming a draft spec
path while this topic's batch C was in flight. It was the first time in this
repository's run history that a second topic's live Sekkei dialogue actually
ran concurrently with another topic's batches, rather than the
`spec-draft.md` / held create-request route being described but not exercised
(`experience-layer`'s Sekkei create-request had stayed held, unopened, since
2026-09-21). It is the first real exercise, for a live Sekkei session rather
than an opened-but-dormant ledger, of the contract's "a second topic may open
while the first is in its plan stage or its batches" (`roles/kanri.md`, Start
step 5).

## Cost record

No `dispatch:` event was written for the spec stage's two dispatches, so their
figures are recorded here and nowhere else.

| Stage | Dispatches | Figures |
| --- | --- | --- |
| Spec | `spec.review` (fable) | 314,119 subagent tokens, 38 tool uses, 18 min 10 s; 23 findings (21 correctness, 2 scope) |
| Spec | `brief.write` (sonnet) | 130,397 tokens, 10 tool uses, 6 min 3 s; one resume for the form fix, 133,175 tokens cumulative, 8 tool uses, 50 s |
| Plan | `plan.draft` (opus, high) | wrote the plan |
| Plan | `plan.review` (fable, high) | re-applied all 199 `P` / `W` blocks, re-ran the three script suites, `biome`, and markdownlint, and swept every `O` needle again; 336,201 subagent tokens, 55 tool uses, about 24.3 min |
| Plan | `brief.write` (sonnet, high) | 144,346 subagent tokens, 25 tool uses, about 8.4 min |

The batches, dispatch by dispatch:

- **Batch A** — three `task.implement` (sonnet) and six reviews, two per task
  (`task.review-spec` and `task.review-quality`, both opus, per tanto's
  Models-table split of SDD's single combined reviewer). Each pair's warning
  items were resolved by the controller from `git` and `grep` alone; no case
  needed a third dispatch to settle a disagreement between the two verdicts.
- **Batch B, first pass** — three `task.implement` (sonnet) for Tasks 4, 6,
  and 7 (Task 5 not dispatched) and four reviews, a spec and quality pair for
  Tasks 6 and 7 only; Task 4 made no commit and carries no passage, so it had
  no per-task review. All four came back clean on spec compliance and
  Approved on quality, every warning resolved by the controller re-running
  `grep -c`, lint, and `passage-check.js verify`.
- **Batch B, rework** — one `task.implement` (sonnet) for the initial R-5
  application, then the same live subagent resumed by `SendMessage` to its
  agent id for two further fix rounds, per SDD's "resume the original
  implementer" guidance: three implementer turns, one agent. Two
  `task.review-quality` (opus) scoped re-reviews, one after each fix round,
  and no `task.review-spec`: a fix round's re-review is a single combined
  pass verdicting the named findings, which the role file's Models table maps
  to the `task.review-quality` kind. It is the first measured use on this
  repository's own run of the resume-by-`SendMessage` round.
- **Batch C** — four `task.implement` (sonnet) plus one resumed fix round for
  Task 8's missing trailer, eight reviews (a spec and quality pair per task,
  both opus), and one scoped `task.review-quality` re-review for Task 8's fix
  round: thirteen dispatches for a four-task, no-code, documentation-only
  batch. Every pair's warnings and every Important finding were resolved by
  the controller from `git log` and `grep`, with no third dispatch.
- **Batch D** — four `task.implement` (sonnet) and eight reviews, the same
  shape as every earlier batch, plus two `default`-kind (sonnet)
  verification-only dispatches, new to this batch: the boundary's full-plan
  `O`-needle sweep (127 needles) and the consistency note's six batch-D
  checks. Fourteen dispatches. Every pair came back clean — 0 Critical, 0
  Important across all eight — and no fix round ran: the first of the plan's
  four implementation batches with that property across all its tasks.
- **Fix wave** — one `task.implement` (sonnet) and two reviews
  (`task.review-spec` and `task.review-quality`, both opus, run in parallel).
  Both came back Approved on their first pass; no fix round, and no third
  dispatch.
