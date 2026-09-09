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

11. **The tooling for the script is the human's, and lands first** (D-8, and
    the human's word of 2026-09-10 that the linter is configured before the
    script is written). Before batch A's first task, the human puts two things
    in place through the dotrepo base scaffold: a JavaScript linter targeting
    `skills/tanto/scripts/*.js` at Node 22, and `mise` in this repository's
    contributor prerequisites, since the tests are pinned to the floor with it.
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

A **replacement** leads with
`**P<id>** <path> — replace exactly these <N> lines`, then the old block, then
`**P<id> →**`, then the new block. An **insertion** leads with
`insert after these <N> lines`, and its new block omits the anchor lines the
old block names, because an insertion's anchor stays. A **global replacement**
leads with `replace all <N> occurrences of these <M> lines` and is the one
shape whose old block is allowed to match more than once.

An **anchor step** leads with
`**A<id>** <path> — <command> — before: <v>, after: <v>`, both values stated,
always. An anchor check inverts only when the new passage wholly supersedes the
needle; when the needle is the passage's unchanged opening it still returns `1`
after a correct edit, and a boundary that re-runs the blocks mechanically reads
the non-inverting half as a failure without the stated value.

An **old value the plan contradicts** leads with
`**O<id>** <needle> — <where it must be gone, or why it may stay>`, one per
entity the plan changes.

The lead lines above are written with `<id>` and `<path>` placeholders on
purpose. A plan that documents this grammar — this spec, the role files, the
note — contains text shaped exactly like a lead line, and a parser that scans
for the shape will try to resolve the documentation as a passage. Measured
while writing this spec: a first draft used a concrete `**P3.2**
\`skills/tanto/SKILL.md\`` in the illustration and a hand-written pre-flight
reported it as a block with the wrong line count against a file it does not
appear in. So `lint` resolves a lead only inside a task's body, and a lead
whose id or path is a `<...>` placeholder is documentation and is skipped.

### The four subcommands

| Subcommand | What it does | What it closes |
| --- | --- | --- |
| `lint --plan <path>` | Parses only. Every lead line well-formed; every `N` equal to its block's real line count; every id unique; every id cited in prose present as a block; every anchor step stating both values. | issue-88d3's count half, issue-f813's citation rule |
| `replay --plan <path> --base <ref>` | Copies the base blobs to a temporary tree and applies each passage, asserting each old passage occurs **exactly once**. Then re-runs each anchor command against the applied copy and compares the result with its stated `after:` value. Then runs the plan's commands in order, printing each output beside its stated expectation. Then runs every `O` needle against the applied tree and prints every residual hit. | issue-88d3's anchor half, issue-7481's command-runner half, issue-10bc |
| `diff --plan <path> --base <ref>` | Every added line of `git diff <base>` must be text the plan literally quotes; lists the added lines that are not, and the removed lines outside any fenced block. Needs only the plan and `git`. | issue-7481's core |
| `verify --plan <path> --task <N>` | What a task's Verify step invokes, against the working tree: each of task `N`'s new passages present exactly once, each of its anchors at its stated `after:` value, and `diff` scoped to the files task `N` touches. | D-6 |

`replay` reconstructs; `diff` classifies. They prove the same thing from
opposite sides, and only `diff` survives the session that wrote it, which is
the whole of issue-7481: the context-cost run's application script lived in a
scratchpad under another session's id and was gone by the last boundary, the
one that most needs the check.

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

Signals 2 and 3 are the mid-plan case. Not the `tokens left` figure the
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
directory and a new ledger under the same roster, cold-read as if fresh — by
your successor, because the close hands the role over (decision-b6cb). Your
only exit is the Handover section above.

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

**A-S5** `skills/tanto/SKILL.md` — `grep -c '^`templates/review-brief.md`, and `templates/tanto.json`.$' skills/tanto/SKILL.md` — before: 1, after: 1

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
  one per entity the plan changes — for a column added, the sentences that
  list the columns; for a template added, "There are ten"; for a file renamed,
  its old name. A sweep for the terms a plan introduces is not a sweep for the
  prose those terms contradict, and only this one catches the second
  (issue-10bc).

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

**P-J2** `skills/tanto/roles/jisso.md` — insert after these 1 lines

```text
## Fix rounds and the Kaiseki trigger
```

The new block goes **before** that heading; the anchor is the heading, which
stays. The plan's task states that shape explicitly, since it is the one
insertion in this plan whose text precedes its anchor.

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
answering what your silence will choose.
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
as it is (issue-867f).
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
1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>[ — If unanswered: <what>]
```

This is the one block in this plan whose needle occurs more than once on
purpose. Its task replaces all four occurrences and the Verify step counts
four; `passage-check.js lint` would reject a `replace exactly these N lines`
block that matches four times, so the plan states this one as a
**global replacement**, with its occurrence count in the lead. The script's
grammar therefore admits a third shape beside replace and insert:
`replace all <N> occurrences of these <M> lines`.

## 4. The note and the README

Two files outside `skills/tanto/` change, and neither carries a design
decision of its own.

`docs/notes/tanto-consistency-checks.md` is the note that governs how a plan
editing `skills/tanto/` verifies itself. Its "Six things a passage plan's pass
needs that a whole-file plan's does not" list, and its checks 1 and 2, are
where `scripts/passage-check.js` belongs: the diff form it already describes is
what the script's `diff` subcommand implements, and the reconstruct-and-compare
it already calls the strongest check is what `replay` implements. The task
adds the script to check 1's layout list and to check 2's in-skill path set,
and replaces the passage-plan list's prose about a session-local application
script with the script's own invocations.

This plan therefore **edits the note that governs its own verification**,
which design-4807 records as a legitimate but watchable pattern: the warrant
and the thing warranted arrive in one branch. The mitigation the design names
applies here — the spec ratifies it at plan review, and the pre-edit baseline
skipped the same check for the same reason, since no script existed to name.

`skills/tanto/README.md` gets the drift review `AGENTS.md` requires after a
`SKILL.md` edit, and it is not a no-op: the README has a `## Layout` section
that enumerates the files, and a `## Prerequisites` section that lists what the
skill needs of its host. Both change.

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
| f813, 10bc, 7281, D-6 | `skills/tanto/roles/sekkei.md` | P-E1 |
| 7481, 88d3, 10bc | `skills/tanto/roles/sekkei.md` | P-E2 |
| 7481 | `skills/tanto/roles/jisso.md` | A-J1, P-J1 |
| f2ec (the dispatch) | `skills/tanto/roles/jisso.md` | A-J2, P-J2 |
| 867f | `skills/tanto/templates/review-brief.md` | P-R1, A-R2, P-R2, P-R3 |
| 7481, 88d3, 10bc (the governing note) | `docs/notes/tanto-consistency-checks.md` | authored by the plan's task |
| the instrument's existence | `skills/tanto/README.md` | P-M1, P-M2 |

Read the table with the next section, not on its own. This one lists the
passage that **defines** each change and misses the passages that **quote** it;
the sweep below catches the other direction.

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
| `exit lines` | `roles/kanri.md` ×1, `SKILL.md` ×1 outside the passages | **stays.** Both are about where a reading travels, not about a subscription |

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
  from `tanto.json`, plus: the linter prerequisite of Fixed input 11, which
  Kanri verifies before batch A's prompt; the Node floor and the `mise`
  invocation; the encoding and line-ending rules of section 1; and rule 11's
  authority sentence.
- **The rule 11 boundary.** Every item that spans two files is one task, so the
  tree is self-consistent at each batch boundary and the intended answer is
  **from the batch A boundary onward**. Sekkei's Step 4 item 3 confirms it by
  sweeping the plan's own new-passage blocks for every term a later batch
  lands; the plan states the swept result, not the intention.
- **Batches**, three of four tasks each:

  | Batch | Tasks | Delivers |
  | --- | --- | --- |
  | A | the parser and `lint`; `replay`; `diff` and `verify`; the note and the layout entries | the instrument, tested, and the note that schedules it |
  | B | `roles/sekkei.md` Step 3; `roles/sekkei.md` Step 4; `roles/jisso.md`; `templates/review-brief.md` | the authoring and execution rules that use it |
  | C | the handover text; issue-d725 across both files; issue-12d3 across both files; issue-15bf, the f2ec reading, and the README | Kanri's procedure and the contract |

- **How a batch is verified**, naming by name: lint on the changed paths
  individually; `node --test` for batch A and `mise x node@22 -- node --test`
  for the floor claim; the content greps; the `O` needle sweep after batch C;
  `git ls-files --eol` before and after each task, unchanged and never
  `w/mixed`; and, from the batch B boundary, `passage-check.js diff` as the
  boundary check.
- **No report or prompt skeletons.** Reports and prompts follow the tanto
  templates and the plan names nothing else.

## Verification

The stop conditions at each boundary, worded as properties of the whole tree
and each backed by a command that sweeps the whole tree:

1. `./scripts/lint.sh` on every changed path, named individually.
2. `mise x node@22 -- node --test skills/tanto/scripts/` passes, with the
   version it resolved recorded beside the result. The floor is the version
   the tests run on, and the only one (D-9).
3. `git ls-files --eol` over the changed paths shows `i/lf w/crlf` for each,
   unchanged from the baseline recorded before batch A, and never `w/mixed`.
4. Every `O` needle of the table above returns its stated disposition over
   `skills/tanto/`, with the hits printed rather than counted.
5. From the batch B boundary,
   `node skills/tanto/scripts/passage-check.js diff --plan <path> --base <merge base>`
   prints no unaccounted added line and no unexplained removed line.
6. The two verbatim quotes `SKILL.md` and `roles/jisso.md` share — the four SDD
   stop classes — still match byte for byte, as the note's check 5 requires.
   This plan does not touch them, and the check is what proves it.

## Open for the human at the review

1. The rule 11 boundary, once the forward-reference sweep has run: the spec
   intends the batch A boundary, and the sweep, not the intention, decides.
2. Whether `passage-check.js` shipping inside the skill — rather than under
   this repository's `scripts/`, which is issue-7481's letter — is the right
   reading of that issue. The dialogue settled it at D-7 and D-11 on
   portability grounds; the review is the place to object.
3. The batch A weight. Three of its four tasks build one program, which is
   heavier than a Markdown batch and is exactly the shape issue-7281 says has
   no threshold yet. The sizes are recorded either way.

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
- **Note 2, one sweep or several**: one sweep, sorted by destination file, three
  batches of four. issue-f2c4 was the item that made a single sweep awkward and
  it is out.
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
9. **The dialogue's cost, for the `opus`-Sekkei measurement Kanri owns**: eleven
   turns, of which two were the human overturning a Sekkei recommendation
   (D-11, and the interpreter-probing detour before D-9) and one was a
   clarifying question the human asked rather than answered. Kanri holds the
   comparison; this is only the count.
