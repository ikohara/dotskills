# Design: the tanto small-items sweep — a durable passage-check instrument, and eleven fixes

One sweep over the small open items of the `tanto` skill, plus the operational
text that req-04f5 and decision-b6cb landed on `main` and `roles/kanri.md` does
not yet carry. The sweep's one non-Markdown deliverable is
`skills/tanto/scripts/passage-check.js`, the instrument a plan that carries
passages checks itself with; the rest is passages into `SKILL.md`, the four
role files, one template, one note, and the skill's README.

Written by Sekkei `dotskills-59 [cbd62d]` on `opus`, 2026-09-10, from the spec
inputs at `.superpowers/sdd/tanto-sweep/spec-inputs.md` and the dialogue at
`.superpowers/sdd/tanto-sweep/dialogue.md`. The dialogue's turns are cited as
`D-n` throughout; they are the human's decisions and this document does not
re-open them.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them whole.

1. **The scope is eleven issues and one piece of operational text** (I-1).
   The issues: 10bc, 7481, d725, f813 (filed at the context-cost exit), and
   12d3, 867f, f2ec, 15bf, 88d3, 7281 (earlier), and — removed from the scope
   at D-1 — f2c4. The operational text is req-04f5's residency bullet and
   decision-b6cb, which `roles/kanri.md` contradicts in two places.

2. **issue-f2c4 is out** (D-1). It renames a path that appears in every file
   this sweep touches, so its old passages would be the new passages the other
   ten tasks write, and it edits the same `SKILL.md` Workspace sentences as
   issue-12d3. It gets its own plan, where its old values are the ones on
   `main` today. issue-12d3 is therefore the plain two-passage fix its own
   record describes, and this plan does not collapse the topic directory into
   the workspace.

3. **The instrument is one script with four subcommands** (D-2), in
   **JavaScript on Node** (D-11), standard library only, floor **Node 22**, at
   `skills/tanto/scripts/passage-check.js`. It covers the diff-side check
   (issue-7481), the replay-side checks (issue-88d3, issue-7481), the
   parser-only count check (issue-88d3), and the old-value sweep (issue-10bc,
   D-4).

4. **A task's Verify step becomes one invocation of that script** (D-6), and
   the plan carries every block exactly once with a citable id (issue-f813).

5. **A decide point in a review brief carries its own default** (D-3):
   `— If unanswered: <what>`, so silence selects something the human saw
   before answering.

6. **`mode=` is a one-bit signal by measurement, not by omission** (D-5). The
   human opened a default-mode window on 2026-09-10 and reported that its
   system prompt names no permission mode — the only occurrence of the phrase
   is the harness line "Tools run behind a user-selected permission mode",
   which does not say which one is active — while an auto-mode session carries
   a "While auto mode is active:" block. issue-15bf closes on that.

7. **decision-b6cb decides the handover's shape.** The plan close becomes the
   third and ordinary trigger; the human's word and a noticed compaction stay
   as the mid-plan case; issue-40ed's handover half closes without a number
   and its replacement half keeps the data. The ADR names `roles/kanri.md`'s
   plan-close row and trigger paragraph as what must carry the procedure.

8. **issue-12d3's decision is the human's, of 2026-09-09**: keep both
   untracked directories, ask about neither.

9. **issue-d725 is already ruled for this run** as Kanri's `R-1`. The sweep
   lands the text, not a behaviour change.

10. **Rule 11 applies.** This repository links `skills/tanto/` into the
    working tree at `~/.claude-priv/skills/tanto`, so a session started
    mid-plan reads whatever is on disk at that moment. The plan states the
    boundary from which a role may be started or replaced, and until then the
    authority for the run's sessions is the plan's Global Constraints,
    Kanri's orders line, and the batch prompts.

11. **The tooling for the script is the human's, and lands first** (D-8, D-12,
    D-13). Before batch A's first task, the human puts two things in place
    through the dotrepo base scaffold: a JavaScript linter targeting
    `skills/tanto/scripts/*.js` at Node 22, and `mise` in this repository's
    contributor prerequisites, since the tests are pinned to the floor with it.
    The `mise` entry is a `CONTRIBUTING.md` change and so needed the human's
    explicit approval, which D-13 records; the spec review raised it as a scope
    item because the dialogue file did not yet carry D-12, where the human had
    named `mise` twice.
    This plan touches neither `.pre-commit-config.yaml` nor `CONTRIBUTING.md`
    nor any other linter or formatter configuration — `AGENTS.md` forbids the
    first without explicit human approval and repo-root Markdown likewise.
    Kanri verifies both are in place before sending batch A's prompt, and a
    batch A that starts without them cannot run its own verification.

## Why Node, and not Python

The dialogue reached Python first and reversed at D-11, and the reversal is
worth recording because the reasoning is reusable.

The premise offered for Python was that skills commonly ship Python. Measured
against the installed plugin cache, that premise is false for this host.
`superpowers`, the first-party plugin, ships `.js` and `.sh` under
`skills/<name>/scripts/` — `brainstorming/scripts/helper.js` and
`start-server.sh`, `writing-skills/render-graphs.js`,
`systematic-debugging/find-polluter.sh` — invokes them as bare `node
server.cjs` and `#!/usr/bin/env node`, with no fallback and no version check,
and ships no `package.json` with them. The only six `.py` files in the whole
cache are that plugin's own test suite and its Hermes integration, not skill
payload. The Python-bundling skills that were remembered — pdf, docx, xlsx —
run in the claude.ai code-execution sandbox, which guarantees Python; Claude
Code guarantees Node, because Claude Code is a Node application.

So the runtime a Claude Code skill may assume is Node, and the first-party
skills assume exactly that.

Two runtime assumptions, at two different levels, and they must not be
conflated.

- **Using the skill** assumes only **Node 22 or newer on `PATH`** — whatever
  node the environment naturally offers. Nothing pins a version at that level,
  nothing installs one, and only a plan that carries passages needs it at all.
  This is the same bet `superpowers` already takes, and this machine satisfies
  it with `v24.16.0`.
- **Testing the script** assumes **`mise`**, a contributor's tool on the
  machine that authors or edits the instrument.
  `mise x node@22 -- node --test skills/tanto/scripts/` pins the floor the way
  `uv run --python` pins a Python, installing it on demand; measured here on
  2026-09-10, a bare `node@22` resolved to `v22.23.2`. That is the command the
  plan's verification names, so "the tests pass on the floor" is a run and not
  a claim.

`mise` therefore belongs where `uv` and PSScriptAnalyzer already are — in this
repository's contributor prerequisites — and it arrives by the same route as
the JavaScript linter of Fixed input 11, from the dotrepo base scaffold rather
than from a task of this plan.

### Encoding and line endings

Measured in this repository on 2026-09-10: `.gitattributes` carries `* text=auto`
with `eol=lf` for `*.sh` and `eol=crlf` for `*.bat` only, `core.autocrlf` is
`true` both locally and globally, and every file this plan touches reports
`i/lf w/crlf` under `git ls-files --eol` — index LF, working tree CRLF, nothing
mixed. A `.js` file falls under `text=auto` and gets the same treatment.

The script's whole job is to match text the plan quotes against text in a file,
so this is not a detail:

- **Read as UTF-8, and normalize CRLF to LF before any comparison, search, or
  line count.** A plan block written LF and a target file checked out CRLF
  otherwise never match, and the failure looks like a missing passage rather
  than an encoding problem.
- **Write with the target file's own ending.** `replay` detects the dominant
  ending of each file it copies and restores it when it writes the applied
  copy, so that the reconstructed tree is byte-comparable with the real one
  instead of differing on every line.
- **Strip CR from `git diff` output before classifying it.** A CRLF working
  tree diffed against an LF index carries CR bytes on the added lines, which no
  literal quote from the plan will contain.
- **A file whose endings are mixed is reported, never silently normalized.**
  `git ls-files --eol` must show the same `i/` and `w/` values before and after
  a task and must never show `w/mixed`; that command, not a grep for a control
  character, is what settles a line-ending question.
- **The script carries no shebang and is always invoked as `node <path>`.**
  Under `text=auto` its working-tree copy is CRLF on Windows, and a shebang
  line ending in CR is not a runnable interpreter path. Invoking through `node`
  sidesteps it and needs no `.gitattributes` change, which this plan therefore
  does not make.

## 1. The instrument — `skills/tanto/scripts/passage-check.js`

### What it is

A plain CLI. It reads a plan file and runs `git`; it invokes no skill and
dispatches no agent. It never writes into the working tree — `replay` works on
copies under a temporary directory. Standard library only: `node:fs`,
`node:path`, `node:child_process`, `node:util`'s `parseArgs`. No
`package.json`, no dependency step, no install.

Its tests are `skills/tanto/scripts/passage-check.test.js`, using `node:test`
and `node:assert` — stdlib too, so the instrument's own guard needs nothing
installed either. They run on the declared floor,
`mise x node@22 -- node --test skills/tanto/scripts/`, so that the floor is a
run rather than a claim. The instrument is what every future passage plan
trusts; a broken one passes a broken plan silently, which is why it gets a
regression guard rather than only a dogfood.

### The block grammar

The lead line is the machine contract, and it is visible in the rendered plan
so that a reader and the parser see the same thing. There is exactly one place
each fact is written.

**The id.** Every block's id is `<task>.<n>` — the plan's task number, a dot,
and the block's ordinal within that task — prefixed by its kind: `P` for a
passage, `A` for an anchor step, `O` for an old value, `W` for a whole file.
`verify --plan <path> --task <N>` selects by that first component, so the task
number in the id is load-bearing and not decoration. **This spec's own ids are
not plan ids.** A spec has no tasks, so its blocks are labelled `P-K1`, `A-S5`,
`P-M2` — grouped by destination file — and the drafter assigns each one a
`<task>.<n>` when it places the block in a task. The plan's "Where each change
lives" table carries both, spec label and plan id, so the mapping is written
once and checkable.

**Four shapes.**

- A **replacement** leads with
  `**P<id>** <path> — replace exactly these <N> lines`, then the old block,
  then `**P<id> →**`, then the new block.
- An **insertion** leads with `insert after these <N> lines` or
  `insert before these <N> lines`, and its new block omits the anchor lines the
  old block names, because an insertion's anchor stays. Both directions exist
  because a section that must precede an existing heading has no other anchor
  than that heading: this spec has one such block, and a first draft wrote it
  as `insert after` with the direction corrected only in prose the parser does
  not read.
- A **global replacement** leads with
  `replace all <N> occurrences of these <M> lines`. It is the one shape whose
  old block is allowed to match more than once, and `<N>` is the count `lint`
  checks.
- A **whole file** leads with `**W<id>** <path> — new file, <N> lines` and
  carries the file's entire content. A file the plan creates has no old
  passage to anchor to, and `diff` needs to know its lines are accounted for.
  A plan need not carry a created file this way — see `diff`'s `created:` set
  below — and this plan does not, because transcribing a program byte for byte
  buys nothing that its own tests do not.

**An anchor step** leads with
`**A<id>** <path> — <command> — before: <v>, after: <v>`, both values stated,
always. An anchor check inverts only when the new passage wholly supersedes the
needle; when the needle is the passage's unchanged opening it still returns `1`
after a correct edit, and a boundary that re-runs the blocks mechanically reads
the non-inverting half as a failure without the stated value. **Every insertion
carries one**, because an insertion's own block is text that survives the edit
and so cannot pin where the new text went; a replacement carries one only when
the plan wants a needle its blocks do not already quote. `lint` enforces that
rule, which is why it is written here rather than left to judgment.

**An anchor needle never contains a backtick.** It is written inside an inline
code span, and a single-backtick span ends at the next backtick, so a needle
with one renders as fragments and a parser extracting the command gets a
truncated string — silently, with no error. Measured on this spec: `A-S5`'s
first draft embedded a `grep` pattern full of backticks and both the reviewer's
parser and the author's dropped the anchor entirely, finding four of five. Pick
a substring of the target line that carries none, and use `grep -cF` when the
line's punctuation would otherwise need escaping.

**An old value the plan contradicts** leads with
`**O<id>** <needle> — <where it must be gone, or why it may stay>`, one per
entity the plan changes.

The lead lines above are written with `<id>` and `<path>` placeholders on
purpose. A plan that documents this grammar — this spec, the role files, the
note — contains text shaped exactly like a lead line, and a parser that scans
for the shape will try to resolve the documentation as a passage. Measured
while writing this spec: a first draft used a concrete `**P3.2**` with a real
path in the illustration and a hand-written pre-flight reported it as a block
with the wrong line count against a file it does not appear in. Two rules
follow, and both are mechanical:

- a lead whose id or path is a `<...>` placeholder is documentation and is
  skipped;
- **a lead inside a fenced block is not a lead.** A lead is by construction the
  line *before* a fence, so one that appears *within* one is text — an example,
  or a test fixture. This is the rule the instrument's own tests need: `lint`'s
  fixtures are plans containing leads, and without it the test file would be
  parsed as a plan. The fixtures also number their ids from 90 upward, so that
  a fixture id can never collide with a real task's;
- a lead is resolved only inside a **task body**, which is the text under a
  heading matching `^### Task <n>` or `^## Task <n>` — the shapes
  superpowers' writing-plans produces. `lint` **fails** when it finds zero task
  headings, rather than reporting success over zero blocks. That failure mode
  is issue-5e47's hazard by name, and a script that depends on a plan's shape
  must say so out loud rather than pass quietly when the shape changes.

### The four subcommands

| Subcommand | What it does | What it closes |
| --- | --- | --- |
| `lint --plan <path>` | Parses only. Every lead line well-formed; every `N` equal to its block's real line count; every id unique; every id cited in prose present as a block; every anchor step stating both values; every insertion carrying an anchor step; and **no `O` needle occurring anywhere in the plan's own new-passage text** — a needle the plan's replacement text contains cannot detect the change it was written for, and returns the same count after the plan as before. | issue-88d3's count half, issue-f813's citation rule, issue-10bc's needle trap |
| `replay --plan <path> --base <ref>` | Copies the base blobs to a temporary tree and applies each passage, asserting each old passage occurs **exactly once**. Then re-runs each anchor command against the applied copy and compares the result with its stated `after:` value. Then runs the plan's commands in order against that tree, printing each output beside its stated expectation — **skipping any command that invokes `passage-check.js verify`**, because `verify` reads the working tree and `replay` has already made that check against its own. Then runs every `O` needle against the applied tree and prints every residual hit. | issue-88d3's anchor half, issue-7481's command-runner half, issue-10bc |
| `diff --plan <path> --base <ref>` | Every added line of `git diff <base>` must be text the plan literally quotes; lists the added lines that are not, and the removed lines outside any fenced block. A path the plan declares as created is exempt — its lines are accounted for by construction — and the exemption is read from the plan's `created:` list, never inferred. Needs only the plan and `git`. | issue-7481's core |
| `verify --plan <path> --task <N>` | What a task's Verify step invokes, against the working tree: each of task `N`'s new passages present exactly once, each of its anchors at its stated `after:` value, and `diff` scoped to the files task `N` touches. | D-6 |

`replay` reconstructs; `diff` classifies. They prove the same thing from
opposite sides, and only `diff` survives the session that wrote it, which is
the whole of issue-7481: the context-cost run's application script lived in a
scratchpad under another session's id and was gone by the last boundary, the
one that most needs the check.

### Files the plan creates

A plan that adds a file has nothing for `diff` to match its lines against, and
every one of them is an added line of the merge-base diff. So the plan states,
once, in its Global Constraints:

```text
created: skills/tanto/scripts/passage-check.js
created: skills/tanto/scripts/passage-check.test.js
```

`diff` exempts those paths and says so in its output — `2 paths exempt as
created`, naming them — rather than passing them silently, so that a reader
sees what was not checked. `verify --task <N>` reports "no passages" for a task
that touches only created paths, which is a result and not a failure. The
alternative, carrying each new file as a `W` block, is available in the grammar
and is not used here: transcribing a program byte for byte into a plan buys
nothing its own tests do not already prove, and it would put the largest task
in the plan at several hundred lines for no verification gain (issue-7281).

### Exit codes, and what counts as a failure

Under D-6 a task's Verify step **is** one invocation of `verify`, and a Verify
step that cannot fail is not a check. Each subcommand exits `0` only when
everything it checked held.

| Subcommand | Exits non-zero when |
| --- | --- |
| `lint` | any lead is malformed; any `N` disagrees with its block; any id repeats; any cited id has no block; any insertion has no anchor step; any anchor omits a value; **or zero task headings were found** |
| `replay` | a passage's old block matches other than the stated number of times; an applied anchor disagrees with its `after:` value; a command's output differs from its stated expectation |
| `diff` | any added line outside a `created:` path is not quoted by the plan, or any removed line falls outside every fenced block |
| `verify` | a task's new passage is absent or present more than once, or one of its anchors disagrees with its `after:` value |

A residual `O` hit is the exception and exits `0`: the old-value sweep is
adjudicated, not decided — Sekkei rules each hit as "this becomes a passage" or
"unchanged, and why" — so `replay` prints the hits under a heading that names
their count and leaves the judgment where issue-10bc puts it.

**Exit `2` is a broken invocation, distinct from a check failure's `1`**, so
that a script that could not run is never read as a clean tree: an unresolvable
`--base`, an absent `git`, an unreadable plan, a missing required option, and
an unknown or absent subcommand. `2` also carries a usage line to stderr.

The module's exported surface and whether it guards on `require.main` are the
implementer's, not the spec's: nothing outside the file imports it today, and
its tests may import it or invoke it as a program. The plan records which was
chosen so that a later change is a change and not a discovery.

### Module format

CommonJS with `require`, because there is no `package.json` and a bare `.js`
file is CommonJS to Node. The test file follows the same choice. Stating it
removes the one ambiguity that would otherwise cost an implementer a run:
`import` in that file is a runtime error, not a lint finding.

Two rules the parser enforces because prose cannot: a count is written only
where a command consumes it, and a block appears once. The context-cost run
landed six count defects — a step's expected counts, four "the N that follow"
leads, and a baseline off by one — and a dry run that applied 72 of 72
passages caught none of them, because it applies blocks and runs commands and
does not audit prose about them.

### What this plan can and cannot use

The script lands in this plan's own batch A, and the plan is reviewed before
batch A runs. So:

- **Sekkei's Step 4 for this plan uses the old agent dry run.** The script
  does not exist when the plan is reviewed.
- **This plan's Verify steps are written out by hand**, under the old
  convention. D-6's convention binds the next plan.
- **This plan does adopt the authoring half of issue-f813 now**, because it
  needs no script: every block appears exactly once, and a later task cites a
  block by its id instead of re-quoting it.
- **Jisso runs `diff` at the batch B and batch C boundaries.** That is the
  instrument's first dogfood, and the batch B boundary is the first moment it
  can happen.

This answers Kanri's note 1 — the plan that fixes the passage conventions is
the first to use the fixed form where the fixed form does not depend on the
thing it is building, and says plainly where it does not.

## 2. Kanri and the contract

### `skills/tanto/roles/kanri.md`, the handover trigger

**P-K1** `skills/tanto/roles/kanri.md` — replace exactly these 26 lines

```text
### The trigger

Two signals fire a handover. Check them at every boundary: at loop step 6 while
a plan is in flight, and, between plans, at the start of every turn you get — a
message, or the human speaking. Run the self-check of `SKILL.md`'s Resuming at
the same points — one `ListAgents`; a name that is not your row's means you
were resumed, and the roster's first row is rewritten before anything else.

1. **The human's word.** Always, and it overrides the residency line.
2. **A compaction noticed.** Your context now begins with a summary of earlier
   conversation instead of the conversation itself, or a ruling the ledger
   holds is one you do not remember making. State lives in files, so a
   compaction loses nothing the successor cannot read back; it is the harness's
   own signal that the session has grown long, and it is the one signal a
   session can see for itself.

Not the `tokens left` figure the harness prints in its reminders, whose
unit is not documented as the context window and whose presence is not
guaranteed; not a batch or plan count, for which the data points are still
few; and not a threshold on the reading, because none has been chosen. At
every check take your own reading (`SKILL.md`, "The transcript reading")
and rewrite your Residency row with it: a compactions figure of `1` where
you noticed none is the second signal, seen in a file, and counts as
noticed. The Residency rows, and the archive's rows across runs, are the
data a threshold on cost will be chosen from, by an ADR, once enough
sessions have ended (issue-40ed).
```

**P-K1 →**

```text
### The trigger

Three signals fire a handover. Check them at every boundary: at loop step 6
while a plan is in flight, and, between plans, at the start of every turn you
get — a message, or the human speaking. Run the self-check of `SKILL.md`'s
Resuming at the same points — one `ListAgents`; a name that is not your row's
means you were resumed, and the roster's first row is rewritten before
anything else.

1. **The plan close**, and this is the ordinary one. After T2, the merge
   decision, the peers' deletion, and the archive move, the handover runs:
   without a threshold, and without asking (decision-b6cb). The close is the
   moment with nothing in flight and the record complete, and a resident
   session's per-turn cost is its age, so the reset is a planned step and not
   a question put to the human once a plan (req-04f5).
2. **The human's word.** Always, and at any boundary.
3. **A compaction noticed.** Your context now begins with a summary of earlier
   conversation instead of the conversation itself, or a ruling the ledger
   holds is one you do not remember making. State lives in files, so a
   compaction loses nothing the successor cannot read back; it is the harness's
   own signal that the session has grown long, and it is the one signal a
   session can see for itself.

Signal 3 is the mid-plan case; signal 2 is any time at all, and a human who
says "continue" at a plan close declines that close's handover the way the
Handover section already describes. Not the `tokens left` figure the
harness prints in its reminders, whose unit is not documented as the context
window and whose presence is not guaranteed; and not a threshold on the
reading, because the plan close arrives first in practice and no number was
needed. At every check take your own reading (`SKILL.md`, "The transcript
reading") and rewrite your Residency row with it: a compactions figure of `1`
where you noticed none is signal 3, seen in a file, and counts as noticed. The
Residency rows, and the archive's rows across runs, are the data a threshold
for **replacing a peer** will be chosen from, by an ADR, once enough sessions
have ended (issue-40ed's other half; its handover half closed with
decision-b6cb).
```

### `skills/tanto/roles/kanri.md`, the residency line

**P-K2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
At every plan close, and whenever the human asks, print one of two lines to the
human. The `[<ref>]` is the identity; the human copies the bare name into the
next `/tanto <role> <name>`.
```

**P-K2 →**

```text
At every plan close, and whenever the human asks, print one of two lines to the
human. At a plan close it is always the second, because the close is itself a
handover trigger; "Kanri stays" is only ever the answer to the human's own
mid-plan question. The `[<ref>]` is the identity; the human copies the bare
name into the next `/tanto <role> <name>`.
```

The two-line code block below this paragraph is unchanged: both forms survive,
and only which one a plan close prints is fixed.

### `skills/tanto/roles/kanri.md`, the exit shoroku's two lines

**P-K3** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>` with
   `notify_when_idle: true`. The path is
```

**P-K3 →**

```text
1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
```

**P-K4** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   `exit-<role>[-<suffix>]-direction.md`. Then send
   `exit: direction at <path>` with `notify_when_idle: true`.
```

**P-K4 →**

```text
   `exit-<role>[-<suffix>]-direction.md`. Then send
   `exit: direction at <path>`, again without a subscription.
```

**P-K5** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
A session that has not answered when its idle notice arrives is past answering:
treat the exit as forced, write a roster Events line saying its exit shoroku
did not run and what was lost as far as you know, ask the human to delete it,
and continue. The same Events line goes in whenever you mark a row `dead`.
```

**P-K5 →**

```text
A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the session is gone, or
your window wakes for another reason and the answer has not arrived. Treat the
exit as forced, write a roster Events line saying its exit shoroku did not run
and what was lost as far as you know, ask the human to delete it, and continue.
The same Events line goes in whenever you mark a row `dead`.
```

The measurement behind P-K3 to P-K5, for the record: two Sekkei exits ran under
the rule that kept the subscription on the `exit:` lines, and produced four idle
notices at a Kanri holding about 5 MB of transcript, none of them the
forced-exit signal — both sessions answered every line normally and every notice
arrived after its answer (issue-d725).

### `skills/tanto/roles/kanri.md`, the plan-close row

**P-K6** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed; Kanri stays, prints the residency line, marks `dead` the rows of the sessions deleted at this close, moves the dead, replaced, and refused rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — fills the ledger's Measurements fixed row, and waits for the next topic |
```

**P-K6 →**

```text
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed; mark `dead` the rows of the sessions deleted at this close, move the dead, replaced, and refused rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's Measurements fixed row, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

### `skills/tanto/roles/kanri.md`, residency and the two directories

**P-K7** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```text
You are resident. A plan's end is a boundary like any other, and the next topic
starts with a new topic directory and a new ledger under the same roster,
cold-read as if fresh. Your only exit is the Handover section above.

After T2 and the merge decision, also ask the human whether to delete
`.superpowers/sdd/<plan-basename>/`. Jisso never deletes it, and the roster
stays either way.
```

**P-K7 →**

```text
The role is resident; the session that carries it is not. A plan's end is a
boundary like any other for the run, and the next topic starts with a new topic
directory and a new ledger under the same roster, cold-read as if fresh —
normally by your successor, because the close hands the role over
(decision-b6cb), and by you when the human declines that handover. Your only
exit is the Handover section above.

Neither `.superpowers/sdd/<plan-basename>/` nor the topic directory beside it is
deleted at the close, and you ask the human about neither. After T2 the two have
the same standing: untracked, local to one machine, and useful only for a later
re-read (issue-12d3).
```

### `skills/tanto/roles/kanri.md`, the batch loop reads a measurement report

**A-K8** `skills/tanto/roles/kanri.md` — `grep -c 'adopt or reject each shoroku candidate per the adoption rule' skills/tanto/roles/kanri.md` — before: 1, after: 1

**P-K8** `skills/tanto/roles/kanri.md` — insert after these 2 lines

```text
   adopt or reject each shoroku candidate per the adoption rule, and update the
   ledger's `S-n` table, its Batches row, and its Progress line.
```

**P-K8 →**

```text

   A **measurement** report — one whose deliverable is what a tool actually did
   — is read for whether its outcome **contradicts** the brief's prediction. A
   real run usually does, somewhere; a report that confirms every expectation
   deserves a second look rather than a faster approval, because a
   reconstruction is built from the same brief the prediction came from
   (issue-f2ec).
```

### `skills/tanto/SKILL.md`, no line carries a subscription

**P-S1** `skills/tanto/SKILL.md` — replace exactly these 10 lines

```text
- Kanri sends batch prompts and Kaiseki briefs **without** an idle
  subscription and waits for the receiver's one-line report. It subscribes —
  a pure `notify_when_idle`, no message — only when an expected signal is
  overdue, which is the human's observation or a wake-up for another reason,
  since a session holding no subscription has no clock; and it treats a
  notice that arrives before the report as a reason to check the workspace,
  never as the signal: a peer's turn ends whenever it dispatches a subagent,
  so most notices are false idles. The exit lines keep their
  `notify_when_idle: true`, because there the idle notice is the forced-exit
  signal by design.
```

**P-S1 →**

```text
- Kanri sends every line **without** an idle subscription — batch prompts,
  Kaiseki briefs, and the `exit:` lines alike — and waits for the receiver's
  one-line report. It subscribes — a pure `notify_when_idle`, no message —
  only when an expected signal is overdue, which is the human's observation
  or a wake-up for another reason, since a session holding no subscription
  has no clock; and it treats a notice that arrives before the report as a
  reason to check the workspace, never as the signal: a peer's turn ends
  whenever it dispatches a subagent, so most notices are false idles. The
  `exit:` lines carried a subscription until 2026-09-10, on the reasoning
  that there the idle notice is the forced-exit signal; measured, it woke
  Kanri four times across two exits and signalled nothing, because both
  sessions answered normally and every notice arrived after its answer
  (issue-d725).
```

**P-S2** `skills/tanto/SKILL.md` — replace exactly these 10 lines

```text
The lines, each sent with `notify_when_idle: true`. Kanri sends
`exit: propose your shoroku; write it to <path>`; the session answers with one
line and the path; Kanri sends `exit: direction at <path>`; the session answers
`exit write-out committed: <subject> — <reading>` or
`exit write-out: nothing accepted — <reading>`. A
session that has not answered when its idle notice arrives is past answering:
Kanri treats the exit as forced — the roster's Events line says the exit
shoroku did not run and what was lost, as far as Kanri knows — asks the human
to delete it, and continues. Jisso idles through another session's exit; the
cost is one boundary.
```

**P-S2 →**

```text
The lines, each sent without an idle subscription, like every other tanto line.
Kanri sends
`exit: propose your shoroku; write it to <path>`; the session answers with one
line and the path; Kanri sends `exit: direction at <path>`; the session answers
`exit write-out committed: <subject> — <reading>` or
`exit write-out: nothing accepted — <reading>`. A session that has stopped
answering is past answering, and Kanri learns it the way it learns of a missing
batch report — the human says the session is gone, or Kanri's window wakes for
another reason and the answer has not arrived. Kanri then treats the exit as
forced — the roster's Events line says the exit shoroku did not run and what
was lost, as far as Kanri knows — asks the human to delete it, and continues.
Jisso idles through another session's exit; the cost is one boundary.
```

### `skills/tanto/SKILL.md`, both directories stay

**P-S3** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
`.superpowers/sdd/<plan-basename>/` outlives the SDD run. Jisso never deletes
it. After T2 and the merge decision, Kanri asks the human whether to delete it.
```

**P-S3 →**

```text
`.superpowers/sdd/<plan-basename>/` outlives the SDD run, and so does the topic
directory beside it. Jisso never deletes either, and nothing asks the human to
delete either: after T2 the two have the same standing — untracked, local to one
machine, useful only for a later re-read — and disk is the only cost
(issue-12d3).
```

### `skills/tanto/SKILL.md`, what `mode=` can say

**P-S4** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
`mode=` is what you can see about your own permission mode — `auto` when your
system prompt says auto mode is active, otherwise `unknown`. It is advisory.
```

**P-S4 →**

```text
`mode=` is what you can see about your own permission mode — `auto` when your
system prompt says auto mode is active, otherwise `unknown`. It is advisory,
and `unknown` is the measured ceiling rather than a gap: a session outside auto
mode carries no statement of which mode is active, only the harness's line that
tools run behind a user-selected one, so nothing better than `unknown` can be
reported and Kanri's warning stays keyed on the absence of `auto` (measured
2026-09-10, issue-15bf).
```

### `skills/tanto/SKILL.md`, the skill ships one executable

**A-S5** `skills/tanto/SKILL.md` — `grep -cF 'Templates are copied and filled, never restated in prose.' skills/tanto/SKILL.md` — before: 1, after: 1

**P-S5** `skills/tanto/SKILL.md` — insert after these 1 lines

```text
`templates/review-brief.md`, and `templates/tanto.json`.
```

**P-S5 →**

```text

The skill also ships one executable, `scripts/passage-check.js`: the instrument
a plan that carries passages checks itself with, run by Sekkei in place of an
agent dry run, by Jisso at every batch boundary, and by the whole-branch
reviewer. It is Node with no dependencies, its tests are beside it and run by
`node --test`, and `roles/sekkei.md` and `roles/jisso.md` name its subcommands.
```

### The two places the first old-value sweep missed

Both were found after the passages above were written: one by Kanri's
role-procedure check, one by a second, wider sweep run because of it. Neither
contains a term this plan introduces, which is precisely issue-10bc's point —
a sweep for what a plan adds is not a sweep for what it contradicts — and both
are recorded in the table further down with the needle that would have found
them.

`templates/kanri-handover.md` enumerates the trigger set in the blank the
outgoing Kanri fills. Today's handover, which ran under decision-b6cb, had to
write the plan close into a blank that does not offer it.

**P-H1** `skills/tanto/templates/kanri-handover.md` — replace exactly this 1 line

```text
<The trigger that fired — the human's word, or a compaction noticed — and when.>
```

**P-H1 →**

```text
<The trigger that fired — the plan close, the human's word, or a compaction noticed — and when.>
```

`roles/jisso.md`'s "What tanto overrides" table states the workspace rule from
Jisso's side, and its third column carries the deletion question issue-12d3
removes. P-S3 and P-K7 alone would have left Jisso's copy contradicting both.

**P-J3** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```text
| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the conductor ledger, the reports, and the T2 source; Kanri asks the human about it after T2 and the merge decision |
```

**P-J3 →**

```text
| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the conductor ledger, the reports, and the T2 source; nobody deletes it at the close, and the topic directory beside it stays on the same terms (issue-12d3) |
```

### The three the second sweep missed, and the two seats issue-7481 had not reached

The spec review found three more old values and two unreached seats. All three
old values sit in files that carry **no other passage of this plan**, which is
the sharpest form of issue-10bc yet seen: a file with a passage gets read
anyway; a file without one is never opened unless a needle reaches it. All
three are also **closed enumerations** — a sentence that counts or lists —
which is the shape every miss in this spec has had.

`templates/roster.md` still tells its reader that the archive feeds a threshold
for the handover, which decision-b6cb closed.

**P-T1** `skills/tanto/templates/roster.md` — replace exactly these 2 lines

```text
above, and it is the archive's rows across runs that a threshold for the
handover or a replacement will be read from (issue-40ed).
```

**P-T1 →**

```text
above, and it is the archive's rows across runs that a threshold for replacing
a peer will be read from (issue-40ed's other half; the handover half closed
with decision-b6cb, which made the plan close the ordinary trigger).
```

`roles/kanri.md`'s brief form check counts a point's parts, and `P-R2` adds a
fourth. This is the mechanism that would enforce the new clause, so leaving it
would have closed issue-867f in the template and left it unenforced.

**P-K9** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   unsettled line saying whether an answer is needed; every point in its
   three parts — the two before `See:` and the pointer after it, which may
   carry the ` — ` separator, as a plan's task headings do; every pointer the
```

**P-K9 →**

```text
   unsettled line saying whether an answer is needed; every point in its
   parts — the two before `See:`, then the pointer, and on a choose or decide
   point the `— If unanswered:` clause after it, so three parts or four, any
   of which may carry the ` — ` separator, as a plan's task headings do; a
   choose or decide point without that clause failing the check; every pointer
   the
```

The review-brief template's form-marker list is the one place a writer reads to
learn what not to translate, and `P-R2` declares a new marker without adding it
there.

**P-R4** `skills/tanto/templates/review-brief.md` — replace exactly these 4 lines

```text
renders. The form markers are the exception and stay exactly as they are
here: the bracketed tag words `confirm`, `choose`, `decide`, `nothing`, the
labels `Q:`, `A:`, `Serves:`, `Adds or changes:`, `See:`, the `## <n>.`
numbers, and the pointer after `See:`. The brief selects and renders; it does
```

**P-R4 →**

```text
renders. The form markers are the exception and stay exactly as they are
here: the bracketed tag words `confirm`, `choose`, `decide`, `nothing`, the
labels `Q:`, `A:`, `Serves:`, `Adds or changes:`, `See:`,
`— If unanswered:`, the `## <n>.` numbers, and the pointer after `See:`. The
brief selects and renders; it does
```

`roles/jisso.md`'s verification section opens by asserting that a tanto plan has
no test suite. Batch A ships one.

**P-J4** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```text
subagent-driven-development's dispatch templates assume a test suite. A plan
that produces Markdown — a skill, a document set, a template pack — has none,
and its equivalents differ in kind. Substitute these, and say so in every
```

**P-J4 →**

```text
subagent-driven-development's dispatch templates assume a test suite. A plan
that produces Markdown — a skill, a document set, a template pack — usually has
none, and its equivalents differ in kind. A plan that also ships code has a real
one, and then both apply: the suite for the code, on the runtime version the
plan pins, and the substitutes below for everything else. Substitute these, and
say so in every
```

Two of issue-7481's four seats had no passage. The whole-branch review is
Kanri's dispatch, not Jisso's, which is why the instrument for it lands in
`roles/kanri.md` — and `P-S5` was asserting a capability the tree would not
have supported.

**A-K12** `skills/tanto/roles/kanri.md` — `grep -cF 'commissions its own final review.' skills/tanto/roles/kanri.md` — before: 1, after: 1

**P-K12** `skills/tanto/roles/kanri.md` — insert after these 2 lines

```text
   commissions its own final review. Anything else you dispatch takes
   `subagents.default`.
```

**P-K12 →**

```text

   For a plan that carries passages, give that reviewer the plan, the merge
   base, and one command —
   `node skills/tanto/scripts/passage-check.js replay --plan <path> --base <merge base>`
   — so that the replay it would otherwise rebuild by hand is the instrument
   Sekkei and Jisso already ran (issue-7481). Its report says what the replay
   printed, and the review seat goes to the cross-file contracts and the
   human-facing questions, which no script judges.
```

`roles/sekkei.md`'s "how a batch is verified" bullet knows only about a plan
that ships Markdown. This plan is the first to ship code, and the first whose
boundary check is a command rather than a set of greps.

**P-E3** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```text
- **how a batch is verified**. For a plan that ships Markdown, that section
  names lint on the changed paths by name, the content greps, a real YAML load
  of any frontmatter, and a JSON parse of any JSON the plan writes;
```

**P-E3 →**

```text
- **how a batch is verified**. For a plan that ships Markdown, that section
  names lint on the changed paths by name, the content greps, a real YAML load
  of any frontmatter, and a JSON parse of any JSON the plan writes; for a plan
  that ships code, the test command together with the runtime version it is
  pinned to, so that a version claim is a run and not an assertion; and for a
  plan that carries passages,
  `node skills/tanto/scripts/passage-check.js diff` as the boundary check,
  which is what makes that check outlive the session that wrote it
  (issue-7481);
```

### The handover procedure gains the plan close as a third case

`P-K1` makes the plan close a trigger, but the procedure the trigger routes
into was written for two cases and the close is a third. Two of its steps say
the wrong thing at a close: step 1 says the exit shoroku is already done, which
is true only at a batch boundary, and step 3 overwrites the ledger's Progress
line with "handover written" — the very line the delete-table row `P-K6`
rewrites is keyed on ("the ledger's Progress line says closed"). The routing
sentence above them speaks of "the two procedures".

**P-K13** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
Which of the two procedures follows is decided by whether a ledger is open.
```

**P-K13 →**

```text
Which procedure follows is decided by whether a ledger is open. A plan close
has one open until you close it, so it takes the in-plan procedure with the two
exceptions steps 1 and 3 name.
```

**P-K10** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku": propose to
   yourself from the ledger and the roster, not from recollection, escalate to
   the human, write, lint, commit once, and mark the `S-n` rows written. What
   you cannot reconstruct goes into the handover file's "Not reconstructed"
   section. In a plan this step is loop step 6's proposal and step 7's slot (b)
   commit, already done when the window reaches this list; between plans it is
   one act and the commit lands on `main`.
```

**P-K10 →**

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku": propose to
   yourself from the ledger and the roster, not from recollection, escalate to
   the human, write, lint, commit once, and mark the `S-n` rows written. What
   you cannot reconstruct goes into the handover file's "Not reconstructed"
   section. At a **batch boundary** this step is loop step 6's proposal and
   step 7's slot (b) commit, already done when the window reaches this list. At
   a **plan close** it is a fresh act, run after T2, the merge decision, the
   peers' deletion and the archive move, and its commit lands on the plan's
   branch (decision-b6cb). **Between plans** it is one act too, and the commit
   lands on `main`.
```

**P-K11** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
3. **In a plan**, set the ledger's Progress line to "handover written".
   **Between plans**, there is no ledger, so write "handover written by
   `<name> [<ref>]`" as a roster Events line instead.
```

**P-K11 →**

```text
3. **At a batch boundary**, set the ledger's Progress line to "handover
   written". **At a plan close** that line already says "closed", which the
   delete table's row keys on, so leave it and record "handover written by
   `<name> [<ref>]`" as a roster Events line. **Between plans** there is no
   ledger, and that Events line is the only record.
```

## 3. The roles that author and execute a passage plan

### `skills/tanto/roles/sekkei.md`, Step 3 — the block conventions

**P-E1** `skills/tanto/roles/sekkei.md` — replace exactly these 4 lines

```text
A plan that carries passages rather than whole files wraps each new passage
at its destination file's column, chosen when the block is authored, and
states each passage's shape — a replacement of an old passage, or an
insertion next to an anchor that stays.
```

**P-E1 →**

```text
A plan that carries passages rather than whole files wraps each new passage
at its destination file's column, chosen when the block is authored, and
writes every block in the shape `scripts/passage-check.js` parses, so that the
plan is machine-checkable and not only readable:

- a replacement is `**P<task>.<n>** <path> — replace exactly these <N> lines`,
  the old block, then `**P<task>.<n> →**` and the new block; an insertion says
  `insert after these <N> lines` and its new block omits the anchor lines,
  because an insertion's anchor stays;
- an anchor step is
  `**A<task>.<n>** <path> — <command> — before: <v>, after: <v>`, both values
  stated always: an anchor check inverts only when the new passage wholly
  supersedes the needle, and when the needle is the passage's unchanged
  opening it still returns `1` after a correct edit;
- an old value the plan contradicts is
  `**O<task>.<n>** <needle> — <where it must be gone, or why it may stay>`,
  one per **entity** the plan changes — for a column added, the sentences that
  list the columns; for a template added, "There are ten"; for a file renamed,
  its old name. Write these before the passages, not after, and from the
  entity rather than from the new text: a set whose cardinality changes is
  reached by no new term at all, and a rule two role files state in different
  words needs both spellings as needles. Sweep the files the plan does **not**
  touch first — a file with a passage gets read anyway. **A needle must span
  the point where the text changes**: where a passage *inserts* into a phrase,
  every substring of the old phrase that avoids the insertion point survives
  the edit and returns the same count afterwards, which reads as "not fixed"
  or, worse, "already gone". `lint` checks this by searching the plan's own
  new-passage text for each needle. **Run each needle as you write it** — one
  that wraps in its target returns `0`, and `0` reads as "already gone".
  Record the raw count and the disposition of each hit, not one verdict. A
  sweep for the terms a plan introduces is not a sweep for the prose those
  terms contradict, and only this one catches the second (issue-10bc).

Each block appears **once**; a later task that needs one cites it by its id and
does not re-quote it. A count in prose is written only where a command consumes
it. Every Verify step of a task is one invocation,
`node skills/tanto/scripts/passage-check.js verify --plan <path> --task <N>`,
rather than commands you write out: the needles, the anchor values, and the
line counts are all determined by the blocks, so writing them again only
creates something that can drift from them (issue-f813).

The plan's Self-Review states the largest task's line count and step count, and
says whether any task is a **sweep-and-check** shape — one whose deliverable is
recorded output rather than a file. Size has two components, and the second
costs on both the implementer's seat and the reviewer's, because a
verification-only deliverable inverts the reviewer's standing instruction. No
threshold is set: the sizes are recorded until one can be chosen (issue-7281).
```

### `skills/tanto/roles/sekkei.md`, Step 4 — the dry run is the script

**P-E2** `skills/tanto/roles/sekkei.md` — replace exactly these 6 lines

```text
1. Run every verification command the plan states, once, on this machine, on
   scratch copies with the passages applied, and write
   `.superpowers/sdd/<topic>/plan-dryrun.md`: the application script's path,
   then each command, its output, and the plan's expectation. A command that
   has never been run is a placeholder in a command's shape; fix the plan,
   not the expectation.
```

**P-E2 →**

```text
1. Run `node skills/tanto/scripts/passage-check.js lint --plan <path>`, then
   the same script's `replay --plan <path> --base <merge base>`, and write
   `.superpowers/sdd/<topic>/plan-dryrun.md` from what they print: the two
   commands, each one's output, and your ruling on every failure. `lint`
   checks the plan against itself — the lead lines, each `N` against its
   block's real line count, the ids' uniqueness, that every cited id exists,
   that every anchor states both of its values. `replay` applies the passages
   to copies of the merge-base blobs, asserting that each old passage occurs
   exactly once; re-runs each anchor against the applied copy and compares the
   result with its stated `after:` value, which a dry run that applies and
   then verifies can never test (issue-88d3); runs the plan's commands in
   order with each output beside its expectation; and prints every residual
   hit of the plan's `O` needles. A command that has never been run is a
   placeholder in a command's shape; fix the plan, not the expectation. The
   script prints failures and does not interpret them: deciding which are plan
   defects and which are artifacts of this machine is yours, and stays yours.
```

Step 4's items 2 to 5 are unchanged. The reviewer still reads the dry-run
report and spot-checks rather than re-running the set (issue-7d14's rule), and
the forward-reference sweep of item 3 still decides whether a boundary the plan
calls safe really is.

### `skills/tanto/roles/jisso.md`, the boundary check

**A-J1** `skills/tanto/roles/jisso.md` — `grep -c 'because the output is the deliverable.' skills/tanto/roles/jisso.md` — before: 1, after: 1

**P-J1** `skills/tanto/roles/jisso.md` — insert after these 2 lines

```text
inverts the reviewer's standing instruction: tell the reviewer to re-run the
checks rather than trust the report, because the output is the deliverable.
```

**P-J1 →**

```text

For a plan that carries passages, run
`node skills/tanto/scripts/passage-check.js diff --plan <path> --base <merge base>`
at every batch boundary, before you report. It prints the added lines of the
merge-base diff that the plan does not literally quote, and the removed lines
that fall outside any fenced block; both sets must be empty, or accounted for
in your report. It needs only the plan and `git`, so unlike an application
script written into some other session's scratchpad it is still there at the
last boundary — the one that most needs it (issue-7481).
```

### `skills/tanto/roles/jisso.md`, a measurement task's dispatch

**A-J2** `skills/tanto/roles/jisso.md` — `grep -c '^## Fix rounds and the Kaiseki trigger$' skills/tanto/roles/jisso.md` — before: 1, after: 1

**P-J2** `skills/tanto/roles/jisso.md` — insert before these 1 lines

```text
## Fix rounds and the Kaiseki trigger
```

This is the block that made the grammar grow a fourth shape. A new section that
must precede an existing heading has no anchor but that heading, and the first
draft wrote `insert after` with the direction corrected only in prose — which
`replay` does not read, so it would have reconstructed the section in the wrong
place and `verify` would have passed the wrong edit. `P-J1` inserts into the
same two-line gap; `P-J1` runs first, so its text sits above `P-J2`'s heading.

**P-J2 →**

```text
## A measurement task's dispatch

A task whose deliverable is a **measurement** — run a tool, record what it did
— has a failure mode that a task which only produces files does not: the
implementer can stop running the tool and start predicting it, and the
prediction looks exactly like a real run, because it is built from the same
brief the reviewer holds. Say this in the dispatch, in so many words:

- every byte written is either what the tool produced or a documented fallback
  applied from the plan's own blocks, and nothing is written from what the tool
  was expected to produce;
- a fallback is a sanctioned outcome, to be named in the report — never
  something to be ashamed of or to paper over;
- "execute the procedure directly", where the plan offers it as a fallback
  route, means **carry it out against the tree**, not predict its output.

Read the report back for the same thing. A measurement that contradicts the
brief's prediction somewhere is what a real run usually looks like; one that
confirms every expectation deserves a second look rather than a faster
approval. Neither half is enforcement — an implementer can always lie — but the
first removes the ambiguity that made simulating look like compliance, and the
second gives the reader something to check other than the report's own
confidence (issue-f2ec).
```

### `skills/tanto/templates/review-brief.md`, a decide point's default

**P-R1** `skills/tanto/templates/review-brief.md` — replace exactly these 3 lines

```text
`all OK` confirms every point tagged confirm at once, and a point tagged
confirm or nothing that goes unmentioned counts as confirmed; a point tagged
choose or decide needs its own line, and an unanswered one stays open.
```

**P-R1 →**

```text
`all OK` confirms every point tagged confirm at once, and a point tagged
confirm or nothing that goes unmentioned counts as confirmed. A point tagged
choose or decide needs its own line; when it goes unanswered, what the point
names after `— If unanswered:` is what it selects, so that you see before
answering what your silence will choose. A choose or decide point carrying no
such clause is a defective brief: it stays open, and Sekkei asks for it on its
own line rather than reading a default into it.
```

**A-R2** `skills/tanto/templates/review-brief.md` — `grep -c 'For a spec, section 5' skills/tanto/templates/review-brief.md` — before: 1, after: 1

**P-R2** `skills/tanto/templates/review-brief.md` — insert after these 2 lines

```text
one line each. For a spec, section 5's body is the single rendered line
`not applicable — a spec`.
```

**P-R2 →**

```text

Every point tagged **choose** or **decide** ends with `— If unanswered: <what>`
after the pointer. For a **decide** point it names the document's own answer
where one exists, and otherwise the recommendation Sekkei states with the
brief; for a **choose** point it names one of the options the point lists. The
clause is the writer's, it is rendered in the chat's language like the rest of
the point, and the marker `— If unanswered:` itself is a form marker and stays
as it is. The unsettled section's `decide` lines carry it too; they have no
pointer, so it follows the line's own trailing clause instead (issue-867f).
```

The four point templates in sections 1, 2, 4 and 5 gain the optional clause, so
that a writer copying the template sees where it goes. Each of the four is the
same one-line replacement, differing only in its section:

**P-R3** `skills/tanto/templates/review-brief.md` — replace all 4 occurrences of this 1 line

```text
1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>
```

**P-R3 →**

```text
1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section> — If unanswered: <what, on a choose or decide point only>
```

The clause is written out rather than bracketed. On this same line `[...]`
already means "pick one of these tag words", so a bracketed
`[ — If unanswered: <what>]` would make one line use the same punctuation for
two meanings and would read as optional the clause `P-R2` makes mandatory — the
exact ambiguity that leaves issue-867f half-closed.

This is the one block in this plan whose needle occurs more than once on
purpose. Its task replaces all four occurrences and the Verify step counts
four; `passage-check.js lint` would reject a `replace exactly these N lines`
block that matches four times, so the plan states this one as a
**global replacement**, with its occurrence count in the lead.

## 4. The note and the README

Two files outside `skills/tanto/` change, and neither carries a design
decision of its own.

`docs/notes/tanto-consistency-checks.md` is the note that governs how a plan
editing `skills/tanto/` verifies itself. Its "Six things a passage plan's pass
needs that a whole-file plan's does not" list, and its checks 1 and 2, are
where `scripts/passage-check.js` belongs: the diff form it already describes is
what the script's `diff` subcommand implements, and the reconstruct-and-compare
it already calls the strongest check is what `replay` implements.

Its passages are carried here like every other file's. A first draft described
this task in prose — "adds the script to check 1's layout list and to check 2's
in-skill path set" — and that description hid three things a task would have
had to invent: two counts stated in prose, and a **regex change**, because
every alternative of check 2's extraction ends in `\.md` or `\.json` and the
test file's stem contains a dot. design-4807's rule applies exactly — a
qualifier that lives in the spec's prose but not in its fenced block never
reaches the runtime file.

**P-N1** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
  skills/tanto/templates/tanto.json 2>&1
```

**P-N1 →**

```text
  skills/tanto/templates/tanto.json \
  skills/tanto/scripts/passage-check.js \
  skills/tanto/scripts/passage-check.test.js 2>&1
```

**P-N2** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
Expected: all seventeen paths listed, no `No such file or directory`.
```

**P-N2 →**

```text
Expected: all nineteen paths listed, no `No such file or directory`.
```

**P-N3** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
grep -oh 'roles/[a-z]*\.md\|templates/[a-z-]*\.md\|templates/tanto\.json\|skills/tanto/[a-z/-]*\.md\|skills/tanto/[a-z/-]*\.json' \
```

**P-N3 →**

```text
grep -oh 'roles/[a-z]*\.md\|templates/[a-z-]*\.md\|templates/tanto\.json\|skills/tanto/[a-z/-]*\.md\|skills/tanto/[a-z/-]*\.json\|skills/tanto/[a-z/.-]*\.js' \
```

The new alternative's character class admits `.` because
`passage-check.test.js` carries one in its stem; `[a-z/-]*\.js` would match
only `test.js` out of it. Run against a probe file holding the invocation lines
`P-J1`, `P-E2`, `P-E3` and `P-K12` land, the extended expression extracts
`scripts/passage-check.js` and `scripts/passage-check.test.js` and nothing
else — measured 2026-09-10, before this block was written.

**P-N4** `docs/notes/tanto-consistency-checks.md` — replace exactly these 10 lines

```text
Expected: fifteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`,
`templates/review-brief.md`, `templates/roster-archive.md`,
`templates/roster.md`, and `templates/tanto.json`, whose relative order for the
two roster paths is the locale's and is not part of this check —
and **no** `MISSING` line. A `MISSING` line is either a typo in the reference
or a file the plan forgot.
```

**P-N4 →**

```text
Expected: seventeen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `scripts/passage-check.js`,
`scripts/passage-check.test.js`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`,
`templates/review-brief.md`, `templates/roster-archive.md`,
`templates/roster.md`, and `templates/tanto.json`, whose relative order for the
two roster paths is the locale's and is not part of this check —
and **no** `MISSING` line. A `MISSING` line is either a typo in the reference
or a file the plan forgot.
```

**P-N5** `docs/notes/tanto-consistency-checks.md` — replace exactly these 5 lines

```text
   **Prefer the second form, and treat the first as unavailable by default.**
   A plan that names the dry run's application script as its replay names a
   tool that lives in the drafting session's scratchpad: on the context-cost
   run that script was already gone by the final boundary, which is the
   boundary that most needs it. The second form needs only the plan and
```

**P-N5 →**

```text
   **Both forms are `skills/tanto/scripts/passage-check.js` now** — `replay`
   is the first and `diff` the second — and the script lives in the
   repository rather than in a session's scratchpad. That was the defect: on
   the context-cost run the dry run's application script was already gone by
   the final boundary, which is the boundary that most needs it (issue-7481).
   The second form needs only the plan and
```

This plan therefore **edits the note that governs its own verification**,
which design-4807 records as a legitimate but watchable pattern: the warrant
and the thing warranted arrive in one branch. The mitigation the design names
applies here — the spec ratifies it at plan review, and the pre-edit baseline
skipped the same check for the same reason, since no script existed to name.

`skills/tanto/README.md` gets the drift review `AGENTS.md` requires after a
`SKILL.md` edit, and it is not a no-op: the README has a `## Layout` section
that enumerates the files, and a `## Prerequisites` section that lists what the
skill needs of its host. Both change.

Both README insertions carry an anchor step. The spec's first draft gave them
none, and the grammar's own rule — every insertion carries one, because an
insertion's block is text that survives the edit and so cannot pin where the
new text went — was written after those two blocks and never applied back to
them. The plan drafter found it by running `lint`'s rule against the spec.

**A-M1** `skills/tanto/README.md` — `grep -cF 'expected-model defaults).' skills/tanto/README.md` — before: 1, after: 1

**P-M1** `skills/tanto/README.md` — insert after these 5 lines

```text
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, and `tanto.json` (the built-in
  expected-model defaults).
```

**P-M1 →**

```text
- `scripts/passage-check.js` — the instrument a plan that carries passages
  checks itself with, and `passage-check.test.js` beside it. Node, no
  dependencies, invoked as `node <path>`.
```

**A-M2** `skills/tanto/README.md` — `grep -cF 'is not host-agnostic and does not run on other Agent' skills/tanto/README.md` — before: 1, after: 1

**P-M2** `skills/tanto/README.md` — insert after these 4 lines

```text
- **Claude Code.** `tanto` needs `ListAgents` to see the live sessions and
  `SendMessage` to address them by name. Unlike `kisou`, `shoroku`, and
  `wayaku`, it is not host-agnostic and does not run on other Agent Skills
  hosts.
```

**P-M2 →**

```text
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js`. Only a plan
  that carries passages needs it, and only at the moments that check such a
  plan; everything else in the skill is Markdown. Claude Code is itself a Node
  application, and the first-party skills assume `node` the same way.
```

## Where each change lives

| Issue or input | File | Blocks |
| --- | --- | --- |
| 7481, 88d3, 10bc, f813 (the instrument) | `skills/tanto/scripts/passage-check.js`, `passage-check.test.js` | new files, not passages |
| b6cb + req-04f5 (the trigger) | `skills/tanto/roles/kanri.md` | P-K1 |
| b6cb (the residency line) | `skills/tanto/roles/kanri.md` | P-K2 |
| d725 | `skills/tanto/roles/kanri.md` | P-K3, P-K4, P-K5 |
| b6cb (the plan-close row) | `skills/tanto/roles/kanri.md` | P-K6 |
| b6cb + 12d3 (residency, both directories) | `skills/tanto/roles/kanri.md` | P-K7 |
| f2ec (the reading) | `skills/tanto/roles/kanri.md` | A-K8, P-K8 |
| d725 | `skills/tanto/SKILL.md` | P-S1, P-S2 |
| 12d3 | `skills/tanto/SKILL.md` | P-S3 |
| 15bf | `skills/tanto/SKILL.md` | P-S4 |
| the instrument's existence | `skills/tanto/SKILL.md` | A-S5, P-S5 |
| b6cb (the trigger, as the handover file states it) | `skills/tanto/templates/kanri-handover.md` | P-H1 |
| 12d3 (Jisso's copy of the workspace rule) | `skills/tanto/roles/jisso.md` | P-J3 |
| f813, 10bc, 7281, D-6 | `skills/tanto/roles/sekkei.md` | P-E1 |
| 7481, 88d3, 10bc | `skills/tanto/roles/sekkei.md` | P-E2 |
| 7481 | `skills/tanto/roles/jisso.md` | A-J1, P-J1 |
| f2ec (the dispatch) | `skills/tanto/roles/jisso.md` | A-J2, P-J2 |
| 867f | `skills/tanto/templates/review-brief.md` | P-R1, A-R2, P-R2, P-R3, P-R4 |
| 7481, 88d3, 10bc (the governing note) | `docs/notes/tanto-consistency-checks.md` | P-N1, P-N2, P-N3, P-N4, P-N5 |
| the instrument's existence | `skills/tanto/README.md` | P-M1, P-M2 |
| b6cb (the archive's threshold, as the roster states it) | `skills/tanto/templates/roster.md` | P-T1 |
| 867f (the form check that enforces it) | `skills/tanto/roles/kanri.md` | P-K9 |
| b6cb (the handover procedure's third case) | `skills/tanto/roles/kanri.md` | P-K10, P-K11, P-K13 |
| 7481 (the whole-branch reviewer's seat) | `skills/tanto/roles/kanri.md` | A-K12, P-K12 |
| 7481 (how a batch is verified) | `skills/tanto/roles/sekkei.md` | P-E3 |
| this plan ships a test suite | `skills/tanto/roles/jisso.md` | P-J4 |

Two rows of this table are **not** passages of this plan, and are named here so
that the gap is stated rather than discovered. `docs/design/4807-tanto.md`
carries the superseded text in two places — its Handover section still says
"Two signals fire one", and its report-line paragraph still states the
subscription rule the exit lines are losing — and both are **T2 shoroku**,
along with the eleven issues' move to `docs/issues/resolved/`. The plan does
not touch `docs/design/`, and T2 is where the design record catches up.

Read the table with the next section, not on its own. This one lists the
passage that **defines** each change and misses the passages that **quote** it;
the sweep below catches the other direction — and did, twice, after this table
was first written.

## Old values this plan contradicts

issue-10bc's instrument, applied to this plan. Each needle was run over
`skills/tanto/` on 2026-09-10 and every hit is accounted for; the plan carries
these as its `O` blocks and its verification re-runs them after the last batch.

| Needle | Hits at authoring time | Disposition |
| --- | --- | --- |
| `notify_when_idle: true` | `roles/kanri.md` ×2, `SKILL.md` ×2 | gone; P-K3, P-K4, P-S1, P-S2 |
| `Two signals fire a handover` | `roles/kanri.md` ×1 | gone; P-K1 |
| `Kanri stays, prints the residency line` | `roles/kanri.md` ×1 | gone; P-K6 |
| `whether to delete` | `roles/kanri.md` ×1, `SKILL.md` ×1 | gone; P-K7, P-S3 |
| `You are resident` | `roles/kanri.md` ×1 | gone; P-K7 |
| `threshold on the reading` | `roles/kanri.md` ×1 | gone; P-K1 |
| `an unanswered one stays open` | `templates/review-brief.md` ×1 | gone; P-R1 |
| `application script's path` | `roles/sekkei.md` ×1 | gone; P-E2 |
| `There are eleven` | `SKILL.md` ×1 | **stays.** The templates count is unchanged; the executable is not a template, and P-S5 adds it in a paragraph of its own rather than to that list |
| `exit lines` | 3 raw: `roles/kanri.md` ×1, `SKILL.md` ×2, one of which is inside P-S1's old block | **stays**, ending at 2. Both survivors are about where a reading travels, not about a subscription. The raw count is recorded because Verification item 4 re-runs the needle over the whole skill, where a qualifier is not what the command returns |
| `handover or a replacement will be read from` | `templates/roster.md` ×1 | gone; P-T1 |
| `three parts — the two before` | `roles/kanri.md` ×1 | gone; P-K9. The needle was `three parts` until the dry run: P-K9's own new text reads "so three parts or four", so the short form returns 1 after the plan as well as before |
| `has none` | 2: `roles/jisso.md` ×1, `templates/review-brief.md` ×1 | ends at 1. Jisso's is the test-suite premise and goes (P-J4); the brief template's is `"not stated" when it has none`, about a `req-<id>` citation, and stays |
| `Which of the two procedures` | `roles/kanri.md` ×1 | gone; P-K13 |
| `fired — the human's word` | `templates/kanri-handover.md` ×1 | gone; P-H1. This needle took **three** attempts, and the reason is the finding below. `compaction noticed` returns 2 before and 2 after. `the human's word, or a compaction noticed` returns 1 before and 1 after, because P-H1 *inserts* `the plan close, ` into the line and every substring that avoids the insertion point survives. Only a needle that **spans** the insertion point works |
| `asks the human about it` | `roles/jisso.md` ×1 | gone; P-J3 |
| `Two signals` | `roles/kanri.md` ×1 | gone; P-K1 |

**Seven of these rows were added after the first sweep passed clean**, in two
rounds: two found by Kanri's role-procedure check, four more by the spec review,
one by the wider sweep each of those prompted. The table is kept in this shape,
misses included, because the pattern in them is the finding.

- The first sweep's needles were written **from the plan's new terms**, which
  is the forward sweep issue-10bc already says does not work. `compaction
  noticed` is reached by no new term at all, because what changes is the
  trigger set's *cardinality*; `asks the human about it` is `whether to delete`
  said in other words in another role's copy of the same rule.
- **Every miss is a closed enumeration** — a sentence that counts or lists.
  "three parts", "the human's word, or a compaction noticed", "a threshold for
  the handover or a replacement", "has none", "the two procedures", the form
  markers' list. That is mechanisable: sweep for a number-word followed by a
  noun, and for colon-introduced lists, over the whole skill. Finding the
  candidate sentences is a command; ruling on them is the judgment D-4 keeps
  with Sekkei.
- **Every miss sits in a file carrying no other passage of this plan** —
  `templates/roster.md`, `templates/kanri-handover.md`, and, for their own
  sections, `roles/jisso.md` and `roles/kanri.md`. A file with a passage is
  read anyway; a file without one is opened only if a needle reaches it. So
  sweep the files the plan does **not** touch first.

Two more rules came out of **running** the needles rather than asserting them,
which is the only reason they are known:

- **A needle that wraps in its target matches nothing.** The first form of the
  roster needle was `threshold for the handover`, which returns `0` because
  `templates/roster.md` breaks the phrase across two lines — and `0` reads as
  "already gone", the most dangerous possible false pass. design-4807 records
  this for cross-role lines that must stay byte-identical; it applies to `O`
  needles with more force, because there the expected answer is often zero
  anyway. Pick a fragment that survives the wrap, or flatten the file first.
- **A needle may hit prose that has nothing to do with the change.** `has none`
  matches Jisso's test-suite premise and, unrelatedly, the brief template's
  `"not stated" when it has none`. So an `O` row records the raw count and the
  disposition of **each** hit, never a single verdict — and Verification item 4
  prints hits rather than counting them for the same reason.

The rule that follows, and that `P-E1` lands in `roles/sekkei.md`: write one
needle per changed **entity**, before the passages, spelled every way the tree
spells it, sweep the untouched files first — and run each needle when you write
it, because an `O` needle's failure mode is a silent zero.

One needle belongs to the note rather than the skill and its task authors it:
the note's passage-plan list describes the reconstruct-and-compare check as
something a session writes for itself, which `scripts/passage-check.js`
supersedes.

## Requirements

Every change serves req-04f5, and none adds to it or changes it. The bullets:

- **"A session's cost is measured, not guessed"** — issue-d725 removes four
  wake-ups per pair of exits that bought nothing, and issue-f813 and issue-7281
  attack the other half of the same cost, the bytes each seat reads.
- **"Kanri is resident, but its context cost does not grow with its tenure"**,
  and its clause that whatever resets it is a planned step and never a decision
  left to the human — the operational text, by way of decision-b6cb.
- **"The human is interrupted only at defined checkpoints … asked only for what
  only the human can do"** — issue-12d3 removes a deletion request that the
  human answered three times in three days, and decision-b6cb removes the
  residency question at every close.
- **"The human reviews through a brief of the judgment points"**, and
  decision-ace0's rule that the answers are the confirmation — issue-867f makes
  an unanswered decide point resolve to something the human saw.
- **"State lives in files, not in sessions"** — issue-7481, exactly: the
  strongest alignment check lived in a session's scratchpad and died with it.
- **"Small batches"** and the plan conventions that serve them — issues 10bc,
  88d3, f813, 7281, f2ec.

decision-b6cb, decision-ace0, decision-5c8e (rule 11) and decision-2f36 are
the ADRs in force. **No new ADR is proposed by this spec**, and no requirement
wording changes. If the review finds one, it is a spec escalation to Kanri, not
a bug report.

The docs side — design-4807's Handover section and its plan-conventions list,
and the eleven issues' move to `docs/issues/resolved/` — is **T1 and T2
shoroku, not a plan task**, following the context-cost run's precedent. The
plan touches `docs/` only at `docs/notes/tanto-consistency-checks.md`, which is
a flat type and the note that governs the plan's own verification.

## What the plan must contain

- **Global Constraints** built from `AGENTS.md` and the concrete model families
  from `tanto.json`, plus: the two prerequisites of Fixed input 11 with the
  command that decides each; **Git Bash** as the shell every fenced block runs
  in, since every `A` block is a POSIX `grep` and every verification command a
  bash one, on a host whose primary shell is PowerShell; the Node floor and the
  `mise` invocation; the encoding and line-ending rules of section 1; the
  `created:` list; and rule 11's authority sentence.

- **The `created:` list**, verbatim, because `diff` reads it:

  ```text
  created: skills/tanto/scripts/passage-check.js
  created: skills/tanto/scripts/passage-check.test.js
  ```

- **A command for each prerequisite**, because a constraint stated as an
  absolute names the command that decides it, and because `./scripts/lint.sh`
  on a `.js` path succeeds today by matching no hook at all — the absence of
  the linter is invisible to the plan's own verification without one:

  ```console
  $ grep -cE 'eslint|oxlint|biome|prettier' .pre-commit-config.yaml
  $ grep -ci 'mise' CONTRIBUTING.md
  $ mise --version
  ```

  **All three must read `0`, `0`, and a version today**, and the first two must
  read non-zero before batch A's first task. That each gate reads zero *now* is
  the property that makes it a gate: a first draft of this bullet used
  `grep -c 'js\|javascript\|eslint\|oxlint\|biome'`, which returns `3` on
  today's tree — every hit an exclude pattern for a generated file
  (`package-lock\.json$`, `compile_commands\.json$`, `\.(js|css)\.map$`), none
  of them a linter. It would have opened the gate before the prerequisite
  landed. A word-list gate matches the exclusions; name the tools.

  The `mise` prerequisite has two halves and needs both commands: `mise
  --version` tests this machine, and the `CONTRIBUTING.md` entry is the half
  that arrives through dotrepo and that a second contributor reads.

  One check is deferred, because it cannot run before the file exists: at task
  A1, `./scripts/lint.sh skills/tanto/scripts/passage-check.js` must show a
  JavaScript hook **running** rather than `(no files to check) Skipped`. That
  is the only command that proves the configured linter actually matches the
  path, as against merely being present in the file. Kanri runs the three gates
  and records their output in the ledger; A1's report carries the fourth.

- **The rule 11 boundary is the batch B boundary**, not batch A. Sekkei's Step 4
  item 3 sweep, run on this spec, says so rather than the intention: at the A
  boundary `docs/notes/tanto-consistency-checks.md` names `passage-check.js` as
  the replay (P-N5) while `roles/sekkei.md` Step 4 still tells Sekkei to write
  an application script and put its path in `plan-dryrun.md` — two files the
  plan touches disagreeing. Batch B lands `P-E2` and closes it. `P-S5`'s new
  `SKILL.md` paragraph forward-references `roles/sekkei.md`, `roles/jisso.md`
  and the whole-branch reviewer, so it moves into batch B with them; that is
  why the README and the layout entries are batch B's and not batch A's.

- **Batches**, three or four tasks each:

  | Batch | Tasks | Delivers |
  | --- | --- | --- |
  | A | A1 the parser and `lint`; A2 `replay`; A3 `diff` and `verify`; A4 the note (P-N1—P-N5) | the instrument, tested, and the note that schedules it |
  | B | B1 `roles/sekkei.md` Steps 3 and verification (P-E1, P-E3); B2 `roles/sekkei.md` Step 4 (P-E2); B3 the executing seats (A-J1, P-J1, A-J2, P-J2, P-J4, A-K12, P-K12); B4 the instrument's existence (A-S5, P-S5, P-M1, P-M2) | issue-7481's four seats, and the authoring rules that use the script |
  | C | C1 the handover, whole (P-K1, P-K2, P-K6, P-K10, P-K11, P-K13, P-H1, P-T1); C2 issue-d725 (P-K3, P-K4, P-K5, P-S1, P-S2); C3 issue-12d3 (P-S3, P-K7, P-J3) | Kanri's procedure and the contract |
  | D | D1 issue-867f (P-R1, A-R2, P-R2, P-R3, P-R4, P-K9); D2 issue-f2ec's reading and issue-15bf (A-K8, P-K8, P-S4); D3 the whole-tree sweeps and the `O` needles | the brief, the measurement, the mode, and the proof |

  Every cross-file item is one task, which is what keeps the tree
  self-consistent at every boundary — `P-J3` with issue-12d3, `P-H1` and `P-T1`
  with the handover, `P-K9` with the brief, `P-K12` with the other three seats
  of issue-7481. **C1 is the largest task at eight blocks**, and it is one task
  because splitting it would put `P-K6`'s "run the Handover section" in the
  tree a boundary before `P-K10` and `P-K11` fix what that section says at a
  close. **D3 is a verification-only task**, whose deliverable is recorded
  output; per `P-E1`'s own new rule its reviewer is told to re-run the checks
  rather than read the report, and the plan's Self-Review states both facts
  (issue-7281).

- **How a batch is verified**, naming by name: lint on the changed paths
  individually, under Git Bash; `mise x node@22 -- node --test
  skills/tanto/scripts/` with the resolved version recorded; the content greps;
  the `O` needle sweep in D3; `git ls-files --eol` per the split in
  Verification item 3; and, **from the batch B boundary**,
  `node skills/tanto/scripts/passage-check.js diff` as the boundary check —
  batch A has no passages to check and batch B is where the script's own
  callers land.
- **No report or prompt skeletons.** Reports and prompts follow the tanto
  templates and the plan names nothing else.

## Verification

The stop conditions at each boundary, worded as properties of the whole tree
and each backed by a command that sweeps the whole tree:

1. `./scripts/lint.sh` on every changed path, named individually. On
   `skills/tanto/scripts/passage-check.js` the JavaScript hook must appear as
   run, not as `(no files to check) Skipped` — a lint that matches no hook
   passes and proves nothing, which is why the prerequisite's three gates above
   are checked before batch A and this fourth one inside it.
2. `mise x node@22 -- node --test skills/tanto/scripts/` passes, with the
   version it resolved recorded beside the result. The floor is the version
   the tests run on, and the only one (D-9).
3. `git ls-files --eol`, in **two** parts, because the two are different
   claims. For the **nine existing paths**, `i/lf w/crlf attr/text=auto`,
   unchanged from the baseline recorded before batch A, and never `w/mixed`.
   For the **two created paths**, `i/lf w/lf` — a file an implementer has just
   written is LF in the working tree, and `w/crlf` is what a *checkout* under
   `text=auto` produces later, not what the plan can observe. Requiring
   `w/crlf` of them would fail every batch by construction; requiring nothing
   of them would let a CRLF-written script through. `w/mixed` fails either way.
4. Every `O` needle of the table above returns its stated disposition over
   `skills/tanto/`, **with the hits printed rather than counted**, and the raw
   count compared with the raw count the table records — a qualifier such as
   "outside the passages" is not what the command returns.
5. From the batch B boundary,
   `node skills/tanto/scripts/passage-check.js diff --plan <path> --base <merge base>`
   prints no unaccounted added line and no unexplained removed line, and names
   the two `created:` paths it exempted. Batch A is not checked this way: it
   carries no passages, and its two files are the exemption.
6. The note's checks 1 and 2 pass with their new expected values — nineteen
   paths listed, seventeen `ok` lines, no `MISSING` — which is what proves
   `P-N1` to `P-N4` landed together rather than one without the others.
7. The note's check 5, read for what it can actually decide. It pins **two**
   quotes, not one: the four SDD stop classes, in the superpowers source, in
   `roles/jisso.md` and in `SKILL.md`; and the four implementer statuses, in
   the source and in `roles/jisso.md` only. Of its five greps, two target
   `$HOME/.claude/plugins/cache/...`, which no edit of this plan could move —
   those two cannot fail here and are recorded as context, not as a stop
   condition. The three in-repo greps are the check: this plan touches neither
   quote, and they are what proves it.

## Open for the human at the review

1. Whether `passage-check.js` shipping inside the skill — rather than under
   this repository's `scripts/`, which is issue-7481's letter — is the right
   reading of that issue. The dialogue settled it at D-7 and D-11 on
   portability grounds; the review is the place to object.
2. The two prerequisites of Fixed input 11, approved at D-13, and their
   timing: both land through dotrepo before batch A's first task, and Kanri
   holds the batch A prompt until the two commands above return.
3. The batch A weight, and C1's. Three of batch A's four tasks build one
   program; C1 is eight blocks in one task because splitting it would leave
   the tree contradicting itself at a boundary. Both are exactly the shape
   issue-7281 says has no threshold yet, and the plan records the sizes rather
   than choosing one.
4. That the rule 11 boundary is **batch B**, not batch A. The spec's first
   draft said A; the forward-reference sweep the review ran says B, because
   the note names the script as the replay a batch before `roles/sekkei.md`
   stops describing a scratchpad application script. No role may be started or
   replaced before that boundary, Kanri's own handover and a Kaiseki by ruling
   excepted.

## The reviews this spec has had, and what each found

Recorded because `roles/sekkei.md` Step 2 requires the first and design-4807
records it as a convention derived from a measured miss, and because what each
seat caught differs by kind.

1. **The role-procedure check**, sent to Kanri before the spec review, as Step 2
   requires. The spec rewrites Kanri's procedure in thirteen blocks, Jisso's in
   five, and Sekkei's own in three; Kanri is the only other live session.
   Kanri confirmed the clauses against its own obligations, verified every
   anchor's first line on disk, and returned three points: an internal
   contradiction in `P-K1`, one old value the sweep had missed
   (`templates/kanri-handover.md`), and design-4807's two superseded spots.
   Answered by editing the spec.
2. **A wider sweep**, run because of Kanri's miss, which found a second
   (`roles/jisso.md`'s copy of the deletion question).
3. **The spec review**, a read-only reviewer on `subagents.reviewer`, report at
   `.superpowers/sdd/tanto-sweep/spec-review.md`. Twenty-six findings, ten
   high; every one accepted. It re-verified all 22 `P` blocks and all 5 `A`
   anchors independently and found them sound, and located the defects outside
   the blocks: the grammar had no shape for `P-J2`, the id grammar was written
   two ways, `replay` recursed into `verify`, `diff` had no rule for a created
   file, three more old values sat in files carrying no passage, and two of
   issue-7481's four seats had no passage at all.

The pattern across the three: **the blocks were right every time, and the
prose around them was wrong every time**. The pre-flight the author wrote
caught five count defects before the first commit and nothing else; the role
whose procedure was being rewritten caught what the author's own sweep could
not; the reviewer caught what neither could, by reading the spec against the
files it does not touch. That is an argument for keeping all three seats, and
it is the sharpest available evidence for issue-10bc's premise.

## Out of scope

- issue-f2c4, by D-1, with its own plan to follow.
- Any change to `.pre-commit-config.yaml`, `.gitattributes`, `.editorconfig`,
  `CONTRIBUTING.md`, or any other linter, formatter, or contributor-prerequisite
  configuration. Fixed input 11 puts both the JavaScript linter and the `mise`
  prerequisite in the human's hands, through dotrepo, before batch A.
- design-4807, `docs/requirements/`, `docs/decisions/`, and the issues' status
  moves: T1 and T2 shoroku.
- The kisou-refresh items (e19f, 2bf9, f50d, f623, afed, acc0) and the
  measurements riding with them (9a68, 5a81), which I-1 note 7 places after
  this plan.
- Changes to the superpowers skills, which req-04f5 puts out of scope
  permanently. The block conventions of section 3 are tanto's overrides,
  written into tanto's own files.

## Answers to the spec inputs

**I-1**, in order.

- The four context-cost issues: 10bc is section 3's `O` blocks and section 1's
  `replay`; 7481 is the script itself, in the skill rather than under
  `scripts/` (D-7, D-11); d725 is P-K3 to P-K5, P-S1 and P-S2; f813 is P-E1's
  block-once, id-citation and Verify-as-invocation rules.
- The earlier items: 12d3 is P-K7 and P-S3; f2c4 is out (D-1); 867f is P-R1 to
  P-R3, resolved in the direction the template already leaned, since the
  strict half landed in the fix wave of 2026-09-09 13:17 and the issue was
  written at 15:34 against it; f2ec is P-J2 and P-K8; 15bf is P-S4, closed on
  the measurement of D-5; 88d3 is `replay`'s anchor pass and `lint`'s count
  pass; 7281 is P-E1's Self-Review paragraph, with no threshold set.
- The operational text is P-K1, P-K2, P-K6 and P-K7.
- **Note 1, rule 11**: accepted; the boundary is stated in Global Constraints
  and in Batches, and section 1's "What this plan can and cannot use" says
  which half of the fixed form this plan uses and why the other half waits.
- **Note 2, one sweep or several**: one sweep, sorted by destination file, in
  four batches — A and B of four tasks, C and D of three, fourteen in all.
  issue-f2c4 was the item that made a single sweep awkward and it is out. The
  count was "three batches of four" until the spec review's findings added
  eleven blocks and forced the recut; the sentence had not followed the table.
- **Note 3, the two items that touch the requirement's design**: f2c4 is out;
  12d3 stayed design, and this spec proposes no requirement change. Nothing
  escalated.
- **Note 4, the script's language**: reopened by the human and settled at D-11
  on Node, against the note's Python-shaped assumption. The Windows pitfalls
  the note names are answered in section 1 under "Encoding and line endings",
  measured rather than assumed.
- **Note 5, d725 is text not behaviour**: yes; the three passages are the text
  Kanri's `R-1` already rules.
- **Note 6, this Sekkei runs on `opus` as a measurement**: acknowledged and
  ignored, as instructed. Nothing in the dialogue was changed for it.
- **Note 7, what comes after**: recorded in Out of scope.

## Deferred items

1. **issue-f2c4**, its own plan (D-1).
2. **A line-count threshold for a task** — issue-7281 asks for sizes until one
   can be chosen, and this plan records sizes without choosing.
3. **A `.gitattributes` rule for `*.js`.** Not needed, because the script
   carries no shebang and is invoked as `node <path>`; if a future script needs
   one, `eol=lf` for that path is the fix, and it is a configuration change the
   human owns.
4. **Generating a plan's blocks, rather than checking them.** D-6 chose
   invocation over generation for the Verify steps; a generator that emits the
   blocks themselves was not discussed and is not proposed.

## Shoroku candidates from this spec work

For Kanri, per the adoption rule. None of these is in the spec, the reviews, or
T1.

1. **A skill may assume its host's runtime, and only its host's runtime.**
   Measured: `superpowers` ships `.js` and `.sh` as skill payload, invokes bare
   `node`, ships no `package.json`, and the only `.py` files in the plugin
   cache are its own tests and a Hermes integration. The Python-bundling skills
   remembered from claude.ai run in a sandbox that guarantees Python. The
   general form — check which runtime the *host* guarantees, not which language
   suits the task — belongs in design-4807 or a note. (Rejected alternative:
   Python with `uv`, which D-2 and D-7 had accepted before D-11 reversed it.)
2. **A recollection about a different host is the failure mode of "measure
   first".** The Python premise was checked against this machine's plugin cache
   and passed, because `.js` payload was found and read as "skills ship
   scripts"; the question that broke it — *why* that language — came from the
   human. A measurement answers the question it was given.
3. **`mise` pins a Node version the way `uv` pins a Python one**, measured
   2026-09-10: `mise x node@22 -- node --version` installed and resolved
   `v22.23.2` on this machine. Worth recording because the spec briefly carried
   the opposite claim, that Node has no guaranteed equivalent.
4. **This repository's line endings are uniform, not mixed.** All seven files
   this plan touches are `i/lf w/crlf`; design-4807's convention warns that the
   working tree is "mixed file by file", which was true when written and is not
   true of this file set. The instrument still must not assume it.
5. **issue-867f was half-fixed before it was filed.** The strict reading landed
   in the fix wave at 13:17 on 2026-09-09 and the issue was written at 15:34
   describing the template as if it had not. An issue written after a fix wave
   on the same file is worth re-reading against the tree before it is planned;
   this one cost one dialogue turn to discover.
6. **A defect the issue's own text does not reach.** issue-7481 says "one
   script under `scripts/`", which is this repository's dev-tool directory, and
   tanto runs in any repository. The letter of an issue filed from inside one
   repository can silently scope a skill-wide instrument to that repository.
7. **The spec's own count prose was wrong five times out of twenty-two, and a
   thirty-line pre-flight found all five.** Written by hand, `P-K2`, `P-K5`,
   `P-K7`, `P-K8` and `P-J1` each declared one line more than their block held
   — the same off-by-one shape as the context-cost run's six count defects,
   from the same cause, a blank line inside a block. A throwaway Node script
   that read the leads, counted the fenced lines, and located each old block in
   its target caught every one before the spec was committed, at a cost of one
   turn. The finding is that **the instrument is worth building before it is
   specified**: writing this spec's blocks under a checker would have prevented
   the defects rather than caught them, and the same script is `lint`'s first
   two checks. It also confirms the premise of issue-88d3 and issue-7481 from a
   third instance.
8. **A document that specifies a grammar contains text shaped like that
   grammar.** The pre-flight's first run reported the spec's own illustration
   of a lead line as a failing passage. The rule chosen — resolve a lead only
   inside a task's body, and skip a lead whose id or path is a `<...>`
   placeholder — is in the spec, but the general form belongs to design-4807's
   plan conventions: a self-describing plan needs the parser to know which of
   its lead lines are use and which are mention.
9. **issue-10bc's own instrument failed on its own spec, twice, and the
   correction says how to write the needles.** The first `O` table swept ten
   needles and passed clean. Kanri's role-procedure check then found
   `templates/kanri-handover.md`'s two-signal blank, and a wider sweep run
   because of it found `roles/jisso.md`'s copy of the deletion question. Both
   misses have the same cause and it is not carelessness: the needles had been
   written from the **terms** the plan changes, which is the forward sweep
   issue-10bc already says does not work, rather than from the **entity** — the
   trigger set, the deletion question — spelled every way the tree spells it.
   `whether to delete` and `asks the human about it` are the same rule in two
   role files; `compaction noticed` names a set whose *cardinality* is what
   changes, so no new term reaches it at all. The rule that follows, and that
   belongs beside issue-10bc in design-4807: **write one needle per changed
   entity, then enumerate the tree's spellings of that entity, and do it before
   the passages rather than after.** Corollary, measured here: the role whose
   procedure a passage rewrites is a better detector of this class than the
   author's own sweep, which is an argument for the role-check step running
   before the spec review rather than instead of it.
10. **The spec ran ahead of the record, and the record is what a reviewer
    reads.** Two of the human's decisions — `mise`, and the line-ending
    requirement — arrived mid-turn while the spec's first half was being
    written, went straight into the spec, and were never copied into
    `dialogue.md`. The spec review then filed the `mise` prerequisite as a
    scope change on "no recorded decision", which was correct against the
    record and wrong against what the human had said, twice. Nothing was lost
    because the words were still in the session, but a Sekkei replaced between
    those turns would have lost them, and that is exactly what `dialogue.md`
    exists to prevent (req-04f5: the human's own words are kept as a record).
    The rule: **a decision reaches `dialogue.md` before it reaches the
    document.** A mid-turn message is the case that breaks it, because it
    arrives with no question of its own to file it under.
11. **A reversal should list the answers it invalidates.** D-11 overturned
    Python but left D-9's "test on the floor only" standing, and the spec then
    cited D-9 for a rule D-11 had just said no longer held for Node — until
    `mise` made it hold again by a route nobody had recorded. A reversal turn
    that names the earlier `D-n` answers it kills makes a later citation of one
    visibly a new decision rather than an inherited one. Adopted into
    `dialogue.md` for D-11 as a paragraph; the general form belongs to
    design-4807's Sekkei conventions. (Raised by the spec review, candidate 9.)
12. **A gate written from a word list matches the exclusions.** The first form
    of the linter prerequisite's command,
    `grep -c 'js\|javascript\|eslint\|oxlint\|biome' .pre-commit-config.yaml`,
    returns `3` on a tree with no JavaScript linter at all: every hit is an
    exclude pattern for a generated file — `package-lock\.json$`,
    `compile_commands\.json$`, `\.(js|css)\.map$`. The gate was open before the
    thing it gates existed, and it was written in the same bullet that quotes
    design-4807's "a constraint stated as an absolute names the command that
    decides it". The rule that generalises: **a gate must read zero on today's
    tree, and you must run it to find out.** design-4807 already says an
    absence check is worth its line only if it could have matched the thing it
    forbids; this is the mirror — a presence check is worth its line only if it
    reads empty before the thing arrives. Found by Kanri's cold read of the
    committed spec, which is the third distinct seat to catch a defect the
    previous two could not.
13. **An `O` needle must span the point where the text changes, and this is the
    finding the whole spec paid the most to learn.** Three needles in a row
    could not detect the change they were written for, each failing for the
    same structural reason and each caught by a different seat. `compaction
    noticed` — the change is to a set's *cardinality*, which no substring
    names; caught by Kanri's role-check. `the human's word, or a compaction
    noticed` — P-H1 *inserts* `the plan close, ` into the line, so every
    substring that avoids the insertion point survives; caught by the dry run.
    `three parts` — P-K9's own replacement text contains "so three parts or
    four"; caught by the same run. The general form is sharp: **where a change
    is an insertion, the needle must straddle the insertion point; where a
    change is a replacement, the needle must be text the replacement does not
    reproduce.** And it is mechanical, which is the valuable half — `lint`
    searches the plan's own new-passage text for every `O` needle, and a hit
    means the needle is dead. That check, written and run over this plan in one
    command, found exactly the two the dry run had found and nothing else.
    Three human-cost discoveries collapse into one command; issue-10bc's D-4
    ruling that "finding the candidates is mechanical, only ruling on them is
    judgment" gains a second mechanical half nobody had asked for.
14. **The dialogue's cost, for the `opus`-Sekkei measurement Kanri owns**: eleven
   turns, of which two were the human overturning a Sekkei recommendation
   (D-11, and the interpreter-probing detour before D-9) and one was a
   clarifying question the human asked rather than answered. Kanri holds the
   comparison; this is only the count.
