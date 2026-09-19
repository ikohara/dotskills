---
id: "ed4b"
title: a topic's ledger has no place that records whether T1 ran, so a skipped T1 reads exactly like one that has not come due
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: session 2026-09-17

T1 — the spec-derived requirements and issues, due after the plan commits and
before Jisso is created — has no slot anywhere in a topic's ledger. The
template (`skills/tanto/templates/kanri.md`) carries no T1 line at all, so a
T1 that was skipped and a T1 that has simply not come due yet produce the
identical artifact: nothing in the Progress line, nothing in the Session
events, nothing in the roster. "When the plan lands" step 3 says to run T1,
and the instruction is easy to skip precisely because skipping it leaves no
trace.

Measured 2026-09-17 on this repository. The `shoroku-at-close` topic never ran
T1 across three Kanri tenures — the topic was created, its plan committed, its
Jisso created, and a full batch run — and the absence surfaced only when a
fourth tenure read the ledger cold at a handover acceptance and noticed that
no T1 entry existed anywhere.

The fix, at the named site: the ledger's own Plan section, or the Progress
line's own convention, should record T1's disposition explicitly — a
done-date, or "not yet due" — the same way the Batches table makes a missing
batch visible at a glance, so a gap like this is caught at the very next
boundary rather than three tenures later.

Related: issue-9627 files the analogous no-closure-mark problem for a
different act (a pre-spec act) at a different ledger site. It is cited as
precedent for the shape of the fix, not as the same issue.
