---
id: "63c1"
title: "`roles/jisso.md`'s Start step 1 does not say whether \"read the spec\" means the spec's full text or the plan's cited sections"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Found by the `shoroku-at-close` run's Jisso at the Batch A boundary
(2026-09-17), in its exit shoroku proposal.

`skills/tanto/roles/jisso.md`'s Start step 1 says "read the plan and, if it
names one, the spec." It does not say what *reading the spec* has to cover, and
the two available readings differ by roughly the whole document.

What this run actually did, for a spec of 1,949+ lines: read the spec's
section-header table of contents plus only the specific numbered sections the
plan's own passages cite by number (2.1, 2.2, 2.3, 2.4, 5.2, 7.1, 7.2, 8.2,
8.3) — trusting the plan's own stated baseline-verification claim ("every old
text below were quoted from a projected baseline ... resolved exactly once")
instead of re-verifying that claim against the spec's full prose. Batch A
landed clean on that basis, so the shortcut cost nothing here.

The open question, left for the human rather than answered here: should
"read the spec" mean the spec's **full text** every time, or is the plan's own
cited-section list an acceptable substitute **when the plan states its own
baseline was verified**? A larger or messier plan might not carry as
trustworthy a baseline claim, and the cheaper reading is exactly the one that
cannot tell the difference. The answer decides which thing gets written: a
tightening of Start step 1, an explicit sanction of the cited-section reading
with the condition attached, or nothing at all if the cited-section reading is
simply the intended one.

Same shape as issue-0404 and issue-cb19: a `roles/jisso.md` under-specification
found at a Batch A boundary, where a load-bearing reading is left to each Jisso
to settle for itself. In tension with issue-cca9 (the role-file diet) on the
same grounds those two are.
