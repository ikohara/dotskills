---
id: "1a27"
title: "batch mechanics leave gaps: no record path for a ruling, an unnamed mid-batch addendum, an undescribed asynchronous dispatch, and a bare `replay`"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: inbox 2026-10-06-boundary-record-and-batch-mechanics

A bug report from one finished run's batches names five observations, each
checked against the skill's text and scripts. Three are mechanisms the run
used that the skill does not name, one is a fix-sized correction, and one is
not in the skill.

1. **`boundary.js record` has no flag for a ruling.** None of its flags writes
   an `R-n` line into the ledger's Rulings section, and `roles/kanri.md` gives
   no recipe for the hand edit. In the run a Kanri made the edit with
   `sed -i "${n}a\\ …"`, its line number `n` computed by a `grep -n … | cut`
   that matched nothing; the empty variable made `sed` append the text after
   every line, 250 inserted lines, found only on the next read and repaired by
   deleting the lines by exact prefix. Direction: a `record --ruling <text>`
   form that appends the next `R-n`, or one sentence in `roles/kanri.md` that
   the Rulings edit is made with the editing tool or a script with a string
   anchor, never with `sed` and a line number read from `grep`. Kin issue-077b
   (the anchor class), which does not name the missing record path.
2. **A `verified-head:` base for a boundary check — not in the skill.** The run
   derived a boundary check's base from the last `verified-head:` line of the
   ledger; two batches wrote none, and the third batch read `fail` from a base
   two batches stale. Neither the line nor the check is defined anywhere in
   the skill's text or scripts (`templates/boundary-brief.md` passes
   `--base <base>` into `check`, and `boundary.js` forwards it), so the check
   was the run's own convention. Recorded and not acted on: nothing in the
   skill to repair.
3. **The mid-batch addendum is not named.** A task added to a running batch
   worked without rework: Kanri sent one line pointing at a new file beside
   the batch prompt, `batch-<key>-addendum-<n>.md`, which says what to run
   after which task and is never written again; the Jisso read it from disk,
   ran the task as the next number, and left the sent prompt untouched, as the
   freeze rule asks. Nothing in `SKILL.md`, `roles/` or `templates/` names
   it, so a seat that does not know it would treat the line as noise or
   rewrite the frozen prompt. Direction: one sentence in `SKILL.md`'s Messages
   or `roles/kanri.md` — a task added to a batch in flight goes in that file,
   one line points at it, the Jisso reads it and never edits the sent prompt,
   and the report's Execute covers the added tasks.
4. **The Agent tool dispatches asynchronously, and `roles/jisso.md` does not
   say so.** The role file requires foreground work for the subagent's own
   commands; the dispatch itself returned "Async agent launched" at once and
   the hand-back arrived later. That let the Jisso write the next tasks'
   briefs while earlier implementers ran, at a price: a brief written ahead
   cannot name its BASE as a hash, only as the head the previous task leaves,
   and the controller reads `git log -1` before each dispatch. Direction: one
   paragraph after the foreground one in `roles/jisso.md` saying so.
5. **A bare `replay` exits 2 — a one-line correction.** `roles/jisso.md`'s
   fix-wave line says "run `verify` and `replay` only" and gives `replay` no
   `--base`; `runReplay` writes its usage and returns 2 when `--plan` or
   `--base` is absent, which the role file elsewhere reads as "could not run
   at all". `roles/kanri.md` already gives `replay --plan <path> --base <merge
   base>`. The fix is that form at `roles/jisso.md`'s line. (The run had read
   the exit as a property of plans with no passages; it is not.)
