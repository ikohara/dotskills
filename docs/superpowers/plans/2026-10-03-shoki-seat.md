# shoki-seat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `--bg` spawn's prompt sits before every `--add-dir`, and the CLI's idle note on a spawn is a failed delivery; Kanri cuts shoki's worktree and the spawner runs the seat with it as its cwd, never `-w`; every reader of the listing keys a session on its listed `cwd` under the root; a seat with no first turn two minutes after its spawn is a notice; the launcher trusts a heartbeat, not a PID; `rm` and `stop` on a session that has exited are not errors; the roster's `live` cell may say `(blocked since <HH:MM>)`.

**Architecture:** Batch A changes the three scripts and their tests: `spawner.js` in three tasks (the command line and the two landing points of spec section 5; the worktree cwd and the listing's key; the no-first-turn notice and the heartbeat), then `tanto.js` (the heartbeat's reader and the listing's key), then `boundary.js census` (the two suffixes). Batch B writes the documents of spec section 6 — `SKILL.md`, the three templates, `roles/kanri.md`, and the README — and is the plan's last batch and its safe boundary.

**Tech Stack:** Node 22 or later with no dependencies (`node --test`), Markdown, and the tanto skill's `passage-check.js` for every block below.

**Spec:** `docs/superpowers/specs/2026-10-03-shoki-seat-design.md` — every task names the spec sections it carries out. The dialogue is `.tanto/shoki-seat/dialogue.md` (D-1 to D-7); the review the spec already applies is `.tanto/shoki-seat/spec-review.md`.

**Every old block was read at `b8bca1b`.** The branch's only commits since are the spec's three, so every file under `skills/tanto/` is that commit's. No site the spec's section 6 names moved. Every block below is a replacement — no insertion, no new file — so no task carries an anchor, and a block that keeps unchanged lines around its change keeps them so that its new text is unique in its file, which `verify` counts. No two tasks touch the same lines: where two tasks edit one function (`opSpawn` is edited by Tasks 1, 2, and 3), each task's blocks cover lines the others leave alone, so every task's `verify` holds at both boundaries.

**`node --test` takes the test files, not the directory.** The spec writes `node --test skills/tanto/scripts/`; on Node 24.16, the version installed here, a directory argument is read as one test file and fails at once (measured while drafting: one test, `fail 1`, 117 ms). Every command below names `skills/tanto/scripts/*.test.js`, which ran 215 tests green at `b8bca1b` in five minutes.

**Sites the spec's section 6 does not name, taken so that no file contradicts another** — each flagged again in its task:

- `scripts/spawner.test.js`, "the census revives a gone seat the listing holds again, and never a stopped one" — under spec 3.1 a gone seat with no transcript raises the no-first-turn toast, which this test's count of one toast would see; the test gives its seat a transcript, so that its seat is the ordinary `gone` it means (Task 3).
- `scripts/spawner.test.js`, the `run` helper — the spawner now looks for transcripts at every census pass, so the helper points `CLAUDE_CONFIG_DIR` at a directory of the workspace's own and fixes `TANTO_NOW_MS` at the fake's `startedAt`, so that no test reads the user's own `projects/` and no seat reaches the two-minute budget unless its test says so (Task 3).
- `scripts/spawner.js`, the `takeRequests` log line — spec 5.1's `rm <name> ok (already exited)` is that line with the note (Task 1).
- `SKILL.md`, Artifacts, the `.tanto/spawner/` row — it lists the spawner's files, and gains `heartbeat` (Task 6).
- `roles/kanri.md`, "Session lifecycle" — spec 3.3 and 5.2 are two bullets of the census's "What it prints decides" list rather than one sentence, since each is a line the census prints and an act it asks for (Task 8).

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
  linter or formatter configuration. `skills/tanto/SKILL.md`,
  `skills/tanto/roles/kanri.md`, and `skills/tanto/README.md` are agent
  instruction files under the same "Never do" rule; the approval for the
  passages this plan writes into them is the spec, accepted section by
  section in `.tanto/shoki-seat/dialogue.md` (D-3 to D-7, "OK" and "よい"),
  and it covers exactly this plan's passages — no task extends an edit
  beyond its own blocks on the strength of it.
- Every commit lands on the branch `shoki-seat`. The merge into `main` is
  the human's, taken at the close; no task merges, rebases, or switches
  the branch.
- American English in every passage, comment, and commit message.

**Model families** (the built-in `skills/tanto/templates/tanto.json`; this
repository's `.claude/tanto.json` overrides Kikaku and Sekkei alone, and the
personal file sets `language` alone, read 2026-10-03 — a batch prompt names
the family it dispatches with, read fresh at its boundary): every task runs
under a Jisso on `sonnet`, effort `xhigh` (`sessions.jisso`); its
`task.implement` subagent on `sonnet`, effort `high`; an SDD fix round's
escalation, rounds 4 and 5, on `opus`, effort `high` (`task.escalate`); the
spec and quality reviewers on `opus`, effort `medium`
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
Edit tool modifies keeps the line endings it had —
`templates/spawn-request.md` is CRLF in the working tree and LF in the
index, and stays so — and `passage-check.js` normalizes CRLF before every
comparison. A task that ever creates a Markdown file writes
`rm <path> && git checkout -- <path>` after its commit into its own steps,
since a written file lands `w/lf` here.

**Rule 11 — this plan edits the skill's own files.** While this plan is in
flight, the authority for its sessions is these Global Constraints, Kanri's
orders line, and the batch prompts — not `skills/tanto/`'s role text as it
stands on disk at any moment before the plan lands. Every Jisso of this
plan is spawned at the plan's landing with `queue=shoki-seat`, reading
nothing until its own `batch:` line reaches it, so that every one of them
read the skill as it stood before batch A.

**Batch B is the safe boundary** — the first point from which a role may be
started or replaced, and the plan's last batch. When the whole-branch
review's findings touch `SKILL.md`, a role file, or a template, the safe
boundary is the fix wave's landing instead. Until then no role is replaced
and no further role is created, except Kanri's own handover and a Kaiseki,
each a Kanri ruling `R-n`.

**Two facts of this plan's own run (spec section 7):**

- **The resident spawner keeps the code it started with.** This plan's own
  close is the first that needs the new code: on the old spawner its shoki
  blocks again at its start, and the old spawner would pass
  `-w shoki-shoki-seat` over the directory Kanri cut. So, after the final
  batch — the fix wave included — is accepted and **before the kessai**,
  Kanri's line asks the human for three acts in a terminal: `tanto down`,
  which on the pre-heartbeat spawner signals nothing and prints its PID
  with the `has no heartbeat` line; ending that PID by hand
  (`taskkill /PID <n>`, or `kill <n>`) — and, because a `tanto` run any
  time after Task 4 landed starts a second spawner beside the old one, ending
  every other `node` process whose command line holds `spawner.js` and `run`
  (`tasklist /FI "IMAGENAME eq node.exe" /V`, or `pgrep -f spawner.js`),
  which is also why `tanto down` may then print `spawner stopped` and no PID;
  then `tanto`. Kanri says in its line that the human runs no `tanto` before
  those acts, and the human tells Kanri if one was run. The seats keep
  running, Kanri included; `tanto` finds the live Kanri and prints its
  attach line. Before it writes the shoki `spawn` request, Kanri checks
  that `.tanto/spawner/heartbeat` exists and is within sixty seconds of
  now; a heartbeat absent or stale holds the merge act and is one line to
  the human, asking for the three acts again.
- **At this plan's landing Kanri records four measurements** in the
  ledger's Measurements table, for the dogfood report the close's shoroku
  writes: whether shoki ran its first turn with no act of the human's;
  whether its transcript appeared under
  `<repo slug>--claude-worktrees-shoki-shoki-seat`; whether its Triage
  fills and its `shoroku-review.md` write were unrefused (the landing check
  "every swept inbox copy's Triage filled" passing is the evidence); and
  whether `git worktree remove --force --force` returned without
  `Permission denied` (a881, which stays open when it did not). The
  restart's heartbeat check is a fifth, implicit: the spawn request is
  written only after it held.
- **This plan's close runs on the landed text.** Kanri re-reads
  `roles/kanri.md`'s "Shusei, shoki, and the landing" from disk before the
  merge act; the Kanri in seat read it as it stood before batch A.

**Files no task touches.** `templates/boundary-brief.md`,
`templates/batch-prompt.md`, and `templates/kanri-handover.md` — the three
run-time templates — `scripts/reading.js`, `scripts/passage-check.js`, and
the six role files other than `roles/kanri.md`. Batch B's boundary checks
that none of them changed.

**Named-mechanism rule.** A task that introduces or changes a named
mechanism — here the `prompt not delivered` error and the `undelivered`
field, the `worktree` request field's meaning, the listing's `underRoot`
key, the `no first turn` mark, toast, and census line,
`FIRST_TURN_WAIT_MS`, the `heartbeat` file and `HEARTBEAT_STALE_MS`,
`already exited`, and the `blocked since` annotation — lists in its own
text every other site, in the same file and in the files this plan
touches, that names the same mechanism, so its reviewer checks them
together. Each task's "Named-mechanism sites" note is this rule applied.

**The SDD ledger** is `.superpowers/sdd/2026-10-03-shoki-seat/progress.md`.

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
| A | 1-5 | the spawner's command line, its prompt check, its `stop`/`rm` landing points, the worktree cwd, the listing's `underRoot` key, the no-first-turn notice, and the heartbeat (Tasks 1-3); the launcher's `liveSpawner`, `startSpawner`, `cmdDown`, and listing key, with the listing fixtures (Task 4); `boundary.js census`'s two suffixes (Task 5) | `node --version` is 22 or later; the whole suite `skills/tanto/scripts/*.test.js` green; `passage-check.js verify` clean for Tasks 1-5; `./scripts/lint.sh` clean on the six script files; every O-needle of Tasks 1-5 at 0 over `skills/tanto/scripts/`; `passage-check.js diff` clean outside `docs/superpowers/` — every one a fence of How a batch is verified |
| B — the safe boundary, the plan's last batch | 6-9 | spec section 6's documents: `SKILL.md` (Task 6); `templates/spawn-request.md`, `templates/shoki-brief.md`, `templates/roster.md` (Task 7); `roles/kanri.md` (Task 8); `README.md` (Task 9) | everything batch A's row names, again; `passage-check.js verify` clean for Tasks 6-9; `./scripts/lint.sh` clean on the six documents; **every O-needle of the whole plan at 0 over every file the plan touches**; the whole-skill sweep of `-w`, `the CLI's own`, and `--json --cwd` over `skills/tanto/` showing no hit outside its stated dispositions; none of the files no task touches changed since `b8bca1b` |

A stop condition worded as a property of the whole tree — "the suite is
green", "every O-needle … is 0", "no hit over `skills/tanto/`" — is backed
by a fence that sweeps the whole of that scope, not only the files the
batch wrote. The table's two rows plus one for the whole-branch review's
fix wave size Kanri's Jisso queue: **three** seats, spawned at the plan's
landing with `queue=shoki-seat`.

## How a batch is verified

This plan ships Node scripts with their tests and Markdown (the contract,
one role file, three templates, the README), and carries passages. Every
boundary runs the fenced checks below, in order, from the repository's top
level; `boundary --plan` judges each by its exit status alone, and a batch
is accepted only when every one exits 0. Each fence reads the state the
batch left — whether batch B has landed is read from whether the branch has changed `skills/tanto/README.md`, which only Task 9 does —
so every one is meaningful at both boundaries. The per-task checks are the
tasks' own: `passage-check.js verify --task <N>` for every task the batch's
row names, run by the boundary as it runs every task's Verify step.

This plan writes no frontmatter and no JSON file, so no boundary loads one.
`git` opens six fences — every fence but the first: `replay` skips a fence
whose first word is `git`, and each of the six needs the checkout the scratch
tree is not. The dry run therefore exercised the first fence alone, and
`boundary --plan` is the first run of the other six.

**1. The runtime.** Node 22 or later; the version is printed.

```bash
node -e 'const major = Number(process.versions.node.split(".")[0]); console.log(`node ${process.version}`); process.exit(major >= 22 ? 0 : 1)'
```

Expected: `node v24.16.0` on this host, exit 0.

**2. The whole suite.** Every test file of `skills/tanto/scripts/`, TAP
output, its `# pass` and `# fail` lines printed; any failure, or a run that
ends without a `# fail 0` line, exits 1. About six minutes on this host.

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

Expected: `# fail 0`, and `# pass` equal to `# tests` — 231 after batch A
and after batch B (215 at `b8bca1b`, plus the sixteen tests Tasks 1-5 add).

**3. Lint, by name.** The batch's own changed paths, every file named.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
paths=(skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js)
if ! git diff --quiet "$(git merge-base main HEAD)" -- skills/tanto/README.md; then
  paths+=(skills/tanto/SKILL.md skills/tanto/templates/spawn-request.md skills/tanto/templates/shoki-brief.md skills/tanto/templates/roster.md skills/tanto/roles/kanri.md skills/tanto/README.md)
fi
./scripts/lint.sh "${paths[@]}"
```

Expected: every hook `Passed` or `Skipped`, no file changed.

**4. The old values.** Every O-needle of the plan, each over the scope its
block names: batch A's at every boundary, batch B's once batch B has
landed. A needle with a hit prints it and fails the check.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
if ! git diff --quiet "$(git merge-base main HEAD)" -- skills/tanto/README.md; then landed=B; else landed=A; fi
echo "old values after batch $landed"
residual=0
while IFS='|' read -r batch needle scope; do
  [ -n "$needle" ] || continue
  [ "$batch" = A ] || [ "$landed" = B ] || continue
  hits="$(git grep -F -c -e "$needle" -- $scope | awk -F: '{ s += $NF } END { print s + 0 }')"
  if [ "$hits" -ne 0 ]; then
    echo "residual $hits: $needle"
    git grep -F -n -e "$needle" -- $scope
    residual=1
  fi
done <<'NEEDLES'
A|args.push("-w"|skills/tanto/scripts
A|"-w",|skills/tanto/scripts
A|args.push(request.prompt);|skills/tanto/scripts
A|branch is the CLI's own|skills/tanto/scripts
A|after it on a resume.|skills/tanto/scripts
A|claude stop: ${got.err.trim()}|skills/tanto/scripts
A|claude rm: ${got.err.trim()}|skills/tanto/scripts
A|: seat?.worktree|skills/tanto/scripts
A|: "ok"}|skills/tanto/scripts
A|rm reports the worktree it removed"|skills/tanto/scripts
A|--json --cwd <root>|skills/tanto/scripts
A|"--cwd", root|skills/tanto/scripts
A|listed no new session within 30 s|skills/tanto/scripts
A|function runClaude(args) {|skills/tanto/scripts
A|request named a worktree alone|skills/tanto/scripts
A|cwd: null|skills/tanto/scripts
A|transcriptOf(session.sessionId)|skills/tanto/scripts
A|sleepSync(SPAWN_POLL_MS)|skills/tanto/scripts
A|sleepSync(TRANSCRIPT_POLL_MS)|skills/tanto/scripts
A|up to ~40 s per spawn|skills/tanto/scripts
A|'s every caller.|skills/tanto/scripts
A|seatName, shortIdOf };|skills/tanto/scripts
A|...opts,|skills/tanto/scripts
A|return { sessions, error: null };|skills/tanto/scripts
A|livePid|skills/tanto/scripts
A|(${session.kind})${renamed}|skills/tanto/scripts
B|the CLI, on |skills/tanto
B|works in the CLI's own worktree|skills/tanto
B|which may carry the suffix|skills/tanto
B|starts the spawner, finds or asks for a Kanri, resumes|skills/tanto
B|stops it all and|skills/tanto
B|, names each seat|skills/tanto
B|strayed one, and on an|skills/tanto
B|never written by a role|skills/tanto
B|spawner passes it as|skills/tanto
B|and the worktree it removed|skills/tanto
B|the command's stderr, and|skills/tanto
B|the CLI's own, at|skills/tanto
B|whatever HEAD the CLI cut it from|skills/tanto
B|address rule reads, so a reader|skills/tanto
B|Whatever HEAD the CLI cuts|skills/tanto
B|leaves locked|skills/tanto
B|keeps, move shoki's|skills/tanto
B|for shoki, in the same act|skills/tanto
B|which works in the CLI's|skills/tanto
NEEDLES
[ "$residual" -eq 0 ] || exit 1
echo "every old value at 0"
```

Expected: `old values after batch A` (or `B`), then
`every old value at 0`.

**5. The whole-skill sweep.** `-w`, `the CLI's own`, and `--cwd` over the
scripts after batch A and over the whole of `skills/tanto/` after batch B,
since a passage the spec did not name may hold another. A hit is allowed
only when it says that no `-w` or `--cwd` is passed — a line with `no`,
`No`, `never`, or `Never` before it, a test's own `includes("-w")` or
`includes("--cwd")` asserting its absence, or `boundary.js`'s comment
"rather than pass `--cwd`"; any other hit prints and fails the check.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
scope=skills/tanto/scripts
if ! git diff --quiet "$(git merge-base main HEAD)" -- skills/tanto/README.md; then scope=skills/tanto; fi
echo "sweep over $scope"
stale="$(git grep -n -E -e '(^|[^A-Za-z0-9-])-w([^A-Za-z0-9-]|$)' -e "CLI's own" -e '--cwd' -- "$scope" | grep -v -E '(No|no|never|Never)[^.]*(-w|--cwd)|includes\("(-w|--cwd)"\)|rather than pass `--cwd`')"
if [ -n "$stale" ]; then
  printf '%s\n' "$stale"
  exit 1
fi
echo "no stale -w, the CLI's own, or --cwd"
```

Expected: `sweep over skills/tanto/scripts` (or `skills/tanto`), then
`no stale -w, the CLI's own, or --cwd`.

**6. Files no task touches.** None of them changed since the branch left
`main`.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
git diff --quiet "$(git merge-base main HEAD)" -- skills/tanto/templates/boundary-brief.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/kanri-handover.md skills/tanto/scripts/reading.js skills/tanto/scripts/passage-check.js skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md skills/tanto/roles/hosa.md || { echo "a file no task touches changed"; exit 1; }
echo "untouched: the three run-time templates, reading.js, passage-check.js, the six other role files"
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
out="$(node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --base "$(git merge-base main HEAD)")"
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

### Task 1: The spawner's command line, a prompt that was not delivered, and `rm`/`stop` on a session that has exited

Spec 1.1, 1.2, 1.3, 2.4's `rm` result, 5.1, and 5.3. `spawnArgs` puts the
prompt after `--permission-mode` and before every `--add-dir`, and pushes
no `-w`; `opSpawn` reads the CLI's idle note in `claude --bg`'s stdout as
`prompt not delivered`, records the seat `removed` with `undelivered`, and
removes it with `claude rm`; `stop` and `rm` that fail with
`No job matching` succeed with `note: "already exited"`; every other
failure's text is the stderr, or the stdout when the stderr is empty; the
`rm` result names a worktree only when `claude rm` printed one. The
`worktree` request field still names a directory nothing checks until
Task 2; between the two tasks the tree spawns a worktree seat with neither
`-w` nor a cwd of its own, which no seat of this run exercises — the
resident spawner keeps the code it started with (Global Constraints).

**Files:**

- Modify: `skills/tanto/scripts/spawner.js` — `spawnArgs` and its comment;
  `shortIdOf`'s comment, with `IDLE_NOTE`, `idleLine`, and
  `removeUndelivered` after it; `opSpawn`'s idle-note check; `alreadyExited`
  and `failureText` before `runWithEitherId`; `handleRequest`'s `stop` and
  `rm` branches; `takeRequests`'s log line.
- Test: `skills/tanto/scripts/spawner.test.js` — its fake CLI (which
  `tanto.test.js` reads out of this file), the argv test, the `rm` test, and
  three new tests.

**Interfaces:**

- Consumes: nothing from another task.
- Produces: `spawnArgs(request, name)` returns `--bg`, `--name`,
  `--settings`, the request's `--model`/`--effort`, `--permission-mode`,
  the prompt, then `--add-dir <dir>` per entry. A spawn result whose
  `claude --bg` stdout carries `(idle — send a prompt to start)` is
  `{ error: "prompt not delivered: <that line>" }`, its seat `removed` with
  `undelivered: <that line>`. A `stop` or `rm` result may carry
  `note: "already exited"`; an `rm` result carries `worktree` only when
  `claude rm` printed `Removed worktree <path>`. The fake CLI learns
  `state.failOut` (a stdout refusal, exit 1) and `next.idleNote`.

**Named-mechanism sites.** `prompt not delivered` and `undelivered` are
also `templates/spawn-request.md`'s result paragraph (Task 7). The idle
note is also the fake's `--resume` line and the test "the short id is read
from the spawn line and from the resume line", both unchanged.
`already exited` is also the spawn-request result paragraph (Task 7). The
`rm` result's `worktree` is also that paragraph (Task 7) and
`roles/kanri.md`'s landing (Task 8). "A worktree seat's real branch" is
also `roles/kanri.md`'s merge act (Task 8).

**O1.1** `args.push("-w"` — `spawnArgs`'s `-w` push (spec 1.1, 2.2); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.2** `"-w",` — the argv test's expected `"-w",` entry, and the same push read through its comma; before: 1 in `skills/tanto/scripts/spawner.test.js` and 1 in `skills/tanto/scripts/spawner.js`, after: 0 in both.

**O1.3** `args.push(request.prompt);` — the prompt as `spawnArgs`'s last push (spec 1.1); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0 — the new order is one return expression, so the old push cannot survive beside it.

**O1.4** `branch is the CLI's own` — `spawnArgs`'s comment on a worktree seat's branch (spec 2.1); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.5** `after it on a resume.` — `shortIdOf`'s comment, which knew the idle note as the resume's line alone (spec 1.2); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.6** `claude stop: ${got.err.trim()}` — the `stop` error text, stderr alone (spec 5.1); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.7** `claude rm: ${got.err.trim()}` — the `rm` error text, stderr alone (spec 5.1); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.8** `: seat?.worktree` — the `rm` result's fallback to the request's own `worktree` name (spec 2.4); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.9** `: "ok"}` — `takeRequests`'s log line with no room for a note (spec 5.1); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.10** `rm reports the worktree it removed"` — the `rm` test that spawned `worktree: "shoki-t"` with no such directory and asserted a worktree whatever `claude rm` printed (spec section 6); before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P1.11 to P1.17. The fake CLI learns
a refusal on stdout and the idle note; the argv test expects the new order
and creates the worktree directory Task 2 will require; the `rm` test
creates it too and gains a second half; three tests are added after it.

**P1.11** `skills/tanto/scripts/spawner.test.js` — replace exactly these 3 lines

```js
}
const save = () => fs.writeFileSync(statePath, JSON.stringify(state));
if (sub === "agents") {
```

**P1.11 →**

```js
}
// A refusal printed on stdout with nothing on stderr, the shape 37ec's item 4
// measured for claude rm (spec 5.1).
const failOut = state.failOut || {};
if (failOut[sub]) {
  process.stdout.write(failOut[sub] + "\\n");
  process.exit(1);
}
const save = () => fs.writeFileSync(statePath, JSON.stringify(state));
if (sub === "agents") {
```

**P1.12** `skills/tanto/scripts/spawner.test.js` — replace exactly these 3 lines

```js
  save();
  process.stdout.write("backgrounded · " + printed + " · " + session.name + "\\n");
  process.exit(0);
```

**P1.12 →**

```js
  save();
  // next.idleNote: the note the CLI prints for a session started with no
  // prompt -- a resume's normal line, and a spawn's when its prompt was lost
  // (spec 1.2).
  const idle = next.idleNote ? " (idle — send a prompt to start)" : "";
  process.stdout.write("backgrounded · " + printed + " · " + session.name + idle + "\\n");
  process.exit(0);
```

**P1.13** `skills/tanto/scripts/spawner.test.js` — replace exactly these 4 lines

```js

test("a spawn's command line carries the name, the isolation setting, and the flags the request names", () => {
  const ws = workspace();
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
```

**P1.13 →**

```js

test("a spawn's command line carries the name, the isolation setting, the request's flags, and the prompt before --add-dir", () => {
  const ws = workspace();
  fs.mkdirSync(path.join(ws.root, ".claude", "worktrees", "shoki-t"), { recursive: true });
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
```

**P1.14** `skills/tanto/scripts/spawner.test.js` — replace exactly these 2 lines

```js
  assert.match(spawned[2], namePattern(ws, "shoki", "t"));
  assert.deepEqual(spawned, [
```

**P1.14 →**

```js
  assert.match(spawned[2], namePattern(ws, "shoki", "t"));
  // No -w for any seat (spec 2.2), and the prompt before the variadic
  // --add-dir, which would read it as one more directory (spec 1.1).
  assert.deepEqual(spawned, [
```

**P1.15** `skills/tanto/scripts/spawner.test.js` — replace exactly these 7 lines

```js
    "auto",
    "-w",
    "shoki-t",
    "--add-dir",
    ws.root,
    SPAWN.prompt,
  ]);
```

**P1.15 →**

```js
    "auto",
    SPAWN.prompt,
    "--add-dir",
    ws.root,
  ]);
```

**P1.16** `skills/tanto/scripts/spawner.test.js` — replace exactly these 4 lines

```js

test("rm reports the worktree it removed", () => {
  const ws = workspace();
  setState(ws, { next: { sessionId: "sess-shoki", id: "bg09", worktree: "/repo/.claude/worktrees/shoki-t" } });
```

**P1.16 →**

```js

test("rm reports the worktree claude rm printed, and none when it printed none (spec 2.4)", () => {
  const ws = workspace();
  fs.mkdirSync(path.join(ws.root, ".claude", "worktrees", "shoki-t"), { recursive: true });
  setState(ws, { next: { sessionId: "sess-shoki", id: "bg09", worktree: "/repo/.claude/worktrees/shoki-t" } });
```

**P1.17** `skills/tanto/scripts/spawner.test.js` — replace exactly these 2 lines

```js
  assert.equal(seats(ws)[0].status, "removed");
});
```

**P1.17 →**

```js
  assert.equal(seats(ws)[0].status, "removed");

  // Kanri's worktree is the seat's cwd and never the CLI's: claude rm prints
  // no Removed worktree line, and the result names no worktree.
  const second = workspace();
  fs.mkdirSync(path.join(second.root, ".claude", "worktrees", "shoki-t"), { recursive: true });
  request(second, { ...SPAWN, role: "shoki", worktree: "shoki-t" });
  run(second, ["run", "--root", second.root, "--once"]);
  const rm = request(second, { op: "rm", sessionId: "sess-new" });
  run(second, ["run", "--root", second.root, "--once"]);
  assert.match(result(second, rm.id).removed, /\d/);
  assert.equal(result(second, rm.id).worktree, undefined);
  assert.equal(seats(second)[0].status, "removed");
});

test("a spawn whose --bg line carries the idle note is an error, and its seat is removed (spec 1.2)", () => {
  const ws = workspace();
  setState(ws, { next: { idleNote: true } });
  const { id } = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(
    result(ws, id).error,
    /^prompt not delivered: backgrounded · bg01 · \S+ \(idle — send a prompt to start\)$/,
  );
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "rm")
      .map((argv) => argv[1]),
    ["bg01"],
  );
  assert.equal(seats(ws)[0].status, "removed");
  assert.match(seats(ws)[0].undelivered, /\(idle — send a prompt to start\)$/);
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.match(log, /spawn: sess-new removed — prompt not delivered/);
  assert.doesNotMatch(log, /guard stopped/);
});

test("stop and rm on a session the CLI has already dropped succeed, with a note (spec 5.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { fail: { stop: "No job matching sess-new", rm: "No job matching sess-new" } });
  const stop = request(ws, { op: "stop", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, stop.id).error, undefined);
  assert.match(result(ws, stop.id).stopped, /\d/);
  assert.equal(result(ws, stop.id).note, "already exited");
  assert.equal(seats(ws)[0].status, "stopped");
  const rm = request(ws, { op: "rm", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, rm.id).error, undefined);
  assert.match(result(ws, rm.id).removed, /\d/);
  assert.equal(result(ws, rm.id).note, "already exited");
  assert.equal(seats(ws)[0].status, "removed");
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.ok(log.includes(`rm ${rm.id}.json ok (already exited)`), log);
});

test("a failed rm with nothing on stderr reports the line it printed on stdout (spec 5.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { failOut: { rm: "refused: the worktree has changes" } });
  const { id } = request(ws, { op: "rm", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).error, "claude rm: refused: the worktree has changes");
  assert.equal(seats(ws)[0].status, "running");
});
```

- [ ] **Step 2: Run the five tests to verify they fail**

```bash
node --test --test-name-pattern "prompt before --add-dir|printed none|idle note|already dropped|nothing on stderr" skills/tanto/scripts/spawner.test.js
```

Expected: five failures — the argv list still carries `-w` and ends with
the prompt; the `rm` result names `shoki-t` though `claude rm` printed no
worktree; the idle-note spawn succeeds; the `No job matching` ops are
errors; the stdout refusal reads `claude rm:` and nothing more.

- [ ] **Step 3: Write the command line, the prompt check, and the two landing points**

Apply P1.18 to P1.27.

**P1.18** `skills/tanto/scripts/spawner.js` — replace exactly these 8 lines

```js
 * The `--bg` command line of a spawn: the seat's name and the isolation
 * setting, then the request's own flags. A resume passes none of them — any
 * flag on `--resume … --bg` starts a copy under a new id — and the CLI
 * brings back the options the spawn passed. `request.branch` is not read
 * here — it is informational, carried through into the result and then into
 * `record --seat`'s Branch column (`boundary.js`); a worktree seat's real
 * branch is the CLI's own (Important 4, task 26; Minor 5, branch-review.md).
 */
```

**P1.18 →**

```js
 * The `--bg` command line of a spawn: the seat's name and the isolation
 * setting, then the request's own flags, then the prompt, and every
 * `--add-dir` last. No `-w` is passed for any seat: a worktree seat runs with
 * the worktree Kanri cut as its cwd (`opSpawn`, spec 2.2). A resume passes
 * none of them — any flag on `--resume … --bg` starts a copy under a new id —
 * and the CLI brings back the options the spawn passed. `request.branch` is
 * not read here — it is informational, carried through into the result and
 * then into `record --seat`'s Branch column (`boundary.js`); a worktree
 * seat's real branch is Kanri's `worktree-shoki-<topic>`, cut in the merge
 * act (Important 4, task 26; Minor 5, branch-review.md).
 */
```

**P1.19** `skills/tanto/scripts/spawner.js` — replace exactly these 6 lines

```js
  args.push("--permission-mode", request.mode || "auto");
  if (request.worktree) args.push("-w", request.worktree);
  for (const dir of request.addDir || []) args.push("--add-dir", dir);
  args.push(request.prompt);
  return args;
}
```

**P1.19 →**

```js
  args.push("--permission-mode", request.mode || "auto");
  // The prompt before every `--add-dir`: that option is variadic, so a prompt
  // after it is read as one more directory and the seat starts with no first
  // turn (spec 1.1).
  const addDirs = (request.addDir || []).flatMap((dir) => ["--add-dir", dir]);
  return [...args, request.prompt, ...addDirs];
}
```

**P1.20** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
 * CLI prints `backgrounded · <short id> · <name>` on a spawn, and the same
 * line with ` (idle — send a prompt to start)` after it on a resume.
 */
```

**P1.20 →**

```js
 * CLI prints `backgrounded · <short id> · <name>` on a spawn, and the same
 * line with ` (idle — send a prompt to start)` after it on a resume — and on
 * a spawn whose prompt was lost, which `opSpawn` treats as an error.
 */
```

**P1.21** `skills/tanto/scripts/spawner.js` — replace exactly these 2 lines

```js

function findNew(root, before) {
```

**P1.21 →**

```js

/** The note `claude --bg` prints for a session started with no prompt (spec 1.2). */
const IDLE_NOTE = "(idle — send a prompt to start)";

/** The line of `text` carrying the idle note, trimmed, or null. */
function idleLine(text) {
  const line = String(text || "")
    .split(/\r?\n/)
    .find((l) => l.includes(IDLE_NOTE));
  return line ? line.trim() : null;
}

/**
 * A spawn whose prompt was not delivered (spec 1.2): the seat exists, so it
 * is recorded with `undelivered` and removed with `claude rm` — not `stop`,
 * since such a session is listed with no `pid` and holds nothing worth
 * keeping. A removal that fails leaves the seat `running`, for the census to
 * see gone; the result is an error either way, which Kanri reads at its next
 * act, and the log line has a prefix of its own, apart from the guard's.
 */
function removeUndelivered(root, seat, line) {
  seat.undelivered = line;
  const got = runClaude(["rm", seat.id || seat.sessionId]);
  if (got.code !== 0 && !alreadyExited(got)) {
    appendLog(root, `spawn: ${seat.sessionId} rm failed — ${failureText(got)}`);
    return { error: `prompt not delivered: ${line}; claude rm: ${failureText(got)}` };
  }
  seat.status = "removed";
  appendLog(root, `spawn: ${seat.sessionId} removed — prompt not delivered`);
  return { error: `prompt not delivered: ${line}` };
}

function findNew(root, before) {
```

**P1.22** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
  if (got.code !== 0) return { error: `claude --bg exited ${got.code}: ${got.err.trim()}` };
  const session = findNew(root, before);
  if (!session) {
```

**P1.22 →**

```js
  if (got.code !== 0) return { error: `claude --bg exited ${got.code}: ${got.err.trim()}` };
  // The idle note on a spawn is a prompt that never reached the seat (spec
  // 1.2). On a resume it is the CLI's normal line, and the resume op does not
  // read it.
  const undelivered = idleLine(got.out);
  const session = findNew(root, before);
  if (!session && undelivered) return { error: `prompt not delivered: ${undelivered}` };
  if (!session) {
```

**P1.23** `skills/tanto/scripts/spawner.js` — replace exactly these 2 lines

```js
  seats.push(seat);
  if (stray) {
```

**P1.23 →**

```js
  seats.push(seat);
  if (undelivered) return removeUndelivered(root, seat, undelivered);
  if (stray) {
```

**P1.24** `skills/tanto/scripts/spawner.js` — replace exactly these 2 lines

```js

/** `stop` and `rm` take the short id on some builds and the long one on others. */
```

**P1.24 →**

```js

/**
 * A `claude stop` or `claude rm` that failed because the CLI has already
 * dropped the session (spec 5.1): not an error, since what the op asked for
 * is done.
 */
function alreadyExited(got) {
  return got.code !== 0 && got.err.includes("No job matching");
}

/** A failed command's text: its stderr, or its stdout when the stderr is empty (spec 5.1). */
function failureText(got) {
  return got.err.trim() || got.out.trim();
}

/** `stop` and `rm` take the short id on some builds and the long one on others. */
```

**P1.25** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
    const got = runWithEitherId("stop", seat, request.sessionId);
    if (got.code !== 0) return { error: `claude stop: ${got.err.trim()}` };
    if (seat) seat.status = "stopped";
    return { stopped: stamp() };
  }
```

**P1.25 →**

```js
    const got = runWithEitherId("stop", seat, request.sessionId);
    const exited = alreadyExited(got);
    if (got.code !== 0 && !exited) return { error: `claude stop: ${failureText(got)}` };
    if (seat) seat.status = "stopped";
    return { stopped: stamp(), ...(exited ? { note: "already exited" } : {}) };
  }
```

**P1.26** `skills/tanto/scripts/spawner.js` — replace exactly these 6 lines

```js
    const got = runWithEitherId("rm", seat, request.sessionId);
    if (got.code !== 0) return { error: `claude rm: ${got.err.trim()}` };
    if (seat) seat.status = "removed";
    const printed = /Removed worktree (.+)/i.exec(got.out);
    return { removed: stamp(), worktree: printed ? printed[1].trim() : seat?.worktree };
  }
```

**P1.26 →**

```js
    const got = runWithEitherId("rm", seat, request.sessionId);
    const exited = alreadyExited(got);
    if (got.code !== 0 && !exited) return { error: `claude rm: ${failureText(got)}` };
    if (seat) seat.status = "removed";
    // The worktree `claude rm` printed it removed, and none when it printed
    // none: Kanri's worktree is the seat's cwd and not the CLI's, and a name
    // is not a removal (spec 2.4).
    const printed = /Removed worktree (.+)/i.exec(got.out);
    return {
      removed: stamp(),
      ...(printed ? { worktree: printed[1].trim() } : {}),
      ...(exited ? { note: "already exited" } : {}),
    };
  }
```

**P1.27** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
    writeSeats(root, seats);
    appendLog(root, `${request.op} ${name} ${outcome.error ? `error: ${outcome.error}` : "ok"}`);
  }
```

**P1.27 →**

```js
    writeSeats(root, seats);
    // A `note` rides on success: `rm <name> ok (already exited)` (spec 5.1).
    const said = outcome.error ? `error: ${outcome.error}` : outcome.note ? `ok (${outcome.note})` : "ok";
    appendLog(root, `${request.op} ${name} ${said}`);
  }
```

- [ ] **Step 4: Run the two suites that read the fake to verify they pass**

```bash
node --test skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js
```

Expected: every test passes, the five above included.

- [ ] **Step 5: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --task 1
```

Expected: `task 1: verify clean`.

- [ ] **Step 6: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js
git commit --only -m "fix: the spawner puts the prompt before --add-dir, reads a lost prompt as an error, and takes an exited session's rm or stop as done" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js
```

Expected: lint passes with no file changed; one commit.

### Task 2: The spawner runs a worktree seat in the directory Kanri cut, and keys the listing on its `cwd`

Spec 2.2, 2.3, and 2.5, with the existing worktree test of spec section 6.
`opSpawn` resolves `<root>/.claude/worktrees/<worktree>`, returns
`worktree <path> is not a directory` without running `claude --bg` when it
is not one, and otherwise runs `claude --bg` with it as the child's cwd;
`runClaude` gains the optional `cwd`. `listAgents` lists with no `--cwd` and
keeps the entries whose listed `cwd` is the root or under it — `underRoot`,
`boundary.js census`'s own test, written beside `comparablePath` — so
`findNew`, `findResumed`, and `runCensus` all read one key. The task brings
`tanto.test.js`'s listing fixtures with it: the launcher's tests run the
real spawner, whose `findResumed` and census now drop every fixture entry
listed with `cwd: null` — a shape the real listing never shows (M-6) —
and five launcher tests went red on this task's spawner alone while the
plan was drafted. Each fixture's `cwd` becomes `ROOT`, which `workspace`
replaces with the workspace root it makes.

**Files:**

- Modify: `skills/tanto/scripts/spawner.js` — `runClaude`, `listAgents`,
  `underRoot` (new, before `underAdHocWorktree`), and `opSpawn`'s first
  lines, its `claude --bg` call, and its no-new-session error.
- Test: `skills/tanto/scripts/spawner.test.js` — the fake's `next.foreign`,
  "the guard leaves a seat whose request named a worktree alone", and three
  new tests.
- Test: `skills/tanto/scripts/tanto.test.js` — `ROOT`, `workspace`, and
  every listing fixture's `cwd`.

**Interfaces:**

- Consumes: Task 1's `spawnArgs`, which passes no `-w`.
- Produces: `underRoot(root, cwd)` in `spawner.js`, exported by Task 3 and
  read by `tanto.js` in Task 4. A spawn request with `worktree` runs
  `claude --bg` with `<root>/.claude/worktrees/<worktree>` as its cwd, or
  returns `{ error: "worktree <path> is not a directory" }` with no
  `claude --bg` call. Every listing the spawner reads is `claude agents
  --json` filtered by `underRoot`.

**Named-mechanism sites.** The `worktree` field's meaning is also
`templates/spawn-request.md`'s `worktree` bullet (Task 7), `SKILL.md`'s
Artifacts row and Workspace paragraph (Task 6), `templates/shoki-brief.md`'s
Worktree argument (Task 7), and `roles/kanri.md`'s merge act and Create row
(Task 8). The guard's exemption by `seat.worktree` (`censusSeat`,
`opSpawn`'s `stray`) is unchanged. `underRoot` is also `boundary.js`'s own
copy, unchanged, and `tanto.js`'s `listAgents` (Task 4).

**O2.1** `--json --cwd <root>` — `listAgents`'s comment and `opSpawn`'s no-new-session error, both naming the `--cwd` spec 2.3 drops; before: 2 in `skills/tanto/scripts/spawner.js`, after: 0. Its third hit, in `skills/tanto/scripts/tanto.js`, is O4.1's.

**O2.2** `"--cwd", root` — the spawner's listing argument (spec 2.3); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0. The hit in `skills/tanto/scripts/tanto.js` is O4.2's.

**O2.3** `listed no new session within 30 s` — `opSpawn`'s error, whose thirty seconds M-6 measured at about forty-four; before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O2.4** `function runClaude(args) {` — a `runClaude` that takes no cwd (spec 2.2); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O2.5** `request named a worktree alone` — the guard test that spawned `worktree: "shoki-t"` with no such directory (spec section 6); before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0.

**O2.6** `cwd: null` — every listing fixture of the launcher's tests, a shape `underRoot` excludes (spec 2.3, section 6); before: 20 lines in `skills/tanto/scripts/tanto.test.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P2.7 to P2.9. The fake lists a
session of another repository ahead of the new one when told to; the guard
test creates its worktree directory; three tests are added after it.

**P2.7** `skills/tanto/scripts/spawner.test.js` — replace exactly these 2 lines

```js
  if (next.noListedId) delete session.id;
  state.sessions.push(session);
```

**P2.7 →**

```js
  if (next.noListedId) delete session.id;
  // next.foreign: a session another repository started in the same seconds,
  // listed ahead of this one (spec 2.3).
  if (next.foreign) state.sessions.push(next.foreign);
  state.sessions.push(session);
```

**P2.8** `skills/tanto/scripts/spawner.test.js` — replace exactly these 5 lines

```js

test("the guard leaves a seat whose request named a worktree alone", () => {
  const ws = workspace();
  setState(ws, { next: { cwd: path.join(ws.root, ".claude", "worktrees", "shoki-t") } });
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
```

**P2.8 →**

```js

test("the guard leaves alone a seat running in the worktree Kanri cut for it", () => {
  const ws = workspace();
  const worktree = path.join(ws.root, ".claude", "worktrees", "shoki-t");
  fs.mkdirSync(worktree, { recursive: true });
  setState(ws, { next: { cwd: worktree } });
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
```

**P2.9** `skills/tanto/scripts/spawner.test.js` — replace exactly these 2 lines

```js

test("the census revives a gone seat the listing holds again, and never a stopped one", () => {
```

**P2.9 →**

```js

test("a worktree request runs claude --bg in the directory Kanri cut, with no -w (spec 2.2)", () => {
  const ws = workspace();
  const worktree = path.join(ws.root, ".claude", "worktrees", "shoki-t");
  fs.mkdirSync(worktree, { recursive: true });
  setState(ws, { next: { cwd: worktree } });
  const { id } = request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).error, undefined);
  const spawned = calls(ws).find((argv) => argv.includes("--bg"));
  assert.equal(spawned.includes("-w"), false);
  const state = JSON.parse(fs.readFileSync(ws.state, "utf8"));
  assert.equal(fs.realpathSync(state.cwdSeen), fs.realpathSync(worktree));
  assert.equal(seats(ws)[0].cwd, worktree);
  assert.equal(seats(ws)[0].status, "running");
});

test("a worktree request whose directory is not there is an error, and claude --bg never runs (spec 2.2)", () => {
  const ws = workspace();
  const { id } = request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).error, /^worktree .*shoki-t is not a directory$/);
  assert.equal(calls(ws).filter((argv) => argv.includes("--bg")).length, 0);
  assert.equal(seats(ws).length, 0);
});

test("a spawn adopts the new session under the root, never one another repository started meanwhile (spec 2.3)", () => {
  const ws = workspace();
  const worktree = path.join(ws.root, ".claude", "worktrees", "shoki-t");
  fs.mkdirSync(worktree, { recursive: true });
  const foreign = {
    sessionId: "sess-foreign",
    name: "elsewhere",
    cwd: path.dirname(ws.root),
    kind: "background",
    state: "running",
    id: "bg99",
    pid: 999,
  };
  setState(ws, { next: { sessionId: "sess-shoki", cwd: worktree, foreign } });
  const { id } = request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).sessionId, "sess-shoki");
  assert.deepEqual(
    seats(ws).map((s) => s.sessionId),
    ["sess-shoki"],
  );
  assert.equal(
    calls(ws).some((argv) => argv[0] === "agents" && argv.includes("--cwd")),
    false,
  );
});

test("the census revives a gone seat the listing holds again, and never a stopped one", () => {
```

- [ ] **Step 2: Run the three new tests to verify they fail**

```bash
node --test --test-name-pattern "the directory Kanri cut, with no -w|is not there is an error|another repository started meanwhile" skills/tanto/scripts/spawner.test.js
```

Expected: three failures — the fake saw the root as its cwd, not the
worktree; the missing directory spawned anyway; `findNew` adopted
`sess-foreign`, the first new entry, and the listing carried `--cwd`.

- [ ] **Step 3: Give the spawn its cwd and the listing its key**

Apply P2.10 to P2.17.

**P2.10** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js

function runClaude(args) {
  const command = claudeCommand(args);
```

**P2.10 →**

```js

/**
 * Run the CLI. `cwd` is the child's working directory — a worktree seat's
 * spawn alone passes one (spec 2.2); every other call inherits the root,
 * which `cmdRun` made this process's own.
 */
function runClaude(args, cwd) {
  const command = claudeCommand(args);
```

**P2.11** `skills/tanto/scripts/spawner.js` — replace exactly these 2 lines

```js
    windowsHide: true,
  });
```

**P2.11 →**

```js
    windowsHide: true,
    ...(cwd ? { cwd } : {}),
  });
```

**P2.12** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js

/** `claude agents --json --cwd <root>`, parsed. Never throws. */
function listAgents(root) {
  const got = runClaude(["agents", "--json", "--cwd", root]);
  if (got.code !== 0) {
```

**P2.12 →**

```js

/**
 * `claude agents --json`, parsed, keeping the entries whose listed `cwd` is
 * the root or under it (`underRoot`, spec 2.3). No `--cwd`: the CLI's
 * filter is measured for the root alone, and a seat whose cwd is a worktree
 * under the root may be keyed elsewhere. Never throws.
 */
function listAgents(root) {
  const got = runClaude(["agents", "--json"]);
  if (got.code !== 0) {
```

**P2.13** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
  }
  if (Array.isArray(parsed)) return { sessions: parsed };
  return { sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [] };
}
```

**P2.13 →**

```js
  }
  const all = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.sessions) ? parsed.sessions : [];
  return { sessions: all.filter((s) => underRoot(root, s?.cwd)) };
}
```

**P2.14** `skills/tanto/scripts/spawner.js` — replace exactly these 2 lines

```js

/** Whether a listed cwd lies under `<root>/.claude/worktrees/` (issue-aa37, spec 1.4). */
```

**P2.14 →**

```js

/**
 * Whether a listed cwd is the root or a path under it: `boundary.js
 * census`'s key, and every reader of the listing here (spec 2.3), so a
 * session another repository starts in the same seconds is never adopted.
 */
function underRoot(root, cwd) {
  if (!cwd) return false;
  const base = comparablePath(root);
  const here = comparablePath(cwd);
  return here === base || here.startsWith(`${base}/`);
}

/** Whether a listed cwd lies under `<root>/.claude/worktrees/` (issue-aa37, spec 1.4). */
```

**P2.15** `skills/tanto/scripts/spawner.js` — replace exactly these 2 lines

```js
function opSpawn(root, request, seats) {
  // A transient failure here must not be swallowed into an empty `before`
```

**P2.15 →**

```js
function opSpawn(root, request, seats) {
  // A worktree seat runs with the directory Kanri cut as its cwd (spec 2.2),
  // never with `-w`: an ordinary session, so the harness's worktree isolation
  // does not apply to it. A directory that is not there is an error before
  // `claude --bg` runs.
  const cwd = request.worktree ? path.join(root, ".claude", "worktrees", request.worktree) : null;
  if (cwd && !fs.statSync(cwd, { throwIfNoEntry: false })?.isDirectory()) {
    return { error: `worktree ${cwd} is not a directory` };
  }
  // A transient failure here must not be swallowed into an empty `before`
```

**P2.16** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
  const name = seatName(root, request, seats);
  const got = runClaude(spawnArgs(request, name));
  if (got.code !== 0) return { error: `claude --bg exited ${got.code}: ${got.err.trim()}` };
```

**P2.16 →**

```js
  const name = seatName(root, request, seats);
  const got = runClaude(spawnArgs(request, name), cwd);
  if (got.code !== 0) return { error: `claude --bg exited ${got.code}: ${got.err.trim()}` };
```

**P2.17** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
      error:
        "claude --bg exited 0 but `claude agents --json --cwd <root>` listed no new session within 30 s — " +
        "it may have started under another cwd",
```

**P2.17 →**

```js
      error:
        "claude --bg exited 0 but `claude agents --json` listed no new session under the root within its poll — " +
        "it may have started under another cwd",
```

- [ ] **Step 4: Give the launcher's listing fixtures a cwd**

Apply P2.18 to P2.23.
Before them, `node --test skills/tanto/scripts/tanto.test.js` fails five
tests — the rebooted Kanri, the Kanri with no roster row, `down --seats`
then `tanto`, the `gone` Kanri, and the pid-less entry — each a resume the
spawner's `findResumed` no longer finds under a `cwd: null` entry.

**P2.18** `skills/tanto/scripts/tanto.test.js` — replace all 12 occurrences of this 1 line

```js
      cwd: null,
```

**P2.18 →**

```js
      cwd: ROOT,
```

**P2.19** `skills/tanto/scripts/tanto.test.js` — replace all 6 occurrences of this 1 line

```js
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "interactive", id: "tab1", pid: 1111 },
```

**P2.19 →**

```js
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: ROOT, kind: "interactive", id: "tab1", pid: 1111 },
```

**P2.20** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "blocked" },
```

**P2.20 →**

```js
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: ROOT, kind: "background", state: "blocked" },
```

**P2.21** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
  cwd: null,
```

**P2.21 →**

```js
  cwd: ROOT,
```

**P2.22** `skills/tanto/scripts/tanto.test.js` — replace exactly these 2 lines

```js

function workspace(sessions = []) {
```

**P2.22 →**

```js

// A listing fixture's cwd: the workspace root, which no fixture can name
// before `workspace` makes it, so `ROOT` stands for it there. The real
// listing carries a cwd on every entry, and every reader keeps only the
// entries at or under the root (spec 2.3).
const ROOT = Symbol("the workspace root");

function workspace(sessions = []) {
```

**P2.23** `skills/tanto/scripts/tanto.test.js` — replace exactly these 3 lines

```js
  const state = path.join(root, "fake-state.json");
  fs.writeFileSync(state, JSON.stringify({ root, sessions, next: {} }));
  const ws = { root, fake, state, log: path.join(root, "fake-log.txt") };
```

**P2.23 →**

```js
  const state = path.join(root, "fake-state.json");
  const listed = sessions.map((s) => (s.cwd === ROOT ? { ...s, cwd: root } : s));
  fs.writeFileSync(state, JSON.stringify({ root, sessions: listed, next: {} }));
  const ws = { root, fake, state, log: path.join(root, "fake-log.txt") };
```

- [ ] **Step 5: Run the two suites that read the spawner to verify they pass**

```bash
node --test skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js
```

Expected: every test passes.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --task 2
```

Expected: `task 2: verify clean`.

- [ ] **Step 7: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js
git commit --only -m "fix: the spawner runs a worktree seat in the directory Kanri cut and keys the listing on its cwd under the root" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js
```

Expected: lint passes with no file changed; one commit.

### Task 3: The spawner marks a seat with no first turn, and beats a heartbeat

Spec 3.1, 3.2, 3.4, 4.1, and 4.3's spawner test. `opSpawn` writes the
seat's `transcript` and `startedAtMs`; `censusSeat` looks for a missing
transcript once per pass, fills it when found and clears a `noFirstTurn`
mark with `census: <sessionId> first turn`, marks a seat `FIRST_TURN_WAIT_MS`
(120000) past its `startedAtMs` with one toast and
`census: <sessionId> no first turn after 2m`, and marks a seat gone with no
transcript with the same toast and `census: <sessionId> gone — no first
turn`; a marked seat is not judged again, and a seat with no `startedAtMs`
is never judged. The spawner writes `.tanto/spawner/heartbeat` at every
pass, before and after every request, at every census, and inside every
poll loop through `pause(root, ms)`. `nowMs()` reads `TANTO_NOW_MS` when
set. The module exports what Task 4's launcher reads.

**Files:**

- Modify: `skills/tanto/scripts/spawner.js` — the two constants; `nowMs`,
  `heartbeatPath`, `beat`, and `pause` after `sleepSync`; `transcriptOf`
  takes `root`; `findNew` and `findResumed` pause; `opSpawn`'s
  `startedAtMs` and `transcript`; `takeRequests`'s two beats;
  `lookForTranscript` and `noFirstTurn` before `censusSeat`, and
  `censusSeat`'s two judgments; `runCensus`'s beat; `cmdRun`'s pass and its
  two comments; `module.exports`.
- Test: `skills/tanto/scripts/spawner.test.js` — `workspace`'s `config`,
  `STARTED_AT`, `run`'s `env` option with `CLAUDE_CONFIG_DIR` and
  `TANTO_NOW_MS`, `writeTranscript`, `spawnerLog`, the revive test's
  transcript, and five new tests at the end.

**Interfaces:**

- Consumes: Task 2's `underRoot`, exported here.
- Produces: `module.exports` gains `underRoot`, `appendLog`,
  `heartbeatPath`, and `HEARTBEAT_STALE_MS` (60000) for `tanto.js`
  (Task 4). A seat in `seats.json` may carry `transcript`, `startedAtMs`,
  and `noFirstTurn: <YYYY-MM-DD HH:MM>`, which `boundary.js census` reads
  (Task 5). The heartbeat file holds the clock's epoch milliseconds and a
  newline. `run(ws, argv, { env })` in the test file merges `env` over its
  defaults.

**Named-mechanism sites.** The `no first turn` mark, toast, and log lines
are also `boundary.js census`'s suffix (Task 5), `SKILL.md`'s
`scripts/spawner.js` paragraph (Task 6), and `roles/kanri.md`'s census
bullets (Task 8). The `heartbeat` file and `HEARTBEAT_STALE_MS` are also
`tanto.js`'s `liveSpawner`, `startSpawner`, and `cmdDown` (Task 4),
`SKILL.md`'s Artifacts row and both script paragraphs (Task 6), and the
README's `tanto down` paragraph (Task 9). `transcriptOf`'s one caller is
`opSpawn`. The ad hoc-worktree guard's own toast and log line, in
`strand`, are unchanged.

**O3.1** `transcriptOf(session.sessionId)` — a transcript poll that took no `root` and so could not beat (spec 4.1), and whose result never reached the seat (spec 3.2); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O3.2** `sleepSync(SPAWN_POLL_MS)` — `findNew`'s and `findResumed`'s silent sleeps (spec 4.1); before: 2 in `skills/tanto/scripts/spawner.js`, after: 0.

**O3.3** `sleepSync(TRANSCRIPT_POLL_MS)` — `transcriptOf`'s silent sleep (spec 4.1); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O3.4** `up to ~40 s per spawn` — `cmdRun`'s comment on the event loop's longest block, which M-6 measured at about a minute; before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O3.5** `'s every caller.` — `cmdRun`'s comment that the root covers every `runClaude` caller, which a worktree seat's spawn no longer is (spec 2.2); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O3.6** `seatName, shortIdOf };` — the exports with nothing for the launcher; before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O3.7** `...opts,` — the test helper `run` whose options replaced its whole environment, with no config directory of its own and no fixed clock; before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P3.8 to P3.12. The `run` helper
gives every spawner the workspace's own config directory and a clock fixed
at the fake's `startedAt`; the revive test's seat writes a transcript, so
its `gone` stays the ordinary one; five tests are added at the end.

**P3.8** `skills/tanto/scripts/spawner.test.js` — replace exactly these 5 lines

```js
  const state = path.join(root, "fake-state.json");
  fs.writeFileSync(state, JSON.stringify({ root, sessions, next: {} }));
  return { root, fake, state, log: path.join(root, "fake-log.txt"), notices: path.join(root, "notices.txt") };
}

```

**P3.8 →**

```js
  const state = path.join(root, "fake-state.json");
  fs.writeFileSync(state, JSON.stringify({ root, sessions, next: {} }));
  return {
    root,
    fake,
    state,
    log: path.join(root, "fake-log.txt"),
    notices: path.join(root, "notices.txt"),
    // The workspace's own config directory: the census looks for a
    // transcript at every pass, and no test reads the user's `projects/`.
    config: path.join(root, "claude-config"),
  };
}

```

**P3.9** `skills/tanto/scripts/spawner.test.js` — replace exactly these 5 lines

```js
}

function run(ws, argv, opts = {}) {
  const result = spawnSync(process.execPath, [SPAWNER, ...argv], {
    encoding: "utf8",
```

**P3.9 →**

```js
}

// The fake's --bg startedAt. `run` fixes TANTO_NOW_MS at it, so that no seat
// reaches the two-minute first-turn budget unless its test says so (spec 3.4).
const STARTED_AT = 1789984800000;

function run(ws, argv, opts = {}) {
  const { env, ...rest } = opts;
  const result = spawnSync(process.execPath, [SPAWNER, ...argv], {
    encoding: "utf8",
```

**P3.10** `skills/tanto/scripts/spawner.test.js` — replace exactly these 10 lines

```js
      FAKE_STATE: ws.state,
      FAKE_LOG: ws.log,
    },
    ...opts,
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

/** Write one request file; the caller still runs `run --once` to take it. */
function request(ws, body) {
```

**P3.10 →**

```js
      FAKE_STATE: ws.state,
      FAKE_LOG: ws.log,
      CLAUDE_CONFIG_DIR: ws.config,
      TANTO_NOW_MS: String(STARTED_AT),
      ...env,
    },
    ...rest,
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

/** A transcript of `sessionId` under one project slug of the workspace's config directory. */
function writeTranscript(ws, sessionId, slug = "c--repo") {
  const dir = path.join(ws.config, "projects", slug);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${sessionId}.jsonl`);
  fs.writeFileSync(file, "{}\n");
  return file;
}

function spawnerLog(ws) {
  const file = path.join(ws.root, ".tanto", "spawner", "log");
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

/** Write one request file; the caller still runs `run --once` to take it. */
function request(ws, body) {
```

**P3.11** `skills/tanto/scripts/spawner.test.js` — replace exactly these 4 lines

```js
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: [] });
```

**P3.11 →**

```js
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  // A seat that ran its first turn, so that its gone is the ordinary one and
  // raises no no-first-turn toast (spec 3.1).
  writeTranscript(ws, "sess-new");
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: [] });
```

**P3.12** `skills/tanto/scripts/spawner.test.js` — replace exactly these 2 lines

```js
  assert.equal(alive, false);
});
```

**P3.12 →**

```js
  assert.equal(alive, false);
});

test("run --once leaves a heartbeat within the test's own clock (spec 4.1)", () => {
  const ws = workspace();
  const before = Date.now();
  assert.equal(run(ws, ["run", "--root", ws.root, "--once"]).code, 0);
  const after = Date.now();
  const beat = Number(fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "heartbeat"), "utf8").trim());
  assert.ok(beat >= before && beat <= after, `${before} <= ${beat} <= ${after}`);
});

// The two-minute budget, with TANTO_NOW_MS past it (spec 3.1, 3.4).
const LATE = { env: { TANTO_NOW_MS: String(STARTED_AT + 120000) } };

test("a seat with no transcript under two minutes after its spawn gets no mark (spec 3.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"], { env: { TANTO_NOW_MS: String(STARTED_AT + 119000) } });
  assert.equal(seats(ws)[0].noFirstTurn, undefined);
  assert.deepEqual(notices(ws), []);
  assert.doesNotMatch(spawnerLog(ws), /first turn/);
});

test("a seat with no transcript two minutes after its spawn is marked, toasted, and logged once (spec 3.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"], LATE);
  run(ws, ["run", "--root", ws.root, "--once"], LATE);
  const seat = seats(ws)[0];
  assert.equal(seat.status, "running");
  assert.match(seat.noFirstTurn, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  assert.deepEqual(notices(ws), [`no first turn: jisso t ${seat.name} — claude attach bg01`]);
  assert.equal(spawnerLog(ws).match(/census: sess-new no first turn after 2m/g).length, 1);
});

test("a transcript under any project slug clears the mark and reaches the seat (spec 3.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"], LATE);
  assert.match(seats(ws)[0].noFirstTurn, /\d/);
  const file = writeTranscript(ws, "sess-new", "c--repo--claude-worktrees-shoki-t");
  run(ws, ["run", "--root", ws.root, "--once"], LATE);
  assert.equal(seats(ws)[0].noFirstTurn, undefined);
  assert.equal(seats(ws)[0].transcript, file);
  assert.match(spawnerLog(ws), /census: sess-new first turn/);
  assert.equal(notices(ws).length, 1);
});

test("a seat the listing drops with no transcript goes gone with the mark; one with a transcript goes plainly gone (spec 3.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: listed.map((s) => ({ ...s, hidden: true })) });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const seat = seats(ws)[0];
  assert.equal(seat.status, "gone");
  assert.match(seat.noFirstTurn, /\d/);
  assert.deepEqual(notices(ws), [`no first turn: jisso t ${seat.name} — claude attach bg01`]);
  assert.match(spawnerLog(ws), /census: sess-new gone — no first turn/);

  const second = workspace();
  request(second, SPAWN);
  run(second, ["run", "--root", second.root, "--once"]);
  writeTranscript(second, "sess-new");
  const held = JSON.parse(fs.readFileSync(second.state, "utf8")).sessions;
  setState(second, { sessions: held.map((s) => ({ ...s, hidden: true })) });
  run(second, ["run", "--root", second.root, "--once"]);
  assert.equal(seats(second)[0].status, "gone");
  assert.equal(seats(second)[0].noFirstTurn, undefined);
  assert.deepEqual(notices(second), []);
  assert.match(spawnerLog(second), /census: sess-new gone\n/);
});
```

- [ ] **Step 2: Run the five new tests to verify they fail**

```bash
node --test --test-name-pattern "heartbeat within|under two minutes|two minutes after its spawn is marked|clears the mark|goes gone with the mark" skills/tanto/scripts/spawner.test.js
```

Expected: four failures and one pass — no heartbeat file; no mark, toast,
or log line past two minutes; no transcript filled; a gone seat with no
mark. The test under two minutes passes already, and keeps passing: it is
the budget's lower edge.

- [ ] **Step 3: Write the notice and the heartbeat**

Apply P3.13 to P3.29.

**P3.13** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
const TRANSCRIPT_POLL_MS = 500;
const TRANSCRIPT_POLL_TRIES = 20;

// The ops, in the order `templates/spawn-request.md` documents them.
```

**P3.13 →**

```js
const TRANSCRIPT_POLL_MS = 500;
const TRANSCRIPT_POLL_TRIES = 20;
// A seat with no transcript this long after its spawn has run no first turn
// (spec 3.1): twice the longest healthy start the probes saw, eight passes.
const FIRST_TURN_WAIT_MS = 120000;
// A heartbeat older than this is not this spawner's, or is one that stopped
// working (spec 4.1): the longest silence between two beats is one `claude`
// call and one sleep, under two seconds.
const HEARTBEAT_STALE_MS = 60000;

// The ops, in the order `templates/spawn-request.md` documents them.
```

**P3.14** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
}

function appendLog(root, line) {
  try {
```

**P3.14 →**

```js
}

/**
 * Now, in epoch milliseconds, for a seat's age (spec 3.2): `TANTO_NOW_MS`
 * when set — a test seam, like `TANTO_CLAUDE_NODE` — else the clock.
 */
function nowMs() {
  const fixed = process.env.TANTO_NOW_MS;
  return fixed ? Number(fixed) : Date.now();
}

function heartbeatPath(root) {
  return path.join(spawnerDir(root), "heartbeat");
}

/**
 * The spawner's proof that it is alive and working (spec 4.1): the clock's
 * epoch milliseconds — never `TANTO_NOW_MS`, since the launcher compares it
 * with its own clock — through a temp file and rename. The launcher trusts
 * it over `pid`, which a dead spawner leaves behind and the system may give
 * to another process. Never throws: a beat that cannot be written reads to
 * the launcher as a stale one.
 */
function beat(root) {
  const file = heartbeatPath(root);
  try {
    fs.writeFileSync(`${file}.tmp`, `${Date.now()}\n`);
    fs.renameSync(`${file}.tmp`, file);
  } catch {
    // As `appendLog`'s: not a reason to stop spawning seats.
  }
}

/** Every poll loop's wait: a beat, then the sleep, so no poll outlasts the heartbeat's budget. */
function pause(root, ms) {
  beat(root);
  sleepSync(ms);
}

function appendLog(root, line) {
  try {
```

**P3.15** `skills/tanto/scripts/spawner.js` — replace exactly these 11 lines

```js
 * result -- which `boundary.js record --seat` would then write into the
 * roster as `unavailable`, and `reading.js --share` would skip at the
 * close. Ten seconds of looking costs nothing and closes that window.
 */
function transcriptOf(sessionId) {
  for (let attempt = 0; attempt < TRANSCRIPT_POLL_TRIES; attempt++) {
    const found = findTranscript(sessionId);
    if (found) return found;
    sleepSync(TRANSCRIPT_POLL_MS);
  }
  return null;
```

**P3.15 →**

```js
 * result -- which `boundary.js record --seat` would then write into the
 * roster as `unavailable`, and `reading.js --share` would skip at the
 * close. Ten seconds of looking costs nothing and narrows that window; the
 * census looks again at every pass while the seat has none (spec 3.1).
 */
function transcriptOf(root, sessionId) {
  for (let attempt = 0; attempt < TRANSCRIPT_POLL_TRIES; attempt++) {
    const found = findTranscript(sessionId);
    if (found) return found;
    pause(root, TRANSCRIPT_POLL_MS);
  }
  return null;
```

**P3.16** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
    const fresh = listing.sessions.find((s) => s.sessionId && !before.has(s.sessionId));
    if (fresh) return fresh;
    sleepSync(SPAWN_POLL_MS);
  }
  return null;
```

**P3.16 →**

```js
    const fresh = listing.sessions.find((s) => s.sessionId && !before.has(s.sessionId));
    if (fresh) return fresh;
    pause(root, SPAWN_POLL_MS);
  }
  return null;
```

**P3.17** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
    const found = listing.sessions.find((s) => s.sessionId === sessionId && s.pid);
    if (found) return found;
    sleepSync(SPAWN_POLL_MS);
  }
  return null;
```

**P3.17 →**

```js
    const found = listing.sessions.find((s) => s.sessionId === sessionId && s.pid);
    if (found) return found;
    pause(root, SPAWN_POLL_MS);
  }
  return null;
```

**P3.18** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
  const id = session.id || shortIdOf(got.out);
  const startedAt = formatStartedAt(session.startedAt);
  const seat = {
    sessionId: session.sessionId,
```

**P3.18 →**

```js
  const id = session.id || shortIdOf(got.out);
  const startedAt = formatStartedAt(session.startedAt);
  // The epoch value beside the formatted one, for the census's first-turn
  // budget (spec 3.2); absent when the listing gave no number.
  const startedAtMs = typeof session.startedAt === "number" ? session.startedAt : undefined;
  const seat = {
    sessionId: session.sessionId,
```

**P3.19** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
    cwd: session.cwd,
    startedAt,
    status: stray ? "stopped" : "running",
    ...(stray ? { strayed: session.cwd } : {}),
```

**P3.19 →**

```js
    cwd: session.cwd,
    startedAt,
    startedAtMs,
    status: stray ? "stopped" : "running",
    ...(stray ? { strayed: session.cwd } : {}),
```

**P3.20** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
    return { error: `ad hoc worktree ${session.cwd}` };
  }
  return {
    id,
```

**P3.20 →**

```js
    return { error: `ad hoc worktree ${session.cwd}` };
  }
  // The seat carries its transcript too (spec 3.2): null when the poll
  // missed it, which the census fills later.
  seat.transcript = transcriptOf(root, session.sessionId);
  return {
    id,
```

**P3.21** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
    name: session.name,
    cwd: session.cwd,
    transcript: transcriptOf(session.sessionId),
    startedAt,
  };
```

**P3.21 →**

```js
    name: session.name,
    cwd: session.cwd,
    transcript: seat.transcript,
    startedAt,
  };
```

**P3.22** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
    }
    let outcome;
    try {
      outcome = handleRequest(root, request, seats);
```

**P3.22 →**

```js
    }
    let outcome;
    // A beat before and after every request (spec 4.1): a spawn or a resume
    // is the longest stretch the spawner works without returning here.
    beat(root);
    try {
      outcome = handleRequest(root, request, seats);
```

**P3.23** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
      outcome = { error: String(error?.message) };
    }
    writeJsonAtomic(path.join(resultsDir(root), name), { ...request, ...outcome });
    fs.rmSync(file, { force: true });
```

**P3.23 →**

```js
      outcome = { error: String(error?.message) };
    }
    beat(root);
    writeJsonAtomic(path.join(resultsDir(root), name), { ...request, ...outcome });
    fs.rmSync(file, { force: true });
```

**P3.24** `skills/tanto/scripts/spawner.js` — replace exactly these 4 lines

```js
}

/** One `running` or `blocked` seat against the listing's entry for it. */
function censusSeat(root, seat, session) {
```

**P3.24 →**

```js
}

/**
 * Look once for a seat's transcript while `seats.json` holds none (spec 3.1):
 * the spawn's ten-second poll can miss it, and the path that reaches the
 * seat here is what `record --seat` and the roster's Transcript column read
 * next. A mark of no first turn that the transcript answers is cleared.
 * Returns whether the seat has a transcript now.
 */
function lookForTranscript(root, seat) {
  if (seat.transcript) return true;
  const found = findTranscript(seat.sessionId);
  if (!found) return false;
  seat.transcript = found;
  if (seat.noFirstTurn) {
    delete seat.noFirstTurn;
    appendLog(root, `census: ${seat.sessionId} first turn`);
  }
  return true;
}

/**
 * A seat that has run no first turn (spec 3.1): marked once, with one toast
 * and one log line, and never stopped — the one cause the design knows is
 * closed at the spawn, and what reaches here is for the human to look at. A
 * seat with no `startedAtMs`, one from before this rule, is never judged.
 */
function noFirstTurn(root, seat, line) {
  if (seat.noFirstTurn || typeof seat.startedAtMs !== "number") return false;
  seat.noFirstTurn = stamp();
  const where = seat.id ? ` — claude attach ${seat.id}` : "";
  raiseNotice(`no first turn: ${seat.role} ${seat.topic} ${seat.name}${where}`);
  appendLog(root, line);
  return true;
}

/** One `running` or `blocked` seat against the listing's entry for it. */
function censusSeat(root, seat, session) {
```

**P3.25** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
    seat.status = "gone";
    seat.goneAt = stamp();
    appendLog(root, `census: ${seat.sessionId} gone`);
    return;
  }
```

**P3.25 →**

```js
    seat.status = "gone";
    seat.goneAt = stamp();
    // Gone with no transcript: a session that never ran a turn and did not
    // stay — listed with no pid, so absent here at its first pass, before
    // the budget below could see it.
    const marked =
      !lookForTranscript(root, seat) && noFirstTurn(root, seat, `census: ${seat.sessionId} gone — no first turn`);
    if (!marked) appendLog(root, `census: ${seat.sessionId} gone`);
    return;
  }
```

**P3.26** `skills/tanto/scripts/spawner.js` — replace exactly these 8 lines

```js
    seat.status = "running";
  }
}

/** The spawner's census: one pass over `seats.json` against the listing. */
function runCensus(root, seats) {
  const listing = listAgents(root);
  if (listing.error) {
```

**P3.26 →**

```js
    seat.status = "running";
  }
  if (lookForTranscript(root, seat)) return;
  if (nowMs() - seat.startedAtMs >= FIRST_TURN_WAIT_MS) {
    noFirstTurn(root, seat, `census: ${seat.sessionId} no first turn after 2m`);
  }
}

/** The spawner's census: one pass over `seats.json` against the listing. */
function runCensus(root, seats) {
  beat(root);
  const listing = listAgents(root);
  if (listing.error) {
```

**P3.27** `skills/tanto/scripts/spawner.js` — replace exactly these 9 lines

```js
  // the workspace root, never wherever the spawner itself was started from
  // (Critical 1, branch-review.md): `spawnSync` with no `cwd` inherits this
  // process's own, so fixing it here once covers `runClaude`'s every caller.
  process.chdir(root);
  ensureDirs(root);
  fs.writeFileSync(path.join(spawnerDir(root), "pid"), `${process.pid}\n`);
  const pass = guarded(root, () => {
    const seats = readSeats(root);
    takeRequests(root, seats);
```

**P3.27 →**

```js
  // the workspace root, never wherever the spawner itself was started from
  // (Critical 1, branch-review.md): `spawnSync` with no `cwd` inherits this
  // process's own, so fixing it here once covers `runClaude`'s every caller
  // but a worktree seat's spawn, which names its own (spec 2.2).
  process.chdir(root);
  ensureDirs(root);
  fs.writeFileSync(path.join(spawnerDir(root), "pid"), `${process.pid}\n`);
  const pass = guarded(root, () => {
    beat(root);
    const seats = readSeats(root);
    takeRequests(root, seats);
```

**P3.28** `skills/tanto/scripts/spawner.js` — replace exactly these 6 lines

```js
  // The two intervals below and the watch callback never interleave a
  // read-modify-write of `seats.json`, because `sleepSync`'s `Atomics.wait`
  // — used by the transcript poll and by `findNew`/`findResumed` — blocks
  // this event loop for up to ~40 s per spawn or resume. Making any of those
  // polls async needs one shared array between the loops first (Minor 17,
  // branch-review.md).
```

**P3.28 →**

```js
  // The two intervals below and the watch callback never interleave a
  // read-modify-write of `seats.json`, because `sleepSync`'s `Atomics.wait`
  // — used by the transcript poll and by `findNew`/`findResumed`, through
  // `pause`, which beats first — blocks this event loop for up to about a
  // minute per spawn or resume (M-6). Making any of those
  // polls async needs one shared array between the loops first (Minor 17,
  // branch-review.md).
```

**P3.29** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
}

module.exports = { main, noticeCommand, handleRequest, runCensus, readSeats, spawnerDir, seatName, shortIdOf };

if (require.main === module) {
```

**P3.29 →**

```js
}

module.exports = {
  main,
  noticeCommand,
  handleRequest,
  runCensus,
  readSeats,
  spawnerDir,
  seatName,
  shortIdOf,
  // For the launcher (`tanto.js`): the listing's key, the log, and the heartbeat.
  underRoot,
  appendLog,
  heartbeatPath,
  HEARTBEAT_STALE_MS,
};

if (require.main === module) {
```

- [ ] **Step 4: Run the two suites that read the spawner to verify they pass**

```bash
node --test skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js
```

Expected: every test passes — "the census revives a gone seat …" among
them with its one toast.

- [ ] **Step 5: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --task 3
```

Expected: `task 3: verify clean`.

- [ ] **Step 6: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js
git commit --only -m "feat: the spawner marks a seat with no first turn after two minutes, and beats a heartbeat" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js
```

Expected: lint passes with no file changed; one commit.

### Task 4: The launcher trusts a heartbeat, not a PID, and keys the listing on its `cwd`

Spec 4.2, 4.3's launcher tests, D-6, and 2.3's launcher half. `livePid`
becomes `liveSpawner(root)`: the recorded PID answers
`process.kill(pid, 0)` and the heartbeat is within `HEARTBEAT_STALE_MS` of
now. `startSpawner` on a live PID behind a stale or missing heartbeat logs
`stale spawner pid <n> ignored`, signals nothing, and starts a spawner, and
waits for `liveSpawner`. `cmdDown` on a live PID with no heartbeat file at
all removes `pid`, prints the `has no heartbeat` line naming the PID to end
by hand, and signals nothing; on a stale heartbeat it removes `pid` and
`heartbeat`, prints `no spawner running`, and signals nothing; on a fresh
one it SIGTERMs, waits for the PID to end, and removes both files. The
launcher's `listAgents` lists with no `--cwd` and keeps the entries under
the root through the spawner's `underRoot`. The listing fixtures came with
Task 2.

**Files:**

- Modify: `skills/tanto/scripts/tanto.js` — the `spawner.js` import,
  `listAgents` and its comment, `recordedPid`, `pidAlive`, `heartbeatMs`,
  `liveSpawner`, and `removeSpawnerFiles` in `livePid`'s place,
  `startSpawner`, and `cmdDown`'s end.
- Test: `skills/tanto/scripts/tanto.test.js` — the `child_process` import,
  `strangerPid`, `alive`, and four new tests at the end.

**Interfaces:**

- Consumes: Task 3's exports `underRoot`, `appendLog`, `heartbeatPath`,
  and `HEARTBEAT_STALE_MS`; the heartbeat file the spawner writes at its
  first pass.
- Produces: `tanto` and `tanto down` read `.tanto/spawner/heartbeat`;
  `tanto down` prints exactly one of `no spawner running`,
  `spawner pid <n> has no heartbeat — a spawner from before the heartbeat, or a reused pid; end it by hand if it is the spawner: taskkill /PID <n> (kill <n>)`,
  or `tanto down: spawner stopped; the conversations are kept`. These are
  the lines Global Constraints' first fact has Kanri ask the human to act
  on.

**Named-mechanism sites.** The heartbeat and its sixty seconds are also
`spawner.js`'s `beat`, `pause`, and `HEARTBEAT_STALE_MS` (Task 3),
`SKILL.md`'s Artifacts row and its `scripts/tanto.js` sentence (Task 6), and
the README's `tanto down` paragraph (Task 9). The tests use a sleeping child
as the stranger PID rather than the test's own PID, which spec 4.3 names: a
launcher that regressed into signalling it would otherwise end the test
runner itself; the property tested — the stranger is still alive — is the
spec's.

**O4.1** `--json --cwd <root>` — the launcher's `listAgents` comment (spec 2.3); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0, and 0 over `skills/tanto/scripts/` with O2.1.

**O4.2** `"--cwd", root` — the launcher's listing argument (spec 2.3); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0, and 0 over `skills/tanto/scripts/` with O2.2.

**O4.3** `return { sessions, error: null };` — the launcher's unfiltered listing (spec 2.3); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

**O4.4** `livePid` — `process.kill(pid, 0)` as the whole test of a running spawner, at its definition and its four callers (spec 4.2); before: 5 lines in `skills/tanto/scripts/tanto.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P4.5 to P4.6.

**P4.5** `skills/tanto/scripts/tanto.test.js` — replace exactly these 5 lines

```js
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const LAUNCHER = path.join(__dirname, "tanto.js");
```

**P4.5 →**

```js
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

const LAUNCHER = path.join(__dirname, "tanto.js");
```

**P4.6** `skills/tanto/scripts/tanto.test.js` — replace exactly these 2 lines

```js
  assert.equal(fs.readFileSync(file, "utf8"), "{ not json");
});
```

**P4.6 →**

```js
  assert.equal(fs.readFileSync(file, "utf8"), "{ not json");
});

/**
 * A live process that is no spawner, recorded in the workspace's `pid` file
 * (spec 4.3). A sleeping child the test ends itself stands for the PID a
 * crashed spawner left behind: a launcher that signalled it would end this
 * child, never the test's own process.
 */
function strangerPid(ws, heartbeat) {
  const child = spawn(process.execPath, ["-e", "setTimeout(() => {}, 120000)"], {
    stdio: "ignore",
    windowsHide: true,
  });
  const dir = path.join(ws.root, ".tanto", "spawner");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "pid"), `${child.pid}\n`);
  if (heartbeat !== undefined) fs.writeFileSync(path.join(dir, "heartbeat"), `${heartbeat}\n`);
  return child;
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

test("a live pid with no heartbeat is not trusted: tanto starts a spawner and logs the stale pid (spec 4.2)", () => {
  const ws = workspace();
  const child = strangerPid(ws);
  try {
    const got = launch(ws, [ws.root, "--timeout", "20000"]);
    assert.equal(got.code, 0, got.err);
    assert.match(got.out, /claude attach bg01/);
    const dir = path.join(ws.root, ".tanto", "spawner");
    assert.ok(fs.readFileSync(path.join(dir, "log"), "utf8").includes(`stale spawner pid ${child.pid} ignored`));
    assert.notEqual(Number(fs.readFileSync(path.join(dir, "pid"), "utf8").trim()), child.pid);
    assert.equal(alive(child.pid), true);
  } finally {
    child.kill();
  }
});

test("a live pid with a heartbeat of now is a running spawner: tanto starts none (spec 4.2)", () => {
  const ws = workspace();
  const child = strangerPid(ws, Date.now());
  const dir = path.join(ws.root, ".tanto", "spawner");
  try {
    // No spawner answers the Kanri request, so the launcher waits out its
    // timeout; what matters is that it started nothing.
    launch(ws, [ws.root, "--timeout", "1000"]);
    assert.equal(Number(fs.readFileSync(path.join(dir, "pid"), "utf8").trim()), child.pid);
    assert.equal(fs.existsSync(path.join(dir, "log")), false);
  } finally {
    child.kill();
    fs.rmSync(path.join(dir, "pid"), { force: true });
    fs.rmSync(path.join(dir, "heartbeat"), { force: true });
  }
});

test("down with a stale heartbeat removes pid and heartbeat and signals nothing (spec 4.2)", () => {
  const ws = workspace();
  const child = strangerPid(ws, Date.now() - 120000);
  const dir = path.join(ws.root, ".tanto", "spawner");
  try {
    const got = launch(ws, ["down", ws.root]);
    assert.equal(got.code, 0, got.err);
    assert.equal(got.out.trim(), "no spawner running");
    assert.equal(fs.existsSync(path.join(dir, "pid")), false);
    assert.equal(fs.existsSync(path.join(dir, "heartbeat")), false);
    assert.equal(alive(child.pid), true);
  } finally {
    child.kill();
  }
});

test("down with a live pid and no heartbeat file names the pid to end by hand and signals nothing (D-6)", () => {
  const ws = workspace();
  const child = strangerPid(ws);
  const dir = path.join(ws.root, ".tanto", "spawner");
  try {
    const got = launch(ws, ["down", ws.root]);
    assert.equal(got.code, 0, got.err);
    assert.equal(
      got.out.trim(),
      `spawner pid ${child.pid} has no heartbeat — a spawner from before the heartbeat, or a reused pid; end it by hand if it is the spawner: taskkill /PID ${child.pid} (kill ${child.pid})`,
    );
    assert.equal(fs.existsSync(path.join(dir, "pid")), false);
    assert.equal(alive(child.pid), true);
  } finally {
    child.kill();
  }
});
```

- [ ] **Step 2: Run the four new tests to verify they fail**

```bash
node --test --test-name-pattern "is not trusted|heartbeat of now|stale heartbeat removes|names the pid to end by hand" skills/tanto/scripts/tanto.test.js
```

Expected: three failures and one pass — the stranger PID is taken for a
running spawner, so no spawner starts and the Kanri request waits out its
timeout; `down` signals the stranger, which is gone afterwards, and prints
`tanto down: spawner stopped …`. "a heartbeat of now" passes already: the
old launcher starts none either.

- [ ] **Step 3: Write `liveSpawner` and the listing's key**

Apply P4.7 to P4.15.

**P4.7** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
const { loadSessions } = require("./reading.js");
const { readSeats, spawnerDir } = require("./spawner.js");

```

**P4.7 →**

```js
const { loadSessions } = require("./reading.js");
const { readSeats, spawnerDir, underRoot, appendLog, heartbeatPath, HEARTBEAT_STALE_MS } = require("./spawner.js");

```

**P4.8** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
/**
 * `claude agents --json --cwd <root>`, parsed. `sessions` is `null` on a
 * non-zero exit or unparseable output, never `[]` — a real empty listing and
```

**P4.8 →**

```js
/**
 * `claude agents --json`, parsed, keeping the entries whose listed `cwd` is
 * the root or under it — the spawner's own key (`underRoot`, spec 2.3), so
 * that `tanto` never writes a `resume` for a live seat, shoki's in its
 * worktree above all, that it failed to list. `sessions` is `null` on a
 * non-zero exit or unparseable output, never `[]` — a real empty listing and
```

**P4.9** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
function listAgents(root) {
  const command = claudeCommand(["agents", "--json", "--cwd", root]);
  const got = spawnSync(command.file, command.args, { encoding: "utf8", windowsHide: true });
```

**P4.9 →**

```js
function listAgents(root) {
  const command = claudeCommand(["agents", "--json"]);
  const got = spawnSync(command.file, command.args, { encoding: "utf8", windowsHide: true });
```

**P4.10** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
    const sessions = Array.isArray(parsed) ? parsed : Array.isArray(parsed.sessions) ? parsed.sessions : [];
    return { sessions, error: null };
  } catch {
```

**P4.10 →**

```js
    const sessions = Array.isArray(parsed) ? parsed : Array.isArray(parsed.sessions) ? parsed.sessions : [];
    return { sessions: sessions.filter((s) => underRoot(root, s?.cwd)), error: null };
  } catch {
```

**P4.11** `skills/tanto/scripts/tanto.js` — replace exactly these 15 lines

```js

function livePid(root) {
  const text = (() => {
    try {
      return fs.readFileSync(pidPath(root), "utf8");
    } catch {
      return "";
    }
  })();
  const pid = Number(text.trim());
  if (!pid) return null;
  try {
    process.kill(pid, 0);
    return pid;
  } catch {
```

**P4.11 →**

```js

/** The PID `.tanto/spawner/pid` records, or null. */
function recordedPid(root) {
  try {
    return Number(fs.readFileSync(pidPath(root), "utf8").trim()) || null;
  } catch {
```

**P4.12** `skills/tanto/scripts/tanto.js` — replace exactly these 4 lines

```js

function startSpawner(root) {
  if (livePid(root)) return false;
  const log = fs.openSync(path.join(spawnerDir(root), "log"), "a");
```

**P4.12 →**

```js

function pidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** The heartbeat's epoch milliseconds — `NaN` when it does not parse — or null when there is no file. */
function heartbeatMs(root) {
  try {
    return Number(fs.readFileSync(heartbeatPath(root), "utf8").trim());
  } catch {
    return null;
  }
}

/**
 * The PID of a spawner that is alive and working, or null (spec 4.2): the
 * PID in `pid` answers `process.kill(pid, 0)` and the heartbeat is within
 * `HEARTBEAT_STALE_MS` of now. A PID alone proves nothing — a spawner that
 * died leaves its file, and the system gives the number to another process
 * (issue-73d6) — and a missing heartbeat, a spawner on the code before it,
 * reads as stale.
 */
function liveSpawner(root) {
  const pid = recordedPid(root);
  if (!pid || !pidAlive(pid)) return null;
  const beat = heartbeatMs(root);
  return beat !== null && Math.abs(Date.now() - beat) <= HEARTBEAT_STALE_MS ? pid : null;
}

function removeSpawnerFiles(root) {
  for (const file of [pidPath(root), heartbeatPath(root)]) {
    try {
      fs.rmSync(file, { force: true });
    } catch {
      // Nothing to remove is the ordinary case here.
    }
  }
}

function startSpawner(root) {
  if (liveSpawner(root)) return false;
  // A live PID behind a stale heartbeat is never signalled: it may be any
  // process by now (spec 4.2, D-4). A real spawner left so runs beside the
  // new one until the next `tanto down`; both take requests by rename, so
  // none is handled twice.
  const stale = recordedPid(root);
  if (stale && pidAlive(stale)) appendLog(root, `stale spawner pid ${stale} ignored`);
  const log = fs.openSync(path.join(spawnerDir(root), "log"), "a");
```

**P4.13** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
  child.unref();
  for (let i = 0; i < 40 && !livePid(root); i++) sleepSync(POLL_MS);
  return true;
```

**P4.13 →**

```js
  child.unref();
  // The new spawner satisfies this at its first pass, which beats first.
  for (let i = 0; i < 40 && !liveSpawner(root); i++) sleepSync(POLL_MS);
  return true;
```

**P4.14** `skills/tanto/scripts/tanto.js` — replace exactly these 10 lines

```js

  const pid = livePid(root);
  if (!pid) {
    process.stdout.write("no spawner running\n");
    try {
      fs.rmSync(pidPath(root), { force: true });
    } catch {
      // Nothing to remove is the ordinary case here.
    }
    return seatsFailed ? 1 : 0;
```

**P4.14 →**

```js

  // Only a spawner that beats is signalled (spec 4.2). A live PID with no
  // heartbeat file at all is a spawner from before the heartbeat or a reused
  // PID, which the human at the terminal tells apart (D-6); one behind a
  // stale heartbeat is no spawner of this run's.
  const pid = recordedPid(root);
  if (pid && pidAlive(pid) && heartbeatMs(root) === null) {
    fs.rmSync(pidPath(root), { force: true });
    process.stdout.write(
      `spawner pid ${pid} has no heartbeat — a spawner from before the heartbeat, or a reused pid; end it by hand if it is the spawner: taskkill /PID ${pid} (kill ${pid})\n`,
    );
    return seatsFailed ? 1 : 0;
  }
  if (!liveSpawner(root)) {
    process.stdout.write("no spawner running\n");
    removeSpawnerFiles(root);
    return seatsFailed ? 1 : 0;
```

**P4.15** `skills/tanto/scripts/tanto.js` — replace exactly these 4 lines

```js
  }
  for (let i = 0; i < 40 && livePid(root); i++) sleepSync(POLL_MS);
  fs.rmSync(pidPath(root), { force: true });
  process.stdout.write("tanto down: spawner stopped; the conversations are kept\n");
```

**P4.15 →**

```js
  }
  for (let i = 0; i < 40 && pidAlive(pid); i++) sleepSync(POLL_MS);
  removeSpawnerFiles(root);
  process.stdout.write("tanto down: spawner stopped; the conversations are kept\n");
```

- [ ] **Step 4: Run the launcher's suite and the spawner's to verify they pass**

```bash
node --test skills/tanto/scripts/tanto.test.js skills/tanto/scripts/spawner.test.js
```

Expected: every test passes; teardown's `tanto down` stops every spawner
the suite started, since each beats.

- [ ] **Step 5: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --task 4
```

Expected: `task 4: verify clean`.

- [ ] **Step 6: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
git commit --only -m "fix: the launcher trusts a spawner's heartbeat, not its PID, and keys the listing on its cwd under the root" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js
```

Expected: lint passes with no file changed; one commit.

### Task 5: `boundary.js census` prints a seat's `blocked` state and its no-first-turn mark

Spec 3.3 and its `boundary.test.js` case, and 5.2's census half. `cmdCensus`
reads `<root>/.tanto/spawner/seats.json` when it exists — absent or
unparsable, nothing changes — and appends ` — no first turn since <stamp>`
to the Listed or Not listed line of a seat carrying `noFirstTurn`; the
Listed line also gains ` — blocked` when the listing's `state` is
`blocked`, before the first-turn suffix. The census still writes nothing.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — `firstTurnMarks` before
  `CENSUS_HEADINGS`, and `cmdCensus`'s Not listed and Listed lines.
- Test: `skills/tanto/scripts/boundary.test.js` — one new test at the end.

**Interfaces:**

- Consumes: Task 3's `noFirstTurn: <YYYY-MM-DD HH:MM>` on a seat of
  `seats.json`.
- Produces: a Listed line
  `<role> <topic> <name> — <sessionId> — listed as <name> (<kind>)[ — renamed][ — blocked][ — no first turn since <stamp>]`,
  and a Not listed line
  `<role> <topic> <name> — <sessionId>[ — listed without a pid (a stale entry)][ — no first turn since <stamp>]`,
  which `roles/kanri.md`'s census bullets read (Task 8).

**Named-mechanism sites.** ` — blocked` is also `SKILL.md`'s Status words
(Task 6), `templates/roster.md`'s Status paragraph (Task 7), and
`roles/kanri.md`'s census bullet (Task 8). ` — no first turn since` is also
`roles/kanri.md`'s census bullet (Task 8); the mark itself is the
spawner's (Task 3). `SKILL.md`'s **The census.** paragraph and
`roles/kanri.md`'s name the Listed heading and the stale-entry note,
unchanged.

**O5.1** `(${session.kind})${renamed}` — the Listed line that ended at its rename mark, with no room for the two suffixes; before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

- [ ] **Step 1: Write the failing test**

Apply P5.2.

**P5.2** `skills/tanto/scripts/boundary.test.js` — replace exactly these 2 lines

```js
  assert.ok(result.out.includes("kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (interactive)"), result.out);
});
```

**P5.2 →**

```js
  assert.ok(result.out.includes("kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (interactive)"), result.out);
});

test("census reads seats.json beside the roster: a blocked seat's line and a marked seat's line carry their suffixes (spec 3.3)", () => {
  const f = censusFixture(
    [
      KANRI_ROW,
      sessionRow("jisso", "t", "jisso-h", "live", "/home/u/.claude/projects/p/sess-jisso.jsonl"),
      sessionRow("shoki", "t", "shoki-i", "live", "/home/u/.claude/projects/p/sess-shoki.jsonl"),
    ],
    (root) => [
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111, state: "blocked" },
      { sessionId: "sess-jisso", name: "jisso-h", kind: "background", cwd: root, pid: 1112, state: "blocked" },
    ],
  );
  fs.mkdirSync(path.join(f.root, ".tanto", "spawner"), { recursive: true });
  const seats = [
    { sessionId: "sess-jisso", status: "blocked", noFirstTurn: "2026-10-03 10:02" },
    { sessionId: "sess-shoki", status: "gone", noFirstTurn: "2026-10-03 10:05" },
  ];
  fs.writeFileSync(path.join(f.root, ".tanto", "spawner", "seats.json"), JSON.stringify({ seats }));
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.ok(
    result.out.includes(
      [
        "\n## Listed\n",
        "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background) — blocked",
        "jisso t jisso-h — sess-jisso — listed as jisso-h (background) — blocked — no first turn since 2026-10-03 10:02",
        "",
      ].join("\n"),
    ),
    result.out,
  );
  assert.ok(
    result.out.includes("\n## Not listed\n\nshoki t shoki-i — sess-shoki — no first turn since 2026-10-03 10:05\n"),
    result.out,
  );
});
```

- [ ] **Step 2: Run the new test to verify it fails**

```bash
node --test --test-name-pattern "census reads seats.json" skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — the Listed lines carry neither suffix, and the Not listed
line no mark.

- [ ] **Step 3: Read the marks and print the suffixes**

Apply P5.3 to P5.6.

**P5.3** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js

/** The four headings `census` prints, in order. */
```

**P5.3 →**

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
```

**P5.4** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
  const stale = new Set(all.filter((s) => s?.sessionId && !s.pid).map((s) => s.sessionId));

```

**P5.4 →**

```js
  const stale = new Set(all.filter((s) => s?.sessionId && !s.pid).map((s) => s.sessionId));
  // The spawner's mark on a seat with no first turn, on the seat's Listed or
  // Not listed line, so that Kanri, who sees no toast, reads it (spec 3.3).
  const marks = firstTurnMarks(root);
  const firstTurn = (sessionId) => (marks.has(sessionId) ? ` — no first turn since ${marks.get(sessionId)}` : "");

```

**P5.5** `skills/tanto/scripts/boundary.js` — replace exactly these 3 lines

```js
      const note = stale.has(sessionId) ? " — listed without a pid (a stale entry)" : "";
      out["Not listed"].push(`${role} ${topic} ${name} — ${sessionId}${note}`);
      continue;
```

**P5.5 →**

```js
      const note = stale.has(sessionId) ? " — listed without a pid (a stale entry)" : "";
      out["Not listed"].push(`${role} ${topic} ${name} — ${sessionId}${note}${firstTurn(sessionId)}`);
      continue;
```

**P5.6** `skills/tanto/scripts/boundary.js` — replace exactly these 3 lines

```js
    const renamed = session.name && session.name !== bare ? " — renamed" : "";
    out.Listed.push(`${role} ${topic} ${name} — ${sessionId} — listed as ${session.name} (${session.kind})${renamed}`);
  }
```

**P5.6 →**

```js
    const renamed = session.name && session.name !== bare ? " — renamed" : "";
    // The listing's `state`, for the roster's `live (blocked since <HH:MM>)`
    // (spec 5.2): the census names no cause, since the listing gives none.
    const blocked = session.state === "blocked" ? " — blocked" : "";
    const listedAs = `listed as ${session.name} (${session.kind})`;
    out.Listed.push(`${role} ${topic} ${name} — ${sessionId} — ${listedAs}${renamed}${blocked}${firstTurn(sessionId)}`);
  }
```

- [ ] **Step 4: Run the census's suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes; the census tests with no `seats.json` print
as before.

- [ ] **Step 5: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --task 5
```

Expected: `task 5: verify clean`.

- [ ] **Step 6: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
git commit --only -m "feat: boundary.js census prints a seat's blocked state and the spawner's no-first-turn mark" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed; one commit.

### Task 6: The contract names Kanri's worktree, the transcript's slug, the `blocked since` annotation, the notice, and the heartbeat

Spec section 6's `SKILL.md` entry, carrying 2.1, 3.1, 4.2, and 5.2 into the
contract. "Handshake and roster": `live` may carry `(blocked since <HH:MM>)`
beside `(idle since <HH:MM>)`, with 5.2's lag clause. "The transcript
reading": one sentence on the worktree slug. Artifacts: the worktree row's
writer is Kanri, by `git worktree add` in the merge act, and the
`.tanto/spawner/` row lists `heartbeat`. The `scripts/spawner.js`
paragraph: the notice list gains the seat with no first turn, and the
spawner keeps a heartbeat; the `scripts/tanto.js` sentence starts the
spawner when none beats, and `tanto down` stops the spawner that beats.
Workspace: shoki works in the worktree Kanri cuts.

**Files:**

- Modify: `skills/tanto/SKILL.md` — "Handshake and roster", "The transcript
  reading", Artifacts (two rows), the scripts paragraph, and Workspace.

**Interfaces:**

- Consumes: the scripts of batch A, whose behavior these sentences state.
- Produces: the contract's `live (blocked since <HH:MM>)`, which
  `templates/roster.md` (Task 7) and `roles/kanri.md` (Task 8) state in the
  same terms.

**Named-mechanism sites.** `(blocked since <HH:MM>)` is also
`templates/roster.md`'s Status paragraph (Task 7), `roles/kanri.md`'s census
bullet (Task 8), and `boundary.js census`'s ` — blocked` (Task 5); the
intake's address rule under "Messages" ("whose Status begins with `live`")
reads the cell's first word and is unchanged. Kanri's worktree is also
`templates/spawn-request.md`'s and `templates/shoki-brief.md`'s (Task 7),
`roles/kanri.md`'s merge act and Create row (Task 8), and the README's
"What it does" (Task 9); "Session exit"'s "a seat spawned into a worktree
with `--add-dir` to the main checkout" stays true and is unchanged. The
heartbeat is also `tanto.js` (Task 4) and the README (Task 9).

**O6.1** `the CLI, on ` — the Artifacts worktree row's writer, "the CLI, on `claude --bg -w`" (spec 2.1); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O6.2** `works in the CLI's own worktree` — Workspace (spec 2.1); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O6.3** `which may carry the suffix` — the Status words, with `(idle since <HH:MM>)` as the only suffix (spec 5.2); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O6.4** `starts the spawner, finds or asks for a Kanri, resumes` — the `scripts/tanto.js` sentence (spec 4.2); before: 1 in `skills/tanto/SKILL.md`, after: 0. `scripts/tanto.js`'s own header comment says "starts the spawner, finds or asks for a Kanri, puts back …", which this needle does not match and which stays: it is true of a launcher that starts one only when none beats.

**O6.5** `stops it all and` — "`tanto down [--seats]` stops it all" (spec 4.2); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O6.6** `, names each seat` — the spawner paragraph's list, which keeps `seats.json` and no heartbeat (spec 4.1); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O6.7** `strayed one, and on an` — the notice list without the seat with no first turn (spec 3.1); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O6.8** `never written by a role` — the worktree row's content, which Kanri now cuts (spec 2.1); before: 1 in `skills/tanto/SKILL.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P6.9 to P6.14.

**P6.9** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
words: `queued` a Jisso of a skill-editing plan waiting for its batch prompt;
`live`, which may carry the suffix `(idle since <HH:MM>)`; `stopped` a
terminal seat the spawner stopped on Kanri's request or the spawner's guard
```

**P6.9 →**

```markdown
words: `queued` a Jisso of a skill-editing plan waiting for its batch prompt;
`live`, which may carry one suffix: `(idle since <HH:MM>)`, or
`(blocked since <HH:MM>)`, which Kanri appends when the census's Listed line
for the seat carries `— blocked` and removes when a later census's does not —
the last census that saw the seat blocked, not its state now, and no cause,
since a permission prompt, a usage-limit pause, and a kessai wait all read
`blocked`; every reader tests the cell's first word; `stopped` a
terminal seat the spawner stopped on Kanri's request or the spawner's guard
```

**P6.10** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
`<config dir>/projects/<project slug>/<session id>.jsonl`, where the config
directory is `$CLAUDE_CONFIG_DIR` when set and `~/.claude` otherwise. Then,
with `T` the transcript path and `$TANTO` the skill's own directory, **both
set in the same tool call as the command**:

```

**P6.10 →**

```markdown
`<config dir>/projects/<project slug>/<session id>.jsonl`, where the config
directory is `$CLAUDE_CONFIG_DIR` when set and `~/.claude` otherwise. A
session whose cwd is a worktree under the repository — shoki's — writes its
transcript under the slug `<repo slug>--claude-worktrees-<name>`, the
harness's encoding of that cwd, and the spawner's `findTranscript` searches
every slug. Then, with `T` the transcript path and `$TANTO` the skill's own
directory, **both set in the same tool call as the command**:

```

**P6.11** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
| `<cwd>/.claude/agents/tanto-*.md`, and `<cwd>/.claude/agents/.gitignore` beside them | every role at its start, for the kinds whose effort the project file changes | the harness, at the next session start; git | the project-scope definitions, from the same template with its `<scope>` clause rendered; the `.gitignore` holds `tanto-*.md` and `.gitignore`, is written once and never overwritten |
| `.tanto/spawner/` — `pid`, `log`, `seats.json`, `requests/<id>.json`, `results/<id>.json` | the spawner, and Kanri for a request file | the launcher, Kanri | the spawner's own state: one seat entry per session it started, one request and one result per act. The roster is not here and the spawner never reads it |
| `.tanto/<topic>/spawner-results/` | Kanri, at the plan close | Kanri | the topic's result files, moved with the archive move |
```

**P6.11 →**

```markdown
| `<cwd>/.claude/agents/tanto-*.md`, and `<cwd>/.claude/agents/.gitignore` beside them | every role at its start, for the kinds whose effort the project file changes | the harness, at the next session start; git | the project-scope definitions, from the same template with its `<scope>` clause rendered; the `.gitignore` holds `tanto-*.md` and `.gitignore`, is written once and never overwritten |
| `.tanto/spawner/` — `pid`, `heartbeat`, `log`, `seats.json`, `requests/<id>.json`, `results/<id>.json` | the spawner, and Kanri for a request file | the launcher, Kanri | the spawner's own state: one seat entry per session it started, one request and one result per act, and the heartbeat — the epoch milliseconds of its last beat, which the launcher trusts over `pid`. The roster is not here and the spawner never reads it |
| `.tanto/<topic>/spawner-results/` | Kanri, at the plan close | Kanri | the topic's result files, moved with the archive move |
```

**P6.12** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
| `.tanto/<topic>/batch-shusei-prompt.md` | Kanri, from `templates/batch-prompt.md` | the shusei Jisso | the one-task fix batch of the close |
| `<root>/.claude/worktrees/shoki-<topic>` | the CLI, on `claude --bg -w` | shoki | shoki's worktree; never written by a role, removed by Kanri (`git worktree remove --force --force`) along with its branch, after the `rm` request |

```

**P6.12 →**

```markdown
| `.tanto/<topic>/batch-shusei-prompt.md` | Kanri, from `templates/batch-prompt.md` | the shusei Jisso | the one-task fix batch of the close |
| `<root>/.claude/worktrees/shoki-<topic>` | Kanri, by `git worktree add` in the merge act | shoki | shoki's worktree and its cwd, on the branch `worktree-shoki-<topic>` cut from `main`'s tip; the spawner runs the seat in it and passes no `-w`; removed by Kanri (`git worktree remove --force --force`) along with its branch, after the `rm` request, which leaves both |

```

**P6.13** `skills/tanto/SKILL.md` — replace exactly these 11 lines

```markdown
launcher and never by a session, which takes request files, writes result
files, keeps `seats.json`, names each seat it spawns, runs the spawner's
census of `claude agents --json` every fifteen seconds — which revives a
seat that returns to the listing and stops one that strays into
`.claude/worktrees/` — and raises a desktop notice on a blocked seat, on a
strayed one, and on an `attention` request; `spawner.js notify --stdin` is the one-shot an optional
harness hook may call. `scripts/tanto.js` is the human's one command — it
starts the spawner, finds or asks for a Kanri, resumes what a restart took,
and prints `claude attach <id>`; `tanto down [--seats]` stops it all and
keeps every conversation.
All five are Node with no dependencies, and all five have their tests
```

**P6.13 →**

```markdown
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
All five are Node with no dependencies, and all five have their tests
```

**P6.14** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
the tree in place and the human can watch it. The one exception is shoki, the
close's scribe, which works in the CLI's own worktree under
`.claude/worktrees/shoki-<topic>` and holds no runtime resource. Every batch
```

**P6.14 →**

```markdown
the tree in place and the human can watch it. The one exception is shoki, the
close's scribe, which works in the worktree Kanri cuts at
`.claude/worktrees/shoki-<topic>` and holds no runtime resource. Every batch
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --task 6
```

Expected: `task 6: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
git commit --only -m "docs: the contract names Kanri's worktree, the transcript's slug, live (blocked since), the no-first-turn notice, and the heartbeat" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/SKILL.md
```

Expected: lint passes with no file changed; one commit.

### Task 7: The spawn request, the shoki brief, and the roster template say what the scripts now do

Spec section 6's entries for `templates/spawn-request.md`,
`templates/shoki-brief.md`, and `templates/roster.md`. The request's
`worktree` bullet: a directory Kanri cut, the spawner's cwd, never `-w`, an
`error` when absent; the `prompt` bullet gains its position and reason; the
result paragraph: `rm`'s worktree only when `claude rm` printed one, an
exited session's `note: "already exited"`, the error text's stdout
fallback, and the spawn error `prompt not delivered` with the seat's
`undelivered` and `removed`. The brief's Worktree argument: cut by Kanri
from `main`'s tip, the rebase kept for what `main` gains meanwhile. The
roster's Status paragraph: the `(blocked since <HH:MM>)` suffix. None of
the three is a run-time template; `templates/boundary-brief.md`,
`templates/batch-prompt.md`, and `templates/kanri-handover.md` are not
touched. `markdownlint` ignores `skills/tanto/templates/**` by the
repository's own configuration, so the lint step below checks the hooks
that do apply (trailing whitespace, final newline, line endings).

**Files:**

- Modify: `skills/tanto/templates/spawn-request.md` — the `prompt` and
  `worktree` bullets, and the result paragraph.
- Modify: `skills/tanto/templates/shoki-brief.md` — the Worktree argument.
- Modify: `skills/tanto/templates/roster.md` — the Status paragraph.

**Interfaces:**

- Consumes: Tasks 1-5's results and fields; Task 6's contract sentences.
- Produces: the request schema and the result shapes Kanri writes and reads
  from the next run on; the brief's argument Kanri renders at the merge act
  (Task 8).

**Named-mechanism sites.** The `worktree` field and Kanri's cut are also
`SKILL.md`'s Artifacts row and Workspace (Task 6), `roles/kanri.md`'s merge
act, landing, and Create row (Task 8), and `spawner.js`'s `opSpawn`
(Task 2). `prompt not delivered`, `undelivered`, and `already exited` are
also `spawner.js` (Task 1). `(blocked since <HH:MM>)` is also `SKILL.md`'s
Status words (Task 6) and `roles/kanri.md`'s census bullet (Task 8). The
brief's step 4 and its report line, which name `git rebase main` and
`worktree-shoki-<topic>`, are unchanged.

**O7.1** `spawner passes it as` — the `worktree` bullet, "The spawner passes it as `-w`, and the worktree is the CLI's own, under `.claude/worktrees/`" (spec 2.2); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O7.2** `and the worktree it removed` — the result paragraph's `rm`, which named a worktree whatever `claude rm` printed (spec 2.4); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O7.3** `the command's stderr, and` — the error text as stderr alone (spec 5.1); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.

**O7.4** `the CLI's own, at` — the brief's Worktree argument (spec 2.1); before: 1 in `skills/tanto/templates/shoki-brief.md`, after: 0.

**O7.5** `whatever HEAD the CLI cut it from` — the same argument's rebase clause (spec 2.1); before: 1 in `skills/tanto/templates/shoki-brief.md`, after: 0.

**O7.6** `address rule reads, so a reader` — the roster's Status paragraph with `(idle since <HH:MM>)` as the only suffix (spec 5.2); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P7.7 to P7.8,
P7.9, and
P7.10.

**P7.7** `skills/tanto/templates/spawn-request.md` — replace exactly these 6 lines

```markdown
  A slash command in a `--bg` initial prompt invokes the skill, measured
  2026-09-21 against CLI 2.1.278; no other form is needed.
- `worktree` — shoki's `shoki-<topic>`, and absent for every other seat. The
  spawner passes it as `-w`, and the worktree is the CLI's own, under
  `.claude/worktrees/`.
- `addDir` — a list of directories, shoki's being the repository root, so
```

**P7.7 →**

```markdown
  A slash command in a `--bg` initial prompt invokes the skill, measured
  2026-09-21 against CLI 2.1.278; no other form is needed. The spawner puts
  the prompt after the fixed flags and before every `--add-dir`: that
  option is variadic, so a prompt after it is read as one more directory and
  the seat starts with no first turn.
- `worktree` — shoki's `shoki-<topic>`, and absent for every other seat: the
  name of the directory Kanri cut under `<root>/.claude/worktrees/` in the
  merge act. The spawner runs `claude --bg` with that directory as its cwd
  and never passes `-w`, and a directory that is not there is an `error`
  before `claude --bg` runs.
- `addDir` — a list of directories, shoki's being the repository root, so
```

**P7.8** `skills/tanto/templates/spawn-request.md` — replace exactly these 9 lines

```markdown
sighting carries it — `cwd`, `transcript`, and `startedAt`; `stop` adds
`stopped`; `rm` adds `removed` and the worktree it removed; `resume` adds
the `id` and the `name` under the same `sessionId`, the name the one the
spawn gave; `attention` adds `notified` and `channel`; `ack` adds `acked`.
An op that failed adds `error`, which carries the command's stderr, and
nothing else — except the ad hoc-worktree guard at a spawn's first
sighting, which also records the seat as `stopped`, with `strayed: <cwd>`,
before returning `error`. The same guard at a pass of the spawner's census
writes no result file at all: `strayed: <cwd>` beside the seat's `stopped`
```

**P7.8 →**

```markdown
sighting carries it — `cwd`, `transcript`, and `startedAt`; `stop` adds
`stopped`; `rm` adds `removed` and, when `claude rm` printed one, the
worktree it removed — never for shoki, whose worktree is Kanri's; `resume`
adds the `id` and the `name` under the same `sessionId`, the name the one
the spawn gave; `attention` adds `notified` and `channel`; `ack` adds
`acked`. A `stop` or `rm` whose session the CLI had already dropped —
`No job matching` — is not a failure: it adds `stopped` or `removed` and
`note: "already exited"`. An op that failed adds `error`, which carries the
command's stderr, or its stdout when the stderr is empty, and nothing
else, with two exceptions. A `spawn` whose `claude --bg` printed the CLI's idle note
`(idle — send a prompt to start)` returns
`error: "prompt not delivered: <that line>"`, and the seat, recorded with
`undelivered: <that line>`, is removed with `claude rm` and marked
`removed` — or kept `running`, for the census, when that `rm` fails. And
the ad hoc-worktree guard at a spawn's first sighting also records the seat
as `stopped`, with `strayed: <cwd>`, before returning `error`. The same guard at a pass of the spawner's census
writes no result file at all: `strayed: <cwd>` beside the seat's `stopped`
```

**P7.9** `skills/tanto/templates/shoki-brief.md` — replace exactly these 6 lines

```markdown
- Topic — <topic>
- Worktree — <the CLI's own, at <root>/.claude/worktrees/shoki-<topic>>, cut
  in the same act as Kanri's merge; your `git rebase main` (step 4) is what
  makes it carry this topic's product, whatever HEAD the CLI cut it from;
  your cwd
- Main checkout — <absolute path>, given to you with `--add-dir`; every
```

**P7.9 →**

```markdown
- Topic — <topic>
- Worktree — cut by Kanri from `main`'s tip in the same act as its merge, at
  <<root>/.claude/worktrees/shoki-<topic>>, on the branch
  `worktree-shoki-<topic>`; your `git rebase main` (step 4) picks up anything
  `main` gained while you wrote; your cwd
- Main checkout — <absolute path>, given to you with `--add-dir`; every
```

**P7.10** `skills/tanto/templates/roster.md` — replace exactly these 5 lines

```markdown
`(idle since <HH:MM>)`, which Kanri appends while a Kikaku, Hosa, or Kaiseki
idles and the intake's address rule reads, so a reader tests the cell's
first word, not the whole cell. `queued` is a Jisso of a skill-editing plan
waiting for its batch prompt, in spawn order. `stopped` is a terminal seat
the spawner stopped on Kanri's request or the spawner's guard stopped, its
```

**P7.10 →**

```markdown
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
```

- [ ] **Step 2: Run the suites that copy the roster template**

```bash
node --test skills/tanto/scripts/spawner.test.js skills/tanto/scripts/boundary.test.js
```

Expected: every test passes — "a spawn's startedAt reaches the roster's
Started cell in the same shape" and `boundary.test.js`'s record tests copy
`templates/roster.md`, whose table this task does not touch.

- [ ] **Step 3: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --task 7
```

Expected: `task 7: verify clean`.

- [ ] **Step 4: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/templates/spawn-request.md skills/tanto/templates/shoki-brief.md skills/tanto/templates/roster.md
git commit --only -m "docs: the spawn request, the shoki brief, and the roster template name Kanri's worktree, the lost prompt, an exited session, and live (blocked since)" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/templates/spawn-request.md skills/tanto/templates/shoki-brief.md skills/tanto/templates/roster.md
```

Expected: lint passes with no file changed; one commit.

### Task 8: Kanri cuts shoki's worktree in the merge act, removes the one it cut, and reads the census's two new suffixes

Spec 2.1, 2.4, 3.3, and 5.2 in `roles/kanri.md`. "Shusei, shoki, and the
landing": the merge act gains the `git worktree add` line before the
`spawn` request, with 2.1's removal of a stale worktree or branch of that
name and its hold when the removal fails, and the worktree cut from
`main`'s tip with the rebase kept; the landing removes "the worktree you
cut, which `claude rm` leaves" and "the branch `worktree-shoki-<topic>` you
cut". "Session lifecycle": two bullets of the census's list — the
`(blocked since <HH:MM>)` annotation with its lag clause, and the
`attention` request on `no first turn`. "Create": the merge row's shoki
`spawn` comes after `git worktree add`.

This plan's own close runs on this text (Global Constraints, the second
fact): Kanri re-reads "Shusei, shoki, and the landing" from disk before
the merge act.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — "Shusei, shoki, and the landing"
  (two paragraphs), "Session lifecycle"'s census list, and "Create"'s merge
  row.

**Interfaces:**

- Consumes: Task 2's worktree cwd and directory check; Task 5's census
  suffixes; Task 7's brief argument.
- Produces: Kanri's merge act and landing from the next close on, this
  plan's own included.

**Named-mechanism sites.** The `git worktree add` cut is also `SKILL.md`'s
Artifacts row and Workspace (Task 6), `templates/spawn-request.md`'s
`worktree` bullet and `templates/shoki-brief.md`'s Worktree argument
(Task 7), and the README (Task 9); in this file, "Shoroku" step 4's
"in its worktree" and "Where the commit lands"' `worktree-shoki-<topic>`
forms are unchanged and stay true. `(blocked since <HH:MM>)` is also
`SKILL.md`'s Status words (Task 6) and `templates/roster.md` (Task 7); this
file's batch-loop step that appends `(idle since <HH:MM>)` is unchanged.
`no first turn` is also `spawner.js` (Task 3) and `boundary.js` (Task 5).

**O8.1** `Whatever HEAD the CLI cuts` — the merge act's rebase sentence (spec 2.1); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.2** `leaves locked` — "the worktree `claude rm` leaves locked" (spec 2.4); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.3** `keeps, move shoki's` — "the branch `worktree-shoki-<topic>` that `claude rm` keeps" (spec 2.4); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.4** `for shoki, in the same act` — the Create row's shoki `spawn` with no cut before it (spec 2.1); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P8.5 to P8.8.

**P8.5** `skills/tanto/roles/kanri.md` — replace exactly these 11 lines

```markdown
**The merge is where shoki is spawned, never before it.** In the same act
as the merge, whichever form it took, write
`.tanto/<topic>/shoki-brief.md` from `templates/shoki-brief.md` and its
`spawn` request — `role: shoki`, `worktree: shoki-<topic>`,
`addDir: [<root>]`, `sessions.shoki`'s family and effort, mode `auto`, the
prompt the one line `brief: <that path>`. Whatever HEAD the CLI cuts that
worktree from, shoki's own `git rebase main` is what lands the product's
fixes before the records rather than after them. Started in the same
act as shusei's own request it would race that batch, put the records on
`main` first, and leave a rebase you never re-run.

```

**P8.5 →**

````markdown
**The merge is where shoki is spawned, never before it.** In the same act
as the merge, whichever form it took, cut shoki's worktree from `main`'s
tip, from the shared checkout whatever branch it is on:

```console
git worktree add <root>/.claude/worktrees/shoki-<topic> -b worktree-shoki-<topic> main
```

`git worktree add -b` refuses an existing branch and a non-empty existing
directory, which a close that crashed before its landing leaves behind, so
first remove a worktree or a branch of that name when one exists, as the
landing below removes them (`git worktree remove --force --force`,
`git branch -D`); when that removal fails, hold the merge act and tell the
human in one line. Then write `.tanto/<topic>/shoki-brief.md` from
`templates/shoki-brief.md` and its `spawn` request — `role: shoki`,
`worktree: shoki-<topic>`, `addDir: [<root>]`, `sessions.shoki`'s family and
effort, mode `auto`, the prompt the one line `brief: <that path>`. The
spawner runs the seat with that directory as its cwd, never with `-w`, so
the seat is not worktree-isolated and its writes into the main checkout go
through. The worktree is cut from `main`'s tip, which already carries the
product's fixes, so shoki's own `git rebase main` is a no-op unless `main`
moved while it wrote — and it stays in the brief, because `main` may have.
Started in the same act as shusei's own request it would race that batch,
put the records on `main` first, and leave a rebase you never re-run.

````

**P8.6** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
transcript is not promised to survive `claude rm`, and taking the reading
first costs nothing where it does survive. Then remove the worktree
`claude rm` leaves locked — `git worktree remove --force --force
<root>/.claude/worktrees/shoki-<topic>` — and delete the branch
`worktree-shoki-<topic>` that `claude rm` keeps, move shoki's result file to
`.tanto/<topic>/spawner-results/`, mark the `S-n` rows written, and write
```

**P8.6 →**

```markdown
transcript is not promised to survive `claude rm`, and taking the reading
first costs nothing where it does survive. Then remove the worktree you
cut, which `claude rm` leaves — `git worktree remove --force --force
<root>/.claude/worktrees/shoki-<topic>` — and delete the branch
`worktree-shoki-<topic>` you cut, move shoki's result file to
`.tanto/<topic>/spawner-results/`, mark the `S-n` rows written, and write
```

**P8.7** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
  spawner's `renamed` mark with an `ack` request.
- **Not held** — nothing to the human. A session becomes the run's through
```

**P8.7 →**

```markdown
  spawner's `renamed` mark with an `ack` request.
- **Listed**, carrying `— blocked` — append `(blocked since <HH:MM>)`, this
  census's time, to the row's `live` cell unless it carries one, and remove
  it at a later census whose Listed line for that seat does not carry
  `— blocked`. The suffix records the last census that saw the seat
  blocked, not its state now: you run the census at the moments above, so
  the cell can lag the seat by a batch, where `idle since` is written on the
  seat's own report and does not. It names no cause — a permission prompt,
  a usage-limit pause, and a seat idling on a kessai all read `blocked` —
  and every reader tests the cell's first word.
- **Listed** or **Not listed**, carrying `— no first turn since <stamp>` —
  the spawner found no transcript for that seat two minutes after its spawn,
  or saw it gone with none. Write one `attention` request whose message is
  `no first turn: <role> <topic> — claude attach <id>`, once per seat, since
  you see no toast and the human may have missed the spawner's; the seat is
  not stopped.
- **Not held** — nothing to the human. A session becomes the run's through
```

**P8.8** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
| the kessai is answered | one `spawn` for the shusei batch, when the direction accepted a `fix` group | `/tanto jisso batch=<path>` |
| the merge lands | one `spawn` for shoki, in the same act as the merge and never before it | `brief: <path>` |
| a handover is due | one `spawn` for your successor | `/tanto kanri` |
```

**P8.8 →**

```markdown
| the kessai is answered | one `spawn` for the shusei batch, when the direction accepted a `fix` group | `/tanto jisso batch=<path>` |
| the merge lands | one `spawn` for shoki, after `git worktree add` cuts its worktree, in the same act as the merge and never before it | `brief: <path>` |
| a handover is due | one `spawn` for your successor | `/tanto kanri` |
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --task 8
```

Expected: `task 8: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
git commit --only -m "docs: Kanri cuts shoki's worktree in the merge act, removes the one it cut, and acts on the census's blocked and no-first-turn lines" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/roles/kanri.md
```

Expected: lint passes with no file changed; one commit.

### Task 9: The README says who cuts shoki's worktree and what the launcher trusts

Spec section 6's README entry. "What it does": shoki works in a worktree
Kanri cuts. The paragraph on `tanto` and `tanto down` gains one sentence:
the launcher starts a spawner when none has beaten within a minute, and
`tanto down` signals only one that has. This is batch B's last task and the
plan's: after its commit, batch B's boundary is the safe boundary.

**Files:**

- Modify: `skills/tanto/README.md` — "What it does" and the launcher
  paragraph.

**Interfaces:**

- Consumes: Task 4's launcher; Task 6's contract sentences.
- Produces: nothing another task reads.

**Named-mechanism sites.** Kanri's worktree is also `SKILL.md` (Task 6),
the two templates (Task 7), and `roles/kanri.md` (Task 8). The heartbeat is
also `SKILL.md` (Task 6) and `tanto.js` (Task 4). The README's own
"It starts the spawner if none is running", at the top of the launcher
section, stays: the sentence this task adds says what "running" now means.

**O9.1** `which works in the CLI's` — "What it does", wrapped as "which works in the CLI's / own worktree" (spec 2.1); before: 1 in `skills/tanto/README.md` and 1 in `skills/tanto/SKILL.md` (Workspace, O6.2's site), after: 0 in both once Tasks 6 and 9 land.

- [ ] **Step 1: Apply the passages**

Apply P9.2 to P9.3.

**P9.2** `skills/tanto/README.md` — replace exactly these 4 lines

```markdown
- Runs one plan through separate Claude Code sessions in the same
  repository, on the same branch except shoki's, which works in the CLI's
  own worktree: **Kanri** (管理) manages, **Sekkei** (設計)
  writes the spec, **Keikaku** (計画) writes the plan, **Jisso** (実装)
```

**P9.2 →**

```markdown
- Runs one plan through separate Claude Code sessions in the same
  repository, on the same branch except shoki's, which works in a worktree
  Kanri cuts: **Kanri** (管理) manages, **Sekkei** (設計)
  writes the spec, **Keikaku** (計画) writes the plan, **Jisso** (実装)
```

**P9.3** `skills/tanto/README.md` — replace exactly these 3 lines

```markdown
too, which retires the run — the conversations are kept, but a seat the run
stopped is not resumed.

```

**P9.3 →**

```markdown
too, which retires the run — the conversations are kept, but a seat the run
stopped is not resumed. The spawner writes a heartbeat as it works: `tanto`
starts a spawner when none has beaten within a minute, and `tanto down`
signals only one that has.

```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-03-shoki-seat.md --task 9
```

Expected: `task 9: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/README.md
git commit --only -m "docs: the README names the worktree Kanri cuts and the spawner's heartbeat" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/README.md
```

Expected: lint passes with no file changed; one commit.

## Self-Review

**Size.** Nine tasks: five in batch A, four in batch B. Batch A carries
five rather than four because `spawner.js` needs three — the command line
and the two landing points (Task 1), the worktree cwd and the listing's
key (Task 2), the notice and the heartbeat (Task 3) — each landing its own
tests with a green suite, beside `tanto.js` (Task 4) and `boundary.js`
(Task 5). The largest task is Task 3: 792 lines and six steps, most of it
quoted code — seventeen `spawner.js` blocks and five test blocks. It is not
split further because the notice and the heartbeat share the census pass,
the spawner's poll loops, and the test helper `run` whose environment both
need; two tasks there would touch the same lines, which `verify` cannot
hold at the batch's boundary. The next largest is Task 1 at 561 lines.
The plan carries 88 passages and 47 old-value needles, 135 blocks in all,
and no anchor, since no block is an insertion.

**No sweep-and-check task.** Every task's deliverable is a file and a
commit; the sweeps are fences of How a batch is verified, run by the
boundary.

**Measured while drafting.** Every passage was applied, in order, to a
scratch copy of `b8bca1b` with one commit per task, and each task's state
was run: the whole suite green at Tasks 1 and 3 (218 and 226 tests), at
Task 2 with its fixtures (`spawner.test.js` and `tanto.test.js` green —
the five launcher tests red before the fixtures), `tanto.test.js` green at
Task 4 (34 tests) and `boundary.test.js` at Task 5 (38), and the whole
suite at the last commit, 231 tests green; each task's new tests run red
against the previous task's script first (Tasks 1, 2: every new test red;
Task 3: four red, the under-two-minutes test green, as Step 2 says; Task 4:
three red, the heartbeat-of-now test green; Task 5: red). `biome check`
and `markdownlint-cli2`, from the pre-commit cache with this repository's
configuration, pass on every touched file. `passage-check.js lint` is
clean, `replay --base b8bca1b` applies every block with no failure and
leaves every needle at 0, and the replayed tree is byte-identical to the
scratch copy's last commit; `verify --task <N>` is clean for every task at
its own commit and at both boundaries. Fences 4 and 5 of How a batch is
verified were run against the scratch copy after Task 5 and after Task 9:
no residual, no stale hit.

**Spec coverage.**

| Spec section | Tasks |
| --- | --- |
| 1.1 the order, 1.2 the idle note, 1.3 tests | 1 (code, argv test, idle-note test); 7 (`prompt` bullet, result paragraph) |
| 2.1 Kanri's act | 8 (merge act, Create row); 6, 7, 9 (the documents); Global Constraints (this plan's own close) |
| 2.2 the spawner's cwd | 2 (code, two tests); 1 (no `-w`); 7 (`worktree` bullet) |
| 2.3 the listing's key | 2 (spawner, test, `tanto.test.js` fixtures); 4 (launcher) |
| 2.4 the landing | 1 (the `rm` result's `worktree`, its test); 8 (removal sentences); 7 (result paragraph) |
| 2.5 tests | 2 |
| 3.1 the rule, 3.2 two fields, 3.4 tests | 3; 6 (notice list) |
| 3.3 the census line for Kanri | 5; 8 (census bullet) |
| 4.1 the spawner beats | 3 |
| 4.2 the launcher reads it, D-6 | 4; 6 and 9 (documents) |
| 4.3 tests | 3 (spawner's), 4 (launcher's four) |
| 5.1 `rm`/`stop` on an exited session, 5.3 tests | 1; 7 (result paragraph) |
| 5.2 `live (blocked since <HH:MM>)` | 5 (` — blocked`); 6, 7, 8 (documents) |
| 6 file by file | 1-9, one task per file group; the sites it does not name are listed under the title |
| 7 rule 11 and this plan | Global Constraints (authority, queue, safe boundary, the two facts); How a batch is verified, fence 6 (untouched files) |
| Old values | O1.1 to O9.1, swept by fence 4 |
| What the plan must contain | the two batches, the fixtures in Task 2, fences 4 and 5 |

**Gaps and ambiguities resolved.**

- `node --test skills/tanto/scripts/` fails at once on Node 24.16 (a
  directory is read as one test file); every command names
  `skills/tanto/scripts/*.test.js`.
- The spec puts `tanto.test.js`'s fixtures with "the task that lands 2.3";
  2.3 lands in two files. Drafting measured five launcher tests red under
  the spawner's `underRoot` alone, so the fixtures land with the spawner's
  half, in Task 2, and Task 4 adds only tests.
- The fixtures cannot name `ws.root` before `workspace` makes it: each says
  `cwd: ROOT`, a symbol `workspace` replaces with the root — the spec's
  "given `cwd: ws.root`" in effect.
- Spec 4.3 names "the test's own PID" as the stranger. The launcher's tests
  use a sleeping child the test ends itself: a regression that signalled
  the PID would otherwise end the test runner, and the property — the
  stranger is still alive — is the same.
- Spec 1.2 says nothing of an `rm` that fails on the undelivered seat; the
  spawner keeps it `running`, with `undelivered`, for the census to see
  gone, and the error carries `claude rm`'s text too.
- Spec 3.2 says a seat with no `startedAtMs` is never judged; Task 3 holds
  that for the `gone` shape as well, so no seat from before this change
  raises a notice when it goes.
- Spec 3.4's tests need a config directory the census can search: the
  `run` helper gives every spawner test the workspace's own, and fixes
  `TANTO_NOW_MS` at the fake's `startedAt`; "the census revives a gone
  seat …" writes a transcript so its `gone` stays the ordinary one.
- The order of `--add-dir` and the prompt cannot be a one-line needle: the
  new `spawnArgs` returns one expression, so O1.3's old push cannot
  survive beside it, and the argv test pins the order.
- Kanri acts on the two census suffixes in two bullets of "Session
  lifecycle"'s list rather than one sentence, each naming its own act;
  `(blocked since <HH:MM>)` is written "carrying `— blocked`", since a
  Listed line may carry both suffixes, and without the leading space
  inside the code span that `markdownlint`'s MD038 refuses.
- Four comments the spec does not name changed with the code they
  describe: `transcriptOf`'s (the census looks again), `cmdRun`'s two (a
  worktree spawn names its own cwd; the event loop blocks about a minute,
  M-6), and `runClaude`'s new one.

**Not resolved here.** Whether the landing's
`git worktree remove --force --force` returns without `Permission denied`
(a881) is the spec's fourth landing measurement, Kanri's at this plan's
landing, not a task's.
