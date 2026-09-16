---
id: "a79c"
title: "Bug intake's decision point does not ask whether a batch is in flight before asking whether a Hosa is live"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Observed 2026-09-17 as the `dotskills-1a` Kanri's own mistake, caught by Jisso
and corrected before any commit landed wrong. While a batch was already in
flight, this session wrote two `docs/issues/` files directly — a newly arrived
bug report's triage — instead of routing the filing through the live Hosa from
the start, as Rule 5 and `SKILL.md`'s Bug intake section both already say to do
once a batch is running.

The mistake cost nothing. The files were left uncommitted, handed to Hosa in a
slot, and Jisso's own boundary report correctly flagged the uncommitted state as
"not stray but not explained yet" rather than discarding or ignoring it — the
protocol working as intended on the *receiving* end.

The gap is upstream. The Bug intake section's own decision point ("When a Hosa
is live, hand the filing to it…; when none is live, the filing is your own")
does not prompt a check of "is a batch currently in flight" *before* deciding
whether to write directly. The two questions read as independent when the first
should gate the second: a Kanri running several concurrent topics can lose track
of which topic's batch state applies at the moment a bug report happens to land,
and a Hosa's liveness alone does not answer it.

Fix candidate: make "check whether any topic's batch is in flight" the first
branch of that decision point, ahead of "is a Hosa live". No fix text drafted
yet.

Filed as an issue on issue-bb8c's precedent — a Kanri's own mistake, caught and
corrected within the tenure, recorded because the rule text that would have
prevented it is the thing that needs changing. Distinct from issue-c3a9 (a
chore's landing *branch*) and issue-3a7c (Hosa's slot-request receiver), which
touch the same neighbourhood of the protocol but not this ordering.
