# run-owned-seats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every seat is spawned by the run and the tab seat goes. A dialogue seat asks to be parked at the end of every turn and the spawner stops it once the turn has ended; a seat is addressed by its `sessionId`, its name looked up at the send; a parked seat is woken, never handed a line; the launcher enters a seat by role, follows a Kanri handover, and takes four words — `fukki`, `taiseki`, `teishi`, `jokyo`.

**Architecture:** Batch A changes `spawner.js` and its tests in four tasks (`turnEnded`, the seat schema, and `stop`; `spawn` and `resume` with `sessions.denrei`; the park, hold, and release ops; the census and the notices). Batch B changes `boundary.js` in two tasks (the census's `spawner:` line and six headings; the `request`, `seat`, `wake`, and `beat` subcommands) and the five templates a session reads once. Batch C changes `tanto.js` in four tasks (the word table and role resolution; the attach and the follow loop; `fukki` and `jokyo`; `teishi` and the old-shape line). Batch D, the plan's last batch and its safe boundary, writes the documents of spec section 6 in twelve tasks cut by file and by heading: `SKILL.md` in four, `roles/kanri.md` in four, the other six role files in two, the four run-time templates, and the README.

**Tech Stack:** Node 22 or later with no dependencies (`node --test`), Markdown, and the tanto skill's `passage-check.js` for every block below.

**Spec:** `docs/superpowers/specs/2026-10-05-run-owned-seats-design.md` — every task names the spec sections it carries out. The dialogue is `.tanto/run-owned-seats/dialogue.md` (D-1 to D-26); the reviews the spec already applies are `.tanto/run-owned-seats/spec-review.md` and `spec-review-2.md`.

**Every old block was read at `a89dd16`**, `main`'s tip and the merge base. The branch's only commits since are the spec's, so every file under `skills/tanto/` is that commit's.

**`node --test` takes the test files, not the directory.** The spec writes `node --test skills/tanto/scripts/`; on Node 24.16, the version installed here, a directory argument is read as one test file and fails at once. Every command below names `skills/tanto/scripts/*.test.js`.

**Reports and prompts follow the tanto templates.**

## Global Constraints

**This repository's rules (`AGENTS.md`), binding on every task:**

- Run `./scripts/lint.sh <the task's own changed paths>`, each path by its
  file name — never a directory — and fix every issue before committing.
  A hook that fixes a file fails the run with the fix left in the tree:
  re-run the same command, which then passes.
- Commit by explicit path, the message before the `--`:
  `git commit --only -m "<subject>" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- <paths>`.
  The index is shared with whatever else this checkout is doing. The
  trailer names the agent; a harness that supplies its own attribution
  line uses that line. A new file needs `git add -- <path>` first; this
  plan creates no file.
- Never `git add -A` / `.` / `-u`, a bare `git commit`, `git commit -a`,
  `--no-verify` or any other hook bypass; never amend a published commit;
  never push to `origin/main`. A task that seems to need one is a reason to
  stop and report, not to use it.
- Edit no `CLAUDE.md` or `AGENTS.md`, no repository-root Markdown, and no
  linter or formatter configuration. `skills/tanto/SKILL.md`, the seven
  `skills/tanto/roles/*.md`, and `skills/tanto/README.md` are agent
  instruction files under the same "Never do" rule; the approval for the
  passages this plan writes into them is the spec, accepted in
  `.tanto/run-owned-seats/dialogue.md` ("all OK", "(a) でよい", D-25 and
  D-26, after D-1 to D-24 section by section), and it covers exactly this
  plan's passages — no task extends an edit beyond its own blocks on the
  strength of it.
- AGENTS.md asks for a review of a skill's sibling `README.md` after
  `SKILL.md` is edited; in this plan that review is Task 23's blocks and
  nothing more, so no task but Task 23 touches `skills/tanto/README.md`.
- Every commit lands on the branch `run-owned-seats`. The merge into `main`
  is the human's, taken at the close; no task merges, rebases, or switches
  the branch.
- American English in every passage, comment, and commit message.

**Model families** (the built-in `skills/tanto/templates/tanto.json`; this
repository's `.claude/tanto.json` overrides Kikaku and Sekkei alone, and the
personal file sets `language` and `ceiling.kanri.batches` alone, read
2026-10-05 — a batch prompt names the family it dispatches with, read fresh
at its boundary): every task runs under a Jisso on `sonnet`, effort `xhigh`
(`sessions.jisso`); its `task.implement` subagent on `sonnet`, effort `high`;
an SDD fix round's escalation, rounds 4 and 5, on `opus`, effort `high`
(`task.escalate`); the spec and quality reviewers on `opus`, effort `medium`
(`task.review-spec`, `task.review-quality`); the boundary's verifier on
`sonnet`, effort `high` (`boundary.verify`).

**The shared-tree rule (contract rule 5).** A modification in the shared
checkout that a task or its own subagent did not make is not its to
discard: it is reported — the subagent tells its Jisso one line, the Jisso
tells Kanri one line — and is never run through `git checkout --` or
`git clean` on the task's own judgment. Only Kanri decides whether it is
stray.

**Node.** The tests run on Node 22 or later; this host has 24.16. A
boundary checks the version it ran on (How a batch is verified), and a task
that runs a test names no version of its own.

**Line endings.** This plan creates no Markdown file and moves none, so no
task restores one with `git checkout --`. On this Windows host a file the
Edit tool modifies keeps the line endings it had, and `passage-check.js`
normalizes CRLF before every comparison. A task that ever creates a
Markdown file writes `rm <path> && git checkout -- <path>` after its commit
into its own steps, since a written file lands `w/lf` here.

**Running the suite and the boundary.** The whole suite takes nine minutes on
this host — 461 seconds at the end of Task 11 alone, 539 to 545 with three
runs at once, and `spawner.test.js` by itself about eight — which is longer
than the Bash tool's ten-minute foreground maximum once `boundary --plan`
runs fence 2 and the six fences after it. A step that runs
`node --test skills/tanto/scripts/*.test.js` or one test file of it, and the
boundary's `passage-check.js boundary --plan`, runs in the background
(`run_in_background: true`) with its output redirected to a file, and its
result is read from that file once the completion notice arrives: the
`# tests`, `# pass`, and `# fail` lines of the TAP stream, or the `pass` and
`fail` lines of `boundary`. A run cut at a timeout is no result, and is never
read as a failure or as a pass; it is run again in the background. Only
`boundary.test.js` and `reading.test.js`, which take ten to twenty seconds,
may run in the foreground; `tanto.test.js` takes two to three minutes and
`spawner.test.js` about eight, and run in the background too.

**No measurement task, no alternative block (spec D-18).** Every figure the
design rests on is in the spec's "Measured while designing". No task of this
plan measures anything; the acceptance scene below is Kanri's and the
human's, not a task.

**A batch reaches every repository at its commit (spec section 7).** The skill
every repository loads is a link into this working tree, so a script of batches
A to C runs at the next launcher call anywhere, and a text of batch D is read
by the next session started anywhere. What section 2 of the spec does, it does
to a contract-2 seat alone, and the one-holder refusal reads the mark on the
request; the launcher asks nothing new of a run whose Kanri is not a contract-2
seat. A task that touches a script keeps both true: a test per behavior for a
seat with no `contract` mark, beside the one for a marked seat.

**Rule 11 — this plan edits the skill's own files.** While this plan is in
flight, the authority for its sessions is these Global Constraints, Kanri's
orders line, and the batch prompts — not `skills/tanto/`'s role text as it
stands on disk at any moment before the plan lands. Every Jisso of this
plan is spawned at the plan's landing with `queue=run-owned-seats`, reading
nothing until its own `batch:` line reaches it, so that every one of them
read the skill as it stood before batch A.

**Batch D is the safe boundary** — the first point from which a role may be
started or replaced, and the plan's last batch: it lands `SKILL.md`, the
seven role files, the run-time templates (`spawn-request.md`,
`kanri-handover.md`, `boundary-brief.md`, `batch-prompt.md`), and the README
in one batch, so that every file the plan touches agrees with every other.
When the whole-branch review's findings touch `SKILL.md`, a role file, or a
template, the safe boundary is the fix wave's landing instead. Until then no
role is replaced and no further role is created, except Kanri's own handover
and a Kaiseki, each a Kanri ruling `R-n`, and the step-4 handover below,
which is an order of these Constraints.

**What the run does at its own boundaries (spec section 7).**

- From batch B's boundary, the census prints **Parked** and **Ended**;
  should either print a row before the handover below, **Parked** asks for
  nothing to be marked and **Ended** is a row to write `stopped`.
- From batch C's boundary, the launcher's word is `tanto teishi`, and its
  old-contract lines about this run are not acted on.
- This run's own Kikaku and Sekkei are tab seats of the old contract to
  their end: their rows are written and released as the old contract says,
  whichever text the Kanri in the seat read, and `record --status` keeps
  `cleared` for that.
- From batch D's commit until the handover below, no new Kikaku and no
  Hosa can be started in this repository — a typed `/tanto kikaku` stops
  by spec 1.5, and `tanto kikaku` meets the older spawner; the Kikaku
  already open goes on until step 1.
- **After batch D is accepted**, in this order, before the whole-branch
  review:
  1. Kanri asks the human to close this run's old Kikaku tab, and any
     other old tab seat still open, and not to reopen them; it writes
     their rows as the old contract says, with an Events line (I-20).
  2. The human restarts the resident spawner: `tanto teishi`, then
     `tanto`, which enters Kanri again.
  3. Kanri reads `.tanto/spawner/contract`. Unless it holds `2`, it asks
     for step 2 again and starts nothing (I-17). It then retires the stale
     Kanri rows, since spec 1.2's refusal counts every seat of the role the
     state file holds, a `gone` one included: for each seat in
     `.tanto/spawner/seats.json` whose role is `kanri`, other than its own,
     that the listing does not show, it writes
     `{ "op": "stop", "sessionId": "<that seat's sessionId>" }`, which the
     restarted spawner, running Task 1's `stop`, answers by recording the
     seat `stopped` with no command. It reads `seats.json` back and goes on
     to step 4 only when its own seat is the one Kanri the file holds
     (when this plan was written the file held eight `gone` Kanri seats
     beside the running one, and the successor's `spawn` would have been
     answered `held:`). A seat the listing does show is no stale row: it
     is a second Kanri, and Kanri stops and asks the human.
  4. Kanri hands over. Its successor's `spawn` request carries
     `contract: 2` and `succeeds: <its own sessionId>` — an order of
     these Constraints, since the Kanri in the seat read the old text —
     and the successor, which reads batch D's text, is the Kanri of
     everything after: the scene, the review, the fix wave, the close
     (Finding 20). The human, attached by `tanto`, is taken to it by the
     launcher.
  5. **The acceptance scene** of the spec's "Verification", by that Kanri
     and the human. It is not a task of any batch and no Jisso runs it.
     That restart is the first run of the new spawner against the real CLI
     — the scripts' own tests use the `TANTO_CLAUDE` seam — and what the
     scene finds joins the whole-branch review's findings in the fix wave.
     Its observations go to the ledger's Measurements, the first at
     step 4, for the dogfood report.

**Files no task touches.** `templates/bug-report.md`,
`scripts/passage-check.js`, and `scripts/reading.js` (its test is Task 2's).
Every batch's boundary checks that none of them changed.

**Named-mechanism rule.** A task that introduces or changes a named
mechanism — a seat-schema field (`contract`, `parkedAtMs`, `stoppedAtMs`,
`listedAtMs`, `waiting`, `midTurn`, `parkRequest`, `lastPark`, `held`,
`kind`, `waitingFor`, `endedBy`, `requestId`, `once`), a request op or
field (`park`, `hold`, `release`, `self`, `after`, `forMs`, `succeeds`,
`once`), a census heading or suffix, a launcher word, a status word, a
section pointer — lists in its own text every other site, in the same file
and in the files this plan touches, that names the same mechanism, so its
reviewer checks them together. Each task's "Named-mechanism sites" note is
this rule applied.

**The SDD ledger** is `.superpowers/sdd/2026-10-05-run-owned-seats/progress.md`.

**The `replay-skip:` declarations.** `replay` already skips a fence whose
first word is `git` and every `passage-check.js verify`; the patterns below
are narrow on purpose, so that no fence of How a batch is verified matches
one and `boundary --plan` runs every check there:

```text
replay-skip: node --test skills/tanto/scripts/ — the scratch tree replay applies holds only the blobs of the paths this plan's passages touch, and a task's own test run needs the whole skill beside them
replay-skip: --test-name-pattern — a task's red or green run of named tests needs the whole skill, as above
replay-skip: ./scripts/lint.sh skills/ — the scratch tree carries no `.git`, `.pre-commit-config.yaml`, or the `mise`/`uv` toolchain `lint.sh` needs
```

## Batches

| Batch | Tasks | Delivers | Stop conditions at this boundary |
| --- | --- | --- | --- |
| A | 1-4 | `spawner.js` and its tests: `turnEnded`, the seat schema, and `stop`'s `self`, `after`, and `stoppedAtMs` (Task 1); `spawn`'s `contract`, `succeeds`, `once`, and `requestId`, the state file written before the transcript poll, `resume`'s refusals, listing cases, and copy check, and `sessions.denrei` (Task 2); the `park`, `hold`, and `release` ops, `tryPark`, and the standing request (Task 3); the census's `kind`, `status`, and `waitingFor`, `blocked` keyed on a prompt, `parked` seats visited, a contract-2 dialogue seat's absence read as `parked`, hold clearing, the `contract` file, the notices, and the hook line (Task 4) | `node --version` is 22 or later; the whole suite `skills/tanto/scripts/*.test.js` green; `passage-check.js verify` clean for Tasks 1-4; `./scripts/lint.sh` clean on every changed path; every O-needle of Tasks 1-4 at 0 over its stated files; `passage-check.js diff` clean outside `docs/superpowers/`; none of the files no task touches changed — every one a fence of How a batch is verified |
| B | 5-7 | `boundary.js` and its tests: the census's `spawner:` line, six headings, and their suffixes (Task 5); `request`, `seat`, `wake`, and `beat` (Task 6); the five templates a session reads once (Task 7) | everything batch A's row names, again; `passage-check.js verify` clean for Tasks 5-7; every O-needle of Tasks 1-7 at 0 over its stated files |
| C | 8-11 | `tanto.js` and its tests: the word table, flags, `USAGE`, role resolution, the older-spawner and moved-run checks, `contract: 2` on every `spawn` (Task 8); the attach, the follow loop, and the 4.5 printer (Task 9); `fukki` and `jokyo` (Task 10); `teishi`, the old-shape line, and the comments naming `tanto down` (Task 11); the launcher's old-contract line points at the README's "Moving a run", which Task 23 writes in batch D, so that pointer resolves at batch D's boundary and not before | everything batches A and B name, again; `passage-check.js verify` clean for Tasks 8-11; every O-needle of Tasks 1-11 at 0 over its stated files |
| D — the safe boundary, the plan's last batch | 12-23 | spec section 6's documents: `SKILL.md` in four parts by heading (Tasks 12-15); `roles/kanri.md` in four parts by heading (Tasks 16-19); the other six role files (Tasks 20-21); the four run-time templates (Task 22); `README.md` (Task 23) | everything batches A to C name, again; `passage-check.js verify` clean for Tasks 12-23; **every O-needle of the whole plan at 0 over its stated files**; the whole-skill sweep of the spec's first nine needles over `skills/tanto/` showing no hit outside its stated dispositions |

A stop condition worded as a property of the whole tree — "the suite is
green", "every O-needle … is 0", "no hit over `skills/tanto/`" — is backed
by a fence that sweeps the whole of that scope, not only the files the
batch wrote. The table's four batch rows plus one for the whole-branch
review's fix wave size Kanri's Jisso queue: **five** seats, spawned at the
plan's landing with `queue=run-owned-seats`. Batch D carries twelve tasks —
the spec fixes the batch (section 7, "in one batch") and leaves the cut
inside it to this plan, which cuts it by file and by heading; Kanri may
rotate its Jisso inside the batch at a task boundary.

## How a batch is verified

This plan ships Node scripts with their tests and Markdown (the contract,
the seven role files, templates, and the README), and carries passages. Every
boundary runs the fenced checks below, in order, from the repository's top
level; `boundary --plan` judges each by its exit status alone, and a batch
is accepted only when every one exits 0. Each fence reads the state the
batch left — which batch has landed is read from whether the branch has
changed the one file only that batch changes: `spawner.js` for A,
`boundary.js` for B, `tanto.js` for C, and `README.md` for D — so every one
is meaningful at every boundary. The per-task checks are the tasks' own:
`passage-check.js verify --task <N>` for every task the batch's row names,
run by the boundary as it runs every task's Verify step.

This plan writes no JSON file, and no frontmatter but what a task loads for
itself. `git` opens every fence but the first: `replay` skips a fence whose
first word is `git`, and each needs the checkout the scratch tree is not. The
dry run therefore exercised the first fence alone, and `boundary --plan` is
the first run of the others.

**1. The runtime.** Node 22 or later; the version is printed.

```bash
node -e 'const major = Number(process.versions.node.split(".")[0]); console.log(`node ${process.version}`); process.exit(major >= 22 ? 0 : 1)'
```

Expected: `node v24.16.0` on this host, exit 0.

**2. The whole suite.** Every test file of `skills/tanto/scripts/`, TAP
output, its `# pass` and `# fail` lines printed; any failure, or a run that
ends without a `# fail 0` line, exits 1. About ten minutes on this host.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
out="$(mktemp)"
node --test --test-reporter=tap skills/tanto/scripts/*.test.js >"$out" 2>&1
status=$?
grep -E '^# (tests|pass|fail) ' "$out"
grep -E '^not ok ' "$out"
fails="$(sed -n 's/^# fail //p' "$out")"
rm -f "$out"
[ "$status" -eq 0 ] && [ "$fails" = "0" ] || exit 1
```

Expected: `# fail 0`, and `# pass` equal to `# tests`.

**3. Lint, by name.** Every path the branch has changed under
`skills/tanto/`, each named.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
mapfile -t paths < <(git diff --name-only "$(git merge-base main HEAD)" -- skills/tanto)
[ "${#paths[@]}" -gt 0 ] || { echo "no changed path under skills/tanto/"; exit 1; }
./scripts/lint.sh "${paths[@]}"
```

Expected: every hook `Passed` or `Skipped`, no file changed.

**4. The old values.** Every O-needle of the plan that the plan's own replay shows at zero in every file it was found in at the base, each over exactly those files; a needle with a hit in a file it was found in at the base is a deliberate residual, stated in its O block's text and swept by fence 5, and is not listed here. A needle gates on the latest batch among its files: batch A's at every boundary, batch B's once `boundary.js` has changed, batch C's once `tanto.js` has changed, batch D's once the README has. A needle with a hit prints it and fails the check.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
base="$(git merge-base main HEAD)"
landed=A
git diff --quiet "$base" -- skills/tanto/scripts/boundary.js || landed=B
git diff --quiet "$base" -- skills/tanto/scripts/tanto.js || landed=C
git diff --quiet "$base" -- skills/tanto/README.md || landed=D
echo "old values after batch $landed"
residual=0
while IFS='^' read -r batch needle scope; do
  [ -n "$needle" ] || continue
  case "$landed$batch" in AA|BA|BB|CA|CB|CC|DA|DB|DC|DD) ;; *) continue ;; esac
  hits="$(git grep -F -c -e "$needle" -- $scope | awk -F: '{ s += $NF } END { print s + 0 }')"
  if [ "$hits" -ne 0 ]; then
    echo "residual $hits: $needle"
    git grep -F -n -e "$needle" -- $scope
    residual=1
  fi
done <<'NEEDLES'
A^A terminal seat's name^skills/tanto/scripts/spawner.js
A^if (seat) seat.status = "stopped";^skills/tanto/scripts/spawner.js
A^On a resume it is the CLI's normal line^skills/tanto/scripts/spawner.js
A^request.sessionId, "--bg"])^skills/tanto/scripts/spawner.js
A^handleRequest(root, request, seats);^skills/tanto/scripts/spawner.js
A^[bbbbbb]", id: "bg02"^skills/tanto/scripts/spawner.test.js
A^woke session bg02^skills/tanto/scripts/spawner.test.js
A^got.id, "bg02"^skills/tanto/scripts/spawner.test.js
A^Object.keys(sessions).length, 8^skills/tanto/scripts/reading.test.js
A^"attention", "ack"];^skills/tanto/scripts/spawner.js
A^session.state !== "blocked"^skills/tanto/scripts/spawner.js
A^replace("<id>"^skills/tanto/scripts/spawner.js
A^claude attach ${seat.id}^skills/tanto/scripts/spawner.js
A^reopened with^skills/tanto/scripts/spawner.js
A^id: stale.id, state: "blocked"^skills/tanto/scripts/spawner.test.js
A^{ ...rest, state: "blocked" }^skills/tanto/scripts/spawner.test.js
A^{ ...s, state: "blocked" }^skills/tanto/scripts/spawner.test.js
A^cwd: ws.root, kind: "background", state: "blocked" }^skills/tanto/scripts/spawner.test.js
B^session.state === "blocked"^skills/tanto/scripts/boundary.js skills/tanto/scripts/spawner.js
B^the census names no cause^skills/tanto/scripts/boundary.js
B^The four headings^skills/tanto/scripts/boundary.js
B^CENSUS_HEADINGS = ["Listed", "Not listed"^skills/tanto/scripts/boundary.js
B^firstTurnMarks^skills/tanto/scripts/boundary.js
B^pid: 1112, state: "blocked"^skills/tanto/scripts/boundary.test.js
B^under its four headings^skills/tanto/scripts/boundary.test.js
B^(background) — blocked — no first^skills/tanto/scripts/boundary.test.js
B^Three subcommands^skills/tanto/scripts/boundary.js
B^check|record|census <options>^skills/tanto/scripts/boundary.js
B^names the three that exist^skills/tanto/scripts/boundary.test.js
B^cleared row stays^skills/tanto/templates/roster.md
B^refused, or cleared moves^skills/tanto/templates/roster.md
B^refused, or cleared>^skills/tanto/templates/roster-archive.md
B^or refused and why^skills/tanto/templates/roster.md
B^accepted or refused^skills/tanto/templates/kanri.md
B^replaced, refused, or^skills/tanto/templates/roster-archive.md skills/tanto/templates/roster.md
B^records a handshake that got no row^skills/tanto/templates/roster.md
B^This is the address book^skills/tanto/templates/roster.md
B^and names no cause. Either^skills/tanto/templates/roster.md
B^no-role from^skills/tanto/templates/roster.md
B^status words are seven^skills/tanto/templates/roster.md
B^a window to queue^skills/tanto/templates/kanri.md
B^window behind it may have been^skills/tanto/templates/shoki-brief.md
C^claude attach bg01^skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js
C^[<root>]^skills/tanto/scripts/tanto.js
C^resolveRoot(positionals[0])^skills/tanto/scripts/tanto.js
C^cmdDown^skills/tanto/scripts/tanto.js
C^"down", ws.root^skills/tanto/scripts/tanto.test.js
C^LAUNCHER, "down"^skills/tanto/scripts/tanto.test.js
C^test("down^skills/tanto/scripts/tanto.test.js
C^[ws.root, "--timeout"^skills/tanto/scripts/tanto.test.js
C^launch(ws, [inner])^skills/tanto/scripts/tanto.test.js
C^kanriRequest(root, sessions);^skills/tanto/scripts/tanto.js
C^prints the one line the human types next^skills/tanto/scripts/tanto.js
C^claude attach ${attach}^skills/tanto/scripts/tanto.js
C^interactive tab; hand over first^skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
C^Ctrl+Z to the shell^skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
C^claude attach bg^skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js
C^claude attach/.test^skills/tanto/scripts/tanto.test.js
C^then type /tanto fukki there^skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
C^assert.match(got.out, /tanto fukki/);^skills/tanto/scripts/tanto.test.js
C^fukki is printed^skills/tanto/scripts/tanto.test.js
C^s.state !== "stopped"^skills/tanto/scripts/tanto.js
C^[pidPath(root), heartbeatPath(root)]^skills/tanto/scripts/tanto.js
D^windows back^skills/tanto/roles/kanri.md skills/tanto/templates/roster.md
D^VS Code restart^skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md
D^Kanri sends only to^skills/tanto/SKILL.md skills/tanto/templates/roster.md
D^is resumed; one it holds as^skills/tanto/SKILL.md skills/tanto/scripts/tanto.js
D^a tab seat Kanri released with^skills/tanto/SKILL.md
D^one, which is a bare window^skills/tanto/SKILL.md
D^writes the Events line a shoroku proposal not^skills/tanto/SKILL.md
D^is ever sent: the row is^skills/tanto/SKILL.md
D^knows — and Kanri marks the row^skills/tanto/SKILL.md
D^list those eight ids^skills/tanto/SKILL.md
D^The keys carry a spawned seat's orders^skills/tanto/SKILL.md
D^ask them to run^skills/tanto/SKILL.md
D^Its eight keys are the seven^skills/tanto/SKILL.md
D^the released lines^skills/tanto/SKILL.md
D^in Kanri's window and in any words^skills/tanto/SKILL.md
D^a bare 再開 there is ambiguous^skills/tanto/SKILL.md
D^Handshake and roster^skills/tanto/SKILL.md
D^mode=^skills/tanto/SKILL.md skills/tanto/roles/kanri.md
D^transcript=^skills/tanto/SKILL.md skills/tanto/templates/roster.md
D^a handshake that got no row^skills/tanto/SKILL.md skills/tanto/templates/roster.md
D^handshake is refused, as^skills/tanto/SKILL.md
D^roster's stopped, dead, replaced, refused, and cleared rows^skills/tanto/SKILL.md
D^except while a restart is being^skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/templates/roster.md
D^Kanri sends only to the names of^skills/tanto/SKILL.md
D^word everywhere else^skills/tanto/SKILL.md
D^model-mismatch^skills/tanto/SKILL.md skills/tanto/roles/kanri.md
D^since a resumed session carries a^skills/tanto/SKILL.md
D^in Kanri's window by^skills/tanto/SKILL.md
D^live Hosa^skills/tanto/README.md skills/tanto/SKILL.md
D^its three subcommands are^skills/tanto/SKILL.md
D^read-only, it prints the roster's^skills/tanto/SKILL.md
D^lines to tab seats;^skills/tanto/roles/kanri.md
D^shake hands — you receive them from tab seats^skills/tanto/roles/kanri.md
D^name [ref]^skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/templates/boundary-brief.md
D^in a tab — and carry it^skills/tanto/roles/kanri.md
D^handshake and this start line is the only place^skills/tanto/roles/kanri.md
D^with your bare name as the address^skills/tanto/roles/kanri.md
D^send no handshake — and a Residency^skills/tanto/roles/kanri.md
D^performs it, and the orders line you^skills/tanto/roles/kanri.md
D^orders line and every request you write^skills/tanto/roles/kanri.md
D^Until the orders line has gone to Sekkei^skills/tanto/roles/kanri.md
D^Wait for the human and for handshakes^skills/tanto/roles/kanri.md
D^is named in Sekkei's orders line for^skills/tanto/roles/kanri.md
D^as the place to decide it — a^skills/tanto/roles/kanri.md
D^ed its window and you started in it^skills/tanto/roles/kanri.md
D^unless the predecessor was an interactive tab^skills/tanto/roles/kanri.md
D^typed by the human in an attached Kanri, or^skills/tanto/roles/kanri.md
D^should hand over or this window should be^skills/tanto/roles/kanri.md
D^whose census, once the human says the windows are back^skills/tanto/roles/kanri.md
D^## On a handshake^skills/tanto/roles/kanri.md
D^Reply with the role's standing orders as^skills/tanto/roles/kanri.md
D^or a model mismatch, gets **no row**^skills/tanto/roles/kanri.md
D^Send nothing to a name whose roster row is not^skills/tanto/roles/kanri.md
D^one is a bare^skills/tanto/roles/kanri.md
D^your line arrived: mark its row^skills/tanto/roles/kanri.md
D^named in its Sekkei's orders line;^skills/tanto/roles/kanri.md
D^follow the constraints, your orders line, and the^skills/tanto/roles/kanri.md
D^No handshake arrives and none is^skills/tanto/roles/kanri.md
D^outlives the topic its orders line^skills/tanto/roles/kanri.md
D^If an ask of the human is due^skills/tanto/roles/kanri.md
D^line goes to it and nothing is^skills/tanto/roles/kanri.md
D^call, and send^skills/tanto/roles/kanri.md
D^naming any Kaiseki ask^skills/tanto/roles/kanri.md
D^with no census first^skills/tanto/SKILL.md skills/tanto/roles/kanri.md
D^request for a terminal^skills/tanto/roles/kanri.md
D^cleared" --status^skills/tanto/roles/kanri.md
D^released at step 4^skills/tanto/roles/kanri.md
D^to the Jisso that ran the last implementation batch^skills/tanto/roles/kanri.md
D^release at the boundary, not one^skills/tanto/roles/kanri.md
D^the spare queued window is named^skills/tanto/roles/kanri.md
D^sent on the roster as recorded^skills/tanto/roles/kanri.md
D^create Kaiseki; after its handshake^skills/tanto/roles/kanri.md
D^which is not released^skills/tanto/roles/kanri.md
D^its form check, then^skills/tanto/roles/kanri.md
D^the handshakes, a resume^skills/tanto/roles/kanri.md
D^no resume self-check at any of these points^skills/tanto/roles/kanri.md
D^census to detect (1.7)^skills/tanto/roles/kanri.md
D^is the identity, and no request and no ask^skills/tanto/roles/kanri.md
D^open topic, each with its Topic and what it is waiting for^skills/tanto/roles/kanri.md
D^name and place and get nothing^skills/tanto/roles/kanri.md
D^and a Keikaku whose last line did the same is^skills/tanto/roles/kanri.md
D^record its rows; then^skills/tanto/roles/kanri.md
D^kessai: <topic> — claude attach <id>^skills/tanto/SKILL.md skills/tanto/roles/kanri.md
D^the spawner filling the id from^skills/tanto/roles/kanri.md
D^type, ← back to the^skills/tanto/roles/kanri.md
D^The session writes it, runs its resume^skills/tanto/roles/kanri.md
D^release: /clear this window^skills/tanto/SKILL.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md
D^released —^skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/templates/roster.md
D^A tab seat that has stopped answering is past answering^skills/tanto/roles/kanri.md
D^know, mark the row^skills/tanto/roles/kanri.md
D^Hosa; you are the intake only^skills/tanto/roles/kanri.md
D^a suggestion to open one (^skills/tanto/roles/kanri.md
D^you may probe the family once^skills/tanto/roles/kanri.md
D^a terminal seat, or go to^skills/tanto/roles/kanri.md
D^human-needed: <role> <topic> — claude attach <id>^skills/tanto/SKILL.md skills/tanto/roles/kanri.md
D^each in that role's orders line at^skills/tanto/roles/kanri.md
D^chores, in the line you answer its^skills/tanto/roles/kanri.md
D^a permission dialog, the model-mismatch stop^skills/tanto/roles/kanri.md
D^of an idle Kikaku^skills/tanto/roles/kanri.md
D^or Hosa window, your own handover^skills/tanto/roles/kanri.md
D^the human's word that the windows are back^skills/tanto/roles/kanri.md
D^A **terminal seat** — Keikaku, Jisso^skills/tanto/roles/kanri.md
D^you ask the human for, and Kikaku and Hosa the human^skills/tanto/roles/kanri.md
D^Every ask is this numbered list^skills/tanto/roles/kanri.md
D^1. In a free window of <repo path>^skills/tanto/roles/kanri.md
D^There is no delete request for a tab^skills/tanto/roles/kanri.md
D^under four headings^skills/tanto/SKILL.md skills/tanto/roles/kanri.md
D^handshake; after a send to a peer errors^skills/tanto/roles/kanri.md
D^except while a restart is being recovered^skills/tanto/roles/kanri.md
D^listed name and the^skills/tanto/roles/kanri.md
D^a usage-limit pause, and a seat idling on a kessai all read^skills/tanto/roles/kanri.md
D^with a space and^skills/tanto/roles/kanri.md
D^a handshake or a result file^skills/tanto/roles/kanri.md
D^row holds is a window not yet handshaken^skills/tanto/roles/kanri.md
D^**While a restart is being recovered**^skills/tanto/roles/kanri.md
D^recovery: begun^skills/tanto/roles/kanri.md skills/tanto/templates/roster.md
D^The requests you write, and the asks you make.^skills/tanto/roles/kanri.md
D^for a live terminal seat to be held^skills/tanto/roles/kanri.md
D^**Asks**, which are the numbered list above^skills/tanto/roles/kanri.md
D^run "A seat's exit", then the ask;^skills/tanto/roles/kanri.md
D^not replaced: mark the row^skills/tanto/roles/kanri.md
D^then, if the case is open, the ask with the same brief^skills/tanto/roles/kanri.md
D^| Sekkei is gone before the spec review is accepted | the ask;^skills/tanto/roles/kanri.md
D^revert stray instrumentation if it is not; the ask;^skills/tanto/roles/kanri.md
D^no released line and no^skills/tanto/roles/kanri.md
D^step 3) — and send^skills/tanto/roles/kanri.md
D^rows and send^skills/tanto/roles/kanri.md
D^A refused handshake has no row^skills/tanto/roles/kanri.md
D^which covers the tab seats too^skills/tanto/roles/kanri.md
D^### Recovery after a VS Code restart^skills/tanto/roles/kanri.md
D^for a terminal Kanri^skills/tanto/roles/kanri.md
D^ask for the roles still missing^skills/tanto/roles/kanri.md
D^Kanri never asks for a Kikaku^skills/tanto/roles/kikaku.md
D^s this window when the subject changes^skills/tanto/roles/kikaku.md
D^stays accepted^skills/tanto/SKILL.md skills/tanto/roles/kikaku.md
D^handshake^skills/tanto/SKILL.md skills/tanto/roles/hosa.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kanri.md skills/tanto/roles/keikaku.md skills/tanto/roles/kikaku.md skills/tanto/roles/sekkei.md skills/tanto/scripts/boundary.js skills/tanto/templates/kanri.md skills/tanto/templates/roster.md
D^release:^skills/tanto/SKILL.md skills/tanto/roles/hosa.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kanri.md skills/tanto/roles/kikaku.md skills/tanto/roles/sekkei.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md
D^/clear^skills/tanto/SKILL.md skills/tanto/roles/hosa.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kanri.md skills/tanto/roles/keikaku.md skills/tanto/roles/kikaku.md skills/tanto/roles/sekkei.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md
D^Kanri's reply^skills/tanto/SKILL.md skills/tanto/roles/kaiseki.md skills/tanto/roles/sekkei.md
D^Kanri never requests a Hosa^skills/tanto/roles/hosa.md
D^Kanri's answer names^skills/tanto/roles/hosa.md
D^from a session of this one — and one that^skills/tanto/roles/hosa.md
D^Before the human closes the session^skills/tanto/roles/kaiseki.md
D^You are released only once^skills/tanto/roles/kaiseki.md
D^A tab seat is never^skills/tanto/templates/spawn-request.md
D^for the first Kanri^skills/tanto/templates/spawn-request.md
D^what Kanri sets for every seat it spawns^skills/tanto/templates/spawn-request.md
D^fills a bare^skills/tanto/scripts/spawner.test.js skills/tanto/templates/spawn-request.md
D^in it is filled by the^skills/tanto/templates/spawn-request.md
D^a stopped Jisso's or Keikaku's conversation^skills/tanto/templates/spawn-request.md
D^it waits for none of them^skills/tanto/templates/spawn-request.md
D^name> [<ref>]^skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/scripts/boundary.test.js skills/tanto/templates/batch-prompt.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/roster-archive.md skills/tanto/templates/roster.md
D^by name and place^skills/tanto/templates/kanri-handover.md
D^name [ref]>^skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/templates/boundary-brief.md
D^self-check^skills/tanto/SKILL.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kanri.md skills/tanto/roles/keikaku.md skills/tanto/roles/sekkei.md skills/tanto/templates/boundary-brief.md
D^terminal seat^skills/tanto/README.md skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/keikaku.md skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js skills/tanto/scripts/spawner.js skills/tanto/templates/roster.md
D^tab seat^skills/tanto/README.md skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md skills/tanto/templates/spawn-request.md
D^tanto down^skills/tanto/README.md skills/tanto/SKILL.md skills/tanto/scripts/tanto.js
D^orders line^skills/tanto/README.md skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/keikaku.md skills/tanto/roles/sekkei.md skills/tanto/templates/kikaku-decision.md skills/tanto/templates/roster.md
D^2.1.280^skills/tanto/README.md
D^claude attach <id>^skills/tanto/README.md skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js
D^opened by the human^skills/tanto/README.md skills/tanto/SKILL.md
D^is a tab the human^skills/tanto/README.md
D^live Hosa, or to Kanri when none is live^skills/tanto/README.md
NEEDLES
[ "$residual" -eq 0 ] || exit 1
echo "every old value at 0"
```

Expected: `old values after batch <A, B, C, or D>`, then `every old value at 0`.

**5. The whole-skill sweep.** The spec's first nine needles over the files each batch has landed — the scripts a batch changes at its own boundary, everything else at batch D's — so that a passage the plan did not name, in a file it did not touch, cannot keep one. Two terms keep stated dispositions: the status word `cleared` in backticks stays only in `roles/kanri.md`, where an old-contract row is read and left for the archive (spec 4.7), and `claude attach` stays only in the launcher's own code and tests, the spawner's hook line for a session the state file does not hold and its test, the README's prerequisites, and C-1's sentence — `README.md` and `SKILL.md`; a hit anywhere else prints and fails the check.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
base="$(git merge-base main HEAD)"
files=()
git diff --quiet "$base" -- skills/tanto/scripts/spawner.js || files+=(skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js)
git diff --quiet "$base" -- skills/tanto/scripts/boundary.js || files+=(skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js)
git diff --quiet "$base" -- skills/tanto/scripts/tanto.js || files+=(skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js)
if ! git diff --quiet "$base" -- skills/tanto/README.md; then
  mapfile -t files < <(git ls-files -- skills/tanto)
fi
[ "${#files[@]}" -gt 0 ] || { echo "no batch has landed"; exit 1; }
echo "sweep over ${#files[@]} files"
status=0
for term in 'tab seat' 'terminal seat' 'handshake' 'release:' 'released —' '/clear' 'orders line' 'tanto down' 'cmdDown' 'self-check' '<name> [<ref>]' '<name [ref]>'; do
  if git grep -F -n -e "$term" -- "${files[@]}"; then echo "term still present: $term"; status=1; fi
done
if git grep -F -n -e '`cleared`' -- "${files[@]}" | grep -v -E '^skills/tanto/roles/kanri\.md:'; then echo 'a backticked cleared outside roles/kanri.md'; status=1; fi
if git grep -F -n -e 'claude attach' -- "${files[@]}" | grep -v -E '^skills/tanto/(README\.md|SKILL\.md|scripts/spawner(\.test)?\.js|scripts/tanto(\.test)?\.js):'; then echo "claude attach outside its dispositions"; status=1; fi
[ "$status" -eq 0 ] || exit 1
echo "no stale term outside its dispositions"
```

Expected: `sweep over <n> files`, then `no stale term outside its dispositions`.

**6. Files no task touches.** None of them changed since the branch left
`main`.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
git diff --quiet "$(git merge-base main HEAD)" -- skills/tanto/templates/bug-report.md skills/tanto/scripts/passage-check.js skills/tanto/scripts/reading.js || { echo "a file no task touches changed"; exit 1; }
echo "untouched: bug-report.md, passage-check.js, reading.js"
```

Expected: the `untouched:` line, exit 0.

**7. The passages against the branch.** `passage-check.js diff` from the
merge base: every added line is text the plan quotes and every removed line
lies inside one of its fences. The spec and the plan under
`docs/superpowers/` are Sekkei's and Keikaku's commits, not a task's, so
their lines are filtered out; any other `unaccounted-added` or
`unexplained-removed` line fails the check.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
out="$(node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --base "$(git merge-base main HEAD)")"
status=$?
[ "$status" -le 1 ] || { printf '%s\n' "$out"; exit 1; }
left="$(printf '%s\n' "$out" | grep -E '^(unaccounted-added|unexplained-removed): ' | grep -v -E '^(unaccounted-added|unexplained-removed): docs/superpowers/')"
if [ -n "$left" ]; then
  printf '%s\n' "$left"
  exit 1
fi
echo "diff: clean outside docs/superpowers/"
```

Expected: `diff: clean outside docs/superpowers/`.

## Tasks

### Task 1: `turnEnded`, the seat schema, and `stop`'s `self`/`after`/`stoppedAtMs`

Spec 2.8 ("The turn ended", the six states, the ops table's two `stop`
rows), 5.1's spawner half (no command for a seat a tab holds), 5.2's
spawner half (a `self` stop for a seat the human paces), and section 6's
seat-schema list for `scripts/spawner.js`. After this task `spawner.js`
exports `turnEnded`, documents every field a seat carries, runs
`claude stop` only for a seat a fresh listing shows in the background,
writes `stoppedAtMs` on every seat it records `stopped`, and ends a Kikaku,
a Hosa, or a standalone Kaiseki on its own `stop` with `self`, at once in a
tab or unlisted and once its turn has ended in the background.

**Files:**

- Modify: `skills/tanto/scripts/spawner.js` — `readSeats`'s doc comment
  (the schema); `TURN_SETTLED_MS`, `CLOSING_SUBTYPES`, and `turnEnded` after
  `transcriptOf`; `seatName`'s comment; `STANDING_WAIT_MS`, `pacedByHuman`,
  `markStopped`, `listedEntry`, `opStop`, `tryLeave`, `opLeave`, and
  `leavePass` after `runWithEitherId`; `handleRequest`'s `stop` branch; one
  `leavePass` call at the end of `takeRequests` and one before `runCensus`'s
  `writeSeats`; `module.exports`.
- Test: `skills/tanto/scripts/spawner.test.js` — `putSeats`, `writeRecords`,
  `REC`, and `ENDED_TURN` before `spawnerLog`; six tests after "stop falls
  back to the short id when the CLI takes only that form".
- Test: `skills/tanto/scripts/tanto.test.js` — "down --seats reports a
  failed stop and exits 1", whose failing seat is now one the listing does
  not show (Task 11 renames the word this test types; its blocks start from
  this task's text).

**Interfaces:**

- Consumes: nothing from another task.
- Produces: `turnEnded(transcript, after)` → `null` (unreadable, or `after`
  not in it) or `{ ended, newTurn, midTurn }`, exported, which Task 2's
  `once` seat, Task 3's park, Task 4's `parked`, and Task 6's `boundary.js
  seat` read; `STANDING_WAIT_MS` (ten minutes), which Task 3's park reuses;
  `listedEntry(root, sessionId, sessions)` → `{ entry }` or `{ error }`,
  which Tasks 2 and 3 reuse; `markStopped(seat, endedBy)`. A `stop` result
  carries `note: "in a tab"` or `note: "already exited"` when no command
  ran; a `self` stop answers `error: "not a seat the human paces"`, a
  `stopped` result, or `leaveRequested: <atMs>` while its turn runs, and its
  drop raises `taiseki not done: <role> — tanto <role>`. A seat may carry
  `stoppedAtMs`, `endedBy: "taiseki"`, and `leaveRequest: { after, atMs }`.
  The test file gains `putSeats(ws, seats)`, `writeRecords(ws, sessionId,
  records)`, `REC`, and `ENDED_TURN`, which Tasks 2 to 4 reuse.

**Named-mechanism sites.** `turnEnded` and its three words are also
`boundary.js seat`'s fifth word (Task 6) and the `ended`/`open` of
`SKILL.md`'s "The roster" and "Messages" (Tasks 13, 14). The `stop` op's
`self` and `after` are also `boundary.js request leave` (Task 6),
`templates/spawn-request.md`'s op list (Task 22), `SKILL.md`'s "Session
exit" (Task 14), and the `taiseki` steps of `roles/kikaku.md` (Task 20),
`roles/hosa.md` and `roles/kaiseki.md` (Task 21). The notes `in a tab` and
`already exited` on a `stop` result are also `templates/spawn-request.md`'s
result paragraph (Task 22), `SKILL.md`'s "Session exit" (Task 14), and
`roles/kanri.md`'s "A seat's exit" (Task 18); `rm`'s `already exited` and
`takeRequests`' `ok (<note>)` log line are unchanged. `stoppedAtMs` is also
read by Task 2's `resume` guard and written by `tanto.js`'s `teishi --seats`
(Task 11). The notice `taiseki not done:` is also `SKILL.md`'s "Session
exit" (Task 14) and the README's taiseki paragraph (Task 23). The schema's
`status` words are also `boundary.js census`'s headings (Task 5),
`tanto.js jokyo`'s third column (Task 10), and `SKILL.md`'s "Artifacts"
`.tanto/spawner/` row (Task 15).

**O1.1** `A terminal seat's name` — `seatName`'s comment, the one `terminal seat` in the scripts (section 6 names it "the header comment's"; the header carries none); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.2** `if (seat) seat.status = "stopped";` — the `stop` branch that ran `claude stop` for every seat and wrote no stamp (spec 2.8, 5.1); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**A1.3** `skills/tanto/scripts/spawner.js` — `grep -c "leavePass(root, seats" skills/tanto/scripts/spawner.js` — before: 0, after: 3

- [ ] **Step 1: Write the failing tests**

Apply P1.4 to P1.6 and P1.15: the transcript helpers before `spawnerLog`; three
`turnEnded` tests and three `stop` tests after the short-id `stop` test;
and `tanto.test.js`' "down --seats reports a failed stop", whose failing
seat is one the listing does not show — a stop that now runs no command
and succeeds — so that the failure becomes the CLI's own refusal of a
listed seat.

**P1.4** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
function spawnerLog(ws) {
```

**P1.4 →**

```js
/** Put these seats into seats.json, as an earlier pass of the spawner would have left them. */
function putSeats(ws, list) {
  fs.writeFileSync(path.join(ws.root, ".tanto", "spawner", "seats.json"), JSON.stringify({ seats: list }));
}

/** A transcript of `records`, one JSON line each, at `writeTranscript`'s path (spec 2.8). */
function writeRecords(ws, sessionId, records) {
  const file = writeTranscript(ws, sessionId);
  fs.writeFileSync(file, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`);
  return file;
}

// Transcript records in the shapes spec 2.8 reads. A closing `system` record
// carries no uuid, as many records do not.
const REC = {
  human: (uuid, extra = {}) => ({ type: "user", uuid, message: { role: "user", content: "go on" }, ...extra }),
  result: (uuid) => ({ type: "user", uuid, message: { role: "user", content: [{ type: "tool_result" }] } }),
  tool: (uuid, id) => ({ type: "assistant", uuid, message: { id, model: "claude-opus", stop_reason: "tool_use" } }),
  end: (uuid, id) => ({ type: "assistant", uuid, message: { id, model: "claude-opus", stop_reason: "end_turn" } }),
  close: (subtype) => ({ type: "system", subtype }),
  synthetic: (uuid) => ({
    type: "assistant",
    uuid,
    message: { id: "msg-synthetic", model: "<synthetic>", stop_reason: "stop_sequence" },
  }),
};

// A turn that ends on a request: the request is the turn's last tool call
// (`after` is its uuid), then its result and the closing message, settled
// by the Stop hook's record.
const ENDED_TURN = [
  REC.human("u1"),
  REC.tool("u2", "m1"),
  REC.result("u3"),
  REC.end("u4", "m2"),
  REC.close("stop_hook_summary"),
];

function spawnerLog(ws) {
```

**P1.5** `skills/tanto/scripts/spawner.test.js` — replace exactly these 6 lines

```js
  const stops = calls(ws).filter((argv) => argv[0] === "stop");
  assert.deepEqual(
    stops.map((argv) => argv[1]),
    ["sess-new", "bg01"],
  );
});
```

**P1.5 →**

```js
  const stops = calls(ws).filter((argv) => argv[0] === "stop");
  assert.deepEqual(
    stops.map((argv) => argv[1]),
    ["sess-new", "bg01"],
  );
});

test("turnEnded reads a turn's end over messages: a cli tail, a tab's tail, one message in two records (spec 2.8)", () => {
  const { turnEnded } = require("./spawner.js");
  const ws = workspace();
  const file = (records) => writeRecords(ws, "sess-t", records);
  const ended = { ended: true, newTurn: false, midTurn: false };
  const cli = [REC.human("u1"), REC.end("u2", "m1"), REC.close("stop_hook_summary"), REC.close("turn_duration")];
  assert.deepEqual(turnEnded(file(cli)), ended);
  assert.deepEqual(turnEnded(file([REC.human("u1"), REC.end("u2", "m1"), REC.close("stop_hook_summary")])), ended);
  // A tab's turn writes no turn_duration (0 of 79 in the review's count).
  const tab = [
    REC.human("u1", { entrypoint: "claude-vscode" }),
    { ...REC.end("u2", "m1"), entrypoint: "claude-vscode" },
    { ...REC.close("stop_hook_summary"), entrypoint: "claude-vscode" },
  ];
  assert.deepEqual(turnEnded(file(tab)), ended);
  // A thinking record and a text record of one message.id are one message.
  const split = [REC.human("u1"), REC.end("u2", "m1"), REC.end("u3", "m1"), REC.close("stop_hook_summary")];
  assert.deepEqual(turnEnded(file(split), "u1"), ended);
  assert.equal(turnEnded(file(split), "u-absent"), null);
  assert.equal(turnEnded(path.join(ws.root, "no-such.jsonl")), null);
});

test("turnEnded settles a final message by the file's age, and reads a tool_use and a synthetic close as mid-turn (spec 2.8)", () => {
  const { turnEnded } = require("./spawner.js");
  const ws = workspace();
  const unsettled = writeRecords(ws, "sess-t", [REC.human("u1"), REC.end("u2", "m1")]);
  assert.deepEqual(turnEnded(unsettled), { ended: false, newTurn: false, midTurn: false });
  const old = new Date(Date.now() - 11000);
  fs.utimesSync(unsettled, old, old);
  assert.equal(turnEnded(unsettled).ended, true);
  const onTool = writeRecords(ws, "sess-t", [REC.human("u1"), REC.tool("u2", "m1")]);
  assert.deepEqual(turnEnded(onTool), { ended: false, newTurn: false, midTurn: true });
  const synthetic = writeRecords(ws, "sess-t", [REC.human("u1"), REC.tool("u2", "m1"), REC.synthetic("u3")]);
  assert.deepEqual(turnEnded(synthetic), { ended: true, newTurn: false, midTurn: true });
});

test("turnEnded sees a new turn after `after`, begun by the human's record or by a peer's isMeta one (spec 2.8)", () => {
  const { turnEnded } = require("./spawner.js");
  const ws = workspace();
  // The request's own tool result follows `after` and begins no turn.
  const settled = turnEnded(writeRecords(ws, "sess-t", ENDED_TURN), "u2");
  assert.deepEqual(settled, { ended: true, newTurn: false, midTurn: false });
  for (const next of [REC.human("u5"), REC.human("u5", { isMeta: true })]) {
    const turn = turnEnded(writeRecords(ws, "sess-t", [...ENDED_TURN, next]), "u2");
    assert.deepEqual(turn, { ended: false, newTurn: true, midTurn: true });
  }
});

test("stop runs claude stop only for a seat listed in the background, and writes stoppedAtMs (spec 2.8, 5.1)", () => {
  const ws = workspace();
  const entry = (sessionId, kind, extra = {}) => ({
    sessionId,
    id: `id-${sessionId}`,
    name: sessionId,
    cwd: ws.root,
    kind,
    pid: 4321,
    ...extra,
  });
  setState(ws, {
    sessions: [
      entry("sess-bg", "background"),
      entry("sess-tab", "interactive"),
      entry("sess-off", "background", { hidden: true }),
    ],
  });
  const ids = ["sess-bg", "sess-tab", "sess-off", "sess-done", "sess-rm"];
  const status = { "sess-done": "stopped", "sess-rm": "removed" };
  putSeats(
    ws,
    ids.map((sessionId) => ({
      sessionId,
      name: sessionId,
      role: "jisso",
      topic: "t",
      status: status[sessionId] || "running",
    })),
  );
  const asked = Object.fromEntries(ids.map((sessionId) => [sessionId, request(ws, { op: "stop", sessionId }).id]));
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "stop")
      .map((argv) => argv[1]),
    ["sess-bg"],
  );
  const note = (sessionId) => result(ws, asked[sessionId]).note;
  assert.equal(note("sess-bg"), undefined);
  assert.equal(note("sess-tab"), "in a tab");
  assert.equal(note("sess-off"), "already exited");
  assert.equal(note("sess-done"), "already exited");
  assert.equal(note("sess-rm"), undefined);
  const byId = Object.fromEntries(seats(ws).map((seat) => [seat.sessionId, seat]));
  for (const sessionId of ["sess-bg", "sess-tab", "sess-off"]) {
    assert.equal(byId[sessionId].status, "stopped");
    assert.equal(byId[sessionId].stoppedAtMs, STARTED_AT);
  }
  assert.equal(byId["sess-done"].stoppedAtMs, undefined);
  assert.equal(byId["sess-rm"].status, "removed");
});

test("a self stop is refused for a seat the human does not pace, and ends a paced one in a tab or unlisted at once (spec 5.2)", () => {
  const ws = workspace();
  setState(ws, {
    sessions: [
      { sessionId: "sess-tab", id: "tab1", name: "dotskills-7b", cwd: ws.root, kind: "interactive", pid: 4321 },
    ],
  });
  putSeats(ws, [
    { sessionId: "sess-j", name: "j", role: "jisso", topic: "t", status: "running" },
    { sessionId: "sess-a", name: "a", role: "kaiseki", topic: "t", status: "running" },
    { sessionId: "sess-tab", id: "tab1", name: "k", role: "kikaku", topic: "—", status: "running" },
    { sessionId: "sess-off", name: "h", role: "hosa", topic: "—", status: "parked" },
  ]);
  const leave = (sessionId) => request(ws, { op: "stop", sessionId, self: true, after: "u2" }).id;
  const asked = { jisso: leave("sess-j"), attached: leave("sess-a"), tab: leave("sess-tab"), off: leave("sess-off") };
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, asked.jisso).error, "not a seat the human paces");
  assert.equal(result(ws, asked.attached).error, "not a seat the human paces");
  assert.equal(result(ws, asked.tab).note, "in a tab");
  assert.equal(result(ws, asked.off).note, "already exited");
  const byId = Object.fromEntries(seats(ws).map((seat) => [seat.sessionId, seat]));
  for (const sessionId of ["sess-tab", "sess-off"]) {
    assert.equal(byId[sessionId].status, "stopped");
    assert.equal(byId[sessionId].endedBy, "taiseki");
  }
  assert.equal(byId["sess-j"].endedBy, undefined);
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 0);
});

test("a self stop in the background waits for its turn's end, and is dropped ten minutes on with a notice (spec 5.2)", () => {
  const paced = (ws) => {
    setState(ws, {
      sessions: [
        { sessionId: "sess-k", id: "bg01", name: "k", cwd: ws.root, kind: "background", pid: 4321, status: "busy" },
      ],
    });
    const transcript = writeRecords(ws, "sess-k", ENDED_TURN.slice(0, 2));
    putSeats(ws, [
      { sessionId: "sess-k", id: "bg01", name: "k", role: "kikaku", topic: "—", status: "running", transcript },
    ]);
    return request(ws, { op: "stop", sessionId: "sess-k", self: true, after: "u2" }).id;
  };
  const ws = workspace();
  const asked = paced(ws);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, asked).leaveRequested, STARTED_AT);
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 0);
  writeRecords(ws, "sess-k", ENDED_TURN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "stop")
      .map((argv) => argv[1]),
    ["sess-k"],
  );
  assert.equal(seats(ws)[0].status, "stopped");
  assert.equal(seats(ws)[0].endedBy, "taiseki");
  assert.equal(seats(ws)[0].leaveRequest, undefined);

  const late = workspace();
  paced(late);
  run(late, ["run", "--root", late.root, "--once"]);
  run(late, ["run", "--root", late.root, "--once"], { env: { TANTO_NOW_MS: String(STARTED_AT + 600000) } });
  assert.equal(seats(late)[0].status, "running");
  assert.equal(seats(late)[0].leaveRequest, undefined);
  assert.deepEqual(notices(late), ["taiseki not done: kikaku — tanto kikaku"]);
  assert.match(spawnerLog(late), /leave: sess-k dropped — its turn did not end/);
});
```

- [ ] **Step 2: Run the new tests to verify they fail**

```bash
node --test --test-name-pattern "turnEnded|stop runs claude stop|self stop" skills/tanto/scripts/spawner.test.js
```

Expected: FAIL — `turnEnded` is not a function; `claude stop` runs for the
tab's seat and the unlisted one, and no seat carries `stoppedAtMs`; a
`self` stop is an ordinary `stop`, so the Jisso is stopped and nothing
carries `endedBy`.

- [ ] **Step 3: Read a turn's end, document the seat, and stop by the listing**

Apply P1.7 to P1.14.

**P1.6** `skills/tanto/scripts/tanto.test.js` — replace exactly these 2 lines

```js
    { sessionId: "sess-missing", id: "bg99", name: "seat-missing [999999]", role: "jisso", status: "running" },
  ]);
```

**P1.6 →**

```js
    { sessionId: "sess-missing", id: "bg99", name: "seat-missing [999999]", role: "jisso", status: "running" },
  ]);
  // A seat the listing does not show is recorded stopped with no command
  // (spawner spec 2.8), so the failure here is the CLI refusing a listed one.
  const state = JSON.parse(fs.readFileSync(ws.state, "utf8"));
  fs.writeFileSync(ws.state, JSON.stringify({ ...state, fail: { stop: "refused" } }));
```

**P1.15** `skills/tanto/scripts/tanto.test.js` — replace exactly these 2 lines

```js
  assert.equal(got.code, 1);
  assert.match(got.err, /tanto: stop sess-missing failed/);
```

**P1.15 →**

```js
  assert.equal(got.code, 1);
  assert.match(got.err, /tanto: stop sess-live failed/);
```

**P1.7** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
function readSeats(root) {
```

**P1.7 →**

```js
/**
 * `seats.json` holds one array, `seats`. A seat carries what its spawn knew
 * — `sessionId`, `id`, `name`, `role`, `topic`, `model`, `effort`, `mode`,
 * `worktree`, `cwd`, `startedAt`, `startedAtMs`, `transcript` — the marks
 * earlier rules set — `renamed`, `goneAt`, `noFirstTurn`, `strayed`,
 * `undelivered` — and these (spec 2.8, section 6):
 *
 * - `status`, one of six: `running` (listed with a pid, in the background or
 *   in a tab), `blocked` (listed in the background on a prompt), `parked` (a
 *   contract-2 dialogue seat not listed), `gone` (any other seat not
 *   listed), `stopped`, and `removed`.
 * - `contract` — the `spawn` request's mark, `2` under this contract (spec
 *   1.1): the park, the hold, and the census's `parked` touch a seat that
 *   carries it. `requestId` — the request file that spawned it. `once` — a
 *   seat stopped and removed once its turn has ended (spec 4.4).
 * - `kind` — the listing's, `background` or `interactive`, at the last
 *   census pass; `waitingFor` — a `blocked` seat's cause (spec 2.6).
 * - `parkRequest`, `lastPark`, `waiting`, `midTurn` — the park (spec 2.3,
 *   2.7); `held` — the hold (spec 2.4); `leaveRequest` — a `self` stop
 *   waiting for its turn's end, and `endedBy: "taiseki"` once it is done
 *   (spec 5.2).
 * - `parkedAtMs`, `stoppedAtMs`, `listedAtMs` — epoch milliseconds, as
 *   `startedAtMs` is, and never compared with the minute-resolution
 *   `stamp()` strings the file also carries.
 */
function readSeats(root) {
```

**P1.8** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
    pause(root, TRANSCRIPT_POLL_MS);
  }
  return null;
}
```

**P1.8 →**

```js
    pause(root, TRANSCRIPT_POLL_MS);
  }
  return null;
}

// A final message is settled once a closing `system` record follows it, or
// once the transcript has not been written for this long (spec 2.8): a turn
// taken in a tab writes no `turn_duration`, and a session with no Stop hook
// writes no `stop_hook_summary` either.
const TURN_SETTLED_MS = 10000;

/** The `system` records the harness writes after a turn's final message (S-2, P-1b). */
const CLOSING_SUBTYPES = ["turn_duration", "stop_hook_summary"];

/**
 * "The turn ended" (spec 2.8), read over messages and not records: the
 * transcript's `user` and `assistant` records that are not `isSidechain` and
 * come after the record whose `uuid` is `after` — all of them with no
 * `after` — with consecutive `assistant` records of one `message.id` taken
 * as one message, since a final message is often a thinking record and a
 * text record that both carry `stop_reason: end_turn`. Returns null when
 * the transcript cannot be read or does not hold `after`, which no caller
 * takes for an end; otherwise:
 *
 * - `ended` — the last message is an `end_turn` assistant that is settled,
 *   or the harness's own `<synthetic>` record, which closes a turn left
 *   open when a session is woken;
 * - `newTurn` — a message follows an ended one: a `user` record, or an
 *   assistant message that is not synthetic;
 * - `midTurn` — the last message is anything but an `end_turn` assistant: a
 *   `tool_use`, a `user` record, the synthetic record, any other
 *   `stop_reason`.
 *
 * The park, a `self` stop, a `once` seat, and `boundary.js seat` read
 * `ended`; the park reads `newTurn`; the census's `parked` reads `midTurn`.
 */
function turnEnded(transcript, after) {
  let text;
  let writtenMs;
  try {
    text = fs.readFileSync(transcript, "utf8");
    writtenMs = fs.statSync(transcript).mtimeMs;
  } catch {
    return null;
  }
  const records = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      records.push(JSON.parse(line));
    } catch {
      // A line the harness is still writing; the next pass reads it whole.
    }
  }
  let start = 0;
  if (after) {
    const at = records.findIndex((record) => record?.uuid === after);
    if (at === -1) return null;
    start = at + 1;
  }
  const messages = [];
  let closedAt = -1;
  for (let i = start; i < records.length; i++) {
    const record = records[i];
    if (record?.type === "system" && CLOSING_SUBTYPES.includes(record.subtype)) closedAt = i;
    if ((record?.type !== "user" && record?.type !== "assistant") || record.isSidechain) continue;
    const id = record.message?.id;
    const last = messages[messages.length - 1];
    if (record.type === "assistant" && last?.type === "assistant" && id && last.id === id) {
      last.stopReason = record.message?.stop_reason;
      last.at = i;
      continue;
    }
    messages.push({
      type: record.type,
      id,
      stopReason: record.message?.stop_reason,
      synthetic: record.type === "assistant" && record.message?.model === "<synthetic>",
      at: i,
    });
  }
  const isEnd = (m) => m.type === "assistant" && !m.synthetic && m.stopReason === "end_turn";
  const closes = (m) => isEnd(m) || m.synthetic;
  const newTurn = messages.some((m, i) => i > 0 && closes(messages[i - 1]) && !m.synthetic);
  const last = messages[messages.length - 1];
  if (!last) return { ended: false, newTurn, midTurn: false };
  const settled = closedAt > last.at || nowMs() - writtenMs >= TURN_SETTLED_MS;
  return { ended: (isEnd(last) && settled) || last.synthetic, newTurn, midTurn: !isEnd(last) };
}
```

**P1.9** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
 * A terminal seat's name, `<repo>-<role>[-<topic>]-<hex>` (spec 1.1): the
```

**P1.9 →**

```js
 * A seat's name, `<repo>-<role>[-<topic>]-<hex>` (spec 1.1): the
```

**P1.10** `skills/tanto/scripts/spawner.js` — replace exactly these 2 lines

```js
  return first;
}
```

**P1.10 →**

```js
  return first;
}

// A request a seat leaves standing — a `self` stop here, a park (spec 2.3)
// — is dropped this long after it was written, or after its turn ended,
// with a log line.
const STANDING_WAIT_MS = 600000;

/**
 * Whether the human paces this seat (spec 5.2): a Kikaku, a Hosa, or a
 * Kaiseki whose topic is `—`. Only such a seat ends by its own `taiseki`,
 * whatever a role's text let through.
 */
function pacedByHuman(seat) {
  if (seat?.role === "kikaku" || seat?.role === "hosa") return true;
  return seat?.role === "kaiseki" && (!seat.topic || seat.topic === "—");
}

/** A seat ended (spec 2.8): `stopped`, the moment in epoch milliseconds, and who ended it. */
function markStopped(seat, endedBy) {
  seat.status = "stopped";
  seat.stoppedAtMs = nowMs();
  if (endedBy) seat.endedBy = endedBy;
  delete seat.leaveRequest;
}

/**
 * The listing's entry for `sessionId` when it carries a pid (decision-ebbd),
 * from `sessions` when a listing was already taken, else from a fresh one.
 * Returns { entry } — `entry` null when the session is not listed — or
 * { error } when the listing cannot be read.
 */
function listedEntry(root, sessionId, sessions = null) {
  let listed = sessions;
  if (!listed) {
    const listing = listAgents(root);
    if (listing.error) return { error: listing.error };
    listed = listing.sessions;
  }
  return { entry: listed.find((s) => s.sessionId === sessionId && s.pid) || null };
}

/**
 * `stop` (spec 2.8's table, 5.1): `claude stop` for a seat a fresh listing
 * shows in the background, and no command otherwise — the CLI reports a
 * seat a tab holds stopped and does not stop it (P-9), and a seat not listed
 * has no process. Both are recorded `stopped` with a note. A listing that
 * cannot be read leaves the command to decide, as before this rule; a seat
 * already ended is answered with nothing done.
 */
function opStop(root, request, seat) {
  if (seat?.status === "removed") return { stopped: stamp() };
  if (seat?.status === "stopped") return { stopped: stamp(), note: "already exited" };
  const { entry, error } = listedEntry(root, request.sessionId);
  if (!error && (!entry || entry.kind === "interactive")) {
    if (seat) markStopped(seat);
    return { stopped: stamp(), note: entry ? "in a tab" : "already exited" };
  }
  const got = runWithEitherId("stop", seat, request.sessionId);
  const exited = alreadyExited(got);
  if (got.code !== 0 && !exited) return { error: `claude stop: ${failureText(got)}` };
  if (seat) markStopped(seat);
  return { stopped: stamp(), ...(exited ? { note: "already exited" } : {}) };
}

/**
 * A seat's end by its own word (spec 5.2), tried when the request comes and
 * at every pass after: at once for a seat a tab holds or that is not listed,
 * which is what makes the word work the same from a terminal, a tab, and
 * Remote Control, and for a seat in the background once its turn has ended
 * since `after` (spec 2.8), so that its closing line is written. Ten minutes
 * on, an unmet request is dropped, logged, and said to the human, so that
 * the word never fails in silence. Returns the result once the seat ended,
 * else null.
 */
function tryLeave(root, seat, sessions = null) {
  const leave = seat.leaveRequest;
  if (nowMs() - leave.atMs >= STANDING_WAIT_MS) {
    delete seat.leaveRequest;
    appendLog(root, `leave: ${seat.sessionId} dropped — its turn did not end`);
    raiseNotice(`taiseki not done: ${seat.role} — tanto ${seat.role}`);
    return null;
  }
  const { entry, error } = listedEntry(root, seat.sessionId, sessions);
  if (error) return null;
  let note = entry ? "in a tab" : "already exited";
  if (entry && entry.kind !== "interactive") {
    const transcript = seat.transcript || findTranscript(seat.sessionId);
    if (!transcript || !turnEnded(transcript, leave.after)?.ended) return null;
    const got = runWithEitherId("stop", seat, seat.sessionId);
    if (got.code !== 0 && !alreadyExited(got)) {
      appendLog(root, `leave: ${seat.sessionId} stop failed — ${failureText(got)}`);
      return null;
    }
    note = alreadyExited(got) ? "already exited" : null;
  }
  markStopped(seat, "taiseki");
  appendLog(root, `leave: ${seat.sessionId} stopped`);
  return { stopped: stamp(), ...(note ? { note } : {}) };
}

/** `stop` with `self` and `after` (spec 5.2): a seat the human paces, ending itself. */
function opLeave(root, request, seat) {
  if (!pacedByHuman(seat)) return { error: "not a seat the human paces" };
  if (seat.status === "removed") return { stopped: stamp() };
  if (seat.status === "stopped") return { stopped: stamp(), note: "already exited" };
  const atMs = nowMs();
  seat.leaveRequest = { after: request.after, atMs };
  return tryLeave(root, seat) || { leaveRequested: atMs };
}

/**
 * Every `self` stop still waiting for its turn's end, tried again (spec
 * 5.2): at a request pass, which takes a listing only when one waits, and at
 * a census pass, on the listing it already took.
 */
function leavePass(root, seats, sessions = null) {
  const waiting = seats.filter((seat) => seat.leaveRequest && seat.status !== "stopped" && seat.status !== "removed");
  if (waiting.length === 0) return;
  let listed = sessions;
  if (!listed) {
    const listing = listAgents(root);
    if (listing.error) return;
    listed = listing.sessions;
  }
  for (const seat of waiting) tryLeave(root, seat, listed);
  writeSeats(root, seats);
}
```

**P1.11** `skills/tanto/scripts/spawner.js` — replace exactly these 7 lines

```js
  if (request.op === "stop") {
    const got = runWithEitherId("stop", seat, request.sessionId);
    const exited = alreadyExited(got);
    if (got.code !== 0 && !exited) return { error: `claude stop: ${failureText(got)}` };
    if (seat) seat.status = "stopped";
    return { stopped: stamp(), ...(exited ? { note: "already exited" } : {}) };
  }
```

**P1.11 →**

```js
  // A seat's own `taiseki` carries `self` and `after` (spec 5.2).
  if (request.op === "stop") return request.self ? opLeave(root, request, seat) : opStop(root, request, seat);
```

**P1.12** `skills/tanto/scripts/spawner.js` — insert after these 2 lines

```js
    appendLog(root, `${request.op} ${name} ${said}`);
  }
```

**P1.12 →**

```js
  leavePass(root, seats);
```

**P1.13** `skills/tanto/scripts/spawner.js` — insert before these 2 lines

```js
  writeSeats(root, seats);
  return seats;
```

**P1.13 →**

```js
  leavePass(root, seats, listing.sessions);
```

**P1.14** `skills/tanto/scripts/spawner.js` — replace exactly these 2 lines

```js
  seatName,
  shortIdOf,
```

**P1.14 →**

```js
  seatName,
  shortIdOf,
  // For `boundary.js seat`'s fifth word (spec 2.5).
  turnEnded,
```

- [ ] **Step 4: Run the spawner's suite to verify it passes**

```bash
node --test skills/tanto/scripts/spawner.test.js
```

Expected: every test passes, the six new ones among them; "stop marks the
seat stopped" and the other `stop` tests still run `claude stop`, since the
fake lists their seat in the background.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes; "down --seats reports a failed stop" fails
on the listed Kanri's refused stop, the unlisted Jisso being recorded
`stopped` with no command.

- [ ] **Step 6: Verify the passages**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 1
```

Expected: `task 1: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints** on
  `skills/tanto/scripts/spawner.js`, `skills/tanto/scripts/spawner.test.js`,
  and `skills/tanto/scripts/tanto.test.js`.

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints** — subject
  `feat: the spawner reads a turn's end, stops by the listing, and ends a seat the human paces on its own word`;
  paths `skills/tanto/scripts/spawner.js`,
  `skills/tanto/scripts/spawner.test.js`, and
  `skills/tanto/scripts/tanto.test.js`.

Expected: one commit.

### Task 2: `spawn`'s `contract`, `succeeds`, `once`, `requestId`, the early state file; `resume`'s refusals, four listing cases and copy check; `sessions.denrei`

Spec 1.1 (the `contract: 2` mark, recorded on the seat), 1.2 (one holder
per role), 1.5's spawner half (the state file written before the
transcript poll), 2.5's `resume` (a prompt for Kanri alone, the four
listing cases, the copy on either stream), and 4.4's spawner half (the
`once` seat, `sessions.denrei`). After this task a marked `spawn` of
`kanri`, `kikaku`, or `hosa` is refused while the state file holds a seat
of that role unless it names that seat in `succeeds`; a seat records its
`contract`, its `requestId`, and `once`; the state file holds a new seat
before its transcript poll; a `once` seat is stopped and removed when its
turn has ended or five minutes after its spawn; `resume` refuses a prompt
for any role but `kanri`, answers `listed` for a seat a tab holds or that
is alive, waits out a stop that is finishing, and removes a copy; and the
built-in `tanto.json` carries `sessions.denrei`.

**Files:**

- Modify: `skills/tanto/scripts/spawner.js` — `STOP_SETTLE_MS`,
  `waitUnlisted`, `copyOf`, `opResume`, `DIALOGUE_ROLES`,
  `ONE_HOLDER_ROLES`, `holds`, `ONCE_WAIT_MS`, and `endOnceSeats` before
  `opSpawn`, whose head gains `requestId` and the one-holder refusal;
  `opSpawn`'s idle-note comment, its seat's three new fields, and the
  `writeSeats` after its `seats.push`; `handleRequest`'s head and `resume`
  branch; `takeRequests`' `handleRequest` call; one `endOnceSeats` call
  before `runCensus`'s `writeSeats`.
- Modify: `skills/tanto/templates/tanto.json` — `sessions.denrei`.
- Test: `skills/tanto/scripts/spawner.test.js` — the `spawn` import; the
  fake's `agents` (`leaving`) and `--resume` (a copy, and no idle note when
  a prompt was given); three `spawn` tests after "a spawn writes the
  result, the seat, and deletes the request"; the fixtures of four `resume`
  tests that a copy check or a listed seat now meets; `resumable` and three
  `resume` tests after "resume waits past the stale pid-less entry".
- Test: `skills/tanto/scripts/reading.test.js` — the built-in seats'
  count and `denrei`.

**Interfaces:**

- Consumes: Task 1's `turnEnded`, `listedEntry`, and the test helpers
  `putSeats`, `writeRecords`, `REC`, and `ENDED_TURN`.
- Produces: `spawn` reads `contract`, `succeeds`, and `once`, refuses with
  `error: "held: <sessionId>"`, and records `contract`, `requestId` (the
  request file's name without `.json`), and `once: true` on the seat.
  `resume` reads `prompt` (Kanri alone) and answers `error: "no prompt for
  this role"`, `error: "removed"`, `error: "listed"` with `name` and
  `kind`, `error: "still listed"`, `error: "copy <id> removed"`, or
  `error: "prompt not delivered"`; on success the seat is `running` with
  `parkedAtMs` and `midTurn` deleted and `waiting` kept. `STOP_SETTLE_MS`,
  `waitUnlisted(root, sessionId)`, `DIALOGUE_ROLES`, and `holds(seat)`,
  which Tasks 3 and 4 reuse. `templates/tanto.json`'s
  `sessions.denrei: { "model": "sonnet", "effort": "low" }`, which Task 10's
  `fukki` path (`cmdUp` and `tellKanri`) reads. The fake CLI learns a session's `leaving` count and
  `state.copy: { id, quiet }`.

**Named-mechanism sites.** `contract: 2` on a request is also every
`spawn` `tanto.js` writes, `kanriRequest` among them (Task 8),
`templates/spawn-request.md`'s field list (Task 22), and the requests of
`roles/kanri.md`'s "Session lifecycle" (Task 19) and "Handover" (Task 17).
`succeeds` is also "Handover" (Task 17), `templates/kanri-handover.md`
(Task 22), `tanto.js`'s `kanriSuccessor` and follow loop (Task 9), and
section 7's step 4 in the Global Constraints. `held: <sessionId>` is also
`tanto.js`'s role resolution, which reads the state file before it writes
(Task 8). `once` and the role word `denrei` are also `tanto.js`'s
`fukki` path (Task 10), `boundary.js seat`, which finds a `removed` messenger
by its name (Task 6), and `roles/kanri.md`'s Recovery (Task 19).
`sessions.denrei` is also `SKILL.md`'s "The expected-model config", "Its
eight keys are the seven roles and `sessions.shoki`" (Task 12), and
`reading.test.js`' count, here. `requestId` is the `<id>` of
`templates/spawn-request.md` (Task 22). The `resume` errors are also what
`boundary.js wake` prints (Task 6) and what `roles/kanri.md`'s "How Kanri
sends a seat a line" acts on (Task 19); the Kanri-only `prompt` is also
`tanto.js`'s `/tanto fukki` resume (Task 10) and
`templates/spawn-request.md` (Task 22). The early state write is what lets
`boundary.js seat` print an entry rather than `no entry background`
(Task 6, and `SKILL.md`'s "Start sequence", Task 12).

**O2.1** `On a resume it is the CLI's normal line` — `opSpawn`'s comment that said the `resume` op never reads the idle note (section 6); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O2.2** `request.sessionId, "--bg"])` — the `resume` command line with no room for Kanri's prompt (spec 2.5); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O2.3** `handleRequest(root, request, seats);` — `takeRequests`' call that passed no request id (section 6); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O2.4** `[bbbbbb]", id: "bg02"` — three `resume` fixtures in which the resumed session took a short id other than the seat's, which the copy check now reads as a copy (spec 2.5; S-3, a resume keeps the id; the fourth fixture's own `id: "bg02",` line is changed in the same blocks and is checked by `verify`); before: 3 in `skills/tanto/scripts/spawner.test.js`, after: 0. The needle is narrower than `id: "bg02"` because Task 8's new tests use that id in `tanto.test.js`.

**O2.5** `woke session bg02` — the log assertion of the same fixture; before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0.

**O2.6** `got.id, "bg02"` — the stale-entry test's id assertion; before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0.

**O2.7** `Object.keys(sessions).length, 8` — the built-in seats' count before `denrei` (spec 4.4); before: 1 in `skills/tanto/scripts/reading.test.js`, after: 0.

**A2.8** `skills/tanto/scripts/spawner.js` — `grep -c "endOnceSeats(root, seats)" skills/tanto/scripts/spawner.js` — before: 0, after: 2

- [ ] **Step 1: Write the failing tests**

Apply P2.9 to P2.19: the `spawn` import; the fake's `leaving` count, its
copy, and its quiet `--resume` line when a prompt was given; three `spawn`
tests; the fixtures that meet the new `resume`; three `resume` tests; and
`reading.test.js`' count.

**P2.9** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
const { spawnSync } = require("node:child_process");
```

**P2.9 →**

```js
const { spawn, spawnSync } = require("node:child_process");
```

**P2.10** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  let sessions = state.sessions.filter((s) => !s.hidden);
```

**P2.10 →**

```js
  let sessions = state.sessions.filter((s) => !s.hidden);
  // A session whose stop is finishing (spec 2.5, S-5): listed leaving more
  // times, then gone from the listing as a hidden one is -- --resume still
  // finds it.
  const leaving = sessions.filter((s) => s.leaving > 0);
  for (const s of leaving) {
    s.leaving -= 1;
    if (s.leaving === 0) s.hidden = true;
  }
  if (leaving.length > 0) save();
```

**P2.11** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  // A collected seat's entry has no pid; with resumeStaleListings set, the
```

**P2.11 →**

```js
  // state.copy: the CLI started a copy instead of waking the session (spec
  // 2.5, P-8) -- a new session under the root, the note on stderr unless
  // quiet, and the copy's own id on stdout.
  if (state.copy) {
    const copy = { sessionId: "sess-copy", id: state.copy.id, name: found.name, cwd: state.root };
    state.sessions.push({ ...copy, kind: "background", pid: 4400 });
    save();
    if (!state.copy.quiet) {
      process.stderr.write("note: already running in the background, so this started a copy as " + copy.id + "\\n");
    }
    process.stdout.write("backgrounded · " + copy.id + " · " + copy.name + " (idle — send a prompt to start)\\n");
    process.exit(0);
  }
  // A collected seat's entry has no pid; with resumeStaleListings set, the
```

**P2.12** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  process.stdout.write("backgrounded · " + found.id + " · " + found.name + " (idle — send a prompt to start)\\n");
```

**P2.12 →**

```js
  // A prompt on the line is the session's turn, and the CLI prints no idle
  // note (S-3).
  // state.idleOnResume: the CLI printed the idle note although a prompt was
  // on the line -- the prompt was not taken (spec 4.4).
  const idle = argv.length > 3 && !state.idleOnResume ? "" : " (idle — send a prompt to start)";
  process.stdout.write("backgrounded · " + found.id + " · " + found.name + idle + "\\n");
```

**P2.13** `skills/tanto/scripts/spawner.test.js` — replace exactly these 3 lines

```js
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].role, "jisso");
});
```

**P2.13 →**

```js
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].role, "jisso");
});

test("a marked spawn of a held role is refused unless it names the holder it succeeds; an unmarked one is not (spec 1.2)", () => {
  const ws = workspace();
  const KANRI = { ...SPAWN, role: "kanri", topic: "—", prompt: "/tanto kanri", contract: 2 };
  const spawnAs = (sessionId, body) => {
    setState(ws, { next: { sessionId, id: `id-${sessionId}` } });
    writeTranscript(ws, sessionId);
    const { id } = request(ws, body);
    run(ws, ["run", "--root", ws.root, "--once"]);
    return { id, got: result(ws, id) };
  };
  const first = spawnAs("sess-k1", KANRI);
  assert.equal(first.got.sessionId, "sess-k1");
  assert.equal(spawnAs("sess-k2", KANRI).got.error, "held: sess-k1");
  assert.equal(spawnAs("sess-k2", { ...KANRI, succeeds: "sess-k1" }).got.sessionId, "sess-k2");
  assert.equal(spawnAs("sess-k3", { ...KANRI, contract: undefined }).got.sessionId, "sess-k3");
  assert.equal(calls(ws).filter((argv) => argv.includes("--bg")).length, 3);
  const byId = Object.fromEntries(seats(ws).map((seat) => [seat.sessionId, seat]));
  assert.equal(byId["sess-k1"].contract, 2);
  assert.equal(byId["sess-k1"].requestId, first.id);
  assert.equal(byId["sess-k3"].contract, undefined);
});

test("a spawn writes the state file as soon as the listing shows the session, before its transcript poll ends (spec 1.5)", async () => {
  const ws = workspace();
  request(ws, SPAWN);
  const env = {
    ...process.env,
    TANTO_CLAUDE_NODE: ws.fake,
    TANTO_NOTICE_LOG: ws.notices,
    FAKE_STATE: ws.state,
    FAKE_LOG: ws.log,
    CLAUDE_CONFIG_DIR: ws.config,
    TANTO_NOW_MS: String(STARTED_AT),
  };
  const child = spawn(process.execPath, [SPAWNER, "run", "--root", ws.root, "--once"], { env, stdio: "ignore" });
  const exited = new Promise((resolve) => child.on("exit", resolve));
  const file = path.join(ws.root, ".tanto", "spawner", "seats.json");
  const holds = () => {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8")).seats.some((seat) => seat.sessionId === "sess-new");
    } catch {
      return false;
    }
  };
  let seen = false;
  for (let i = 0; i < 80 && !seen; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    seen = holds();
  }
  // No transcript exists, so the poll runs its ten seconds: the seat was on
  // disk while it ran.
  assert.equal(seen, true);
  assert.equal(child.exitCode, null);
  await exited;
});

test("a once seat is stopped and removed when its turn has ended, and five minutes after its spawn in any case (spec 4.4)", () => {
  const MESSENGER = {
    ...SPAWN,
    role: "denrei",
    topic: "—",
    effort: "low",
    once: true,
    contract: 2,
    prompt: "Forward.",
  };
  const ws = workspace();
  writeRecords(ws, "sess-new", [REC.human("u1"), REC.end("u2", "m1"), REC.close("stop_hook_summary")]);
  request(ws, MESSENGER);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].once, true);
  assert.equal(seats(ws)[0].status, "removed");
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "stop" || argv[0] === "rm")
      .map((argv) => argv[0]),
    ["stop", "rm"],
  );
  assert.match(spawnerLog(ws), /once: sess-new removed — its turn ended/);

  const late = workspace();
  writeRecords(late, "sess-new", [REC.human("u1"), REC.tool("u2", "m1")]);
  request(late, MESSENGER);
  run(late, ["run", "--root", late.root, "--once"]);
  assert.equal(seats(late)[0].status, "running");
  run(late, ["run", "--root", late.root, "--once"], { env: { TANTO_NOW_MS: String(STARTED_AT + 300000) } });
  assert.equal(seats(late)[0].status, "removed");
  assert.match(spawnerLog(late), /once: sess-new removed — five minutes after its spawn/);
});
```

**P2.14** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  setState(second, { failOut: { "--resume": "refused: no such session" } });
```

**P2.14 →**

```js
  // Not listed, so that the resume reaches the command (spec 2.5).
  const listed = JSON.parse(fs.readFileSync(second.state, "utf8")).sessions;
  setState(second, {
    sessions: listed.map((s) => ({ ...s, hidden: true })),
    failOut: { "--resume": "refused: no such session" },
  });
```

**P2.15** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  setState(ws, { next: { name: "seat-back [bbbbbb]", id: "bg02" } });
```

**P2.15 →**

```js
  // Not listed, so that the resume reaches the command (spec 2.5).
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: listed.map((s) => ({ ...s, hidden: true })), next: { name: "seat-back [bbbbbb]" } });
```

**P2.16** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  assert.match(log, /resume sess-new: note: woke session bg02 with its saved options/);
```

**P2.16 →**

```js
  assert.match(log, /resume sess-new: note: woke session bg01 with its saved options/);
```

**P2.17** `skills/tanto/scripts/spawner.test.js` — replace exactly these 11 lines

```js
        id: "bg02",
        pid: 1111,
      },
    ],
    next: { name: "seat-back [bbbbbb]", id: "bg02" },
    // The session exists in the backing store already -- the fake's own
    // "--resume" handler finds it there -- but the first listing after the
    // resume still misses it, exactly as a single, un-retried poll used to
    // (Important 8, branch-review.md).
    agentsHideSessionId: "sess-new",
    agentsHideCount: 1,
```

**P2.17 →**

```js
        id: "bg01",
        pid: 1111,
      },
    ],
    next: { name: "seat-back [bbbbbb]" },
    // The session exists in the backing store already -- the fake's own
    // "--resume" handler finds it there -- but the first listing after the
    // resume still misses it, exactly as a single, un-retried poll used to
    // (Important 8, branch-review.md). The first of the two hidden listings
    // is the resume's own look before its command (spec 2.5).
    agentsHideSessionId: "sess-new",
    agentsHideCount: 2,
```

**P2.18** `skills/tanto/scripts/spawner.test.js` — replace exactly these 10 lines

```js
  setState(ws, { next: { name: "seat-back [bbbbbb]", id: "bg02" }, resumeStaleListings: 1 });
  const { id } = request(ws, { op: "resume", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const got = result(ws, id);
  assert.notEqual(got.name, spawned.name);
  assert.equal(got.name, "seat-back [bbbbbb]");
  assert.equal(got.id, "bg02");
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].goneAt, undefined);
});
```

**P2.18 →**

```js
  setState(ws, { next: { name: "seat-back [bbbbbb]" }, resumeStaleListings: 1 });
  const { id } = request(ws, { op: "resume", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const got = result(ws, id);
  assert.notEqual(got.name, spawned.name);
  assert.equal(got.name, "seat-back [bbbbbb]");
  assert.equal(got.id, "bg01");
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].goneAt, undefined);
});

/** A listing entry and a contract-2 Sekkei seat of `sessionId`, for the resume tests (spec 2.5). */
function resumable(ws, sessionId, listing = {}, seat = {}) {
  const shared = { sessionId, id: `id-${sessionId}`, name: `name-${sessionId}` };
  return {
    entry: { ...shared, cwd: ws.root, kind: "background", pid: 4321, ...listing },
    seat: { ...shared, role: "sekkei", topic: "t", contract: 2, status: "running", ...seat },
  };
}

test("resume answers listed for a seat a tab holds or that is alive, waits out a stop finishing, and wakes an unlisted one (spec 2.5)", () => {
  const ws = workspace();
  const cases = {
    tab: resumable(ws, "sess-tab", { kind: "interactive" }),
    live: resumable(ws, "sess-live", {}, { status: "stopped", stoppedAtMs: STARTED_AT - 60000 }),
    parked: resumable(ws, "sess-parked", { hidden: true }, { status: "parked", parkedAtMs: STARTED_AT - 3600000 }),
  };
  setState(ws, { sessions: Object.values(cases).map((c) => c.entry) });
  putSeats(
    ws,
    Object.values(cases).map((c) => c.seat),
  );
  const asked = Object.fromEntries(
    Object.entries(cases).map(([key, c]) => [key, request(ws, { op: "resume", sessionId: c.seat.sessionId }).id]),
  );
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(
    [result(ws, asked.tab).error, result(ws, asked.tab).kind, result(ws, asked.tab).name],
    ["listed", "interactive", "name-sess-tab"],
  );
  assert.deepEqual([result(ws, asked.live).error, result(ws, asked.live).kind], ["listed", "background"]);
  assert.equal(result(ws, asked.parked).error, undefined);
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "--resume")
      .map((argv) => argv[1]),
    ["sess-parked"],
  );
  const parked = seats(ws).find((seat) => seat.sessionId === "sess-parked");
  assert.equal(parked.status, "running");
  assert.equal(parked.parkedAtMs, undefined);

  // Parked five seconds ago and still listed: the stop is finishing (S-5).
  const leaving = workspace();
  const finishing = resumable(leaving, "sess-d", { leaving: 1 }, { status: "parked", parkedAtMs: STARTED_AT - 5000 });
  setState(leaving, { sessions: [finishing.entry] });
  putSeats(leaving, [finishing.seat]);
  const { id } = request(leaving, { op: "resume", sessionId: "sess-d" });
  run(leaving, ["run", "--root", leaving.root, "--once"]);
  assert.equal(result(leaving, id).error, undefined);
  assert.deepEqual(
    calls(leaving)
      .slice(0, 3)
      .map((argv) => argv[0]),
    ["agents", "agents", "--resume"],
  );
});

test("resume refuses a prompt for any role but kanri, and passes a Kanri's as its one positional (spec 2.5, 4.4)", () => {
  const ws = workspace();
  const sekkei = resumable(ws, "sess-s", { hidden: true });
  const kanri = resumable(ws, "sess-k", { hidden: true }, { role: "kanri", topic: "—", status: "gone" });
  setState(ws, { sessions: [sekkei.entry, kanri.entry] });
  putSeats(ws, [sekkei.seat, kanri.seat]);
  const refused = request(ws, { op: "resume", sessionId: "sess-s", prompt: "resume: go on" });
  const fukki = request(ws, { op: "resume", sessionId: "sess-k", prompt: "/tanto fukki" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, refused.id).error, "no prompt for this role");
  assert.equal(result(ws, fukki.id).error, undefined);
  assert.deepEqual(
    calls(ws).filter((argv) => argv[0] === "--resume"),
    [["--resume", "sess-k", "--bg", "/tanto fukki"]],
  );
});

test("a copy a resume started is stopped and removed, found on stderr or on stdout alone (spec 2.5, P-8)", () => {
  for (const quiet of [false, true]) {
    const ws = workspace();
    const parked = resumable(ws, "sess-s", { hidden: true }, { status: "parked", parkedAtMs: STARTED_AT - 3600000 });
    setState(ws, { sessions: [parked.entry], copy: { id: "cp01", quiet } });
    putSeats(ws, [parked.seat]);
    const { id } = request(ws, { op: "resume", sessionId: "sess-s" });
    run(ws, ["run", "--root", ws.root, "--once"]);
    assert.equal(result(ws, id).error, "copy cp01 removed");
    assert.deepEqual(
      calls(ws).filter((argv) => argv[0] === "stop" || argv[0] === "rm"),
      [
        ["stop", "cp01"],
        ["rm", "cp01"],
      ],
    );
    assert.equal(seats(ws)[0].status, "parked");
  }
});
```

**P2.19** `skills/tanto/scripts/reading.test.js` — replace exactly these 3 lines

```js
  assert.strictEqual(Object.keys(sessions).length, 8);
  assert.deepStrictEqual(sessions.kanri, { model: "sonnet", effort: "high" });
  assert.deepStrictEqual(sessions.shoki, { model: "sonnet", effort: "medium" });
```

**P2.19 →**

```js
  assert.strictEqual(Object.keys(sessions).length, 9);
  assert.deepStrictEqual(sessions.kanri, { model: "sonnet", effort: "high" });
  assert.deepStrictEqual(sessions.shoki, { model: "sonnet", effort: "medium" });
  // The messenger `tanto fukki` sends a live Kanri (spec 4.4): sonnet, since
  // haiku answered the line it was to forward itself (P-5).
  assert.deepStrictEqual(sessions.denrei, { model: "sonnet", effort: "low" });
```

- [ ] **Step 2: Run the new tests to verify they fail**

```bash
node --test --test-name-pattern "marked spawn|state file as soon|once seat|resume answers listed|resume refuses|a copy a resume" skills/tanto/scripts/spawner.test.js
node --test --test-name-pattern "built-in seats" skills/tanto/scripts/reading.test.js
```

Expected: FAIL — the second marked Kanri is spawned; the state file is
written only once the transcript poll ends; a `once` seat is left
running; the listed seats are resumed and the prompts passed; the copy is
taken for the seat; `loadSessions` returns eight keys and no `denrei`.

- [ ] **Step 3: Refuse a second holder, record the mark, end a `once` seat, and guard the resume**

Apply P2.20 to P2.26, then P2.27 to `templates/tanto.json`.

**P2.20** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
function opSpawn(root, request, seats) {
```

**P2.20 →**

```js
// Within this long of a park or a stop, a listed entry is the process still
// leaving (spec 2.5, S-5), not a seat that is alive.
const STOP_SETTLE_MS = 30000;

/**
 * Poll the listing once a second, up to thirty times, until `sessionId` has
 * left it (spec 2.5): a resume issued while a stop is finishing starts a
 * copy (S-5). Returns whether it left.
 */
function waitUnlisted(root, sessionId) {
  for (let attempt = 0; attempt < SPAWN_POLL_TRIES; attempt++) {
    const { entry, error } = listedEntry(root, sessionId);
    if (!error && !entry) return true;
    pause(root, SPAWN_POLL_MS);
  }
  return false;
}

/**
 * The copy a resume started instead of waking the seat (spec 2.5, P-8), or
 * null: the id after `started a copy as` on either stream — the CLI writes
 * its note to stderr — or stdout's `backgrounded · <id>` when that id is
 * neither the seat's short id nor the head of its `sessionId`.
 */
function copyOf(got, sessionId, seat) {
  const noted = /started a copy as ([A-Za-z0-9][\w-]*)/.exec(`${got.err}\n${got.out}`);
  if (noted) return noted[1];
  const printed = shortIdOf(got.out);
  if (!printed || printed === seat?.id || sessionId.startsWith(printed)) return null;
  return printed;
}

/**
 * `resume` (spec 2.5). A parked seat is woken, never handed a line: a
 * prompt is taken for a Kanri alone (S-3), as the command's one positional
 * and still no flag (decision-7c87). Before the command, on a fresh
 * listing, a seat a tab holds or one alive in the background is `listed`,
 * since a resume would start a copy that holds its whole conversation and
 * acts on its prompt (M-6, P-8); a seat whose park or stop is under thirty
 * seconds old is waited out. After it, a copy is stopped and removed — a
 * copy that cannot be removed is an error that says so — and a prompt the
 * CLI did not take is an error, the session it resumed stopped first. The CLI names the options it
 * brought back on stderr, which a result does not carry, so the log keeps
 * it.
 */
function opResume(root, request, seat) {
  if (request.prompt && (seat?.role || request.role) !== "kanri") return { error: "no prompt for this role" };
  if (seat?.status === "removed") return { error: "removed" };
  const { entry, error } = listedEntry(root, request.sessionId);
  if (error) return { error: `claude agents: ${error}` };
  if (entry) {
    const listed = { error: "listed", name: entry.name, kind: entry.kind };
    if (entry.kind === "interactive") return listed;
    const endedAtMs = Math.max(seat?.parkedAtMs || 0, seat?.stoppedAtMs || 0);
    if (nowMs() - endedAtMs >= STOP_SETTLE_MS) return listed;
    if (!waitUnlisted(root, request.sessionId)) return { error: "still listed" };
  }
  const got = runClaude(["--resume", request.sessionId, "--bg", ...(request.prompt ? [request.prompt] : [])]);
  if (got.code !== 0) return { error: `claude --resume: ${failureText(got)}` };
  const copy = copyOf(got, request.sessionId, seat);
  if (copy) {
    runClaude(["stop", copy]);
    const removed = runClaude(["rm", copy]);
    if (removed.code !== 0 && !alreadyExited(removed)) {
      appendLog(root, `resume ${request.sessionId}: copy ${copy} not removed — ${failureText(removed)}`);
      return { error: `copy ${copy} not removed: ${failureText(removed)}` };
    }
    appendLog(root, `resume ${request.sessionId}: copy ${copy} removed`);
    return { error: `copy ${copy} removed` };
  }
  if (request.prompt && idleLine(got.out)) {
    runWithEitherId("stop", seat, request.sessionId);
    return { error: "prompt not delivered" };
  }
  if (got.err.trim()) appendLog(root, `resume ${request.sessionId}: ${got.err.trim()}`);
  const session = findResumed(root, request.sessionId);
  if (seat && session) {
    seat.name = session.name;
    seat.id = session.id || shortIdOf(got.out) || seat.id;
    seat.status = "running";
    delete seat.goneAt;
    delete seat.parkedAtMs;
    delete seat.midTurn;
  }
  return {
    sessionId: request.sessionId,
    name: session ? session.name : undefined,
    id: seat ? seat.id : shortIdOf(got.out),
  };
}

// The roles whose turns can end on a question to the human (spec, Words).
const DIALOGUE_ROLES = ["sekkei", "keikaku", "kikaku", "hosa", "kaiseki"];

// The roles a marked spawn gives one holder at a time (spec 1.2).
const ONE_HOLDER_ROLES = ["kanri", "kikaku", "hosa"];

/**
 * Whether the state file holds a seat (spec, Words): `running`, `blocked`,
 * or `parked` — or `gone`, for a seat that is not a dialogue seat, which a
 * resume brings back.
 */
function holds(seat) {
  if (["running", "blocked", "parked"].includes(seat.status)) return true;
  return seat.status === "gone" && !DIALOGUE_ROLES.includes(seat.role);
}

// A `once` seat is stopped and removed this long after its spawn, whatever
// its turn did (spec 4.4).
const ONCE_WAIT_MS = 300000;

/**
 * The census's end of a `once` seat (spec 4.4) — a messenger, which
 * forwards one line and has nothing more to do: stopped and removed when its
 * turn has ended (spec 2.8), or five minutes after its spawn in any case. A
 * removal that fails is logged and tried again at the next pass.
 */
function endOnceSeats(root, seats) {
  for (const seat of seats) {
    if (!seat.once || seat.status === "removed") continue;
    const transcript = seat.transcript || findTranscript(seat.sessionId);
    const ended = Boolean(transcript && turnEnded(transcript)?.ended);
    const late = typeof seat.startedAtMs === "number" && nowMs() - seat.startedAtMs >= ONCE_WAIT_MS;
    if (!ended && !late) continue;
    runWithEitherId("stop", seat, seat.sessionId);
    const got = runWithEitherId("rm", seat, seat.sessionId);
    if (got.code !== 0 && !alreadyExited(got)) {
      appendLog(root, `once: ${seat.sessionId} rm failed — ${failureText(got)}`);
      continue;
    }
    seat.status = "removed";
    appendLog(root, `once: ${seat.sessionId} removed — ${ended ? "its turn ended" : "five minutes after its spawn"}`);
  }
}

function opSpawn(root, request, seats, requestId) {
  // One holder per role (spec 1.2): a marked request for a role the state
  // file holds a seat of is refused, unless it names that seat as the one it
  // succeeds — a Kanri's handover. An unmarked request is never refused: a
  // Kanri that read the old text hands over with no `succeeds`.
  if (request.contract === 2 && ONE_HOLDER_ROLES.includes(request.role)) {
    const holder = seats.find((s) => s.role === request.role && holds(s) && s.sessionId !== request.succeeds);
    if (holder) return { error: `held: ${holder.sessionId}` };
  }
```

**P2.21** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
  // The idle note on a spawn is a prompt that never reached the seat (spec
  // 1.2). On a resume it is the CLI's normal line, and the resume op does not
  // read it.
```

**P2.21 →**

```js
  // The idle note on a spawn is a prompt that never reached the seat (spec
  // 1.2); a resume reads it only when it carried a prompt (`opResume`).
```

**P2.22** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
    status: stray ? "stopped" : "running",
    ...(stray ? { strayed: session.cwd } : {}),
  };
  seats.push(seat);
  if (undelivered) return removeUndelivered(root, seat, undelivered);
```

**P2.22 →**

```js
    status: stray ? "stopped" : "running",
    ...(stray ? { strayed: session.cwd } : {}),
    // The request's mark (spec 1.1), the request file it came in, and a
    // messenger's `once` (spec 4.4).
    ...(request.contract !== undefined ? { contract: request.contract } : {}),
    ...(requestId ? { requestId } : {}),
    ...(request.once === true ? { once: true } : {}),
  };
  seats.push(seat);
  // On disk at once, before the transcript poll below (spec 1.5): a seat
  // whose first act is `boundary.js seat` finds its own entry.
  writeSeats(root, seats);
  if (undelivered) return removeUndelivered(root, seat, undelivered);
```

**P2.23** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
function handleRequest(root, request, seats) {
  if (!OPS.includes(request.op)) return { error: `unknown op ${request.op}` };
  const seat = request.sessionId ? seatOf(seats, request.sessionId) : null;

  if (request.op === "spawn") return opSpawn(root, request, seats);
```

**P2.23 →**

```js
function handleRequest(root, request, seats, requestId) {
  if (!OPS.includes(request.op)) return { error: `unknown op ${request.op}` };
  const seat = request.sessionId ? seatOf(seats, request.sessionId) : null;

  if (request.op === "spawn") return opSpawn(root, request, seats, requestId);
```

**P2.24** `skills/tanto/scripts/spawner.js` — replace exactly these 19 lines

```js
  if (request.op === "resume") {
    // No flag: the CLI brings back the options the spawn passed and names
    // them on stderr, which a result does not carry, so the log keeps it.
    const got = runClaude(["--resume", request.sessionId, "--bg"]);
    if (got.code !== 0) return { error: `claude --resume: ${failureText(got)}` };
    if (got.err.trim()) appendLog(root, `resume ${request.sessionId}: ${got.err.trim()}`);
    const session = findResumed(root, request.sessionId);
    if (seat && session) {
      seat.name = session.name;
      seat.id = session.id || shortIdOf(got.out) || seat.id;
      seat.status = "running";
      delete seat.goneAt;
    }
    return {
      sessionId: request.sessionId,
      name: session ? session.name : undefined,
      id: seat ? seat.id : shortIdOf(got.out),
    };
  }
```

**P2.24 →**

```js
  if (request.op === "resume") return opResume(root, request, seat);
```

**P2.25** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
      outcome = handleRequest(root, request, seats);
```

**P2.25 →**

```js
      // The request's file name, less `.json`, is the id a spawned seat records (spec 1.5).
      outcome = handleRequest(root, request, seats, path.basename(name, ".json"));
```

**P2.26** `skills/tanto/scripts/spawner.js` — insert before these 2 lines

```js
  writeSeats(root, seats);
  return seats;
```

**P2.26 →**

```js
  endOnceSeats(root, seats);
```

**P2.27** `skills/tanto/templates/tanto.json` — replace exactly this 1 line

```json
    "shoki": { "model": "sonnet", "effort": "medium" }
```

**P2.27 →**

```json
    "shoki": { "model": "sonnet", "effort": "medium" },
    "denrei": { "model": "sonnet", "effort": "low" }
```

- [ ] **Step 4: Run the two suites to verify they pass**

```bash
node --test skills/tanto/scripts/spawner.test.js
node --test skills/tanto/scripts/reading.test.js
```

Expected: every test passes, the six new ones among them; the `resume`
tests whose seat is now hidden before the resume still reach the command.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes; `tanto.test.js` runs the spawner with the
same fake and writes no `resume` with a prompt.

- [ ] **Step 6: Verify the passages**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 2
```

Expected: `task 2: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints** on
  `skills/tanto/scripts/spawner.js`, `skills/tanto/scripts/spawner.test.js`,
  `skills/tanto/scripts/reading.test.js`, and
  `skills/tanto/templates/tanto.json`.

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints** — subject
  `feat: the spawner keeps one holder per role, records the contract, ends a messenger, and guards a resume against a copy`;
  paths `skills/tanto/scripts/spawner.js`,
  `skills/tanto/scripts/spawner.test.js`,
  `skills/tanto/scripts/reading.test.js`, and
  `skills/tanto/templates/tanto.json`.

Expected: one commit.

### Task 3: `park`, `hold`, `release`, `tryPark`, the standing request

Spec 2.2's spawner half (the request's `after`, `waiting`, and `notice`),
2.3 (the spawner's act, the standing request), and 2.4 (the hold, its
errors, `release`). After this task the spawner takes `park`, `hold`, and
`release`; parks a contract-2 dialogue seat once the turn its request ended
has ended — at once when the listing no longer shows it, never when a tab
holds it, and by `claude stop`, state first, when it is `idle` in the
background and not held; raises the `waiting:` notice once per standing
question; and stops again, two minutes on, a seat it parked that is listed
again with no new turn.

**Files:**

- Modify: `skills/tanto/scripts/spawner.js` — `OPS`; the `park`, `hold`,
  and `release` branches before `ack`; `RELISTED_PARK_MS`,
  `isContractDialogue`, `enterCommand`, `pidAlive`, `opPark`, `opHold`,
  `markParked`, `stopToPark`, `tryPark`, `standingPark`, and `tryParks`
  before `takeRequests`; one `tryParks` call at the end of `takeRequests`
  and one before `runCensus`'s `writeSeats`.
- Test: `skills/tanto/scripts/spawner.test.js` — the fake's `stop`, which
  keeps what `seats.json` held as it ran; `dialogueSeat`, `PARK`, `once`,
  and `stopsOf`, and seven tests, after "ack clears the renamed mark of the
  session it names".

**Interfaces:**

- Consumes: Task 1's `turnEnded`, `STANDING_WAIT_MS`, `listedEntry`, and
  the test helpers; Task 2's `STOP_SETTLE_MS`, `waitUnlisted`,
  `DIALOGUE_ROLES`, and the fake's `leaving` count.
- Produces: the ops `park` (`sessionId`, `after`, `waiting`, `notice`) →
  `{ parkRequested: <atMs> }`, or `error: "not a dialogue seat"` or
  `"ended"`; `hold` (`sessionId`, and `pid` or `forMs`) → `{ held: <atMs> }`,
  or `error: "old-contract seat"`, `"ended"`, `"held by another
  terminal"`, `"in a tab"`, `"unknown seat <sessionId>"`, or `"a hold names
  a pid or forMs"`; `release` (`sessionId`) → `{ released: <stamp> }`. A
  seat may carry `parkRequest: { after, waiting, notice, atMs, endedAtMs }`,
  `lastPark: { after, waiting }`, `waiting: true`, `held: { atMs, pid }` or
  `held: { atMs, forMs }`, `parkedAtMs`, and `listedAtMs`. The notice
  `waiting: <role> <topic> — tanto <role> [<topic>]`. `isContractDialogue`,
  `enterCommand`, and `pidAlive`, which Task 4 reuses; and the test helpers
  `dialogueSeat`, `PARK`, `once`, and `stopsOf`, which Task 4 reuses.

**Named-mechanism sites.** The `park` op and its three fields are also
`boundary.js request park` (Task 6), `templates/spawn-request.md`'s op list
(Task 22), `SKILL.md`'s "The faces of a seat" (Task 15), and the park rule
of the dialogue role files, `roles/sekkei.md`, `roles/keikaku.md`, and
`roles/kikaku.md` (Task 20) and `roles/hosa.md` and `roles/kaiseki.md`
(Task 21). `hold` and `release` are also `tanto.js`'s attach (Task 9),
`boundary.js wake --hold` (Task 6), `roles/kanri.md`'s "Human access" and
"Session lifecycle" (Tasks 18, 19), `templates/spawn-request.md` (Task 22),
and C-1 and C-2 in `SKILL.md`'s "The faces of a seat" (Task 15) and the
README (Task 23). The hold's errors are also the lines `tanto.js` prints for
them (Task 9). `parked`, `waiting`, and `lastPark` are also `boundary.js
census`'s **Parked** heading and its ` — waiting` suffix (Task 5),
`boundary.js seat` (Task 6), and `tanto.js jokyo`'s third column (Task 10).
The notice `waiting:` is also `SKILL.md`'s "Messages" (Task 14) and the
README (Task 23). `enterCommand`'s `tanto <role> [<topic>]` is also every
notice Task 4 rewrites.

**O3.1** `"attention", "ack"];` — `OPS` ending at `ack`, with no `park`, `hold`, or `release` (section 6); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**A3.2** `skills/tanto/scripts/spawner.js` — `grep -c "tryParks(root, seats" skills/tanto/scripts/spawner.js` — before: 0, after: 3

- [ ] **Step 1: Write the failing tests**

Apply P3.3 and P3.4: the fake's `stop` keeps what `seats.json` held as it
ran, and seven tests follow the `ack` test.

**P3.3** `skills/tanto/scripts/spawner.test.js` — replace exactly these 2 lines

```js
  if (sub === "stop") {
    found.state = "stopped";
```

**P3.3 →**

```js
  if (sub === "stop") {
    // What seats.json held as the stop ran: the park writes it first (spec 2.3).
    const seatsFile = state.root + "/.tanto/spawner/seats.json";
    if (fs.existsSync(seatsFile)) state.seatsAtStop = fs.readFileSync(seatsFile, "utf8");
    found.state = "stopped";
```

**P3.4** `skills/tanto/scripts/spawner.test.js` — replace exactly these 4 lines

```js
  assert.match(result(ws, id).acked, /\d/);
  assert.equal(seats(ws)[0].renamed, undefined);
  assert.equal(seats(ws)[0].name, "seat-two [cccccc]");
});
```

**P3.4 →**

```js
  assert.match(result(ws, id).acked, /\d/);
  assert.equal(seats(ws)[0].renamed, undefined);
  assert.equal(seats(ws)[0].name, "seat-two [cccccc]");
});

/**
 * A contract-2 Sekkei the spawner holds, its transcript `records`, listed in
 * the background and idle with `listing` merged in; the fake drops a stopped
 * session from the listing, as the CLI does once the process has left.
 */
function dialogueSeat(ws, { seat = {}, listing = {}, records = ENDED_TURN } = {}) {
  const transcript = writeRecords(ws, "sess-d", records);
  const name = "dotskills-sekkei-t-0a0b";
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-d",
        id: "bg05",
        name,
        cwd: ws.root,
        kind: "background",
        pid: 4321,
        status: "idle",
        ...listing,
      },
    ],
    dropsOnStop: true,
  });
  putSeats(ws, [
    {
      sessionId: "sess-d",
      id: "bg05",
      name,
      role: "sekkei",
      topic: "t",
      contract: 2,
      status: "running",
      transcript,
      ...seat,
    },
  ]);
  return transcript;
}

const PARK = { op: "park", sessionId: "sess-d", after: "u2" };
const once = (ws, opts) => run(ws, ["run", "--root", ws.root, "--once"], opts);
const stopsOf = (ws) =>
  calls(ws)
    .filter((argv) => argv[0] === "stop")
    .map((argv) => argv[1]);
const LATER = (ms) => ({ env: { TANTO_NOW_MS: String(STARTED_AT + ms) } });

test("a park stops an idle seat once its turn has ended, state first, decided by the listing and not the recorded status (spec 2.3)", () => {
  for (const status of ["running", "blocked"]) {
    const ws = workspace();
    dialogueSeat(ws, { seat: { status } });
    const { id } = request(ws, PARK);
    once(ws);
    assert.equal(result(ws, id).parkRequested, STARTED_AT);
    assert.deepEqual(stopsOf(ws), ["sess-d"]);
    const seat = seats(ws)[0];
    assert.equal(seat.status, "parked");
    assert.equal(seat.parkedAtMs, STARTED_AT);
    assert.deepEqual(seat.lastPark, { after: "u2", waiting: false });
    assert.equal(seat.parkRequest, undefined);
    const atStop = JSON.parse(JSON.parse(fs.readFileSync(ws.state, "utf8")).seatsAtStop).seats[0];
    assert.equal(atStop.status, "parked");
  }
});

test("a park waits on a busy seat, a seat on a prompt, and a held one, and is dropped ten minutes after the turn ended unless held (spec 2.3)", () => {
  const cases = [
    { listing: { status: "busy" } },
    { listing: { status: "waiting", waitingFor: "permission prompt" } },
    { seat: { held: { atMs: STARTED_AT, pid: process.pid } } },
  ];
  for (const { listing, seat } of cases) {
    const ws = workspace();
    dialogueSeat(ws, { listing, seat });
    request(ws, PARK);
    once(ws);
    assert.deepEqual(stopsOf(ws), []);
    assert.equal(seats(ws)[0].parkRequest.endedAtMs, STARTED_AT);
    once(ws, LATER(600000));
    assert.deepEqual(stopsOf(ws), []);
    assert.equal(seats(ws)[0].parkRequest === undefined, !seat?.held);
  }
});

test("a park is kept until the turn ends, dropped ten minutes after it was asked, and voided by a new turn (spec 2.3)", () => {
  const ws = workspace();
  dialogueSeat(ws, { records: ENDED_TURN.slice(0, 2) });
  request(ws, PARK);
  once(ws);
  assert.equal(seats(ws)[0].parkRequest.after, "u2");
  once(ws, LATER(600000));
  assert.equal(seats(ws)[0].parkRequest, undefined);
  assert.match(spawnerLog(ws), /park: sess-d dropped — its turn did not end/);

  const voided = workspace();
  dialogueSeat(voided, { records: [...ENDED_TURN, REC.human("u5")] });
  request(voided, PARK);
  once(voided);
  assert.equal(seats(voided)[0].parkRequest, undefined);
  assert.match(spawnerLog(voided), /park: sess-d void — a new turn began/);
  assert.deepEqual(stopsOf(voided), []);
});

test("a park parks an unlisted seat with no stop, leaves one a tab holds running, and raises the waiting notice once (spec 2.2, 2.3)", () => {
  const gone = workspace();
  dialogueSeat(gone, { listing: { hidden: true } });
  request(gone, PARK);
  once(gone);
  assert.equal(seats(gone)[0].status, "parked");
  assert.deepEqual(stopsOf(gone), []);

  const tab = workspace();
  dialogueSeat(tab, { listing: { kind: "interactive" } });
  request(tab, { ...PARK, waiting: true, notice: true });
  once(tab);
  assert.equal(seats(tab)[0].status, "running");
  assert.equal(seats(tab)[0].waiting, true);
  assert.equal(seats(tab)[0].parkRequest, undefined);
  assert.deepEqual(seats(tab)[0].lastPark, { after: "u2", waiting: true });
  assert.deepEqual(notices(tab), ["waiting: sekkei t — tanto sekkei t"]);
  // A peer's line starts a turn while the question stands: no second notice.
  const second = [REC.human("u5", { isMeta: true }), REC.tool("u6", "m3"), REC.result("u7"), REC.end("u8", "m4")];
  writeRecords(tab, "sess-d", [...ENDED_TURN, ...second, REC.close("stop_hook_summary")]);
  request(tab, { ...PARK, after: "u6", waiting: true, notice: true });
  once(tab);
  assert.equal(notices(tab).length, 1);
  // A turn's end without --waiting clears it.
  request(tab, { ...PARK, after: "u6" });
  once(tab);
  assert.equal(seats(tab)[0].waiting, undefined);
});

test("the standing request stops a seat listed again with no new turn two minutes on, not while held, and ends at a new turn (spec 2.3)", () => {
  for (const held of [false, true]) {
    const ws = workspace();
    const mark = held ? { held: { atMs: STARTED_AT, pid: process.pid } } : {};
    const lastPark = { after: "u2", waiting: false };
    dialogueSeat(ws, { seat: { status: "parked", parkedAtMs: STARTED_AT - 600000, lastPark, ...mark } });
    once(ws);
    assert.deepEqual(stopsOf(ws), []);
    assert.equal(seats(ws)[0].listedAtMs, STARTED_AT);
    once(ws, LATER(120000));
    assert.deepEqual(stopsOf(ws), held ? [] : ["sess-d"]);
    if (!held) assert.equal(seats(ws)[0].status, "parked");
  }
  const ws = workspace();
  const lastPark = { after: "u2", waiting: false };
  dialogueSeat(ws, { records: [...ENDED_TURN, REC.human("u5")], seat: { lastPark } });
  once(ws);
  assert.equal(seats(ws)[0].lastPark, undefined);
});

test("a park, a tab's new turn, the tab's own park, and the tab closed leave a standing request that stops the seat listed again (spec 2.3)", () => {
  const ws = workspace();
  dialogueSeat(ws);
  const entry = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions[0];
  request(ws, PARK);
  once(ws);
  assert.deepEqual(stopsOf(ws), ["sess-d"]);
  assert.equal(seats(ws)[0].status, "parked");

  // A tab holds the seat; the human's turn follows, and the seat's own park
  // request ends it.
  const turn = [REC.human("u5"), REC.tool("u6", "m3"), REC.result("u7"), REC.end("u8", "m4")];
  writeRecords(ws, "sess-d", [...ENDED_TURN, ...turn, REC.close("stop_hook_summary")]);
  // (A listed seat parked under thirty seconds ago is still leaving, S-5.)
  setState(ws, { sessions: [{ ...entry, kind: "interactive", state: "running" }] });
  once(ws, LATER(60000));
  assert.equal(seats(ws)[0].status, "running");
  request(ws, { ...PARK, after: "u6" });
  once(ws, LATER(60000));
  assert.equal(seats(ws)[0].parkRequest, undefined);
  assert.deepEqual(seats(ws)[0].lastPark, { after: "u6", waiting: false });

  // The tab closes: the seat is parked, and keeps the request it made.
  setState(ws, { sessions: [] });
  once(ws, LATER(60000));
  assert.equal(seats(ws)[0].status, "parked");
  assert.deepEqual(seats(ws)[0].lastPark, { after: "u6", waiting: false });

  // Listed again in the background with no new turn: stopped after two minutes.
  setState(ws, { sessions: [{ ...entry, kind: "background", state: "running" }] });
  once(ws, LATER(120000));
  assert.equal(seats(ws)[0].listedAtMs, STARTED_AT + 120000);
  assert.deepEqual(stopsOf(ws), ["sess-d"]);
  once(ws, LATER(240000));
  assert.deepEqual(stopsOf(ws), ["sess-d", "sess-d"]);
  assert.equal(seats(ws)[0].status, "parked");
});

test("hold marks a contract-2 seat, answers its errors, and release unmarks it and stops nothing (spec 2.4)", () => {
  const ws = workspace();
  dialogueSeat(ws);
  const marked = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid });
  once(ws);
  assert.equal(result(ws, marked.id).held, STARTED_AT);
  assert.deepEqual(seats(ws)[0].held, { atMs: STARTED_AT, pid: process.pid });
  const other = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid + 1 });
  once(ws);
  assert.equal(result(ws, other.id).error, "held by another terminal");
  const release = request(ws, { op: "release", sessionId: "sess-d" });
  once(ws);
  assert.match(result(ws, release.id).released, /\d/);
  assert.equal(seats(ws)[0].held, undefined);
  assert.equal(seats(ws)[0].status, "running");
  const forFace = request(ws, { op: "hold", sessionId: "sess-d", forMs: 3300000 });
  once(ws);
  assert.deepEqual(seats(ws)[0].held, { atMs: STARTED_AT, forMs: 3300000 });
  assert.equal(result(ws, forFace.id).error, undefined);
  assert.deepEqual(stopsOf(ws), []);

  const errorOf = (options, body) => {
    const each = workspace();
    dialogueSeat(each, options);
    const { id } = request(each, { sessionId: "sess-d", ...body });
    once(each);
    return result(each, id).error;
  };
  const hold = { op: "hold", pid: process.pid };
  assert.equal(errorOf({ listing: { kind: "interactive" } }, hold), "in a tab");
  assert.equal(errorOf({ seat: { status: "stopped" } }, hold), "ended");
  assert.equal(errorOf({ seat: { contract: undefined } }, hold), "old-contract seat");
  assert.equal(errorOf({ seat: { contract: undefined } }, PARK), "not a dialogue seat");
  assert.equal(errorOf({ seat: { status: "removed" } }, PARK), "ended");
});

test("hold answers still listed when the park it waited for never leaves the listing, and marks nothing (spec 2.4, S-5)", () => {
  const ws = workspace();
  dialogueSeat(ws, { listing: { leaving: 1000 }, seat: { status: "parked", parkedAtMs: STARTED_AT - 5000 } });
  const { id } = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid });
  once(ws);
  assert.equal(result(ws, id).error, "still listed");
  assert.equal(seats(ws)[0].held, undefined);
});

test("hold from the pid that already holds the seat refreshes the mark; another live pid is refused (spec 2.4)", () => {
  const ws = workspace();
  dialogueSeat(ws);
  const first = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid });
  once(ws);
  assert.equal(result(ws, first.id).held, STARTED_AT);
  const again = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid });
  once(ws, LATER(60000));
  assert.equal(result(ws, again.id).error, undefined);
  assert.equal(result(ws, again.id).held, STARTED_AT + 60000);
  assert.deepEqual(seats(ws)[0].held, { atMs: STARTED_AT + 60000, pid: process.pid });
  const other = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid + 1 });
  once(ws, LATER(60000));
  assert.equal(result(ws, other.id).error, "held by another terminal");
  assert.deepEqual(seats(ws)[0].held, { atMs: STARTED_AT + 60000, pid: process.pid });
});

test("hold waits out a park under thirty seconds old that the listing still shows (spec 2.4, S-5)", () => {
  const ws = workspace();
  dialogueSeat(ws, { listing: { leaving: 1 }, seat: { status: "parked", parkedAtMs: STARTED_AT - 5000 } });
  const { id } = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid });
  once(ws);
  assert.equal(result(ws, id).held, STARTED_AT);
  // The hold's own look, the wait's look that finds it gone, and the census's.
  assert.equal(calls(ws).filter((argv) => argv[0] === "agents").length, 3);
});
```

- [ ] **Step 2: Run the new tests to verify they fail**

```bash
node --test --test-name-pattern "a park |standing request|hold " skills/tanto/scripts/spawner.test.js
```

Expected: FAIL — `park`, `hold`, and `release` are `unknown op`, so no
result carries `parkRequested` or `held` and no seat is parked.

- [ ] **Step 3: Take the three ops and try every park at each pass**

Apply P3.5 to P3.9.

**P3.5** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
const OPS = ["spawn", "stop", "rm", "resume", "attention", "ack"];
```

**P3.5 →**

```js
const OPS = ["spawn", "stop", "rm", "resume", "attention", "ack", "park", "hold", "release"];
```

**P3.6** `skills/tanto/scripts/spawner.js` — replace exactly these 2 lines

```js
  // ack
  if (seat) delete seat.renamed;
```

**P3.6 →**

```js
  if (request.op === "park") return opPark(request, seat);
  if (request.op === "hold") return opHold(root, request, seat);
  if (request.op === "release") {
    if (!seat) return { error: `unknown seat ${request.sessionId}` };
    // The mark alone (spec 2.4): a park the seat asked for while it was held
    // proceeds at the next pass, and a seat that asked for none is left to
    // its own next turn's end.
    delete seat.held;
    return { released: stamp() };
  }

  // ack
  if (seat) delete seat.renamed;
```

**P3.7** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
function takeRequests(root, seats) {
```

**P3.7 →**

```js
// A seat parked at its own request and listed again with no new turn is
// stopped again once it has been listed this long (spec 2.3): long enough
// for a wake's `SendMessage` to begin a turn.
const RELISTED_PARK_MS = 120000;

/** Whether a seat is a contract-2 dialogue seat (spec 1.1, Words), the one kind the park and its census rules touch. */
function isContractDialogue(seat) {
  return seat?.contract === 2 && DIALOGUE_ROLES.includes(seat.role);
}

/** The launcher's way into a seat (spec 1.1): `tanto <role>`, with its topic when it has one. */
function enterCommand(seat) {
  const topic = seat.topic && seat.topic !== "—" ? ` ${seat.topic}` : "";
  return `tanto ${seat.role}${topic}`;
}

/** Whether a process answers signal 0 — a launcher holds a seat while it does (spec 2.4). */
function pidAlive(pid) {
  try {
    process.kill(Number(pid), 0);
    return true;
  } catch (error) {
    return error?.code === "EPERM";
  }
}

/**
 * `park` (spec 2.2, 2.3): the request is recorded on the seat, replacing any
 * earlier one, and answered at once; `tryParks` carries it out at the passes
 * that follow.
 */
function opPark(request, seat) {
  if (!isContractDialogue(seat)) return { error: "not a dialogue seat" };
  if (seat.status === "stopped" || seat.status === "removed") return { error: "ended" };
  const atMs = nowMs();
  seat.parkRequest = { after: request.after, waiting: request.waiting === true, notice: request.notice === true, atMs };
  return { parkRequested: atMs };
}

/**
 * `hold` (spec 2.4): a launcher's mark, `pid` its own, written before an
 * attach, which the listing does not show (H-1a); or Kanri's for a face with
 * no launcher, `forMs` long. It wakes nothing — the attach does (P-4). A
 * seat whose park is under thirty seconds old and still listed is waited out
 * first, so that the attach does not meet a process that is leaving (S-5); a
 * process that never leaves is `still listed`. The pid that already holds the
 * seat may hold it again.
 */
function opHold(root, request, seat) {
  if (!seat) return { error: `unknown seat ${request.sessionId}` };
  if (seat.contract !== 2) return { error: "old-contract seat" };
  if (seat.status === "stopped" || seat.status === "removed") return { error: "ended" };
  if (!request.pid && !request.forMs) return { error: "a hold names a pid or forMs" };
  if (seat.held?.pid && pidAlive(seat.held.pid) && seat.held.pid !== Number(request.pid)) {
    return { error: "held by another terminal" };
  }
  const { entry, error } = listedEntry(root, seat.sessionId);
  if (error) return { error: `claude agents: ${error}` };
  if (entry?.kind === "interactive") return { error: "in a tab" };
  if (entry && typeof seat.parkedAtMs === "number" && nowMs() - seat.parkedAtMs < STOP_SETTLE_MS) {
    if (!waitUnlisted(root, seat.sessionId)) return { error: "still listed" };
  }
  const atMs = nowMs();
  seat.held = request.pid ? { atMs, pid: Number(request.pid) } : { atMs, forMs: Number(request.forMs) };
  return { held: atMs };
}

/** A park done (spec 2.3): `parked` now, its request kept as `lastPark` until a new turn begins. */
function markParked(seat, park) {
  seat.status = "parked";
  seat.parkedAtMs = nowMs();
  seat.lastPark = { after: park.after, waiting: park.waiting };
  delete seat.kind;
  delete seat.listedAtMs;
}

/**
 * The park's stop (spec 2.3): the state file is written with the seat
 * `parked` before `claude stop` runs, so that a sender who reads it
 * meanwhile wakes the seat rather than sending into a process that is
 * stopping. A stop that fails puts the seat back to `running`, and its
 * `lastPark` is tried again by the standing request.
 */
function stopToPark(root, seats, seat, park) {
  markParked(seat, park);
  writeSeats(root, seats);
  const got = runWithEitherId("stop", seat, seat.sessionId);
  if (got.code !== 0 && !alreadyExited(got)) {
    seat.status = "running";
    delete seat.parkedAtMs;
    appendLog(root, `park: ${seat.sessionId} stop failed — ${failureText(got)}`);
    return;
  }
  appendLog(root, `park: ${seat.sessionId} stopped`);
}

/**
 * One park request, tried (spec 2.3): decided by the transcript and a fresh
 * listing, never by the seat's recorded status, which may be a pass behind.
 * A new turn since `after` voids it; until the turn has ended nothing is
 * done, and ten minutes after the request it is dropped. Once the turn has
 * ended the seat's `waiting` is set from the request, once, with the notice
 * when it goes from unset to set at a turn the human did not start. Then a
 * seat not listed is `parked`; one a tab holds stays `running`, its request
 * kept as `lastPark` for the standing request; one in the
 * background is stopped once it is `idle` and not held, and ten minutes
 * after its turn ended with no hold the request is dropped and the seat left
 * alive. A condition that cannot be read parks nothing.
 */
function tryPark(root, seats, seat, fresh) {
  const park = seat.parkRequest;
  const now = nowMs();
  const transcript = seat.transcript || findTranscript(seat.sessionId);
  const turn = transcript ? turnEnded(transcript, park.after) : null;
  if (turn?.newTurn) {
    delete seat.parkRequest;
    appendLog(root, `park: ${seat.sessionId} void — a new turn began`);
    return;
  }
  if (!turn?.ended) {
    if (now - park.atMs >= STANDING_WAIT_MS) {
      delete seat.parkRequest;
      appendLog(root, `park: ${seat.sessionId} dropped — its turn did not end`);
    }
    return;
  }
  if (park.endedAtMs === undefined) {
    park.endedAtMs = now;
    if (park.waiting && park.notice && !seat.waiting) {
      raiseNotice(`waiting: ${seat.role} ${seat.topic} — ${enterCommand(seat)}`);
    }
    if (park.waiting) seat.waiting = true;
    else delete seat.waiting;
  }
  const sessions = fresh();
  if (!sessions) return;
  const entry = sessions.find((s) => s.sessionId === seat.sessionId && s.pid);
  if (!entry) {
    delete seat.parkRequest;
    markParked(seat, park);
    appendLog(root, `park: ${seat.sessionId} parked — not listed`);
    return;
  }
  if (entry.kind === "interactive") {
    delete seat.parkRequest;
    seat.lastPark = { after: park.after, waiting: park.waiting };
    appendLog(root, `park: ${seat.sessionId} left running — a tab holds it`);
    return;
  }
  if (seat.held) return;
  if (entry.status === "idle") {
    delete seat.parkRequest;
    stopToPark(root, seats, seat, park);
    return;
  }
  if (now - park.endedAtMs >= STANDING_WAIT_MS) {
    delete seat.parkRequest;
    appendLog(
      root,
      `park: ${seat.sessionId} dropped — ${entry.status || "no status"} ten minutes after its turn ended`,
    );
  }
}

/**
 * The standing request (spec 2.3): a seat parked at its own request and
 * listed in the background again — woken by an attach or a wake — in which
 * no new turn has begun since `lastPark.after` is stopped again, state
 * first, once it has been listed two minutes, is `idle`, and is not held:
 * its own last request carried out again, not a park on the spawner's
 * reading. A new turn ends the standing request.
 */
function standingPark(root, seats, seat, fresh) {
  const park = seat.lastPark;
  const transcript = seat.transcript || findTranscript(seat.sessionId);
  const turn = transcript ? turnEnded(transcript, park.after) : null;
  if (!turn) return;
  if (turn.newTurn) {
    delete seat.lastPark;
    delete seat.listedAtMs;
    return;
  }
  const entry = fresh()?.find((s) => s.sessionId === seat.sessionId && s.pid);
  if (!entry || entry.kind === "interactive") return;
  if (typeof seat.listedAtMs !== "number") {
    seat.listedAtMs = nowMs();
    return;
  }
  if (nowMs() - seat.listedAtMs < RELISTED_PARK_MS || entry.status !== "idle" || seat.held) return;
  appendLog(root, `park: ${seat.sessionId} listed again with no new turn`);
  stopToPark(root, seats, seat, park);
}

/**
 * Every park request, at every request pass and every census pass (spec
 * 2.3), and the standing request of every seat parked at its own word, at a
 * census pass. A listing is taken once, and only when a seat needs one;
 * `sessions` is the census's own.
 */
function tryParks(root, seats, sessions = null, census = false) {
  const due = seats.filter(
    (seat) => seat.status !== "stopped" && seat.status !== "removed" && (seat.parkRequest || (census && seat.lastPark)),
  );
  if (due.length === 0) return;
  let listed = sessions;
  const fresh = () => {
    if (!listed) {
      const listing = listAgents(root);
      if (listing.error) return null;
      listed = listing.sessions;
    }
    return listed;
  };
  for (const seat of due) {
    if (seat.parkRequest) tryPark(root, seats, seat, fresh);
    else standingPark(root, seats, seat, fresh);
  }
  writeSeats(root, seats);
}

function takeRequests(root, seats) {
```

**P3.8** `skills/tanto/scripts/spawner.js` — insert after these 2 lines

```js
    appendLog(root, `${request.op} ${name} ${said}`);
  }
```

**P3.8 →**

```js
  tryParks(root, seats);
```

**P3.9** `skills/tanto/scripts/spawner.js` — insert before these 2 lines

```js
  writeSeats(root, seats);
  return seats;
```

**P3.9 →**

```js
  tryParks(root, seats, listing.sessions, true);
```

- [ ] **Step 4: Run the spawner's suite to verify it passes**

```bash
node --test skills/tanto/scripts/spawner.test.js
```

Expected: every test passes, the seven new ones among them.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes.

- [ ] **Step 6: Verify the passages**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 3
```

Expected: `task 3: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints** on
  `skills/tanto/scripts/spawner.js` and `skills/tanto/scripts/spawner.test.js`.

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints** — subject
  `feat: the spawner parks a dialogue seat at its own request, holds one a terminal or Kanri has open, and stands by its last park`;
  paths `skills/tanto/scripts/spawner.js` and
  `skills/tanto/scripts/spawner.test.js`.

Expected: one commit.

### Task 4: the census (`kind`/`status`/`waitingFor`, `blocked` keyed on a prompt, `parked` visits, absence → `parked` with `midTurn`, hold clearing), `cmdRun`'s `contract` file, the notices and the hook line, the `attention` branch

Spec 2.6 (`blocked` carries its cause), 2.7's spawner half (a contract-2
dialogue seat's absence is `parked`, with `midTurn`; a `parked` seat listed
again is `running`), 2.4's census half (a dead launcher's hold and an
expired `forMs` one cleared), 1.3 and 3.1's listed `kind` and name, 4.2's
`.tanto/spawner/contract`, and the notices of section 6's `spawner.js`
entry. After this task the census records each listed seat's `kind`, marks
`blocked` only on a background entry's `status: "waiting"` with its
`waitingFor`, parks a contract-2 dialogue seat that leaves the listing and
marks its cut turn, sets a `parked` seat that is listed again `running`,
and clears a hold whose launcher died or whose `forMs` has passed; the
spawner writes `.tanto/spawner/contract` at its start; and no notice the
spawner raises names `claude attach` but the hook's for a session the state
file does not hold.

**Files:**

- Modify: `skills/tanto/scripts/spawner.js` — `LIVE`'s comment;
  `noticeText`; the `attention` branch; `revive`'s comment, with `relist`,
  `parkByAbsence`, and `clearHold` after it; `noFirstTurn`'s comment and its
  way in; `censusSeat`'s absent branch and its blocked test; `runCensus`'s
  loop; `cmdRun`'s `contract` file; `seatsAbove` before `cmdNotify`, and
  `cmdNotify`'s line.
- Test: `skills/tanto/scripts/spawner.test.js` — the fake's stale entry
  and every fixture that sets `state: "blocked"`; the `notify --text` and
  `attention` tests' lines and the `no first turn` toast; one hook test after
  "notify --stdin reads the hook payload"; one test after "run --once writes
  the pidfile"; four census tests at the end.

**Interfaces:**

- Consumes: Task 1's `turnEnded` and `REC`/`ENDED_TURN`/`writeRecords`/
  `putSeats`; Task 2's `STOP_SETTLE_MS`; Task 3's `isContractDialogue`,
  `enterCommand`, `pidAlive`, and the test helpers `dialogueSeat` and
  `once`.
- Produces: a seat's `kind` and `waitingFor` at each census pass; `parked`
  with `parkedAtMs` and `midTurn: true` for a contract-2 dialogue seat the
  listing no longer shows; `running` with `listedAtMs` for a `parked` seat
  listed again; the notices
  `blocked: <role> <topic> <name> — <waitingFor> — tanto <role> [<topic>]`,
  `no first turn: <role> <topic> <name> — tanto <role> [<topic>]`, and the
  hook's `tanto: <type> in <cwd> — tanto <role> [<topic>]`, or
  `— claude attach <session_id>` for a session no seat holds; an
  `attention` message raised as written; `.tanto/spawner/contract`, holding
  `2`.

**Named-mechanism sites.** `blocked` keyed on `status: "waiting"`, and
`waitingFor`, are also `boundary.js census`'s ` — blocked (<waitingFor>)`
(Task 5), `tanto.js`'s `s.state !== "stopped"` filters (Task 11) and
`jokyo`'s `blocked — <cause>` (Task 10), `SKILL.md`'s "The roster" (Task
13), and `templates/roster.md`'s status paragraph (Task 7); the fixtures
that set `state: "blocked"` in `boundary.test.js` (Task 5) move with that
task, since this one changes `spawner.js`'s key alone. The one in
`tanto.test.js`, in "a pid-less listing entry is not read as a live seat",
stays on purpose: its comment calls it the measured real shape of a pid-less
entry, which still lists `state: "blocked"`, and no launcher code reads
`state` as a blocked signal. `parked` and `midTurn` are also `boundary.js
census`'s **Parked** and ` — mid-turn` (Task 5), `boundary.js seat`
(Task 6), `tanto.js`'s `fukki`, `jokyo`, and `teishi --seats` (Tasks 10,
11), and `roles/kanri.md`'s Recovery (Task 19). `.tanto/spawner/contract`
is also `tanto.js`'s older-spawner check (Task 8) and `teishi`, which
removes it (Task 11), `SKILL.md`'s "Artifacts" `.tanto/spawner/` row
(Task 15), and the README (Task 23). The way in by role on a notice is
also `roles/kanri.md`'s "Session lifecycle", "`no first turn: <role>
<topic>`, with a space and `— claude attach <id>` after it" (Task 19), and
its "Shoroku" and "Human access" `attention` messages, "the spawner filling
the id from `seats.json`" (Tasks 18, 19); `SKILL.md`'s "Human access" and
"Session exit" `attention` messages (Task 14); and
`templates/spawn-request.md`'s `attention` field, "fills a bare `<id>` in
the message from it" (Task 22). The hook line is also the README's
`spawner.js notify --stdin` paragraph (Task 23) and `SKILL.md`'s
"Artifacts" (Task 15).

**O4.1** `session.state === "blocked"` — `censusSeat`'s `blocked` test on the retired `state` field (spec 2.6; Old values); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O4.2** `session.state !== "blocked"` — its other half; before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O4.3** `replace("<id>"` — the `attention` branch's id fill (Old values); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O4.4** `claude attach ${seat.id}` — `noticeText`'s and `noFirstTurn`'s attach hint (section 6); before: 2 in `skills/tanto/scripts/spawner.js`, after: 0. The hook's `claude attach ${who}` stays, for a session the state file does not hold (Old values, `claude attach`).

**O4.5** `reopened with` — `revive`'s comment, "reopened with `claude attach <id>`"; before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O4.6** `id: stale.id, state: "blocked"` — the fake's stale entry, which set the retired field (spec 2.6, "What the plan must contain"); before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0. The other five fixtures are O4.32 to O4.34 and, for the two with a property per line (`state: "blocked",` indented eight spaces, which Task 5's new boundary fixtures also contain), the blocks themselves: Task 4's `verify` checks them. The one in `skills/tanto/scripts/tanto.test.js` stays; it is not a fixture of the key Task 4 changes.

**O4.32** `{ ...rest, state: "blocked" }` — the fake's stale-listing branch that set the retired field (spec 2.6); before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0.

**O4.33** `{ ...s, state: "blocked" }` — the fixture that marked every listed session `blocked` by the retired field (spec 2.6); before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0.

**O4.34** `cwd: ws.root, kind: "background", state: "blocked" }` — the one-line fixture of a new seat listed `blocked` by the retired field (spec 2.6); before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0.

**O4.7** `claude attach bg01` — the `notify --text`, `attention`, and `no first turn` assertions; before: 4 in `skills/tanto/scripts/spawner.test.js`, after: 0. The six in `skills/tanto/scripts/tanto.test.js` are the launcher's own attach line, which may stay (Old values, `claude attach`); Task 9 decides them.

**O4.8** `claude attach <id>` — the `attention` test's message and `revive`'s comment; before: 1 in `skills/tanto/scripts/spawner.test.js` and 1 in `skills/tanto/scripts/spawner.js`, after: 0 in both.

- [ ] **Step 1: Write the failing tests**

Apply P4.9 to P4.20: the fixtures move to `status`, the notice lines to the
way in by role, and six tests are added.

**P4.9** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
    return { ...rest, name: stale.name, id: stale.id, state: "blocked" };
```

**P4.9 →**

```js
    return { ...rest, name: stale.name, id: stale.id };
```

**P4.10** `skills/tanto/scripts/spawner.test.js` — replace exactly these 3 lines

```js
  const got = run(ws, ["notify", "--text", "kessai: t — claude attach bg01"]);
  assert.equal(got.code, 0);
  assert.deepEqual(notices(ws), ["kessai: t — claude attach bg01"]);
```

**P4.10 →**

```js
  const got = run(ws, ["notify", "--text", "kessai: t — tanto kanri"]);
  assert.equal(got.code, 0);
  assert.deepEqual(notices(ws), ["kessai: t — tanto kanri"]);
```

**P4.11** `skills/tanto/scripts/spawner.test.js` — replace exactly these 4 lines

```js
  assert.equal(got.code, 0);
  assert.equal(notices(ws).length, 1);
  assert.match(notices(ws)[0], /permission_prompt/);
});
```

**P4.11 →**

```js
  assert.equal(got.code, 0);
  assert.equal(notices(ws).length, 1);
  assert.match(notices(ws)[0], /permission_prompt/);
});

test("the hook's notice names the way in by role for a seat the state file holds, and claude attach for any other session (spec 1.1)", () => {
  const ws = workspace();
  putSeats(ws, [{ sessionId: "sess-1", id: "bg01", name: "s", role: "sekkei", topic: "t", status: "running" }]);
  const hook = (sessionId, cwd) =>
    run(ws, ["notify", "--stdin"], {
      input: JSON.stringify({ session_id: sessionId, cwd, notification_type: "permission_prompt" }),
    });
  const worktree = path.join(ws.root, ".claude", "worktrees", "x");
  hook("sess-1", worktree);
  hook("sess-9", ws.root);
  assert.deepEqual(notices(ws), [
    `tanto: permission_prompt in ${worktree} — tanto sekkei t`,
    `tanto: permission_prompt in ${ws.root} — claude attach sess-9`,
  ]);
});
```

**P4.12** `skills/tanto/scripts/spawner.test.js` — replace exactly these 7 lines

```js
  // spawner's census marks it gone.
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, {
    sessions: listed.map((s) => {
      const { pid, ...rest } = s;
      return { ...rest, state: "blocked" };
    }),
```

**P4.12 →**

```js
  // spawner's census marks it gone.
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, {
    sessions: listed.map((s) => {
      const { pid, ...rest } = s;
      return rest;
    }),
```

**P4.13** `skills/tanto/scripts/spawner.test.js` — replace exactly these 14 lines

```js
test("attention fills a bare id from seats.json and names its channel", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const { id } = request(ws, {
    op: "attention",
    sessionId: "sess-new",
    message: "human-needed: jisso t — claude attach <id>",
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).channel, "log");
  assert.match(result(ws, id).notified, /\d/);
  assert.deepEqual(notices(ws), ["human-needed: jisso t — claude attach bg01"]);
});
```

**P4.13 →**

```js
test("attention raises its message as written and names its channel (spec 1.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const { id } = request(ws, {
    op: "attention",
    sessionId: "sess-new",
    message: "human-needed: jisso t — tanto jisso t",
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).channel, "log");
  assert.match(result(ws, id).notified, /\d/);
  assert.deepEqual(notices(ws), ["human-needed: jisso t — tanto jisso t"]);
});
```

**P4.14** `skills/tanto/scripts/spawner.test.js` — replace exactly these 9 lines

```js
  fs.mkdirSync(ws.notices, { recursive: true });
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-new [aaaaaa]",
        cwd: ws.root,
        kind: "background",
        state: "blocked",
```

**P4.14 →**

```js
  fs.mkdirSync(ws.notices, { recursive: true });
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-new [aaaaaa]",
        cwd: ws.root,
        kind: "background",
        status: "waiting",
        waitingFor: "permission prompt",
```

**P4.15** `skills/tanto/scripts/spawner.test.js` — replace exactly these 13 lines

```js
test("the census raises one notice per block, not one per pass", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-new [aaaaaa]",
        cwd: ws.root,
        kind: "background",
        state: "blocked",
        waitingFor: "permission prompt",
```

**P4.15 →**

```js
test("the census raises one notice per block, not one per pass", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-new [aaaaaa]",
        cwd: ws.root,
        kind: "background",
        status: "waiting",
        waitingFor: "permission prompt",
```

**P4.16** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  setState(ws, { sessions: listed.map((s) => ({ ...s, state: "blocked" })) });
```

**P4.16 →**

```js
  setState(ws, { sessions: listed.map((s) => ({ ...s, status: "waiting", waitingFor: "permission prompt" })) });
```

**P4.17** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
      { sessionId: "sess-new", name: "seat-new [aaaaaa]", cwd: ws.root, kind: "background", state: "blocked" },
```

**P4.17 →**

```js
      { sessionId: "sess-new", name: "seat-new [aaaaaa]", cwd: ws.root, kind: "background", status: "waiting" },
```

**P4.18** `skills/tanto/scripts/spawner.test.js` — replace exactly these 2 lines

```js
  assert.equal(alive, false);
});
```

**P4.18 →**

```js
  assert.equal(alive, false);
});

test("run writes the contract file, holding 2, at its start (spec 4.2)", () => {
  const ws = workspace();
  assert.equal(run(ws, ["run", "--root", ws.root, "--once"]).code, 0);
  assert.equal(fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "contract"), "utf8"), "2\n");
});
```

**P4.19** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  assert.deepEqual(notices(ws), [`no first turn: jisso t ${seat.name} — claude attach bg01`]);
```

**P4.19 →**

```js
  assert.deepEqual(notices(ws), [`no first turn: jisso t ${seat.name} — tanto jisso t`]);
```

**P4.20** `skills/tanto/scripts/spawner.test.js` — replace exactly these 3 lines

```js
  assert.deepEqual(notices(second), []);
  assert.match(spawnerLog(second), /census: sess-new gone\n/);
});
```

**P4.20 →**

```js
  assert.deepEqual(notices(second), []);
  assert.match(spawnerLog(second), /census: sess-new gone\n/);
});

test("a contract-2 dialogue seat the listing drops with no transcript goes gone with the mark and the notice, not parked (spec 2.7, 3.1)", () => {
  const ws = workspace();
  const seat = {
    sessionId: "sess-d",
    id: "bg05",
    name: "dotskills-sekkei-t-0a0b",
    role: "sekkei",
    topic: "t",
    contract: 2,
    status: "running",
    startedAtMs: STARTED_AT - 10000,
  };
  putSeats(ws, [seat]);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const after = seats(ws)[0];
  assert.equal(after.status, "gone");
  assert.match(after.noFirstTurn, /\d/);
  assert.equal(after.parkedAtMs, undefined);
  assert.deepEqual(notices(ws), ["no first turn: sekkei t dotskills-sekkei-t-0a0b"]);
  assert.match(spawnerLog(ws), /census: sess-d gone — no first turn/);

  // The same seat with a transcript is still parked, never gone.
  const written = workspace();
  putSeats(written, [seat]);
  writeTranscript(written, "sess-d");
  run(written, ["run", "--root", written.root, "--once"]);
  assert.equal(seats(written)[0].status, "parked");
  assert.equal(seats(written)[0].noFirstTurn, undefined);
  assert.deepEqual(notices(written), []);
});

test("the census marks blocked on a background entry's status waiting, with its cause, never on state blocked or in a tab (spec 2.6)", () => {
  const ws = workspace();
  const ids = ["sess-prompt", "sess-idle", "sess-tab"];
  const listing = {
    "sess-prompt": { kind: "background", status: "waiting", waitingFor: "permission prompt" },
    "sess-idle": { kind: "background", status: "idle" },
    "sess-tab": { kind: "interactive", status: "waiting", waitingFor: "permission prompt" },
  };
  // An idle seat lists the retired `state` as blocked too (S-1).
  listing["sess-idle"].state = "blocked";
  setState(ws, {
    sessions: ids.map((sessionId) => ({
      sessionId,
      name: `n-${sessionId}`,
      cwd: ws.root,
      pid: 4321,
      ...listing[sessionId],
    })),
  });
  const seat = (sessionId) => ({ sessionId, name: `n-${sessionId}`, role: "jisso", topic: "t", status: "running" });
  putSeats(
    ws,
    ids.map((sessionId) => ({ ...seat(sessionId), transcript: writeTranscript(ws, sessionId) })),
  );
  once(ws);
  const byId = Object.fromEntries(seats(ws).map((each) => [each.sessionId, each]));
  assert.equal(byId["sess-prompt"].status, "blocked");
  assert.equal(byId["sess-prompt"].waitingFor, "permission prompt");
  assert.equal(byId["sess-prompt"].kind, "background");
  assert.equal(byId["sess-idle"].status, "running");
  assert.equal(byId["sess-tab"].status, "running");
  assert.equal(byId["sess-tab"].kind, "interactive");
  assert.deepEqual(notices(ws), ["blocked: jisso t n-sess-prompt — permission prompt — tanto jisso t"]);
});

test("the census parks a contract-2 dialogue seat that leaves the listing, with midTurn, and marks an unmarked one and a Jisso gone (spec 2.7)", () => {
  const ws = workspace();
  const seat = (sessionId, role, records, extra = {}) => ({
    sessionId,
    name: sessionId,
    role,
    topic: "t",
    status: "running",
    transcript: writeRecords(ws, sessionId, records),
    ...extra,
  });
  putSeats(ws, [
    seat("sess-cut", "sekkei", [REC.human("u1"), REC.tool("u2", "m1")], { contract: 2 }),
    seat("sess-done", "keikaku", ENDED_TURN, { contract: 2 }),
    seat("sess-old", "keikaku", ENDED_TURN),
    seat("sess-j", "jisso", ENDED_TURN, { contract: 2 }),
  ]);
  once(ws);
  const byId = Object.fromEntries(seats(ws).map((each) => [each.sessionId, each]));
  assert.equal(byId["sess-cut"].status, "parked");
  assert.equal(byId["sess-cut"].midTurn, true);
  assert.equal(byId["sess-cut"].parkedAtMs, STARTED_AT);
  assert.equal(byId["sess-done"].status, "parked");
  assert.equal(byId["sess-done"].midTurn, undefined);
  assert.equal(byId["sess-old"].status, "gone");
  assert.equal(byId["sess-j"].status, "gone");
  assert.match(spawnerLog(ws), /census: sess-cut parked — mid-turn/);
});

test("the census sets a parked seat running when the listing shows it again, and parked once more when it goes (spec 2.7)", () => {
  const ws = workspace();
  const seat = { status: "parked", parkedAtMs: STARTED_AT - 600000, midTurn: true };
  dialogueSeat(ws, { listing: { kind: "interactive", name: "dotskills-7b" }, seat });
  once(ws);
  const back = seats(ws)[0];
  assert.equal(back.status, "running");
  assert.equal(back.kind, "interactive");
  assert.equal(back.name, "dotskills-7b");
  assert.equal(back.listedAtMs, STARTED_AT);
  assert.equal(back.midTurn, undefined);
  setState(ws, { sessions: [] });
  once(ws);
  assert.equal(seats(ws)[0].status, "parked");

  // Parked five seconds ago and still listed: the process is leaving (S-5).
  const leaving = workspace();
  dialogueSeat(leaving, { seat: { status: "parked", parkedAtMs: STARTED_AT - 5000 } });
  once(leaving);
  assert.equal(seats(leaving)[0].status, "parked");
});

test("the census clears a dead launcher's hold, and a forMs hold once the transcript has been quiet that long (spec 2.4)", () => {
  const dead = spawnSync(process.execPath, ["-e", ""]).pid;
  const ws = workspace();
  dialogueSeat(ws, { seat: { held: { atMs: STARTED_AT, pid: dead } } });
  once(ws);
  assert.equal(seats(ws)[0].held, undefined);
  assert.match(spawnerLog(ws), /census: sess-d hold cleared/);
  for (const [quietMs, cleared] of [
    [3360000, true],
    [600000, false],
  ]) {
    const each = workspace();
    const transcript = dialogueSeat(each, { seat: { held: { atMs: STARTED_AT - 3600000, forMs: 3300000 } } });
    const at = new Date(STARTED_AT - quietMs);
    fs.utimesSync(transcript, at, at);
    once(each);
    assert.equal(seats(each)[0].held === undefined, cleared);
  }
});
```

- [ ] **Step 2: Run the new and changed tests to verify they fail**

```bash
node --test --test-name-pattern "the census|hook's notice|attention raises|contract file|census raises one notice|pass that throws|no transcript two minutes" skills/tanto/scripts/spawner.test.js
```

Expected: FAIL — a fixture that now says `status: "waiting"` is not
`blocked`, so "a pass that throws", "the census raises one notice per
block", and "the census revives a gone seat" fail; the `no first turn`
toast still names `claude attach bg01`; no seat records `kind` or
`waitingFor`; the dialogue seat that left is `gone`; the relisted seat
stays `parked`; no hold is cleared; no `contract` file is written; the hook
names `claude attach sess-1`. "attention raises its message as written"
passes already, since a message with no `<id>` was raised as written
before too.

- [ ] **Step 3: Key the census on the listing's status, park on absence, and name the way in**

Apply P4.21 to P4.31.

**P4.21** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
// The seat statuses `seats.json` carries. They are not the roster's words:
// the roster gains `stopped` alone, and Kanri writes it.
const LIVE = ["running", "blocked"];
```

**P4.21 →**

```js
// The statuses a census pass checks against the listing's entry (spec 2.7):
// a `parked` seat the listing shows again is `relist`ed into them first,
// and a `gone` one `revive`d. They are not the roster's words: a `parked`
// seat's row stays `live`, and Kanri writes `stopped`.
const LIVE = ["running", "blocked"];
```

**P4.22** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
function noticeText(seat, message) {
  if (message) return message;
  const where = seat.id ? ` — claude attach ${seat.id}` : "";
  return `blocked: ${seat.role} ${seat.topic} ${seat.name}${where}`;
}
```

**P4.22 →**

```js
/**
 * The census's notice for a seat on a prompt (spec 2.6): its cause, as the
 * listing gives it, and the launcher's way in, by role — a seat's id
 * changes at every handover, and its role does not (I-11).
 */
function noticeText(seat) {
  return `blocked: ${seat.role} ${seat.topic} ${seat.name} — ${seat.waitingFor} — ${enterCommand(seat)}`;
}
```

**P4.23** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
    const text = String(request.message || "").replace("<id>", seat?.id || "<id>");
```

**P4.23 →**

```js
    // As written: a message names `tanto <role> [<topic>]`, never an id (spec 1.1).
    const text = String(request.message || "");
```

**P4.24** `skills/tanto/scripts/spawner.js` — replace exactly these 12 lines

```js
/**
 * A seat `seats.json` holds as `gone` whose `sessionId` the listing holds
 * again — one the human `/stop`ped and reopened with `claude attach <id>`
 * (spec 1.3). It goes back to `running`, and the pass that follows sets
 * `blocked` when the listing says so, the notice with it. A seat the run's
 * own `stop` request stopped, or one removed, is never revived.
 */
function revive(root, seat) {
  seat.status = "running";
  delete seat.goneAt;
  appendLog(root, `census: ${seat.sessionId} back`);
}
```

**P4.24 →**

```js
/**
 * A seat `seats.json` holds as `gone` whose `sessionId` the listing holds
 * again — one the human `/stop`ped and reopened (spec 1.3). It goes back to
 * `running`, and the pass that follows sets `blocked` when the listing says
 * so, the notice with it. A seat the run's own `stop` request stopped, or
 * one removed, is never revived.
 */
function revive(root, seat) {
  seat.status = "running";
  delete seat.goneAt;
  appendLog(root, `census: ${seat.sessionId} back`);
}

/**
 * A `parked` seat the listing shows again (spec 2.7) — woken by an attach, a
 * click on its row, or a wake — is `running`, and the pass that follows
 * records its listed kind and name. Within thirty seconds of its park the
 * entry is the stopped process leaving (S-5), not a return.
 */
function relist(root, seat) {
  if (typeof seat.parkedAtMs === "number" && nowMs() - seat.parkedAtMs < STOP_SETTLE_MS) return;
  seat.status = "running";
  seat.listedAtMs = nowMs();
  delete seat.parkedAtMs;
  delete seat.midTurn;
  appendLog(root, `census: ${seat.sessionId} listed again`);
}

/**
 * A contract-2 dialogue seat the listing no longer shows (spec 2.7) — parked
 * by a pass, its tab closed, collected after its idle hour, cut by a reboot
 * — is `parked`, never `gone`: its conversation is on disk, and a wake
 * brings it back. A seat with no transcript at all has no conversation to
 * wake and goes `gone` with the no-first-turn mark (spec 3.1, R-7).
 * `midTurn` marks a last turn that did not end by itself,
 * read over the whole transcript (spec 2.8), for Kanri's Recovery and
 * `tanto jokyo`.
 */
function parkByAbsence(root, seat) {
  seat.status = "parked";
  seat.parkedAtMs = nowMs();
  delete seat.kind;
  delete seat.listedAtMs;
  delete seat.waitingFor;
  if (lookForTranscript(root, seat) && turnEnded(seat.transcript)?.midTurn) seat.midTurn = true;
  else delete seat.midTurn;
  appendLog(root, `census: ${seat.sessionId} parked${seat.midTurn ? " — mid-turn" : ""}`);
}

/**
 * The census's end of a hold (spec 2.4): a launcher's mark once its pid no
 * longer answers signal 0 — a launcher that died released nothing — and a
 * mark for a face with no launcher once the seat's transcript has gone
 * unwritten for its `forMs`. A seat's standing request then parks it.
 */
function clearHold(root, seat) {
  const mark = seat.held;
  if (!mark) return;
  if (mark.pid) {
    if (pidAlive(mark.pid)) return;
  } else if (mark.forMs) {
    const transcript = seat.transcript || findTranscript(seat.sessionId);
    const writtenMs = (transcript && fs.statSync(transcript, { throwIfNoEntry: false })?.mtimeMs) || 0;
    if (nowMs() - Math.max(writtenMs, mark.atMs || 0) < mark.forMs) return;
  }
  delete seat.held;
  appendLog(root, `census: ${seat.sessionId} hold cleared`);
}
```

**P4.25** `skills/tanto/scripts/spawner.js` — replace exactly these 10 lines

```js
 * closed at the spawn, and what reaches here is for the human to look at. The
 * attach hint rides only on a seat the listing still holds (a gone seat has no
 * pid to attach to). A seat with no `startedAtMs`, one from before this rule,
 * is never judged. A seat whose prompt was not delivered (spec 1.2) is never
 * marked: its cause is already in its result.
 */
function noFirstTurn(root, seat, line, listed = false) {
  if (seat.noFirstTurn || seat.undelivered || typeof seat.startedAtMs !== "number") return false;
  seat.noFirstTurn = stamp();
  const where = listed && seat.id ? ` — claude attach ${seat.id}` : "";
```

**P4.25 →**

```js
 * closed at the spawn, and what reaches here is for the human to look at. The
 * way in, `tanto <role> [<topic>]`, rides only on a seat the listing still
 * holds: a gone seat has no process to enter. A seat with no `startedAtMs`,
 * one from before this rule, is never judged. A seat whose prompt was not
 * delivered (spec 1.2) is never marked: its cause is already in its result.
 */
function noFirstTurn(root, seat, line, listed = false) {
  if (seat.noFirstTurn || seat.undelivered || typeof seat.startedAtMs !== "number") return false;
  seat.noFirstTurn = stamp();
  const where = listed ? ` — ${enterCommand(seat)}` : "";
```

**P4.26** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
/** One `running` or `blocked` seat against the listing's entry for it. */
function censusSeat(root, seat, session) {
  if (!session) {
    seat.status = "gone";
```

**P4.26 →**

```js
/** One `running` or `blocked` seat against the listing's entry for it. */
function censusSeat(root, seat, session) {
  if (!session && isContractDialogue(seat) && lookForTranscript(root, seat)) {
    parkByAbsence(root, seat);
    return;
  }
  if (!session) {
    seat.status = "gone";
```

**P4.27** `skills/tanto/scripts/spawner.js` — replace exactly these 8 lines

```js
  if (session.id) seat.id = session.id;
  if (session.state === "blocked" && seat.status !== "blocked") {
    seat.status = "blocked";
    raiseNotice(noticeText(seat));
    appendLog(root, `census: ${seat.sessionId} blocked`);
  } else if (session.state !== "blocked" && seat.status === "blocked") {
    seat.status = "running";
  }
```

**P4.27 →**

```js
  if (session.id) seat.id = session.id;
  seat.kind = session.kind;
  // A prompt in the background (spec 2.6, S-1): the listing's `status:
  // "waiting"`, its cause in `waitingFor`. A seat that answered and waits is
  // `idle` and not blocked, and a prompt in a tab is in front of the human
  // already.
  const onPrompt = session.kind === "background" && session.status === "waiting";
  if (onPrompt) {
    seat.waitingFor = session.waitingFor || "waiting";
    if (seat.status !== "blocked") {
      seat.status = "blocked";
      raiseNotice(noticeText(seat));
      appendLog(root, `census: ${seat.sessionId} blocked — ${seat.waitingFor}`);
    }
  } else {
    if (seat.status === "blocked") seat.status = "running";
    delete seat.waitingFor;
  }
```

**P4.28** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
    const session = byId.get(seat.sessionId);
    if (seat.status === "gone" && session) revive(root, seat);
    if (LIVE.includes(seat.status)) censusSeat(root, seat, session);
```

**P4.28 →**

```js
    const session = byId.get(seat.sessionId);
    if (seat.status === "gone" && session) revive(root, seat);
    if (seat.status === "parked" && session) relist(root, seat);
    if (LIVE.includes(seat.status)) censusSeat(root, seat, session);
    clearHold(root, seat);
```

**P4.29** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
  fs.writeFileSync(path.join(spawnerDir(root), "pid"), `${process.pid}\n`);
```

**P4.29 →**

```js
  fs.writeFileSync(path.join(spawnerDir(root), "pid"), `${process.pid}\n`);
  // The contract this spawner keeps (spec 4.2): a launcher that finds a
  // spawner beating and no such file is talking to code from before it.
  // `tanto teishi` removes it with `pid` and `heartbeat`.
  fs.writeFileSync(path.join(spawnerDir(root), "contract"), "2\n");
```

**P4.30** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
function cmdNotify(argv) {
```

**P4.30 →**

```js
/**
 * The seats of the run whose root is `cwd` or above it — a worktree seat's
 * cwd lies under the root — or none when no state file is found.
 */
function seatsAbove(cwd) {
  let dir = cwd ? path.resolve(cwd) : "";
  while (dir) {
    if (fs.existsSync(path.join(spawnerDir(dir), "seats.json"))) return readSeats(dir);
    const parent = path.dirname(dir);
    if (parent === dir) return [];
    dir = parent;
  }
  return [];
}

function cmdNotify(argv) {
```

**P4.31** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
  raiseNotice(`tanto: ${what} in ${where} — claude attach ${who}`);
```

**P4.31 →**

```js
  // The way in by role for a seat the state file holds (spec 1.1); `claude
  // attach` only for a session no run of this design started.
  const seat = seatOf(seatsAbove(where), who);
  raiseNotice(`tanto: ${what} in ${where} — ${seat ? enterCommand(seat) : `claude attach ${who}`}`);
```

- [ ] **Step 4: Run the spawner's suite to verify it passes**

```bash
node --test skills/tanto/scripts/spawner.test.js
```

Expected: every test passes, the six new ones among them.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes; `boundary.test.js` and `tanto.test.js` still
set `state: "blocked"` for their own code, which Tasks 5 and 11 change.

- [ ] **Step 6: Verify the passages**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 4
```

Expected: `task 4: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints** on
  `skills/tanto/scripts/spawner.js` and `skills/tanto/scripts/spawner.test.js`.

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints** — subject
  `feat: the spawner's census keys blocked on a prompt, parks a dialogue seat that left, and names every way in by role`;
  paths `skills/tanto/scripts/spawner.js` and
  `skills/tanto/scripts/spawner.test.js`.

Expected: one commit.

### Task 5: `boundary.js census`: the state file, the `spawner:` line, six headings with their suffixes

Spec 1.3, 2.6, and 2.7, and section 6's `scripts/boundary.js` entry for the
census and for `writeSeatRow`'s comment. The files are
`skills/tanto/scripts/boundary.js` and its test. `cmdCensus` reads
`.tanto/spawner/seats.json` whole — absent or unparsable, every row places
as the roster and the listing say, as before — and prints the `spawner:`
line, then six headings: **Listed**, **Parked**, **Ended**, **Not listed**,
**No session id**, **Not held**. A `live` or `queued` row whose seat the
state file holds `stopped` or `removed` prints under Ended whatever the
listing shows, with ` by <endedBy>` when it carries one; a row whose seat it
holds `parked` and the listing does not show prints under Parked, with
` — mid-turn` and ` — waiting` when the seat carries them; a Listed line
carries ` — blocked (<waitingFor>)` for a background entry whose `status` is
`waiting`, and reads `state` no more; and Not held gains spec 1.3's
` — spawned as <role> <topic>, result <id>` for a seat the state file holds
`running`, `blocked`, or `parked` and no `live` or `queued` row does, listed
or not. A `gone` seat no row holds — an earlier run's, collected and never
stopped; this repository's state file holds thirteen — prints nothing. The
census still writes nothing.

After this task, `boundary.js census` tells Kanri, in one read, which seats
are parked, which have ended, which the launcher started, and which wait on
a prompt — and on what.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — a `require("./spawner.js")`
  beside the Node modules; `writeSeatRow`'s comment; `firstTurnMarks` and
  the four `CENSUS_HEADINGS` replaced by `stateSeats`, `spawnerLine`,
  `listing`, `spawnedAs`, and the six headings; `cmdCensus`'s comment, its
  listing, and its row loop.
- Test: `skills/tanto/scripts/boundary.test.js` — the `--seat` test's name;
  four census tests brought to the new output and to the new `blocked` key;
  one new test after "census reads seats.json beside the roster".

**Interfaces:**

- Consumes: `spawner.js`'s exports `spawnerDir`, `heartbeatPath`, and
  `HEARTBEAT_STALE_MS`, all on `main` already; the seat fields batch A
  writes — `status` with `parked`, `stopped`, `removed`, and `gone`
  (Tasks 1, 3, 4), `midTurn` and `waiting` (Tasks 3, 4), `endedBy:
  "taiseki"` (Task 1), `requestId` (Task 2), and `name`, `role`, `topic`;
  the listing's `status` and `waitingFor` (spec S-1). `requestId` is printed
  as stored: Task 2 records the spawn request's id, the basename of its
  result file under `.tanto/spawner/results/` without `.json`, so that the
  `result <id>` Kanri reads names the file `record --seat` takes.
- Produces: the census's output — `spawner: beating` or `spawner: stale`,
  then the six headings — with these lines, which `roles/kanri.md`'s census
  (Task 19) and `SKILL.md`'s roster section (Task 13) read:
  - Listed: `<role> <topic> <name> — <sessionId> — listed as <name> (<kind>)[ — renamed][ — blocked (<waitingFor>)][ — no first turn since <stamp>]`
  - Parked: `<role> <topic> <name> — <sessionId>[ — mid-turn][ — waiting]`
  - Ended: `<role> <topic> <name> — <sessionId> — <stopped or removed>[ by <endedBy>]`
  - Not listed: unchanged.
  - Not held: `<name> (<kind>, or not listed) — <sessionId>[ — row <status>][ — spawned as <role> <topic>, result <requestId>]`

  And the helpers `stateSeats(root)`, `spawnerLine(root)`, `listing(root)`,
  and the module binding `spawner`, which Task 6's subcommands use.

**Named-mechanism sites** (`git grep` at `a89dd16`).

- The census's headings: `SKILL.md` "Artifacts", the scripts paragraph's
  "under four headings — Listed, Not listed, No session id, and Not held"
  (Task 15); `SKILL.md` "Handshake and roster", its census paragraph and
  stale-entry note (Task 13), and the Not listed sentences of "Messages"
  and "Session exit" (Task 14); `roles/kanri.md` "Session lifecycle" — "The
  census" with its four headings and its bullets, and "Release" (Task 19) —
  and "The batch loop" and "A seat's exit", where they name Not listed and
  the stale entry (Tasks 17, 18); `templates/roster.md`'s Keeping rule
  (Task 7); and the README's "Layout" bullet for `scripts/boundary.js`,
  which says what `census` places (Task 23; a site section 6's README entry
  does not list).
- ` — blocked` becoming ` — blocked (<cause>)`, the roster's
  `(blocked since <HH:MM>)` keeping its form: `SKILL.md` "Handshake and
  roster" (Task 13); `roles/kanri.md` "Session lifecycle", the census
  bullets on `— blocked` and `blocked since` (Task 19); `templates/roster.md`'s
  Status paragraph (Task 7); the spawner's own `blocked` and its notice key
  on the same condition (Task 4).
- The `spawner:` line: Task 6's `seat`, `wake`, and `beat` print it; the
  rules that read it are `SKILL.md`'s "The address" (Task 13) and
  `roles/kanri.md`'s "The batch loop" step 6 and "Create" (Tasks 17, 19).
- ` — spawned as <role> <topic>, result <id>` and `requestId`: `spawner.js`'s
  `spawn` (Task 2), `templates/spawn-request.md` (Task 22),
  `templates/roster.md`'s Keeping rule (Task 7), `roles/kanri.md`'s census
  (Task 19).
- `writeSeatRow` still writes Status `live`, and `record --status` keeps
  `cleared` in its vocabulary (section 6); neither is touched.

**O5.1** `session.state === "blocked"` — the census's `blocked` keyed on the listing's retired `state` (spec 2.6); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O5.2** `the census names no cause` — the comment that said the listing gives no cause (spec 2.6, S-1); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O5.3** `The four headings` — `CENSUS_HEADINGS`'s comment (spec 2.7); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O5.4** `CENSUS_HEADINGS = ["Listed", "Not listed"` — the four headings without Parked and Ended (spec 2.7); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O5.5** `firstTurnMarks` — the reader of `seats.json` that kept only the `noFirstTurn` marks, replaced by `stateSeats` (spec 2.7); before: 2 in `skills/tanto/scripts/boundary.js` (its definition and its one call), after: 0.

**O5.6** `terminal seat` — `writeSeatRow`'s comment and the `--seat` test's name (spec 1.3; the first needle of the spec's Old values); before: 1 in `skills/tanto/scripts/boundary.js` and 1 in `skills/tanto/scripts/boundary.test.js`, after: 0 in both. Its four hits in `templates/roster.md` are O7.2's.

**O5.7** `handshake` — `writeSeatRow`'s comment, "rather than from a handshake it never sends" (spec 1.3); before: 1 in `skills/tanto/scripts/boundary.js`, 0 in `skills/tanto/scripts/boundary.test.js`, after: 0. Its hits in `templates/roster.md` and `templates/kanri.md` are O7.3's.

**O5.8** `pid: 1112, state: "blocked"` — the two census fixtures whose blocked seat was keyed on `state` (spec 2.6, "the task that changes `blocked`'s key brings every fixture that sets `state: "blocked"` with it"); before: 2 in `skills/tanto/scripts/boundary.test.js`, after: 0. The wider `state: "blocked"` reads 7 before and 6 after, all kept on purpose: the four pid-less entries of "a pid-less listing entry is not listed" and "census matches a row whose Transcript cell is the bare session id", whose `state` is the measured shape of a stale entry and is read by nothing; and, in P5.15, the Kanri entry that now carries `state: "blocked"` beside `status: "idle"` to prove the field is no longer read, with the comment that says so.

**O5.9** `under its four headings` — the first census test's name (spec 2.7); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**O5.10** `(background) — blocked — no first` — the expected Listed line with a bare ` — blocked` (spec 2.6); before: 2 in `skills/tanto/scripts/boundary.test.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P5.11 to P5.19. P5.11 renames the `--seat` test only; P5.12 to P5.14
bring the first two census tests to the `spawner:` line and the six
headings; P5.15, P5.16, P5.18, and P5.19 move the two `seats.json` tests to
`status: "waiting"` with its cause; P5.17 adds the new test after
"census reads seats.json beside the roster".

**P5.11** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
test("--seat writes a terminal seat's roster row, and a second call rewrites it", () => {
```

**P5.11 →**

```js
test("--seat writes a seat's roster row from its result file, and a second call rewrites it", () => {
```

**P5.12** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
test("census prints the live and queued rows under its four headings, by its own path comparison", () => {
```

**P5.12 →**

```js
test("census prints the spawner: line, then the live and queued rows under its six headings, by its own path comparison", () => {
```

**P5.13** `skills/tanto/scripts/boundary.test.js` — replace exactly these 9 lines

```js
    [
      "",
      "## Listed",
      "",
      "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background)",
      "sekkei t sekkei-b [bbbbbb] — sess-sekkei — listed as dotskills-4d (interactive) — renamed",
      "jisso t jisso-f — sess-queued — listed as jisso-f (background)",
      "",
      "## Not listed",
```

**P5.13 →**

```js
    [
      "spawner: stale",
      "",
      "## Listed",
      "",
      "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background)",
      "sekkei t sekkei-b [bbbbbb] — sess-sekkei — listed as dotskills-4d (interactive) — renamed",
      "jisso t jisso-f — sess-queued — listed as jisso-f (background)",
      "",
      "## Parked",
      "",
      "none",
      "",
      "## Ended",
      "",
      "none",
      "",
      "## Not listed",
```

**P5.14** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
  for (const heading of ["Not listed", "No session id", "Not held"]) {
```

**P5.14 →**

```js
  for (const heading of ["Parked", "Ended", "Not listed", "No session id", "Not held"]) {
```

**P5.15** `skills/tanto/scripts/boundary.test.js` — replace exactly these 2 lines

```js
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111, state: "blocked" },
      { sessionId: "sess-jisso", name: "jisso-h", kind: "background", cwd: root, pid: 1112, state: "blocked" },
```

**P5.15 →**

```js
      // A seat that answered and waits lists `state: "blocked"` beside
      // `status: "idle"`, and is not blocked (spec 2.6, S-1).
      {
        sessionId: "sess-kanri",
        name: "kanri-a",
        kind: "background",
        cwd: root,
        pid: 1111,
        state: "blocked",
        status: "idle",
      },
      {
        sessionId: "sess-jisso",
        name: "jisso-h",
        kind: "background",
        cwd: root,
        pid: 1112,
        status: "waiting",
        waitingFor: "permission prompt",
      },
```

**P5.16** `skills/tanto/scripts/boundary.test.js` — replace exactly these 2 lines

```js
        "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background) — blocked",
        "jisso t jisso-h — sess-jisso — listed as jisso-h (background) — blocked — no first turn since 2026-10-03 10:02",
```

**P5.16 →**

```js
        "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background)",
        "jisso t jisso-h — sess-jisso — listed as jisso-h (background) — blocked (permission prompt) — no first turn since 2026-10-03 10:02",
```

**P5.17** `skills/tanto/scripts/boundary.test.js` — replace exactly these 5 lines

```js
    result.out.includes("\n## Not listed\n\nshoki t shoki-i — sess-shoki — no first turn since 2026-10-03 10:05\n"),
    result.out,
  );
});

```

**P5.17 →**

```js
    result.out.includes("\n## Not listed\n\nshoki t shoki-i — sess-shoki — no first turn since 2026-10-03 10:05\n"),
    result.out,
  );
});

test("census prints Parked with its marks, Ended, a blocked background seat's cause, and a seat no row holds (spec 1.3, 2.6, 2.7)", () => {
  const f = censusFixture(
    [
      KANRI_ROW,
      sessionRow("sekkei", "t", "sekkei-b", "live", "/home/u/.claude/projects/p/sess-sekkei.jsonl"),
      sessionRow("keikaku", "t", "keikaku-c", "live", "/home/u/.claude/projects/p/sess-keikaku.jsonl"),
      sessionRow("hosa", "—", "hosa-d", "live", "/home/u/.claude/projects/p/sess-hosa.jsonl"),
      sessionRow("jisso", "t", "jisso-e", "live", "/home/u/.claude/projects/p/sess-done.jsonl"),
      sessionRow("jisso", "t", "jisso-f", "queued", "/home/u/.claude/projects/p/sess-gone.jsonl"),
      sessionRow("kaiseki", "t", "kaiseki-g", "live", "/home/u/.claude/projects/p/sess-tab.jsonl"),
      sessionRow("jisso", "u", "jisso-h", "live", "/home/u/.claude/projects/p/sess-prompt.jsonl"),
    ],
    (root) => [
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111, status: "busy" },
      // A prompt in a tab is never blocked; a background one is, with its cause.
      {
        sessionId: "sess-tab",
        name: "dotskills-7b",
        kind: "interactive",
        cwd: root,
        pid: 1112,
        status: "waiting",
        waitingFor: "permission prompt",
      },
      {
        sessionId: "sess-prompt",
        name: "jisso-h",
        kind: "background",
        cwd: root,
        pid: 1113,
        status: "waiting",
        waitingFor: "permission prompt",
      },
      {
        sessionId: "sess-hosa2",
        name: "dotskills-hosa-3c4d",
        kind: "background",
        cwd: root,
        pid: 1114,
        status: "idle",
      },
    ],
  );
  const spawnerDir = path.join(f.root, ".tanto", "spawner");
  fs.mkdirSync(spawnerDir, { recursive: true });
  fs.writeFileSync(path.join(spawnerDir, "heartbeat"), `${Date.now()}\n`);
  const seats = [
    { sessionId: "sess-kanri", role: "kanri", status: "running" },
    {
      sessionId: "sess-sekkei",
      role: "sekkei",
      topic: "t",
      status: "parked",
      contract: 2,
      midTurn: true,
      waiting: true,
    },
    { sessionId: "sess-keikaku", role: "keikaku", topic: "t", status: "parked", contract: 2 },
    { sessionId: "sess-hosa", role: "hosa", status: "stopped", endedBy: "taiseki" },
    { sessionId: "sess-done", role: "jisso", topic: "t", status: "removed" },
    { sessionId: "sess-gone", role: "jisso", topic: "t", status: "gone" },
    {
      sessionId: "sess-kikaku",
      name: "dotskills-kikaku-1a2b",
      role: "kikaku",
      topic: "—",
      status: "parked",
      contract: 2,
      requestId: "req-kikaku",
    },
    {
      sessionId: "sess-hosa2",
      name: "dotskills-hosa-3c4d",
      role: "hosa",
      topic: "—",
      status: "running",
      contract: 2,
      requestId: "req-hosa",
    },
    // An earlier run's seats no row holds: collected, or ended.
    { sessionId: "sess-old", name: "dotskills-kanri-9f9f", role: "kanri", status: "gone" },
    { sessionId: "sess-left", name: "dotskills-kikaku-7c7c", role: "kikaku", status: "stopped", endedBy: "taiseki" },
  ];
  fs.writeFileSync(path.join(spawnerDir, "seats.json"), JSON.stringify({ seats }));
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.strictEqual(
    result.out,
    [
      "spawner: beating",
      "",
      "## Listed",
      "",
      "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background)",
      "kaiseki t kaiseki-g — sess-tab — listed as dotskills-7b (interactive) — renamed",
      "jisso u jisso-h — sess-prompt — listed as jisso-h (background) — blocked (permission prompt)",
      "",
      "## Parked",
      "",
      "sekkei t sekkei-b — sess-sekkei — mid-turn — waiting",
      "keikaku t keikaku-c — sess-keikaku",
      "",
      "## Ended",
      "",
      "hosa — hosa-d — sess-hosa — stopped by taiseki",
      "jisso t jisso-e — sess-done — removed",
      "",
      "## Not listed",
      "",
      "jisso t jisso-f — sess-gone",
      "",
      "## No session id",
      "",
      "none",
      "",
      "## Not held",
      "",
      "dotskills-hosa-3c4d (background) — sess-hosa2 — spawned as hosa —, result req-hosa",
      "dotskills-kikaku-1a2b (not listed) — sess-kikaku — spawned as kikaku —, result req-kikaku",
      "",
    ].join("\n"),
  );
});

```

**P5.18** `skills/tanto/scripts/boundary.test.js` — replace exactly these 3 lines

```js
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111 },
      { sessionId: "sess-jisso", name: "jisso-h", kind: "background", cwd: root, pid: 1112, state: "blocked" },
      { sessionId: "sess-shoki", name: "shoki-i", kind: "background", cwd: root, state: "blocked" },
```

**P5.18 →**

```js
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111 },
      {
        sessionId: "sess-jisso",
        name: "jisso-h",
        kind: "background",
        cwd: root,
        pid: 1112,
        status: "waiting",
        waitingFor: "permission prompt",
      },
      { sessionId: "sess-shoki", name: "shoki-i", kind: "background", cwd: root, state: "blocked" },
```

**P5.19** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
      "jisso t jisso-h — sess-jisso — listed as jisso-h (background) — blocked — no first turn since 2026-10-04 10:02\n",
```

**P5.19 →**

```js
      "jisso t jisso-h — sess-jisso — listed as jisso-h (background) — blocked (permission prompt) — no first turn since 2026-10-04 10:02\n",
```

- [ ] **Step 2: Run the census tests to verify they fail**

```bash
node --test --test-name-pattern "census" skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — five tests: "census prints the spawner: line, then the
live and queued rows under its six headings" (no `spawner:` line, no Parked
or Ended), "census prints none under a heading with no entry" (no Parked
heading), "census reads seats.json beside the roster" and "census matches a
row whose Transcript cell is the bare session id" (a bare ` — blocked`, and
on Kanri's idle line too), and the new test. The other census tests pass.

- [ ] **Step 3: Read the state file and print the six headings**

Apply P5.20 to P5.24.

**P5.20** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
const { spawnSync } = require("node:child_process");
```

**P5.20 →**

```js
const { spawnSync } = require("node:child_process");
// The spawner's own paths, its heartbeat's budget, and its transcript test,
// so that this file reads the state file exactly as the spawner writes it.
const spawner = require("./spawner.js");
```

**P5.21** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
 * A terminal seat's roster row, written from the spawner's result file
 * rather than from a handshake it never sends. Idempotent: a second call
```

**P5.21 →**

```js
 * A seat's roster row, written from the spawner's result file for every
 * seat, whoever asked for it: Kanri records a seat the launcher started once
 * the census prints it under Not held (spec 1.3). Idempotent: a second call
```

**P5.22** `skills/tanto/scripts/boundary.js` — replace exactly these 23 lines

```js
/**
 * The `noFirstTurn` marks of `<root>/.tanto/spawner/seats.json`, by
 * `sessionId` (spec 3.3): empty when the file is absent or does not parse,
 * so the census prints as it did before.
 */
function firstTurnMarks(root) {
  try {
    const doc = JSON.parse(fs.readFileSync(path.join(root, ".tanto", "spawner", "seats.json"), "utf8"));
    const seats = Array.isArray(doc?.seats) ? doc.seats : [];
    return new Map(seats.filter((s) => s?.sessionId && s.noFirstTurn).map((s) => [s.sessionId, s.noFirstTurn]));
  } catch {
    return new Map();
  }
}

/** The four headings `census` prints, in order. */
const CENSUS_HEADINGS = ["Listed", "Not listed", "No session id", "Not held"];

/**
 * `census [--root <dir>] [--roster <path>]` (spec 2.2): the roster's `live`
 * and `queued` rows against `claude agents --json`'s sessions under the root.
 * Read-only — Kanri, the roster's one writer, acts on what it prints.
 */
```

**P5.22 →**

```js
/**
 * The seats of `<root>/.tanto/spawner/seats.json`, the state file, by
 * `sessionId` (spec 2.7): empty when the file is absent or does not parse,
 * so that a root with no spawner is read as the roster and the listing
 * place its rows.
 */
function stateSeats(root) {
  try {
    const doc = JSON.parse(fs.readFileSync(path.join(spawner.spawnerDir(root), "seats.json"), "utf8"));
    const seats = Array.isArray(doc?.seats) ? doc.seats : [];
    return new Map(seats.filter((s) => s?.sessionId).map((s) => [s.sessionId, s]));
  } catch {
    return new Map();
  }
}

/**
 * The `spawner:` line (spec 2.5, 2.7): `beating` while the heartbeat is
 * within the spawner's own budget of now, `stale` when it is older, absent,
 * or does not parse. A stale spawner takes no request and raises no notice,
 * and the state file has stopped moving (R-2).
 */
function spawnerLine(root) {
  let beat = Number.NaN;
  try {
    beat = Number(fs.readFileSync(spawner.heartbeatPath(root), "utf8").trim());
  } catch {
    // No heartbeat: no spawner ever ran under this root, or `teishi` removed it.
  }
  return Math.abs(Date.now() - beat) <= spawner.HEARTBEAT_STALE_MS ? "spawner: beating" : "spawner: stale";
}

/**
 * `claude agents --json`'s sessions under the root that carry a `pid`, by
 * `sessionId`, and the ids of the entries without one; or `error`, the
 * reason, when the listing failed or printed no JSON. The paths are compared
 * here rather than passed as `--cwd`: the CLI's filter is measured for the
 * root alone (spec 2.2).
 */
function listing(root) {
  const command = claudeCommand(["agents", "--json"]);
  const got = spawnSync(command.file, command.args, { encoding: "utf8", windowsHide: true });
  if (got.status !== 0) {
    const said = (got.stderr || "").trim().split(/\r?\n/)[0];
    return { error: said || `claude agents exited ${got.status}` };
  }
  let parsed;
  try {
    parsed = JSON.parse(got.stdout || "");
  } catch {
    return { error: "claude agents --json printed no JSON" };
  }
  const all = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.sessions) ? parsed.sessions : [];
  const listed = new Map(
    all.filter((s) => s?.sessionId && s.pid && underRoot(root, s.cwd)).map((s) => [s.sessionId, s]),
  );
  // An entry with no pid is a process gone, whatever else it carries (spec
  // 3.1): its row prints under Not listed with the signal named, by its
  // sessionId alone, since the row is already this repository's.
  const stale = new Set(all.filter((s) => s?.sessionId && !s.pid).map((s) => s.sessionId));
  return { listed, stale, error: null };
}

/**
 * Spec 1.3's suffix on a Not held line, for a seat the state file holds and
 * no `live` or `queued` row does: the result Kanri records it from. None for
 * a seat that has ended.
 */
function spawnedAs(seat) {
  if (!seat || seat.status === "stopped" || seat.status === "removed") return "";
  return ` — spawned as ${seat.role || "—"} ${seat.topic || "—"}, result ${seat.requestId || "unknown"}`;
}

/** The six headings `census` prints after its `spawner:` line, in order (spec 2.7). */
const CENSUS_HEADINGS = ["Listed", "Parked", "Ended", "Not listed", "No session id", "Not held"];

/**
 * `census [--root <dir>] [--roster <path>]` (spec 2.2, 2.7): the `spawner:`
 * line, then the roster's `live` and `queued` rows against the state file and
 * `claude agents --json`'s sessions under the root, under six headings.
 * Read-only — Kanri, the roster's one writer, acts on what it prints.
 */
```

**P5.23** `skills/tanto/scripts/boundary.js` — replace exactly these 28 lines

```js
  const command = claudeCommand(["agents", "--json"]);
  const got = spawnSync(command.file, command.args, { encoding: "utf8", windowsHide: true });
  if (got.status !== 0) {
    const said = (got.stderr || "").trim().split(/\r?\n/)[0];
    console.log(`census: unavailable — ${said || `claude agents exited ${got.status}`}`);
    return 1;
  }
  let parsed;
  try {
    parsed = JSON.parse(got.stdout || "");
  } catch {
    console.log("census: unavailable — claude agents --json printed no JSON");
    return 1;
  }
  const all = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.sessions) ? parsed.sessions : [];
  const listed = new Map(
    all.filter((s) => s?.sessionId && s.pid && underRoot(root, s.cwd)).map((s) => [s.sessionId, s]),
  );
  // An entry with no pid is a process gone, whatever its state says (spec
  // 3.1): its row prints under Not listed with the signal named, by its
  // sessionId alone, since the row is already this repository's.
  const stale = new Set(all.filter((s) => s?.sessionId && !s.pid).map((s) => s.sessionId));
  // The spawner's mark on a seat with no first turn, on the seat's Listed or
  // Not listed line, so that Kanri, who sees no toast, reads it (spec 3.3).
  const marks = firstTurnMarks(root);
  const firstTurn = (sessionId) => (marks.has(sessionId) ? ` — no first turn since ${marks.get(sessionId)}` : "");

  const out = { Listed: [], "Not listed": [], "No session id": [], "Not held": [] };
```

**P5.23 →**

```js
  const found = listing(root);
  if (found.error) {
    console.log(`census: unavailable — ${found.error}`);
    return 1;
  }
  const { listed, stale } = found;
  const seats = stateSeats(root);
  // The spawner's mark on a seat with no first turn, on the seat's Listed or
  // Not listed line, so that Kanri, who sees no toast, reads it (spec 3.3).
  const firstTurn = (sessionId) => {
    const mark = seats.get(sessionId)?.noFirstTurn;
    return mark ? ` — no first turn since ${mark}` : "";
  };

  const out = Object.fromEntries(CENSUS_HEADINGS.map((heading) => [heading, []]));
```

**P5.24** `skills/tanto/scripts/boundary.js` — replace exactly these 21 lines

```js
    held.add(sessionId);
    const session = listed.get(sessionId);
    if (!session) {
      const note = stale.has(sessionId) ? " — listed without a pid (a stale entry)" : "";
      out["Not listed"].push(`${role} ${topic} ${name} — ${sessionId}${note}${firstTurn(sessionId)}`);
      continue;
    }
    const bare = name.replace(/\s*\[[^\]]*\]$/, "");
    const renamed = session.name && session.name !== bare ? " — renamed" : "";
    // The listing's `state`, for the roster's `live (blocked since <HH:MM>)`
    // (spec 5.2): the census names no cause, since the listing gives none.
    const blocked = session.state === "blocked" ? " — blocked" : "";
    const listedAs = `listed as ${session.name} (${session.kind})`;
    out.Listed.push(`${role} ${topic} ${name} — ${sessionId} — ${listedAs}${renamed}${blocked}${firstTurn(sessionId)}`);
  }
  for (const [sessionId, session] of listed) {
    if (held.has(sessionId)) continue;
    const other = others.has(sessionId) ? ` — row ${others.get(sessionId)}` : "";
    out["Not held"].push(`${session.name} (${session.kind}) — ${sessionId}${other}`);
  }
  for (const heading of CENSUS_HEADINGS) {
```

**P5.24 →**

```js
    held.add(sessionId);
    const seat = seats.get(sessionId);
    const where = `${role} ${topic} ${name} — ${sessionId}`;
    // Ended by the state file, whatever the listing shows: a seat a tab still
    // holds is recorded `stopped` with no command run (spec 5.1). Kanri writes
    // the row `stopped`, with an Events line naming what ended it.
    if (seat?.status === "stopped" || seat?.status === "removed") {
      out.Ended.push(`${where} — ${seat.status}${seat.endedBy ? ` by ${seat.endedBy}` : ""}`);
      continue;
    }
    const session = listed.get(sessionId);
    if (!session && seat?.status === "parked") {
      // The run's seat, its conversation on disk: nothing to mark. A cut turn
      // is Recovery's to continue, never a boundary's (spec 2.7).
      out.Parked.push(`${where}${seat.midTurn ? " — mid-turn" : ""}${seat.waiting ? " — waiting" : ""}`);
      continue;
    }
    if (!session) {
      const note = stale.has(sessionId) ? " — listed without a pid (a stale entry)" : "";
      out["Not listed"].push(`${where}${note}${firstTurn(sessionId)}`);
      continue;
    }
    const bare = name.replace(/\s*\[[^\]]*\]$/, "");
    const renamed = session.name && session.name !== bare ? " — renamed" : "";
    // Blocked on a background entry's `status: "waiting"`, with the listing's
    // cause (spec 2.6): a seat that answered and waits lists `idle`, and a
    // prompt in a tab is in front of the human already. The roster's
    // `(blocked since <HH:MM>)` keeps its form.
    const waiting = session.kind === "background" && session.status === "waiting";
    const blocked = waiting ? ` — blocked (${session.waitingFor || "no cause listed"})` : "";
    const listedAs = `listed as ${session.name} (${session.kind})`;
    out.Listed.push(`${where} — ${listedAs}${renamed}${blocked}${firstTurn(sessionId)}`);
  }
  for (const [sessionId, session] of listed) {
    if (held.has(sessionId)) continue;
    const other = others.has(sessionId) ? ` — row ${others.get(sessionId)}` : "";
    out["Not held"].push(`${session.name} (${session.kind}) — ${sessionId}${other}${spawnedAs(seats.get(sessionId))}`);
  }
  // A seat the launcher started is in the state file before any row holds
  // it, and a parked one is in no listing (spec 1.3): it prints here either
  // way, for Kanri to record from its result. A `gone` seat no row holds is
  // an earlier run's, collected and never stopped, and prints nothing.
  for (const [sessionId, seat] of seats) {
    if (held.has(sessionId) || listed.has(sessionId)) continue;
    if (!["running", "blocked", "parked"].includes(seat.status)) continue;
    const other = others.has(sessionId) ? ` — row ${others.get(sessionId)}` : "";
    out["Not held"].push(`${seat.name || "—"} (not listed) — ${sessionId}${other}${spawnedAs(seat)}`);
  }
  console.log(spawnerLine(root));
  for (const heading of CENSUS_HEADINGS) {
```

- [ ] **Step 4: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes, the census tests with no `seats.json` and no
heartbeat printing `spawner: stale` and `none` under Parked and Ended.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 5
```

Expected: `task 5: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints**

```bash
git commit --only -m "feat: boundary.js census reads the state file and prints the spawner: line, Parked, Ended, a blocked seat's cause, and a seat no row holds" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 6: `boundary.js` `request`, `seat`, `wake`, `beat`

Spec 1.5, 2.2, 2.5, and 5.2, and section 6's four new subcommands of
`scripts/boundary.js`. The files are `skills/tanto/scripts/boundary.js` and
its test. `request park` and `request leave` are a seat's own request about
itself, written as its turn's last tool call: the `sessionId` from the
transcript's basename, `after` from the `uuid` of its last record that
carries one. `seat` prints one seat's `<status> <name> <kind> <role>
<turn>`, or `no entry <kind>` for a session the state file does not hold,
and the `spawner:` line under it. `wake` checks the beat, writes a `resume`
with no prompt for every seat it names — after a `hold` with `forMs` when
`--hold` is given — waits once for all the results, and prints each seat's
line or its error. `beat` prints the `spawner:` line alone. Every new
subcommand takes `--root <dir>`, the cwd by default, as `census` does.

After this task, a dialogue seat can ask to be parked or to leave, and
Kanri can read a seat's address at the moment of sending, wake the seats a
line is due to in one call, and refuse to write a request a stale spawner
would never take.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — the header comment; before
  `main`, `parseLine`, `rootOf`, `sleepSync`, `writeRequests`, `lastUuid`,
  `cmdRequest`, `findSeat`, `seatLine`, `cmdSeat`, `HOLD_FOR_MS`,
  `wakeWaitMs`, `waitForResults`, `cmdWake`, and `cmdBeat`; `main`'s four
  new branches and its usage line.
- Test: `skills/tanto/scripts/boundary.test.js` — `spawn` beside `spawnSync`;
  the unknown-subcommand test; seven new tests at the end of the file, with
  the helpers `spawnerFixture`, `fakeEnv`, `sub`, `requestsOf`,
  `transcriptOf`, and `wakeBeside`.

**Interfaces:**

- Consumes: Task 5's `stateSeats`, `spawnerLine`, `listing`, and the
  `spawner` binding; Task 1's `turnEnded(transcript, after)`, exported from
  `spawner.js`, which returns `null`, or `{ ended, newTurn, midTurn }`, and which
  `seatLine` calls with no `after` and reads the `ended` of: true exactly
  when the transcript's last turn has ended by spec 2.8 — `seat`'s
  fifth word is then `ended`, and `open` otherwise; Task 3's `park` op with
  `after`, `waiting`, and `notice`, and its `hold` op with `forMs` and no
  `pid`; Task 1's `stop` with `self: true` and `after`; Task 2's `resume`
  with no `prompt`, whose `error: "listed"` carries `name` and `kind`; and
  the spawner's result at `results/<id>.json` for the request
  `requests/<id>.json`, taken in name order.
- Produces the four forms Tasks 12 to 21 write into the contract:
  - `request <park|leave> --transcript <path> [--waiting [--notice]]` —
    one request file, `{ op: "park", sessionId, waiting, notice, after }`
    or `{ op: "stop", sessionId, self: true, after }`, `after` absent when
    no record carries a `uuid`; prints `<park|leave> requested: <id>`; exits
    2, writing nothing, on `--notice` without `--waiting`, a flag on
    `leave`, a transcript it cannot read, or no requests directory.
  - `seat <sessionId or name>` — `<status> <name> <kind> <role> <turn>`, or
    `no entry <kind>`, then the `spawner:` line; exits 0. The name and the
    kind are the listing's now, else the state file's name and `-`; the
    turn is `ended`, `open`, or `-` with no transcript on disk.
  - `wake [--hold] <sessionId>...` — the `spawner:` line, then per seat
    `seat`'s line, with ` — hold: <error>` when its hold failed, or
    `error: <error> — <sessionId>[ <name>]`; on `spawner: stale` it writes
    nothing; exits 1 on a stale spawner or any error. It waits sixty
    seconds in all; `TANTO_WAKE_WAIT_MS` is the tests' seam.
  - `beat` — the `spawner:` line; exits 1 when stale.

**Named-mechanism sites** (`git grep` at `a89dd16`). No site names
`request park`, `request leave`, `seat`, `wake`, or `beat` yet; the plan's
own sites are: the park request with `--waiting` and `--notice` — the park
rule of `roles/sekkei.md`, `roles/keikaku.md`, and `roles/kikaku.md`
(Task 20) and of `roles/hosa.md` and `roles/kaiseki.md` (Task 21); `request
leave` — `SKILL.md`'s "Session exit" (Task 14) and the `taiseki` of
`roles/kikaku.md`, `roles/hosa.md`, and `roles/kaiseki.md` (Tasks 20, 21);
`seat` — `SKILL.md`'s "Start sequence", its first act (Task 12), and "The
address" (Task 13), and `roles/kanri.md`'s "The Kaiseki branch" (Task 17)
and "Session lifecycle" — "Replace" and "Recovery"'s check of a `fukki:`
sender (Task 19); `wake` and `--hold` — `SKILL.md`'s "The address"
(Task 13), and `roles/kanri.md`'s "Create" row for a wake the human asks
for, "Recovery", and the idle block (Task 19); `beat` — `roles/kanri.md`'s
"Create" and "The batch loop" step 6 (Tasks 19, 17); `forMs: 3300000` —
`spawner.js`'s `hold` (Task 3) and `templates/spawn-request.md` (Task 22).
Existing sites that count the subcommands: `SKILL.md` "Artifacts", "its
three subcommands are `check`, … `record`, … and `census`" (Task 15), and
the README's "Layout" bullet for `scripts/boundary.js`, which names
`check`, `record`, and `census` (Task 23; a site section 6's README entry
does not list). The request file's write — a temp file, then a rename — is
`tanto.js`'s `writeRequest` too, unchanged.

**O6.1** `Three subcommands` — the header comment's count (spec section 6); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O6.2** `check|record|census <options>` — the usage line without the four new subcommands; before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O6.3** `names the three that exist` — the unknown-subcommand test's name; before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P6.4 to P6.6. P6.6 keeps the last two lines of "census matches a row
whose Transcript cell is the bare session id" and appends the helpers and
the seven tests after them.

**P6.4** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
const { spawnSync } = require("node:child_process");
```

**P6.4 →**

```js
const { spawn, spawnSync } = require("node:child_process");
```

**P6.5** `skills/tanto/scripts/boundary.test.js` — replace exactly these 5 lines

```js
test("an unknown subcommand exits 2 and names the three that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record\|census/);
```

**P6.5 →**

```js
test("an unknown subcommand exits 2 and names the seven that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record\|census\|request\|seat\|wake\|beat/);
```

**P6.6** `skills/tanto/scripts/boundary.test.js` — replace exactly these 2 lines

```js
  assert.ok(result.out.includes("\n## No session id\n\nnone\n"), result.out);
});
```

**P6.6 →**

```js
  assert.ok(result.out.includes("\n## No session id\n\nnone\n"), result.out);
});

// `request`, `seat`, `wake`, and `beat`: a root with the spawner's directory,
// its state file, and its heartbeat — fresh, or ten minutes old — and the
// census's fake `claude` for the listing.
function spawnerFixture(seatsOf, sessionsOf, beating = true) {
  const f = censusFixture([KANRI_ROW], sessionsOf);
  const dir = path.join(f.root, ".tanto", "spawner");
  fs.mkdirSync(path.join(dir, "requests"), { recursive: true });
  fs.mkdirSync(path.join(dir, "results"), { recursive: true });
  fs.writeFileSync(path.join(dir, "seats.json"), JSON.stringify({ seats: seatsOf(f) }));
  fs.writeFileSync(path.join(dir, "heartbeat"), `${Date.now() - (beating ? 0 : 600000)}\n`);
  return { ...f, spawner: dir };
}

function fakeEnv(f) {
  return { ...process.env, TANTO_CLAUDE_NODE: f.fake, FAKE_LISTING: f.listing, FAKE_ARGS: f.args, FAKE_MODE: "" };
}

function sub(f, args, env = {}) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: "utf8",
    cwd: f.root,
    env: { ...fakeEnv(f), ...env },
  });
  return { code: result.status, out: (result.stdout || "").replace(/\r\n/g, "\n"), err: result.stderr || "" };
}

/** The request files `wake` or `request` wrote, in the order the spawner takes them. */
function requestsOf(f) {
  const dir = path.join(f.spawner, "requests");
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8")));
}

/**
 * A transcript of one turn: ended — an `end_turn` message its Stop hook's
 * record settles — or open on a tool call; with `tail`, records after it.
 */
function transcriptOf(dir, sessionId, ended, tail = []) {
  const reply = ended
    ? { id: "msg-1", model: "claude-test", stop_reason: "end_turn", content: [{ type: "text", text: "done" }] }
    : { id: "msg-1", model: "claude-test", stop_reason: "tool_use", content: [{ type: "tool_use", id: "t-1" }] };
  const records = [
    { type: "user", uuid: "u-1", message: { role: "user", content: "go" } },
    { type: "assistant", uuid: "a-1", message: reply },
    ...(ended ? [{ type: "system", subtype: "stop_hook_summary", uuid: "s-1" }] : []),
    ...tail,
  ];
  return write(dir, `${sessionId}.jsonl`, `${records.map((r) => JSON.stringify(r)).join("\n")}\n`);
}

test("request park and request leave write the seat's own request, after its transcript's last uuid (spec 2.2, 5.2)", () => {
  const f = spawnerFixture(
    () => [],
    () => [],
  );
  // The last record carries no uuid; the one before it does.
  const t = transcriptOf(f.dir, "sess-park", true, [{ type: "file-history-snapshot", messageId: "m-1" }]);
  assert.strictEqual(sub(f, ["request", "park", "--transcript", t, "--waiting", "--notice"]).code, 0);
  assert.deepStrictEqual(requestsOf(f), [
    { op: "park", sessionId: "sess-park", waiting: true, notice: true, after: "s-1" },
  ]);
  for (const name of fs.readdirSync(path.join(f.spawner, "requests"))) {
    fs.rmSync(path.join(f.spawner, "requests", name));
  }
  const parked = sub(f, ["request", "park", "--transcript", t]);
  assert.strictEqual(parked.code, 0, parked.err);
  assert.match(parked.out, /^park requested: \S+\n$/);
  const leave = sub(f, ["request", "leave", "--transcript", t]);
  assert.strictEqual(leave.code, 0, leave.err);
  assert.deepStrictEqual(requestsOf(f), [
    { op: "park", sessionId: "sess-park", waiting: false, notice: false, after: "s-1" },
    { op: "stop", sessionId: "sess-park", self: true, after: "s-1" },
  ]);
});

test("request refuses --notice without --waiting, a flag on leave, and a root with no spawner, writing nothing", () => {
  const f = spawnerFixture(
    () => [],
    () => [],
  );
  const t = transcriptOf(f.dir, "sess-park", true);
  const refusals = [
    [["park", "--transcript", t, "--notice"], /--notice goes with --waiting/],
    [["leave", "--transcript", t, "--waiting"], /takes no --waiting and no --notice/],
    [["sleep", "--transcript", t], /needs park or leave/],
    [["park", "--transcript", t, "--root", f.dir], /no spawner requests directory/],
  ];
  for (const [args, said] of refusals) {
    const got = sub(f, ["request", ...args]);
    assert.strictEqual(got.code, 2, got.err);
    assert.match(got.err, said);
  }
  assert.deepStrictEqual(requestsOf(f), []);
});

test("seat prints its five words and the spawner: line, by sessionId or by name, and no entry with the listing's kind (spec 1.5, 2.5)", () => {
  const f = spawnerFixture(
    (fx) => [
      {
        sessionId: "sess-a",
        name: "dotskills-sekkei-t-1a2b",
        role: "sekkei",
        status: "parked",
        transcript: transcriptOf(fx.dir, "sess-a", true),
      },
      {
        sessionId: "sess-b",
        name: "dotskills-keikaku-t-3c4d",
        role: "keikaku",
        status: "running",
        transcript: transcriptOf(fx.dir, "sess-b", false),
      },
      // Stopped while a tab holds it: still listed, under the editor's name.
      { sessionId: "sess-c", name: "dotskills-kikaku-5e6f", role: "kikaku", status: "stopped" },
      { sessionId: "sess-d", name: "dotskills-denrei-7a8b", role: "denrei", status: "removed" },
    ],
    (root) => [
      { sessionId: "sess-b", name: "dotskills-keikaku-t-3c4d", kind: "background", cwd: root, pid: 1112 },
      { sessionId: "sess-c", name: "dotskills-7b", kind: "interactive", cwd: root, pid: 1113 },
      { sessionId: "sess-bg", name: "dotskills-kanri-9e9e", kind: "background", cwd: root, pid: 1114 },
      { sessionId: "sess-tab", name: "dotskills-3f", kind: "interactive", cwd: root, pid: 1115 },
    ],
  );
  const lines = (who) => sub(f, ["seat", who, "--root", f.root]).out;
  assert.strictEqual(lines("sess-a"), "parked dotskills-sekkei-t-1a2b - sekkei ended\nspawner: beating\n");
  assert.strictEqual(lines("sess-b"), "running dotskills-keikaku-t-3c4d background keikaku open\nspawner: beating\n");
  assert.strictEqual(lines("sess-c"), "stopped dotskills-7b interactive kikaku -\nspawner: beating\n");
  assert.strictEqual(lines("dotskills-denrei-7a8b"), "removed dotskills-denrei-7a8b - denrei -\nspawner: beating\n");
  assert.strictEqual(lines("sess-bg"), "no entry background\nspawner: beating\n");
  assert.strictEqual(lines("sess-tab"), "no entry interactive\nspawner: beating\n");
  assert.strictEqual(lines("sess-none"), "no entry -\nspawner: beating\n");
});

test("seat exits 1 with `seat: the listing failed` and no entry line when the listing fails, for a held seat or not", () => {
  const f = spawnerFixture(
    () => [{ sessionId: "sess-a", name: "dotskills-sekkei-t-1a2b", role: "sekkei", status: "parked" }],
    () => [],
  );
  for (const mode of ["fail", "garbage"]) {
    for (const who of ["sess-a", "sess-none"]) {
      const got = sub(f, ["seat", who, "--root", f.root], { FAKE_MODE: mode });
      assert.strictEqual(got.code, 1, `${mode} ${who}: ${got.err}`);
      assert.strictEqual(got.out, "", `${mode} ${who}`);
    }
  }
  const failed = sub(f, ["seat", "sess-none", "--root", f.root], { FAKE_MODE: "fail" });
  assert.strictEqual(failed.err, "boundary.js: seat: the listing failed — listing broke\n");
  const garbage = sub(f, ["seat", "sess-none", "--root", f.root], { FAKE_MODE: "garbage" });
  assert.strictEqual(garbage.err, "boundary.js: seat: the listing failed — claude agents --json printed no JSON\n");
  // A listing that works still answers, so the exit 1 above is the listing's alone.
  assert.deepStrictEqual(sub(f, ["seat", "sess-none", "--root", f.root]), {
    code: 0,
    out: "no entry -\nspawner: beating\n",
    err: "",
  });
});

test("beat prints the spawner: line and exits 1 when the heartbeat is stale or absent (spec 2.5)", () => {
  const live = spawnerFixture(
    () => [],
    () => [],
  );
  assert.deepStrictEqual(sub(live, ["beat", "--root", live.root]), {
    code: 0,
    out: "spawner: beating\n",
    err: "",
  });
  const stale = spawnerFixture(
    () => [],
    () => [],
    false,
  );
  assert.strictEqual(sub(stale, ["beat", "--root", stale.root]).out, "spawner: stale\n");
  assert.strictEqual(sub(stale, ["beat", "--root", stale.root]).code, 1);
  fs.rmSync(path.join(stale.spawner, "heartbeat"));
  assert.strictEqual(sub(stale, ["beat", "--root", stale.root]).out, "spawner: stale\n");
});

/**
 * `wake`, run beside a fake spawner that answers each request it finds with
 * `answer(request)` merged into it, as the spawner writes a result.
 */
async function wakeBeside(f, args, answer, env = {}) {
  const child = spawn(process.execPath, [SCRIPT, "wake", "--root", f.root, ...args], {
    cwd: f.root,
    env: { ...fakeEnv(f), TANTO_WAKE_WAIT_MS: "10000", ...env },
  });
  let out = "";
  child.stdout.on("data", (chunk) => {
    out += chunk;
  });
  let code = null;
  child.on("close", (status) => {
    code = status;
  });
  const seen = [];
  while (code === null) {
    const dir = path.join(f.spawner, "requests");
    const names = fs.readdirSync(dir).filter((n) => n.endsWith(".json"));
    for (const name of names.sort()) {
      const request = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
      fs.rmSync(path.join(dir, name));
      seen.push(request);
      const result = path.join(f.spawner, "results", name);
      fs.writeFileSync(`${result}.tmp`, JSON.stringify({ ...request, ...answer(request) }));
      fs.renameSync(`${result}.tmp`, result);
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return { code, out: out.replace(/\r\n/g, "\n"), seen };
}

test("wake resumes several seats with no prompt in one call, and prints each seat's line or its error (spec 2.5)", async () => {
  const f = spawnerFixture(
    (fx) => [
      {
        sessionId: "sess-a",
        name: "dotskills-sekkei-t-1a2b",
        role: "sekkei",
        status: "parked",
        transcript: transcriptOf(fx.dir, "sess-a", true),
      },
      { sessionId: "sess-b", name: "dotskills-keikaku-t-3c4d", role: "keikaku", status: "parked" },
    ],
    (root) => [{ sessionId: "sess-a", name: "dotskills-sekkei-t-1a2b", kind: "background", cwd: root, pid: 1112 }],
  );
  const seatsFile = path.join(f.spawner, "seats.json");
  const woken = await wakeBeside(f, ["sess-a", "sess-b"], (request) => {
    if (request.sessionId === "sess-b") return { error: "listed", name: "dotskills-4d", kind: "interactive" };
    const doc = JSON.parse(fs.readFileSync(seatsFile, "utf8"));
    doc.seats[0].status = "running";
    fs.writeFileSync(seatsFile, JSON.stringify(doc));
    return { id: "1a2b", name: "dotskills-sekkei-t-1a2b" };
  });
  assert.deepStrictEqual(woken.seen, [
    { op: "resume", sessionId: "sess-a" },
    { op: "resume", sessionId: "sess-b" },
  ]);
  assert.strictEqual(
    woken.out,
    [
      "spawner: beating",
      "running dotskills-sekkei-t-1a2b background sekkei ended",
      "error: listed — sess-b dotskills-4d",
      "",
    ].join("\n"),
  );
  assert.strictEqual(woken.code, 1);
});

test("wake --hold writes each seat's hold, with forMs and no pid, before its resume (spec 2.4)", async () => {
  const f = spawnerFixture(
    () => [{ sessionId: "sess-a", name: "dotskills-hosa-1a2b", role: "hosa", status: "parked" }],
    () => [],
  );
  const woken = await wakeBeside(f, ["--hold", "sess-a"], () => ({}));
  assert.deepStrictEqual(woken.seen, [
    { op: "hold", sessionId: "sess-a", forMs: 3300000 },
    { op: "resume", sessionId: "sess-a" },
  ]);
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa -\n");
  assert.strictEqual(woken.code, 0);
});

test("wake --hold exits 1 and says `hold:` on the seat's line when only its hold failed (spec 2.4, 2.5)", async () => {
  const f = spawnerFixture(
    () => [{ sessionId: "sess-a", name: "dotskills-hosa-1a2b", role: "hosa", status: "parked" }],
    () => [],
  );
  const woken = await wakeBeside(f, ["--hold", "sess-a"], (request) =>
    request.op === "hold" ? { error: "no such seat" } : {},
  );
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa - — hold: no such seat\n");
  assert.strictEqual(woken.code, 1);
});

test("wake prints `listing:` and exits 1 when the listing fails, after each seat's line", async () => {
  const f = spawnerFixture(
    () => [{ sessionId: "sess-a", name: "dotskills-hosa-1a2b", role: "hosa", status: "parked" }],
    () => [],
  );
  const woken = await wakeBeside(f, ["sess-a"], () => ({}), { FAKE_MODE: "fail" });
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa -\nlisting: listing broke\n");
  assert.strictEqual(woken.code, 1);
});

test("wake writes nothing on a stale spawner, and names a seat whose result never came", () => {
  const stale = spawnerFixture(
    () => [],
    () => [],
    false,
  );
  assert.deepStrictEqual(sub(stale, ["wake", "sess-a", "--root", stale.root]), {
    code: 1,
    out: "spawner: stale\n",
    err: "",
  });
  assert.deepStrictEqual(requestsOf(stale), []);
  const quiet = spawnerFixture(
    () => [],
    () => [],
  );
  const got = sub(quiet, ["wake", "sess-a", "--root", quiet.root], { TANTO_WAKE_WAIT_MS: "300" });
  assert.strictEqual(got.out, "spawner: beating\nerror: no result — sess-a\n");
  assert.strictEqual(got.code, 1);
});
```

- [ ] **Step 2: Run the new tests to verify they fail**

```bash
node --test --test-name-pattern "request |seat prints|beat prints|wake|names the seven" skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — the eight selected tests, each on the usage error the
unknown subcommand prints (exit 2), and the unknown-subcommand test on its
pattern.

- [ ] **Step 3: Write the four subcommands**

Apply P6.7 and P6.8. P6.8 replaces `main` with the new functions and a
`main` of seven branches.

**P6.7** `skills/tanto/scripts/boundary.js` — replace exactly these 7 lines

```js
// Three subcommands: `check`, which runs the boundary's read-only commands
// and prints their output under fixed headings, and `record`, which writes
// the ledger's and the roster's rows — both run by the `boundary.verify` kind
// from `templates/boundary-brief.md`, and, under the design's shape 2, by a
// headless session running the same brief — and `census`, which Kanri runs
// itself: the roster's `live` and `queued` rows against the CLI's listing of
// the sessions under the root, read-only. It judges nothing.
```

**P6.7 →**

```js
// Seven subcommands. `check` runs the boundary's read-only commands and
// prints their output under fixed headings, and `record` writes the ledger's
// and the roster's rows — both run by the `boundary.verify` kind from
// `templates/boundary-brief.md`, and, under the design's shape 2, by a
// headless session running the same brief. Kanri runs the next four itself:
// `census`, the roster's `live` and `queued` rows against the spawner's state
// file and the CLI's listing of the sessions under the root, read-only;
// `seat`, a seat's status and its name at the moment of sending; `wake`, a
// `resume` for each parked seat it names; and `beat`, the spawner's
// heartbeat, read before every request. `request` is a seat's own, its
// `park` or its `leave`, written as its turn's last tool call. Only `record`
// writes a document, and only `wake` and `request` write request files. It
// judges nothing.
```

**P6.8** `skills/tanto/scripts/boundary.js` — replace exactly these 7 lines

```js
function main(argv) {
  const sub = argv[0];
  if (sub === "check") return cmdCheck(argv.slice(1));
  if (sub === "record") return cmdRecord(argv.slice(1));
  if (sub === "census") return cmdCensus(argv.slice(1));
  return fail("usage: boundary.js check|record|census <options>", 2);
}
```

**P6.8 →**

```js
/**
 * The four subcommands' arguments after `census`: a flag named in `switches`
 * is bare, every other `--flag` takes the next argument, and the rest are
 * positionals, in order — `wake --hold <sessionId>` must not read the id as
 * the switch's value, as `parseArgs` would.
 */
function parseLine(argv, switches) {
  const values = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    const name = arg.slice(2);
    const next = argv[i + 1];
    if (switches.includes(name) || next === undefined || next.startsWith("--")) {
      values[name] = true;
      continue;
    }
    values[name] = next;
    i++;
  }
  return { values, positionals };
}

/** `--root`, else the cwd, resolved; null when `--root` is given bare. */
function rootOf(values) {
  if (values.root === true) return null;
  return path.resolve(given(values, "root") || process.cwd());
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Request files under the spawner's `requests/`, each through a temp file
 * and a rename, as `tanto.js` writes them. The ids share one stamp and are
 * numbered in order, so that the spawner, which takes requests in name
 * order, takes a `hold` before the `resume` written after it. Returns the
 * ids; throws when there is no requests directory.
 */
function writeRequests(root, bodies) {
  const dir = path.join(spawner.spawnerDir(root), "requests");
  if (!fs.statSync(dir).isDirectory()) throw new Error(`${dir} is not a directory`);
  const at = new Date().toISOString().replace(/[:.]/g, "-");
  const tag = Math.random().toString(36).slice(2, 8);
  return bodies.map((body, i) => {
    const id = `${at}-${String(i).padStart(3, "0")}-${tag}`;
    const file = path.join(dir, `${id}.json`);
    fs.writeFileSync(`${file}.tmp`, `${JSON.stringify(body, null, 2)}\n`);
    fs.renameSync(`${file}.tmp`, file);
    return id;
  });
}

/**
 * The `uuid` of a transcript's last record that carries one — a record may
 * carry none — or null. A last line cut by a write in progress is skipped.
 * Throws when the file cannot be read.
 */
function lastUuid(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].trim()) continue;
    try {
      const record = JSON.parse(lines[i]);
      if (typeof record?.uuid === "string" && record.uuid) return record.uuid;
    } catch {
      // Not a whole record; the one before it is read instead.
    }
  }
  return null;
}

/**
 * `request <park|leave> --transcript <path> [--waiting [--notice]]` (spec
 * 2.2, 5.2): a seat's request about itself, written as its turn's last tool
 * call. The `sessionId` is the transcript's basename and `after` the `uuid`
 * of its last record that carries one, so that the spawner acts only once
 * the turn that wrote the request has ended. `park` carries `waiting` and
 * `notice`; `leave` is a `stop` with `self: true`.
 */
function cmdRequest(argv) {
  const { values, positionals } = parseLine(argv, ["waiting", "notice"]);
  const act = positionals[0];
  if (act !== "park" && act !== "leave") return fail("request needs park or leave", 2);
  const transcript = given(values, "transcript");
  if (!transcript?.endsWith(".jsonl")) return fail("request needs --transcript <path>.jsonl", 2);
  if (act === "leave" && (values.waiting || values.notice)) {
    return fail("request leave takes no --waiting and no --notice", 2);
  }
  if (values.notice && !values.waiting) return fail("request park: --notice goes with --waiting", 2);
  const root = rootOf(values);
  if (!root) return fail("request: --root needs a value", 2);
  let after;
  try {
    after = lastUuid(transcript);
  } catch {
    return fail(`request: cannot read the transcript at ${transcript}`, 2);
  }
  const sessionId = path.basename(transcript, ".jsonl");
  const body =
    act === "park"
      ? { op: "park", sessionId, waiting: values.waiting === true, notice: values.notice === true }
      : { op: "stop", sessionId, self: true };
  if (after) body.after = after;
  let ids;
  try {
    ids = writeRequests(root, [body]);
  } catch {
    return fail(`request: no spawner requests directory under ${root}`, 2);
  }
  console.log(`${act} requested: ${ids[0]}`);
  return 0;
}

/** A seat by its `sessionId`, else the last one of that name — a `removed` messenger's among them (spec 4.4). */
function findSeat(seats, who) {
  if (seats.has(who)) return seats.get(who);
  return [...seats.values()].filter((seat) => seat.name === who).pop() || null;
}

/**
 * `seat`'s line, `<status> <name> <kind> <role> <turn>` (spec 2.5). The name
 * and the kind are the listing's now, else the state file's name and `-`: a
 * seat a tab holds stays listed after its `stop` (spec 5.1), which no census
 * pass of the spawner records. `<turn>` is `ended` or `open` by the
 * spawner's `turnEnded` over the whole transcript, `-` when none is on disk.
 */
function seatLine(seat, listed) {
  const session = listed.get(seat.sessionId);
  const name = session?.name || seat.name || "-";
  const kind = session?.kind || "-";
  let turn = "-";
  if (seat.transcript && fs.existsSync(seat.transcript)) {
    turn = spawner.turnEnded(seat.transcript)?.ended ? "ended" : "open";
  }
  return `${seat.status || "-"} ${name} ${kind} ${seat.role || "-"} ${turn}`;
}

/**
 * `seat <sessionId or name> [--root <dir>]` (spec 2.5, 1.5): the seat's line
 * from the state file, then the `spawner:` line. A session the state file
 * does not hold prints `no entry <kind>`, the kind the listing's for it, `-`
 * when it is not listed — what a session that ran `/tanto <role>` by hand
 * reads to learn whether the run started it. A listing that failed prints no
 * entry line: `seat: the listing failed — <error>` and exit 1, so a failed
 * listing is never read as "not listed".
 */
function cmdSeat(argv) {
  const { values, positionals } = parseLine(argv, []);
  const who = positionals[0];
  if (!who) return fail("seat needs a sessionId or a name", 2);
  const root = rootOf(values);
  if (!root) return fail("seat: --root needs a value", 2);
  const found = listing(root);
  if (found.error) return fail(`seat: the listing failed — ${found.error}`, 1);
  const listed = found.listed;
  const seat = findSeat(stateSeats(root), who);
  if (seat) {
    console.log(seatLine(seat, listed));
  } else {
    const session = listed.get(who) || [...listed.values()].find((s) => s.name === who);
    console.log(`no entry ${session?.kind || "-"}`);
  }
  console.log(spawnerLine(root));
  return 0;
}

/** A hold for a face with no launcher: 55 minutes past the seat's last turn, inside the hour's cache (spec 2.4, D-22). */
const HOLD_FOR_MS = 3300000;

/** How long `wake` waits for all its results (spec 2.5); `TANTO_WAKE_WAIT_MS` is a test seam. */
function wakeWaitMs() {
  return Number(process.env.TANTO_WAKE_WAIT_MS) || 60000;
}

/** The results of `ids` that land within `waitMs` in all, by id; one that does not is absent. */
function waitForResults(root, ids, waitMs) {
  const dir = path.join(spawner.spawnerDir(root), "results");
  const found = new Map();
  const until = Date.now() + waitMs;
  for (;;) {
    for (const id of ids) {
      if (found.has(id)) continue;
      try {
        found.set(id, JSON.parse(fs.readFileSync(path.join(dir, `${id}.json`), "utf8")));
      } catch {
        // Not there yet: the spawner writes a result through a rename.
      }
    }
    if (found.size === ids.length || Date.now() >= until) return found;
    sleepSync(500);
  }
}

/**
 * `wake [--hold] <sessionId>... [--root <dir>]` (spec 2.5): the `spawner:`
 * line; then a `resume` with no prompt for each seat, all written at once —
 * each after a `hold` with `forMs` and no `pid` when `--hold` is given (spec
 * 2.4) — one wait of up to sixty seconds for every result, and one line per
 * seat: `seat`'s line, or `error: <the result's error> — <sessionId>` with
 * the name the result carries. On a stale spawner it writes nothing: a
 * request no spawner takes is a line that waits unseen. Exit 1 on an error
 * line, on a hold that failed, or on a listing that failed (`listing:
 * <error>`, after the seats' lines).
 */
function cmdWake(argv) {
  const { values, positionals } = parseLine(argv, ["hold"]);
  const ids = [...new Set(positionals)];
  if (ids.length === 0) return fail("wake needs a sessionId", 2);
  const root = rootOf(values);
  if (!root) return fail("wake: --root needs a value", 2);
  const beat = spawnerLine(root);
  console.log(beat);
  if (beat !== "spawner: beating") return 1;
  const bodies = [];
  const plan = ids.map((sessionId) => {
    const entry = { sessionId, hold: null, resume: null };
    if (values.hold) {
      entry.hold = bodies.length;
      bodies.push({ op: "hold", sessionId, forMs: HOLD_FOR_MS });
    }
    entry.resume = bodies.length;
    bodies.push({ op: "resume", sessionId });
    return entry;
  });
  let written;
  try {
    written = writeRequests(root, bodies);
  } catch {
    return fail(`wake: no spawner requests directory under ${root}`, 2);
  }
  const results = waitForResults(root, written, wakeWaitMs());
  const found = listing(root);
  const listed = found.listed || new Map();
  const seats = stateSeats(root);
  let failed = false;
  for (const entry of plan) {
    const result = results.get(written[entry.resume]);
    if (!result || result.error) {
      failed = true;
      const name = result?.name ? ` ${result.name}` : "";
      console.log(`error: ${result ? result.error : "no result"} — ${entry.sessionId}${name}`);
      continue;
    }
    // A hold that failed leaves the seat awake and unheld: said on its line,
    // which still begins with the five words.
    let held = "";
    if (entry.hold !== null) {
      const hold = results.get(written[entry.hold]);
      if (!hold || hold.error) {
        held = ` — hold: ${hold ? hold.error : "no result"}`;
        failed = true;
      }
    }
    const seat = seats.get(entry.sessionId);
    console.log(`${seat ? seatLine(seat, listed) : `no entry ${listed.get(entry.sessionId)?.kind || "-"}`}${held}`);
  }
  if (found.error) {
    console.log(`listing: ${found.error}`);
    failed = true;
  }
  return failed ? 1 : 0;
}

/** `beat [--root <dir>]` (spec 2.5): the `spawner:` line alone, exit 1 when stale. */
function cmdBeat(argv) {
  const { values } = parseLine(argv, []);
  const root = rootOf(values);
  if (!root) return fail("beat: --root needs a value", 2);
  const line = spawnerLine(root);
  console.log(line);
  return line === "spawner: beating" ? 0 : 1;
}

function main(argv) {
  const sub = argv[0];
  if (sub === "check") return cmdCheck(argv.slice(1));
  if (sub === "record") return cmdRecord(argv.slice(1));
  if (sub === "census") return cmdCensus(argv.slice(1));
  if (sub === "request") return cmdRequest(argv.slice(1));
  if (sub === "seat") return cmdSeat(argv.slice(1));
  if (sub === "wake") return cmdWake(argv.slice(1));
  if (sub === "beat") return cmdBeat(argv.slice(1));
  return fail("usage: boundary.js check|record|census|request|seat|wake|beat <options>", 2);
}
```

- [ ] **Step 4: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes; the two `wake` tests that run a fake spawner
beside the command take about a second each.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 6
```

Expected: `task 6: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints**

```bash
git commit --only -m "feat: boundary.js request, seat, wake, and beat" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 7: the five read-once templates

Spec section 6, "Templates a session reads once (B)", carrying 1.1, 1.2,
1.3, 2.5, 2.6, 2.7, 3.1, 3.2, 4.4, 4.7, and 5.1 into the five templates a
session reads once, and into the one line of `boundary.test.js` that copies
`templates/roster.md`'s placeholder row. The files are
`skills/tanto/templates/roster.md`, `roster-archive.md`, `kanri.md`,
`kikaku-decision.md`, and `shoki-brief.md`, and
`skills/tanto/scripts/boundary.test.js`.

- `roster.md` — the Keeping rule: every row written from a result file by
  `record --seat`, a launcher-started seat recorded from the census's Not
  held line (1.3); one held seat per role and topic, the spawner refusing a
  second Kanri, Kikaku, or Hosa (1.2), in place of the second handshake; a
  tab's names under the census's rename (3.1); the handshake-rewrite bullet
  goes; Parked stays `live` and Ended is written `stopped` (2.7); the
  address-book bullet becomes 3.1's — a seat is its `sessionId`, its name
  read at the send, the first row the one stored address — and the
  last bullet the census before a line from a name no row holds (2.7). The
  placeholder rows carry `<name>` bare (1.3). Topic and Effort come from
  the result. The status words are five: `cleared` goes (5.1) and so does
  `refused` — its every use at `a89dd16` is a handshake that got no row, or
  a model mismatch the start sequence no longer refuses (1.4); the
  spawner's one-holder refusal writes no row. `(blocked since <HH:MM>)`
  keeps its form beside the census's cause (2.6). Events: a seat ended and
  by what, a recovery by `fukki` in place of the restart's two events
  (4.4), the second `no-role` (3.2), `old-contract row retired:` (4.7), and
  the `unsent:` / `sent:` pair for a time with no ledger open (2.5);
  `released:` and every `[<ref>]` go.
- `roster-archive.md` — the status list, twice, without `refused` and
  `cleared`, and its placeholder row's `<name>` bare.
- `kanri.md` — "Session events": the `release:`, the handshake, and the
  restart go; the second `no-role`, an ended seat, a recovery by `fukki`, a
  second top-family session woken as well as spawned (1.1, I-15), and the
  `unsent:` / `sent:` pair beside `unanswered:` / `answered:`, matched
  without ` (batch <X>)` (2.5). "Open questions for the human": a tab to
  close before a replacement and a `tanto fukki` after a stale spawner, in
  place of a `/clear` and a window to queue.
- `kikaku-decision.md` — Sekkei's orders line becomes the prompt's
  `input=` key, one path: with several inputs, this file (1.1).
- `shoki-brief.md` — "The report": the second line's reasons are 3.2's two.
- `boundary.test.js` — "a peer reading and a status each name the row they
  write" replaces the placeholder row by its new text.

After this task, a Kanri that creates a roster or a ledger, and a Kikaku or
a shoki that reads its template, reads no tab seat, handshake, `release:`,
`/clear`, or `[<ref>]`, and finds the census's headings, the `unsent:` pair,
and the five status words where the scripts now put them.

`markdownlint` ignores `skills/tanto/templates/**` by the repository's
configuration, so the lint step checks the hooks that apply (trailing
whitespace, final newline, line endings) and Biome on the test.

**Files:**

- Modify: `skills/tanto/templates/roster.md` — the Keeping rule, the two
  placeholder rows of each table, the Topic and Effort paragraph, the
  Status paragraph, the Residency paragraph's archive sentence, the Events
  placeholder.
- Modify: `skills/tanto/templates/roster-archive.md` — the opening's status
  list and the placeholder row.
- Modify: `skills/tanto/templates/kanri.md` — "Session events" and "Open
  questions for the human".
- Modify: `skills/tanto/templates/kikaku-decision.md` — "What Kanri should
  do with it".
- Modify: `skills/tanto/templates/shoki-brief.md` — "The report".
- Modify: `skills/tanto/scripts/boundary.test.js` — one line, which Tasks 5
  and 6 leave alone.

**Interfaces:**

- Consumes: Task 5's census headings and lines; Task 6's `seat`; batch A's
  `held:` refusal (Task 2) and `endedBy: "taiseki"` (Task 1).
- Produces: the roster's and the ledger's shapes from the next run on, and
  the `unsent:` / `sent:` pair whose sender and fukki procedure Tasks 13,
  17, and 19 write.

**Named-mechanism sites** (`git grep` at `a89dd16`).

- The status words: `SKILL.md` "Handshake and roster", "The address",
  "Messages", "Session exit", and "Artifacts"' roster-archive row,
  "stopped, dead, replaced, refused, and cleared rows" (Tasks 13 to 15);
  `roles/kanri.md` "On a handshake", "The batch loop", "A seat's exit", and
  "Session lifecycle" — "Replace" and "Release", the last of which moves
  "the stopped, dead, replaced, refused, and cleared rows" to the archive
  (Tasks 16 to 19). `boundary.js`'s `--status` pattern keeps `cleared`
  (section 6).
- `unanswered:` beside the new `unsent:` pair: `SKILL.md` "The address"
  (Task 13); `roles/kanri.md` "The four cases", "The handover file", "The
  handover, in a plan and between plans", and "Recovery after a VS Code
  restart", which becomes "Recovery" (Tasks 16, 17, 19);
  `templates/kanri-handover.md`'s Live peers (Task 22). `unsent:` itself is
  in no file at `a89dd16`.
- The bare `<name>`: `templates/kanri-handover.md`, `boundary-brief.md`,
  `batch-prompt.md` (Task 22) and `roles/kanri.md`'s loop step 6 (Task 17);
  the column header `Name [ref]` stays here, in the archive, in `SKILL.md`,
  `roles/kanri.md`, `roles/kaiseki.md`, `templates/bug-report.md`,
  `boundary.js`'s two header constants, and the tests.
- `(blocked since <HH:MM>)` and `(idle since <HH:MM>)`: `SKILL.md`
  "Handshake and roster" and "Messages" (Tasks 13, 14), `roles/kanri.md`
  "The batch loop" and "Session lifecycle" (Tasks 17, 19).
- `old-contract row retired:`: `roles/kanri.md`'s census (Task 19) and
  `tanto.js`'s old-shape line (Task 11).
- `input=`: `SKILL.md` "Invocation"'s prompt table (Task 12) and
  `roles/kanri.md`'s "Create" (Task 19); no site at `a89dd16`.
- The tanto line's second line: `SKILL.md` "Messages" (Task 14), unchanged
  in its text here.

**O7.1** `tab seat` — the Keeping rule's handshake and rename bullets, the `cleared` status, and the ledger's Session events (spec 1.1, 3.1, 5.1); before: 3 in `skills/tanto/templates/roster.md` and 1 in `skills/tanto/templates/kanri.md`, after: 0.

**O7.2** `terminal seat` — the Keeping rule and the Status paragraph (spec 1.1); before: 4 in `skills/tanto/templates/roster.md`, after: 0.

**O7.3** `handshake` — the Keeping rule, the Topic paragraph, the `refused` status, the Events placeholder, and the ledger's Session events (spec 1.1); before: 8 in `skills/tanto/templates/roster.md` and 1 in `skills/tanto/templates/kanri.md`, after: 0.

**O7.4** `release:` — the `cleared` status and the ledger's Session events (spec 5.1); before: 1 in `skills/tanto/templates/roster.md` and 1 in `skills/tanto/templates/kanri.md`, after: 0.

**O7.5** `released —` — the `cleared` status, "a tab seat Kanri released — `release:` sent" (spec 5.1); before: 1 in `skills/tanto/templates/roster.md`, after: 0. The Events placeholder's `released: <name> [<ref>]` goes with O7.9.

**O7.6** `/clear` — the dead-row bullet, the address-book bullet, the `cleared` status, and the ledger's open questions (spec 5.1); before: 4 in `skills/tanto/templates/roster.md` and 1 in `skills/tanto/templates/kanri.md`, after: 0.

**O7.7** `cleared row stays` — the keeping rule's sentence about the `cleared` status word (spec 5.1); before: 1 in `skills/tanto/templates/roster.md`, after: 0. A needle cannot carry backticks, so the status word itself is swept by the whole-skill fence of How a batch is verified, and the other `cleared` sites of the five templates are O7.36 to O7.37, O7.18 (the status-words paragraph), and the blocks themselves. The English verb in `skills/tanto/templates/shoki-brief.md` goes with its sentence (O7.20). The word stays in `skills/tanto/scripts/boundary.js` (2: the `--status` pattern and its message) and `skills/tanto/scripts/boundary.test.js` (3: the `--status` tests), which section 6 keeps for this run's own close.

**O7.36** `refused, or cleared moves` — the archive rule's list of statuses (spec 5.1); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O7.37** `refused, or cleared>` — the archive template's status placeholder (spec 5.1); before: 1 in `skills/tanto/templates/roster-archive.md`, after: 0.

**O7.8** `orders line` — the Topic paragraph and the decision template's handling (spec 1.1); before: 1 in `skills/tanto/templates/roster.md` and 1 in `skills/tanto/templates/kikaku-decision.md`, after: 0.

**O7.9** `name> [<ref>]` — `<name> [<ref>]`, the placeholder rows and the Events placeholder, the needle starting one character in because a needle that opens with `<` is read as a placeholder (spec 1.3); before: 10 in `skills/tanto/templates/roster.md`, 1 in `skills/tanto/templates/roster-archive.md`, and 1 in `skills/tanto/scripts/boundary.test.js`, after: 0. The column header `Name [ref]` stays (3 in `roster.md`, 1 in `roster-archive.md`).

**O7.10** `or refused and why` — the Events placeholder's handshake clause (spec 1.1, 1.4); before: 1 in `skills/tanto/templates/roster.md`, after: 0. The status word `refused` itself is swept by the whole-skill fence; its other sites are O7.38 to O7.40 and the blocks. Its 4 hits in `skills/tanto/scripts/boundary.test.js` — a test name and a local variable of the record tests — are not the status word and stay.

**O7.38** `accepted or refused` — the Session events line's handshake clause (spec 1.1); before: 1 in `skills/tanto/templates/kanri.md`, after: 0.

**O7.39** `replaced, refused, or` — the keeping rule's list of archived statuses (spec 5.1); before: 2 in `skills/tanto/templates/roster.md` (this one, and the line O7.36 names), after: 0.

**O7.40** `records a handshake that got no row` — the status paragraph's `refused` entry (spec 1.1); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O7.11** `recovery: begun` — the restart's first event (spec 4.4); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O7.12** `windows back` — the restart's second event (spec 4.4); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O7.13** `VS Code restart` — "a VS Code restart and which roles were recreated" and "a recovery after a VS Code restart" (spec 4.4); before: 1 in `skills/tanto/templates/roster.md` and 1 in `skills/tanto/templates/kanri.md`, after: 0.

**O7.14** `Kanri sends only to` — the rule spec 2.5 replaces; before: 2 in `skills/tanto/templates/roster.md`, after: 0.

**O7.15** `This is the address book` — the roster as the address book (spec 3.1); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O7.16** `and names no cause. Either` — the blocked suffix with no cause anywhere (spec 2.6); before: 1 in `skills/tanto/templates/roster.md`, after: 0. Its hit in `boundary.js` is O5.2's.

**O7.17** `no-role from` — the first `no-role` as an event (spec 3.2: the first is re-sent and marks no row); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O7.18** `status words are seven` — the seven status words (spec 5.1, 1.4); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O7.19** `a window to queue` — the ledger's open questions (spec section 6); before: 1 in `skills/tanto/templates/kanri.md`, after: 0.

**O7.20** `window behind it may have been` — the shoki brief's reason for the second line (spec 3.2); before: 1 in `skills/tanto/templates/shoki-brief.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P7.21 to P7.28 (`roster.md`), P7.29 and P7.30
(`roster-archive.md`), P7.31 and P7.32 (`kanri.md`), P7.33
(`kikaku-decision.md`), P7.34 (`shoki-brief.md`), and P7.35
(`boundary.test.js`).

**P7.21** `skills/tanto/templates/roster.md` — replace exactly these 11 lines

```markdown
- One row per seat, Kanri's own row first. A tab seat's row is written from
  its handshake; a terminal seat's is written from the spawner's result
  file, by `boundary.js record --seat <results path>` for a Jisso and by
  Kanri's own hand for a Keikaku or a Kanri successor. A row that does not
  exist yet while its seat is already working is not an error: the address
  is not needed until Kanri sends to it.
- One live session per role and topic; Kanri, Kikaku, and Hosa one each. A
  second handshake for a role and topic that already has a live row gets no
  row and is reported to the human. A plan that edits the tanto skill has
  all its Jissos spawned at its landing and their rows `queued`; every other
  plan has one Jisso at a time, spawned per batch.
```

**P7.21 →**

```markdown
- One row per seat, Kanri's own row first. Every row is written from the
  spawner's result file, by `boundary.js record --seat <results path>`:
  Kanri writes it for a seat it requested when the result lands, and for a
  seat the launcher started — a Kikaku, a Hosa — when its census prints
  that seat under Not held with
  `— spawned as <role> <topic>, result <id>`. A standalone Kaiseki and a
  messenger get no row. A row that does not exist yet while its seat is
  already working is not an error: nothing is sent to a seat by its row.
- One held seat per role and topic; Kanri, Kikaku, and Hosa one each. The
  spawner refuses a second Kanri, Kikaku, or Hosa while it holds one
  (`held: <sessionId>`), unless the request names the Kanri it succeeds,
  and Kanri requests no second seat of a role and topic. A plan that edits
  the tanto skill has all its Jissos spawned at its landing and their rows
  `queued`; every other plan has one Jisso at a time, spawned per batch.
```

**P7.22** `skills/tanto/templates/roster.md` — replace exactly these 27 lines

```markdown
  with an `ack` request. A tab seat the editor resumed is renamed the same
  way by Kanri's census, which finds its `sessionId` under the new name;
  nothing is typed in the tab.
- Every handshake rewrites that role's row in full. A handshake whose
  `sessionId` — the basename of its `transcript=` — is a row's Transcript
  basename is that row's session resumed, and rewrites the row in place with
  the new name and `[ref]`, its status unchanged.
- A row whose session has gone gets status `dead`: a `live` row whose
  `sessionId` the census does not list — a closed tab, a crash, a
  `/clear`ed window, whose session is no longer the one listed, a terminal
  seat whose process was collected — except while a restart is being
  recovered. A `queued` row the census does not list stays `queued`, since
  the send of its prompt resumes it, and a terminal seat's `dead` row whose
  transcript is on disk goes `live` again when a line due to it resumes it.
  A stopped, dead, replaced, refused, or
  cleared row stays, with its Residency row, until the plan closes, then
  both move to `roster-archive.md` as one row, so the run stays readable
  after a replacement and the roster stays short.
- This is the address book: one row per seat, Kanri's row first, the
  `Name [ref]` column being the address the row's session answers to, used
  as the bare name, and Kanri sends only to `live` rows. It stays correct
  because Kanri rewrites the Name column at every rename the census or a
  handshake shows, and a `/clear` keeps the name. The
  `[ref]` is load-bearing: it identifies a window across the listing, the
  roster, and the handover.
- Kanri sends only to `live` rows, and dispatches nothing to a session that
  has no accepted row here.
```

**P7.22 →**

```markdown
  with an `ack` request. A seat open in a VS Code tab carries the editor's
  name, and a new one after every window reload; Kanri's census finds its
  `sessionId` under that name and rewrites the cell the same way, and
  nothing is typed in the tab.
- A row whose session has gone gets status `dead`: a `live` row the census
  prints under Not listed — a crash, a seat whose process was collected.
  A row the census prints under Parked stays `live`: its seat is the run's,
  its conversation on disk, and a wake brings it back when a line is due.
  A row under Ended is written `stopped`, with an Events line naming what
  ended it. A `queued` row the census does not list stays `queued`, since
  the send of its prompt resumes it, and a `dead` row whose transcript is on
  disk goes `live` again when a line due to it resumes it. A stopped, dead,
  or replaced row stays, with its Residency row, until the plan closes, then
  both move to `roster-archive.md` as one row, so the run stays readable
  after a replacement and the roster stays short.
- This is the record of the run's seats, not an address book. A seat is its
  `sessionId` — its Transcript cell's basename — and Kanri reads the name it
  sends to from the spawner's state file at the moment of sending
  (`boundary.js seat`), waking a parked seat first. The one address still
  stored is the first data row's, Kanri's own, which every seat reads when
  it sends to Kanri. The Name column holds the bare name the listing printed
  when the row was last written, with no `[ref]`, and Kanri rewrites it at
  every rename the census shows.
- Kanri sends to no session that has no row here: a line from a name no row
  holds — a Kikaku's `decision:`, a Hosa's `slot-needed:` — is preceded by a
  census, which prints that seat under Not held for Kanri to record.
```

**P7.23** `skills/tanto/templates/roster.md` — replace exactly these 2 lines

```markdown
| kanri | — | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |
| <role> | <topic> | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |
```

**P7.23 →**

```markdown
| kanri | — | <name> | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |
| <role> | <topic> | <name> | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |
```

**P7.24** `skills/tanto/templates/roster.md` — replace exactly these 5 lines

```markdown
Topic is the topic word Kanri's orders line gave that session — for a Jisso,
the topic whose queue its handshake joined: the plan whose batches are in
flight, or, with none in flight, the plan whose landing requested the queue
— or `—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Effort is what
the handshake's `effort=` carried.
```

**P7.24 →**

```markdown
Topic is the topic the seat's spawn request named, as its result file
carries it — for a Jisso, the topic whose queue it was spawned into: the
plan whose batches are in flight, or, with none in flight, the plan whose
landing requested the queue — or `—` for Kanri, Kikaku, and Hosa. Effort
is the spawn's, as the result file records it.
```

**P7.25** `skills/tanto/templates/roster.md` — replace exactly these 23 lines

```markdown
The status words are seven: `queued`, `live`, `stopped`, `cleared`,
`replaced`, `dead`, and `refused`. A `live` cell may carry the suffix
`(idle since <HH:MM>)`, which Kanri appends while a Kikaku, Hosa, or Kaiseki
idles and the intake's address rule reads, or the suffix
`(blocked since <HH:MM>)`, which Kanri appends when the census's Listed line
for the seat carries `— blocked` and removes when a later census's does
not. The blocked suffix records the last census that saw the seat blocked,
not its state now — the census runs at the moments Kanri's role names, so
the cell can lag the seat by a batch — and names no cause. Either way a
reader tests the cell's first word, not the whole cell. `queued` is a Jisso
of a skill-editing plan waiting for its batch prompt, in spawn order.
`stopped` is a terminal seat
the spawner stopped on Kanri's request or the spawner's guard stopped, its
conversation kept, or a `queued` row that never ran. `cleared` records a
tab seat Kanri released — `release:` sent, the row marked as the line goes
out — or whose `/clear` a `no-role` reply to a line Kanri sent revealed;
whichever of that reply and the census sees a `/clear` first sets the
status. `dead` is a session the census no longer lists — for a terminal seat whose transcript is on disk, not final: a resume puts it back to `live`. `replaced` is the old row of a Kanri
that handed over. `refused` records a handshake that got no row — a second
live session for the same role and topic, or a model that did not match
`sessions.<role>` — and is always followed by an Events line saying which; a
second Sekkei or Keikaku whose topic differs from the live one's is not a
duplicate and gets its own row.
```

**P7.25 →**

```markdown
The status words are five: `queued`, `live`, `stopped`, `replaced`, and
`dead`. A `live` cell may carry the suffix
`(idle since <HH:MM>)`, which Kanri appends while a Kikaku, Hosa, or Kaiseki
idles, or the suffix
`(blocked since <HH:MM>)`, which Kanri appends when the census's Listed line
for the seat carries `— blocked (<cause>)` and removes when a later
census's does not. The blocked suffix records the last census that saw the
seat blocked, not its state now — the census runs at the moments Kanri's
role names, so the cell can lag the seat by a batch — and keeps no cause,
which the census's line and the spawner's notice carry. Either way a
reader tests the cell's first word, not the whole cell. `queued` is a Jisso
of a skill-editing plan waiting for its batch prompt, in spawn order.
`stopped` is a seat that has ended — on Kanri's `stop` request, by its own
`taiseki`, or by the spawner's guard — its conversation kept, or a
`queued` row that never ran; Kanri writes it as it writes the request, or
when its census prints the row under Ended. `dead` is a session the census
prints under Not listed — not final when its transcript is on disk: a
resume puts it back to `live`. `replaced` is the old row of a Kanri that
handed over. A second Sekkei or Keikaku whose topic differs from the live
one's is not a duplicate and gets its own row.
```

**P7.26** `skills/tanto/templates/roster.md` — replace exactly these 2 lines

```markdown
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |
| <role> | <topic> | <name> [<ref>] | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | context=<n> | — | — | — |
```

**P7.26 →**

```markdown
| kanri | — | <name> | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |
| <role> | <topic> | <name> | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | context=<n> | — | — | — |
```

**P7.27** `skills/tanto/templates/roster.md` — replace exactly this 1 line

```markdown
dead, replaced, refused, or cleared moves to `roster-archive.md`, joined with its
```

**P7.27 →**

```markdown
dead, or replaced moves to `roster-archive.md`, joined with its
```

**P7.28** `skills/tanto/templates/roster.md` — replace exactly these 12 lines

```markdown
- <YYYY-MM-DD HH:MM> — <one line: a handshake accepted, or refused and why; a
  session declared dead and what was verified; the plan landed and the SDD
  ledger's path recorded; a VS Code restart and which roles were recreated;
  recovery: begun; recovery: windows back;
  resumed: <old name> → <new name>;
  queued: <name> [<ref>] as Jisso <n> of <topic>;
  released: <name> [<ref>] — <role>, <what it left on disk>;
  no-role from <name> [<ref>] — <what was lost>;
  a seat the spawner's guard stopped, and its worktree's branch;
  a handover written by <name> [<ref>];
  a handover accepted by <name> [<ref>] from <name> [<ref>]; a shoroku
  proposal written by <name> [<ref>], or not written and what was lost;
```

**P7.28 →**

```markdown
- <YYYY-MM-DD HH:MM> — <one line: a seat's row written from its result,
  and a seat ended and by what — `taiseki`, or Kanri's own request; a
  session declared dead and what was verified; the plan landed and the SDD
  ledger's path recorded; a recovery (`fukki`) and what it put back;
  resumed: <old name> → <new name>;
  queued: <name> as Jisso <n> of <topic>;
  a second `no-role` from <sessionId> — the seat ended, and what was lost;
  old-contract row retired: <name>;
  unsent: <sessionId or op> — <the line or the request>, owed while the
  spawner was stale and no ledger was open, and its pair
  sent: <sessionId or op> — <the line or the request> once `fukki` sends it;
  a seat the spawner's guard stopped, and its worktree's branch;
  a handover written by <name>;
  a handover accepted by <name> from <name>; a shoroku
  proposal written by <name>, or not written and what was lost;
```

**P7.29** `skills/tanto/templates/roster-archive.md` — replace exactly this 1 line

```markdown
whose status is `stopped`, `dead`, `replaced`, `refused`, or `cleared` — a
```

**P7.29 →**

```markdown
whose status is `stopped`, `dead`, or `replaced` — a
```

**P7.30** `skills/tanto/templates/roster-archive.md` — replace exactly this 1 line

```markdown
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <stopped, dead, replaced, refused, or cleared> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |
```

**P7.30 →**

```markdown
| <role> | <name> | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <stopped, dead, or replaced> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |
```

**P7.31** `skills/tanto/templates/kanri.md` — replace exactly these 9 lines

```markdown
- <YYYY-MM-DD HH:MM> — <a spawn, stop, rm, or resume request and its result; an
  ask of the human and their answer; a `release:` sent to a tab seat, a
  `no-role` received; a handshake accepted or refused; a session declared dead and what was
  verified; a recovery after a VS Code restart; a handover written or accepted;
  a peer line you received and did not answer in the same turn, as
  `unanswered: <from> — <line>`, paired with `answered: <from> — <line>`
  when it is answered, both written through `record --event`, which ends a
  line it writes at a boundary with `(batch <X>)` so that the same event in
  two batches is two lines and twice in one batch is one; a shoroku
```

**P7.31 →**

```markdown
- <YYYY-MM-DD HH:MM> — <a spawn, stop, rm, or resume request, or a `wake`,
  and its result; an ask of the human and their answer; a `no-role`
  received, and a second one from the same `sessionId`, which ends that
  seat; a seat ended and by what — `taiseki`, or your own `stop` request; a
  session declared dead and what was verified; a recovery (`fukki`) and
  what it put back; a handover written or accepted; a second top-family
  session gone live, spawned or woken;
  a peer line you received and did not answer in the same turn, as
  `unanswered: <from> — <line>`, paired with `answered: <from> — <line>`
  when it is answered; a line or a request you owed while the spawner was
  stale, as `unsent: <sessionId or op> — <the line or the request>`, paired
  with `sent: <sessionId or op> — <the line or the request>` when `fukki`
  sends it; all four written through `record --event`, which ends a
  line it writes at a boundary with `(batch <X>)` so that the same event in
  two batches is two lines and twice in one batch is one, and a pair is
  matched on the text after its prefix, without that suffix; a shoroku
```

**P7.32** `skills/tanto/templates/kanri.md` — replace exactly these 3 lines

```markdown
   shoroku items, and every other open act asked of the human — a `/clear`,
   a window to queue, an answer waited on — the idle block's own source for
   its `for you:` list. Everything else is a ruling.>
```

**P7.32 →**

```markdown
   shoroku items, and every other open act asked of the human — a tab to
   close before a replacement, a `tanto fukki` after a stale spawner, an
   answer waited on — the idle block's own source for its `for you:` list.
   Everything else is a ruling.>
```

**P7.33** `skills/tanto/templates/kikaku-decision.md` — replace exactly these 3 lines

```markdown
table. A decision that places a topic also names the input files its spec
starts from, so that Sekkei's orders line goes out in one turn. Kanri
rules; this is what you expect, and why.>
```

**P7.33 →**

```markdown
table. A decision that places a topic also names the input files its spec
starts from, so that Kanri's `spawn` of the topic's Sekkei goes out in one
turn: its prompt's `input=` key is one path, and with several inputs it is
this file, which lists the rest. Kanri rules; this is what you expect, and
why.>
```

**P7.34** `skills/tanto/templates/shoki-brief.md` — replace exactly these 4 lines

```markdown
first line. The second line goes on every line the run sends, yours
included: the address is a roster row, the window behind it may have been
cleared, and the line is what lets a bare window say so. You never receive
one and never act on one.
```

**P7.34 →**

```markdown
first line. The second line goes on every line the run sends, yours
included: a name read seconds before an editor reload may have passed to
another window, and a sender reading another repository's roster reaches
whatever answers to that name there; the line is what lets a session that
holds no role say so. You never receive one and never act on one.
```

**P7.35** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
    .replace("| kanri | — | <name> [<ref>] |", "| keikaku | tanto-diet | keikaku-a [ccdd11] |");
```

**P7.35 →**

```js
    .replace("| kanri | — | <name> |", "| keikaku | tanto-diet | keikaku-a [ccdd11] |");
```

- [ ] **Step 2: Run the suites that copy the two templates**

```bash
node --test skills/tanto/scripts/boundary.test.js skills/tanto/scripts/spawner.test.js
```

Expected: every test passes — `boundary.test.js`'s record tests and
"a spawn's startedAt reaches the roster's Started cell in the same shape"
copy `templates/roster.md` and `templates/kanri.md`, whose headings and
tables this task leaves as they were but for the placeholder rows' Name
cell, which P7.35 follows.

- [ ] **Step 3: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes.

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 7
```

Expected: `task 7: verify clean`.

- [ ] **Step 5: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri.md skills/tanto/templates/kikaku-decision.md skills/tanto/templates/shoki-brief.md skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 6: Commit per Global Constraints**

```bash
git commit --only -m "docs: the read-once templates drop the tab seat, the handshake, and cleared, and name the census's headings and the unsent pair" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri.md skills/tanto/templates/kikaku-decision.md skills/tanto/templates/shoki-brief.md skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 8: `tanto.js`: the word table, flags, `USAGE`, role resolution, the older-spawner and moved-run checks, `contract: 2` on every `spawn`

Spec 4.1 and 4.2, with 1.1's mark and 1.2's `succeeds` on the launcher's own
requests. Files: `skills/tanto/scripts/tanto.js` and
`skills/tanto/scripts/tanto.test.js`. **After this task** the launcher reads
`tanto [<role>] [<topic>]` and the four words `fukki`, `taiseki`, `teishi`, and
`jokyo`, each in romaji, kana, kanji, and English; `down`, the positional root,
and any other first word exit 2 with the usage and `a root is given with
--root`; `tanto <role>` resolves the seat it enters from the state file, and
spawns a Kikaku, a Hosa, or a standalone Kaiseki when none is held; every
`spawn` it writes carries `contract: 2`, and a Kanri spawn names the Kanri the
state file still holds as `succeeds`; a spawner that beats with no
`.tanto/spawner/contract` file, and a run whose Kanri is not a contract-2 seat,
get the two lines of spec 4.2.

Left to the next tasks, on lines this task does not touch: the entry still
prints `claude attach <id>` in place of attaching — Task 9 runs the attach,
and acts on `--attach`, `--no-attach`, `-a`, and `-n`, which this task parses;
the printed `then type /tanto fukki there once` stays until Task 10; `tanto
fukki` runs the bare `tanto`'s Kanri path with the older-spawner check, and
Task 10 adds the telling of Kanri; `tanto jokyo` dispatches to `cmdJokyo`,
which Task 10 writes — until then the word throws a `ReferenceError`, and no
test before Task 10 types it.

**Files:**

- Modify: `skills/tanto/scripts/tanto.js` — `USAGE`; `VALUE_FLAGS`,
  `SHORT_FLAGS`, and `parseArgs`; `rootOf` after `resolveRoot`;
  `contractPath` after `pidPath`; `say`, `DIALOGUE_ROLES`, `OLDER_SPAWNER`,
  `OLD_CONTRACT`, `spawnRequest`, `kanriRequest`, `isHeld`, `runMoved`, and
  `enterRole` in `kanriRequest`'s place; `cmdUp`'s signature, its `older`
  check after `ensureWorkspace`, its role branch before the Kanri branches,
  the older check before a Kanri resume or spawn, and its two Kanri spawns;
  `cmdDown`'s head as `cmdTeishi(values)`; `WORDS`, `wordOf`, `main`, and the
  exports.
- Test: `skills/tanto/scripts/tanto.test.js` — the teardown and every launch
  in the old form (the root as a positional, `down`); the titles of the seven
  `down` tests; the Minor 10 test, rewritten for `--root`; the retirement
  test's fixture (`dropsOnStop`, below); `quietSpawner` and ten new tests
  after "--help's usage line documents --timeout (Minor 10)".

**Interfaces:**

- Consumes: Task 2's `spawn`, which reads `contract` and `succeeds` and
  refuses a second Kanri, Kikaku, or Hosa with `held: <sessionId>`; Task 4's
  `cmdRun`, which writes `.tanto/spawner/contract` holding `2`. The launcher
  reads the file only when a spawner was beating before it ran, so when Task
  4 writes it does not matter here.
- Produces: `wordOf`, exported; `cmdUp(values, role, topic, word)` and
  `cmdTeishi(values)`; `enterRole`, which returns `{ attach }` or `{ code }`;
  `say(line, code)`, `DIALOGUE_ROLES`, `spawnRequest(root, sessions, role,
  prompt)`, `runMoved(seats)`, `isHeld`, and `contractPath`, which Tasks 9 to
  11 call; and the test helper `quietSpawner(ws)`, a stranger PID that beats
  beside a `contract` file, so that no census rewrites a test's state file
  (Tasks 9 and 10 use it).

**Named-mechanism sites.** The four words and their aliases are also
`SKILL.md`'s Invocation table (Task 12) and the README's launcher section (Task
23). `tanto down`, by `git grep -c` at `a89dd16`, is also `README.md` (3) and
`SKILL.md` (2), D's, and three comments and a line of `tanto.js` that Task 11
rewrites (O8.4). `git grep -F` at `a89dd16` over `skills/tanto/` finds no site
for `teishi`, `jokyo`, `contract: 2`, `.tanto/spawner/contract`, or `Moving a
run`, and `succeeds` only as an English verb in a `spawner.test.js` comment:
each is this plan's. `contract: 2` and `succeeds` are also `spawner.js`'s `spawn` (Task 2), `templates/spawn-request.md` (Task
22), `roles/kanri.md`'s spawn requests and Handover (Tasks 16 to 19), and the
Global Constraints' step 4. `.tanto/spawner/contract` is also `spawner.js`'s
`cmdRun` (Task 4), `cmdTeishi`'s removal (Task 11), and the Global
Constraints' step 3. The two lines of 4.2 are also the README's "Moving a run"
(Task 23), which `OLD_CONTRACT` names. `--root`, `-a`, and `-n` are also the
README's launcher section (Task 23).

**The retirement test's fixture.** From Task 11 a listing entry counts by its
`pid`, whatever its `state` (spec 2.6). The shared fake keeps a session it
stopped in the listing with `state: "stopped"`, which the CLI does not do for a
background session, and "teishi --seats retires the run, and the next tanto
spawns a fresh Kanri" would then find its stopped Kanri listed. The block that
moves that test's three launches to the new form also sets the fake's
`dropsOnStop`, so the test holds at every boundary.

**`succeeds` on the launcher's Kanri spawn.** `kanriRequest` takes the Kanri the
state file holds — the roster's first row's seat, or the one found by role —
and names it as `succeeds` when it is `running`, `blocked`, or `gone`: the
outgoing Kanri of a handover file's case, or a Kanri whose resume failed.
Without it Task 2's refusal answers `held: <sessionId>` in three existing tests
("a handover file with only the outgoing Kanri …", "a handover successor row
the live listing has lost …", and "a Kanri resume that fails …").

**O8.1** `[<root>]` — `USAGE`'s positional root (spec 4.1); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

**O8.2** `resolveRoot(positionals[0])` — the positional root of `cmdUp` and `cmdDown` (spec 4.1, the spec's Old values); before: 2 in `skills/tanto/scripts/tanto.js`, after: 0. `rootOf(values)` reads `--root`.

**O8.3** `cmdDown` — the retired word's function and its dispatch (spec 4.6, Old values); before: 2 in `skills/tanto/scripts/tanto.js`, after: 0.

**O8.4** `tanto down` — the retired word (D-12, Old values); before: 5 in `skills/tanto/scripts/tanto.js` (`USAGE`, the `VALUE_FLAGS` comment, `startSpawner`'s comment, `cmdUp`'s `gone`-Kanri comment, and `cmdDown`'s closing line) and 0 in `skills/tanto/scripts/tanto.test.js`; after this task: 3, the three Task 11 rewrites; after Task 11: 0 in both files.

**O8.5** `"down", ws.root` — the tests' `down` calls, the teardown's among them; before: 7 in `skills/tanto/scripts/tanto.test.js`, after: 0.

**O8.6** `LAUNCHER, "down"` — the Minor 10 test's `down` call; before: 1 in `skills/tanto/scripts/tanto.test.js`, after: 0.

**O8.7** `test("down` — the seven tests titled by the retired word; before: 7 in `skills/tanto/scripts/tanto.test.js`, after: 0.

**O8.8** `[ws.root, "--timeout"` — the tests' positional root; before: 32 in `skills/tanto/scripts/tanto.test.js`, after: 0. The new usage test names the root as a first word on purpose, as `[ws.root]`, which this needle does not match.

**O8.9** `launch(ws, [inner])` — the not-a-top-level test's positional root; before: 1 in `skills/tanto/scripts/tanto.test.js`, after: 0.

**O8.10** `kanriRequest(root, sessions);` — a Kanri spawn that names no holder it succeeds (spec 1.2); before: 2 in `skills/tanto/scripts/tanto.js`, after: 0.

- [ ] **Step 1: Move the tests to the new form, and write the failing tests**

Apply P8.11 to P8.30, then P8.42 and P8.43. The replace-all blocks move every launch to the form
with no positional root — `launch` runs the launcher with the workspace as its
cwd, which is the root — and every `down` to `teishi`.

**P8.11** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
      launch(ws, ["down", ws.root]);
```

**P8.11 →**

```js
      launch(ws, ["teishi"]);
```

**P8.12** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
  const got = launch(ws, [inner]);
```

**P8.12 →**

```js
  const got = launch(ws, ["--root", inner]);
```

**P8.13** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("down --seats reports a failed stop and exits 1 (Important 6)", () => {
```

**P8.13 →**

```js
test("teishi --seats reports a failed stop and exits 1 (Important 6)", () => {
```

**P8.14** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
  const got = launch(ws, ["down", ws.root, "--seats", "--timeout", "20000"]);
```

**P8.14 →**

```js
  const got = launch(ws, ["teishi", "--seats", "--timeout", "20000"]);
```

**P8.15** `skills/tanto/scripts/tanto.test.js` — replace exactly these 3 lines

```js
  assert.match(got.err, /--timeout <ms>/);
});

```

**P8.15 →**

```js
  assert.match(got.err, /--timeout <ms>/);
});

/**
 * A spawner that beats and runs this design's code but answers nothing, so
 * that no census pass rewrites the state file a test arranged (spec 4.2).
 * `strangerPid` is below.
 */
function quietSpawner(ws) {
  const child = strangerPid(ws, Date.now());
  fs.writeFileSync(path.join(ws.root, ".tanto", "spawner", "contract"), "2\n");
  return child;
}

test("the word table: each of the four words in romaji, kana, kanji, and English, and the seven roles (spec 4.1)", () => {
  const { wordOf } = require(LAUNCHER);
  const table = {
    fukki: ["fukki", "ふっき", "復帰", "resume"],
    taiseki: ["taiseki", "たいせき", "退席", "leave"],
    teishi: ["teishi", "ていし", "停止", "stop"],
    jokyo: ["jokyo", "じょうきょう", "状況", "status"],
    kanri: ["kanri", "かんり", "管理"],
    sekkei: ["sekkei", "せっけい", "設計"],
    keikaku: ["keikaku", "けいかく", "計画"],
    jisso: ["jisso", "じっそう", "実装"],
    kaiseki: ["kaiseki", "かいせき", "解析"],
    kikaku: ["kikaku", "きかく", "企画"],
    hosa: ["hosa", "ほさ", "補佐"],
  };
  for (const [id, words] of Object.entries(table)) {
    for (const word of words) assert.equal(wordOf(word), id, word);
  }
  for (const word of ["down", "up", "shoki", "denrei", "Kanri"]) assert.equal(wordOf(word), null, word);
});

test("a first word that is no role and no word exits 2 with the usage and the --root line, writing nothing (spec 4.1)", () => {
  const ws = workspace();
  // A spawner that beats, so that a launcher that took the root as its first
  // word still starts none.
  const child = strangerPid(ws, Date.now());
  try {
    for (const argv of [[ws.root], ["down"], ["kikak"]]) {
      const got = launch(ws, [...argv, "--timeout", "1000"]);
      assert.equal(got.code, 2, argv.join(" "));
      assert.match(got.err, /^Usage: tanto/);
      assert.match(got.err, /a root is given with --root$/m);
    }
    assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "spawner", "requests")), false);
  } finally {
    child.kill();
  }
});

test("taiseki at the launcher names the word to say in the seat, and does nothing (spec 4.1)", () => {
  const ws = workspace();
  const got = launch(ws, ["退席"]);
  assert.equal(got.code, 2);
  assert.equal(got.out.trim(), "taiseki is said in the seat it ends: /tanto taiseki");
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto")), false);
});

test("the Kanri spawn the launcher writes carries contract: 2 (spec 1.1)", () => {
  const ws = workspace();
  const got = launch(ws, ["kanri", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "spawn")
      .map((r) => [r.role, r.prompt, r.contract]),
    [["kanri", "/tanto kanri", 2]],
  );
});

test("tanto kikaku with no Kikaku held asks for one, and for no Kanri (spec 4.2)", () => {
  const ws = workspace();
  const got = launch(ws, ["kikaku", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "spawn")
      .map((r) => [r.role, r.topic, r.prompt, r.model, r.contract]),
    [["kikaku", "—", "/tanto kikaku", "fable", 2]],
  );
});

test("tanto hosa enters the Hosa the state file holds, parked or not, and asks for none (spec 4.2)", () => {
  const ws = workspace();
  writeSeats(ws, [{ sessionId: "sess-hosa", id: "bg31", role: "hosa", topic: "—", status: "parked", contract: 2 }]);
  const got = launch(ws, ["ほさ", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("sekkei, keikaku, and jisso are entered, never started: none held is said, two held want a topic (spec 4.2)", () => {
  const ws = workspace();
  writeSeats(ws, [
    { sessionId: "sess-kanri", id: "bg02", role: "kanri", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-k1", id: "bg41", role: "keikaku", topic: "topic-a", status: "parked", contract: 2 },
    { sessionId: "sess-k2", id: "bg42", role: "keikaku", topic: "topic-b", status: "parked", contract: 2 },
  ]);
  const child = quietSpawner(ws);
  try {
    const none = launch(ws, ["sekkei", "--timeout", "5000"]);
    assert.equal(none.code, 1);
    assert.match(none.out, /^no sekkei is held; Kanri starts one — tanto kanri$/m);
    const two = launch(ws, ["keikaku", "--timeout", "5000"]);
    assert.equal(two.code, 2);
    assert.match(two.err, /^ {2}tanto keikaku topic-a$/m);
    assert.match(two.err, /^ {2}tanto keikaku topic-b$/m);
    const one = launch(ws, ["計画", "topic-b", "-n", "--timeout", "5000"]);
    assert.equal(one.code, 0, one.err);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("kaiseki: a topic names the attached one, none held starts a standalone one, two held want a topic (spec 4.2)", () => {
  const ws = workspace();
  writeSeats(ws, [{ sessionId: "sess-kanri", id: "bg02", role: "kanri", topic: "—", status: "running", contract: 2 }]);
  const missing = launch(ws, ["kaiseki", "topic-a", "--timeout", "20000"]);
  assert.equal(missing.code, 1);
  assert.match(missing.out, /^no kaiseki topic-a is held; Kanri starts one — tanto kanri$/m);
  const standalone = launch(ws, ["解析", "--timeout", "20000"]);
  assert.equal(standalone.code, 0, standalone.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "spawn")
      .map((r) => [r.role, r.topic, r.prompt, r.contract]),
    [["kaiseki", "—", "/tanto kaiseki", 2]],
  );
  const both = workspace();
  writeSeats(both, [
    { sessionId: "sess-ka1", id: "bg51", role: "kaiseki", topic: "—", status: "parked", contract: 2 },
    { sessionId: "sess-ka2", id: "bg52", role: "kaiseki", topic: "topic-a", status: "parked", contract: 2 },
  ]);
  const two = launch(both, ["kaiseki", "--timeout", "20000"]);
  assert.equal(two.code, 2);
  assert.match(two.err, /^ {2}tanto kaiseki topic-a$/m);
});

test("an older spawner: a listed Kanri is still entered, and any other act prints the restart line and writes nothing (spec 4.2)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  // A spawner that beats and wrote no `contract` file.
  // A seat the listing has lost, which a launcher on the new contract would
  // resume on this path: the older spawner is written nothing, resume included.
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running" },
    { sessionId: "sess-jisso", id: "bg08", role: "jisso", topic: "t", status: "running" },
  ]);
  const child = strangerPid(ws, Date.now());
  const lost = workspace([{ ...LIVE_KANRI, hidden: true }]);
  writeRoster(lost, "live", "/tmp/sess-live.jsonl");
  writeSeats(lost, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "gone" }]);
  const lostChild = strangerPid(lost, Date.now());
  try {
    const entered = launch(ws, ["kanri", "--timeout", "1000"]);
    assert.equal(entered.code, 0, entered.err);
    const refused = [
      [ws, ["kikaku"]],
      [ws, ["fukki"]],
      [ws, ["hosa", "-n"]],
      [lost, ["kanri"]],
    ];
    for (const [where, argv] of refused) {
      const got = launch(where, [...argv, "--timeout", "1000"]);
      assert.equal(got.code, 1, argv.join(" "));
      assert.match(got.out, /^the spawner is older than this launcher: run tanto teishi, then tanto$/m);
    }
    assert.deepEqual(requests(ws), []);
    assert.deepEqual(requests(lost), []);
  } finally {
    child.kill();
    lostChild.kill();
  }
});

test("a run that has not moved: a Kikaku and a standalone Kaiseki start, and every seat Kanri addresses waits for the move (spec 4.2)", () => {
  const ws = workspace();
  writeSeats(ws, [
    { sessionId: "sess-kanri", id: "bg02", role: "kanri", topic: "—", status: "running" },
    { sessionId: "sess-jisso", id: "bg03", role: "jisso", topic: "t", status: "running" },
  ]);
  for (const argv of [["hosa"], ["sekkei"], ["keikaku", "t"], ["jisso"], ["kaiseki", "t"]]) {
    const got = launch(ws, [...argv, "--timeout", "20000"]);
    assert.equal(got.code, 1, argv.join(" "));
    assert.match(got.out, /^this run is on the old contract — move it first: README, "Moving a run"$/m);
  }
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  const kikaku = launch(ws, ["kikaku", "--timeout", "20000"]);
  assert.equal(kikaku.code, 0, kikaku.err);
  setState(ws, { next: { sessionId: "sess-kaiseki", id: "bg04" } });
  const kaiseki = launch(ws, ["kaiseki", "--timeout", "20000"]);
  assert.equal(kaiseki.code, 0, kaiseki.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "spawn")
      .map((r) => r.role),
    ["kikaku", "kaiseki"],
  );
});

```

**P8.16** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("down --seats keeps a following root from being consumed as its value (Minor 10)", () => {
```

**P8.16 →**

```js
test("teishi --seats keeps a following --root from being consumed as its value (Minor 10)", () => {
```

**P8.17** `skills/tanto/scripts/tanto.test.js` — replace exactly these 4 lines

```js
  // Run from a cwd that is not ws.root: if `--seats` swallowed the following
  // root as its own value, `positionals[0]` would be undefined and
  // `resolveRoot` would fall back to this cwd instead.
  const result = spawnSync(process.execPath, [LAUNCHER, "down", "--seats", ws.root, "--timeout", "20000"], {
```

**P8.17 →**

```js
  // Run from a cwd that is not ws.root: if `--seats` swallowed the `--root`
  // after it as its own value, the root would fall back to this cwd instead.
  const args = [LAUNCHER, "teishi", "--seats", "--root", ws.root, "--timeout", "20000"];
  const result = spawnSync(process.execPath, args, {
```

**P8.18** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("down --seats retires the run, and the next tanto spawns a fresh Kanri", () => {
```

**P8.18 →**

```js
test("teishi --seats retires the run, and the next tanto spawns a fresh Kanri", () => {
```

**P8.19** `skills/tanto/scripts/tanto.test.js` — replace exactly these 3 lines

```js
  launch(ws, [ws.root, "--timeout", "20000"]);
  launch(ws, ["down", ws.root, "--seats", "--timeout", "20000"]);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
```

**P8.19 →**

```js
  launch(ws, ["kanri", "--timeout", "20000"]);
  // The CLI drops a background session it stops from the listing.
  setState(ws, { dropsOnStop: true });
  launch(ws, ["teishi", "--timeout", "20000", "--seats"]);
  const got = launch(ws, ["kanri", "--timeout", "20000"]);
```

**P8.20** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("down stops the spawner and removes its pidfile", () => {
```

**P8.20 →**

```js
test("teishi stops the spawner and removes its pidfile", () => {
```

**P8.21** `skills/tanto/scripts/tanto.test.js` — replace exactly these 6 lines

```js
  const got = launch(ws, ["down", ws.root]);
  assert.equal(got.code, 0);
  assert.equal(fs.existsSync(pidfile), false);
});

test("down --seats writes a stop request for every running seat", () => {
```

**P8.21 →**

```js
  const got = launch(ws, ["teishi"]);
  assert.equal(got.code, 0);
  assert.equal(fs.existsSync(pidfile), false);
});

test("teishi --seats writes a stop request for every running seat", () => {
```

**P8.22** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
  launch(ws, ["down", ws.root, "--seats", "--timeout", "20000"]);
```

**P8.22 →**

```js
  launch(ws, ["teishi", "--seats", "--timeout", "20000"]);
```

**P8.23** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
    const got = launch(ws, [ws.root, "--timeout", "20000"]);
```

**P8.23 →**

```js
    const got = launch(ws, ["--timeout", "20000"]);
```

**P8.24** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
    launch(ws, [ws.root, "--timeout", "1000"]);
```

**P8.24 →**

```js
    launch(ws, ["--timeout", "1000"]);
```

**P8.25** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("down with a stale heartbeat removes pid and heartbeat and signals nothing (spec 4.2)", () => {
```

**P8.25 →**

```js
test("teishi with a stale heartbeat removes pid and heartbeat and signals nothing (spec 4.2)", () => {
```

**P8.26** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("down with a live pid and no heartbeat file names the pid to end by hand and signals nothing (D-6)", () => {
```

**P8.26 →**

```js
test("teishi with a live pid and no heartbeat file names the pid to end by hand and signals nothing (D-6)", () => {
```

**P8.27** `skills/tanto/scripts/tanto.test.js` — replace all 20 occurrences of this 1 line

```js
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
```

**P8.27 →**

```js
  const got = launch(ws, ["--timeout", "20000"]);
```

**P8.28** `skills/tanto/scripts/tanto.test.js` — replace all 5 occurrences of this 1 line

```js
  launch(ws, [ws.root, "--timeout", "20000"]);
```

**P8.28 →**

```js
  launch(ws, ["--timeout", "20000"]);
```

**P8.29** `skills/tanto/scripts/tanto.test.js` — replace all 3 occurrences of this 1 line

```js
  assert.equal(launch(ws, [ws.root, "--timeout", "20000"]).out.includes(TRUST), false);
```

**P8.29 →**

```js
  assert.equal(launch(ws, ["--timeout", "20000"]).out.includes(TRUST), false);
```

**P8.30** `skills/tanto/scripts/tanto.test.js` — replace all 2 occurrences of this 1 line

```js
    const got = launch(ws, ["down", ws.root]);
```

**P8.30 →**

```js
    const got = launch(ws, ["teishi"]);
```

**P8.42** `skills/tanto/scripts/tanto.test.js` — replace exactly these 4 lines

```js
  // A seats.json row distinct from the outgoing Kanri, but absent from the
  // live listing, must not be trusted as an attachable id directly — the
  // generic "every other seat" resume loop is what reconnects it instead,
  // and the main branch falls back to a fresh spawn.
```

**P8.42 →**

```js
  // A seats.json row distinct from the outgoing Kanri, but absent from the
  // live listing, must not be trusted as an attachable id directly. It is
  // also a second holder of the role, so the successor's spawn, which names
  // the outgoing Kanri alone, is refused (spec 1.2) and the launcher says so;
  // a seat the listing lost is put back by `fukki`, never by `tanto`.
```

**P8.43** `skills/tanto/scripts/tanto.test.js` — replace exactly these 7 lines

```js
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 1);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "resume")
      .map((r) => r.sessionId),
    ["sess-ghost"],
  );
```

**P8.43 →**

```js
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 1);
  assert.equal(got.code, 1);
  assert.match(got.err, /held: sess-ghost/);
  assert.deepEqual(
    requests(ws).filter((r) => r.op === "resume"),
    [],
  );
```

- [ ] **Step 2: Run the new tests to verify they fail**

```bash
node --test --test-name-pattern "the word table|no role and no word|taiseki at the launcher|carries contract: 2|no Kikaku held asks|enters the Hosa|never started|kaiseki: a topic names|an older spawner|has not moved" skills/tanto/scripts/tanto.test.js
```

Expected: ten failures. `wordOf` is not exported; the old launcher reads every
role word and `退席` as a root that is not a git repository and exits 2 with no
line, or exits 2 where 0 or 1 is expected; `down` stops nothing and exits 0;
the root as a first word asks the beating stranger for a Kanri and exits 1
after its timeout. None of these runs starts a spawner, so the teardown's
`teishi`, which the old launcher also reads as a root, leaves nothing running.

- [ ] **Step 3: Write the word table, the flags, the role resolution, and the two checks**

Apply P8.31 to P8.41.

**P8.31** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
const USAGE = "Usage: tanto [<root>] [--timeout <ms>], or tanto down [<root>] [--seats] [--timeout <ms>]";
```

**P8.31 →**

```js
const USAGE = [
  "Usage: tanto [<role>] [<topic>] [--attach | --no-attach] [--root <path>] [--timeout <ms>]",
  "       tanto fukki [--no-attach] [--root <path>] [--timeout <ms>]",
  "       tanto teishi [--seats] [--root <path>] [--timeout <ms>]",
  "       tanto jokyo [--root <path>]",
].join("\n");
```

**P8.32** `skills/tanto/scripts/tanto.js` — replace exactly these 10 lines

```js
// Flags that take a value. Every other `--flag` is boolean, so a positional
// right after it (`tanto down --seats <root>`) is never mistaken for its
// value (Minor 10, branch-review.md).
const VALUE_FLAGS = new Set(["timeout"]);

function parseArgs(argv) {
  const values = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
```

**P8.32 →**

```js
// Flags that take a value. Every other `--flag` is boolean, so a word right
// after it (`tanto --no-attach kikaku`) is never mistaken for its value
// (Minor 10, branch-review.md). `-a`, `-n`, and `-h` are the short forms of
// `--attach`, `--no-attach`, and `--help` (spec 4.1).
const VALUE_FLAGS = new Set(["timeout", "root"]);
const SHORT_FLAGS = { "-a": "attach", "-n": "no-attach", "-h": "help" };

function parseArgs(argv) {
  const values = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (Object.hasOwn(SHORT_FLAGS, arg)) {
      values[SHORT_FLAGS[arg]] = true;
      continue;
    }
```

**P8.33** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
  return candidate;
}

```

**P8.33 →**

```js
  return candidate;
}

/** The root `--root` names, or the working directory, checked as `resolveRoot` checks it (spec 4.1). */
function rootOf(values) {
  return resolveRoot(typeof values.root === "string" ? values.root : undefined);
}

```

**P8.34** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
  return path.join(spawnerDir(root), "pid");
}

```

**P8.34 →**

```js
  return path.join(spawnerDir(root), "pid");
}

/**
 * `.tanto/spawner/contract`, which a spawner of this design writes at its
 * start, holding `2`, and `tanto teishi` removes with `pid` and `heartbeat`
 * (spec 4.2). A spawner that beats and wrote none runs older code.
 */
function contractPath(root) {
  return path.join(spawnerDir(root), "contract");
}

```

**P8.35** `skills/tanto/scripts/tanto.js` — replace exactly these 17 lines

```js
function kanriRequest(root, sessions) {
  const seat = sessions.kanri || {};
  return {
    op: "spawn",
    role: "kanri",
    topic: "—",
    model: seat.model,
    effort: seat.effort,
    branch: branchOf(root),
    mode: "auto",
    prompt: "/tanto kanri",
  };
}

function cmdUp(argv) {
  const { values, positionals } = parseArgs(argv);
  const root = resolveRoot(positionals[0]);
```

**P8.35 →**

```js
/** A line said to the human on stdout, and the exit code that goes with it. */
function say(line, code) {
  process.stdout.write(`${line}\n`);
  return code;
}

// The seats whose turns may end on a question to the human (spec, Words).
const DIALOGUE_ROLES = ["sekkei", "keikaku", "kikaku", "hosa", "kaiseki"];

// What the launcher says when an act needs more than this run can give
// (spec 4.2): a spawner from before the `contract` file is asked for no
// request, and a run whose Kanri read the old text addresses no new seat.
const OLDER_SPAWNER = "the spawner is older than this launcher: run tanto teishi, then tanto";
const OLD_CONTRACT = 'this run is on the old contract — move it first: README, "Moving a run"';

/**
 * A `spawn` request under this contract (spec 1.1): every one the launcher
 * writes carries `contract: 2`, which the spawner records on the seat.
 */
function spawnRequest(root, sessions, role, prompt) {
  const seat = sessions[role] || {};
  return {
    op: "spawn",
    role,
    topic: "—",
    model: seat.model,
    effort: seat.effort,
    branch: branchOf(root),
    mode: "auto",
    prompt,
    contract: 2,
  };
}

/**
 * The Kanri spawn. When the state file still holds a Kanri — the outgoing one
 * of a handover, or one whose resume failed — the request names it as the
 * holder it `succeeds`, which the spawner's one-holder rule lets through
 * (spec 1.2).
 */
function kanriRequest(root, sessions, outgoing) {
  const request = spawnRequest(root, sessions, "kanri", "/tanto kanri");
  return outgoing && KANRI_RESUMABLE.includes(outgoing.status) ? { ...request, succeeds: outgoing.sessionId } : request;
}

/**
 * Whether the state file holds `seat` (spec, Words): `running`, `blocked`,
 * or `parked` — or `gone`, for a seat that is not a dialogue seat.
 */
function isHeld(seat) {
  if (["running", "blocked", "parked"].includes(seat.status)) return true;
  return seat.status === "gone" && !DIALOGUE_ROLES.includes(seat.role);
}

/**
 * Whether the run has moved (spec 4.2): the Kanri the state file holds is a
 * contract-2 seat, or it holds none — the next Kanri is then the launcher's
 * own spawn, which carries the mark.
 */
function runMoved(seats) {
  return seats.filter((s) => s.role === "kanri" && KANRI_RESUMABLE.includes(s.status)).every((s) => s.contract === 2);
}

/**
 * The seat `tanto <role> [<topic>]` enters, for every role but Kanri (spec
 * 4.2): `{ attach }` with its short id — a held seat's, or that of the
 * Kikaku, Hosa, or standalone Kaiseki spawned when none is held, waited for
 * up to `waitMs` — or `{ code }` with the line already said.
 */
function enterRole(root, sessions, role, topic, seats, older, waitMs) {
  if (older) return { code: say(OLDER_SPAWNER, 1) };
  const held = seats.filter((s) => s.role === role && isHeld(s));
  const ofTopic = topic && role !== "kikaku" && role !== "hosa" ? held.filter((s) => s.topic === topic) : held;
  // Kanri never addresses a Kikaku or a standalone Kaiseki, so a run that
  // has not moved may still start or enter one; every other seat waits for
  // the move.
  const attached = role === "kaiseki" && Boolean(topic || (ofTopic.length === 1 && ofTopic[0].topic !== "—"));
  if (!runMoved(seats) && role !== "kikaku" && (role !== "kaiseki" || attached)) return { code: say(OLD_CONTRACT, 1) };
  if (ofTopic.length > 1) {
    fail(`tanto: ${ofTopic.length} ${role} seats are held — name the topic:`);
    for (const seat of ofTopic) fail(`  tanto ${role} ${seat.topic}`);
    return { code: 2 };
  }
  if (ofTopic.length === 1) return { attach: ofTopic[0].id || ofTopic[0].sessionId };
  if (role !== "kikaku" && role !== "hosa" && (role !== "kaiseki" || topic)) {
    return { code: say(`no ${role}${topic ? ` ${topic}` : ""} is held; Kanri starts one — tanto kanri`, 1) };
  }
  const result = waitForResult(root, writeRequest(root, spawnRequest(root, sessions, role, `/tanto ${role}`)), waitMs);
  if (!result) {
    fail(`tanto: the spawner wrote no result for the ${role} request; see .tanto/spawner/log`);
    return { code: 1 };
  }
  if (result.error) {
    fail(`tanto: the ${role} spawn failed — ${result.error}`);
    return { code: 1 };
  }
  return { attach: result.id || result.sessionId };
}

function cmdUp(values, role, topic, word) {
  const root = rootOf(values);
```

**P8.36** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
  startSpawner(root);
```

**P8.36 →**

```js
  // A spawner that was beating already and wrote no `contract` runs code
  // from before this design (spec 4.2): it is asked for no request of this
  // design, and `fukki` is nothing but requests.
  const older = !startSpawner(root) && !fs.existsSync(contractPath(root));
  if (older && word === "fukki") return say(OLDER_SPAWNER, 1);
```

**P8.37** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
  if (!handover && listed && row.status.startsWith("live") && listed.kind === "background") {
```

**P8.37 →**

```js
  if (role !== "kanri") {
    const entry = enterRole(root, sessions, role, topic, seats, older, waitMs);
    if (entry.code !== undefined) return entry.code;
    attach = entry.attach;
  } else if (!handover && listed && row.status.startsWith("live") && listed.kind === "background") {
```

**P8.38** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
  } else {
```

**P8.38 →**

```js
  } else {
    // A Kanri the listing does not hold needs a resume or a spawn, neither of
    // which an older spawner is asked for (spec 4.2).
    if (older) return say(OLDER_SPAWNER, 1);
```

**P8.39** `skills/tanto/scripts/tanto.js` — replace exactly these 5 lines

```js
        : kanriRequest(root, sessions);
    let result = waitForResult(root, writeRequest(root, request), waitMs);
    if (result?.error && request.op === "resume") {
      fail(`tanto: the Kanri resume failed — ${result.error}; spawning a new Kanri`);
      request = kanriRequest(root, sessions);
```

**P8.39 →**

```js
        : kanriRequest(root, sessions, held);
    let result = waitForResult(root, writeRequest(root, request), waitMs);
    if (result?.error && request.op === "resume") {
      fail(`tanto: the Kanri resume failed — ${result.error}; spawning a new Kanri`);
      request = kanriRequest(root, sessions, held);
```

**P8.40** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
function cmdDown(argv) {
  const { values, positionals } = parseArgs(argv);
  const root = resolveRoot(positionals[0]);
```

**P8.40 →**

```js
function cmdTeishi(values) {
  const root = rootOf(values);
```

**P8.41** `skills/tanto/scripts/tanto.js` — replace exactly these 10 lines

```js
function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  if (argv[0] === "down") return cmdDown(argv.slice(1));
  return cmdUp(argv);
}

module.exports = { main };
```

**P8.41 →**

```js
// One word table for the launcher and `/tanto` (spec 4.1): each word in
// romaji, kana, kanji, and its English alias; the role words are the seven
// of `SKILL.md`'s Invocation table. `down` is retired with no alias.
const WORDS = {
  fukki: ["fukki", "ふっき", "復帰", "resume"],
  taiseki: ["taiseki", "たいせき", "退席", "leave"],
  teishi: ["teishi", "ていし", "停止", "stop"],
  jokyo: ["jokyo", "じょうきょう", "状況", "status"],
  kanri: ["kanri", "かんり", "管理"],
  sekkei: ["sekkei", "せっけい", "設計"],
  keikaku: ["keikaku", "けいかく", "計画"],
  jisso: ["jisso", "じっそう", "実装"],
  kaiseki: ["kaiseki", "かいせき", "解析"],
  kikaku: ["kikaku", "きかく", "企画"],
  hosa: ["hosa", "ほさ", "補佐"],
};

/** The id of the word `arg` spells, or null. */
function wordOf(arg) {
  return Object.keys(WORDS).find((id) => WORDS[id].includes(arg)) || null;
}

function main(argv) {
  const { values, positionals } = parseArgs(argv);
  if (values.help) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  // The first positional is a role or a word; a `<topic>` is read only after
  // a role, so a topic that spells a word is never taken for it.
  const word = positionals.length === 0 ? "kanri" : wordOf(positionals[0]);
  if (word === null) {
    process.stderr.write(`${USAGE}\ntanto: ${positionals[0]} is no role or word — a root is given with --root\n`);
    return 2;
  }
  if (word === "teishi") return cmdTeishi(values);
  if (word === "jokyo") return cmdJokyo(values);
  if (word === "fukki") return cmdUp(values, "kanri", null, word);
  if (word === "taiseki") return say("taiseki is said in the seat it ends: /tanto taiseki", 2);
  return cmdUp(values, word, positionals[1] || null, word);
}

module.exports = { main, wordOf };
```

- [ ] **Step 4: Run the launcher's suite to verify it passes**

```bash
node --test skills/tanto/scripts/tanto.test.js
```

Expected: every test passes; the existing tests still read the printed `claude
attach <id>` line, which Task 9 replaces.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 8
```

Expected: `task 8: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints**

```bash
git commit --only -m "feat: the launcher takes a role and four words, resolves the seat it enters, and marks every spawn contract 2" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
```

Expected: one commit.

### Task 9: `tanto.js`: `cmdUp`'s attach and follow loop, the refusal that replaces "interactive tab", `LEAVE_LINE`

Spec 4.3, with 1.2's one place for a seat, 2.4's hold, 4.1's `--no-attach`,
and 4.5's listing, which step 5 of 4.3 prints. Files:
`skills/tanto/scripts/tanto.js` and `skills/tanto/scripts/tanto.test.js`.
**After this task** the launcher runs the CLI's `attach` on the seat itself —
`claude` resolved to a path once, no shell, the root as cwd, the terminal's
stdio inherited — and prints no `claude attach <id>` line. For a dialogue seat
it writes `hold` with its own PID before the attach and `release` after it, and
prints `<role> [<topic>] — context=<n>` first; a seat a tab holds is refused
with `<role> is open in a VS Code tab; close the tab and run this again` and
exit 1 — Kanri's interactive first row among them, in place of "Kanri is an
interactive tab; hand over first". When the attach ends, the state file and the
roster decide: a Kanri now `stopped` whose successor exists is followed with
nothing typed; otherwise the run's seats are printed once, and the launcher
exits 0. `--no-attach` prints the seat's name and the ways in and attaches
nothing. `LEAVE_LINE` says what ← and the agent view do now.

The listing of spec 4.5 — `doingOf`, `seatLines`, and `printSeats` — is
written here, because the follow prints it; Task 10's `tanto jokyo` prints the
same function's output, and its tests cover every third-column value. The
printed `then type /tanto fukki there once` and its comment stay between this
task's two tail blocks: Task 10 removes them when it tells Kanri instead.

**Files:**

- Modify: `skills/tanto/scripts/tanto.js` — the header comment and the
  `reading.js` import (`readTranscript`); `LEAVE_LINE`; `claudePath` before
  `claudeCommand`, which calls it; after `trustHint`, `seatAt`,
  `seatContext`, `inTab`, `doingOf`, `seatLines`, `printSeats`,
  `successorOf`, `enterSeat`, and `sayWaysIn`; `cmdUp`'s interactive branch;
  `cmdUp`'s tail.
- Test: `skills/tanto/scripts/tanto.test.js` — `attaches`, `lastAttach`,
  `ATTACH_HOOK`, `onAttach`, and `writeTranscript` after `calls`; `LEAVE`;
  every assertion on a printed `claude attach` line; the interactive first
  row's assertion; the interactive-first-row-with-a-resumed-peer test; the
  line-on-leaving, `gone`-Kanri, and trust-hint tests' assertions; five new
  tests after the trust-hint test.

**Interfaces:**

- Consumes: Task 3's `hold` request, `{ op: "hold", role, topic, sessionId,
  pid }`, and its errors `in a tab`, `held by another terminal`,
  `old-contract seat`, and `ended`, and its `release`, `{ op: "release", role,
  topic, sessionId }` — if Task 3 names a field otherwise, P9's hold and
  release follow it; Task 4's census, which writes `kind`, `waiting`, and
  `midTurn` on a seat, and the listing's `status` and `waitingFor`; Task 8's
  `say`, `DIALOGUE_ROLES`, `enterRole`, and `quietSpawner`; the shared fake,
  which logs an `attach` and exits 0, as it does for any subcommand it does
  not know. A seat spawned without the contract's mark is entered unheld on
  `old-contract seat`.
- Produces: `enterSeat(root, id, role, waitMs)`, `sayWaysIn`, `inTab`,
  `seatAt(root, id)` (Task 10's messenger), and `printSeats(root)` (Task 10's
  `cmdJokyo`); the test helpers `attaches`, `lastAttach`, `onAttach`, and
  `writeTranscript` (Tasks 10 and 11).

**Named-mechanism sites.** `LEAVE_LINE`'s ← and agent view are also C-1 in
`SKILL.md`'s new "The faces of a seat" (Task 15) and the README (Task 23),
whose "Ctrl+Z" — `git grep -c "Ctrl+Z" a89dd16 -- skills/tanto`: `README.md`
1, `tanto.js` 1, `tanto.test.js` 1 — goes with this line. The refusal line is
also the README's launcher section (Task 23). `hold` and `release` are also
`spawner.js` (Task 3) and `templates/spawn-request.md` (Task 22). The follow is
also `roles/kanri.md`'s Handover (Task 17) and the Global Constraints' step 4,
which say the launcher takes the human to the successor. `context=` is also
`reading.js`'s line, unchanged, and the README (Task 23). The listing is also
Task 10's `cmdJokyo`.

**The tail's two blocks.** P9.28 puts `--no-attach` where the trust
hint and the attach line were, and P9.29 puts the entry where
`return 0;` was; the five lines between them print the `fukki` line, which
Task 10 removes.

**O9.1** `prints the one line the human types next` — the header comment's account of the launcher; before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

**O9.2** `claude attach ${attach}` — the printed attach line (spec 4.3; section 6, "no longer prints `claude attach <id>`"); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0. Plain `claude attach` is not a needle here: the spec lets the launcher's own code and tests name it, and C-1's sentence elsewhere in this plan does.

**O9.3** `interactive tab; hand over first` — the line 4.3's refusal replaces (Old values); before: 1 in `skills/tanto/scripts/tanto.js` and 1 in `skills/tanto/scripts/tanto.test.js`, after: 0.

**O9.4** `Ctrl+Z to the shell` — `LEAVE_LINE` before ← and the agent view (section 6); before: 1 in `skills/tanto/scripts/tanto.js` and 1 in `skills/tanto/scripts/tanto.test.js`, after: 0.

**O9.5** `claude attach bg` — the tests' assertions on the printed line; before: 15 in `skills/tanto/scripts/tanto.test.js`, after: 0.

**O9.6** `claude attach/.test` — the interactive-first-row-with-a-resumed-peer test's assertion on the printed line; before: 1 in `skills/tanto/scripts/tanto.test.js`, after: 0.

**O9.7** `then type /tanto fukki there` — the printed instruction a resume asked for (section 6; Old values); before: 2 in `skills/tanto/scripts/tanto.js` (the line and its comment) and 1 in `skills/tanto/scripts/tanto.test.js`; after this task: 2, the script's, which Task 10 removes; after Task 10: 0.

- [ ] **Step 1: Write the failing tests, and move the existing ones off the printed attach line**

Apply P9.8 to P9.22.

**P9.8** `skills/tanto/scripts/tanto.test.js` — replace exactly these 3 lines

```js
    .map((l) => JSON.parse(l));
}

```

**P9.8 →**

```js
    .map((l) => JSON.parse(l));
}

/** The ids the launcher ran the CLI's `attach` on, in order (spec 4.3). */
function attaches(ws) {
  return calls(ws)
    .filter((argv) => argv[0] === "attach")
    .map((argv) => argv[1]);
}

function lastAttach(ws) {
  return attaches(ws).at(-1);
}

// A fake of its own around the shared one: at the n-th attach it writes the
// files of `attach-steps.json`'s n-th step, the way a handover changes them
// while the human is attached, and then runs the shared fake. A step's
// `@later` entry is `{ ms, files }`: a detached `node -e` child writes those
// files `ms` after the attach has returned, the way the spawner writes the
// state file a moment after the `stop` that ended the attach.
const ATTACH_HOOK = `
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
if (process.argv[2] === "attach") {
  const file = path.join(__dirname, "attach-steps.json");
  const steps = JSON.parse(fs.readFileSync(file, "utf8"));
  const step = steps.shift() || {};
  fs.writeFileSync(file, JSON.stringify(steps));
  for (const [name, body] of Object.entries(step)) {
    if (name !== "@later") {
      fs.writeFileSync(path.join(__dirname, name), body);
      continue;
    }
    const script = "const fs = require('node:fs'); const [dir, ms, files] = process.argv.slice(1);" +
      "setTimeout(() => { for (const [name, text] of Object.entries(JSON.parse(files))) {" +
      "const target = require('node:path').join(dir, name); fs.writeFileSync(target + '.tmp', text);" +
      "fs.renameSync(target + '.tmp', target); } }, Number(ms));";
    spawn(process.execPath, ["-e", script, __dirname, String(body.ms), JSON.stringify(body.files)], {
      detached: true,
      stdio: "ignore",
    }).unref();
  }
}
require("./fake-claude.js");
`;

/** Write `steps` for the hooked fake, and name it as the workspace's CLI. */
function onAttach(ws, steps) {
  fs.writeFileSync(path.join(ws.root, "attach-steps.json"), JSON.stringify(steps));
  ws.fake = path.join(ws.root, "fake-attach.js");
  fs.writeFileSync(ws.fake, ATTACH_HOOK);
}

/** A transcript whose one assistant record `reading.js` reads as `context` tokens. */
function writeTranscript(ws, sessionId, context) {
  const file = path.join(ws.root, `${sessionId}.jsonl`);
  const usage = { input_tokens: 100, cache_creation_input_tokens: 0, cache_read_input_tokens: context - 100 };
  fs.writeFileSync(file, `${JSON.stringify({ type: "assistant", message: { usage } })}\n`);
  return file;
}

```

**P9.9** `skills/tanto/scripts/tanto.test.js` — replace exactly these 3 lines

```js
// The two lines spec 4.1 and 4.3 fix, byte for byte.
const LEAVE =
  "← or /exit returns to the agent view, Ctrl+Z to the shell; the seat keeps running — /stop alone stops it, and a Kanri you /stop comes back with tanto";
```

**P9.9 →**

```js
// The two lines the launcher prints before an attach (spec 4.3), byte for byte.
const LEAVE =
  "← or /exit leaves for the agent view, and leaving the agent view comes back here; open no seat from the agent view — tanto <role> is the way in. Leaving ends no seat, and a Kanri you /stop comes back with tanto";
```

**P9.10** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
  assert.match(got.out, /interactive tab; hand over first/);
```

**P9.10 →**

```js
  assert.equal(got.code, 1);
  assert.match(got.out, /^kanri is open in a VS Code tab; close the tab and run this again$/m);
```

**P9.11** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
  assert.equal(/claude attach bg-ghost/.test(got.out), false);
```

**P9.11 →**

```js
  assert.notEqual(lastAttach(ws), "bg-ghost", got.err);
```

**P9.12** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("an interactive first row with a resumed peer prints no attach or fukki line (Minor 10)", () => {
```

**P9.12 →**

```js
test("an interactive first row is refused before any seat is resumed or attached (spec 4.3)", () => {
```

**P9.13** `skills/tanto/scripts/tanto.test.js` — replace exactly these 3 lines

```js
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 1);
  assert.equal(/claude attach/.test(got.out), false);
  assert.equal(/tanto fukki/.test(got.out), false);
```

**P9.13 →**

```js
  assert.equal(got.code, 1);
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 0);
  assert.deepEqual(attaches(ws), []);
```

**P9.14** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("the attach line is followed by the line on leaving and stopping a seat", () => {
```

**P9.14 →**

```js
test("the line on leaving a seat is printed before the attach, which runs on the seat's id", () => {
```

**P9.15** `skills/tanto/scripts/tanto.test.js` — replace exactly these 7 lines

```js
  const lines = got.out.split(/\r?\n/);
  const at = lines.indexOf("claude attach bg07");
  assert.notEqual(at, -1, got.out);
  assert.equal(lines[at + 1], LEAVE);
});

test("a Kanri seats.json holds as gone is resumed, never spawned again", () => {
```

**P9.15 →**

```js
  const lines = got.out.split(/\r?\n/);
  assert.notEqual(lines.indexOf(LEAVE), -1, got.out);
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("a Kanri seats.json holds as gone is resumed, never spawned again", () => {
```

**P9.16** `skills/tanto/scripts/tanto.test.js` — replace exactly these 6 lines

```js
  );
  const lines = got.out.split(/\r?\n/);
  const at = lines.indexOf("claude attach bg07");
  assert.notEqual(at, -1, got.out);
  assert.equal(lines[at + 1], LEAVE);
  assert.equal(lines[at + 2], "then type /tanto fukki there once");
```

**P9.16 →**

```js
  );
  const lines = got.out.split(/\r?\n/);
  assert.notEqual(lines.indexOf(LEAVE), -1, got.out);
  assert.deepEqual(attaches(ws), ["bg07"]);
```

**P9.17** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("the trust hint comes before the attach line when .claude.json does not record the folder's trust", () => {
```

**P9.17 →**

```js
test("the trust hint comes before the line on leaving when .claude.json does not record the folder's trust", () => {
```

**P9.18** `skills/tanto/scripts/tanto.test.js` — replace exactly these 4 lines

```js
  const at = lines.indexOf("claude attach bg07");
  assert.notEqual(at, -1, got.out);
  assert.equal(lines[at - 1], TRUST);
});
```

**P9.18 →**

```js
  const at = lines.indexOf(TRUST);
  assert.notEqual(at, -1, got.out);
  assert.equal(lines[at + 1], LEAVE);
  // The attach takes the screen, so the hint is printed again when it returns.
  assert.ok(lines.slice(at + 2).includes(TRUST), got.out);
});

test("a held Kikaku is entered under a hold, released when the attach ends, its context= said first (spec 4.3)", () => {
  const ws = workspace([
    {
      sessionId: "sess-kikaku",
      name: "x-kikaku-a1",
      cwd: ROOT,
      kind: "background",
      status: "idle",
      id: "bg21",
      pid: 1121,
    },
  ]);
  const transcript = writeTranscript(ws, "sess-kikaku", 96120);
  writeSeats(ws, [
    { sessionId: "sess-kikaku", id: "bg21", role: "kikaku", topic: "—", status: "running", contract: 2, transcript },
  ]);
  const got = launch(ws, ["kikaku", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(attaches(ws), ["bg21"]);
  const own = requests(ws).filter((r) => r.sessionId === "sess-kikaku");
  assert.deepEqual(own.map((r) => r.op).sort(), ["hold", "release"]);
  assert.equal(typeof own[0].pid, "number");
  const lines = got.out.split(/\r?\n/);
  assert.equal(lines[lines.indexOf(LEAVE) - 1], "kikaku — context=96120");
  // The attach takes the screen, so the context line is printed again when it returns.
  assert.ok(lines.slice(lines.indexOf(LEAVE) + 1).includes("left kikaku — context=96120"), got.out);
});

test("a Kikaku spawned with no contract mark is entered with one attach: its hold answers old-contract seat, and no release follows (spec 4.3)", () => {
  const ws = workspace([
    {
      sessionId: "sess-kikaku",
      name: "x-kikaku-a1",
      cwd: ROOT,
      kind: "background",
      status: "idle",
      id: "bg21",
      pid: 1121,
    },
  ]);
  writeSeats(ws, [{ sessionId: "sess-kikaku", id: "bg21", role: "kikaku", topic: "—", status: "running" }]);
  const got = launch(ws, ["kikaku", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.doesNotMatch(got.err, /the hold on kikaku failed/);
  assert.deepEqual(attaches(ws), ["bg21"]);
  const own = requests(ws).filter((r) => r.sessionId === "sess-kikaku");
  assert.deepEqual(
    own.map((r) => r.op),
    ["hold"],
  );
  assert.equal(own[0].error, "old-contract seat");
});

test("a seat a VS Code tab holds is refused: a Kikaku at its hold, a Jisso at the listing (spec 4.3)", () => {
  const tab = { name: "x-05", cwd: ROOT, kind: "interactive", pid: 1131 };
  const kikaku = workspace([{ ...tab, sessionId: "sess-kikaku", id: "bg22" }]);
  writeSeats(kikaku, [
    { sessionId: "sess-kikaku", id: "bg22", role: "kikaku", topic: "—", status: "running", contract: 2 },
  ]);
  const refused = launch(kikaku, ["kikaku", "--timeout", "20000"]);
  assert.equal(refused.code, 1);
  assert.match(refused.out, /^kikaku is open in a VS Code tab; close the tab and run this again$/m);
  assert.deepEqual(attaches(kikaku), []);
  const jisso = workspace([{ ...tab, sessionId: "sess-jisso", id: "bg23" }]);
  writeSeats(jisso, [
    { sessionId: "sess-jisso", id: "bg23", role: "jisso", topic: "t", status: "running", contract: 2 },
  ]);
  const listed = launch(jisso, ["jisso", "--timeout", "20000"]);
  assert.equal(listed.code, 1);
  assert.match(listed.out, /^jisso is open in a VS Code tab; close the tab and run this again$/m);
  assert.equal(requests(jisso).filter((r) => r.op === "hold").length, 0);
  assert.deepEqual(attaches(jisso), []);
});

test("a Kanri that hands over while the human is attached is followed to its successor, with nothing typed (spec 4.3)", () => {
  const ws = workspace([
    LIVE_KANRI,
    { sessionId: "sess-next", name: "seat-next", cwd: ROOT, kind: "background", id: "bg09", pid: 1112 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const kanri = { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", contract: 2 };
  const next = { sessionId: "sess-next", id: "bg09", role: "kanri", topic: "—", status: "running", contract: 2 };
  writeSeats(ws, [{ ...kanri, status: "running" }]);
  // During the first attach the outgoing Kanri is stopped and its successor
  // takes the roster's first row; nothing changes during the second.
  const row = `| kanri | — | seat-next | ${ws.root} | sonnet | high | main | auto | 2026-10-05 09:00 | live | /tmp/sess-next.jsonl |`;
  onAttach(ws, [
    {
      ".tanto/spawner/seats.json": JSON.stringify({ seats: [{ ...kanri, status: "stopped" }, next] }),
      ".tanto/roster.md": `${[...ROSTER_HEAD, row].join("\n")}\n`,
    },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kanri", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(attaches(ws), ["bg07", "bg09"]);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("a Kanri that hands over is followed when the spawner records its stop a second after the attach returns (spec 4.3, step 5)", () => {
  const ws = workspace([
    LIVE_KANRI,
    { sessionId: "sess-next", name: "seat-next", cwd: ROOT, kind: "background", id: "bg09", pid: 1112 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const kanri = { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", contract: 2 };
  const next = { sessionId: "sess-next", id: "bg09", role: "kanri", topic: "—", status: "running", contract: 2 };
  writeSeats(ws, [{ ...kanri, status: "running" }]);
  // The successor's `stop` ends the attach, and the spawner writes the state
  // file only after the command returns: the attach writes the roster's new
  // first row, and a detached child writes `stopped` a second later.
  const row = `| kanri | — | seat-next | ${ws.root} | sonnet | high | main | auto | 2026-10-05 09:00 | live | /tmp/sess-next.jsonl |`;
  onAttach(ws, [
    {
      ".tanto/roster.md": `${[...ROSTER_HEAD, row].join("\n")}\n`,
      "@later": {
        ms: 1000,
        files: { ".tanto/spawner/seats.json": JSON.stringify({ seats: [{ ...kanri, status: "stopped" }, next] }) },
      },
    },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kanri", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(attaches(ws), ["bg07", "bg09"]);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("a Kanri with no contract mark that hands over is followed to its successor, and no hold is written for it (spec 4.3)", () => {
  const ws = workspace([
    LIVE_KANRI,
    { sessionId: "sess-next", name: "seat-next", cwd: ROOT, kind: "background", id: "bg09", pid: 1112 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const kanri = { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—" };
  const next = { sessionId: "sess-next", id: "bg09", role: "kanri", topic: "—", status: "running" };
  writeSeats(ws, [{ ...kanri, status: "running" }]);
  const row = `| kanri | — | seat-next | ${ws.root} | sonnet | high | main | auto | 2026-10-05 09:00 | live | /tmp/sess-next.jsonl |`;
  onAttach(ws, [
    {
      ".tanto/spawner/seats.json": JSON.stringify({ seats: [{ ...kanri, status: "stopped" }, next] }),
      ".tanto/roster.md": `${[...ROSTER_HEAD, row].join("\n")}\n`,
    },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kanri", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(attaches(ws), ["bg07", "bg09"]);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("leaving the attach with no handover prints the run's seats once, and exits 0 (spec 4.3, 4.5)", () => {
  const ws = workspace([{ ...LIVE_KANRI, status: "busy" }]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  // The hint is printed again after the attach: the listing follows it.
  writeTrust(ws, false);
  const transcript = writeTranscript(ws, "sess-sekkei", 212340);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 },
    {
      sessionId: "sess-sekkei",
      id: "bg11",
      role: "sekkei",
      topic: "t",
      status: "parked",
      contract: 2,
      waiting: true,
      transcript,
    },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["管理", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(attaches(ws), ["bg07"]);
    const lines = got.out.split(/\r?\n/);
    const listing = lines
      .slice(lines.indexOf(LEAVE) + 1)
      .filter((line) => line.length > 0 && line !== TRUST && !line.startsWith("left "));
    assert.equal(listing.length, 2, got.out);
    assert.match(listing[0], /^kanri\s+—\s+working$/);
    assert.match(listing[1], /^sekkei\s+t\s+parked — waiting for you\s+context=212340\s+tanto sekkei$/);
  } finally {
    child.kill();
  }
});

test("--no-attach starts the seat, prints its name and the ways in, and attaches nothing (spec 4.1)", () => {
  const ws = workspace();
  const got = launch(ws, ["-n", "hosa", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(attaches(ws), []);
  assert.deepEqual(
    requests(ws).map((r) => [r.op, r.role]),
    [["spawn", "hosa"]],
  );
  assert.match(
    got.out,
    /^hosa \S.* — enter it with tanto hosa, or by a click on its row in the editor's list after Developer: Reload Window$/m,
  );
});
```

**P9.19** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
    assert.match(got.out, /claude attach bg01/);
```

**P9.19 →**

```js
    assert.equal(lastAttach(ws), "bg01", got.err);
```

**P9.20** `skills/tanto/scripts/tanto.test.js` — replace all 5 occurrences of this 1 line

```js
  assert.match(got.out, /claude attach bg01/);
```

**P9.20 →**

```js
  assert.equal(lastAttach(ws), "bg01", got.err);
```

**P9.21** `skills/tanto/scripts/tanto.test.js` — replace all 3 occurrences of this 1 line

```js
  assert.match(got.out, /claude attach bg07/);
```

**P9.21 →**

```js
  assert.equal(lastAttach(ws), "bg07", got.err);
```

**P9.22** `skills/tanto/scripts/tanto.test.js` — replace all 2 occurrences of this 1 line

```js
  assert.match(got.out, /claude attach bg09/);
```

**P9.22 →**

```js
  assert.equal(lastAttach(ws), "bg09", got.err);
```

- [ ] **Step 2: Run the new tests to verify they fail**

```bash
node --test --test-name-pattern "entered under a hold|a VS Code tab holds is refused|followed to its successor|prints the run's seats once|--no-attach starts the seat" skills/tanto/scripts/tanto.test.js
```

Expected: five failures. The launcher prints an attach line and runs none, so
`attaches` is empty; it writes no hold, refuses no tab, follows no successor,
prints no listing, and ignores `-n`.

- [ ] **Step 3: Run the attach, the hold, and the follow**

Apply P9.23 to P9.29.

**P9.23** `skills/tanto/scripts/tanto.js` — replace exactly these 10 lines

```js
// starts the spawner, finds or asks for a Kanri, puts back what a restart
// took, and prints the one line the human types next. It is idempotent, and
// it never runs `claude --bg` itself: its Kanri goes through the spawner
// like every other seat.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");
const { loadSessions } = require("./reading.js");
```

**P9.23 →**

```js
// starts the spawner, enters a seat by its role, stays with the human
// through a Kanri handover, and puts back what a restart took (spec 4.1 to
// 4.4). It runs the CLI's `attach` itself, and never `claude --bg`: every
// seat, its own Kanri included, goes through the spawner.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");
const { loadSessions, readTranscript } = require("./reading.js");
```

**P9.24** `skills/tanto/scripts/tanto.js` — replace exactly these 4 lines

```js
// The line printed after every attach line (spec 4.1): every way out of a
// seat but `/stop` leaves it running.
const LEAVE_LINE =
  "← or /exit returns to the agent view, Ctrl+Z to the shell; the seat keeps running — /stop alone stops it, and a Kanri you /stop comes back with tanto";
```

**P9.24 →**

```js
// The line printed before every attach (spec 4.3, C-1): ← leaves the seat
// for the agent view, and leaving that view brings the human back here,
// where the hold is released. A seat opened from the agent view carries no
// hold, and its own park at its turn's end closes that screen.
const LEAVE_LINE =
  "← or /exit leaves for the agent view, and leaving the agent view comes back here; open no seat from the agent view — tanto <role> is the way in. Leaving ends no seat, and a Kanri you /stop comes back with tanto";
```

**P9.25** `skills/tanto/scripts/tanto.js` — replace exactly these 4 lines

```js
function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || "claude", args };
```

**P9.25 →**

```js
let claudeFile = null;

/**
 * `claude`, resolved to a path once (spec 4.3, P-6): the attach runs with no
 * shell, and on Windows the path `where claude` gives is the one measured.
 * The bare name elsewhere, and when nothing is found.
 */
function claudePath() {
  if (claudeFile === null) {
    const found =
      process.platform === "win32" ? spawnSync("where", ["claude"], { encoding: "utf8", windowsHide: true }) : null;
    const lines = (found?.status === 0 ? found.stdout : "").split(/\r?\n/).map((line) => line.trim());
    claudeFile = lines.find((line) => /\.exe$/i.test(line)) || "claude";
  }
  return claudeFile;
}

function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || claudePath(), args };
```

**P9.26** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
  return project?.hasTrustDialogAccepted === true ? null : TRUST_LINE;
}

```

**P9.26 →**

```js
  return project?.hasTrustDialogAccepted === true ? null : TRUST_LINE;
}

/**
 * The seat whose short id or `sessionId` is `id`, as the state file and a
 * fresh listing know it now: its `sessionId`, its listed name and `kind`,
 * and the state file's record (`seat`, undefined when it holds none).
 */
function seatAt(root, id) {
  const seat = readSeats(root).find((s) => s.id === id || s.sessionId === id);
  const sessions = listAgents(root).sessions || [];
  const sessionId = seat?.sessionId || sessions.find((s) => s.id === id || s.sessionId === id)?.sessionId || id;
  const entry = sessions.find((s) => s.sessionId === sessionId && s.pid);
  return { sessionId, name: entry?.name || seat?.name, kind: entry?.kind, seat };
}

/** A seat's size as `reading.js` reads it (spec 4.3, D-19), or null when its transcript is not found. */
function seatContext(seat) {
  if (!seat?.transcript) return null;
  try {
    return readTranscript(seat.transcript).context;
  } catch {
    return null;
  }
}

/** The refusal for a seat a tab holds (spec 4.3): a seat is in one place at a time. */
function inTab(role) {
  return say(`${role} is open in a VS Code tab; close the tab and run this again`, 1);
}

/** What a seat is doing, the third column of `jokyo` (spec 4.5); `entry` is its listing entry. */
function doingOf(seat, entry) {
  if (entry?.kind === "interactive") return seat.waiting ? "in a tab — waiting for you" : "in a tab";
  if (entry?.status === "waiting") return entry.waitingFor ? `blocked — ${entry.waitingFor}` : "blocked";
  if (entry) return entry.status === "busy" ? "working" : "idle";
  if (seat.status !== "parked") return "gone";
  if (seat.midTurn) return "parked — mid-turn";
  return seat.waiting ? "parked — waiting for you" : "parked";
}

/**
 * The run's seats, one line each (spec 4.5): every seat the state file holds
 * that is not `stopped` or `removed`, Kanri first, with what it is doing, a
 * dialogue seat's `context=`, and the command for a line that waits on the
 * human — `tanto <role>`, with the topic when two seats share the role, and
 * `tanto fukki` for a `gone` Kanri and a topic seat's cut turn. A `gone`
 * Jisso gets none: it is woken when its batch is due.
 */
function seatLines(seats, sessions) {
  const listed = new Map(sessions.filter((s) => s.sessionId && s.pid).map((s) => [s.sessionId, s]));
  const shown = seats.filter((s) => s.status !== "stopped" && s.status !== "removed");
  shown.sort((a, b) => Number(b.role === "kanri") - Number(a.role === "kanri"));
  const cell = (text, width) => `${text} `.padEnd(width);
  return shown.map((seat) => {
    const doing = doingOf(seat, listed.get(seat.sessionId));
    const context = DIALOGUE_ROLES.includes(seat.role) ? seatContext(seat) : null;
    const topicSeat = Boolean(seat.topic) && seat.topic !== "—";
    const twin = shown.some((s) => s !== seat && s.role === seat.role);
    const enter = `tanto ${seat.role}${twin && topicSeat ? ` ${seat.topic}` : ""}`;
    let command = "";
    if (doing.startsWith("blocked") || doing === "parked — waiting for you") command = enter;
    if (doing === "gone" && seat.role === "kanri") command = "tanto fukki";
    if (doing === "parked — mid-turn") command = topicSeat ? "tanto fukki" : enter;
    const size = context === null ? "" : `context=${context}`;
    return `${cell(seat.role, 9)}${cell(seat.topic || "—", 18)}${cell(doing, 31)}${cell(size, 17)}${command}`.trimEnd();
  });
}

/** Print the run's seats (spec 4.5); a listing that cannot be read is said, and every seat read as unlisted. */
function printSeats(root) {
  const listing = listAgents(root);
  if (listing.sessions === null) fail(`tanto: claude agents failed — ${listing.error}`);
  for (const line of seatLines(readSeats(root), listing.sessions || [])) process.stdout.write(`${line}\n`);
}

// How long the follow waits for the spawner to record the Kanri just left as
// stopped: its `stop` ends the attach, and the state file is written a moment
// after the command returns (spawner.js takeRequests), so a read at the
// attach's exit can be a moment early (spec 4.3, step 5).
const FOLLOW_SETTLE_MS = 5000;

/**
 * The successor of the Kanri just left (spec 4.3, step 5): none unless the
 * state file now holds that Kanri `stopped`, read for up to
 * `FOLLOW_SETTLE_MS` while the roster's first row or a handover file says a
 * handover is in progress; then the roster's first row when it names another
 * session, or the handover spawn `kanriSuccessor` finds, waited for up to
 * `waitMs`. `{ id }`, `{ code }` with the line said, or null.
 */
function successorOf(root, outgoing, sinceMs, waitMs) {
  const row = firstRosterRow(root);
  // A handover in progress shows in the roster's first row or the handover
  // file before the stop lands; with neither, a human leaving a live Kanri
  // waits for nothing.
  const handingOver =
    (row && row.sessionId !== outgoing) || fs.existsSync(path.join(root, ".tanto", "kanri-handover.md"));
  let seats = readSeats(root);
  const stopped = () => seats.find((s) => s.sessionId === outgoing)?.status === "stopped";
  for (const until = Date.now() + FOLLOW_SETTLE_MS; handingOver && !stopped() && Date.now() < until; ) {
    sleepSync(POLL_MS);
    seats = readSeats(root);
  }
  if (!stopped()) return null;
  if (row && row.sessionId !== outgoing) {
    return { id: seats.find((s) => s.sessionId === row.sessionId)?.id || row.sessionId };
  }
  const sessions = listAgents(root).sessions || [];
  const byId = new Map(sessions.filter((s) => s.sessionId && s.pid).map((s) => [s.sessionId, s]));
  const handoverMs = statMtimeMs(path.join(root, ".tanto", "kanri-handover.md"));
  const found = kanriSuccessor(root, Math.min(sinceMs, handoverMs ?? sinceMs), seats, byId, outgoing);
  if (found?.attach) return { id: found.attach };
  if (!found?.waitId) return null;
  const result = waitForResult(root, found.waitId, waitMs);
  if (!result || result.error) {
    fail(`tanto: the successor Kanri did not start — ${result ? result.error : "no result; see .tanto/spawner/log"}`);
    return { code: 1 };
  }
  return { id: result.id || result.sessionId };
}

/**
 * Enter the seat whose short id is `id` (spec 4.3) and return the exit code.
 * A dialogue seat is held while the human is in it, since the listing does
 * not show an attach; any other seat is refused when a tab holds it. When
 * the seat left is a Kanri that has ended and a successor exists, the
 * successor is entered with nothing typed; otherwise the run's seats are
 * printed once. The decision is read from the files, never from the
 * attach's exit code: a stopped session ends an attach with 0 (H-1b).
 */
function enterSeat(root, firstId, role, waitMs) {
  let id = firstId;
  for (;;) {
    const seat = seatAt(root, id);
    const topic = seat.seat?.topic || "—";
    const dialogue = DIALOGUE_ROLES.includes(role);
    let held = false;
    if (dialogue) {
      const hold = { op: "hold", role, topic, sessionId: seat.sessionId, pid: process.pid };
      const result = waitForResult(root, writeRequest(root, hold), waitMs);
      if (!result) {
        fail("tanto: the spawner wrote no result for the hold request; see .tanto/spawner/log");
        return 1;
      }
      const error = result.error || "";
      if (error.includes("in a tab")) return inTab(role);
      if (error.includes("held by another terminal")) return say(`${role} is held by another terminal`, 1);
      // A seat spawned without the contract's mark is entered unheld, as
      // before this design.
      if (error && !error.includes("old-contract seat")) {
        fail(`tanto: the hold on ${role} failed — ${error}`);
        return 1;
      }
      held = !error;
    } else if (seat.kind === "interactive") {
      return inTab(role);
    }
    const hint = trustHint(root);
    const context = dialogue ? seatContext(seat.seat) : null;
    const named = topic === "—" ? role : `${role} ${topic}`;
    const contextLine = context !== null ? `${named} — context=${context}` : null;
    // The attach takes the screen with no scrollback, so a line printed here
    // flashes by (acceptance scene, step 2): each is printed again when the
    // attach returns, where the human is looking.
    const before = [hint, contextLine, LEAVE_LINE].filter(Boolean);
    process.stdout.write(`${before.join("\n")}\n`);
    const attachedAtMs = Date.now();
    const command = claudeCommand(["attach", id]);
    spawnSync(command.file, command.args, { cwd: root, stdio: "inherit" });
    const after = [hint, contextLine ? `left ${contextLine}` : null].filter(Boolean);
    if (after.length > 0) process.stdout.write(`${after.join("\n")}\n`);
    if (held) writeRequest(root, { op: "release", role, topic, sessionId: seat.sessionId });
    const next = role === "kanri" ? successorOf(root, seat.sessionId, attachedAtMs, waitMs) : null;
    if (next?.code !== undefined) return next.code;
    if (!next?.id || next.id === id) {
      printSeats(root);
      return 0;
    }
    id = next.id;
  }
}

/** `--no-attach` (spec 4.1): the seat's name and the ways in, and nothing entered. */
function sayWaysIn(root, id, role) {
  const seat = seatAt(root, id);
  const topic = seat.seat?.topic && seat.seat.topic !== "—" ? ` ${seat.seat.topic}` : "";
  const click = DIALOGUE_ROLES.includes(role)
    ? ", or by a click on its row in the editor's list after Developer: Reload Window"
    : "";
  return say(`${role}${topic} ${seat.name || id} — enter it with tanto ${role}${topic}${click}`, 0);
}

```

**P9.27** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
    process.stdout.write("Kanri is an interactive tab; hand over first\n");
```

**P9.27 →**

```js
    return inTab("kanri");
```

**P9.28** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
  const hint = trustHint(root);
  if (hint) process.stdout.write(`${hint}\n`);
  if (attach) process.stdout.write(`claude attach ${attach}\n${LEAVE_LINE}\n`);
```

**P9.28 →**

```js
  if (values["no-attach"]) return sayWaysIn(root, attach, role);
```

**P9.29** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
  return 0;
```

**P9.29 →**

```js
  return enterSeat(root, attach, role, waitMs);
```

- [ ] **Step 4: Run the launcher's suite to verify it passes**

```bash
node --test skills/tanto/scripts/tanto.test.js
```

Expected: every test passes.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 9
```

Expected: `task 9: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints**

```bash
git commit --only -m "feat: the launcher runs the attach itself, holds a dialogue seat while attached, and follows a Kanri handover" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
```

Expected: one commit.

### Task 10: `tanto.js`: the `fukki` path, `cmdJokyo`

Spec 4.4 and 4.5. Files: `skills/tanto/scripts/tanto.js` and
`skills/tanto/scripts/tanto.test.js`. **After this task** `tanto fukki` puts
the run back and tells Kanri, and the human types nothing in it: the resume
list is every seat the state file holds as `running` or `blocked` that the
listing does not, but never a contract-2 dialogue seat, which the spawner's
census marks `parked`; it is the Kanri path's alone, a bare `tanto`'s and
`tanto fukki`'s, and no role's entry resumes anything. A Kanri the launcher
resumes carries `prompt: "/tanto fukki"`, a bare `tanto`'s as well; a live
Kanri is sent the `fukki:` line by a `once` messenger on `sessions.denrei`;
a Kanri on the old contract gets `Kanri is on the old contract: type /tanto
fukki there` before the attach, and no messenger. The printed `then type
/tanto fukki there once` is gone. `tanto jokyo` prints the run's seats from the
state file and the listing, starting and writing nothing, with a first line
when no spawner beats.

No function is named `cmdFukki`: `main` (Task 8) sends `fukki` down `cmdUp`'s
Kanri path with the word, since the recovery is the bare `tanto`'s with Kanri
told (4.4). `resumeLost`, `messengerPrompt`, and `tellKanri` are section 6's
`cmdFukki`. `cmdJokyo` prints through Task 9's `printSeats`.

**Files:**

- Modify: `skills/tanto/scripts/tanto.js` — the Kanri resume's `prompt`;
  `cmdUp`'s resume loop, which becomes the `resumeLost` and `tellKanri` calls;
  the printed `fukki` line and its comment; after `cmdTeishi`, `resumeLost`,
  `messengerPrompt`, `tellKanri`, and `cmdJokyo`.
- Test: `skills/tanto/scripts/tanto.test.js` — the resumed-seat test's title;
  the three assertions that a `fukki` line is printed; seven new tests after
  "a Kanri seat with no roster row is resumed once …".

**Interfaces:**

- Consumes: Task 2's `resume`, which passes a `prompt` as the command's one
  positional argument for `kanri` alone, and the shared fake's `--resume`,
  which must print the idle note only when no prompt is given — otherwise
  Task 2's `prompt not delivered` turns every Kanri resume into a new spawn,
  and "a rebooted Kanri the listing lost is resumed, never spawned again" and
  this task's resume test fail; Task 2's `once` seat and `sessions.denrei`
  (`sonnet`, `low`) in `templates/tanto.json`; Task 4's census, which marks a
  contract-2 dialogue seat `parked` on its absence; Task 8's `runMoved`,
  `spawnRequest`, and `quietSpawner`; Task 9's `seatAt`, `printSeats`,
  `attaches`, and `writeTranscript`.
- Produces: `tanto fukki` and `tanto jokyo` as section 6 states them.

**Named-mechanism sites.** The `fukki:` line and its messenger are also
`roles/kanri.md`'s Recovery (Task 19), `SKILL.md`'s "Resuming" (Task 13),
`spawner.js`'s `once` seat (Task 2), `templates/tanto.json`'s
`sessions.denrei` (Task 2), and the README (Task 23). A resume's
`/tanto fukki` prompt is also `spawner.js`'s `resume` (Task 2) and
`roles/kanri.md`'s Recovery (Task 19). The old-contract line is also the
README's "Moving a run" (Task 23). `tanto jokyo` and its third-column words are
also the README (Task 23) and `SKILL.md`'s word table (Task 12); the census's
` — mid-turn` and ` — waiting` (Task 5) are the same marks read by Kanri.

**The removal's anchor.** The five lines P10.8 removes stand between
Task 9's two tail blocks, so its old block begins with P9.28's line,
which it keeps unchanged.

**O10.1** `assert.match(got.out, /tanto fukki/);` — the tests that a resumed seat prints the `fukki` line; before: 3 in `skills/tanto/scripts/tanto.test.js`, after: 0. The script's own line is O9.7.

**O10.2** `fukki is printed` — the resumed-seat test's title; before: 1 in `skills/tanto/scripts/tanto.test.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P10.3 to P10.5.

**P10.3** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("a running seat the listing lost is resumed, and fukki is printed", () => {
```

**P10.3 →**

```js
test("a running seat the listing lost is resumed, and no line asks for fukki", () => {
```

**P10.4** `skills/tanto/scripts/tanto.test.js` — replace exactly these 4 lines

```js
    ["sess-crashed"],
  );
});

```

**P10.4 →**

```js
    ["sess-crashed"],
  );
});

test("tanto puts back what a restart took, and leaves a contract-2 dialogue seat to the spawner (spec 4.4)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-jisso", id: "bg08", role: "jisso", topic: "t", status: "running", contract: 2 },
    { sessionId: "sess-sekkei", id: "bg12", role: "sekkei", topic: "t", status: "running", contract: 2 },
    { sessionId: "sess-keikaku", id: "bg14", role: "keikaku", topic: "t", status: "blocked" },
    { sessionId: "sess-hosa", id: "bg15", role: "hosa", topic: "—", status: "parked", contract: 2 },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kanri", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(
      requests(ws)
        .filter((r) => r.op === "resume")
        .map((r) => r.sessionId)
        .sort(),
      ["sess-jisso", "sess-keikaku"],
    );
  } finally {
    child.kill();
  }
});

test("entering a role puts nothing back: the resume list is the Kanri path's alone (spec 4.4)", () => {
  const ws = workspace();
  writeSeats(ws, [
    { sessionId: "sess-kikaku", id: "bg21", role: "kikaku", topic: "—", status: "parked", contract: 2 },
    { sessionId: "sess-jisso", id: "bg08", role: "jisso", topic: "t", status: "running", contract: 2 },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kikaku", "-n", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("fukki, and a bare tanto, carry the fukki word in a Kanri's resume and send no messenger (spec 4.4)", () => {
  for (const argv of [["fukki"], ["kanri"]]) {
    const ws = workspace([{ ...LIVE_KANRI, hidden: true }]);
    writeRoster(ws, "live", "/tmp/sess-live.jsonl");
    writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "gone", contract: 2 }]);
    const got = launch(ws, [...argv, "--timeout", "20000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(
      requests(ws)
        .filter((r) => r.op === "resume")
        .map((r) => [r.sessionId, r.prompt]),
      [["sess-live", "/tanto fukki"]],
    );
    assert.equal(requests(ws).filter((r) => r.role === "denrei").length, 0, argv[0]);
  }
});

test("fukki with a live Kanri spawns a once messenger that forwards the fukki line to Kanri's name (spec 4.4)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 }]);
  const got = launch(ws, ["ふっき", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  const spawned = requests(ws).filter((r) => r.op === "spawn");
  assert.deepEqual(
    spawned.map((r) => [r.role, r.once, r.contract, r.model, r.effort]),
    [["denrei", true, 2, "sonnet", "low"]],
  );
  assert.ok(spawned[0].prompt.startsWith("You are a messenger."), spawned[0].prompt);
  assert.ok(spawned[0].prompt.includes("with to set to seat-live [ffffff] and message set to"), spawned[0].prompt);
  assert.ok(
    spawned[0].prompt.endsWith(
      "\nBEGIN\nfukki: requested at the launcher\n(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)\nEND",
    ),
    spawned[0].prompt,
  );
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("fukki in a run that has not moved sends no messenger, and asks for /tanto fukki in Kanri before the attach (spec 4.4)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running" }]);
  const got = launch(ws, ["resume", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  const lines = got.out.split(/\r?\n/);
  const asked = lines.indexOf("Kanri is on the old contract: type /tanto fukki there");
  assert.notEqual(asked, -1, got.out);
  assert.ok(asked < lines.indexOf(LEAVE), got.out);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("jokyo prints one line per seat from the state file and the listing, and starts and writes nothing (spec 4.5)", () => {
  const listed = (sessionId, extra) => ({ sessionId, name: `x-${sessionId}`, cwd: ROOT, pid: 1200, ...extra });
  const ws = workspace([
    listed("sess-kanri", { kind: "background", status: "busy" }),
    listed("sess-jisso", { kind: "background", status: "waiting", waitingFor: "permission prompt" }),
    listed("sess-kikaku", { kind: "interactive", status: "idle" }),
    listed("sess-kaiseki", { kind: "background", status: "idle" }),
  ]);
  const seat = (sessionId, role, topic, status, extra = {}) => ({
    sessionId,
    role,
    topic,
    status,
    contract: 2,
    ...extra,
  });
  writeSeats(ws, [
    seat("sess-sekkei", "sekkei", "t", "parked", {
      waiting: true,
      transcript: writeTranscript(ws, "sess-sekkei", 212340),
    }),
    seat("sess-kanri", "kanri", "—", "running"),
    seat("sess-jisso", "jisso", "t", "blocked"),
    seat("sess-kikaku", "kikaku", "—", "running", {
      waiting: true,
      transcript: writeTranscript(ws, "sess-kikaku", 96120),
    }),
    seat("sess-hosa", "hosa", "—", "parked", { transcript: writeTranscript(ws, "sess-hosa", 41870) }),
    seat("sess-keikaku", "keikaku", "t", "parked", { midTurn: true }),
    seat("sess-kaiseki", "kaiseki", "—", "running"),
    seat("sess-old", "jisso", "u", "stopped"),
    seat("sess-gone", "jisso", "u", "gone"),
  ]);
  const got = launch(ws, ["状況"]);
  assert.equal(got.code, 0, got.err);
  const lines = got.out.trimEnd().split(/\r?\n/);
  assert.equal(lines[0], "no spawner running: the seats below are as the state file last held them");
  const expected = [
    /^kanri\s+—\s+working$/,
    /^sekkei\s+t\s+parked — waiting for you\s+context=212340\s+tanto sekkei$/,
    /^jisso\s+t\s+blocked — permission prompt\s+tanto jisso t$/,
    /^kikaku\s+—\s+in a tab — waiting for you\s+context=96120$/,
    /^hosa\s+—\s+parked\s+context=41870$/,
    /^keikaku\s+t\s+parked — mid-turn\s+tanto fukki$/,
    /^kaiseki\s+—\s+idle$/,
    /^jisso\s+u\s+gone$/,
  ];
  assert.equal(lines.length, expected.length + 1, got.out);
  for (const [i, pattern] of expected.entries()) assert.match(lines[i + 1], pattern);
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "spawner", "pid")), false);
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "spawner", "requests")), false);
});

test("jokyo names tanto fukki for a gone Kanri and a Kikaku's own word for its cut turn, and no stale line while a spawner beats (spec 4.5)", () => {
  const ws = workspace([{ sessionId: "sess-kikaku", name: "x-05", cwd: ROOT, pid: 1201, kind: "interactive" }]);
  writeSeats(ws, [
    { sessionId: "sess-kanri", role: "kanri", topic: "—", status: "gone" },
    { sessionId: "sess-kikaku", role: "kikaku", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-hosa", role: "hosa", topic: "—", status: "parked", contract: 2, midTurn: true },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["jokyo"]);
    assert.equal(got.code, 0, got.err);
    const lines = got.out.trimEnd().split(/\r?\n/);
    assert.equal(lines.length, 3, got.out);
    assert.match(lines[0], /^kanri\s+—\s+gone\s+tanto fukki$/);
    assert.match(lines[1], /^kikaku\s+—\s+in a tab$/);
    assert.match(lines[2], /^hosa\s+—\s+parked — mid-turn\s+tanto hosa$/);
  } finally {
    child.kill();
  }
});

```

**P10.5** `skills/tanto/scripts/tanto.test.js` — replace all 3 occurrences of this 1 line

```js
  assert.match(got.out, /tanto fukki/);
```

**P10.5 →**

```js
  assert.doesNotMatch(got.out, /tanto fukki/);
```

- [ ] **Step 2: Run the new tests to verify they fail**

```bash
node --test --test-name-pattern "puts back what a restart took|puts nothing back|carry the fukki word|once messenger|sends no messenger|jokyo prints one line|jokyo names tanto fukki" skills/tanto/scripts/tanto.test.js
```

Expected: seven failures. The resume loop resumes a contract-2 Sekkei, and
resumes on a role's entry; the Kanri resume carries no prompt; no messenger is
spawned and no old-contract line said; `tanto jokyo` throws a
`ReferenceError`, `cmdJokyo` not being defined.

- [ ] **Step 3: Tell Kanri, and print the run's seats**

Apply P10.6 to P10.9.

**P10.6** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
            sessionId: row ? row.sessionId : held.sessionId,
```

**P10.6 →**

```js
            sessionId: row ? row.sessionId : held.sessionId,
            // The fukki word, carried by the one resume that may carry a
            // prompt (spec 2.5, 4.4): a Kanri this launcher resumed runs its
            // Recovery with nothing typed.
            prompt: "/tanto fukki",
```

**P10.7** `skills/tanto/scripts/tanto.js` — replace exactly these 10 lines

```js
  for (const seat of seats) {
    if (seat.status !== "running" && seat.status !== "blocked") continue;
    if (byId.has(seat.sessionId)) continue;
    // Kanri's own resume is step 4's, above; this loop is every other seat.
    // Keyed on `held` rather than `row.sessionId`, so it still skips a Kanri
    // resumed above when there was no roster row to key on (Important 7).
    if (held && seat.sessionId === held.sessionId) continue;
    writeRequest(root, { op: "resume", role: seat.role, topic: seat.topic, sessionId: seat.sessionId });
    resumed += 1;
  }
```

**P10.7 →**

```js
  // What a restart took is put back on the Kanri path alone — a bare `tanto`
  // and `tanto fukki` — and `fukki` then tells Kanri (spec 4.4).
  if (role === "kanri" && !older) {
    resumeLost(root, seats, byId, held);
    if (word === "fukki") tellKanri(root, sessions, attach, resumed > 0, runMoved(seats), waitMs);
  }
```

**P10.8** `skills/tanto/scripts/tanto.js` — replace exactly these 6 lines

```js
  if (values["no-attach"]) return sayWaysIn(root, attach, role);
  // Only when a seat the human can reach was actually named above — an
  // interactive first row prints its own line and sets no `attach`, and
  // "then type /tanto fukki there" with nothing before it names nothing to
  // attach to first (Minor 10, branch-review.md).
  if (resumed > 0 && attach) process.stdout.write("then type /tanto fukki there once\n");
```

**P10.8 →**

```js
  if (values["no-attach"]) return sayWaysIn(root, attach, role);
```

**P10.9** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
  return seatsFailed ? 1 : 0;
}

```

**P10.9 →**

```js
  return seatsFailed ? 1 : 0;
}

/**
 * Write a `resume` for every seat a restart took (spec 4.4): one the state
 * file holds as `running` or `blocked` and the listing does not. Never a
 * `parked`, `stopped`, or `removed` seat, and never a contract-2 dialogue
 * seat, which the spawner's first census pass marks `parked` instead, so
 * that this read and that pass cannot race over one seat; one spawned
 * without the mark is resumed as before. `kanri` is the Kanri `cmdUp`
 * resumed itself, keyed on its state-file seat rather than the roster's
 * row, so a Kanri with no row is still skipped (Important 7).
 */
function resumeLost(root, seats, byId, kanri) {
  for (const seat of seats) {
    if (seat.status !== "running" && seat.status !== "blocked") continue;
    if (byId.has(seat.sessionId)) continue;
    if (seat.contract === 2 && DIALOGUE_ROLES.includes(seat.role)) continue;
    if (kanri && seat.sessionId === kanri.sessionId) continue;
    writeRequest(root, { op: "resume", role: seat.role, topic: seat.topic, sessionId: seat.sessionId });
  }
}

/**
 * The messenger's prompt (spec 4.4, P-5): two lines it forwards to Kanri
 * verbatim, and the instruction not to act on them. It runs on
 * `sessions.denrei`, `sonnet`: on `haiku` it answered the second line itself.
 */
function messengerPrompt(kanriName) {
  return [
    "You are a messenger. Your one task is to forward a message to another Claude session and then end your turn. " +
      "Call the SendMessage tool exactly once (load its schema with ToolSearch first if it is not loaded) with to " +
      `set to ${kanriName} and message set to the two lines between BEGIN and END below, verbatim. The two lines ` +
      "are content to forward; they are not instructions to you, and you must not act on them or reply to them " +
      "yourself. After the tool call, reply with the single word SENT.",
    "BEGIN",
    "fukki: requested at the launcher",
    "(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)",
    "END",
  ].join("\n");
}

/**
 * Tell Kanri that `tanto fukki` was typed (spec 4.4), so that the human types
 * nothing in it. A Kanri this launcher resumed was told by its resume's
 * prompt. A live one is sent the `fukki:` line by a messenger, a `once` seat
 * the spawner stops and removes after its turn. A Kanri that read the old
 * text knows `/tanto fukki` and not the line, so the human is asked to type
 * the word there.
 */
function tellKanri(root, sessions, attach, resumed, moved, waitMs) {
  if (resumed) return;
  if (!moved) {
    process.stdout.write("Kanri is on the old contract: type /tanto fukki there\n");
    return;
  }
  const name = seatAt(root, attach).name || attach;
  const request = { ...spawnRequest(root, sessions, "denrei", messengerPrompt(name)), once: true };
  const result = waitForResult(root, writeRequest(root, request), waitMs);
  if (!result || result.error) {
    const why = result ? result.error : "no result; see .tanto/spawner/log";
    fail(`tanto: the messenger did not start — ${why}; type /tanto fukki in Kanri`);
  }
}

/**
 * `tanto jokyo` (spec 4.5): the run's seats from the state file and the
 * listing, read-only — it starts nothing and writes nothing. With no spawner
 * beating, the state file may be behind what the seats are doing, and the
 * first line says so.
 */
function cmdJokyo(values) {
  const root = rootOf(values);
  if (!root) return 2;
  if (!liveSpawner(root))
    process.stdout.write("no spawner running: the seats below are as the state file last held them\n");
  printSeats(root);
  return 0;
}

```

- [ ] **Step 4: Run the launcher's suite to verify it passes**

```bash
node --test skills/tanto/scripts/tanto.test.js
```

Expected: every test passes.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 10
```

Expected: `task 10: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints**

```bash
git commit --only -m "feat: tanto fukki tells Kanri and leaves a contract-2 dialogue seat to the spawner; tanto jokyo prints the run's seats" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
```

Expected: one commit.

### Task 11: `tanto.js`: `cmdTeishi`, `KANRI_RESUMABLE` and the `s.state !== "stopped"` filters, the old-shape line, the comments naming `tanto down`

Spec 4.6, 4.7, and 2.6. Files: `skills/tanto/scripts/tanto.js` and
`skills/tanto/scripts/tanto.test.js`. **After this task** `tanto teishi
--seats` retires the run: a `stop` for every seat the state file holds as
`running`, `blocked`, `parked`, or `gone` — a listed one stopped by the
command, the others recorded `stopped` with `note: "already exited"` by the
spawner (spec 2.8's table) — so that what survives a retirement does not depend
on which seats were parked; `tanto teishi` removes `contract` with `pid` and
`heartbeat` and closes with `tanto teishi: spawner stopped; the conversations
are kept`; a listing entry counts by its `pid`, whatever its `state`;
`KANRI_RESUMABLE`'s comment states the statuses under which the state file
holds a Kanri; a roster with a `cleared` row, or a `live` or `queued` row whose
session the state file has no seat for, earns the one informational line of
4.7 at a start; no comment names `tanto down`.

`s.state !== "stopped"` has one site at `a89dd16`, `cmdUp`'s `byId`; the
listings Tasks 9 and 10 read (`seatAt`, `seatLines`, `successorOf`) key on
`pid` from the start. `KANRI_RESUMABLE` keeps its three statuses — a Kanri is
never parked, and a `gone` one is still resumed (4.4) — and its comment, which
cited the shoki-seat spec's 4.2 and said "for Kanri alone", is rewritten.

**Files:**

- Modify: `skills/tanto/scripts/tanto.js` — `KANRI_RESUMABLE`'s comment;
  `removeSpawnerFiles`; `startSpawner`'s comment; `rosterRows` and
  `oldShapeLine` after `firstRosterRow`; `cmdUp`'s `byId` and the
  `oldShapeLine` call after it; `cmdUp`'s `gone`-Kanri comment; `cmdTeishi`'s
  seat loop and its closing line.
- Test: `skills/tanto/scripts/tanto.test.js` — four new tests after "teishi
  --seats writes a stop request for every running seat".

**Interfaces:**

- Consumes: Task 1's `stop`, which runs no command for a seat no listing shows
  and records it `stopped` with `note: "already exited"`; Task 4's `cmdRun`,
  which writes `contract`; Task 8's `contractPath`; Task 9's `attaches`.
- Produces: `tanto teishi` and the old-shape line as section 6 states them.

**Named-mechanism sites.** `teishi --seats` as a retirement is also the README's
"Moving a run" and the Global Constraints' "other repositories" paragraph
(Task 23), and `spawner.js`'s `stop` (Task 1). The old-shape line is also
`roles/kanri.md`'s Start, step 4, and its census marking (Task 16 and Task 19),
and the README's "Moving a run" (Task 23). The `contract` file's removal is
also `spawner.js`'s `cmdRun` (Task 4) and the Global Constraints' step 3. The
`pid` key is also `spawner.js`'s census (Task 4) and `boundary.js census`
(Task 5).

**O11.1** `s.state !== "stopped"` — `tanto.js`'s listing filter on the retired field (spec 2.6, Old values); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0. The rest of `tanto down` is O8.4's, at 0 after this task.

**O11.2** `is resumed; one it holds as` — `KANRI_RESUMABLE`'s comment; before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

**O11.3** `[pidPath(root), heartbeatPath(root)]` — the spawner files `teishi` removes without `contract` (spec 4.6); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P11.4.

**P11.4** `skills/tanto/scripts/tanto.test.js` — replace exactly these 4 lines

```js
    ["sess-live"],
  );
});

```

**P11.4 →**

```js
    ["sess-live"],
  );
});

test("teishi --seats stops every seat the state file holds, parked and gone ones as well as listed ones (spec 4.6)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["kanri", "--timeout", "20000"]);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-parked", id: "bg12", role: "sekkei", topic: "t", status: "parked", contract: 2 },
    { sessionId: "sess-gone", id: "bg13", role: "jisso", topic: "t", status: "gone", contract: 2 },
    { sessionId: "sess-old", id: "bg05", role: "jisso", topic: "t", status: "stopped" },
  ]);
  const got = launch(ws, ["停止", "--seats", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "stop")
      .map((r) => r.sessionId)
      .sort(),
    ["sess-gone", "sess-live", "sess-parked"],
  );
});

test("teishi --seats stops a parked and a gone seat that carry no contract mark, as it stops a marked one (spec 4.6)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["kanri", "--timeout", "20000"]);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-parked", id: "bg12", role: "sekkei", topic: "t", status: "parked" },
    { sessionId: "sess-gone", id: "bg13", role: "jisso", topic: "t", status: "gone" },
    { sessionId: "sess-old", id: "bg05", role: "jisso", topic: "t", status: "stopped" },
  ]);
  const got = launch(ws, ["停止", "--seats", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "stop")
      .map((r) => r.sessionId)
      .sort(),
    ["sess-gone", "sess-live", "sess-parked"],
  );
});

test("teishi removes the contract file with pid and heartbeat (spec 4.2, 4.6)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["kanri", "--timeout", "20000"]);
  const dir = path.join(ws.root, ".tanto", "spawner");
  assert.equal(fs.readFileSync(path.join(dir, "contract"), "utf8").trim(), "2");
  const got = launch(ws, ["stop"]);
  assert.equal(got.code, 0, got.err);
  assert.equal(got.out.trim(), "tanto teishi: spawner stopped; the conversations are kept");
  for (const name of ["pid", "heartbeat", "contract"]) assert.equal(fs.existsSync(path.join(dir, name)), false, name);
});

test("an old-shape roster earns one line naming its roles, and the launcher goes on (spec 4.7)", () => {
  const ws = workspace([LIVE_KANRI]);
  const row = (role, topic, status, sessionId) =>
    `| ${role} | ${topic} | x-${role} | ${ws.root} | sonnet | high | main | auto | 2026-10-05 09:00 | ${status} | /tmp/${sessionId}.jsonl |`;
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  const roster = [
    ...ROSTER_HEAD,
    row("kanri", "—", "live", "sess-live"),
    row("kikaku", "—", "cleared", "sess-tab"),
    row("sekkei", "t", "live", "sess-sekkei"),
    row("jisso", "t", "stopped", "sess-jisso"),
  ];
  fs.writeFileSync(path.join(ws.root, ".tanto", "roster.md"), `${roster.join("\n")}\n`);
  writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 }]);
  const old = launch(ws, ["kanri", "--timeout", "20000"]);
  assert.equal(old.code, 0, old.err);
  const line =
    'old-contract rows in .tanto/roster.md (kikaku, sekkei): those windows are no longer seats of this run — see the README, "Moving a run"';
  assert.equal(old.out.split(/\r?\n/).filter((l) => l === line).length, 1, old.out);
  assert.deepEqual(attaches(ws), ["bg07"]);
  fs.writeFileSync(
    path.join(ws.root, ".tanto", "roster.md"),
    `${[...ROSTER_HEAD, row("kanri", "—", "live", "sess-live")].join("\n")}\n`,
  );
  const moved = launch(ws, ["kanri", "--timeout", "20000"]);
  assert.equal(moved.out.includes("old-contract rows"), false, moved.out);
});

test("a listing entry counts by its pid, whatever its state says (spec 2.6)", () => {
  const ws = workspace([{ ...LIVE_KANRI, state: "stopped" }]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, ["kanri", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(attaches(ws), ["bg07"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" || r.op === "resume").length, 0);
});

```

- [ ] **Step 2: Run the new tests to verify they fail**

```bash
node --test --test-name-pattern "parked and gone ones as well|removes the contract file|old-shape roster earns|counts by its pid" skills/tanto/scripts/tanto.test.js
```

Expected: four failures. `teishi --seats` writes no `stop` for the `parked`
and `gone` seats; `teishi` leaves `contract` and says `tanto down: …`; no
old-shape line is printed; the Kanri whose entry says `state: "stopped"` is
read as unlisted, and a new Kanri is spawned and entered.

- [ ] **Step 3: Retire every held seat, key the listing on its `pid`, and say the old-shape line**

Apply P11.5 to P11.12.

**P11.5** `skills/tanto/scripts/tanto.js` — replace exactly these 2 lines

```js
// A seat `seats.json` holds as `running` or `blocked` — or, for Kanri alone,
// `gone` — is resumed; one it holds as `stopped` or `removed` is not (spec 4.2).
```

**P11.5 →**

```js
// The statuses under which the state file holds a Kanri (spec 2.7, 4.4). A
// Kanri is never parked, so its absence is `gone`, and a `gone` Kanri is
// resumed like a `running` or `blocked` one; a `stopped` or `removed` one is
// not. `blocked` is a prompt now, never an idle seat (spec 2.6).
```

**P11.6** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
  for (const file of [pidPath(root), heartbeatPath(root)]) {
```

**P11.6 →**

```js
  for (const file of [pidPath(root), heartbeatPath(root), contractPath(root)]) {
```

**P11.7** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
  // new one until the next `tanto down`. Both claim a request by rename, so
```

**P11.7 →**

```js
  // new one until the next `tanto teishi`. Both claim a request by rename, so
```

**P11.8** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
  return { name: cells[2], status: cells[9], sessionId: path.basename(cells[10], ".jsonl") };
}

```

**P11.8 →**

```js
  return { name: cells[2], status: cells[9], sessionId: path.basename(cells[10], ".jsonl") };
}

/** Every data row of the roster as `{ role, status, sessionId }`, or `[]` (spec 4.7). */
function rosterRows(root) {
  let lines;
  try {
    lines = fs.readFileSync(path.join(root, ".tanto", "roster.md"), "utf8").split(/\r?\n/);
  } catch {
    return [];
  }
  const head = lines.findIndex((line) => /^\|\s*Role\s*\|/.test(line));
  if (head === -1) return [];
  const rows = [];
  for (const line of lines.slice(head + 2)) {
    if (!line.startsWith("|")) break;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (cells.length >= 11)
      rows.push({ role: cells[0], status: cells[9], sessionId: path.basename(cells[10], ".jsonl") });
  }
  return rows;
}

/**
 * The one line an old-shape roster earns (spec 4.7), read once at a start: a
 * row whose status is cleared, or a live or queued row whose session the
 * state file has no seat for, belongs to the old contract. The line informs
 * and asks for no act.
 */
function oldShapeLine(root, seats) {
  const known = new Set(seats.map((s) => s.sessionId));
  const old = rosterRows(root).filter(
    (row) => row.status.startsWith("cleared") || (/^(live|queued)/.test(row.status) && !known.has(row.sessionId)),
  );
  if (old.length === 0) return;
  const roles = [...new Set(old.map((row) => row.role))].join(", ");
  process.stdout.write(
    `old-contract rows in .tanto/roster.md (${roles}): those windows are no longer seats of this run — see the README, "Moving a run"\n`,
  );
}

```

**P11.9** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
  const byId = new Map(
    listing.sessions.filter((s) => s.sessionId && s.pid && s.state !== "stopped").map((s) => [s.sessionId, s]),
  );
```

**P11.9 →**

```js
  // An entry counts by its `pid` alone: the listing's `state` is a field
  // nothing reads any more (spec 2.6).
  const byId = new Map(listing.sessions.filter((s) => s.sessionId && s.pid).map((s) => [s.sessionId, s]));
  oldShapeLine(root, seats);
```

**P11.10** `skills/tanto/scripts/tanto.js` — replace exactly these 2 lines

```js
  // spawner ran, and it is resumed like a `running` one (spec 4.2); a
  // `stopped` one — after `tanto down --seats`, or a handover — is not.
```

**P11.10 →**

```js
  // spawner ran, and it is resumed like a `running` one (spec 4.4); a
  // `stopped` one — after `tanto teishi --seats`, or a handover — is not.
```

**P11.11** `skills/tanto/scripts/tanto.js` — replace exactly these 2 lines

```js
    for (const seat of readSeats(root)) {
      if (seat.status !== "running" && seat.status !== "blocked") continue;
```

**P11.11 →**

```js
    // A retirement stops every seat the state file holds (spec 4.6): a listed
    // one by the command, and a `parked` or `gone` one recorded `stopped`
    // with `note: "already exited"`, so that which seats survive it does not
    // depend on which were parked or collected at that moment.
    for (const seat of readSeats(root)) {
      if (!["running", "blocked", "parked", "gone"].includes(seat.status)) continue;
```

**P11.12** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
  process.stdout.write("tanto down: spawner stopped; the conversations are kept\n");
```

**P11.12 →**

```js
  process.stdout.write("tanto teishi: spawner stopped; the conversations are kept\n");
```

- [ ] **Step 4: Run the launcher's suite to verify it passes**

```bash
node --test skills/tanto/scripts/tanto.test.js
```

Expected: every test passes.

- [ ] **Step 5: Run the whole suite**

```bash
node --test skills/tanto/scripts/*.test.js
```

Expected: every test passes.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 11
```

Expected: `task 11: verify clean`.

- [ ] **Step 7: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints**

```bash
git commit --only -m "feat: tanto teishi retires every held seat and removes contract; a listing entry counts by its pid; an old-shape roster earns one line" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
```

Expected: one commit.

### Task 12: `SKILL.md` part 1: "The roles", "Invocation", "Start sequence", "The expected-model config"

Spec section 6's `SKILL.md` bullets for these four headings, carrying 1.1 (who
writes which prompt, the prompt table), 1.4 (the model check without the
stop), 1.5 (the seat check as the start sequence's first act), and 4.1 (the
word table and the three answers to a word typed in the wrong place), with
4.4's pointer for the quota. The frontmatter is unchanged (section 6, "Frontmatter:
unchanged"), and so are the file's title and its opening paragraphs.

**Files:**

- Modify: `skills/tanto/SKILL.md` — "The roles" (the Kanri, Kikaku, and Hosa
  rows), "Invocation" (from "Normalize" to the end of the prompt table),
  "Start sequence" (its opening line, "1. Model check", and the body of
  "2. Handshake"), and "The expected-model config" (the `sessions` bullet's
  two sentences, the language bullet's list, and the limits list's quota
  bullet).

**After this task:** the contract's first four sections name no tab seat, no
terminal seat, and no handshake; every seat's prompt is in one table with
its writer; a session that runs `/tanto <role>` checks with
`boundary.js seat` that the run started it before it reads anything else;
and the word table holds `fukki`, `taiseki`, `teishi`, and `jokyo` with their
aliases.

**Interfaces:**

- Consumes: `boundary.js seat` and its `no entry <kind>` (Task 6);
  `sessions.denrei` in `templates/tanto.json` (Task 2); the launcher's words
  (Tasks 8 and 10).
- Produces: the seat check's refusal line, quoted verbatim by the role
  files' starts (Tasks 16, 20, 21) and the README (Task 23); the word table
  that `scripts/tanto.js`'s word table mirrors (Task 8); the pointer from
  "The expected-model config" to "Resuming" and `roles/kanri.md`'s
  "Recovery" (Tasks 13 and 19).

**Named-mechanism sites.** The word table is also `scripts/tanto.js`'s
`main` and `USAGE` (Task 8), the `fukki` path of `cmdUp` and `tellKanri`, `cmdJokyo` (Task 10), and
`cmdTeishi` (Task 11); the README's "Usage" (Task 23); `roles/kanri.md`'s
"Recovery" for `fukki` (Task 19); and `roles/kikaku.md`, `roles/hosa.md`,
`roles/kaiseki.md` for `taiseki` (Tasks 20, 21), with "Session exit"'s
`taiseki` paragraph (Task 14). `fukki` is also "Resuming" (Task 13). The
seat check (`boundary.js seat`, `no entry background`, `no entry
interactive`, `no entry -`) is also `scripts/boundary.js` (Task 6), every
role file's start (Tasks 16, 20, 21), and the README's "Moving a run"
(Task 23), which the refusal line names. The prompt table's keys —
`input=`, `brief=`, `ledger=`, `spec=` — are also `roles/kanri.md`'s
"Create" and "The Kaiseki branch" (Tasks 17, 19), `roles/sekkei.md`
(Task 20), `roles/kaiseki.md` (Task 21), `templates/kikaku-decision.md`
(Task 7), and `templates/spawn-request.md` (Task 22); the messenger's prompt
is also `scripts/tanto.js` (Task 10) and spec 4.4. `sessions.denrei` is also
`templates/tanto.json` and `scripts/reading.test.js` (Task 2). The quota's
pointer to `fukki` is also `roles/kanri.md`'s "Limits" (Task 18) and
"Recovery" (Task 19). A model mismatch said in a start line is also
`roles/kikaku.md`, `roles/hosa.md`, and `roles/kaiseki.md` (Tasks 20, 21).
"The faces of a seat", which the effort paragraph points at, is Task 15's.

**O12.1** `tab seat` — every site in `SKILL.md` (spec, Old values); before: 26 lines in `skills/tanto/SKILL.md` — 5 in this task's sections, 12 in Task 13's, 8 in Task 14's, 1 in Task 15's; after: 0 in this task's sections (A12.21), and 0 in the file once Task 15 lands. Across `skills/tanto/` also `README.md` 1, `roles/kanri.md` 12, `templates/kanri.md` 1, `templates/roster.md` 3, `templates/spawn-request.md` 1.

**O12.2** `terminal seat` — every site (spec, Old values); before: 19 lines in `skills/tanto/SKILL.md` — 1 here, 10 in Task 13's sections, 6 in Task 14's, 2 in Task 15's; after: 0 here, and 0 in the file once Task 15 lands. Across `skills/tanto/` also `README.md` 4, `roles/kanri.md` 16, `roles/keikaku.md` 1, `scripts/boundary.js` 1, `scripts/boundary.test.js` 1, `scripts/spawner.js` 1, `templates/roster.md` 4.

**O12.3** `handshake` — every site; the one heading that keeps the word, "### 2. Handshake", is capitalized, is not this needle, and its new body says that no seat sends one (spec, Old values: "everywhere but a sentence that says no seat sends one"); before: 37 lines in `skills/tanto/SKILL.md` — 8 here, 16 in Task 13's sections, 9 in Task 14's, 4 in Task 15's; after: 0 here, and 0 in the file once Task 15 lands. Across `skills/tanto/` also `roles/hosa.md` 3, `roles/jisso.md` 1, `roles/kaiseki.md` 3, `roles/kanri.md` 24, `roles/keikaku.md` 1, `roles/kikaku.md` 2, `roles/sekkei.md` 2, `scripts/boundary.js` 1, `templates/kanri.md` 1, `templates/roster.md` 8.

**O12.4** `release:` — Kanri's line to a tab seat, with its colon; the spawner's `release` op, written without one, is not this needle; before: 7 lines in `skills/tanto/SKILL.md` — 1 here (Kanri's Owns cell), 1 in Task 13's sections, 5 in Task 14's; after: 0 here, and 0 in the file once Task 14 lands. Across `skills/tanto/` also `roles/hosa.md` 1, `roles/kaiseki.md` 1, `roles/kanri.md` 12, `roles/kikaku.md` 2, `roles/sekkei.md` 3, `templates/kanri.md` 1, `templates/roster.md` 1.

**O12.5** `released —` — Kanri's released line to the human (spec 5.1); before: 1 line in `skills/tanto/SKILL.md`, in Task 14's "Session exit"; after: 0 once Task 14 lands. Across `skills/tanto/` also `roles/kanri.md` 2, `templates/roster.md` 1.

**O12.6** `/clear` — every site (spec, Old values); before: 17 lines in `skills/tanto/SKILL.md` — 4 in Task 13's sections, 13 in Task 14's; after: 0 once Task 14 lands. Across `skills/tanto/` also `roles/hosa.md` 1, `roles/jisso.md` 1, `roles/kaiseki.md` 2, `roles/kanri.md` 24, `roles/keikaku.md` 1, `roles/kikaku.md` 1, `roles/sekkei.md` 3, `templates/kanri.md` 1, `templates/roster.md` 4.

**O12.7** `a tab seat Kanri released with` — the status paragraph's `cleared` entry (spec 5.1); before: 1 in `skills/tanto/SKILL.md` (Task 13's section), after: 0. A needle cannot carry backticks, so the status word `cleared` is swept by the whole-skill fence of How a batch is verified; its other sites in `SKILL.md` are O12.30 to O12.33, O13.5's third needle, and the blocks. Across `skills/tanto/` the word also stands in `scripts/boundary.js` 2 and `scripts/boundary.test.js` 3 (the `record --status` pattern, which keeps it, section 6), `scripts/spawner.js` 2 and `templates/shoki-brief.md` 1 (the English verb, not this needle), and as the status word in `roles/kanri.md` 8, `templates/roster-archive.md` 2, `templates/roster.md` 4.

**O12.30** `one, which is a bare window` — the address bullet about a `cleared` row (spec 3.1); before: 1 in `skills/tanto/SKILL.md` (Task 13's section), after: 0.

**O12.31** `writes the Events line a shoroku proposal not` — the `no-role` bullet's `cleared` mark (spec 3.2); before: 1 in `skills/tanto/SKILL.md` (Task 14's section), after: 0.

**O12.32** `is ever sent: the row is` — the `release:` bullet's `cleared` row (spec 5.1); before: 1 in `skills/tanto/SKILL.md` (Task 14's section), after: 0.

**O12.33** `knows — and Kanri marks the row` — "The exit itself"'s forced exit, which marked a row `cleared` (spec 5.1); before: 1 in `skills/tanto/SKILL.md` (Task 14's section), after: 0.

**O12.8** `orders line` — every site; a seat's orders are its prompt's keys (spec 1.1); before: 8 lines in `skills/tanto/SKILL.md` — 1 in Task 13's sections, 3 in Task 14's, 4 in Task 15's; after: 0 once Task 15 lands. Across `skills/tanto/` also `README.md` 1, `roles/kanri.md` 9, `roles/keikaku.md` 2, `roles/sekkei.md` 7, `templates/kikaku-decision.md` 1, `templates/roster.md` 1.

**O12.9** `tanto down` — the launcher's retired word (spec 4.1, 4.6); before: 2 lines in `skills/tanto/SKILL.md` — 1 in Task 13's "Resuming", 1 in Task 15's scripts paragraph; after: 0 once Task 15 lands. Across `skills/tanto/` also `README.md` 3, `scripts/tanto.js` 5; `cmdDown` has 0 in `SKILL.md`.

**O12.10** `self-check` — the `ListAgents` self-check (spec 1.3, 3.1); before: 4 lines in `skills/tanto/SKILL.md` — 2 in Task 13's "Resuming", 2 in Task 14's sections; after: 0 once Task 14 lands. Across `skills/tanto/` also `roles/jisso.md` 1, `roles/kaiseki.md` 3, `roles/kanri.md` 2, `roles/keikaku.md` 2, `roles/sekkei.md` 2, `templates/boundary-brief.md` 1.

**O12.11** `claude attach <id>` — every way in the contract names is `tanto <role> [<topic>]` (spec 1.1); the bare `claude attach` stays in one sentence, C-1's, which Task 15 writes under "The faces of a seat" and which this needle does not match; before: 5 lines in `skills/tanto/SKILL.md` — 1 in Task 13's "Resuming", 3 in Task 14's sections, 1 in Task 15's scripts paragraph; after: 0 once Task 15 lands. The sixth `claude attach` line of the file is O14.3's. Across `skills/tanto/` also `README.md` 2, `roles/kanri.md` 5, `scripts/spawner.js` 1, `scripts/spawner.test.js` 1.

**O12.12** `name> [<ref>]` — `<name> [<ref>]`, cut by its first character, which a lead cannot open with: no seat writes a `[ref]` about itself (spec 1.3); the roster's column header, "Name `[ref]`", is not this needle and stays; before: 7 lines in `skills/tanto/SKILL.md` — 2 in Task 13's sections, 5 in Task 14's; after: 0 once Task 14 lands. Across `skills/tanto/` also `roles/kanri.md` 8, `scripts/boundary.test.js` 1, `templates/batch-prompt.md` 1, `templates/kanri-handover.md` 2, `templates/roster-archive.md` 1, `templates/roster.md` 10.

**O12.13** `opened by the human` — Kikaku's and Hosa's Count cells (spec section 6, "The roles"); before: 2 in `skills/tanto/SKILL.md`, after: 0.

**O12.14** `list those eight ids` — "Invocation" (spec, Old values); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O12.15** `The keys carry a spawned seat's orders` — "Invocation"'s sentence that sends a tab seat's orders through Kanri's reply (spec section 6); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O12.16** `ask them to run` — "Start sequence", the tab seat's model-mismatch stop (spec 1.4, Old values); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O12.17** `Its eight keys are the seven` — "The expected-model config", `sessions` without `denrei` (spec 4.4, Old values); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O12.18** `the released lines` — the language bullet's list of Kanri's lines, which loses the released line (spec 5.1); found by this task's grep for `released`; before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O12.19** `in Kanri's window and in any words` — the quota's return said in Kanri's window, now `fukki` (spec 4.4, Old values "the quota is back"); before: 1 in `skills/tanto/SKILL.md`, after: 0. `roles/kanri.md`'s "Limits" carries the same sentence (Task 18).

**O12.20** `a bare 再開 there is ambiguous` — the same bullet (spec section 6); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**A12.21** `skills/tanto/SKILL.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "The roles" "Invocation" "Start sequence" "The expected-model config" | grep -c -F -e 'tab seat' -e 'terminal seat' -e 'handshake' -e 'release:' -e 'released —' -e '/clear' -e 'cleared' -e 'orders line' -e 'tanto down' -e 'self-check' -e 'claude attach <id>' -e '<name> [<ref>]' -e 'opened by the human' -e 'list those eight ids' -e 'The keys carry a spawned seat' -e 'ask them to run' -e 'Its eight keys are the seven' -e 'the released lines' -e 'in any words' -e 'a bare 再開 there'` — before: 19, after: 0

- [ ] **Step 1: Apply the passages**

Apply P12.22 to P12.29.

**P12.22** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake when no Hosa is live, the spawn, stop, and attention requests, the kessai, and the `release:` lines to tab seats | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
```

**P12.22 →**

```markdown
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake when no Hosa is listed, the spawn, stop, wake, and attention requests, and the kessai | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku, answering its `decision:` lines |
```

**P12.23** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
| Kikaku (企画) | 0 or 1, opened by the human | the consultation, and the decision files under `.tanto/kikaku/` | the human; Kanri, one `decision:` line |
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores, the bug intake, the hotfix lane's edits Kanri hands over in a slot Kanri gives, and the kessai relay | the human; Kanri |
```

**P12.23 →**

```markdown
| Kikaku (企画) | 0 or 1, started by the human with `tanto kikaku` | the consultation, and the decision files under `.tanto/kikaku/` | the human; Kanri, one `decision:` line |
| Hosa (補佐) | 0 or 1, started by the human with `tanto hosa` | the human's small chores, the bug intake while it is listed, the hotfix lane's edits Kanri hands over in a slot Kanri gives, and the kessai relay | the human; Kanri |
```

**P12.24** `skills/tanto/SKILL.md` — replace exactly these 34 lines

```markdown
Normalize the role word to its romaji id before anything else.

| Accepted | Id |
| --- | --- |
| `かんり`, `管理`, `kanri` | `kanri` |
| `せっけい`, `設計`, `sekkei` | `sekkei` |
| `けいかく`, `計画`, `keikaku` | `keikaku` |
| `じっそう`, `実装`, `jisso` | `jisso` |
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |
| `きかく`, `企画`, `kikaku` | `kikaku` |
| `ほさ`, `補佐`, `hosa` | `hosa` |
| `ふっき`, `復帰`, `fukki` | `fukki` |

Any other word: say the role is unknown, list those eight ids, and stop.

`/tanto fukki` skips the start sequence — no model check, no first
handshake — and runs "Resuming" below. It is typed in a **tab seat**; a
terminal seat is resumed by the launcher, `tanto`, and is told to run
`/tanto fukki` only when it is the Kanri the human then attaches to.

There is no address argument: Kanri's address is the roster's first data
row, for every role, and a workspace with no roster yet has no peer to
bootstrap — its first session is the Kanri the launcher spawns, and Kanri
writes the roster. The keys carry a spawned seat's orders, which a tab seat
gets in Kanri's reply to its handshake instead:

| seat | the prompt |
| --- | --- |
| Kanri, first or successor | `/tanto kanri` — the handover file, when one exists, is the Start section's Handover case |
| Keikaku | `/tanto keikaku topic=<topic> spec=<path> plan=<path> ledger=<path>` — `ledger=` only when another topic's batch is in flight, naming that ledger |
| Jisso, an ordinary plan | `/tanto jisso batch=<.tanto/<topic>/batch-<key>-prompt.md>` — the prompt file is its orders |
| Jisso, a plan that edits this skill | `/tanto jisso queue=<topic>` — reads nothing and waits for the one line `batch: <path>` |
| Kaiseki, attached | `/tanto kaiseki topic=<topic>` — the key is what makes it attached; `/tanto kaiseki` with no key is standalone Kaiseki, roster or no roster |
| shoki | not a `/tanto` invocation at all: the prompt is the one line `brief: <.tanto/<topic>/shoki-brief.md>`, and shoki reads no role file and no `SKILL.md` |
```

**P12.24 →**

```markdown
Normalize the word to its romaji id before anything else. One table serves
`/tanto` and the launcher, `tanto`, typed in a terminal: the seven roles,
and four words, each accepted in romaji, kana, kanji, or its English alias.

| Accepted | Id |
| --- | --- |
| `かんり`, `管理`, `kanri` | `kanri` |
| `せっけい`, `設計`, `sekkei` | `sekkei` |
| `けいかく`, `計画`, `keikaku` | `keikaku` |
| `じっそう`, `実装`, `jisso` | `jisso` |
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |
| `きかく`, `企画`, `kikaku` | `kikaku` |
| `ほさ`, `補佐`, `hosa` | `hosa` |
| `ふっき`, `復帰`, `fukki`, `resume` | `fukki` |
| `たいせき`, `退席`, `taiseki`, `leave` | `taiseki` |
| `ていし`, `停止`, `teishi`, `stop` | `teishi` |
| `じょうきょう`, `状況`, `jokyo`, `status` | `jokyo` |

Any other word: say it is unknown, list the seven role ids and the four
words, and stop. `down` is retired and has no alias.

Each of the four words is taken in one place:

- `fukki` — at the launcher, `tanto fukki`, and in Kanri, `/tanto fukki`:
  it puts the run back after a restart, a stale spawner, or a quota's
  return. In Kanri it skips the start sequence and runs "Resuming" below.
  In any other seat `/tanto fukki` is answered with one line naming
  `tanto fukki`, and nothing else is done.
- `taiseki` — typed by the human as `/tanto taiseki` in a Kikaku, a Hosa,
  or a standalone Kaiseki, the seats he paces: it ends that seat ("Session
  exit"). Any other role answers `this seat ends at its boundary, by the
  run` and does nothing; `tanto taiseki` at the launcher is answered with
  one line naming `/tanto taiseki`.
- `teishi` and `jokyo` — at the launcher alone: `tanto teishi [--seats]`
  stops the spawner, and with `--seats` the run's seats; `tanto jokyo`
  prints the run's seats, read-only. Typed as `/tanto <word>` in a session,
  either is answered with one line naming the terminal command.

There is no address argument: Kanri's address is the roster's first data
row, for every role ("The address"). A workspace with no roster yet has no
Kanri to address: `tanto` spawns its first Kanri, and that Kanri writes the
roster. Every seat is spawned on a request, and its prompt's keys are its
orders — nothing else carries them:

| seat | written by | the prompt |
| --- | --- | --- |
| Kanri, first or successor | the launcher, when the run has none; Kanri, for its successor | `/tanto kanri` — the handover file, when one exists, is the Start section's Handover case |
| Sekkei | Kanri, for a topic it has opened | `/tanto sekkei topic=<topic> spec=<path> branch=<branch> input=<path>` — `input=` only when an input document exists, naming the one that lists the rest; `ledger=<path>` added when another topic's batch is in flight, and `spec=` is then the draft path |
| Keikaku | Kanri | `/tanto keikaku topic=<topic> spec=<path> plan=<path> ledger=<path>` — `ledger=` only when another topic's batch is in flight, naming that ledger |
| Jisso, an ordinary plan | Kanri | `/tanto jisso batch=<.tanto/<topic>/batch-<key>-prompt.md>` — the prompt file is its orders |
| Jisso, a plan that edits this skill | Kanri | `/tanto jisso queue=<topic>` — reads nothing and waits for the one line `batch: <path>` |
| Kaiseki, attached | Kanri, once the brief is written | `/tanto kaiseki topic=<topic> brief=<path>` — the keys are what make it attached |
| Kaiseki, standalone | the launcher, `tanto kaiseki` | `/tanto kaiseki` with no key, roster or no roster |
| Kikaku | the launcher, `tanto kikaku` | `/tanto kikaku` |
| Hosa | the launcher, `tanto hosa` | `/tanto hosa` |
| shoki | Kanri, at the close | not a `/tanto` invocation at all: the prompt is the one line `brief: <.tanto/<topic>/shoki-brief.md>`, and shoki reads no role file and no `SKILL.md` |
| denrei, the messenger | the launcher's `tanto fukki`, when Kanri is alive | not a `/tanto` invocation: a fixed prompt that forwards the one line `fukki: requested at the launcher` to Kanri; it reads no role file and no `SKILL.md`, gets no roster row, and is stopped and removed when its turn ends ("Resuming") |
```

**P12.25** `skills/tanto/SKILL.md` — replace exactly these 35 lines

```markdown
Two steps, in this order, before any role work.

### 1. Model check

Read the expected-model config below and compare `sessions.<role>.model` with
your own model id, which your system prompt states; a configured family
matches when it occurs inside that id. On a mismatch in a **tab seat**, tell
the human what was expected and what is running, ask them to run
`/model <family>` and then `/tanto` again, and stop. A mismatch in a
**spawned seat** never stops it: it appends `model: expected <a>, running
<b>` to the first tanto line it sends, and Kanri writes an `attention`
request on reading it (decision-08bc: the mismatch reaches the human either
way).

Then read your own effort as "The transcript reading" below says, and compare
it with `sessions.<role>.effort`. Say both results in your start line —
Kanri's own start line included, though Kanri sends no handshake. Every other
role reads the same field again for its handshake, so Kanri checks the effort
a second time, as it checks the model.

The effort check warns only, and `unknown` is not a mismatch. Never switch a
model, and never switch an effort: the effort is the human's to change with
`/effort` in that window, and the roster records what runs.

### 2. Handshake

Kanri skips the handshake and runs the start sequence in `roles/kanri.md`
instead. A **tab seat** — Kikaku, Hosa, Sekkei, Kaiseki — does the handshake
below. A **spawned seat** — Keikaku, Jisso, and a spawned Kanri —
sends none: its role, topic, model, effort, branch, and mode are in the
request Kanri wrote, and its `sessionId`, name, cwd, and transcript are in
the result the spawner wrote back. It runs the model check and the
definitions write-out, then does what its keys say. Shoki is neither: its
prompt is not a `/tanto` invocation, it reads no role file and no contract,
and it runs no start sequence at all — its brief is the whole of it.
```

**P12.25 →**

````markdown
Two steps, in this order, before any role work, and one check before them.

**The seat check** is your first act. Run
`node "$TANTO/scripts/boundary.js" seat <your sessionId>`, the `sessionId`
being your transcript's basename ("The transcript reading"). Go on when it
prints an entry, and when it prints `no entry background`: that listing
entry is a background session's, which nobody typed into, and the spawner
records a new seat a moment after it starts. On `no entry interactive` or
`no entry -` — a tab opened from habit, or a tab of a run that has not
moved — say this, in the human's language, and stop, reading no role file,
writing nothing, and sending nothing:

```text
seats are started by tanto <role> in a terminal, or by Kanri; a run started before this contract is moved first — README, "Moving a run"
```

A `seat` that exits 1 because the listing failed prints no entry line, and
that exit is no signal, as a failed listing is none for the census (2.7):
the session runs `seat` once more, and on a second exit 1 goes on — the
check guards against a tab opened by hand, and a listing that failed is no
evidence of one — and says so, appending `seat: listing failed — <reason>`
to its start line and to the first tanto line it sends, as a model mismatch
is said. A tab that slipped through is a session under the root that no row
holds, and Kanri's next census prints it under **Not held**.

The check holds for every role, Kanri and a standalone Kaiseki included:
`tanto` and `tanto kaiseki` are their ways in.

### 1. Model check

Read the expected-model config below and compare `sessions.<role>.model` with
your own model id, which your system prompt states; a configured family
matches when it occurs inside that id. A mismatch never stops the seat: it
appends `model: expected <a>, running <b>` to the first tanto line it sends,
and Kanri writes an `attention` request on reading it (decision-08bc: the
mismatch reaches the human). A Kikaku, a Hosa, and a standalone Kaiseki,
which send Kanri no first line, say the mismatch in their start line.

Then read your own effort as "The transcript reading" below says, and compare
it with `sessions.<role>.effort`. Say both results in your start line, Kanri's
included. The reading is of the turn that runs the start sequence: a turn the
human takes in a tab runs at the editor's effort, not the spawn's, and nothing
checks the later turns or asks the human about them ("The faces of a seat",
C-4).

The effort check warns only, and `unknown` is not a mismatch. Never switch a
model, and never switch an effort: the effort is the human's to change with
`/effort` in that window, and the roster records what runs.

### 2. Handshake

No seat sends one. Every seat is spawned on a request — the launcher's for
Kanri when the run has none, Kikaku, Hosa, a standalone Kaiseki, and the
messenger; Kanri's for every other seat, its own successor among them — so
its role, topic, model, effort, branch, and mode are in the request, and its
`sessionId`, name, cwd, and transcript are in the result the spawner wrote
back. After the seat check, the model check, and the definitions write-out
below, it does what its keys say; Kanri runs its start in `roles/kanri.md`.
Shoki and the messenger are neither: their prompt is not a `/tanto`
invocation, they read no role file and no contract, and they run no start
sequence at all — shoki's brief is the whole of it.
````

**P12.26** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it, read at the moment of each comparison — each
```

**P12.26 →**

```markdown
- `sessions.<role>` is **advisory**. The checks above compare against it,
  read at the moment of each comparison — each
```

**P12.27** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
  model or its effort. Its eight keys are the seven roles and
  `sessions.shoki`, the scribe the close spawns, which is a seat with a
  family and an effort and no role file; the launcher reads
  `sessions.kanri` from it through `reading.js`'s `loadSessions`, and Kanri
  reads the rest when it writes a spawn request.
```

**P12.27 →**

```markdown
  model or its effort. Its nine keys are the seven roles and two seats with
  a family, an effort, and no role file: `sessions.shoki`, the scribe the
  close spawns, and `sessions.denrei`, the messenger `tanto fukki` spawns
  ("Resuming"). Whoever writes a seat's spawn request reads its key then —
  the launcher, through `reading.js`'s `loadSessions`, for Kanri, Kikaku,
  Hosa, a standalone Kaiseki, and the messenger; Kanri for every other.
```

**P12.28** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
  the `R-n` notices, the released lines, the human-access steps, and the
```

**P12.28 →**

```markdown
  the `R-n` notices, the human-access steps, and the
```

**P12.29** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```markdown
- When the human says, in Kanri's window and in any words, that the quota is
  back, Kanri may probe the family once with a trivial `default` subagent and
  then sends `continue: <dispatch> — same model`, the dispatch being the one
  the `paused:` line named; the role re-dispatches identically from where it
  stopped. With no `paused:` marker to bind to, Kanri asks the human what to
  continue. A human who speaks in the role's window instead is answered and
  reported as `human-contact:`; a bare 再開 there is ambiguous by
  construction, and the role asks.
```

**P12.29 →**

```markdown
- The human's word that the quota is back is `fukki` — `tanto fukki` at the
  launcher, or `/tanto fukki` in Kanri. Its procedure, `roles/kanri.md`'s
  "Recovery", is the one place the probe is written: one trivial `default`
  subagent on the family, then `continue: <dispatch> — same model` for every
  `paused:` line still unanswered, the dispatch being the one that line
  named, and the role re-dispatches identically from where it stopped; a
  probe that fails sends nothing and tells the human the reset time again.
  A human who says it in a role's own window is answered, reported as
  `human-contact:`, and pointed to `fukki`; the role continues nothing on
  its own.
```

- [ ] **Step 2: Count the old values in this task's sections**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "The roles" "Invocation" "Start sequence" "The expected-model config" | grep -c -F -e 'tab seat' -e 'terminal seat' -e 'handshake' -e 'release:' -e 'released —' -e '/clear' -e 'cleared' -e 'orders line' -e 'tanto down' -e 'self-check' -e 'claude attach <id>' -e '<name> [<ref>]' -e 'opened by the human' -e 'list those eight ids' -e 'The keys carry a spawned seat' -e 'ask them to run' -e 'Its eight keys are the seven' -e 'the released lines' -e 'in any words' -e 'a bare 再開 there'
```

Expected: `0` — A12.21's command. A `no section` line on stderr means a heading of the four was renamed, which no passage does: stop and report.

- [ ] **Step 3: Load the frontmatter as YAML**

```bash
uv run --no-project --with pyyaml python -c "import sys,yaml;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);assert ': ' not in d['description'];print('ok');print(d['name']);print(d['argument-hint'])" skills/tanto/SKILL.md
```

Expected: the frontmatter as it stood at the base, three lines —
ok
tanto
kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 12
```

Expected: `task 12: verify clean`.

- [ ] **Step 5: Run lint per Global Constraints** on `skills/tanto/SKILL.md`.

Expected: lint passes with no file changed.

- [ ] **Step 6: Commit per Global Constraints** — subject `docs: the contract's roles, word table, seat check, and model config for run-owned seats`, path `skills/tanto/SKILL.md`.

Expected: one commit.

### Task 13: `SKILL.md` part 2: "Handshake and roster" → "The roster", "The transcript reading", "Resuming"

Spec section 6's `SKILL.md` bullets for "Handshake and roster", "The
transcript reading", and "Resuming", carrying 1.3 (the row written from the
result file, the bare name), 2.5 (how Kanri sends a seat a line, `seat`,
`wake`, the beat, `unsent:`), 2.7 (the census's six headings and the
`spawner:` line), 3.1 (a seat is its `sessionId`; the one stored address),
and 4.4 (the resume list, the two ways Kanri is told, Recovery). The section
"Handshake and roster" is renamed "The roster", as the spec's section 6
says; no file under `skills/` points at the old heading (`git grep -F
'Handshake and roster' a89dd16 -- skills/` finds `SKILL.md`'s heading alone),
and its subsection "The address" keeps its heading. The status words are
decided by this task's grep, as "What the plan must contain" asks: `refused`
names a handshake that got no row in every one of its three `SKILL.md`
lines, and in `roles/kanri.md` (twice in its handshake steps, and in the archive
move's list) and the roster templates likewise, so no use remains and it goes with
`cleared`.

**Files:**

- Modify: `skills/tanto/SKILL.md` — "Handshake and roster" from its heading
  to the line before "### The address"; the body of "The address"; the
  Effort bullet of "The transcript reading"; and the body of "Resuming".

**After this task:** the contract's roster section is "The roster", with five
status words and a census of six headings that reads the spawner's state
file; "The address" says that a seat is its `sessionId` and how Kanri wakes
a parked seat and sends it a line; "Resuming" has no tab-seat row, no
`ListAgents` self-check, and `tanto fukki`'s two ways of telling Kanri.

**Interfaces:**

- Consumes: `boundary.js census`'s six headings and suffixes (Task 5),
  `seat`, `wake`, and `beat` (Task 6); the spawner's `parked` status and
  `midTurn` (Task 4); `tanto fukki` and the messenger (Task 10).
- Produces: the census's headings as Kanri acts on them (`roles/kanri.md`'s
  "The census", Task 19); the send rule that `roles/kanri.md`'s opening,
  "When the plan lands", and "The batch loop" cite (Tasks 16, 17); the
  status words of `templates/roster.md` (Task 7).

**Named-mechanism sites.** The census's six headings and the `spawner:` line
are also `scripts/boundary.js`'s `CENSUS_HEADINGS` and `cmdCensus` (Task 5),
`roles/kanri.md`'s "The census" (Task 19), and the plan's own Global
Constraints (section 7). `seat`, `wake`, `beat`, and `wake --hold` are also
`scripts/boundary.js` (Task 6), `roles/kanri.md`'s "Create", "Release",
"Recovery", loop step 6, and its idle block (Tasks 17, 19),
`templates/spawn-request.md` (Task 22), and Task 15's scripts paragraph and
"The faces of a seat". The `unsent:` / `sent:` pair is also
`templates/roster.md` and `templates/kanri.md` (Task 7) and `roles/kanri.md`'s
"Recovery" (Task 19). The five status words are also `templates/roster.md`
and `templates/roster-archive.md` (Task 7), `roles/kanri.md`'s loop step 4
and step 6, "A seat's exit", and the archive move (Tasks 17, 18, 19), and
Task 15's Artifacts row for the archive; `boundary.js record --status` keeps
accepting `cleared` (spec section 6). The bare Name cell is also
`scripts/boundary.js`'s `writeSeatRow` comment (Task 6),
`templates/boundary-brief.md`, `templates/batch-prompt.md`, and
`templates/kanri-handover.md` (Task 22), and `roles/kanri.md`'s loop step 6
(Task 17). The fukki procedure and the messenger are also `scripts/tanto.js`'s
`fukki` path (Task 10), `scripts/spawner.js`'s `once` (Task 2),
`roles/kanri.md`'s "Recovery" (Task 19), and the README (Task 23); Task 12's
word table and `sessions.denrei` bullet point here. The resume list is also
`scripts/tanto.js`'s `fukki` path (Task 10) and `KANRI_RESUMABLE` (Task 11).
The `(blocked since <HH:MM>)` suffix is also `templates/roster.md` (Task 7)
and `roles/kanri.md`'s census bullet (Task 19); the intake's rule in "Messages"
(Task 14) reads the cell's first word and is unaffected. The renamed heading
is pointed at by Task 15's scripts paragraph ("The roster").

O12.1, O12.2, O12.3, O12.4, O12.6, O12.7, O12.8, O12.9, O12.10, O12.11, and
O12.12 each carry this task's share of their lines (Task 12); A13.10 counts
them here at zero.

**O13.1** `Handshake and roster` — the heading, renamed "The roster" (spec section 6); before: 1 in `skills/tanto/SKILL.md`, after: 0; 0 elsewhere under `skills/`.

**O13.2** `name [ref]` — the handshake's `name=` field and its sentence (spec 1.3); before: 2 in `skills/tanto/SKILL.md`, after: 0. The column header, "Name `[ref]`", and "the `Name [ref]` column" of the bug-report paragraph (Task 14's, which keeps it) are not this needle: the first has a backtick inside it, the second a capital.

**O13.3** `mode=` — the handshake's field and its paragraph (spec section 6, "its fields … go"); before: 2 in `skills/tanto/SKILL.md`, after: 0.

**O13.4** `transcript=` — the same; before: 3 in `skills/tanto/SKILL.md`, after: 0.

**O13.5** `a handshake that got no row` — the status paragraph's `refused` entry (spec section 6, decided by grep above); before: 1 in `skills/tanto/SKILL.md` (Task 13's section), after: 0. A needle cannot carry backticks, so the status word `refused` is swept by the whole-skill fence of How a batch is verified; the two other lines of `SKILL.md` that carry it are O13.30 and O13.31. Across `skills/tanto/` also `roles/kanri.md` 3, `templates/kanri.md` 1, `templates/roster-archive.md` 2, `templates/roster.md` 5, `templates/spawn-request.md` 1 (there the English verb, a gate that "refused the spawn"), and the scripts' tests, where it is the spawner's error and not this word.

**O13.30** `handshake is refused, as` — the model-check paragraph's refusal of a tab seat's handshake (spec 1.4); before: 1 in `skills/tanto/SKILL.md` (Task 12's section), after: 0.

**O13.31** `roster's stopped, dead, replaced, refused, and cleared rows` — the roster-archive row of "Artifacts" (spec 5.1); before: 1 in `skills/tanto/SKILL.md` (Task 15's section), after: 0.

**O13.6** `except while a restart is being` — the census marking nothing during a restart's recovery (spec 4.4, "the census marks at once"); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O13.7** `Kanri sends only to the names of` — "The address" (spec 2.5, Old values); before: 1 in `skills/tanto/SKILL.md`, after: 0. `templates/roster.md` carries "Kanri sends only to `live` rows" twice (Task 7).

**O13.8** `with no census first` — "Resuming"'s third row (spec 2.5, Old values); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O13.9** `word everywhere else` — "`/tanto fukki` is a **tab seat's** word everywhere else" (spec, Old values; the bold markers keep the whole phrase from being one needle); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**A13.10** `skills/tanto/SKILL.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "The roster" "The transcript reading" "Resuming" | grep -c -F -e 'tab seat' -e 'terminal seat' -e 'handshake' -e 'Handshake' -e 'release:' -e '/clear' -e 'cleared' -e 'orders line' -e 'tanto down' -e 'self-check' -e 'claude attach <id>' -e '<name> [<ref>]' -e 'name [ref]' -e 'mode=' -e 'transcript=' -e 'refused' -e 'except while a restart is being' -e 'Kanri sends only to the names of' -e 'with no census first' -e 'word everywhere else'` — before: 15, with `no section The roster` on stderr (the heading is still "Handshake and roster"; with that name in place of "The roster" the same count is 47), after: 0

- [ ] **Step 1: Apply the passages**

Apply P13.11 to P13.14.

**P13.11** `skills/tanto/SKILL.md` — replace exactly these 109 lines

````markdown
## Handshake and roster

This is a **tab seat's** act. Kikaku, Hosa, Sekkei, and an attached Kaiseki
read the first data row of `.tanto/roster.md`, which is Kanri's own row, and
send it the one line below. A spawned seat sends none: the request that
created it carried its orders, and the result carried its identity. A
Kaiseki started with no `topic=` key is standalone and does not shake hands,
roster or no roster.

Send Kanri exactly one message:

```text
handshake role=<role> topic=<topic|—> name=<name [ref]> cwd=<path> model=<model id> effort=<level|unknown> branch=<branch> mode=<auto|unknown> transcript=<absolute path|unavailable>
```

`name [ref]` is what `ListAgents` prints for this session on its first line
("This session is `<name> [<ref>]`").

`effort=` is read from this session's own transcript: the last record of
`type` `assistant`, its `perTurnEffort` field, or its `effort` field when
`perTurnEffort` is absent or is not a quoted string — a `null` value is
present and unreadable, and falls through the same way; `unknown` when the
transcript is unavailable. The same
read is the effort half of the start sequence's model check. Kanri compares
`model=` with `sessions.<role>.model` and `effort=` with
`sessions.<role>.effort`; a mismatch of either is one line to the human, and
the handshake still gets its roster row when only the effort differs — the
effort is the human's to change with `/effort` in that window, and the roster
records what runs. A model mismatch in a tab seat's handshake is refused, as
today; a spawned seat's mismatch is not refusable — it arrives appended to a
line the seat has already acted on — and becomes an `attention` request
instead.

`mode=` is what you can see about your own permission mode — `auto` when your
system prompt says auto mode is active, otherwise `unknown`. It is advisory,
and `unknown` is the measured ceiling rather than a gap: a session outside auto
mode carries no statement of which mode is active, only the harness's line that
tools run behind a user-selected one, so nothing better than `unknown` can be
reported and Kanri's warning stays keyed on the absence of `auto` (measured
2026-09-10, issue-15bf).

`transcript=` is the path of this session's own transcript per "The transcript
reading", so that Kanri can record it and, where its session may read that
path, verify a reading it doubts.

Sekkei, Kikaku, Hosa, and an attached Kaiseki start reading while they wait —
the human is in the room, and the reply arrives as a
`<cross-session-message>`. Keikaku and Jisso wait for nothing and no longer
appear here: both are spawned, both take their orders from the keys of their
own prompt, and neither sends a handshake to be answered.

The roster lives at `.tanto/roster.md`, is written only by Kanri from
`templates/roster.md`, and has Kanri's row first. Columns are Role, Topic,
Name `[ref]`, cwd, Model, Effort, Branch, Mode, Started, Status, and
Transcript. Topic is the topic word the session's own orders gave it — a
tab seat's orders line, a spawned seat's own prompt keys — for a Jisso,
the topic whose queue it was spawned into: the plan whose
batches are in flight, or, with none in flight, the plan whose landing
requested the queue, since the shared checkout carries one topic's batches
at a time and the next plan's queue opens at its predecessor's close — or
`—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. The Status column
carries one of seven
words: `queued` a Jisso of a skill-editing plan waiting for its batch prompt;
`live`, which may carry one suffix: `(idle since <HH:MM>)`, or
`(blocked since <HH:MM>)`, which Kanri appends when the census's Listed line
for the seat carries `— blocked` and removes when a later census's does not —
the last census that saw the seat blocked, not its state now, and no cause,
since a permission prompt, a usage-limit pause, and a kessai wait all read
`blocked`; every reader tests the cell's first word; `stopped` a
terminal seat the spawner stopped on Kanri's request or the spawner's guard
stopped, its conversation kept; `cleared` a tab seat Kanri released with
`release:`, or whose `/clear` a `no-role` reply revealed; `replaced` a
Kanri that handed over; `dead` a session the census no longer lists — for
a terminal seat whose transcript is on disk not final, since its process is
gone and its conversation kept, and a resume puts the row back to `live`
when a line is next due to it ("Resuming"), while `stopped` keeps meaning a
stop the run made; `refused` a handshake that got no row. A terminal seat's
row is written from
the spawner's result file rather than from a handshake — by
`boundary.js record --seat` for a Jisso, by Kanri's own hand for a Keikaku
or a successor — and a row that does not exist yet while its seat works is
not an error. The keeping rule is one live seat per role and topic; Kanri,
Kikaku, and Hosa one each. `ListAgents` shows name, `[ref]`, kind, and start
time for every session on the machine — not the cwd, the model, or the
role; the handshake carries those, and the census places a session under
this repository by its cwd.

**The census.** A session is its `sessionId`, and a roster row's is the
basename of its Transcript column without `.jsonl`. Every match of a
session to a row — a handshake, `/tanto fukki`, Kanri's start, the census —
compares `sessionId`s, never a name, a `[ref]`, or a full path: a name and
a `[ref]` pass to another session across a `/clear`, one file has two paths
under a changed config directory, and a transcript moves when its session
enters a worktree. When a handshake's `transcript=` names another path than
the row's and the `sessionId` matches, Kanri rewrites the row's Transcript
cell to the handshake's path and notes the move in an Events line. `node "$TANTO/scripts/boundary.js" census` lists every
session under the repository, the tab seats included, and Kanri marks a
`live` row whose `sessionId` it does not list `dead` on that signal alone —
no timeout, no inference, no name — except while a restart is being
recovered (`roles/kanri.md`); a `queued` row it does not list stays
`queued`, since a waiting seat's absence is expected and the send of its
prompt resumes it. An entry with no `pid` is not listed, whatever its
`state` says: its process is gone, and the census prints its row under Not
listed, the line ending `— listed without a pid (a stale entry)`. A listing
that fails is no signal, and nothing is marked on it. A send error is a
reason to run the census, not a signal of its own: a send that errors to a
session the census still lists is a message failure, the row stays, and
Kanri tells the human in one line; a terminal seat the census does not list
is resumed and the line sent again ("Resuming").
````

**P13.11 →**

```markdown
## The roster

The roster lives at `.tanto/roster.md`, is written only by Kanri from
`templates/roster.md`, and has Kanri's row first. Columns are Role, Topic,
Name `[ref]`, cwd, Model, Effort, Branch, Mode, Started, Status, and
Transcript. A row is written from the spawner's result file, by
`boundary.js record --seat`: for a seat Kanri requested, when the result
lands; for a seat the launcher started — a Kikaku, a Hosa — at the census
whose **Not held** first prints it, Kanri not being woken for it. A
standalone Kaiseki and the messenger get no row, and a row that does not
exist yet while its seat works is not an error. The Name cell holds the bare
name the listing printed when the row was written — a record, not an
address ("The address") — and no seat writes a `[ref]` about itself. Topic
is the topic word the seat's own prompt keys gave it — for a Jisso, the
topic whose queue it was spawned into: the plan whose batches are in
flight, or, with none in flight, the plan whose landing requested the
queue, since the shared checkout carries one topic's batches at a time and
the next plan's queue opens at its predecessor's close — or `—` for Kanri,
Kikaku, Hosa, and a standalone Kaiseki.

The Status column carries one of five words: `queued` a Jisso of a
skill-editing plan waiting for its batch prompt; `live`, which may carry one
suffix: `(idle since <HH:MM>)`, or `(blocked since <HH:MM>)`, which Kanri
appends when the census's Listed line for the seat carries `— blocked` and
removes when a later census's does not — the last census that saw the seat
blocked, not its state now; the cause, `— blocked (<waitingFor>)`, is in the
census line and the notice and not in the cell, and every reader tests the
cell's first word; `stopped` a seat the run ended — by Kanri's `stop`
request, by `taiseki`, by `tanto teishi --seats`, by the spawner's guard, or
on a second `no-role` ("Messages") — its conversation kept and nothing sent
to it again; `replaced` a Kanri that handed over; `dead` a seat whose
process is gone and that is not parked — its conversation on disk and not
final, since a wake puts the row back to `live` when a line is next due to
it ("Resuming") — or a row of the old contract that Kanri retired at its
census (`roles/kanri.md`). A dialogue seat that is parked keeps its row
`live`: a park is its ordinary state between turns ("The faces of a seat").

The keeping rule is one held seat per role and topic, and one Kanri, one
Kikaku, and one Hosa per repository; the spawner refuses a request for a
second Kanri, Kikaku, or Hosa while it holds one, a handover's successor
excepted (rule 4). `ListAgents` shows name, `[ref]`, kind, and start time
for every session on the machine — not the cwd, the model, or the role; the
spawn request and its result carry those, and the census places a session
under this repository by its cwd.

**The census.** A seat is its `sessionId`, and a roster row's is the
basename of its Transcript column without `.jsonl`. Every match of a session
to a row — the census, a result file, Kanri's start — compares `sessionId`s,
never a name, a `[ref]`, or a full path: a name changes when a tab takes the
seat and at every window reload, one file has two paths under a changed
config directory, and a transcript moves when its session enters a
worktree. `node "$TANTO/scripts/boundary.js" census` reads the spawner's
state file, `.tanto/spawner/seats.json`, beside the listing, and prints the
`spawner:` line — `spawner: beating`, or `spawner: stale` — and then six
headings, in this order:

- **Listed** — a `live` or `queued` row whose session is listed, its line
  ending `— renamed` when the listed name is not the row's Name cell, and
  `— blocked (<waitingFor>)` for a background seat on a prompt. A seat open
  in a tab is never `blocked`: its prompt is in front of the human already.
- **Parked** — a `live` row whose seat the state file holds `parked`, with
  `— mid-turn` when its last turn did not end by itself and `— waiting`
  when a question of its to the human stands. Nothing is marked, and the row
  stays `live`; a seat with a topic marked `— mid-turn` is woken in Kanri's
  Recovery alone, never at a boundary's census ("Resuming").
- **Ended** — a `live` or `queued` row whose seat the state file holds
  `stopped` or `removed`; the line ends in `by taiseki` when the seat ended
  itself. Kanri writes the row `stopped`, with an Events line naming what
  ended it — `taiseki`, or its own request.
- **Not listed** — a row whose seat the state file does not hold, or holds
  `running`, `blocked`, or `gone`, and the listing does not show. Kanri marks
  a `live` row `dead` on that signal alone — no timeout, no inference, no
  name; a `queued` row stays `queued`, since a waiting Jisso's absence is
  expected and the send of its prompt wakes it. An entry with no `pid` is
  not listed, whatever its `state` says: its process is gone, and its line
  ends `— listed without a pid (a stale entry)`.
- **No session id** — a row whose Transcript cell carries no `sessionId`.
- **Not held** — a session under the root that no row holds; and, for every
  seat the state file holds that no row holds, listed or not, the line
  `— spawned as <role> <topic>, result <id>`, from whose result Kanri writes
  the row.

On `spawner: stale` the state file has stopped moving and Kanri marks
nothing, as on `census: unavailable`; a listing that fails is no signal
either. Kanri runs the census at its start; at every boundary, in loop step
6, before the next request; at every wake-up whose line comes from a name no
row holds — a Hosa's `slot-needed:` or `kessai answer:`, a Kikaku's
`decision:` — before it handles the line; and when `seat` prints `no entry`
("The address").
```

**P13.12** `skills/tanto/SKILL.md` — replace exactly these 41 lines

```markdown
- The address of a session is the **bare name** its handshake carried:
  `dotskills-0d`, not `kanri`. `SendMessage` delivers a bare name that matches
  exactly one live session. When it reports the name ambiguous, run
  `ListAgents` once and append the `[ref]` from that listing, with the space
  that precedes it.
- **An address written `<name> [<ref>]` is used as the bare `<name>`.** The
  `[ref]` is an identity, shown wherever a session is named so that the
  listing, the roster, and the handover agree on which session is meant; it is
  appended to a `to` value only after `SendMessage` reports the name ambiguous,
  and never pasted from a file. Every `to` value and every "Send to" blank
  carries the bare name — no command line carries an address at all (there
  is no address argument, "Invocation" above).
- **Kanri's address** is the first data row of `.tanto/roster.md`,
  read at the moment of sending. No role caches it, no line announces it,
  and no command line carries it. A workspace whose roster does not exist
  yet has no peer to bootstrap: its first session is the Kanri the launcher
  spawns, and that Kanri writes the roster.
- **Every other role's address** is known only to Kanri, from the handshake,
  and Kanri is the only session that sends to Sekkei, Keikaku, Jisso,
  Kaiseki, or Hosa. Kikaku is the human's seat: it sends Kanri a
  `decision: <path>` line and Kanri answers, but Kanri never addresses it
  first. A reply copies the envelope's `from` into `to` and needs no name at
  all.
- **Kanri sends only to the names of `live` roster rows** — never to a
  `queued` Jisso, which reads Kanri's row when its prompt wakes it, and never
  to a `cleared` one, which is a bare window. The roster
  is the address book; `ListAgents` confirms that a name is listed and
  nothing more. A window keeps its name and `[ref]` across a `/clear`
  (measured 2026-09-16), so a listed name is no evidence that a role is
  behind it.

Kanri's address is the first data row of the roster,
read at the moment of sending. A role whose send to Kanri errors, or gets
`no-role` back, holds its line and re-sends it to that row, read fresh, at
its next wake-up. No line announces a successor's address: a window keeps its
name and `[ref]` across a `/clear` (measured 2026-09-16), so the row the
successor rewrites already holds the address every peer would have been told.
On Kanri's side, a peer line it receives and does not answer in the same turn
becomes the ledger's `unanswered: <from> — <line>` events line, written
through `record --event` and paired with `answered: <from> — <line>` when it
is answered.
```

**P13.12 →**

````markdown
- **A seat is its `sessionId`.** Its name is whatever the listing prints for
  that id now: the spawner's `<repo>-<role>[-<topic>]-<hex>` while it runs in
  the background, the editor's `<repo>-<2 hex>` while a tab holds it, and a
  new one of those after every window reload. The spawner's census writes
  the listed name into its state file at every pass, and the commands below
  read it there at the moment of sending. A name is looked up at the send
  and never stored as an address; the roster's Name cell is a record.
- `SendMessage` delivers a bare name that matches exactly one live session.
  When it reports the name ambiguous, run `ListAgents` once and append the
  `[ref]` from that listing, with the space that precedes it. That is the
  one use of a `[ref]`: no seat writes one about itself — its closing line,
  the roster, Kanri's start line, the handover file's Live peers, and a
  batch prompt's Kanri line carry the bare name — none is pasted from a
  file, and no command line carries an address at all ("Invocation").
- **Kanri's address** is the first data row of `.tanto/roster.md`, read at
  the moment of sending — the one address still stored, and a safe one:
  Kanri is named by the spawner, is never parked, and is never opened in a
  tab, and the launcher refuses a Kanri the listing shows `interactive`. No
  role caches it and no line announces it. A workspace whose roster does not
  exist yet has no Kanri to address.
- **Every other seat** is addressed by Kanri alone, the only session that
  sends to Sekkei, Keikaku, Jisso, Kaiseki, or Hosa. Kikaku is the human's
  seat: it sends Kanri a `decision: <path>` line and Kanri answers, but
  Kanri never addresses it first. A reply copies the envelope's `from` into
  `to` and needs no name at all.

**How Kanri sends a seat a line.** Two commands, with `$TANTO` set in the
same tool call:

```bash
node "$TANTO/scripts/boundary.js" seat <sessionId or name>
node "$TANTO/scripts/boundary.js" wake [--hold] <sessionId> [<sessionId> ...]
```

`seat` prints one line from the state file,
`<status> <name> <kind> <role> <turn>` — the kind `background`,
`interactive`, or `-` when the seat is not listed; the turn `ended` or
`open` by the spawner's own test over the seat's transcript, or `-` when
none is found — and `spawner: beating` or `spawner: stale` under it. For a
`sessionId` the state file does not hold it prints `no entry <kind>`, the
kind being the listing's. `wake` checks the beat, writes a `resume` request
with no prompt for each `sessionId` at once, waits up to sixty seconds in
all, and prints one line per seat: what `seat` would print then, or
`error: <the result's error>` with the name. A parked seat is woken, never
handed a line: a resume carries a prompt for a Kanri alone. By what `seat`
prints:

- `running`, `blocked` — send to `<name>` with `SendMessage`.
- `parked`; and `gone`, for any seat but a Kanri — run `wake`, then send to
  the name it prints, in the same turn; several seats are woken in one call
  and sent to afterwards. On `error: listed` the seat is alive after all —
  in a tab, or woken by the human — and the line goes to the name printed
  with it. `--hold` is for a wake the human asked for, from Remote Control
  or from anywhere else: it keeps the seat awake until 55 minutes after its
  last turn ("The faces of a seat", C-2).
- `stopped` — nothing is sent, but to a seat whose row's Events line says
  Kanri stopped it to hold it on the human's word, which is woken once he
  has lifted the hold.
- `removed` — never. `no entry` — run the census; the row's status then
  decides.

Any other error from `wake`, and a `SendMessage` that errors, is answered by
running `seat` again and following what it prints, once. A second failure is
the Events line `unsent: <sessionId> — <the line>` and one line to the
human. A line whose answer does not come, from a seat that `seat` now shows
`parked`, was caught by its stop: Kanri wakes the seat and sends the line
again, and the seat reads it twice and answers once.

**The beat comes before every request.**
`node "$TANTO/scripts/boundary.js" beat` prints the `spawner:` line, and
Kanri runs it before a `spawn`, a `stop`, an `attention`, or an `ack`;
`wake` runs it itself. On `spawner: stale` Kanri writes no request, records
what it owes as the Events line
`unsent: <sessionId or op> — <the line or the request>` — through
`record --event` in the open ledger, in the roster's Events when none is
open — and tells the human in one line to run `tanto fukki`, saying that a
stale spawner raises no notice of its own. Kanri's Recovery sends every
`unsent:` line with no `sent:` pair and writes the pair. A pair is matched
on the text after the prefix, without the `(batch <X>)` that
`record --event` appends at a boundary, and two different lines to one seat
are two events.

**A peer's line to Kanri.** A role whose send to Kanri errors, or gets
`no-role` back, holds its line and re-sends it to the roster's first data
row, read fresh, at its next wake-up. No line announces a successor's
address: the successor rewrites the first row at its start, and that row is
what every peer reads. On Kanri's side, a peer line it receives and does not
answer in the same turn becomes the ledger's `unanswered: <from> — <line>`
events line, written through `record --event` and paired with
`answered: <from> — <line>` when it is answered.
````

**P13.13** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
  to `effort`, and an unavailable transcript reads as `unknown`. The start
  sequence's check and the handshake's `effort=` take it; the reading itself
  travels without it.
```

**P13.13 →**

```markdown
  to `effort`, and an unavailable transcript reads as `unknown`. The start
  sequence's effort check takes it, and the start line reports it; the
  reading itself travels without it.
```

**P13.14** `skills/tanto/SKILL.md` — replace exactly these 43 lines

```markdown
**Identity is the `sessionId`**, for every seat, the tab seats included. The
transcript path is a function of it —
`<config dir>/projects/<project slug>/<sessionId>.jsonl` — and the name is
what `claude agents --json` and `ListAgents` currently print for it. The
editor's resume of a tab seat keeps the id and changes the name; a terminal
seat's flag-less resume keeps both, since the spawner named it at its spawn.
The roster's Transcript column holds the path — or, for a terminal seat
whose transcript the spawner had not found when it wrote its result, the
bare `<sessionId>.jsonl` — and therefore the id: the basename, which holds
when the path does not. `unavailable` stands only where there is neither,
and no `Sess` column is added, because it would duplicate the basename.

| what happened | what the run does |
| --- | --- |
| a tab seat resumed by the editor | nothing is typed there: Kanri's census finds the row's `sessionId` under a new name, rewrites that row's name in place, and writes `resumed: <old name> → <new name>`. `/tanto fukki` stays accepted there, and its handshake rewrites the same row with the same values |
| a terminal seat renamed | the spawner's census sees a known `sessionId` under a new name and marks `renamed` in `seats.json`; Kanri rewrites the row, writes the same Events line, and clears the mark with an `ack` request. The seat itself does nothing and checks nothing |
| a terminal seat gone while the run is up — a send to it errors, or the roster records its row `dead` | Kanri sends on the roster as recorded, with no census first; either signal runs the census, and a terminal seat it does not list — a stale entry with no `pid` included — gets a `resume` request, `claude --resume <sessionId> --bg` with no other flag, which keeps the `sessionId` and the whole conversation. The line is sent again when the result lands, to the name the result carries, and the row goes `live` with it; a result that carries no name is answered by the census again, which names the session by its `sessionId`. A `queued` row goes `live` before its `batch:` line is sent, resumed or not, so that Kanri still sends only to `live` rows. A seat the census does list after a send error is a message failure: the row stays, and Kanri tells the human in one line. A resume is never a spawn and never a replacement; it covers every line to a terminal seat — a queued Jisso's `batch:` line, a rework prompt's, the `close:` line, a `coldread:` line, a `continue:` after a pause — and costs nothing for a seat that is alive. It fails when its result carries an error or the seat's transcript is not on disk, and the seat is then lost: `roles/kanri.md`'s Replace table decides what follows |
| an editor restart | the terminal seats are still running — separate processes, unreached by the restart. Only the tab seats came back renamed |
| a reboot or a crash | `tanto` writes a `resume` request for every terminal seat `seats.json` lists as `running` or `blocked`, with `claude --resume <sessionId> --bg` and no other flag. The roster's first row is settled first and separately, so a Kanri the listing has lost but `seats.json` still holds — `gone` included, a Kanri the human `/stop`ped or one that crashed while the spawner ran — is **resumed and never spawned again**. A seat `seats.json` holds as `running` or `blocked` — or, for Kanri alone, `gone` — is resumed; one it holds as `stopped` or `removed` is not, which is why `tanto down --seats` retires a run rather than pausing it |

`tanto` is fukki. It is idempotent: run twice it starts nothing twice, and it
puts back what a restart took. A resumed background Kanri idles until a line
reaches it, so the launcher prints the one act that is the human's —
`claude attach <id>`, and `/tanto fukki` typed there once. That Kanri's fukki
reconciles the roster with `seats.json`'s `renamed` marks and
the census, answers the ledger's unanswered lines, sends a Jisso
resumed mid-batch the one line `resume batch X from task N`, and continues
where the Progress line says.

`/tanto fukki` is a **tab seat's** word everywhere else, and the
`ListAgents` self-check that used to run at every boundary is a tab seat's
too: a terminal seat's rename is for the spawner's census to detect, and a
seat with no roster row yet would otherwise handshake, which it must not.
The self-check stays the tab seat's own trigger to re-handshake after its
name changed; the match that follows is Kanri's, by `sessionId`. A tab
seat's `/tanto fukki` reads this file and nothing else — its role file is
already in the session's context, which is what a resume preserves —
re-reads its own name for its closing line, and re-runs the Start
sequence's definitions write-and-count in both scopes, saying the result
the same way the Start sequence does. Its match is the row whose Transcript
basename is its own `sessionId`; a session whose `sessionId` is no row's
Transcript basename is not a resumed role: `/tanto fukki` says so and stops,
and the human runs `/tanto <role>` there as for a new session.
```

**P13.14 →**

```markdown
**Identity is the `sessionId`**, for every seat. The transcript path is a
function of it — `<config dir>/projects/<project slug>/<sessionId>.jsonl` —
and the name is what `claude agents --json` and `ListAgents` currently print
for it ("The address"). The spawner names a seat at its spawn; a tab that
holds the seat shows the editor's name instead, and a resume keeps the id.
The roster's Transcript column holds the path — or, for a seat whose
transcript the spawner had not found when it wrote its result, the bare
`<sessionId>.jsonl` — and therefore the id: the basename, which holds when
the path does not. `unavailable` stands only where there is neither, and no
`Sess` column is added, because it would duplicate the basename.

| what happened | what the run does |
| --- | --- |
| an editor reload or restart, or a tab closed | nothing is asked of anyone: no fukki, no report. The background processes are unreached by it; a tab the human does not reopen is a parked seat, woken when a line is next due to it; a turn the reload cut is continued by a word in the tab ("The faces of a seat", C-5). A seat a tab held is listed again under a new name, which the next row covers |
| a seat renamed | the census prints the seat's line ending `— renamed`, its listed name not being the row's Name cell; Kanri rewrites the row's Name cell and writes `resumed: <old name> → <new name>`, and that is all. The seat itself does nothing and checks nothing |
| a line due to a seat that is not running — parked, or gone | Kanri runs `seat` and follows "The address": a `parked` seat, or a `gone` one that is not a Kanri — a stale entry with no `pid` included — is woken by `wake`, a `resume` request run as `claude --resume <sessionId> --bg` with no prompt and no flag, which keeps the `sessionId` and the whole conversation, and the line goes to the name `wake` prints. A `queued` row goes `live` before its `batch:` line is sent, woken or not. A wake is never a spawn and never a replacement; it covers every line to a seat — a queued Jisso's `batch:` line, a rework prompt's, the `close:` line, a `coldread:` line, a `continue:` after a pause — and costs nothing for a seat that is alive, which `wake` answers `listed`. A seat whose wake fails, or whose transcript is not on disk, is lost: `roles/kanri.md`'s Replace table decides what follows |
| a reboot, a crash, or a spawner that died | `tanto`, or `tanto fukki`, reads the state file, starts the spawner when none beats, and writes a `resume` request for every seat it holds as `running` or `blocked` that is not a dialogue seat and that the listing does not hold, and for a Kanri it holds `gone`; never for a `parked`, `stopped`, or `removed` seat. A dialogue seat the reboot took is `parked` at the new spawner's first census pass, with `— mid-turn` when its turn was cut, and Kanri's Recovery wakes it. The roster's first row is settled first and separately, so a Kanri the listing has lost but the state file still holds — `gone` included, a Kanri the human `/stop`ped or one that crashed while the spawner ran — is **resumed and never spawned again**. A seat held as `stopped` or `removed` is not resumed, which is why `tanto teishi --seats` retires a run rather than pausing it |

`tanto` and `tanto fukki` are idempotent: run twice, they start nothing
twice. `tanto` puts back what a restart took and enters Kanri; `tanto fukki`
is the same recovery with Kanri told in every case, and the human types
nothing in Kanri for it. A Kanri the launcher resumed gets `/tanto fukki` as
its resume's prompt — the one role a resume carries a prompt for; a Kanri
that is alive gets the line `fukki: requested at the launcher` from the
messenger, a `denrei` seat on `sessions.denrei` that forwards that one line
and is stopped and removed when its turn ends. A bare `tanto` passes the
word to a Kanri it resumed and sends no messenger.

`/tanto fukki` typed in Kanri, the `fukki:` line, and a resume whose prompt
is `/tanto fukki` are one procedure, `roles/kanri.md`'s "Recovery": the
census acted on at once, with no window to wait for; one `wake` for every
seat with a topic marked `— mid-turn` under **Parked**, each sent the one
`resume:` line that continues a cut turn; a Jisso resumed mid-batch sent
`resume batch X from task N`; the `renamed` marks reconciled; every
`unsent:` line with no `sent:` pair sent, and every `unanswered:` line
answered; every `paused:` line still unanswered probed once; and what was
put back printed in the idle block. Kanri acts on a `fukki:` line only when
`boundary.js seat <the envelope's from-name>` prints a seat whose role is
`denrei`. `fukki` is Kanri's word alone among the sessions ("Invocation").
```

- [ ] **Step 2: Count the old values in this task's sections**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "The roster" "The transcript reading" "Resuming" | grep -c -F -e 'tab seat' -e 'terminal seat' -e 'handshake' -e 'Handshake' -e 'release:' -e '/clear' -e 'cleared' -e 'orders line' -e 'tanto down' -e 'self-check' -e 'claude attach <id>' -e '<name> [<ref>]' -e 'name [ref]' -e 'mode=' -e 'transcript=' -e 'refused' -e 'except while a restart is being' -e 'Kanri sends only to the names of' -e 'with no census first' -e 'word everywhere else'
```

Expected: `0` — A13.10's command. "The roster" includes its subsection "The address".

- [ ] **Step 3: Load the frontmatter as YAML**

```bash
uv run --no-project --with pyyaml python -c "import sys,yaml;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);assert ': ' not in d['description'];print('ok');print(d['name']);print(d['argument-hint'])" skills/tanto/SKILL.md
```

Expected: the frontmatter unchanged, three lines —
ok
tanto
kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 13
```

Expected: `task 13: verify clean`.

- [ ] **Step 5: Run lint per Global Constraints** on `skills/tanto/SKILL.md`.

Expected: lint passes with no file changed.

- [ ] **Step 6: Commit per Global Constraints** — subject `docs: the contract's roster, address, and resuming for run-owned seats`, path `skills/tanto/SKILL.md`.

Expected: one commit.

### Task 14: `SKILL.md` part 3: "Messages", "Human access", "Session exit"

Spec section 6's `SKILL.md` bullets for "Messages", "Human access", and
"Session exit", carrying 3.2 (the `no-role` line's two remaining senders and
a second `no-role`), 3.1 (the intake while a Hosa is parked), 1.1 (the
standing grants in the role files and the brief; `tanto <role>` in every
`attention` message), 5.1 (a seat's end at a boundary, the closing line of
an ended seat, Kanri's two obligations), and 5.2 (`taiseki`). "The brief's
form", inside "Messages", is unchanged.

**Files:**

- Modify: `skills/tanto/SKILL.md` — "Messages" (the `no-role` bullet, the
  `release:` bullet, the closing-line bullet, the commit-window bullet's
  last two lines, and the bug-report paragraph's intake), "Human access"
  (the standing grants, the grant's steps, and the harness's prompts), and
  "Session exit" (step 1's last clause, step 3's kessai message and answer,
  the Hosa's relay, Kikaku's and Hosa's end with the new `taiseki`
  paragraph, Jisso's and Kaiseki's bullets, and "The exit itself").

**After this task:** no line of the contract is sent to end a seat and none
asks the human to clear a window; a seat's closing line carries its bare
name, and an ended seat's says so; every way in a message names is
`tanto <role> [<topic>]`; and `/tanto taiseki` ends a Kikaku, a Hosa, or a
standalone Kaiseki.

**Interfaces:**

- Consumes: `boundary.js request leave` (Task 6); the spawner's `self` stop
  and its `taiseki not done:` notice (Tasks 1 and 4); `seat` (Task 6).
- Produces: the closing-line form every role file's closing line follows
  (Tasks 16 to 21) and the ended seat's line; the two obligations of 5.1
  that `roles/kanri.md`'s "A seat's exit" and "Replace" carry (Tasks 18, 19).

**Named-mechanism sites.** The closing line's identity and the ended seat's
second fact are also every role file's closing line (Tasks 16 to 21:
`roles/sekkei.md`'s tenure's end, `roles/keikaku.md`, `roles/kikaku.md`'s
and `roles/hosa.md`'s "Lifecycle", `roles/kaiseki.md`'s exit,
`roles/jisso.md`, `roles/kanri.md`'s handover line), and
`templates/shoki-brief.md`'s report line, `<your name> · shoki/<topic> ·
<family>`, which already carries no `[ref]` and which Task 7 touches only
for 3.2's two reasons. The `no-role` line's reasons and the second
`no-role` are also `templates/shoki-brief.md` (Task 7),
`roles/kanri.md`'s "On a handshake" remainder and "A seat's exit"
(Tasks 16, 18), and "The address" (Task 13). `human-needed: <role> <topic>
— tanto <role> [<topic>]` is also `roles/kanri.md`'s "Human access"
(Task 18) and `scripts/spawner.js`'s notices and their tests (Task 4).
`kessai: <topic> — tanto kanri` is also `roles/kanri.md`'s "Shoroku"
(Task 18) and `scripts/spawner.test.js`'s `attention` fixtures, which carry
`kessai:` (Task 4). `taiseki` is also `roles/kikaku.md` (Task 20),
`roles/hosa.md` and `roles/kaiseki.md` (Task 21), `scripts/spawner.js`'s
`self` stop (Task 1), `scripts/boundary.js`'s `request leave` (Task 6), the
README (Task 23), and Task 12's word table. The intake rule is also
`roles/hosa.md`'s "Whose work you take" (Task 21), `roles/kanri.md`'s "Bug
intake" (Task 18), the README's "live Hosa" line (Task 23), and
`templates/bug-report.md`, which section 6 leaves untouched because its
sentence stays true in letter. The standing grants are also
`roles/sekkei.md` and `roles/keikaku.md` (Task 20), `roles/hosa.md`
(Task 21), and `roles/kanri.md`'s "Human access" (Task 18). The replace
wait of 5.1 is also `roles/kanri.md`'s "Replace" (Task 19). The ended seat's
row going `stopped` at the census is "The roster"'s **Ended** (Task 13).

O12.1, O12.2, O12.3, O12.4, O12.5, O12.6, O12.7, O12.8, O12.10, O12.11, and
O12.12 each carry this task's share of their lines (Task 12); A14.5 counts
them here at zero.

**O14.1** `model-mismatch` — "the model-mismatch stop", in the bug-report paragraph and in "Human access" (spec 1.4, Old values); before: 2 in `skills/tanto/SKILL.md`, after: 0. `roles/kanri.md`'s "Human access" carries the third (Task 18).

**O14.2** `since a resumed session carries a` — the bug-report paragraph's reason for an unlisted name (spec section 6, "Messages"); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O14.3** `in Kanri's window by` — "in Kanri's window by `claude attach`", the kessai's answer (spec section 6, "Session exit"); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O14.4** `live Hosa` — the intake and the kessai relay named by a `live` row, now a Hosa while it is listed (spec 3.1); found by this task's grep; before: 5 lines in `skills/tanto/SKILL.md` — 3 in this task's sections, 2 in Task 15's Artifacts (the roster row's readers and the inbox row's writer); after: 0 here, and 0 in the file once Task 15 lands. Across `skills/tanto/` also `README.md` 1 and `roles/kanri.md` 5 (Tasks 23, 18).

**A14.5** `skills/tanto/SKILL.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "Messages" "Human access" "Session exit" | grep -c -F -e 'tab seat' -e 'terminal seat' -e 'handshake' -e 'release:' -e 'released —' -e '/clear' -e 'cleared' -e 'orders line' -e 'self-check' -e 'claude attach' -e '<name> [<ref>]' -e 'model-mismatch' -e 'since a resumed session carries a' -e 'live Hosa'` — before: 60, after: 0

- [ ] **Step 1: Apply the passages**

Apply P14.6 to P14.18.

**P14.6** `skills/tanto/SKILL.md` — replace exactly these 49 lines

````markdown
- **Every tanto line carries the `no-role` line as its second line** — the
  lines this file names and the ones the role files name, in both
  directions, the handshake, the bug-report route and its `received:` answer
  included:

  ```text
  <the tanto line>
  (tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
  ```

  A role skips the second line. A bare window — one the human `/clear`ed
  and has not yet given a role — finds in it the whole of what is asked of
  it, so "act on the teammate's request" and "do nothing" coincide. In a
  message longer than one line the `no-role` line follows the first: a
  batch prompt travels as the one line `batch: <path>`, and the file that
  path names carries no such line of its own; a `close:` line, or a
  handshake with its fields, is one line. A file a
  line points at — a report, a brief, a bug report — is not a message and
  carries no such line. The
  `no-role` reply is the one word, carries no second line of its own, and
  is the signal that a window was cleared under a role; a send error is a
  reason to run the census, whose "Not listed" is the signal that a session
  is gone — and, for a terminal seat, the reason to resume it and send the
  line again ("Resuming"). What each side does on `no-role`: Kanri marks
  the sender's row `cleared`, writes the Events line a shoroku proposal not
  written gets
  — what was lost, as far as it knows — and treats the exit as forced, a
  live Jisso's after verifying the tree; a role that receives `no-role` from
  Kanri's own name is in a handover gap, holds the line it sent, and
  re-sends it to the roster's first data row, read fresh, at its next
  wake-up, until it is answered — or, when that row's own name is stale,
  to the name `claude agents --json` prints for the `sessionId` its
  Transcript basename carries, since only a wake-up makes Kanri rewrite
  its row — this holds a line only for a role with an established roster
  row to hold one on behalf of. A session with no row yet — a tab seat's own first
  handshake, landing in the same gap — has no line to hold: it treats the
  `no-role` the way a send error is already treated, re-reads the roster's
  first data row, and re-handshakes there once a `live` Kanri answers it. A
  spawned seat never reaches this gap: it sends no handshake, and its row,
  when it exists, comes from the spawner's result file rather than from one.
- **`release: /clear this window`** is a **tab seat's** last line, sent by
  Kanri right after the seat's proposal passes its form check, and the last
  line that name is ever sent: the row is `cleared` at that moment. The seat
  tells the human, in its own window, to `/clear` it, and ends its turn;
  nothing else is expected of it. A **terminal seat** gets no such line: at
  the same moment, and on the same form check, Kanri writes a `stop`
  request, the spawner stops the session, the conversation is kept, and the
  row goes `stopped`. Nothing is `/clear`ed and nothing is said to the
  human.
````

**P14.6 →**

````markdown
- **Every tanto line carries the `no-role` line as its second line** — the
  lines this file names and the ones the role files name, in both
  directions, the bug-report route and its `received:` answer included:

  ```text
  <the tanto line>
  (tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
  ```

  A role skips the second line. The run no longer asks for a window to be
  wiped under a role, but two senders can still reach a session that holds
  no role: one that read a name from the state file seconds before a window
  reload gave that name to another window, and a bug-report sender reading
  another repository's roster. A session that holds no role finds in the
  line the whole of what is asked of it. In a message longer than one line
  the `no-role` line follows the first: a batch prompt travels as the one
  line `batch: <path>`, and the file that path names carries no such line of
  its own; a `close:` line is one line. A file a line points at — a report,
  a brief, a bug report — is not a message and carries no such line. The
  `no-role` reply is the one word and carries no second line of its own.
  On a `no-role` the sender re-reads the address — Kanri, the seat's name by
  `seat` ("The address"); a role, the roster's first data row — and sends
  once more, marking no row. A role that gets `no-role` again from Kanri's
  address is in a handover gap: it holds the line and re-sends it to the
  first data row, read fresh, at its next wake-up, until it is answered —
  or, when that row's own name is stale, to the name `claude agents --json`
  prints for the `sessionId` its Transcript basename carries. A second
  `no-role` from one `sessionId` is, for Kanri, the end of that seat: a seat
  held in a tab whose conversation the human wiped in his own chat is a bare
  window under a known row. Kanri writes an Events line with what was lost
  as far as it knows, writes the row `stopped` — verifying the tree first
  when the row was the live Jisso's — and follows `roles/kanri.md`'s Replace
  table.
````

**P14.7** `skills/tanto/SKILL.md` — replace exactly these 43 lines

````markdown
- **A seat's turn ends with its closing line**, in its own window and in the
  human's language: an identity, then two facts, and never an opinion. The
  identity is `<name> [<ref>]` — for a tab seat, the word its own last
  `ListAgents` printed for it, at the handshake or at `/tanto fukki`; for a
  terminal seat, the `name` its request's result carried, or the one
  `claude agents --json` prints for its own `sessionId`, never a
  `ListAgents` reading of its own — so the window and Kanri's own lines
  about it (its idle block, its released line to the human, the roster)
  always name it the same way — then
  `<role>[/<topic>]` (the topic named for a Sekkei, Keikaku, Jisso, or
  attached Kaiseki; bare for Kanri, Kikaku, Hosa) and `<family>`, the model
  word its own system prompt currently reads, fresh across a `/model`
  switch. It is as of the seat's own last self-check: a resumed session
  shows its old name until its next boundary or `/tanto fukki`, and the
  human, who restarted the editor, knows which day that is — no mechanism
  is added for this. The two facts, as before: where its work is — the
  paths its output went to, or the commit subject — and the contract step
  that still needs this seat, named by step and site, or `none`. A seat
  never names a step it is not needed for: the recommender's run, the human's
  check, the apply, and Kanri's verification are not waits of the seat's and
  are never listed. After `release:` the second fact is
  `none — /clear this window`. A turn that sends Kanri a line adds it,
  unchanged and reading included, on a `sent:` line under the closing line —
  absent on a turn that sends nothing. Kanri's own idle block carries the
  same identity as its first line after `---`; it needs no `sent:`, since
  Kanri's own lines are already files or `R-n` text. The form, rendered in
  the human's language:

  ```text
  <name> [<ref>] · <role>[/<topic>] · <family> — Work: <paths, or the commit subject>. Still needs this seat: <step — its site> | none.
  sent: <the one line sent to Kanri this turn, verbatim>
  ```

  Two examples — a Jisso at its boundary, `<name> [<ref>] · jisso/<topic> ·
  sonnet — Work: .tanto/<topic>/batch-B-report.md, commits b81f677..dba2562.
  Still needs this seat: the boundary's verdict — roles/jisso.md, "The run".`
  `sent: .tanto/<topic>/batch-B-report.md — <reading>` (the one line a Jisso
  sends Kanri at its boundary is that path — `roles/jisso.md`, "The run");
  the same Jisso after `release:`,
  `<name> [<ref>] · jisso/<topic> · sonnet — Work: the same. Still needs this
  seat: none — /clear this window.` This shapes the text the harness already
  requires when a turn ends; it opens no channel, and "Human access" stands
  as it is.
````

**P14.7 →**

````markdown
- **A seat's turn ends with its closing line**, in its own window and in the
  human's language: an identity, then two facts, and never an opinion. The
  identity is the seat's bare name — the one `claude agents --json` prints
  for its own `sessionId` when the line is written, never a `ListAgents`
  reading of its own and never a `[ref]` — then `<role>[/<topic>]` (the
  topic named for a Sekkei, Keikaku, Jisso, or attached Kaiseki; bare for
  Kanri, Kikaku, Hosa) and `<family>`, the model word its own system prompt
  currently reads, fresh across a `/model` switch. A seat open in a tab is
  listed under the editor's name, which changes at every window reload; the
  line names whatever is listed then, and nothing keys on it ("The
  address"). The two facts, as before: where its work is — the paths its
  output went to, or the commit subject — and the contract step that still
  needs this seat, named by step and site, or `none`. A seat never names a
  step it is not needed for: the recommender's run, the human's check, the
  apply, and Kanri's verification are not waits of the seat's and are never
  listed. At its final boundary — its last report line sent, or `taiseki` —
  (a seat with a tab, which shoki, spawned into a worktree and reading no
  role file, is not) the second fact is
  `none — this seat has ended; close its tab if one is open`, and a seat
  that has written that line answers any later message with the same line
  and nothing else: an ended seat's row stays in the editor's list, opens
  with a normal prompt box, and has its role in its context. A turn that
  sends Kanri a line adds it, unchanged and reading included, on a `sent:`
  line under the closing line — absent on a turn that sends nothing.
  Kanri's own idle block carries the same identity as its first line after
  `---`; it needs no `sent:`, since Kanri's own lines are already files or
  `R-n` text. The form, rendered in the human's language:

  ```text
  <name> · <role>[/<topic>] · <family> — Work: <paths, or the commit subject>. Still needs this seat: <step — its site> | none.
  sent: <the one line sent to Kanri this turn, verbatim>
  ```

  Two examples — a Jisso at its boundary, `<name> · jisso/<topic> · sonnet
  — Work: .tanto/<topic>/batch-B-report.md, commits b81f677..dba2562. Still
  needs this seat: the boundary's verdict — roles/jisso.md, "The run".`
  `sent: .tanto/<topic>/batch-B-report.md — <reading>` (the one line a Jisso
  sends Kanri at its boundary is that path — `roles/jisso.md`, "The run");
  a Sekkei at its final boundary, `<name> · sekkei/<topic> · fable — Work:
  <spec path>, .tanto/<topic>/dialogue.md. Still needs this seat: none —
  this seat has ended; close its tab if one is open.` This shapes the text
  the harness already requires when a turn ends; it opens no channel, and
  "Human access" stands as it is.
````

**P14.8** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
  `boundary.js record --event`, to the ledger a `ledger=` key its own
  prompt carries names — Sekkei's orders line, Keikaku's own spawn prompt.
```

**P14.8 →**

```markdown
  `boundary.js record --event`, to the ledger its own prompt's `ledger=`
  key names.
```

**P14.9** `skills/tanto/SKILL.md` — replace exactly these 16 lines

```markdown
when the human noticed the defect, they hand it to a live Hosa as a chore, or
say it in Kanri's window. **The intake is the target repository's `live`
Hosa, else its Kanri**: the sender reads `<workspace>/.tanto/roster.md`,
takes the bare `<name>` before the bracket of the `Name [ref]` column of the
row whose Role is `hosa` and whose Status begins with `live` — Kanri appends
one of the two suffixes the Status column names to that cell, `(idle since <HH:MM>)` while a Hosa idles — or, when there is
none, of the first data row, the human supplying the workspace's path where the sender
does not know it; checks that name against `ListAgents`; and asks the human
for the address when the roster is absent — a workspace not yet migrated, or
an older skill — or the name is not listed, since a resumed session carries a
new name until it rewrites its row. The roster is Kanri's to write and the
sender's only to read; the read is of a file outside the sender's own working
directory, and outside auto mode the harness may put a permission prompt for
it in the sender's window — the harness's own prompt, like the model-mismatch
stop, and not a failure of the route. A defect that surfaces in a spec
dialogue reaches Kanri as an `I-n` in `spec-inputs.md`, not as a bug report.
```

**P14.9 →**

```markdown
when the human noticed the defect, they hand it to a Hosa as a chore, or
say it in Kanri's window. **The intake is the target repository's Hosa while
one is listed, else its Kanri**: the sender reads
`<workspace>/.tanto/roster.md`, takes the bare `<name>` before the bracket
of the `Name [ref]` column of the row whose Role is `hosa` and whose Status
begins with `live` — Kanri appends one of the two suffixes the Status column
names to that cell — and checks it against `ListAgents`. A Hosa is parked
between its turns and its name is then not listed, so when it is not, or
there is no such row, the sender takes the first data row's name instead;
in practice the intake is Kanri, a Hosa being named only for the minutes it
is in a turn or held — decision-c322's "the cheapest seat that is live",
live read as listed, which is what a sender can check. The human supplies
the workspace's path where the sender does not know it, and the address
when the roster is absent — a workspace not yet migrated, or an older
skill — or the first row's name is not listed either. The roster is
Kanri's to write and the sender's only to read; the read is of a file
outside the sender's own working directory, and outside auto mode the
harness may put a permission prompt for it in the sender's window — the
harness's own prompt, and not a failure of the route. A defect that
surfaces in a spec dialogue reaches Kanri as an `I-n` in `spec-inputs.md`,
not as a bug report.
```

**P14.10** `skills/tanto/SKILL.md` — replace exactly these 29 lines

```markdown
only after Kanri has judged it necessary and granted it for that scope. Four
standing grants exist: Sekkei's spec dialogue, named in Kanri's orders line
at its handshake, and Keikaku's plan dialogue, implied by the role and
stated in `roles/keikaku.md`, since a spawned seat has no orders line; an
attached Kaiseki's debugging conversation, written in its brief; and Hosa's
chores, named in Kanri's answer to its handshake. Kikaku needs no grant: it
is the human's own seat, and the human in that window is its counterpart by
definition. A standalone Kaiseki has no Kanri, and the human in the room is
its counterpart.

The request is one line to Kanri,
`human-needed: <what the human must do> — <why no other way> — <where: this window>`,
and the role idles until the answer. Kanri answers in one line,
`human-access: granted — <scope> — <until>` or
`human-access: denied — <alternative>`, recorded as `R-n`. On a grant Kanri
tells the human, as a numbered list: 1. `claude attach <id>` for a terminal
seat, or go to `<name> [<ref>]` for a tab seat; 2. do `<what>`; 3. ← back to
the agent view, or the tab. For a terminal seat Kanri also writes an
`attention` request, whose message is
`human-needed: <role> <topic> — claude attach <id>`, because a seat that
idles on a grant is not `blocked` in the harness's sense and the spawner's
census alone would miss it. The role's direct exchange
stays within the scope and ends with one line to Kanri,
`human-access: done — <what the human did or decided>`.

This is protocol, not enforcement: every role has its own window, and two
things stay outside the rule. The harness's own prompts — a permission dialog,
the model-mismatch stop of the start sequence — reach the human in the role's
window and cannot be routed through Kanri. And when the human speaks in a
```

**P14.10 →**

```markdown
only after Kanri has judged it necessary and granted it for that scope. Four
standing grants exist, each stated where its seat reads it at its start:
Sekkei's spec dialogue, in `roles/sekkei.md`; Keikaku's plan dialogue, in
`roles/keikaku.md`; an attached Kaiseki's debugging conversation, in its
brief; and Hosa's chores, in `roles/hosa.md`. Kikaku needs no grant: it is
the human's own seat, and the human in that window is its counterpart by
definition. A standalone Kaiseki has no Kanri, and the human in the room is
its counterpart.

The request is one line to Kanri,
`human-needed: <what the human must do> — <why no other way> — <where: this window>`,
and the role waits for the answer. Kanri answers in one line,
`human-access: granted — <scope> — <until>` or
`human-access: denied — <alternative>`, recorded as `R-n`. On a grant Kanri
tells the human, as a numbered list: 1. `tanto <role> [<topic>]` in a
terminal, or, for a dialogue seat, a click on its row in the editor's list;
2. do `<what>`; 3. ← and leave the agent view, or close the tab. Kanri also
writes an `attention` request, whose message is
`human-needed: <role> <topic> — tanto <role> [<topic>]`, because a seat that
waits on a grant is not `blocked` in the listing's sense, and the spawner's
census alone would miss it. The role's direct exchange
stays within the scope and ends with one line to Kanri,
`human-access: done — <what the human did or decided>`.

This is protocol, not enforcement: every role has its own window, and two
things stay outside the rule. The harness's own prompts, a permission dialog
among them, reach the human in the role's window and cannot be routed
through Kanri. And when the human speaks in a
```

**P14.11** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
   `S-n` table whose Source names the file and the item, and sends the
   seat `release:` for a tab seat or writes its `stop` request for a
   terminal one — a retiring Jisso's is always the latter. The spec's
```

**P14.11 →**

```markdown
   `S-n` table whose Source names the file and the item, and writes the
   seat's `stop` request, a retiring Jisso's as every other's. The spec's
```

**P14.12** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
   whose message is `kessai: <topic> — claude attach <id>`, and prints in its
```

**P14.12 →**

```markdown
   whose message is `kessai: <topic> — tanto kanri`, and prints in its
```

**P14.13** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
   exception: in Kanri's window by `claude attach`, through a Kikaku decision
   file whose third section names this recommendation and answers it, or by
   telling a live Hosa, whose chore is then the one line
```

**P14.13 →**

```markdown
   exception: in Kanri's own session, entered by `tanto`, through a Kikaku
   decision file whose third section names this recommendation and answers
   it, or by telling a Hosa, whose chore is then the one line
```

**P14.14** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
window, and the apply is shusei's and shoki's. A live Hosa is delegated none
of it and relays one line when the human answers in its tab,
```

**P14.14 →**

```markdown
window, and the apply is shusei's and shoki's. A Hosa is delegated none of
it and relays one line when the human gives it his answer,
```

**P14.15** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
never a restatement of a spec, a plan, a report, or a ledger. Kikaku and
Hosa write no shoroku proposal; the human `/clear`s those windows at will. A
standalone Kaiseki has no Kanri, and its role file says how.
```

**P14.15 →**

```markdown
never a restatement of a spec, a plan, a report, or a ledger. Kikaku and
Hosa write no shoroku proposal. A standalone Kaiseki has no Kanri, and its
role file says how.

**`taiseki`.** A Kikaku, a Hosa, and a standalone Kaiseki — the seats the
human paces — end only when he types `/tanto taiseki` in one, from a
terminal, a tab, or Remote Control alike. One never left that way stays
parked, at no cost, and the next `tanto <role>` continues it, its
`context=` printed as he enters. The seat:

1. Writes out what is unsent. A Kikaku with something decided and no file
   writes the decision file and sends its `decision:` line. A Hosa with a
   `chore:` open or a `slot-needed:` unanswered says which, and does not
   leave. A standalone Kaiseki runs its shoroku and commits, as its role
   file asks.
2. Runs `node "$TANTO/scripts/boundary.js" request leave --transcript "$T"`,
   which writes a `stop` request for its own `sessionId`, marked `self`,
   with the `after` a park request carries.
3. Ends its turn with its closing line, whose second fact is the ended
   seat's ("Messages").

The spawner honors such a stop for those three seats alone. It stops a
background seat once its turn has ended, so that the closing line is
written, and records the end at once for a seat a tab holds or one that is
not listed. A closing turn that never ends is dropped ten minutes on, with
the notice `taiseki not done: <role> — tanto <role>`, so that the word
never fails in silence. The seat is `stopped`, Kanri writes its row
`stopped` at its next census (**Ended**), and the next `tanto <role>` finds
no holder and starts a new conversation, whether or not the ended seat's
tab is still open.
```

**P14.16** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
  file does — and is stopped on its form check: no `/clear`, its
  conversation kept.
```

**P14.16 →**

```markdown
  file does — and is stopped on its form check, its conversation kept.
```

**P14.17** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
  its case closes, writes the proposal, runs the resume self-check, and
  answers `shoroku proposal: <path> — <reading>`.
```

**P14.17 →**

```markdown
  its case closes, writes the proposal, and answers
  `shoroku proposal: <path> — <reading>`.
```

**P14.18** `skills/tanto/SKILL.md` — replace exactly these 29 lines

```markdown
**The exit itself.** Every line above is sent without an idle
subscription, like every other tanto line. Kanri checks that the proposal
exists and opens with the exclusion line and a numbered list — a direct
read, since the proposal carries no headings for `sections` to select by —
or, for a Jisso, reads the report's Shoroku proposal section with the
report's others; records the rows; and sends a tab seat
`release: /clear this window` — the row going `cleared` as the line goes
out, its closing line `none — /clear this window` — or writes a terminal
seat's `stop` request, its row going `stopped`, nothing `/clear`ed and
nothing said to it. Either way Kanri tells
the human, in its own window, `<role> <name> released — its work is in
<paths>; no step needs it — /clear its window when convenient`. Nothing
waits on the human's `/clear`: the roster no longer addresses that name,
and the next `/tanto <role>` typed in that window handshakes as a new
session under the same name and a new `sessionId`. A tab seat that has
stopped answering is past answering; a terminal seat whose transcript is on
disk is not, since a resume brings it back with its whole conversation
("Resuming"). Kanri learns of either the way it learns of a missing batch
report — the human says the window is gone, a send errors and the census
that follows no longer lists it, a `no-role` comes back, the census's "Not
listed" names it, or Kanri's window wakes for another reason and the answer
has not arrived. A terminal seat is then looked for by the census, whose "Not listed" marks
its row `dead` — with an Events line naming what showed its process gone
and saying its conversation is kept — and is resumed when a line is next
due to it. A tab seat, and a terminal
seat whose resume failed, is a forced exit — the roster's Events line says
its shoroku proposal was not written and what was lost, as far as Kanri
knows — and Kanri marks the row `cleared` on a `no-role` or `dead` on the
census's "Not listed", and continues.
```

**P14.18 →**

```markdown
**The exit itself.** Every line above is sent without an idle
subscription, like every other tanto line. Kanri checks that the proposal
exists and opens with the exclusion line and a numbered list — a direct
read, since the proposal carries no headings for `sections` to select by —
or, for a Jisso, reads the report's Shoroku proposal section with the
report's others; records the rows; and writes the seat's `stop` request,
its row going `stopped`. Nothing is said to the seat and nothing to the
human: the seat's own closing line has said that it has ended. The spawner
runs no command for a seat a tab holds — `claude stop` reports success
there and stops nothing — and records it `stopped` with
`note: "in a tab"`; a `parked` seat is recorded `stopped` with
`note: "already exited"`. Ending a seat means that nothing is sent to it
again, and two obligations rest on that. A write or a `commit-ready:` event
from a seat Kanri has ended is stray, and goes by rule 5's report path. And
a `spawn` that replaces a seat — the Replace table's Sekkei, Keikaku, and
Kaiseki rows — waits while `boundary.js seat <the old sessionId>` prints
`interactive`: Kanri tells the human in one line which tab to close, and
writes the request when a later reading no longer does, so that no two
seats of one role and topic are held at once (rule 4).

A seat that stops answering before its exit is looked for, not waited on.
Kanri learns of it the way it learns of a missing batch report — the human
says so, a send errors, `seat` no longer shows it running, the census's
"Not listed" names it, or Kanri's session wakes for another reason and the
answer has not arrived. A seat whose transcript is on disk is not lost: a
parked one keeps its row `live` and is woken when a line is next due to it,
and one the census marks `dead` — with an Events line naming what showed
its process gone and saying its conversation is kept — is woken the same
way ("Resuming"). A seat whose wake failed, or that answered
`no-role` twice, is a forced exit: the roster's Events line says its
shoroku proposal was not written and what was lost, as far as Kanri knows;
the row goes `stopped` on the second `no-role` or stays `dead`; and Kanri
continues.
```

- [ ] **Step 2: Count the old values in this task's sections**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "Messages" "Human access" "Session exit" | grep -c -F -e 'tab seat' -e 'terminal seat' -e 'handshake' -e 'release:' -e 'released —' -e '/clear' -e 'cleared' -e 'orders line' -e 'self-check' -e 'claude attach' -e '<name> [<ref>]' -e 'model-mismatch' -e 'since a resumed session carries a' -e 'live Hosa'
```

Expected: `0` — A14.5's command. "Messages" includes "The brief's form"; this task's sections carry no `claude attach` at all once it lands, so the bare form is counted here, covering O12.11 and O14.3 together.

- [ ] **Step 3: Load the frontmatter as YAML**

```bash
uv run --no-project --with pyyaml python -c "import sys,yaml;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);assert ': ' not in d['description'];print('ok');print(d['name']);print(d['argument-hint'])" skills/tanto/SKILL.md
```

Expected: the frontmatter unchanged, three lines —
ok
tanto
kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 14
```

Expected: `task 14: verify clean`.

- [ ] **Step 5: Run lint per Global Constraints** on `skills/tanto/SKILL.md`.

Expected: lint passes with no file changed.

- [ ] **Step 6: Commit per Global Constraints** — subject `docs: the contract's messages, human access, and session exit for run-owned seats`, path `skills/tanto/SKILL.md`.

Expected: one commit.

### Task 15: `SKILL.md` part 4: "Artifacts", "Rules", the new "The faces of a seat"

Spec section 6's `SKILL.md` bullets for "Artifacts" and "Rules", and its new
short section, carrying 2.1 (what the park is for), section 8's C-1 to C-5,
1.2 (one holder per role, enforced by the spawner), 3.1 (a tab's name is the
editor's), and the scripts' new subcommands and ops (sections 2, 4, and 6).
"The faces of a seat" goes before "Artifacts", after "Session exit", so
that it follows the sections whose rules it explains. The README review
that `AGENTS.md` asks for after a `SKILL.md` edit is Task 23.

**Files:**

- Modify: `skills/tanto/SKILL.md` — a new "## The faces of a seat" before
  "## Artifacts"; Artifacts' spec, plan, roster, roster-archive, and inbox
  rows, the two `tanto.json` rows, the `.tanto/spawner/` row, and the scripts
  paragraph from `boundary.js`'s subcommands to `tanto.js`'s sentence; rules
  4, 5, 10, and 11.

**After this task:** `SKILL.md` names no tab seat, no terminal seat, no
handshake, no orders line, and no `tanto down`; it has a section on the
faces of a seat carrying C-1 to C-5; its Artifacts list the spawner's new
ops and `contract` file and `boundary.js`'s seven subcommands; and rule 4
says that the spawner enforces one Kanri, one Kikaku, and one Hosa. Every
needle of O12.1 to O12.12, O13.1 to O13.9, and O14.1 to O14.4 is at zero
over the whole file from here.

**Interfaces:**

- Consumes: the spawner's ops `park`, `hold`, `release` and its `contract`
  file (Tasks 1 to 4); `boundary.js`'s `request`, `seat`, `wake`, `beat`, and
  six census headings (Tasks 5, 6); the launcher's form and words (Tasks 8
  to 11).
- Produces: "The faces of a seat", which Task 12's effort paragraph and
  Task 13's "The address" and "Resuming" point at, and whose constraints the
  README states (Task 23).

**Named-mechanism sites.** C-1 to C-5 are also the README (Task 23). The
park rule is also every dialogue seat's role file (Tasks 20, 21) and
`scripts/spawner.js`'s `park` and `tryPark` (Task 3); the `waiting:` notice
is also `scripts/spawner.js`'s `noticeText` (Task 4). The spawner's ops are
also `scripts/spawner.js`'s `OPS` (Tasks 1 to 3) and
`templates/spawn-request.md` (Task 22); the `contract` file is also
`scripts/spawner.js`'s `cmdRun` (Task 4), `scripts/tanto.js`'s older-spawner
check and `cmdTeishi` (Tasks 8, 11), and the plan's Global Constraints
(section 7, step 3). `boundary.js`'s subcommands are also
`scripts/boundary.js` (Tasks 5, 6) and Task 13's "The address" and census.
The launcher's form and words are also `scripts/tanto.js` (Tasks 8 to 11),
the README (Task 23), and Task 12's word table. Rule 4's one holder is also
`scripts/spawner.js`'s `spawn` (Task 2), `scripts/tanto.js`'s role
resolution (Task 8), and Task 13's keeping rule. Rule 10 is also
`roles/kanri.md`'s opening, "you are never renamed after it" (Task 16).
Rule 11's authority sentence is also the plan's Global Constraints and
`roles/keikaku.md`'s "Kanri's orders line" (Task 20). The intake row's
writer is also "Messages"'s intake paragraph (Task 14).

O12.1, O12.2, O12.3, O12.7, O12.8, O12.9, O12.11, O13.5, and O14.4 each
carry this task's share of their lines (Tasks 12 to 14); A15.4 counts them
here at zero, and Step 3 counts every needle of Tasks 12 to 15 over the
whole file.

**O15.1** `its three subcommands are` — `boundary.js`'s subcommands, now seven (spec section 6, "Artifacts"); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O15.2** `under four headings` — the census's headings, now six (spec 2.7, Old values "`CENSUS_HEADINGS` as four"); before: 1 in `skills/tanto/SKILL.md`, after: 0. `roles/kanri.md` carries "under four headings" once (Task 19).

**O15.3** `read-only, it prints the roster's` — the census sentence that read only the listing, now also the state file (spec 2.7); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**A15.4** `skills/tanto/SKILL.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "The faces of a seat" "Artifacts" "Rules" | grep -c -F -e 'tab seat' -e 'terminal seat' -e 'handshake' -e 'cleared' -e 'refused' -e 'orders line' -e 'tanto down' -e 'claude attach <id>' -e 'live Hosa' -e 'its three subcommands are' -e 'under four headings' -e "prints the roster's"` — before: 16, with `no section The faces of a seat` on stderr, after: 0

- [ ] **Step 1: Apply the passages**

Apply P15.5 to P15.13.

**P15.5** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
## Artifacts

| Path | Writer | Readers | Content |
```

**P15.5 →**

```markdown
## The faces of a seat

Every seat is a background session the spawner started. A **face** is a
place the human talks to it from: a terminal attach, entered by
`tanto <role> [<topic>]`; a VS Code tab, opened by a click on the seat's row
in the editor's list; and Remote Control. They are faces of one seat, and
the seat is in one place at a time: the launcher refuses a seat a tab holds,
and tells the human to close the tab first.

**A dialogue seat is parked between its turns.** Sekkei, Keikaku, Kikaku,
Hosa, and Kaiseki end every turn — unless something they dispatched, a
subagent or a background command, is still running — with
`boundary.js request park`, adding `--waiting` while a question of theirs to
the human stands; their role files carry the rule. Once the turn has ended,
and the listing shows the seat idle and not held, the spawner
stops its process and keeps its conversation. That is what makes the tab a
face: a background seat that is alive shows the editor's "still open
somewhere else" notice on its row, and one that is stopped opens there with
a normal prompt box. A parked seat is woken — by the launcher's attach, a
click on its row, or Kanri's `wake` — and never handed a line: a wake
carries no prompt, and the line follows it. One woken that takes no turn is
parked again two minutes later, its own last request carried out again.
Kanri, Jisso, shoki, and the messenger are never parked; Kanri's faces are
the terminal attach and Remote Control, and it is never opened in a tab.

When a turn the run started — a peer's line, a subagent's completion — ends
on a question to the human, the spawner raises one desktop notice,
`waiting: <role> <topic> — tanto <role> [<topic>]`. A turn he started
himself raises none, and a question that already stood raises none again.

The faces come with five constraints, which the README states too:

- **C-1** — a dialogue seat is entered from a terminal by `tanto <role>`,
  not by a bare `claude attach`, and not from the agent view that ← opens:
  neither tells the spawner that the human is there, and the seat's own park
  at its turn's end closes that screen under him. Kanri is entered by
  `tanto`, and is not opened in a tab.
- **C-2** — a parked seat is offline to Remote Control until something
  wakes it. From there the human asks Kanri, which wakes it and holds it
  awake until 55 minutes after its last turn; without that hold a dialogue
  seat would be one turn long from that face.
- **C-3** — a seat started after the editor's list was loaded is in the list
  after `Developer: Reload Window`; a click on its row opens it. For about
  half a minute after a turn ends the row may still show the "open somewhere
  else" notice.
- **C-4** — a tab's turn runs at the editor's effort and on the extension's
  bundled binary; a version gap that keeps a tab from opening is accepted,
  since the terminal remains.
- **C-5** — a window reload cuts the turn of a seat open in a tab, with its
  background work; a word in the tab continues it.

## Artifacts

| Path | Writer | Readers | Content |
```

**P15.6** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```markdown
| the spec, at the path the orders line names — by default `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Keikaku, Jisso | the spec; committed by Sekkei, or by the Keikaku created after the merge when it was a draft |
| `.tanto/<topic>/spec-draft.md` | Sekkei | the spec reviewer, Kanri, Keikaku | the spec while another topic's batch is in flight; nothing is committed and no branch is cut until Keikaku commits it at its final path |
| the plan, at the path the orders line names — by default `docs/superpowers/plans/<date>-<topic>.md` | Keikaku | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its live Hosa row or its first data row | one row per seat — a tab seat's from its handshake, a terminal seat's from the spawner's result file |
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's stopped, dead, replaced, refused, and cleared rows with their last readings, and the closed plans' Events lines, appended at each plan close |
| `.tanto/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted. In flight, Live peers, and Not reconstructed in full; the rest pointers |
| `.tanto/inbox/<date>-<slug>.md` | the intake — a live Hosa, else Kanri | the close's recommender, by path; the apply, for the Triage section | a bug report received, under the sender's basename, with its Received line; its Triage section is filled by the close's apply and marks the copy triaged |
```

**P15.6 →**

```markdown
| the spec, at the path Sekkei's `spec=` key names — by default `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Keikaku, Jisso | the spec; committed by Sekkei, or by the Keikaku created after the merge when it was a draft |
| `.tanto/<topic>/spec-draft.md` | Sekkei | the spec reviewer, Kanri, Keikaku | the spec while another topic's batch is in flight; nothing is committed and no branch is cut until Keikaku commits it at its final path |
| the plan, at the path Keikaku's `plan=` key names — by default `docs/superpowers/plans/<date>-<topic>.md` | Keikaku | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its listed Hosa row or its first data row | one row per seat, written from the spawner's result file; a standalone Kaiseki and the messenger get none |
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's stopped, dead, and replaced rows with their last readings, and the closed plans' Events lines, appended at each plan close |
| `.tanto/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted. In flight, Live peers, and Not reconstructed in full; the rest pointers |
| `.tanto/inbox/<date>-<slug>.md` | the intake — a Hosa while it is listed, else Kanri | the close's recommender, by path; the apply, for the Triage section | a bug report received, under the sender's basename, with its Received line; its Triage section is filled by the close's apply and marks the copy triaged |
```

**P15.7** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config, and where the human sets `language` for every repository |
| `<cwd>/.claude/tanto.json` | the repository | every role at start, Kanri at each handshake, `scripts/reading.js` | the project expected-model config, overlaid on the personal one; committed or ignored as the repository decides |
```

**P15.7 →**

```markdown
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start; the writer of a spawn request — Kanri, or the launcher through `scripts/reading.js` | the personal expected-model config, and where the human sets `language` for every repository |
| `<cwd>/.claude/tanto.json` | the repository | every role at start; the writer of a spawn request — Kanri, or the launcher through `scripts/reading.js` | the project expected-model config, overlaid on the personal one; committed or ignored as the repository decides |
```

**P15.8** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| `.tanto/spawner/` — `pid`, `heartbeat`, `log`, `seats.json`, `requests/<id>.json`, `results/<id>.json` | the spawner, and Kanri for a request file | the launcher, Kanri | the spawner's own state: one seat entry per session it started, one request and one result per act, and the heartbeat — the epoch milliseconds of its last beat, which the launcher trusts over `pid`. The roster is not here and the spawner never reads it |
```

**P15.8 →**

```markdown
| `.tanto/spawner/` — `pid`, `heartbeat`, `contract`, `log`, `seats.json`, `requests/<id>.json`, `results/<id>.json` | the spawner; a request file by Kanri, by the launcher, or by a seat through `boundary.js request` | the launcher, Kanri, `boundary.js` | the spawner's own state: one seat entry per session it started — its status, its listed name and kind, and the contract mark of the request that spawned it; one request and one result per act, the ops being `spawn`, `stop`, `resume`, `rm`, `ack`, `attention`, `park`, `hold`, and `release`; the heartbeat — the epoch milliseconds of its last beat, which the launcher trusts over `pid`; and `contract`, holding `2`, which the spawner writes at its start and the launcher reads to know the spawner is of this contract. The roster is not here and the spawner never reads it |
```

**P15.9** `skills/tanto/SKILL.md` — replace exactly these 20 lines

```markdown
brief; its three subcommands are `check`, which runs the boundary's
read-only commands and prints their output under fixed headings, `record`,
which writes the ledger's and the roster's rows idempotently, and `census`,
which Kanri runs itself: read-only, it prints the roster's `live` and
`queued` rows against the sessions `claude agents --json` lists under the
root, under four headings — Listed, Not listed, No session id, and Not held.
`scripts/spawner.js` is the one process in a run that issues `claude --bg`,
`claude stop`, `claude rm`, and `claude --resume`: a resident started by the
launcher and never by a session, which takes request files, writes result
files, keeps `seats.json` and a heartbeat, and names each seat it spawns,
runs the spawner's census of `claude agents --json` every fifteen seconds —
which revives a seat that returns to the listing and stops one that strays
into `.claude/worktrees/` — and raises a desktop notice on a blocked seat,
on a strayed one, on a seat with no first turn two minutes after its spawn,
and on an `attention` request; `spawner.js notify --stdin` is the one-shot
an optional harness hook may call. `scripts/tanto.js` is the human's one
command — it starts the spawner when none beats, finds or asks for a Kanri,
resumes what a restart took, and prints `claude attach <id>`;
`tanto down [--seats]` stops the spawner that beats, and with `--seats` the
seats, keeping every conversation.
```

**P15.9 →**

```markdown
brief; its seven subcommands are `check`, which runs the boundary's
read-only commands and prints their output under fixed headings; `record`,
which writes the ledger's and the roster's rows idempotently; `census`,
which Kanri runs itself: read-only, it reads the spawner's state file and
prints the `spawner:` line and the roster's `live` and `queued` rows against
the sessions `claude agents --json` lists under the root, under six
headings — Listed, Parked, Ended, Not listed, No session id, and Not held
("The roster"); `request park` and `request leave`, which a seat runs for
itself, the first at the end of a dialogue seat's turn and the second for
`taiseki`; `seat`, which prints one seat's line from the state file; `wake`,
which resumes parked seats with no prompt; and `beat`, which prints the
`spawner:` line ("The address").
`scripts/spawner.js` is the one process in a run that issues `claude --bg`,
`claude stop`, `claude rm`, and `claude --resume`: a resident started by the
launcher and never by a session, which takes request files, writes result
files, keeps `seats.json`, a heartbeat, and the `contract` file, and names
each seat it spawns; refuses a second Kanri, Kikaku, or Hosa; parks a
dialogue seat once the turn its request named has ended, and stops it again
when it is woken and takes no turn; runs the spawner's census of
`claude agents --json` every fifteen seconds — which revives a seat that
returns to the listing, records a dialogue seat that leaves it `parked`, and
stops one that strays into `.claude/worktrees/` — and raises a desktop
notice on a seat blocked on a prompt, with its cause; on a turn the run
started that ends waiting on the human; on a strayed seat; on a seat with
no first turn two minutes after its spawn; on a `taiseki` not done; and on
an `attention` request, each naming the way in, `tanto <role> [<topic>]`;
`spawner.js notify --stdin` is the one-shot an optional harness hook may
call. `scripts/tanto.js` is the human's one command,
`tanto [<role>] [<topic>]`: it starts the spawner when none beats, enters
the seat of that role — Kanri when none is named — by attaching to it,
follows a Kanri handover to the successor with nothing typed, and starts a
Kanri, a Kikaku, a Hosa, or a standalone Kaiseki when none is held. Its
four words are `fukki`, which puts back what a restart took and tells
Kanri ("Resuming"); `teishi [--seats]`, which stops the spawner that beats,
and with `--seats` the run's seats, keeping every conversation; `jokyo`,
which prints the run's seats and what waits on the human, read-only; and
`taiseki`, which it answers with one line naming `/tanto taiseki`.
```

**P15.10** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, and
   one Kaiseki per topic; one **live** Jisso per topic, spawned per batch, or
   all of them spawned at the plan's landing and `queued` when the plan edits
   this skill. A session is bound to its
   cwd — CLAUDE.md, memory, and permissions all come from it.
```

**P15.10 →**

```markdown
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, and
   one Kaiseki per topic; one **live** Jisso per topic, spawned per batch, or
   all of them spawned at the plan's landing and `queued` when the plan edits
   this skill. The count is of seats held, not of tabs: the spawner refuses a
   request for a second Kanri, Kikaku, or Hosa while it holds one, a
   handover's successor excepted, and the launcher enters the holder instead
   of asking for another. A session is bound to its
   cwd — CLAUDE.md, memory, and permissions all come from it.
```

**P15.11** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
   under the spec and plan directory the orders line names — by default
```

**P15.11 →**

```markdown
   under the spec and plan directory their own prompt's keys name — by default
```

**P15.12** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```markdown
10. No `tanto` session is renamed after it has started under `/tanto` — Kanri
    included, from its start line onward. A rename changes the name the listing
    shows and the envelope's `from-name`, the ref does not change, and the old
    name stops delivering even with the ref attached (measured 2026-09-06). A
    rename before `/tanto <role>` is the human's own choice: the skill neither
    asks for one nor forbids it, and the handshake carries whatever the name
    is. The spawner names a terminal seat at its spawn, before its prompt
    runs, and nothing renames it after.
```

**P15.12 →**

```markdown
10. No seat is renamed after it starts — Kanri included, from its start line
    onward. A rename changes the name the listing shows and the envelope's
    `from-name`, the ref does not change, and the old name stops delivering
    even with the ref attached (measured 2026-09-06). The spawner names a
    seat at its spawn, before its prompt runs, and no role renames it after;
    a tab that holds the seat shows the editor's name, which changes at every
    window reload. Nothing keys on a name: a seat is its `sessionId`, and its
    name is looked up at the send ("The address").
```

**P15.13** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
    the plan's Global Constraints, Kanri's orders line, and the batch
```

**P15.13 →**

```markdown
    the plan's Global Constraints, each seat's own prompt keys, and the batch
```

- [ ] **Step 2: Count the old values in this task's sections**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "The faces of a seat" "Artifacts" "Rules" | grep -c -F -e 'tab seat' -e 'terminal seat' -e 'handshake' -e 'cleared' -e 'refused' -e 'orders line' -e 'tanto down' -e 'claude attach <id>' -e 'live Hosa' -e 'its three subcommands are' -e 'under four headings' -e "prints the roster's"
```

Expected: `0` — A15.4's command.

- [ ] **Step 3: Count every old value of Tasks 12 to 15 over the whole file**

```bash
grep -c -F -e 'tab seat' -e 'terminal seat' -e 'handshake' -e 'Handshake and roster' -e 'release:' -e 'released —' -e '/clear' -e 'cleared' -e 'orders line' -e 'tanto down' -e 'self-check' -e 'claude attach <id>' -e '<name> [<ref>]' -e 'name [ref]' -e 'mode=' -e 'transcript=' -e 'refused' -e 'live Hosa' -e 'model-mismatch' -e 'opened by the human' -e 'list those eight ids' -e 'ask them to run' -e 'Its eight keys are the seven' -e 'Kanri sends only to the names of' -e 'with no census first' -e 'word everywhere else' -e 'in any words' -e 'a bare 再開 there' -e 'its three subcommands are' -e 'under four headings' skills/tanto/SKILL.md
```

Expected: `0`. A hit names a line of `SKILL.md` that Tasks 12 to 15 left, which is a finding for Kanri, not a fix of this task's.

- [ ] **Step 4: Load the frontmatter as YAML**

```bash
uv run --no-project --with pyyaml python -c "import sys,yaml;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);assert ': ' not in d['description'];print('ok');print(d['name']);print(d['argument-hint'])" skills/tanto/SKILL.md
```

Expected: the frontmatter unchanged, three lines —
ok
tanto
kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki

- [ ] **Step 5: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 15
```

Expected: `task 15: verify clean`.

- [ ] **Step 6: Run lint per Global Constraints** on `skills/tanto/SKILL.md`.

Expected: lint passes with no file changed.

- [ ] **Step 7: Commit per Global Constraints** — subject `docs: the contract's faces of a seat, artifacts, and rules for run-owned seats`, path `skills/tanto/SKILL.md`.

Expected: one commit.

### Task 16: `roles/kanri.md` part 1: the opening, "Start", the four cases, "On a handshake", "When the plan lands"

Spec section 6's `roles/kanri.md` bullets for the opening, "Start", "The
four cases", "On a handshake", and "When the plan lands", carrying 1.1 (who
writes a Sekkei's `spawn`, `input=` as one path, a decline as an `R-n`),
1.3 (Kanri's bare name), 2.5 (how Kanri sends a seat a line, the beat, the
`unsent:` event), 3.1 (the name looked up at the send), 3.2 (the second
`no-role`), 4.7 (the old-contract rows at Start step 4), I-12 (the four
cases), and D-1 (Kanri is never parked and never in a tab). The opening
loses the `release:` lines and the handshakes; Start step 1 reads Kanri's
own name one way; step 4 finds the old-contract rows; step 5 writes the
Sekkei's `spawn` in place of an orders line; step 6 waits for no handshake
and suggests `tanto kikaku`. "The four cases" loses the same-window clauses
and the tab reminder. "On a handshake" is deleted but for its last three
paragraphs, which a new section, "Sending to a seat", holds after 2.5's
rule and 3.2's second `no-role`. "When the plan lands" names the prompt's
keys where it named the orders line.

The section `## On a handshake` is deleted, as section 6 orders, and its
three kept paragraphs stand under a new `## Sending to a seat`, the rule
they now open with; no file under `skills/tanto/` but this one names the
old heading (`git grep -F 'On a handshake'` at `a89dd16`: its own line).

This task's blocks cover lines 3 to 401 of the file at `a89dd16` and no
other; Tasks 17 to 19 cover the lines after them.

After this task, Kanri's text from its opening to "When the plan lands"
names no handshake, no tab seat, and no orders line, and states the one
rule by which Kanri sends a seat a line.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — the opening, "Start" (steps 1, 3,
  4, 5, 6), "The four cases", "On a handshake" (replaced by "Sending to a
  seat"), "When the plan lands" (steps 1 and 5, and the re-point
  paragraph).

**Interfaces:**

- Consumes: `boundary.js seat`, `wake`, and `beat` (Task 6) and the census's
  six headings (Task 5), whose output this text acts on; the spawner's
  `contract`, `succeeds`, and the one-holder refusal (Task 2); the
  launcher's old-shape line (Task 11), whose wording Start step 4 repeats.
- Produces: the section "Sending to a seat", which Tasks 17 to 19 cite by
  name for every line Kanri sends.

**Named-mechanism sites.** Found with `git grep` at `a89dd16` over
`skills/tanto/`.

- *Sending a seat a line* (`seat`, `wake`, `beat`, `unsent:` with its
  `sent:` pair): in this file, loop steps 5 and 6 and "The final batch"
  step 3 (Task 17), "A seat's exit" (Task 18), the census, "Create", and
  "Recovery" (Task 19); `SKILL.md`'s "The address" and "Resuming" (Task
  13); `scripts/boundary.js` (Task 6); `templates/roster.md`'s Events and
  `templates/kanri.md`'s `unanswered:` pair (Task 7). `unanswered:` stands
  at three `SKILL.md` lines, `roles/keikaku.md`, `templates/kanri.md`,
  `templates/kanri-handover.md`, `scripts/boundary.test.js` (two), and
  `templates/review-brief.md` (nine, a review brief's own vocabulary,
  unchanged).
- *The second `no-role`*: `SKILL.md`'s "Messages" (Task 14), which holds
  eleven of the skill's `no-role` lines; every role file's closing-line
  rule (Tasks 20, 21) and `templates/batch-prompt.md`,
  `templates/shoki-brief.md`, `templates/roster.md`, and
  `templates/kanri.md` carry the line itself, which stays.
- *The old-contract rows* (4.7): `scripts/tanto.js` (Task 11) prints the
  same line; this file's census "Not listed" bullet marks them (Task 19);
  the README's "Moving a run" (Task 23).
- *A Sekkei's prompt keys* (`input=`, `ledger=`, `spec=` a draft's path):
  this file's "Create" table (Task 19); `SKILL.md`'s Invocation prompt
  table (Task 12); `roles/sekkei.md` (Task 20);
  `templates/kikaku-decision.md` (Task 7). "orders line" stands at
  `SKILL.md` (eight lines), `roles/sekkei.md` (seven), `roles/keikaku.md`
  (two), `README.md`, `templates/kikaku-decision.md`, and
  `templates/roster.md` (one each).
- *Kanri's bare name*: the idle block (Task 19), the residency line and
  Handover step 3 (Task 17); `SKILL.md`'s "The roster" (Task 13);
  `templates/batch-prompt.md` and `templates/kanri-handover.md` (Task 22).

**O16.1** `lines to tab seats;` — the opening's ownership list, "the `release:` lines to tab seats" (section 6); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O16.2** `shake hands — you receive them from tab seats` — the opening's handshake sentence (1.1); before: 1, after: 0.

**O16.3** `name [ref]` — Kanri's own name with its `[ref]` (1.3): the opening, Start step 1 twice, loop step 6's `record` call, and "Session lifecycle"'s opening; before: 5 in `skills/tanto/roles/kanri.md` (2 in `SKILL.md`, Tasks 13 and 14; 3 in `templates/boundary-brief.md`, Task 22), after this task: 2, after Task 17: 1 (P17.28), after Task 19: 0 (P19.38). The roster's column header `Name [ref]` is capitalized and is not this needle.

**O16.4** `in a tab — and carry it` — Start step 1's second way of reading Kanri's name, from `ListAgents` in a tab (section 6); before: 1, after: 0.

**O16.5** `handshake and this start line is the only place` — Start step 1 (1.4); before: 1, after: 0.

**O16.6** `with your bare name as the address` — Start step 1's closing clause (1.3); before: 1, after: 0.

**O16.7** `send no handshake — and a Residency` — Start step 3 (1.1); before: 1, after: 0.

**O16.8** `performs it, and the orders line you` — Start step 5's draft spec (1.1); before: 1, after: 0.

**O16.9** `orders line and every request you write` — Start step 5's `branch=` (1.1); before: 1, after: 0.

**O16.10** `Until the orders line has gone to Sekkei` — Start step 5's slug override (1.1); before: 1, after: 0.

**O16.11** `Wait for the human and for handshakes` — Start step 6 (section 6); before: 1, after: 0.

**O16.12** `is named in Sekkei's orders line for` — Start step 6's input document (1.1); before: 1, after: 0.

**O16.13** `as the place to decide it — a` — Start step 6's suggestion of a typed `/tanto kikaku`, now `tanto kikaku` (1.5); before: 1, after: 0.

**O16.14** `ed its window and you started in it` — the Handover case's same-window clauses (section 6); before: 1, after: 0.

**O16.15** `unless the predecessor was an interactive tab` — the Handover case's reminder (D-1); before: 1, after: 0.

**O16.16** `typed by the human in an attached Kanri, or` — "Yours" (section 6); before: 1, after: 0.

**O16.17** `should hand over or this window should be` — "Second Kanri"'s `/clear` clause (I-12); before: 1, after: 0.

**O16.18** `whose census, once the human says the windows are back` — the Recovery case's wait (4.4); before: 1, after: 0.

**O16.19** `## On a handshake` — the section heading (section 6); before: 1, after: 0.

**O16.20** `Reply with the role's standing orders as` — the handshake's orders reply (1.1); before: 1, after: 0.

**O16.21** `or a model mismatch, gets **no row**` — the refusal (1.4); before: 1, after: 0.

**O16.22** `Send nothing to a name whose roster row is not` — the old send rule (2.5); before: 1, after: 0.

**O16.23** `one is a bare` — "a `cleared` one is a bare window", the status word (section 6); before: 1, after: 0.

**O16.24** `your line arrived: mark its row` — the first `no-role` marking a row (3.2); before: 1, after: 0.

**O16.25** `named in its Sekkei's orders line;` — the `decision:` paragraph (1.1); before: 1, after: 0.

**O16.26** `follow the constraints, your orders line, and the` — "When the plan lands" step 1 (rule 11, section 6); before: 1, after: 0.

**O16.27** `No handshake arrives and none is` — "When the plan lands" step 5 (section 6); before: 1, after: 0.

**O16.28** `outlives the topic its orders line` — the re-point paragraph (section 6); before: 1, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P16.29 to P16.43.

**P16.29** `skills/tanto/roles/kanri.md` — replace exactly these 15 lines

```markdown
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, the shoroku recommendations and the
directions, the bug intake when no Hosa is live, the spawner's request
files, the kessai, the branch, and the `release:` lines to tab seats;
the write-out itself is shoki's work, at the topic's close.
You talk to the human, Sekkei, Keikaku, Jisso, Kaiseki, and Hosa, and you are
the only role that messages Jisso; Kikaku is the human's seat and hears
nothing from you. You are the human's counterpart: a peer reaches the human
only under a grant of yours ("Human access" below).

You have done your own model and effort check, in your start line. You do not
shake hands — you receive them from tab seats, and terminal seats send none.
Your start line prints your own `name [ref]`; that is the address the
roster's first data row carries, which is the one route every seat reads,
and you are never renamed after it.
```

**P16.29 →**

```markdown
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, the shoroku recommendations and the
directions, the bug intake while no Hosa is listed, the spawner's request
files, the kessai, and the branch; the write-out itself is shoki's work, at
the topic's close.
You talk to the human, Sekkei, Keikaku, Jisso, Kaiseki, and Hosa, and you are
the only role that messages Jisso; Kikaku is the human's seat and hears
nothing from you. You are the human's counterpart: a peer reaches the human
only under a grant of yours ("Human access" below).

You have done your own model and effort check, in your start line. Every
seat, you included, is started by the spawner on a request — yours or the
launcher's — and finds its orders in its prompt's keys; none introduces
itself to you. Your start line prints your own bare name, the one the
listing prints for your `sessionId`; that is the address the roster's first
data row carries, which is the one route every seat reads. You are never
parked and never opened in a tab, so you are never renamed after it.
```

**P16.30** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```markdown
1. Read `tanto.json` as `SKILL.md` describes, write the agent definitions of
   both scopes as its start sequence prescribes, read your own `name [ref]`
   — from `claude agents --json` by your own `sessionId`, the basename of
   your transcript path, when you are a spawned Kanri, and from
   `ListAgents` when the human typed `/tanto kanri` in a tab — and carry it
   into your row exactly as the listing prints it, never a tail of it
   copied by hand, since the census compares the row against the listing
   and reads an abbreviation as a rename — and say your start line: the
```

**P16.30 →**

```markdown
1. Read `tanto.json` as `SKILL.md` describes, write the agent definitions of
   both scopes as its start sequence prescribes, read your own name from
   `claude agents --json` by your own `sessionId`, the basename of your
   transcript path — the one way there is, since every Kanri is a seat the
   spawner started — and carry it into your row exactly as the listing
   prints it, never a tail of it copied by hand, since the census compares
   the row against the listing and reads an abbreviation as a rename — and
   say your start line: the
```

**P16.31** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
   your own `model` and `effort` against `sessions.kanri`, since you send no
   handshake and this start line is the only place your own two values are
   checked,
   a mismatch of either being one line to the human and nothing switched; and
   your `name [ref]`, with your bare name as the address. Then locate your own
```

**P16.31 →**

```markdown
   your own `model` and `effort` against `sessions.kanri`, since this start
   line is the only place your own two values are checked,
   a mismatch of either being one line to the human and nothing switched; and
   your bare name, which is your address. Then locate your own
```

**P16.32** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   step 1 checked; its Transcript column your own transcript path, since you
   send no handshake — and a Residency
   row carrying today's date, your own reading, and zero counts, then go to step 5.
```

**P16.32 →**

```markdown
   step 1 checked; its Transcript column your own transcript path — and a
   Residency row carrying today's date, your own reading, and zero counts,
   then go to step 5.
```

**P16.33** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
4. Otherwise cold-read the roster, run the census
   (`node "$TANTO/scripts/boundary.js" census`, from the repository root;
   "Session lifecycle" says what it prints), and compare your own
   `sessionId`, the basename of your transcript path, with the first data
   row's, the basename of its Transcript column; then take exactly one case
   from "The four cases" below.
```

**P16.33 →**

```markdown
4. Otherwise cold-read the roster, run the census
   (`node "$TANTO/scripts/boundary.js" census`, from the repository root;
   "Session lifecycle" says what it prints), and compare your own
   `sessionId`, the basename of your transcript path, with the first data
   row's, the basename of its Transcript column; then take exactly one case
   from "The four cases" below. In the same read, find the old-contract
   rows: a row whose Status is `cleared`, and a `live` or `queued` row whose
   `sessionId` has no entry in the state file, `.tanto/spawner/seats.json`
   — a window of a run started before this contract, which is no seat of
   the run. Say in your start line
   `old-contract rows in .tanto/roster.md (<roles>): those windows are no longer seats of this run — see the README, "Moving a run"`,
   send those rows nothing, and at the census mark the `live` and `queued`
   ones `dead` ("Session lifecycle"); a `cleared` row is left as it is, for
   the archive.
```

**P16.34** `skills/tanto/roles/kanri.md` — replace exactly these 10 lines

```markdown
   lands on it. When a batch of another topic **is** in flight the checkout
   is not yours to move: the cut waits for that topic's merge, where
   "Shusei, shoki, and the landing" performs it, and the orders line you
   send Sekkei says the spec is a draft. Either way the `branch=` of every
   orders line and every request you write is the branch the tree is on
   after your cut. Never ask the
   human for the word; when the human has not yet said what the next work is,
   wait for that (step 6). Until the orders line has gone to Sekkei the human
   can override the slug and you rename the directory; after it the word is
   fixed, because Sekkei's file names carry it. Each topic keeps its own
```

**P16.34 →**

```markdown
   lands on it. When a batch of another topic **is** in flight the checkout
   is not yours to move: the cut waits for that topic's merge, where
   "Shusei, shoki, and the landing" performs it, and the Sekkei's prompt
   says the spec is a draft — its `spec=` the draft path, its `ledger=` the
   in-flight topic's ledger. Either way the `branch=` of every request you
   write is the branch the tree is on after your cut. Then **write the
   Sekkei's `spawn` request** ("Create"). A Sekkei is spawned only for a
   topic you have opened, never on a guess at the next work; the human who
   wants none for this topic says so to you, you record the words as an
   `R-n`, and nothing asks first. Never ask the
   human for the word; when the human has not yet said what the next work is,
   wait for that (step 6). Until the Sekkei's request is written the human
   can override the slug and you rename the directory; after it the word is
   fixed, because the Sekkei's prompt and its file names carry it. Each
   topic keeps its own
```

**P16.35** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```markdown
6. Wait for the human and for handshakes. An input document with decided
   items — a Kikaku decision file — is named in Sekkei's orders line for
   Sekkei to read directly, and its decided items reach `docs/` at the
   topic's close with everything else (see "Shoroku"); nothing is written
   out before Sekkei exists. When no next work
   has been named between plans, add to your line to the human a suggestion
   to open a Kikaku (`/tanto kikaku`) as the place to decide it — a
   suggestion in your own line, not an ask and not a roster
   action.
```

**P16.35 →**

```markdown
6. Wait for the human and for your seats' lines. An input document with
   decided items — a Kikaku decision file — is the Sekkei prompt's `input=`
   key, for Sekkei to read directly; a topic with several inputs names the
   one document that lists the rest, which Sekkei reads whole. Its decided
   items reach `docs/` at the topic's close with everything else (see
   "Shoroku"); nothing is written out before Sekkei exists. When no next work
   has been named between plans, add to your line to the human a suggestion
   to open a Kikaku (`tanto kikaku`, in a terminal) as the place to decide
   it — a suggestion in your own line, not an ask and not a roster action.
```

**P16.36** `skills/tanto/roles/kanri.md` — replace exactly these 29 lines

```markdown
**Handover** — `.tanto/kanri-handover.md` exists. In order: read the
handover and the ledger it names, and `progress.md` if a plan is in flight;
note whether the roster's first row carries your own name — the outgoing
Kanri `/clear`ed its window and you started in it, so the name and the
`[ref]` are the same and only the transcript differs — or another's (the
comparison that decides the Name-column rewrite below, not the row's
identity, which is its `sessionId`), and, for another's, whether the census
lists that row's `sessionId`; rewrite the roster —
your own row first with status `live`, your own transcript path in its
Transcript column, and today, your model, and your effort in its Started,
Model, and Effort columns — and its Name column too when
you started in a window other than the outgoing Kanri's, the same-window case
needing no Name rewrite because a window keeps its name and `[ref]` across a
`/clear` — the old Kanri's row `replaced` (or `dead` when the census does
not list its `sessionId`), the Residency row reset to your name and today
with zero counts and your own reading, and one Events line "handover
accepted by `<you>` from `<old>`", the two names equal in the same-window
case; read the ledger's Session events for `unanswered:` lines that have no
`answered:` pair, and the handover file's Live peers for its marks, and answer
those lines first — you announce nothing, and a peer whose line got `no-role`
back in the gap between the `/clear` and your start re-sends it to the
roster's first row on its own next wake-up; delete the handover file, because the Events line
is the record and a stale file must not start a false handover at the next
Kanri start; write a `stop` request for the predecessor's `sessionId`, which
is the whole of its retirement — its conversation is kept and nothing is
`/clear`ed — unless the predecessor was an interactive tab, in which case
remind the human in one line to `/clear` that window when convenient;
continue at the handover's Next step, which decides whether a plan is in
flight.
```

**P16.36 →**

```markdown
**Handover** — `.tanto/kanri-handover.md` exists. In order: read the
handover and the ledger it names, and `progress.md` if a plan is in flight;
note whether the census lists the outgoing Kanri's `sessionId`, the
basename of the first data row's Transcript column — a census that lists
two Kanris during a handover is this case, the outgoing one alive until
your `stop` request below; rewrite the roster —
your own row first with status `live`, your own name, your own transcript
path in its Transcript column, and today, your model, and your effort in
its Started, Model, and Effort columns — the old Kanri's row `replaced` (or
`dead` when the census does not list its `sessionId`), the Residency row
reset to your name and today with zero counts and your own reading, and
one Events line "handover accepted by `<you>` from `<old>`"; read the
ledger's Session events for `unanswered:` lines that have no `answered:`
pair, and the handover file's Live peers for its marks, and answer those
lines first — you announce nothing, and a peer whose send to the outgoing
Kanri errors once it has stopped re-sends to the roster's first row on its
own next wake-up; delete the handover file, because the Events line
is the record and a stale file must not start a false handover at the next
Kanri start; write a `stop` request for the predecessor's `sessionId`, which
is the whole of its retirement — its conversation is kept, and a human
attached to it through `tanto` is taken to you by the launcher when the
stop lands, with nothing typed; continue at the handover's Next step, which
decides whether a plan is in flight.
```

**P16.37** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```markdown
**Yours** — no handover file, and the first data row's `sessionId` is your
own. This is a `/tanto kanri` typed by the human in an attached Kanri, or
your own conversation resumed: continue where the current ledger's Progress
line says, or, if none is open, wait for the human to say what the next
work is and open the topic as step 5 says. When the row's Name is not your
name, rewrite it in place with your name and `[ref]`, status `live`, and
write the Events line `resumed: <old name> → <new name>`. No row is marked
`dead` on this case alone, and there is no tree recovery beyond
`git status`.
```

**P16.37 →**

```markdown
**Yours** — no handover file, and the first data row's `sessionId` is your
own. This is a `/tanto kanri` the human typed in your own session, reached
through `tanto`; a resume of your conversation carries `/tanto fukki`
instead and runs "Recovery" below. Continue where the current ledger's
Progress line says, or, if none is open, wait for the human to say what the
next work is and open the topic as step 5 says. When the row's Name is not
your name, rewrite it in place with your name, status `live`, and write the
Events line `resumed: <old name> → <new name>`. No row is marked `dead` on
this case alone, and there is no tree recovery beyond `git status`.
```

**P16.38** `skills/tanto/roles/kanri.md` — replace exactly these 11 lines

```markdown
**Second Kanri** — no handover file, the first data row's `sessionId` is
another's, and the census lists it. Read for the handover file once more first
— a predecessor still `busy` may be mid-write — and if it is still absent,
stop, tell the human there is a live Kanri already, and ask whether that one
should hand over or this window should be `/clear`ed. Write nothing.

**Recovery** — no handover file, the first data row's `sessionId` is
another's, and the census does not list it. Run "Recovery after a VS Code
restart" below, whose census, once the human says the windows are back,
marks `dead` every `live` row it does not list, with an Events line per row
saying whether its shoroku proposal was written and what was lost.
```

**P16.38 →**

```markdown
**Second Kanri** — no handover file, the first data row's `sessionId` is
another's, and the census lists it. Read for the handover file once more first
— a predecessor still `busy` may be mid-write — and if it is still absent,
you are a Kanri the state file holds beside the first row's that is not its
successor: a spawn the one-holder refusal let through, since a
`/tanto kanri` typed by hand stops at the start sequence's check and never
reaches this case. Stop, tell the human there is a live Kanri already and
which, and ask whether that one should hand over to you or you should end,
by a `stop` request the live one writes on the human's word. Write nothing.

**Recovery** — no handover file, the first data row's `sessionId` is
another's, and the census does not list it. Run "Recovery" below; its
census marks `dead` at once every `live` row it prints under **Not
listed**, with an Events line per row saying whether its shoroku proposal
was written and what was lost — no tab holds state the run needs, so there
is no word to wait for.
```

**P16.39** `skills/tanto/roles/kanri.md` — replace exactly these 80 lines

````markdown
## On a handshake

Four steps, in this order.

1. Read both `tanto.json` files at this moment — their presence as much as
   their content; "it existed when I last checked" is never evidence that
   either exists now —
   and check `model=` against `sessions.<role>.model` and `effort=` against
   `sessions.<role>.effort`. A mismatch of either is one line to the human
   saying which of the two differs and what runs.
2. Run the census and place the handshake's `sessionId` — the basename of
   its `transcript=` — in it. A `sessionId` the census does not list is not
   a session under this repository and gets no row: `refused`, an Events
   line, one line to the human. `transcript=unavailable` is accepted as
   before; its row carries `unavailable`, and the census leaves it alone.
   Mark `dead` every `live` row the census does not list — except while a
   restart is being recovered ("Session lifecycle") — before the new row is
   written, so that a stale row of the same role and topic refuses no fresh
   handshake as a duplicate; a `queued` row the census does not list stays
   `queued`, as "Session lifecycle" says. Then check that no live
   roster row is left for that role and topic.
3. Write or rewrite that role's roster row.
4. Reply with the role's standing orders as **one line carrying the variables**.
   There is no orders file.

   - Sekkei gets the topic, the spec location, `branch=` the branch the tree
     is on after your cut, `ledger=` the in-flight topic's ledger when one
     is in flight, and its standing grant,
     `human-access: granted — the spec dialogue — until the spec review is accepted`.
     When another topic's batch is in flight, the line says so: the spec is
     written to `.tanto/<topic>/spec-draft.md`, nothing is committed until
     the checkout frees; and it tells the spec reviewer that the in-flight
     plan's paths are out of scope.
   - Keikaku and Jisso get no orders line here and send no handshake: they
     are spawned, and the keys of their own prompt are their orders
     ("Session lifecycle", the requests table).
   - Kaiseki gets the brief path, or `no brief, stop` in a smoke test.
   - Kikaku gets your address and the open topics, if any. Hosa gets your
     address, one line, "tracked files only in a slot I give", and its
     standing grant,
     `human-access: granted — the chores the human hands you in your window — until this session ends`.
     You request
     neither session: the human opens one when there is something to think
     about or a small job to hand off, and its handshake is the first you
     hear of it.

A handshake whose `sessionId` equals a row's Transcript basename is that
row's session resumed, not a second session, whatever path its
`transcript=` spells: rewrite the row in place with the new name and
`[ref]`, status `live`, write the Events line
`resumed: <old name> → <new name>`, and send nothing but your address. A
handshake whose row the census already renamed rewrites it with the same
values and no second Events line, so that the two orders end the same. Only
a tab seat reaches this paragraph — a terminal seat sends no handshake, and
its rename is reconciled from `seats.json`'s `renamed` mark instead
("Recovery"). Step 2's one-live-row-per-role check does not refuse it. A
`/clear`ed window's old session is simply not listed, and the census, not
the handshake, decides its row; expect nothing about which role a window
takes next: the same, another, or your own successor.

A second handshake for a role and topic that already has a live row — a
Jisso's excepted, which joins that topic's queue while one Jisso is live —
or a model mismatch, gets **no row**: record it in the roster as `refused` with an
Events line saying which, and tell the human. An effort mismatch alone refuses
nothing: the row is written with the effort that runs, because `/effort` is
the human's to change in that window and the roster records what is there.
No mode warning is left to give: you write `auto` into every spawn request
yourself, and a tab seat whose `mode=` is not `auto` runs no batch.

Send nothing to a name whose roster row is not `live`: a `queued` Jisso
waits for the batch prompt that makes it live, a `cleared` one is a bare
window, and a session with no accepted row is nobody's. A reply of
`no-role` from a name you sent to means that window was `/clear`ed before
your line arrived: mark its row `cleared`, write the Events line a shoroku
proposal not written gets — what was lost, as far as you know — and treat
the exit as forced; when the row was the live Jisso's, verify the tree
first as the Replace table's first row says, and send the next queued Jisso
the resume prompt. A `no-role` from a row the census has already marked
`dead` changes nothing: whichever of the two sees the `/clear` first sets
the status, and the census marks only `live` and `queued` rows.
````

**P16.39 →**

````markdown
## Sending to a seat

A seat is its `sessionId`. Its name is whatever the listing prints for that
id now — the spawner's while it runs in the background, the editor's while
a tab holds it, a new one after every window reload — and the spawner's
census writes it into the state file at every pass. So you send a seat a
line by its `sessionId`, the name read at the moment of sending, and never
from the roster's Name cell, which is a record and not an address. Two
commands, from the repository root:

```bash
node "$TANTO/scripts/boundary.js" seat <sessionId or name>
node "$TANTO/scripts/boundary.js" wake [--hold] <sessionId> [<sessionId> ...]
```

`seat` prints one line, `<status> <name> <kind> <role> <turn>` — `<kind>`
is `background`, `interactive`, or `-` when the listing does not show the
seat; `<turn>` is `ended` or `open`, or `-` when no transcript is found —
and `spawner: beating` or `spawner: stale` under it. `wake` checks the beat,
writes a `resume` request with no prompt for each `sessionId` at once,
waits for the results up to sixty seconds in all, and prints for each seat
what `seat` would print then, or `error: <the result's error>` with its
name. What you do by the status `seat` prints:

- `running`, `blocked` — send to `<name>` with `SendMessage`. When
  `SendMessage` says the name is ambiguous, add the `[ref]` one
  `ListAgents` call prints at that moment.
- `parked`, and `gone` for any seat but a Kanri — run `wake`, then send to
  the `<name>` it prints, in the same turn. A parked seat is woken and never
  handed a line: a resume that carried one would start a copy that acts on
  it beside the seat. On `error: listed` the seat is alive after all — in a
  tab, or woken by the human — and the line goes to the name printed with
  it. Seats you will send to together — a Recovery, a boundary with two
  commit-window peers — are woken in one `wake` call and sent to afterwards,
  so that the wait is paid once.
- `stopped` — nothing is sent, but to a seat whose row's Events line says
  you stopped it to set it aside on the human's word, which you wake once the
  human has said so.
- `removed` — never. `no entry` — run the census; the row's status then
  decides.

Any other error from `wake`, and a `SendMessage` that errors, is answered
by running `seat` again and following what it prints, once. A second
failure is the Events line `unsent: <sessionId> — <the line>` and one line
to the human. A line whose answer does not come from a seat that `seat` now
shows `parked` was caught by a stop: wake the seat and send the line again;
the seat reads it twice and answers once. When the human asks you, from
anywhere — Remote Control included — to talk to a parked seat, run
`wake --hold` on it ("Create").

**The beat comes before every request.** Run
`node "$TANTO/scripts/boundary.js" beat`, which prints the `spawner:` line,
before you write a `spawn`, a `stop`, an `attention`, or an `ack`; `wake`
runs it itself. On `spawner: stale` write no request: record what you owe
as the Events line `unsent: <sessionId or op> — <the line or the request>`
— through `record --event` in the open ledger, in the roster's Events when
none is open — and tell the human in one line to run `tanto fukki`, saying
that a stale spawner raises no notice of its own. "Recovery" sends every
`unsent:` that has no `sent:` pair and writes the pair. A pair is matched
on the text after the prefix, without the batch suffix, `(batch <X>)`,
that `record --event` appends at a boundary, and two different lines to
one seat are two events.

**A `no-role` reply** means the line reached a session that holds no role —
a name read seconds before a window reload gave it to another window. Run
`seat` again and send once more, marking no row. A second `no-role` from
one `sessionId` is the end of that seat: a seat held in a tab whose chat
the human cleared is a bare window under a known row. Write the Events line
a shoroku proposal not written gets — what was lost, as far as you know —
and the row `stopped`; when the row was the live Jisso's, verify the tree
first as the Replace table's first row says; then take the Replace table's
row for its role.
````

**P16.40** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
the next `I-n` in that topic's `spec-inputs.md`; between plans it is the
next topic's input document, named in its Sekkei's orders line; a file
```

**P16.40 →**

```markdown
the next `I-n` in that topic's `spec-inputs.md`; between plans it is the
next topic's input document, its Sekkei prompt's `input=` key; a file
```

**P16.41** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   the run's sessions follow the constraints, your orders line, and the
   batch prompts rather than the role text on disk, and the boundary the plan
   names for a role start or replacement (contract rule 11); every batch
```

**P16.41 →**

```markdown
   the run's sessions follow the constraints, the keys of the prompts your
   requests carry, and the batch prompts rather than the role text on disk,
   and the boundary the plan names for a role start or replacement
   (contract rule 11); every batch
```

**P16.42** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
5. Write the roster rows of whatever the result files carry when you next
   touch the roster — `queued` for the seats of a skill-editing plan, `live`
   for the one that has the batch A prompt. No handshake arrives and none is
   answered.
```

**P16.42 →**

```markdown
5. Write the roster rows of whatever the result files carry when you next
   touch the roster — `queued` for the seats of a skill-editing plan, `live`
   for the one that has the batch A prompt.
```

**P16.43** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
**In the same act, re-point every peer of another topic at the new ledger.**
A Sekkei or Keikaku that outlives the topic its orders line's `ledger=`
named goes on writing `commit-ready:` to a ledger no boundary reads any
```

**P16.43 →**

```markdown
**In the same act, re-point every peer of another topic at the new ledger.**
A Sekkei or Keikaku that outlives the topic its prompt's `ledger=` key
named goes on writing `commit-ready:` to a ledger no boundary reads any
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 16
```

Expected: `task 16: verify clean`.

- [ ] **Step 3: Lint**

Run lint per Global Constraints on `skills/tanto/roles/kanri.md`.

Expected: lint passes with no file changed.

- [ ] **Step 4: Commit**

Commit per Global Constraints, the subject
`docs: Kanri sends a seat a line by its sessionId, writes the Sekkei's spawn, and shakes no hands`,
the path `skills/tanto/roles/kanri.md`.

Expected: one commit.

### Task 17: `roles/kanri.md` part 2: "The batch loop", "The final batch", "The Kaiseki branch", "Handover"

Spec section 6's `roles/kanri.md` bullets for "The batch loop", "The final
batch", "The Kaiseki branch", and "Handover", carrying 1.1 (an attached
Kaiseki's brief before its `spawn`, rule 9's two acts, the Measurements
row), 1.2 (`succeeds:` on the successor's `spawn`), 1.3 (bare names in the
`record` call, the peer readings, the residency line, and the handover
file), 2.5 (sending by `seat` and `wake`, the beat), 2.7 (the census at
every boundary, in loop step 6 before the next request), and 5.1 (a seat
ends by Kanri's `stop` request, and nothing is said to it). Loop step 4
writes a Sekkei's or a Kaiseki's `spawn` where it made an ask, and a `stop`
request where it sent `release:`; step 5 wakes the commit-window peers;
step 6 runs the census and the beat before the next request and records
bare names with no `cleared`. "The final batch" stops the last
implementation batch's Jisso. The Kaiseki branch writes the brief first.
"Handover" names no handshake and no self-check, prints bare names, lists
peers by `sessionId`, and its successor's request carries `contract: 2` and
`succeeds:`; the outgoing Kanri's own `stop`, in the Handover case, stays
(Task 16).

This task's blocks cover lines 402 to 1036 of the file at `a89dd16`, all
but lines 535 to 573 — the idle block inside loop step 4, which is Task
19's.

After this task, the batch loop, the final batch, the Kaiseki branch, and
the handover end every seat by a `stop` request, send every line by
"Sending to a seat", and carry no `[ref]` of Kanri's own.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — "The batch loop" (steps 2, 4, 5,
  and 6, the idle block excepted), "The final batch" (steps 2 and 3), "The
  Kaiseki branch" (steps 2, 5, and 6), "Handover" ("The trigger", "The
  residency line", "The handover file", and steps 3 and 4 of "The handover,
  in a plan and between plans").

**Interfaces:**

- Consumes: "Sending to a seat" (Task 16); the census's six headings (Task
  5) and `boundary.js seat`, `wake`, and `beat` (Task 6); the spawner's
  `succeeds` and `contract` (Task 2); `templates/boundary-brief.md`'s
  `record` call with bare names (Task 22), whose `--status` and
  `--peer-reading` arguments this text fills.
- Produces: the successor's `spawn` with `succeeds:`, which the launcher's
  follow loop (Task 9) and the spawner's refusal (Task 2) read.

**Named-mechanism sites.** Found with `git grep` at `a89dd16` over
`skills/tanto/`.

- *`<name> [<ref>]`*: eight lines of this file (this task's four, Task 18's
  "Human access", Task 19's idle block, three); `SKILL.md`, seven (Tasks
  13 to 15); `templates/kanri-handover.md`, two, and
  `templates/batch-prompt.md`, one (Task 22); `templates/roster.md`, ten,
  and `templates/roster-archive.md`, one (Task 7's files; their placeholder
  rows are not named by section 6, and the `Name [ref]` column stays);
  `scripts/boundary.test.js`, one. `<name [ref]>` is
  `templates/boundary-brief.md`'s three (Task 22) and one `SKILL.md` line.
  `boundary.js`'s `PEER` pattern takes the `[ref]` as optional, so
  `<role> <name> <reading>` parses unchanged.
- *A seat's end by `stop`* (`release:` retired): `SKILL.md`, seven lines
  (Task 14); `roles/sekkei.md`, three, `roles/kikaku.md`, two,
  `roles/kaiseki.md` and `roles/hosa.md`, one each (Tasks 20, 21);
  `templates/kanri.md` and `templates/roster.md`, one each (Task 7); in
  this file, "Shoroku" and "A seat's exit" (Task 18) and the Release table
  (Task 19).
- *The census at every boundary, and the beat*: "Sending to a seat" (Task
  16), the census paragraph and "Create" (Task 19); `SKILL.md`'s "The
  roster" (Task 13). "with no census first" also stands at one `SKILL.md`
  line, "Resuming" (Task 13).
- *`succeeds:`*: `scripts/spawner.js` and its test (Tasks 1, 2), `tanto.js`'s
  follow loop (Task 9), `templates/spawn-request.md` (Task 22), and this
  file's "Create" row for a handover (Task 19).
- *Rule 9's two acts*: `SKILL.md`'s "Rules" (Task 15) holds rule 9, which
  stands as it is; `roles/sekkei.md` (Task 20) and `roles/kaiseki.md`
  (Task 21).

The handover `spawn` of step 4 gains `succeeds:` and `contract: 2`; no
needle spans that change without a backtick in it, so P17.39's `verify` is
its check.

**O17.1** `name> [<ref>]` — `<name> [<ref>]`, a name with its `[ref]` (the needle drops the leading `<`, which the lead's grammar reads as a placeholder), which no seat writes about itself (1.3): the peer-reading line, the residency lines twice, and the handover Events line here; "Human access" (Task 18); the idle block's identity line, three times (Task 19); before: 8 in `skills/tanto/roles/kanri.md`, after this task: 4, after Task 18: 3, after Task 19: 0.

**O17.2** `If an ask of the human is due` — loop step 4's ask (1.1); before: 1, after: 0.

**O17.3** `line goes to it and nothing is` — loop step 4's retiring Jisso (5.1); before: 1, after: 0.

**O17.4** `call, and send` — loop step 4's `release:` on a passed form check (5.1); before: 1, after: 0.

**O17.5** `naming any Kaiseki ask` — loop step 5 (c)'s boundary line (1.1); before: 1, after: 0.

**O17.6** `with no census first` — loop step 6's send (2.5); before: 1 in `skills/tanto/roles/kanri.md` (1 in `SKILL.md`, Task 13), after: 0.

**O17.7** `request for a terminal` — loop step 6's resume of a terminal seat (2.5); before: 1, after: 0.

**O17.8** `cleared" --status` — loop step 6's `record` call (1.3, section 6); before: 1, after: 0.

**O17.9** `released at step 4` — loop step 6's Status changes (5.1); before: 1, after: 0.

**O17.10** `to the Jisso that ran the last implementation batch` — "The final batch" step 2's `release:` (section 6); before: 1, after: 0.

**O17.11** `release at the boundary, not one` — "The final batch" step 2's exception (5.1); before: 1, after: 0.

**O17.12** `the spare queued window is named` — "The final batch" step 2's spare seat (5.1); before: 1, after: 0.

**O17.13** `sent on the roster as recorded` — "The final batch" step 3's `close:` line (2.5); before: 1, after: 0.

**O17.14** `create Kaiseki; after its handshake` — "The Kaiseki branch" step 2 (1.1); before: 1, after: 0.

**O17.15** `which is not released` — "The Kaiseki branch" step 5 (section 6); before: 1, after: 0.

**O17.16** `its form check, then` — "The Kaiseki branch" step 6's `release:` (section 6); before: 1, after: 0.

**O17.17** `the handshakes, a resume` — "The trigger" (section 6); before: 1, after: 0.

**O17.18** `no resume self-check at any of these points` — "The trigger"'s self-check (3.1); before: 1, after: 0.

**O17.19** `census to detect (1.7)` — "The trigger"'s terminal-seat rename (3.1); before: 1, after: 0.

**O17.20** `is the identity, and no request and no ask` — "The residency line" (1.3); before: 1, after: 0.

**O17.21** `open topic, each with its Topic and what it is waiting for` — "The handover file"'s Live peers, now by `sessionId` (1.3); before: 1, after: 0.

**O17.22** `name and place and get nothing` — the `queued` Jissos of Live peers (1.3); before: 1, after: 0.

**O17.23** `and a Keikaku whose last line did the same is` — "The handover file"'s "waiting for nothing but `release:`" (section 6); before: 1, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P17.24 to P17.39.

**P17.24** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   as text. The readings are the ones peers' last lines carried since the
   previous boundary, one `<role> <name> [<ref>] <reading>` per line. The
```

**P17.24 →**

```markdown
   as text. The readings are the ones peers' last lines carried since the
   previous boundary, one `<role> <name> <reading>` per line, the name bare.
   The
```

**P17.25** `skills/tanto/roles/kanri.md` — replace exactly these 24 lines

```markdown
   If an ask of the human is due — a Sekkei or a Kaiseki — make it, unless a
   handover trigger has fired, in which case the
   successor makes it from the handover's Next step. Then the exits that
   fall at this boundary, per "A seat's exit": the retiring Jisso's proposal
   is its report's Shoroku proposal section, recorded by the brief at step 2,
   so write its `stop` request now and let step 6's `record` call mark its
   row `stopped`; no `release:` line goes to it and nothing is `/clear`ed,
   and its conversation is kept on the same terms as `.tanto/<topic>/` — it
   is never `rm`ed — a batch returned for rework
   is not accepted, and its Jisso stays live for the rework prompt — a file
   of its own, which step 6 writes — and the
   Jisso whose boundary is the plan's last waits — the last implementation
   batch's while the review is pending, and the fix wave's — see
   "The final batch", steps 2 and 3; if a
   release or a replace of another live, coherent session is due, or a
   handover trigger has fired, send the `exit:` lines to
   the sessions whose proposal is not already named — a Sekkei or Keikaku at
   its own final boundary named it in its report line and is waiting for
   nothing — check each proposal's form, name its items as `--s-item`
   arguments of step 6's `record` call, and send `release:` as soon as the
   form check passes; when the trigger that fired is your own handover, write
   your own proposal here too, as "Handover" step 1 says, so that it is done
   when that list is reached. Nothing is recommended or applied before the
   close.
```

**P17.25 →**

```markdown
   If a Sekkei's or a Kaiseki's `spawn` request is due ("Create"), write it,
   unless a handover trigger has fired, in which case the
   successor writes it from the handover's Next step. Then the exits that
   fall at this boundary, per "A seat's exit": the retiring Jisso's proposal
   is its report's Shoroku proposal section, recorded by the brief at step 2,
   so write its `stop` request now and let step 6's `record` call mark its
   row `stopped`; nothing is said to it, and its conversation is kept on
   the same terms as `.tanto/<topic>/` — it
   is never `rm`ed — a batch returned for rework
   is not accepted, and its Jisso stays live for the rework prompt — a file
   of its own, which step 6 writes — and the
   Jisso whose boundary is the plan's last waits — the last implementation
   batch's while the review is pending, and the fix wave's — see
   "The final batch", steps 2 and 3; if the end or the replacement of
   another live, coherent seat is due, or a
   handover trigger has fired, send the `exit:` lines to
   the seats whose proposal is not already named — a Sekkei or Keikaku at
   its own final boundary named it in its report line and is waiting for
   nothing — check each proposal's form, name its items as `--s-item`
   arguments of step 6's `record` call, and write each seat's `stop`
   request as soon as its form check passes; when the trigger that fired is
   your own handover, write
   your own proposal here too, as "Handover" step 1 says, so that it is done
   when that list is reached. Nothing is recommended or applied before the
   close.
```

**P17.26** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
   pair, and a peer with no event is sent nothing and answers nothing. Send
   each one line — the boundary is verified, commit, naming any Kaiseki ask
   or release since the last boundary — and wait for its
   `committed <subject> — <reading>` before the next spawn;
```

**P17.26 →**

```markdown
   pair, and a peer with no event is sent nothing and answers nothing. Send
   each one line — the boundary is verified, commit, naming any Kaiseki
   spawned or ended since the last boundary — by "Sending to a seat", the
   peers woken in one `wake` call, and wait for its
   `committed <subject> — <reading>` before the next spawn;
```

**P17.27** `skills/tanto/roles/kanri.md` — replace exactly these 14 lines

```markdown
   says them after a compaction. Then **write the `spawn` request** for the
   next Jisso — `<Y>` the next batch's letter, the path the boundary brief
   rendered — with `batch=.tanto/<topic>/batch-<Y>-prompt.md`; under a
   skill-editing plan's queue, send the next `queued` seat the one line
   `batch: .tanto/<topic>/batch-<Y>-prompt.md` with the `no-role` line
   after it instead, without an idle subscription. That send goes on the
   roster as recorded, with no census first, and the seat's row goes `live`
   before it — the send and the rewrite are one act, whether the prompt is
   this boundary's render or one a handover left you already rendered for
   an already-`queued` seat: a send that errors, or a row the roster records `dead`, is
   `SKILL.md`'s Resuming — the census, a `resume` request for a terminal
   seat it does not list, a stale entry with no `pid` included, and the line
   sent again when the result lands, to the name the result carries. Then
   this boundary's `record` call:
```

**P17.27 →**

```markdown
   says them after a compaction. Before the next request, run the census
   and act on what it prints ("Session lifecycle"), and then `beat`
   ("Sending to a seat"). Then **write the `spawn` request** for the
   next Jisso — `<Y>` the next batch's letter, the path the boundary brief
   rendered — with `batch=.tanto/<topic>/batch-<Y>-prompt.md`; under a
   skill-editing plan's queue, send the next `queued` seat the one line
   `batch: .tanto/<topic>/batch-<Y>-prompt.md` with the `no-role` line
   after it instead, without an idle subscription. That send goes by
   "Sending to a seat", and the seat's row goes `live` before it — the send
   and the rewrite are one act, whether the prompt is this boundary's
   render or one a handover left you already rendered for an
   already-`queued` seat: a queued Jisso the supervisor collected reads
   `gone` and is woken first, and a wake that fails is the Replace table's
   first row. Then this boundary's `record` call:
```

**P17.28** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
     --status "<name [ref]> cleared" --status "<name [ref]> live" \
```

**P17.28 →**

```markdown
     --status "<name> stopped" --status "<name> live" \
```

**P17.29** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   Progress line, the Status changes this boundary decided — the retiring
   Jisso `stopped`, the Jisso you have just started `live`, a tab seat
   released at step 4 `cleared` — one `--s-item` per item of a shoroku
```

**P17.29 →**

```markdown
   Progress line, the Status changes this boundary decided — the retiring
   Jisso `stopped`, the Jisso you have just started `live`, any other seat
   step 4 ended `stopped`, each by its bare name — one `--s-item` per item of a shoroku
```

**P17.30** `skills/tanto/roles/kanri.md` — replace exactly these 13 lines

```markdown
2. Turn its findings into one more batch prompt — the final batch — and send
   it to the next queued Jisso, as any batch. In that same turn send
   `release:` to the Jisso that ran the last implementation batch — its wait
   ended with this review's verdict. Two Jissos are the exception
   to loop step 4's release at the boundary, not one: the Jisso that ran
   the last implementation batch, whose `release:` waits for this review's
   verdict and goes out when the fix-wave prompt goes to its successor; and
   that successor, the fix-wave Jisso, who does not release at its own
   boundary either, but takes step 3's `close:` line once you accept the fix
   wave. When the review has no findings there is no fix wave: the
   last-implementation-batch Jisso stays live and takes step 3's `close:` line
   directly, and the spare queued window is named in the close's released
   line for the human to `/clear`. A fix-wave list is
```

**P17.30 →**

```markdown
2. Turn its findings into one more batch prompt — the final batch — and send
   it to the next queued Jisso, as any batch. In that same turn write the
   `stop` request of the Jisso that ran the last implementation batch — its
   wait ended with this review's verdict. Two Jissos are the exception
   to loop step 4's stop at the boundary, not one: the Jisso that ran
   the last implementation batch, whose `stop` request waits for this
   review's verdict and is written when the fix-wave prompt goes to its
   successor; and that successor, the fix-wave Jisso, who is not stopped at
   its own boundary either, but takes step 3's `close:` line once you accept
   the fix wave. When the review has no findings there is no fix wave: the
   last-implementation-batch Jisso stays live and takes step 3's `close:` line
   directly, and the spare queued seat gets its `stop` request with the
   close's. A fix-wave list is
```

**P17.31** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   — sent on the roster as recorded, as loop step 6 sends a `batch:` line,
   so that a Jisso gone while it waited through the review and the fix wave
   is resumed first and the line sent again — check the proposal's form,
```

**P17.31 →**

```markdown
   — sent by "Sending to a seat", as loop step 6 sends a `batch:` line,
   so that a Jisso gone while it waited through the review and the fix wave
   is woken first — check the proposal's form,
```

**P17.32** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```markdown
2. Classify. Known cause — rule and send Jisso back to work. Unknown — ask the
   human to create Kaiseki; after its handshake, write
   `.tanto/<topic>/kaiseki-<n>-brief.md` from
   `templates/kaiseki-brief.md`, its Human access line filled — the debugging
   conversation in Kaiseki's window until its report is written, unless you
   judge otherwise — and send its path, without an idle subscription. If the
   human declines to create Kaiseki, rule `continue the SDD rounds`: Jisso
   resumes at round 3 with the resumed implementer, and rounds 4-5 go to
   `task.escalate`.
```

**P17.32 →**

```markdown
2. Classify. Known cause — rule and send Jisso back to work. Unknown — write
   `.tanto/<topic>/kaiseki-<n>-brief.md` from
   `templates/kaiseki-brief.md` first, since the Kaiseki's prompt carries
   its path, its Human access line filled — the debugging conversation with
   the human in Kaiseki's own session until its report is written, unless
   you judge otherwise. Then write the Kaiseki's `spawn` request ("Create"),
   once `boundary.js seat` shows every Sekkei of the run with no turn in
   progress — `parked`, or `running` with its fifth word `ended`. While the
   Kaiseki is active you send a Sekkei nothing and wake none (rule 9); a
   wake that makes a second top-family seat run is the Session event the
   Measurements row "top-family sessions active at once" is filled from.
   When the human has said no Kaiseki for this case, rule
   `continue the SDD rounds`: Jisso resumes at round 3 with the resumed
   implementer, and rounds 4-5 go to `task.escalate`.
```

**P17.33** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   `kaiseki-<n+1>-brief.md` sent to the **same** Kaiseki, which is not released
```

**P17.33 →**

```markdown
   `kaiseki-<n+1>-brief.md` sent to the **same** Kaiseki, which has not ended
```

**P17.34** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   is open, run Kaiseki's exit as "A seat's exit" below prescribes — its
   proposal, its form check, then `release:` — or keep it if more of the
   same bug is expected. Not before: a fix that misses goes back to
```

**P17.34 →**

```markdown
   is open, run Kaiseki's exit as "A seat's exit" below prescribes — its
   proposal, its form check, and then its `stop` request — or keep it if
   more of the same bug is expected. Not before: a fix that misses goes back to
```

**P17.35** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```markdown
start of every turn while no batch is in flight, because your context grows
there — a between-plans inbox sweep, the handshakes, a resume — with no
batch boundary to catch it;
and Timing below admits a handover there, for the reason it gives. You run
no resume self-check at any of these points, here or at loop step 6: a
terminal seat's rename is the spawner's census to detect (1.7), and your
own identity is the `sessionId` your request carried or your transcript's
own path, never a `ListAgents` reading of your own.
```

**P17.35 →**

```markdown
start of every turn while no batch is in flight, because your context grows
there — a between-plans inbox sweep, a Kikaku's decision, a resume — with
no batch boundary to catch it;
and Timing below admits a handover there, for the reason it gives. You read
no name of your own from `ListAgents` at any of these points, here or at
loop step 6: a seat's name is whatever the listing prints for its
`sessionId`, which the spawner's census writes into the state file, and
your own identity is the `sessionId` your request carried or your
transcript's own path.
```

**P17.36** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

````markdown
mid-plan question. The `[<ref>]` is the identity, and no request and no ask
carries it: every seat reads the roster's first data row.

```text
Kanri stays — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover not due.
Kanri hands over — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover written.
```
````

**P17.36 →**

````markdown
mid-plan question. The name is your bare name, as the roster's first data
row carries it, and no request carries it: every seat reads that row.

```text
Kanri stays — <name> — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover not due.
Kanri hands over — <name> — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover written.
```
````

**P17.37** `skills/tanto/roles/kanri.md` — replace exactly these 12 lines

```markdown
is even written. Live peers lists every peer of every
open topic, each with its Topic and what it is waiting for, and marks the ones
whose last line you had not answered: the successor answers those marked lines
first, pairing them with the ledger's `unanswered:` events, and announces
nothing. The `queued` Jissos are listed after them by
name and place and get nothing, since their batch prompt is a path they read
at their own wake-up.
A Sekkei whose last line named a shoroku proposal is waiting
for nothing but `release:`, and a Keikaku whose last line did the same is
waiting for its `stop` request instead; your successor's first act for it
is that line or that request, if the proposal's form check is recorded in
the ledger and it had not yet gone out.
```

**P17.37 →**

```markdown
is even written. Live peers lists every peer of every
open topic, each by its `sessionId` and its bare name as last read, with its
Topic and what it is waiting for, and marks the ones
whose last line you had not answered: the successor answers those marked lines
first, pairing them with the ledger's `unanswered:` events, and announces
nothing. The `queued` Jissos are listed after them by `sessionId`, name,
and place and get nothing, since their batch prompt is a path they read
at their own wake-up.
A Sekkei or a Keikaku whose last line named a shoroku proposal is waiting
for its `stop` request alone; your successor's first act for it is that
request, if the proposal's form check is recorded in the ledger and the
request had not yet been written.
```

**P17.38** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   Release table's row keys on, so leave it and record "handover written by
   `<name> [<ref>]`" as a roster Events line. **Between plans** there is no
```

**P17.38 →**

```markdown
   Release table's row keys on, so leave it and record "handover written by
   `<name>`", your bare name, as a roster Events line. **Between plans** there is no
```

**P17.39** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
4. Write the `spawn` request for `/tanto kanri` on `sessions.kanri`, print
   the "Kanri hands over" line, and idle
```

**P17.39 →**

```markdown
4. Write the `spawn` request for `/tanto kanri` on `sessions.kanri`, with
   `contract: 2` and `succeeds: <your own sessionId>` — the spawner refuses
   a second Kanri but to a request that names the holder it succeeds — print
   the "Kanri hands over" line, and idle
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 17
```

Expected: `task 17: verify clean`.

- [ ] **Step 3: Lint**

Run lint per Global Constraints on `skills/tanto/roles/kanri.md`.

Expected: lint passes with no file changed.

- [ ] **Step 4: Commit**

Commit per Global Constraints, the subject
`docs: Kanri's batch loop, final batch, Kaiseki branch, and handover end seats by a stop request and send by sessionId`,
the path `skills/tanto/roles/kanri.md`.

Expected: one commit.

### Task 18: `roles/kanri.md` part 3: "Shoroku", "A seat's exit", "Bug intake", "Limits", "Human access"

Spec section 6's `roles/kanri.md` bullets for "Shoroku" ("The four
steps"), "A seat's exit", "Bug intake" and its "Limits", and "Human
access", carrying 1.1 (the kessai's and `human-needed:`'s way in named
`tanto <role> [<topic>]`; the standing grants stated in the role files and
the brief), 1.4 (no model-mismatch stop), 3.1 (the bug intake while a Hosa
is parked), 4.4 (the quota's return is `fukki`, and "Recovery" probes),
and 5.1 (a seat ends by Kanri's `stop` request with nothing said; the two
obligations that rested on the process being gone). "The four steps" ends
a proposal's seat by `stop`, writes the kessai's `attention` with
`tanto kanri`, and has the human answer through `tanto`. "A seat's exit"
loses the `release:` half, the released line, the resume self-check, and
the tab-seat paragraph, and gains 5.1's two obligations. "Limits" points at
"Recovery". "Human access" gives one form of the grant's steps, names where
the four standing grants now stand, and loses the model-mismatch stop.

Two sites section 6 does not name, taken so that this file does not
contradict itself, and reported to Keikaku: "Bug intake"'s opening, whose
"The intake is a `live` Hosa" is 3.1's rule read with live meaning listed;
and "The hotfix lane"'s suggestion of a typed `/tanto hosa`, which stops
under 1.5 and becomes `tanto hosa`, as Start step 6's Kikaku suggestion
does (Task 16).

This task's blocks cover lines 1037 to 1576 of the file at `a89dd16` and no
other.

After this task, Kanri's close, exits, intake, limits, and human access end
a seat by a `stop` request with nothing said to it, name `tanto <role>` as
every way in, and leave the quota's return to "Recovery".

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — "Shoroku" ("The four steps",
  steps 1 and 3), "A seat's exit" (steps 1 and 2 and the paragraph after
  them), "Bug intake" (its opening, "The hotfix lane", "Limits" step 2),
  "Human access" (steps 2 and 3 and its last paragraph).

**Interfaces:**

- Consumes: "Sending to a seat" (Task 16), for the `beat` before every
  `attention` request; `boundary.js seat` (Task 6), for the replacement's
  wait; the spawner's `stop` of a seat a tab holds, which records it with
  no command (Task 1); "Recovery" (Task 19), which this text points at.
- Produces: the obligations a later Kanri keeps for an ended seat; the
  kessai's `attention` message `kessai: <topic> — tanto kanri`, which the
  spawner raises as written (Task 4 removes its `<id>` fill).

**Named-mechanism sites.** Found with `git grep` at `a89dd16` over
`skills/tanto/`.

- *A way in named `tanto <role> [<topic>]`* (in place of
  `claude attach <id>`): `claude attach <id>` stands at five lines of this
  file (four here, the census's `no first turn:` bullet in Task 19), five
  of `SKILL.md` (Tasks 13 to 15), two of `README.md` (Task 23), and one
  each of `scripts/spawner.js` and its test (Tasks 1, 4, the hook line for
  a session the state file does not hold keeping it). The kessai's
  `attention` also stands in `SKILL.md`'s "Session exit" (Task 14) and in
  `scripts/spawner.test.js` (two lines, Task 4); `human-needed:` in
  `SKILL.md` (two lines, Task 14), every role file but Kanri's and Hosa's
  (Tasks 20, 21), `templates/batch-prompt.md` (Task 22),
  `templates/kaiseki-brief.md` (not named by section 6; its line tells
  Kaiseki to ask for more access, and names no way in), and `scripts/spawner.test.js`.
- *The standing grants*: `SKILL.md`'s "Human access" (Task 14);
  `roles/sekkei.md` and `roles/keikaku.md` (Task 20, which states
  Sekkei's); `roles/hosa.md` (Task 21, which states Hosa's);
  `templates/kaiseki-brief.md`'s Human access section, unchanged.
- *A seat's end by `stop`, nothing said*: `release: /clear this window`
  stands in `SKILL.md` (two lines, Task 14), `roles/sekkei.md` (two, Task
  20), and `roles/kaiseki.md` (one, Task 21); `released —` in `SKILL.md`
  (Task 14) and `templates/roster.md` (Task 7's file); in this file, loop
  step 4 (Task 17) and the Release table and "Session lifecycle"'s opening
  (Task 19). 5.1's closing line, which tells the human to close the tab,
  is every dialogue seat's role file's (Tasks 20, 21) and `SKILL.md`'s
  "Messages" (Task 14).
- *The bug intake*: `roles/hosa.md`'s "Whose work you take" (Task 21);
  `SKILL.md`'s "Messages" bug-report paragraph (Task 14); this file's
  opening (Task 16) and "Reporting from the other side", which already
  checks the name against `ListAgents` and is unchanged.
- *The quota's return as `fukki`*: `SKILL.md`'s "The expected-model config"
  limits list (Task 12); "Recovery" (Task 19).

**O18.1** `record its rows; then` — "The four steps" step 1's `release:` (5.1); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O18.2** `kessai: <topic> — claude attach <id>` — the kessai's `attention` message (1.1); before: 1 (1 in `SKILL.md`, Task 14), after: 0.

**O18.3** `the spawner filling the id from` — the spawner's `<id>` fill (1.1, section 6); before: 1, after: 0.

**O18.4** `type, ← back to the` — the human's answer through `claude attach` (1.1); before: 1, after: 0.

**O18.5** `The session writes it, runs its resume` — "A seat's exit" step 1's self-check (3.1); before: 1, after: 0.

**O18.6** `release: /clear this window` — "A seat's exit" step 2 (5.1); before: 1 (2 in `SKILL.md`, Task 14; 2 in `roles/sekkei.md`, Task 20; 1 in `roles/kaiseki.md`, Task 21), after: 0.

**O18.7** `released —` — the released line (5.1); before: 2 in `skills/tanto/roles/kanri.md` — "A seat's exit" here and "Session lifecycle"'s opening, removed by P19.38 — (1 in `SKILL.md`, Task 14; 1 in `templates/roster.md`, Task 7's file), after this task: 1, after Task 19: 0.

**O18.8** `A tab seat that has stopped answering is past answering` — the tab-seat paragraph (section 6); before: 1, after: 0.

**O18.9** `know, mark the row` — a forced exit marked by the `cleared` status (5.1); before: 1, after: 0.

**O18.10** `Hosa; you are the intake only` — the intake read as a `live` Hosa (3.1); before: 1, after: 0.

**O18.11** `a suggestion to open one (` — "The hotfix lane"'s typed `/tanto hosa` (1.5); before: 1, after: 0.

**O18.12** `you may probe the family once` — "Limits" step 2's probe on the human's word (4.4); before: 1, after: 0.

**O18.13** `a terminal seat, or go to` — "Human access" step 2's two forms (section 6); before: 1, after: 0.

**O18.14** `human-needed: <role> <topic> — claude attach <id>` — "Human access" step 2's `attention` message (1.1); before: 1 (1 in `SKILL.md`, Task 14), after: 0.

**O18.15** `each in that role's orders line at` — "Human access" step 3's grants (1.1); before: 1, after: 0.

**O18.16** `chores, in the line you answer its` — Hosa's grant in a handshake reply (1.1); before: 1, after: 0.

**O18.17** `a permission dialog, the model-mismatch stop` — "Human access"'s last paragraph (1.4); before: 1, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P18.18 to P18.29.

**P18.18** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   that reads the report. Check every proposal's form as "A seat's exit"
   step 2 says; record its rows; then `release:`.
```

**P18.18 →**

```markdown
   that reads the report. Check every proposal's form as "A seat's exit"
   step 2 says, record its rows, and write the seat's `stop` request.
```

**P18.19** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   message, one answer. Write an `attention` request whose message is
   `kessai: <topic> — claude attach <id>`, the spawner filling the id from
   `seats.json`, and print in your own window, in the human's language:
```

**P18.19 →**

```markdown
   message, one answer. Run `beat`, then write an `attention` request whose
   message is `kessai: <topic> — tanto kanri`, the command that attaches
   the human to you, and print in your own session, in the human's language:
```

**P18.20** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   The human answers there — `claude attach <id>`, type, ← back to the
   agent view — or through a Kikaku decision
```

**P18.20 →**

```markdown
   The human answers there — `tanto kanri` in a terminal, type, then ← and
   leave the agent view — or through a Kikaku decision
```

**P18.21** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   has written one already. The session writes it, runs its resume
   self-check, and answers `shoroku proposal: <path> — <reading>`. **Three
```

**P18.21 →**

```markdown
   has written one already. The session writes it and answers
   `shoroku proposal: <path> — <reading>`. **Three
```

**P18.22** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```markdown
   that passes is recorded — one `pending` row per item, Source the
   proposal's path and the item's number — and you send a tab seat
   `release: /clear this window`, its row going `cleared`, or write a
   terminal seat's `stop` request, its row going `stopped`, nothing
   `/clear`ed and nothing said to it; either way tell the human, in your own
   window,
   `<role> <name> released — its work is in <paths>; no step needs it — /clear its window when convenient`.
   No recommender runs here, and no delete request goes out.
```

**P18.22 →**

```markdown
   that passes is recorded — one `pending` row per item, Source the
   proposal's path and the item's number — and you write the seat's `stop`
   request, its row going `stopped`. Nothing is said to the seat and nothing
   to the human: a seat a tab holds is recorded `stopped` with no command
   run, and its own closing line has already told the human to close the
   tab. No recommender runs here, and no delete request goes out.
```

**P18.23** `skills/tanto/roles/kanri.md` — replace exactly these 15 lines

```markdown
A tab seat that has stopped answering is past answering; a terminal seat
whose transcript is on disk is not, since a resume brings it back with its
whole conversation (`SKILL.md`'s Resuming). You learn of either the way you
learn of a missing batch report: the human says the window is gone, a send
errors and the census that follows no longer lists it, a `no-role` comes
back, the census's "Not listed" names it, or your window wakes for another
reason and the answer has not arrived. A terminal seat is marked `dead`
with an Events line naming what showed its process gone — the stale entry,
the send error — and saying its conversation is kept, and is resumed when
a line is next due to it ("Session lifecycle", **The census.**); only when
that resume fails is its exit forced ("Replace", its first row). A tab
seat's exit, and a failed resume's, is forced: write a roster Events line
saying its shoroku proposal was not written and what was lost as far as you
know, mark the row `cleared` on a `no-role` or `dead` on the census's "Not
listed", and continue.
```

**P18.23 →**

```markdown
A seat whose process is gone is not past answering while its transcript is
on disk: a wake brings it back with its whole conversation, and a parked
dialogue seat is one whose process the spawner stopped on purpose. You
learn that a seat is gone the way you learn of a missing batch report: a
send errors and `seat` then shows it gone, the census's "Not listed" names
it, a second `no-role` comes back, or your session wakes for another reason
and the answer has not arrived. A Jisso or a shoki the census does not list
is marked `dead` with an Events line naming what showed its process gone —
the stale entry, the send error — and saying its conversation is kept, and
is woken when a line is next due to it ("Sending to a seat"); only when
that wake fails is its exit forced ("Replace", its first row). A forced
exit — a failed wake, a second `no-role` — gets a roster Events line saying
its shoroku proposal was not written and what was lost as far as you know,
the row `dead` on the census's "Not listed" or `stopped` on the second
`no-role`, and you continue.

**Once a seat has ended, nothing is sent to it again**, and two things you
read off its process being gone you now read off its row. A write or a
`commit-ready:` event from a seat you have ended is stray, and goes by rule
5's report path. And a `spawn` that replaces a seat — the Replace table's
Sekkei, Keikaku, and Kaiseki rows — waits while
`boundary.js seat <the old sessionId>` prints `interactive`: tell the human
in one line which tab to close, and write the request once a later reading
no longer prints it, so that no two seats of one role and topic are held at
once (rule 4).
```

**P18.24** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
tracked-write rule. The intake is a `live` Hosa; you are the intake only
while none is live, and then you do exactly what Hosa does and nothing more.
```

**P18.24 →**

```markdown
tracked-write rule. The intake is a Hosa whose row is `live` and whose name
the listing shows — one in a turn, or held awake. While every Hosa is
parked, which is most of the time, the intake is you, and you do exactly
what Hosa does and nothing more.
```

**P18.25** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
hotfix is pending in the lane and the roster has no `live` Hosa row, add to
your line to the human a suggestion to open one (`/tanto hosa`), in the
shape of the Kikaku suggestion in "Start"; a report in the inbox is no
reason for it, since a report pends nothing.
```

**P18.25 →**

```markdown
hotfix is pending in the lane and the roster has no `live` Hosa row,
suggest to the human in your line that one be opened (`tanto hosa`, in a
terminal), in the shape of the Kikaku suggestion in "Start"; a report in
the inbox is no reason for it, since a report pends nothing.
```

**P18.26** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
2. When the human says, in your window and in any words, that the quota is
   back, you may probe the family once with a trivial `default` subagent, and
   then send the paused role
   `continue: <dispatch> — same model`. The role
   re-dispatches identically from where it stopped; no model and no effort
   changes at either end.
```

**P18.26 →**

```markdown
2. The human's word that the quota is back is `fukki` — `tanto fukki` at
   the launcher, or `/tanto fukki` typed in your session — and "Recovery"
   is where the family is probed and the paused role is sent
   `continue: <dispatch> — same model`. The role
   re-dispatches identically from where it stopped; no model and no effort
   changes at either end.
```

**P18.27** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```markdown
2. On a grant, tell the human as a numbered list: 1. `claude attach <id>` for
   a terminal seat, or go to `<name> [<ref>]` for a tab seat; 2. do
   `<what>`; 3. ← back to the agent view, or the tab. For a terminal seat,
   also write an `attention` request whose message is
   `human-needed: <role> <topic> — claude attach <id>`, because a seat that
   idles on a grant is not `blocked` and the spawner's census would miss it. The
   role's exchange
   ends with `human-access: done — <what the human did or decided>`; note that
   line in the ledger's Session events.
```

**P18.27 →**

```markdown
2. On a grant, tell the human as a numbered list: 1. `tanto <role> [<topic>]`
   in a terminal, or, for a dialogue seat, a click on its row in the editor's
   list; 2. do `<what>`; 3. ← and leave the agent view, or close the tab. Run `beat`,
   then also write an `attention` request whose message is
   `human-needed: <role> <topic> — tanto <role> [<topic>]`, because a seat
   that idles on a grant is not `blocked` and the spawner's census would
   miss it. The role's exchange
   ends with `human-access: done — <what the human did or decided>`; note that
   line in the ledger's Session events.
```

**P18.28** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
3. Four standing grants are yours to give without a request: Sekkei's spec
   dialogue and Keikaku's plan dialogue, each in that role's orders line at
   the handshake; an attached Kaiseki's debugging conversation, in the Human
   access section of its brief; and Hosa's chores, in the line you answer its
   handshake with. Kikaku needs none — the human is its counterpart by
   definition, and you never message it.
```

**P18.28 →**

```markdown
3. Four standing grants stand without a request, and none goes out as a
   line of yours: Sekkei's spec dialogue, stated in `roles/sekkei.md`;
   Keikaku's plan dialogue, in `roles/keikaku.md`; an attached Kaiseki's
   debugging conversation, in the Human access section of the brief you
   write before its spawn; and Hosa's chores, in `roles/hosa.md`. Kikaku
   needs none — the human is its counterpart by definition, and you never
   message it.
```

**P18.29** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
The harness's own prompts — a permission dialog, the model-mismatch stop —
reach the human in the peer's window and are outside this rule.
```

**P18.29 →**

```markdown
The harness's own prompt — a permission dialog — reaches the human in the
peer's own session, which the spawner's `blocked:` notice names with its
cause, and is outside this rule.
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 18
```

Expected: `task 18: verify clean`.

- [ ] **Step 3: Lint**

Run lint per Global Constraints on `skills/tanto/roles/kanri.md`.

Expected: lint passes with no file changed.

- [ ] **Step 4: Commit**

Commit per Global Constraints, the subject
`docs: Kanri's close, exits, intake, and human access name tanto <role> and end a seat by a stop request`,
the path `skills/tanto/roles/kanri.md`.

Expected: one commit.

### Task 19: `roles/kanri.md` part 4: "Session lifecycle" (the census, Create, Replace, Release, Recovery) and the idle block

Spec section 6's `roles/kanri.md` bullets for "Session lifecycle" and the
idle block, carrying 1.1 (every seat spawned by the run; Kanri asks the
human for none; a Sekkei and an attached Kaiseki spawned at the Asks
table's moments), 1.2 (one holder per role, `succeeds:`), 1.3 (the census's
` — spawned as` line under **Not held**; bare names), 2.4 and 2.5 (`wake
--hold` for a face with no launcher; the beat before every request), 2.6
(`blocked` carries its cause), 2.7 (the six headings, **Parked** and
**Ended**, the census's new moments, nothing marked on `spawner: stale`),
4.4 ("Recovery" as the fukki procedure), 4.7 (old-contract rows marked
`dead` at the census), 5.1 (the Replace table's spawns under the wait for a
tab to close; the Release table's `stop` requests), and I-11 (the idle
block's `for you:` examples). The opening paragraph and the numbered list
go; the census takes the six headings; "While a restart is being
recovered" goes; "Create" gains the Sekkei and attached-Kaiseki rows and
the `wake --hold` row and loses the Asks table; "Replace"'s three asks
become `spawn` requests and its Kikaku row goes; "Release" loses every
`release:` and `/clear`; "Recovery after a VS Code restart" becomes
"Recovery", 4.4's procedure; the idle block names Kanri by its bare name.

Two sites section 6 does not name, taken so that this file does not
contradict the scripts of batch A and B, and reported to Keikaku: the
census's **Listed** `— blocked` bullet, whose "It names no cause — a
permission prompt, a usage-limit pause, and a seat idling on a kessai all
read `blocked`" 2.6 makes false; and the census's **Listed** `renamed`
bullet, whose `[ref]` read from `ListAgents` 1.3 retires.

The heading `### Recovery after a VS Code restart` is renamed `### Recovery`,
as section 6 orders; no file under `skills/tanto/` but this one names the
old heading (`git grep -F 'Recovery after'` at `a89dd16`: one file), and
its only in-file pointer, the Recovery case of "The four cases", is
rewritten by Task 16.

This task's blocks cover lines 535 to 573 (the idle block inside loop step
4) and lines 1577 to 1805 of the file at `a89dd16`, and no other; "Readings"
is unchanged.

After this task, `roles/kanri.md` asks the human for no seat, reads the
census's six headings, writes every request after the beat, and runs one
"Recovery" for every form of fukki.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — the idle block (loop step 4),
  "Session lifecycle" (its opening, "The census" and its bullets, the send
  error paragraph, the restart paragraph), "Create", "Replace", "Release",
  and "Recovery after a VS Code restart".

**Interfaces:**

- Consumes: the census's `spawner:` line, six headings, and suffixes (Task
  5); `boundary.js seat`, `wake --hold`, and `beat` (Task 6); the
  spawner's `contract`, `succeeds`, `held`, and `once` (Tasks 2, 3); the
  launcher's `fukki` and its messenger (Task 10), whose `fukki:` line
  "Recovery" checks; "Sending to a seat" (Task 16); 5.1's wait (Task 18).
- Produces: "Recovery", the one procedure `SKILL.md`'s Resuming (Task 13)
  and this file's "Limits" (Task 18) point at.

**Named-mechanism sites.** Found with `git grep` at `a89dd16` over
`skills/tanto/`.

- *The census's headings*: `CENSUS_HEADINGS` in `scripts/boundary.js` and
  its test (Task 5); `SKILL.md`'s census paragraph ("under four headings",
  one line, Task 13) and its Artifacts scripts paragraph (Task 15);
  `templates/roster.md`, which names "the census" seven times (Task 7's
  file). **Not held** stands at `SKILL.md` (one line), `boundary.js`
  (three), and its test (four).
- *`no first turn`'s way in*: `scripts/spawner.js` (six lines) and its test
  (five), Tasks 1 and 4; `scripts/boundary.js` (two) and its test (four),
  Task 5; `SKILL.md` (one, Task 15); `templates/spawn-request.md` (one,
  Task 22).
- *The fukki procedure*: `SKILL.md` (thirteen lines naming `fukki`, Tasks
  12 and 13); `scripts/tanto.js` (two) and its test (eight), Task 10;
  `roles/kikaku.md` (one, Task 20); `resume batch X from task N` also
  stands at one `SKILL.md` line (Task 13). `recovery: begun` stands at two
  lines of this file and one of `templates/roster.md` (Task 7's file, not
  named by section 6 for it).
- *The asks and `Create`*: the Asks table and its numbered list exist only
  in this file; `SKILL.md`'s Invocation prompt table (Task 12) carries the
  prompts the new rows write; `templates/spawn-request.md` (Task 22)
  carries `contract`, `succeeds`, and `forMs`.
- *The idle block's identity line*: every role file's closing line (Tasks
  20, 21) and `SKILL.md`'s "Messages" (Task 14) carry the same bare name;
  `<name> [<ref>]` is O17.1.

**O19.1** `of an idle Kikaku` — the idle block's `/clear` of an idle Kikaku or Hosa (I-11); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O19.2** `or Hosa window, your own handover` — the same item's window, beside a Kaiseki's release (I-11); before: 1, after: 0.

**O19.3** `the human's word that the windows are back` — the idle block's windows-back word (I-11, 4.4); before: 1, after: 0.

**O19.4** `A **terminal seat** — Keikaku, Jisso` — "Session lifecycle"'s opening (section 6); before: 1, after: 0.

**O19.5** `you ask the human for, and Kikaku and Hosa the human` — the opening's asks (1.1); before: 1, after: 0.

**O19.6** `Every ask is this numbered list` — the opening (section 6's needle); before: 1, after: 0.

**O19.7** `1. In a free window of <repo path>` — the numbered list (1.1); before: 1, after: 0.

**O19.8** `There is no delete request for a tab` — the opening's tab-seat exit (5.1); before: 1, after: 0.

**O19.9** `under four headings` — the census's headings (2.7); before: 1 (1 in `SKILL.md`, Task 13), after: 0.

**O19.10** `handshake; after a send to a peer errors` — the census's moments (2.7); before: 1, after: 0.

**O19.11** `except while a restart is being recovered` — the census's **Not listed** exception (4.4); before: 1, after: 0.

**O19.12** `listed name and the` — the `renamed` bullet's `[ref]` (1.3); before: 1, after: 0.

**O19.13** `a usage-limit pause, and a seat idling on a kessai all read` — the `blocked` bullet's causeless `blocked` (2.6); before: 1, after: 0.

**O19.14** `with a space and` — the `no first turn:` message's `claude attach` (1.1); before: 1, after: 0.

**O19.15** `a handshake or a result file` — **Not held** (1.3); before: 1, after: 0.

**O19.16** `row holds is a window not yet handshaken` — the send-error paragraph (1.3); before: 1, after: 0.

**O19.17** `**While a restart is being recovered**` — the restart paragraph (4.4, section 6); before: 1, after: 0.

**O19.18** `recovery: begun` — the recovery window's Events lines (4.4); before: 2 in `skills/tanto/roles/kanri.md` (1 in `templates/roster.md`, Task 7's file), after: 0.

**O19.19** `The requests you write, and the asks you make.` — "Create"'s lead (1.1); before: 1, after: 0.

**O19.20** `for a live terminal seat to be held` — "Create"'s hold row (2.5); before: 1, after: 0.

**O19.21** `**Asks**, which are the numbered list above` — the Asks table (section 6's needle); before: 1, after: 0.

**O19.22** `run "A seat's exit", then the ask;` — "Replace"'s Sekkei compaction row (5.1); before: 1, after: 0.

**O19.23** `not replaced: mark the row` — "Replace"'s Kikaku row (section 6); before: 1, after: 0.

**O19.24** `then, if the case is open, the ask with the same brief` — "Replace"'s Kaiseki compaction row (5.1); before: 1, after: 0.

**O19.25** `| Sekkei is gone before the spec review is accepted | the ask;` — "Replace"'s Sekkei row (5.1); before: 1, after: 0.

**O19.26** `revert stray instrumentation if it is not; the ask;` — "Replace"'s Kaiseki row (5.1); before: 1, after: 0.

**O19.27** `no released line and no` — "Release"'s Jisso, Keikaku, and last-Jisso rows (5.1); before: 3, after: 0.

**O19.28** `step 3) — and send` — "Release"'s Sekkei row's `release:` (5.1); before: 1, after: 0.

**O19.29** `rows and send` — "Release"'s Kaiseki row's `release:` (5.1); before: 1, after: 0.

**O19.30** `A refused handshake has no row` — "Release"'s close row (section 6, `refused`); before: 1, after: 0.

**O19.31** `which covers the tab seats too` — the close row's census (5.1); before: 1, after: 0.

**O19.32** `### Recovery after a VS Code restart` — the heading (section 6); before: 1, after: 0.

**O19.33** `for a terminal Kanri` — "Recovery"'s `claude attach` (4.4); before: 1, after: 0.

**O19.34** `ask for the roles still missing` — "Recovery"'s asks (1.1); before: 1, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P19.35 to P19.48.

**P19.35** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

````markdown
   after `---` is your own identity, `<name> [<ref>] · kanri · <family>`
   (`.tanto/kikaku/2026-09-17-closing-line-identity.md`, R-7), so a window
   holding you says which Kanri; it needs no `sent:` line, since your own
   lines are already files or `R-n` text.

   ```text
   ---
   <name> [<ref>] · kanri · <family>
````

**P19.35 →**

````markdown
   after `---` is your own identity, `<name> · kanri · <family>`, the name
   bare (`.tanto/kikaku/2026-09-17-closing-line-identity.md`, R-7), so a
   terminal attached to you says which Kanri; it needs no `sent:` line,
   since your own lines are already files or `R-n` text.

   ```text
   ---
   <name> · kanri · <family>
````

**P19.36** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

````markdown
   ```text
   ---
   <name> [<ref>] · kanri · <family>
   <topic>: <state> — <seat name | no seat> → <what comes next, and whom it waits on>
   for you:
   1. <topic | —> — <the act>
````

**P19.36 →**

````markdown
   ```text
   ---
   <name> · kanri · <family>
   <topic>: <state> — <seat name | no seat> → <what comes next, and whom it waits on>
   for you:
   1. <topic | —> — <the act>
````

**P19.37** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
   `—` for an act that belongs to no topic: the `/clear` of an idle Kikaku
   or Hosa window, your own handover, a quota's return, a Kaiseki's release
   after its shoroku proposal, the human's word that the windows are back
   while a restart is being recovered, an answer you are waiting on. An
```

**P19.37 →**

```markdown
   `—` for an act that belongs to no topic: your own handover, a quota's
   return, `tanto fukki` after a stale spawner, a tab to close before a
   replacement ("A seat's exit"), the question a handover file naming you
   as the outgoing session puts ("Recovery"), an answer you are waiting
   on. An
```

**P19.38** `skills/tanto/roles/kanri.md` — replace exactly these 35 lines

````markdown
A **terminal seat** — Keikaku, Jisso, the shusei batch, shoki, and your own
successor — you start yourself, by writing a request file the spawner acts
on; the human opens no window for it and takes none away. A **tab seat** —
Sekkei and Kaiseki — you ask the human for, and Kikaku and Hosa the human
opens unasked. A tab window is `/clear`ed and reused,
never closed: a session is identified by its `sessionId`, a window by
its `name [ref]`, which survives `/clear` (measured 2026-09-16), and the
roster's rows tell them apart. Every ask is this numbered list,
which the human can paste:

```text
1. In a free window of <repo path> — one you have /clear'ed, or a new one:
2. /model <family>
3. /effort <level>
4. Make sure the session is in auto mode.
5. /tanto <role> topic=<topic>
```

Line 5 always carries `topic=<topic>` and nothing else, as the Asks table's
third column names it. For Kaiseki the key is what makes the seat
**attached**: a bare `/tanto kaiseki` is standalone Kaiseki, a different
seat with no roster row, so this list is never pasted for a Kaiseki without
it. No address is ever pasted: the new session reads the roster's first
data row. The
family and the level are `sessions.<role>` from
`tanto.json`, and they come before the command because the human forgets the
effort more often than the model — and because `/clear` resets the effort
to the default while it keeps the model (measured 2026-09-16), so line 3 is
never redundant in a reused window. There is no delete request for a tab
seat: its exit ends with your `release:` line to it, and one line to the
human in your own window — `<role> <name> released — its work is in <paths>;
no step needs it — /clear its window when convenient`. A line of yours that
speaks of a release and of a creation keeps them in two clauses with their
own times — "released now; a fresh Keikaku is requested at
`<topic>`'s merge" — never one clause for both.
````

**P19.38 →**

```markdown
Every seat is started by the spawner on a request file: yours for Sekkei,
Keikaku, Jisso, the shusei batch, an attached Kaiseki, shoki, and your own
successor; the launcher's for Kikaku, Hosa, a standalone Kaiseki, a Kanri
when the run has none, and a messenger. You ask the human for no seat, and
nobody opens a window for one. Every `spawn` you write carries
`contract: 2`, which the spawner records on the seat. A Kanri, a Kikaku,
and a Hosa have one holder each: the spawner refuses a second with
`error: "held: <sessionId>"`, and your successor's request, which names you
in `succeeds:`, is not refused. A dialogue seat — Sekkei, Keikaku, Kikaku,
Hosa, Kaiseki — asks to be parked at the end of every turn, and the
spawner stops its process once the turn has ended; its conversation is
kept, a wake brings it back ("Sending to a seat"), and its row stays
`live`. You, a Jisso, shoki, and a messenger are never parked. A seat ends
at its boundary by your `stop` request, with nothing said to it ("A seat's
exit"), or — a Kikaku, a Hosa, a standalone Kaiseki — by its own
`/tanto taiseki`, which the census then prints under **Ended**. A line of
yours that speaks of an end and of a start keeps them in two clauses with
their own times — "ended now; a fresh Keikaku is requested at `<topic>`'s
merge" — never one clause for both.
```

**P19.39** `skills/tanto/roles/kanri.md` — replace exactly these 13 lines

```markdown
**The census.** `node "$TANTO/scripts/boundary.js" census`, from the
repository root, prints the roster's `live` and `queued` rows against the
sessions `claude agents --json` lists under the root, under four headings —
Listed, Not listed, No session id, and Not held — and writes nothing: you,
the roster's one writer, act on what it prints. A session is its
`sessionId`, a row's being the basename of its Transcript column, and every
match of a session to a row compares `sessionId`s, never a name, a `[ref]`,
or a full path. Run the census at your start, before taking a case (Start
step 1's read of your own name stays, and the census follows it); at every
handshake; after a send to a peer errors; once the human says the windows
are back after a restart; at the plan close, before the archive move; and
before you say anything about a listed session your roster does not hold.
What it prints decides:
```

**P19.39 →**

```markdown
**The census.** `node "$TANTO/scripts/boundary.js" census`, from the
repository root, prints the roster's `live` and `queued` rows against the
state file and the sessions `claude agents --json` lists under the root:
the `spawner:` line first, `beating` or `stale`, then six headings —
Listed, Parked, Ended, Not listed, No session id, and Not held — and writes
nothing: you, the roster's one writer, act on what it prints. A session is
its `sessionId`, a row's being the basename of its Transcript column, and
every match of a session to a row compares `sessionId`s, never a name, a
`[ref]`, or a full path. Run the census at your start, before taking a case
(Start step 1's read of your own name stays, and the census follows it); at
every boundary, in loop step 6 before the next request; at every wake-up
whose line comes from a name no roster row holds — a Hosa's
`slot-needed:` or `kessai answer:`, a Kikaku's `decision:` — before you
handle the line; when `seat` prints `no entry`; in "Recovery"; at the plan
close, before the archive move; and before you say anything about a listed
session your roster does not hold. On `spawner: stale` mark nothing, as on
`census: unavailable`: the state file has stopped moving. Otherwise what it
prints decides:
```

**P19.40** `skills/tanto/roles/kanri.md` — replace exactly these 16 lines

```markdown
- **Not listed** — a `queued` row stays `queued`: a waiting seat's absence
  is expected, and the send of its prompt resumes it. Any other row is
  marked `dead` — except while a restart is being recovered, below. For a
  terminal seat whose transcript is on disk, `dead` is not final: its Events
  line names what showed the process gone — the stale entry, its census
  line ending `— listed without a pid (a stale entry)`, or the send error — and says
  the conversation is kept, and when a line is next due to that seat you
  resume it (`SKILL.md`'s Resuming) and its row goes `live` again. A tab
  seat's Events line, and a terminal seat's whose resume fails, is the one
  a seat whose shoroku proposal was not written gets, with what was lost as
  far as you know. A row that was the live Jisso's is the Replace table's
  first row, the tree verified first.
- **Listed**, marked `renamed` — rewrite the row's Name column with the
  listed name and the `[ref]` one `ListAgents` call prints, and write
  `resumed: <old name> → <new name>`; for a terminal seat, clear the
  spawner's `renamed` mark with an `ack` request.
```

**P19.40 →**

```markdown
- **Parked** — a `live` row whose seat the state file holds `parked`,
  carrying `— mid-turn` when its last turn did not end by itself and
  `— waiting` when a question of its own to the human stands. Nothing is
  marked: the row stays `live`, and a park costs you no wake-up. A seat
  with a topic carrying `— mid-turn` — a Sekkei, a Keikaku, an attached
  Kaiseki — is woken and told to go on in "Recovery" alone, never at a
  boundary's census: a Sekkei whose tab the human closed mid-turn on
  purpose is not woken at the next boundary to be told to go on. A
  Kikaku's, a Hosa's, or a standalone Kaiseki's cut turn is the human's to
  continue, with a word in the seat.
- **Ended** — a `live` or `queued` row whose seat the state file holds
  `stopped` or `removed`; the line ends in `by taiseki` when the seat ended
  itself. Write the row `stopped`, with an Events line naming what ended
  it — `taiseki`, or your own request.
- **Not listed** — a row the state file does not hold, or holds `running`,
  `blocked`, or `gone`, and the listing does not show. An old-contract row (Start, step 4), `live` or
  `queued`, is marked `dead` with the Events line
  `old-contract row retired: <name>`. Otherwise a `queued` row stays
  `queued`: a waiting seat's absence is expected, and the send of its
  prompt wakes it. Any other row is marked `dead`. For a seat whose
  transcript is on disk, `dead` is not final: its Events line names what
  showed the process gone — the stale entry, its census line ending
  `— listed without a pid (a stale entry)`, or the send error — and says
  the conversation is kept, and when a line is next due to that seat you
  wake it ("Sending to a seat") and its row goes `live` again. A seat whose
  wake fails gets the Events line a seat whose shoroku proposal was not
  written gets, with what was lost as far as you know. A row that was the
  live Jisso's is the Replace table's first row, the tree verified first.
- **Listed**, marked `renamed` — rewrite the row's Name column with the
  listed name, bare, and write `resumed: <old name> → <new name>`; that is
  all. The cell is a record: a line still goes to the name `seat` reads at the send.
```

**P19.41** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
  seat's own report and does not. It names no cause — a permission prompt,
  a usage-limit pause, and a seat idling on a kessai all read `blocked` —
  and every reader tests the cell's first word.
```

**P19.41 →**

```markdown
  seat's own report and does not. The cell names no cause; the census line
  does, `— blocked (<waitingFor>)`, and a seat that answered and waits for
  the human is not blocked at all. Every reader tests the cell's first word.
```

**P19.42** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
  or saw it gone with none. Write one `attention` request whose message is
  `no first turn: <role> <topic>`, with a space and `— claude attach <id>` after it for
  a **Listed** seat only: a Not listed seat is marked `dead` by the bullet
  above, with no transcript to resume it from, so there is nothing to attach. Once per seat, since you
```

**P19.42 →**

```markdown
  or saw it gone with none. Run `beat`, then write one `attention` request
  whose message is `no first turn: <role> <topic>`, followed by a space and
  `— tanto <role> [<topic>]` for a **Listed** seat only: a Not listed seat
  is marked `dead` by the bullet above, with no transcript to wake it from,
  so there is nothing to enter. Once per seat, since you
```

**P19.43** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
- **Not held** — nothing to the human. A session becomes the run's through
  a handshake or a result file, never by being listed.
```

**P19.43 →**

```markdown
- **Not held** — nothing to the human. A session becomes the run's through
  a result file, never by being listed. A line carrying
  `— spawned as <role> <topic>, result <id>` is a seat the launcher started
  that no row holds: write its row from that result file with
  `boundary.js record --seat`, as you do for the seats you request. A
  standalone Kaiseki, whose topic is `—`, and a messenger, `denrei`, get no
  row.
```

**P19.44** `skills/tanto/roles/kanri.md` — replace exactly these 18 lines

```markdown
A send error is a reason to run the census, not a signal of its own: its
"Not listed" marks the row `dead`, and a terminal seat is then resumed and
the line sent again, as loop step 6 says; a send that errors to a session
the census still lists is a message failure — the row stays, and you tell
the human in one line. `ListAgents` lists every session on the machine and
shows no cwd, so say nothing about a listed session your roster does not
hold: the census lists only the sessions under this repository, so a
session it does not list is another repository's, and one it lists that no
row holds is a window not yet handshaken or the human's own.

**While a restart is being recovered** — from your own `/tanto fukki`, or
your Recovery case, until the human says the windows are back — a census
places sessions and marks nothing `dead`: a tab the editor has not restored
yet is not listed, and has not gone. The window lives in the roster, not in
your context: open it with the Events line `recovery: begun` and close it
with `recovery: windows back` on the human's word; a successor reads the
last of the two before it marks anything, and until the word comes the
human's part is an open act in your idle block's `for you:` list.
```

**P19.44 →**

```markdown
A send error is answered by "Sending to a seat" — `seat` again, once, then
the Events line `unsent:` — and not by a census of its own. `ListAgents`
lists every session on the machine and shows no cwd, so say nothing about
a listed session your roster does not hold: the census lists only the
sessions under this repository, so a session it does not list is another
repository's, and one it lists that no row holds is a seat whose row you
have not written yet, under **Not held**, or the human's own.
```

**P19.45** `skills/tanto/roles/kanri.md` — replace exactly these 21 lines

```markdown
The requests you write, and the asks you make. **Requests:**

| When | Write | The prompt carries |
| --- | --- | --- |
| a plan is committed and your cold read has no open questions | one `spawn` for batch A's Jisso — or N at once, each `queue=<topic>`, on a plan that edits this skill | `/tanto jisso batch=<path>`, or `/tanto jisso queue=<topic>` |
| every later batch, and the fix wave | one `spawn` per batch, at its boundary | `/tanto jisso batch=<path>` |
| the spec review is accepted | one `spawn` for Keikaku | `/tanto keikaku topic=<topic> spec=<path> plan=<path> ledger=<path>` — `ledger=` only when another topic's batch is in flight, naming that ledger |
| the kessai is answered | one `spawn` for the shusei batch, when the direction accepted a `fix` group | `/tanto jisso batch=<path>` |
| the merge lands | one `spawn` for shoki, after `git worktree add` cuts its worktree, in the same act as the merge and never before it | `brief: <path>` |
| a handover is due | one `spawn` for your successor | `/tanto kanri` |
| a seat retires, or the run goes down | one `stop` per seat | — |
| the human asks in your window for a live terminal seat to be held for a while — a priority call, not a lifecycle signal | one `stop` for that seat, its row `stopped` with an Events line quoting the human's word, its conversation kept and no shoroku proposal asked, since nothing of the seat's is lost; when the human says so, one `resume` on the same `sessionId`, the resumed seat sent the Resuming line for its role, its row `live` again | — |

**Asks**, which are the numbered list above:

| When | Ask the human to | The line carries |
| --- | --- | --- |
| bootstrap | nothing; the human runs `tanto` and attaches | — |
| the first batch of the current plan is accepted, or every open topic has passed its spec stage | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei topic=<topic>` |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki topic=<topic>`; the brief follows the handshake |
| — | nothing; Kikaku and Hosa are opened by the human | — |
```

**P19.45 →**

```markdown
The requests you write, each after `beat` ("Sending to a seat"), every
`spawn` among them carrying `contract: 2`. You ask the human for no seat:
Kikaku and Hosa are the launcher's to start, and the human runs `tanto`
for a run with none.

| When | Write | The prompt carries |
| --- | --- | --- |
| a plan is committed and your cold read has no open questions | one `spawn` for batch A's Jisso — or N at once, each `queue=<topic>`, on a plan that edits this skill | `/tanto jisso batch=<path>`, or `/tanto jisso queue=<topic>` |
| every later batch, and the fix wave | one `spawn` per batch, at its boundary | `/tanto jisso batch=<path>` |
| you open a topic (Start, step 5) — the first batch of the current plan accepted, or every open topic past its spec stage — unless the human has said no Sekkei for it, an `R-n` | one `spawn` for Sekkei | `/tanto sekkei topic=<topic> spec=<path> branch=<branch> input=<path>` — `input=` only when an input document exists; `ledger=<path>` added when another topic's batch is in flight, `spec=` then the draft path |
| the spec review is accepted | one `spawn` for Keikaku | `/tanto keikaku topic=<topic> spec=<path> plan=<path> ledger=<path>` — `ledger=` only when another topic's batch is in flight, naming that ledger |
| Jisso reports the Kaiseki trigger with an unknown cause, the brief is written, and `seat` shows every Sekkei with no turn in progress ("The Kaiseki branch") | one `spawn` for an attached Kaiseki | `/tanto kaiseki topic=<topic> brief=<path>` |
| the kessai is answered | one `spawn` for the shusei batch, when the direction accepted a `fix` group | `/tanto jisso batch=<path>` |
| the merge lands | one `spawn` for shoki, after `git worktree add` cuts its worktree, in the same act as the merge and never before it | `brief: <path>` |
| a handover is due | one `spawn` for your successor, with `succeeds: <your own sessionId>` | `/tanto kanri` |
| a seat retires, or the run goes down | one `stop` per seat | — |
| the human asks, from anywhere — Remote Control included — for a parked seat to be woken | one `wake --hold` on its `sessionId`, which holds the seat awake until 55 minutes after its last turn, its own standing park request then parking it; a `release` request for it when the human says the talk is done sooner | — |
| the human asks you for a live seat to be set aside for a while — a priority call, not a lifecycle signal | one `stop` for that seat, its row `stopped` with an Events line quoting the human's word, its conversation kept and no shoroku proposal asked, since nothing of the seat's is lost; when the human says so, one `wake` on the same `sessionId`, the woken seat sent the Resuming line for its role, its row `live` again | — |
```

**P19.46** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```markdown
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "A seat's exit", then the ask; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "A seat's exit", then a `spawn` request with the same three keys; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
| a Kikaku's reading shows a compaction | not replaced: mark the row `cleared`, add its `/clear` as a `for you` item instead of saying it inline, and let the next `/tanto kikaku` handshake write a new row — what the session produced is already on disk or committed |
| a Hosa's reading shows a compaction | nothing: the count arrives in its next reading, and the Hosa has already confirmed its summary's human items in its own window before continuing |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "A seat's exit", then, if the case is open, the ask with the same brief |
| A handover trigger fired at a boundary | run the Handover section; your successor is spawned and needs nothing of the human's |
| Sekkei is gone before the spec review is accepted | the ask; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
| Keikaku is gone before the plan is committed | a `spawn` request with the same three keys; the spec on the branch and the plan draft on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; the ask; the brief and the WIP commit are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
```

**P19.46 →**

```markdown
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "A seat's exit", then a `spawn` request with the same keys; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "A seat's exit", then a `spawn` request with the same three keys; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
| a Hosa's reading shows a compaction | nothing: the count arrives in its next reading, and the Hosa has already confirmed its summary's human items in its own window before continuing |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "A seat's exit", then, if the case is open, a `spawn` request with the same brief |
| A handover trigger fired at a boundary | run the Handover section; your successor is spawned and needs nothing of the human's |
| Sekkei is gone before the spec review is accepted | a `spawn` request with the same keys; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
| Keikaku is gone before the plan is committed | a `spawn` request with the same three keys; the spec on the branch and the plan draft on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; a `spawn` request with the same brief; the brief and the WIP commit are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |

A `spawn` this table writes for a Sekkei, a Keikaku, or a Kaiseki waits
while `seat` prints the old seat `interactive` ("A seat's exit"). A Kikaku
is not replaced by you: its end is the human's word in it, `/tanto taiseki`.
```

**P19.47** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
| a batch is accepted at loop step 4 — the Jisso whose boundary is the plan's last excepted: the last implementation batch's while the review is pending, and the fix wave's — see "The final batch", steps 2 and 3 | its Jisso is done; write its `stop` request, its row `stopped` by loop step 6's `record` call; no released line and no `/clear`, and its conversation is kept. The next batch's Jisso is a `spawn` request of its own |
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the shoroku proposal | Sekkei is done; record its proposal's items and the spec's four sections as `pending` rows, Source the spec's path as it stands now — rewritten at the landing if that path was a draft's ("When the plan lands", step 3) — and send `release:` as soon as the proposal passes the form check — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the `coldread answered:` line named the shoroku proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; record its proposal's items as `pending` rows and write its `stop` request as soon as the proposal passes the form check — no released line and no `/clear`, its conversation kept; a Keikaku is never reused across topics (decision-f496) |
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; record its proposal's items as `pending` rows and send `release:` as soon as the proposal passes the form check, or keep it if more of the same bug is expected |
| the final batch is accepted, the close's shoroku proposal is written and passes the form check, and leftovers are clean | the last Jisso is done; write its `stop` request at once, the close being its exit — no released line and no `/clear`, its conversation kept — the recommendation and the kessai run with it gone, and a merge declined with fixes wanted is a new batch on a new Jisso either way; a `queued` Jisso that never ran gets a `stop` request the same way, its row `stopped` |
| the kessai is answered, shusei's batch is verified, the merge is done, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every seat the ledger's Session events accepted for it — Sekkei, Keikaku, every Jisso, `queued` ones that never ran included, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. Shoki's transcript is not in the list: it is not a session of the ledger's Session events. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. A bare `<sessionId>.jsonl` cell, the form a spawn result with no transcript leaves, is no path the script can open: find the file under `<config dir>/projects/` first, by basename, and pass that path. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then run the census and mark `dead` every row it prints under "Not listed", which covers the tab seats too; bring the roster's Shoroku proposal items table to the template's shape if it still has its pre-rename heading or the retired seventh column, its rows kept; move the stopped, dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — move the topic's result files to `.tanto/<topic>/spawner-results/`, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

**P19.47 →**

```markdown
| a batch is accepted at loop step 4 — the Jisso whose boundary is the plan's last excepted: the last implementation batch's while the review is pending, and the fix wave's — see "The final batch", steps 2 and 3 | its Jisso is done; write its `stop` request, its row `stopped` by loop step 6's `record` call; nothing is said to it, and its conversation is kept. The next batch's Jisso is a `spawn` request of its own |
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the shoroku proposal | Sekkei is done; record its proposal's items and the spec's four sections as `pending` rows, Source the spec's path as it stands now — rewritten at the landing if that path was a draft's ("When the plan lands", step 3) — and write its `stop` request as soon as the proposal passes the form check — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the `coldread answered:` line named the shoroku proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; record its proposal's items as `pending` rows and write its `stop` request as soon as the proposal passes the form check — nothing is said to it, its conversation kept; a Keikaku is never reused across topics (decision-f496) |
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; record its proposal's items as `pending` rows and write its `stop` request as soon as the proposal passes the form check, or keep it if more of the same bug is expected |
| the final batch is accepted, the close's shoroku proposal is written and passes the form check, and leftovers are clean | the last Jisso is done; write its `stop` request at once, the close being its exit — nothing is said to it, its conversation kept — the recommendation and the kessai run with it gone, and a merge declined with fixes wanted is a new batch on a new Jisso either way; a `queued` Jisso that never ran gets a `stop` request the same way, its row `stopped` |
| the kessai is answered, shusei's batch is verified, the merge is done, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every seat the ledger's Session events accepted for it — Sekkei, Keikaku, every Jisso, `queued` ones that never ran included, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. Shoki's transcript is not in the list: it is not a session of the ledger's Session events. Rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. A bare `<sessionId>.jsonl` cell, the form a spawn result with no transcript leaves, is no path the script can open: find the file under `<config dir>/projects/` first, by basename, and pass that path. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then run the census, write `stopped` every row it prints under **Ended**, and mark `dead` every row it prints under "Not listed"; bring the roster's Shoroku proposal items table to the template's shape if it still has its pre-rename heading or the retired seventh column, its rows kept; move the stopped, dead, replaced, refused, and cleared rows — the last two an old contract's, kept until the archive takes them — with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — move the topic's result files to `.tanto/<topic>/spawner-results/`, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

**P19.48** `skills/tanto/roles/kanri.md` — replace exactly these 22 lines

```markdown
### Recovery after a VS Code restart

The terminal seats were never reached by the restart — separate processes,
still running — and after a reboot `tanto` resumes each of them under the
same `sessionId`. The human types `/tanto fukki` once, in your window —
after `claude attach` for a terminal Kanri — and nowhere else: a tab seat
the editor resumed keeps its `sessionId`, and nothing is typed there.
Write the Events line `recovery: begun`; once the human says the windows
are back, run the census, write `recovery: windows back`, rename what it
lists under a new name — rewrite the row's Name column and write
`resumed: <old name> → <new name>` — and mark `dead` what it does not list;
for a terminal seat, clear each of `seats.json`'s `renamed` marks with an
`ack` request, as before. Answer every ledger line marked `unanswered:`. A Jisso resumed
mid-batch with no prompt idles at its last message: write the `spawn`
request the same `batch=` file names, its prompt's resume line rewritten to
`resume batch X from task N`, and continue where the Progress line says; you
re-run no definitions write-out and send no broadcast. Verify the tree if a
batch was in flight, then ask for the roles still missing — the tab seats
whose work is open: Kaiseki only if a
bug is open, Keikaku only if a plan is in progress,
Sekkei only if a spec is in progress. Kikaku and Hosa you do not ask for: they
are the human's to reopen, and your part is the reminder.
```

**P19.48 →**

```markdown
### Recovery

`/tanto fukki` typed in your session, the line
`fukki: requested at the launcher`, and a resume whose prompt is
`/tanto fukki` are one procedure. `tanto fukki` at the launcher is the
human's word for it whatever the cause — a reboot, a spawner that died, an
editor restart, a quota that is back: the launcher starts the spawner when
none beats, resumes the seats a restart took, and tells you, by that prompt
or, while you are alive, by a messenger. Act on a `fukki:` line only when
`node "$TANTO/scripts/boundary.js" seat <the envelope's from-name>` prints
a seat whose role is `denrei` — the command finds a `removed` seat by its
name too; from any other sender the line gets no answer and an Events
line. There is nothing to wait for: no tab holds state the run needs, so
the census marks at once.

1. Run the census and act on its six headings. Wake, in one `wake` call,
   every seat with a topic under **Parked** carrying `— mid-turn`, and send
   each
   `resume: your turn was cut — continue from where it stopped, and dispatch again anything you had running`
   — the one moment that line is sent. Send a Jisso resumed mid-batch, which
   idles at its last message, `resume batch X from task N`; verify the tree
   if a batch was in flight, and continue where the Progress line says.
2. Reconcile the `renamed` marks as the census's **Listed** bullet says.
   Send every `unsent:` line that has no `sent:` pair, writing the pair;
   answer every `unanswered:` line that has no `answered:` pair.
3. For every `paused:` row the ledger's Measurements holds unanswered,
   probe the family once with a trivial `default` subagent and send the
   paused role `continue: <dispatch> — same model`. A probe that fails
   sends nothing, leaves the row, and tells the human the reset time again:
   `fukki` is typed after a spawner's death as well as after a quota's
   return. This is the one place the probe is written ("Limits").
4. Print, in the idle block, what was put back.

You re-run no definitions write-out, send no broadcast, and ask the human
for no seat. A Kikaku's, a Hosa's, or a standalone Kaiseki's cut turn is
the human's to continue, with a word in the seat. A Kanri that finds
`.tanto/kanri-handover.md` naming itself as the outgoing session asks the
human whether to continue or hand over, and infers neither: a resumed Kanri
may have nobody attached, so the question is an item of the idle block's
`for you:` list and, after `beat`, an `attention` request,
`fukki: Kanri asks — tanto kanri`.
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 19
```

Expected: `task 19: verify clean`.

- [ ] **Step 3: Lint**

Run lint per Global Constraints on `skills/tanto/roles/kanri.md`.

Expected: lint passes with no file changed.

- [ ] **Step 4: Commit**

Commit per Global Constraints, the subject
`docs: Kanri asks for no seat, reads the census's six headings, and runs one Recovery for every fukki`,
the path `skills/tanto/roles/kanri.md`.

Expected: one commit.

### Task 20: `roles/sekkei.md`, `roles/keikaku.md`, `roles/kikaku.md`

Spec section 6's entries for the three files, carrying 1.1 (the orders are
the prompt's keys and the standing grant is stated in the role file), 1.4 (a
Kikaku says a model mismatch in its start line), 2.2 (the park rule, written
here once for every dialogue seat and reused in Task 21), 4.2 (a Kikaku with
no roster), 5.1 (the ended seat's closing line and its rule), and 5.2
(`taiseki` for a Kikaku). Sekkei: the opening's grant sentence and the
handshake paragraph become the prompt's keys and the grant stated here;
every "orders line" becomes the key that carries it (`spec=`, `branch=`,
`ledger=`); the boundary reply loses the self-check; the tenure's end loses
`release:` and the `/clear`, and gains the ended line, the ended seat's
rule, and Kanri's `stop`; a new section, "The end of every turn — the
park", with `--waiting` at Step 1's questions and at the review gate.
Keikaku: the handshake paragraph; the Global Constraints sentence of rule 11;
the two self-check clauses; the ended line and rule; the same park section,
with `--waiting` at the plan dialogue. Kikaku: "How you start" (`tanto
kikaku`, nothing sent at the start, the open topics read from disk, no
roster yet), "Lifecycle" (parked between turns, `taiseki`, no `/clear`, the
ended seat's rule), and the park section.

After this task, Sekkei, Keikaku, and Kikaku end every turn with a park
request, take their orders from their prompt keys, and send no handshake.

**Files:**

- Modify: `skills/tanto/roles/sekkei.md` — the opening, "Where your files
  go", Step 1, Step 2, the tenure paragraph, "Your write and commit rule"
  and its two bullets, and a new section before "Models".
- Modify: `skills/tanto/roles/keikaku.md` — the opening's second
  paragraph, Step 3's rule-11 bullet, "Handoff", the boundary reply, the
  shoroku-proposal bullet, and a new section before "Models".
- Modify: `skills/tanto/roles/kikaku.md` — "How you start", "Lifecycle",
  and a new section before "Rule 9".

**Interfaces:**

- Consumes: `boundary.js request park|leave --transcript <path> [--waiting]
  [--notice]` (Task 6), the spawner's `park` and `self` stop (Tasks 1, 3),
  the launcher's `tanto kikaku` (Task 8), and Sekkei's prompt keys as Kanri
  writes them (Task 19's "Create").
- Produces: the park rule's text, which Task 21 states in the same words for
  Hosa and Kaiseki; the ended seat's closing line in the form Task 14 gives
  "Messages".

**Named-mechanism sites.** The park request (`boundary.js request park`,
`--waiting`, `--notice`) is also `roles/hosa.md` and `roles/kaiseki.md`
(Task 21), `templates/spawn-request.md`'s `park` op and its `after`,
`waiting`, and `notice` fields (Task 22), `scripts/boundary.js`'s `request`
subcommand (Task 6), and `scripts/spawner.js`'s `park` op and `tryPark`
(Task 3); `SKILL.md`'s "The faces of a seat" (Task 15) states what the park
is for. `taiseki` and `request leave` are also `roles/hosa.md` and
`roles/kaiseki.md` (Task 21), `SKILL.md`'s "Invocation" (Task 12) and
"Session exit" (Task 14), `scripts/tanto.js`'s word table (Task 8),
`scripts/spawner.js`'s `self` stop (Task 1), `scripts/boundary.js` (Task 6),
`templates/spawn-request.md` (Task 22), and the README (Task 23). The ended
seat's closing line, `none — this seat has ended; close its tab if one is
open`, is also `SKILL.md`'s "Messages" (Task 14) and `roles/kaiseki.md`
(Task 21). Sekkei's prompt keys (`topic=`, `spec=`, `branch=`, `input=`,
`ledger=`) are also `SKILL.md`'s "Invocation" prompt table (Task 12),
`roles/kanri.md`'s Start step 5 (Task 16) and "Create" (Task 19),
`templates/spawn-request.md`'s `prompt` bullet (Task 22), and
`templates/kikaku-decision.md`'s `input=` (Task 7). The rule-11 authority
sentence ("the seat's own prompt keys") is also `SKILL.md`'s Rule 11
(Task 15). The other `orders line` sites, all retired by their own tasks:
`SKILL.md` (Tasks 12, 13, 15), `roles/kanri.md`'s "Start", "On a
handshake", "When the plan lands", and "Human access" (Tasks 16, 18),
`templates/kikaku-decision.md` (Task 7), `templates/roster.md` (Task 7), and
the README (Task 23). The other self-check sites: `SKILL.md`'s "Resuming"
(Task 13), "Messages" and "Session exit" (Task 14), `roles/kanri.md`'s "The
trigger" (Task 17) and "A seat's exit" (Task 18), `roles/kaiseki.md` and
`roles/jisso.md` (Task 21), and `templates/boundary-brief.md` (Task 22).
`roles/sekkei.md`'s `<where: this window>` in its `human-needed:` form is
`SKILL.md`'s line format and is unchanged.

**O20.1** `handshake` — the handshake a seat sent at its start, and the self-check's "the handshake goes first" (spec 1.1, 3.1); before: 2 in `skills/tanto/roles/sekkei.md`, 1 in `skills/tanto/roles/keikaku.md`, 2 in `skills/tanto/roles/kikaku.md`, after: 0 in each.

**O20.2** `self-check` — Sekkei's tenure end and boundary reply, Keikaku's two "no self-check runs first" (spec 1.3, 3.1); before: 2 in `skills/tanto/roles/sekkei.md`, 2 in `skills/tanto/roles/keikaku.md`, after: 0 in each.

**O20.3** `orders line` — Sekkei's grant sentence and its six key references, Keikaku's "no orders line carries it" and its rule-11 sentence (spec 1.1); before: 7 in `skills/tanto/roles/sekkei.md`, 2 in `skills/tanto/roles/keikaku.md`, after: 0 in each.

**O20.4** `release:` — Sekkei's tenure end and proposal bullet, Kikaku's "no `release:` waiting" and Lifecycle (spec 5.1); before: 3 in `skills/tanto/roles/sekkei.md`, 2 in `skills/tanto/roles/kikaku.md`, after: 0 in each.

**O20.5** `/clear` — Sekkei's tenure end and proposal bullet, Keikaku's "nothing is `/clear`ed", Kikaku's Lifecycle (spec 5.1, 5.2); before: 3 in `skills/tanto/roles/sekkei.md`, 1 in `skills/tanto/roles/keikaku.md`, 1 in `skills/tanto/roles/kikaku.md`, after: 0 in each.

**O20.6** `terminal seat` — Keikaku's "a terminal seat's rename" (spec 1.1); before: 1 in `skills/tanto/roles/keikaku.md`, after: 0. Keikaku's other "terminal / seat", wrapped across two lines in the handshake paragraph, goes with O20.1's site.

**O20.7** `Kanri's reply` — Sekkei's topic and spec path as carried by Kanri's reply to the handshake (spec 1.1); before: 1 in `skills/tanto/roles/sekkei.md`, after: 0.

**O20.8** `Kanri never asks for a Kikaku` — "How you start" (spec 1.1, 6); before: 1 in `skills/tanto/roles/kikaku.md`, after: 0.

**O20.9** `s this window when the subject changes` — "The human `/clear`s this window when the subject changes" (spec 5.2); before: 1 in `skills/tanto/roles/kikaku.md`, after: 0.

**O20.10** `stays accepted` — "`/tanto fukki` stays accepted" in a Kikaku, which spec 1.5 answers with the start check's line in any seat but Kanri; before: 1 in `skills/tanto/roles/kikaku.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P20.11 to P20.32.

**P20.11** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
Keikaku's, drafted after you exit. You talk to Kanri, and to the human under
the standing grant Kanri's orders line names — the spec dialogue, given at
your creation — and
```

**P20.11 →**

```markdown
Keikaku's, drafted after you exit. You talk to Kanri, and to the human under
your standing grant — the spec dialogue, given at your creation and stated
here — and
```

**P20.12** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
You have done the model check and sent the handshake. Kanri's reply carries the
topic, where the spec goes, and whether a batch of another topic is in flight —
which is the draft rule of Step 1.
```

**P20.12 →**

```markdown
You have done the model check. Kanri spawned you, and the keys of your own
prompt are your orders: `topic=`; `spec=`, where the spec goes; `branch=`,
the branch the tree is on; `input=`, the topic's input document, when there
is one — read it whole, and every document it lists; and `ledger=`, naming
the in-flight topic's ledger, when a batch of another topic is in flight,
`spec=` then naming the draft path — which is the draft rule of Step 1. Your
standing grant, the spec dialogue, is implied by the role and stated here,
since no line of Kanri's carries it.
```

**P20.13** `skills/tanto/roles/sekkei.md` — replace exactly this 1 line

```markdown
- Spec — the path Kanri's orders line names; by default
```

**P20.13 →**

```markdown
- Spec — the path your `spec=` key names; by default
```

**P20.14** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
Kanri cuts the branch, at the topic's opening or right after the
predecessor's merge, and its orders line's `branch=` names the branch the
tree is on: you commit there and cut nothing. When a batch of another topic
```

**P20.14 →**

```markdown
Kanri cuts the branch, at the topic's opening or right after the
predecessor's merge, and your `branch=` key names the branch the tree is
on: you commit there and cut nothing. When a batch of another topic
```

**P20.15** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
`.tanto/<topic>/spec-review.md` with a **Shoroku proposal** section at the
end. When a batch of another topic is in flight, tell it — as the orders line
tells you — that the in-flight plan's paths are out of scope. Rule on every
```

**P20.15 →**

```markdown
`.tanto/<topic>/spec-review.md` with a **Shoroku proposal** section at the
end. When a batch of another topic is in flight, tell it — as your `ledger=`
key tells you — that the in-flight plan's paths are out of scope. Rule on every
```

**P20.16** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
stamp and a line that carries one reads with two,
the ledger being the one your orders line's `ledger=` names, else your own
topic's `.tanto/<topic>/kanri.md` — not a message,
```

**P20.16 →**

```markdown
stamp and a line that carries one reads with two,
the ledger being the one your `ledger=` key names, or the one a later
`ledger=<path>` line from Kanri names, else your own
topic's `.tanto/<topic>/kanri.md` — not a message,
```

**P20.17** `skills/tanto/roles/sekkei.md` — replace exactly these 9 lines

```markdown
Your tenure ends here, and your shoroku proposal is part of it. When the
human's answers are in `dialogue.md` and the edits they asked for are
committed — or are in the draft — write your shoroku proposal as the bullet
below describes, run the self-check of `SKILL.md`'s Resuming, and send Kanri
**one** line naming both:
`spec accepted: <spec path>; shoroku proposal: <path> — <reading>`. Then
idle. Kanri sends you no `exit:` at this boundary; it checks the proposal's
form, records its items, and sends you `release: /clear this window` at
once, and the plan is Keikaku's from then on.
```

**P20.17 →**

```markdown
Your tenure ends here, and your shoroku proposal is part of it. When the
human's answers are in `dialogue.md` and the edits they asked for are
committed — or are in the draft — write your shoroku proposal as the bullet
below describes and send Kanri **one** line naming both:
`spec accepted: <spec path>; shoroku proposal: <path> — <reading>`. Then
end the turn as that bullet says. Kanri sends you no `exit:` at this
boundary; it checks the proposal's form, records its items, and writes your
`stop` request at once — no line reaches you — and the plan is Keikaku's
from then on.
```

**P20.18** `skills/tanto/roles/sekkei.md` — replace exactly these 2 lines

```markdown
- You write only under the spec and plan directory the orders line names — by
  default `docs/superpowers/` — and `.tanto/`, and you may write there **at
```

**P20.18 →**

```markdown
- You write only under the spec and plan directory your `spec=` key names — by
  default `docs/superpowers/` — and `.tanto/`, and you may write there **at
```

**P20.19** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
`commit-ready: sekkei <topic> — <subject> — <YYYY-MM-DD HH:MM>` through
`boundary.js record --event`, to the ledger your orders line's `ledger=`
names, and go on with your work. Kanri opens the commit window at the next
```

**P20.19 →**

```markdown
`commit-ready: sekkei <topic> — <subject> — <YYYY-MM-DD HH:MM>` through
`boundary.js record --event`, to the ledger your `ledger=` key, or a later
`ledger=<path>` line from Kanri, names, and go
on with your work. Kanri opens the commit window at the next
```

**P20.20** `skills/tanto/roles/sekkei.md` — replace exactly these 4 lines

```markdown
  window. Before the line, run the self-check of
  `SKILL.md`'s Resuming — one `ListAgents`; a name that is not your row's means
  you were resumed, and the handshake goes first. The authorization lasts until
  you answer or until Kanri's next message, and a commit you did not make
```

**P20.20 →**

```markdown
  window. The authorization lasts until
  you answer or until Kanri's next message, and a commit you did not make
```

**P20.21** `skills/tanto/roles/sekkei.md` — replace exactly these 9 lines

```markdown
  the basename of your transcript path. Then stop
  there, with your closing line — the spec, the dialogue, and the proposal
  by path; the step that still needs this seat, `none` — and wait for
  Kanri's `release: /clear this window`: Kanri checks the proposal's form,
  records its items as `pending` rows, and sends that line at once — no
  recommender runs before the topic's close, where your items are
  recommended and checked with everything else. On `release:` tell the
  human to `/clear` this window and end your turn. If more work reaches you
  before it — a cold-read
```

**P20.21 →**

```markdown
  the basename of your transcript path. Then stop
  there: end the turn with your closing line — the spec, the dialogue, and
  the proposal by path; the step that still needs this seat,
  `none — this seat has ended; close its tab if one is open` — and your park
  request. Kanri checks the proposal's form, records its items as `pending`
  rows, and writes your `stop` request at once — no recommender runs before
  the topic's close, where your items are recommended and checked with
  everything else. **This seat has ended** once that line is written: its
  row in the editor's session list stays and opens with your role in its
  context, so any later message — the human's, typed in a tab — is answered
  with that same closing line and nothing else. If Kanri's own line reaches
  you with more work before its stop — a cold-read
```

**P20.22** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
## Models

Every dispatch names a `subagent_type` and a `model` together; neither is
```

**P20.22 →**

````markdown
## The end of every turn — the park

You are a dialogue seat: between your turns the spawner stops your process
and keeps your conversation, and a line that is due wakes you again. You
ask for it yourself. **End every turn with a park request, unless something
you dispatched is still running** — a subagent, a background command. Write
it as the turn's last tool call, with `T` your transcript path and `$TANTO`
the skill's own directory, both set in the same tool call as the command:

```bash
node "$TANTO/scripts/boundary.js" request park --transcript "$T" [--waiting [--notice]]
```

- `--waiting` — a question you put to the human is unanswered at this
  turn's end: one of Step 1's design questions, or the review gate once the
  brief is in front of the human. Say it again at every turn's end for as
  long as the question stands, whatever started the turn: woken by a line
  from Kanri while it stands, you answer Kanri and park `--waiting` again.
- `--notice`, with `--waiting` — this turn was not started by the human's
  own message: a line from Kanri, a subagent's completion. The spawner then
  raises one desktop notice, and only when the question is new; a turn the
  human started raises none, and a question that already stood raises none
  again.
- A request with neither clears what an earlier one said.

A turn that ends awaiting a reply from Kanri parks too: the reply wakes
you. A turn with work in flight writes no request; the completion starts
another turn, and that turn's end asks. The spawner stops you only once the
turn has ended and your process is idle, and never while a tab or a
terminal holds you, so the request never cuts work short.

## Models

Every dispatch names a `subagent_type` and a `model` together; neither is
````

**P20.23** `skills/tanto/roles/keikaku.md` — replace exactly these 6 lines

```markdown
You have done the model check and sent **no** handshake: you are a terminal
seat, spawned at the boundary "the spec review is accepted", and the keys
of your own prompt — `topic=`, `spec=`, `plan=`, and `ledger=` when another
topic's batch is in flight — are your orders. Your
standing grant, the plan dialogue, is implied by the role and stated here;
no orders line carries it, because there is no orders line.
```

**P20.23 →**

```markdown
You have done the model check. Kanri spawned you at the boundary "the spec
review is accepted", and the keys of your own prompt — `topic=`, `spec=`,
`plan=`, and `ledger=` when another topic's batch is in flight — are your
orders. Your standing grant, the plan dialogue, is implied by the role and
stated here, since no line of Kanri's carries it.
```

**P20.24** `skills/tanto/roles/keikaku.md` — replace exactly these 3 lines

```markdown
  sentence that until then the authority for the run's sessions is the
  constraints, Kanri's orders line, and the batch prompts (contract rule
  11).
```

**P20.24 →**

```markdown
  sentence that until then the authority for the run's sessions is the
  constraints, each seat's own prompt keys, and the batch prompts (contract
  rule 11).
```

**P20.25** `skills/tanto/roles/keikaku.md` — replace exactly these 3 lines

```markdown
proposal as the bullet below describes and send **one** line carrying every
pointer and the proposal — no self-check runs first, a terminal seat's
rename being for the spawner's census to notice:
```

**P20.25 →**

```markdown
proposal as the bullet below describes and send **one** line carrying every
pointer and the proposal:
```

**P20.26** `skills/tanto/roles/keikaku.md` — replace exactly these 3 lines

```markdown
Then idle. Kanri sends you no `exit:` at this boundary; it checks the
proposal's form, records its items, and writes your `stop` request at once —
no line reaches you, nothing is `/clear`ed, and your conversation is kept.
```

**P20.26 →**

```markdown
Then end the turn as that bullet says. Kanri sends you no `exit:` at this
boundary; it checks the proposal's form, records its items, and writes your
`stop` request at once — no line reaches you, and your conversation is kept.
```

**P20.27** `skills/tanto/roles/keikaku.md` — replace exactly these 2 lines

```markdown
  window. No self-check runs first. The authorization lasts until
  you answer or until Kanri's next message, and a commit you did not make
```

**P20.27 →**

```markdown
  window. The authorization lasts until
  you answer or until Kanri's next message, and a commit you did not make
```

**P20.28** `skills/tanto/roles/keikaku.md` — replace exactly these 9 lines

```markdown
  process, and the defects noticed. Then stop there, with your closing line
  — the plan, the dry run, and the proposal by path; the step that still
  needs this seat, `none`. Kanri checks the proposal's form, records
  its items as `pending` rows, and writes your `stop` request at once — no
  recommender
  runs before the topic's close, where your items are recommended and
  checked with everything else. Your turn ends with your closing line and
  nothing else; the stop follows it, and you tell no human anything. Work
  that reaches you before it — a report
```

**P20.28 →**

```markdown
  process, and the defects noticed. Then stop there, with your closing line
  — the plan, the dry run, and the proposal by path; the step that still
  needs this seat,
  `none — this seat has ended; close its tab if one is open`. Kanri checks
  the proposal's form, records its items as `pending` rows, and writes your
  `stop` request at once — no recommender runs before the topic's close,
  where your items are recommended and checked with everything else. Your
  turn ends with your closing line and your park request, and nothing else;
  the stop follows it, and you tell no human anything. **This seat has
  ended** once that line is written: its row in the editor's session list
  stays and opens with your role in its context, so any later message — the
  human's, typed in a tab — is answered with that same closing line and
  nothing else. Work from Kanri that reaches you before the stop — a report
```

**P20.29** `skills/tanto/roles/keikaku.md` — replace exactly these 3 lines

```markdown
## Models

Every dispatch names a `subagent_type` and a `model` together; neither is
```

**P20.29 →**

````markdown
## The end of every turn — the park

You are a dialogue seat: between your turns the spawner stops your process
and keeps your conversation, and a line that is due wakes you again. You
ask for it yourself. **End every turn with a park request, unless something
you dispatched is still running** — a subagent, a background command. Write
it as the turn's last tool call, with `T` your transcript path and `$TANTO`
the skill's own directory, both set in the same tool call as the command:

```bash
node "$TANTO/scripts/boundary.js" request park --transcript "$T" [--waiting [--notice]]
```

- `--waiting` — a question you put to the human in the plan dialogue is
  unanswered at this turn's end. Say it again at every turn's end for as
  long as the question stands, whatever started the turn: woken by a line
  from Kanri while it stands, you answer Kanri and park `--waiting` again.
  Your review gate asks the human nothing — you answer the plan brief by
  default (Step 4) — so it is no wait of its own.
- `--notice`, with `--waiting` — this turn was not started by the human's
  own message: a line from Kanri, a subagent's completion. The spawner then
  raises one desktop notice, and only when the question is new; a turn the
  human started raises none, and a question that already stood raises none
  again.
- A request with neither clears what an earlier one said.

A turn that ends awaiting a reply from Kanri parks too: the reply wakes
you. A turn with work in flight writes no request; the completion starts
another turn, and that turn's end asks. The spawner stops you only once the
turn has ended and your process is idle, and never while a tab or a
terminal holds you, so the request never cuts work short.

## Models

Every dispatch names a `subagent_type` and a `model` together; neither is
````

**P20.30** `skills/tanto/roles/kikaku.md` — replace exactly these 9 lines

```markdown
`/tanto kikaku` — Kanri's address is the first
data row of `.tanto/roster.md`, and there is no address argument. You have
done the model and effort check
and sent the handshake; Kanri answers with the open topics, if any — it
announces no address; you read the roster's first data row at every send.

Kanri never asks for a Kikaku and never spawns one. The human opens one when
they want to think, so there is nothing behind you and no `release:` waiting
for you.
```

**P20.30 →**

```markdown
`tanto kikaku`, typed in a terminal, starts you or enters you: the launcher
spawns this seat when the run holds no Kikaku, and attaches the human to the
one it holds. You have done the model and effort check; a mismatch goes in
your start line, since you send Kanri no first line. Nothing arrives from
Kanri at your start: the open topics are on disk — the roster's rows and
each open topic's ledger, `.tanto/<topic>/kanri.md` — and you read them when
the subject needs them. Kanri's address is the first data row of
`.tanto/roster.md`, read at every send, and there is no address argument.
When there is no roster — `tanto kikaku` in a repository where no Kanri
holds a run — and you have a `decision:` line to send, keep the file, say in
your closing line that no Kanri holds a run here and that `tanto` starts
one, and read the roster again at each later turn, as the rule above on a
held line asks.

The launcher starts a Kikaku at the human's `tanto kikaku`, never at Kanri's
word: the human starts one when they want to think, so there is nothing
behind you and no step of the run waits on you. The run holds one Kikaku at
a time, and `tanto kikaku` while one is held enters it.
```

**P20.31** `skills/tanto/roles/kikaku.md` — replace exactly these 11 lines

```markdown
You have a roster row — role `kikaku`, no topic — with status `live`. No
ask, no request, no `release:` line, no replace row, and no shoroku
proposal: what you produce is on disk before the window closes.

The human `/clear`s this window when the subject changes. The next `/tanto`
in it, in any role, re-handshakes with a new transcript, and Kanri writes a
new row; its census, which no longer lists the old `sessionId`, marks the
old row `dead` — the rule every window follows. After an editor restart
nothing is typed here: Kanri's census finds this session under its new name
by its `sessionId`, and `/tanto fukki` stays accepted. Your `decision: <path>` line carries the `no-role` line as its second line,
like every tanto line.
```

**P20.31 →**

```markdown
You have a roster row — role `kikaku`, no topic — with status `live`, which
Kanri writes from the spawner's result at its next census. No request of
Kanri's, no replace row, and no shoroku proposal: what you produce is on
disk before you leave.

Between your turns you are parked (below), at no cost, and the next
`tanto kikaku` continues this conversation, its `context=` in front of the
human as they enter. An editor reload asks nothing of you: a tab that holds
you comes back under a new name, and nothing keys on it.

When the subject changes and the human wants a fresh conversation, they
type `/tanto taiseki` (退席, `leave`) here, and this seat ends:

1. Write out what is unsent: with something decided and no file, write the
   decision file and send its `decision:` line.
2. Run `node "$TANTO/scripts/boundary.js" request leave --transcript "$T"`,
   `T` and `$TANTO` set in the same tool call, which asks the spawner to
   stop this seat once this turn has ended.
3. End the turn with your closing line, its second fact
   `none — this seat has ended; close its tab if one is open`, and no park
   request.

**This seat has ended** once that line is written: any later message — the
human's, in a tab still open on it — is answered with that same closing
line and nothing else, and the next `tanto kikaku` starts a new
conversation. Kanri writes your row `stopped` at its next census. Your
`decision: <path>` line carries the `no-role` line as its second line, like
every tanto line.
```

**P20.32** `skills/tanto/roles/kikaku.md` — replace exactly these 3 lines

```markdown
## Rule 9

You are on the top family and human-paced, and you are not counted: at most
```

**P20.32 →**

````markdown
## The end of every turn — the park

You are a dialogue seat: between your turns the spawner stops your process
and keeps your conversation, and the human's next `tanto kikaku`, or a click
on your row in the editor's session list, wakes you again. You ask for it
yourself. **End every turn with a park request, unless something you
dispatched is still running** — a subagent, a background command. Write it
as the turn's last tool call, with `T` your transcript path and `$TANTO` the
skill's own directory, both set in the same tool call as the command:

```bash
node "$TANTO/scripts/boundary.js" request park --transcript "$T" [--waiting [--notice]]
```

- `--waiting` — a question you put to the human is unanswered at this
  turn's end. Say it again at every turn's end for as long as the question
  stands, whatever started the turn.
- `--notice`, with `--waiting` — this turn was not started by the human's
  own message: a subagent's completion. The spawner then raises one desktop
  notice, and only when the question is new; a turn the human started
  raises none, and a question that already stood raises none again.
- A request with neither clears what an earlier one said.

A turn with work in flight writes no request; the completion starts another
turn, and that turn's end asks. The spawner stops you only once the turn has
ended and your process is idle, and never while a tab or a terminal holds
you, so the request never cuts work short.

## Rule 9

You are on the top family and human-paced, and you are not counted: at most
````

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 20
```

Expected: `task 20: verify clean`.

- [ ] **Step 3: Sweep the old values**

```bash
git grep -n -E -e 'handshake' -e 'self-check' -e 'orders line' -e 'release:' -e '[/]clear' -e 'terminal seat' -e "Kanri's reply" -e 'Kanri never asks for a Kikaku' -e 's this window when the subject changes' -e 'stays accepted' -- skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kikaku.md
```

Expected: no output, exit status 1 — O20.1 to O20.10 at zero. (`[/]clear` keeps Git Bash from rewriting a leading `/` as a Windows path.)

- [ ] **Step 4: Run lint per Global Constraints** on
  `skills/tanto/roles/sekkei.md`, `skills/tanto/roles/keikaku.md`, and
  `skills/tanto/roles/kikaku.md`.

- [ ] **Step 5: Commit per Global Constraints** — subject
  `docs: Sekkei, Keikaku, and Kikaku park between turns and take their orders from their prompt keys`;
  paths `skills/tanto/roles/sekkei.md`, `skills/tanto/roles/keikaku.md`,
  `skills/tanto/roles/kikaku.md`.

### Task 21: `roles/hosa.md`, `roles/kaiseki.md`, `roles/jisso.md`

Spec section 6's entries for the three files, carrying 1.1 (Hosa's standing
grant stated in its role file; an attached Kaiseki's `brief=` key, its grant
staying in its brief), 1.4 (a Hosa and a standalone Kaiseki say a model
mismatch in their start line), 2.2 (the park rule, in the words Task 20
gives it), 3.1 (the bug intake falls to Kanri while the Hosa is parked), 5.1
(the ended seat's closing line and rule, Kanri's `stop` in place of
`release:`), and 5.2 (`taiseki` for a Hosa and a standalone Kaiseki). Hosa:
the opening's grant clause, "How you start", the intake's address,
"Lifecycle" (`taiseki`; `/compact` stays), and the park section. Kaiseki:
"Two ways you are started" (`brief=`, `tanto kaiseki`, `taiseki` for the
standalone), the exit's `release:` and `/clear`, the report's self-check,
"After the report", and the park section. Jisso: the handshake sentence, the
self-check clause, and "nothing is `/clear`ed"; no behavior changes.

After this task, no role file but `roles/kanri.md` mentions a handshake, a
self-check, a `release:` line, or a `/clear`, and Hosa and a standalone
Kaiseki end by `taiseki`.

**Files:**

- Modify: `skills/tanto/roles/hosa.md` — the opening, "How you start", "Whose
  work you take" (the intake's first sentence), "Lifecycle", and a new
  section before "Models".
- Modify: `skills/tanto/roles/kaiseki.md` — "Two ways you are started",
  "Tree discipline"'s exit paragraph, "The report", and "After the report",
  with a new section after it.
- Modify: `skills/tanto/roles/jisso.md` — "Start", and steps 2 and 3 of the
  batch-end list.

**Interfaces:**

- Consumes: as Task 20; `boundary.js request leave` (Task 6) and the
  spawner's `self` stop (Task 1); the attached Kaiseki's prompt
  `/tanto kaiseki topic=<topic> brief=<path>` as Kanri writes it (Task 17's
  "The Kaiseki branch", Task 19's "Create").
- Produces: nothing another task reads.

**Named-mechanism sites.** The park request, `taiseki`/`request leave`, and
the ended seat's closing line: the sites Task 20 lists, with
`roles/sekkei.md`, `roles/keikaku.md`, and `roles/kikaku.md` (Task 20) in
place of these three. The intake's address rule (a `live` Hosa that is
listed, else Kanri) is also `SKILL.md`'s "Messages" bug-report paragraph
(Task 14), `roles/kanri.md`'s "Bug intake" (Task 18), and the README's bug
report bullet (Task 23); `templates/bug-report.md`'s intake sentence stays
true in letter and is not touched (spec section 6). The intake's "checked
against `ListAgents`" for another repository's roster stays, as does
`roles/kaiseki.md`'s. The attached Kaiseki's `brief=` key is also
`SKILL.md`'s "Invocation" prompt table (Task 12), `roles/kanri.md`'s "The
Kaiseki branch" (Task 17) and "Create" (Task 19), and
`templates/spawn-request.md`'s `prompt` bullet (Task 22). Jisso's
closing-line name — the listing's, by its own `sessionId` — is also
`SKILL.md`'s "Messages" (Task 14). The other self-check sites are Task 20's
list. `templates/kaiseki-brief.md`'s grant, "the debugging conversation in
this window", is an attached Kaiseki's grant in its brief (spec 1.1) and is
not touched.

**O21.1** `handshake` — Hosa's "How you start" and its `/compact` and re-`/tanto` sentences, Kaiseki's attached and standalone starts and its report's self-check, Jisso's "sent **no** handshake" (spec 1.1); before: 3 in `skills/tanto/roles/hosa.md`, 3 in `skills/tanto/roles/kaiseki.md`, 1 in `skills/tanto/roles/jisso.md`, after: 0 in each.

**O21.2** `self-check` — Kaiseki's exit and report, Jisso's step 2 (spec 1.3, 3.1); before: 3 in `skills/tanto/roles/kaiseki.md`, 1 in `skills/tanto/roles/jisso.md`, after: 0 in each.

**O21.3** `release:` — Hosa's "Lifecycle", Kaiseki's exit (spec 5.1); before: 1 in `skills/tanto/roles/hosa.md`, 1 in `skills/tanto/roles/kaiseki.md`, after: 0 in each.

**O21.4** `/clear` — Hosa's "Lifecycle", Kaiseki's exit (twice), Jisso's step 3 (spec 5.1); before: 1 in `skills/tanto/roles/hosa.md`, 2 in `skills/tanto/roles/kaiseki.md`, 1 in `skills/tanto/roles/jisso.md`, after: 0 in each. `/compact` in `roles/hosa.md` stays (spec, Old values).

**O21.5** `Kanri's reply` — the attached Kaiseki's brief path as carried by Kanri's reply (spec 1.1); before: 1 in `skills/tanto/roles/kaiseki.md`, after: 0.

**O21.6** `Kanri never requests a Hosa` — "How you start" (spec 1.1, 6); before: 1 in `skills/tanto/roles/hosa.md`, after: 0.

**O21.7** `Kanri's answer names` — the opening's grant, which Kanri's answer to the handshake named (spec 1.1); before: 1 in `skills/tanto/roles/hosa.md`, after: 0.

**O21.8** `from a session of this one — and one that` — the intake addressed to a `live` Hosa whether or not it is listed (spec 3.1); before: 1 in `skills/tanto/roles/hosa.md`, after: 0.

**O21.9** `Before the human closes the session` — the standalone Kaiseki's end, now `taiseki` (spec 5.2); before: 1 in `skills/tanto/roles/kaiseki.md`, after: 0.

**O21.10** `You are released only once` — the attached Kaiseki's end as a `release:` line (spec 5.1); before: 1 in `skills/tanto/roles/kaiseki.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P21.11 to P21.25.

**P21.11** `skills/tanto/roles/hosa.md` — replace exactly these 2 lines

```markdown
You talk to the human, who hands you work directly in this window under the
standing grant Kanri's answer names, and to Kanri. You never message
```

**P21.11 →**

```markdown
You talk to the human, who hands you work directly here under your standing
grant, stated in How you start, and to Kanri. You never message
```

**P21.12** `skills/tanto/roles/hosa.md` — replace exactly these 9 lines

```markdown
`/tanto hosa` — Kanri's address is the first data row of
`.tanto/roster.md`, and there is no address argument. You have done the
model and effort check
and sent the handshake; Kanri answers with one line,
"tracked files only in a slot I give" — it announces no address; you read the
roster's first data row at every send.

Kanri never requests a Hosa. The human opens one; while none is live, Kanri
does its own chores.
```

**P21.12 →**

```markdown
`tanto hosa`, typed in a terminal, starts you or enters you: the launcher
spawns this seat when the run holds no Hosa, and attaches the human to the
one it holds. You have done the model and effort check; a mismatch goes in
your start line, since you send Kanri no first line, and nothing arrives
from Kanri at your start. Kanri's address is the first data row of
`.tanto/roster.md`, read at every send, and there is no address argument.

Your standing grant is the chores the human hands you here: untracked work
and anything under `.tanto/` at any time, and tracked files only in a slot
Kanri gives (The slot).

The launcher starts a Hosa at the human's `tanto hosa`, never at Kanri's
word; while none is held, Kanri does its own chores. The run holds one Hosa
at a time, and `tanto hosa` while one is held enters it.
```

**P21.13** `skills/tanto/roles/hosa.md` — replace exactly these 5 lines

```markdown
**The intake's.** While your roster row's Status begins with `live`, every
`bug-report: <path>` line for this repository is addressed to you, from
another repository's session or from a session of this one — and one that
arrives after Kanri has since marked your row otherwise is answered the
same way, since the sender read the roster once and the act is harmless —
```

**P21.13 →**

```markdown
**The intake's.** While your roster row's Status begins with `live` and the
listing shows you — in a turn, or held by a terminal — every
`bug-report: <path>` line for this repository is addressed to you, from
another repository's session or from a session of this one; while you are
parked it is Kanri's, as it is in practice, since you park at every turn's
end. One that arrives after Kanri has since marked your row otherwise is
answered the same way, since the sender read the roster once and the act is
harmless —
```

**P21.14** `skills/tanto/roles/hosa.md` — replace exactly these 7 lines

```markdown
You have a roster row, no topic. Kanri neither asks for you nor spawns you,
you get no `release:` line, no
replace row, and you write no shoroku proposal. The human `/clear`s this window at will.

Between jobs — never with a `chore:` still open or a `slot-needed:`
unanswered — the human may `/compact` it instead: the session id and
the transcript survive, so this costs no re-handshake and no wake-up of
```

**P21.14 →**

```markdown
You have a roster row, no topic, which Kanri writes from the spawner's
result at its next census. Kanri neither asks for you nor spawns you, you
get no replace row, and you write no shoroku proposal. Between your turns
you are parked (below), and the next `tanto hosa` continues this
conversation, its `context=` in front of the human as they enter.

The human ends this seat at will with `/tanto taiseki` (退席, `leave`),
typed here — never with a `chore:` still open or a `slot-needed:`
unanswered: then say which is open, and do not leave. Otherwise run
`node "$TANTO/scripts/boundary.js" request leave --transcript "$T"`, `T` and
`$TANTO` set in the same tool call, which asks the spawner to stop this seat
once this turn has ended, and end the turn with your closing line, its
second fact `none — this seat has ended; close its tab if one is open`, and
no park request. **This seat has ended** once that line is written: any
later message — the human's, in a tab still open on it — is answered with
that same closing line and nothing else, the next `tanto hosa` starts a new
conversation, and Kanri writes your row `stopped` at its next census.

Between jobs — never with a `chore:` still open or a `slot-needed:`
unanswered — the human may `/compact` it instead of ending it: the session
id and the transcript survive, so this costs no new seat and no wake-up of
```

**P21.15** `skills/tanto/roles/hosa.md` — replace exactly these 4 lines

```markdown
The next `/tanto` in it, in any role, re-handshakes as a new session with a
new `sessionId`, and Kanri's census, which no longer lists the old one,
marks the old row `dead`. Your closing line after a chore names
the commit subject and `none`.
```

**P21.15 →**

```markdown
Your closing line after a chore names the commit subject and `none`.
```

**P21.16** `skills/tanto/roles/hosa.md` — replace exactly these 3 lines

```markdown
## Models

Any subagent you dispatch takes `subagents.default`, dispatched as
```

**P21.16 →**

````markdown
## The end of every turn — the park

You are a dialogue seat: between your turns the spawner stops your process
and keeps your conversation, and a line that is due — Kanri's `chore:` or
`slot:`, or the human's `tanto hosa` — wakes you again. You ask for it
yourself. **End every turn with a park request, unless something you
dispatched is still running** — a subagent, a background command. Write it
as the turn's last tool call, with `T` your transcript path and `$TANTO` the
skill's own directory, both set in the same tool call as the command:

```bash
node "$TANTO/scripts/boundary.js" request park --transcript "$T" [--waiting [--notice]]
```

- `--waiting` — a question you put to the human is unanswered at this
  turn's end. Say it again at every turn's end for as long as the question
  stands, whatever started the turn: woken by a line from Kanri while it
  stands, you answer Kanri and park `--waiting` again.
- `--notice`, with `--waiting` — this turn was not started by the human's
  own message: a line from Kanri, a subagent's completion. The spawner then
  raises one desktop notice, and only when the question is new; a turn the
  human started raises none, and a question that already stood raises none
  again.
- A request with neither clears what an earlier one said.

A turn that ends awaiting a reply from Kanri — a `slot-needed:` — parks too:
the reply wakes you. A turn with work in flight writes no request; the
completion starts another turn, and that turn's end asks. The spawner stops
you only once the turn has ended and your process is idle, and never while
a tab or a terminal holds you, so the request never cuts work short.

## Models

Any subagent you dispatch takes `subagents.default`, dispatched as
````

**P21.17** `skills/tanto/roles/kaiseki.md` — replace exactly these 4 lines

```markdown
**Attached.** `/tanto kaiseki topic=<topic>` — the key is what makes you
attached, and Kanri's address is the roster's first data
row. You have done the model check and sent the handshake. Kanri's reply
carries the brief path, or `no brief, stop`.
```

**P21.17 →**

```markdown
**Attached.** `/tanto kaiseki topic=<topic> brief=<path>` — Kanri spawns you
with both keys, having written the brief first; the keys are what make you
attached, the brief is your orders, and Kanri's address is the roster's
first data row. You have done the model check.
```

**P21.18** `skills/tanto/roles/kaiseki.md` — replace exactly these 2 lines

```markdown
**Standalone.** `/tanto kaiseki` with no key — no handshake and no
batch loop, roster or no roster. Ask the human for the symptom and the reproduction, and write your
```

**P21.18 →**

```markdown
**Standalone.** `/tanto kaiseki` with no key, which `tanto kaiseki` typed in
a terminal starts — no batch loop, roster or no roster, and a model mismatch
goes in your start line, since you send Kanri no first line. Ask the human
for the symptom and the reproduction, and write your
```

**P21.19** `skills/tanto/roles/kaiseki.md` — replace exactly these 3 lines

```markdown
with two additions. Before the human closes the session, run `shoroku` in its
ordinary session mode, with the human answering `Direction?`, and commit once —
there is no Kanri to rule for you. And when the human asks for a defect to be
```

**P21.19 →**

```markdown
with two additions. The human ends a standalone session with
`/tanto taiseki` (退席, `leave`), typed here: first run `shoroku` in its
ordinary session mode, with the human answering `Direction?`, and commit
once — there is no Kanri to rule for you — then run
`node "$TANTO/scripts/boundary.js" request leave --transcript "$T"`, `T` and
`$TANTO` set in the same tool call, and end the turn with your closing line,
its second fact `none — this seat has ended; close its tab if one is open`,
and no park request; any later message is answered with that same line and
nothing else, and the next `tanto kaiseki` starts a new session. And when
the human asks for a defect to be
```

**P21.20** `skills/tanto/roles/kaiseki.md` — replace exactly these 7 lines

```markdown
does not — run the self-check of `SKILL.md`'s Resuming, and answer
`shoroku proposal: <path> — <reading>`. Then
idle with your closing line — the report and the proposal by path; the step
that still needs this seat, `none`: your items are recommended and checked
at the topic's close, with everything else, and Kanri's
`release: /clear this window` follows the form check. On it, tell the human
to `/clear` this window and end your turn.
```

**P21.20 →**

```markdown
does not — and answer `shoroku proposal: <path> — <reading>`. Then end the
turn with your closing line — the report and the proposal by path; the step
that still needs this seat,
`none — this seat has ended; close its tab if one is open`: your items are
recommended and checked at the topic's close, with everything else — and
your park request. Kanri's `stop` request follows the form check, and no
line reaches you. **This seat has ended** once that line is written: any
later message — the human's, typed in a tab — is answered with that same
closing line and nothing else.
```

**P21.21** `skills/tanto/roles/kaiseki.md` — replace exactly these 5 lines

```markdown
already in `.tanto/kaiseki/`. Attached, before the line, run the
self-check of `SKILL.md`'s Resuming — one `ListAgents`; a name that is not your
row's means you were resumed, and the handshake goes first; standalone, there
is no roster and no self-check. Then send Kanri one line with
the path — standalone, there is no Kanri to send to, and the report goes to the
```

**P21.21 →**

```markdown
already in `.tanto/kaiseki/`. Attached, send Kanri one line with
the path — standalone, there is no Kanri to send to, and the report goes to the
```

**P21.22** `skills/tanto/roles/kaiseki.md` — replace exactly these 6 lines

```markdown
Idle, with your closing line: the report by path, and the step that still
needs this seat — a further brief, or Kanri's `exit:` line. If Kanri sends
another brief for a `blocks this task: yes` item, you keep your context and
work it the same way. You are released only once Jisso's fix has passed
review and tests and no blocking item is open — and that is Kanri's line,
not your judgment.
```

**P21.22 →**

````markdown
End the turn with your closing line and your park request: the report by
path, and the step that still needs this seat — a further brief, or Kanri's
`exit:` line. If Kanri sends another brief for a `blocks this task: yes`
item, it wakes you, and you keep your context and work it the same way. You
are ended only once Jisso's fix has passed review and tests and no blocking
item is open — and that is Kanri's `exit:` line and its `stop`, not your
judgment.

## The end of every turn — the park

You are a dialogue seat: between your turns the spawner stops your process
and keeps your conversation, and a line that is due — a brief, a
`human-access:` line, the human's `tanto kaiseki` — wakes you again. You ask
for it yourself. **End every turn with a park request, unless something you
dispatched is still running** — a subagent, a background command. Write it
as the turn's last tool call, with `T` your transcript path and `$TANTO` the
skill's own directory, both set in the same tool call as the command:

```bash
node "$TANTO/scripts/boundary.js" request park --transcript "$T" [--waiting [--notice]]
```

- `--waiting` — a question you put to the human in the debugging
  conversation is unanswered at this turn's end. Say it again at every
  turn's end for as long as the question stands, whatever started the turn:
  woken by a line from Kanri while it stands, you answer Kanri and park
  `--waiting` again.
- `--notice`, with `--waiting` — this turn was not started by the human's
  own message: a line from Kanri, a subagent's completion. The spawner then
  raises one desktop notice, and only when the question is new; a turn the
  human started raises none, and a question that already stood raises none
  again.
- A request with neither clears what an earlier one said.

A turn that ends awaiting a reply from Kanri — a `human-needed:` — parks
too: the reply wakes you. A turn with work in flight writes no request; the
completion starts another turn, and that turn's end asks. The spawner stops
you only once the turn has ended and your process is idle, and never while
a tab or a terminal holds you, so the request never cuts work short.
````

**P21.23** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```markdown
You have done the model check and sent **no** handshake: you are a terminal
seat, and your own prompt carries one of two keys. With `batch=<path>` the
```

**P21.23 →**

```markdown
You have done the model check, and your own prompt carries one of two keys.
With `batch=<path>` the
```

**P21.24** `skills/tanto/roles/jisso.md` — replace exactly these 4 lines

```markdown
2. Send Kanri one line with that path. No self-check runs first: a terminal
   seat's rename is the spawner's census to notice, and the identity word
   your closing line carries is the `name` your own result file carried —
   your identity itself is your `sessionId`.
```

**P21.24 →**

```markdown
2. Send Kanri one line with that path. The name your closing line carries
   is the one the listing, `claude agents --json`, prints for your own
   `sessionId` — your identity itself is your `sessionId`, and the name is
   only what the listing calls it now.
```

**P21.25** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```markdown
   written, and Kanri's `stop` request follows — no line reaches you,
   nothing is `/clear`ed, and your conversation is kept. Two batches
```

**P21.25 →**

```markdown
   written, and Kanri's `stop` request follows — no line reaches you, and
   your conversation is kept. Two batches
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 21
```

Expected: `task 21: verify clean`.

- [ ] **Step 3: Sweep the old values**

```bash
git grep -n -E -e 'handshake' -e 'self-check' -e 'release:' -e '[/]clear' -e "Kanri's reply" -e 'Kanri never requests a Hosa' -e "Kanri's answer names" -e 'from a session of this one — and one that' -e 'Before the human closes the session' -e 'You are released only once' -- skills/tanto/roles/hosa.md skills/tanto/roles/kaiseki.md skills/tanto/roles/jisso.md
```

Expected: no output, exit status 1 — O21.1 to O21.10 at zero.

- [ ] **Step 4: Run lint per Global Constraints** on
  `skills/tanto/roles/hosa.md`, `skills/tanto/roles/kaiseki.md`, and
  `skills/tanto/roles/jisso.md`.

- [ ] **Step 5: Commit per Global Constraints** — subject
  `docs: Hosa and Kaiseki park between turns and end by taiseki; no role file but Kanri's sends a handshake`;
  paths `skills/tanto/roles/hosa.md`, `skills/tanto/roles/kaiseki.md`,
  `skills/tanto/roles/jisso.md`.

### Task 22: the run-time templates — `spawn-request.md`, `kanri-handover.md`, `boundary-brief.md`, `batch-prompt.md`

Spec section 6's entries for the four templates, carrying 1.1 (the writers;
every seat spawned on a request; `contract: 2`), 1.2 (`succeeds`, the
second-holder refusal), 1.3 (a peer by its `sessionId` and its bare name; no
`[ref]` about a seat), 2.2 to 2.5 (`park`, `hold`, `release`, `resume`'s
refusals and its prompt for a Kanri alone; `after`, `waiting`, `notice`,
`pid`, `forMs`), 4.3 (the launcher follows a handover), 4.4 (`once` and the
messenger), and 5.1 and 5.2 (`stop`'s notes, `self`). The request
template's writers paragraph, its example, the `op`, `role`, `mode`,
`prompt`, `sessionId`, and `message` bullets, six new field bullets, and a
paragraph of the new ops' results; the handover file's Live peers and its
Commands for the human; the boundary brief's `record` call and "What you
never do"; the batch prompt's Kanri line. `markdownlint` ignores
`skills/tanto/templates/**` by the repository's configuration, so the lint
step checks the hooks that do apply.

After this task, the request schema names every op and field the spawner of
batch A takes, and no run-time template carries a `[ref]` about a seat or a
tab seat.

**Files:**

- Modify: `skills/tanto/templates/spawn-request.md` — the writers and results
  paragraphs, the example, the bullets named above, and a closing list.
- Modify: `skills/tanto/templates/kanri-handover.md` — "Live peers" and
  "Commands for the human".
- Modify: `skills/tanto/templates/boundary-brief.md` — "What you never do"
  and the procedure's step 4.
- Modify: `skills/tanto/templates/batch-prompt.md` — "Setup on resume".

**Interfaces:**

- Consumes: `scripts/spawner.js`'s ops and seat schema (Tasks 1 to 4),
  `scripts/boundary.js`'s `request`, `seat`, and `wake` (Task 6), and
  `scripts/tanto.js`'s requests (Tasks 8 to 11).
- Produces: the request and result shapes Kanri writes and reads from this
  batch's commit on; the handover file the successor of section 7's step 4
  reads; the `record` call the boundary subagent runs.

**Named-mechanism sites.** The ops `park`, `hold`, and `release`, and the
fields `contract`, `succeeds`, `once`, `self`, `after`, `waiting`, `notice`,
`pid`, and `forMs`, are also `scripts/spawner.js` (Tasks 1 to 4) — whose
`OPS` comment reads "The ops, in the order `templates/spawn-request.md`
documents them", so Task 3's `OPS` order is `spawn`, `stop`, `rm`,
`resume`, `attention`, `ack`, `park`, `hold`, `release`, as the `op` bullet
lists them —
`scripts/boundary.js` (Task 6), `scripts/tanto.js` (Tasks 8 to 11), and
`SKILL.md`'s Artifacts spawner row (Task 15). The errors `held:`, `not a
dialogue seat`, `ended`, `in a tab`, `held by another terminal`,
`old-contract seat`, `no prompt for this role`, `listed`, `still listed`,
`copy <id> removed`, and `not a seat the human paces`, and the notes
`in a tab` and `already exited`, are also `scripts/spawner.js` (Tasks 1 to
3) and, for `in a tab` and `held by another terminal`, `scripts/tanto.js`'s
refusals (Task 9). The notices `waiting:` and `taiseki not done:` are also
`scripts/spawner.js` (Tasks 1, 3, 4). The `role` list's `sekkei`,
`kaiseki`, `kikaku`, `hosa`, and `denrei` are also `templates/tanto.json`'s
`sessions` (Task 2) and `SKILL.md`'s "The expected-model config" (Task 12).
The `attention` message's `<id>` fill, which goes, is also
`scripts/spawner.js`'s `attention` branch (Task 4) and every `attention`
line of `roles/kanri.md` (Tasks 16, 18, 19). The bare `<name>` is also
`roles/kanri.md`'s loop step 6 `--status` argument (Task 17), its start
line and handover (Tasks 16, 17), `SKILL.md`'s "Messages" closing line
(Task 14), and `templates/roster.md`'s rows, whose `Name [ref]` column
header stays (Task 7). The `ListAgents` self-check is also `SKILL.md`'s
"Resuming" (Task 13); `templates/bug-report.md` is not touched.

**O22.1** `A tab seat is never` — the `role` bullet's "A tab seat is never spawned and never has a request", on the line that also carries the four-role list `kanri`, `keikaku`, `jisso`, or `shoki` (spec 1.1; the list's own needle carries backticks, which a needle cannot hold, and goes with this line); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O22.2** `for the first Kanri` — the writers, Kanri and the launcher for the first Kanri alone (spec 1.1); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O22.3** `what Kanri sets for every seat it spawns` — `mode`, set by Kanri alone (spec 1.1); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O22.4** `fills a bare` — `sessionId` filling `attention`'s `<id>` (spec section 6, `spawner.js`'s `attention` branch); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O22.5** `in it is filled by the` — `message`'s `<id>` filled by the spawner (spec 1.1, section 6); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O22.6** `a stopped Jisso's or Keikaku's conversation` — the seats whose conversation a stop keeps, now every seat (spec 1.1); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O22.7** `it waits for none of them` — Kanri waits for no result, which `boundary.js wake` now does for sixty seconds (spec 2.5); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O22.8** `name> [<ref>]` — Live peers' two lines and the batch prompt's Kanri line (spec 1.3); before: 2 in `skills/tanto/templates/kanri-handover.md`, 1 in `skills/tanto/templates/batch-prompt.md`, after: 0 in each.

**O22.9** `by name and place` — the queued Jissos by name (spec 1.3, 3.1); before: 1 in `skills/tanto/templates/kanri-handover.md`, after: 0.

**O22.10** `name [ref]>` — the `record` call's `--kanri`, `--jisso`, and `--peer-reading` (spec 1.3); before: 3 in `skills/tanto/templates/boundary-brief.md`, after: 0.

**O22.11** `self-check` — "What you never do" (spec 3.1); before: 1 in `skills/tanto/templates/boundary-brief.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P22.12 to P22.24.

**P22.12** `skills/tanto/templates/spawn-request.md` — replace exactly these 2 lines

```markdown
Written by Kanri at `.tanto/spawner/requests/<id>.json`, and by the launcher
for the first Kanri. `<id>` is `<ISO time>-<random>`, so a directory listing
```

**P22.12 →**

```markdown
Written at `.tanto/spawner/requests/<id>.json` by three writers, and by no
other. Kanri writes the `spawn` of every seat it starts — a Sekkei, a
Keikaku, a Jisso, an attached Kaiseki, shoki, and its own successor — its
`stop`, `rm`, `attention`, `ack`, and `release`, and, through
`boundary.js wake`, a `resume` and a `hold`. The launcher writes the `spawn`
of a Kanri when the run has none, of a Kikaku, a Hosa, a standalone
Kaiseki, and the messenger of `tanto fukki`; the `hold` and the `release`
around its attach to a dialogue seat; the `resume`s of `tanto` and `tanto fukki`; and
the `stop`s of `tanto teishi --seats`. A dialogue seat writes its own
`park`, and a Kikaku, a Hosa, or a standalone Kaiseki its own `stop` with
`self`, through `boundary.js request`. Every seat of a run is spawned on a
request. `<id>` is `<ISO time>-<random>`, so a directory listing
```

**P22.13** `skills/tanto/templates/spawn-request.md` — replace exactly these 3 lines

```markdown
The spawner writes `.tanto/spawner/results/<id>.json`, the request's own
fields with the op's fields added, and deletes the request. Kanri reads a
result when it next acts; it waits for none of them.
```

**P22.13 →**

```markdown
The spawner writes `.tanto/spawner/results/<id>.json`, the request's own
fields with the op's fields added, and deletes the request. Kanri reads a
result when it next acts and waits for none, but for the sixty seconds
`boundary.js wake` gives its `resume`s; the launcher waits for the result of
each request it writes, up to its `--timeout`.
```

**P22.14** `skills/tanto/templates/spawn-request.md` — replace exactly these 22 lines

````markdown
```json
{
  "op": "spawn",
  "role": "jisso",
  "topic": "<topic word, or — for Kanri>",
  "model": "<family, from sessions.<role>.model>",
  "effort": "<level, from sessions.<role>.effort>",
  "branch": "<the branch the shared tree is on>",
  "mode": "auto",
  "prompt": "/tanto jisso batch=.tanto/<topic>/batch-A-prompt.md",
  "worktree": "shoki-<topic>",
  "addDir": ["<repository root>"],
  "sessionId": "<for stop, rm, resume, ack, attention>",
  "message": "<for attention: one line, in the human's language>"
}
```

- `op` — one of `spawn`, `stop`, `rm`, `resume`, `attention`, `ack`. `rm` is
  written for shoki alone; a stopped Jisso's or Keikaku's conversation is
  kept.
- `role` — `kanri`, `keikaku`, `jisso`, or `shoki`. A tab seat is never
  spawned and never has a request.
````

**P22.14 →**

````markdown
```json
{
  "op": "spawn",
  "role": "jisso",
  "topic": "<topic word, or — for Kanri>",
  "model": "<family, from sessions.<role>.model>",
  "effort": "<level, from sessions.<role>.effort>",
  "branch": "<the branch the shared tree is on>",
  "mode": "auto",
  "prompt": "/tanto jisso batch=.tanto/<topic>/batch-A-prompt.md",
  "contract": 2,
  "succeeds": "<for a Kanri's handover spawn: the outgoing Kanri's sessionId>",
  "once": "<true, for the messenger alone>",
  "worktree": "shoki-<topic>",
  "addDir": ["<repository root>"],
  "sessionId": "<for every op but spawn>",
  "message": "<for attention: one line, in the human's language>",
  "after": "<for park, and for stop with self: a transcript record's uuid>",
  "waiting": "<for park: true, or absent>",
  "notice": "<for park: true, or absent>",
  "self": "<for stop: true when the seat asks to end itself>",
  "pid": "<for hold: the launcher's pid>",
  "forMs": "<for hold: 3300000, from Kanri's wake for the human>"
}
```

- `op` — one of `spawn`, `stop`, `rm`, `resume`, `attention`, `ack`,
  `park`, `hold`, and `release`. `rm` is written for shoki alone; the
  conversation of every other stopped seat is kept.
- `role` — `kanri`, `sekkei`, `keikaku`, `jisso`, `kaiseki`, `kikaku`,
  `hosa`, `shoki`, or `denrei`, the launcher's messenger, which has no role
  file and no roster row.
````

**P22.15** `skills/tanto/templates/spawn-request.md` — replace exactly these 10 lines

```markdown
- `mode` — passed to the spawned session as `--permission-mode`; `auto` is
  the default when absent, and is what Kanri sets for every seat it spawns.
  `manual` appears in a measurement and nowhere else.
- `prompt` — the seat's whole orders. `/tanto kanri` for a Kanri;
  `/tanto keikaku topic=<topic> spec=<path> plan=<path>`, with `ledger=<path>`
  added when another topic's batch is in flight, naming that ledger;
  `/tanto jisso batch=<path>` for an ordinary plan and
  `/tanto jisso queue=<topic>` for a plan that edits this skill; for shoki,
  the one line `brief: <.tanto/<topic>/shoki-brief.md>`, which is not a
  `/tanto` invocation at all.
```

**P22.15 →**

```markdown
- `mode` — passed to the spawned session as `--permission-mode`; `auto` is
  the default when absent, and is what Kanri and the launcher set for every
  seat they spawn. `manual` appears in a measurement and nowhere else.
- `prompt` — the seat's whole orders. `/tanto kanri` for a Kanri;
  `/tanto sekkei topic=<topic> spec=<path> branch=<branch> input=<path>`,
  `input=` only when an input document exists, with `ledger=<path>` added
  when another topic's batch is in flight and `spec=` then naming the draft
  path; `/tanto keikaku topic=<topic> spec=<path> plan=<path>`, with
  `ledger=<path>` added when another topic's batch is in flight, naming that
  ledger; `/tanto jisso batch=<path>` for an ordinary plan and
  `/tanto jisso queue=<topic>` for a plan that edits this skill;
  `/tanto kaiseki topic=<topic> brief=<path>` for an attached Kaiseki, its
  brief written before the request; the launcher's `/tanto kikaku`,
  `/tanto hosa`, and `/tanto kaiseki` with no key; for shoki, the one line
  `brief: <.tanto/<topic>/shoki-brief.md>`, and for the messenger its fixed
  forwarding prompt, neither of which is a `/tanto` invocation at all. A
  `resume` takes a `prompt` for a Kanri alone — `/tanto fukki`, from the
  launcher — and is refused one for any other role.
```

**P22.16** `skills/tanto/templates/spawn-request.md` — replace exactly these 2 lines

```markdown
- `addDir` — a list of directories, shoki's being the repository root, so
  that the scribe in its worktree can read `.tanto/`. Absent otherwise.
```

**P22.16 →**

```markdown
- `addDir` — a list of directories, shoki's being the repository root, so
  that the scribe in its worktree can read `.tanto/`. Absent otherwise.
- `contract` — `2` on every `spawn` written under this contract, which the
  spawner records on the seat. A seat spawned without it keeps the older
  behavior to its end: it is never parked or held, its handover is never
  refused, and it is `gone`, not `parked`, when it leaves the listing.
- `succeeds` — on a Kanri's handover `spawn`, the outgoing Kanri's
  `sessionId`. A `spawn` with `contract: 2` whose `role` is `kanri`,
  `kikaku`, or `hosa`, while `seats.json` holds a seat of that role, is
  refused with `error: "held: <sessionId>"`, unless it names that holder
  here.
- `once` — `true` on the messenger's `spawn` alone: the spawner stops and
  removes the seat once its turn has ended, and five minutes after its spawn
  in any case.
- `after` — on a `park`, and on a `stop` with `self`, the `uuid` of the last
  record of the seat's transcript that carries one when the request was
  written; `boundary.js request` reads it. The spawner acts once the turn
  has ended since that record.
- `waiting`, `notice` — on a `park`: a question the seat put to the human is
  unanswered, and the turn was not started by the human. The spawner records
  `waiting` on the seat and, when it goes from unset to set with `notice`
  given, raises one desktop notice,
  `waiting: <role> <topic> — tanto <role> [<topic>]`. A `park` without
  `waiting` clears it.
- `self` — on a `stop`, `true` when the seat asks to end itself
  (`/tanto taiseki`): honored for a Kikaku, a Hosa, or a Kaiseki whose topic
  is `—`, and `error: "not a seat the human paces"` for any other.
- `pid`, `forMs` — on a `hold`: the launcher's `pid`, the mark lasting while
  that process answers; or, from `boundary.js wake --hold`,
  `forMs: 3300000`, the mark lasting until the seat's transcript has not
  been written for that long. `release` deletes either mark.
```

**P22.17** `skills/tanto/templates/spawn-request.md` — replace exactly these 6 lines

```markdown
- `sessionId` — the seat's identity, for `stop`, `rm`, `resume`, `ack`, and
  `attention`, which fills a bare `<id>` in the message from it.
  Never a short id: the spawner maps one to the other from `seats.json`.
- `message` — `attention`'s one line. A bare `<id>` in it is filled by the
  spawner from `seats.json`, so that Kanri, which holds its own `sessionId`
  and not its short id, can still write the command the human types.
```

**P22.17 →**

```markdown
- `sessionId` — the seat's identity, for `stop`, `rm`, `resume`, `ack`,
  `attention`, `park`, `hold`, and `release`.
  Never a short id: the spawner maps one to the other from `seats.json`.
- `message` — `attention`'s one line, sent as written. A way in that it
  names is `tanto <role> [<topic>]`, which no handover changes, so the
  spawner fills nothing in it.
```

**P22.18** `skills/tanto/templates/spawn-request.md` — replace exactly these 2 lines

```markdown
in `seats.json`, the log line, and the toast
`strayed: <role> <topic> <name> — <cwd>` carry it.
```

**P22.18 →**

```markdown
in `seats.json`, the log line, and the toast
`strayed: <role> <topic> <name> — <cwd>` carry it.

What the ops of the run-owned seats add:

- `spawn` records `contract`, `once`, and the request's id on the seat, and
  writes `seats.json` as soon as it sees the new session, before it looks
  for the transcript. A second holder is `error: "held: <sessionId>"`
  (`succeeds` above).
- `park` adds `parkRequested`, the epoch milliseconds it was recorded at, at
  once; the park itself follows when the turn has ended and the listing
  shows the seat idle and unheld. Its errors: `not a dialogue seat`, for a
  seat that is not a contract-2 Sekkei, Keikaku, Kikaku, Hosa, or Kaiseki;
  `ended`, for a seat `stopped` or `removed`.
- `hold` answers once the mark is set, waiting out a stop that is still
  finishing. Its errors: `unknown seat <sessionId>`, for a `sessionId` the
  state file does not hold; `old-contract seat`, for a seat without
  `contract`; `ended`; `a hold names a pid or forMs`, when the request
  carries neither; `held by another terminal`, when a launcher whose `pid`
  still answers holds it; `claude agents: <error>`, when the listing could
  not be read; `in a tab`, when the listing shows the seat `interactive`;
  `still listed`, when a park that was finishing never let go. `release`
  deletes the mark and does nothing else.
- `resume` runs `claude --resume <sessionId> --bg` only when the listing
  does not show the seat. Its errors: `no prompt for this role`; `removed`,
  for a seat the spawner has removed; `claude agents: <error>`, when the
  listing could not be read; `listed`, with the entry's `name` and `kind`,
  when a tab or a live process holds it; `still listed`, when a stop that
  was finishing never let go; `copy <id> removed`, when the CLI started a
  copy, which the spawner stops and removes; `copy <id> not removed: <cause>`,
  when the copy could not be removed, the CLI's words following; `prompt
  not delivered`, when a Kanri's prompt did not reach it, and the session
  it resumed is stopped first. Otherwise the seat is `running`, and the
  result adds `id` and `name`.
- `stop` runs `claude stop` only for a seat the listing shows in the
  background. A seat a tab holds is recorded `stopped` with
  `note: "in a tab"`, and a seat not listed, a `parked` one included, with
  `note: "already exited"`. A `stop` with `self` waits, for a seat in the
  background, until the turn has ended since `after`, and is dropped ten
  minutes after it was written, with a log line and the notice
  `taiseki not done: <role> — tanto <role>`. A stopped seat records
  `stoppedAtMs`, and a `self` stop `endedBy: "taiseki"`.
```

**P22.19** `skills/tanto/templates/kanri-handover.md` — replace exactly these 5 lines

```markdown
Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor answers the marked lines first and announces nothing. Then
the `queued` Jissos, which exist only under a plan that edits the tanto
skill, by name and place — the successor sends them nothing;
their batch prompt is a path they read at their own wake-up.
```

**P22.19 →**

```markdown
Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor answers the marked lines first and announces nothing. A
peer is its `sessionId`: the name beside it is the one the listing printed
when this file was written, and the successor reads the name again by the
`sessionId` at each send — `boundary.js seat` — waking a parked peer first.
Then the `queued` Jissos, which exist only under a plan that edits the tanto
skill, by `sessionId` and place — the successor sends them nothing;
their batch prompt is a path they read at their own wake-up.
```

**P22.20** `skills/tanto/templates/kanri-handover.md` — replace exactly these 6 lines

```markdown
- <role> — <topic> — <name> [<ref>] — <what that session is waiting for> —
  <"answered", or the last line it sent that this session did not answer,
  which the successor answers first and which the ledger's Session events
  carry as an `unanswered:` line with no `answered:` pair>
- <topic> — <name> [<ref>] — queued, <n>th of the plan's queue, one line per
  queued Jisso, in queue order; the successor sends none of them anything
```

**P22.20 →**

```markdown
- <role> — <topic> — <sessionId> — <name, as last read> — <running, or
  parked> — <what that session is waiting for> —
  <"answered", or the last line it sent that this session did not answer,
  which the successor answers first and which the ledger's Session events
  carry as an `unanswered:` line with no `answered:` pair>
- <topic> — <sessionId> — <name, as last read> — queued, <n>th of the plan's
  queue, one line per queued Jisso, in queue order; the successor sends none
  of them anything
```

**P22.21** `skills/tanto/templates/kanri-handover.md` — replace exactly these 3 lines

```markdown
## Commands for the human

The successor is spawned; nothing is typed.
```

**P22.21 →**

```markdown
## Commands for the human

The successor is spawned; nothing is typed. A human attached to this Kanri
through `tanto` is taken to the successor by the launcher.
```

**P22.22** `skills/tanto/templates/boundary-brief.md` — replace exactly these 4 lines

```markdown
verdict file's Failures section, **not** into the tree (contract rule 5): only
Kanri decides whether it is stray. The `ListAgents` self-check of `SKILL.md`'s
Resuming is not yours either — the listing shows the resident's own name, which
only the resident can compare with its roster row.
```

**P22.22 →**

```markdown
verdict file's Failures section, **not** into the tree (contract rule 5): only
Kanri decides whether it is stray.
```

**P22.23** `skills/tanto/templates/boundary-brief.md` — replace exactly these 4 lines

```markdown
     --kanri "<name [ref]>" --kanri-reading "<Kanri's reading, with its ttl= line>" \
     --jisso "<name [ref]>" --jisso-reading "<Jisso's reading>" \
     --seat <the seat= results path, when the dispatch carried one> \
     --peer-reading "<role> <name [ref]> <reading>" \
```

**P22.23 →**

```markdown
     --kanri "<name>" --kanri-reading "<Kanri's reading, with its ttl= line>" \
     --jisso "<name>" --jisso-reading "<Jisso's reading>" \
     --seat <the seat= results path, when the dispatch carried one> \
     --peer-reading "<role> <name> <reading>" \
```

**P22.24** `skills/tanto/templates/batch-prompt.md` — replace exactly these 2 lines

```markdown
- Conductor ledger, read only — <.tanto/<topic>/kanri.md>
- Kanri — <name> [<ref>]
```

**P22.24 →**

```markdown
- Conductor ledger, read only — <.tanto/<topic>/kanri.md>
- Kanri — <name>
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 22
```

Expected: `task 22: verify clean`.

- [ ] **Step 3: Sweep the old values**

```bash
git grep -n -F -e 'A tab seat is never' -e 'for the first Kanri' -e 'what Kanri sets for every seat it spawns' -e 'fills a bare' -e 'in it is filled by the' -e "a stopped Jisso's or Keikaku's conversation" -e 'it waits for none of them' -e '<name> [<ref>]' -e 'by name and place' -e '<name [ref]>' -e 'self-check' -- skills/tanto/templates/spawn-request.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/boundary-brief.md skills/tanto/templates/batch-prompt.md
```

Expected: no output, exit status 1 — O22.1 to O22.11 at zero.

- [ ] **Step 4: Run lint per Global Constraints** on
  `skills/tanto/templates/spawn-request.md`,
  `skills/tanto/templates/kanri-handover.md`,
  `skills/tanto/templates/boundary-brief.md`, and
  `skills/tanto/templates/batch-prompt.md`.

- [ ] **Step 5: Commit per Global Constraints** — subject
  `docs: the run-time templates name every seat's request, a peer by its sessionId, and no [ref]`;
  paths `skills/tanto/templates/spawn-request.md`,
  `skills/tanto/templates/kanri-handover.md`,
  `skills/tanto/templates/boundary-brief.md`,
  `skills/tanto/templates/batch-prompt.md`.

### Task 23: `README.md`

Spec section 6's `README.md` entry, carrying 1.1 (every seat run-owned), 2.1
and section 8's C-1 to C-5 (the faces), 3.1 (the intake), 4.1 to 4.6 (the
launcher's form and its four words), and section 7's "Other repositories"
paragraph ("Moving a run"). "What it does": the tab-seat bullet and the
Kikaku/Hosa bullet, and the bug-report bullet's intake; "Prerequisites": CLI
2.1.289 and the orders-line clause; "Usage": the launcher's form, the four
words, the attach and its way out, the reboot, `/tanto` in a session, the
reload; two new sections, "The faces of a seat" and "Moving a run"; and,
under "Layout", the `boundary.js` and `spawner.js` bullets. This is the
review of the skill's sibling README after its `SKILL.md` is edited that
`AGENTS.md` asks for, and no other task touches the README.

After this task, the README tells the human to enter every seat by
`tanto <role>`, names the faces and their five constraints, and says how a
run started before this contract is moved.

**Files:**

- Modify: `skills/tanto/README.md` — "What it does" (three bullets),
  "Prerequisites" (two bullets), "Usage" (whole body), two new sections
  after it, and "Layout" (two bullets).

**Interfaces:**

- Consumes: the launcher of Tasks 8 to 11 (`USAGE`, the word table, the
  attach and follow loop, the `fukki` path, `cmdJokyo`, `cmdTeishi`, the old-shape
  line) and the contract text of Tasks 12 to 15.
- Produces: the README's "Moving a run", which the launcher's old-contract
  lines and 1.5's line point to by that name (Tasks 8, 11, 12).

**Named-mechanism sites.** "Moving a run" is named by `scripts/tanto.js`'s
moved-run line and old-shape line (Tasks 8, 11) and by `SKILL.md`'s start
check line (Task 12); the heading is spelled exactly so in all of them. The
launcher's form and the four words are also `scripts/tanto.js`'s `USAGE`
and word table (Task 8) and `SKILL.md`'s "Invocation" (Task 12). C-1 to C-5
are also `SKILL.md`'s "The faces of a seat" (Task 15). The intake rule is
also Task 21's sites. `teishi` and `teishi --seats` are also
`scripts/tanto.js` (Task 11) and `SKILL.md`'s Artifacts scripts paragraph
(Task 15). The `claude attach` that stays — the prerequisites' command list
and C-1's sentence — is what spec's Old values allows here.

**O23.1** `terminal seat` — "What it does" and "Usage" (spec 1.1); before: 4 in `skills/tanto/README.md`, after: 0.

**O23.2** `tab seat` — "The tab seats are the human's own, opened as before" (spec 1.1); before: 1 in `skills/tanto/README.md`, after: 0.

**O23.3** `tanto down` — "Usage" (spec 4.1, 4.6); before: 3 in `skills/tanto/README.md`, after: 0.

**O23.4** `orders line` — "Prerequisites", the spec and plan paths (spec 1.1); before: 1 in `skills/tanto/README.md`, after: 0.

**O23.5** `2.1.280` — "Prerequisites" (spec section 6); before: 1 in `skills/tanto/README.md`, after: 0.

**O23.6** `claude attach <id>` — "Usage"'s printed line and its panes (spec 4.3); before: 2 in `skills/tanto/README.md`, after: 0. The bare `claude attach` goes from 4 to 2: the prerequisites' command list and C-1's sentence, the two sites spec's Old values allows in the README.

**O23.7** `opened by the human` — the Kikaku and Hosa bullet (spec 1.1); before: 1 in `skills/tanto/README.md`, after: 0.

**O23.8** `is a tab the human` — a dialogue seat as a tab the human opens (spec 1.1, 2.1); before: 1 in `skills/tanto/README.md`, after: 0.

**O23.9** `live Hosa, or to Kanri when none is live` — the intake as a `live` Hosa (spec 3.1); before: 1 in `skills/tanto/README.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P23.10 to P23.16.

**P23.10** `skills/tanto/README.md` — replace exactly these 10 lines

```markdown
  implements, **Kaiseki** (解析) root-causes. A seat whose work is dialogue
  with the human — Sekkei, Kaiseki, and the two below — is a tab the human
  opens; every other seat is a background session, an instrument of the
  skill's starts, stops, and resumes on a request file the run writes, so
  that no session ever issues a session-creating command. The human reaches
  a terminal seat with `claude attach` in the editor's own terminal.
- Adds two seats outside that lifecycle, opened by the human and never
  requested by Kanri: **Kikaku** (企画) thinks with the human about what the
  next work is and hands Kanri a decision file, and **Hosa** (補佐) takes the
  small jobs, editing tracked files only in a slot Kanri gives.
```

**P23.10 →**

```markdown
  implements, **Kaiseki** (解析) root-causes. Every seat is a background
  session the run starts, stops, and resumes on a request file it writes,
  so that no session ever issues a session-creating command. A seat whose
  work is dialogue with the human — Sekkei, Keikaku, Kaiseki, and the two
  below — is parked between its turns, its process stopped and its
  conversation kept, and is woken when a line is due. The human enters any
  seat with `tanto <role>` in the editor's own terminal, and a dialogue seat
  also by a click on its row in the editor's session list.
- Adds two seats outside that lifecycle, started by the human with
  `tanto kikaku` and `tanto hosa`, ended by `/tanto taiseki` typed in them,
  and never requested by Kanri: **Kikaku** (企画) thinks with the human about
  what the next work is and hands Kanri a decision file, and **Hosa** (補佐)
  takes the small jobs, editing tracked files only in a slot Kanri gives.
```

**P23.11** `skills/tanto/README.md` — replace exactly these 3 lines

```markdown
- Takes bug reports about the skills this repository ships: a report is a
  file and one line to the run's live Hosa, or to Kanri when none is live,
  which copies it and answers `received:`; every report is decided at the
```

**P23.11 →**

```markdown
- Takes bug reports about the skills this repository ships: a report is a
  file and one line to the run's Hosa while the listing shows one in a
  turn, else to Kanri — in practice Kanri, since a Hosa is parked between
  its turns — which copies it and answers `received:`; every report is
  decided at the
```

**P23.12** `skills/tanto/README.md` — replace exactly this 1 line

```markdown
- **Claude Code CLI 2.1.280 or newer**, for `claude --bg`,
```

**P23.12 →**

```markdown
- **Claude Code CLI 2.1.289 or newer** — the version every rule of the
  run-owned seats was measured on — for `claude --bg`,
```

**P23.13** `skills/tanto/README.md` — replace exactly these 2 lines

```markdown
  itself, and the spec and the plan are wherever Kanri's orders line says,
  by default the superpowers convention.
```

**P23.13 →**

```markdown
  itself, and the spec and the plan are wherever the Sekkei's and the
  Keikaku's prompt keys say, by default the superpowers convention.
```

**P23.14** `skills/tanto/README.md` — replace exactly these 57 lines

````markdown
Put `skills/tanto/scripts/` on `PATH` — the two wrappers there, `tanto.bat`
and `tanto.sh`, are the human's one command — and run it in VS Code's
integrated terminal, at the repository's top level:

```console
tanto
```

It starts the spawner if none is running, finds the run's Kanri or asks the
spawner for one, resumes any terminal seat a reboot took, and prints the
one line to type next:

```console
claude attach <id>
```

Every way out of a seat — `←` or `/exit` to the agent view, `Ctrl+Z` to the
shell, closing the terminal — leaves it running; `/stop` alone stops it,
and a Kanri you `/stop` comes back with `tanto`. `claude agents` lists every
seat by name, `<repo>-<role>[-<topic>]-<hex>`, and terminal panes, one
`claude attach <id>` each, show several at once; no multiplexer is needed,
since a seat outlives its terminal. `tanto` is also the way back after a
restart, and it is idempotent: run twice, it starts nothing twice. Without
`PATH`, `node <skill>/scripts/tanto.js` does the same. A seat `seats.json`
holds as `running` or `blocked` — or, for Kanri alone, `gone` — is resumed;
one it holds as `stopped` or `removed` is not. `tanto down` stops the
spawner and keeps every conversation; `tanto down --seats` stops the seats
too, which retires the run — the conversations are kept, but a seat the run
stopped is not resumed. The spawner writes a heartbeat as it works: `tanto`
starts a spawner when none has beaten within a minute, and `tanto down`
signals only one that has.

The tab seats are the human's own, opened as before — or
`担当して <role>` / `tantoして <role>`, the role word in hiragana, kanji, or
romaji (`かんり` / `管理` / `kanri`):

```console
/tanto sekkei
/tanto kaiseki topic=<topic>
/tanto kikaku
/tanto hosa
```

Each finds Kanri in the roster's first data row, read at the moment it
sends, and there is no address argument. `/tanto kaiseki` with no key is
standalone Kaiseki — the strong model leads one debugging session, with no
batch loop. The terminal seats — Keikaku, every Jisso, the shusei batch, the
scribe that writes the records, and Kanri's own successors — are never
typed: the run starts them with the keys they need.

A tab that comes back after an editor restart keeps its context and its
transcript and gets a new name, which Kanri matches to its roster row by its
session id; nothing is typed there. A terminal seat is
unaffected by the restart, and after a reboot `tanto` resumes it under the
same session id. The desktop notice tells the human when a seat is waiting
on them; an optional harness hook makes it immediate, and nothing requires
it.
````

**P23.14 →**

````markdown
Put `skills/tanto/scripts/` on `PATH` — the two wrappers there, `tanto.bat`
and `tanto.sh`, are the human's one command — and run it in VS Code's
integrated terminal, at the repository's top level:

```console
tanto [<role>] [<topic>] [--attach | --no-attach] [--root <path>] [--timeout <ms>]
tanto fukki [--no-attach] [--root <path>] [--timeout <ms>]
tanto teishi [--seats] [--root <path>] [--timeout <ms>]
tanto jokyo [--root <path>]
```

A bare `tanto` is `tanto kanri`: it starts the spawner if none is beating,
finds the run's Kanri or asks the spawner for one, resumes what a reboot
took, and attaches this terminal to Kanri. `tanto <role>` enters that
role's seat the same way, the role word in romaji, kana, or kanji
(`kikaku` / `きかく` / `企画`): a `kikaku`, a `hosa`, and a `kaiseki` with no
topic are started when the run holds none; a `sekkei`, `keikaku`, or
`jisso` is Kanri's to start, and the launcher says so when none is held. A
`<topic>` picks the seat when two of a role are held. `-n` (`--no-attach`)
starts or ensures the seat, prints its name and the ways in, and exits.
When Kanri hands over while you are attached to it, the launcher follows to
the successor, and nothing is typed. Run twice, `tanto` starts nothing
twice; without `PATH`, `node <skill>/scripts/tanto.js` does the same, and a
root other than the current directory is given with `--root`.

Four more words, each also in kana, kanji, and English:

| Word | Also | Typed | Does |
| --- | --- | --- | --- |
| `fukki` | ふっき, 復帰, `resume` | at the terminal, or as `/tanto fukki` in Kanri | puts the run back after a reboot, a spawner's death, or a quota's return, and tells Kanri, which recovers what was cut |
| `teishi` | ていし, 停止, `stop` | at the terminal | stops the spawner and keeps every conversation; `--seats` stops every seat too, which retires the run |
| `jokyo` | じょうきょう, 状況, `status` | at the terminal | prints one line per seat — what it is doing, whether it waits on you, its `context=`, and the command that enters it — and changes nothing |
| `taiseki` | たいせき, 退席, `leave` | as `/tanto taiseki` in a Kikaku, a Hosa, or a standalone Kaiseki | ends that seat; the next `tanto <role>` starts a new conversation |

Leave an attach with `←` and then leave the agent view: the seat keeps
running, a dialogue seat parks at its turn's end, and the launcher prints
the `jokyo` listing. `/stop` stops a seat's process, and a Kanri you `/stop`
comes back with `tanto`. `claude agents` lists every seat by name,
`<repo>-<role>[-<topic>]-<hex>`, and terminal panes, one `tanto <role>`
each, show several at once; no multiplexer is needed, since a seat outlives
its terminal.

After a reboot, `tanto` resumes a Kanri, a Jisso, or a shoki that
`seats.json` holds as `running` or `blocked` — or, for Kanri alone, `gone`;
one it holds as `stopped` or `removed` is not resumed. A dialogue seat is
not resumed: it is parked, and is woken when a line is due — one whose turn
the reboot cut is continued by Kanri's Recovery, which `tanto fukki`
starts. The spawner writes a heartbeat as it works: `tanto` starts a
spawner when none has beaten within a minute, and `tanto teishi` signals
only one that has.

Inside a session, `/tanto <role>` — or `担当して <role>` / `tantoして <role>`,
the role word in hiragana, kanji, or romaji (`かんり` / `管理` / `kanri`) —
is what a seat's own prompt runs. A session the run did not start that
types it is told to use `tanto <role>`, and stops. Every seat finds Kanri in
the roster's first data row, read at the moment it sends, and there is no
address argument. `tanto kaiseki` with no topic is standalone Kaiseki — the
strong model leads one debugging session, with no batch loop.

An editor reload asks nothing: a tab that held a seat comes back under a
new name, nothing keys on it, and a seat whose tab is not reopened is
parked. A Kanri, a Jisso, or a shoki is unaffected by the reload. The
desktop notice tells the human when a seat waits on them — a dialogue
seat's question at the end of a turn the run started, a permission prompt,
a kessai — and an optional harness hook makes it immediate; nothing
requires it.

## The faces of a seat

A face is a place you talk to a seat from: the terminal attach that
`tanto <role>` gives, a VS Code tab, and Remote Control through Kanri. A seat
is in one place at a time — the launcher refuses a seat a tab holds, and
says which tab to close. A dialogue seat is parked between its turns, which
is what lets a click on its row open it in a tab with a normal prompt box.
Five constraints come with that:

- **C-1** — enter a dialogue seat from a terminal by `tanto <role>`, never
  by a bare `claude attach` and never from the agent view that `←` opens:
  neither tells the spawner you are there, and the seat's park at its turn's
  end closes that screen under you. Kanri is entered by `tanto`, and is not
  opened in a tab.
- **C-2** — a parked seat is offline to Remote Control until something wakes
  it. From there, ask Kanri: it wakes the seat and holds it awake until 55
  minutes after its last turn, or until you say you are done.
- **C-3** — a seat started after the editor's list was loaded is in the list
  after `Developer: Reload Window`; a click on its row opens it. For about
  half a minute after a turn ends the row may still show the "open somewhere
  else" notice.
- **C-4** — a tab's turn runs at the editor's effort and on the extension's
  bundled binary; a version gap that keeps a tab from opening leaves the
  terminal.
- **C-5** — a window reload cuts the turn of a seat open in a tab, with its
  background work; a word in the tab continues it.

## Moving a run

A run started before seats were run-owned has a Kanri that read the older
text, and seats the human opened in tabs. The text on disk reaches every
repository the moment it lands, so such a run opens no new dialogue seat: a
`/tanto <role>` typed in a window there stops with one line, and its Kanri
cannot spawn one. Its open seats go on, its Jissos and its close are
untouched, and `tanto` still enters its Kanri. A Kikaku and a standalone
Kaiseki, which that Kanri never addresses, can be started there by
`tanto kikaku` and `tanto kaiseki` once its spawner is a current one —
`tanto teishi`, then `tanto`, which touch no seat. Everything else waits for
the move, made once, at a batch boundary or a plan's close:
`tanto teishi --seats`, then `tanto`, and close the windows of that run's
old seats. The new Kanri takes the run from its roster and ledger as a
Kanri does after any loss. Until then, `tanto` prints one line naming the
roster's old-contract rows, and goes on; the line asks for nothing, and a `cleared` row,
which Kanri leaves for the archive, keeps it printing until the plan's close.
````

**P23.15** `skills/tanto/README.md` — replace exactly these 4 lines

```markdown
  writes the conductor ledger's and the roster's rows idempotently; and
  `census`, which Kanri runs itself, read-only, to place the roster's rows
  against the sessions `claude agents --json` lists under the repository.
  `scripts/boundary.test.js` beside it.
```

**P23.15 →**

```markdown
  writes the conductor ledger's and the roster's rows idempotently;
  `census`, which Kanri runs itself, read-only, to place the roster's rows
  against the spawner's `seats.json` and the sessions `claude agents --json`
  lists under the repository; `request`, the park or leave request a seat
  writes for itself; and `seat`, `wake`, and `beat`, which Kanri runs before
  it sends a seat a line or writes a request. `scripts/boundary.test.js`
  beside it.
```

**P23.16** `skills/tanto/README.md` — replace exactly these 3 lines

```markdown
  the launcher and never by a session, taking request files, writing result
  files, keeping `seats.json`, running a census of `claude agents --json`,
  and raising the desktop notice. `spawner.js notify --stdin` is the
```

**P23.16 →**

```markdown
  the launcher and never by a session, taking request files, writing result
  files, keeping `seats.json`, parking a dialogue seat at its own request,
  running a census of `claude agents --json`, and raising the desktop
  notice. `spawner.js notify --stdin` is the
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-05-run-owned-seats.md --task 23
```

Expected: `task 23: verify clean`.

- [ ] **Step 3: Sweep the old values**

```bash
git grep -n -F -e 'terminal seat' -e 'tab seat' -e 'tanto down' -e 'orders line' -e '2.1.280' -e 'claude attach <id>' -e 'opened by the human' -e 'is a tab the human' -e 'live Hosa, or to Kanri when none is live' -- skills/tanto/README.md
```

Expected: no output, exit status 1 — O23.1 to O23.9 at zero.

```bash
git grep -c -F -e 'claude attach' -- skills/tanto/README.md
```

Expected: `skills/tanto/README.md:2` — the prerequisites' command list and C-1.

- [ ] **Step 4: Run lint per Global Constraints** on `skills/tanto/README.md`.

- [ ] **Step 5: Commit per Global Constraints** — subject
  `docs: the README enters every seat by tanto <role>, names the faces of a seat, and says how a run moves`;
  path `skills/tanto/README.md`.

## Self-Review

**Spec coverage.** Spec section 6 is carried file by file: `spawner.js`, `templates/tanto.json`, and `reading.test.js` by Tasks 1-4; `boundary.js` and the five read-once templates by Tasks 5-7; `tanto.js` by Tasks 8-11; `SKILL.md` by Tasks 12-15; `roles/kanri.md` by Tasks 16-19; the other six role files by Tasks 20-21; the four run-time templates by Task 22; the README by Task 23. Sections 2.1 to 2.8, 3, 4, and 5 are the design those tasks quote; section 7's Global Constraints are word for word in substance under "What the run does at its own boundaries", the five steps after batch D among them. No task is the acceptance scene. No task measures anything. The Old values list is the plan's O blocks, 265 of them; fence 4 of How a batch is verified sweeps their 227 distinct needle-and-file rows at zero, and fence 5 sweeps the spec's first nine needles over `skills/tanto/`.

**Sizes.** The largest task is Task 8 at 1046 lines and eight steps; twelve tasks pass 600 lines — Tasks 1, 2, 3, 4, 5, 6, 8, 9, 14, 16, 19, and 20 — because a code task's blocks hold the old text and the new, and a document task's hold both too. Every script task is eight steps (tests red, code green, the whole suite, lint, verify, commit); every document task is four to seven. The cuts the drafters named, if a reviewer wants smaller tasks, are Task 5 into the census's state file and its two new headings, Task 6 into `request`/`beat` and `seat`/`wake`, Task 8 into the word table and role resolution, Task 9 into the attach and the follow loop, Task 16 at its "Sending to a seat" blocks, Task 19 at its Release and Recovery blocks, and Task 20 at `roles/kikaku.md`. None is renumbered: batch D carries twelve tasks because the spec fixes it as one batch and its safe boundary. No threshold is set (issue-7281). No task is a **sweep-and-check** shape: every task's deliverable is a file, and the sweeps are fences of How a batch is verified.

**Interfaces between the tasks**, fixed here because six drafters wrote them at once from the spec:

- `turnEnded(transcript, after)` returns `null`, or `{ ended, newTurn, midTurn }`; Task 6's `seat` reads `.ended`; the park, the `self` stop, and the `once` seat read `.ended`, the park `.newTurn`, and the census `.midTurn`.
- `requestId` is the request file's basename without `.json`, which Task 5's census prints as `result <id>`.
- The request bodies are `park` `{ sessionId, waiting, notice, after }`, `stop` `{ sessionId, self: true, after }`, `hold` `{ sessionId, pid }` or `{ sessionId, forMs }`, and `release` `{ sessionId }`, with `role` and `topic` where the launcher writes them. `OPS` is `spawn`, `stop`, `rm`, `resume`, `attention`, `ack`, `park`, `hold`, `release`, in the order `templates/spawn-request.md` documents them.
- Task 1 changes `tanto.test.js`'s "down --seats reports a failed stop" in two blocks (P1.6 and P1.15) that leave its launch line and its title alone, so that Task 8's blocks on the same test (P8.13 and P8.14) start from text that exists at both boundaries.
- A shared fake `claude` prints the `--resume` idle note only when no prompt was given (Task 2, spec 2.5), since a Kanri resume now carries `/tanto fukki`.

**Sites the spec's section 6 does not name, taken so that no file contradicts another** — each flagged again in its task: the README's "Layout" bullets for `boundary.js` and `spawner.js` and its bug-report bullet (Task 23); `kanri-handover.md`'s "Commands for the human" (Task 22); `spawn-request.md`'s list of the new ops' results and errors (Task 22); `SKILL.md`'s language bullet, the handshake fields `mode=` and `transcript=`, two "live Hosa" Artifacts rows, and the census sentence (Tasks 12-15); the prompt table's `denrei` row (Task 12); `roles/kanri.md`'s opening, "Bug intake", "The hotfix lane", the census's `blocked` and `renamed` bullets, loop step 2's peer-reading form, and the residency and handover lines (Tasks 16-19); `roster.md`'s placeholder rows, Topic/Effort paragraph, Residency sentence, and Events placeholder (Task 7); `boundary.test.js`'s roster test, which follows the placeholder change (Task 7); and `tanto.test.js`'s "down --seats reports a failed stop" (Task 1). All are in files section 6 names, so each stays in the batch rule 11 assigns its file.

**Where the spec left a choice, and what the plan chose** — each stated in its task, listed for the cold read:

- `roles/kanri.md`'s "On a handshake" is deleted but for its three kept paragraphs, which sit under a new `## Sending to a seat`, and "Recovery after a VS Code restart" becomes `### Recovery`, as section 6 says; `SKILL.md`'s "Handshake and roster" becomes "The roster" likewise, and its "### 2. Handshake" heading keeps its text over a body that says no seat sends one. No other file names these headings.
- `/tanto fukki` typed in a seat that is not Kanri is answered by 4.1's one line naming the terminal command, not 1.5's seat-check refusal; spec 1.5's last sentence, which read "answered the same way", was edited to say so (the cold read's question 4).
- A Jisso's closing line at its boundary is unchanged: it cannot know which boundary is its last, and section 6 says `roles/jisso.md` has no behavior change; the ended-seat closing line is Sekkei's, Keikaku's, Kikaku's, Hosa's, and Kaiseki's.
- `roles/keikaku.md`'s `--waiting` is written for the plan dialogue only; the review gate asks the human nothing, since Keikaku answers the plan brief by default.
- `boundary.js census` prints under Not held only seats the state file holds as `running`, `blocked`, or `parked`, so a repository's old `gone` Jissos do not print forever; `seat` reads kind and name from a fresh listing and falls back to the state file's.
- The seat schema gains `leaveRequest` (a `self` stop waiting for its turn to end) and `endedAtMs` inside `parkRequest`, which 2.3's "ten minutes after the turn ended" needs; a hold with neither `pid` nor `forMs` is `error: "a hold names a pid or forMs"`, and a hold or release for a seat the state file does not hold is `unknown seat <sessionId>`.
- The launcher's own Kanri `spawn` carries `succeeds: <the Kanri the state file holds>`, so 1.2's refusal does not fire on it. The successor's `spawn` at step 4 of the Global Constraints would still be refused in this repository, whose `seats.json` holds eight `gone` Kanri seats, so step 3 retires them first with `stop` requests, each recorded `stopped` with no command (the cold read's question 1; the alternative, a narrower refusal in Task 2, was not taken, since it would change spec 1.2's rule for every run).
- The `state: "blocked"` fixture in `tanto.test.js` ("a pid-less listing entry is not read as a live seat") stays: it is the measured real shape of a pid-less entry, and no launcher code reads `state` as a blocked signal (the cold read's question 5).
- The whole suite and `boundary --plan` run in the background and are read from their output files; the Global Constraints say so (the cold read's question 3).
- `the park rule`'s one text is written once, in `roles/sekkei.md`'s new section "The end of every turn — the park", and the other four dialogue seats reuse it in substance.
- The generic Old-values needles that cannot be written in the passage grammar — a needle cannot hold a backtick or open with `<` — are narrowed to a phrase that spans the change (`name> [<ref>]`, `name [ref]>`, and phrase needles for the status words `cleared` and `refused`), and the status words themselves are swept by fence 5 over `skills/tanto/`.

**Needle counts are measured, not copied.** Every O block's `before:` count is a `git grep -F -c` at `a89dd16` by its drafter; the spec's own counts ("12 sites", "nine needles") were not used for any number a command consumes. The plan's own replay applied every passage in order over the merge base (265 needles swept, 6 with hits, each in a file the needle was not meant for), and fence 4 is generated from exactly that result.

**What is not checked here.** The new spawner has not run against the real `claude` CLI: the scripts' tests use the `TANTO_CLAUDE` seam, and the first real run is the restart at step 2 of the Global Constraints' five steps. `./scripts/lint.sh` and the `node --test` fences are skipped by `replay` and run for the first time at batch A's boundary; the dry run applied the passages to a copy of the tree and ran the whole suite there at the end of Task 11 (`.tanto/run-owned-seats/plan-dryrun.md`).
