# tanto-bg-seats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the machine-facing seats of a tanto run `claude --bg` sessions
that a spawner outside any Claude session starts, stops, and resumes on request
files Kanri writes; give the human one command, `tanto`, that starts the run and
resumes it; take the presence gate off the handover; move the close's fix group
into a Jisso batch before the merge and the `docs/` write-out into a scribe seat
after it; and make a session's identity its `sessionId`.

**Architecture:** Two new Node instruments beside `reading.js` —
`scripts/spawner.js`, a resident process with six ops (`spawn`, `stop`, `rm`,
`resume`, `attention`, `ack`), a fifteen-second census of
`claude agents --json`, an ad hoc-worktree guard, and a desktop notice; and
`scripts/tanto.js`, the human's one command, with a `.bat` and a `.sh` wrapper.
`reading.js` gains one export, `loadSessions(root)`. `boundary.js` gains a
`stopped` status, a `--seat <results path>` that writes a terminal seat's roster
row from the spawner's result file, and an unpaired-`commit-ready:` report in
`check`. Two new templates, `templates/spawn-request.md` (the request schema)
and `templates/shoki-brief.md` (the scribe's whole contract), and two new
`tanto.json` keys, `subagents.shoroku.review` and `sessions.shoki`. Everything
else is the contract, the role files, and the run-time templates brought into
agreement with those facts in one final batch.

**Tech Stack:** Markdown (the contract, the role files, the templates), JSON
(`templates/tanto.json`), and Node 22 with no dependencies for the five scripts,
tested by `node --test`. Claude Code CLI 2.1.278 for the measurements. No test
framework beyond `node --test`; no build step.

**Spec:** `docs/superpowers/specs/2026-09-20-tanto-bg-seats-design.md`, accepted
2026-09-20 with its review's thirty-one findings and the human's eight scope
answers folded in. The spec is the binding authority; this plan argues from it.
The dialogue is `.tanto/tanto-bg-seats/dialogue.md` (D-0 to D-6).

## Global Constraints

- **The authority for this run's sessions is this plan, Kanri's orders line,
  and the batch prompts — not the role text on disk.** This plan edits the
  skill's own files, and every session that runs it loads the working tree's
  copy (contract rule 11, decision-5c8e).
- **The safe boundary is the final one — no role is started or replaced before
  it.** Batch D's boundary is the first at which every file this plan touches
  agrees with every other. No Jisso, Sekkei, Keikaku, Kaiseki, Kikaku, or Hosa
  is created, replaced, or handed over between batch A1's first task and batch
  D's boundary. The fix wave that follows D lands no new mechanism.
- **The Kanri that runs this plan runs today's mechanism throughout** — the
  interactive resident of `roles/kanri.md` as it reads before batch A1, its
  create requests to the human, its hand-queued Jissos, and `tanto-diet`'s
  boundary. It never writes a spawn request, never runs `tanto`, and never
  attaches to anything: the launcher and the spawner exist on disk from batch A1
  on and run for the first time in this repository at this plan's **close**.
  Batch B runs them against a scratch clone, never against this checkout.
- **The close's handover is where the mechanism changes hands.** The outgoing
  Kanri writes `.tanto/kanri-handover.md` as today, **before** it prints its
  commands, and its "Commands for the human" say `tanto`, typed in VS Code's
  integrated terminal at the repository root. The launcher finds the handover
  file and spawns the first background Kanri regardless of the interactive
  Kanri's `live` first row (spec 1.2, step 4); that Kanri reads the handover and
  marks the tab Kanri `replaced`. From that Kanri on, every terminal seat is
  spawned.
- **D-2, and this plan's own rule: this is the last plan to queue its Jissos by
  hand.** Every later plan that edits this skill spawns all its Jissos at the
  landing under `queue=<topic>`; every other plan spawns one per batch. This one
  is queued by the human at the landing, in full, as rule 11's present text
  prescribes for a plan whose final boundary is the safe one.
- **The run-time templates land with the role files, in the final batch.** A
  role file is loaded once, at session start, but the `boundary.verify` subagent
  reads `templates/boundary-brief.md` and renders `templates/batch-prompt.md`
  **from disk at every boundary, this plan's included**. A new brief in an
  earlier batch would hand this plan's own Kanri a verdict line its loaded role
  file cannot key on. So `templates/boundary-brief.md`,
  `templates/batch-prompt.md`, and `templates/kanri-handover.md` are in batch D
  with `SKILL.md`, the seven role files, and `README.md`. The templates a
  session reads once — `roster.md`, `roster-archive.md`, `kanri.md`,
  `shoki-brief.md`, `spawn-request.md` — land earlier.
- **The two boundaries after batch D's content lands, and what this plan's Kanri
  does at them.** Batch D's own boundary and the fix wave's are verified by a
  `boundary.verify` dispatch that reads the **new** brief. Two differences are
  concrete and this plan's Kanri owns them: the verdict line's `ceiling:` half
  carries `under|over` alone, with no `present|absent` after it, so Kanri reads
  the presence verdict from nothing and treats every crossing as firing; and the
  brief's step 5 renders the next prompt with no addressee name. `boundary.js`'s
  new flags are additive — `--seat` is optional and the brief passes it only
  when a results path exists, which under this run it never does — so `record`
  runs unchanged at both. Kanri sends the fix-wave prompt by hand to the window
  the human queued, as it has all plan.
- **No role file is touched by batch B.** Every one of its nine tasks is a
  measurement whose deliverable is a report under `.tanto/tanto-bg-seats/`.
  One tracked file is written across the whole batch, and it is not a role
  file: `templates/spawn-request.md`, whose `prompt` bullet task 7's step 5
  settles from its own measurement — a template task 7's own batch created,
  which is why B1's stop condition reads "no tracked file but that template
  changed". Tasks 8 to 15 write none.
- **Repo rules (`AGENTS.md`, `CONTRIBUTING.md` at the repository root).**
  American English in every tracked file. Run `./scripts/lint.sh <changed paths>`
  on the paths a task changed, relative to the repository root, and fix what it
  reports before committing. Commit by explicit path with
  `git commit --only <paths>` — the index is shared; a new file needs
  `git add <paths>` first, because `--only` cannot pick up an untracked file.
  Never `git add -A`, `.`, or `-u`; never a bare `git commit` or `git commit -a`;
  never `--no-verify`. End every commit message with
  `Co-Authored-By: Claude <noreply@anthropic.com>`. After editing
  `skills/tanto/SKILL.md`, review `skills/tanto/README.md` for drift — task 23
  is where this plan pays that back.
- **Model families, from the merged `tanto.json`** (built-in
  `skills/tanto/templates/tanto.json` overlaid by `<repo>/.claude/tanto.json`,
  which sets `sessions.kikaku` and `sessions.sekkei` only): this plan's own
  Keikaku and Jisso are **sonnet** (`sessions.keikaku` sonnet/high,
  `sessions.jisso` sonnet/xhigh), Kanri **sonnet**/high. Jisso's four dispatch
  kinds stay `task.implement` sonnet/high, `task.review-spec` opus/medium,
  `task.review-quality` opus/medium, `task.escalate` opus/high; the boundary's
  `boundary.verify` is sonnet/high. The kind this plan adds is
  **`shoroku.review`, opus/medium**, and the seat it adds is
  **`sessions.shoki`, sonnet/medium** — neither is dispatched or started by this
  plan's own run. Every dispatch names its `model` and its `subagent_type`
  together; none omits either (rule 6).
- **The stray-modification rule.** A modification in the shared tree that an
  implementer or its own subagent did not make is **not** its to discard: it is
  reported — a `task.implement` subagent tells Jisso one line, Jisso tells Kanri
  one line — and only Kanri decides whether it is stray. Never
  `git checkout -- <path>` and never `git clean` on such a modification. The one
  exception is the deliberate line-ending restore named inside tasks 3 and 19
  (below), which each run on the Markdown file it created in that same task.
- **Line endings.** A **Markdown** file created on this host lands `w/lf` in
  `git status`'s eyes every time (measured five of five in the tanto-cost run),
  so every task that creates one runs `git checkout -- <that path>` **after** its
  own commit, inside its own steps, and the next boundary's `git status` is
  clean. Tasks 3 (`templates/spawn-request.md`) and 19
  (`templates/shoki-brief.md`) are the only such tasks here. The `.js` files need
  no restore — `.gitattributes` pins `*.js` to `eol=lf` — and neither do
  `tanto.sh` (`*.sh text eol=lf`) or `tanto.bat` (`*.bat text eol=crlf`), each
  written with the ending its pin names.
- **Named mechanisms.** A task that introduces or changes a named mechanism — a
  status word (`stopped`), a request field (`op`, `worktree`, `addDir`,
  `sessionId`), a flag (`--seat`), a ledger event (`commit-ready:`,
  `commit-done:`, `review-ready:`), a slot, a grant clause — lists in its own
  text every other site in the same file and in the files this plan touches that
  names the same mechanism, so that its reviewer checks them together. Each such
  list is under **Named-mechanism sites** in the task.
- **What this plan does not write.** Nothing under `docs/decisions/`,
  `docs/requirements/`, or `docs/issues/`. The spec's twelve ADRs, its
  Requirements rewrite of `docs/requirements/04f5-tanto.md`, and its "Issues this
  design closes" list are the close's T2 apply's work, not this plan's. No task
  here touches any of the three directories.

### The commands `replay` does not run

Declared once here, not line by line — `replay` (and `boundary`, which honors
the same patterns) skip a fence matching one of these:

```text
replay-skip: ./scripts/lint.sh — the repo's own lint driver runs pre-commit, which needs the repository and its hook cache; the applied tree is a set of copied blobs and is neither
replay-skip: node --test — the tests must run against the whole skill tree (`reading.js`, `templates/tanto.json`, the fake-CLI fixtures they write beside themselves), and the applied tree carries only this plan's own touched blobs
replay-skip: claude — every batch B measurement drives the real Claude Code CLI: a real `--bg` process, a real background session, a real `claude agents --json`, `stop`, `rm`, `attach`, and `--resume`. None of it exists in a dry run's sandbox, and none of it may be faked, since faking it is exactly what these tasks are there to stop doing
replay-skip: powershell — Verification 3 raises a real Windows toast through the OS notification stack; there is no output to compare and no sandbox that can hold it
replay-skip: git worktree — Verification 9 and the shoki landing forms need a real git worktree cut by the CLI under `.claude/worktrees/`, and the applied tree is not a repository
replay-skip: "$scratch" — every batch B fence names this shell variable, the throwaway clone under the OS temp directory that task's Step 1 creates; a step's own fence — starting the launcher directly, reading `claude agents --json`, writing a request by hand — often carries no other pattern of the six above, so this is the one substring that is actually present, literally, in every fence of tasks 7 to 15. Measured the hard way: a first draft that declared "scratch clone" as prose, not as a literal substring, let two of these fences run for real and spawn two real `claude --bg` background sessions during this plan's own dry run (2026-09-21) — `claude rm`ed once found, and this pattern is why they cannot recur.
```

Batch B's nine tasks are `replay-skip` candidates one and all, and each says so
in its own text with the fixture it needs: a real CLI process (tasks 7, 8, 9, 12,
13, 14), a real OS notification (task 11), a real terminal close and a real
reboot (task 10), a real git worktree and a real push (tasks 13, 15). The
`"$scratch"` pattern is what actually exempts every one of their fences from
`replay` and `boundary` alike — a fence's own text, not the task's prose, is
what the skip check reads, and `"$scratch"` is the one string every such fence
shares.

## File structure

Created — declared to `diff`, which exempts a created path from its line
accounting, and carried by a `W` block each, because `replay` copies every other
block's path out of the merge base:

created: skills/tanto/scripts/spawner.js
created: skills/tanto/scripts/spawner.test.js
created: skills/tanto/scripts/tanto.js
created: skills/tanto/scripts/tanto.test.js
created: skills/tanto/scripts/tanto.bat
created: skills/tanto/scripts/tanto.sh
created: skills/tanto/templates/spawn-request.md
created: skills/tanto/templates/shoki-brief.md

- `skills/tanto/scripts/spawner.js` — the resident spawner: the request loop,
  the six ops, the census, the ad hoc-worktree guard, the desktop notice, and
  the `notify --stdin` one-shot the optional harness hook calls. No
  dependencies, no shebang; always `node "$TANTO/scripts/spawner.js"`.
- `skills/tanto/scripts/spawner.test.js` — its tests, run by `node --test`,
  against a fake CLI that records its arguments and prints what the CLI prints.
- `skills/tanto/scripts/tanto.js` — the launcher: the human's one command, also
  fukki. Idempotent.
- `skills/tanto/scripts/tanto.test.js` — its tests, the same way.
- `skills/tanto/scripts/tanto.bat`, `skills/tanto/scripts/tanto.sh` — the two
  wrappers, the only files of the skill invoked bare.
- `skills/tanto/templates/spawn-request.md` — the sixteenth template: the
  request schema as a documented example, the JSON in a fence with every field
  explained beside it.
- `skills/tanto/templates/shoki-brief.md` — the seventeenth: the scribe's whole
  contract, in the shape of `templates/boundary-brief.md`.

Modified:

- `skills/tanto/scripts/reading.js` — one new export, `loadSessions(root)`, built
  on the unexported config helpers; no behavior change.
- `skills/tanto/scripts/reading.test.js` — its cases.
- `skills/tanto/scripts/boundary.js` — `record --status … stopped`,
  `record --seat <results path>`, and `check`'s unpaired `commit-ready:` report.
- `skills/tanto/scripts/boundary.test.js` — cases for all three.
- `skills/tanto/templates/tanto.json` — `subagents.shoroku.review` and
  `sessions.shoki`.
- `skills/tanto/templates/roster.md` — the keeping rule's two kinds, the result
  file, `stopped`, the `renamed` reconciliation.
- `skills/tanto/templates/roster-archive.md` — both status enumerations.
- `skills/tanto/templates/kanri.md` — the Branch line, the Measurements
  deferrals row, the close's Progress vocabulary.
- `skills/tanto/templates/boundary-brief.md` — the reply line's `ceiling:`,
  step 5's addressee, `record --seat`.
- `skills/tanto/templates/batch-prompt.md` — the title, the Guard, the deferral
  slot.
- `skills/tanto/templates/kanri-handover.md` — Why, In flight, Live peers,
  Commands for the human.
- `skills/tanto/SKILL.md` — the roles table, Invocation, Start sequence,
  Handshake and roster, Resuming, Messages, Session exit, Artifacts, Human
  access, Rules, Workspace, the expected-model config, standalone Kaiseki, and
  the frontmatter description.
- `skills/tanto/roles/kanri.md` — Start, On a handshake, When the plan lands,
  The batch loop, The final batch, Shoroku, Handover, Session lifecycle.
- `skills/tanto/roles/sekkei.md`, `keikaku.md`, `jisso.md`, `hosa.md`,
  `kaiseki.md`, `kikaku.md` — the sites spec 4.3 names.
- `skills/tanto/README.md` — Usage, "What it does", Layout, Prerequisites.

Not touched, and named so a reviewer does not look for them:
`skills/tanto/scripts/passage-check.js` and its test file,
`skills/tanto/templates/batch-report.md`, `bug-report.md`, `review-brief.md`,
`shoroku-brief.md`, `kikaku-decision.md`, `kaiseki-brief.md`,
`kaiseki-report.md`, `agent.md` (unchanged — the fifteenth definition renders
from it as it stands), and everything under `docs/`.

## Batches

Three tasks each, four in C and D (rule 7). Every boundary rotates the Jisso;
the queue the human is asked for at the landing is **eight** windows — the seven
batch rows plus one for the whole-branch review's fix wave — and, because this
plan names its final boundary as the safe one, the full eight are asked for at
once and no released window is re-queued before the plan's end.

| Batch | Tasks | What it delivers | Stop conditions at its boundary |
| --- | --- | --- | --- |
| A1 | 1, 2, 3 | `scripts/spawner.test.js` whole (the failing suite with its fake CLI), then `scripts/spawner.js` whole (six ops, census, guard, notice, `notify --stdin`), then `templates/spawn-request.md` and `templates/tanto.json`'s two keys | `node --test 'skills/tanto/scripts/*.test.js'` passes; `node skills/tanto/scripts/spawner.js` with no argument exits 2 on its usage line; `templates/tanto.json` parses, has fifteen `subagents` keys with `shoroku.review` among them and eight `sessions` keys with `shoki` among them; lint on the changed paths; `git status` clean |
| A2 | 4, 5, 6 | `reading.js`'s `loadSessions` export with its cases; `scripts/tanto.test.js` whole; `scripts/tanto.js` with `tanto.bat` and `tanto.sh` | `node --test` passes, `loadSessions`'s cases included; `node skills/tanto/scripts/tanto.js --help` exits 2 on its usage line; `node -e` requiring `reading.js` finds `loadSessions` a function; lint on the changed paths; `git status` clean |
| B1 | 7, 8, 9 | the spawn path measured against a real CLI in a scratch clone: the `--bg` initial prompt's form (spec Verification 1), the single-tree question and the guard (2), the stopped listing and the id forms (8) — and the prompt form written into `templates/spawn-request.md` | the three reports exist under `.tanto/tanto-bg-seats/` with the command typed and the answer in one line each; `templates/spawn-request.md`'s `prompt` field names exactly one form; no tracked file but that template changed; `git status` clean |
| B2 | 10, 11, 12 | survival and reach measured: the terminal close and the reboot (4), the Windows toast (3), `SendMessage` to a background session (7) | the three reports exist, each with its commands and outcomes; the macOS and Linux notice commands recorded as untested on this machine; no tracked file changed; `git status` clean |
| B3 | 13, 14, 15 | the worktree and the landing measured: `claude --bg -w` (9), `claude rm` and the transcript (5), `git push .` and `git merge --ff-only` (6) | the three reports exist; each of the nine spec Verification items is answered in exactly one report; no tracked file changed; `git status` clean |
| C | 16, 17, 18, 19 | `scripts/boundary.js`'s three additive changes with their tests; `templates/roster.md` and `templates/roster-archive.md`; `templates/kanri.md`; `templates/shoki-brief.md` | `node --test` passes; `record --status "<name> stopped"` writes the cell and `record --seat <file>` writes a roster row from a result file; `check` prints its `## commit-ready` heading; the brief's needles are all present; lint on the changed paths; `git status` clean |
| D | 20, 21, 22, 23 | **the final content batch** — `SKILL.md`; `roles/kanri.md`; the six other role files; `README.md` with `templates/boundary-brief.md`, `templates/batch-prompt.md`, and `templates/kanri-handover.md`, all in one batch | the whole-tree `O` sweep of "How a batch is verified" fence 4 passes with every expected count; `node --test` passes; lint on the changed paths; `git status` clean |

**Batch B2's prompt carries one warning the other six do not.** Task 10 asks
the human to reboot this machine, and under today's mechanism that ends every
session of this run — Kanri's, B2's own Jisso's, and every queued Jisso's.
Kanri writes into B2's rendered prompt, in its Rulings section, that the
reboot is expected, that the run comes back by "Recovery after a VS Code
restart" (`/tanto fukki` in Kanri's window first, then in each other window),
and that task 10's step 4 waits for that; so the seat neither treats the gap
as a failure nor reads the scratch clone before it is itself back.

**The boundary from which a role may be started or replaced is batch D's.** It
is the first boundary at which every file this plan touches agrees with every
other: from batch A1 the tree holds a spawner no role file mentions, from batch C
a `boundary.js` that accepts a status word no template names until batch D's task
17 lands beside it, and until task 20 `SKILL.md`'s Invocation still documents the
address argument every role file drops in task 22. A session started before D's
boundary reads a half-edited skill. The fix wave after D lands no new mechanism,
so D's boundary is the safe one and nothing waits for the wave. Until D's
boundary the authority for every session in this run is this plan's Global
Constraints, Kanri's orders line, and the batch prompts (rule 11).

## How a batch is verified

The boundary check for this plan is
`node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --base <merge base>`,
run by Kanri at every boundary — in place, itself, per Global Constraints — with
`node "$TANTO/scripts/passage-check.js" boundary --plan <that path>` beside it.
`boundary` runs the fenced blocks below in order and judges each by its **exit
status alone**; the `Expected:` paragraph after a fence is for the human reading
the output. Each fence is written to pass at every boundary and to turn strict
from the batch that lands its property, gated on a sentinel that batch itself
writes. Every task's own Verify step is the one invocation
`node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task <N>`.

Reports and prompts follow the tanto templates; this plan names no skeleton of
its own.

**Three of these fences `boundary` cannot run, and Kanri runs them by hand.**
The `replay-skip:` declarations in Global Constraints are honored by `boundary`
as well as by `replay`, so fence 1 (`node --test`), fence 7 (`./scripts/lint.sh`)
and fence 8 (the agent definitions in a fresh session's start line) are
**skipped** at every boundary, not only in a dry run — the applied tree has no
sibling scripts, no pre-commit cache, and no second session. So at each boundary
Kanri runs those itself, in its own shell, and reads their output; a batch is not
accepted on `boundary`'s verdict alone. Fence 8 is the one that is not a shell
command at all: it is read off the start line of the next session started in this
repository after batch A1's boundary, which under this plan is the next queued
Jisso, and its `agents: <n> current` figure is what the fence's `grep` stands in
for.

**1. The scripts' tests.** Strict from batch A1.

```bash
if [ -f skills/tanto/scripts/spawner.js ]; then
  node --test 'skills/tanto/scripts/*.test.js' || exit 1
fi
true
```

Expected: from batch A1 on, `# pass` for every test and no `# fail`. The quoted
glob is the only form that runs on this host — `node --test <directory>` fails
immediately with `MODULE_NOT_FOUND` (issue-235b).

**2. `templates/tanto.json` parses, and carries the two new keys.** Strict
always; the counts turn from batch A1's task 3.

```bash
node -e '
const fs = require("node:fs");
const config = JSON.parse(fs.readFileSync("skills/tanto/templates/tanto.json", "utf8"));
const kinds = Object.keys(config.subagents);
const seats = Object.keys(config.sessions);
const landed = kinds.includes("shoroku.review");
const wantKinds = landed ? 15 : 14;
const wantSeats = landed ? 8 : 7;
if (kinds.length !== wantKinds || seats.length !== wantSeats) {
  console.error("subagents " + kinds.length + "/" + wantKinds + ", sessions " + seats.length + "/" + wantSeats);
  process.exit(1);
}
if (landed && !seats.includes("shoki")) {
  console.error("sessions.shoki missing beside subagents.shoroku.review");
  process.exit(1);
}
console.log("subagents " + kinds.length + ", sessions " + seats.length);
' || exit 1
true
```

Expected: `subagents 14, sessions 7` before task 3, `subagents 15, sessions 8`
after.

**3. The two new scripts run and refuse an empty argument list.** Strict from
batch A1 for the spawner and from A2 for the launcher.

```bash
for script in skills/tanto/scripts/spawner.js skills/tanto/scripts/tanto.js; do
  if [ -f "$script" ]; then
    node "$script" --help > /dev/null 2>&1
    if [ $? -ne 2 ]; then echo "$script did not exit 2 on --help"; exit 1; fi
  fi
done
true
```

Expected: nothing printed. Each script prints its one-line usage on `stderr` and
exits 2, as `reading.js` and `boundary.js` do.

**4. The old values are gone, over every path this plan touches.** Strict
always; each count turns from the batch that lands its passage, and the whole
sweep is read at batch D's boundary.

```bash
node -e '
const fs = require("node:fs");
const path = require("node:path");
const root = "skills/tanto";
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(md|js|json)$/.test(e.name)) files.push(p);
  }
})(root);
const texts = files.map((f) => [f, fs.readFileSync(f, "utf8")]);
const count = (needle) => texts.reduce((n, [, t]) => n + t.split(needle).length - 1, 0);
// The sentinel: batch D lands the Invocation line that retires the address.
const landed = count("/tanto <role> [<key>=<value>") > 0;
const want = landed
  ? { "create request": 0, "queued: <n>": 0, "present|absent": 0, "close: <topic>": 0, "sweep: inbox": 0, "/tanto <role> [<address>]": 0 }
  : null;
if (want === null) { console.log("batch D has not landed; sweep informational"); process.exit(0); }
let bad = 0;
for (const [needle, expected] of Object.entries(want)) {
  const got = count(needle);
  console.log(got + "\t" + expected + "\t" + needle);
  if (got !== expected) bad++;
}
process.exit(bad === 0 ? 0 : 1);
' || exit 1
true
```

Expected: before batch D, the one line `batch D has not landed; sweep
informational`. After it, six lines of `0<tab>0<tab><needle>` and nothing else.
The six needles are the ones the spec's "What the plan must contain" names; the
per-entity `O` rows of tasks 16 to 23 are the wider sweep, read from `replay`'s
residual list.

**5. `boundary.js`'s three additive changes.** Strict from batch C's task 16.

```bash
if grep -q 'commit-ready' skills/tanto/scripts/boundary.js; then
  scratch=.tanto/tanto-bg-seats/boundary-check
  rm -rf "$scratch"; mkdir -p "$scratch"
  cp skills/tanto/templates/kanri.md "$scratch/ledger.md"
  cp skills/tanto/templates/roster.md "$scratch/roster.md"
  printf '%s\n' '{"role":"jisso","topic":"t","name":"seat-1 [aaaaaa]","cwd":"/repo","model":"sonnet","effort":"xhigh","branch":"t","mode":"auto","startedAt":"2026-09-21 10:00","transcript":"/tmp/x.jsonl","sessionId":"x"}' > "$scratch/result.json"
  node skills/tanto/scripts/boundary.js record --ledger "$scratch/ledger.md" \
    --roster "$scratch/roster.md" --seat "$scratch/result.json" \
    --status 'seat-1 [aaaaaa] stopped' --event 'boundary Z verified' \
    --now '2026-09-21 10:00' > "$scratch/printed.txt" || exit 1
  grep -q 'stopped' "$scratch/roster.md" || exit 1
  grep -q 'seat-1' "$scratch/roster.md" || exit 1
fi
true
```

Expected: nothing printed before task 16 lands; afterwards the scratch roster
carries the seat's row and its `stopped` status, and `record` exits 0.

**6. `templates/shoki-brief.md` is complete.** Strict from batch C's task 19.

```bash
if [ -f skills/tanto/templates/shoki-brief.md ]; then
  brief=skills/tanto/templates/shoki-brief.md
  for needle in 'shoroku ready:' 'shoroku blocked:' 'tanto-shoroku-apply' \
    'tanto-shoroku-review' 't2-review.md' 'git rebase main' \
    '## What you never do' '## The procedure' '## The report'; do
    grep -qF "$needle" "$brief" || exit 1
  done
  steps=$(grep -c '^[0-9]\. ' "$brief")
  if [ "$steps" != 5 ]; then echo "brief steps: $steps"; exit 1; fi
fi
true
```

Expected: every needle found and the procedure's five numbered steps counted;
nothing printed.

**7. Lint on the paths this plan changes.** Strict always. `./scripts/lint.sh`
takes path arguments (`uv tool run pre-commit run --files "$@"`), so the changed
paths are named; the eight created files are added once they exist.

```bash
paths="skills/tanto/SKILL.md skills/tanto/README.md"
paths="$paths skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md"
paths="$paths skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md"
paths="$paths skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md"
paths="$paths skills/tanto/roles/hosa.md"
paths="$paths skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md"
paths="$paths skills/tanto/templates/kanri.md skills/tanto/templates/kanri-handover.md"
paths="$paths skills/tanto/templates/batch-prompt.md skills/tanto/templates/boundary-brief.md"
paths="$paths skills/tanto/templates/tanto.json"
paths="$paths skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js"
paths="$paths skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js"
for created in skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js \
  skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js \
  skills/tanto/scripts/tanto.bat skills/tanto/scripts/tanto.sh \
  skills/tanto/templates/spawn-request.md skills/tanto/templates/shoki-brief.md; do
  if [ -f "$created" ]; then paths="$paths $created"; fi
done
./scripts/lint.sh $paths || exit 1
true
```

Expected: every hook `Passed` or `Skipped`. A hook that auto-fixes a file also
fails the run and leaves the change unstaged — re-stage and re-run, as
`CONTRIBUTING.md` warns.

**8. The fifteen agent-kind definitions render.** Strict from batch A1's task 3,
and read by hand.

```bash
if grep -q 'shoroku.review' skills/tanto/templates/tanto.json; then
  dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/agents"
  if [ -d "$dir" ]; then
    n=$(ls "$dir"/tanto-*.md 2>/dev/null | wc -l)
    echo "user-scope tanto definitions: $n"
  fi
fi
true
```

Expected: after the first session started in this repository once task 3 has
landed, `user-scope tanto definitions: 15`, and that session's own start line
reads `agents: 15 current` with `tanto-shoroku-review` among them. A session
started before that writes the fifteenth definition and cannot see it, which is
`SKILL.md`'s own rule and not a failure; the fence never fails on the count,
because the number it prints belongs to whichever session last ran a start
sequence.

## Tasks

---

### Task 1: `scripts/spawner.test.js` — the whole failing suite, with its fake CLI

**Files:**

- Create (test): `skills/tanto/scripts/spawner.test.js`

**Interfaces:**

- Consumes: nothing that exists yet. It spawns
  `skills/tanto/scripts/spawner.js`, which task 2 writes, and it writes its own
  fake CLI into a temp directory — a Node script that records its argument list
  and prints what `claude` prints — so that no test starts a real session.
- Produces: the behavior task 2 implements, stated as assertions. Twenty tests:
  the usage line; the notice channel per platform and the `notify` one-shot in
  both its forms; the six ops (`spawn` with and without a worktree, a failing
  `spawn`, `stop` with its id mapping, `rm`, `resume`'s exact argument list,
  `attention`'s `<id>` fill, `ack`); request order; the census's three
  reconciliations (`blocked` once, `gone` with `stopped` exempt, `renamed`); the
  ad hoc-worktree guard; and that nothing the spawner does reads or writes
  `.tanto/roster.md`.

**Why this task ends red, and why each created file appears once.** `replay`
copies every path a `P`, `A`, or `O` block names out of the merge base, and a
path this plan creates is not there — only a `W` block's path is exempt
(`passage-check.js`, `runReplay` step 1). So each file this plan creates appears
**once**, as one `W` block, in one task, and no later block of any kind names
that path. That is why batch A1 splits by file rather than by op, and why this
task's deliverable is a red suite: "write the failing test" is the whole of it.

**The fake CLI, and the one deviation from the spec's wording.** The spec asks
for "a fake `claude` on `PATH`". On this host a PATH shim would have to be
`claude.cmd`, and Node cannot spawn a `.cmd` without `shell: true`, which the
real call deliberately does not use (`claude` is a native binary — spec,
Measured 2). So the seam is an environment variable the spawner reads,
`TANTO_CLAUDE_NODE`: when it is set, the spawner runs `process.execPath` with
that script in place of the CLI, and when it is not, it runs
`process.env.TANTO_CLAUDE || "claude"` directly with `shell: false`. The tests
set it; nothing in the run does. `TANTO_NOTICE_LOG` is the same kind of seam for
the notice channel, and `templates/spawn-request.md` documents neither, because
neither is part of the request schema.

**Named-mechanism sites.** The six `op` words asserted here —
`spawn`, `stop`, `rm`, `resume`, `attention`, `ack` — are the six
`templates/spawn-request.md` documents (task 3), the six `roles/kanri.md` writes
(task 21), and the six `SKILL.md`'s Artifacts row names for `.tanto/spawner/`
(task 20). The seat statuses asserted here — `running`, `blocked`, `stopped`,
`gone`, `removed` — are `seats.json`'s, which are **not** the roster's status
words; the roster gains `stopped` alone (tasks 16, 17, 20, 21), and the two sets
meet only there. The result fields asserted here — `sessionId`, `id`, `name`,
`cwd`, `transcript`, `startedAt`, `error` — are the ones
`boundary.js record --seat` reads (task 16) and the ones
`templates/spawn-request.md` lists (task 3).

**Old values this task contradicts:** none. A new test file contradicts no
sentence on disk; the script count that `spawner.js` and `tanto.js` change is
task 20's **O20.9**, **O20.30**, and **O20.31** and task 23's **O23.5**.

**Whole file:**

**W1.1** `skills/tanto/scripts/spawner.test.js` — new file, 400 lines

```javascript
// The spawner's tests. No test starts a real session: the CLI is a fake Node
// script this file writes into a temp directory, named to the spawner through
// TANTO_CLAUDE_NODE, which records every argument list it is given and prints
// what `claude` prints.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SPAWNER = path.join(__dirname, "spawner.js");

const FAKE = `
const fs = require("node:fs");
const argv = process.argv.slice(2);
const statePath = process.env.FAKE_STATE;
const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
fs.appendFileSync(process.env.FAKE_LOG, JSON.stringify(argv) + "\\n");
const fail = state.fail || {};
const sub = argv[0];
if (fail[sub]) {
  process.stderr.write(fail[sub] + "\\n");
  process.exit(1);
}
const save = () => fs.writeFileSync(statePath, JSON.stringify(state));
if (sub === "agents") {
  process.stdout.write(JSON.stringify({ sessions: state.sessions }));
  process.exit(0);
}
if (sub === "stop" || sub === "rm") {
  const wanted = argv[1];
  const found = state.sessions.find((s) => s.sessionId === wanted || s.id === wanted);
  if (!found || (state.idForm === "short" && found.id !== wanted)) {
    process.stderr.write("unknown session " + wanted + "\\n");
    process.exit(1);
  }
  if (sub === "stop") {
    found.state = "stopped";
    if (state.dropsOnStop) state.sessions = state.sessions.filter((s) => s !== found);
  } else {
    state.sessions = state.sessions.filter((s) => s !== found);
    if (found.worktree) process.stdout.write("Removed worktree " + found.worktree + "\\n");
  }
  save();
  process.exit(0);
}
if (sub === "--resume") {
  const found = state.sessions.find((s) => s.sessionId === argv[1]);
  if (!found) {
    process.stderr.write("unknown session " + argv[1] + "\\n");
    process.exit(1);
  }
  found.name = (state.next && state.next.name) || found.name;
  found.id = (state.next && state.next.id) || found.id;
  found.state = "running";
  save();
  process.stdout.write("Resumed background session " + found.id + "\\n");
  process.exit(0);
}
if (argv.includes("--bg")) {
  const next = state.next || {};
  const session = {
    pid: 4321,
    cwd: next.cwd || state.root,
    kind: "background",
    startedAt: "2026-09-21T10:00:00Z",
    sessionId: next.sessionId || "sess-new",
    name: next.name || "seat-new [aaaaaa]",
    id: next.id || "bg01",
    status: "running",
    state: next.state || "running",
  };
  if (next.worktree) session.worktree = next.worktree;
  state.sessions.push(session);
  save();
  process.stdout.write("Started background session " + session.id + "\\n");
  process.exit(0);
}
process.exit(0);
`;

let counter = 0;

/** A temp root with .tanto/spawner/ and a fake CLI beside it. */
function workspace(sessions = []) {
  counter += 1;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `tanto-spawner-${counter}-`));
  fs.mkdirSync(path.join(root, ".tanto", "spawner", "requests"), { recursive: true });
  fs.mkdirSync(path.join(root, ".tanto", "spawner", "results"), { recursive: true });
  const fake = path.join(root, "fake-claude.js");
  fs.writeFileSync(fake, FAKE);
  const state = path.join(root, "fake-state.json");
  fs.writeFileSync(state, JSON.stringify({ root, sessions, next: {} }));
  return { root, fake, state, log: path.join(root, "fake-log.txt"), notices: path.join(root, "notices.txt") };
}

function setState(ws, patch) {
  const state = JSON.parse(fs.readFileSync(ws.state, "utf8"));
  fs.writeFileSync(ws.state, JSON.stringify({ ...state, ...patch }));
}

function run(ws, argv) {
  const result = spawnSync(process.execPath, [SPAWNER, ...argv], {
    encoding: "utf8",
    env: {
      ...process.env,
      TANTO_CLAUDE_NODE: ws.fake,
      TANTO_NOTICE_LOG: ws.notices,
      FAKE_STATE: ws.state,
      FAKE_LOG: ws.log,
    },
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

/** One request file, then one `run --once` pass over it. */
function request(ws, body) {
  const id = `2026-09-21T10-00-00-${Math.random().toString(36).slice(2, 8)}`;
  const file = path.join(ws.root, ".tanto", "spawner", "requests", `${id}.json`);
  fs.writeFileSync(file, JSON.stringify(body));
  return { id, file };
}

function result(ws, id) {
  const file = path.join(ws.root, ".tanto", "spawner", "results", `${id}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function seats(ws) {
  const file = path.join(ws.root, ".tanto", "spawner", "seats.json");
  return JSON.parse(fs.readFileSync(file, "utf8")).seats;
}

function calls(ws) {
  if (!fs.existsSync(ws.log)) return [];
  return fs
    .readFileSync(ws.log, "utf8")
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line));
}

function notices(ws) {
  if (!fs.existsSync(ws.notices)) return [];
  return fs.readFileSync(ws.notices, "utf8").split("\n").filter((line) => line.length > 0);
}

const SPAWN = {
  op: "spawn",
  role: "jisso",
  topic: "t",
  model: "sonnet",
  effort: "xhigh",
  branch: "t",
  mode: "auto",
  prompt: "/tanto jisso batch=.tanto/t/batch-A-prompt.md",
};

test("no argument prints the usage line and exits 2", () => {
  const ws = workspace();
  const got = run(ws, []);
  assert.equal(got.code, 2);
  assert.match(got.err, /^Usage: spawner\.js/);
});

test("notify --text raises the notice through the log channel", () => {
  const ws = workspace();
  const got = run(ws, ["notify", "--text", "kessai: t — claude attach bg01"]);
  assert.equal(got.code, 0);
  assert.deepEqual(notices(ws), ["kessai: t — claude attach bg01"]);
});

test("notify --stdin reads the hook payload and raises one notice", () => {
  const ws = workspace();
  const payload = JSON.stringify({
    session_id: "sess-1",
    cwd: ws.root,
    transcript_path: "/tmp/sess-1.jsonl",
    notification_type: "permission_prompt",
  });
  const got = spawnSync(process.execPath, [SPAWNER, "notify", "--stdin"], {
    encoding: "utf8",
    input: payload,
    env: { ...process.env, TANTO_NOTICE_LOG: ws.notices },
  });
  assert.equal(got.status, 0);
  assert.equal(notices(ws).length, 1);
  assert.match(notices(ws)[0], /permission_prompt/);
});

test("the notice command is the platform's, and nothing is installed for it", () => {
  const { noticeCommand } = require("./spawner.js");
  assert.equal(noticeCommand("x", "win32")[0], "powershell");
  assert.match(noticeCommand("x", "win32")[1].join(" "), /ToastNotificationManager/);
  assert.equal(noticeCommand("x", "darwin")[0], "osascript");
  assert.equal(noticeCommand("x", "linux")[0], "notify-send");
});

test("a spawn writes the result, the seat, and deletes the request", () => {
  const ws = workspace();
  const { id, file } = request(ws, SPAWN);
  assert.equal(run(ws, ["run", "--root", ws.root, "--once"]).code, 0);
  const got = result(ws, id);
  assert.equal(got.op, "spawn");
  assert.equal(got.sessionId, "sess-new");
  assert.equal(got.name, "seat-new [aaaaaa]");
  assert.equal(got.cwd, ws.root);
  assert.equal(got.id, "bg01");
  assert.equal(typeof got.startedAt, "string");
  assert.equal(fs.existsSync(file), false);
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].role, "jisso");
});

test("a spawn's command line carries the flags the request names", () => {
  const ws = workspace();
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const spawned = calls(ws).find((argv) => argv.includes("--bg"));
  assert.deepEqual(spawned, [
    "--bg",
    "--model",
    "sonnet",
    "--effort",
    "xhigh",
    "--permission-mode",
    "auto",
    "-w",
    "shoki-t",
    "--add-dir",
    ws.root,
    SPAWN.prompt,
  ]);
});

test("a failing spawn writes error and stderr, and no seat", () => {
  const ws = workspace();
  setState(ws, { fail: { "--bg": "classifier refused" } });
  const { id } = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const got = result(ws, id);
  assert.match(got.error, /classifier refused/);
  assert.equal(got.sessionId, undefined);
  assert.equal(seats(ws).length, 0);
});

test("stop marks the seat stopped and keeps the conversation", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const { id } = request(ws, { op: "stop", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).stopped, /2026|\d{4}/);
  assert.equal(seats(ws)[0].status, "stopped");
});

test("stop falls back to the short id when the CLI takes only that form", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { idForm: "short" });
  const { id } = request(ws, { op: "stop", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).error, undefined);
  const stops = calls(ws).filter((argv) => argv[0] === "stop");
  assert.deepEqual(stops.map((argv) => argv[1]), ["sess-new", "bg01"]);
});

test("rm reports the worktree it removed", () => {
  const ws = workspace();
  setState(ws, { next: { sessionId: "sess-shoki", id: "bg09", worktree: "/repo/.claude/worktrees/shoki-t" } });
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const { id } = request(ws, { op: "rm", sessionId: "sess-shoki" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).removed, /\d/);
  assert.match(result(ws, id).worktree, /shoki-t/);
  assert.equal(seats(ws)[0].status, "removed");
});

test("resume passes --resume <sessionId> --bg and no other flag", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { next: { name: "seat-back [bbbbbb]", id: "bg02" } });
  const { id } = request(ws, { op: "resume", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const resumed = calls(ws).find((argv) => argv[0] === "--resume");
  assert.deepEqual(resumed, ["--resume", "sess-new", "--bg"]);
  assert.equal(result(ws, id).sessionId, "sess-new");
  assert.equal(result(ws, id).name, "seat-back [bbbbbb]");
});

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

test("ack clears the renamed mark of the session it names", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { sessions: [{ sessionId: "sess-new", name: "seat-two [cccccc]", cwd: ws.root, kind: "background", state: "running", id: "bg01" }] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].renamed, "seat-new [aaaaaa]");
  const { id } = request(ws, { op: "ack", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).acked, /\d/);
  assert.equal(seats(ws)[0].renamed, undefined);
  assert.equal(seats(ws)[0].name, "seat-two [cccccc]");
});

test("an unknown op is a result with an error and nothing else", () => {
  const ws = workspace();
  const { id } = request(ws, { op: "launch" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).error, /unknown op/);
  assert.equal(calls(ws).filter((argv) => argv.includes("--bg")).length, 0);
});

test("requests are taken in name order", () => {
  const ws = workspace();
  const dir = path.join(ws.root, ".tanto", "spawner", "requests");
  fs.writeFileSync(path.join(dir, "2026-09-21T10-00-02-bbb.json"), JSON.stringify({ op: "attention", message: "second" }));
  fs.writeFileSync(path.join(dir, "2026-09-21T10-00-01-aaa.json"), JSON.stringify({ op: "attention", message: "first" }));
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(notices(ws), ["first", "second"]);
});

test("the census raises one notice per block, not one per pass", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { sessions: [{ sessionId: "sess-new", name: "seat-new [aaaaaa]", cwd: ws.root, kind: "background", state: "blocked", waitingFor: "permission prompt", id: "bg01" }] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "blocked");
  assert.equal(notices(ws).length, 1);
  assert.match(notices(ws)[0], /jisso t/);
});

test("the census marks a lost seat gone, and leaves a stopped one alone", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { sessions: [] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "gone");
  assert.match(seats(ws)[0].goneAt, /\d/);
  const second = workspace();
  request(second, SPAWN);
  run(second, ["run", "--root", second.root, "--once"]);
  request(second, { op: "stop", sessionId: "sess-new" });
  setState(second, { dropsOnStop: true });
  run(second, ["run", "--root", second.root, "--once"]);
  run(second, ["run", "--root", second.root, "--once"]);
  assert.equal(seats(second)[0].status, "stopped");
});

test("the guard stops a seat whose cwd is an ad hoc worktree", () => {
  const ws = workspace();
  const stray = path.join(ws.root, ".claude", "worktrees", "wt-1");
  setState(ws, { next: { cwd: stray } });
  const { id } = request(ws, { ...SPAWN, mode: "manual" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).error, /ad hoc worktree/);
  assert.equal(seats(ws)[0].status, "stopped");
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 1);
});

test("nothing the spawner does reads or writes the roster", () => {
  const ws = workspace();
  const roster = path.join(ws.root, ".tanto", "roster.md");
  fs.writeFileSync(roster, "# tanto roster\n");
  const before = fs.readFileSync(roster, "utf8");
  request(ws, SPAWN);
  request(ws, { op: "attention", message: "x" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(fs.readFileSync(roster, "utf8"), before);
});

test("run --once writes the pidfile and leaves no process behind", () => {
  const ws = workspace();
  run(ws, ["run", "--root", ws.root, "--once"]);
  const pid = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "pid"), "utf8").trim();
  assert.match(pid, /^\d+$/);
  assert.notEqual(Number(pid), process.pid);
});
```

- [ ] **Step 1: Write the file**

Write `skills/tanto/scripts/spawner.test.js` with **W1.1**'s content exactly.

- [ ] **Step 2: Run it and see it fail for the one right reason**

```bash
node --test 'skills/tanto/scripts/spawner.test.js' 2>&1 | tail -20
```

Expected: every test fails, and the failure is `Cannot find module` for
`./spawner.js` (the one `require` at the top of the helper) or
`ENOENT` from `spawnSync` on that path. A failure of any other shape means the
test file itself is wrong; fix the test file, not the expectation.

- [ ] **Step 3: Check the file's own shape**

```bash
node --check skills/tanto/scripts/spawner.test.js
grep -c '^test(' skills/tanto/scripts/spawner.test.js
grep -c 'TANTO_CLAUDE_NODE\|TANTO_NOTICE_LOG' skills/tanto/scripts/spawner.test.js
```

Expected: `node --check` prints nothing; `20`; a count of at least `3`. This
grep is what stands in for `verify` here: a task whose only block is a `W`
block has no passage for `verify` to check.

- [ ] **Step 4: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/spawner.test.js
```

Expected: every hook `Passed` or `Skipped`. `biome` formats JavaScript in this
repository; if it rewrites the file, re-stage and re-run, and the rewritten file
is what the commit carries.

- [ ] **Step 5: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 1
```

Expected: `no passages` — this task carries one `W` block and no `P` or `A`.

- [ ] **Step 6: Commit**

```bash
git add skills/tanto/scripts/spawner.test.js
git commit --only skills/tanto/scripts/spawner.test.js -m "test: the spawner's suite, against a fake CLI

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; `git status --porcelain` prints nothing. `.gitattributes`
pins `*.js` to `eol=lf`, so this file needs no line-ending restore.

---

### Task 2: `scripts/spawner.js` — the ops, the census, the guard, the notice

**Files:**

- Create: `skills/tanto/scripts/spawner.js`
- Test: `skills/tanto/scripts/spawner.test.js` (task 1, unchanged here)

**Interfaces:**

- Consumes: task 1's suite, which is the specification of every name below.
- Produces, for task 6's launcher and for tasks 3, 16, 20 and 21:
  - the CLI `node spawner.js run [--root <dir>] [--once]` and
    `node spawner.js notify --stdin | --text <line>`;
  - the files under `<root>/.tanto/spawner/` — `pid`, `log`, `seats.json`,
    `requests/<id>.json`, `results/<id>.json`;
  - `seats.json`'s entry shape:
    `{ sessionId, id, name, role, topic, model, effort, mode, worktree, cwd, startedAt, status, renamed?, goneAt? }`,
    `status` one of `running`, `blocked`, `stopped`, `gone`, `removed`;
  - a result file: every field of its request, plus the op's own fields —
    `spawn` adds `id`, `sessionId`, `name`, `cwd`, `transcript`, `startedAt`;
    `stop` adds `stopped`; `rm` adds `removed` and `worktree`; `resume` adds
    `id`, `name`, `sessionId`; `attention` adds `notified` and `channel`; `ack`
    adds `acked`; any failure adds `error`;
  - the exports `main`, `noticeCommand`, `handleRequest`, `runCensus`,
    `readSeats`, `spawnerDir`.

**Named-mechanism sites.** The status words `running`, `blocked`, `stopped`,
`gone`, `removed` are `seats.json`'s alone; the roster's own list gains
`stopped` and nothing else, in `templates/roster.md` (task 17),
`templates/roster-archive.md` (task 17), `SKILL.md`'s roster paragraph, Artifacts
row, and archive row (task 20), `roles/kanri.md`'s Release table (task 21), and
`boundary.js`'s `--status` check (task 16). The six `op` words are documented in
`templates/spawn-request.md` (task 3) and written by `roles/kanri.md` (task 21).
The two environment seams `TANTO_CLAUDE_NODE` and `TANTO_NOTICE_LOG` are named
in this file and in task 1's suite and **nowhere else** — no template, no role
file, no README.

**Old values this task contradicts:** none of its own. The counts that the two
new scripts change — `SKILL.md`'s "three executables", "All three are Node", and
"None is ever invoked bare", and `README.md`'s "All three scripts are Node" —
are **O20.9**, **O20.30**, **O20.31**, and **O23.5**, each in the task that
rewrites its sentence.

**Whole file:**

**W2.1** `skills/tanto/scripts/spawner.js` — new file, 493 lines

```javascript
// No shebang: this file is always invoked as `node <path>`, exactly as
// `reading.js` and `boundary.js` are. It is the one process in a tanto run
// that issues `claude --bg`, `claude stop`, `claude rm`, and
// `claude --resume`, and it runs outside every Claude session, started by
// `tanto.js` and never by a session's own Bash tool.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");

const USAGE =
  "Usage: spawner.js run [--root <dir>] [--once], or spawner.js notify --stdin | --text <line>";

const REQUEST_INTERVAL_MS = 2000;
const CENSUS_INTERVAL_MS = 15000;
const SPAWN_POLL_MS = 1000;
const SPAWN_POLL_TRIES = 30;
const TRANSCRIPT_POLL_MS = 500;
const TRANSCRIPT_POLL_TRIES = 20;

// The ops, in the order `templates/spawn-request.md` documents them.
const OPS = ["spawn", "stop", "rm", "resume", "attention", "ack"];

// The seat statuses `seats.json` carries. They are not the roster's words:
// the roster gains `stopped` alone, and Kanri writes it.
const LIVE = ["running", "blocked"];

function parseArgs(argv) {
  const values = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      values[arg.slice(2)] = true;
    } else {
      values[arg.slice(2)] = next;
      i++;
    }
  }
  return { values, positionals };
}

function spawnerDir(root) {
  return path.join(root, ".tanto", "spawner");
}

function requestsDir(root) {
  return path.join(spawnerDir(root), "requests");
}

function resultsDir(root) {
  return path.join(spawnerDir(root), "results");
}

function ensureDirs(root) {
  fs.mkdirSync(requestsDir(root), { recursive: true });
  fs.mkdirSync(resultsDir(root), { recursive: true });
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** Write through a temp file and rename, so a reader never sees half a file. */
function writeJsonAtomic(file, value) {
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, file);
}

function readSeats(root) {
  const doc = readJson(path.join(spawnerDir(root), "seats.json"));
  return Array.isArray(doc && doc.seats) ? doc.seats : [];
}

function writeSeats(root, seats) {
  writeJsonAtomic(path.join(spawnerDir(root), "seats.json"), { seats });
}

function seatOf(seats, sessionId) {
  return seats.find((seat) => seat.sessionId === sessionId) || null;
}

function stamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function appendLog(root, line) {
  try {
    fs.appendFileSync(path.join(spawnerDir(root), "log"), `${stamp()} ${line}\n`);
  } catch {
    // A log that cannot be written is not a reason to stop spawning seats.
  }
}

/**
 * The CLI, as a command. `TANTO_CLAUDE_NODE` names a Node script to run in
 * its place, which is how the tests fake it: a `.cmd` shim on PATH would
 * need `shell: true`, and the real `claude` is a native binary that does
 * not.
 */
function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || "claude", args };
}

function runClaude(args) {
  const command = claudeCommand(args);
  const result = spawnSync(command.file, command.args, {
    encoding: "utf8",
    windowsHide: true,
  });
  const err = result.stderr || (result.error ? String(result.error.message) : "");
  return { code: result.status === null ? 1 : result.status, out: result.stdout || "", err };
}

/** `claude agents --json --cwd <root>`, parsed. Never throws. */
function listAgents(root) {
  const got = runClaude(["agents", "--json", "--cwd", root]);
  if (got.code !== 0) {
    return { sessions: [], error: got.err.trim() || `claude agents exited ${got.code}` };
  }
  let parsed;
  try {
    parsed = JSON.parse(got.out);
  } catch {
    return { sessions: [], error: "claude agents --json did not print JSON" };
  }
  if (Array.isArray(parsed)) return { sessions: parsed };
  return { sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [] };
}

function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

/**
 * One look for `<sessionId>.jsonl` under every project directory. Only the
 * config directory is derived the way `SKILL.md`'s reading section derives
 * it (`CLAUDE_CONFIG_DIR`, else `~/.claude`); the project slug is the
 * harness's own encoding of a cwd, and nothing here runs inside a session
 * to read it from context, so the file is searched for rather than built.
 * A session id is unique, so the first hit is the file.
 */
function findTranscript(sessionId) {
  const projects = path.join(configDir(), "projects");
  try {
    for (const entry of fs.readdirSync(projects, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = path.join(projects, entry.name, `${sessionId}.jsonl`);
      if (fs.existsSync(file)) return file;
    }
  } catch {
    // No projects directory on this host yet.
  }
  return null;
}

/**
 * The transcript of a session, with a retry: the harness writes the file
 * some time after `claude agents --json` first lists the session, so one
 * look at the first sighting can miss it and freeze a `null` into the
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
}

function noticeText(seat, message) {
  if (message) return message;
  const where = seat.id ? ` — claude attach ${seat.id}` : "";
  return `blocked: ${seat.role} ${seat.topic} ${seat.name}${where}`;
}

/**
 * The channel, by platform, each a child process with no dependency. The
 * Windows script loads the WinRT toast manager and shows a two-line toast
 * under the AUMID PowerShell registers for itself. That id must be the
 * registered one: `Show()` on an unregistered app id returns without error
 * and displays nothing, so a wrong id would make `raiseNotice` report a
 * channel for a notice nobody saw (task 11 measures it by eye).
 */
function noticeCommand(text, platform = process.platform) {
  if (platform === "win32") {
    const quoted = `'${String(text).replace(/'/g, "''")}'`;
    const script = [
      "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null",
      "$x = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)",
      "$n = $x.GetElementsByTagName('text')",
      "$n.Item(0).AppendChild($x.CreateTextNode('tanto')) > $null",
      `$n.Item(1).AppendChild($x.CreateTextNode(${quoted})) > $null`,
      "[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe').Show([Windows.UI.Notifications.ToastNotification]::new($x))",
    ].join("; ");
    return ["powershell", ["-NoProfile", "-Command", script]];
  }
  if (platform === "darwin") {
    return ["osascript", ["-e", `display notification "${text}" with title "tanto"`]];
  }
  return ["notify-send", ["tanto", String(text)]];
}

/**
 * Raise the notice. Returns the channel used: `log` when the test seam is
 * set or the platform command fails, else the platform's own word. A notice
 * is a convenience, and `claude agents` in a terminal needs none.
 */
function raiseNotice(text) {
  const log = process.env.TANTO_NOTICE_LOG;
  if (log) {
    fs.appendFileSync(log, `${text}\n`);
    return "log";
  }
  const [file, args] = noticeCommand(text);
  const got = spawnSync(file, args, { encoding: "utf8", windowsHide: true });
  if (got.status === 0) return file;
  return "log";
}

function spawnArgs(request) {
  const args = ["--bg"];
  if (request.model) args.push("--model", request.model);
  if (request.effort) args.push("--effort", request.effort);
  args.push("--permission-mode", request.mode || "auto");
  if (request.worktree) args.push("-w", request.worktree);
  for (const dir of request.addDir || []) args.push("--add-dir", dir);
  args.push(request.prompt);
  return args;
}

/** The short id `--bg` prints, when it prints one. */
function shortIdOf(text) {
  const found = /session\s+([A-Za-z0-9][\w-]*)/i.exec(text || "");
  return found ? found[1] : null;
}

function findNew(root, before) {
  for (let attempt = 0; attempt < SPAWN_POLL_TRIES; attempt++) {
    const listing = listAgents(root);
    const fresh = listing.sessions.find((s) => s.sessionId && !before.has(s.sessionId));
    if (fresh) return fresh;
    sleepSync(SPAWN_POLL_MS);
  }
  return null;
}

function opSpawn(root, request, seats) {
  const before = new Set(listAgents(root).sessions.map((s) => s.sessionId));
  const got = runClaude(spawnArgs(request));
  if (got.code !== 0) return { error: `claude --bg exited ${got.code}: ${got.err.trim()}` };
  const session = findNew(root, before);
  if (!session) return { error: "claude --bg started no session the listing shows" };

  // The listing's first sighting is where the ad hoc-worktree guard runs
  // (issue-aa37): a `--bg` session under a mode that gates a tool has once
  // reported its cwd under `.claude/worktrees/` with no `-w`.
  const strayRoot = path.join(root, ".claude", "worktrees");
  const stray = !request.worktree && session.cwd && session.cwd.startsWith(strayRoot);
  const id = session.id || shortIdOf(got.out);
  const seat = {
    sessionId: session.sessionId,
    id,
    name: session.name,
    role: request.role,
    topic: request.topic,
    model: request.model,
    effort: request.effort,
    mode: request.mode || "auto",
    worktree: request.worktree,
    cwd: session.cwd,
    startedAt: session.startedAt,
    status: stray ? "stopped" : "running",
  };
  seats.push(seat);
  if (stray) {
    runClaude(["stop", id || session.sessionId]);
    appendLog(root, `guard stopped ${session.sessionId} at ${session.cwd}`);
    return { error: `ad hoc worktree ${session.cwd}` };
  }
  return {
    id,
    sessionId: session.sessionId,
    name: session.name,
    cwd: session.cwd,
    transcript: transcriptOf(session.sessionId),
    startedAt: session.startedAt,
  };
}

/** `stop` and `rm` take the short id on some builds and the long one on others. */
function runWithEitherId(verb, seat, sessionId) {
  const first = runClaude([verb, sessionId]);
  if (first.code === 0) return first;
  if (seat && seat.id && seat.id !== sessionId) {
    const second = runClaude([verb, seat.id]);
    if (second.code === 0) return second;
    return second;
  }
  return first;
}

function handleRequest(root, request, seats) {
  if (!OPS.includes(request.op)) return { error: `unknown op ${request.op}` };
  const seat = request.sessionId ? seatOf(seats, request.sessionId) : null;

  if (request.op === "spawn") return opSpawn(root, request, seats);

  if (request.op === "stop") {
    const got = runWithEitherId("stop", seat, request.sessionId);
    if (got.code !== 0) return { error: `claude stop: ${got.err.trim()}` };
    if (seat) seat.status = "stopped";
    return { stopped: stamp() };
  }

  if (request.op === "rm") {
    const got = runWithEitherId("rm", seat, request.sessionId);
    if (got.code !== 0) return { error: `claude rm: ${got.err.trim()}` };
    if (seat) seat.status = "removed";
    const printed = /Removed worktree (.+)/i.exec(got.out);
    return { removed: stamp(), worktree: printed ? printed[1].trim() : seat && seat.worktree };
  }

  if (request.op === "resume") {
    const got = runClaude(["--resume", request.sessionId, "--bg"]);
    if (got.code !== 0) return { error: `claude --resume: ${got.err.trim()}` };
    const listing = listAgents(root);
    const session = listing.sessions.find((s) => s.sessionId === request.sessionId);
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

  if (request.op === "attention") {
    const text = String(request.message || "").replace("<id>", (seat && seat.id) || "<id>");
    const channel = raiseNotice(text);
    appendLog(root, `attention ${text}`);
    return { notified: stamp(), channel };
  }

  // ack
  if (seat) delete seat.renamed;
  return { acked: stamp() };
}

function takeRequests(root, seats) {
  let names;
  try {
    names = fs.readdirSync(requestsDir(root)).filter((n) => n.endsWith(".json")).sort();
  } catch {
    return;
  }
  for (const name of names) {
    const file = path.join(requestsDir(root), name);
    const request = readJson(file);
    if (!request) {
      fs.rmSync(file, { force: true });
      continue;
    }
    let outcome;
    try {
      outcome = handleRequest(root, request, seats);
    } catch (error) {
      outcome = { error: String(error && error.message) };
    }
    writeJsonAtomic(path.join(resultsDir(root), name), { ...request, ...outcome });
    fs.rmSync(file, { force: true });
    writeSeats(root, seats);
    appendLog(root, `${request.op} ${name} ${outcome.error ? `error: ${outcome.error}` : "ok"}`);
  }
}

function runCensus(root, seats) {
  const listing = listAgents(root);
  if (listing.error) {
    appendLog(root, `census: ${listing.error}`);
    return seats;
  }
  const byId = new Map(listing.sessions.filter((s) => s.sessionId).map((s) => [s.sessionId, s]));
  for (const seat of seats) {
    if (!LIVE.includes(seat.status)) continue;
    const session = byId.get(seat.sessionId);
    if (!session) {
      seat.status = "gone";
      seat.goneAt = stamp();
      appendLog(root, `census: ${seat.sessionId} gone`);
      continue;
    }
    if (session.name && session.name !== seat.name) {
      seat.renamed = seat.name;
      seat.name = session.name;
      appendLog(root, `census: ${seat.sessionId} renamed to ${session.name}`);
    }
    if (session.id) seat.id = session.id;
    if (session.state === "blocked" && seat.status !== "blocked") {
      seat.status = "blocked";
      raiseNotice(noticeText(seat));
      appendLog(root, `census: ${seat.sessionId} blocked`);
    } else if (session.state !== "blocked" && seat.status === "blocked") {
      seat.status = "running";
    }
  }
  writeSeats(root, seats);
  return seats;
}

function cmdRun(argv) {
  const { values } = parseArgs(argv);
  const root = typeof values.root === "string" ? path.resolve(values.root) : process.cwd();
  ensureDirs(root);
  fs.writeFileSync(path.join(spawnerDir(root), "pid"), `${process.pid}\n`);
  const pass = () => {
    const seats = readSeats(root);
    takeRequests(root, seats);
    runCensus(root, seats);
  };
  pass();
  if (values.once) return 0;
  setInterval(() => takeRequests(root, readSeats(root)), REQUEST_INTERVAL_MS);
  setInterval(() => runCensus(root, readSeats(root)), CENSUS_INTERVAL_MS);
  try {
    fs.watch(requestsDir(root), () => takeRequests(root, readSeats(root)));
  } catch {
    // The two-second interval is the floor; the watch is the speed-up.
  }
  return 0;
}

function cmdNotify(argv) {
  const { values } = parseArgs(argv);
  if (typeof values.text === "string") {
    raiseNotice(values.text);
    return 0;
  }
  if (!values.stdin) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  let payload = {};
  try {
    payload = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    payload = {};
  }
  const what = payload.notification_type || "notification";
  const where = payload.cwd || "";
  const who = payload.session_id || "";
  raiseNotice(`tanto: ${what} in ${where} — claude attach ${who}`);
  return 0;
}

function main(argv) {
  const sub = argv[0];
  if (sub === "run") return cmdRun(argv.slice(1));
  if (sub === "notify") return cmdNotify(argv.slice(1));
  process.stderr.write(`${USAGE}\n`);
  return 2;
}

module.exports = { main, noticeCommand, handleRequest, runCensus, readSeats, spawnerDir };

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
```

**A note the reviewer should rule on rather than discover.** Two shapes in this
file are written tolerantly because the CLI's exact output is measured in batch
B, not here: `shortIdOf` parses the short id out of `--bg`'s line, and
`runWithEitherId` tries the `sessionId` before the short id. Neither is load
bearing — the seat's identity comes from `claude agents --json`, not from
stdout, and `findNew` is what resolves it — so a measurement that contradicts
either is a fix-wave item and not a redesign. Tasks 7 and 9 record what the CLI
actually prints and accepts.

- [ ] **Step 1: Write the file**

Write `skills/tanto/scripts/spawner.js` with **W2.1**'s content exactly.

- [ ] **Step 2: Run the suite and see it go green**

```bash
node --test 'skills/tanto/scripts/spawner.test.js' 2>&1 | tail -20
```

Expected: `# pass 20`, `# fail 0`.

- [ ] **Step 3: Run the whole scripts suite, so nothing beside it moved**

```bash
node --test 'skills/tanto/scripts/*.test.js' 2>&1 | tail -10
```

Expected: `# fail 0`, with `boundary.test.js`'s, `reading.test.js`'s and
`passage-check.test.js`'s counts unchanged.

- [ ] **Step 4: Check the usage contract and the exports**

```bash
node skills/tanto/scripts/spawner.js; echo "exit $?"
node -e 'const s=require("./skills/tanto/scripts/spawner.js");console.log(Object.keys(s).sort().join(","))'
```

Expected: the usage line on `stderr` and `exit 2`; then
`handleRequest,main,noticeCommand,readSeats,runCensus,spawnerDir`. This is the
content check that stands in for `verify` on a `W`-only task.

- [ ] **Step 5: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/spawner.js
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 6: Commit**

```bash
git add skills/tanto/scripts/spawner.js
git commit --only skills/tanto/scripts/spawner.js -m "feat: the tanto spawner — the one process that runs claude --bg

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`.

---

### Task 3: `templates/spawn-request.md`, and `templates/tanto.json`'s two keys

**Files:**

- Create: `skills/tanto/templates/spawn-request.md`
- Modify: `skills/tanto/templates/tanto.json`

**Interfaces:**

- Consumes: task 2's `handleRequest`, whose field names this template
  documents, and whose six ops it lists in the same order.
- Produces: the sixteenth template, which `roles/kanri.md` copies from (task 21)
  and `SKILL.md`'s Artifacts and template count name (task 20); and the two
  config keys the run reads — `subagents.shoroku.review` for the fifteenth kind
  (task 19's brief dispatches it, task 20's config paragraph counts it) and
  `sessions.shoki` for the scribe seat (task 19's brief renders its Models line
  from it, task 21's close writes its spawn request from it).

**Named-mechanism sites.** The six ops listed here are task 2's `OPS` array,
task 21's request table in `roles/kanri.md`, and task 20's Artifacts row for
`.tanto/spawner/`. The field `mode` is documented here as `auto` for every seat
Kanri spawns and `manual` only in a measurement; the same sentence is in
`roles/kanri.md`'s roster paragraph (task 21) and `SKILL.md`'s roster paragraph
(task 20). `worktree` and `addDir` appear here, in task 19's brief, and in task
21's close — nowhere else. The kind name `shoroku.review` appears in this JSON,
in `templates/shoki-brief.md` (task 19), in `SKILL.md`'s kind list and the count
sentences (task 20), and in `roles/kanri.md`'s close (task 21); the definition
name it renders to is `tanto-shoroku-review`.

**Old values this task contradicts:**

None. This task adds two keys and a new file, and contradicts no sentence on
disk: the enumeration it changes is the **number** of keys, which no term
reaches, so the two anchors below are the measurement and there is no needle
to sweep. The kind-count sentences in `SKILL.md` are task 20's **O20.10** to
**O20.14**.

**Whole file:**

**W3.1** `skills/tanto/templates/spawn-request.md` — new file, 70 lines

````markdown
# tanto spawn request

Written by Kanri at `.tanto/spawner/requests/<id>.json`, and by the launcher
for the first Kanri. `<id>` is `<ISO time>-<random>`, so a directory listing
in name order is the write order. Write the file atomically — write
`<id>.json.tmp`, then rename — because the spawner watches the directory and
takes a file the moment it appears.

The spawner writes `.tanto/spawner/results/<id>.json`, the request's own
fields with the op's fields added, and deletes the request. Kanri reads a
result when it next acts; it waits for none of them.

JSON carries no comments, so the schema is one fenced example with every
field explained beside it.

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
  "sessionId": "<for stop, rm, resume, ack>",
  "message": "<for attention: one line, in the chat's language>"
}
```

- `op` — one of `spawn`, `stop`, `rm`, `resume`, `attention`, `ack`. `rm` is
  written for shoki alone; a stopped Jisso's or Keikaku's conversation is
  kept.
- `role` — `kanri`, `keikaku`, `jisso`, or `shoki`. A tab seat is never
  spawned and never has a request.
- `topic` — the topic word, or `—` for Kanri.
- `model`, `effort` — the family and the level from `sessions.<role>` in the
  merged `tanto.json`, named on the request as every dispatch names a model.
- `branch` — the branch the shared tree is on when the request is written.
- `mode` — `auto` for every seat Kanri spawns. `manual` appears in a
  measurement and nowhere else.
- `prompt` — the seat's whole orders. `/tanto kanri` for a Kanri;
  `/tanto keikaku topic=<topic> spec=<path> plan=<path>`;
  `/tanto jisso batch=<path>` for an ordinary plan and
  `/tanto jisso queue=<topic>` for a plan that edits this skill; for shoki,
  the one line `brief: <.tanto/<topic>/shoki-brief.md>`, which is not a
  `/tanto` invocation at all.
- `worktree` — shoki's `shoki-<topic>`, and absent for every other seat. The
  spawner passes it as `-w`, and the worktree is the CLI's own, under
  `.claude/worktrees/`.
- `addDir` — a list of directories, shoki's being the repository root, so
  that the scribe in its worktree can read `.tanto/`. Absent otherwise.
- `sessionId` — the seat's identity, for `stop`, `rm`, `resume`, and `ack`.
  Never a short id: the spawner maps one to the other from `seats.json`.
- `message` — `attention`'s one line. A bare `<id>` in it is filled by the
  spawner from `seats.json`, so that Kanri, which holds its own `sessionId`
  and not its short id, can still write the command the human types.

A result carries the request's fields and the op's own: `spawn` adds `id`,
`sessionId`, `name`, `cwd`, `transcript`, and `startedAt`; `stop` adds
`stopped`; `rm` adds `removed` and the worktree it removed; `resume` adds the
new `id` and `name` under the same `sessionId`; `attention` adds `notified`
and `channel`; `ack` adds `acked`. An op that failed adds `error` and the
command's stderr, and nothing else.

At the plan close the topic's results move to
`.tanto/<topic>/spawner-results/` with the archive move. The spawner deletes
nothing under `results/`.
````

**Passages:**

**P3.1** `skills/tanto/templates/tanto.json` — replace exactly these 1 lines

```json
    "shoroku.apply": { "model": "opus", "effort": "medium" },
```

**P3.1 →**

```json
    "shoroku.apply": { "model": "opus", "effort": "medium" },
    "shoroku.review": { "model": "opus", "effort": "medium" },
```

**P3.2** `skills/tanto/templates/tanto.json` — replace exactly these 1 lines

```json
    "hosa": { "model": "sonnet", "effort": "medium" }
```

**P3.2 →**

```json
    "hosa": { "model": "sonnet", "effort": "medium" },
    "shoki": { "model": "sonnet", "effort": "medium" }
```

**Anchors:**

**A3.1** `skills/tanto/templates/tanto.json` — `node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('skills/tanto/templates/tanto.json','utf8')).subagents).length)"` — before: 14, after: 15

**A3.2** `skills/tanto/templates/tanto.json` — `node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('skills/tanto/templates/tanto.json','utf8')).sessions).length)"` — before: 7, after: 8

- [ ] **Step 1: Write the template**

Write `skills/tanto/templates/spawn-request.md` with **W3.1**'s content exactly.
Note that the file contains a fenced `json` block inside itself; the outer fence
of **W3.1** is four backticks for that reason, and the file's own fences are
three.

- [ ] **Step 2: Apply the two config passages**

Apply **P3.1** and **P3.2** to `skills/tanto/templates/tanto.json`.

- [ ] **Step 3: Check the JSON and the two anchors**

```bash
node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('skills/tanto/templates/tanto.json','utf8')).subagents).length)"
node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('skills/tanto/templates/tanto.json','utf8')).sessions).length)"
node -e "const c=JSON.parse(require('fs').readFileSync('skills/tanto/templates/tanto.json','utf8'));console.log(JSON.stringify(c.subagents['shoroku.review']),JSON.stringify(c.sessions.shoki))"
```

Expected: `15`; `8`; then
`{"model":"opus","effort":"medium"} {"model":"sonnet","effort":"medium"}`.

- [ ] **Step 4: Lint**

```bash
./scripts/lint.sh skills/tanto/templates/spawn-request.md skills/tanto/templates/tanto.json
```

Expected: every hook `Passed` or `Skipped`. `skills/tanto/templates/**` is in
`.markdownlint-cli2.yaml`'s `ignores`, so markdownlint does not read the new
template; the whitespace and JSON hooks still do.

- [ ] **Step 5: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 3
```

Expected: `verify clean`.

- [ ] **Step 6: Commit, then restore the created Markdown file's line endings**

```bash
git add skills/tanto/templates/spawn-request.md
git commit --only skills/tanto/templates/spawn-request.md skills/tanto/templates/tanto.json -m "feat: the spawn request template, and tanto.json's shoroku.review and shoki keys

Co-Authored-By: Claude <noreply@anthropic.com>"
git checkout -- skills/tanto/templates/spawn-request.md
git status --porcelain
```

Expected: one commit; the `git checkout --` line is the line-ending restore
Global Constraints requires of every task that creates a Markdown file on this
host, and `git status --porcelain` prints nothing after it.

---

### Task 4: `reading.js` — the `loadSessions(root)` export

**Files:**

- Modify: `skills/tanto/scripts/reading.js`
- Test: `skills/tanto/scripts/reading.test.js`

**Interfaces:**

- Consumes: task 3's `sessions.shoki`, which the first case below counts.
- Produces, for task 6's launcher:
  `loadSessions(root, explicitConfig, explicitProjectConfig)` → the merged
  `sessions` map, `{ <role>: { model, effort } }`, the built-in template
  overlaid by the personal file and then by `<root>/.claude/tanto.json`, field
  by field, a bare string setting `model` alone. It takes `root` because the
  launcher's cwd is the human's, not the repository's, and the unexported
  `projectConfigPathOf` reads `process.cwd()`.

**Named-mechanism sites.** `loadSessions` is named here, in
`skills/tanto/scripts/tanto.js` (task 6), in `SKILL.md`'s Artifacts row for
`reading.js` and the executables paragraph (task 20), and in `README.md`'s
Layout bullet for `reading.js` (task 23). The `--presence` switch this file
keeps is named in `templates/boundary-brief.md` (task 23), `roles/kanri.md`'s
trigger (task 21), and `SKILL.md`'s config paragraph (task 20) — the instrument
stays; only the rules that acted on its verdict go.

**Old values this task contradicts:** none. `loadCeiling` keeps its name, its
signature, and its behavior; this task adds an export beside it and changes no
sentence anywhere. The count of `reading.js`'s exports is stated in no file.

**Passages:**

**P4.1** `skills/tanto/scripts/reading.js` — insert after these 2 lines

```javascript
  return { ceiling, warnings, paths: { personal: configFile, project: projectFile } };
}
```

**P4.1 →**

```javascript

/**
 * The merged `sessions` map for a repository root: the shipped
 * `templates/tanto.json`, then the personal file, then
 * `<root>/.claude/tanto.json`, overlaid field by field, with a bare string
 * setting `model` and leaving `effort` to the layers below.
 *
 * `root` is a parameter rather than `process.cwd()` because the one caller
 * is the launcher, which the human runs from wherever they are standing;
 * every other reader of this config is a session already bound to its cwd.
 * Unknown keys are not reported here: this is a lookup for one seat's family
 * and effort, and the start sequence is where a config file is audited.
 */
function loadSessions(root, explicitConfig, explicitProjectConfig) {
  const sessions = {};
  const layers = [
    readJson(path.join(__dirname, "..", "templates", "tanto.json")),
    readJson(configPathOf(explicitConfig)),
    readJson(explicitProjectConfig || path.join(root, ".claude", "tanto.json")),
  ];
  for (const layer of layers) {
    const source = layer && layer.sessions;
    if (!source || typeof source !== "object") continue;
    for (const [role, value] of Object.entries(source)) {
      if (!sessions[role]) sessions[role] = {};
      if (typeof value === "string") {
        sessions[role].model = value;
      } else if (value && typeof value === "object") {
        Object.assign(sessions[role], value);
      }
    }
  }
  return sessions;
}
```

**P4.2** `skills/tanto/scripts/reading.js` — replace exactly these 6 lines

```javascript
module.exports = {
  readTranscript,
  loadCeiling,
  ceilingOf,
  main,
};
```

**P4.2 →**

```javascript
module.exports = {
  readTranscript,
  loadCeiling,
  loadSessions,
  ceilingOf,
  main,
};
```

**P4.3** `skills/tanto/scripts/reading.test.js` — insert after these 8 lines

```javascript
test("the unavailable form still prints three lines", () => {
  const result = run([path.join(tmpDir(), "gone.jsonl")]);
  assert.strictEqual(result.code, 0);
  const lines = result.out.split("\n");
  assert.match(lines[0], /^transcript: unavailable — /);
  assert.strictEqual(lines[1], "effort=unknown");
  assert.strictEqual(lines[2], "ttl=unknown");
});
```

**P4.3 →**

```javascript

test("loadSessions returns the built-in seats when no file overrides them", () => {
  const { loadSessions } = require("./reading.js");
  const root = tmpDir();
  const sessions = loadSessions(root, path.join(EMPTY_CONFIG_DIR, "tanto.json"));
  assert.strictEqual(Object.keys(sessions).length, 8);
  assert.deepStrictEqual(sessions.kanri, { model: "sonnet", effort: "high" });
  assert.deepStrictEqual(sessions.shoki, { model: "sonnet", effort: "medium" });
});

test("loadSessions overlays the project file field by field", () => {
  const { loadSessions } = require("./reading.js");
  const root = tmpDir();
  fs.mkdirSync(path.join(root, ".claude"));
  fs.writeFileSync(
    path.join(root, ".claude", "tanto.json"),
    JSON.stringify({ sessions: { kanri: { effort: "medium" } } }),
  );
  const sessions = loadSessions(root, path.join(EMPTY_CONFIG_DIR, "tanto.json"));
  assert.deepStrictEqual(sessions.kanri, { model: "sonnet", effort: "medium" });
});

test("loadSessions takes a bare string as the model alone", () => {
  const { loadSessions } = require("./reading.js");
  const root = tmpDir();
  const personal = path.join(tmpDir(), "tanto.json");
  fs.writeFileSync(personal, JSON.stringify({ sessions: { shoki: "opus" } }));
  const sessions = loadSessions(root, personal);
  assert.deepStrictEqual(sessions.shoki, { model: "opus", effort: "medium" });
});
```

**Anchors:**

**A4.1** `skills/tanto/scripts/reading.js` — `node -e "console.log(typeof require('./skills/tanto/scripts/reading.js').loadSessions)"` — before: undefined, after: function

- [ ] **Step 1: Write the failing cases**

Apply **P4.3** to `skills/tanto/scripts/reading.test.js`.

- [ ] **Step 2: Run them and see them fail**

```bash
node --test 'skills/tanto/scripts/reading.test.js' 2>&1 | tail -20
```

Expected: three failures, each `TypeError: loadSessions is not a function`.

- [ ] **Step 3: Add the export**

Apply **P4.1** and **P4.2** to `skills/tanto/scripts/reading.js`.

- [ ] **Step 4: Run the whole scripts suite**

```bash
node --test 'skills/tanto/scripts/*.test.js' 2>&1 | tail -10
node -e "console.log(typeof require('./skills/tanto/scripts/reading.js').loadSessions)"
```

Expected: `# fail 0`, with `reading.test.js`'s count three higher than before;
then `function`, which is **A4.1**'s `after` value.

- [ ] **Step 5: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 4
```

Expected: `verify clean`.

- [ ] **Step 7: Commit**

```bash
git commit --only skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js -m "feat: reading.js exports loadSessions for the launcher

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`.

---

### Task 5: `scripts/tanto.test.js` — the launcher's whole failing suite

**Files:**

- Create (test): `skills/tanto/scripts/tanto.test.js`

**Interfaces:**

- Consumes: task 2's spawner, which these tests let the launcher start for
  real — a detached Node child driving the same fake CLI — because "the
  launcher starts the spawner" is one of the properties under test. Every
  workspace is torn down with `tanto.js down`, so no resident is left behind.
- Produces: the launcher's contract, stated as assertions. Twelve tests: the
  usage line; a root that is not a git top level; the first run's two written
  files and its `spawn` request; that an existing `.gitignore` is never
  overwritten; idempotence against a live background Kanri; the interactive
  first row; the handover file overriding the roster; the resume of a lost
  seat and the second printed line; a `stopped` seat left alone; `down`;
  `down --seats`; and that the launcher itself never runs `claude --bg`.

**Named-mechanism sites.** The two printed lines — `claude attach <id>` and the
`/tanto fukki` second line — are the ones `SKILL.md`'s Resuming and fukki
paragraph (task 20), `roles/kanri.md`'s Recovery (task 21), and `README.md`'s
Usage (task 23) name, and the `attention` notice's text in task 2 carries the
first of them. The roster columns this file writes into its fixtures are
`templates/roster.md`'s eleven (task 17), in that order.

**Old values this task contradicts:** none; a new test file contradicts no
sentence on disk.

**Whole file:**

**W5.1** `skills/tanto/scripts/tanto.test.js` — new file, 238 lines

```javascript
// The launcher's tests. The CLI is the same fake Node script the spawner's
// tests use, named through TANTO_CLAUDE_NODE; the spawner itself is real,
// because "the launcher starts the spawner, and never runs claude --bg
// itself" is one of the properties under test. Every workspace is stopped in
// teardown.

const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const LAUNCHER = path.join(__dirname, "tanto.js");
// The fake is spawner.test.js's, read out of its source rather than copied,
// so that one file defines the CLI's behavior. The guard turns a silent
// extraction failure into a named one.
const FAKE = fs.readFileSync(path.join(__dirname, "spawner.test.js"), "utf8")
  .split("const FAKE = `")[1]
  .split("`;")[0]
  .replace(/\\\\n/g, "\\n");
if (!FAKE.includes("Started background session")) {
  throw new Error("the fake CLI could not be read out of spawner.test.js");
}

const workspaces = [];
after(() => {
  for (const ws of workspaces) {
    try {
      launch(ws, ["down", ws.root]);
    } catch {
      // Best-effort teardown: a spawner already stopped is the ordinary case.
    }
  }
});

let counter = 0;

function workspace(sessions = []) {
  counter += 1;
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `tanto-launch-${counter}-`)));
  spawnSync("git", ["init", "--quiet", root], { encoding: "utf8" });
  const fake = path.join(root, "fake-claude.js");
  fs.writeFileSync(fake, FAKE);
  const state = path.join(root, "fake-state.json");
  fs.writeFileSync(state, JSON.stringify({ root, sessions, next: {} }));
  const ws = { root, fake, state, log: path.join(root, "fake-log.txt") };
  workspaces.push(ws);
  return ws;
}

function launch(ws, argv) {
  const result = spawnSync(process.execPath, [LAUNCHER, ...argv], {
    encoding: "utf8",
    cwd: ws.root,
    env: {
      ...process.env,
      TANTO_CLAUDE_NODE: ws.fake,
      TANTO_NOTICE_LOG: path.join(ws.root, "notices.txt"),
      CLAUDE_CONFIG_DIR: ws.root,
      FAKE_STATE: ws.state,
      FAKE_LOG: ws.log,
    },
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

function requests(ws) {
  const dir = path.join(ws.root, ".tanto", "spawner", "requests");
  const results = path.join(ws.root, ".tanto", "spawner", "results");
  const seen = [];
  for (const place of [dir, results]) {
    if (!fs.existsSync(place)) continue;
    for (const name of fs.readdirSync(place).sort()) {
      if (name.endsWith(".json")) seen.push(JSON.parse(fs.readFileSync(path.join(place, name), "utf8")));
    }
  }
  return seen;
}

function calls(ws) {
  if (!fs.existsSync(ws.log)) return [];
  return fs.readFileSync(ws.log, "utf8").split("\n").filter((l) => l.length > 0).map((l) => JSON.parse(l));
}

const ROSTER_HEAD = [
  "# tanto roster",
  "",
  "| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
];

function writeRoster(ws, status, transcript) {
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  const row = `| kanri | — | seat-live [ffffff] | ${ws.root} | sonnet | high | main | auto | 2026-09-21 09:00 | ${status} | ${transcript} |`;
  fs.writeFileSync(path.join(ws.root, ".tanto", "roster.md"), `${[...ROSTER_HEAD, row].join("\n")}\n`);
}

function writeSeats(ws, seats) {
  const dir = path.join(ws.root, ".tanto", "spawner");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "seats.json"), JSON.stringify({ seats }));
}

test("--help prints the usage line and exits 2", () => {
  const ws = workspace();
  const got = launch(ws, ["--help"]);
  assert.equal(got.code, 2);
  assert.match(got.err, /^Usage: tanto/);
});

test("a root that is not a git top level is refused", () => {
  const ws = workspace();
  const inner = path.join(ws.root, "sub");
  fs.mkdirSync(inner);
  const got = launch(ws, [inner]);
  assert.equal(got.code, 2);
  assert.match(got.err, /top level/);
});

test("the first run writes the two workspace files and asks for a Kanri", () => {
  const ws = workspace();
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(got.code, 0);
  assert.equal(fs.readFileSync(path.join(ws.root, ".tanto", ".gitignore"), "utf8").trim(), "*");
  assert.match(fs.readFileSync(path.join(ws.root, ".tanto", ".markdownlint-cli2.yaml"), "utf8"), /default: false/);
  const asked = requests(ws).find((r) => r.op === "spawn");
  assert.equal(asked.role, "kanri");
  assert.equal(asked.prompt.includes("kanri"), true);
  assert.equal(asked.model, "sonnet");
  assert.equal(asked.effort, "high");
  assert.equal(asked.mode, "auto");
  assert.match(got.out, /claude attach bg01/);
});

test("an existing .gitignore is never overwritten", () => {
  const ws = workspace();
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  fs.writeFileSync(path.join(ws.root, ".tanto", ".gitignore"), "# mine\n");
  launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(fs.readFileSync(path.join(ws.root, ".tanto", ".gitignore"), "utf8"), "# mine\n");
});

test("a live background Kanri is attached to, not spawned again", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.match(got.out, /claude attach bg07/);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("an interactive first row is reported and not attached to", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "interactive", id: "tab1" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.match(got.out, /interactive tab; hand over first/);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("a handover file asks for a Kanri whatever the roster says", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "interactive", id: "tab1" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  fs.writeFileSync(path.join(ws.root, ".tanto", "kanri-handover.md"), "# tanto Kanri handover\n");
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 1);
  assert.match(got.out, /claude attach bg01/);
});

test("a running seat the listing lost is resumed, and fukki is printed", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-gone", id: "bg08", name: "seat-gone [eeeeee]", role: "jisso", status: "running" },
  ]);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  const resumed = requests(ws).filter((r) => r.op === "resume");
  assert.equal(resumed.length, 1);
  assert.equal(resumed[0].sessionId, "sess-gone");
  assert.match(got.out, /tanto fukki/);
});

test("a stopped seat is not resumed", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [{ sessionId: "sess-old", id: "bg05", name: "seat-old [dddddd]", role: "jisso", status: "stopped" }]);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 0);
  assert.equal(/tanto fukki/.test(got.out), false);
});

test("down stops the spawner and removes its pidfile", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, [ws.root, "--timeout", "20000"]);
  const pidfile = path.join(ws.root, ".tanto", "spawner", "pid");
  assert.equal(fs.existsSync(pidfile), true);
  const got = launch(ws, ["down", ws.root]);
  assert.equal(got.code, 0);
  assert.equal(fs.existsSync(pidfile), false);
});

test("down --seats writes a stop request for every running seat", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, [ws.root, "--timeout", "20000"]);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-old", id: "bg05", name: "seat-old [dddddd]", role: "jisso", status: "stopped" },
  ]);
  launch(ws, ["down", ws.root, "--seats", "--timeout", "20000"]);
  const stops = requests(ws).filter((r) => r.op === "stop");
  assert.deepEqual(stops.map((r) => r.sessionId), ["sess-live"]);
});

test("the launcher itself never runs claude --bg", () => {
  const ws = workspace();
  launch(ws, [ws.root, "--timeout", "20000"]);
  const own = calls(ws).filter((argv) => argv.includes("--bg"));
  assert.equal(own.length, 1);
  const seats = JSON.parse(fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "seats.json"), "utf8")).seats;
  assert.equal(seats[0].role, "kanri");
});
```

- [ ] **Step 1: Write the file**

Write `skills/tanto/scripts/tanto.test.js` with **W5.1**'s content exactly.

- [ ] **Step 2: Run it and see it fail for the one right reason**

```bash
node --test 'skills/tanto/scripts/tanto.test.js' 2>&1 | tail -20
```

Expected: every test fails, and the failure is `Cannot find module` for
`tanto.js`, or a `null` exit status from `spawnSync` on a path that is not
there. Any other shape means the test file is wrong.

- [ ] **Step 3: Check the file's own shape**

```bash
node --check skills/tanto/scripts/tanto.test.js
grep -c '^test(' skills/tanto/scripts/tanto.test.js
```

Expected: nothing from `--check`; `12`.

- [ ] **Step 4: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/tanto.test.js
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 5: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 5
```

Expected: `no passages`.

- [ ] **Step 6: Commit**

```bash
git add skills/tanto/scripts/tanto.test.js
git commit --only skills/tanto/scripts/tanto.test.js -m "test: the launcher's suite, over a real spawner and a fake CLI

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`.

---

### Task 6: `scripts/tanto.js`, `tanto.bat`, `tanto.sh` — the human's one command

**Files:**

- Create: `skills/tanto/scripts/tanto.js`
- Create: `skills/tanto/scripts/tanto.bat`
- Create: `skills/tanto/scripts/tanto.sh`
- Test: `skills/tanto/scripts/tanto.test.js` (task 5, unchanged here)

**Interfaces:**

- Consumes: `loadSessions(root, …)` from task 4; `readSeats(root)` and
  `spawnerDir(root)` from task 2; the request schema task 3 documents.
- Produces: the command `README.md`'s Usage names (task 23),
  `roles/kanri.md`'s close prints as its one line to the human (task 21), and
  `SKILL.md`'s fukki paragraph names as the way a terminal seat is resumed
  (task 20). Its printed lines are exactly two: `claude attach <id>`, and, on a
  resume, `then type /tanto fukki there once`.

**Named-mechanism sites.** `tanto` and `tanto down [--seats]` are named here,
in `README.md`'s Usage and Prerequisites (task 23), in `SKILL.md`'s Invocation
and Resuming (task 20), in `roles/kanri.md`'s Recovery and its close's commands
(task 21), and in `templates/kanri-handover.md`'s one-line Commands section
(task 23). The two workspace files this script writes when absent —
`.tanto/.gitignore` and `.tanto/.markdownlint-cli2.yaml` — are the same two
`roles/kanri.md`'s Start step 2 writes (unchanged by this plan) and
`SKILL.md`'s Artifacts row names: three writers now, none of which overwrites.

**Old values this task contradicts:** none of its own; see task 2's note. The
sentence that a consuming repository carries no launcher is `README.md`'s, and
`README.md` says nothing about one today, so there is nothing to retire — the
Requirements bullet that states it is the close's, not this plan's.

**Whole file:**

**W6.1** `skills/tanto/scripts/tanto.js` — new file, 300 lines

```javascript
// No shebang: the two wrappers beside this file are what is invoked bare,
// and they name `node` themselves. This is the human's one command — it
// starts the spawner, finds or asks for a Kanri, puts back what a restart
// took, and prints the one line the human types next. It is idempotent, and
// it never runs `claude --bg` itself: its Kanri goes through the spawner
// like every other seat.

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");
const { loadSessions } = require("./reading.js");
const { readSeats, spawnerDir } = require("./spawner.js");

const USAGE = "Usage: tanto [<root>], or tanto down [<root>] [--seats]";
const SPAWNER = path.join(__dirname, "spawner.js");
const WAIT_MS = 60000;
const POLL_MS = 250;
const GITIGNORE = "*\n";
const MARKDOWNLINT = "config:\n  default: false\n";

function parseArgs(argv) {
  const values = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      values[arg.slice(2)] = true;
    } else {
      values[arg.slice(2)] = next;
      i++;
    }
  }
  return { values, positionals };
}

function fail(message) {
  process.stderr.write(`${message}\n`);
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function sameDir(a, b) {
  const norm = (p) => path.resolve(p).replace(/\\/g, "/").replace(/\/$/, "");
  const one = norm(a);
  const two = norm(b);
  return process.platform === "win32" ? one.toLowerCase() === two.toLowerCase() : one === two;
}

/** The root, checked to be a git top level, or null with a line said. */
function resolveRoot(given) {
  const candidate = path.resolve(given || process.cwd());
  const got = spawnSync("git", ["-C", candidate, "rev-parse", "--show-toplevel"], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (got.status !== 0) {
    fail(`tanto: ${candidate} is not inside a git repository`);
    return null;
  }
  if (!sameDir(got.stdout.trim(), candidate)) {
    fail(`tanto: ${candidate} is not a git repository's top level (${got.stdout.trim()} is)`);
    return null;
  }
  return candidate;
}

function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || "claude", args };
}

function listAgents(root) {
  const command = claudeCommand(["agents", "--json", "--cwd", root]);
  const got = spawnSync(command.file, command.args, { encoding: "utf8", windowsHide: true });
  if (got.status !== 0) return [];
  try {
    const parsed = JSON.parse(got.stdout || "");
    if (Array.isArray(parsed)) return parsed;
    return Array.isArray(parsed.sessions) ? parsed.sessions : [];
  } catch {
    return [];
  }
}

/** Write each of the two workspace files only when it is absent. */
function ensureWorkspace(root) {
  fs.mkdirSync(path.join(root, ".tanto"), { recursive: true });
  const files = [
    [path.join(root, ".tanto", ".gitignore"), GITIGNORE],
    [path.join(root, ".tanto", ".markdownlint-cli2.yaml"), MARKDOWNLINT],
  ];
  for (const [file, body] of files) {
    if (!fs.existsSync(file)) fs.writeFileSync(file, body);
  }
  fs.mkdirSync(path.join(spawnerDir(root), "requests"), { recursive: true });
  fs.mkdirSync(path.join(spawnerDir(root), "results"), { recursive: true });
}

function pidPath(root) {
  return path.join(spawnerDir(root), "pid");
}

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
    return null;
  }
}

function startSpawner(root) {
  if (livePid(root)) return false;
  const log = fs.openSync(path.join(spawnerDir(root), "log"), "a");
  const child = spawn(process.execPath, [SPAWNER, "run", "--root", root], {
    cwd: root,
    detached: true,
    stdio: ["ignore", log, log],
    windowsHide: true,
  });
  child.unref();
  for (let i = 0; i < 40 && !livePid(root); i++) sleepSync(POLL_MS);
  return true;
}

function writeRequest(root, body) {
  const id = `${new Date().toISOString().replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 8)}`;
  const file = path.join(spawnerDir(root), "requests", `${id}.json`);
  fs.writeFileSync(`${file}.tmp`, `${JSON.stringify(body, null, 2)}\n`);
  fs.renameSync(`${file}.tmp`, file);
  return id;
}

function waitForResult(root, id, waitMs) {
  const file = path.join(spawnerDir(root), "results", `${id}.json`);
  const until = Date.now() + waitMs;
  while (Date.now() < until) {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      sleepSync(POLL_MS);
    }
  }
  return null;
}

/** The roster's first data row, as its eleven cells, or null. */
function firstRosterRow(root) {
  let lines;
  try {
    lines = fs.readFileSync(path.join(root, ".tanto", "roster.md"), "utf8").split(/\r?\n/);
  } catch {
    return null;
  }
  const head = lines.findIndex((line) => /^\|\s*Role\s*\|/.test(line));
  if (head === -1) return null;
  const row = lines[head + 2];
  if (!row || !row.startsWith("|")) return null;
  const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
  if (cells.length < 11) return null;
  return { name: cells[2], status: cells[9], sessionId: path.basename(cells[10], ".jsonl") };
}

/** The branch the shared tree is on, which the request schema asks for. */
function branchOf(root) {
  const got = spawnSync("git", ["-C", root, "rev-parse", "--abbrev-ref", "HEAD"], {
    encoding: "utf8",
    windowsHide: true,
  });
  return got.status === 0 ? got.stdout.trim() : "";
}

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
  if (!root) return 2;
  const waitMs = values.timeout ? Number(values.timeout) : WAIT_MS;
  const sessions = loadSessions(root);
  ensureWorkspace(root);
  startSpawner(root);

  const listing = listAgents(root);
  const byId = new Map(listing.filter((s) => s.sessionId).map((s) => [s.sessionId, s]));
  const handover = fs.existsSync(path.join(root, ".tanto", "kanri-handover.md"));
  const row = firstRosterRow(root);
  const listed = row ? byId.get(row.sessionId) : null;

  let attach = null;
  if (!handover && listed && row.status.startsWith("live") && listed.kind === "background") {
    attach = listed.id || row.sessionId;
  } else if (!handover && listed && row.status.startsWith("live")) {
    process.stdout.write("Kanri is an interactive tab; hand over first\n");
  } else {
    const id = writeRequest(root, kanriRequest(root, sessions));
    const result = waitForResult(root, id, waitMs);
    if (!result) {
      fail("tanto: the spawner wrote no result for the Kanri request; see .tanto/spawner/log");
      return 1;
    }
    if (result.error) {
      fail(`tanto: the Kanri spawn failed — ${result.error}`);
      return 1;
    }
    attach = result.id || result.sessionId;
  }

  let resumed = 0;
  for (const seat of readSeats(root)) {
    if (seat.status !== "running" && seat.status !== "blocked") continue;
    if (byId.has(seat.sessionId)) continue;
    writeRequest(root, { op: "resume", role: seat.role, topic: seat.topic, sessionId: seat.sessionId });
    resumed += 1;
  }

  if (attach) process.stdout.write(`claude attach ${attach}\n`);
  if (resumed > 0) process.stdout.write("then type /tanto fukki there once\n");
  return 0;
}

function cmdDown(argv) {
  const { values, positionals } = parseArgs(argv);
  const root = resolveRoot(positionals[0]);
  if (!root) return 2;
  const waitMs = values.timeout ? Number(values.timeout) : WAIT_MS;

  if (values.seats) {
    const ids = [];
    for (const seat of readSeats(root)) {
      if (seat.status !== "running" && seat.status !== "blocked") continue;
      ids.push(writeRequest(root, { op: "stop", role: seat.role, topic: seat.topic, sessionId: seat.sessionId }));
    }
    for (const id of ids) waitForResult(root, id, waitMs);
  }

  const pid = livePid(root);
  if (!pid) {
    process.stdout.write("no spawner running\n");
    try {
      fs.rmSync(pidPath(root), { force: true });
    } catch {
      // Nothing to remove is the ordinary case here.
    }
    return 0;
  }
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // Already gone between the check and the signal.
  }
  for (let i = 0; i < 40 && livePid(root); i++) sleepSync(POLL_MS);
  fs.rmSync(pidPath(root), { force: true });
  process.stdout.write("tanto down: spawner stopped; the conversations are kept\n");
  return 0;
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  if (argv[0] === "down") return cmdDown(argv.slice(1));
  return cmdUp(argv);
}

module.exports = { main };

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
```

**W6.2** `skills/tanto/scripts/tanto.bat` — new file, 2 lines

```bat
@echo off
node "%~dp0tanto.js" %*
```

**W6.3** `skills/tanto/scripts/tanto.sh` — new file, 2 lines

```bash
#!/usr/bin/env sh
exec node "$(dirname "$0")/tanto.js" "$@"
```

**The two wrappers are the only files of this skill invoked bare**, which is
why `tanto.sh` carries a shebang and the other four scripts do not. Task 20's
passage on `SKILL.md`'s executables paragraph is where that sentence is
rewritten from "None is ever invoked bare" to name the five scripts.

- [ ] **Step 1: Write the three files**

Write **W6.1**, **W6.2**, and **W6.3** exactly. `.gitattributes` pins `*.bat`
to `eol=crlf` and `*.sh` to `eol=lf`, so write each with the ending its pin
names and neither needs a restore.

- [ ] **Step 2: Run the launcher's suite**

```bash
node --test 'skills/tanto/scripts/tanto.test.js' 2>&1 | tail -20
```

Expected: `# pass 12`, `# fail 0`. Each test starts a real spawner and stops it
in teardown, so the suite takes a few seconds per case; a case that hangs means
a spawner was left running, and `node skills/tanto/scripts/tanto.js down <root>`
against that temp root is the cleanup.

- [ ] **Step 3: Run the whole scripts suite**

```bash
node --test 'skills/tanto/scripts/*.test.js' 2>&1 | tail -10
```

Expected: `# fail 0`.

- [ ] **Step 4: Check the usage contract and the wrappers**

```bash
node skills/tanto/scripts/tanto.js --help; echo "exit $?"
node --check skills/tanto/scripts/tanto.js
head -1 skills/tanto/scripts/tanto.sh
git check-attr eol -- skills/tanto/scripts/tanto.bat skills/tanto/scripts/tanto.sh
```

Expected: the usage line and `exit 2`; nothing from `--check`;
`#!/usr/bin/env sh`; then `eol: crlf` for the `.bat` and `eol: lf` for the
`.sh`. This is the content check that stands in for `verify` on a `W`-only
task.

- [ ] **Step 5: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.bat skills/tanto/scripts/tanto.sh
```

Expected: every hook `Passed` or `Skipped`. The `shellcheck` hook, if the
repository runs one, reads `tanto.sh`; its two lines are POSIX `sh`.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 6
```

Expected: `no passages`.

- [ ] **Step 7: Commit**

```bash
git add skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.bat skills/tanto/scripts/tanto.sh
git commit --only skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.bat skills/tanto/scripts/tanto.sh -m "feat: tanto, the launcher — one command that starts a run and resumes it

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`.

---

### Task 7: measure that a `--bg` initial prompt of `/tanto kanri` invokes the skill

**Files:**

- Modify: `skills/tanto/templates/spawn-request.md` — one paragraph, by the
  step 5 below that the measurement selects. The path carries a `created:`
  declaration and a `W` block in task 3, so it takes **no** `P` block here:
  `replay` copies no base for a created path, and `diff` exempts it from its
  line accounting. Step 5 writes the chosen text out in full instead.
- Report: `.tanto/tanto-bg-seats/verification-1-prompt-form.md` — untracked
  under `.tanto/.gitignore`.

**This is a sweep-and-check task**, and a `replay-skip` one: its deliverable
is recorded output, and the fixture it needs is a real `claude --bg` process
started by a real spawner in a scratch clone. No dry run can hold that, and
faking it is exactly what this task exists to stop doing. Its reviewer reads
the report, not a diff.

**Interfaces:**

- Consumes: tasks 2, 3, and 6 — the spawner, the request template, and the
  launcher, all on disk and all exercised here for the first time against the
  real CLI.
- Produces: the settled prompt form, written into
  `templates/spawn-request.md`, which task 21's `roles/kanri.md` request table
  copies and task 20's `SKILL.md` Invocation section describes. Tasks 8 to 15
  reuse the scratch-clone recipe below, each making its own.

**Named-mechanism sites.** The prompt form settled here appears in
`templates/spawn-request.md`'s `prompt` bullet (this task), in
`roles/kanri.md`'s four request rows (task 21), and in `SKILL.md`'s Invocation
table of keys (task 20). If the fallback wins, all three say the fallback, and
the role files still never see the difference — the seat reads its keys either
way.

**Old values this task contradicts:** none. The spec's own sentence that this
is "unverified, and the plan's first task" is the spec's, and the spec is not
edited by this plan.

- [ ] **Step 1: Make the scratch clone**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v1"
rm -rf "$scratch"
git clone --quiet --no-hardlinks . "$scratch"
git -C "$scratch" checkout --quiet -b measure
git -C "$scratch" rev-parse --show-toplevel
```

Expected: the clone's own path. Every command below names `$scratch`
explicitly or runs inside `( cd "$scratch" && … )`: a bare `cd` in this shell
persists across the rest of the call and has once left a stray symlink in the
real tree.

**Every fence below re-derives `$scratch` on its own first line.** Shell
state does not survive a Bash tool call — the variable set here is gone by
the next fence, as this plan says of `$TANTO` elsewhere — and the assignment
is deterministic, so re-running it names the same clone. It is also the
literal `"$scratch"` that Global Constraints' `replay-skip` pattern keys on,
which is why no fence of this task may drop it.

- [ ] **Step 2: Start the launcher there, and let it ask for a Kanri**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v1"
( cd "$scratch" && node "$PWD/skills/tanto/scripts/tanto.js" "$scratch" )
```

Expected: `claude attach <id>` on stdout within sixty seconds. Record the exact
line. The launcher started the spawner, the spawner ran
`claude --bg --model sonnet --effort high --permission-mode auto "/tanto kanri"`,
and the request and result files under `$scratch/.tanto/spawner/` are the
record of it.

- [ ] **Step 3: Read whether the seat invoked the skill**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v1"
cat "$scratch"/.tanto/spawner/results/*.json
claude agents --json --cwd "$scratch"
node skills/tanto/scripts/reading.js "$(node -e 'const r=require("fs").readFileSync(process.argv[1],"utf8");console.log(JSON.parse(r).transcript)' "$(ls "$scratch"/.tanto/spawner/results/*.json | head -1)")"
```

Expected: the result's `sessionId`, `name`, `cwd`, and `transcript`; the
listing showing that session as `kind: background`; and a reading of its
transcript with a non-zero record count. **The answer this task is for** is
whether that transcript's first assistant records show the tanto start
sequence — a start line naming the config files and the agent definitions, and
a roster written at `$scratch/.tanto/roster.md`. Check both:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v1"
ls "$scratch/.tanto/roster.md" && head -20 "$scratch/.tanto/roster.md"
grep -c 'tanto' "$(node -e 'const r=require("fs").readFileSync(process.argv[1],"utf8");console.log(JSON.parse(r).transcript)' "$(ls "$scratch"/.tanto/spawner/results/*.json | head -1)")" || true
```

Expected: a roster with Kanri's own first row means the slash command
resolved. No roster and a transcript whose first assistant turn answers the
literal text `/tanto kanri` as prose means it did not. The `grep -c` runs
over the **transcript** the result names, not over the result JSON itself:
the result always carries the word `tanto` in its own fields, so grepping it
would answer nothing.

- [ ] **Step 4: If it did not resolve, measure the fallback**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v1"
( cd "$scratch" && node -e '
const fs = require("node:fs");
const dir = process.argv[1] + "/.tanto/spawner/requests";
const body = {
  op: "spawn", role: "kanri", topic: "—", model: "sonnet", effort: "high",
  branch: "measure", mode: "auto",
  prompt: "Invoke the Skill tool with skill \"tanto\" and args \"kanri\", and follow it",
};
fs.writeFileSync(dir + "/2026-09-21T00-00-00-fallb1.json", JSON.stringify(body));
' "$scratch" )
sleep 30
cat "$scratch"/.tanto/spawner/results/*fallb1.json
ls "$scratch/.tanto/roster.md"
```

Expected: run this step **only** when step 3 answered no. A roster written
after it means the fallback form of the spec's 1.6 is the one the request
carries from now on. If neither form invokes the skill, stop and raise a
`human-needed:` line naming both outcomes — that is a scope question the spec
did not anticipate, and no later task can proceed past it.

- [ ] **Step 5: Write the settled form into the template**

When step 3 answered **yes**, append this sentence to the `prompt` bullet of
`skills/tanto/templates/spawn-request.md`, as its last sentence:

```text
  A slash command in a `--bg` initial prompt invokes the skill, measured
  2026-09-21 against CLI 2.1.278; no other form is needed.
```

When step 4 was the one that worked, replace the **whole** `prompt` bullet —
its six lines, from `` - `prompt` — the seat's whole orders. `` through
`` `/tanto` invocation at all. `` — with this text, which is written out in
full so that nothing has to be inferred about what stays:

```text
- `prompt` — the seat's whole orders, in the one form a `--bg` initial
  prompt resolves: `Invoke the Skill tool with skill "tanto" and args
  "<role> <keys>", and follow it`, measured 2026-09-21 against CLI 2.1.278,
  a slash command in that position having been measured not to resolve. The
  keys are the same either way: `kanri` for a Kanri;
  `keikaku topic=<topic> spec=<path> plan=<path>`; `jisso batch=<path>` for
  an ordinary plan and `jisso queue=<topic>` for a plan that edits this
  skill; for shoki, the one line
  `brief: <.tanto/<topic>/shoki-brief.md>`, which invokes no skill at all
  and is passed as the prompt unchanged.
```

Only one of the two cases runs: step 3 answered yes, or step 4 did. When
step 3 answered yes the bullet is left as task 3 wrote it and only the one
sentence above is appended.

- [ ] **Step 6: Write the report and tear the clone down**

Write `.tanto/tanto-bg-seats/verification-1-prompt-form.md`: the spec's
Verification item 1 quoted, each command above with its output, the one-line
answer, and the sentence that went into the template. Then:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v1"
node skills/tanto/scripts/tanto.js down "$scratch" --seats
rm -rf "$scratch"
git status --porcelain
```

Expected: the spawner stopped and the clone gone; `git status --porcelain`
shows only `skills/tanto/templates/spawn-request.md`, if step 5 changed it.

- [ ] **Step 7: Lint, verify, and commit — only if step 5 changed the template**

```bash
./scripts/lint.sh skills/tanto/templates/spawn-request.md
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 7
git commit --only skills/tanto/templates/spawn-request.md -m "docs: the measured --bg prompt form, in the spawn request template

Co-Authored-By: Claude <noreply@anthropic.com>"
git checkout -- skills/tanto/templates/spawn-request.md
git status --porcelain
```

Expected: lint clean; `no passages` from `verify`, this task carrying none; one
commit; the line-ending restore after it; nothing from `git status
--porcelain`.

---

### Task 8: measure that a real Jisso batch under `auto` stays in the single tree

**Files:**

- Modify: none.
- Report: `.tanto/tanto-bg-seats/verification-2-single-tree.md`.

**This is a sweep-and-check task**, and a `replay-skip` one: it needs a real
`--bg` session doing real work under a real permission mode, and a second one
under `manual` with a gated tool. Its deliverable is the report.

**Interfaces:**

- Consumes: tasks 2 and 6, and task 7's answer for the prompt form.
- Produces: the answer to issue-aa37 — whether the ad hoc worktree happens
  under `auto` at all — and the first real exercise of task 2's guard. The
  answer decides whether issue-aa37 closes at the T2 apply or stays open with
  the guard as its interim; that ruling is the close's, not this task's.

**Named-mechanism sites.** The guard is named in `scripts/spawner.js` (task 2),
in task 1's suite, and in `SKILL.md`'s Workspace worktree sentence (task 20);
the mode word `manual` appears in `templates/spawn-request.md`'s `mode` bullet
(task 3) and in this measurement, and nowhere else in the skill.

**Old values this task contradicts:** none.

- [ ] **Step 1: Make the scratch clone and start the spawner**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v2"
rm -rf "$scratch"
git clone --quiet --no-hardlinks . "$scratch"
git -C "$scratch" checkout --quiet -b measure
node skills/tanto/scripts/spawner.js run --root "$scratch" &
sleep 3
cat "$scratch/.tanto/spawner/pid"
```

Expected: a pid. This task drives the spawner directly rather than through the
launcher, because it needs no Kanri.

**Steps 1 to 4 run in one Bash tool call, in that order.** The `&` above
backgrounds a job of *this* shell, and a job of a shell the tool call ends
may not outlive it; nothing that depends on the spawner running — the
request writes, the `cat` of a result, the `claude agents --json` watch —
may be split into a later call. Shell state does not survive either, which
is why every fence below re-derives `$scratch` on its own first line: the
assignment is deterministic, names the same clone, and is the literal
`"$scratch"` Global Constraints' `replay-skip` pattern keys on.

- [ ] **Step 2: Spawn one seat under `auto` with three real acts in its prompt**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v2"
node -e '
const fs = require("node:fs");
const body = {
  op: "spawn", role: "jisso", topic: "measure", model: "sonnet", effort: "high",
  branch: "measure", mode: "auto",
  prompt: "Write the file probe.txt with the one line hello. Then edit probe.txt so the line reads hello again, twice. Then run: git add probe.txt && git commit -m \"probe: one write, one edit, one commit\". Then stop.",
};
fs.writeFileSync(process.argv[1] + "/.tanto/spawner/requests/2026-09-21T00-00-01-auto01.json", JSON.stringify(body));
' "$scratch"
sleep 20
cat "$scratch"/.tanto/spawner/results/*auto01.json
```

Expected: a result with a `sessionId`, a `name`, and a `cwd`. The `cwd` is the
whole question: `$scratch` is the pass, anything under
`$scratch/.claude/worktrees/` is issue-aa37 reproducing under `auto`.

- [ ] **Step 3: Watch the cwd through the seat's whole turn**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v2"
for i in 1 2 3 4 5 6; do
  claude agents --json --cwd "$scratch" | node -e 'let s="";process.stdin.on("data",(d)=>s+=d).on("end",()=>{for(const a of (JSON.parse(s).sessions||[]))console.log(a.sessionId,a.state,a.cwd)})'
  sleep 10
done
git -C "$scratch" log --oneline -1
ls "$scratch/probe.txt"
ls -d "$scratch/.claude/worktrees" 2>/dev/null || echo "no worktrees directory"
```

Expected: the same `cwd` on every line, equal to `$scratch`; a commit whose
subject is `probe: one write, one edit, one commit`; `probe.txt` in the root;
and `no worktrees directory`.

- [ ] **Step 4: Exercise the guard with a `manual` seat and a gated write**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v2"
node -e '
const fs = require("node:fs");
const body = {
  op: "spawn", role: "jisso", topic: "measure", model: "sonnet", effort: "high",
  branch: "measure", mode: "manual",
  prompt: "Write the file gated.txt with the one line hello, then stop.",
};
fs.writeFileSync(process.argv[1] + "/.tanto/spawner/requests/2026-09-21T00-00-02-man01.json", JSON.stringify(body));
' "$scratch"
sleep 30
cat "$scratch"/.tanto/spawner/results/*man01.json
node -e 'const s=require("fs").readFileSync(process.argv[1],"utf8");for(const x of JSON.parse(s).seats)console.log(x.sessionId,x.status,x.cwd)' "$scratch/.tanto/spawner/seats.json"
```

Expected: either the probe's behavior reproduces — a `cwd` under
`.claude/worktrees/`, a result carrying `error: ad hoc worktree <cwd>`, and
that seat's `seats.json` status `stopped`, which is the guard working — or the
seat stays in the root and blocks on the permission prompt, which is the
guard's other outcome and is recorded as such. Both are answers; neither is a
failure of this task.

- [ ] **Step 5: Write the report and tear down**

Write `.tanto/tanto-bg-seats/verification-2-single-tree.md`: the spec's
Verification item 2 quoted, each command with its output, and two one-line
answers — the `auto` seat's cwd through its turn, and what the `manual` seat
did. Then:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v2"
node skills/tanto/scripts/tanto.js down "$scratch" --seats
rm -rf "$scratch"
git status --porcelain
```

Expected: nothing from `git status --porcelain` — this task changes no tracked
file.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 8
```

Expected: `no passages`. Nothing is committed by this task.

---

### Task 9: measure the stopped session in the listing, and the two id forms

**Files:**

- Modify: none.
- Report: `.tanto/tanto-bg-seats/verification-8-ids.md`.

**This is a sweep-and-check task**, and a `replay-skip` one: it needs a real
session to stop, remove, attach to, and resume.

**Interfaces:**

- Consumes: tasks 2 and 6.
- Produces: the answers task 2's `runWithEitherId` and `runCensus` were written
  tolerantly for — whether `claude agents --json` still lists a stopped session
  and with what `state`, and whether `stop`, `rm`, `attach`, and `--resume`
  take the `sessionId`, the short id, or both. A contradiction of either
  tolerance is a fix-wave item against `scripts/spawner.js`, named in this
  report.

**Named-mechanism sites.** The census's `gone` rule and its `stopped` exemption
are in `scripts/spawner.js` (task 2) and task 1's suite; the roster's own
`stopped` word is `templates/roster.md`'s (task 17) and
`scripts/boundary.js`'s (task 16), and this measurement touches neither.

**Old values this task contradicts:** none.

- [ ] **Step 1: Make the scratch clone, start the spawner, spawn one seat**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v8"
rm -rf "$scratch"
git clone --quiet --no-hardlinks . "$scratch"
git -C "$scratch" checkout --quiet -b measure
node skills/tanto/scripts/spawner.js run --root "$scratch" &
sleep 3
node -e '
const fs = require("node:fs");
const body = { op: "spawn", role: "jisso", topic: "measure", model: "sonnet", effort: "medium", branch: "measure", mode: "auto", prompt: "Reply with the one word pong and stop." };
fs.writeFileSync(process.argv[1] + "/.tanto/spawner/requests/2026-09-21T00-00-01-ids01.json", JSON.stringify(body));
' "$scratch"
sleep 20
cat "$scratch"/.tanto/spawner/results/*ids01.json
```

Expected: a result carrying both `id` (the short one) and `sessionId`. Record
both; every command below uses them.

**Steps 1 to 4 run in one Bash tool call, in that order.** The `&` above
backgrounds a job of *this* shell, and a job of a shell the tool call ends
may not outlive it; step 3's `resume` request needs that same spawner still
running to act on it. Shell state does not survive a call either, which is
why every fence below re-derives `$scratch` on its own first line — the
assignment is deterministic, names the same clone, and is the literal
`"$scratch"` Global Constraints' `replay-skip` pattern keys on.

**What this task may run itself, and what it may not.** `claude stop`,
`claude rm`, and `claude agents --json` below are **measurements of the CLI**
— they create no session, and running them from this seat's own Bash is the
only way to compare the two id forms verb by verb. `claude --resume <id>
--bg` is **not** one of them: it creates a session, which ADR 1 reserves to
the spawner, and the probe's item 1 saw the auto-mode classifier refuse
exactly that command from inside a session. So step 3 asks the running
spawner for it, by a request file, the way step 4 of task 13 asks for `rm`.

- [ ] **Step 2: Try each verb with each id form, and record which the CLI takes**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v8"
short="<the result's id>"
session="<the result's sessionId>"
claude stop "$session"; echo "stop by sessionId: $?"
claude stop "$short"; echo "stop by short id: $?"
claude agents --json --cwd "$scratch"
```

Expected: one of the two `stop` calls exits 0 and the other prints an error;
record which, and record whether the listing still shows the session
afterwards and what its `state` reads. A session the listing keeps with a
`stopped` or `exited` state confirms the census's exemption is needed; one the
listing drops confirms it is needed for a different reason — either way the
exemption stays, because the spawner must not mark a seat it stopped `gone`.

- [ ] **Step 3: Ask the spawner to resume it, and read `attach`'s help**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v8"
session="<the result's sessionId>"
short="<the result's id>"
node -e '
const fs = require("node:fs");
fs.writeFileSync(process.argv[1] + "/.tanto/spawner/requests/2026-09-21T00-00-02-ids02.json", JSON.stringify({ op: "resume", role: "jisso", topic: "measure", sessionId: process.argv[2] }));
' "$scratch" "$session"
sleep 10
cat "$scratch"/.tanto/spawner/results/*ids02.json
claude agents --json --cwd "$scratch"
claude attach "$short" --help 2>&1 | head -3
```

Expected: the `resume` result carries the same `sessionId` and a new `name`,
the listing shows the session again under that same `sessionId` (probe item 6
measured this after `stop`; this confirms it through the spawner, which is
the only caller the design allows), and the result carries no `error`. An
`error` here is the answer too — record it and say what the spawner's
`opResume` would need. Record whether `attach` names the short id, the
`sessionId`, or both in its own help text; `attach --help` prints text and
creates nothing, so it is a measurement like `stop`.

- [ ] **Step 4: Try `rm`, and read what it says about the transcript**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v8"
session="<the result's sessionId>"
short="<the result's id>"
transcript="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).transcript)' "$(ls "$scratch"/.tanto/spawner/results/*ids01.json)")"
ls -l "$transcript"
claude rm "$session"; echo "rm by sessionId: $?"
claude rm "$short"; echo "rm by short id: $?"
ls -l "$transcript" || echo "transcript gone"
```

Expected: which form `rm` takes, and whether the transcript file survives. The
transcript answer belongs to task 14 as well; record it in both reports and say
in each that the other holds the same figure, so a reader who finds one is not
left looking for the other.

- [ ] **Step 5: Write the report and tear down**

Write `.tanto/tanto-bg-seats/verification-8-ids.md`: the spec's Verification
item 8 quoted, a four-row table of verb against id form with the exit status in
each cell, the listing's behavior after `stop`, and one line saying whether
`scripts/spawner.js`'s `runWithEitherId` and `shortIdOf` need a fix-wave
change. Then:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v8"
node skills/tanto/scripts/tanto.js down "$scratch" --seats
rm -rf "$scratch"
git status --porcelain
```

Expected: nothing from `git status --porcelain`.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 9
```

Expected: `no passages`.

---

### Task 10: measure that a terminal seat survives the terminal, and a reboot

**Files:**

- Modify: none.
- Report: `.tanto/tanto-bg-seats/verification-4-survival.md`.

**This is a sweep-and-check task**, and the most `replay`-hostile one in the
plan: its fixtures are a real integrated terminal that the human closes and a
real reboot of this machine. Neither exists in any sandbox, and both need the
human's hands, so this task opens with a `human-needed:` line and idles until
it is answered.

**The reboot restarts this run too, and that cost is part of the task.**
Under today's mechanism every session of this run is an interactive tab —
Kanri's, this Jisso's own, and every queued Jisso's — so the reboot ends all
of them. They come back by `roles/kanri.md`'s "Recovery after a VS Code
restart" as it reads today: the human types `/tanto fukki` in Kanri's window
first and then in each other window, in any order, and only then is this
seat alive again to run step 4. Batch B2's rendered prompt says so ahead of
time, so that neither Kanri nor this seat treats the gap as a failure, and
step 5's report records how long the run took to come back and what was
re-typed — the first measured recovery of a whole run through a reboot, and
a before/after figure for the dogfood report. The scratch clone's own seat,
the one under test, is the only session the reboot is *measuring*; it is a
background session and comes back by step 4's `tanto`, not by `/tanto
fukki`.

Every fence below re-derives `$scratch` on its own first line: shell state
does not survive a Bash tool call, let alone a reboot, and the assignment is
deterministic. It is also the literal `"$scratch"` Global Constraints'
`replay-skip` pattern keys on.

**Interfaces:**

- Consumes: tasks 2 and 6.
- Produces: the answer to the spec's Deferred item — whether the reboot is
  survivable at all, and what `tanto`'s step 5 recovers when it is not. The
  launcher resumes either way; what this measures is whether anything is lost
  between the crash and the resume.

**Named-mechanism sites.** The detached child's three settings —
`detached: true`, `windowsHide: true`, `unref()` — are in
`scripts/tanto.js`'s `startSpawner` (task 6); the resume step they protect is
that file's step 5 and `SKILL.md`'s fukki paragraph (task 20).

**Old values this task contradicts:** none.

- [ ] **Step 1: Make the scratch clone and start a run in a terminal of its own**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v4"
rm -rf "$scratch"
git clone --quiet --no-hardlinks . "$scratch"
git -C "$scratch" checkout --quiet -b measure
echo "$scratch"
```

Expected: the path. The next step is the human's, because the terminal that
must be closed is a terminal the human opened.

- [ ] **Step 2: Ask Kanri for the human**

Send Kanri one line and idle until it is answered:

```text
human-needed: open a new VS Code integrated terminal, run `node <repo>/skills/tanto/scripts/tanto.js <scratch>` there, then close that terminal; afterwards reboot this machine and say so — <why no other way> a detached child's survival of its parent terminal, and of a reboot, cannot be observed from inside a session — <where: this window>
```

Expected: `human-access: granted` with a scope and an until, then the human's
two acts. Fill `<repo>` and `<scratch>` with the absolute paths step 1 printed.

- [ ] **Step 3: After the terminal is closed, read whether both survived**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v4"
cat "$scratch/.tanto/spawner/pid"
node -e 'const p=Number(require("fs").readFileSync(process.argv[1],"utf8").trim());try{process.kill(p,0);console.log("spawner alive",p)}catch{console.log("spawner gone",p)}' "$scratch/.tanto/spawner/pid"
claude agents --json --cwd "$scratch"
```

Expected: `spawner alive <pid>`, and the listing still showing the Kanri the
launcher spawned, `kind: background`. A dead spawner here is the answer that
`detached`, `unref`, and the log-file `stdio` are not enough on this host, and
it is a fix-wave item against `startSpawner`.

- [ ] **Step 4: After the reboot, and after this run has come back, resume with the one command**

Do not run this before the human has typed `/tanto fukki` in Kanri's window
and in this one: until then this seat is not the seat that asked for the
reboot, and nothing it reads is this task's measurement.

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v4"
node skills/tanto/scripts/tanto.js "$scratch"
node -e 'for(const s of JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).seats)console.log(s.sessionId,s.status,s.name)' "$scratch/.tanto/spawner/seats.json"
claude agents --json --cwd "$scratch"
```

Expected: the launcher starts a new spawner, finds the Kanri seat missing from
the listing, writes a `resume` request for it, and prints both lines —
`claude attach <id>` and `then type /tanto fukki there once`. The listing then
shows the session under the **same `sessionId`** and a new `name`. Record
whether the `sessionId` is preserved: that is the whole of the spec's identity
claim.

- [ ] **Step 5: Write the report and tear down**

Write `.tanto/tanto-bg-seats/verification-4-survival.md`: the spec's
Verification item 4 quoted, the two human acts and when they happened, every
command with its output, and three one-line answers — the seat after the
terminal closed, the spawner after the terminal closed, and the `sessionId`
after the reboot. Name the spec's Deferred item and say whether it closes.
Record beside them the run's own recovery: how long from the reboot to the
last `/tanto fukki`, and which windows needed one. Then:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v4"
node skills/tanto/scripts/tanto.js down "$scratch" --seats
rm -rf "$scratch"
git status --porcelain
```

Expected: nothing from `git status --porcelain`.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 10
```

Expected: `no passages`.

---

### Task 11: measure the Windows toast, and record the other two platforms untested

**Files:**

- Modify: none.
- Report: `.tanto/tanto-bg-seats/verification-3-notice.md`.

**This is a sweep-and-check task**, and a `replay-skip` one: the deliverable is
a toast that appeared on this machine's screen, which no exit status proves and
no sandbox can raise.

**Interfaces:**

- Consumes: task 2's `noticeCommand` and `raiseNotice`, and the `attention` op.
- Produces: the recorded answer that the notice needs no module installed, and
  the two commands for macOS and Linux marked untested here, which
  `SKILL.md`'s notice paragraph does not restate — the spec's 1.5 is where
  they live, and no role file names a platform.

**Named-mechanism sites.** `attention` is one of the six ops
(`templates/spawn-request.md`, task 3), a request `roles/kanri.md` writes at
the close kessai and on a `human-access: granted` to a terminal seat (task 21),
and the census's own channel for a `blocked` seat (task 2). The message forms
`kessai: <topic> — claude attach <id>` and
`human-needed: <role> <topic> — claude attach <id>` are task 21's.

**Old values this task contradicts:** none.

- [ ] **Step 1: Raise a toast through the one-shot, with nothing installed**

```bash
node skills/tanto/scripts/spawner.js notify --text "kessai: tanto-bg-seats — claude attach bg01"
echo "exit $?"
powershell -NoProfile -Command "Get-Module -ListAvailable BurntToast | Measure-Object | Select-Object -ExpandProperty Count"
```

Expected: `exit 0`, a toast on screen reading `tanto` over the message, and
`0` from the second command — no third-party notification module is installed,
which is the property the spec asks for. Note `TANTO_NOTICE_LOG` must **not**
be set in this shell, or the notice goes to a file instead; check with
`echo "${TANTO_NOTICE_LOG:-unset}"` first.

- [ ] **Step 2: Raise the same toast through the census's own path**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v3"
rm -rf "$scratch"; mkdir -p "$scratch/.tanto/spawner/requests" "$scratch/.tanto/spawner/results"
git -C "$scratch" init --quiet 2>/dev/null || git init --quiet "$scratch"
node -e '
const fs = require("node:fs");
fs.writeFileSync(process.argv[1] + "/.tanto/spawner/requests/2026-09-21T00-00-01-note01.json", JSON.stringify({ op: "attention", message: "human-needed: jisso tanto-bg-seats — claude attach bg01" }));
' "$scratch"
node skills/tanto/scripts/spawner.js run --root "$scratch" --once
cat "$scratch"/.tanto/spawner/results/*note01.json
```

Expected: a second toast, and a result carrying `notified` and
`channel: powershell`. A `channel: log` here means the platform command failed
and the run continued, which is the designed fallback and is recorded as the
answer rather than retried.

**A toast that does not appear while the result still says
`channel: powershell` is a different outcome, and not an accepted one.**
`Show()` on an unregistered app id returns without error, so `raiseNotice`'s
`status === 0` test would report a channel for a notice nobody saw. Task 2's
`noticeCommand` names PowerShell's registered AUMID for exactly this reason.
If the toast still does not show here, the spec's Verification item 3 is not
met — a working notice is an ADR 11 requirement — so it is a **fix-wave item
against `noticeCommand`**, named as such in this task's report with the
AUMID that was tried, rather than a measurement recorded and left. Say in
the report which of the three it was: a toast on screen, a `channel: log`
fallback, or a silent success.

- [ ] **Step 3: Record the hook one-shot, without placing the hook**

```bash
printf '%s' '{"session_id":"sess-x","cwd":"/repo","transcript_path":"/tmp/x.jsonl","notification_type":"permission_prompt"}' | node skills/tanto/scripts/spawner.js notify --stdin
echo "exit $?"
grep -c 'Notification' "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/settings.json" || true
```

Expected: a third toast naming `permission_prompt`, and `exit 0`. The `grep`
records whether a `Notification` hook is placed on this machine already; the
plan places none and asks for none — every seat's attempt to write settings is
`[Self-Modification]`, and the hook is the human's own act.

- [ ] **Step 4: Write the report and tear down**

Write `.tanto/tanto-bg-seats/verification-3-notice.md`: the spec's
Verification item 3 quoted, the three commands with their outputs, one line
saying the toast showed with no module installed, and two lines recording the
macOS `osascript` and Linux `notify-send` commands **as untested on this
machine** — the exact argument lists `noticeCommand` builds, copied from
`scripts/spawner.js`. Then:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v3"
rm -rf "$scratch"
git status --porcelain
```

Expected: nothing from `git status --porcelain`.

- [ ] **Step 5: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 11
```

Expected: `no passages`.

---

### Task 12: measure `SendMessage` to a background session, by name and by `[ref]`

**Files:**

- Modify: none.
- Report: `.tanto/tanto-bg-seats/verification-7-sendmessage.md`.

**This is a sweep-and-check task**, and a `replay-skip` one: it needs a real
background session that has run `/tanto`, and two real senders.

**Interfaces:**

- Consumes: tasks 2, 6, and task 7's prompt form.
- Produces: the answer the whole address design rests on — that a bare name
  `ListAgents` prints for a background session delivers, and that the `[ref]`
  rule stands for one. `SKILL.md`'s address bullets (task 20) assert it; this
  is where it is measured against a seat that ran the skill, rather than the
  spike's plain-prompt session.

**Named-mechanism sites.** The address rule is `SKILL.md`'s "The address"
(task 20), the roster's Name `[ref]` column (task 17), and every role file's
"Kanri's address is the roster's first data row" sentence (task 22, unchanged
in substance). The `no-role` second line, which a terminal seat ignores and a
tab seat still needs, is `SKILL.md`'s Messages bullet (task 20).

**Old values this task contradicts:** none.

- [ ] **Step 1: Make the scratch clone and spawn a seat that has run `/tanto`**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v7"
rm -rf "$scratch"
git clone --quiet --no-hardlinks . "$scratch"
git -C "$scratch" checkout --quiet -b measure
node skills/tanto/scripts/tanto.js "$scratch"
claude agents --json --cwd "$scratch"
```

Expected: `claude attach <id>`, and a listing with one background session whose
`name` is what the harness gave it. That seat is a Kanri that ran the start
sequence, which is the difference from the spike.

- [ ] **Step 2: Send to it from this session, by the bare name**

Run `ListAgents` once, find that background session's row, and send it one
line with `SendMessage`, `to` the bare name:

```text
handshake role=jisso name=<this session's name> cwd=<scratch> model=sonnet effort=high branch=measure mode=auto transcript=<this session's transcript>
(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
```

Expected: the send succeeds and the background Kanri answers with an orders
line, or refuses the handshake with a reason — either is a delivery, which is
what is measured. Record what `ListAgents` printed for that session: its name,
its `[ref]`, and the kind it was listed under.

- [ ] **Step 3: Send again with the `[ref]` appended**

Send the same line with `to` the value `<name> [<ref>]`, as the address rule
prescribes only after an ambiguity, and record whether it delivers.

Expected: delivery either way, or a named error. A `[ref]` form that fails for
a background session is a finding this plan's Global Constraints cannot absorb
and goes to Kanri as a scope question.

- [ ] **Step 4: Ask Kanri to send the same line from its own window**

Send Kanri one line:

```text
verification 7: please run ListAgents once, SendMessage the line `ping from kanri` to <name> of the background session in <scratch>, and reply with whether it delivered and what the listing printed for it
```

Expected: one line back from Kanri with both facts. This is the second sender
the spec's item 7 asks for — a tab seat and Kanri — and Kanri's own window is
the only place the second can be run from.

- [ ] **Step 5: Write the report and tear down**

Write `.tanto/tanto-bg-seats/verification-7-sendmessage.md`: the spec's
Verification item 7 quoted, the listing's row for the background session, the
three sends with their outcomes, and Kanri's reply verbatim. Then:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v7"
node skills/tanto/scripts/tanto.js down "$scratch" --seats
rm -rf "$scratch"
git status --porcelain
```

Expected: nothing from `git status --porcelain`.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 12
```

Expected: `no passages`.

---

### Task 13: measure `claude --bg -w <name>` — the branch, the base, and `rm`

**Files:**

- Modify: none.
- Report: `.tanto/tanto-bg-seats/verification-9-worktree.md`.

**This is a sweep-and-check task**, and a `replay-skip` one: it needs a real
git worktree cut by the CLI under `.claude/worktrees/`.

**Interfaces:**

- Consumes: tasks 2 and 6, and the `worktree` and `addDir` fields task 3
  documents.
- Produces: the two facts shoki's design rests on — what the CLI names the
  worktree's branch, and what commit it cuts from — and what `claude rm` leaves
  behind. `templates/shoki-brief.md` (task 19) and `roles/kanri.md`'s close
  (task 21) both assume `shoki-<topic>` is the branch name and the shared
  tree's HEAD is the base; a different answer is a fix-wave item against both.

**Named-mechanism sites.** `shoki-<topic>` names a worktree in
`templates/spawn-request.md` (task 3), a branch in `templates/shoki-brief.md`
(task 19), and both in `roles/kanri.md`'s close and `SKILL.md`'s Artifacts row
for `.claude/worktrees/shoki-<topic>` (tasks 20, 21). `claude rm` is written by
Kanri for shoki alone (task 21) and is the one op that removes anything.

**Old values this task contradicts:** none.

- [ ] **Step 1: Make the scratch clone with a distinct HEAD to cut from**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v9"
rm -rf "$scratch"
git clone --quiet --no-hardlinks . "$scratch"
git -C "$scratch" checkout --quiet -b measure
git -C "$scratch" commit --quiet --allow-empty -m "probe: the base commit a worktree should cut from"
git -C "$scratch" rev-parse HEAD
git -C "$scratch" branch --show-current
```

Expected: a sha and `measure`. The point of the extra commit is that the
worktree's base must be distinguishable from `main`'s tip.

**Steps 2 to 4 run in one Bash tool call, in that order.** The `&` below
backgrounds a job of *this* shell, and a job of a shell the tool call ends
may not outlive it; step 4's `rm` request needs that same spawner still
running to act on it. Shell state does not survive a call either, which is
why every fence re-derives `$scratch` on its own first line — deterministic,
the same clone, and the literal `"$scratch"` Global Constraints'
`replay-skip` pattern keys on.

- [ ] **Step 2: Spawn a seat with a worktree through the spawner**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v9"
node skills/tanto/scripts/spawner.js run --root "$scratch" &
sleep 3
node -e '
const fs = require("node:fs");
const body = { op: "spawn", role: "shoki", topic: "measure", model: "sonnet", effort: "medium", branch: "measure", mode: "auto", worktree: "shoki-measure", addDir: [process.argv[1]], prompt: "Run: git rev-parse --abbrev-ref HEAD && git rev-parse HEAD && pwd. Then read the file .tanto/spawner/pid under the additional directory you were given and report its content. Report the four lines and stop." };
fs.writeFileSync(process.argv[1] + "/.tanto/spawner/requests/2026-09-21T00-00-01-wt01.json", JSON.stringify(body));
' "$scratch"
sleep 25
cat "$scratch"/.tanto/spawner/results/*wt01.json
git -C "$scratch" worktree list
git -C "$scratch" branch --list
```

Expected: a result with a `cwd` under `$scratch/.claude/worktrees/`; a
`worktree list` naming that path; and a branch list that answers the question —
whether the CLI named the branch `shoki-measure`, something of its own, or left
a detached HEAD. Record the base commit from
`git -C "$scratch/.claude/worktrees/shoki-measure" rev-parse HEAD` and compare
it with step 1's sha.

- [ ] **Step 3: Check that `--add-dir` reached the main checkout**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v9"
node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).cwd)' "$(ls "$scratch"/.tanto/spawner/results/*wt01.json)"
cat "$scratch/.tanto/spawner/pid"
```

Expected: the worktree's path, and the spawner's pid. The pid file is the
check because it is a file that **exists** in this scratch clone and lives
under the main checkout's `.tanto/`, which is what `--add-dir` was passed
for; no roster exists here, since no Kanri ever ran in this clone, so the
old check for one could only ever print its fallback. Step 2's prompt asked
the seat to read that same path from inside the worktree and report it, so
the measurement is the pair: what the file holds, and what the seat said it
holds. A seat that could not read it is the finding — the spec's 2.6 needs
`.tanto/` readable from the worktree.

- [ ] **Step 4: Remove it, and see what is left**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v9"
session="<the result's sessionId>"
node -e '
const fs = require("node:fs");
fs.writeFileSync(process.argv[1] + "/.tanto/spawner/requests/2026-09-21T00-00-02-wt02.json", JSON.stringify({ op: "rm", role: "shoki", topic: "measure", sessionId: process.argv[2] }));
' "$scratch" "$session"
sleep 10
cat "$scratch"/.tanto/spawner/results/*wt02.json
git -C "$scratch" worktree list
git -C "$scratch" branch --list
ls -d "$scratch/.claude/worktrees/shoki-measure" 2>/dev/null || echo "worktree directory gone"
```

Expected: the worktree gone and the branch kept, which is what
`claude rm --help` says it does (spec, Measured 1); Kanri deleting the branch
afterwards is the close's own step, written in task 21.

- [ ] **Step 5: Write the report and tear down**

Write `.tanto/tanto-bg-seats/verification-9-worktree.md`: the spec's
Verification item 9 quoted, every command with its output, and three one-line
answers — the branch's name, the base commit against step 1's sha, and what
`rm` removed and kept. Then:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v9"
node skills/tanto/scripts/tanto.js down "$scratch" --seats
rm -rf "$scratch"
git status --porcelain
```

Expected: nothing from `git status --porcelain`.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 13
```

Expected: `no passages`.

---

### Task 14: measure whether a transcript survives `claude rm`

**Files:**

- Modify: none.
- Report: `.tanto/tanto-bg-seats/verification-5-transcript.md`.

**This is a sweep-and-check task**, and a `replay-skip` one: the fixture is a
real transcript file written by a real session and a real `claude rm`.

**Interfaces:**

- Consumes: tasks 2 and 6; task 9 records the same figure from the other side
  and each report says so.
- Produces: the ordering rule for the close. If the transcript does **not**
  survive `rm`, shoki's `rm` waits until Kanri has taken shoki's reading for
  the archive — and since `reading.js --share`'s list does not include shoki's
  transcript at all (spec 2.6), what actually waits is any reading Kanri wants
  of it. The answer is written into task 21's close as one clause either way.

**Named-mechanism sites.** `reading.js --share` at the plan close is
`roles/kanri.md`'s Release table row (task 21) and `SKILL.md`'s archive
paragraph (task 20); shoki's exclusion from its list is task 19's brief and
task 21's landing paragraph.

**Old values this task contradicts:** none.

- [ ] **Step 1: Make the scratch clone and spawn one seat that writes a real turn**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v5"
rm -rf "$scratch"
git clone --quiet --no-hardlinks . "$scratch"
git -C "$scratch" checkout --quiet -b measure
node skills/tanto/scripts/spawner.js run --root "$scratch" &
sleep 3
node -e '
const fs = require("node:fs");
fs.writeFileSync(process.argv[1] + "/.tanto/spawner/requests/2026-09-21T00-00-01-tx01.json", JSON.stringify({ op: "spawn", role: "jisso", topic: "measure", model: "sonnet", effort: "medium", branch: "measure", mode: "auto", prompt: "Reply with the one word pong and stop." }));
' "$scratch"
sleep 20
transcript="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).transcript)' "$(ls "$scratch"/.tanto/spawner/results/*tx01.json)")"
echo "$transcript"
node skills/tanto/scripts/reading.js "$transcript"
```

Expected: a transcript path under `<config dir>/projects/`, and a three-line
reading with a non-zero byte count. Record the byte count. Record also
whether the result's `transcript` field was a path at all or `null`: that is
the free half of the F-8 question — how long after the listing's first
sighting the harness writes the file — and task 2's `transcriptOf` retries
for a few seconds because of it.

**Steps 1 and 2 run in one Bash tool call, in that order.** The `&` above
backgrounds a job of *this* shell and may not outlive the call, and the
shell's `$transcript` and `$scratch` do not survive it either, which is why
each fence re-derives `$scratch` on its own first line — deterministic, the
same clone, and the literal `"$scratch"` Global Constraints' `replay-skip`
pattern keys on.

- [ ] **Step 2: Remove the session and look at the file again**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v5"
transcript="<the transcript path step 1 printed>"
session="<the result's sessionId>"
claude rm "$session" || claude rm "<the result's id>"
ls -l "$transcript" || echo "transcript gone"
node skills/tanto/scripts/reading.js "$transcript" | head -1
```

Expected: either the same byte count, which means `rm` keeps the transcript and
shoki's `rm` waits for nothing; or `transcript gone` and
`transcript: unavailable — <why>`, which means the `rm` request at the close
must follow every reading Kanri wants of that session.

- [ ] **Step 3: Check the second half — what `rm` does to a stopped session**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v5"
claude agents --json --cwd "$scratch"
ls "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/projects" | head -5
```

Expected: the session absent from the listing, and the projects directory still
holding the slug directory whether or not the file inside it survived. Record
both.

- [ ] **Step 4: Write the report and tear down**

Write `.tanto/tanto-bg-seats/verification-5-transcript.md`: the spec's
Verification item 5 quoted, the byte count before and after, the one-line
answer, and the clause task 21 must carry — either
`shoki's rm follows the landing directly` or
`shoki's rm follows Kanri's reading of its transcript`. Say that task 9's
report holds the same figure. Then:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v5"
node skills/tanto/scripts/tanto.js down "$scratch" --seats
rm -rf "$scratch"
git status --porcelain
```

Expected: nothing from `git status --porcelain`.

- [ ] **Step 5: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 14
```

Expected: `no passages`.

---

### Task 15: measure the two landing forms — `git push .` and `git merge --ff-only`

**Files:**

- Modify: none.
- Report: `.tanto/tanto-bg-seats/verification-6-landing.md`.

**This is a sweep-and-check task**, and a `replay-skip` one: it needs a real
repository with a real worktree on a real second branch. It is the one batch B
task that needs no Claude session at all — git is the whole instrument — and it
is here because its answer is shoki's landing, not because it needs the CLI.

**Interfaces:**

- Consumes: task 13's answer for what the CLI names the worktree's branch; this
  task uses a plain `git worktree add` of the same shape, so that the git
  question is answered even if task 13's CLI question is not.
- Produces: the two forms `roles/kanri.md`'s landing paragraph (task 21) and
  `templates/shoki-brief.md`'s report line (task 19) name —
  `git merge --ff-only shoki-<topic>` when the shared checkout is on `main`,
  and `git push . shoki-<topic>:main` when it is on another branch — each
  measured once, with the error the wrong one gives.

**Named-mechanism sites.** The landing is `roles/kanri.md`'s close (task 21);
the rule that Kanri alone cuts, switches, merges, and deletes the branch is
`SKILL.md`'s Workspace (task 20); the `--no-ff` merge of the topic branch is a
different act in the same section and is not measured here.

**Old values this task contradicts:** none.

- [ ] **Step 1: Make the scratch clone with a worktree on a second branch**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v6"
rm -rf "$scratch"
git clone --quiet --no-hardlinks . "$scratch"
git -C "$scratch" checkout --quiet main
git -C "$scratch" worktree add --quiet -b shoki-measure "$scratch/.claude/worktrees/shoki-measure"
git -C "$scratch/.claude/worktrees/shoki-measure" commit --quiet --allow-empty -m "docs: T2 shoroku for measure"
git -C "$scratch" worktree list
```

Expected: two worktrees, the second on `shoki-measure` with one commit `main`
does not have. Every fence below re-derives `$scratch` on its own first
line: shell state does not survive a Bash tool call, the assignment is
deterministic, and it is the literal `"$scratch"` Global Constraints'
`replay-skip` pattern keys on.

- [ ] **Step 2: The shared checkout on `main` — the fast-forward form**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v6"
git -C "$scratch" branch --show-current
git -C "$scratch" merge --ff-only shoki-measure
git -C "$scratch" log --oneline -1
```

Expected: `main`; a fast-forward; and `main`'s tip now the shoroku commit. If
git refuses, record the exact message — it decides which form task 21 writes.

- [ ] **Step 3: The shared checkout on another branch — the push form**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v6"
git -C "$scratch" checkout --quiet -b other
git -C "$scratch/.claude/worktrees/shoki-measure" commit --quiet --allow-empty -m "docs: T2 shoroku for measure, review fixes"
git -C "$scratch" log --oneline -1 main; git -C "$scratch" log --oneline -1 other
git -C "$scratch" merge --ff-only shoki-measure; echo "merge from another branch: $?"
git -C "$scratch" log --oneline -1 main; git -C "$scratch" log --oneline -1 other
git -C "$scratch" push . shoki-measure:main; echo "push: $?"
git -C "$scratch" log --oneline -1 main
```

Expected: the `merge --ff-only` **succeeds**, exit `0` — and that is the
point of the step. `other` was cut from `main` after step 2's fast-forward,
so `main`'s tip is an ancestor of the worktree's second commit and the
fast-forward is legal; what it moves is `other`, the **checked-out** branch,
and `main` is left exactly where step 2 put it. That is why the two `log`
lines are taken before and after: the wrong branch moved, which no exit
status says. Then `push .` succeeds and moves `main` to the second shoroku
commit, which is the form `roles/kanri.md`'s landing paragraph names for a
checkout that is not on `main`. Record all four log lines and both exit
statuses; a `merge --ff-only` that instead **fails** here is also an answer
— record the exact message — and the form task 21 writes is the same either
way.

- [ ] **Step 4: Check what the worktree's own branch does to `main` when checked out**

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v6"
git -C "$scratch" checkout --quiet main; echo "checkout main while the worktree holds shoki-measure: $?"
git -C "$scratch" status --short --branch
```

Expected: `main` checks out cleanly and is up to date with the worktree's
branch. A refusal here — git will not check out a branch another worktree
holds, which is not this case — is recorded with its message.

- [ ] **Step 5: Write the report and tear down**

Write `.tanto/tanto-bg-seats/verification-6-landing.md`: the spec's
Verification item 6 quoted, every command with its output and exit status, and
two one-line answers, one per form, each with the condition it holds under.
Then:

```bash
scratch="${TMPDIR:-/tmp}/tanto-bg-seats-v6"
git -C "$scratch" worktree remove --force "$scratch/.claude/worktrees/shoki-measure"
rm -rf "$scratch"
git status --porcelain
```

Expected: nothing from `git status --porcelain`.

- [ ] **Step 6: Verify**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 15
```

Expected: `no passages`.

---

### Task 16: `scripts/boundary.js` — `stopped`, `--seat`, and the unpaired `commit-ready:` lines

**Files:**

- Modify: `skills/tanto/scripts/boundary.js`
- Test: `skills/tanto/scripts/boundary.test.js`

**Interfaces:**

- Consumes: the result-file fields task 2 writes — `role`, `topic`, `name`,
  `cwd`, `model`, `effort`, `branch`, `mode`, `startedAt`, `transcript`.
- Produces, for `templates/boundary-brief.md` (task 23) and
  `roles/kanri.md` (task 21):
  - `record --status "<name [ref]> stopped"`, a fourth accepted word;
  - `record --seat <results path>`, which writes or rewrites that seat's row
    in the roster's sessions table with status `live`, idempotently — the
    dispatch takes `--jisso`'s name out of the same file and passes it
    itself, so no flag derives from another;
  - `check --ledger <path>`, which prints a `## commit-ready` block holding
    every `commit-ready:` event with no `commit-done:` pair, or `none`.
- **All three are additive.** A `record` call with none of them behaves exactly
  as it does today, which is why this plan's own boundaries keep running
  through batches C and D.

**Named-mechanism sites.** The word `stopped` is added here to the `--status`
check; the roster's own enumerations gain it in `templates/roster.md` and
`templates/roster-archive.md` (task 17), `SKILL.md`'s roster paragraph,
Artifacts archive row, and Session exit (task 20), and `roles/kanri.md`'s
Release table and close row (task 21) — those seven sites are the whole of it,
and `seats.json`'s own five statuses (task 2) are a different set. The flag
`--seat` is named here, in `templates/boundary-brief.md`'s step 4 (task 23),
and in `roles/kanri.md`'s boundary dispatch prompt, which gains `seat=`
(task 21). The events `commit-ready:` and `commit-done:` are named here, in
`roles/sekkei.md` and `roles/keikaku.md` (task 22), in `roles/kanri.md`'s loop
step 5 (task 21), in `SKILL.md`'s Messages and rule 3 (task 20), and in
`templates/boundary-brief.md` (task 23). The flag `--deferred` and the
constant `DEFERRALS_ROW` are **left in this file on purpose**; task 18 removes
the row they write to and says why the flag stays.

**Old values this task contradicts:**

**O16.1** `(live|cleared|queued)$` — one hit, `scripts/boundary.js`, measured
`1` on 2026-09-21. It must be `0` after **P16.1**: the status check is the one
place the accepted set is spelled, and a needle inside it that survived the
edit would mean the word was added somewhere else.

**O16.2** `a --status ending in live, cleared, or queued` — one hit,
`scripts/boundary.js`, measured `1`. It must be `0` after **P16.1**; the
refusal message enumerates the same set and is the sentence a reader sees when
a word is wrong.

**Passages:**

**P16.1** `skills/tanto/scripts/boundary.js` — replace exactly these 3 lines

```javascript
      const found = /^(.*)\s+(live|cleared|queued)$/.exec(String(line).trim());
      if (!found) {
        note(`a --status ending in live, cleared, or queued (got ${line})`);
```

**P16.1 →**

```javascript
      const found = /^(.*)\s+(live|cleared|stopped|queued)$/.exec(String(line).trim());
      if (!found) {
        note(`a --status ending in live, cleared, stopped, or queued (got ${line})`);
```

**P16.2** `skills/tanto/scripts/boundary.js` — insert after these 2 lines

```javascript
  return `a roster row for ${name}`;
}
```

**P16.2 →**

```javascript

/**
 * A terminal seat's roster row, written from the spawner's result file
 * rather than from a handshake it never sends. Idempotent: a second call
 * rewrites the row in place, matched by the Name column, and a name the
 * table does not hold is appended.
 */
function writeSeatRow(doc, file, written) {
  let seat;
  try {
    seat = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return `a --seat file that parses (${file})`;
  }
  if (!seat.name) return `a name in ${file}`;
  const table = tableByHeader(doc.lines, SESSIONS_HEADER);
  if (!table) return "the roster's sessions table";
  const columns = [
    seat.role || "—",
    seat.topic || "—",
    seat.name,
    seat.cwd || "—",
    seat.model || "—",
    seat.effort || "unknown",
    seat.branch || "—",
    seat.mode || "auto",
    seat.startedAt || "—",
    "live",
    seat.transcript || "unavailable",
  ];
  const line = row(columns);
  let at = -1;
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[2] === seat.name) at = i;
  }
  if (at === -1) doc.lines.splice(table.end, 0, line);
  else doc.lines[at] = line;
  written.push(line);
  return null;
}
```

**P16.3** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```javascript
  const rosterRows = values["peer-reading"].length + values.status.length;
  const needRoster = kanri !== null || jisso !== null || rosterRows > 0;
```

**P16.3 →**

```javascript
  const seatFile = given(values, "seat");
  if (seatFile !== null && !fs.existsSync(seatFile)) {
    return fail(`record: --seat ${seatFile} is not on disk`, 2);
  }
  const seatRows = seatFile === null ? 0 : 1;
  const rosterRows = values["peer-reading"].length + values.status.length + seatRows;
  const needRoster = kanri !== null || jisso !== null || rosterRows > 0;
```

**P16.4** `skills/tanto/scripts/boundary.js` — insert after these 1 lines

```javascript
    roster = readDoc(rosterPath);
```

**P16.4 →**

```javascript
    if (seatFile !== null) note(writeSeatRow(roster, seatFile, written));
```

**P16.5** `skills/tanto/scripts/boundary.js` — insert after these 2 lines

```javascript
  return found.length > 0 ? found.join("\n") : "no reading line in the report's header";
}
```

**P16.5 →**

```javascript

/**
 * The ledger's `commit-ready:` events that have no `commit-done:` pair. A
 * peer with work to commit writes the first itself through
 * `record --event`; the boundary's own `record` call writes the second. The
 * commit window opens for the peers this prints and for no others
 * (issue-c0d0).
 */
function unpairedCommitReady(file) {
  let lines;
  try {
    lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  } catch {
    return `no ledger at ${file}`;
  }
  const done = [];
  const ready = [];
  for (const line of lines) {
    const found = /(commit-(?:ready|done)): (.+?)(?: — \d{4}-\d{2}-\d{2} \d{2}:\d{2})?\s*$/.exec(line);
    if (!found) continue;
    if (found[1] === "commit-done") done.push(found[2].trim());
    else ready.push({ who: found[2].trim(), line: line.trim() });
  }
  const open = ready.filter((item) => !done.includes(item.who));
  return open.length > 0 ? open.map((item) => item.line).join("\n") : "none";
}
```

**P16.6** `skills/tanto/scripts/boundary.js` — insert after these 1 lines

```javascript
  blocks.push(["jisso reading", reportHeader(report)]);
```

**P16.6 →**

```javascript
  const ledger = given(values, "ledger");
  if (ledger !== null) blocks.push(["commit-ready", unpairedCommitReady(ledger)]);
```

**P16.7** `skills/tanto/scripts/boundary.test.js` — insert after these 10 lines

```javascript
test("record keeps a file's own line ending (LF)", () => {
  const fixture = ledgerAndRoster();
  const lf = fs.readFileSync(fixture.ledger, "utf8").replace(/\r\n/g, "\n");
  fs.writeFileSync(fixture.ledger, lf, "utf8");
  const args = ["record", "--ledger", fixture.ledger, "--batch", "Z", "--state", "sent"];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const after = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(!after.includes("\r"), "a CRLF ending was written into an LF file");
});
```

**P16.7 →**

```javascript

const SEAT = {
  role: "jisso",
  topic: "bg-seats",
  name: "seat-one [aaaaaa]",
  cwd: "/repo",
  model: "sonnet",
  effort: "xhigh",
  branch: "bg-seats",
  mode: "auto",
  startedAt: "2026-09-21 10:00",
  transcript: "/tmp/seat-one.jsonl",
  sessionId: "sess-one",
};

test("--seat writes a terminal seat's roster row, and a second call rewrites it", () => {
  const fixture = ledgerAndRoster();
  const seat = write(fixture.dir, "result.json", JSON.stringify(SEAT));
  const args = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", seat];
  assert.strictEqual(run(args, fixture.dir).code, 0);
  const first = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(first.includes("| jisso | bg-seats | seat-one [aaaaaa] | /repo |"), first);
  assert.ok(first.includes("/tmp/seat-one.jsonl |"), first);
  const moved = write(fixture.dir, "result2.json", JSON.stringify({ ...SEAT, branch: "next" }));
  assert.strictEqual(run(["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", moved], fixture.dir).code, 0);
  const second = fs.readFileSync(fixture.roster, "utf8");
  assert.strictEqual(second.split("seat-one [aaaaaa]").length - 1, 1);
  assert.ok(second.includes("| next |"), second);
});

test("--seat on a file that is not there exits 2 and writes nothing", () => {
  const fixture = ledgerAndRoster();
  const before = fs.readFileSync(fixture.roster, "utf8");
  const args = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", path.join(fixture.dir, "gone.json")];
  assert.strictEqual(run(args, fixture.dir).code, 2);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), before);
});

test("--status accepts stopped and still refuses a word the table does not name", () => {
  const fixture = ledgerAndRoster();
  const seat = write(fixture.dir, "result.json", JSON.stringify(SEAT));
  assert.strictEqual(run(["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", seat], fixture.dir).code, 0);
  const stop = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--status", "seat-one [aaaaaa] stopped"];
  assert.strictEqual(run(stop, fixture.dir).code, 0);
  assert.ok(fs.readFileSync(fixture.roster, "utf8").includes("| stopped |"));
  const bad = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--status", "seat-one [aaaaaa] gone"];
  const refused = run(bad, fixture.dir);
  assert.strictEqual(refused.code, 1);
  assert.match(refused.err, /live, cleared, stopped, or queued/);
});

test("check prints the commit-ready events that have no commit-done pair", () => {
  const fixture = ledgerAndRoster();
  const plan = write(fixture.dir, "plan.md", PLAN);
  const report = write(fixture.dir, "report.md", "# Report\n\n- Transcript — none\n\n## For Kanri\n\nnothing\n");
  const events = [
    "- commit-ready: sekkei next-topic — docs: the next spec — 2026-09-21 09:00",
    "- commit-done: sekkei next-topic — docs: the next spec",
    "- commit-ready: keikaku next-topic — docs: the next plan — 2026-09-21 10:00",
  ].join("\n");
  fs.appendFileSync(fixture.ledger, `\n${events}\n`);
  const args = ["check", "--plan", plan, "--report", report, "--base", "HEAD", "--tanto", TANTO, "--ledger", fixture.ledger];
  const result = run(args, fixture.dir);
  assert.ok(result.out.includes("## commit-ready"), result.out);
  assert.ok(result.out.includes("keikaku next-topic"), result.out);
  assert.ok(!result.out.includes("sekkei next-topic"), result.out);
});
```

**Anchors:**

**A16.1** `skills/tanto/scripts/boundary.js` — `node -e "console.log(/stopped/.test(require('fs').readFileSync('skills/tanto/scripts/boundary.js','utf8').match(/live[|]cleared.*/)[0]))"` — before: false, after: true

- [ ] **Step 1: Write the failing cases**

Apply **P16.7** to `skills/tanto/scripts/boundary.test.js`.

- [ ] **Step 2: Run them and see them fail**

```bash
node --test 'skills/tanto/scripts/boundary.test.js' 2>&1 | tail -25
```

Expected: four failures — `--seat` unknown so no row is written, `stopped`
refused, and no `## commit-ready` heading in `check`'s output.

- [ ] **Step 3: Apply the six code passages**

Apply **P16.1** through **P16.6** to `skills/tanto/scripts/boundary.js`.

- [ ] **Step 4: Run the whole scripts suite**

```bash
node --test 'skills/tanto/scripts/*.test.js' 2>&1 | tail -10
```

Expected: `# fail 0`, `boundary.test.js`'s count four higher than before, and
every pre-existing case still passing — the three changes are additive and no
old call site names a new flag.

- [ ] **Step 5: Run the old-value needles**

```bash
grep -c '(live|cleared|queued)\$' skills/tanto/scripts/boundary.js
grep -cF 'a --status ending in live, cleared, or queued' skills/tanto/scripts/boundary.js
```

Expected: `0` and `0` — **O16.1** and **O16.2**, each measured `1` before the
edit.

- [ ] **Step 6: Lint and verify**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 16
```

Expected: every hook `Passed` or `Skipped`; `verify clean`.

- [ ] **Step 7: Commit**

```bash
git commit --only skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js -m "feat: boundary.js takes a stopped status, a --seat row, and reports unpaired commit-ready events

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`.

---

### Task 17: `templates/roster.md` and `templates/roster-archive.md` — the two kinds, and `stopped`

**Files:**

- Modify: `skills/tanto/templates/roster.md`
- Modify: `skills/tanto/templates/roster-archive.md`

**Interfaces:**

- Consumes: task 16's `--seat` row and `stopped` status; task 2's `renamed`
  mark in `seats.json`.
- Produces: the keeping rule every later task's prose points at.
  `SKILL.md`'s roster paragraph (task 20) and `roles/kanri.md`'s Start,
  handshake, and Release (task 21) restate it and must agree word for word on
  the seven status words and on which of them archive.

**Named-mechanism sites.** The seven status words after this task are
`queued`, `live`, `stopped`, `cleared`, `replaced`, `dead`, `refused`. They are
enumerated in `templates/roster.md` twice (the keeping rule's archive bullet
and the status paragraph), in `templates/roster-archive.md` twice (the opening
paragraph and the table's Status cell), in `SKILL.md`'s roster paragraph, its
Artifacts archive row, and its Session exit (task 20), and in
`roles/kanri.md`'s Release table's close row (task 21) — eight sites, all of
which this plan touches. `boundary.js`'s check (task 16) accepts four of the
seven, which is unchanged in kind: `replaced`, `dead`, and `refused` were never
writable by `record` and still are not.

**Old values this task contradicts:**

**O17.1** `One row per session that handshook` — one hit,
`templates/roster.md`, measured `1`. Gone at **P17.1**: a terminal seat's row
comes from a result file, so "that handshook" is no longer the rule for a row's
existence.

**O17.2** `the plan's other Jissos` — two hits, `templates/roster.md` and
`SKILL.md`, measured `2`. **P17.1** removes the roster's; task 20's **P20.13**
removes `SKILL.md`'s. The count is `1` at this task's boundary and `0` at batch
D's, and the row says so because a reader of the residual list at batch C's
boundary must not read the survivor as a miss.

**O17.3** `Status is one of` — one hit, `templates/roster.md`, measured `1`.
Gone at **P17.3**, which opens the rewritten paragraph with a different
sentence: the enumeration gains a word, and no new term reaches a set whose
cardinality changed, so the lead-in phrase is the needle.

**O17.4** `A row whose session is no longer listed by` — one hit,
`templates/roster.md`, measured `1`. Gone at **P17.2**: the census, not
`ListAgents`, is what notices a terminal seat's disappearance.

**O17.5** `A dead, replaced, refused, or cleared row stays` — one hit,
`templates/roster.md`, measured `1`. Gone at **P17.2**, the enumeration gaining
`stopped`.

**O17.6** `records a window Kanri released` — one hit,
`templates/roster.md`, measured `1`. Gone at **P17.3**: `cleared` is a tab
seat's word now, and a window is not what is released.

**O17.7** `A queued Jisso's stay blank until its boundary` — one hit,
`templates/roster.md`, measured `1`. Gone at **P17.4**: a `queued` row is D-2's
case alone, and a D-2 seat that never ran archives as `stopped`.

**O17.8** `every row whose session is dead` — one hit,
`templates/roster.md`, measured `1`. Gone at **P17.5**, the archive
enumeration gaining `stopped`.

**O17.9** `the roster rows whose` — one hit, `templates/roster-archive.md`,
measured `1`. Gone at **P17.6**: the enumeration it introduces gains `stopped`,
and the phrase is reworded so that the needle spans the change.

**O17.10** `never ran moving as` — one hit, `templates/roster-archive.md`,
measured `1`. Gone at **P17.6**: a `queued` row that never ran moves as
`stopped`, not as `cleared`.

**O17.11** `| <dead, replaced, refused, or cleared> |` — one hit,
`templates/roster-archive.md`, measured `1`. Gone at **P17.7**, the table
cell's own enumeration.

**Passages:**

**P17.1** `skills/tanto/templates/roster.md` — replace exactly these 6 lines

```markdown
- One row per session that handshook, Kanri's own row first — a plan's
  queued Jissos each have one.
- One live session per role and topic, the plan's other Jissos `queued`;
  Kanri, Kikaku, and Hosa one each. A second handshake for a role and topic
  that already has a live row gets no row and is reported to the human; a
  Jisso handshake while one is live is queued, not refused.
```

**P17.1 →**

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
- A `renamed` mark in the spawner's `seats.json` — a known `sessionId` under
  a new name — is Kanri's to reconcile: rewrite the row's Name column, write
  the Events line `resumed: <old name> → <new name>`, and clear the mark
  with an `ack` request. A tab seat that was resumed re-handshakes with
  `/tanto fukki` instead, as it always did.
```

**P17.2** `skills/tanto/templates/roster.md` — replace exactly these 7 lines

```markdown
- A row whose session is no longer listed by `ListAgents` gets status `dead`
  — a closed tab, a crash, an editor restart before `/tanto fukki`; a
  cleared window stays listed under its name, so this never detects a
  `/clear`. A dead, replaced, refused, or cleared row stays, with its
  Residency row, until the plan closes, then both move to
  `roster-archive.md` as one row, so the run stays readable after a
  replacement and the roster stays short.
```

**P17.2 →**

```markdown
- A row whose session has gone gets status `dead` — a closed tab, a crash,
  an editor restart before `/tanto fukki` for a tab seat; the spawner's
  census marking a terminal seat `gone` that no resume brought back. A
  cleared window stays listed under its name, so neither route detects a
  `/clear`. A stopped, dead, replaced, refused, or cleared row stays, with
  its Residency row, until the plan closes, then both move to
  `roster-archive.md` as one row, so the run stays readable after a
  replacement and the roster stays short.
```

**P17.3** `skills/tanto/templates/roster.md` — replace exactly these 14 lines

```markdown
Status is one of `queued`, `live`, `cleared`, `replaced`, `dead`, and
`refused`; a `live` cell may carry the suffix `(idle since <HH:MM>)`, which
Kanri writes while a Kikaku, Hosa, or Kaiseki idles and the intake's
address rule reads, so a reader tests the cell's first word, not the whole
cell. `queued` is a Jisso waiting for its batch prompt, in handshake
order. `cleared` records a window Kanri released — `release:` sent, the row
marked as the line goes out — or whose `/clear` came to light another way: a
handshake under a name already here with a different transcript, in any
role, or a `no-role` reply to a line Kanri sent. `replaced` is the old row
of a Kanri that handed over. `refused` records a handshake that got no row —
a second live session for the same role and topic, or a model that did not
match `sessions.<role>` — and is always followed by an Events line saying
which; a second Sekkei or Keikaku whose topic differs from the live one's is
not a duplicate and gets its own row.
```

**P17.3 →**

```markdown
The status words are seven: `queued`, `live`, `stopped`, `cleared`,
`replaced`, `dead`, and `refused`. A `live` cell may carry the suffix
`(idle since <HH:MM>)`, which Kanri writes while a Kikaku, Hosa, or Kaiseki
idles and the intake's address rule reads, so a reader tests the cell's
first word, not the whole cell. `queued` is a Jisso of a skill-editing plan
waiting for its batch prompt, in spawn order. `stopped` is a terminal seat
the spawner stopped on Kanri's request, its conversation kept. `cleared`
records a tab seat Kanri released — `release:` sent, the row marked as the
line goes out — or whose `/clear` came to light another way: a handshake
under a name already here with a different transcript, in any role, or a
`no-role` reply to a line Kanri sent. `replaced` is the old row of a Kanri
that handed over. `refused` records a handshake that got no row — a second
live session for the same role and topic, or a model that did not match
`sessions.<role>` — and is always followed by an Events line saying which; a
second Sekkei or Keikaku whose topic differs from the live one's is not a
duplicate and gets its own row.
```

**P17.4** `skills/tanto/templates/roster.md` — replace exactly these 2 lines

```markdown
pacing. A queued Jisso's stay blank until its boundary, and a queued row
that never ran moves to the archive with its blanks. The last three columns
```

**P17.4 →**

```markdown
pacing. A `queued` row's stay blank until its boundary, and one that never
ran moves to the archive as `stopped`, with its blanks. The last three columns
```

**P17.5** `skills/tanto/templates/roster.md` — replace exactly these 2 lines

```markdown
that a `context=` sweep still finds the row. At the plan close every row whose session is dead,
replaced, refused, or cleared moves to `roster-archive.md`, joined with its
```

**P17.5 →**

```markdown
that a `context=` sweep still finds the row. At the plan close every row whose session is stopped,
dead, replaced, refused, or cleared moves to `roster-archive.md`, joined with its
```

**P17.6** `skills/tanto/templates/roster-archive.md` — replace exactly these 3 lines

```markdown
Kanri is the only writer, and writes it at a plan close: the roster rows whose
status is `dead`, `replaced`, `refused`, or `cleared` — a `queued` row that
never ran moving as `cleared` — each with its last Residency
```

**P17.6 →**

```markdown
Kanri is the only writer, and writes it at a plan close: the rows of the roster
whose status is `stopped`, `dead`, `replaced`, `refused`, or `cleared` — a
`queued` row that never ran moves as `stopped` — each with its last Residency
```

**P17.7** `skills/tanto/templates/roster-archive.md` — replace exactly these 1 lines

```markdown
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, refused, or cleared> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |
```

**P17.7 →**

```markdown
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <stopped, dead, replaced, refused, or cleared> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |
```

**Anchors:**

**A17.1** `skills/tanto/templates/roster.md` — `grep -c stopped skills/tanto/templates/roster.md` — before: 0, after: 6

**A17.2** `skills/tanto/templates/roster-archive.md` — `grep -c stopped skills/tanto/templates/roster-archive.md` — before: 0, after: 3

- [ ] **Step 1: Run the needles before the edit**

```bash
for needle in 'One row per session that handshook' "the plan's other Jissos" 'Status is one of' \
  'A row whose session is no longer listed by' 'A dead, replaced, refused, or cleared row stays' \
  'records a window Kanri released' "A queued Jisso's stay blank until its boundary" \
  'every row whose session is dead' 'the roster rows whose' 'never ran moving as' \
  '| <dead, replaced, refused, or cleared> |'; do
  printf '%s\t%s\n' "$(grep -rF -c "$needle" skills/tanto | grep -v ':0$' | tr '\n' ' ')" "$needle"
done
```

Expected: exactly the counts **O17.1** to **O17.11** state — every one `1`
except `the plan's other Jissos`, which is `2` across two files.

- [ ] **Step 2: Apply the roster's five passages**

Apply **P17.1** through **P17.5** to `skills/tanto/templates/roster.md`.

- [ ] **Step 3: Apply the archive's two passages**

Apply **P17.6** and **P17.7** to `skills/tanto/templates/roster-archive.md`.

- [ ] **Step 4: Run the needles again, and the two anchors**

```bash
for needle in 'One row per session that handshook' 'Status is one of' \
  'A row whose session is no longer listed by' 'A dead, replaced, refused, or cleared row stays' \
  'records a window Kanri released' "A queued Jisso's stay blank until its boundary" \
  'every row whose session is dead' 'the roster rows whose' 'never ran moving as' \
  '| <dead, replaced, refused, or cleared> |'; do
  printf '%s\t%s\n' "$(grep -rF -c "$needle" skills/tanto | grep -v ':0$' | wc -l)" "$needle"
done
grep -rF -c "the plan's other Jissos" skills/tanto | grep -v ':0$'
grep -c stopped skills/tanto/templates/roster.md
grep -c stopped skills/tanto/templates/roster-archive.md
```

Expected: `0` for each of the ten; then one line,
`skills/tanto/SKILL.md:1`, for **O17.2**'s survivor, which task 20 removes;
then `6` and `3`, the two anchors' `after` values — **A17.1** reads `6`
since the dry run's own fix added two more sites to `templates/roster.md`.

- [ ] **Step 5: Check the tables still parse as `record` reads them**

```bash
node --test 'skills/tanto/scripts/boundary.test.js' 2>&1 | tail -5
```

Expected: `# fail 0`. `boundary.test.js` copies both templates as its
fixtures, so a broken table header or a lost column shows here first.

- [ ] **Step 6: Lint and verify**

```bash
./scripts/lint.sh skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 17
```

Expected: every hook `Passed` or `Skipped`; `verify clean`.

- [ ] **Step 7: Commit**

```bash
git commit --only skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md -m "docs: the roster's two kinds of seat, and the stopped status

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`. Neither file is
created by this task, so neither needs a line-ending restore.

---

### Task 18: `templates/kanri.md` — the branch line, the deferrals row, the Progress vocabulary

**Files:**

- Modify: `skills/tanto/templates/kanri.md`
- Test: `skills/tanto/scripts/boundary.test.js` — one test removed, because
  the row it asserts on leaves the template in this same task.

**Interfaces:**

- Consumes: nothing new.
- Produces: a ledger template with six fixed Measurements rows, a Branch line
  that names Kanri as the cutter, and a Progress vocabulary that carries
  `spawner results moved`. `roles/kanri.md`'s Start step 5, its close, and
  `templates/boundary-brief.md`'s `record` call (tasks 21, 23) all point at
  this file's rows by name.

**Named-mechanism sites.** The deferral mechanism has six sites and this plan
retires all of them: this file's Progress clause and its Measurements row
(here), `roles/kanri.md`'s trigger, its three writings, and its `--deferred`
argument at loop step 6 (task 21), `templates/batch-prompt.md`'s deferral slot
and `templates/kanri-handover.md`'s Deferred line (task 23), and
`templates/boundary-brief.md`'s `present|absent` half (task 23).
**`boundary.js` keeps `--deferred` and its `DEFERRALS_ROW` constant**: the spec
names three changes to that script and this is not one of them, the flag is
harmless once nothing passes it, and removing it would touch a file two other
tasks of this plan already edit. This task removes the one test that exercised
it, because that test copies this template as its fixture and would fail the
moment the row is gone — which is the whole reason the removal is here and not
in task 16.

**Old values this task contradicts:**

**O18.1** `Sekkei cuts it from main when no batch is in flight,` — one hit,
`templates/kanri.md`, measured `1`. Gone at **P18.2**: Kanri cuts the branch
now, at the opening or after the predecessor's merge.

**O18.2** `These seven rows are always present` — one hit,
`templates/kanri.md`, measured `1`. Gone at **P18.4**: six rows, and the
sentence that numbers them re-numbers with them.

**O18.3** `deferrals: where, the context, and the presence verdict` — one hit,
`templates/kanri.md`, measured `1`. Gone at **P18.3**, the row itself.

**O18.4** `handover deferred (absent, context=` — two hits,
`templates/kanri.md` and `roles/kanri.md`, measured `2`. **P18.1** removes this
file's; task 21's passage on the trigger removes the other. The count is `1` at
this task's boundary and `0` at batch D's.

**Passages:**

**P18.1** `skills/tanto/templates/kanri.md` — replace exactly these 8 lines

```markdown
<one line, rewritten in place: which batch is in flight or accepted, what is
being waited on, "handover written", or "closed"; plus, while one stands, the
clause `handover deferred (absent, context=<n>, since <batch X | the spec
stage | the plan stage>)`, kept
until that handover runs or the plan closes; or, once a
deferred handover's decline is recorded, `handover declined (present,
context=<n>, at <batch X | the spec stage | the plan stage>)` in its
place; and, for each pre-spec act ruled before Sekkei's spec — a diagnosis, a
```

**P18.1 →**

```markdown
<one line, rewritten in place: which batch is in flight or accepted, what is
being waited on, "handover written", "spawner results moved", or "closed";
and, for each pre-spec act ruled before Sekkei's spec — a diagnosis, a
```

**P18.2** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```markdown
- Branch — <branch name; Sekkei cuts it from main when no batch is in flight,
  Keikaku after the merge otherwise>
```

**P18.2 →**

```markdown
- Branch — <branch name; Kanri cuts it from main at the topic's opening when
  no batch is in flight, and right after the predecessor's merge otherwise>
```

**P18.3** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```markdown
| deferrals: where, the context, and the presence verdict | <YYYY-MM-DD, the check> | <batch letter or stage, context=<n>, last human turn <m> min ago>, one entry per deferred handover, or `none` |
| the share of usage at context over the threshold | <YYYY-MM-DD, the plan close> | <the share line, the names it ran over> |
```

**P18.3 →**

```markdown
| the share of usage at context over the threshold | <YYYY-MM-DD, the plan close> | <the share line, the names it ran over> |
```

**P18.4** `skills/tanto/templates/kanri.md` — replace exactly these 15 lines

```markdown
These seven rows are always present; the rows the last paragraph adds sit
below them. Kanri fills the first at the
plan close from this ledger's Session events, where it writes one line each
time a second top-family session goes live; the second by counting those same
events' one-shot lines by kind and not by stage, since one kind is dispatched
at several stages; the third by copying the roster's Residency rows; the
fourth from what the human pastes. The fifth is filled at the topic's opening
(Start step 5), at the plan's landing, and at every boundary by
`boundary.js record`, from the two readings the boundary's dispatch carried;
the sixth at any deferred handover, in whichever
stage, and carries `none` when a plan's Kanri never deferred; the seventh at
the plan close from `reading.js --share`, with the sessions it ran over and the
ones it skipped. The fifth and sixth are the record
behind a rule — the ceiling of `roles/kanri.md`'s trigger — and the other five
are the record the next measurement starts from.
```

**P18.4 →**

```markdown
These six rows are always present; the rows the last paragraph adds sit
below them. Kanri fills the first at the
plan close from this ledger's Session events, where it writes one line each
time a second top-family session goes live; the second by counting those same
events' one-shot lines by kind and not by stage, since one kind is dispatched
at several stages; the third by copying the roster's Residency rows; the
fourth from what the human pastes. The fifth is filled at the topic's opening
(Start step 5), at the plan's landing, and at every boundary by
`boundary.js record`, from the two readings the boundary's dispatch carried;
the sixth at the plan close from `reading.js --share`, with the sessions it
ran over and the ones it skipped. The fifth is the record
behind a rule — the ceiling of `roles/kanri.md`'s trigger, which fires
without asking whether anyone is present — and the other five
are the record the next measurement starts from.
```

**P18.5** `skills/tanto/templates/kanri.md` — replace exactly these 3 lines

```markdown
- <YYYY-MM-DD HH:MM> — <a create request and the human's answer, a `release:`
  sent, a `queued: <n>` answered, a `no-role` received; a replace and the human's
  answer; a handshake accepted or refused; a session declared dead and what was
```

**P18.5 →**

```markdown
- <YYYY-MM-DD HH:MM> — <a spawn, stop, rm, or resume request and its result; an
  ask of the human and their answer; a `release:` sent to a tab seat, a
  `no-role` received; a handshake accepted or refused; a session declared dead and what was
```

**P18.6** `skills/tanto/scripts/boundary.test.js` — replace exactly these 23 lines

```javascript
test("--deferred writes the Measurements deferrals entry for its own batch", () => {
  const fixture = ledgerAndRoster();
  const call = (batch, text, now) => [
    "record",
    "--ledger",
    fixture.ledger,
    "--batch",
    batch,
    "--deferred",
    text,
    "--now",
    now,
  ];
  assert.strictEqual(run(call("Y", "context=1, last human turn 90 min ago", "2026-09-19 09:00"), fixture.dir).code, 0);
  assert.strictEqual(run(call("Z", "context=2, last human turn 70 min ago", "2026-09-19 10:00"), fixture.dir).code, 0);
  assert.strictEqual(run(call("Z", "context=3, last human turn 60 min ago", "2026-09-19 11:00"), fixture.dir).code, 0);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("batch Y: context=1, last human turn 90 min ago"), ledger);
  assert.ok(ledger.includes("batch Z: context=3, last human turn 60 min ago"), ledger);
  assert.ok(!ledger.includes("context=2"), "batch Z's earlier deferral survived");
});

test("record keeps a file's own line ending", () => {
```

**P18.6 →**

```javascript
test("record keeps a file's own line ending", () => {
```

**Anchors:**

**A18.1** `skills/tanto/templates/kanri.md` — `grep -c deferrals: skills/tanto/templates/kanri.md` — before: 1, after: 0

**A18.2** `skills/tanto/templates/kanri.md` — `grep -c "These six rows are always present" skills/tanto/templates/kanri.md` — before: 0, after: 1

- [ ] **Step 1: Run the needles before the edit**

```bash
grep -rF -c 'Sekkei cuts it from main when no batch is in flight,' skills/tanto | grep -v ':0$'
grep -rF -c 'These seven rows are always present' skills/tanto | grep -v ':0$'
grep -rF -c 'deferrals: where, the context, and the presence verdict' skills/tanto | grep -v ':0$'
grep -rF -c 'handover deferred (absent, context=' skills/tanto | grep -v ':0$'
```

Expected: one line each of `1` for the first three, and two lines for the
fourth — `roles/kanri.md:1` and `templates/kanri.md:1` — exactly as **O18.1**
to **O18.4** state.

- [ ] **Step 2: Apply the template's five passages**

Apply **P18.1** through **P18.5** to `skills/tanto/templates/kanri.md`.

- [ ] **Step 3: Remove the one test the row's departure breaks**

Apply **P18.6** to `skills/tanto/scripts/boundary.test.js`.

- [ ] **Step 4: Run the needles again, the anchors, and the suite**

```bash
grep -rF -c 'Sekkei cuts it from main when no batch is in flight,' skills/tanto | grep -v ':0$' || echo "gone"
grep -rF -c 'These seven rows are always present' skills/tanto | grep -v ':0$' || echo "gone"
grep -rF -c 'deferrals: where, the context, and the presence verdict' skills/tanto | grep -v ':0$' || echo "gone"
grep -rF -c 'handover deferred (absent, context=' skills/tanto | grep -v ':0$'
grep -c 'deferrals:' skills/tanto/templates/kanri.md
grep -cF 'These six rows are always present' skills/tanto/templates/kanri.md
node --test 'skills/tanto/scripts/*.test.js' 2>&1 | tail -6
```

Expected: `gone` three times; one line, `skills/tanto/roles/kanri.md:1`, for
**O18.4**'s survivor, which task 21 removes; `0` and `1`, the two anchors; and
`# fail 0` with `boundary.test.js`'s count one lower than after task 16.

- [ ] **Step 5: Lint and verify**

```bash
./scripts/lint.sh skills/tanto/templates/kanri.md skills/tanto/scripts/boundary.test.js
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 18
```

Expected: every hook `Passed` or `Skipped`; `verify clean`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/templates/kanri.md skills/tanto/scripts/boundary.test.js -m "docs: the ledger's branch line, six Measurements rows, and no deferral clause

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`.

---

### Task 19: `templates/shoki-brief.md` — the scribe's whole contract

**Files:**

- Create: `skills/tanto/templates/shoki-brief.md`

**Interfaces:**

- Consumes: task 3's `sessions.shoki` and `subagents.shoroku.review`; task 13's
  and task 15's measured answers about the worktree's branch and the two
  landing forms; task 14's answer about the transcript and `rm`.
- Produces: the file Kanri renders at the close (task 21) and names in a
  `spawn` request whose `prompt` is the one line `brief: <path>`. It is
  shoki's **whole** contract: shoki reads no role file and no `SKILL.md`, so
  anything not in this template does not reach it.

**Named-mechanism sites.** `shoroku ready:` and `shoroku blocked:` are named
here, in `roles/kanri.md`'s landing paragraph and its wake-up floor (task 21),
in `SKILL.md`'s Session exit and Messages (task 20), and in
`templates/kanri-handover.md`'s In flight block (task 23) — five sites, and the
two lines are not in rule 3's closed set of ledger events, because Kanri acts
on both. `shoroku.review` and `tanto-shoroku-review` are this file's, task 3's
JSON, and task 20's kind list. The four SDD stop classes quoted here are the
same bytes as `SKILL.md`'s and `roles/jisso.md`'s, so one fixed-string search
checks all three.

**Old values this task contradicts:** none. No file on disk describes a scribe
seat today.

**Whole file:**

**W19.1** `skills/tanto/templates/shoki-brief.md` — new file, 117 lines

````markdown
# tanto shoki brief — <topic>

Rendered by Kanri at `.tanto/<topic>/shoki-brief.md` and named to the seat as
its whole prompt, the one line `brief: <that path>`. You are shoki (書記),
the scribe: you write the topic's records into `docs/`, in a worktree, after
the merge, and you report once, in one message. You read no role file and no
`SKILL.md` — this brief is your contract, and anything not here is not
yours, the report's shape and your closing line included.

## The arguments

- Topic — <topic>
- Worktree — <the CLI's own, at <root>/.claude/worktrees/shoki-<topic>>, cut
  from the topic branch's tip; your cwd
- Main checkout — <absolute path>, given to you with `--add-dir`; every
  `.tanto/` path below is read there, at its absolute path
- Recommendation — <.tanto/<topic>/t2-recommendation.md>
- Direction — <.tanto/<topic>/t2-direction.md>
- Inbox copies — <the untriaged copies the recommendation names, by absolute
  path, or "none">
- Kanri — <the roster's first data row, read from the main checkout at the
  moment you send>
- Models — `shoroku.apply` on <family>, `shoroku.review` on <family>. Every
  dispatch names its `model` and its `subagent_type` together; neither is
  omitted. The project-scope agent definitions under
  `<main checkout>/.claude/agents/` are **not** in effect here, because your
  cwd is the worktree; the user-scope definition's effort applies, and that
  is the effort your dispatches run at.

## What you never do

- You never resolve a conflict. `git rebase main` either applies clean or
  you abort it and report `shoroku blocked:`. This is a rule, not a
  preference.
- You never merge, push, or delete a branch. Kanri alone cuts, switches,
  merges, and deletes; your commits reach `main` by Kanri's fast-forward of
  your branch, on your report line.
- You never write a tracked file outside the worktree. The main checkout is
  readable and is not yours to change; the inbox copies you fill are
  untracked.
- You never ask the human anything. Four things stop you, and only these: an
  irreversible or destructive operation; a security-sensitive action; a side
  effect outside this worktree that norms say you ask about first (a merge, a
  push to a shared branch, a publish); and a plan so broken that every path
  forward is a guess. For those, stop and report `shoroku blocked:` with the
  one line.
- You write no proposal and no `S-n` row. The ledger is Kanri's.

## The procedure

1. Read, at their absolute paths in the main checkout, the recommendation,
   the direction, and every inbox copy the recommendation names. Read
   `docs/AGENTS.md` in the worktree — the document-management system you
   write by is the one on this branch.
2. Dispatch `shoroku.apply`, `subagent_type: tanto-shoroku-apply`, with the
   recommendation, the direction, the commit subject
   `docs: T2 shoroku for <topic>`, and the inbox copies by path. It writes
   the accepted subset per `docs/AGENTS.md`, every issue opening with the
   `Source:` line its item's heading names, and fills the Triage section of
   every swept inbox copy at its absolute path in the main checkout. Then run
   the repository's lint on the changed paths — or on the whole repository
   where the lint script takes no path arguments — and commit once by
   explicit path, with the `Co-Authored-By:` trailer, on this worktree's own
   branch.
3. Dispatch `shoroku.review`, `subagent_type: tanto-shoroku-review`, over
   this worktree's diff against `main`, the direction, and `docs/AGENTS.md`;
   it writes `.tanto/<topic>/t2-review.md` in the main checkout. On findings,
   dispatch `shoroku.apply` once more with them and commit as
   `docs: T2 shoroku for <topic>, review fixes`. Never a third time: a second
   round of findings is reported, not applied.
4. Run `git rebase main` in the worktree. A conflict stops you: abort the
   rebase (`git rebase --abort`), report
   `shoroku blocked: conflict on <paths>`, and resolve nothing.
5. Check three conditions, and report only when all three hold: the diff
   against `main` touches paths under the six `docs/` types and nothing else;
   the rebase applied clean; `git status` in the worktree is clean.

## The report

One message to Kanri — the roster's first data row in the main checkout,
read at the moment you send — and nothing else. It is two lines, the second
of them fixed:

```text
shoroku ready: shoki-<topic> at <sha> — fast-forward onto main clean — <reading>
(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
```

`<sha>` is `git rev-parse HEAD` in the worktree after the rebase, and
`<reading>` is `node "<skill dir>/scripts/reading.js" "<your transcript>"`'s
first line. The second line goes on every line the run sends, yours
included: the address is a roster row, the window behind it may have been
cleared, and the line is what lets a bare window say so. You never receive
one and never act on one.

When a condition fails, the first line is instead this, with the same second
line under it:

```text
shoroku blocked: <one line — the conflict's paths, the stop class, or the condition that failed>
```

Either message is one wake-up of Kanri's, and it is the only one you send.
Kanri runs the landing checks, fast-forwards `main` onto your branch, and
removes this worktree; you wait for none of it.

Then end your turn with your closing line, which for you is one line and
this shape — an identity, then two facts, and no opinion:

```text
<your name> · shoki/<topic> · <family> — Work: <the commit subjects on this branch>. Still needs this seat: none.
```

`<your name>` is what `claude agents --json` prints for your own
`sessionId`, and `<family>` is the model word your own system prompt reads.
The second fact is always `none`: the landing is Kanri's, and a seat never
names a step it is not needed for.
````

- [ ] **Step 1: Write the file**

Write `skills/tanto/templates/shoki-brief.md` with **W19.1**'s content exactly.
The file contains three fenced `text` blocks — the two report lines and the
closing line — so **W19.1**'s own fence is four backticks.

- [ ] **Step 2: Check its completeness, the way the boundary fence does**

```bash
brief=skills/tanto/templates/shoki-brief.md
for needle in 'shoroku ready:' 'shoroku blocked:' 'tanto-shoroku-apply' \
  'tanto-shoroku-review' 't2-review.md' 'git rebase main' \
  '## What you never do' '## The procedure' '## The report'; do
  printf '%s %s\n' "$(grep -cF "$needle" "$brief")" "$needle"
done
grep -c '^[0-9]\. ' "$brief"
```

Expected: `1` or more for every needle, and `5` for the numbered steps — this
is fence 6 of "How a batch is verified", run here by hand before the boundary
runs it.

- [ ] **Step 3: Check the stop classes read as the other two copies read**

```bash
grep -cF 'Four things stop you, and only these' skills/tanto/SKILL.md skills/tanto/roles/jisso.md skills/tanto/templates/shoki-brief.md
grep -cF 'a plan so broken that every path' skills/tanto/templates/shoki-brief.md
```

Expected: `1` for each of the three files, then `1`. The brief's copy is
prose inside a bullet rather than a block quote, so it wraps at different
columns and only the opening clause can be compared by a fixed string; the
four classes themselves are the same four words for word, which is what the
second grep spot-checks.

- [ ] **Step 4: Lint and verify**

```bash
./scripts/lint.sh skills/tanto/templates/shoki-brief.md
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 19
```

Expected: every hook `Passed` or `Skipped`; `no passages`.

- [ ] **Step 5: Commit, then restore the created Markdown file's line endings**

```bash
git add skills/tanto/templates/shoki-brief.md
git commit --only skills/tanto/templates/shoki-brief.md -m "feat: the shoki brief — the scribe's whole contract

Co-Authored-By: Claude <noreply@anthropic.com>"
git checkout -- skills/tanto/templates/shoki-brief.md
git status --porcelain
```

Expected: one commit; the restore after it; nothing from
`git status --porcelain`.

---

### Task 20: `SKILL.md` — the contract, brought into agreement with the two kinds of seat

**Files:**

- Modify: `skills/tanto/SKILL.md`

**Interfaces:**

- Consumes: everything batches A1, A2, and C landed — the two scripts, the two
  templates, the two config keys, and `boundary.js`'s three additive changes.
- Produces: the contract every role loads at its start. Tasks 21, 22, and 23
  restate parts of it and must agree word for word on: the seven roster status
  words, the invocation grammar and its keys, the four standing grants, the
  close's four steps, and the seventeen templates and five scripts.

**Named-mechanism sites.** Every mechanism this task touches has sites outside
this file, all inside this plan: the invocation grammar and its keys →
`roles/kaiseki.md`, `roles/kikaku.md`, `roles/hosa.md` (task 22),
`README.md`'s Usage (task 23); `stopped` → `templates/roster.md`,
`templates/roster-archive.md` (task 17), `scripts/boundary.js` (task 16),
`roles/kanri.md`'s Release (task 21); `release:` → `roles/keikaku.md` and
`roles/jisso.md`, which lose it, and `roles/sekkei.md` and `roles/kaiseki.md`,
which keep it (task 22); the close's four steps → `roles/kanri.md`'s Shoroku
and `roles/hosa.md`, which loses its close (tasks 21, 22); rule 11's D-2
paragraph → this plan's own Global Constraints; the template count →
`README.md`'s Layout (task 23).

**Old values this task contradicts.** Each was measured with
`grep -rF -c <needle> skills/tanto` on 2026-09-21 and each must be `0` over
the whole of `skills/tanto/` at batch D's boundary, except where the note says
otherwise.

**O20.1** `/tanto <role> [<address>]` — 1 (`SKILL.md`). The grammar line.
**O20.2** `1 live per topic, the plan's others queued` — 1. The roles table's Count cell.
**O20.3** `the create requests and the` — 1. Kanri's Owns cell.
**O20.4** `Every other role does the handshake below.` — 1. The Handshake step, which now names three cases and not two.
**O20.5** `On a mismatch, tell the human what was` — 1. The mismatch stop, now a tab seat's alone.
**O20.6** `A model mismatch is refused, as today.` — 1. The handshake's refusal, now a tab seat's.
**O20.7** `The optional second argument is Kanri's address, pasted by the human from` — 1. The retired argument.
**O20.8** `with no address is standalone Kaiseki` — 2 (`SKILL.md`, `README.md`). This task removes the first; task 23 removes the second, so the residual is `1` at this task and `0` at batch D's boundary.
**O20.9** `Kaiseki with no address is standalone and does not shake hands` — 1. The same rule in its second spelling, which is why both are needles.
**O20.10** `The fourteen kinds are` — 1. The kind list, now fifteen.
**O20.11** `for each of the fourteen kinds` — 2, both in `SKILL.md` (the user-scope and project-scope passes).
**O20.12** `only those fourteen names` — 1. The removal sweep's own count.
**O20.13** `the fourteen names in it` — 1. The start line's count.
**O20.14** `the number of the fourteen names` — 1. The `<s>` figure's count.
**O20.15** `are the two built-in skill-name keys` — 1. Three now.
**O20.16** `A Sekkei, Keikaku, or Jisso started with no address on the command line reads` — 1. The bootstrap sentence.
**O20.17** `Jisso and Keikaku then **wait** for Kanri's reply.` — 1. Neither handshakes now.
**O20.18** `a window Kanri released with` — 1. `cleared` is a tab seat's word.
**O20.19** `The keeping rule is one live session` — 1. The rule that gains the two kinds.
**O20.20** `the plan's other Jissos` — 2 before task 17, 1 here. Task 17 removed the roster template's; this task removes the last.
**O20.21** `find the roster row whose Transcript column is this session's own transcript` — 1. The resume self-check, now a tab seat's.
**O20.22** `is the line that ends every exit` — 1. `release:` ends a tab seat's exit; a terminal seat's is a `stop` request.
**O20.23** `for it, at the handshake, at its latest boundary self-check` — 1. The closing line's identity source.
**O20.24** `When a Hosa is live, steps 2 to 4 are its: Kanri sends one line,` — 1. The delegation that goes.
**O20.25** `commits once by explicit path, on the topic's branch, before the merge` — 1. The apply's commit, now shoki's on `main`.
**O20.26** `The close's three files —` — 1. Six now.
**O20.27** `one row per session that handshook — a plan's queued Jissos included` — 1. The Artifacts row for the roster.
**O20.28** `the roster's dead, replaced, refused, and cleared rows` — 1. The Artifacts row for the archive, which gains `stopped`.
**O20.29** `Fifteen of them:` — 1. Seventeen now.
**O20.30** `The skill also ships three executables.` — 1. Five scripts and two wrappers.
**O20.31** `All three are Node with no dependencies` — 1. The same count in its second spelling.
**O20.32** `None is ever invoked bare` — 1. The wrappers are invoked bare by design.
**O20.33** `State in files, not in memory: the roster and the ledgers. Memory holds at` — 1. Rule 3, which gains the peers' closed set.
**O20.34** `spec was a draft, cuts the branch from` — 1. Workspace's cut sentence.
**O20.35** `The plan's Jissos are all started at its landing and rotate one per` — 1. Rule 11's queue paragraph.
**O20.36** `each given at that session's creation and named in Kanri's orders line` — 1. Keikaku's grant, now implied by the role.
**O20.37** `tells the human, as a numbered list, to go to the role's window` — 1. The grant's list, which gains the attach form.
**O20.38** `separate interactive sessions` — 1. The frontmatter description.

**Passages:**

**P20.1** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
description: Use when the user starts or joins a tanto multi-session orchestration run in Claude Code, invoked as `/tanto <role>`, `担当して <role>`, or `tantoして <role>`, where the role word is kanri (管理), sekkei (設計), keikaku (計画), jisso (実装), kaiseki (解析), kikaku (企画), or hosa (補佐) in hiragana, kanji, or romaji. Drives one implementation plan through separate interactive sessions that message each other, composing superpowers brainstorming, writing-plans, subagent-driven development, systematic-debugging, and the shoroku write-out. Claude Code only, because it needs ListAgents and SendMessage.
```

**P20.1 →**

```markdown
description: Use when the user starts or joins a tanto multi-session orchestration run in Claude Code, invoked as `/tanto <role>`, `担当して <role>`, or `tantoして <role>`, where the role word is kanri (管理), sekkei (設計), keikaku (計画), jisso (実装), kaiseki (解析), kikaku (企画), or hosa (補佐) in hiragana, kanji, or romaji. Drives one implementation plan through separate sessions, background and interactive, that message each other, composing superpowers brainstorming, writing-plans, subagent-driven development, systematic-debugging, and the shoroku write-out. Claude Code only, because it needs ListAgents and SendMessage.
```

**P20.2** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake when no Hosa is live, the create requests and the `release:` lines | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
```

**P20.2 →**

```markdown
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake when no Hosa is live, the spawn, stop, and attention requests, the kessai, and the `release:` lines to tab seats | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
```

**P20.3** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
| Jisso (実装) | 1 live per topic, the plan's others queued | one batch of the SDD run each, its batch report and its commits; the last one, the T2 shoroku proposal | Kanri; the human by grant |
```

**P20.3 →**

```markdown
| Jisso (実装) | 1 live per topic, spawned per batch — a self-editing plan's all at its landing | one batch of the SDD run each, its batch report and its commits; the last one, the T2 shoroku proposal | Kanri; the human by grant |
```

**P20.4** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores, the bug intake, the hotfix lane's edits Kanri hands over, and the close's recommend, check, and apply, each in a slot Kanri gives | the human; Kanri |
```

**P20.4 →**

```markdown
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores, the bug intake, the hotfix lane's edits Kanri hands over in a slot Kanri gives, and the kessai relay | the human; Kanri |
```

**P20.5** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
`/tanto <role> [<address>]`, or `担当して <role>` / `tantoして <role>`.
```

**P20.5 →**

```markdown
`/tanto <role> [<key>=<value> …]`, or `担当して <role>` / `tantoして <role>`.
```

**P20.6** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```markdown
`/tanto fukki` skips the start sequence — no model check, no first
handshake — and runs "Resuming" below.

The optional second argument is Kanri's address, pasted by the human from
Kanri's create request. Kanri runs `/tanto kanri` with no address.
`/tanto kaiseki` with no address is standalone Kaiseki — see `roles/kaiseki.md`.
```

**P20.6 →**

```markdown
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
| Keikaku | `/tanto keikaku topic=<topic> spec=<path> plan=<path>` |
| Jisso, an ordinary plan | `/tanto jisso batch=<.tanto/<topic>/batch-<X>-prompt.md>` — the prompt file is its orders |
| Jisso, a plan that edits this skill | `/tanto jisso queue=<topic>` — reads nothing and waits for the one line `batch: <path>` |
| Kaiseki, attached | `/tanto kaiseki topic=<topic>` — the key is what makes it attached; `/tanto kaiseki` with no key is standalone Kaiseki, roster or no roster |
| shoki | not a `/tanto` invocation at all: the prompt is the one line `brief: <.tanto/<topic>/shoki-brief.md>`, and shoki reads no role file and no `SKILL.md` |
```

**P20.7** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
matches when it occurs inside that id. On a mismatch, tell the human what was
expected and what is running, ask them to run `/model <family>` and then
`/tanto` again, and stop.
```

**P20.7 →**

```markdown
matches when it occurs inside that id. On a mismatch in a **tab seat**, tell
the human what was expected and what is running, ask them to run
`/model <family>` and then `/tanto` again, and stop. A mismatch in a
**spawned seat** never stops it: it appends `model: expected <a>, running
<b>` to the first tanto line it sends, and Kanri writes an `attention`
request on reading it (decision-08bc: the mismatch reaches the human either
way).
```

**P20.8** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
Kanri skips the handshake and runs the start sequence in `roles/kanri.md`
instead. Every other role does the handshake below.
```

**P20.8 →**

```markdown
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

**P20.9** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```markdown
- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it, read at the moment of each comparison — each
  file's presence as much as its content, since a personal or a project
  override can be created, edited, or deleted at any time, and "it existed
  when I last checked" is never evidence that it exists now. Nothing switches
  a session's model or its effort.
```

**P20.9 →**

```markdown
- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it, read at the moment of each comparison — each
  file's presence as much as its content, since a personal or a project
  override can be created, edited, or deleted at any time, and "it existed
  when I last checked" is never evidence that it exists now. Nothing switches
  a session's model or its effort. Its eight keys are the seven roles and
  `sessions.shoki`, the scribe the close spawns, which is a seat with a
  family and an effort and no role file; the launcher reads
  `sessions.kanri` from it through `reading.js`'s `loadSessions`, and Kanri
  reads the rest when it writes a spawn request.
```

**P20.10** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```markdown
  parameter of every subagent that role dispatches, and its `effort` into the
  agent definition below. The fourteen kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `boundary.verify`, `brief.write`, `shoroku.recommend`, `shoroku.apply`, and
  `default`.
```

**P20.10 →**

```markdown
  parameter of every subagent that role dispatches, and its `effort` into the
  agent definition below. The fifteen kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `boundary.verify`, `brief.write`, `shoroku.recommend`, `shoroku.apply`,
  `shoroku.review`, and `default`.
```

**P20.11** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
  runs inline on the session's model. `shoroku.recommend` and `shoroku.apply`
  are the two built-in skill-name keys, naming the `shoroku` skill's
  recommend and apply modes; any other is a personal addition.
```

**P20.11 →**

```markdown
  runs inline on the session's model. `shoroku.recommend`, `shoroku.apply`,
  and `shoroku.review` are the three built-in skill-name keys, naming the
  `shoroku` skill's recommend and apply modes and the review shoki runs over
  its own diff before it reports; any other is a personal addition.
```

**P20.12** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```markdown
  one batch costs it. `ceiling.presence_minutes` is the window inside which
  the human's last turn in Kanri's own transcript still counts as present, and
  `ceiling.share_threshold` the context above which a wake-up's usage counts
  toward the share Kanri reports at the plan close. A `ceiling.<role>` for any
```

**P20.12 →**

```markdown
  one batch costs it. `ceiling.presence_minutes` is the window inside which
  the human's last turn in Kanri's own transcript still counts as present —
  **informational only**: `reading.js --presence` still prints the verdict
  and the ledger still records it, and no rule acts on it, the handover
  having lost its presence gate — and
  `ceiling.share_threshold` the context above which a wake-up's usage counts
  toward the share Kanri reports at the plan close. A `ceiling.<role>` for any
```

**P20.13** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
**User scope.** Write for each of the fourteen kinds the file
```

**P20.13 →**

```markdown
**User scope.** Write for each of the fifteen kinds the file
```

**P20.14** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
**Project scope.** Then compute, for each of the fourteen kinds, the three-layer
```

**P20.14 →**

```markdown
**Project scope.** Then compute, for each of the fifteen kinds, the three-layer
```

**P20.15** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
file does, and only those fourteen names and the retired `tanto-shoroku.md`
```

**P20.15 →**

```markdown
file does, and only those fifteen names and the retired `tanto-shoroku.md`
```

**P20.16** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
Then read your own system prompt's list of available agent types and count
the fourteen names in it, and among them the ones whose description carries the
```

**P20.16 →**

```markdown
Then read your own system prompt's list of available agent types and count
the fifteen names in it, and among them the ones whose description carries the
```

**P20.17** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
with `<s>` the number of the fourteen names whose description in this session's
```

**P20.17 →**

```markdown
with `<s>` the number of the fifteen names whose description in this session's
```

**P20.18** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```markdown
A Sekkei, Keikaku, or Jisso started with no address on the command line reads
the first data row of `.tanto/roster.md`, which is Kanri's own row, for it,
and so do a Kikaku and a Hosa, whose address argument is optional because the
human opens them and Kanri never requests them.
Kaiseki with no address is standalone and does not shake hands; an attached
Kaiseki always receives the address on the command line.
```

**P20.18 →**

```markdown
This is a **tab seat's** act. Kikaku, Hosa, Sekkei, and an attached Kaiseki
read the first data row of `.tanto/roster.md`, which is Kanri's own row, and
send it the one line below. A spawned seat sends none: the request that
created it carried its orders, and the result carried its identity. A
Kaiseki started with no `topic=` key is standalone and does not shake hands,
roster or no roster.
```

**P20.19** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> effort=<level|unknown> branch=<branch> mode=<auto|unknown> transcript=<absolute path|unavailable>
```

**P20.19 →**

```markdown
handshake role=<role> topic=<topic|—> name=<name [ref]> cwd=<path> model=<model id> effort=<level|unknown> branch=<branch> mode=<auto|unknown> transcript=<absolute path|unavailable>
```

**P20.20** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
records what runs. A model mismatch is refused, as today.
```

**P20.20 →**

```markdown
records what runs. A model mismatch in a tab seat's handshake is refused, as
today; a spawned seat's mismatch is not refusable — it arrives appended to a
line the seat has already acted on — and becomes an `attention` request
instead.
```

**P20.21** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```markdown
Jisso and Keikaku then **wait** for Kanri's reply. Jisso's is `queued: <n>`,
its place in the plan's queue, and Jisso then waits for its batch prompt —
the prompt is its orders, and carries the plan path, the ledger path, and the
branch — reading nothing until it arrives. Keikaku's carries the topic, the
spec path, and the plan path it cannot start without. Sekkei, Kikaku, Hosa,
and Kaiseki start reading while they wait — the human is in the room, and
the reply arrives as a `<cross-session-message>`.
```

**P20.21 →**

```markdown
Sekkei, Kikaku, Hosa, and an attached Kaiseki start reading while they wait —
the human is in the room, and the reply arrives as a
`<cross-session-message>`. Keikaku and Jisso wait for nothing and no longer
appear here: both are spawned, both take their orders from the keys of their
own prompt, and neither sends a handshake to be answered.
```

**P20.22** `skills/tanto/SKILL.md` — replace exactly these 9 lines

```markdown
`—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Status is `queued`, `live`,
`cleared`, `replaced`, `dead`, or `refused`: `queued` a Jisso waiting for its
batch prompt; `cleared` a window Kanri released with `release:`, or whose
`/clear` a re-handshake under a new transcript or a `no-role` reply
revealed; `replaced` a Kanri that handed over; `dead` a session `ListAgents`
no longer lists — a closed tab, a crash, a restart before `/tanto fukki`;
`refused` a handshake that got no row. The keeping rule is one live session
per role and topic, the plan's other Jissos `queued`; Kanri, Kikaku, and
Hosa one each.
```

**P20.22 →**

```markdown
`—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. The Status column
carries one of seven
words: `queued` a Jisso of a skill-editing plan waiting for its batch prompt;
`live`; `stopped` a terminal seat the spawner stopped on Kanri's request, its
conversation kept; `cleared` a tab seat Kanri released with `release:`, or
whose `/clear` a re-handshake under a new transcript or a `no-role` reply
revealed; `replaced` a Kanri that handed over; `dead` a session that has gone
— a closed tab, a crash, a restart before `/tanto fukki`, or a terminal seat
the census marked `gone` that no resume brought back; `refused` a handshake
that got no row. A terminal seat's row is written from the spawner's result
file rather than from a handshake — by `boundary.js record --seat` for a
Jisso, by Kanri's own hand for a Keikaku or a successor — and a row that does
not exist yet while its seat works is not an error. The keeping rule is one
live seat per role and topic; Kanri, Kikaku, and Hosa one each.
```

**P20.23** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
- **Kanri's address** is the first data row of `.tanto/roster.md`,
  read at the moment of sending. No role caches it and no line announces it.
  The second argument of `/tanto <role> <address>` is the bootstrap for a
  workspace whose roster does not exist yet, and is otherwise not given:
  Kanri's create requests do not carry it.
```

**P20.23 →**

```markdown
- **Kanri's address** is the first data row of `.tanto/roster.md`,
  read at the moment of sending. No role caches it, no line announces it,
  and no command line carries it. A workspace whose roster does not exist
  yet has no peer to bootstrap: its first session is the Kanri the launcher
  spawns, and that Kanri writes the roster.
```

**P20.24** `skills/tanto/SKILL.md` — replace exactly these 40 lines

```markdown
## Resuming

A Claude Code conversation that is resumed — after an editor restart, a
closed tab, an ended terminal — keeps its context, its session id, and its
transcript, and comes back under a new name and `[ref]`; nothing in the
transcript marks the resume (measured 2026-09-09). Its old address is dead
from then on. The transcript path the handshake carried is the identity that
survives, and the roster's Transcript column holds it.

`/tanto fukki`, typed by the human in a window, and the self-check every
role runs at each of its boundaries are the same act: run `ListAgents` once;
find the roster row whose Transcript column is this session's own transcript
path; if the name the listing prints for this session is that row's, nothing
happened. If it differs, this session was resumed:

- A role sends its handshake line again, to the roster's first data row,
  with the same `transcript=`. Kanri matches the path, rewrites the row in
  place with the new name and `[ref]` — its status as it was, a `queued` row
  staying `queued`, no `dead` row — writes
  an Events line `resumed: <old name> → <new name>`, and answers with its own
  address. The role continues where it was; its context is the same. A row a
  recovery had already marked `dead` returns to `live` the same way, and the
  Events line corrects the earlier one.
- Kanri rewrites the roster's first data row with its new name and `[ref]`,
  and sends nothing: every peer reads that row at its next send. A peer not
  listed was resumed too, and re-handshakes on its own `/tanto fukki`, finding
  the new first row.

After an editor restart, which resumes every window at once, the human types
`/tanto fukki` in Kanri's window first and then in each other window, in any
order; no address is pasted. A session whose path matches no row is not a
resumed role: `/tanto fukki` says so and stops, and the human runs
`/tanto <role> <address>` there as for a new session.

`/tanto fukki` reads this file and nothing else. The role file is already in
the session's context, which is what a resume preserves. It also re-runs the
Start sequence's definitions write-and-count in both scopes (a resume can
carry a new `CLAUDE_CONFIG_DIR`, and re-writing may nudge the harness to
re-scan) and says
the result the same way the Start sequence does.
```

**P20.24 →**

```markdown
## Resuming

**Identity is the `sessionId`.** The transcript path is a function of it —
`<config dir>/projects/<project slug>/<sessionId>.jsonl` — the name is what
`claude agents --json` and `ListAgents` currently print for it, and a resume
keeps the id while it changes the name. The roster's Transcript column holds
the path and therefore the id; no `Sess` column is added, because it would
duplicate the basename.

| what happened | what the run does |
| --- | --- |
| a tab seat resumed by the editor | the human types `/tanto fukki` there; the seat re-handshakes with the same `transcript=`, and Kanri rewrites that row's name in place and writes `resumed: <old name> → <new name>` |
| a terminal seat renamed | the spawner's census sees a known `sessionId` under a new name and marks `renamed` in `seats.json`; Kanri rewrites the row, writes the same Events line, and clears the mark with an `ack` request. The seat itself does nothing and checks nothing |
| an editor restart | the terminal seats are still running — separate processes, unreached by the restart. Only the tab seats came back renamed |
| a reboot or a crash | `tanto` writes a `resume` request for every terminal seat `seats.json` lists as `running` or `blocked`, with `claude --resume <sessionId> --bg` and no other flag; a `stopped` seat is not resumed |

`tanto` is fukki. It is idempotent: run twice it starts nothing twice, and it
puts back what a restart took. A resumed background Kanri idles until a line
reaches it, so the launcher prints the one act that is the human's —
`claude attach <id>`, and `/tanto fukki` typed there once. That Kanri's fukki
reconciles the roster with `seats.json`'s `renamed` marks and
`claude agents --json`, answers the ledger's unanswered lines, sends a Jisso
resumed mid-batch the one line `resume batch X from task N`, and continues
where the Progress line says.

`/tanto fukki` is a **tab seat's** word everywhere else, and the
`ListAgents` self-check that used to run at every boundary is a tab seat's
too: a terminal seat's rename is the census's to detect, and a seat with no
roster row yet would otherwise handshake, which it must not. A tab seat's
`/tanto fukki` reads this file and nothing else — its role file is already
in the session's context, which is what a resume preserves — and it re-runs
the Start sequence's definitions write-and-count in both scopes, saying the
result the same way the Start sequence does. A session whose transcript path
matches no row is not a resumed role: `/tanto fukki` says so and stops, and
the human runs `/tanto <role>` there as for a new session.
```

**P20.25** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
- **`release: /clear this window`** is the line that ends every exit, sent by
  Kanri right after the seat's proposal passes its form check, and the last
  line that name is ever sent: the row is `cleared` at that moment. The seat
  tells the human, in its own window, to `/clear` it, and ends its turn;
  nothing else is expected of it.
```

**P20.25 →**

```markdown
- **`release: /clear this window`** is a **tab seat's** last line, sent by
  Kanri right after the seat's proposal passes its form check, and the last
  line that name is ever sent: the row is `cleared` at that moment. The seat
  tells the human, in its own window, to `/clear` it, and ends its turn;
  nothing else is expected of it. A **terminal seat** gets no such line: at
  the same moment, and on the same form check, Kanri writes a `stop`
  request, the spawner stops the session, the conversation is kept, and the
  row goes `stopped`. Nothing is `/clear`ed and nothing is said to the
  human.
```

**P20.26** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```markdown
  chat's language: an identity, then two facts, and never an opinion. The
  identity is `<name> [<ref>]` — the word its own last `ListAgents` printed
  for it, at the handshake, at its latest boundary self-check, or at
  `/tanto fukki`, so the window and Kanri's own lines about it (its idle
  block, its released line to the human, the roster) always name it the
  same way — then
```

**P20.26 →**

```markdown
  chat's language: an identity, then two facts, and never an opinion. The
  identity is `<name> [<ref>]` — for a tab seat, the word its own last
  `ListAgents` printed for it, at the handshake or at `/tanto fukki`; for a
  terminal seat, the `name` its request's result carried, or the one
  `claude agents --json` prints for its own `sessionId`, never a
  `ListAgents` reading of its own — so the window and Kanri's own lines
  about it (its idle block, its released line to the human, the roster)
  always name it the same way — then
```

**P20.27** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
- At a batch boundary Kanri has verified, Sekkei or Keikaku answers in one
  line, `committed <subject>` or `nothing to commit`, each with its reading
  appended after ` — `; Kanri sends the next batch prompt only after that
  reply, or, when the reply is overdue, after the notice of a subscription
  made then.
```

**P20.27 →**

```markdown
- **The commit window opens only for a peer with a commit waiting.** A
  Sekkei or Keikaku of another topic whose work is ready while a batch runs
  writes the ledger event
  `commit-ready: <role> <topic> — <subject> — <YYYY-MM-DD HH:MM>` through
  `boundary.js record --event`, to the ledger the orders line's `ledger=`
  names. The boundary's `check` prints every such event with no
  `commit-done:` pair; Kanri sends "the boundary is verified — commit" only
  to those peers, waits for `committed <subject> — <reading>`, and pairs the
  event with `commit-done: <role> <topic> — <subject>` in its own `record`
  call. A peer with no event is sent nothing and answers nothing, and the
  `nothing to commit` reply is retired with the question.
```

**P20.28** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```markdown
  checks its form against "The brief's form" below, and sends Kanri one line,
  `review-ready: <document path>; brief: <brief path>`, which waits for
  nothing: Kanri records it in the ledger's Session events and does nothing
  else. The author puts the brief's text verbatim in its review request, with
```

**P20.28 →**

```markdown
  checks its form against "The brief's form" below, and writes the ledger
  event `review-ready: <document path>; brief: <brief path>` itself, through
  `boundary.js record --event` — not a message, and no wake-up of Kanri's.
  The author puts the brief's text verbatim in its review request, with
```

**P20.29** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```markdown
only after Kanri has judged it necessary and granted it for that scope. Four
standing grants exist: Sekkei's spec dialogue and Keikaku's plan dialogue,
each given at that session's creation and named in Kanri's orders line; an
attached Kaiseki's debugging conversation, written in its brief; and Hosa's
```

**P20.29 →**

```markdown
only after Kanri has judged it necessary and granted it for that scope. Four
standing grants exist: Sekkei's spec dialogue, named in Kanri's orders line
at its handshake, and Keikaku's plan dialogue, implied by the role and
stated in `roles/keikaku.md`, since a spawned seat has no orders line; an
attached Kaiseki's debugging conversation, written in its brief; and Hosa's
```

**P20.30** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
`human-access: denied — <alternative>`, recorded as `R-n`. On a grant Kanri
tells the human, as a numbered list, to go to the role's window
(`<name> [<ref>]`), do `<what>`, and come back. The role's direct exchange
```

**P20.30 →**

```markdown
`human-access: denied — <alternative>`, recorded as `R-n`. On a grant Kanri
tells the human, as a numbered list: 1. `claude attach <id>` for a terminal
seat, or go to `<name> [<ref>]` for a tab seat; 2. do `<what>`; 3. ← back to
the agent view, or the tab. For a terminal seat Kanri also writes an
`attention` request, whose message is
`human-needed: <role> <topic> — claude attach <id>`, because a seat that
idles on a grant is not `blocked` in the harness's sense and the census
alone would miss it. The role's direct exchange
```

**P20.31** `skills/tanto/SKILL.md` — replace exactly these 10 lines

```markdown
3. **Check.** Kanri checks the brief's form by `grep` — the five headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
   the recommender once more on a failure and pastes the brief as it stands
   on a second, then gives the human both paths, the three counts, and the
   brief's text verbatim; the human answers by exception, in Kanri's window
   or through a Kikaku decision file whose third section names this
   recommendation and answers it; Kanri writes `t2-direction.md` beside the
   recommendation, item by item, with the `S-n` rows in the conductor
   ledger.
```

**P20.31 →**

```markdown
3. **Check — the close kessai.** Kanri checks the brief's form by `grep` —
   the five headings present and in order, every `###` item heading's text,
   its `### ` marker stripped, appearing exactly once after `See:` in the
   brief — dispatches the recommender once more on a failure and pastes the
   brief as it stands on a second. Then it writes an `attention` request
   whose message is `kessai: <topic> — claude attach <id>`, and prints in its
   own window **one** question carrying the recommendation's path, the
   brief's path, the three counts, the merge decision, and the merge's
   default form — `--no-ff` into `main`, the local branch deleted, nothing
   pushed — with the brief's text verbatim below it. The human answers by
   exception: in Kanri's window by `claude attach`, through a Kikaku decision
   file whose third section names this recommendation and answers it, or by
   telling a live Hosa, whose chore is then the one line
   `kessai answer: <topic> — <the human's words verbatim>`. That one answer
   is the direction and the merge approval. Kanri writes `t2-direction.md`
   beside the recommendation, item by item, with the `S-n` rows in the
   conductor ledger.
```

**P20.32** `skills/tanto/SKILL.md` — replace exactly these 14 lines

```markdown
4. **Apply.** Kanri dispatches the `shoroku.apply` kind with the
   recommendation, the direction, the commit subject, the inbox copies to
   fill by path, and the fix subject; that subagent
   writes the accepted subset per `docs/AGENTS.md` — every issue opening
   with the `Source:` line its item's heading names — fills the Triage
   section of every swept inbox copy with the direction's outcome, runs the
   repository's lint on the changed paths — or on the whole repository where
   the lint script takes no path arguments, which satisfies the step — and
   commits once by explicit path, on the topic's branch, before the merge
   decision; then, when the direction accepted a `fix` item, applies those
   sentences to their files under `skills/` and commits them once more as
   `fix: text corrections from <topic>'s close`. No session applies the
   accepted subset of its own proposal. Kanri verifies both diffs as for any
   commit and marks the `S-n` rows written.
```

**P20.32 →**

```markdown
4. **Apply — shusei, then the merge, then shoki.** A non-empty `fix` group
   is a **Jisso batch of one task** on the topic branch, rendered from
   `templates/batch-prompt.md` and spawned like any batch, committed once as
   `fix: text corrections from <topic>'s close` and verified at its boundary
   like any batch. Then Kanri merges. Then the `docs/` write-out is
   **shoki**, a seat spawned into a worktree with `--add-dir` to the main
   checkout, whose whole contract is `templates/shoki-brief.md`: it
   dispatches `shoroku.apply` for the accepted subset per `docs/AGENTS.md` —
   every issue opening with the `Source:` line its item's heading names, the
   Triage section of every swept inbox copy filled — commits once as
   `docs: T2 shoroku for <topic>`, dispatches `shoroku.review` over its own
   diff and applies its findings once, rebases onto `main`, and reports
   `shoroku ready:` or `shoroku blocked:`. Kanri runs the landing checks and
   fast-forwards `main` onto that branch. No session applies the accepted
   subset of its own proposal, and no machine ever resolves a conflict.
```

**P20.33** `skills/tanto/SKILL.md` — replace exactly these 17 lines

```markdown
When a Hosa is live, steps 2 to 4 are its: Kanri sends one line,
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`,
and Hosa dispatches the recommender, form-checks and pastes the brief in
its own window under its chores grant, writes the direction from the
human's answer — or from a `decision: <path>` line Kanri relays — dispatches
the apply in that slot, and answers `close done: <commit subject> — <reading>`
or `close blocked: <one line>`; Kanri, or the successor it has handed over
to, verifies the commit — and the fix commit, when the direction accepted a
`fix` item — and fills the ledger. With no Hosa live, Kanri runs the three
steps itself. **Between plans**, when the human asks in Kanri's window for
the inbox to be swept, the same three steps run over the inbox alone — the
files `.tanto/inbox-<YYYY-MM-DD>-recommendation.md`, `-brief.md`, and
`-direction.md` beside the roster, the commits `docs: inbox sweep
<YYYY-MM-DD>` and `fix: text corrections from the inbox sweep <YYYY-MM-DD>`
on `main` — by a live Hosa on Kanri's line
`sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`,
or by Kanri.
```

**P20.33 →**

```markdown
The recommend is Kanri's own dispatch, the check is the kessai in Kanri's
window, and the apply is shusei's and shoki's. A live Hosa is delegated none
of it and relays one line when the human answers in its tab,
`kessai answer: <topic> — <the human's words verbatim>`. **Between plans**,
when the human asks in Kanri's window for the inbox to be swept, the same
shape runs over the inbox alone — the recommend dispatch, a kessai message
with no merge question, an `attention` request, the direction, and a shoki
spawn whose brief names the three files
`.tanto/inbox-<YYYY-MM-DD>-recommendation.md`, `-brief.md`, and
`-direction.md` beside the roster and the subject
`docs: inbox sweep <YYYY-MM-DD>`; a sweep's `fix` items are a shusei batch
on `main` with the subject
`fix: text corrections from the inbox sweep <YYYY-MM-DD>`, verified by a
`boundary.verify` dispatch against no plan.
```

**P20.34** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```markdown
`.tanto/<topic>/shoroku-proposal.md`. The close's three files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the topic
directory; there are no others. The apply subagent's commit subjects are
`docs: T2 shoroku for <topic>` and, when a `fix` item was accepted,
`fix: text corrections from <topic>'s close` — the two fixed prefixes,
`docs: T2 shoroku` and `fix: text corrections`, that the whole-branch review
package excludes.
```

**P20.34 →**

```markdown
`.tanto/<topic>/shoroku-proposal.md`. The close's six files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md`, `t2-review.md`,
`shoki-brief.md`, and `batch-shusei-prompt.md` — live in the topic
directory; there are no others. The close's commit subjects are
`docs: T2 shoroku for <topic>`, `docs: T2 shoroku for <topic>, review fixes`
when shoki's review found anything, and, when the direction accepted a `fix`
item, `fix: text corrections from <topic>'s close` — the two fixed prefixes,
`docs: T2 shoroku` and `fix: text corrections`, that the whole-branch review
package excludes.
```

**P20.35** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its live Hosa row or its first data row | one row per session that handshook — a plan's queued Jissos included |
```

**P20.35 →**

```markdown
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its live Hosa row or its first data row | one row per seat — a tab seat's from its handshake, a terminal seat's from the spawner's result file |
```

**P20.36** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, refused, and cleared rows with their last readings, and the closed plans' Events lines, appended at each plan close |
```

**P20.36 →**

```markdown
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's stopped, dead, replaced, refused, and cleared rows with their last readings, and the closed plans' Events lines, appended at each plan close |
```

**P20.37** `skills/tanto/SKILL.md` — insert after these 1 lines

```markdown
| `<cwd>/.claude/agents/tanto-*.md`, and `<cwd>/.claude/agents/.gitignore` beside them | every role at its start, for the kinds whose effort the project file changes | the harness, at the next session start; git | the project-scope definitions, from the same template with its `<scope>` clause rendered; the `.gitignore` holds `tanto-*.md` and `.gitignore`, is written once and never overwritten |
```

**P20.37 →**

```markdown
| `.tanto/spawner/` — `pid`, `log`, `seats.json`, `requests/<id>.json`, `results/<id>.json` | the spawner, and Kanri for a request file | the launcher, Kanri | the spawner's own state: one seat entry per session it started, one request and one result per act. The roster is not here and the spawner never reads it |
| `.tanto/<topic>/spawner-results/` | Kanri, at the plan close | Kanri | the topic's result files, moved with the archive move |
| `.tanto/<topic>/shoki-brief.md` | Kanri, from `templates/shoki-brief.md` | shoki, as its whole prompt | the scribe's contract: the arguments, what it never does, the five steps, the report line |
| `.tanto/<topic>/t2-review.md` | the `shoroku.review` kind shoki dispatches | shoki, then Kanri | the review of shoki's own diff against `main`, before it reports |
| `.tanto/<topic>/batch-shusei-prompt.md` | Kanri, from `templates/batch-prompt.md` | the shusei Jisso | the one-task fix batch of the close |
| `<root>/.claude/worktrees/shoki-<topic>` | the CLI, on `claude --bg -w` | shoki | shoki's worktree; never written by a role, removed by the `rm` request at the landing, its branch deleted by Kanri after |
```

**P20.38** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```markdown
Templates are copied and filled, never restated in prose. Fifteen of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/boundary-brief.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/review-brief.md`,
`templates/shoroku-brief.md`, `templates/tanto.json`,
`templates/kikaku-decision.md`, and `templates/agent.md`.
```

**P20.38 →**

```markdown
Templates are copied and filled, never restated in prose. Seventeen of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/boundary-brief.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/review-brief.md`,
`templates/shoroku-brief.md`, `templates/shoki-brief.md`,
`templates/spawn-request.md`, `templates/tanto.json`,
`templates/kikaku-decision.md`, and `templates/agent.md`.
```

**P20.39** `skills/tanto/SKILL.md` — replace exactly these 31 lines

```markdown
The skill also ships three executables. `scripts/passage-check.js` is the
instrument a plan that carries passages checks itself with, run by Keikaku in
place of an agent dry run, by Jisso at every batch boundary, by the
`boundary.verify` subagent at every boundary in Kanri's place, and by the
whole-branch reviewer; its seven subcommands
are `lint`, `replay`, `diff`, `verify`, `sections`, `frame`, and `boundary`,
and `roles/keikaku.md`, `roles/jisso.md` and `roles/kanri.md` name them.
`scripts/reading.js` is the instrument every role measures itself with, run at
every exit and every boundary — at a boundary Kanri's is run by the
`boundary.verify` subagent on its behalf; it prints three lines always, and its two forms
are the reading of one transcript
— with `--role kanri|jisso`, `--presence` and `--backstop` each adding a line,
and `--now`, `--config`, `--project-config` and `--settings` fixing what the
tests and a verifying Kanri need fixed — and `--share` over several
transcripts, which Kanri runs at
the plan close. `scripts/boundary.js` is the boundary's own instrument, run by
the `boundary.verify` subagent Kanri dispatches — and, under the shape 2 the
tanto-diet design leaves as a seam, by a headless session running the same
brief; its two subcommands are `check`, which runs the boundary's read-only
commands and prints their output under fixed headings, and `record`, which
writes the ledger's and the roster's rows idempotently.
All three are Node with no dependencies, and all three have their tests
beside them, run by `node --test`. Their paths are written skill-relative,
like every other path in
this skill, and the role files spell the runnable form `$TANTO`: set it to the
skill's own directory, which the harness names when it invokes the skill,
**in the same tool call as the command** — shell state does not persist
between calls, and an unset `$TANTO` makes every one of these commands read a
path at the filesystem root. None is ever invoked bare —
no file of the three carries a shebang, so `node` is part of the command and not
decoration.
```

**P20.39 →**

```markdown
The skill also ships five Node scripts and two wrappers.
`scripts/passage-check.js` is the
instrument a plan that carries passages checks itself with, run by Keikaku in
place of an agent dry run, by Jisso at every batch boundary, by the
`boundary.verify` subagent at every boundary in Kanri's place, and by the
whole-branch reviewer; its seven subcommands
are `lint`, `replay`, `diff`, `verify`, `sections`, `frame`, and `boundary`,
and `roles/keikaku.md`, `roles/jisso.md` and `roles/kanri.md` name them.
`scripts/reading.js` is the instrument every role measures itself with, run at
every exit and every boundary — at a boundary Kanri's is run by the
`boundary.verify` subagent on its behalf; it prints three lines always, and its two forms
are the reading of one transcript
— with `--role kanri|jisso`, `--presence` and `--backstop` each adding a line,
and `--now`, `--config`, `--project-config` and `--settings` fixing what the
tests and a verifying Kanri need fixed — and `--share` over several
transcripts, which Kanri runs at
the plan close; it also exports `loadSessions(root)`, which the launcher
reads a seat's family and effort from. `scripts/boundary.js` is the
boundary's own instrument, run by
the `boundary.verify` subagent Kanri dispatches — and, under the shape 2 the
tanto-diet design leaves as a seam, by a headless session running the same
brief; its two subcommands are `check`, which runs the boundary's read-only
commands and prints their output under fixed headings, and `record`, which
writes the ledger's and the roster's rows idempotently.
`scripts/spawner.js` is the one process in a run that issues `claude --bg`,
`claude stop`, `claude rm`, and `claude --resume`: a resident started by the
launcher and never by a session, which takes request files, writes result
files, keeps `seats.json`, runs a census of `claude agents --json` every
fifteen seconds, and raises a desktop notice on a blocked seat and on an
`attention` request; `spawner.js notify --stdin` is the one-shot an optional
harness hook may call. `scripts/tanto.js` is the human's one command — it
starts the spawner, finds or asks for a Kanri, resumes what a restart took,
and prints `claude attach <id>`; `tanto down [--seats]` stops it all and
keeps every conversation.
All five are Node with no dependencies, and the three that carry behavior of
their own have their tests
beside them, run by `node --test`. Their paths are written skill-relative,
like every other path in
this skill, and the role files spell the runnable form `$TANTO`: set it to the
skill's own directory, which the harness names when it invokes the skill,
**in the same tool call as the command** — shell state does not persist
between calls, and an unset `$TANTO` makes every one of these commands read a
path at the filesystem root. None of the five is ever invoked bare —
no `.js` file of the skill carries a shebang, so `node` is part of the
command and not decoration. The two wrappers, `scripts/tanto.bat` and
`scripts/tanto.sh`, exist to be invoked bare: they are what the human puts on
`PATH` as `tanto`, and `tanto.sh` carries the skill's one shebang.
```

**P20.40** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```markdown
3. State in files, not in memory: the roster and the ledgers. Memory holds at
   most a pointer to them. A subagent Kanri dispatches to a boundary writes
   the ledger and the roster as Kanri's hand, through `boundary.js record`,
   and nothing else. A role's authority is this file, its role file,
   Kanri's lines, and the batch prompts; a project memory rule that would add
   a dispatch or a document is put to Kanri as one line before it is acted
   on, since the same memory is loaded by every session in the repository.
```

**P20.40 →**

```markdown
3. State in files, not in memory: the roster and the ledgers. Kanri is their
   only hand; a peer appends to a ledger's Session events only through
   `boundary.js record --event`, and only the lines its role file names — a
   closed set of two, `review-ready:` and `commit-ready:`. Everything Kanri
   must act on stays a message. Memory holds at
   most a pointer to them. A subagent Kanri dispatches to a boundary writes
   the ledger and the roster as Kanri's hand, through `boundary.js record`,
   and nothing else. A role's authority is this file, its role file,
   Kanri's lines, and the batch prompts; a project memory rule that would add
   a dispatch or a document is put to Kanri as one line before it is acted
   on, since the same memory is loaded by every session in the repository.
```

**P20.41** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```markdown
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, and
   one Kaiseki per topic; one **live** Jisso per topic, the plan's other
   Jissos `queued` in the roster until their batch. A session is bound to its
   cwd — CLAUDE.md, memory, and permissions all come from it.
```

**P20.41 →**

```markdown
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, and
   one Kaiseki per topic; one **live** Jisso per topic, spawned per batch, or
   all of them spawned at the plan's landing and `queued` when the plan edits
   this skill. A session is bound to its
   cwd — CLAUDE.md, memory, and permissions all come from it.
```

**P20.42** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```markdown
    The plan's Jissos are all started at its landing and rotate one per
    batch, which is neither a replacement nor a creation under this rule —
    every one of them read the skill as it stood before batch A; a re-queue
    request the queue's fallback makes mid-plan is a creation, and waits
    for the boundary like any other. For a plan that names its final
    boundary as the safe one, the landing's create request asks for the
    full N instead of leaving windows for the human to re-queue: the queue
    cannot be refilled before the plan's end.
```

**P20.42 →**

```markdown
    **A plan that edits this skill spawns all its Jissos at its landing**,
    each with `queue=<topic>`, reading nothing until its own batch prompt
    reaches it as the one line `batch: <path>` — so that every one of them
    read the skill as it stood before batch A. That is neither a
    replacement nor a creation under this rule. Every other plan spawns one
    Jisso per batch, at the boundary, from the batch prompt itself.

    **The run-time templates land with the role files.** A role file is
    loaded once, at session start, but the `boundary.verify` subagent reads
    `templates/boundary-brief.md` and renders `templates/batch-prompt.md`
    from disk at **every** boundary, the plan's own included. A plan that
    edits either, or `templates/kanri-handover.md`, therefore lands it in
    the same batch as the role files that key on it; the templates a session
    reads once — `roster.md`, `roster-archive.md`, `kanri.md`,
    `shoki-brief.md`, `spawn-request.md` — may land earlier.
```

**P20.43** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
All roles share one working tree and one branch. Sekkei, or Keikaku when the
spec was a draft, cuts the branch from `main` before the first commit, named
after the topic; Jisso continues on it;
the merge decision is the human's. **No worktree by default** — Kanri verifies
the tree in place and the human can watch it. Every batch prompt restates that
```

**P20.43 →**

```markdown
All roles share one working tree and one branch. **Kanri alone cuts,
switches, merges, and deletes the branch**: it cuts `<topic>` from `main` at
the topic's opening when no batch is in flight, and right after the
predecessor's merge otherwise, and Sekkei and Keikaku commit on the branch
the tree is on. Jisso continues on it;
the merge decision is the human's, taken with the close kessai's one answer.
**No worktree by default** — Kanri verifies
the tree in place and the human can watch it. The one exception is shoki, the
close's scribe, which works in the CLI's own worktree under
`.claude/worktrees/shoki-<topic>` and holds no runtime resource. Every batch
prompt restates that
```

**P20.44** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
`.tanto/` reserves these names, and a topic slug is none of them and begins
with neither prefix: the
directories `inbox`, `sent`, `kikaku`, and `kaiseki`; the files `roster.md`,
`roster-archive.md`, `kanri-handover.md`, `.gitignore`, and
`.markdownlint-cli2.yaml`; and the prefixes `exit-kanri-` and `inbox-`.
```

**P20.44 →**

```markdown
`.tanto/` reserves these names, and a topic slug is none of them and begins
with neither prefix: the
directories `inbox`, `sent`, `kikaku`, `kaiseki`, and `spawner`; the files
`roster.md`, `roster-archive.md`, `kanri-handover.md`, `.gitignore`, and
`.markdownlint-cli2.yaml`; and the prefixes `exit-kanri-` and `inbox-`.
```

**Anchors:**

**A20.1** `skills/tanto/SKILL.md` — `grep -c spawner-results skills/tanto/SKILL.md` — before: 0, after: 1

This is **P20.37**'s anchor: an insertion needs one, because the anchor lines
it names stay unchanged and `verify` has nothing else to key on. The new
Artifacts row for `.tanto/<topic>/spawner-results/` is the one line in this
file that carries that word.

- [ ] **Step 1: Run every needle before the edit**

```bash
while IFS= read -r needle; do
  printf '%s\t%s\n' "$(grep -rF -c "$needle" skills/tanto | grep -v ':0$' | tr '\n' ' ')" "$needle"
done <<'NEEDLES'
/tanto <role> [<address>]
1 live per topic, the plan's others queued
the create requests and the
Every other role does the handshake below.
On a mismatch, tell the human what was
A model mismatch is refused, as today.
The optional second argument is Kanri's address, pasted by the human from
with no address is standalone Kaiseki
Kaiseki with no address is standalone and does not shake hands
The fourteen kinds are
for each of the fourteen kinds
only those fourteen names
the fourteen names in it
the number of the fourteen names
are the two built-in skill-name keys
A Sekkei, Keikaku, or Jisso started with no address on the command line reads
Jisso and Keikaku then **wait** for Kanri's reply.
a window Kanri released with
The keeping rule is one live session
the plan's other Jissos
find the roster row whose Transcript column is this session's own transcript
is the line that ends every exit
for it, at the handshake, at its latest boundary self-check
When a Hosa is live, steps 2 to 4 are its: Kanri sends one line,
commits once by explicit path, on the topic's branch, before the merge
The close's three files —
one row per session that handshook — a plan's queued Jissos included
the roster's dead, replaced, refused, and cleared rows
Fifteen of them:
The skill also ships three executables.
All three are Node with no dependencies
None is ever invoked bare
State in files, not in memory: the roster and the ledgers. Memory holds at
spec was a draft, cuts the branch from
The plan's Jissos are all started at its landing and rotate one per
each given at that session's creation and named in Kanri's orders line
tells the human, as a numbered list, to go to the role's window
separate interactive sessions
NEEDLES
```

Expected: exactly the counts **O20.1** to **O20.38** state — every one
`SKILL.md:1` except `with no address is standalone Kaiseki`
(`README.md:1 SKILL.md:1`) and `for each of the fourteen kinds`
(`SKILL.md:2`).

- [ ] **Step 2: Apply the forty-four passages**

Apply **P20.1** through **P20.44** to `skills/tanto/SKILL.md`, in order. They
are all in one file and none overlaps another.

- [ ] **Step 3: Run every needle again**

Run step 1's command again.

Expected: one line per needle with an empty count field, except
`with no address is standalone Kaiseki`, which is `README.md:1` until task 23
removes it. Any other survivor is a passage that did not land where its needle
said it would.

- [ ] **Step 4: Check the counts the new text asserts**

```bash
grep -cF 'fifteen kinds' skills/tanto/SKILL.md
grep -cF 'Seventeen of them:' skills/tanto/SKILL.md
grep -cF 'five Node scripts and two wrappers' skills/tanto/SKILL.md
grep -c 'shoroku.review' skills/tanto/SKILL.md
grep -cF '.tanto/spawner/' skills/tanto/SKILL.md
node -e 'const t=require("fs").readFileSync("skills/tanto/SKILL.md","utf8");const m=t.match(/^---\n([\s\S]*?)\n---/);console.log(/: /.test(m[1].split("\n").find((l)=>l.startsWith("description:")).slice(12)) ? "colon-space in description" : "description clean")'
```

Expected: `1`, `1`, `1`, at least `2`, at least `1`, and
`description clean` — the frontmatter's `description` must carry no
colon-space, which silently breaks the YAML parse.

- [ ] **Step 5: Lint and verify**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 20
```

Expected: every hook `Passed` or `Skipped`; `verify clean`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs: the contract's two kinds of seat, the spawner, the kessai, and shoki

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`.

---

### Task 21: `roles/kanri.md` — the requests, the kessai, shusei, shoki, and the ungated handover

**Files:**

- Modify: `skills/tanto/roles/kanri.md`

**Interfaces:**

- Consumes: task 20's contract, task 19's brief, task 17's roster rule, task
  16's `--seat` and `stopped`, task 3's request schema, and tasks 13, 14, 15's
  measured answers about the worktree, the transcript, and the two landing
  forms.
- Produces: the resident's own procedure. Nothing later in this plan consumes
  it; the fix wave and the close are what read it next.

**Named-mechanism sites.** Each mechanism this task changes, and every other
site of it this plan touches: the **request** (`spawn`, `stop`, `rm`,
`resume`, `attention`, `ack`) → `templates/spawn-request.md` (task 3),
`scripts/spawner.js` (task 2), `SKILL.md`'s Artifacts row (task 20); **`stop`
in place of `release:`** → `SKILL.md`'s Messages bullet (task 20),
`roles/jisso.md` and `roles/keikaku.md` (task 22), `templates/roster.md`'s
status paragraph (task 17); **the kessai** → `SKILL.md`'s Session exit (task
20), `roles/hosa.md`'s relay (task 22); **shusei** → `templates/batch-prompt.md`
(task 23), `roles/jisso.md`'s Shusei paragraph (task 22); **shoki** →
`templates/shoki-brief.md` (task 19), `SKILL.md`'s Artifacts rows and Session
exit (task 20), `templates/kanri-handover.md`'s In flight block (task 23);
**the ungated handover** → `templates/kanri-handover.md`'s Why and Commands
(task 23), `templates/batch-prompt.md`'s deferral slot (task 23),
`templates/kanri.md`'s Progress and Measurements (task 18),
`templates/boundary-brief.md`'s reply line (task 23); **`commit-ready:`** →
`scripts/boundary.js` (task 16), `roles/sekkei.md` and `roles/keikaku.md`
(task 22), `SKILL.md`'s Messages and rule 3 (task 20);
**`commit-done:`**, of which this task is the **only writer** in the whole
skill — loop step 5 pairs it and loop step 6's `record` call carries it
(**P21.37**, **P21.39**, **P21.40**) — → `scripts/boundary.js`'s `check`,
which reports a `commit-ready:` without it (task 16),
`templates/boundary-brief.md`'s Commit window section, which is where Kanri
reads that report (task 23), and `SKILL.md`'s commit-window bullet (task
20); **the branch**, which Kanri alone cuts, switches, merges, and deletes
→ `SKILL.md`'s Workspace (task 20), `roles/sekkei.md`'s lost cut and
`roles/keikaku.md`'s `checkout free:` wait (task 22),
`templates/kanri.md`'s Branch line (task 18),
`templates/kanri-handover.md`'s Branch entry (task 23).

**Old values this task contradicts.** Measured with
`grep -rF -c <needle> skills/tanto` on 2026-09-21; each must be `0` over the
whole of `skills/tanto/` at batch D's boundary.

**O21.1** `Resuming, once: the listing shows your own name` — 1. The loop's self-check, a tab seat's.
**O21.2** `resumed, and the roster's first row is rewritten before anything else` — 1. The trigger's self-check, the same. Gone at **P21.35**.
**O21.3** `**Signals 3 and 4 fire a handover only when the human is present.**` — 1. The gate itself.
**O21.4** `The reason is that a handover is complete` — 1. The gate's reason.
**O21.5** `the human creates the successor` — 1. The clause decision-b6cb loses.
**O21.6** `handover deferred (absent, context=` — 1 after task 18. The Progress clause's last site.
**O21.7** `handover declined (present, context=` — 1. The decline clause.
**O21.8** `The human is the only actor who can give a window a role or take one away,` — 1. True of tab seats only now.
**O21.9** `Every create request is this numbered list` — 1. Two tables now: the requests Kanri writes and the asks it makes.
**O21.10** `create request` — 15 in this file (lines 5, 16, 48, 117, 460, 858, 859, 874, 1407, 1451, 1452, 1455, 1457, 1458, 1459) and 24 across `skills/tanto/`. Every one of the fifteen is inside a passage of this task; tasks 18, 20, 22, and 23 hold the other nine, so the whole-tree count is `0` at batch D's boundary and this is the needle "How a batch is verified" fence 4 sweeps.
**O21.11** `Ask the human to queue the plan's Jissos, as the Create table below` — 1. Step 4 is a request now.
**O21.12** `Answer each handshake` — 1. Step 5 goes.
**O21.13** `Jisso gets` — 1. Jisso sends no handshake to answer.
**O21.14** `earns a one-line warning to the human that a batch may stall` — 1. Kanri writes `auto` itself.
**O21.15** `Hosa row at a close, steps 2 to 4 are Hosa's.` — 1. The delegation goes.
**O21.16** `Where the commit lands: on the topic's branch, before the merge decision.` — 1. On `main`, after it.
**O21.17** `**The apply subagent writes.** Step 4 above, on this branch.` — 1. Shoki writes, in a worktree.
**O21.18** `item, it replaces each accepted item's old text with its` — 1. The apply's fix pass is shusei's batch.
**O21.19** `the fix subject for a` — 1. The Written column is filled from shusei's verdict.
**O21.20** `live and queued Jisso of the topic in the close's released line` — 1. Stopped, not released.
**O21.21** `3. come back here` — 1. The grant's numbered list gains the attach form and the `←` return.
**O21.22** `move the dead, replaced, refused, and cleared rows` — 1. The archive list gains `stopped`.
**O21.23** `Every window is resumed at once rather than recreated, and the human types` — 1. Only the tab seats are.
**O21.24** `queue the plan's Jissos: N windows` — 1. The Create table's row.
**O21.25** `The second form is followed by the numbered commands from the handover file.` — 1. The residency line's own sentence; the successor is spawned and no command follows.
**O21.26** `The apply subagent's slot, which only the close fills` — 1. Loop step 5's slot (a); the write-out is shoki's, in a worktree, after the merge.
**O21.27** `skip (c) when neither is live` — 1. The commit window opens for the peers an unpaired `commit-ready:` names, and for nobody else.
**O21.28** `because the loop stops before` — 1. The handover clause of loop step 5, whose `record` call loses `--deferred`.
**O21.29** `item>" --deferred "<one line>"` — 1. Loop step 6's `record` call, whose last argument becomes the `commit-done:` event.
**O21.30** `when step 4's ruling was a deferral` — 1. That call's gloss.
**O21.31** `over, present` — 3: 2 in `roles/kanri.md` (loop steps 3 and 4) and 1 in `templates/boundary-brief.md`. **P21.12** takes step 4's and **P21.42** step 3's; task 23's **P23.13** takes the brief's, so the whole-tree count is `0` at batch D's boundary.
**O21.32** `recommendation's path, the brief's path, the three counts` — 1. "The four steps" step 3's check message, which the kessai replaces.
**O21.33** `**Apply.** Dispatch` — 1. "The four steps" step 4's head; the apply is shoki's dispatch now, not yours.
**O21.34** `the close is its exit, and it idles through nothing` — 1. "The close" step 1's `release:` to Jisso, which is a `stop` request.
**O21.35** `Delegation to Hosa` — 3, all in `roles/kanri.md`: the heading (**P21.26**), the cross-reference in "The close" step 2 (**P21.45**), and the `close:` line's mention inside **P21.15**'s old text.
**O21.36** `Line 5 carries, after the command` — 1. The pasteable list's gloss, which names the Create table and the four old arguments; line 5 becomes `/tanto <role> topic=<topic>`. The list's own line 5 is not a needle of its own, because the new spelling contains the old one.
**O21.37** `the Create table's Jisso row's request goes out` — 1. Loop step 6's queue-empty sentence, which waits for a handshake nobody sends.
**O21.38** `row re-handshook — the next queued Jisso resumes the batch otherwise` — 1. The terminal Jisso's resume is the launcher's own affair (spec 1.2 step 5), never a re-handshake. Gone at **P21.48**.

**Passages:**

**P21.1** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, the shoroku recommendations and the
directions, the bug intake when no Hosa is live, the create requests, and
the `release:` lines;
the write-out itself is the apply subagent's work, at the topic's close.
```

**P21.1 →**

```markdown
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, the shoroku recommendations and the
directions, the bug intake when no Hosa is live, the spawner's request
files, the kessai, the branch, and the `release:` lines to tab seats;
the write-out itself is shoki's work, at the topic's close.
```

**P21.2** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
You have done your own model and effort check, in your start line. You do not
shake hands — you receive handshakes.
Your start line prints your own `name [ref]` as `ListAgents` reports it; that
is the address every create request carries, and you are never renamed after
it.
```

**P21.2 →**

```markdown
You have done your own model and effort check, in your start line. You do not
shake hands — you receive them from tab seats, and terminal seats send none.
Your start line prints your own `name [ref]`; that is the address the
roster's first data row carries, which is the one route every seat reads,
and you are never renamed after it.
```

**P21.3** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
1. Read `tanto.json` as `SKILL.md` describes, write the agent definitions of
   both scopes as its start sequence prescribes, run
   `ListAgents` once for your own `name [ref]`, and say your start line: the
```

**P21.3 →**

```markdown
1. Read `tanto.json` as `SKILL.md` describes, write the agent definitions of
   both scopes as its start sequence prescribes, read your own `name [ref]`
   — from `claude agents --json` by your own `sessionId`, the basename of
   your transcript path, when you are a spawned Kanri, and from
   `ListAgents` when the human typed `/tanto kanri` in a tab — and say your
   start line: the
```

**P21.4** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
   recommendation and not a create request: the human sets the window or
```

**P21.4 →**

```markdown
   recommendation and not an ask of yours: the human sets the window or
```

**P21.5** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   suggestion in your own line, not a create request and not a roster
   action.
```

**P21.5 →**

```markdown
   suggestion in your own line, not an ask and not a roster
   action.
```

**P21.6** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
roster's first row on its own next wake-up; delete the handover file, because the Events line
is the record and a stale file must not start a false handover at the next
Kanri start; when the old Kanri's name is another's, remind the human in one
line to `/clear` that window when convenient — no deletion is asked;
continue at the handover's Next step, which decides whether a plan is in
flight.
```

**P21.6 →**

```markdown
roster's first row on its own next wake-up; delete the handover file, because the Events line
is the record and a stale file must not start a false handover at the next
Kanri start; write a `stop` request for the predecessor's `sessionId`, which
is the whole of its retirement — its conversation is kept and nothing is
`/clear`ed — unless the predecessor was an interactive tab, in which case
remind the human in one line to `/clear` that window when convenient;
continue at the handover's Next step, which decides whether a plan is in
flight.
```

**P21.7** `skills/tanto/roles/kanri.md` — replace exactly these 14 lines

```markdown
**Kept Kanri** — no handover file, the first data row is you, and that row's
Transcript column is this session's own transcript path. This is a
re-invocation in the resident session: continue where the current ledger's
Progress line says, or, if none is open, wait for the human to say what the
next work is and open the topic as step 5 says. When the first row is you but
its Transcript column names a different session — a `/clear` without a
handover, or one run after the handover file was already consumed — this is
that same gap under your own name: run the Handover procedure in place and
without a file — rewrite the row's Transcript column to your own path, write
an Events line `cleared: stale transcript, row rewritten in place`, and read
the ledger's Session events for `unanswered:` lines that have no `answered:`
pair and answer those first — this gap has no handover file, and a peer whose
line got `no-role` back in it re-sends on its own next wake-up — then
cold-read the ledger and continue as the paragraph above says.
```

**P21.7 →**

```markdown
**Kept Kanri** — no handover file, the first data row is you, and that row's
Transcript column is this session's own transcript path. This is a
`/tanto kanri` typed by the human in an attached Kanri: continue where the
current ledger's Progress line says, or, if none is open, wait for the human
to say what the next work is and open the topic as step 5 says. The
stale-transcript sub-case is gone with the `/clear`: a terminal seat has
none, and a first row that is you under another transcript can only be a tab
Kanri, which the Handover case above covers.
```

**P21.8** `skills/tanto/roles/kanri.md` — replace exactly these 14 lines

```markdown
   - Sekkei gets the topic, the spec location, and its standing grant,
     `human-access: granted — the spec dialogue — until the spec review is accepted`.
     When another topic's batch is in flight, the line says so: the spec is
     written to `.tanto/<topic>/spec-draft.md`, no branch is cut and nothing
     is committed; and it tells the spec reviewer that the in-flight plan's
     paths are out of scope.
   - Keikaku gets the topic, the spec path — committed, or the draft Sekkei
     left — the plan path, and its standing grant,
     `human-access: granted — the plan dialogue — until the plan is committed and the cold read answered`.
   - Jisso gets `queued: <n>` — its place in the plan's queue, in handshake
     order — and a roster row with status `queued`. Its orders are its batch
     prompt, which the loop sends when its turn comes and which names the
     plan, the ledger, and the branch. A Jisso handshake with no plan landed
     is premature and is refused like any other.
```

**P21.8 →**

```markdown
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
```

**P21.9** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
A Jisso whose `mode=` is not `auto` also
earns a one-line warning to the human that a batch may stall on a Bash or
commit prompt; peer messages themselves are unaffected.
```

**P21.9 →**

```markdown
No mode warning is left to give: you write `auto` into every spawn request
yourself, and a tab seat whose `mode=` is not `auto` runs no batch.
```

**P21.10** `skills/tanto/roles/kanri.md` — replace exactly these 16 lines

```markdown
4. Ask the human to queue the plan's Jissos, as the Create table below
   prescribes: N windows, N the number of rows in the plan's Batches table
   plus one for the whole-branch review's fix wave, each running
   `/tanto jisso`; the human may open more, and fewer when they will
   be present to re-queue released windows — except on a plan naming its
   final boundary as the safe one (rule 11), which asks for the full N
   instead.
5. Answer each handshake `queued: <n>` with a `queued` row. When the first
   is queued, write batch A's prompt from `templates/batch-prompt.md` —
   addressed to that Jisso, `First batch, no previous verdict, no check: line.` in its
   previous-batch-verdict section, the first-Jisso line in its Setup on
   resume — save it as `.tanto/<topic>/batch-A-prompt.md`, send that name
   the one line `batch: .tanto/<topic>/batch-A-prompt.md` with the `no-role`
   line after it, without an idle subscription, and mark its row
   `live`. The later handshakes arrive while batch A runs and are queued
   the same way; batch A does not wait for them.
```

**P21.10 →**

```markdown
4. Write batch A's prompt from `templates/batch-prompt.md` —
   `First batch, no previous verdict, no check: line.` in its
   previous-batch-verdict section, the first-Jisso line in its Setup on
   resume, and no addressee name — save it as
   `.tanto/<topic>/batch-A-prompt.md`, and **write the `spawn` request** for
   its Jisso with `batch=` that path, on `sessions.jisso`'s family and
   effort, mode `auto`. You wait for nothing: the seat's orders are in its
   prompt, and its report is what wakes you next. On a plan whose Global
   Constraints say it edits this skill's own files, write **N** requests in
   this one act instead, N the rows of the plan's Batches table plus one for
   the fix wave, each with `queue=<topic>` and no batch path; then send the
   first of them the one line `batch: .tanto/<topic>/batch-A-prompt.md` with
   the `no-role` line after it. The others wait, reading nothing, and each
   later batch's prompt reaches the next as a line.
5. Write the roster rows of whatever the result files carry when you next
   touch the roster — `queued` for the seats of a skill-editing plan, `live`
   for the one that has the batch A prompt. No handshake arrives and none is
   answered.
```

**P21.11** `skills/tanto/roles/kanri.md` — insert after these 1 lines

```markdown
   tanto=<skill dir>
```

**P21.11 →**

```markdown
   seat=<the spawner result file of the Jisso that ran this batch, or none>
```

**P21.12** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
4. **Check the lifecycle tables and the handover trigger.** Both are read off
   the verdict line, not measured again here. `ceiling: over, present` is
   handover signal 4 and runs the handover at this boundary; `over, absent`
   defers it, with the three writings the Handover section prescribes and the
   Measurements deferrals entry your step 6 `record` call writes from
   `--deferred`; a `compactions:` figure
```

**P21.12 →**

```markdown
4. **Check the lifecycle tables and the handover trigger.** Both are read off
   the verdict line, not measured again here. `ceiling: over` is handover
   signal 4 and runs the handover at this boundary, whether or not anyone is
   in the room: the successor is spawned, so there is nothing to defer for;
   a `compactions:` figure
```

**P21.13** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```markdown
   If a create request is due, make it, unless a
   handover trigger has fired and is not deferred, in which case the
   successor makes it from the handover's Next step. Then the exits that
   fall at this boundary, per "Exit shoroku": the retiring Jisso's proposal
   is its report's Shoroku proposal section, recorded by the brief at step 2,
   so send it `release:` now and let step 6's `record` call mark its row
   `cleared` — a batch returned for rework
```

**P21.13 →**

```markdown
   If an ask of the human is due — a Sekkei or a Kaiseki — make it, unless a
   handover trigger has fired, in which case the
   successor makes it from the handover's Next step. Then the exits that
   fall at this boundary, per "Exit shoroku": the retiring Jisso's proposal
   is its report's Shoroku proposal section, recorded by the brief at step 2,
   so write its `stop` request now and let step 6's `record` call mark its
   row `stopped`; no `release:` line goes to it and nothing is `/clear`ed,
   and its conversation is kept on the same terms as `.tanto/<topic>/` — it
   is never `rm`ed — a batch returned for rework
```

**P21.14** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
   says them after a compaction. Run the `ListAgents` self-check of
   `SKILL.md`'s Resuming, once: the listing shows your own name, which only
   you can compare with your roster row, so it is not the brief's. Then send
   that Jisso the one line `batch: .tanto/<topic>/batch-<X>-prompt.md` with
   the `no-role` line after it, without an idle subscription. Then the one
   `record` call of this boundary:
```

**P21.14 →**

```markdown
   says them after a compaction. Then **write the `spawn` request** for the
   next Jisso with `batch=.tanto/<topic>/batch-<X>-prompt.md`; under a
   skill-editing plan's queue, send the next `queued` seat the one line
   `batch: .tanto/<topic>/batch-<X>-prompt.md` with the `no-role` line after
   it instead, without an idle subscription. Then the one
   `record` call of this boundary:
```

**P21.15** `skills/tanto/roles/kanri.md` — replace exactly these 15 lines

```markdown
3. When the final batch is accepted, run the close: the four steps of
   "Shoroku" below, whose first step is two proposals. Jisso's first: send
   the live Jisso one line —
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
   — check the proposal's form, record its rows, and send it `release:`.
   Then your own: write `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`
   from the ledger and the roster, as "Exit shoroku" says for your own
   exit, and record its items as `pending` rows of this ledger — at every
   plan close, whether or not you will decline the close's handover, so that
   the close is every seat's write-out, yours included. Then the one
   recommendation over Jisso's proposal and every source the `pending` rows
   name, the human's check on the brief, the direction, and the apply on
   this branch, in that order and with Jisso gone — a live Hosa's three
   steps, by the `close:` line "Delegation to Hosa" gives, or yours. Then
   put the merge decision to the human, once the commit is verified.
```

**P21.15 →**

```markdown
3. When the final batch is accepted, run the close: the four steps of
   "Shoroku" below, whose first step is two proposals. Jisso's first: send
   the live Jisso one line —
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
   — check the proposal's form, record its rows, and write its `stop`
   request.
   Then your own: write `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`
   from the ledger and the roster, as "Exit shoroku" says for your own
   exit, and record its items as `pending` rows of this ledger — at every
   plan close, whether or not you will decline the close's handover, so that
   the close is every seat's write-out, yours included. Then the one
   recommendation over Jisso's proposal and every source the `pending` rows
   name, and the **kessai**: one message in your own window carrying the
   recommendation, the merge decision, and the merge's default form,
   answered by exception. That one answer is the direction and the merge
   approval, and the merge question is no longer a second question.
```

**P21.16** `skills/tanto/roles/kanri.md` — replace exactly these 17 lines

```markdown
**Signals 3 and 4 fire a handover only when the human is present.** Run
`reading.js` on your own transcript with `--presence` at the check where the
signal fired. `present` means the handover runs at this check, by whichever procedure the
open-ledger rule below selects — the in-plan one whenever a ledger is open,
a topic's spec or plan stage included, and the between-plans one when none
is.
`absent` means it is **deferred**: record it as below, continue — the next
batch prompt at a boundary, the turn's own work otherwise — and re-check at
every later check, where a `present` verdict runs the handover then. Signal 1,
the plan close, hands over regardless, as decision-b6cb made it; signal 2, the
human's word, is presence itself. The reason is that a handover is complete
only when the human creates the successor, and the successor is what sends the
next batch prompt: a handover written to an empty room stops the run for as
long as the room is empty, while the batches could have run. Idle costs
nothing; a stalled run costs the time the human was away. The
`autoCompactWindow` your start line reported is the net beneath this, and a
compaction while the human is away is that net doing its work.
```

**P21.16 →**

```markdown
**Every signal fires the handover when it is read.** There is no presence
gate: the successor is spawned, not created by a hand, so a handover written
to an empty room stops nothing. The procedure is the one the open-ledger
rule below selects — the in-plan one whenever a ledger is open, a topic's
spec or plan stage included, and the between-plans one when none is.
`reading.js --presence` and `ceiling.presence_minutes` stay as an instrument
and a ledger figure, and no rule reads their verdict. The
`autoCompactWindow` your start line reported is the net beneath the ceiling,
and a compaction before a handover runs is that net doing its work.
```

**P21.17** `skills/tanto/roles/kanri.md` — replace exactly these 28 lines

```markdown
A deferred handover is written in three places, so that a successor or a cold
reader sees it:

- the Progress line of the ledger of the topic whose batches are in flight,
  else the oldest open topic's, gains the clause
  `handover deferred (absent, context=<n>, since <batch X | the spec stage | the plan stage>)`,
  kept until the handover runs or the plan closes;
- a roster Events line,
  `<date> — handover deferred at <batch X | the spec stage | the plan stage>: ceiling <c> crossed at context=<n>, human absent (last turn <m> min ago)`;
  and at the check where it finally runs, the ordinary `handover written by`
  line, whose Events entry names where the deferral began;
- the next batch prompt's previous-batch-verdict section carries the one line
  `templates/batch-prompt.md` holds for it, so that the prompt file the human
  may paste says what the run's state is.

A deferral counts nothing in the Residency row's Noticed column — that column
is compactions the session noticed, and a crossed ceiling is not one — but the
ledger's Measurements deferrals row takes an entry for it, naming the stage or
the batch, the context, and how long ago the human's last turn was.
When the human returns and speaks in your window, the next check finds
`present` and the handover runs. A human who says "continue" there declines
it the way the Handover section already describes, and the decline **ends**
the deferral rather than continuing it: rewrite the Progress clause to
`handover declined (present, context=<n>, at <batch X | the spec stage | the plan stage>)`,
write the Events line the Handover section prescribes, and do not fire
signal 4 again in this plan — the human has chosen to carry the seat to the
close, which hands over regardless (signal 1), and can call the handover at
any check by word (signal 2).
```

**P21.17 →**

```markdown
Nothing is deferred and nothing is declined: a handover that is due runs at
the check that found it, and the human hears of it in the one line the
successor's launcher prints. There is no clause by which a word of the
human's stops it: the gate that made one necessary is gone, and once the
file is written and the successor's request is out, the handover is done.
```

**P21.18** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```markdown
never deferred. Because the trigger is checked before the next prompt is
written, a handover that is due stops the
loop at that point, and the next prompt is the successor's to send. A
**deferred** handover is not a due one: the ceiling is crossed and the human is
not there to create your successor, so nothing stops here, the next prompt goes
out under you, and the deferral is re-checked at the next check — the boundary after
it, or the next turn while no batch is in flight.
```

**P21.18 →**

```markdown
never deferred. Because the trigger is checked before the next prompt is
written, a handover that is due stops the
loop at that point, and the next prompt is the successor's to write.
```

**P21.19** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
boundary has been sent and its commit verified. Between the last of those
and the handover file, dispatch nothing new: no batch prompt, no review, no
create request — the commit window's own slots are not new dispatches, and
a create request that fell due at this boundary is the successor's to make.
```

**P21.19 →**

```markdown
boundary has been sent and its commit verified. Between the last of those
and the handover file, dispatch nothing new and write no request: no batch
prompt, no review, no spawn — the commit window's own slots are not new
dispatches, and a seat that fell due at this boundary is the successor's to
start.
```

**P21.20** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
At every plan close, and whenever the human asks, print one of two lines to the
human. At a plan close it is always the second, because the close is itself a
handover trigger; "Kanri stays" is only ever the answer to the human's own
mid-plan question. The `[<ref>]` is the identity, and no create request
carries it: a role started with a bare `/tanto <role>` reads the roster's
first data row.
```

**P21.20 →**

```markdown
At every plan close, and whenever the human asks, print one of two lines to the
human. At a plan close it is always the second, because the close is itself a
handover trigger; "Kanri stays" is only ever the answer to the human's own
mid-plan question. The `[<ref>]` is the identity, and no request and no ask
carries it: every seat reads the roster's first data row.
```

**P21.21** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
The second form is followed by the numbered commands from the handover file.
```

**P21.21 →**

```markdown
The second form is followed by nothing: the successor is spawned, and the
handover file's Commands section says so in one line.
```

**P21.22** `skills/tanto/roles/kanri.md` — replace exactly these 13 lines

```markdown
4. Print the "Kanri hands over" line with the numbered commands, and stop
   with your closing line — opening with your own identity, as every
   closing line does: your work is in the handover file, the roster,
   and the ledger; the step that still needs this seat is none — the human
   `/clear`s this window and runs `/tanto kanri` in it. Send nothing to any
   peer; answer the human if asked; do nothing
   else.

If the human says "continue" instead of creating the successor, delete the
handover file, record the declined handover in the roster's Events (the `<k>`
counter stays), and resume — at loop step 6 at a batch boundary, at the turn's own work
in a spec or plan stage, at the next topic's opening after a plan close, or
waiting for the next topic between plans.
```

**P21.22 →**

```markdown
4. Write the `spawn` request for `/tanto kanri` on `sessions.kanri`, print
   the "Kanri hands over" line, and idle
   with your closing line — opening with your own identity, as every
   closing line does: your work is in the handover file, the roster,
   and the ledger; the step that still needs this seat is none. Lines that
   reach you from now on are answered as before, since this session is alive
   until the successor stops it, and any you do not answer are `unanswered:`
   events the successor pairs. Send nothing to any
   peer of your own accord; do nothing else.

A handover at which the mechanism itself changes hands is the one case in
which the file is written **before** the line to the human and the line
names a command: the successor cannot be spawned by a spawner the outgoing
session's own plan is only now putting on disk, so the launcher is what
starts it, and the launcher finds the handover file whatever the roster's
first row says. Which plan that is, and what the command reads, is the
plan's Global Constraints to say and never this file's.
```

**P21.23** `skills/tanto/roles/kanri.md` — replace exactly these 11 lines

```markdown
   path with the trailer, and reports the subject. Then, when the direction
   accepted a `fix` item, it replaces each accepted item's old text with its
   new text exactly once in the file named, runs lint on those paths and the
   README drift review when a `SKILL.md` changed, commits them once more by
   explicit path as `fix: text corrections from <topic>'s close`, and
   reports that subject too; an old text found zero or several times is
   reported as `fix skipped: <n> — <why>` and left for the human. Verify
   both commits as you verify any — `git status` clean, the diffs' paths
   those the direction names, lint on them (again, whole-repository if that
   is what the script does) — and fill the Written column: the docs subject
   for an adopted row, the fix subject for a `fix` row. An inbox item has no
```

**P21.23 →**

```markdown
   path with the trailer, and reports the subject. A `fix` item is **not**
   the apply's: it is shusei's, a Jisso batch of one task on the topic
   branch, rendered from `templates/batch-prompt.md` with each item's file,
   the text as it reads, and the text as it should read, verified by
   `passage-check.js verify` and committed once as
   `fix: text corrections from <topic>'s close` — run and reviewed like any
   batch, which is what closes decision-83aa's "a `fix` lands unreviewed by
   a subagent". Verify shoki's commits at their landing and shusei's at its
   boundary — `git status` clean, the diffs' paths
   those the direction names, lint on them (again, whole-repository if that
   is what the script does) — and fill the Written column: the docs subject
   for an adopted row, shusei's commit subject for a `fix` row, taken from
   the boundary's verdict. An inbox item has no
```

**P21.24** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
Where the commit lands: on the topic's branch, before the merge decision.
No other stage commits under `docs/` through this section.
```

**P21.24 →**

```markdown
Where the commit lands: on `main`, by your fast-forward of shoki's branch,
after the merge — `git merge --ff-only shoki-<topic>` when the shared
checkout is on `main`, `git push . shoki-<topic>:main` when it is on another
branch. No other stage commits under `docs/` through this section.
```

**P21.25** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
3. **The apply subagent writes.** Step 4 above, on this branch. The human
   sees the result at the merge decision.
```

**P21.25 →**

```markdown
3. **Shoki writes.** Step 4 above, in its own worktree, after the merge. The
   human saw the result at the kessai, which is the one answer this close
   waits for.
```

**P21.26** `skills/tanto/roles/kanri.md` — replace exactly these 25 lines

```markdown
### Delegation to Hosa

When the roster has a `live` Hosa row at a close, steps 2 to 4 are Hosa's.
After step 1 send Hosa one line, without an idle subscription:
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`.
`<topic>` is the topic word and the paths are the close's three files
under `.tanto/<topic>/`; the slot is `now` because no batch is in flight at
a close and Jisso is released. Hosa reads the ledger's `pending` rows for
the sources the recommend dispatch names, dispatches the recommender and
then the apply on their own kinds, form-checks and pastes the brief in its
own window, and writes the direction from the human's answer there; a
Kikaku decision file that answers the check reaches Hosa as
`decision: <path>`, one line from you. Hosa answers
`close done: <commit subject> — <reading>`, or `close blocked: <one line>`
when a form check fails twice or the answer does not arrive. On
`close done:` verify the commit as you verify any — `git status` clean, the
diff's paths those the direction names, lint on them — and the fix commit
beside it when the direction accepted a `fix` item, whose subject is fixed
by "The four steps" step 4 and rides no line; fill Adopted
from the direction file and Written from the subjects. You wait for none of
it: a close delegated is carried in the handover file's In flight block,
and the successor verifies. With no Hosa live, run the three steps
yourself, and add to your close line the suggestion to open one
(`/tanto hosa`), in the shape of the between-plans Kikaku suggestion.

```

**P21.26 →**

```markdown
### Shusei, shoki, and the landing

On the kessai answer, in one act: render
`.tanto/<topic>/batch-shusei-prompt.md` when the direction accepted a
non-empty `fix` group and write its `spawn` request on `sessions.jisso`;
write `.tanto/<topic>/shoki-brief.md` from `templates/shoki-brief.md` and
its `spawn` request — `role: shoki`, `worktree: shoki-<topic>`,
`addDir: [<root>]`, `sessions.shoki`'s family and effort, mode `auto`, the
prompt the one line `brief: <that path>`. Shusei runs as any batch and its
boundary fills the `fix` rows' Written column; then **you merge**:
`git merge --no-ff <topic>` on `main` in the shared checkout, the local
branch deleted, nothing pushed — the default form the kessai stated, or the
override the answer gave. An empty `fix` group merges on the answer
directly.

**The checkout is free the moment that merge lands, and two acts follow at
once.** Cut the next topic's branch if it is not cut yet — `git checkout -b
<topic>` from `main`, the same act the topic's opening would have done had
no batch been in flight (Start, step 5) — so that the tree sits on it from
here. Then, when that topic's spec was written as a draft, send its
persisting Keikaku the one line
`checkout free: branch=<topic> — commit the spec and the plan`, to that one
named seat and never to a broadcast; wait for its
`committed <subject> — <reading>`, verify it as you verify any commit, write
its `stop` request, and only then write that topic's batch A request
(issue-bb8c, issue-2b9c).

On shoki's `shoroku ready:` line — one wake-up — run the landing checks on
its worktree's tip (the repository's lint on the changed paths, the
frontmatter check, every new or amended issue carrying `Source:`, every
swept inbox copy's Triage filled), fast-forward `main` onto it by the form
"Where the commit lands" names, write the `rm` request, delete the branch
`shoki-<topic>` that `claude rm` keeps, move shoki's result file to
`.tanto/<topic>/spawner-results/`, mark the `S-n` rows written, and write
the Events line. A landing check that fails is a follow-up `docs:` commit
through the hotfix lane, never a re-run of shoki. A `shoroku blocked:` line
is a ruling: read the conflict's paths and either resolve it by hand in the
worktree — a hotfix-lane act, since the tree is yours — or hand the human
the question at your next line. **The close's handover does not wait for
shoki**: it fires after the merge and the archive move, so shoki's line
ordinarily reaches your successor, and the handover file's In flight block
says so.

```

**P21.27** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```markdown
**A topic the human ends before its final batch** — the plan not wanted,
the branch abandoned — still gets its close, over what is on disk: write
the T2 proposal yourself, in Jisso's absence, as you write your own — the
`pending` rows by number and what the ledger's Session events and Rulings
hold that no row does — then your own, and run steps 2 to 4, naming every
live and queued Jisso of the topic in the close's released line for the
human to `/clear`, their rows `cleared`, before the archive move; the apply
lands on the topic's branch, and the merge decision says whether that
branch lands.
```

**P21.27 →**

```markdown
**A topic the human ends before its final batch** — the plan not wanted,
the branch abandoned — still gets its close, over what is on disk: write
the T2 proposal yourself, in Jisso's absence, as you write your own — the
`pending` rows by number and what the ledger's Session events and Rulings
hold that no row does — then your own, and run the kessai and shoki,
writing a `stop` request for every live and `queued` Jisso of the topic,
their rows `stopped`, before the archive move; shoki's records land on
`main` whatever the branch's fate, and the kessai's one answer says whether
that branch lands.
```

**P21.28** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
2. On a grant, tell the human as a numbered list: 1. go to `<role>`'s window,
   `<name> [<ref>]`; 2. do `<what>`; 3. come back here. The role's exchange
   ends with `human-access: done — <what the human did or decided>`; note that
   line in the ledger's Session events.
```

**P21.28 →**

```markdown
2. On a grant, tell the human as a numbered list: 1. `claude attach <id>` for
   a terminal seat, or go to `<name> [<ref>]` for a tab seat; 2. do
   `<what>`; 3. ← back to the agent view, or the tab. For a terminal seat,
   also write an `attention` request whose message is
   `human-needed: <role> <topic> — claude attach <id>`, because a seat that
   idles on a grant is not `blocked` and the census would miss it. The
   role's exchange
   ends with `human-access: done — <what the human did or decided>`; note that
   line in the ledger's Session events.
```

**P21.29** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
The human is the only actor who can give a window a role or take one away,
and you are the only role that asks. A window is `/clear`ed and reused,
never closed: a session is identified by its transcript path, a window by
its `name [ref]`, which survives `/clear` (measured 2026-09-16), and the
roster's rows tell them apart. Every create request is this numbered list,
which the human can paste:
```

**P21.29 →**

```markdown
A **terminal seat** — Keikaku, Jisso, the shusei batch, shoki, and your own
successor — you start yourself, by writing a request file the spawner acts
on; the human opens no window for it and takes none away. A **tab seat** —
Sekkei and Kaiseki — you ask the human for, and Kikaku and Hosa the human
opens unasked. A tab window is `/clear`ed and reused,
never closed: a session is identified by its `sessionId`, a window by
its `name [ref]`, which survives `/clear` (measured 2026-09-16), and the
roster's rows tell them apart. Every ask is this numbered list,
which the human can paste:
```

**P21.30** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
| When | Ask the human to | The request line carries |
| --- | --- | --- |
| bootstrap | nothing; the human opens a session and runs `/tanto kanri` | — |
| a plan is committed and your cold read has no open questions | queue the plan's Jissos: N windows, N the rows of the plan's Batches table plus one for the fix wave; more if the human wants, fewer if they will be present to re-queue released windows — except on a plan naming its final boundary as the safe one (rule 11), which asks for the full N instead, since the queue cannot be refilled before the plan's end | `/tanto jisso`, N, the plan path, the branch |
| the queue is empty and a batch, a fix wave, or a resume needs a Jisso | queue one more Jisso — a released window serves | `/tanto jisso`, the plan path, the branch |
| the spec review is accepted | create Keikaku | `/tanto keikaku`, the topic, the spec path |
```

**P21.30 →**

```markdown
The requests you write, and the asks you make. **Requests:**

| When | Write | The prompt carries |
| --- | --- | --- |
| a plan is committed and your cold read has no open questions | one `spawn` for batch A's Jisso — or N at once, each `queue=<topic>`, on a plan that edits this skill | `/tanto jisso batch=<path>`, or `/tanto jisso queue=<topic>` |
| every later batch, and the fix wave | one `spawn` per batch, at its boundary | `/tanto jisso batch=<path>` |
| the spec review is accepted | one `spawn` for Keikaku | `/tanto keikaku topic=<topic> spec=<path> plan=<path>` |
| the kessai is answered | one `spawn` for the shusei batch, and one for shoki | `/tanto jisso batch=<path>`, and `brief: <path>` |
| a handover is due | one `spawn` for your successor | `/tanto kanri` |
| a seat retires, or the run goes down | one `stop` per seat | — |

**Asks**, which are the numbered list above:

| When | Ask the human to | The line carries |
| --- | --- | --- |
| bootstrap | nothing; the human runs `tanto` and attaches | — |
| the first batch of the current plan is accepted, or every open topic has passed its spec stage | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei topic=<topic>` |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki topic=<topic>`; the brief follows the handshake |
| — | nothing; Kikaku and Hosa are opened by the human | — |
```

**P21.31** `skills/tanto/roles/kanri.md` — replace exactly these 10 lines

```markdown
| the live Jisso is gone — not in `ListAgents`, `SendMessage` errors, a `no-role` came back, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); mark the row `dead`, or `cleared` on a `no-role`, with the Events line saying its exit shoroku did not run and what was lost; send the next queued Jisso the prompt for the same batch, its resume line saying `resume batch X from task N`; the queue is one short, and the next boundary's line to the human asks for one more window (the Create table's third row) — on a plan that named its final boundary as the safe one (rule 11), where the queue was already asked for in full and cannot be refilled early, put the lost Jisso to the human as a ruling instead of a routine window request |
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then the create request; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "Exit shoroku", then the create request; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
| a Kikaku's reading shows a compaction | not replaced: mark the row `cleared`, add its `/clear` as a `for you` item instead of saying it inline, and let the next `/tanto kikaku` handshake write a new row — what the session produced is already on disk or committed |
| a Hosa's reading shows a compaction | nothing: the count arrives in its next reading, and the Hosa has already confirmed its summary's human items in its own window before continuing |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then, if the case is open, the create request with the same brief |
| A handover trigger fired at a boundary | run the Handover section; the successor reminds the human to `/clear` your window when it starts elsewhere |
| Sekkei is gone before the spec review is accepted | the create request; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Keikaku is gone before the plan is committed | the create request; the spec on the branch and the plan draft on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; the create request; the brief and the WIP commit are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
```

**P21.31 →**

```markdown
| the live Jisso is gone — the census marked it `gone`, `SendMessage` errors, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); mark the row `dead` with the Events line saying its exit shoroku did not run and what was lost; write a `spawn` request with the **same** `batch=` file, its resume line rewritten to `resume batch X from task N`. Under a skill-editing plan's queue, send that line to the next `queued` seat instead, and put the lost seat to the human as a ruling, since the queue cannot be refilled early |
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then the ask; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "Exit shoroku", then a `spawn` request with the same three keys; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
| a Kikaku's reading shows a compaction | not replaced: mark the row `cleared`, add its `/clear` as a `for you` item instead of saying it inline, and let the next `/tanto kikaku` handshake write a new row — what the session produced is already on disk or committed |
| a Hosa's reading shows a compaction | nothing: the count arrives in its next reading, and the Hosa has already confirmed its summary's human items in its own window before continuing |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then, if the case is open, the ask with the same brief |
| A handover trigger fired at a boundary | run the Handover section; your successor is spawned and needs nothing of the human's |
| Sekkei is gone before the spec review is accepted | the ask; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Keikaku is gone before the plan is committed | a `spawn` request with the same three keys; the spec on the branch and the plan draft on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; the ask; the brief and the WIP commit are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
```

**P21.32** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
| a batch is accepted at loop step 4 — the Jisso whose boundary is the plan's last excepted: the last implementation batch's while the review is pending, and the fix wave's — see "The final batch", steps 2 and 3 | its Jisso is done; `release:` to it, its row `cleared` by loop step 6's `record` call, the released line to the human; the next prompt goes to the next queued Jisso |
```

**P21.32 →**

```markdown
| a batch is accepted at loop step 4 — the Jisso whose boundary is the plan's last excepted: the last implementation batch's while the review is pending, and the fix wave's — see "The final batch", steps 2 and 3 | its Jisso is done; write its `stop` request, its row `stopped` by loop step 6's `record` call; no released line and no `/clear`, and its conversation is kept. The next batch's Jisso is a `spawn` request of its own |
```

**P21.33** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
| the close's apply is verified, the human has executed the merge decision, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every handshake the ledger's Session events accepted for it — Sekkei, Keikaku, every Jisso, queued ones that never ran included, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then mark `dead` the rows of any session no longer listed, move the dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

**P21.33 →**

```markdown
| the kessai is answered, shusei's batch is verified, the merge is done, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every seat the ledger's Session events accepted for it — Sekkei, Keikaku, every Jisso, `queued` ones that never ran included, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. Shoki's transcript is not in the list: it is not a session of the ledger's Session events. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then mark `dead` the rows of any session the census lost and no resume brought back, move the stopped, dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — move the topic's result files to `.tanto/<topic>/spawner-results/`, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

**P21.34** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
Every window is resumed at once rather than recreated, and the human types
`/tanto fukki` in your window first — the Resumed Kanri case above — and then
in each other window, in any order; no address is pasted. Mark `dead` only a
```

**P21.34 →**

```markdown
The terminal seats were never reached by the restart — separate processes,
still running — and after a reboot `tanto` resumes each of them under the
same `sessionId`. The human types `/tanto fukki` once, in your window, after
`claude attach`, and then in each tab seat's window, in any order. Mark `dead` only a
```

**P21.48** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```markdown
row whose session neither `ListAgents` lists nor re-handshakes by the time the
human says the windows are done. Verify the tree if a batch was in flight, then
ask for the roles still missing, in this order: Jisso only if a batch is in
flight and no `queued` row re-handshook — the next queued Jisso resumes the
batch otherwise, as the Replace table's first row says — Kaiseki only if a
bug is open, Keikaku only if a plan is in progress,
Sekkei only if a spec is in progress. Kikaku and Hosa you do not ask for: they
are the human's to reopen, and your part is the reminder.
```

**P21.48 →**

```markdown
row whose session neither `ListAgents` lists nor re-handshakes by the time the
human says the windows are done, and, for a terminal seat, reconcile the
roster with `seats.json`'s `renamed` marks and `claude agents --json`:
rewrite a renamed row's Name column, write the Events line
`resumed: <old name> → <new name>`, and clear each mark with an `ack`
request. Answer every ledger line marked `unanswered:`. A Jisso resumed
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

**Fixed at the plan review's follow-up (2026-09-21).** F-1's own review table
named nine sites, not eight; this ninth — the "Recovery" paragraph's own
reconciliation procedure (spec 1.8: the `renamed`/`ack` reconciliation, the
ledger's unanswered lines, a resumed Jisso's `resume batch X from task N`) —
was dropped from the follow-up dispatch by miscount and flagged back by the
fix pass itself. The Self-Review's spec-coverage row for 1.7 already credited
task 21 with "the `renamed` reconciliation" (a claim this block now makes
true) before this fix landed.

**P21.35** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
and Timing below admits a handover there, for the reason it gives. Run the
self-check of `SKILL.md`'s Resuming at the
same points — one `ListAgents`; a name that is not your row's means you were
resumed, and the roster's first row is rewritten before anything else.
```

**P21.35 →**

```markdown
and Timing below admits a handover there, for the reason it gives. You run
no resume self-check at any of these points, here or at loop step 6: a
terminal seat's rename is the spawner's census to detect (1.7), and your
own identity is the `sessionId` your request carried or your transcript's
own path, never a `ListAgents` reading of your own.
```

**Fixed at this dry run (2026-09-21).** F-12 named two sites for this
retirement, `roles/kanri.md` 562-564 (loop step 6's, **P21.14**) and 724-726
(the trigger's, this block); the needle **O21.2** already named the second
site and Step 1/3's needle sweep already listed it, but no passage removed
it — `replay --base 8fdd11a54df685dc044ba03975e1c2cd35ca6aff` caught the
gap as a nonzero residual on **O21.2** where every other needle without a
stated non-zero target read `0`.

**Fixed at the plan review (2026-09-21).** F-1 found nine sites of the old
close and the old commit window that no passage rewrote, so that after
batch D `SKILL.md` and this file would have disagreed on who dispatches the
apply, who is told to commit, and how a Kaiseki is asked for. **P21.36** to
**P21.48** are those nine (the ninth, **P21.48**, added in a second pass
after the first follow-up dispatch miscounted the review's own table at
eight), and **O21.26** to **O21.38** are the needles none of them had —
which is why `replay`'s residual sweep, which reads the `O` rows and
nothing else, never saw them. They are in id order, not file order;
`replay` and `verify` match a block by its text, never by a line number, so
the order they are written in does not matter and the order step 2 applies
them in does not either.

Two of the twelve carry a consequence worth stating outright. **P21.37** is
the only place in this plan that makes anyone **write** `commit-done:`: the
event `boundary.js check` pairs against (task 16) had a reader and no
writer, so without it `check` would name the same peer at every later
boundary for the rest of the run. And **P21.47** is a behavioral fix, not
only a spelling one: under task 22's **P22.21** a bare `/tanto kaiseki` is
**standalone** Kaiseki — no roster row, no handshake, no topic — so the
pasteable list, whose whole purpose is that the human can paste it
unedited, would start the wrong kind of seat every time it was used to ask
for an attached Kaiseki. `topic=<topic>` on line 5 is what makes the seat
attached, which is why the list carries it and the gloss says so.

**P21.36** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```markdown
5. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) The apply subagent's slot, which only the close fills: at
   the final batch's boundary, once `t2-direction.md` is written, dispatch
   `subagent_type: tanto-shoroku-apply` with the recommendation, the
   direction, and the commit subject, and verify its commit as you verify any
   — `git status` clean, the diff's paths those the direction names, lint on
   them (or on the whole repository where the lint script takes no path
   arguments). Jisso has already been released; it waits for nothing. At every
   other boundary this slot is empty. (b) Your
```

**P21.36 →**

```markdown
5. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) is empty at every boundary, the close's included: the
   write-out is shoki's, in its own worktree and after the merge ("Shusei,
   shoki, and the landing" below), and no subagent of yours commits in this
   window. The letter is kept because (b) and (c) are referred to by name
   elsewhere in this file. (b) Your
```

**P21.37** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```markdown
   (c) Tell Sekkei or Keikaku
   the boundary is verified, naming any Kaiseki create or release since the
   last boundary, then wait for the one-line reply —
   `committed <subject> — <reading>` or `nothing to commit — <reading>`;
   subscribe to its idle only
   when the reply is overdue, and record in the ledger's Session events if a
   notice came without a reply; skip (c) when neither is live. If a
```

**P21.37 →**

```markdown
   (c) The boundary line, to the peers
   the verdict file's Commit window section names and to no others: each is
   a Sekkei or Keikaku whose `commit-ready:` event has no `commit-done:`
   pair, and a peer with no event is sent nothing and answers nothing. Send
   each one line — the boundary is verified, commit, naming any Kaiseki ask
   or release since the last boundary — and wait for its
   `committed <subject> — <reading>` before the next spawn;
   subscribe to its idle only
   when the reply is overdue, and record in the ledger's Session events if a
   notice came without a reply. Pair each reply in step 6's `record` call
   with `--event "commit-done: <role> <topic> — <subject>"`: unpaired, the
   same peer is named again at every later boundary. An empty section is an
   empty slot. If a
```

**P21.38** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   have: this batch's `--state` and `--verdict`, the `--status` changes step 4
   decided, and `--deferred` — because the loop stops before
```

**P21.38 →**

```markdown
   have: this batch's `--state` and `--verdict` and the `--status` changes
   step 4 decided — the loop having stopped before
```

**P21.39** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
     --s-item "<source> | <item>" --deferred "<one line>"
```

**P21.39 →**

```markdown
     --s-item "<source> | <item>" \
     --event "commit-done: <role> <topic> — <subject>"
```

**P21.40** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
   Progress line, the Status changes this boundary decided — the retiring
   Jisso `cleared`, the Jisso you have just sent `live`, a seat released at
   step 4 `cleared` — one `--s-item` per item of an exit proposal step 4
   form-checked, and `--deferred` when step 4's ruling was a deferral. That
```

**P21.40 →**

```markdown
   Progress line, the Status changes this boundary decided — the retiring
   Jisso `stopped`, the Jisso you have just started `live`, a tab seat
   released at step 4 `cleared` — one `--s-item` per item of an exit
   proposal step 4 form-checked, and one `commit-done:` event per boundary
   reply step 5 took. That
```

**P21.41** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
   When the queue is empty, the Create table's Jisso row's request goes out
   instead — one window, queued by the same `/tanto jisso` — and the
   prompt waits for that handshake; the released windows are the ones to
   offer.
```

**P21.41 →**

```markdown
   There is no queue to empty on an ordinary plan: the prompt exists, so the
   request for the seat that reads it goes out in the same act. Under a
   skill-editing plan's queue, a queue that has run out is a ruling for the
   human, not a routine ask, because the plan's seats were all started at
   its landing and cannot be added to before its end.
```

**P21.42** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
3. **Rule.** When `rulings needed` or `human questions` is above zero, the
   verdict is `fail`, or `ceiling:` says `over, present`, read the verdict
```

**P21.42 →**

```markdown
3. **Rule.** When `rulings needed` or `human questions` is above zero, the
   verdict is `fail`, or `ceiling:` says `over`, read the verdict
```

**P21.43** `skills/tanto/roles/kanri.md` — replace exactly these 15 lines

````markdown
   failure dispatch the recommender once more, naming what failed; on a
   second failure paste the brief as it stands and tell the human in one
   line what is wrong with it. Then give the human, in one message: the
   recommendation's path, the brief's path, the three counts, and the
   brief's text verbatim below them. The human answers as the `shoroku`
   skill already parses — `OK` for "as recommended", or the numbers that go
   the other way, or an edit — in your window, or through a Kikaku decision
   file whose "What Kanri should do with it" section names this
   recommendation and answers it by exception: that file is the answer,
   read whole, its item numbers the recommendation's, everything it does not
   list as recommended, every override with its reason, and you need no word
   in your own window. Write `t2-direction.md` beside the recommendation,
   item by item, with the `S-n` rows in the ledger: Adopted from the answer.
   No item is escalated apart from the rest and none is decided by you
   alone; the human sees the whole list, grouped, and answers by exception.
````

**P21.43 →**

````markdown
   failure dispatch the recommender once more, naming what failed; on a
   second failure paste the brief as it stands and say in one
   line what is wrong with it. Then the **kessai**: one request, one
   message, one answer. Write an `attention` request whose message is
   `kessai: <topic> — claude attach <id>`, the spawner filling the id from
   `seats.json`, and print in your own window, in the chat's language:

   ```text
   kessai: <topic> — recommendation <path>; brief <path>; adopt <a>, fix <f>, reject <r>, unsure <u>.
   merge: --no-ff into main, delete the local branch, push nothing.
   Answer OK, or the item numbers that go the other way with your word for each, or a merge override; the brief follows.
   <the brief's text verbatim>
   ```

   The human answers there — `claude attach <id>`, type, ← back to the
   agent view — or through a Kikaku decision
   file whose "What Kanri should do with it" section names this
   recommendation and answers it by exception: that file is the answer,
   read whole, its item numbers the recommendation's, everything it does not
   list as recommended, every override with its reason, and you need no word
   in your own window; or by telling a live Hosa, whose one part in the
   close is the relay `kessai answer: <topic> — <the human's words
   verbatim>`. That one answer is the direction **and** the merge approval,
   and the merge is no longer a second question. Write `t2-direction.md`
   beside the recommendation,
   item by item, with the `S-n` rows in the ledger: Adopted from the answer.
   No item is escalated apart from the rest and none is decided by you
   alone; the human sees the whole list, grouped, and answers by exception.
   Until the answer arrives nothing else happens in this topic; the next
   topic's spec dialogue is not blocked by it.
````

**P21.44** `skills/tanto/roles/kanri.md` — replace exactly these 15 lines

```markdown
4. **Apply.** Dispatch `subagent_type: tanto-shoroku-apply` in apply mode with
   the recommendation, the direction, the commit subject —
   `docs: T2 shoroku for <topic>` — the inbox copies to fill, by path, and
   the fix subject, `fix: text corrections from <topic>'s close`, in slot (a)
   of the commit window. The
   subagent writes the accepted subset per `docs/AGENTS.md` and the per-type
   files, every issue opening with the `Source:` line its item's heading
   names — `Source: shoroku <topic> S-<n>` or `Source: inbox
   <YYYY-MM-DD>-<slug>` — and naming no report's source otherwise (the
   tracked-write rule of `SKILL.md`'s Messages); fills the Triage section of
   every inbox copy the dispatch named with the direction's outcome, its
   reference, and the date, so that the copy leaves the queue (untracked, so
   that write needs no slot); runs the repository's lint on the changed
   paths by name — or on the whole repository where the lint script takes
   no path arguments, which satisfies this step — commits once by explicit
```

**P21.44 →**

```markdown
4. **Shoki writes.** You dispatch no apply of your own. Render
   `.tanto/<topic>/shoki-brief.md` from `templates/shoki-brief.md` and write
   its `spawn` request, as "Shusei, shoki, and the landing" below
   prescribes; the brief names the recommendation, the direction, the inbox
   copies by absolute path, the commit subject
   `docs: T2 shoroku for <topic>`, and your own address as the roster's
   first data row. Shoki, in its worktree, dispatches
   `subagent_type: tanto-shoroku-apply` in apply mode and then
   `shoroku.review` over the result; the apply
   writes the accepted subset per `docs/AGENTS.md` and the per-type
   files, every issue opening with the `Source:` line its item's heading
   names — `Source: shoroku <topic> S-<n>` or `Source: inbox
   <YYYY-MM-DD>-<slug>` — and naming no report's source otherwise (the
   tracked-write rule of `SKILL.md`'s Messages); fills the Triage section of
   every inbox copy the brief named with the direction's outcome, its
   reference, and the date, so that the copy leaves the queue (untracked, so
   that write needs no slot); runs the repository's lint on the changed
   paths by name — or on the whole repository where the lint script takes
   no path arguments, which satisfies this step — commits once by explicit
```

**P21.45** `skills/tanto/roles/kanri.md` — replace exactly these 11 lines

```markdown
   context holds that no file does — and sends you one line. Check the
   file's form as "Exit shoroku" step 2 says, record its rows, and send it
   `release:`: the close is its exit, and it idles through nothing. Then
   write your own proposal and record its rows ("The final batch", step 3).
2. **Recommend and check.** Steps 2 and 3 above — a live Hosa's, by
   "Delegation to Hosa" below, or yours — with the roster's Residency rows
   of this run appended to the direction file for the dogfood report's
   Measurements table — the readings the archive will hold, kept under
   `docs/reports/` (issue-40ed); when Hosa holds the close, you append them
   to the direction file after its `close done:`, before the successor or
   you fill the ledger.
```

**P21.45 →**

```markdown
   context holds that no file does — and sends you one line. Check the
   file's form as "Exit shoroku" step 2 says, record its rows, and write its
   `stop` request: the close is its exit and no line goes to it. Then
   write your own proposal and record its rows ("The final batch", step 3).
2. **Recommend, then the kessai.** Steps 2 and 3 above, both yours: the
   recommend dispatch, then the one message answered by exception — with
   the roster's Residency rows
   of this run appended to the direction file for the dogfood report's
   Measurements table — the readings the archive will hold, kept under
   `docs/reports/` (issue-40ed). A live Hosa holds no part of the close now;
   its one part is relaying an answer the human speaks in its window.
```

**P21.46** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
   location (`docs/superpowers/specs/*-<slug>-design.md`), and no branch
   `<slug>` exists (`ls -d`, the glob, and `git branch --list <slug>`), state
   the slug in your reply, and create `.tanto/<topic>/kanri.md` from
   `templates/kanri.md`, where the `<topic>` is that slug. Never ask the
```

**P21.46 →**

```markdown
   location (`docs/superpowers/specs/*-<slug>-design.md`), and no branch
   `<slug>` exists (`ls -d`, the glob, and `git branch --list <slug>`), state
   the slug in your reply, and create `.tanto/<topic>/kanri.md` from
   `templates/kanri.md`, where the `<topic>` is that slug. Then **cut the
   branch**, which is yours alone and no peer's: `git checkout -b <topic>`
   from `main` in the shared checkout when no batch is in flight, so that
   the tree sits on it through the spec dialogue and a hotfix taken there
   lands on it. When a batch of another topic **is** in flight the checkout
   is not yours to move: the cut waits for that topic's merge, where
   "Shusei, shoki, and the landing" performs it, and the orders line you
   send Sekkei says the spec is a draft. Either way the `branch=` of every
   orders line and every request you write is the branch the tree is on
   after your cut. Never ask the
```

**P21.47** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

````markdown
5. /tanto <role>
```

Line 5 carries, after the command, the plan path, the branch, the topic, or
the spec path, as the Create table's third column names them for that role —
never an address: the new session reads the roster's first data row. The
````

**P21.47 →**

````markdown
5. /tanto <role> topic=<topic>
```

Line 5 always carries `topic=<topic>` and nothing else, as the Asks table's
third column names it. For Kaiseki the key is what makes the seat
**attached**: a bare `/tanto kaiseki` is standalone Kaiseki, a different
seat with no roster row, so this list is never pasted for a Kaiseki without
it. No address is ever pasted: the new session reads the roster's first
data row. The
````

**Anchors:**

**A21.1** `skills/tanto/roles/kanri.md` — `grep -c seat= skills/tanto/roles/kanri.md` — before: 0, after: 1

This is **P21.11**'s anchor, for the same reason **A20.1** is **P20.37**'s:
the boundary dispatch's prompt gains one line while its anchor line does not
change, so the new argument's own spelling is what `verify` measures.

**A21.2** `skills/tanto/roles/kanri.md` — `grep -c 'checkout free:' skills/tanto/roles/kanri.md` — before: 0, after: 1

**A21.3** `skills/tanto/roles/kanri.md` — `grep -cF 'git checkout -b' skills/tanto/roles/kanri.md` — before: 0, after: 2

These two are the branch's, and they are anchors rather than `O` rows
because the branch cut is the one change of this task that retires **no**
old spelling: nothing in this file cuts a branch today, and nothing sends
the persisting Keikaku a line, so there is no needle to sweep to zero.
**A21.2** is **P21.26**'s extended paragraph — the one line to one named
seat (issue-bb8c, issue-2b9c) — and **A21.3** counts both sites of the cut,
the topic's opening in **P21.46** and the merge in **P21.26**, which is the
whole of spec 2.1's "at the opening, or right after the predecessor's
merge".

- [ ] **Step 1: Run every needle before the edit**

```bash
while IFS= read -r needle; do
  printf '%s\t%s\n' "$(grep -rF -c "$needle" skills/tanto | grep -v ':0$' | tr '\n' ' ')" "$needle"
done <<'NEEDLES'
Resuming, once: the listing shows your own name
resumed, and the roster's first row is rewritten before anything else
**Signals 3 and 4 fire a handover only when the human is present.**
The reason is that a handover is complete
the human creates the successor
handover deferred (absent, context=
handover declined (present, context=
The human is the only actor who can give a window a role or take one away,
Every create request is this numbered list
Ask the human to queue the plan's Jissos, as the Create table below
Answer each handshake
Jisso gets
earns a one-line warning to the human that a batch may stall
Hosa row at a close, steps 2 to 4 are Hosa's.
Where the commit lands: on the topic's branch, before the merge decision.
**The apply subagent writes.** Step 4 above, on this branch.
item, it replaces each accepted item's old text with its
the fix subject for a
live and queued Jisso of the topic in the close's released line
3. come back here
move the dead, replaced, refused, and cleared rows
Every window is resumed at once rather than recreated, and the human types
queue the plan's Jissos: N windows
The second form is followed by the numbered commands from the handover file.
The apply subagent's slot, which only the close fills
skip (c) when neither is live
because the loop stops before
item>" --deferred "<one line>"
when step 4's ruling was a deferral
over, present
recommendation's path, the brief's path, the three counts
**Apply.** Dispatch
the close is its exit, and it idles through nothing
Delegation to Hosa
Line 5 carries, after the command
the Create table's Jisso row's request goes out
row re-handshook — the next queued Jisso resumes the batch otherwise
NEEDLES
grep -c 'create request' skills/tanto/roles/kanri.md
```

Expected: `skills/tanto/roles/kanri.md:1` for every needle — `handover
deferred (absent, context=` too, task 18 having removed the template's —
except `over, present`, which is
`skills/tanto/roles/kanri.md:2 skills/tanto/templates/boundary-brief.md:1`,
and `Delegation to Hosa`, which is `skills/tanto/roles/kanri.md:3`; and
`15` from the last line.

- [ ] **Step 2: Apply the forty-eight passages**

Apply **P21.1** through **P21.48** to `skills/tanto/roles/kanri.md`. They
are all in one file and none overlaps another, so the order is free; id
order is as good as any.

- [ ] **Step 3: Run every needle again, and the `create request` sweep**

Run step 1's command again.

Expected: an empty count for every needle except `over, present`, which is
`skills/tanto/templates/boundary-brief.md:1` until task 23's **P23.13**
takes it; and `0` from
`grep -c 'create request' skills/tanto/roles/kanri.md`. Nine sites of that
phrase remain elsewhere in the tree at this point — four in `SKILL.md` and
one in `templates/kanri.md`, both already removed by tasks 20 and 18, and
one each in `README.md`, `roles/hosa.md`, and two in `roles/kikaku.md`, which
tasks 22 and 23 remove — so the whole-tree count is `0` only at batch D's
boundary, which is what fence 4 checks.

- [ ] **Step 4: Check the new mechanisms are each named once where they belong**

```bash
grep -c 'spawn` request\|`spawn`' skills/tanto/roles/kanri.md
grep -cF 'seat=<the spawner result file' skills/tanto/roles/kanri.md
grep -cF 'shoroku ready:' skills/tanto/roles/kanri.md
grep -cF 'git push . shoki-' skills/tanto/roles/kanri.md
grep -cF 'kessai' skills/tanto/roles/kanri.md
grep -cF 'commit-done:' skills/tanto/roles/kanri.md
grep -cF 'checkout free:' skills/tanto/roles/kanri.md
grep -cF 'git checkout -b' skills/tanto/roles/kanri.md
grep -cF -- '--deferred' skills/tanto/roles/kanri.md
grep -cF 'tanto-shoroku-apply' skills/tanto/roles/kanri.md
```

Expected: a count above `5` for the first; `1`; at least `1`; `1`; above
`4`; at least `2` — the `record` call's argument and loop step 5's pairing
sentence; `1`; `2`, the opening's cut and the merge's; `0`; and `1`, the
apply named once as shoki's dispatch and nowhere as yours.

- [ ] **Step 5: Lint and verify**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 21
```

Expected: every hook `Passed` or `Skipped`; `verify clean`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs: Kanri writes requests, runs the kessai, and hands over without a gate

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`.

---

### Task 22: the six other role files

**Files:**

- Modify: `skills/tanto/roles/sekkei.md`
- Modify: `skills/tanto/roles/keikaku.md`
- Modify: `skills/tanto/roles/jisso.md`
- Modify: `skills/tanto/roles/hosa.md`
- Modify: `skills/tanto/roles/kaiseki.md`
- Modify: `skills/tanto/roles/kikaku.md`

**Interfaces:**

- Consumes: tasks 20 and 21 — the contract's two kinds of seat and Kanri's
  requests. Every sentence here points back at one of them.
- Produces: nothing later in this plan consumes it.

**Named-mechanism sites.** `release: /clear this window` after this task lives
in `roles/sekkei.md` (2) and `roles/kaiseki.md` (1) — tab seats, which keep
it — and in `SKILL.md`'s Messages bullet, which task 20 rewrote to name both
kinds; `roles/keikaku.md`'s two and `roles/jisso.md`'s one go here.
`review-ready:` as a ledger event is written in `roles/sekkei.md` and
`roles/keikaku.md` here, in `SKILL.md`'s Messages (task 20), and in
`roles/kanri.md`'s Human access paragraph, which already said it asks nothing
of Kanri. `commit-ready:` is written in both those role files here, read by
`boundary.js check` (task 16), reported in `templates/boundary-brief.md`
(task 23), and acted on in `roles/kanri.md`'s loop step 5 (task 21).
`roles/hosa.md`'s close and sweep sections are **removed whole**, per the
spec's answer to I-1, so that no stale sentence of the old close protocol
stands beside the new one.

**Old values this task contradicts.** Measured 2026-09-21.

**O22.1** `When Kanri's orders line says no batch is in flight, cut the branch from` — 1 (`sekkei.md`). Kanri cuts.
**O22.2** `If your work is ready and you have not heard, ask` — 2 (`sekkei.md`, `keikaku.md`). Both become the `commit-ready:` event.
**O22.3** `sent before you ask the human` — 1 (`sekkei.md`). `review-ready:` is an event.
**O22.4** `— one line, before you` — 1 (`keikaku.md`). The same line in its second spelling.
**O22.5** `, named after the topic, and commit the spec at the final path` — 1 (`keikaku.md`). The cut goes; the commit stays.
**O22.6** `Kanri asked for you at` — 1 (`keikaku.md`). Keikaku is spawned.
**O22.7** `and wait for Kanri's` — 1 (`keikaku.md`). The `release:` it waits for is a `stop`. Gone at **P22.11**.
**O22.8** `this window and end your turn. Work that reaches you before it` — 1 (`keikaku.md`). Nothing is `/clear`ed and no human is told anything. Gone at **P22.11**.
**O22.9** `— your place in this plan's queue` — 1 (`jisso.md`). No handshake, no `queued: <n>`.
**O22.10** `this window and end your turn: ` — 1 (`jisso.md`). The same rule in Jisso's spelling — two needles because two files say it in two ways.
**O22.11** ` follows. Two batches` — 1 (`jisso.md`). The sentence that named the `release:` line Jisso no longer gets.
**O22.12** `**The close's.** Sent as one line,` — 1 (`hosa.md`).
**O22.13** `**The inbox sweep's.** Sent between plans as one line,` — 1 (`hosa.md`).
**O22.14** `/tanto hosa [<address>]` — 1 (`hosa.md`).
**O22.15** `/tanto kikaku [<address>]` — 1 (`kikaku.md`).
**O22.16** `with no address — no roster, no handshake, no` — 1 (`kaiseki.md`). The standalone case is a missing `topic=` key now, not a missing address.
**O22.17** `in a workspace whose` — 1 (`kaiseki.md`). The attached case is a `topic=` key now.
**O22.18** `Resuming — one` — 4 (`jisso.md`, `kaiseki.md`, `keikaku.md`, `sekkei.md`). Two go — Jisso's and Keikaku's, both terminal seats — and two stay, `sekkei.md`'s and `kaiseki.md`'s, which are tab seats. The residual is **2**, and it is the one needle of this plan whose target is not zero.
**O22.19** `create request` — 1 in `hosa.md`, 2 in `kikaku.md`. All three go here; with tasks 18, 20, 21, and 23 the whole-tree count reaches `0`.

**Passages:**

**P22.1** `skills/tanto/roles/sekkei.md` — replace exactly these 7 lines

```markdown
When Kanri's orders line says no batch is in flight, cut the branch from
`main`, named after the topic, **before** the spec commit; everything from
here rides on that branch. When a batch of another topic **is** in flight,
the spec is a draft: write it to `.tanto/<topic>/spec-draft.md`, run Step 2's
review and the gate on that file, cut no branch, and commit nothing. The
checkout belongs to the topic whose batches are running; the Keikaku created
after that topic's merge cuts the branch and commits your text unchanged.
```

**P22.1 →**

```markdown
Kanri cuts the branch, at the topic's opening or right after the
predecessor's merge, and its orders line's `branch=` names the branch the
tree is on: you commit there and cut nothing. When a batch of another topic
**is** in flight, the spec is a draft: write it to
`.tanto/<topic>/spec-draft.md`, run Step 2's review and the gate on that
file, and commit nothing. The
checkout belongs to the topic whose batches are running; the Keikaku spawned
after that topic's merge commits your text unchanged, at its final path.
```

**P22.2** `skills/tanto/roles/sekkei.md` — replace exactly these 2 lines

```markdown
Send Kanri `review-ready: <document path>; brief: <brief path>` — one line,
sent before you ask the human, and it waits for nothing. Then put
```

**P22.2 →**

```markdown
Write the ledger event `review-ready: <document path>; brief: <brief path>`
yourself, through
`node "$TANTO/scripts/boundary.js" record --ledger <path> --event "<line>"`,
the ledger being the one your orders line's `ledger=` names — not a message,
and no wake-up of Kanri's. Then put
```

**P22.3** `skills/tanto/roles/sekkei.md` — replace exactly these 2 lines

```markdown
You learn both from Kanri. If your work is ready and you have not heard, ask
Kanri in one line and wait.
```

**P22.3 →**

```markdown
You learn both from Kanri. When your work is ready and no boundary line has
come, write the ledger event
`commit-ready: sekkei <topic> — <subject> — <YYYY-MM-DD HH:MM>` through
`boundary.js record --event`, to the ledger your orders line's `ledger=`
names, and go on with your work. Kanri opens the commit window at the next
boundary for the peers that event names, and for no others; you ask nothing
and wait for nothing.
```

**P22.4** `skills/tanto/roles/keikaku.md` — replace exactly these 4 lines

```markdown
You have done the model check and sent the handshake. Kanri asked for you at
the boundary "the spec review is accepted", and its orders line carries the
topic, the spec's path — committed, or a draft — the plan's path, and your
grant.
```

**P22.4 →**

```markdown
You have done the model check and sent **no** handshake: you are a terminal
seat, spawned at the boundary "the spec review is accepted", and the three
keys of your own prompt — `topic=`, `spec=`, `plan=` — are your orders. Your
standing grant, the plan dialogue, is implied by the role and stated here;
no orders line carries it, because there is no orders line.
```

**P22.5** `skills/tanto/roles/keikaku.md` — replace exactly these 10 lines

```markdown
## The branch and the spec commit

When the spec is a draft — Sekkei wrote it while another topic's batch was in
flight, so no branch was cut — this comes before any plan work. Cut the branch
from `main`, named after the topic, and commit the spec at the final path the
orders line names, its text **unchanged**. It is the branch's first commit,
and the review it has already passed is the review of that text: an edit of
your own here would put something nobody reviewed on the branch. Everything
from here rides on that branch.

```

**P22.5 →**

```markdown
## The branch and the spec commit

When the spec is a draft — Sekkei wrote it while another topic's batch was in
flight — this comes before any plan work, and it waits for the checkout.
Kanri cuts the branch and sends you the one line
`checkout free: branch=<topic> — commit the spec and the plan`; then commit
the spec at the final path your `spec=` key names, its text **unchanged**,
and answer `committed <subject> — <reading>`. It is the branch's first
commit, and the review it has already passed is the review of that text: an
edit of your own here would put something nobody reviewed on the branch. You
persist past the cold read until that commit is made and verified, however
long the checkout takes.

```

**P22.6** `skills/tanto/roles/keikaku.md` — replace exactly these 12 lines

```markdown
   `.tanto/<topic>/review-brief-plan.md`, the template, and the chat's
   language. Run the form check of `SKILL.md`'s **The brief's form** over what
   comes back; on a failure dispatch once more, and on a second failure send
   the brief as it stands, with one line to the human saying what is wrong
   with it. You never edit the brief. Send Kanri
   `review-ready: <document path>; brief: <brief path>` — one line, before you
   ask the human, and it waits for nothing. Then put the brief's text verbatim
   in your request for the one OK, with both paths, and record the answers in
   `dialogue.md` in the brief's reply shape. On the human's OK, commit under
   your commit rule below. A new brief is written when the human asks for one,
   or when the plan's judgment points changed after the answers — a changed
   batch cut included — not when its prose did.
```

**P22.6 →**

```markdown
   `.tanto/<topic>/review-brief-plan.md`, the template, and the chat's
   language. Run the form check of `SKILL.md`'s **The brief's form** over what
   comes back; on a failure dispatch once more, and on a second failure take
   the brief as it stands and say in `dialogue.md` what is wrong with it. You
   never edit the brief. Then **answer it yourself**: read every `choose` and
   `decide` point and take its `— If unanswered:` clause as the answer, every
   `confirm` point as confirmed, and record them in `dialogue.md` in the
   brief's reply shape under the heading
   `Plan brief — answered by default`, one line per point naming the clause
   taken. Write the ledger event
   `review-ready: <plan path>; brief: <brief path>` through
   `boundary.js record --event` — the human reads the brief when they like,
   and an override is a line in Kanri's window or a Kikaku decision file, as
   any ruling is. Then commit under your commit rule below. You wait for no
   one.
```

**P22.7** `skills/tanto/roles/keikaku.md` — replace exactly these 3 lines

```markdown
the one boundary you can see coming: one message in, one line back. So, after the edits, write your exit
proposal as the bullet below describes, run the self-check of `SKILL.md`'s
Resuming, and send **one** line carrying every pointer and the proposal:
```

**P22.7 →**

```markdown
the one boundary you can see coming: one message in, one line back. So, after the edits, write your exit
proposal as the bullet below describes and send **one** line carrying every
pointer and the proposal — no self-check runs first, a terminal seat's
rename being the census's to notice:
```

**P22.8** `skills/tanto/roles/keikaku.md` — replace exactly these 3 lines

```markdown
Then idle. Kanri sends you no `exit:` at this boundary; it checks the
proposal's form, records its items, and sends you
`release: /clear this window` at once. The
```

**P22.8 →**

```markdown
Then idle. Kanri sends you no `exit:` at this boundary; it checks the
proposal's form, records its items, and writes your `stop` request at once —
no line reaches you, nothing is `/clear`ed, and your conversation is kept.
The
```

**P22.9** `skills/tanto/roles/keikaku.md` — replace exactly these 2 lines

```markdown
You learn both from Kanri. If your work is ready and you have not heard, ask
Kanri in one line and wait.
```

**P22.9 →**

```markdown
You learn both from Kanri. When your work is ready and no boundary line has
come, write the ledger event
`commit-ready: keikaku <topic> — <subject> — <YYYY-MM-DD HH:MM>` through
`boundary.js record --event`, to the ledger the in-flight topic's `ledger=`
names, and go on with your work. Kanri opens the commit window for the peers
that event names and for no others.
```

**P22.10** `skills/tanto/roles/keikaku.md` — replace exactly these 4 lines

```markdown
  or `nothing to commit — <reading>`. Before the line, run the self-check of
  `SKILL.md`'s Resuming — one `ListAgents`; a name that is not your row's means
  you were resumed, and the handshake goes first. The authorization lasts until
  you answer or until Kanri's next message, and a commit you did not make
```

**P22.10 →**

```markdown
  — the reply is `committed <subject> — <reading>` alone, since the line
  reaches you only when you wrote the `commit-ready:` event that opened the
  window. No self-check runs first. The authorization lasts until
  you answer or until Kanri's next message, and a commit you did not make
```

**P22.11** `skills/tanto/roles/keikaku.md` — replace exactly these 6 lines

```markdown
  needs this seat, `none` — and wait for Kanri's
  `release: /clear this window`: Kanri checks the proposal's form, records
  its items as `pending` rows, and sends that line at once — no recommender
  runs before the topic's close, where your items are recommended and
  checked with everything else. On `release:` tell the human to `/clear`
  this window and end your turn. Work that reaches you before it — a report
```

**P22.11 →**

```markdown
  needs this seat, `none`. Kanri checks the proposal's form, records
  its items as `pending` rows, and writes your `stop` request at once — no
  recommender
  runs before the topic's close, where your items are recommended and
  checked with everything else. Your turn ends with your closing line and
  nothing else; the stop follows it, and you tell no human anything. Work
  that reaches you before it — a report
```

**Fixed at this dry run (2026-09-21).** The old block as first drafted opened
mid-sentence, two lines short: it started at "its items as `pending`
rows...", leaving the preceding "and wait for Kanri's `release: ...`" on the
two lines just before untouched, so the applied text read "release: /clear
this window: Kanri checks the proposal's form, records / its items as
`pending` rows, and writes your `stop` request" — a `release:` mention
directly contradicted by the `stop` sentence one line later. `replay`
caught the survival of both halves as nonzero residuals on needles **O22.7**
and **O22.8**, which the plan's own Step 1 sweep already listed as expected
to reach `0`.

**P22.12** `skills/tanto/roles/jisso.md` — replace exactly these 11 lines

```markdown
You have done the model check and sent the handshake. Kanri answers
`queued: <n>` — your place in this plan's queue — and nothing else until
your batch prompt. You are one of the plan's Jissos, and you run **one
batch**: it arrives as the one line `batch: <path>`, and the file that path
names is your orders — read it first — carrying the plan
path, the conductor ledger path, the branch, and which of the plan's Jissos
you are. **Until it arrives, read nothing** — not the plan, not the spec,
not the ledger: a waiting seat holds the minimum context, because every
wake-up re-reads all of it, and yours is a window that may wait hours. Your
closing line while you wait says so: no work yet, and the step that needs
this seat is your batch prompt.
```

**P22.12 →**

```markdown
You have done the model check and sent **no** handshake: you are a terminal
seat, and your own prompt carries one of two keys. With `batch=<path>` the
file that path names is your orders — read it first — carrying the plan
path, the conductor ledger path, the branch, and which of the plan's Jissos
you are; begin at once. With `queue=<topic>`, which only a plan that edits
the tanto skill uses, **read nothing** — not the plan, not the spec,
not the ledger — and wait for the one line `batch: <path>`: a waiting seat
holds the minimum context, because every
wake-up re-reads all of it, and yours may wait hours. Your
closing line while you wait says so: no work yet, and the step that needs
this seat is your batch prompt.
```

**P22.13** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```markdown
2. Before the line, run the self-check of `SKILL.md`'s Resuming — one
   `ListAgents`; a name that is not your row's means you were resumed, and the
   handshake goes first. Then send Kanri one line with that path.
```

**P22.13 →**

```markdown
2. Send Kanri one line with that path. No self-check runs first: a terminal
   seat's rename is the spawner's census to notice, and your identity is the
   `name` your own result file carried.
```

**P22.14** `skills/tanto/roles/jisso.md` — replace exactly these 8 lines

```markdown
   written, and Kanri's `release: /clear this window` follows. Two batches
   are the exception: the plan's last implementation batch, whose Jisso
   waits for the whole-branch review's verdict and gets either `release:`
   — the fix wave is the next Jisso's — or, when the review finds nothing,
   the `T2:` line below; and the fix wave itself, whose Jisso does not get
   `release:` either, but takes the `T2:` line once Kanri accepts it (see
   "The final batch", step 5). On `release:`, tell the human to `/clear`
   this window and end your turn: `none — /clear this window`.
```

**P22.14 →**

```markdown
   written, and Kanri's `stop` request follows — no line reaches you,
   nothing is `/clear`ed, and your conversation is kept. Two batches
   are the exception: the plan's last implementation batch, whose Jisso
   waits for the whole-branch review's verdict and is then stopped
   — the fix wave is the next Jisso's — or, when the review finds nothing,
   takes the `T2:` line below; and the fix wave itself, whose Jisso is not
   stopped at its boundary either, but takes the `T2:` line once Kanri
   accepts it (see "The final batch", step 5). Your turn ends with your
   closing line, and the stop follows it.
```

**P22.15** `skills/tanto/roles/jisso.md` — replace exactly these 7 lines

```markdown
**Your exit** is a boundary. Every Jisso but the plan's last leaves at the
boundary Kanri accepts, and its report's Shoroku proposal section is its
proposal — no `exit:` line comes, no exit file is written. The last Jisso
leaves at T2: the `T2:` line, the proposal above, and `release:` on its form
check. Either way you apply nothing and commit nothing at your exit, your
release follows the form check, and the recommendation, the human's check,
and the apply run with you gone.
```

**P22.15 →**

```markdown
**Your exit** is a boundary. Every Jisso but the plan's last leaves at the
boundary Kanri accepts, and its report's Shoroku proposal section is its
proposal — no `exit:` line comes, no exit file is written. The last Jisso
leaves at T2: the `T2:` line, the proposal above, and the `stop` on its form
check. Either way you apply nothing and commit nothing at your exit, your
stop follows the form check, and the recommendation, the kessai, and the
write-out run with you gone.

**Shusei.** A close whose direction accepted a `fix` group renders one more
batch prompt — `.tanto/<topic>/batch-shusei-prompt.md`, one task — and
spawns a Jisso for it. It is an ordinary batch in every respect: one
implement, its two reviews, the batch report, the boundary's verdict, the
stop. Its one task applies the direction's `fix` items, each a file with the
text as it reads and the text as it should read, verifies the result with
`passage-check.js verify`, and commits once by explicit path as
`fix: text corrections from <topic>'s close`.
```

**P22.16** `skills/tanto/roles/hosa.md` — replace exactly these 5 lines

```markdown
`/tanto hosa [<address>]` — with no address, Kanri's address is the first
data row of `.tanto/roster.md`. You have done the model and effort check
and sent the handshake; Kanri answers with one line,
"tracked files only in a slot I give" — it announces no address; you read the
roster's first data row at every send.
```

**P22.16 →**

```markdown
`/tanto hosa` — Kanri's address is the first data row of
`.tanto/roster.md`, and there is no address argument. You have done the
model and effort check
and sent the handshake; Kanri answers with one line,
"tracked files only in a slot I give" — it announces no address; you read the
roster's first data row at every send.
```

**P22.17** `skills/tanto/roles/hosa.md` — replace exactly these 44 lines

```markdown
**The close's.** Sent as one line,
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`
— `<topic>` a topic word. This is the topic's one shoroku stage, and you
run its three dispatched steps while Kanri goes on. Read the ledger's
Shoroku proposal items table for
the `pending` rows and the source each names, with its `S-n`; list the
untriaged copies under `.tanto/inbox/` — the Triage section absent, or its
Outcome none of `issue`, `fix`, `redirect`, `kaiseki`, `relay`, `dismissed`;
dispatch
`subagent_type: tanto-shoroku-recommend` in the `shoroku` skill's recommend
mode over the proposal, every one of those sources named with its `S-n`,
and every one of those copies by path, with `docs/` as the
baseline and `skills/` as the paths a `fix` item may touch, the
recommendation path, the brief path, the template
`templates/shoroku-brief.md`, and the chat's language; check the brief's
form by `grep`, without opening `roles/kanri.md` — `grep -c '^## '` on the
brief is `5`, the five headings
in order, every `###` heading of the recommendation once after `See:` —
and on a failure dispatch once more, then paste it as it stands; give the
human, here, the recommendation's path, the brief's path, the three
counts, and the brief's text verbatim, and take the answer as the `shoroku`
skill parses it — `OK`, the numbers that go the other way, or an edit — or
a `decision: <path>` line Kanri relays, which is the answer read whole;
write the direction file beside the recommendation, item by item; dispatch
`subagent_type: tanto-shoroku-apply` in apply mode with the recommendation,
the direction, the subject, the inbox copies you listed, by path, and the
fix subject — `fix: text corrections from <topic>'s close` — in the slot the
line gave — no
`slot-needed:` is sent, the slot is in the line; the apply makes the docs
commit and, when a `fix` item was accepted, the fix commit after it; and
answer Kanri
`close done: <commit subject> — <reading>`, the docs commit's subject. When
the brief fails its form
twice, or the human does not answer, answer `close blocked: <one line>`
instead and idle. Kanri verifies the commits and writes the ledger; you
write neither.

**The inbox sweep's.** Sent between plans as one line,
`sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`.
The same three steps as a `close:` line's, over the untriaged inbox copies
alone and no ledger: the paths are `.tanto/inbox-<YYYY-MM-DD>-*.md` beside
the roster, the fix subject is `fix: text corrections from the inbox sweep
<YYYY-MM-DD>`, the commits land on `main`, and you answer `close done:` or
`close blocked:` the same way.
```

**P22.17 →**

```markdown
**The kessai relay's.** The human may answer a close's kessai here rather
than in Kanri's window — they are already talking to you, and the question
reached them as a desktop notice. When they do, send Kanri one line and
nothing else:
`kessai answer: <topic> — <the human's words verbatim>`. Verbatim is the
whole of the chore: you do not summarize the answer, rule on an item, or
open the recommendation. That one line is the direction and the merge
approval, and Kanri does the rest.
```

**P22.18** `skills/tanto/roles/hosa.md` — replace exactly these 4 lines

```markdown
The proposal items and the ledger. You never write a proposal or an `S-n`
row: the session that holds the items writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` or a `sweep:` line, and only a subagent applies them. An
```

**P22.18 →**

```markdown
The proposal items and the ledger. You never write a proposal or an `S-n`
row: the session that holds the items writes the proposal, and Kanri
writes the rows. The close is not yours at all — the recommend is Kanri's
dispatch, the check is the kessai in Kanri's window, and the write-out is
shoki's — and you write no recommendation, no brief, and no direction. An
```

**P22.19** `skills/tanto/roles/hosa.md` — replace exactly these 2 lines

```markdown
You have a roster row, no topic. No create request, no `release:` line, no
replace row, and no exit shoroku. The human `/clear`s this window at will.
```

**P22.19 →**

```markdown
You have a roster row, no topic. Kanri neither asks for you nor spawns you,
you get no `release:` line, no
replace row, and no exit shoroku. The human `/clear`s this window at will.
```

**P22.20** `skills/tanto/roles/hosa.md` — replace exactly these 6 lines

```markdown
Any subagent you dispatch takes `subagents.default`, except the close's and
the sweep's
two: the recommender takes `subagents.shoroku.recommend` and is dispatched
as `subagent_type: tanto-shoroku-recommend`, the apply
`subagents.shoroku.apply` as `subagent_type: tanto-shoroku-apply`. You never
omit the model.
```

**P22.20 →**

```markdown
Any subagent you dispatch takes `subagents.default`, dispatched as
`subagent_type: tanto-default`. There are no others: the close's two kinds
went with the close. You never omit the model.
```

**P22.21** `skills/tanto/roles/kaiseki.md` — replace exactly these 7 lines

```markdown
**Attached.** `/tanto kaiseki` in a workspace whose `.tanto/roster.md` exists —
Kanri's address is the roster's first data
row. You have done the model check and sent the handshake. Kanri's reply
carries the brief path, or `no brief, stop`.

**Standalone.** `/tanto kaiseki` with no address — no roster, no handshake, no
batch loop. Ask the human for the symptom and the reproduction, and write your
```

**P22.21 →**

```markdown
**Attached.** `/tanto kaiseki topic=<topic>` — the key is what makes you
attached, and Kanri's address is the roster's first data
row. You have done the model check and sent the handshake. Kanri's reply
carries the brief path, or `no brief, stop`.

**Standalone.** `/tanto kaiseki` with no key — no handshake and no
batch loop, roster or no roster. Ask the human for the symptom and the reproduction, and write your
```

**P22.22** `skills/tanto/roles/kikaku.md` — replace exactly these 4 lines

```markdown
`/tanto kikaku [<address>]` — with no address, Kanri's address is the first
data row of `.tanto/roster.md`. You have done the model and effort check
and sent the handshake; Kanri answers with the open topics, if any — it
announces no address; you read the roster's first data row at every send.
```

**P22.22 →**

```markdown
`/tanto kikaku` — Kanri's address is the first
data row of `.tanto/roster.md`, and there is no address argument. You have
done the model and effort check
and sent the handshake; Kanri answers with the open topics, if any — it
announces no address; you read the roster's first data row at every send.
```

**P22.23** `skills/tanto/roles/kikaku.md` — replace exactly these 2 lines

```markdown
Kanri never requests a Kikaku. The human opens one when they want to think,
so there is no create request behind you and no `release:` waiting for you.
```

**P22.23 →**

```markdown
Kanri never asks for a Kikaku and never spawns one. The human opens one when
they want to think, so there is nothing behind you and no `release:` waiting
for you.
```

**P22.24** `skills/tanto/roles/kikaku.md` — replace exactly these 3 lines

```markdown
You have a roster row — role `kikaku`, no topic — with status `live`. No
create request, no `release:` line, no replace row, and no exit shoroku:
what you produce is on disk before the window closes.
```

**P22.24 →**

```markdown
You have a roster row — role `kikaku`, no topic — with status `live`. No
ask, no request, no `release:` line, no replace row, and no exit shoroku:
what you produce is on disk before the window closes.
```

**P22.25** `skills/tanto/roles/sekkei.md` — replace exactly these 1 lines

```markdown
  or `nothing to commit — <reading>`. Before the line, run the self-check of
```

**P22.25 →**

```markdown
  — the reply is `committed <subject> — <reading>` alone, since the line
  reaches you only when you wrote the `commit-ready:` event that opened the
  window. Before the line, run the self-check of
```

**Fixed at the plan review (2026-09-21).** F-22: **P22.3** rewrote the
sentence that told Sekkei to ask Kanri, but the boundary reply's own
`nothing to commit` half stood four lines below it, where spec 2.3 retires
it with the question. This is the same one-line change **P22.10** makes to
`roles/keikaku.md`, whose old text is byte-for-byte the same — a passage is
matched inside the file its lead names, so the two do not collide. The
self-check sentence on the next line is **kept**: Sekkei is a tab seat, and
`Resuming — one` is **O22.18**'s residual, which is `2` and not `0`.

- [ ] **Step 1: Run every needle before the edit**

```bash
while IFS= read -r needle; do
  printf '%s\t%s\n' "$(grep -rF -c "$needle" skills/tanto | grep -v ':0$' | tr '\n' ' ')" "$needle"
done <<'NEEDLES'
When Kanri's orders line says no batch is in flight, cut the branch from
If your work is ready and you have not heard, ask
sent before you ask the human
— one line, before you
, named after the topic, and commit the spec at the final path
Kanri asked for you at
and wait for Kanri's
this window and end your turn. Work that reaches you before it
— your place in this plan's queue
this window and end your turn:
 follows. Two batches
**The close's.** Sent as one line,
**The inbox sweep's.** Sent between plans as one line,
/tanto hosa [<address>]
/tanto kikaku [<address>]
with no address — no roster, no handshake, no
in a workspace whose
Resuming — one
NEEDLES
grep -rc 'create request' skills/tanto/roles | grep -v ':0$'
```

Expected: one hit each, except `If your work is ready and you have not heard,
ask` (`keikaku.md:1 sekkei.md:1`) and `Resuming — one` (four files); and
`hosa.md:1`, `kikaku.md:2` from the last line.

- [ ] **Step 2: Apply the twenty-five passages, file by file**

Apply **P22.1** to **P22.3** and **P22.25** to `roles/sekkei.md`, **P22.4**
to **P22.11** to
`roles/keikaku.md`, **P22.12** to **P22.15** to `roles/jisso.md`, **P22.16**
to **P22.20** to `roles/hosa.md`, **P22.21** to `roles/kaiseki.md`, and
**P22.22** to **P22.24** to `roles/kikaku.md`.

- [ ] **Step 3: Run every needle again**

Run step 1's command again.

Expected: an empty count for every needle except `Resuming — one`, which is
`kaiseki.md:1 sekkei.md:1` — the two tab seats that keep their self-check —
and nothing at all from the `create request` sweep over `roles/`.

- [ ] **Step 4: Check that the tab seats kept what they keep**

```bash
grep -c 'release: /clear this window' skills/tanto/roles/sekkei.md skills/tanto/roles/kaiseki.md skills/tanto/roles/keikaku.md skills/tanto/roles/jisso.md
grep -cF 'commit-ready:' skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md
grep -cF 'kessai answer:' skills/tanto/roles/hosa.md
grep -cF 'Shusei' skills/tanto/roles/jisso.md
```

Expected: `2` and `1` for the two tab seats, `0` and `0` for the two terminal
ones; `2` and `2` — each of the two peers names the event once where it
writes it and once where its boundary reply turns on it (**P22.3** with
**P22.25**, **P22.9** with **P22.10**); `1`; `1`.

- [ ] **Step 5: Lint and verify**

```bash
./scripts/lint.sh skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/jisso.md skills/tanto/roles/hosa.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 22
```

Expected: every hook `Passed` or `Skipped`; `verify clean`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/jisso.md skills/tanto/roles/hosa.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md -m "docs: the six other roles under the two kinds of seat

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`.

---

### Task 23: `README.md` and the three run-time templates

**Files:**

- Modify: `skills/tanto/README.md`
- Modify: `skills/tanto/templates/boundary-brief.md`
- Modify: `skills/tanto/templates/batch-prompt.md`
- Modify: `skills/tanto/templates/kanri-handover.md`

**Interfaces:**

- Consumes: tasks 16, 20, 21 — `--seat`, the contract, and Kanri's own
  procedure.
- Produces: nothing later in this plan consumes it. **These three templates
  are why batch D is one batch**: the `boundary.verify` subagent reads
  `boundary-brief.md` and renders `batch-prompt.md` from disk at every
  boundary, this plan's own included, so a change to either before the role
  files land would hand this plan's Kanri a verdict line its loaded role file
  cannot key on.

**Named-mechanism sites.** The verdict line's `ceiling:` half →
`roles/kanri.md`'s loop step 4 (task 21), which now keys on `under|over`
alone. `--seat` → `scripts/boundary.js` (task 16) and `roles/kanri.md`'s
dispatch prompt (task 21). The `## commit-ready` report → `check` prints it
(task 16), this brief copies it into the verdict file's Commit window
section, and `roles/kanri.md`'s loop step 5 reads that section and pairs
each reply with a `commit-done:` event (task 21); the peers that write the
event are `roles/sekkei.md` and `roles/keikaku.md` (task 22). The batch prompt's addressee → `roles/kanri.md`'s
step 4 and loop step 6 (task 21). The handover file's Commands → the launcher
(task 6), `roles/kanri.md`'s handover procedure and residency line (task 21).
The shoki-in-flight line → `roles/kanri.md`'s landing paragraph (task 21) and
`templates/shoki-brief.md`'s report line (task 19).

**Old values this task contradicts.** Measured 2026-09-21.

**O23.1** `Open one session per role and run` — 1 (`README.md`).
**O23.2** `role and takes it away; Kanri is the only role that asks.` — 1 (`README.md`).
**O23.3** `only while the human is there to start the successor` — 1 (`README.md`).
**O23.4** `from a queue the human fills at` — 1 (`README.md`).
**O23.5** `All three scripts are Node` — 1 (`README.md`).
**O23.6** `with no address is standalone Kaiseki` — 1 after task 20 (`README.md`), the last of the two.
**O23.7** `The command's optional second argument is the bootstrap` — 1 (`README.md`).
**O23.8** `create request` — 1 (`README.md`), the last of the twenty-four.
**O23.9** `# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan` — 1 (`batch-prompt.md`).
**O23.10** `the deferral line, written only when` — 1 (`batch-prompt.md`).
**O23.11** `ceiling: under|over, present|absent` — 1 (`boundary-brief.md`).
**O23.12** `present|absent` — 1 (`boundary-brief.md`), the same site in the sentence that explains it; both are needles because the verdict line and its gloss are two sentences.
**O23.13** `render with the addressee left as` — 1 (`boundary-brief.md`).
**O23.14** `its presence line` — 1 (`boundary-brief.md`), the Ceiling section's list.
**O23.15** `<The trigger that fired — the plan close, the human's word, or a compaction noticed — and when.>` — 1 (`kanri-handover.md`), three triggers where there are four.
**O23.16** `- Deferred — <the ledger's Progress clause` — 1 (`kanri-handover.md`).
**O23.17** `- A close delegated to Hosa — ` — 1 (`kanri-handover.md`).
**O23.18** `1. /clear this window.` — 1 (`kanri-handover.md`).

**Passages:**

**P23.1** `skills/tanto/README.md` — replace exactly these 5 lines

```markdown
- Runs one plan through separate interactive Claude Code sessions in the same
  repository and on the same branch: **Kanri** (管理) manages, **Sekkei** (設計)
  writes the spec, **Keikaku** (計画) writes the plan, **Jisso** (実装)
  implements, **Kaiseki** (解析) root-causes. The human gives a window its
  role and takes it away; Kanri is the only role that asks.
```

**P23.1 →**

```markdown
- Runs one plan through separate Claude Code sessions in the same
  repository and on the same branch: **Kanri** (管理) manages, **Sekkei** (設計)
  writes the spec, **Keikaku** (計画) writes the plan, **Jisso** (実装)
  implements, **Kaiseki** (解析) root-causes. A seat whose work is dialogue
  with the human — Sekkei, Kaiseki, and the two below — is a tab the human
  opens; every other seat is a background session an instrument of the
  skill's starts, stops, and resumes on a request file the run writes, so
  that no session ever issues a session-creating command. The human reaches
  a background seat with `claude attach` in the editor's own terminal.
```

**P23.2** `skills/tanto/README.md` — replace exactly these 9 lines

```markdown
- Holds **Kanri** under a context ceiling derived from that last figure — its
  own measured baseline plus a chosen number of batches of measured
  consumption — and hands the role over at the next boundary once it is
  crossed, but only while the human is there to start the successor;
  otherwise the crossing is recorded as deferred and the run continues to the
  plan close, which hands over in any case. **Jisso** is measured the same
  way and kept for the archive, but is replaced by rotation rather than by
  the ceiling: one fresh session per batch, from a queue the human fills at
  the plan's landing.
```

**P23.2 →**

```markdown
- Holds **Kanri** under a context ceiling derived from that last figure — its
  own measured baseline plus a chosen number of batches of measured
  consumption — and hands the role over at the next boundary once it is
  crossed, with nobody present: the successor is started by the run, and the
  plan close hands over in any case. **Jisso** is measured the same
  way and kept for the archive, but is replaced by rotation rather than by
  the ceiling: one fresh session per batch, started when that batch's prompt
  exists, except on a plan that edits this skill, whose executors are all
  started at its landing and wait, so that every one of them read the same
  skill.
```

**P23.3** `skills/tanto/README.md` — replace exactly these 4 lines

```markdown
- **Claude Code.** `tanto` needs `ListAgents` to see the live sessions and
  `SendMessage` to address them by name. Unlike `kisou`, `shoroku`, and
  `wayaku`, it is not host-agnostic and does not run on other Agent Skills
  hosts.
```

**P23.3 →**

```markdown
- **Claude Code, and its CLI's background sessions.** `tanto` needs
  `ListAgents` to see the live sessions and
  `SendMessage` to address them by name. Unlike `kisou`, `shoroku`, and
  `wayaku`, it is not host-agnostic and does not run on other Agent Skills
  hosts.
- **Claude Code CLI 2.1.277 or newer**, for `claude --bg`,
  `claude agents --json`, `claude attach`, and `claude --resume <id> --bg` —
  the four commands the spawner and the launcher are built on.
```

**P23.4** `skills/tanto/README.md` — replace exactly these 2 lines

```markdown
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js`,
  `scripts/reading.js`, and `scripts/boundary.js`. Every role runs the second
```

**P23.4 →**

```markdown
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js`,
  `scripts/reading.js`, `scripts/boundary.js`, `scripts/spawner.js`, and
  `scripts/tanto.js`. Every role runs the second
```

**P23.5** `skills/tanto/README.md` — replace exactly these 44 lines

````markdown
Open one session per role and run `/tanto <role>` in each — or
`担当して <role>` / `tantoして <role>`. The role word is accepted in hiragana,
kanji, or romaji (`かんり` / `管理` / `kanri`).

Start Kanri first, with no address:

```console
/tanto kanri
```

Every lifecycle role after Kanri starts when Kanri asks the human for a
window — the plan's Jissos all at its landing, in one request — and starts
with no address at all:

```console
/tanto sekkei
/tanto keikaku
/tanto jisso
/tanto kaiseki
```

Kikaku and Hosa are the human's own seats — `/tanto kikaku` and
`/tanto hosa`, opened whenever the human wants one. Every one of these finds
Kanri in the roster's first data row, read at the moment it sends.

The command's optional second argument is the bootstrap for a workspace whose
roster does not exist yet, and no create request carries it. No `tanto`
session is renamed once it has started, because a rename would invalidate
every address already held.

Every attached role then checks its model and sends Kanri one handshake line;
Kanri checks its model too, but receives handshakes rather than sending one,
and standalone Kaiseki sends none. Kanri replies with that role's standing
orders.

`/tanto kaiseki` with no address is standalone Kaiseki — the strong model leads
one debugging session, with no roster and no batch loop.

A window that comes back after an editor restart keeps its context and its
transcript but gets a new name; a closed tab is the exception now, because a
finished seat's window is `/clear`ed and reused rather than closed, and a
`/clear` keeps the name and the `[ref]`. `/tanto fukki` (復帰), typed in that
window, matches it to its roster row by that transcript path and rejoins it
to the run; no address is pasted, and Kanri's window goes first.
````

**P23.5 →**

````markdown
Put `skills/tanto/scripts/` on `PATH` — the two wrappers there, `tanto.bat`
and `tanto.sh`, are the human's one command — and run it in VS Code's
integrated terminal, at the repository's top level:

```console
tanto
```

It starts the spawner if none is running, finds the run's Kanri or asks the
spawner for one, resumes any background seat a reboot took, and prints the
one line to type next:

```console
claude attach <id>
```

`←` returns to the agent view and `Ctrl+Z` drops back to the shell; the
session keeps running either way. `tanto` is also the way back after a
restart, and it is idempotent: run twice, it starts nothing twice. Without
`PATH`, `node <skill>/scripts/tanto.js` does the same. `tanto down` stops
the spawner and keeps every conversation; `tanto down --seats` stops the
seats too.

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
batch loop. The background seats — Keikaku, every Jisso, the scribe that
writes the records, and Kanri's own successors — are never typed: the run
starts them with the keys they need.

A tab that comes back after an editor restart keeps its context and its
transcript but gets a new name, and `/tanto fukki` (復帰), typed there,
matches it to its roster row and rejoins it to the run. A background seat is
unaffected by the restart, and after a reboot `tanto` resumes it under the
same session id. The desktop notice tells the human when a seat is waiting
on them; an optional harness hook makes it immediate, and nothing requires
it.
````

**P23.6** `skills/tanto/README.md` — replace exactly these 8 lines

```markdown
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `boundary-brief.md` (the procedure the
  boundary's subagent follows), `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, `shoroku-brief.md` (the shoroku
  check brief), `tanto.json` (the built-in model and effort defaults),
  `kikaku-decision.md`, and `agent.md`, the subagent definition every role
  generates from.
```

**P23.6 →**

```markdown
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `boundary-brief.md` (the procedure the
  boundary's subagent follows), `shoki-brief.md` (the scribe's whole
  contract), `spawn-request.md` (the request schema), `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, `shoroku-brief.md` (the shoroku
  check brief), `tanto.json` (the built-in model and effort defaults),
  `kikaku-decision.md`, and `agent.md`, the subagent definition every role
  generates from.
```

**P23.7** `skills/tanto/README.md` — replace exactly these 6 lines

```markdown
- `scripts/boundary.js` — the boundary's own instrument, run by the subagent
  Kanri dispatches there: `check`, which runs the boundary's read-only
  commands and prints their output under fixed headings, and `record`, which
  writes the conductor ledger's and the roster's rows idempotently, with
  `scripts/boundary.test.js` beside it.
- All three scripts are Node, no dependencies, invoked as `node <path>`.
```

**P23.7 →**

```markdown
- `scripts/boundary.js` — the boundary's own instrument, run by the subagent
  Kanri dispatches there: `check`, which runs the boundary's read-only
  commands and prints their output under fixed headings, and `record`, which
  writes the conductor ledger's and the roster's rows idempotently, with
  `scripts/boundary.test.js` beside it.
- `scripts/spawner.js` — the one process in a run that issues `claude --bg`,
  `claude stop`, `claude rm`, and `claude --resume`: a resident started by
  the launcher and never by a session, taking request files, writing result
  files, keeping `seats.json`, running a census of `claude agents --json`,
  and raising the desktop notice. `spawner.js notify --stdin` is the
  one-shot the optional hook calls. `scripts/spawner.test.js` beside it.
- `scripts/tanto.js`, with `scripts/tanto.bat` and `scripts/tanto.sh` — the
  human's one command, and the two wrappers that are put on `PATH` as
  `tanto`. `scripts/tanto.test.js` beside it.
- All five scripts are Node, no dependencies, invoked as `node <path>`; the
  two wrappers are what is invoked bare.
```

**P23.8** `skills/tanto/README.md` — replace exactly these 2 lines

```markdown
`docs/superpowers/specs/2026-09-15-shoroku-at-close-design.md`, and
`docs/superpowers/specs/2026-09-19-tanto-diet-design.md`.
```

**P23.8 →**

```markdown
`docs/superpowers/specs/2026-09-15-shoroku-at-close-design.md`,
`docs/superpowers/specs/2026-09-19-tanto-diet-design.md`, and
`docs/superpowers/specs/2026-09-20-tanto-bg-seats-design.md`.
```

**P23.9** `skills/tanto/templates/boundary-brief.md` — replace exactly these 2 lines

```markdown
   node "<tanto>/scripts/boundary.js" check --plan <plan> --report <report> \
     --base <base> --kanri-transcript <kanri-transcript> --tanto <tanto>
```

**P23.9 →**

```markdown
   node "<tanto>/scripts/boundary.js" check --plan <plan> --report <report> \
     --base <base> --kanri-transcript <kanri-transcript> --tanto <tanto> \
     --ledger <ledger>
```

**P23.10** `skills/tanto/templates/boundary-brief.md` — replace exactly these 2 lines

```markdown
     --jisso "<name [ref]>" --jisso-reading "<Jisso's reading>" \
     --peer-reading "<role> <name [ref]> <reading>" \
```

**P23.10 →**

```markdown
     --jisso "<name [ref]>" --jisso-reading "<Jisso's reading>" \
     --seat <the seat= results path, when the dispatch carried one> \
     --peer-reading "<role> <name [ref]> <reading>" \
```

**P23.11** `skills/tanto/templates/boundary-brief.md` — replace exactly these 6 lines

```markdown
5. Render `.tanto/<topic>/batch-<Y>-prompt.md` for the next batch from
   `templates/batch-prompt.md`: the plan's Batches table gives the next
   batch's tasks, and the roster's `queued` rows in handshake order give the
   Jisso — when no row is `queued`, render with the addressee left as
   `<name> [<ref>]` and say so under Next prompt; the resident's create
   request fills it. Fill the Previous batch verdict section's first line from the
```

**P23.11 →**

```markdown
5. Render `.tanto/<topic>/batch-<Y>-prompt.md` for the next batch from
   `templates/batch-prompt.md`: the plan's Batches table gives the next
   batch's tasks, and the title's addressee slot reads `Jisso <n> of this
   plan` with **no name** — the seat that reads the file is the one the
   resident's `spawn` request will create, and the Guard paragraph binds it
   by workspace and branch alone. Under a plan that edits the tanto skill,
   the roster's `queued` rows in spawn order name the next seat and you say
   which under Next prompt. Fill the Previous batch verdict section's first line from the
```

**P23.12** `skills/tanto/templates/boundary-brief.md` — replace exactly these 6 lines

```markdown
Kanri's reading, its ceiling line, its presence line, and its `ttl=` line, as
`check` printed them; then Jisso's reading line

## Rows written

what `record` printed, as printed
```

**P23.12 →**

```markdown
Kanri's reading, its ceiling line, and its `ttl=` line, as
`check` printed them; then Jisso's reading line. The presence line, when
`check` printed one, is copied here too and read by nothing

## Commit window

the `## commit-ready` section `check` printed, verbatim — every
`commit-ready:` event of the ledger with no `commit-done:` pair — or
`none`. Kanri opens the commit window at this boundary for the peers named
here and for no others, so this section is the whole of what it reads on
the question; it never queries the ledger itself

## Rows written

what `record` printed, as printed
```

**P23.13** `skills/tanto/templates/boundary-brief.md` — replace exactly these 1 lines

```markdown
verdict: <verdict path> — pass|fail — rulings needed: <n>; human questions: <m>; compactions: <c>; ceiling: under|over, present|absent
```

**P23.13 →**

```markdown
verdict: <verdict path> — pass|fail — rulings needed: <n>; human questions: <m>; compactions: <c>; ceiling: under|over
```

**P23.14** `skills/tanto/templates/boundary-brief.md` — replace exactly these 3 lines

```markdown
the line on a clean boundary too. `ceiling:` copies the two verdicts from
Kanri's ceiling and presence lines — `unavailable` and `absent` respectively
when a line is missing, as `SKILL.md`'s reading section already reads them.
```

**P23.14 →**

```markdown
the line on a clean boundary too. `ceiling:` copies the one verdict from
Kanri's ceiling line — `unavailable` when the line is missing, as
`SKILL.md`'s reading section already reads it. The presence verdict is no
longer on this line: the handover has no presence gate, and nothing keys on
it.
```

**P23.15** `skills/tanto/templates/batch-prompt.md` — replace exactly these 1 lines

```markdown
# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan
```

**P23.15 →**

```markdown
# Batch <X> — tasks <N> to <M> — Jisso <n> of this plan
```

**P23.16** `skills/tanto/templates/batch-prompt.md` — replace exactly these 4 lines

```markdown
Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
`<repo path>` on branch `<branch>`, and to the Jisso named above. If that is
not your workspace or your name, reply `not me` to the roster's first data
row, read at that moment, and stop.
```

**P23.16 →**

```markdown
Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
`<repo path>` on branch `<branch>`. If that is not your workspace or your
branch, reply `not me` to the roster's first data
row, read at that moment, and stop. No name binds it: the seat that reads
this file is the one the request that named it created.
```

**P23.17** `skills/tanto/templates/batch-prompt.md` — replace exactly these 4 lines

```markdown
<Kanri fills — the deferral line, written only when Kanri's handover stands
deferred at this boundary, verbatim: "Kanri's handover is deferred since
<batch X | the spec stage | the plan stage> — the ceiling is crossed and the
human is absent; this batch runs under the same Kanri".>
```

**P23.17 →**

```markdown
<!-- The deferral line is gone with the presence gate: a handover that is due
runs at the boundary that found it, and its successor is spawned. -->
```

**P23.18** `skills/tanto/templates/batch-prompt.md` — replace exactly these 3 lines

```markdown
Three slots in this file read `<Kanri fills>` in the rendered draft and are
filled by Kanri after it rules: the Previous batch verdict's ruling line, that
section's deferral line, and the first line below.
```

**P23.18 →**

```markdown
Two slots in this file read `<Kanri fills>` in the rendered draft and are
filled by Kanri after it rules: the Previous batch verdict's ruling line and
the first line below.
```

**P23.19** `skills/tanto/templates/kanri-handover.md` — replace exactly these 1 lines

```markdown
<The trigger that fired — the plan close, the human's word, or a compaction noticed — and when.>
```

**P23.19 →**

```markdown
<The trigger that fired — the plan close, the human's word, a compaction noticed, or the ceiling crossed — and when.>
```

**P23.20** `skills/tanto/templates/kanri-handover.md` — replace exactly these 4 lines

```markdown
  - Deferred — <the ledger's Progress clause, verbatim, when a handover
    stands deferred on the ceiling and the human's absence; "none"
    otherwise. The successor re-checks it at its own first check, where a
    `present` verdict runs what the outgoing session could not.>
```

**P23.20 →**

```markdown
  - Branch — <the branch this topic's tree is on, and whether it has been
    merged>
```

**P23.21** `skills/tanto/templates/kanri-handover.md` — replace exactly these 4 lines

```markdown
- A close delegated to Hosa — <`<topic>`, Hosa's `<name> [<ref>]`, the
  `close:` line's paths and subject, and whether `close done:` has arrived,
  or "none">; the successor verifies the commit on `close done:` and fills
  the ledger
```

**P23.21 →**

```markdown
- A shoki in flight — <`<topic>`, the worktree path, the time it was
  spawned, and `shoroku ready: not yet arrived`, or "none">; the successor
  runs the landing checks on that line, fast-forwards `main`, writes the
  `rm` request, and fills the ledger
```

**P23.22** `skills/tanto/templates/kanri-handover.md` — replace exactly these 4 lines

```markdown
Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor answers the marked lines first and announces nothing. Then
the `queued` Jissos, by name and place — the successor sends them nothing;
their batch prompt is a path they read at their own wake-up.
```

**P23.22 →**

```markdown
Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor answers the marked lines first and announces nothing. Then
the `queued` Jissos, which exist only under a plan that edits the tanto
skill, by name and place — the successor sends them nothing;
their batch prompt is a path they read at their own wake-up.
```

**P23.23** `skills/tanto/templates/kanri-handover.md` — replace exactly these 6 lines

```markdown
## Commands for the human

1. /clear this window.
2. /model <family> and /effort <level>, as `sessions.kanri` says; /clear
   keeps the model and resets the effort.
3. /tanto kanri
```

**P23.23 →**

```markdown
## Commands for the human

The successor is spawned; nothing is typed.
```

**P23.24** `skills/tanto/templates/boundary-brief.md` — replace exactly these 2 lines

```markdown
   from the report's header; Kanri's reading with its ceiling, presence, and
   `ttl=` lines.
```

**P23.24 →**

```markdown
   from the report's header; Kanri's reading with its ceiling, presence, and
   `ttl=` lines; and the `## commit-ready` section whole, which `check`
   prints whenever `--ledger` named a ledger.
```

**P23.25** `skills/tanto/templates/boundary-brief.md` — replace exactly these 2 lines

```markdown
that a line number quoted under Failures has a fixed referent. Then ten `##`
headings in this order — and an eleventh, `Measurement`, when the batch carried
```

**P23.25 →**

```markdown
that a line number quoted under Failures has a fixed referent. Then eleven
`##` headings in this order — and a twelfth, `Measurement`, when the batch carried
```

**Fixed at the plan review (2026-09-21).** F-23: `check` prints its
`## commit-ready` report (**P16.6**) but nothing carried it into the verdict
file, so the one reader who acts on it — the resident, at loop step 5 —
would have had to query the ledger for itself, which no other boundary
reading makes it do. **P23.12**, **P23.24**, and **P23.25** carry it the way
every other reading travels: `check` prints it, the brief copies it into a
section of its own, and Kanri reads that section. `roles/kanri.md`'s loop
step 5 (**P21.37**) names the section as the whole of what it reads on the
question.

- [ ] **Step 1: Run every needle before the edit**

```bash
while IFS= read -r needle; do
  printf '%s\t%s\n' "$(grep -rF -c "$needle" skills/tanto | grep -v ':0$' | tr '\n' ' ')" "$needle"
done <<'NEEDLES'
Open one session per role and run
role and takes it away; Kanri is the only role that asks.
only while the human is there to start the successor
from a queue the human fills at
All three scripts are Node
with no address is standalone Kaiseki
The command's optional second argument is the bootstrap
create request
# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan
the deferral line, written only when
ceiling: under|over, present|absent
present|absent
render with the addressee left as
its presence line
- A close delegated to Hosa —
1. /clear this window.
NEEDLES
```

Expected: `README.md:1` for the first eight — `with no address is standalone
Kaiseki` and `create request` having been reduced to `README.md` alone by
tasks 20, 21, and 22 — then one hit each in `batch-prompt.md`,
`boundary-brief.md`, and `kanri-handover.md` for the rest.

- [ ] **Step 2: Apply the twenty-five passages, file by file**

Apply **P23.1** to **P23.8** to `README.md`, **P23.9** to **P23.14** with
**P23.24** and **P23.25** to
`templates/boundary-brief.md`, **P23.15** to **P23.18** to
`templates/batch-prompt.md`, and **P23.19** to **P23.23** to
`templates/kanri-handover.md`.

- [ ] **Step 3: Run every needle again, and the whole-tree sweep**

Run step 1's command again, then the sweep fence 4 runs:

```bash
node -e '
const fs = require("node:fs");
const path = require("node:path");
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else if (/\.(md|js|json)$/.test(e.name)) files.push(p);
  }
})("skills/tanto");
const texts = files.map((f) => fs.readFileSync(f, "utf8"));
for (const n of ["create request", "queued: <n>", "present|absent", "close: <topic>", "sweep: inbox", "/tanto <role> [<address>]"]) {
  console.log(texts.reduce((a, t) => a + t.split(n).length - 1, 0) + "\t" + n);
}
'
```

Expected: an empty count for every needle of step 1, and six lines of
`0<tab><needle>` from the sweep — the whole-tree property batch D exists to
deliver.

- [ ] **Step 4: Check the brief still reads as one procedure**

```bash
grep -c '^[0-9]\. ' skills/tanto/templates/boundary-brief.md
grep -cF -- '--seat' skills/tanto/templates/boundary-brief.md
grep -cF -- '--ledger <ledger>' skills/tanto/templates/boundary-brief.md
grep -c '^## ' skills/tanto/templates/boundary-brief.md
grep -cF '## Commit window' skills/tanto/templates/boundary-brief.md
grep -cF '<Kanri fills' skills/tanto/templates/batch-prompt.md
grep -cF 'shoki in flight' skills/tanto/templates/kanri-handover.md
```

Expected: `7` — the brief keeps its seven numbered steps; `1`; `3`, the
`check` call's new `--ledger <ledger>` beside the two `record` calls that
already carried one; `16`,
one more than the `15` this file carries before the task, since the verdict
file's section list gains `## Commit window`; `1`; `3`, the
two slots the template still names plus the sentence that counts them
(`grep` sees the prose line too, and the figure is `4` before this task);
`1`.

- [ ] **Step 5: Lint and verify**

```bash
./scripts/lint.sh skills/tanto/README.md skills/tanto/templates/boundary-brief.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/kanri-handover.md
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-21-tanto-bg-seats.md --task 23
```

Expected: every hook `Passed` or `Skipped`; `verify clean`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/README.md skills/tanto/templates/boundary-brief.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/kanri-handover.md -m "docs: the README and the three run-time templates, with the role files

Co-Authored-By: Claude <noreply@anthropic.com>"
git status --porcelain
```

Expected: one commit; nothing from `git status --porcelain`. None of the four
is created by this task, so none needs a line-ending restore.

---

## Self-Review

**1. Spec coverage.** Every section of
`docs/superpowers/specs/2026-09-20-tanto-bg-seats-design.md`, and the task
that implements it:

| Spec section | Task |
| --- | --- |
| 1.1 the two kinds of seat | 20 (`SKILL.md`'s roles table, Invocation, Handshake), 17 (the roster's keeping rule) |
| 1.2 the launcher | 6 (`tanto.js` and the two wrappers), 5 (its suite), 4 (`loadSessions`) |
| 1.3 the spawner | 2 (`spawner.js`), 1 (its suite) |
| 1.4 request and result files | 3 (`templates/spawn-request.md`), 2 (the ops), 21 (the two lifecycle tables) |
| 1.5 the notice, and the optional hook | 2 (`noticeCommand`, `raiseNotice`, `notify --stdin`), 11 (measured), 20 (Human access's numbered list) |
| 1.6 invocation for a spawned seat | 20 (Invocation's key table, the Start sequence's three cases), 7 (the prompt form measured and written into the template) |
| 1.7 identity, the roster, the address | 17, 16 (`--seat`, `stopped`), 20 (the roster paragraph and The address), 21 (the `renamed` reconciliation) |
| 1.8 fukki | 6 (the launcher's step 5), 20 (Resuming, replaced whole), 21 (Recovery) |
| 2.1 the branch, and the spec kessai | 21 (Kanri cuts), 22 (`sekkei.md`, `keikaku.md`), 20 (Workspace), 18 (the ledger's Branch line) |
| 2.2 the plan stage | 22 (`keikaku.md`'s Step 4 item 6, its Start, its persistence), 21 (When the plan lands, steps 4 and 5) |
| 2.3 the batch loop, and the wake-up floor | 21 (loop steps 4 and 6), 16 (`check`'s unpaired events), 22 (the two peers' events), 20 (rule 3, Messages) |
| 2.4 the close kessai | 20 (Session exit step 3), 21 (The final batch step 3), 22 (`hosa.md`'s relay) |
| 2.5 shusei | 21 (the close's one act, the merge), 22 (`jisso.md`'s Shusei paragraph), 20 (Session exit step 4) |
| 2.6 shoki | 19 (`templates/shoki-brief.md`), 21 (the spawn, the landing, the two forms), 20 (Artifacts, Session exit), 3 (`sessions.shoki`, `shoroku.review`) |
| 2.7 the handover without the gate | 21 (the trigger, the three writings, Timing, the procedure), 23 (the handover template), 18 (the ledger), 20 (the config's `presence_minutes`) |
| 2.8 Hosa after this design | 22 (`hosa.md`, four sections) |
| 3 rule 11, and this plan | Global Constraints, the Batches section, and 20's **P20.42** |
| 4.1 `SKILL.md` | 20 |
| 4.2 `roles/kanri.md` | 21 |
| 4.3 the other role files | 22 |
| 4.4 the templates | 3, 17, 18, 19, 23 |
| 4.5 the scripts | 1, 2, 4, 5, 6, 16 |
| 4.6 `README.md` | 23 |
| 4.7 `docs/requirements/04f5-tanto.md` | **none, by design** — the close's apply writes it, and Global Constraints says this plan writes nothing under `docs/requirements/`, `docs/decisions/`, or `docs/issues/` |
| Where each change lives | the File structure section, which names every file of that table and assigns it a batch |
| Old values this plan contradicts | the `O` rows of tasks 16 to 23, one per entity, and fence 4's whole-tree sweep |
| Verification, items 1 to 9 | tasks 7 to 15, one report each |
| The ADRs, Requirements, Issues this design closes | **none** — all three are the T2 apply's, and no task here touches `docs/` |
| Out of scope | nothing in this plan touches Agent Teams, `subagents.<kind>` backends, shape 3, psmux, `--brief`, issue-7607, the ceilings, or the superpowers skills |

Two things the spec implies and this plan makes explicit, named so a reviewer
rules on them rather than discovers them:

- **The fake CLI is an environment seam, not a `PATH` shim.** The spec says
  "a fake `claude` on `PATH`"; on this host that would be a `.cmd`, which Node
  cannot spawn without `shell: true`, and the real call must not use a shell.
  Task 1 states the deviation and its reason, and `TANTO_CLAUDE_NODE` appears
  in no template and no role file.
- **`boundary.js` keeps `--deferred`.** The spec names three changes to that
  script and this is not one of them, so task 18 removes the Measurements row
  the flag writes to and the one test that exercised it, and says why the flag
  itself stays.

**2. Placeholder scan.** No `TBD`, no `TODO`, no "implement later", no "add
appropriate error handling", no "similar to task N", and no "write tests for
the above": every test body and every created file's content is written out in
full. Every `O` needle's count is the count a fixed-string search actually
printed over `skills/tanto/` on 2026-09-21, not an assumed one, and five
needles were **re-chosen after being run** because their first spelling
survived the plan's own new text — `Kanri skips the handshake and runs the
start sequence in` (the sentence stays, so **O20.4** is now
`Every other role does the handshake below.`), `what is running, ask them to
run` (**O20.5** is now `On a mismatch, tell the human what was`), `On a grant,
tell the human as a numbered list` (**O21.21** is now `3. come back here`),
`Status is one of` against **P20.22**'s first draft, and the two-needle row
that was **O21.25**. Four more were re-chosen because a needle may carry no
backtick and may not begin with `<`: **O17.11**, **O22.8**, **O22.10**,
**O22.11**, and **O22.16**. A re-chosen needle has to be re-chosen in three
places — the `O` row, the Step 1 sweep, and Step 3's Expected — and the
review found three tasks where only the first had been done (F-2); the
sweeps of tasks 20, 21, and 22 are now generated from their own `O` rows and
each was run against the tree to confirm the counts Step 1 states.
**O21.36** is a needle of a different kind and says so in its own row: the
line it names gains text rather than losing it, so the new spelling contains
the old one and the sweep keys on the gloss beneath it instead.

**2a. What `lint` reports.** `node "$TANTO/scripts/passage-check.js" lint` was
run against this plan while drafting and again after the review's pass, and
reports `lint: clean`: every lead is
well formed, every `N` matches its block's real line count, every id is
unique, every cited id exists, both insertions (**P20.37**, **P21.11**) carry
an anchor step (**A20.1**, **A21.1**), and no `O` needle occurs in the plan's
own new-passage text. Beside `lint`, the review's pass ran three checks of
its own over the working tree, by script: every one of the 166 `P` blocks'
old text occurs **exactly once** in the file its lead names; applying all of
them leaves every new passage occurring exactly as often as its group
declares; and sweeping all 129 `O` needles over that applied tree leaves one
nonzero residual, **O22.18** at `2`, which is the one needle whose stated
target is not zero. **`replay --base main` is still Keikaku's step 4** — it
runs the plan's own fenced commands, which those three checks do not, and it
is the one check this draft cannot stand in for. Six blocks were the ones to
watch there, because their old text was transcribed from a reading rather
than from a `sed` of the file at authoring time — **P22.17** (44 lines of
`roles/hosa.md`), **P21.26** (25 lines), **P21.31** (10 table rows),
**P20.24** (40 lines of Resuming), **P23.5** (44 lines of the README's Usage),
and **P20.39** (31 lines of the executables paragraph) — and all six are
among the 166 the first check passed.

**3. Type and name consistency.** The spawner's result fields are spelled the
same in task 1's assertions, task 2's `opSpawn` and `handleRequest`, task 3's
template, task 16's `writeSeatRow`, and task 23's brief: `sessionId`, `id`,
`name`, `cwd`, `transcript`, `startedAt`, `error`, `stopped`, `removed`,
`notified`, `channel`, `acked`. The six ops are `spawn`, `stop`, `rm`,
`resume`, `attention`, `ack` in tasks 1, 2, 3, 20, and 21 alike.
`seats.json`'s five statuses are `running`, `blocked`, `stopped`, `gone`,
`removed`; the roster's seven are `queued`, `live`, `stopped`, `cleared`,
`replaced`, `dead`, `refused`, and only `stopped` is in both sets, which tasks
1, 2, 16, 17, 20, and 21 each say. The flags are `--seat`, `--ledger`, and the
existing `--status` in tasks 16 and 23. The two lines shoki sends are
`shoroku ready:` and `shoroku blocked:` in tasks 19, 20, and 21. The two
ledger events are `commit-ready:` and `commit-done:` in tasks 16, 20, 21, and
22, and `review-ready:` in tasks 20 and 22. The two environment seams are
`TANTO_CLAUDE_NODE` and `TANTO_NOTICE_LOG` in tasks 1, 2, 5, and 6 and nowhere
else. `loadSessions(root, explicitConfig, explicitProjectConfig)` has the same
signature in task 4's passage, task 4's cases, and task 6's one call.

**4. Sizes.** Per task, the plan's own line count, its step count, and its
blocks:

| Task | Plan lines | Steps | Blocks |
| --- | --- | --- | --- |
| 1 | 524 | 6 | 1 W (400 lines) |
| 2 | 606 | 6 | 1 W (493 lines) |
| 3 | 205 | 6 | 2 P, 2 A, 1 W (70 lines) |
| 4 | 208 | 7 | 3 P, 1 A |
| 5 | 328 | 6 | 1 W (238 lines) |
| 6 | 429 | 7 | 3 W (300, 2, 2 lines) |
| 7 | 194 | 7 | none |
| 8 | 140 | 6 | none |
| 9 | 153 | 6 | none |
| 10 | 135 | 6 | none |
| 11 | 113 | 5 | none |
| 12 | 103 | 6 | none |
| 13 | 139 | 6 | none |
| 14 | 116 | 5 | none |
| 15 | 124 | 6 | none |
| 16 | 353 | 7 | 7 P, 1 A, 2 O |
| 17 | 313 | 7 | 7 P, 2 A, 11 O |
| 18 | 253 | 6 | 6 P, 2 A, 4 O |
| 19 | 213 | 5 | 1 W (117 lines) |
| 20 | 1235 | 6 | 44 P, 1 A, 38 O |
| 21 | 1489 | 6 | 48 P, 3 A, 38 O |
| 22 | 734 | 6 | 25 P, 19 O |
| 23 | 731 | 6 | 25 P, 18 O |

Every figure above was recounted by script after the plan review's pass, not
carried over.

**The largest task is task 21** at **1,468 plan lines and 6 steps** —
forty-seven passages and thirty-seven `O` rows over `roles/kanri.md`, the
resident's whole procedure, twelve of each added at the review, which found
eight sites of the old close and the old commit window that the first draft
left standing. **Task 20 is next** at **1,235 lines** — forty-four
passages and thirty-eight `O` rows over `SKILL.md`, the one file whose every
section this design touches. Neither can be split without splitting batch D,
which the spec forbids: `SKILL.md`'s Invocation, its roster paragraph, its
Messages bullets, and its rule 11 each key on a sentence one of the other
three tasks of that batch lands, and a boundary between them would leave a
session reading a half-edited contract. Task 2 is the
largest **file** deliverable at 493 written lines of JavaScript, and task 1 at
400 the largest test file.

The count that matters for a Jisso is the tree diff, not the plan's line
count: batch A1 writes about 965 new lines of JavaScript and 70 of Markdown;
A2 about 580 new lines and 45 changed; B1 to B3 change **no tracked line at
all** but one paragraph of `templates/spawn-request.md`; C changes about 150
lines and writes 117; D changes about 560 lines across eleven files.

**Every one of batch B's nine tasks is a sweep-and-check task**: its
deliverable is recorded output — a report under `.tanto/tanto-bg-seats/`, one
per spec Verification item — rather than a file, which inverts its reviewer's
standing instruction, since there is no diff to read and the review is of the
recorded commands and their output. Task 7 is the one exception in degree: it
also edits one paragraph of a template this plan created, by a step whose two
alternative texts are both written out, because a created path can carry no
`P` block. Task 1's deliverable is the other shape a reviewer must be told
about: a **red suite**, complete and correct, every one of whose twenty tests
fails until task 2 lands. No size threshold is set here; the figures are
recorded so that one can be chosen later (issue-7281).

**5. The batch cuts.** A1 and A2 are self-contained: the two instruments and
their tests, which nothing in the skill yet mentions, so the tree is coherent
at both boundaries. B1, B2, and B3 change no role file and almost no tracked
file, so their boundaries are the cleanest of the plan; they are three batches
and not one because nine measurements against a real CLI, two of them waiting
on the human's hands, is more than one seat should carry. C is the first batch
whose boundary leaves the tree **knowingly** inconsistent: `boundary.js`
accepts a status word and a flag that no template or role file uses yet, and
`templates/roster.md` names a `stopped` status that `SKILL.md`'s roster
paragraph does not. That is why the safe boundary is D's and why Global
Constraints forbids starting or replacing a role before it. D closes every gap
in one batch, and the fix wave after it lands no new mechanism.

**Two consequences of D's own boundary this plan's Kanri owns**, both in
Global Constraints and repeated here because they are the plan's only
deliberate divergences: the verdict line it reads at D's boundary and at the
fix wave's carries `ceiling: under|over` with no presence half, and the batch
prompt rendered there carries no addressee name — Kanri sends the fix-wave
prompt by hand to the window the human queued, as it has all plan.
