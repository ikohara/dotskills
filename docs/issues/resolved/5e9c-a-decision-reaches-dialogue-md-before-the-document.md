---
id: "5e9c"
title: no step binds "a decision reaches dialogue.md before the document", and it failed twice in one day
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-10-03
---

Source: session 2026-09-10

`roles/sekkei.md` Step 1 says to keep `.superpowers/sdd/<topic>/dialogue.md`
as the spec dialogue goes, and `SKILL.md` makes that file the one record of
the human's own words under this protocol. Nothing says **when** a turn is
written relative to the document it decides, and the ordering is where it
fails.

Measured in the tanto-sweep run of 2026-09-10, twice in one day, by the same
Sekkei:

- The human named `mise` twice in mid-turn messages and Sekkei carried both
  into the spec without writing either into `dialogue.md`. The spec review
  then filed the `mise` prerequisite as a **scope change on no recorded
  decision** — correct against the record, wrong against what the human had
  said. Repaired as `D-12`.
- Sekkei then cited a `D-13` for the human's approval of that same
  prerequisite while `dialogue.md` still ended at `D-12`. Found by Kanri's
  cold read and, independently, by the plan review brief's decide line.
  Repaired as `D-13`.

Both instances were **mid-turn** messages: decisions that arrived while Sekkei
was writing, answering no question it had asked, with nothing to file them
under. Neither was a lapse of care in the dialogue proper. Sekkei had written
"a decision reaches `dialogue.md` before it reaches the document" as a shoroku
candidate in the same spec it then broke the rule in — which is the point of
design-4807's convention that prose binds nobody and a rule needs a step or a
command before it holds.

The step, in the shape `roles/sekkei.md` uses, to be added to Step 1 after the
sentence beginning "Keep `.superpowers/sdd/<topic>/dialogue.md` as you go":

> **A decision reaches `dialogue.md` before it reaches any document.** Write
> the turn — the question you put, the human's answer verbatim, and your
> reading of it — and only then edit the spec, the plan, or a block. The case
> that breaks this is the decision that arrives **mid-turn**, in a message
> answering nothing you asked: it has no question to file it under, so file it
> under the work it interrupted, and give it a `D-n` of its own. A decision
> you acted on and did not record is indistinguishable, to every later reader,
> from one you invented — and the reader who finds it is a reviewer filing a
> scope finding against your own document.

Not landed by the tanto-sweep plan: `roles/sekkei.md` is in that plan's File
structure table, the plan had passed the human's review gate, and a passage
added after the gate is a scope change the human would have to rule on, with
the hotfix lane closed on a file the plan lists. The next tanto plan, or a
between-plans hotfix on `main`, lands it.

Related: exp-1fb1 (the human's own words are kept as a record), design-4807
(the Sekkei conventions, and the ranking of what makes a rule bind), the
tanto-sweep dialogue's `D-12` and `D-13`.

Resolved by "docs(tanto): Sekkei's review gates, the dialogue rule, and the fixed referent" — found by the tanto-issue-triage liveness check, 2026-10-03.
