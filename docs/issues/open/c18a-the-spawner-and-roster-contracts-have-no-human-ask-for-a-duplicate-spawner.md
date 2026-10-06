---
id: "c18a"
title: the spawner and roster contracts have five gaps, and no human-ask for stopping a duplicate spawner
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: inbox 2026-10-06-spawner-roster-and-handover-contract

A bug report from one finished run names five gaps in the spawner and roster
contracts, in the order the run met them. Three add evidence to open or
resolved issues and are recorded there; one asks for a re-measurement; one
is new.

1. **A roster row written with its path separators dropped and two NUL
   bytes.** Recorded in issue-f07a, whose severity rises to high with the
   verified cause and the launcher's lock-out.
2. **A `/clear` followed by `/tanto sekkei` kept the session id — a
   re-measurement.** A human cleared a window that had held another seat and
   typed `/tanto sekkei`; the census session id stayed the same, and the new
   seat's first reading already counted the earlier conversation's 504,176
   bytes and 74 records. The run's note said the skill promises a new
   `sessionId` after a clear, but no such sentence is in the skill's text.
   `docs/notes/claude-code-sessions-observed.md`'s "What `/clear` keeps and
   what it resets" (2026-09-16) measured a new session id after a clear; this
   run says otherwise. Re-measure whether a `/clear` keeps the session id, and
   what the rows and the reading's baseline do if it does; whichever result
   holds, state it in `SKILL.md` where a cleared window's handshake is
   described, with what the baseline then means.
3. **Two spawner processes served one workspace.** Recorded in issue-f03b.
4. **Two successors from one handover; the handover file's move was the
   atomic claim.** Recorded in issue-e843.
5. **Stopping a duplicate spawner is the human's act, and the contract has no
   human-ask for it — new.** In an auto permission mode, stopping a process
   the session did not start was denied, rightly. The contract has no line for
   the case. What held in the run: the human stopped the process
   (`Stop-Process -Id <pid>`), and the Jisso's spawn request, `<id>.json`, was
   held as `<id>.json.tmp` until one spawner was confirmed, so no spawner
   could claim it twice. Direction, in `roles/kanri.md`'s spawner text: a
   duplicate spawner is the human's stop; a request is held as
   `<id>.json.tmp` until one spawner is confirmed, and the human is asked
   once, with the pid.
