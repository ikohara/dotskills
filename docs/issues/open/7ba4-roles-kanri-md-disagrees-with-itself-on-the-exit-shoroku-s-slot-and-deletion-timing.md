---
id: "7ba4"
title: "`roles/kanri.md` disagrees with itself on which slot commits Kanri's own exit shoroku, and on when a deletion request may be sent"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-16
---

Found by the tanto-cost run's batch C task reviews (2026-09-13), recorded in
`.tanto/tanto-cost/batch-C-report.md`, "Rulings" and "Rulings needed" (item
1). Kanri ruled to accept and file rather than authorize an off-plan edit —
`roles/kanri.md` is closed by the tanto-cost plan after batch C, and neither
sentence is fixable inside the plan without a recorded deviation from a
passage `verify` already pins.

Two sentences of `roles/kanri.md`, both landed in the tanto-cost run's batch
C, disagree with three others landed alongside or after them:

- **Which slot.** `roles/kanri.md:326-327` (task 10's region) says Kanri's
  own exit shoroku "was step 6's proposal and **slot (a)**'s commit", while
  `:312-314` (the same task's region) puts "your own exit shoroku when a
  handover is due" in **slot (b)**, and task 11's Handover section repeats
  slot (b) twice more. Three sites say (b), one says (a).
- **When a deletion request may go out.** The batch loop's step 6
  (`:297`) ends "Delete requests wait for step 7", but task 11's `### Exit
  shoroku` section sends the deletion request as soon as the recommendation
  is on disk — inside step 6, before the human's check and the direction —
  and task 10's own step 7(a) text ("The session whose shoroku it is has
  already been deleted; it waits for nothing") is only true under that
  early reading.

Both read as residue: task 10's passages were drafted against an earlier
understanding of the exit flow (where the write-out session itself commits,
in slot (a), after the human's check) than task 11's, which the design
committed to next (the dispatched `shoroku` apply subagent commits, in slot
(a) being the *apply* subagent's slot, keyed on a written direction — which
task 11 gives Kanri's own exit by removing its "no direction file"
exception). The two-source disagreement is one root cause, not two
independent slips.

The design intent, on the balance of four sites to two: **slot (a)**, and
the **early** deletion request (matching the spec's Fixed input 13, "a
session is deletable as soon as its proposal is on disk"). Fixing
`roles/kanri.md:297` and `:326-327` to match would resolve both.

Related: issue-e18b (the same "can't fix inside this plan" shape, filed the
same run), design-4807 (the shoroku flow's current-state record).

**2026-09-16, the `tanto-sweep-2` run — the slot half is resolved; the
sentence's own wording is the remaining tail.** That run's task 4 newly routed
Kanri's own exit shoroku through **slot (a)**, settling the four-sites-to-two
question above. What it did not touch is the slot (a) sentence itself: "the
session whose shoroku it is has already been deleted; it waits for nothing"
does not literally cover Kanri's own exit-shoroku sub-case, where Kanri applies
its own shoroku *before* any deletion rather than after. Real but not
load-bearing — no reader is misrouted, since the slot is now unambiguous — and
it needs a seventh passage that a follow-up sweep would add, most likely a
short parenthetical noting the exception rather than a rewrite of the sentence.
