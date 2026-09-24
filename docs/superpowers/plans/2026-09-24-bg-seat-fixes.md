# bg-seat-fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A rework keeps its own files; a dispatch hands back with a status, never with work of its own running; a listing entry with no `pid` is not a live session; a terminal seat that has gone is resumed before a line is sent to it; the human's language is a setting.

**Architecture:** Two instruments change first — the spawner's resume lookup takes only an entry with a `pid`, and `boundary.js census` names a stale entry under Not listed — with one test added that pins `record`'s row for a rework's key. Then the contract, Kanri's and Jisso's role files, and the run-time templates carry the rework key, the resume-before-send rule, and the dispatch's foreground rule. Last, the `language` key and "the human's language" reach the contract, the role files, the templates, the README, and the repository's own first-message rule.

**Tech Stack:** Node 22 with no dependencies (`node --test`), Markdown, the tanto skill's `passage-check.js` for every passage below.

**Spec:** `docs/superpowers/specs/2026-09-24-bg-seat-fixes-design.md` — every task names the spec sections its passages carry out.

## Overview

The plan edits the tanto skill's own files, so contract rule 11 governs it.
Batch C lands the last of `SKILL.md`, the role files, the templates, and
the two `AGENTS.md` files, so it is the safe boundary — the plan's last
batch, and nothing after it touches `skills/tanto/`. The
rule-11 authority sentence, the queue at the landing, and the boundary
itself are the Global Constraints section's; the batch cuts, with each
batch's own stop conditions, are the Batches section's.

**Every site re-read at `a99aad2`.** The spec's `decide` point, answered
with its own answer: every site of the spec's section 7 was re-read at
`bg-seat-ergonomics`'s merge commit before a passage was written. This
branch's only commits since `a99aad2` are the spec's two, so the tree the
old blocks below were read from is that commit's. What the re-read found:

- Every heading section 7 names exists, and both **The census.** leads —
  `SKILL.md`'s under "Handshake and roster", `roles/kanri.md`'s under
  "Session lifecycle" — are present. No site moved.
- Spec 3.4 holds as written: `runCensus` in `scripts/spawner.js`, `cmdCensus`
  in `scripts/boundary.js`, and the launcher's map in `scripts/tanto.js`
  filter on `pid`, each with a test named "… (fix 1)", and `SKILL.md`'s
  census paragraph says "An entry with no `pid` is not listed." Still
  missing: `findResumed`'s `pid` condition and its test (Task 1), and the
  Not listed note of spec 3.2 item 3 with its test (Task 2).
- Spec 1.3 holds: `writeBatch` in `scripts/boundary.js` keys a row on its
  first cell and appends one when no row matches. Task 3 adds the test that
  pins it.
- Spec 6.5's language grep, taken fresh with the wrapped phrases included:
  **22 occurrences in 9 files** — `SKILL.md` 7, `roles/kanri.md` 4,
  `templates/review-brief.md` 4, `templates/shoroku-brief.md` 2, and one
  each in `roles/sekkei.md`, `roles/keikaku.md`, `templates/batch-report.md`,
  `templates/spawn-request.md`, and `README.md`. The count matches the
  spec's 22; the spec's "10 files" is a miscount of its own list, which
  names these nine.

**Sites the spec's section 7 does not name, taken so that no file
contradicts another** — each flagged again in its task:

- `roles/kanri.md`, "On a handshake", step 2 — "Mark `dead` every `live` or
  `queued` row the census does not list" states spec 5.3's `queued` rule in
  its old form (Task 5).
- `roles/kanri.md`, the batch loop's step 2 — the dispatch's `batch=<X>` and
  `batch-<X>-verdict.md`, the argument spec 1.1 names (Task 5).
- `SKILL.md`, "Session exit" — its paragraph "A seat that has stopped
  answering is past answering" is `roles/kanri.md`'s "A seat's exit" rule
  in its second spelling (Task 4); and "Invocation"'s Jisso row, which names
  `batch-<X>-prompt.md` (Task 4).
- `roles/jisso.md`, "The run", step 1 — the report's path, which spec 1.4
  has the Jisso take from the prompt's Report section (Task 6).
- `templates/roster.md` — its keeping rule and its status paragraph define
  `dead` for "a `live` or `queued` row" (Task 7).
- `templates/boundary-brief.md`, step 5's last sentence — which batch
  renders no next prompt, which spec 1.4 extends to the fix wave and a
  rework of either (Task 7).

**The issues this design closes are not on this branch, and may never be.**
`bg-seat-ergonomics`'s close files them from its S-33 and S-39, and that
close's scribe lands its records on `main` by a fast-forward after the
merge ("Shusei, shoki, and the landing" in `roles/kanri.md`) — after this
branch was cut from `a99aad2`. At this plan's drafting, `main` is still
`a99aad2` and `docs/issues/open/` holds no issue whose `Source:` is
`shoroku bg-seat-ergonomics`. This plan writes no task for them: the fixed
check `passage-check.js diff --base 8e37dee` reads the working tree against
a fixed base (`diffPlan`), so a mid-plan merge of `main` to reach them would
make every line of that close's own `docs/` write-out `unaccounted-added`
at every boundary after — the same failure mode this Overview's own choice
of `8e37dee` over `a99aad2` already avoids once. The spec's own section 7
routes the issues to the close instead ("`docs/` — by the close: … and the
issues"), where `main` will hold them if `bg-seat-ergonomics`'s close has
landed by then: see "Issues for the close", after the whole-branch review.

**Grouping.** Batch A is the instruments and nothing else: three tasks,
the two scripts and one test, none of which a Markdown task depends on for
its text. Batch B is spec sections 1, 2, 3.1's note, and 5 — the rework
key, the dispatch's foreground rule, and the resume before a send — in
`SKILL.md`, `roles/kanri.md`, `roles/jisso.md`, and the templates that key
on them, so that `templates/boundary-brief.md` and
`templates/batch-prompt.md`, which the `boundary.verify` subagent reads from
disk at every boundary, land with the role files that name the same key
(contract rule 11's "The run-time templates land with the role files").
Batch C is section 6, and the plan's last batch: `SKILL.md`, the three role
files, the templates, and the README inside the skill, and the two
`AGENTS.md` files of spec 6.6 (which no doc-system hook binds) outside it —
kept together because nothing after this batch may start or replace a role
(Global Constraints), and neither `AGENTS.md` file depends on anything a
later batch would land.

**How the passages below are written.** Every block is in the shape
`scripts/passage-check.js` parses; `$TANTO` is the skill's own directory,
`skills/tanto` in this repository, set in the same tool call as the
command. Every old block was read at `a99aad2`, and every block is a
replacement — no insertion — so the only anchors are Task 11's, which
check the two `AGENTS.md` lines against each other. A block that keeps
unchanged lines around its change keeps them so that its new text is
unique in its file, which `verify` counts.

**Reports and prompts follow the tanto templates.**

## Global Constraints

**This repository's rules (`AGENTS.md`), binding on every task:**

- Run `./scripts/lint.sh <the task's own changed paths>` and fix issues
  before committing; `lint.sh` takes file arguments, so a task lints its own
  paths, never the whole repository.
- Commit by explicit path with `git commit --only <paths>` — the index is
  shared with whatever else this checkout is doing; a new file needs
  `git add <paths>` first, since `--only` does not pick up untracked files.
- Every commit ends with `Co-Authored-By: Claude <noreply@anthropic.com>` —
  the harness supplies each session's own attribution line, so no task below
  names a family in its commit command.
- Never `git add -A` / `.` / `-u`, bare `git commit`, or `git commit -a`;
  never amend a published commit; never push to `origin/main`; never pass
  `--no-verify` or another hook bypass. No task below needs any of the four;
  a task that seems to is a reason to stop and ask, not to use the flag.
- `skills/tanto/SKILL.md`, the seven `skills/tanto/roles/*.md` files, and
  `skills/tanto/README.md` are agent instruction files that `AGENTS.md`'s
  "Never do" section forbids editing without explicit human approval. That
  approval is this plan's own spec, accepted at
  `docs/superpowers/specs/2026-09-24-bg-seat-fixes-design.md` (`ea06d80`,
  amended `8e37dee`) and signed off in
  `.tanto/bg-seat-fixes/review-brief-spec.md` ("Unsureも含めて all OK"). It
  covers exactly the edits this plan's tasks carry out — no task extends an
  edit beyond its own passages on the strength of this rule.
- `AGENTS.md` itself and `skills/kisou/templates/AGENTS.md` are repo-root
  Markdown and an agent instruction file respectively, under the same
  "Never do" rule; the approval for the one sentence each of them Task 11
  changes is the human's own answer to the spec dialogue's Q2 — "(b) 一文を修正
  (Recommended)" — quoted in the spec's §6.6 and recorded verbatim in
  `.tanto/bg-seat-fixes/dialogue.md`. It covers that one sentence in each
  file and nothing else in either.

**Model families (`tanto.json`, read at this plan's landing, not restated as
a fixed table here — a personal or project override can change them before
this plan closes, and a batch prompt names the family it dispatches with,
read fresh):** every implementing task runs under a Jisso session on
`sonnet`, effort `xhigh` (`sessions.jisso`); a `task.implement` subagent it
dispatches runs on `sonnet`, effort `high`; an SDD fix-round escalation
(rounds 4-5) runs on `opus`, effort `high` (`task.escalate` — above
`task.implement` on the family ladder, satisfying contract rule 6's check); a
spec- or quality-review subagent the SDD skill dispatches runs on `opus`,
effort `medium` (`task.review-spec`, `task.review-quality`).

**The shared-tree rule (contract rule 5):** a modification in the shared
checkout that a task or its own subagent did not make is not its to discard.
It is reported — the subagent tells its Jisso one line, the Jisso tells
Kanri one line — and is never run through `git checkout --` or `git clean`
on the task's own judgment. Only Kanri decides whether it is stray.

**Rule 11 — this plan edits the skill's own files.** While this plan is in
flight, the authority for its sessions is this plan's Global Constraints,
Kanri's orders line, and the batch prompts — not `skills/tanto/`'s role text
as it stands on disk at any moment before this plan lands (contract rule
11). Every Jisso of this plan is spawned at the plan's landing with
`queue=bg-seat-fixes`, reading nothing until its own batch prompt reaches
it, so that every one of them read the skill as it stood before batch A.

**Batch C is the safe boundary** — the first point from which a role may be
started or replaced, and this plan's last batch. No role is started or
replaced before it lands. The whole-branch review's fix wave, which runs
after it, can move that boundary again: when its findings touch `SKILL.md`,
a role file, or a template, the safe boundary is the fix wave's own landing
instead, and no role is started or replaced in the window between batch C
and the fix wave either.

**The issues `bg-seat-ergonomics`'s close will have filed are not this
plan's to close.** They land on `main` by a fast-forward this plan's own
branch does not see, and the fixed check `passage-check.js diff --base
8e37dee` reads a fixed base against the working tree, so a mid-plan merge
of `main` to reach them would make that close's own `docs/` write-out
`unaccounted-added` at every boundary after — the plan writes no task for
this, and no ruling is needed. "Issues for the close", after the
whole-branch review, is what this topic's own close applies instead.

**Two rules every task below already follows, stated here once rather than
per task:**

- **Named-mechanism rule.** A task that introduces or changes a named
  mechanism — a key name, a status word, a section pointer, a file-naming
  scheme — lists, in its own text, every other site in this plan's own files
  and in the files it touches, that names the same mechanism, so its
  reviewer checks them together. Each task's own "Named-mechanism sites"
  note is this rule applied.
- **Line-ending rule.** A task that creates or moves a Markdown file and
  later checks its line endings restores it with `git checkout -- <path>`
  after the commit, as one of the task's own steps — not only as part of a
  stop condition — because a written or moved file lands `w/lf` on this
  host every time (measured five of five in the `tanto-cost` run, and again
  in this plan's own drafting). "Issues for the close" applies this to the
  issue files it moves and rewrites, at the close rather than in a task.

**The `replay-skip:` declarations** (`git` commands and
`passage-check.js verify` invocations are skipped by `replay` automatically,
so the plan does not declare them):

```text
replay-skip: node --test — the scratch tree replay applies holds only the blobs of the paths this plan's passages touch, not a full checkout, and `node --test` needs siblings outside that set
replay-skip: ./scripts/lint.sh — the scratch tree carries no `.git`, `.pre-commit-config.yaml`, or the `mise`/`uv` toolchain that `lint.sh` needs
```

## Review Focus

Five inputs a person running or reviewing this plan is likely to meet, the
most likely first, each with the test that pins it or the reason none does:

1. A rework returned for rework again: its key is `<X>-rework-2`, never a
   rework of `<X>-rework-1`'s key, and every earlier row keeps its cells —
   pinned by Task 3's test, which records `B`, `B-rework-1`, and
   `B-rework-2` in turn.
2. A rework of the fix wave, whose own Batches row is keyed `fix wave` with
   a space while its files say `fixwave`: the rework's key is
   `fixwave-rework-<n>` for its files and its row alike, and the `fix wave`
   row is untouched — pinned by the same test.
3. A stale entry whose `cwd` no longer sits under the root — a seat that
   moved into a worktree before it was collected: `boundary.js census` notes
   it by its `sessionId`, wherever its `cwd`, since the row it belongs to is
   already under the root — pinned by Task 2's test.
4. A resumed seat whose process has not registered by the end of the
   spawner's poll: `findResumed` now waits past the stale entry and returns
   nothing, so the result carries no `name`. **Accepted as a known gap, not
   fixed here:** spec 5.1 answers it — the census names the session by its
   `sessionId` — and no script change is asked; a test for the absent case
   would only restate the thirty-second timeout.
5. A `queued` row the census does not list at a handshake: it stays
   `queued`, and its seat is resumed when its prompt is due. No script
   reads the Status column's `queued` against the listing — Kanri acts on
   the census's output — so this is held by the prose of Tasks 4, 5, and 7,
   which the whole-branch review reads together.

## Batches

| Batch | Tasks | Delivers | Stop conditions at this boundary |
| --- | --- | --- | --- |
| A | 1-3 | `findResumed`'s `pid` condition; `boundary.js census`'s stale-entry note; the `record --batch` rework-key test | `node --test skills/tanto/scripts/*.test.js` all green (the whole suite, since Task 1 changes the fake CLI `tanto.test.js` also reads); `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task <N>` for N in 1-3; `./scripts/lint.sh` on every path Tasks 1-3 touch; every O-needle of Tasks 1-3 at 0 over `skills/tanto/scripts/` |
| B | 4-7 | the rework key, the dispatch's foreground/hand-back rule, and resume-before-send, in `SKILL.md`, `roles/kanri.md`, `roles/jisso.md`, and the templates that key on them | `node --test skills/tanto/scripts/*.test.js` all green (`boundary.test.js` copies Task 7's two templates); `passage-check.js verify` for Tasks 4-7; `./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/boundary-brief.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md skills/tanto/templates/kaiseki-brief.md`; the O-needles of Tasks 4-7 at 0 over `skills/tanto/SKILL.md`, `skills/tanto/roles/`, and `skills/tanto/templates/`; `node "$TANTO/scripts/boundary.js" census` run against this repository's live roster prints its four headings |
| C — the safe boundary, the plan's last batch | 8-11 | the human's language: the key, its definition, its scope, and every human-facing site of `SKILL.md`, `roles/kanri.md`, `roles/sekkei.md`, `roles/keikaku.md`, the four templates, and the README; the two `AGENTS.md` files' one sentence each | `node --test skills/tanto/scripts/*.test.js` all green; `passage-check.js verify` for Tasks 8-11; `./scripts/lint.sh` on every path Tasks 8-11 touch, `AGENTS.md` and `skills/kisou/templates/AGENTS.md` included; Task 11's own byte-comparison anchors (A11.2, A11.3) at their stated `after:` values; **every O-needle of the whole plan, swept fresh over `skills/tanto/SKILL.md`, `skills/tanto/roles/`, `skills/tanto/templates/`, `skills/tanto/README.md`, and `skills/tanto/scripts/`, is 0** — this is the boundary at which every file the plan touches agrees with every other, so it is where a needle a task under-scoped would surface |
| — (after C) | the whole-branch review and its fix wave | the branch reviewed against `main`, findings applied | the review's own stop conditions, as every plan carries; a finding that touches `SKILL.md`, a role file, or a template moves the safe boundary to the fix wave's own landing (Global Constraints) |

A stop condition worded as a property of the whole tree — "every O-needle …
is 0", "the script suite is green" — is backed by a command that sweeps the
whole tree (`skills/tanto/` in full, or `skills/tanto/scripts/*.test.js` in
full), not only the files the batch itself wrote.

## How a batch is verified

This plan carries passages and ships Node scripts with their tests, and
Markdown (the contract, the role files, the templates, the README, and two
`AGENTS.md` files). Every batch's
boundary runs the fixed checks below, plus the per-task and per-path checks
named after them, in order; a batch is accepted only when every one exits
clean, and a nonzero exit on a task or a path a later batch has not landed
yet is read against the Batches section's own Stop conditions for the batch
just landed, not against every task the plan will eventually carry.

**Fixed checks, run at every boundary from batch A onward, verbatim:**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/boundary.js" census
```

Expected: exit 0, printing its four fixed headings (Listed, Not listed, No
session id, Not held) against this repository's own live roster — `census`
already exists on this branch (a prior topic's plan landed it), so this
runs from batch A, needing nothing this plan's own tasks change until
Task 2 lands the stale-entry note it adds to the Not listed heading.

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --base 8e37dee
```

Expected: exit 0 — every passage this plan has landed so far, against the
branch's own diff from `8e37dee` (the spec's own final accepted commit on
this branch — this plan's own starting point — not `a99aad2`, which
predates the spec's two commits and would report the spec file itself as
unaccounted on every boundary, and not `main`, which by the time a later
boundary runs may already hold `bg-seat-ergonomics`'s close and would
report its `docs/` write-out as unaccounted too), agrees with what the
plan's blocks describe.

**Per-task and per-path checks, named by the task or the batch, never
hand-written, and never a fenced block here — each is either declared a
`replay-skip:` for the scratch-tree dry run or is itself parameterized per
batch:**

- **The runtime and the test suite, in full.** `node --version` reports a
  `v22` line (`CONTRIBUTING.md` pins Node 22 via `mise`; a version claim is
  a run, not an assertion — Keikaku's own dry run above ran the suite on the
  machine's default Node, 24.16, which is not this check; the Jisso's own
  boundary runs the pinned version), then
  `node --test skills/tanto/scripts/*.test.js` — the whole script suite,
  every batch, because a batch that changes one script's exported shape can
  silently break another script's test (Task 1's fake-CLI change is read by
  `tanto.test.js` too).
- **The passage check, per task the batch lands.**
  `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task <N>`
  for every `<N>` the batch's own row in the Batches section names — never a
  hand-written verify command.
- **Lint, by name, on the batch's own changed paths.**
  `./scripts/lint.sh <path> <path> …`, the paths being the ones the
  Batches section's Stop conditions name for that batch.
- **The content sweep.** Every `O` needle the batch's own tasks name,
  grepped over the scope each `O` block states — never only the files that
  task wrote. At batch C, the plan's last, the sweep runs once more over the
  whole of `skills/tanto/SKILL.md`, `skills/tanto/roles/`,
  `skills/tanto/templates/`, `skills/tanto/README.md`, and
  `skills/tanto/scripts/` (O1.1 and O2.1's own files, from batch A), since
  this is the boundary at which every file the plan touches agrees with
  every other.

A command that has never been run is a placeholder in a command's shape;
every command above is one this plan's own drafting already ran once
against a scratch copy of the tree, and Keikaku's dry run reruns them for
real.

## Tasks

### Task 1 — The spawner's resume waits for an entry with a `pid`

Spec 3.1, 3.2 item 2, 3.3, and 3.4. Three of the four readers took the
rule in `bg-seat-ergonomics`'s fix wave; this task confirms them and gives
the fourth, `findResumed`, its condition and its test. `findNew` is
unchanged: a spawn's session has no earlier process to leave an entry
behind.

**Files:**

- Modify: `skills/tanto/scripts/spawner.js`
- Test: `skills/tanto/scripts/spawner.test.js` — its fake CLI, which
  `skills/tanto/scripts/tanto.test.js` reads out of this file

**Interfaces:**

- Consumes: nothing from another task.
- Produces: `findResumed(root, sessionId)` returns only a listing entry of
  that `sessionId` that carries a `pid`. The fake CLI's `--resume` gives the
  resumed session `pid: 4322` when it had none, and a fake state's
  `resumeStaleListings: <n>` keeps the collected entry — its old name and
  id, no `pid`, `state: "blocked"` — in the next `<n>` listings after the
  resume.

**Named-mechanism sites.** "An entry with no `pid` is not a live session"
is also `runCensus` here, `cmdCensus` in `scripts/boundary.js` (Task 2),
the launcher's map in `scripts/tanto.js`, `SKILL.md`'s **The census.**
paragraph (Task 4), `roles/kanri.md`'s "Session lifecycle" Not listed
bullet (Task 5), and `templates/roster.md`'s keeping rule (Task 7).

**O1.1** `s.sessionId === sessionId);` — `findResumed`'s lookup, which takes the first entry of the `sessionId` (spec 3.2 item 2, `scripts/spawner.js` 360); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

- [ ] **Step 1: Confirm the three readers that already landed**

```bash
grep -n "&& s\.pid" skills/tanto/scripts/spawner.js skills/tanto/scripts/boundary.js skills/tanto/scripts/tanto.js
node --test --test-name-pattern "pid-less" skills/tanto/scripts/spawner.test.js skills/tanto/scripts/boundary.test.js skills/tanto/scripts/tanto.test.js
```

Expected: three `grep` lines — `spawner.js` in `runCensus`, `boundary.js`
in `cmdCensus`, `tanto.js` in the launcher's map — and none in
`findResumed`; the three "… (fix 1)" tests pass. A reader missing here is
a stop: spec 3.4 says it landed, so say so in the report rather than write
it again.

- [ ] **Step 2: Write the failing test**

Apply P1.2, P1.3, and P1.4. The fake CLI learns the stale entry a collected
seat leaves, and gives a resumed session a `pid` — the real CLI's resumed
process has one, and without it the launcher's own resume test in
`tanto.test.js` would wait out the whole poll once `findResumed` asks for a
`pid`.

**P1.2** `skills/tanto/scripts/spawner.test.js` — replace exactly these 7 lines

```js
  if (state.agentsHideSessionId && state.agentsHideCount > 0) {
    sessions = sessions.filter((s) => s.sessionId !== state.agentsHideSessionId);
    state.agentsHideCount -= 1;
    save();
  }
  process.stdout.write(JSON.stringify({ sessions }));
  process.exit(0);
```

**P1.2 →**

```js
  if (state.agentsHideSessionId && state.agentsHideCount > 0) {
    sessions = sessions.filter((s) => s.sessionId !== state.agentsHideSessionId);
    state.agentsHideCount -= 1;
    save();
  }
  // A resumed session whose process has not registered yet: the listing
  // still shows the collected seat's stale entry -- its old name and id, no
  // pid -- for stale.listings more listings (spec 3.2 item 2).
  let staleShown = false;
  sessions = sessions.map((s) => {
    if (!s.stale) return s;
    const { pid, stale, ...rest } = s;
    stale.listings -= 1;
    if (stale.listings <= 0) delete s.stale;
    staleShown = true;
    return { ...rest, name: stale.name, id: stale.id, state: "blocked" };
  });
  if (staleShown) save();
  process.stdout.write(JSON.stringify({ sessions }));
  process.exit(0);
```

**P1.3** `skills/tanto/scripts/spawner.test.js` — replace exactly these 4 lines

```js
  found.name = (state.next && state.next.name) || found.name;
  found.id = (state.next && state.next.id) || found.id;
  found.state = "running";
  delete found.hidden;
```

**P1.3 →**

```js
  // A collected seat's entry has no pid; with resumeStaleListings set, the
  // listing keeps showing it that way for that many listings after the
  // resume. The resumed process itself always registers with a pid.
  if (!found.pid && state.resumeStaleListings > 0) {
    found.stale = { name: found.name, id: found.id, listings: state.resumeStaleListings };
  }
  found.name = (state.next && state.next.name) || found.name;
  found.id = (state.next && state.next.id) || found.id;
  found.state = "running";
  found.pid = found.pid || 4322;
  delete found.hidden;
```

**P1.4** `skills/tanto/scripts/spawner.test.js` — replace exactly these 5 lines

```js
  const got = result(ws, id);
  assert.equal(got.name, "seat-back [bbbbbb]");
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].goneAt, undefined);
});
```

**P1.4 →**

```js
  const got = result(ws, id);
  assert.equal(got.name, "seat-back [bbbbbb]");
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].goneAt, undefined);
});

test("resume waits past the stale pid-less entry of its own sessionId, for the entry with a pid (spec 3.2 item 2)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const spawned = seats(ws)[0];
  // The seat is collected: its entry stays listed with no pid, and the
  // spawner's census marks it gone.
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, {
    sessions: listed.map((s) => {
      const { pid, ...rest } = s;
      return { ...rest, state: "blocked" };
    }),
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "gone");
  // The first listing after the resume still shows the stale entry, with the
  // old name and id; the next one shows the resumed process, with a pid.
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

- [ ] **Step 3: Run the new test to verify it fails**

```bash
node --test --test-name-pattern "stale pid-less entry" skills/tanto/scripts/spawner.test.js
```

Expected: FAIL at `assert.notEqual(got.name, spawned.name)` — today's
lookup returns the stale entry, so the result carries the collected seat's
old name.

- [ ] **Step 4: Give `findResumed` its condition**

Apply P1.5.

**P1.5** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
    const listing = listAgents(root);
    const found = listing.sessions.find((s) => s.sessionId === sessionId);
    if (found) return found;
```

**P1.5 →**

```js
    const listing = listAgents(root);
    // A collected seat leaves a stale entry of its own sessionId, with no
    // pid, which the listing shows before the resumed process registers
    // (spec 3.1).
    const found = listing.sessions.find((s) => s.sessionId === sessionId && s.pid);
    if (found) return found;
```

- [ ] **Step 5: Run the two suites that read the fake to verify they pass**

```bash
node --test skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js
```

Expected: every test passes, the new one and the launcher's "a pid-less
listing entry is not read as a live seat, and gets a resume request (fix 1)"
included.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 1
```

Expected: `task 1: verify clean`.

- [ ] **Step 7: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js
git commit --only skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js -m "fix: the spawner's resume waits for a listing entry with a pid" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 2 — `boundary.js census` notes a stale entry under Not listed

Spec 3.2 item 3 and 3.3: a roster row whose session's entry has no `pid`
prints under Not listed, followed by
` — listed without a pid (a stale entry)`, so that Kanri marks the row on
the signal the heading names. Not held lists no entry without a `pid`,
which `a99aad2` already holds. The note keys on the `sessionId` alone,
whatever the entry's `cwd`: the row is already this repository's.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js`
- Test: `skills/tanto/scripts/boundary.test.js`

**Interfaces:**

- Consumes: nothing from another task.
- Produces: the Not listed line
  `<role> <topic> <roster name> — <sessionId> — listed without a pid (a stale entry)`
  for a row whose `sessionId` the listing carries only without a `pid`; the
  other Not listed line, `<role> <topic> <roster name> — <sessionId>`, is
  unchanged.

**Named-mechanism sites.** The note is named by `SKILL.md`'s **The
census.** paragraph (Task 4) and `roles/kanri.md`'s "Session lifecycle"
Not listed bullet (Task 5), which says what Kanri writes on it. The `pid`
rule's other readers are Task 1's list.

**O2.1** `[aaaaaa] — sess-kanri\n"` — the "(fix 1)" test's expectation of a Not listed line with no note (`scripts/boundary.test.js` 997); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

- [ ] **Step 1: Write the failing test**

Apply P2.2.

**P2.2** `skills/tanto/scripts/boundary.test.js` — replace exactly these 11 lines

```js
test("a pid-less listing entry is not listed (fix 1)", () => {
  const f = censusFixture([KANRI_ROW], (root) => [
    // The measured real shape (R-11, S-54): a sessionId with no pid and no
    // status, for a process that already exited hours earlier.
    { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, state: "blocked" },
  ]);
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.ok(result.out.includes("\n## Listed\n\nnone\n"), result.out);
  assert.ok(result.out.includes("\n## Not listed\n\nkanri — kanri-a [aaaaaa] — sess-kanri\n"), result.out);
});
```

**P2.2 →**

```js
test("a pid-less listing entry is not listed, and its row is noted as a stale entry (spec 3.2 item 3)", () => {
  const f = censusFixture(
    [KANRI_ROW, sessionRow("jisso", "t", "jisso-g", "live", "/home/u/.claude/projects/p/sess-moved.jsonl")],
    (root, dir) => [
      // The measured real shape (R-11, S-54): a sessionId with no pid and no
      // status, for a process that already exited hours earlier.
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, state: "blocked" },
      // A stale entry is noted by its sessionId, wherever its cwd.
      { sessionId: "sess-moved", name: "jisso-g", kind: "background", cwd: path.join(dir, "other"), state: "blocked" },
      { sessionId: "sess-stray", name: "stray", kind: "background", cwd: root, state: "blocked" },
    ],
  );
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.ok(result.out.includes("\n## Listed\n\nnone\n"), result.out);
  const stale = " — listed without a pid (a stale entry)";
  assert.ok(
    result.out.includes(
      `\n## Not listed\n\nkanri — kanri-a [aaaaaa] — sess-kanri${stale}\njisso t jisso-g — sess-moved${stale}\n`,
    ),
    result.out,
  );
  // Not held lists no entry without a pid.
  assert.ok(result.out.includes("\n## Not held\n\nnone\n"), result.out);
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
node --test --test-name-pattern "noted as a stale entry" skills/tanto/scripts/boundary.test.js
```

Expected: FAIL on the Not listed assertion — the lines carry no note yet.

- [ ] **Step 3: Print the note**

Apply P2.3 and P2.4.

**P2.3** `skills/tanto/scripts/boundary.js` — replace exactly these 4 lines

```js
  const all = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.sessions) ? parsed.sessions : [];
  const listed = new Map(
    all.filter((s) => s?.sessionId && s.pid && underRoot(root, s.cwd)).map((s) => [s.sessionId, s]),
  );
```

**P2.3 →**

```js
  const all = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.sessions) ? parsed.sessions : [];
  const listed = new Map(
    all.filter((s) => s?.sessionId && s.pid && underRoot(root, s.cwd)).map((s) => [s.sessionId, s]),
  );
  // An entry with no pid is a process gone, whatever its state says (spec
  // 3.1): its row prints under Not listed with the signal named, by its
  // sessionId alone, since the row is already this repository's.
  const stale = new Set(all.filter((s) => s?.sessionId && !s.pid).map((s) => s.sessionId));
```

**P2.4** `skills/tanto/scripts/boundary.js` — replace exactly these 4 lines

```js
    if (!session) {
      out["Not listed"].push(`${role} ${topic} ${name} — ${sessionId}`);
      continue;
    }
```

**P2.4 →**

```js
    if (!session) {
      const note = stale.has(sessionId) ? " — listed without a pid (a stale entry)" : "";
      out["Not listed"].push(`${role} ${topic} ${name} — ${sessionId}${note}`);
      continue;
    }
```

- [ ] **Step 4: Run the suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes, the four-heading test's `hosa — hosa-c
[cccccc] — sess-hosa` — a row with no entry at all — still printed with no
note.

- [ ] **Step 5: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 2
```

Expected: `task 2: verify clean`.

- [ ] **Step 6: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
git commit --only skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js -m "fix: boundary.js census notes a stale listing entry under Not listed" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 3 — A test pins `record`'s row for a rework's key

Spec 1.3: `boundary.js record --batch <key>` appends a row when no row's
first cell matches the key, so the script is unchanged, and the plan adds
the test that holds it. The test passes as soon as it is written — it pins
behavior `writeBatch` already has; a failure here means the script moved,
and is a stop, not a reason to change the script.

**Files:**

- Test: `skills/tanto/scripts/boundary.test.js`

**Interfaces:**

- Consumes: `boundary.js record --ledger <path> --batch <key> [--tasks …]
  [--state …] [--prompt …] [--report …] [--verdict …]`, as `a99aad2` has
  it, and Task 2's edits to the same test file, which touch another test.
- Produces: nothing another task calls.

**Named-mechanism sites.** The key `<X>-rework-<n>` is also named by
`SKILL.md`'s Artifacts rows and Invocation row (Task 4), `roles/kanri.md`'s
loop steps 2, 4, and 6 (Task 5), `roles/jisso.md`'s Start and "The run"
(Task 6), and `templates/batch-prompt.md`, `templates/boundary-brief.md`,
and `templates/kanri.md` (Task 7).

- [ ] **Step 1: Write the test**

Apply P3.1.

**P3.1** `skills/tanto/scripts/boundary.test.js` — replace exactly these 4 lines

```js
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| Z | 1-3 | accepted |"), ledger);
  assert.ok(ledger.includes("check: pass — boundary pass, diff pass"));
});
```

**P3.1 →**

```js
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| Z | 1-3 | accepted |"), ledger);
  assert.ok(ledger.includes("check: pass — boundary pass, diff pass"));
});

test("a rework's key is a row of its own, and every earlier row keeps its cells (spec 1.3)", () => {
  const fixture = ledgerAndRoster();
  const record = (...args) => {
    const result = run(["record", "--ledger", fixture.ledger, ...args], fixture.dir);
    assert.strictEqual(result.code, 0, result.err);
  };
  const rowOf = (key) =>
    fs
      .readFileSync(fixture.ledger, "utf8")
      .split(/\r?\n/)
      .find((line) => line.startsWith(`| ${key} |`));
  record("--batch", "B", "--tasks", "4-7", "--state", "rework", "--prompt", "batch-B-prompt.md");
  record("--batch", "B", "--report", "batch-B-report.md", "--verdict", "Task 5 returned: its test pins the old line");
  record("--batch", "fix wave", "--tasks", "fix wave", "--state", "rework", "--verdict", "one finding left open");
  const firstPass = rowOf("B");
  const fixWave = rowOf("fix wave");
  record("--batch", "B-rework-1", "--tasks", "5", "--state", "planned", "--prompt", "batch-B-rework-1-prompt.md");
  record("--batch", "B-rework-1", "--state", "rework", "--report", "batch-B-rework-1-report.md", "--verdict", "open");
  record("--batch", "B-rework-2", "--tasks", "5", "--state", "planned", "--prompt", "batch-B-rework-2-prompt.md");
  record("--batch", "fixwave-rework-1", "--tasks", "fix wave", "--state", "planned");
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.strictEqual(rowOf("B"), firstPass, ledger);
  assert.strictEqual(rowOf("fix wave"), fixWave, ledger);
  assert.strictEqual(
    rowOf("B-rework-1"),
    "| B-rework-1 | 5 | rework | batch-B-rework-1-prompt.md | batch-B-rework-1-report.md | open |",
  );
  assert.strictEqual(rowOf("B-rework-2"), "| B-rework-2 | 5 | planned | batch-B-rework-2-prompt.md |  |  |");
  assert.strictEqual(rowOf("fixwave-rework-1"), "| fixwave-rework-1 | fix wave | planned |  |  |  |");
  const order = ["B", "fix wave", "B-rework-1", "B-rework-2", "fixwave-rework-1"].map((key) =>
    ledger.indexOf(`| ${key} |`),
  );
  assert.deepStrictEqual(
    [...order].sort((a, b) => a - b),
    order,
    ledger,
  );
});
```

- [ ] **Step 2: Run the suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes, the new one at once — the behavior is
`a99aad2`'s. A failure is a stop.

- [ ] **Step 3: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 3
```

Expected: `task 3: verify clean`.

- [ ] **Step 4: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.test.js
git commit --only skills/tanto/scripts/boundary.test.js -m "test: record writes a rework's key as a row of its own" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 4 — The contract gives a rework its own files and resumes a terminal seat that has gone

Spec 1.1 and 1.2 (`SKILL.md`'s Artifacts rows and Invocation's Jisso row),
3.1's note and 5.1 and 5.3 ("Handshake and roster": the Status column's
`dead`, the paragraph opening **The census.**), 5.1 ("Resuming": a row for
a terminal seat gone while the run is up; "Messages": a send error's
"Not listed" for a terminal seat), 5.2 (rule 11's queue paragraph), and
5.3 in its second spelling — "Session exit"'s paragraph on a seat that has
stopped answering, which the spec's section 7 does not name and which
states `roles/kanri.md`'s "A seat's exit" rule (Task 5) in other words.

**Files:**

- Modify: `skills/tanto/SKILL.md`

**Named-mechanism sites.** The rework key is also Task 3's test's, and
`roles/kanri.md`'s loop steps 2, 4, and 6 (Task 5), `roles/jisso.md`'s
Start and "The run" (Task 6), and `templates/batch-prompt.md`,
`templates/boundary-brief.md`, and `templates/kanri.md` (Task 7). The
resume before a send is also `roles/kanri.md`'s loop step 6, "The final
batch" step 3, "Session lifecycle", and the Replace table's first row
(Task 5), and `roles/jisso.md`'s Start (Task 6). A terminal seat's `dead`
that a resume ends is also `roles/kanri.md`'s "A seat's exit" and
"Session lifecycle" (Task 5) and `templates/roster.md`'s keeping rule and
status paragraph (Task 7). The census's stale-entry note is Task 2's
output. A `queued` row the census does not list stays `queued` in
`roles/kanri.md`'s "On a handshake" and "Session lifecycle" (Task 5) and
`templates/roster.md` (Task 7). After `SKILL.md` changes, its sibling
`README.md` is reviewed for drift (Step 3).

**O4.1** `and for a rework prompt` — the prompt row's writer (spec's Old values, `SKILL.md` 1085); before: 1 in `skills/tanto/SKILL.md`, after: 0 — a rework's prompt has its own path.

**O4.2** `batch-<X>-prompt.md` — the prompt's path without a key (`SKILL.md` 66 and 1085, `roles/kanri.md` 599 and 601); before: 2 in `skills/tanto/SKILL.md` and 2 in `skills/tanto/roles/kanri.md`, after: 0 in `SKILL.md` with this task and 0 in `roles/kanri.md` with Task 5.

**O4.3** `batch-<X>-verdict.md` — the verdict's path (`SKILL.md` 1086, `roles/kanri.md` 413, `templates/boundary-brief.md` 112 and 117); before: 1, 1, and 2, after: 0 in `SKILL.md` with this task, 0 in `roles/kanri.md` with Task 5, and 0 in `templates/boundary-brief.md` with Task 7.

**O4.4** `batch-<X>-report.md` — the report's path (`SKILL.md` 1087, `roles/jisso.md` 58, `templates/batch-prompt.md` 73, `templates/kaiseki-brief.md` 21); before: 1 in each, after: 0 in `SKILL.md` with this task, `roles/jisso.md` with Task 6, and `templates/batch-prompt.md` and `templates/kaiseki-brief.md` with Task 7.

**O4.5** `no longer lists;` — `dead`'s definition as final (`SKILL.md` 409); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O4.6** `). An entry with no` — the point in **The census.** where a `queued` row's `dead` ends (spec's Old values: "Kanri marks a `live` or `queued` row whose `sessionId` it does not list `dead`", which carries backticks and wraps at `SKILL.md` 427–428, so P4.8's old block is its check); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O4.7** `answering is past answering, and Kanri learns` — "Session exit"'s forced exit for every seat (`SKILL.md` 1055–1056); before: 1 in `skills/tanto/SKILL.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P4.8 to P4.15.

**P4.8** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```markdown
session under the repository, the tab seats included, and Kanri marks a
`live` or `queued` row whose `sessionId` it does not list `dead` on that
signal alone — no timeout, no inference, no name — except while a restart
is being recovered (`roles/kanri.md`). An entry with no `pid` is not
listed. A listing that fails is no signal, and nothing is marked on it. A send error is a reason to run the census,
not a signal of its own: a send that errors to a session the census still
lists is a message failure, the row stays, and Kanri tells the human in one
line.
```

**P4.8 →**

```markdown
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
```

**P4.9** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
Kanri that handed over; `dead` a session the census no longer lists;
`refused` a handshake that got no row. A terminal seat's row is written from
```

**P4.9 →**

```markdown
Kanri that handed over; `dead` a session the census no longer lists — for
a terminal seat whose transcript is on disk not final, since its process is
gone and its conversation kept, and a resume puts the row back to `live`
when a line is next due to it ("Resuming"), while `stopped` keeps meaning a
stop the run made; `refused` a handshake that got no row. A terminal seat's
row is written from
```

**P4.10** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| an editor restart | the terminal seats are still running — separate processes, unreached by the restart. Only the tab seats came back renamed |
```

**P4.10 →**

```markdown
| a terminal seat gone while the run is up — a send to it errors, or the roster records its row `dead` | Kanri sends on the roster as recorded, with no census first; either signal runs the census, and a terminal seat it does not list — a stale entry with no `pid` included — gets a `resume` request, `claude --resume <sessionId> --bg` with no other flag, which keeps the `sessionId` and the whole conversation. The line is sent again when the result lands, to the name the result carries, and the row goes `live` with it; a result that carries no name is answered by the census again, which names the session by its `sessionId`. A `queued` row goes `live` before its `batch:` line is sent, resumed or not, so that Kanri still sends only to `live` rows. A seat the census does list after a send error is a message failure: the row stays, and Kanri tells the human in one line. A resume is never a spawn and never a replacement; it covers every line to a terminal seat — a queued Jisso's `batch:` line, a rework prompt's, the `close:` line, a `coldread:` line, a `continue:` after a pause — and costs nothing for a seat that is alive. It fails when its result carries an error or the seat's transcript is not on disk, and the seat is then lost: `roles/kanri.md`'s Replace table decides what follows |
| an editor restart | the terminal seats are still running — separate processes, unreached by the restart. Only the tab seats came back renamed |
```

**P4.11** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
  reason to run the census, whose "Not listed" is the signal that a session
  is gone. What each side does on `no-role`: Kanri marks the sender's row
  `cleared`, writes the Events line a shoroku proposal not written gets
```

**P4.11 →**

```markdown
  reason to run the census, whose "Not listed" is the signal that a session
  is gone — and, for a terminal seat, the reason to resume it and send the
  line again ("Resuming"). What each side does on `no-role`: Kanri marks
  the sender's row `cleared`, writes the Events line a shoroku proposal not
  written gets
```

**P4.12** `skills/tanto/SKILL.md` — replace exactly these 9 lines

```markdown
session under the same name and a new `sessionId`. A seat that has stopped
answering is past answering, and Kanri learns it the way it learns of a
missing batch report — the human says the window is gone, a send errors
and the census that follows no longer lists it, a `no-role` comes back, the
census's "Not listed" names it, or Kanri's window wakes for another reason
and the answer has not arrived. Kanri then treats the exit as forced — the
roster's Events line says its shoroku proposal was not written and what was
lost, as far as Kanri knows — marks the row `cleared` on a `no-role` or
`dead` on the census's "Not listed", and continues.
```

**P4.12 →**

```markdown
session under the same name and a new `sessionId`. A tab seat that has
stopped answering is past answering; a terminal seat whose transcript is on
disk is not, since a resume brings it back with its whole conversation
("Resuming"). Kanri learns of either the way it learns of a missing batch
report — the human says the window is gone, a send errors and the census
that follows no longer lists it, a `no-role` comes back, the census's "Not
listed" names it, or Kanri's window wakes for another reason and the answer
has not arrived. A terminal seat is then marked `dead`, with an Events line
naming what showed its process gone and saying its conversation is kept,
and is resumed when a line is next due to it. A tab seat, and a terminal
seat whose resume failed, is a forced exit — the roster's Events line says
its shoroku proposal was not written and what was lost, as far as Kanri
knows — and Kanri marks the row `cleared` on a `no-role` or `dead` on the
census's "Not listed", and continues.
```

**P4.13** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
| `.tanto/<topic>/batch-<X>-prompt.md` | the `boundary.verify` subagent, from `templates/batch-prompt.md`; Kanri for its two `<Kanri fills>` slots and for a rework prompt | the seat the `spawn` request creates, or the `queued` seat under a skill-editing plan; human | the prompt; sent as the one line `batch: <path>`, which the human pastes if the message did not arrive |
| `.tanto/<topic>/batch-<X>-verdict.md` | the `boundary.verify` kind Kanri dispatches | Kanri, by `sections` | the boundary's verdict: eleven fixed sections, and a twelfth, `Measurement`, when the batch carried a measurement task |
| `.tanto/<topic>/batch-<X>-report.md` | the Jisso of that batch | Kanri; the close's recommender, its Shoroku proposal section by path and item | fixed skeleton; its Shoroku proposal section is that Jisso's shoroku proposal |
```

**P4.13 →**

```markdown
| `.tanto/<topic>/batch-<key>-prompt.md` — `<key>` the batch's letter, `fixwave` for the fix wave, or `<X>-rework-<n>` for a batch returned for rework, `<n>` 1 for its first rework and one more than its highest so far after that | the `boundary.verify` subagent, from `templates/batch-prompt.md`; Kanri for its two `<Kanri fills>` slots, and for a rework's own prompt at `batch-<X>-rework-<n>-prompt.md` | the seat the `spawn` request creates, or the `queued` seat under a skill-editing plan; for a rework, the Jisso of the batch it runs again; human | the prompt; sent as the one line `batch: <path>`, which the human pastes if the message did not arrive. The send freezes it: a prompt, a report, or a verdict of a batch a seat has run is never written again, and a rework's three files are new files beside the first pass's. The one file written again is the next batch's prompt, rendered at every boundary and not yet sent |
| `.tanto/<topic>/batch-<key>-verdict.md` | the `boundary.verify` kind Kanri dispatches, the dispatch's `batch=` carrying the key | Kanri, by `sections` | the boundary's verdict: eleven fixed sections, and a twelfth, `Measurement`, when the batch carried a measurement task |
| `.tanto/<topic>/batch-<key>-report.md` | the Jisso of that batch, at the path its prompt's Report section names | Kanri; the close's recommender, its Shoroku proposal section by path and item | fixed skeleton; its Shoroku proposal section is that Jisso's shoroku proposal |
```

**P4.14** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
    replacement nor a creation under this rule. Every other plan spawns one
    Jisso per batch, at the boundary, from the batch prompt itself.
```

**P4.14 →**

```markdown
    replacement nor a creation under this rule. Such a seat is never
    stopped while it waits, and may still be collected: when its prompt is
    due it is resumed with the conversation that read the skill before
    batch A ("Resuming"), so the reason above holds, and a resume is neither
    a replacement nor a creation either. Every other plan spawns one Jisso
    per batch, at the boundary, from the batch prompt itself.
```

**P4.15** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| Jisso, an ordinary plan | `/tanto jisso batch=<.tanto/<topic>/batch-<X>-prompt.md>` — the prompt file is its orders |
```

**P4.15 →**

```markdown
| Jisso, an ordinary plan | `/tanto jisso batch=<.tanto/<topic>/batch-<key>-prompt.md>` — the prompt file is its orders |
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 4
```

Expected: `task 4: verify clean`.

- [ ] **Step 3: Review the sibling README for drift**

`AGENTS.md` asks for it after every `SKILL.md` edit. This task's edits are
the rework key and the resume before a send, both run-internal; the
README's resume sentences are about a restart (`tanto` resuming what a
reboot took), which this task does not change.

```bash
grep -n -i "rework\|dead\|queued\|stale" skills/tanto/README.md
```

Expected: no output — the README names none of the mechanisms this task
changes, so it needs no edit here. Its one change of this plan is Task 10's.

- [ ] **Step 4: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
git commit --only skills/tanto/SKILL.md -m "docs: the contract gives a rework its own files and resumes a terminal seat that has gone" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 5 — Kanri's role file writes a rework under its own key and resumes a terminal seat before it gives up on it

Spec 1.3 and 1.4 (the batch loop's step 4 and step 6, and step 2's
dispatch, whose `batch=<key>` spec 1.1 names), 5.1 (step 6's send, "The
final batch" step 3's `close:` line, "Session lifecycle"'s send error), 5.3
("A seat's exit", "Session lifecycle"'s **The census.** paragraph and its
Not listed bullet, and "On a handshake" step 2, which the spec's section 7
does not name and which marks a `queued` row `dead`), and 5.4 ("Replace",
its first row).

**Files:**

- Modify: `skills/tanto/roles/kanri.md`

**Named-mechanism sites.** The rework key and its second `record` call are
also `SKILL.md`'s Artifacts (Task 4), `roles/jisso.md` (Task 6),
`templates/batch-prompt.md`'s title and Report, `templates/boundary-brief.md`'s
dispatch arguments, `record` calls, step 5, and "The verdict file", and
`templates/kanri.md`'s Batch column (Task 7), and Task 3's test. The resume
before a send is also `SKILL.md`'s Resuming row, **The census.**
paragraph, and Messages bullet (Task 4), and `roles/jisso.md`'s Start
(Task 6). A terminal seat's resumable `dead` is also `SKILL.md`'s Status
column and "Session exit" (Task 4) and `templates/roster.md` (Task 7). The
stale-entry note is Task 2's output. "Resume batch X from task N" is also
`SKILL.md`'s Resuming paragraph and `templates/batch-prompt.md`'s Setup on
resume, both unchanged.

**O5.1** `batch=<X> plan=` — the boundary dispatch's argument (`roles/kanri.md` 405, `templates/boundary-brief.md` 13); before: 1 in each, after: 0 in `roles/kanri.md` with this task and 0 in `templates/boundary-brief.md` with Task 7.

**O5.2** `--batch <X> --` — a `record` call keyed on the letter alone (`roles/kanri.md` 607, `templates/boundary-brief.md` 67); before: 1 in each, after: 0 in `roles/kanri.md` with this task and 0 in `templates/boundary-brief.md` with Task 7.

**O5.3** `send the same way` — step 6's rework prompt (spec's Old values, `roles/kanri.md` 623); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O5.4** `call is the whole of your table writing` — step 6 (spec's Old values, `roles/kanri.md` 620); before: 1 in `skills/tanto/roles/kanri.md`, after: 0 — a rework adds a second call.

**O5.5** `A session that has stopped answering is past answering` — "A seat's exit" (spec's Old values, `roles/kanri.md` 1307); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O5.6** `goes in whenever you mark a row` — "The same Events line goes in whenever you mark a row `dead`" (spec's Old values, `roles/kanri.md` 1314–1315, the needle being the line it wraps onto); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O5.7** `, with the Events line a seat whose` — the Not listed bullet's `dead` with the lost-proposal line (spec's Old values, `roles/kanri.md` 1543); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O5.8** `with the **same**` — the Replace table's first row's respawn (spec's Old values, `roles/kanri.md` 1603); before: 1 in `skills/tanto/roles/kanri.md`, after: 0 — the resume comes first.

**O5.9** ` seat instead, and put` — "send that line to the next `queued` seat instead" (spec's Old values, `roles/kanri.md` 1603); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

"On a handshake" step 2's "Mark `dead` every `live` or `queued` row" has no
one-line needle — every span across the change carries backticks — so
P5.10's old block is its check.

- [ ] **Step 1: Apply the passages**

Apply P5.10 to P5.21.

**P5.10** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
   Mark `dead` every `live` or `queued` row the census does not list —
   except while a restart is being recovered ("Session lifecycle") — before
   the new row is written, so that a stale row of the same role and topic
   refuses no fresh handshake as a duplicate. Then check that no live
```

**P5.10 →**

```markdown
   Mark `dead` every `live` row the census does not list — except while a
   restart is being recovered ("Session lifecycle") — before the new row is
   written, so that a stale row of the same role and topic refuses no fresh
   handshake as a duplicate; a `queued` row the census does not list stays
   `queued`, as "Session lifecycle" says. Then check that no live
```

**P5.11** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   topic=<topic> batch=<X> plan=<plan path> report=<report path>
```

**P5.11 →**

```markdown
   topic=<topic> batch=<key> plan=<plan path> report=<report path>
```

**P5.12** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   Write .tanto/<topic>/batch-<X>-verdict.md in your own turn. Dispatch no agents.
```

**P5.12 →**

```markdown
   Write .tanto/<topic>/batch-<key>-verdict.md in your own turn. Dispatch no agents.
```

**P5.13** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   The last two lines are the two things the subagent cannot see and you hold
```

**P5.13 →**

```markdown
   `<key>` is the batch's letter, or, at the boundary of a batch returned for
   rework, the rework's own key, `<X>-rework-<n>` (step 6). The last two
   lines are the two things the subagent cannot see and you hold
```

**P5.14** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   is not accepted, and its Jisso stays live for the rework prompt, and the
```

**P5.14 →**

```markdown
   is not accepted, and its Jisso stays live for the rework prompt — a file
   of its own, which step 6 writes — and the
```

**P5.15** `skills/tanto/roles/kanri.md` — replace exactly these 10 lines

````markdown
   says them after a compaction. Then **write the `spawn` request** for the
   next Jisso with `batch=.tanto/<topic>/batch-<X>-prompt.md`; under a
   skill-editing plan's queue, send the next `queued` seat the one line
   `batch: .tanto/<topic>/batch-<X>-prompt.md` with the `no-role` line after
   it instead, without an idle subscription. Then the one
   `record` call of this boundary:

   ```bash
   node "$TANTO/scripts/boundary.js" record --ledger <.tanto/<topic>/kanri.md> \
     --roster <.tanto/roster.md> --batch <X> --state accepted|rework \
````

**P5.15 →**

````markdown
   says them after a compaction. Then **write the `spawn` request** for the
   next Jisso with `batch=.tanto/<topic>/batch-<key>-prompt.md`; under a
   skill-editing plan's queue, send the next `queued` seat the one line
   `batch: .tanto/<topic>/batch-<key>-prompt.md` with the `no-role` line
   after it instead, without an idle subscription. That send goes on the
   roster as recorded, with no census first, and the seat's row goes `live`
   before it: a send that errors, or a row the roster records `dead`, is
   `SKILL.md`'s Resuming — the census, a `resume` request for a terminal
   seat it does not list, a stale entry with no `pid` included, and the line
   sent again when the result lands, to the name the result carries. Then
   this boundary's `record` call:

   ```bash
   node "$TANTO/scripts/boundary.js" record --ledger <.tanto/<topic>/kanri.md> \
     --roster <.tanto/roster.md> --batch <key> --state accepted|rework \
````

**P5.16** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
   reply step 5 took. That
   call is the whole of your table writing: at a boundary no table is edited
   by hand. A batch returned for rework is a
   prompt you write yourself from the same template, for the same Jisso, and
   send the same way.
```

**P5.16 →**

````markdown
   reply step 5 took; `<key>` is the key of the batch whose boundary this
   is. At a boundary no table is edited by hand: that call, and for a
   rework the second call below, are all of it.

   A batch returned for rework runs again under a key of its own,
   `<X>-rework-<n>`: `<X>` the batch's file letter — `fixwave` for the fix
   wave — and `<n>` 1 for the batch's first rework and one more than its
   highest so far after that, so a rework returned again is
   `<X>-rework-2`, never a rework of a rework's key. Its files are new,
   beside the first pass's, which are never written again (`SKILL.md`'s
   Artifacts). Write `.tanto/<topic>/batch-<X>-rework-<n>-prompt.md`
   yourself from the same template, for the same Jisso: its title naming
   the rework's key and the tasks it runs again, its Report section naming
   `.tanto/<topic>/batch-<X>-rework-<n>-report.md`, and its Previous batch
   verdict's ruling line saying what was returned and why. Send it the one
   line `batch: <that path>`, as any `batch:` line goes. The call above
   writes the first pass's row `rework`, its Verdict the reason; the
   rework's own row is a second `record` call of this boundary, beside it,
   as the boundary brief's second call writes the next batch's `planned`
   row:

   ```bash
   node "$TANTO/scripts/boundary.js" record --ledger <.tanto/<topic>/kanri.md> \
     --batch <X>-rework-<n> --tasks <N-M> --state planned \
     --prompt .tanto/<topic>/batch-<X>-rework-<n>-prompt.md
   ```

   The rework's boundary is dispatched at step 2 with the rework's key, and
   its brief renders the next batch's prompt again, as at the first pass's.
````

**P5.17** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   — check the proposal's form, record its rows, and write its `stop`
   request.
```

**P5.17 →**

```markdown
   — sent on the roster as recorded, as loop step 6 sends a `batch:` line,
   so that a Jisso gone while it waited through the review and the fix wave
   is resumed first and the line sent again — check the proposal's form,
   record its rows, and write its `stop` request.
```

**P5.18** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```markdown
A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the window is gone,
a send errors and the census that follows no longer lists it, a `no-role`
comes back, the census's "Not listed" names it, or your window wakes for
another reason and the answer has not arrived. Treat the exit as forced,
write a roster Events line saying its shoroku proposal was not written and
what was lost as far as you know, mark the row `cleared` on a `no-role` or
`dead` on the census's "Not listed", and continue. The same Events line
goes in whenever you mark a row `dead`.
```

**P5.18 →**

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

**P5.19** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
- **Not listed** — mark the row `dead`, with the Events line a seat whose
  shoroku proposal was not written gets and what was lost as far as you
  know — except while a restart is being recovered, below; a row that was
  the live Jisso's is the Replace table's first row, the tree verified
  first.
```

**P5.19 →**

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
```

**P5.20** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
A send error is a reason to run the census, not a signal of its own: its
"Not listed" marks the row `dead`, and a send that errors to a session the
census still lists is a message failure — the row stays, and you tell the
human in one line. `ListAgents` lists every session on the machine and
```

**P5.20 →**

```markdown
A send error is a reason to run the census, not a signal of its own: its
"Not listed" marks the row `dead`, and a terminal seat is then resumed and
the line sent again, as loop step 6 says; a send that errors to a session
the census still lists is a message failure — the row stays, and you tell
the human in one line. `ListAgents` lists every session on the machine and
```

**P5.21** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| the live Jisso is gone — the spawner's census marked it `gone`, or the spawner's guard stopped it (`strayed` in `seats.json`), the census does not list it, `SendMessage` errors, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); mark the row `dead` with the Events line saying its shoroku proposal was not written and what was lost — or `stopped`, when the spawner's guard stopped it, its conversation kept, with an Events line naming the guard and the worktree's branch, whose commits, if any, go to the human as a ruling; write a `spawn` request with the **same** `batch=` file, its resume line rewritten to `resume batch X from task N`. Under a skill-editing plan's queue, send that line to the next `queued` seat instead, and put the lost seat to the human as a ruling, since the queue cannot be refilled early |
```

**P5.21 →**

```markdown
| the live Jisso is gone — the spawner's census marked it `gone`, or the spawner's guard stopped it (`strayed` in `seats.json`), the census does not list it, `SendMessage` errors, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers). A seat the spawner's guard stopped is marked `stopped`, its conversation kept, with an Events line naming the guard and the worktree's branch, whose commits, if any, go to the human as a ruling, and is not resumed. Any other gone Jisso is **resumed first**: mark the row `dead` with an Events line naming what showed its process gone and saying its conversation is kept, write a `resume` request, and when the result lands send the resumed seat `resume batch X from task N`, the line `SKILL.md`'s Resuming gives a Jisso resumed after a restart, its row `live` again. Only when that resume fails — its result carries an error, or the seat's transcript is not on disk — is the seat lost: its Events line says its shoroku proposal was not written and what was lost. For a lost seat, and for a guard-stopped one, write a `spawn` request with the same `batch=` file, its resume line rewritten to `resume batch X from task N`, or, under a skill-editing plan's queue, send that line to the next `queued` seat and put the lost seat to the human as a ruling, since the queue cannot be refilled early |
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 5
```

Expected: `task 5: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
git commit --only skills/tanto/roles/kanri.md -m "docs: Kanri writes a rework under its own key and resumes a terminal seat before it gives up on it" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 6 — Jisso reads every `batch:` file from disk and bounds a dispatch that hands back nothing

Spec 1.5 and 5.2 ("Start"), 1.4 and 1.5 ("The run", steps 1 and 3 — step 1,
the report's path, is not named in the spec's section 7, and is spec 1.4's
"the Jisso, at the path the rework prompt's Report section names"), 2.3 and
2.4 ("The four implementer statuses"), and 2.2 ("What tanto overrides", a
row for the three sentences every dispatch carries).

**Files:**

- Modify: `skills/tanto/roles/jisso.md`

**Named-mechanism sites.** The rework key and the rework prompt's path are
also `SKILL.md`'s Artifacts (Task 4), `roles/kanri.md`'s loop step 6
(Task 5), and `templates/batch-prompt.md`'s Report section (Task 7). The
queued seat's resume is also `SKILL.md`'s rule 11 and Resuming (Task 4)
and `roles/kanri.md`'s loop step 6 (Task 5). The dispatch's three
sentences and the two-message bound are this file's alone; the Kaiseki
trigger they are kept apart from is "Fix rounds and the Kaiseki trigger" in
this file, unchanged.

**O6.1** `you as a prompt for the same batch` — "The run", step 3 (spec's Old values, `roles/jisso.md` 82–83, the needle being the line it wraps onto); before: 1 in `skills/tanto/roles/jisso.md`, after: 0.

**O6.2** `with one addition` — "The four implementer statuses" (spec's Old values, `roles/jisso.md` 124); before: 1 in `skills/tanto/roles/jisso.md`, after: 0 — 2.3 and 2.4 are a second.

- [ ] **Step 1: Apply the passages**

Apply P6.3 to P6.7.

**P6.3** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```markdown
wake-up re-reads all of it, and yours may wait hours. Your
closing line while you wait says so: no work yet, and the step that needs
this seat is your batch prompt.
```

**P6.3 →**

```markdown
wake-up re-reads all of it, and yours may wait hours. Your
closing line while you wait says so: no work yet, and the step that needs
this seat is your batch prompt. Your process may be collected while you
wait; Kanri resumes it with this conversation when your prompt is due, and
you do nothing about it — the `batch:` line arrives after the resume.

**Every `batch:` line's file is read from disk** before you judge anything,
whatever its path and whether or not you have read a file at that path
before, and you act on what the file says, never on your memory of an
earlier prompt. A file that is the prompt of a batch you have already
reported is answered as before, with your report's path.
```

**P6.4** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```markdown
1. Write `batch-<X>-report.md` in the topic directory, `.tanto/<topic>/`, from
   the tanto skill's `templates/batch-report.md`, taking your own reading
```

**P6.4 →**

```markdown
1. Write the report at the path your prompt's Report section names —
   `.tanto/<topic>/batch-<key>-report.md`, `<key>` the batch's letter, or
   `<X>-rework-<n>` for a rework — from
   the tanto skill's `templates/batch-report.md`, taking your own reading
```

**P6.5** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```markdown
   verifies the tree and rules. A batch returned for rework comes back to
   you as a prompt for the same batch; a batch accepted is your exit — the
```

**P6.5 →**

```markdown
   verifies the tree and rules. A batch returned for rework comes back to
   you as a rework prompt at its own path,
   `.tanto/<topic>/batch-<X>-rework-<n>-prompt.md`, in a `batch:` line whose
   file you read from disk like every other (Start); a batch accepted is
   your exit — the
```

**P6.6** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```markdown
They are `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, and `BLOCKED`. Handle
each as subagent-driven-development says, with one addition: a `BLOCKED` return
whose cause you cannot name, at any round, is the Kaiseki trigger below.
```

**P6.6 →**

```markdown
They are `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, and `BLOCKED`. Handle
each as subagent-driven-development says, with two additions. First, a
`BLOCKED` return whose cause you cannot name, at any round, is the Kaiseki
trigger below.

Second, a notification that carries no hand-back is not a hand-back: an
interim `completed` whose note says the agent stopped with background work
of its own still running, or a result that says the agent is waiting.
Answer it in the same turn, by `SendMessage` to that agent's id: stop any
command of its own still running, run what remains in the foreground with a
timeout, and hand back with its status — a reviewer, with its verdict.
Never end your turn on such a notification without that message: the
promised second notice comes only if the background work ends, and nothing
in the run notices when it does not. At most two such messages to one
dispatch; a third notification without a hand-back is that task's
`BLOCKED`, handled as subagent-driven-development says. Its cause is named
— the dispatch will not finish in the foreground — so it is not the
Kaiseki trigger.
```

**P6.7** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```markdown
| SDD implementer — clean up anything unexpected in the tree before starting | tell each `task.implement` dispatch to report an unrecognized modification it did not make, one line to you, instead of discarding it | a modification in the shared tree that a session or its subagent did not make is not its to discard (Rule 5); only Kanri decides whether it is stray |
```

**P6.7 →**

```markdown
| SDD implementer — clean up anything unexpected in the tree before starting | tell each `task.implement` dispatch to report an unrecognized modification it did not make, one line to you, instead of discarding it | a modification in the shared tree that a session or its subagent did not make is not its to discard (Rule 5); only Kanri decides whether it is stray |
| SDD's dispatch prompts — the implementer's, the task reviewers', and the escalation's — used as they are | add three sentences to every dispatch you send — `task.implement`, `task.escalate`, and the two task reviews: run every command in the foreground with an explicit timeout, the Bash tool's `timeout`, ten minutes at most, never as a background job, and a command that cannot finish inside that ceiling is not started but named in the hand-back for you to rule on; never end a turn while a command of your own is still running, or while "waiting" on anything; end every turn with a hand-back — an implementer's one of the four implementer statuses, a reviewer's verdict | a dispatch that ends its turn with work of its own running leaves you idle on a promise with no bound, since you hold no clock; the sentences are best effort, and "The four implementer statuses" is the bound behind them |
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 6
```

Expected: `task 6: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/roles/jisso.md
git commit --only skills/tanto/roles/jisso.md -m "docs: Jisso reads every batch: file from disk and bounds a dispatch that hands back nothing" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 7 — The run-time templates and the ledger carry the rework key, and the roster keeps a waiting seat `queued`

Spec 1.1, 1.3, and 1.4: `templates/batch-prompt.md` (the title and
Report), `templates/boundary-brief.md` (the dispatch's `batch=<key>`, the
`record` calls, step 5's next batch found from a rework's key and its
last-batch sentence, and "The verdict file"), and `templates/kanri.md` (the
Batches section's Batch column). And spec 5.3 in `templates/roster.md` —
not named in the spec's section 7 — whose keeping rule marks a `queued` row
`dead` and whose status paragraph gives `dead` as final. The two run-time
templates land in this batch with the role files that name the same key
(contract rule 11); `templates/kanri.md` and `templates/roster.md` are
read once and could land earlier, and ride here because they name the same
mechanisms.

**Files:**

- Modify: `skills/tanto/templates/batch-prompt.md`, `skills/tanto/templates/boundary-brief.md`, `skills/tanto/templates/kanri.md`, `skills/tanto/templates/roster.md`, `skills/tanto/templates/kaiseki-brief.md`

**Named-mechanism sites.** The rework key is also `SKILL.md`'s Artifacts
and Invocation rows (Task 4), `roles/kanri.md`'s loop steps 2, 4, and 6
(Task 5), `roles/jisso.md`'s "The run" (Task 6), and Task 3's test, whose
`fix wave` and `fixwave-rework-1` rows are "The verdict file"'s two
spellings. `scripts/boundary.test.js`'s fixtures copy
`templates/kanri.md`: this task changes that file's prose and not its
table, so the fixtures still find the columns they write. The roster's
`dead` and `queued` rules are also `SKILL.md`'s Status column and
**The census.** paragraph (Task 4) and `roles/kanri.md`'s "On a
handshake" and "Session lifecycle" (Task 5).
`templates/kaiseki-brief.md`'s "Batch report" slot is not named in the
spec's section 7: it names the batch-file mechanism the same way the other
templates do, so this task changes it too rather than carving out an
exception — Kanri fills it with the path of whatever report the Kaiseki
case reads, a rework's included, and the key vocabulary already means
"whichever pass".

**O7.1** `Batch <X> —` — the prompt's title (`templates/batch-prompt.md` 1); before: 1 in `skills/tanto/templates/batch-prompt.md`, after: 0.

**O7.2** `Batch, the letter` — the Batches section's Batch column (spec's Old values, `templates/kanri.md` 30); before: 1 in `skills/tanto/templates/kanri.md`, after: 0.

**O7.3** `When the batch is the plan's last, write no prompt` — step 5's last-batch sentence, which leaves out the fix wave and a rework of either (`templates/boundary-brief.md` 110); before: 1 in `skills/tanto/templates/boundary-brief.md`, after: 0.

`templates/roster.md`'s "a `live` or `queued` row" and its `dead` "is a
session the census no longer lists." carry backticks at every span across
the change, so P7.13's and P7.14's old blocks are their check.

**O7.17** `batch-<X>-report.md` — the Batch report slot (`templates/kaiseki-brief.md` 21, O4.4's fourth site); before: 1 in `skills/tanto/templates/kaiseki-brief.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P7.4 to P7.16.

**P7.4** `skills/tanto/templates/batch-prompt.md` — replace exactly these 4 lines

```markdown
# Batch <X> — tasks <N> to <M> — Jisso <n> of this plan

<!-- Sent as the one line `batch: <path>` naming this file. The file carries no
`no-role` line of its own, because a file a line points at is not a message. -->
```

**P7.4 →**

```markdown
# Batch <key> — tasks <N> to <M> — Jisso <n> of this plan

<!-- Sent as the one line `batch: <path>` naming this file. The file carries no
`no-role` line of its own, because a file a line points at is not a message.
`<key>` is the batch's letter — `fixwave` in the fix wave's paths — or, for a
batch returned for rework, `<X>-rework-<n>`: a rework's prompt, report, and
verdict are new files beside the first pass's, and the tasks in this title
are the ones it runs again. -->
```

**P7.5** `skills/tanto/templates/batch-prompt.md` — replace exactly this 1 line

```markdown
Write `.tanto/<topic>/batch-<X>-report.md` from the tanto skill's
```

**P7.5 →**

```markdown
Write `.tanto/<topic>/batch-<key>-report.md` from the tanto skill's
```

**P7.6** `skills/tanto/templates/boundary-brief.md` — replace exactly this 1 line

```text
topic=<topic> batch=<X> plan=<plan path> report=<report path>
```

**P7.6 →**

```text
topic=<topic> batch=<key> plan=<plan path> report=<report path>
```

**P7.7** `skills/tanto/templates/boundary-brief.md` — replace exactly these 4 lines

```markdown
The last two lines are the two things you cannot see for yourself: the readings
peers' last lines carried since the previous boundary, and the top-family
dispatches a peer's line implied. They travel in the dispatch and go through
`record`.
```

**P7.7 →**

```markdown
The last two lines are the two things you cannot see for yourself: the readings
peers' last lines carried since the previous boundary, and the top-family
dispatches a peer's line implied. They travel in the dispatch and go through
`record`.

`<key>` is the batch's own key: its letter on a first pass, and
`<X>-rework-<n>` at the boundary of a batch returned for rework — `<X>` the
batch's file letter, `fixwave` for the fix wave. A rework's prompt, report,
and verdict are its own files, beside the first pass's, which you never
write again.
```

**P7.8** `skills/tanto/templates/boundary-brief.md` — replace exactly this 1 line

```markdown
     --batch <X> --tasks <N-M> --state reported --report <report> \
```

**P7.8 →**

```markdown
     --batch <key> --tasks <N-M> --state reported --report <report> \
```

**P7.9** `skills/tanto/templates/boundary-brief.md` — replace exactly this 1 line

```markdown
   One `--s-item` per item of the report's Shoroku proposal section, one
```

**P7.9 →**

```markdown
   `<N-M>` is the tasks the plan's Batches table gives the batch — at a
   rework's boundary, the tasks its prompt's title names, since the plan
   has no row for a rework. One `--s-item` per item of the report's Shoroku
   proposal section, one
```

**P7.10** `skills/tanto/templates/boundary-brief.md` — replace exactly these 3 lines

```markdown
5. Render `.tanto/<topic>/batch-<Y>-prompt.md` for the next batch from
   `templates/batch-prompt.md`: the plan's Batches table gives the next
   batch's tasks, and the title's addressee slot reads `Jisso <n> of this
```

**P7.10 →**

```markdown
5. Render `.tanto/<topic>/batch-<Y>-prompt.md` for the next batch from
   `templates/batch-prompt.md`. `<Y>` is the batch after the letter the key
   names — at a rework's boundary, the letter before `-rework-` in it — so
   a rework's boundary renders the next batch's prompt again, as the first
   pass's boundary did: that prompt has not been sent, so rendering it
   again rewrites no file a seat has read, and the `planned` row you write
   for it replaces, by `record`'s own idempotency, the one the first pass's
   boundary wrote. The plan's Batches table gives the next
   batch's tasks, and the title's addressee slot reads `Jisso <n> of this
```

**P7.11** `skills/tanto/templates/boundary-brief.md` — replace exactly these 3 lines

```markdown
   When the batch is the plan's last, write no prompt, make no second
   `record` call, and say so under Next prompt.
6. Write `.tanto/<topic>/batch-<X>-verdict.md`, below.
```

**P7.11 →**

```markdown
   When the batch is the plan's last, the fix wave, or a rework of either,
   there is no next batch: write no prompt, make no second `record` call,
   and say so under Next prompt.
6. Write `.tanto/<topic>/batch-<key>-verdict.md`, below.
```

**P7.12** `skills/tanto/templates/boundary-brief.md` — replace exactly these 4 lines

```markdown
`.tanto/<topic>/batch-<X>-verdict.md`. For the fix wave, `<X>` in this path and
in the prompt's path is `fixwave`, while the `record` call's `--batch` carries
the ledger row's own key, `fix wave`; the two strings differ by design, and the dispatch
names the file path explicitly. Its first lines, before the headings,
```

**P7.12 →**

```markdown
`.tanto/<topic>/batch-<key>-verdict.md`. For the fix wave's first pass,
`<key>` in this path and in the prompt's path is `fixwave`, while the
`record` call's `--batch` carries the ledger row's own key, `fix wave`; the
two strings differ by design, there alone, and the dispatch names the file
path explicitly. A rework of the fix wave is `fixwave-rework-<n>`, one
string for its files and its row, as every rework key is. The file's first
lines, before the headings,
```

**P7.13** `skills/tanto/templates/kanri.md` — replace exactly these 5 lines

```markdown
Columns: Batch, the letter; Tasks, the plan's task numbers; State, one of
planned, reported, accepted, or rework; Prompt and Report, the two file
names under `.tanto/<topic>/`; Verdict, one line — accepted, or what must
change. One row per batch, added as the batch is planned; the placeholder row
stays until the first one is.
```

**P7.13 →**

```markdown
Columns: Batch, the batch's key — its letter, `fix wave` for the fix wave,
or `<X>-rework-<n>` for a batch returned for rework; Tasks, the plan's task
numbers; State, one of planned, reported, accepted, or rework; Prompt and
Report, the two file names under `.tanto/<topic>/`; Verdict, one line —
accepted, or what must change. One row per batch, added as the batch is
planned, and one per rework: a batch returned for rework keeps its row,
State `rework` and its Verdict the reason, and the rework runs under a row
of its own, with its own Prompt, Report, and Verdict. The placeholder row
stays until the first one is.
```

**P7.14** `skills/tanto/templates/roster.md` — replace exactly these 4 lines

```markdown
- A row whose session has gone gets status `dead`: a `live` or `queued` row
  whose `sessionId` the census does not list — a closed tab, a crash, a
  `/clear`ed window, whose session is no longer the one listed — except
  while a restart is being recovered. A stopped, dead, replaced, refused, or
```

**P7.14 →**

```markdown
- A row whose session has gone gets status `dead`: a `live` row whose
  `sessionId` the census does not list — a closed tab, a crash, a
  `/clear`ed window, whose session is no longer the one listed, a terminal
  seat whose process was collected — except while a restart is being
  recovered. A `queued` row the census does not list stays `queued`, since
  the send of its prompt resumes it, and a terminal seat's `dead` row whose
  transcript is on disk goes `live` again when a line due to it resumes it.
  A stopped, dead, replaced, refused, or
```

**P7.15** `skills/tanto/templates/roster.md` — replace exactly this 1 line

```markdown
status. `dead` is a session the census no longer lists. `replaced` is the old row of a Kanri
```

**P7.15 →**

```markdown
status. `dead` is a session the census no longer lists — for a terminal seat whose transcript is on disk, not final: a resume puts it back to `live`. `replaced` is the old row of a Kanri
```

**P7.16** `skills/tanto/templates/kaiseki-brief.md` — replace exactly this 1 line

```markdown
- Batch report — <.tanto/<topic>/batch-<X>-report.md>
```

**P7.16 →**

```markdown
- Batch report — <.tanto/<topic>/batch-<key>-report.md>
```

- [ ] **Step 2: Verify the passages, and that the script suite still reads the ledger template**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 7
node --test skills/tanto/scripts/boundary.test.js
```

Expected: `task 7: verify clean`; every test passes — `boundary.test.js`
copies `templates/kanri.md` and `templates/roster.md` into its fixtures.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/templates/batch-prompt.md skills/tanto/templates/boundary-brief.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md skills/tanto/templates/kaiseki-brief.md
git commit --only skills/tanto/templates/batch-prompt.md skills/tanto/templates/boundary-brief.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md skills/tanto/templates/kaiseki-brief.md -m "docs: the run-time templates and the ledger carry the rework key, and the roster keeps a waiting seat queued" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 8 — The contract defines the human's language and carries it

Spec 6.1 ("The expected-model config": the "Three maps" sentence, and a
`language` bullet beside the three maps), 6.2 (the definition, written once
in that bullet), 6.3 (its scope, in the same bullet), 6.4 (the unknown-key
sentence and the start line), 6.5 (`SKILL.md`'s seven sites: "Messages"
three times, "The brief's form", "Session exit", and "Artifacts" twice),
and 6.7 (the personal file's Artifacts row).

**Files:**

- Modify: `skills/tanto/SKILL.md`

**Named-mechanism sites.** "The human's language" replaces "the chat's
language" and its variants at every site of spec 6.5: this task's seven,
`roles/kanri.md`'s four and `roles/sekkei.md`'s and `roles/keikaku.md`'s
one each (Task 9), and `templates/review-brief.md`'s four,
`templates/shoroku-brief.md`'s two, `templates/batch-report.md`'s,
`templates/spawn-request.md`'s, and `README.md`'s one each (Task 10). The
start line's `language:` field is also `roles/kanri.md`'s Start, step 1
(Task 9). The `language` key and the personal file are also the README's
Optional paragraph (Task 10). The repository's own language rule the
definition falls back to is `AGENTS.md`'s and the kisou template's
(Task 11). `scripts/reading.js` is unchanged (spec 6.4): it audits no
top-level key. After `SKILL.md` changes, its sibling `README.md` is
reviewed for drift (Step 3).

**O8.1** `Three maps, three mechanisms` — spec's Old values (`SKILL.md` 122); before: 1 in `skills/tanto/SKILL.md`, after: 0 — three maps and one scalar.

**O8.2** `kind and no ceiling field` — "A key that names no role, no kind and no ceiling field", the line it wraps onto (spec's Old values, `SKILL.md` 204); before: 1 in `skills/tanto/SKILL.md`, after: 0 — `language` is none of those and is known.

**O8.3** `chat's` — "the chat's language", on one line or wrapped after "chat's" (spec 6.5); before: 7 in `skills/tanto/SKILL.md`, 4 in `skills/tanto/roles/kanri.md`, 1 each in `skills/tanto/roles/sekkei.md` and `skills/tanto/roles/keikaku.md`, 3 in `skills/tanto/templates/review-brief.md`, 1 each in `skills/tanto/templates/shoroku-brief.md`, `skills/tanto/templates/spawn-request.md`, and `skills/tanto/README.md`; after: 0 in `SKILL.md` with this task, 0 in the role files with Task 9, and 0 in the templates and the README with Task 10 — 0 over `skills/tanto/` once batch C lands.

- [ ] **Step 1: Apply the passages**

Apply P8.4 to P8.15.

**P8.4** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
Three maps, three mechanisms. Every value of the first two maps is
`{ "model": <family>, "effort": <level> }`, or a bare string, which sets
`model` and leaves `effort` to the layers below.
```

**P8.4 →**

```markdown
Three maps and one scalar, each with its own mechanism. Every value of the
first two maps is `{ "model": <family>, "effort": <level> }`, or a bare
string, which sets `model` and leaves `effort` to the layers below.
```

**P8.5** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
  every other role measures and sends the five figures and is replaced on
  none of them.
```

**P8.5 →**

```markdown
  every other role measures and sends the five figures and is replaced on
  none of them.
- `language`, the one top-level key that is not a map, is a BCP 47 tag —
  `"ja"`, `"en"` — overlaid across the three layers like every other key,
  the last one winning; the built-in file sets none, the personal file is
  where the human sets it for every repository, and a project file may
  override it. Its mechanism is one definition, written here and nowhere
  else: **the human's language** is the merged `language` when one is set;
  otherwise it is what the repository's own language rule gives — a
  language the user has configured elsewhere, such as in a user-level
  instruction file, else the language of the human's first message in the
  window — and English only when nothing names a language. Under such a
  rule the key is how a tanto seat reads "the language the user has
  configured": a user-level instruction file is read only when the key is
  unset, so the two never compete. Every other site says "the human's
  language" and points nowhere else. It governs the human-facing text
  alone: every seat's closing line; the review briefs; the shoroku briefs,
  the close's check brief and the inbox sweep's; the kessai question and
  every line Kanri prints for the human in its own window — its start line,
  the `R-n` notices, the released lines, the human-access steps, and the
  idle block, its fixed labels included; an `attention` request's message;
  the batch report's Questions for the human section; the dialogues a seat
  holds with the human — Sekkei's spec dialogue, Keikaku's plan dialogue,
  Kaiseki's debugging conversation, Hosa's chores, and a `human-contact:`
  exchange; and the text of every AskUserQuestion. It does not govern the
  tanto lines between sessions, which keep their fixed English forms;
  anything under `docs/`, which the repository's own language rule covers;
  the ledger, the roster, the reports, the subagent prompts, and the
  decision files, which stay agent-facing English with the human's words
  quoted verbatim; or the launcher's printed lines. Every role reads it at
  start with the rest of this file, a spawned seat included — which is the
  point: a seat with no human first message to detect from still knows the
  language — and no script reads it.
```

**P8.6** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
leaves every other value of all three maps alone. A key that names no role, no
kind and no ceiling field — an older file's, for instance — is reported in
```

**P8.6 →**

```markdown
leaves every other value of all three maps alone; `language` overlays as
one value. A key that is not `language` and names no role, no kind, and no
ceiling field — an older file's, for instance — is reported in
```

**P8.7** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
or `all keys built-in defaults` when both files are absent; the unknown keys,
each named with its file; the ladder result if the check failed; and
```

**P8.7 →**

```markdown
or `all keys built-in defaults` when both files are absent;
`language: <tag> (<layer>)`, the layer being the file the effective value
was read from — `personal` or `project` — or `language: — (unset)`; the
unknown keys, each named with its file; the ladder result if the check
failed; and
```

**P8.8** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
  chat's language: an identity, then two facts, and never an opinion. The
```

**P8.8 →**

```markdown
  human's language: an identity, then two facts, and never an opinion. The
```

**P8.9** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
  the chat's language:
```

**P8.9 →**

```markdown
  the human's language:
```

**P8.10** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
  for Keikaku, from `templates/review-brief.md`, in the chat's language —
```

**P8.10 →**

```markdown
  for Keikaku, from `templates/review-brief.md`, in the human's language —
```

**P8.11** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
themselves in the chat's language (for a spec, section 5's body is the one
```

**P8.11 →**

```markdown
themselves in the human's language (for a spec, section 5's body is the one
```

**P8.12** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
   recommendation, the template `templates/shoroku-brief.md`, and the chat's
```

**P8.12 →**

```markdown
   recommendation, the template `templates/shoroku-brief.md`, and the human's
```

**P8.13** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md` | the brief writer the document's author dispatches | the author, then the human; Kanri by the path in `review-ready:` | the review brief, from `templates/review-brief.md`, in the chat's language |
```

**P8.13 →**

```markdown
| `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md` | the brief writer the document's author dispatches | the author, then the human; Kanri by the path in `review-ready:` | the review brief, from `templates/review-brief.md`, in the human's language |
```

**P8.14** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| `.tanto/<topic>/shoroku-brief.md` | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

**P8.14 →**

```markdown
| `.tanto/<topic>/shoroku-brief.md` | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the human's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

**P8.15** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |
```

**P8.15 →**

```markdown
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config, and where the human sets `language` for every repository |
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 8
```

Expected: `task 8: verify clean`.

- [ ] **Step 3: Review the sibling README for drift**

This task adds the `language` key and the human's language to `SKILL.md`;
the README names the config files in its Optional paragraph and the review
brief's language in "What it does", which is Task 10's, in this batch.

```bash
grep -n "chat's\|language" skills/tanto/README.md
```

Expected: one line, `56:` — "What it does"'s "in the chat's language",
which Task 10 rewrites with the Optional paragraph's `language` sentence.
Name it in the report as the drift this batch closes, not as a failure.

- [ ] **Step 4: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
git commit --only skills/tanto/SKILL.md -m "docs: the contract defines the human's language and carries it" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 9 — The role files say the human's language, and Kanri's start line names it

Spec 6.4 (`roles/kanri.md`'s Start, step 1: the start line's `language:`
field) and 6.5: `roles/kanri.md`'s "Start" (the backstop's line to the
human) and "Shoroku", "The four steps" (the recommend dispatch, the brief's
dispatch, and the kessai printed in Kanri's window); `roles/sekkei.md`'s
"Step 2 — spec review"; `roles/keikaku.md`'s "Step 4 — plan review".

**Files:**

- Modify: `skills/tanto/roles/kanri.md`, `skills/tanto/roles/sekkei.md`, `skills/tanto/roles/keikaku.md`

**Named-mechanism sites.** The definition these sites point to is
`SKILL.md`'s `language` bullet (Task 8), and O8.3 counts this task's six
occurrences. The start line's `language:` field is also `SKILL.md`'s start
line paragraph (Task 8).

- [ ] **Step 1: Apply the passages**

Apply P9.1 to P9.7.

**P9.1** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   two config files and which fields came from which, the ladder result if
   that check failed, and
```

**P9.1 →**

```markdown
   two config files and which fields came from which, the ladder result if
   that check failed, `language: <tag> (<layer>)` or `language: — (unset)`,
   and
```

**P9.2** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   the chat's language: auto-compact would fire before your handover, and
```

**P9.2 →**

```markdown
   the human's language: auto-compact would fire before your handover, and
```

**P9.3** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   chat's language. An inbox item's destination is one of `issue`,
```

**P9.3 →**

```markdown
   human's language. An inbox item's destination is one of `issue`,
```

**P9.4** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   `templates/shoroku-brief.md` in the skill directory, and the chat's
```

**P9.4 →**

```markdown
   `templates/shoroku-brief.md` in the skill directory, and the human's
```

**P9.5** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   `seats.json`, and print in your own window, in the chat's language:
```

**P9.5 →**

```markdown
   `seats.json`, and print in your own window, in the human's language:
```

**P9.6** `skills/tanto/roles/sekkei.md` — replace exactly this 1 line

```markdown
`.tanto/<topic>/review-brief-spec.md`, the template, and the chat's language.
```

**P9.6 →**

```markdown
`.tanto/<topic>/review-brief-spec.md`, the template, and the human's language.
```

**P9.7** `skills/tanto/roles/keikaku.md` — replace exactly this 1 line

```markdown
   `.tanto/<topic>/review-brief-plan.md`, the template, and the chat's
```

**P9.7 →**

```markdown
   `.tanto/<topic>/review-brief-plan.md`, the template, and the human's
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 9
```

Expected: `task 9: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md
git commit --only skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md -m "docs: the role files say the human's language, and Kanri's start line names it" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 10 — The templates and the README say the human's language, and the README names the key

Spec 6.5: `templates/review-brief.md` (its opening paragraph and header
line, and "How to answer" twice), `templates/shoroku-brief.md` (its
opening paragraph and header line), `templates/batch-report.md`
("Questions for the human"), `templates/spawn-request.md` (the `attention`
message), and `README.md` ("What it does"); and 6.7, the README's Optional
paragraph, which names the `language` key and the personal file. The
brief templates are read by a dispatched writer and the request schema by
Kanri, each once per use, so they may land in this batch with the role
files that name the same language (contract rule 11).

**Files:**

- Modify: `skills/tanto/templates/review-brief.md`, `skills/tanto/templates/shoroku-brief.md`, `skills/tanto/templates/batch-report.md`, `skills/tanto/templates/spawn-request.md`, `skills/tanto/README.md`

**Named-mechanism sites.** The definition is `SKILL.md`'s `language`
bullet (Task 8), and O8.3 counts this task's six "chat's" occurrences. The
`language` key and the personal file are also `SKILL.md`'s key list and
Artifacts row (Task 8).

**O10.1** `chat language` — `templates/shoroku-brief.md`'s header line (16); before: 1 in `skills/tanto/templates/shoroku-brief.md`, after: 0.

**O10.2** `for the chat` — `templates/review-brief.md`'s header line, wrapped as "for the chat" / "language" (18–19); before: 1 in `skills/tanto/templates/review-brief.md`, after: 0.

**O10.3** `human's chat` — `templates/batch-report.md`'s "Questions for the human", wrapped as "the human's chat" / "language" (63–64); before: 1 in `skills/tanto/templates/batch-report.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P10.4 to P10.13.

**P10.4** `skills/tanto/templates/review-brief.md` — replace exactly this 1 line

```markdown
Every part of the brief is written in the chat's language, which the dispatch
```

**P10.4 →**

```markdown
Every part of the brief is written in the human's language, which the dispatch
```

**P10.5** `skills/tanto/templates/review-brief.md` — replace exactly this 1 line

```markdown
written <YYYY-MM-DD> on <model family> for the chat
```

**P10.5 →**

```markdown
written <YYYY-MM-DD> on <model family> for the human's
```

**P10.6** `skills/tanto/templates/review-brief.md` — replace exactly this 1 line

```markdown
like the labels and the tags, is not rendered into the chat's language. A
```

**P10.6 →**

```markdown
like the labels and the tags, is not rendered into the human's language. A
```

**P10.7** `skills/tanto/templates/review-brief.md` — replace exactly this 1 line

```markdown
clause is the writer's, it is rendered in the chat's language like the rest of
```

**P10.7 →**

```markdown
clause is the writer's, it is rendered in the human's language like the rest of
```

**P10.8** `skills/tanto/templates/shoroku-brief.md` — replace exactly this 1 line

```markdown
brief is written in the chat's language, which the dispatch names; this
```

**P10.8 →**

```markdown
brief is written in the human's language, which the dispatch names; this
```

**P10.9** `skills/tanto/templates/shoroku-brief.md` — replace exactly this 1 line

```markdown
<model family> for the chat language
```

**P10.9 →**

```markdown
<model family> for the human's language
```

**P10.10** `skills/tanto/templates/batch-report.md` — replace exactly this 1 line

```markdown
Numbered, one line each. This is the only section written in the human's chat
```

**P10.10 →**

```markdown
Numbered, one line each. This is the only section written in the human's
```

**P10.11** `skills/tanto/templates/spawn-request.md` — replace exactly this 1 line

```markdown
  "message": "<for attention: one line, in the chat's language>"
```

**P10.11 →**

```markdown
  "message": "<for attention: one line, in the human's language>"
```

**P10.12** `skills/tanto/README.md` — replace exactly this 1 line

```markdown
  the document, in the chat's language, written by a subagent the document's
```

**P10.12 →**

```markdown
  the document, in the human's language, written by a subagent the document's
```

**P10.13** `skills/tanto/README.md` — replace exactly this 1 line

```markdown
  by a `.gitignore` the roles write there.
```

**P10.13 →**

```markdown
  by a `.gitignore` the roles write there. The same files carry `language`,
  the language the run speaks to the human in, as a BCP 47 tag:
  `{"language": "ja"}` in the personal file sets it for every repository, and
  a project file may override it; unset, the repository's own language rule
  decides (`SKILL.md`, "The expected-model config").
```

- [ ] **Step 2: Verify the passages, and the language sweep over the skill**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 10
grep -rn "chat's\|chat language\|for the chat\|human's chat" skills/tanto || echo "none"
```

Expected: `task 10: verify clean`, then `none` — with Tasks 8 and 9 landed,
spec 6.5's 22 sites are all gone, the wrapped ones included, since each
needle stops at the line break.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/templates/review-brief.md skills/tanto/templates/shoroku-brief.md skills/tanto/templates/batch-report.md skills/tanto/templates/spawn-request.md skills/tanto/README.md
git commit --only skills/tanto/templates/review-brief.md skills/tanto/templates/shoroku-brief.md skills/tanto/templates/batch-report.md skills/tanto/templates/spawn-request.md skills/tanto/README.md -m "docs: the templates and the README say the human's language, and the README names the key" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 11 — The repository's first-message rule puts a configured language first

Spec 6.6: `AGENTS.md`'s Language section and
`skills/kisou/templates/AGENTS.md`'s, the second the source of the first,
both become "Chat with the agent: use the language the user has
configured, else the language of the user's first message" — the wording
of the human's Q2 answer, option (b), verbatim. **Q2 is the human's
explicit approval for this one sentence of `AGENTS.md` and for nothing
else in that file**; this task edits no other line of either file. The
kisou template's heading stays and only the body line changes, since
kisou's refresh keys sections by heading; the repositories kisou manages
take the change through `kisou migrate`. No doc-system hook binds either
file (spec F-15), so this task's own steps are the check: lint on both, the
old sentence at zero in both, and the two edited lines compared.

**Files:**

- Modify: `AGENTS.md`, `skills/kisou/templates/AGENTS.md`

**Named-mechanism sites.** `SKILL.md`'s `language` bullet (Task 8) says
the key is how a tanto seat reads "the language the user has configured"
under this rule; the words must stay the same in the three places.

**O11.1** `use the language of the user's first message` — spec's Old values (`AGENTS.md` 14, `skills/kisou/templates/AGENTS.md` 22); before: 1 in each, after: 0 in each.

**A11.2** `AGENTS.md` — `cat AGENTS.md skills/kisou/templates/AGENTS.md | grep -c 'use the language the user has configured, else the language of the user'` — before: 0, after: 2

**A11.3** `AGENTS.md` — `grep -h '^- Chat with the agent:' AGENTS.md skills/kisou/templates/AGENTS.md | sort -u | wc -l | tr -d ' '` — before: 1, after: 1

- [ ] **Step 1: Check the anchors' before values**

```bash
cat AGENTS.md skills/kisou/templates/AGENTS.md | grep -c 'use the language the user has configured, else the language of the user'
grep -h '^- Chat with the agent:' AGENTS.md skills/kisou/templates/AGENTS.md | sort -u | wc -l | tr -d ' '
```

Expected: `0`, then `1` — the two lines are identical before the edit.

- [ ] **Step 2: Apply the passages**

Apply P11.4 and P11.5.

**P11.4** `AGENTS.md` — replace exactly this 1 line

```markdown
- Chat with the agent: use the language of the user's first message
```

**P11.4 →**

```markdown
- Chat with the agent: use the language the user has configured, else the language of the user's first message
```

**P11.5** `skills/kisou/templates/AGENTS.md` — replace exactly this 1 line

```markdown
- Chat with the agent: use the language of the user's first message
```

**P11.5 →**

```markdown
- Chat with the agent: use the language the user has configured, else the language of the user's first message
```

- [ ] **Step 3: Verify the passages and the anchors**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --task 11
grep -c "use the language of the user's first message" AGENTS.md skills/kisou/templates/AGENTS.md
git diff --stat -- AGENTS.md skills/kisou/templates/AGENTS.md
```

Expected: `task 11: verify clean` — its anchors read `2` and `1`, so the
two edited lines are byte for byte the same; `AGENTS.md:0` and
`skills/kisou/templates/AGENTS.md:0`; and one line changed in each file,
no other.

- [ ] **Step 4: Lint and commit**

```bash
./scripts/lint.sh AGENTS.md skills/kisou/templates/AGENTS.md
git commit --only AGENTS.md skills/kisou/templates/AGENTS.md -m "docs: the first-message rule puts a configured language first" -m "Approved by the human for this one sentence of AGENTS.md (bg-seat-fixes spec dialogue, Q2)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

## The whole-branch review and its fix wave

After the last batch is accepted, Kanri dispatches the whole-branch review
on the `branch.review` kind over the merge base, as every plan's final step
(`roles/kanri.md`, "The final batch"), and gives the reviewer
`node "$TANTO/scripts/passage-check.js" replay --plan docs/superpowers/plans/2026-09-24-bg-seat-fixes.md --base <merge base>`
as its one command. Its findings become one more batch prompt — the fix
wave — for the next queued Jisso, and there is no second fix wave. This
plan writes no task for it; its own stop conditions apply. Three things the
reviewer is pointed at, because no script here judges them:

- the cross-file sites each task lists under "Named-mechanism sites" — the
  rework key and its second `record` call, the resume before a send, a
  terminal seat's resumable `dead`, a `queued` row the census does not
  list, and "the human's language" — read together, in every file that
  names them;
- the sites the Overview lists as ones the spec's section 7 does not name,
  which this plan changed so that no file contradicts another.

A fix-wave finding that touches `SKILL.md`, a role file, or a template
moves the tree those files describe after batch C's safe boundary, so the
safe boundary becomes the fix wave's own landing (Global Constraints).

## Issues for the close

No task closes the issues the spec's "Issues this design closes" names,
because none of them is on this branch: `bg-seat-ergonomics`'s close files
them, on its own S-33 and S-39, after this branch was cut from `a99aad2`,
and its records land on `main` by a fast-forward — a place this branch does
not see and, per `passage-check.js diff --base 8e37dee`'s own fixed-base
design, must not be merged into mid-plan to reach (a merge would make every
line of that close's `docs/` write-out `unaccounted-added` at every
boundary after). The spec's own section 7 already routes this correctly:
"`docs/` — by the close: … and the issues." This plan's own close applies
them, the same way it applies the spec's own Requirements and ADRs.

Each is found by its topic when the close's apply runs, never by a guessed
id — the ids are `bg-seat-ergonomics`'s close's to give, and by
`bg-seat-fixes`'s own close `main` will hold them if that close has landed:

```bash
grep -l '^Source: shoroku bg-seat-ergonomics' docs/issues/open/*.md
```

then read each file's `title:` and first paragraph for the mechanism it
names — issue 1, `pid` with `census` or `stale`; issue 2, `idle` with
`collect`; issue 3, `queue` with `landing`; issue 4 (if filed), `rework`
with `overwrit`. A group with no matching file yet is not an error: it
files that group's resolution as a shoroku proposal item instead, for the
close after this one.

Found, each is moved `docs/issues/open/<id>-<slug>.md` →
`docs/issues/resolved/` (issue 2 stays open), its frontmatter's `updated:`
line set to `2026-09-24`, and the paragraph for its group appended after
its body's last line and one blank line, verbatim — the same restore of
line endings with `git checkout --` that every task above applies:

Issue 1 — the census and the stale entry:

```markdown
Resolved by the bg-seat-fixes design
(`docs/superpowers/specs/2026-09-24-bg-seat-fixes-design.md`, section 3): an
entry of `claude agents --json` that carries no `pid` is not a live session,
whatever its `state` says. The four readers of the listing take the rule —
the spawner's census and its `findResumed`, `boundary.js census`, which
prints such a row under Not listed, its line ending
`— listed without a pid (a stale entry)`, and the launcher's Kanri check —
each with a test against a fake listing.
```

Issue 2 — the idle collection, which stays open:

```markdown
Measured by the bg-seat-fixes design
(`docs/superpowers/specs/2026-09-24-bg-seat-fixes-design.md`, section 4)
over every transcript on this machine: an idle background seat is sometimes
collected — once four together, at about sixty minutes of idleness, by one
sweep of unknown cause — and sometimes lives eleven hours, and whether its
`state` decides it is not determinable from the transcripts. The run no
longer rests on the answer: a terminal seat that has gone is resumed before
a line is sent to it (that design's section 5). What stays open is the
collection's condition. A later measurement follows section 4's procedure:
a throwaway background seat spawned in a folder whose trust the CLI has
recorded, given a trivial prompt that ends its turn, never attached, and
read at 45, 55, 60, 65, and 90 minutes — its `pid` and `state` in
`claude agents --json`, and its transcript's last record and any
`cost-state`.
```

Issue 3 — the queue at the landing:

```markdown
Resolved by the bg-seat-fixes design
(`docs/superpowers/specs/2026-09-24-bg-seat-fixes-design.md`, section 5):
the queue keeps its shape — every Jisso of a skill-editing plan spawned at
the landing with `queue=<topic>`, and never stopped — and nothing rests on
an idle seat's survival. Kanri sends a line to a terminal seat on the
roster as recorded; a send that errors, or a row recorded `dead`, sends it
to the census, and a seat the census does not list is resumed with its
whole conversation and the line sent again. A `queued` row the census does
not list stays `queued`.
```

Issue 4 — the rework overwrite, when filed:

```markdown
Resolved by the bg-seat-fixes design
(`docs/superpowers/specs/2026-09-24-bg-seat-fixes-design.md`, section 1): a
batch returned for rework runs again under its own key, `<X>-rework-<n>`,
with a prompt, a report, and a verdict of its own beside the first pass's,
which are never written again, and a Batches row of its own; a Jisso reads
every `batch:` line's file from disk before it judges anything.
```

Before moving any issue, check that no living document links to it by
path — `grep -rln -E 'issues/open/(<ids>)-' docs skills ./*.md
--include='*.md' | grep -v '^docs/superpowers/'` — and rewrite any hit to
`resolved/` in the same commit, as `docs/issues/AGENTS.md` asks.

## Self-Review

**Spec coverage.** Section 1: 1.1 Tasks 4 (Artifacts and Invocation), 5
(loop steps 2 and 6), 6 ("The run"), and 7 (the prompt's title, the
brief's `batch=<key>` and "The verdict file", the ledger's Batch column);
1.2 Task 4's Artifacts row and Task 5's step 6; 1.3 Task 3's test, Task 5's
second `record` call, and Task 7's ledger template; 1.4 Tasks 5, 6 (the
report's path), and 7 (the brief's `record` calls and step 5); 1.5 Task 6;
1.6 is the spec's record of the loss and asks no edit. Section 2: 2.2 Task
6's overrides row; 2.3 and 2.4 Task 6's "The four implementer statuses";
2.1 and 2.5 ask no edit. Section 3: 3.1's note Task 4; 3.2 items 1 and 4,
and 3.4, Task 1's Step 1, which confirms them landed; item 2 Task 1; item
3 Task 2; 3.3 Tasks 1 and 2. Section 4 is the dialogue's M-1 and asks no
task (Q6); its answer reaches issue 2 through "Issues for the close". Section 5: 5.1
Tasks 4 (Resuming, **The census.**, Messages) and 5 (loop step 6, "The
final batch" step 3, "Session lifecycle"); 5.2 Tasks 4 (rule 11) and 6
(Start); 5.3 Tasks 4, 5, and 7; 5.4 Task 5's Replace row; 5.5 adds
nothing. Section 6: 6.1 to 6.4 Task 8, 6.4's Kanri start line Task 9; 6.5
Tasks 8, 9, and 10; 6.6 Task 11; 6.7 Tasks 8 (the personal file's
Artifacts row) and 10 (the README) — the human's own act after the
landing is no task's. Section 7: every site, plus the six the Overview
lists. "Old values this plan contradicts": every entry is an `O` block of
the task that removes it, except the three whose every span carries
backticks — **The census.**'s `queued` clause (O4.6 is the needle at its
change point, P4.8 the check), "On a handshake" step 2 (P5.10), and the
roster template's two sentences (P7.14, P7.15). "What the plan must
contain": the re-read at `a99aad2` is the Overview's; the instruments are
batch A, with no measurement task (Q6); the contract, the role files, and
the templates are batches B and C, the safe boundary C's, C also the
plan's last batch; the README and the kisou template are Task 10; the two
`AGENTS.md` files, with their own lint, needle, and line-comparison steps
(F-15), are Task 11; the issues are "Issues for the close", after the
whole-branch review, per the spec's own section-7 routing (F-3) rather
than a task, since none of them is on this branch at this plan's drafting.
Rule 11's safe boundary is batch C, the plan's last batch and the last
that touches `skills/tanto/`, which Keikaku states in the Global
Constraints and the Batches section. Requirements and the ADRs are the
close's apply, not a task's.

**Placeholder scan.** No step says "add tests" without the test, or
"similar to Task N". The `<key>`, `<X>`, `<n>`, `<N-M>`, and `<topic>`
inside new passages are the skill's own slots, which the text defines.
"Issues for the close"'s `<id>-<slug>` and `<ids>` slots are the one
exception in a command outside a task: the ids are the other close's to
give and cannot be known here, and that section says how each is found by
topic instead.

**Type and name consistency.** `findResumed`, the fake CLI's
`resumeStaleListings` and its `stale` field, and `pid: 4322` (Task 1); the
`stale` set and the note ` — listed without a pid (a stale entry)`
(Task 2), which the Markdown sites write as the code span
`— listed without a pid (a stale entry)` — no leading space, since
markdownlint's MD038 refuses one — in `SKILL.md`, `roles/kanri.md`, and
issue 1's resolution; the key `<X>-rework-<n>`, `<key>`, and
`fixwave-rework-<n>` beside the first pass's `fix wave` row, spelled the
same in Tasks 3 to 7; "the human's language", and the start line's
`language: <tag> (<layer>)` or `language: — (unset)`, the same in Tasks 8
and 9; `resume batch X from task N` as `SKILL.md`'s Resuming already
spells it.

**How the passages were checked while drafting.** `lint` is clean. The
whole plan was applied, with the two `replay-skip:` lines Keikaku places in
the Global Constraints added to a scratch copy, by
`replay --base a99aad2` (identical to `8e37dee` for every path outside
`docs/superpowers/`, which only the spec's own two commits touch): exit 0,
every old block found exactly once, every anchor at its stated `after:`,
and all 30 `O` needles at 0 over the paths the plan touches. The same
passages were applied to a full checkout of `a99aad2` (`git archive`),
where `verify` read clean for all twelve tasks the plan then carried;
`node --test skills/tanto/scripts/*.test.js` passed all 215 tests (on the
machine's default Node, 24.16 — the Jisso's boundary runs the pinned 22);
`biome check` found no error and no format change in the four scripts;
and markdownlint with the repository's configuration was clean on
`SKILL.md`, the README, the role files, `AGENTS.md`, and a scratch issue
file holding what was then Task 12's four paragraphs (now "Issues for the
close"'s). The red steps were run on trees holding only their test
passages: Task 1's new test fails at
`assert.notEqual(got.name, spawned.name)`, Task 2's on its Not listed
assertion. Task 1 Step 1's, Task 4 Step 3's, Task 8 Step 3's, and Task 10
Step 2's expected outputs are what those commands print on this branch at
the point each step runs.

**Keikaku's own review pass, after the `plan.review` dispatch (fable),
fixed three things the drafter's own checks above could not see:** F-1 —
`templates/kaiseki-brief.md`'s "Batch report" slot (`batch-<X>-report.md`)
survived every sweep below untouched, which contradicted the Batches
section's own "every O-needle … is 0" wording; Task 7 now changes it too
(P7.16, O7.17), and O4.4 no longer carries an exception. F-2 — Task 8
(batch C) defined the repository's language fallback as Task 11 (then
batch D) would leave it, a state that never held between the two batches;
Task 11 moved into batch C, which F-3 emptied of its other occupant.
F-3 — Task 12's only non-`BLOCKED` path, merging `main` into this branch,
would have made `bg-seat-ergonomics`'s close's own `docs/` write-out
`unaccounted-added` at every boundary after, for the fixed `diff --base
8e37dee` check above; the task is dropped, its four resolution paragraphs
kept as "Issues for the close", which the spec's own section 7 already
routes correctly. `lint`, the two fixed checks (`census`, `diff --base
8e37dee`), and `replay --base 8e37dee` were rerun live against the working
tree after these edits and read clean — 31 residual `O` needles (30 plus
the new O7.17), all at 0, every anchor at its stated `after:`. `verify
--task N` is a post-apply check: run directly against the live (pristine,
pre-landing) tree, it correctly reports `passage-absent` for every task's
new passages, not a clean result — the drafter's own full-checkout run is
what read `verify` clean for all its tasks (twelve at the time it ran,
eleven of which survive this review's fixes); see
`.tanto/bg-seat-fixes/plan-dryrun.md` for the dry run and
`.tanto/bg-seat-fixes/plan-review.md` for the review these fixes answer.

**Sizes.** The largest task is Task 5, `roles/kanri.md`'s rework key and
resume: 327 lines and three steps, most of the lines its twelve passage
blocks. By batch, by heading line span after the review's fixes: A about
495 lines (Tasks 1-3), B about 1010 (Tasks 4-7, F-1's small addition
included), and C about 645 (Tasks 8-11, Task 11 folded in by F-2) — B
carries both halves of Kanri's and Jisso's procedure change with the two
run-time templates rule 11 lands beside them. No task is a
sweep-and-check shape.
