# tanto's sweep run, measured on itself

The `tanto-sweep` plan ran on 2026-09-10: sixteen tasks across five Jisso
batches (A, B, C, D, and a final fix wave), a spec and plan written by an
`opus` Sekkei, and Kanri's T2 close over the run. This report is written at
that close, from the run's own instruments — the conductor ledger, the
roster, and the readings Jisso and Kanri sent at each boundary. Every figure
below is quoted as a source printed or recorded it.

## Measurements

### The roster's Residency rows of this run

One row per session the roster held current at this plan's close, copied
verbatim from the roster.

| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | dotskills-c5 [fe6b7a] | 2026-09-10 | tanto-sweep final boundary | 3854253 | 1286 | 48 | 0 | 5 | 0 | 0 |
| jisso | dotskills-8c [ea313c] | 2026-09-10 | tanto-sweep final report | 4928098 | 1969 | 57 | 0 | — | — | — |
| sekkei | dotskills-59 [cbd62d] | 2026-09-10 | exit write-out (tanto-sweep) | 4449225 | 1508 | 26 | 0 | — | — | — |
| kanri | dotskills-38 [5deb34] | 2026-09-09 | context-cost T2 direction | 5287752 | 1979 | 49 | 0 | 5 | 2 | 0 |

### Jisso's per-batch readings and work-and-rework

Jisso's context cost per batch, from the readings sent with each boundary
line — the figure the run exists to measure:

| Boundary | Bytes | Records | Wake-ups | Compactions |
| --- | --- | --- | --- | --- |
| batch A | 2,141,746 | 772 | 19 | 0 |
| batch B | 3,280,714 | 1,264 | 36 | 0 |
| batch C | 3,787,339 | 1,464 | 43 | 0 |
| batch D | 4,384,655 | 1,721 | 51 | 0 |
| final | 4,928,098 | 1,969 | 57 | 0 |

The shape is the finding, not the total. **Batch A alone is 43% of the whole
run's transcript** (2.14 MB of 4.93 MB) for 4 of 16 tasks, and the four
batches after it add 1.14, 0.51, 0.59 and 0.54 MB. Batch A is where the
instrument was built under TDD, with two of its four tasks taking two fix
rounds each; every later batch is passage edits, which are cheap. A plan that
front-loads its executable work should expect its first batch to cost as much
as the rest combined — and **zero compactions across a 4.9 MB, 57-wake-up
run** says the one-Jisso-for-the-whole-plan shape held comfortably.

Work and rework: 16 tasks, 38 commits on the branch, 5 batches plus the
temp-directory leak fix. **8 fix rounds total**, all in code: task 2 (2),
task 3 (2), the temp-directory leak fix (3), task 16 (1). **The ten passage
tasks — 5, 6, 7, 8, 9, 10, 11, 12, 13, 15 — took zero fix rounds between
them**, across 60-odd blocks. Passage editing with verbatim blocks and blob
reconstruction is close to a solved problem; the cost of this run was the
program. The whole-branch review: **0
Critical**, 6 Important, 6 Minor. The suite went 22 → 61 tests, of which
**12 were added beyond what the plan and the wave specified**, every one
because a mutation showed an existing check was unpinned.

### The opus-Sekkei measurement

Mid-dialogue the human judged the `opus` Sekkei's sharpness lower than the
`fable` Sekkeis' — 「切れ味がイマイチ」("its edge fell a bit short") — and the
run continued on `opus` to the end as planned, so the measurement completed.

The dialogue's cost: eleven turns to a settled design (later fifteen through
the plan gate), two of them the human overturning a Sekkei recommendation and
one a clarifying question; both gates `all OK`, 0 `change:`, 0 `later:`, and
4 decide answers (2 delegated to Sekkei's recommendation, 1 to Kanri's). By
seat: on the spec, 1 role-check (3 findings), 1 spec review (26: 10 high, 12
medium, 4 low), 2 Kanri cold reads; on the plan, 1 dry run (3), 1 plan review
(15: 4/6/5), 1 confirmation pass (7, 3 stops), 2 Kanri cold reads. Zero
findings were rejected, and 2 defects were introduced by Sekkei's own fix
passes. The reading at the plan commit: `4198213 B, 1414 records, 24
wake-ups, 0 compactions`. Eight subagent seats carried this: 1 spec reviewer
(`opus`), 1 drafter (`opus`), 1 dry run (`sonnet`), 2 plan reviewers
(`opus`), 3 re-sync/fix passes (`opus`).

Kanri's comparison, given to the human mid-run: passage craft and
responsiveness were good; every defect was of the "did not run or re-read
its own text" kind; the review net caught them all, so the cost moved to
Kanri and the reviewers — 26 + 15 + 7 findings, five Kanri cold-read
exchanges, nine spec and plan commits before the human's gates — and the
messages ran long. At Kanri's exit, the next topic's plan is to try `fable`
for the spec instead.

### The plan's instruments

Six seats found six disjoint defect classes on one plan, with no two
catching the same thing: Sekkei's pre-flight (count defects), Kanri's
role-check (procedure contradictions), the spec reviewer (untouched files),
Kanri's cold read (a check that could not fail), the dry run (two dead
needles), and the plan reviewer (tests and type contradictions) — the
sharpest measurement of this run. Across four rounds, six independent
parsers of the plan's passage blocks (Sekkei's pre-flight, the drafter's,
the dry run's, the spec reviewer's, two plan reviewers', each re-sync
agent's) recorded zero block-level failures ever, against roughly sixty
defects in the surrounding prose — 38 passes and 8 accepted findings over
about 1,700 lines of passage text with 0 defects.

At the batch B boundary, the instrument certified a run boundary for the
first time: `diff --plan <plan> --base <BASE>` printed `diff: clean` at exit
0 with the two created paths named, over eight passage commits across four
files, and Kanri re-ran the check rather than reading the claim.

A mid-run rebase — the human inserted the Biome commit ahead of the branch —
moved zero bytes of tracked content, because no tracked file names a commit
hash; every hash in the untracked reports and messages went stale at once.

Three expectations in this plan were written without accounting for a
change that came after them, and the fix wave's boundary was the third.
After the wave, `verify --task N` on the plan reported `passage-absent` for
exactly the six tasks whose passages the wave superseded (5, 6, 7, 8, 9, 12;
blocks P5.1, P6.1, P7.2, P7.7, P8.2, P9.4, P12.6) and clean or `no passages`
for the other eight; at the pre-wave commit all fourteen were clean but for
P12.4's false repetition. The boundary check that expected clean for all
fourteen after the wave was written without accounting for the wave's own
effect — the same class of defect as an earlier batch's superseded needle.

## Findings

1. **Mutation and reconstruction found what reading did not, in every
   batch.** Not once did a careful read of a diff surface an unpinned check;
   every one of them — the `MATCH`/`DIFFERS` comparison, the CR strip
   normalized away by its own fixture, the header-precision fix, the helper
   cleanup, the placeholder skip twice — came from breaking the code and
   watching a test fail to fail. This is the run's strongest methodological
   result.
2. **`verify` and reconstruction answer different questions**, and a wave of
   nineteen blocks needed both: `verify` asserts each new passage is present
   exactly once; only reconstruction shows nothing changed outside the
   blocks. Task 15's disclosed transcription slip is the case in point —
   `verify` would have caught the slip itself, and only reconstruction could
   show it had not recurred in the other eighteen.
3. **Three expectations in this plan were written without accounting for a
   change that came after them** — batch A's check 2 (needing 17 `ok` before
   task 8 could make it true), task 12's Step 9 (a needle the dry run had
   already superseded), and the wave's boundary check 4. All three read as
   failures against a correct tree. This is a plan-authoring failure mode
   worth naming on its own, because all three cost a stop-and-investigate and
   none was a defect in the work.
4. **Stopping rather than reconciling found three real defects.** Task 4
   (check 2 at 15), task 12 (Step 9's superseded needle), and task 16 (the
   six `passage-absent` results) were each an implementer declining to
   adjust a number to match an expectation. Had any of them reconciled, the
   finding would have vanished into a green report. The instruction that
   produced it — record what the tool printed, and if it differs, report it
   and stop — is cheap and should be standard in every dispatch.
5. **A refused permission is a result, not an obstacle to route around.** The
   recursive deletion of roughly 1,900 leaked scratch directories was
   directed by the batch prompt and approved by the human in Kanri's window,
   and the session's own policy refused it. No spelling that passes was
   sought — `fs.rmSync` from node or a `find … -exec` variant would have
   reached the same end while stepping around a decision the user's settings
   encode, and a peer's relay of approval is not that setting. This is the
   worked instance of the general rule (design-4807), including that the
   leak was fixed at source, so the leaked-directory count is static rather
   than growing.

The fix wave itself was written in the plan's own block grammar, and the
instrument checked it both before dispatch (`lint` caught a false citation,
`replay` a partial anchor) and after landing (`verify` clean, `diff` clean)
— the first document of the run whose Verify step was the instrument. This
is issue-96f2's answer, measured: a fix wave earns the plan's instrument by
being written in the plan's grammar.

The run's shape, in sum: batch A alone carried 43% of the whole run's
transcript; ten of the sixteen tasks were passage edits and took zero fix
rounds between them; and the cost that remained fell to the six seats of the
plan phase plus the whole-branch reviewer on the finished branch — seven
seats for the run.

Hotfixes since the previous plan: none.
