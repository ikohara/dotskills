---
id: "81c8"
title: run-owned-seats' deferred minors that still stand after the fix wave
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-86

The run-owned-seats whole-branch review checked these minors at the final
tree; R-11 left them out of the fix wave. Line numbers are as of that tree.

- `spawner.js`: `strand` records `stopped` with no `stoppedAtMs` (:1359);
  `stopToPark`'s failed-stop revert forces `running` and loses `kind` and
  `listedAtMs` (:1095-1096); `relist` applies the thirty-second window to a
  park by absence too (:1300); `endOnceSeats` acts on any non-`removed` once
  seat, `gone` and `stopped` included (:700); the `contract` mark is compared
  strictly with the number 2 (:1018, :1059); a successful `resume` keeps
  `stoppedAtMs` and `endedBy` (:657-664); the waiting notice interpolates a
  `—` topic raw (:1135, :377); `opLeave`, `opPark`, and `opHold` validate
  none of `after`, `pid`, `forMs`; the transcript is re-read whole at every
  pass for every parked or requesting seat (:1118, :1179).
- `boundary.js`: `wake` reads `stateSeats` right after the last result lands
  while the spawner writes the result before `seats.json`
  (`spawner.js`:1269-1271), so it can print `parked` for a seat just resumed
  (:1159-1161); `waitForResults` treats an unparsable result as missing
  (:1113-1117); `spawnedAs` prints for a listed `gone` seat (:812-814).
- `tanto.js`: `printSeats` exits 0 and reads every seat as unlisted when
  `claude agents` fails (:522-526); the attach's `spawnSync` result is
  dropped, so an ENOENT shows the leave line, the listing, and exit 0 (:599);
  `cmdTeishi --seats` waits for each stop in turn, up to 60 s each (:873-880).
- `templates/roster.md`:7-8 says every row is written by `record --seat`,
  while Kanri's bootstrap writes its own first row by hand (`kanri.md`:82-87).

Kin: issue-96f7 (shoki-seat's deferred minors), issue-37ec.

Carrier: Kept — three of the four bullets are `spawner.js`, `tanto.js`, and
`boundary.js`'s spawner-facing commands; the `templates/roster.md` bullet is
named for `roster-ledger`'s Sekkei to take or leave.
