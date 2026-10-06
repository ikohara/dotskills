---
id: "f03b"
title: two spawners ran for one repository and every request was taken twice
severity: high
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-06
---

Source: shoroku shoki-seat S-89

Measured 2026-10-04: a spawner started 2026-10-02, on the code before the
heartbeat, kept running after a new spawner took over the pid file at 03:13.
`stale spawner pid <n> ignored` stops only the new one from waiting on the
old; it ends nothing. Both processed one `spawn-kanri-successor` request (the
log shows `spawn … ok` twice at 03:54), so two Kanri successors started 41 ms
apart, and each `stop` ran twice — harmless there, since `No job matching` is
not a failure. A duplicated `spawn` for a Jisso or a shoki would start two
seats on one batch or one brief. Today only `tanto down` plus a human
`Stop-Process` clears it; the restart acts the plan asked of the human were
done, and the old process was missed.

The premise that made this look harmless does not hold. The shoki-seat
design's section 4.2 and the comment on `startSpawner` in
`skills/tanto/scripts/tanto.js` both say that a stale spawner left running
beside a new one is harmless because "both take requests by rename, so none
is handled twice". `takeRequests` in `skills/tanto/scripts/spawner.js` has no
such rename: it reads a request file, handles it, writes the result, and only
then removes the file, so nothing claims the file first and two spawners both
handle it. decision-262a's "never signal the stale PID" rests on that
premise. The double is not one machine's accident either: on the same day, on
the same machine, the same pairing — a spawner started 2026-10-02 with no
heartbeat file beside one started 2026-10-04 — ran for two other repository
roots, and three further roots held a pre-heartbeat spawner alone, which the
launcher does not count as live.

The repair, smallest first: a claim by rename in `takeRequests` — rename the
request before handling it, and skip it when the rename fails — with its
test, which makes the design's sentence true for two spawners on current
code; and, for a spawner on the code before the rename, which still doubles
until it is stopped, `tanto`'s start prints for a live PID with no heartbeat
the line `tanto down` already prints. Kin issue-73d6 and issue-a14f.

Carrier: the hotfix lane, taken on `main` right after the shoki-seat close's
merge, on the human's word in that close's kessai; whether a code change with
its test fits the lane is Kanri's ruling at the merge.

Resolved in the hotfix lane on `main` by the commit
`fix: a request taken by two spawners on one root is handled twice`
(shoki-seat R-15), the claim by rename in `takeRequests` with its test;
recorded at the run-owned-seats close (S-7).
