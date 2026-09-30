# experience-layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the goal layer from `docs/requirements/` into `docs/experience/` — scenes, expectations with RFC 2119 strength and a trust tag, and the maintainer's own words in `## Sources` — in kisou's shipped templates and instrument and as shoroku's fourth extraction target, then migrate this repository's five requirement files into it through a recommend, human-check, apply cycle run inside the plan.

**Architecture:** Every edit to an existing file is a passage re-quoted from the live tree; the type rules, the hub skeleton, this repository's hub and the exit-criterion note are new files written whole. The installed doc-system copies are not written from blocks: kisou's own instrument regenerates them from the edited templates, in the one hook-guarded commit that also changes its type list and tests. What the run decides — the seven scenes' ids, the recommender's classification, the human's direction, the `req-` targets — is carried as rules, dispatch texts, and checks rather than passages. Batch A lands the doc-system; batch B the two skills, the hub and the seven scenes; batch C dispatches the recommender and waits for the human; batch D dispatches the apply, edits the design side, removes `docs/requirements/`, and reports.

**Tech Stack:** Markdown; Node 22 or later for `skills/kisou/scripts/doc-system-check.js` and its `node:test` suite, run as the quoted glob; `uv run --no-project --with pyyaml python` for every YAML load and for `scripts/check_md_frontmatter.py`; `./scripts/lint.sh <paths>` (`scripts\lint.bat <paths>` on Windows) runs pre-commit on the paths named — it takes file paths, never a directory; `node "$TANTO/scripts/passage-check.js"` verifies the passages.

**Spec:** `docs/superpowers/specs/2026-09-30-experience-layer-design.md` — committed on this branch and accepted (the human's answers are D-1 to D-10 in `.tanto/experience-layer/dialogue.md`). The plan argues from the spec; executors read both. The spec's batches B and C are this plan's C and D (Batches).

**`$TANTO`** is the tanto skill's own directory, as `SKILL.md`'s Start sequence sets it for the session running a command — normally `$CLAUDE_CONFIG_DIR/skills/tanto`, or `~/.claude/skills/tanto` when that variable is unset. Every fenced block below that runs it sets it inline, so no command depends on a shell that already has it exported.

**Old texts** were re-quoted from the working tree on branch `experience-layer` at drafting — the tree clean at the spec's last commit — and not copied from the spec. Every fenced old block was read out of the live file, and each one was applied to a scratch copy of the tree to confirm it occurs exactly as often as its lead says; every `O` needle's count below was run against the tree, not asserted. The needles are single-line forms, since a needle that wraps in its target returns `0` and reads as "already gone", and none contains a backtick, which the lead's own syntax forbids: where the changed word sits inside backticks on every line that carries it, the task says so and its block's `verify` is the check. See Self-Review for the facts that did not match the spec's expectation.

## Global Constraints

- **AGENTS.md.** Every commit follows the repo's `AGENTS.md`: run `./scripts/lint.sh` (`scripts\lint.bat` on Windows) on the changed paths, relative to the repo root — file paths, never a directory (issue-5050) — and fix issues before committing; commit by explicit path with `git commit --only <paths>` — the index is shared, so a new file needs `git add <path>` first; end every commit message with a `Co-Authored-By:` trailer naming the agent that made it; never `git add -A`/`.`/`-u`, a bare `git commit`, or `git commit -a`; never bypass a commit or push hook (`--no-verify`, `-n`); never amend a published commit; never push to `origin/main`. This plan lands its commits on the `experience-layer` branch; the merge to `main` is the human's decision at the topic's close (the kessai), not a step of this plan.
- **Approvals on record.** The agent-instruction files this plan rewrites — `skills/kisou/templates/docs/AGENTS.md` and the four `skills/kisou/templates/docs/<type>/AGENTS.md`, the new `skills/kisou/templates/docs/experience/AGENTS.md`, and their installed copies `docs/AGENTS.md`, `docs/design/AGENTS.md`, `docs/decisions/AGENTS.md`, `docs/issues/AGENTS.md`, and the new `docs/experience/AGENTS.md` — are rewritten under the human's answers to the spec's review brief (`all OK`, recorded as D-10 in `.tanto/experience-layer/dialogue.md`). The repository-root `README.md` line 54 and `CONTRIBUTING.md` lines 24, 35–36, and 43 are edited in batch D under the human's Q4 answer 「承認する」 (D-9). **Nothing else** in the "Never do" list is edited: not `CLAUDE.md`, not the root `AGENTS.md`, not `.markdownlint-cli2.yaml`, `.pre-commit-config.yaml`, or any other linter or formatter config, not `CHANGELOG.md`, not `scripts/check_md_frontmatter.py`.
- **Not yours to discard.** A modification in the shared tree that you, or a subagent you dispatched, did not make is not yours to discard — report it, one line naming the file and what changed, rather than running `git checkout --` or `git clean` on your own judgment. Only Kanri decides whether it is stray (Rule 5). The one exception is the line-ending restore this plan writes into a task's own steps, which names its own path.
- **Model families**, read from `templates/tanto.json` in the tanto skill's own directory, merged with this repository's `.claude/tanto.json`, at this plan's drafting. The project layer overrides only `sessions.kikaku` and `sessions.sekkei`, neither of which is a subagent kind, so every kind below is the built-in default. Every dispatch you make names both a `subagent_type` and a `model` together — an omitted `model` inherits your own session's, which is not what these kinds are pinned to:

  | Kind | `subagent_type` | Model | Effort |
  | --- | --- | --- | --- |
  | `task.implement` (fix rounds 1-3) | `tanto-task-implement` | sonnet | high |
  | `task.escalate` (fix rounds 4-5, one tier above the implementer that got stuck) | `tanto-task-escalate` | opus | high |
  | `task.review-spec` | `tanto-task-review-spec` | opus | medium |
  | `task.review-quality` | `tanto-task-review-quality` | opus | medium |
  | `shoroku.recommend` (Task 5 only) | `tanto-shoroku-recommend` | fable | high |
  | `shoroku.apply` (Task 6 only) | `tanto-shoroku-apply` | opus | medium |
  | `default` (an ad-hoc search outside the SDD loop) | `tanto-default` | sonnet | medium |

- **Contract rule 11 does not bind this plan.** No task edits a file under `skills/tanto/`, so no role file is half-edited mid-run and a role may be started or replaced at any boundary. The two skills this plan does edit, `skills/kisou/SKILL.md` and `skills/shoroku/SKILL.md`, land in batch B, before Task 5 (batch C) dispatches the shoroku recommender: that dispatch runs the skill as batch B left it, on purpose.
- **The hook-guarded set is one commit.** The pre-commit hook `kisou-doc-system-check` (`node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case`) runs on any commit that touches `skills/kisou/templates/docs/`, `skills/kisou/scripts/doc-system-check.js`, `docs/AGENTS.md`, or a `docs/<type>/AGENTS.md`, and fails on drift between a template and its installed copy. So Task 1 lands the templates, the `TYPES` line and the tests, and the installed copies in **one commit**, and no other task commits a file from that set before Task 1 has. `docs/requirements/AGENTS.md` and the rest of `docs/requirements/` are **not edited** before Task 8; the check ignores it once `requirements` leaves `TYPES`.
- **Batch D is not spawned until `.tanto/experience-layer/migration-direction.md` exists.** Batch C is one task, the recommend run. Its boundary waits for the human: Kanri checks the migration brief's form as at a close, writes an `attention` request whose message is `kessai: experience-layer migration — claude attach <id>`, puts the one question — the recommendation's and the brief's paths and the counts — in its own window, and writes `migration-direction.md` from the human's answer, given in Kanri's window or through a live Hosa's `kessai answer:` relay. Kanri dispatches nothing at that boundary but its own form check: **the batch C Jisso, not Kanri, dispatches the recommender, and the batch D Jisso, not Kanri, dispatches the apply.**
- **The two dispatches are carried verbatim in their tasks** (Fixed input 17, spec section 9, What the plan must contain): Task 5 dispatches the shoroku skill's recommend mode on the `shoroku.recommend` kind — `subagent_type: tanto-shoroku-recommend`, `model` from the merged `tanto.json`'s `subagents.shoroku.recommend` (`fable` today) — with the spec's dispatch text quoted whole (the sources, the baseline, the pointer word `experience-layer`, the per-sentence questions, the two derived item kinds, the final ids, the output and brief paths with the brief's two path names rendered as this run's). Task 6 dispatches the apply mode likewise — `tanto-shoroku-apply`, `model` from `subagents.shoroku.apply` (`opus` today) — with the recommendation, the direction, and the subject `docs: fold requirements into experience`. Each dispatch names the file it writes, says the agent writes it in its own turn, and forbids it from dispatching agents of its own; the Jisso verifies the file, not the reply.
- **The input file is read and never committed.** `.tanto/kikaku/2026-09-15-shoroku-experience-input.md` (and the decision file `.tanto/kikaku/2026-09-15-experience-layer.md`) are read by tasks 4, 5 and 6 and are never committed, copied whole, moved, or deleted. What reaches a tracked file from them is the hub's Cast, Drivers, and Won't and the scenes' Scene and Expectations text, which spec sections 1 and 3 take from the input §1, and what the scenes' `## Sources` sections quote from §4 and the decision file §11, item by item — nothing else.
- **`git mv` names both paths.** Every issue move (`open/` → `resolved/`) is `git mv <old> <new>`, `updated:` bumped, committed with both the old and the new path named under `git commit --only` (issue-9350).
- **The test command and its runtime.** The kisou suite is run as `node --test --test-reporter=tap 'skills/kisou/scripts/*.test.js'` — the quoted glob, never the directory form, which fails on this host (issue-235b, measured again by the spec review). It needs Node 22 or later (`CONTRIBUTING.md`, Prerequisites); this host measured v24.16.0 at drafting. Every task that runs it prints `node --version` first, so a version claim is a run and not an assertion. The suite counted 57 tests before this plan.
- **No ADR body, no dated report, no `CHANGELOG.md`, and nothing under `docs/superpowers/` is edited.** `docs/requirements/`'s five files are a read-only source until Task 8 removes the directory.
- **Named-mechanism rule for tasks.** A task that introduces or changes a named mechanism — the trust tags, the `exp-` reference, the hub, the item id, the `Source:` line, the pointer word `experience-layer`, the `TYPES` list — lists in its own text every other site in this plan's files, and in the repository files this plan touches, that names the same mechanism, so that its reviewer checks them together.
- **Line-ending rule for tasks.** A task that creates a Markdown file and later checks its line endings writes the restore — `git checkout -- <path>` after the commit — into the task's own steps, not only into the stop condition: a file written fresh lands `w/lf` on this host every time. The installed copies are compared with their templates CRLF-folded, so the restore does not change the hook's verdict.
- **Reports and prompts follow the tanto templates.** No skeleton for a batch report, a batch prompt, or a review brief appears in this plan; the templates in the skill directory are the skeletons. The one exception is the migration brief, which is rendered from `templates/shoroku-brief.md` with the two path names overridden, as Task 5 says.

Lines that `replay` and `boundary` read at column 0:

```text
replay-skip: # tree-state — a fence that carries this comment reads the live tree, the untracked .tanto/ files, git, the linter, or the tests; the applied scratch tree, a set of copied blobs, holds none of them. A task fence that needs any of those opens with the comment; the fences under "How a batch is verified" never carry it, because boundary honors the same pattern
created: skills/kisou/templates/docs/experience/AGENTS.md
created: skills/kisou/templates/docs/experience.md
created: docs/experience/AGENTS.md
created: docs/notes/experience-layer-exit-criterion.md
```

## File structure

| File | What this plan does to it | Tasks |
| --- | --- | --- |
| `skills/kisou/templates/docs/experience/AGENTS.md` | **new** — the type rules, spec section 2 | 1 |
| `skills/kisou/templates/docs/requirements/AGENTS.md` | **deleted** | 1 |
| `skills/kisou/templates/docs/AGENTS.md` | the type table and its addendum, the `<id>` bullet, Cross-references and the legacy sentence, the flat-types paragraph, Session shoroku steps 1 to 3 | 1 |
| `skills/kisou/templates/docs/design/AGENTS.md` | the pairing bullet | 1 |
| `skills/kisou/templates/docs/decisions/AGENTS.md` | issue-c477's exception, issue-a9c3's sentence, the optional `## Sources` | 1 |
| `skills/kisou/templates/docs/issues/AGENTS.md` | the pointer to "experience vs issues", the `Source:` sentence | 1 |
| `skills/kisou/templates/CONTRIBUTING.md` | the TEMPLATE FILL list, the Project structure line, the References list and example | 1 |
| `skills/kisou/scripts/doc-system-check.js` | `TYPES`; the one note on a `requirements/` directory | 1 |
| `skills/kisou/scripts/doc-system-check.test.js` | every `requirements` fixture renamed; two new tests | 1 |
| `docs/AGENTS.md`, `docs/design/AGENTS.md`, `docs/decisions/AGENTS.md`, `docs/issues/AGENTS.md` | **regenerated by the instrument** from the edited templates | 1 |
| `docs/experience/AGENTS.md` | **created by the instrument** | 1 |
| `docs/issues/resolved/a9c3-…`, `c477-…` | moved from `open/` | 1 |
| `skills/kisou/templates/docs/experience.md` | **new** — the hub skeleton, spec section 3 | 2 |
| `skills/kisou/SKILL.md` | Scope, Step 2's mapping list, Step 3 (scaffold) item 3, Step 3 (migrate)'s doc-system bullets | 2 |
| `skills/kisou/README.md` | reviewed for drift; not edited | 2 |
| `docs/issues/resolved/3bbb-…`, `a331-…` | moved from `open/` | 2 |
| `skills/shoroku/SKILL.md` | the `description`, Step 3's two paragraphs, recommend mode's pairing, translation and `Unsure` sentences | 3 |
| `skills/shoroku/README.md` | lines 3-5, 9-10, and 16-18 | 3 |
| `docs/issues/resolved/0d43-…` | moved from `open/` | 3 |
| `docs/experience.md` | **new** — this repository's hub | 4 |
| `docs/experience/<id>-<slug>.md`, seven | **new** — scenes A to G of the input's §1 | 4 |
| `docs/notes/experience-layer-exit-criterion.md` | **new** — spec section 10 | 4 |
| `.tanto/experience-layer/migration-recommendation.md`, `migration-brief.md` | untracked, written by the dispatched recommender | 5 |
| `.tanto/experience-layer/migration-direction.md` | untracked, written by Kanri from the human's answer at batch C's boundary | — |
| `docs/experience/**`, `docs/issues/open/**`, `docs/design/**` | what the direction accepted, written by the dispatched apply | 6 |
| `docs/design/e3f4-shoroku.md`, `c1d2-kisou.md`, `4807-tanto.md`, `a5b6-automated-release.md` | spec section 8's edits and the three `Related` glosses | 7 |
| `CONTRIBUTING.md`, `README.md` (repository root) | lines 24, 35 and 43; line 54 — under D-9 | 7 |
| `docs/issues/resolved/320e-…`, `c9df-…` | moved from `open/` | 7 |
| `docs/requirements/` | **removed** | 8 |
| `docs/design/**`, `docs/issues/open/**`, `docs/issues/deferred/**`, `docs/notes/**` | every remaining `req-<id>` rewritten | 8 |
| `docs/reports/<YYYY-MM-DD>-experience-layer-dogfood.md` | **new** — spec section 11 | 9 |
| `.tanto/experience-layer/scene-check.js`, `apply-start.txt`, `file-map.txt`, `req-sweep.js`, `final-sweep.md` | untracked scratch the tasks write and read | 4, 6, 7, 8, 9 |

**Not touched**, from the spec's Untouched list and the Global Constraints: `scripts/check_md_frontmatter.py` (its four `Source:` kinds already match the issues template's new sentence, and the one-word pointer `shoroku experience-layer` passes its grammar); `.pre-commit-config.yaml` and `.markdownlint-cli2.yaml` (the hub template stays lint-clean through its own `markdownlint-disable` line, not an ignore); every file under `skills/tanto/` — its sites that name `requirements` or `req-<id>` are declared as `O` lines that may stay (O3.3, O7.7, O8.6 to O8.11), the spec's Deferred item 3 and two sites it does not list; every ADR body and every dated report; `CHANGELOG.md`, whose line 19 names the four old types in a dated entry; everything under `docs/superpowers/`; `CLAUDE.md` and the root `AGENTS.md`; the `notes` and `reports` type templates and their copies; the kisou layer-B templates other than `CONTRIBUTING.md`; and `docs/issues/resolved/**` beyond the seven moves. The two untracked input files, `.tanto/kikaku/2026-09-15-shoroku-experience-input.md` and `.tanto/kikaku/2026-09-15-experience-layer.md`, are read by Tasks 4, 5 and 6 and never written.

## Batches

Nine tasks in four batches. A role may be started or replaced at any boundary (Global Constraints). **The boundary after C waits for the human; batch D is not spawned before `migration-direction.md` exists.** The spec's batch letters B and C are this plan's C and D, because the spec allowed batch A to split when its task count asked for it: the hook-guarded commit is Task 1 alone, and the remaining Markdown work is batch B.

| Batch | Tasks | Delivers | Stop condition at this boundary |
| --- | --- | --- | --- |
| A | 1 | The hook-guarded commit: the `experience` type-rules template, `TYPES` and its note, the renamed tests plus the new-note test, the four rewritten templates and the CONTRIBUTING template, the five installed copies, the `requirements` template deleted; then a second commit moving issue-a9c3 and issue-c477 to `resolved/` | Task 1 `verify` clean; `doc-system-check.js check` exits `0`; the kisou suite passes with at least 57 cases on Node 22 or later; `test ! -e skills/kisou/templates/docs/requirements/AGENTS.md`; `docs/requirements/` is untouched |
| B | 2, 3, 4 | The hub template and kisou's `SKILL.md` and README; shoroku's `SKILL.md` and README; this repository's hub, its seven scenes, and the exit-criterion note; issue-3bbb, issue-a331, and issue-0d43 moved to `resolved/` | Tasks 2-4 `verify` clean; seven scene files present, every scene's expectation ids sourced, the hub's Drivers resolving; five issues in `resolved/`; the shoroku greps at their stated values; `docs/requirements/` still untouched |
| C | 5 | The recommend run: `.tanto/experience-layer/migration-recommendation.md` and `migration-brief.md`, untracked, and a report with the item counts by group and the scene count the recommendation would leave | Task 5's two files exist and pass their content greps; no tracked file changed; **Kanri holds the boundary for the human's answer and does not spawn batch D until `migration-direction.md` exists** |
| D | 6, 7, 8, 9 | The apply (`docs: fold requirements into experience`, and a second fix commit if the direction accepted a `fix` item); the design-side edits of spec section 8, the issue moves, and the root Markdown lines; `docs/requirements/` removed and every `req-` in living documents rewritten; the verification sweep and the dogfood report | Tasks 6-9 `verify` clean; every command under "How a batch is verified" at its stated value; the dogfood report present with section 11's list; the scene count against the cap reported |

## How a batch is verified

Every batch is verified the same way. The commands below are guarded by the state the batches leave on disk, so each one is meaningful at every boundary: a command whose phase has not landed prints that and exits `0`, and from batch D's boundary every one of them runs for real.

1. One `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task <N>` per task in the batch.
2. The boundary check, comparing the branch's actual commits against this plan's own passage blocks. Six families of lines are not quotable by construction and are filtered by path, not waved through: the spec and the plan under `docs/superpowers/` (the branch's own first commits, which the merge base does not hold and no block quotes), the hub and the scene files (frontmatter, `actors`, `tags`, dates, and text the implementer takes from the untracked input), the `updated:` restamp of a moved issue, the lines of the deleted `requirements` template, the four installed copies whose `{{name}}`-expanded lines the instrument writes (phase A's `check` below is the check on them), and, once a direction file exists, a `Recommended fix` commit under `skills/kisou` or `skills/shoroku` whose text only exists at run time, plus the batch D migration output. `$TANTO` is set in the same shell invocation, since shell state does not persist between tool calls:

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
out=$(node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-30-experience-layer.md --base "$(git merge-base main HEAD)"; true)
allowed='^(unaccounted-added|unexplained-removed): (docs/experience\.md|docs/experience/[0-9a-f]{4}-[^ ]+\.md) — '
allowed="$allowed|^(unaccounted-added|unexplained-removed): docs/issues/resolved/[0-9a-f]{4}-[^ ]+\.md — updated: 20[0-9-]+\$"
allowed="$allowed|^unexplained-removed: skills/kisou/templates/docs/requirements/AGENTS\.md — "
allowed="$allowed|^(unaccounted-added|unexplained-removed): docs/superpowers/"
allowed="$allowed|^(unaccounted-added|unexplained-removed): docs/(AGENTS|design/AGENTS|decisions/AGENTS|issues/AGENTS)\.md — "
if [ -e .tanto/experience-layer/migration-direction.md ]; then allowed="$allowed|^(unaccounted-added|unexplained-removed): skills/(kisou|shoroku)/"; fi
if ls docs/reports/*-experience-layer-dogfood.md >/dev/null 2>&1; then allowed="$allowed|^(unaccounted-added|unexplained-removed): docs/(design|issues|notes|requirements|experience|reports)/"; allowed="$allowed|^(unaccounted-added|unexplained-removed): (README|CONTRIBUTING)\.md — "; fi
bad=$(printf '%s\n' "$out" | grep -E '^(unaccounted-added|unexplained-removed): ' | grep -vE "$allowed" || true)
[ -z "$bad" ] || { printf '%s\n' "$bad"; exit 1; }
printf '%s\n' "$out" | tail -1
```

Expected: `diff: clean` or the count line of the last output; no line outside the filtered families named above. From batch D's boundary three of them are path-wide: `skills/(kisou|shoroku)/` once a direction file exists, and the `docs/` trees and the root `README.md` and `CONTRIBUTING.md` once the dogfood report exists. From that boundary `diff` hides any unaccounted line under those trees; the checks that stand in for it there are step 4's class-specific fences, each task's own `verify`, phase A's `check` and the suite at every boundary, and Task 6 Step 4's path list of the fix commit.

3. Lint, on every path the branch has changed **by name** — `scripts/lint.sh` takes path arguments (it falls back to `--all-files` only when given none), so the command builds the list and never passes a directory:

```bash
base=$(git merge-base main HEAD)
files=$(git diff --name-only --diff-filter=d "$base" -- . ':!docs/superpowers' ':!.tanto')
[ -z "$files" ] && { echo 'no changed paths'; exit 0; }
printf '%s\n' "$files" | xargs ./scripts/lint.sh
```

Expected: every hook passes. A hook that auto-fixes leaves the change unstaged — re-stage and re-run.

4. The spec's own content greps, quoted from its Verification section and written as assertions. `boundary` runs each fenced block verbatim and judges it by its **exit status alone**, so every block below prints its numbers *and* exits non-zero when one is wrong — a bare `grep -c` that prints `0` exits `1`, which would read as a failure where `0` is the answer, and a plain `for` loop's status is only its last iteration's, which is why each loop carries its own `|| exit 1`.

Phase A (`docs/experience/AGENTS.md` exists) — the instrument, the template set, and the suite:

```bash
[ -e docs/experience/AGENTS.md ] || { echo 'phase A not landed — skipped'; exit 0; }
node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case || exit 1
test ! -e skills/kisou/templates/docs/requirements/AGENTS.md || exit 1
test -e skills/kisou/templates/docs/experience/AGENTS.md || exit 1
grep -q 'const TYPES = \["experience", "design", "decisions", "issues", "notes", "reports"\];' skills/kisou/scripts/doc-system-check.js || exit 1
n=$(ls docs/issues/resolved/a9c3-* docs/issues/resolved/c477-* 2>/dev/null | wc -l); printf 'a9c3 and c477 in resolved/: %s\n' "$n"; [ "$n" = 2 ] || exit 1
```

Expected: the check prints its own summary and exits `0`, then `a9c3 and c477 in resolved/: 2`.

```bash
[ -e docs/experience/AGENTS.md ] || { echo 'phase A not landed — skipped'; exit 0; }
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
out=$(node --test --test-reporter=tap 'skills/kisou/scripts/*.test.js' 2>&1)
p=$(printf '%s\n' "$out" | sed -n 's/^# pass \([0-9][0-9]*\).*/\1/p')
f=$(printf '%s\n' "$out" | sed -n 's/^# fail \([0-9][0-9]*\).*/\1/p')
printf 'pass %s fail %s\n' "$p" "$f"
[ "${p:-0}" -ge 57 ] && [ "${f:-1}" = 0 ]
```

Expected: `pass N fail 0` with N at least 57 (57 before this plan, plus the new case or cases the spec section 6 asks for).

Phase B (`docs/experience.md` exists) — the hub, the scenes, and the skills:

```bash
[ -e docs/experience.md ] || { echo 'phase B not landed — skipped'; exit 0; }
n=$(ls docs/experience/*.md | grep -v AGENTS | wc -l); printf 'scene files: %s\n' "$n"; [ "$n" -ge 7 ] || exit 1
h=$(grep -c '^## ' docs/experience.md || true); printf 'hub sections: %s\n' "$h"; [ "$h" = 3 ] || exit 1
for id in $(grep -o 'exp-[0-9a-f]\{4\}' docs/experience.md | cut -d- -f2 | sort -u); do grep -rl "\*\*$id\*\*" docs/experience/ >/dev/null || { echo "unresolved $id"; exit 1; }; done
for f in docs/experience/[0-9a-f]*.md; do for id in $(sed -n '/^## Expectations/,/^## Open/p' "$f" | grep -o '\*\*[0-9a-f]\{4\}\*\*' | tr -d '*'); do grep -q "^- \[$id\]" "$f" || { echo "no Sources line: $f $id"; exit 1; }; done; done
echo 'drivers resolve and every expectation is sourced'
```

Expected: `scene files: 7` (or more once batch D has folded new scenes in), `hub sections: 3`, and the last line.

```bash
[ -e docs/experience.md ] || { echo 'phase B not landed — skipped'; exit 0; }
i=$(grep -o 'inferred' skills/shoroku/SKILL.md | wc -l); printf 'inferred in shoroku SKILL.md: %s\n' "$i"; [ "$i" = 2 ] || exit 1
if grep -q 'Kano\|RFC 2119' skills/shoroku/SKILL.md; then echo 'the rule leaked into SKILL.md'; exit 1; fi
r=$(ls docs/issues/resolved/3bbb-* docs/issues/resolved/a331-* docs/issues/resolved/0d43-* docs/issues/resolved/a9c3-* docs/issues/resolved/c477-* 2>/dev/null | wc -l); printf 'resolved by batches A and B: %s\n' "$r"; [ "$r" = 5 ] || exit 1
t=$(grep -c '<!--' skills/kisou/templates/docs/experience.md || true); u=$(grep -c '<!--' docs/experience.md || true); printf 'comment openers: template %s, filled hub %s\n' "$t" "$u"; [ "$t" = 2 ] && [ "$u" = 0 ] || exit 1
test -e docs/notes/experience-layer-exit-criterion.md || exit 1
```

Expected: `inferred in shoroku SKILL.md: 2`, `resolved by batches A and B: 5`, `comment openers: template 2, filled hub 0`.

Phase C (the recommendation exists) — the run's two files:

```bash
r=.tanto/experience-layer/migration-recommendation.md; b=.tanto/experience-layer/migration-brief.md
[ -e "$r" ] || { echo 'phase C not landed — skipped'; exit 0; }
test -e "$b" || { echo 'the brief is missing'; exit 1; }
n=$(grep -c '^## Recommended\|^## Unsure' "$r" || true); printf 'group headings: %s\n' "$n"; [ "$n" = 4 ] || exit 1
m=$(grep '^### ' "$r" | grep -vc '(experience-layer)$' || true); printf 'item headings without the pointer word: %s\n' "$m"; [ "$m" = 0 ] || exit 1
t=$(grep -c 't2-' "$b" || true); printf 't2- mentions in the brief: %s\n' "$t"; [ "$t" = 0 ] || exit 1
```

Expected: `group headings: 4`, `item headings without the pointer word: 0`, `t2- mentions in the brief: 0`. The brief's own form — every `###` heading's text once after `See:` — is Kanri's check at this boundary, not a command here.

Phase D (the dogfood report exists) — the fold:

```bash
ls docs/reports/*-experience-layer-dogfood.md >/dev/null 2>&1 || { echo 'phase D not landed — skipped'; exit 0; }
test ! -e docs/requirements || { echo 'docs/requirements still exists'; exit 1; }
left=$(grep -rl 'req-[0-9a-f]\{4\}' docs/design docs/issues/open docs/issues/deferred docs/notes || true); [ -z "$left" ] || { printf 'req- left in living documents:\n%s\n' "$left"; exit 1; }
a=$(grep -rl 'req-[0-9a-f]\{4\}' docs/decisions | wc -l); printf 'ADR files still naming req-: %s\n' "$a"; [ "$a" = 23 ] || exit 1
r=$(ls docs/issues/resolved/320e-* docs/issues/resolved/c9df-* 2>/dev/null | wc -l); printf 'resolved by batch D: %s\n' "$r"; [ "$r" = 2 ] || exit 1
for f in docs/design/[0-9a-f]*.md; do s=$(grep -c '^## ' "$f" || true); v=$(grep -c '^Serves ' "$f" || true); printf '%s: sections %s, Serves lines %s\n' "$f" "$s" "$v"; [ "$s" = "$v" ] || exit 1; done
for f in docs/experience/[0-9a-f]*.md; do for id in $(sed -n '/^## Expectations/,/^## Open/p' "$f" | grep -o '\*\*[0-9a-f]\{4\}\*\*' | tr -d '*'); do grep -q "^- \[$id\]" "$f" || { echo "no Sources line: $f $id"; exit 1; }; done; done
c=$(ls docs/experience/*.md | grep -v AGENTS | wc -l); printf 'scene files after the fold: %s (the cap is 10; a count above it is reported, not failed)\n' "$c"
```

Expected: no `req-` left in living documents, `ADR files still naming req-: 23`, `resolved by batch D: 2`, one `sections N, Serves lines N` line per design file, and the scene count. **The drafter measures the design-file section counts before writing this fence's final form**: if a fenced `## ` line inside a design document makes the two counts differ legitimately, the fence uses a fence-aware count and the plan says so in Self-Review.

Phase D, issues written by the apply — the frontmatter hook's own check:

```bash
ls docs/reports/*-experience-layer-dogfood.md >/dev/null 2>&1 || { echo 'phase D not landed — skipped'; exit 0; }
base=$(git merge-base main HEAD)
issues=$(git diff --name-only --diff-filter=d "$base" -- docs/issues)
[ -z "$issues" ] && { echo 'no issue paths changed'; exit 0; }
printf '%s\n' "$issues" | xargs uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py
```

Expected: exit `0`, nothing printed.

5. **No JSON is written or edited by any task in this plan**, so no JSON parse check is needed. The frontmatter every scene carries is checked by the repository's frontmatter hook at commit (`scripts/check_md_frontmatter.py` validates that it is a YAML mapping) and, in Task 4, by loading each scene's frontmatter with a real YAML parser.

---

## Tasks

### Task 1: The hook-guarded commit — the `experience` type rules, `TYPES` and its note, the tests, the templates, and their installed copies

**Files:**

- Create: `skills/kisou/templates/docs/experience/AGENTS.md` (W1.1)
- Delete: `skills/kisou/templates/docs/requirements/AGENTS.md` (`git rm`)
- Modify: `skills/kisou/templates/docs/AGENTS.md`, `skills/kisou/templates/docs/design/AGENTS.md`, `skills/kisou/templates/docs/decisions/AGENTS.md`, `skills/kisou/templates/docs/issues/AGENTS.md`, `skills/kisou/templates/CONTRIBUTING.md`
- Modify: `skills/kisou/scripts/doc-system-check.js` (line 22 and the end of `collect`), `skills/kisou/scripts/doc-system-check.test.js`
- Regenerate, by the instrument: `docs/AGENTS.md`, `docs/design/AGENTS.md`, `docs/decisions/AGENTS.md`, `docs/issues/AGENTS.md`; create, by the instrument: `docs/experience/AGENTS.md`
- Move, in a second commit: `docs/issues/open/a9c3-the-decisions-agents-file-has-no-rule-for-a-path-that-no-longer-exists.md` and `docs/issues/open/c477-an-adr-accepted-on-a-branch-may-be-corrected-until-the-merge.md` to `docs/issues/resolved/`
- **Not touched:** anything under `docs/requirements/`, including `docs/requirements/AGENTS.md` — the check stops reading it once `requirements` leaves `TYPES`; Task 8 removes the directory.

**Interfaces:**

- Consumes: nothing.
- Produces: `TYPES` with `experience` in `requirements`'s place, which Task 2's `SKILL.md` Step 2 mapping list repeats; the type rules' headings and forms, which Task 4's hub and scenes follow and Tasks 5 and 6 name to the dispatched agents; `docs/AGENTS.md`'s Propose step, the pairing Task 5's dispatch defines its pairing pass against; the issues template's `Source:` sentence, which the apply's issues follow.

Spec sections 2, 4, 5 (the four doc-system templates, the CONTRIBUTING template, and the installed copies), and 6's `doc-system-check.js` and test half. This is the plan's largest task. It is one commit because the pre-commit hook `kisou-doc-system-check` fails any commit whose templates and installed copies disagree (Global Constraints).

**Why the installed copies are regenerated by the instrument, not written from blocks.** Measured at drafting in a scratch copy of the tree: with a template section edited, a new type template present, and `TYPES` changed, `node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case` lists each diverged section of an installed copy as a `replace` item and the missing `docs/experience/AGENTS.md` as a `create` item — the H1 section and a `###` section are compared like any other — and `apply --items <every number>` writes the copies byte-equal to the expanded templates, keeping each existing copy's CRLF; `check` then prints `0 items, 0 notes`. So every edit is carried once, in template form, by a block below, and the copies come from the instrument that the hook itself runs: there is no hand-applied copy text that could drift from its template. The one cost is on the boundary's `diff`: a copy line whose `{{name}}` was expanded appears in no template block, so Step 5 ends with a text fence listing exactly those lines, for that check alone — it is not an instruction.

**Named mechanisms this task touches.** Its reviewer checks each against the other sites named here.

- **`TYPES`** (P1.18, P1.20): the test's own `TYPES` (P1.20); the type table in `docs/AGENTS.md` (P1.1); kisou `SKILL.md` Step 2's dir-names list and Step 3's scaffold list (Task 2, P2.2 and P2.3); the note's text in `collect` (P1.19), asserted by P1.25; decision `8b1f`'s case-mapping table (an ADR — not edited; the close's ADR 1 amends it).
- **The item id and the one id pool** (P1.3): the type rules' Identifiers section (W1.1); the scenes' file ids and item ids (Task 4); the final-ids rule of the recommend dispatch (Task 5) and its re-check in the apply dispatch (Task 6).
- **The `exp-` reference** (P1.4, P1.8, P1.9, P1.17): the type rules' Identifiers (W1.1); the hub's `←` links (Task 4, W4.1); shoroku `SKILL.md`'s recommend mode (Task 3, P3.5); the root `CONTRIBUTING.md` example (Task 7, P7.18); the pairing pass's `Serves exp-…` lines (Tasks 5, 6).
- **The hub** (P1.2, P1.6): the type rules' The hub section (W1.1); the hub template (Task 2, W2.1); kisou `SKILL.md` Scope and Step 3 (Task 2, P2.1 and P2.4); `docs/design/c1d2-kisou.md` (Task 7, P7.6 and P7.7); the hub itself (Task 4, W4.1).
- **The trust tags** (P1.8's "tagged and capped"): the type rules' Expectations and Sources (W1.1); shoroku `SKILL.md` (Task 3, P3.3 to P3.5); the scenes (Task 4); both dispatches (Tasks 5, 6); `docs/design/e3f4-shoroku.md` (Task 7, P7.4 and P7.5).
- **The `Source:` line** (P1.14): `scripts/check_md_frontmatter.py`'s `SOURCE_RE` — not edited; its four kinds are the four the new sentence lists; shoroku `SKILL.md` lines 59-63 (unchanged); the apply dispatch's `Source: shoroku experience-layer` (Task 6).
- **An ADR's `## Sources`** (P1.12): the type rules' Sources section (W1.1); `docs/AGENTS.md` step 1's reading sentence (P1.8).

**Old values this task must clear.** Counts were run against the tree at drafting, per file; `docs/superpowers/**` is counted as one group and is never edited (Global Constraints), so its hits stay.

**O1.1** `lowercase. Unique within` — `skills/kisou/templates/docs/AGENTS.md` 1, `docs/AGENTS.md` 1, nowhere else. The per-type uniqueness rule; P1.3 replaces it and the instrument carries it to the copy. Must be 0 in both after this task.

**O1.2** `Before creating, check` — `skills/kisou/templates/docs/AGENTS.md` 1, `docs/AGENTS.md` 1, `docs/superpowers/**` 2. Must be 0 in the first two after this task.

**O1.3** `req-d4e5` — `skills/kisou/templates/docs/AGENTS.md` 1, `docs/AGENTS.md` 1, `skills/kisou/templates/CONTRIBUTING.md` 1, `CONTRIBUTING.md` 1, `docs/superpowers/**` 4. The example reference. The first three are 0 after this task (P1.4, P1.17); the root `CONTRIBUTING.md` is Task 7's (P7.18), edited under D-9 in batch D.

**O1.4** `requirements vs issues` — the split's old name. `skills/kisou/templates/docs/AGENTS.md` 1, `docs/AGENTS.md` 1, `skills/kisou/templates/docs/issues/AGENTS.md` 1, `docs/issues/AGENTS.md` 1, `skills/kisou/templates/docs/requirements/AGENTS.md` 2, `skills/kisou/scripts/doc-system-check.test.js` 3 — all 0 after this task (P1.8, P1.13, the deletion, P1.34). `skills/shoroku/SKILL.md` 1 is Task 3's (P3.3); `docs/design/e3f4-shoroku.md` 1 is Task 7's (P7.3); `docs/requirements/AGENTS.md` 2 goes with the directory in Task 8. **May stay:** `docs/issues/open/c9df-…` 1 (moved to `resolved/` by Task 7, a closed record), `docs/issues/resolved/ad1a-…` 1 and `f623-…` 1, `docs/reports/2026-09-11-kisou-refresh-dogfood.md` 3, `docs/superpowers/**` 73 — closed or frozen documents.

**O1.5** `serves no requirement` — the pairing's old words. `skills/kisou/templates/docs/AGENTS.md` 1, `docs/AGENTS.md` 1, `skills/kisou/templates/docs/design/AGENTS.md` 1, `docs/design/AGENTS.md` 1 — all 0 after this task (P1.8, P1.9). **May stay:** `docs/issues/open/320e-…` 2 (moved to `resolved/` by Task 7), `docs/superpowers/**` 18. The same step's `req-<id>` pairing sits inside backticks on every line that carries it, and a backtick-free needle spanning it would be `req-<id>` alone, which P1.7's legacy sentence keeps on purpose; P1.8's `verify` and this needle's neighbour on the same list are its check.

**O1.6** `{{requirements}}` — the placeholder. `skills/kisou/templates/docs/AGENTS.md` 3, `skills/kisou/templates/CONTRIBUTING.md` 3, `skills/kisou/templates/docs/issues/AGENTS.md` 1, `skills/kisou/templates/docs/requirements/AGENTS.md` 3 — all 0 after this task. `skills/kisou/SKILL.md` 1 is Task 2's (P2.2). **May stay:** `docs/superpowers/**` 32. The copies' expanded forms of these lines — `docs/AGENTS.md` line 74's living-document parenthesis among them — follow from the templates through the instrument, and the hook holds them level.

**O1.7** `docs/requirements/AGENTS.md` — the old type file's path. `docs/AGENTS.md` 1, `docs/issues/AGENTS.md` 1 — 0 after this task (P1.8, P1.13, through the instrument); `docs/design/e3f4-shoroku.md` 1 is Task 7's (P7.3). **May stay:** `docs/design/c1d2-kisou.md` 1 (line 176, inside the section dated "Refresh (measured 2026-09-09)" — a record of that run); `docs/issues/open/c9df-…` 3 (moved to `resolved/` by Task 7); `docs/issues/resolved/**` 5, `docs/reports/2026-09-09-requirement-extraction-dogfood.md` 3, `docs/superpowers/**` 67.

**O1.8** `what the project must do for users` — the type table's old gloss. `skills/kisou/templates/docs/AGENTS.md` 1, `docs/AGENTS.md` 1 — 0 after this task (P1.1). **May stay:** `docs/superpowers/**` 3.

**O1.9** `from any document, frozen ones included.` — the flat-types sentence, which gains the hub at its full stop (P1.6). `skills/kisou/templates/docs/AGENTS.md` 1, `docs/AGENTS.md` 1 — 0 after this task.

**O1.10** `requirement / design /` — the classify step's old type list. `skills/kisou/templates/docs/AGENTS.md` 1, `docs/AGENTS.md` 1 — 0 after this task (P1.8); `skills/shoroku/SKILL.md` 1 is Task 3's (P3.2). **May stay:** `docs/superpowers/**` 14.

**O1.11** `requirement fragment and the issue records` — the issues template's old pointer. `skills/kisou/templates/docs/issues/AGENTS.md` 1, `docs/issues/AGENTS.md` 1 — 0 after this task (P1.13). **May stay:** `docs/superpowers/**` 5.

**O1.12** `Narrative starts directly after the frontmatter — no body` — the issues Body sentence the `Source:` line contradicts. `skills/kisou/templates/docs/issues/AGENTS.md` 1, `docs/issues/AGENTS.md` 1 — 0 after this task (P1.14). The design and decisions templates open their Body with different words and stand.

**O1.13** `for a trivial decision:` — the decisions Body's "omit any", which gains the Sources clause before its colon (P1.12). `skills/kisou/templates/docs/decisions/AGENTS.md` 1, `docs/decisions/AGENTS.md` 1 — 0 after this task.

**O1.14** `you never rewrite the body. To reverse` — the immutability sentence, which gains issue-c477's exception at its full stop (P1.10). `skills/kisou/templates/docs/decisions/AGENTS.md` 1, `docs/decisions/AGENTS.md` 1 — 0 after this task.

**O1.15** `are the only mutable parts of an accepted ADR` — `skills/kisou/templates/docs/decisions/AGENTS.md` 1, `docs/decisions/AGENTS.md` 1. **May stay, and is flagged:** the spec checked this sentence against a redaction and ruled it standing, before D-7 added issue-c477's exception; read literally, the exception (an unmerged ADR corrected in place) is a fourth mutable part. The exception names itself "One exception" in the file's opening paragraph, so the sentence is not edited here; Self-Review names it for the close's recommender.

**O1.16** `["requirements", "design"` — the type list. `skills/kisou/scripts/doc-system-check.js` 1, `skills/kisou/scripts/doc-system-check.test.js` 1 — 0 after this task (P1.18, P1.20). **May stay:** `docs/superpowers/**` 2.

**O1.17** `path.join(docs, "requirements", "AGENTS.md")` — the tests' fixture path. `skills/kisou/scripts/doc-system-check.test.js` 8 — 0 after this task; the two new tests reach the old name through `const legacy = path.join(docs, "requirements");` instead. **May stay:** `docs/superpowers/**` 7.

**O1.18** `"# requirements/ — AGENTS"` — the tests' fingerprint string. `skills/kisou/scripts/doc-system-check.test.js` 8 — 0 after this task. **May stay:** `docs/superpowers/**` 6.

**O1.19** `"# Requirements\n\nOurs.\n"` — the foreign-H1 fixture. `skills/kisou/scripts/doc-system-check.test.js` 3 — 0 after this task. **May stay:** `docs/superpowers/**` 3.

- [ ] **Step 1: Write the type rules**

**W1.1** `skills/kisou/templates/docs/experience/AGENTS.md` — new file, 236 lines

````markdown
# {{experience}}/ — AGENTS

An `experience` file is a **scene**: someone is in a situation, wants
something, and something would upset them. It is the goal layer — background,
purpose, constraints, from an actor's viewpoint — and never the machine: no
mechanism, no "the system shall". Developer experience counts as much as
end-user experience. How the system meets a scene is `{{design}}/`; why a
choice was made is `{{decisions}}/`.

## File

- Path: `{{docs}}/{{experience}}/<id>-<slug>.md`. Reference prefix: `exp`.
  See the top-level `AGENTS.md` for `<id>` generation, slug rules, and the
  `<type>-<id>` reference convention.
- Granularity: **one file per situation** — cold-start,
  returning-after-months, interrupted-work — not per feature and not per
  quality attribute (those are `tags`). A project has about 5 to 10 scenes;
  a scene is at most a page and carries 3 to 7 expectations. These are
  judgments, not limits a tool enforces: past them, fold, split, or delete.
- No index file. The hub (below) is not one.

## Frontmatter

```yaml
id: "a1b2"
title: <situation, as a phrase>
created: 2026-05-27
updated: 2026-05-27
actors: [maintainer]
tags: [user-effort]
```

- `id` is a quoted string. `created` / `updated` are `YYYY-MM-DD` (UTC);
  set `updated` to today on edit.
- `actors` names who is in the scene, from the hub's Cast. `tags` are the
  quality attributes and areas the scene touches, for retrieval; free
  vocabulary, kebab-case.
- No `status` field. A scene is a draft while it holds no `[stated]` or
  `[confirmed]` line, and nothing else marks it.

## Body

Start directly after the frontmatter — no body `# heading` (markdownlint
`MD025`). Four sections, in this order, Sources last so that a heading-wise
reader can take a scene without it:

```text
## Scene           — present tense, the actor's viewpoint, what would upset them; no mechanism
## Expectations    — one line per expectation, the form below
## Open questions  — what is undecided, inline; may be empty
## Sources         — verbatim quotes keyed by item id; the only place for a language other than the docs'
```

Do not define terms ("what is a user", "what is effort"). Write the
situation the way the actor would tell it.

## Expectations

One line each:

```text
- **<id>** [stated|inferred|confirmed] MUST|MUST NOT|SHOULD|SHOULD NOT|MAY <what, from the actor's side>
```

- **Strength** is RFC 2119. MUST / MUST NOT is a constraint: a design that
  breaks it is wrong. SHOULD / SHOULD NOT is a concern: weighed, not obeyed
  — a design may set it aside for a reason it states. MAY is an option the
  actor would welcome. Choosing the word: what the actor takes for granted
  and would be upset to lose → MUST; what they would be happier with, in
  proportion → SHOULD; what would delight and whose absence goes unnoticed →
  MAY; what would upset them if present → MUST NOT; what they do not care
  about → leave it out.
- **Trust tag.** `[stated]` — a verbatim quote in Sources backs the line.
  `[inferred]` — the agent assembled it from remarks that do not say it;
  Sources names the basis items and gives a one-line reason. `[confirmed]`
  — inferred, then confirmed by the human. **An `[inferred]` expectation is
  SHOULD or SHOULD NOT at most**; a constraint on the agent's own inference
  is the mistake this tag exists to prevent. **The human's confirmation is
  the gate**, and it is the existing one: the answer at `Direction?`, or the
  direction file a caller writes from the human's answer. An accepted
  `[inferred]` line becomes `[confirmed]`, its Sources entry quoting the
  words of the confirmation; a line the human corrected becomes `[stated]`,
  the correction quoted as given; an unanswered line stays `[inferred]`. No
  expectation is written on the classifier's own judgment.
- **Vocabulary.** An expectation that names a path, a command, a config
  key, a file format, a role count, or a tool by name reads as design.
  Offer it as a `{{design}}/` candidate, or in an abstract rewrite beside the
  concrete one, and let the human pick.
- **Open questions** are lines under their own heading, `- **<id>** <the
  question>`. When a decision resolves one, the writer of that decision
  appends `→ decision-<id>` to the line; the line is never deleted. An open
  question that needs tracking — blocked work, a claim — is also an issue,
  at the human's word.

## Sources

- One entry per item id, in the order the items appear:
  `- [<id>] 「<verbatim quote>」 (<where and when>)` for a stated item;
  `- [<id>] inferred from <ids> and 「<quote>」; not stated directly` for an
  inferred one; and, once confirmed,
  `- [<id>] inferred from <ids>; not stated directly. Confirmed <date>: 「<the human's words>」`.
- Quotes are the actor's own words, in the language they were said in. This
  is the only place a language other than the documents' appears; there are
  no parallel translated documents.
- **Do not read Sources unless verifying where a line came from.** A
  reader who wants the scene reads the three sections above it; a
  heading-wise read stops before Sources. This is the one statement of that
  rule; Reading path points here.
- The human may redact a quote when accepting the item; a redaction is the
  human's act, never the agent's.

## The hub

`{{docs}}/{{experience}}.md`, one fixed file beside this directory, no id, no
frontmatter, **hand-written entirely** and the always-read entry to this
layer:

```text
## Cast      — the actors, one line each: who they are and how they meet the project
## Drivers   — generalized expectations in their own words, each pointing with ← at the exp-<id>s it generalizes; at most 5 at MUST level
## Won't     — what the human has ruled out for the project, one line each, with an id
```

No scene index and no generated region: the directory listing is the index
(File says the same of this directory). Drivers and Won't items carry no
trust tag — the hub is the human's own words by construction. Scaffolded
once from the template skeleton and never refreshed from it — its content is
the project's.

## Identifiers

- Scene ids are document ids, drawn as the top-level `AGENTS.md` says.
  Expectation, driver, open-question, and Won't ids are **item ids**, drawn
  from the same pool with the same checks: before using one, no file
  `{{docs}}/<type>/**/<id>-*.md` exists, no `**<id>**` line exists under
  `{{docs}}/{{experience}}/` or in the hub, and no commit ever used it
  (`git log --all --oneline -S'<id>' -- {{docs}}` prints nothing) — an id
  once written is never reused, because a frozen document may cite it.
- An id that arrives from outside the tree — a chat handover's — and
  collides is re-rolled at ingestion, and the bundle's references to it are
  rewritten before anything is written.
- A reference to a scene is `exp-<id>`; to an item, `exp-<item-id>` — one
  form. Resolve by lookup: a file `{{docs}}/{{experience}}/<id>-*.md`, else
  the `**<id>**` line inside one of them or the hub. A `←` link in the hub
  uses the same `exp-` form.
- An item keeps its id when its strength changes or it moves to another
  scene.

## What is an experience fragment

Someone — a user, a developer, a future self — is in a situation, wants
something, and something would upset them; no mechanism is named. Two tests:
the want survives a change of design (it would still hold if the system were
built another way), and its reason is the actor's own situation — time,
trust, language, authority — not the system's coherence. A statement that
fails either is design, a decision, or an issue.

This is the one type whose fragments may be **assembled**: an agent may
infer a scene or an expectation from scattered remarks, tagged `[inferred]`
and capped as above, with basis and reason in Sources. Decisions and design
are never inferred. A behavior sentence that the code and its tests already
express is not an expectation: drop it, salvaging any reason it embeds.

## experience vs issues

- `{{experience}}/` = what the actor wants and why — whether or not the
  system meets it yet (living).
- `{{issues}}/` = what is wrong or missing and is not being fixed now.
- A want the human states is an expectation **even when it is unmet**. The
  gap it leaves is a separate issue. One statement yielding two entries is
  not duplication: the expectation outlives the fix, the issue closes with
  it. Filing the issue alone loses the expectation.
- A small want folds into an existing scene as one line; a new scene only
  for a situation no scene covers. Never one file per sentence.
- The gate is the one Expectations names under the trust tag.

## Reading path

- Designing (brainstorming, a spec): the hub, then the scenes whose `tags`
  or `actors` match the task, then the decisions listing.
- Planning: the above plus `{{design}}/`.
- Implementing: what the plan links, and nothing more.
- A human: `README` → `CONTRIBUTING` → the hub.
- `## Sources` is read as Sources says: only to verify where a line came from.

## Situations

A starter catalog, for a project with no scenes yet — names, not files:
starting-from-a-chat, cold-start, returning-after-months, interrupted-work,
being-asked-again, the-agent-re-proposes, the-undecided-gets-decided,
two-languages-one-tree. Pick the ones the project has; add the ones it
lacks.

## Worked example

```markdown
---
id: "c4e1"
title: returning after months
created: 2026-05-27
updated: 2026-05-27
actors: [maintainer, agent, collaborator]
tags: [orientation, trust, always-read-set]
---

## Scene

The maintainer opens a repository untouched since spring and wants to know
where things are and what he was worried about, in one sitting. The agent
starting the same session wants the same in as few tokens as possible. A
collaborator who uses no AI wants it from the README onward. If any of them
must read the code to learn the structure, or the docs describe a structure
the code no longer has, they stop trusting the docs.

## Expectations

- **37c2** [stated] MUST NOT exclude a human who does not use AI as a reader of the docs.
- **3b2d** [confirmed] SHOULD let the maintainer re-orient in one sitting.
- **48b2** [stated] SHOULD keep what the agent reads on every task small.

## Open questions

## Sources

- [37c2] 「repo の利用者全員がAIを使う前提を（まだ）置いてない」 (chat, 2026-09-14)
- [3b2d] inferred from 37c2 and 「UX だけじゃなく、DXも、だ」; not stated directly. Confirmed 2026-09-15.
- [48b2] 「日本語をAIに読ませるのがトークン消費の点で気にはなるけど、仕方ないか。許容。」 (chat, 2026-09-14)
```

## Lifecycle

Experience is a living type. A scene the project has outgrown is rewritten
or deleted, not marked; an expectation that no longer holds is removed and
its Sources entry with it. History is the record, and a removed id is never
drawn again (Identifiers). Split a scene that grew a second situation; fold
two that describe one.
````

This is spec section 2's text with the spec's own four-backtick outer fence removed: in the file the inner fences are ordinary three-backtick fences. The worked example's quotes are the input's §4 quotes for `37c2`, `3b2d` and `48b2`, so the example is true of this repository; a fresh scaffold ships the same example (spec section 2, the three remarks). Write it with the Write tool, then stage it — `--only` cannot pick up an untracked file:

```bash
# tree-state
git add skills/kisou/templates/docs/experience/AGENTS.md
```

- [ ] **Step 2: Edit the four doc-system templates and the CONTRIBUTING template**

`skills/kisou/templates/docs/AGENTS.md`, spec section 4. The type table's `requirements` line becomes the hub's line and the scenes' line, each gloss at the table's own column:

**P1.1** `skills/kisou/templates/docs/AGENTS.md` — replace exactly these 1 lines

```text
{{docs}}/{{requirements}}/<id>-<slug>.md    — what the project must do for users, and why
```

**P1.1 →**

```text
{{docs}}/{{experience}}.md                  — the hub: who is in the scenes, what drives the project, what it won't do (hand-written; no id)
{{docs}}/{{experience}}/<id>-<slug>.md      — scenes: who is in what situation, what they expect, and their own words
```

The table's addendum, after the table and before the per-type paragraph:

**P1.2** `skills/kisou/templates/docs/AGENTS.md` — replace exactly these 2 lines

```text
Per-type rules (frontmatter, body, lifecycle) live in each
`{{docs}}/<type>/AGENTS.md`. Read the one for the type you are touching.
```

**P1.2 →**

```text
The hub is one fixed file beside `{{experience}}/`, hand-written, with no id
and no frontmatter requirement; `{{docs}}/{{experience}}/AGENTS.md` says what
it holds.

Per-type rules (frontmatter, body, lifecycle) live in each
`{{docs}}/<type>/AGENTS.md`. Read the one for the type you are touching.
```

The `<id>` bullet — the one pool, both checks, the letter rule, and the never-reuse rule:

**P1.3** `skills/kisou/templates/docs/AGENTS.md` — replace exactly these 4 lines

```text
- **`<id>`** — the first 4 hex chars of a fresh UUID, lowercase. Unique within
  its type (the type prefix disambiguates across types). Emit `id:` as a quoted
  string (a 4-hex id may be all digits and would otherwise parse as an int).
  Before creating, check `{{docs}}/<type>/**/<id>-*.md` is empty.
```

**P1.3 →**

```text
- **`<id>`** — the first 4 hex chars of a fresh UUID, lowercase.
  **Unique across `{{docs}}/`**, documents and items alike
  (`{{docs}}/{{experience}}/AGENTS.md` names the item ids): a new id is one no
  file `{{docs}}/<type>/**/<id>-*.md` carries and no `**<id>**` line under
  `{{docs}}/{{experience}}/` or in the hub carries. References still carry the
  type prefix, so an older project with a cross-type collision resolves as
  before. Emit `id:` as a quoted string (a 4-hex id may be all digits and
  would otherwise parse as an int). Before creating, run both checks above. A
  new id contains at least one of `a` to `f` — an all-digit `#1234` autolinks
  to a GitHub issue; re-roll otherwise. Existing all-digit ids stay. An id any
  commit ever used is not drawn again —
  `git log --all --oneline -S'<id>' -- {{docs}}` prints nothing — because a
  frozen document may cite it.
```

Cross-references — the example, and the lookup sentence after it:

**P1.4** `skills/kisou/templates/docs/AGENTS.md` — replace exactly these 1 lines

```text
- `req-d4e5` · `design-f6a1` · `decision-a3f7` · `issue-b9c2`
```

**P1.4 →**

```text
- `exp-d4e5` · `design-f6a1` · `decision-a3f7` · `issue-b9c2`

An `exp-` reference names a scene or an item in one — `exp-<id>` for either —
and is resolved by lookup, a file first and a `**<id>**` line second.
```

**P1.5** `skills/kisou/templates/docs/AGENTS.md` — replace exactly these 1 lines

```text
- **From a living document** (`{{requirements}}/`, `{{design}}/`, an open issue)
```

**P1.5 →**

```text
- **From a living document** (`{{experience}}/`, `{{design}}/`, an open issue)
```

The flat-types paragraph gains the hub, the third document cited by path:

**P1.6** `skills/kisou/templates/docs/AGENTS.md` — replace exactly these 2 lines

```text
**The flat types are the exception.** `{{notes}}/` and `{{reports}}/` have no
`<id>`, so they are cited by **path** from any document, frozen ones included.
```

**P1.6 →**

```text
**The flat types are the exception.** `{{notes}}/` and `{{reports}}/` have no
`<id>`, so they are cited by **path** from any document, frozen ones included
— and so is the hub, `{{docs}}/{{experience}}.md`, a fixed name that never
moves.
```

The legacy sentence, as the section's last paragraph:

**P1.7** `skills/kisou/templates/docs/AGENTS.md` — replace exactly these 2 lines

```text
Structured (frontmatter) links are limited to ADR `supersedes` /
`superseded_by` / `amends` / `amended_by` and issue `depends_on` / `blocks`.
```

**P1.7 →**

```text
Structured (frontmatter) links are limited to ADR `supersedes` /
`superseded_by` / `amends` / `amended_by` and issue `depends_on` / `blocks`.

A `req-<id>` reference in a document older than this layer names a
`requirements/` file the project folded into `{{experience}}/`; the file and
the fold are in history, and the reference is not rewritten in a frozen
document.
```

Session shoroku, steps 1 to 3 — the Sources reading sentence, the classify step, and the pairing:

**P1.8** `skills/kisou/templates/docs/AGENTS.md` — replace exactly these 16 lines

```text
1. **Read** the session: the conversation, plus any Markdown written or edited
   during it, plus the existing `{{docs}}/` as baseline.
2. **Classify** each fragment as exactly one of requirement / design /
   decision / issue. The type files define the two splits that are easy to
   get wrong: "design vs decisions" in `{{docs}}/{{design}}/AGENTS.md`, and
   "requirements vs issues" in `{{docs}}/{{requirements}}/AGENTS.md` — a need
   the user states that the system does not meet yet is **two** fragments, a
   requirement and an issue, not one issue.
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. Each `{{design}}/` entry in the
   list names the `req-<id>` it serves, or says it serves none. Of the entries
   in the list, flag the unpaired: a design section that serves no requirement
   (ask whether an unstated need stands behind it), and a requirement bullet
   no design serves (ask whether the need is unmet — an issue — or met but not
   described — a `{{design}}/` entry). The standing tree is not swept; a
   backfill is its own run. End with `Direction?` and wait.
```

**P1.8 →**

```text
1. **Read** the session: the conversation, plus any Markdown written or edited
   during it, plus the existing `{{docs}}/` as baseline. Do not read a scene's
   or an ADR's `## Sources` unless verifying where a line came from.
2. **Classify** each fragment as exactly one of experience / design /
   decision / issue. The type files define the two splits that are easy to
   get wrong: "design vs decisions" in `{{docs}}/{{design}}/AGENTS.md`, and
   "experience vs issues" in `{{docs}}/{{experience}}/AGENTS.md` — a want the
   user states that the system does not meet yet is **two** fragments, an
   expectation and an issue, not one issue. Experience is the one type whose
   fragment may be assembled from scattered remarks; that file says how it is
   tagged and capped.
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. Each `{{design}}/` entry in the
   list names the `exp-<id>` — a scene or an item — it serves, or says it
   serves none. Of the entries in the list, flag the unpaired: a design section
   that serves no expectation (ask whether an unstated want stands behind it),
   and an expectation no design serves (ask whether the want is unmet — an
   issue — or met but not described — a `{{design}}/` entry). The standing tree
   is not swept; a backfill is its own run. End with `Direction?` and wait.
```

`skills/kisou/templates/docs/design/AGENTS.md`, spec section 5 — the pairing bullet, with issue-320e's scope sentence:

**P1.9** `skills/kisou/templates/docs/design/AGENTS.md` — replace exactly these 3 lines

```text
- Name the requirement each `## Section` serves with `req-<id>`. A section
  that serves none says so ("serves no requirement; internal shape"), so a
  shoroku proposal can ask whether an unstated need stands behind it.
```

**P1.9 →**

```text
- Name the expectation each `## Section` serves with `exp-<id>` — a scene or
  an item in one. A section that serves none says so ("serves no
  expectation; internal shape"), so a shoroku proposal can ask whether an
  unstated want stands behind it. The pairing is checked on the entries a
  proposal carries, never by a sweep of the standing tree.
```

`skills/kisou/templates/docs/decisions/AGENTS.md`, spec section 5 — issue-c477's exception after the immutability sentence:

**P1.10** `skills/kisou/templates/docs/decisions/AGENTS.md` — replace exactly these 3 lines

```text
decision, and the consequences accepted. ADRs are **append-only and immutable**
once accepted; you never rewrite the body. To reverse a decision, write a new
ADR that supersedes the old one.
```

**P1.10 →**

```text
decision, and the consequences accepted. ADRs are **append-only and immutable**
once accepted; you never rewrite the body. One exception: an ADR accepted on a
branch that has not reached the default branch may be corrected in place until
that branch is merged, the correction dated in its own text — an unmerged ADR
has no reader outside the run that wrote it; once merged, the only moves are
amend and supersede below. To reverse a decision, write a new ADR that
supersedes the old one.
```

Issue-a9c3's sentence, at the end of the paragraph on citing managed entries:

**P1.11** `skills/kisou/templates/docs/decisions/AGENTS.md` — replace exactly these 2 lines

```text
a renamer who owns inbound links: name them (title and date), never path-link
them (see Cross-references in `{{docs}}/AGENTS.md`).
```

**P1.11 →**

```text
a renamer who owns inbound links: name them (title and date), never path-link
them (see Cross-references in `{{docs}}/AGENTS.md`). A plain path named in an
accepted body is read as of the ADR's date and is never repaired; what the tree
looks like now is `{{design}}/`'s to say.
```

The Body's optional `## Sources` section, its clause, and its reading sentence:

**P1.12** `skills/kisou/templates/docs/decisions/AGENTS.md` — replace exactly these 9 lines

````text
Narrative starts directly after the frontmatter. Use these sections; keep them
short, or omit any for a trivial decision:

```text
## Context       — what forced a decision
## Options       — the alternatives considered
## Decision      — the choice
## Consequences  — what we accept; trade-offs; follow-ups
```
````

**P1.12 →**

````text
Narrative starts directly after the frontmatter. Use these sections; keep them
short, or omit any for a trivial decision — Sources only when there are quotes
to hold:

```text
## Context       — what forced a decision
## Options       — the alternatives considered
## Decision      — the choice
## Consequences  — what we accept; trade-offs; follow-ups
## Sources       — optional; verbatim quotes keyed by the item ids they back, in the language they were said in
```

`## Sources` is the one place a language other than the documents' appears; a
reader takes the four sections above it and reads Sources only to verify where
a line came from.
````

`skills/kisou/templates/docs/issues/AGENTS.md`, spec section 5 — the pointer to the split, and the rider sentence (Fixed input 22):

**P1.13** `skills/kisou/templates/docs/issues/AGENTS.md` — replace exactly these 4 lines

```text
When the missing thing is a need the user stated, the need itself is a
requirement fragment and the issue records only the gap — see
"requirements vs issues" in `{{docs}}/{{requirements}}/AGENTS.md`. An issue
filed alone loses the requirement.
```

**P1.13 →**

```text
When the missing thing is a need the user stated, the want itself is an
expectation and the issue records only the gap — see "experience vs issues"
in `{{docs}}/{{experience}}/AGENTS.md`. An issue filed alone loses the
expectation.
```

**P1.14** `skills/kisou/templates/docs/issues/AGENTS.md` — replace exactly these 2 lines

```text
Narrative starts directly after the frontmatter — no body `# heading` (avoids
`MD025` against the frontmatter `title:`).
```

**P1.14 →**

```text
The body opens with the `Source:` line below, then the narrative; no body
`# heading` (avoids `MD025` against the frontmatter `title:`).

The `Source:` line is one line, `Source: <kind> <pointer>`, the first non-empty
line after the frontmatter — `inbox <YYYY-MM-DD>-<slug>`,
`shoroku <topic>[ S-<n>]`, `hotfix <commit subject>`, or
`session <YYYY-MM-DD>`: a pointer to where the issue came from, never a class
word.
```

`skills/kisou/templates/CONTRIBUTING.md`, spec section 5 — a layer-B template, not a checked copy and not markdownlint-checked where it lives (`.markdownlint-cli2.yaml` ignores `skills/kisou/templates/*.md`):

**P1.15** `skills/kisou/templates/CONTRIBUTING.md` — replace exactly these 1 lines

```text
  `{{scripts}}`, `{{requirements}}`, `{{design}}`, `{{decisions}}`,
```

**P1.15 →**

```text
  `{{scripts}}`, `{{experience}}`, `{{design}}`, `{{decisions}}`,
```

**P1.16** `skills/kisou/templates/CONTRIBUTING.md` — replace exactly these 1 lines

```text
- [`{{docs}}/{{requirements}}/`]({{docs}}/{{requirements}}/) — what we're building
```

**P1.16 →**

```text
- [`{{docs}}/{{experience}}.md`]({{docs}}/{{experience}}.md) — who uses this and what they expect; scenes in [`{{docs}}/{{experience}}/`]({{docs}}/{{experience}}/)
```

**P1.17** `skills/kisou/templates/CONTRIBUTING.md` — replace exactly these 9 lines

```text
Project context documents under `{{docs}}/` — `{{requirements}}/`,
`{{design}}/`, `{{decisions}}/`, and `{{issues}}/` — are managed by AI agents:
ask an agent to add or update entries.

Refer to them as `<type>-<id>` in commits, code comments, and prose:

- `decision-a3f7`
- `issue-b9c2`
- `req-d4e5`
```

**P1.17 →**

```text
Project context documents under `{{docs}}/` — `{{experience}}/`,
`{{design}}/`, `{{decisions}}/`, and `{{issues}}/` — are managed by AI agents:
ask an agent to add or update entries.

Refer to them as `<type>-<id>` in commits, code comments, and prose:

- `decision-a3f7`
- `issue-b9c2`
- `exp-d4e5`
```

- [ ] **Step 3: Edit the instrument and its tests, and run the suite**

`skills/kisou/scripts/doc-system-check.js`, spec section 6. Line 22, and one note at the end of `collect`; `targetSet`, `classify` and `apply` are unchanged:

**P1.18** `skills/kisou/scripts/doc-system-check.js` — replace exactly these 1 lines

```text
const TYPES = ["requirements", "design", "decisions", "issues", "notes", "reports"];
```

**P1.18 →**

```text
const TYPES = ["experience", "design", "decisions", "issues", "notes", "reports"];
```

**P1.19** `skills/kisou/scripts/doc-system-check.js` — replace exactly these 3 lines

```text
  }

  return { items, notes };
```

**P1.19 →**

```text
  }

  // A docs root that still holds this type under its name before 2026-09 gets
  // one note: renaming the directory is a hand migration, never an item.
  const legacyName = expandName("requirements", kase);
  let legacyOnly;
  try {
    legacyOnly =
      existsExact(docsDir, `${legacyName}/AGENTS.md`) &&
      !existsExact(docsDir, `${expandName("experience", kase)}/AGENTS.md`);
  } catch (err) {
    throw new ReadError(`cannot read ${posixPath(path.join(docsDir, legacyName))}: ${err.message}`);
  }
  if (legacyOnly) {
    notes.push(
      `note: ${reportPath(docsDir, legacyName)}/ — the name the experience type had before 2026-09; renaming it is a hand migration, not an item`,
    );
  }

  return { items, notes };
```

The note is printed with the other notes and counted in the summary line; `check` exits `0` on a note alone, as today. The existence test is wrapped the way the target loop wraps its own, so an unreadable directory is `error: …` and exit 2, never a stack trace.

`skills/kisou/scripts/doc-system-check.test.js` — every `requirements` fixture, heading, and path becomes `experience`, and two new tests pin the note. The test file's own type list:

**P1.20** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 1 lines

```text
const TYPES = ["requirements", "design", "decisions", "issues", "notes", "reports"];
```

**P1.20 →**

```text
const TYPES = ["experience", "design", "decisions", "issues", "notes", "reports"];
```

**P1.21** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 1 lines

```text
  assert.strictEqual(expandName("requirements", "snake_case"), "requirements");
```

**P1.21 →**

```text
  assert.strictEqual(expandName("experience", "snake_case"), "experience");
```

**P1.22** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 1 lines

```text
  assert.strictEqual(expandName("requirements", "PascalCase"), "Requirements");
```

**P1.22 →**

```text
  assert.strictEqual(expandName("experience", "PascalCase"), "Experience");
```

The target-set test's two snake_case lists and its PascalCase list:

**P1.23** `skills/kisou/scripts/doc-system-check.test.js` — replace all 2 occurrences of these 1 lines

```text
      "requirements/AGENTS.md",
```

**P1.23 →**

```text
      "experience/AGENTS.md",
```

**P1.24** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 1 lines

```text
      "Requirements/AGENTS.md",
```

**P1.24 →**

```text
      "Experience/AGENTS.md",
```

The foreign-H1 test, followed by the two new tests of spec section 6 — a docs root holding `requirements/AGENTS.md` and no `experience/AGENTS.md` gets the `create` item and the note; one holding both gets no note:

**P1.25** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 10 lines

```text
  write(path.join(docs, "requirements", "AGENTS.md"), "# Requirements\n\nOurs.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/requirements/AGENTS.md — not kisou-managed: first heading is "# Requirements", expected "# requirements/ — AGENTS"`,
    ),
  );
  assert.match(result.out, /^0 items, 1 note$/m);
});
```

**P1.25 →**

```text
  write(path.join(docs, "experience", "AGENTS.md"), "# Experience\n\nOurs.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/experience/AGENTS.md — not kisou-managed: first heading is "# Experience", expected "# experience/ — AGENTS"`,
    ),
  );
  assert.match(result.out, /^0 items, 1 note$/m);
});

// --- the type's name before 2026-09: one note, never an item ---------------

test("a docs root holding requirements/ and no experience/ gets the create item and one note", () => {
  const { templates, docs } = fakeInstall();
  const legacy = path.join(docs, "requirements");
  fs.renameSync(path.join(docs, "experience"), legacy);
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^1\. create: .*experience\/AGENTS\.md$/m);
  assert.ok(
    result.out.includes(
      `note: ${posix(legacy)}/ — the name the experience type had before 2026-09; renaming it is a hand migration, not an item`,
    ),
  );
  assert.match(result.out, /^1 item, 1 note$/m);
});

test("a docs root holding both requirements/ and experience/ gets no note", () => {
  const { templates, docs } = fakeInstall();
  const legacy = path.join(docs, "requirements");
  write(path.join(legacy, "AGENTS.md"), "Old.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(result.out, "0 items, 0 notes\n");
});
```

The compare-with-itself test reads the real template, now the experience one:

**P1.26** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 1 lines

```text
  const source = read(path.join(TEMPLATES, "requirements", "AGENTS.md"));
```

**P1.26 →**

```text
  const source = read(path.join(TEMPLATES, "experience", "AGENTS.md"));
```

**P1.27** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 5 lines

```text
  const template = "# requirements/ — AGENTS\n\nIntro.\n";
  assert.deepStrictEqual(classify(template, template, false), {
    managed: true,
    found: "# requirements/ — AGENTS",
    expected: "# requirements/ — AGENTS",
```

**P1.27 →**

```text
  const template = "# experience/ — AGENTS\n\nIntro.\n";
  assert.deepStrictEqual(classify(template, template, false), {
    managed: true,
    found: "# experience/ — AGENTS",
    expected: "# experience/ — AGENTS",
```

The insertion-position tests (case 5), the note-has-no-number test, and the real-copy test all take their target from the same line:

**P1.28** `skills/kisou/scripts/doc-system-check.test.js` — replace all 5 occurrences of these 1 lines

```text
  const target = path.join(docs, "requirements", "AGENTS.md");
```

**P1.28 →**

```text
  const target = path.join(docs, "experience", "AGENTS.md");
```

**P1.29** `skills/kisou/scripts/doc-system-check.test.js` — replace all 2 occurrences of these 1 lines

```text
    ["# requirements/ — AGENTS", "## File", "## Body", "## Growth"],
```

**P1.29 →**

```text
    ["# experience/ — AGENTS", "## File", "## Body", "## Growth"],
```

**P1.30** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 1 lines

```text
    ["# requirements/ — AGENTS", "## File", "## Growth"],
```

**P1.30 →**

```text
    ["# experience/ — AGENTS", "## File", "## Growth"],
```

**P1.31** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 6 lines

```text
  write(target, "# Requirements\n\nOurs.\n");
  const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.match(listed.out, /^0 items, 1 note$/m);
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 2);
  assert.strictEqual(read(path.join(docs, "requirements", "AGENTS.md")), "# Requirements\n\nOurs.\n");
```

**P1.31 →**

```text
  write(target, "# Experience\n\nOurs.\n");
  const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.match(listed.out, /^0 items, 1 note$/m);
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 2);
  assert.strictEqual(read(target), "# Experience\n\nOurs.\n");
```

The real-copy test (case 5 on the shipped template): its comment, its title, and its body, which now deletes the section `## experience vs issues` — up to `## Reading path`, the heading after it — and expects section 2's fourteen headings back in order:

**P1.32** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 1 lines

```text
// The spec writes case 5 against the shipped `requirements` template, and task
```

**P1.32 →**

```text
// The spec wrote case 5 against the shipped `requirements` template (now `experience`), and task
```

**P1.33** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 1 lines

```text
test("a section deleted from the real requirements copy is re-inserted in place", () => {
```

**P1.33 →**

```text
test("a section deleted from the real experience copy is re-inserted in place", () => {
```

**P1.34** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 11 lines

```text
  const start = text.indexOf("## requirements vs issues");
  const end = text.indexOf("## Growth", start);
  assert.ok(start > 0 && end > start);
  write(target, text.slice(0, start) + text.slice(end));
  const before = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(before.code, 1);
  assert.match(before.out, /^1\. add: .*requirements\/AGENTS\.md — ## requirements vs issues$/m);
  assert.strictEqual(run(["apply", "--items", "1", "--docs", docs, "--case", "snake_case"]).code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# requirements/ — AGENTS", "## File", "## Frontmatter", "## Body", "## requirements vs issues", "## Growth"],
```

**P1.34 →**

```text
  const start = text.indexOf("## experience vs issues");
  const end = text.indexOf("## Reading path", start);
  assert.ok(start > 0 && end > start);
  write(target, text.slice(0, start) + text.slice(end));
  const before = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(before.code, 1);
  assert.match(before.out, /^1\. add: .*experience\/AGENTS\.md — ## experience vs issues$/m);
  assert.strictEqual(run(["apply", "--items", "1", "--docs", docs, "--case", "snake_case"]).code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    [
      "# experience/ — AGENTS",
      "## File",
      "## Frontmatter",
      "## Body",
      "## Expectations",
      "## Sources",
      "## The hub",
      "## Identifiers",
      "## What is an experience fragment",
      "## experience vs issues",
      "## Reading path",
      "## Situations",
      "## Worked example",
      "## Lifecycle",
    ],
```

The trailing-space H1 test:

**P1.35** `skills/kisou/scripts/doc-system-check.test.js` — replace exactly these 6 lines

```text
  write(path.join(docs, "requirements", "AGENTS.md"), "# requirements/ — AGENTS \n\nOurs.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/requirements/AGENTS.md — not kisou-managed: first heading is "# requirements/ — AGENTS ", expected "# requirements/ — AGENTS"`,
```

**P1.35 →**

```text
  write(path.join(docs, "experience", "AGENTS.md"), "# experience/ — AGENTS \n\nOurs.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/experience/AGENTS.md — not kisou-managed: first heading is "# experience/ — AGENTS ", expected "# experience/ — AGENTS"`,
```

**A1.1** `skills/kisou/scripts/doc-system-check.test.js` — `grep -c '^test(' skills/kisou/scripts/doc-system-check.test.js` — before: 57, after: 59

**A1.2** `skills/kisou/scripts/doc-system-check.test.js` — `grep -c 'requirements' skills/kisou/scripts/doc-system-check.test.js` — before: 29, after: 5

The five lines that still say `requirements` are P1.32's comment and, in each of the two new tests, its title and its `legacy` line — the old name is what those tests are about. Run the suite; the version is printed first, so the runtime claim is a run:

```bash
# tree-state
node --version
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { echo 'Node 22 or later is required'; exit 1; }
out=$(node --test --test-reporter=tap 'skills/kisou/scripts/*.test.js' 2>&1)
printf '%s\n' "$out" | grep -E '^# (tests|pass|fail) '
printf '%s\n' "$out" | grep -q '^# fail 0$' || { printf '%s\n' "$out" | grep -B2 -A12 '^not ok'; exit 1; }
```

Expected: a `v2x.y.z` line of 22 or later, then `# tests 59`, `# pass 59`, `# fail 0` — the 57 cases before this plan plus the two new ones. A failure prints the failing case.

- [ ] **Step 4: Delete the `requirements` template**

```bash
# tree-state
git rm skills/kisou/templates/docs/requirements/AGENTS.md
```

- [ ] **Step 5: Regenerate the installed copies with the instrument**

List what the instrument would write. The new `TYPES` no longer names `docs/requirements/`, and `docs/experience/AGENTS.md` does not exist yet, so this one run also exercises P1.19's note against the real tree:

```bash
# tree-state
node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case | grep -v '^[-+]'; true
```

Expected, the diff blocks filtered out:

```text
1. replace: docs/AGENTS.md — ## Document management
2. replace: docs/AGENTS.md — ### Cross-references
3. replace: docs/AGENTS.md — ## Session shoroku (excerpting)
4. create: docs/experience/AGENTS.md
5. replace: docs/design/AGENTS.md — ## Body
6. replace: docs/decisions/AGENTS.md — # decisions/ — AGENTS
7. replace: docs/decisions/AGENTS.md — ## Body (MADR-lite)
8. replace: docs/issues/AGENTS.md — # issues/ — AGENTS
9. replace: docs/issues/AGENTS.md — ## Body
note: docs/requirements/ — the name the experience type had before 2026-09; renaming it is a hand migration, not an item
9 items, 1 note
```

A different list means a template passage above was applied differently than written: stop and report it, do not apply. Then apply every item, and check again:

```bash
# tree-state
n=$(node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case | tail -1 | cut -d' ' -f1)
[ "$n" = 9 ] || { echo "expected 9 items, found $n"; exit 1; }
node skills/kisou/scripts/doc-system-check.js apply --docs docs --case snake_case --items 1,2,3,4,5,6,7,8,9 || exit 1
node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case
git add docs/experience/AGENTS.md
```

Expected: nine numbered lines and `9 items applied`, then `0 items, 0 notes` and exit `0` — the note is gone because `docs/experience/AGENTS.md` now exists, and `docs/requirements/AGENTS.md` is outside the target set.

- [ ] **Step 6: Verify**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task 1
```

Expected: `task 1: verify clean`.

- [ ] **Step 7: Lint the changed paths, then commit once**

```bash
# tree-state
./scripts/lint.sh skills/kisou/templates/docs/experience/AGENTS.md skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md skills/kisou/templates/docs/decisions/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/CONTRIBUTING.md skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js docs/AGENTS.md docs/design/AGENTS.md docs/decisions/AGENTS.md docs/issues/AGENTS.md docs/experience/AGENTS.md
```

Expected: every hook passes, `kisou-doc-system-check` among them. A hook that auto-fixes leaves its change unstaged: re-run until clean. Then commit every path of the set in **one** commit — the deleted template included, since `--only` records a removal it is named:

```bash
# tree-state
git commit --only skills/kisou/templates/docs/experience/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md skills/kisou/templates/docs/decisions/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/CONTRIBUTING.md skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js docs/AGENTS.md docs/design/AGENTS.md docs/decisions/AGENTS.md docs/issues/AGENTS.md docs/experience/AGENTS.md
```

Subject: `feat(kisou): docs/requirements becomes docs/experience in the doc-system templates`. End the message with your own `Co-Authored-By:` trailer. The hook must accept the commit; never bypass it. Then restore the two created files' line endings — each was written `w/lf` and the commit normalized it:

```bash
# tree-state
git checkout -- skills/kisou/templates/docs/experience/AGENTS.md docs/experience/AGENTS.md
git ls-files --eol skills/kisou/templates/docs/experience/AGENTS.md docs/experience/AGENTS.md
git status --porcelain --untracked-files=no
```

Expected: both `i/lf w/crlf`, and no tracked change left.

- [ ] **Step 8: Move issue-a9c3 and issue-c477 to `resolved/`, in a second commit**

Spec section 5 settles both (D-7): P1.11 is issue-a9c3's sentence and P1.10 issue-c477's.

```bash
# tree-state
git mv docs/issues/open/a9c3-the-decisions-agents-file-has-no-rule-for-a-path-that-no-longer-exists.md docs/issues/resolved/a9c3-the-decisions-agents-file-has-no-rule-for-a-path-that-no-longer-exists.md
git mv docs/issues/open/c477-an-adr-accepted-on-a-branch-may-be-corrected-until-the-merge.md docs/issues/resolved/c477-an-adr-accepted-on-a-branch-may-be-corrected-until-the-merge.md
```

Set each moved file's frontmatter `updated:` to today's date (UTC) by hand — one line each, not a passage: the date is the run's. Then load both frontmatters for real, lint, and commit with **both paths of each move** under `--only` (issue-9350):

```bash
# tree-state
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py docs/issues/resolved/a9c3-the-decisions-agents-file-has-no-rule-for-a-path-that-no-longer-exists.md docs/issues/resolved/c477-an-adr-accepted-on-a-branch-may-be-corrected-until-the-merge.md
./scripts/lint.sh docs/issues/resolved/a9c3-the-decisions-agents-file-has-no-rule-for-a-path-that-no-longer-exists.md docs/issues/resolved/c477-an-adr-accepted-on-a-branch-may-be-corrected-until-the-merge.md
git commit --only docs/issues/open/a9c3-the-decisions-agents-file-has-no-rule-for-a-path-that-no-longer-exists.md docs/issues/resolved/a9c3-the-decisions-agents-file-has-no-rule-for-a-path-that-no-longer-exists.md docs/issues/open/c477-an-adr-accepted-on-a-branch-may-be-corrected-until-the-merge.md docs/issues/resolved/c477-an-adr-accepted-on-a-branch-may-be-corrected-until-the-merge.md
```

Subject: `docs(issues): resolve issue-a9c3 and issue-c477 — the decisions template carries both rules`. End the message with your own `Co-Authored-By:` trailer. Done when: the phase A fences of "How a batch is verified" pass — `check` exits `0`, `node --version` printed and 22 or later, the suite at `# pass 59`, `a9c3 and c477 in resolved/: 2` — the hook accepted the first commit, lint passed on every path, and `git status --porcelain --untracked-files=no` prints nothing.

### Task 2: The hub template, kisou's `SKILL.md`, and its README's drift review

**Files:**

- Create: `skills/kisou/templates/docs/experience.md` (W2.1)
- Modify: `skills/kisou/SKILL.md` (Scope; Step 2's dir-names list; Step 3 scaffold item 3; Step 3 migrate's doc-system bullets)
- Review, edit only on drift: `skills/kisou/README.md`
- Move: `docs/issues/open/3bbb-kisou-scope-bullet-promises-an-issue-status-skeleton-nobody-creates.md` and `docs/issues/open/a331-kisou-none-bullet-overstates-the-tally-as-seven-targets.md` to `docs/issues/resolved/`

**Interfaces:**

- Consumes: Task 1's `TYPES` (the scaffold list and the mapping list repeat it) and the note text of P1.19 (P2.7 describes it); the type rules' The hub section (W1.1), which the hub template's headings follow.
- Produces: the hub template, which Task 4's `docs/experience.md` is filled from.

Spec sections 3 (the template) and 6 (`SKILL.md`, the README review, issue-3bbb and issue-a331). The hub template sits under `skills/kisou/templates/docs/`, so its commit runs the `kisou-doc-system-check` hook, which passes: the hub is in no target set (P2.4 says so in `SKILL.md`), and Task 1 left every copy level.

**Named mechanisms this task touches.**

- **The hub** (W2.1, P2.1, P2.4): the type rules' The hub section (W1.1); `docs/AGENTS.md`'s type table and flat-types paragraph (P1.1, P1.2, P1.6); `docs/design/c1d2-kisou.md`'s Shape (Task 7, P7.6, P7.7); the hub itself (Task 4, W4.1).
- **`TYPES`** (P2.2, P2.3, P2.5): the instrument's line 22 and its test (P1.18, P1.20); the type table (P1.1).
- **The note on `requirements/`** (P2.7): P1.19 writes it and P1.25 asserts it.
- **The `TEMPLATE FILL` block** (W2.1, P2.4): `SKILL.md` Step 3 item 2 (d), which P2.4 points at; the CONTRIBUTING template's own block (P1.15).

**Old values this task must clear.**

**O2.1** `{requirements,design,decisions,notes,reports}` — the scaffold's directory list. `skills/kisou/SKILL.md` 1 — 0 after this task (P2.3). **May stay:** `docs/superpowers/**` 2.

**O2.2** `requirements / design / decisions` — the managed-type list, plural. `skills/kisou/SKILL.md` 1 — 0 after this task (P2.5). `skills/shoroku/SKILL.md` 1 is Task 3's (P3.1); `README.md` 1 is Task 7's (P7.19); `docs/requirements/3c4d-shoroku.md` 1 goes with the directory in Task 8. **May stay:** `docs/superpowers/**` 5.

**O2.3** `all seven targets are absent` — issue-a331's sentence. `skills/kisou/SKILL.md` 1 — 0 after this task (P2.6). **May stay:** `docs/issues/open/a331-…` 2, moved to `resolved/` by this task — the closed record quotes it; `docs/superpowers/**` 2.

**O2.4** `skeleton), and` — issue-3bbb's skeleton promise, at the word after it. `skills/kisou/SKILL.md` 1 — 0 after this task (P2.1); `docs/design/c1d2-kisou.md` 1 is Task 7's (P7.6), its copy of the sentence. The quote inside `docs/issues/open/3bbb-…` ends the line at `skeleton)` and does not match; the issue moves to `resolved/` in this task.

**O2.5** `sessions or memory` — `skills/kisou/README.md` 1 (line 50, `shoroku` "fills it by excerpting sessions or memory"). **May stay:** it names two of shoroku's three source modes, the omission issue-0d43 names for shoroku's own README; it is not drift from this task's `SKILL.md` edits, so Step 3 does not edit it and the batch report carries it as a Shoroku proposal item.

- [ ] **Step 1: Write the hub template**

**W2.1** `skills/kisou/templates/docs/experience.md` — new file, 24 lines

```markdown
<!-- TEMPLATE FILL: replace every <...> below with the project's own words;
     delete this block and the markdownlint-disable line once no <...> remains. -->
<!-- markdownlint-disable MD033 -->
# Experience

The goal layer of <project name>: who uses it, what they take for granted,
and what the maintainer has ruled out. Scenes live in `{{experience}}/`; this
file is hand-written and is the first thing to read.

## Cast

- **<actor>** — <who they are and how they meet the project, one line>

## Drivers

At most five at MUST level. Each generalizes the expectations it points at.

- **<id>** MUST|MUST NOT|SHOULD|SHOULD NOT <the driver> ← exp-<id>, exp-<id>

## Won't

What has been ruled out for this project, so that nobody proposes it again.

- **<id>** <the thing not to build, and in one clause why>
```

Spec section 3's text exactly. The `TEMPLATE FILL` block is what makes its `<...>` free text under decision `0590`'s rule, and the `markdownlint-disable MD033` line is what keeps a bare `<actor>` from being inline HTML to this repository's markdownlint, which lints `skills/kisou/templates/docs/` in place — measured at drafting: both lines present, 0 errors. Write it with the Write tool and stage it:

```bash
# tree-state
git add skills/kisou/templates/docs/experience.md
```

- [ ] **Step 2: Edit `skills/kisou/SKILL.md`**

Scope — issue-3bbb's skeleton promise goes, and the hub joins the doc-system:

**P2.1** `skills/kisou/SKILL.md` — replace exactly these 4 lines

```text
- **Produces:** `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`, a slim top-level
  `AGENTS.md`, the `docs/` doc-management system (`docs/AGENTS.md` +
  `docs/<type>/AGENTS.md` + the `docs/issues/{open,deferred,resolved}/`
  skeleton), and — on request — empty script files.
```

**P2.1 →**

```text
- **Produces:** `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`, a slim top-level
  `AGENTS.md`, the `docs/` doc-management system (`docs/AGENTS.md`, the
  per-type `docs/<type>/AGENTS.md` under the cased type directories, and the
  hand-written hub `docs/experience.md`), and — on request — empty script
  files.
```

Step 2, the dir-names mapping list:

**P2.2** `skills/kisou/SKILL.md` — replace exactly these 1 lines

```text
  `{{requirements}}`, `{{design}}`, `{{decisions}}`, `{{issues}}`, `{{notes}}`,
```

**P2.2 →**

```text
  `{{experience}}`, `{{design}}`, `{{decisions}}`, `{{issues}}`, `{{notes}}`,
```

Step 3 (scaffold) item 3 — the directory list, and the hub's copy at the item's end:

**P2.3** `skills/kisou/SKILL.md` — replace exactly these 1 lines

```text
   `{requirements,design,decisions,notes,reports}/` (each title-cased for
```

**P2.3 →**

```text
   `{experience,design,decisions,notes,reports}/` (each title-cased for
```

**P2.4** `skills/kisou/SKILL.md` — replace exactly these 1 lines

```text
   first issue lands there (those names stay lowercase).
```

**P2.4 →**

```text
   first issue lands there (those names stay lowercase). Copy
   `templates/docs/experience.md` to the cased docs root as the hub,
   expanding its `{{name}}` as in step (a), filling its `<...>` from the
   inputs where they are known and leaving the rest for the author, and
   deleting its `TEMPLATE FILL` block as in step (d); this file is written
   once and is not a doc-system copy the instrument checks.
```

Step 3 (migrate), the doc-system classification, the `none` bullet (issue-a331), and the `partial` bullet's non-standard subdirectories:

**P2.5** `skills/kisou/SKILL.md` — replace exactly these 1 lines

```text
  `{docs,Documents}/<type>/AGENTS.md` (requirements / design / decisions /
```

**P2.5 →**

```text
  `{docs,Documents}/<type>/AGENTS.md` (experience / design / decisions /
```

**P2.6** `skills/kisou/SKILL.md` — replace exactly these 3 lines

```text
  - **none** (no doc-system artifacts) → all seven targets are absent; each is
    one of the instrument's `create` items. The class says what is absent and
    nothing more; it sets no scope.
```

**P2.6 →**

```text
  - **none** (no doc-system artifacts) → all five tallied targets are absent,
    and the two flat copies with them; each is one of the instrument's
    `create` items. The class says what is absent and nothing more; it sets no
    scope.
```

**P2.7** `skills/kisou/SKILL.md` — replace exactly these 2 lines

```text
    **exempt from the `<id>-<slug>` naming rules** — its own tool's convention
    wins. The `open`/`deferred`/`resolved` status subdirs are created on demand
```

**P2.7 →**

```text
    **exempt from the `<id>-<slug>` naming rules** — its own tool's convention
    wins. A `requirements/` directory is one such — the name this type had
    before `experience/`; the instrument says so in a note, and the rename is
    a hand migration this skill does not perform. The
    `open`/`deferred`/`resolved` status subdirs are created on demand
```

The `full` bullet's parenthesis, the `docs/` doc-system bullet's "(all seven, for a `none` doc-system …)" — the instrument still enumerates seven targets, the root and six — and the `description` frontmatter, which names no type, stand (spec section 6).

- [ ] **Step 3: Review `skills/kisou/README.md` for drift**

The repository's `AGENTS.md` asks for this after any `SKILL.md` edit. Read the whole file against Step 2's edits. Measured at drafting, and expected: **no drift from this task's edits** — line 9's "the `docs/` document-management system" names no type, and by P2.1 the hub is part of that system; line 16's "(or a doc-system `AGENTS.md`)" is still exact, since the hub is scaffolded once and never refreshed; line 42 names the system without its types. Do not edit the file. The one sentence the review does find is not this task's drift — O2.5's line 50; record it in the batch report as a Shoroku proposal item ("kisou's README names two of shoroku's three source modes, as issue-0d43 did for shoroku's own") and leave the file unchanged. If the review finds anything else, report it rather than editing.

- [ ] **Step 4: Move issue-3bbb and issue-a331 to `resolved/`**

P2.1 closes issue-3bbb — its second site, `docs/design/c1d2-kisou.md`, is Task 7's P7.6 — and P2.6 closes issue-a331.

```bash
# tree-state
git mv docs/issues/open/3bbb-kisou-scope-bullet-promises-an-issue-status-skeleton-nobody-creates.md docs/issues/resolved/3bbb-kisou-scope-bullet-promises-an-issue-status-skeleton-nobody-creates.md
git mv docs/issues/open/a331-kisou-none-bullet-overstates-the-tally-as-seven-targets.md docs/issues/resolved/a331-kisou-none-bullet-overstates-the-tally-as-seven-targets.md
```

Set each moved file's frontmatter `updated:` to today's date (UTC) by hand — one line each; the date is the run's, so it is not a passage.

- [ ] **Step 5: Verify**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task 2
```

Expected: `task 2: verify clean`.

- [ ] **Step 6: Lint, commit, and restore the created file's line endings**

```bash
# tree-state
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py skills/kisou/SKILL.md docs/issues/resolved/3bbb-kisou-scope-bullet-promises-an-issue-status-skeleton-nobody-creates.md docs/issues/resolved/a331-kisou-none-bullet-overstates-the-tally-as-seven-targets.md
./scripts/lint.sh skills/kisou/templates/docs/experience.md skills/kisou/SKILL.md docs/issues/resolved/3bbb-kisou-scope-bullet-promises-an-issue-status-skeleton-nobody-creates.md docs/issues/resolved/a331-kisou-none-bullet-overstates-the-tally-as-seven-targets.md
```

Expected: nothing printed by the frontmatter check; every hook passes, `kisou-doc-system-check` among them. Then commit, both paths of each move named (issue-9350):

```bash
# tree-state
git commit --only skills/kisou/templates/docs/experience.md skills/kisou/SKILL.md docs/issues/open/3bbb-kisou-scope-bullet-promises-an-issue-status-skeleton-nobody-creates.md docs/issues/resolved/3bbb-kisou-scope-bullet-promises-an-issue-status-skeleton-nobody-creates.md docs/issues/open/a331-kisou-none-bullet-overstates-the-tally-as-seven-targets.md docs/issues/resolved/a331-kisou-none-bullet-overstates-the-tally-as-seven-targets.md
git checkout -- skills/kisou/templates/docs/experience.md
git ls-files --eol skills/kisou/templates/docs/experience.md
git status --porcelain --untracked-files=no
```

Subject: `feat(kisou): the hub template, and SKILL.md names experience; resolve issue-3bbb and issue-a331`. End the message with your own `Co-Authored-By:` trailer. Expected after the commit: `i/lf w/crlf` for the template, and no tracked change left. Done when: this task's `verify` is clean, the hook accepted the commit, `grep -c '<!--' skills/kisou/templates/docs/experience.md` is `2`, and both issues are under `resolved/`.

### Task 3: shoroku's `SKILL.md` and README

**Files:**

- Modify: `skills/shoroku/SKILL.md` (the frontmatter `description`; Step 3's two paragraphs; recommend mode)
- Modify: `skills/shoroku/README.md` (lines 3-5, 9-10, and 16-18)
- Move: `docs/issues/open/0d43-shoroku-readme-what-it-does-names-two-of-three-source-modes.md` to `docs/issues/resolved/`

**Interfaces:**

- Consumes: the type rules (W1.1), which the new Step 3 sentence defers to by path; `docs/AGENTS.md`'s Propose step (P1.8), which "the experience pairing" names.
- Produces: the recommend-mode text Task 5's dispatch runs — `[inferred]` and mechanism-laden experience items grouped `Unsure`, and the translation rule for an `[inferred]` item. Task 5 dispatches the skill **as this task leaves it** (Global Constraints, contract rule 11).

Spec section 7, the README half of section 6, and issue-0d43. The classification rule for the fourth target stays in the type file (Fixed input 13): this task adds to `SKILL.md` only the sentence that the target exists and the one grouping sentence, so issue-2c4d is not worsened. Apply mode's text is unchanged — "per the per-type `AGENTS.md`" already covers a scene.

**Named mechanisms this task touches.**

- **The trust tags** (P3.3 to P3.5): the type rules' Expectations and Sources (W1.1); `docs/AGENTS.md` step 2 (P1.8); `docs/design/e3f4-shoroku.md`'s added paragraph and its translation paragraph (Task 7, P7.4 and P7.5), which restate this task's two recommend-mode sentences; both dispatches (Tasks 5, 6), which rely on them.
- **The `exp-` pairing** (P3.3, P3.5): `docs/AGENTS.md` step 3 (P1.8); the design template bullet (P1.9); `docs/design/e3f4-shoroku.md`'s Classification subsection (Task 7, P7.2, P7.3).
- **The `Source:` line**: `SKILL.md` lines 59-63 are unchanged and checked — the migration writes through the recommend/apply pointer, that sentence's second clause, not `Source: session`.

**Old values this task must clear.**

**O3.1** `carries the requirement` — Step 3's "the proposal carries the requirement / pairing" (the phrase wraps; this is its first line). `skills/shoroku/SKILL.md` 1 — 0 after this task (P3.3). **May stay:** `docs/superpowers/**` 7.

**O3.2** `requirement or ADR item` — recommend mode's translation rule. `skills/shoroku/SKILL.md` 1 — 0 after this task (P3.5); the same sentence's `req-<id>` pairing, one line above, sits inside backticks and is P3.5's `verify`'s to check. **May stay:** `docs/decisions/ace0-…` 1 (an ADR body), `docs/superpowers/**` 6.

**O3.3** `a requirement or an ADR item` — the same rule in Kanri's words, `skills/tanto/roles/kanri.md` 1 (line 1017, which also says "the `req-<id>` it serves"). **May stay:** no task edits `skills/tanto/` (Global Constraints); it is a sixth tanto site beside the five of the spec's Deferred item 3, and Self-Review names it for the rider list. `docs/superpowers/**` 5.

**O3.4** `session, or accumulated memory, into` — the README's opening, two of three modes. `skills/shoroku/README.md` 1 — 0 after this task (P3.6).

**O3.5** `**session** (default) or **memory**` — the "What it does" bullet issue-0d43 names. `skills/shoroku/README.md` 1 — 0 after this task (P3.8). **May stay:** `docs/issues/open/0d43-…` 1, moved to `resolved/` by this task; `docs/superpowers/**` 2.

**O3.6** `**requirements**, **design**` — the README's managed four. `skills/shoroku/README.md` 1 — 0 after this task (P3.7). **May stay:** `docs/superpowers/**` 3.

Two of the spec's needles for this file are Task 1's and Task 2's entities, and this task clears their last `skills/` sites: O1.4 (`requirements vs issues`, by P3.3), O1.10 (`requirement / design /`, by P3.2), and O2.2 (`requirements / design / decisions`, by P3.1).

- [ ] **Step 1: Edit `skills/shoroku/SKILL.md`**

The frontmatter `description` — one word changes, and the value must stay free of a colon followed by a space, which breaks frontmatter parsing without an error:

**P3.1** `skills/shoroku/SKILL.md` — replace exactly these 1 lines

```text
description: Shoroku (抄録 — excerpt and record) the working session, accumulated memory, or named Markdown files into a project's docs (requirements / design / decisions / issues / notes / reports) under `docs/`, following the in-repo AGENTS.md document-management system. Triggers on `抄録して`, `shorokuして`, `セッション抄録`; memory mode on `memory から抄録`, `shoroku from memory`; file mode on `<path> を抄録`, `shoroku from <path>`.
```

**P3.1 →**

```text
description: Shoroku (抄録 — excerpt and record) the working session, accumulated memory, or named Markdown files into a project's docs (experience / design / decisions / issues / notes / reports) under `docs/`, following the in-repo AGENTS.md document-management system. Triggers on `抄録して`, `shorokuして`, `セッション抄録`; memory mode on `memory から抄録`, `shoroku from memory`; file mode on `<path> を抄録`, `shoroku from <path>`.
```

Step 3, first paragraph:

**P3.2** `skills/shoroku/SKILL.md` — replace exactly these 1 lines

```text
(requirement / design / decision / issue), whole files into the two flat
```

**P3.2 →**

```text
(experience / design / decision / issue), whole files into the two flat
```

Step 3, second paragraph — the split's new name, the experience pairing, and the one sentence that the fourth target exists and where its rule lives:

**P3.3** `skills/shoroku/SKILL.md` — replace exactly these 3 lines

```text
Classification follows the two splits the type files define — design vs
decisions, requirements vs issues — and the proposal carries the requirement
pairing `docs/AGENTS.md`'s Propose step defines; neither is restated here.
```

**P3.3 →**

```text
Classification follows the two splits the type files define — design vs
decisions, experience vs issues — and the proposal carries the experience
pairing `docs/AGENTS.md`'s Propose step defines; neither is restated here.
Experience is the one type whose candidate may be assembled from scattered
remarks, tagged and capped as `docs/experience/AGENTS.md` says; the other
three are stated only.
```

Recommend mode — the grouping sentence, after the `Recommended fix` rule:

**P3.4** `skills/shoroku/SKILL.md` — replace exactly these 2 lines

```text
allow — a file outside the paths it names — is grouped `Recommended reject`
with the correction in the reason. A line in a source proposal that
```

**P3.4 →**

```text
allow — a file outside the paths it names — is grouped `Recommended reject`
with the correction in the reason. An experience item that is `[inferred]`,
or whose wording names a path, a command, a config key, a file format, a role
count, or a tool, is grouped `Unsure` with the reason named, so that the human
sees the inference or the mechanism before it is written. A line in a source
proposal that
```

Recommend mode — the pairing and the translation rule:

**P3.5** `skills/shoroku/SKILL.md` — replace exactly these 3 lines

```text
one-line reason, the `req-<id>` pairing for a `design` entry, and — for a
requirement or ADR item — the original wording followed by a reference
translation in the chat's language. Do not wait for `Direction?`, and write
```

**P3.5 →**

```text
one-line reason, the `exp-<id>` pairing for a `design` entry, and — for an
ADR item, and for an `[inferred]` experience item — the original wording
followed by a reference translation in the chat's language; a `[stated]`
experience item carries its quote in Sources and needs none. Do not wait for
`Direction?`, and write
```

**A3.1** `skills/shoroku/SKILL.md` — `grep -o 'inferred' skills/shoroku/SKILL.md | wc -l` — before: 0, after: 2

**A3.2** `skills/shoroku/SKILL.md` — `grep -c 'Kano\|RFC 2119' skills/shoroku/SKILL.md` — before: 0, after: 0

A3.1's two are both in recommend mode, P3.4's and P3.5's; A3.2 says the strength vocabulary stayed in the type file. Load the frontmatter with a real YAML parser and assert the value, not only that it parses:

```bash
# tree-state
uv run --no-project --with pyyaml python -c '
import sys, yaml
text = open("skills/shoroku/SKILL.md", encoding="utf-8").read().replace("\r\n", "\n")
assert text.startswith("---\n"), "no frontmatter"
data = yaml.safe_load(text[4:text.index("\n---\n", 4)])
assert isinstance(data, dict) and data.get("name") == "shoroku", data
assert "(experience / design / decisions / issues / notes / reports)" in data["description"], data["description"]
print("description loads,", len(data["description"]), "characters")
'
```

Expected: one `description loads, <n> characters` line and exit `0`. (The line prints no text of the value: this host's console is cp932, and the value holds an em dash.)

- [ ] **Step 2: Edit `skills/shoroku/README.md`**

The opening sentence gains the third mode (spec section 6):

**P3.6** `skills/shoroku/README.md` — replace exactly these 3 lines

```text
抄録 — "excerpt and record." A Claude skill that excerpts a working
session, or accumulated memory, into a project's living documents, and
maintains the agent-agnostic document-management system that governs them.
```

**P3.6 →**

```text
抄録 — "excerpt and record." A Claude skill that excerpts a working
session, accumulated memory, or named Markdown files into a project's living
documents, and maintains the agent-agnostic document-management system that
governs them.
```

**P3.7** `skills/shoroku/README.md` — replace exactly these 1 lines

```text
  **requirements**, **design**, **decisions** (ADRs), **issues**
```

**P3.7 →**

```text
  **experience**, **design**, **decisions** (ADRs), **issues**
```

The "What it does" bullet issue-0d43 itself names — its fix is "the word 'file' and its parenthetical in that bullet, matching Usage":

**P3.8** `skills/shoroku/README.md` — replace exactly these 3 lines

```text
- On a trigger, excerpts the current **session** (default) or **memory**
  (explicit) into those docs: classify → numbered proposal → you partially
  accept → one git commit.
```

**P3.8 →**

```text
- On a trigger, excerpts the current **session** (default), **memory**
  (explicit), or named Markdown **files** (explicit) into those docs: classify
  → numbered proposal → you partially accept → one git commit.
```

Then review the rest of the README against Step 1 (the repository's `AGENTS.md` asks for it after a `SKILL.md` edit): the recommend/apply bullet (lines 19-27) names no type and no pairing, and Layout names none; expected, nothing further to edit — report anything else rather than editing it.

- [ ] **Step 3: Move issue-0d43 to `resolved/`**

```bash
# tree-state
git mv docs/issues/open/0d43-shoroku-readme-what-it-does-names-two-of-three-source-modes.md docs/issues/resolved/0d43-shoroku-readme-what-it-does-names-two-of-three-source-modes.md
```

Set its frontmatter `updated:` to today's date (UTC) by hand.

- [ ] **Step 4: Verify**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task 3
```

Expected: `task 3: verify clean`.

- [ ] **Step 5: Lint and commit**

```bash
# tree-state
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py skills/shoroku/SKILL.md docs/issues/resolved/0d43-shoroku-readme-what-it-does-names-two-of-three-source-modes.md
./scripts/lint.sh skills/shoroku/SKILL.md skills/shoroku/README.md docs/issues/resolved/0d43-shoroku-readme-what-it-does-names-two-of-three-source-modes.md
git commit --only skills/shoroku/SKILL.md skills/shoroku/README.md docs/issues/open/0d43-shoroku-readme-what-it-does-names-two-of-three-source-modes.md docs/issues/resolved/0d43-shoroku-readme-what-it-does-names-two-of-three-source-modes.md
```

Subject: `feat(shoroku): experience is the fourth extraction target; resolve issue-0d43`. End the message with your own `Co-Authored-By:` trailer. Done when: this task's `verify` is clean (A3.1 at `2`, A3.2 at `0`), the YAML load of Step 1 passed, lint passed, and `git status --porcelain --untracked-files=no` prints nothing.

### Task 4: This repository's hub, its seven scenes, and the exit-criterion note

**Files:**

- Create: `docs/experience.md` (W4.1)
- Create: seven scenes, `docs/experience/<id>-<slug>.md` — the ids are drawn in Step 2, so the paths are known only then
- Create: `docs/notes/experience-layer-exit-criterion.md` (W4.2)
- Create, untracked: `.tanto/experience-layer/scene-check.js` (Step 3), which Tasks 6 and 9 run again

**Interfaces:**

- Consumes: the type rules (W1.1) — the scenes' form; the hub template (W2.1) — the hub's headings.
- Produces: the seven scenes and their item ids, the baseline Task 5's recommender reads and may propose edits to (Fixed input 19, D-4); the hub's Drivers and Won't; `.tanto/experience-layer/scene-check.js`.

Spec sections 1, 3 (the dotskills paragraph) and 10, and What the plan must contain's scenes paragraph. Its inputs are the two untracked files Global Constraints names: **the input** `.tanto/kikaku/2026-09-15-shoroku-experience-input.md` (§1 the scenes, §4 the quotes keyed by item id) and **the decision file** `.tanto/kikaku/2026-09-15-experience-layer.md` (§11 the nine confirmations; the human's words themselves are in its "The human's words, verbatim" section). Read both before Step 4. Neither is copied, moved, committed or deleted; a quote reaches a tracked file only as one Sources entry of one item.

**Named mechanisms this task touches.**

- **The trust tags**: every scene line carries one; the rule is W1.1's Expectations, and scene-check (Step 3) enforces the cap and the Sources forms that rule states.
- **The item ids and the scene ids** (Step 2): W1.1's Identifiers and `docs/AGENTS.md`'s `<id>` bullet (P1.3) are the rule; the recommend dispatch's final-ids rule (Task 5) excludes every id this task writes.
- **The `exp-` reference**: the hub's `←` links (W4.1), resolved by the phase B fence of "How a batch is verified".
- **The hub**: W4.1 fills W2.1's skeleton; W1.1's The hub section is its rule. It carries no trust tag on a Driver or a Won't item — the input's `[stated]` on the four Won't items is dropped (spec section 3).

- [ ] **Step 1: Write the hub and the note**

**W4.1** `docs/experience.md` — new file, 30 lines

```markdown
# Experience

The goal layer of dotskills: who uses it, what they take for granted, and
what the maintainer has ruled out. Scenes live in `experience/`; this file is
hand-written and is the first thing to read.

## Cast

- **maintainer** — the user. Solo developer of dotskills and of the projects that use kisou/shoroku. Works mostly with AI; returns to repos after weeks or months away.
- **agent** — Claude Code: Fable orchestrating, Opus/Sonnet subagents. Reads and writes the docs; starts every session cold.
- **collaborator** — a future human contributor who may not use AI at all.

## Drivers

At most five at MUST level. Each generalizes the expectations it points at.

- **b76a** MUST NOT lose the maintainer's reasons between conversation and repo ← exp-06d2, exp-1fb1
- **bf60** MUST NOT exclude non-AI human readers ← exp-37c2
- **c018** SHOULD keep the always-read set small ← exp-48b2, exp-b6bf
- **c233** SHOULD let the agent weigh stated concerns and propose alternatives ← exp-51d2, exp-58f1, exp-59eb
- **c60e** SHOULD NOT add human steps or gates just to capture reasons ← exp-0cfa, exp-75bc, exp-81aa

## Won't

What has been ruled out for this project, so that nobody proposes it again.

- **cab7** Rigorous requirements engineering (defining "user", "effort", etc.).
- **d061** Goal models or full traceability as an end.
- **d1b9** Bilingual `.ja.md` documents.
- **d443** A separate elicitation step ("WHY pass") before brainstorming — superseded by extraction inside shoroku.
```

The hub template (W2.1) filled for dotskills from the input's §1 Cast, Drivers, and Won't: the intro line's `<project name>` is dotskills, both comment lines are gone, the Drivers' `←` lists are the input's in `exp-` form, and neither a Driver nor a Won't item carries a trust tag. Two of the five Drivers are at MUST level. The Won't items keep the input's wording; the template's "in one clause why" is a prompt to an author, and no why is invented where the input gives none.

**W4.2** `docs/notes/experience-layer-exit-criterion.md` — new file, 38 lines

```markdown
# The experience layer's exit criterion

How the experience layer — `docs/experience.md` and the scenes under
`docs/experience/` — is judged: what would show that it earns its place, and
what would say to fold it back. Set by the `experience-layer` topic in
September 2026.

**What is measured, and why.** What the layer alone supplies is memory of
project-specific reasons. Model strength supplies the rest. The three outcomes the
maintainer expects of the layer — fewer questions at the spec and plan
stages, better-aimed recommendations, better improvement proposals — all move
with the model too, so none of them is the criterion by itself.

**Primary — unprompted use.** At each topic's close, count the `exp-` items
cited in the topic's spec, plan, ADRs, and review brief that the human did not
raise in that topic's `dialogue.md`, `spec-inputs.md`, or the Kikaku files
the topic cites: a `grep -o 'exp-[0-9a-f]\{4\}'` over the four documents,
set-minus the same grep over the dialogue and the inputs. Until a tanto topic
gives that count to the close's recommender or to Kanri, it is run by hand at
the close and written into the topic's dogfood report. **Zero across three
consecutive topics is the fold-back signal** — the number is the
maintainer's, set on 2026-09-30: fold the hub's Cast, Drivers, and Won't into
`AGENTS.md` and drop the scenes.

**Secondary — the counts the artifacts already carry**, compared only across
topics whose roster rows show the same model family for the seat that
produced them: per spec, the number of questions Sekkei put in
`dialogue.md`; the number of points in the review brief; and the number of
requirement or experience items a spec review or the human sent back as
design. The baseline is `tanto-context-ceiling`, `tanto-cost`, and
`tanto-sweep-2`, read from `.tanto/<topic>/` and the ledgers; it is taken
again when the model family changes.

**Not used:** the count of "I rejected that already" remarks.

This note is not the migration's record: the counts of the experience-layer
migration itself are in `docs/reports/`, in that topic's dogfood report, and
they are not this criterion's baseline.
```

Spec section 10 in prose, its `# H1` its title, no frontmatter. Write both files with the Write tool.

- [ ] **Step 2: Draw the seven scene ids**

The input's scenes are lettered A to G and carry no document id; each file id is drawn now, under the type rules' Identifiers — no file `docs/**/<id>-*.md`, no `**<id>**` line under `docs/experience/` or in the hub, no commit that ever used it — plus the letter rule, and none of the input's own item ids:

```bash
# tree-state
taken=" 06d2 0cfa 16c2 1fb1 2b72 37c2 3b2d 48b2 518b 51d2 58f1 59eb 6faa 75bc 78f6 802f 81aa 81e0 88a6 891a 8ea6 907b 948b 99ac a023 a545 ae58 b6bf b76a bf60 c018 c233 c60e cab7 d061 d1b9 d443 c4e1 "
ids=""
while [ "$(printf '%s' "$ids" | wc -w)" -lt 7 ]; do
  id=$(node -e 'console.log(require("node:crypto").randomUUID().slice(0, 4))')
  case "$id" in *[a-f]*) ;; *) continue ;; esac
  case "$taken$ids " in *" $id "*) continue ;; esac
  [ -z "$(find docs -name "$id-*.md")" ] || continue
  if grep -rqs "\*\*$id\*\*" docs/experience docs/experience.md; then continue; fi
  [ -z "$(git log --all --oneline -S"$id" -- docs)" ] || continue
  ids="$ids $id"
done
echo "scene ids:$ids"
```

Expected: `scene ids:` and seven 4-hex ids, each with a letter. Give them to scenes A to G in the order printed, and write the mapping into your report.

- [ ] **Step 3: Write the scene checker**

Write this file with the Write tool — it is untracked scratch under `.tanto/`, and Tasks 6 and 9 run it again. Without an argument it checks every scene's form; with `--seven` it also checks this task's seven scenes against the input:

```js
// scene-check.js — the experience-layer plan's check of docs/experience/<id>-<slug>.md.
// node .tanto/experience-layer/scene-check.js [--seven]
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const seven = process.argv.includes("--seven");
const dir = "docs/experience";
const files = fs.readdirSync(dir).filter((f) => /^[0-9a-f]{4}-.+\.md$/.test(f)).sort();
const problems = [];
const say = (f, m) => problems.push(`${f}: ${m}`);
const HEADINGS = ["## Scene", "## Expectations", "## Open questions", "## Sources"];
const LINE = /^- \*\*([0-9a-f]{4})\*\* \[(stated|inferred|confirmed)\] (MUST NOT|MUST|SHOULD NOT|SHOULD|MAY) \S/;
const items = new Map();

function section(body, heading) {
  const lines = body.split("\n");
  const start = lines.indexOf(heading);
  if (start < 0) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^## /.test(l));
  return end < 0 ? rest : rest.slice(0, end);
}

for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), "utf8").replace(/\r\n/g, "\n");
  const id = f.slice(0, 4);
  if (!/[a-f]/.test(id)) say(f, "the file id has no letter a-f");
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    say(f, "no frontmatter");
    continue;
  }
  if (!new RegExp(`^id: "${id}"$`, "m").test(fm[1])) say(f, `frontmatter id is not the quoted "${id}"`);
  const body = text.slice(fm[0].length);
  const heads = body.split("\n").filter((l) => /^#{1,6} /.test(l));
  if (heads.join("|") !== HEADINGS.join("|")) say(f, `headings are ${JSON.stringify(heads)}`);
  const sources = section(body, "## Sources").filter((l) => l.startsWith("- ["));
  const openIds = new Set(
    section(body, "## Open questions")
      .map((l) => l.match(/^- \*\*([0-9a-f]{4})\*\* /))
      .filter(Boolean)
      .map((m) => m[1]),
  );
  for (const l of section(body, "## Expectations")) {
    if (l === "" || l.startsWith("  ")) continue;
    const m = l.match(LINE);
    if (!m) {
      say(f, `not an expectation line: ${l}`);
      continue;
    }
    const [, item, tag, strength] = m;
    if (tag === "inferred" && strength.startsWith("MUST")) say(f, `${item} is [inferred] at ${strength}`);
    if (items.has(item)) say(f, `${item} is also in ${items.get(item).file}`);
    items.set(item, { file: f, tag, strength });
    const entry = sources.find((s) => s.startsWith(`- [${item}] `));
    if (!entry) say(f, `${item} has no Sources entry`);
    else if (tag === "stated" && !entry.includes("「")) say(f, `${item} is [stated] and its entry quotes nothing`);
    else if (tag === "confirmed" && !/; not stated directly\. Confirmed \d{4}-\d{2}-\d{2}: 「/.test(entry))
      say(f, `${item} is [confirmed] and its entry is not the confirmed form`);
    else if (tag === "inferred" && !entry.includes("not stated directly")) say(f, `${item} is [inferred] and its entry is not the inferred form`);
  }
  for (const s of sources) {
    const key = s.match(/^- \[([0-9a-f]{4})\] /);
    const own = key && ((items.has(key[1]) && items.get(key[1]).file === f) || openIds.has(key[1]));
    if (!own) say(f, `a Sources entry keys no item of this scene: ${s.slice(0, 40)}`);
  }
}

function quotes(line) {
  const out = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "「") {
      if (depth === 0) start = i + 1;
      depth++;
    } else if (line[i] === "」" && depth > 0) {
      depth--;
      if (depth === 0) out.push(line.slice(start, i));
    }
  }
  return out;
}

if (seven) {
  const GROUPS = {
    A: "06d2:stated:MUST NOT, 0cfa:stated:SHOULD NOT, 16c2:stated:SHOULD, 1fb1:confirmed:MUST",
    B: "37c2:stated:MUST NOT, 3b2d:confirmed:SHOULD, 48b2:stated:SHOULD, 518b:confirmed:SHOULD",
    C: "51d2:stated:SHOULD, 58f1:stated:MAY, 59eb:stated:SHOULD, 6faa:confirmed:MUST NOT",
    D: "75bc:stated:SHOULD, 78f6:stated:SHOULD, 802f:confirmed:SHOULD NOT, 81aa:confirmed:SHOULD NOT",
    E: "81e0:confirmed:MUST NOT, 88a6:confirmed:SHOULD",
    F: "891a:stated:MUST NOT, 8ea6:stated:SHOULD, 907b:stated:SHOULD NOT, 948b:stated:SHOULD, 99ac:stated:SHOULD, a023:stated:MAY",
    G: "a545:stated:SHOULD NOT, ae58:stated:MAY, b6bf:stated:SHOULD",
  };
  if (files.length !== 7) problems.push(`scene files: ${files.length}, expected 7`);
  const taken = new Set(Object.values(GROUPS).flatMap((g) => g.split(", ").map((e) => e.slice(0, 4))));
  ["2b72", "b76a", "bf60", "c018", "c233", "c60e", "cab7", "d061", "d1b9", "d443"].forEach((i) => taken.add(i));
  for (const [letter, group] of Object.entries(GROUPS)) {
    const want = group.split(", ").map((e) => e.split(":"));
    const file = items.get(want[0][0])?.file;
    if (!file) {
      problems.push(`scene ${letter}: ${want[0][0]} is in no scene`);
      continue;
    }
    for (const [item, tag, strength] of want) {
      const got = items.get(item);
      if (!got || got.file !== file) say(file, `scene ${letter} lacks ${item}`);
      else if (got.tag !== tag || got.strength !== strength) say(file, `${item} is [${got.tag}] ${got.strength}, expected [${tag}] ${strength}`);
    }
    const count = [...items.values()].filter((v) => v.file === file).length;
    if (count !== want.length) say(file, `scene ${letter} holds ${count} expectations, expected ${want.length}`);
    const id = file.slice(0, 4);
    if (taken.has(id)) say(file, "the file id is one of the input's item ids");
    const same = execFileSync("git", ["ls-files", "--", "docs"], { encoding: "utf8" }).split("\n").filter((p) => path.basename(p).startsWith(`${id}-`) && !p.endsWith(file));
    if (same.length) say(file, `the file id collides with ${same.join(", ")}`);
    const tracked = execFileSync("git", ["ls-files", "--", path.join(dir, file)], { encoding: "utf8" }).trim();
    if (!tracked && execFileSync("git", ["log", "--all", "--oneline", `-S${id}`, "--", "docs"], { encoding: "utf8" }).trim())
      say(file, "a commit already used the file id");
    if (letter === "A") {
      const open = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n");
      const q = section(open.slice(open.indexOf("\n---\n") + 5), "## Open questions").find((l) => l.startsWith("- **2b72** "));
      if (!q) say(file, "scene A has no 2b72 open question");
      else if (q.includes("→")) say(file, "2b72 carries an arrow; it stays open until the close's ADR");
    }
  }
  const inputs = [".tanto/kikaku/2026-09-15-shoroku-experience-input.md", ".tanto/kikaku/2026-09-15-experience-layer.md"];
  if (inputs.every((p) => fs.existsSync(p))) {
    const raw = inputs.map((p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n")).join("\n");
    const folded = raw.replace(/\n\s*/g, "");
    for (const f of files) {
      const text = fs.readFileSync(path.join(dir, f), "utf8").replace(/\r\n/g, "\n");
      for (const s of text.split("\n").filter((l) => l.startsWith("- ["))) {
        for (const q of quotes(s)) if (!raw.includes(q) && !folded.includes(q)) say(f, `quote not verbatim in the input or the decision file: 「${q}」`);
      }
    }
  } else console.log("quote check skipped: the untracked input files are absent");
}

for (const p of problems) console.log(p);
console.log(`${files.length} scene files, ${items.size} expectations, ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
```

- [ ] **Step 4: Write the seven scenes**

One file per scene of the input's §1, at `docs/experience/<id>-<slug>.md`, `<id>` from Step 2 and `<slug>` the kebab-case of the title. Every file follows W1.1's form exactly — the frontmatter, then `## Scene`, `## Expectations`, `## Open questions` (a scene with none keeps the heading, empty), `## Sources`, in that order — and spec section 1's example scene, which is Scene D's two first lines in this form. Rules for every scene:

- **Frontmatter:** `id` the quoted file id; `title` the input's scene heading after "Scene X — ", lower-cased at its first letter, as a phrase; `created` and `updated` both the commit date (UTC); `actors` chosen from the scene's text, a subset of the hub's Cast — `maintainer`, `agent`, `collaborator`; `tags` chosen from the scene's text — quality attributes and areas, kebab-case, free vocabulary. Quote a `title` that starts with a quotation mark: Scene F's is `title: '"requirements" turn into behavior'`, since a bare leading `"` makes YAML read a double-quoted scalar and fail.
- **`## Scene`:** the input's paragraph for that scene, as written — present tense, the actor's viewpoint.
- **`## Expectations`:** one line per item in the input's order, `- **<id>** [<tag>] <STRENGTH> <text>`, the text the input's, the tag and strength the table below gives. A line may wrap; its continuation is indented two spaces.
- **`## Sources`:** one entry per expectation, in the same order, **each on one line however long** (markdownlint's line length is off in this repository), in the type rules' three forms:
  - a `[stated]` item from the input: `- [<id>] 「<the input's §4 quote for that id>」 (chat, 2026-09-13 to 15)` — the quote copied character for character from §4, where one §4 key holds two ids (`[48b2, b6bf]`, `[51d2, 58f1]`, `[a545, d1b9]`) each id's entry carries that quote, and a key with two quotes (`8ea6`, `a023`) keeps both, joined by ` / `;
  - a `[confirmed]` item: `- [<id>] inferred from <the basis §4 gives for that id>; not stated directly. Confirmed 2026-09-15: 「<the words>」` — the basis in §4's words, a §4 quote inside it kept in its `「」`;
  - `16c2`, the one corrected line: `- [16c2] 「<§11 item 1's first quote>」 / 「<§11 item 1's second quote>」 (Kikaku, 2026-09-15)`.
- The confirmation words are the human's reply the decision file quotes: 「あとは yes」 for the seven lines §11 confirms as worded, and, for `3b2d`, §11 item 3's quote, the reply to the second round.

| Scene | Title, from the heading | Expectations — id, tag after §11, strength | Sources, by §4 key or §11 item |
| --- | --- | --- | --- |
| A | starting a project from a chat discussion | `06d2` stated MUST NOT; `0cfa` stated SHOULD NOT; `16c2` stated SHOULD; `1fb1` confirmed MUST | `06d2`, `0cfa` §4; `16c2` §11 item 1, its text also §11's: "SHOULD keep the handover flow — chat → file → new repo or directory, uncommitted; deletion optional — with only what the file carries changing."; `1fb1` §4's basis, 「あとは yes」 |
| B | returning after months | `37c2` stated MUST NOT; `3b2d` confirmed SHOULD; `48b2` stated SHOULD; `518b` confirmed SHOULD | `37c2` §4; `3b2d` §4's basis ("inferred from 37c2 and" its 「」 quote), §11 item 3's quote; `48b2` §4 `[48b2, b6bf]`; `518b` §4's basis with its quote, 「あとは yes」 |
| C | the agent proposes what was already ruled out | `51d2` stated SHOULD; `58f1` stated MAY; `59eb` stated SHOULD; `6faa` confirmed MUST NOT | `51d2`, `58f1` §4 `[51d2, 58f1]`; `59eb` §4; `6faa` §4's basis (no quote), 「あとは yes」 |
| D | being asked, and asked again | `75bc` stated SHOULD; `78f6` stated SHOULD; `802f` confirmed SHOULD NOT; `81aa` confirmed SHOULD NOT | `75bc`, `78f6` §4; `802f`, `81aa` "inferred from 75bc and 0cfa", 「あとは yes」 |
| E | the undecided gets decided | `81e0` confirmed MUST NOT; `88a6` confirmed SHOULD | both §4 `[81e0, 88a6]`'s basis, 「あとは yes」 |
| F | "requirements" turn into behavior | `891a` stated MUST NOT; `8ea6` stated SHOULD; `907b` stated SHOULD NOT; `948b` stated SHOULD; `99ac` stated SHOULD; `a023` stated MAY | each its own §4 key; `8ea6` and `a023` two quotes each |
| G | two languages, one tree | `a545` stated SHOULD NOT; `ae58` stated MAY; `b6bf` stated SHOULD | `a545` §4 `[a545, d1b9]`; `ae58` §4, its "in reply to" gloss kept inside the parenthesis after the date; `b6bf` §4 `[48b2, b6bf]` |

Scene A's `## Open questions` holds one line, the input's `2b72` question, whole, as `- **2b72** <question>` **with no arrow**: the decision file §12 resolved it (f33b), but no ADR records that yet, and the close's apply appends `→ decision-<id>` when it writes The ADRs 7. Every other scene's Open questions section is empty. The spec section 1 example's Scene D line for `802f` shows the confirmed form exactly: `- [802f] inferred from 75bc and 0cfa; not stated directly. Confirmed 2026-09-15: 「あとは yes」`.

- [ ] **Step 5: Check the hub, the scenes, and their frontmatter**

```bash
# tree-state
node .tanto/experience-layer/scene-check.js --seven
```

Expected: `7 scene files, 27 expectations, 0 problems` and exit `0` — the input's §1 carries 27 expectations, not the 29 the spec's Measured section says (Self-Review). The quote check runs because both untracked files are on disk; on a machine without them it prints `quote check skipped` and checks the rest. Then load every scene's frontmatter with a real YAML parser:

```bash
# tree-state
uv run --no-project --with pyyaml python -c '
import datetime, pathlib, re, sys, yaml
cast = {"maintainer", "agent", "collaborator"}
bad = 0
for p in sorted(pathlib.Path("docs/experience").glob("[0-9a-f][0-9a-f][0-9a-f][0-9a-f]-*.md")):
    text = p.read_text(encoding="utf-8").replace("\r\n", "\n")
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    d = yaml.safe_load(m.group(1)) if m else None
    ok = (isinstance(d, dict) and d.get("id") == p.name[:4] and isinstance(d.get("title"), str)
          and isinstance(d.get("actors"), list) and set(d["actors"]) <= cast and d["actors"]
          and isinstance(d.get("tags"), list) and d["tags"]
          and isinstance(d.get("created"), datetime.date) and d.get("created") == d.get("updated"))
    print(p.name[:4], "ok" if ok else "BAD")
    bad += not ok
sys.exit(1 if bad else 0)
'
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py docs/experience/*.md docs/experience.md docs/notes/experience-layer-exit-criterion.md
```

Expected: seven `<id> ok` lines, then nothing from the hook's own checker, exit `0` for both. Then the phase B fences of "How a batch is verified" that read the hub — `hub sections: 3`, the Drivers' `←` ids resolving, `comment openers: template 2, filled hub 0` — which run for real from now on.

- [ ] **Step 6: Verify**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task 4
```

Expected: `task 4: no passages` — this task writes only new files; W4.1 and W4.2 are checked by Step 5 and by the boundary's `diff`.

- [ ] **Step 7: Lint, commit, and restore line endings**

```bash
# tree-state
./scripts/lint.sh docs/experience.md docs/notes/experience-layer-exit-criterion.md docs/experience/[0-9a-f]*.md
git add docs/experience.md docs/notes/experience-layer-exit-criterion.md docs/experience/[0-9a-f]*.md
git commit --only docs/experience.md docs/notes/experience-layer-exit-criterion.md docs/experience/[0-9a-f]*.md
```

Subject: `docs(experience): the hub, the seven scenes, and the exit-criterion note`. End the message with your own `Co-Authored-By:` trailer. The `frontmatter` hook loads each scene's frontmatter again at the commit. Then restore every created file's line endings — nine files, each written `w/lf`:

```bash
# tree-state
git checkout -- docs/experience.md docs/notes/experience-layer-exit-criterion.md docs/experience/[0-9a-f]*.md
n=$(git ls-files --eol docs/experience.md docs/notes/experience-layer-exit-criterion.md docs/experience/[0-9a-f]*.md | grep -vc 'w/crlf' || true); echo "$n"; [ "$n" = 0 ] || exit 1
git status --porcelain --untracked-files=no
```

Expected: `0` — no file left without `w/crlf` — and no tracked change. Done when: Step 5's checks exited `0` (seven files; each file id with a letter and colliding with nothing; the four headings in order; every expectation line in the type rules' form; every expectation id with its Sources entry; every 「」 quote verbatim in the input or the decision file; every frontmatter a YAML mapping), the phase B fences pass, and the commit landed through its hooks.

### Task 5: The recommend run — the migration's recommendation and its check brief

**Files:**

- Create, untracked, **by the dispatched agent**: `.tanto/experience-layer/migration-recommendation.md` and `.tanto/experience-layer/migration-brief.md`
- **No tracked file changes in this task.** Step 4 checks it.

**Interfaces:**

- Consumes: the tree batch B left — the hub, the seven scenes, the type rules, `docs/AGENTS.md` — as the run's baseline; `skills/shoroku/SKILL.md` as Task 3 left it, which is the text the recommender runs.
- Produces: the recommendation, which Kanri's boundary puts to the human and Task 6's apply reads with the direction; its pairing-pass items (the `Serves` lines Task 6 writes), its file map and its per-sentence destinations (both of which Task 8 reads); the brief, which Kanri checks for form at the boundary.

Spec section 9, batch B paragraph (this plan's batch C), and I-1. **This task's Jisso — not Kanri — dispatches the recommender** (Global Constraints). The dispatch text below is part of the design: three of its instructions — the pointer word, the two derived item kinds, and the final ids — are in no skill text, and the plan carries them here verbatim. The task is a **sweep-and-check** shape: its deliverable is two untracked files another agent writes, and what this task's implementer produces is the dispatch and the recorded checks of what came back.

**Named mechanisms this task touches.**

- **The pointer word `experience-layer`**: the phase C fence of "How a batch is verified" (headings ending `(experience-layer)`); the apply dispatch's `Source: shoroku experience-layer` (Task 6); `scripts/check_md_frontmatter.py`'s `SOURCE_RE`, whose `shoroku <topic>` branch accepts the one word with no `S-n` (the spec review measured a third word failing it).
- **The item ids**: W1.1's Identifiers and P1.3; the final-ids rule below and its re-check in Task 6's dispatch; the seven scenes' ids (Task 4), which the checks exclude by construction.
- **The `exp-` reference and the hub**: the pairing pass's `Serves exp-…` lines, which Task 6 writes and the phase D fence counts; the file map's `→ the hub`, which Task 8 renders as the hub's path, `docs/experience.md` (P1.6: the hub is cited by path).
- **The trust tags**: the tagging instruction below restates W1.1's Expectations rule for this run's sources; shoroku `SKILL.md`'s `Unsure` sentence (P3.4) is the grouping rule the dispatch cites.

- [ ] **Step 1: Pre-flight — the model, and the baseline**

Read the kind's model from the merged `tanto.json` — the built-in defaults, the personal file, the project file, a later layer winning:

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node -e '
const fs = require("node:fs");
const read = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return {}; } };
let model = null;
for (const layer of [read(process.argv[1] + "/templates/tanto.json"), read(process.argv[2]), read(".claude/tanto.json")]) {
  const kind = layer.subagents && layer.subagents["shoroku.recommend"];
  if (kind && kind.model) model = kind.model;
}
console.log("shoroku.recommend: subagent_type tanto-shoroku-recommend, model " + model);
process.exit(model ? 0 : 1);
' "$TANTO" "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/tanto.json"
git rev-parse HEAD
git status --porcelain --untracked-files=no
```

Expected: `shoroku.recommend: subagent_type tanto-shoroku-recommend, model fable`, a commit hash — record it as `START` in your report — and no tracked change. A different model is not a failure: dispatch on the model printed and say so in the report. Then run the phase B fences of "How a batch is verified": the run's baseline is batch B's tree, and a baseline that fails them is reported, not dispatched against.

- [ ] **Step 2: Dispatch the recommender**

One dispatch: `subagent_type: tanto-shoroku-recommend`, `model` the value Step 1 printed, and as its prompt **exactly** the text below, whole — do not summarize, reorder, or add to it:

```text
You are running the shoroku skill's recommend mode (skills/shoroku/SKILL.md, "Recommend mode") for the tanto topic experience-layer: the migration of this repository's docs/requirements/ into docs/experience/, inside that topic's plan. Read skills/shoroku/SKILL.md, docs/AGENTS.md and docs/experience/AGENTS.md first; the last is the classification rule for experience, the fourth managed type. You write two files, both in your own turn, and nothing else: dispatch no agents of your own (a subagent you start ends its turn with nothing written), write nothing under docs/, stage nothing, commit nothing.

SOURCES. File mode over five files; read each one whole: docs/requirements/04f5-tanto.md, docs/requirements/3c4d-shoroku.md, docs/requirements/1a2b-kisou.md, docs/requirements/5e6f-wayaku.md, docs/requirements/7a8b-automated-release.md. They are every file under docs/requirements/ except AGENTS.md, which is not a source.

BASELINE. The docs/ tree as it stands on the branch experience-layer: docs/experience.md (the hub), the seven scenes docs/experience/<id>-<slug>.md, docs/experience/AGENTS.md, docs/AGENTS.md, docs/design/, docs/decisions/, docs/issues/open/ and docs/issues/deferred/. The seven scenes were written from the maintainer's own words and confirmed by him; they are baseline and are never re-proposed. You may propose an edit to one of them, as an item like any other.

POINTER. The pointer word for every source is experience-layer. Every ### item heading is "### <n> — <title> (experience-layer)" and ends with exactly "(experience-layer)", so that an issue the apply writes opens "Source: shoroku experience-layer". Name the source file and the sentence an item comes from in the item's body, quoted, never in its heading. No line of an item's body starts with "#": quote a heading inline, in backticks.

WHAT TO DECIDE, for each source sentence (a bullet counts as one):
- drop: a behavior sentence the code and its tests already express. Group it Recommended reject with the reason "implemented; carried by the code". If the sentence embeds a reason, why the behavior matters to someone, salvage that reason into an expectation item beside the drop.
- expectation: into an existing scene, or into a new scene when no scene covers the situation, grouped Recommended adopt. Each carries its trust tag, its strength and its Sources entry in the forms docs/experience/AGENTS.md gives; a new scene also carries its title, actors, tags and Scene text. Tag by those rules: [stated] only where a verbatim quote of the maintainer backs the line, from .tanto/experience-layer/dialogue.md, .tanto/experience-layer/spec-inputs.md, a Kikaku file under .tanto/kikaku/ that the spec cites, or a quote inside an issue body. A requirement file's own sentence is an agent's summary, not his words, so an expectation that rests on it alone is [inferred], and an [inferred] line is SHOULD or SHOULD NOT at most. A want the system does not meet yet is two items, the expectation and an issue (docs/experience/AGENTS.md, "experience vs issues").
- issue: a want the system does not meet, or a measured defect.
- design line or decision candidate: a design choice the sentence states. A design line names its docs/design/ file and section. A decision candidate is the topic close's to write as an ADR; its destination is "decision candidate, for the close".
Group Unsure, with the reason named, every [inferred] item and every item whose wording names a path, a command, a config key, a file format, a role count or a tool (SKILL.md, Recommend mode). Every item that comes from a source sentence quotes that sentence in its body with its file, so that a later mention of that sentence can be mapped to where it went. The spec's "## Requirements" section (docs/superpowers/specs/2026-09-30-experience-layer-design.md) names three wants from req-1a2b and req-3c4d that this run must carry forward, and how; follow it.

TWO ITEM KINDS THE SKILL DOES NOT HAVE. Both are derived from the baseline, not classified from a sentence; write each as a Recommended adopt item.
1. The pairing pass. docs/AGENTS.md's "The standing tree is not swept" is the rule for an ordinary run; this dispatch names the 53 "## " sections of the five design files as its explicit scope, which is what issue-320e's "a backfill is its own run" means. For each section give the exp-<id> it serves, a scene or an item, or say it serves none. Write one item per design file, five items: docs/design/4807-tanto.md (24 sections), docs/design/dc5d-install-scripts.md (9), docs/design/c1d2-kisou.md (8), docs/design/e3f4-shoroku.md (7), docs/design/a5b6-automated-release.md (5). The item's body quotes each section heading, which is the "source" the item quotes, and gives after it the exact line the apply writes as that section's first body line: "Serves exp-<id>.", "Serves exp-<id>, exp-<id>." or "Serves no expectation; internal shape." A section whose first body line already opens with a Serves sentence, "Serves `req-<id>`." or "Serves `req-<id>` — ... .", gets the new line in place of that sentence only, from the word Serves to the period that ends it; the item quotes that sentence so that the apply knows what it replaces, and whatever follows it in the paragraph stays (docs/design/4807-tanto.md line 1027 is followed by a second sentence; docs/design/c1d2-kisou.md lines 164 and 214 wrap over two lines). A Serves line under a "### " subsection (e3f4's "Classification and the requirement pairing") is not a section's line: say so in the item; the plan's own sweep handles it.
2. The file map. One item with five lines, one per requirement file: "req-<id> → exp-<id>", the scene the file's purpose folds into, or "req-<id> → the hub", each line followed by that file's "## Purpose" section, quoted. The plan rewrites every mention that names only a requirement file, an issue's Related: line or a design Related gloss, from this map.

IDS. Draw every new id here, in the recommendation: a new scene, a new expectation or open question, a new issue. Each one passes the three checks of docs/experience/AGENTS.md, "Identifiers": no file docs/<type>/**/<id>-*.md exists, no **<id>** line exists under docs/experience/ or in docs/experience.md, and git log --all --oneline -S'<id>' -- docs prints nothing. Each contains at least one of a to f and repeats no other id in this recommendation. The ids are final: the apply writes them as they stand, re-running the same checks first.

FIX ITEMS. A Recommended fix item may name a file under skills/kisou/ or skills/shoroku/ only; a fix anywhere else is Recommended reject, with the correction in its reason.

OUTPUT. Write the recommendation to .tanto/experience-layer/migration-recommendation.md: the numbered items under the four ## headings in the skill's exact text, preceded by one line that gives the item count of each group and the number of scenes the tree would hold if every Recommended adopt item were accepted.

BRIEF. Then write the check brief to .tanto/experience-layer/migration-brief.md from the template skills/tanto/templates/shoroku-brief.md, rendered in the chat language ja: one line per item under the template's headings, each ending in "See:" and the item's heading text without its ### marker. The template's prose names the topic close's files as fact; render them as this run's: migration-brief.md where it says t2-brief.md, migration-direction.md where it says t2-direction.md, and the stage word migration where its Document line says t2. No "t2-" name appears in the brief.

When both files are written, reply with their two paths, the item count per group, and the scene count, and nothing else.
```

Wait for the agent's completion. It runs long — 443 source lines and 53 sections — and its reply is not the result: the two files are.

- [ ] **Step 3: Check what came back**

First the phase C fence of "How a batch is verified", verbatim — from now on it runs for real: `group headings: 4`, `item headings without the pointer word: 0`, `t2- mentions in the brief: 0`. Then the two derived kinds and the brief's form:

```bash
# tree-state
r=.tanto/experience-layer/migration-recommendation.md; b=.tanto/experience-layer/migration-brief.md
m=$(grep -c 'req-[0-9a-f]\{4\} → \(exp-[0-9a-f]\{4\}\|the hub\)' "$r" || true); printf 'file-map lines: %s\n' "$m"; [ "$m" -ge 5 ] || exit 1
s=$(grep -c 'Serves \(exp-[0-9a-f]\{4\}\|no expectation; internal shape\)' "$r" || true); printf 'pairing lines: %s\n' "$s"; [ "$s" -ge 53 ] || exit 1
grep '^### ' "$r" | sed 's/^### //' | while IFS= read -r h; do n=$(grep -cF "See: $h" "$b" || true); [ "$n" = 1 ] || { echo "not once after See: $h"; exit 1; }; done || exit 1
for g in 'Recommended adopt' 'Recommended fix' 'Recommended reject' 'Unsure'; do n=$(awk -v g="## $g" '$0 == g {on = 1; next} /^## / {on = 0} on && /^### / {c++} END {print c + 0}' "$r"); printf '%s: %s\n' "$g" "$n"; done
head -1 "$r"
```

Expected: `file-map lines: 5` (more only if the item quotes a line twice), `pairing lines: 53` or a little more for the same reason, no `not once after See:` line, the four group counts, and the recommendation's opening count line. A count below the floor, or a heading missing from the brief, is reported to Kanri with the file paths — do not dispatch again on your own judgment.

- [ ] **Step 4: Confirm that no tracked file changed**

```bash
# tree-state
git status --porcelain --untracked-files=no
git rev-parse HEAD
```

Expected: nothing, then the hash recorded as `START` in Step 1.

- [ ] **Step 5: Verify**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task 5
```

Expected: `task 5: no passages`.

- [ ] **Step 6: Report**

The batch report, from the tanto template, carries: the two file paths; the item count of each group and the `Unsure` count, from Step 3; the scene count the recommendation would leave — the opening line's figure — **reported against the cap of 10 in the type rules, not failed**, since the cap is a judgment (Fixed input 3); the model the dispatch ran on; and `START`. Done when: both files exist, the phase C fence and Step 3 pass, and Step 4 printed no change. Kanri then holds the boundary for the human's answer; batch D is not spawned until `.tanto/experience-layer/migration-direction.md` exists (Global Constraints).

### Task 6: The apply — `docs: fold requirements into experience`

**Files:**

- Modify or create, **by the dispatched agent**, what the direction accepted: scenes under `docs/experience/` (the seven and any new ones), issues under `docs/issues/open/`, the `Serves` lines and design lines in `docs/design/*.md`; with an accepted `Recommended fix` item, files under `skills/kisou/` or `skills/shoroku/` in a second commit
- Read: `.tanto/experience-layer/migration-recommendation.md`, `.tanto/experience-layer/migration-direction.md`

**Interfaces:**

- Consumes: Task 5's recommendation, and the direction Kanri wrote from the human's answer at batch C's boundary.
- Produces: the `Serves exp-…` first line of every `## ` design section, which the phase D fence counts and which Task 7's passages are written around; the accepted scenes and issues, which Task 8's sweep points `req-` mentions at; the commit subject `docs: fold requirements into experience`, which Task 9's report dates the migration by.

Spec section 9, batch C step 1 (this plan's batch D). **This task's Jisso — not Kanri — dispatches the apply** (Global Constraints). The dispatch text is carried verbatim. Scenes the recommendation creates are additional to the seven, and the phase B and D fences count them with `-ge`. This task is a **sweep-and-check** shape: the writing is the dispatched agent's, and this task's deliverable is the dispatch and the recorded checks of the commits it made.

**Named mechanisms this task touches.**

- **The `Source:` line**: every issue the apply writes opens `Source: shoroku experience-layer`, the form the issues template states (P1.14) and `scripts/check_md_frontmatter.py` enforces at the commit.
- **The item ids**: the re-check before writing (W1.1's Identifiers; Task 5's final-ids rule).
- **The pairing's `Serves` line**: written here as each section's first body line; Task 7's passages avoid those lines, Task 8's sweep drops the one under a `###` subsection, and the phase D fence counts one per section.
- **Scene A's `2b72` line**: appended to only if the direction and an ADR provide the decision; otherwise it stays as Task 4 wrote it, and the topic close's apply appends `→ decision-<id>` when it writes The ADRs 7.

- [ ] **Step 1: Stop if there is no direction**

```bash
# tree-state
test -e .tanto/experience-layer/migration-direction.md || { echo 'no migration-direction.md — stop, and report to Kanri'; exit 1; }
test -e .tanto/experience-layer/migration-recommendation.md || { echo 'no migration-recommendation.md — stop, and report to Kanri'; exit 1; }
git rev-parse HEAD | tee .tanto/experience-layer/apply-start.txt
git status --porcelain --untracked-files=no
```

Expected: a commit hash — `START`, kept in the untracked `.tanto/experience-layer/apply-start.txt` for Step 4 — and no tracked change. A missing file ends this task and the batch: report it; never write a direction yourself.

- [ ] **Step 2: Pre-flight — the model**

The same read as Task 5 Step 1, for this kind:

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node -e '
const fs = require("node:fs");
const read = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return {}; } };
let model = null;
for (const layer of [read(process.argv[1] + "/templates/tanto.json"), read(process.argv[2]), read(".claude/tanto.json")]) {
  const kind = layer.subagents && layer.subagents["shoroku.apply"];
  if (kind && kind.model) model = kind.model;
}
console.log("shoroku.apply: subagent_type tanto-shoroku-apply, model " + model);
process.exit(model ? 0 : 1);
' "$TANTO" "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/tanto.json"
```

Expected: `shoroku.apply: subagent_type tanto-shoroku-apply, model opus`.

- [ ] **Step 3: Dispatch the apply**

One dispatch: `subagent_type: tanto-shoroku-apply`, `model` the value Step 2 printed, and as its prompt **exactly** this text, whole:

```text
You are running the shoroku skill's apply mode (skills/shoroku/SKILL.md, "Apply mode") for the tanto topic experience-layer. Recommendation: .tanto/experience-layer/migration-recommendation.md. Direction: .tanto/experience-layer/migration-direction.md, written from the maintainer's answer. Commit subject: docs: fold requirements into experience. You make the commits yourself, in your own turn, and dispatch no agents of your own (a subagent you start ends its turn with nothing written).

WRITE exactly what the direction accepted, with its edits, and nothing it did not:
- Expectations and scenes: each accepted expectation into the scene its item names, one of the seven under docs/experience/ or a new scene file docs/experience/<id>-<slug>.md, in the form docs/experience/AGENTS.md gives, with its trust tag, its strength and its Sources entry. A line the direction corrected becomes [stated], the correction quoted in its Sources entry as given; an accepted [inferred] line becomes [confirmed], its entry quoting the words of the acceptance as the direction file records them; a line the direction left unanswered stays [inferred]. Set updated: to today in every scene you edit; a new scene has created and updated both today.
- Issues: each accepted issue under docs/issues/open/, its body opening with the line "Source: shoroku experience-layer", the pointer its heading carries, before the narrative.
- The pairing pass: in each of the five design files, the accepted line as the first body line of every "## " section, directly under the heading with one blank line between, replacing, where the item quotes one, the existing Serves sentence, from the word Serves to its period and nothing after it in the paragraph, by the accepted line, so that what followed the sentence becomes the paragraph after the new line; bump each design file's updated:. Leave a Serves line under a "### " subsection exactly as it is.
- Design lines: into the design file and section each item names.
- Scene A's open question 2b72: leave the line exactly as it is; the topic close's apply appends its arrow when it writes that ADR.

IDS. Before writing any new id, re-run on it the three checks of docs/experience/AGENTS.md, "Identifiers". An id that now collides is re-rolled by the same checks, and every reference to it in what you write follows the new id. Name every re-roll in your reply.

DO NOT edit anything under docs/requirements/ (the plan removes it after you); rewrite any req- mention outside the pairing pass's Serves lines (the plan's own sweep does it after you, from the file map); write or edit any file under docs/decisions/ (a decision-candidate item is the topic close's: list it in your reply); edit anything under docs/superpowers/; move any issue; or touch a file under skills/ except as FIX says.

COMMIT. Lint every path you wrote by name with ./scripts/lint.sh <paths>, file paths and never a directory, and fix what it reports. Stage each new file with git add <path>. Commit once with git commit --only <every path you wrote>, subject "docs: fold requirements into experience", the message ending with a Co-Authored-By: trailer naming you. The pre-commit hooks must pass; never bypass one.

FIX, only when the direction accepted at least one Recommended fix item: for each, replace its Old: text with its New: text exactly once in the file it names, which must lie under skills/kisou/ or skills/shoroku/; any other path is a skipped fix. Review the sibling README.md for drift when a SKILL.md changed. A fix under skills/kisou/templates/docs/ also needs the installed copies brought level (node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case, then apply --items with every number it lists), or the kisou-doc-system-check hook refuses the commit. Lint those paths and make a second commit by explicit path, subject "fix: text corrections from the experience migration", with the same trailer. An Old: text found zero or several times is reported as "fix skipped: <n> — <why>" and its file is left as it was.

REPLY with the commit subjects and hashes, every path you wrote, every id you re-rolled, the decision-candidate items left for the close, and every skipped fix.
```

Wait for the agent's completion; its commits, not its reply, are the result.

- [ ] **Step 4: Check the commits**

```bash
# tree-state
start=$(cat .tanto/experience-layer/apply-start.txt)
git log --format='%h %s' "$start"..HEAD
git status --porcelain --untracked-files=no
bad=$(git diff --name-only "$start" HEAD -- docs/requirements docs/decisions docs/superpowers); [ -z "$bad" ] || { printf 'the apply touched a path it must not:\n%s\n' "$bad"; exit 1; }
fix=$(git log --format=%H --grep='^fix: text corrections from the experience migration$' "$start"..HEAD)
if [ -n "$fix" ]; then out=$(git diff-tree --no-commit-id --name-only -r $fix | grep -v '^skills/\(kisou\|shoroku\)/' || true); [ -z "$out" ] || { printf 'the fix commit left skills/kisou and skills/shoroku:\n%s\n' "$out"; exit 1; }; fi
node .tanto/experience-layer/scene-check.js
issues=$(git diff --name-only --diff-filter=d "$start" HEAD -- docs/issues)
[ -z "$issues" ] || printf '%s\n' "$issues" | xargs uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py || exit 1
for f in docs/design/[0-9a-f]*.md; do node -e '
const t = require("node:fs").readFileSync(process.argv[1], "utf8").replace(/\r\n/g, "\n").split("\n");
let fence = false, bad = 0;
for (let i = 0; i < t.length; i++) {
  if (/^```/.test(t[i])) fence = !fence;
  if (fence || !/^## /.test(t[i])) continue;
  let j = i + 1; while (j < t.length && t[j] === "") j++;
  if (!/^Serves /.test(t[j] || "")) { console.log(`${process.argv[1]}: ${t[i]} opens without a Serves line`); bad++; }
}
process.exit(bad ? 1 : 0);
' "$f" || exit 1; done
echo 'the apply is in shape'
```

Expected: the commit line `docs: fold requirements into experience` (and, with an accepted fix, the second one), no tracked change, no forbidden path, `<n> scene files, <m> expectations, 0 problems`, nothing from the frontmatter check, and `the apply is in shape` — every `## ` section of the five design files opens with its `Serves` line. A failure is reported to Kanri with the output; do not repair the apply's commit yourself.

- [ ] **Step 5: Verify**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task 6
```

Expected: `task 6: no passages`.

- [ ] **Step 6: Report**

The batch report carries the apply's reply — the commit subjects and hashes, the paths, the re-rolled ids, the decision-candidate items left for the close, the skipped fixes — `START`, the scene count after the apply, and Step 4's output. Done when: Step 4 printed `the apply is in shape`. Task 7 runs next, **before** Task 8's sweep.

### Task 7: The design-side edits, the two issue moves, and the root Markdown

**Files:**

- Modify: `docs/design/e3f4-shoroku.md`, `docs/design/c1d2-kisou.md`, `docs/design/4807-tanto.md`, `docs/design/a5b6-automated-release.md`
- Modify: `CONTRIBUTING.md` (lines 24, 35, 43) and `README.md` (line 54) — repository-root Markdown, edited under the human's Q4 answer 「承認する」 (D-9; Global Constraints)
- Move: `docs/issues/open/320e-backfill-req-id-into-existing-design-sections.md` and `docs/issues/open/c9df-shorokus-propose-step-states-a-requirement-as-the-source-sentence-not-the-need-behind-it.md` to `docs/issues/resolved/`
- Create, untracked: `.tanto/experience-layer/file-map.txt` (Step 1), which Task 8 reads

**Interfaces:**

- Consumes: the tree Task 6's apply left — in particular every `## ` design section's new `Serves` first line, which no passage below touches; the recommendation's file map, as the direction accepted it.
- Produces: `.tanto/experience-layer/file-map.txt`; design files whose remaining `req-` mentions are exactly the ones Task 8's sweep rewrites.

Spec section 8, section 5's CONTRIBUTING paragraph, section 9 batch C step 2's moves and root lines, and D-9. **Ordering:** this task runs **before** Task 8's sweep on purpose, so that every old block below is still verbatim in the tree when it runs. The blocks avoid every line Task 6's apply writes or rewrites — a `## ` heading's first body line, where the `Serves` line goes, and every existing `Serves req-…` line (`4807` line 1027, `c1d2` lines 164 and 214, `e3f4` line 46) — and none of their new text carries a `req-` id, so Task 8's sweep leaves each one as written and this task's `verify` still holds at batch D's boundary. Measured at drafting: each old block occurs exactly once in its file at the merge base. Step 2 re-checks it against the tree the apply left, because an accepted design line of the apply's may have touched one. One edit is **rules-driven, not a passage**: the `## Related` glosses in `e3f4`, `a5b6`, and `c1d2`, whose new wording is the file map's target — a run value.

**Named mechanisms this task touches.**

- **The trust tags and the translation rule** (P7.4, P7.5): shoroku `SKILL.md`'s recommend mode (Task 3, P3.4 and P3.5), which these two paragraphs restate — the reviewer reads them side by side; the type rules (W1.1).
- **The `exp-` pairing** (P7.2, P7.3): `docs/AGENTS.md`'s Propose step (P1.8) and the design template bullet (P1.9).
- **The hub** (P7.6, P7.7, P7.16): W1.1's The hub; the kisou Scope bullet (Task 2, P2.1), whose words P7.6 repeats; the root CONTRIBUTING's Project structure line, the filled form of P1.16.
- **The `exp-` reference example** (P7.18): the CONTRIBUTING template (P1.17) and `docs/AGENTS.md` (P1.4).

**Old values this task must clear.**

**O7.1** `the requirement pairing` — `docs/design/e3f4-shoroku.md` 1, the subsection heading — 0 after this task (P7.2). **May stay:** `docs/superpowers/**` 7.

**O7.2** `**requirement pairing**` — `docs/design/e3f4-shoroku.md` 1 — 0 after this task (P7.3).

**O7.3** `requirement bullet` — `docs/design/e3f4-shoroku.md` 1 — 0 after this task (P7.4); `docs/AGENTS.md` 1 and `skills/kisou/templates/docs/AGENTS.md` 1 went at Task 1 (P1.8); `docs/requirements/3c4d-shoroku.md` 1 goes with the directory in Task 8. **May stay:** `docs/issues/resolved/3a33-…` 1, `docs/superpowers/**` 22.

**O7.4** `The requirement-side flag` — `docs/design/e3f4-shoroku.md` 1 — 0 after this task (P7.4).

**O7.5** `unpaired bullets` — `docs/design/e3f4-shoroku.md` 1 — 0 after this task (P7.4). **May stay:** `docs/superpowers/**` 1.

**O7.6** `reference-translation shape belongs to` — the rejected translation rule, half false after P3.5. `docs/design/e3f4-shoroku.md` 1 — 0 after this task (P7.5). **May stay:** `docs/superpowers/**` 1.

**O7.7** `(req-04f5)` — `docs/design/4807-tanto.md` 13: the five headings go in this task (P7.9 to P7.13), the eight in prose — line 1023 and the parentheticals like it — are Task 8's. **May stay:** `docs/decisions/` 4 files (ADR bodies), `docs/issues/resolved/3c7a-…` 1, `skills/tanto/roles/kanri.md` 1 (line 761 — no task edits `skills/tanto/`; a seventh tanto site, named in Self-Review), `docs/superpowers/**` 11.

**O7.8** `the requirements and issues the spec` — `docs/design/4807-tanto.md` 1 — 0 after this task (P7.14). **May stay:** `docs/superpowers/**` 1.

**O7.9** `requirements, ADRs, and issues` — `docs/design/4807-tanto.md` 1 — 0 after this task (P7.15). **May stay:** `docs/superpowers/**` 1.

**O7.10** `Documents/Requirements/AGENTS.md` — `docs/design/c1d2-kisou.md` 1 — 0 after this task (P7.8). **May stay:** `docs/decisions/47f2-…` 1 and `docs/decisions/8b1f-…` 1 (ADR bodies; the close's ADR 1 amends 8b1f), `docs/superpowers/**` 2.

**O7.11** `(docs/requirements/) — what we're building` — `CONTRIBUTING.md` 1 — 0 after this task (P7.16).

**O7.12** `shoroku's scope and required behavior` — `docs/design/e3f4-shoroku.md` 1, the `Related` gloss — 0 after this task (Step 4).

**O7.13** `kisou's scope and required behavior` — `docs/design/c1d2-kisou.md` 1 — 0 after this task (Step 4).

**O7.14** `automated release purpose and behavior` — `docs/design/a5b6-automated-release.md` 1 — 0 after this task (Step 4).

Three sites this task edits have no backtick-free needle — the changed word sits inside backticks on its line: `e3f4`'s Workflow step 2 (P7.1), `c1d2`'s type list (P7.7), and `CONTRIBUTING.md` line 35 (P7.17); each block's `verify` is its check. Needles of earlier tasks whose last sites are here: O1.3 (`req-d4e5`, P7.18), O1.4 (`requirements vs issues`, P7.3), O1.7 (`docs/requirements/AGENTS.md`, P7.3), O2.2 (`requirements / design / decisions`, P7.19), and O2.4 (`skeleton), and`, P7.6).

- [ ] **Step 1: Write the file map**

Read the recommendation's file-map item and the direction's answer to it, and write `.tanto/experience-layer/file-map.txt` — five lines, one per requirement file, `req-<id> <target>`, the target `exp-<id>` as accepted or the word `hub`. Then check it:

```bash
# tree-state
m=.tanto/experience-layer/file-map.txt
cat "$m"
[ "$(cut -d' ' -f1 "$m" | sort | tr '\n' ' ')" = 'req-04f5 req-1a2b req-3c4d req-5e6f req-7a8b ' ] || { echo 'the map does not name the five files once each'; exit 1; }
for t in $(cut -d' ' -f2 "$m" | grep -v '^hub$'); do id=${t#exp-}; ls docs/experience/"$id"-*.md >/dev/null 2>&1 || grep -rqs "\*\*$id\*\*" docs/experience docs/experience.md || { echo "unresolved $t"; exit 1; }; done
echo 'file map resolves'
```

Expected: the five lines, then `file map resolves`.

- [ ] **Step 2: Confirm that every old block is still in the tree once**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node -e '
const fs = require("node:fs");
const pc = require(process.argv[1] + "/scripts/passage-check.js");
const plan = pc.parsePlan(fs.readFileSync("docs/superpowers/plans/2026-09-30-experience-layer.md", "utf8"));
let bad = 0;
for (const b of plan.blocks.filter((x) => x.kind === "P" && x.task === 7)) {
  const lines = pc.normalize(fs.readFileSync(b.path, "utf8")).split("\n");
  let n = 0;
  for (let i = 0; i + b.old.length <= lines.length; i++) if (b.old.every((l, j) => lines[i + j] === l)) n++;
  console.log(`${b.id} ${b.path}: ${n}`);
  if (n !== 1) bad++;
}
process.exit(bad ? 1 : 0);
' "$TANTO"
```

Expected: nineteen lines, each ending `: 1`. A `0` or a `2` means the apply changed a line a block quotes: stop and report the block id — do not re-quote it yourself.

- [ ] **Step 3: Apply the passages**

`docs/design/e3f4-shoroku.md` — the Workflow's step 2:

**P7.1** `docs/design/e3f4-shoroku.md` — replace exactly these 2 lines

```text
2. **Classify** each fragment as one of `requirement` / `design` /
   `decision` / `issue`; whole-file material (an investigation, a
```

**P7.1 →**

```text
2. **Classify** each fragment as one of `experience` / `design` /
   `decision` / `issue`; whole-file material (an investigation, a
```

The subsection's heading — no live document keys on it:

**P7.2** `docs/design/e3f4-shoroku.md` — replace exactly these 1 lines

```text
### Classification and the requirement pairing
```

**P7.2 →**

```text
### Classification and the experience pairing
```

Its body, in the experience terms:

**P7.3** `docs/design/e3f4-shoroku.md` — replace exactly these 7 lines

```text
Classification follows the **two splits the type files define** — "design vs
decisions" in `docs/design/AGENTS.md` and "requirements vs issues" in
`docs/requirements/AGENTS.md`. The second is the newer of the two: a need the
user states that the system does not meet yet is **two** fragments, a
requirement and an issue, not one issue. The proposal then carries the
**requirement pairing** the Propose step defines — each `design/` entry names
the `req-<id>` it serves or says it serves none, and the unpaired are flagged.
```

**P7.3 →**

```text
Classification follows the **two splits the type files define** — "design vs
decisions" in `docs/design/AGENTS.md` and "experience vs issues" in
`docs/experience/AGENTS.md`. The second is the newer of the two: a want the
user states that the system does not meet yet is **two** fragments, an
expectation and an issue, not one issue. The proposal then carries the
**experience pairing** the Propose step defines — each `design/` entry names
the `exp-<id>` it serves or says it serves none, and the unpaired are flagged.
```

The three properties in the experience terms, and the paragraph spec section 8 adds after them:

**P7.4** `docs/design/e3f4-shoroku.md` — replace exactly these 14 lines

```text
- **It is scoped to the proposal's own entries, never the standing tree.** A
  whole-tree sweep would flag every section of every design entry and offer an
  issue for every requirement bullet — the mirror image of the over-extraction
  the granularity gate exists to prevent. A backfill is its own run
  (issue-320e).
- **The requirement-side flag is a question, not a verdict.** A requirement
  bullet no design serves may be unmet — a gap, and then an issue — or met but
  never described, and then a `design/` entry. Offering the issue outright
  would make the rule itself a source of over-extraction; the proposal asks and
  the user answers at `Direction?`.
- **It lives in the docs system, not in either skill.** The loss happens at
  classification, where shoroku stands, and kisou reads no `docs/` content at
  all, so a kisou-side scan for unpaired bullets was rejected: the rule is
  template text that every classifier runs, and kisou merely installs it.
```

**P7.4 →**

```text
- **It is scoped to the proposal's own entries, never the standing tree.** A
  whole-tree sweep would flag every section of every design entry and offer an
  issue for every expectation — the mirror image of the over-extraction the
  granularity gate exists to prevent. A backfill is its own run (issue-320e).
- **The experience-side flag is a question, not a verdict.** An expectation no
  design serves may be unmet — a gap, and then an issue — or met but never
  described, and then a `design/` entry. Offering the issue outright would make
  the rule itself a source of over-extraction; the proposal asks and the user
  answers at `Direction?`.
- **It lives in the docs system, not in either skill.** The loss happens at
  classification, where shoroku stands, and kisou reads no `docs/` content at
  all, so a kisou-side scan for unpaired expectations was rejected: the rule is
  template text that every classifier runs, and kisou merely installs it.

Experience is the one type shoroku may assemble: an `[inferred]` candidate is
capped at SHOULD and goes to `Unsure` in recommend mode; the rule is in
`docs/experience/AGENTS.md` and this skill's `SKILL.md` carries one sentence
naming it.
```

The rejected translation rule, which P3.5 makes half false:

**P7.5** `docs/design/e3f4-shoroku.md` — replace exactly these 4 lines

```text
A translation rule for the `Direction?` proposal was considered and rejected:
the proposal is already presented in the chat's language, so the original-plus-
reference-translation shape belongs to `tanto`'s escalation to the human
(`req-04f5`), not here.
```

**P7.5 →**

```text
A translation rule for the `Direction?` proposal was considered and rejected:
the proposal is already presented in the chat's language. The
original-plus-reference-translation shape rides in recommend mode, for an ADR
item and for an `[inferred]` experience item, and nowhere in session mode.
```

`docs/design/c1d2-kisou.md` — issue-3bbb's second site, rewritten as P2.1 rewrote the Scope bullet:

**P7.6** `docs/design/c1d2-kisou.md` — replace exactly these 5 lines

```text
The bundle produces (always, when scaffolding): `README.md`,
`CONTRIBUTING.md`, `CLAUDE.md`, a slim top-level `AGENTS.md`, the
`docs/` doc-management system (`docs/AGENTS.md` +
`docs/<type>/AGENTS.md` + the `docs/issues/{open,deferred,resolved}/`
skeleton), and `scripts/bootstrap.{bat,sh}`. Optional, on user request:
```

**P7.6 →**

```text
The bundle produces (always, when scaffolding): `README.md`,
`CONTRIBUTING.md`, `CLAUDE.md`, a slim top-level `AGENTS.md`, the
`docs/` doc-management system (`docs/AGENTS.md`, the per-type
`docs/<type>/AGENTS.md` under the cased type directories, and the
hand-written hub `docs/experience.md`), and `scripts/bootstrap.{bat,sh}`.
Optional, on user request:
```

The type list, and the hub's one sentence:

**P7.7** `docs/design/c1d2-kisou.md` — replace exactly these 5 lines

```text
The doc-system spans six types — four managed (`requirements` / `design` /
`decisions` / `issues`) plus two flat (`notes` / `reports`; decision `3544`).
Both flat dirs are stamped on scaffold, and `{{notes}}` / `{{reports}}`
participate in the `case` mapping (plain title-case, no abbreviation
expansion).
```

**P7.7 →**

```text
The doc-system spans six types — four managed (`experience` / `design` /
`decisions` / `issues`) plus two flat (`notes` / `reports`; decision `3544`).
Both flat dirs are stamped on scaffold, and `{{notes}}` / `{{reports}}`
participate in the `case` mapping (plain title-case, no abbreviation
expansion). The hub `docs/experience.md` is scaffolded once from
`templates/docs/experience.md` and is not a copy the instrument compares.
```

File output paths:

**P7.8** `docs/design/c1d2-kisou.md` — replace exactly these 1 lines

```text
`Documents/Requirements/AGENTS.md`, `Documents/Issues/{open,deferred,
```

**P7.8 →**

```text
`Documents/Experience/AGENTS.md`, `Documents/Issues/{open,deferred,
```

The enforcement section's "fourteen guarded paths" (seven templates, seven copies) and line 64's dated "7 files" stand; so does the Refresh section, which is dated 2026-09-09 and names `docs/requirements/AGENTS.md` as that run found it.

`docs/design/4807-tanto.md` — the five headings drop their parenthetical; each section's first line carries its `Serves exp-…` line from the apply, and no live document keys on the headings (the one citation is in a closed topic's `.tanto/tanto-sweep-2/` file):

**P7.9** `docs/design/4807-tanto.md` — replace exactly these 1 lines

```text
## Skill layout (req-04f5)
```

**P7.9 →**

```text
## Skill layout
```

**P7.10** `docs/design/4807-tanto.md` — replace exactly these 1 lines

```text
## The shared checkout, and when a queued topic may commit (req-04f5)
```

**P7.10 →**

```text
## The shared checkout, and when a queued topic may commit
```

**P7.11** `docs/design/4807-tanto.md` — replace exactly these 1 lines

```text
## Plan conventions under tanto (req-04f5)
```

**P7.11 →**

```text
## Plan conventions under tanto
```

**P7.12** `docs/design/4807-tanto.md` — replace exactly these 1 lines

```text
## What a measurement can settle, and what it cannot (req-04f5)
```

**P7.12 →**

```text
## What a measurement can settle, and what it cannot
```

**P7.13** `docs/design/4807-tanto.md` — replace exactly these 1 lines

```text
## What makes a convention bind (req-04f5)
```

**P7.13 →**

```text
## What makes a convention bind
```

Lines 1074 and 1167 say "experience" instead:

**P7.14** `docs/design/4807-tanto.md` — replace exactly these 1 lines

```text
close, and the requirements and issues the spec produced land there too.
```

**P7.14 →**

```text
close, and the experience and issues the spec produced land there too.
```

**P7.15** `docs/design/4807-tanto.md` — replace exactly these 1 lines

```text
**Cost accepted.** `docs/` reflects a topic's requirements, ADRs, and issues
```

**P7.15 →**

```text
**Cost accepted.** `docs/` reflects a topic's experience, ADRs, and issues
```

`CONTRIBUTING.md` (repository root) — the same two edits as the CONTRIBUTING template, P1.16 and P1.17, filled for this repository; it is a filled layer-B file, not a checked copy:

**P7.16** `CONTRIBUTING.md` — replace exactly these 1 lines

```text
- [`docs/requirements/`](docs/requirements/) — what we're building
```

**P7.16 →**

```text
- [`docs/experience.md`](docs/experience.md) — who uses this and what they expect; scenes in [`docs/experience/`](docs/experience/)
```

**P7.17** `CONTRIBUTING.md` — replace exactly these 1 lines

```text
Project context documents under `docs/` — `requirements/`, `design/`,
```

**P7.17 →**

```text
Project context documents under `docs/` — `experience/`, `design/`,
```

**P7.18** `CONTRIBUTING.md` — replace exactly these 1 lines

```text
- `req-d4e5`
```

**P7.18 →**

```text
- `exp-d4e5`
```

`README.md` (repository root), line 54:

**P7.19** `README.md` — replace exactly these 1 lines

```text
  a project's living `docs/` (requirements / design / decisions / issues),
```

**P7.19 →**

```text
  a project's living `docs/` (experience / design / decisions / issues),
```

- [ ] **Step 4: Rewrite the three `Related` glosses from the file map**

Rules-driven, because the new wording is a run value. Each design file's `## Related` list opens with one requirement file's line: `e3f4` line 127, "- `req-3c4d` — shoroku's scope and required behavior."; `a5b6` line 50, "- `req-7a8b` — automated release purpose and behavior."; `c1d2` line 248, "- `req-1a2b` — kisou's scope and required behavior." — the spec's section 8 names the first two, and `c1d2`'s is the same shape. Replace each whole line by the file map's target for its id:

- target `exp-<id>`: "- `exp-<id>` — <the target's title if it is a scene, its expectation text if it is an item>, where <shoroku / kisou / automated release>'s requirements folded."
- target `hub`: "- `docs/experience.md` — the hub, where <shoroku / kisou / automated release>'s requirements folded."

No `req-` id stays on the line: the fold is recorded in history and in the dogfood report, and `docs/AGENTS.md`'s legacy sentence (P1.7) is its reading rule. O7.12 to O7.14 are this step's check, run:

```bash
# tree-state
for f in docs/design/e3f4-shoroku.md docs/design/c1d2-kisou.md docs/design/a5b6-automated-release.md; do
  n=$(grep -c "scope and required behavior\|automated release purpose and behavior" "$f" || true)
  r=$(sed -n '/^## Related/,$p' "$f" | grep -c 'req-[0-9a-f]\{4\}' || true)
  printf '%s: old glosses %s, req- in Related %s\n' "$f" "$n" "$r"
  [ "$n" = 0 ] && [ "$r" = 0 ] || exit 1
done
```

Expected: three lines, each `old glosses 0, req- in Related 0`.

- [ ] **Step 5: Move issue-320e and issue-c9df to `resolved/`**

The pairing pass over the 53 sections (Tasks 5 and 6) closes issue-320e, whose wording point P1.9's scope sentence settles; issue-c9df closes with proposals 1, 2, 3 and 5 met by W1.1's Expectations and P3.4, and proposal 4 rejected (D-2).

```bash
# tree-state
git mv docs/issues/open/320e-backfill-req-id-into-existing-design-sections.md docs/issues/resolved/320e-backfill-req-id-into-existing-design-sections.md
git mv docs/issues/open/c9df-shorokus-propose-step-states-a-requirement-as-the-source-sentence-not-the-need-behind-it.md docs/issues/resolved/c9df-shorokus-propose-step-states-a-requirement-as-the-source-sentence-not-the-need-behind-it.md
```

Set each moved file's frontmatter `updated:` to today's date (UTC) by hand, and each edited design file's `updated:` likewise — unless the apply already set it to today.

- [ ] **Step 6: Verify**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task 7
```

Expected: `task 7: verify clean`.

- [ ] **Step 7: Lint and commit**

```bash
# tree-state
p='docs/design/e3f4-shoroku.md docs/design/c1d2-kisou.md docs/design/4807-tanto.md docs/design/a5b6-automated-release.md CONTRIBUTING.md README.md docs/issues/resolved/320e-backfill-req-id-into-existing-design-sections.md docs/issues/resolved/c9df-shorokus-propose-step-states-a-requirement-as-the-source-sentence-not-the-need-behind-it.md'
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py $p || exit 1
./scripts/lint.sh $p || exit 1
git commit --only $p docs/issues/open/320e-backfill-req-id-into-existing-design-sections.md docs/issues/open/c9df-shorokus-propose-step-states-a-requirement-as-the-source-sentence-not-the-need-behind-it.md
```

Subject: `docs: the design side names experience; resolve issue-320e and issue-c9df`. End the message with your own `Co-Authored-By:` trailer. Done when: Step 2 printed nineteen `: 1` lines, this task's `verify` is clean, O7.12 to O7.14 are at `0`, lint passed, and `git status --porcelain --untracked-files=no` prints nothing.

### Task 8: The fold — `docs/requirements/` removed, every living `req-` rewritten

**Files:**

- Delete: `docs/requirements/` — its five files and `AGENTS.md` (`git rm -r`)
- Modify: every file under `docs/design/`, `docs/issues/open/`, `docs/issues/deferred/`, and `docs/notes/` that still names a `req-<id>`
- Create, untracked: `.tanto/experience-layer/req-sweep.js` (Step 2)

**Interfaces:**

- Consumes: `.tanto/experience-layer/file-map.txt` (Task 7 Step 1); the recommendation's per-sentence destinations and pairing-pass targets (Task 5), as the direction accepted them; the tree Tasks 6 and 7 left.
- Produces: a tree in which no living document names a `req-` id and every `## ` design section opens with its `Serves` line — the phase D fences' subject.

Spec section 9, batch C step 2 (this plan's batch D), and Fixed input 18. This task is a **sweep-and-check** shape: its text is rules, not passages, because what each mention becomes is the run's — the file map's target, or the destination the recommendation gave a sentence. The mechanical half is a script carried whole below; the half that needs judgment — a prose mention naming a bullet — is yours, and the counts check it. ADR bodies and dated reports keep their `req-` mentions (Fixed input 18); `docs/AGENTS.md`'s legacy sentence (P1.7) is how a reader resolves them.

**Named mechanisms this task touches.**

- **The `exp-` reference and the hub**: every rewritten mention is an `exp-<id>` — resolved by W1.1's lookup — or the hub's path, `docs/experience.md` (P1.6: the hub is cited by path). The file map (Task 7 Step 1) is the one table of targets.
- **The pairing's `Serves` line**: Step 2's script drops the one `Serves` sentence that sits under a `###` subsection — `e3f4`'s "Classification and the experience pairing", line 46 at the merge base — because its `## Workflow` section's own `Serves` line (Task 6) carries the pairing, and the phase D fence counts one `Serves` line per `## ` section. The rest of that line, "Added 2026-09-09; …", stays.
- **`TYPES`**: with `docs/requirements/AGENTS.md` gone, the P1.19 note can no longer fire in this repository; Task 1's tests keep it covered.

**Old values this task must clear.** Counts are lines, run at drafting; "living" is `docs/design/`, `docs/issues/open/`, `docs/issues/deferred/` and `docs/notes/`, which must hold none of them after this task.

**O8.1** `req-04f5` — living: `docs/design/4807-tanto.md` 22 (5 by Task 7, 1 by Task 6's `Serves` line, 16 here), `docs/design/e3f4-shoroku.md` 1 (Task 7, P7.5), `docs/issues/open/` 32, `docs/issues/deferred/` 1 — 0 after this task. **May stay:** `docs/decisions/` 28 lines, `docs/reports/` 3, `docs/issues/resolved/` 34 (closed records), `skills/tanto/roles/kanri.md` 1 (line 761; no task edits `skills/tanto/`), `docs/superpowers/**` 159.

**O8.2** `req-3c4d` — living: `docs/design/e3f4-shoroku.md` 2 (line 46 here; line 127, Task 7 Step 4), `docs/issues/open/` 5 lines, all in issue-0d43 (3), issue-320e and issue-c9df, which Tasks 3 and 7 move to `resolved/` before this task runs — 0 after this task. **May stay:** `docs/decisions/` 7, `docs/issues/resolved/` 8, `docs/superpowers/**` 42.

**O8.3** `req-1a2b` — living: `docs/design/c1d2-kisou.md` 3 (two `Serves` lines, Task 6; the gloss, Task 7 Step 4), `docs/issues/open/` 3, one each in issue-3bbb, issue-a331 and issue-320e, which Tasks 2 and 7 move to `resolved/` before this task runs — 0 after this task. **May stay:** `docs/decisions/` 3, `docs/reports/` 2, `docs/issues/resolved/` 7, `docs/superpowers/**` 31.

**O8.4** `req-5e6f` — living: `docs/issues/open/2028-…` 1 ("mirror the sentence in req-5e6f (the wayaku requirement)") — 0 after this task. **May stay:** `docs/superpowers/**` 1.

**O8.5** `req-7a8b` — living: `docs/design/a5b6-automated-release.md` 1 (Task 7 Step 4) — 0 after this task. **May stay:** `docs/superpowers/**` 2.

**O8.6** `docs/requirements/` — the directory this task removes. **May stay**, every one a record or out of this plan's reach: `docs/design/c1d2-kisou.md` 1 (line 176, inside the dated Refresh section); `docs/issues/open/36c0-…` 1 and `docs/issues/open/97bc-…` 1 (each describes `skills/tanto/roles/sekkei.md`'s spec-review input as it reads today — true until the rider below changes it); `skills/tanto/roles/sekkei.md` 1 (line 92, "`docs/decisions/` and `docs/requirements/`" — the spec's Deferred item 3); `docs/issues/resolved/` 6, `docs/reports/` 4, `docs/superpowers/**` 144. Zero after Task 7 and this task: `CONTRIBUTING.md`, `docs/AGENTS.md`, `docs/issues/AGENTS.md`, `docs/design/e3f4-shoroku.md`, and `docs/requirements/AGENTS.md` itself.

**O8.7** `Destination, one of requirements` — `skills/tanto/templates/kanri.md` 1 (line 53). **May stay:** the spec's Deferred item 3, for the next tanto topic's orders line; no task edits `skills/tanto/`.

**O8.8** `Destination one of requirements` — `skills/tanto/templates/roster.md` 1 (line 116). **May stay**, as O8.7.

**O8.9** `requirements, design, decisions, issues, notes, or reports>` — `skills/tanto/templates/batch-report.md` 1 (line 44), `skills/tanto/templates/kaiseki-report.md` 1 (line 59). **May stay**, as O8.7. `docs/superpowers/**` 14.

**O8.10** `name the requirement each decision serves` — `skills/tanto/roles/sekkei.md` 1 (line 71, "— `req-<id>` and the bullet"). **May stay:** no task edits `skills/tanto/`; a site the spec's Deferred item 3 does not list — Self-Review names it for the rider.

**O8.11** `Serves: <req-<id>, the bullet` — `skills/tanto/templates/review-brief.md` 1 (line 81); its line 75-76, "which requirement this design serves — read from the document's own `req-<id>` citations", is the same rule. **May stay**, as O8.10.

- [ ] **Step 1: Remove `docs/requirements/`**

```bash
# tree-state
git rm -r docs/requirements
test ! -e docs/requirements && echo 'docs/requirements removed'
```

Expected: six `rm` lines and `docs/requirements removed`. The `kisou-doc-system-check` hook runs on this commit, since `docs/requirements/AGENTS.md` matches its path pattern, and passes: the directory is in no target set, and the P1.19 note needs it present.

- [ ] **Step 2: Write and run the mechanical sweep**

Write this file with the Write tool — untracked scratch under `.tanto/`. It rewrites every mention that names only a requirement file — any `req-` id inside a `Related:` paragraph, from the `Related:` word to the paragraph's end — from the file map; drops `e3f4`'s one subsection `Serves` sentence; bumps `updated:` in every file it writes; and lists every other mention for Step 3:

```js
// req-sweep.js — the experience-layer plan's Task 8, the file-level half.
// node .tanto/experience-layer/req-sweep.js           lists what it would do
// node .tanto/experience-layer/req-sweep.js --write   does it
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const write = process.argv.includes("--write");
const today = new Date().toISOString().slice(0, 10);
const map = new Map();
for (const line of fs.readFileSync(".tanto/experience-layer/file-map.txt", "utf8").split(/\r?\n/)) {
  const m = line.match(/^(req-[0-9a-f]{4}) (exp-[0-9a-f]{4}|hub)$/);
  if (m) map.set(m[1], m[2] === "hub" ? "docs/experience.md" : m[2]);
}
if (map.size !== 5) {
  console.log(`the file map holds ${map.size} entries, expected 5`);
  process.exit(2);
}
const REQ = /req-[0-9a-f]{4}/g;
const swap = (text) => text.replace(REQ, (id) => map.get(id) ?? id);
const dirs = ["docs/design", "docs/issues/open", "docs/issues/deferred", "docs/notes"];
const files = dirs.flatMap((d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith(".md")).map((f) => `${d}/${f}`) : []));
let rewritten = 0;
const left = [];
for (const file of files.sort()) {
  const raw = fs.readFileSync(file, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  let related = false;
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const before = lines[i];
    if (before === "") related = false;
    const at = before.indexOf("Related:");
    if (at >= 0) related = true;
    if (related && REQ.test(before)) {
      const from = at >= 0 ? at : 0;
      lines[i] = before.slice(0, from) + swap(before.slice(from));
    }
    REQ.lastIndex = 0;
    if (lines[i] !== before) {
      console.log(`${file}:${i + 1}: ${before.trim()}\n    -> ${lines[i].trim()}`);
      rewritten++;
      changed = true;
    }
  }
  if (path.basename(file) === "e3f4-shoroku.md") {
    const h = lines.indexOf("### Classification and the experience pairing");
    let j = h + 1;
    while (j > 0 && j < lines.length && lines[j] === "") j++;
    if (h >= 0 && /^Serves .*?\. /.test(lines[j])) {
      const before = lines[j];
      lines[j] = before.replace(/^Serves .*?\. /, "");
      console.log(`${file}:${j + 1}: ${before.trim()}\n    -> ${lines[j].trim()}`);
      rewritten++;
      changed = true;
    }
  }
  lines.forEach((l, i) => {
    if (REQ.test(l)) left.push(`${file}:${i + 1}: ${l.trim()}`);
    REQ.lastIndex = 0;
  });
  if (changed && write) {
    const end = lines.indexOf("---", 1);
    for (let i = 1; i > 0 && i < end; i++) if (/^updated: /.test(lines[i])) lines[i] = `updated: ${today}`;
    fs.writeFileSync(file, lines.join(eol));
  }
}
console.log(`\n${rewritten} line(s) ${write ? "rewritten" : "to rewrite"}; ${left.length} mention(s) left for the sentence-level pass:`);
for (const l of left) console.log(`  ${l}`);
```

Run it once without `--write` and read the list — a rewrite that would misread a sentence is yours to stop — then with it:

```bash
# tree-state
node .tanto/experience-layer/req-sweep.js || exit 1
node .tanto/experience-layer/req-sweep.js --write || exit 1
```

Expected: each rewrite as a `->` pair, then the count line and the mentions left — in `docs/design/4807-tanto.md` the sixteen prose mentions and nothing that starts `Serves `; a left-over `Serves \`req-…\`` sentence means the apply missed a section, and you rewrite it from the pairing-pass item's target for that heading.

- [ ] **Step 3: The sentence-level pass**

For every mention Step 2 left, open the file at the line and rewrite the reference in place, by the spec's rule (section 9, batch C step 2):

- **A mention that names a bullet or a sentence** of a requirement file — "req-04f5's checkpoint bullet", "req-04f5's residency bullet", "req-04f5 puts the spec dialogue's judgment with the human", "req-04f5 asks that state live in files" — takes the destination the recommendation gave **that sentence**, as the direction accepted it: its `exp-<id>` when it became an expectation. When the sentence was dropped, or went to an issue, a design line or a decision candidate, it takes the file map's target for its file instead.
- **A mention that names only the file** — a bare citation such as `(req-04f5)` at the end of a sentence, or `req-04f5` as a list item — takes the file map's target.
- Change only the reference and the words that name the old file's part ("'s residency bullet" becomes the expectation's own words or is dropped); add no claim the sentence did not make. A hub target is written as its path, `docs/experience.md`.
- Bump `updated:` to today in each file you edit.

**A8.1** `docs/design/4807-tanto.md` — `grep -c 'req-[0-9a-f]\{4\}' docs/design/4807-tanto.md` — before: 16, after: 0

A8.1 is task-local: `design-4807` holds 22 of the 29 design mentions at the merge base; Task 7 removed the five headings' and Task 6's apply the one `Serves` line, which leaves the 16 this step rewrites. A different `before:` value means an earlier task left or took one more — record it in the report.

- [ ] **Step 4: Check the fold**

```bash
# tree-state
test ! -e docs/requirements || { echo 'docs/requirements still exists'; exit 1; }
left=$(grep -rn 'req-[0-9a-f]\{4\}' docs/design docs/issues/open docs/issues/deferred docs/notes || true); [ -z "$left" ] || { printf 'req- left in living documents:\n%s\n' "$left"; exit 1; }
a=$(grep -rl 'req-[0-9a-f]\{4\}' docs/decisions | wc -l); l=$(grep -rh 'req-[0-9a-f]\{4\}' docs/decisions | wc -l); printf 'ADRs still naming req-: %s files, %s lines\n' "$a" "$l"; [ "$a" = 23 ] && [ "$l" = 38 ] || exit 1
for f in docs/design/[0-9a-f]*.md; do s=$(grep -c '^## ' "$f" || true); v=$(grep -c '^Serves ' "$f" || true); printf '%s: sections %s, Serves lines %s\n' "$f" "$s" "$v"; [ "$s" = "$v" ] || exit 1; done
for t in $(grep -rho 'exp-[0-9a-f]\{4\}' docs/design docs/issues/open docs/issues/deferred docs/notes | sort -u); do id=${t#exp-}; ls docs/experience/"$id"-*.md >/dev/null 2>&1 || grep -rqs "\*\*$id\*\*" docs/experience docs/experience.md || { echo "unresolved $t"; exit 1; }; done
echo 'every exp- reference in a living document resolves'
```

Expected: `ADRs still naming req-: 23 files, 38 lines`, five `sections N, Serves lines N` lines — 24, 9, 8, 7 and 5 sections; measured at drafting, no design file carries a fenced `## ` line, so the plain count is exact — and the last line. This is the phase D fence's check, run here unguarded because the dogfood report that opens its guard is Task 9's.

- [ ] **Step 5: Verify**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task 8
```

Expected: `task 8: no passages` — A8.1's `after:` holds, or `verify` prints its failure.

- [ ] **Step 6: Lint and commit**

```bash
# tree-state
paths=$(git diff --name-only HEAD)
printf '%s\n' "$paths"
changed=$(git diff --name-only --diff-filter=d HEAD -- '*.md')
printf '%s\n' "$changed" | xargs uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py || exit 1
printf '%s\n' "$changed" | xargs ./scripts/lint.sh || exit 1
git commit --only $paths
```

`$paths` is the six removed `docs/requirements/` files and every file Steps 2 and 3 edited — nothing else may be in it; stop if it names a path outside `docs/`. Subject: `docs: remove docs/requirements and point living documents at experience`. End the message with your own `Co-Authored-By:` trailer. Done when: Step 4 passed, `verify` is clean, the hooks accepted the commit, and `git status --porcelain --untracked-files=no` prints nothing.

### Task 9: The verification sweep and the dogfood report

**Files:**

- Create: `docs/reports/<YYYY-MM-DD>-experience-layer-dogfood.md`, dated by its file name only — the day it is written
- Create, untracked: `.tanto/experience-layer/final-sweep.md`, the recorded output

**Interfaces:**

- Consumes: every task; the ledger `.tanto/experience-layer/kanri.md`; the recommendation, the direction, and the untracked starts of Tasks 5 and 6.
- Produces: the report the topic's close reads.

The spec's Verification and section 11. A **sweep-and-check** shape in its first half — its output is a record, not an edit — and a file deliverable in its second. The report is frozen once committed (`docs/reports/AGENTS.md`); a number this task cannot know yet — anything the topic's close decides — is not a blank in it but a line in the ledger at the close.

**Named mechanisms this task touches.** None it changes. It counts the `exp-` references and the `Serves` lines every earlier task wrote, and it is the first run of the exit-criterion note's measurement (W4.2), by hand.

- [ ] **Step 1: Open the report's file**

Write `docs/reports/<today>-experience-layer-dogfood.md` with its title line alone, `# The experience-layer dogfood`, with the Write tool. The phase D fences of "How a batch is verified" are guarded by this file's existence, so from here they run for real.

- [ ] **Step 2: Run the whole verification once, and record it**

Run, in order, and copy each command and its full output into `.tanto/experience-layer/final-sweep.md`: one `verify` per task, 1 to 9 — tasks 1 to 4 against the tree as batch D left it, which is expected to hold, since no later task edits their passages' lines; the `diff` fence (step 2 of "How a batch is verified"); the lint fence (step 3); every fence of step 4, phases A to D; and `node .tanto/experience-layer/scene-check.js`. Each must end as its `Expected:` paragraph says. A failure is not repaired here: record it, and report it to Kanri.

- [ ] **Step 3: Gather the report's numbers**

```bash
# tree-state
base=$(git merge-base main HEAD)
printf 'req- lines in living documents at the merge base: %s\n' "$(git grep -h 'req-[0-9a-f]\{4\}' "$base" -- docs/design docs/issues/open docs/issues/deferred docs/notes | wc -l)"
printf 'req- lines in living documents now: %s\n' "$( (grep -rh 'req-[0-9a-f]\{4\}' docs/design docs/issues/open docs/issues/deferred docs/notes || true) | wc -l)"
printf 'req- lines in ADRs at the merge base / now: %s / %s\n' "$(git grep -h 'req-[0-9a-f]\{4\}' "$base" -- docs/decisions | wc -l)" "$(grep -rh 'req-[0-9a-f]\{4\}' docs/decisions | wc -l)"
printf 'migration commit: %s\n' "$(git log -1 --format='%h %cs %s' --grep='^docs: fold requirements into experience$')"
start=$(cat .tanto/experience-layer/apply-start.txt)
printf 'scenes created by the apply: %s; edited: %s\n' "$(git diff --name-only --diff-filter=A "$start" HEAD -- docs/experience | grep -c '/[0-9a-f]\{4\}-' || true)" "$(git diff --name-only --diff-filter=M "$start" HEAD -- docs/experience | grep -c '/[0-9a-f]\{4\}-' || true)"
printf 'issues opened by the apply: %s\n' "$(git diff --name-only --diff-filter=A "$start" HEAD -- docs/issues/open | wc -l)"
printf 'design sections paired / serving none: %s / %s\n' "$(grep -h '^Serves exp-' docs/design/[0-9a-f]*.md | wc -l)" "$(grep -h '^Serves no expectation' docs/design/[0-9a-f]*.md | wc -l)"
printf 'scene files now: %s (the cap is 10)\n' "$(ls docs/experience/*.md | grep -vc AGENTS)"
cat .tanto/experience-layer/file-map.txt
r=.tanto/experience-layer/migration-recommendation.md
for g in 'Recommended adopt' 'Recommended fix' 'Recommended reject' 'Unsure'; do printf '%s: %s\n' "$g" "$(awk -v g="## $g" '$0 == g {on = 1; next} /^## / {on = 0} on && /^### / {c++} END {print c + 0}' "$r")"; done
printf 'Sekkei questions in dialogue.md: %s, design sections: %s\n' "$(grep -c '^## Q[0-9]' .tanto/experience-layer/dialogue.md)" "$(grep -c '^## Design section' .tanto/experience-layer/dialogue.md)"
printf 'points in the spec review brief: %s\n' "$(grep -cE '^[0-9]+\. \[' .tanto/experience-layer/review-brief-spec.md)"
node --version
node --test --test-reporter=tap 'skills/kisou/scripts/*.test.js' 2>&1 | grep -E '^# (tests|pass|fail) '
```

Expected, where drafting could measure it: `68` at the merge base and `0` now; ADRs `38 / 38`; the migration commit's line; 53 design sections in all; the five map lines; `# tests 59`, `# pass 59`, `# fail 0`; Sekkei's questions `4` and design sections `3` (Q1 to Q3 and the review's Q4); `20` brief points. The rest are the run's.

- [ ] **Step 4: Write the report**

Complete the file Step 1 opened, following `docs/reports/AGENTS.md` — no frontmatter, the `# H1` its title, a leading paragraph stating the scope (this topic's migration of `docs/requirements/` into `docs/experience/`, run inside its own plan), and no date inside the body. Its **Measurements** section is a bullet list, and every bullet below is required:

- **The decision file §9 step 5's counts**: source sentences dropped, moved to an issue, salvaged into an expectation, and moved to design or a decision candidate — counted from the recommendation's items and their destinations as the direction settled them; scenes created and scenes edited (Step 3); design sections paired versus "serves no expectation" (Step 3); and the five-entry file map, as written.
- **The recommendation**: its item count per group and its `Unsure` count (Step 3); how many items the human's answer changed, and how — accepted against the recommendation, rejected, edited — read from `.tanto/experience-layer/migration-direction.md`; and the elapsed time between batch C's report and the direction file, read from the ledger `.tanto/experience-layer/kanri.md` (its Session events and Batches sections).
- **The `req-` counts**: in living documents 68 before and 0 after; in ADRs 38 lines in 23 files before and after, unchanged; and the migration commit's date — the date `docs/AGENTS.md`'s legacy sentence (P1.7) leaves unstated.
- **The kisou suite**: 57 tests before this plan and the count after (59 at drafting), so that the suite is known not to have lost a case.
- **The secondary criterion's first measurement** for this topic (W4.2): Sekkei's question count — Q1 to Q3 and the review's Q4, plus the three design sections; the review brief's point count; and the items the spec review sent back as design, counted from `.tanto/experience-layer/spec-review.md`'s findings.
- **The scene count** against the cap of 10 — reported, not judged.
- **What the run taught about the type rules' wording** — where the recommender or the apply read `docs/experience/AGENTS.md` differently from its intent, one line each, as input to the close's recommender.

A **Not in this report** line names what only the topic's close can know — the primary criterion's first count, and whether the close's apply appended `→ decision-<id>` to Scene A's `2b72` — and says those are recorded in the ledger's Progress section at the close.

- [ ] **Step 5: Verify**

```bash
# tree-state
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-30-experience-layer.md --task 9
```

Expected: `task 9: no passages`.

- [ ] **Step 6: Lint, commit, and restore the line endings**

```bash
# tree-state
f=$(ls docs/reports/*-experience-layer-dogfood.md)
./scripts/lint.sh "$f" || exit 1
git add "$f"
git commit --only "$f"
```

Subject: `docs(reports): the experience-layer dogfood`. End the message with your own `Co-Authored-By:` trailer. Then:

```bash
# tree-state
f=$(ls docs/reports/*-experience-layer-dogfood.md)
git checkout -- "$f"
git ls-files --eol "$f"
git status --porcelain --untracked-files=no
```

Expected: `i/lf w/crlf`, and no tracked change. Done when: Step 2's record is complete with every check at its `Expected:` value or a failure reported, the report carries every bullet of Step 4, and the commit landed.

## Self-Review

**Largest task.** Measured with `frame --stage 2` (the step region) and by heading-to-heading line count:

| Task | Lines | Step region | Steps | What makes it large |
| --- | --- | --- | --- | --- |
| 1 | 1174 | 1103 | 8 | W1.1 (236 lines), 35 `P` blocks over eight files, 19 `O` lines |
| 7 | 472 | 417 | 7 | 19 `P` blocks over six files, 14 `O` lines |
| 4 | 368 | 345 | 7 | the checker carried whole (about 150 lines), W4.1 and W4.2, the scene table |
| 2 | 237 | 202 | 6 | W2.1 and 7 `P` blocks |
| 3 | 232 | 195 | 5 | 8 `P` blocks, 6 `O` lines |
| 8 | 193 | 148 | 6 | the sweep script carried whole, 11 `O` lines |
| 6 | 125 | 104 | 6 | the apply dispatch text |
| 5 | 122 | 101 | 6 | the recommend dispatch text |
| 9 | 95 | 79 | 6 | the numbers fence and the report's required bullets |

**Task 1 is large by construction, and a sonnet implementer can carry it.** The hook makes the templates, the instrument, its tests and the copies one commit, and the Batches table makes that commit one task. Its size is text to paste, not judgment: Steps 1 to 4 apply blocks exactly as written, Step 5 runs the instrument and compares its item list with a printed expectation, and Steps 6 to 8 are one `verify`, one lint, two commits. The one place a mistake shows late — a template block applied differently than written — is caught at Step 5, before any copy is written, by the nine-item list. Every block was applied to a scratch copy at drafting: the suite passed 59 of 59, markdownlint and Biome were clean on every changed file, and the instrument's `check` came back `0 items, 0 notes` after `apply`.

**Sweep-and-check shapes.** Tasks **5**, **6**, **8** and **9**: 5 and 6 deliver a dispatch and the recorded checks of what another agent wrote; 8 is a script plus a sentence-level pass whose check is counts; 9's first half is recorded output. Task 4 is rules-and-checks for its seven scenes (their ids are drawn at run time) and ships two `W` blocks besides. A reviewer of these reads the output against the spec, not a diff against blocks — the inversion issue-7281 names.

**Spec coverage.** Fixed inputs 1 to 23 → Global Constraints and the tasks below; section 1 (the layer, the seven scenes) → Task 4; section 2 (the type rules) → Task 1, W1.1; section 3 (the hub skeleton; this repository's hub) → Task 2, W2.1, and Task 4, W4.1; section 4 (`docs/AGENTS.md`) → Task 1, P1.1 to P1.8, and the instrument for the copy; section 5 (design, decisions, issues, CONTRIBUTING templates and copies; the root CONTRIBUTING) → Task 1, P1.9 to P1.17, and Task 7, P7.16 to P7.18; issue-a9c3 and issue-c477 → Task 1 Step 8; section 6 (kisou `SKILL.md`, the instrument, its test, the READMEs, issue-3bbb, issue-a331, issue-0d43) → Tasks 1, 2 and 3; section 7 (shoroku `SKILL.md`) → Task 3; section 8 (the four design files) → Task 7; section 9 (the two dispatches, the fold, the moves of issue-320e and issue-c9df, `README.md` line 54) → Tasks 5, 6, 7 and 8; section 10 (the note) → Task 4, W4.2; section 11 (the dogfood report) → Task 9; Verification → "How a batch is verified" and each task's own checks; Requirements (the three wants to carry forward) → Task 5's dispatch, which points the recommender at that section; Old values this plan contradicts, and the spec review's "Sentences the Old values list does not name" → the `O` lines of Tasks 1, 2, 3, 7 and 8; Out of scope, The ADRs, Deferred items → nothing in this plan edits `skills/tanto/`, writes an ADR, or takes a deferred item, and the tanto sites are declared as `O` lines that stay.

**Placeholder scan.** No "TBD", no "similar to Task N", no step without its text or command. The values that are the run's, each produced by the step that needs it: the seven scene ids (Task 4 Step 2), the commit dates and `updated:` stamps, `START` in Tasks 5 and 6 (kept in `apply-start.txt` for Task 6), the file map (Task 7 Step 1), the sentence-level targets (Task 8 Step 3), and the report's date and run counts (Task 9).

**Review focus** — the failure modes most likely to bite and the check that pins each: a template block applied loosely, which Task 1 Step 5's nine-item list catches before any copy is written; a scene quote retyped rather than copied, which scene-check's quote pass catches against the two untracked files; an `[inferred]` line written at MUST, which scene-check refuses; an apply that touched a line a Task 7 block quotes, which Task 7 Step 2 stops on; a `req-` mention the sweep misreads, which Task 8 Step 2 prints for a human eye before `--write` and Step 4 counts afterwards.

**Type and name consistency.** The untracked files carry one name each across the tasks that share them: `.tanto/experience-layer/scene-check.js` (Tasks 4, 6, 9), `apply-start.txt` (6, 9), `file-map.txt` (7, 8), `req-sweep.js` (8), `final-sweep.md` (9). The pointer word is `experience-layer` in Task 5's dispatch, the phase C fence and Task 6's dispatch; the commit subjects `docs: fold requirements into experience` and `fix: text corrections from the experience migration` are spelled the same in Tasks 6 and 9 and in the Batches table. The note's text is one string, written by P1.19 and asserted by P1.25.

**Facts measured at drafting that did not match the spec's expectation**, each run, not assumed:

1. **The input's §1 carries 27 expectations, not 29.** Scene A 4, B 4, C 4, D 4, E 2, F 6, G 3; with the 5 Drivers, 4 Won't items and the one open question, 37 item ids, not 39. Task 4's checker pins 27; none of the 37 collides with a document id, as the spec says.
2. **issue-0d43's own sentence is `skills/shoroku/README.md` lines 16-18**, "excerpts the current **session** (default) or **memory** (explicit)", not lines 3-5, which carry the same omission. Resolving the issue on lines 3-5 alone would leave its sentence standing, so Task 3 edits both (P3.6, P3.8) — a **departure** from spec section 6, which names lines 3-5 only.
3. **`docs/design/e3f4-shoroku.md` holds a `Serves req-3c4d.` line under a `###` subsection** (line 46), not under a `## ` heading. With the pairing pass writing one `Serves` line per `## ` section, `e3f4` would count 7 sections and 8 `Serves` lines, and the phase D fence would fail. Task 8's script drops that one `Serves` sentence and keeps the rest of the line — a **departure** from spec section 8's "the section's `Serves` line names the `exp-` items", taken so that spec Verification's one-per-section equality holds. The other three existing `Serves` lines sit directly under a `## ` heading, and no design file carries a fenced `## ` line, so the plain count in the phase D fence is exact (fence-aware and raw counts equal: 24, 5, 8, 9, 7).
4. **`skills/tanto/` names the old layer in more places than Deferred item 3's five**: `roles/kanri.md` line 1017 (the recommend mode's `req-<id>` pairing and "a requirement or an ADR item"), `roles/kanri.md` line 761 ("(req-04f5)"), `roles/sekkei.md` line 71 ("name the requirement each decision serves — `req-<id>`"), and `templates/review-brief.md` lines 75-76 and 81 ("Serves: <req-<id>, the bullet …>"). Declared as `O` lines that stay (O3.3, O7.7, O8.10, O8.11), for the rider list.
5. **The decisions template's "the only mutable parts of an accepted ADR"** (line 104-105) was checked by the spec against a redaction, before D-7 added issue-c477's exception; read literally the exception is a fourth mutable part. Not edited (spec); flagged as O1.15 for the close's recommender.
6. **`docs/design/c1d2-kisou.md`'s `## Related` list opens with the same gloss shape** the spec names for `e3f4` and `a5b6` — "`req-1a2b` — kisou's scope and required behavior." Task 7 Step 4 rewrites all three — a **departure** by one line from spec section 8.
7. **The instrument lists the root's items first**: `check` after Task 1's edits prints `9 items, 1 note` with `create: docs/experience/AGENTS.md` fourth, after the three root sections, and the P1.19 note fires on this repository's own `docs/requirements/` until the copy exists.
8. **The type table's column.** Spec section 4's two new lines put their gloss at column 41; the file's table puts every gloss at column 44. P1.1 follows the file — whitespace only.
9. **kisou's README line 50** says shoroku fills the system "by excerpting sessions or memory" — issue-0d43's omission in a second README, not drift from this plan's edits (O2.5); Task 2 carries it to the batch report as a proposal item rather than widening the task.
10. **Two added-line families the boundary's `diff` cannot account for from blocks**: the deleted `requirements` template's lines and the installed copies' `{{name}}`-expanded lines. Both are path-filtered in "How a batch is verified" step 2 (the phase A `check` is the check on the copies), so Task 1 carries no fence of them.
11. **This host's console is cp932**: a Python `print` of a value holding an em dash raises `UnicodeEncodeError`, so Task 3's YAML load prints a length, not the value.

**Reports and prompts** follow the tanto templates; this plan carries no skeleton for either. The migration brief's two path names are overridden in Task 5's dispatch, as Global Constraints says.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-30-experience-layer.md`. Please review the plan. Does it capture what you want?

The execution method is already set by tanto: Subagent-driven, one batch per Jisso session, with `task.implement` on sonnet/high, `task.escalate` on opus/high, and the two reviewers on opus/medium, as Global Constraints pins them; Task 5's and Task 6's dispatches name their own kinds. The boundary after batch C waits for the human's direction.
