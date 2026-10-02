# tanto-issue-triage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the issue pile under `docs/issues/open/` and `docs/issues/deferred/` by instrument — a liveness table read from git, one recommend task per round file on sonnet checked by the two opus SDD reviewers, the human's answers by exception as direction files written between batches, one bulk apply — and leave behind a per-finder counter that a close runs by hand beside the `exp-` count.

**Architecture:** Two dependency-free Node scripts under the repository's `scripts/`. `issue-liveness.js` loads `main`'s tree once, checks every quoted string and path token of every pile issue against it in memory, traces what is gone to the removing commit's subject, assigns each issue a cluster and a round file, and writes untracked tables under `.tanto/tanto-issue-triage/`. One plan task per round file reads its table and writes an untracked recommendation and a brief in the human's language; Kanri writes one direction file per round file from the human's answers at the boundaries; two apply tasks move and annotate `docs/issues/` in one commit per round file. `issues-by-finder.js` counts issues per topic by the role that proposed them and runs the exit-criterion note's `exp-` recipe as one command. Nothing under `skills/` changes, so no task carries a passage block: each task's rules and its own Verify stand in.

**Tech Stack:** Node 22 or later (this host: v24.16.0), CommonJS with `node:` built-ins and no dependencies (the style of `skills/tanto/scripts/passage-check.js`); `node:test`, run as the quoted glob `node --test --test-reporter=tap 'scripts/*.test.js'` — quoted so that Node expands it, since the unquoted form fails on this host, and matching nothing until Task 1 lands the first `*.test.js` under `scripts/`; git (`ls-tree`, `show`, `log --pickaxe-regex -S`, `mv`, `commit --only`); `./scripts/lint.sh <paths>` on named files, never a directory (issue-5050), which runs pre-commit — biome for `*.js` (2-space indent, line width 120) and markdownlint for Markdown; `uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py <files>` for issue frontmatter and the `Source:` line. `.gitattributes` makes `*.js` LF in every checkout; Markdown follows `core.autocrlf=true`, so the issue files read `i/lf w/crlf attr/text=auto` and a Markdown file created fresh lands `w/lf`.

**Spec:** `docs/superpowers/specs/2026-10-02-tanto-issue-triage-design.md` — committed on this branch and accepted (the human's answers are Q-1 to Q-10 and the review gate in `.tanto/tanto-issue-triage/dialogue.md`; Kanri's I-1 is in `.tanto/tanto-issue-triage/spec-inputs.md`). The plan argues from the spec; executors read both.

## Global Constraints

- **AGENTS.md.** Every commit follows the repo's `AGENTS.md`: run `./scripts/lint.sh` (`scripts\lint.bat` on Windows) on the changed paths, relative to the repo root — file paths, never a directory (issue-5050) — and fix issues before committing; commit by explicit path with `git commit --only` — the index is shared, so a new file needs `git add -- <path>` first; the message goes **before** the `--` that opens the path list (`git commit --only -m "<subject>" -m "<trailer>" -- <paths>`; after the `--` git reads `-m` as a pathspec, S-49); end every commit message with a `Co-Authored-By:` trailer naming the agent that made it; never `git add -A`/`.`/`-u`, a bare `git commit`, or `git commit -a`; never bypass a commit or push hook (`--no-verify`, `-n`); never amend a published commit; never push to `origin/main`. This plan lands its commits on the `tanto-issue-triage` branch; the merge to `main` is the human's decision at the topic's close (the kessai), not a step of this plan. No file the "Never do" list protects is edited without the human's approval: not an agent instruction file (`CLAUDE.md`, any `AGENTS.md`), not repo-root Markdown (`README.md`, `CONTRIBUTING.md`), not any linter or formatter config. The apply repoints inbound path links in living documents (spec section 4); measured at drafting, `git grep -E 'docs/issues/(open|deferred)/[0-9a-f]{4}'` outside `docs/issues/`, `docs/reports/`, `docs/decisions/` and `docs/superpowers/` finds only the frontmatter checker's own test, so no root file or `AGENTS.md` is expected in any `inbound` list. If one is, the apply does **not** edit it: the task's Jisso reports the file and the path under Questions for the human as a scope question (the approval is the human's, through Kanri) and leaves that one link.
- **Not yours to discard.** A modification in the shared tree that you, or a subagent you dispatched, did not make is not yours to discard — report it, one line naming the file and what changed, rather than running `git checkout --` or `git clean` on your own judgment. Only Kanri decides whether it is stray (Rule 5). The one exception is the line-ending restore this plan writes into a task's own steps, which names its own path.
- **Model families**, read from `templates/tanto.json` in the tanto skill's own directory, merged with the personal `tanto.json` (it sets `language` only) and this repository's `.claude/tanto.json` (it overrides `sessions.kikaku` and `sessions.sekkei` only), at this plan's drafting. Neither override touches a subagent kind, so every kind below is the built-in default. Every dispatch you make names both a `subagent_type` and a `model` together — an omitted `model` inherits your own session's, which is not what these kinds are pinned to:

  | Kind | `subagent_type` | Model | Effort |
  | --- | --- | --- | --- |
  | `task.implement` (SDD fix rounds 1-3 — not triage rounds; **every round task of batches B, C and D**) | `tanto-task-implement` | sonnet | high |
  | `task.escalate` (SDD fix rounds 4-5, one tier above the implementer that got stuck) | `tanto-task-escalate` | opus | high |
  | `task.review-spec` | `tanto-task-review-spec` | opus | medium |
  | `task.review-quality` | `tanto-task-review-quality` | opus | medium |
  | `default` (an ad-hoc search outside the SDD loop) | `tanto-default` | sonnet | medium |

  No `shoroku.recommend` or other top-family dispatch is made by any task of this plan: the round tasks are SDD tasks on sonnet whose only opus eyes are the two reviews the loop already carries (spec Fixed input 4, ADR candidate 2).
- **Contract rule 11 does not bind this plan.** No task edits a file under `skills/`, so no role file is half-edited mid-run and a role may be started or replaced at any boundary. This is not a skill-editing plan.
- **What is never edited.** Nothing under `skills/`, `.claude/`, or `docs/experience/` is edited — a repointed path link in a living document excepted, Task 14 and Task 15; no ADR body under `docs/decisions/` and no dated report under `docs/reports/` is edited (Task 17 writes one **new** report); no new frontmatter field, no `tags:` or `carrier:` key; no severity pass; no scene or hub edit; `tanto.json` at no layer; `docs/issues/resolved/` is not re-triaged and its 99 files are not read; nothing under `docs/superpowers/` except this plan's own file.
- **The batch letters.** The spec's batches B and C each hold three rounds; with a round above fifty issues split in two by the instrument (spec section 1, Q-10) a half would hold five round files, which is over the three or four tasks a batch carries (Rule 7). So the recommend runs are three batches — **B** rounds 1 and 2, **C** rounds 3 and 4, **D** rounds 5 and 6, each cut at a whole round — and the spec's "batch D", the apply, is this plan's **batch E**. The spec's sentence that a split round "adds a recommend batch, that batch's boundary is a sitting too" is the rule this plan applies three times. Every sentence below that names a sitting means the boundary after B, after C, or after D; every sentence that names the apply means batch E.
- **The round files.** A round's recommend task is written for one **round file** — `liveness-R<n>.md`, or `liveness-R<n>a.md` and `liveness-R<n>b.md` when the instrument split round `<n>` for holding more than fifty issues. The instrument's split rule fixes the list, and Task 3 writes it to `.tanto/tanto-issue-triage/round-files.txt`, one name part per line (`1a`, `1b`, `2a`, `2b`, `3`, `4a`, `4b`, `5`, `6a`, `6b`), and checks it against the ten this plan has tasks for. Only round 1 may differ: measured at drafting, a title-only count put round 1 at 50 issues (not above fifty, so no split) under the whole-word rule and the spec review measured 61, so **Task 5 (round 1b) is void when `round-files.txt` has no `1b`**: its implementer reports `void — round 1 not split`, writes nothing, and the batch holds three tasks. Any other list is a plan defect: Task 3's Jisso stops at the boundary and reports it under Deviations from the plan; Kanri rules on it at batch A's boundary, sends the plan back to Keikaku for correction (a resumed Keikaku seat, or a successor), and spawns batch B only after the corrected plan is committed. That ruling is not a sitting act.
- **The sittings are decision-bba6's cycle, run once per recommend batch** (spec section 3; the Kikaku decision `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` section 2 puts the kessai cluster by cluster into this topic; decision-bba6's Consequences say a boundary that waits for a direction file is named by the plan's Global Constraints, and this is that naming). At the boundary after each of batches B, C and D, Kanri's acts are **three, plus one withheld**, and nothing else of Kanri's:
  1. one `attention` request whose message is `kessai: tanto-issue-triage rounds <n>–<m> — claude attach <id>`, the spawner filling the id — `1–2` after B, `3–4` after C, `5–6` after D — and Kanri's first line to the human, after B, says there are three sittings and not two, since the spec and Q-3 spoke of two;
  2. one line per round **file** of that batch in its own window, in the human's language, read from the verdict's copy of the report's Questions for the human and never from a brief: `R<n>: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>`, then one closing line saying how to answer — per round, by exception, `OK` or the numbers that go the other way. It does not print a brief;
  3. one `triage-R<n>-direction.md` per round file, written the moment that round's answer is complete and not at the sitting's end, from the answer and nothing else: a two-line header, `Route: <where the answer came from>` and `Date: <YYYY-MM-DD>`, then either the one line `OK` or one line per item that goes the other way, `<n> — <destination word> [<target>] — <the human's words verbatim>`; a word Kanri cannot normalize to a destination is written verbatim with the destination `unclear`, and the apply leaves that item Kept and reports it; an item the human does not name goes as recommended and the direction does not repeat it;
  4. **withheld: batch E is not spawned until a direction file exists for every name in `round-files.txt`**, Kanri saying so in its own window at each boundary while they do not yet — a plain `ls` Kanri runs at every wake-up, the ledger's Progress line reading `batch E waits on triage directions — <k> of <N> exist` meanwhile. Batches C and D **are** spawned at the previous boundary without waiting: their tasks read the liveness files and never a direction.

  The human answers by any of the close kessai's three routes: Kanri's window by `claude attach`; a Kikaku decision file whose third section names the round's recommendation and answers it (decision-9cc5); or a live Hosa, whose chore is the skill's existing line `kessai answer: tanto-issue-triage — <the human's words verbatim>`, the words naming the round (`R2a: OK`, `R3: 12 は Kept`) — no role file learns an `R<n>` form (I-1, amendment 2). A bare `OK` with no round names a sitting only when exactly one is open, and then answers **every round file of that sitting**; when two or more sittings are open (a sitting left unanswered while a later boundary passed), and for an answer naming an item number and no round, nothing is guessed: Kanri asks one line and writes nothing until it is answered. An answer to a sitting that arrives after a later boundary is written all the same, and each later `attention` request names only its own batch's rounds. **The form greps at these boundaries are `boundary.verify`'s, not an act of Kanri's** (I-1, amendment 1): each round task's Verify carries them, "How a batch is verified" runs them for every round file on disk, and the verdict's Failures section is where a bad brief shows; on a failure there Kanri sends that one round back as a rework whose task list is that round's one task (`B-rework-<n>`, `C-rework-<n>`, `D-rework-<n>`). Nothing else in the run waits on the human, and a Jisso never does. Two further acts of Kanri's are **not** sitting acts: the ruling on a mis-split `round-files.txt` above, at batch A's boundary; and, at batch E's boundary, the relay to the human of a scope question that Task 14 or Task 15 reports about a root Markdown or agent-instruction file's inbound link (the approval is the human's, through Kanri).
- **The batch report's Questions for the human is extended by one item kind** (spec section 2; Kanri's choice of the two forms the spec review offered, ruled at R-3 and in I-1's follow-up — this plan's Global Constraints, which the batch prompts quote, extend what `roles/jisso.md` lists for Questions for the human, and for this plan they bind): each round task's batch report carries, under Questions for the human, the line `R<n>: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>` — a status line for Kanri's window, **not a question** — because the boundary brief copies that section into the verdict and a line under For Kanri would not reach Kanri without a skill edit this topic does not make. A round task's Jisso writes no other kind of line there except the four SDD stop classes and a scope or spec change, which stay what `roles/jisso.md` says. Kanri prints the `R<n>:` line in its own window as sitting act 2 and forwards nothing of it to the human as a question.
- **The round tasks read little and check cheaply.** Every `task.implement` of batches B, C and D reads only its own round file's `liveness-R<n>.md`, the `title:` of every issue in the round, and the body of an issue it needs — a Landed candidate's, a Merged pair's, a Re-hung candidate's — and the live file a gone string's subject points at when the subject does not say whether the gap closed; it reads no other round's file. The `task.review-spec` reviewer reads the recommendation, the round's liveness table, and the bodies of the Landed and Merged items only, and runs the `exp-` lookup for the Re-hung items; the `task.review-quality` reviewer runs the greps and reads no issue body (`exp-178d`). **A rework of a round is a rework of that one task.** The two output files and the liveness files are untracked: no round task commits, and `git status --porcelain` is empty at its end.
- **The instrument reads `main`; the apply's `git mv` runs on the branch.** Task 3's run passes no `--ref` (the default is `main`; the branch has touched none of the trees the needles point into). The apply (batch E) edits the working tree on `tanto-issue-triage`.
- **Line endings.** `git ls-files --eol` reads `i/lf w/crlf attr/text=auto` for every issue file: the index holds LF, the working tree CRLF under `core.autocrlf=true`. Every paragraph the apply appends uses the file's own working-tree ending — detect it from the file's bytes, never a bare `\n` into a CRLF file. The scripts are `*.js text eol=lf` by `.gitattributes`, so they are LF in both places. A task that creates a Markdown file and later checks its line endings (Task 17) writes the restore — `touch <path>`, then `git checkout -- <path>`, after the commit (a plain `git checkout --` is a no-op on a file git sees unchanged; the `touch` makes it stat-dirty so git rewrites it in the working tree's ending, measured in a scratch repository) — into its own steps: a Markdown file written fresh lands `w/lf` on this host every time.
- **Every commit names both sides of a rename.** An issue move is `git mv <old> <new>` with `updated:` bumped, then `git add -- <each new path>`, then `git commit --only -m "<subject>" -m "<trailer>" -- <each old path> <each new path> <each edited path>`; the old path is named, or the vacated path survives in `HEAD` (issue-9350, measured). `git add -A -- <paths>` is not used.
- **The test command and its runtime.** The suite is `node --test 'scripts/*.test.js'` — the quoted glob, never the directory form and never the unquoted glob, which fails on this host (issue-235b). It needs Node 22 or later (`CONTRIBUTING.md`, Prerequisites); this host measured v24.16.0 at drafting. Every task that runs it prints `node --version` first, so a version claim is a run and not an assertion. `scripts/` holds no `*.test.js` before Task 1, so the glob matches nothing until then; "How a batch is verified" guards it.
- **This plan carries no passage blocks.** Its tracked edits are four new scripts and test files, one sentence in a note, one new report, and bulk moves and appended lines whose text exists only at run time — nothing is quoted from a live file for an edit, so there is no `P`, `A`, `O`, or `W` block. Each task's own Verify stands in for `verify`, and the boundary's `diff` is filtered by path for `docs/issues/`, `scripts/issue-liveness*.js`, `scripts/issues-by-finder*.js`, `docs/reports/`, the note, and the repointed living documents, as `experience-layer`'s plan did for its run-time families. The old values the spec says it contradicts are none, so there is no `O` row.
- **Named-mechanism rule for tasks.** A task that introduces or changes a named mechanism — the five destination words, the round-file name part, the direction file, the `Source:` kinds, the finder names, the verdict words, the cluster names — lists in its own text every other site in this plan's files, and in the repository files this plan touches, that names the same mechanism, so that its reviewer checks them together.
- **Reports and prompts follow the tanto templates.** No skeleton for a batch report, a batch prompt, or a review brief appears in this plan; the templates in the skill directory are the skeletons. The round tasks' own brief is a different thing — the triage check brief, whose form the round tasks state.

Lines that `replay` and `boundary` read at column 0:

```text
replay-skip: # tree-state — a fence that carries this comment reads the live tree, the untracked .tanto/ files, git, the linter, the Node suite, or `liveness.json`; the applied scratch tree, a set of copied blobs, holds none of them. A task fence that needs any of those opens with the comment; the fences under "How a batch is verified" never carry it, because boundary honors the same pattern
created: scripts/issue-liveness.js
created: scripts/issue-liveness.test.js
created: scripts/issues-by-finder.js
created: scripts/issues-by-finder.test.js
```

## File structure

| File | What this plan does to it | Batch | Tasks |
| --- | --- | --- | --- |
| `scripts/issue-liveness.js`, `scripts/issue-liveness.test.js` | **new** — spec section 1: the CLI, extraction, the tree load, alive and gone, the trace, the verdict (Task 1); the cluster table, the round map and its split, neighbors, inbound, the three outputs (Task 2) | A | 1, 2 |
| `.tanto/tanto-issue-triage/liveness.json`, `liveness-R<part>.md` (one per round file: `liveness-R1a.md` … `liveness-R6b.md`, or `liveness-R1.md` when round 1 is not split) | untracked — the instrument's run, spec section 1 | A | 3 |
| `.tanto/tanto-issue-triage/round-files.txt`, `instrument-figures.txt` | untracked — the round-file list in table order, and the run's figures for the batch report and the dogfood report | A | 3 |
| `.tanto/tanto-issue-triage/triage-R<part>-recommendation.md`, `triage-R<part>-brief.md`, one pair per round file | untracked — spec section 2 | B (rounds 1a, 1b, 2a, 2b), C (3, 4a, 4b), D (5, 6a, 6b) | 4–13, one round file each |
| `.tanto/tanto-issue-triage/triage-R<part>-direction.md`, one per round file | untracked — written by Kanri from the human's answers, spec section 3 | the boundaries after B, C and D | — |
| `docs/issues/open/**`, `docs/issues/deferred/**`, `docs/issues/resolved/**` | moves into `resolved/` and appended last paragraphs per the effective destinations, spec section 4 | E | 14 (rounds 1 to 3), 15 (rounds 4 to 6) |
| the living documents named in `liveness.json` `inbound` (under `docs/experience/`, `docs/design/`, `docs/notes/`, `docs/issues/open/`, `docs/issues/deferred/`, and the hub `docs/experience.md`; a root Markdown or agent-instruction file is left and reported) | a moved issue's old path replaced by its new one, spec section 4 | E | 14, 15 |
| `.tanto/tanto-issue-triage/apply-helper.js`, `apply-R<part>-*.txt`, `apply-R<part>-list.tsv` | untracked scratch the apply tasks write and their commit steps read | E | 14, 15 |
| `scripts/issues-by-finder.js`, `scripts/issues-by-finder.test.js` | **new** — spec section 5 | E | 16 |
| `docs/notes/experience-layer-exit-criterion.md` | one sentence, spec section 6 | E | 16 |
| `docs/reports/<YYYY-MM-DD>-tanto-issue-triage-dogfood.md` | **new** — spec section 6 | E | 17 |

Nothing under `skills/`, `.claude/`, or `docs/experience/` changes beyond a repointed path link; no ADR body and no dated report other than this plan's own new one is edited; `scripts/check_md_frontmatter.py`, the linter configs, and every agent-instruction file are untouched.

## Batches

Seventeen tasks in five batches, three or four tasks a batch (Rule 7). A role may be started or replaced at any boundary (Global Constraints, rule 11 does not bind). **The boundaries after B, C and D are the sittings of the Global Constraints; batches C and D are spawned without waiting for the human; batch E is not spawned until a direction file exists for every name in `round-files.txt`.** The spec's batch D, the apply, is this plan's batch E (Global Constraints, "The batch letters").

| Batch | Tasks | Delivers | Stop condition at this boundary |
| --- | --- | --- | --- |
| A | 1, 2, 3 | `scripts/issue-liveness.js` and its test file in two commits (the core, then the classification and outputs); the instrument's run — `liveness.json`, `liveness-R*.md`, `round-files.txt`, untracked — and a report carrying the `meta` counts, the round-files list, the agreement with the working note, and the `no commit found` count | Tasks 1-3 Verify clean; `node --test 'scripts/*.test.js'` passes on Node 22 or later; `round-files.txt` is the ten names or the nine without `1b`, else the Jisso stops and reports a plan defect; the six or more `liveness-R*.md` files are as many as the lines of `round-files.txt`; `liveness.json` holds one object per issue under `open/` and `deferred/` after its `meta`; `git status --porcelain` empty |
| B | 4, 5, 6, 7 | Rounds 1a, 1b, 2a, 2b — a recommendation and a brief each, untracked (Task 5 void when round 1 is not split) | Tasks 4-7 Verify clean (a void Task 5's Verify is its `grep`); the form greps of "How a batch is verified" pass for every round file written; no tracked file changed; the report's Questions for the human carries one `R<n>:` status line per round file written — **Kanri's sitting 1: the `attention` request, one line per round file, the direction files as the answers arrive; batch C is spawned without waiting** |
| C | 8, 9, 10 | Rounds 3, 4a, 4b, as batch B | As batch B for rounds 3, 4a, 4b — **sitting 2; batch D is spawned without waiting** |
| D | 11, 12, 13 | Rounds 5, 6a, 6b, as batch B | As batch B for rounds 5, 6a, 6b — **sitting 3; Kanri withholds batch E until `round-files.txt`'s every name has its `triage-R<n>-direction.md`** |
| E | 14, 15, 16, 17 | The apply of rounds 1-3 and of rounds 4-6 (one `docs(issues): triage round <n> — …` commit per round file, in order); `scripts/issues-by-finder.js` with its tests and the note's one sentence; the dogfood report | Tasks 14-17 Verify clean; every command under "How a batch is verified" at its stated value, including the per-commit path checks of the apply and the old-path grep over the living documents; the suite passes; `git status --porcelain` empty; the report present with every item of spec section 6 |

Task 15 is Task 14 for the other half of the rounds, by citation: the batch prompt for batch E hands Task 15's implementer Task 14's text together with Task 15's, since the implementer is not told to read the plan.

## How a batch is verified

Every batch is verified the same way. This plan carries no passage blocks, so there is no `verify` invocation per task: each task's own Verify steps stand in, and the commands below are the boundary's. They are guarded by the state the batches leave on disk, so each one is meaningful at every boundary: a command whose phase has not landed prints that and exits `0`, and from batch E's boundary every one of them runs for real. `boundary` runs each fenced block verbatim and judges it by its **exit status alone**, so every block below prints its numbers *and* exits non-zero when one is wrong — a bare `grep -c` that prints `0` exits `1`, which would read as a failure where `0` is the answer, and a plain `for` loop's status is only its last iteration's, which is why each loop carries its own `|| exit 1`.

1. The boundary check, comparing the branch's actual commits against this plan's own (absent) passage blocks. Four families of lines are not quotable by construction and are filtered by path, not waved through: the spec and the plan under `docs/superpowers/` (the branch's own first commits); the four `created:` script paths (exempt by their own declaration); once an apply commit exists, the moves, appended paragraphs and repointed links under `docs/issues/`, `docs/experience/`, `docs/design/` and `docs/notes/`; and once the dogfood report exists, `docs/reports/`. `$TANTO` is set in the same shell invocation, since shell state does not persist between tool calls:

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
out=$(node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-10-02-tanto-issue-triage.md --base "$(git merge-base main HEAD)"; true)
allowed='^(unaccounted-added|unexplained-removed): docs/superpowers/'
if git log main..HEAD --format=%h --grep='^docs(issues): triage round ' | grep -q .; then allowed="$allowed|^(unaccounted-added|unexplained-removed): docs/(issues|experience|design|notes)/"; allowed="$allowed|^(unaccounted-added|unexplained-removed): docs/experience\\.md — "; fi
if ls docs/reports/*-tanto-issue-triage-dogfood.md >/dev/null 2>&1; then allowed="$allowed|^(unaccounted-added|unexplained-removed): docs/reports/"; fi
if [ -e scripts/issues-by-finder.js ]; then allowed="$allowed|^(unaccounted-added|unexplained-removed): docs/notes/experience-layer-exit-criterion\\.md — "; fi
bad=$(printf '%s\n' "$out" | grep -E '^(unaccounted-added|unexplained-removed): ' | grep -vE "$allowed" || true)
[ -z "$bad" ] || { printf '%s\n' "$bad"; exit 1; }
printf '%s\n' "$out" | tail -1
```

Expected: `diff: clean` or the count line of the last output; no line outside the filtered families named above. From the batch that lands each family the filter is path-wide for it, so the checks that stand in for `diff` there are step 5's per-commit path lists, each task's own Verify, the suite at every boundary, and `git status --porcelain`.

2. Lint, on every path the branch has changed **by name** — `scripts/lint.sh` takes path arguments (it falls back to `--all-files` only when given none), so the command builds the list and never passes a directory:

```bash
base=$(git merge-base main HEAD)
files=$(git diff --name-only --diff-filter=d "$base" -- . ':!docs/superpowers' ':!.tanto')
[ -z "$files" ] && { echo 'no changed paths'; exit 0; }
printf '%s\n' "$files" | xargs ./scripts/lint.sh
```

Expected: every hook passes. A hook that auto-fixes leaves the change unstaged — re-stage and re-run.

3. The suite, on Node 22 or later, from batch A:

```bash
[ -e scripts/issue-liveness.test.js ] || { echo 'batch A not landed — skipped'; exit 0; }
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
out=$(node --test --test-reporter=tap 'scripts/*.test.js' 2>&1)
p=$(printf '%s\n' "$out" | sed -n 's/^# pass \([0-9][0-9]*\).*/\1/p')
f=$(printf '%s\n' "$out" | sed -n 's/^# fail \([0-9][0-9]*\).*/\1/p')
printf 'pass %s fail %s\n' "$p" "$f"
[ "${p:-0}" -ge 1 ] && [ "${f:-1}" = 0 ]
```

Expected: `pass N fail 0` with N at least 1 — the count of cases is the implementer's, and every case of the spec's two test paragraphs is one of them.

4. Phase A (the instrument has run) — the run's outputs:

```bash
d=.tanto/tanto-issue-triage
[ -e "$d/liveness.json" ] || { echo 'phase A run not landed — skipped'; exit 0; }
test -s "$d/round-files.txt" || { echo 'round-files.txt missing or empty'; exit 1; }
n=$(ls "$d"/liveness-R*.md | wc -l); m=$(tr -d '\r' < "$d/round-files.txt" | grep -c . || true)
printf 'round tables %s, round-files lines %s\n' "$n" "$m"; [ "$n" = "$m" ] || exit 1
list=$(tr -d '\r' < "$d/round-files.txt" | tr '\n' ' ' | sed 's/ $//')
printf 'round files: %s\n' "$list"
[ "$list" = '1a 1b 2a 2b 3 4a 4b 5 6a 6b' ] || [ "$list" = '1 2a 2b 3 4a 4b 5 6a 6b' ] || { echo 'round-files.txt is not one of the two lists this plan has tasks for'; exit 1; }
node -e '
const j = require("./.tanto/tanto-issue-triage/liveness.json");
const sum = Object.values(j[0].meta.verdicts).reduce((a, b) => a + b, 0);
console.log("issues " + (j.length - 1) + ", verdict counts sum " + sum);
process.exit(j.length - 1 === sum ? 0 : 1);
' || exit 1
if git log main..HEAD --format=%h --grep='^docs(issues): triage round ' | grep -q .; then echo 'apply landed — the pile no longer equals the run, count check skipped'; exit 0; fi
p=$(ls docs/issues/open docs/issues/deferred | grep -c '\.md$' || true)
c=$(node -e 'console.log(require("./.tanto/tanto-issue-triage/liveness.json").length - 1)')
printf 'pile %s, liveness rows %s\n' "$p" "$c"; [ "$p" = "$c" ]
```

Expected: the round-file list, `issues N, verdict counts sum N`, and `pile N, liveness rows N` with the same N (the last check is skipped once the first apply commit exists).

5. Phases B, C and D (a round's recommendation exists) — the six form greps per round file, run for every name in `round-files.txt` whose recommendation is on disk. They are the spec's six greps plus the section-agreement and item-form checks of each round task's Step 5, so a brief that misplaces an item, or a recommendation that contradicts its own section, shows in the verdict's Failures section; Kanri runs none of them (Global Constraints):

```bash
d=.tanto/tanto-issue-triage; rf=$d/round-files.txt
[ -e "$rf" ] || { echo 'phase A run not landed — skipped'; exit 0; }
seen=0
for r in $(tr -d '\r' < "$rf"); do
  rec=$d/triage-R$r-recommendation.md; br=$d/triage-R$r-brief.md; lv=$d/liveness-R$r.md
  [ -e "$rec" ] || { echo "R$r: not written yet — skipped"; continue; }
  [ -e "$br" ] || { echo "R$r: the brief is missing"; exit 1; }
  seen=$((seen + 1))
  [ "$(tr -d '\r' < "$rec" | grep '^## ')" = "$(printf '## Landed\n## Merged\n## Assigned\n## Re-hung\n## Kept\n## Wants no scene states')" ] || { echo "R$r: the recommendation's ## headings are not the six, in order"; exit 1; }
  [ "$(tr -d '\r' < "$br" | grep '^## ')" = "$(printf '## How to answer\n## Landed\n## Merged\n## Assigned\n## Re-hung\n## Kept')" ] || { echo "R$r: the brief's ## headings are not the six, in order"; exit 1; }
  want=$(grep -cE '^\| [0-9a-f]{4} \|' "$lv" || true); got=$(grep -c '^### ' "$rec" || true)
  printf 'R%s: %s issues in the liveness table, %s ### headings\n' "$r" "$want" "$got"; [ "$want" -gt 0 ] && [ "$want" = "$got" ] || exit 1
  a=$(grep -oE '^\| [0-9a-f]{4} ' "$lv" | tr -d '| \r' | sort); b=$(tr -d '\r' < "$rec" | grep '^### ' | grep -oE '\(issue-[0-9a-f]{4}\)$' | sed 's/(issue-//;s/)//' | sort)
  [ "$a" = "$b" ] || { echo "R$r: the ### headings' ids are not the liveness table's ids"; exit 1; }
  tr -d '\r' < "$rec" | grep '^### ' | sed 's/^### //' | while IFS= read -r h; do c=$(grep -cF -- "See: $h" "$br" || true); [ "$c" = 1 ] || { echo "R$r: the brief names this heading $c times: $h"; exit 1; }; done || exit 1
  tr -d '\r' < "$br" | awk '/^## /{started=1; h=($0=="## How to answer"); sec=substr($0,4); sec=tolower(sec); gsub(/-/,"",sec); next} !started||h||!NF{next} $0=="none"{next} {t=$0; if (sub(/^[0-9]+\. \[/,"",t)) {sub(/\].*/,"",t); if (t==sec) next} print "bad brief line: " $0; bad=1} END{exit bad}' || { echo "R$r: a brief line under a destination heading is not <n>. [<its tag>] …"; exit 1; }
  n=$(tr -d '\r' < "$br" | grep -cE '^[0-9]+\. \[(landed|merged|assigned|rehung|kept)\]' || true); [ "$n" = "$got" ] || { echo "R$r: $n brief item lines for $got issues"; exit 1; }
  awk '
  { sub(/\r$/, "") }
  /^## / { sec = substr($0, 4); next }
  /^### / {
    if (need > 0) { print "incomplete item before: " $0; bad = 1 }
    if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
    need = 4; want = "Destination: " sec; next
  }
  need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
  need == 3 && /^Target: / { need = 2; next }
  need == 2 && /^Reason: / { need = 1; next }
  need == 1 && /^Evidence: / { need = 0; next }
  need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
  sec == "Wants no scene states" && NF > 0 {
    if ($0 == "none") { nn++; next }
    if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
    w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
  }
  END {
    if (need > 0) { print "incomplete last item"; bad = 1 }
    if (nn && w) { print "none beside want bullets"; bad = 1 }
    if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
    exit bad
  }' "$rec" || exit 1
  echo 'every item has its four lines under the right section; the Wants section is well formed'
  awk '
  { sub(/\r$/, "") }
  /^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
  tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
  END { exit bad }' "$br" || exit 1
  s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$rec" | LC_ALL=C sort)
  x=$(awk '
  { sub(/\r$/, "") }
  /^## / { sec = substr($0, 4); next }
  /^[0-9]+\. \[/ {
    s = $0; p = 0
    while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
    if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
    t = substr(s, p + length(" — See: "))
    n1 = s; sub(/\..*/, "", n1)
    n2 = t; sub(/ .*/, "", n2)
    if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
    print t " @ " sec
  }
  END { exit bad }' "$br") || exit 1
  s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
  [ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
  w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$rec")
  u=$(grep -c ' — want unstated — See: ' "$br" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
  echo 'every ### heading appears once after See:, under its own destination, and no other'
done
printf 'round files checked: %s\n' "$seen"
```

Expected: one `R<n>: N issues in the liveness table, N ### headings` line per round file on disk, and `round files checked: K`. A brief's `See:` pointer is the recommendation's heading text with its `### ` marker stripped; the spec reviewer reads the prose, and this block never does.

6. The apply (an apply commit exists) — the per-commit path lists and the old-path grep. The renamed and merged-away issues are the `R` and `D`/`A` lines of the commit; the counts against the directions are the apply tasks' own Verify:

```bash
cs=$(git log main..HEAD --reverse --format=%H --grep='^docs(issues): triage round ')
[ -n "$cs" ] || { echo 'apply not landed — skipped'; exit 0; }
n=0
for c in $cs; do
  n=$((n + 1))
  git diff-tree -r --no-commit-id --name-status -M20% "$c" | awk -F '\t' '
    { st = substr($1, 1, 1)
      for (i = 2; i <= NF; i++) if ($i !~ /^(docs\/issues\/|docs\/experience\/|docs\/design\/|docs\/notes\/|docs\/experience\.md$)/) { print "outside the living documents: " $i; bad = 1 }
      if (st == "R" && ($3 !~ /^docs\/issues\/resolved\// || $2 !~ /^docs\/issues\/(open|deferred)\//)) { print "a rename that is not open|deferred -> resolved: " $2 " -> " $3; bad = 1 }
      if (st == "C") { print "a copy: " $2 " -> " $3; bad = 1 } }
    END { exit bad }' || { echo "commit $c: a path or a status the apply may not write"; exit 1; }
  s=$(git log -1 --format=%s "$c")
  a=$(printf '%s' "$s" | sed -n 's/^docs(issues): triage round [0-9][ab]* — landed \([0-9][0-9]*\), merged \([0-9][0-9]*\), .*/\1/p')
  b=$(printf '%s' "$s" | sed -n 's/^docs(issues): triage round [0-9][ab]* — landed \([0-9][0-9]*\), merged \([0-9][0-9]*\), .*/\2/p')
  [ -n "$a" ] && [ -n "$b" ] || { echo "commit $c: the subject carries no landed and merged counts: $s"; exit 1; }
  r=$(git diff-tree -r --no-commit-id --name-status -M20% "$c" | awk -F '\t' '$1 ~ /^R/' | wc -l)
  d=$(git diff-tree -r --no-commit-id --name-status -M20% "$c" | awk -F '\t' '$1 == "D" && $2 ~ /^docs\/issues\/(open|deferred)\//' | wc -l)
  [ "$r" -eq "$((a + b))" ] && [ "$d" -eq 0 ] || { echo "commit $c: $r renames and $d deletions for landed $a + merged $b"; exit 1; }
done
printf 'apply commits checked: %s\n' "$n"
for c in $cs; do
  git diff-tree -r --no-commit-id --name-status -M20% "$c" | awk -F '\t' '$1 ~ /^(R|D)/ { print $2 }' | while IFS= read -r old; do
    if git grep -nF -- "$old" -- docs/experience docs/design docs/notes docs/issues/open docs/issues/deferred docs/experience.md; then echo "an old path is still named: $old"; exit 1; fi
  done || exit 1
done
echo 'no old path of a moved issue is named in a living document'
```

Expected: `apply commits checked: K`, K the number of round files that made a commit (a round file whose items were all Kept makes none, Task 14 Step 6), and the last line.

7. The apply, the rest — directions, the issue frontmatter, the scripts' reach, the clean tree:

```bash
git log main..HEAD --format=%h --grep='^docs(issues): triage round ' | grep -q . || [ -e scripts/issues-by-finder.js ] || { echo 'apply not landed — skipped'; exit 0; }
d=.tanto/tanto-issue-triage
for r in $(tr -d '\r' < "$d/round-files.txt"); do
  f=$d/triage-R$r-direction.md
  [ -s "$f" ] || { echo "no direction file: $f"; exit 1; }
  tr -d '\r' < "$f" | grep -qiE '^(OK$|[0-9]+ — (landed|merged|assigned|re-hung|rehung|kept|unclear)\b)' || { echo "direction file with neither OK nor an item line: $f"; exit 1; }
done
echo 'a direction file exists for every round file'
base=$(git merge-base main HEAD)
issues=$(git diff --name-only --diff-filter=d "$base" -- docs/issues)
[ -z "$issues" ] || printf '%s\n' "$issues" | xargs uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py || exit 1
left=$(git log main..HEAD --format=%h -- skills .claude; git log main..HEAD --format=%h --invert-grep --grep='^docs(issues): triage round ' --grep='^docs(issues): triage repoint ' -- docs/experience)
[ -z "$left" ] || { printf 'commits that touch skills, .claude or docs/experience:\n%s\n' "$left"; exit 1; }
s=$(git status --porcelain); [ -z "$s" ] || { printf '%s\n' "$s"; exit 1; }
echo 'frontmatter clean, nothing under skills or .claude, tree clean'
```

Expected: the two summary lines, nothing else. A triage round commit may repoint a link under `docs/experience/` (the spec's Verification allows "link repoints under `docs/experience`, if any"); any other commit there, and any commit under `skills/` or `.claude/`, fails the block.

8. The counter and the report (batch E only):

```bash
[ -e scripts/issues-by-finder.js ] || { echo 'the counter has not landed — skipped'; exit 0; }
t=$(node scripts/issues-by-finder.js | tr -d '\r' | sed -n 's/^issues counted: \([0-9][0-9]*\)$/\1/p')
p=$(ls docs/issues/open docs/issues/deferred docs/issues/resolved | grep -c '\.md$' || true)
printf 'issues counted %s, issue files %s\n' "${t:-none}" "$p"; [ -n "$t" ] && [ "$t" = "$p" ] || exit 1
s=$(grep -c 'The same count is one command, `node scripts/issues-by-finder.js --exp <topic>`, whose by-finder table is taken at the same moment and written beside it\.' docs/notes/experience-layer-exit-criterion.md || true)
printf 'the note carries the sentence %s time(s)\n' "$s"; [ "$s" = 1 ] || exit 1
ls docs/reports/*-tanto-issue-triage-dogfood.md >/dev/null 2>&1 || { echo 'the dogfood report is not written yet'; exit 0; }
r=$(ls docs/reports/*-tanto-issue-triage-dogfood.md); head -1 "$r" | grep -q '^# ' || { echo 'the report opens with no # H1'; exit 1; }
git ls-files --eol "$r" | grep -q 'w/crlf' || { git ls-files --eol "$r"; echo 'the report is not w/crlf'; exit 1; }
```

Expected: `issues counted N, issue files N`, `the note carries the sentence 1 time(s)`, and — once Task 17 has run — the report's `git ls-files --eol` line. The count is the counter's last line `issues counted: <N>`, which Task 16 specifies; the sentence's backticked command is the reading Task 16 takes of the spec's two disagreeing placements and its unbackticked quote.

9. **No JSON is written by any task of this plan** except the instrument's own output, `.tanto/tanto-issue-triage/liveness.json` (and `--json`'s optional file from the counter), which step 4 loads with `require`, a JSON parse. No YAML is written except the frontmatter of the moved issue files, checked by the repository's frontmatter hook at commit and by step 7's `check_md_frontmatter.py` run.

## Tasks

### Task 1: The instrument's core — extraction, the tree, the trace, the verdict

**Files:**

- Create: `scripts/issue-liveness.js`
- Create: `scripts/issue-liveness.test.js`

**Interfaces:**

- Consumes: nothing from an earlier task.
- Produces, as `module.exports` of `scripts/issue-liveness.js`, for Task 2 to build on (the script runs `main` only under `if (require.main === module)`, so the test file can `require` it):
  - `parseArgs(argv: string[]) → {out: string, ref: string, docs: string}` — throws an `Error` whose message is one line on a missing `--out` or an unknown option.
  - `normalize(text: string) → string` — the normalized copy described below.
  - `parseIssue(text: string, file: {path: string, dir: "open" | "deferred"}) → Issue`, where `Issue` is `{id, dir, path, title, severity, created, source, sourceKind, citesExp, quotes: string[], paths: {token: string, hint: {from: number, to: number} | null}[]}`.
  - `extractQuotes(body: string) → string[]` and `extractPathTokens(body: string) → {token, hint}[]`.
  - `loadTree(ref: string, cwd: string) → Tree`, where `Tree` is `{ref, cwd, paths: string[], files: Map<string, {text: string, norm: string, lineCount: number}>}` and offers `lineCountOf(path) → number` (a loaded file's count, or one `git show <ref>:<path>` read on demand for a tracked path outside the loaded set).
  - `checkQuote(quote: string, tree: Tree) → {state: "alive", foundIn: string} | {state: "gone"}`.
  - `checkPath(token: string, hint, tree: Tree) → {state: "alive" | "partly", foundIn: string} | {state: "gone"}`.
  - `traceQuote(quote: string, ref: string, cwd: string) → {subject: string, path: string} | null`.
  - `loadDeletions(ref: string, cwd: string) → {path: string, subject: string}[]` (newest first) and `tracePath(token: string, deletions) → {subject: string, path: string} | null`.
  - `verdictOf(items) → {verdict: "none" | "alive" | "gone" | "partly", counts: {alive: number, gone: number, none: number}}`.
  - `analyze({ref, docs, cwd}) → {rows: Row[], meta}` and `main(argv: string[], io: {cwd, stdout, stderr}) → number` (the exit code).
  - `Row` is `{id, dir, path, title, severity, created, source, sourceKind, citesExp, verdict, counts, items}`; an item is `{kind: "quote" | "path", text, state: "alive" | "gone" | "partly", foundIn: string | null, removedBy: {subject, path} | null}`.

**The behavior** — spec section 1, from "Invocation" through "The verdict per issue". The script's source is the implementer's; these are its rules.

- **The command line.** `node scripts/issue-liveness.js --out <dir> [--ref main] [--docs docs/issues]`. `--ref` defaults to `main`, `--docs` to `docs/issues`. Exit `0` on a completed run, whatever the verdicts. Exit `1`, with exactly one line on `stderr`, when git is unusable (the working directory is not a git repository, `git rev-parse --verify <ref>^{tree}` fails, or a listed path fails to read), when the `--docs` directory does not exist, or when `--out` is missing or cannot be created — the spec names only git and the input directory; this plan reads a run that cannot write its outputs as not completed. A missing `<docs>/deferred/` (or `open/`) directory is an empty status directory, not an error: a status directory exists only while it holds an issue.
- **The pile.** Every `*.md` file directly under `<docs>/open/` and `<docs>/deferred/` in the working tree, read as UTF-8, CRLF normalized to LF before anything else. The frontmatter is the block between the first line `---` and the next `---` line; read `id`, `title`, `severity`, `created` from its `key: value` lines (strip one pair of surrounding double quotes, unescaping `\"` and `\\`, or of single quotes, unescaping `''`). The body is everything after the closing `---`. The `Source:` line is the body's first non-empty line when it opens `Source: `: `source` is the text after `Source: `, `sourceKind` its first word (`inbox`, `shoroku`, `hotfix`, `session`); with no such line both are `null`. `citesExp` is whether the body matches `exp-[0-9a-f]{4}`. The `id` is the frontmatter's `id`.
- **The quoted strings.** Over the whole LF body (so a quote may span a line break), every match of a straight pair `"…"` or a curly pair `“…”` whose inner text is 30 to 140 characters long, inclusive — the working note's rule, unchanged. Duplicates within one issue are kept once.
- **The path tokens.** Every single-backtick inline code span with no space in it: strip a trailing `:<line>` or `:<line>-<line>` suffix and keep it as the hint `{from, to}` (`to` equals `from` for a single line); then keep the token only when it contains a `/` or ends in one of `.md .js .json .sh .bat .ps1 .py .yaml .yml .toml`; skip a token beginning with `.tanto/`, `.superpowers/`, `~`, `$`, or `<`. Duplicates within one issue are kept once.
- **The tree load.** `git ls-tree -r -z --name-only <ref>` lists the paths (never `git ls-files`, which unions the index with the tree). Load every listed path outside the four excluded trees `docs/issues/`, `docs/reports/`, `docs/superpowers/`, `.tanto/` whose extension is one of `.md .txt .js .cjs .mjs .ts .json .jsonc .yaml .yml .toml .sh .bat .ps1 .psd1 .psm1 .py .css .html .gitignore .gitattributes .editorconfig` or that has no extension (a dotfile such as `.gitignore` counts under either reading), each with `git show <ref>:<path>`, once. A listed path that fails to read is fatal (exit `1`), so that the loaded tree is exactly the ref's. Keep each file's text and its **normalized** copy: CRLF to LF; every Markdown link `[text](target)` reduced to its text; every backtick removed; every run of whitespace, line breaks included, to one space; trimmed. Keep its line count.
- **The alive test for a quote.** A quote is normalized the same way; it is `alive` when the normalized needle is a substring of some loaded file's normalized copy, and `foundIn` is the first such path in `ls-tree` order; otherwise `gone`.
- **The alive test for a path token.** Strip one trailing `/`. A tracked path `P` (any path `ls-tree` listed, the excluded trees included) resolves the token `T` when `P === T`, `P` ends with `/T`, `P` starts with `T/`, or `P` contains `/T/` — the last two are the directory forms — since most of the pile's tokens are skill-relative (`roles/kanri.md`, `templates/agent.md`, `SKILL.md`). The first resolving path in `ls-tree` order is `foundIn` and the token is `alive`; when it has a line hint whose `to` exceeds `lineCountOf(foundIn)`, the token is `partly`. No resolving path: `gone`.
- **The trace of a gone quote.** Once per gone quote: `git log <ref> -n 1 --format=%s --name-only --pickaxe-regex -S<pattern> -- . ':(exclude)docs/issues' ':(exclude)docs/reports' ':(exclude)docs/superpowers' ':(exclude).tanto'`, run through `execFileSync` with an argument array (no shell), where `<pattern>` is the quote's whitespace-separated words, each escaped for a POSIX extended regex (`\ ^ $ . | ? * + ( ) [ ] { }`), joined by `\s+`, so that a quote that wraps in the source still matches. The first output line is the subject; the first non-empty line after it is the path. Empty output: `removedBy` is `null`, which every output renders as `no commit found`. If the `\s+` join does not cross a line break on this host's git (the plan review measured that it does on git 2.55 for Windows), the wrapped-quote test fails: use the POSIX class `[[:space:]]+` in its place — the same class — record the change in the batch report, and do not substitute any other trace.
- **The trace of a gone path token.** Read the deletions once per run: `git log <ref> --diff-filter=D --name-only --format=%x00%s` (newest first), giving each deleted path with its deleting subject. A gone token's `removedBy` is the first deletion whose path resolves the token by the rule above, `{subject, path}`; none: `null`. The spec's formal form names `<ref>` and its "in practice" form `--all`; this plan reads `<ref>`, since a deletion only on another branch says nothing about `main`.
- **No commit hash** is written anywhere: the subject is what every tracked line downstream carries.
- **The verdict.** Over the issue's items: `none` when nothing was extracted; `alive` when every item is `alive`; `gone` when every item is `gone`; `partly` otherwise. `counts` is `{alive, gone, none}`: the items `alive`, the items `gone`, and the items neither — a path token in state `partly`. The spec writes `alive <a> / gone <g> / none <n>` without defining `none`; this is the plan's reading.
- **The output at this task.** `--out` is created when missing; `<out>/liveness.json` is a JSON array whose first element is `{"meta": {ref, date, total, verdicts: {alive, gone, partly, none}, wallSeconds}}` (`date` the local `YYYY-MM-DD`, `wallSeconds` one decimal) and whose remaining elements are the rows, ordered by `id`. `stdout` carries two lines, `verdicts: alive <a>, gone <g>, partly <p>, none <n>` and `wall: <s> s`. Task 2 adds the cluster, round, neighbor and inbound fields, the round tables, and the per-round line.

- [ ] **Step 1: Write the failing tests**

Create `scripts/issue-liveness.test.js` with `node:test` and `node:assert/strict`. One fixture repository, built once in a `before` hook under `fs.mkdtempSync(path.join(os.tmpdir(), "issue-liveness-"))`, `git init -b main`, every git call made as `git -C <dir> -c user.email=t@t -c user.name=t -c core.autocrlf=false …` (the identity set inside the test, as `skills/tanto/scripts/passage-check.test.js` does), and `git config core.autocrlf false` set in the fixture so the script's own `git show` reads the fixture's bytes unchanged. Three commits:

1. `add the fixture` — `skills/demo/SKILL.md` holding sentence A and sentence B, **each broken across a line in the file**; `skills/demo/roles/kanri.md` (three lines); `scripts/old-tool.js`; `docs/reports/2026-01-01-r.md` holding sentence C; and the issue files below under `docs/issues/`.
2. `remove the stale sentence` — sentence B deleted from `skills/demo/SKILL.md`.
3. `delete the old tool` — `git rm scripts/old-tool.js`.

Sentences A, B and C are each 40 to 80 characters. The issues, each with frontmatter `id`, `title`, `severity`, `created` and a `Source:` line:

- `docs/issues/open/aaaa-alive.md` — quotes A on one line, and names `` `roles/kanri.md` ``;
- `docs/issues/open/bbbb-gone.md` — quotes B on one line;
- `docs/issues/deferred/cccc-path.md` — no quote, names `` `scripts/old-tool.js` ``;
- `docs/issues/open/dddd-none.md` — no quote, no path token;
- `docs/issues/open/eeee-partly.md` — quotes A and C, and names `` `skills/demo/SKILL.md:999` ``;
- `docs/issues/open/ffff-crlf.md` — written with CRLF line endings throughout, quotes A, its title a plain word.

The tests, each its own `test(…)`:

1. Run `main` (or the CLI through `spawnSync(process.execPath, [script, "--out", out], {cwd: fixture})`) and read `liveness.json`: element 0 has `meta` with `ref` `main` and `verdicts` `{alive: 2, gone: 2, partly: 1, none: 1}` summing to the row count 6; `aaaa` is `alive` with counts `{alive: 2, gone: 0, none: 0}`; `bbbb` is `gone` `{0, 1, 0}`; `cccc` is `gone` `{0, 1, 0}` and its `dir` is `deferred`; `dddd` is `none` `{0, 0, 0}`; `eeee` is `partly` `{alive: 1, gone: 1, none: 1}`; `ffff` is `alive`.
2. The removing commit's subject: `bbbb`'s gone item has `removedBy.subject` `remove the stale sentence` and `removedBy.path` `skills/demo/SKILL.md` — which also proves the pickaxe crosses the line break inside B in the source.
3. The deleting subject: `cccc`'s gone item has `removedBy` `{subject: "delete the old tool", path: "scripts/old-tool.js"}`.
4. A quote wrapped across a line in the source is found alive: `aaaa`'s quote item is `alive` with `foundIn` `skills/demo/SKILL.md`.
5. A needle present only under `docs/issues/` or `docs/reports/` reads gone: `eeee`'s quote of C is `gone`, and its `removedBy` is `null` (rendered `no commit found`).
6. A skill-relative path token resolved alive by suffix: `aaaa`'s `roles/kanri.md` item is `alive` with `foundIn` `skills/demo/roles/kanri.md`.
7. A line hint past the end: `eeee`'s `skills/demo/SKILL.md:999` item is `partly`.
8. CRLF input: `ffff`'s `title` carries no `\r`, its `sourceKind` is read, and its quote is `alive`; and `normalize("a\r\n  b `c` [d](e)")` is `"a b c d"`.
9. Extraction units: `extractQuotes` keeps a straight and a curly 30-character quote, drops a 29- and a 141-character one, and keeps a quote that spans a line break; `extractPathTokens` keeps `skills/x/y.md:12-14` as token `skills/x/y.md` with hint `{from: 12, to: 14}`, keeps `SKILL.md`, and skips `.tanto/x/y.md`, `~/x.md`, `$TANTO/x.js`, `<dir>/x.md`, and `two words.md`.
10. The exit codes: `0` for the fixture run; `1` with exactly one `stderr` line for `--docs <fixture>/no-such-dir`, for `--ref no-such-ref`, for a run whose cwd is a fresh temporary directory that is not a git repository, and for a run with no `--out`.

- [ ] **Step 2: Run the suite and see it fail**

```bash
# tree-state
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
if node --test --test-reporter=tap 'scripts/*.test.js' >/dev/null 2>&1; then echo 'the suite passed before the script exists'; exit 1; fi
echo 'the suite fails, as it must before Step 3'
```

Expected: the Node version (22 or later), then `the suite fails, as it must before Step 3` — the test file cannot `require` a script that does not exist yet.

- [ ] **Step 3: Write `scripts/issue-liveness.js`**

Implement the behavior above, CommonJS, `require("node:…")` built-ins only, no shebang (it is always invoked as `node <path>`), every git call through `execFileSync`/`spawnSync` with an argument array and `{cwd, encoding: "utf8", maxBuffer: 256 * 1024 * 1024}`. The tree is loaded once per run; git is spawned per gone quote and once for the deletions, never per alive needle.

- [ ] **Step 4: Run the suite and see it pass**

```bash
# tree-state
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
out=$(node --test --test-reporter=tap 'scripts/*.test.js' 2>&1); s=$?
p=$(printf '%s\n' "$out" | sed -n 's/^# pass \([0-9][0-9]*\).*/\1/p')
f=$(printf '%s\n' "$out" | sed -n 's/^# fail \([0-9][0-9]*\).*/\1/p')
printf 'pass %s fail %s\n' "$p" "$f"
[ "$s" = 0 ] && [ "${f:-1}" = 0 ] && [ "${p:-0}" -ge 10 ] || { printf '%s\n' "$out" | tail -40; exit 1; }
```

Expected: `pass N fail 0` with N at least 10.

- [ ] **Step 5: Lint the two files by name**

```bash
# tree-state
./scripts/lint.sh scripts/issue-liveness.js scripts/issue-liveness.test.js
```

Expected: every hook passes. A hook that auto-fixes leaves the change in the working tree and fails the run — run the command again, then re-run Step 4.

- [ ] **Step 6: Commit by explicit path**

The trailer names the agent that made the commit (`AGENTS.md`); `Claude <noreply@anthropic.com>` is the repository's own example — put your model's name in it when you know it. The message goes before `--`.

```bash
# tree-state
trailer='Co-Authored-By: Claude <noreply@anthropic.com>'
git add -- scripts/issue-liveness.js scripts/issue-liveness.test.js || exit 1
git commit --only -m "feat(scripts): issue-liveness — extraction, tree load, trace, and verdict" -m "$trailer" -- scripts/issue-liveness.js scripts/issue-liveness.test.js || exit 1
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
git log -1 --format=%s
```

Expected: the subject line, and nothing from `git status --porcelain`. A hook that fails leaves its fix unstaged: re-run Step 5, then this step. Never `--no-verify`.

### Task 2: The instrument's classification and outputs — cluster, round, neighbors, inbound, tables

**Files:**

- Modify: `scripts/issue-liveness.js` (Task 1's commit)
- Modify: `scripts/issue-liveness.test.js` (Task 1's commit)

**Interfaces:**

- Consumes: Task 1's exports — `analyze`, `main`, `parseIssue`, `Row`, the `liveness.json` shape.
- Produces, added to `module.exports`, and read by Task 3 and the round tasks:
  - `CLUSTERS` — the ordered cluster table, a constant at the top of the script: `{order: number, name: string, round: number, terms: string[]}[]`, the `other` row last with no terms.
  - `termMatches(term: string, title: string) → boolean` and `clusterOf(title: string) → string` (a `CLUSTERS` name).
  - `assignRounds(rows: Row[]) → Row[]` — sets `row.round` to the round file's name part (`"1"`, `"1a"`, `"1b"`, …) and returns the rows in table order.
  - `neighborsOf(rows: Row[]) → Map<id, {id, overlap}[]>` and `inboundOf(rows: Row[], cwd: string) → Map<id, string[]>`.
  - `escapeCell(text: string) → string` and `renderTable(part: string, rows: Row[], meta) → string`.
  - Each row gains `cluster`, `round`, `neighbors: {id, overlap}[]`, `inbound: string[]`; `meta` gains `clusters` and `rounds`.
  - The table row of `liveness-R<part>.md` opens `| <id> | ` with the issue's bare 4-hex id, so `grep -cE '^\| [0-9a-f]{4} \|' <file>` counts the round's issues.

**The behavior** — spec section 1, from "The cluster" through "Tests".

- **The cluster table** is a constant at the top of the script, above it a comment that writes the matching rule out, so that a reader of the spec's table and a reader of the script see the same rule. Its rows are the spec's table exactly:

```text
1  passage-check / plan instrument          R1  passage-check, passage, replay, needle, fence, O block, dry run, dryrun, pickaxe, lint
2  kanri / ledger / handover / boundary     R2  ledger, handover, boundary, census, ruling, R-n, events line, successor, kanri
3  roster / handshake / address             R2  roster, handshake, address, no-role, rename, sessionId
4  reading / ceiling / cost / ttl           R3  reading, ceiling, context=, cache, token, wake-up, compaction, quota, 429, cost, ttl, share
5  config / agents / effort / model         R3  tanto.json, config, agent definition, agents/, effort, model, family
6  keikaku / plan / coldread / batch shape  R4  keikaku, coldread, cold read, batch, plan
7  jisso / sdd / report                     R4  jisso, sdd, implementer, batch report, report, task
8  sekkei / spec / dialogue                 R4  sekkei, spec, dialogue
9  brief / review                           R4  brief, review
10 shoroku / close / kessai / shoki         R5  shoroku, close, kessai, shoki, shusei, direction, recommend, proposal
11 spawner / bg seats / resume              R5  spawner, spawn, bg seat, background, resume, launcher, seats.json, --bg, attach, terminal seat, tab seat
12 hosa / kikaku / kaiseki                  R5  hosa, kikaku, kaiseki
13 kisou / docs system / templates          R6  kisou, doc-system, docs/, template, frontmatter, AGENTS.md, experience, scene, requirement
14 wayaku / i18n / language                 R6  wayaku, language, japanese, translation, i18n
15 tests / scripts                          R6  test, script, node, pre-commit
16 other                                    R6  everything else
```

The cluster `name` is the second column's text exactly (`passage-check / plan instrument`, …, `other`) — the working note's headings use the same strings, which Task 3 compares.
- **The matching rule.** The cluster is assigned by the `title:` alone, first matching row wins, every comparison case-insensitive. A term of five characters or fewer made only of letters and digits (`plan`, `task`, `lint`, `fence`, `scene`, `kanri`, `jisso`, `hosa`, `sdd`, `i18n`, `cache`, `token`, `quota`, `shoki`, `kisou`, …) matches as a whole word, `\b` on both sides; any longer term matches as a substring; `R-n`, `429`, `--bg`, `context=`, `O block`, and any term containing `/`, `.`, or `-` match literally as substrings (`429` included, though it is short). The spec's list of fourteen short terms is an enumeration of the common ones; the rule is the five-character bound. A literal term is compared by `includes` on the lowercased strings, never by a regex built from it.
- **The round map.** Rows 1 → round 1; 2, 3 → 2; 4, 5 → 3; 6 to 9 → 4; 10 to 12 → 5; 13 to 16 → 6. **Table order** within a round is the cluster's `order`, then `id` ascending. A round of more than fifty issues is split in table order: its first `ceil(n / 2)` rows are round file `<n>a`, the rest `<n>b`; a round of fifty or fewer is round file `<n>`. `meta.rounds` is an **array** of `{part, count}` in that order (`1a`, `1b`, `2a`, …) — never an object keyed by the name part, since a JavaScript object enumerates integer-like keys (`1`, `3`, `5`) before string keys (`1a`) and would reorder the list, and the rows of `liveness.json` follow the same order.
- **The neighbors.** A title's tokens are the title lowercased and split on `\W+`, every token of three characters or fewer dropped, kept as a set. For each issue, the three other issues of the pile with the largest token overlap greater than zero, ties by `id` ascending, as `{id, overlap}`. A hint for the recommender, never a verdict.
- **The inbound mentions.** For each issue, every living document whose text contains the issue's current repository-relative path (`docs/issues/open/<file>` or `docs/issues/deferred/<file>`) as a plain substring — a link or plain text alike. Living documents are the `*.md` files in the working tree under `docs/experience/`, `docs/design/`, `docs/notes/`, `docs/issues/open/`, `docs/issues/deferred/`, plus `docs/experience.md` and the `*.md` files at the repository root; the issue's own file is not its own inbound mention; `docs/reports/`, `docs/decisions/`, and `docs/issues/resolved/` are never read for this. Paths are written with forward slashes.
- **The outputs**, under `--out`:
  - `liveness.json` — the array of Task 1 with element 0 `{"meta": {ref, date, total, verdicts, clusters, rounds, wallSeconds}}` (`clusters` keyed by cluster name in table order, `rounds` an array `[{part, count}]` in round order), then one object per issue with the keys in the spec's order: `id, dir, path, title, severity, created, source, sourceKind, citesExp, cluster, round, verdict, counts, items, neighbors, inbound`.
  - `liveness-R<part>.md`, one per round file: line 1 `Liveness — round <part> — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>` (the round's own counts), a blank line, line 3 `Columns: a/g/n counts items alive, gone and partly (a path whose line hint is past the file's end); n is not the verdict none of line 1.`, a blank line, then the table with the header `| id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound |`, the separator row, and one row per issue in table order: the bare id; `open` or `deferred`; the severity; the verdict; `<a>/<g>/<n>`; the cluster name; the title cut at 100 characters; each gone item as `<needle> → <subject>` (or `→ no commit found`), the needle with its whitespace collapsed, items joined by `<br>`; the neighbors as `<id> (<overlap>)` joined by `, `; the inbound paths joined by `, `. Every `|` inside a cell is written `\|`; an empty cell is written `—`.
  - `stdout`: `verdicts: alive <a>, gone <g>, partly <p>, none <n>`, then `rounds: <part> <count>, …` in order, then `wall: <s> s`.

- [ ] **Step 1: Write the failing tests**

Add to `scripts/issue-liveness.test.js` (keep Task 1's tests, updating only an assertion whose output this task extends):

1. The cluster, one title per branch of the first-match rule: a short term matched as a whole word (`"the plan header is unread"` → `keikaku / plan / coldread / batch shape`); a longer term matched as a substring (`"handovers lose the inbox"` → `kanri / ledger / handover / boundary`); a title matching two rows goes to the earlier row (`"the ledger forgets the spec"` → `kanri / ledger / handover / boundary`, not `sekkei / spec / dialogue`); a literal term (`"the --bg flag fails"` → `spawner / bg seats / resume`, by `--bg` alone); and `other` (`"nothing matches here at all"` → `other`).
2. One short term that must not match inside a longer word: `"a testament to nothing"` is `other` — `test` does not match inside `testament`.
3. The round map and the split: fifty-one synthetic rows in cluster 1 give round files `1a` (26 rows) and `1b` (25 rows) in table order (`id` ascending inside the cluster); fifty rows in cluster 4 stay round file `3`; a row of cluster 12 is in round file `5`; `meta.rounds` lists the parts in round order, as an array.
4. A neighbor pair: of three titles, the two that share two tokens of four or more characters name each other first, with `overlap` 2, and a shared token of three characters does not count.
5. An inbound mention, link or plain: in the fixture repository, add `docs/notes/n.md` holding `[x](docs/issues/open/aaaa-alive.md)` and `docs/design/d.md` holding the plain path `docs/issues/open/aaaa-alive.md`, and `docs/reports/2026-01-02-r.md` holding the same path; `aaaa`'s `inbound` is exactly `["docs/design/d.md", "docs/notes/n.md"]` in any order — the report is not a living document.
6. A `|` in a title is escaped: `renderTable` over a row titled ``"`a | b` breaks the table"`` writes `` `a \| b` breaks the table `` in the title cell, and every table line has the same count of unescaped `|` as the header.
7. The table's row format: every row of a written `liveness-R<part>.md` matches `^\| [0-9a-f]{4} \| (open|deferred) \| `, `grep -cE '^\| [0-9a-f]{4} \|'` over the file equals the round file's `count` in `meta.rounds`, and line 1 opens `Liveness — round ` and line 3 opens `Columns: a/g/n`.
8. The fixture run end to end: `liveness.json` element 0 has `meta.clusters` and `meta.rounds`, the sum of the `count`s in `meta.rounds` equals the row count, every row has `cluster`, `round`, `neighbors`, `inbound`, and `stdout` has the three lines in order.

- [ ] **Step 2: Run the suite and see the new tests fail**

```bash
# tree-state
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
if node --test --test-reporter=tap 'scripts/*.test.js' >/dev/null 2>&1; then echo 'the suite passed before Step 3'; exit 1; fi
echo 'the new tests fail, as they must before Step 3'
```

Expected: the Node version, then `the new tests fail, as they must before Step 3`.

- [ ] **Step 3: Extend `scripts/issue-liveness.js`**

Implement the behavior above on top of Task 1's commit: the `CLUSTERS` constant and its comment at the top of the file, `termMatches`, `clusterOf`, `assignRounds`, `neighborsOf`, `inboundOf`, `escapeCell`, `renderTable`, the extended `meta`, the round tables, and the per-round `stdout` line.

- [ ] **Step 4: Run the suite and see it pass**

```bash
# tree-state
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
out=$(node --test --test-reporter=tap 'scripts/*.test.js' 2>&1); s=$?
p=$(printf '%s\n' "$out" | sed -n 's/^# pass \([0-9][0-9]*\).*/\1/p')
f=$(printf '%s\n' "$out" | sed -n 's/^# fail \([0-9][0-9]*\).*/\1/p')
printf 'pass %s fail %s\n' "$p" "$f"
[ "$s" = 0 ] && [ "${f:-1}" = 0 ] && [ "${p:-0}" -ge 18 ] || { printf '%s\n' "$out" | tail -40; exit 1; }
```

Expected: `pass N fail 0` with N at least 18.

- [ ] **Step 5: Lint the two files by name**

```bash
# tree-state
./scripts/lint.sh scripts/issue-liveness.js scripts/issue-liveness.test.js
```

Expected: every hook passes; after an auto-fix, run it again and re-run Step 4.

- [ ] **Step 6: Commit by explicit path**

```bash
# tree-state
trailer='Co-Authored-By: Claude <noreply@anthropic.com>'
git commit --only -m "feat(scripts): issue-liveness — clusters, round files, neighbors, inbound, and tables" -m "$trailer" -- scripts/issue-liveness.js scripts/issue-liveness.test.js || exit 1
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
git log -1 --format=%s
```

Expected: the subject line, and nothing from `git status --porcelain`.

### Task 3: The run — the liveness tables of the pile

**Files:**

- No tracked file. Creates, untracked under `.tanto/tanto-issue-triage/`: `liveness.json`, `liveness-R<part>.md` (one per round file), `round-files.txt`, `instrument-figures.txt`.

**Interfaces:**

- Consumes: Task 2's committed `scripts/issue-liveness.js`; the working note `.tanto/kikaku/2026-10-01-issue-clusters.md` (read, never edited).
- Produces: the round files the ten round tasks read — `liveness-R<part>.md`, its row format `| <id> | …` — the list `round-files.txt` (one round file name part per line, in table order), and `instrument-figures.txt`, which Task 17 cites.

The instrument reads `main`, not the branch: pass nothing but `--out`, since the branch has not touched the trees the needles point into.

- [ ] **Step 1: Confirm the starting state**

```bash
# tree-state
[ "$(git branch --show-current)" = tanto-issue-triage ] || { echo 'not on tanto-issue-triage'; exit 1; }
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
git log -2 --format=%s -- scripts/issue-liveness.js
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
node --test --test-reporter=tap 'scripts/*.test.js' >/dev/null 2>&1 || { echo 'the suite fails'; exit 1; }
echo 'clean, on the branch, the suite passes'
```

Expected: Task 2's and Task 1's subjects, the Node version, and the last line.

- [ ] **Step 2: Run the instrument**

The run loads the whole tree and traces every gone quote; give the tool call a ten-minute timeout.

```bash
# tree-state
rm -f .tanto/tanto-issue-triage/liveness.json .tanto/tanto-issue-triage/liveness-R*.md .tanto/tanto-issue-triage/round-files.txt
node scripts/issue-liveness.js --out .tanto/tanto-issue-triage || exit 1
ls .tanto/tanto-issue-triage/liveness.json .tanto/tanto-issue-triage/liveness-R*.md
```

Expected: the three summary lines (`verdicts: …`, `rounds: …`, `wall: … s`), then the listed files.

- [ ] **Step 3: Write `round-files.txt` from the instrument's own order**

```bash
# tree-state
d=.tanto/tanto-issue-triage
node -e 'const j=require("./.tanto/tanto-issue-triage/liveness.json");console.log(j[0].meta.rounds.map((r) => r.part).join("\n"))' > "$d/round-files.txt" || exit 1
cat "$d/round-files.txt"
```

Expected: one round file name part per line.

- [ ] **Step 4: The stop condition — the round files must be this plan's round tasks**

This plan's round tasks are Tasks 4 to 13, for the round files `1a 1b 2a 2b 3 4a 4b 5 6a 6b`, except that round 1 may come out whole as `1` (Task 4 then takes `1` and Task 5 is void). Any other list — a round 3 or 5 split, a round 2, 4 or 6 left whole — is a plan defect: **stop and report it under Deviations from the plan**, with the list; do not continue to Step 5.

```bash
# tree-state
got=$(tr -d '\r' < .tanto/tanto-issue-triage/round-files.txt | tr '\n' ' ' | sed 's/ *$//')
printf 'round files: %s\n' "$got"
case "$got" in
  '1a 1b 2a 2b 3 4a 4b 5 6a 6b') echo 'the round files match the plan' ;;
  '1 2a 2b 3 4a 4b 5 6a 6b') echo 'the round files match the plan; round 1 is whole, so Task 5 is void' ;;
  *) echo 'the round files do not match the plan — stop and report under Deviations from the plan'; exit 1 ;;
esac
```

Expected: one of the two matching lines.

- [ ] **Step 5: Measure the figures the batch report carries**

The agreement with the working note parses its lines `o|D m|l <id> <title>` under each `## <cluster> (<n>)` heading and counts, of the note-placed issues still in the pile, those the instrument places in the note's own cluster; the denominator is printed, not assumed. The probe's ids are the lines of 4-hex ids under `## The staleness probe`.

```bash
# tree-state
set -o pipefail
node -e '
const fs = require("node:fs");
const j = JSON.parse(fs.readFileSync(".tanto/tanto-issue-triage/liveness.json", "utf8"));
const meta = j[0].meta;
const rows = j.slice(1);
const byId = new Map(rows.map((r) => [r.id, r]));
console.log("pile " + rows.length + "; ref " + meta.ref + "; date " + meta.date + "; wall " + meta.wallSeconds + " s");
console.log("verdicts " + JSON.stringify(meta.verdicts));
console.log("clusters " + JSON.stringify(meta.clusters));
console.log("rounds " + JSON.stringify(meta.rounds));
const note = fs.readFileSync(".tanto/kikaku/2026-10-01-issue-clusters.md", "utf8").split(/\r?\n/);
let cluster = null;
let inProbe = false;
let listed = 0;
let placed = 0;
let same = 0;
const probe = [];
for (const line of note) {
  const h = line.match(/^## (.+) \(\d+\)$/);
  if (h) { cluster = h[1]; inProbe = false; continue; }
  if (/^## /.test(line)) { cluster = null; inProbe = line === "## The staleness probe"; continue; }
  if (inProbe && /^[0-9a-f]{4}( [0-9a-f]{4})*$/.test(line)) probe.push(...line.split(" "));
  const m = line.match(/^[oD] [ml] ([0-9a-f]{4}) /);
  if (!m || !cluster) continue;
  listed++;
  const r = byId.get(m[1]);
  if (!r) continue;
  placed++;
  if (r.cluster === cluster) same++;
}
const probeIn = probe.filter((id) => byId.has(id));
const probeGone = probeIn.filter((id) => ["gone", "partly"].includes(byId.get(id).verdict));
console.log("working note: " + listed + " placed lines; " + placed + " of them still in the pile (the denominator); " + same + " placed by the instrument in the same cluster as by the note");
console.log("probe: " + probe.length + " ids listed; " + probeIn.length + " still in the pile; " + probeGone.length + " read gone or partly");
let items = 0;
let issues = 0;
for (const r of rows) {
  const n = r.items.filter((i) => i.state === "gone" && i.removedBy === null).length;
  items += n;
  if (n > 0) issues++;
}
console.log("no commit found: " + items + " gone items in " + issues + " issues");
' | tee .tanto/tanto-issue-triage/instrument-figures.txt
```

Expected: seven lines — the pile and wall time, the verdict, cluster and round counts, the working-note agreement with its denominator, the probe line, and the `no commit found` line — also written to `instrument-figures.txt`.

- [ ] **Step 6: Verify — the spec's "After A"**

```bash
# tree-state
d=.tanto/tanto-issue-triage
n=$(ls "$d"/liveness-R*.md | wc -l); f=$(grep -c . "$d/round-files.txt"); printf 'liveness tables %s, round files %s\n' "$n" "$f"; [ "$n" = "$f" ] || exit 1
rows=$(node -e 'const j=require("./.tanto/tanto-issue-triage/liveness.json");console.log(j.length-1)') || exit 1
pile=$(ls docs/issues/open docs/issues/deferred | grep -c '\.md$')
sum=$(node -e 'const v=require("./.tanto/tanto-issue-triage/liveness.json")[0].meta.verdicts;console.log(Object.values(v).reduce((a,b)=>a+b,0))') || exit 1
printf 'rows %s, pile %s, verdict sum %s\n' "$rows" "$pile" "$sum"; [ "$rows" = "$pile" ] && [ "$sum" = "$pile" ] || exit 1
t=0; for p in $(tr -d '\r' < "$d/round-files.txt"); do c=$(grep -cE '^\| [0-9a-f]{4} \|' "$d/liveness-R$p.md" || true); printf 'R%s: %s rows\n' "$p" "$c"; t=$((t + c)); done
printf 'table rows %s\n' "$t"; [ "$t" = "$pile" ] || exit 1
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'after A: verified'
```

Expected: equal counts on each line, one `R<part>: <n> rows` line per round file, and `after A: verified`.

- [ ] **Step 7: The batch report's content**

No commit: every file this task writes is untracked under `.tanto/` (ignored by `.tanto/.gitignore`). The batch report carries, from Steps 2 to 6: the `meta` counts — the pile's size, the verdict counts, the counts per cluster and per round file, the wall time; the round-files list and which of Step 4's two lines it matched; the working note's agreement as Step 5 printed it, denominator included; the count of the probe's ids still in the pile that read `gone` or `partly`; and the `no commit found` counts.

### Task 4: Round 1, its first round file — recommend and brief

**`<P>` and `P`.** In this task `<P>` is the first line of `.tanto/tanto-issue-triage/round-files.txt`: `1a` when the instrument split round 1, `1` when it did not (Task 5 is then void). Every file name, heading and line below that carries `<P>` means that value, and every shell block reads it into `P` as its first line after the `# tree-state` comment; nothing in this task is edited by hand for an unsplit round 1.

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R<P>.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R<P>-recommendation.md`, `triage-R<P>-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R<P>.md` — line 1 the header `Liveness — round <P> — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R<P>-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R<P>-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round <P>`, then the lines `Round: <P>`, `Liveness: .tanto/tanto-issue-triage/liveness-R<P>.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R<P>-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round <P>`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R<P>-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R<P>: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R<P>: 12 は Kept`、`R<P>: 30 は Merged → issue-abcd`、`R<P>: 41 は Assigned → passage-check-hardening`、`R<P>: 7 は Re-hung → exp-178d`、`R<P>: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R<P>-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R<P>: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
P=$(head -1 .tanto/tanto-issue-triage/round-files.txt | tr -d '\r')
l=.tanto/tanto-issue-triage/liveness-R$P.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
P=$(head -1 .tanto/tanto-issue-triage/round-files.txt | tr -d '\r')
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R<P>-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R<P>-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
P=$(head -1 .tanto/tanto-issue-triage/round-files.txt | tr -d '\r')
d=.tanto/tanto-issue-triage; r=$d/triage-R$P-recommendation.md; b=$d/triage-R$P-brief.md; l=$d/liveness-R$P.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
P=$(head -1 .tanto/tanto-issue-triage/round-files.txt | tr -d '\r')
d=.tanto/tanto-issue-triage; r=$d/triage-R$P-recommendation.md; b=$d/triage-R$P-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
P=$(head -1 .tanto/tanto-issue-triage/round-files.txt | tr -d '\r')
d=.tanto/tanto-issue-triage; r=$d/triage-R$P-recommendation.md; b=$d/triage-R$P-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
P=$(head -1 .tanto/tanto-issue-triage/round-files.txt | tr -d '\r')
d=.tanto/tanto-issue-triage
awk -v P="$P" -v b="$d/triage-R$P-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R%s: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", P, b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R$P-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
P=$(head -1 .tanto/tanto-issue-triage/round-files.txt | tr -d '\r')
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 5: Round 1b — recommend and brief

**Void unless round 1 was split.** Run `tr -d '\r' < .tanto/tanto-issue-triage/round-files.txt | grep -qx 1b` first. When it finds no `1b`, this task is **void**: write nothing, make no commit, and report `void — round 1 not split` under Deviations from the plan; the batch then holds three tasks. For SDD, a void task gets its row in the progress ledger marked `void`, no implementer is dispatched for it and neither reviewer (`task.review-spec`, `task.review-quality`) is dispatched on it; its Verify is the `grep` above, which finds no `1b`, and that counts as "Verify clean" for the batch. When it finds `1b`, run the rest of this task as written.

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R1b.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R1b-recommendation.md`, `triage-R1b-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R1b.md` — line 1 the header `Liveness — round 1b — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R1b-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R1b-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round 1b`, then the lines `Round: 1b`, `Liveness: .tanto/tanto-issue-triage/liveness-R1b.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R1b-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round 1b`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R1b-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R1b: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R1b: 12 は Kept`、`R1b: 30 は Merged → issue-abcd`、`R1b: 41 は Assigned → passage-check-hardening`、`R1b: 7 は Re-hung → exp-178d`、`R1b: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R1b-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R1b: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
l=.tanto/tanto-issue-triage/liveness-R1b.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R1b-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R1b-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R1b-recommendation.md; b=$d/triage-R1b-brief.md; l=$d/liveness-R1b.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R1b-recommendation.md; b=$d/triage-R1b-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R1b-recommendation.md; b=$d/triage-R1b-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
d=.tanto/tanto-issue-triage
awk -v b="$d/triage-R1b-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R1b: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R1b-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 6: Round 2a — recommend and brief

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R2a.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R2a-recommendation.md`, `triage-R2a-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R2a.md` — line 1 the header `Liveness — round 2a — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R2a-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R2a-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round 2a`, then the lines `Round: 2a`, `Liveness: .tanto/tanto-issue-triage/liveness-R2a.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R2a-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round 2a`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R2a-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R2a: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R2a: 12 は Kept`、`R2a: 30 は Merged → issue-abcd`、`R2a: 41 は Assigned → passage-check-hardening`、`R2a: 7 は Re-hung → exp-178d`、`R2a: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R2a-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R2a: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
l=.tanto/tanto-issue-triage/liveness-R2a.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R2a-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R2a-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R2a-recommendation.md; b=$d/triage-R2a-brief.md; l=$d/liveness-R2a.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R2a-recommendation.md; b=$d/triage-R2a-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R2a-recommendation.md; b=$d/triage-R2a-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
d=.tanto/tanto-issue-triage
awk -v b="$d/triage-R2a-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R2a: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R2a-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 7: Round 2b — recommend and brief

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R2b.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R2b-recommendation.md`, `triage-R2b-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R2b.md` — line 1 the header `Liveness — round 2b — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R2b-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R2b-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round 2b`, then the lines `Round: 2b`, `Liveness: .tanto/tanto-issue-triage/liveness-R2b.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R2b-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round 2b`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R2b-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R2b: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R2b: 12 は Kept`、`R2b: 30 は Merged → issue-abcd`、`R2b: 41 は Assigned → passage-check-hardening`、`R2b: 7 は Re-hung → exp-178d`、`R2b: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R2b-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R2b: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
l=.tanto/tanto-issue-triage/liveness-R2b.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R2b-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R2b-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R2b-recommendation.md; b=$d/triage-R2b-brief.md; l=$d/liveness-R2b.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R2b-recommendation.md; b=$d/triage-R2b-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R2b-recommendation.md; b=$d/triage-R2b-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
d=.tanto/tanto-issue-triage
awk -v b="$d/triage-R2b-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R2b: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R2b-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 8: Round 3 — recommend and brief

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R3.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R3-recommendation.md`, `triage-R3-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R3.md` — line 1 the header `Liveness — round 3 — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R3-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R3-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round 3`, then the lines `Round: 3`, `Liveness: .tanto/tanto-issue-triage/liveness-R3.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R3-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round 3`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R3-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R3: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R3: 12 は Kept`、`R3: 30 は Merged → issue-abcd`、`R3: 41 は Assigned → passage-check-hardening`、`R3: 7 は Re-hung → exp-178d`、`R3: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R3-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R3: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
l=.tanto/tanto-issue-triage/liveness-R3.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R3-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R3-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R3-recommendation.md; b=$d/triage-R3-brief.md; l=$d/liveness-R3.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R3-recommendation.md; b=$d/triage-R3-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R3-recommendation.md; b=$d/triage-R3-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
d=.tanto/tanto-issue-triage
awk -v b="$d/triage-R3-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R3: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R3-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 9: Round 4a — recommend and brief

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R4a.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R4a-recommendation.md`, `triage-R4a-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R4a.md` — line 1 the header `Liveness — round 4a — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R4a-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R4a-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round 4a`, then the lines `Round: 4a`, `Liveness: .tanto/tanto-issue-triage/liveness-R4a.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R4a-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round 4a`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R4a-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R4a: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R4a: 12 は Kept`、`R4a: 30 は Merged → issue-abcd`、`R4a: 41 は Assigned → passage-check-hardening`、`R4a: 7 は Re-hung → exp-178d`、`R4a: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R4a-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R4a: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
l=.tanto/tanto-issue-triage/liveness-R4a.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R4a-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R4a-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R4a-recommendation.md; b=$d/triage-R4a-brief.md; l=$d/liveness-R4a.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R4a-recommendation.md; b=$d/triage-R4a-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R4a-recommendation.md; b=$d/triage-R4a-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
d=.tanto/tanto-issue-triage
awk -v b="$d/triage-R4a-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R4a: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R4a-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 10: Round 4b — recommend and brief

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R4b.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R4b-recommendation.md`, `triage-R4b-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R4b.md` — line 1 the header `Liveness — round 4b — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R4b-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R4b-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round 4b`, then the lines `Round: 4b`, `Liveness: .tanto/tanto-issue-triage/liveness-R4b.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R4b-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round 4b`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R4b-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R4b: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R4b: 12 は Kept`、`R4b: 30 は Merged → issue-abcd`、`R4b: 41 は Assigned → passage-check-hardening`、`R4b: 7 は Re-hung → exp-178d`、`R4b: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R4b-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R4b: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
l=.tanto/tanto-issue-triage/liveness-R4b.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R4b-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R4b-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R4b-recommendation.md; b=$d/triage-R4b-brief.md; l=$d/liveness-R4b.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R4b-recommendation.md; b=$d/triage-R4b-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R4b-recommendation.md; b=$d/triage-R4b-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
d=.tanto/tanto-issue-triage
awk -v b="$d/triage-R4b-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R4b: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R4b-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 11: Round 5 — recommend and brief

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R5.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R5-recommendation.md`, `triage-R5-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R5.md` — line 1 the header `Liveness — round 5 — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R5-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R5-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round 5`, then the lines `Round: 5`, `Liveness: .tanto/tanto-issue-triage/liveness-R5.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R5-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round 5`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R5-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R5: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R5: 12 は Kept`、`R5: 30 は Merged → issue-abcd`、`R5: 41 は Assigned → passage-check-hardening`、`R5: 7 は Re-hung → exp-178d`、`R5: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R5-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R5: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
l=.tanto/tanto-issue-triage/liveness-R5.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R5-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R5-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R5-recommendation.md; b=$d/triage-R5-brief.md; l=$d/liveness-R5.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R5-recommendation.md; b=$d/triage-R5-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R5-recommendation.md; b=$d/triage-R5-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
d=.tanto/tanto-issue-triage
awk -v b="$d/triage-R5-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R5: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R5-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 12: Round 6a — recommend and brief

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R6a.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R6a-recommendation.md`, `triage-R6a-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R6a.md` — line 1 the header `Liveness — round 6a — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R6a-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R6a-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round 6a`, then the lines `Round: 6a`, `Liveness: .tanto/tanto-issue-triage/liveness-R6a.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R6a-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round 6a`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R6a-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R6a: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R6a: 12 は Kept`、`R6a: 30 は Merged → issue-abcd`、`R6a: 41 は Assigned → passage-check-hardening`、`R6a: 7 は Re-hung → exp-178d`、`R6a: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R6a-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R6a: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
l=.tanto/tanto-issue-triage/liveness-R6a.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R6a-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R6a-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R6a-recommendation.md; b=$d/triage-R6a-brief.md; l=$d/liveness-R6a.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R6a-recommendation.md; b=$d/triage-R6a-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R6a-recommendation.md; b=$d/triage-R6a-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
d=.tanto/tanto-issue-triage
awk -v b="$d/triage-R6a-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R6a: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R6a-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 13: Round 6b — recommend and brief

**Files:**

- Read: `.tanto/tanto-issue-triage/liveness-R6b.md` (the round's liveness table); the `title:` of every issue of the round; the body of any issue it needs, in the pile, by id; for a gone string whose subject alone does not say whether the gap closed, the live file the subject points at, read at `main` (`git show main:<path>`), since the instrument read `main`; for a Re-hung candidate, the expectation lines of `docs/experience/*.md` and `docs/experience.md` by the lookup below; for an Assigned candidate, if the scopes below leave a doubt, §3 and §5 of `.tanto/kikaku/2026-10-01-topics-after-experience-layer.md` and nothing else of it.
- Create, untracked under `.tanto/tanto-issue-triage/` (ignored by `.tanto/.gitignore`): `triage-R6b-recommendation.md`, `triage-R6b-brief.md`.
- Never read: any other round's files — another `liveness-R*.md`, `liveness.json` (it holds every round), and any `triage-R*-recommendation.md`, `triage-R*-brief.md`, or `triage-R*-direction.md` but this round's own; anything under `docs/issues/resolved/`.

**Interfaces:**

- Consumes: Task 3's `.tanto/tanto-issue-triage/liveness-R6b.md` — line 1 the header `Liveness — round 6b — ref <ref>, <date> — alive <a>, gone <g>, partly <p>, none <n>`, then a table whose rows open `| <id> | ` with the issue's bare 4-hex id, in table order, with the columns `id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound`.
- Produces: the recommendation, which the apply (Task 14 or 15) reads with Kanri's `triage-R6b-direction.md`; the brief, which the human reads at the boundary; and the report line below, which the batch report's Questions for the human carries.

**The seat and the scope.** The implementer is `task.implement` on sonnet. It dispatches no agent of its own — no subagent of a higher family, no recommender (spec section 2, Q-2). The two files are untracked: this task has **no commit step**, and `git status --porcelain` prints nothing at its end. A rework of this round is a rework of this one task. The spec reviewer (`task.review-spec`) reads the recommendation, this round's liveness table, and the bodies of the Landed and Merged items only — never every body of the round — and runs the `exp-` lookup for the Re-hung items. The quality reviewer (`task.review-quality`) runs Step 5's greps and reads no issue body. The two reviews are bounded so that a round costs one sonnet read of its bodies and not three.

**The recommendation's form**, `.tanto/tanto-issue-triage/triage-R6b-recommendation.md`, in English:

- A header, before the first `##`: the line `# Triage recommendation — round 6b`, then the lines `Round: 6b`, `Liveness: .tanto/tanto-issue-triage/liveness-R6b.md — <its line 1, verbatim>`, `Date: <YYYY-MM-DD>`, `Family: <the family of the seat that wrote the file>`.
- Six `##` headings, in this order and this exact text: `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`, and last `## Wants no scene states`.
- Under the first five, one `###` heading per issue of the round, `### <n> — <title> (issue-<id>)`: the full `title:` from the issue's frontmatter, not the table's 100-character cut, with any `|` left as it is; `<n>` one running number across the round in the order the liveness table lists the issues (the table's first row is 1), never restarted per section. Each heading goes under the section of its destination. Under the heading, one blank line, then four consecutive lines:
  - `Destination: <the section's word>` — `Landed`, `Merged`, `Assigned`, `Re-hung`, or `Kept`;
  - `Target: <…>` — the removing commit's subject, verbatim from the liveness row, for Landed; `issue-<carrier id>` for Merged; one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade` for Assigned; `exp-<id>` for Re-hung; `—` for Kept;
  - `Reason: <one sentence>`;
  - `Evidence: <the liveness row's verdict and a/g/n counts>`, and for Landed also the subject and the file it removed from, as the row gives them.
- Under `## Wants no scene states`, one bullet per Kept issue whose gap is a want no scene states, `- issue-<id> — <the want in one clause> — nearest scene: exp-<scene id>` (or `— nearest scene: none`), where the scene id is that of a file `docs/experience/<id>-*.md`; or, when there is none, the one line `none`.

**The rules the spec reviewer checks**, each against the two files and the liveness row:

1. **Landed.** An item is under `## Landed` only when its liveness row holds at least one gone item with a removing subject (not `no commit found`), its `Target:` is that subject, and the subject — or the live file the implementer read — shows the issue's gap closed: the sentence the issue said was missing is now there, the rule it said was absent now exists, the instrument it said was unbuilt is in the tree. A gone quote under a subject that rewrote the passage and kept the gap is Kept or Assigned, with the subject in its reason (Fixed input 7). An issue whose only gone item is its own proposed wording, never in the tree, is not Landed. A row whose gone items all read `no commit found` is Kept, with that fact in its reason.
2. **Merged.** An item is under `## Merged` only when it and its carrier name the same gap — the same missing rule or defect at the same site — not merely the same file. The carrier is the one with the earliest `created:`, unless another's body is plainly fuller, and the item's `Reason:` says which and why. The carrier may be in another round and is named by id in `Target:`; it must be an issue of the pile (under `docs/issues/open/` or `docs/issues/deferred/`), never one already under `resolved/`. The carrier itself is not under `## Merged`: it takes its own destination.
3. **The Assigned rule.** An item is under `## Assigned` only to one of the three carriers, and only when the issue's gap lies inside that topic's scope as the decision file §3 and §5 state it. `passage-check-hardening` — the checking half of the passage instrument: `skills/tanto/scripts/passage-check.js`, its modes, needles, blocks, and anchors, and the consistency script. `passage-plan-generation` — the generating half: producing a plan's passage blocks from the live tree, riders included. `09c2-upgrade` — scene 09c2's upgrade side: a consuming repository reaching a new skill version through the install route already in use, a copied project's record of the version it holds, and an upgrade step (issues 1298, c3d1, and 337b are that gap seen from tanto). A gap in Kanri's, the ledger's, the reading's, the roster's, or any other cluster has no carrier today and is Kept.
4. **Re-hung.** An item is under `## Re-hung` only to an `exp-<id>` that resolves by lookup — a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of those files or in the hub `docs/experience.md` — and only when the issue's gap is a want that line states. An issue whose body already cites that `exp-` id is Kept, since the line is already there.
5. **Kept** is the default and needs no reason beyond its one line. A Kept issue is listed under `## Wants no scene states` only when its gap is a want that no scene states.
6. **The deferred directory.** A deferred issue keeps its directory unless it is Landed or Merged: the recommendation proposes no other move for it.
7. **The once-each rule.** Every issue of the round appears exactly once under the five sections, and no issue of another round appears.

**The brief's form**, `.tanto/tanto-issue-triage/triage-R6b-brief.md`, in the human's language, Japanese — the shoroku check brief's form (`templates/shoroku-brief.md` in the tanto skill) with its groups replaced by the five destinations. The form markers stay in English exactly as written here: the headings, the bracketed tag words, the `<n>.` numbers, the label `See:` and the heading text after it, and the marker ` — want unstated`.

- Line 1 `# Triage check brief — round 6b`, a blank line, then the Document line `Document: .tanto/tanto-issue-triage/triage-R6b-recommendation.md — <YYYY-MM-DD> に <the writing seat's family> が日本語で作成`.
- Six `##` headings, in this order: `## How to answer`, `## Landed`, `## Merged`, `## Assigned`, `## Re-hung`, `## Kept`.
- Under `## How to answer`, this text, written as it is:

```text
この round の推奨をそのまま受けるなら `R6b: OK` と答えてください。推奨と違う行き先にしたい項目だけ、番号と行き先の語で答えます。target が要る行き先では target も添えてください — `R6b: 12 は Kept`、`R6b: 30 は Merged → issue-abcd`、`R6b: 41 は Assigned → passage-check-hardening`、`R6b: 7 は Re-hung → exp-178d`、`R6b: 5 は Landed`（Landed の subject は liveness の行にあるものを使います）。行き先の語は Landed、Merged、Assigned、Re-hung、Kept のどれかで、Assigned の target は passage-check-hardening、passage-plan-generation、09c2-upgrade のどれかです。答えに出てこない項目は推奨どおりになります。round 名を付けない `OK` は、その sitting の全 round への OK です。答えは Kanri が `.tanto/tanto-issue-triage/triage-R6b-direction.md` に書き、apply はその direction と recommendation を読みます。この brief は読みません。
```

- Under each destination heading, one line per item of that group, in the recommendation's order, or the one line `none`:
  `<n>. [landed|merged|assigned|rehung|kept] <target> — <title> — <reason> — See: <the item's heading text, without its ### marker>`
  — the tag word the section's (`landed`, `merged`, `assigned`, `rehung`, `kept`); `<n>` the item's number in the recommendation; the target a Landed line's removing commit's subject, a Merged line's carrier id, an Assigned line's topic, a Re-hung line's `exp-` id, a Kept line's `—`; the title and the reason rendered in Japanese; the `See:` text copied from the recommendation verbatim. A Kept line whose issue is listed under Wants no scene states ends its reason with ` — want unstated`.

**The report line** for the batch report's Questions for the human — the one thing the human reads at the boundary, a status line for Kanri's window and not a question:

```text
R6b: <brief path> — landed <a>, merged <b>, assigned <c>, re-hung <d>, kept <e>; wants without a scene <w>
```

- [ ] **Step 1: Read the round's table and titles**

```bash
# tree-state
l=.tanto/tanto-issue-triage/liveness-R6b.md
test -e "$l" || { echo "missing $l"; exit 1; }
sed -n 1p "$l"
printf 'rows: %s\n' "$(grep -cE '^\| [0-9a-f]{4} \|' "$l")"
for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do f=$(ls docs/issues/open/"$id"-*.md docs/issues/deferred/"$id"-*.md 2>/dev/null | head -1); [ -n "$f" ] || { echo "issue-$id is not in the pile"; exit 1; }; printf '%s  ' "$id"; grep -m1 '^title:' "$f" | tr -d '\r'; done
```

Expected: the header line, the row count, and one `<id>  title: …` line per row. An id not in the pile is a stop: report it.

- [ ] **Step 2: Decide each issue's destination**

Work through the rows in table order against the seven rules above. For a Landed candidate, read the gone items' subjects and, when a subject does not settle it, the live file at `main`. For a Merged candidate, start from the row's neighbors and read both bodies; the carrier is named by id. For a Re-hung candidate, run the lookup:

```bash
# tree-state
id=178d
ls docs/experience/"$id"-*.md 2>/dev/null
grep -n -F "**$id**" docs/experience/*.md docs/experience.md || echo "no **$id** line"
```

Expected: the scene file or the expectation line that states the want, or nothing — an `exp-` id that resolves to neither is not a Re-hung target. Then check the issue does not already cite it: `grep -c "exp-$id" <the issue file>` prints `0` (and exits 1, as `grep -c` does on a count of zero: read the printed count, or add `|| true`).

- [ ] **Step 3: Write `triage-R6b-recommendation.md`**

In the form above: the header, the six headings in order, one `###` item per row under its destination with its four lines, and the Wants section.

- [ ] **Step 4: Write `triage-R6b-brief.md`**

In the form above, from the recommendation: the H1, the Document line, How to answer as given, and one line per item under its destination, or `none`.

- [ ] **Step 5: Verify — the form greps**

The round's row count is computed from the liveness table, never taken from a number written into the plan.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R6b-recommendation.md; b=$d/triage-R6b-brief.md; l=$d/liveness-R6b.md
for f in "$r" "$b" "$l"; do test -e "$f" || { echo "missing $f"; exit 1; }; done
n=$(grep -c '^## ' "$r" || true); printf 'recommendation ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$r" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## Landed|## Merged|## Assigned|## Re-hung|## Kept|## Wants no scene states|' ] || { echo "recommendation headings out of order: $h"; exit 1; }
n=$(grep -c '^## ' "$b" || true); printf 'brief ## headings: %s\n' "$n"; [ "$n" = 6 ] || exit 1
h=$(grep '^## ' "$b" | tr -d '\r' | tr '\n' '|'); [ "$h" = '## How to answer|## Landed|## Merged|## Assigned|## Re-hung|## Kept|' ] || { echo "brief headings out of order: $h"; exit 1; }
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$l" || true); items=$(grep -c '^### ' "$r" || true)
printf 'liveness rows %s, ### items %s\n' "$rows" "$items"; [ "$rows" -gt 0 ] && [ "$rows" = "$items" ] || exit 1
i=0; for id in $(grep -oE '^\| [0-9a-f]{4} \|' "$l" | cut -c3-6); do i=$((i + 1)); c=$(grep -cE "^### $i — .*\(issue-$id\)[[:space:]]*$" "$r" || true); [ "$c" = 1 ] || { echo "item $i is not issue-$id exactly once"; exit 1; }; done
echo 'every row of the table is one ### item, numbered in table order'
```

Expected: `6` and `6`, equal row and item counts, and the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R6b-recommendation.md; b=$d/triage-R6b-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / {
  if (need > 0) { print "incomplete item before: " $0; bad = 1 }
  if (sec == "Kept") kept[substr($0, length($0) - 10, 10)] = 1
  need = 4; want = "Destination: " sec; next
}
need == 4 && /^Destination: / { if ($0 != want) { print "wrong destination: " $0 " under ## " sec; bad = 1 } need = 3; next }
need == 3 && /^Target: / { need = 2; next }
need == 2 && /^Reason: / { need = 1; next }
need == 1 && /^Evidence: / { need = 0; next }
need > 0 && NF > 0 { print "unexpected line in an item: " $0; bad = 1; need = 0; next }
sec == "Wants no scene states" && NF > 0 {
  if ($0 == "none") { nn++; next }
  if ($0 !~ /^- issue-[0-9a-f]{4} — .+ — nearest scene: (exp-[0-9a-f]{4}|none)$/) { print "bad want line: " $0; bad = 1; next }
  w++; id = substr($0, 3, 10); if (!(id in kept)) { print "a want for an issue not Kept: " id; bad = 1 }
}
END {
  if (need > 0) { print "incomplete last item"; bad = 1 }
  if (nn && w) { print "none beside want bullets"; bad = 1 }
  if (!nn && !w) { print "the Wants section is empty"; bad = 1 }
  exit bad
}' "$r" || exit 1
echo 'every item has its four lines under the right section; the Wants section is well formed'
```

Expected: the last line.

```bash
# tree-state
d=.tanto/tanto-issue-triage; r=$d/triage-R6b-recommendation.md; b=$d/triage-R6b-brief.md
awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); tag = ""; if (sec == "Landed") tag = "landed"; if (sec == "Merged") tag = "merged"; if (sec == "Assigned") tag = "assigned"; if (sec == "Re-hung") tag = "rehung"; if (sec == "Kept") tag = "kept"; next }
tag != "" && NF > 0 && $0 != "none" { if ($0 !~ ("^[0-9]+\\. \\[" tag "\\] ")) { print "bad line under ## " sec ": " $0; bad = 1 } }
END { exit bad }' "$b" || exit 1
s1=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } /^### / { print substr($0, 5) " @ " sec }' "$r" | LC_ALL=C sort)
x=$(awk '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^[0-9]+\. \[/ {
  s = $0; p = 0
  while ((k = index(substr(s, p + 1), " — See: ")) > 0) p += k
  if (p == 0) { print "no See: on the line: " s > "/dev/stderr"; bad = 1; next }
  t = substr(s, p + length(" — See: "))
  n1 = s; sub(/\..*/, "", n1)
  n2 = t; sub(/ .*/, "", n2)
  if (n1 != n2) { print "line " n1 " points at heading " t > "/dev/stderr"; bad = 1 }
  print t " @ " sec
}
END { exit bad }' "$b") || exit 1
s2=$(printf '%s\n' "$x" | LC_ALL=C sort)
[ "$s1" = "$s2" ] || { echo 'the See: targets differ from the ### headings and their sections'; diff <(printf '%s\n' "$s1") <(printf '%s\n' "$s2"); exit 1; }
w=$(awk '{ sub(/\r$/, "") } /^## / { sec = substr($0, 4); next } sec == "Wants no scene states" && /^- issue-/ { n++ } END { print n + 0 }' "$r")
u=$(grep -c ' — want unstated — See: ' "$b" || true); printf 'wants %s, want-unstated lines %s\n' "$w" "$u"; [ "$w" = "$u" ] || exit 1
echo 'every ### heading appears once after See:, under its own destination, and no other'
```

Expected: `wants N, want-unstated lines N`, and the last line.

- [ ] **Step 6: The report line**

```bash
# tree-state
d=.tanto/tanto-issue-triage
awk -v b="$d/triage-R6b-brief.md" '
{ sub(/\r$/, "") }
/^## / { sec = substr($0, 4); next }
/^### / { n[sec]++ }
sec == "Wants no scene states" && /^- issue-/ { w++ }
END { printf "R6b: %s — landed %d, merged %d, assigned %d, re-hung %d, kept %d; wants without a scene %d\n", b, n["Landed"], n["Merged"], n["Assigned"], n["Re-hung"], n["Kept"], w }' "$d/triage-R6b-recommendation.md"
```

Expected: the one line, which the batch report copies into its Questions for the human as it is.

- [ ] **Step 7: The tree is unchanged**

```bash
# tree-state
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'no tracked file changed'
```

Expected: `no tracked file changed`. No commit: both files are untracked under `.tanto/`.

### Task 14: Apply rounds 1 to 3

**Files:**

- Modify: `docs/issues/open/**`, `docs/issues/deferred/**` — the Assigned, Re-hung and carrier issues of rounds 1 to 3, and the issues that move.
- Create (by `git mv`): `docs/issues/resolved/<file>` for each Landed and Merged-away issue.
- Modify: the living documents named in a moved issue's `liveness.json` `inbound` list.
- Untracked scratch under `.tanto/tanto-issue-triage/`: `apply-helper.js`, and per round file `apply-R<part>-list.tsv`, `apply-R<part>-touch.txt`, `apply-R<part>-eol-before.txt`, `apply-R<part>-old.txt`, `apply-R<part>-new.txt`, `apply-R<part>-edited.txt`, `apply-R<part>-subject.txt`, and `apply-R<part>-eol-after.txt` (Step 8).

**Interfaces:**

- Consumes: for each round file `<part>` of rounds 1, 2 and 3 — the lines of `round-files.txt` whose number is 1, 2 or 3, in that file's order (`1a 1b 2a 2b 3`, or `1 2a 2b 3`) — the files `triage-R<part>-recommendation.md` (Tasks 4 to 8), `triage-R<part>-direction.md` (Kanri), `liveness-R<part>.md`, and `liveness.json` (Task 3), all under `.tanto/tanto-issue-triage/`. The recommendation's item form: a heading `### <n> — <title> (issue-<id>)` followed by the lines `Destination:`, `Target:`, `Reason:`, `Evidence:`. The direction's form: a two-line header, `Route: <where the answer came from>` and `Date: <YYYY-MM-DD>`, then either the one line `OK` or one line per item that goes the other way, `<n> — <destination word> [<target>] — <the human's words verbatim>`.
- Produces: one commit per round file, subject `docs(issues): triage round <part> — landed <a>, merged <b>, assigned <c>, re-hung <d>`; Carries lines Task 15 may append to.

This task carries spec section 4 whole for rounds 1 to 3. It runs on the branch `tanto-issue-triage`; the instrument read `main`. It never edits under `skills/`, `.claude/`, `docs/decisions/`, or `docs/reports/`, never touches a Kept issue beyond a repointed path link, and never reads a brief — the apply reads the recommendation and the direction only.

**The effective destination**, per item of the round's recommendation: the direction's line for that item's number when there is one, the recommendation's `Destination:` otherwise. A direction of `OK` (in any letter case) changes nothing. Parse a direction item line `<n> — <destination word> [<target>] — <words>` so that a target holding ` — ` (a commit subject usually does) survives: `<n>` is the text before the first ` — `; the rest opens with the destination word, matched case-insensitively against `Landed`, `Merged`, `Assigned`, `Re-hung` (or `rehung`), `Kept`, `unclear`, anything else read as `unclear`; when the rest holds a `[`, the target is the text from that `[` to the first `]` that is followed by ` — ` or by the end of the line, and the words are what follows; with no `[`, the target is the rest of the line up to its next ` — `, with a leading `→` removed and trimmed, and the words what follows. The header is the lines before the first `OK` or item line, and begins `Route:` and `Date:`; an item line opens with digits and ` — `, a header line never does. The target never includes its brackets, and `Re-hung [exp-178d]`, `Re-hung → exp-178d` and `Re-hung exp-178d` give the same target, `exp-178d`. When a direction holds both an `OK` line and item lines, the item lines apply and every other item goes as recommended — the `OK` reads as "the rest are fine". **`unclear` is Kept.** The target must be valid for the destination, or the item is **left Kept and reported** (one line naming the number, the id, and why):

- Landed — the subject: the direction's target, else the recommendation's `Target:` when the recommendation itself said Landed, else the one gone item of the item's liveness row that has a removing subject (a human's `12 は Landed` names no subject, and the row supplies it when it holds exactly one); a row with none or several is left Kept and reported;
- Merged — `issue-<carrier id>`, the carrier an id present in `liveness.json`, not the issue itself, and not an issue whose own effective destination in this run is Merged (a chain inside the run is left Kept and reported);
- Assigned — exactly one of `passage-check-hardening`, `passage-plan-generation`, `09c2-upgrade`;
- Re-hung — `exp-<id>` that resolves: a file `docs/experience/<id>-*.md`, or a line holding `**<id>**` in one of `docs/experience/*.md` or `docs/experience.md`.

A direction line whose number is not in the recommendation, or a recommendation `###` whose id is not a row of `liveness-R<part>.md`, is a stop: report it, apply nothing for that round file.

**The edit per destination**, with `<YYYY-MM-DD>` the day of the apply (`date +%F`):

- **Landed**: `git mv docs/issues/<dir>/<file> docs/issues/resolved/<file>`; `updated:` set to the day; appended as the body's last paragraph: `Resolved by "<the removing commit's subject>" — found by the tanto-issue-triage liveness check, <YYYY-MM-DD>.`
- **Merged** (the issue that is merged away): moved likewise; `updated:` set; last paragraph `Merged into issue-<carrier id> (tanto-issue-triage, <YYYY-MM-DD>).`
- **The carrier** of one or more Merged issues, wherever it now is (`docs/issues/open/`, `deferred/`, or `resolved/` — a carrier that its own round moved is still the carrier, since the pointer is the id): `updated:` set; **one** line per carrier, `Carries issue-<id>[, issue-<id>…] (merged by tanto-issue-triage, <YYYY-MM-DD>).`, listing every issue merged into it across every round. When the carrier has no such line, append it as the body's last paragraph; when it has one (an earlier round file wrote it), add the new ids after the last one listed, in the order merged, without repeating an id, and keep the date the line was first written. Find the line by its form (`^Carries issue-…(merged by tanto-issue-triage, <date>).$`, matched after stripping a trailing `\r`, since a `$` anchor fails against a CRLF line), never by its position. Locate the carrier's file by the glob `docs/issues/*/<id>-*.md`, not by `liveness.json`'s `path`, which a Landed move in an earlier round file has made stale.
- **The Assigned issue**: the directory unchanged; `updated:` set; last paragraph `Assigned to <topic> (tanto-issue-triage, <YYYY-MM-DD>).`
- **Re-hung**: the directory unchanged; `updated:` set; last paragraph `Serves exp-<id> (tanto-issue-triage, <YYYY-MM-DD>).`
- **Kept**: untouched — no `updated:` bump, no line.

A deferred issue keeps its directory unless it is Landed or Merged, which the rules above already do.

**Line endings.** Each file is written in its own working-tree ending: a file containing `\r\n` is CRLF, and every line this task writes into it — the `updated:` line, the blank separator, the paragraph — ends `\r\n`; never a bare `\n` into a CRLF file. "Appended as the last paragraph" means: trailing blank lines at the end of the file removed, then one blank line, the paragraph, and one line ending. Edit files as bytes through Node's `fs` (read, change, write back), never with `sed -i`, which strips the CR on this host.

**Inbound links.** For every moved issue, each path in its `liveness.json` `inbound` list has every occurrence of the old path `docs/issues/<dir>/<file>` replaced by `docs/issues/resolved/<file>`, in that file's own line ending. An inbound path that is itself an issue this apply has moved to `resolved/` is skipped: `resolved/` is not a living document. An inbound path that is a root Markdown file (`README.md`, `CONTRIBUTING.md`) or any `AGENTS.md` or `CLAUDE.md` is **not edited** (Global Constraints, "AGENTS.md"): leave that one link, and report the file and the old path under Questions for the human as a scope question. `docs/reports/` and `docs/decisions/` carry `<type>-<id>` references and are not edited. A leftover the instrument did not list, which Step 7's `git grep` finds, is repointed the same way and reported.

**The helper.** Write `.tanto/tanto-issue-triage/apply-helper.js` (untracked, never committed; Node, no dependencies) with two modes, run per round file:

- `node .tanto/tanto-issue-triage/apply-helper.js plan <part>` — reads the four inputs of its round file and, for the Merged rule's chain check, the `triage-R<part>-recommendation.md` and `triage-R<part>-direction.md` of **every** name in `round-files.txt` (all of them exist once batch E is spawned), computes every item's effective destination across all round files, and writes `apply-R<part>-list.tsv` (no header; one line per item in the recommendation's number order: `<n>`, `<id>`, the effective destination, the target, `recommendation` or `direction`, the current path, the path after the apply — tab-separated) and `apply-R<part>-touch.txt` (every existing file the apply will write: the moved issues' current paths, the Assigned, Re-hung and carrier issues, the inbound documents), and prints the counts per effective destination and every item left Kept with its reason. It changes no file outside `.tanto/`.
- `node .tanto/tanto-issue-triage/apply-helper.js apply <part>` — performs the edits above (`git mv` through `execFileSync` with an argument array), then writes `apply-R<part>-old.txt` (the vacated paths), `apply-R<part>-new.txt` (their `resolved/` paths), `apply-R<part>-edited.txt` (every other path it wrote), each one path per line, and `apply-R<part>-subject.txt` holding the one line `docs(issues): triage round <part> — landed <a>, merged <b>, assigned <c>, re-hung <d>`, where `<b>` counts the issues merged away, not the carriers.

Steps 2 to 8 run once per round file, in `round-files.txt` order; set `p` to the round file in each block. Finish one round file's commit before the next round file's Step 2.

- [ ] **Step 1: Confirm the starting state and the inputs**

```bash
# tree-state
[ "$(git branch --show-current)" = tanto-issue-triage ] || { echo 'not on tanto-issue-triage'; exit 1; }
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
d=.tanto/tanto-issue-triage
parts=$(tr -d '\r' < "$d/round-files.txt" | grep -E '^[123][ab]?$')
[ -n "$parts" ] || { echo 'no round files for rounds 1 to 3'; exit 1; }
for p in $parts; do for f in "triage-R$p-recommendation.md" "triage-R$p-direction.md" "liveness-R$p.md"; do test -e "$d/$f" || { echo "missing $d/$f"; exit 1; }; done; done
test -e "$d/liveness.json" || { echo "missing $d/liveness.json"; exit 1; }
printf 'round files to apply, in order: %s\n' "$(printf '%s ' $parts)"
```

Expected: the round files of rounds 1 to 3 in order. A missing direction file means batch E was spawned too early: stop and report.

- [ ] **Step 2: Plan the round file**

```bash
# tree-state
p=1a
d=.tanto/tanto-issue-triage
node "$d/apply-helper.js" plan "$p" || exit 1
rows=$(grep -cE '^\| [0-9a-f]{4} \|' "$d/liveness-R$p.md" || true); l=$(grep -c . "$d/apply-R$p-list.tsv" || true)
printf 'R%s: %s liveness rows, %s planned items\n' "$p" "$rows" "$l"; [ "$rows" = "$l" ] || exit 1
t=$(tr -d '\r' < "$d/apply-R$p-touch.txt")
if [ -z "$t" ]; then : > "$d/apply-R$p-eol-before.txt"; else git ls-files --eol -- $t | awk '{n = split($NF, a, "/"); print a[n], $2}' | sort > "$d/apply-R$p-eol-before.txt" || exit 1; fi
cat "$d/apply-R$p-eol-before.txt"
```

Expected: the counts per effective destination, any item left Kept with its reason, equal row and item counts, and one `<file> w/<ending>` line per file the apply will write.

- [ ] **Step 3: Apply the round file**

```bash
# tree-state
p=1a
d=.tanto/tanto-issue-triage
node "$d/apply-helper.js" apply "$p" || exit 1
cat "$d/apply-R$p-subject.txt"
git status --short
```

Expected: the subject line, and in `git status --short` only `R` (or `RM`, a moved issue that carries its appended paragraph) entries from `docs/issues/open/` or `docs/issues/deferred/` into `docs/issues/resolved/` and `M` entries for the edited paths.

- [ ] **Step 4: Check the frontmatter of every changed issue**

```bash
# tree-state
p=1a
d=.tanto/tanto-issue-triage
files=$(cat "$d/apply-R$p-new.txt" "$d/apply-R$p-edited.txt" | tr -d '\r' | grep '^docs/issues/' || true)
[ -z "$files" ] && { echo 'no issue file changed'; exit 0; }
printf '%s\n' "$files" | xargs uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py
```

Expected: exit `0`, nothing printed.

- [ ] **Step 5: Lint the changed paths by name**

```bash
# tree-state
p=1a
d=.tanto/tanto-issue-triage
files=$(cat "$d/apply-R$p-new.txt" "$d/apply-R$p-edited.txt" | tr -d '\r')
[ -z "$files" ] && { echo 'no changed paths'; exit 0; }
printf '%s\n' "$files" | xargs ./scripts/lint.sh
```

Expected: every hook passes. A hook that auto-fixes leaves the change unstaged and fails: run the step again until it passes, then re-run Step 4.

- [ ] **Step 6: Commit the round file by explicit path, both sides of every rename**

The spec's recipe writes `git commit --only -- <paths> -m "…"`, which hands `-m` and the message to git as pathspecs. The recipe here puts the message before `--`: `git add -- <each new path>` first for the files `git mv` created, then `git commit --only -m "<subject>" -m "Co-Authored-By: <the agent>" -- <each old path> <each new path> <each edited path>` — the old path named as well as the new, or the vacated path survives in `HEAD` (issue-9350); the trailer as `AGENTS.md` requires, naming your model when you know it. Never `git add -A`, `.`, or `-u`; never `--no-verify`. A round file whose list moved and edited nothing makes no commit: report `round <part>: every item Kept, no commit` and go on to the next round file.

```bash
# tree-state
p=1a
d=.tanto/tanto-issue-triage
trailer='Co-Authored-By: Claude <noreply@anthropic.com>'
mapfile -t old < <(tr -d '\r' < "$d/apply-R$p-old.txt")
mapfile -t new < <(tr -d '\r' < "$d/apply-R$p-new.txt")
mapfile -t edited < <(tr -d '\r' < "$d/apply-R$p-edited.txt")
subject=$(tr -d '\r' < "$d/apply-R$p-subject.txt")
[ $(( ${#old[@]} + ${#new[@]} + ${#edited[@]} )) -gt 0 ] || { echo "round $p: every item Kept, no commit"; exit 0; }
[ "${#new[@]}" -eq 0 ] || git add -- "${new[@]}" || exit 1
git commit --only -m "$subject" -m "$trailer" -- "${old[@]}" "${new[@]}" "${edited[@]}" || exit 1
git log -1 --format=%s
```

Expected: the round file's subject. A hook that fails leaves its fix unstaged: re-run Step 5, then this step.

- [ ] **Step 7: Verify the round file's commit**

`git diff-tree` needs `-M` to report a rename as an `R` line — the spec's form omits it, and without it a move prints as a `D` and an `A` line; the threshold is lowered to 20% (`-M20%`) because the default 50% can read a short issue file, whose frontmatter and appended paragraph are most of what changed, as a delete and an add. The landed and merged counts are read from the commit's own subject.

```bash
# tree-state
c=$(git rev-parse HEAD)
s=$(git log -1 --format=%s "$c"); printf '%s\n' "$s"
a=$(printf '%s' "$s" | sed -n 's/^docs(issues): triage round [0-9][ab]* — landed \([0-9][0-9]*\), merged \([0-9][0-9]*\), .*/\1/p')
b=$(printf '%s' "$s" | sed -n 's/^docs(issues): triage round [0-9][ab]* — landed \([0-9][0-9]*\), merged \([0-9][0-9]*\), .*/\2/p')
[ -n "$a" ] && [ -n "$b" ] || { echo 'HEAD is not a triage round commit'; exit 1; }
out=$(git diff-tree --no-commit-id -r -M20% --name-status "$c")
printf '%s\n' "$out"
bad=$(printf '%s\n' "$out" | awk -F'\t' '
$1 ~ /^R/ && $2 ~ /^docs\/issues\/(open|deferred)\// && $3 ~ /^docs\/issues\/resolved\// { next }
$1 == "M" && $2 ~ /^docs\/issues\/(open|deferred|resolved)\// { next }
$1 == "M" && $2 ~ /^docs\/(experience|design|notes)\// { next }
$1 == "M" && $2 == "docs/experience.md" { next }
{ print }')
[ -z "$bad" ] || { printf 'outside the allowed set:\n%s\n' "$bad"; exit 1; }
r=$(printf '%s\n' "$out" | awk -F'\t' '$1 ~ /^R/' | wc -l)
printf 'R lines %s, landed + merged %s\n' "$r" "$((a + b))"; [ "$r" -eq "$((a + b))" ] || exit 1
for p in $(printf '%s\n' "$out" | awk -F'\t' '$1 ~ /^R/ {print $2}'); do
  if git grep -n -F -- "$p" -- docs/experience docs/design docs/notes docs/issues/open docs/issues/deferred docs/experience.md; then echo "the old path is still named: $p"; exit 1; fi
done
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
echo 'the round commit verifies'
```

Expected: the subject, the name-status lines, `R lines N, landed + merged N`, and the last line. When Step 6 made no commit, skip Steps 7 and 8. A `git grep` hit names a mention the instrument did not list: run Step 8 first, then repoint it in the file's own ending, lint it by name, commit it by path with the subject `docs(issues): triage repoint — <path>` (not a `triage round` subject, so no apply gate counts it), and report it.

- [ ] **Step 8: Verify the line endings did not change**

```bash
# tree-state
p=1a
d=.tanto/tanto-issue-triage
files=$(git diff-tree --no-commit-id -r -M20% --name-status HEAD | awk -F'\t' '$1 ~ /^R/ {print $3; next} {print $2}')
[ -n "$files" ] || { echo 'HEAD changed no file'; exit 1; }
git ls-files --eol -- $files | awk '{n = split($NF, a, "/"); print a[n], $2}' | sort > "$d/apply-R$p-eol-after.txt" || exit 1
awk 'NR == FNR {b[$1] = $2; next} $2 == "w/mixed" {print "mixed endings: " $1; bad = 1} ($1 in b) && b[$1] != $2 {print "ending changed: " $1 " " b[$1] " -> " $2; bad = 1} END {exit bad}' "$d/apply-R$p-eol-before.txt" "$d/apply-R$p-eol-after.txt" || exit 1
echo 'every file kept its working-tree ending'
```

Expected: `every file kept its working-tree ending`.

- [ ] **Step 9: Next round file, then the report**

Repeat Steps 2 to 8 for the next round file of rounds 1 to 3, in `round-files.txt` order. After the last one, `git status --porcelain` prints nothing. The batch report lists, per round file: the commit subject, the `R` and `M` line counts of Step 7, every item left Kept with its reason, every leftover path repointed, and every carrier whose Carries line this task wrote or extended, by id.

### Task 15: Apply rounds 4 to 6

**Files:**

- As Task 14 "Files", for the issues of rounds 4 to 6.

**Interfaces:**

- Consumes: as Task 14 "Interfaces", for the round files of rounds 4, 5 and 6 — the lines of `round-files.txt` whose number is 4, 5 or 6, in order (`4a 4b 5 6a 6b`) — and Task 14's commits on the branch, including any `Carries` line Task 14 wrote; the helper `.tanto/tanto-issue-triage/apply-helper.js` Task 14 wrote, reused unchanged.
- Produces: one commit per round file, the subject as Task 14's.

This task runs after Task 14 and is Task 14 for the other half of the rounds. Its rules are Task 14's text from "The effective destination" through "The helper", unchanged, and its steps are Task 14's Steps 1 to 9, unchanged, with these differences only:

- **The round files** are those of rounds 4, 5 and 6: in Step 1, `parts` is read with `grep -E '^[456][ab]?$'` in place of `grep -E '^[123][ab]?$'`, and the message names rounds 4 to 6; in Steps 2 to 8, `p` is set to `4a`, then `4b`, `5`, `6a`, `6b`, in `round-files.txt` order.
- **The carrier append.** A carrier of a round 4 to 6 merge may already carry the `Carries issue-… (merged by tanto-issue-triage, <date>).` line that Task 14 wrote for a merge of rounds 1 to 3. Append the new ids to that line, after the last one listed, keeping its date — never write a second Carries line into a carrier. Before Step 2 of the first round file, list the carriers Task 14 wrote:

```bash
# tree-state
git grep -n -E '^Carries issue-[0-9a-f]{4}' -- docs/issues || echo 'no Carries line yet'
```

Expected: one line per carrier Task 14 wrote, or `no Carries line yet`.

- **The check after the last round file** — every carrier holds exactly one Carries line:

```bash
# tree-state
dup=$(git grep -c -E '^Carries issue-[0-9a-f]{4}' -- docs/issues | awk -F: '$NF > 1' || true)
[ -z "$dup" ] || { printf 'a carrier with more than one Carries line:\n%s\n' "$dup"; exit 1; }
echo 'one Carries line per carrier'
```

Expected: `one Carries line per carrier`.

The controller hands the implementer Task 14's text with this task.

### Task 16: The counter and the note's sentence

**Files:**

- Create: `scripts/issues-by-finder.js`
- Create: `scripts/issues-by-finder.test.js`
- Modify: `docs/notes/experience-layer-exit-criterion.md` (one sentence)

**Interfaces:**

- Consumes: nothing from an earlier task's code. Reads issue files, `.tanto/<topic>/kanri.md` ledgers, and, for `--exp`, the topic's spec, plan, review briefs, dialogue, spec inputs, and the Kikaku files the spec names.
- Produces, as `module.exports` (the script runs `main` only under `if (require.main === module)`):
  - `parseSource(text: string) → {kind: "inbox" | "session" | "hotfix" | "shoroku" | null, topic: string | null, row: number | null}` (`row` the `S-<n>` number);
  - `findRow(ledgerText: string, n: number) → string[] | null` — the cells of the row whose first cell is `S-<n>`, anywhere in the file;
  - `mapFinder(cell: string) → string` — the finder for a Source cell;
  - `finderOf(issue, tantoDir: string) → {topic: string, finder: string}`;
  - `countByFinder({docs, tanto, statuses}) → {total, perTopic, totals, sourceKinds, attributable}`;
  - `expCount({topic, docs, inputs, adr, cwd}) → {documents: string[], inputs: string[], documentIds: string[], inputIds: string[], unprompted: string[], skipped: string[]}`;
  - `main(argv: string[], io: {cwd, stdout, stderr}) → number`.
- Produces for Task 17: the stdout forms below, including the last line `issues counted: <N>`.

**The behavior** — spec section 5 whole.

- **The command line.** `node scripts/issues-by-finder.js [--docs docs/issues] [--tanto .tanto] [--status open,deferred,resolved] [--json <path>]` prints the tables; `--json <path>` writes them as JSON too. `node scripts/issues-by-finder.js --exp <topic> [--docs <paths…>] [--inputs <paths…>] [--adr <paths…>]` runs the criterion note's `exp-` recipe. A multi-path option takes every following argument up to the next one that opens `--`, and may take none: `--adr` with no path is an empty ADR list. Exit `0` on a completed run; exit `1` with one `stderr` line when the issues directory does not exist, an explicitly named path does not exist, an option is unknown, or `--exp` has no topic.
- **The by-finder count.** For every `*.md` issue under `<docs>/<status>/` for each named status, read the `Source:` line — the body's first non-empty line after the frontmatter, CRLF normalized:
  - `inbox <date>-<slug>` → finder `inbox`; `session <date>` → `session`; `hotfix <subject>` → `hotfix` — each with topic `—`;
  - no `Source:` line → finder `no source`, topic `—`;
  - `shoroku <topic>` with no `S-<n>` → finder `shoroku (unnumbered)`, topic `<topic>`;
  - `shoroku <topic> S-<n>` → open `<tanto>/<topic>/kanri.md` and find the row whose first cell is `S-<n>` anywhere in the file — the heading is never the locator, since older ledgers head the table `## Shoroku candidates` with a `Candidate` column and newer ones `## Shoroku proposal items`; the Source cell is the row's second cell (cells split on unescaped `|`, trimmed). When the cell opens `carried from <other topic> S-<m>`, follow it once to that topic's ledger row `S-<m>` and use its Source cell; when it opens `carried from roster-S-<m>`, use the text after its first `: `. Follow once only. A topic with no `<tanto>/<topic>/kanri.md`, or a row id the file does not hold, → finder `unresolved`.
  - The cell is mapped to a finder by the first pattern that matches, in this order, each a case-insensitive substring (a `*` in a pattern matches any run of non-space characters):
    `batch-shusei`, `shoki` → `close`;
    `batch-*-report.md`, `shoroku-proposal-jisso-`, `shoroku-proposal.md` → `jisso`;
    `batch-*-verdict.md` → `boundary`;
    `branch-review` → `branch reviewer`;
    `spec-review.md` → `spec reviewer`;
    `plan-review`, `coldread.md`, `plan-dryrun` → `plan reviewer`;
    `shoroku-proposal-sekkei-`, `exit-sekkei-proposal`, `the spec`, `spec §`, `docs/superpowers/specs/`, `spec-draft` → `sekkei`;
    `shoroku-proposal-keikaku-`, `exit-keikaku-proposal` → `keikaku`;
    `shoroku-proposal-kanri-`, `exit-kanri-`, `Kanri's own`, `kanri-handover` → `kanri`;
    `kaiseki-` → `kaiseki`;
    `.tanto/kikaku/`, `Kikaku decision` → `kikaku`;
    `inbox` → `inbox`;
    `human word` → `human`;
    anything else → `unmapped (<the cell's first 40 characters>)`.
- **The output on `stdout`**, Markdown: one section per topic, `## By finder — <topic>` (topics sorted, `—` last), a table `| Finder | Issues |` sorted by count descending then finder name; then `## Totals`, a table of topic × finder — rows the topics, columns the finders in the mapping order above followed by `session`, `hotfix`, `shoroku (unnumbered)`, `no source`, `unresolved`, `unmapped` (every `unmapped (…)` label summed into `unmapped`), each column present only when some topic has a count in it, a `Total` column, and a last row `| Total | … |`; then `## Source kinds`, a table of `shoroku`, `session`, `inbox`, `hotfix`, `no source` with their counts; then the coverage paragraph — the attributable share, the issues whose `Source:` names an `S-<n>` row, as `Attributable: <k> of <N> issues (<p>%) name an S-<n> ledger row and reach a finder through it; the by-finder table reads only the topics whose issues carry one.`, with the count of those that came out `unresolved`; and as the last line `issues counted: <N>`. Every `|` inside a cell is written `\|`.
- **`--json <path>`** writes `{statuses, total, perTopic: {<topic>: {<finder label>: n}}, totals: {<topic>: {<finder column>: n}}, sourceKinds: {<kind>: n}, attributable: {count, total, share}}`.
- **The `exp-` count**, `--exp <topic>`. The documents side, by default: the files in `docs/superpowers/specs/` and `docs/superpowers/plans/` named `<YYYY-MM-DD>-<topic>-design.md` or `<YYYY-MM-DD>-<topic>.md`, `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md`, plus the `--adr` paths; `--docs` replaces the default list (the `--adr` paths still add). The inputs side, by default: `.tanto/<topic>/dialogue.md`, `.tanto/<topic>/spec-inputs.md`, and every `.tanto/kikaku/<name>.md` path the topic's spec text names; `--inputs` replaces it. A default path that does not exist is skipped and named on a `skipped:` line. The documents side collects only prefixed references, `exp-[0-9a-f]{4}` — exactly the note's `grep -o 'exp-[0-9a-f]\{4\}'` — never bare ids, which would sweep issue and decision ids in; the inputs side collects prefixed references and bare four-hex words (`\b[0-9a-f]{4}\b`), since a human writes `27e8` without the prefix. The comparison is by bare id. It prints `documents: <paths>`, `inputs: <paths>`, `documents ids (<n>): <ids>`, `inputs ids (<m>): <ids>`, `unprompted (<k>): exp-<id> …`, and as the last line `unprompted: <k>`.

- [ ] **Step 1: Write the failing tests**

Create `scripts/issues-by-finder.test.js` (`node:test`, `node:assert/strict`), every fixture under `fs.mkdtempSync(path.join(os.tmpdir(), "issues-by-finder-"))` and every run with `--docs <tmp>/docs/issues --tanto <tmp>/.tanto` or with `cwd` the temporary directory:

1. Each `Source:` form: issue files under `open/`, `deferred/`, and `resolved/` with `inbox 2026-01-01-x`, `session 2026-01-01`, `hotfix fix the thing`, `shoroku t1` (no row), `shoroku t1 S-1`, and one with no `Source:` line — finders `inbox`, `session`, `hotfix`, `shoroku (unnumbered)`, the row's finder, and `no source`; topics `—` for the first three and the last.
2. Both table headings: ledger `t1` heads its table `## Shoroku candidates` with columns `| S-n | Source | Candidate | … |`, ledger `t2` heads it `## Shoroku proposal items` with `| S-n | Source | Item | … |`; a row of each resolves.
3. The `carried from` hops: a `t2` row whose Source cell is `carried from t1 S-2: …` resolves to `t1` S-2's finder; a row whose cell is `carried from roster-S-4: Kikaku decision \`x.md\`` maps to `kikaku`; a hop is followed once only.
4. Every finder pattern once: `mapFinder` over one cell per pattern of the ordered list (`batch-shusei-report.md`, `shoki brief`, `batch-B-report.md`, `shoroku-proposal-jisso-ab.md`, `shoroku-proposal.md`, `batch-C-verdict.md`, `branch-review.md`, `spec-review.md`, `plan-review.md`, `coldread.md`, `plan-dryrun.md`, `shoroku-proposal-sekkei-ab.md`, `exit-sekkei-proposal.md`, `the spec §2`, `spec § 3`, `docs/superpowers/specs/x.md`, `spec-draft.md`, `shoroku-proposal-keikaku-ab.md`, `exit-keikaku-proposal.md`, `shoroku-proposal-kanri-ab.md`, `exit-kanri-x.md`, `Kanri's own observation`, `kanri-handover.md`, `kaiseki-report.md`, `.tanto/kikaku/x.md`, `Kikaku decision`, `inbox 2026-01-01-x`, `human word`) gives the finder the list names, and `batch-shusei-report.md` gives `close`, not `jisso` (the first match wins).
5. `unmapped` and `unresolved`: a cell `Destination words only` gives `unmapped (Destination words only)`; `shoroku gone-topic S-1` with no ledger and `shoroku t1 S-99` past the table's end give `unresolved`.
6. The totals: the grand total, the last line `issues counted: <N>`, and `--json`'s `total` all equal the fixture's issue count across the three directories; a `|` in an unmapped cell is escaped in the table.
7. `--exp`: a fixture `docs/superpowers/specs/2026-01-01-t-design.md` citing `exp-aaaa`, `exp-bbbb`, `exp-cccc` and the bare issue id `dddd` and naming `.tanto/kikaku/k.md`; a plan `docs/superpowers/plans/2026-01-01-t.md` citing `exp-eeee`; `.tanto/t/dialogue.md` holding the bare `aaaa`; `.tanto/kikaku/k.md` holding `exp-bbbb` — `unprompted` is exactly `cccc` and `eeee`, the bare `aaaa` in the dialogue cancels the prefixed one in the spec, and `dddd` is not counted; `--adr` with no path is accepted; a missing default `review-brief-plan.md` is on the `skipped:` line.
8. The exit codes: `0` for each run above; `1` with one `stderr` line for `--docs <tmp>/no-such-dir` and for `--exp` with no topic.

- [ ] **Step 2: Run the suite and see the new tests fail**

```bash
# tree-state
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
if node --test --test-reporter=tap 'scripts/*.test.js' >/dev/null 2>&1; then echo 'the suite passed before Step 3'; exit 1; fi
echo 'the new tests fail, as they must before Step 3'
```

Expected: the Node version, then the last line.

- [ ] **Step 3: Write `scripts/issues-by-finder.js`**

Implement the behavior above, CommonJS, `node:` built-ins only, no shebang.

- [ ] **Step 4: Run the suite and see it pass, and run the counter on the tree**

```bash
# tree-state
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
out=$(node --test --test-reporter=tap 'scripts/*.test.js' 2>&1); s=$?
p=$(printf '%s\n' "$out" | sed -n 's/^# pass \([0-9][0-9]*\).*/\1/p')
f=$(printf '%s\n' "$out" | sed -n 's/^# fail \([0-9][0-9]*\).*/\1/p')
printf 'pass %s fail %s\n' "$p" "$f"
[ "$s" = 0 ] && [ "${f:-1}" = 0 ] && [ "${p:-0}" -ge 26 ] || { printf '%s\n' "$out" | tail -40; exit 1; }
n=$(node scripts/issues-by-finder.js | tr -d '\r' | sed -n 's/^issues counted: \([0-9][0-9]*\)$/\1/p')
all=$(ls docs/issues/open docs/issues/deferred docs/issues/resolved | grep -c '\.md$')
printf 'issues counted %s, issue files %s\n' "$n" "$all"; [ "$n" = "$all" ] || exit 1
```

Expected: `pass N fail 0` with N at least 26 (Tasks 1 and 2 left at least 18), then two equal counts.

- [ ] **Step 5: Lint and commit the two scripts**

```bash
# tree-state
./scripts/lint.sh scripts/issues-by-finder.js scripts/issues-by-finder.test.js || exit 1
trailer='Co-Authored-By: Claude <noreply@anthropic.com>'
git add -- scripts/issues-by-finder.js scripts/issues-by-finder.test.js || exit 1
git commit --only -m "feat(scripts): issues-by-finder — issues per topic by finder, and the exp- count" -m "$trailer" -- scripts/issues-by-finder.js scripts/issues-by-finder.test.js || exit 1
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
git log -1 --format=%s
```

Expected: the subject. After a lint auto-fix, run the step again and re-run Step 4.

- [ ] **Step 6: Insert the note's sentence**

The spec places the sentence both "at the end of its 'Primary' paragraph" and "after `…into docs/notes/tanto-measured-data-points.md.`"; these disagree, since the paragraph's last sentence is the bold fold-back signal. This plan takes the quoted anchor: the new sentence goes **directly after the sentence ending `…tanto-measured-data-points.md``.`**, before the bold `**Zero across three consecutive topics is the fold-back signal**`, because it continues the "run by hand at the close" thought. The command is written in backticks — the spec's quoted form is unbackticked, and a bare `<topic>` may fire markdownlint's inline-HTML rule. The sentence, exactly:

```text
The same count is one command, `node scripts/issues-by-finder.js --exp <topic>`, whose by-finder table is taken at the same moment and written beside it.
```

The note is CRLF in the working tree. Check its ending first, then edit it with the Edit tool, which keeps the file's ending. The line reads ``precedes the close, into `docs/notes/tanto-measured-data-points.md`. **Zero``; insert the sentence and one space between the space that follows ``data-points.md`.`` and `**Zero`, on the same line — no line break inside the inserted text, so no bare LF enters the file.

```bash
# tree-state
git ls-files --eol -- docs/notes/experience-layer-exit-criterion.md
```

Expected, before and after the edit: `i/lf    w/crlf  attr/text=auto` and the path.

- [ ] **Step 7: Verify the sentence, its neighbors, the ending, and lint**

```bash
# tree-state
f=docs/notes/experience-layer-exit-criterion.md
s='The same count is one command, `node scripts/issues-by-finder.js --exp <topic>`, whose by-finder table is taken at the same moment and written beside it.'
n=$(grep -cF -- "$s" "$f" || true); printf 'the sentence: %s\n' "$n"; [ "$n" = 1 ] || exit 1
n=$(grep -cF -- 'into `docs/notes/tanto-measured-data-points.md`. The same count is one command,' "$f" || true); printf 'after the anchor: %s\n' "$n"; [ "$n" = 1 ] || exit 1
n=$(grep -cF -- 'written beside it. **Zero' "$f" || true); printf 'before the fold-back sentence: %s\n' "$n"; [ "$n" = 1 ] || exit 1
n=$(grep -cF -- 'across three consecutive topics is the fold-back signal**' "$f" || true); printf 'fold-back signal: %s\n' "$n"; [ "$n" = 1 ] || exit 1
n=$(grep -cF -- 'Until a tanto topic gives' "$f" || true); printf 'the by-hand sentence: %s\n' "$n"; [ "$n" = 1 ] || exit 1
git ls-files --eol -- "$f" | grep -q 'w/crlf' || { git ls-files --eol -- "$f"; exit 1; }
./scripts/lint.sh "$f"
```

Expected: every count `1`, then every hook passes. The by-hand sentence ("Until a tanto topic gives that count … it is run by hand at the close") wraps in the file, so the grep takes its first words only.

- [ ] **Step 8: Commit the note**

```bash
# tree-state
trailer='Co-Authored-By: Claude <noreply@anthropic.com>'
git commit --only -m "docs(notes): name the exp- count command in the exit criterion" -m "$trailer" -- docs/notes/experience-layer-exit-criterion.md || exit 1
git ls-files --eol -- docs/notes/experience-layer-exit-criterion.md
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
git log -1 --format=%s
```

Expected: `i/lf    w/crlf  attr/text=auto` with the path, and the subject.

### Task 17: The dogfood report

**Files:**

- Create: `docs/reports/<YYYY-MM-DD>-tanto-issue-triage-dogfood.md`, `<YYYY-MM-DD>` the day it is written (`date +%F`).

**Interfaces:**

- Consumes: `.tanto/tanto-issue-triage/liveness.json`, `instrument-figures.txt` and `round-files.txt` (Task 3); every `triage-R<part>-recommendation.md` (Tasks 4 to 13) and `triage-R<part>-direction.md` (Kanri); every `apply-R<part>-list.tsv` (Tasks 14 and 15); the apply commits; `scripts/issues-by-finder.js` (Task 16); the ledger `.tanto/tanto-issue-triage/kanri.md`.
- Produces: the frozen report.

**The type rules** (`docs/reports/AGENTS.md` — read it first): the path `docs/reports/<YYYY-MM-DD>-<slug>.md` with an English kebab-case slug; **no frontmatter**; the `# H1` is the title and the leading paragraph states the scope; **the date lives only in the file name** — no `Investigation date:` line, no date field; cited by path; append-only once committed. American English.

**The content** — spec section 6's list, item by item, each with the command or file its figure comes from named in the report beside it:

1. The instrument's `meta` figures — the pile's size, the verdict counts, the counts per round file, the wall time: `liveness.json` element 0 and `instrument-figures.txt`.

```bash
# tree-state
node -e 'console.log(JSON.stringify(require("./.tanto/tanto-issue-triage/liveness.json")[0].meta, null, 2))' || exit 1
cat .tanto/tanto-issue-triage/instrument-figures.txt
```

2. A table round file × destination, from the directions as applied: the effective destinations in each `apply-R<part>-list.tsv`, cross-checked against the apply commits' subjects.

```bash
# tree-state
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do printf 'R%s: ' "$p"; cut -f3 "$d/apply-R$p-list.tsv" | sort | uniq -c | awk '{printf "%s %s; ", $2, $1}'; echo; done
git log --format=%s "$(git merge-base main HEAD)..HEAD" | grep '^docs(issues): triage round ' || exit 1
```

3. The Assigned counts per carrier topic:

```bash
# tree-state
git grep -h -o -E 'Assigned to [a-z0-9-]+ \(tanto-issue-triage' -- docs/issues | sort | uniq -c
```

4. The Merged carriers and what each carries:

```bash
# tree-state
git grep -n -E '^Carries issue-[0-9a-f]{4}' -- docs/issues || echo 'no carrier'
```

5. The full list of Wants no scene states, by issue id and clause, for a later run to write into scenes at the human's word — from every recommendation's `## Wants no scene states` section, each bullet with its round file; an issue whose effective destination ended other than Kept is listed with that destination noted.

```bash
# tree-state
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do awk -v p="$p" '{sub(/\r$/, "")} /^## / {s = $0; next} s == "## Wants no scene states" && /^- issue-/ {print "R" p ": " $0}' "$d/triage-R$p-recommendation.md"; done
```

6. The by-finder tables as of that day, with the attributable share beside them: `node scripts/issues-by-finder.js`, copied whole.

```bash
# tree-state
node scripts/issues-by-finder.js
```

7. The `--exp tanto-issue-triage` output over the spec, the plan, and the two review briefs, ADRs excluded since none exists before the close:

```bash
# tree-state
node scripts/issues-by-finder.js --exp tanto-issue-triage --adr
```

8. The instrument's agreement with the working note's placements, with its denominator, and the count of `no commit found` rows: `instrument-figures.txt` (item 1's output).
9. The number of items the human changed from the recommendation, per round file: the item lines of each direction.

```bash
# tree-state
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do n=$(grep -cE '^[0-9]+ — ' "$d/triage-R$p-direction.md" || true); printf 'R%s: %s changed\n' "$p" "$n"; done
```

10. How long each sitting waited: each direction file's header (its route and its date, and its time when it carries one) against the time of the boundary that opened the sitting in `.tanto/tanto-issue-triage/kanri.md` (its Batches rows and Progress lines), with the verdict file's modification time as a second source when the ledger carries a date only. The report states the precision the sources allow.

```bash
# tree-state
d=.tanto/tanto-issue-triage
for p in $(tr -d '\r' < "$d/round-files.txt"); do printf '== R%s\n' "$p"; sed -n '1,4p' "$d/triage-R$p-direction.md"; done
grep -n -E '^\| [A-Z]' "$d/kanri.md" | head -20
ls -l --time-style=+%F_%T "$d"/batch-*-verdict.md 2>/dev/null || echo 'no verdict file found'
```

The scope paragraph says what the report records — the triage of the issue pile by the liveness instrument, rounds and sittings, and the apply — and that it is where the decision file's question on the 09c2 ordering "returns at the triage's close with numbers": the Assigned counts per carrier of item 3 are those numbers.

- [ ] **Step 1: Gather the figures**

Run the ten fences above and keep their output.

- [ ] **Step 2: Write the report**

Write `docs/reports/<YYYY-MM-DD>-tanto-issue-triage-dogfood.md` with the `# H1`, the scope paragraph, and one `##` section per item group, with exactly these headings: `## The instrument`, `## Rounds and destinations`, `## Assigned and Merged`, `## Wants no scene states`, `## Issues by finder`, `## Unprompted exp- ids`, `## The working note and the traces`, `## The human's changes and the sittings`, each figure beside the command or file it came from.

- [ ] **Step 3: Verify the report's form and lint it**

```bash
# tree-state
f=$(ls docs/reports/*-tanto-issue-triage-dogfood.md) || exit 1
printf '%s\n' "$f"
head -1 "$f" | grep -q '^# ' || { echo 'the first line is not the H1'; exit 1; }
if head -1 "$f" | grep -q '^---'; then echo 'frontmatter is not allowed'; exit 1; fi
if grep -qi 'investigation date' "$f"; then echo 'the date belongs only in the file name'; exit 1; fi
for h in 'The instrument' 'Rounds and destinations' 'Assigned and Merged' 'Wants no scene states' 'Issues by finder' 'Unprompted exp- ids' 'The working note and the traces' "The human's changes and the sittings"; do c=$(grep -cxF -- "## $h" "$f" || true); printf '%s: %s\n' "$h" "$c"; [ "$c" = 1 ] || exit 1; done
./scripts/lint.sh "$f"
```

Expected: the path, each of the eight headings once, and every hook passing.

- [ ] **Step 4: Commit by explicit path, then restore the line ending**

A Markdown file created fresh lands `w/lf` on this host; the restore after the commit rewrites it in the working tree's ending (`git checkout -- <path>`, the repository's rule, measured five of five).

```bash
# tree-state
f=$(ls docs/reports/*-tanto-issue-triage-dogfood.md) || exit 1
trailer='Co-Authored-By: Claude <noreply@anthropic.com>'
git add -- "$f" || exit 1
git commit --only -m "docs(reports): tanto-issue-triage dogfood" -m "$trailer" -- "$f" || exit 1
touch "$f"; git checkout -- "$f" || exit 1
git ls-files --eol -- "$f"
git ls-files --eol -- "$f" | grep -q 'w/crlf' || exit 1
test -z "$(git status --porcelain)" || { git status --porcelain; exit 1; }
git log -1 --format=%s
```

Expected: `i/lf    w/crlf  attr/text=auto` with the path, and the subject.

## Self-Review

**Spec coverage.** Spec section 1 → Tasks 1, 2 (the instrument) and Task 3 (the run); section 2 → Tasks 4 to 13 (one per round file); section 3 → Global Constraints ("The sittings…") and Batches; section 4 → Tasks 14, 15; section 5 → Task 16; section 6 → Task 16 (the note's sentence) and Task 17 (the report); "What the plan must contain" → Global Constraints, Batches, and How a batch is verified, each bullet; "Verification" → How a batch is verified and each task's own Verify; "Out of scope" → Global Constraints, "What is never edited".

**Size.** The largest tasks by lines are the ten round tasks, 199 to 201 lines each and seven steps, identical but for the round file (they carry spec section 2 whole, as the spec asks; Task 5 and Task 4 each carry one more paragraph); the largest by steps is Task 14, 189 lines and nine steps, which Task 15 reuses by citation (36 lines). The instrument is split across Tasks 1 and 2 (124 and 117 lines, six steps each) so that neither implementer carries the whole script and its tests. **Sweep-and-check shape:** Task 3 is one — its deliverable is recorded output (the run's seven untracked files and the figures its batch report carries), and so is Task 17's (the report is the recorded figures, each beside its command); Tasks 4 to 13 write two untracked files each from a judgment and have no recorded-output deliverable, and Tasks 14 and 15 deliver edits whose text exists only at run time. No threshold is set; the sizes are recorded (issue-7281).

**Where this plan departs from the spec, and why.**

1. **Five batches, not four; three recommend sittings, not two.** With a round above fifty issues split in two by the instrument, the spec's own halves would hold five round files each, over the three or four tasks a batch carries; the spec allows "a further batch when a split round pushes a half past four" and says that batch's boundary is a sitting too. So B holds rounds 1 and 2, C rounds 3 and 4, D rounds 5 and 6, cut at whole rounds, and the apply is batch E, not the spec's D. The human approved two sittings of about 150 lines (Q-3) and the review brief's unsettled point took "a split adds a sitting" by default; three sittings of about 100 lines is that rule applied twice, and the human may answer them in one sitting by answering all three.
2. **Batch A is three tasks, not two.** The spec's Task 1 (the whole instrument with its tests) is split into Tasks 1 and 2, and the run is Task 3. The spec's "Tasks 11 and 12" numbering (the counter and the report) is Tasks 16 and 17 here.
3. **Task 5 is a conditional slot.** The round files are known only after Task 3's run, and the spec's remark that Keikaku plans batches "from the files Task 2 produced" cannot be met before the run. Measured at drafting from the titles alone, with the whole-word rule for terms of five characters or fewer, the rounds were R1 50, R2 79, R3 28, R4 64, R5 25, R6 62 of 308 (`ls docs/issues/open docs/issues/deferred | grep -c '\.md$'`); the spec review measured R1 61, R2 76, R3 33, R4 58, R5 26, R6 54. Rounds 2, 4 and 6 are above fifty and rounds 3 and 5 below it under both counts; round 1 is on the border, 50 under mine and 61 under the review's. So the plan has tasks for ten round files and Task 5 is void when round 1 is not split; Task 3 stops on any other list.
4. **The commit recipe.** The spec writes `git commit --only -- <paths> -m "…"`, which hands `-m` and the message to git as pathspecs (S-49). The recipe here puts the message before `--`, names both sides of every rename (issue-9350), and carries the `Co-Authored-By:` trailer `AGENTS.md` requires. `git diff-tree -r --name-status`, which the spec's verification uses, prints no `R` lines without `-M`; the plan uses `-M20%`, because the default 50% can read a short issue file as a delete and an add.
5. **The note's sentence.** The spec places it both "at the end of its 'Primary' paragraph" and "after `…into docs/notes/tanto-measured-data-points.md.`"; the paragraph's last sentence is the bold fold-back signal, so these differ. Task 16 takes the quoted anchor — directly after that sentence, before the bold one — and writes the command in backticks, which the spec's quoted form lacks.
6. **No root Markdown or agent-instruction file is edited by the apply.** The spec's allowed path set names the root Markdown files; `AGENTS.md`'s "Never do" protects them. Measured at drafting, no living document outside `docs/issues/` holds an issue path (`git grep -E 'docs/issues/(open|deferred)/[0-9a-f]{4}'` outside `docs/issues`, `docs/reports`, `docs/decisions`, `docs/superpowers` finds the frontmatter checker's own test only), so none is expected; if one appears, Tasks 14 and 15 leave it and report it. The old-path greps (Task 14 Step 7 and boundary block 6) therefore name only living documents under `docs/`, so that the left link does not fail them; the spec's list there names the root files too.
7. **Readings the spec left open**, each stated in the task that applies it: `counts.none` is the items in state `partly` (Task 1); a missing or unwritable `--out` exits 1 (Task 1); the deleted-path trace reads `<ref>`, not `--all` (Task 1); a split is cluster order, then id, the first `ceil(n/2)` rows going to `<n>a` (Task 2); a direction's `[<target>]` is accepted with or without brackets, and an unknown destination word or an invalid target is `unclear` (Tasks 14 and 15); a Carries line keeps the date it was first written (Task 14); the finder patterns match case-insensitively as substrings (Task 16); `--adr` accepts no path (Task 16).

**Counts re-run, not copied.** The pile (308), the round sizes (item 3), the rooted and skill-relative path-token figures and the 240 note-placed issues are the spec's own measurements and are not relied on: Task 3 measures the first and the last again and prints the denominators it reads, and every other number a task needs is computed from the liveness files by the task's own Verify.

**Verified at drafting.** Every `bash` fence of this plan passes `bash -n`; the blocks under "How a batch is verified" were run by `boundary` against the checkout as it stands (each exits `0`, printing that its phase has not landed), and the round-form block and the apply-path block were run against fixtures that satisfy them and against variants that break a check (a wrong brief tag and a mismatched `See:` heading each exit `1`; a commit that edits `README.md` exits `1`; a CRLF fixture passes). Task 3's note parse was run against the real working note by the drafter. The dry run is `.tanto/tanto-issue-triage/plan-dryrun.md`.
