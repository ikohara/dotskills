# bug-report-hold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the bug intake to the cheapest live seat with an act that reads nothing, hold every report untracked until a close decides it beside the proposal items, open every open and deferred issue with a `Source:` line the repository's own hook checks, and let a one-sentence repair be applied in a commit of its own instead of filed as an issue.

**Architecture:** Every change is a passage — an exact old text re-quoted from the live tree and the exact new text the spec gives, an insertion anchored on quoted lines, or a section replaced whole between two headings. Two things are replaced whole: `roles/kanri.md`'s "Bug intake" section (115 lines, heading to heading) and `templates/bug-report.md` (a `W` block). Tasks are ordered so the repository side lands first (the retrofit before the hook that would reject an unlabelled file), then the fourth recommendation group with every site that pins the brief's heading count, then the reserved names and the remaining templates, then the intake's arrival in `roles/hosa.md`, and last the sender-side text every other repository reads off the linked tree.

**Tech Stack:** Markdown, plus one Python hook and one new `unittest` file. `node "$TANTO/scripts/passage-check.js"` verifies the passages; `./scripts/lint.sh <paths>` (`scripts\lint.bat <paths>` on Windows) runs pre-commit on the changed paths — the script takes path arguments, so every lint step names them; `uv run --no-project --with pyyaml python` runs the hook and its test.

**Spec:** `docs/superpowers/specs/2026-09-19-bug-report-hold-design.md` — committed on this branch. The plan argues from the spec; executors read both.

**`$TANTO`** is the tanto skill's own directory, `C:\Users\0000105523\.claude\skills\tanto`, as `SKILL.md` sets it.

**Old texts** were re-quoted from the working tree on branch `bug-report-hold` at drafting time, after the spec's own commits. Every fenced old block below was read out of the live file, not copied from the spec, and every `O` needle's count below was run against the tree, not asserted. The spec's own needle list was written against newline-folded copies; this plan's `O` needles are single-line forms, because `replay` sweeps the raw text and a needle that wraps in its target returns `0` and reads as "already gone". See Self-Review for the four facts that did not match the spec's expectation.

## Global Constraints

- **AGENTS.md.** Every commit follows the repo's `AGENTS.md`: run `./scripts/lint.sh` (`scripts\lint.bat` on Windows) on the changed paths, relative to the repo root, and fix issues before committing; commit by explicit path with `git commit --only <paths>` — the index is shared, so a new file needs `git add <path>` first, since `--only` cannot pick up an untracked one; end every commit message with a `Co-Authored-By:` trailer naming the agent that made it; never `git add -A`/`.`/`-u`, a bare `git commit`, or `git commit -a`; never bypass a commit or push hook (`--no-verify`, `-n`); never amend a published commit; never push to `origin/main`. This plan lands its commits on the `bug-report-hold` branch; the merge to `main` is the human's own decision at the topic's close, not a step of this plan.
- **This plan is itself the "explicit human approval" AGENTS.md asks for before an agent instruction file is edited** — for exactly the files named in the File structure table below, and no others. `CLAUDE.md`, the repo-root `AGENTS.md`/`CONTRIBUTING.md`/`README.md`, and every linter or formatter config stay off limits without a fresh, separate approval; no task here touches them. The approval is on record in `.tanto/kikaku/2026-09-15-bug-report-hold.md`, `.tanto/kikaku/2026-09-17-issue-source-line.md`, the accepted spec, and the human's answers in `.tanto/bug-report-hold/dialogue.md`.
- **Not yours to discard.** A modification in the shared tree that you, or a subagent you dispatched, did not make is not yours to discard — report it, one line naming the file and what changed, rather than running `git checkout --` or `git clean` on your own judgment. Only Kanri decides whether it is stray (Rule 5). The one exception is the line-ending restore this plan writes into a task's own steps, which names its own path.
- **Model families**, read from `C:\Users\0000105523\.claude\skills\tanto\templates\tanto.json` merged with `C:\Users\0000105523\devel\dotskills\.claude\tanto.json` at this plan's drafting. The project layer overrides only `sessions.kikaku` and `sessions.sekkei`, neither of which is a subagent kind, so every kind below is the built-in default. Every dispatch you make names both a `subagent_type` and a `model` together — an omitted `model` inherits your own session's, which is not what these kinds are pinned to:

  | Kind | `subagent_type` | Model | Effort |
  | --- | --- | --- | --- |
  | `task.implement` (fix rounds 1-3) | `tanto-task-implement` | sonnet | high |
  | `task.escalate` (fix rounds 4-5, one tier above the implementer that got stuck) | `tanto-task-escalate` | opus | high |
  | `task.review-spec` | `tanto-task-review-spec` | opus | medium |
  | `task.review-quality` | `tanto-task-review-quality` | opus | medium |
  | `default` (an ad-hoc search outside the SDD loop) | `tanto-default` | sonnet | medium |

- **This plan edits the tanto skill's own files, so contract rule 11 governs the run.** The authority for every session of this run is **this plan, Kanri's orders line, and the batch prompts — not the role text on disk**, which is half-edited from batch B onward. A session that reads its own role file mid-plan reads a file this plan is in the middle of rewriting; where the two disagree, this plan and the batch prompt win, and Kanri records that override as its own `R-n` at the plan's landing so every batch prompt and any handover file carries it forward.
- **The safe boundary for starting or replacing a role is the final one** — batch E accepted, or the fix wave that follows the whole-branch review, whichever this run actually ends on. No role is started or replaced before it. Every role file this skill ships changes somewhere across this plan, and the sender-side text lands last of all, so a session started earlier reads a skill that disagrees with itself. This holds even if a context-ceiling verdict of `over` is read for Kanri or for this plan's Jisso at an earlier boundary: rule 11 overrides the ordinary Replace trigger for the whole run. The one Replace trigger it still allows before that boundary is decision-6dea's Replace-on-compaction, whose replacement reads under this same Global Constraints authority rather than cold from the half-edited disk text.
- **The live Hosa keeps its old intake act until the merge.** `roles/hosa.md`'s new intake paragraph lands in batch D and the sender-side text in batch E, but the Hosa that is live while this plan runs was started before either. It goes on doing what it started with, and Kanri's interim ruling (the decision file §7 — a report received is held untriaged, `held (untriaged), per R-8` in the copy) stands until this branch lands on `main`. The human releases the live Hosa at the final boundary and opens a new one after the merge, so that the first Hosa a sender reaches under the new rule has read it. A report that arrives at Kanri meanwhile takes the interim act, which is the new one in all but the address.
- **Senders in other repositories read the linked tree mid-plan.** A session of another workspace started while this plan is in flight reads whatever `skills/tanto/SKILL.md` says that day. That is why `SKILL.md` 2.2, `roles/kaiseki.md` 5, and the whole of `roles/kanri.md` 3.6 are in the final batch, after `roles/hosa.md` 4.1: until they land, a sender still addresses the first roster row, which is Kanri, which still holds the interim act.
- **The tracked-write rule binds every commit of this plan.** A tracked file or a commit message names a report's source as `inbox <YYYY-MM-DD>-<slug>` and nothing more — no repository name or path, no session name, no topic name of the reporter's, no quotation of the reporter repository's own documents. It binds the retrofit's `Source: inbox …` lines, this plan's commit messages, the dogfood report, and any issue a fix round files.
- **Named-mechanism rule for tasks.** A task that introduces or changes a named mechanism — the `received:` line, the `Source:` line and its four kinds, the `Recommended fix` group, the `sweep:` line, the reserved names of `.tanto/`, the six Triage outcome words, the `fix: text corrections from …` subject — lists in its own text every other site in this plan's files, and in the repository files this plan touches, that names the same mechanism, so that its reviewer checks them together. Each task below carries that list under **Named mechanisms this task touches**.
- **Line-ending rule for tasks.** A task that creates or rewrites a Markdown file whole and later checks its line endings writes the restore — `git checkout -- <path>` after the commit — into the task's own steps, not only into the stop condition: a file written fresh lands `w/lf` on this host every time. Tasks 12 and 17 carry it.
- **Reports and prompts follow the tanto templates.** No skeleton for a batch report, a batch prompt, or a review brief appears in this plan; the templates in the skill directory are the skeletons.

## File structure

| File | What this plan does to it | Tasks |
| --- | --- | --- |
| `docs/issues/open/*.md`, `docs/issues/deferred/*.md` | 234 files each gain a `Source:` line as their first body line, `updated:` restamped | 1 |
| `scripts/check_md_frontmatter.py` | gains `import re`, `SOURCE_RE`, `SOURCE_HINT`, `_is_checked_issue`, and one body check in `check()` | 2 |
| `scripts/test_check_md_frontmatter.py` | **new** — `unittest` cases for the `Source:` check | 2 |
| `docs/issues/open/c3a9-…md` | narrowed: new title, a dated paragraph, `updated:` restamped | 3 |
| `skills/shoroku/SKILL.md` | the `session` kind, the fourth group, the pointer in the item heading, apply mode's two extra writes, the prohibition | 4 |
| `skills/shoroku/README.md` | the mode summary's tag list | 4 |
| `skills/tanto/templates/shoroku-brief.md` | five `##` headings, the `fix` tag, the new group | 4 |
| `skills/tanto/roles/kanri.md` | Shoroku steps 2-4 and the two paragraphs after them; Delegation to Hosa; Start steps 2 and 5; loop step 4; Handover's trigger; the opening paragraph; "Bug intake" replaced whole | 5, 9, 14 |
| `skills/tanto/roles/hosa.md` | the `close:` paragraph and the `sweep:` line; Models; "Not yours"; Lifecycle; the intake paragraph; the opening paragraph | 6, 11 |
| `skills/tanto/SKILL.md` | Session exit and the Artifacts table; the roles table, the `no-role` bullet, the reserved names, One boss and rule 1; the Messages bug-report paragraphs | 7, 8, 15 |
| `skills/tanto/templates/roster.md` | the Shoroku proposal items paragraph and the Events line | 10 |
| `skills/tanto/templates/kanri.md` | the Events line | 10 |
| `skills/tanto/templates/bug-report.md` | **replaced whole** | 12 |
| `skills/tanto/README.md` | the bug-report bullet | 13 |
| `skills/tanto/roles/kaiseki.md` | the standalone reporter clause | 15 |
| `docs/notes/tanto-consistency-checks.md` | the five-`triage:` loop replaced; checks 18 and 19 re-pinned | 16 |
| `docs/reports/<date>-bug-report-hold-dogfood.md` | **new** — the dogfood report | 17 |
| `.tanto/bug-report-hold/old-value-sweep.md` | **new**, untracked — the final sweep's recorded output | 17 |
| `.tanto/inbox/*.md` | untracked, on this machine only — 21 filled Triage sections normalized | 1 |

**Not touched**, from the spec's own list: `roles/sekkei.md`, `roles/keikaku.md`, `roles/jisso.md`, `roles/kikaku.md`, `templates/kanri-handover.md`, `templates/batch-prompt.md`, `templates/batch-report.md`, `templates/kaiseki-brief.md`, `templates/kaiseki-report.md`, `templates/review-brief.md`, `templates/kikaku-decision.md`, `templates/agent.md`, `templates/tanto.json`, `templates/roster-archive.md`; `scripts/reading.js` and `scripts/passage-check.js` with their tests; `.pre-commit-config.yaml` (the hook already runs on every Markdown file, so the issues check is a path test inside the script); `docs/issues/AGENTS.md`; `docs/issues/resolved/**`; kisou's templates. `docs/design/4807-tanto.md`'s "Bug intake" and shoroku sections are the close's, through the recommender — not a task here.

**Issues.** issue-a79c, issue-d45c, issue-59c9, and issue-9d17 are closed by this design; moving their files to `docs/issues/resolved/` is the close's business (the T2 that lands this plan), not a task of this plan's. issue-c3a9 is **narrowed, not closed**, and its narrowing *is* a task (Task 3).

## Batches

Seventeen tasks in five batches. No role is started or replaced at any boundary in this table — see Global Constraints: the safe boundary is the final one.

| Batch | Tasks | Delivers | Stop condition at this boundary |
| --- | --- | --- | --- |
| A | 1, 2, 3 | Every open and deferred issue opens with a `Source:` line; the frontmatter hook checks it, with its own test; issue-c3a9 narrowed | Tasks 1-3 `verify` clean; `grep -L '^Source: ' docs/issues/open/*.md docs/issues/deferred/*.md` prints nothing; `grep -l '^Source: ' docs/issues/resolved/*.md \| wc -l` is `0`; the hook's test passes; the hook run over all 234 files exits `0`; the four kind counts recorded for the dogfood report |
| B | 4, 5, 6, 7 | The `Recommended fix` group and the brief's five `##` headings, in every one of the five files that pin the count — `skills/shoroku/SKILL.md`, `templates/shoroku-brief.md`, `roles/kanri.md`, `roles/hosa.md`, `skills/tanto/SKILL.md` (spec Measured 5) | Tasks 4-7 `verify` clean; `grep -c '^## ' skills/tanto/templates/shoroku-brief.md` is `5` and `grep -c '^## Recommended fix$'` on it is `1`; `grep -cF 'three groups' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md skills/shoroku/SKILL.md` is `0` on each; the consistency note's checks 18 and 19 are **expected to fail** here and are repaired in Task 16 |
| C | 8, 9, 10 | The reserved names of `.tanto/` as one list, read by Kanri's Start; the batch loop's step 4; the roles table; the `received:` answer named in the contract; the two templates' Events lines | Tasks 8-10 `verify` clean; `grep -c 'reserves these names' skills/tanto/SKILL.md` is `1`; `grep -c 'reserved names' skills/tanto/roles/kanri.md` is `2`; `grep -c 'triage:' skills/tanto/SKILL.md` is `3` (Task 8's P8.3 already cleared the no-role bullet's own occurrence) and `grep -c 'triage:' skills/tanto/roles/kanri.md` is still `4` — expected, the remaining forms live in the two sections batch E replaces |
| D | 11, 12, 13 | Hosa's own file carries the intake act and the `received:` exception; the report template is replaced whole; the README's bullet | Tasks 11-13 `verify` clean; `grep -cF 'received: <inbox path>' skills/tanto/roles/hosa.md` is `1`; `git diff --stat` shows `skills/tanto/templates/bug-report.md` with no line-ending churn after the restore step; a sender reading the tree today still finds the old address rule in `SKILL.md` — expected, that is batch E's |
| E | 14, 15, 16, 17 | "Bug intake" replaced whole; the contract's Messages paragraphs and the standalone Kaiseki's reporter clause — the sender side, landing last; the consistency note; the final sweep and the dogfood report | Tasks 14-17 `verify` clean; every command in "How a batch is verified" below at its stated value; Task 17's sweep output read by a human eye with a disposition recorded for every residual hit; **the plan's final boundary if the whole-branch review then comes back clean** — if it does not, the fix wave that follows is the actual final boundary, and the release-and-reopen of the live Hosa waits for that one |

## How a batch is verified

Every batch is verified the same way.

1. One `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task <N>` per task in the batch.
2. The boundary check, comparing the branch's actual commits against this plan's own passage blocks for every task accepted so far — `$TANTO` set in the same shell invocation, since shell state does not persist between tool calls:

```bash
TANTO="C:/Users/0000105523/.claude/skills/tanto"
node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --base "$(git merge-base main HEAD)"
```

Expected: no unexplained hunk.

3. Lint, on the batch's changed paths **by name** — `scripts/lint.sh` takes path arguments (it falls back to `--all-files` only when given none), so no batch lints the whole repository:

```bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/roles/kanri.md
```

Expected: every hook passes. A hook that auto-fixes leaves the change unstaged — re-stage and re-run.

4. The spec's own content greps, quoted from its Verification section and written as assertions. `boundary` runs each fenced block verbatim and judges it by its **exit status alone**, so every block below prints its numbers *and* exits non-zero when one is wrong — a bare `grep -c` that prints `0` exits `1`, which would read as a failure where `0` is the answer, and a plain `for` loop's status is only its last iteration's, which is why each loop carries its own `|| exit 1`. From batch E's boundary every one of them holds; before that, the ones naming a file a later batch still rewrites are expected to fail, and each batch's stop condition says which.

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md skills/tanto/templates/bug-report.md; do n=$(grep -c 'triage:' "$f" || true); printf '%s -> %s\n' "$f" "$n"; [ "$n" = 0 ] || exit 1; done
```

Expected: four lines, each `-> 0`.

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md; do a=$(grep -cF 'received: <inbox path>' "$f" || true); b=$(grep -cF 'sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' "$f" || true); printf '%s -> %s %s\n' "$f" "$a" "$b"; [ "$a" = 1 ] && [ "$b" = 1 ] || exit 1; done
```

Expected: three lines, each `-> 1 1`.

```bash
a=$(grep -c '^## ' skills/tanto/templates/shoroku-brief.md || true); b=$(grep -c '^## Recommended fix$' skills/tanto/templates/shoroku-brief.md || true); c=$(grep -cF '`## Recommended fix`' skills/shoroku/SKILL.md || true); d=$(grep -cF "is \`5\`" skills/tanto/roles/kanri.md || true); printf '%s %s %s %s\n' "$a" "$b" "$c" "$d"; [ "$a" = 5 ] && [ "$b" = 1 ] && [ "$c" -ge 1 ] && [ "$d" = 1 ]
```

Expected: `5 1 1 1`.

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md skills/shoroku/SKILL.md; do n=$(grep -cF 'three groups' "$f" || true); printf '%s -> %s\n' "$f" "$n"; [ "$n" = 0 ] || exit 1; done
```

Expected: four lines, each `-> 0`.

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md; do n=$(grep -cF 'fix: text corrections from <topic>' "$f" || true); printf '%s -> %s\n' "$f" "$n"; [ "$n" -ge 1 ] || exit 1; done
```

Expected: two lines, each `-> 1` or more.

```bash
f=skills/tanto/templates/bug-report.md; a=$(grep -c '^## Reported$' "$f" || true); b=$(grep -c '^## Received$' "$f" || true); c=$(grep -c 'Repository —' "$f" || true); d=$(grep -c '^## Reporter$' "$f" || true); printf '%s %s %s %s\n' "$a" "$b" "$c" "$d"; [ "$a" = 1 ] && [ "$b" = 1 ] && [ "$c" = 0 ] && [ "$d" = 0 ]
```

Expected: `1 1 0 0`.

```bash
for f in skills/tanto/roles/kanri.md skills/shoroku/SKILL.md; do n=$(grep -cF 'Source: shoroku <topic> S-<n>' "$f" || true); printf '%s -> %s\n' "$f" "$n"; [ "$n" -ge 1 ] || exit 1; done
```

Expected: two lines, each `-> 1` or more.

```bash
for f in skills/shoroku/SKILL.md skills/tanto/roles/kaiseki.md; do n=$(grep -cF 'Source: session <YYYY-MM-DD>' "$f" || true); printf '%s -> %s\n' "$f" "$n"; [ "$n" = 1 ] || exit 1; done
```

Expected: two lines, each `-> 1`.

```bash
a=$(grep -cF '`sent`' skills/tanto/SKILL.md || true); b=$(grep -cF 'sent/' skills/tanto/roles/kanri.md || true); printf '%s %s\n' "$a" "$b"; [ "$a" -ge 1 ] && [ "$b" -ge 2 ]
```

Expected: `1 2` or more on each — `SKILL.md`'s reserved-names list, and Kanri's Start step 2 and "Reporting from the other side".

```bash
missing=$(grep -L '^Source: ' docs/issues/open/*.md docs/issues/deferred/*.md | wc -l); stray=$(grep -l '^Source: ' docs/issues/resolved/*.md 2>/dev/null | wc -l); printf '%s %s\n' "$missing" "$stray"; [ "$missing" = 0 ] && [ "$stray" = 0 ]
```

Expected: `0 0`.

5. A real YAML load of any frontmatter a batch touched — not a text match, because a hand-edited date that breaks the block is what the grep-only checks miss. Batches A (Tasks 1 and 3) and E (Task 17's new report) need it:

```bash
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py docs/issues/open/*.md docs/issues/deferred/*.md
```

Expected: exit `0`, nothing printed.

6. The hook's own test, on every batch from A onward, unchanged:

```bash
uv run --no-project --with pyyaml python -m unittest discover -s scripts -p 'test_check_md_frontmatter.py'
```

Expected: `OK`.

7. **No JSON is written or edited by any task in this plan**, so no JSON parse check is needed. `templates/tanto.json` is in the Not-touched list.

---

## Tasks

### Task 1: The retrofit — every open and deferred issue opens with its provenance

**Files:**

- Modify: `docs/issues/open/*.md` (219 files), `docs/issues/deferred/*.md` (15 files)
- Modify, untracked and local to this machine: `.tanto/inbox/*.md` (the 21 copies whose Triage was filled under the old text)
- Scratch only, never committed: the one-off script below

**Interfaces:**

- Consumes: nothing from an earlier task; this is the plan's first.
- Produces: the invariant Task 2's hook depends on — every file under `docs/issues/open/` and `docs/issues/deferred/` opens its body with one line matching `Source: inbox <YYYY-MM-DD>-<slug>`, `Source: shoroku <topic>[ S-<n>]`, `Source: hotfix <commit subject>`, or `Source: session <YYYY-MM-DD>`. Also produces the four kind counts Task 17 records.

Spec section 8.2. This task runs **before** Task 2 so that the hook never sees an unlabelled file.

**Named mechanisms this task touches.** The **`Source:` line and its four kinds**: named again in `scripts/check_md_frontmatter.py`'s `SOURCE_RE` and `SOURCE_HINT` (Task 2), in `skills/shoroku/SKILL.md`'s Step 3 and apply mode (Task 4), in `roles/kanri.md`'s Shoroku step 4 (Task 5) and its hotfix lane (Task 14), and in `roles/kaiseki.md`'s standalone clause (Task 15). The retrofit writes no ` S-<n>`, and the hook's pattern makes it optional for exactly that reason — a **new** write of the `shoroku` kind always carries the row. The **six Triage outcome words** (`issue`, `fix`, `redirect`, `kaiseki`, `relay`, `dismissed`), which the inbox normalization below writes: named again in `templates/bug-report.md` (Task 12), `roles/kanri.md` Shoroku step 2 and "Bug intake" (Tasks 5, 14), `roles/hosa.md`'s `close:` paragraph (Task 6), and `skills/shoroku/SKILL.md`'s apply mode (Task 4).

**Old values this task must clear** — none. This task writes no passage into a file the plan's `O` sweep covers; what it must hold is an **absence**, stated as an anchor. `resolved/` is not touched (spec fixed input 7), and a hit there after this task means the script's glob was widened. Under `docs/issues/open/` and `docs/issues/deferred/` the count goes from 0 to 234, which is this task's whole point and is checked by Step 3 rather than by a needle.

This task declares no `A` block either: `replay` applies passages to copies of the blobs the plan's blocks name, and no block names a file under `docs/issues/`, so an anchor over that tree would be vacuous there and would only create something that can drift. The absence under `resolved/` and the presence under `open/` and `deferred/` are both checked in Step 3, against the working tree, which is where they are true.

- [ ] **Step 1: Write the one-off script to the scratch directory**

Write this file to `C:\Temp\claude\bug-report-hold-retrofit.py` — outside the repository, so it is never staged and never linted. It takes the repository root as its one argument.

```python
#!/usr/bin/env python3
"""One-off: open every open and deferred issue with a Source: line.

Run once, from anywhere, with the repository root as argv[1], BEFORE the
frontmatter hook gains its Source: check. Never committed.
"""

from __future__ import annotations

import re
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
TODAY = date.today().isoformat()
PREFIXES = (
    "docs: T0 shoroku for ",
    "docs: T1 shoroku for ",
    "docs: T2 shoroku for ",
    "docs: exit shoroku",
)
OUTCOMES = ("issue", "fix", "redirect", "kaiseki", "relay", "dismissed")
# A bare four-hex id, never a pure-decimal token: a year or a time on the
# Reference line would otherwise read as an issue id.
BARE_ID_RE = re.compile(r"\b(?![0-9]{4}\b)([0-9a-f]{4})\b")
TOKEN_ID_RE = re.compile(r"issue-([0-9a-f]{4})")
PATH_ID_RE = re.compile(r"docs/issues/\w+/([0-9a-f]{4})-")
OUTCOME_RE = re.compile(r"^- Outcome — (.*)$")


def read(path: Path) -> tuple[str, str]:
    raw = path.read_text(encoding="utf-8")
    return raw, "\r\n" if "\r\n" in raw else "\n"


def topic_words() -> list[str]:
    names = set()
    for plan in sorted((ROOT / "docs/superpowers/plans").glob("*.md")):
        names.add(re.sub(r"^\d{4}-\d{2}-\d{2}-", "", plan.stem))
    # Longest first, so `tanto-cost` wins over `tanto` and `tanto-sweep-2`
    # over `tanto-sweep` (spec Measured 3).
    return sorted(names, key=len, reverse=True)


def triage_lines(copy: Path) -> list[str]:
    raw, _ = read(copy)
    out: list[str] = []
    inside = False
    for line in raw.replace("\r\n", "\n").split("\n"):
        if line.startswith("## "):
            inside = line.strip() == "## Triage"
            continue
        if inside and (line.startswith("- Outcome") or line.startswith("- Reference")):
            out.append(line)
    return out


def inbox_index() -> dict[str, str]:
    """issue id -> the basename (without .md) of the oldest copy naming it."""
    index: dict[str, str] = {}
    inbox = ROOT / ".tanto/inbox"
    if not inbox.is_dir():
        return index
    for copy in sorted(inbox.glob("*.md")):  # dated names sort oldest first
        text = "\n".join(triage_lines(copy))
        found = set(TOKEN_ID_RE.findall(text))
        found |= set(PATH_ID_RE.findall(text))
        found |= set(BARE_ID_RE.findall(text))
        for issue_id in found:
            index.setdefault(issue_id, copy.stem)
    return index


def first_commit_subject(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    result = subprocess.run(
        ["git", "-C", str(ROOT), "log", "--follow", "--diff-filter=A",
         "--format=%s", "--", rel],
        capture_output=True, text=True, encoding="utf-8",
    )
    subjects = [s for s in result.stdout.strip().split("\n") if s.strip()]
    return subjects[-1].strip() if subjects else ""


def frontmatter_value(path: Path, key: str) -> str:
    raw, _ = read(path)
    lines = raw.replace("\r\n", "\n").split("\n")
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if line.startswith(f"{key}:"):
            return line.split(":", 1)[1].strip().strip('"').strip("'")
    return TODAY


def source_line(path: Path, index: dict[str, str], topics: list[str]) -> str:
    issue_id = path.name.split("-", 1)[0]
    if issue_id in index:
        return f"Source: inbox {index[issue_id]}"
    subject = first_commit_subject(path)
    if subject.startswith(PREFIXES):
        for topic in topics:
            if re.search(rf"(?<![0-9a-z-]){re.escape(topic)}(?![0-9a-z-])", subject):
                return f"Source: shoroku {topic}"
    return f"Source: session {frontmatter_value(path, 'created')}"


def rewrite(path: Path, line: str) -> None:
    raw, nl = read(path)
    lines = raw.replace("\r\n", "\n").split("\n")
    end = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
    head = lines[: end + 1]
    for i, head_line in enumerate(head):
        if head_line.startswith("updated:"):
            head[i] = f"updated: {TODAY}"
    body = lines[end + 1 :]
    while body and not body[0].strip():
        body.pop(0)
    path.write_text(nl.join(head + ["", line, ""] + body), encoding="utf-8", newline="")


def normalize_inbox() -> int:
    """The 21 copies filled under the old text, so that 1.1's definition holds."""
    changed = 0
    inbox = ROOT / ".tanto/inbox"
    if not inbox.is_dir():
        return 0
    for copy in sorted(inbox.glob("*.md")):
        raw, nl = read(copy)
        lines = raw.replace("\r\n", "\n").split("\n")
        out = list(lines)
        inside = False
        touched = False
        for i, line in enumerate(lines):
            if line.startswith("## "):
                inside = line.strip() == "## Triage"
                continue
            if not inside:
                continue
            match = OUTCOME_RE.match(line)
            if not match:
                continue
            value = match.group(1).strip()
            if value in OUTCOMES:
                continue
            if value.startswith("hotfix"):
                out[i] = "- Outcome — fix"
                touched = True
            elif value.startswith("issue") or "issue-" in value:
                out[i] = "- Outcome — issue"
                touched = True
                ids = TOKEN_ID_RE.findall(value)
                for j in range(i + 1, min(i + 4, len(out))):
                    if out[j].startswith("- Reference"):
                        if ids and f"issue-{ids[0]}" not in out[j]:
                            out[j] = out[j].rstrip() + f"; issue-{ids[0]}"
                        break
        if touched:
            copy.write_text(nl.join(out), encoding="utf-8", newline="")
            changed += 1
    return changed


def main() -> int:
    index = inbox_index()
    topics = topic_words()
    counts = {"inbox": 0, "shoroku": 0, "hotfix": 0, "session": 0}
    for folder in ("open", "deferred"):
        for path in sorted((ROOT / "docs/issues" / folder).glob("*.md")):
            line = source_line(path, index, topics)
            counts[line.split()[1]] += 1
            rewrite(path, line)
    for kind in ("inbox", "shoroku", "hotfix", "session"):
        print(f"{kind}: {counts[kind]}")
    print(f"inbox copies normalized: {normalize_inbox()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Run it**

```bash
uv run --no-project python /c/Temp/claude/bug-report-hold-retrofit.py "$(pwd)"
```

Expected: four `<kind>: <n>` lines and one `inbox copies normalized: <n>` line. `inbox` is about `15` (spec Measured 1 — the answers file's `22` counted `resolved/` too), `hotfix` is `0` (no issue on disk was filed from the lane with a recorded commit subject the script can read), `shoroku` is the bulk, and `session` the rest. `inbox copies normalized` is about `10` — the copies whose Outcome was `hotfix`, `issue-<id>…`, or `appended to existing issue-<id>…`. **Record all five numbers**: Task 17 puts the four kind counts in the dogfood report.

- [ ] **Step 3: Done when — every file carries the line, and `resolved/` carries none**

```bash
grep -L '^Source: ' docs/issues/open/*.md docs/issues/deferred/*.md
```

Expected: nothing printed.

```bash
grep -l '^Source: ' docs/issues/resolved/*.md | wc -l
```

Expected: `0`.

- [ ] **Step 4: Spot-check three files by eye**

Open one file of each of the three kinds the run produced and confirm the shape: closing `---`, one blank line, the `Source:` line, one blank line, then the body as it was; and `updated:` restamped to today in the frontmatter. A file whose body was eaten or whose frontmatter lost a key is a script defect — fix the script and re-run from a clean `git checkout -- docs/issues/`, which is permitted here because the modification is your own.

- [ ] **Step 5: Confirm the frontmatter still loads**

```bash
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py docs/issues/open/*.md docs/issues/deferred/*.md
```

Expected: exit `0`, nothing printed. The hook does not yet know about `Source:` — that is Task 2 — so this run tests only that 234 restamps left every frontmatter block a valid YAML mapping.

- [ ] **Step 6: Lint the changed paths**

`scripts/lint.sh` classifies a bare directory argument as type `directory`, which every hook reports as `(no files to check) Skipped` — glob the files instead:

```bash
./scripts/lint.sh docs/issues/open/*.md docs/issues/deferred/*.md
```

Expected: every hook passes (not skipped). A hook that auto-fixes leaves the change unstaged — re-stage and re-run.

- [ ] **Step 7: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 1`

Expected: `task 1: no passages` — this task declares no `P` block (Step 3 above already explains why: an anchor over `docs/issues/` would be vacuous, and `verify` does not check `O` needles), so `verify` has nothing to check here. Step 4's grep and Step 5's real YAML load are what actually verify this task's work.

- [ ] **Step 8: Commit**

```bash
git commit --only docs/issues/open docs/issues/deferred
```

Subject: `docs(issues): open every open and deferred issue with a Source: line`. End the message with your own `Co-Authored-By:` trailer. The inbox normalization rides in no commit — `.tanto/` is untracked.

### Task 2: The `Source:` check in the frontmatter hook, with its test

**Files:**

- Modify: `scripts/check_md_frontmatter.py` (L7-8, L13-14, after L19, L54-56)
- Create: `scripts/test_check_md_frontmatter.py`

**Interfaces:**

- Consumes: Task 1's invariant — every file under `docs/issues/open/` and `docs/issues/deferred/` already opens its body with a `Source:` line. Running this task first would make the next commit of any issue impossible.
- Produces: `SOURCE_RE`, `SOURCE_HINT`, and `_is_checked_issue(path: Path) -> bool` at module level in `scripts/check_md_frontmatter.py`; `check(path: Path) -> tuple[list[str], bool]` keeps its signature and return shape.

Spec section 8.1. `.pre-commit-config.yaml` does not change: the hook already runs on every Markdown file (`types: [markdown]`), so the issues check is a path test inside the script.

**Named mechanisms this task touches.** The **`Source:` line and its four kinds**: the pattern here is the one authority for the *form*; the prose that states the same closed set lives in `skills/shoroku/SKILL.md` Step 3 and apply mode (Task 4), `roles/kanri.md` Shoroku step 4 and the hotfix lane (Tasks 5, 14), `roles/kaiseki.md` (Task 15), and the spec's own 1.3. The optional ` S-<n>` exists for Task 1's retrofit alone — every prose site says a **new** `shoroku` write always carries the row.

**Old values this task must clear** — count run against the live tree:

**O2.1** `are not done here.` — `scripts/check_md_frontmatter.py` 1, the docstring's last sentence; nowhere else in the tree this plan touches. Must be 0 after P2.1, which turns the full stop into `, with one exception:`.

**A2.1** `scripts/check_md_frontmatter.py` — `grep -c '_is_checked_issue' scripts/check_md_frontmatter.py` — before: 0, after: 2

- [ ] **Step 1: Write the failing test**

**W2.1** `scripts/test_check_md_frontmatter.py` — new file, 73 lines

```python
"""Tests for check_md_frontmatter's Source: line check (spec 8.1)."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from check_md_frontmatter import HINT, SOURCE_HINT, check

FRONTMATTER = '---\nid: "abcd"\ntitle: "a defect"\ncreated: 2026-09-19\nupdated: 2026-09-19\n---\n'


class SourceLineTest(unittest.TestCase):
    def setUp(self) -> None:
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)

    def write(self, relative: str, body: str) -> Path:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(FRONTMATTER + body, encoding="utf-8")
        return path

    def test_each_kind_passes(self) -> None:
        for line in (
            "Source: inbox 2026-09-19-a-report-slug",
            "Source: shoroku tanto-cost S-4",
            "Source: hotfix docs(tanto): name the symptom",
            "Source: session 2026-09-19",
        ):
            with self.subTest(line=line):
                path = self.write("docs/issues/open/abcd-x.md", f"\n{line}\n\nnarrative\n")
                self.assertEqual(check(path), ([], False))

    def test_shoroku_without_a_row_passes(self) -> None:
        path = self.write(
            "docs/issues/open/abcd-x.md", "\nSource: shoroku tanto-sweep-2\n\nnarrative\n"
        )
        self.assertEqual(check(path), ([], False))

    def test_open_without_a_source_fails_with_the_hint(self) -> None:
        path = self.write("docs/issues/open/abcd-x.md", "\nnarrative, not a Source line\n")
        problems, parse_error = check(path)
        self.assertFalse(parse_error)
        self.assertEqual(len(problems), 1)
        self.assertIn(SOURCE_HINT, problems[0])

    def test_deferred_without_a_source_fails(self) -> None:
        path = self.write("docs/issues/deferred/abcd-x.md", "\nnarrative, not a Source line\n")
        problems, _ = check(path)
        self.assertEqual(len(problems), 1)

    def test_the_same_file_under_resolved_passes(self) -> None:
        path = self.write("docs/issues/resolved/abcd-x.md", "\nnarrative, not a Source line\n")
        self.assertEqual(check(path), ([], False))

    def test_a_non_issue_markdown_file_passes_untouched(self) -> None:
        path = self.write("docs/notes/abcd-x.md", "\nnarrative, not a Source line\n")
        self.assertEqual(check(path), ([], False))

    def test_both_hints_are_ascii(self) -> None:
        # pre-commit's Python prints to a cp932 stdout on this host; a
        # non-ASCII character there raises UnicodeEncodeError in place of
        # the message (the spec review reproduced it).
        for hint in (HINT, SOURCE_HINT):
            with self.subTest(hint=hint):
                hint.encode("ascii")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
uv run --no-project --with pyyaml python -m unittest discover -s scripts -p 'test_check_md_frontmatter.py'
```

Expected: `ImportError: cannot import name 'SOURCE_HINT' from 'check_md_frontmatter'`.

- [ ] **Step 3: Apply the four passages**

**P2.1** `scripts/check_md_frontmatter.py` — replace exactly these 2 lines

```text
file passes untouched. Per-kind schema checks (required keys, name formats)
are not done here.
```

**P2.1 →**

```text
file passes untouched. Per-kind schema checks (required keys, name formats)
are not done here, with one exception: an issue under docs/issues/open/ or
docs/issues/deferred/ must open its body with a Source: line.
```

**P2.2** `scripts/check_md_frontmatter.py` — replace exactly these 2 lines

```text
import sys
from pathlib import Path
```

**P2.2 →**

```text
import re
import sys
from pathlib import Path
```

**P2.3** `scripts/check_md_frontmatter.py` — insert after these 2 lines

```text
DELIMITER = "---"
HINT = "hint: a value containing a colon followed by a space must be quoted (description: 'Use when: x')"
```

**P2.3 →**

```text


SOURCE_RE = re.compile(
    r"^Source: (?:"
    r"inbox \d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*"
    r"|shoroku [a-z0-9]+(?:-[a-z0-9]+)*(?: S-\d+)?"
    r"|hotfix \S.*"
    r"|session \d{4}-\d{2}-\d{2}"
    r")$"
)
SOURCE_HINT = (
    "an issue's body must open with a Source: line: inbox <YYYY-MM-DD>-<slug>, "
    "shoroku <topic>[ S-<n>], hotfix <commit subject>, or session <YYYY-MM-DD>"
)


def _is_checked_issue(path: Path) -> bool:
    posix = "/" + path.as_posix()
    return "/docs/issues/open/" in posix or "/docs/issues/deferred/" in posix
```

**P2.4** `scripts/check_md_frontmatter.py` — replace exactly these 3 lines

```text
    if not isinstance(data, dict):
        return [f"{path}:1: frontmatter must be a YAML mapping (got {_yaml_type(data)})"], False
    return [], False
```

**P2.4 →**

```text
    if not isinstance(data, dict):
        return [f"{path}:1: frontmatter must be a YAML mapping (got {_yaml_type(data)})"], False
    if not _is_checked_issue(path):
        return [], False
    body_index = next((i for i in range(end + 1, len(lines)) if lines[i].strip()), None)
    if body_index is None or not SOURCE_RE.match(lines[body_index].rstrip()):
        line = body_index + 1 if body_index is not None else end + 1
        return [f"{path}:{line}: {SOURCE_HINT}"], False
    return [], False
```

A file under `open/` or `deferred/` with no frontmatter is not an issue the docs rules allow, and the existing early return (`lines[0].rstrip() != DELIMITER`) leaves it alone as before: the check binds only files that open with `---`, which every issue does.

- [ ] **Step 4: Run the test to make sure it passes**

```bash
uv run --no-project --with pyyaml python -m unittest discover -s scripts -p 'test_check_md_frontmatter.py'
```

Expected: `OK`, 7 tests.

- [ ] **Step 5: Run the hook over the real tree**

```bash
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py docs/issues/open/*.md docs/issues/deferred/*.md
```

Expected: exit `0`, nothing printed — Task 1's retrofit is what makes this true.

```bash
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py docs/issues/resolved/*.md
```

Expected: exit `0`, nothing printed — `resolved/` is unchecked.

- [ ] **Step 6: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 2`

Expected: `task 2: verify clean`.

- [ ] **Step 7: Lint the changed paths**

```bash
./scripts/lint.sh scripts/check_md_frontmatter.py scripts/test_check_md_frontmatter.py
```

Expected: every hook passes.

- [ ] **Step 8: Commit**

```bash
git add scripts/test_check_md_frontmatter.py
git commit --only scripts/check_md_frontmatter.py scripts/test_check_md_frontmatter.py
```

Subject: `feat(scripts): an issue under open or deferred must open its body with a Source: line`. `--only` cannot pick up an untracked file, which is why the `git add` comes first. End the message with your own `Co-Authored-By:` trailer.

### Task 3: issue-c3a9, narrowed

**Files:**

- Modify: `docs/issues/open/c3a9-a-between-plans-intake-commit-can-land-on-a-concurrent-topics-freshly-cut-branch.md` (frontmatter `title:` and `updated:`, and a paragraph appended at the end)

**Interfaces:**

- Consumes: Task 1's retrofit, which already gave this file its own `Source:` line. Do not add a second one.
- Produces: nothing a later task reads.

Spec section 8.4 and fixed input 10. The issue is **narrowed, not closed**: the intake-commit trigger is gone, and gap 1 — Kanri's own check — is written into the hotfix lane by Task 14. Gap 2 stays open. The filename is not changed: renaming it would move the id's path for no gain.

**Named mechanisms this task touches.** The **landing-branch check** the appended paragraph points at: its one other site is `roles/kanri.md`'s hotfix lane, "Where the commit lands" (Task 14), which this paragraph names by heading. If Task 14's text is reworded, this paragraph's pointer must follow.

**Old values this task must clear** — count run against the live tree:

**O3.1** `a between-plans intake commit can land` — `docs/issues/open/c3a9-…md` 1, the `title:` value; the same words are in the filename, which this plan does not change, and in no other tracked file. Must be 0 after P3.1.

- [ ] **Step 1: Apply the two passages**

**P3.1** `docs/issues/open/c3a9-a-between-plans-intake-commit-can-land-on-a-concurrent-topics-freshly-cut-branch.md` — replace exactly these 2 lines

```text
title: "a between-plans intake commit can land on a concurrent topic's freshly cut branch instead of `main`"
severity: low
```

**P3.1 →**

```text
title: "a between-plans hotfix or filing can land on a concurrent topic's freshly cut branch instead of main"
severity: low
```

**P3.2** `docs/issues/open/c3a9-a-between-plans-intake-commit-can-land-on-a-concurrent-topics-freshly-cut-branch.md` — replace exactly these 3 lines

```text
2026-09-15: rewriting `tanto-sweep-2`'s branch history to relocate the
misplaced issue-a4c7 commit was considered and rejected — the misplacement is
harmless, and a rewrite costs more in disruption than it removes.
```

**P3.2 →**

```text
2026-09-15: rewriting `tanto-sweep-2`'s branch history to relocate the
misplaced issue-a4c7 commit was considered and rejected — the misplacement is
harmless, and a rewrite costs more in disruption than it removes.

2026-09-19, `bug-report-hold`: the intake commit that triggered this no
longer exists — a report received is copied to the inbox, not filed — and
gap 1, Kanri's own check, is written into the hotfix lane ("Where the commit
lands", `roles/kanri.md`). What remains open is gap 2: nothing tells a
Sekkei or Keikaku about to cut a topic branch that a human-ordered
between-plans commit may be about to land on the shared checkout.
```

- [ ] **Step 2: Restamp `updated:` by hand**

Task 1's script already set this file's `updated:` to the day **it** ran. If that is not the day **this** task runs, edit the one frontmatter line so it reads today's date. This is not a passage: Task 1's script owns that key, and a passage quoting either date would contradict the other run.

```bash
grep -n '^updated:' docs/issues/open/c3a9-a-between-plans-intake-commit-can-land-on-a-concurrent-topics-freshly-cut-branch.md
```

Expected: one line, its value today's date.

- [ ] **Step 3: Load the frontmatter for real**

```bash
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py docs/issues/open/c3a9-a-between-plans-intake-commit-can-land-on-a-concurrent-topics-freshly-cut-branch.md
```

Expected: exit `0`, nothing printed. This both parses the YAML and re-runs Task 2's `Source:` check on the edited file.

- [ ] **Step 4: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 3`

Expected: `task 3: verify clean`.

- [ ] **Step 5: Lint the changed path**

```bash
./scripts/lint.sh docs/issues/open/c3a9-a-between-plans-intake-commit-can-land-on-a-concurrent-topics-freshly-cut-branch.md
```

Expected: every hook passes.

- [ ] **Step 6: Commit**

```bash
git commit --only docs/issues/open/c3a9-a-between-plans-intake-commit-can-land-on-a-concurrent-topics-freshly-cut-branch.md
```

Subject: `docs(issues): narrow issue-c3a9 to the branch-cutter's side`. End the message with your own `Co-Authored-By:` trailer.

### Task 4: The `Recommended fix` group in the `shoroku` skill, its README, and the brief template

**Files:**

- Modify: `skills/shoroku/SKILL.md` (after L57, L98-105, L110-114, L128, L133-140, L167-169)
- Modify: `skills/shoroku/README.md` (L22)
- Modify: `skills/tanto/templates/shoroku-brief.md` (L9, L22, L26-28, after L41)

**Interfaces:**

- Consumes: Task 2's `Source:` form, which this file's prose names in words.
- Produces, for Tasks 5, 6 and 7 to dispatch against: recommend mode writes **four** `##` item groups — `## Recommended adopt`, `## Recommended fix`, `## Recommended reject`, `## Unsure` — and every `###` item heading ends with the pointer the dispatch gave, `(<topic> S-<n>)` or `(inbox <YYYY-MM-DD>-<slug>)`. Apply mode takes, beyond its three existing arguments, the inbox copies to fill by path and a fix subject, and makes a **second** commit for the accepted `Recommended fix` items. The brief has **five** `##` headings and the tag alternatives `[adopt | fix | reject | unsure]`.

Spec sections 6.1 to 6.5 and 7.2.

**Named mechanisms this task touches.** The **`Recommended fix` group**: named again in `roles/kanri.md` Shoroku steps 2 and 3 (Task 5), `roles/hosa.md`'s `close:` paragraph (Task 6), `skills/tanto/SKILL.md`'s Session exit steps 2 and 3 and its Artifacts table (Task 7), and `docs/notes/tanto-consistency-checks.md` checks 18 and 19 (Task 16). The **five `##` headings** of the brief: the same count is stated in all four of those files — this is spec Measured 5, which is why they are one batch. The **`Source:` line**: Task 1, Task 2, Task 5, Task 14, Task 15. The **six Triage outcome words**: Task 1, Task 5, Task 6, Task 12, Task 14. The **`fix: text corrections from <topic>'s close` subject**: `roles/kanri.md` (Task 5), `roles/hosa.md` (Task 6), `skills/tanto/SKILL.md` (Task 7) — here the subject is named only as "the fix subject the dispatch gave", so this file must never spell it.

**Old values this task must clear** — counts run against the live tree:

**O4.1** `numbered items grouped under three` — `skills/shoroku/SKILL.md` 1. Must be 0 after P4.2.

**O4.2** `a low-severity gap whose repair is` — `skills/shoroku/SKILL.md` 1. Must be 0 after P4.2. The near-twin in `roles/kanri.md` is worded differently and is O5.1's, not this one's — the same rule in two role files needs both spellings.

**O4.3** `each heading naming which source it came from` — `skills/shoroku/SKILL.md` 1. Must be 0 after P4.3.

**O4.4** `the same three headings` — `skills/shoroku/SKILL.md` 1, the brief-writing paragraph. Must be 0 after P4.4.

**O4.5** `, lint the changed paths by name, make` — `skills/shoroku/SKILL.md` 1, apply mode's one-commit sentence; the needle opens with the comma so that it spans the point where the `Source:` clause is inserted before it. Must be 0 after P4.5.

**O4.6** `except the recommendation file a caller` — `skills/shoroku/SKILL.md` 1. Must be 0 after P4.6.

**O4.7** `marked adopt, reject, or unsure` — `skills/shoroku/README.md` 1. Must be 0 after P4.7.

**O4.8** `stay exactly as they are here: the four` — `skills/tanto/templates/shoroku-brief.md` 1. Must be 0 after P4.8.

**O4.9** `[adopt | reject | unsure]` — 2 in the tree this plan touches: `skills/tanto/templates/shoroku-brief.md` 1 (P4.9 clears it) and `docs/notes/tanto-consistency-checks.md` 1, check 19's pinned needle, which Task 16 clears. Must be 1 after this task and 0 after Task 16.

**O4.10** `the four headings are always` — `skills/tanto/templates/shoroku-brief.md` 1. Must be 0 after P4.10. The shorter `the four headings` is O7.2's, whose last site this task also clears.

**A4.1** `skills/shoroku/SKILL.md` — `grep -cF 'Source: session <YYYY-MM-DD>' skills/shoroku/SKILL.md` — before: 0, after: 1

**A4.2** `skills/tanto/templates/shoroku-brief.md` — `grep -c '^## Recommended fix$' skills/tanto/templates/shoroku-brief.md` — before: 0, after: 1

- [ ] **Step 1: Apply the six `skills/shoroku/SKILL.md` passages**

**P4.1** `skills/shoroku/SKILL.md` — insert after these 3 lines

```text
Classification follows the two splits the type files define — design vs
decisions, requirements vs issues — and the proposal carries the requirement
pairing `docs/AGENTS.md`'s Propose step defines; neither is restated here.
```

**P4.1 →**

```text

An issue written in session, memory, or file mode opens its body with one
line, `Source: session <YYYY-MM-DD>`, the day of the run — the first
non-empty line after the frontmatter, before the narrative. In recommend and
apply mode the pointer rides in the item's heading, from the source the
caller's dispatch named, and the apply writes what the heading carries.
```

**P4.2** `skills/shoroku/SKILL.md` — replace exactly these 8 lines

```text
numbered items grouped under three `##` headings, in this exact
text — `## Recommended adopt`, `## Recommended reject`, `## Unsure` —
each item quoted in full from its source so that the
file stands alone as the apply's input. An `issue` destination is
recommended only when the item is medium severity or above, needs a
decision, or records a measured defect; a low-severity gap whose repair is
a single sentence is grouped `Recommended reject`, with the correction
written out in the reason. A line in a source proposal that
```

**P4.2 →**

```text
numbered items grouped under four `##` headings, in this exact
text — `## Recommended adopt`, `## Recommended fix`, `## Recommended reject`,
`## Unsure` —
each item quoted in full from its source so that the
file stands alone as the apply's input. An `issue` destination is
recommended only when the item is medium severity or above, needs a
decision, or records a measured defect; a low-severity gap or drift in the
skill's own prose whose whole repair is one sentence, or a few adjacent ones
in one file, and needs no decision is grouped `Recommended fix`, its body
carrying `File: <path>`, the text as it reads in an `Old:` fence, the text
as it should read in a `New:` fence, and the one-line reason — an item the
apply can act on without judgment; a fix the caller's dispatch does not
allow — a file outside the paths it names — is grouped `Recommended reject`
with the correction in the reason. A line in a source proposal that
```

**P4.3** `skills/shoroku/SKILL.md` — replace exactly these 5 lines

```text
whole recommendation, assigned in the order the dispatch names its
sources — unique across the whole file, never restarted per group nor per
source proposal — and each heading naming which source it came from; where
the source is not a numbered proposal, as for a spec's sections, a running
number in the order the items are written — so that a reader can point at
```

**P4.3 →**

```text
whole recommendation, assigned in the order the dispatch names its
sources — unique across the whole file, never restarted per group nor per
source proposal — and each heading ending with the pointer the dispatch
gave for its source, in parentheses — `(<topic> S-<n>)` for a ledger row,
`(inbox <YYYY-MM-DD>-<slug>)` for an inbox copy, or the dispatch's own
words for another source — so that the apply writes the issue's `Source:`
line from the heading alone; where
the source is not a numbered proposal, as for a spec's sections, a running
number in the order the items are written — so that a reader can point at
```

**P4.4** `skills/shoroku/SKILL.md` — replace exactly these 1 lines

```text
the same three headings, each ending in `See:` and the item's heading text,
```

**P4.4 →**

```text
the same four headings, each ending in `See:` and the item's heading text,
```

The brief has five `##` headings and four of them are item groups; this sentence counts the groups, not the headings, which is why it reads `four` and the template's own preamble reads `five`.

**P4.5** `skills/shoroku/SKILL.md` — replace exactly these 8 lines

```text
**Apply mode.** Invoked with a recommendation path, a direction path, and a
commit subject. The recommendation quotes every item in full, so no third
file is read: where the candidates were sections of the source document, the
recommendation is the only proposal there is. Apply the accepted subset per
the per-type `AGENTS.md`, lint the changed paths by name, make **one** commit
by explicit path with the subject you were given, and report the paths and
the subject. Write nothing the direction did not accept, and never run
without a direction file.
```

**P4.5 →**

```text
**Apply mode.** Invoked with a recommendation path, a direction path, and a
commit subject. The recommendation quotes every item in full, so no third
file is read: where the candidates were sections of the source document, the
recommendation is the only proposal there is. Apply the accepted subset per
the per-type `AGENTS.md` — an issue opening with the `Source:` line its
item's heading carries, `Source: shoroku <topic> S-<n>` or `Source: inbox
<YYYY-MM-DD>-<slug>`, and naming nothing else of where a report came from —
lint the changed paths by name, make **one** commit
by explicit path with the subject you were given, and report the paths and
the subject. Then two things outside `docs/`, when the dispatch asks for
them. For every inbox copy the dispatch named, fill its `## Triage` section
— Outcome, one of `issue`, `fix`, `redirect`, `kaiseki`, `relay`,
`dismissed`, as the direction settled it; Reference, the issue id, the
fix's commit subject, the redirect or dismissal in one line, the `kaiseki`
line, or the relay's topic; Date — an untracked write that rides in no
commit. For every accepted `Recommended fix` item, replace its `Old:` text
with its `New:` text exactly once in the file it names, lint those paths,
review the sibling `README.md` for drift when a `SKILL.md` changed, make a
**second** commit by explicit path with the fix subject the dispatch gave,
and report it; an `Old:` text found zero or several times is reported as
`fix skipped: <n> — <why>` and the file is left as it was. Write nothing the
direction did not accept, and never run
without a direction file.
```

**P4.6** `skills/shoroku/SKILL.md` — replace exactly these 3 lines

```text
- Do NOT write outside `docs/` — except the recommendation file a caller
  names in recommend mode. `shoroku` no longer installs or edits
  `AGENTS.md`; setting up the system is `kisou`'s job.
```

**P4.6 →**

```text
- Do NOT write outside `docs/` — except the recommendation and brief files
  a caller names in recommend mode, and in apply mode the inbox copies'
  Triage sections and the `Recommended fix` files the dispatch names.
  `shoroku` no longer installs or edits
  `AGENTS.md`; setting up the system is `kisou`'s job.
```

- [ ] **Step 2: Apply the README passage**

**P4.7** `skills/shoroku/README.md` — replace exactly these 1 lines

```text
  heading and marked adopt, reject, or unsure, to a path the caller names —
```

**P4.7 →**

```text
  heading and marked adopt, fix, reject, or unsure, to a path the caller names —
```

This is the sibling-README drift review AGENTS.md asks for after a `SKILL.md` edit, done in the same task rather than left to a later one.

- [ ] **Step 3: Apply the four brief-template passages**

**P4.8** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 1 lines

```text
the exception and stay exactly as they are here: the four `##` headings, the
```

**P4.8 →**

```text
the exception and stay exactly as they are here: the five `##` headings, the
```

**P4.9** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 1 lines

```text
    <n>. [adopt | reject | unsure] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

**P4.9 →**

```text
    <n>. [adopt | fix | reject | unsure] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

**P4.10** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 3 lines

```text
after exactly one `See:`. A group with no item keeps its heading and carries
the single rendered line `none`, so that the four headings are always
present.
```

**P4.10 →**

```text
after exactly one `See:`. A group with no item keeps its heading and carries
the single rendered line `none`, so that the five headings are always
present. A `fix` line's second part is the text as it should read, so that
the human sees the sentence that will be applied.
```

**P4.11** `skills/tanto/templates/shoroku-brief.md` — insert after these 1 lines

```text
<n>. [adopt] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

**P4.11 →**

```text

## Recommended fix

<n>. [fix] <the file> — <the text as it should read> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

The anchor is the adopt group's own rendered line, which is unique in the file; the new group lands between it and `## Recommended reject`, where spec 7.2 puts it.

- [ ] **Step 4: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 4`

Expected: `task 4: verify clean`.

- [ ] **Step 5: Check the template's heading count**

```bash
grep -c '^## ' skills/tanto/templates/shoroku-brief.md; grep -c '^## Recommended fix$' skills/tanto/templates/shoroku-brief.md
```

Expected: `5` then `1`.

- [ ] **Step 6: Lint the changed paths**

```bash
./scripts/lint.sh skills/shoroku/SKILL.md skills/shoroku/README.md skills/tanto/templates/shoroku-brief.md
```

Expected: every hook passes. `skills/tanto/templates/**` is in `.markdownlint-cli2.yaml`'s `ignores`, so only the frontmatter and whitespace hooks reach the template.

- [ ] **Step 7: Commit**

```bash
git commit --only skills/shoroku/SKILL.md skills/shoroku/README.md skills/tanto/templates/shoroku-brief.md
```

Subject: `docs(shoroku): a fourth group whose items the apply puts into the text`. End the message with your own `Co-Authored-By:` trailer.

### Task 5: `roles/kanri.md` — the close reads the inbox, and the between-plans sweep

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L932-950, L952-955, L977-987, L992-994, L999-1001, L1044-1050)

**Interfaces:**

- Consumes: Task 4's recommend and apply modes — the four groups, the pointer in the item heading, the inbox copies and fix subject as dispatch arguments, the second commit.
- Produces: the `sweep:` line, byte-identical here and in `roles/hosa.md` (Task 6) and `skills/tanto/SKILL.md` (Task 7): `sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`. Also the two commit subjects `docs: T2 shoroku for <topic>` (unchanged) and `fix: text corrections from <topic>'s close` (new), and the between-plans pair `docs: inbox sweep <YYYY-MM-DD>` / `fix: text corrections from the inbox sweep <YYYY-MM-DD>`.

Spec sections 3.4 and 3.5.

**Named mechanisms this task touches.** The **`sweep:` line**: `roles/hosa.md`'s "The inbox sweep's" paragraph and its Lifecycle sentences (Task 6), `skills/tanto/SKILL.md`'s Session exit Hosa paragraph (Task 7), `roles/kanri.md`'s own Handover trigger (Task 9) and "Bug intake" (Task 14), and the consistency note's replaced check (Task 16) — the string is pinned per copy, so a reviewer counts all three files together. The **`Recommended fix` group** and the **five `##` headings**: Task 4, Task 6, Task 7, Task 16. The **`fix: text corrections from <topic>'s close` subject**: `roles/hosa.md` (Task 6) and `skills/tanto/SKILL.md`'s "The files" (Task 7), which also names the two excluded prefixes for the whole-branch review. The **six Triage outcome words**: Tasks 1, 4, 6, 12, 14. The **`Source:` line**: Tasks 1, 2, 4, 14, 15. The `### The four steps` heading is **not** renamed — the new 3.5 text points at it by name, and step 4 keeps its number so that "slot (a)" still resolves.

**Old values this task must clear** — counts run against the live tree:

**O5.1** `low-severity gap in the skill's own prose whose repair is one sentence` — `skills/tanto/roles/kanri.md` 1, the recommender's bar as R-6's hotfix left it. Must be 0 after P5.1. Its twin spelling in `skills/shoroku/SKILL.md` is O4.2's.

**O5.2** `in three groups` — 3 in the tree this plan touches: `skills/tanto/roles/kanri.md` 1 (P5.1 clears it) and `skills/tanto/SKILL.md` 2, its Session exit step 2 and its Artifacts row, which Task 7 clears. Must be 2 after this task and 0 after Task 7.

**O5.3** `four headings are` — 2 in the tree: `skills/tanto/roles/kanri.md` 1 (P5.2 clears it) and `skills/tanto/templates/shoroku-brief.md` 1, cleared in Task 4 already. Must be 0 after P5.2.

**O5.4** `the recommendation, the direction, and the commit subject —` — `skills/tanto/roles/kanri.md` 1, step 4's dispatch. Must be 0 after P5.3. The twin without the trailing dash in `skills/tanto/SKILL.md` is O7.3's.

**O5.5** `a triage's observation` — `skills/tanto/roles/kanri.md` 1, the Between-plans paragraph. Must be 0 after P5.4. `templates/roster.md`'s parallel sentence uses different words and is O10.1's.

**O5.6** `the intake's filings` — `skills/tanto/roles/kanri.md` 1. Must be 0 after P5.5. `roles/hosa.md`'s spelling of the same claim is O11.1's.

**O5.7** `lint on them — and fill Adopted` — `skills/tanto/roles/kanri.md` 1, Delegation to Hosa; the needle spans the point where the fix commit's clause is inserted. Must be 0 after P5.6.

**A5.1** `skills/tanto/roles/kanri.md` — `grep -cF 'sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/roles/kanri.md` — before: 0, after: 1

- [ ] **Step 1: Apply the four "Shoroku" passages**

**P5.1** `skills/tanto/roles/kanri.md` — replace exactly these 19 lines

```text
2. **Recommend.** At the close, dispatch `subagent_type: tanto-shoroku-recommend`
   in the skill's recommend mode over the T2 proposal and every source the
   `pending` rows name — the spec with its four section names, each proposal
   by path, each report by path and item — with `docs/` as the baseline, and
   name the output, `.tanto/<topic>/t2-recommendation.md`. The recommender's
   bar: an item is recommended as an `issue` only when it is medium
   severity or above, needs a decision, or records a measured defect; a
   low-severity gap in the skill's own prose whose repair is one sentence
   is recommended `reject`, with the correction written out in the reason,
   so the direction can still order it applied. The file lists
   every item once in three groups — Recommended adopt, Recommended reject,
   Unsure — each item quoted in full from its source, so that the file
   stands alone as the apply's input, with its destination, its one-line
   reason, and for a `design` entry the `req-<id>` it serves; a requirement
   or an ADR item carries the original wording followed by a reference
   translation in the chat's language. Name in the same dispatch the brief
   path — `.tanto/<topic>/t2-brief.md` — the template
   `templates/shoroku-brief.md` in the skill directory, and the chat's
   language; the recommender writes both files in one run.
```

**P5.1 →**

```text
2. **Recommend.** At the close, dispatch `subagent_type: tanto-shoroku-recommend`
   in the skill's recommend mode over the T2 proposal, every source the
   `pending` rows name — the spec with its four section names, each proposal
   by path, each report by path and item, **each named with its `S-n`** so
   that the item's heading and its `Source:` line can carry it — and **every
   untriaged copy under `.tanto/inbox/`**, by path — a copy whose Triage
   section is absent or whose Outcome is none of `issue`, `fix`, `redirect`,
   `kaiseki`, `relay`, `dismissed` — with `docs/` as the baseline and `skills/`
   as the paths a `fix` item may touch, and name
   the output, `.tanto/<topic>/t2-recommendation.md`. The recommender's
   bar: an item is recommended as an `issue` only when it is medium
   severity or above, needs a decision, or records a measured defect; a
   low-severity gap or drift in the skill's own prose whose whole repair is
   one sentence, or a few adjacent ones in one file under `skills/`, and
   needs no decision is recommended `fix`, with the file, the text as it
   reads, and the text as it should read written out in the item. The file
   lists every item once in four groups — Recommended adopt, Recommended
   fix, Recommended reject, Unsure — each item quoted in full from its
   source under a heading that ends with its pointer, `(<topic> S-<n>)` or
   `(inbox <YYYY-MM-DD>-<slug>)`, so that the file stands alone as the
   apply's input, with its destination, its one-line reason, and for a
   `design` entry the `req-<id>` it serves; a requirement or an ADR item
   carries the original wording followed by a reference translation in the
   chat's language. An inbox item's destination is one of `issue`,
   `fix — <file>`, `redirect — <where it belongs>`, `kaiseki — <one line>`,
   `relay — <topic>` (a live spec whose scope it is in), or `dismissed —
   <one line>` (no defect, or a duplicate); `issue`, `redirect`, `kaiseki`,
   and `relay` are recommended adopt, `dismissed` reject, and an inbox item
   the human turns down goes `dismissed` with the direction's words as its
   reason. Name in the same dispatch the brief
   path — `.tanto/<topic>/t2-brief.md` — the template
   `templates/shoroku-brief.md` in the skill directory, and the chat's
   language; the recommender writes both files in one run.
```

**P5.2** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `4` and the
   four headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended reject`, `## Unsure`, in that order; every `### ` heading
```

**P5.2 →**

```text
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `5` and the
   five headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended fix`, `## Recommended reject`, `## Unsure`, in that
   order; every `### ` heading
```

**P5.3** `skills/tanto/roles/kanri.md` — replace exactly these 11 lines

```text
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
```

**P5.3 →**

```text
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
   row; its Triage is its record. A `relay` outcome is yours to finish:
   append the copy's Symptom as the next `I-n` of that topic's
   `spec-inputs.md` with your note, send its Sekkei one line, and rewrite the
   copy's Reference from the topic to `I-<n> of <topic>` — one untracked
   line, no slot; a `kaiseki`
   outcome is a numbered item in your close line asking the human to open a
   standalone Kaiseki with the copy's path.
```

**P5.4** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
**Between plans** there is no ledger, so record items that reach you then —
a Kikaku decision file belonging to no topic, a triage's observation, your
own exit's proposal, a close's `-2-proposal.md` — in the roster's Shoroku
```

**P5.4 →**

```text
**Between plans** there is no ledger, so record items that reach you then —
a Kikaku decision file belonging to no topic, your
own exit's proposal, a close's `-2-proposal.md` — in the roster's Shoroku
```

**P5.5** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
The apply subagent is the writer at the close. You write under `docs/` only
through the intake's filings and the hotfix lane, and you hand those to Hosa
when one is live.
```

**P5.5 →**

```text
The apply subagent is the writer at the close. You write under `docs/` only
through the hotfix lane, on the human's word, and you hand that to Hosa when
one is live.
```

- [ ] **Step 2: Apply the "Delegation to Hosa" passage**

**P5.6** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```text
`close done:` verify the commit as you verify any — `git status` clean, the
diff's paths those the direction names, lint on them — and fill Adopted
from the direction file and Written from the subject. You wait for none of
it: a close delegated is carried in the handover file's In flight block,
and the successor verifies. With no Hosa live, run the three steps
yourself, and add to your close line the suggestion to open one
(`/tanto hosa`), in the shape of the between-plans Kikaku suggestion.
```

**P5.6 →**

```text
`close done:` verify the commit as you verify any — `git status` clean, the
diff's paths those the direction names, lint on them — and the fix commit
beside it when the direction accepted a `fix` item, whose subject is fixed
by "The four steps" step 4 and rides no line; fill Adopted
from the direction file and Written from the subjects. You wait for none of
it: a close delegated is carried in the handover file's In flight block,
and the successor verifies. With no Hosa live, run the three steps
yourself, and add to your close line the suggestion to open one
(`/tanto hosa`), in the shape of the between-plans Kikaku suggestion.

**The between-plans inbox sweep.** When no topic is open and the human
says, in your window and in any words, that the inbox is to be swept, run
steps 2 to 4 over the untriaged inbox copies alone: the files are
`.tanto/inbox-<YYYY-MM-DD>-recommendation.md`, `-brief.md`, and
`-direction.md` beside the roster, the subjects `docs: inbox sweep
<YYYY-MM-DD>` and `fix: text corrections from the inbox sweep <YYYY-MM-DD>`,
the commits on `main`. With a `live` Hosa row, send it one line, without an
idle subscription,
`sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`,
and verify on its `close done:` as above; no `S-n` rows are written, since
an inbox item's record is its copy's Triage. Write the sweep as one Events
line of the roster.
```

- [ ] **Step 3: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 5`

Expected: `task 5: verify clean`.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): the close reads the inbox, applies the fixes, and sweeps between plans`. End the message with your own `Co-Authored-By:` trailer.

### Task 6: `roles/hosa.md` — the close's inbox input, the `sweep:` line, and what a sweep is not

**Files:**

- Modify: `skills/tanto/roles/hosa.md` (L38-46, L53-59, L75-78, L86-87, L98-99, L105-106)

**Interfaces:**

- Consumes: Task 5's `sweep:` line, byte-identical, and its two fix subjects; Task 4's four groups and five headings.
- Produces: nothing a later task reads. Task 11 edits two other places in this same file and must not disturb these.

Spec sections 4.2, 4.3, 4.4 and 4.6. Section 4.4 is the answer to Hosa's own I-1 — an inbox copy is not a `pending` row and enters no ledger.

**Named mechanisms this task touches.** The **`sweep:` line**: `roles/kanri.md` (Task 5) and `skills/tanto/SKILL.md` (Task 7) carry the same string, and the consistency note pins it per copy (Task 16). The **five `##` headings**: Task 4, Task 5, Task 7, Task 16. The **`fix: text corrections from <topic>'s close` subject** and the sweep's own `fix: text corrections from the inbox sweep <YYYY-MM-DD>`: Task 5 and Task 7. The **six Triage outcome words**, listed here as the untriaged test: Tasks 1, 4, 5, 12, 14. `subagents.shoroku.recommend` and `subagents.shoroku.apply` keep their names; only the sentence that says when they are dispatched changes.

**Old values this task must clear** — counts run against the live tree:

**O6.1** `rows and the source each names; dispatch` — `skills/tanto/roles/hosa.md` 1; the needle ends at the semicolon so that it spans the point where `, with its `S-n`; list the untriaged copies` is inserted. Must be 0 after P6.1.

**O6.2** `over the proposal and every one of those sources` — `skills/tanto/roles/hosa.md` 1. Must be 0 after P6.1.

**O6.3** `the direction, and the subject, in the slot the line gave` — `skills/tanto/roles/hosa.md` 1. Must be 0 after P6.2.

**O6.4** `Kanri verifies the commit and writes the ledger` — `skills/tanto/roles/hosa.md` 1; the plural is what changes. Must be 0 after P6.2.

Three further entities this task changes — the `close:`-or-`sweep:` alternative in "Not yours", in Lifecycle's compaction sentence, and in its closing-line sentence, and the close's-and-the-sweep's two subagents in "Models" — change **inside a backticked token**, so no backtick-free needle spans their change point and `O`'s lead line cannot carry one. They are covered by A6.1 and by their own passages; a reviewer reads P6.3, P6.4, P6.5 and P6.6 against this note.

**A6.1** `skills/tanto/roles/hosa.md` — `grep -cF 'sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/roles/hosa.md` — before: 0, after: 1

**A6.2** `skills/tanto/roles/hosa.md` — `grep -c "the sweep's" skills/tanto/roles/hosa.md` — before: 0, after: 1

- [ ] **Step 1: Apply the two `close:`-paragraph passages**

**P6.1** `skills/tanto/roles/hosa.md` — replace exactly these 9 lines

```text
run its three dispatched steps while Kanri goes on. Read the ledger's
Shoroku proposal items table for
the `pending` rows and the source each names; dispatch
`subagent_type: tanto-shoroku-recommend` in the `shoroku` skill's recommend
mode over the proposal and every one of those sources, with `docs/` as the
baseline, the recommendation path, the brief path, the template
`templates/shoroku-brief.md`, and the chat's language; check the brief's
form by `grep` as `roles/kanri.md`'s Check step says — the four headings
in order, every `###` heading of the recommendation once after `See:` —
```

**P6.1 →**

```text
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
form by `grep` as `roles/kanri.md`'s Check step says — the five headings
in order, every `###` heading of the recommendation once after `See:` —
```

**P6.2** `skills/tanto/roles/hosa.md` — replace exactly these 7 lines

```text
`subagent_type: tanto-shoroku-apply` in apply mode with the recommendation,
the direction, and the subject, in the slot the line gave — no
`slot-needed:` is sent, the slot is in the line; and answer Kanri
`close done: <commit subject> — <reading>`. When the brief fails its form
twice, or the human does not answer, answer `close blocked: <one line>`
instead and idle. Kanri verifies the commit and writes the ledger; you
write neither.
```

**P6.2 →**

```text
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

- [ ] **Step 2: Apply the "Not yours", "Models" and "Lifecycle" passages**

**P6.3** `skills/tanto/roles/hosa.md` — replace exactly these 4 lines

```text
The proposal items and the ledger. You never write a proposal or an `S-n`
row: the session that holds the items writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` line, and only a subagent applies them.
```

**P6.3 →**

```text
The proposal items and the ledger. You never write a proposal or an `S-n`
row: the session that holds the items writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` or a `sweep:` line, and only a subagent applies them. An
inbox copy is not a row and enters no ledger: under a `sweep:` line the
recommender's input is the untriaged copies you list by path, their record
is the Triage the apply fills, and nothing of a sweep reaches a ledger or
the roster's table.
```

**P6.4** `skills/tanto/roles/hosa.md` — replace exactly these 2 lines

```text
Any subagent you dispatch takes `subagents.default`, except the close's
two: the recommender takes `subagents.shoroku.recommend` and is dispatched
```

**P6.4 →**

```text
Any subagent you dispatch takes `subagents.default`, except the close's and
the sweep's
two: the recommender takes `subagents.shoroku.recommend` and is dispatched
```

**P6.5** `skills/tanto/roles/hosa.md` — replace exactly these 2 lines

```text
unanswered, or inside a `close:` before its `close done:` or
`close blocked:` — the human may `/compact` it instead: the session id and
```

**P6.5 →**

```text
unanswered, or inside a `close:` or a `sweep:` before its `close done:` or
`close blocked:` — the human may `/compact` it instead: the session id and
```

**P6.6** `skills/tanto/roles/hosa.md` — replace exactly these 2 lines

```text
the commit subject and `none`; after a `close:` line, the direction file and
the step the close is at.
```

**P6.6 →**

```text
the commit subject and `none`; after a `close:` or a `sweep:` line, the
direction file and the step the close is at.
```

- [ ] **Step 3: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 6`

Expected: `task 6: verify clean`.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/hosa.md
```

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/hosa.md
```

Subject: `docs(tanto): Hosa's close reads the inbox, and a sweep is not a ledger's`. End the message with your own `Co-Authored-By:` trailer.

### Task 7: `SKILL.md` — "Session exit" and the Artifacts table

**Files:**

- Modify: `skills/tanto/SKILL.md` (L784-790, L794-796, L805-812, L816-822, L872-876, L906, L909, L923)

**Interfaces:**

- Consumes: Task 5's `sweep:` line and its subjects; Task 4's four groups.
- Produces: the contract's own statement of the two fixed prefixes the whole-branch review package excludes — `docs: T2 shoroku` and `fix: text corrections` — and the three new Artifacts rows for the inbox copy, the sent copy, and the between-plans sweep's files. Task 8 adds the reserved-names paragraph these rows' names come from; Task 15 rewrites Messages in the same file.

Spec sections 2.4 and 2.5. This task is in batch B because spec Measured 5 counts `SKILL.md`'s Session exit and Artifacts rows among the sites that pin the group count, and says every one of them changes together.

**Named mechanisms this task touches.** The **five `##` headings** and the **`Recommended fix` group**: Tasks 4, 5, 6, 16. The **`sweep:` line**: Tasks 5, 6, 16. The **two fixed commit prefixes**: `roles/kanri.md` step 4 (Task 5) spells the full subject; the whole-branch review's exclusion is stated only here. The **inbox copy's Triage**: `templates/bug-report.md` (Task 12) is the shape, `roles/kanri.md` "Bug intake" (Task 14) is the rule, `skills/shoroku/SKILL.md` apply mode (Task 4) is the writer. The **`.tanto/sent/` directory**: its row is added here; the reserved-names list (Task 8), Kanri's Start step 2 (Task 9), "Reporting from the other side" (Task 14), `roles/kaiseki.md` (Task 15) and the report template (Task 12) name it too.

**Old values this task must clear** — counts run against the live tree:

**O7.1** `in three groups` — see O5.2; this task clears its last two sites, `skills/tanto/SKILL.md`'s Session exit step 2 (P7.1) and its `t2-recommendation.md` Artifacts row (P7.8). Must be 0 after this task.

**O7.2** `the four headings` — 3 in the tree this plan touches: `skills/tanto/SKILL.md` 1 (P7.2), `skills/tanto/roles/hosa.md` 1 (Task 6's P6.1), `skills/tanto/templates/shoroku-brief.md` 1 (Task 4's P4.10). Must be 0 after this task.

**O7.3** `the direction, and the commit subject; that subagent` — `skills/tanto/SKILL.md` 1. Must be 0 after P7.3.

**O7.4** `verifies the commit and fills the ledger` — `skills/tanto/SKILL.md` 1, the Hosa paragraph. Must be 0 after P7.4.

**O7.5** `The apply subagent's commit subject is` — `skills/tanto/SKILL.md` 1, "The files"; the singular is what changes. Must be 0 after P7.5.

**O7.6** `a bug-report sender, its first data row` — `skills/tanto/SKILL.md` 1, the roster's Readers cell. Must be 0 after P7.6.

**O7.7** `a bug report received, with its Triage section` — `skills/tanto/SKILL.md` 1, the inbox row's Content cell. Must be 0 after P7.7.

- [ ] **Step 1: Apply the four "Session exit" passages**

**P7.1** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```text
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the T2 proposal and every source the `pending` rows name — the
   spec's sections by heading, each proposal by path, each report by path
   and item — and names the output, `t2-recommendation.md`: every item once,
   quoted in full from its source, in three groups — Recommended adopt,
   Recommended reject, Unsure — each with its destination and its one-line
   reason. The same dispatch names the brief path, `t2-brief.md` beside the
```

**P7.1 →**

```text
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the T2 proposal, every source the `pending` rows name — the
   spec's sections by heading, each proposal by path, each report by path
   and item, each with its `S-n` — and every untriaged copy under
   `.tanto/inbox/`, by path, names `skills/` as the paths a `fix` item may
   touch, and names the output, `t2-recommendation.md`:
   every item once, quoted in full from its source, its heading carrying the
   pointer its `Source:` line will take, in four groups — Recommended adopt,
   Recommended fix, Recommended reject, Unsure — each with its destination
   and its one-line reason. An inbox item's destination is one of `issue`,
   `fix — <file>`, `redirect — <where it belongs>`, `kaiseki — <one line>`,
   `relay — <topic>`, or `dismissed — <one line>`; a `fix` item carries the
   file, the text as it reads, and the text as it should read.
   The same dispatch names the brief path, `t2-brief.md` beside the
```

**P7.2** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
```

**P7.2 →**

```text
3. **Check.** Kanri checks the brief's form by `grep` — the five headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
```

**P7.3** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```text
4. **Apply.** Kanri dispatches the `shoroku.apply` kind with the
   recommendation, the direction, and the commit subject; that subagent
   writes the accepted subset per `docs/AGENTS.md`, runs the repository's
   lint on the changed paths — or on the whole repository where the lint
   script takes no path arguments, which satisfies the step — and commits
   once by explicit path, on the topic's branch, before the merge decision.
   No session applies the accepted subset of its own proposal. Kanri
   verifies the diff as for any commit and marks the `S-n` rows written.
```

**P7.3 →**

```text
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

**P7.4** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```text
and Hosa dispatches the recommender, form-checks and pastes the brief in
its own window under its chores grant, writes the direction from the
human's answer — or from a `decision: <path>` line Kanri relays — dispatches
the apply in that slot, and answers `close done: <commit subject> — <reading>`
or `close blocked: <one line>`; Kanri, or the successor it has handed over
to, verifies the commit and fills the ledger. With no Hosa live, Kanri runs
the three steps itself.
```

**P7.4 →**

```text
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

**P7.5** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
`.tanto/<topic>/shoroku-proposal.md`. The close's three files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the topic
directory; there are no others. The apply subagent's commit subject is
`docs: T2 shoroku for <topic>` — the one fixed prefix, `docs: T2 shoroku`,
that the whole-branch review package excludes.
```

**P7.5 →**

```text
`.tanto/<topic>/shoroku-proposal.md`. The close's three files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the topic
directory; there are no others. The apply subagent's commit subjects are
`docs: T2 shoroku for <topic>` and, when a `fix` item was accepted,
`fix: text corrections from <topic>'s close` — the two fixed prefixes,
`docs: T2 shoroku` and `fix: text corrections`, that the whole-branch review
package excludes.
```

- [ ] **Step 2: Apply the three Artifacts-table passages**

**P7.6** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its first data row | one row per session that handshook — a plan's queued Jissos included |
```

**P7.6 →**

```text
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its live Hosa row or its first data row | one row per session that handshook — a plan's queued Jissos included |
```

**P7.7** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
```

**P7.7 →**

```text
| `.tanto/inbox/<date>-<slug>.md` | the intake — a live Hosa, else Kanri | the close's recommender, by path; the apply, for the Triage section | a bug report received, under the sender's basename, with its Received line; its Triage section is filled by the close's apply and marks the copy triaged |
| `.tanto/sent/<date>-<slug>.md` | the session that noticed the defect — any role, or Hosa from the human's words | the intake of the target workspace, by the path the `bug-report:` line carries | a bug report sent, from `templates/bug-report.md`; kept, never deleted by a rule |
| `.tanto/inbox-<date>-recommendation.md`, `-brief.md`, `-direction.md` | the between-plans inbox sweep's recommender, and Kanri or Hosa for the direction | Kanri, the human, the apply | the sweep's three files when no topic is open, beside the roster |
```

**P7.8** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| `.tanto/<topic>/t2-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every proposal item once, quoted in full from the source its `pending` row names, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
```

**P7.8 →**

```text
| `.tanto/<topic>/t2-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every proposal item once, quoted in full from the source its `pending` row names, in four groups — Recommended adopt, Recommended fix, Recommended reject, Unsure — each with its destination and its one-line reason |
```

The `t2-brief.md` row keeps "grouped as the recommendation groups them" and the `.tanto/.gitignore` row keeps `Kanri at start, a standalone Kaiseki, or a bug-report writer`; neither is a passage.

- [ ] **Step 3: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 7`

Expected: `task 7: verify clean`.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/SKILL.md
```

Subject: `docs(tanto): the contract's close names four groups, two commits, and the sent copy`. End the message with your own `Co-Authored-By:` trailer.

### Task 8: `SKILL.md` — the roles table, the `received:` answer, the reserved names, and One boss

**Files:**

- Modify: `skills/tanto/SKILL.md` (L24, L30, L558-560, L582, L976, after L1079-1083)

**Interfaces:**

- Consumes: nothing from batch B; these four passages are independent of the close.
- Produces: the **one list of reserved names** that `roles/kanri.md`'s Start steps 2 and 5 point at by reference (Task 9) — the directories `inbox`, `sent`, `kikaku`, `kaiseki`; the files `roster.md`, `roster-archive.md`, `kanri-handover.md`, `.gitignore`, `.markdownlint-cli2.yaml`; the prefixes `exit-kanri-` and `inbox-`. Also the One boss exception the intake's reply relies on, which `roles/hosa.md`'s opening paragraph restates (Task 11).

Spec sections 2.1, 2.3, 2.6 and 2.7. This closes issue-59c9 (one list, checked by name) and issue-9d17 (verified at every start and close).

**Named mechanisms this task touches.** The **reserved names of `.tanto/`**: stated once here and read by `roles/kanri.md` Start step 2 and step 5 (Task 9); the `sent/` entry also appears in the Artifacts table (Task 7), "Reporting from the other side" (Task 14), `roles/kaiseki.md` (Task 15) and `templates/bug-report.md` (Task 12); the `inbox-` prefix is the between-plans sweep's, from Tasks 5, 6 and 7. The **`received:` answer**: `roles/kanri.md` "Bug intake" (Task 14), `roles/hosa.md`'s intake paragraph (Task 11), `SKILL.md`'s own Messages (Task 15), and the consistency note's replaced check (Task 16) — four copies, and the note pins one per file. The **intake's owner** in the roles table: `roles/kanri.md`'s opening paragraph (Task 9), `roles/hosa.md`'s "Whose work you take" (Task 11), and `skills/tanto/README.md` (Task 13).

**Old values this task must clear** — counts run against the live tree:

**O8.1** `the human's small chores, Kanri's filings,` — `skills/tanto/SKILL.md` 1, the Hosa role row. Must be 0 after P8.2. The row keeps the words `Kanri's filings` after `the bug intake`, so the needle is the row's opening, which is where the insertion falls.

**O8.2** `1. One boss: only Kanri messages Jisso.` — `skills/tanto/SKILL.md` 1, rule 1. Must be 0 after P8.5.

The `no-role` bullet's `triage:` → `received:` (P8.3) and the One boss bullet's appended sentence (P8.4) change inside a backticked token or at a line break, so neither has a backtick-free single-line needle that spans its change point; A8.1, A8.2 and A8.3 cover them. `the bug intake, the create requests` is O9.1's — this task clears one of its two sites and Task 9 the other.

**A8.1** `skills/tanto/SKILL.md` — `grep -c 'The one exception is the intake' skills/tanto/SKILL.md` — before: 0, after: 1

**A8.2** `skills/tanto/SKILL.md` — `grep -c 'reply is a' skills/tanto/SKILL.md` — before: 0, after: 1

**A8.3** `skills/tanto/SKILL.md` — `grep -c 'reserves these names' skills/tanto/SKILL.md` — before: 0, after: 1

- [ ] **Step 1: Apply the two roles-table passages**

**P8.1** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake, the create requests and the `release:` lines | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
```

**P8.1 →**

```text
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake when no Hosa is live, the create requests and the `release:` lines | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
```

**P8.2** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores, Kanri's filings, and the close's recommend, check, and apply, each in a slot Kanri gives | the human; Kanri |
```

**P8.2 →**

```text
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores, the bug intake, Kanri's filings, and the close's recommend, check, and apply, each in a slot Kanri gives | the human; Kanri |
```

- [ ] **Step 2: Apply the `no-role` bullet, One boss, and rule 1**

**P8.3** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
  directions, the handshake, the bug-report route and its `triage:` answer
```

**P8.3 →**

```text
  directions, the handshake, the bug-report route and its `received:` answer
```

**P8.4** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
- One boss. Only Kanri messages Jisso; Sekkei, Keikaku, Kaiseki, Kikaku, and
  Hosa never do — inbound messages queue and drain in order, and a second
  boss interleaves instructions.
```

**P8.4 →**

```text
- One boss. Only Kanri messages Jisso; Sekkei, Keikaku, Kaiseki, Kikaku, and
  Hosa never do — inbound messages queue and drain in order, and a second
  boss interleaves instructions. The one exception is the intake's
  `received:` line, `from` copied into `to`: a reply to a line the receiver
  sent, carrying no instruction, and the one line a Hosa sends to a role
  other than Kanri.
```

**P8.5** `skills/tanto/SKILL.md` — replace exactly these 1 lines

```text
1. One boss: only Kanri messages Jisso.
```

**P8.5 →**

```text
1. One boss: only Kanri messages Jisso; the intake's `received:` reply is a
   reply, not a boss's line.
```

- [ ] **Step 3: Apply the reserved-names insertion**

**P8.6** `skills/tanto/SKILL.md` — insert after these 5 lines

```text
`.tanto/<topic>/` outlives the plan, and so does the SDD workspace
`.superpowers/sdd/<plan-basename>/`. Jisso never deletes either, and nothing
asks the human to delete either: after T2 the two have the same standing —
untracked, local to one machine, useful only for a later re-read — and disk
is the only cost (issue-12d3).
```

**P8.6 →**

```text

`.tanto/` reserves these names, and a topic slug is none of them and begins
with neither prefix: the
directories `inbox`, `sent`, `kikaku`, and `kaiseki`; the files `roster.md`,
`roster-archive.md`, `kanri-handover.md`, `.gitignore`, and
`.markdownlint-cli2.yaml`; and the prefixes `exit-kanri-` and `inbox-`.
Kanri checks a new slug against this list by name, before any directory
exists, and lists the root against the same names at every start and every
close.
```

- [ ] **Step 4: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 8`

Expected: `task 8: verify clean`.

- [ ] **Step 5: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: every hook passes.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/SKILL.md
```

Subject: `docs(tanto): one list of reserved names, and the intake's received: reply`. End the message with your own `Co-Authored-By:` trailer.

### Task 9: `roles/kanri.md` — Start, the batch loop, the Handover trigger, and the opening paragraph

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L5, L61-66, L85-88, L405-408, L661)

**Interfaces:**

- Consumes: Task 8's one list of reserved names, which both Start passages point at by reference instead of re-listing.
- Produces: nothing a later task reads. Task 14 replaces "Bug intake" in this same file and must not disturb these.

Spec sections 3.1, 3.2, 3.3 and 3.8. Loop step 4 **keeps its number** so that step 7's commit window and its slots (a) and (b), which other passages name, keep theirs; renumbering after step 4 shrinks is `tanto-diet`'s, not this plan's (spec Out of scope).

**Named mechanisms this task touches.** The **reserved names of `.tanto/`**: the list itself is `SKILL.md`'s Workspace section (Task 8); both passages here name it by reference, so a reviewer checks that the words match the list Task 8 wrote — `inbox`, `sent`, `kikaku`, `kaiseki`, `roster.md`, `roster-archive.md`, `kanri-handover.md`, `.gitignore`, `.markdownlint-cli2.yaml`, `exit-kanri-`, `inbox-`. The **`received:` answer**, named in the new loop step 4: Tasks 8, 11, 14, 15, 16. The **between-plans inbox sweep**, named in the Handover trigger: Tasks 5, 6, 7. The **intake's owner** in the opening paragraph: `SKILL.md`'s roles table (Task 8), `roles/hosa.md` (Task 11), `skills/tanto/README.md` (Task 13).

**Old values this task must clear** — counts run against the live tree:

**O9.1** `the bug intake, the create requests` — 2 in the tree this plan touches: `skills/tanto/SKILL.md` 1, the Kanri role row (Task 8's P8.1), and `skills/tanto/roles/kanri.md` 1, its opening paragraph (P9.5). Must be 0 after this task.

**O9.2** `Triage any bug report that arrived during the batch` — `skills/tanto/roles/kanri.md` 1, loop step 4. Must be 0 after P9.3.

**O9.3** `a bug-report triage` — `skills/tanto/roles/kanri.md` 1, the Handover trigger's signal-4 sentence. Must be 0 after P9.4.

Start step 2's entry list and step 5's slug check change inside backticked tokens, so neither has a backtick-free needle spanning its change point; A9.1 and A9.2 cover them.

**A9.1** `skills/tanto/roles/kanri.md` — `grep -c 'reserved names' skills/tanto/roles/kanri.md` — before: 0, after: 2

**A9.2** `skills/tanto/roles/kanri.md` — `grep -cF 'sent/' skills/tanto/roles/kanri.md` — before: 0, after: 2

- [ ] **Step 1: Apply the two "Start" passages**

**P9.1** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
   Then list `.tanto/` itself and report in your start line every entry that
   is none of these: `.gitignore`, `.markdownlint-cli2.yaml`, `roster.md`,
   `roster-archive.md`, `kanri-handover.md`, `inbox/`, `kikaku/`, `kaiseki/`,
   one directory per topic the roster or the archive names — open, or closed
   and kept under the Workspace section's retention rule — and your
   predecessors' `exit-kanri-*` files; the human decides what to do
```

**P9.1 →**

```text
   Then list `.tanto/` itself and report in your start line every entry that
   is none of these: the reserved names `SKILL.md`'s Workspace section lists
   — `.gitignore`, `.markdownlint-cli2.yaml`, `roster.md`,
   `roster-archive.md`, `kanri-handover.md`, `inbox/`, `sent/`, `kikaku/`,
   `kaiseki/`, your predecessors' `exit-kanri-*` files, and the between-plans
   sweep's `inbox-*` files — and
   one directory per topic the roster or the archive names — open, or closed
   and kept under the Workspace section's retention rule; the human decides
   what to do
```

**P9.2** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
   sentence, a name — derive a kebab-case slug of one to three words, check
   that no `.tanto/<slug>/`, no spec for that slug at the default spec
   location (`docs/superpowers/specs/*-<slug>-design.md`), and no branch
   `<slug>` exists (`ls -d`, the glob, and `git branch --list <slug>`), state
```

**P9.2 →**

```text
   sentence, a name — derive a kebab-case slug of one to three words, check
   that it is none of the reserved names `SKILL.md`'s Workspace section
   lists and begins with neither of its prefixes, and that no
   `.tanto/<slug>/`, no spec for that slug at the default spec
   location (`docs/superpowers/specs/*-<slug>-design.md`), and no branch
   `<slug>` exists (`ls -d`, the glob, and `git branch --list <slug>`), state
```

- [ ] **Step 2: Apply the loop step, the Handover trigger, and the opening paragraph**

**P9.3** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
4. **Triage any bug report that arrived during the batch**, per "Bug intake"
   below: rule on each, and send the redirects, the Kaiseki requests, and the
   relays now. An issue to file or a hotfix to make waits for the commit window
   at step 7.
```

**P9.3 →**

```text
4. **Bug reports need nothing from you here.** A report received during
   the batch sits in `.tanto/inbox/`, answered `received:` by its intake, and
   is read at the close ("Bug intake" below); a fix the human orders on one
   is the hotfix lane, in slot (b) of step 7.
```

**P9.4** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
there — a bug-report triage, the handshakes, a resume — with no
```

**P9.4 →**

```text
there — a between-plans inbox sweep, the handshakes, a resume — with no
```

**P9.5** `skills/tanto/roles/kanri.md` — replace exactly these 1 lines

```text
directions, the bug intake, the create requests, and the `release:` lines;
```

**P9.5 →**

```text
directions, the bug intake when no Hosa is live, the create requests, and
the `release:` lines;
```

- [ ] **Step 3: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 9`

Expected: `task 9: verify clean`.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): Kanri reads the reserved names as one list, and a report pends nothing in the loop`. End the message with your own `Co-Authored-By:` trailer.

### Task 10: `templates/roster.md` and `templates/kanri.md` — the two Events lines

**Files:**

- Modify: `skills/tanto/templates/roster.md` (L90-92, L97, L123-125)
- Modify: `skills/tanto/templates/kanri.md` (L94)

**Interfaces:**

- Consumes: Task 5's between-plans sweep, which the roster's Events line now names in place of a receipt and a send.
- Produces: nothing a later task reads.

Spec sections 7.3 and 7.4. Both files are under `skills/tanto/templates/**`, which `.markdownlint-cli2.yaml` ignores.

**Named mechanisms this task touches.** The **inbox sweep**, now an Events line of the roster: `roles/kanri.md`'s "Delegation to Hosa" (Task 5) is what writes it, `roles/hosa.md` (Task 6) and `SKILL.md` (Task 7) name the same three files and two subjects. The **Shoroku proposal items table's Source column**: `roles/kanri.md`'s Between-plans paragraph (Task 5's P5.4) drops the triage from the same list, so the two must agree. Nothing in either template names the `received:` line or the `Source:` line, and nothing here adds one.

**Old values this task must clear** — counts run against the live tree:

**O10.1** `between-plans triage or a Kikaku file` — `skills/tanto/templates/roster.md` 1. Must be 0 after P10.1.

**O10.2** `with Source the triage, report, or session` — `skills/tanto/templates/roster.md` 1. Must be 0 after P10.2.

**O10.3** `or not run and what was lost; a bug report` — `skills/tanto/templates/roster.md` 1, the Events line; the needle ends at the words the passage removes. Must be 0 after P10.3.

**O10.4** `a bug report triaged and its outcome` — `skills/tanto/templates/kanri.md` 1, the ledger's Events line. Must be 0 after P10.4.

- [ ] **Step 1: Apply the three roster passages**

**P10.1** `skills/tanto/templates/roster.md` — replace exactly these 3 lines

```text
Between plans there is no conductor ledger, so an item raised then — by a
between-plans triage or a Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's `-2-proposal.md` — is recorded here with
```

**P10.1 →**

```text
Between plans there is no conductor ledger, so an item raised then — by a
Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's `-2-proposal.md` — is recorded here with
```

**P10.2** `skills/tanto/templates/roster.md` — replace exactly these 1 lines

```text
Columns as the ledger's, with Source the triage, report, or session that
```

**P10.2 →**

```text
Columns as the ledger's, with Source the file, report, or session that
```

**P10.3** `skills/tanto/templates/roster.md` — replace exactly these 3 lines

```text
  proposed by <name> [<ref>], or not run and what was lost; a bug report
  received, or sent to <name> [<ref>];
  decision: <path> received from <name>;
```

**P10.3 →**

```text
  proposed by <name> [<ref>], or not run and what was lost;
  an inbox sweep: its three files and its commit subjects;
  decision: <path> received from <name>;
```

- [ ] **Step 2: Apply the ledger-template passage**

**P10.4** `skills/tanto/templates/kanri.md` — replace exactly these 1 lines

```text
  a bug report triaged and its outcome; an exit proposal form-checked and its
```

**P10.4 →**

```text
  an exit proposal form-checked and its
```

- [ ] **Step 3: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 10`

Expected: `task 10: verify clean`.

- [ ] **Step 4: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/templates/roster.md skills/tanto/templates/kanri.md
```

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/templates/roster.md skills/tanto/templates/kanri.md
```

Subject: `docs(tanto): a sweep is an Events line, and a receipt is not`. End the message with your own `Co-Authored-By:` trailer.

### Task 11: `roles/hosa.md` — the intake is yours, and the `received:` reply is the one exception

**Files:**

- Modify: `skills/tanto/roles/hosa.md` (L8, L28-33)

**Interfaces:**

- Consumes: Task 8's One boss exception, which this file's opening paragraph restates from Hosa's side; Task 12's template is written in the same batch, and this paragraph names it.
- Produces: the intake act itself — copy, one appended Received line, `received: <inbox path>`. `roles/kanri.md` 3.6 (Task 14) is written to say Kanri does *exactly* what this paragraph says and nothing more, so a reviewer of Task 14 reads this passage beside it.

Spec sections 4.1 and 4.5. **This task is deliberately in the second-to-last batch**, before Tasks 14 and 15: the spec (section 9) requires that `roles/hosa.md` 4.1 land before the sender-side passages, so that the first Hosa a sender is routed to has a file that tells it what to do. The Hosa that is live *while this plan runs* still keeps its old act until the merge — see Global Constraints.

**Named mechanisms this task touches.** The **`received:` answer**: `SKILL.md`'s `no-role` bullet, One boss bullet and rule 1 (Task 8), `SKILL.md`'s Messages (Task 15), `roles/kanri.md`'s loop step 4 (Task 9) and "Bug intake" (Task 14), and the consistency note's replaced check (Task 16) — the note pins `received: <inbox path>` once per file in three files, and this is one of them. The **inbox copy's basename rule** (the sender's `<YYYY-MM-DD>-<slug>.md`, else today's date and the file's name kebab-cased): identical wording is required in `roles/kanri.md` "The one act" (Task 14) and `templates/bug-report.md` (Task 12). The **`.tanto/sent/` path**: Tasks 7, 8, 9, 12, 14, 15. The **live-Hosa-else-first-row address rule**: `SKILL.md` Messages (Task 15), `roles/kanri.md` "Reporting from the other side" (Task 14), `roles/kaiseki.md` (Task 15), `templates/bug-report.md` (Task 12), and the roster's Readers cell (Task 7).

**Old values this task must clear** — counts run against the live tree:

**O11.1** `bug intake's issue filings` — `skills/tanto/roles/hosa.md` 1, the Kanri's-chores paragraph. Must be 0 after P11.1: there are no intake filings, and Hosa is the intake itself.

**O11.2** `Sekkei, Keikaku, Jisso, or Kaiseki. A message whose first line is` — `skills/tanto/roles/hosa.md` 1, the opening paragraph. Must be 0 after P11.2.

**A11.1** `skills/tanto/roles/hosa.md` — `grep -cF 'received: <inbox path>' skills/tanto/roles/hosa.md` — before: 0, after: 1

- [ ] **Step 1: Apply the intake paragraph**

**P11.1** `skills/tanto/roles/hosa.md` — replace exactly these 6 lines

```text
**Kanri's.** Sent as one line:
`chore: <what> — <paths> — slot: now | at the next boundary`. These are the
bug intake's issue filings, the note updates, and the hotfix lane's edits
when Kanri prefers not to hold them. For those you are **Kanri's hand**:
the lane's conditions, the ruling `R-n`, and the commit subject stay
Kanri's. You make the edit and nothing around it.
```

**P11.1 →**

```text
**The intake's.** While your roster row's Status begins with `live`, every
`bug-report: <path>` line for this repository is addressed to you, from
another repository's session or from a session of this one, and you answer
it with one act that reads nothing of the report: copy the file to
`.tanto/inbox/<basename>` — the sender's `<YYYY-MM-DD>-<slug>.md`, or
today's date and the file's name kebab-cased when it is not of that shape —
creating `inbox/` if absent; append one line under the copy's `## Received`
heading, `- <the envelope's from-name>, <YYYY-MM-DD>`; answer one line,
`received: <inbox path>`, copying the envelope's `from` into `to`. Nothing
else: no `chore:` line to Kanri, no triage, no filing — the report waits in
the inbox for a close, and Kanri learns of it there. When the human hands
you a defect they noticed, in this window, write it from
`templates/bug-report.md` yourself: into the inbox when it is this
repository's, its Received line `- the human, in chat, <YYYY-MM-DD>`, or to
`.tanto/sent/<YYYY-MM-DD>-<slug>.md` and to the target workspace's intake —
its `live` Hosa row, else its first data row, checked against `ListAgents` —
when it is another repository's.

**Kanri's.** Sent as one line:
`chore: <what> — <paths> — slot: now | at the next boundary`. These are the
note updates and the hotfix lane's edits
when Kanri prefers not to hold them. For those you are **Kanri's hand**:
the lane's conditions, the ruling `R-n`, and the commit subject stay
Kanri's. You make the edit and nothing around it.
```

- [ ] **Step 2: Apply the opening paragraph**

**P11.2** `skills/tanto/roles/hosa.md` — replace exactly these 1 lines

```text
Sekkei, Keikaku, Jisso, or Kaiseki. A message whose first line is
```

**P11.2 →**

```text
Sekkei, Keikaku, Jisso, or Kaiseki, with one exception: the intake's
`received:` reply, `from` copied into `to`, which answers whichever session
sent the report and instructs nothing. A message whose first line is
```

- [ ] **Step 3: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 11`

Expected: `task 11: verify clean`.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/hosa.md
```

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/hosa.md
```

Subject: `docs(tanto): the bug intake is Hosa's, and its act reads nothing`. End the message with your own `Co-Authored-By:` trailer.

### Task 12: `templates/bug-report.md`, replaced whole

**Files:**

- Modify, replaced whole: `skills/tanto/templates/bug-report.md`

**Interfaces:**

- Consumes: Task 11's intake act and basename rule, which this file's preamble describes from the sender's side.
- Produces: the Triage section's three lines and its six Outcome words — the shape `skills/shoroku/SKILL.md`'s apply mode (Task 4) and `roles/kanri.md` "Bug intake" (Task 14) fill. Also the `## Reported` and `## Received` headings, which replace `## Reporter`.

Spec section 7.1. The file is replaced whole as a `W` block because every section changes and two sections are removed; the outer fence is four backticks because the file's own body carries a three-backtick `console` fence.

**Named mechanisms this task touches.** The **six Triage outcome words**: Tasks 1, 4, 5, 6, 14. The **relay's Reference form** `I-<n> of <topic>`, which Kanri rewrites once the relay is done: `roles/kanri.md` Shoroku step 4 (Task 5) is the only other site. The **live-Hosa-else-first-row address rule**: Tasks 7, 11, 14, 15. The **`.tanto/sent/` path and its dated basename**: Tasks 7, 8, 9, 11, 14, 15. The **tracked-write rule**: stated in full in `SKILL.md`'s Messages (Task 15), in `roles/kanri.md`'s hotfix lane and Shoroku step 4 (Tasks 14, 5), and here in one sentence — the template drops the identifying fields at the source so that the rule stands second, and a reviewer checks that no removed field crept back.

**Old values this task must clear** — counts run against the live tree, all in this one file:

**O12.1** `## Reporter` — 1. Must be 0: the section is replaced by `## Reported`, the date alone.

**O12.2** `Repository — <path or name>` — 1. Must be 0.

**O12.3** `The intake Kanri copies it to` — 1. Must be 0.

**O12.4** `kaiseki, hotfix, or relay` — 1, the old Outcome list. Must be 0.

**O12.5** `first data row of the target workspace's` — 1. Must be 0.

**O12.6** `Kanri fills it in the inbox copy` — 1. Must be 0.

- [ ] **Step 1: Replace the file**

**W12.1** `skills/tanto/templates/bug-report.md` — new file, 81 lines

````text
# Bug report — <the symptom in one line, in the reporter's words>

Written from the tanto skill's `templates/bug-report.md` by whoever noticed
the defect, saved at `.tanto/sent/<YYYY-MM-DD>-<slug>.md` under the
reporter's own repository (whose `.tanto/.gitignore` holds `*` and whose
`.tanto/.markdownlint-cli2.yaml` holds `config:` / `default: false`; create
both if absent; `<slug>` is kebab-case from the symptom, one to six words),
and sent to the intake as one line, `bug-report: <absolute path>`. The intake
is the target workspace's `live` Hosa, else its Kanri: the bare name — the
`<name>` before the bracket of the `Name [ref]` column — of the roster row
whose Role is `hosa` and whose Status begins with `live`, or of the first
data row when there is none, checked against `ListAgents`, or given by the human when that
roster is absent or the name is not listed. The intake copies the file to
`.tanto/inbox/` under this file's basename, fills Received in the copy, and
answers `received: <inbox path>`; Triage is filled in the copy at a close.

Nothing in this file names the reporter's repository, its path, its
sessions, or its topics, and nothing quotes that repository's own documents:
a tracked file written from this report names it as
`inbox <YYYY-MM-DD>-<slug>` and nothing more.

## Send to

<The intake's bare name, as read from the target roster, or as the human
gave it. Leave it blank if the report was never sent, so the file still says
where it was meant to go.>

## Symptom

<What was expected, and what happened — restated against the skill's own
text. Quote nothing from the reporter repository's plans, specs, ledgers, or
dialogues.>

## Reproduction

```console
<the exact command, copy-pasteable, run from the root of the repository that
ships the skill, or against the inline fixture below>
```

<What it printed. If there is no single command, write the exact sequence
instead, step by step, and what each step printed. Replace every path from
the reporter's repository by `<repo>`; an input the command needs is an
inline fixture written here.>

## Where seen

- Skill — <the skill that ships the defect>
- File — <the path inside the skill, if it is known>
- Role or mode — <the role or mode the reporter was in>

## Severity guess

<One word. A hint for the close's recommender, not a ruling.>

## Proposed fix

<Optional, as text. Delete this section's blank if you have none. A repair
that is one sentence, written here as the sentence, lets the close apply it
as a fix instead of filing an issue.>

## Reported

- <YYYY-MM-DD>

## Received

<Left blank by the reporter. The intake appends one line to the inbox copy:
`- <the envelope's from-name, or "the human, in chat">, <YYYY-MM-DD>`.>

## Triage

<Left blank by the reporter and by the intake. The close's apply replaces the
three bracketed values in the inbox copy and nowhere else; a copy whose Outcome is one of the six
words is out of the queue.>

- Outcome — <issue, fix, redirect, kaiseki, relay, or dismissed>
- Reference — <the issue id, the fix's commit subject, the redirect or
  dismissal in one line, the kaiseki line, or the relay's `I-<n> of <topic>`,
  the topic alone until Kanri has appended the `I-n`>
- Date — <YYYY-MM-DD>
````

- [ ] **Step 2: Check the headings the spec pins**

```bash
grep -c '^## Reported$' skills/tanto/templates/bug-report.md; grep -c '^## Received$' skills/tanto/templates/bug-report.md; grep -c 'Repository —' skills/tanto/templates/bug-report.md; grep -c '^## Reporter$' skills/tanto/templates/bug-report.md
```

Expected: `1`, `1`, `0`, `0`.

- [ ] **Step 3: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 12`

Expected: `task 12: no passages` — `verify` does not check a `W` (whole-file replacement) block; Step 2's four greps above are what verify this task's actual content.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/templates/bug-report.md
```

Expected: every hook passes. The template is in `.markdownlint-cli2.yaml`'s `ignores`, so only the whitespace and frontmatter hooks reach it.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/templates/bug-report.md
```

Subject: `docs(tanto): the report names no repository, and its Triage carries six words`. End the message with your own `Co-Authored-By:` trailer.

- [ ] **Step 6: Restore the file's line endings**

Rewriting a tracked file whole lands it `w/lf` on this host every time; the commit normalized it, so check the file back out from the index so that the working tree and the commit agree and the next batch's `diff` sees no churn.

```bash
git checkout -- skills/tanto/templates/bug-report.md
git status --porcelain skills/tanto/templates/bug-report.md
```

Expected: nothing printed by `git status`.

### Task 13: `skills/tanto/README.md` — the bug-report bullet

**Files:**

- Modify: `skills/tanto/README.md` (L36-38)

**Interfaces:**

- Consumes: nothing; this is the README drift review AGENTS.md asks for after a `SKILL.md` edit, done here for the bullet that describes the route.
- Produces: nothing a later task reads.

Spec section 8.5.

**Named mechanisms this task touches.** The **intake's owner** — the run's live Hosa, else Kanri: `SKILL.md`'s roles table (Task 8), `roles/kanri.md`'s opening paragraph (Task 9) and "Bug intake" (Task 14), `roles/hosa.md` (Task 11). The **six outcomes**, rendered here as prose for a reader outside the run: Tasks 1, 4, 5, 6, 12, 14 — the README says "an issue, a one-sentence fix applied to the skill's text, a redirect, a root-cause session, an input to a spec in progress, or dismissed", which is the six words in plain English and must stay six.

**Old values this task must clear** — count run against the live tree:

**O13.1** `which triages it into an issue` — `skills/tanto/README.md` 1. Must be 0 after P13.1.

- [ ] **Step 1: Apply the passage**

**P13.1** `skills/tanto/README.md` — replace exactly these 3 lines

```text
- Takes bug reports about the skills this repository ships: a report is a file
  and one line to Kanri, which triages it into an issue, a redirect, a
  root-cause session, a one-line hotfix, or an input to a spec in progress.
```

**P13.1 →**

```text
- Takes bug reports about the skills this repository ships: a report is a
  file and one line to the run's live Hosa, or to Kanri when none is live,
  which copies it and answers `received:`; every report is decided at the
  next topic's close with everything else — an issue, a one-sentence fix
  applied to the skill's text, a redirect, a root-cause session, an input to
  a spec in progress, or dismissed — and nothing tracked names the
  reporter's repository.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 13`

Expected: `task 13: verify clean`.

- [ ] **Step 3: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/README.md
```

Expected: every hook passes.

- [ ] **Step 4: Commit**

```bash
git commit --only skills/tanto/README.md
```

Subject: `docs(tanto): the README's bug-report bullet names the intake and the close`. End the message with your own `Co-Authored-By:` trailer.

### Task 14: `roles/kanri.md` — "Bug intake", replaced whole

**Files:**

- Modify: `skills/tanto/roles/kanri.md` (L1128-1242, the section from `## Bug intake` to the blank line before `### Limits`)

**Interfaces:**

- Consumes: Task 11's intake act, which this section is written to mirror exactly — Kanri does what Hosa does and nothing more; Task 5's Shoroku steps 2 and 4, which it points at by number; Task 12's Triage shape.
- Produces: the hotfix lane as the only path by which Kanri writes under `docs/`, its `Source: hotfix <its own commit subject>` rule, and the "Where the commit lands" check that narrows issue-c3a9 (Task 3's appended paragraph points at this heading by name).

Spec section 3.6. `### Limits` and everything after it stay exactly as they are; the old block below stops at the blank line that precedes that heading.

**Named mechanisms this task touches.** The **`received:` answer**: Tasks 8, 9, 11, 15, 16 — the note pins it once per file in three files, and this is one of them. The **inbox copy's basename rule**: `roles/hosa.md` (Task 11) and `templates/bug-report.md` (Task 12) must read the same. The **six Triage outcome words**: Tasks 1, 4, 5, 6, 12. The **`Source:` line**, here the `hotfix` kind: Tasks 1, 2, 4, 5, 15 — `hotfix <commit subject>` is the one kind no other prose site spells out in full, so `scripts/check_md_frontmatter.py`'s `SOURCE_RE` (Task 2) is the only other place it is defined. The **tracked-write rule**: `SKILL.md`'s Messages (Task 15) states it in full; this section applies it to the lane's commit body. The **live-Hosa-else-first-row address rule**, in "Reporting from the other side": Tasks 7, 11, 12, 15. The **between-plans inbox sweep**: Tasks 5, 6, 7, 9. The sentence `a Kanri in another repository is where` is **kept** — it is the only entry in the spec's old-value table marked as staying.

**Old values this task must clear** — counts run against the live tree:

**O14.1** `repository's intake.` — `skills/tanto/roles/kanri.md` 1, the section's opening claim that Kanri is the intake unconditionally. Must be 0.

**O14.2** `### Triage — five outcomes` — `skills/tanto/roles/kanri.md` 1. Must be 0.

**O14.3** `Each triage is a ruling of yours` — `skills/tanto/roles/kanri.md` 1. Must be 0.

**O14.4** `Every receipt and every send is one line in the roster's Events.` — `skills/tanto/roles/kanri.md` 1. Must be 0; `templates/roster.md`'s matching Events entry is O10.3's, cleared in Task 10.

**O14.5** `and its body names where` — `skills/tanto/roles/kanri.md` 1, the hotfix lane's old body rule, which becomes the tracked-write rule. Must be 0.

**O14.6** `filing or a hotfix is pending` — `skills/tanto/roles/kanri.md` 1; there are no filings, so only a hotfix can be pending. Must be 0.

**O14.7** `holds, it takes the issue outcome and waits.` — `skills/tanto/roles/kanri.md` 1, the third path for a fix to a plan-listed file, which becomes an inbox copy. Must be 0.

**O14.8** `column — from the first data` — `skills/tanto/roles/kanri.md` 1, "Reporting from the other side". Must be 0. Its twin in `roles/kaiseki.md` is O15.4's.

**O14.9** `read the intake's bare name — the` — 2 in the tree this plan touches: `skills/tanto/roles/kanri.md` 1 (this task) and `skills/tanto/roles/kaiseki.md` 1 (Task 15). Must be 1 after this task and 0 after Task 15. In both new texts the phrase wraps after `read the`, which is what clears it.

**A14.1** `skills/tanto/roles/kanri.md` — `grep -c 'triage:' skills/tanto/roles/kanri.md` — before: 4, after: 0

**A14.2** `skills/tanto/roles/kanri.md` — `grep -cF 'received: <inbox path>' skills/tanto/roles/kanri.md` — before: 0, after: 1

- [ ] **Step 1: Replace the section**

**P14.1** `skills/tanto/roles/kanri.md` — replace exactly these 115 lines

```text
## Bug intake

`SKILL.md` defines the terms — the `bug-report:` line, the file written from
`templates/bug-report.md`, and the five `triage:` answers. You are this
repository's intake.

### Intake

On `bug-report: <path>`, or on the human's own words, copy the file to
`.tanto/inbox/<YYYY-MM-DD>-<slug>.md`, the slug kebab-case derived by you
from the Symptom, creating `inbox/` if it is absent. When
the human reports in chat, write their words into the skeleton yourself. From
then on read only the copy: the reporter's own file may vanish. The inbox is
the log — the Triage section is appended to the copy, and copies are never
deleted. Every receipt and every send is one line in the roster's Events.

The intake's address is read, not relayed. A reporter that knows this
workspace's path reads the first data row of `<workspace>/.tanto/roster.md`
— your row — and takes the bare `<name>` before the bracket of its
`Name [ref]` column as your address; the human supplies the path where the
reporter does not know it, which is the one thing only the human, who sees
both repositories, can tell it. A resume gives you a new name and the row
follows only when you rewrite it, so a reporter checks the name against
`ListAgents` before sending and asks the human for the address when it is
not listed, or when the roster is absent. You write the roster; a reporter
only reads it, and that read, outside the reporter's own working directory,
may draw a harness permission prompt in the reporter's window outside auto
mode — the harness's, not a protocol failure. A report the reporter cannot
send stays a file the human pastes to you as `bug-report: <path>`.

### Triage — five outcomes

Each triage is a ruling of yours, recorded as `R-n` in the current ledger, or
in the roster's Events when no plan is open. Exactly one of:

1. **Issue** — a defect in a skill this repository ships, larger than a
   one-line fix, or with an unknown cause the human does not want a Kaiseki
   for. File it under `docs/issues/open/` per `docs/issues/AGENTS.md`, with the
   report's symptom and reproduction; the triage is your ruling, so the filing
   is yours to order, and the human sees the commit. The issue is then the
   tracker: `claimed_by` when a plan picks it up, `git mv` to `resolved/` at
   the T2 of the plan that lands the fix. A plan's spec names the issues it
   resolves, and that plan's T2 moves them.
2. **Redirect** — the problem belongs elsewhere: dotrepo, superpowers, Claude
   Code, or the reporter's own repository. One line back, nothing written.
3. **Kaiseki** — the cause is unknown and worth a root-cause pass. Ask the
   human, as a numbered list, to create a standalone Kaiseki with
   `/tanto kaiseki` and to give it the inbox copy's path as its symptom and
   reproduction. Its report goes to the human in that session; the human brings
   its path back to you, and the report re-enters triage as a known cause.
4. **Hotfix** — a one-line fix. See "The hotfix lane" below.
5. **Relay** — a spec is in progress and the report is in its scope. Append it
   to `.tanto/<topic>/spec-inputs.md` as the next `I-n` with your
   note, and send Sekkei one line — the existing relay, reused.

Redirect, the Kaiseki request, and the relay may happen whenever you read the
report. Filing an issue and the hotfix touch tracked files. When a Hosa is
live, hand the filing to it as
`chore: <what> — <paths> — slot: now | at the next boundary`, and the slot you
name places it; when none is live, the filing is your own and waits for the
commit window at loop step 7, or for a gap between plans. When no plan is open,
triage on arrival.

Answer with exactly one line — `triage: issue-<id>`,
`triage: redirect — <one line>`, `triage: kaiseki requested`,
`triage: hotfix — <commit subject>`, or `triage: relayed as I-<n>` — copying
the envelope's `from` into `to`, or saying it in chat to the human.

### The hotfix lane

The lane is open only while no batch is in flight — between batches, where the
triage is ruled at loop step 4 and the edit and the commit happen in slot (b)
of step 7's commit window, or between plans — and never on a file the
in-flight plan lists in its File structure table. In the lane you edit the
skill file directly, run lint on the changed paths by name — or on the whole
repository where the lint script takes no path arguments — and the README drift
review if `SKILL.md` changed, commit once by explicit path with the trailer,
and record `R-n`. No issue is filed: the commit is the durable record, so its
subject names the symptom, not only the report's slug, and its body names where
the report came from. The commit lands on the branch the tree is on — the plan
branch between batches, `main` between plans — and is never pushed. A hotfix on
a plan branch is named in your merge question.

A live Hosa may be your hand in the lane when you would rather not hold the
edit: send it the `chore:` line with the paths and the slot. The lane's
conditions, the ruling `R-n`, and the commit subject stay yours. When a
filing or a hotfix is pending and the roster has no `live` Hosa row, add to
your line to the human a suggestion to open one (`/tanto hosa`) — same shape
as the Kikaku suggestion in "Start".

So that hotfixes reach `docs/` once, carry them forward: when you create a new
topic's ledger, copy the hotfix lines recorded in the roster's Events since the
previous plan into the ledger's "Hotfixes since the previous plan" line, and at
T2 name that line in the direction so the dogfood report carries them.

A fix to a file the in-flight plan rewrites takes one of three paths. If a task
that rewrites the file is still ahead and Keikaku is still live, it is a
cold-read question to Keikaku, which edits the plan's fenced block so that the
task delivers the fix. If every rewriting task has run and only the final batch
remains, the fix joins the whole-branch review's single fix wave. If neither
holds, it takes the issue outcome and waits.

### Reporting from the other side

You are also a reporter: a Kanri in another repository is where a defect in
this repository's skills is often noticed. On the human's request, write the
report from `templates/bug-report.md`; read the intake's bare name — the
`<name>` before the bracket of the `Name [ref]` column — from the first data
row of `<target workspace>/.tanto/roster.md`, asking the human for the
workspace's path if you do not know it, and expecting, outside auto mode, a
harness permission prompt in your window for a read outside your working
directory; check that the name is in `ListAgents`, and ask the human for the
address when it is not, or when that roster is absent; send
`bug-report: <absolute path>` to that bare name; and record the send in the
roster's Events.
```

**P14.1 →**

```text
## Bug intake

`SKILL.md` defines the terms — the `bug-report:` line, the file written from
`templates/bug-report.md`, the intake's `received:` answer, and the
tracked-write rule. The intake is a `live` Hosa; you are the intake only
while none is live, and then you do exactly what Hosa does and nothing more.

### The one act

On `bug-report: <path>`: copy the file to `.tanto/inbox/<basename>`, the
basename the sender's — `<YYYY-MM-DD>-<slug>.md` — or, when the name is not
of that shape, today's date and the file's name kebab-cased; create `inbox/`
if it is absent; append one line under the copy's `## Received` heading,
`- <the envelope's from-name>, <YYYY-MM-DD>`; answer one line,
`received: <inbox path>`, copying the envelope's `from` into `to`. A copy
command and one appended line: you read nothing of the report, since a
report read is a report in your context, and its cost is your context size,
not the act. No triage, no `R-n`, no ledger row, no Events line, no filing,
no hotfix: the copy is the log of receipt, and the report waits for a close.
Copies are never deleted.

When the human reports in chat, in your window, write their words into the
skeleton yourself at `.tanto/inbox/<YYYY-MM-DD>-<slug>.md`, and the Received
line says `- the human, in chat, <YYYY-MM-DD>`.

### The close reads the inbox

Every untriaged copy — its Triage section absent, or its Outcome none of
`issue`, `fix`, `redirect`, `kaiseki`, `relay`, `dismissed` — is an input to
the next close's recommend dispatch, whichever topic closes ("Shoroku", step
2), and the apply fills its Triage (step 4). Between plans, the human's word
in your window runs the same steps over the inbox alone ("Delegation to
Hosa"). Your own exit shoroku does not sweep the inbox.

### The hotfix lane

The lane is opened by the human's word in your window and by nothing else,
and only while no batch is in flight — between batches, in slot (b) of step
7's commit window, or between plans — and never on a file the in-flight plan
lists in its File structure table. In the lane you edit the skill file
directly, run lint on the changed paths by name — or on the whole repository
where the lint script takes no path arguments — and the README drift review
if `SKILL.md` changed, commit once by explicit path with the trailer, and
record `R-n`. No issue is filed for the fix: the commit is the durable
record, so its subject names the symptom, and its body names a report's
source, when the fix answers one, as `inbox <YYYY-MM-DD>-<slug>` and nothing
more; you then fill that copy's Triage — Outcome `fix`, Reference the commit
subject, Date. An issue the human orders filed in the lane opens with
`Source: hotfix <its own commit subject>`.

**Where the commit lands.** Before committing, compare the branch the tree
is on with where the commit is meant to land — the plan branch between
batches, `main` between plans. When the checkout has moved to a branch a
concurrent topic's Sekkei or Keikaku has just cut, a between-plans commit
would land there; ask the human, as a numbered question, before it does
(issue-c3a9). Nothing here is pushed. A hotfix on a plan branch is named in
your merge question.

A live Hosa may be your hand in the lane when you would rather not hold the
edit: send it the `chore:` line with the paths and the slot. The lane's
conditions, the ruling `R-n`, and the commit subject stay yours. When a
hotfix is pending in the lane and the roster has no `live` Hosa row, add to
your line to the human a suggestion to open one (`/tanto hosa`), in the
shape of the Kikaku suggestion in "Start"; a report in the inbox is no
reason for it, since a report pends nothing.

So that hotfixes reach `docs/` once, carry them forward: when you create a new
topic's ledger, copy the hotfix lines recorded in the roster's Events since the
previous plan into the ledger's "Hotfixes since the previous plan" line, and at
T2 name that line in the direction so the dogfood report carries them.

A fix to a file the in-flight plan rewrites takes one of three paths. If a task
that rewrites the file is still ahead and Keikaku is still live, it is a
cold-read question to Keikaku, which edits the plan's fenced block so that the
task delivers the fix. If every rewriting task has run and only the final batch
remains, the fix joins the whole-branch review's single fix wave. If neither
holds, it waits for the close as an inbox copy you write from the human's
words in your window.

### Reporting from the other side

You are also a reporter: a Kanri in another repository is where a defect in
this repository's skills is often noticed. On the human's request, write the
report from `templates/bug-report.md` at
`.tanto/sent/<YYYY-MM-DD>-<slug>.md` under your own `.tanto/`; read the
intake's bare name — the `<name>` before the bracket of the `Name [ref]`
column — from `<target workspace>/.tanto/roster.md`, the row whose Role is
`hosa` and whose Status begins with `live`, or the first data row when there
is none,
asking the human for the workspace's path if you do not know it, and
expecting, outside auto mode, a harness permission prompt in your window
for a read outside your working directory; check that the name is in
`ListAgents`, and ask the human for the address when it is not, or when
that roster is absent; send `bug-report: <absolute path>` to that bare
name. The sent copy is the record of the send, and it is kept.
```

- [ ] **Step 2: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 14`

Expected: `task 14: verify clean`.

- [ ] **Step 3: Check that `### Limits` still follows the section**

```bash
grep -n '^#\{2,3\} ' skills/tanto/roles/kanri.md | grep -A1 'Reporting from the other side'
```

Expected: the "Reporting from the other side" line, then `### Limits`, with nothing between them.

- [ ] **Step 4: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: every hook passes.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md
```

Subject: `docs(tanto): Kanri is the intake only while no Hosa is live, and its act reads nothing`. End the message with your own `Co-Authored-By:` trailer.

### Task 15: The sender side — `SKILL.md`'s Messages and `roles/kaiseki.md`

**Files:**

- Modify: `skills/tanto/SKILL.md` (L680-700)
- Modify: `skills/tanto/roles/kaiseki.md` (L33-41)

**Interfaces:**

- Consumes: Tasks 11 and 14, which gave the intake its act on both sides before any sender is told to address it.
- Produces: nothing a later task reads. This is the last text any other repository's session reads off the linked tree, which is why it lands last (spec section 9).

Spec sections 2.2 and 5. **Order within this batch matters**: Task 14 lands before this task, and Task 11 landed in batch D. Until this task's commit, a sender reading the linked tree still addresses the first roster row, which is Kanri, which by then already holds the new act.

**Named mechanisms this task touches.** The **live-Hosa-else-first-row address rule**: `roles/kanri.md` "Reporting from the other side" (Task 14), `roles/hosa.md` (Task 11), `templates/bug-report.md` (Task 12), and `SKILL.md`'s roster Readers cell (Task 7) — five copies, and this is the one that defines it. The **`received:` answer**: Tasks 8, 9, 11, 14, 16. The **tracked-write rule**: stated in full here; applied in `roles/kanri.md`'s hotfix lane and Shoroku step 4 (Tasks 14, 5), in `skills/shoroku/SKILL.md`'s apply mode (Task 4), and in one sentence of `templates/bug-report.md` (Task 12). The **`Source: session <YYYY-MM-DD>` kind**, which `roles/kaiseki.md` now names for a standalone run's own shoroku: `skills/shoroku/SKILL.md` Step 3 (Task 4) is its other site, and `scripts/check_md_frontmatter.py` (Task 2) its pattern. The **`.tanto/sent/` path**: Tasks 7, 8, 9, 11, 12, 14.

**Old values this task must clear** — counts run against the live tree:

**O15.1** `A defect noticed in a skill goes to the Kanri` — `skills/tanto/SKILL.md` 1. Must be 0 after P15.1.

**O15.2** `Kanri is the intake` — `skills/tanto/SKILL.md` 1. Must be 0 after P15.1.

**O15.3** `Kanri answers a bug report with one line, in one of five forms:` — `skills/tanto/SKILL.md` 1, the paragraph the five `triage:` forms hang off. Must be 0 after P15.1.

**O15.4** `the sender reads the first data` — `skills/tanto/SKILL.md` 1. Must be 0 after P15.1.

**O15.5** `column — from the first data row of that` — `skills/tanto/roles/kaiseki.md` 1. Must be 0 after P15.2. Its twin in `roles/kanri.md` is O14.8's.

`read the intake's bare name — the` is O14.9's; this task clears its second site.

**A15.1** `skills/tanto/SKILL.md` — `grep -c 'triage:' skills/tanto/SKILL.md` — before: 3, after: 0

**A15.2** `skills/tanto/SKILL.md` — `grep -cF 'received: <inbox path>' skills/tanto/SKILL.md` — before: 0, after: 1

- [ ] **Step 1: Replace the contract's two bug-report paragraphs**

**P15.1** `skills/tanto/SKILL.md` — replace exactly these 21 lines

```text
A defect noticed in a skill goes to the Kanri of the repository that ships that
skill, as a **bug report**: a file written from `templates/bug-report.md` and
one line, `bug-report: <absolute path>`. Kanri is the intake, and its address
is read from the target workspace's roster: the sender reads the first data
row of `<workspace>/.tanto/roster.md` and takes the bare `<name>` before the
bracket of its `Name [ref]` column, the human supplying the workspace's path
where the sender does not know it; the sender checks that name against
`ListAgents` before sending, and asks the human for the address when the
roster is absent — a workspace not yet migrated, or an older skill — or the
name is not listed, since a resumed Kanri carries a new name until it
rewrites its row. The roster is Kanri's to write and the sender's only to
read; the read is of a file outside the sender's own working directory, and
outside auto mode the harness may put a permission prompt for it in the
sender's window — the harness's own prompt, like the model-mismatch stop, and
not a failure of the route. A defect that surfaces in a spec dialogue reaches
Kanri as an `I-n` in `spec-inputs.md`, not as a bug report.

Kanri answers a bug report with one line, in one of five forms:
`triage: issue-<id>`, `triage: redirect — <one line>`,
`triage: kaiseki requested`, `triage: hotfix — <commit subject>`, and
`triage: relayed as I-<n>`.
```

**P15.1 →**

```text
A defect noticed in a skill goes to the repository that ships that skill, as
a **bug report**: a file written from `templates/bug-report.md` at
`.tanto/sent/<YYYY-MM-DD>-<slug>.md` under the reporter's own repository, and
one line, `bug-report: <absolute path>`. Any session may write and send one;
when the human noticed the defect, they hand it to a live Hosa as a chore, or
say it in Kanri's window. **The intake is the target repository's `live`
Hosa, else its Kanri**: the sender reads `<workspace>/.tanto/roster.md`,
takes the bare `<name>` before the bracket of the `Name [ref]` column of the
row whose Role is `hosa` and whose Status begins with `live` — Kanri writes
`idle since <HH:MM>` into that cell while a Hosa idles — or, when there is
none, of the first data row, the human supplying the workspace's path where the sender
does not know it; checks that name against `ListAgents`; and asks the human
for the address when the roster is absent — a workspace not yet migrated, or
an older skill — or the name is not listed, since a resumed session carries a
new name until it rewrites its row. The roster is Kanri's to write and the
sender's only to read; the read is of a file outside the sender's own working
directory, and outside auto mode the harness may put a permission prompt for
it in the sender's window — the harness's own prompt, like the model-mismatch
stop, and not a failure of the route. A defect that surfaces in a spec
dialogue reaches Kanri as an `I-n` in `spec-inputs.md`, not as a bug report.

The intake answers with one line, `received: <inbox path>`, after one act
that reads nothing of the report: the file is copied to
`.tanto/inbox/<YYYY-MM-DD>-<slug>.md` under the same basename, and one line
is appended under its `## Received` heading. No triage, no ruling, no filing,
no Events line: a report pends nothing until a **close**, where the
recommender reads every untriaged inbox copy beside the proposal items
("Session exit"). A fix the human wants sooner is the hotfix lane, opened by
the human's word in Kanri's window, never by a report.

**The tracked-write rule.** A tracked file or a commit message names a
report's source as `inbox <YYYY-MM-DD>-<slug>` and nothing more — no
repository name or path, no session name, no topic name of the reporter's,
no quotation of the reporter repository's own documents; what a reproduction
needs is restated against this repository's files or an inline fixture. It
binds the issue filed at the close and its `Source:` line, the close's two
commits, the hotfix lane's commit, the dogfood report, and any ADR. The
template drops the identifying fields at the source, so that what is not in
the file cannot be leaked by the subagent that writes the issue; the rule
stands second.
```

- [ ] **Step 2: Replace the standalone Kaiseki's reporter clause**

**P15.2** `skills/tanto/roles/kaiseki.md` — replace exactly these 9 lines

```text
there is no Kanri to rule for you. And when the human asks for a defect to be
reported to another repository, write the report from
`templates/bug-report.md`, read the intake's bare name — the `<name>` before
the bracket of the `Name [ref]` column — from the first data row of that
repository's `.tanto/roster.md`, the human giving you the workspace's path,
check the name against `ListAgents`, and send `bug-report: <absolute path>`
to it; when that roster is absent or the name is not listed, ask the human
for the address, and a report you still cannot send stays a file the human
carries.
```

**P15.2 →**

```text
there is no Kanri to rule for you. And when the human asks for a defect to be
reported to another repository, write the report from
`templates/bug-report.md` at `.tanto/sent/<YYYY-MM-DD>-<slug>.md`, read the
intake's bare name — the `<name>` before
the bracket of the `Name [ref]` column — from that
repository's `.tanto/roster.md`, the row whose Role is
`hosa` and whose Status begins with `live`, or the first data row when there
is none, the
human giving you the
workspace's path,
check the name against `ListAgents`, and send `bug-report: <absolute path>`
to it; when that roster is absent or the name is not listed, ask the human
for the address, and a report you still cannot send stays a file the human
carries. An issue your own shoroku run files opens with
`Source: session <YYYY-MM-DD>`, as the `shoroku` skill's session mode
writes it.
```

- [ ] **Step 3: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 15`

Expected: `task 15: verify clean`.

- [ ] **Step 4: Run the spec's whole Verification block**

Every command in "How a batch is verified" section 4 now holds. Run them all and record each output; a value that differs is a defect in this task or an earlier one, not in the expectation.

- [ ] **Step 5: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/roles/kaiseki.md
```

Expected: every hook passes.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/SKILL.md skills/tanto/roles/kaiseki.md
```

Subject: `docs(tanto): a report goes to the cheapest live seat and is answered received:`. End the message with your own `Co-Authored-By:` trailer.

### Task 16: `docs/notes/tanto-consistency-checks.md` — the checks this plan moved

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md` (L605-607, L684-692, L1118, after L1121, L1122, L1125, L1130-1134, L1157, L1161-1166, L1168-1169, L1175-1176)

**Interfaces:**

- Consumes: every earlier task — the counts below are only true once Tasks 4 through 15 have landed.
- Produces: the checks Task 17 re-runs and records in the dogfood report.

Spec section 8.3, plus checks 18 and 19, which the spec's 8.3 does not name but which this plan breaks — see Self-Review flag 3. The note's prose around L620 ("the bug-report line — each copy once") stands, and so does L778's four-copies paragraph: `bug-report: <absolute path>` still has exactly four copies after this plan, in the same four files.

**Named mechanisms this task touches.** The **`received:` answer** and the **`sweep:` line**, which replace the five `triage:` forms as the route's pinned strings: `SKILL.md` (Tasks 8, 15), `roles/kanri.md` (Tasks 9, 14), `roles/hosa.md` (Tasks 6, 11), and — for the sweep — `SKILL.md` Session exit (Task 7) and `roles/kanri.md` Delegation to Hosa (Task 5). The **`Recommended fix` group** and the **five `##` headings**: Tasks 4, 5, 6, 7. A check pinned per copy must name every file that carries the string, or the copy it does not name drifts (the note's own L778 rule).

**Old values this task must clear** — counts run against the live tree:

**O16.1** `The five triage answers, each exactly once in the contract:` — `docs/notes/tanto-consistency-checks.md` 1. Must be 0 after P16.1.

**O16.2** `the three group sections carry the concrete tag` — `docs/notes/tanto-consistency-checks.md` 1, check 19's explanation of its third count. Must be 0 after P16.10.

`[adopt | reject | unsure]` is O4.9's; this task clears its second and last site, at L1157.

**A16.1** `docs/notes/tanto-consistency-checks.md` — `grep -c 'Recommended fix' docs/notes/tanto-consistency-checks.md` — before: 0, after: 4

**A16.2** `skills/tanto/SKILL.md` — `grep -cF 'bug-report:' skills/tanto/SKILL.md` — before: 1, after: 2

**A16.3** `skills/tanto/SKILL.md` — `grep -cF 'bug-report: <absolute path>' skills/tanto/SKILL.md` — before: 1, after: 1

**A16.4** `skills/tanto/templates/bug-report.md` — `grep -cF 'bug-report: <absolute path>' skills/tanto/templates/bug-report.md` — before: 1, after: 1

A16.3 and A16.4 are why the note's L594-595 are **not** edited: the spec asked for their "new values", and the new values, measured against this plan's own new texts, are the old ones — `SKILL.md`'s new Messages paragraph and the new `templates/bug-report.md` each name `bug-report: <absolute path>` exactly once, as the old ones did. A16.2 is the one that **did** move: the bare `bug-report:` count in `SKILL.md` goes from `1` to `2`, because Task 7's new `.tanto/sent/` Artifacts row names the line a second time. P16.2 carries that value into the note's expectation list, whose eighth number is that count.

- [ ] **Step 1: Replace the five-`triage:` check, and the one count of check 8 that moved**

**P16.1** `docs/notes/tanto-consistency-checks.md` — replace exactly these 9 lines

````text
The five triage answers, each exactly once in the contract:

```bash
for s in 'triage: issue-<id>' 'triage: redirect — <one line>' 'triage: kaiseki requested' 'triage: hotfix — <commit subject>' 'triage: relayed as I-<n>'; do
  printf '%s -> %s\n' "$s" "$(grep -cF "$s" skills/tanto/SKILL.md)"
done
```

Expected: five lines, each ending `-> 1`.
````

**P16.1 →**

````text
The intake's one answer and the sweep's one line, each exactly once in the
three files that carry them:

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md; do
  printf '%s -> %s %s\n' "$f" "$(grep -cF 'received: <inbox path>' "$f")" "$(grep -cF 'sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' "$f")"
done
```

Expected: three lines, each ending `-> 1 1`. The five `triage:` answers this
check pinned until 2026-09-19 no longer exist: `bug-report-hold` replaced the
five-way triage on arrival with one receipt and a decision at the close.
````

The old block runs to the expectation line because `Expected: five lines, each ending `-> 1`.` occurs twice in this note — the check below it has the same shape — and a one-line block would match both.

**P16.2** `docs/notes/tanto-consistency-checks.md` — replace exactly these 3 lines

```text
Expected, one number per line, in order: `2`, `1`, `1`, `4`, `1`, `1`, `1`,
`1`, `2`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `4`, `1`, `1`, `1`,
`1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`. The ninth is `2` because
```

**P16.2 →**

```text
Expected, one number per line, in order: `2`, `1`, `1`, `4`, `1`, `1`, `1`,
`2`, `2`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `4`, `1`, `1`, `1`,
`1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`. The eighth moved from `1`
to `2` when `bug-report-hold` added the `.tanto/sent/` row to the Artifacts
table, whose Readers cell names the `bug-report:` line a second time. The
ninth is `2` because
```

- [ ] **Step 2: Re-pin check 18, the recommendation's headings**

**P16.3** `docs/notes/tanto-consistency-checks.md` — replace exactly these 1 lines

```text
grep -cF '`## Recommended adopt`, `## Recommended reject`, `## Unsure`' skills/shoroku/SKILL.md
```

**P16.3 →**

```text
grep -cF '`## Recommended adopt`, `## Recommended fix`, `## Recommended reject`,' skills/shoroku/SKILL.md
```

The needle stops at the third heading's comma because the enumeration now wraps in `skills/shoroku/SKILL.md` after it; a needle carrying `## Unsure` would span the line break and count `0`.

**P16.4** `docs/notes/tanto-consistency-checks.md` — insert after these 1 lines

```text
grep -cF '## Unsure' skills/tanto/templates/shoroku-brief.md
```

**P16.4 →**

```text
grep -c '^## Recommended fix$' skills/tanto/templates/shoroku-brief.md
```

**P16.5** `docs/notes/tanto-consistency-checks.md` — replace exactly these 1 lines

```text
grep -cF 'Recommended adopt, Recommended reject, Unsure' skills/tanto/SKILL.md
```

**P16.5 →**

```text
grep -cF 'Recommended adopt, Recommended fix, Recommended reject, Unsure' skills/tanto/SKILL.md
```

**P16.6** `docs/notes/tanto-consistency-checks.md` — replace exactly these 1 lines

```text
grep -rciF 'recommended adopt, recommended reject' skills/tanto/SKILL.md skills/tanto/templates/kanri.md skills/shoroku/SKILL.md
```

**P16.6 →**

```text
grep -rciF 'recommended adopt, recommended fix' skills/tanto/SKILL.md skills/tanto/templates/kanri.md skills/shoroku/SKILL.md
```

**P16.7** `docs/notes/tanto-consistency-checks.md` — replace exactly these 5 lines

```text
Expected: `1 1 1 1 1 1 0`, then the two case-insensitive counts equal to the
case-sensitive ones above them — `1` summed over the three files, and `1` — a
lowercase spelling anywhere being the drift issue-e916 named; and `0`, the
contract's lowercase read of "Session exit" being gone. The fifth and seventh
counts moved from `2` and `1` during `shoroku-at-close`: Task 2 ("an exit
```

**P16.7 →**

```text
Expected: `1 1 1 1 1 1 1 0`, then the two case-insensitive counts equal to the
case-sensitive ones above them — `1` summed over the three files, and `1` — a
lowercase spelling anywhere being the drift issue-e916 named; and `0`, the
contract's lowercase read of "Session exit" being gone. The fifth line is
`bug-report-hold`'s own addition, the brief's fourth group. The sixth and
eighth
counts moved from `2` and `1` during `shoroku-at-close`: Task 2 ("an exit
```

- [ ] **Step 3: Re-pin check 19, the brief's form markers**

**P16.8** `docs/notes/tanto-consistency-checks.md` — replace exactly these 1 lines

```text
grep -cF '[adopt | reject | unsure]' skills/tanto/templates/shoroku-brief.md
```

**P16.8 →**

```text
grep -cF '[adopt | fix | reject | unsure]' skills/tanto/templates/shoroku-brief.md
```

**P16.9** `docs/notes/tanto-consistency-checks.md` — replace exactly these 6 lines

````text
grep -cF "See: <the item's heading text, without its ### marker>" skills/tanto/templates/shoroku-brief.md
```

Expected: `1`, a non-zero count, `1`, then non-zero on the three citations, then
`4` — the template exists, carries its markers, and is named where it is copied
from, which is check 3's rule for every other template. The tag line's
````

**P16.9 →**

````text
grep -cF "See: <the item's heading text, without its ### marker>" skills/tanto/templates/shoroku-brief.md
grep -c '^## ' skills/tanto/templates/shoroku-brief.md
grep -c '^## Recommended fix$' skills/tanto/templates/shoroku-brief.md
```

Expected: `1`, a non-zero count, `1`, then non-zero on the three citations, then
`5`, `5`, and `1` — the template exists, carries its markers, and is named
where it is copied
from, which is check 3's rule for every other template. The tag line's
````

**P16.10** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
the three group sections carry the concrete tag instead, which is why the third
count is `1` and not `3`.
```

**P16.10 →**

```text
the four group sections carry the concrete tag instead, which is why the third
count is `1` and not `4`.
```

**P16.11** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
fixed. Four occurrences: the shape line under `## How to answer`, and one per
group section.
```

**P16.11 →**

```text
fixed. Five occurrences: the shape line under `## How to answer`, and one per
group section, of which there are now four.
```

- [ ] **Step 4: Run the three edited checks and record their output**

Run the `bash` block of the intake check, check 18, and check 19 exactly as the note now writes them, and record each printed value beside the note's stated expectation. A value that differs is a defect in an earlier task, not in the expectation — fix the task's file, not this note.

- [ ] **Step 5: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 16`

Expected: `task 16: verify clean`.

- [ ] **Step 6: Lint the changed path**

```bash
./scripts/lint.sh docs/notes/tanto-consistency-checks.md
```

Expected: every hook passes.

- [ ] **Step 7: Commit**

```bash
git commit --only docs/notes/tanto-consistency-checks.md
```

Subject: `docs(notes): pin the receipt, the sweep, and the brief's fifth heading`. End the message with your own `Co-Authored-By:` trailer.

### Task 17: The final sweep and the dogfood report

**Files:**

- Create, untracked: `.tanto/bug-report-hold/old-value-sweep.md`
- Create: `docs/reports/2026-09-19-bug-report-hold-dogfood.md` — rename the date prefix to the day it is actually written, per `docs/reports/AGENTS.md`

**Interfaces:**

- Consumes: every task. This one edits no skill file.
- Produces: the recorded evidence the close reads.

This task has **two halves and one file deliverable**. The first half is a sweep-and-check — its output is a record, not an edit — and is flagged as such in Self-Review.

**Named mechanisms this task touches.** None: it introduces nothing and changes no file the other tasks name. It *sweeps* every mechanism this plan renamed, which is the point.

**Old values this task must clear** — this task declares the two needles whose last sites are reached by no passage of this plan, so that `replay`'s residual sweep has them on record:

**O17.1** `the three counts` — 3 in the tree this plan touches, measured by replaying the plan: `skills/tanto/SKILL.md` 1 (its Session exit Check step), `skills/tanto/roles/kanri.md` 1 (its Shoroku Check step), and `skills/tanto/templates/kanri.md` 1 (the ledger's own Check line). **It may stay**, and after this plan it is wrong by one at all three: the brief now has four item groups, so a human reading any of the three sentences counts four. The spec's own passages do not reach them and its Old-values table does not list the string — see Self-Review flag 2. Record all three hits and this disposition in the sweep output; do not edit any of the three files here.

One further string of the spec's table, `a Kanri in another repository is where`, **stays** — `skills/tanto/roles/kanri.md` 1, and spec 3.6's new text keeps the sentence deliberately. It is not declared as an `O` block, because the plan's own new text carries it and `lint` forbids that; the sweep output records the hit and this sentence is its disposition.

- [ ] **Step 1: Sweep the spec's "Old values this plan contradicts" table**

The spec's own table was written against newline-folded copies, so the sweep runs the same way: fold each file's newlines to single spaces on a **copy**, never on the file.

```bash
mkdir -p /c/Temp/claude/fold && rm -f /c/Temp/claude/fold/* && for f in skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md skills/tanto/templates/*.md skills/shoroku/SKILL.md skills/shoroku/README.md; do tr -d '\r' < "$f" | tr '\n' ' ' | tr -s ' ' > "/c/Temp/claude/fold/$(echo "$f" | tr '/' '_')"; done && ls /c/Temp/claude/fold | wc -l
```

Expected: `24`.

Then run every needle of the spec's table against those copies, one at a time, and record the **raw count and the disposition of each hit** — not one verdict:

```bash
cd /c/Temp/claude/fold && while IFS= read -r s; do [ -z "$s" ] && continue; out=""; for f in *; do n=$(grep -oF "$s" "$f" | wc -l); [ "$n" -gt 0 ] && out="$out $f=$n"; done; printf '%s ->%s\n' "$s" "${out:- NONE}"; done < /c/Temp/claude/needles.txt
```

`/c/Temp/claude/needles.txt` does not exist yet — write it as the first action of this step, one needle per line, the whole left-hand column of the spec's "Old values this plan contradicts" table: `triage: issue-<id>`, `triage: redirect`, `triage: kaiseki requested`, `triage: hotfix`, `triage: relayed as I-<n>`, `triage:`, `Triage — five outcomes`, `Each triage is a ruling of yours`, `Triage any bug report that arrived during the batch`, `a bug-report triage`, `a triage's observation`, `the intake's filings`, `bug intake's issue filings`, `Kanri's filings`, `Kanri is the intake`, `first data row of `<workspace>/.tanto/roster.md``, `from the first data row of that repository's`, `its body names where the report came from`, `Every receipt and every send is one line in the roster's Events`, `a bug report received, or sent to`, `a bug report triaged and its outcome`, `in three groups`, `three groups`, `the four headings`, `four `##` headings`, `grep -c '^## '` on the brief is `4``, `[adopt | reject | unsure]`, `is grouped `Recommended reject`, with the correction`, `is recommended `reject`, with the correction written out in the reason`, `Sekkei, Keikaku, Jisso, or Kaiseki. A message whose first line is`, `1. One boss: only Kanri messages Jisso.`, `directions, the bug intake, the create requests, and the `release:` lines;`, `Repository — <path or name>`, `## Reporter`, `absolute path of the reporter's repository`, `The intake Kanri copies it`, `Kanri fills it in the inbox copy`, `hotfix, or relay`, `triages it into an issue`, `marked adopt, reject, or unsure`, and the two this task rules on above: `the three counts` (declared as `O17.1`) and `a Kanri in another repository is where` (deliberately **not** declared as an `O` block, since the plan's own new text carries it and `lint` forbids declaring your own new text as an old value to clear).

Expected: `NONE` on every needle but `Kanri's filings` (1 hit — `skills/tanto/SKILL.md`, the spec's own "kept" disposition: the new Hosa row keeps the phrase after "the bug intake"), `the three counts` (3 hits), and `a Kanri in another repository is where` (1 hit) — the last two ruled on above. The scripts are **not** swept: their tests carry old strings as fixtures.

- [ ] **Step 2: Write the sweep's output**

Write `.tanto/bug-report-hold/old-value-sweep.md`: the two commands, their full output, and one line per hit saying which `O` block rules on it and how. The file is untracked under `.tanto/.gitignore`; it is the record a human eye reads before this batch is accepted.

- [ ] **Step 3: Re-run the whole Verification section against the landed tree**

Run every command in "How a batch is verified" sections 4, 5 and 6 one more time, and the three edited checks from Task 16 Step 4. Record every value.

- [ ] **Step 4: Write the dogfood report**

Write `docs/reports/2026-09-19-bug-report-hold-dogfood.md` following `docs/reports/AGENTS.md` — a frozen, dated investigation. Its **Measurements** section is a bullet list, and these bullets are required:

- **The retrofit's four kinds.** The counts Task 1 Step 2 printed: how many issues under `open/` and `deferred/` took `inbox`, how many `shoroku`, how many `hotfix`, how many `session`, and the total, which must be `234` unless the tree changed between drafting and the run. Name the expected `inbox` figure, about `15`, and say whether the run matched it.
- **The inbox's untriaged count before the first close under the new text.** Run `grep -L 'Outcome — \(issue\|fix\|redirect\|kaiseki\|relay\|dismissed\)' .tanto/inbox/*.md | wc -l` before that close and record the number, beside the `60` copies and `49`-untriaged figures the spec measured on 2026-09-19.
- **The same count after that close**, and the difference.
- **How many of that close's items went `fix`** — the count of accepted `Recommended fix` items, and whether the second commit, `fix: text corrections from <topic>'s close`, exists. It exists if and only if the direction accepted one.
- **The consistency note's edited checks**, each with its printed value beside its stated expectation: the intake check's three `-> 1 1` lines, check 18's eight counts, check 19's seven.
- **The `bug-report:` counts that did not move.** A16.2 to A16.4 measured `1`, `1`, `1` before and after; record that the note's L578 and L594-595 were deliberately not edited and why.

The first three and the fourth bullet are measurements of the **first close under the new text**, which is this plan's own close. Write the report with the bullets present and the close's own numbers filled in at that close; a bullet whose number is not yet knowable says so in one clause and names when it will be.

The report names no reporter's repository, no session of one, and no topic of one — the tracked-write rule (Global Constraints) binds this file too.

- [ ] **Step 5: Verify**

Run: `node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-19-bug-report-hold.md --task 17`

Expected: `task 17: no passages` — this task declares only `O` needles and no `P` block, and `verify` does not check `O` needles; Step 1's sweep output, read by eye with a disposition per hit, is what actually verifies this task's first half, and Step 6's real YAML load verifies the new report.

- [ ] **Step 6: Load the new report's frontmatter for real**

```bash
uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py docs/reports/2026-09-19-bug-report-hold-dogfood.md
```

Expected: exit `0`, nothing printed. The file is not under `docs/issues/`, so Task 2's `Source:` check does not bind it; this run tests the YAML alone.

- [ ] **Step 7: Lint and commit**

```bash
./scripts/lint.sh docs/reports/2026-09-19-bug-report-hold-dogfood.md
git add docs/reports/2026-09-19-bug-report-hold-dogfood.md
git commit --only docs/reports/2026-09-19-bug-report-hold-dogfood.md
```

Subject: `docs(reports): the bug-report-hold dogfood report`. End the message with your own `Co-Authored-By:` trailer.

- [ ] **Step 8: Restore the new file's line endings**

A Markdown file created on this host lands `w/lf` every time; the commit normalized it, so check it back out from the index.

```bash
git checkout -- docs/reports/2026-09-19-bug-report-hold-dogfood.md
git status --porcelain docs/reports/
```

Expected: nothing printed.

---

## Self-Review

**Largest task.** Measured with `frame --stage 2`, by the line count of the task's step section:

| Task | Lines | Steps | What makes it large |
| --- | --- | --- | --- |
| 4 | 256 | 7 | eleven `P` blocks and two `A` blocks across three files |
| 14 | 252 | 5 | one `P` block — 115 old lines and 95 new, the section replaced whole |
| 1 | 245 | 8 | the retrofit script, carried in full as one fenced block |
| 5 | 232 | 5 | six `P` blocks, two of them 33 new lines each |
| 16 | 221 | 7 | eleven `P` blocks, four of them inside four-backtick fences |
| 2 | 220 | 8 | four `P` blocks and a 73-line `W` block |

The smallest are Task 13 (44 lines, 4 steps) and Task 11 (80 lines, 5 steps). **No task exceeds 8 steps.** Task 4 is the one to watch if a batch needs splitting further on the day: its three files are independent of each other, and it divides cleanly into `skills/shoroku/` and the brief template. Task 14 cannot be split — it is one block by construction.

**Sweep-and-check shape.** **Task 17** qualifies, in its first half: Steps 1 to 3 produce recorded output rather than an edit, which inverts a reviewer's standing instruction — there is no diff to read, only numbers to check against the spec. Its second half does deliver a file, the dogfood report, so the task is not verification-only end to end; a reviewer should read the sweep output as evidence and the report as the deliverable. Step 4 of Task 15 is the same shape inside an editing task and is named there so its reviewer does not skip it. No other task's deliverable is output rather than a file.

**Spec coverage.** Every section of the spec maps to a task: 2.1/2.3/2.6/2.7 → Task 8; 2.2 → Task 15; 2.4/2.5 → Task 7; 3.1/3.2/3.3/3.8 → Task 9; 3.4/3.5 → Task 5; 3.6 → Task 14; 3.7 → the grep in Task 14's `O` blocks and Task 17's sweep; 4.1/4.5 → Task 11; 4.2/4.3/4.4/4.6 → Task 6; 5 → Task 15; 6.1-6.4 → Task 4; 6.5 → Task 4; 7.1 → Task 12; 7.2 → Task 4; 7.3/7.4 → Task 10; 8.1 → Task 2; 8.2 → Task 1; 8.3 → Task 16; 8.4 → Task 3; 8.5 → Task 13; section 9 → Global Constraints and the Batches table. The spec's Out-of-scope list is respected: no task renumbers the batch loop, touches `docs/issues/AGENTS.md`, adds a user-home-path hook, writes a reply beyond `received:`, edits `docs/design/4807-tanto.md`, or writes a consistency script.

**Four facts that did not match expectation**, each measured rather than assumed:

1. **The spec's needle list is folded; `replay`'s is not.** `passage-check.js` counts `O` needles by splitting the raw concatenated text of every path the plan writes, so a needle that wraps in its target returns `0` and reads as "already gone". Nine of the spec's table entries wrap on disk. Every `O` block in this plan is therefore a **single-line** form taken from the live file, and the folded forms survive only in Task 17's sweep, which folds copies exactly as the spec says. Where a needle differs from the spec's wording, that is why.
2. **`the three counts` is wrong after this plan at three sites, and the spec does not fix it.** `skills/tanto/SKILL.md`'s Session exit Check step, `roles/kanri.md`'s Shoroku Check step, and `templates/kanri.md`'s ledger Check line all tell the reader to give the human "the three counts" of the brief. With a fourth item group there are four. The spec's passages do not reach any of the three sentences and its Old-values table does not list the string, so **no task here edits it**: O17.1 records the three hits and their disposition instead — the count was measured by replaying the plan, not estimated — and the close's recommender is the right place for a one-sentence `fix`. Flagged so that a reviewer does not read it as an oversight of this plan's.
3. **The consistency note's checks 18 and 19 break, and spec 8.3 does not name them.** Check 18's first, fifth and seventh needles and check 19's third and seventh all go to `0` or to a different number once the fourth group exists. Task 16 repairs them with measured values (P16.3 to P16.11) beyond what spec 8.3 asked for. The repair is derived, not invented: each new expectation was computed from this plan's own new texts, and Task 16 Step 4 runs them.
4. **Two of the three `bug-report:` counts the spec asked to re-value did not move; the third moved for a reason the spec does not give.** Spec 8.3 says the note's L578 and L594-595 "take their new values". Measured against this plan's new texts, L594-595 stay `1` and `1` — `SKILL.md`'s new Messages paragraph and the new `templates/bug-report.md` each name `bug-report: <absolute path>` once, as the old ones did — so no passage edits them. L578's bare `bug-report:` count in `SKILL.md` goes from `1` to `2`, not because Messages changed but because Task 7 adds a `.tanto/sent/` row to the Artifacts table whose Readers cell names the line again. P16.2 carries that into the note's expectation list and says why. A16.2 to A16.4 state all three before-and-after values; the first was measured by replaying the plan, not assumed.

**Placeholder scan.** No task says "TBD", "similar to Task N", "add appropriate error handling", or "write tests for the above". Every code step carries its code; the retrofit script and the test file are complete and runnable. Two values are genuinely run-dependent and say so in the step that produces them: the retrofit's five printed counts (Task 1 Step 2) and the dogfood report's close measurements (Task 17 Step 4). The dogfood report's date prefix is `2026-09-19` and the task says to rename it to the day it is written.

**Type and name consistency.** `SOURCE_RE`, `SOURCE_HINT` and `_is_checked_issue` are defined in Task 2's P2.3 and used in P2.4 and in W2.1's import, with the same spelling in all three. `check(path)` keeps its `tuple[list[str], bool]` return, which W2.1 asserts against. The `sweep:` line is byte-identical in Tasks 5, 6, 7 and 16 — one string, four copies, and A5.1, A6.1 and the note's own check count it per file. `received: <inbox path>` is byte-identical in Tasks 11, 14, 15 and 16, counted by A11.1, A14.2, A15.2 and the note's check. `fix: text corrections from <topic>'s close` is spelled the same in Tasks 5, 6 and 7; the sweep's variant, `fix: text corrections from the inbox sweep <YYYY-MM-DD>`, in Tasks 5, 6 and 7 too. The six Triage outcome words appear in the same order — `issue`, `fix`, `redirect`, `kaiseki`, `relay`, `dismissed` — in Tasks 1, 4, 5, 6, 12 and 14.

**Reports and prompts** follow the tanto templates; this plan carries no skeleton for either.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-19-bug-report-hold.md`. Two execution options:

1. **Subagent-Driven (recommended)** — a fresh subagent per task, review between tasks, fast iteration. Under tanto this is the Jisso's SDD loop, one batch per session, with `task.implement` on sonnet/high and `task.escalate` on opus/high as Global Constraints pins them.
2. **Inline Execution** — execute the tasks in one session with checkpoints at the batch boundaries.

Which approach?
