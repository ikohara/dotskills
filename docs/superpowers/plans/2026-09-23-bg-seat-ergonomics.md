# bg-seat-ergonomics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A background seat is named and kept out of the CLI's worktree isolation at its spawn; identity is the `sessionId` for every seat, read from `boundary.js census`; the shoroku vocabulary drops its stage word and says "shoroku proposal"; leaving a seat never stops it.

**Architecture:** Three instruments change first — the spawner (a name and `--settings` on every spawn, a revived seat, the ad hoc-worktree guard at every pass), the launcher (the attach line, a `gone` Kanri resumed, the trust hint), and `boundary.js` (a read-only `census` subcommand and an `S-n` writer keyed on the header it finds) — then one measurement against the real CLI, then the docs, and last the contract, the role files, and the templates, which name the new mechanisms and the renamed vocabulary.

**Tech Stack:** Node 22 with no dependencies (`node --test`), Markdown, the tanto skill's `passage-check.js` for every passage below.

**Spec:** `docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md` — every task names the spec sections its passages carry out.

## Overview

The plan edits the tanto skill's own files, so contract rule 11 governs it.
**The safe boundary — the first from which a role may be started or
replaced — is batch D's**, the final batch, which lands the last of
`SKILL.md`, the seven role files, and the templates of spec 6.4. No role is
started or replaced before batch D lands, and every Jisso of this plan is
spawned at its landing with `queue=bg-seat-ergonomics`. The rule-11
authority sentence, the four facts of spec section 5, and the README's
shortness (D-8) are stated in the Global Constraints section below; the
batch cuts, with each batch's own stop conditions, are the Batches
section's.

One more boundary fact, carried in the Global Constraints section: the
whole-branch review's fix wave runs after batch D. When its findings touch
`SKILL.md`, a role file, or a template, the tree those files describe
changes again at the fix wave's boundary, and a role started between the two
reads text the fix wave is about to change.

**Grouping choices, each against the spec's "What the plan must contain."**
`templates/spawn-request.md` is not in batch A with the scripts: its resume
sentence states which options the CLI brings back on a flag-less resume,
and the effort is measured only by Task 4, so the schema lands in batch B,
after the measurement it cites. The measurement opens batch B because it
needs batch A's spawner in the tree and nothing of the batches after it.
Every issue group closes in the batch that lands its fix: issue-aa37 with
the spawner (Task 1), the new trust issue with the
launcher's hint (Task 2), and the identity group (issue-02ab, issue-894d,
issue-d92f, issue-261c, issue-7f28) and the vocabulary group (issue-e3e4,
issue-5a2d, issue-de29, issue-8c74, issue-ce69, issue-bdad's third item)
in batch D, which lands the last file each group's fix spans — the roster
template and the other role files. issue-7607 needs nothing: it is already
under `docs/issues/resolved/`. Task 7's consistency checks pin the text
batch D lands, so they read their new values only from batch D's boundary
on; Task 7 says which of its expected values wait for which task.

**Two additions the spec implies but does not list, each flagged in its
task.** The spawner logs the stderr note the CLI prints on a resume (Task 1),
because a result file carries no stderr and the measurement of Task 4 must
read that note through the spawner, not from a session-issued
`claude --resume`. And `roles/kikaku.md` and `roles/hosa.md` each state the
handshake-by-name route to `cleared` that spec 2.5 and 2.8 retire (Task 13).

**Two renamings the spec names only in part.** Spec 1.3 calls the
spawner's fifteen-second pass "the spawner's census" and `boundary.js census`
"the census". Four sentences that say "the census" for the spawner's pass —
`SKILL.md`'s Resuming and Human access, `roles/kanri.md`'s Human access, and
`roles/keikaku.md`'s Handoff — say "the spawner's census" after this plan
(Tasks 8, 10, 13).

**How the passages below are written.** Every block is in the shape
`scripts/passage-check.js` parses; `$TANTO` is the skill's own directory,
`skills/tanto` in this repository, set in the same tool call as the command.
Every old block was read from the file as it stands on this branch, whose
only two commits since `main` are the spec's draft and its accepted form.
A task's issue files are edited at
their `docs/issues/open/` path, verified there, and only then moved with
`git mv`, because `passage-check.js` reads a block's path as the plan names
it and `replay` copies that path from the merge base.

**For the `replay-skip:` declarations.** The tasks' `bash` fences run
`node --test`, `./scripts/lint.sh`, and `git` (`add`, `mv`, `commit`,
`checkout`), none of which the scratch tree `replay` builds can hold, and
`passage-check.js verify`, whose `--plan` path that tree does not carry.
Task 4's commands start a resident spawner and act on the real CLI, so they
sit in `text` fences, which `replay` never runs.

**Reports and prompts follow the tanto templates.**

## Global Constraints

**This repository's rules (`AGENTS.md`), binding on every task:**

- Run `./scripts/lint.sh <the task's own changed paths>` and fix issues
  before committing; `lint.sh` takes file arguments
  (`pre-commit run --files "$@"`), so a task lints its own paths, never the
  whole repository.
- Commit by explicit path with `git commit --only <paths>` — the index is
  shared with whatever else this checkout is doing; a new file needs
  `git add <paths>` first, since `--only` does not pick up untracked files.
- Every commit ends with `Co-Authored-By: Claude <noreply@anthropic.com>` —
  `AGENTS.md`'s own example, and the form every task's own commit command
  below already carries. The harness supplies each session's own attribution
  line; a plan cannot know it in advance, so no task names a family here.
- Never `git add -A` / `.` / `-u`, bare `git commit`, or `git commit -a`;
  never amend a published commit; never push to `origin/main`; never pass
  `--no-verify` or another hook bypass. No task below needs any of the four;
  a task that seems to is a reason to stop and ask, not to use the flag.
- `skills/tanto/SKILL.md`, the seven `skills/tanto/roles/*.md` files, and
  `skills/tanto/README.md` are agent instruction files and repo-root-adjacent
  Markdown that `AGENTS.md`'s "Never do" section forbids editing without
  explicit human approval. That approval is this plan's own spec, accepted at
  `docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`
  (`2d396cd`) and signed off in
  `.tanto/bg-seat-ergonomics/review-brief-spec.md` ("all OK"). It covers
  exactly the edits this plan's tasks carry out — no task extends an edit
  beyond its own passages on the strength of this rule.
- Task 6 edits `skills/tanto/README.md` in batch B, before `SKILL.md`'s own
  edits (Tasks 10 and 11, batch C) land; `AGENTS.md`'s sibling rule ("after
  editing a skill's `SKILL.md`, review its sibling `README.md` for drift")
  fires the other way around from usual, once `SKILL.md` changes exist to
  compare — Task 10's own Step 3 reads the two together against the
  README Task 6 already landed, which is the guard, not a same-batch cut.

**Model families (`tanto.json`, read at this plan's landing, not restated as
a fixed table here — a personal or project override can change them before
this plan closes, and a batch prompt names the family it dispatches with,
read fresh):** every implementing task runs under a Jisso session on
`sonnet`, effort `xhigh` (`sessions.jisso`); a `task.implement` subagent it
dispatches runs on `sonnet`, effort `high`; an SDD fix-round escalation
(rounds 4–5) runs on `opus`, effort `high` (`task.escalate` — above
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
`queue=bg-seat-ergonomics`, reading nothing until its own batch prompt
reaches it, so that every one of them read the skill as it stood before
batch A.

**Batch D is the safe boundary** — the first point from which a role may be
started or replaced. No role is started or replaced before batch D lands.
The whole-branch review's fix wave, which runs after batch D, can move that
boundary again: when its findings touch `SKILL.md`, a role file, or a
template of spec §6.4, the safe boundary is the fix wave's own landing
instead, and no role is started or replaced in the window between batch D
and the fix wave either. The run-time templates —
`templates/boundary-brief.md`, `templates/batch-prompt.md`, and
`templates/kanri-handover.md` — need no change under this design (spec §5);
one a later plan chooses to touch would land with the role files.

**Four facts of this plan's own run (spec §5):**

1. The resident spawner keeps the code it started with: every seat this plan
   spawns — its Jissos at the landing, the close's shusei and shoki, and
   Kanri's successor — is spawned with no `--name` and no `--settings`, so
   this repository's `.claude/settings.local.json` stays until this plan's
   close; after the close the human runs `tanto down` then `tanto`, and
   Kanri's close line asks for it.
2. `boundary.js` runs from disk at every boundary; its `census` subcommand
   (Task 3) is additive and its `S-n` writer keys on the header it finds
   (Task 3), so every boundary this plan's own batches land — which write
   this topic's seven-column ledger — runs unchanged whichever batch lands
   the change.
3. This plan's close runs on the landed text: Kanri re-reads `SKILL.md`'s
   Session exit and `roles/kanri.md`'s close sections from disk before the
   close's first step, sends the last Jisso `close:`, and the close's files
   and commits take the names this plan lands.
4. The live roster (`.tanto/roster.md`) migrates at this plan's close
   (Task 12 changes the template it migrates to; the migration itself is
   Kanri's, not a script's).

**The README stays short (D-8):** Task 6's edits are the additions spec
§4.4 names and nothing else — no wider prose polish rides with this plan
(issue-2065 is out of scope).

**Two rules every task below already follows, stated here once rather than
per task:**

- **Named-mechanism rule.** A task that introduces or changes a named
  mechanism — a slot letter, a grant clause, a status word, a section
  pointer, a file-naming scheme — lists, in its own text, every other site
  in this plan's own files, and in the files it touches, that names the same
  mechanism, so its reviewer checks them together. Each task's own
  "Named-mechanism sites" note is this rule applied.
- **Line-ending rule.** A task that creates a Markdown file and later checks
  its line endings restores it with `git checkout -- <path>` after the
  commit, as one of the task's own steps — not only as part of a stop
  condition — because a created file lands `w/lf` on this host every time it
  is written (measured five of five in the `tanto-cost` run). A task that
  moves an issue file with `git mv` and then edits it again applies the same
  restore to the moved path.

**The `replay-skip:` declarations** (`git` commands and
`passage-check.js verify` invocations are skipped by `replay` automatically,
so the plan does not declare them):

```text
replay-skip: node --test — the scratch tree replay applies holds only the blobs of the paths this plan's passages touch, not a full checkout, and `node --test` needs siblings outside that set
replay-skip: ./scripts/lint.sh — the scratch tree carries no `.git`, `.pre-commit-config.yaml`, or the `mise`/`uv` toolchain that `lint.sh` needs
```

## Review Focus

Five inputs a person implementing or reviewing this plan is likely to meet,
the most likely first, each with the test that pins it or the reason none
does:

1. A roster whose Transcript cells are Windows paths: the census takes the
   basename across either separator — pinned by Task 3's `sess-queued` row.
2. A listing that parses but is empty, or whose entries carry no `cwd` (an
   older CLI): every `live` row reads "Not listed", and Kanri would mark
   them all `dead`, its own included. **Accepted as a known gap, not fixed
   here:** spec 2.1 and 2.2 name only a *failed* listing as "no signal";
   they are silent on a listing that parses but is empty or malformed, and
   this plan does not extend the accepted spec to cover that case on its
   own judgment. The census marks a row `dead`, never deletes it, so a
   wrong mark from this cause is Kanri's to notice and correct the way any
   `Not listed` result already is — no data is lost. A robustness fix (the
   census reads its own inability to find any `live` row's `sessionId`,
   its own included, as reason to report `census: unavailable` instead of
   `Not listed` for everyone) is a plan-review Shoroku proposal item for
   this topic's close, not a task here.
3. A root whose basename has no letter or digit: the name's `<repo>` segment
   is empty and is left out rather than leaving a leading `-` — pinned by
   Task 1's name test.
4. `.claude.json` recording the trust only under the other drive-letter
   case: `tanto` still prints the hint, because the CLI in the same terminal
   reads the same key (Measured 6) — the behaviour Task 2's hint test pins.
5. A `gone` Kanri whose resume succeeds but never re-registers in the
   listing within the spawner's poll: the result carries no `name`, and
   `tanto` attaches by the `sessionId`; the existing resume-poll test covers
   a late re-registration, not an absent one. **Accepted as a known gap,
   not fixed here:** the human's own `claude attach <id>` from the printed
   line works whether or not the listing shows a name yet, so this does not
   block the human reaching the seat; a test for the absent case is a
   follow-up, not this plan's.

## Batches

| Batch | Tasks | Delivers | Stop conditions at this boundary |
| --- | --- | --- | --- |
| A | 1–3 | the three instruments (`spawner.js`, `tanto.js`, `boundary.js`) with their tests; issue-aa37 closed; the new trust issue opened | `node --test skills/tanto/scripts/*.test.js` all green (the whole script suite, not only the three files a task names, since Task 1 changes the fake CLI `tanto.test.js` also reads); `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task <N>` for N in 1–3; `./scripts/lint.sh` on every path Tasks 1–3 touch; `git status --short docs/issues/` shows `aa37-*.md` only under `resolved/`; every O-needle of Tasks 1–3 at 0 over `skills/tanto/scripts/` |
| B | 4–7 | the real-CLI measurement report; `templates/spawn-request.md`; the README; the consistency note | at this boundary, the `boundary.verify` dispatch passes `--measurement .tanto/bg-seat-ergonomics/measurement-report.md`, and its `## Verification` lines are read against Task 4's expectations; Task 4's report exists at `.tanto/bg-seat-ergonomics/` and states the four measured facts (name shape, no worktree, resume keeps `sessionId` and name, effort named in the resume note); `passage-check.js verify` for Tasks 5–7; `./scripts/lint.sh` on `templates/spawn-request.md`, `README.md`, and `docs/notes/tanto-consistency-checks.md`; the O-needles of Tasks 5–7 at 0 over the files each touches |
| C | 8–11 | `roles/kanri.md` and `SKILL.md`, each split into an identity task and a vocabulary task | `passage-check.js verify` for Tasks 8–11; `./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/roles/kanri.md`; the O-needles of Tasks 8–11 at 0 over `skills/tanto/SKILL.md` and `skills/tanto/roles/kanri.md`; `node "$TANTO/scripts/boundary.js" census` run against this repository's live roster prints its four headings (it needs nothing past batch A) |
| D — the safe boundary | 12–15 | the templates of spec §6.4; the six other role files; the identity and the vocabulary issue groups closed | `node --test skills/tanto/scripts/*.test.js` all green; `passage-check.js verify` for Tasks 12–15; `./scripts/lint.sh` on every template of §6.4, every role file but `kanri.md`, and the moved issue files; **every O-needle of the whole plan, swept fresh over `skills/tanto/SKILL.md`, `skills/tanto/roles/`, `skills/tanto/templates/`, and `skills/tanto/README.md`, is 0** — this is the first boundary at which every file the plan touches agrees with every other, so it is where a needle a task under-scoped would surface; the consistency-note checks Task 7 flagged as waiting on batch D now read `1` |
| — (after D) | the whole-branch review and its fix wave | the branch reviewed against `main`, findings applied | the review's own stop conditions, as every plan carries; a finding that touches `SKILL.md`, a role file, or a template of §6.4 moves the safe boundary to the fix wave's own landing (Global Constraints) |

A stop condition worded as a property of the whole tree — "every O-needle …
is 0", "the script suite is green" — is backed by a command that sweeps the
whole tree (`skills/tanto/` in full, or `skills/tanto/scripts/*.test.js` in
full), not only the files the batch itself wrote.

## How a batch is verified

This plan carries passages, ships Node scripts with their tests, and ships
Markdown (the contract, the role files, the templates, the README, the
consistency note, the issue files). Every batch's boundary runs the fixed
checks below, plus the two per-task checks named after them, in order; a
batch is accepted only when every one exits clean, and a nonzero exit on a
task or a path a later batch has not landed yet is read against the
Batches section's own Stop conditions for the batch just landed, not
against every task the plan will eventually carry.

**Fixed checks, run at every boundary from batch A onward, verbatim:**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/boundary.js" census
```

Expected: exit 0, printing its four fixed headings (Listed, Not listed, No
session id, Not held) against this repository's own live roster — needs
nothing this plan's tasks after Task 3 change, so it runs at every boundary
from batch A onward, not only at batch D; before Task 3 lands, this command
does not exist yet and is skipped rather than run.

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --base 2d396cd
```

Expected: exit 0 — every passage this plan has landed so far, against the
branch's own diff from `2d396cd` (the spec's own accepted commit, this
plan's own starting point — not `main`, which predates the spec and would
report the whole spec file as unaccounted on every boundary), agrees with
what the plan's blocks describe (issue-7481); this is what makes the check
outlive the session that wrote it, rather than a one-time dry run.

**Per-task and per-path checks, named by the task or the batch, never
hand-written, and never a fenced block here — each is either declared a
`replay-skip:` for the scratch-tree dry run (so a fence here would be
silently skipped by `boundary` too, against the whole point of checking it)
or is itself parameterized per batch:**

- **The runtime and the test suite, in full.** `node --version` reports a
  `v22` line (CONTRIBUTING.md pins Node 22 via mise; a version claim is a
  run, not an assertion), then `node --test skills/tanto/scripts/*.test.js`
  — the whole script suite, every batch, because a batch that changes one
  script's exported shape can silently break another script's test (Task
  1's note: `tanto.test.js` reads `spawner.js`'s fake CLI).
- **The passage check, per task the batch lands.**
  `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task <N>`
  for every `<N>` the batch's own row in the Batches section names — never a
  hand-written verify command, since a task's needles, anchors, and line
  counts are fully determined by its own blocks.
- **Lint, by name, on the batch's own changed paths.**
  `./scripts/lint.sh <path> <path> …`, the paths being the ones the
  Batches section's Stop conditions name for that batch — `lint.sh` takes
  file arguments, so this never runs over the whole repository.
- **The content sweep.** Every `O` needle the batch's own tasks name,
  grepped over the scope each `O` block states — never only the files that
  task wrote. At batch D the sweep runs once more over the whole of
  `skills/tanto/SKILL.md`, `skills/tanto/roles/`, `skills/tanto/templates/`,
  and `skills/tanto/README.md`, since that is the first boundary at which
  every file the plan touches agrees with every other.
- **Frontmatter, where a task moves or rewrites it.** Tasks 14–15 move
  issue files with `git mv`; a batch that lands one runs
  `scripts/check_md_frontmatter.py` over it (the same check `lint.sh`
  already runs, named separately here because a moved file's frontmatter is
  exactly what a visual check would miss). No task in this plan writes
  JSON.

A command that has never been run is a placeholder in a command's shape;
every command above is one this plan's own drafting already ran once
against a scratch copy of the tree (recorded under
`.tanto/bg-seat-ergonomics/plan-build/`), and Keikaku's dry run below reruns
them for real.

## Tasks

### Task 1 — The spawner names each seat, turns the isolation off, revives a returning seat, and guards at every pass

Spec 1.1 to 1.4 and 6.5 (`scripts/spawner.js`), issue-aa37 under "Issues this
design closes", and the measurement of "What the plan must contain" for the
resume note (see Overview).

**Files:**

- Modify: `skills/tanto/scripts/spawner.js`
- Test: `skills/tanto/scripts/spawner.test.js`, and the fake-CLI guard line of `skills/tanto/scripts/tanto.test.js`
- Move: `docs/issues/open/aa37-a-bg-session-blocked-on-a-gated-write-reported-its-cwd-under-claude-worktrees.md` → `docs/issues/resolved/`

**Interfaces:**

- Consumes: nothing from another task.
- Produces: `seatName(root, request, seats, draw = randomHex)` → `string`
  (`<repo>-<role>[-<topic>]-<hex>`) and `shortIdOf(text)` → `string | null`,
  both exported beside `handleRequest`; `spawnArgs(request, name)`; the
  `seats.json` field `strayed: <cwd>` on a seat the guard stopped; the log
  lines `census: <sessionId> back`, `guard stopped <sessionId> at <cwd>`, and
  `resume <sessionId>: <the CLI's stderr note>`; the notice
  `strayed: <role> <topic> <name> — <cwd>`. The fake CLI in
  `spawner.test.js` — which `tanto.test.js` reads out of this file — honors
  `--name`, prints `backgrounded · <id> · <name>` on a spawn and the same line
  with ` (idle — send a prompt to start)` on a resume, and writes a
  `note: woke session …` line to stderr on a resume.

**Named-mechanism sites.** The guard's `strayed` mark is also named by
`templates/spawn-request.md` (Task 5), `roles/kanri.md`'s Replace table
(Task 8), `SKILL.md`'s `stopped` (Task 10), and `templates/roster.md`'s
`stopped` and Events (Task 12). "The spawner's census" is the name Tasks 8,
10, and 13 give this file's fifteen-second pass. The seat name's shape is
also in the README (Task 6) and `templates/spawn-request.md` (Task 5).

**O1.1** `if (!LIVE.includes(seat.status)) continue;` — `runCensus`'s skip of every seat not `running` or `blocked` (spec's Old values, `scripts/spawner.js` 468); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0 — the pass now revives a `gone` seat first.

**O1.2** `where the ad hoc-worktree guard runs` — the first sighting as the guard's one place (`scripts/spawner.js` 325–329); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.3** `session\s+(` — `shortIdOf`'s old pattern, which matches no line the CLI prints (spec 1.1); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O1.4** `Started background session` — the fake CLI's old spawn line; before: 1 in `skills/tanto/scripts/spawner.test.js` and 1 in `skills/tanto/scripts/tanto.test.js`, after: 0 in both.

- [ ] **Step 1: Write the failing tests**

Apply P1.5 to P1.15. The fake CLI learns `--name`,
the CLI's two printed lines, the resume note, and a listing entry with no
`id`; the name's shape, `--settings` on every spawn, the fallback parse, the
revived seat, the guard at a pass, and the resume note get tests; two
existing assertions that named the fake's old default name now match the
spawner's name instead.

**P1.5** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
const sub = argv[0];
```

**P1.5 →**

```js
const sub = argv[0];
const flag = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : undefined);
```

**P1.6** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  process.stdout.write("Resumed background session " + found.id + "\\n");
```

**P1.6 →**

```js
  process.stderr.write(
    "note: woke session " + found.id + " with its saved options (--name, --settings, --model, --effort, --permission-mode).\\n",
  );
  process.stdout.write("backgrounded · " + found.id + " · " + found.name + " (idle — send a prompt to start)\\n");
```

**P1.7** `skills/tanto/scripts/spawner.test.js` — replace exactly these 11 lines

```js
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
```

**P1.7 →**

```js
    sessionId: next.sessionId || "sess-new",
    name: next.name || flag("--name") || "seat-new [aaaaaa]",
    id: next.id || "bg01",
    status: "running",
    state: next.state || "running",
  };
  if (next.worktree) session.worktree = next.worktree;
  // The CLI prints the short id and the name. A listing entry may lack the
  // id, which is what the spawner's fallback parse of this line is for.
  const printed = session.id;
  if (next.noListedId) delete session.id;
  state.sessions.push(session);
  save();
  process.stdout.write("backgrounded · " + printed + " · " + session.name + "\\n");
  process.exit(0);
```

**P1.8** `skills/tanto/scripts/spawner.test.js` — replace exactly these 2 lines

```js
const SPAWN = {
  op: "spawn",
```

**P1.8 →**

```js
/** The name the spawner gives a seat of this workspace, as a pattern (spec 1.1). */
function namePattern(ws, role, topic) {
  const repo = path
    .basename(ws.root)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return new RegExp(`^${repo}-${role}${topic ? `-${topic}` : ""}-[0-9a-f]{4}$`);
}

const SPAWN = {
  op: "spawn",
```

**P1.9** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
test("a spawn writes the result, the seat, and deletes the request", () => {
```

**P1.9 →**

```js
test("a seat's name is <repo>-<role>[-<topic>]-<hex>, drawn again while seats.json holds it", () => {
  const { seatName } = require("./spawner.js");
  const root = path.join(os.tmpdir(), "My Repo!");
  const draws =
    (...values) =>
    () =>
      values.shift();
  assert.equal(seatName(root, { role: "kanri", topic: "—" }, [], draws("9c01")), "my-repo-kanri-9c01");
  assert.equal(
    seatName(root, { role: "jisso", topic: "BG Seat_Ergonomics" }, [], draws("3f2a")),
    "my-repo-jisso-bg-seat-ergonomics-3f2a",
  );
  assert.equal(seatName(root, { role: "shoki" }, [], draws("0a0b")), "my-repo-shoki-0a0b");
  assert.equal(
    seatName(path.join(os.tmpdir(), "!!!"), { role: "jisso", topic: "t" }, [], draws("0001")),
    "jisso-t-0001",
  );
  const held = [{ name: "my-repo-jisso-t-3f2a" }];
  assert.equal(seatName(root, { role: "jisso", topic: "t" }, held, draws("3f2a", "9c01")), "my-repo-jisso-t-9c01");
  assert.match(seatName(root, { role: "jisso", topic: "t" }, []), /^my-repo-jisso-t-[0-9a-f]{4}$/);
});

test("the short id is read from the spawn line and from the resume line", () => {
  const { shortIdOf } = require("./spawner.js");
  assert.equal(shortIdOf("backgrounded · ced66c9a · probe-named-s1\n"), "ced66c9a");
  assert.equal(shortIdOf("backgrounded · ced66c9a · probe-named-s1 (idle — send a prompt to start)\n"), "ced66c9a");
  assert.equal(shortIdOf("session ced66c9a started\n"), null);
});

test("a spawn writes the result, the seat, and deletes the request", () => {
```

**P1.10** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
  assert.equal(got.name, "seat-new [aaaaaa]");
```

**P1.10 →**

```js
  assert.match(got.name, namePattern(ws, "jisso", "t"));
```

**P1.11** `skills/tanto/scripts/spawner.test.js` — replace exactly these 8 lines

```js
test("a spawn's command line carries the flags the request names", () => {
  const ws = workspace();
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const spawned = calls(ws).find((argv) => argv.includes("--bg"));
  assert.deepEqual(spawned, [
    "--bg",
    "--model",
```

**P1.11 →**

```js
test("a spawn's command line carries the name, the isolation setting, and the flags the request names", () => {
  const ws = workspace();
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const spawned = calls(ws).find((argv) => argv.includes("--bg"));
  assert.match(spawned[2], namePattern(ws, "shoki", "t"));
  assert.deepEqual(spawned, [
    "--bg",
    "--name",
    spawned[2],
    "--settings",
    '{"worktree":{"bgIsolation":"none"}}',
    "--model",
```

**P1.12** `skills/tanto/scripts/spawner.test.js` — replace exactly this 1 line

```js
test("a --bg child's cwd is the workspace root, not wherever the spawner was started", () => {
```

**P1.12 →**

```js
test("every spawn passes --settings, a Kanri's included, and a topic of — is left out of the name", () => {
  const ws = workspace();
  const { id } = request(ws, { ...SPAWN, role: "kanri", topic: "—", prompt: "/tanto kanri" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const spawned = calls(ws).find((argv) => argv.includes("--bg"));
  assert.equal(spawned[spawned.indexOf("--settings") + 1], '{"worktree":{"bgIsolation":"none"}}');
  assert.match(spawned[spawned.indexOf("--name") + 1], namePattern(ws, "kanri", ""));
  assert.equal(result(ws, id).name, spawned[spawned.indexOf("--name") + 1]);
});

test("a listing entry with no id takes the short id the --bg line printed", () => {
  const ws = workspace();
  setState(ws, { next: { id: "ced66c9a", noListedId: true } });
  const { id } = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).id, "ced66c9a");
});

test("a --bg child's cwd is the workspace root, not wherever the spawner was started", () => {
```

**P1.13** `skills/tanto/scripts/spawner.test.js` — replace exactly these 3 lines

```js
  assert.equal(result(ws, id).sessionId, "sess-new");
  assert.equal(result(ws, id).name, "seat-back [bbbbbb]");
});
```

**P1.13 →**

```js
  assert.equal(result(ws, id).sessionId, "sess-new");
  assert.equal(result(ws, id).name, "seat-back [bbbbbb]");
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.match(log, /resume sess-new: note: woke session bg02 with its saved options/);
});
```

**P1.14** `skills/tanto/scripts/spawner.test.js` — replace exactly these 2 lines

```js
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].renamed, "seat-new [aaaaaa]");
```

**P1.14 →**

```js
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(seats(ws)[0].renamed, namePattern(ws, "jisso", "t"));
```

**P1.15** `skills/tanto/scripts/spawner.test.js` — replace exactly these 10 lines

```js
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
```

**P1.15 →**

```js
test("the guard stops a seat whose cwd is an ad hoc worktree", () => {
  const ws = workspace();
  const stray = path.join(ws.root, ".claude", "worktrees", "wt-1");
  setState(ws, { next: { cwd: stray } });
  const { id } = request(ws, { ...SPAWN, mode: "manual" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).error, /ad hoc worktree/);
  assert.equal(seats(ws)[0].status, "stopped");
  assert.equal(seats(ws)[0].strayed, stray);
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 1);
});

test("the guard stops a seat that reaches an ad hoc worktree after its first sighting, and toasts once", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const stray = path.join(ws.root, ".claude", "worktrees", "probe-task");
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: listed.map((s) => ({ ...s, cwd: stray })) });
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "stopped");
  assert.equal(seats(ws)[0].strayed, stray);
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "stop")
      .map((argv) => argv[1]),
    ["bg01"],
  );
  assert.equal(notices(ws).length, 1);
  assert.match(notices(ws)[0], /^strayed: jisso t \S+ — /);
});

test("the guard compares the paths with the separators unified and, on Windows, the case folded", {
  skip: process.platform !== "win32",
}, () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const stray = `${ws.root.toUpperCase().replace(/\\/g, "/")}/.CLAUDE/WORKTREES/wt-2`;
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: listed.map((s) => ({ ...s, cwd: stray })) });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "stopped");
});

test("the guard leaves a seat whose request named a worktree alone", () => {
  const ws = workspace();
  setState(ws, { next: { cwd: path.join(ws.root, ".claude", "worktrees", "shoki-t") } });
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 0);
});

test("the census revives a gone seat the listing holds again, and never a stopped one", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: [] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "gone");
  setState(ws, { sessions: listed.map((s) => ({ ...s, state: "blocked" })) });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "blocked");
  assert.equal(seats(ws)[0].goneAt, undefined);
  assert.equal(notices(ws).length, 1);
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.match(log, /census: sess-new back/);

  // The fake keeps a stopped session listed, as a reopened one would be.
  const second = workspace();
  request(second, SPAWN);
  run(second, ["run", "--root", second.root, "--once"]);
  request(second, { op: "stop", sessionId: "sess-new" });
  run(second, ["run", "--root", second.root, "--once"]);
  run(second, ["run", "--root", second.root, "--once"]);
  assert.equal(seats(second)[0].status, "stopped");
});
```

**P1.16** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
if (!FAKE.includes("Started background session")) {
```

**P1.16 →**

```js
if (!FAKE.includes("backgrounded · ")) {
```

- [ ] **Step 2: Run the tests to see them fail**

```bash
node --test skills/tanto/scripts/spawner.test.js
```

Expected: FAIL — among others `seatName is not a function`, the command
line missing `--name`, and the revived seat still `gone`.

- [ ] **Step 3: Implement**

Apply P1.17 to P1.23: the name helpers and the two new
flags on a spawn only (a resume stays `claude --resume <sessionId> --bg`),
the rewritten `shortIdOf`, the path comparison shared by both places the
guard runs, `strayed` on a stopped seat, the resume note in the log, and a
`runCensus` that revives before it checks.

**P1.17** `skills/tanto/scripts/spawner.js` — replace exactly these 22 lines

```js
/**
 * The `--bg` command line. `request.branch` is not read here — it is
 * informational, carried through into the result and then into
 * `record --seat`'s Branch column (`boundary.js`); a worktree seat's real
 * branch is the CLI's own (Important 4, task 26; Minor 5, branch-review.md).
 */
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
```

**P1.17 →**

```js
/**
 * One segment of a seat's name: lower-cased, every run of characters outside
 * `a-z0-9` turned into one `-`, and no `-` at either end.
 */
function nameSegment(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Four random lower-case hexadecimal digits. */
function randomHex() {
  return Math.floor(Math.random() * 0x10000)
    .toString(16)
    .padStart(4, "0");
}

/**
 * A terminal seat's name, `<repo>-<role>[-<topic>]-<hex>` (spec 1.1): the
 * root's basename, the request's role, its topic unless absent or `—`, and
 * four hexadecimal digits, drawn again while a seat in `seats.json` carries
 * the whole name. The CLI registers it as the user's own, which no
 * auto-title replaces, and a flag-less resume brings it back from the job's
 * saved options, so the name is the seat's for its life.
 */
function seatName(root, request, seats, draw = randomHex) {
  const topic = request.topic && request.topic !== "—" ? nameSegment(request.topic) : "";
  const stem = [nameSegment(path.basename(root)), request.role, topic].filter(Boolean).join("-");
  let name = `${stem}-${draw()}`;
  while (seats.some((seat) => seat.name === name)) name = `${stem}-${draw()}`;
  return name;
}

/** A path with its separators unified, no trailing one, and, on Windows, its case folded. */
function comparablePath(p) {
  const unified = String(p).replace(/\\/g, "/").replace(/\/+$/, "");
  return process.platform === "win32" ? unified.toLowerCase() : unified;
}

/** Whether a listed cwd lies under `<root>/.claude/worktrees/` (issue-aa37, spec 1.4). */
function underAdHocWorktree(root, cwd) {
  if (!cwd) return false;
  const worktrees = comparablePath(path.join(root, ".claude", "worktrees"));
  return comparablePath(cwd).startsWith(`${worktrees}/`);
}

// The CLI's background isolation, off for this seat alone (spec 1.2): with
// the default, `worktree`, a seat's first Write fails and it moves itself
// into `.claude/worktrees/`. A flag layer outranks every settings file, no
// file is written, and a flag-less resume keeps it.
const NO_BG_ISOLATION = JSON.stringify({ worktree: { bgIsolation: "none" } });

/**
 * The `--bg` command line of a spawn: the seat's name and the isolation
 * setting, then the request's own flags. A resume passes none of them — any
 * flag on `--resume … --bg` starts a copy under a new id — and the CLI
 * brings back the options the spawn passed. `request.branch` is not read
 * here — it is informational, carried through into the result and then into
 * `record --seat`'s Branch column (`boundary.js`); a worktree seat's real
 * branch is the CLI's own (Important 4, task 26; Minor 5, branch-review.md).
 */
function spawnArgs(request, name) {
  const args = ["--bg", "--name", name, "--settings", NO_BG_ISOLATION];
  if (request.model) args.push("--model", request.model);
  if (request.effort) args.push("--effort", request.effort);
  args.push("--permission-mode", request.mode || "auto");
  if (request.worktree) args.push("-w", request.worktree);
  for (const dir of request.addDir || []) args.push("--add-dir", dir);
  args.push(request.prompt);
  return args;
}

/**
 * The short id `--bg` prints, for a listing entry that carries no `id`: the
 * CLI prints `backgrounded · <short id> · <name>` on a spawn, and the same
 * line with ` (idle — send a prompt to start)` after it on a resume.
 */
function shortIdOf(text) {
  const found = /backgrounded\s+·\s+([A-Za-z0-9][\w-]*)\s+·/.exec(text || "");
  return found ? found[1] : null;
}
```

**P1.18** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
  const got = runClaude(spawnArgs(request));
```

**P1.18 →**

```js
  const name = seatName(root, request, seats);
  const got = runClaude(spawnArgs(request, name));
```

**P1.19** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
  // The listing's first sighting is where the ad hoc-worktree guard runs
  // (issue-aa37): a `--bg` session under a mode that gates a tool has once
  // reported its cwd under `.claude/worktrees/` with no `-w`.
  const strayRoot = path.join(root, ".claude", "worktrees");
  const stray = !request.worktree && session.cwd && session.cwd.startsWith(strayRoot);
```

**P1.19 →**

```js
  // The listing's first sighting is the guard's first look (issue-aa37); the
  // spawner's census looks again at every pass, since a seat reaches
  // `.claude/worktrees/` at its first Write, after this sighting (spec 1.4).
  const stray = !request.worktree && underAdHocWorktree(root, session.cwd);
```

**P1.20** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
    status: stray ? "stopped" : "running",
```

**P1.20 →**

```js
    status: stray ? "stopped" : "running",
    ...(stray ? { strayed: session.cwd } : {}),
```

**P1.21** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
  if (request.op === "resume") {
    const got = runClaude(["--resume", request.sessionId, "--bg"]);
    if (got.code !== 0) return { error: `claude --resume: ${got.err.trim()}` };
```

**P1.21 →**

```js
  if (request.op === "resume") {
    // No flag: the CLI brings back the options the spawn passed and names
    // them on stderr, which a result does not carry, so the log keeps it.
    const got = runClaude(["--resume", request.sessionId, "--bg"]);
    if (got.code !== 0) return { error: `claude --resume: ${got.err.trim()}` };
    if (got.err.trim()) appendLog(root, `resume ${request.sessionId}: ${got.err.trim()}`);
```

**P1.22** `skills/tanto/scripts/spawner.js` — replace exactly these 33 lines

```js
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
```

**P1.22 →**

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

/**
 * The ad hoc-worktree guard at a pass (spec 1.4): stop the seat by its short
 * id, mark it `stopped` with `strayed: <cwd>`, log it, and toast once — the
 * next pass skips a `stopped` seat, so the toast is not repeated. A stop
 * that fails leaves the seat as it was, for the next pass to try again.
 */
function strand(root, seat, cwd) {
  const got = runClaude(["stop", seat.id || seat.sessionId]);
  if (got.code !== 0) {
    appendLog(root, `guard: stop ${seat.sessionId} failed — ${got.err.trim()}`);
    return;
  }
  seat.status = "stopped";
  seat.strayed = cwd;
  appendLog(root, `guard stopped ${seat.sessionId} at ${cwd}`);
  raiseNotice(`strayed: ${seat.role} ${seat.topic} ${seat.name} — ${cwd}`);
}

/** One `running` or `blocked` seat against the listing's entry for it. */
function censusSeat(root, seat, session) {
  if (!session) {
    seat.status = "gone";
    seat.goneAt = stamp();
    appendLog(root, `census: ${seat.sessionId} gone`);
    return;
  }
  if (!seat.worktree && underAdHocWorktree(root, session.cwd)) {
    strand(root, seat, session.cwd);
    return;
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

/** The spawner's census: one pass over `seats.json` against the listing. */
function runCensus(root, seats) {
  const listing = listAgents(root);
  if (listing.error) {
    appendLog(root, `census: ${listing.error}`);
    return seats;
  }
  const byId = new Map(listing.sessions.filter((s) => s.sessionId).map((s) => [s.sessionId, s]));
  for (const seat of seats) {
    const session = byId.get(seat.sessionId);
    if (seat.status === "gone" && session) revive(root, seat);
    if (LIVE.includes(seat.status)) censusSeat(root, seat, session);
  }
  writeSeats(root, seats);
  return seats;
}
```

**P1.23** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
module.exports = { main, noticeCommand, handleRequest, runCensus, readSeats, spawnerDir };
```

**P1.23 →**

```js
module.exports = { main, noticeCommand, handleRequest, runCensus, readSeats, spawnerDir, seatName, shortIdOf };
```

- [ ] **Step 4: Run the tests to see them pass**

```bash
node --test skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js
```

Expected: PASS, every test; on a host that is not Windows the case-fold
test is reported as skipped.

- [ ] **Step 5: Close issue-aa37**

The cause is measured (spec, Measured 4), removed per seat by `--settings`
(1.2), and the guard runs at every pass (1.4). Apply P1.24 and
P1.25.

**P1.24** `docs/issues/open/aa37-a-bg-session-blocked-on-a-gated-write-reported-its-cwd-under-claude-worktrees.md` — replace exactly this 1 line

```markdown
updated: 2026-09-20
```

**P1.24 →**

```markdown
updated: 2026-09-23
```

**P1.25** `docs/issues/open/aa37-a-bg-session-blocked-on-a-gated-write-reported-its-cwd-under-claude-worktrees.md` — replace exactly these 2 lines

```markdown
Related: issue-0673 (a Kaiseki in a worktree) and issue-1bff (a fresh Jisso's
own branch checkout racing a concurrent topic's apply).
```

**P1.25 →**

```markdown
Related: issue-0673 (a Kaiseki in a worktree) and issue-1bff (a fresh Jisso's
own branch checkout racing a concurrent topic's apply).

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 1.2 and
1.4). The cause was the CLI's default `worktree.bgIsolation`: a seat's first
Write fails its guard, and the model moves the seat into
`.claude/worktrees/` with `EnterWorktree` — reproduced with no `-w`. The
spawner passes `--settings '{"worktree":{"bgIsolation":"none"}}'` on every
spawn, which a flag-less resume keeps, and its ad hoc-worktree guard now
runs at every pass of the spawner's census rather than at the first sighting
alone.
```

- [ ] **Step 6: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 1
```

Expected: `task 1: verify clean`. It runs before the move of Step 7, since
two of its passages name the issue's `open/` path.

- [ ] **Step 7: Move the issue**

```bash
git mv docs/issues/open/aa37-a-bg-session-blocked-on-a-gated-write-reported-its-cwd-under-claude-worktrees.md docs/issues/resolved/
```

- [ ] **Step 8: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js docs/issues/resolved/aa37-a-bg-session-blocked-on-a-gated-write-reported-its-cwd-under-claude-worktrees.md
git commit --only skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js skills/tanto/scripts/tanto.test.js docs/issues/open/aa37-a-bg-session-blocked-on-a-gated-write-reported-its-cwd-under-claude-worktrees.md docs/issues/resolved/aa37-a-bg-session-blocked-on-a-gated-write-reported-its-cwd-under-claude-worktrees.md -m "feat: the spawner names each seat and turns the CLI's background isolation off per seat" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit. The trailer
identifies the AI agent that commits, as `AGENTS.md` asks — the bare form,
which the harness supplies for the session that runs this task.

### Task 2 — The launcher prints the leave line, resumes a Kanri that left the listing, and hints at an unrecorded folder trust

Spec 4.1 to 4.3 and 6.5 (`scripts/tanto.js`), and the new issue under
"Issues this design closes", opened here because the launcher's hint is its
workaround.

**Files:**

- Modify: `skills/tanto/scripts/tanto.js`
- Test: `skills/tanto/scripts/tanto.test.js`
- Create: `docs/issues/open/b7e1-the-agent-views-folder-trust-question-after-a-detach-takes-no-input.md`

**Interfaces:**

- Consumes: Task 1's fake CLI, which `tanto.test.js` reads out of
  `spawner.test.js` (it prints `backgrounded · <id> · <name>` and fails a
  `--resume` of a session it does not hold with `unknown session <id>`).
- Produces: `cmdUp`'s output lines, in order — the trust hint when there is
  one, `claude attach <id>`, the leave line, and
  `then type /tanto fukki there once` when a seat was resumed; on stderr,
  `tanto: the Kanri resume failed — <error>; spawning a new Kanri`.

**Named-mechanism sites.** The rule "a seat `seats.json` holds as `running`
or `blocked` — or, for Kanri alone, `gone` — is resumed; one it holds as
`stopped` or `removed` is not" is copied, in one sentence, by the README
(Task 6) and `SKILL.md`'s Resuming (Task 10). The leave line's content is the
README's Usage sentence (Task 6).

**O2.1** `const kanriHeld = Boolean(held && (held.status === "running" || held.status === "blocked"));` — the launcher's resume rule for Kanri (spec's Old values, `scripts/tanto.js` 340); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0 — a `gone` Kanri is resumed too.

- [ ] **Step 1: Write the failing tests**

Apply P2.2 and P2.3.

**P2.2** `skills/tanto/scripts/tanto.test.js` — replace exactly these 4 lines

```js
function backdate(file, seconds) {
  const past = new Date(Date.now() - seconds * 1000);
  fs.utimesSync(file, past, past);
}
```

**P2.2 →**

```js
function backdate(file, seconds) {
  const past = new Date(Date.now() - seconds * 1000);
  fs.utimesSync(file, past, past);
}

// The two lines spec 4.1 and 4.3 fix, byte for byte.
const LEAVE =
  "← or /exit returns to the agent view, Ctrl+Z to the shell; the seat keeps running — /stop alone stops it, and a Kanri you /stop comes back with tanto";
const TRUST =
  "this folder's trust is not recorded: run claude here once and answer \"Yes, I trust this folder\" — the agent view's own trust question after ← or /exit takes no input";

/** `.claude.json` in the fake config directory, keyed as the CLI keys the root. */
function writeTrust(ws, accepted) {
  const key = ws.root.replace(/\\/g, "/");
  const body = { projects: { [key]: { hasTrustDialogAccepted: accepted } } };
  fs.writeFileSync(path.join(ws.root, ".claude.json"), JSON.stringify(body));
}

const LIVE_KANRI = {
  sessionId: "sess-live",
  name: "seat-live [ffffff]",
  cwd: null,
  kind: "background",
  state: "running",
  id: "bg07",
};
```

**P2.3** `skills/tanto/scripts/tanto.test.js` — replace exactly these 8 lines

```js
test("the launcher itself never runs claude --bg", () => {
  const ws = workspace();
  launch(ws, [ws.root, "--timeout", "20000"]);
  const own = calls(ws).filter((argv) => argv.includes("--bg"));
  assert.equal(own.length, 1);
  const seats = JSON.parse(fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "seats.json"), "utf8")).seats;
  assert.equal(seats[0].role, "kanri");
});
```

**P2.3 →**

```js
test("the launcher itself never runs claude --bg", () => {
  const ws = workspace();
  launch(ws, [ws.root, "--timeout", "20000"]);
  const own = calls(ws).filter((argv) => argv.includes("--bg"));
  assert.equal(own.length, 1);
  const seats = JSON.parse(fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "seats.json"), "utf8")).seats;
  assert.equal(seats[0].role, "kanri");
});

test("the attach line is followed by the line on leaving and stopping a seat", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  const lines = got.out.split(/\r?\n/);
  const at = lines.indexOf("claude attach bg07");
  assert.notEqual(at, -1, got.out);
  assert.equal(lines[at + 1], LEAVE);
});

test("a Kanri seats.json holds as gone is resumed, never spawned again", () => {
  // The human's `/stop`, or a crash while the spawner ran: the listing has
  // lost it, and --resume still finds it by sessionId (spec 4.2).
  const ws = workspace([{ ...LIVE_KANRI, hidden: true }]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "gone", goneAt: "x" },
  ]);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "resume")
      .map((r) => r.sessionId),
    ["sess-live"],
  );
  const lines = got.out.split(/\r?\n/);
  const at = lines.indexOf("claude attach bg07");
  assert.notEqual(at, -1, got.out);
  assert.equal(lines[at + 1], LEAVE);
  assert.equal(lines[at + 2], "then type /tanto fukki there once");
});

test("a Kanri resume that fails says so in one line and spawns a new Kanri", () => {
  const ws = workspace();
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "gone" }]);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.match(got.err, /^tanto: the Kanri resume failed — .*unknown session sess-live.*; spawning a new Kanri$/m);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 1);
  assert.match(got.out, /claude attach bg01/);
});

test("the trust hint comes before the attach line when .claude.json does not record the folder's trust", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeTrust(ws, false);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  const lines = got.out.split(/\r?\n/);
  const at = lines.indexOf("claude attach bg07");
  assert.notEqual(at, -1, got.out);
  assert.equal(lines[at - 1], TRUST);
});

test("no trust hint when .claude.json records the trust, is missing, or does not parse, and the file is never written", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const file = path.join(ws.root, ".claude.json");
  writeTrust(ws, true);
  const recorded = fs.readFileSync(file, "utf8");
  assert.equal(launch(ws, [ws.root, "--timeout", "20000"]).out.includes(TRUST), false);
  assert.equal(fs.readFileSync(file, "utf8"), recorded);
  fs.rmSync(file);
  assert.equal(launch(ws, [ws.root, "--timeout", "20000"]).out.includes(TRUST), false);
  assert.equal(fs.existsSync(file), false);
  fs.writeFileSync(file, "{ not json");
  assert.equal(launch(ws, [ws.root, "--timeout", "20000"]).out.includes(TRUST), false);
  assert.equal(fs.readFileSync(file, "utf8"), "{ not json");
});
```

- [ ] **Step 2: Run the tests to see them fail**

```bash
node --test skills/tanto/scripts/tanto.test.js
```

Expected: FAIL — the leave line and the trust hint absent, the `gone`
Kanri spawned again, and the failed resume exiting 1.

- [ ] **Step 3: Implement**

Apply P2.4 to P2.9.

**P2.4** `skills/tanto/scripts/tanto.js` — replace exactly these 3 lines

```js
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");
```

**P2.4 →**

```js
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");
```

**P2.5** `skills/tanto/scripts/tanto.js` — replace exactly these 2 lines

```js
const WAIT_MS = 60000;
const POLL_MS = 250;
```

**P2.5 →**

```js
const WAIT_MS = 60000;
const POLL_MS = 250;

// The line printed after every attach line (spec 4.1): every way out of a
// seat but `/stop` leaves it running.
const LEAVE_LINE =
  "← or /exit returns to the agent view, Ctrl+Z to the shell; the seat keeps running — /stop alone stops it, and a Kanri you /stop comes back with tanto";

// The trust hint (spec 4.3), printed before the attach line.
const TRUST_LINE =
  "this folder's trust is not recorded: run claude here once and answer \"Yes, I trust this folder\" — the agent view's own trust question after ← or /exit takes no input";

// A seat `seats.json` holds as `running` or `blocked` — or, for Kanri alone,
// `gone` — is resumed; one it holds as `stopped` or `removed` is not (spec 4.2).
const KANRI_RESUMABLE = ["running", "blocked", "gone"];
```

**P2.6** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
/** The branch the shared tree is on, which the request schema asks for. */
```

**P2.6 →**

```js
/**
 * The trust hint, or null (spec 4.3). `.claude.json` is
 * `$CLAUDE_CONFIG_DIR/.claude.json` when that variable is set and
 * `~/.claude.json` otherwise; its key for this folder is the root as `tanto`
 * resolved it, every `\` turned into `/` and the drive letter as given —
 * the key the CLI in the same terminal looks up. A missing or unparsable
 * file prints nothing, and `tanto` never writes the file.
 */
function trustHint(root) {
  const dir = process.env.CLAUDE_CONFIG_DIR;
  const file = dir ? path.join(dir, ".claude.json") : path.join(os.homedir(), ".claude.json");
  let config;
  try {
    config = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
  const project = config?.projects?.[root.replace(/\\/g, "/")];
  return project?.hasTrustDialogAccepted === true ? null : TRUST_LINE;
}

/** The branch the shared tree is on, which the request schema asks for. */
```

**P2.7** `skills/tanto/scripts/tanto.js` — replace exactly these 4 lines

```js
  const held = row
    ? seats.find((s) => s.sessionId === row.sessionId)
    : seats.find((s) => s.role === "kanri" && (s.status === "running" || s.status === "blocked"));
  const kanriHeld = Boolean(held && (held.status === "running" || held.status === "blocked"));
```

**P2.7 →**

```js
  // A `gone` Kanri is one the human `/stop`ped, or one that crashed while the
  // spawner ran, and it is resumed like a `running` one (spec 4.2); a
  // `stopped` one — after `tanto down --seats`, or a handover — is not.
  const held = row
    ? seats.find((s) => s.sessionId === row.sessionId)
    : seats.find((s) => s.role === "kanri" && KANRI_RESUMABLE.includes(s.status));
  const kanriHeld = Boolean(held && KANRI_RESUMABLE.includes(held.status));
```

**P2.8** `skills/tanto/scripts/tanto.js` — replace exactly these 13 lines

```js
  } else {
    const request =
      !handover && !listed && kanriHeld
        ? {
            op: "resume",
            role: held.role || "kanri",
            topic: held.topic,
            sessionId: row ? row.sessionId : held.sessionId,
          }
        : kanriRequest(root, sessions);
    const id = writeRequest(root, request);
    const result = waitForResult(root, id, waitMs);
    if (!result) {
```

**P2.8 →**

```js
  } else {
    let request =
      !handover && !listed && kanriHeld
        ? {
            op: "resume",
            role: held.role || "kanri",
            topic: held.topic,
            sessionId: row ? row.sessionId : held.sessionId,
          }
        : kanriRequest(root, sessions);
    let result = waitForResult(root, writeRequest(root, request), waitMs);
    if (result?.error && request.op === "resume") {
      fail(`tanto: the Kanri resume failed — ${result.error}; spawning a new Kanri`);
      request = kanriRequest(root, sessions);
      result = waitForResult(root, writeRequest(root, request), waitMs);
    }
    if (!result) {
```

**P2.9** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
  if (attach) process.stdout.write(`claude attach ${attach}\n`);
```

**P2.9 →**

```js
  const hint = trustHint(root);
  if (hint) process.stdout.write(`${hint}\n`);
  if (attach) process.stdout.write(`claude attach ${attach}\n${LEAVE_LINE}\n`);
```

- [ ] **Step 4: Run the tests to see them pass**

```bash
node --test skills/tanto/scripts/tanto.test.js skills/tanto/scripts/spawner.test.js
```

Expected: PASS, every test.

- [ ] **Step 5: Open the trust issue**

The unanswerable trust question is the CLI's; this repository files it, with
the reproduction, the environment, the start-up question that does take
input, the two drive-letter keys, the workaround and the launcher's hint,
and issue-fd4b as related (spec, "Issues this design closes"). The `created:`
and `updated:` dates are the design's, fixed so that the block is exact.

**W2.10** `docs/issues/open/b7e1-the-agent-views-folder-trust-question-after-a-detach-takes-no-input.md` — new file, 45 lines

```markdown
---
id: "b7e1"
title: the agent view's folder-trust question after a detach takes no input
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-23
updated: 2026-09-23
---

Source: session 2026-09-23

Returning from an attached background seat to the agent view shows the CLI's
folder-trust question — "Quick safety check: Is this a project you created
or one you trust?" — for the terminal's folder, and the question takes no
input: neither "Yes, I trust this folder" nor "No, exit" can be selected.

Reproduction: in a repository whose trust `$CLAUDE_CONFIG_DIR/.claude.json`
does not record — `projects[<path>].hasTrustDialogAccepted` is not `true` —
`claude attach <id>` to a background seat, then leave it by `←`, `/exit`, or
`Ctrl+C` twice, the three ways out that return to the agent view. `Ctrl+Z`,
which returns to the shell instead, does not show it.

Environment: Windows, VS Code's integrated terminal, Claude Code CLI 2.1.280.

The same question at the start of an interactive `claude` in that folder does
take input, and answering "Yes, I trust this folder" there records the trust;
after that, no way out of a seat shows the question again. `.claude.json`
keeps one folder under two keys that differ in the drive letter's case —
`c:/…`, which the editor's sessions write, and `C:/…`, which a terminal
writes — and a trust recorded under one is not read under the other.

Workaround: run `claude` in the repository root once and answer "Yes, I trust
this folder". `tanto` prints that advice in one line when `.claude.json` does
not record the trust under the root as it resolved it (the
bg-seat-ergonomics design, 4.3). The fix is upstream's, and a report to
anthropics/claude-code is the human's to make.

Low because the seat keeps running whatever the question does, and the
workaround is one command.

Related: issue-fd4b (a `--bg` worktree spawn stuck on a startup dialog, the
seat-side neighbor of this one).
```

- [ ] **Step 6: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 2
```

Expected: `task 2: verify clean`.

- [ ] **Step 7: Lint and commit, then restore the new file's line endings**

```bash
git add docs/issues/open/b7e1-the-agent-views-folder-trust-question-after-a-detach-takes-no-input.md
./scripts/lint.sh skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js docs/issues/open/b7e1-the-agent-views-folder-trust-question-after-a-detach-takes-no-input.md
git commit --only skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js docs/issues/open/b7e1-the-agent-views-folder-trust-question-after-a-detach-takes-no-input.md -m "feat: tanto prints the leave line, resumes a Kanri that left the listing, and hints at an unrecorded folder trust" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git checkout -- docs/issues/open/b7e1-the-agent-views-folder-trust-question-after-a-detach-takes-no-input.md
```

Expected: lint passes with no file changed; one commit; the checkout
rewrites the created file with the repository's own line endings, which a
file created on this host does not have until then.

### Task 3 — `boundary.js census`, and an `S-n` row written to the header it finds

Spec 2.2, 3.5, and 6.5 (`scripts/boundary.js`).

**Files:**

- Modify: `skills/tanto/scripts/boundary.js`
- Test: `skills/tanto/scripts/boundary.test.js`

**Interfaces:**

- Consumes: nothing from another task. The CLI seam is the one
  `spawner.js` and `tanto.js` already use: `TANTO_CLAUDE_NODE` names a Node
  script run in the CLI's place, else `TANTO_CLAUDE`, else `claude`.
- Produces: `node "$TANTO/scripts/boundary.js" census [--root <dir>] [--roster <path>]`,
  read-only, printing `## Listed`, `## Not listed`, `## No session id`, and
  `## Not held` in that order, each followed by one line per entry or by
  `none`; exit 0 on a listing read, 1 with the one line
  `census: unavailable — <reason>`, 2 on a usage error or a roster it cannot
  read. The entry lines are
  `<role> <topic> <roster name> — <sessionId> — listed as <name> (<kind>)[ — renamed]`,
  `<role> <topic> <roster name> — <sessionId>`, `<role> <topic> <roster name>`,
  and `<name> (<kind>) — <sessionId>[ — row <status>]`. `record --s-item`
  writes six cells to a six-column table and seven, `t2` in the retired
  column, to a table that still has it. The usage line is
  `usage: boundary.js check|record|census <options>`.

**Named-mechanism sites.** The census's four headings and its entry lines
are named by `roles/kanri.md` (Task 8) and `SKILL.md` (Task 10); the usage
line by the consistency note's check 16 (Task 7). The six-column `S-n`
header is the templates' (Task 12) and check 6's (Task 7).

**O3.1** `"pending", "t2", "no"` — the `S-n` writer's fixed seven cells (spec's Old values, `scripts/boundary.js` 405); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O3.2** `usage: boundary.js check|record <` — the usage line that names two subcommands; before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P3.3 and P3.4. The census tests run a fake
`claude` written here, which prints a fixed listing, fails, or prints no
JSON, and records its arguments; the roster is a fixture written here, so
that every row's Status and Transcript are known. The retired column's name
is joined from two parts in the test, as check 7 of the consistency note
spells every retired string.

**P3.3** `skills/tanto/scripts/boundary.test.js` — replace exactly these 6 lines

```js
test("an unknown subcommand exits 2 and names the two that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record/);
});
```

**P3.3 →**

```js
test("an unknown subcommand exits 2 and names the three that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record\|census/);
});
```

**P3.4** `skills/tanto/scripts/boundary.test.js` — replace exactly these 3 lines

```js
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /--ledger .* is not on disk/);
});
```

**P3.4 →**

```js
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /--ledger .* is not on disk/);
});

// The two shapes of a proposal items table: the six columns the templates
// carry, and the seven a ledger opened before the retired column went keeps.
const RETIRED = ["Stag", "e"].join("");

function itemsLedger(columns) {
  const dir = tmpDir();
  const body = [
    "# Conductor ledger — t",
    "",
    "## Shoroku proposal items",
    "",
    `| ${columns.join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    `| (no item yet) |${" |".repeat(columns.length - 1)}`,
    "",
    "## Session events",
    "",
  ].join("\n");
  return { dir, ledger: write(dir, "kanri.md", body) };
}

test("an S-n row takes the columns its table's header names, six or seven", () => {
  const six = ["S-n", "Source", "Item", "Destination", "Adopted", "Written"];
  const seven = ["S-n", "Source", "Item", "Destination", "Adopted", RETIRED, "Written"];
  const cases = [
    [six, "| S-1 | report.md item 1 | an item |  | pending | no |"],
    [seven, "| S-1 | report.md item 1 | an item |  | pending | t2 | no |"],
  ];
  for (const [columns, expected] of cases) {
    const f = itemsLedger(columns);
    const result = run(["record", "--ledger", f.ledger, "--s-item", "report.md item 1 | an item"], f.dir);
    assert.strictEqual(result.code, 0, result.err);
    const ledger = fs.readFileSync(f.ledger, "utf8");
    assert.ok(ledger.includes(expected), ledger);
    assert.ok(!ledger.includes("(no item yet)"), ledger);
  }
});

// `census`: a fake `claude` that prints a fixed listing, fails, or prints no
// JSON, and records the arguments it was given.
const CENSUS_FAKE = [
  'const fs = require("node:fs");',
  "fs.writeFileSync(process.env.FAKE_ARGS, JSON.stringify(process.argv.slice(2)));",
  'if (process.env.FAKE_MODE === "fail") {',
  '  process.stderr.write("listing broke\\n");',
  "  process.exit(1);",
  "}",
  'if (process.env.FAKE_MODE === "garbage") {',
  '  process.stdout.write("not json");',
  "  process.exit(0);",
  "}",
  'process.stdout.write(fs.readFileSync(process.env.FAKE_LISTING, "utf8"));',
].join("\n");

const SESSIONS_HEAD = [
  "| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
];

function sessionRow(role, topic, name, status, transcript) {
  return `| ${role} | ${topic} | ${name} | /repo | sonnet | high | main | auto | 2026-09-23 10:00 | ${status} | ${transcript} |`;
}

/** A root with a roster of `rows`, and a listing `sessionsOf(root, dir)` returns. */
function censusFixture(rows, sessionsOf) {
  const dir = tmpDir();
  const root = path.join(dir, "repo");
  fs.mkdirSync(path.join(root, ".tanto"), { recursive: true });
  const roster = write(
    path.join(root, ".tanto"),
    "roster.md",
    ["# tanto roster", "", ...SESSIONS_HEAD, ...rows, ""].join("\n"),
  );
  const listing = write(dir, "listing.json", JSON.stringify({ sessions: sessionsOf(root, dir) }));
  const fake = write(dir, "fake-claude.js", CENSUS_FAKE);
  return { dir, root, roster, listing, fake, args: path.join(dir, "fake-args.json") };
}

function census(f, mode, args = ["--root", f.root, "--roster", f.roster]) {
  const result = spawnSync(process.execPath, [SCRIPT, "census", ...args], {
    encoding: "utf8",
    cwd: f.dir,
    env: { ...process.env, TANTO_CLAUDE_NODE: f.fake, FAKE_LISTING: f.listing, FAKE_ARGS: f.args, FAKE_MODE: mode },
  });
  return { code: result.status, out: (result.stdout || "").replace(/\r\n/g, "\n"), err: result.stderr || "" };
}

const KANRI_ROW = sessionRow("kanri", "—", "kanri-a [aaaaaa]", "live", "/home/u/.claude/projects/p/sess-kanri.jsonl");

test("census prints the live and queued rows under its four headings, by its own path comparison", () => {
  const f = censusFixture(
    [
      KANRI_ROW,
      sessionRow(
        "sekkei",
        "t",
        "sekkei-b [bbbbbb]",
        "live (idle since 10:00)",
        "/home/u/.claude/projects/p/sess-sekkei.jsonl",
      ),
      sessionRow("hosa", "—", "hosa-c [cccccc]", "live", "/home/u/.claude/projects/p/sess-hosa.jsonl"),
      sessionRow("kikaku", "—", "kikaku-d [dddddd]", "live", "unavailable"),
      sessionRow("jisso", "t", "jisso-e", "stopped", "/home/u/.claude/projects/p/sess-old.jsonl"),
      sessionRow("jisso", "t", "jisso-f", "queued", "C:\\Users\\u\\.claude\\projects\\p\\sess-queued.jsonl"),
    ],
    (root, dir) => [
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root },
      { sessionId: "sess-sekkei", name: "dotskills-4d", kind: "interactive", cwd: path.join(root, "sub") },
      { sessionId: "sess-queued", name: "jisso-f", kind: "background", cwd: root },
      { sessionId: "sess-old", name: "old-seat", kind: "background", cwd: root },
      { sessionId: "sess-human", name: "human-own", kind: "interactive", cwd: root },
      { sessionId: "sess-other", name: "other-repo", kind: "background", cwd: path.join(dir, "other") },
      { sessionId: "sess-sibling", name: "sibling", kind: "background", cwd: `${root}-two` },
    ],
  );
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.strictEqual(
    result.out,
    [
      "",
      "## Listed",
      "",
      "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background)",
      "sekkei t sekkei-b [bbbbbb] — sess-sekkei — listed as dotskills-4d (interactive) — renamed",
      "jisso t jisso-f — sess-queued — listed as jisso-f (background)",
      "",
      "## Not listed",
      "",
      "hosa — hosa-c [cccccc] — sess-hosa",
      "",
      "## No session id",
      "",
      "kikaku — kikaku-d [dddddd]",
      "",
      "## Not held",
      "",
      "old-seat (background) — sess-old — row stopped",
      "human-own (interactive) — sess-human",
      "",
    ].join("\n"),
  );
  // The unfiltered listing: the census keeps what is under the root itself.
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(f.args, "utf8")), ["agents", "--json"]);
});

test("census prints none under a heading with no entry, and writes nothing", () => {
  const f = censusFixture([KANRI_ROW], (root) => [
    { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root },
  ]);
  const before = fs.readFileSync(f.roster, "utf8");
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  for (const heading of ["Not listed", "No session id", "Not held"]) {
    assert.ok(result.out.includes(`## ${heading}\n\nnone\n`), result.out);
  }
  assert.strictEqual(fs.readFileSync(f.roster, "utf8"), before);
});

test("census exits 1 with one line on a failed or non-JSON listing, and 2 on a usage error or an unreadable roster", () => {
  const f = censusFixture([KANRI_ROW], () => []);
  const failed = census(f, "fail");
  assert.strictEqual(failed.code, 1);
  assert.strictEqual(failed.out, "census: unavailable — listing broke\n");
  const garbage = census(f, "garbage");
  assert.strictEqual(garbage.code, 1);
  assert.match(garbage.out, /^census: unavailable — .+\n$/);
  assert.strictEqual(census(f, "", ["--root", f.root, "--roster", path.join(f.dir, "gone.md")]).code, 2);
  assert.strictEqual(census(f, "", ["--root"]).code, 2);
});

test("census places a session whose cwd spells the root's drive letter in the other case", {
  skip: process.platform !== "win32",
}, () => {
  const f = censusFixture([KANRI_ROW], (root) => {
    const letter = root[0] === root[0].toUpperCase() ? root[0].toLowerCase() : root[0].toUpperCase();
    return [{ sessionId: "sess-kanri", name: "kanri-a", kind: "interactive", cwd: letter + root.slice(1) }];
  });
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.ok(result.out.includes("kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (interactive)"), result.out);
});
```

- [ ] **Step 2: Run the tests to see them fail**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — `census` is an unknown subcommand, and the six-column
table gets a seven-cell row.

- [ ] **Step 3: Implement**

Apply P3.5 to P3.8.

**P3.5** `skills/tanto/scripts/boundary.js` — replace exactly these 6 lines

```js
// tanto's boundary instrument, beside `passage-check.js` and `reading.js`.
// Two subcommands: `check`, which runs the boundary's read-only commands and
// prints their output under fixed headings, and `record`, which writes the
// ledger's and the roster's rows. Run by the `boundary.verify` kind from
// `templates/boundary-brief.md`, and, under the design's shape 2, by a
// headless session running the same brief. It judges nothing.
```

**P3.5 →**

```js
// tanto's boundary instrument, beside `passage-check.js` and `reading.js`.
// Three subcommands: `check`, which runs the boundary's read-only commands
// and prints their output under fixed headings, and `record`, which writes
// the ledger's and the roster's rows — both run by the `boundary.verify` kind
// from `templates/boundary-brief.md`, and, under the design's shape 2, by a
// headless session running the same brief — and `census`, which Kanri runs
// itself: the roster's `live` and `queued` rows against the CLI's listing of
// the sessions under the root, read-only. It judges nothing.
```

**P3.6** `skills/tanto/scripts/boundary.js` — replace exactly these 5 lines

```js
/**
 * One `S-n` row, numbered from the table's highest existing `S-n`, so that a
 * `pending` row a Kanri exit wrote there since the last boundary is counted
 * and not overwritten. A row with the same Source and Item is already there.
 */
```

**P3.6 →**

```js
/**
 * The seventh column of an `S-n` table, which a ledger or a roster opened
 * before it was retired keeps (spec 3.5). Spelled with one bracketed
 * character, as the consistency note's check 7 spells every retired string.
 */
const RETIRED_COLUMN = /^Stag[e]$/;

/** An `S-n` row's cells, one per column the table's own header names. */
function sItemCells(header, number, source, text) {
  const byColumn = {
    "S-n": `S-${number}`,
    Source: source,
    Item: text,
    Destination: "",
    Adopted: "pending",
    Written: "no",
  };
  return header.map((column) => {
    if (Object.hasOwn(byColumn, column)) return byColumn[column];
    return RETIRED_COLUMN.test(column) ? "t2" : "";
  });
}

/**
 * One `S-n` row, numbered from the table's highest existing `S-n`, so that a
 * `pending` row a Kanri exit wrote there since the last boundary is counted
 * and not overwritten, and written by the header it finds: six cells, or
 * seven with `t2` in the retired column, nothing migrated. A row with the
 * same Source and Item is already there.
 */
```

**P3.7** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
  const line = row([`S-${highest + 1}`, source, text, "", "pending", "t2", "no"]);
```

**P3.7 →**

```js
  const line = row(sItemCells(cells(doc.lines[table.header]), highest + 1, source, text));
```

**P3.8** `skills/tanto/scripts/boundary.js` — replace exactly these 6 lines

```js
function main(argv) {
  const sub = argv[0];
  if (sub === "check") return cmdCheck(argv.slice(1));
  if (sub === "record") return cmdRecord(argv.slice(1));
  return fail("usage: boundary.js check|record <options>", 2);
}
```

**P3.8 →**

```js
/** The CLI, as a command: the seam `spawner.js` and `tanto.js` use. */
function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || "claude", args };
}

/** A path with its separators unified, no trailing one, and, on Windows, its case folded. */
function comparablePath(p) {
  const unified = String(p).replace(/\\/g, "/").replace(/\/+$/, "");
  return process.platform === "win32" ? unified.toLowerCase() : unified;
}

/**
 * Whether a listed cwd is the root or a path under it. The census compares
 * the paths itself rather than pass `--cwd`: the CLI's filter is measured for
 * the root alone, and a subdirectory and the drive letter's two spellings are
 * settled here (spec 2.2).
 */
function underRoot(root, cwd) {
  if (!cwd) return false;
  const base = comparablePath(root);
  const here = comparablePath(cwd);
  return here === base || here.startsWith(`${base}/`);
}

/** A Transcript cell's `sessionId` — its basename without `.jsonl` — or null for `unavailable`. */
function sessionIdOf(transcript) {
  const cell = String(transcript || "").trim();
  if (cell === "" || cell === "unavailable") return null;
  return cell
    .split(/[\\/]/)
    .pop()
    .replace(/\.jsonl$/, "");
}

/** The four headings `census` prints, in order. */
const CENSUS_HEADINGS = ["Listed", "Not listed", "No session id", "Not held"];

/**
 * `census [--root <dir>] [--roster <path>]` (spec 2.2): the roster's `live`
 * and `queued` rows against `claude agents --json`'s sessions under the root.
 * Read-only — Kanri, the roster's one writer, acts on what it prints.
 */
function cmdCensus(argv) {
  const values = parseArgs(argv);
  for (const name of ["root", "roster"]) {
    if (values[name] === true) return fail(`census: --${name} needs a value`, 2);
  }
  const root = path.resolve(given(values, "root") || process.cwd());
  const rosterPath = given(values, "roster") || path.join(root, ".tanto", "roster.md");
  let lines;
  try {
    lines = fs.readFileSync(rosterPath, "utf8").split(/\r?\n/);
  } catch {
    return fail(`census: cannot read the roster at ${rosterPath}`, 2);
  }
  const table = tableByHeader(lines, SESSIONS_HEADER);
  if (!table) return fail(`census: no sessions table in ${rosterPath}`, 2);

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
  const listed = new Map(all.filter((s) => s?.sessionId && underRoot(root, s.cwd)).map((s) => [s.sessionId, s]));

  const out = { Listed: [], "Not listed": [], "No session id": [], "Not held": [] };
  const held = new Set();
  const others = new Map();
  for (let i = table.first; i < table.end; i++) {
    const row = cells(lines[i]);
    if (row.length < 11) continue;
    const [role, topic, name] = row;
    const status = row[9].split(/\s+/)[0];
    const sessionId = sessionIdOf(row[10]);
    if (status !== "live" && status !== "queued") {
      if (sessionId) others.set(sessionId, status);
      continue;
    }
    if (!sessionId) {
      out["No session id"].push(`${role} ${topic} ${name}`);
      continue;
    }
    held.add(sessionId);
    const session = listed.get(sessionId);
    if (!session) {
      out["Not listed"].push(`${role} ${topic} ${name} — ${sessionId}`);
      continue;
    }
    const bare = name.replace(/\s*\[[^\]]*\]$/, "");
    const renamed = session.name && session.name !== bare ? " — renamed" : "";
    out.Listed.push(`${role} ${topic} ${name} — ${sessionId} — listed as ${session.name} (${session.kind})${renamed}`);
  }
  for (const [sessionId, session] of listed) {
    if (held.has(sessionId)) continue;
    const other = others.has(sessionId) ? ` — row ${others.get(sessionId)}` : "";
    out["Not held"].push(`${session.name} (${session.kind}) — ${sessionId}${other}`);
  }
  for (const heading of CENSUS_HEADINGS) {
    console.log(`\n## ${heading}\n`);
    console.log(out[heading].length > 0 ? out[heading].join("\n") : "none");
  }
  return 0;
}

function main(argv) {
  const sub = argv[0];
  if (sub === "check") return cmdCheck(argv.slice(1));
  if (sub === "record") return cmdRecord(argv.slice(1));
  if (sub === "census") return cmdCensus(argv.slice(1));
  return fail("usage: boundary.js check|record|census <options>", 2);
}
```

- [ ] **Step 4: Run the tests to see them pass**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: PASS, every test; on a host that is not Windows the drive-letter
test is reported as skipped.

- [ ] **Step 5: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 3
```

Expected: `task 3: verify clean`.

- [ ] **Step 6: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
git commit --only skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js -m "feat: boundary.js census, and S-n rows written to the header they find" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 4 — Measure the spawn, the write, the stop, and the resume against the real CLI, through the working-tree spawner

Spec, "What the plan must contain" (the measurement task) and "Verification";
the facts it re-measures through this plan's own code are Measured 4 and 7.
This task is a **sweep-and-check**: its deliverable is the recorded report,
not a file of the tree, and it commits nothing.

**Files:**

- Create (untracked): `.tanto/bg-seat-ergonomics/measurement-report.md`, with
  the two sections `boundary.js check --measurement` reads, `## Tasks` and
  `## Verification`
- Read: `skills/tanto/scripts/spawner.js` as Task 1 left it, run from this
  working tree

**Interfaces:**

- Consumes: Task 1's spawner — `--name` and `--settings` on a spawn, a
  flag-less resume whose stderr note it logs as
  `resume <sessionId>: <note>`, and the request and result files of
  `templates/spawn-request.md`; `scripts/tanto.js down <root>`, which stops a
  spawner and nothing else.
- Produces: the report, whose effort line Task 5's resume sentence cites.

**The rules of this measurement.** Every act on a seat is a request file
written to the scratch clone's spawner; no session issues `claude --bg`,
`claude stop`, or `claude rm` itself (decision-1ea3). The spawner is the one
in this working tree, started on the clone, never the resident one this run
is using. The seat runs on sonnet, since haiku has no auto mode (spec,
Measured 4). One line reaches the seat after its resume, sent with
`SendMessage` to its bare name, as the dialogue's measurement did; that is
the only message this task sends to anyone but Kanri. A step that does not
go as written is recorded in the report as it happened — a measurement that
contradicts its expectation is a result, not a failure to hide — and the
task goes on with the clean-up.

- [ ] **Step 1: Make the scratch clone and start its spawner**

```text
M="$(node -p 'require("os").tmpdir()')/bg-seat-measure"
git clone --quiet "$(git rev-parse --show-toplevel)" "$M"
node skills/tanto/scripts/spawner.js run --root "$M"
```

Run the last line as a background process (the Bash tool's
`run_in_background`), since it is a resident; then check that
`"$M/.tanto/spawner/pid"` exists. Expected: the clone exists, its root
basename is `bg-seat-measure`, and the pidfile holds one number.

- [ ] **Step 2: Spawn one seat by a request file**

Write the request atomically — to `<id>.json.tmp`, then renamed — at
`"$M/.tanto/spawner/requests/2026-09-23T00-00-01-spawn.json"`:

```json
{
  "op": "spawn",
  "role": "jisso",
  "topic": "measure",
  "model": "sonnet",
  "effort": "high",
  "branch": "main",
  "mode": "auto",
  "prompt": "Write the word one to the file measure-1.txt in the current directory, run git status --short, and then wait for the next message."
}
```

Wait for `"$M/.tanto/spawner/results/2026-09-23T00-00-01-spawn.json"`.
Expected: no `error`; `name` matches `^bg-seat-measure-jisso-measure-[0-9a-f]{4}$`
(spec 1.1); `cwd` is the clone's root. Record the result's `id`,
`sessionId`, and `name`.

- [ ] **Step 3: Check the first write**

Poll until `"$M/measure-1.txt"` exists or two minutes pass, then run, read-only:

```text
git -C "$M" worktree list
claude agents --json
```

Expected: `measure-1.txt` in the clone's root; `git worktree list` one line,
the clone itself; the listing's entry for the recorded `sessionId` with its
`cwd` the clone's root and its `name` unchanged. No `.claude/worktrees/`
directory under the clone. Record `"$M/.tanto/spawner/seats.json"`'s entry:
its status `running` or `blocked`, and no `strayed`.

- [ ] **Step 4: Stop the seat, then resume it, by request files**

Write `"$M/.tanto/spawner/requests/2026-09-23T00-00-02-stop.json"` holding
`{"op": "stop", "role": "jisso", "topic": "measure", "sessionId": "<the recorded sessionId>"}`
and wait for its result; then
`"$M/.tanto/spawner/requests/2026-09-23T00-00-03-resume.json"` holding
`{"op": "resume", "role": "jisso", "topic": "measure", "sessionId": "<the recorded sessionId>"}`
and wait for its result. Expected: the stop's result carries `stopped`; the
resume's result carries the same `sessionId` and the same `name`; the
spawner's log, `"$M/.tanto/spawner/log"`, carries the line
`resume <sessionId>: note: woke session <id> with its saved options (…)`,
and the options it lists include `--effort` beside `--name`, `--settings`,
`--model`, and `--permission-mode`. Record the note verbatim.

- [ ] **Step 5: Check the second write**

Send the seat's bare name the one line
`Write the word two to the file measure-2.txt in the current directory, then stop.`
Poll until `"$M/measure-2.txt"` exists or two minutes pass, then run the two
commands of Step 3 again. Expected: `measure-2.txt` in the clone's root; one
worktree; the listed `cwd` the clone's root, and the name and the
`sessionId` unchanged.

- [ ] **Step 6: Clean up**

Write a `stop` request and then an `rm` request for the same `sessionId`,
each waited for, then stop the clone's spawner:

```text
node skills/tanto/scripts/tanto.js down "$M"
claude agents --json
```

Expected: `tanto down` prints `tanto down: spawner stopped; the conversations are kept`;
the listing no longer carries the recorded `sessionId`. The clone may stay
in the temp directory.

- [ ] **Step 7: Write the report**

Write `.tanto/bg-seat-ergonomics/measurement-report.md` — untracked, under
`.tanto/.gitignore` — with a first line naming the CLI's version
(`claude --version`) and the date, then:

- `## Tasks` — each of Steps 1 to 6 as one numbered item: what was run, the
  file each request was written to, and what came back, the IDs and the
  resume note verbatim.
- `## Verification` — one line per expectation above, each ending `holds`,
  `does not hold — <what happened>`, or `not reached — <why>`: the name's
  shape; the first write in the root with no worktree; the `sessionId` and
  the name kept across the stop and the resume; the effort among the saved
  options the resume note lists; the second write in the root; nothing left
  listed after the clean-up.

The commands of this task sit in `text` fences, not `bash` ones, on purpose:
`replay` runs every `bash` fence of a plan in its scratch tree, and these
start a resident spawner and act on the real CLI.

There is no Verify step: the task carries no passage, and
`passage-check.js verify --task 4` would print `task 4: no passages`. The
report is the deliverable, and the boundary reads its two sections.

### Task 5 — The request schema says what the spawner adds, what a resume keeps, and where a guard stop at a pass is recorded

Spec 1.5 and 6.4 (`templates/spawn-request.md`). A template a session reads
once, so it may land before the role files (contract rule 11).

**Stop condition.** This task's resume sentence says the CLI's note lists
the effort among the options a flag-less resume brings back. If Task 4's
report says that line `does not hold`, or `not reached`, apply nothing here
and put the sentence to Kanri as a ruling: the text must say what was
measured.

**Files:**

- Modify: `skills/tanto/templates/spawn-request.md`

**Named-mechanism sites.** The `strayed` mark and the toast are Task 1's
(`scripts/spawner.js`), and are named again by `roles/kanri.md`'s Replace
table (Task 8), `SKILL.md`'s `stopped` (Task 10), and `templates/roster.md`
(Task 12). The name's shape is also the README's (Task 6).

**O5.1** `guard, which also records the seat as` — the schema's sentence that names the first-sighting stop alone (spec's Old values, `templates/spawn-request.md` 72–74); before: 1 in `skills/tanto/templates/spawn-request.md`, after: 0.
- [ ] **Step 1: Apply the passages**

Apply P5.2 and P5.3.

**P5.2** `skills/tanto/templates/spawn-request.md` — replace exactly these 2 lines

```markdown
- `addDir` — a list of directories, shoki's being the repository root, so
  that the scribe in its worktree can read `.tanto/`. Absent otherwise.
```

**P5.2 →**

```markdown
- `addDir` — a list of directories, shoki's being the repository root, so
  that the scribe in its worktree can read `.tanto/`. Absent otherwise.
- No field carries the seat's name or its settings: the spawner adds both
  to every spawn itself — `--name <repo>-<role>[-<topic>]-<hex>`, from the
  root's basename, `role`, and `topic`, and
  `--settings '{"worktree":{"bgIsolation":"none"}}'`, which turns the CLI's
  background isolation off for that seat alone — so a request carries
  neither. A `resume` passes no flag at all: the CLI brings back the options
  the spawn passed, as its note on the resume, which the spawner logs, lists
  them — measured for the name, the setting, the model, the effort, and the
  permission mode.
```

**P5.3** `skills/tanto/templates/spawn-request.md` — replace exactly these 8 lines

```markdown
A result carries the request's fields and the op's own: `spawn` adds `id`,
`sessionId`, `name`, `cwd`, `transcript`, and `startedAt`; `stop` adds
`stopped`; `rm` adds `removed` and the worktree it removed; `resume` adds the
new `id` and `name` under the same `sessionId`; `attention` adds `notified`
and `channel`; `ack` adds `acked`. An op that failed adds `error`, which
carries the command's stderr, and nothing else — except `spawn`'s ad
hoc-worktree guard, which also records the seat as `stopped` before
returning `error`.
```

**P5.3 →**

```markdown
A result carries the request's fields and the op's own: `spawn` adds `id`,
`sessionId`, `name` — the seat's name from its spawn, as the listing's first
sighting carries it — `cwd`, `transcript`, and `startedAt`; `stop` adds
`stopped`; `rm` adds `removed` and the worktree it removed; `resume` adds
the `id` and the `name` under the same `sessionId`, the name the one the
spawn gave; `attention` adds `notified` and `channel`; `ack` adds `acked`.
An op that failed adds `error`, which carries the command's stderr, and
nothing else — except the ad hoc-worktree guard at a spawn's first
sighting, which also records the seat as `stopped`, with `strayed: <cwd>`,
before returning `error`. The same guard at a pass of the spawner's census
writes no result file at all: `strayed: <cwd>` beside the seat's `stopped`
in `seats.json`, the log line, and the toast
`strayed: <role> <topic> <name> — <cwd>` carry it.
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 5
```

Expected: `task 5: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/templates/spawn-request.md
git commit --only skills/tanto/templates/spawn-request.md -m "docs: the spawn request schema names what the spawner adds and where a guard stop is recorded" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 6 — The README says what the spawner passes, how to leave a seat, and what a restart asks of the human

Spec 4.4 and 6.6, as short as D-8 asks: the additions 4.4 names and nothing
else — nothing about the trust question, which the launcher's hint carries.

**Files:**

- Modify: `skills/tanto/README.md`

**Named-mechanism sites.** The resume rule's one sentence is also Task 2's
(`scripts/tanto.js`) and `SKILL.md`'s Resuming (Task 10); the leave line is
Task 2's; the seat name's shape is Task 1's; `census` is Task 3's and is
named by `SKILL.md`'s scripts paragraph (Task 10).

**O6.1** `Claude Code CLI 2.1.277 or newer` — the CLI floor (spec's Old values, `README.md` 75); before: 1 in `skills/tanto/README.md`, after: 0.

**O6.2** `drops back to the` — "`←` returns to the agent view and `Ctrl+Z` drops back to the shell; the session keeps running either way." (`README.md` 127–128); before: 1 in `skills/tanto/README.md`, after: 0.

**O6.3** `stopped seat is not resumed, and the next` — "a stopped seat is not resumed, and the next `tanto` starts a fresh Kanri" (`README.md` 133); before: 1 in `skills/tanto/README.md`, after: 0 — a Kanri the human `/stop`ped is resumed.

**O6.4** `typed there,` — "and `/tanto fukki` (復帰), typed there, matches it to its roster row" (`README.md` 153–155); before: 1 in `skills/tanto/README.md`, after: 0 — nothing is typed in a tab after a restart.

- [ ] **Step 1: Apply the passages**

Apply P6.5 to P6.9.

**P6.5** `skills/tanto/README.md` — replace exactly these 4 lines

```markdown
- **Claude Code CLI 2.1.277 or newer**, for `claude --bg`,
  `claude agents --json`, `claude attach`, `claude --resume <id> --bg`,
  `claude stop`, and `claude rm` — the six commands the spawner and the
  launcher are built on.
```

**P6.5 →**

```markdown
- **Claude Code CLI 2.1.280 or newer**, for `claude --bg`,
  `claude agents --json`, `claude attach`, `claude --resume <id> --bg`,
  `claude stop`, and `claude rm` — the six commands the spawner and the
  launcher are built on. The spawner names each background seat and passes
  it `--settings '{"worktree":{"bgIsolation":"none"}}'` — the CLI's
  `worktree.bgIsolation`, `worktree` by default and undocumented upstream
  (anthropics/claude-code#59580) — because the seats share one checkout that
  the default would move them out of; a managed policy that forces
  `worktree` wins over the flag, and no settings file is written.
```

**P6.6** `skills/tanto/README.md` — replace exactly these 7 lines

```markdown
`←` returns to the agent view and `Ctrl+Z` drops back to the shell; the
session keeps running either way. `tanto` is also the way back after a
restart, and it is idempotent: run twice, it starts nothing twice. Without
`PATH`, `node <skill>/scripts/tanto.js` does the same. `tanto down` stops
the spawner and keeps every conversation; `tanto down --seats` stops the
seats too, which retires the run — the conversations are kept, but a
stopped seat is not resumed, and the next `tanto` starts a fresh Kanri.
```

**P6.6 →**

```markdown
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
stopped is not resumed.
```

**P6.7** `skills/tanto/README.md` — replace exactly these 3 lines

```markdown
A tab that comes back after an editor restart keeps its context and its
transcript but gets a new name, and `/tanto fukki` (復帰), typed there,
matches it to its roster row and rejoins it to the run. A terminal seat is
```

**P6.7 →**

```markdown
A tab that comes back after an editor restart keeps its context and its
transcript and gets a new name, which Kanri matches to its roster row by its
session id; nothing is typed there. A terminal seat is
```

**P6.8** `skills/tanto/README.md` — replace exactly these 5 lines

```markdown
- `scripts/boundary.js` — the boundary's own instrument, run by the subagent
  Kanri dispatches there: `check`, which runs the boundary's read-only
  commands and prints their output under fixed headings, and `record`, which
  writes the conductor ledger's and the roster's rows idempotently, with
  `scripts/boundary.test.js` beside it.
```

**P6.8 →**

```markdown
- `scripts/boundary.js` — the boundary's own instrument, run by the subagent
  Kanri dispatches there: `check`, which runs the boundary's read-only
  commands and prints their output under fixed headings, and `record`, which
  writes the conductor ledger's and the roster's rows idempotently; and
  `census`, which Kanri runs itself, read-only, to place the roster's rows
  against the sessions `claude agents --json` lists under the repository.
  `scripts/boundary.test.js` beside it.
```

**P6.9** `skills/tanto/README.md` — replace exactly these 2 lines

```markdown
`docs/superpowers/specs/2026-09-19-tanto-diet-design.md`, and
`docs/superpowers/specs/2026-09-20-tanto-bg-seats-design.md`.
```

**P6.9 →**

```markdown
`docs/superpowers/specs/2026-09-19-tanto-diet-design.md`,
`docs/superpowers/specs/2026-09-20-tanto-bg-seats-design.md`, and
`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`.
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 6
```

Expected: `task 6: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/README.md
git commit --only skills/tanto/README.md -m "docs: the tanto README on the seat's name and settings, leaving a seat, and a restart" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 7 — The consistency note's checks follow the strings this plan changes

Spec 6.7: check 6 (the proposal-pattern counts, the `S-n` header, the
retired `cleared:` Events shape, and the `exit proposal:` loop), check 7 (the
retired strings join the strings that must be absent), check 16 (the usage
line names `census`), check 20, and check 24 — its heading's "stage word"
gone, and its fourth grep, which has read `0` against its expected `1` since
`tanto-bg-seats` retired Hosa's `close:` line (decision-26fd superseding
decision-a1ae), re-pinned to Jisso's new `close:` line of spec 3.3 in the
three files that send or receive it, at the count the landed text has, as
check 21 asks of a named mechanism. Check 25's two pointers into
`roles/kanri.md` follow the renamed headings.

**When the checks read their new values.** Every value this task pins is the
count the tree has once batch D has landed: the `close:` line is Tasks 9, 11,
and 13's; the proposal pattern, Tasks 9 and 11's; the six-column header and
the recovery Events line, Task 12's; the retired strings of check 7, Tasks 8
to 13's together; `census` in check 16 alone is already true, from Task 3.
The values were measured by applying every passage of this plan to the
branch's files, and the checks are run at batch D's boundary, not at this
batch's.

**Drift this task does not touch.** Run at this branch's base, check 6's
first block already reads differently from its expected list at positions 1
to 7, 15, 16, and 21, and its loop reads `0` for the `chore:` and `slot:`
forms: drift from earlier topics, which no passage here changes, and which
the batch report's Shoroku proposal section records as an item.

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md`

**Named-mechanism sites.** Each check pins a string another task writes: the
`close:` line (Tasks 9, 11, 13), `shoroku-proposal-<role>` (Tasks 9, 11), the
six-column header (Tasks 3, 12), the `recovery:` Events line (Tasks 8, 12),
the usage line (Task 3), and the headings `The four cases` and
`A seat's exit` (Tasks 8, 9).

**O7.1** `Adopted | Stage | Written` — check 6's seven-column header, pinned in two templates; before: 2 in `docs/notes/tanto-consistency-checks.md`, after: 0.

**O7.2** `grep -cF 'cleared: <old name> → <new name>'` — check 6's pin of the retired Events shape; before: 1 in `docs/notes/tanto-consistency-checks.md`, after: 0 — the retired shape is swept by check 7 instead.

**O7.3** `and the stage word that is left` — check 24's heading; before: 1 in `docs/notes/tanto-consistency-checks.md`, after: 0.

**O7.4** `close: <topic> — proposal <path>` — check 24's pin of Hosa's retired `close:` line; before: 1 in `docs/notes/tanto-consistency-checks.md`, after: 0.

**O7.5** `Start → The five cases →` — check 25's pointer; before: 1 in `docs/notes/tanto-consistency-checks.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P7.6 to P7.23, in file order.

**P7.6** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```markdown
grep -cF 'exit-<role>' skills/tanto/SKILL.md
grep -cF 'exit-<role>' skills/tanto/roles/kanri.md
```

**P7.6 →**

```markdown
grep -cF 'shoroku-proposal-<role>' skills/tanto/SKILL.md
grep -cF 'shoroku-proposal-<role>' skills/tanto/roles/kanri.md
```

**P7.7** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```markdown
grep -cF '| S-n | Source | Item | Destination | Adopted | Stage | Written |' skills/tanto/templates/roster.md
grep -cF '| S-n | Source | Item | Destination | Adopted | Stage | Written |' skills/tanto/templates/kanri.md
```

**P7.7 →**

```markdown
grep -cF '| S-n | Source | Item | Destination | Adopted | Written |' skills/tanto/templates/roster.md
grep -cF '| S-n | Source | Item | Destination | Adopted | Written |' skills/tanto/templates/kanri.md
```

**P7.8** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```markdown
grep -cF 'cleared: <old name> → <new name>' skills/tanto/templates/roster.md
```

**P7.8 →**

```markdown
grep -cF 'recovery: begun; recovery: windows back;' skills/tanto/templates/roster.md
```

**P7.9** `docs/notes/tanto-consistency-checks.md` — replace exactly these 3 lines

```markdown
ninth is `2` because
the seat-lineage plan rewrote "Session exit" whole and its new text names
the `exit-<role>[-<suffix>]` pattern twice and no more. The fourth is `4` because
```

**P7.9 →**

```markdown
ninth and the tenth are `2` and `3` because bg-seat-ergonomics named every
proposal file `shoroku-proposal-<role>-<short id>.md`, which the contract
spells in "The files" and in its Artifacts row, and Kanri's role file in "The
four steps" and twice in "A seat's exit". The fourth is `4` because
```

**P7.10** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```markdown
cross-file pairs — the Residency table header, the seven-column `S-n` header,
```

**P7.10 →**

```markdown
cross-file pairs — the Residency table header, the six-column `S-n` header,
```

**P7.11** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```markdown
last two pin the roster's two new Events forms. The
```

**P7.11 →**

```markdown
last two pin two of the roster's Events forms: the recovery window's pair,
which bg-seat-ergonomics added, and the Kikaku decision's. The
```

**P7.12** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```markdown
for s in 'decision: <path>' 'chore: <one line>' 'chore: <what> — <paths> — slot: now | at the next boundary' 'slot-needed: <what> — <paths>' 'slot: now — commit and report' 'slot: at the next boundary' 'paused: <dispatch> on <family> — resets <time>' 'continue: <dispatch> — same model' 'exit proposal: <path> — <reading>' 'spec accepted: <spec path>; exit proposal: <path> — <reading>' 'coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>'; do
```

**P7.12 →**

```markdown
for s in 'decision: <path>' 'chore: <one line>' 'chore: <what> — <paths> — slot: now | at the next boundary' 'slot-needed: <what> — <paths>' 'slot: now — commit and report' 'slot: at the next boundary' 'paused: <dispatch> on <family> — resets <time>' 'continue: <dispatch> — same model' 'shoroku proposal: <path> — <reading>' 'spec accepted: <spec path>; shoroku proposal: <path> — <reading>' 'coldread answered: <pointer, one per question, or none>; shoroku proposal: <path> — <reading>'; do
```

**P7.13** `docs/notes/tanto-consistency-checks.md` — replace exactly these 5 lines

```markdown
`exit proposal: <path> — <reading>`, ends `-> 3`: that form is both the bare
answer line a Jisso, Kaiseki, or Kanri exit sends on its own, and the tail
of each of the two combined report lines that follow it (`spec accepted:
...` and `coldread answered: ...`), so a count of `2` there means one of
those two seats lost its unasked form. These are the contract's copies
```

**P7.13 →**

```markdown
`shoroku proposal: <path> — <reading>`, ends `-> 3`: that form is both the
bare answer line a Jisso, Kaiseki, or Kanri exit sends on its own, and the
tail of each of the two combined report lines that follow it
(`spec accepted: ...` and `coldread answered: ...`), so a count of `2`
there means one of those two seats lost its unasked form. The
`spec accepted:` form read `0` against its expected `1` from the
seat-lineage plan until bg-seat-ergonomics, because the contract wrapped it
across two lines; it is on one line now. These are the contract's copies
```

**P7.14** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```markdown
grep -rnE 'Jisso replacement deferre[d]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
```

**P7.14 →**

```markdown
grep -rnE 'Jisso replacement deferre[d]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rniE 'exit shorok[u]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rniE 'exit proposa[l]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE 'exit: propose your shorok[u]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rniE 'stage wor[d]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE 'Stag[e]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE '\bT[2]\b' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE 't2-(recommendation|brief|direction|revie[w])' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE '— t[2] —' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE 'shoroku-proposal[.]md' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE -- '-2-proposa[l]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE 'exit-kanri-[<]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE 'exit-[<]role>' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE 'exit-(sekkei|keikaku|kaisek[i])' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE 'cleared: [<]old name>' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rnE 'The five case[s]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
grep -rniE 'candidat[e]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates skills/tanto/README.md
```

**P7.15** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```markdown
Expected: no output from the first thirteen, nor from the fifteenth through
the twenty-third, which the seat-lineage plan added (each exits 1). Those
```

**P7.15 →**

```markdown
Expected: no output from the first thirteen, nor from the fifteenth through
the twenty-third, which the seat-lineage plan added, nor from the
twenty-fourth through the thirty-ninth, which the bg-seat-ergonomics plan
added and which sweep the skill's `README.md` as well (each exits 1). Those
```

**P7.16** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```markdown
grep -cF 'scripts/reading.js' skills/tanto/SKILL.md skills/tanto/README.md
```

**P7.16 →**

```markdown
node skills/tanto/scripts/boundary.js 2>&1 | head -n 1
node skills/tanto/scripts/boundary.js 2>&1 | head -n 1 | grep -oE 'check|record|census' | sort -u | wc -l
grep -cF 'scripts/reading.js' skills/tanto/SKILL.md skills/tanto/README.md
```

**P7.17** `docs/notes/tanto-consistency-checks.md` — replace exactly these 3 lines

```markdown
Expected: the first script's usage line, then `7`; the second script's usage
line, naming **both** its forms on that one line, then `8`; then one
`<path>:<n>` line per file with `<n>` at least `1`. The usage lines are read,
```

**P7.17 →**

```markdown
Expected: the first script's usage line, then `7`; the second script's usage
line, naming **both** its forms on that one line, then `8`; the third's,
`boundary.js: usage: boundary.js check|record|census <options>`, then `3`,
since bg-seat-ergonomics added `census`; then one
`<path>:<n>` line per file with `<n>` at least `1`. The usage lines are read,
```

**P7.18** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```markdown
grep -cF '`exit-keikaku`' skills/tanto/templates/kanri.md
grep -cF '`exit-keikaku`' skills/tanto/SKILL.md
```

**P7.18 →**

```markdown
grep -cE 'exit-keikak[u]' skills/tanto/templates/kanri.md
grep -cE 'exit-keikak[u]' skills/tanto/SKILL.md
```

**P7.19** `docs/notes/tanto-consistency-checks.md` — replace exactly these 10 lines

```markdown
Expected: `1 1`, then `0` on every file of the old enumeration, `0 1`, `1 1`
for the `continue:` spelling, `0` on every template for the `.md` form, `1`,
`1 1`, then `0` on every file for the two spellings of the old cap. The
`exit-keikaku` pair's first count moved from `1` to `0`: Task 4 ("Kanri's
Shoroku section is one stage per topic, and Hosa may hold it") replaced the
ledger template's old concrete Stage-word list —
which spelled out `` `exit-jisso-B` ``, `` `exit-sekkei` ``, `` `exit-keikaku` ``,
and `` `exit-kaiseki-1` `` — with generic wording naming only `t2` and
`exit-<role>[-<suffix>]`; this plan's own Task 10 brief already names that
retirement as expected, not an omission. The five
```

**P7.19 →**

```markdown
Expected: `1 1`, then `0` on every file of the old enumeration, `0 0`, `1 1`
for the `continue:` spelling, `0` on every template for the `.md` form, `1`,
`1 1`, then `0` on every file for the two spellings of the old cap. The
pair of `exit-keikak[u]` counts reads `0 0`: the ledger template's concrete
example list went first, with Task 4 of the plan that made Kanri's Shoroku
section one stage per topic, and the contract's list went when
bg-seat-ergonomics named every proposal file by the step and the writing
session, `shoroku-proposal-<role>-<short id>.md`. The pair is written as a
pattern with one bracketed character, as check 7 writes a retired string,
so that the plan that retired the name finds no literal of it here. The five
```

**P7.20** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```markdown
## 24. The two shoroku kinds, and the stage word that is left
```

**P7.20 →**

```markdown
## 24. The two shoroku kinds, and Jisso's `close:` line
```

**P7.21** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```markdown
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
```

**P7.21 →**

```markdown
grep -cF 'close: propose; write it to .tanto/<topic>/shoroku-proposal-jisso-<short id>.md' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md
```

**P7.22** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```markdown
`1` from the fourth in each of the three files, which pins the `close:` line's
three copies to one spelling, as §21 asks of a named mechanism. `0` from the
```

**P7.22 →**

```markdown
`1` from the fourth in each of the three files, which pins the `close:` line's
three copies to one spelling, as §21 asks of a named mechanism: Jisso's line
at the close, which Kanri's role file sends, Jisso's receives, and the
contract states. The grep pinned Hosa's retired `close:` line until
bg-seat-ergonomics, and read `0` against that expected `1` from
`tanto-bg-seats` on, since decision-26fd superseded decision-a1ae and the
line went. `0` from the
```

**P7.23** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```markdown
`roles/kanri.md`'s Start → The five cases → the Handover case, "no deletion
is asked"; its "Exit shoroku" step 2, "no delete request goes out"; and its
```

**P7.23 →**

```markdown
`roles/kanri.md`'s Start → The four cases → the Handover case, "no deletion
is asked"; its "A seat's exit" step 2, "no delete request goes out"; and its
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 7
```

Expected: `task 7: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh docs/notes/tanto-consistency-checks.md
git commit --only docs/notes/tanto-consistency-checks.md -m "docs: the tanto consistency checks follow bg-seat-ergonomics' strings" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 8 — Kanri's role file keys every match on the `sessionId` and runs the census

Spec 2.1 to 2.8, 1.4 (the guard-stopped seat's row), and 6.2's identity
bullets: Start step 4 and "The four cases" (2.4), "On a handshake" (2.5),
the idle block (2.3, 2.8), a new census paragraph under "Session lifecycle"
(2.1, 2.3, 2.7), the forced-exit paragraph (2.1), the Replace table's first
row (1.4), the Release table's close row (2.3, 3.5), and "Recovery after a
VS Code restart" (2.6). Where one of these lines also carries a renamed
term of section 3, this task makes that change too, so that no line is
edited by two tasks: the idle block's Kaiseki release, the `no-role`
paragraph's Events line, the forced-exit paragraph, and the Replace table's
first row.

**Files:**

- Modify: `skills/tanto/roles/kanri.md`

**Named-mechanism sites.** "The four cases" is pointed at from Start step 4
only (this task). The census, its four headings, and "Not listed" are named
by `SKILL.md`'s Handshake and roster and Session exit (Tasks 10, 11) and by
`scripts/boundary.js` (Task 3). The `recovery: begun` and
`recovery: windows back` Events lines are also `templates/roster.md`'s
(Task 12). `cleared`'s two routes are also `SKILL.md`'s status list
(Task 10) and `templates/roster.md`'s status paragraph (Task 12); `idle
since` as a suffix is also both of those. The guard-stopped seat's
`stopped` is also Task 1's, Task 5's, Task 10's, and Task 12's. "The
spawner's census" is also `SKILL.md`'s (Task 10) and `roles/keikaku.md`'s
(Task 13). The heading `### Exit shoroku` that the forced-exit paragraph
sits under is renamed by Task 9.

**O8.1** `cold-read the roster and compare your own` — Start step 4 comparing names (spec's Old values, `roles/kanri.md` 83–84); before: 1 in `skills/tanto/roles/kanri.md`, after: 0 — the step compares `sessionId`s.

**O8.2** `The five cases` — the heading and its one pointer (`roles/kanri.md` 84 and 132); before: 2 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.3** `still lists it; rewrite the roster` — the Handover case's `ListAgents` clause (`roles/kanri.md` 139); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.4** `another name and not listed` — the Handover case's name-keyed `dead` (`roles/kanri.md` 145–146); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.5** `**Kept Kanri**` — the Kept Kanri case (`roles/kanri.md` 162–164), merged into Yours; before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.6** `**Resumed Kanri**` — the Resumed Kanri case (`roles/kanri.md` 176–178), merged into Yours; before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.7** `data row is another name` — the Second Kanri and Recovery cases keyed on a name (`roles/kanri.md` 171–172, 184–185); before: 3 in `skills/tanto/roles/kanri.md` (the Resumed Kanri case's line 176 is the third), after: 0.

**O8.8** `carries appears in` — handshake step 2's `ListAgents` check (`roles/kanri.md` 200–202); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.9** `equals a row's Transcript column` — the resumed handshake matched by the full path (`roles/kanri.md` 228–229); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.10** `different transcript is that window` — the `/clear`-by-name route to `cleared` (`roles/kanri.md` 237–239; `templates/roster.md` 26–28); before: 1 in `skills/tanto/roles/kanri.md` and 1 in `skills/tanto/templates/roster.md`, after: 0 in `roles/kanri.md` with this task and 0 in `templates/roster.md` with Task 12.

**O8.11** `there the moment a Kikaku` — "write `idle since <HH:MM>` there" (`roles/kanri.md` 531–533); before: 1 in `skills/tanto/roles/kanri.md`, after: 0 — Kanri appends the suffix.

**O8.12** `error or an empty listing` — the forced exit's `dead` on a send error (`roles/kanri.md` 1286–1287); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.13** `the census marked it` — the Replace table's first row naming the spawner's pass "the census" (`roles/kanri.md` 1527); before: 1 in `skills/tanto/roles/kanri.md`, after: 0 — it says "the spawner's census marked it".

**O8.14** `the census lost and no resume brought back` — the Release table's close row (`roles/kanri.md` 1553); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.15** `and then in each tab seat's window` — the restart's `/tanto fukki` in every tab (`roles/kanri.md` 1595–1597); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.16** `lists nor re-handshakes` — `dead` by `ListAgents` and a re-handshake after a restart (`roles/kanri.md` 1597); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O8.17** `and the census would miss it` — "the census" for the spawner's pass in Human access (`roles/kanri.md` 1437); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P8.18 to P8.32, in file order.

**P8.18** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
4. Otherwise cold-read the roster and compare your own `name [ref]` with its
   first data row, then take exactly one case from "The five cases" below.
```

**P8.18 →**

```markdown
4. Otherwise cold-read the roster, run the census
   (`node "$TANTO/scripts/boundary.js" census`, from the repository root;
   "Session lifecycle" says what it prints), and compare your own
   `sessionId`, the basename of your transcript path, with the first data
   row's, the basename of its Transcript column; then take exactly one case
   from "The four cases" below.
```

**P8.19** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
### The five cases
```

**P8.19 →**

```markdown
### The four cases
```

**P8.20** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
`[ref]` are the same and only the transcript differs — or another's, and,
for another's, whether `ListAgents` still lists it; rewrite the roster —
```

**P8.20 →**

```markdown
`[ref]` are the same and only the transcript differs — or another's (the
comparison that decides the Name-column rewrite below, not the row's
identity, which is its `sessionId`), and, for another's, whether the census
lists that row's `sessionId`; rewrite the roster —
```

**P8.21** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
`/clear` — the old Kanri's row `replaced` (or `dead` when it is
another name and not listed), the Residency row reset to your name and today
```

**P8.21 →**

```markdown
`/clear` — the old Kanri's row `replaced` (or `dead` when the census does
not list its `sessionId`), the Residency row reset to your name and today
```

**P8.22** `skills/tanto/roles/kanri.md` — replace exactly these 27 lines

```markdown
**Kept Kanri** — no handover file, the first data row is you, and that row's
Transcript column is this session's own transcript path. This is a
`/tanto kanri` typed by the human in an attached Kanri: continue where the
current ledger's Progress line says, or, if none is open, wait for the human
to say what the next work is and open the topic as step 5 says. The
stale-transcript sub-case is gone with the `/clear`: a terminal seat has
none, and a first row that is you under another transcript can only be a tab
Kanri, which the Handover case above covers.

**Second Kanri** — no handover file, the first data row is another name, and
that session is still listed. Stop, tell the human there is a live Kanri
already, and ask whether that one should hand over or this window should be
`/clear`ed. Write nothing.

**Resumed Kanri** — no handover file, the first data row is another name that
`ListAgents` does not list, and that row's Transcript column is your own
transcript path. This is your own conversation resumed under a new name:
rewrite the first row in place with your new name and `[ref]`, status `live`,
write the Events line `resumed: <old name> → <new name>`, and continue where
the ledger's Progress line says. No row is marked `dead`, and there is no tree
recovery beyond `git status`.

**Recovery** — no handover file, the first data row is another name, that
session is not listed, and its Transcript column is not your own path. Mark
every row whose session is gone `dead`, with an Events line per row saying
whether its exit shoroku ran and what was lost, and run "Recovery after a VS
Code restart" below.
```

**P8.22 →**

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

**Second Kanri** — no handover file, the first data row's `sessionId` is
another's, and the census lists it. Stop, tell the human there is a live
Kanri already, and ask whether that one should hand over or this window
should be `/clear`ed. Write nothing.

**Recovery** — no handover file, the first data row's `sessionId` is
another's, and the census does not list it. Run "Recovery after a VS Code
restart" below, whose census, once the human says the windows are back,
marks `dead` every `live` row it does not list, with an Events line per row
saying whether its shoroku proposal was written and what was lost.
```

**P8.23** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
2. Check the roster and the listing — no live roster row for that role and
   topic, and the
   `name [ref]` the handshake carries appears in `ListAgents`.
```

**P8.23 →**

```markdown
2. Run the census and place the handshake's `sessionId` — the basename of
   its `transcript=` — in it. A `sessionId` the census does not list is not
   a session under this repository and gets no row: `refused`, an Events
   line, one line to the human. `transcript=unavailable` is accepted as
   before; its row carries `unavailable`, and the census leaves it alone.
   Mark `dead` every `live` or `queued` row the census does not list —
   except while a restart is being recovered ("Session lifecycle") — before
   the new row is written, so that a stale row of the same role and topic
   refuses no fresh handshake as a duplicate. Then check that no live
   roster row is left for that role and topic.
```

**P8.24** `skills/tanto/roles/kanri.md` — replace exactly these 18 lines

```markdown
A handshake whose `transcript=` equals a row's Transcript column is that
session resumed under a new name, not a second session: rewrite the row in
place with the new name and `[ref]`, status `live`, write the Events line
`resumed: <old name> → <new name>`, and send nothing but your address. Only
a tab seat reaches this paragraph — a terminal seat sends no handshake, and
its rename is reconciled from `seats.json`'s `renamed` mark instead
("Recovery"). Step
2's one-live-row-per-role check does not refuse it.

A handshake whose name is already on a `live` or `queued` row with a
different transcript is that window `/clear`ed and re-invoked, in any role
— the rule the roster template stated for Kikaku and Hosa, now every
role's. Mark the old row `cleared`: with the Events line an unrun exit
shoroku gets when no `release:` had been sent to it, and, when the old row
was the live Jisso's, after verifying the tree as the Replace table's first
row says, the next queued Jisso then resuming the batch. Write the new row
and answer as for any handshake. Expect nothing about which role a released
window takes next: the same, another, or your own successor.
```

**P8.24 →**

```markdown
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
```

**P8.25** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
`no-role` from a name you sent to means that window was `/clear`ed before
your line arrived: mark its row `cleared`, write the Events line an unrun
exit shoroku gets — what was lost, as far as you know — and treat the exit
as forced; when the row was the live Jisso's, verify the tree first as the
Replace table's first row says, and send the next queued Jisso the resume
prompt.
```

**P8.25 →**

```markdown
`no-role` from a name you sent to means that window was `/clear`ed before
your line arrived: mark its row `cleared`, write the Events line a shoroku
proposal not written gets — what was lost, as far as you know — and treat
the exit as forced; when the row was the live Jisso's, verify the tree
first as the Replace table's first row says, and send the next queued Jisso
the resume prompt. A `no-role` from a row the census has already marked
`dead` changes nothing: whichever of the two sees the `/clear` first sets
the status, and the census marks only `live` and `queued` rows.
```

**P8.26** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```markdown
   `—` for an act that belongs to no topic: the `/clear` of an idle Kikaku
   or Hosa window, your own handover, a quota's return, a Kaiseki's release
   after its exit shoroku, an answer you are waiting on. An item is a
   pointer to the request already made, not a restatement of it. Draw the
   block from files, never from memory: the roster's Status column — write
   `idle since <HH:MM>` there the moment a Kikaku, Hosa, or Kaiseki reports
   to you and goes idle, so that the reminder is not forgotten across a
   wake-up — and each open ledger's `## Open questions for the human`,
```

**P8.26 →**

```markdown
   `—` for an act that belongs to no topic: the `/clear` of an idle Kikaku
   or Hosa window, your own handover, a quota's return, a Kaiseki's release
   after its shoroku proposal, the human's word that the windows are back
   while a restart is being recovered, an answer you are waiting on. An
   item is a pointer to the request already made, not a restatement of it.
   Draw the block from files, never from memory: the roster's Status column
   — append `(idle since <HH:MM>)` to a `live` cell the moment a Kikaku,
   Hosa, or Kaiseki reports to you and goes idle, so that the reminder is
   not forgotten across a wake-up — and each open ledger's `## Open questions for the human`,
```

**P8.27** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```markdown
A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the window is gone,
a send errors, a `no-role` comes back, or your window wakes for another
reason and the answer has not arrived. Treat the exit as forced, write a
roster Events line saying its exit shoroku did not run and what was lost as
far as you know, mark the row `cleared` on a `no-role` or `dead` on a send
error or an empty listing, and continue. The same Events line goes in
whenever you mark a row `dead`.
```

**P8.27 →**

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

**P8.28** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   idles on a grant is not `blocked` and the census would miss it. The
```

**P8.28 →**

```markdown
   idles on a grant is not `blocked` and the spawner's census would miss it. The
```

**P8.29** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
own times — "released now; a fresh Keikaku is requested at
`<topic>`'s merge" — never one clause for both.
```

**P8.29 →**

```markdown
own times — "released now; a fresh Keikaku is requested at
`<topic>`'s merge" — never one clause for both.

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

- **Not listed** — mark the row `dead`, with the Events line a seat whose
  shoroku proposal was not written gets and what was lost as far as you
  know — except while a restart is being recovered, below; a row that was
  the live Jisso's is the Replace table's first row, the tree verified
  first.
- **Listed**, marked `renamed` — rewrite the row's Name column with the
  listed name and the `[ref]` one `ListAgents` call prints, and write
  `resumed: <old name> → <new name>`; for a terminal seat, clear the
  spawner's `renamed` mark with an `ack` request.
- **Not held** — nothing to the human. A session becomes the run's through
  a handshake or a result file, never by being listed.
- **No session id** — nothing.
- `census: unavailable — <reason>` — nothing is marked; the next census
  decides.

A send error is a reason to run the census, not a signal of its own: its
"Not listed" marks the row `dead`, and a send that errors to a session the
census still lists is a message failure — the row stays, and you tell the
human in one line. `ListAgents` lists every session on the machine and
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

**P8.30** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| the live Jisso is gone — the census marked it `gone`, `SendMessage` errors, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); mark the row `dead` with the Events line saying its exit shoroku did not run and what was lost; write a `spawn` request with the **same** `batch=` file, its resume line rewritten to `resume batch X from task N`. Under a skill-editing plan's queue, send that line to the next `queued` seat instead, and put the lost seat to the human as a ruling, since the queue cannot be refilled early |
```

**P8.30 →**

```markdown
| the live Jisso is gone — the spawner's census marked it `gone`, or the spawner's guard stopped it (`strayed` in `seats.json`), the census does not list it, `SendMessage` errors, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); mark the row `dead` with the Events line saying its shoroku proposal was not written and what was lost — or `stopped`, when the spawner's guard stopped it, its conversation kept, with an Events line naming the guard and the worktree's branch, whose commits, if any, go to the human as a ruling; write a `spawn` request with the **same** `batch=` file, its resume line rewritten to `resume batch X from task N`. Under a skill-editing plan's queue, send that line to the next `queued` seat instead, and put the lost seat to the human as a ruling, since the queue cannot be refilled early |
```

**P8.31** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| the kessai is answered, shusei's batch is verified, the merge is done, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every seat the ledger's Session events accepted for it — Sekkei, Keikaku, every Jisso, `queued` ones that never ran included, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. Shoki's transcript is not in the list: it is not a session of the ledger's Session events. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then mark `dead` the rows of any session the census lost and no resume brought back, move the stopped, dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — move the topic's result files to `.tanto/<topic>/spawner-results/`, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

**P8.31 →**

```markdown
| the kessai is answered, shusei's batch is verified, the merge is done, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every seat the ledger's Session events accepted for it — Sekkei, Keikaku, every Jisso, `queued` ones that never ran included, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. Shoki's transcript is not in the list: it is not a session of the ledger's Session events. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then run the census and mark `dead` every row it prints under "Not listed", which covers the tab seats too; bring the roster's Shoroku proposal items table to the template's shape if it still has its pre-rename heading or the retired seventh column, its rows kept; move the stopped, dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — move the topic's result files to `.tanto/<topic>/spawner-results/`, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

**P8.32** `skills/tanto/roles/kanri.md` — replace exactly these 10 lines

```markdown
The terminal seats were never reached by the restart — separate processes,
still running — and after a reboot `tanto` resumes each of them under the
same `sessionId`. The human types `/tanto fukki` once, in your window, after
`claude attach`, and then in each tab seat's window, in any order. Mark `dead` only a
row whose session neither `ListAgents` lists nor re-handshakes by the time the
human says the windows are done, and, for a terminal seat, reconcile the
roster with `seats.json`'s `renamed` marks and `claude agents --json`:
rewrite a renamed row's Name column, write the Events line
`resumed: <old name> → <new name>`, and clear each mark with an `ack`
request. Answer every ledger line marked `unanswered:`. A Jisso resumed
```

**P8.32 →**

```markdown
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
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 8
```

Expected: `task 8: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
git commit --only skills/tanto/roles/kanri.md -m "docs: Kanri keys every match on the sessionId and runs boundary.js census" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 9 — Kanri's role file says "shoroku proposal", names the close's files by the step, and drops the stage word

Spec 3.1 to 3.7 and 6.2's vocabulary bullets: Start steps 2 and 5's
reserved prefixes (3.7); every "Stage `t2`" clause — lines 340, 445, 639,
720, 925, 932, 1121, 1267, and 1296 (3.5); every bare "exit proposal" —
347, 906, 1549, 1550, and the wrapped ones at 317–318, 568–569, 603–604,
and 822–823 (3.1); the proposal files of 3.2 — `shoroku-proposal.md` at 987
and 1138, the `-2-proposal` of 688, 916, 1119, and 1292–1293, and Kanri's
own at 675, 921, and 1291; the `close:` line (3.3); the subjects and the
close's files (3.2, 3.4); `### Exit shoroku` → `### A seat's exit` and its
thirteen pointers (3.6); the release sentence of that section's step 2,
which gains the terminal seat's `stop` request as `SKILL.md`'s "The exit
itself" has it; and every "T2". Task 8 made the section-3 changes on the
lines it owns (see its text), so none of them is repeated here.

**Files:**

- Modify: `skills/tanto/roles/kanri.md`

**Named-mechanism sites.** The heading `### A seat's exit` is pointed at from
this file only — the thirteen pointers are all here, six of them in the
Replace table. The `close:` line is also `SKILL.md`'s (Task 11) and
`roles/jisso.md`'s (Task 13), and check 24 of the consistency note pins all
three copies (Task 7). The proposal file names of 3.2 are also `SKILL.md`'s
(Task 11), the role files' (Task 13), and `templates/roster.md`'s (Task 12);
the reserved prefix `shoroku-proposal-kanri-` is also `SKILL.md`'s Workspace
(Task 11). The `exit:` and `shoroku proposal:` lines are also `SKILL.md`'s
(Task 11) and the role files' (Task 13). The subject `docs: shoroku for` is
also `SKILL.md`'s (Task 11) and `templates/shoki-brief.md`'s (Task 12).

**O9.1** `Exit shoroku` — the heading `### Exit shoroku` and its thirteen pointers (`roles/kanri.md` 1238 and 348, 479, 676, 723, 914, 994, 1141, 1528, 1529, 1532, 1534, 1535, 1536; spec 3.6); before: 14 lines in `skills/tanto/roles/kanri.md`, after: 0.

**O9.2** `exit shoroku` — the noun, lower case (spec 3.1); before: 10 lines in `skills/tanto/roles/kanri.md`, of which Task 8's passages remove 5; after this task: 0 in `skills/tanto/roles/kanri.md`. Over `SKILL.md`, `roles/`, `templates/`, and `README.md`, case-insensitive, 0 once Tasks 11, 12, and 13 land.

**O9.3** `exit proposal` — the noun (spec 3.1; `roles/kanri.md` 313, 347, 906, 1251, 1549, 1550); before: 6 lines in `skills/tanto/roles/kanri.md`, after: 0.

**O9.4** `exit: propose your shoroku` — the `exit:` line (spec 3.3; `roles/kanri.md` 1247); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O9.5** `stage word` — "One stage per topic, the **close**, stage word `t2`" (spec's Old values, `roles/kanri.md` 962); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O9.6** `Stage` — every "Stage `t2`" clause (spec 3.5; `roles/kanri.md` 340, 445, 639, 720, 925, 932, 1121, 1267, 1296); written without its backticks, which a needle cannot carry; before: 9 in `skills/tanto/roles/kanri.md`, of which none is Task 8's, after: 0. Over `SKILL.md`, `roles/`, and `templates/`, 0 once Tasks 11 and 12 land; the scripts keep the word — `boundary.js` for a legacy table, `passage-check.js` for its frame stages.

**O9.7** `T2` — the close's old name (spec 3.1; `roles/kanri.md` 448, 661, 663, 672, 756, 997, 1076, 1137, 1230, 1373, 1552, 1564); before: 12 lines in `skills/tanto/roles/kanri.md`, after: 0.

**O9.8** `t2-recommendation` — the close's file (spec 3.2; `roles/kanri.md` 1005); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O9.9** `t2-brief` — the close's file (spec 3.2; `roles/kanri.md` 1026); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O9.10** `t2-direction` — the close's file (spec 3.2; `roles/kanri.md` 1063); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O9.11** `shoroku-proposal.md` — the close's Jisso file (spec 3.2; `roles/kanri.md` 672, 987, 1138); before: 3 in `skills/tanto/roles/kanri.md`, after: 0.

**O9.12** `-2-proposal` — the second file's suffix (spec 3.2; `roles/kanri.md` 688, 916, 1119); before: 3 in `skills/tanto/roles/kanri.md`, after: 0; 1292–1293's "`-2` before `-proposal`" wraps and is P9.51's old block.

**O9.13** `exit-kanri-<` — Kanri's old proposal file name (spec 3.2; `roles/kanri.md` 675, 688, 921, 984, 1291); before: 5 in `skills/tanto/roles/kanri.md`, after: 0 — the reserved `exit-kanri-` prefix itself stays, for the files written before this plan (spec 3.7).

**O9.14** `exit-<role>` — the old proposal pattern (spec 3.2; `roles/kanri.md` 983, 1244, 1249); before: 3 in `skills/tanto/roles/kanri.md`, after: 0.

**O9.15** `with neither of its prefixes` — step 5's slug check (spec's Old values, `roles/kanri.md` 94); before: 1 in `skills/tanto/roles/kanri.md`, after: 0 — there are three prefixes.

**O9.16** `Every planned exit of a session, in any role, carries its own shoroku` — spec's Old values (`roles/kanri.md` 1240); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O9.17** `docs: T2 shoroku` — the close's commit subject (spec 3.4; `roles/kanri.md` 1076); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P9.18 to P9.59, in file order.

**P9.18** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   `kaiseki/`, your predecessors' `exit-kanri-*` files, and the between-plans
   sweep's `inbox-*` files — and
```

**P9.18 →**

```markdown
   `kaiseki/`, your predecessors' `shoroku-proposal-kanri-*` files and the
   `exit-kanri-*` files written before the shoroku proposal was named, and
   the between-plans sweep's `inbox-*` files — and
```

**P9.19** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   lists and begins with neither of its prefixes, and that no
```

**P9.19 →**

```markdown
   lists and begins with none of its prefixes, and that no
```

**P9.20** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`
```

**P9.20 →**

```markdown
   `coldread answered: <pointer, one per question, or none>; shoroku proposal: <path> — <reading>`
```

**P9.21** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   pointer against the tree as you check any pointer, and take Keikaku's exit
   proposal path from that same line — it wrote the proposal unasked, and no
```

**P9.21 →**

```markdown
   pointer against the tree as you check any pointer, and take Keikaku's
   shoroku proposal path from that same line — it wrote the proposal unasked, and no
```

**P9.22** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   rows of the `S-n` table, Source the spec's path and the section's
   heading, Stage `t2`, if the spec's acceptance did not already (Sekkei's
```

**P9.22 →**

```markdown
   rows of the `S-n` table, Source the spec's path and the section's
   heading, if the spec's acceptance did not already (Sekkei's
```

**P9.23** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   recommender reads those four sections of the spec by name, and Keikaku's
   exit proposal, named in the `coldread answered:` line, is form-checked
   and recorded the same way ("Exit shoroku", step 2).
```

**P9.23 →**

```markdown
   recommender reads those four sections of the spec by name, and Keikaku's
   shoroku proposal, named in the `coldread answered:` line, is form-checked
   and recorded the same way ("A seat's exit", step 2).
```

**P9.24** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
   Shoroku proposal section is already `S-n` rows, Adopted `pending` and
   Stage `t2`, written by the brief — that section is this Jisso's exit
   shoroku, and the brief's pass over it is its form check: bookkeeping, not
   a ruling, since nothing is adopted before the close, where the
   recommendation and the human's check at T2 rule on the whole list at once.
```

**P9.24 →**

```markdown
   Shoroku proposal section is already `S-n` rows, Adopted `pending`,
   written by the brief — that section is this Jisso's shoroku proposal, and
   the brief's pass over it is its form check: bookkeeping, not a ruling,
   since nothing is adopted before the close, where the recommendation and
   the human's check at the close rule on the whole list at once.
```

**P9.25** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   fall at this boundary, per "Exit shoroku": the retiring Jisso's proposal
```

**P9.25 →**

```markdown
   fall at this boundary, per "A seat's exit": the retiring Jisso's proposal
```

**P9.26** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   steps 2 to 4 of "The handover, in a plan and between plans" — your exit
   proposal was step 4's, and its items are `pending` rows you write here
```

**P9.26 →**

```markdown
   steps 2 to 4 of "The handover, in a plan and between plans" — your
   shoroku proposal was step 4's, and its items are `pending` rows you write here
```

**P9.27** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   released at step 4 `cleared` — one `--s-item` per item of an exit
   proposal step 4 form-checked, and one `commit-done:` event per boundary
```

**P9.27 →**

```markdown
   released at step 4 `cleared` — one `--s-item` per item of a shoroku
   proposal step 4 form-checked, and one `commit-done:` event per boundary
```

**P9.28** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   `S-n` table with Adopted `pending` and Stage `t2`, as you do a batch
```

**P9.28 →**

```markdown
   `S-n` table with Adopted `pending`, as you do a batch
```

**P9.29** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   boundary either, but takes step 3's `T2:` line once you accept the fix
   wave. When the review has no findings there is no fix wave: the
   last-implementation-batch Jisso stays live and takes step 3's `T2:` line
```

**P9.29 →**

```markdown
   boundary either, but takes step 3's `close:` line once you accept the fix
   wave. When the review has no findings there is no fix wave: the
   last-implementation-batch Jisso stays live and takes step 3's `close:` line
```

**P9.30** `skills/tanto/roles/kanri.md` — replace exactly these 11 lines

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
```

**P9.30 →**

```markdown
3. When the final batch is accepted, run the close: the four steps of
   "Shoroku" below, whose first step is two proposals. Jisso's first: send
   the live Jisso one line, `<short id>` being the first eight hexadecimal
   digits of its `sessionId`, the basename of its row's Transcript column —
   `close: propose; write it to .tanto/<topic>/shoroku-proposal-jisso-<short id>.md`
   — check the proposal's form, record its rows, and write its `stop`
   request.
   Then your own: write `.tanto/shoroku-proposal-kanri-<short id>.md`, the
   `<short id>` your own, from the ledger and the roster, as "A seat's exit"
   says for your own exit, and record its items as `pending` rows of this
   ledger — at every plan close, whether or not you will decline the close's
   handover, so that the close is every seat's write-out, yours included. Then the one
```

**P9.31** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
   proposal is written — at the check, the merge decision, the archive —
   goes to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-2-proposal.md`, whose
   items are rows of the roster's Shoroku proposal items table and move
   into the next topic's ledger when it opens; a proposal you have recorded
   is never rewritten.
```

**P9.31 →**

```markdown
   proposal is written — at the check, the merge decision, the archive —
   goes to `.tanto/shoroku-proposal-kanri-<short id>-<n>.md`, the next `n`
   from 2 upward, whose items are rows of the roster's Shoroku proposal
   items table and move into the next topic's ledger when it opens; a
   proposal you have recorded is never rewritten.
```

**P9.32** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   this boundary with Adopted `pending` and Stage `t2`; nothing is adopted
```

**P9.32 →**

```markdown
   this boundary with Adopted `pending`; nothing is adopted
```

**P9.33** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   is open, run Kaiseki's exit as "Exit shoroku" below prescribes — its
```

**P9.33 →**

```markdown
   is open, run Kaiseki's exit as "A seat's exit" below prescribes — its
```

**P9.34** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   whose batches were in flight. After T2, the merge decision, the peers'
```

**P9.34 →**

```markdown
   whose batches were in flight. After the close's four steps, the merge decision, the peers'
```

**P9.35** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
open and no batch in flight, it is a fresh act like the close's — the exit
proposal written fresh from the ledger and the roster — and it commits
```

**P9.35 →**

```markdown
open and no batch in flight, it is a fresh act like the close's — the
shoroku proposal written fresh from the ledger and the roster — and it commits
```

**P9.36** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
A Sekkei whose last line named an exit proposal is waiting
```

**P9.36 →**

```markdown
A Sekkei whose last line named a shoroku proposal is waiting
```

**P9.37** `skills/tanto/roles/kanri.md` — replace exactly these 20 lines

```markdown
1. **Exit shoroku first** — the Kanri case under "Exit shoroku". **At a plan
   close** your proposal is already written and its rows were that close's
   ("The final batch", step 3): write nothing here but the `-2-proposal.md`
   of that step for what the close taught you after it, its rows in the
   roster's Shoroku proposal items table, and go to step 2. **At every other
   handover**: write your own proposal from the ledger and the roster rather
   than from recollection, to
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`; what you cannot
   reconstruct goes into the handover file's "Not reconstructed" section.
   Then one of two. **While any ledger is open** — at a batch boundary, or in
   a topic's spec or plan stage — record the proposal's items as `pending`
   rows, Stage `t2`, Source the proposal's path and the item's number, in
   the ledger of the topic whose batches are in flight, else the oldest open
   topic's. At a batch boundary this is loop step 4's proposal, its rows
   written by the `record` call of loop step 6 or, when the loop stops at
   step 5 for the handover, by the `record --s-item` call made there,
   already done when the window reaches this list. **Between plans**, with
   no ledger open, record them as rows of the roster's Shoroku proposal
   items table, Stage `t2`, Source the same; they move into the next topic's
   ledger when it opens and are recommended at that topic's close. Nothing
```

**P9.37 →**

```markdown
1. **Your shoroku proposal first** — the Kanri case under "A seat's exit".
   **At a plan close** your proposal is already written and its rows were
   that close's ("The final batch", step 3): write nothing here but the
   further file of that step, the next `-<n>`, for what the close taught you
   after it, its rows in the roster's Shoroku proposal items table, and go
   to step 2. **At every other handover**: write your own proposal from the
   ledger and the roster rather than from recollection, to
   `.tanto/shoroku-proposal-kanri-<short id>.md`; what you cannot
   reconstruct goes into the handover file's "Not reconstructed" section.
   Then one of two. **While any ledger is open** — at a batch boundary, or in
   a topic's spec or plan stage — record the proposal's items as `pending`
   rows, Source the proposal's path and the item's number, in the ledger of
   the topic whose batches are in flight, else the oldest open topic's. At a
   batch boundary this is loop step 4's proposal, its rows
   written by the `record` call of loop step 6 or, when the loop stops at
   step 5 for the handover, by the `record --s-item` call made there,
   already done when the window reaches this list. **Between plans**, with
   no ledger open, record them as rows of the roster's Shoroku proposal
   items table, Source the same; they move into the next topic's ledger
   when it opens and are recommended at that topic's close. Nothing
```

**P9.38** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
One stage per topic, the **close**, stage word `t2`, in four steps —
```

**P9.38 →**

```markdown
One stage per topic, the **close**, in four steps —
```

**P9.39** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```markdown
1. **Propose.** The session that holds the items writes them, and only this
   step needs a resident context. An exit:
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md` for Sekkei, Keikaku,
   and an attached Kaiseki, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`
   for your own. A batch boundary: the Shoroku proposal section of the
   report, which is that Jisso's exit shoroku — one Jisso runs one batch.
   The close: `.tanto/<topic>/shoroku-proposal.md`, written by the last live
   Jisso — the `pending` rows by number and what its own context holds that
   no file does — and then your own proposal, before the recommender. The
```

**P9.39 →**

```markdown
1. **Propose.** The session that holds the items writes them, and only this
   step needs a resident context. An exit:
   `.tanto/<topic>/shoroku-proposal-<role>-<short id>.md` for Sekkei,
   Keikaku, and an attached Kaiseki, or
   `.tanto/shoroku-proposal-kanri-<short id>.md` for your own, `-<n>` before
   `.md` for a further file by the same session. A batch boundary: the
   Shoroku proposal section of the report, which is that Jisso's shoroku
   proposal — one Jisso runs one batch. The close:
   `.tanto/<topic>/shoroku-proposal-jisso-<short id>.md`, written by the
   last live Jisso — the `pending` rows by number and what its own context
   holds that no file does — and then your own proposal, before the
   recommender. The
```

**P9.40** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   that reads the report. Check every proposal's form as "Exit shoroku" step
   2 says; record its rows; then `release:`.
```

**P9.40 →**

```markdown
   that reads the report. Check every proposal's form as "A seat's exit"
   step 2 says; record its rows; then `release:`.
```

**P9.41** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   in the skill's recommend mode over the T2 proposal, every source the
```

**P9.41 →**

```markdown
   in the skill's recommend mode over the close's shoroku proposal, every source the
```

**P9.42** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   the output, `.tanto/<topic>/t2-recommendation.md`. The recommender's
```

**P9.42 →**

```markdown
   the output, `.tanto/<topic>/shoroku-recommendation.md`. The recommender's
```

**P9.43** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   path — `.tanto/<topic>/t2-brief.md` — the template
```

**P9.43 →**

```markdown
   path — `.tanto/<topic>/shoroku-brief.md` — the template
```

**P9.44** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   and the merge is no longer a second question. Write `t2-direction.md`
```

**P9.44 →**

```markdown
   and the merge is no longer a second question. Write `shoroku-direction.md`
```

**P9.45** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   `docs: T2 shoroku for <topic>`, and your own address as the roster's
```

**P9.45 →**

```markdown
   `docs: shoroku for <topic>`, and your own address as the roster's
```

**P9.46** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
**Between plans** there is no ledger, so record items that reach you then —
a Kikaku decision file belonging to no topic, your
own exit's proposal, a close's `-2-proposal.md` — in the roster's Shoroku
proposal items table instead, and move its rows into the new ledger's
table, with Stage `t2`, when a topic opens. Nothing is written out from the
roster's table itself, so nothing is written twice.
```

**P9.46 →**

```markdown
**Between plans** there is no ledger, so record items that reach you then —
a Kikaku decision file belonging to no topic, your
own exit's proposal, a close's further proposal file — in the roster's
Shoroku proposal items table instead, and move its rows into the new
ledger's table when a topic opens. Nothing is written out from the
roster's table itself, so nothing is written twice.
```

**P9.47** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```markdown
1. **Jisso proposes, then you do.** You send the `T2:` line; the live Jisso
   writes the numbered list to `.tanto/<topic>/shoroku-proposal.md` — the
   `pending` rows of the `S-n` table listed by number, and what its own
   context holds that no file does — and sends you one line. Check the
   file's form as "Exit shoroku" step 2 says, record its rows, and write its
   `stop` request: the close is its exit and no line goes to it. Then
```

**P9.47 →**

```markdown
1. **Jisso proposes, then you do.** You send the `close:` line; the live
   Jisso writes the numbered list to
   `.tanto/<topic>/shoroku-proposal-jisso-<short id>.md` — the `pending`
   rows of the `S-n` table listed by number, and what its own context holds
   that no file does — and sends you one line. Check the file's form as
   "A seat's exit" step 2 says, record its rows, and write its `stop`
   request: the close is its exit and no line goes to it. Then
```

**P9.48** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
the branch abandoned — still gets its close, over what is on disk: write
the T2 proposal yourself, in Jisso's absence, as you write your own — the
```

**P9.48 →**

```markdown
the branch abandoned — still gets its close, over what is on disk: write
the close's shoroku proposal yourself, in Jisso's absence, as you write your own — the
```

**P9.49** `skills/tanto/roles/kanri.md` — replace exactly these 14 lines

```markdown
### Exit shoroku

Every planned exit of a session, in any role, carries its own shoroku, and
the session is released once its proposal is on disk and form-checked: its
items are recommended and checked at the close, with the session gone.
`SKILL.md`'s "Session exit" defines the mechanism and the file pattern
`exit-<role>[-<suffix>]`; these are your steps.

1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`. The session writes it,
   runs its resume self-check, and answers
   `exit proposal: <path> — <reading>`. **Three roles are the exception**: a
```

**P9.49 →**

```markdown
### A seat's exit

Every planned exit of a session, in any role, writes its shoroku proposal
first, and the session is released once the proposal is on disk and
form-checked: its items are recommended and checked at the close, with the
session gone. `SKILL.md`'s "Session exit" defines the mechanism and the
file pattern `shoroku-proposal-<role>-<short id>`; these are your steps.

1. At the boundary where the exit falls, send that session
   `exit: propose; write it to <path>`, without an idle subscription, as
   with every other line you send. The path is
   `.tanto/<topic>/shoroku-proposal-<role>-<short id>.md`, `<short id>` the
   first eight hexadecimal digits of the session's `sessionId`, the basename
   of its row's Transcript column, with `-<n>` before `.md` when that session
   has written one already. The session writes it, runs its resume
   self-check, and answers `shoroku proposal: <path> — <reading>`. **Three
   roles are the exception**: a
```

**P9.50** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
   that passes is recorded — one `pending` row per item, Source the
   proposal's path and the item's number, Stage `t2`, since the close is
   what recommends it — and you send the session `release: /clear this window`,
   mark its row `cleared`, and tell the human, in your own window,
   `<role> <name> released — its work is in <paths>; no step needs it — /clear its window when convenient`.
```

**P9.50 →**

```markdown
   that passes is recorded — one `pending` row per item, Source the
   proposal's path and the item's number — and you send a tab seat
   `release: /clear this window`, its row going `cleared`, or write a
   terminal seat's `stop` request, its row going `stopped`, nothing
   `/clear`ed and nothing said to it; either way tell the human, in your own
   window,
   `<role> <name> released — its work is in <paths>; no step needs it — /clear its window when convenient`.
```

**P9.51** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```markdown
**Your own exit.** Propose from the ledger and the roster rather than from
recollection, to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`,
`<name>` being your own bare name, and a second file with `-2` before
`-proposal` for what a close teaches after the first is recorded. At a plan
close the proposal comes before the recommender and its rows are that
close's ("The final batch", step 3). At a handover with any ledger open, the
items are `pending` rows, Stage `t2`, in the ledger of the topic whose
batches are in flight, else the oldest open topic's, and the handover file
```

**P9.51 →**

```markdown
**Your own exit.** Propose from the ledger and the roster rather than from
recollection, to `.tanto/shoroku-proposal-kanri-<short id>.md`,
`<short id>` being the first eight hexadecimal digits of your own
`sessionId`, and a further file with the next `-<n>` before `.md` for what a
close teaches after the first is recorded — a close whose handover you
decline and a later close in the same session each take the next `n`. At a
plan close the proposal comes before the recommender and its rows are that
close's ("The final batch", step 3). At a handover with any ledger open, the
items are `pending` rows in the ledger of the topic whose
batches are in flight, else the oldest open topic's, and the handover file
```

**P9.52** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
Hosa"). Your own exit shoroku does not sweep the inbox.
```

**P9.52 →**

```markdown
Hosa"). Your own shoroku proposal does not sweep the inbox.
```

**P9.53** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
previous plan into the ledger's "Hotfixes since the previous plan" line, and at
T2 name that line in the direction so the dogfood report carries them.
```

**P9.53 →**

```markdown
previous plan into the ledger's "Hotfixes since the previous plan" line, and at
the close name that line in the direction so the dogfood report carries them.
```

**P9.54** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then the ask; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "Exit shoroku", then a `spawn` request with the same three keys; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
```

**P9.54 →**

```markdown
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "A seat's exit", then the ask; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "A seat's exit", then a `spawn` request with the same three keys; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
```

**P9.55** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then, if the case is open, the ask with the same brief |
```

**P9.55 →**

```markdown
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "A seat's exit", then, if the case is open, the ask with the same brief |
```

**P9.56** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
| Sekkei is gone before the spec review is accepted | the ask; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Keikaku is gone before the plan is committed | a `spawn` request with the same three keys; the spec on the branch and the plan draft on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; the ask; the brief and the WIP commit are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
```

**P9.56 →**

```markdown
| Sekkei is gone before the spec review is accepted | the ask; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
| Keikaku is gone before the plan is committed | a `spawn` request with the same three keys; the spec on the branch and the plan draft on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; the ask; the brief and the WIP commit are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
```

**P9.57** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the exit proposal | Sekkei is done; record its proposal's items and the spec's four sections as `pending` rows, Source the spec's path as it stands now — rewritten at the landing if that path was a draft's ("When the plan lands", step 3) — and send `release:` as soon as the proposal passes the form check — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the `coldread answered:` line named the exit proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; record its proposal's items as `pending` rows and write its `stop` request as soon as the proposal passes the form check — no released line and no `/clear`, its conversation kept; a Keikaku is never reused across topics (decision-f496) |
```

**P9.57 →**

```markdown
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the shoroku proposal | Sekkei is done; record its proposal's items and the spec's four sections as `pending` rows, Source the spec's path as it stands now — rewritten at the landing if that path was a draft's ("When the plan lands", step 3) — and send `release:` as soon as the proposal passes the form check — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the `coldread answered:` line named the shoroku proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; record its proposal's items as `pending` rows and write its `stop` request as soon as the proposal passes the form check — no released line and no `/clear`, its conversation kept; a Keikaku is never reused across topics (decision-f496) |
```

**P9.58** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| the final batch is accepted, T2's proposal is written and passes the form check, and leftovers are clean | the last Jisso is done; write its `stop` request at once, T2 being its exit — no released line and no `/clear`, its conversation kept — the recommendation and the kessai run with it gone, and a merge declined with fixes wanted is a new batch on a new Jisso either way; a `queued` Jisso that never ran gets a `stop` request the same way, its row `stopped` |
```

**P9.58 →**

```markdown
| the final batch is accepted, the close's shoroku proposal is written and passes the form check, and leftovers are clean | the last Jisso is done; write its `stop` request at once, the close being its exit — no released line and no `/clear`, its conversation kept — the recommendation and the kessai run with it gone, and a merge declined with fixes wanted is a new batch on a new Jisso either way; a `queued` Jisso that never ran gets a `stop` request the same way, its row `stopped` |
```

**P9.59** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
human about neither. After T2 the two have the same standing: untracked,
```

**P9.59 →**

```markdown
human about neither. After the close the two have the same standing: untracked,
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 9
```

Expected: `task 9: verify clean`.

- [ ] **Step 3: Check the renamed heading's pointers**

```bash
grep -c "\"A seat's exit\"" skills/tanto/roles/kanri.md
grep -c '^### A seat.s exit$' skills/tanto/roles/kanri.md
```

Expected: `13`, then `1` — the thirteen pointers of spec 3.6 and the
heading they point at, in the one commit that moves them (decision-2db1: a
heading is a machine pointer in this skill).

- [ ] **Step 4: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
git commit --only skills/tanto/roles/kanri.md -m "docs: Kanri's shoroku vocabulary — shoroku proposal, the close's files by the step, no stage word" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 10 — The contract states the identity rule, the census, the statuses it changes, the resume rule, and the spawner's naming

Spec 6.1's identity bullets: Handshake and roster — the status list (2.8,
1.4, and `dead` as 2.1 has it) and the census paragraph beside the
`ListAgents` sentence (2.1); Resuming — the identity paragraph (1.1, 2.1),
the tab-seat row (2.6), the reboot row with 4.2's rule, and `/tanto fukki`'s
match by the Transcript basename (2.6); Messages — a send error as a reason
to run the census (2.1); the intake's `idle since` (2.8); Human access's
"the spawner's census" (1.3); the scripts paragraph's `census` and the
spawner's naming (1.1, 2.2); rule 10's naming sentence (1.1). The Messages
line this task owns also carries "an unrun exit shoroku", which it renames
(3.1), so that no line is edited by two tasks.

**Files:**

- Modify: `skills/tanto/SKILL.md`

**Named-mechanism sites.** The status words `stopped`, `cleared`, and `dead`
are also defined by `templates/roster.md`'s status paragraph (Task 12) and
used by `roles/kanri.md` (Task 8); the guard's own `strayed` mark behind
`stopped` is Task 1's (`seats.json`, the log, the toast) and Task 5's
(the schema sentence). The census and its headings are Task 3's and Task
8's. The resume rule's one sentence is also the README's (Task 6) and
`scripts/tanto.js`'s (Task 2). "The spawner's census" is also
`roles/kanri.md`'s (Task 8) and `roles/keikaku.md`'s (Task 13). The
spawner's naming is also Task 1's, the README's (Task 6), and
`templates/spawn-request.md`'s (Task 5). After `SKILL.md` changes, its
sibling `README.md` is reviewed for drift, as `AGENTS.md` asks: Task 6 made
the README's changes, and this task's Step 3 reads the two together.

**O10.1** `stopped on Kanri's request, its` — the `stopped` definition without the guard (spec's Old values, `SKILL.md` 405, and `templates/roster.md` 62–63); before: 1 in `skills/tanto/SKILL.md` and 1 in `skills/tanto/templates/roster.md`, after: 0 in `SKILL.md` with this task and 0 in `templates/roster.md` with Task 12.

**O10.2** `a re-handshake under a new transcript` — `cleared`'s third route (`SKILL.md` 406–408); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O10.3** `a crash, a restart before` — `dead`'s old list (`SKILL.md` 408–410); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O10.4** `the handshake carries those.` — the `ListAgents` sentence as the last word on what the run sees (`SKILL.md` 416–417); before: 1 in `skills/tanto/SKILL.md`, after: 0 — it now names the census beside `ListAgents`.

**O10.5** `keeps the id while it changes the name` — the resume's rename, true now for a tab seat alone (`SKILL.md` 571–574); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O10.6** `re-handshakes with the same` — the tab seat's `/tanto fukki` after a restart (`SKILL.md` 580); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O10.7** `seat is not resumed at all, which is why` — the reboot row's rule without the `gone` Kanri (`SKILL.md` 583); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O10.8** `matches no row is not a resumed role` — `/tanto fukki`'s match by the full path (`SKILL.md` 601–603); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O10.9** `a send error stays` — a send error as the signal of a gone session (`SKILL.md` 652–653); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O10.10** `an unrun exit shoroku gets` — `SKILL.md` 654; before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O10.11** `into that cell while a Hosa idles` — "Kanri writes `idle since <HH:MM>` into that cell" (`SKILL.md` 759); before: 1 in `skills/tanto/SKILL.md`, after: 0 — Kanri appends the suffix.

**O10.12** `its two subcommands are` — `boundary.js`'s subcommands (`SKILL.md` 1106); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O10.13** `the human's own choice: the skill neither` — rule 10's sentence on a human's rename before `/tanto <role>` (`SKILL.md` 1193–1194); may stay, and does: the spawner's sentence joins it; before: 1, after: 1.

**O10.14** `is the census's to detect` — "the census" for the spawner's pass in Resuming (`SKILL.md` 596); before: 1 in `skills/tanto/SKILL.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P10.15 to P10.25, in file order.

**P10.15** `skills/tanto/SKILL.md` — replace exactly these 15 lines

```markdown
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
`ListAgents` shows name, `[ref]`, kind, and start time — not the cwd, the
model, or the role; the handshake carries those.
```

**P10.15 →**

```markdown
carries one of seven
words: `queued` a Jisso of a skill-editing plan waiting for its batch prompt;
`live`, which may carry the suffix `(idle since <HH:MM>)`; `stopped` a
terminal seat the spawner stopped on Kanri's request or the spawner's guard
stopped, its conversation kept; `cleared` a tab seat Kanri released with
`release:`, or whose `/clear` a `no-role` reply revealed; `replaced` a
Kanri that handed over; `dead` a session the census no longer lists;
`refused` a handshake that got no row. A terminal seat's row is written from
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
enters a worktree. `node "$TANTO/scripts/boundary.js" census` lists every
session under the repository, the tab seats included, and Kanri marks a
`live` or `queued` row whose `sessionId` it does not list `dead` on that
signal alone — no timeout, no inference, no name — except while a restart
is being recovered (`roles/kanri.md`). A listing that fails is no signal,
and nothing is marked on it. A send error is a reason to run the census,
not a signal of its own: a send that errors to a session the census still
lists is a message failure, the row stays, and Kanri tells the human in one
line.
```

**P10.16** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```markdown
**Identity is the `sessionId`.** The transcript path is a function of it —
`<config dir>/projects/<project slug>/<sessionId>.jsonl` — the name is what
`claude agents --json` and `ListAgents` currently print for it, and a resume
keeps the id while it changes the name. The roster's Transcript column holds
the path and therefore the id; no `Sess` column is added, because it would
duplicate the basename.
```

**P10.16 →**

```markdown
**Identity is the `sessionId`**, for every seat, the tab seats included. The
transcript path is a function of it —
`<config dir>/projects/<project slug>/<sessionId>.jsonl` — and the name is
what `claude agents --json` and `ListAgents` currently print for it. The
editor's resume of a tab seat keeps the id and changes the name; a terminal
seat's flag-less resume keeps both, since the spawner named it at its spawn.
The roster's Transcript column holds the path and therefore the id — the
basename, which holds when the path does not — and no `Sess` column is
added, because it would duplicate the basename.
```

**P10.17** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| a tab seat resumed by the editor | the human types `/tanto fukki` there; the seat re-handshakes with the same `transcript=`, and Kanri rewrites that row's name in place and writes `resumed: <old name> → <new name>` |
```

**P10.17 →**

```markdown
| a tab seat resumed by the editor | nothing is typed there: Kanri's census finds the row's `sessionId` under a new name, rewrites that row's name in place, and writes `resumed: <old name> → <new name>`. `/tanto fukki` stays accepted there, and its handshake rewrites the same row with the same values |
```

**P10.18** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| a reboot or a crash | `tanto` writes a `resume` request for every terminal seat `seats.json` lists as `running` or `blocked`, with `claude --resume <sessionId> --bg` and no other flag. The roster's first row is settled first and separately, so a Kanri the listing has lost but `seats.json` still holds is **resumed and never spawned again**; a `stopped` seat is not resumed at all, which is why `tanto down --seats` retires a run rather than pausing it |
```

**P10.18 →**

```markdown
| a reboot or a crash | `tanto` writes a `resume` request for every terminal seat `seats.json` lists as `running` or `blocked`, with `claude --resume <sessionId> --bg` and no other flag. The roster's first row is settled first and separately, so a Kanri the listing has lost but `seats.json` still holds — `gone` included, a Kanri the human `/stop`ped or one that crashed while the spawner ran — is **resumed and never spawned again**. A seat `seats.json` holds as `running` or `blocked` — or, for Kanri alone, `gone` — is resumed; one it holds as `stopped` or `removed` is not, which is why `tanto down --seats` retires a run rather than pausing it |
```

**P10.19** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
reconciles the roster with `seats.json`'s `renamed` marks and
`claude agents --json`, answers the ledger's unanswered lines, sends a Jisso
```

**P10.19 →**

```markdown
reconciles the roster with `seats.json`'s `renamed` marks and
the census, answers the ledger's unanswered lines, sends a Jisso
```

**P10.20** `skills/tanto/SKILL.md` — replace exactly these 10 lines

```markdown
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

**P10.20 →**

```markdown
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

**P10.21** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```markdown
  `no-role` reply is the one word, carries no second line of its own, and
  is the signal that a window was cleared under a role; a send error stays
  the signal that a session is gone. What each side does on `no-role`: Kanri marks the
  sender's row `cleared`, writes the Events line an unrun exit shoroku gets
```

**P10.21 →**

```markdown
  `no-role` reply is the one word, carries no second line of its own, and
  is the signal that a window was cleared under a role; a send error is a
  reason to run the census, whose "Not listed" is the signal that a session
  is gone. What each side does on `no-role`: Kanri marks the sender's row
  `cleared`, writes the Events line a shoroku proposal not written gets
```

**P10.22** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
row whose Role is `hosa` and whose Status begins with `live` — Kanri writes
`idle since <HH:MM>` into that cell while a Hosa idles — or, when there is
```

**P10.22 →**

```markdown
row whose Role is `hosa` and whose Status begins with `live` — Kanri appends
the suffix `(idle since <HH:MM>)` to that cell while a Hosa idles — or, when there is
```

**P10.23** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
idles on a grant is not `blocked` in the harness's sense and the census
alone would miss it. The role's direct exchange
```

**P10.23 →**

```markdown
idles on a grant is not `blocked` in the harness's sense and the spawner's
census alone would miss it. The role's direct exchange
```

**P10.24** `skills/tanto/SKILL.md` — replace exactly these 9 lines

```markdown
brief; its two subcommands are `check`, which runs the boundary's read-only
commands and prints their output under fixed headings, and `record`, which
writes the ledger's and the roster's rows idempotently.
`scripts/spawner.js` is the one process in a run that issues `claude --bg`,
`claude stop`, `claude rm`, and `claude --resume`: a resident started by the
launcher and never by a session, which takes request files, writes result
files, keeps `seats.json`, runs a census of `claude agents --json` every
fifteen seconds, and raises a desktop notice on a blocked seat and on an
`attention` request; `spawner.js notify --stdin` is the one-shot an optional
```

**P10.24 →**

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
files, keeps `seats.json`, names each seat it spawns, runs the spawner's
census of `claude agents --json` every fifteen seconds — which revives a
seat that returns to the listing and stops one that strays into
`.claude/worktrees/` — and raises a desktop notice on a blocked seat, on a
strayed one, and on an `attention` request; `spawner.js notify --stdin` is the one-shot an optional
```

**P10.25** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
    asks for one nor forbids it, and the handshake carries whatever the name
    is.
```

**P10.25 →**

```markdown
    asks for one nor forbids it, and the handshake carries whatever the name
    is. The spawner names a terminal seat at its spawn, before its prompt
    runs, and nothing renames it after.
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 10
```

Expected: `task 10: verify clean`.

- [ ] **Step 3: Review the README for drift**

Read `skills/tanto/README.md`'s Usage and Layout against the passages above
(`AGENTS.md`: after editing a skill's `SKILL.md`, review its sibling
`README.md`). Expected: the README's resume sentence is the reboot row's
rule word for word, its restart sentence agrees with the tab-seat row, and
its Layout names `census` — all Task 6's. A drift found is reported in the
batch report's Deviations, not fixed here.

- [ ] **Step 4: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
git commit --only skills/tanto/SKILL.md -m "docs: the contract's identity rule, the census, and the resume rule" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 11 — The contract's Session exit says "shoroku proposal", names every file by the step and the session, and drops the stage word

Spec 6.1's vocabulary bullets: the role table's Jisso row (3.1); Messages'
`close:` sentence (3.3); Session exit — the stage word and the Stage
sentences (3.5), the four steps' file names, lines, and subjects (3.2 to
3.4), "Who proposes when", "The files", and "The exit itself", whose signals
gain the census's "Not listed" (2.1); Artifacts' rows of every renamed file
(3.2); Workspace's reserved prefixes and "none" for "neither" (3.7), and its
"after T2" (3.1).

**Files:**

- Modify: `skills/tanto/SKILL.md`

**Named-mechanism sites.** The `close:` line is also `roles/kanri.md`'s
(Task 9) and `roles/jisso.md`'s (Task 13), all three pinned by check 24
(Task 7). The `exit:` line and the `shoroku proposal:` reply are also
`roles/kanri.md`'s (Task 9) and the four role files' that send them
(Task 13), and check 6 pins the contract's copies (Task 7). The file names
of 3.2 are also `roles/kanri.md`'s (Task 9), the role files' (Task 13), and
the templates' (Task 12). The reserved prefixes are also `roles/kanri.md`
Start steps 2 and 5 (Task 9). The six-column `S-n` table is also the
templates' (Task 12) and `boundary.js`'s (Task 3). After `SKILL.md`
changes, its sibling `README.md` is reviewed for drift (Step 3).

**O11.1** `the last one, the T2 shoroku proposal` — the role table's Jisso row (spec's Old values, `SKILL.md` 27); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O11.2** `with its clauses, or a handshake` — "a `close:` line with its clauses" (`SKILL.md` 647–648); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O11.3** `stage word` — "at its topic's **close**, stage word `t2`" (`SKILL.md` 856); before: 1 in `skills/tanto/SKILL.md`, after: 0; over `SKILL.md`, `roles/`, `templates/`, and `README.md`, 0 once Tasks 9, 12, and 13 land.

**O11.4** `Stage` — "every row of a ledger's `S-n` table carries Stage `t2`, the stage that recommends it" (`SKILL.md` 861–862); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O11.5** `Kikaku and Hosa have no exit shoroku` — not a one-line needle — it wraps at `SKILL.md` 953–954; P11.30's old block is its check, and `exit shoroku` below counts it.

**O11.6** `exit shoroku` — the noun (spec 3.1; `SKILL.md` 654, 954, 960, 1026, 1052, 1056); at HEAD 6 lines in `skills/tanto/SKILL.md`, of which Task 10 removes 654; after this task: 0.

**O11.7** `exit proposal` — the noun and the reply (spec 3.1, 3.3; `SKILL.md` 968, 969, 975); before: 3 lines in `skills/tanto/SKILL.md`, after: 0.

**O11.8** `exit: propose your shoroku` — the `exit:` line (spec's Old values, `SKILL.md` 973); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O11.9** `T2` — the close's old name (`SKILL.md` 27, 884, 928, 963, 978, 989, 1001, 1004, 1267); before: 9 lines in `skills/tanto/SKILL.md`, after: 0.

**O11.10** `shoroku-proposal.md` — the close's Jisso file (spec's Old values, `SKILL.md` 963, 997, 1055); before: 3 in `skills/tanto/SKILL.md`, after: 0.

**O11.11** `-2-proposal` — the second file's suffix (`SKILL.md` 981); before: 1 in `skills/tanto/SKILL.md`, after: 0; the Artifacts row's `[-2]-proposal` (1056) is P11.34's old block.

**O11.12** `exit-<role>` — the old proposal pattern (spec's Old values, `SKILL.md` 991, 1056); before: 2 in `skills/tanto/SKILL.md`, after: 0.

**O11.13** `exit-sekkei` — the old file names (`SKILL.md` 992); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O11.14** `exit-keikaku` — the old file names (`SKILL.md` 993); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O11.15** `exit-kaiseki` — the old file names (`SKILL.md` 993); before: 1 in `skills/tanto/SKILL.md`, after: 0.

**O11.16** `exit-kanri-<` — Kanri's old file name (`SKILL.md` 995, 1056); before: 2 in `skills/tanto/SKILL.md`, after: 0 — the prefix `exit-kanri-` stays reserved (spec 3.7).

**O11.17** `t2-recommendation` — the close's file (`SKILL.md` 888, 998, 1057); before: 3 in `skills/tanto/SKILL.md`, after: 0.

**O11.18** `t2-brief` — the close's file (`SKILL.md` 896, 998, 1058); before: 3 in `skills/tanto/SKILL.md`, after: 0.

**O11.19** `t2-direction` — the close's file (`SKILL.md` 914, 998, 1059); before: 3 in `skills/tanto/SKILL.md`, after: 0.

**O11.20** `t2-review` — the close's file (`SKILL.md` 998, 1071); before: 2 in `skills/tanto/SKILL.md`, after: 0.

**O11.21** `docs: T2 shoroku` — the close's subjects and the excluded prefix (spec's Old values, `SKILL.md` 928, 1001, 1004); before: 3 in `skills/tanto/SKILL.md`, after: 0.

**O11.22** `with neither prefix` — the slug rule for two prefixes (spec's Old values, `SKILL.md` 1271–1272); before: 1 in `skills/tanto/SKILL.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P11.23 to P11.37, in file order.

**P11.23** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| Jisso (実装) | 1 live per topic, spawned per batch — a self-editing plan's all at its landing | one batch of the SDD run each, its batch report and its commits; the last one, the T2 shoroku proposal | Kanri; the human by grant |
```

**P11.23 →**

```markdown
| Jisso (実装) | 1 live per topic, spawned per batch — a self-editing plan's all at its landing | one batch of the SDD run each, its batch report and its commits; the last one, the close's shoroku proposal | Kanri; the human by grant |
```

**P11.24** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
  path names carries no such line of its own; a `close:` line
  with its clauses, or a handshake with its fields, is one line. A file a
```

**P11.24 →**

```markdown
  path names carries no such line of its own; a `close:` line, or a
  handshake with its fields, is one line. A file a
```

**P11.25** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```markdown
A session's items reach `docs/` once, at its topic's **close**, stage word
`t2`, after the final batch. An exit — a seat done with its work, a Kanri
handing over, a Jisso retiring at its boundary — writes those items to a
file and nothing more; nothing is recommended, checked, or applied at an
exit. `R-n` numbers Kanri's rulings and `S-n` the proposal items, both in
the conductor ledger, and every row of a ledger's `S-n` table carries Stage
`t2`, the stage that recommends it.
```

**P11.25 →**

```markdown
A session's items reach `docs/` once, at its topic's **close**, after the
final batch. An exit — a seat done with its work, a Kanri handing over, a
Jisso retiring at its boundary — writes those items to a file, its
**shoroku proposal**, and nothing more; nothing is recommended, checked, or
applied at an exit. `R-n` numbers Kanri's rulings and `S-n` the proposal
items, both in the conductor ledger, whose `S-n` table's columns are S-n,
Source, Item, Destination, Adopted, and Written.
```

**P11.26** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```markdown
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the T2 proposal, every source the `pending` rows name — the
   spec's sections by heading, each proposal by path, each report by path
   and item, each with its `S-n` — and every untriaged copy under
   `.tanto/inbox/`, by path, names `skills/` as the paths a `fix` item may
   touch, and names the output, `t2-recommendation.md`:
```

**P11.26 →**

```markdown
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the close's shoroku proposal, every source the `pending` rows
   name — the spec's sections by heading, each proposal by path, each report
   by path and item, each with its `S-n` — and every untriaged copy under
   `.tanto/inbox/`, by path, names `skills/` as the paths a `fix` item may
   touch, and names the output, `shoroku-recommendation.md`:
```

**P11.27** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
   The same dispatch names the brief path, `t2-brief.md` beside the
```

**P11.27 →**

```markdown
   The same dispatch names the brief path, `shoroku-brief.md` beside the
```

**P11.28** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
   is the direction and the merge approval. Kanri writes `t2-direction.md`
```

**P11.28 →**

```markdown
   is the direction and the merge approval. Kanri writes `shoroku-direction.md`
```

**P11.29** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
   `docs: T2 shoroku for <topic>`, dispatches `shoroku.review` over its own
```

**P11.29 →**

```markdown
   `docs: shoroku for <topic>`, dispatches `shoroku.review` over its own
```

**P11.30** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
never a restatement of a spec, a plan, a report, or a ledger. Kikaku and
Hosa have no exit shoroku; the human `/clear`s those windows at will. A
```

**P11.30 →**

```markdown
never a restatement of a spec, a plan, a report, or a ledger. Kikaku and
Hosa write no shoroku proposal; the human `/clear`s those windows at will. A
```

**P11.31** `skills/tanto/SKILL.md` — replace exactly these 47 lines

```markdown
- **Jisso** proposes at every boundary, in its report's Shoroku proposal
  section, and that section is its exit shoroku: one Jisso runs one batch,
  and the boundary Kanri accepts is where it retires. No `exit:` line and no
  exit file go to a Jisso. At the close the plan's last live Jisso writes
  `.tanto/<topic>/shoroku-proposal.md` on Kanri's `T2:` line — the `pending`
  rows by number and what its own context holds that no file does — and is
  stopped on its form check: no `/clear`, its conversation kept.
- **Sekkei and Keikaku** write their proposal unasked at their own final
  boundary and name it in the report line — `spec accepted: <spec path>;
  exit proposal: <path> — <reading>` for Sekkei,
  `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`
  for Keikaku. An exit that falls away from that boundary — a compaction in
  the reading, the human not wanting the plan now — takes the `exit:` line
  like a Kaiseki's.
- **Kaiseki**, attached, is sent `exit: propose your shoroku; write it to <path>`
  when its case closes, writes the proposal, runs the resume self-check, and
  answers `exit proposal: <path> — <reading>`.
- **Kanri** writes its own proposal from the ledger and the roster, never
  from recollection, at two kinds of moment. **At every plan close**, after
  Jisso's T2 proposal and before the recommender is dispatched, so that the
  close's one check covers Kanri's items with everything else — whether or
  not the close's handover is then declined; what the close teaches after
  that file is written goes to a second file, `-2-proposal.md`, whose rows
  go to the roster's Shoroku proposal items table. **At a handover** that is
  not a close: while any ledger is open, the items are `pending` rows in the
  ledger of the topic whose batches are in flight, else the oldest open;
  between plans, with no ledger open, they are rows of the roster's table,
  which move into the next topic's ledger when it opens. No Kanri exit runs
  a recommend, a check, or an apply of its own. A topic the human ends
  before its final batch still gets its close, over what is on disk, with
  Kanri writing the T2 proposal in Jisso's absence.

**The files.** A proposal is `exit-<role>[-<suffix>]-proposal.md` in
`.tanto/<topic>/` — no suffix for Sekkei (`exit-sekkei`) and Keikaku
(`exit-keikaku`), the case number for Kaiseki (`exit-kaiseki-1`), and a
second file at the same boundary takes `-2` before `-proposal` — or, for
Kanri, `.tanto/exit-kanri-<YYYY-MM-DD>-<name>[-2]-proposal.md` next to the
roster. A Jisso has no proposal file but the close's
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

**P11.31 →**

```markdown
- **Jisso** proposes at every boundary, in its report's Shoroku proposal
  section, and that section is its shoroku proposal: one Jisso runs one
  batch, and the boundary Kanri accepts is where it retires. No `exit:` line
  and no proposal file go to a Jisso. At the close the plan's last live
  Jisso writes the close's shoroku proposal on Kanri's line
  `close: propose; write it to .tanto/<topic>/shoroku-proposal-jisso-<short id>.md`
  — the `pending` rows by number and what its own context holds that no
  file does — and is stopped on its form check: no `/clear`, its
  conversation kept.
- **Sekkei and Keikaku** write their proposal unasked at their own final
  boundary and name it in the report line —
  `spec accepted: <spec path>; shoroku proposal: <path> — <reading>` for
  Sekkei,
  `coldread answered: <pointer, one per question, or none>; shoroku proposal: <path> — <reading>`
  for Keikaku. An exit that falls away from that boundary — a compaction in
  the reading, the human not wanting the plan now — takes the `exit:` line
  like a Kaiseki's.
- **Kaiseki**, attached, is sent `exit: propose; write it to <path>` when
  its case closes, writes the proposal, runs the resume self-check, and
  answers `shoroku proposal: <path> — <reading>`.
- **Kanri** writes its own proposal from the ledger and the roster, never
  from recollection, at two kinds of moment. **At every plan close**, after
  Jisso's proposal and before the recommender is dispatched, so that the
  close's one check covers Kanri's items with everything else — whether or
  not the close's handover is then declined; what the close teaches after
  that file is written goes to a further file, the next `-<n>`, whose rows
  go to the roster's Shoroku proposal items table. **At a handover** that is
  not a close: while any ledger is open, the items are `pending` rows in the
  ledger of the topic whose batches are in flight, else the oldest open;
  between plans, with no ledger open, they are rows of the roster's table,
  which move into the next topic's ledger when it opens. No Kanri exit runs
  a recommend, a check, or an apply of its own. A topic the human ends
  before its final batch still gets its close, over what is on disk, with
  Kanri writing the close's shoroku proposal in Jisso's absence.

**The files.** Every proposal file is
`shoroku-proposal-<role>-<short id>.md`, `<short id>` being the first eight
hexadecimal digits of the writing session's `sessionId` — the same eight
digits as a background seat's CLI short id — with `-<n>` before `.md`, `n`
from 2 upward, for a further file by the same session, never a rewrite of
one already written. A proposal file lives in the topic directory,
`.tanto/<topic>/`, and Kanri's in `.tanto/` beside the roster. A session
knows its own `sessionId` from its transcript path; Kanri knows a seat's
from the Transcript column of its row. A Jisso's proposal is its report's
section, and the close's is
`.tanto/<topic>/shoroku-proposal-jisso-<short id>.md`, the last live
Jisso's. The close's other files are named by the step —
`shoroku-recommendation.md`, `shoroku-brief.md`, `shoroku-direction.md`,
`shoroku-review.md`, `shoki-brief.md`, and `batch-shusei-prompt.md` — and
live in the topic directory; there are no others. The close's commit
subjects are `docs: shoroku for <topic>`,
`docs: shoroku for <topic>, review fixes` when shoki's review found
anything, and, when the direction accepted a `fix` item,
`fix: text corrections from <topic>'s close` — the two fixed prefixes,
`docs: shoroku for` and `fix: text corrections`, that the whole-branch
review package excludes.
```

**P11.32** `skills/tanto/SKILL.md` — replace exactly these 10 lines

```markdown
waits on the human's `/clear`: the roster no longer addresses that name,
and the next `/tanto <role>` typed in that window handshakes as a new
session under the same name, which the roster's clear rule expects. A seat
that has stopped answering is past answering, and Kanri learns it the way it
learns of a missing batch report — the human says the window is gone, a
send errors, a `no-role` comes back, or Kanri's window wakes for another
reason and the answer has not arrived. Kanri then treats the exit as forced
— the roster's Events line says the exit shoroku did not run and what was
lost, as far as Kanri knows — marks the row `cleared` or `dead` as the
signal says, and continues.
```

**P11.32 →**

```markdown
waits on the human's `/clear`: the roster no longer addresses that name,
and the next `/tanto <role>` typed in that window handshakes as a new
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

**P11.33** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| `.tanto/<topic>/batch-<X>-report.md` | the Jisso of that batch | Kanri; the close's recommender, its Shoroku proposal section by path and item | fixed skeleton; its Shoroku proposal section is that Jisso's exit shoroku |
```

**P11.33 →**

```markdown
| `.tanto/<topic>/batch-<X>-report.md` | the Jisso of that batch | Kanri; the close's recommender, its Shoroku proposal section by path and item | fixed skeleton; its Shoroku proposal section is that Jisso's shoroku proposal |
```

**P11.34** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
| `.tanto/<topic>/shoroku-proposal.md` | the plan's last live Jisso | Kanri, for its form; the close's recommender, by path | the close's proposal: the `pending` rows by number and what that Jisso's own context holds that no file does, written to a file instead of printed |
| `.tanto/<topic>/exit-<role>[-<suffix>][-2]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>[-2]-proposal.md` | the exiting session — Sekkei, Keikaku, an attached Kaiseki; Kanri at every plan close and at every handover; never Jisso, whose proposal is its report's section | Kanri, for its form; the close's recommender, by path | the exit shoroku proposal, opening with the line that says what it excludes; `-2` a second file at the same boundary, never a rewrite of the first |
| `.tanto/<topic>/t2-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every proposal item once, quoted in full from the source its `pending` row names, in four groups — Recommended adopt, Recommended fix, Recommended reject, Unsure — each with its destination and its one-line reason |
| `.tanto/<topic>/t2-brief.md` | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
| `.tanto/<topic>/t2-direction.md`, beside the recommendation | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
```

**P11.34 →**

```markdown
| `.tanto/<topic>/shoroku-proposal-jisso-<short id>.md` | the plan's last live Jisso | Kanri, for its form; the close's recommender, by path | the close's shoroku proposal: the `pending` rows by number and what that Jisso's own context holds that no file does, written to a file instead of printed |
| `.tanto/<topic>/shoroku-proposal-<role>-<short id>[-<n>].md`, or `.tanto/shoroku-proposal-kanri-<short id>[-<n>].md` | the exiting session — Sekkei, Keikaku, an attached Kaiseki; Kanri at every plan close and at every handover; never Jisso, whose proposal is its report's section | Kanri, for its form; the close's recommender, by path | the session's shoroku proposal, opening with the line that says what it excludes; `-<n>` a further file by the same session, never a rewrite of one already written |
| `.tanto/<topic>/shoroku-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every proposal item once, quoted in full from the source its `pending` row names, in four groups — Recommended adopt, Recommended fix, Recommended reject, Unsure — each with its destination and its one-line reason |
| `.tanto/<topic>/shoroku-brief.md` | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
| `.tanto/<topic>/shoroku-direction.md`, beside the recommendation | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
```

**P11.35** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| `.tanto/<topic>/t2-review.md` | the `shoroku.review` kind shoki dispatches | shoki, then Kanri | the review of shoki's own diff against `main`, before it reports |
```

**P11.35 →**

```markdown
| `.tanto/<topic>/shoroku-review.md` | the `shoroku.review` kind shoki dispatches | shoki, then Kanri | the review of shoki's own diff against `main`, before it reports |
```

**P11.36** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
asks the human to delete either: after T2 the two have the same standing —
```

**P11.36 →**

```markdown
asks the human to delete either: after the close the two have the same standing —
```

**P11.37** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
`.tanto/` reserves these names, and a topic slug is none of them and begins
with neither prefix: the
directories `inbox`, `sent`, `kikaku`, `kaiseki`, and `spawner`; the files
`roster.md`, `roster-archive.md`, `kanri-handover.md`, `.gitignore`, and
`.markdownlint-cli2.yaml`; and the prefixes `exit-kanri-` and `inbox-`.
```

**P11.37 →**

```markdown
`.tanto/` reserves these names, and a topic slug is none of them and begins
with none of the prefixes: the
directories `inbox`, `sent`, `kikaku`, `kaiseki`, and `spawner`; the files
`roster.md`, `roster-archive.md`, `kanri-handover.md`, `.gitignore`, and
`.markdownlint-cli2.yaml`; and the prefixes `shoroku-proposal-kanri-` and
`inbox-`, with `exit-kanri-` kept for the files written before the shoroku
proposal was named, so that a start's listing of `.tanto/` does not report
a predecessor's old file.
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 11
```

Expected: `task 11: verify clean`.

- [ ] **Step 3: Review the README for drift**

Read `skills/tanto/README.md` against the passages above (`AGENTS.md`). The
README names none of the retired terms — `exit shoroku`, `exit proposal`,
`T2`, the stage word — so none should be found there:

```bash
grep -n -i -E 'exit shoroku|exit proposal|\bT2\b|stage word' skills/tanto/README.md
```

Expected: no output (the command exits 1).

- [ ] **Step 4: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
git commit --only skills/tanto/SKILL.md -m "docs: the contract's shoroku vocabulary — shoroku proposal, the close's files by the step, no stage word" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 12 — The templates carry the census's keeping rule, the six-column `S-n` table, and the renamed files and subjects

Spec 6.4: `templates/roster.md` — the keeping rule's bullets on the resumed
tab seat, the handshake by basename, and the census's `dead` (2.1, 2.5,
2.6); the status paragraph — `cleared`'s routes and `stopped`'s "or the
spawner's guard" (2.8, 1.4); the Shoroku proposal items table without its
seventh column, its sentence, and its `-2-proposal` (3.2, 3.5); the Events
catalogue without the `cleared:` shape and with the shoroku proposal line
(3.1), and with the recovery window's two lines and the guard's line (2.3,
1.4). `templates/kanri.md` — the table without its seventh column and its
sentences (3.5), and "shoroku proposal" (3.1). `templates/batch-report.md`
(3.1). `templates/shoki-brief.md` — the file names and the subjects (3.2,
3.4). `templates/shoroku-brief.md` — the file names and the Document line
(3.2). `templates/spawn-request.md` is Task 5's. These are templates a
session reads once (contract rule 11).

**Files:**

- Modify: `skills/tanto/templates/roster.md`, `skills/tanto/templates/kanri.md`, `skills/tanto/templates/batch-report.md`, `skills/tanto/templates/shoki-brief.md`, `skills/tanto/templates/shoroku-brief.md`

**Named-mechanism sites.** The six-column header is also written by
`boundary.js record` (Task 3), read by `boundary.test.js` through these very
templates, named by `SKILL.md`'s Session exit (Task 11), and pinned by check
6 (Task 7). The status words are also `SKILL.md`'s (Task 10) and
`roles/kanri.md`'s (Task 8); the guard's own `strayed` mark behind `stopped`
is Task 1's and Task 5's, as Task 10's own note already lists. The Events lines `recovery: begun` and
`recovery: windows back` are also `roles/kanri.md`'s (Task 8), and check 6
pins the second here (Task 7). The close's files and subjects are also
`SKILL.md`'s (Task 11) and `roles/kanri.md`'s (Task 9).

**O12.1** `instead, as it always did` — "A tab seat that was resumed re-handshakes with `/tanto fukki` instead" (spec's Old values, `templates/roster.md` 21–22); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O12.2** `matches a row's Transcript column is that row's session` — the handshake matched by the full path (`templates/roster.md` 23–25); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O12.3** `different transcript is that window` — the `/clear`-by-name route (`templates/roster.md` 26–28), already gone from `roles/kanri.md` with Task 8; before this task: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O12.4** `an editor restart before` — `dead`'s old list (`templates/roster.md` 29–30); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O12.5** `neither route detects a` — "A cleared window stays listed under its name, so neither route detects a `/clear`" (`templates/roster.md` 31–33); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O12.6** `stopped on Kanri's request, its` — `stopped` without the guard (`templates/roster.md` 62–63), already gone from `SKILL.md` with Task 10; before this task: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O12.7** `came to light another way` — `cleared`'s third route (`templates/roster.md` 66–67); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O12.8** `stage word` — the definitions of the retired column's value (`templates/roster.md` 117, `templates/kanri.md` 55); before: 2 lines over `skills/tanto/templates/`, after: 0; with Tasks 9, 11, and 13, 0 over `SKILL.md`, `roles/`, `templates/`, and `README.md`, case-insensitive.

**O12.9** `Stage` — the retired column and its sentences (`templates/roster.md` 117, 122; `templates/kanri.md` 54, 57, 62); before: 5 lines over `skills/tanto/templates/`, after: 0.

**O12.10** `| Stage |` — the seven-column header (`templates/roster.md` 122, `templates/kanri.md` 62); before: 2 over `skills/tanto/templates/`, after: 0.

**O12.11** `cleared: <old name>` — the Events shape whose last writer retired (spec 2.8, issue-7f28 item 1; `templates/roster.md` 135); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O12.12** `-2-proposal` — `templates/roster.md` 110; before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O12.13** `exit shoroku` — `templates/roster.md` 140, `templates/kanri.md` 102, `templates/batch-report.md` 37; before: 3 lines over `skills/tanto/templates/`, after: 0.

**O12.14** `exit proposal` — `templates/kanri.md` 68 (101 wraps as "an exit" / "proposal"); before: 1 line in `skills/tanto/templates/kanri.md`, after: 0.

**O12.15** `exit-<role>` — `templates/kanri.md` 57; before: 1 in `skills/tanto/templates/kanri.md`, after: 0.

**O12.16** `t2-recommendation` — `templates/kanri.md` 72, `templates/shoki-brief.md` 19; before: 2 over `skills/tanto/templates/`, after: 0.

**O12.17** `t2-brief` — `templates/kanri.md` 72, `templates/shoroku-brief.md` 4; before: 2 over `skills/tanto/templates/`, after: 0.

**O12.18** `t2-direction` — `templates/kanri.md` 74, `templates/shoki-brief.md` 20, `templates/shoroku-brief.md` 36; before: 3 over `skills/tanto/templates/`, after: 0.

**O12.19** `t2-review` — `templates/shoki-brief.md` 69; before: 1, after: 0.

**O12.20** `docs: T2 shoroku` — `templates/shoki-brief.md` 59, 71; before: 2, after: 0.

**O12.21** `— t2 —` — the check brief's Document line (spec 6.4, `templates/shoroku-brief.md` 15); before: 1, after: 0.

**O12.22** `candidate` — already 0 over `SKILL.md`, `roles/`, `templates/`, and `README.md` when the spec measured it, and 0 after every task; the live roster's pre-rename table is migrated by Kanri at this plan's close (spec 3.5 and section 5), never by a task, and the scripts' identifiers and fixtures keep the word.

- [ ] **Step 1: Apply the passages**

Apply P12.23 to P12.36.

**P12.23** `skills/tanto/templates/roster.md` — replace exactly these 17 lines

```markdown
  the Events line `resumed: <old name> → <new name>`, and clear the mark
  with an `ack` request. A tab seat that was resumed re-handshakes with
  `/tanto fukki` instead, as it always did.
- Every handshake rewrites that role's row in full. A handshake whose
  `transcript=` matches a row's Transcript column is that row's session
  resumed, and rewrites the row in place with the new name and `[ref]`, its
  status unchanged. A handshake whose name is on a `live` or `queued` row
  with a different transcript is that window `/clear`ed and re-invoked, in
  any role: the old row goes `cleared`, and a new row is written.
- A row whose session has gone gets status `dead` — a closed tab, a crash,
  an editor restart before `/tanto fukki` for a tab seat; the spawner's
  census marking a terminal seat `gone` that no resume brought back. A
  cleared window stays listed under its name, so neither route detects a
  `/clear`. A stopped, dead, replaced, refused, or cleared row stays, with
  its Residency row, until the plan closes, then both move to
  `roster-archive.md` as one row, so the run stays readable after a
  replacement and the roster stays short.
```

**P12.23 →**

```markdown
  the Events line `resumed: <old name> → <new name>`, and clear the mark
  with an `ack` request. A tab seat the editor resumed is renamed the same
  way by Kanri's census, which finds its `sessionId` under the new name;
  nothing is typed in the tab.
- Every handshake rewrites that role's row in full. A handshake whose
  `sessionId` — the basename of its `transcript=` — is a row's Transcript
  basename is that row's session resumed, and rewrites the row in place with
  the new name and `[ref]`, its status unchanged.
- A row whose session has gone gets status `dead`: a `live` or `queued` row
  whose `sessionId` the census does not list — a closed tab, a crash, a
  `/clear`ed window, whose session is no longer the one listed — except
  while a restart is being recovered. A stopped, dead, replaced, refused, or
  cleared row stays, with its Residency row, until the plan closes, then
  both move to `roster-archive.md` as one row, so the run stays readable
  after a replacement and the roster stays short.
```

**P12.24** `skills/tanto/templates/roster.md` — replace exactly these 10 lines

```markdown
`(idle since <HH:MM>)`, which Kanri writes while a Kikaku, Hosa, or Kaiseki
idles and the intake's address rule reads, so a reader tests the cell's
first word, not the whole cell. `queued` is a Jisso of a skill-editing plan
waiting for its batch prompt, in spawn order. `stopped` is a terminal seat
the spawner stopped on Kanri's request, its conversation kept, or a `queued`
row that never ran. `cleared`
records a tab seat Kanri released — `release:` sent, the row marked as the
line goes out — or whose `/clear` came to light another way: a handshake
under a name already here with a different transcript, in any role, or a
`no-role` reply to a line Kanri sent. `replaced` is the old row of a Kanri
```

**P12.24 →**

```markdown
`(idle since <HH:MM>)`, which Kanri appends while a Kikaku, Hosa, or Kaiseki
idles and the intake's address rule reads, so a reader tests the cell's
first word, not the whole cell. `queued` is a Jisso of a skill-editing plan
waiting for its batch prompt, in spawn order. `stopped` is a terminal seat
the spawner stopped on Kanri's request or the spawner's guard stopped, its
conversation kept, or a `queued` row that never ran. `cleared` records a
tab seat Kanri released — `release:` sent, the row marked as the line goes
out — or whose `/clear` a `no-role` reply to a line Kanri sent revealed;
whichever of that reply and the census sees a `/clear` first sets the
status. `dead` is a session the census no longer lists. `replaced` is the old row of a Kanri
```

**P12.25** `skills/tanto/templates/roster.md` — replace exactly these 17 lines

```markdown
Between plans there is no conductor ledger, so an item raised then — by a
Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's `-2-proposal.md` — is recorded here with
the same seven columns the ledger uses. When a topic opens, Kanri moves the
rows into the new ledger's table; nothing is written out from this table
itself, so every row here says `no` until it moves.

Columns as the ledger's, with Source the file, report, or session that
raised it; Destination one of requirements, design, decisions, issues, notes,
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word
`t2` for every row, the close of the topic the row moves into being what
recommends it; and Written `no` or the subject of the commit that wrote the
row out. The placeholder row stays until the first item arrives.

| S-n | Source | Item | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| (no item yet) | | | | | | |
```

**P12.25 →**

```markdown
Between plans there is no conductor ledger, so an item raised then — by a
Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's further proposal file — is recorded here
with the same six columns the ledger uses. When a topic opens, Kanri moves
the rows into the new ledger's table; nothing is written out from this table
itself, so every row here says `no` until it moves.

Columns as the ledger's, with Source the file, report, or session that
raised it; Destination one of requirements, design, decisions, issues, notes,
or reports; Adopted one of `pending`, `yes`, and `no`; and Written `no` or
the subject of the commit that wrote the row out. The placeholder row stays
until the first item arrives.

| S-n | Source | Item | Destination | Adopted | Written |
| --- | --- | --- | --- | --- | --- |
| (no item yet) | | | | | |
```

**P12.26** `skills/tanto/templates/roster.md` — replace exactly these 9 lines

```markdown
  ledger's path recorded; a VS Code restart and which roles were recreated;
  resumed: <old name> → <new name>;
  cleared: <old name> → <new name>;
  queued: <name> [<ref>] as Jisso <n> of <topic>;
  released: <name> [<ref>] — <role>, <what it left on disk>;
  no-role from <name> [<ref>] — <what was lost>;
  a handover written by <name> [<ref>];
  a handover accepted by <name> [<ref>] from <name> [<ref>]; an exit shoroku
  proposed by <name> [<ref>], or not run and what was lost;
```

**P12.26 →**

```markdown
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

**P12.27** `skills/tanto/templates/kanri.md` — replace exactly these 12 lines

```markdown
Item, one line; Destination, one of requirements, design, decisions,
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t2` for every row of this table, whichever moment raised
it, since the close is the one stage that recommends a ledger's rows, and
`exit-<role>[-<suffix>]` names a proposal file, never a Stage value; Written,
`no` or the subject of the commit
that wrote the row out. The placeholder row stays until the first item
arrives.

| S-n | Source | Item | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| (no item yet) | | | | | | |
```

**P12.27 →**

```markdown
Item, one line; Destination, one of requirements, design, decisions,
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`;
Written, `no` or the subject of the commit that wrote the row out. The
placeholder row stays until the first item arrives.

| S-n | Source | Item | Destination | Adopted | Written |
| --- | --- | --- | --- | --- | --- |
| (no item yet) | | | | | |
```

**P12.28** `skills/tanto/templates/kanri.md` — replace exactly these 7 lines

```markdown
`blocks this task: no` items, a review report, a session's exit proposal,
the spec's four sections, or a Kanri exit that fell while this ledger was
open — and stays `pending` until the close. At the close Kanri dispatches
the `shoroku.recommend` kind over Jisso's proposal and every source these
rows name, to write `t2-recommendation.md` and `t2-brief.md`; gives the
human both paths, the three counts, and the brief verbatim; and writes
`t2-direction.md` from the human's answer, and these rows with it, Adopted
```

**P12.28 →**

```markdown
`blocks this task: no` items, a review report, a session's shoroku proposal,
the spec's four sections, or a Kanri exit that fell while this ledger was
open — and stays `pending` until the close. At the close Kanri dispatches
the `shoroku.recommend` kind over Jisso's proposal and every source these
rows name, to write `shoroku-recommendation.md` and `shoroku-brief.md`;
gives the human both paths, the three counts, and the brief verbatim; and
writes `shoroku-direction.md` from the human's answer, and these rows with it, Adopted
```

**P12.29** `skills/tanto/templates/kanri.md` — replace exactly these 3 lines

```markdown
  two batches is two lines and twice in one batch is one; an exit
  proposal form-checked and its
  rows recorded, or an exit shoroku not run and what was lost; a human access
```

**P12.29 →**

```markdown
  two batches is two lines and twice in one batch is one; a shoroku
  proposal form-checked and its
  rows recorded, or a shoroku proposal not written and what was lost; a human access
```

**P12.30** `skills/tanto/templates/batch-report.md` — replace exactly this 1 line

```markdown
<This section is this Jisso's exit shoroku: the items this batch raised
```

**P12.30 →**

```markdown
<This section is this Jisso's shoroku proposal: the items this batch raised
```

**P12.31** `skills/tanto/templates/shoki-brief.md` — replace exactly these 2 lines

```markdown
- Recommendation — <.tanto/<topic>/t2-recommendation.md>
- Direction — <.tanto/<topic>/t2-direction.md>
```

**P12.31 →**

```markdown
- Recommendation — <.tanto/<topic>/shoroku-recommendation.md>
- Direction — <.tanto/<topic>/shoroku-direction.md>
```

**P12.32** `skills/tanto/templates/shoki-brief.md` — replace exactly this 1 line

```markdown
   `docs: T2 shoroku for <topic>`, and the inbox copies by path. It writes
```

**P12.32 →**

```markdown
   `docs: shoroku for <topic>`, and the inbox copies by path. It writes
```

**P12.33** `skills/tanto/templates/shoki-brief.md` — replace exactly these 3 lines

```markdown
   it writes `.tanto/<topic>/t2-review.md` in the main checkout. On findings,
   dispatch `shoroku.apply` once more with them and commit as
   `docs: T2 shoroku for <topic>, review fixes`. Never a third time: a second
```

**P12.33 →**

```markdown
   it writes `.tanto/<topic>/shoroku-review.md` in the main checkout. On findings,
   dispatch `shoroku.apply` once more with them and commit as
   `docs: shoroku for <topic>, review fixes`. Never a third time: a second
```

**P12.34** `skills/tanto/templates/shoroku-brief.md` — replace exactly this 1 line

```markdown
recommendation, at `.tanto/<topic>/t2-brief.md`, beside the recommendation
```

**P12.34 →**

```markdown
recommendation, at `.tanto/<topic>/shoroku-brief.md`, beside the recommendation
```

**P12.35** `skills/tanto/templates/shoroku-brief.md` — replace exactly this 1 line

```markdown
Document: <the recommendation's path> — t2 — written <YYYY-MM-DD> on
```

**P12.35 →**

```markdown
Document: <the recommendation's path> — written <YYYY-MM-DD> on
```

**P12.36** `skills/tanto/templates/shoroku-brief.md` — replace exactly this 1 line

```markdown
What you answer is what Kanri writes into `t2-direction.md`, item by item;
```

**P12.36 →**

```markdown
What you answer is what Kanri writes into `shoroku-direction.md`, item by item;
```

- [ ] **Step 2: Run the scripts' tests against the new templates**

`boundary.test.js` and `spawner.test.js` copy `templates/kanri.md` and
`templates/roster.md` and write into them through `boundary.js record`, so
the six-column table is exercised here as well as in Task 3's own test.

```bash
node --test skills/tanto/scripts/boundary.test.js skills/tanto/scripts/spawner.test.js
```

Expected: PASS, every test.

- [ ] **Step 3: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 12
```

Expected: `task 12: verify clean`.

- [ ] **Step 4: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/templates/roster.md skills/tanto/templates/kanri.md skills/tanto/templates/batch-report.md skills/tanto/templates/shoki-brief.md skills/tanto/templates/shoroku-brief.md
git commit --only skills/tanto/templates/roster.md skills/tanto/templates/kanri.md skills/tanto/templates/batch-report.md skills/tanto/templates/shoki-brief.md skills/tanto/templates/shoroku-brief.md -m "docs: the templates' census keeping rule, six-column S-n tables, and the close's renamed files" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed (the templates are outside
markdownlint's scope, the other hooks still run); one commit.

### Task 13 — The six other role files say "shoroku proposal", name their files by the session, and send the new lines

Spec 6.3: `roles/sekkei.md` — "exit shoroku" and the bare "exit proposal"
(3.1), `**Your exit shoroku.**` (3.6), the stage-word sentence gone and the
path `shoroku-proposal-sekkei-<short id>.md` with `-<n>` for a further one
(3.2), the `spec accepted:` line and the `exit:` line (3.3);
`roles/keikaku.md` — the same for Keikaku, its `coldread answered:` line;
`roles/jisso.md` — line 5 (3.1), the heading (3.6), the `T2:` lines and "at
T2" (3.3), the close's file (3.2); `roles/kaiseki.md` — the `exit:` line and
the answer (3.3), its file (3.2); `roles/hosa.md` and `roles/kikaku.md` —
"no exit shoroku" (3.1).

**Two additions the spec's file list does not name, flagged for the
reviewer.** `roles/kikaku.md`'s Lifecycle and `roles/hosa.md`'s each state
the handshake-by-name route to `cleared` — "re-handshakes … and Kanri
marks the old row `cleared`" — which spec 2.5 and 2.8 retire: after a
`/clear` the old row is the census's, which marks it `dead` when it no
longer lists its `sessionId`. `roles/kikaku.md` also says a `/tanto fukki`
after an editor restart "matches the transcript", where spec 2.6 has
nothing typed and the match by `sessionId`. And `roles/keikaku.md`'s Handoff
calls the spawner's pass "the census" (spec 1.3).

**Files:**

- Modify: `skills/tanto/roles/sekkei.md`, `skills/tanto/roles/keikaku.md`, `skills/tanto/roles/jisso.md`, `skills/tanto/roles/kaiseki.md`, `skills/tanto/roles/hosa.md`, `skills/tanto/roles/kikaku.md`

**Named-mechanism sites.** The `close:` line is also `SKILL.md`'s (Task 11)
and `roles/kanri.md`'s (Task 9), pinned by check 24 (Task 7). The `exit:`
line and the `shoroku proposal:` reply are also `SKILL.md`'s (Task 11) and
`roles/kanri.md`'s (Task 9). The proposal file names are also `SKILL.md`'s
(Task 11) and `roles/kanri.md`'s (Task 9). The `cleared` and `dead` routes
are also `SKILL.md`'s status list (Task 10), `roles/kanri.md`'s (Task 8),
and `templates/roster.md`'s (Task 12). The heading
`## The close and the exit — the shoroku proposal` has no pointer. This
task's own edit to `roles/keikaku.md`'s Handoff sentence — "the census" for
the spawner's pass becomes "the spawner's census" — is the third of the
four sentences the Overview's "Two renamings" paragraph names; the other
three are Task 8's and Task 10's.

**O13.1** `Your tenure ends here, and your exit shoroku is part of it.` — spec's Old values (`roles/sekkei.md` 142); before: 1 in `skills/tanto/roles/sekkei.md`, after: 0.

**O13.2** `spec accepted: <spec path>; exit proposal:` — spec's Old values (`roles/sekkei.md` 146); before: 1 in `skills/tanto/roles/sekkei.md`, after: 0.

**O13.3** `**Your exit shoroku.**` — the bullet's lead (spec 3.6; `roles/sekkei.md` 188, `roles/keikaku.md` 354); before: 2 over `skills/tanto/roles/`, after: 0.

**O13.4** `stage word` — "The stage word is `exit-sekkei`" and "`exit-keikaku`" (spec's Old values, `roles/sekkei.md` 197, `roles/keikaku.md` 356; issue-e3e4); before: 2 over `skills/tanto/roles/` besides `roles/kanri.md`, after: 0.

**O13.5** `exit-sekkei` — `roles/sekkei.md` 198, 199, 210; before: 3 in `skills/tanto/roles/sekkei.md`, after: 0; 0 over `SKILL.md`, `roles/`, and `templates/` once Task 11 has landed.

**O13.6** `exit-keikaku` — `roles/keikaku.md` 356, 357, 374; before: 3 in `skills/tanto/roles/keikaku.md`, after: 0.

**O13.7** `exit-kaiseki` — `roles/kaiseki.md` 85; before: 1 in `skills/tanto/roles/kaiseki.md`, after: 0.

**O13.8** `exit: propose your shoroku` — the `exit:` line (`roles/sekkei.md` 215, `roles/keikaku.md` 378, `roles/kaiseki.md` 84); before: 3 over these three files, after: 0.

**O13.9** `exit proposal` — the noun and the reply (`roles/sekkei.md` 144, 146, 216; `roles/keikaku.md` 311, 379; `roles/kaiseki.md` 86); before: 6 lines over these three files, after: 0.

**O13.10** `exit shoroku` — `roles/sekkei.md` 142, 188; `roles/keikaku.md` 354; `roles/jisso.md` 83; `roles/hosa.md` 97; `roles/kikaku.md` 60; before: 6 lines over these six files, after: 0.

**O13.11** `the plan's last Jisso owns the T2 shoroku proposal` — spec's Old values (`roles/jisso.md` 5; issue-5a2d); before: 1 in `skills/tanto/roles/jisso.md`, after: 0.

**O13.12** `## T2 and the exit — the shoroku write-out` — the heading (spec 3.6, `roles/jisso.md` 313); before: 1, after: 0.

**O13.13** `T2` — `roles/jisso.md` 5, 89, 90, 285, 289, 310, 313, 322, 338; before: 9 lines in `skills/tanto/roles/jisso.md`, after: 0; with Tasks 9 and 11, 0 over `SKILL.md`, `roles/`, `templates/`, and `README.md`.

**O13.14** `shoroku-proposal.md` — the close's file (`roles/jisso.md` 289, 323); before: 2 in `skills/tanto/roles/jisso.md`, after: 0.

**O13.15** `-2-proposal` — `roles/sekkei.md` 210, `roles/keikaku.md` 374; before: 2, after: 0.

**O13.16** `rename being the census's to notice` — "the census" for the spawner's pass (`roles/keikaku.md` 308); before: 1, after: 0.

**O13.17** `Kanri marks the old row` — the `/clear`-by-name route (`roles/hosa.md` 110 — see above); before: 1 in `skills/tanto/roles/hosa.md`, after: 0.

**O13.18** `matches the transcript as for any` — `roles/kikaku.md` 66 (see above); before: 1 in `skills/tanto/roles/kikaku.md`, after: 0.

- [ ] **Step 1: Apply the passages**

Apply P13.19 to P13.37.

**P13.19** `skills/tanto/roles/sekkei.md` — replace exactly these 5 lines

```markdown
Your tenure ends here, and your exit shoroku is part of it. When the human's
answers are in `dialogue.md` and the edits they asked for are committed — or
are in the draft — write your exit proposal as the bullet below describes, run
the self-check of `SKILL.md`'s Resuming, and send Kanri **one** line naming
both: `spec accepted: <spec path>; exit proposal: <path> — <reading>`. Then
```

**P13.19 →**

```markdown
Your tenure ends here, and your shoroku proposal is part of it. When the
human's answers are in `dialogue.md` and the edits they asked for are
committed — or are in the draft — write your shoroku proposal as the bullet
below describes, run the self-check of `SKILL.md`'s Resuming, and send Kanri
**one** line naming both:
`spec accepted: <spec path>; shoroku proposal: <path> — <reading>`. Then
```

**P13.20** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
- **Your exit shoroku.** You write it **unasked**, at your own final boundary,
  as the last act before the `spec accepted:` line above, and you name it in
  that same line.
```

**P13.20 →**

```markdown
- **Your shoroku proposal.** You write it **unasked**, at your own final
  boundary, as the last act before the `spec accepted:` line above, and you
  name it in that same line.
```

**P13.21** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
  observations about the process, and the defects noticed. The stage word is
  `exit-sekkei`, no suffix, and the proposal goes to
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
```

**P13.21 →**

```markdown
  observations about the process, and the defects noticed. The proposal
  goes to `.tanto/<topic>/shoroku-proposal-sekkei-<short id>.md`,
  `<short id>` the first eight hexadecimal digits of your own `sessionId`,
  the basename of your transcript path. Then stop
```

**P13.22** `skills/tanto/roles/sekkei.md` — replace exactly these 9 lines

```markdown
  question that changes the spec, a review answer that changes it — write a
  second proposal at
  `.tanto/<topic>/exit-sekkei-2-proposal.md` holding only the delta since the
  first, and name it in the line that reports the work; a proposal you have
  named is never rewritten, because Kanri may already have recorded its items.
  An exit that falls away from this boundary — a compaction in your reading, a
  replacement — still arrives as Kanri's
  `exit: propose your shoroku; write it to <path>`, and you answer
  `exit proposal: <path> — <reading>` as any other role does. You write nothing
```

**P13.22 →**

```markdown
  question that changes the spec, a review answer that changes it — write a
  further proposal at
  `.tanto/<topic>/shoroku-proposal-sekkei-<short id>-<n>.md`, `n` from 2
  upward, holding only the delta since the last, and name it in the line
  that reports the work; a proposal you have named is never rewritten,
  because Kanri may already have recorded its items.
  An exit that falls away from this boundary — a compaction in your reading, a
  replacement — still arrives as Kanri's
  `exit: propose; write it to <path>`, and you answer
  `shoroku proposal: <path> — <reading>` as any other role does. You write nothing
```

**P13.23** `skills/tanto/roles/keikaku.md` — replace exactly these 8 lines

````markdown
the one boundary you can see coming: one message in, one line back. So, after the edits, write your exit
proposal as the bullet below describes and send **one** line carrying every
pointer and the proposal — no self-check runs first, a terminal seat's
rename being the census's to notice:

```text
coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>
```
````

**P13.23 →**

````markdown
the one boundary you can see coming: one message in, one line back. So, after the edits, write your shoroku
proposal as the bullet below describes and send **one** line carrying every
pointer and the proposal — no self-check runs first, a terminal seat's
rename being for the spawner's census to notice:

```text
coldread answered: <pointer, one per question, or none>; shoroku proposal: <path> — <reading>
```
````

**P13.24** `skills/tanto/roles/keikaku.md` — replace exactly these 4 lines

```markdown
- **Your exit shoroku.** You write it **unasked**, after the cold-read edits
  and before the `coldread answered:` line above, and you name it in that same
  line. The stage word is `exit-keikaku`, no suffix, and the proposal goes
  to `.tanto/<topic>/exit-keikaku-proposal.md`. Your proposal items are the
```

**P13.24 →**

```markdown
- **Your shoroku proposal.** You write it **unasked**, after the cold-read
  edits and before the `coldread answered:` line above, and you name it in
  that same line. The proposal goes to
  `.tanto/<topic>/shoroku-proposal-keikaku-<short id>.md`, `<short id>` the
  first eight hexadecimal digits of your own `sessionId`, the basename of
  your transcript path. Your proposal items are the
```

**P13.25** `skills/tanto/roles/keikaku.md` — replace exactly these 8 lines

```markdown
  the plan, a second cold-read question — is answered with a second proposal
  at
  `.tanto/<topic>/exit-keikaku-2-proposal.md` holding only the delta since the
  first, named in the line that reports the work; a proposal you have named is
  never rewritten, because Kanri may already have recorded its items. An exit that falls away from this boundary — the human not wanting the plan
  now, a compaction in your reading, a replacement — still arrives as Kanri's
  `exit: propose your shoroku; write it to <path>`, and you answer
  `exit proposal: <path> — <reading>` as any other role does.
```

**P13.25 →**

```markdown
  the plan, a second cold-read question — is answered with a further
  proposal at
  `.tanto/<topic>/shoroku-proposal-keikaku-<short id>-<n>.md`, `n` from 2
  upward, holding only the delta since the last, named in the line that
  reports the work; a proposal you have named is never rewritten, because
  Kanri may already have recorded its items. An exit that falls away from this boundary — the human not wanting the plan
  now, a compaction in your reading, a replacement — still arrives as Kanri's
  `exit: propose; write it to <path>`, and you answer
  `shoroku proposal: <path> — <reading>` as any other role does.
```

**P13.26** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```markdown
and its commits; the plan's last Jisso owns the T2 shoroku proposal.
```

**P13.26 →**

```markdown
and its commits; the plan's last Jisso owns the close's shoroku proposal.
```

**P13.27** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```markdown
   report's Shoroku proposal section is your exit shoroku, nothing else is
```

**P13.27 →**

```markdown
   report's Shoroku proposal section is your shoroku proposal, nothing else is
```

**P13.28** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```markdown
   takes the `T2:` line below; and the fix wave itself, whose Jisso is not
   stopped at its boundary either, but takes the `T2:` line once Kanri
```

**P13.28 →**

```markdown
   takes the `close:` line below; and the fix wave itself, whose Jisso is not
   stopped at its boundary either, but takes the `close:` line once Kanri
```

**P13.29** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```markdown
| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the SDD ledger; nobody deletes it at the close, and `.tanto/<topic>/`, which holds the conductor ledger, the reports, and the T2 source, stays on the same terms (issue-12d3) |
```

**P13.29 →**

```markdown
| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the SDD ledger; nobody deletes it at the close, and `.tanto/<topic>/`, which holds the conductor ledger, the reports, and the close's sources, stays on the same terms (issue-12d3) |
```

**P13.30** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```markdown
| `shoroku` — propose in chat, wait for the human's `Direction?`, never start without their explicit confirmation | write the proposal to a file — the report's section at a boundary, `shoroku-proposal.md` at T2 — and stop there; a dispatched recommender reads it at the close and the human checks the recommendation by exception | you do not talk to the human unless Kanri grants it, and every item reaches the human that way |
```

**P13.30 →**

```markdown
| `shoroku` — propose in chat, wait for the human's `Direction?`, never start without their explicit confirmation | write the proposal to a file — the report's section at a boundary, `shoroku-proposal-jisso-<short id>.md` at the close — and stop there; a dispatched recommender reads it at the close and the human checks the recommendation by exception | you do not talk to the human unless Kanri grants it, and every item reaches the human that way |
```

**P13.31** `skills/tanto/roles/jisso.md` — replace exactly these 4 lines

```markdown
5. When Kanri accepts it you are the plan's last Jisso: the `T2:` line
   follows, not the `stop`.

## T2 and the exit — the shoroku write-out
```

**P13.31 →**

```markdown
5. When Kanri accepts it you are the plan's last Jisso: the `close:` line
   follows, not the `stop`.

## The close and the exit — the shoroku proposal
```

**P13.32** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```markdown
**Propose.** On Kanri's T2 prompt, write the numbered list to
`shoroku-proposal.md` in the topic directory, `.tanto/<topic>/`, **instead
of printing it**, in two parts: first the conductor ledger's `pending`
```

**P13.32 →**

```markdown
**Propose.** On Kanri's `close:` line —
`close: propose; write it to .tanto/<topic>/shoroku-proposal-jisso-<short id>.md`,
`<short id>` the first eight hexadecimal digits of your own `sessionId` —
write the numbered list to that file **instead of printing it**, in two
parts: first the conductor ledger's `pending`
```

**P13.33** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```markdown
proposal — no `exit:` line comes, no exit file is written. The last Jisso
leaves at T2: the `T2:` line, the proposal above, and the `stop` on its form
```

**P13.33 →**

```markdown
proposal — no `exit:` line comes, no proposal file is written. The last
Jisso leaves at the close: the `close:` line, the proposal above, and the `stop` on its form
```

**P13.34** `skills/tanto/roles/kaiseki.md` — replace exactly these 3 lines

```markdown
`exit: propose your shoroku; write it to <path>`, write them to
`.tanto/<topic>/exit-kaiseki-<n>-proposal.md`, run the self-check of
`SKILL.md`'s Resuming, and answer `exit proposal: <path> — <reading>`. Then
```

**P13.34 →**

```markdown
`exit: propose; write it to <path>`, write them to the path it names,
`.tanto/<topic>/shoroku-proposal-kaiseki-<short id>.md`, run the self-check of
`SKILL.md`'s Resuming, and answer `shoroku proposal: <path> — <reading>`. Then
```

**P13.35** `skills/tanto/roles/hosa.md` — replace exactly this 1 line

```markdown
replace row, and no exit shoroku. The human `/clear`s this window at will.
```

**P13.35 →**

```markdown
replace row, and you write no shoroku proposal. The human `/clear`s this window at will.
```

**P13.36** `skills/tanto/roles/hosa.md` — replace exactly these 2 lines

```markdown
The next `/tanto` in it, in any role, re-handshakes as a new session, and
Kanri marks the old row `cleared`. Your closing line after a chore names
```

**P13.36 →**

```markdown
The next `/tanto` in it, in any role, re-handshakes as a new session with a
new `sessionId`, and Kanri's census, which no longer lists the old one,
marks the old row `dead`. Your closing line after a chore names
```

**P13.37** `skills/tanto/roles/kikaku.md` — replace exactly these 8 lines

```markdown
ask, no request, no `release:` line, no replace row, and no exit shoroku:
what you produce is on disk before the window closes.

The human `/clear`s this window when the subject changes. The next `/tanto`
in it, in any role, re-handshakes with a new transcript, and Kanri writes a
new row and marks the old one `cleared` — the rule every window follows. A
`/tanto fukki` after an editor restart matches the transcript as for any
role. Your `decision: <path>` line carries the `no-role` line as its second line,
```

**P13.37 →**

```markdown
ask, no request, no `release:` line, no replace row, and no shoroku
proposal: what you produce is on disk before the window closes.

The human `/clear`s this window when the subject changes. The next `/tanto`
in it, in any role, re-handshakes with a new transcript, and Kanri writes a
new row; its census, which no longer lists the old `sessionId`, marks the
old row `dead` — the rule every window follows. After an editor restart
nothing is typed here: Kanri's census finds this session under its new name
by its `sessionId`, and `/tanto fukki` stays accepted. Your `decision: <path>` line carries the `no-role` line as its second line,
```

- [ ] **Step 2: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 13
```

Expected: `task 13: verify clean`.

- [ ] **Step 3: Lint and commit**

```bash
./scripts/lint.sh skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/hosa.md skills/tanto/roles/kikaku.md
git commit --only skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/hosa.md skills/tanto/roles/kikaku.md -m "docs: the role files' shoroku proposal, their files by the session, and the census's dead for a cleared window" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit.

### Task 14 — Close the identity group: issue-02ab, issue-894d, issue-d92f, issue-261c, and issue-7f28

Spec, "Issues this design closes": the identity rule of section 2 closes
these five, and its last file lands with Tasks 12 and 13 in this batch.
Each issue is moved with `git mv` and its `updated:` bumped
(`docs/issues/AGENTS.md`), and gains one paragraph saying what closed it.
The date is the design's, fixed so that each block is exact. No living
document links to these issues by path (`grep -rn 'docs/issues/open/<id>'`
outside `docs/superpowers/` finds none), so the move breaks no inbound link.

**Files:**

- Move: `docs/issues/open/02ab-a-stale-live-row-treated-as-superseded-by-inference.md`, `docs/issues/open/894d-a-clear-can-reuse-the-same-name-and-ref-for-a-genuinely-new-session.md`, `docs/issues/open/d92f-tanto-fukkis-transcript-path-identity-check-breaks-under-a-symlinked-config-dir-change.md`, `docs/issues/open/261c-a-live-but-unreachable-kikaku-hosa-row-has-no-timeout.md`, and `docs/issues/open/7f28-three-roster-template-vocabulary-drifts-after-seat-lineage.md` → `docs/issues/resolved/`

- [ ] **Step 1: Check that no living document links to the five by path**

```bash
grep -rln -E 'issues/open/(02ab|894d|d92f|261c|7f28)-' docs skills ./*.md --include='*.md' | grep -v '^docs/superpowers/' || true
```

Expected: no output. A path found here is rewritten to `resolved/` in this
task's commit, as `docs/issues/AGENTS.md` asks.

- [ ] **Step 2: Apply the passages**

Apply P14.1 to P14.10.

**P14.1** `docs/issues/open/02ab-a-stale-live-row-treated-as-superseded-by-inference.md` — replace exactly this 1 line

```markdown
updated: 2026-09-20
```

**P14.1 →**

```markdown
updated: 2026-09-23
```

**P14.2** `docs/issues/open/02ab-a-stale-live-row-treated-as-superseded-by-inference.md` — replace exactly these 2 lines

```markdown
as a third path, with its conditions written down, or must the mechanical
signal always be obtained first?
```

**P14.2 →**

```markdown
as a third path, with its conditions written down, or must the mechanical
signal always be obtained first?

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 2.1 and
2.5): the mechanical signal is always obtained, and it is cheap.
`boundary.js census` lists every session under the repository, and at every
handshake Kanri marks `dead` each `live` or `queued` row whose `sessionId`
it does not list, before the new row is written — so a stale row no longer
refuses a fresh handshake, and nothing is settled by inference.
```

**P14.3** `docs/issues/open/894d-a-clear-can-reuse-the-same-name-and-ref-for-a-genuinely-new-session.md` — replace exactly this 1 line

```markdown
updated: 2026-09-20
```

**P14.3 →**

```markdown
updated: 2026-09-23
```

**P14.4** `docs/issues/open/894d-a-clear-can-reuse-the-same-name-and-ref-for-a-genuinely-new-session.md` — replace exactly these 2 lines

```markdown
`seat-lineage` fix wave added above. The point for a future mechanism is the
key: `(name, transcript)`, never `[ref]` alone.
```

**P14.4 →**

```markdown
`seat-lineage` fix wave added above. The point for a future mechanism is the
key: `(name, transcript)`, never `[ref]` alone.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 2.1): the
key is the `sessionId` alone. Every match of a session to a roster row — a
handshake, `/tanto fukki`, Kanri's start, the census — compares
`sessionId`s, never a name, a `[ref]`, or a full path, so a name and a
`[ref]` a `/clear` hands to a new session match no row.
```

**P14.5** `docs/issues/open/d92f-tanto-fukkis-transcript-path-identity-check-breaks-under-a-symlinked-config-dir-change.md` — replace exactly this 1 line

```markdown
updated: 2026-09-22
```

**P14.5 →**

```markdown
updated: 2026-09-23
```

**P14.6** `docs/issues/open/d92f-tanto-fukkis-transcript-path-identity-check-breaks-under-a-symlinked-config-dir-change.md` — replace exactly these 2 lines

```markdown
still breaks when `CLAUDE_CONFIG_DIR` changes under an identical file. The two
proposed fixes stand as written for that narrower case.
```

**P14.6 →**

```markdown
still breaks when `CLAUDE_CONFIG_DIR` changes under an identical file. The two
proposed fixes stand as written for that narrower case.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 2.1 and
2.6), for the tab seats too: the match is the Transcript column's basename,
the `sessionId`, which is the same under either spelling of the config
directory, and neither proposed fix is needed. After an editor restart a tab
seat needs no `/tanto fukki` at all — Kanri's census finds it under its new
name — and one typed there matches by the same basename.
```

**P14.7** `docs/issues/open/261c-a-live-but-unreachable-kikaku-hosa-row-has-no-timeout.md` — replace exactly this 1 line

```markdown
updated: 2026-09-19
```

**P14.7 →**

```markdown
updated: 2026-09-23
```

**P14.8** `docs/issues/open/261c-a-live-but-unreachable-kikaku-hosa-row-has-no-timeout.md` — replace exactly these 2 lines

```markdown
may be marked `dead` outright on Kanri's own ruling, with the human still
able to override by opening a fresh session at any time regardless, as today.
```

**P14.8 →**

```markdown
may be marked `dead` outright on Kanri's own ruling, with the human still
able to override by opening a fresh session at any time regardless, as today.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 2.1),
with no timeout: the census is the signal for a Kikaku or Hosa row as for
any other, and a `live` row whose `sessionId` it does not list is `dead` on
that signal alone.
```

**P14.9** `docs/issues/open/7f28-three-roster-template-vocabulary-drifts-after-seat-lineage.md` — replace exactly this 1 line

```markdown
updated: 2026-09-19
```

**P14.9 →**

```markdown
updated: 2026-09-23
```

**P14.10** `docs/issues/open/7f28-three-roster-template-vocabulary-drifts-after-seat-lineage.md` — replace exactly this 1 line

```markdown
A template-consistency gap, not a user-stated need, so no paired requirement.
```

**P14.10 →**

```markdown
A template-consistency gap, not a user-stated need, so no paired requirement.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 2.8).
Item 1: the handshake-by-name route to `cleared` retired, and the `cleared:`
Events shape left `templates/roster.md` with its last writer; `cleared` has
two routes left, `release:` and a `no-role` reply. Item 2 was already gone
from `roles/kanri.md`. Item 3: `idle since` is the suffix
`(idle since <HH:MM>)` of a `live` cell, which `roles/kanri.md` now says
Kanri appends and `SKILL.md`'s status list names beside the seven words.
```

- [ ] **Step 3: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 14
```

Expected: `task 14: verify clean`. It runs before the moves, since every
passage names an `open/` path.

- [ ] **Step 4: Move the five issues**

```bash
git mv docs/issues/open/02ab-a-stale-live-row-treated-as-superseded-by-inference.md docs/issues/resolved/
git mv docs/issues/open/894d-a-clear-can-reuse-the-same-name-and-ref-for-a-genuinely-new-session.md docs/issues/resolved/
git mv docs/issues/open/d92f-tanto-fukkis-transcript-path-identity-check-breaks-under-a-symlinked-config-dir-change.md docs/issues/resolved/
git mv docs/issues/open/261c-a-live-but-unreachable-kikaku-hosa-row-has-no-timeout.md docs/issues/resolved/
git mv docs/issues/open/7f28-three-roster-template-vocabulary-drifts-after-seat-lineage.md docs/issues/resolved/
```

- [ ] **Step 5: Lint and commit**

```bash
./scripts/lint.sh docs/issues/resolved/02ab-a-stale-live-row-treated-as-superseded-by-inference.md docs/issues/resolved/894d-a-clear-can-reuse-the-same-name-and-ref-for-a-genuinely-new-session.md docs/issues/resolved/d92f-tanto-fukkis-transcript-path-identity-check-breaks-under-a-symlinked-config-dir-change.md docs/issues/resolved/261c-a-live-but-unreachable-kikaku-hosa-row-has-no-timeout.md docs/issues/resolved/7f28-three-roster-template-vocabulary-drifts-after-seat-lineage.md
git commit --only docs/issues/open/02ab-a-stale-live-row-treated-as-superseded-by-inference.md docs/issues/resolved/02ab-a-stale-live-row-treated-as-superseded-by-inference.md docs/issues/open/894d-a-clear-can-reuse-the-same-name-and-ref-for-a-genuinely-new-session.md docs/issues/resolved/894d-a-clear-can-reuse-the-same-name-and-ref-for-a-genuinely-new-session.md docs/issues/open/d92f-tanto-fukkis-transcript-path-identity-check-breaks-under-a-symlinked-config-dir-change.md docs/issues/resolved/d92f-tanto-fukkis-transcript-path-identity-check-breaks-under-a-symlinked-config-dir-change.md docs/issues/open/261c-a-live-but-unreachable-kikaku-hosa-row-has-no-timeout.md docs/issues/resolved/261c-a-live-but-unreachable-kikaku-hosa-row-has-no-timeout.md docs/issues/open/7f28-three-roster-template-vocabulary-drifts-after-seat-lineage.md docs/issues/resolved/7f28-three-roster-template-vocabulary-drifts-after-seat-lineage.md -m "docs: resolve the identity issues bg-seat-ergonomics closes" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit of five renames.

### Task 15 — Close the vocabulary group: issue-e3e4, issue-5a2d, issue-de29, issue-8c74, and issue-ce69, and strike issue-bdad's third item

Spec, "Issues this design closes": section 3 closes these, and its last
files land with Tasks 12 and 13 in this batch. The five are moved with
`git mv` and their `updated:` bumped (`docs/issues/AGENTS.md`), each gaining
one paragraph saying what closed it; issue-bdad stays open with its first
two items, its third struck with a pointer to this design, and its
`updated:` bumped. issue-7607 needs nothing: it is already under
`docs/issues/resolved/`, closed by decision-363c. The date is the design's,
fixed so that each block is exact.

**Files:**

- Move: `docs/issues/open/e3e4-two-role-files-still-call-exit-sekkei-and-exit-keikaku-the-stage-word.md`, `docs/issues/open/5a2d-roles-jisso-md-still-says-the-t2-shoroku-proposal-and-write-out.md`, `docs/issues/open/de29-the-roster-templates-stage-values-do-not-cover-a-triage-raised-row.md`, `docs/issues/open/8c74-templates-kanri-md-s-stage-example-list-omits-exit-keikaku.md`, and `docs/issues/open/ce69-the-exit-kanri-proposal-filename-collides-across-same-day-tenures.md` → `docs/issues/resolved/`
- Modify: `docs/issues/open/bdad-three-roster-handshake-and-lifecycle-facts-the-contract-does-not-state.md`

- [ ] **Step 1: Check that no living document links to the five by path**

```bash
grep -rln -E 'issues/open/(e3e4|5a2d|de29|8c74|ce69)-' docs skills ./*.md --include='*.md' | grep -v '^docs/superpowers/' || true
```

Expected: no output. A path found here is rewritten to `resolved/` in this
task's commit, as `docs/issues/AGENTS.md` asks.

- [ ] **Step 2: Apply the passages**

Apply P15.1 to P15.12.

**P15.1** `docs/issues/open/e3e4-two-role-files-still-call-exit-sekkei-and-exit-keikaku-the-stage-word.md` — replace exactly this 1 line

```markdown
updated: 2026-09-19
```

**P15.1 →**

```markdown
updated: 2026-09-23
```

**P15.2** `docs/issues/open/e3e4-two-role-files-still-call-exit-sekkei-and-exit-keikaku-the-stage-word.md` — replace exactly this 1 line

```markdown
A wording gap, not a user-stated need, so no paired requirement.
```

**P15.2 →**

```markdown
A wording gap, not a user-stated need, so no paired requirement.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 3.2 and
3.5): `roles/sekkei.md` and `roles/keikaku.md` name their proposal file by
the step and the writing session, `shoroku-proposal-<role>-<short id>.md`,
and the `S-n` tables' one-valued column is gone, with every sentence that
defined its value.
```

**P15.3** `docs/issues/open/5a2d-roles-jisso-md-still-says-the-t2-shoroku-proposal-and-write-out.md` — replace exactly this 1 line

```markdown
updated: 2026-09-19
```

**P15.3 →**

```markdown
updated: 2026-09-23
```

**P15.4** `docs/issues/open/5a2d-roles-jisso-md-still-says-the-t2-shoroku-proposal-and-write-out.md` — replace exactly these 2 lines

```markdown
fix in-plan, self-contradiction within a role file" shape, from earlier
batches of the same run).
```

**P15.4 →**

```markdown
fix in-plan, self-contradiction within a role file" shape, from earlier
batches of the same run).

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 3.1):
`roles/jisso.md`'s line 5 says the plan's last Jisso owns the close's
shoroku proposal, as `SKILL.md` and the file's own section do; "and
write-out" was already gone.
```

**P15.5** `docs/issues/open/de29-the-roster-templates-stage-values-do-not-cover-a-triage-raised-row.md` — replace exactly this 1 line

```markdown
updated: 2026-09-19
```

**P15.5 →**

```markdown
updated: 2026-09-23
```

**P15.6** `docs/issues/open/de29-the-roster-templates-stage-values-do-not-cover-a-triage-raised-row.md` — replace exactly this 1 line

```markdown
A template gap, not a user-stated need, so no paired requirement.
```

**P15.6 →**

```markdown
A template gap, not a user-stated need, so no paired requirement.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 3.5):
already closed in substance when the template gave one value for every row,
and now the column itself is gone from `templates/roster.md`'s items table.
```

**P15.7** `docs/issues/open/8c74-templates-kanri-md-s-stage-example-list-omits-exit-keikaku.md` — replace exactly this 1 line

```markdown
updated: 2026-09-19
```

**P15.7 →**

```markdown
updated: 2026-09-23
```

**P15.8** `docs/issues/open/8c74-templates-kanri-md-s-stage-example-list-omits-exit-keikaku.md` — replace exactly these 2 lines

```markdown
Related: issue-e18b, issue-62e7 (the same "one file lists N things, another
lists fewer" shape, from earlier batches of the same run).
```

**P15.8 →**

```markdown
Related: issue-e18b, issue-62e7 (the same "one file lists N things, another
lists fewer" shape, from earlier batches of the same run).

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 3.5): the
example list and the column it described are both gone from
`templates/kanri.md`.
```

**P15.9** `docs/issues/open/ce69-the-exit-kanri-proposal-filename-collides-across-same-day-tenures.md` — replace exactly this 1 line

```markdown
updated: 2026-09-22
```

**P15.9 →**

```markdown
updated: 2026-09-23
```

**P15.10** `docs/issues/open/ce69-the-exit-kanri-proposal-filename-collides-across-same-day-tenures.md` — replace exactly these 2 lines

```markdown
authoritative, decision-8320), or a plain sequence number with the `-2` suffix
reserved for its original meaning.
```

**P15.10 →**

```markdown
authoritative, decision-8320), or a plain sequence number with the `-2` suffix
reserved for its original meaning.

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 3.2),
by both: Kanri's proposal file is `.tanto/shoroku-proposal-kanri-<short id>.md`,
keyed on the writing session's `sessionId`, and `-<n>` numbers a further file
by the same session. Two tenures of one window are two sessions, and so two
names.
```

**P15.11** `docs/issues/open/bdad-three-roster-handshake-and-lifecycle-facts-the-contract-does-not-state.md` — replace exactly this 1 line

```markdown
updated: 2026-09-20
```

**P15.11 →**

```markdown
updated: 2026-09-23
```

**P15.12** `docs/issues/open/bdad-three-roster-handshake-and-lifecycle-facts-the-contract-does-not-state.md` — replace exactly these 8 lines

```markdown
- **Every exit-file name needs a suffix, and the design and planning roles'
  default has none.** `exit-sekkei-proposal.md` collides the moment a topic has
  two Sekkei sessions in turn. One topic had three: the first claimed the bare
  path and the later two improvised the outgoing session's own bare name as a
  suffix, by precedent rather than by rule. The contract should name the suffix
  rule for every role that can have more than one session in a topic's
  lifetime, as it already does for Jisso (batch letter) and Kaiseki (case
  number).
```

**P15.12 →**

```markdown
- ~~**Every exit-file name needs a suffix, and the design and planning roles'
  default has none.**~~ Closed by the bg-seat-ergonomics design
  (`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 3.2):
  every proposal file is keyed on the writing session,
  `shoroku-proposal-<role>-<short id>.md`, with `-<n>` for a further file by
  the same session, so a second session of one role in a topic writes a file
  of its own. The item's evidence is in this file's history.
```

- [ ] **Step 3: Verify the passages**

```bash
TANTO="$(pwd)/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --task 15
```

Expected: `task 15: verify clean`. It runs before the moves, since every
passage names an `open/` path.

- [ ] **Step 4: Move the five issues**

```bash
git mv docs/issues/open/e3e4-two-role-files-still-call-exit-sekkei-and-exit-keikaku-the-stage-word.md docs/issues/resolved/
git mv docs/issues/open/5a2d-roles-jisso-md-still-says-the-t2-shoroku-proposal-and-write-out.md docs/issues/resolved/
git mv docs/issues/open/de29-the-roster-templates-stage-values-do-not-cover-a-triage-raised-row.md docs/issues/resolved/
git mv docs/issues/open/8c74-templates-kanri-md-s-stage-example-list-omits-exit-keikaku.md docs/issues/resolved/
git mv docs/issues/open/ce69-the-exit-kanri-proposal-filename-collides-across-same-day-tenures.md docs/issues/resolved/
```

- [ ] **Step 5: Lint and commit**

```bash
./scripts/lint.sh docs/issues/resolved/e3e4-two-role-files-still-call-exit-sekkei-and-exit-keikaku-the-stage-word.md docs/issues/resolved/5a2d-roles-jisso-md-still-says-the-t2-shoroku-proposal-and-write-out.md docs/issues/resolved/de29-the-roster-templates-stage-values-do-not-cover-a-triage-raised-row.md docs/issues/resolved/8c74-templates-kanri-md-s-stage-example-list-omits-exit-keikaku.md docs/issues/resolved/ce69-the-exit-kanri-proposal-filename-collides-across-same-day-tenures.md docs/issues/open/bdad-three-roster-handshake-and-lifecycle-facts-the-contract-does-not-state.md
git commit --only docs/issues/open/e3e4-two-role-files-still-call-exit-sekkei-and-exit-keikaku-the-stage-word.md docs/issues/resolved/e3e4-two-role-files-still-call-exit-sekkei-and-exit-keikaku-the-stage-word.md docs/issues/open/5a2d-roles-jisso-md-still-says-the-t2-shoroku-proposal-and-write-out.md docs/issues/resolved/5a2d-roles-jisso-md-still-says-the-t2-shoroku-proposal-and-write-out.md docs/issues/open/de29-the-roster-templates-stage-values-do-not-cover-a-triage-raised-row.md docs/issues/resolved/de29-the-roster-templates-stage-values-do-not-cover-a-triage-raised-row.md docs/issues/open/8c74-templates-kanri-md-s-stage-example-list-omits-exit-keikaku.md docs/issues/resolved/8c74-templates-kanri-md-s-stage-example-list-omits-exit-keikaku.md docs/issues/open/ce69-the-exit-kanri-proposal-filename-collides-across-same-day-tenures.md docs/issues/resolved/ce69-the-exit-kanri-proposal-filename-collides-across-same-day-tenures.md docs/issues/open/bdad-three-roster-handshake-and-lifecycle-facts-the-contract-does-not-state.md -m "docs: resolve the vocabulary issues bg-seat-ergonomics closes, and strike issue-bdad's third item" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: lint passes with no file changed; one commit of five renames and
one edit.

## The whole-branch review and its fix wave

After batch D is accepted, Kanri dispatches the whole-branch review on the
`branch.review` kind over the merge base, as every plan's final step
(`roles/kanri.md`, "The final batch"), and gives the reviewer
`node "$TANTO/scripts/passage-check.js" replay --plan docs/superpowers/plans/2026-09-23-bg-seat-ergonomics.md --base <merge base>`
as its one command. The review's findings become one more batch prompt — the
fix wave — for the next queued Jisso, and there is no second fix wave. This
plan writes no task for it: its content is the review's findings. Three
things the reviewer is pointed at, because no script here judges them:

- the cross-file sites each task lists under "Named-mechanism sites" — the
  census and its four headings, `stopped` with the spawner's guard,
  `cleared`'s two routes, the resume rule's one sentence, the `close:` line,
  and the proposal file names — read together, in every file that names them;
- the two additions flagged in the Overview (the spawner's resume-note log
  line, and `roles/kikaku.md`'s and `roles/hosa.md`'s `dead` for a cleared
  window), which the spec implies and does not list;
- Task 4's measurement report against spec 1.5's claim about the effort,
  which Task 5's schema sentence rests on.

A fix-wave finding that touches `SKILL.md`, a role file, or a template moves
the tree those files describe after the safe boundary of batch D (see the
Overview).

## Self-Review

**Spec coverage.** Section 1: 1.1–1.4 Task 1, 1.5 Task 5, rule 10's sentence
Task 10. Section 2: 2.1 Tasks 8 and 10, 2.2 Task 3, 2.3–2.7 Task 8 (with
`SKILL.md`'s Resuming in Task 10 and the roster template in Task 12), 2.8
Tasks 8, 10, and 12. Section 3: 3.1–3.7 Tasks 9, 11, 12, and 13, 3.5's writer
Task 3. Section 4: 4.1–4.3 Task 2, 4.4 Task 6. Section 5's four facts are the
Global Constraints' (see that section). Section 6: 6.1
Tasks 10 and 11, 6.2 Tasks 8 and 9, 6.3 Task 13, 6.4 Tasks 5 and 12, 6.5
Tasks 1–3, 6.6 Task 6, 6.7 Task 7 and Tasks 14–15. "Old values this plan
contradicts": every entry is an `O` block of the task that removes it; the
three that carry backticks or wrap in their file are named in their task's
text instead, and their old blocks are the check. "What the plan must
contain": the instruments (Tasks 1–3), the measurement (Task 4), the
contract and the roles in the final two batches (Tasks 8–13), the docs
(Tasks 6–7), the issues in the batches that land their fixes (Tasks 1, 2,
14, 15), and the whole-branch review above. Requirements and ADRs are the
close's apply, not a task's. Rule 11's safe boundary is batch D's, stated in
the Global Constraints and the Batches section.

**Placeholder scan.** No step says "add tests" without the tests, or "similar
to Task N". The `<short id>`, `<n>`, and `<topic>` inside new passages are
the skill's own placeholders, which the text defines.

**Type and name consistency.** `seatName`, `shortIdOf`, `spawnArgs(request,
name)`, `underAdHocWorktree`, `revive`, `strand`, `censusSeat` (Task 1);
`trustHint`, `LEAVE_LINE`, `TRUST_LINE`, `KANRI_RESUMABLE` (Task 2);
`cmdCensus`, `sItemCells`, `RETIRED_COLUMN`, `CENSUS_HEADINGS` (Task 3) are
each defined once and used under the same name. The census's headings —
Listed, Not listed, No session id, Not held — and its entry lines are
spelled the same in `boundary.js`, its tests, `SKILL.md`, and
`roles/kanri.md`. The `close:` line reads the same in `SKILL.md`,
`roles/kanri.md`, and `roles/jisso.md`, and check 24 pins all three. The
leave line and the trust hint are byte-identical between `tanto.js` and
`tanto.test.js`.

**How the passages were checked while drafting.** Every old block was
matched against the branch's own files, exactly once, in plan order; every
passage was applied to a copy of the tree, on which `node --test` passed the
three suites (99 tests), `biome check` found no error and no format
change in the six scripts, and every `O` needle over `SKILL.md`, `roles/`,
`templates/`, and `README.md` read `0` except rule 10's sentence, which
stays by design. Markdownlint with the repository's configuration, the
frontmatter hook on the issue files, and check 7's new greps (Task 7) were
clean on that copy, and its `boundary.js census`, run read-only against
this repository's live roster, printed its four headings.

**Sizes.** The largest task is Task 1: 796 lines and eight steps, the most
of any task on both counts, most of the lines being passage blocks; Task 9
(`roles/kanri.md`'s vocabulary) is next at 790 lines and four steps. By
batch, as `frame --task` counts them: A about 1,750 lines, B about 750, C
about 2,000, and D about 1,300 — C carries both halves of `roles/kanri.md`
and of `SKILL.md`, which the Batches section may prefer to cut differently,
as long as the final batch still holds the last of the contract, the role
files, and the templates. **Task 4 is a sweep-and-check
shape**: its deliverable is the recorded measurement report, not a file of
the tree, and its reviewer re-reads the report's two sections against the
spawner's log and result files rather than trusting them. No other task is
of that shape; the census run against this repository's live roster, which
the spec's "How a batch is verified" names, is a boundary check and not a
task's deliverable.

**Review focus** is its own section now, after Global Constraints, so
`frame --stage 1` carries its heading.
