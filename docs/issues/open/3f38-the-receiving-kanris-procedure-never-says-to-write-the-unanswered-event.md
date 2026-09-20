---
id: "3f38"
title: the receiving Kanri's procedure never says to write the `unanswered:` event, where it goes between plans, or how `answered:` pairs it
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku tanto-diet S-78

The contract states the rule — a peer line Kanri does not answer in the same
turn is recorded as an `unanswered:` Session events line, and three successor
sites read it — but no site of the receiving Kanri's **own** procedure says to
write it. The whole-branch review proposed one sentence in the batch loop's
step 6 for the in-plan case. The fix wave attempted exactly that and its
landing was reverted, because the two spots it edited sit inside task 8's
mandated P8.3 and P8.4 spans; the revert was about the passage gate, not about
the substance, which both reviewers judged correct. So the write side of the
rule is still unwritten, and every reader site keys on a line nothing is told
to produce.

**Where it goes between plans.** With no ledger open there are no Session
events, and the proposed target is the roster's Events. None of the three
existing reader sites — `roles/kanri.md`'s Handover-accepted case, its
Kept-Kanri gap, and its Live-peers list — is told to check there; all three
read the ledger's events only. Choosing the roster as the target therefore
needs a matching change at the reading end, which is why this is a decision
and not a wording repair.

**What the write instruction must say.** Every reader site keys on "an
`unanswered:` line with no matching `answered:` one", so an instruction that
names only `unanswered:` leaves the rule half-specified: the pairing write is
part of it. The fix wave's first draft of the sentence — "A peer line this
turn received and did not answer in the same turn" — was flagged by a reviewer
for a garden-path parse, worth avoiding when this is implemented outside a
passage-gated context.

The batch-A half of the same fix round — the Previous-verdict slot text naming
both absences — needed no decision and was applied as a text correction at
this close, in `roles/kanri.md` and `templates/batch-prompt.md`.

Related: issue-a449 and issue-7f2a record that editing inside a closed plan's
mandated spans is expected to read red; issue-1c9d is the gap this rule leaves
uncovered when no Kanri received the line at all.
