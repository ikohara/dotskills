---
id: "768b"
title: "a report-writing task has no precondition to cross-check a figure it copies, or to name the holder of a measurement it defers"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

Found in the tanto-sweep-2 run and recorded in that run's ledger (S-68 and
S-72). Two missing preconditions on the same task kind — the task that writes
a dated report — so they are filed together, for one reading rather than two.

- **A frozen report that copies a ledger row inherits the row's error.** That
  run's dogfood report copied the ledger's Measurements figure, which was
  wrong; the whole-branch review caught it (its Important 3) and the batch-F
  fix wave corrected both places. A report freezes what it copies, so the
  copy's error freezes too. The missing step: before freezing a figure, the
  report-writing task cross-checks it at the ledger's second site — the
  Progress line, or an `S-n` or issue append that carries the same number.
- **A deferred measurement needs a named holder.** The same report deferred a
  measurement to "whichever turns out to hold it". Nothing owned it, and the
  whole-branch review ended up holding it only because the report happened to
  exist when the reviewer looked; the measurement landed in
  `docs/reports/2026-09-16-tanto-sweep-2-held-measurements.md` by that
  accident. The missing step: a report that defers a measurement names one
  holder, as a Session events line, with the stage that owns it.

Both are steps that no role file and no report template carries yet, which is
what makes this a gap rather than reference material.
