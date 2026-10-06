---
id: "8a45"
title: Kikaku does not read the open ledgers' questions for the human itself
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-79

A Kikaku consultation that names no subject waits for the human to paste the
open questions, although they already live, with their pointers, in each open
ledger's `## Open questions for the human`. Kanri's idle block already draws
from that section (`roles/kanri.md`, the loop's step 4); what is missing is
that Kikaku reads the same section on a one-line ask.

The human ruled the fix on 2026-10-06: one sentence in
`skills/tanto/roles/kikaku.md`, "How you start", after "and you read them
when the subject needs them.":

> A consultation that names no subject, or names a topic and nothing more,
> starts from each open ledger's `## Open questions for the human`: read the
> section, follow the pointers its lines carry — a verdict's Rulings needed,
> a ruling `R-n` — and put the questions to the human as the subject; the
> human pastes nothing.

Nothing changes on Kanri's side: no new file, no new line between seats, no
new request op. Rejected: Kanri or any role sending Kikaku a line (it would
make Kikaku a seat the run drives, with two bosses), and Kanri writing a
consultation input file at each open question (it duplicates the ledger's
section).

Carrier: the hotfix lane, taken on `main` right after the run-owned-seats
close's merge, per R-10 and the human's word of 2026-10-06; not a `fix` of
that close.
