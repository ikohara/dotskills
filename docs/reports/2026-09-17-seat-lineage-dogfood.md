# The seat-lineage dogfood

This report covers the seat-lineage plan's dogfood run: a rewrite of `skills/tanto/`'s
own contract, role, and template files that moves Jisso from a symptom-triggered
replacement to a per-batch rotation queue filled at the plan's landing, and gives
every seat's exit a `release: /clear this window` line in place of the old
create/delete session lifecycle, among other renames (`candidate` → `item`,
`Shoroku candidates` → `Shoroku proposal items`, and others swept below). It
preserves, in a committed and tracked location, two pieces of record that today
exist only under the untracked `.tanto/seat-lineage/` tree — which nothing commits
and which will not survive the eventual cleanup of that topic workspace: Task
33's whole-tree sweep of the old values this plan contradicts, and Task 31's live
run of the consistency note's checks 6 and 7 against the landed tree.

## The old-value sweep

Task 33 ran the brief's 33 commands from the repository root, branch `seat-lineage`,
against the plan's already-landed batches. All 33 matched their expected result
(Step 3's `node --test` script-run finding, covered separately below, is a
distinct check from the brief and not one of these 33 commands); the full raw
output and per-command disposition live at `.tanto/seat-lineage/old-value-sweep.md`.
In brief order:

| # | Pattern swept | Result | Disposition |
| --- | --- | --- | --- |
| 1 | `exit-jisso` | 0 in every file (20 total) | matches |
| 2 | `docs: exit shoroku` | 0, 0, 0 | matches |
| 3 | `docs: T2 shoroku` | 1, 1 | matches |
| 4 | `Shoroku candidates` | 0 in every file (22 total) | matches |
| 5 | `candidate` (case-insensitive) | 0 in every file (22 total) | matches |
| 6 | `^## Shoroku proposal items$` | 1, 1 | matches |
| 7 | `^## Shoroku proposal$` | 1, 1 | matches |
| 8 | `Jisso replacement deferred` | 0, 0, 0, 0 | matches |
| 9 | `<dead, replaced, refused, or cleared>` | 1 | matches |
| 10 | `the Kanri exit` | 0 | matches |
| 11 | `asks for your deletion` | 0, 0 | matches |
| 12 | `your deletion follows` | 0 | matches |
| 13 | `Replace symptom` | 0, 0 | matches |
| 14 | `**Shoroku proposal** section` | 1, 1 | matches |
| 15 | `queued: <n>` | 1, 3, 1 (at least 1 each) | matches |
| 16 | `release: /clear this window` | 2, 1, 2, 2, 1, 1 (at least 1 each) | matches |
| 17 | no-role fixed text (`grep -rl`) | matched exactly `SKILL.md`, `templates/batch-prompt.md` | matches |
| 18 | `close: <topic> — ...` | 1, 1, 1 | matches |
| 19 | `^### Release$` | 1 | matches |
| 20 | `^### Delete$` | 0 | matches |
| 21 | `orders: plan=` | no output | matches |
| 22 | `lifecycle request` | no output | matches |
| 23 | `ask the human to delete` | no output | matches |
| 24 | `delete and create` | no output | matches |
| 25 | `the ceiling replaces Kanri and Jisso` | no output | matches |
| 26 | `Open a new session in <repo path>` | no output | matches |
| 27 | `every listed peer` | no output | matches |
| 28 | `the peers' deletion` | no output | matches |
| 29 | `kanri or jisso` (templates only) | no output | matches |
| 30 | `delet` (case-insensitive, read not counted) | 15 surviving lines, all classified | matches |
| 31 | `replacement` (case-insensitive, read not counted) | 13 surviving lines, all classified | matches |
| 32 | `only Kanri messages Jisso` | exactly 1 line | matches |
| 33 | `Sekkei, Keikaku, or Jisso started with no address` | exactly 1 line | matches |

Commands 30 and 31 were read, not counted: every surviving line was classified
individually against the brief's own rule rather than reduced to a pass/fail count.

For `delet` (command 30), all 15 survivors are about a **file** — the handover
file, the SDD workspace, the `.tanto/<topic>/` directory, an inbox copy, or a
template's "delete this blank"/placeholder-deletion instruction — except three
lines that are the brief's own named exceptions, which legitimately keep the word
"delet" as a stated **absence**, not a practice:

- `roles/kanri.md`'s Handover section, the successor's Next-step line: "no
  deletion is asked."
- `roles/kanri.md`'s "Exit shoroku" step 2: "No recommender runs here, and no
  delete request goes out."
- `roles/kanri.md`'s "Session lifecycle" opening: "There is no delete request: a
  seat's exit ends with your `release:` line."

For `replacement` (command 31), all 13 survivors are about a role the Replace
table still holds, Keikaku's own plan-writing rules, or Jisso's rotation being
described as its own replacement (the ceiling section's source text and its two
mirrors in `roles/kanri.md` and `roles/kaiseki.md`) — none refers to a Jisso
replaced on a symptom, the retired mechanism this plan removes.

Step 3's script-test command, `mise x node@22 -- node --test skills/tanto/scripts/`,
run exactly as the brief specifies, is a command-level failure in this local
environment, not a partial test failure: `node --test` treats the bare directory
argument as a CommonJS module path and throws `MODULE_NOT_FOUND` before any test
runs (`tests 1 / pass 0 / fail 1`), reproduced twice, with and without a trailing
slash. `git diff --stat -- skills/tanto/scripts/` is empty — no task in this plan
touched the directory — and substituting an explicit glob,
`mise x node@22 -- node --test "skills/tanto/scripts/**/*.test.js"` (diagnostic
only, not the brief's literal command), finds and runs the same two test files:
**103 tests, 103 pass, 0 fail.** The underlying suite is intact and green; the
brief's literal bare-directory invocation fails to resolve recursive test
discovery in this local Windows/mise/node setup — a distinct quirk from a
previously-diagnosed issue where running the suite from a WSL-mounted path
produced six unrelated test failures (a subset of tests failing, not a
command-level crash before any test runs) — and not a defect this plan caused.

## The consistency note's checks 6 and 7

Task 31 applied its six passages to `docs/notes/tanto-consistency-checks.md` and,
as its Step 4, ran the note's own check 6 main block, the new P31.4 sub-block, and
check 7 live against the landed tree, recording the result for reuse here.

**Check 6 main block** (32 `grep -c` lines, in file order) returned
`2, 1, 1, 4, 1, 1, 1, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1,
1, 1, 1, 1, 1`, against the note's own Expected list of `2, 1, 1, 3, 1, 1, 1, 1,
2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1`. Two
positions mismatched, neither inside Task 31's own six-passage scope
(`skills/tanto/SKILL.md` was not touched by that task) — but the two have
different causes, one caused by this plan and one predating it entirely:

- **Position 4**, `grep -cF 'kanri-address:' skills/tanto/SKILL.md`: the note
  expects `3`, the live tree gives `4` (occurrences at `SKILL.md` lines 391, 409,
  537, 607). This one is caused by this plan: `git blame`/`git show` on line 607
  confirms it is new text from the commit titled "every tanto line carries
  the no-role line, and every exit ends with release:", this plan's own Task 3
  — a passage that added a fourth `kanri-address:` line without a matching
  update to this note's Expected count. The other three occurrences (lines
  391, 409, 537) predate this plan: line 391/409 from the commit titled
  "address by born name, add the exit and bug-report terms" (2026-09-07), and
  line 537 from the commit whose subject is "the contract gains the
  transcript reading and Resuming" (2026-09-09).
- **Position 19**, `grep -cF 'the human by grant' skills/tanto/SKILL.md`: the note
  expects `3`, the live tree gives `4` (four Residency-table rows — Sekkei,
  Keikaku, Jisso, Kaiseki — at `SKILL.md` lines 25-28). This one predates the
  plan entirely: `git blame`/`git show` confirms all four rows carrying this
  phrase trace to the commit titled "name seven roles and eight ids in
  SKILL.md" (2026-09-13) — four days before `seat-lineage`'s own branch
  existed. This plan's own Task 1 (the commit whose subject is "the roles
  table, the invocation line, and the ceiling name one replaced seat") did
  touch the Jisso row, but only its other columns; `git show` on that commit
  shows no
  `+`/`-` on "the human by grant" itself.

**The P31.4 sub-block** (13 `grep -cF` lines, in file order) returned
`1, 3, 1, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1`. Against the note's Expected shape — the
first nine at least 1 each, the tenth and eleventh exactly 1, the last two
exactly 1 each — every line matched.

**Check 7** (23 grep lines: the first 13, the 14th, and 9 new lines) matched the
note's Expected paragraph throughout its claimed scope. Lines 1-13 each produced
no output and exited 1, as expected. Line 14 (a bare hex-hash sweep) sits outside
the Expected paragraph's own "no output" claim and did produce one line — a
commit-hash reference already present in `SKILL.md`, orthogonal to this plan and
out of scope to touch. Lines 15-23, the nine new P31.5 sweep lines this plan
added, all produced no output, matching the note's extended claim that nothing
matches "from the fifteenth through the twenty-third."

## What the READMEs' review found

Task 30 applied six passages to `skills/tanto/README.md`:

- The human's role in a window's lifecycle: "creates and deletes sessions" →
  "gives a window its role and takes it away."
- The context ceiling's subject narrowed from "Kanri and Jisso" to Kanri alone,
  with a new sentence describing Jisso as measured the same way but replaced by
  per-batch rotation rather than the ceiling.
- "adopted candidates" → "adopted items."
- The lifecycle-role-creation sentence rewritten so a role after Kanri starts
  when Kanri asks the human for a window — the plan's Jissos all requested
  together at the plan's landing.
- The window-reuse sentence rewritten so an editor restart is the normal case and
  a closed tab is the exception, since a finished seat's window is `/clear`ed and
  reused (keeping its name and `[ref]`) rather than closed.
- "the session holding the candidates writes" → "the session holding the items
  writes."

`skills/shoroku/README.md` was reviewed and left unchanged: `grep -ci 'candidate'
skills/shoroku/README.md` returned `0`, and `git diff --stat -- skills/shoroku/README.md`
produced no output — that file belongs to a different skill and is out of scope
for this plan.

## Measurements appended at T2

Added by this topic's close, once the fresh-start check has run and the Residency rows are final.
