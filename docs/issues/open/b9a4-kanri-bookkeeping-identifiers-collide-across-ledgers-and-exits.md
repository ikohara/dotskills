---
id: "b9a4"
title: Kanri's bookkeeping identifiers collide — S-n across two open ledgers, and exit-kanri-<date> across two exits in one day
severity: low
depends_on: []
blocks: []
claimed_by: tanto context-cost plan (Kanri, dotskills)
claimed_at: 2026-09-09T17:30:00+09:00
created: 2026-09-09
updated: 2026-09-09
---

Two collisions in the identifiers `roles/kanri.md` has Kanri keep, both seen
on 2026-09-09 while one Kanri conducted the review-brief plan and opened the
requirement-extraction topic in parallel.

**`S-n` is numbered per ledger.** Each conductor ledger starts its shoroku
candidates at S-1, so a Kanri with two open ledgers holds two S-6s, two
S-11s. At review-brief's T2 Kanri's line to Jisso routed "S-6, S-11, S-12,
S-13" to the consistency note; those were the requirement-extraction ledger's
numbers (four plan-review facts), while in the review-brief ledger they were
already-written T1 rows. Jisso followed the ledger, asked, and nothing was
written twice — but the safeguard was Jisso's reading, not the identifier.
The two parallel-topic runs so far (boundary-rules with review-brief,
review-brief with requirement-extraction) both had two ledgers open in one
Kanri.

**The exit proposal's file name collides within a day.** `SKILL.md`'s Session
exit gives Kanri's exit files the pattern `exit-kanri-<YYYY-MM-DD>`, next to
the roster. Two Kanri exited on 2026-09-09 — the predecessor on the human's
word for cost, this one at the plan close — and the second proposal had to
take an unofficial `-b` suffix to avoid overwriting the first.

A third case, the same shape: a **compound value in the `Written` column**
hides an outstanding half. An `S-n` row whose candidate has two stages — a
claim written at T1 and a status move due at T2 — takes a value like
`claim: <commit subject>; move: no`, and a selection of the rows still to write
by "the Written column says `no`" skips it. The row is not wrong; it is
unfilterable. Met on 2026-09-09, where the row carrying issue-ad1a's move to
`resolved/` was invisible to that filter while the move was genuinely
outstanding, and it was the executor's proposal rather than the ledger that
surfaced it. Either such a row is split in two when its second stage is
identified, or the column takes a convention a filter can read.

Candidate fixes, for a later plan: a cross-ledger reference names the ledger
(`review-brief S-6`), or the ledger's rows carry a topic prefix; the exit
file pattern gains the Kanri's bare name or a sequence when the date is
taken. Related: decision-de63 (Kanri resident with a handover),
decision-d831 (every planned exit carries its own shoroku), req-04f5.
