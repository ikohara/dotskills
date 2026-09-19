# tanto-diet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the batch boundary's reading, verifying, and row-appending out of
the resident Kanri into a subagent whose context ends with its turn, make the
batch prompt travel as one line, retire the `kanri-address:` broadcast in favour
of the roster's first data row read at send time, and add a `ttl=` line to the
transcript reading.

**Architecture:** One new Node instrument, `skills/tanto/scripts/boundary.js`,
with two subcommands — `check`, which runs the boundary's read-only commands as
child processes and prints their output under fixed headings, and `record`,
which writes the ledger's and the roster's rows idempotently. One new template,
`skills/tanto/templates/boundary-brief.md`, is the procedure a new
`boundary.verify` subagent follows; its one deliverable is
`.tanto/<topic>/batch-<X>-verdict.md` and its one reply is a verdict line.
`roles/kanri.md`'s eight-step batch loop becomes six: wait, dispatch, rule,
lifecycle, commit window, record and send. Everything else in the plan is the
prose that has to agree with those three facts, plus the address change: no
`kanri-address:` line anywhere, the roster's first data row read at the moment
of sending.

**Tech Stack:** Markdown (the skill's contract, role files, and templates),
JSON (`templates/tanto.json`), and Node 22 with no dependencies for the two
scripts, tested by `node --test`. No test framework beyond `node --test`; no
build step.

**Spec:** `docs/superpowers/specs/2026-09-19-tanto-diet-design.md` (committed by
Keikaku from `.tanto/tanto-diet/spec-draft.md`, its text unchanged). The spec is
the binding authority; this plan argues from it.

## Global Constraints

- **The authority for this run's sessions is this plan, Kanri's orders line, and
  the batch prompts — not the role text on disk.** This plan edits the skill's
  own files, and every session that runs it loads the working tree's copy
  (contract rule 11, decision-5c8e).
- **The safe boundary is the final one — no role is started or replaced before
  it.** Concretely: batch D's boundary is the first at which every file this
  plan touches agrees with every other; batch E lands no content. No Jisso,
  Sekkei, Keikaku, Kaiseki, Kikaku, or Hosa is created, replaced, or handed over
  between batch A's first task and batch D's boundary. Kanri asks the human for
  the plan's Jissos in full at the landing (`roles/kanri.md`'s Create table,
  second row, names this case), because the queue cannot be refilled before the
  plan's end.
- **The Kanri that runs this plan runs the OLD boundary procedure throughout.**
  It verifies in place with `passage-check boundary` and `passage-check diff`,
  reads the report by its sections, takes the two readings itself, writes its own
  ledger and roster rows, and sends the batch prompt's full text — exactly as
  `roles/kanri.md` reads before batch A. The new procedure is not usable
  mid-plan: `templates/boundary-brief.md`, `scripts/boundary.js`, and the
  `boundary.verify` agent definition do not exist in the tree until this plan
  writes them, and a definition written during a session is not visible to that
  session (`SKILL.md`, the project-scope pass). The new procedure is first run by
  the Kanri of the topic that opens after this plan's merge.
  One consequence is concrete and this plan's own Kanri owns it: from batch B's
  boundary through batch D's, the rendered batch prompt no longer carries the
  `no-role` line (task 6 removed it from the template) while `SKILL.md`'s
  Messages bullet still requires every batch prompt to carry it and requires
  the file and the sent message to be the same bytes (task 12 is what retires
  that). **For every batch prompt in that window this plan's Kanri appends the
  `no-role` line to the sent message by hand**, even though the saved file no
  longer holds it — a deliberate, temporary divergence from "a pasted file and
  a sent message are the same bytes", which task 12 retires for real.
- **`kanri-address:`'s removal and the create request's `<name>`-argument drop
  happen together, only in the final content batch (D).** Peers live during this
  plan — this plan's own Jissos, another topic's Sekkei or Keikaku — hold the old
  re-send rule; removing the line before they are released would leave a
  successor Kanri with peers waiting for a broadcast the file no longer
  prescribes. And the human pastes what the running Kanri's file says, so the
  create requests keep `<name>` until the merge.
- **No measurement task.** This plan's own Kanri runs the old boundary, so
  nothing here measures the new one. The measurement is the next topic's, named
  in the spec's Verification, last item.
- **Repo rules (`AGENTS.md`, `CONTRIBUTING.md` at the repository root).**
  American English in every tracked file. Run `./scripts/lint.sh <changed paths>`
  on the paths a task changed, relative to the repository root, and fix what it
  reports before committing. Commit by explicit path with
  `git commit --only <paths>` — the index is shared; a new file needs
  `git add <paths>` first, because `--only` cannot pick up an untracked file.
  Never `git add -A`, `.`, or `-u`; never a bare `git commit` or `git commit -a`;
  never `--no-verify`. End every commit message with
  `Co-Authored-By: Claude <noreply@anthropic.com>`. After editing
  `skills/tanto/SKILL.md`, review `skills/tanto/README.md` for drift — task 11
  and task 14 are where this plan pays that back.
- **Model families, from the merged `tanto.json`** (built-in
  `skills/tanto/templates/tanto.json` overlaid by `<repo>/.claude/tanto.json`,
  which sets `sessions.kikaku` and `sessions.sekkei` only): this plan's own
  Keikaku and Jisso are **sonnet** (`sessions.keikaku` sonnet/high,
  `sessions.jisso` sonnet/xhigh), Kanri **sonnet**/high. Jisso's four dispatch
  kinds stay `task.implement` sonnet/high, `task.review-spec` opus/medium,
  `task.review-quality` opus/medium, `task.escalate` opus/high. The kind this
  plan adds is `boundary.verify`, **sonnet/high**. Every dispatch names its
  `model` and its `subagent_type` together; none omits either (rule 6).
- **The stray-modification rule.** A modification in the shared tree that an
  implementer or its own subagent did not make is **not** its to discard: it is
  reported — a `task.implement` subagent tells Jisso one line, Jisso tells Kanri
  one line — and only Kanri decides whether it is stray. Never
  `git checkout -- <path>` and never `git clean` on such a modification. The one
  exception in this plan is the deliberate line-ending restore named inside
  task 4 (below), which that task runs on the Markdown file it created in that
  same task.
- **Line endings.** A **Markdown** file created on this host lands `w/lf` in
  `git status`'s eyes every time (measured five of five in the tanto-cost run),
  so every task that creates one runs `git checkout -- <that path>` **after**
  its own commit, inside its own steps, and the next boundary's `git status` is
  clean. Task 4 is the only such task here. The two `.js` files tasks 1 and 2
  create need no restore: `.gitattributes` pins `*.js` to `eol=lf`, so what
  they are written with is what git holds.
- **Named mechanisms.** A task that introduces or changes a named mechanism — a
  step number of the batch loop, a status word, a section pointer, a slot name,
  a placeholder like `<kanri-address>` or `<name>` — lists in its own text every
  other site in the same file and in the files this plan touches that names the
  same mechanism, so that its reviewer checks them together. Each such list is
  under **Named-mechanism sites** in the task.

### The commands `replay` does not run

Declared once here, not line by line — `replay` (and `boundary`, which honors
the same patterns) skip a fence matching one of these:

```text
replay-skip: ./scripts/lint.sh — pre-commit needs the repository and its hook cache, which the applied tree is not
replay-skip: node --test — the applied tree carries this plan's own touched blobs but not sibling files (`passage-check.js`, and `templates/roster.md`) that `boundary.js`'s tests and dogfood run need, which no passage of this plan touches
replay-skip: skills/tanto/scripts/boundary.js check — the dogfood run needs `docs/superpowers/plans/2026-09-17-seat-lineage.md` and `.tanto/seat-lineage/batch-fixwave-report.md`, fixtures outside this plan's touched paths
replay-skip: skills/tanto/scripts/boundary.js record — the idempotency check copies `templates/roster.md`, which no passage of this plan touches
```

### Rebase note — `bug-report-hold`, merged 2026-09-20

`bug-report-hold` merged to `main` on 2026-09-20 as merge commit `823d88a`,
carrying 1,184 changed lines under `skills/tanto/`. This plan was drafted on
2026-09-19 against `main` as it stood before that merge, and **seven of its
passages were re-authored on 2026-09-20 against the merged text**, each by the
rule this note set out in advance: the site is located by its quoted sentence
and this plan's edit is applied to `bug-report-hold`'s landed text, not to the
text the passage used to quote (spec, "What the plan must contain"). Every old
block in this plan now matches `main` at `823d88a`, and `replay --base main`
exits 0 against it.

The seven, and what each needed. Passage ids of that other plan are spelled
without their letter, so that this plan's own `lint` does not read them as
citations of blocks it holds.

| Passage | What the merge did to its site | What the re-authoring needed |
| --- | --- | --- |
| **P7.3** (`templates/kanri.md`, Session events) | its passage 10-4 dropped the bug-report clause, shortening the line | a mechanical re-wrap: the old block is now the one line `an exit proposal form-checked and its`. |
| **P8.1** (the loop, steps 1 to 5) | its passage 9-3 replaced step 4's triage with "Bug reports need nothing from you here … in slot (b) of step 7" | more than a re-wrap. The old block carries the new step 4, and the **new** block's step-3 clause was rewritten to carry `bug-report-hold`'s sentence with its pointer renumbered to step 5 — the edit the spec always intended, on text that did not exist when the plan was drafted. **O8.8** is new, on `in slot (b) of step 7.` |
| **P8.2** (the loop, step 6) | the close's own fix commit added a clause: "when the trigger that fired is your own handover, write your own proposal here too, as \"Handover\" step 1 says" | more than a re-wrap, and not predicted by this note's first version. The old block is two lines longer, and the new block **preserves** that clause rather than dropping it. |
| **P9.7** (the hotfix lane) | its passage 14-1 replaced `## Bug intake` whole; the two sites this task used to renumber there (`at loop step 7, or for a gap` and `ruled at loop step 4 and the edit`) are gone, and one new `step 7` took their place | re-pointed at the surviving sentence. **P9.8** was deleted with its site and task 9 renumbered to close the gap; **O9.7** now names the surviving needle. |
| **P15.1** (`roles/hosa.md`) | its passage 11-2 expanded the opening line into three, ending "instructs nothing. A message whose first line is" | a mechanical re-wrap, exactly as predicted: the old block is five lines and keeps `bug-report-hold`'s three. |
| **P15.14** (`templates/kanri-handover.md`, Rulings) | the close's own fix commit added a clause about a finding still undecided when the dispatch that raised it returns on the handover's wake-up | more than a re-wrap, and not predicted. The old block is six lines, and the pointer this task writes **carries that clause forward** instead of discarding it. |

Three of the seven — P8.2, P15.14, and half of P9.7 — came from the close's
own `fix: text corrections from bug-report-hold's close` commit rather than
from that plan's passages, which is why this note's first version did not
predict them: a plan's passages are knowable in advance, a close's corrections
are not. The lesson is the rule itself, not the table: re-derive from the tree,
never from a prediction of it.

## File structure

Created — declared to `diff`, which exempts a created path from its line
accounting, and carried by a `W` block each, because `replay` copies every
other block's path out of the merge base:

created: skills/tanto/scripts/boundary.js
created: skills/tanto/scripts/boundary.test.js
created: skills/tanto/templates/boundary-brief.md

- `skills/tanto/scripts/boundary.js` — the boundary instrument. Two
  subcommands: `check` (read-only; runs `passage-check boundary`,
  `passage-check diff`, `passage-check sections`, and `reading.js` as child
  processes and prints each under a fixed `##` heading) and `record` (writes the
  ledger's Batches, Measurements, Shoroku proposal items, Session events, and
  Progress, and the roster's Residency and Status cells, idempotently). No
  dependencies, no shebang; always `node "$TANTO/scripts/boundary.js"`.
- `skills/tanto/scripts/boundary.test.js` — its tests, run by `node --test`.
- `skills/tanto/templates/boundary-brief.md` — the fifteenth template: the
  procedure the `boundary.verify` subagent follows, self-contained, and the
  seam shape 2 would run headless.

Modified:

- `skills/tanto/scripts/reading.js` — a third always-printed line, `ttl=`.
- `skills/tanto/scripts/reading.test.js` — cases for the three `ttl=` values
  and the 5-to-60-minute window's edges.
- `skills/tanto/templates/tanto.json` — the fourteenth `subagents` key.
- `skills/tanto/templates/batch-prompt.md` — the path-only form, the Guard's and
  the Report section's address, and the three `<Kanri fills>` slots.
- `skills/tanto/templates/kanri.md` — the ledger's writer sentence, the
  Measurements entry form, the Session events pair, its `loop step 6`.
- `skills/tanto/templates/kanri-handover.md` — Live peers, Rulings, Residency,
  and Commands for the human.
- `skills/tanto/templates/kaiseki-brief.md` — the Report section's address.
- `skills/tanto/roles/kanri.md` — the batch loop replaced whole, the
  renumbering, the five Start cases, the Handover section, the Create table and
  its five `<name>` sites.
- `skills/tanto/roles/jisso.md`, `sekkei.md`, `keikaku.md`, `kaiseki.md`,
  `kikaku.md`, `hosa.md` — the address sentence.
- `skills/tanto/SKILL.md` — the kind count, the address, Resuming, Messages,
  Artifacts, the transcript reading, rule 3.
- `skills/tanto/README.md` — Layout, Prerequisites, "What it does", Usage, and
  the design list.

Not touched, and named so a reviewer does not look for them:
`skills/tanto/scripts/passage-check.js` and its test file,
`skills/tanto/templates/batch-report.md`, `roster.md`, `roster-archive.md`,
`bug-report.md`, `review-brief.md`, `shoroku-brief.md`, `kikaku-decision.md`,
`kaiseki-report.md`, `agent.md`, and everything under `docs/`.

## Batches

Three or four tasks each (rule 7). Every boundary rotates the Jisso; the queue
the human is asked for at the landing is **six** windows — five batch rows plus
one for the whole-branch review's fix wave — and, because this plan names its
final boundary as the safe one, the full six are asked for at once and no
released window is re-queued before the plan's end.

| Batch | Tasks | What it delivers | Stop conditions at its boundary |
| --- | --- | --- | --- |
| A | 1, 2, 3 | `scripts/boundary.test.js` whole (the failing suite), then `scripts/boundary.js` whole (`check` and `record`), then `reading.js`'s `ttl=` line with its test cases | all four of the fences `boundary` skips, run by Kanri's own hand as "How a batch is verified" prescribes: `node --test 'skills/tanto/scripts/*.test.js'` passes; `check` run against the seat-lineage fixture prints its `check:` line and its headings; `record` run twice leaves the second run's diff empty; lint on the changed paths. Plus `git status` clean |
| B | 4, 5, 6, 7 | `templates/boundary-brief.md`; `templates/tanto.json`'s fourteenth kind; `templates/batch-prompt.md`'s path-only form and its three `<Kanri fills>` slots; `templates/kanri.md`'s ledger text | `templates/tanto.json` parses and has fourteen `subagents` keys, `boundary.verify` among them; the brief's seven numbered steps and the verdict file's eleven headings are all present; `git status` clean; lint on the changed paths |
| C | 8, 9, 10, 11 | `roles/kanri.md`'s six-step loop and its one dispatch site; the whole renumbering sweep; `SKILL.md` 2.1, 2.5, 2.6, 2.7; `README.md`'s Layout, Prerequisites, "What it does" and design list | `grep -n 'loop step [78]' skills/tanto/roles/kanri.md` is empty and every remaining `loop step n` reads against task 9's map; `grep -c thirteen skills/tanto/SKILL.md` is zero; `tanto-boundary-verify` occurs at least once in `roles/kanri.md`; `git status` clean; lint on the changed paths |
| D | 12, 13, 14, 15 | **the final content batch** — the address's retirement everywhere at once: `SKILL.md` 2.2 to 2.4 and its Invocation line, `roles/kanri.md` 3.1, 3.3 and 3.4, the six other role files, the three templates that carry the slot, and `README.md`'s Usage | `grep -rc kanri-address skills/tanto` is zero at every path; `grep -c '<kanri>' skills/tanto/README.md` is zero; `grep -c '<kanri>' skills/tanto/roles/kaiseki.md` is zero; `git status` clean; lint on the changed paths |
| E | 16 | the spec's whole Verification list, run once and recorded | every item of the spec's Verification passes or carries Kanri's ruling; `git status` clean |

**The boundary from which a role may be started or replaced is batch D's.** It is
the first boundary at which every file this plan touches agrees with every other:
`roles/kanri.md`'s loop names the new kind from batch C, while `SKILL.md`'s
address bullets and the six role files still describe the broadcast until batch
D lands. A session started before D's boundary reads a half-edited skill. Batch E
lands no content, so D's boundary is the safe one and nothing waits for E. Until
D's boundary the authority for every session in this run is this plan's Global
Constraints, Kanri's orders line, and the batch prompts (rule 11).

## How a batch is verified

The boundary check for this plan is
`node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --base <merge base>`,
run by Kanri at every boundary — in place, itself, per Global Constraints — with
`node "$TANTO/scripts/passage-check.js" boundary --plan <that path>` beside it.
`boundary` runs the fenced blocks below in order and judges each by its **exit
status alone**; the `Expected:` paragraph after a fence is for the human reading
the output. Each fence is therefore written to pass at every boundary and to turn
strict from the batch that lands its property, gated on a sentinel that batch
itself writes. Every task's own Verify step is the one invocation
`node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task <N>`.

Reports and prompts follow the tanto templates; this plan names no skeleton of
its own.

**Four of these fences `boundary` cannot run, and Kanri runs them by hand.**
The `replay-skip:` declarations in File structure are honored by `boundary` as
well as by `replay`, so fence 1 (`node --test`), fence 3 (the `check` dogfood
run), fence 4 (`record`'s idempotency) and fence 8 (`./scripts/lint.sh`) are
**skipped** at every boundary, not just in a dry run — the applied tree has no
`passage-check.js`, no `templates/roster.md`, no fixtures and no pre-commit
cache. What `boundary` does enforce is fences 2, 5, 6 and 7: the JSON parse and
key count, the brief's completeness, the renumbering, and the address sweep.
So at each boundary Kanri runs those four skipped commands itself, in its own
shell, and reads their output — `node --test 'skills/tanto/scripts/*.test.js'`,
the `check` dogfood run, the `record` idempotency pair, and the lint line — and
a batch is not accepted on `boundary`'s verdict alone. Batch A's stop
conditions are exactly those four, which is why its row below names them.

**1. The scripts' tests.** Strict from batch A.

```bash
if [ -f skills/tanto/scripts/boundary.js ]; then
  node --test 'skills/tanto/scripts/*.test.js' || exit 1
fi
true
```

Expected: from batch A on, `# pass` for every test and no `# fail`. The quoted
glob is the only form that runs on this host — `node --test <directory>` fails
immediately with `MODULE_NOT_FOUND` (issue-235b).

**2. `templates/tanto.json` parses, and has thirteen keys before batch B and
fourteen after.** Strict always.

```bash
node -e '
const fs = require("node:fs");
const config = JSON.parse(fs.readFileSync("skills/tanto/templates/tanto.json", "utf8"));
const keys = Object.keys(config.subagents);
const landed = fs.existsSync("skills/tanto/templates/boundary-brief.md");
const want = landed ? 14 : 13;
if (keys.length !== want) {
  console.error("subagents keys: " + keys.length + ", wanted " + want);
  process.exit(1);
}
if (landed && !keys.includes("boundary.verify")) {
  console.error("boundary.verify missing from subagents");
  process.exit(1);
}
console.log("subagents keys: " + keys.length);
' || exit 1
true
```

Expected: `subagents keys: 13` before batch B, `subagents keys: 14` after.

**3. `check` runs and prints, against a report and a plan already on disk.**
Strict from batch A. The `boundary` and `diff` halves may well fail against a
landed plan; what is verified is that the command runs and prints.

```bash
if [ -f skills/tanto/scripts/boundary.js ]; then
  mkdir -p .tanto/tanto-diet
  node skills/tanto/scripts/boundary.js check \
    --plan docs/superpowers/plans/2026-09-17-seat-lineage.md \
    --report .tanto/seat-lineage/batch-fixwave-report.md \
    --base "$(git merge-base main HEAD)" \
    --tanto skills/tanto > .tanto/tanto-diet/check-dogfood.txt
  grep -q '^check: ' .tanto/tanto-diet/check-dogfood.txt || exit 1
  for heading in '## boundary' '## diff' '## sections' '## jisso reading'; do
    grep -qF "$heading" .tanto/tanto-diet/check-dogfood.txt || exit 1
  done
fi
true
```

Expected: a `check:` line and the four headings in
`.tanto/tanto-diet/check-dogfood.txt`.

**4. `record` is idempotent.** Strict from batch A.

```bash
if [ -f skills/tanto/scripts/boundary.js ]; then
  scratch=.tanto/tanto-diet/record-check
  rm -rf "$scratch"
  mkdir -p "$scratch"
  cp skills/tanto/templates/kanri.md "$scratch/ledger.md"
  cp skills/tanto/templates/roster.md "$scratch/roster.md"
  for pass in 1 2; do
    node skills/tanto/scripts/boundary.js record \
      --ledger "$scratch/ledger.md" --roster "$scratch/roster.md" \
      --batch Z --tasks 1-3 --state reported --verdict 'check: pass' \
      --progress 'batch Z reported, ruling pending' \
      --kanri 'kanri-z [aaaaaa]' \
      --kanri-reading 'transcript: 1 B, 2 records, 3 wake-ups, 0 compactions, context=4 ttl=1h' \
      --jisso 'jisso-z [bbbbbb]' \
      --jisso-reading 'transcript: 5 B, 6 records, 7 wake-ups, 0 compactions, context=8' \
      --s-item 'batch-Z-report.md item 1 | an item' \
      --event 'boundary Z verified' \
      --now '2026-09-19 10:00' > /dev/null || exit 1
    if [ "$pass" = 1 ]; then
      cp "$scratch/ledger.md" "$scratch/ledger.first"
      cp "$scratch/roster.md" "$scratch/roster.first"
    fi
  done
  diff -q "$scratch/ledger.first" "$scratch/ledger.md" || exit 1
  diff -q "$scratch/roster.first" "$scratch/roster.md" || exit 1
fi
true
```

Expected: no `diff` output; the second run changes neither file.

**5. `templates/boundary-brief.md` is complete.** Strict from batch B.

```bash
if [ -f skills/tanto/templates/boundary-brief.md ]; then
  brief=skills/tanto/templates/boundary-brief.md
  for needle in 'boundary.js" check' 'boundary.js" record' 'batch-<X>-verdict.md' \
    '## Verdict' '## Failures' '## Rulings applied' '## Rulings needed' \
    '## Questions for the human' '## Deviations' '## Verify in the tree' \
    '## Ceiling' '## Rows written' '## Next prompt' '## Measurement'; do
    grep -qF "$needle" "$brief" || exit 1
  done
  steps=$(grep -c '^[0-9]\. ' "$brief")
  if [ "$steps" != 7 ]; then echo "brief steps: $steps"; exit 1; fi
fi
true
```

Expected: every needle found and the procedure's seven numbered steps counted;
nothing printed.

**6. The renumbering is complete.** Strict from batch C.

```bash
if grep -q 'tanto-boundary-verify' skills/tanto/roles/kanri.md; then
  if grep -n 'loop step [78]' skills/tanto/roles/kanri.md; then exit 1; fi
  if grep -n 'thirteen' skills/tanto/SKILL.md; then exit 1; fi
  grep -q 'Fifteen of them' skills/tanto/SKILL.md || exit 1
  grep -q 'three executables' skills/tanto/SKILL.md || exit 1
fi
true
```

Expected: nothing printed before the sentinel lands; nothing printed after it
either.

**7. The address is gone.** Strict from batch D.

```bash
if grep -q 'read at the moment of sending' skills/tanto/SKILL.md; then
  if grep -rn 'kanri-address' skills/tanto; then exit 1; fi
  if grep -n '<kanri>' skills/tanto/README.md; then exit 1; fi
  if grep -n '<kanri>' skills/tanto/roles/kaiseki.md; then exit 1; fi
fi
true
```

Expected: nothing printed.

**8. Lint on the paths this plan changes.** Strict always. `./scripts/lint.sh`
takes path arguments (`uv tool run pre-commit run --files "$@"`), so the changed
paths are named; the three created files are added once they exist.

```bash
paths="skills/tanto/SKILL.md skills/tanto/README.md"
paths="$paths skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md"
paths="$paths skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md"
paths="$paths skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md"
paths="$paths skills/tanto/roles/hosa.md"
paths="$paths skills/tanto/templates/batch-prompt.md skills/tanto/templates/kanri.md"
paths="$paths skills/tanto/templates/kanri-handover.md"
paths="$paths skills/tanto/templates/kaiseki-brief.md skills/tanto/templates/tanto.json"
paths="$paths skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js"
for created in skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js \
  skills/tanto/templates/boundary-brief.md; do
  if [ -f "$created" ]; then paths="$paths $created"; fi
done
./scripts/lint.sh $paths || exit 1
true
```

Expected: every hook `Passed` or `Skipped`. A hook that auto-fixes a file also
fails the run and leaves the change unstaged — re-stage and re-run, as
`CONTRIBUTING.md` warns.

---

### Task 1: `scripts/boundary.test.js` — the whole failing suite, both subcommands

**Files:**

- Create (test): `skills/tanto/scripts/boundary.test.js`

**Interfaces:**

- Consumes: nothing that exists yet. It spawns
  `skills/tanto/scripts/boundary.js`, which task 2 writes, and copies
  `skills/tanto/templates/kanri.md` and `skills/tanto/templates/roster.md` as
  its ledger and roster fixtures — so a change to a fixed table's shape in
  either template fails here first.
- Produces: the behaviour task 2 implements, stated as assertions. Eighteen
  tests — seven for `check` (the `check:` line and its headings; the report
  header read for Jisso's reading and not its body; the five report sections;
  `## measurement` and `## kanri reading` present only when asked for; exit 2
  on an unnamed argument and on an absent path; the unknown-subcommand usage
  line) and eleven for `record` (a second run changing nothing and printing
  the same rows; the Batches row and the placeholder it displaces; a second
  call rewriting only the cells its arguments name; a State the table does not
  name refused with nothing written; the `S-n` counter reading the table it
  appends to; the Measurements entry replacing its own batch and leaving
  another batch's alone; the Progress line replaced whole and the Session
  events line written once; a Residency row appended once then rewritten in
  place; a peer reading and a status; a heading it cannot find; a file's own
  line ending kept).

**Why the split here is by file, and why this task ends red.** `replay` copies
every path a `P`, `A`, or `O` block names out of the merge base, and a path
this plan creates is not there — only a `W` block's path is exempt
(`passage-check.js`, `runReplay` step 1). So each file this plan creates
appears **once**, as one `W` block, in one task, and no later block of any
kind names that path. That is why batch A splits by file — the test file, then
the implementation — rather than by subcommand, and why this task's
deliverable is a red suite: "write the failing test" is the whole of it.

**Named-mechanism sites.** The fixture readings here are written in the
spelling `reading.js` prints —
`transcript: <n> B, <n> records, <n> wake-ups, <n> compactions, context=<n>` —
which is the spelling `record`'s own `READING` pattern parses (task 2) and the
one the roster's Residency row carries (`templates/roster.md`, its Context
column). The Measurements entry asserted here is the form task 7 documents in
`templates/kanri.md`. The five report headings asserted here are the five
`roles/kanri.md`'s loop reads today and the five `templates/boundary-brief.md`
names (task 4).

**Old values this task contradicts:** none. A new test file contradicts no
sentence on disk; the executables count that `boundary.js` changes is task 2's
**O2.1** and **O2.2**.

**Whole file:**

**W1.1** `skills/tanto/scripts/boundary.test.js` — new file, 481 lines

```javascript
const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCRIPT = path.join(__dirname, "boundary.js");
const TANTO = path.dirname(__dirname);

// Every temporary directory a helper below creates, so this file's own
// fixtures leave nothing behind under the OS temp dir.
const tmpDirs = [];
function tmpDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tanto-boundary-"));
  tmpDirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of tmpDirs) {
    // Per-entry, so one locked directory does not stop every entry after it.
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Best-effort teardown -- see above.
    }
  }
});

function write(dir, name, body) {
  const file = path.join(dir, name);
  fs.writeFileSync(file, body, "utf8");
  return file;
}

// The run's cwd is the fixture directory, never the repository: `boundary`
// runs the plan's checks in `process.cwd()`, and a real repository's state
// must never decide a test's result.
function run(args, cwd) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: "utf8",
    cwd,
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

const PLAN = [
  "# Fixture plan",
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "true",
  "```",
  "",
  "Expected: nothing.",
  "",
].join("\n");

const REPORT = [
  "# Batch F report — tasks 1 to 2",
  "",
  "- Plan — plan.md",
  "- Transcript — transcript: 11 B, 22 records, 3 wake-ups, 0 compactions, context=44",
  "- Ceiling — ceiling: jisso baseline=10 + 2 x 5 = 20 — context=44 over",
  "",
  "## Rulings",
  "",
  "- R-1 applied",
  "",
  "## Questions for the human",
  "",
  "none",
  "",
  "## Deviations from the plan",
  "",
  "none",
  "",
  "## Shoroku proposal",
  "",
  "1. an item",
  "",
  "## For Kanri",
  "",
  "### Rulings needed",
  "",
  "- none",
  "",
  "### Verify in the tree",
  "",
  "- run `true`",
  "",
].join("\n");

const MEASUREMENT = [
  "# Measurement report",
  "",
  "## Tasks",
  "",
  "the tool ran",
  "",
  "## Verification",
  "",
  "the prediction held for two of three",
  "",
].join("\n");

function fixture() {
  const dir = tmpDir();
  return {
    dir,
    plan: write(dir, "plan.md", PLAN),
    report: write(dir, "report.md", REPORT),
  };
}

test("check prints the check: line first and each child under its heading", () => {
  const f = fixture();
  const result = run(["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--tanto", TANTO], f.dir);
  const lines = result.out.split("\n");
  assert.match(lines[0], /^check: (pass|fail) — boundary (pass|fail), diff (pass|fail)$/);
  for (const heading of ["## boundary", "## diff", "## sections", "## jisso reading"]) {
    assert.ok(result.out.includes(`\n${heading}\n`), `${heading} is missing`);
  }
  // Outside a repository both halves fail, so the verdict and the exit code
  // are the failing ones, and that is the mapping under test.
  assert.strictEqual(lines[0], "check: fail — boundary fail, diff fail");
  assert.strictEqual(result.code, 1);
});

test("check reads the report's header for the jisso reading, and not its body", () => {
  const f = fixture();
  const result = run(["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--tanto", TANTO], f.dir);
  const block = result.out.split("\n## jisso reading\n")[1] || "";
  assert.match(block, /transcript: 11 B, 22 records, 3 wake-ups, 0 compactions, context=44/);
  assert.match(block, /ceiling: jisso baseline=10/);
  assert.ok(!block.includes("R-1 applied"), "the report's body leaked into the reading block");
});

test("check prints the five report headings through passage-check sections", () => {
  const f = fixture();
  const result = run(["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--tanto", TANTO], f.dir);
  const block = result.out.split("\n## sections\n")[1].split("\n## jisso reading\n")[0];
  for (const heading of [
    "For Kanri",
    "Rulings",
    "Questions for the human",
    "Deviations from the plan",
    "Shoroku proposal",
  ]) {
    assert.ok(block.includes(heading), `${heading} is missing from the sections block`);
  }
  // `Rulings needed` and `Verify in the tree` are `###` headings inside For
  // Kanri and print with it, so neither is named a second time.
  assert.ok(block.includes("Rulings needed"), "Rulings needed did not print with For Kanri");
  assert.ok(block.includes("Verify in the tree"), "Verify in the tree did not print with For Kanri");
});

test("check adds ## measurement only when --measurement is given", () => {
  const f = fixture();
  const without = run(["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--tanto", TANTO], f.dir);
  assert.ok(!without.out.includes("\n## measurement\n"));
  const file = write(f.dir, "measurement.md", MEASUREMENT);
  const withIt = run(
    ["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--measurement", file, "--tanto", TANTO],
    f.dir,
  );
  assert.ok(withIt.out.includes("\n## measurement\n"));
  const block = withIt.out.split("\n## measurement\n")[1].split("\n## jisso reading\n")[0];
  assert.ok(block.includes("the tool ran"));
  assert.ok(block.includes("the prediction held for two of three"));
});

test("check adds ## kanri reading only when --kanri-transcript is given", () => {
  const f = fixture();
  const transcript = write(
    f.dir,
    "kanri.jsonl",
    `${JSON.stringify({
      type: "user",
      timestamp: "2026-09-19T00:00:00.000Z",
      origin: { kind: "human" },
      message: { role: "user", content: "start" },
    })}\n${JSON.stringify({
      type: "assistant",
      message: {
        role: "assistant",
        usage: { input_tokens: 1, cache_creation_input_tokens: 2, cache_read_input_tokens: 3 },
      },
    })}\n`,
  );
  const result = run(
    [
      "check",
      "--plan",
      f.plan,
      "--report",
      f.report,
      "--base",
      "HEAD",
      "--kanri-transcript",
      transcript,
      "--tanto",
      TANTO,
    ],
    f.dir,
  );
  assert.ok(result.out.includes("\n## kanri reading\n"));
  const block = result.out.split("\n## kanri reading\n")[1];
  assert.match(block, /transcript: \d+ B, \d+ records/);
  assert.match(block, /ceiling: kanri baseline=/);
  assert.match(block, /human: last=/);
});

test("check exits 2 when an argument is unnamed and when a path is absent", () => {
  const f = fixture();
  const noBase = run(["check", "--plan", f.plan, "--report", f.report, "--tanto", TANTO], f.dir);
  assert.strictEqual(noBase.code, 2);
  assert.match(noBase.err, /check needs --base/);
  const gone = run(
    ["check", "--plan", f.plan, "--report", path.join(f.dir, "nope.md"), "--base", "HEAD", "--tanto", TANTO],
    f.dir,
  );
  assert.strictEqual(gone.code, 2);
  assert.match(gone.err, /--report .* is not on disk/);
});

test("an unknown subcommand exits 2 and names the two that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record/);
});

// The ledger and the roster the tests write to are copies of the templates
// this skill ships, so a change to a fixed table's shape fails here first.
function ledgerAndRoster() {
  const dir = tmpDir();
  const ledger = path.join(dir, "kanri.md");
  const roster = path.join(dir, "roster.md");
  fs.copyFileSync(path.join(TANTO, "templates", "kanri.md"), ledger);
  fs.copyFileSync(path.join(TANTO, "templates", "roster.md"), roster);
  return { dir, ledger, roster };
}

const KANRI_READING = "transcript: 1 B, 2 records, 3 wake-ups, 0 compactions, context=4 ttl=1h";
const JISSO_READING = "transcript: 5 B, 6 records, 7 wake-ups, 0 compactions, context=8";

function recordArgs(fixture) {
  return [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Z",
    "--tasks",
    "1-3",
    "--state",
    "reported",
    "--verdict",
    "check: pass — boundary pass, diff pass",
    "--progress",
    "batch Z reported, ruling pending",
    "--kanri",
    "kanri-z [aaaaaa]",
    "--kanri-reading",
    KANRI_READING,
    "--jisso",
    "jisso-z [bbbbbb]",
    "--jisso-reading",
    JISSO_READING,
    "--s-item",
    "batch-Z-report.md item 1 | an item worth keeping",
    "--event",
    "boundary Z verified",
    "--now",
    "2026-09-19 10:00",
  ];
}

test("record run twice changes nothing the second time", () => {
  const fixture = ledgerAndRoster();
  const args = recordArgs(fixture);
  const first = run(args, fixture.dir);
  assert.strictEqual(first.code, 0, first.err);
  const ledgerAfterOne = fs.readFileSync(fixture.ledger, "utf8");
  const rosterAfterOne = fs.readFileSync(fixture.roster, "utf8");
  const second = run(args, fixture.dir);
  assert.strictEqual(second.code, 0, second.err);
  assert.strictEqual(fs.readFileSync(fixture.ledger, "utf8"), ledgerAfterOne);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), rosterAfterOne);
  assert.strictEqual(second.out, first.out);
});

test("record writes the Batches row, drops the placeholder, and prints what it wrote", () => {
  const fixture = ledgerAndRoster();
  const result = run(recordArgs(fixture), fixture.dir);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| Z | 1-3 | reported |"), ledger);
  assert.ok(!ledger.includes("(no batch yet)"));
  assert.ok(!ledger.includes("(no item yet)"));
  assert.ok(result.out.includes("| Z | 1-3 | reported |"));
});

test("a second call rewrites only the cells its arguments name", () => {
  const fixture = ledgerAndRoster();
  run(recordArgs(fixture), fixture.dir);
  const args = ["record", "--ledger", fixture.ledger, "--batch", "Z", "--state", "accepted"];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| Z | 1-3 | accepted |"), ledger);
  assert.ok(ledger.includes("check: pass — boundary pass, diff pass"));
});

test("a State the Batches table does not name is refused and nothing is written", () => {
  const fixture = ledgerAndRoster();
  const before = fs.readFileSync(fixture.ledger, "utf8");
  const args = ["record", "--ledger", fixture.ledger, "--batch", "Z", "--state", "done"];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 1);
  assert.match(result.err, /did not find a State the Batches table names/);
  assert.strictEqual(fs.readFileSync(fixture.ledger, "utf8"), before);
});

test("the S-n counter reads the table it appends to", () => {
  const fixture = ledgerAndRoster();
  run(recordArgs(fixture), fixture.dir);
  const args = [
    "record",
    "--ledger",
    fixture.ledger,
    "--batch",
    "Z",
    "--s-item",
    "exit-kanri-proposal.md item 2 | a second item",
    "--now",
    "2026-09-19 11:00",
  ];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| S-1 | batch-Z-report.md item 1 |"), ledger);
  assert.ok(ledger.includes("| S-2 | exit-kanri-proposal.md item 2 |"), ledger);
});

test("the Measurements entry replaces its own batch and leaves the others alone", () => {
  const fixture = ledgerAndRoster();
  const earlier = [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Y",
    "--kanri",
    "kanri-y [cccccc]",
    "--kanri-reading",
    "transcript: 1 B, 1 records, 1 wake-ups, 0 compactions, context=11 ttl=1h",
    "--jisso",
    "jisso-y [dddddd]",
    "--jisso-reading",
    JISSO_READING,
    "--now",
    "2026-09-19 09:00",
  ];
  assert.strictEqual(run(earlier, fixture.dir).code, 0);
  run(recordArgs(fixture), fixture.dir);
  const again = [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Z",
    "--kanri",
    "kanri-z [aaaaaa]",
    "--kanri-reading",
    "transcript: 9 B, 9 records, 9 wake-ups, 0 compactions, context=99 ttl=5m",
    "--jisso",
    "jisso-z [bbbbbb]",
    "--jisso-reading",
    JISSO_READING,
    "--now",
    "2026-09-19 12:00",
  ];
  assert.strictEqual(run(again, fixture.dir).code, 0);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  // Batch Y's entry is another batch's and is left alone; batch Z's own
  // earlier entry is replaced, not appended to.
  assert.ok(ledger.includes("batch Y: kanri context=11, jisso context=8, ttl=1h"), ledger);
  assert.ok(ledger.includes("batch Z: kanri context=99, jisso context=8, ttl=5m"), ledger);
  assert.ok(!ledger.includes("kanri context=4"), "batch Z's earlier entry survived");
});

test("the Progress line is replaced whole and the Session events line is written once", () => {
  const fixture = ledgerAndRoster();
  run(recordArgs(fixture), fixture.dir);
  run(recordArgs(fixture), fixture.dir);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("batch Z reported, ruling pending"), ledger);
  assert.ok(!ledger.includes("rewritten in place: which batch is in flight"));
  const events = ledger.split("- 2026-09-19 10:00 — boundary Z verified").length - 1;
  assert.strictEqual(events, 1);
});

test("a Residency row is appended once and then rewritten in place", () => {
  const fixture = ledgerAndRoster();
  run(recordArgs(fixture), fixture.dir);
  const roster = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(
    roster.includes("| kanri | — | kanri-z [aaaaaa] | 2026-09-19 | batch Z | 1 | 2 | 3 | 0 | context=4 |"),
    roster,
  );
  assert.ok(
    roster.includes("| jisso | — | jisso-z [bbbbbb] | 2026-09-19 | batch Z | 5 | 6 | 7 | 0 | context=8 |"),
    roster,
  );
  const rows = roster.split("kanri-z [aaaaaa]").length - 1;
  assert.strictEqual(rows, 1);
});

test("a peer reading and a status each name the row they write", () => {
  const fixture = ledgerAndRoster();
  const sessions = fs
    .readFileSync(fixture.roster, "utf8")
    .replace("| kanri | — | <name> [<ref>] |", "| keikaku | tanto-diet | keikaku-a [ccdd11] |");
  fs.writeFileSync(fixture.roster, sessions, "utf8");
  const args = [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Z",
    "--peer-reading",
    "keikaku keikaku-a [ccdd11] transcript: 7 B, 8 records, 9 wake-ups, 1 compactions, context=10",
    "--status",
    "keikaku-a [ccdd11] cleared",
    "--now",
    "2026-09-19 13:00",
  ];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const roster = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(
    roster.includes("| keikaku | — | keikaku-a [ccdd11] | 2026-09-19 | batch Z | 7 | 8 | 9 | 1 | context=10 |"),
    roster,
  );
  assert.ok(roster.includes("| keikaku | tanto-diet | keikaku-a [ccdd11] |"), roster);
  assert.ok(roster.includes("| cleared |"), roster);
});

test("a heading record cannot find makes it write nothing and exit 1, naming the table", () => {
  const fixture = ledgerAndRoster();
  const stripped = fs.readFileSync(fixture.ledger, "utf8").replace("## Batches", "## Batch list");
  fs.writeFileSync(fixture.ledger, stripped, "utf8");
  const before = fs.readFileSync(fixture.ledger, "utf8");
  const result = run(recordArgs(fixture), fixture.dir);
  assert.strictEqual(result.code, 1);
  assert.match(result.err, /the ledger's Batches table/);
  assert.strictEqual(fs.readFileSync(fixture.ledger, "utf8"), before);
});

test("record keeps a file's own line ending", () => {
  const fixture = ledgerAndRoster();
  const crlf = fs.readFileSync(fixture.ledger, "utf8").replace(/\n/g, "\r\n");
  fs.writeFileSync(fixture.ledger, crlf, "utf8");
  const args = ["record", "--ledger", fixture.ledger, "--batch", "Z", "--state", "sent"];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const after = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(after.includes("\r\n"), "the CRLF endings were lost");
  assert.ok(!/[^\r]\n/.test(after), "a bare LF was written into a CRLF file");
});
```

- [ ] **Step 1: Write the test file**

Write `skills/tanto/scripts/boundary.test.js` with exactly the content of
**W1.1**. The fixtures are synthetic and each run happens in a temporary
directory that is **not** a git repository, so `passage-check boundary`'s
`git status` check and `passage-check diff` both fail there —
deterministically, which is what the `check: fail` assertions rest on.

- [ ] **Step 2: Run the suite and watch every test fail**

```bash
node --test 'skills/tanto/scripts/boundary.test.js'
```

Expected: `# fail 18`, every failure reading `Cannot find module` and naming
`skills/tanto/scripts/boundary.js`. A red suite is this task's deliverable. The
first fence of "How a batch is verified" is gated on `boundary.js` existing,
so the plan's own verification list stays green across this task.

- [ ] **Step 3: Check the file is the whole suite**

```bash
grep -c '^test(' skills/tanto/scripts/boundary.test.js
grep -c 'record run twice changes nothing' skills/tanto/scripts/boundary.test.js
```

Expected: `18`, then `1`. `verify` does not compare a `W` block against the
file — `verifyTask` reads `P` and `A` blocks only — so this grep is the
content check for this task.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.test.js
```

Expected: every hook `Passed` or `Skipped`. **W1.1**'s content is already in
Biome's own formatting at `lineWidth: 120` (`biome.json`), and `biome check`
reports nothing on it — both verified against this exact content while the
plan was drafted. A Biome rewrite here is a plan defect to report under the
batch report's **Deviations from the plan**, not to absorb.

- [ ] **Step 5: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 1
```

Expected: `task 1: no passages` — this task carries one `W` block and no `P`
or `A` block, so there is nothing for `verify` to match, and step 3 is the
content check.

- [ ] **Step 6: Commit**

```bash
git add skills/tanto/scripts/boundary.test.js
git commit --only skills/tanto/scripts/boundary.test.js -m "$(printf 'tanto: the boundary tests, written before the instrument\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for that path. `.gitattributes` pins `*.js` to
`eol=lf`, so a created `.js` needs no line-ending restore; task 4's created
Markdown template does.

### Task 2: `scripts/boundary.js` — `check` and `record`, and the suite goes green

**Files:**

- Create: `skills/tanto/scripts/boundary.js`

**Interfaces:**

- Consumes: `skills/tanto/scripts/passage-check.js`'s printed output for
  `boundary --plan <p>`, `diff --plan <p> --base <b>`, and
  `sections --file <p> <heading>...`; `skills/tanto/scripts/reading.js`'s
  printed output for `<transcript> --role kanri --presence`. Child processes,
  so that `boundary.js` depends on what those two scripts print and not on
  their internals. Their CLI is
  `passage-check.js <lint|replay|diff|verify|sections|frame|boundary> [--plan <path>] [--file <path>] [--base <ref>] [--task <N>] [--stage 1|2] [<heading>...]`.
  And task 1's eighteen assertions, which this task makes pass.
- Produces, for `templates/boundary-brief.md` (task 4) and `roles/kanri.md`'s
  new loop (task 8), two subcommands.

  ```text
  node "$TANTO/scripts/boundary.js" check --plan <p> --report <r> --base <b>
    [--kanri-transcript <t>] [--measurement <m>] [--tanto <dir>]
  ```

  It prints `check: pass|fail — boundary pass|fail, diff pass|fail` first,
  then each child's output unchanged under `## boundary`, `## diff`,
  `## sections`, `## measurement` (only with `--measurement`),
  `## jisso reading`, and `## kanri reading` (only with
  `--kanri-transcript`). `--tanto` defaults to the script's own directory's
  parent. Exit `0` pass, `1` fail, `2` a missing or unnamed input path. It
  judges nothing and edits nothing.

  ```text
  node "$TANTO/scripts/boundary.js" record --ledger <l> --batch <X>
    [--roster <ro>] [--tasks <N-M>] [--state planned|sent|reported|accepted|rework]
    [--report <path>] [--verdict "<one line>"] [--progress "<one line>"]
    [--kanri "<name [ref]>"] [--kanri-reading "<reading>"]
    [--jisso "<name [ref]>"] [--jisso-reading "<reading>"]
    [--peer-reading "<role> <name [ref]> <reading>"]...
    [--s-item "<source> | <item>"]... [--event "<line>"]...
    [--status "<name [ref]> live|cleared|queued"]... [--now "<YYYY-MM-DD HH:MM>"]
  ```

  Every argument but `--ledger` and `--batch` is optional, and each names the
  cells or rows the call writes, so a call touches nothing its arguments do
  not name. `--roster` is required only when a roster row is named. `--now`
  fixes the clock, for the tests. It prints every row it wrote, as written,
  and a re-run with the same arguments changes nothing and prints the same
  rows — which is why an `S-n` row and a Session events line that are already
  there are printed again rather than skipped silently. Exit `0` having
  written, `1` having written nothing and named what it could not find, `2` on
  a missing required argument or path.

  The `ttl=` value of the Measurements entry is read out of the
  `--kanri-reading` string rather than passed as a flag of its own: the brief
  holds that value in the string `check` printed under `## kanri reading`, and
  the spec's 1.4 gives `record` no `--ttl`.

**Named-mechanism sites.** The State values validated here are the five the
ledger template's Batches table names — `planned`, `sent`, `reported`,
`accepted`, `rework` (`templates/kanri.md`, its Batches paragraph). The status
words `--status` takes are the roster's — `live`, `cleared`, `queued`
(`templates/roster.md`, the Keeping rule). The Measurements entry form is the
one task 7 documents, and the `unanswered:` / `answered:` pair task 7
documents is written through `--event`. The executables count this file
changes is named once in `SKILL.md` (task 10) and twice in `README.md`
(task 11). Neither vocabulary is extended here.

**Old values this task contradicts:**

**O2.1** `two executables` — 1 hit, `skills/tanto/SKILL.md`. It may
stay until task 10 lands `three executables`; a residual after task 10 is a
defect.

**O2.2** `Both scripts are Node` — 1 hit, `skills/tanto/README.md`.
It may stay until task 11 rewrites the Layout bullets; a residual after task
11 is a defect.

**Whole file:**

**W2.1** `skills/tanto/scripts/boundary.js` — new file, 515 lines

```javascript
// tanto's boundary instrument, beside `passage-check.js` and `reading.js`.
// Two subcommands: `check`, which runs the boundary's read-only commands and
// prints their output under fixed headings, and `record`, which writes the
// ledger's and the roster's rows. Run by the `boundary.verify` kind from
// `templates/boundary-brief.md`, and, under the design's shape 2, by a
// headless session running the same brief. It judges nothing.
//
// Node, no dependencies, no shebang: always
// `node "$TANTO/scripts/boundary.js" <subcommand>`.

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

/** The five report headings the boundary reads, in the brief's order. */
const REPORT_HEADINGS = [
  "For Kanri",
  "Rulings",
  "Questions for the human",
  "Deviations from the plan",
  "Shoroku proposal",
];

/** A measurement report's two headings, read only with `--measurement`. */
const MEASUREMENT_HEADINGS = ["Tasks", "Verification"];

/**
 * `--flag value` pairs and bare `--flag` switches. A flag named in
 * `repeatable` collects every occurrence into an array; every other flag
 * keeps its last value, so the same call is read the same way twice. A value
 * that itself begins with `--` is read as the next flag, which is why no
 * argument this script takes may begin with a dash.
 */
function parseArgs(argv, repeatable = []) {
  const values = {};
  for (const name of repeatable) values[name] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const name = arg.slice(2);
    const next = argv[i + 1];
    const value = next === undefined || next.startsWith("--") ? true : next;
    if (value !== true) i++;
    if (repeatable.includes(name)) values[name].push(value);
    else values[name] = value;
  }
  return values;
}

/** A given `--flag value`, or null for an absent flag or a bare switch. */
function given(values, name) {
  const value = values[name];
  return value === undefined || value === true ? null : String(value);
}

/** One line on stderr, and the exit code the caller returns. */
function fail(message, code) {
  process.stderr.write(`boundary.js: ${message}\n`);
  return code;
}

/** The skill's own directory: `--tanto`, else this script's own parent. */
function tantoDir(values) {
  return given(values, "tanto") || path.dirname(__dirname);
}

/**
 * A child `node <script> <args...>`, its two streams joined in the order a
 * reader sees them and its exit code mapped from a signal to 1.
 */
function child(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    cwd: process.cwd(),
  });
  const out = `${result.stdout || ""}${result.stderr || ""}`;
  const code = result.status === null ? 1 : result.status;
  return { code, out };
}

/**
 * The report header's Transcript and Ceiling lines, in the file's own order:
 * Jisso's reading, which the report carries beside its Transcript line.
 */
function reportHeader(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const found = [];
  for (const line of lines) {
    if (line.startsWith("## ")) break;
    if (/^- (Transcript|Ceiling) — /.test(line)) found.push(line);
  }
  return found.length > 0 ? found.join("\n") : "no reading line in the report's header";
}

function cmdCheck(argv) {
  const values = parseArgs(argv);
  for (const name of ["plan", "report", "base"]) {
    if (!given(values, name)) return fail(`check needs --${name}`, 2);
  }
  for (const name of ["plan", "report", "measurement", "kanri-transcript"]) {
    const value = given(values, name);
    if (value !== null && !fs.existsSync(value)) {
      return fail(`check: --${name} ${value} is not on disk`, 2);
    }
  }

  const tanto = tantoDir(values);
  const passageCheck = path.join(tanto, "scripts", "passage-check.js");
  const reading = path.join(tanto, "scripts", "reading.js");
  for (const script of [passageCheck, reading]) {
    if (!fs.existsSync(script)) return fail(`check: ${script} is not on disk`, 2);
  }

  const plan = given(values, "plan");
  const report = given(values, "report");
  const boundary = child(passageCheck, ["boundary", "--plan", plan]);
  const diff = child(passageCheck, ["diff", "--plan", plan, "--base", given(values, "base")]);
  const sections = child(passageCheck, ["sections", "--file", report, ...REPORT_HEADINGS]);

  const word = (code) => (code === 0 ? "pass" : "fail");
  const verdict = boundary.code === 0 && diff.code === 0 ? "pass" : "fail";

  const blocks = [
    ["boundary", boundary.out],
    ["diff", diff.out],
    ["sections", sections.out],
  ];
  const measurement = given(values, "measurement");
  if (measurement !== null) {
    const args = ["sections", "--file", measurement, ...MEASUREMENT_HEADINGS];
    blocks.push(["measurement", child(passageCheck, args).out]);
  }
  blocks.push(["jisso reading", reportHeader(report)]);
  const transcript = given(values, "kanri-transcript");
  if (transcript !== null) {
    const args = [transcript, "--role", "kanri", "--presence"];
    blocks.push(["kanri reading", child(reading, args).out]);
  }

  console.log(`check: ${verdict} — boundary ${word(boundary.code)}, diff ${word(diff.code)}`);
  for (const [heading, body] of blocks) {
    console.log(`\n## ${heading}\n`);
    console.log(String(body).replace(/\s+$/, ""));
  }
  return verdict === "pass" ? 0 : 1;
}

/** The flags `record` collects rather than overwrites. */
const REPEATABLE = ["peer-reading", "s-item", "event", "status"];

/** The Batches table's six cells, in the ledger template's column order. */
const BATCH_CELLS = ["batch", "tasks", "state", "prompt", "report", "verdict"];

/** The five values the ledger template's Batches table names for State. */
const STATES = ["planned", "sent", "reported", "accepted", "rework"];

/** The Measurements row whose Value cell carries the per-boundary entries. */
const MEASUREMENT_ROW = "Kanri's context at the topic's opening";

/** The roster's two `| Role | Topic | Name [ref] |` tables, told apart. */
const SESSIONS_HEADER = "| Role | Topic | Name [ref] | cwd |";
const RESIDENCY_HEADER = "| Role | Topic | Name [ref] | Since |";

/** A reading's five figures, in the spelling `reading.js` prints them. */
const READING = /transcript: (\d+) B, (\d+) records, (\d+) wake-ups, (\d+) compactions, context=(\d+)/;

/** A `--peer-reading` value: the role, the address, and the reading. */
const PEER = /^(\S+)\s+(\S+(?:\s+\[[^\]]+\])?)\s+(transcript:.*)$/;

/** A document read for editing, with the line ending it already uses. */
function readDoc(file) {
  const raw = fs.readFileSync(file, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  return { file, lines: raw.split(/\r?\n/), eol };
}

/**
 * The document back to disk with its own line ending and its own trailing
 * newline: the split left a final empty element for the newline the file
 * ended with, and the join puts it back.
 */
function writeDoc(doc) {
  fs.writeFileSync(doc.file, doc.lines.join(doc.eol), "utf8");
}

/** The cells of a `| a | b |` row, trimmed. */
function cells(line) {
  const inner = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "");
  return inner.split("|").map((cell) => cell.trim());
}

/** The row a cell list writes back as. */
function row(values) {
  return `| ${values.join(" | ")} |`;
}

/** A `## <heading>` section's line span, end-exclusive. */
function sectionSpan(lines, heading) {
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length && !/^#{1,2} /.test(lines[end])) end++;
  return { start, end };
}

/** The first table inside a span: its header row, its first data row, its end. */
function tableSpan(lines, span) {
  for (let i = span.start; i < span.end; i++) {
    const next = lines[i + 1] || "";
    if (lines[i].startsWith("| ") && next.startsWith("| ---")) {
      let end = i + 2;
      while (end < span.end && lines[end].startsWith("|")) end++;
      return { header: i, first: i + 2, end };
    }
  }
  return null;
}

/** A table located by its header row rather than by a heading. */
function tableByHeader(lines, header) {
  const at = lines.findIndex((line) => line.startsWith(header));
  if (at === -1) return null;
  let end = at + 2;
  while (end < lines.length && lines[end].startsWith("|")) end++;
  return { header: at, first: at + 2, end };
}

/** The five figures of a reading string, or null when it does not parse. */
function readingFigures(text) {
  const found = READING.exec(String(text));
  if (!found) return null;
  const [, bytes, records, wakeUps, compactions, context] = found;
  return { bytes, records, wakeUps, compactions, context };
}

/** The cache regime a reading string carries, or `unknown`. */
function ttlOf(text) {
  const found = /ttl=(5m|1h|unknown)/.exec(String(text));
  return found ? found[1] : "unknown";
}

/** `YYYY-MM-DD HH:MM`, the stamp a Session events line carries. */
function stamp(date) {
  const two = (n) => String(n).padStart(2, "0");
  const day = `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`;
  const time = `${two(date.getHours())}:${two(date.getMinutes())}`;
  return `${day} ${time}`;
}

/** The Batches row for this batch: replaced when it exists, appended when not. */
function writeBatch(doc, values, written) {
  const span = sectionSpan(doc.lines, "Batches");
  if (!span) return "the ledger's Batches table";
  const table = tableSpan(doc.lines, span);
  if (!table) return "the ledger's Batches table";
  const batch = given(values, "batch");
  const state = given(values, "state");
  if (state !== null && !STATES.includes(state)) {
    return `a State the Batches table names (got ${state})`;
  }
  const wanted = {
    batch,
    tasks: given(values, "tasks"),
    state,
    prompt: null,
    report: given(values, "report"),
    verdict: given(values, "verdict"),
  };
  let at = -1;
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[0] === batch) at = i;
  }
  const blank = BATCH_CELLS.map(() => "");
  const current = at === -1 ? blank : cells(doc.lines[at]);
  while (current.length < BATCH_CELLS.length) current.push("");
  const next = BATCH_CELLS.map((name, i) => (wanted[name] === null ? current[i] : wanted[name]));
  const line = row(next);
  if (at !== -1) {
    doc.lines[at] = line;
    written.push(line);
    return null;
  }
  const placeholders = [];
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[0] === "(no batch yet)") placeholders.push(i);
  }
  doc.lines.splice(table.end, 0, line);
  for (const i of placeholders.reverse()) doc.lines.splice(i, 1);
  written.push(line);
  return null;
}

/**
 * The per-boundary entry, inside the Measurements row's Value cell: one
 * `batch <X>: …` entry per batch separated by `;`, this batch's replaced and
 * every other entry — the opening and the landing ones Kanri writes by hand —
 * left untouched.
 */
function writeMeasurement(doc, batch, kanri, jisso, ttl, written) {
  const span = sectionSpan(doc.lines, "Measurements");
  if (!span) return "the ledger's Measurements table";
  const table = tableSpan(doc.lines, span);
  if (!table) return "the ledger's Measurements table";
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    if (!current[0].startsWith(MEASUREMENT_ROW)) continue;
    const entry = `batch ${batch}: kanri context=${kanri.context}, jisso context=${jisso.context}, ttl=${ttl}`;
    const raw = current[2].split(";");
    const entries = raw.map((part) => part.trim()).filter((part) => part.length > 0);
    const at = entries.findIndex((part) => part.startsWith(`batch ${batch}:`));
    if (at === -1) entries.push(entry);
    else entries[at] = entry;
    current[2] = entries.join("; ");
    doc.lines[i] = row(current);
    written.push(doc.lines[i]);
    return null;
  }
  return "the ledger's Measurements per-boundary row";
}

/**
 * One `S-n` row, numbered from the table's highest existing `S-n`, so that a
 * `pending` row a Kanri exit wrote there since the last boundary is counted
 * and not overwritten. A row with the same Source and Item is already there.
 */
function writeSItem(doc, item, written) {
  const span = sectionSpan(doc.lines, "Shoroku proposal items");
  if (!span) return "the ledger's Shoroku proposal items table";
  const table = tableSpan(doc.lines, span);
  if (!table) return "the ledger's Shoroku proposal items table";
  const parts = String(item).split("|");
  const source = parts[0].trim();
  const text = parts.slice(1).join("|").trim();
  let highest = 0;
  const placeholders = [];
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    if (current[1] === source && current[2] === text) {
      // Already recorded. Print the row as it stands, so that a re-run
      // with the same arguments prints the same rows as the first run.
      written.push(doc.lines[i]);
      return null;
    }
    const found = /^S-(\d+)$/.exec(current[0]);
    if (found) highest = Math.max(highest, Number(found[1]));
    if (current[0] === "(no item yet)") placeholders.push(i);
  }
  const line = row([`S-${highest + 1}`, source, text, "", "pending", "t2", "no"]);
  doc.lines.splice(table.end, 0, line);
  for (const i of placeholders.reverse()) doc.lines.splice(i, 1);
  written.push(line);
  return null;
}

/** One Session events line, appended once for the same text. */
function writeEvent(doc, text, now, written) {
  const span = sectionSpan(doc.lines, "Session events");
  if (!span) return "the ledger's Session events section";
  const tail = ` — ${text}`;
  for (let i = span.start + 1; i < span.end; i++) {
    if (doc.lines[i].endsWith(tail)) {
      written.push(doc.lines[i]);
      return null;
    }
  }
  let at = span.end;
  while (at > span.start + 1 && doc.lines[at - 1].trim() === "") at--;
  const line = `- ${now} — ${text}`;
  doc.lines.splice(at, 0, line);
  written.push(line);
  return null;
}

/** The Progress section's body, replaced whole by the one line. */
function writeProgress(doc, text, written) {
  const span = sectionSpan(doc.lines, "Progress");
  if (!span) return "the ledger's Progress section";
  doc.lines.splice(span.start + 1, span.end - span.start - 1, "", text, "");
  written.push(text);
  return null;
}

/** A Residency row, rewritten in place from a reading, or appended. */
function writeResidency(doc, role, name, reading, batch, today, written) {
  const figures = readingFigures(reading);
  if (!figures) return `a reading that parses (got ${reading})`;
  const table = tableByHeader(doc.lines, RESIDENCY_HEADER);
  if (!table) return "the roster's Residency table";
  let at = -1;
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[2] === name) at = i;
  }
  const blank = [role, "—", name, today, "", "", "", "", "", "", "—", "—", "—"];
  const current = at === -1 ? blank : cells(doc.lines[at]);
  while (current.length < blank.length) current.push("—");
  current[4] = `batch ${batch}`;
  current[5] = figures.bytes;
  current[6] = figures.records;
  current[7] = figures.wakeUps;
  current[8] = figures.compactions;
  current[9] = `context=${figures.context}`;
  const line = row(current);
  if (at === -1) doc.lines.splice(table.end, 0, line);
  else doc.lines[at] = line;
  written.push(line);
  return null;
}

/** A session row's Status cell. */
function writeStatus(doc, name, status, written) {
  const table = tableByHeader(doc.lines, SESSIONS_HEADER);
  if (!table) return "the roster's sessions table";
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    if (current[2] !== name) continue;
    current[9] = status;
    doc.lines[i] = row(current);
    written.push(doc.lines[i]);
    return null;
  }
  return `a roster row for ${name}`;
}

function cmdRecord(argv) {
  const values = parseArgs(argv, REPEATABLE);
  const ledgerPath = given(values, "ledger");
  const batch = given(values, "batch");
  if (!ledgerPath) return fail("record needs --ledger", 2);
  if (!batch) return fail("record needs --batch", 2);
  if (!fs.existsSync(ledgerPath)) return fail(`record: --ledger ${ledgerPath} is not on disk`, 2);

  const kanri = given(values, "kanri");
  const jisso = given(values, "jisso");
  const kanriReading = given(values, "kanri-reading");
  const jissoReading = given(values, "jisso-reading");
  const rosterRows = values["peer-reading"].length + values.status.length;
  const needRoster = kanri !== null || jisso !== null || rosterRows > 0;
  const rosterPath = given(values, "roster");
  if (needRoster && !rosterPath) return fail("record needs --roster for a roster row", 2);
  if (needRoster && !fs.existsSync(rosterPath)) {
    return fail(`record: --roster ${rosterPath} is not on disk`, 2);
  }

  const now = given(values, "now") || stamp(new Date());
  const today = now.slice(0, 10);
  const written = [];
  const problems = [];
  const note = (problem) => {
    if (problem) problems.push(problem);
  };

  const ledger = readDoc(ledgerPath);
  note(writeBatch(ledger, values, written));
  if (kanriReading !== null && jissoReading !== null) {
    const kanriFigures = readingFigures(kanriReading);
    const jissoFigures = readingFigures(jissoReading);
    if (!kanriFigures || !jissoFigures) note("two readings that parse");
    else {
      const ttl = ttlOf(kanriReading);
      note(writeMeasurement(ledger, batch, kanriFigures, jissoFigures, ttl, written));
    }
  }
  for (const item of values["s-item"]) note(writeSItem(ledger, item, written));
  for (const event of values.event) note(writeEvent(ledger, event, now, written));
  const progress = given(values, "progress");
  if (progress !== null) note(writeProgress(ledger, progress, written));

  let roster = null;
  if (needRoster) {
    roster = readDoc(rosterPath);
    if (kanri !== null && kanriReading === null) note("--kanri-reading beside --kanri");
    if (kanri !== null && kanriReading !== null) {
      note(writeResidency(roster, "kanri", kanri, kanriReading, batch, today, written));
    }
    if (jisso !== null && jissoReading === null) note("--jisso-reading beside --jisso");
    if (jisso !== null && jissoReading !== null) {
      note(writeResidency(roster, "jisso", jisso, jissoReading, batch, today, written));
    }
    for (const line of values["peer-reading"]) {
      const found = PEER.exec(String(line));
      if (!found) {
        note(`a --peer-reading that parses (got ${line})`);
        continue;
      }
      note(writeResidency(roster, found[1], found[2], found[3], batch, today, written));
    }
    for (const line of values.status) {
      const found = /^(.*)\s+(live|cleared|queued)$/.exec(String(line).trim());
      if (!found) {
        note(`a --status that parses (got ${line})`);
        continue;
      }
      note(writeStatus(roster, found[1].trim(), found[2], written));
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) fail(`record wrote nothing — it did not find ${problem}`, 1);
    return 1;
  }

  writeDoc(ledger);
  if (roster) writeDoc(roster);
  for (const line of written) console.log(line);
  return 0;
}

function main(argv) {
  const sub = argv[0];
  if (sub === "check") return cmdCheck(argv.slice(1));
  if (sub === "record") return cmdRecord(argv.slice(1));
  return fail("usage: boundary.js check|record <options>", 2);
}

process.exitCode = main(process.argv.slice(2));
```

- [ ] **Step 1: Write the file**

Write `skills/tanto/scripts/boundary.js` with exactly the content of **W2.1**.
It carries no shebang and no `"use strict"`, as `passage-check.js` and
`reading.js` carry neither: the runtime text always spells
`node "$TANTO/scripts/boundary.js"`, and a module is in strict mode already
(Biome's `noRedundantUseStrict` reports the directive as redundant).

- [ ] **Step 2: Run the suite and watch it go green**

```bash
node --test 'skills/tanto/scripts/*.test.js'
```

Expected: `# fail 0`, with `tests 18` and `pass 18` from `boundary.test.js`
alone. This exact pair of files was run this way while the plan was drafted —
18 tests, 18 pass — against real copies of `templates/kanri.md` and
`templates/roster.md`. `reading.test.js` and `passage-check.test.js` are
unaffected by this task.

- [ ] **Step 3: Check the file is both subcommands**

```bash
grep -c 'function cmdCheck\|function cmdRecord' skills/tanto/scripts/boundary.js
node skills/tanto/scripts/boundary.js 2>&1 | tail -1
```

Expected: `2`, then
`boundary.js: usage: boundary.js check|record <options>`. As in task 1,
`verify` does not compare a `W` block against the file, so these two commands
are the content check.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js
```

Expected: every hook `Passed` or `Skipped`. **W2.1**'s content is already in
Biome's own formatting at `lineWidth: 120`, and `biome check` reports nothing
on it — both verified against this exact content while the plan was drafted. A
Biome rewrite here is a plan defect to report, not to absorb.

- [ ] **Step 5: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 2
```

- [ ] **Step 6: Commit**

```bash
git add skills/tanto/scripts/boundary.js
git commit --only skills/tanto/scripts/boundary.js -m "$(printf 'tanto: boundary.js — the boundary reads and records through one instrument\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: `task 2: no passages`, for the reason task 1's step 5 gives, and
then, of step 6, nothing printed for that path.

### Task 3: `reading.js` — the `ttl=` line, with its test cases

**Files:**

- Modify: `skills/tanto/scripts/reading.js`
- Modify (test): `skills/tanto/scripts/reading.test.js`

**Interfaces:**

- Consumes: the existing `tokens(value)`, `contextOf(record)`,
  `isWakeUp(record)`, `wakeUpText(record)` helpers, and the fixture helpers of
  `reading.test.js` — `writeTranscript(records)`, `run(args, extraEnv)`,
  `human(timestamp, text)`, `assistant(usage, extra)`, `tmpDir()`.
- Produces: a third always-printed line, `ttl=5m|1h|unknown`, and
  `readTranscript`'s return object gains `ttl`. `boundary.js record` reads that
  value out of the `--kanri-reading` string it is handed (task 2, `ttlOf`), and
  `check` prints it under `## kanri reading`. The `--share` form is unchanged.

**The rule, stated once.** For each wake-up, the gap since the most recent
record that carried a timestamp — a wake-up included, not only an `assistant`
record — is paired with the next `assistant` record's `usage`. That is a
deliberate departure from the spec's 1.5, which says "the gap since the
previous `assistant` record": two wake-ups can arrive with no `assistant`
record between them, and measuring from the earlier `assistant` record would
then report idle time that did not pass. The two readings differ only in that
case. The wake-up is **cold** when
`cache_creation_input_tokens + input_tokens` exceeds `cache_read_input_tokens`,
and **warm** otherwise. Among the wake-ups whose gap is between 5 and 60
minutes **inclusive**, the most recent one decides: cold reads `5m`, warm reads
`1h`. No such wake-up yet reads `unknown`. A shorter gap is warm under either
TTL and a longer one is cold under both, which is why only that window decides.

**Named-mechanism sites.** The `ttl=` line is named in four other places, each
landed by a later task: `SKILL.md`'s "The transcript reading" (task 10),
`README.md`'s `reading.js` Layout bullet and its Prerequisites bullet (task 11),
`templates/kanri.md`'s Measurements entry form (task 7), and
`templates/boundary-brief.md`'s Ceiling section (task 4). The line travels
nowhere by itself: the reading appended to a boundary or exit line stays the
**first** line only.

**Old values this task contradicts:**

**O3.1** `That prints two lines always` — 1 hit, `skills/tanto/SKILL.md` line
435. It may stay until task 10 lands "three lines always"; a residual after
task 10 is a defect.

**O3.2** `measures itself with: the` — 1 hit, `skills/tanto/README.md`,
the `reading.js` Layout bullet's opening, whose next words are today
"five-figure reading of one transcript". The needle spans the point the new
text breaks the line at, which a needle on the phrase itself would not: the
phrase survives in the new bullet. It may stay until task 11 rewrites that
bullet; a residual after task 11 is a defect.

**Anchor:**

**A3.1** `skills/tanto/scripts/reading.js` — `grep -c TTL_WINDOW_MIN skills/tanto/scripts/reading.js` — before: 0, after: 2

**Passages:**

**P3.1** `skills/tanto/scripts/reading.js` — insert after these 1 lines

```javascript
const COMPACTION_PHRASE = "This session is being continued from a previous conversation";
```

**P3.1 →**

```javascript

// The gap window the cache regime is read off: a wake-up after a gap of five
// to sixty minutes, inclusive, is the one that tells a 5-minute TTL from a
// 1-hour one, because a shorter gap is warm under either and a longer one is
// cold under both.
const TTL_WINDOW_MIN = 5;
const TTL_WINDOW_MAX = 60;
```

**P3.2** `skills/tanto/scripts/reading.js` — replace exactly these 5 lines

```javascript
/**
 * The five figures, the effort, the baseline, and the last human turn, from
 * one transcript. Throws when the file cannot be read, which the caller
 * reports as the `unavailable` form.
 */
```

**P3.2 →**

```javascript
/**
 * The five figures, the effort, the cache regime, the baseline, and the last
 * human turn, from one transcript. Throws when the file cannot be read, which
 * the caller reports as the `unavailable` form.
 */
```

**P3.3** `skills/tanto/scripts/reading.js` — replace exactly these 7 lines

```javascript
  let wakeUps = 0;
  let compactions = 0;
  let context = 0;
  let baseline = 0;
  let baselineSeen = false;
  let effort = "unknown";
  let lastHuman = null;
```

**P3.3 →**

```javascript
  let wakeUps = 0;
  let compactions = 0;
  let context = 0;
  let baseline = 0;
  let baselineSeen = false;
  let effort = "unknown";
  let lastHuman = null;
  // The cache regime: the timestamp of the most recent record that carried
  // one, whether the last wake-up's gap fell inside the window, and the
  // verdict the most recent windowed wake-up gave.
  let lastStamp = null;
  let inWindow = false;
  let ttl = "unknown";
```

**P3.4** `skills/tanto/scripts/reading.js` — replace exactly these 25 lines

```javascript
    if (isWakeUp(record)) {
      wakeUps++;
      if (wakeUpText(record).startsWith(COMPACTION_PHRASE)) compactions++;
      if (record.origin && record.origin.kind === "human" && record.timestamp) {
        lastHuman = record.timestamp;
      }
      continue;
    }

    if (record.type === "assistant") {
      effort =
        typeof record.perTurnEffort === "string"
          ? record.perTurnEffort
          : typeof record.effort === "string"
            ? record.effort
            : "unknown";
      const turn = contextOf(record);
      if (turn !== null) {
        context = turn;
        if (!baselineSeen) {
          baseline = turn;
          baselineSeen = true;
        }
      }
    }
```

**P3.4 →**

```javascript
    if (isWakeUp(record)) {
      wakeUps++;
      if (wakeUpText(record).startsWith(COMPACTION_PHRASE)) compactions++;
      if (record.origin && record.origin.kind === "human" && record.timestamp) {
        lastHuman = record.timestamp;
      }
      const woke = Date.parse(record.timestamp);
      if (Number.isFinite(woke)) {
        const gap = lastStamp === null ? null : (woke - lastStamp) / 60000;
        inWindow = gap !== null && gap >= TTL_WINDOW_MIN && gap <= TTL_WINDOW_MAX;
        lastStamp = woke;
      }
      continue;
    }

    if (record.type === "assistant") {
      effort =
        typeof record.perTurnEffort === "string"
          ? record.perTurnEffort
          : typeof record.effort === "string"
            ? record.effort
            : "unknown";
      const spoke = Date.parse(record.timestamp);
      if (Number.isFinite(spoke)) lastStamp = spoke;
      const usage = record.message?.usage;
      if (inWindow && usage && typeof usage === "object") {
        // The wake-up's own cost, billed on the turn that answered it: fresh
        // input above cache reads means the cache had expired, so the regime
        // is the shorter TTL.
        const fresh = tokens(usage.input_tokens) + tokens(usage.cache_creation_input_tokens);
        ttl = fresh > tokens(usage.cache_read_input_tokens) ? "5m" : "1h";
        inWindow = false;
      }
      const turn = contextOf(record);
      if (turn !== null) {
        context = turn;
        if (!baselineSeen) {
          baseline = turn;
          baselineSeen = true;
        }
      }
    }
```

**P3.5** `skills/tanto/scripts/reading.js` — replace exactly these 10 lines

```javascript
  return {
    bytes,
    records: lines.length,
    wakeUps,
    compactions,
    context,
    baseline,
    effort,
    lastHuman,
  };
```

**P3.5 →**

```javascript
  return {
    bytes,
    records: lines.length,
    wakeUps,
    compactions,
    context,
    baseline,
    effort,
    ttl,
    lastHuman,
  };
```

**P3.6** `skills/tanto/scripts/reading.js` — replace exactly these 3 lines

```javascript
    console.log(`transcript: unavailable — ${oneLine(err.message)}`);
    console.log("effort=unknown");
    return 0;
```

**P3.6 →**

```javascript
    console.log(`transcript: unavailable — ${oneLine(err.message)}`);
    console.log("effort=unknown");
    console.log("ttl=unknown");
    return 0;
```

**P3.7** `skills/tanto/scripts/reading.js` — replace exactly these 1 lines

```javascript
  console.log(`effort=${reading.effort}`);
```

**P3.7 →**

```javascript
  console.log(`effort=${reading.effort}`);
  console.log(`ttl=${reading.ttl}`);
```

**P3.8** `skills/tanto/scripts/reading.test.js` — insert after these 2 lines

```javascript
  assert.match(result.err, line("kanri\\.window", project));
});
```

**P3.8 →**

```javascript

// The cache regime's fixtures. `stampAt` puts every record on one UTC day so
// that a gap in the tests is exactly the minutes named.
function stampAt(minutes) {
  return new Date(Date.UTC(2026, 8, 19, 0, minutes, 0)).toISOString();
}

const COLD = { input_tokens: 10, cache_creation_input_tokens: 5000, cache_read_input_tokens: 100 };
const WARM = { input_tokens: 10, cache_creation_input_tokens: 0, cache_read_input_tokens: 5000 };

function ttlOf(out) {
  const found = /^ttl=(\S+)$/m.exec(out);
  return found ? found[1] : null;
}

test("ttl is the third line always, and unknown with no wake-up inside the window", () => {
  const file = writeTranscript([
    human(stampAt(0), "start"),
    assistant(WARM, { timestamp: stampAt(1) }),
    human(stampAt(3), "again"),
    assistant(WARM, { timestamp: stampAt(4) }),
  ]);
  const result = run([file]);
  assert.strictEqual(result.code, 0);
  const lines = result.out.split("\n");
  assert.match(lines[0], /^transcript: /);
  assert.match(lines[1], /^effort=/);
  assert.strictEqual(lines[2], "ttl=unknown");
});

test("a cold wake-up inside the window reads 5m and a warm one reads 1h", () => {
  const cold = writeTranscript([
    human(stampAt(0), "start"),
    assistant(WARM, { timestamp: stampAt(1) }),
    human(stampAt(31), "back"),
    assistant(COLD, { timestamp: stampAt(32) }),
  ]);
  assert.strictEqual(ttlOf(run([cold]).out), "5m");
  const warm = writeTranscript([
    human(stampAt(0), "start"),
    assistant(COLD, { timestamp: stampAt(1) }),
    human(stampAt(31), "back"),
    assistant(WARM, { timestamp: stampAt(32) }),
  ]);
  assert.strictEqual(ttlOf(run([warm]).out), "1h");
});

test("the window's edges are five and sixty minutes, both inclusive", () => {
  const cases = [
    [4, "unknown"],
    [5, "5m"],
    [60, "5m"],
    [61, "unknown"],
  ];
  for (const [gap, want] of cases) {
    const file = writeTranscript([
      human(stampAt(0), "start"),
      assistant(WARM, { timestamp: stampAt(1) }),
      human(stampAt(1 + gap), "back"),
      assistant(COLD, { timestamp: stampAt(2 + gap) }),
    ]);
    assert.strictEqual(ttlOf(run([file]).out), want, `gap ${gap}`);
  }
});

test("the most recent wake-up inside the window decides", () => {
  const file = writeTranscript([
    human(stampAt(0), "start"),
    assistant(WARM, { timestamp: stampAt(1) }),
    human(stampAt(31), "a cold gap"),
    assistant(COLD, { timestamp: stampAt(32) }),
    human(stampAt(92), "a warm gap"),
    assistant(WARM, { timestamp: stampAt(93) }),
  ]);
  assert.strictEqual(ttlOf(run([file]).out), "1h");
});

test("the unavailable form still prints three lines", () => {
  const result = run([path.join(tmpDir(), "gone.jsonl")]);
  assert.strictEqual(result.code, 0);
  const lines = result.out.split("\n");
  assert.match(lines[0], /^transcript: unavailable — /);
  assert.strictEqual(lines[1], "effort=unknown");
  assert.strictEqual(lines[2], "ttl=unknown");
});
```

- [ ] **Step 1: Write the failing test cases**

Apply **P3.8**.

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --test 'skills/tanto/scripts/reading.test.js'
```

Expected: `tests 23`, `pass 18`, `fail 5` — the file holds 18 tests before
P3.8 and 23 after it, and only the five new ones fail. The first failure is
`Expected values to be strictly equal: undefined !== 'ttl=unknown'`: the third
line does not exist yet.

- [ ] **Step 3: Add the `ttl=` derivation and print it**

Apply **P3.1**, **P3.2**, **P3.3**, **P3.4**, **P3.5**, **P3.6**, **P3.7**, in
that order.

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --test 'skills/tanto/scripts/*.test.js'
```

Expected: `# fail 0`. `boundary.test.js`'s `## kanri reading` case now sees a
third line and still passes: it asserts on the reading, ceiling, and human
lines only.

- [ ] **Step 5: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js
```

Expected: every hook `Passed` or `Skipped`. As in task 2, a Biome rewrite inside
one of these blocks is a plan defect to report, not to absorb — `reading.test.js`
carries a file-level `biome-ignore-all` for exactly this reason (its own header
comment says so).

- [ ] **Step 6: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 3
```

Expected: `task 3: verify clean`, and A3.1 reporting its stated `after:`
value. `verify` reads `P` and `A` blocks only and says nothing about an `O`
needle — O3.1's and O3.2's counts are the rows' own claim, swept for real by
task 16 step 4.

- [ ] **Step 7: Commit**

```bash
git commit --only skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js -m "$(printf 'tanto: the reading says which cache regime the session is in\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for those two paths.

### Task 4: `templates/boundary-brief.md` — the fifteenth template

**Files:**

- Create: `skills/tanto/templates/boundary-brief.md`

**Interfaces:**

- Consumes: `boundary.js check` and `boundary.js record` as task 2 defines
  their CLIs, and `passage-check.js sections` for the reading Kanri does
  afterwards.
- Produces: the argument list Kanri's dispatch prompt fills (task 8's new step
  2 renders exactly these names — `topic`, `batch`, `plan`, `report`, `ledger`,
  `roster`, `base`, `kanri-transcript`, `tanto`, and the two free-text lines),
  the verdict file's eleven `##` headings in a fixed order, and the one reply
  line whose shape task 8's step 3 and step 4 read.

**Named-mechanism sites.** The template count is named in `SKILL.md`'s
"Templates are copied and filled … Fourteen of them" (task 10) and in
`README.md`'s `templates/` Layout bullet (task 11); both become fifteen there.
The kind `boundary.verify` is named in `templates/tanto.json` (task 5),
`SKILL.md`'s kind list and its built-in-defaults paragraph (task 10),
`roles/kanri.md`'s loop step 2 (task 8), and `README.md` (task 11); it is
dispatched from exactly one site, task 8's step 2.

**Old values this task contradicts:**

**O4.1** `Fourteen of them` — 1 hit, `skills/tanto/SKILL.md`. It may
stay until task 10 lands `Fifteen of them`; a residual after task 10 is a
defect. The needle spans the count itself, which is the only place the
cardinality is written.

**Whole file:**

**W4.1** `skills/tanto/templates/boundary-brief.md` — new file, 161 lines

````markdown
# tanto boundary brief

The procedure the `boundary.verify` kind follows at one batch boundary, run on
Kanri's dispatch — and, under the design's shape 2, by a headless session: the
same text, the same arguments, the same output. You **dispatch nothing** and you
write **one** file. You judge nothing: every ruling is the resident Kanri's, and
your job is to read what it would otherwise read and to write the rows it would
otherwise write by hand.

Your dispatch names these arguments:

```text
topic=<topic> batch=<X> plan=<plan path> report=<report path>
ledger=<.tanto/<topic>/kanri.md> roster=<.tanto/roster.md> base=<merge base>
kanri-transcript=<Kanri's transcript path, from the roster's first data row>
tanto=<the skill's own directory>
peer readings since the last boundary, one per line, or none: <…>
top-family dispatches since the last boundary, one per line, or none: <…>
```

The last two lines are the two things you cannot see for yourself: the readings
peers' last lines carried since the previous boundary, and the top-family
dispatches a peer's line implied. They travel in the dispatch and go through
`record`.

## What you never do

Rule on an item. Message any session. Edit a tracked file. Run
`git checkout --` or `git clean`. Dispatch an agent. A tracked-file
modification `check` finds that the plan does not account for goes into the
verdict file's Failures section, **not** into the tree (contract rule 5): only
Kanri decides whether it is stray. The `ListAgents` self-check of `SKILL.md`'s
Resuming is not yours either — the listing shows the resident's own name, which
only the resident can compare with its roster row.

## The procedure

1. Run `check` **once**, from the repository root — the cwd every dispatch
   inherits, and the one `passage-check boundary` runs the plan's checks in:

   ```bash
   node "<tanto>/scripts/boundary.js" check --plan <plan> --report <report> \
     --base <base> --kanri-transcript <kanri-transcript> --tanto <tanto>
   ```

   Add `--measurement <path>` when the batch carried a measurement task whose
   report is a separate file. Read the output **whole**: it is this subagent's
   whole reason to exist. A repo-specific leftover no command knows about —
   a stray process, a temp directory — you note by eye and report under
   Failures.
2. From that output take: the `check:` line's pass or fail; the failing output
   of `boundary` and of `diff`, if any; the report's sections, `Rulings needed`
   and `Verify in the tree` among them, inside `## For Kanri`; Jisso's reading
   from the report's header; Kanri's reading with its ceiling, presence, and
   `ttl=` lines.
3. Run each check the report's `Verify in the tree` names — a test command, a
   file to look at — and note its pass or fail. A failure goes under Failures as
   well as under Verify in the tree.
4. Run `record` **once**, from the same directory:

   ```bash
   node "<tanto>/scripts/boundary.js" record --ledger <ledger> --roster <roster> \
     --batch <X> --tasks <N-M> --state reported --report <report> \
     --verdict "<the check: line>" \
     --kanri "<name [ref]>" --kanri-reading "<Kanri's reading, with its ttl= line>" \
     --jisso "<name [ref]>" --jisso-reading "<Jisso's reading>" \
     --peer-reading "<role> <name [ref]> <reading>" \
     --s-item "<source> | <item>" --event "dispatch: <kind> on <family>"
   ```

   One `--s-item` per item of the report's Shoroku proposal section, one
   `--peer-reading` per line the dispatch carried, one `--event` per top-family
   dispatch line it carried. The state you write is `reported` and nothing
   else: acceptance is a ruling, and the resident's own single `record` call
   carries it. Read what `record` prints — the rows it wrote — into the
   verdict file's Rows written.
5. Render `.tanto/<topic>/batch-<Y>-prompt.md` for the next batch from
   `templates/batch-prompt.md`: the plan's Batches table gives the next
   batch's tasks, and the roster's `queued` rows in handshake order give the
   Jisso. Fill the Previous batch verdict section's first line from the
   `check:` line and the report's For Kanri section, and leave the three slots
   that template names as `<Kanri fills>` — that section's ruling line, its
   deferral line, and the Rulings section's first line. When the batch is the
   plan's last, write no prompt and say so under Next prompt.
6. Write `.tanto/<topic>/batch-<X>-verdict.md`, below.
7. Reply with the one line, below, and nothing else.

## The verdict file

`.tanto/<topic>/batch-<X>-verdict.md`. Its first lines, before the headings,
carry the report's `git hash-object` and the plan's, as a review brief does, so
that a line number quoted under Failures has a fixed referent. Then ten `##`
headings in this order — and an eleventh, `Measurement`, when the batch carried
a measurement task — so that the resident reads it with
`passage-check sections` and never whole.

```text
- Report — <report path>, `git hash-object` <hash> (as read)
- Plan — <plan path>, `git hash-object` <hash> (as read)
```

## Verdict

one line: `pass` or `fail`, then the `check:` line verbatim

## Failures

the failing output of `boundary` and of `diff`, and each `Verify in the tree`
check that failed, or `none`

## Rulings applied

the report's Rulings section, verbatim, or `none`

## Rulings needed

the report's Rulings needed subsection, verbatim, or `none`

## Questions for the human

the report's section, verbatim, or `none`

## Deviations

the report's Deviations from the plan section, verbatim, or `none`

## Verify in the tree

each check the report named, with the pass or fail you got, or `none`

## Ceiling

Kanri's reading, its ceiling line, its presence line, and its `ttl=` line, as
`check` printed them; then Jisso's reading line

## Rows written

what `record` printed, as printed

## Next prompt

the path of the rendered prompt, or `none — final batch`

## Measurement

only when the batch carried a measurement task: that report's Tasks and
Verification sections, verbatim, for the contradiction Kanri reads them for

## The reply

One line, and nothing else:

```text
verdict: <verdict path> — pass|fail — rulings needed: <n>; human questions: <m>; compactions: <c>; ceiling: under|over, present|absent
```

`<n>` and `<m>` count the items under those two headings. `<c>` is the
compactions figure of Kanri's reading, so that handover signal 3 is read off
the line on a clean boundary too. `ceiling:` copies the two verdicts from
Kanri's ceiling and presence lines — `unavailable` and `absent` respectively
when a line is missing, as `SKILL.md`'s reading section already reads them.
````

- [ ] **Step 1: Write the template**

Write `skills/tanto/templates/boundary-brief.md` with exactly the content of
**W4.1**. That block is opened with four backticks so that the
three-backtick fences inside it are part of the content and do not close it;
the file itself carries ordinary three-backtick fences.

- [ ] **Step 2: Check the file against its own contract**

```bash
grep -c '^## ' skills/tanto/templates/boundary-brief.md
grep -n 'Dispatch no agents\|dispatch nothing\|dispatch an agent\|Dispatch an agent' skills/tanto/templates/boundary-brief.md
```

Expected: `grep -c '^## '` prints `15` — the four procedure headings (What you
never do, The procedure, The verdict file, The reply) plus the verdict file's
eleven. The second command prints at least the "What you never do" line.

- [ ] **Step 3: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 4
```

Expected: `task 4: no passages` — this task carries one `W` block and no `P`
or `A` block, so step 2's grep is its content check, as in tasks 1 and 2.
O4.1's one residual hit in `SKILL.md` is cleared by task 10.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/templates/boundary-brief.md
```

Expected: every hook `Passed` or `Skipped`. markdownlint does **not** see this
file — `.markdownlint-cli2.yaml` ignores `skills/tanto/templates/**`, which is
why a template may carry fenced blocks and repeated headings freely — so the
hooks that act on it are `trailing-whitespace`, `end-of-file-fixer`, and
`mixed-line-ending`. Any of the three may fix the file and fail the run;
re-stage and re-run if one does.

- [ ] **Step 5: Commit, then restore the created file's line endings**

```bash
git add skills/tanto/templates/boundary-brief.md
git commit --only skills/tanto/templates/boundary-brief.md -m "$(printf 'tanto: the boundary brief — the procedure the thrown-away context follows\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git checkout -- skills/tanto/templates/boundary-brief.md
git status --porcelain
```

Expected: nothing printed for that path.

### Task 5: `templates/tanto.json` — the fourteenth kind

**Files:**

- Modify: `skills/tanto/templates/tanto.json`

**Interfaces:**

- Consumes: nothing.
- Produces: `subagents["boundary.verify"] = { "model": "sonnet", "effort": "high" }`
  — the family every `boundary.verify` dispatch names (task 8's step 2) and the
  effort the agent definition `tanto-boundary-verify.md` is rendered with by
  `SKILL.md`'s two passes.

**Named-mechanism sites.** The kind count is written six times in `SKILL.md` as
the word "thirteen" six times, and the kind list itself once; both are task
10's. No other file counts the
kinds. `ceiling` and `sessions` are untouched here — the spec's Out of scope
names `ceiling.kanri`, `ceiling.jisso`, `presence_minutes`, and
`share_threshold` explicitly, and decision-1708 forbids a model or effort move
for cost.

**Old values this task contradicts:**

**O5.1** `thirteen` — 6 hits, all in `skills/tanto/SKILL.md`. The set's cardinality is reached by no new term at all, which
is why the needle is the count word itself. Every hit must be gone after task
10; until then they may stay, and this is the only `O` row that covers them.

**Anchor:**

**A5.1** `skills/tanto/templates/tanto.json` — `grep -c boundary.verify skills/tanto/templates/tanto.json` — before: 0, after: 1

**Passages:**

**P5.1** `skills/tanto/templates/tanto.json` — insert after these 1 lines

```json
    "branch.review": { "model": "fable", "effort": "high" },
```

**P5.1 →**

```json
    "boundary.verify": { "model": "sonnet", "effort": "high" },
```

- [ ] **Step 1: Apply the passage**

Apply **P5.1**. `boundary.verify` sits after `branch.review` and before
`brief.write`, which is where the spec places it.

- [ ] **Step 2: Check that the file parses and has fourteen keys**

```bash
node -e '
const fs = require("node:fs");
const config = JSON.parse(fs.readFileSync("skills/tanto/templates/tanto.json", "utf8"));
const keys = Object.keys(config.subagents);
console.log(keys.length + " subagents keys");
console.log(JSON.stringify(config.subagents["boundary.verify"]));
'
```

Expected: `14 subagents keys` and `{"model":"sonnet","effort":"high"}`.

- [ ] **Step 3: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 5
```

Expected: `task 5: verify clean`, and A5.1 reporting its stated `after:`
value. O5.1's six hits in `SKILL.md` are task 10's to clear and are swept by
task 16 step 4; `verify` does not read an `O` block.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/templates/tanto.json
```

Expected: every hook `Passed` or `Skipped`. Biome formats JSON here with
`trailingCommas: "none"`; the inserted line carries a trailing comma because a
line follows it.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/templates/tanto.json -m "$(printf 'tanto: boundary.verify, the fourteenth kind, on sonnet at high effort\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for that path.

### Task 6: `templates/batch-prompt.md` — the path-only form and the three slots

**Files:**

- Modify: `skills/tanto/templates/batch-prompt.md`

**Interfaces:**

- Consumes: the render task 4's step 5 prescribes.
- Produces: a file with **no** `no-role` line of its own, and three slots
  spelled `<Kanri fills>` — the Previous batch verdict's ruling line, that
  section's deferral line, and the Rulings section's first line — which task
  8's step 6 fills.

**Named-mechanism sites.** `<Kanri fills>` is a new slot spelling; the only
other sites that name it are `templates/boundary-brief.md`'s step 5 (task 4) and
`roles/kanri.md`'s new step 6 (task 8). The `no-role` line's own text is not
retired: `SKILL.md`'s Messages section keeps it as the line a **message** longer
than one line carries after its first line (task 12 rewrites only the
batch-prompt clause of that bullet). Until task 12 lands, `SKILL.md` and this
template therefore disagree about the prompt file: from this task's boundary
through batch D's, this plan's own Kanri appends the `no-role` line to the
sent message by hand, as Global Constraints' third bullet prescribes. This task does **not** touch this file's
two `<kanri-address>` slots — the Guard's and the Report section's — which are task 15's, in the
final batch, and until then this file still tells a Jisso to answer an address
that the running Kanri's own file still prescribes.

**Old values this task contradicts:**

**O6.1** `(tanto line — if this window has not run /tanto` — 2 hits: `skills/tanto/templates/batch-prompt.md` and `skills/tanto/SKILL.md`. After this task, 1: `SKILL.md`'s stays, and must, because the line itself is not retired — only this file's copy of it is.

**O6.2** `so the human can paste it if the message did not arrive` — 1 hit, `skills/tanto/SKILL.md`, the Artifacts row for this file. It may stay until task 10 rewrites that row to "sent as `batch: <path>`"; a residual after task 10 is a defect.

**Passages:**

**P6.1** `skills/tanto/templates/batch-prompt.md` — replace exactly these 5 lines

```markdown
# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan

(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)

Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
```

**P6.1 →**

```markdown
# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan

Sent as the one line `batch: <path>` naming this file. The file carries no
`no-role` line of its own, because a file a line points at is not a message.

Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
```

**P6.2** `skills/tanto/templates/batch-prompt.md` — replace exactly these 7 lines

```markdown
<One line per point: what Kanri verified in the tree, what was accepted, what
was returned for rework and why. For the first batch, write "First batch, no
previous verdict.">
<When Kanri's handover stands deferred at this boundary, one further line,
verbatim: "Kanri's handover is deferred since <batch X | the spec stage | the
plan stage> — the ceiling is crossed and the human is absent; this batch runs
under the same Kanri".>
```

**P6.2 →**

```markdown
<The render writes this first line: the boundary's `check:` line, verbatim,
then the report's For Kanri section, one line per point.>
<Kanri fills — the ruling line: what was accepted, what was returned for
rework and why. For the first batch, write "First batch, no previous
verdict.">
<Kanri fills — the deferral line, written only when Kanri's handover stands
deferred at this boundary, verbatim: "Kanri's handover is deferred since
<batch X | the spec stage | the plan stage> — the ceiling is crossed and the
human is absent; this batch runs under the same Kanri".>
```

**P6.3** `skills/tanto/templates/batch-prompt.md` — replace exactly these 3 lines

```markdown
## Rulings to carry into dispatches

- R-<n> — <the ruling, one line> — applies to tasks <N and M>
```

**P6.3 →**

```markdown
## Rulings to carry into dispatches

Three slots in this file read `<Kanri fills>` in the rendered draft and are
filled by Kanri after it rules: the Previous batch verdict's ruling line, that
section's deferral line, and the first line below.

- <Kanri fills> R-<n> — <the ruling, one line> — applies to tasks <N and M>
```

- [ ] **Step 1: Apply the passages**

Apply **P6.1**, **P6.2**, **P6.3**, in that order.

- [ ] **Step 2: Check the file's own claims**

```bash
grep -c 'Kanri fills' skills/tanto/templates/batch-prompt.md
grep -c 'tanto line — if this window has not run /tanto' skills/tanto/templates/batch-prompt.md
grep -c 'kanri-address' skills/tanto/templates/batch-prompt.md
```

Expected: `4` (the sentence naming the three slots, and the three slots), then
`0`, then `2` — the two `<kanri-address>` slots task 15 clears in the final
batch.

- [ ] **Step 3: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 6
```

Expected: `task 6: verify clean`. O6.1's surviving hit in `SKILL.md` — which
stays, and must — and O6.2's, which task 10 clears, are the rows' own claim;
`verify` does not read an `O` block, and task 16 step 4 is the sweep.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/templates/batch-prompt.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/templates/batch-prompt.md -m "$(printf 'tanto: the batch prompt travels as a path, and names its three Kanri slots\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for that path.

### Task 7: `templates/kanri.md` — the ledger's writer, its Measurements entry, its Session events

**Files:**

- Modify: `skills/tanto/templates/kanri.md`

**Interfaces:**

- Consumes: `boundary.js record`'s written forms from task 2 — the Batches row,
  the Measurements entry, the `S-n` row, the Session events line, the Progress
  line.
- Produces: the entry form `batch <X>: kanri context=<n>, jisso context=<n>,
  ttl=<v>`, entries separated by `;`, which task 2's `writeMeasurement` already
  writes and task 8's step 4 points at; and the event pair
  `unanswered: <from> — <line>` / `answered: <from> — <line>`, which task 8's
  step 2, task 12's Messages bullet, and task 13's Start cases all name.

**Named-mechanism sites.** This row is the pair's **form**; the obligation to
write it is stated once, in `SKILL.md`'s address paragraph (task 12, P12.4):
a peer line Kanri receives and does not answer in the same turn becomes an
`unanswered:` events line through `record --event`, paired with `answered:`
when it is answered. The readers are `roles/kanri.md`'s Handover-accepted and
Kept-Kanri cases and its handover file section (task 13) and
`templates/kanri-handover.md`'s Live peers row (task 15). The Measurements entry
form is named in `templates/boundary-brief.md` (task 4) and in `boundary.js`'s
`MEASUREMENT_ROW` (task 2). This task does **not** renumber this file's
`readings of loop step 6` in its Measurements paragraph — that is task 9's, with the rest
of the renumbering, so that one task owns the map.

**Old values this task contradicts:**

**O7.1** `jisso <name> context=<n>` — 1 hit,
`skills/tanto/templates/kanri.md`, the old per-boundary entry form.
It must be gone after this task; the new form spells the batch as `batch <X>:`
and carries `ttl=<v>`.

**O7.2** `none of them writes it. Lives at` — 1 hit,
`skills/tanto/templates/kanri.md`. Zero after this task: the new clause
is inserted exactly at the point this needle spans, which a needle ending at
"writes it" would not have caught, since that phrase survives.

**Passages:**

**P7.1** `skills/tanto/templates/kanri.md` — replace exactly these 3 lines

```markdown
Kept by Kanri. Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, and Hosa read it;
none of them writes it. Lives at `.tanto/<topic>/kanri.md` from the topic's
opening to the plan's close, and never moves.
```

**P7.1 →**

```markdown
Kept by Kanri. Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, and Hosa read it;
none of them writes it. The `boundary.verify` subagent Kanri dispatches at a
boundary writes it as Kanri's hand, through `boundary.js record`, and writes
nothing else. Lives at `.tanto/<topic>/kanri.md` from the topic's opening to
the plan's close, and never moves.
```

**P7.2** `skills/tanto/templates/kanri.md` — replace exactly these 1 lines

```markdown
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's at each boundary with the delta per batch, and each Jisso's at its own boundary | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch letter: kanri context=<n> (+<d>), jisso <name> context=<n>>, one entry per check |
```

**P7.2 →**

```markdown
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's at each boundary with the delta per batch, and each Jisso's at its own boundary | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch <X>: kanri context=<n>, jisso context=<n>, ttl=<v>>, entries separated by `;` — the opening and the landing written by Kanri, every `batch <X>` entry by `boundary.js record`, which replaces its own batch's entry and leaves every other entry alone |
```

**P7.3** `skills/tanto/templates/kanri.md` — replace exactly these 1 lines

```markdown
  an exit proposal form-checked and its
```

**P7.3 →**

```markdown
  a peer line you received and did not answer in the same turn, as
  `unanswered: <from> — <line>`, paired with `answered: <from> — <line>`
  when it is answered, both written through `record --event`; an exit
  proposal form-checked and its
```

- [ ] **Step 1: Apply the passages**

Apply **P7.1**, **P7.2**, **P7.3**, in that order.

- [ ] **Step 2: Check the entry form against what `record` writes**

```bash
grep -c 'batch <X>: kanri context=<n>, jisso context=<n>, ttl=<v>' skills/tanto/templates/kanri.md
grep -c 'unanswered: <from> — <line>' skills/tanto/templates/kanri.md
node --test 'skills/tanto/scripts/boundary.test.js'
```

Expected: `1`, `1`, and `# fail 0` — the Measurements test of task 1 asserts
the same spelling this template now documents, so a drift between the two fails
here.

- [ ] **Step 3: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 7
```

Expected: `task 7: verify clean`. O7.1 and O7.2 are the rows' own claim, not
something `verify` reports; task 16 step 4 sweeps them.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/templates/kanri.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/templates/kanri.md -m "$(printf 'tanto: the ledger names its boundary writer, its ttl entry, and its unanswered pair\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for that path.

### Task 8: `roles/kanri.md` — the batch loop becomes six steps, with one dispatch site

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (the batch loop, and the first batch's
  send in "When the plan lands")

**Interfaces:**

- Consumes: `templates/boundary-brief.md`'s argument list (task 4),
  `boundary.js record`'s CLI (task 2), `templates/batch-prompt.md`'s three
  `<Kanri fills>` slots (task 6), and the kind `boundary.verify` from
  `templates/tanto.json` (task 5).
- Produces: the six-step numbering every later reference is renumbered against
  (task 9 owns that sweep), and the one dispatch site of the new kind. The
  file has no list of kinds to extend: each kind is named where it is
  dispatched — the cold read at the landing, the branch review at the final
  batch, the recommend and the apply at the close — and those sites are
  unchanged, which is the whole of the spec's 3.5.

**The map from eight steps to six**, which task 9 applies everywhere else:

| today | here |
| --- | --- |
| 1, wait | 1, wait |
| 2, verify the tree | 2, dispatch the boundary |
| 3, read the report and rule | 3, rule |
| 4, triage bug reports | gone; its sentence sits inside step 3 |
| 5, one line to the human | the last sentence of step 3 |
| 6, lifecycle and the handover trigger | 4 |
| 7, the commit window | 5 |
| 8, write and send the next prompt | 6, record and send |

**Named-mechanism sites.** The step numbers this task changes are named outside
the loop at `roles/kanri.md`'s release sentence, its handover trigger (twice),
its Residency sentence, its Exit-shoroku proposal line, its declined-handover
resume, the hotfix lane, the Release table, and Readings, and in
`templates/kanri.md`'s Measurements paragraph — all task 9's, in this same
batch, so that the two are reviewed together. The Residency sentence is the
handover trigger's "rewrite your Residency row with it", which this task makes
false at a boundary and task 9's O9.4 and P9.4 correct. Inside the loop, the
step-4 pointer `in slot (b) of step 7` is this task's own (**O8.8**). Lines 577
and 579 name "The final batch"'s own steps 2 and 3, not the loop's, and are
left alone. `<Kanri fills>` is task 6's slot spelling. The `/tanto jisso <name>`
this task carries forward unchanged at the loop's end is one of the five
`<name>` sites task 14 clears in the final batch.

**Old values this task contradicts:**

**O8.1** `Verify the tree before reading the report` — 1 hit,
`roles/kanri.md`. Gone after this task: the resident verifies nothing
at a boundary.

**O8.2** `Read the report **by its sections**` — 1 hit, `roles/kanri.md` line
377. Gone after this task: the resident reads the verdict file, not the report.

**O8.3** `read Jisso's ceiling line from its report's` — 1 hit,
`roles/kanri.md`. Gone after this task.

**O8.4** `rewrite the roster's Residency` — 1 hit, `roles/kanri.md`.
Gone after this task; the Residency rows at a boundary are `record`'s.

**O8.5** `update the ledger's Batches row and its` — 1 hit,
`roles/kanri.md`. Gone after this task.

**O8.6** `Steps 4, 6, and 7 are everything` — 1 hit, `roles/kanri.md`.
Gone after this task; the paragraph reads "Steps 3 to 6".

**O8.8** `in slot (b) of step 7.` — 1 hit, the loop's step 4, which
`bug-report-hold` landed on 2026-09-20 and this task folds into step 3. Zero
after this task; the pointer becomes step 5's, the commit window's new number.

**O8.7** `send the same text to that name` — 1 hit, `roles/kanri.md`,
the loop's send. Gone after this task. Its sibling at, the
first batch's send, spells the same rule as `send the same` + `text to that
name` across a line break and is fixed by **P8.4**; `grep -c "without an idle
subscription, and mark its row"` is 2 before this task and 0 after.

**Passages:**

**P8.1** `skills/tanto/roles/kanri.md` — replace exactly these 60 lines

```markdown
## The batch loop

Per batch, in this order.

1. Wait for Jisso's one-line report message. Do not poll; subscribe to its
   idle — a pure `notify_when_idle`, no message — only when the report is
   overdue, and check the workspace before acting on any notice: a notice
   before the report is usually a false idle, an implementer's turn ending.
   You hold no clock while you wait: a report is overdue when the human says
   the batch has gone quiet, or when your window wakes for anything else and
   the report has not arrived. Say in your boundary line to the human which
   signal you are waiting for, so that the human is that detector.
2. **Verify the tree before reading the report**, with two commands:

   ```bash
   node "$TANTO/scripts/passage-check.js" boundary --plan <plan path>
   node "$TANTO/scripts/passage-check.js" diff --plan <plan path> --base <merge base>
   ```

   `boundary` runs the plan's own verification list in order, `git status`
   clean and the commits' trailers being the first two checks it prints;
   `diff` accounts for the branch's changed lines against the passages the
   plan carries. Read each for its pass or fail lines and the failing output
   only. What no command knows about you check yourself: repo-specific
   leftovers such as stray processes or temp directories, and a spot check of
   the claimed tests. You verify in place — there is no worktree.
3. Read the report **by its sections**, never whole, in the order the batch
   prompt prescribes — For Kanri, Rulings, Questions for the human, Deviations
   from the plan, Shoroku proposal — with one call:

   ```bash
   node "$TANTO/scripts/passage-check.js" sections --file <path> <heading> [<heading>...]
   ```

   For each item under "Rulings needed": a **known cause** you
   rule on yourself, recorded as `R-n` in the ledger with what it costs if
   wrong and which later tasks inherit it; an **unknown cause** opens the
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   record each item of the report's Shoroku proposal section in the ledger's
   `S-n` table with Adopted `pending` and Stage `t2` — that section is this
   Jisso's exit shoroku, and this is its form check — bookkeeping, not a
   ruling: nothing is adopted
   before the close, and the recommendation and the human's check at T2 rule on
   the whole list at once — and update the ledger's Batches row and its
   Progress line.

   A **measurement** report — one whose deliverable is what a tool actually did
   — is read for whether its outcome **contradicts** the brief's prediction. A
   real run usually does, somewhere; a report that confirms every expectation
   deserves a second look rather than a faster approval, because a
   reconstruction is built from the same brief the prediction came from
   (issue-f2ec). When the batch carried a measurement task, name that report's
   Tasks and Verification sections in the same `sections` call and read them
   for the contradiction: named sections, not the file.
4. **Bug reports need nothing from you here.** A report received during
   the batch sits in `.tanto/inbox/`, answered `received:` by its intake, and
   is read at the close ("Bug intake" below); a fix the human orders on one
   is the hotfix lane, in slot (b) of step 7.
5. Report one line to the human. Ask numbered questions only for the four SDD
   stop classes and for a scope or spec change.
```

**P8.1 →**

```markdown
## The batch loop

Per batch, in this order.

1. Wait for Jisso's one-line report message. Do not poll; subscribe to its
   idle — a pure `notify_when_idle`, no message — only when the report is
   overdue, and check the workspace before acting on any notice: a notice
   before the report is usually a false idle, an implementer's turn ending.
   You hold no clock while you wait: a report is overdue when the human says
   the batch has gone quiet, or when your window wakes for anything else and
   the report has not arrived. Say in your boundary line to the human which
   signal you are waiting for, so that the human is that detector.
2. **Dispatch the boundary.** One subagent, kind `boundary.verify`,
   `subagent_type: tanto-boundary-verify`, its `model` from the merged
   `tanto.json` and named on the dispatch as every dispatch names one, with
   this prompt and nothing more:

   ```text
   Run the tanto boundary brief at <skill dir>/templates/boundary-brief.md with:
   topic=<topic> batch=<X> plan=<plan path> report=<report path>
   ledger=<.tanto/<topic>/kanri.md> roster=<.tanto/roster.md> base=<merge base>
   kanri-transcript=<your transcript path, from the roster's first data row>
   tanto=<skill dir>
   peer readings since the last boundary, one per line, or none: <…>
   top-family dispatches since the last boundary, one per line, or none: <…>
   Write .tanto/<topic>/batch-<X>-verdict.md in your own turn. Dispatch no agents.
   Reply with the verdict line only.
   ```

   The last two lines are the two things the subagent cannot see and you hold
   as text. The readings are the ones peers' last lines carried since the
   previous boundary, one `<role> <name> [<ref>] <reading>` per line. The
   dispatches are every one since the previous boundary whose kind
   `tanto.json` puts on the top family of the ladder — `fable` today, and the
   merged config decides, not the family a session happens to run on, so an
   `opus` `shoroku` dispatch does not count while a `fable` `plan.coldread`
   does: your own `plan.coldread` and `branch.review`, and the ones a peer's
   line implies — `review-ready:` is one `brief.write`, a plan-review path is
   one `plan.review`, a spec-review path is one `spec.review` if the config
   puts it there — each written as the line `dispatch: <kind> on <family>`,
   which `record` appends and which you count by kind to fill the one-shots
   row at the close.

   Then wait for one line. You do not run `passage-check`, `reading.js`, or
   `sections` at this boundary; you do not open the report; you edit no table
   by hand. What the brief cannot judge it reports: a tracked-file
   modification the plan does not account for reaches you under the verdict
   file's Failures, never through a `git checkout --` of the subagent's, and
   only you decide whether it is stray.
3. **Rule.** When `rulings needed` or `human questions` is above zero, the
   verdict is `fail`, or `ceiling:` says `over, present`, read the verdict
   file's sections that apply — Rulings needed, Questions for the human,
   Deviations, Failures, Verify in the tree, Ceiling, Measurement — with one
   call:

   ```bash
   node "$TANTO/scripts/passage-check.js" sections --file <path> <heading> [<heading>...]
   ```

   For each item under "Rulings needed": a **known cause** you
   rule on yourself, recorded as `R-n` in the ledger with what it costs if
   wrong and which later tasks inherit it; an **unknown cause** opens the
   Kaiseki branch below; a **scope or spec change** goes to the human; a
   `fail` is a rework, or an acceptance you rule over it. The report's
   Shoroku proposal section is already `S-n` rows, Adopted `pending` and
   Stage `t2`, written by the brief — that section is this Jisso's exit
   shoroku, and the brief's pass over it is its form check: bookkeeping, not
   a ruling, since nothing is adopted before the close, where the
   recommendation and the human's check at T2 rule on the whole list at once.

   A **measurement** report — one whose deliverable is what a tool actually
   did — reaches you as the verdict file's Measurement section, that report's
   Tasks and Verification sections verbatim, and is read for whether its
   outcome **contradicts** the brief's prediction. A real run usually does,
   somewhere; a report that confirms every expectation deserves a second look
   rather than a faster approval, because a reconstruction is built from the
   same brief the prediction came from (issue-f2ec).

   Bug reports need nothing from you here: a report received during the batch
   sits in `.tanto/inbox/`, answered `received:` by its intake, and is read at
   the close ("Bug intake" below); a fix the human orders on one is the hotfix
   lane, in slot (b) of step 5. Then report one line to the human, and ask
   numbered questions only for the four SDD stop classes and for a scope or
   spec change.
```

**P8.2** `skills/tanto/roles/kanri.md` — replace exactly these 42 lines

```markdown
6. **Check the lifecycle tables and the handover trigger.** Take your own
   reading with `--role kanri`, read Jisso's ceiling line from its report's
   header beside the Transcript line, and rewrite the roster's Residency
   rows — yours from your own reading, Jisso's from its report's, and every
   other live peer's from the reading its last line carried, as Readings
   says — each `context=` figure into that row's Context column. A verdict
   of `over` on your own ceiling line is handover signal 4, gated on
   `--presence`, run on your own transcript at this check, and an `absent`
   verdict defers it rather than firing it. Jisso's verdict is recorded and
   acts on nothing: the rotation retires every Jisso at its boundary, and
   the figure is what the archive keeps. Write the Measurements per-boundary
   entry from the two readings, and a Measurements deferrals entry for a
   handover deferred here.
   Write a Session events line `dispatch: <kind> on <family>` for every
   dispatch since the last boundary whose kind `tanto.json` puts on the top
   family of the ladder — `fable` today, and the merged config decides, not
   the family a session happens to run on, so an `opus` `shoroku` dispatch
   does not count while a `fable` `plan.coldread` does: your own
   `plan.coldread` and `branch.review`, and the ones a peer's line implies —
   `review-ready:` is one `brief.write`, a plan-review path is one
   `plan.review`, a spec-review path is one `spec.review` if the config puts
   it there — and fill the one-shots row at the close by counting those lines
   by kind.
   If a create request is due, make it, unless a
   handover trigger has fired and is not deferred, in which case the
   successor makes it from the handover's Next step. Then the exits that
   fall at this boundary, per "Exit shoroku": the retiring Jisso's proposal
   is its report's Shoroku proposal section, recorded at step 3, so send it
   `release:` now and mark its row `cleared` — a batch returned for rework
   is not accepted, and its Jisso stays live for the rework prompt, and the
   Jisso whose boundary is the plan's last waits — the last implementation
   batch's while the review is pending, and the fix wave's — see
   "The final batch", steps 2 and 3; if a
   release or a replace of another live, coherent session is due, or a
   handover trigger has fired and is not deferred, send the `exit:` lines to
   the sessions whose proposal is not already named — a Sekkei or Keikaku at
   its own final boundary named it in its report line and is waiting for
   nothing — check each proposal's form, record its items as `pending`
   rows, and send `release:` as soon as the form check passes; when the
   trigger that fired is your own handover, write your own proposal here too,
   as "Handover" step 1 says, so that it is done when that list is reached.
   Nothing is recommended or applied before the close.
```

**P8.2 →**

```markdown
4. **Check the lifecycle tables and the handover trigger.** Both are read off
   the verdict line, not measured again here. `ceiling: over, present` is
   handover signal 4 and runs the handover at this boundary; `over, absent`
   defers it, with the three writings the Handover section prescribes and a
   Measurements deferrals entry you write yourself; a `compactions:` figure
   above the count you have noticed is signal 3. Jisso's verdict is recorded
   and acts on nothing: the rotation retires every Jisso at its boundary, and
   the figure is what the archive keeps. The readings themselves, the
   Residency rows, the Measurements per-boundary entry, and the `dispatch:`
   events lines are the brief's, written by `record` from the dispatch you
   sent at step 2 — at a boundary you take no reading and rewrite no row.
   If a create request is due, make it, unless a
   handover trigger has fired and is not deferred, in which case the
   successor makes it from the handover's Next step. Then the exits that
   fall at this boundary, per "Exit shoroku": the retiring Jisso's proposal
   is its report's Shoroku proposal section, recorded by the brief at step 2,
   so send it `release:` now and let step 6's `record` call mark its row
   `cleared` — a batch returned for rework
   is not accepted, and its Jisso stays live for the rework prompt, and the
   Jisso whose boundary is the plan's last waits — the last implementation
   batch's while the review is pending, and the fix wave's — see
   "The final batch", steps 2 and 3; if a
   release or a replace of another live, coherent session is due, or a
   handover trigger has fired and is not deferred, send the `exit:` lines to
   the sessions whose proposal is not already named — a Sekkei or Keikaku at
   its own final boundary named it in its report line and is waiting for
   nothing — check each proposal's form, name its items as `--s-item`
   arguments of step 6's `record` call, and send `release:` as soon as the
   form check passes; when the trigger that fired is your own handover, write
   your own proposal here too, as "Handover" step 1 says, so that it is done
   when that list is reached. Nothing is recommended or applied before the
   close.
```

**P8.3** `skills/tanto/roles/kanri.md` — replace exactly these 50 lines

```markdown
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) The apply subagent's slot, which only the close fills: at
   the final batch's boundary, once `t2-direction.md` is written, dispatch
   `subagent_type: tanto-shoroku-apply` with the recommendation, the
   direction, and the commit subject, and verify its commit as you verify any
   — `git status` clean, the diff's paths those the direction names, lint on
   them (or on the whole repository where the lint script takes no path
   arguments). Jisso has already been released; it waits for nothing. At every
   other boundary this slot is empty. (b) Your
   own edits — the hotfix and the issues from step 4 — each committed by you
   in its turn, or handed to a
   live Hosa as `chore: <what> — <paths> — slot: now | at the next boundary`,
   which Hosa commits here and answers `committed <subject> — <reading>`; the
   ruling and the commit subject stay yours, and you verify the diff.
   A `slot-needed: <what> — <paths>` from Hosa is answered the moment it
   arrives: `slot: now — commit and report` when no batch is in flight and the
   paths are not the in-flight plan's, `slot: at the next boundary` otherwise,
   the slot being this step at that boundary; Hosa's
   `committed <subject> — <reading>` is verified here like a chore's.
   (c) Tell Sekkei or Keikaku
   the boundary is verified, naming any Kaiseki create or release since the
   last boundary, then wait for the one-line reply —
   `committed <subject> — <reading>` or `nothing to commit — <reading>`;
   subscribe to its idle only
   when the reply is overdue, and record in the ledger's Session events if a
   notice came without a reply; skip (c) when neither is live. If a
   handover is due, the window ends, after the wait Timing prescribes, with
   steps 2 to 4 of "The handover, in a plan and between plans" — your exit
   proposal was step 6's, and its items are `pending` rows in this ledger —
   and the loop stops here; the next prompt is the successor's.
8. Write the next batch prompt from `templates/batch-prompt.md`, addressed
   to the next `queued` Jisso in handshake order — the prompt names it, says
   which of the plan's Jissos it is, and carries the resume line — with the
   rulings the next tasks inherit and, on its Models line, the four kinds
   Jisso dispatches — `task.implement`, `task.review-spec`,
   `task.review-quality`, and `task.escalate` — each with the family
   `tanto.json` gives it and the definition name that family is dispatched
   with, so that the prompt still says them after a compaction. Save it as
   `.tanto/<topic>/batch-<X>-prompt.md`, send the same text to that name,
   without an idle subscription, and mark its row `live`. A batch returned
   for rework goes to the Jisso that ran it, as a prompt for the same batch.
   When the queue is empty, the Create table's Jisso row's request goes out
   instead — one window, queued by the same `/tanto jisso <name>` — and the
   prompt waits for that handshake; the released windows are the ones to
   offer.

Steps 4, 6, and 7 are everything that needs Jisso idle or the index free, and
they all precede the prompt that wakes Jisso. The pre-commit hooks stash every
unstaged change in the tree while they run, so nobody edits a tracked file
outside its own slot of the window, you included.
```

**P8.3 →**

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
   own edits — the hotfix and the issues from step 3 — each committed by you
   in its turn, or handed to a
   live Hosa as `chore: <what> — <paths> — slot: now | at the next boundary`,
   which Hosa commits here and answers `committed <subject> — <reading>`; the
   ruling and the commit subject stay yours, and you verify the diff.
   A `slot-needed: <what> — <paths>` from Hosa is answered the moment it
   arrives: `slot: now — commit and report` when no batch is in flight and the
   paths are not the in-flight plan's, `slot: at the next boundary` otherwise,
   the slot being this step at that boundary; Hosa's
   `committed <subject> — <reading>` is verified here like a chore's.
   (c) Tell Sekkei or Keikaku
   the boundary is verified, naming any Kaiseki create or release since the
   last boundary, then wait for the one-line reply —
   `committed <subject> — <reading>` or `nothing to commit — <reading>`;
   subscribe to its idle only
   when the reply is overdue, and record in the ledger's Session events if a
   notice came without a reply; skip (c) when neither is live. If a
   handover is due, the window ends, after the wait Timing prescribes, with
   steps 2 to 4 of "The handover, in a plan and between plans" — your exit
   proposal was step 4's, and its items are `pending` rows you write here
   with one `record --s-item` call of your own, because the loop stops before
   step 6 — and the loop stops here; the next prompt is the successor's.
6. **Record and send.** Fill the rendered prompt's three `<Kanri fills>`
   slots — the Previous batch verdict's ruling line and its deferral line,
   and the Rulings section's first line — and save it. The render is the
   brief's, from `templates/batch-prompt.md`, addressed to the next `queued`
   Jisso in handshake order, and it already carries the resume line and, on
   its Models line, the four kinds Jisso dispatches —
   `task.implement`, `task.review-spec`, `task.review-quality`, and
   `task.escalate` — each with the family `tanto.json` gives it and the
   definition name that family is dispatched with, so that the prompt still
   says them after a compaction. Run the `ListAgents` self-check of
   `SKILL.md`'s Resuming, once: the listing shows your own name, which only
   you can compare with your roster row, so it is not the brief's. Then send
   that Jisso the one line `batch: .tanto/<topic>/batch-<X>-prompt.md` with
   the `no-role` line after it, without an idle subscription. Then the one
   `record` call of this boundary:

   ```bash
   node "$TANTO/scripts/boundary.js" record --ledger <.tanto/<topic>/kanri.md> \
     --roster <.tanto/roster.md> --batch <X> --state accepted|rework \
     --verdict "<one line>" --progress "<one line>" \
     --status "<name [ref]> cleared" --status "<name [ref]> live" \
     --s-item "<source> | <item>"
   ```

   It carries the Batches row's state and verdict your ruling gives, the
   Progress line, the Status changes this boundary decided — the retiring
   Jisso `cleared`, the Jisso you have just sent `live`, a seat released at
   step 4 `cleared` — and one `--s-item` per item of an exit proposal step 4
   form-checked. That call is the whole of your table writing: at a boundary
   no table is edited by hand. A batch returned for rework is a prompt you
   write yourself from the same template, for the same Jisso, and send the
   same way.
   When the queue is empty, the Create table's Jisso row's request goes out
   instead — one window, queued by the same `/tanto jisso <name>` — and the
   prompt waits for that handshake; the released windows are the ones to
   offer.

Steps 3 to 6 are everything that needs Jisso idle or the index free, and
everything in them but step 6's `record` call precedes the prompt that wakes
Jisso; `record` writes untracked files under `.tanto/`, which the index does
not see. The pre-commit hooks stash every
unstaged change in the tree while they run, so nobody edits a tracked file
outside its own slot of the window, you included.
```

**P8.4** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   resume — save it as `.tanto/<topic>/batch-A-prompt.md`, send the same
   text to that name, without an idle subscription, and mark its row
   `live`. The later handshakes arrive while batch A runs and are queued
```

**P8.4 →**

```markdown
   resume — save it as `.tanto/<topic>/batch-A-prompt.md`, send that name
   the one line `batch: .tanto/<topic>/batch-A-prompt.md` with the `no-role`
   line after it, without an idle subscription, and mark its row
   `live`. The later handshakes arrive while batch A runs and are queued
```

- [ ] **Step 1: Apply the loop's three passages**

Apply **P8.1**, then **P8.2**, then **P8.3**. Each replaces a contiguous span
of the existing loop and they are in file order, so applying them in this order
keeps every later old block matching.

- [ ] **Step 2: Apply the first batch's send**

Apply **P8.4**. It is in "When the plan lands", step 5, above the loop — the
first batch prompt is sent the same way every later one is, so that a Jisso
never sees two different forms.

- [ ] **Step 3: Check the loop's own shape**

```bash
sed -n '/^## The batch loop/,/^## The final batch/p' skills/tanto/roles/kanri.md |
  grep -n '^[0-9]\. '
grep -c 'tanto-boundary-verify' skills/tanto/roles/kanri.md
grep -c 'without an idle subscription, and mark its row' skills/tanto/roles/kanri.md
```

Expected: exactly six lines, reading `1.` to `6.` in order, with no `7.` or
`8.` among them — the `sed` scopes the grep to the loop's own section, because
the Start and handshake sections above it carry numbered lists of their own and
an unscoped grep never reaches the loop. Then `1` for the dispatch site, and
`0` for the old send.

- [ ] **Step 4: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 8
```

Expected: `task 8: verify clean`. O8.1 to O8.8 are the rows' own claim —
`verify` reads `P` and `A` blocks only — and step 3's greps are what checks
them here.

- [ ] **Step 5: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: every hook `Passed` or `Skipped`. The fenced blocks inside the
numbered items are indented three spaces, as the ones they replace were, which
is what markdownlint's list-indent rules expect here.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "$(printf 'tanto: the batch loop becomes six steps and one dispatch\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for that path.

### Task 9: the renumbering sweep — every `step n` reference outside the loop

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (nine sites outside the loop)
- Modify: `skills/tanto/templates/kanri.md` (one site)

**Interfaces:**

- Consumes: task 8's map from eight steps to six, restated here so that this
  task's reviewer needs nothing else:
  `1 → 1; 2 and 3 → 2 and 3; 4 → gone, its sentence inside step 3; 5 → the last
  sentence of step 3; 6 → 4; 7 → 5; 8 → 6`.
- Produces: a file in which `grep -n 'loop step [78]'` is empty and every
  remaining `loop step n` reads against that map.

**Named-mechanism sites, and the two that are left alone.**
`roles/kanri.md` says "takes step 3's `T2:` line" twice, both inside **"The
final batch"**: those are that section's own steps 2 and 3, not the loop's, and
they stay exactly as they are. The hotfix lane's "in slot (b) of step 7's commit
window" **is** the loop's and becomes step 5's — that is P9.7, and it is the
only `step 7` left in the file once task 8 has landed. Two sites change
meaning as well as number, and both are passages below: Readings' "copy each
into that role's Residency row" becomes the `--peer-reading` of the dispatch,
and the trigger's "rewrite your Residency row with it" becomes a non-boundary
act. `templates/kanri.md`'s Measurements paragraph is the ninth site and lands
in this same task, so that the ledger template and the role file are reviewed
against one map.

**Old values this task contradicts:**

The renumbering's needles are **one per site, not one per number**: the new
text uses `loop step 4`, `loop step 5`, and `loop step 6` itself, so a needle on
a bare number could never read zero. Each needle below spans the phrase around
the number it replaces, and each is one hit that becomes zero.

**O9.1** `loop step 6's release` — 1 hit, `roles/kanri.md`. Zero after
this task.

**O9.2** `at loop step 6 — and` — 1 hit. Zero after this task.

**O9.3** `— loop step 6 at a boundary` — 1 hit. Zero after this task.

**O9.4** `rewrite your Residency row with it: a compactions` — 1 hit.
Zero after this task. The needle spans the point the new clause is inserted at,
which a needle ending at "with it" would not.

**O9.5** `loop step 6's proposal` — 1 hit. Zero after this task.

**O9.6** `at loop step 8 at a batch boundary` — 1 hit. Zero after this
task.

**O9.7** `7's commit window, or between plans` — 1 hit, the hotfix lane. Zero
after this task. This is the only `step 7` left in the file once task 8 has
landed: `bug-report-hold` replaced the whole `## Bug intake` section on
2026-09-20, which took with it the two sites an earlier draft of this task
renumbered here (`at loop step 7, or for a gap` and
`ruled at loop step 4 and the edit`, both now zero hits on `main`), and left
this one in their place.

**O9.8** `accepted at loop step 6` — 1 hit. Zero after this task.

**O9.9** `copy each into that role's Residency row at` — 1 hit.
Zero after this task.

**O9.10** `readings of loop step 6` — 1 hit, `templates/kanri.md`.
Zero after this task.

**Passages:**

**P9.1** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
   to loop step 6's release at the boundary, not one: the Jisso that ran
```

**P9.1 →**

```markdown
   to loop step 4's release at the boundary, not one: the Jisso that ran
```

**P9.2** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
batches are in flight — at loop step 6 — and, between plans, at the start of
```

**P9.2 →**

```markdown
batches are in flight — at loop step 4 — and, between plans, at the start of
```

**P9.3** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
4. **The ceiling crossed.** At every check — loop step 6 at a boundary, and
```

**P9.3 →**

```markdown
4. **The ceiling crossed.** At every check — loop step 4 at a boundary, and
```

**P9.4** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
reading") and rewrite your Residency row with it: a compactions figure of `1`
```

**P9.4 →**

```markdown
reading") and rewrite your Residency row with it, outside a boundary — at a
boundary that row is `record`'s, written from the reading the dispatch
carried. A compactions figure of `1`
```

**P9.5** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
   topic's. At a batch boundary this is loop step 6's proposal and its rows,
```

**P9.5 →**

```markdown
   topic's. At a batch boundary this is loop step 4's proposal, its rows
   written by the `record` call of loop step 6 or, when the loop stops at
   step 5 for the handover, by the `record --s-item` call made there,
```

**P9.6** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
counter stays), and resume — at loop step 8 at a batch boundary, at the turn's own work
```

**P9.6 →**

```markdown
counter stays), and resume — at loop step 6 at a batch boundary, at the turn's own work
```

**P9.7** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
and only while no batch is in flight — between batches, in slot (b) of step
7's commit window, or between plans — and never on a file the in-flight plan
```

**P9.7 →**

```markdown
and only while no batch is in flight — between batches, in slot (b) of step
5's commit window, or between plans — and never on a file the in-flight plan
```

**P9.8** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
| a batch is accepted at loop step 6 — the Jisso whose boundary is the plan's last excepted: the last implementation batch's while the review is pending, and the fix wave's — see "The final batch", steps 2 and 3 | its Jisso is done; `release:` to it, its row `cleared`, the released line to the human; the next prompt goes to the next queued Jisso |
```

**P9.8 →**

```markdown
| a batch is accepted at loop step 4 — the Jisso whose boundary is the plan's last excepted: the last implementation batch's while the review is pending, and the fix wave's — see "The final batch", steps 2 and 3 | its Jisso is done; `release:` to it, its row `cleared` by loop step 6's `record` call, the released line to the human; the next prompt goes to the next queued Jisso |
```

**P9.9** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
and Kaiseki's reports carry it; copy each into that role's Residency row at
loop step 6, with the boundary it was read at and the `context=` figure in the
Context column. A reading you doubt — a
```

**P9.9 →**

```markdown
and Kaiseki's reports carry it; pass each as a `--peer-reading` of the
boundary's dispatch and `record` writes that role's Residency row, with the
boundary it was read at and the `context=` figure in the Context column;
outside a boundary you write the row yourself. A reading you doubt — a
```

**P9.10** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```markdown
(Start step 5), at the plan's landing, and at every boundary from the two
readings of loop step 6; the sixth at any deferred handover, in whichever
```

**P9.10 →**

```markdown
(Start step 5), at the plan's landing, and at every boundary by
`boundary.js record`, from the two readings the boundary's dispatch carried;
the sixth at any deferred handover, in whichever
```

- [ ] **Step 1: Apply the passages in file order**

Apply **P9.1** through **P9.8** in that order — they are in `roles/kanri.md`'s
own line order — and then **P9.9** in `templates/kanri.md`.

- [ ] **Step 2: Read every remaining `loop step n` against the map**

```bash
grep -n 'loop step [78]' skills/tanto/roles/kanri.md
grep -rn 'loop step' skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md
grep -n "step 3's \`T2:\` line" skills/tanto/roles/kanri.md
```

Expected: the first prints nothing. The second prints **seven** lines carrying
**eight** references, because P9.8's Release-table row names two of them on
one line: `loop step 4` five times (P9.1, P9.2, P9.3, P9.5's first clause, and
P9.8's `accepted at`) and `loop step 6` three times (P9.5's second clause,
P9.6, and P9.8's `cleared by`). No `loop step 3` and no `loop step 5` survive:
the hotfix lane's sentence says "in slot (b) of step 5's commit window", which
carries no `loop step`, and `templates/kanri.md`'s own reference is what P9.9
removes. Each is read against the map in the task's table above. The third
command prints two lines, both inside "The final batch" — that section's own
step 3, deliberately unchanged.

- [ ] **Step 3: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 9
```

Expected: `task 9: verify clean`. O9.1 to O9.9 are the rows' own claim;
step 2's greps are what checks them here, and task 16 step 4 is the sweep.

- [ ] **Step 4: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md -m "$(printf 'tanto: renumber every reference to the batch loop against the six-step map\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for those paths.

### Task 10: `SKILL.md` — the fourteenth kind, the Artifacts, the reading, rule 3

**Files:**

- Modify: `skills/tanto/SKILL.md`

**Interfaces:**

- Consumes: `templates/tanto.json`'s new key (task 5),
  `templates/boundary-brief.md` (task 4), `scripts/boundary.js` (task 2),
  `reading.js`'s third line (task 3).
- Produces: the counts every other file agrees with — fourteen kinds, fifteen
  templates, three executables — and the definition name
  `tanto-boundary-verify`, which `SKILL.md`'s two agent-definition passes now
  render and remove like any other.

**Named-mechanism sites.** The kind count is written six times as "thirteen"
six times, and the list itself once; all seven are passages here. The template
count is in the Artifacts section's templates sentence and in
`README.md`'s `templates/` bullet (task 11). The executables count is in the
same section and in `README.md`'s Layout and Prerequisites (task 11). The
`ttl=` line is in "The transcript reading" here, in `README.md`'s
`reading.js` bullet (task 11), in
`templates/kanri.md`'s Measurements row (task 7), and in
`templates/boundary-brief.md`'s Ceiling section (task 4). **Rule 6 is
unchanged**: "Every subagent dispatch names a `model` from `tanto.json`" already
binds `boundary.verify`, and nothing in this task touches it. This task does
**not** touch the address bullet or the paragraph after the bullets, the
Resuming bullet, the `no-role` bullet's re-send and batch-prompt clauses, or
the Invocation line — those are task 12's, in the final batch.

**Old values this task contradicts:**

**O10.1** `thirteen` — 6 hits, all `skills/tanto/SKILL.md`. Zero after this
task. This is O5.1's entity, cleared here.

**O10.2** `Fourteen of them` — 1 hit. Zero after this task. This is
O4.1's entity, cleared here.

**O10.3** `two executables` — 1 hit. Zero after this task. This is
O2.1's entity, cleared here.

**O10.4** `That prints two lines always` — 1 hit. Zero after this
task. This is O3.1's entity, cleared here.

**O10.5** `so the human can paste it if the message did not arrive` — 1 hit. Zero after this task. This is O6.2's entity, cleared here.

**O10.6** `boundary it rules on` — 1 hit, the executables paragraph's
runner list. Zero after this task: under the new loop Kanri runs
`passage-check` at no boundary.

**Passages:**

**P10.1** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```markdown
  agent definition below. The thirteen kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `brief.write`, `shoroku.recommend`, `shoroku.apply`, and `default`.
```

**P10.1 →**

```markdown
  agent definition below. The fourteen kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `boundary.verify`, `brief.write`, `shoroku.recommend`, `shoroku.apply`, and
  `default`.
```

**P10.2** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
a whole plan or session — Kanri, Sekkei, Keikaku, Jisso, Hosa — run on the
cheaper families, with Sekkei's effort alone raised to `max`. Kikaku, which
```

**P10.2 →**

```markdown
a whole plan or session — Kanri, Sekkei, Keikaku, Jisso, Hosa — run on the
cheaper families, with Sekkei's effort alone raised to `max`. The
resident-side `boundary.verify`, dispatched once per batch boundary in
Kanri's place, runs there too, at `high`. Kikaku, which
```

**P10.3** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
**User scope.** Write for each of the thirteen kinds the file
```

**P10.3 →**

```markdown
**User scope.** Write for each of the fourteen kinds the file
```

**P10.4** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
**Project scope.** Then compute, for each of the thirteen kinds, the three-layer
```

**P10.4 →**

```markdown
**Project scope.** Then compute, for each of the fourteen kinds, the three-layer
```

**P10.5** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
file does, and only those thirteen names and the retired `tanto-shoroku.md`
```

**P10.5 →**

```markdown
file does, and only those fourteen names and the retired `tanto-shoroku.md`
```

**P10.6** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
the thirteen names in it, and among them the ones whose description carries the
```

**P10.6 →**

```markdown
the fourteen names in it, and among them the ones whose description carries the
```

**P10.7** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
with `<s>` the number of the thirteen names whose description in this session's
```

**P10.7 →**

```markdown
with `<s>` the number of the fourteen names whose description in this session's
```

**P10.8** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
| `.tanto/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted |
```

**P10.8 →**

```markdown
| `.tanto/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted. In flight, Live peers, and Not reconstructed in full; the rest pointers |
```

**P10.9** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
| `.tanto/<topic>/kanri.md` | Kanri | Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, Hosa | the conductor ledger; it never moves |
```

**P10.9 →**

```markdown
| `.tanto/<topic>/kanri.md` | Kanri, or the `boundary.verify` subagent it dispatches, through `boundary.js record` | Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, Hosa | the conductor ledger; it never moves |
```

**P10.10** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
| `.tanto/<topic>/batch-<X>-prompt.md` | Kanri | the Jisso it names, human | the same text as the `SendMessage`, so the human can paste it if the message did not arrive |
```

**P10.10 →**

```markdown
| `.tanto/<topic>/batch-<X>-prompt.md` | the `boundary.verify` subagent, from `templates/batch-prompt.md`; Kanri for its three `<Kanri fills>` slots and for a rework prompt | the Jisso it names, human | the prompt; sent as the one line `batch: <path>`, which the human pastes if the message did not arrive |
| `.tanto/<topic>/batch-<X>-verdict.md` | the `boundary.verify` kind Kanri dispatches | Kanri, by `sections` | the boundary's verdict: ten fixed sections, and an eleventh, `Measurement`, when the batch carried a measurement task |
```

**P10.11** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```markdown
Templates are copied and filled, never restated in prose. Fourteen of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/review-brief.md`, `templates/shoroku-brief.md`,
`templates/tanto.json`, `templates/kikaku-decision.md`, and
`templates/agent.md`.
```

**P10.11 →**

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

**P10.12** `skills/tanto/SKILL.md` — replace exactly these 14 lines

```markdown
The skill also ships two executables. `scripts/passage-check.js` is the
instrument a plan that carries passages checks itself with, run by Keikaku in
place of an agent dry run, by Jisso at every batch boundary, by Kanri at every
boundary it rules on, and by the whole-branch reviewer; its seven subcommands
are `lint`, `replay`, `diff`, `verify`, `sections`, `frame`, and `boundary`,
and `roles/keikaku.md`, `roles/jisso.md` and `roles/kanri.md` name them.
`scripts/reading.js` is the instrument every role measures itself with, run at
every boundary and every exit; its two forms are the reading of one transcript
— with `--role kanri|jisso`, `--presence` and `--backstop` each adding a line,
and `--now`, `--config`, `--project-config` and `--settings` fixing what the
tests and a verifying Kanri need fixed — and `--share` over several
transcripts, which Kanri runs at
the plan close. Both are Node with no dependencies, and both have their tests
beside them, run by `node --test`. Their paths are written skill-relative,
```

**P10.12 →**

```markdown
The skill also ships three executables. `scripts/passage-check.js` is the
instrument a plan that carries passages checks itself with, run by Keikaku in
place of an agent dry run, by Jisso at every batch boundary, by the
`boundary.verify` subagent at every boundary in Kanri's place, and by the
whole-branch reviewer; its seven subcommands
are `lint`, `replay`, `diff`, `verify`, `sections`, `frame`, and `boundary`,
and `roles/keikaku.md`, `roles/jisso.md` and `roles/kanri.md` name them.
`scripts/reading.js` is the instrument every role measures itself with, run at
every boundary and every exit; it prints three lines always, and its two forms
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
```

**P10.13** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
That prints two lines always: the reading, then the effort. Three more are
```

**P10.13 →**

```markdown
That prints three lines always: the reading, the effort, then
`ttl=5m|1h|unknown`, which says which cache regime the session is in: among
the wake-ups whose gap since the previous record is between 5 and 60 minutes,
the most recent one decides, cold reading `5m` and warm `1h`, and no such
wake-up yet reading `unknown`. That line travels nowhere by itself — the
reading appended to a boundary or an exit line is the first line only — and
reaches a reader through the boundary's verdict file and the ledger's
Measurements per-boundary entry. Three more are
```

**P10.14** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
3. State in files, not in memory: the roster and the ledgers. Memory holds at
   most a pointer to them. A role's authority is this file, its role file,
   Kanri's lines, and the batch prompts; a project memory rule that would add
   a dispatch or a document is put to Kanri as one line before it is acted
   on, since the same memory is loaded by every session in the repository.
```

**P10.14 →**

```markdown
3. State in files, not in memory: the roster and the ledgers. Memory holds at
   most a pointer to them. A subagent Kanri dispatches to a boundary writes
   the ledger and the roster as Kanri's hand, through `boundary.js record`,
   and nothing else. A role's authority is this file, its role file,
   Kanri's lines, and the batch prompts; a project memory rule that would add
   a dispatch or a document is put to Kanri as one line before it is acted
   on, since the same memory is loaded by every session in the repository.
```

- [ ] **Step 1: Apply the passages in file order**

Apply **P10.1**, **P10.2**, **P10.3**, **P10.4**, **P10.5**, **P10.6**,
**P10.7**, **P10.13**, **P10.8**, **P10.9**, **P10.10**, **P10.11**,
**P10.12**, **P10.14**. That is the file's own line order: P10.13's site (line
435) sits between P10.7's (258) and P10.8's (908).

- [ ] **Step 2: Check the counts against the files they count**

```bash
grep -c thirteen skills/tanto/SKILL.md
grep -c 'fourteen' skills/tanto/SKILL.md
grep -c 'Fifteen of them' skills/tanto/SKILL.md
grep -c 'three executables' skills/tanto/SKILL.md
ls -1 skills/tanto/templates | wc -l
node -e 'const c=require("./skills/tanto/templates/tanto.json");console.log(Object.keys(c.subagents).length)'
ls -1 skills/tanto/scripts/*.js | grep -vc test
```

Expected: `0`, `6`, `1`, `1`, then `15` templates, `14` subagents keys, and `3`
non-test scripts. The three counts in prose and the three on disk agree.

- [ ] **Step 3: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 10
```

Expected: `task 10: verify clean`. O10.1 to O10.6 are the rows' own claim;
step 2's counts are what checks them here.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "$(printf 'tanto: the contract counts fourteen kinds, fifteen templates, three executables\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for that path.

### Task 11: `README.md` — Layout, Prerequisites, "What it does", and the design list

**Files:**

- Modify: `skills/tanto/README.md`

**Interfaces:**

- Consumes: task 10's counts, which this task must not contradict — after both,
  `SKILL.md` and the README agree on fifteen templates and three executables
  (the spec's section 7 ends on exactly that).
- Produces: nothing other files read.

**Named-mechanism sites.** This is the README half of task 10's three counts.
This task does **not** touch the Usage section's `<kanri>` lines at 99 to 116 —
those are task 14's, in the final batch, because the human pastes what the
running Kanri's file says until the merge. `AGENTS.md` asks for a README drift
review after a `SKILL.md` edit; this task is that review's output for task 10,
and task 14 is its output for task 12.

**Old values this task contradicts:**

**O11.1** `Both scripts are Node` — 1 hit, `skills/tanto/README.md`.
Zero after this task. This is O2.2's entity, cleared here.

**O11.2** `measures itself with: the` — 1 hit. Zero after this task.
This is O3.2's entity, cleared here; the phrase "five-figure reading of one
transcript" itself stays in the new bullet, which is why neither row uses it as
a needle.

**O11.3** `Every role runs the second at every boundary and every` — 1 hit, line
60, the Prerequisites bullet that names two scripts. Zero after this task: the
new bullet names three and breaks that line at a different word.

**Passages:**

**P11.1** `skills/tanto/README.md` — replace exactly these 5 lines

```markdown
- Holds **Kanri** under a context ceiling derived from that last figure — its
  own measured baseline plus a chosen number of batches of measured
  consumption — and hands the role over at the next boundary once it is
  crossed, but only while the human is there to start the successor;
  otherwise the crossing is recorded as deferred and the run continues to the
```

**P11.1 →**

```markdown
- Runs each batch boundary — the verification, the report's sections, the two
  readings, the ledger's and the roster's row appends, the next prompt's draft
  — in a subagent whose context ends with its turn, so that the resident
  Kanri reads one verdict line and rules on it. The boundary's procedure is a
  template the subagent reads, and its one deliverable is a verdict file.
- Holds **Kanri** under a context ceiling derived from that last figure — its
  own measured baseline plus a chosen number of batches of measured
  consumption — and hands the role over at the next boundary once it is
  crossed, but only while the human is there to start the successor;
  otherwise the crossing is recorded as deferred and the run continues to the
```

**P11.2** `skills/tanto/README.md` — replace exactly these 3 lines

```markdown
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js` and
  `scripts/reading.js`. Every role runs the second at every boundary and every
  exit, so it is no longer needed only by a plan that carries passages; a
```

**P11.2 →**

```markdown
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js`,
  `scripts/reading.js`, and `scripts/boundary.js`. Every role runs the second
  at every boundary and every
  exit, so it is no longer needed only by a plan that carries passages; a
```

**P11.3** `skills/tanto/README.md` — replace exactly these 7 lines

```markdown
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, `shoroku-brief.md` (the shoroku
  check brief), `tanto.json` (the built-in model and effort defaults),
  `kikaku-decision.md`, and `agent.md`, the subagent definition every role
  generates from.
```

**P11.3 →**

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

**P11.4** `skills/tanto/README.md` — replace exactly these 5 lines

```markdown
- `scripts/reading.js` — the instrument every role measures itself with: the
  five-figure reading of one transcript, with the ceiling, presence and
  backstop lines on request, and a `--share` form over several transcripts
  that Kanri runs at the plan close, with `scripts/reading.test.js` beside it.
- Both scripts are Node, no dependencies, invoked as `node <path>`.
```

**P11.4 →**

```markdown
- `scripts/reading.js` — the instrument every role measures itself with: three
  lines always — the five-figure reading of one transcript, the effort, and
  `ttl=5m|1h|unknown`, the cache regime — with the ceiling, presence and
  backstop lines on request, and a `--share` form over several transcripts
  that Kanri runs at the plan close, with `scripts/reading.test.js` beside it.
- `scripts/boundary.js` — the boundary's own instrument, run by the subagent
  Kanri dispatches there: `check`, which runs the boundary's read-only
  commands and prints their output under fixed headings, and `record`, which
  writes the conductor ledger's and the roster's rows idempotently, with
  `scripts/boundary.test.js` beside it.
- All three scripts are Node, no dependencies, invoked as `node <path>`.
```

**P11.5** `skills/tanto/README.md` — replace exactly these 2 lines

```markdown
`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, and
`docs/superpowers/specs/2026-09-15-shoroku-at-close-design.md`.
```

**P11.5 →**

```markdown
`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`,
`docs/superpowers/specs/2026-09-15-shoroku-at-close-design.md`, and
`docs/superpowers/specs/2026-09-19-tanto-diet-design.md`.
```

- [ ] **Step 1: Apply the passages in file order**

Apply **P11.1**, **P11.2**, **P11.3**, **P11.4**, **P11.5**.

- [ ] **Step 2: Check that the README and `SKILL.md` agree**

```bash
grep -cF 'boundary-brief.md' skills/tanto/README.md
grep -cF 'All three scripts are Node' skills/tanto/README.md
grep -cF 'boundary.js' skills/tanto/README.md
grep -cF 'boundary.test.js' skills/tanto/README.md
grep -cF '2026-09-19-tanto-diet-design.md' skills/tanto/README.md
grep -cF '<kanri>' skills/tanto/README.md
```

Expected: `1`, `1`, `2`, `1`, `1`, then `5`. Every count is taken with `-F`,
a literal match: `boundary.test.js` does not contain the substring
`boundary.js`, so the third count is the Prerequisites bullet and the Layout
bullet — two, not three — and the test file is counted on its own line after
it. The `5` is the Usage section's `<kanri>` sites, which task 14 clears in
the final batch.

- [ ] **Step 3: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 11
```

Expected: `task 11: verify clean`. O11.1 to O11.3 are the rows' own claim;
step 2's counts are what checks them here.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/README.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/README.md -m "$(printf 'tanto: the README names the third script, the fifteenth template, and this design\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for that path.

---

**Batch D begins here. Everything from task 12 through task 15 lands in one
batch**, because a peer live during this plan holds the old re-send rule until
it is released, and the human pastes what the running Kanri's file says. Batch
D's boundary is this plan's safe boundary: no role is started or replaced
before it.

### Task 12: `SKILL.md` — the address is read, never announced

**Files:**

- Modify: `skills/tanto/SKILL.md`

**Interfaces:**

- Consumes: the `unanswered:` / `answered:` events pair documented in
  `templates/kanri.md` (task 7).
- Produces: the sentence the six role files repeat (task 15) and the one
  `roles/kanri.md`'s Start cases and Handover rely on (task 13).

**Named-mechanism sites.** `kanri-address:` is named at 20 sites across 11
files; this task clears `SKILL.md`'s five — the Invocation line, the address bullet, the paragraph after the bullets, the Resuming bullet, and the `no-role` bullet — task
13 clears `roles/kanri.md`'s four, and task 15 clears the six role files' one
each and the three templates' five. All three tasks are in this batch, which is
what makes the removal safe. The bootstrap argument keeps existing under the
name `<address>`: `roles/hosa.md` and `roles/kikaku.md` already spell their
start line `/tanto <role> [<address>]` and are not touched for it;
`roles/kaiseki.md`'s `/tanto kaiseki <kanri>` is task 15's and `README.md`'s is
task 14's.

**Old values this task contradicts:**

**O12.1** `kanri-address` — 20 hits before this batch:
`skills/tanto/SKILL.md` 5, `roles/kanri.md` 4, `roles/hosa.md` 1,
`roles/jisso.md` 1, `roles/kaiseki.md` 1, `roles/keikaku.md` 1,
`roles/kikaku.md` 1, `roles/sekkei.md` 1, `templates/batch-prompt.md` 2,
`templates/kaiseki-brief.md` 1, `templates/kanri-handover.md` 2. Five of them —
`SKILL.md`'s — are gone after this task; the other fifteen after tasks 13, 14,
and 15, all in this batch. `grep -rc kanri-address skills/tanto` is zero at
every path at batch D's boundary.

**O12.2** `[<kanri-address>]` — 1 hit, `SKILL.md`, the Invocation
line's placeholder. Zero after this task; the argument stays, named
`[<address>]`.

**O12.3** `of three ways, in this order of` — 1 hit. Zero after this
task: there is one route, not three in precedence.

**O12.4** `which learns Kanri's name from the batch prompt` — 1 hit.
Zero after this task.

**O12.5** `that a pasted file and a sent message are the same bytes` — 1 hit,
`SKILL.md`. Zero after this task: what is sent is one line and the file is not
it.

**O12.6** `re-sends it when the next` — 1 hit. Zero after this task.

**Passages:**

**P12.1** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```markdown
`/tanto <role> [<kanri-address>]`, or `担当して <role>` / `tantoして <role>`.
```

**P12.1 →**

```markdown
`/tanto <role> [<address>]`, or `担当して <role>` / `tantoして <role>`.
```

**P12.2** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```markdown
- **Kanri's address** reaches a role in one of three ways, in this order of
  precedence: the `kanri-address:` line below; the second argument of
  `/tanto <role> <address>`, pasted by the human from Kanri's request; the
  first data row of `.tanto/roster.md`.
```

**P12.2 →**

```markdown
- **Kanri's address** is the first data row of `.tanto/roster.md`,
  read at the moment of sending. No role caches it and no line announces it.
  The second argument of `/tanto <role> <address>` is the bootstrap for a
  workspace whose roster does not exist yet, and is otherwise not given:
  Kanri's create requests do not carry it.
```

**P12.3** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
- **Kanri sends only to the names of `live` roster rows** — never to a
  `queued` Jisso, which learns Kanri's name from the batch prompt that makes
  it live, and never to a `cleared` one, which is a bare window. The roster
```

**P12.3 →**

```markdown
- **Kanri sends only to the names of `live` roster rows** — never to a
  `queued` Jisso, which reads Kanri's row when its prompt wakes it, and never
  to a `cleared` one, which is a bare window. The roster
```

**P12.4** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
Kanri's address is the first data row of the roster. A message whose first line
is `kanri-address: <name> [<ref>] — handover accepted; the roster's first row is rewritten`
comes from a successor Kanri and replaces Kanri's address from then on; the
roster's first row says the same. A role whose send to Kanri errors re-reads
that row.
```

**P12.4 →**

```markdown
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

**P12.5** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```markdown
- Kanri rewrites the roster's first data row with its new name and `[ref]`,
  and sends `kanri-address: <name> [<ref>] — resumed; the roster's first row is rewritten`
  to every `live` roster row — never to a `queued` or a `cleared` one, and
  a listed name is no evidence of a role. A peer not listed
  was resumed too, and re-handshakes on its own `/tanto fukki`, finding the
  new first row.
```

**P12.5 →**

```markdown
- Kanri rewrites the roster's first data row with its new name and `[ref]`,
  and sends nothing: every peer reads that row at its next send. A peer not
  listed was resumed too, and re-handshakes on its own `/tanto fukki`, finding
  the new first row.
```

**P12.6** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
  message longer than one line the `no-role` line follows the first: a
  batch prompt, whose text is what `templates/batch-prompt.md` renders,
  carries it after its title line, and the file carries it there too, so
  that a pasted file and a sent message are the same bytes; a `close:` line
  with its clauses, or a handshake with its fields, is one line. A file a
```

**P12.6 →**

```markdown
  message longer than one line the `no-role` line follows the first: a
  batch prompt travels as the one line `batch: <path>`, and the file that
  path names carries no such line of its own; a `close:` line
  with its clauses, or a handshake with its fields, is one line. A file a
```

**P12.7** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```markdown
  Kanri's own name is in a handover gap, holds the line it sent, and
  re-sends it when the next `kanri-address:` line arrives — this holds a
  line only for a role with an established roster row to hold one on
```

**P12.7 →**

```markdown
  Kanri's own name is in a handover gap, holds the line it sent, and
  re-sends it to the roster's first data row, read fresh, at its next
  wake-up, until it is answered — this holds a
  line only for a role with an established roster row to hold one on
```

- [ ] **Step 1: Apply the passages in file order**

Apply **P12.1** through **P12.7** in that order.

- [ ] **Step 2: Check `SKILL.md`'s own half of the sweep**

```bash
grep -c kanri-address skills/tanto/SKILL.md
grep -c 'read at the moment of sending' skills/tanto/SKILL.md
grep -c 'batch: <path>' skills/tanto/SKILL.md
```

Expected: `0`, then `2` — the address bullet and the paragraph after the
bullets, each with the phrase whole on one line, which is what fence 7's
guard in "How a batch is verified" keys on — then `2`: the Artifacts row task
10 wrote and the Messages bullet this task wrote. The idle-subscription
bullet's "batch prompts" example is unchanged and still correct: the `batch:`
line is sent without a subscription.

- [ ] **Step 3: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 12
```

Expected: `task 12: verify clean`. O12.1's remaining hits — the fifteen tasks
13, 14, and 15 clear in this same batch — and O12.2 to O12.6 are the rows'
own claim; step 2's counts check this file's half, and task 16 step 4 sweeps
the rest.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "$(printf 'tanto: the contract reads Kanri from the roster and announces nothing\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for that path.

### Task 13: `roles/kanri.md` — the Start cases and the Handover lose the broadcast

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (the five cases, the handover trigger's
  signal 4, the handover file's Live peers, and the handover's step 4)

**Interfaces:**

- Consumes: `SKILL.md`'s new address paragraph (task 12), the
  `unanswered:` / `answered:` pair (task 7), and the verdict line's `ceiling:`
  field (tasks 4 and 8).
- Produces: nothing other files read.

**Named-mechanism sites.** `unanswered:` and `answered:` are named in
`templates/kanri.md`'s Session events (task 7), in
`templates/kanri-handover.md`'s Live peers row (task 15), and in the three Start
cases and the handover file section here. The `ceiling:` field of the verdict
line is named in `templates/boundary-brief.md`'s reply (task 4) and in the
loop's steps 3 and 4 (task 8); signal 4's own sentence is the fourth site and is
**P13.4** below. This task does **not** renumber anything: task 9 did that, and
P13.4's old block is the three lines *after* the one task 9 renumbered.

**Old values this task contradicts:**

**O13.1** `answered: the successor sends` — 1 hit, `roles/kanri.md`,
the handover file section's broadcast clause. Zero after this task. The
`templates/kanri-handover.md` half of the same sentence is task 15's **O15.8**,
in this batch.

**O13.2** `answers by re-sending its last unanswered line` — 1 hit,
`roles/kanri.md`. Zero after this task.

**O13.3** `in it, or in any free` — 1 hit. Zero after this task; the
successor starts in the outgoing Kanri's own window.

**O13.4** `stage included — take your own reading with` — 1 hit. Zero
after this task; at a boundary the reading is the verdict line's.

**O13.5** `since their batch prompt names the Kanri` — 1 hit. Zero
after this task; the prompt is a path the Jisso reads at its own wake-up.

**O13.6** `to your successor's address` — 2 hits, `roles/kanri.md`
and 773, both speaking in the retired broadcast's voice. Zero after this task.

**O13.7** `Transcript column, the old Kanri's row` — 1 hit, the
Handover-accepted case's roster sentence, whose column list P13.7 extends.
Zero after this task. The needle spans the point the list grows at; a needle
on `rewrite the roster —` one line above it would survive the edit.

**Passages:**

**P13.1** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
case; send every `live` peer, to its bare name from the roster, one line
`kanri-address: <name> [<ref>] — handover accepted; the roster's first row is rewritten`
— in the same-window case too, because a line a peer sent into the gap
between the `/clear` and your start got `no-role` back, and this line is
what tells it to re-send; delete the handover file, because the Events line
```

**P13.1 →**

```markdown
case; read the ledger's Session events for `unanswered:` lines that have no
`answered:` pair, and the handover file's Live peers for its marks, and answer
those lines first — you announce nothing, and a peer whose line got `no-role`
back in the gap between the `/clear` and your start re-sends it to the
roster's first row on its own next wake-up; delete the handover file, because the Events line
```

**P13.2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
an Events line `cleared: stale transcript, row rewritten in place`, and send
every `live` peer the same `kanri-address:` line Handover sends, so a line a
peer sent into the gap and got `no-role` back knows to re-send — then
```

**P13.2 →**

```markdown
an Events line `cleared: stale transcript, row rewritten in place`, and read
the ledger's Session events for `unanswered:` lines that have no `answered:`
pair and answer those first — this gap has no handover file, and a peer whose
line got `no-role` back in it re-sends on its own next wake-up — then
```

**P13.3** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
rewrite the first row in place with your new name and `[ref]`, status `live`,
send the `kanri-address:` line of `SKILL.md`'s Resuming to every `live` row,
write the Events line `resumed: <old name> → <new name>`, and continue where
```

**P13.3 →**

```markdown
rewrite the first row in place with your new name and `[ref]`, status `live`,
write the Events line `resumed: <old name> → <new name>`, and continue where
```

**P13.4** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   the start of every turn while no batch is in flight, a topic's spec or plan
   stage included — take your own reading with `--role kanri` and read its
   ceiling line. A verdict of `over` is this signal. The ceiling is derived,
```

**P13.4 →**

```markdown
   the start of every turn while no batch is in flight, a topic's spec or plan
   stage included — the verdict line's `ceiling:` is the reading at a
   boundary, and your own `--role kanri --presence` reading is the reading
   everywhere else. A verdict of `over` is this signal. The ceiling is derived,
```

**P13.5** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```markdown
open topic, each with its Topic and what it is waiting for, and marks the ones
whose last line you had not answered: the successor sends `kanri-address:` to
all of them — the `live` rows; the `queued` Jissos are listed after them by
name and place and get nothing, since their batch prompt names the Kanri
that sends it — and each answers by re-sending its last unanswered line,
which is also what a peer does with a line that got `no-role` back in the
gap. A Sekkei or Keikaku whose last line named an exit proposal is waiting
```

**P13.5 →**

```markdown
open topic, each with its Topic and what it is waiting for, and marks the ones
whose last line you had not answered: the successor answers those marked lines
first, pairing them with the ledger's `unanswered:` events, and announces
nothing. The `queued` Jissos are listed after them by
name and place and get nothing, since their batch prompt is a path they read
at their own wake-up.
A Sekkei or Keikaku whose last line named an exit proposal is waiting
```

**P13.8** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
nothing you must wait for beyond an unanswered line, which that peer re-sends
to your successor's address. Signal 4 **is** checked in that stage, at the
```

**P13.8 →**

```markdown
nothing you must wait for beyond an unanswered line, which that peer re-sends
to the roster's first row at its own next wake-up. Signal 4 **is** checked in
that stage, at the
```

**P13.9** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
between plans here: nothing is in flight, and an unanswered line of its
Sekkei or Keikaku is re-sent to your successor's address. While a batch is
```

**P13.9 →**

```markdown
between plans here: nothing is in flight, and an unanswered line of its
Sekkei or Keikaku is re-sent to the roster's first row at that peer's own next
wake-up. While a batch is
```

**P13.7** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
your own row first with status `live` and your own transcript path in its
Transcript column, the old Kanri's row `replaced` (or `dead` when it is
```

**P13.7 →**

```markdown
your own row first with status `live` and your own transcript path in its
Transcript, Started, Model, and Effort columns — and its Name column too when
you started in a window other than the outgoing Kanri's, the same-window case
needing no Name rewrite because a window keeps its name and `[ref]` across a
`/clear` — the old Kanri's row `replaced` (or `dead` when it is
```

**P13.6** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   `/clear`s this window and runs `/tanto kanri` in it, or in any free
   window. Send nothing to any peer; answer the human if asked; do nothing
```

**P13.6 →**

```markdown
   `/clear`s this window and runs `/tanto kanri` in it. Send nothing to any
   peer; answer the human if asked; do nothing
```

- [ ] **Step 1: Apply the passages in file order**

Apply **P13.7** first — its site is the "rewrite the roster" sentence a few
lines above P13.1's — then **P13.1**, **P13.2**, **P13.3**, then **P13.8**
and **P13.9** (the trigger's and Timing's two sentences that still speak in
the broadcast's voice), then **P13.4**, **P13.5**, **P13.6**. That is the
file's own line order.

- [ ] **Step 2: Check this file's half of the sweep**

```bash
grep -c kanri-address skills/tanto/roles/kanri.md
grep -c 'unanswered:' skills/tanto/roles/kanri.md
grep -c 'in any free' skills/tanto/roles/kanri.md
grep -cF "to your successor's address" skills/tanto/roles/kanri.md
```

Expected: `0`, then `3` — the Handover-accepted case, the Kept Kanri gap, and
the handover file's Live peers row, which pairs a mark with "the ledger's
`unanswered:` events" — then `0`, then `0`.

- [ ] **Step 3: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 13
```

Expected: `task 13: verify clean`. O13.1 to O13.7 are the rows' own claim,
and O12.1 is down to the eleven hits tasks 14 and 15 clear in this batch;
step 2's counts are what checks this file here.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "$(printf 'tanto: the handover keeps its event and loses its broadcast\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for that path.

### Task 14: the create requests drop `<name>`, and the README's Usage with them

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (the Create table, the request list,
  and three more sites that carry the argument)
- Modify: `skills/tanto/README.md` (Usage)

**Interfaces:**

- Consumes: task 12's address bullet — the second argument is the bootstrap
  only.
- Produces: the request lines the human pastes from here on.

**Named-mechanism sites.** The `<name>` argument of a create request is at nine
sites: the Create table's four rows, the request list's line 5 and its two
explaining sentences, the Jisso queue request in "When the plan lands", the
queue-empty clause at the end of the batch loop task 8 landed, and the residency
line's "the human copies the bare name into the next `/tanto <role> <name>`" —
all in `roles/kanri.md` — plus the README's Usage block, which is the same
mechanism in the human's own words. `roles/kaiseki.md`'s
`/tanto kaiseki <kanri>` is the tenth and is task 15's, in this batch. The
bootstrap argument itself is not removed anywhere: `SKILL.md`'s Invocation line
and `roles/hosa.md` / `roles/kikaku.md`'s start lines keep `[<address>]`.

**Old values this task contradicts:**

**O14.1** `/tanto jisso <name>` — 4 hits, `roles/kanri.md`: the Jisso queue
request in "When the plan lands", the queue-empty clause of the batch loop, and
the Create table's second and third rows. Zero after this task. `lint` reports
this needle as `needle-in-new-text`, and that is **expected, not a defect**:
task 8 carries the queue-empty clause forward unchanged, so the literal occurs
in that task's new block. The tree still reaches zero, at this task.


**O14.2** `/tanto keikaku <name>` — 1 hit, the Create table. Zero after this
task.

**O14.3** `/tanto sekkei <name>` — 1 hit, the Create table. Zero after this
task.

**O14.4** `/tanto kaiseki <name>` — 1 hit, the Create table. Zero after this
task.

**O14.5** `/tanto <role> <name>` — 2 hits, the residency line and the request
list's. Zero after this task.

**O14.6** `printed it in place of` — 1 hit, the request list's introduction.
Zero after this task.

**O14.7** `tanto sekkei <kanri>` — 1 hit, `README.md`, the Usage
block's first `console` line. Zero after this task, and with it the three
`console` lines beside it, which no needle can span separately because they are
one block.

**O14.8** `is the bare name Kanri's request prints` — 1 hit, `README.md` line
114, the sentence that explains the placeholder. Zero after this task.
`roles/kaiseki.md`'s last `<kanri>` is task 15's **O15.7**, in this batch.

**Passages:**

**P14.1** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   plus one for the whole-branch review's fix wave, each running
   `/tanto jisso <name>`; the human may open more, and fewer when they will
```

**P14.1 →**

```markdown
   plus one for the whole-branch review's fix wave, each running
   `/tanto jisso`; the human may open more, and fewer when they will
```

**P14.2** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```markdown
   instead — one window, queued by the same `/tanto jisso <name>` — and the
```

**P14.2 →**

```markdown
   instead — one window, queued by the same `/tanto jisso` — and the
```

**P14.3** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
mid-plan question. The `[<ref>]` is the identity; the human copies the bare
name into the next `/tanto <role> <name>`.
```

**P14.3 →**

```markdown
mid-plan question. The `[<ref>]` is the identity, and no create request
carries it: a role started with a bare `/tanto <role>` reads the roster's
first data row.
```

Four backticks open P14.4's and P14.6's blocks, because each carries a
three-backtick fence of its own.

**P14.4** `skills/tanto/roles/kanri.md` — replace exactly these 14 lines

````markdown
roster's rows tell them apart. Every create request is this numbered list,
which the human can paste, with your own bare name as your start line
printed it in place of `<name>`:

```text
1. In a free window of <repo path> — one you have /clear'ed, or a new one:
2. /model <family>
3. /effort <level>
4. Make sure the session is in auto mode.
5. /tanto <role> <name>
```

Line 5 carries, after the command, what the Create table's third column names
for that role. The family and the level are `sessions.<role>` from
````

**P14.4 →**

````markdown
roster's rows tell them apart. Every create request is this numbered list,
which the human can paste:

```text
1. In a free window of <repo path> — one you have /clear'ed, or a new one:
2. /model <family>
3. /effort <level>
4. Make sure the session is in auto mode.
5. /tanto <role>
```

Line 5 carries, after the command, the plan path, the branch, the topic, or
the spec path, as the Create table's third column names them for that role —
never an address: the new session reads the roster's first data row. The
family and the level are `sessions.<role>` from
````

**P14.5** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
| a plan is committed and your cold read has no open questions | queue the plan's Jissos: N windows, N the rows of the plan's Batches table plus one for the fix wave; more if the human wants, fewer if they will be present to re-queue released windows — except on a plan naming its final boundary as the safe one (rule 11), which asks for the full N instead, since the queue cannot be refilled before the plan's end | `/tanto jisso <name>`, N, the plan path, the branch |
| the queue is empty and a batch, a fix wave, or a resume needs a Jisso | queue one more Jisso — a released window serves | `/tanto jisso <name>`, the plan path, the branch |
| the spec review is accepted | create Keikaku | `/tanto keikaku <name>`, the topic, the spec path |
| the first batch of the current plan is accepted, or every open topic has passed its spec stage | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei <name>`, the topic if known |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki <name>`; the brief follows the handshake |
```

**P14.5 →**

```markdown
| a plan is committed and your cold read has no open questions | queue the plan's Jissos: N windows, N the rows of the plan's Batches table plus one for the fix wave; more if the human wants, fewer if they will be present to re-queue released windows — except on a plan naming its final boundary as the safe one (rule 11), which asks for the full N instead, since the queue cannot be refilled before the plan's end | `/tanto jisso`, N, the plan path, the branch |
| the queue is empty and a batch, a fix wave, or a resume needs a Jisso | queue one more Jisso — a released window serves | `/tanto jisso`, the plan path, the branch |
| the spec review is accepted | create Keikaku | `/tanto keikaku`, the topic, the spec path |
| the first batch of the current plan is accepted, or every open topic has passed its spec stage | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei`, the topic if known |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki`; the brief follows the handshake |
```

**P14.6** `skills/tanto/README.md` — replace exactly these 18 lines

````markdown
Every lifecycle role after Kanri starts when Kanri asks the human for a
window — the plan's Jissos all at its landing, in one request — and starts
with Kanri's name as its request prints it:

```console
/tanto sekkei <kanri>
/tanto keikaku <kanri>
/tanto jisso <kanri>
/tanto kaiseki <kanri>
```

Kikaku and Hosa are the human's own seats — `/tanto kikaku` and
`/tanto hosa`, opened whenever the human wants one. With no name after the
command, the session finds Kanri in the roster.

`<kanri>` is the bare name Kanri's request prints — the name that session was
born with. No `tanto` session is renamed once it has started, because a rename
would invalidate every address already held.
````

**P14.6 →**

````markdown
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
````

- [ ] **Step 1: Apply the `roles/kanri.md` passages in file order**

Apply **P14.1**, **P14.2**, **P14.3**, **P14.4**, **P14.5**.

- [ ] **Step 2: Apply the README passage**

Apply **P14.6**.

- [ ] **Step 3: Check both files**

```bash
grep -n '/tanto \(jisso\|keikaku\|sekkei\|kaiseki\|<role>\) <name>' skills/tanto/roles/kanri.md
grep -c '<kanri>' skills/tanto/README.md
grep -c '/tanto kaiseki` with no address' skills/tanto/README.md
```

Expected: the first prints nothing; `0`; `1` — the standalone-Kaiseki sentence,
which is about the argument's absence and stays as it is.

- [ ] **Step 4: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 14
```

Expected: `task 14: verify clean`. O14.1 to O14.8 are the rows' own claim;
step 3's greps are what checks them here.

- [ ] **Step 5: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/README.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/README.md -m "$(printf 'tanto: a create request carries no address\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for those paths.

### Task 15: the six other role files and the three templates that carry the slot

**Files:**

- Modify: `skills/tanto/roles/jisso.md`, `skills/tanto/roles/sekkei.md`,
  `skills/tanto/roles/keikaku.md`, `skills/tanto/roles/kaiseki.md`,
  `skills/tanto/roles/kikaku.md`, `skills/tanto/roles/hosa.md`
- Modify: `skills/tanto/templates/batch-prompt.md`,
  `skills/tanto/templates/kaiseki-brief.md`,
  `skills/tanto/templates/kanri-handover.md`

**Interfaces:**

- Consumes: task 12's `SKILL.md` sentence, which these nine files repeat in
  their own words, and task 7's `unanswered:` pair.
- Produces: nothing other files read. After this task
  `grep -rc kanri-address skills/tanto` is zero at every path, which is the
  plan's own stop condition for batch D.

**Named-mechanism sites.** The address sentence is spelled differently in each
role file — the line breaks fall in six different places — so each gets its own
passage and the `kanri-address` needle is what finds them all. The handover
file's three shrunken sections (Rulings the next batch inherits, Residency,
Commands for the human) are named in `roles/kanri.md`'s "The handover file"
paragraph, which lists the nine section names and is **not** changed: the
sections keep their names and lose their bodies. `roles/kaiseki.md`'s
`/tanto kaiseki <kanri>` is the last `<kanri>` site in the skill.

**Old values this task contradicts:**

**O15.1** `re-read the roster's first data row` — 4 hits:
`roles/hosa.md`, `roles/kaiseki.md`, `roles/keikaku.md`, `roles/sekkei.md`.
`roles/jisso.md`'s and `roles/kikaku.md`'s copies of the same clause wrap
across a line break and are not matched by this needle, which is why O15.1 is
not the sweep: **O12.1**'s `kanri-address` is, and it reaches all eleven
remaining sites. Zero after this task.

**O15.2** `that peer re-sends it to the successor` — 1 hit,
`templates/kanri-handover.md`. Zero after this task.

**O15.8** `it; the successor sends` — 1 hit,
`templates/kanri-handover.md`, the Live peers paragraph's broadcast
clause — the other half of O13.1's sentence. Zero after this task.

**O15.3** `or pick any free window` — 1 hit,
`templates/kanri-handover.md`. Zero after this task.

**O15.4** `copied verbatim as compaction insurance` — 1 hit,
`templates/kanri-handover.md`, the Rulings section that becomes a
pointer. Zero after this task.

**O15.5** `Kanri's Residency row from the roster, verbatim` — 1 hit,
`templates/kanri-handover.md`. Zero after this task.

**O15.6** `the prompt names it, and it is your orders` — 1 hit,
`roles/jisso.md`. Zero after this task; the prompt arrives as a line
and the orders are the file it names.

**O15.7** `/tanto kaiseki <kanri>` — 2 hits before batch D:
`roles/kaiseki.md` and `README.md`. The README's is task 14's;
this task clears `roles/kaiseki.md`'s. Zero after this task. **This site is not
named in the spec**; it is here because the same mechanism — the pasted address
argument — is retired, and a role file that still tells the human to paste one
would contradict `SKILL.md`'s new bullet.

**Passages:**

**P15.1** `skills/tanto/roles/hosa.md` — replace exactly these 5 lines

```markdown
Sekkei, Keikaku, Jisso, or Kaiseki, with one exception: the intake's
`received:` reply, `from` copied into `to`, which answers whichever session
sent the report and instructs nothing. A message whose first line is
`kanri-address: <name> [<ref>]` replaces Kanri's address from then on; if a
send to Kanri errors, re-read the roster's first data row.
```

**P15.1 →**

```markdown
Sekkei, Keikaku, Jisso, or Kaiseki, with one exception: the intake's
`received:` reply, `from` copied into `to`, which answers whichever session
sent the report and instructs nothing. Kanri's address is the roster's first
data row, read at the moment of sending; a send that errors or gets `no-role`
back is held and re-sent to that row, read fresh, at your next wake-up.
```

**P15.2** `skills/tanto/roles/jisso.md` — replace exactly these 4 lines

```markdown
`human-contact: <one line>`. Kanri is the only session that messages you. A
message whose first line is `kanri-address: <name> [<ref>]` replaces Kanri's
address from then on; if a send to Kanri errors, re-read the roster's first
data row.
```

**P15.2 →**

```markdown
`human-contact: <one line>`. Kanri is the only session that messages you.
Kanri's address is the roster's first data row, read at the moment of sending;
a send that errors or gets `no-role` back is held and re-sent to that row,
read fresh, at your next wake-up.
```

**P15.3** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```markdown
batch**: the prompt names it, and it is your orders, carrying the plan
path, the conductor ledger path, the branch, and which of the plan's Jissos
you are. **Until it arrives, read nothing** — not the plan, not the spec,
```

**P15.3 →**

```markdown
batch**: it arrives as the one line `batch: <path>`, and the file that path
names is your orders — read it first — carrying the plan
path, the conductor ledger path, the branch, and which of the plan's Jissos
you are. **Until it arrives, read nothing** — not the plan, not the spec,
```

**P15.4** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```markdown
`human-contact: <one line>`. A message whose
first line is `kanri-address: <name> [<ref>]` replaces Kanri's address from
then on; if a send to Kanri errors, re-read the roster's first data row.
```

**P15.4 →**

```markdown
`human-contact: <one line>`. Kanri's address is the roster's first data row,
read at the moment of sending; a send that errors or gets `no-role` back is
held and re-sent to that row, read fresh, at your next wake-up.
```

**P15.5** `skills/tanto/roles/keikaku.md` — replace exactly these 3 lines

```markdown
`human-contact: <one line>`. A message whose first line is
`kanri-address: <name> [<ref>]` replaces Kanri's address from then on; if a
send to Kanri errors, re-read the roster's first data row.
```

**P15.5 →**

```markdown
`human-contact: <one line>`. Kanri's address is the roster's first data row,
read at the moment of sending; a send that errors or gets `no-role` back is
held and re-sent to that row, read fresh, at your next wake-up.
```

**P15.6** `skills/tanto/roles/kaiseki.md` — replace exactly these 3 lines

```markdown
the room is your counterpart. A message whose first
line is `kanri-address: <name> [<ref>]` replaces Kanri's address from then on;
if a send to Kanri errors, re-read the roster's first data row.
```

**P15.6 →**

```markdown
the room is your counterpart. Kanri's address is the roster's first data row,
read at the moment of sending; a send that errors or gets `no-role` back is
held and re-sent to that row, read fresh, at your next wake-up.
```

**P15.7** `skills/tanto/roles/kaiseki.md` — replace exactly these 2 lines

```markdown
**Attached.** `/tanto kaiseki <kanri>` — Kanri's address came on the command
line. You have done the model check and sent the handshake. Kanri's reply
```

**P15.7 →**

```markdown
**Attached.** `/tanto kaiseki` — Kanri's address is the roster's first data
row. You have done the model check and sent the handshake. Kanri's reply
```

**P15.8** `skills/tanto/roles/kikaku.md` — replace exactly these 4 lines

```markdown
else; you never message Sekkei, Keikaku, Jisso, Kaiseki, or Hosa. A message
whose first line is `kanri-address: <name> [<ref>]` replaces Kanri's
address from then on; if a send to Kanri errors, re-read the roster's first
data row.
```

**P15.8 →**

```markdown
else; you never message Sekkei, Keikaku, Jisso, Kaiseki, or Hosa. Kanri's
address is the roster's first data row, read at the moment of sending; a send
that errors or gets `no-role` back is held and re-sent to that row, read
fresh, at your next wake-up.
```

**P15.9** `skills/tanto/templates/batch-prompt.md` — replace exactly these 2 lines

```markdown
not your workspace or your name, reply `not me` to `<kanri-address>` and
stop.
```

**P15.9 →**

```markdown
not your workspace or your name, reply `not me` to the roster's first data
row, read at that moment, and stop.
```

**P15.10** `skills/tanto/templates/batch-prompt.md` — replace exactly these 2 lines

```markdown
`templates/batch-report.md`, then send `<kanri-address>` one line with its
path. Kanri reads these sections first, in this order — For Kanri, Rulings,
```

**P15.10 →**

```markdown
`templates/batch-report.md`, then send the roster's first data row, read at
that moment, one line with its
path. Kanri reads these sections first, in this order — For Kanri, Rulings,
```

**P15.11** `skills/tanto/templates/kaiseki-brief.md` — replace exactly these 2 lines

```markdown
`templates/kaiseki-report.md`, then send `<kanri-address>` one line with its
path.
```

**P15.11 →**

```markdown
`templates/kaiseki-report.md`, then send the roster's first data row, read at
that moment, one line with its path.
```

**P15.12** `skills/tanto/templates/kanri-handover.md` — replace exactly these 4 lines

```markdown
Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor sends `kanri-address:` to all of them. Then the `queued`
Jissos, by name and place — the successor sends them nothing; their batch
prompt names it.
```

**P15.12 →**

```markdown
Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor answers the marked lines first and announces nothing. Then
the `queued` Jissos, by name and place — the successor sends them nothing;
their batch prompt is a path they read at their own wake-up.
```

**P15.13** `skills/tanto/templates/kanri-handover.md` — replace exactly these 3 lines

```markdown
- <role> — <topic> — <name> [<ref>] — <what that session is waiting for> —
  <"answered", or the last line it sent that this session did not answer;
  that peer re-sends it to the successor's `kanri-address:`>
```

**P15.13 →**

```markdown
- <role> — <topic> — <name> [<ref>] — <what that session is waiting for> —
  <"answered", or the last line it sent that this session did not answer,
  which the successor answers first and which the ledger's Session events
  carry as an `unanswered:` line with no `answered:` pair>
```

**P15.14** `skills/tanto/templates/kanri-handover.md` — replace exactly these 6 lines

```markdown
- R-<n> — <the ruling, one line, copied verbatim as compaction insurance>; a
  ruling known only from a compaction summary is marked `(unverified)` on its
  line, and the successor puts it to the human at its first boundary; a
  finding still undecided because the dispatch that raised it returned on
  this handover's own wake-up names that dispatch and its report's path
- Models the next prompt must restate — the task implementation on
```

**P15.14 →**

```markdown
- <One line: the ledger's Rulings section, by path and heading. A ruling known
  only from a compaction summary is marked `(unverified)` there, and the
  successor puts it to the human at its first boundary; a finding still
  undecided because the dispatch that raised it returned on this handover's
  own wake-up names that dispatch and its report's path.>
- Models the next prompt must restate — the task implementation on
```

**P15.15** `skills/tanto/templates/kanri-handover.md` — replace exactly these 7 lines

```markdown
Kanri's Residency row from the roster, verbatim, with its last reading.

| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |

- The reading taken when this handover was written — <reading>
```

**P15.15 →**

```markdown
<One line: Kanri's Residency row in `.tanto/roster.md`, by heading, and the
reading taken when this handover was written.>
```

**P15.16** `skills/tanto/templates/kanri-handover.md` — replace exactly these 5 lines

```markdown
1. /clear this window — or pick any free window of <repo path>.
2. /model <family> and /effort <level>, as `sessions.kanri` says; /clear
   keeps the model and resets the effort.
3. /tanto kanri
4. If the new Kanri started elsewhere, /clear this window when convenient.
```

**P15.16 →**

```markdown
1. /clear this window.
2. /model <family> and /effort <level>, as `sessions.kanri` says; /clear
   keeps the model and resets the effort.
3. /tanto kanri
```

- [ ] **Step 1: Apply the six role files' passages**

Apply **P15.1** (hosa), **P15.2** and **P15.3** (jisso, in file order),
**P15.4** (sekkei), **P15.5** (keikaku), **P15.6** and **P15.7** (kaiseki, in
file order), **P15.8** (kikaku).

- [ ] **Step 2: Apply the three templates' passages**

Apply **P15.9** and **P15.10** (batch-prompt, in file order), **P15.11**
(kaiseki-brief), and **P15.12** through **P15.16** (kanri-handover, in file
order).

- [ ] **Step 3: Run the batch's whole sweep**

```bash
grep -rc kanri-address skills/tanto
grep -rn '<kanri>' skills/tanto
grep -c 'read at the moment of sending' skills/tanto/roles/hosa.md skills/tanto/roles/jisso.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md
grep -c '^## ' skills/tanto/templates/kanri-handover.md
```

Expected: the first prints `<path>:0` for every path under `skills/tanto`; the
second prints nothing; the third prints `1` for each of the six role files; the
fourth prints `9` — the handover file keeps all nine section names and three of
them lose their bodies.

- [ ] **Step 4: Verify the task's blocks**

```bash
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task 15
```

Expected: `task 15: verify clean`. O15.1 to O15.8 and O12.1 — the plan's
`kanri-address` sweep — are the rows' own claim, and step 3 is what checks
them here, over the whole of `skills/tanto/`.

- [ ] **Step 5: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/roles/hosa.md skills/tanto/roles/jisso.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/kaiseki-brief.md skills/tanto/templates/kanri-handover.md
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/roles/hosa.md skills/tanto/roles/jisso.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/kaiseki-brief.md skills/tanto/templates/kanri-handover.md -m "$(printf 'tanto: every role reads Kanri from the roster, and the handover file shrinks\n\nCo-Authored-By: Claude <noreply@anthropic.com>')"
git status --porcelain
```

Expected: nothing printed for those paths.

---

**Batch E begins here.** It lands no content: it runs the spec's whole
Verification list once, against a tree that batch D finished, and records what
each item printed. Batch D's boundary is still the plan's safe boundary.

### Task 16: run the spec's Verification list whole, and record it

**Files:**

- Modify: none. The deliverable is recorded output — the batch report's own
  `## Verification` section, and `.tanto/tanto-diet/verification.md` beside it,
  untracked under `.tanto/.gitignore`. This task is a **sweep-and-check** task:
  it has no file to diff, so its reviewer reads the recorded output instead.

**Interfaces:**

- Consumes: everything tasks 1 to 15 landed.
- Produces: the recorded output the boundary rules on. Nothing later in this
  plan consumes it.

**Named-mechanism sites.** None: this task names no new mechanism and changes no
file.

**Old values this task contradicts:** none. Every `O` needle of this plan is
already at zero by batch D's boundary; this task's step 4 is the sweep that
proves it, over the whole of `skills/tanto/` rather than only the paths a given
task touched.

- [ ] **Step 1: The scripts' tests**

```bash
node --test 'skills/tanto/scripts/*.test.js' 2>&1 | tail -20
```

Expected: `# fail 0`, and a `# pass` count that includes `boundary.test.js`'s
cases, `reading.test.js`'s five new ones, and every pre-existing case. The
quoted glob is the only form that runs on this host (issue-235b).

- [ ] **Step 2: The `check` dogfood run**

```bash
mkdir -p .tanto/tanto-diet
node skills/tanto/scripts/boundary.js check \
  --plan docs/superpowers/plans/2026-09-17-seat-lineage.md \
  --report .tanto/seat-lineage/batch-fixwave-report.md \
  --base "$(git merge-base main HEAD)" \
  --kanri-transcript "$T" \
  --tanto skills/tanto > .tanto/tanto-diet/check-dogfood.txt
grep -n '^check: \|^## ' .tanto/tanto-diet/check-dogfood.txt
```

Expected: a `check:` line and the headings `## boundary`, `## diff`,
`## sections`, `## jisso reading`, `## kanri reading`. The `boundary` and `diff`
halves will very likely say `fail` — `2026-09-17-seat-lineage.md` is a landed
plan and its passages no longer match this branch — and that is fine: what is
verified here is that the command runs and prints, not that it passes. The
fixture report is the one report on disk that carries the 2026-09-16 heading
`## Shoroku proposal`, so `sections` finds all five headings; set `$T` to this
session's own transcript path in the same tool call as the command, as
`SKILL.md` prescribes.

- [ ] **Step 3: `record`'s idempotency on scratch copies**

```bash
scratch=.tanto/tanto-diet/record-check
rm -rf "$scratch"
mkdir -p "$scratch"
cp skills/tanto/templates/kanri.md "$scratch/ledger.md"
cp skills/tanto/templates/roster.md "$scratch/roster.md"
for pass in 1 2; do
  node skills/tanto/scripts/boundary.js record \
    --ledger "$scratch/ledger.md" --roster "$scratch/roster.md" \
    --batch Z --tasks 1-3 --state reported --verdict 'check: pass' \
    --progress 'batch Z reported' \
    --kanri 'kanri-z [aaaaaa]' \
    --kanri-reading 'transcript: 1 B, 2 records, 3 wake-ups, 0 compactions, context=4 ttl=1h' \
    --jisso 'jisso-z [bbbbbb]' \
    --jisso-reading 'transcript: 5 B, 6 records, 7 wake-ups, 0 compactions, context=8' \
    --s-item 'batch-Z-report.md item 1 | an item' --event 'boundary Z verified' \
    --now '2026-09-19 10:00' > "$scratch/printed-$pass.txt"
  cp "$scratch/ledger.md" "$scratch/ledger-$pass.md"
  cp "$scratch/roster.md" "$scratch/roster-$pass.md"
done
diff "$scratch/ledger-1.md" "$scratch/ledger-2.md"
diff "$scratch/roster-1.md" "$scratch/roster-2.md"
diff "$scratch/printed-1.txt" "$scratch/printed-2.txt"
```

Expected: all three `diff`s print nothing.

- [ ] **Step 4: The content sweep, over the whole of `skills/tanto/`**

```bash
grep -rc kanri-address skills/tanto
grep -c thirteen skills/tanto/SKILL.md
grep -c 'tanto-boundary-verify' skills/tanto/roles/kanri.md
grep -n 'loop step [78]' skills/tanto/roles/kanri.md
grep -rn 'loop step' skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md
grep -c '<kanri>' skills/tanto/README.md
node -e 'const c=require("./skills/tanto/templates/tanto.json");const k=Object.keys(c.subagents);console.log(k.length);console.log(k.includes("boundary.verify"))'
```

Expected, in order: `0` for every path the first command lists; `0`; at least
`1`; nothing; **seven** lines carrying eight references — `loop step 4` five
times and `loop step 6` three times, one line naming two of them — each read
against task 8's map as task 9 step 2 lists them; `0`; then `14` and `true`.

- [ ] **Step 5: Lint every path this plan changed**

```bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md skills/tanto/roles/hosa.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/kaiseki-brief.md skills/tanto/templates/boundary-brief.md skills/tanto/templates/tanto.json skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: every hook `Passed` or `Skipped`.

- [ ] **Step 6: The plan's own passages, whole**

```bash
for n in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16; do
  node "$TANTO/scripts/passage-check.js" verify \
    --plan docs/superpowers/plans/2026-09-19-tanto-diet.md --task "$n" || exit 1
done
git status --porcelain
```

Expected: one line per task — `verify clean` for the twelve that carry a `P`
or an `A` block, `no passages` for tasks 1, 2, 4, and 16, which carry a `W`
block or none — and then nothing from `git status --porcelain`. `verify` needs
a `--task`: without one it exits 2 on its usage line, which is why this is a
loop and not a single call. The `O` needles are step 4's sweep, not `verify`'s.

- [ ] **Step 7: Record the output**

Write `.tanto/tanto-diet/verification.md` with one section per step above — the
command, its output, and pass or fail — and copy the same list into the batch
report's `## Verification` section. Nothing is committed: `.tanto/` is
untracked, and this task changes no tracked file.

**The measurement is not this plan's.** The spec's Verification ends with an
item explicitly deferred to the next topic's Kanri: at each boundary of its
first plan, its tool calls per boundary (target: down from 16 to 5 or fewer),
its `context=` delta per batch, its `context=` at the plan's landing and at the
close against 145k, and the `ttl=` values — into that ledger's Measurements
table. This plan's own Kanri runs the old boundary throughout (Global
Constraints), so it has nothing to measure here, and no task of this plan
measures anything.

---

## Self-Review

**1. Spec coverage.** Every section of
`docs/superpowers/specs/2026-09-19-tanto-diet-design.md`, and the task that
implements it:

| Spec section | Task |
| --- | --- |
| 1.1 the boundary dispatch | 8 (the loop's step 2) |
| 1.2 `templates/boundary-brief.md` | 4 |
| 1.3 the verdict file | 4 (the brief defines it), 10 (the Artifacts row) |
| 1.4 `scripts/boundary.js` | 2 (both subcommands), 1 (its whole test suite) |
| 1.5 `reading.js`'s `ttl=` line | 3 |
| 1.6 the `batch:` line | 6 (the template), 8 (the send, both sites), 12 (the Messages bullet), 15 (the Guard and the Report section, `roles/jisso.md`) |
| 1.7 the handover without ceremony | 12 (`SKILL.md`, including the `unanswered:` obligation), 13 (`roles/kanri.md`: the three Start cases, the trigger, the handover file, and — P13.7 — the successor's roster rewrite in the other-window case), 14 (the create requests), 15 (the handover template) |
| 2.1 the expected-model config | 10 |
| 2.2 "Handshake and roster": The address | 12 |
| 2.3 "Resuming" | 12 |
| 2.4 "Messages" | 12 |
| 2.5 "Artifacts" | 10 |
| 2.6 "The transcript reading" | 10 |
| 2.7 rule 3 and rule 6 | 10 (rule 3; rule 6 unchanged, as the spec says) |
| 3.1 "Start": the five cases | 13 |
| 3.2 "The batch loop", replaced whole | 8, and its renumbering 9 |
| 3.3 "Handover" | 13, and its renumbering clause 9 |
| 3.4 "Session lifecycle": Create | 14 |
| 3.5 the dispatch sites | 8 (stated in its Interfaces: one site, no list to extend) |
| 4 the other role files | 15 |
| 5 the templates | 4, 5, 6, 7, 15 |
| 6 the scripts and their tests | 1, 2, 3 |
| 7 `README.md` | 11 (Layout, Prerequisites, "What it does", the design list), 14 (Usage) |
| 8 the boundary, and rule 11 | Global Constraints, the Batches section, and batch D's grouping |
| Verification | the "How a batch is verified" fences, and task 16 whole |
| Out of scope | nothing in this plan touches `ceiling.*`, a model or an effort of an existing kind, Kikaku's footprint, `reading.js --usage`, shape 2's controller, or `roles/kanri.md` beyond the named sections |

Four gaps in the spec's own site lists, each covered here and named so a
reviewer can rule on them rather than discover them:

- **The first batch prompt's send** (`roles/kanri.md`, "When the plan lands",
  step 5) sends "the same text"; the spec's 1.6 changes only the loop's send.
  **P8.4** changes it too, because a Jisso must not meet two forms of the same
  prompt.
- **`roles/kaiseki.md`'s `/tanto kaiseki <kanri>`** carries the pasted address
  the spec's 1.7 retires; the spec's 3.4 and section 7 list the other sites but
  not this one. **P15.7** changes it, and **O15.7** says so.
- **`roles/kanri.md`'s hotfix lane** still says "in slot (b) of step 7's
  commit window" after `bug-report-hold`'s merge; the spec's renumbering list
  omits it. **P9.7** renumbers it to step 5's.
- **A handover that stops the loop at step 5** would never reach step 6's
  `record` call, so the exit proposal's `pending` rows would go unwritten. The
  spec does not say who writes them. **P8.3** and **P9.5** give that case its
  own `record --s-item` call, made in the commit window.

Two additions the spec's own text requires but does not spell out, both in task
2: `record` reads the `ttl=` value out of the `--kanri-reading` string it is
handed (the spec's 1.4 puts `ttl=<v>` in the Measurements entry but gives
`record` no `--ttl` argument, and the brief has the value in that string), and
`--now` fixes the clock for the tests, as `reading.js`'s own switches do.

**2. Placeholder scan.** No `TBD`, no `TODO`, no "implement later", no "add
appropriate error handling", no "similar to task N", and no "write tests for
the above": every test body and every new file's content is written out. Every
command in every step is one that was run against this tree while the plan was
drafted, or is a `passage-check`/`lint` invocation whose form is fixed by the
role file. Every `O` needle's count is the count `grep -rF -c` actually printed
on 2026-09-19, not an assumed one; the two needles that would have read `0`
because they wrap in their target — `by Kanri at every boundary it rules on`
and `the two readings of loop step 6` — were narrowed to the single lines
`boundary it rules on` (O10.6) and `readings of loop step 6` (O9.9) after
being run.

**2a. What `lint` and `replay` report, and why one finding is expected.**
`lint` and `replay --base main` were both run while drafting. `lint` reports
exactly one line, `needle-in-new-text: O14.1`, which is by design and not a
defect: task 8 carries `roles/kanri.md`'s queue-empty clause forward
unchanged, so the literal `/tanto jisso <name>` occurs inside task 8's own new
block, while task 14 is what removes it from the tree. No other needle occurs
in any new block, no lead is malformed, every `N` matches its block's real
line count, every cited id exists, and each of the three insertions carries an
anchor step (A3.1 for task 3's two, A5.1 for task 5's one).

**Seven passages were re-authored after `bug-report-hold` merged.** On
2026-09-20 that branch landed on `main` as `823d88a`, and `replay --base main`
reported seven `occurrence-count` failures: P7.3, P8.1, P8.2, P9.7, P15.1 and
P15.14, plus the P9.8 whose site the merge deleted. Each was re-derived from
the merged tree rather than from the Rebase note's prediction — four of them
differed from it — and the note above now records what each needed. Task 9
lost a passage and was renumbered to stay contiguous; task 8 gained **O8.8**.
`lint` and `replay --base main` are clean against `823d88a`.

**Why the three created files are `W` blocks and not `P` blocks.** `replay`
copies out of the merge base every path a `P`, `A`, or `O` block names, and a
path this plan creates is not there; only a `W` block's path is exempt
(`passage-check.js`, `runReplay` step 1). An earlier draft split batch A by
subcommand — `check` in one task, `record` in the next, both editing
`boundary.js` with `P` blocks — and `replay` failed at exit 2 with
`fatal: path 'skills/tanto/scripts/boundary.js' does not exist in 'main'`. So
each created file now appears once, whole, as one `W` block in one task, batch
A splits by file instead, and the three paths are also declared with
`created:` lines in File structure so that `diff` exempts them at a boundary.
The cost is that `verify` checks nothing for tasks 1, 2, and 4 —
`verifyTask` reads `P` and `A` blocks only — so each of those three tasks
carries a content grep of its own as the step that stands in for it.

**The `W` content was executed, not only written.** Both JavaScript files were
assembled, placed in a scratch skill tree beside real copies of
`passage-check.js`, `reading.js`, `templates/kanri.md` and
`templates/roster.md`, and run: `node --test` reports 18 tests, 18 pass, 0
fail. Two defects were found and fixed that way, both in `record`: a re-run
printed fewer rows than the first run, because an `S-n` row and a Session
events line that were already there were skipped silently instead of being
printed again (the spec's 1.4 says a re-run "prints the same rows"), and one
test asserted on the ledger template's placeholder text, which task 7 rewrites
— it now asserts that one batch's Measurements entry is replaced while another
batch's is left alone, which is the property the spec states. `biome check`
with the repository's own config reports nothing on either file, so the lint
step cannot rewrite a `W` block out from under `verify`.

The seven gated fences of "How a batch is verified" were each run against the
pre-batch-A tree and each exits `0`; fence 2 prints `subagents keys: 13` there
and will print `14` from batch B on. All eight were syntax-checked with
`bash -n`.

**3. Type and name consistency.** `record`'s flag names are the same in task 2's
implementation, task 1's tests, task 4's brief, task 8's loop, and the
"How a batch is verified" fences: `--ledger`, `--roster`, `--batch`, `--tasks`,
`--state`, `--report`, `--verdict`, `--progress`, `--kanri`, `--kanri-reading`,
`--jisso`, `--jisso-reading`, `--peer-reading`, `--s-item`, `--event`,
`--status`, `--now`. `check`'s are `--plan`, `--report`, `--base`,
`--kanri-transcript`, `--measurement`, `--tanto`. The printed headings are
`## boundary`, `## diff`, `## sections`, `## measurement`, `## jisso reading`,
`## kanri reading` in tasks 2, 4, and 16 alike. The verdict file's eleven
headings are spelled the same in task 4's brief, task 8's step 3 reading list,
and task 10's Artifacts row. The Measurements entry
`batch <X>: kanri context=<n>, jisso context=<n>, ttl=<v>` is spelled the same
in task 2's `writeMeasurement`, task 1's test, and task 7's template row. The
kind is `boundary.verify` and the definition `tanto-boundary-verify` everywhere.

**4. Sizes.** Per task, the plan's own line count and its step count:

| Task | Plan lines | Steps | Blocks |
| --- | --- | --- | --- |
| 1 | 602 | 6 | 1 W (481 lines), 0 O |
| 2 | 661 | 6 | 1 W (515 lines), 2 O |
| 3 | 415 | 7 | 8 P, 1 A, 2 O |
| 4 | 252 | 5 | 1 W (161 lines), 1 O |
| 5 | 94 | 5 | 1 P, 1 A, 1 O |
| 6 | 141 | 5 | 3 P, 2 O |
| 7 | 127 | 5 | 3 P, 2 O |
| 8 | 512 | 6 | 4 P, 8 O |
| 9 | 253 | 5 | 9 P, 10 O |
| 10 | 346 | 5 | 14 P, 6 O |
| 11 | 196 | 5 | 5 P, 3 O |
| 12 | 219 | 5 | 7 P, 6 O |
| 13 | 193 | 5 | 6 P, 5 O |
| 14 | 256 | 6 | 6 P, 8 O |
| 15 | 389 | 6 | 16 P, 8 O |
| 16 | 137 | 7 | none |

**The largest task is task 2** at 661 plan lines and 6 steps, of which 515 are
the one `W` block: `boundary.js` whole, both subcommands. Task 1 is next at
602 lines, 481 of them its own `W` block. Neither can be split further without
putting a `P` block on a path the plan creates, which `replay` cannot follow,
and each is one file whose reviewer has one question: does this file do what
the brief and the loop say, and do the tests say so. Task 8 is the largest
**prose** task at 506 lines, with a 60-line, a 40-line, and a 50-line
replacement in one file; task 15 at 389 lines is the widest, sixteen passages
over nine files, but every one of them is three or four lines of the same
sentence.

The count that matters for a Jisso is not the plan's line count but the tree
diff: batch A writes 996 new lines of JavaScript in two files and changes
about 45 more in `reading.js` and its tests; batch B writes 161 new lines and
changes about 20; batch C changes about 190 lines across four files; batch D
changes about 110 across eleven; batch E changes none.

**Task 1's deliverable is a red suite**, which is the other shape a reviewer
has to be told about: its file is complete and correct and every one of its
eighteen tests fails, because the file it tests arrives in task 2. Its own
step 2 states the expected failure text, and the plan's verification fences
are gated on `boundary.js` existing so that none of them is red at its
boundary.

**Task 16 is the plan's one sweep-and-check task**: its deliverable is recorded
output rather than a file, which inverts its reviewer's standing instruction —
there is no diff to read, so the review is of the recorded commands and their
output. It is alone in batch E for that reason. No size threshold is set here;
the figures are recorded so that one can be chosen later (issue-7281).

**5. The batch cuts.** Batch A is self-contained (two scripts and their tests,
nothing else reads them yet). Batch B adds the template, the config key, and
the two template edits: nothing yet dispatches the kind, so it is coherent in
the files a role reads at its start — `SKILL.md` and the role files — but not
fully coherent, because from its boundary the batch-prompt template and
`SKILL.md` 2.4 disagree about the `no-role` line, which Kanri's own hand
bridges until task 12 (Global Constraints, third bullet). Batch C is the first
batch whose boundary leaves the tree
**internally inconsistent on purpose**: `roles/kanri.md`'s loop dispatches the
new kind while `SKILL.md`'s address bullets and the six role files still
describe the broadcast. That is why the safe boundary is batch D's and why
Global Constraints forbids starting or replacing a role before it. Batch D
closes every one of those gaps in one batch; batch E only measures.
