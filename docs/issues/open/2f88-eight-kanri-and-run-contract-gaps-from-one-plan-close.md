---
id: "2f88"
title: eight Kanri and run-contract gaps from one plan close
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: inbox 2026-10-02-kanri-and-run-contract-gaps-from-a-plan-close

Eight contract gaps, each stated against the current skill text and each a
rule to decide. Severity is medium overall: item 3 stands out for cost (a
lost 24-minute run), item 8 for its potential outward effect; the rest are
low. Each is a reading of the named file against the behavior described,
taken from the run's records. Run from the skill root, these greps show the
gaps against the skill alone:

```console
grep -n -i 'conflict' roles/kanri.md SKILL.md
grep -n -i 'roster-archive' roles/kanri.md templates/roster.md
grep -n 'Kanri fills' templates/batch-prompt.md roles/kanri.md
grep -n -i 'first data row' roles/jisso.md
grep -n -i 'paused' roles/kanri.md SKILL.md
```

1. **The archive move's procedure** — an addendum to issue-fb90's finding
   that the roster's Events log is never pruned. `templates/roster.md`'s
   Keeping rule and `roles/kanri.md`'s close row still say a closed plan's
   Events lines move to `roster-archive.md`, and no close does it. New: five
   closes now without the move, and the latest one's Kanri declined a
   line-by-line split because the live log interleaves the Events of several
   concurrently open topics, writing a synthesized digest into the archive
   instead. The open question is the procedure, not only the log's size.
   Fix: give the rule a safe way to split by topic (for example a topic tag
   on every Events line), or reword it to say a close writes a digest and
   leaves the log.
2. **A merge conflict at the close has no owner.** `roles/kanri.md`'s
   "Shusei" landing paragraph has Kanri run `git merge --no-ff <topic>` and
   names no conflict case; `SKILL.md` says "no machine ever resolves a
   conflict", and the role file's one conflict handling (`shoroku blocked:`)
   is shoki's. A concurrent topic's shoroku commits landed on `main` after
   this topic's branch was cut, both sides added text after the same line of
   one docs note, and the merge conflicted; Kanri resolved it by hand with no
   rule saying it may or what to tell the human. Fix: Kanri resolves a
   textual conflict by hand in the shared checkout, runs lint, names it in
   the ledger and in its next line to the human — or rebases the topic
   branch onto `main` at its last boundary.
3. **The `shoroku.recommend` run is one unresumable unit.** A dispatch over
   119 pending rows ran about 24 minutes, 87 tool uses and 361675 subagent
   tokens; the first attempt of that size died on a session-limit 429 having
   written no file, so the whole run was lost. Neither `SKILL.md`'s step nor
   `roles/kanri.md`'s "Recommend" step asks the recommender to write group
   by group or says a re-dispatch continues from what is on disk (the later
   successful run wrote five appends only because its own prompt asked).
   Fix: incremental writing is the rule, and the on-disk file is the resume
   point.
4. **A working Sekkei is told nothing when the checkout moves.**
   `roles/sekkei.md`'s branch paragraph says Kanri cuts the branch and the
   checkout belongs to the topic whose batches run; nothing tells a Sekkei
   mid-dialogue that shoki's records landed on `main` or that the checkout
   moved. The Sekkei found out from new issues in a grep, one bearing on a
   decision under discussion. Fix: Kanri sends a working Sekkei one line
   when it moves the checkout's branch or HEAD.
5. **A limit that lands mid-turn leaves no `paused:` to send.** `SKILL.md`'s
   "A limit is a pause" and `roles/kanri.md`'s "Limits" assume the seat
   sends `paused:`. A Jisso's last two transcript messages were the
   harness's session-limit notice and it sent nothing; the pause showed only
   as hours of silence plus a `blocked` census entry, and Kanri recorded the
   Measurements row by hand from the transcript tail. Fix: the Limits step
   names where Kanri looks when no `paused:` came (the census `blocked`
   state, then the seat's transcript tail) and records the row from there.
6. **A decision past the spec stage fits none of the four handlings**
   (beside issue-d23e). `roles/kanri.md`'s `decision:` paragraph has four:
   the spec stage takes an `I-n`, between plans names the next Sekkei's
   input, a stage's Check answer, otherwise a source row. A Kikaku decision
   arrived at the plan stage naming its own held-until-close handling;
   Kanri held it as a ledger `R-n` with the acts it owed, by judgment. Fix: a
   fifth handling — a decision past the spec stage that names its own
   held-until-close handling is recorded as an `R-n`, so a successor
   inherits it.
7. **No slot for a Kanri act a plan parks on a prompt-drafting moment**
   (beside issue-8f5a). `templates/batch-prompt.md` has two `<Kanri fills>`
   slots and `roles/kanri.md`'s "Record and send" fills only those, so a
   plan's clause giving Kanri a dated amendment "when Batch X's prompt is
   drafted" was missed; a Jisso found it in the plan's Global Constraints,
   and it cost a fifteen-file sweep in the fix wave. Fix: a `<Kanri fills>`
   slot for such parked acts, or the boundary-verify brief greps the plan
   for such clauses before rendering the next prompt.
8. **A Jisso checks the sender of nothing it receives** (beside issue-b106,
   the sending side). `roles/jisso.md` says to read Kanri's address fresh
   when sending and nothing on receiving, though the contract rests on
   "Kanri is the only session that messages the seat". A Jisso received a
   `T2:` line from a name that was not the first data row as it had last
   read it; a fresh read showed an accepted handover. Its own report line,
   sent to the first row at that moment, was delivered with no error. A line
   asking only for a file is harmless either way; one with an outward
   effect would not be. Fix: a Jisso that receives a Kanri line from a name
   other than the first row as last read re-reads the roster before acting,
   and `roles/kanri.md`'s handover step notes the mirror case of a send
   reaching a stopped predecessor.

Files: `templates/roster.md`, `roles/kanri.md`, `roles/sekkei.md`,
`roles/jisso.md`, `SKILL.md`, `templates/batch-prompt.md`.
