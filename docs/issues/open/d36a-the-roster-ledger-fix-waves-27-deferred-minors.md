---
id: "d36a"
title: the roster-ledger fix wave's 27 deferred minors, four of which change behavior
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: shoroku roster-ledger S-85

The `roster-ledger` fix wave (2026-10-08) deferred 27 minors from its three
tasks' reviews; R-12 item 4 sent them to the close as one row. The SDD ledger
that holds them is untracked, so the lines travel here as they stand, with one
more from the branch review (S-75) as the 28th.

**Order (shoroku roster-ledger S-95, the wave Jisso's ranking).** Four of the
27 change behavior and are acted on first; the remaining twenty-three are DRY,
naming, wrap, and documentation drift that change no action.

- **(a)** `tanto.js` 707-711 prints "entering it" and then refuses, a
  user-visible wrong line that the wave's own fix (d) introduced. **Done:**
  the hotfix lane landed it on `main` after this topic's merge, in the commit
  whose subject opens `fix: the launcher stops saying it enters a Kanri a tab
  holds`.
- **(d)** `--succeeds` can leave a non-`live` successor row against
  `roles/kanri.md` 191 (S-83, whose one record is here). **Done:** the same
  hotfix commit as (a).
- **(b)** `writeTogether` neither restores the file whose own write failed
  nor survives a failing restore, so the guarantee finding (b) asked for is
  narrower than its name. Heads the rest.
- **(c)** the two (b) tests assert byte equality only when the write failed
  and neither asserts the exit code or the message, so on POSIX as root they
  prove nothing. Heads the rest after (b).

Three of the lines are partly carried by the close's own `fix` batch: the
spec-2.3 line by S-82's `roles/kanri.md` sentence, and the `first:` form line
and the `roles/kanri.md` 109 line by S-84's. The role text halves landed
there; the spec halves stay on record here, the spec being a dated document.

The 27, as the SDD ledger lists them (markers added in brackets):

- Task F1: minor (deferred): the readings header is compared at four named
  cells (+ `Since`), not its 13 cells (`migrateRoster`).
- Task F1: minor (deferred): the readings-row count check
  (`reading.length !== 13`) has no test.
- Task F1: minor (deferred): the two R-8 item 1 (b) tests assert byte
  equality only `if (got.code !== 0)`, so they pass vacuously where the
  read-only file stays writable (root on POSIX); on this host the write fails
  (EPERM). [(c)]
- Task F1: minor (deferred): finding (4)'s exception to spec 2.3 (a rowless
  sessionId with a ledger is an `unresolved reading:` event, not a refusal)
  is recorded only in the report's Concerns; spec 2.3 and `roles/kanri.md`
  451-456 still describe the refusal and the Kanri-written event — goes to
  the report's Rulings needed / Shoroku proposal. [role text: S-82's fix]
- Task F1: minor (deferred): short seats rows are still padded in
  `migrateRoster` (a departure from the remedy's "differs"); belongs in
  Deviations with its reason.
- Task F1: minor (deferred): `writeTogether` does not restore the file whose
  own write failed (`done.push` after `writeDoc`) and a failing restore
  escapes as an uncaught exception (boundary.js 352-368). [(b)]
- Task F1: minor (deferred): the (b) tests' strong assertions are conditional
  on `got.code !== 0`, neither asserts rc 1 or the `wrote nothing —` line,
  the migrate test does not check stdout is empty (boundary.test.js 778-829).
  [(c)]
- Task F1: minor (deferred): a failed migrate write leaves the `.pre-migrate`
  copies and says "migrate wrote nothing"; migrate's refusal goes to stderr,
  its other refusals to stdout (boundary.js 2314-2334).
- Task F1: minor (deferred): `sessionsEnd`, `migrateArchive`,
  `migrateRoster`, `repairItems` still hand-scan `startsWith("|")`;
  `headerKey` sits beside `sameCells` (boundary.js 2077-2242).
- Task F1: minor (deferred): `RECORD_VALUES`/`RECORD_WRITES` are
  hand-maintained beside `REPEATABLE`, `BATCH_CELLS`, `ledgerFlags`; the
  `value !== true` filters at 1053 and 1119 are dead code (boundary.js
  212-251).
- Task F1: minor (deferred): a rowless peer reading is refused without
  `--ledger` and written as an `unresolved reading:` event with one,
  `needLedger` does not count peer-readings, and `record`'s two-file write
  (1288-1289) is a plain `writeDoc` pair that `writeTogether` could now
  cover.
- Task F1: minor (deferred): `enterHeldKanri` prints "…; entering it" and
  then returns `inTab("kanri")`, so the user reads "entering it" followed by
  "kanri is open in a VS Code tab" (tanto.js 707-711); check the `heldLine`
  assertions in `tanto.test.js` before moving the return. [(a), done by the
  hotfix lane]
- Task F1: minor (deferred): the duplicate-Name reading keeps the first
  reading, and with two seats rows sharing a Name `.pop()` hands the first
  reading to the last row (boundary.js 2158-2165).
- Task F1: minor (deferred): polish — `tableEnd` exported only for a unit
  test; new test titles carry process ids (`R-6 item 6 (2) (iii)`); the
  fix-wave tests sit at the end of the file under a banner.
- Task F2: minor (deferred): spec 2.4 line 333 ("Status `live` as today"),
  spec line 510 and `roles/kanri.md` 109 still describe only the Kanri
  `first:` form with counts and `live` on every rewrite; Kanri reads `first:`
  to compare sessionIds (kanri.md 105-110) and nothing tells it what the new
  `first: <role> … not a kanri row` form means — the text belongs to the docs
  pass (roles/ is fence 6, the spec is outside this task). [role text: S-84's
  fix]
- Task F2: minor (deferred): `--succeeds` no longer guarantees the
  successor's row is `live` — when the successor already holds a row
  (recorded from a census "Not held" line, later marked `dead`), the rewrite
  keeps that word, though `roles/kanri.md` 191 promises "It writes your row
  first in the table, `live`"; narrow and self-healing (the census's Returned
  act writes `--status live` for a `dead` row that runs); the brief mandated
  keeping the cell (boundary.js 959, 996-1013) — to Kanri's Rulings needed.
  [(d), done by the hotfix lane]
- Task F2: minor (deferred): the `fresh` skip in `writeEvent` is a
  loop-bound trick (`for (let i = fresh ? span.end : …)`), the function has
  seven positional parameters, and `fresh` collides with the cell array's
  name in `writeSeatRow` (boundary.js 614).
- Task F2: minor (deferred): `roster show`'s non-Kanri `first:` line prints
  `undefined` for a first row of fewer than ten cells (boundary.js 1641; the
  Kanri branch at 1644 has the same shape).
- Task F2: minor (deferred): the new `first:` form is undocumented in
  `roles/kanri.md` 109 (out of the task's files). [S-84's fix]
- Task F2: minor (deferred): census test coverage of short rows is narrow (no
  non-live short row, no one-cell row; a bare `|` line prints an empty role)
  (boundary.test.js 2023-2035).
- Task F2: minor (deferred): the census test's name claims "as roster show
  prints it" though `roster show` prints no No-session-id section
  (boundary.test.js 2023).
- Task F3: minor (deferred): `SKILL.md` 1452 (archive Writer cell) says
  `migrate` writes the archive "when it creates the file", though
  `cmdMigrate` also rewrites an existing archive to the template
  (`migrateArchive`) and appends the roster's `cleared` rows; the roster
  cell's "for the moves they make" (1451, 456) does not cover `migrate`'s
  reshaping — the right writers are named, only the occasion is narrow.
- Task F3: minor (deferred): `SKILL.md` rule 11 (1709-1713) ties
  `templates/roster.md` to `record` ("makes every write of that command
  refuse"), but `cmdArchive` (2035), `census`, and `roster show` also check
  the roster header against it.
- Task F3: minor (deferred): `SKILL.md` 1462, the ledger's Artifacts Writer
  cell, still names `boundary.js record` alone though `migrate --ledger`
  rewrites a ledger (1558-1559, kanri.md 115) — drift outside the closed
  list.
- Task F3: minor (deferred): Events "line" versus "entry": `roles/kanri.md`
  2034 now says "every entry under the roster's `## Events`", `SKILL.md` 512,
  1452, 1557 and `README.md` 323 say "line"/"Events lines"; the script moves
  an entry (a `-` line plus its indented continuation, boundary.js 1589)
  whole, so "entry" is the accurate word.
- Task F3: minor (deferred): the new lines are not rewrapped (`SKILL.md` 457,
  1714, 1503; `roles/kanri.md` 403; `README.md` 272, 277) — a reflow changes
  no word.
- Task F3: minor (deferred): `SKILL.md` 456-457 puts two dash pairs back to
  back ("only through `boundary.js` — `record`, and `archive` and `migrate`
  for the moves they make — never by hand — and has Kanri's row first"); a
  possible later wording uses parentheses and commas.

The 28th, from the branch review (S-75): `tanto.js` 395 and 413 take the key
as `path.basename(cell, ".jsonl")` while `boundary.js` keys by `sessionIdOf`
(1219-1226, which also maps `unavailable` to null): one cell grammar is
shared, two key grammars remain. Harmless now that `unavailable` is
unwritable; a Transcript cell `unavailable` left by an old roster is the
sessionId `unavailable` to the launcher and no key to the census. It is the
key-grammar class issue-f07a came from.

Line numbers are as of the fix wave's landing, 2026-10-08.

Carrier: Kept — (a) and (d) done by the hotfix lane, the rest to a later plan that
touches `boundary.js` and `tanto.js`.
