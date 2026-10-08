---
id: "13d2"
title: the launcher spawns a second Kanri when the spawner answers its resume with listed
severity: high
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-09
updated: 2026-10-09
---

Source: session 2026-10-09

`tanto` run while a Kanri is alive can start a second Kanri process on its own.
The launcher writes a `resume` for the Kanri the roster's first row names; the
spawner answers `error: listed` — the seat is alive in the spawner's listing —
and the launcher reads any resume error as "the Kanri is lost": it prints
`the Kanri resume failed — …; spawning a new Kanri` and writes a `spawn`.

Why that spawn is accepted with no handover: `kanriRequest` in
`scripts/tanto.js` marks the spawn `succeeds: <the Kanri whose resume failed>`
whenever the state file still holds that Kanri in a resumable status, and
`opSpawn` in `scripts/spawner.js` exempts the seat a request `succeeds` from
its one-holder guard, which a real handover needs. To the spawner the launcher's
"resume failed, spawn" branch is indistinguishable from a handover.

Observed 2026-10-09 01:25 (JST) in the spawner log. A `resume` of the live Kanri
from the launcher answered `error: listed`; one second later a `spawn` from the
same launcher answered `ok` and a second Kanri started, with no handover file.
A second `tanto` call 23 seconds later: `resume` answered `error: listed`, the
`spawn` answered `error: held: <the stray's id>`, the launcher entered the held
Kanri, whose `resume` answered `error: listed` again, and the launcher said the
resume failed. The stray Kanri found the live one in its start sequence (the
Second Kanri case), wrote nothing, and was stopped by the live Kanri's `stop`
request.

Why the launcher's listing lacked a seat the spawner's held: the freshly
spawned stray was invisible to the launcher's listing 23 seconds after its
spawn while the spawner listed it, so this was not a race. A terminal whose
`CLAUDE_CONFIG_DIR` differs from the spawner's lists a different registry
(issue-8a8f); which terminal it was is not recorded. The check that issue-8a8f
adds to `cmdUp` stops this route from a terminal under another config
directory. The branch itself stays reachable under one config directory
whenever the launcher's listing and the spawner's disagree for a moment.

The fix is launcher-side, in `scripts/tanto.js`, in the branch of `cmdUp` that
follows a `resume` result carrying an error:

- an answer that says the seat is alive or unreachable from this terminal —
  `listed`, `still listed`, `config dir mismatch — …` — never leads to a spawn:
  print one line saying that the spawner lists the Kanri and this terminal's
  listing does not, that a terminal with another `CLAUDE_CONFIG_DIR` is the
  usual cause, and that `tanto` is run from the terminal that started the run;
  then exit 1, writing no `spawn` request;
- a `resume` error of any other kind — `claude --resume: …`, a copy not
  removed, no transcript — keeps today's branch, the replacement of a Kanri
  that is truly lost;
- `enterHeldKanri` already fails on any resume error without spawning and needs
  no change beyond sharing the line;
- `scripts/spawner.js` is not touched: its guard and the `succeeds` exemption
  are what a Kanri handover depends on. For a later plan: the exemption trusts
  the request's word, and closing this branch closes the only sender that
  abuses it.

Regression tests in `tanto.test.js`: with the fake spawner answering `listed` to
the Kanri resume, `tanto` exits 1 with the line and the request directory holds
no `spawn`; and, unchanged, a `claude --resume` failure still leads to the
spawn marked `succeeds`.
