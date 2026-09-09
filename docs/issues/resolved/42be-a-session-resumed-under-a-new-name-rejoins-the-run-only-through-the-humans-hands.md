---
id: "42be"
title: a session resumed under a new name rejoins the run only through the human's hands
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-10
---

Raised by the human on 2026-09-09, after the third editor restart this
roster has survived (2026-09-08 once, 2026-09-09 twice): "every restart is
too cumbersome like this; I want a smart recovery". The need behind it is
the human's own time, so by the requirements-vs-issues rule it is also a
bullet under req-04f5 ("A session resumed under a new name rejoins the run
as easily as possible"); this issue records the gap.

The phenomenon is **per session** and not tied to any one cause. A Claude
Code conversation that is resumed — after the editor restarts, after one tab
is closed by mistake, after a terminal session ends — keeps its context but
comes back under a **new name and a new ref**: `dotskills-a6 [a4d429]` became
`dotskills-70 [0341a5]`, `dotskills-63 [720dfb]` became `dotskills-bd
[738fc6]`, Kanri `dotskills-e0 [ee0f48]` became `dotskills-08 [88587d]`. Its
old address in the roster and in every peer's memory is dead from that
moment. `ListAgents` shows name, ref, kind, and start time — no cwd, no role,
and no previous name once the resume is a few minutes old — so Kanri cannot
tell which listed session is which role, and the resumed session's Kanri does
not know it resumed until the session says so. An editor restart is the same
case for every session at once, Kanri's own included.

What the skill has the human do today, measured on the three restarts: visit
each window, ask it its name or run `/tanto <role> <new kanri address>`
there, and relay; Kanri marks the old rows `dead` (an address died, not a
context), writes new rows on the handshakes, and re-sends its own address to
each peer. That is one visit per resumed window for the human and a
re-identification round for Kanri, with an interval in which a wrong guess
sends a batch prompt to the wrong session. Nothing on disk is lost.

What is known that a fix can use:

- A session can read its own name at any turn (`ListAgents`' first line) and
  the roster row it last wrote or was written for; a mismatch is the
  self-visible signal that it was resumed.
- `/tanto <role>` with no address already falls back to the roster's first
  data row for Kanri's address, and the roster is the one file every session
  shares; a Kanri that rewrites its own first row first makes every peer's
  fallback correct.
- The `kanri-address:` line exists for a successor Kanri to announce itself;
  a resumed Kanri is the same case with the same content.
- Whether a stable identity survives a resume — the session id in the
  scratchpad path, the transcript file issue-e5a2 reads — is not yet measured.

Candidate shapes, for the spec that takes it up (the context-cost topic is
the nearest, since a resume is a cost event):

1. **A self-check at every wake-up.** Each role compares its `ListAgents`
   name with its roster row at the start of a turn; on a mismatch, Kanri
   rewrites its own row and sends every live peer the `kanri-address:` line,
   and a peer re-handshakes to the roster's first row. A single resumed
   session then rejoins on its own next turn; after a restart the human's
   action shrinks to one word per window ("resume"), no address pasting, and
   the identification is the session's own, not the human's.
2. **Kanri first, then the roster does the rest.** The recovery text says the
   human recreates Kanri first; make that the whole procedure for the
   many-at-once case: Kanri resumes, fixes its row, and each other window's
   `/tanto <role>` with no address finds it.
3. **A stable identity to correlate on** — the transcript path or the session
   id — so that a resumed session can be matched to its old row without the
   human, if it survives a resume (measure first).
4. **The four cases of Kanri's start** gain the resumed-self case: the first
   row is another name that is not listed, but the context is this
   conversation's, so nothing is dead and no recovery of the tree is needed
   beyond the listing check; today that path runs as "Recovery" and writes
   `dead` rows whose Events lines then need correcting.

Related: req-04f5, design-4807 (Session lifecycle, Recovery), decision-de63,
decision-73c3 (sessions addressed by born name), issue-e5a2 (the transcript
as a session's own record), issue-1c70 (resolved; names across repositories).

Resolution (context-cost, 2026-09-09): a resumed session rejoins through
`/tanto resume` and a self-check, keyed on the **transcript path** — the
identity a resume keeps.

The shape was chosen after measuring what actually survives, which this issue
could not assume. A resumed conversation keeps its context, its session id and
its transcript file; the name and `[ref]` change; and **nothing in the
transcript marks the resume** — the only `SessionStart` hook records are
`startup` at a true start, while `SessionStart:compact` marks a compaction
rather than a resume. So a session can see its own resume only in the listing,
and no peer can locate another's transcript, which is why the path travels in
the handshake and the roster's address book gained a **Transcript** column.

All four of the issue's shapes were taken, joined: the path as the key, the
self-check narrowed to boundaries rather than every wake-up, Kanri first with
the roster doing the rest, and a fifth start case. `/tanto resume` is the fifth
invocation word and reads `SKILL.md` and nothing else, because the role file is
already in the context a resume preserves. A handshake whose `transcript=`
matches a row rewrites that row in place — status `live`, no `dead` row, one
Events line `resumed: <old name> → <new name>`. After an editor restart the
human types `/tanto resume` in Kanri's window first and then in each other
window, in any order, with no address pasted; a row is marked `dead` only if
its session neither lists nor re-handshakes by the time the human says the
windows are done.

The rejected alternative was one listing per turn: it costs a turn's worth of
context for a state that changes once.
