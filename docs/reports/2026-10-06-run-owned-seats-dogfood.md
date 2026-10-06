# The run-owned-seats dogfood

This report covers the `run-owned-seats` plan's run, 2026-10-05 to
2026-10-06: the design in which every seat is spawned by the run and a seat
is its `sessionId` (decision-7a19), a dialogue seat is parked between its
turns at its own request (decision-97cc), and the launcher enters a seat by
role and follows a handover, with one word table for the launcher and
`/tanto` (decision-4d44). The plan, "run-owned-seats" (2026-10-05), ran 23
tasks in four batches (A, tasks 1 to 4; B, 5 to 7; C, 8 to 11; D, 12 to 23),
a fix wave of seven file-grouped tasks, one rework of that wave, and the
close's shusei. The report records how the spec and the plan were made, the
practices that held across the batches, the human's rulings, the per-boundary
context readings, the acceptance scene, and the residency rows of the run —
the facts that belong to a dated, frozen record.

## The spec stage

The spec, "run-owned-seats design" (2026-10-05), is about 2000 lines and
went through four texts in one day; its last batch (D) lands `SKILL.md`,
seven role files, four templates, and the README together under rule 11. The
plan's Keikaku, on a cheaper family, takes that whole. Whether a spec of this
size should be cut into two topics — the scripts, then the contract's text —
was not asked of the human.

The Sekkei was re-handshaken four times in one day, after an editor crash and
three window reloads — the cost this design removes, counted once.

The spec's first two texts carried conditional blocks for seven unmeasured
points. Running them the same day, with the human at the terminal for twenty
minutes, changed the design in one place (P-8, a line carried as a resume's
prompt starts a copy that acts on it) that no fallback had named.

## The plan stage

The 23-task plan (about 14,900 lines) was drafted by six `plan.draft`
subagents in parallel, one per file group. Two alternatives were rejected
on the way:

- **One `plan.draft` dispatch for the whole plan.** The spec is 2072 lines
  and the plan came to about 14,900; one drafter would have run out of turn
  before a fragment was whole, and a resume loop re-reads everything each
  round.
- **Cutting batch D (twelve tasks) into D1 to D3**, with only the last a safe
  boundary. Spec section 7 fixes four batches and says the run-time templates
  must land with the role files that key on them; the cost accepted is a
  Jisso that may grow long inside one batch, which Kanri can rotate at a task
  boundary (the plan's Batches table says so).

The cold read's question 1 proposed a narrower refusal in Task 2, so that a
`spawn` naming the holder it succeeds retires every other `gone` holder. It
was rejected because it changes spec 1.2's rule for every run to clear a
state one repository has; the plan instead has Kanri retire the stale Kanri
rows with `stop` requests at step 3 of the five steps after batch D, each
recorded `stopped` with no command by Task 1's `stop`.

## Batch A

A reviewer asserted "nothing in this repo shows a real CLI short id is a
prefix of the session UUID" and raised an Important on it, while `SKILL.md`
says the short id is the first eight hex digits of the `sessionId` and
`claude agents --json` shows it. A review brief that states measured facts
about the CLI (the short id's form) would have saved a wrong Important and a
ruling.

SDD's pre-flight scan table could not be written by reading a 14,920-line,
23-task plan inside a Jisso's context. What ran in its place was `lint`,
`replay`, a script over each task's Files and Interfaces (file-sharing pairs,
Consumes and Produces cross-references and their asymmetries, passage ids
defined against applied, commit and lint paths against Files) and an
identifier cross-check; it found three plan-text items. The dry run's
stage-wise suite run is what covered the logic of Tasks 5 to 11.

## The named risks in the quality dispatches

The quality dispatches carried named-risk lines — read, at HEAD, the sibling
file an earlier task landed, and check the fields it writes. In three batches
they found what a diff-only review could not, and the override row's reason
held each time:

- **Batch B.** That `spawner.js` writes the result file before the state file
  (`spawner.js:1269`, `1271`), so `wake` can print a stale status, and that a
  failed listing reads as "not listed".
- **Batch C.** Named risks that named the sibling file the task consumes
  (`spawner.js`'s `opHold`, `opResume`, `opStop`, `listedEntry`, and
  `boundary.js`'s `spawnerLine`) found the batch's one Important: Task 10's
  `prompt not delivered` fallback, a three-site read across `tanto.js`,
  `spawner.js`, and the plan's Task 22 text.
- **Batch D.** Each of the batch's Importants was found by comparing a
  document with a script or another document at HEAD (the census suffix, the
  shoki closing line, the wake counts, the writers paragraph), none from the
  diff alone.

## Batch D

The Jisso handed every dispatch two shared files in the SDD workspace
(`dispatch-rules-D.md` for implementers, `review-rules-D.md` for reviewers)
and kept each prompt to the task's own notes and named risks. An implementer
prompt held near 30 lines and a reviewer prompt near 40; nothing was pasted
twice, and no implementer asked a question.

A reviewer dispatched at the last task of a file, asked to run the plan's own
fence 4 rows and fence 5 terms scoped to that file, gave the boundary an
independent whole-file confirmation at Tasks 15, 19, 21, 22, and 23 (and the
whole-tree fences 1, 4, 5, and 6 at Task 23) before Kanri's verifier ran
them. It found no residual and cost one extra scratch script per review.

## The fix wave

A plan-mandated Important was ruled to stand and sent to Kanri, as for
Tasks 22 and 23 of batch D: three more in this wave (the failed-wake count
twice, the "(3.1)" pointer), all in text that Kanri's verdicts had given
verbatim.

## Rulings from the human

Three open questions of the plan went to the human through Kikaku on
2026-10-06. Items 1 and 2 were already among the items sent to the fix wave
and waited for the human's word; item 3 is the hotfix lane's. Items 1 and 2
landed in the spec and the fix wave; item 3 lands on `main` after this
close's merge.

1. **Spec 2.7 — a contract-2 dialogue seat with no transcript.** Chosen: it
   is `gone` with `no first turn`, not `parked`; the spec gains the sentence
   "One that leaves the listing with no transcript on disk has no
   conversation to park and never ran a turn: it is `gone` with the
   `no first turn` mark and notice (3.1), as a seat without the mark is.",
   `censusSeat`'s parked branch requires a transcript, and one test covers
   it. Why: spec 2.7's reason for "never `gone`" is that the conversation is
   on disk, so the rule's premise fails before the rule applies. Without the
   exception a dialogue seat that died before its first turn sits under
   **Parked** until a line is due to it — hours, for a Sekkei — and is found
   by two failed wakes and the Replace table; with it, the `no first turn`
   notice names `tanto <role> <topic>` at the census that sees it. Rejected:
   leaving 2.7 as written and relying on the failed wake.
2. **Spec 1.5 — `seat`'s exit 1 on a failed listing.** Chosen: the exit is no
   signal; `seat` exits 1 with `seat: the listing failed — <error>` and prints
   no entry line, `wake` prints `listing: <error>` and exits 1, and the
   session runs `seat` once more and on a second exit 1 goes on and says so,
   appending `seat: listing failed — <reason>` to its start line and its
   first tanto line. A tab that slipped through is caught at Kanri's next
   census under **Not held**. Why: stopping on exit 1 kills a legitimately
   spawned seat whenever `claude agents` hiccups at its start, and that seat
   has a transcript, so no notice fires and Kanri waits for a first line that
   never comes; going on lets a hand-opened tab through only when the tab and
   the listing failure coincide. Rejected: stopping on exit 1 — "conservative
   in name, but it acts on no evidence and produces the silent failure."
3. **`maxBuffer` in `passage-check.js`.** Chosen: not on the plan branch; the
   fix wave's boundary and the whole-branch review ran `diff` under a preload
   that widened the buffer, and the fix — one named constant passed to both
   `execFileSync` sites, lines 871 and 586 — lands in the hotfix lane on
   `main` between plans, right after this topic's merge. Why: the plan's
   Global Constraints list `passage-check.js` under "Files no task touches",
   and fence 6 fails the boundary when that file changes on the branch; a
   hotfix there would have turned one preload workaround into two known
   failures to accept by ruling. Rejected: the hotfix now, on the plan
   branch.

## Measurements

The ledger's per-boundary context readings (Kanri's, then the boundary's
Jisso's), with the cache regime `reading.js` printed:

| Moment | Kanri | Jisso | ttl |
| --- | --- | --- | --- |
| The topic's opening, 2026-10-05 | 164,303 | — | — |
| The plan's landing | 297,026 (+132,723) | — | — |
| Batch A | 216,684 | 375,538 | unknown |
| Batch B | 235,149 | 306,744 | 1h |
| Batch C | 249,020 | 332,106 | 1h |
| Batch D | 260,800 | 472,436 | 1h |
| The fix wave | 342,761 | 435,531 | 1h |
| `fixwave-rework-1` | 191,223 | 480,478 | 1h |
| The shusei | 235,808 | 213,978 | 1h |

The Kanri figures are several sessions', so differences between rows are
not growth.

The ledger's other always-present rows — the top-family peak and 429, the
top-family one-shots by kind, each role's last reading, and the share of
usage over the threshold — were not filled when the direction was written;
the residency rows below stand for the third.

### The acceptance scene

The spec's Verification was run as an acceptance scene on 2026-10-06, with
the human:

- **Step 1, the handover and the launcher — passed.** The successor
  `dotskills-kanri-614e` (68f49f6a) was spawned by the new spawner
  (`contract: 2`, `succeeds: 7125ee16`) and its own `seat` check printed
  `running ... background kanri open` at its start; the predecessor's `stop`
  left `seat` printing `stopped`; the successor's census printed itself under
  **Not held** with its spawn result, as spec 1.3 says. In the human's word,
  attached to the predecessor at the handover, the launcher switched him to
  the successor with nothing typed.
- **Step 2, `tanto kikaku` and its `context=` line — finding.** `tanto kikaku`
  started `dotskills-kikaku-9744` (92cf1230) at 07:12 and attached; its start
  line matched `sessions.kikaku`. The human could not see the `context=`
  line: `tanto.js` writes it to stdout immediately before `claude attach`,
  and the attach takes over the screen with no scrollback, so the line
  flashes by (the code order was checked, the flash itself was not). The
  figure stays reachable through `tanto jokyo` and `tanto --no-attach kikaku`.
- **Step 6, the standing request after a tab session — first run not passed,
  retry passed.** First run: `tanto kikaku` at 09:04:12 woke the parked
  Kikaku, the launcher released at 09:04:17 and the human left within 12 s
  with nothing typed; three minutes later `seat` still read `running` and
  `tanto jokyo` `idle`, not `parked`. The seat entry carried no `lastPark`, so
  `standingPark` had nothing to carry out: the tab's turn began a new turn,
  which deletes `lastPark`; the park request that turn wrote ended
  `left running — a tab holds it`, which sets none; and the tab's close was
  recorded by `parkByAbsence`, which sets none either. Retry (09:11 to
  09:15): with a turn typed and the launcher left, then `tanto kikaku` with
  nothing typed, the log read `park: ... listed again with no new turn` and
  `stopped` at 09:15, and `tanto jokyo` read `parked` about two minutes after
  the release. The standing request works once a park request has run, which
  a tab session breaks.
- **Step 7, `/tanto taiseki` in the Kikaku (tab) and the Hosa (terminal) —
  passed** on both ends (census **Ended** `stopped by taiseki`, `seat`
  `stopped`). The Kikaku answered within seconds. The Hosa's transcript has
  no assistant record for 5 min 38 s after the human typed the word, then the
  tool call and the stop; the delay sits before the model's first output, so
  the spawner and `request leave` are not it; cause unknown. A further
  `tanto kikaku` started a new conversation. The census kept printing the
  ended Kikaku's open tab under **Not held**.
- **Step 8, `tanto fukki` with Kanri alive — passed.** The messenger
  `dotskills-denrei-2409` delivered the one line at 09:33; Kanri acted on it
  only after `seat` printed role `denrei`, ran Recovery (nothing to put back),
  and the spawner removed the messenger at its turn's end, with no roster
  row.
- **Step 9, the first turn after each kind of wake.** From the transcripts of
  Kikaku 92cf1230 and Hosa 4c0ff6bf, the `usage` of the first assistant
  record after each wake, as cache_creation / cache_read tokens, with the
  minutes idle since that seat's last assistant record:

  | Wake | Seat | Idle | Creation / read |
  | --- | --- | --- | --- |
  | Spawn, first turn | Kikaku (fable) | — | 94,589 / 0 |
  | Spawn, first turn | Hosa (sonnet) | — | 60,457 / 32,295 |
  | Launcher attach and a typed turn | Kikaku | 92 min | 125,893 / 0 |
  | Launcher attach and a typed turn | Hosa | 95 min | 121,862 / 32,295 |
  | Tab | Kikaku | 25 min | 118,150 / 0 |
  | Tab | Kikaku | 8 min | 47,093 / 126,478 |
  | Kanri's `wake` and a `chore:` line | Hosa | 1 min | 3,532 / 103,811 |

  The wakes themselves cost nothing: the launcher's attaches and Kanri's
  `wake` each started no turn. The bill falls on the first turn after, and it
  follows the idle time, not the kind of wake; the three kinds were not
  measured at one idle time, so no kind-against-kind comparison stands. The
  32,295 read on the Hosa's cold turns is a shared prefix read from other
  sessions on the same family (an inference). `reading.js` printed `ttl=5m`
  for the Kikaku and `ttl=unknown` for the Hosa; the 8-minute tab turn still
  read the cache, which the figure does not explain.

### Residency

The residency rows of the run, copied from the roster when the close's
direction was written. The archive of earlier rows is untracked, and this
table is where the readings survive.

| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | dotskills-kanri-9e98 | 2026-10-06 | start | 610795 | 80 | 2 | 0 | context=125991 | 0 | 0 | 0 |
| kanri | — | dotskills-kanri-ad3c | 2026-10-06 | handover | 2091828 | 721 | 11 | 0 | context=320390 | 1 | 0 | 0 |
| kanri | — | dotskills-kanri-614e | 2026-10-06 | handover | 2635953 | 1136 | 31 | 0 | context=369594 | 0 | 0 | 0 |
| kanri | — | dotskills-kanri-1392 [7125ee16] | 2026-10-05 | handover | 1870556 | 655 | 12 | 0 | context=284786 | 4 | 0 | 0 |
| sekkei | run-owned-seats | dotskills-8e [0afcc9] | 2026-10-05 | spec accepted | 5019775 | 1545 | 53 | 0 | context=637233 | — | — | — |
| keikaku | run-owned-seats | dotskills-keikaku-run-owned-seats-9e0d | 2026-10-05 | coldread answered | 3262946 | 1434 | 19 | 0 | context=414783 | — | — | — |
| jisso | — | dotskills-jisso-run-owned-seats-c880 [0052e6da] | 2026-10-05 | batch A | 2932968 | 1058 | 21 | 0 | context=398009 | — | — | — |
| jisso | — | dotskills-jisso-run-owned-seats-c885 [8ba8fb17] | 2026-10-06 | batch B | 2354523 | 769 | 15 | 0 | context=323148 | — | — | — |
| jisso | — | dotskills-jisso-run-owned-seats-95e1 [d277e9da] | 2026-10-06 | batch C | 2700449 | 912 | 20 | 0 | context=341527 | — | — | — |
| kanri | — | dotskills-kanri-1392 | 2026-10-06 | batch D | 1667549 | 544 | 9 | 0 | context=260800 | — | — | — |
| jisso | — | dotskills-jisso-run-owned-seats-bd3e | 2026-10-06 | batch D | 4144245 | 1532 | 41 | 0 | context=472436 | — | — | — |
| jisso | — | dotskills-jisso-run-owned-seats-bd3e [740a6f15] | 2026-10-06 | batch D | 4290570 | 1568 | 41 | 0 | context=493916 | — | — | — |
| jisso | — | dotskills-jisso-run-owned-seats-2a7c | 2026-10-06 | batch fixwave-rework-1 | 4165069 | 1697 | 49 | 0 | context=481214 | — | — | — |
| hosa | — | dotskills-hosa-358b | 2026-10-06 | batch fix wave | 527500 | 90 | 3 | 0 | context=103813 | — | — | — |

Measured figures of the batches' suites, cycle times, and the seats' context
growth are kept in `docs/notes/tanto-measured-data-points.md`.
