# The tanto-sweep-2 dogfood

tanto-sweep-2 closes twenty-nine issues in the `tanto` skill's prose —
twenty-eight prose inconsistencies, plus the one feature the human asked
for, the shoroku check brief. This report is written mid-batch E, before
the plan's actual close, per Kanri's ruling R-5 (plan review finding 1) —
the plan-review ruling that deferred the check-brief-as-run measurement to
T2, since no shoroku stage fell between batch D's boundary and this task —
so it covers only what is knowable at batch E's own boundary: the
twenty-nine issues closed and the readings recorded so far.

## Issues closed

Twenty-nine issues, each traced to the block id(s) that closed it, copied
directly from the plan's own Self-Review table
(`docs/superpowers/plans/2026-09-15-tanto-sweep-2.md`). T2 moves each of
these from `docs/issues/open/` to `docs/issues/resolved/` — that move is a
later event and is not done by this report.

| Issue | Spec | Block |
| --- | --- | --- |
| c17a, e916 | 1 | W10.1, P10.3, P10.4, P10.5, P10.13, P11.1 to P11.9, P12.1 |
| 7ba4 | 2.1 | P4.2, P4.3, P4.4 |
| f5d8 | 2.2 | P5.2, P5.3 |
| c583 | 2.3 | P1.8, P4.1 |
| caba | 2.4 | P5.1 |
| e18b, 2e19 | 3 | P2.1, P2.2 |
| 8c74 | 3 | P2.3 |
| 62e7 | 3 | P2.4 |
| 1c9a | 3 | P2.5, P2.6 |
| 5a2d | 3 | P2.7 |
| 3a7c | 4.1 | P4.6 |
| c30e | 4.2 | P4.5 |
| f902 | 4.3 | P9.1 |
| 8e51 | 4.4 | P9.2 |
| 36c0 | 5.1 | P7.1, P7.2 |
| 5b8e | 5.2 | P1.9, P7.2, P8.1 |
| 5e9c | 5.3 | P7.3, P8.2 |
| bf75 | 5.4 | P7.4, P7.5, P8.3 |
| 63b0 | 6.1 | P1.7 |
| c2d7 | 6.2 | P1.1 |
| d604 | 6.3 | P1.2 to P1.6 |
| 9d17 | 6.4 | P6.1 |
| 4d8a, 6f3d | 6.5, 8 | P8.4, P3.1 |
| b673 | 6.6 | P6.2 |
| 9627 | 6.7 | P6.3, P6.4 |
| 4b91 | 1.3, 7 | P9.3, P9.4, P10.5 |

Twenty-six rows cover the twenty-nine ids above; three rows list more than
one id, comma-separated.

## The readings

From `.tanto/tanto-sweep-2/kanri.md`, section "Measurements" (read-only):

- Kanri context at batch C boundary — `dotskills-a1`: `context=235458`
  (ceiling 215214, over); the same row also carries `dotskills-57` at batch
  B: `context=242840` (over) — the ledger records the batch B figure inline
  in the batch C row rather than as a row of its own, and no batch A row
  appears in this section at all.
- Jisso context at batch C boundary — `dotskills-5f`: `context=453555`
  (ceiling 202513, over — Replace symptom, deferred by R-7 — this plan's
  rule-11 authority ruling that this run's sessions follow the plan's
  Global Constraints and batch prompts, not the on-disk role-file text,
  until every task lands — to batch E).
- Kanri context at batch D boundary — `dotskills-df`: `context=378678`
  (ceiling 215248, over, human present).
- Jisso context at batch D boundary — `dotskills-5f`: `context=575949`
  (ceiling 202513, over — Replace symptom, still deferred by R-7 to batch
  E's boundary regardless).

Taken together, every batch boundary this plan has reached so far runs
over its component's ceiling — Kanri as well as Jisso — and Jisso runs the
furthest over the two: already more than double its own ceiling at batch
C, and closer to triple by batch D. Between batch C and batch D, Kanri's
own context grows by more, in both raw and relative terms, than Jisso's
does over the same span.

These are every batch-boundary `context=` figure the Measurements section
carries as of this task; no batch A boundary row exists there separately
from the inline mention above.

The Measurements section also carries a "top-family one-shots per plan,
counted by kind" row, written by `dispatch: <kind> on <family>`
Session-events lines — a writer that `roles/kanri.md` gained only from this
very plan's own Task 6 (landed at batch B's boundary). Checking the ledger
directly (`grep -c 'dispatch:' .tanto/tanto-sweep-2/kanri.md`) finds three
hits, but all three are the unrelated prose phrase "before any dispatch:"
in the Rulings section — none is a `dispatch: <kind> on <family>`
Session-events line. So: no `dispatch:` lines recorded since Task 6
landed — the row has a writer for the first time in this run's own
history, but nothing has exercised it yet; itself a data point.

## What this report does not cover, and why

No shoroku stage has run since batch D landed — Step 1 of this task's brief
found no check-brief file under `.tanto/tanto-sweep-2/` or `.tanto/`, and
R-4 — this topic's own ledger ruling that consolidates every shoroku check
to T2 — means the check brief's own first real use (the form check's
counts, the human's answer, the timing comparison against the 2026-09-14
interim-form hotfix, and the `Unsure` read) is recorded at T2 instead, not
here, as part of T2's own write-out or a note in the whole-branch review,
whichever turns out to hold it; `docs/reports/` is dated and frozen, so this
report is not rewritten later to add it.
