# seat-lineage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make a seat's shoroku items reach `docs/` once per plan at the close, run one fresh Jisso per batch from a queue filled at the plan's landing, and reuse windows by `/clear` instead of closing them — across `skills/tanto/`'s contract, role files and templates, its README, the consistency note, and the documents the plan writes.

**Architecture:** Every change is a passage: an exact old text quoted from the live tree and the exact new text the spec gives, or a section replaced whole between two headings. Three sections are replaced whole — `SKILL.md`'s "Session exit", `roles/kanri.md`'s "Shoroku" and "Session lifecycle". Tasks are grouped so that each file is finished before the next begins, and the files are ordered contract → Kanri and its templates → the other roles and the remaining templates → the READMEs, the note, the sweep and the documents.

**Tech Stack:** Markdown only. `node "$TANTO/scripts/passage-check.js"` verifies the passages; `./scripts/lint.sh` (`scripts\lint.bat` on Windows) runs pre-commit on the changed paths; `mise x node@22 -- node --test skills/tanto/scripts/` must stay green although no script changes.

**Spec:** `docs/superpowers/specs/2026-09-17-seat-lineage-design.md` — committed by Keikaku from the accepted draft at `.tanto/seat-lineage/spec-draft.md`, unchanged, with one exception: `.tanto/kikaku/2026-09-17-idle-block-and-hosa-compact.md` (R-6) sections 1, 2, and 4 are appended verbatim under a new `## Amendments` heading at commit time, naming that file's path and the ruling — a copy, not Keikaku's own judgment, per that decision's own instruction. The plan argues from the amended spec; executors read both.

**`$TANTO`** is the tanto skill's own directory, as `SKILL.md` sets it.

**Old texts** were re-verified against the working tree on branch `shoroku-at-close` at tip `17f2e4a`, the tree this plan was drafted against. Every fenced old block below was matched verbatim, and every `O` needle's count below was run, not asserted. See Self-Review for the two facts that did not match expectation.

## Global Constraints

- **AGENTS.md.** Every commit follows the repo's `AGENTS.md`: run `./scripts/lint.sh` (`scripts\lint.bat` on Windows) on the changed paths, relative to the repo root, and fix issues before committing; commit by explicit path with `git commit --only <paths>` — the index is shared, so a new file needs `git add <path>` first, since `--only` cannot pick up an untracked one; end every commit message with a `Co-Authored-By:` trailer naming the agent that made it; never `git add -A`/`.`/`-u`, a bare `git commit`, or `git commit -a`; never bypass a commit or push hook (`--no-verify`, `-n`) without explicit human approval; never amend a published commit; never push to `origin/main` without explicit human approval — this plan lands its commits on the `seat-lineage` branch, and the merge to `main` is the human's own decision at the topic's close, not a step of this plan.
- **This plan is itself the "explicit human approval" AGENTS.md asks for before an agent instruction file is edited.** AGENTS.md's "Never do" list otherwise requires that approval before touching an agent instruction file or a repo-root Markdown file; for exactly the files this plan names — `skills/tanto/SKILL.md`, `skills/tanto/roles/*.md`, `skills/tanto/templates/*.md`, `skills/tanto/README.md`, `skills/shoroku/README.md` — that approval is on record: the kikaku decision `.tanto/kikaku/2026-09-16-seat-lineage.md`, the accepted spec `docs/superpowers/specs/2026-09-17-seat-lineage-design.md`, and the human's `all OK` recorded in `.tanto/seat-lineage/dialogue.md`. It reaches no file this plan does not name: `CLAUDE.md`, the repo-root `AGENTS.md`/`CONTRIBUTING.md`, and the linter/formatter configs stay off limits without a fresh, separate approval, and none of this plan's tasks touches them.
- **Not yours to discard.** A modification in the shared tree that you, or a subagent you dispatched, did not make is not yours to discard — report it, one line naming the file and what changed, rather than running `git checkout --` or `git clean` on your own judgment. Only Kanri decides whether it is stray (Rule 5).
- **Model families**, read from the merged `tanto.json` at this plan's drafting (none of these four kinds is touched by either the personal or the project config layer, so they are the built-in defaults). Every dispatch you make names both a `subagent_type` and a `model` together — an omitted `model` inherits your own session's, which is not what any of these kinds are pinned to:

  | Kind | `subagent_type` | Model | Effort |
  | --- | --- | --- | --- |
  | `task.implement` (fix rounds 1-3) | `tanto-task-implement` | sonnet | high |
  | `task.review-spec` (the spec-compliance half of the task review) | `tanto-task-review-spec` | opus | medium |
  | `task.review-quality` (the code-quality half, and the scoped re-review) | `tanto-task-review-quality` | opus | medium |
  | `task.escalate` (fix rounds 4-5, one tier above the implementer that got stuck) | `tanto-task-escalate` | opus | high |
  | `default` (an ad-hoc search or one-off exploration outside the SDD loop) | `tanto-default` | sonnet | medium |

- **This plan runs on the old lifecycle** (spec section 10, rule 11). This plan's own Jisso is one session, created at the landing by today's create request, carrying every one of this plan's batches; that Jisso's own exit is a **deletion**, exactly as the pre-plan text on disk says today — not the `release:` line and not the `/clear` this plan is writing. The queue, `release:`, and the `no-role` line this plan introduces take effect starting with the **first plan that lands after this one**, not this one. State this plainly to the Jisso running this plan if it ever reads its own half-edited `roles/jisso.md` mid-plan: it is not waiting on a `release:` line, because Kanri will never send it one under this plan.
- **The safe boundary is the final one — D3 accepted, or the fix wave after it, whichever actually lands last.** `roles/kanri.md`'s own "The final batch" step 2 turns the whole-branch review's findings, if it has any, into one more batch prompt on these same files, sent to Jisso after D3 is accepted; there is no second fix wave. So D3 being accepted is this plan's own end only when that review comes back clean. Wherever this plan names "batch D3" as a boundary, read it as "D3, or the fix wave that follows it, whichever this run actually ends on." No role is started or replaced before that actual end, because every role file this skill ships changes somewhere across this plan's 35 tasks, and a session started earlier would read a half-edited skill (rule 11); the fresh-start check (D3's own row, and "How a batch is verified") runs only once that end is reached, not at D3 if a fix wave still follows it. This holds **even if** a context-ceiling verdict of `over` is read for Kanri or for this plan's own Jisso at an earlier boundary: rule 11 overrides the ordinary Replace trigger for the whole run of this plan, and Kanri records that override as its own `R-n` at the plan's landing, so every batch prompt and a handover file, if one happens mid-plan, carry it forward. A compaction in this plan's own Jisso's reading is **not** overridden the same way: decision-6dea's Replace-on-compaction symptom is the one Replace trigger rule 11 still allows before the safe boundary, alongside a Kaiseki dispatched on a Kanri ruling (`R-n`) if a fix round's root cause is genuinely unknown (rule 8) — a compacted Jisso may have lost track of the plan in a way continuing it would not fix, while its replacement still reads under this same Global Constraints authority (its batch prompt carries it forward) rather than cold from the half-edited disk text, so it is not the risk this rule exists to prevent. Sekkei stays paused for the Kaiseki case's duration (rule 9), and nothing else starts or replaces early.

## Batches

Seventeen batches over this plan's 35 tasks, grouped inside the spec's own
four inconsistency-boundaries (section 10): batch **A** lands `SKILL.md`
whole, **B** lands `roles/kanri.md` and its own templates, **C** lands the
other role files and the remaining templates, **D** lands the READMEs, the
consistency note, the whole-tree sweep, the sessions note, the two issue
closes, and the dogfood report. No planned replacement exists anywhere in
this table — see Global Constraints: this plan's one Jisso carries every
batch, and no role is started or replaced before D3.

| Batch | Tasks | Delivers | Stop condition at this boundary |
| --- | --- | --- | --- |
| A1 | 1, 2, 3 | `SKILL.md`'s roles table, Invocation line, ceiling sentences, "Handshake and roster", "The address", "Resuming", and "Messages" (the `no-role` line, `release:`, the closing line) | Tasks 1-3 `verify` clean; the batch's own `O` needles (O1.1-O1.5, O2.*, O3.*) at their stated counts; `SKILL.md` not yet internally consistent as a whole — expected, batch A is not done |
| A2 | 4 | `SKILL.md` "Session exit", replaced whole | Task 4 `verify` clean; `exit-jisso` and `docs: exit shoroku` counts in `SKILL.md` alone already at their post-A values (this task's own `O` needles); the section reads as one coherent replacement start to finish |
| A3 | 5 | `SKILL.md`'s Artifacts table, rule 4, rule 11 | Task 5 `verify` clean; **batch A's own boundary**: `SKILL.md` is now internally consistent with the new contract on its own — the note's check 7 sweep is still not expected to pass (deferred to D, per section 10) |
| B1 | 6, 7, 8 | `roles/kanri.md`'s opening paragraph, the three `lifecycle request` sentences, "Start", "On a handshake", "When the plan lands" | Tasks 6-8 `verify` clean; this batch's `O` needles at their stated counts |
| B2 | 9, 10 | `roles/kanri.md` "The batch loop", steps 3, 6, 7, 8, and its idle reminder | Tasks 9-10 `verify` clean |
| B3 | 11, 12, 13 | `roles/kanri.md` "The final batch", "The Kaiseki branch", "Handover" | Tasks 11-13 `verify` clean |
| B4 | 14 | `roles/kanri.md` "Shoroku", replaced whole (this plan's largest task, 511 lines) | Task 14 `verify` clean; the section's own `O` needles (7) at their stated counts |
| B5 | 15, 16 | `roles/kanri.md` "Session lifecycle" replaced whole (Create/Replace/Release tables), "Readings", "Recovery after a VS Code restart" | Tasks 15-16 `verify` clean |
| B6 | 17 | `templates/roster.md` (13 `P` blocks — the task the drafter flagged as the one to watch if a batch needs splitting further; split it into two sub-batches on the day if its own diff is too large to review at once) | Task 17 `verify` clean |
| B7 | 18, 19, 20 | `templates/roster-archive.md`, `templates/kanri-handover.md`, `templates/kanri.md` | Tasks 18-20 `verify` clean; **batch B's own boundary**: `roles/kanri.md` and its four templates now agree with each other and with `SKILL.md` |
| C1 | 21 | `roles/jisso.md` — the file this plan's own implementer lives by; isolated in its own batch for careful review | Task 21 `verify` clean; the Propose paragraph's `O` needle (`your deletion follows`) at 0 |
| C2 | 22, 23, 24 | `roles/sekkei.md`, `roles/keikaku.md`, `roles/kaiseki.md` | Tasks 22-24 `verify` clean |
| C3 | 25, 26, 27 | `roles/hosa.md`, `roles/kikaku.md`, `templates/batch-prompt.md` | Tasks 25-27 `verify` clean |
| C4 | 28, 29 | `templates/batch-report.md`, `templates/kaiseki-report.md`, `templates/shoroku-brief.md` | Tasks 28-29 `verify` clean; **batch C's own boundary**: every role file and every template now names the new vocabulary consistently |
| D1 | 30, 31 | The READMEs' drift review; `docs/notes/tanto-consistency-checks.md`'s checks 6 and 7 re-run with the new lines | Tasks 30-31 `verify` clean; re-check whether `shoroku-at-close`'s own Task 10 (check 24) has landed since this plan was drafted — Task 31's Self-Review flag 1 — and re-verify P31.1-P31.6 against the live note before this task is accepted if it has |
| D2 | 32, 33 | `docs/notes/claude-code-sessions-observed.md`'s `/clear` measurements; the whole-tree old-value sweep (Task 33, sweep-and-check — no edit, no commit; output to `.tanto/seat-lineage/old-value-sweep.md`) | Task 32 `verify` clean; Task 33's sweep output reviewed by a human eye for any hit beyond the three known, accepted survivors (the `delet` sweep's three absence-stating lines in `roles/kanri.md` — its Handover, its "Exit shoroku" step 2, and its "Session lifecycle" opening — the spec's own new text; Self-Review flag 2 names two of the three) |
| D3 | 34, 35 | issue-0239 and issue-f293 closed; the dogfood report written | Tasks 34-35 `verify` clean; a real YAML load of both closed issues' frontmatter (the `updated:` bump) succeeds; re-run what stands in for the spec's own Verification section (Task 33's sweep, Task 31's checks 6/7, `node --test`) one more time against the fully-landed tree; **the plan's final boundary if the whole-branch review then comes back clean** (Global Constraints) — if it does not, the fix wave that follows is the actual final boundary instead, and the fresh-start check waits for that one |

## How a batch is verified

Every batch above is verified the same way `shoroku-at-close`'s were (spec
section 10): one `node "$TANTO/scripts/passage-check.js" verify --plan
docs/superpowers/plans/2026-09-17-seat-lineage.md --task <N>` per task in the
batch; `node "$TANTO/scripts/passage-check.js" diff --plan <path> --base
<merge base>` comparing the branch's actual commits so far against the
plan's own passage blocks for every task accepted up to and including this
batch; `./scripts/lint.sh <paths>` (`scripts\lint.bat` on Windows) naming the
batch's changed paths individually; `mise x node@22 -- node --test
skills/tanto/scripts/` passing, unchanged, on every batch, since no batch
touches the scripts or their tests; and `grep -cF 'close: <topic> — proposal
<path>; ledger <path>; recommendation <path>; brief <path>; direction <path>;
subject <commit subject>; slot: now' skills/tanto/SKILL.md
skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md` printing `1` on each
of the three files at every boundary — this line is never touched by this
plan (section 9) and a change to it at any boundary is a stray edit, not a
task of this plan's.

A batch whose tasks touch existing frontmatter (D3's issue-0239 and
issue-f293 `updated:` bump) additionally verifies with a real YAML load of
that frontmatter, not a text match — a hand-edited date that breaks the
block is a defect the grep-only checks above would not catch. No task in
this plan writes JSON.

Batch D3 additionally re-runs what stands
in for the spec's own Verification section
(`docs/superpowers/specs/2026-09-17-seat-lineage-design.md`, heading
"## Verification") one more time against the fully-landed tree — Task 33's
own sweep (D2), the consistency note's checks 6 and 7 (Task 31 Step 4),
and `node --test skills/tanto/scripts/`. The human-run fresh-start check
follows this — at D3 if the whole-branch review then comes back clean, at
the fix wave's own boundary otherwise (Global Constraints): a `/clear`ed
window, started before this plan's definitions and template edits, running
`/tanto` and reporting in its own start line whether `mode=` still reads
`auto` and the triple `agents: <n> current, <m> written, <k> not visible`.
Record the triple as read, not as a pass against `13`: no task in this
plan writes an agent definition, so nothing here tests whether a `/clear`
forces a rescan — the closest measurement on record is `agents: 12
current` (`.tanto/seat-lineage/dialogue.md`, before this plan added the
thirteenth kind), and this check only adds a second data point at a
different count, not a proof. Say plainly, in the dogfood report, that
"Measured while designing" 5 (spec section 10) stays a fact consistent
with a rescan, not a demonstrated one.

---

## Tasks

### Task 1: `SKILL.md` — the roles table, the Invocation line, and the two ceiling sentences

**Files:**

- Modify: `skills/tanto/SKILL.md` (L24, L27, L55, L120-122, L128-132)

Spec sections 2.1 and the first three sentences of 2.8.

**Named mechanisms this task touches.** The words **`lifecycle request`** and **`create request`**: the same mechanism is named in `roles/kanri.md` at four sites (its opening paragraph and three prose sentences — Task 6), in `roles/kanri.md`'s "Session lifecycle" Create table (Task 15), and in `templates/kanri-handover.md`'s commands (Task 19). The **ceiling**'s subject set (`Kanri and Jisso` → `Kanri`): the same claim is made in `roles/kaiseki.md`'s `--role` sentence (Task 24), in `roles/kanri.md` loop step 6 (Task 9) and Readings (Task 16), in `roles/jisso.md`'s ceiling sentence (Task 21), and in `skills/tanto/README.md` L27-32 (Task 30). The **Jisso count** (`0 or 1` → one live, the others queued): also rule 4 (Task 5), `templates/roster.md`'s keeping rule (Task 17), and `roles/kanri.md`'s handshake step 2 (Task 7).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O1.1** `lifecycle requests` — `skills/tanto/SKILL.md` 1, the Kanri role row; nowhere else in the swept tree. Must be 0 after P1.1.

**O1.2** `Kanri's lifecycle request. Kanri runs` — `skills/tanto/SKILL.md` 1, the Invocation paragraph. Must be 0 after P1.3.

**O1.3** `0 or 1 | the SDD run, batch reports` — `skills/tanto/SKILL.md` 1, the Jisso role row. Must be 0 after P1.2.

**O1.4** `act on come` — `skills/tanto/SKILL.md` 1, the `ceiling` bullet's first sentence; the needle spans the change point, where `the verdicts … act on` becomes `the verdict … acts on`. Must be 0 after P1.4.

**O1.5** `Kanri and Jisso are the only seats` — `skills/tanto/SKILL.md` 1, the `ceiling` bullet's second sentence. Must be 0 after P1.5.

- [ ] **Step 1: Apply the five passages**

**P1.1** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake, lifecycle requests | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
```

**P1.1 →**

```text
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake, the create requests and the `release:` lines | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
```

**P1.2** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| Jisso (実装) | 0 or 1 | the SDD run, batch reports, commits, the T2 shoroku proposal | Kanri; the human by grant |
```

**P1.2 →**

```text
| Jisso (実装) | 1 live per topic, the plan's others queued | one batch of the SDD run each, its batch report and its commits; the last one, the T2 shoroku proposal | Kanri; the human by grant |
```

**P1.3** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
Kanri's lifecycle request. Kanri runs `/tanto kanri` with no address.
```

**P1.3 →**

```text
Kanri's create request. Kanri runs `/tanto kanri` with no address.
```

**P1.4** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
- `ceiling` is **effective** in the sense `subagents` is: `scripts/reading.js`
  reads it, and the verdicts `roles/kanri.md` and `roles/jisso.md` act on come
  out of it. `ceiling.kanri` and `ceiling.jisso` are each
```

**P1.4 →**

```text
- `ceiling` is **effective** in the sense `subagents` is: `scripts/reading.js`
  reads it, and the verdict `roles/kanri.md` acts on comes out of it — Jisso's
  is measured and kept, and acts on nothing, since one Jisso runs one batch.
  `ceiling.kanri` and `ceiling.jisso` are each
```

**P1.5** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
  toward the share Kanri reports at the plan close. A `ceiling.<role>` for any
  role but those two is an unknown key: Kanri and Jisso are the only seats the
  ceiling replaces, because they are the two that run a whole plan of batches,
  and every other role measures and sends the five figures and is replaced on
  none of them.
```

**P1.5 →**

```text
  toward the share Kanri reports at the plan close. A `ceiling.<role>` for any
  role but those two is an unknown key: Kanri is the one seat the ceiling
  replaces, because it is the one that runs a whole plan of batches; Jisso's
  line is kept for the archive, its rotation being its replacement; and
  every other role measures and sends the five figures and is replaced on
  none of them.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 1`

Expected: `task 1: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/SKILL.md` (Windows: `scripts\lint.bat skills\tanto\SKILL.md`)

Expected: every hook passes. A hook that auto-fixes leaves the change unstaged — re-stage and re-run.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/SKILL.md
```

Subject: `docs(tanto): the roles table, the invocation line, and the ceiling name one replaced seat`. End the message with your own `Co-Authored-By:` trailer, e.g. `Co-Authored-By: Claude <noreply@anthropic.com>`.

### Task 2: `SKILL.md` — "Handshake and roster", "The address", and "Resuming"

**Files:**

- Modify: `skills/tanto/SKILL.md` (L338-342, L347-351, after L372-377, L475-477, L497-498, L504-505)

Spec sections 2.2, 2.3, and the last two sentences of 2.8. "The transcript
reading"'s compaction paragraph (L475-477) is amended by
`.tanto/kikaku/2026-09-17-idle-block-and-hosa-compact.md` §4.4 (R-6): the
spec's own §2 does not reach this paragraph, so P2.6 below is an addition
to this task's scope, not a rewording of a spec passage.

**Named mechanisms this task touches.** The **roster Status vocabulary** (`queued`, `live`, `cleared`, `replaced`, `dead`, `refused`): the same list is stated in `templates/roster.md`'s Status paragraph and keeping rule (Task 17), `templates/roster-archive.md`'s two enumerations (Task 18), and is routed on by `roles/kanri.md`'s handshake (Task 7), its Replace and Release tables (Task 15), and its Recovery paragraph (Task 16). The rule **"Kanri sends only to `live` rows"**: also `roles/kanri.md`'s handshake close (Task 7), its Resumed-Kanri case (Task 6), its "Handover" file paragraph (Task 13), `templates/roster.md`'s last keeping bullet (Task 17), and `templates/kanri-handover.md`'s Live peers (Task 19). The **`queued: <n>` reply**: also `roles/kanri.md` step 4 (Task 7) and `roles/jisso.md`'s Start (Task 21).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O2.1** `for Kanri's reply. It carries the plan path` — `skills/tanto/SKILL.md` 1. Must be 0 after P2.1.

**O2.2** `the last for a Kikaku or Hosa` — `skills/tanto/SKILL.md` 1; the phrase wraps in the file, so this is the non-wrapping form of the spec's longer needle. Must be 0 after P2.2.

**O2.3** `Topic is the topic word Kanri's orders line gave that session, or` — 2 in the swept tree: `skills/tanto/SKILL.md` 1 (P2.2 clears it) and `skills/tanto/templates/roster.md` 1, which stays until Task 17 rewrites the twin sentence. Must be 1 after this task and 0 after Task 17.

**O2.4** ` — status ` — `skills/tanto/SKILL.md` 1, the Resuming bullet's status clause; the needle spans the change point, where `— status `live`, no `dead` row —` becomes `— its status as it was, …`. Must be 0 after P2.4.

**O2.5** `every live peer whose name` — `skills/tanto/SKILL.md` 1, the Resuming broadcast. Must be 0 after P2.5.

**O2.6** `Two sessions have no` — `skills/tanto/SKILL.md` 1, "The transcript reading"'s compaction paragraph. Must be 0 after P2.6.

- [ ] **Step 1: Apply the six passages and the anchor**

**P2.1** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
Jisso and Keikaku then **wait** for Kanri's reply. It carries the plan path
and the ledger path Jisso cannot start without, and the topic, the spec path,
and the plan path Keikaku cannot start without. Sekkei, Kikaku, Hosa, and
Kaiseki start reading while they wait — the human is in the room, and the
reply arrives as a `<cross-session-message>`.
```

**P2.1 →**

```text
Jisso and Keikaku then **wait** for Kanri's reply. Jisso's is `queued: <n>`,
its place in the plan's queue, and Jisso then waits for its batch prompt —
the prompt is its orders, and carries the plan path, the ledger path, and the
branch — reading nothing until it arrives. Keikaku's carries the topic, the
spec path, and the plan path it cannot start without. Sekkei, Kikaku, Hosa,
and Kaiseki start reading while they wait — the human is in the room, and
the reply arrives as a `<cross-session-message>`.
```

**P2.2** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
Transcript. Topic is the topic word Kanri's orders line gave that session, or
`—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Status is `live`,
`dead`, `replaced`, `refused`, or `cleared`, the last for a Kikaku or Hosa
row that a re-handshake after a `/clear` has replaced. The keeping rule is
one live session per role and topic; Kanri, Kikaku, and Hosa one each.
```

**P2.2 →**

```text
Transcript. Topic is the topic word Kanri's orders line gave that session —
for a Jisso, the topic whose queue its handshake joined: the plan whose
batches are in flight, or, with none in flight, the plan whose landing
requested the queue, since the shared checkout carries one topic's batches
at a time and the next plan's queue opens at its predecessor's close — or
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

**P2.3** `skills/tanto/SKILL.md` — insert after these 6 lines

```text
- **Every other role's address** is known only to Kanri, from the handshake,
  and Kanri is the only session that sends to Sekkei, Keikaku, Jisso,
  Kaiseki, or Hosa. Kikaku is the human's seat: it sends Kanri a
  `decision: <path>` line and Kanri answers, but Kanri never addresses it
  first. A reply copies the envelope's `from` into `to` and needs no name at
  all.
```

**P2.3 →**

```text
- **Kanri sends only to the names of `live` roster rows** — never to a
  `queued` Jisso, which learns Kanri's name from the batch prompt that makes
  it live, and never to a `cleared` one, which is a bare window. The roster
  is the address book; `ListAgents` confirms that a name is listed and
  nothing more. A window keeps its name and `[ref]` across a `/clear`
  (measured 2026-09-16), so a listed name is no evidence that a role is
  behind it.
```

**A2.1** `skills/tanto/SKILL.md` — `grep -cF 'Kanri sends only to the names of' skills/tanto/SKILL.md` — before: 0, after: 1

**P2.6** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
none of those items beyond finishing the task in hand. Two sessions have no
Kanri to answer: Kanri itself, whose own case is its handover file, and a
standalone Kaiseki, which puts the items to the human in its own window.
```

**P2.6 →**

```text
none of those items beyond finishing the task in hand. Three sessions have
no Kanri to answer: Kanri itself, whose own case is its handover file; a
standalone Kaiseki, which puts the items to the human in its own window;
and a Hosa, whose counterpart under its chores grant is the human in its
own window — it puts the items there before its next job, and Kanri learns
of the compaction from the count in its next reading.
```

**P2.4** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
  with the same `transcript=`. Kanri matches the path, rewrites the row in
  place with the new name and `[ref]` — status `live`, no `dead` row — writes
```

**P2.4 →**

```text
  with the same `transcript=`. Kanri matches the path, rewrites the row in
  place with the new name and `[ref]` — its status as it was, a `queued` row
  staying `queued`, no `dead` row — writes
```

**P2.5** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
  and sends `kanri-address: <name> [<ref>] — resumed; the roster's first row is rewritten`
  to every live peer whose name `ListAgents` still lists. A peer not listed
```

**P2.5 →**

```text
  and sends `kanri-address: <name> [<ref>] — resumed; the roster's first row is rewritten`
  to every `live` roster row — never to a `queued` or a `cleared` one, and
  a listed name is no evidence of a role. A peer not listed
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 2`

Expected: `task 2: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/SKILL.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/SKILL.md
```

Subject: `docs(tanto): the roster carries queued rows and Kanri sends only to live ones`. End with your own `Co-Authored-By:` trailer.

### Task 3: `SKILL.md` — "Messages": the `no-role` line, `release:`, and the closing line

**Files:**

- Modify: `skills/tanto/SKILL.md` (insert after L545)

Spec section 2.4. This is the one site that fixes the `no-role` line's text; `templates/batch-prompt.md` carries the same bytes (Task 27) and no other file may. The closing-line passage — its prose, its `text` fence, and its two examples — is amended by `.tanto/kikaku/2026-09-17-closing-line-identity.md` (R-7): every closing line gains an identity prefix (`<name> [<ref>] · <role>[/<topic>] · <family>`) and an optional `sent:` line under it. The cold read found R-6 in the spec's own `## Amendments` and R-7 not; the spec now carries both (R-7 §1, §2, §5), so a `task.review-spec` dispatch has a tracked document for every one of these seven sites, matching R-6's own treatment in full.

**Named mechanisms this task touches.** The **`no-role` line**'s fixed text — its only other site is `templates/batch-prompt.md` (Task 27), and `roles/kikaku.md` names the rule for its own `decision:` line (Task 26); `roles/kanri.md` acts on a received `no-role` in its handshake close (Task 7), its Replace table and its Release table (Task 15), and its "Shoroku" forced-exit paragraph (Task 14). The **`release: /clear this window`** line: also `roles/kanri.md` (Tasks 9, 11, 12, 14, 15), `roles/jisso.md` (Task 21), `roles/sekkei.md` (Task 22), `roles/keikaku.md` (Task 23), `roles/kaiseki.md` (Task 24). The **closing line**: also `roles/kanri.md`'s handover step 4 (Task 13), `roles/jisso.md` (Task 21), `roles/sekkei.md` (Task 22), `roles/keikaku.md` (Task 23), `roles/kaiseki.md` (Task 24), `roles/hosa.md` (Task 25). Closing issue-f293's first site.

**Old values this task must clear** — this task inserts and removes nothing, so its old value is the absence it fills, recorded as an anchor rather than a needle:

There is none: the insertion removes no text. The absence it fills is recorded as the anchor A3.1 below, and the line it installs must never live in more than two files — `SKILL.md` and `templates/batch-prompt.md`.

- [ ] **Step 1: Apply the insertion**

The block below is fenced with four backticks because its own text carries a three-backtick fence.

**P3.1** `skills/tanto/SKILL.md` — insert after these 1 lines

```text
- A reply copies the incoming message's `from` into `to`.
```

**P3.1 →**

`````text
- **Every tanto line carries the `no-role` line as its second line** — the
  lines this file names and the ones the role files name, in both
  directions, the handshake, the bug-report route and its `triage:` answer
  included:

  ```text
  <the tanto line>
  (tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
  ```

  A role skips the second line. A bare window — one the human `/clear`ed
  and has not yet given a role — finds in it the whole of what is asked of
  it, so "act on the teammate's request" and "do nothing" coincide. In a
  message longer than one line the `no-role` line follows the first: a
  batch prompt, whose text is what `templates/batch-prompt.md` renders,
  carries it after its title line, and the file carries it there too, so
  that a pasted file and a sent message are the same bytes; a `close:` line
  with its clauses, or a handshake with its fields, is one line. A file a
  line points at — a report, a brief, a bug report — is not a message and
  carries no such line. The
  `no-role` reply is the one word, carries no second line of its own, and
  is the signal that a window was cleared under a role; a send error stays
  the signal that a session is gone. What each side does on `no-role`: Kanri marks the
  sender's row `cleared`, writes the Events line an unrun exit shoroku gets
  — what was lost, as far as it knows — and treats the exit as forced, a
  live Jisso's after verifying the tree; a role that receives `no-role` from
  Kanri's own name is in a handover gap, holds the line it sent, and
  re-sends it when the next `kanri-address:` line arrives — this holds a
  line only for a role with an established roster row to hold one on
  behalf of. A session with no row yet — a queued Jisso's own first
  handshake, landing in the same gap — has no line to hold: it treats the
  `no-role` the way a send error is already treated, re-reads the roster's
  first data row, and re-handshakes there once a `live` Kanri answers it.
- **`release: /clear this window`** is the line that ends every exit, sent by
  Kanri right after the seat's proposal passes its form check, and the last
  line that name is ever sent: the row is `cleared` at that moment. The seat
  tells the human, in its own window, to `/clear` it, and ends its turn;
  nothing else is expected of it.
- **A seat's turn ends with its closing line**, in its own window and in the
  chat's language: an identity, then two facts, and never an opinion. The
  identity is `<name> [<ref>]` — the word its own last `ListAgents` printed
  for it, at the handshake, at its latest boundary self-check, or at
  `/tanto fukki`, so the window and Kanri's own lines about it (its idle
  block, its released line to the human, the roster) always name it the
  same way — then
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
  the chat's language:

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
`````

**A3.1** `skills/tanto/SKILL.md` — `grep -cF 'reply no-role to the sender and do nothing else' skills/tanto/SKILL.md` — before: 0, after: 1

**A3.2** `skills/tanto/SKILL.md` — `grep -cF 'release: /clear this window' skills/tanto/SKILL.md` — before: 0, after: 2

The count is 2, not 1: Task 3's own definition, plus Task 4's "Session exit" restating it in the exit-shoroku walkthrough. Both are this plan's own text landed by the time this anchor runs, so 2 is correct, not a residual.

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 3`

Expected: `task 3: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/SKILL.md`

Expected: every hook passes. The `no-role` line is longer than the prose around it and is deliberately unwrapped: it is a fixed string that two files must carry byte for byte.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/SKILL.md
```

Subject: `docs(tanto): every tanto line carries the no-role line, and every exit ends with release:`. End with your own `Co-Authored-By:` trailer.

### Task 4: `SKILL.md` — "Session exit", replaced whole

**Files:**

- Modify: `skills/tanto/SKILL.md` (L644-769, from `## Session exit` to the line before `## Artifacts`)

Spec section 2.5. The whole section is one block: its four steps are renumbered in place, its file list loses Kanri's between-plans three, and its exit paragraph replaces the delete request with `release:`. This is the plan's largest task by line count — see Self-Review.

**Named mechanisms this task touches.** The step names **Propose / Recommend / Check / Apply**: `roles/kanri.md`'s "Shoroku" states them too (Task 14), `roles/hosa.md` reads the ledger's table under them (Task 25), and `templates/shoroku-brief.md`'s "How to answer" is the check's own form (Task 29). The **`close:` line** is reproduced here byte for byte and must stay identical to `roles/kanri.md`'s (Task 14) and `roles/hosa.md`'s (Task 25) — this task does not touch its bytes, only the words around it. The **file pattern** `exit-<role>[-<suffix>]`: also `roles/kanri.md`'s "Exit shoroku" (Task 14), the Artifacts table (Task 5), and the consistency note's check 6 count for it (Task 31). The **commit subject** `docs: T2 shoroku for <topic>`: also `roles/kanri.md` step 4 (Task 14). The **`T2:` line** is inherited unchanged from `shoroku-at-close` and is not touched here.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O4.1** `exit-jisso` — 2 in the swept tree: `skills/tanto/SKILL.md` 1 (this task clears it) and `skills/tanto/roles/jisso.md` 1 (Task 21). Must be 1 after this task and 0 after Task 21. Closing issue-0239 turns on this reaching 0.

**O4.2** `1. **Candidates.**` — 2 in the swept tree: `skills/tanto/SKILL.md` 1 (this task) and `skills/tanto/roles/kanri.md` 1 (Task 14). Must be 1 after this task and 0 after Task 14.

**O4.3** `docs: exit shoroku` — 3 in the swept tree: `skills/tanto/SKILL.md` 2 (both in this section) and `skills/tanto/roles/kanri.md` 1 (Task 14). Must be 1 after this task and 0 after Task 14.

**O4.4** `or Kanri's between-plans exit at` — `skills/tanto/SKILL.md` 2, both in the Artifacts table, not here; Task 5 clears them. Recorded here because the entity — Kanri's between-plans recommend/check/apply lane — is what this task removes, and the Artifacts table is the second half of the same removal.

**O4.5** `exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` — 4 in the swept tree: `skills/tanto/SKILL.md` 2 (1 here, 1 in the Artifacts table) and `skills/tanto/roles/kanri.md` 2 (Task 14). Must be 3 after this task, 2 after Task 5, and 0 after Task 14.

**O4.6** `Shoroku candidates from this spec work` — 3 in the swept tree: `skills/tanto/SKILL.md` 1 (this task), `skills/tanto/roles/kanri.md` 2 (Tasks 8 and 14). Must be 2 after this task and 0 after Task 14.

- [ ] **Step 1: Apply the whole-section replacement**

**P4.1** `skills/tanto/SKILL.md` — replace exactly these 128 lines

```text
## Session exit

Before the human deletes a session in the normal flow, the session's **exit
shoroku** runs: the session writes its candidates to a file, and the file
outlives it. Nothing is recommended, checked, or applied at an exit. The
one stage at which candidates are recommended, checked by the human, and
applied is the topic's **close**, stage word `t2`, after the final batch;
the word `exit-<role>[-<suffix>]` names a session's proposal file and
nothing else — every row of a ledger's `S-n` table carries Stage `t2`, the
stage that recommends it. `R-n` numbers Kanri's rulings and `S-n` its
shoroku candidates, both in the conductor ledger.

The close runs four steps, and every other moment runs only the first:

1. **Candidates.** The session that holds them writes them as a numbered
   list, opening with the line that says what the proposal excludes; an
   exit writes `exit-<role>[-<suffix>]-proposal.md`, the close's Jisso
   writes `shoroku-proposal.md`. Only this step needs a resident context.
   Kanri checks the file's form — the exclusion line and the numbered list
   — records each item as a `pending` row of the ledger's `S-n` table whose
   Source names the file and the item, and asks the human to delete the
   session. The spec's four sections — Requirements, The ADRs, Deferred
   items, and Shoroku candidates from this spec work — are recorded the same
   way when the spec is accepted, four rows whose Source names the spec and
   the heading; a batch report's, a review report's, and a Kaiseki report's
   candidates are recorded at the boundary that reads them. Nothing is
   copied: a row is one line and a pointer.
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over Jisso's proposal and every source the `pending` rows name —
   the spec's sections by heading, each proposal by path, each report by
   path and item — and names the output, `t2-recommendation.md`: every item
   once, quoted in full from its source, in three groups — Recommended
   adopt, Recommended reject, Unsure — each with its destination and its
   one-line reason. The same dispatch names the brief path, `t2-brief.md`
   beside the recommendation, the template `templates/shoroku-brief.md`,
   and the chat's language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
   the recommender once more on a failure and pastes the brief as it stands on a second, then
   gives the human both paths, the three counts, and the brief's text
   verbatim; the human answers by exception, in Kanri's window or through a
   Kikaku decision file whose third section names this recommendation and
   answers it; Kanri writes `t2-direction.md` beside the recommendation,
   item by item, with the `S-n` rows in the conductor ledger.
   <!-- markdownlint-enable MD038 -->
4. **Apply.** Kanri dispatches the `shoroku.apply` kind with the
   recommendation, the direction, and the commit subject; that subagent
   writes the accepted subset per `docs/AGENTS.md`, runs the repository's
   lint on the changed paths — or on the whole repository where the lint
   script takes no path arguments, which satisfies the step — and commits
   once by explicit path, on the topic's branch, before the merge decision.
   No session applies the accepted subset of its own proposal. Kanri
   verifies the diff as for any commit and marks the `S-n` rows written.

When a Hosa is live, steps 2 to 4 are its: Kanri sends one line,
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`,
and Hosa dispatches the recommender, form-checks and pastes the brief in
its own window under its chores grant, writes the direction from the
human's answer — or from a `decision: <path>` line Kanri relays — dispatches
the apply in that slot, and answers `close done: <commit subject> — <reading>`
or `close blocked: <one line>`; Kanri, or the successor it has handed over
to, verifies the commit and fills the ledger. With no Hosa live, Kanri runs
the three steps itself.

Nothing is adopted before the close, and no item is decided by Kanri alone:
the human sees the whole recommendation, grouped, once per topic.
Candidates are what is not yet in any file — a rejected alternative and its
reason, a fact measured, a defect noticed, an observation about the run —
never a restatement of a spec, a plan, a report, or a ledger. Kikaku and
Hosa have no exit shoroku; the human `/clear`s those windows instead. A
standalone Kaiseki has no Kanri, and its role file says how.

Kanri's own exit is the one exception to "only the first step": between
plans, with no ledger open, it runs all four steps — steps 2 to 4 through
a live Hosa by the same `close:` line, with `kanri` for the topic — and its
apply lands where the tree is once the merge decision is executed — on
`main` after a merge, on the plan's branch only when the human declined the
merge; while a ledger is open, its items are `pending` rows
in that ledger — the topic whose batches are in flight, else the oldest
open — and wait for that topic's close. A topic the human ends before its final batch still
gets its close, over what is on disk, with Kanri writing the proposal in
Jisso's absence.

The lines, each sent without an idle subscription, like every other tanto
line, and in one of two forms. For Jisso, a Kaiseki, and Kanri's own exit,
Kanri sends `exit: propose your shoroku; write it to <path>`; the session
writes the proposal, runs the resume self-check, and answers
`exit proposal: <path> — <reading>`. For a **Sekkei or a Keikaku at its own
final boundary**, no `exit:` line is sent: that seat writes the proposal
unasked as the last act of the boundary and names it in the same report
line — `spec accepted: <spec path>; exit proposal: <path> — <reading>` for
Sekkei, `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`
for Keikaku — and then idles. An exit that falls **away** from that
boundary — a compaction in the reading, a replacement, the human not
wanting the plan now — takes the `exit:` line like every other role. Kanri
checks that the file exists and opens with the exclusion line and a
numbered list — a direct read, since the proposal carries no headings for
`sections` to select by — records the rows, and asks the human, as a
numbered list, to delete the session at once. The session idles through
nothing: its judgment is in the file, and the file is what the close's
recommender quotes. A session that has stopped answering is past answering,
and Kanri learns it the way it learns of a missing batch report — the human
says the session is gone, or Kanri's window wakes for another reason and
the answer has not arrived. Kanri then treats the exit as forced — the
roster's Events line says the exit shoroku did not run and what was lost,
as far as Kanri knows — asks the human to delete it, and continues.

The file pattern is `exit-<role>[-<suffix>]`, with the suffix the batch
letter for Jisso (`exit-jisso-B`, a Jisso leaving at batch B's boundary),
the case number for Kaiseki (`exit-kaiseki-1`), absent for Sekkei
(`exit-sekkei`) and for Keikaku (`exit-keikaku`), and the date and the bare
name for Kanri (`exit-kanri-<YYYY-MM-DD>-<name>`); the roster's Shoroku
candidates rows that a between-plans Kanri exit recommends carry that word
as their Stage, and a ledger's rows carry `t2`. The files live in the topic
directory,
`.tanto/<topic>/`, for Jisso, Sekkei, Keikaku, and an attached Kaiseki, and
next to the roster, at `.tanto/`, for Kanri. The close's three files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the
topic directory; Kanri's between-plans exit has its own three at `.tanto/`,
named `exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md`, `-brief.md`, and
`-direction.md`.

The apply subagent's commit subject is `docs: T2 shoroku for <topic>` at
the close, or `docs: exit shoroku for kanri` at Kanri's between-plans exit
— the two fixed prefixes, `docs: T2 shoroku` and `docs: exit shoroku`, that
the whole-branch review package excludes.
```

**P4.1 →**

```text
## Session exit

A session's items reach `docs/` once, at its topic's **close**, stage word
`t2`, after the final batch. An exit — a seat done with its work, a Kanri
handing over, a Jisso retiring at its boundary — writes those items to a
file and nothing more; nothing is recommended, checked, or applied at an
exit. `R-n` numbers Kanri's rulings and `S-n` the proposal items, both in
the conductor ledger, and every row of a ledger's `S-n` table carries Stage
`t2`, the stage that recommends it.

The close runs four steps — **propose, recommend, check, apply** — and every
other moment runs only the first:

1. **Propose.** The seat that holds the items writes them: a numbered list
   opening with the line that says what the proposal excludes, or, for a
   retiring Jisso, the **Shoroku proposal** section of the batch report it
   writes at that boundary. Only this step needs a resident context. Kanri
   checks the file's form — the exclusion line and the numbered list, or the
   report's section — records each item as a `pending` row of the ledger's
   `S-n` table whose Source names the file and the item, and sends the seat
   `release:`. The spec's four sections — Requirements, The ADRs, Deferred
   items, and Shoroku proposal from this spec work — are recorded the same
   way when the spec is accepted, four rows whose Source names the spec and
   the heading; a review report's and a Kaiseki report's items are recorded
   at the boundary that reads them. Nothing is copied: a row is one line and
   a pointer, and the rows are the lineage — however many sessions carried a
   seat, its items are in one table.
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the T2 proposal and every source the `pending` rows name — the
   spec's sections by heading, each proposal by path, each report by path
   and item — and names the output, `t2-recommendation.md`: every item once,
   quoted in full from its source, in three groups — Recommended adopt,
   Recommended reject, Unsure — each with its destination and its one-line
   reason. The same dispatch names the brief path, `t2-brief.md` beside the
   recommendation, the template `templates/shoroku-brief.md`, and the chat's
   language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
   the recommender once more on a failure and pastes the brief as it stands
   on a second, then gives the human both paths, the three counts, and the
   brief's text verbatim; the human answers by exception, in Kanri's window
   or through a Kikaku decision file whose third section names this
   recommendation and answers it; Kanri writes `t2-direction.md` beside the
   recommendation, item by item, with the `S-n` rows in the conductor
   ledger.
   <!-- markdownlint-enable MD038 -->
4. **Apply.** Kanri dispatches the `shoroku.apply` kind with the
   recommendation, the direction, and the commit subject; that subagent
   writes the accepted subset per `docs/AGENTS.md`, runs the repository's
   lint on the changed paths — or on the whole repository where the lint
   script takes no path arguments, which satisfies the step — and commits
   once by explicit path, on the topic's branch, before the merge decision.
   No session applies the accepted subset of its own proposal. Kanri
   verifies the diff as for any commit and marks the `S-n` rows written.

When a Hosa is live, steps 2 to 4 are its: Kanri sends one line,
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`,
and Hosa dispatches the recommender, form-checks and pastes the brief in
its own window under its chores grant, writes the direction from the
human's answer — or from a `decision: <path>` line Kanri relays — dispatches
the apply in that slot, and answers `close done: <commit subject> — <reading>`
or `close blocked: <one line>`; Kanri, or the successor it has handed over
to, verifies the commit and fills the ledger. With no Hosa live, Kanri runs
the three steps itself.

Nothing is adopted before the close, and no item is decided by Kanri alone:
the human sees the whole recommendation, grouped, once per topic. Proposal
items are what is not yet in any file — a rejected alternative and its
reason, a fact measured, a defect noticed, an observation about the run —
never a restatement of a spec, a plan, a report, or a ledger. Kikaku and
Hosa have no exit shoroku; the human `/clear`s those windows at will. A
standalone Kaiseki has no Kanri, and its role file says how.

**Who proposes when.**

- **Jisso** proposes at every boundary, in its report's Shoroku proposal
  section, and that section is its exit shoroku: one Jisso runs one batch,
  and the boundary Kanri accepts is where it retires. No `exit:` line and no
  exit file go to a Jisso. At the close the plan's last live Jisso writes
  `.tanto/<topic>/shoroku-proposal.md` on Kanri's `T2:` line — the `pending`
  rows by number and what its own context holds that no file does — and is
  released on its form check.
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
`.tanto/<topic>/shoroku-proposal.md`. The close's three files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the topic
directory; there are no others. The apply subagent's commit subject is
`docs: T2 shoroku for <topic>` — the one fixed prefix, `docs: T2 shoroku`,
that the whole-branch review package excludes.

**The exit itself.** Every line above is sent without an idle
subscription, like every other tanto line. Kanri checks that the proposal
exists and opens with the exclusion line and a numbered list — a direct
read, since the proposal carries no headings for `sections` to select by —
or, for a Jisso, reads the report's Shoroku proposal section with the
report's others; records the rows; and sends the seat
`release: /clear this window`, the row going `cleared` as the line goes out.
The seat's closing line says `none — /clear this window`, and Kanri tells
the human, in its own window, `<role> <name> released — its work is in
<paths>; no step needs it — /clear its window when convenient`. Nothing
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

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 4`

Expected: `task 4: verify clean`.

- [ ] **Step 3: Check the `close:` line survived byte for byte**

Run:

```bash
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
```

Expected: `1` on each of the three files. This line is `shoroku-at-close`'s named mechanism, inherited unchanged; this task rewrites the prose around it and must not touch its bytes.

- [ ] **Step 4: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/SKILL.md`

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/SKILL.md
```

Subject: `docs(tanto): Session exit is one propose step per seat and one close per topic`. End with your own `Co-Authored-By:` trailer.

### Task 5: `SKILL.md` — the Artifacts table, and rules 4 and 11

**Files:**

- Modify: `skills/tanto/SKILL.md` (L778, L789, L790, L793, L794, L795, L796, L797, L858-860, L909-911)

Spec sections 2.6 and 2.7. Eight Artifacts rows and the two contract rules. This is the last task of `SKILL.md`; after it the contract agrees with itself and nothing else in the tree does yet.

**Named mechanisms this task touches.** The **roster's row rule** ("one row per session that handshook"): also `templates/roster.md`'s first keeping bullet and its address-book bullet (Task 17), and rule 4's Jisso clause below. The **batch prompt's addressee**: also `roles/kanri.md` loop step 8 (Task 10) and `templates/batch-prompt.md`'s title and guard (Task 27). The **`-2-proposal.md`** second file: also `roles/kanri.md`'s "The final batch" step 3 (Task 11), its "Shoroku"/"Your own exit" (Task 14), its handover step 1 (Task 13), and `templates/roster.md`'s between-plans paragraph (Task 17). **Rule 11's queue clause**: the same fact is stated in `roles/kanri.md`'s Create table (Task 15) and `roles/jisso.md`'s Start (Task 21).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O5.1** `one row per role |` — `skills/tanto/SKILL.md` 1, the `.tanto/roster.md` row's Content column. Must be 0 after P5.1.

**O5.2** `| Kanri | Jisso, human |` — `skills/tanto/SKILL.md` 1, the batch-prompt row's Readers column. Must be 0 after P5.2.

**O5.3** `| Jisso | Kanri | fixed skeleton |` — `skills/tanto/SKILL.md` 1, the batch-report row. Must be 0 after P5.3.

**O5.4** `what Jisso's own context holds` — `skills/tanto/SKILL.md` 1, the `shoroku-proposal.md` row's Content column, where the writer becomes the plan's last live Jisso. Must be 0 after P5.4.

**O5.5** `| the exiting session |` — `skills/tanto/SKILL.md` 1, the exit-proposal row's Writer column. Must be 0 after P5.5.

**O5.6** `every candidate once, quoted in full` — `skills/tanto/SKILL.md` 1, the recommendation row. Must be 0 after P5.6.

**O5.7** `beside the recommendation, or Kanri's between-plans exit at` — `skills/tanto/SKILL.md` 1, the direction row. Must be 0 after P5.8; with O4.4's pair this clears `or Kanri's between-plans exit at` to 0 in `SKILL.md`.

**O5.8** `one Sekkei, one Keikaku, one` — `skills/tanto/SKILL.md` 1, rule 4. Must be 0 after P5.9.

**O5.9** `made with the half-edited skill` — `skills/tanto/SKILL.md` 1, rule 11; it stays, and the needle is recorded because P5.10's anchor is the sentence it ends. Must stay 1.

- [ ] **Step 1: Apply the ten passages**

**P5.1** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its first data row | one row per role |
```

**P5.1 →**

```text
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its first data row | one row per session that handshook — a plan's queued Jissos included |
```

**P5.2** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/<topic>/batch-<X>-prompt.md` | Kanri | Jisso, human | the same text as the `SendMessage`, so the human can paste it if the message did not arrive |
```

**P5.2 →**

```text
| `.tanto/<topic>/batch-<X>-prompt.md` | Kanri | the Jisso it names, human | the same text as the `SendMessage`, so the human can paste it if the message did not arrive |
```

**P5.3** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/<topic>/batch-<X>-report.md` | Jisso | Kanri | fixed skeleton |
```

**P5.3 →**

```text
| `.tanto/<topic>/batch-<X>-report.md` | the Jisso of that batch | Kanri; the close's recommender, its Shoroku proposal section by path and item | fixed skeleton; its Shoroku proposal section is that Jisso's exit shoroku |
```

**P5.4** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri, for its form; the close's recommender, by path | the close's proposal: the `pending` rows by number and what Jisso's own context holds that no file does, written to a file instead of printed |
```

**P5.4 →**

```text
| `.tanto/<topic>/shoroku-proposal.md` | the plan's last live Jisso | Kanri, for its form; the close's recommender, by path | the close's proposal: the `pending` rows by number and what that Jisso's own context holds that no file does, written to a file instead of printed |
```

**P5.5** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri, for its form; the close's recommender, by path | the exit shoroku proposal, opening with the line that says what it excludes |
```

**P5.5 →**

```text
| `.tanto/<topic>/exit-<role>[-<suffix>][-2]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>[-2]-proposal.md` | the exiting session — Sekkei, Keikaku, an attached Kaiseki; Kanri at every plan close and at every handover; never Jisso, whose proposal is its report's section | Kanri, for its form; the close's recommender, by path | the exit shoroku proposal, opening with the line that says what it excludes; `-2` a second file at the same boundary, never a rewrite of the first |
```

**P5.6** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/<topic>/t2-recommendation.md`, or Kanri's between-plans exit at `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every candidate once, quoted in full from the source its `pending` row names, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
```

**P5.6 →**

```text
| `.tanto/<topic>/t2-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every proposal item once, quoted in full from the source its `pending` row names, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
```

**P5.7** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/<topic>/t2-brief.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` for Kanri's between-plans exit | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

**P5.7 →**

```text
| `.tanto/<topic>/t2-brief.md` | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

**P5.8** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/<topic>/t2-direction.md`, beside the recommendation, or Kanri's between-plans exit at `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-direction.md` | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
```

**P5.8 →**

```text
| `.tanto/<topic>/t2-direction.md`, beside the recommendation | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
```

**P5.9** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, one
   Jisso, and one Kaiseki per topic. A session is bound to its cwd —
   CLAUDE.md, memory, and permissions all come from it.
```

**P5.9 →**

```text
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, and
   one Kaiseki per topic; one **live** Jisso per topic, the plan's other
   Jissos `queued` in the roster until their batch. A session is bound to its
   cwd — CLAUDE.md, memory, and permissions all come from it.
```

**P5.10** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
    in view. The roles that start the plan — Jisso at the plan's landing,
    Keikaku before it, Sekkei before that — read the skill as it stands then,
    and the authority sentence above is what covers them.
```

**P5.10 →**

```text
    in view.

    The plan's Jissos are all started at its landing and rotate one per
    batch, which is neither a replacement nor a creation under this rule —
    every one of them read the skill as it stood before batch A; a re-queue
    request the queue's fallback makes mid-plan is a creation, and waits
    for the boundary like any other.

    The roles that start the plan — Jisso at the plan's landing,
    Keikaku before it, Sekkei before that — read the skill as it stands then,
    and the authority sentence above is what covers them.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 5`

Expected: `task 5: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/SKILL.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/SKILL.md
```

Subject: `docs(tanto): the artifacts table and rules 4 and 11 carry the queue and the one close`. End with your own `Co-Authored-By:` trailer.

### Task 6: `roles/kanri.md` — the opening paragraph, the three `lifecycle request` sentences, and "Start"

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L3-6, L15, L47, L111, L116-129, L136-139, L144-145)

Spec section 3.1, the first three sentences of 3.10, and — beyond the spec's own passage list — the three remaining `lifecycle request` sentences the spec's "Old values this plan contradicts" table names for this file without giving passages for them. They are twins of the opening paragraph's phrase, which is exactly the failure mode the spec review's fourth item recorded; without them batch D's sweep cannot reach `0`.

**Named mechanisms this task touches.** **`create request`** replacing **`lifecycle request`**: also `SKILL.md`'s roles table and Invocation (Task 1), `roles/kanri.md`'s Create table (Task 15), `templates/kanri.md`'s Session events placeholder (Task 20), `templates/kanri-handover.md`'s commands (Task 19), `roles/hosa.md` and `roles/kikaku.md`'s Lifecycle paragraphs (Tasks 25, 26). The rule **"send only to `live` rows"**: also `SKILL.md`'s address bullet and Resuming (Task 2), the handshake close (Task 7), the handover file (Task 13), `templates/roster.md` (Task 17), `templates/kanri-handover.md` (Task 19). The **same-window handover** — a successor started in the window the outgoing Kanri `/clear`ed: also `templates/kanri-handover.md`'s commands (Task 19) and the handover step 4 closing line (Task 13).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O6.1** `the exit directions, the bug intake, and every` — `skills/tanto/roles/kanri.md` 1, the opening paragraph. Must be 0 after P6.1.

**O6.2** `every lifecycle request carries` — `skills/tanto/roles/kanri.md` 1, the start-line paragraph. Must be 0 after P6.2.

**O6.3** `not a lifecycle request: the human sets` — `skills/tanto/roles/kanri.md` 1, the context-window recommendation. Must be 0 after P6.3.

**O6.4** `not a lifecycle request and not a roster` — `skills/tanto/roles/kanri.md` 1, the between-plans Kikaku suggestion. Must be 0 after P6.4.

**O6.5** `to delete the old session` — `skills/tanto/roles/kanri.md` 1, the Handover start case. Must be 0 after P6.5.

**O6.6** `this session should be` — `skills/tanto/roles/kanri.md` 1, the Second Kanri case, where `this session should be deleted` becomes `this window should be /clear`ed`. Must be 0 after P6.6.

**O6.7** `Resuming to every listed peer` — `skills/tanto/roles/kanri.md` 1, the Resumed Kanri case. Must be 0 after P6.7.

- [ ] **Step 1: Apply the seven passages**

**P6.1** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, the shoroku recommendations and the
directions, the exit directions, the bug intake, and every lifecycle request;
the write-out itself is the apply subagent's work, at the topic's close.
```

**P6.1 →**

```text
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, the shoroku recommendations and the
directions, the bug intake, the create requests, and the `release:` lines;
the write-out itself is the apply subagent's work, at the topic's close.
```

**P6.2** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
is the address every lifecycle request carries, and you are never renamed after
```

**P6.2 →**

```text
is the address every create request carries, and you are never renamed after
```

**P6.3** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
   recommendation and not a lifecycle request: the human sets the window or
```

**P6.3 →**

```text
   recommendation and not a create request: the human sets the window or
```

**P6.4** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
   suggestion in your own line, not a lifecycle request and not a roster
```

**P6.4 →**

```text
   suggestion in your own line, not a create request and not a roster
```

**P6.5** `skills/tanto/roles/kanri.md` — replace exactly these 14 lines

```text
**Handover** — `.tanto/kanri-handover.md` exists. In order: read the
handover and the ledger it names, and `progress.md` if a plan is in flight;
from `ListAgents`, note whether the old Kanri is still listed; rewrite the
roster — your own row first with status `live` and your own transcript path
in its Transcript column, the old Kanri's row `replaced` (or `dead` if it was
not listed), the Residency row reset to your name and today with zero counts
and your own reading, and one Events line "handover
accepted by `<you>` from
`<old>`"; send every live peer, to its bare name from the roster, one line
`kanri-address: <name> [<ref>] — handover accepted; the roster's first row is rewritten`;
delete the handover file, because the Events line is the record and a stale
file must not start a false handover at the next Kanri start; ask the human, as
a numbered list, to delete the old session; continue at the handover's Next
step, which decides whether a plan is in flight.
```

**P6.5 →**

```text
**Handover** — `.tanto/kanri-handover.md` exists. In order: read the
handover and the ledger it names, and `progress.md` if a plan is in flight;
note whether the roster's first row carries your own name — the outgoing
Kanri `/clear`ed its window and you started in it, so the name and the
`[ref]` are the same and only the transcript differs — or another's, and,
for another's, whether `ListAgents` still lists it; rewrite the roster —
your own row first with status `live` and your own transcript path in its
Transcript column, the old Kanri's row `replaced` (or `dead` when it is
another name and not listed), the Residency row reset to your name and today
with zero counts and your own reading, and one Events line "handover
accepted by `<you>` from `<old>`", the two names equal in the same-window
case; send every `live` peer, to its bare name from the roster, one line
`kanri-address: <name> [<ref>] — handover accepted; the roster's first row is rewritten`
— in the same-window case too, because a line a peer sent into the gap
between the `/clear` and your start got `no-role` back, and this line is
what tells it to re-send; delete the handover file, because the Events line
is the record and a stale file must not start a false handover at the next
Kanri start; when the old Kanri's name is another's, remind the human in one
line to `/clear` that window when convenient — no deletion is asked;
continue at the handover's Next step, which decides whether a plan is in
flight.
```

**P6.6** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
**Second Kanri** — no handover file, the first data row is another name, and
that session is still listed. Stop, tell the human there is a live Kanri
already, and ask whether that one should hand over or this session should be
deleted. Write nothing.
```

**P6.6 →**

```text
**Second Kanri** — no handover file, the first data row is another name, and
that session is still listed. Stop, tell the human there is a live Kanri
already, and ask whether that one should hand over or this window should be
`/clear`ed. Write nothing.
```

**P6.7** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
rewrite the first row in place with your new name and `[ref]`, status `live`,
send the `kanri-address:` line of `SKILL.md`'s Resuming to every listed peer,
```

**P6.7 →**

```text
rewrite the first row in place with your new name and `[ref]`, status `live`,
send the `kanri-address:` line of `SKILL.md`'s Resuming to every `live` row,
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 6`

Expected: `task 6: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): Kanri owns create requests and release: lines, and can succeed itself in one window`. End with your own `Co-Authored-By:` trailer.

### Task 7: `roles/kanri.md` — "On a handshake"

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L166-168, L182-183, L197-198, L200-201, L209)

Spec section 3.2. The spec gives P7.3 as a replacement of the resumed-session paragraph's last two lines followed by an insertion after it; the two are written here as one replacement, because each block appears once and the insertion's anchor would otherwise re-quote P7.3's own new text.

**Named mechanisms this task touches.** The **`queued: <n>` reply** and the **`queued` status**: also `SKILL.md`'s Handshake and roster (Task 2), `roles/kanri.md`'s "When the plan lands" step 5 (Task 8), loop step 8 (Task 10), the Create table (Task 15), `templates/roster.md`'s keeping rule and Status paragraph (Task 17), `templates/roster.md`'s Events list (Task 17), `templates/kanri-handover.md`'s Live peers (Task 19), and `roles/jisso.md`'s Start (Task 21). The **clear rule for every role**: also `templates/roster.md`'s third keeping bullet and Status paragraph (Task 17), `roles/kikaku.md` and `roles/hosa.md`'s Lifecycle paragraphs (Tasks 25, 26). **Acting on a received `no-role`**: also `SKILL.md`'s Messages (Task 3), the Replace table's first row (Task 15), and "Shoroku"'s forced-exit paragraph (Task 14).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O7.1** `topic, and the` — `skills/tanto/roles/kanri.md` 1, handshake step 2's second line, where the Jisso exception is inserted into the list of conditions. The step's first line survives the edit and is deliberately not the needle. Must be 0 after P7.1.

**O7.2** `orders: plan=` — `skills/tanto/roles/kanri.md` 1, step 4's Jisso bullet; nowhere else in the swept tree. Must be 0 after P7.2.

**O7.3** `but your address. Step` — `skills/tanto/roles/kanri.md` 1, the resumed-session paragraph, where the sentence gains the `queued`-row clause before `Step 2's`. Must be 0 after P7.3.

**O7.4** `that already has a live row, or a` — `skills/tanto/roles/kanri.md` 1, the refusal paragraph. Must be 0 after P7.4.

**O7.5** `Dispatch nothing to a session that has no accepted roster row.` — `skills/tanto/roles/kanri.md` 1; `templates/roster.md` states the same rule in its own words (`Kanri dispatches nothing to a session`, Task 17), which is why both spellings are needles. Must be 0 after P7.5.

- [ ] **Step 1: Apply the five passages**

**P7.1** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
2. Check the roster and the listing — no live roster row for that role and
   topic, and the
   `name [ref]` the handshake carries appears in `ListAgents`.
```

**P7.1 →**

```text
2. Check the roster and the listing — no live roster row for that role and
   topic, a Jisso handshake with a live Jisso row being queued rather than
   refused, and the
   `name [ref]` the handshake carries appears in `ListAgents`.
```

**P7.2** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   - Jisso gets
     `orders: plan=<path> ledger=<path> branch=<b>; read roles/jisso.md in the tanto skill directory`.
```

**P7.2 →**

```text
   - Jisso gets `queued: <n>` — its place in the plan's queue, in handshake
     order — and a roster row with status `queued`. Its orders are its batch
     prompt, which the loop sends when its turn comes and which names the
     plan, the ledger, and the branch. A Jisso handshake with no plan landed
     is premature and is refused like any other.
```

**P7.3** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
`resumed: <old name> → <new name>`, and send nothing but your address. Step 2's
one-live-row-per-role check does not refuse it.
```

**P7.3 →**

```text
`resumed: <old name> → <new name>`, and send nothing but your address — a
`queued` row keeps its status, and its reply is `queued: <n>` again. Step
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

**P7.4** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
A second handshake for a role and topic that already has a live row, or a
model mismatch, gets **no row**: record it in the roster as `refused` with an
```

**P7.4 →**

```text
A second handshake for a role and topic that already has a live row — a
Jisso's excepted, which joins that topic's queue while one Jisso is live —
or a model mismatch, gets **no row**: record it in the roster as `refused` with an
```

**P7.5** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
Dispatch nothing to a session that has no accepted roster row.
```

**P7.5 →**

```text
Send nothing to a name whose roster row is not `live`: a `queued` Jisso
waits for the batch prompt that makes it live, a `cleared` one is a bare
window, and a session with no accepted row is nobody's. A reply of
`no-role` from a name you sent to means that window was `/clear`ed before
your line arrived: mark its row `cleared`, write the Events line an unrun
exit shoroku gets — what was lost, as far as you know — and treat the exit
as forced; when the row was the live Jisso's, verify the tree first as the
Replace table's first row says, and send the next queued Jisso the resume
prompt.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 7`

Expected: `task 7: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): a Jisso handshake is queued, and a re-handshake under a live name clears the old row`. End with your own `Co-Authored-By:` trailer.

### Task 8: `roles/kanri.md` — "When the plan lands"

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L282-287, L290-295)

Spec sections 3.3 and one sentence of 3.10. P8.1 covers two edits in one block because they fall five lines apart in the same numbered step and a block may not overlap another: the spec section's own heading rename (3.3's last paragraph) and the `Delete row` → `Release row` pointer (3.10).

**Named mechanisms this task touches.** The spec section heading **`Shoroku proposal from this spec work`**: also `SKILL.md`'s "Session exit" step 1 (Task 4), `roles/kanri.md`'s "Shoroku" step 1 (Task 14), and `roles/sekkei.md`'s exit bullet (Task 22). The **Release table** pointer: the table itself is renamed from `Delete` in Task 15, and `roles/kanri.md`'s handover step 3 points at it (Task 13); `grep -c '^### Release$'` must be `1` and `^### Delete$` `0` only once Task 15 has landed. The **Jisso queue's size** (`N = the Batches table's rows + 1`): also the Create table (Task 15), `roles/keikaku.md`'s Step 3 sizing sentence (Task 23), and `roles/jisso.md`'s Start (Task 21).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O8.1** `items, and Shoroku candidates from this spec work — as four` — `skills/tanto/roles/kanri.md` 1, step 3; the needle spans the change point on the one line the section name sits on. Must be 0 after P8.1.

**O8.2** `Delete row` — `skills/tanto/roles/kanri.md` 1, step 3's parenthesis; nowhere else in the swept tree. Must be 0 after P8.1.

**O8.3** `4. Ask the human to create Jisso` — `skills/tanto/roles/kanri.md` 1. Must be 0 after P8.2.

- [ ] **Step 1: Apply the two passages**

**P8.1** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
3. Record the spec's own four sections — Requirements, The ADRs, Deferred
   items, and Shoroku candidates from this spec work — as four `pending`
   rows of the `S-n` table, Source the spec's path and the section's
   heading, Stage `t2`, if the spec's acceptance did not already (Sekkei's
   Delete row). Nothing is copied and nothing is recommended: the close's
   recommender reads those four sections of the spec by name, and Keikaku's
```

**P8.1 →**

```text
3. Record the spec's own four sections — Requirements, The ADRs, Deferred
   items, and Shoroku proposal from this spec work — as four `pending`
   rows of the `S-n` table, Source the spec's path and the section's
   heading, Stage `t2`, if the spec's acceptance did not already (Sekkei's
   Release row). Nothing is copied and nothing is recommended: the close's
   recommender reads those four sections of the spec by name, and Keikaku's
```

**P8.2** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
4. Ask the human to create Jisso, as the Create table below prescribes.
5. On Jisso's handshake, reply with the orders line. Then write batch A's
   prompt from `templates/batch-prompt.md`, with
   `First batch, no previous verdict.` in its previous-batch-verdict section,
   save it as `.tanto/<topic>/batch-A-prompt.md`, and send
   the same text, without an idle subscription.
```

**P8.2 →**

```text
4. Ask the human to queue the plan's Jissos, as the Create table below
   prescribes: N windows, N the number of rows in the plan's Batches table
   plus one for the whole-branch review's fix wave, each running
   `/tanto jisso <name>`; the human may open more, and fewer when they will
   be present to re-queue released windows.
5. Answer each handshake `queued: <n>` with a `queued` row. When the first
   is queued, write batch A's prompt from `templates/batch-prompt.md` —
   addressed to that Jisso, `First batch, no previous verdict.` in its
   previous-batch-verdict section, the first-Jisso line in its Setup on
   resume — save it as `.tanto/<topic>/batch-A-prompt.md`, send the same
   text to that name, without an idle subscription, and mark its row
   `live`. The later handshakes arrive while batch A runs and are queued
   the same way; batch A does not wait for them.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 8`

Expected: `task 8: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): the plan's landing queues N Jissos and sends batch A to the first`. End with your own `Co-Authored-By:` trailer.

### Task 9: `roles/kanri.md` — "The batch loop", steps 3 and 6

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L325-326, L335-337, L360-366, L379-386)

Spec section 3.4, first half.

**Named mechanisms this task touches.** The report's **section list** read by `sections` — `For Kanri, Rulings, Questions for the human, Deviations from the plan, Shoroku proposal`: the same list is a contract with `templates/batch-report.md`'s headings (Task 28) and with `templates/batch-prompt.md`'s Report paragraph, which names only the first four and is unchanged (Task 27). The section name **`Shoroku proposal`**: also `roles/sekkei.md` and `roles/keikaku.md`'s reviewer dispatches (Tasks 22, 23), `roles/kaiseki.md` (Task 24), `templates/batch-report.md` and `templates/kaiseki-report.md` (Task 28), and "The final batch" step 1 (Task 11). The **Jisso ceiling verdict acting on nothing**: also `SKILL.md`'s `ceiling` bullet (Task 1), `roles/jisso.md`'s ceiling sentence (Task 21), `roles/kaiseki.md`'s `--role` sentence (Task 24), the Replace table (Task 15), and Readings (Task 16).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O9.1** `from the plan, Shoroku candidates` — `skills/tanto/roles/kanri.md` 1, step 3's section list. Must be 0 after P9.1.

**O9.2** `copy each shoroku candidate into` — `skills/tanto/roles/kanri.md` 1, step 3's recording sentence. Must be 0 after P9.2.

**O9.3** `on Jisso's is a Replace symptom` — `skills/tanto/roles/kanri.md` 1; `roles/jisso.md` states the twin in its own words (`is a Replace symptom on Kanri's`, Task 21), so both spellings are needles. Must be 0 after P9.3.

**O9.4** `If a delete or a replace of a live, coherent session` — `skills/tanto/roles/kanri.md` 1, step 6's exit paragraph. Must be 0 after P9.4.

- [ ] **Step 1: Apply the four passages**

**P9.1** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   prompt prescribes — For Kanri, Rulings, Questions for the human, Deviations
   from the plan, Shoroku candidates — with one call:
```

**P9.1 →**

```text
   prompt prescribes — For Kanri, Rulings, Questions for the human, Deviations
   from the plan, Shoroku proposal — with one call:
```

**P9.2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   copy each shoroku candidate into the ledger's `S-n` table with Adopted
   `pending` and Stage `t2` — bookkeeping, not a ruling: nothing is adopted
```

**P9.2 →**

```text
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   record each item of the report's Shoroku proposal section in the ledger's
   `S-n` table with Adopted `pending` and Stage `t2` — that section is this
   Jisso's exit shoroku, and this is its form check — bookkeeping, not a
   ruling: nothing is adopted
```

**P9.3** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```text
   other live peer's from the reading its last line carried, as Readings
   says — each `context=` figure into that row's Context column. A verdict of `over` on your own ceiling line is
   handover signal 4; a verdict of `over` on Jisso's is a Replace symptom.
   Either one is gated on `--presence`, run on your own transcript at this
   check, and an `absent` verdict defers it rather than firing it. Write the
   Measurements per-boundary entry from the two readings, and a Measurements
   deferrals entry for anything deferred here.
```

**P9.3 →**

```text
   other live peer's from the reading its last line carried, as Readings
   says — each `context=` figure into that row's Context column. A verdict
   of `over` on your own ceiling line is handover signal 4, gated on
   `--presence`, run on your own transcript at this check, and an `absent`
   verdict defers it rather than firing it. Jisso's verdict is recorded and
   acts on nothing: the rotation retires every Jisso at its boundary, and
   the figure is what the archive keeps. Write the Measurements per-boundary
   entry from the two readings, and a Measurements deferrals entry for a
   handover deferred here.
```

**P9.4** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```text
   successor makes it from the handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired and is not deferred, run "Exit
   shoroku" now: send the `exit:` lines to the sessions whose proposal is not
   already named — a Sekkei or Keikaku at its own final boundary named it in
   its report line and is waiting for nothing — check each proposal's form
   and record its items as `pending` rows. A delete request goes out as soon
   as that session's proposal passes the form check ("Exit shoroku", step
   2); nothing is recommended or applied before the close.
```

**P9.4 →**

```text
   successor makes it from the handover's Next step. Then the exits that
   fall at this boundary, per "Exit shoroku": the retiring Jisso's proposal
   is its report's Shoroku proposal section, recorded at step 3, so send it
   `release:` now and mark its row `cleared` — a batch returned for rework
   is not accepted, and its Jisso stays live for the rework prompt, and the
   last implementation batch's Jisso waits for the whole-branch review's
   verdict ("The final batch", step 2); if a
   release or a replace of another live, coherent session is due, or a
   handover trigger has fired and is not deferred, send the `exit:` lines to
   the sessions whose proposal is not already named — a Sekkei or Keikaku at
   its own final boundary named it in its report line and is waiting for
   nothing — check each proposal's form, record its items as `pending`
   rows, and send `release:` as soon as the form check passes. Nothing is
   recommended or applied before the close.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 9`

Expected: `task 9: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): a batch accepted releases its Jisso, and Jisso's ceiling verdict acts on nothing`. End with your own `Co-Authored-By:` trailer.

### Task 10: `roles/kanri.md` — "The batch loop", the idle reminder and steps 7 and 8

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L388-394, L402, L415, L425-432)

Spec section 3.4, second half, and one sentence of 3.10 — the idle-reminder
paragraph (3.4) as amended twice: `.tanto/kikaku/2026-09-17-idle-block-and-hosa-compact.md`
§1 and §4.1 (R-6) turns the reminder into the fixed end-of-turn idle block,
not only the narrower `/clear`/release sentence the spec's own text gives;
`.tanto/kikaku/2026-09-17-closing-line-identity.md` §1 and §5 (R-7) then
prepends Kanri's own identity (`<name> [<ref>] · kanri · <family>`) as the
block's first line after `---`. `P10.1`'s new text below carries both.

**Named mechanisms this task touches.** The **idle block**, amended in from `.tanto/kikaku/2026-09-17-idle-block-and-hosa-compact.md` (R-6) in place of the spec's own narrower idle-reminder sentence: its two sources are the roster's `idle since <HH:MM>` Status entry — also written by the Replace table's Kikaku/Hosa row (Task 15) and read by `roles/kaiseki.md`'s idle paragraph (Task 24) — and each open ledger's `## Open questions for the human` (`templates/kanri.md`, Task 20's `P20.11`, the amendment's fifth site). A Kaiseki's own `for you` item, once released, is the Release table's Kaiseki row (Task 15) restated as a list entry rather than an inline reminder. The **batch prompt's addressee and resume line**: also `templates/batch-prompt.md`'s title, guard and Setup on resume (Task 27), `SKILL.md`'s Artifacts row (Task 5), and `roles/jisso.md`'s Start (Task 21). The **re-queue request**: also the Create table's third row (Task 15) and rule 11's new clause (Task 5).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O10.1** `a create or delete request, any line` — `skills/tanto/roles/kanri.md` 1, the idle-reminder paragraph. Must be 0 after P10.1.

**O10.2** `Jisso has already been deleted` — `skills/tanto/roles/kanri.md` 1, step 7 (a). Must be 0 after P10.2.

**O10.3** `naming any Kaiseki create or delete since the` — `skills/tanto/roles/kanri.md` 1, step 7 (c). Must be 0 after P10.3.

**O10.4** `and send the same` — `skills/tanto/roles/kanri.md` 1, step 8's save-and-send sentence; the needle spans the change point, where `and send the same text, without an idle subscription` becomes `send the same text to that name`. Must be 0 after P10.4. The step's own first line is deliberately **not** the needle: it is unchanged, so it would read as "already gone" while the step was still the old one.

- [ ] **Step 1: Apply the four passages**

**P10.1** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```text
   Whenever a Kikaku, Hosa, or Kaiseki row is `live` and that session has
   reported to you and gone idle, your next line to the human — this
   boundary's report, a create or delete request, any line — ends with
   `— /clear <name>'s window` for a Kikaku or Hosa, or
   `— delete <name> after its exit shoroku` for a Kaiseki. Write
   `idle since <HH:MM>` in that row's Status, so that the reminder is not
   forgotten across a wake-up.
```

**P10.1 →**

````text
   At the end of every turn, after whatever else the turn said, write the
   idle block — fixed, not only when something changed. Its first line
   after `---` is your own identity, `<name> [<ref>] · kanri · <family>`
   (`.tanto/kikaku/2026-09-17-closing-line-identity.md`, R-7), so a window
   holding you says which Kanri; it needs no `sent:` line, since your own
   lines are already files or `R-n` text.

   ```text
   ---
   <name> [<ref>] · kanri · <family>
   <topic>: <state> — <seat name | no seat> → <what comes next, and whom it waits on>
   for you: none
   ```

   or, with an open act:

   ```text
   ---
   <name> [<ref>] · kanri · <family>
   <topic>: <state> — <seat name | no seat> → <what comes next, and whom it waits on>
   for you:
   1. <topic | —> — <the act>
   ```

   At most three topic lines, the most recently active first; a closed
   topic leaves the block at its close. `for you:` is `none` or a numbered
   list, one item per act the human has been asked for and has not done —
   `—` for an act that belongs to no topic: the `/clear` of an idle Kikaku
   or Hosa window, your own handover, a quota's return, a Kaiseki's release
   after its exit shoroku, an answer you are waiting on. An item is a
   pointer to the request already made, not a restatement of it. Draw the
   block from files, never from memory: the roster's Status column — write
   `idle since <HH:MM>` there the moment a Kikaku, Hosa, or Kaiseki reports
   to you and goes idle, so that the reminder is not forgotten across a
   wake-up — and each open ledger's `## Open questions for the human`,
   which holds every open act asked of the human, one line each, added
   when the request is made and removed when it is done. A successor Kanri
   prints the same block from the same files.
````

**P10.2** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
   arguments). Jisso has already been deleted; it waits for nothing. At every
```

**P10.2 →**

```text
   arguments). Jisso has already been released; it waits for nothing. At every
```

**P10.3** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
   the boundary is verified, naming any Kaiseki create or delete since the
```

**P10.3 →**

```text
   the boundary is verified, naming any Kaiseki create or release since the
```

**P10.4** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```text
8. Write the next batch prompt from `templates/batch-prompt.md`, carrying the
   rulings the next tasks inherit and, on its Models line, the four kinds
   Jisso dispatches — `task.implement`, `task.review-spec`,
   `task.review-quality`, and `task.escalate` — each with the family
   `tanto.json` gives it and the definition name that family is dispatched
   with, so that the prompt still says them after a compaction. Save it as
   `.tanto/<topic>/batch-<X>-prompt.md` and send the same
   text, without an idle subscription.
```

**P10.4 →**

```text
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
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 10`

Expected: `task 10: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): the next batch prompt names the next queued Jisso and makes its row live`. End with your own `Co-Authored-By:` trailer.

### Task 11: `roles/kanri.md` — "The final batch"

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L453-455, L469-472, L473-483)

Spec section 3.5.

**Named mechanisms this task touches.** The **last implementation batch's exception** — its Jisso's `release:` waits for the whole-branch review's verdict: also loop step 6 (Task 9), the Release table's first row (Task 15), and `roles/jisso.md`'s boundary paragraph and final-batch sentence (Task 21). Kanri's **own proposal at every plan close** and the **`-2-proposal.md`**: also `SKILL.md`'s "Session exit" (Task 4), "Shoroku"/"The close" and "Your own exit" (Task 14), the handover step 1 (Task 13), `templates/roster.md`'s between-plans paragraph (Task 17). The **`T2:` line** is inherited from `shoroku-at-close` and its bytes are not touched.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O11.1** `section at the end of its report; copy its candidates` — `skills/tanto/roles/kanri.md` 1, step 1's second line, which carries both the old section name's tail and the old verb. The step's `ask for a **Shoroku` opening survives the edit and is deliberately not the needle. Must be 0 after P11.1.

**O11.2** `the final batch — and send it` — `skills/tanto/roles/kanri.md` 1, step 2. Must be 0 after P11.2.

**O11.3** `whose first step is Jisso's` — `skills/tanto/roles/kanri.md` 1, step 3. Must be 0 after P11.3.

**O11.4** `ask the human to delete` — `skills/tanto/roles/kanri.md` 9 today; step 3 holds one of them and P11.3 clears it. The rest fall to Tasks 14 and 15. Must be 8 after this task and 0 after Task 15.

- [ ] **Step 1: Apply the three passages**

**P11.1** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   ledger's parked and deferred-minor lines, and ask for a **Shoroku
   candidates** section at the end of its report; copy its candidates into the
   `S-n` table with Adopted `pending` and Stage `t2`, as you do a batch
```

**P11.1 →**

```text
   ledger's parked and deferred-minor lines, and ask for a **Shoroku
   proposal** section at the end of its report; record its items in the
   `S-n` table with Adopted `pending` and Stage `t2`, as you do a batch
```

**P11.2** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
2. Turn its findings into one more batch prompt — the final batch — and send it
   to Jisso. A fix-wave list is drafted under the same conditions as a plan:
   run each command it specifies once before dispatching it, and compare its
   output with what the list expects. There is no second fix wave.
```

**P11.2 →**

```text
2. Turn its findings into one more batch prompt — the final batch — and send
   it to the next queued Jisso, as any batch. The Jisso that ran the last
   implementation batch is the one exception to loop step 6's release at
   the boundary: its `release:` waits for this review's verdict, and goes
   out when the fix-wave prompt goes to its successor. When the review has
   no findings there is no fix wave: that Jisso stays live and takes step
   3's `T2:` line, and the spare queued window is named in the close's
   released line for the human to `/clear`. A fix-wave list is
   drafted under the same conditions as a plan: run each command it
   specifies once before dispatching it, and compare its output with what
   the list expects. There is no second fix wave.
```

**P11.3** `skills/tanto/roles/kanri.md` — replace exactly these 11 lines

```text
3. When the final batch is accepted, run the close: the four steps of
   "Shoroku" below, whose first step is Jisso's. Send it one line —
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
   — check the proposal's form and ask the human to delete Jisso; then the
   one recommendation over the proposal and every source the `pending` rows
   name, the human's check on the brief, the direction, and the apply on
   this branch, in that order and with Jisso gone — a live Hosa's three
   steps, by the `close:` line "Delegation to Hosa" gives, or yours. Then
   put the merge decision to the human, once the commit is verified.
   Residual load-bearing findings reach the human in that merge question, and
   so does any hotfix you took on this branch.
```

**P11.3 →**

```text
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
   Residual load-bearing findings reach the human in that merge question, and
   so does any hotfix you took on this branch. What you learn after your
   proposal is written — at the check, the merge decision, the archive —
   goes to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-2-proposal.md`, whose
   items are rows of the roster's Shoroku proposal items table and move
   into the next topic's ledger when it opens; a proposal you have recorded
   is never rewritten.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 11`

Expected: `task 11: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): the close is two proposals, Jisso's then Kanri's, before the recommender`. End with your own `Co-Authored-By:` trailer.

### Task 12: `roles/kanri.md` — "The Kaiseki branch"

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L510, L515-517)

Spec section 3.6 and one sentence of 3.10.

**Named mechanisms this task touches.** A **Kaiseki's release**: also the idle block's `for you` item that carries it once released (Task 10), step 7 (c)'s "create or release" (Task 10), the Release table's Kaiseki row (Task 15), and `roles/kaiseki.md`'s two idle paragraphs (Task 24).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O12.1** `which is not deleted` — `skills/tanto/roles/kanri.md` 1, step 5. Must be 0 after P12.1.

**O12.2** `then the deletion request` — `skills/tanto/roles/kanri.md` 1, step 6. Must be 0 after P12.2.

- [ ] **Step 1: Apply the two passages**

**P12.1** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
   `kaiseki-<n+1>-brief.md` sent to the **same** Kaiseki, which is not deleted
```

**P12.1 →**

```text
   `kaiseki-<n+1>-brief.md` sent to the **same** Kaiseki, which is not released
```

**P12.2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   is open, run Kaiseki's exit as "Exit shoroku" below prescribes — its
   proposal, its form check, then the deletion request — or keep it if
   more of the same bug is expected. Not before: a fix that misses goes back to
```

**P12.2 →**

```text
   is open, run Kaiseki's exit as "Exit shoroku" below prescribes — its
   proposal, its form check, then `release:` — or keep it if more of the
   same bug is expected. Not before: a fix that misses goes back to
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 12`

Expected: `task 12: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): a Kaiseki is released, not deleted, at its case's close`. End with your own `Co-Authored-By:` trailer.

### Task 13: `roles/kanri.md` — "Handover"

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L546-547, L714-716, L720-725, L729-755, L760, L763-764)

Spec section 3.7 and two sentences of 3.10. "The trigger"'s four signals, the presence gate, the deferral and the boundary list are otherwise unchanged; so is "The residency line". `P13.6`'s closing line is amended by `.tanto/kikaku/2026-09-17-closing-line-identity.md` (R-7), one of the sites its own section 5 lists.

**Named mechanisms this task touches.** The **deferral clause** now covers a handover only, never a Jisso replacement: the same clause is in `templates/kanri.md`'s Progress line and its Measurements deferrals row (Task 20), `templates/kanri-handover.md`'s Deferred slot (Task 19), `templates/batch-prompt.md`'s previous-batch-verdict lines (Task 27), and loop step 6's Measurements sentence (Task 9). The **Release table** pointer: the table is renamed in Task 15 and pointed at from "When the plan lands" step 3 (Task 8). Kanri's **closing line**: also `SKILL.md`'s Messages (Task 3) and the seats' own idle paragraphs (Tasks 21 to 25); this is issue-f293's first site in `roles/kanri.md`. The **`queued` Jissos listed but not addressed**: also `templates/kanri-handover.md`'s Live peers (Task 19) and `SKILL.md`'s address bullet (Task 2).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O13.1** `the peers' deletion` — `skills/tanto/roles/kanri.md` 1, "The trigger" signal 1. Must be 0 after P13.1.

**O13.2** `a Jisso replacement stands deferred` — `skills/tanto/roles/kanri.md` 1, the handover file's Deferred sentence. Its twins are `Jisso replacement deferred` (`roles/kanri.md` 1, inside the Session lifecycle section Task 15 replaces, and `templates/kanri.md` 1, Task 20) and `Your replacement is deferred` (`templates/batch-prompt.md` 1, Task 27). Must be 0 after P13.2.

**O13.3** `waiting for nothing but` — `skills/tanto/roles/kanri.md` 1, the handover file's Live peers sentence. Must be 0 after P13.3.

**O13.4** `under "Exit shoroku": write your` — `skills/tanto/roles/kanri.md` 1, the handover's step 1; the needle spans the change point, where the step stops opening with the unconditional write. The step's own bold opening `**Exit shoroku first**` survives and is deliberately not the needle. Must be 0 after P13.4.

**O13.7** `run the close's steps 2 to 4 over your proposal alone` — `skills/tanto/roles/kanri.md` 1, step 1's between-plans branch; the between-plans recommend/check/apply lane is the entity this plan removes, and its twin sits in "Shoroku"/"Your own exit" (Task 14). Must be 0 after P13.4.

**O13.5** `delete table's row keys on` — `skills/tanto/roles/kanri.md` 1, step 3. Must be 0 after P13.5.

**O13.6** `line with the numbered commands, and stop. Send` — `skills/tanto/roles/kanri.md` 1, step 4. Must be 0 after P13.6.

- [ ] **Step 1: Apply the six passages**

**P13.1** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   whose batches were in flight. After T2, the merge decision, the peers'
   deletion, and the archive move, the handover runs: without a threshold, and
```

**P13.1 →**

```text
   whose batches were in flight. After T2, the merge decision, the peers'
   release, and the archive move, the handover runs: without a threshold, and
```

**P13.2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
the topic whose batches were in flight. Deferred is the ledger's Progress
clause, verbatim, when a handover or a Jisso replacement stands deferred on the
ceiling and the human's absence, and `none` otherwise: the successor re-checks
```

**P13.2 →**

```text
the topic whose batches were in flight. Deferred is the ledger's Progress
clause, verbatim, when a handover stands deferred on the
ceiling and the human's absence, and `none` otherwise: the successor re-checks
```

**P13.3** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
whose last line you had not answered: the successor sends `kanri-address:` to
all of them, and each answers by re-sending its last unanswered line. A Sekkei
or Keikaku whose last line named an exit proposal is waiting for nothing but
its deletion, and your successor's first act for it is the delete request,
if the proposal's form check is recorded in the ledger and the request was
not sent.
```

**P13.3 →**

```text
whose last line you had not answered: the successor sends `kanri-address:` to
all of them — the `live` rows; the `queued` Jissos are listed after them by
name and place and get nothing, since their batch prompt names the Kanri
that sends it — and each answers by re-sending its last unanswered line,
which is also what a peer does with a line that got `no-role` back in the
gap. A Sekkei or Keikaku whose last line named an exit proposal is waiting
for nothing but `release:`, and your successor's first act for it is that
line, if the proposal's form check is recorded in the ledger and the line
was not sent.
```

**P13.4** `skills/tanto/roles/kanri.md` — replace exactly these 27 lines

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku": write your
   own proposal from the ledger and the roster rather than from recollection,
   to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`. What you cannot
   reconstruct goes into the handover file's "Not reconstructed" section.
   Then one of two. **While any ledger is open** — at a batch boundary, at a
   plan close with another topic open, or in a topic's spec or plan stage —
   record the proposal's items as `pending` rows, Stage `t2`, Source the
   proposal's path and the item's number, in the ledger of the topic whose
   batches are in flight, else the oldest open topic's; nothing is recommended,
   checked, or applied, and the rows wait for that topic's close. At a batch
   boundary this is loop step 6's proposal and its rows, already done when
   the window reaches this list. **Between plans**, with no ledger open,
   run the close's steps 2 to 4 over your proposal alone — the recommender
   to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` and
   `-brief.md`, the human's check, the direction beside them, and the
   apply, whose commit lands on `main` (decision-b6cb). When a Hosa is
   live, send it the `close:` line of "Delegation to Hosa" with `kanri` for
   the topic and those paths, name the delegation in the handover file's In
   flight block, and go on to step 2 without waiting: the successor
   verifies the commit on Hosa's `close done:`. When none is live, run the
   three steps yourself and verify that commit **before** the handover file
   is written, so that the successor inherits a commit and not a pending
   write-out. A plan close with no other topic open is between plans: the
   close's own T2, the merge decision, the peers' deletion, and the archive
   move come first, and your exit lands where the tree is once the merge
   decision is executed — on `main` after a merge, on the plan's branch
   only when the human declined the merge.
```

**P13.4 →**

```text
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
   topic's. At a batch boundary this is loop step 6's proposal and its rows,
   already done when the window reaches this list. **Between plans**, with
   no ledger open, record them as rows of the roster's Shoroku proposal
   items table, Stage `t2`, Source the same; they move into the next topic's
   ledger when it opens and are recommended at that topic's close. Nothing
   is recommended, checked, or applied at any handover.
```

**P13.5** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
   delete table's row keys on, so leave it and record "handover written by
```

**P13.5 →**

```text
   Release table's row keys on, so leave it and record "handover written by
```

**P13.6** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
4. Print the "Kanri hands over" line with the numbered commands, and stop. Send
   nothing to any peer; answer the human if asked; do nothing else.
```

**P13.6 →**

```text
4. Print the "Kanri hands over" line with the numbered commands, and stop
   with your closing line — opening with your own identity, as every
   closing line does: your work is in the handover file, the roster,
   and the ledger; the step that still needs this seat is none — the human
   `/clear`s this window and runs `/tanto kanri` in it, or in any free
   window. Send nothing to any peer; answer the human if asked; do nothing
   else.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 13`

Expected: `task 13: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): a handover records rows and recommends nothing, and ends with Kanri's closing line`. End with your own `Co-Authored-By:` trailer.

### Task 14: `roles/kanri.md` — "Shoroku", replaced whole

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L772-991, from `## Shoroku` to the line before `## Bug intake`)

Spec section 3.8. The whole section is one block: the step names change, the between-plans recommend/check/apply lane goes, the close becomes two proposals, and "Exit shoroku" ends with `release:` instead of a delete request. This is the plan's second-largest task by line count — see Self-Review.

**Named mechanisms this task touches.** The step names **Propose / Recommend / Check / Apply**: also `SKILL.md`'s "Session exit" (Task 4) and `roles/hosa.md`'s "The close's." (Task 25). The **`close:` line** is reproduced byte for byte and must stay identical to `SKILL.md`'s (Task 4) and `roles/hosa.md`'s (Task 25); the words around it lose `kanri` as a topic, which `roles/hosa.md` (Task 25) and `templates/kanri-handover.md`'s delegated-close line (Task 19) also lose. The **Shoroku proposal items table**: the roster's is renamed in Task 17 and the ledger's in Task 20. The **commit subject** `docs: T2 shoroku for <topic>`: also `SKILL.md` (Task 4). The **`-2-proposal.md`**: also Tasks 4, 5, 11, 13, 17.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O14.1** `1. **Candidates.**` — after Task 4, 1 in the swept tree: `skills/tanto/roles/kanri.md`. Must be 0 after P14.1.

**O14.2** `docs: exit shoroku` — after Task 4, 1 in the swept tree: `skills/tanto/roles/kanri.md`. Must be 0 after P14.1. The verification's counterpart, `docs: T2 shoroku`, is 3 today (`SKILL.md` 2, `roles/kanri.md` 1) and must be 1 line on each of those two files when the plan lands.

**O14.3** `exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` — after Tasks 4 and 5, 2 in the swept tree, both here. Must be 0 after P14.1.

**O14.4** `exit-kanri-<YYYY-MM-DD>-<name>-direction.md` — 2 today: `skills/tanto/SKILL.md` 1 (Task 5) and `skills/tanto/roles/kanri.md` 1 (here). Must be 0 after P14.1.

**O14.5** `for your own between-plans exit` — `skills/tanto/roles/kanri.md` 1, in this section; its twin `for Kanri's own between-plans exit` is `roles/hosa.md` 1 (Task 25). Must be 0 after P14.1.

**O14.6** `Shoroku candidates from this spec work` — after Tasks 4 and 8, 1 in the swept tree: here. Must be 0 after P14.1.

**O14.7** `and Jisso is deleted` — `skills/tanto/roles/kanri.md` 1, "Delegation to Hosa", the clause that follows "the slot is `now` because no batch is in flight at a close". Must be 0 after P14.1.

- [ ] **Step 1: Apply the whole-section replacement**

**P14.1** `skills/tanto/roles/kanri.md` — replace exactly these 221 lines

```text
## Shoroku

One stage per topic, the **close**, stage word `t2`, in four steps —
candidates, recommend, check, apply. Every other moment of the run runs the
first step only: a session's exit, a batch boundary, a review, a Kaiseki
report, the spec's acceptance, and the plan's landing each add `pending`
rows to the `S-n` table, and the close recommends and checks the whole
table at once. You rule on no item: you dispatch the recommender, the human
checks by exception, and a subagent applies. The `S-n` table's Adopted
column takes `pending`, `yes`, or `no`.

A `pending` row is one line and a pointer: Source names the file the
candidate lives in — a report and its item, a proposal and its number, the
spec and a section heading — and Candidate is the one-line rendering. The
close's recommender follows Source to quote the item in full; nothing is
copied into the ledger, and no session re-quotes another's candidates.

### The four steps

1. **Candidates.** The session that holds them writes them, and only this
   step needs a resident context. An exit:
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` for your own. The
   close: `.tanto/<topic>/shoroku-proposal.md`, written by Jisso — the
   `pending` rows by number and what its own context holds that no file
   does. The spec's four sections — Requirements, The ADRs, Deferred items,
   and Shoroku candidates from this spec work — are four rows whose Source is
   the spec and the heading, recorded when the spec is accepted. A batch
   report's, a review report's, and a Kaiseki report's candidates are rows
   recorded at the boundary that reads the report. Check every proposal's
   form as "Exit shoroku" step 2 says; record its rows; then the delete
   request.
2. **Recommend.** At the close, dispatch `subagent_type: tanto-shoroku-recommend`
   in the skill's recommend mode over Jisso's proposal and every source the
   `pending` rows name — the spec with its four section names, each proposal
   by path, each report by path and item — with `docs/` as the baseline, and
   name the output: `.tanto/<topic>/t2-recommendation.md`, or
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` for your own
   between-plans exit. The file lists every item once in three groups —
   Recommended adopt, Recommended reject, Unsure — each item quoted in full
   from its source, so that the file stands alone as the apply's input, with
   its destination, its one-line reason, and for a `design` entry the
   `req-<id>` it serves; a requirement or an ADR item carries the original
   wording followed by a reference translation in the chat's language. Name
   in the same dispatch the brief path — `.tanto/<topic>/t2-brief.md`, or
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` — the template
   `templates/shoroku-brief.md` in the skill directory, and the chat's
   language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `4` and the
   four headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended reject`, `## Unsure`, in that order; every `### ` heading
   of the recommendation appears exactly once in the brief after `See: `, and
   the brief names no heading the recommendation lacks — count both with
   `grep '^### '` on the recommendation, each line stripped of its `### `
   marker, and `grep -cF 'See: <heading text>'` on the brief, one line per
   heading: the pointer is the heading's text, not the heading line. On a failure dispatch the recommender
   once more, naming what failed; on a second failure paste the brief as it
   stands and tell the human in one line what is wrong with it. Then give the
   human, in one message: the recommendation's path, the brief's path, the
   three counts, and the brief's text verbatim below them. The human answers
   as the `shoroku` skill already parses — `OK` for "as recommended", or the
   numbers that go the other way, or an edit — in your window, or through a
   Kikaku decision file whose "What Kanri should do with it" section names
   this recommendation and answers it by exception: that file is the answer,
   read whole, its item numbers the recommendation's, everything it does not
   list as recommended, every override with its reason, and you need no word
   in your own window. Write `t2-direction.md` beside the recommendation
   (`exit-kanri-<YYYY-MM-DD>-<name>-direction.md` for your own between-plans
   exit), item by item, with the `S-n` rows in the ledger: Adopted from the
   answer. No item is escalated apart from the rest and none is decided by
   you alone; the human sees the whole list, grouped, and answers by
   exception.
   <!-- markdownlint-enable MD038 -->
4. **Apply.** Dispatch `subagent_type: tanto-shoroku-apply` in apply mode with
   the recommendation, the direction, and the commit subject —
   `docs: T2 shoroku for <topic>`, or `docs: exit shoroku for kanri` for your
   own between-plans exit — in slot (a) of the commit window. The subagent
   writes the accepted subset per `docs/AGENTS.md` and the per-type files,
   runs the repository's lint on the changed paths by name — or on the whole
   repository where the lint script takes no path arguments, which satisfies
   this step — commits once by explicit path with the trailer, and reports
   the subject. Verify that commit as you verify any — `git status` clean,
   the diff's paths those the direction names, lint on them (again,
   whole-repository if that is what the script does) — and fill the Written
   column.

Where the commit lands: on the topic's branch for the close, before the
merge decision; for your own between-plans exit, where the tree is once the
merge decision is executed — on `main` after a merge, on the plan's branch
only when the human declined the merge (Handover step 1's fuller rule).

The apply subagent is the writer at the close. You write under `docs/` only
through the intake's filings and the hotfix lane, and you hand those to Hosa
when one is live.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; a candidate two closes could claim is one row in the
ledger of the topic that raised it, never a compound value.

### The close

1. **Jisso proposes.** You send the `T2:` line; Jisso writes the numbered list
   to `.tanto/<topic>/shoroku-proposal.md` — the `pending` rows of the `S-n`
   table listed by number, and what its own context holds that no file does
   — and sends you one line. Check the file's form as "Exit shoroku" step 2
   says, and ask the human to delete Jisso: the close is its exit, and it
   idles through nothing.
2. **Recommend and check.** Steps 2 and 3 above — a live Hosa's, by
   "Delegation to Hosa" below, or yours — with the roster's Residency rows
   of this run appended to the direction file for the dogfood report's
   Measurements table — the readings the archive will hold, kept under
   `docs/reports/` (issue-40ed); when Hosa holds the close, you append them
   to the direction file after its `close done:`, before the successor or
   you fill the ledger.
3. **The apply subagent writes.** Step 4 above, on this branch. The human
   sees the result at the merge decision.

### Delegation to Hosa

When the roster has a `live` Hosa row at a close, or at your own
between-plans exit, steps 2 to 4 are Hosa's. After step 1 send Hosa one
line, without an idle subscription:
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`.
`<topic>` is the topic word, or `kanri` for your own exit, and the paths
are the close's three files under `.tanto/<topic>/` or your exit's three
under `.tanto/`; the slot is `now` because no batch is in flight at a close
and Jisso is deleted. Hosa reads the ledger's `pending` rows for the
sources the recommend dispatch names, dispatches the recommender and then
the apply on their own kinds, form-checks and pastes the brief in its own
window, and writes the direction from the human's answer there; a Kikaku
decision file that answers the check reaches Hosa as `decision: <path>`,
one line from you. Hosa answers `close done: <commit subject> — <reading>`,
or `close blocked: <one line>` when a form check fails twice or the answer
does not arrive. On `close done:` verify the commit as you verify any —
`git status` clean, the diff's paths those the direction names, lint on
them — and fill Adopted from the direction file and Written from the
subject. You wait for none of it: a close delegated is carried in the
handover file's In flight block, and the successor verifies. With no Hosa
live, run the three steps yourself, and add to your close line the
suggestion to open one (`/tanto hosa`), in the shape of the between-plans
Kikaku suggestion.

**A topic the human ends before its final batch** — the plan not wanted,
the branch abandoned — still gets its close, over what is on disk: write
the proposal yourself, in Jisso's absence, as you write your own — the
`pending` rows by number and what the ledger's Session events and Rulings
hold that no row does — and run steps 2 to 4; the apply lands on the
topic's branch, and the merge decision says whether that branch lands.

### Exit shoroku

Every planned exit of a session, in any role, carries its own shoroku, and
the session is deleted once its proposal is on disk and form-checked: its
items are recommended and checked at the close, with the session gone.
`SKILL.md`'s "Session exit" defines the mechanism and the file pattern
`exit-<role>[-<suffix>]`; these are your steps.

1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`. The session writes it,
   runs its resume self-check, and answers
   `exit proposal: <path> — <reading>`. **Two roles are the exception, at one
   boundary each**: a Sekkei at its own final boundary names its proposal in
   its `spec accepted:` line, and a Keikaku at its own names it in its
   `coldread answered:` line, both unasked and both without being sent
   anything — for those two, skip this step and go to step 2. Every other
   exit takes the line, this pair included whenever the exit falls elsewhere:
   a compaction in the reading (decision-6dea), a replacement from the
   Replace table, or the human not wanting the plan now.
2. Check the file's form, not its judgment: a direct read, since the
   proposal carries no headings for `sections` to select by, for the
   exclusion line it opens with and the numbered list under it. A file that
   fails the form is one line back to the session, answered by a rewrite;
   a file that passes is recorded — one `pending` row per item, Source the
   proposal's path and the item's number, Stage `t2`, since the close is
   what recommends it — and you ask the human, as a numbered list, to delete
   the session at once.
   No recommender runs here.
3. The rows wait for the close, where steps 2 to 4 of "The four steps" run
   over them with everything else; fill their Written column from the
   close's commit subject.

The session's judgment was spent writing the proposal, and the file holds
it: the close's recommender quotes every item in full from that file, which
is what the human checks. What another session pays for an exit is the
proposal.

A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the session is gone, or
your window wakes for another reason and the answer has not arrived. Treat the
exit as forced, write a roster Events line saying its exit shoroku did not run
and what was lost as far as you know, ask the human to delete it, and continue.
The same Events line goes in whenever you mark a row `dead`.

**Your own exit.** Propose from the ledger and the roster rather than from
recollection, to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`,
`<name>` being your own bare name. While any ledger is open, the proposal's
items are `pending` rows, Stage `t2`, in the ledger of the topic whose
batches are in flight, else the oldest open topic's, and the handover file
names the ledger; nothing else runs, and the rows wait for that topic's
close. Between plans, with no ledger open, steps 2 to 4 of "The four steps"
run over your proposal alone — a live Hosa's by "Delegation to Hosa", with
the successor verifying, or yours with the commit verified before the
handover file is written — and the apply's commit lands on `main`; the rows
are the roster's, Stage `exit-kanri-<YYYY-MM-DD>-<name>`. Either way this
is step 1 of the Handover above.

**Between plans** there is no ledger, so record candidates that reach you
then — a Kikaku decision file belonging to no topic, a triage's observation
— in the roster's Shoroku candidates section instead, and move the rows
whose Written column says `no` into the new ledger's table, with Stage
`t2`, when a topic opens.

The close writes only the accepted rows whose Written column says `no`, so
nothing is written twice.
```

**P14.1 →**

```text
## Shoroku

One stage per topic, the **close**, stage word `t2`, in four steps —
propose, recommend, check, apply. Every other moment of the run runs the
first step only: a session's exit, a batch boundary, a review, a Kaiseki
report, the spec's acceptance, and the plan's landing each add `pending`
rows to the `S-n` table, and the close recommends and checks the whole
table at once. You rule on no item: you dispatch the recommender, the human
checks by exception, and a subagent applies. The `S-n` table's Adopted
column takes `pending`, `yes`, or `no`.

A `pending` row is one line and a pointer: Source names the file the item
lives in — a report and its item, a proposal and its number, the spec and a
section heading — and Item is the one-line rendering. The close's
recommender follows Source to quote the item in full; nothing is copied
into the ledger, and no session re-quotes another's items. The rows are
the lineage: a seat carried by three sessions has its items in one table,
and the close reads them once.

### The four steps

1. **Propose.** The session that holds the items writes them, and only this
   step needs a resident context. An exit:
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md` for Sekkei, Keikaku,
   and an attached Kaiseki, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`
   for your own. A batch boundary: the Shoroku proposal section of the
   report, which is that Jisso's exit shoroku — one Jisso runs one batch.
   The close: `.tanto/<topic>/shoroku-proposal.md`, written by the last live
   Jisso — the `pending` rows by number and what its own context holds that
   no file does — and then your own proposal, before the recommender. The
   spec's four sections — Requirements, The ADRs, Deferred items, and
   Shoroku proposal from this spec work — are four rows whose Source is the
   spec and the heading, recorded when the spec is accepted. A review
   report's and a Kaiseki report's items are rows recorded at the boundary
   that reads the report. Check every proposal's form as "Exit shoroku" step
   2 says; record its rows; then `release:`.
2. **Recommend.** At the close, dispatch `subagent_type: tanto-shoroku-recommend`
   in the skill's recommend mode over the T2 proposal and every source the
   `pending` rows name — the spec with its four section names, each proposal
   by path, each report by path and item — with `docs/` as the baseline, and
   name the output, `.tanto/<topic>/t2-recommendation.md`. The file lists
   every item once in three groups — Recommended adopt, Recommended reject,
   Unsure — each item quoted in full from its source, so that the file
   stands alone as the apply's input, with its destination, its one-line
   reason, and for a `design` entry the `req-<id>` it serves; a requirement
   or an ADR item carries the original wording followed by a reference
   translation in the chat's language. Name in the same dispatch the brief
   path — `.tanto/<topic>/t2-brief.md` — the template
   `templates/shoroku-brief.md` in the skill directory, and the chat's
   language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `4` and the
   four headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended reject`, `## Unsure`, in that order; every `### ` heading
   of the recommendation appears exactly once in the brief after `See: `, and
   the brief names no heading the recommendation lacks — count both with
   `grep '^### '` on the recommendation, each line stripped of its `### `
   marker, and `grep -cF 'See: <heading text>'` on the brief, one line per
   heading: the pointer is the heading's text, not the heading line. On a
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
   <!-- markdownlint-enable MD038 -->
4. **Apply.** Dispatch `subagent_type: tanto-shoroku-apply` in apply mode with
   the recommendation, the direction, and the commit subject —
   `docs: T2 shoroku for <topic>` — in slot (a) of the commit window. The
   subagent writes the accepted subset per `docs/AGENTS.md` and the per-type
   files, runs the repository's lint on the changed paths by name — or on
   the whole repository where the lint script takes no path arguments, which
   satisfies this step — commits once by explicit path with the trailer, and
   reports the subject. Verify that commit as you verify any — `git status`
   clean, the diff's paths those the direction names, lint on them (again,
   whole-repository if that is what the script does) — and fill the Written
   column.

Where the commit lands: on the topic's branch, before the merge decision.
No other stage commits under `docs/` through this section.

**Between plans** there is no ledger, so record items that reach you then —
a Kikaku decision file belonging to no topic, a triage's observation, your
own exit's proposal, a close's `-2-proposal.md` — in the roster's Shoroku
proposal items table instead, and move its rows into the new ledger's
table, with Stage `t2`, when a topic opens. Nothing is written out from the
roster's table itself, so nothing is written twice.

The apply subagent is the writer at the close. You write under `docs/` only
through the intake's filings and the hotfix lane, and you hand those to Hosa
when one is live.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; an item two closes could claim is one row in the
ledger of the topic that raised it, never a compound value.

### The close

1. **Jisso proposes, then you do.** You send the `T2:` line; the live Jisso
   writes the numbered list to `.tanto/<topic>/shoroku-proposal.md` — the
   `pending` rows of the `S-n` table listed by number, and what its own
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
3. **The apply subagent writes.** Step 4 above, on this branch. The human
   sees the result at the merge decision.

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
diff's paths those the direction names, lint on them — and fill Adopted
from the direction file and Written from the subject. You wait for none of
it: a close delegated is carried in the handover file's In flight block,
and the successor verifies. With no Hosa live, run the three steps
yourself, and add to your close line the suggestion to open one
(`/tanto hosa`), in the shape of the between-plans Kikaku suggestion.

**A topic the human ends before its final batch** — the plan not wanted,
the branch abandoned — still gets its close, over what is on disk: write
the T2 proposal yourself, in Jisso's absence, as you write your own — the
`pending` rows by number and what the ledger's Session events and Rulings
hold that no row does — then your own, and run steps 2 to 4; the apply
lands on the topic's branch, and the merge decision says whether that
branch lands.

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
   Sekkei at its own final boundary names its proposal in its
   `spec accepted:` line, and a Keikaku at its own names it in its
   `coldread answered:` line, both unasked and both without being sent
   anything, and a Jisso's proposal is the Shoroku proposal section of the
   batch report it just sent, at every boundary — for those, skip this step
   and go to step 2. A Sekkei or Keikaku whose exit falls elsewhere — a
   compaction in the reading (decision-6dea), a replacement from the
   Replace table, or the human not wanting the plan now — takes the line
   like a Kaiseki; a Jisso never does.
2. Check the file's form, not its judgment: a direct read, since the
   proposal carries no headings for `sections` to select by, for the
   exclusion line it opens with and the numbered list under it; for a Jisso,
   the report's section, read with the report's others. A file that fails
   the form is one line back to the session, answered by a rewrite; a file
   that passes is recorded — one `pending` row per item, Source the
   proposal's path and the item's number, Stage `t2`, since the close is
   what recommends it — and you send the session `release: /clear this window`,
   mark its row `cleared`, and tell the human, in your own window,
   `<role> <name> released — its work is in <paths>; no step needs it — /clear its window when convenient`.
   No recommender runs here, and no delete request goes out.
3. The rows wait for the close, where steps 2 to 4 of "The four steps" run
   over them with everything else; fill their Written column from the
   close's commit subject.

The session's judgment was spent writing the proposal, and the file holds
it: the close's recommender quotes every item in full from that file, which
is what the human checks. What another session pays for an exit is the
proposal.

A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the window is gone,
a send errors, a `no-role` comes back, or your window wakes for another
reason and the answer has not arrived. Treat the exit as forced, write a
roster Events line saying its exit shoroku did not run and what was lost as
far as you know, mark the row `cleared` on a `no-role` or `dead` on a send
error or an empty listing, and continue. The same Events line goes in
whenever you mark a row `dead`.

**Your own exit.** Propose from the ledger and the roster rather than from
recollection, to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`,
`<name>` being your own bare name, and a second file with `-2` before
`-proposal` for what a close teaches after the first is recorded. At a plan
close the proposal comes before the recommender and its rows are that
close's ("The final batch", step 3). At a handover with any ledger open, the
items are `pending` rows, Stage `t2`, in the ledger of the topic whose
batches are in flight, else the oldest open topic's, and the handover file
names the ledger. Between plans, with no ledger open, they are rows of the
roster's Shoroku proposal items table, and move into the next topic's ledger
when it opens. Nothing else runs at your exit: no recommender, no check, no
apply, no commit. Your window's last text is the "Kanri hands over" line,
the commands, and your closing line.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 14`

Expected: `task 14: verify clean`.

- [ ] **Step 3: Check the `close:` line survived byte for byte**

Run:

```bash
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
```

Expected: `1` on each of the three files.

- [ ] **Step 4: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): Shoroku is propose/recommend/check/apply with one close and no Kanri lane`. End with your own `Co-Authored-By:` trailer.

### Task 15: `roles/kanri.md` — "Session lifecycle", replaced whole

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L1166-1238, from `## Session lifecycle` to the line before `### Readings`)

Spec section 3.9. The whole section is one block. Both blocks below are
fenced with four backticks because each carries a three-backtick fence of
its own. The Replace table's Kikaku/Hosa compaction row is amended by
`.tanto/kikaku/2026-09-17-idle-block-and-hosa-compact.md` §2 and §4.2
(R-6): the spec's own single row is split into a Kikaku half (unchanged in
substance, its `/clear` reminder becoming a `for you` item under Task 10's
idle block instead of an inline aside) and a Hosa half (nothing — the
compaction count arrives in Hosa's next reading, and Hosa has already
confirmed its summary's human-attributed items in its own window per the
same decision's §2).

**Named mechanisms this task touches.** The heading **`### Release`** replacing **`### Delete`**: it is pointed at from "When the plan lands" step 3 (Task 8) and from the handover's step 3 (Task 13), and `grep -c '^### Release$' skills/tanto/roles/kanri.md` becomes `1` with `^### Delete$` at `0` only here. The **create request's numbered list**: its five lines are mirrored in `templates/kanri-handover.md`'s "Commands for the human" (Task 19), and the effort-reset fact behind line 3 is written into `docs/notes/claude-code-sessions-observed.md` (Task 32). The **Jisso queue's size**: also "When the plan lands" step 4 (Task 8), rule 11 (Task 5), and `roles/keikaku.md`'s Step 3 (Task 23). **One clock per clause** — issue-f293's second site — is stated in this section's opening paragraph and nowhere else. The **archive move** now includes `cleared` rows: `templates/roster-archive.md`'s two enumerations carry the same set (Task 18).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O15.1** `Open a new session in <repo path>` — 2 in the swept tree: `skills/tanto/roles/kanri.md` 1 (here) and `skills/tanto/templates/kanri-handover.md` 1 (Task 19). Must be 1 after this task and 0 after Task 19.

**O15.2** `delete and create` — `skills/tanto/roles/kanri.md` 4, all in the Replace table. Must be 0 after P15.1.

**O15.3** `Jisso has carried the batches the plan expects of one session` — `skills/tanto/roles/kanri.md` 2, both in the Replace table. Must be 0 after P15.1.

**O15.4** `Jisso replacement deferred` — after Task 13, 2 in the swept tree: `skills/tanto/roles/kanri.md` 1 (the Replace table's ceiling row, here) and `skills/tanto/templates/kanri.md` 1 (Task 20). Must be 1 after this task and 0 after Task 20.

**O15.5** `ask the human to delete` — after Tasks 11, 13 and 14, whatever remains of today's 9 is in this section. Must be 0 after P15.1; if it is not, a site outside the three whole-section blocks was missed and belongs in this plan.

**O15.6** `create or delete` — `skills/tanto/roles/kanri.md` 3 today; Task 10 clears two of them (P10.1's original form and step 7 (c)'s), and the remaining one is here. Must be 0 after P15.1.

**O15.7** `the sessions deleted at this close` — `skills/tanto/roles/kanri.md` 1, the plan-closed row. Must be 0 after P15.1.

- [ ] **Step 1: Apply the whole-section replacement**

**P15.1** `skills/tanto/roles/kanri.md` — replace exactly these 73 lines

`````text
## Session lifecycle

The human is the only actor who can create or delete a session, and you are the
only role that asks. Every create request is this numbered list, which the
human can paste, with your own bare name as your start line printed it in place
of `<name>`:

```text
1. Open a new session in <repo path>.
2. /model <family>
3. /effort <level>
4. Make sure the session is in auto mode.
5. /tanto <role> <name>
```

Line 5 carries, after the command, what the Create table's third column names
for that role. The family and the level are `sessions.<role>` from
`tanto.json`, and they come before the command because the human forgets the
effort more often than the model. A delete request is a numbered list of its
own, one line per item.

### Create

| When | Ask the human to | The request line carries |
| --- | --- | --- |
| bootstrap | nothing; the human opens a session and runs `/tanto kanri` | — |
| a plan is committed and your cold read has no open questions | create Jisso | `/tanto jisso <name>`, the plan path, the branch |
| the spec review is accepted | create Keikaku | `/tanto keikaku <name>`, the topic, the spec path |
| the first batch of the current plan is accepted, or every open topic has passed its spec stage | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei <name>`, the topic if known |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki <name>`; the brief follows the handshake |
| — | nothing; Kikaku and Hosa are opened by the human and never requested by you | — |

### Replace

| Symptom | Action |
| --- | --- |
| Jisso is gone — not in `ListAgents`, `SendMessage` errors, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); ask the human to delete the dead session and create a new Jisso; the next prompt says `resume batch X from task N`; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Jisso context decay — its reading shows a compaction, two consecutive batches needed escalation, or a report says compaction lost rulings | at the batch boundary, ask the human to delete and create; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Jisso's ceiling line says `over` | run `--presence` on your own transcript at that boundary. `present` — run "Exit shoroku" and ask the human to delete and create, the next prompt saying `resume batch X from task N` as for any replacement. `absent` — defer: write the ledger's Progress clause `Jisso replacement deferred (absent, context=<n>, since batch <X>)`, a roster Events line of the same shape as a deferred handover's, and the batch prompt's one-line notice, then re-check at the next boundary. Never at the final batch's boundary: Jisso exits after T2 in any case. The row "Jisso has carried the batches the plan expects of one session" stays — a plan that names the batch count one session should carry still binds — and this row is the measured form of the same idea; a replaced Jisso's baseline is its own first turn, so the ceiling resets with the seat, and the SDD ledger and the batch reports are the recovery point as for any replacement |
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then ask the human to delete and create; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "Exit shoroku", then ask the human to delete and create; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
| a Kikaku's or a Hosa's reading shows a compaction | neither is replaced: remind the human to `/clear` that window, mark the row `cleared`, and let the next `/tanto kikaku` or `/tanto hosa` handshake write a new row — what the session produced is already on disk or committed |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then ask the human to delete it and, if the case is open, create a new Kaiseki with the same brief |
| Jisso has carried the batches the plan expects of one session | replace it at the next boundary, exit shoroku first |
| A handover trigger fired at a boundary | run the Handover section; the successor asks for your deletion |
| Sekkei is gone before the spec review is accepted | ask the human to create a new Sekkei; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Keikaku is gone before the plan is committed | ask the human to create a new Keikaku; the spec on the branch and the plan draft on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; ask the human to create a new Kaiseki; the brief and the WIP commit are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |

Never replace mid-batch on suspicion. Wait for the boundary, or confirm the
session is dead first — uncommitted work may be in the tree.

### Delete

| When | Say |
| --- | --- |
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the exit proposal | Sekkei is done; record its proposal's items and the spec's four sections as `pending` rows and ask for its deletion as soon as the proposal passes the form check — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the `coldread answered:` line named the exit proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; record its proposal's items as `pending` rows and ask for its deletion as soon as the proposal passes the form check; a Keikaku is never reused across topics (decision-f496) |
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; record its proposal's items as `pending` rows and ask for its deletion as soon as the proposal passes the form check, or keep it if more of the same bug is expected |
| the final batch is accepted, T2's proposal is written and passes the form check, and leftovers are clean | Jisso is done; ask for its deletion at once, T2 being its exit — the recommendation, the human's check, the apply, and the merge decision run with it gone, and a merge declined with fixes wanted is a new batch on a new Jisso either way |
| the close's apply is verified, the human has executed the merge decision, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every handshake the ledger's Session events accepted for it — Sekkei, Keikaku, Jisso, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then ask the human, in one line and in the chat's language, for the Account & Usage view's own figure for the day, and record it beside the proxy — the two are compared, not equated, since that view counts every other workspace and every subagent — and a silence is an answer and a blank. Then mark `dead` the rows of the sessions deleted at this close, move the dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |

The role is resident; the session that carries it is not. A plan's end is a
boundary like any other for the run, and the next topic starts with a new topic
directory and a new ledger under the same roster, cold-read as if fresh —
normally by your successor, because the close hands the role over
(decision-b6cb), and by you when the human declines that handover. Your only
exit is the Handover section above.

Neither `.tanto/<topic>/` nor the SDD workspace
`.superpowers/sdd/<plan-basename>/` is deleted at the close, and you ask the
human about neither. After T2 the two have the same standing: untracked,
local to one machine, and useful only for a later re-read (issue-12d3).
`````

**P15.1 →**

`````text
## Session lifecycle

The human is the only actor who can give a window a role or take one away,
and you are the only role that asks. A window is `/clear`ed and reused,
never closed: a session is identified by its transcript path, a window by
its `name [ref]`, which survives `/clear` (measured 2026-09-16), and the
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
`tanto.json`, and they come before the command because the human forgets the
effort more often than the model — and because `/clear` resets the effort
to the default while it keeps the model (measured 2026-09-16), so line 3 is
never redundant in a reused window. For the plan's Jissos the list is sent
once and says how many windows it is for. There is no delete request: a
seat's exit ends with your `release:` line to it, and one line to the
human in your own window — `<role> <name> released — its work is in <paths>;
no step needs it — /clear its window when convenient`. A line of yours that
speaks of a release and of a creation keeps them in two clauses with their
own times — "released now; a fresh Keikaku is requested at
`<topic>`'s merge" — never one clause for both.

### Create

| When | Ask the human to | The request line carries |
| --- | --- | --- |
| bootstrap | nothing; the human opens a session and runs `/tanto kanri` | — |
| a plan is committed and your cold read has no open questions | queue the plan's Jissos: N windows, N the rows of the plan's Batches table plus one for the fix wave; more if the human wants, fewer if they will be present to re-queue released windows | `/tanto jisso <name>`, N, the plan path, the branch |
| the queue is empty and a batch, a fix wave, or a resume needs a Jisso | queue one more Jisso — a released window serves | `/tanto jisso <name>`, the plan path, the branch |
| the spec review is accepted | create Keikaku | `/tanto keikaku <name>`, the topic, the spec path |
| the first batch of the current plan is accepted, or every open topic has passed its spec stage | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei <name>`, the topic if known |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki <name>`; the brief follows the handshake |
| — | nothing; Kikaku and Hosa are opened by the human and never requested by you | — |

### Replace

| Symptom | Action |
| --- | --- |
| the live Jisso is gone — not in `ListAgents`, `SendMessage` errors, a `no-role` came back, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); mark the row `dead`, or `cleared` on a `no-role`, with the Events line saying its exit shoroku did not run and what was lost; send the next queued Jisso the prompt for the same batch, its resume line saying `resume batch X from task N`; the queue is one short, and the next boundary's line to the human asks for one more window (the Create table's third row) |
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then the create request; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "Exit shoroku", then the create request; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
| a Kikaku's reading shows a compaction | not replaced: mark the row `cleared`, add its `/clear` as a `for you` item instead of saying it inline, and let the next `/tanto kikaku` handshake write a new row — what the session produced is already on disk or committed |
| a Hosa's reading shows a compaction | nothing: the count arrives in its next reading, and the Hosa has already confirmed its summary's human items in its own window before continuing |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then, if the case is open, the create request with the same brief |
| A handover trigger fired at a boundary | run the Handover section; the successor reminds the human to `/clear` your window when it starts elsewhere |
| Sekkei is gone before the spec review is accepted | the create request; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Keikaku is gone before the plan is committed | the create request; the spec on the branch and the plan draft on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; the create request; the brief and the WIP commit are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |

A Jisso's ceiling verdict and a compaction in its reading are no longer
symptoms: one Jisso runs one batch, and the rotation retires it at the
boundary. The figures are recorded in its Residency row and kept by the
archive. Never replace mid-batch on suspicion. Wait for the boundary, or
confirm the session is gone first — uncommitted work may be in the tree.

### Release

| When | Say |
| --- | --- |
| a batch is accepted at loop step 6 — the plan's last implementation batch excepted, whose Jisso waits for the whole-branch review's verdict ("The final batch", step 2) | its Jisso is done; `release:` to it, its row `cleared`, the released line to the human; the next prompt goes to the next queued Jisso |
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the exit proposal | Sekkei is done; record its proposal's items and the spec's four sections as `pending` rows and send `release:` as soon as the proposal passes the form check — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the `coldread answered:` line named the exit proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; record its proposal's items as `pending` rows and send `release:` as soon as the proposal passes the form check; a Keikaku is never reused across topics (decision-f496) |
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; record its proposal's items as `pending` rows and send `release:` as soon as the proposal passes the form check, or keep it if more of the same bug is expected |
| the final batch is accepted, T2's proposal is written and passes the form check, and leftovers are clean | the last Jisso is done; `release:` at once, T2 being its exit — the recommendation, the human's check, the apply, and the merge decision run with it gone, and a merge declined with fixes wanted is a new batch on a new Jisso either way; a queued Jisso that never ran is named in the same released line for the human to `/clear`, its row `cleared` |
| the close's apply is verified, the human has executed the merge decision, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every handshake the ledger's Session events accepted for it — Sekkei, Keikaku, every Jisso, queued ones that never ran included, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then ask the human, in one line and in the chat's language, for the Account & Usage view's own figure for the day, and record it beside the proxy — the two are compared, not equated, since that view counts every other workspace and every subagent — and a silence is an answer and a blank. Then mark `dead` the rows of any session no longer listed, move the dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |

The role is resident; the session that carries it is not. A plan's end is a
boundary like any other for the run, and the next topic starts with a new topic
directory and a new ledger under the same roster, cold-read as if fresh —
normally by your successor, because the close hands the role over
(decision-b6cb), and by you when the human declines that handover. Your only
exit is the Handover section above.

Neither `.tanto/<topic>/` nor the SDD workspace
`.superpowers/sdd/<plan-basename>/` is deleted at the close, and you ask the
human about neither. After T2 the two have the same standing: untracked,
local to one machine, and useful only for a later re-read (issue-12d3).
`````

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 15`

Expected: `task 15: verify clean`.

- [ ] **Step 3: Check the table heading renamed**

Run:

```bash
grep -c '^### Release$' skills/tanto/roles/kanri.md; grep -c '^### Delete$' skills/tanto/roles/kanri.md
```

Expected: `1` then `0`. Both pointers at this heading — "When the plan lands" step 3 and the handover's step 3 — were rewritten in Tasks 8 and 13 and now resolve.

- [ ] **Step 4: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): the lifecycle creates, replaces and releases — no session is deleted`. End with your own `Co-Authored-By:` trailer.

### Task 16: `roles/kanri.md` — "Readings" and "Recovery after a VS Code restart"

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L1246-1247, L1269-1271)

The last two sentences of spec section 3.10. This finishes `roles/kanri.md`.

**Named mechanisms this task touches.** The **doubted-reading list** names the ceiling verdict's one consumer, which `SKILL.md`'s `ceiling` bullet (Task 1), loop step 6 (Task 9), the Replace table (Task 15), `roles/jisso.md` (Task 21) and `roles/kaiseki.md` (Task 24) all now say is Kanri's alone. The **recovery order** defers to the Replace table's first row (Task 15) for a Jisso.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O16.1** `line decides a replacement` — `skills/tanto/roles/kanri.md` 1, Readings. Must be 0 after P16.1.

**O16.2** `flight, Kaiseki only if a bug is open` — `skills/tanto/roles/kanri.md` 1, Recovery's third line, where the queued-row condition is inserted between the two clauses. The preceding `Jisso only if a batch is in` survives the edit and is deliberately not the needle. Must be 0 after P16.2.

- [ ] **Step 1: Apply the two passages**

**P16.1** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
session whose report lost a ruling with `0 compactions`, one whose ceiling
line decides a replacement, or one that sent
```

**P16.1 →**

```text
session whose report lost a ruling with `0 compactions`, your own whose
ceiling line decides a handover, or one that sent
```

**P16.2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
human says the windows are done. Verify the tree if a batch was in flight, then
ask for the roles still missing, in this order: Jisso only if a batch is in
flight, Kaiseki only if a bug is open, Keikaku only if a plan is in progress,
```

**P16.2 →**

```text
human says the windows are done. Verify the tree if a batch was in flight, then
ask for the roles still missing, in this order: Jisso only if a batch is in
flight and no `queued` row re-handshook — the next queued Jisso resumes the
batch otherwise, as the Replace table's first row says — Kaiseki only if a
bug is open, Keikaku only if a plan is in progress,
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 16`

Expected: `task 16: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): the ceiling decides only Kanri's handover, and a queued Jisso resumes after a restart`. End with your own `Co-Authored-By:` trailer.

### Task 17: `templates/roster.md`

**Files:**

- Modify: `skills/tanto/templates/roster.md` (L7-14, L15-23, L24, L31-33, L35-43, L58-60, L73, L75-79, L81-87, L89, L91, after L102, L104-105)

Spec sections 7.1 and the roster part of 7.6. Thirteen blocks, all in one file; the spec's 7.1 also names `a candidate raised by` and `the first candidate arrives`, and both fall inside blocks 7.6 gives — P17.8 and P17.9 — so they are not separate passages.

**Named mechanisms this task touches.** The **Status vocabulary**: also `SKILL.md`'s Handshake and roster (Task 2), `roles/kanri.md`'s handshake (Task 7), Replace and Release tables (Task 15), and `templates/roster-archive.md` (Task 18). The **heading `## Shoroku proposal items`**: also `templates/kanri.md` (Task 20); `docs/notes/tanto-consistency-checks.md` check 6 pins this heading and the table's header row by grep and is updated in Task 31; `roles/hosa.md` names the table (Task 25) and `roles/kanri.md`'s "Shoroku" names it twice (Task 14). The **seven-column header row**: the same row is in `templates/kanri.md` (Task 20) and pinned twice in check 6 (Task 31). The **Events forms**: `cleared:` is pinned by check 6 (Task 31); the three new ones — `queued:`, `released:`, `no-role from` — are written by `roles/kanri.md`'s handshake (Task 7), loop step 6 (Task 9) and "Shoroku" (Task 14).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O17.1** `One row per role and topic, Kanri's own row first.` — `skills/tanto/templates/roster.md` 1. Must be 0 after P17.1.

**O17.2** `one row per live role and topic` — `skills/tanto/templates/roster.md` 1, the address-book bullet inside P17.2's block, where the roster stops being one row per live role. The block's first bullet opens with words the new text keeps, so this is the run that spans a change point. Must be 0 after P17.2.

**O17.3** `Kanri dispatches nothing to a session` — `skills/tanto/templates/roster.md` 1; its twin in `roles/kanri.md` (`Dispatch nothing to a session that has no accepted roster row.`) went in Task 7, and both spellings are needles because the rule is stated in two files in different words. Must be 0 after P17.3.

**O17.4** `Topic is the topic word Kanri's orders line gave that session, or` — after Task 2, 1 in the swept tree: here. Must be 0 after P17.4.

**O17.5** `records a Kikaku or Hosa row the human` — `skills/tanto/templates/roster.md` 1, the Status paragraph's `cleared` sentence, which the new text widens to every role. Must be 0 after P17.5. The paragraph's opening words `Status is one of` are deliberately not the needle: they survive the edit, and a needle that survives reads as "not fixed" whichever way the block went.

**O17.6** `pacing. The last three columns` — `skills/tanto/templates/roster.md` 1, the Residency paragraph, where the queued-row sentences are inserted between the two. Must be 0 after P17.6.

**O17.7** `## Shoroku candidates` — 4 in the swept tree today: `templates/batch-report.md`, `templates/kaiseki-report.md`, `templates/kanri.md`, `templates/roster.md`, 1 each. P17.7 clears this file's; Tasks 20 and 28 clear the other three. Must be 3 after this task and 0 after Task 28.

**O17.8** `Between plans there is no conductor ledger, so a candidate` — `skills/tanto/templates/roster.md` 1. Must be 0 after P17.8.

**O17.9** `first candidate arrives.` — `skills/tanto/templates/roster.md` 1, the Columns paragraph; `templates/kanri.md`'s twin reads `until the first candidate` and is Task 20's. Must be 0 after P17.9.

**O17.10** `| Candidate |` — 2 in the swept tree: `templates/roster.md` (P17.10) and `templates/kanri.md` (Task 20). Must be 1 after this task and 0 after Task 20.

**O17.11** `(no candidate yet)` — 2 in the swept tree, the same two files. Must be 1 after this task and 0 after Task 20.

**O17.12** `committed by <name> [<ref>], or not run` — `skills/tanto/templates/roster.md` 1. Must be 0 after P17.12.

- [ ] **Step 1: Apply the twelve passages and the anchor**

**P17.1** `skills/tanto/templates/roster.md` — replace exactly these 8 lines

```text
- One row per role and topic, Kanri's own row first.
- One live session per role and topic; Kanri, Kikaku, and Hosa one each. A
  second handshake for a role and topic that already has a live row gets no
  row and is reported to the human.
- Every handshake rewrites that role's row in full. A handshake whose
  `transcript=` matches a row's Transcript column is that row's session
  resumed, and rewrites the row in place with the new name and `[ref]`, status
  `live`.
```

**P17.1 →**

```text
- One row per session that handshook, Kanri's own row first — a plan's
  queued Jissos each have one.
- One live session per role and topic, the plan's other Jissos `queued`;
  Kanri, Kikaku, and Hosa one each. A second handshake for a role and topic
  that already has a live row gets no row and is reported to the human; a
  Jisso handshake while one is live is queued, not refused.
- Every handshake rewrites that role's row in full. A handshake whose
  `transcript=` matches a row's Transcript column is that row's session
  resumed, and rewrites the row in place with the new name and `[ref]`, its
  status unchanged. A handshake whose name is on a `live` or `queued` row
  with a different transcript is that window `/clear`ed and re-invoked, in
  any role: the old row goes `cleared`, and a new row is written.
```

**P17.2** `skills/tanto/templates/roster.md` — replace exactly these 9 lines

```text
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
  A dead, replaced, refused, or cleared row stays, with its Residency row,
  until the plan closes, then both move to `roster-archive.md` as one row, so
  the run stays readable after a replacement and the roster stays short.
- This is the address book: one row per live role and topic, Kanri's row
  first, the `Name [ref]` column being the address the row's session answers
  to, used as the bare name. It stays correct because nothing renames a
  session. The `[ref]` is load-bearing: it identifies a session across the
  listing, the roster, and the handover.
```

**P17.2 →**

```text
- A row whose session is no longer listed by `ListAgents` gets status `dead`
  — a closed tab, a crash, an editor restart before `/tanto fukki`; a
  cleared window stays listed under its name, so this never detects a
  `/clear`. A dead, replaced, refused, or cleared row stays, with its
  Residency row, until the plan closes, then both move to
  `roster-archive.md` as one row, so the run stays readable after a
  replacement and the roster stays short.
- This is the address book: one row per session, Kanri's row first, the
  `Name [ref]` column being the address the row's session answers to, used
  as the bare name, and Kanri sends only to `live` rows. It stays correct
  because nothing renames a session, and a `/clear` keeps the name. The
  `[ref]` is load-bearing: it identifies a window across the listing, the
  roster, and the handover.
```

**P17.3** `skills/tanto/templates/roster.md` — replace exactly these 1 lines

```text
- Kanri dispatches nothing to a session that has no accepted row here.
```

**P17.3 →**

```text
- Kanri sends only to `live` rows, and dispatches nothing to a session that
  has no accepted row here.
```

**P17.4** `skills/tanto/templates/roster.md` — replace exactly these 3 lines

```text
Topic is the topic word Kanri's orders line gave that session, or `—` for
Kanri, Kikaku, Hosa, and a standalone Kaiseki. Effort is what the handshake's
`effort=` carried.
```

**P17.4 →**

```text
Topic is the topic word Kanri's orders line gave that session — for a Jisso,
the topic whose queue its handshake joined: the plan whose batches are in
flight, or, with none in flight, the plan whose landing requested the queue
— or `—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Effort is what
the handshake's `effort=` carried.
```

**P17.5** `skills/tanto/templates/roster.md` — replace exactly these 9 lines

```text
Status is one of `live`, `dead`, `replaced`, `refused`, and `cleared`.
`refused` records a handshake that got no row — a second live session for the
same role and topic, or a model that did not match `sessions.<role>` — and is
always followed by an Events line saying which; a second Sekkei or Keikaku
whose topic differs from the live one's is not a duplicate and gets its own
row. `cleared` records a Kikaku or Hosa row the human's `/clear` ended: a
handshake whose `transcript=` matches no row, or whose name is already here
with a different transcript, and whose role is Kikaku or Hosa, writes a new
row and marks the old one `cleared`.
```

**P17.5 →**

```text
Status is one of `queued`, `live`, `cleared`, `replaced`, `dead`, and
`refused`. `queued` is a Jisso waiting for its batch prompt, in handshake
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

**P17.6** `skills/tanto/templates/roster.md` — replace exactly these 3 lines

```text
every place a reading lands. Kikaku sends no reading and its reading columns
stay blank: it is the human's own seat, and its cost is the human's own
pacing. The last three columns are Kanri's only — batches accepted,
```

**P17.6 →**

```text
every place a reading lands. Kikaku sends no reading and its reading columns
stay blank: it is the human's own seat, and its cost is the human's own
pacing. A queued Jisso's stay blank until its boundary, and a queued row
that never ran moves to the archive with its blanks. The last three columns
are Kanri's only — batches accepted,
```

**P17.7** `skills/tanto/templates/roster.md` — replace exactly these 1 lines

```text
## Shoroku candidates
```

**P17.7 →**

```text
## Shoroku proposal items
```

**P17.8** `skills/tanto/templates/roster.md` — replace exactly these 5 lines

```text
Between plans there is no conductor ledger, so a candidate raised by a
between-plans triage, or by Kanri's own between-plans exit, is recorded here
with the same seven columns the ledger uses. When a topic opens, Kanri moves
the rows whose Written column says `no` into the new ledger's table and leaves
the written ones here as the record.
```

**P17.8 →**

```text
Between plans there is no conductor ledger, so an item raised then — by a
between-plans triage or a Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's `-2-proposal.md` — is recorded here with
the same seven columns the ledger uses. When a topic opens, Kanri moves the
rows into the new ledger's table; nothing is written out from this table
itself, so every row here says `no` until it moves.
```

**P17.9** `skills/tanto/templates/roster.md` — replace exactly these 7 lines

```text
Columns as the ledger's, with Source the triage, report, or session that
raised it; Destination one of requirements, design, decisions, issues, notes,
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word —
`exit-kanri-<YYYY-MM-DD>-<name>` for a row a between-plans Kanri exit
recommends, and `t2` once a row moves into a ledger; and Written `no` or the subject
of the commit that wrote the row out. The placeholder row stays until the
first candidate arrives.
```

**P17.9 →**

```text
Columns as the ledger's, with Source the triage, report, or session that
raised it; Destination one of requirements, design, decisions, issues, notes,
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word
`t2` for every row, the close of the topic the row moves into being what
recommends it; and Written `no` or the subject of the commit that wrote the
row out. The placeholder row stays until the first item arrives.
```

**P17.10** `skills/tanto/templates/roster.md` — replace exactly these 1 lines

```text
| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
```

**P17.10 →**

```text
| S-n | Source | Item | Destination | Adopted | Stage | Written |
```

**P17.11** `skills/tanto/templates/roster.md` — replace exactly these 1 lines

```text
| (no candidate yet) | | | | | | |
```

**P17.11 →**

```text
| (no item yet) | | | | | | |
```

**P17.12** `skills/tanto/templates/roster.md` — insert after these 1 lines

```text
  cleared: <old name> → <new name>;
```

**P17.12 →**

```text
  queued: <name> [<ref>] as Jisso <n> of <topic>;
  released: <name> [<ref>] — <role>, <what it left on disk>;
  no-role from <name> [<ref>] — <what was lost>;
```

**A17.1** `skills/tanto/templates/roster.md` — `grep -cF 'released: <name> [<ref>] — <role>, <what it left on disk>;' skills/tanto/templates/roster.md` — before: 0, after: 1

**P17.13** `skills/tanto/templates/roster.md` — replace exactly these 2 lines

```text
  a handover accepted by <name> [<ref>] from <name> [<ref>]; an exit shoroku
  committed by <name> [<ref>], or not run and what was lost; a bug report
```

**P17.13 →**

```text
  a handover accepted by <name> [<ref>] from <name> [<ref>]; an exit shoroku
  proposed by <name> [<ref>], or not run and what was lost; a bug report
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 17`

Expected: `task 17: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/templates/roster.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/templates/roster.md
```

Subject: `docs(tanto): the roster carries queued rows, cleared windows, and Shoroku proposal items`. End with your own `Co-Authored-By:` trailer.

### Task 18: `templates/roster-archive.md`

**Files:**

- Modify: `skills/tanto/templates/roster-archive.md` (L4-5, L14)

Spec section 7.6's two status enumerations.

**Named mechanisms this task touches.** The **archived status set** — `dead`, `replaced`, `refused`, `cleared`: the same set is in `templates/roster.md`'s fourth keeping bullet (Task 17) and in `roles/kanri.md`'s plan-closed Release row (Task 15); the note about a `queued` row that never ran moving as `cleared` matches `templates/roster.md`'s Residency paragraph (Task 17) and the Release table's last-Jisso row (Task 15).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

The first paragraph's enumeration is nothing but backticked status words and a phrase the new text keeps, so it has no plain-text needle; it is checked by an anchor instead:

**A18.1** `skills/tanto/templates/roster-archive.md` — `grep -c 'refused., each with its last Residency' skills/tanto/templates/roster-archive.md` — before: 1, after: 0

**O18.1** `<dead, replaced, or refused>` — `skills/tanto/templates/roster-archive.md` 1, the row skeleton. Must be 0 after P18.2, and `grep -c '<dead, replaced, refused, or cleared>' skills/tanto/templates/roster-archive.md` must be `1`.

- [ ] **Step 1: Apply the two passages**

**P18.1** `skills/tanto/templates/roster-archive.md` — replace exactly these 2 lines

```text
Kanri is the only writer, and writes it at a plan close: the roster rows whose
status is `dead`, `replaced`, or `refused`, each with its last Residency
```

**P18.1 →**

```text
Kanri is the only writer, and writes it at a plan close: the roster rows whose
status is `dead`, `replaced`, `refused`, or `cleared` — a `queued` row that
never ran moving as `cleared` — each with its last Residency
```

**P18.2** `skills/tanto/templates/roster-archive.md` — replace exactly these 1 lines

```text
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, or refused> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |
```

**P18.2 →**

```text
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, refused, or cleared> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 18`

Expected: `task 18: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/templates/roster-archive.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/templates/roster-archive.md
```

Subject: `docs(tanto): the archive takes cleared rows, a never-run queued row included`. End with your own `Co-Authored-By:` trailer.

### Task 19: `templates/kanri-handover.md`

**Files:**

- Modify: `skills/tanto/templates/kanri-handover.md` (L23-26, L29-32, L36-37, L79-80, L86-87)

Spec sections 7.3 and the handover-file part of 7.6.

**Named mechanisms this task touches.** The **Deferred slot** now covers a handover only: also `templates/kanri.md`'s Progress line and deferrals row (Task 20), `templates/batch-prompt.md`'s previous-batch-verdict lines (Task 27), `roles/kanri.md`'s handover-file sentence (Task 13) and loop step 6 (Task 9). The **delegated-close line** loses `kanri` as a topic: also `roles/hosa.md`'s "The close's." (Task 25) and `roles/kanri.md`'s "Delegation to Hosa" (Task 14). The **commands for the human** mirror the Create table's five-line list (Task 15), including the `/effort` line the `/clear` reset makes necessary. **Live peers** listing `queued` Jissos without addressing them: also `roles/kanri.md`'s handover file paragraph (Task 13) and `SKILL.md`'s address bullet (Task 2).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

The `handover deferred (absent, …)` clause itself survives this edit in all three files that carry it — `roles/kanri.md`, `templates/kanri.md`, `templates/kanri-handover.md` — so it is not a needle; only the Jisso half goes.

**O19.1** `Jisso replacement stands deferred` — 2 in the swept tree: `skills/tanto/templates/kanri-handover.md` 1 (P19.1) and `skills/tanto/roles/kanri.md` 1 (Task 13 clears it). The phrase wraps after `a handover or a`, which is why the needle starts at `Jisso`. Must be 0 after P19.1.

**O19.2** `or the roster for a Kanri exit` — `skills/tanto/templates/kanri-handover.md` 1, the bullet's last clause. Must be 0 after P19.2.

**O19.3** `Every peer of every open topic` — `skills/tanto/templates/kanri-handover.md` 1. Must be 0 after P19.3.

**O19.4** `shoroku candidate the` — `skills/tanto/templates/kanri-handover.md` 1, "Not reconstructed". Must be 0 after P19.4.

**O19.5** `Open a new session in <repo path>` — after Task 15, 1 in the swept tree: here. Must be 0 after P19.5.

**O19.6** `When the new Kanri asks, delete this session.` — `skills/tanto/templates/kanri-handover.md` 1. Must be 0 after P19.5.

- [ ] **Step 1: Apply the five passages**

**P19.1** `skills/tanto/templates/kanri-handover.md` — replace exactly these 4 lines

```text
  - Deferred — <the ledger's Progress clause, verbatim, when a handover or a
    Jisso replacement stands deferred on the ceiling and the human's absence;
    "none" otherwise. The successor re-checks it at its own first check, where
    a `present` verdict runs what the outgoing session could not.>
```

**P19.1 →**

```text
  - Deferred — <the ledger's Progress clause, verbatim, when a handover
    stands deferred on the ceiling and the human's absence; "none"
    otherwise. The successor re-checks it at its own first check, where a
    `present` verdict runs what the outgoing session could not.>
```

**P19.2** `skills/tanto/templates/kanri-handover.md` — replace exactly these 4 lines

```text
- A close delegated to Hosa — <`<topic>` or `kanri`, Hosa's `<name> [<ref>]`,
  the `close:` line's paths and subject, and whether `close done:` has
  arrived, or "none">; the successor verifies the commit on `close done:`
  and fills the ledger, or the roster for a Kanri exit
```

**P19.2 →**

```text
- A close delegated to Hosa — <`<topic>`, Hosa's `<name> [<ref>]`, the
  `close:` line's paths and subject, and whether `close done:` has arrived,
  or "none">; the successor verifies the commit on `close done:` and fills
  the ledger
```

**P19.3** `skills/tanto/templates/kanri-handover.md` — replace exactly these 2 lines

```text
Every peer of every open topic, with its Topic as the roster carries it; the
successor sends `kanri-address:` to all of them.
```

**P19.3 →**

```text
Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor sends `kanri-address:` to all of them. Then the `queued`
Jissos, by name and place — the successor sends them nothing; their batch
prompt names it.
```

**P19.4** `skills/tanto/templates/kanri-handover.md` — replace exactly these 2 lines

```text
  path, when a ledger was open at the exit; then a shoroku candidate the
  outgoing Kanri could not classify or reconstruct, one line each, for the
```

**P19.4 →**

```text
  path, when a ledger was open at the exit; then a proposal item the
  outgoing Kanri could not classify or reconstruct, one line each, for the
```

**P19.5** `skills/tanto/templates/kanri-handover.md` — replace exactly these 2 lines

```text
1. Open a new session in <repo path> and run `/tanto kanri`.
2. When the new Kanri asks, delete this session.
```

**P19.5 →**

```text
1. /clear this window — or pick any free window of <repo path>.
2. /model <family> and /effort <level>, as `sessions.kanri` says; /clear
   keeps the model and resets the effort.
3. /tanto kanri
4. If the new Kanri started elsewhere, /clear this window when convenient.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 19`

Expected: `task 19: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/templates/kanri-handover.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/templates/kanri-handover.md
```

Subject: `docs(tanto): the handover file lists queued Jissos and hands the window over by /clear`. End with your own `Co-Authored-By:` trailer.

### Task 20: `templates/kanri.md`

**Files:**

- Modify: `skills/tanto/templates/kanri.md` (L11-14, L49, L51-59, L61, L63, L66, L86, L91, L99-102, L112-113, L123-124)

Spec sections 7.5 and the ledger part of 7.6, plus the two `candidate` words in this file that no spec passage reaches — the "Nothing is adopted here" paragraph's `batch report's Shoroku candidates` and the Written column's `a candidate two closes could claim`. Without them batch D's case-insensitive sweep cannot reach `0`. `P20.11` (L99-102) is a fifth site beyond the Kikaku amendment's own four (`.tanto/kikaku/2026-09-17-idle-block-and-hosa-compact.md`, plan-review finding 4): rule 4 turns this section into the source the idle block's `for you` list reads, but the amendment's own placement list does not name this template. This finishes batch B.

**Named mechanisms this task touches.** The **heading `## Shoroku proposal items`** and the **seven-column header row**: the twins are in `templates/roster.md` (Task 17) and both are pinned by `docs/notes/tanto-consistency-checks.md` check 6 (Task 31). The **deferral clause**: also `templates/kanri-handover.md` (Task 19), `templates/batch-prompt.md` (Task 27), `roles/kanri.md` (Tasks 9, 13). The **Measurements rows** for context: loop step 6 writes them (Task 9), and Jisso's figure is now per-seat rather than per-boundary-delta.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O20.1** `Jisso replacement deferred` — after Task 15, 1 in the swept tree: here. Must be 0 after P20.1, and `grep -cF 'Jisso replacement deferred' skills/tanto/templates/kanri.md` must be `0`.

**O20.2** `## Shoroku candidates` — after Task 17, 3 in the swept tree; P20.2 clears this file's. Must be 2 after this task and 0 after Task 28.

**O20.3** `the file the candidate lives in` — `skills/tanto/templates/kanri.md` 1. Must be 0 after P20.3.

**O20.4** `until the first candidate` — `skills/tanto/templates/kanri.md` 1. Must be 0 after P20.3.

**O20.5** `| Candidate |` — after Task 17, 1 in the swept tree: here. Must be 0 after P20.4.

**O20.6** `(no candidate yet)` — after Task 17, 1 in the swept tree: here. Must be 0 after P20.5.

**O20.7** `batch report's Shoroku candidates` — `skills/tanto/templates/kanri.md` 1. Must be 0 after P20.6.

**O20.8** `a candidate two closes could claim` — 2 in the swept tree today: `skills/tanto/roles/kanri.md` 1 (cleared by Task 14) and `skills/tanto/templates/kanri.md` 1 (P20.7). Must be 0 after P20.7.

**O20.9** `a create, replace, or delete request` — `skills/tanto/templates/kanri.md` 1. Must be 0 after P20.8.

**O20.10** `jisso context=<n> (+<d>)` — `skills/tanto/templates/kanri.md` 1. Must be 0 after P20.9.

**O20.11** `Kanri and Jisso never deferred` — `skills/tanto/templates/kanri.md` 1; the needle wraps as `kanri or jisso` in the same table, which is inside P20.9. Must be 0 after P20.10.

**O20.12** `the sixth at any deferral` — `skills/tanto/templates/kanri.md` 1. Must be 0 after P20.10.

**O20.13** `and escalated shoroku items belong here` — `skills/tanto/templates/kanri.md` 1, the Open questions placeholder; the amendment's fifth site (plan-review finding 4). Must be 0 after P20.11.

- [ ] **Step 1: Apply the eleven passages**

**P20.1** `skills/tanto/templates/kanri.md` — replace exactly these 4 lines

```text
clause `handover deferred (absent, context=<n>, since <batch X | the spec
stage | the plan stage>)` or
`Jisso replacement deferred (absent, context=<n>, since batch <X>)`, kept
until that handover or replacement runs or the plan closes; or, once a
```

**P20.1 →**

```text
clause `handover deferred (absent, context=<n>, since <batch X | the spec
stage | the plan stage>)`, kept
until that handover runs or the plan closes; or, once a
```

**P20.2** `skills/tanto/templates/kanri.md` — replace exactly these 1 lines

```text
## Shoroku candidates
```

**P20.2 →**

```text
## Shoroku proposal items
```

**P20.3** `skills/tanto/templates/kanri.md` — replace exactly these 9 lines

```text
Columns: S-n, the row id; Source, the file the candidate lives in and its place there — a report and its item, a proposal and its number, the spec and a section heading — so that the close's recommender can follow it;
Candidate, one line; Destination, one of requirements, design, decisions,
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t2` for every row of this table, whichever moment raised
it, since the close is the one stage that recommends a ledger's rows, and
`exit-<role>[-<suffix>]` names a proposal file, never a Stage value; Written,
`no` or the subject of the commit
that wrote the row out. The placeholder row stays until the first candidate
arrives.
```

**P20.3 →**

```text
Columns: S-n, the row id; Source, the file the item lives in and its place there — a report and its item, a proposal and its number, the spec and a section heading — so that the close's recommender can follow it;
Item, one line; Destination, one of requirements, design, decisions,
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t2` for every row of this table, whichever moment raised
it, since the close is the one stage that recommends a ledger's rows, and
`exit-<role>[-<suffix>]` names a proposal file, never a Stage value; Written,
`no` or the subject of the commit
that wrote the row out. The placeholder row stays until the first item
arrives.
```

**P20.4** `skills/tanto/templates/kanri.md` — replace exactly these 1 lines

```text
| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
```

**P20.4 →**

```text
| S-n | Source | Item | Destination | Adopted | Stage | Written |
```

**P20.5** `skills/tanto/templates/kanri.md` — replace exactly these 1 lines

```text
| (no candidate yet) | | | | | | |
```

**P20.5 →**

```text
| (no item yet) | | | | | | |
```

**P20.6** `skills/tanto/templates/kanri.md` — replace exactly these 1 lines

```text
batch report's Shoroku candidates, a Kaiseki report's
```

**P20.6 →**

```text
batch report's Shoroku proposal, a Kaiseki report's
```

**P20.7** `skills/tanto/templates/kanri.md` — replace exactly these 1 lines

```text
counting as written; a candidate two closes could claim is one row in the
```

**P20.7 →**

```text
counting as written; an item two closes could claim is one row in the
```

**P20.8** `skills/tanto/templates/kanri.md` — replace exactly these 1 lines

```text
- <YYYY-MM-DD HH:MM> — <a create, replace, or delete request and the human's
```

**P20.8 →**

```text
- <YYYY-MM-DD HH:MM> — <a create request and the human's answer, a `release:`
  sent, a `queued: <n>` answered, a `no-role` received; a replace and the human's
```

**P20.9** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```text
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's and Jisso's at each boundary, with the delta per batch | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch letter: kanri context=<n> (+<d>), jisso context=<n> (+<d>)>, one entry per check |
| deferrals: where, the role, the context, and the presence verdict | <YYYY-MM-DD, the check> | <batch letter or stage, kanri or jisso, context=<n>, last human turn <m> min ago>, one entry per deferral, or `none` |
```

**P20.9 →**

```text
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's at each boundary with the delta per batch, and each Jisso's at its own boundary | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch letter: kanri context=<n> (+<d>), jisso <name> context=<n>>, one entry per check |
| deferrals: where, the context, and the presence verdict | <YYYY-MM-DD, the check> | <batch letter or stage, context=<n>, last human turn <m> min ago>, one entry per deferred handover, or `none` |
```

**P20.10** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```text
readings of loop step 6; the sixth at any deferral, in whichever stage, and
carries `none` when a plan's Kanri and Jisso never deferred; the seventh at
```

**P20.10 →**

```text
readings of loop step 6; the sixth at any deferred handover, in whichever
stage, and carries `none` when a plan's Kanri never deferred; the seventh at
```

**P20.11** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```text
1. <one line each. Only the four SDD stop classes, a scope or spec change, and
   escalated shoroku items belong here. Everything else is a ruling.>
```

**P20.11 →**

```text
1. <one line each, added when the request is made and removed when it is
   done: the four SDD stop classes, a scope or spec change, escalated
   shoroku items, and every other open act asked of the human — a `/clear`,
   a window to queue, an answer waited on — the idle block's own source for
   its `for you:` list. Everything else is a ruling.>
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 20`

Expected: `task 20: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/templates/kanri.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/templates/kanri.md
```

Subject: `docs(tanto): the ledger's items table, its events, and its measurements follow the rotation`. End with your own `Co-Authored-By:` trailer.

### Task 21: `roles/jisso.md`

**Files:**

- Modify: `skills/tanto/roles/jisso.md` (L4-5, L22-36, L43-44, L58-60, L67, L257, L263-264, L293-295, L297-305)

Spec sections 4.1 to 4.5. This is the whole of `roles/jisso.md`'s change and the first task of batch C. Every closing-line mention below is amended by `.tanto/kikaku/2026-09-17-closing-line-identity.md` (R-7), one of the sites its own section 5 lists: the identity prefix and the optional `sent:` line SKILL.md's Messages defines (Task 3) apply here too.

**Named mechanisms this task touches.** **`queued: <n>`**: also `SKILL.md`'s Handshake and roster (Task 2) and `roles/kanri.md`'s handshake step 4 (Task 7). The **batch prompt as orders**, with its resume line and its "which of the plan's Jissos you are": also `templates/batch-prompt.md`'s title, guard and Setup on resume (Task 27), `roles/kanri.md` loop step 8 (Task 10) and "When the plan lands" step 5 (Task 8). The **pre-flight scan for the first Jisso only**: also `templates/batch-prompt.md`'s Setup on resume (Task 27). The **closing line**: `SKILL.md`'s Messages (Task 3) and every other role file (Tasks 13, 22 to 25) — issue-f293's first site. The **Shoroku proposal section** of the batch report: `templates/batch-report.md` (Task 28), `roles/kanri.md` loop step 3 (Task 9) and "Shoroku" (Task 14).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O21.1** `You own the SDD run, the batch reports` — `skills/tanto/roles/jisso.md` 1. Must be 0 after P21.1.

**O21.2** `Now wait for Kanri's` — `skills/tanto/roles/jisso.md` 1, "Start". Must be 0 after P21.2.

**O21.3** `do not start the next task. At the boundary` — `skills/tanto/roles/jisso.md` 1, "The run". Must be 0 after P21.3.

**O21.4** `is a Replace symptom on Kanri's` — `skills/tanto/roles/jisso.md` 1; its twin in `roles/kanri.md` (`on Jisso's is a Replace symptom`) went in Task 9, and both spellings are needles because the one rule is stated in two files in different words. Must be 0 after P21.4, and `grep -cF 'Replace symptom' skills/tanto/roles/jisso.md skills/tanto/roles/kanri.md` must be `0` on each.

**O21.5** `3. Idle. Kanri verifies the tree` — `skills/tanto/roles/jisso.md` 1. Must be 0 after P21.5.

**O21.6** `sends you its findings as` — `skills/tanto/roles/jisso.md` 1, "The final batch". Must be 0 after P21.7.

**O21.7** `and idle: your deletion follows the` — `skills/tanto/roles/jisso.md` 1, the Propose paragraph's last sentence. Must be 0 after P21.8, and `grep -cF 'your deletion follows' skills/tanto/roles/jisso.md` must be `0`.

**O21.8** `**Your exit** is that same proposal` — `skills/tanto/roles/jisso.md` 1. Must be 0 after P21.9.

**O21.9** `exit-jisso` — after Task 4, 1 in the swept tree: here, inside P21.9's old block. Must be 0 after P21.9. This is what closes issue-0239 (Task 34).

- [ ] **Step 1: Apply the nine passages**

**P21.1** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```text
development, batch by batch. You own the SDD run, the batch reports, the
commits, and the T2 shoroku proposal.
```

**P21.1 →**

```text
development, batch by batch. You own one batch of the SDD run, its report,
and its commits; the plan's last Jisso owns the T2 shoroku proposal.
```

**P21.2** `skills/tanto/roles/jisso.md` — replace exactly these 15 lines

```text
You have done the model check and sent the handshake. Now wait for Kanri's
orders line: it carries the plan path, the conductor ledger path, and the
branch. Do not start without it.

Then, in order:

1. Read the plan and, if it names one, the spec. The spec is the binding
   authority; the plan argues from it.
2. Run superpowers subagent-driven-development's `scripts/sdd-workspace` with
   the plan file to get this plan's workspace, and create or resume
   `progress.md` inside it exactly as that skill prescribes.
3. Read the conductor ledger at the path Kanri gave you. It is read-only for
   you — Kanri is its only writer.
4. Run SDD's pre-flight conflict scan, write its table to the SDD ledger, rule
   on everything it surfaces, and report the result in your first batch report.
```

**P21.2 →**

```text
You have done the model check and sent the handshake. Kanri answers
`queued: <n>` — your place in this plan's queue — and nothing else until
your batch prompt. You are one of the plan's Jissos, and you run **one
batch**: the prompt names it, and it is your orders, carrying the plan
path, the conductor ledger path, the branch, and which of the plan's Jissos
you are. **Until it arrives, read nothing** — not the plan, not the spec,
not the ledger: a waiting seat holds the minimum context, because every
wake-up re-reads all of it, and yours is a window that may wait hours. Your
closing line while you wait says so: no work yet, and the step that needs
this seat is your batch prompt.

On the prompt, in order:

1. Read the plan and, if it names one, the spec. The spec is the binding
   authority; the plan argues from it.
2. Run superpowers subagent-driven-development's `scripts/sdd-workspace` with
   the plan file to get this plan's workspace, and create or resume
   `progress.md` inside it exactly as that skill prescribes — resume, for
   every Jisso but the first: the earlier batches are in it.
3. Read the conductor ledger at the path Kanri gave you. It is read-only for
   you — Kanri is its only writer.
4. **The first Jisso only:** run SDD's pre-flight conflict scan, write its
   table to the SDD ledger, rule on everything it surfaces, and report the
   result in your first batch report. Every later Jisso resumes from the
   task the prompt's resume line names and runs no scan.
```

**P21.3** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```text
A batch is the task range Kanri's prompt names. Execute those tasks, then
**stop and idle** — do not start the next task. At the boundary:
```

**P21.3 →**

```text
A batch is the task range Kanri's prompt names. Execute those tasks, then
**stop and idle** — do not start the next task, and expect none: the next
batch is the next Jisso's. At the boundary:
```

**P21.4** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```text
   You act on neither: Kanri reads the ceiling line with the report's other
   header lines, and a verdict of `over` there is a Replace symptom on Kanri's
   side, gated on the human's presence and never your own decision. When the
```

**P21.4 →**

```text
   You act on neither: Kanri reads the ceiling line with the report's other
   header lines and records it — a verdict of `over` there acts on nothing,
   since the rotation retires you at this boundary either way. When the
```

**P21.5** `skills/tanto/roles/jisso.md` — replace exactly these 1 lines

```text
3. Idle. Kanri verifies the tree, rules, and sends the next prompt.
```

**P21.5 →**

```text
3. Idle, with your closing line: your work is in the report and the commits;
   the step that still needs this seat is the boundary's verdict. Kanri
   verifies the tree and rules. A batch returned for rework comes back to
   you as a prompt for the same batch; a batch accepted is your exit — the
   report's Shoroku proposal section is your exit shoroku, nothing else is
   written, and Kanri's `release: /clear this window` follows. The one
   exception is the plan's last implementation batch: its Jisso waits for
   the whole-branch review's verdict, and gets either `release:` — the fix
   wave is the next Jisso's — or, when the review finds nothing, the `T2:`
   line below. On `release:`, tell the human to `/clear` this window and
   end your turn: `none — /clear this window`.
```

**P21.6** `skills/tanto/roles/jisso.md` — replace exactly these 1 lines

```text
| `shoroku` — propose in chat, wait for the human's `Direction?`, never start without their explicit confirmation | write the proposal to a file and stop there; a dispatched recommender reads it and the human checks the recommendation by exception | you do not talk to the human unless Kanri grants it, and every item reaches the human that way |
```

**P21.6 →**

```text
| `shoroku` — propose in chat, wait for the human's `Direction?`, never start without their explicit confirmation | write the proposal to a file — the report's section at a boundary, `shoroku-proposal.md` at T2 — and stop there; a dispatched recommender reads it at the close and the human checks the recommendation by exception | you do not talk to the human unless Kanri grants it, and every item reaches the human that way |
```

**P21.7** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```text
Kanri dispatches the whole-branch review itself and sends you its findings as
one more batch prompt. For that batch:
```

**P21.7 →**

```text
Kanri dispatches the whole-branch review itself and sends its findings to
the next queued Jisso as one more batch prompt. If you are that Jisso:
```

**P21.8** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```text
Then send Kanri one line with the path, and idle: your deletion follows the
form check, and the recommendation, the check, and the apply run with you
gone.
```

**P21.8 →**

```text
Then send Kanri one line with the path, and idle with your closing line:
Kanri's `release:` follows the form check, and the recommendation, the
check, and the apply run with you gone.
```

**P21.9** `skills/tanto/roles/jisso.md` — replace exactly these 9 lines

```text
**Your exit** is that same proposal under the exit file names, written at the
boundary where Kanri replaces you or where the plan ends; at plan end, T2
*is* that exit. Kanri sends
`exit: propose your shoroku; write it to <path>`, the path being
`exit-jisso-<X>-proposal.md` in the topic directory, `.tanto/<topic>/`, with
`<X>` the batch letter. Write it, run the self-check of `SKILL.md`'s
Resuming, and answer `exit proposal: <path> — <reading>`. Then idle: you
apply nothing and commit nothing at your exit, and your deletion follows the
proposal.
```

**P21.9 →**

```text
**Your exit** is a boundary. Every Jisso but the plan's last leaves at the
boundary Kanri accepts, and its report's Shoroku proposal section is its
proposal — no `exit:` line comes, no exit file is written. The last Jisso
leaves at T2: the `T2:` line, the proposal above, and `release:` on its form
check. Either way you apply nothing and commit nothing at your exit, your
release follows the form check, and the recommendation, the human's check,
and the apply run with you gone.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 21`

Expected: `task 21: verify clean`.

- [ ] **Step 3: Check the exit-file name is gone from the skill**

Run:

```bash
grep -c 'exit-jisso' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md
```

Expected: `0` on every file. This is the condition issue-0239 closes on (Task 34).

- [ ] **Step 4: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/jisso.md`

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/jisso.md
```

Subject: `docs(tanto): a Jisso is queued, runs one batch, and its report's section is its exit shoroku`. End with your own `Co-Authored-By:` trailer.

### Task 22: `roles/sekkei.md`

**Files:**

- Modify: `skills/tanto/roles/sekkei.md` (L87-88, L91-92, L130-132, L167, L175-180)

Spec sections 5.1 and the Sekkei part of 5.4. The closing-line mention below is amended by `.tanto/kikaku/2026-09-17-closing-line-identity.md` (R-7), one of the sites its own section 5 lists: the identity prefix and the optional `sent:` line SKILL.md's Messages defines (Task 3) apply here too.

**Named mechanisms this task touches.** The review report's **`**Shoroku proposal** section`** is a contract with the `spec.review` kind and with Kanri's `sections` read, so it is renamed as a passage and never by a sweep; its twin is in `roles/keikaku.md`'s plan-reviewer dispatch (Task 23), and `roles/kanri.md` reads the same section name at loop step 3 and "The final batch" (Tasks 9, 11) — by its bare heading, via `sections`, never by this bold string, so it carries no pin of its own (spec 8.2 names only the two review-report headings). `grep -cF '**Shoroku proposal** section' skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md` must be `1` on each when the plan lands. The **spec section name `Shoroku proposal from this spec work`**: also `SKILL.md` (Task 4) and `roles/kanri.md` (Tasks 8, 14). The **closing line** and **`release:`**: `SKILL.md`'s Messages (Task 3), the Release table's Sekkei row (Task 15), and the other seats' idle paragraphs (Tasks 21, 23, 24, 25).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O22.1** `with a **Shoroku candidates** section at the` — 2 in the swept tree: `skills/tanto/roles/sekkei.md` 1 (P22.1) and `skills/tanto/roles/keikaku.md` 1 (Task 23). Must be 1 after this task and 0 after Task 23.

**O22.2** `candidates as ` — `skills/tanto/roles/sekkei.md` 1, the report-line sentence, where `Kanri records its Shoroku candidates as pending rows` becomes `its Shoroku proposal's items`. The sentence's first line survives the edit and is deliberately not the needle. Must be 0 after P22.2.

**O22.3** `and asks for your deletion at once` — 2 in the swept tree: `skills/tanto/roles/sekkei.md` 1 (P22.3) and `skills/tanto/roles/keikaku.md` 1 (Task 23). Must be 1 after this task and 0 after Task 23; `grep -cF 'asks for your deletion' skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md` must be `0` on each when the plan lands.

**O22.4** `Your candidates are the` — 2 in the swept tree: `skills/tanto/roles/sekkei.md` 1 (P22.4) and `skills/tanto/roles/keikaku.md` 1 (Task 23). Must be 1 after this task and 0 after Task 23.

**O22.5** `and asks the human to delete you at once` — `skills/tanto/roles/sekkei.md` 1, the exit paragraph. Must be 0 after P22.5.

**O22.6** `the deletion may lag` — `skills/tanto/roles/sekkei.md` 1, in the same paragraph. Must be 0 after P22.5.

- [ ] **Step 1: Apply the five passages**

**P22.1** `skills/tanto/roles/sekkei.md` — replace exactly these 2 lines

```text
`.tanto/<topic>/spec-review.md` with a **Shoroku candidates** section at the
end. When a batch of another topic is in flight, tell it — as the orders line
```

**P22.1 →**

```text
`.tanto/<topic>/spec-review.md` with a **Shoroku proposal** section at the
end. When a batch of another topic is in flight, tell it — as the orders line
```

**P22.2** `skills/tanto/roles/sekkei.md` — replace exactly these 2 lines

```text
Then send Kanri one line with the report path: Kanri records its Shoroku
candidates as `pending` rows.
```

**P22.2 →**

```text
Then send Kanri one line with the report path: Kanri records its Shoroku
proposal's items as `pending` rows.
```

**P22.3** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```text
idle. Kanri sends you no `exit:` at this boundary; it checks the proposal's
form, records its items, and asks for your deletion at once, and the
plan is Keikaku's from then on.
```

**P22.3 →**

```text
idle. Kanri sends you no `exit:` at this boundary; it checks the proposal's
form, records its items, and sends you `release: /clear this window` at
once, and the plan is Keikaku's from then on.
```

**P22.4** `skills/tanto/roles/sekkei.md` — replace exactly these 1 lines

```text
  Your candidates are the
```

**P22.4 →**

```text
  Your proposal items are the
```

**P22.5** `skills/tanto/roles/sekkei.md` — replace exactly these 6 lines

```text
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
  there: Kanri checks the proposal's form, records its items as `pending`
  rows, and asks the human to delete you at once — no recommender runs before
  the topic's close, where your items are recommended and checked with
  everything else; the deletion may lag that ask. If more work reaches you in
  that gap — a cold-read
```

**P22.5 →**

```text
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
  there, with your closing line — the spec, the dialogue, and the proposal
  by path; the step that still needs this seat, `none` — and wait for
  Kanri's `release: /clear this window`: Kanri checks the proposal's form,
  records its items as `pending` rows, and sends that line at once — no
  recommender runs before the topic's close, where your items are
  recommended and checked with everything else. On `release:` tell the
  human to `/clear` this window and end your turn. If more work reaches you
  before it — a cold-read
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 22`

Expected: `task 22: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/sekkei.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/sekkei.md
```

Subject: `docs(tanto): Sekkei ends with a closing line and waits for release:, not a deletion`. End with your own `Co-Authored-By:` trailer.

### Task 23: `roles/keikaku.md`

**Files:**

- Modify: `skills/tanto/roles/keikaku.md` (L92-94, L231-232, L285-286, L322, L327-332)

Spec sections 5.2 and the Keikaku part of 5.4. The closing-line mention below is amended by `.tanto/kikaku/2026-09-17-closing-line-identity.md` (R-7), one of the sites its own section 5 lists: the identity prefix and the optional `sent:` line SKILL.md's Messages defines (Task 3) apply here too.

The queue-sizing rule `P23.1` installs (the Batches table's row count plus one) has a first, self-referential data point in this very plan: this table has 17 rows, so the *same* plan under the lifecycle it installs would size an 18-window queue — 18 full plan-and-spec reads instead of one Jisso carrying all 35 tasks. No action follows from this at drafting time — this plan itself runs on the old lifecycle (rule 11) and is exempt from the rule it writes, per Global Constraints — but it is the first evidence for Deferred item 4's open question (a queued window's own idle cost) plus a second cost that item does not name, a queued seat's own re-read of the plan and spec at its batch prompt. Worth a measurement in the first plan that does queue-size itself, not a cap here: no threshold exists yet for either a plan's total task count or its per-batch size (Self-Review, issue-7281), and adding one for the queue length alone, without one for the plan it queues, would constrain the wrong variable.

**Named mechanisms this task touches.** The **Batches table's row count + 1** as the queue's size: also `roles/kanri.md`'s "When the plan lands" step 4 and its Create table (Tasks 8, 15), rule 11's queue clause (Task 5), and `roles/jisso.md`'s Start (Task 21). The plan reviewer's **`**Shoroku proposal** section`**: the twin is `roles/sekkei.md`'s (Task 22). The **closing line** and **`release:`**: as Task 22.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O23.1** `one Jisso carries a batch without growing long` — `skills/tanto/roles/keikaku.md` 1, Step 3's sizing sentence; the same sentence carries `a planned replacement`, which the spec's Old-values table names for this file. Must be 0 after P23.1.

**O23.2** `a planned replacement` — `skills/tanto/roles/keikaku.md` 1, inside P23.1's old block. Must be 0 after P23.1.

**O23.3** `with a **Shoroku candidates** section at the` — after Task 22, 1 in the swept tree: here. Must be 0 after P23.2.

**O23.4** `and asks for your deletion at once` — after Task 22, 1 in the swept tree: here. Must be 0 after P23.3.

**O23.5** `Your candidates are the` — after Task 22, 1 in the swept tree: here. Must be 0 after P23.4.

**O23.6** `to delete you at once` — 2 in the swept tree today: `skills/tanto/roles/keikaku.md` 1 (P23.5) and `skills/tanto/roles/sekkei.md` 1 (Task 22 clears it). The `roles/keikaku.md` sentence wraps after `asks the human`, which is why the needle is the tail rather than the whole phrase. Must be 0 after P23.5.

- [ ] **Step 1: Apply the five passages**

**P23.1** `skills/tanto/roles/keikaku.md` — replace exactly these 3 lines

```text
  delivers, and the stop conditions at its boundary. Size the batches so that
  one Jisso carries a batch without growing long, and say at which boundaries
  a planned replacement is expected, if any. A stop condition worded as a
```

**P23.1 →**

```text
  delivers, and the stop conditions at its boundary. Size the batches so that
  one Jisso carries one without growing long: the Batches table's row count,
  plus one for the fix wave, is what Kanri's Jisso queue is sized from, and
  every boundary rotates. A stop condition worded as a
```

**P23.2** `skills/tanto/roles/keikaku.md` — replace exactly these 2 lines

```text
   re-running the set, and writes `.tanto/<topic>/plan-review.md`
   with a **Shoroku candidates** section at the end; after you have ruled,
```

**P23.2 →**

```text
   re-running the set, and writes `.tanto/<topic>/plan-review.md`
   with a **Shoroku proposal** section at the end; after you have ruled,
```

**P23.3** `skills/tanto/roles/keikaku.md` — replace exactly these 2 lines

```text
Then idle. Kanri sends you no `exit:` at this boundary; it checks the
proposal's form, records its items, and asks for your deletion at once. The
```

**P23.3 →**

```text
Then idle. Kanri sends you no `exit:` at this boundary; it checks the
proposal's form, records its items, and sends you
`release: /clear this window` at once. The
```

**P23.4** `skills/tanto/roles/keikaku.md` — replace exactly these 1 lines

```text
  to `.tanto/<topic>/exit-keikaku-proposal.md`. Your candidates are the
```

**P23.4 →**

```text
  to `.tanto/<topic>/exit-keikaku-proposal.md`. Your proposal items are the
```

**P23.5** `skills/tanto/roles/keikaku.md` — replace exactly these 6 lines

```text
  process, and the defects noticed. Then stop there: Kanri checks the
  proposal's form, records its items as `pending` rows, and asks the human
  to delete you at once — no recommender runs before the topic's close,
  where your items are recommended and checked with everything else; the
  deletion may lag that ask, and work that reaches you in the gap — a report
  that conflicts with
```

**P23.5 →**

```text
  process, and the defects noticed. Then stop there, with your closing line
  — the plan, the dry run, and the proposal by path; the step that still
  needs this seat, `none` — and wait for Kanri's
  `release: /clear this window`: Kanri checks the proposal's form, records
  its items as `pending` rows, and sends that line at once — no recommender
  runs before the topic's close, where your items are recommended and
  checked with everything else. On `release:` tell the human to `/clear`
  this window and end your turn. Work that reaches you before it — a report
  that conflicts with
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 23`

Expected: `task 23: verify clean`.

- [ ] **Step 3: Check the review-report contract on both sides**

Run:

```bash
grep -cF '**Shoroku proposal** section' skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md
```

Expected: `1` on each. `roles/kanri.md` reads the same section by its bare heading via `sections` (Tasks 9, 11) and carries no bold-string pin of its own — spec 8.2 names only these two files for this check.

- [ ] **Step 4: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/keikaku.md`

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/keikaku.md
```

Subject: `docs(tanto): the Batches table sizes the Jisso queue, and Keikaku waits for release:`. End with your own `Co-Authored-By:` trailer.

### Task 24: `roles/kaiseki.md`

**Files:**

- Modify: `skills/tanto/roles/kaiseki.md` (L73-74, L78-80, L97, L103-105, L113-116)

Spec sections 5.3 and the Kaiseki part of 5.4, plus the one `shoroku candidate` in this file that no spec passage reaches (L97, the `blocks this task: no` routing sentence). Without it batch D's case-insensitive sweep cannot reach `0`. The closing-line mentions below are amended by `.tanto/kikaku/2026-09-17-closing-line-identity.md` (R-7), one of the sites its own section 5 lists: the identity prefix and the optional `sent:` line SKILL.md's Messages defines (Task 3) apply here too.

**Named mechanisms this task touches.** The report's **`## Shoroku proposal`** heading: `templates/kaiseki-report.md` carries it (Task 28) and this file names it. The **ceiling's one subject**: also `SKILL.md`'s `ceiling` bullet (Task 1), `roles/kanri.md` loop step 6 and Readings (Tasks 9, 16), `roles/jisso.md` (Task 21). **`release:`** and the **closing line**: `SKILL.md`'s Messages (Task 3), `roles/kanri.md`'s Kaiseki branch (Task 12), the idle block's `for you` item once released (Task 10), and the Release table's Kaiseki row (Task 15). The standalone Kaiseki's section is unchanged.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O24.1** `candidates are this case's` — `skills/tanto/roles/kaiseki.md` 1. Must be 0 after P24.1.

**O24.2** `and your deletion follows the form check` — `skills/tanto/roles/kaiseki.md` 1. Must be 0 after P24.2.

**O24.3** `becomes a shoroku candidate that you` — `skills/tanto/roles/kaiseki.md` 1. Must be 0 after P24.3.

The words `the ceiling replaces` survive in the new text as `the ceiling replaces Kanri only`, so they are not a needle; what goes is the subject that follows them.

**O24.4** `Kanri and Jisso only, and every other role measures` — `skills/tanto/roles/kaiseki.md` 1, the `--role` sentence. Must be 0 after P24.4.

**O24.5** `You are deleted only once Jisso's fix` — `skills/tanto/roles/kaiseki.md` 1. Must be 0 after P24.5.

- [ ] **Step 1: Apply the five passages**

**P24.1** `skills/tanto/roles/kaiseki.md` — replace exactly these 2 lines

```text
Attached, your exit is `SKILL.md`'s "Session exit" applied to you. Your
candidates are this case's **Shoroku candidates** section plus every "Other
```

**P24.1 →**

```text
Attached, your exit is `SKILL.md`'s "Session exit" applied to you. Your
proposal items are this case's **Shoroku proposal** section plus every "Other
```

**P24.2** `skills/tanto/roles/kaiseki.md` — replace exactly these 3 lines

```text
`SKILL.md`'s Resuming, and answer `exit proposal: <path> — <reading>`. Then
idle: your items are recommended and checked at the topic's close, with
everything else, and your deletion follows the form check.
```

**P24.2 →**

```text
`SKILL.md`'s Resuming, and answer `exit proposal: <path> — <reading>`. Then
idle with your closing line — the report and the proposal by path; the step
that still needs this seat, `none`: your items are recommended and checked
at the topic's close, with everything else, and Kanri's
`release: /clear this window` follows the form check. On it, tell the human
to `/clear` this window and end your turn.
```

**P24.3** `skills/tanto/roles/kaiseki.md` — replace exactly these 1 lines

```text
  back to you as another brief, a `no` becomes a shoroku candidate that you
```

**P24.3 →**

```text
  back to you as another brief, a `no` becomes a proposal item that you
```

**P24.4** `skills/tanto/roles/kaiseki.md` — replace exactly these 3 lines

```text
  `- Transcript — <reading>` line. You pass no `--role`: the ceiling replaces
  Kanri and Jisso only, and every other role measures the five figures, sends
  them, and is replaced on none of them.
```

**P24.4 →**

```text
  `- Transcript — <reading>` line. You pass no `--role`: the ceiling replaces
  Kanri only — Jisso's line is measured and kept, its rotation being its
  replacement — and every other role measures the five figures, sends
  them, and is replaced on none of them.
```

**P24.5** `skills/tanto/roles/kaiseki.md` — replace exactly these 4 lines

```text
Idle. If Kanri sends another brief for a `blocks this task: yes` item, you keep
your context and work it the same way. You are deleted only once Jisso's fix
has passed review and tests and no blocking item is open — and that is Kanri's
request to the human, not yours.
```

**P24.5 →**

```text
Idle, with your closing line: the report by path, and the step that still
needs this seat — a further brief, or Kanri's `exit:` line. If Kanri sends
another brief for a `blocks this task: yes` item, you keep your context and
work it the same way. You are released only once Jisso's fix has passed
review and tests and no blocking item is open — and that is Kanri's line,
not your judgment.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 24`

Expected: `task 24: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kaiseki.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kaiseki.md
```

Subject: `docs(tanto): Kaiseki is released after its proposal, and the ceiling replaces Kanri only`. End with your own `Co-Authored-By:` trailer.

### Task 25: `roles/hosa.md`

**Files:**

- Modify: `skills/tanto/roles/hosa.md` (L37-39, L75-78, L82-85)

Spec section 6.1. "Models" and the `close:` line itself are unchanged; the
line must stay byte for byte identical to `SKILL.md`'s (Task 4) and
`roles/kanri.md`'s (Task 14). P25.3's new text below also carries the
`/compact`-at-will paragraph from
`.tanto/kikaku/2026-09-17-idle-block-and-hosa-compact.md` §2 and §4.3
(R-6), inserted after "The human `/clear`s this window at will" as that
file's placement names. `P25.3`'s last two sentences are separately amended
by `.tanto/kikaku/2026-09-17-closing-line-identity.md` (R-7), one of the
sites its own section 5 lists: the identity prefix and the optional
`sent:` line SKILL.md's Messages defines (Task 3) apply here too.

**Named mechanisms this task touches.** The **`close:` line's `<topic>` slot** loses `kanri` as a value: also `roles/kanri.md`'s "Delegation to Hosa" (Task 14), `SKILL.md`'s "Session exit" (Task 4), and `templates/kanri-handover.md`'s delegated-close bullet (Task 19). The **Shoroku proposal items table** Hosa reads: `templates/kanri.md` (Task 20) and `templates/roster.md` (Task 17). The **closing line**: `SKILL.md`'s Messages (Task 3) and the other role files.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O25.1** `for Kanri's own between-plans exit` — `skills/tanto/roles/hosa.md` 1, the `<topic>` slot's second value; the backticked `kanri` in the same clause cannot itself be a needle. Its twin in `roles/kanri.md` reads `for your own between-plans exit` and went in Task 14. Must be 0 after P25.1.

**O25.2** `The candidates and the ledger` — `skills/tanto/roles/hosa.md` 1. Must be 0 after P25.2.

**O25.3** `No create request, no delete request, no` — `skills/tanto/roles/hosa.md` 1, "Lifecycle"; its twin in `roles/kikaku.md` reads `create request, no delete request, no replace row` and is Task 26's. Must be 0 after P25.3.

- [ ] **Step 1: Apply the three passages**

**P25.1** `skills/tanto/roles/hosa.md` — replace exactly these 3 lines

```text
— `<topic>` a topic word, or `kanri` for Kanri's own between-plans exit.
This is the topic's one shoroku stage, and you run its three dispatched
steps while Kanri goes on. Read the ledger's Shoroku candidates table for
```

**P25.1 →**

```text
— `<topic>` a topic word. This is the topic's one shoroku stage, and you
run its three dispatched steps while Kanri goes on. Read the ledger's
Shoroku proposal items table for
```

**P25.2** `skills/tanto/roles/hosa.md` — replace exactly these 4 lines

```text
The candidates and the ledger. You never write a proposal or an `S-n` row:
the session that holds the candidates writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` line, and only a subagent applies them.
```

**P25.2 →**

```text
The proposal items and the ledger. You never write a proposal or an `S-n`
row: the session that holds the items writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` line, and only a subagent applies them.
```

**P25.3** `skills/tanto/roles/hosa.md` — replace exactly these 4 lines

```text
You have a roster row, no topic. No create request, no delete request, no
replace row, and no exit shoroku. The human `/clear`s this window; the next
`/tanto hosa` re-handshakes as a new session, and Kanri marks the old row
`cleared`.
```

**P25.3 →**

```text
You have a roster row, no topic. No create request, no `release:` line, no
replace row, and no exit shoroku. The human `/clear`s this window at will.

Between jobs — never with a `chore:` still open, a `slot-needed:`
unanswered, or inside a `close:` before its `close done:` or
`close blocked:` — the human may `/compact` it instead: the session id and
the transcript survive, so this costs no re-handshake and no wake-up of
Kanri. Before your next job, list in this window every item a
compaction's own summary attributes to the human, and the human confirms
or corrects each one there — nothing goes to Kanri, since these are
chores handed to you under your standing grant, which Kanri never saw.
The compaction's count travels in your next `committed` or `close done:`
reading, which is record enough.

The next `/tanto` in it, in any role, re-handshakes as a new session, and
Kanri marks the old row `cleared`. Your closing line after a chore names
the commit subject and `none`; after a `close:` line, the direction file and
the step the close is at.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 25`

Expected: `task 25: verify clean`.

- [ ] **Step 3: Check the `close:` line survived byte for byte**

Run:

```bash
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
```

Expected: `1` on each of the three files.

- [ ] **Step 4: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/hosa.md`

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/hosa.md
```

Subject: `docs(tanto): a close: line's topic is always a topic word, and Hosa's window is cleared at will`. End with your own `Co-Authored-By:` trailer.

### Task 26: `roles/kikaku.md`

**Files:**

- Modify: `skills/tanto/roles/kikaku.md` (L21-22, L57-58, L61-64)

Spec sections 6.2 and 6.3.

**Named mechanisms this task touches.** The **clear rule for every role**: also `templates/roster.md`'s third keeping bullet and Status paragraph (Task 17), `roles/kanri.md`'s handshake (Task 7), and `roles/hosa.md`'s Lifecycle (Task 25). The **`no-role` line on every tanto line**, including Kikaku's own `decision: <path>`: `SKILL.md`'s Messages (Task 3) and `templates/batch-prompt.md` (Task 27).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O26.1** `no create request behind you and no deletion waiting` — `skills/tanto/roles/kikaku.md` 1. Must be 0 after P26.1.

**O26.2** `create request, no delete request, no replace row` — `skills/tanto/roles/kikaku.md` 1. Must be 0 after P26.2.

**O26.3** `Kanri writes a new` — `skills/tanto/roles/kikaku.md` 1, the Lifecycle paragraph, where the sentence rewraps around the widened subject. The sentence's own subject `/tanto kikaku` carries backticks and cannot be a needle, and `re-handshakes with a new transcript` survives the edit unchanged. Must be 0 after P26.3.

- [ ] **Step 1: Apply the three passages**

**P26.1** `skills/tanto/roles/kikaku.md` — replace exactly these 2 lines

```text
Kanri never requests a Kikaku. The human opens one when they want to think,
so there is no create request behind you and no deletion waiting for you.
```

**P26.1 →**

```text
Kanri never requests a Kikaku. The human opens one when they want to think,
so there is no create request behind you and no `release:` waiting for you.
```

**P26.2** `skills/tanto/roles/kikaku.md` — replace exactly these 2 lines

```text
You have a roster row — role `kikaku`, no topic — with status `live`. No
create request, no delete request, no replace row, and no exit shoroku:
```

**P26.2 →**

```text
You have a roster row — role `kikaku`, no topic — with status `live`. No
create request, no `release:` line, no replace row, and no exit shoroku:
```

**P26.3** `skills/tanto/roles/kikaku.md` — replace exactly these 4 lines

```text
The human `/clear`s this window when the subject changes. The next
`/tanto kikaku` re-handshakes with a new transcript, and Kanri writes a new
row and marks the old one `cleared`. A `/tanto fukki` after an editor
restart matches the transcript as for any role.
```

**P26.3 →**

```text
The human `/clear`s this window when the subject changes. The next `/tanto`
in it, in any role, re-handshakes with a new transcript, and Kanri writes a
new row and marks the old one `cleared` — the rule every window follows. A
`/tanto fukki` after an editor restart matches the transcript as for any
role. Your `decision: <path>` line carries the `no-role` line as its second line,
like every tanto line.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 26`

Expected: `task 26: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/roles/kikaku.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/roles/kikaku.md
```

Subject: `docs(tanto): a cleared Kikaku window takes any role next, and its decision: line carries the no-role line`. End with your own `Co-Authored-By:` trailer.

### Task 27: `templates/batch-prompt.md`

**Files:**

- Modify: `skills/tanto/templates/batch-prompt.md` (L1-5, L12-18, L33-34)

Spec sections 7.2 and the batch-prompt part of 7.6. The spec gives 7.6's `no-role` insertion as a separate block anchored on the title line 7.2 writes; the two are one replacement here, because each block appears once and an insertion anchored on 7.2's own new text would re-quote it.

**Named mechanisms this task touches.** The **`no-role` line**'s fixed text must be byte-identical to `SKILL.md`'s (Task 3) and must live in no third file: `grep -cF '(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)' skills/tanto/SKILL.md skills/tanto/templates/batch-prompt.md` is `1` on each, and `grep -rlF` over `skills/tanto/` finds no other. The **prompt's addressee**: also `roles/kanri.md` loop step 8 (Task 10), "When the plan lands" step 5 (Task 8), `SKILL.md`'s Artifacts row (Task 5), and `roles/jisso.md`'s guard-facing Start (Task 21). The **Setup on resume** line pairs with `roles/jisso.md`'s "first Jisso only" scan rule (Task 21). The **deferral line** now covers a handover only: `templates/kanri.md` (Task 20), `templates/kanri-handover.md` (Task 19), `roles/kanri.md` (Tasks 9, 13). The `- Kanri — <name> [<ref>]` line stays and is pinned by check 6; "Execute" and "Report" are unchanged.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

The title's own words `# Batch <X> — tasks <N> to <M>` survive as the new title's opening, so they are not a needle; the guard's wording is what changes with them.

**O27.1** `If that is not your workspace, reply` — `skills/tanto/templates/batch-prompt.md` 1, the guard. Must be 0 after P27.1.

**O27.2** `When a deferral stands at this boundary` — `skills/tanto/templates/batch-prompt.md` 1. Must be 0 after P27.2.

**O27.3** `Your replacement is deferred` — `skills/tanto/templates/batch-prompt.md` 1, inside P27.2's old block. Must be 0 after P27.2, and `grep -cF 'Jisso replacement deferred' skills/tanto/roles/kanri.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/kanri-handover.md` must be `0` on each once Tasks 13, 15 and 19 have landed too.

**O27.4** `Only after a replacement` — `skills/tanto/templates/batch-prompt.md` 1, Setup on resume. Must be 0 after P27.3.

- [ ] **Step 1: Apply the three passages**

**P27.1** `skills/tanto/templates/batch-prompt.md` — replace exactly these 5 lines

```text
# Batch <X> — tasks <N> to <M>

Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
`<repo path>` on branch `<branch>`. If that is not your workspace, reply
`not me` to `<kanri-address>` and stop.
```

**P27.1 →**

```text
# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan

(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)

Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
`<repo path>` on branch `<branch>`, and to the Jisso named above. If that is
not your workspace or your name, reply `not me` to `<kanri-address>` and
stop.
```

**P27.2** `skills/tanto/templates/batch-prompt.md` — replace exactly these 7 lines

```text
<When a deferral stands at this boundary, one further line, verbatim — both
when both stand:
"Kanri's handover is deferred since <batch X | the spec stage | the plan
stage> — the ceiling is crossed and the human is absent; this batch runs under
the same Kanri", and
"Your replacement is deferred since batch <X> — your ceiling is crossed and
the human is absent; run this batch and report as usual".>
```

**P27.2 →**

```text
<When Kanri's handover stands deferred at this boundary, one further line,
verbatim: "Kanri's handover is deferred since <batch X | the spec stage | the
plan stage> — the ceiling is crossed and the human is absent; this batch runs
under the same Kanri".>
```

**P27.3** `skills/tanto/templates/batch-prompt.md` — replace exactly these 2 lines

```text
- <Only after a replacement: "resume batch <X> from task <N>". Otherwise drop
  this line.>
```

**P27.3 →**

```text
- Jisso — <"the first of this plan: run Start steps 1 to 4, the pre-flight
  scan included", or "the <n>th of this plan: run Start steps 1 to 3, resume
  `progress.md` through `sdd-workspace`, and start at task <N> — no scan";
  after a Jisso gone mid-batch, "resume batch <X> from task <N>" in the
  second form>
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 27`

Expected: `task 27: verify clean`.

- [ ] **Step 3: Check the `no-role` line lives in exactly two files**

Run:

```bash
grep -rlF '(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)' skills/tanto/
```

Expected: exactly two paths, `skills/tanto/SKILL.md` and `skills/tanto/templates/batch-prompt.md`.

- [ ] **Step 4: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/templates/batch-prompt.md`

Expected: every hook passes. The `no-role` line is deliberately unwrapped — it is a fixed string two files carry byte for byte.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/templates/batch-prompt.md
```

Subject: `docs(tanto): the batch prompt names its Jisso and carries the no-role line`. End with your own `Co-Authored-By:` trailer.

### Task 28: `templates/batch-report.md` and `templates/kaiseki-report.md`

**Files:**

- Modify: `skills/tanto/templates/batch-report.md` (L35-38)
- Modify: `skills/tanto/templates/kaiseki-report.md` (L57)

Spec section 7.4. These are the last two `## Shoroku candidates` headings in the tree.

**Named mechanisms this task touches.** The heading **`## Shoroku proposal`** is a contract with `roles/kanri.md`'s `sections` read at loop step 3 and "The final batch" (Tasks 9, 11), with `roles/kaiseki.md`'s report instruction (Task 24), and with the review-report heading `**Shoroku proposal** section` in `roles/sekkei.md` and `roles/keikaku.md` (Tasks 22, 23). `grep -c '^## Shoroku proposal$' skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md` must be `1` and `1`. The batch report's new explainer states that the section **is** the Jisso's exit shoroku, which `roles/jisso.md` (Task 21) and `SKILL.md`'s Artifacts row (Task 5) also say.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O28.1** `## Shoroku candidates` — after Tasks 17 and 20, 2 in the swept tree: these two files. Must be 0 after P28.1 and P28.2, and `grep -c 'Shoroku candidates' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md skills/tanto/README.md` must then be `0` on every file.

- [ ] **Step 1: Apply the two passages**

**P28.1** `skills/tanto/templates/batch-report.md` — replace exactly these 4 lines

```text
## Shoroku candidates

- <requirements, design, decisions, issues, notes, or reports> — <one line on
  what is worth keeping and why>
```

**P28.1 →**

```text
## Shoroku proposal

<This section is this Jisso's exit shoroku: the items this batch raised
that no file holds — a rejected alternative and its reason, a fact measured,
a defect noticed, an observation about the run — never a restatement of the
plan, the SDD ledger, or this report. Kanri records each as a `pending` row;
the close's recommender quotes it from here. Nothing else is written at
your exit.>

- <requirements, design, decisions, issues, notes, or reports> — <one line on
  what is worth keeping and why>
```

**P28.2** `skills/tanto/templates/kaiseki-report.md` — replace exactly these 1 lines

```text
## Shoroku candidates
```

**P28.2 →**

```text
## Shoroku proposal
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 28`

Expected: `task 28: verify clean`.

- [ ] **Step 3: Check the four heading contracts**

Run:

```bash
grep -c '^## Shoroku proposal items$' skills/tanto/templates/roster.md skills/tanto/templates/kanri.md
grep -c '^## Shoroku proposal$' skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md
```

Expected: `1` and `1` from the first, `1` and `1` from the second.

- [ ] **Step 4: Lint the changed paths**

Run: `./scripts/lint.sh skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md`

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md
```

Subject: `docs(tanto): a report's Shoroku proposal section is the seat's exit shoroku`. End with your own `Co-Authored-By:` trailer.

### Task 29: `templates/shoroku-brief.md`

**Files:**

- Modify: `skills/tanto/templates/shoroku-brief.md` (L1, L4-6, L16-17, L23, L36-37, L42, L46, L50)

Spec section 7.5's four slot renames and 7.6's four between-plans sites. This finishes batch C: after it every file of the skill agrees with every other.

**Named mechanisms this task touches.** The **between-plans Kanri lane** is gone from `SKILL.md`'s "Session exit" and Artifacts (Tasks 4, 5), `roles/kanri.md`'s "Shoroku" and "Handover" (Tasks 13, 14), `roles/hosa.md` (Task 25) and `templates/kanri-handover.md` (Task 19); these four sites are its last. The word **item** replacing **candidate** in the brief's slots pairs with the recommendation's own vocabulary, which `roles/kanri.md` step 2 states (Task 14). The brief's four `##` headings and its `See: ` pointer form are unchanged and stay pinned by the consistency note's checks 18 and 19.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O29.1** `# Shoroku check brief — <topic or Kanri's name>` — `skills/tanto/templates/shoroku-brief.md` 1. Must be 0 after P29.1.

**O29.2** `for Kanri's between-plans` — 2 in the swept tree: `skills/tanto/SKILL.md` 1 (Task 5 clears it) and `skills/tanto/templates/shoroku-brief.md` 1 (P29.2). Must be 0 after P29.2.

**O29.3** `t2, or the Kanri exit's own` — `skills/tanto/templates/shoroku-brief.md` 1. Must be 0 after P29.3, and `grep -cF 'the Kanri exit' skills/tanto/templates/shoroku-brief.md` must be `0`.

**O29.4** `<the candidate in one sentence>` — `skills/tanto/templates/shoroku-brief.md` 4, one per group plus the "How to answer" example. Must be 0 after P29.4, P29.6, P29.7 and P29.8.

**O29.5** `, or the Kanri` — `skills/tanto/templates/shoroku-brief.md` 2, the Document line and the direction sentence, each of which continues `exit's own …` on the next line. It is the one plain-text run that spans both change points; the surrounding `t2-direction.md` carries backticks and cannot be a needle. Must be 0 after P29.3 and P29.5.

- [ ] **Step 1: Apply the eight passages**

**P29.1** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 1 lines

```text
# Shoroku check brief — <topic or Kanri's name>
```

**P29.1 →**

```text
# Shoroku check brief — <topic>
```

**P29.2** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 3 lines

```text
recommendation, at `.tanto/<topic>/t2-brief.md`, or
`.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` for Kanri's between-plans
exit, beside the recommendation and untracked under `.tanto/.gitignore`.
```

**P29.2 →**

```text
recommendation, at `.tanto/<topic>/t2-brief.md`, beside the recommendation
and untracked under `.tanto/.gitignore`.
```

**P29.3** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 2 lines

```text
Document: <the recommendation's path> — t2, or the Kanri exit's own
stage word — written <YYYY-MM-DD> on <model family> for the chat language
```

**P29.3 →**

```text
Document: <the recommendation's path> — t2 — written <YYYY-MM-DD> on
<model family> for the chat language
```

**P29.4** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 1 lines

```text
    <n>. [adopt | reject | unsure] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

**P29.4 →**

```text
    <n>. [adopt | reject | unsure] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

**P29.5** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 2 lines

```text
What you answer is what Kanri writes into `t2-direction.md`, or the Kanri
exit's own `-direction.md`, item by item; the apply reads that file and the
```

**P29.5 →**

```text
What you answer is what Kanri writes into `t2-direction.md`, item by item;
the apply reads that file and the
```

**P29.6** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 1 lines

```text
<n>. [adopt] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

**P29.6 →**

```text
<n>. [adopt] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

**P29.7** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 1 lines

```text
<n>. [reject] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

**P29.7 →**

```text
<n>. [reject] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

**P29.8** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 1 lines

```text
<n>. [unsure] <destination> — <the candidate in one sentence> — <the one-line reason> — <the question this item could not settle, one clause> — See: <the item's heading text, without its ### marker>
```

**P29.8 →**

```text
<n>. [unsure] <destination> — <the item in one sentence> — <the one-line reason> — <the question this item could not settle, one clause> — See: <the item's heading text, without its ### marker>
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 29`

Expected: `task 29: verify clean`.

- [ ] **Step 3: Check the skill is internally consistent**

Run:

```bash
grep -ci 'candidate' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md
grep -cF 'the Kanri exit' skills/tanto/templates/shoroku-brief.md
```

Expected: `0` on every file from the first (`skills/tanto/README.md` is batch D's and is not in this list), `0` from the second. A non-zero from the first names a site this plan missed; report it rather than fixing it outside a passage.

- [ ] **Step 4: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/templates/shoroku-brief.md`

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/templates/shoroku-brief.md
```

Subject: `docs(tanto): the check brief is the topic's, and its slots name items`. End with your own `Co-Authored-By:` trailer.

### Task 30: the READMEs' drift review

**Files:**

- Modify: `skills/tanto/README.md` (L11-12, L27-32, L72, L96-97, L122-125, L153)
- Read only: `skills/shoroku/README.md`

Spec section 8.1. `AGENTS.md` asks for a README review after its `SKILL.md` changes. `skills/tanto/README.md`'s own prose is rewritten at the six sites this design contradicts; `skills/shoroku/README.md` is reviewed and expected unchanged, because `skills/shoroku/SKILL.md` is not edited (the spec's fixed input 7 keeps that skill's own vocabulary).

**Named mechanisms this task touches.** **Who gives and takes a window's role**: `SKILL.md`'s roles table (Task 1), `roles/kanri.md`'s Session lifecycle (Task 15). The **ceiling's one subject**: `SKILL.md` (Task 1), `roles/kanri.md` (Tasks 9, 16), `roles/jisso.md` (Task 21), `roles/kaiseki.md` (Task 24). The **one create request for the plan's Jissos**: `roles/kanri.md`'s Create table (Task 15) and "When the plan lands" (Task 8). The **`/clear` keeping the name**: `SKILL.md`'s address bullet (Task 2), `templates/roster.md` (Task 17), `roles/kanri.md`'s Session lifecycle (Task 15), and the sessions note (Task 32).

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O30.1** `The human creates and deletes` — `skills/tanto/README.md` 1; 0 in the swept tree, since the README is not one of check 7's three places. Must be 0 after P30.1.

**O30.2** `and hands the one over or replaces the other` — `skills/tanto/README.md` 1. Must be 0 after P30.2.

**O30.3** `adopted candidates` — `skills/tanto/README.md` 1. Must be 0 after P30.3.

**O30.4** `Every lifecycle role after Kanri is created when Kanri asks` — `skills/tanto/README.md` 1. Must be 0 after P30.4.

**O30.5** `after an editor restart or a closed tab` — `skills/tanto/README.md` 1. Must be 0 after P30.5.

**O30.6** `the session holding the candidates` — `skills/tanto/README.md` 1. Must be 0 after P30.6; with P30.3 this brings `grep -ci 'candidate' skills/tanto/README.md` to `0`.

- [ ] **Step 1: Apply the six passages**

**P30.1** `skills/tanto/README.md` — replace exactly these 2 lines

```text
  implements, **Kaiseki** (解析) root-causes. The human creates and deletes
  sessions; Kanri is the only role that asks.
```

**P30.1 →**

```text
  implements, **Kaiseki** (解析) root-causes. The human gives a window its
  role and takes it away; Kanri is the only role that asks.
```

**P30.2** `skills/tanto/README.md` — replace exactly these 6 lines

```text
- Holds **Kanri** and **Jisso** under a context ceiling derived from that last
  figure — each seat's own measured baseline plus a chosen number of batches of
  measured consumption — and hands the one over or replaces the other at the
  next boundary once it is crossed, but only while the human is there to create
  the successor; otherwise the crossing is recorded as deferred and the run
  continues to the plan close, which hands over in any case.
```

**P30.2 →**

```text
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

**P30.3** `skills/tanto/README.md` — replace exactly these 1 lines

```text
  write-out at each topic's close. Without `docs/AGENTS.md` the adopted candidates
```

**P30.3 →**

```text
  write-out at each topic's close. Without `docs/AGENTS.md` the adopted items
```

**P30.4** `skills/tanto/README.md` — replace exactly these 2 lines

```text
Every lifecycle role after Kanri is created when Kanri asks the human for it,
and starts with Kanri's name as its request prints it:
```

**P30.4 →**

```text
Every lifecycle role after Kanri starts when Kanri asks the human for a
window — the plan's Jissos all at its landing, in one request — and starts
with Kanri's name as its request prints it:
```

**P30.5** `skills/tanto/README.md` — replace exactly these 4 lines

```text
A window that comes back after an editor restart or a closed tab keeps its
context and its transcript but gets a new name. `/tanto fukki` (復帰), typed in
that window, matches it to its roster row by that transcript path and rejoins
it to the run; no address is pasted, and Kanri's window goes first.
```

**P30.5 →**

```text
A window that comes back after an editor restart keeps its context and its
transcript but gets a new name; a closed tab is the exception now, because a
finished seat's window is `/clear`ed and reused rather than closed, and a
`/clear` keeps the name and the `[ref]`. `/tanto fukki` (復帰), typed in that
window, matches it to its roster row by that transcript path and rejoins it
to the run; no address is pasted, and Kanri's window goes first.
```

**P30.6** `skills/tanto/README.md` — replace exactly these 1 lines

```text
every exit and every boundary the session holding the candidates writes
```

**P30.6 →**

```text
every exit and every boundary the session holding the items writes
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 30`

Expected: `task 30: verify clean`.

- [ ] **Step 3: Review `skills/shoroku/README.md` for drift and record the result**

Run:

```bash
grep -ci 'candidate' skills/shoroku/README.md; git diff --stat -- skills/shoroku/README.md
```

Expected: `0` from the first and no diff from the second. `skills/shoroku/SKILL.md` is out of scope, so its README is expected unchanged; record that it was reviewed and left alone in the dogfood report (Task 35).

- [ ] **Step 4: Lint the changed path**

Run: `./scripts/lint.sh skills/tanto/README.md`

Expected: every hook passes. The README may name `skills/tanto/` — check 7 exempts it deliberately.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/README.md
```

Subject: `docs(tanto): the README says windows are reused, Jisso rotates, and the ceiling holds Kanri`. End with your own `Co-Authored-By:` trailer.

### Task 31: `docs/notes/tanto-consistency-checks.md`

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md` (L573, L583-584, L596-598, after L631-633, after L749, L752, and a new section appended at the end)

Spec section 8.2.

**Named mechanisms this task touches.** The **pinned strings** check 6 holds: the roster heading `^## Shoroku proposal items$` (Task 17), the seven-column header row in `templates/roster.md` and `templates/kanri.md` (Tasks 17, 20), the `exit-<role>` count in `SKILL.md` (Task 4) and `roles/kanri.md` (Task 14), and the three new route lines — `queued: <n>`, `release: /clear this window`, the `no-role` line's fixed text — written in Tasks 2, 3, 7, 8, 21 and 27. The **review-report heading** `**Shoroku proposal** section` (Tasks 22, 23, 11) is a contract with two subagent kinds that no check pins today. Check 7's ten new absences are exactly the sweep batch D runs in Task 33.

**Old values this task must clear** — counts run against the live tree at `17f2e4a`:

**O31.1** `grep -c '^## Shoroku candidates$' skills/tanto/templates/roster.md` — `docs/notes/tanto-consistency-checks.md` 1. Must be 0 after P31.1.

**O31.2** `| S-n | Source | Candidate | Destination | Adopted | Stage | Written |` — `docs/notes/tanto-consistency-checks.md` 2, the two header-row pins. Must be 0 after P31.2.

**O31.3** `Expected: no output from the first thirteen (each exits 1). The sixth and` — `docs/notes/tanto-consistency-checks.md` 1. Must be 0 after P31.6.

The Expected list's ninth number — the `exit-<role>` count in `SKILL.md`, `5` today and `2` after Task 4 — sits on a line that is nothing but backticked numerals, so it has no plain-text needle. It is checked by an anchor instead:

**A31.2** `docs/notes/tanto-consistency-checks.md` — `grep -c '1., .5., .3.,' docs/notes/tanto-consistency-checks.md` — before: 1, after: 0

- [ ] **Step 1: Apply the six passages**

**P31.1** `docs/notes/tanto-consistency-checks.md` — replace exactly these 1 lines

```text
grep -c '^## Shoroku candidates$' skills/tanto/templates/roster.md
```

**P31.1 →**

```text
grep -c '^## Shoroku proposal items$' skills/tanto/templates/roster.md
```

**P31.2** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
grep -cF '| S-n | Source | Candidate | Destination | Adopted | Stage | Written |' skills/tanto/templates/roster.md
grep -cF '| S-n | Source | Candidate | Destination | Adopted | Stage | Written |' skills/tanto/templates/kanri.md
```

**P31.2 →**

```text
grep -cF '| S-n | Source | Item | Destination | Adopted | Stage | Written |' skills/tanto/templates/roster.md
grep -cF '| S-n | Source | Item | Destination | Adopted | Stage | Written |' skills/tanto/templates/kanri.md
```

**P31.3** `docs/notes/tanto-consistency-checks.md` — replace exactly these 3 lines

```text
Expected, one number per line, in order: `2`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `5`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`. The fourth is `3` because
```

**P31.3 →**

```text
Expected, one number per line, in order: `2`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `2`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`. The ninth is `2` because
the seat-lineage plan rewrote "Session exit" whole and its new text names
the `exit-<role>[-<suffix>]` pattern twice and no more. The fourth is `3` because
```

**P31.4** `docs/notes/tanto-consistency-checks.md` — insert after these 3 lines

```text
those two seats lost its unasked form. These are the contract's copies
only; a role
file that repeats a form is pinned where that file's own rows are.
```

**P31.4 →**

````text
The lines the seat-lineage design added, each pinned in the contract and in
the file that sends or answers it, and the two review-report headings that
are a contract with the `spec.review` and `plan.review` kinds:

```bash
grep -cF 'queued: <n>' skills/tanto/SKILL.md
grep -cF 'queued: <n>' skills/tanto/roles/kanri.md
grep -cF 'queued: <n>' skills/tanto/roles/jisso.md
grep -cF 'release: /clear this window' skills/tanto/SKILL.md
grep -cF 'release: /clear this window' skills/tanto/roles/kanri.md
grep -cF 'release: /clear this window' skills/tanto/roles/sekkei.md
grep -cF 'release: /clear this window' skills/tanto/roles/keikaku.md
grep -cF 'release: /clear this window' skills/tanto/roles/kaiseki.md
grep -cF 'release: /clear this window' skills/tanto/roles/jisso.md
grep -cF '(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)' skills/tanto/SKILL.md
grep -cF '(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)' skills/tanto/templates/batch-prompt.md
grep -cF '**Shoroku proposal** section' skills/tanto/roles/sekkei.md
grep -cF '**Shoroku proposal** section' skills/tanto/roles/keikaku.md
```

Expected: thirteen lines. The first nine are **at least** `1` each and are
read rather than compared, because a role file may state a line it sends and
the same line it receives; a `0` on any of them is the failure this block
catches. The tenth and eleventh are exactly `1`: the `no-role` line's fixed
text lives in the contract and in the batch prompt, in those two files only,
so that a pasted prompt file and a sent message are the same bytes — a `1`
anywhere else means a third copy that will drift. The last two are exactly
`1` each: the review report's section name is what `roles/sekkei.md` and
`roles/keikaku.md` ask their reviewers for; `roles/kanri.md` reads the same
section by its bare heading via `sections`, never by this bold string, so it
is not pinned here — spec 8.2 names only the two review-report headings.
````

**P31.5** `docs/notes/tanto-consistency-checks.md` — insert after these 1 lines

```text
grep -rnE '\b[0-9a-f]{7,40}\b' skills/tanto/
```

**P31.5 →**

```text
grep -rnE 'exit-jiss[o]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'docs: exit shorok[u]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'Shoroku candidate[s]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'orders: plan[=]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'ask the human to delet[e]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'asks for your deletio[n]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'your deletion follow[s]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'Replace sympto[m]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'Jisso replacement deferre[d]' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
```

**P31.6** `docs/notes/tanto-consistency-checks.md` — replace exactly these 1 lines

```text
Expected: no output from the first thirteen (each exits 1). The sixth and
```

**P31.6 →**

```text
Expected: no output from the first thirteen, nor from the fifteenth through
the twenty-third, which the seat-lineage plan added (each exits 1). Those
nine sweep the three places this check already sweeps rather than
`skills/tanto/` whole, because the scripts' tests carry the retired strings
as fixtures by design; and each is written as a regular expression with one
bracketed character, for the same reason the tenth through the thirteenth
are — a plan that removes a string refuses that string in its own new
passages, so a literal here would fail the plan that installs the check. The sixth and
```

**A31.1** `docs/notes/tanto-consistency-checks.md` — `grep -c 'exit-jiss' docs/notes/tanto-consistency-checks.md` — before: 1, after: 2

Before is 1, not 0: check 20's own historical example, `` `exit-jisso-B` `` at L1121, which this task does not touch. After is 2: that line plus this task's own new `exit-jiss[o]` regex line. This file is not one of the Verification list's swept files (Task 33), so a residual historical example here is not a defect.

- [ ] **Step 2: Confirm check 24 exists, then append check 25**

Check 24 records `shoroku-at-close`'s own old-value sweep and lands with that plan's Task 10. Run:

```bash
grep -c '^## 24\. ' docs/notes/tanto-consistency-checks.md
```

Expected: `1`. **If it prints `0`, stop and report it** — this plan's branch is cut from `main` after `shoroku-at-close` merges, so a `0` means that plan's Task 10 did not land, and renumbering this section to 24 is a decision for Kanri and the human, not for the implementer.

This section's append point is deliberately checked, not anchored on a fixed
quote of what precedes it: `docs/notes/tanto-consistency-checks.md` is being
actively edited by `shoroku-at-close`'s own still-open plan as this plan is
drafted (Self-Review flag 1), and a `P` block anchored on today's exact tail
would go stale the moment that plan's own remaining tasks touch this file
again, before `seat-lineage`'s branch is even cut. The `grep` above is the
safety this task needs; Task 32's fix (a real `P` block, anchored on a
stable file nobody else is editing) does not generalize here.

With `1`, append this section at the end of the file, after check 24's last line:

````text
## 25. The old values the seat-lineage plan contradicts

The seat-lineage plan removed a lifecycle vocabulary — deletion requests, a
Jisso replaced on its ceiling, a between-plans Kanri write-out lane, and the
word "candidate" for a proposal item — and replaced it with a create
request, a rotation, one close per topic, and the word "item". The sweep it
ran at its last batch is the record, and check 7's last ten lines are that
sweep made standing. Its scope is the three places check 7 sweeps —
`skills/tanto/SKILL.md`, `skills/tanto/roles/`, `skills/tanto/templates/` —
and never `skills/tanto/scripts/`, whose tests carry retired strings as
fixtures on purpose.

Two counts are read rather than swept, because the words survive in senses
the design keeps: a file is still deleted (the handover file, an inbox copy
that never is), and a role other than Jisso is still replaced. Read the
lines, not the count:

```bash
grep -rn -i 'delet' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn -i 'replacement' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
```

Every surviving line must be about a **file** or about a role the Replace
table still holds. A line about a session being deleted, or about a Jisso
being replaced on a symptom, is drift. Three lines are the known
exceptions, all stating an absence rather than a practice:
`roles/kanri.md`'s Handover, "no deletion is asked"; its "Exit shoroku"
step 2, "no delete request goes out"; and its "Session lifecycle" opening,
"There is no delete request".
````

- [ ] **Step 3: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 31`

Expected: `task 31: verify clean`.

- [ ] **Step 4: Run checks 6 and 7 and compare with what the note now expects**

Run the note's check 6 block, its new sub-block, and its check 7 block, and compare each printed number with the Expected paragraph beside it. Record the three outputs for the dogfood report (Task 35).

Expected: every number matches. A mismatch is a defect in this plan, not in the note.

- [ ] **Step 5: Lint the changed path**

Run: `./scripts/lint.sh docs/notes/tanto-consistency-checks.md`

Expected: every hook passes.

- [ ] **Step 6: Commit**

```bash
git commit --only docs/notes/tanto-consistency-checks.md
```

Subject: `docs(notes): the consistency checks pin the queue, the release line, and the renamed tables`. End with your own `Co-Authored-By:` trailer.

### Task 32: `docs/notes/claude-code-sessions-observed.md` — what `/clear` keeps and resets

**Files:**

- Modify: `docs/notes/claude-code-sessions-observed.md` (one section appended at the end)

Spec section 8.3, first bullet. The facts are the spec's "Measured while designing" 3, 4 and 5, with the unmeasured cases named as unmeasured.

**Named mechanisms this task touches.** The **`/clear` keeps the name and `[ref]`, keeps the model, resets the effort** fact is what `roles/kanri.md`'s create request line 3 rests on (Task 15), what `templates/kanri-handover.md`'s command 2 rests on (Task 19), and what `SKILL.md`'s address bullet and `templates/roster.md`'s address-book bullet assert (Tasks 2, 17). The **line delivered to a bare window** is what the `no-role` line exists for (Task 3). The **agent-definition rescan** is the fresh-start check the final boundary runs.

This task's content is fully fixed at drafting time, so it is a proper insertion, not bare prose: `P32.1` is anchored on the file's own current last 3 lines (`wc -l` reports 253 today), which stay unchanged; the new section lands after them.

- [ ] **Step 1: Apply the insertion**

**P32.1** `docs/notes/claude-code-sessions-observed.md` — insert after these 3 lines

```text
Companion to the `git checkout --` denial above: both are classifier verdicts
on a command's shape rather than on its effect, and both are routed around by
splitting the act into steps the classifier reads separately.
```

**P32.1 →**

```text

## What `/clear` keeps and what it resets

Measured on 2026-09-16 in this repository, on the hosa window
`dotskills-1b [d12315]`, `/clear`ed at 16:22Z. Its transcripts are
`6883a717…` before the clear and `c360a34a…` after, under the config
directory's `projects/` tree for this repository.

Kept across the clear:

- **The window's name and its `[ref]`.** The roster's three post-clear rows
  carry the same `name [ref]` as the rows before it. A `/clear` is therefore
  invisible to `ListAgents`, which is why a listed name is no evidence that a
  role is behind it.
- **The model.** The first assistant record after the clear runs
  `claude-sonnet-5`, as the last record before it did.

Reset by the clear:

- **The effort.** The last turn before the clear ran at `xhigh` and the first
  after it at `medium`, with no human command between the clear and that
  turn. A create request that reuses a window therefore has to name the
  effort again; naming only the model is not enough.

Not readable from a transcript, and so not measured: **the permission mode.**
The three post-clear handshakes reported `mode=auto`, which is consistent
with the mode being kept and is not a measurement of it.

A line sent to a cleared window's name after the clear is delivered into the
bare conversation. At 16:39Z the same day, Kanri `dotskills-1e`'s
`kanri-address:` broadcast reached the bare hosa window — records 8 to 10 of
`c360a34a…` show it enqueued and dequeued under the new session id. The
window answered the human in its own window, replied nothing to the sender,
and did nothing else. A line enqueued **before** a clear has not been
observed: every enqueue in the transcripts read is dequeued in the same
millisecond, the receiver being idle, so the busy-turn case has not occurred.

Agent definitions after a clear are consistent with a rescan and are not
proven: the post-clear start line reported
`agents: 12 current, 0 written, 0 not visible to this session`, and no window
has yet had a definition written between its own start and its clear.
```

**A32.1** `docs/notes/claude-code-sessions-observed.md` — `grep -cF 'keeps and what it resets' docs/notes/claude-code-sessions-observed.md` — before: 0, after: 1

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 32`

Expected: `task 32: verify clean`.

- [ ] **Step 3: Lint the changed path**

Run: `./scripts/lint.sh docs/notes/claude-code-sessions-observed.md`

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only docs/notes/claude-code-sessions-observed.md
```

Subject: `docs(notes): /clear keeps the name and the model and resets the effort`. End with your own `Co-Authored-By:` trailer.

### Task 33: the whole-tree sweep of the old values this plan contradicts

**Files:**

- Create: `.tanto/seat-lineage/old-value-sweep.md` (untracked; the topic directory is not committed)

Spec section 10's sweep and the "Old values this plan contradicts" table. **This is the plan's one sweep-and-check task**: its deliverable is recorded output, not a file edit. Nothing in `skills/` is edited here; if the sweep finds a hit, the fix is a passage in the task that owns that file, not an edit made under this task.

**Named mechanisms this task touches.** Every string below is a mechanism some earlier task renamed, and the earlier tasks' `O` blocks name the sites one by one; this task is the whole-tree form of the same question, which the per-task needles cannot answer (a sweep for the terms a plan introduces is not a sweep for the prose those terms contradict).

- [ ] **Step 1: Run the sweep and record every count**

Run, from the repository root, and record each command's full output:

```bash
grep -c 'exit-jisso' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md
grep -c 'docs: exit shoroku' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
grep -c 'docs: T2 shoroku' skills/tanto/SKILL.md skills/tanto/roles/kanri.md
grep -c 'Shoroku candidates' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md skills/tanto/README.md
grep -ci 'candidate' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md skills/tanto/README.md
grep -c '^## Shoroku proposal items$' skills/tanto/templates/roster.md skills/tanto/templates/kanri.md
grep -c '^## Shoroku proposal$' skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md
grep -cF 'Jisso replacement deferred' skills/tanto/roles/kanri.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/kanri.md
grep -c '<dead, replaced, refused, or cleared>' skills/tanto/templates/roster-archive.md
grep -cF 'the Kanri exit' skills/tanto/templates/shoroku-brief.md
grep -cF 'asks for your deletion' skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md
grep -cF 'your deletion follows' skills/tanto/roles/jisso.md
grep -cF 'Replace symptom' skills/tanto/roles/jisso.md skills/tanto/roles/kanri.md
grep -cF '**Shoroku proposal** section' skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md
grep -cF 'queued: <n>' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md
grep -cF 'release: /clear this window' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kaiseki.md skills/tanto/roles/jisso.md
grep -rlF '(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)' skills/tanto/
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
grep -c '^### Release$' skills/tanto/roles/kanri.md
grep -c '^### Delete$' skills/tanto/roles/kanri.md
grep -rn 'orders: plan=' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn 'lifecycle request' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn 'ask the human to delete' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn 'delete and create' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn 'the ceiling replaces Kanri and Jisso' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn 'Open a new session in <repo path>' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn 'every listed peer' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn "the peers' deletion" skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn 'kanri or jisso' skills/tanto/templates
grep -rn -i 'delet' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn -i 'replacement' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rn 'only Kanri messages Jisso' skills/tanto/SKILL.md
grep -rn 'Sekkei, Keikaku, or Jisso started with no address' skills/tanto/SKILL.md
```

Expected, line by line:

- `exit-jisso`, `docs: exit shoroku`, `Shoroku candidates`, and the case-insensitive `candidate` — **`0` on every file listed**.
- `docs: T2 shoroku` — **`1` on each** of `SKILL.md` and `roles/kanri.md`.
- `^## Shoroku proposal items$` — **`1` and `1`**; `^## Shoroku proposal$` — **`1` and `1`**.
- `Jisso replacement deferred` — **`0` on each of the four**.
- `<dead, replaced, refused, or cleared>` — **`1`**; `the Kanri exit` — **`0`**.
- `asks for your deletion` — **`0` on each**; `your deletion follows` — **`0`**; `Replace symptom` — **`0` on each**.
- `**Shoroku proposal** section` — **`1` on each of the two** (`roles/sekkei.md`, `roles/keikaku.md` — `roles/kanri.md` carries no pin of its own; see Task 22).
- `queued: <n>` — **at least `1` on each of the three**; `release: /clear this window` — **at least `1` on each of the six**.
- The `no-role` line's fixed text — **exactly two paths**, `skills/tanto/SKILL.md` and `skills/tanto/templates/batch-prompt.md`.
- The `close:` line — **`1` on each of the three**.
- `^### Release$` — **`1`**; `^### Delete$` — **`0`**.
- `orders: plan=`, `lifecycle request`, `ask the human to delete`, `delete and create`, `the ceiling replaces Kanri and Jisso`, `Open a new session in <repo path>`, `every listed peer`, `the peers' deletion`, `kanri or jisso` — **no output** from each. The narrower phrase, not bare `the ceiling replaces`, is swept: `roles/kaiseki.md`'s `--role` sentence and `roles/kanri.md`'s ceiling bullet keep "the ceiling replaces Kanri only" (P24.4, P1.5), which is the spec's own new text, not a residual.
- The case-insensitive `delet` and `replacement` sweeps print lines and are **read, not counted**. Every surviving `delet` line must be about a **file** — the handover file, the SDD workspace, the topic directory, an inbox copy, a template's "delete this blank" instruction — with three known exceptions, all the spec's own new text stating an absence rather than a practice: `roles/kanri.md`'s Handover "the successor's Next step" line, "no deletion is asked" (P6.5); its "Exit shoroku" step 2, "no delete request goes out" (P14.1); and its "Session lifecycle" opening, "There is no delete request" (P15.1) — Self-Review flag 2 already names the last two, and this sweep is where the first joins them. Every surviving `replacement` line must be about a role the Replace table still holds, about the plan-writing rules in `roles/keikaku.md`, or about the rotation being Jisso's own replacement (`roles/kanri.md`'s ceiling bullet, P1.5, and `roles/kaiseki.md`'s twin, P24.4, and `roles/kanri.md`'s Readings, P5.10) — never about a Jisso replaced on a symptom, which this design retires.
- `only Kanri messages Jisso` and `Sekkei, Keikaku, or Jisso started with no address` — **one line each**: these two are kept deliberately and a `0` is the failure.

- [ ] **Step 2: Write the record**

Write `.tanto/seat-lineage/old-value-sweep.md`: one line per command above, its raw output, and the disposition of every hit — not one verdict for the set. A hit that must go names the file, the line and the task whose passage should have cleared it; that is an escalation to Kanri, not an edit made here.

- [ ] **Step 3: Run the script tests, unchanged**

Run: `mise x node@22 -- node --test skills/tanto/scripts/`

Expected: passes. No task in this plan edits `scripts/`, and the tests carry retired strings as fixtures on purpose.

- [ ] **Step 4: Report**

This task commits nothing. Its output is the batch report's material and Task 35's input. Say in the report whether every expectation above held, and list every line that did not.

### Task 34: close issue-0239 and issue-f293

**Files:**

- Move: `docs/issues/open/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md` → `docs/issues/resolved/`
- Move: `docs/issues/open/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md` → `docs/issues/resolved/`

Spec section 8.3's second bullet and "Issues this design closes". Status is encoded by directory, so a close is a `git mv` plus a `Resolved by` paragraph plus an `updated:` bump — `docs/issues/AGENTS.md`.

**Named mechanisms this task touches.** issue-0239 closes on the **absence of `exit-jisso`**, which Task 21 produced and Task 33 confirmed. issue-f293 closes on its **three sites**: the closing line in `SKILL.md`'s Messages (Task 3) and in every role file (Tasks 13, 21, 22, 23, 24, 25); Kanri's released line carrying the second fact, in `roles/kanri.md`'s Session lifecycle and "Shoroku" (Tasks 14, 15); and one clock per clause, in the Session lifecycle's opening paragraph (Task 15). Its third site — Kanri's delete request — is gone with the request itself, which is what the issue's own third section asked for in the cheapest form.

This task has no `P` block: it moves two files and appends a paragraph to each. Its checks are the anchors below.

- [ ] **Step 1: Confirm the two conditions hold**

Run:

```bash
grep -c 'exit-jisso' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md
grep -cF 'Still needs this seat' skills/tanto/SKILL.md
```

Expected: `0` on every file from the first; at least `1` from the second. If either fails, the issue is not closed and this task stops.

- [ ] **Step 2: Append the resolution paragraph to issue-0239 and bump its `updated:`**

Append at the end of `docs/issues/open/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md`:

```text
Resolved by the seat-lineage plan: a Jisso writes no exit file at all. Its
proposal is the Shoroku proposal section of the batch report it writes at
the boundary, and the plan's last Jisso writes `shoroku-proposal.md` once at
T2, so the `exit-jisso-<X>` pattern the collision needed no longer exists —
`grep -c 'exit-jisso'` is `0` across the contract, the role files and the
templates. The collision case is gone rather than renamed.
```

Set the frontmatter's `updated:` to the date the task runs.

- [ ] **Step 3: Append the resolution paragraph to issue-f293 and bump its `updated:`**

Append at the end of `docs/issues/open/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md`:

```text
Resolved by the seat-lineage plan, at all three sites. The **closing line**
is defined in `SKILL.md`'s Messages — an identity
(`<name> [<ref>] · <role>[/<topic>] · <family>`, per
`.tanto/kikaku/2026-09-17-closing-line-identity.md`) and two facts, where
the seat's work is and which contract step still needs it or `none`, with the negative rule
that a seat never names a step it is not needed for — and every role file's
idle and exit paragraph now ends with it. **Kanri's released line** carries
the second fact: `<role> <name> released — its work is in <paths>; no step
needs it — /clear its window when convenient`. **One clock per clause** is
stated in `roles/kanri.md`'s Session lifecycle: a line that speaks of a
release and of a creation keeps them in two clauses with their own times.
The third site, Kanri's delete request, is gone with the request itself:
there is no delete request any more, only a `release:` line to the seat and
one line to the human.
```

Set the frontmatter's `updated:` to the date the task runs.

- [ ] **Step 4: Move both issues to `resolved/`**

```bash
git mv docs/issues/open/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md docs/issues/resolved/
git mv docs/issues/open/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md docs/issues/resolved/
```

**A34.1** `docs/issues/resolved/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md` — `ls docs/issues/open | grep -c '^0239-' || true` — before: 1, after: 0

**A34.2** `docs/issues/resolved/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md` — `ls docs/issues/resolved | grep -c '^f293-' || true` — before: 0, after: 1

**A34.3** `docs/issues/resolved/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md` — `grep -cF 'Resolved by the seat-lineage plan' docs/issues/resolved/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md` — before: 0, after: 1

**A34.4** `docs/issues/resolved/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md` — `grep -cF 'Resolved by the seat-lineage plan' docs/issues/resolved/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md` — before: 0, after: 1

`A34.3` and `A34.4` check the resolution paragraph itself landed, not only
the move; like `A34.1` and `A34.2`, `replay` cannot copy either path from
`--base` (the dry run's own note), so this changes nothing there — it is
for `verify` at execution time.

- [ ] **Step 5: Fix inbound path links in living documents**

Run:

```bash
grep -rn 'issues/open/0239-\|issues/open/f293-' docs/ skills/ --include='*.md'
```

Expected: no output. A hit in a living document is a dead path link and is repaired here; a hit in a frozen report is left alone, because frozen documents reference by `<type>-<id>` only.

- [ ] **Step 6: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 34`

Expected: `task 34: verify clean`.

- [ ] **Step 7: Lint the changed paths**

Run: `./scripts/lint.sh docs/issues/resolved/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md docs/issues/resolved/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md`

Expected: every hook passes, the frontmatter check included.

- [ ] **Step 8: Commit**

```bash
git add docs/issues/resolved/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md docs/issues/resolved/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md
git commit --only docs/issues/open/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md docs/issues/open/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md docs/issues/resolved/0239-a-resumed-jisso-exit-file-collides-at-the-same-batch-letter.md docs/issues/resolved/f293-a-seats-turn-ending-text-is-ungoverned-and-reads-as-a-dependency.md
```

Subject: `docs(issues): close 0239 and f293 — no exit-jisso file, and a governed closing line`. End with your own `Co-Authored-By:` trailer.

### Task 35: the dogfood report

**Files:**

- Create: `docs/reports/2026-09-17-seat-lineage-dogfood.md`

created: docs/reports/2026-09-17-seat-lineage-dogfood.md

Spec section 8.3's third bullet, and its "What the plan must contain" last item. `docs/reports/AGENTS.md`: no frontmatter, the `# H1` is the title, the date lives only in the file name, the leading paragraph states the scope, and the file is frozen once written.

**Named mechanisms this task touches.** The **fresh-start check** runs at the plan's actual final boundary (D3, or the fix wave after it — Global Constraints), which is at or after this task's own commit, so this task cannot contain its result at write time; the append below is where it lands instead. That check pairs with the sessions note (Task 32) and only partly closes the spec's "Measured while designing" 5, per this task's own Step 1 note. The **queue's own figures do not exist yet**: this plan runs on the old lifecycle (rule 11), so its Jisso is one session carrying every batch, and the report says so rather than reporting a rotation it did not run.

This task has no `P` block: it creates a file. Its check is the anchor below, plus the line-ending restore in Step 4 — a Markdown file created on this host lands `w/lf` every time (measured five of five in the tanto-cost run), so the commit is followed by a restore.

Two of the report's items do not exist when this task runs, for the same reason the fresh-start check doesn't: the roster's Residency rows freeze only at the close (`docs/reports/AGENTS.md` freezes the file once written, otherwise), well after this plan's own last batch lands, whole-branch review included; and the fresh-start check itself, which the paragraph above places at or after this task's own commit. This task writes what it can and leaves the rest to a later append, the same shape `docs/reports/2026-09-11-kisou-refresh-dogfood.md`'s own "## Measurements appended at T2" section uses (`2026-09-15-shoroku-at-close-dogfood.md`'s alternative — pointing at the ledger's table instead of appending — does not fit here, since this plan's own close is what produces the Residency rows and the fresh-start result in the first place, not a table that already existed). Kanri (or Hosa, in the close's own slot) appends that section when the close's step 2 ("The final batch", step 3 in "Shoroku") fills the ledger's remaining Measurements — the same moment the Residency rows move to `roster-archive.md` — naming who ran the fresh-start check and when.

- [ ] **Step 1: Write the report**

Write `docs/reports/2026-09-17-seat-lineage-dogfood.md` with:

- A `# The seat-lineage dogfood` H1 and a leading paragraph stating the scope: what this run changed in the tanto skill and what this report preserves that the untracked `.tanto/` tree will not.
- **The old-value sweep.** Task 33's recorded counts, command by command, with the disposition of every hit — including the three lines that legitimately keep the words "delet" as an absence, not a practice (Task 33's own three known exceptions).
- **The consistency note's checks 6 and 7.** Task 31's Step 4 outputs, and whether each matched the note's Expected paragraphs.
- **What the READMEs' review found.** Task 30's six rewrites, and that `skills/shoroku/README.md` was reviewed and left unchanged.
- A closing `## Measurements appended at T2` heading, empty but for one sentence: "Added by this topic's close, once the fresh-start check has run and the Residency rows are final." This is the anchor the close's own append lands under; nothing else in this task writes under it.

**A35.1** `docs/reports/2026-09-17-seat-lineage-dogfood.md` — `grep -c '^# The seat-lineage dogfood$' docs/reports/2026-09-17-seat-lineage-dogfood.md` — before: 0, after: 1

**A35.2** `docs/reports/2026-09-17-seat-lineage-dogfood.md` — `grep -c '^## Measurements appended at T2$' docs/reports/2026-09-17-seat-lineage-dogfood.md` — before: 0, after: 1

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-17-seat-lineage.md --task 35`

Expected: `task 35: verify clean`.

- [ ] **Step 3: Lint the new path**

Run: `./scripts/lint.sh docs/reports/2026-09-17-seat-lineage-dogfood.md`

Expected: every hook passes. The file carries **no frontmatter**, by `docs/reports/AGENTS.md`.

- [ ] **Step 4: Commit, then restore the line endings**

```bash
git add docs/reports/2026-09-17-seat-lineage-dogfood.md
git commit --only docs/reports/2026-09-17-seat-lineage-dogfood.md
git checkout -- docs/reports/2026-09-17-seat-lineage-dogfood.md
git status --short
```

The created file lands `w/lf` on this host every time; the `git checkout --` after the commit brings the working copy back to the committed form. Expected: `git status --short` prints nothing.

## Self-Review

### Sizes (issue-7281)

The plan carries **35 tasks**, **147 `P` blocks**, **13 `A` anchors** and **159 `O` needles**, in roughly 5,600 lines. (Recounted after `plan.review`'s findings were fixed and the two Kikaku amendments folded in — R-6 at the idle block, R-7 at the closing line — up from the drafter's own 144/11/159, per finding 6: `P2.6`, `P20.11`, and `P32.1` were added, and `A34.3`/`A34.4` beside them, while both amendments' own edits stayed within existing blocks.)

| | Task | Lines | Steps | Blocks |
| --- | --- | --- | --- | --- |
| largest | **Task 14** — `roles/kanri.md` "Shoroku", replaced whole | **512** | **5** | 1 P, 7 O |
| second | Task 4 — `SKILL.md` "Session exit", replaced whole | 333 | 5 | 1 P, 6 O |
| third | Task 17 — `templates/roster.md` | 309 | 4 | 13 P, 12 O, 1 A |
| fourth | Task 21 — `roles/jisso.md` | 247 | 5 | 9 P, 9 O |
| fifth | Task 15 — `roles/kanri.md` "Session lifecycle", replaced whole | 237 | 5 | 1 P, 7 O |
| smallest | Task 35 — the dogfood report | 50 | 4 | 1 A |

The three whole-section replacements are large by line count and small by block count: one block each, a heading-to-heading quote the spec gives the new text for. Task 17's 13 blocks are the other shape — many one-line edits in one file — and it is the one to watch if a batch needs splitting, because 13 blocks is 13 places a reviewer checks. Task 20 is close behind at 223 lines and 11 P blocks, after `P20.11`'s addition.

**Sweep-and-check tasks: one.** Task 33, the whole-tree sweep of "Old values this plan contradicts", has no file edit and no commit; its deliverable is recorded output at `.tanto/seat-lineage/old-value-sweep.md` and the batch report. Tasks 34 and 35 have no `P` block either, but each changes the tree — two `git mv`s, a created report — so only Task 33 inverts the reviewer's standing instruction. Task 32 gained a real `P32.1` during the dry run (it originally had none, the same shape the dry run flagged and fixed); Task 31's own append (check 25) stays bare prose deliberately, since the file it appends to is still being edited by another, still-open plan and a fixed anchor on today's tail would go stale before this plan's own branch is even cut (see Task 31's own note).

### What was verified against the live tree

Everything below was run, not asserted, against branch `shoroku-at-close` at tip `17f2e4a`:

- **All 144 `P` blocks.** Every old block appears in its target file **exactly once**, and every declared line count matches the block's own length. Checked mechanically.
- **All 95 old texts the spec itself quotes.** Every one matched the live tree verbatim, including all 11 rows of the spec's section 9 table — the sites whose old text came from `shoroku-at-close`'s own passage blocks. `shoroku-at-close`'s batches B and C have landed and their text is live. **One exception, below.**
- **Every `O` needle's count.** Each was run and its number recorded in the task that carries it.
- **`passage-check.js lint --plan` is clean.** It caught fourteen needles that survived into the plan's own new-passage text; each was replaced by a run that spans its change point, or dropped where the entity had no plain-text needle and an anchor took its place (A18.1, A31.2).
- **The plan's new passages carry no retired string**, with three deliberate exceptions listed under "Flags".

### Flags for the plan reviewer

**1. Check 24 arrived mid-drafting, uncommitted, and `docs/notes/tanto-consistency-checks.md` was being edited by another session as this plan was written.** At commit `17f2e4a` the note ends at `## 23. A \`sections\` argument in prose is the bare heading` and there is no `## 24.`. While this plan was being written, `shoroku-at-close`'s Task 10 appended `## 24. The two shoroku kinds, and the stage word that is left` and rewrote two expected-count paragraphs under checks 18 and 19 — **in the working tree, not in any commit** at that moment. That modification was not this drafter's to keep or discard and was reported rather than touched. **Update, at `plan.review`'s reading (tree `9ad18f9`): check 24 is now committed**, along with two further corrections to checks 18 and 20 — `docs/notes/tanto-consistency-checks.md` may still move again before this plan's own branch is cut, since `shoroku-at-close` was still on its final batch at both readings. The handling below (confirm, stop on `0` rather than renumber) is what to run at execution time regardless of how many more times the file has moved by then. Three consequences, as first written:

- Section 8.2's numbering holds: this plan's new section is **25**, appended after 24. Task 31 Step 2 still makes the implementer confirm 24 is present and **stop** rather than renumber if it is not.
- The line numbers this plan cites for that file (L573, L583-584, L596-598, L631-633, L749, L752) were read before the in-flight edit; every one of them sits above the edit's first hunk at L1051, and all six old blocks were re-matched against the tree *after* it appeared and still occur exactly once. The numbers are informational; the blocks are matched by content.
- If `shoroku-at-close`'s Task 10 goes on to touch **check 6 or check 7** before this plan runs, P31.1 to P31.6 may stop matching. The implementer should report a non-matching block rather than re-quote it.

**2. The spec's own new text keeps the words "delete request", twice.** `roles/kanri.md`'s "Exit shoroku" step 2 ends "No recommender runs here, and no delete request goes out" (P14.1), and its "Session lifecycle" opens "There is no delete request: a seat's exit ends with your `release:` line" (P15.1). Both state the absence rather than the practice, and both are the accepted spec's own wording. But the spec's "Old values this plan contradicts" table lists `delete request` as a string that must reach `0` across the three swept places. The two cannot both hold. This plan keeps the spec's text verbatim and therefore **does not add `delete reques[t]` to check 7** (Task 31 P31.5 carries nine regexes, not ten), and Task 33's sweep names this as the one known survivor. If the reviewer would rather have the sweep clean, the fix is a spec amendment — reword those two sentences — not a plan-side rewrite of accepted text.

**3. Three prose sites the spec's passage list does not reach, added here.** Each is named by the spec's "Old values" table as living in the file, but no section gives a passage for it, and batch D's sweep cannot reach `0` without them. They are twins of sentences the spec *does* rewrite, which is the exact failure the spec review's fourth Shoroku item recorded ("a change list is built from the mechanism, not the file"):

- `roles/kanri.md` L15, L47, L111 — three more `lifecycle request` sentences beyond the opening paragraph's (Task 6, P6.2 to P6.4).
- `roles/kaiseki.md` L97 — `a \`no\` becomes a shoroku candidate that you write out yourself` (Task 24, P24.3).
- `templates/kanri.md` L66 and L86 — `batch report's Shoroku candidates` and `a candidate two closes could claim` (Task 20, P20.6 and P20.7).

**4. Two spec insertions are written as replacements.** Spec 3.2 gives a two-line replacement followed by an insertion anchored on it, and spec 7.6 gives the batch prompt's `no-role` insertion anchored on the title line spec 7.2 writes. In both cases the insertion's anchor would be the *new* text of a block in the same plan, which the "each block appears once" rule forbids. They are folded into their neighbours — P7.3 and P27.1 — and the end state is the spec's, byte for byte.

**5. `P8.1` merges two spec sections.** `roles/kanri.md`'s "When the plan lands" step 3 carries 3.3's section-name rename at one line and 3.10's `Delete row` → `Release row` four lines below; a block may not overlap another, so one block carries both.

**6. Check 6's expected-count list.** The note's ninth expected number for `exit-<role>` in `SKILL.md` is `5` today while the tree prints `4` — an existing drift the spec attributes to `shoroku-at-close`'s Task 10. This plan writes `2`, the number its own "Session exit" yields, and says so in the note. If Task 10 lands a different correction first, Task 31 P31.3's old block will not match and the implementer should report it rather than re-quote.

**7. Task 31's new check-7 lines are regexes, not literals.** Each carries one bracketed character (`exit-jiss[o]`, `Shoroku candidate[s]`, …), following the note's own rule at that check: a plan that removes a string refuses that string in its own new passages, so a literal would fail the plan that installs the check. `passage-check.js lint` confirms none of the plan's new passages carries a needle.

### Spec coverage

Every section of the spec's "Where each change lives" table has at least one task: 2.1-2.8 → Tasks 1-5; 3.1-3.10 → Tasks 6-16; 4.1-4.5 → Task 21; 5.1/5.4 → Task 22; 5.2/5.4 → Task 23; 5.3/5.4 → Task 24; 6.1 → Task 25; 6.2/6.3 → Task 26; 7.1/7.6 → Task 17; 7.6 (`roster-archive`) → Task 18; 7.2/7.6 → Task 27; 7.3/7.6 → Task 19; 7.4 → Task 28; 7.5/7.6 → Tasks 20 and 29; 8.1 → Task 30; 8.2 → Task 31; 8.3 → Tasks 32, 34, 35. The spec's "Not touched" list has no task: `scripts/` and its tests, `templates/tanto.json`, `templates/agent.md`, `templates/kikaku-decision.md`, `templates/bug-report.md`, `templates/kaiseki-brief.md`, `templates/review-brief.md`, `skills/shoroku/SKILL.md`. The spec's Verification list is covered by Task 33's sweep, with each earlier task naming the final grep its change contributes to.

### What is deliberately absent

Global Constraints, Batches, and How a batch is verified were written by
Keikaku after this draft, including the statement of the boundary from
which a role may be started or replaced (batch D3, the plan's own final
one). No report or prompt skeleton appears in the plan: reports and
prompts follow the tanto templates, and the plan names nothing else.
