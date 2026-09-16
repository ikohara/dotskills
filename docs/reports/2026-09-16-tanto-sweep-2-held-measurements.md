# Measurements held at the tanto-sweep-2 topic's T2

Two measurements that had nowhere else to land, frozen here at the
`tanto-sweep-2` topic's T2 write-out. Neither belongs to an investigation of
its own: the first was taken outside this topic's run and held on this
topic's ledger by the deciding Kikaku file's own instruction, and the second
is a measurement that the topic's own dogfood report
(`docs/reports/2026-09-15-tanto-sweep-2-dogfood.md`) deferred because the
stage it measures had not run when that report was written. That report is
frozen, so the deferred figure could not be added to it; a new dated report is
the only place it can land.

## The fable-usage split, measured 2026-09-15

A data point on the cost requirement, taken outside this topic's own run and
held here per the deciding Kikaku file's instruction.

Price-weighted, usage on the `fable` family divides **72% to sessions and 28%
to subagents**. Per-seat and per-kind figures were taken alongside the split.

Method, so the split can be re-derived rather than trusted: sum the
`message.usage` records in the session transcripts over the period, weight each
token class by its price, and attribute each record to the session or to the
subagent that produced it. The figure is a price-weighted share of that sum,
not a share of turns or of raw tokens.

This does not supersede `docs/reports/2026-09-12-tanto-usage-before-and-after.md`,
which is frozen and records a different period; it is a later, separate
reading of the same kind.

## The check brief's first real run, measured 2026-09-15

The measurement the topic's dogfood report deferred — see that report's "What
this report does not cover" section — landing here as its stated deferral's
resolution. It also answers the deferral issue-c17a records; that issue is not
moved to `resolved/` by this report.

The run measured is the `tanto-sweep-2` topic's own exit-kanri shoroku, in
session `dotskills-4c`, on 2026-09-15 — the first time the check brief was
produced and answered for real rather than in a rehearsal.

What it produced:

- **2 adopt / 0 reject / 0 unsure.**
- **Four headings, in order.** The brief's own headings rendered in the
  template's order, with nothing reordered or dropped.
- **`sections … Unsure` printed `none`.** The empty group read correctly
  through the by-exception path rather than erroring or returning the whole
  file.
- **`See:` pointers were written without the `###` marker.** This is the form
  the whole-branch review's Important 1 subsequently pinned as correct, so the
  first real run happened to produce the form that was later made the rule —
  but it produced it by the writer's choice, not by a stated contract.
- **The human answered `OK`.**

No wall-clock timing is recoverable for this run: Session events carry no
timestamps, so the brief's cost in elapsed time is not measured here and
cannot be recovered from the record after the fact.
