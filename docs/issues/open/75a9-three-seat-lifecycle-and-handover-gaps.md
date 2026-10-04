---
id: "75a9"
title: three seat-lifecycle and handover gaps — the next branch's base, the fix section, a boundary line lost in a handover
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-seat-lifecycle-and-handover-gaps

Six observations, each checked against the skill's text. Three are filed
nowhere else:

- **(3) The next topic's branch is cut before the previous topic's records
  land.** `roles/kanri.md` cuts the next topic's branch from the base branch
  at the merge, and lands the previous topic's records by fast-forward
  afterwards, so the next branch never carries those records and its own
  records tasks edit documents the base has since rewritten. No step brings
  the branch up to date or tells its Keikaku the base moved.
- **(5) The fix wave's Setup line names a section the template lacks.**
  `templates/batch-prompt.md`'s fix-wave Setup line says "this prompt's fix
  section is the brief", and the template has no such section; each fix wave
  improvises it as contiguous blocks.
- **(6) A boundary line sent during a handover gap is lost.** A line sent to
  the roster's first data row during a handover gap is delivered to the
  outgoing Kanri and re-sent by nothing: re-sends follow only a send error or
  `no-role`, and the successor's `unanswered:` scan sees only lines a Kanri
  wrote to the ledger.

Also recorded:

- **(2)** An `rm` on a finished seat can return `claude rm:` with nothing
  after the colon; the census's `gone` is then the success signal; and the
  branch deletion wants a `git merge-base --is-ancestor` guard. The shoki-seat
  design's section 5.1 handles the `rm` on an exited session itself; the
  empty-error text and the guard are what remain.
- **(1)** A further instance of issue-42fc: the effort reading moved between
  turns.
- **(4)** The `[ref]` a spawned Kanri cannot read from `claude agents --json`
  is issue-fcd3.

Carrier: Kept.
