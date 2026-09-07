# tanto boundary-rules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change `skills/tanto/` and one note under `docs/notes/` so that a due
Kanri handover waits for what its session still owns, Kanri derives the topic
word instead of asking the human for it, and a plan that edits this skill's own
files states where authority lives while the files are in motion and names the
boundary from which a role may be started or replaced.

**Architecture:** Markdown only, and every edit is a **passage**, never a file.
For each of the twelve passages the task carries three fenced blocks — the
anchor line, the old passage verbatim from the tree, the new passage verbatim
from the spec — and changes no other byte, so the diff of a touched file
against the merge base is exactly the union of its passages written so far.
`SKILL.md` carries the term two or more roles route on (rule 11); each
obligation lives in the file of the role that performs it (`roles/kanri.md`,
`roles/sekkei.md`); `templates/kanri-handover.md` gains one line; the
consistency note gains the paragraph that tells a future passage-level plan how
its pass differs. There is no executable code: verification is fixed-string
greps on the tree, the per-file merge-base diff, and lint on named paths.

**Tech Stack:** Markdown; `pre-commit` through `scripts/lint.sh` and
`scripts\lint.bat`; `git diff`, `git ls-files --eol`, `grep -cF` and `grep -nF`
with every needle set from a quoted heredoc; `uv run --no-project python` for
the frontmatter and JSON parses the consistency note's check 8 runs.

**Spec:** `docs/superpowers/specs/2026-09-07-boundary-rules-design.md` — the
binding authority. This plan argues from it; where the plan and the spec
disagree, the spec wins. Executors read both. The spec's sections "Where each
change lives", "What the plan must contain", and "Verification" are what the
tasks below implement.

## Global Constraints

- American English in every file, commit message, and comment.
- Every fenced `bash` block in this plan runs in **Git Bash**, from the repository root — on this Windows host, not PowerShell. Only the lint line has a `scripts\lint.bat` alternative; the greps, the `tr` pipelines, and the quoted heredocs have none.
- Lint before every commit: `./scripts/lint.sh <explicit file paths>` (Windows: `scripts\lint.bat <paths>`), every hook `Passed` or `Skipped`; a directory argument makes every hook skip, so always name files.
- Commit by explicit path only: `git add <paths>` then `git commit --only <paths> -m "<subject>" -m "<body>" -m "Co-Authored-By: Claude <noreply@anthropic.com>"`. Never `git add -A` / `.` / `-u`, never a bare `git commit` or `git commit -a`, never `--no-verify`, never amend. Branch `boundary-rules`; **no worktree**; **no push**.
- Every commit message ends with a trailer whose line begins `Co-Authored-By: Claude` — verify with `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'` (expect `1`). The plan's commands write `Co-Authored-By: Claude <noreply@anthropic.com>`; a harness that puts its model name after `Claude` satisfies the same check.
- Models for this run: implementers `sonnet`, every reviewer `opus`, fix-round escalation `opus`; never dispatch a subagent on `fable`; every dispatch names its `model`.
- **The authority for this run's sessions** is this section, Kanri's orders line, and the batch prompts — not the role text on disk, which this plan edits under the sessions that read it (Kanri's R-3; contract rule 11 once Task 4 lands). **The batch A boundary is the boundary from which a role may be started or replaced**: batch A touches only Kanri's procedure and the handover template and references nothing batch B adds — a claim the rule-11 sweep in "How a batch is verified" decides at each boundary, not an assertion — so the tree is self-consistent at both boundaries. Before that boundary no role is replaced and no further role is created; this plan expects one Jisso throughout.
- **Never edit** — the spec's unchanged list: `skills/tanto/roles/jisso.md`, `skills/tanto/roles/kaiseki.md`, every template but `skills/tanto/templates/kanri-handover.md`, `skills/tanto/templates/tanto.json`, the repo-root `README.md` and every other repo-root Markdown, anything under `docs/requirements/`, `docs/design/`, `docs/decisions/`, or `docs/issues/`, linter or formatter config, agent instruction files (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`), and the superpowers plugin.
- **The write-out exception to that rule.** T1, T2, and every exit shoroku write under `docs/requirements/`, `docs/design/`, `docs/decisions/`, and `docs/issues/`. No task in this plan touches those paths, and "never edit" above does **not** forbid a session's own shoroku write-out.
- **The hotfix lane stays closed on the six files this plan lists** (decision-2f36), although the plan carries passages rather than complete files; a defect noticed in one of them during the run is a Rulings-needed item, not a hotfix.
- **The whole-branch review package excludes** exactly the commits whose subject begins with `docs: T<n> shoroku` or `docs: exit shoroku`, and the dispatch says so. Kanri's own `docs(issues):` commits on this branch — issues filed or triaged between plans and at boundaries under the hotfix lane, four of them before the plan was committed (a1c9 and its correction, e5a2, b7d3) — are outside the plan's scope; the dispatch lists them by subject from `git log --format=%s main..HEAD` and names them as such. Task 6's note commit is plan output and stays in the package.
- **Passages, not files.** A task replaces exactly the old passage with the new one, and the file's other bytes do not change. Each of the twelve passages is written once; a file may be touched in both batches (`skills/tanto/roles/kanri.md` is, in Tasks 1, 2, and 5), and the diff of a file against the merge base — `git diff "$(git merge-base main HEAD)" -- <file>`, which compares the working tree with the merge base and so is right both before and after a task's commit (`git diff main...HEAD` compares commits only and misses an uncommitted edit; measured in the plan's dry run) — is exactly its passages so far. No task makes a fix outside its passages: such a fix is a Rulings-needed item in the report, and the whole-branch review's fix wave is where a ruled correction lands.
- **Needles from heredocs.** Every anchor and passage check sets its needle with `needle=$(cat <<'EOF'` ... `EOF)` and passes it as `"$needle"`; a needle is never inlined in single or double quotes, because nearly every passage contains an apostrophe or a backtick.
- **Line endings per file, never mixed.** `skills/tanto/roles/kanri.md`, `skills/tanto/roles/sekkei.md`, and `docs/notes/tanto-consistency-checks.md` are checked out CRLF; `skills/tanto/SKILL.md`, `skills/tanto/README.md`, and `skills/tanto/templates/kanri-handover.md` LF (measured 2026-09-07 with `git ls-files --eol`). A passage is written with its file's ending, and after the edit `git ls-files --eol <file>` shows the same `w/crlf` or `w/lf` as before, never `w/mixed`. The index is LF throughout (`* text=auto`), so the "LF will be replaced by CRLF" warning at commit is not a defect.
- A task that edits `skills/tanto/SKILL.md` reviews `skills/tanto/README.md` for drift in the same task (repo rule from `AGENTS.md`).
- `skills/tanto/SKILL.md`'s frontmatter is unchanged — `name: tanto`, `argument-hint: kanri | sekkei | jisso | kaiseki`, and a `description` whose value contains **no colon followed by a space**; the `check-md-frontmatter` hook parses it, and Task 4 Step 8 loads it through PyYAML — `uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"` — expecting `['argument-hint', 'description', 'name']` then `ok`; the fallback for a host that cannot fetch PyYAML is named there, once.
- Markdown follows `.markdownlint-cli2.yaml`: `docs/superpowers/**` and `skills/**/templates/**` are markdownlint-ignored; `skills/tanto/SKILL.md`, `skills/tanto/README.md`, `skills/tanto/roles/*.md`, and `docs/notes/**` are **not**, so in those files every `<placeholder>` outside a fenced block lives in a code span, never bare.
- Runtime text inside the skill (`SKILL.md`, `roles/*.md`, `templates/*`) never names `skills/tanto/`; no new passage does — rule 11 says "the working tree's own copy". `skills/tanto/` appears only in this plan's own commands and in the note.
- No commit hashes and no user-specific paths in tracked content, decided by the note's check 7 — its commit-hash grep, read by eye, and its path greps.
- The skill's own wording says **multi-session orchestration**; "four" appears only where the current role set is listed. No passage changes either; check 7 counts them.

---

## File structure

Six files, twelve passages. Each passage's shape is the spec's, from "Where
each change lives": a **replacement** supersedes the old passage; an
**insertion** adds text next to an anchor that stays. The Ending column is the
working-tree line ending measured with `git ls-files --eol` on 2026-09-07; a
passage is written with its file's own ending and the file never becomes
`w/mixed`.

| File | Ending | Passages | Tasks |
| --- | --- | --- | --- |
| `skills/tanto/roles/kanri.md` | `w/crlf` | Start step 5 (replacement); the Kept Kanri case (replacement); Timing, two paragraphs after its first (insertion); the batch loop's step 6 (replacement); the batch loop's step 7 (replacement); The final batch step 2 (replacement); When the plan lands step 1 (insertion) | 1, 2, 5 |
| `skills/tanto/templates/kanri-handover.md` | `w/lf` | In flight, a fourth line after the Batch state line (insertion) | 3 |
| `skills/tanto/SKILL.md` | `w/lf` | Rules, item 11 after item 10 (insertion) | 4 |
| `skills/tanto/README.md` | `w/lf` | the closing sentence, three designs (replacement) | 4 |
| `skills/tanto/roles/sekkei.md` | `w/crlf` | Step 3, the third bullet's last line and a fourth bullet (replacement) | 5 |
| `docs/notes/tanto-consistency-checks.md` | `w/crlf` | the opening, one paragraph after the "Three moments" paragraph (insertion) | 6 |

Task 7 creates no file and edits none: it is the consistency pass, a
verification-only task whose deliverable is the recorded output of the checks
in `docs/notes/tanto-consistency-checks.md`.

`skills/tanto/roles/kanri.md` is touched in both batches. The invariant is per
passage, not per file: after each task, `git diff "$(git merge-base main HEAD)" -- <file>` shows
exactly the passages written so far.

---

### Task 1: `roles/kanri.md` — Start step 5 and the Kept Kanri case

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — two passages, both **replacements**:
  Start step 5, replaced whole; the Kept Kanri case under "The four cases",
  replaced whole.

**Interfaces:**

- Consumes: nothing from another task. The file as it stands on `main`.
- Produces: the derived-slug procedure. Task 2's step 6 sentence and Task 5's
  "When the plan lands" step 1 edit the same file at other passages and depend
  on nothing this task writes. No other file references this text.
- The file is checked out `w/crlf` and is **not** markdownlint-ignored, so every
  `<placeholder>` outside a fenced block lives inside a code span. Both new
  passages satisfy that: every angle-bracket blank in them is inside backticks.

**How every content check in this plan is run.** Nearly every passage carries an
apostrophe or a backtick, which break a single-quoted `grep -cF '...'` and
command-substitute inside a double-quoted one. So every needle is set from a
quoted heredoc and passed as `"$needle"`. The two forms, used unchanged in
every task below:

````bash
# raw, for a single anchor line — grep matches a substring, so a CRLF file needs no special handling
needle=$(cat <<'EOF'
<the anchor line, verbatim>
EOF
)
grep -cF -- "$needle" <file>

# flattened, for a passage that wraps over several lines
needle=$(cat <<'EOF'
<the passage, flattened to single spaces, on one line>
EOF
)
tr -d '\r' < <file> | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

- [ ] **Step 1: Verify the anchor of Start step 5, before the edit**

Anchor:

````markdown
5. Only when no plan is in flight — the bootstrap, a kept Kanri between plans,
````

Run:

````bash
needle=$(cat <<'EOF'
5. Only when no plan is in flight — the bootstrap, a kept Kanri between plans,
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 2: Verify the anchor of the Kept Kanri case, before the edit**

Anchor:

````markdown
Progress line says, or wait for the topic if none is open.
````

Run:

````bash
needle=$(cat <<'EOF'
Progress line says, or wait for the topic if none is open.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 3: Replace Start step 5**

Locate it with `grep -nF -- "$needle" skills/tanto/roles/kanri.md` using the
Step 1 anchor. The numbered item runs from that line to the line ending
`roster's Events.`

Old passage — replace exactly these five lines and nothing else:

````markdown
5. Only when no plan is in flight — the bootstrap, a kept Kanri between plans,
   or a recovery whose last ledger says closed — ask the human for the topic
   word and create `.superpowers/sdd/<topic>/kanri.md` from
   `templates/kanri.md`. When a plan is in flight, the ledger already exists
   and is named by the handover or the roster's Events.
````

New passage — the spec's block under "Kanri derives the topic word (issue-c7e1)
› The rule", written with the file's CRLF ending and its 3-space continuation
indent:

````markdown
5. Only when no plan is in flight — the bootstrap, a kept Kanri between
   plans, or a recovery whose last ledger says closed — open the topic. Take
   it from whatever the human said the next work is — an issue id, a
   sentence, a name — derive a kebab-case slug of one to three words, check
   that no `.superpowers/sdd/<slug>/`, no
   `docs/superpowers/specs/*-<slug>-design.md`, and no branch `<slug>`
   exists (`ls -d`, the glob, and `git branch --list <slug>`), state the
   slug in your reply, and create `.superpowers/sdd/<topic>/kanri.md` from
   `templates/kanri.md`. Never ask the human for the word; when the human
   has not yet said what the next work is, wait for that (step 6). Until the
   orders line has gone to Sekkei the human can override the slug and you
   rename the directory; after it the word is fixed, because Sekkei's file
   names carry it. When a plan is in flight, the ledger already exists and
   is named by the handover or the roster's Events.
````

- [ ] **Step 4: Replace the Kept Kanri case**

Locate it with the Step 2 anchor. The paragraph runs from the line beginning
`**Kept Kanri** —` to that anchor line.

Old passage — replace exactly these three lines and nothing else:

````markdown
**Kept Kanri** — no handover file, and the first data row is you. This is a
re-invocation in the resident session: continue where the current ledger's
Progress line says, or wait for the topic if none is open.
````

New passage — the spec's block in the same subsection:

````markdown
**Kept Kanri** — no handover file, and the first data row is you. This is a
re-invocation in the resident session: continue where the current ledger's
Progress line says, or, if none is open, wait for the human to say what the
next work is and open the topic as step 5 says.
````

- [ ] **Step 5: Verify both new passages are in the file**

Run, one at a time:

````bash
needle=$(cat <<'EOF'
5. Only when no plan is in flight — the bootstrap, a kept Kanri between plans, or a recovery whose last ledger says closed — open the topic. Take it from whatever the human said the next work is — an issue id, a sentence, a name — derive a kebab-case slug of one to three words, check that no `.superpowers/sdd/<slug>/`, no `docs/superpowers/specs/*-<slug>-design.md`, and no branch `<slug>` exists (`ls -d`, the glob, and `git branch --list <slug>`), state the slug in your reply, and create `.superpowers/sdd/<topic>/kanri.md` from `templates/kanri.md`. Never ask the human for the word; when the human has not yet said what the next work is, wait for that (step 6). Until the orders line has gone to Sekkei the human can override the slug and you rename the directory; after it the word is fixed, because Sekkei's file names carry it. When a plan is in flight, the ledger already exists and is named by the handover or the roster's Events.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

````bash
needle=$(cat <<'EOF'
**Kept Kanri** — no handover file, and the first data row is you. This is a re-invocation in the resident session: continue where the current ledger's Progress line says, or, if none is open, wait for the human to say what the next work is and open the topic as step 5 says.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

- [ ] **Step 6: Verify both old passages are gone**

Run, one at a time:

````bash
needle=$(cat <<'EOF'
5. Only when no plan is in flight — the bootstrap, a kept Kanri between plans, or a recovery whose last ledger says closed — ask the human for the topic word and create `.superpowers/sdd/<topic>/kanri.md` from `templates/kanri.md`. When a plan is in flight, the ledger already exists and is named by the handover or the roster's Events.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

````bash
needle=$(cat <<'EOF'
**Kept Kanri** — no handover file, and the first data row is you. This is a re-invocation in the resident session: continue where the current ledger's Progress line says, or wait for the topic if none is open.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 7: The diff is exactly the two passages**

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md`
Expected: two hunks, one per passage, and no other change in the file.

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md | grep -c '^@@'`
Expected: `2`. This is a **task-time check**, not an invariant: the two
passages are eighteen unchanged lines apart, well above the six that would
coalesce them. A reviewer reads the hunks, not only the number.

- [ ] **Step 8: The line ending did not change**

Run: `git ls-files --eol skills/tanto/roles/kanri.md`
Expected: `i/lf    w/crlf  attr/text=auto` — the same `w/crlf` as before the
edit, never `w/mixed`.

- [ ] **Step 9: Lint the path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md` (Windows:
`scripts\lint.bat skills/tanto/roles/kanri.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Name the file; a
directory argument makes every hook skip and proves nothing.

- [ ] **Step 10: Commit**

````bash
git add skills/tanto/roles/kanri.md
git commit --only skills/tanto/roles/kanri.md -m "feat(tanto): Kanri derives the topic word instead of asking for it" -m "Start step 5 takes the topic from whatever the human said the next work is, derives a kebab-case slug of one to three words, checks the three places a stale word would collide, and states the slug in the reply; the human can override it until the orders line goes to Sekkei. The Kept Kanri case waits for the human to say what the next work is rather than waiting for a topic word. Closes issue-c7e1." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 11: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 2: `roles/kanri.md` — the handover wait, the loop, and the final batch

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — four passages: Timing, two paragraphs
  after its first (**insertion**); the batch loop's step 6, replaced whole
  (**replacement**); the batch loop's step 7, replaced whole (**replacement**);
  The final batch step 2, replaced whole (**replacement**).

**Interfaces:**

- Consumes: the file as Task 1 left it. Nothing in this task depends on Task 1's
  text.
- Produces: the wait every later handover obeys, and Kanri's own exception to
  the rule Task 4 lands as the term (contract rule 11). The exception does not
  cite the rule by number: this passage lands a batch before the rule, and the
  batch A boundary must carry no forward reference. The Timing paragraph's
  phrase "In flight" is the handover file's section name; Task 3 adds the line
  it refers to. Neither task reads the other's bytes.
- The file is `w/crlf` and **linted**; none of the four new passages carries a
  bare `<placeholder>`.

Needles are set from a quoted heredoc and passed as `"$needle"`, in the two
forms shown at the top of Task 1.

- [ ] **Step 1: Verify the anchor of the Timing paragraph, before the edit**

Anchor:

````markdown
handover that is due stops the loop at that point, and the next prompt is the
````

Run:

````bash
needle=$(cat <<'EOF'
handover that is due stops the loop at that point, and the next prompt is the
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 2: Verify the anchor of the batch loop's step 6, before the edit**

Anchor:

````markdown
   roster's Residency line. If a create request is due, make it. If a delete or
````

Run:

````bash
needle=$(cat <<'EOF'
   roster's Residency line. If a create request is due, make it. If a delete or
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 3: Verify the anchor of the batch loop's step 7, before the edit**

Anchor:

````markdown
7. **The commit window.** One committer at a time, in this order, Jisso idle
````

Run:

````bash
needle=$(cat <<'EOF'
7. **The commit window.** One committer at a time, in this order, Jisso idle
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 4: Verify the anchor of The final batch step 2, before the edit**

Anchor:

````markdown
   to Jisso. There is no second fix wave.
````

Run:

````bash
needle=$(cat <<'EOF'
   to Jisso. There is no second fix wave.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 5: Insert the two paragraphs into Timing**

This is an **insertion**: the existing Timing paragraph stays. Its last line is
`successor's to send.`, the line after the Step 1 anchor. Insert a blank line
and then the new passage after that last line, before the `### The residency
line` heading.

Old passage — the anchor line, which stays exactly as it is:

````markdown
handover that is due stops the loop at that point, and the next prompt is the
````

New passage — the spec's block under "The handover waits for what the session
owns (issue-f801) › The rule", two paragraphs separated by one blank line,
written with the file's CRLF ending:

````markdown
A due handover waits for what this session still owns. Write the handover
file only after every background agent you dispatched has returned — a
subagent belongs to its session and dies with it, and so does an idle
subscription you hold; the successor inherits a report file, never a
completion notice — and after every commit line you promised a peer at this
boundary has been sent and its commit verified. Between the last of those
and the handover file, dispatch nothing new: no batch prompt, no review, no
create request — the commit window's own slots are not new dispatches, and
a create request that fell due at this boundary is the successor's to make.
The one override is the human's word; a handover written on it lists every
agent still running under "In flight", so the successor knows it is lost
rather than pending.

A boundary that a plan editing this skill has not yet named safe for a
replacement does not hold your handover: it proceeds when due, and the
successor takes the authority ruling from the handover file's "Rulings the
next batch inherits" rather than from the tree.
````

- [ ] **Step 6: Replace the batch loop's step 6**

Locate it with the Step 2 anchor. The numbered item runs from the line
beginning `6. **Check the lifecycle tables` to the line `   step 7.`

Old passage — replace exactly these six lines and nothing else:

````markdown
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency line. If a create request is due, make it. If a delete or
   a replace of a live, coherent session is due, or a handover trigger has
   fired, run the proposal half of "Exit shoroku" now: send the `exit:` lines,
   rule on the proposals, write the directions. Delete requests wait for
   step 7.
````

New passage — the spec's replacement sentence for the create request, with the
rest of the item re-wrapped to the file's width and 3-space continuation
indent, so that the wrap is the file's and not the spec's:

````markdown
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency line. If a create request is due, make it, unless a
   handover trigger has fired, in which case the successor makes it from the
   handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired, run the proposal half of "Exit
   shoroku" now: send the `exit:` lines, rule on the proposals, write the
   directions. Delete requests wait for step 7.
````

- [ ] **Step 7: Replace the batch loop's step 7**

Locate it with the Step 3 anchor. The numbered item runs from that line to the
line ending `the next prompt is the successor's.` The spec changes only its
last sentence; the block below is the whole of step 7 as it stands with that
sentence replaced, so that the wrap is the file's.

Old passage — replace exactly these thirteen lines and nothing else:

````markdown
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) Each exiting session applies its direction and commits; you
   verify the diff and only then ask the human to delete that session. (b) Your
   own edits — the hotfix, the issues from step 4, and your own exit shoroku
   when a handover is due — each committed by you in its turn. (c) Tell Sekkei
   the boundary is verified, with `notify_when_idle: true`, naming any Kaiseki
   create or delete since the last boundary, then wait for Sekkei's one-line
   reply — `committed <subject>` or `nothing to commit` — or for its idle
   notice, whichever comes first, and record in the ledger's Session events if
   the notice came without a reply; skip (c) when Sekkei is not live. If a
   handover is due, the window ends with steps 2 to 4 of "The handover, in a
   plan and between plans" — the exit shoroku was step 6's proposal and slot
   (b)'s commit — and the loop stops here; the next prompt is the successor's.
````

New passage — the first ten lines byte for byte, then the spec's four
replacement lines:

````markdown
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) Each exiting session applies its direction and commits; you
   verify the diff and only then ask the human to delete that session. (b) Your
   own edits — the hotfix, the issues from step 4, and your own exit shoroku
   when a handover is due — each committed by you in its turn. (c) Tell Sekkei
   the boundary is verified, with `notify_when_idle: true`, naming any Kaiseki
   create or delete since the last boundary, then wait for Sekkei's one-line
   reply — `committed <subject>` or `nothing to commit` — or for its idle
   notice, whichever comes first, and record in the ledger's Session events if
   the notice came without a reply; skip (c) when Sekkei is not live. If a
   handover is due, the window ends, after the wait Timing prescribes, with
   steps 2 to 4 of "The handover, in a plan and between plans" — the exit
   shoroku was step 6's proposal and slot (b)'s commit — and the loop stops
   here; the next prompt is the successor's.
````

- [ ] **Step 8: Replace The final batch step 2**

Locate it with the Step 4 anchor. The numbered item is the two lines under
`## The final batch` that begin `2. Turn its findings`.

Old passage — replace exactly these two lines and nothing else:

````markdown
2. Turn its findings into one more batch prompt — the final batch — and send it
   to Jisso. There is no second fix wave.
````

New passage — the spec's block under "The fix-wave pre-flight sentence (S-73)":

````markdown
2. Turn its findings into one more batch prompt — the final batch — and send it
   to Jisso. A fix-wave list is drafted under the same conditions as a plan:
   run each command it specifies once before dispatching it. There is no
   second fix wave.
````

- [ ] **Step 9: Verify the four new passages are in the file**

Run, one at a time. Timing's two paragraphs:

````bash
needle=$(cat <<'EOF'
A due handover waits for what this session still owns. Write the handover file only after every background agent you dispatched has returned — a subagent belongs to its session and dies with it, and so does an idle subscription you hold; the successor inherits a report file, never a completion notice — and after every commit line you promised a peer at this boundary has been sent and its commit verified. Between the last of those and the handover file, dispatch nothing new: no batch prompt, no review, no create request — the commit window's own slots are not new dispatches, and a create request that fell due at this boundary is the successor's to make. The one override is the human's word; a handover written on it lists every agent still running under "In flight", so the successor knows it is lost rather than pending. A boundary that a plan editing this skill has not yet named safe for a replacement does not hold your handover: it proceeds when due, and the successor takes the authority ruling from the handover file's "Rulings the next batch inherits" rather than from the tree.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

Step 6:

````bash
needle=$(cat <<'EOF'
6. **Check the lifecycle tables and the handover trigger.** Rewrite the roster's Residency line. If a create request is due, make it, unless a handover trigger has fired, in which case the successor makes it from the handover's Next step. If a delete or a replace of a live, coherent session is due, or a handover trigger has fired, run the proposal half of "Exit shoroku" now: send the `exit:` lines, rule on the proposals, write the directions. Delete requests wait for step 7.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

Step 7:

````bash
needle=$(cat <<'EOF'
7. **The commit window.** One committer at a time, in this order, Jisso idle throughout. (a) Each exiting session applies its direction and commits; you verify the diff and only then ask the human to delete that session. (b) Your own edits — the hotfix, the issues from step 4, and your own exit shoroku when a handover is due — each committed by you in its turn. (c) Tell Sekkei the boundary is verified, with `notify_when_idle: true`, naming any Kaiseki create or delete since the last boundary, then wait for Sekkei's one-line reply — `committed <subject>` or `nothing to commit` — or for its idle notice, whichever comes first, and record in the ledger's Session events if the notice came without a reply; skip (c) when Sekkei is not live. If a handover is due, the window ends, after the wait Timing prescribes, with steps 2 to 4 of "The handover, in a plan and between plans" — the exit shoroku was step 6's proposal and slot (b)'s commit — and the loop stops here; the next prompt is the successor's.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The final batch step 2:

````bash
needle=$(cat <<'EOF'
2. Turn its findings into one more batch prompt — the final batch — and send it to Jisso. A fix-wave list is drafted under the same conditions as a plan: run each command it specifies once before dispatching it. There is no second fix wave.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

- [ ] **Step 10: Verify the three old passages are gone and the insertion's anchor stayed**

Step 6's old passage:

````bash
needle=$(cat <<'EOF'
6. **Check the lifecycle tables and the handover trigger.** Rewrite the roster's Residency line. If a create request is due, make it. If a delete or a replace of a live, coherent session is due, or a handover trigger has fired, run the proposal half of "Exit shoroku" now: send the `exit:` lines, rule on the proposals, write the directions. Delete requests wait for step 7.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

Step 7's old passage:

````bash
needle=$(cat <<'EOF'
7. **The commit window.** One committer at a time, in this order, Jisso idle throughout. (a) Each exiting session applies its direction and commits; you verify the diff and only then ask the human to delete that session. (b) Your own edits — the hotfix, the issues from step 4, and your own exit shoroku when a handover is due — each committed by you in its turn. (c) Tell Sekkei the boundary is verified, with `notify_when_idle: true`, naming any Kaiseki create or delete since the last boundary, then wait for Sekkei's one-line reply — `committed <subject>` or `nothing to commit` — or for its idle notice, whichever comes first, and record in the ledger's Session events if the notice came without a reply; skip (c) when Sekkei is not live. If a handover is due, the window ends with steps 2 to 4 of "The handover, in a plan and between plans" — the exit shoroku was step 6's proposal and slot (b)'s commit — and the loop stops here; the next prompt is the successor's.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

The final batch step 2's old passage:

````bash
needle=$(cat <<'EOF'
2. Turn its findings into one more batch prompt — the final batch — and send it to Jisso. There is no second fix wave.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

The Timing anchor, which is an insertion and must still be there:

````bash
needle=$(cat <<'EOF'
handover that is due stops the loop at that point, and the next prompt is the
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 11: The diff is exactly the passages written so far**

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md`
Expected: six hunks — Task 1's two passages plus this task's four — and no
other change in the file.

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md | grep -c '^@@'`
Expected: `6`. A task-time check, not an invariant. Step 6 and step 7 sit next
to each other but stay two hunks, because step 7's first ten lines are
unchanged and the changed line of step 7 is ten lines below the end of step 6.
The re-wrap of the unchanged prose in steps 6 and 7 is not pinned by any grep
— read those two hunks line by line against the blocks in Steps 6 and 7.

- [ ] **Step 12: The line ending did not change**

Run: `git ls-files --eol skills/tanto/roles/kanri.md`
Expected: `i/lf    w/crlf  attr/text=auto` — the same `w/crlf`, never
`w/mixed`.

- [ ] **Step 13: Lint the path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md` (Windows:
`scripts\lint.bat skills/tanto/roles/kanri.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`.

- [ ] **Step 14: Commit**

````bash
git add skills/tanto/roles/kanri.md
git commit --only skills/tanto/roles/kanri.md -m "feat(tanto): a due Kanri handover waits for what the session still owns" -m "Timing gains the wait: the handover file is written only after every background agent has returned and every promised commit line has been sent and verified, with nothing new dispatched in between, the human's word the only override. A second paragraph makes Kanri's own due handover proceed at a boundary a skill-editing plan has not named safe, with the authority ruling taken from the handover file. Loop step 6 defers a due create request to the successor, loop step 7 routes the handover through the wait, and The final batch step 2 gives a fix-wave list a plan's pre-flight. Closes issue-f801." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 15: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 3: `templates/kanri-handover.md` — the agents-still-running line

**Files:**

- Modify: `skills/tanto/templates/kanri-handover.md` — one passage, an
  **insertion**: a fourth line in the In flight section, after the Batch state
  line.

**Interfaces:**

- Consumes: nothing. The template as it stands on `main`.
- Produces: the line Task 2's Timing paragraph points at — "a handover written
  on it lists every agent still running under 'In flight'". The two tasks share
  no bytes.
- The file is checked out `w/lf` and lives under `skills/**/templates/**`, which
  is markdownlint-ignored, so its bare `<...>` blanks are correct and the long
  line is fine. The trailing-whitespace, end-of-file, and mixed-line-ending
  hooks still apply.

- [ ] **Step 1: Verify the anchor, before the edit**

The Batch state line wraps over two lines; the anchor is its second, which is
the line the new line goes after.

Anchor:

````markdown
  plans, last plan closed <YYYY-MM-DD>">
````

Run:

````bash
needle=$(cat <<'EOF'
  plans, last plan closed <YYYY-MM-DD>">
EOF
)
grep -cF -- "$needle" skills/tanto/templates/kanri-handover.md
````

Expected: `1`

- [ ] **Step 2: Insert the fourth In flight line**

This is an **insertion**: the Batch state line stays. Put the new line
immediately after the anchor line, as the fourth bullet of `## In flight`, with
no blank line between them.

Old passage — the anchor line, which stays exactly as it is:

````markdown
  plans, last plan closed <YYYY-MM-DD>">
````

New passage — the spec's block under "The handover waits for what the session
owns (issue-f801) › The handover file", one line, written with the file's LF
ending:

````markdown
- Agents of this session still running — <label and what it was to deliver, one per line, or "none">; lost with this session
````

- [ ] **Step 3: Verify the new line is in the file and the anchor stayed**

````bash
needle=$(cat <<'EOF'
- Agents of this session still running — <label and what it was to deliver, one per line, or "none">; lost with this session
EOF
)
tr -d '\r' < skills/tanto/templates/kanri-handover.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

````bash
needle=$(cat <<'EOF'
  plans, last plan closed <YYYY-MM-DD>">
EOF
)
grep -cF -- "$needle" skills/tanto/templates/kanri-handover.md
````

Expected: `1`

- [ ] **Step 4: The diff is exactly the passage**

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/templates/kanri-handover.md`
Expected: one hunk, one added line, nothing removed.

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/templates/kanri-handover.md | grep -c '^@@'`
Expected: `1`. A task-time check.

- [ ] **Step 5: The line ending did not change**

Run: `git ls-files --eol skills/tanto/templates/kanri-handover.md`
Expected: `i/lf    w/lf    attr/text=auto` — the same `w/lf`, never `w/mixed`.

- [ ] **Step 6: Lint the path**

Run: `./scripts/lint.sh skills/tanto/templates/kanri-handover.md` (Windows:
`scripts\lint.bat skills/tanto/templates/kanri-handover.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`.

- [ ] **Step 7: Commit**

````bash
git add skills/tanto/templates/kanri-handover.md
git commit --only skills/tanto/templates/kanri-handover.md -m "feat(tanto): the handover file lists the agents lost with the session" -m "In flight gains a fourth line for the background agents still running when a handover is written on the human's word. Under the wait the line normally says none; it exists so that a successor finding an agent listed knows it is lost rather than pending." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 8: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 4: `SKILL.md` rule 11 and the `README.md` closing sentence

**Files:**

- Modify: `skills/tanto/SKILL.md` — one passage, an **insertion**: Rules, item
  11 after item 10.
- Modify: `skills/tanto/README.md` — one passage, a **replacement**: the closing
  sentence, now naming three designs.

**Interfaces:**

- Consumes: nothing from Tasks 1 to 3.
- Produces: **contract rule 11**, the term two or more roles route on. Task 5
  writes the two obligations that cite it by number — Kanri's recording step in
  `roles/kanri.md` and Sekkei's plan convention in `roles/sekkei.md`, both
  ending "(contract rule 11)". Task 2's Timing paragraph does not cite it, so
  that batch A passage carries no forward reference. The number `11` must be
  the item number this task adds.
- Both files are `w/lf` and **linted**. Rule 11 carries no bare
  `<placeholder>`; its only angle brackets would be none, and `R-n` is in a
  code span.
- `SKILL.md`'s frontmatter is unchanged by this task: `name: tanto`,
  `argument-hint: kanri | sekkei | jisso | kaiseki`, and a `description` whose
  value contains no colon followed by a space.

- [ ] **Step 1: Verify the `SKILL.md` anchor, before the edit**

Rule 10's last line is `    is.` The anchor below is the line above it, which is
distinctive enough to read.

Anchor:

````markdown
    asks for one nor forbids it, and the handshake carries whatever the name
````

Run:

````bash
needle=$(cat <<'EOF'
    asks for one nor forbids it, and the handshake carries whatever the name
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`

- [ ] **Step 2: Verify the `README.md` anchor, before the edit**

Anchor:

````markdown
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`.
````

Run:

````bash
needle=$(cat <<'EOF'
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`.
EOF
)
grep -cF -- "$needle" skills/tanto/README.md
````

Expected: `1`

- [ ] **Step 3: Insert rule 11 into `SKILL.md`**

This is an **insertion**: rule 10 stays. Locate the anchor with `grep -nF`; rule
10 ends on the following line, `    is.` Put rule 11 immediately after that
line, before the blank line preceding `## The four SDD stop classes`, with no
blank line between rule 10 and rule 11.

Old passage — the anchor line, which stays exactly as it is:

````markdown
    asks for one nor forbids it, and the handshake carries whatever the name
````

New passage — the spec's block under "The rule for a skill edited in place
(issue-4ac3) › The rule, in the contract", with rule 10's 4-space continuation
indent and the file's LF ending:

````markdown
11. A plan that edits this skill's own files runs on the skill it is
    editing: when the skill the sessions load is the working tree's own
    copy — a link into it, as in the repository that ships this skill — a
    session started mid-plan reads whatever is on disk at that moment.
    While such a plan is in flight, the authority for the run's sessions is
    the plan's Global Constraints, Kanri's orders line, and the batch
    prompts, not the role text on disk; Kanri records that as a ruling when
    the plan lands, so every batch prompt and a handover file carry it. The
    plan names, in its Global Constraints and its Batches section, the
    boundary from which a role may be started or replaced. Before that
    boundary no role is replaced and no further role is created, with two
    exceptions: Kanri's own handover proceeds when it is due, and its
    successor takes the authority ruling from the handover file rather than
    from the tree; and a further role needed before the boundary — Kaiseki
    — is a Kanri ruling, recorded as `R-n`, made with the half-edited skill
    in view. The roles that start the plan — Jisso at the plan's landing,
    Sekkei before it — read the skill as it stands then, and the authority
    sentence above is what covers them.
````

- [ ] **Step 4: Replace the `README.md` closing sentence**

Locate it with the Step 2 anchor. The sentence is the last three lines of the
file, under `## Relationship to kisou, shoroku, and superpowers`.

Old passage — replace exactly these three lines and nothing else:

````markdown
The designs this skill implements are
`docs/superpowers/specs/2026-09-06-tanto-design.md` and
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`.
````

New passage — the spec's block in the same subsection:

````markdown
The designs this skill implements are
`docs/superpowers/specs/2026-09-06-tanto-design.md`,
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`, and
`docs/superpowers/specs/2026-09-07-boundary-rules-design.md`.
````

Keep the file's single final newline: the last line is the last line of the
file.

- [ ] **Step 5: Verify rule 11 is in `SKILL.md` and the anchor stayed**

````bash
needle=$(cat <<'EOF'
11. A plan that edits this skill's own files runs on the skill it is editing: when the skill the sessions load is the working tree's own copy — a link into it, as in the repository that ships this skill — a session started mid-plan reads whatever is on disk at that moment. While such a plan is in flight, the authority for the run's sessions is the plan's Global Constraints, Kanri's orders line, and the batch prompts, not the role text on disk; Kanri records that as a ruling when the plan lands, so every batch prompt and a handover file carry it. The plan names, in its Global Constraints and its Batches section, the boundary from which a role may be started or replaced. Before that boundary no role is replaced and no further role is created, with two exceptions: Kanri's own handover proceeds when it is due, and its successor takes the authority ruling from the handover file rather than from the tree; and a further role needed before the boundary — Kaiseki — is a Kanri ruling, recorded as `R-n`, made with the half-edited skill in view. The roles that start the plan — Jisso at the plan's landing, Sekkei before it — read the skill as it stands then, and the authority sentence above is what covers them.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

````bash
needle=$(cat <<'EOF'
    asks for one nor forbids it, and the handshake carries whatever the name
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`

- [ ] **Step 6: Verify the `README.md` passage replaced the old one**

New:

````bash
needle=$(cat <<'EOF'
The designs this skill implements are `docs/superpowers/specs/2026-09-06-tanto-design.md`, `docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`, and `docs/superpowers/specs/2026-09-07-boundary-rules-design.md`.
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

Old:

````bash
needle=$(cat <<'EOF'
The designs this skill implements are `docs/superpowers/specs/2026-09-06-tanto-design.md` and `docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`.
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 7: Runtime text still names no source path, and the rules still number to eleven**

Run as one block:

````bash
grep -c '^11\. ' skills/tanto/SKILL.md
grep -c '^12\. ' skills/tanto/SKILL.md
grep -n 'skills/tanto/' skills/tanto/SKILL.md
````

Expected: `1` from the first, `0` from the second (it exits 1; the rules end
at eleven), then no output at all from the third (it exits 1). Runtime text is
skill-relative; only the skill's `README.md` and
`docs/notes/tanto-consistency-checks.md` may name the source path.

- [ ] **Step 8: The frontmatter hook and the colon-space check**

Run:

````bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
````

Expected: `['argument-hint', 'description', 'name']`, then `ok`. If PyYAML
cannot be fetched, fall back to
`sed -n 's/^description: //p' skills/tanto/SKILL.md | grep -c ': '`, expect
`0`, and record the fallback. The `check-md-frontmatter` hook in Step 11's lint
run is the second half of this check.

- [ ] **Step 9: Review `README.md` for drift, and record the review**

The repo's `AGENTS.md` requires this in the same task that edits `SKILL.md`.
Read each section of `skills/tanto/README.md` against `SKILL.md` as this task
leaves it, and tick each line with what you found:

- [ ] **What it does** — rule 11 is a constraint on plans that edit the skill,
      not a change to what the skill does. Expected: no drift.
- [ ] **Prerequisites** — rule 11 adds no tool, no plugin, no host capability.
      Expected: no drift.
- [ ] **Usage** — rule 11 changes no `/tanto` invocation and no lifecycle
      request line. Kanri's derived topic word (Task 1) changes what Kanri asks
      the human for, and Usage does not quote that exchange. Expected: no
      drift.
- [ ] **Layout** — no file is added or removed by this plan; the template count
      is unchanged. Expected: no drift.
- [ ] **Relationship to kisou, shoroku, and superpowers** — the closing
      sentence, which Step 4 updates to name three designs. Expected: the only
      drift, and it is fixed in this task.

Record the five outcomes in the batch report. If a review finds drift beyond
the closing sentence, that is a **Rulings needed** item for Kanri, not a
sixth passage: this plan's passage list is closed.

- [ ] **Step 10: The diffs are exactly the passages, and the line endings held**

Run:

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/SKILL.md
git diff "$(git merge-base main HEAD)" -- skills/tanto/SKILL.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/README.md
git diff "$(git merge-base main HEAD)" -- skills/tanto/README.md | grep -c '^@@'
git ls-files --eol skills/tanto/SKILL.md skills/tanto/README.md
````

Expected: one hunk in `SKILL.md`, purely added lines; `1`; one hunk in
`README.md`, two lines out and three in — the old and new passages share
their unchanged first line, `The designs this skill implements are`, which
git keeps as context rather than counting it out and in (Kanri's R-8 at the
batch B boundary); `1`; then
`i/lf    w/lf    attr/text=auto` for both files — the same `w/lf` as before,
never `w/mixed`. The two hunk counts are task-time checks.

- [ ] **Step 11: Lint both paths**

Run: `./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/README.md`
(Windows: `scripts\lint.bat skills/tanto/SKILL.md skills/tanto/README.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Both files are
markdownlint-checked, so a bare `<placeholder>` outside a code span raises
MD033.

- [ ] **Step 12: Commit**

````bash
git add skills/tanto/SKILL.md skills/tanto/README.md
git commit --only skills/tanto/SKILL.md skills/tanto/README.md -m "feat(tanto): contract rule 11, a plan that edits this skill in place" -m "A plan that edits the skill's own files runs on the skill it is editing. While it is in flight the authority for the run's sessions is the plan's Global Constraints, Kanri's orders line, and the batch prompts, not the role text on disk, and the plan names the boundary from which a role may be started or replaced; before it no role is replaced and no further role is created, excepting Kanri's own due handover and a Kaiseki ruled necessary. The README names this design as a third path. Closes issue-4ac3." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 13: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 5: the rule-11 obligations in `roles/kanri.md` and `roles/sekkei.md`

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — one passage, an **insertion**: "When
  the plan lands" step 1, one sentence appended. The old step is a prefix of the
  new, which is why the shape is an insertion and not a replacement.
- Modify: `skills/tanto/roles/sekkei.md` — one passage, a **replacement**: Step
  3, the third bullet's last line, whose period becomes a semicolon, plus a
  fourth bullet appended.

**Interfaces:**

- Consumes: contract rule 11 from Task 4. Both new passages end
  `(contract rule 11)`, and that number is the item number Task 4 inserted into
  `SKILL.md`'s Rules.
- Produces: the two obligations the rule assigns — Kanri records the authority
  ruling as `R-n` before any dispatch; Sekkei states the boundary in Global
  Constraints and in the Batches section.
- Both files are `w/crlf` and **linted**. `R-n` is in a code span in Kanri's
  passage; Sekkei's carries no angle brackets.

- [ ] **Step 1: Verify the `roles/kanri.md` anchor, before the edit**

Anchor — the last line of the current step 1, the line the new sentence is
appended to:

````markdown
   never by explaining in a message.
````

Run:

````bash
needle=$(cat <<'EOF'
   never by explaining in a message.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 2: Verify the `roles/sekkei.md` anchor, before the edit**

Anchor:

````markdown
  of any frontmatter, and a JSON parse of any JSON the plan writes.
````

Run:

````bash
needle=$(cat <<'EOF'
  of any frontmatter, and a JSON parse of any JSON the plan writes.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`

- [ ] **Step 3: Append the sentence to "When the plan lands" step 1**

Locate the anchor with `grep -nF`. It is the third line of the numbered item
under `## When the plan lands` that begins `1. Cold-read the committed plan`.

Old passage — these three lines, of which the anchor is the last. They are the
prefix of the new passage, so the whole item is rewritten in place:

````markdown
1. Cold-read the committed plan and the spec, and send Sekkei one line per open
   question. Wait for its pointer: it answers by editing the plan or the spec,
   never by explaining in a message.
````

New passage — the spec's block under "The rule for a skill edited in place
(issue-4ac3) › The obligations, in the role files", written with the file's
CRLF ending and its 3-space continuation indent:

````markdown
1. Cold-read the committed plan and the spec, and send Sekkei one line per open
   question. Wait for its pointer: it answers by editing the plan or the spec,
   never by explaining in a message. If the plan edits this skill's own files,
   record as `R-n`, before any batch prompt or subagent is dispatched, that
   the run's sessions follow the constraints, your orders lines, and the
   batch prompts rather than the role text on disk, and the boundary the plan
   names for a role start or replacement (contract rule 11); every batch
   prompt and a handover file then carry it.
````

- [ ] **Step 4: Replace the last line of Sekkei's third Step 3 bullet**

Locate the anchor with `grep -nF`. It is the last line of the third bullet under
`## Step 3 — the plan`, and it ends the list with a period.

Old passage — replace exactly this one line and nothing else:

````markdown
  of any frontmatter, and a JSON parse of any JSON the plan writes.
````

New passage — the spec's block in the same subsection: the same line with the
period turned into the semicolon the first two bullets end with, then the
fourth bullet, at the list's 2-space continuation indent and the file's CRLF
ending:

````markdown
  of any frontmatter, and a JSON parse of any JSON the plan writes;
- when the plan edits this skill's own files, the **boundary from which a
  role may be started or replaced** — where one is *permitted*, as distinct
  from the boundaries where the second bullet expects one — stated in Global
  Constraints and in the Batches section: the first boundary at which every
  file the plan touches agrees with every other, because a session started
  before it reads a half-edited skill — which may be the final boundary, in
  which case a replacement waits for it and the plan says so; and the
  sentence that until then the authority for the run's sessions is the
  constraints, Kanri's orders line, and the batch prompts (contract rule
  11).
````

- [ ] **Step 5: Verify Kanri's new step 1 and its anchor**

````bash
needle=$(cat <<'EOF'
1. Cold-read the committed plan and the spec, and send Sekkei one line per open question. Wait for its pointer: it answers by editing the plan or the spec, never by explaining in a message. If the plan edits this skill's own files, record as `R-n`, before any batch prompt or subagent is dispatched, that the run's sessions follow the constraints, your orders lines, and the batch prompts rather than the role text on disk, and the boundary the plan names for a role start or replacement (contract rule 11); every batch prompt and a handover file then carry it.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

````bash
needle=$(cat <<'EOF'
   never by explaining in a message.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1` — the anchor is still there, because this passage is an
insertion and the old text is a prefix of the new. Step 7's diff carries the
"nothing else changed" burden for it.

- [ ] **Step 6: Verify Sekkei's new bullet replaced the old line**

New:

````bash
needle=$(cat <<'EOF'
of any frontmatter, and a JSON parse of any JSON the plan writes; - when the plan edits this skill's own files, the **boundary from which a role may be started or replaced** — where one is *permitted*, as distinct from the boundaries where the second bullet expects one — stated in Global Constraints and in the Batches section: the first boundary at which every file the plan touches agrees with every other, because a session started before it reads a half-edited skill — which may be the final boundary, in which case a replacement waits for it and the plan says so; and the sentence that until then the authority for the run's sessions is the constraints, Kanri's orders line, and the batch prompts (contract rule 11).
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

Old:

````bash
needle=$(cat <<'EOF'
of any frontmatter, and a JSON parse of any JSON the plan writes.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 7: The diffs are exactly the passages, and the line endings held**

Run:

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/sekkei.md
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/sekkei.md | grep -c '^@@'
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md
````

Expected: seven hunks in `roles/kanri.md` — Task 1's two, Task 2's four, and
this task's one — and nothing else; `7`; one hunk in `roles/sekkei.md`, one
line out and eleven in; `1`; then `i/lf    w/crlf  attr/text=auto` for both
files, never `w/mixed`. Both hunk counts are task-time checks.

- [ ] **Step 8: Lint both paths**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md`
(Windows: `scripts\lint.bat skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`.

- [ ] **Step 9: Commit**

````bash
git add skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md
git commit --only skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md -m "feat(tanto): the rule-11 obligations in Kanri's and Sekkei's procedures" -m "When the plan lands step 1 has Kanri record the authority ruling as an R-n before any batch prompt or subagent is dispatched, together with the boundary the plan names for a role start or replacement. Sekkei's Step 3 gains a fourth bullet: a plan that edits this skill's own files states that boundary in Global Constraints and in the Batches section, permitted as distinct from expected, and the final boundary is an allowed answer." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 10: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 6: the note — a passage-level plan's pass

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md` — one passage, an
  **insertion**: one paragraph after the "Three moments" paragraph of the
  opening.

**Interfaces:**

- Consumes: nothing from Tasks 1 to 5. The note as it stands on `main`.
- Produces: the note's statement that a passage-level plan has no extracted
  tree, that its alignment check is the per-file merge-base diff, and that
  check 9's extracted-tree lint does not apply to it. Task 7 runs the note and
  relies on that sentence for skipping check 9's first block.
- The file is checked out `w/crlf` and is **linted** — `docs/notes/**` is not
  markdownlint-ignored — so any `<placeholder>` in the new text would have to
  live in a code span. The new paragraph contains none.

- [ ] **Step 1: Verify the anchor, before the edit**

Anchor — the second-to-last line of the "Three moments" paragraph:

````markdown
`skills/tanto/` schedules them by naming this note in its verification
````

Run:

````bash
needle=$(cat <<'EOF'
`skills/tanto/` schedules them by naming this note in its verification
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 2: Insert the paragraph**

This is an **insertion**: the "Three moments" paragraph stays. Its last line is
`section.`, the line after the anchor. Insert a blank line and then the new
paragraph after that last line, before the paragraph that begins `The index
stores LF throughout`.

Old passage — the anchor line, which stays exactly as it is:

````markdown
`skills/tanto/` schedules them by naming this note in its verification
````

New passage — the spec's block under "The note", written with the file's CRLF
ending:

````markdown
A plan that carries passages rather than whole files — an anchor line, the
old passage, the new passage, for each edit — has no extracted tree. Its
alignment check is the diff of each touched file against the merge base,
whose hunks must be exactly the plan's passages, and its lint runs on the
tree after each task, which is the file the hook will see. Checks 1 to 8 run
on the tree as for any plan; of check 9, the extracted-tree lint does not
apply to such a plan, and the trailing-whitespace and final-newline sweep
runs as for any plan.
````

- [ ] **Step 3: Verify the new paragraph is in the file and the anchor stayed**

````bash
needle=$(cat <<'EOF'
A plan that carries passages rather than whole files — an anchor line, the old passage, the new passage, for each edit — has no extracted tree. Its alignment check is the diff of each touched file against the merge base, whose hunks must be exactly the plan's passages, and its lint runs on the tree after each task, which is the file the hook will see. Checks 1 to 8 run on the tree as for any plan; of check 9, the extracted-tree lint does not apply to such a plan, and the trailing-whitespace and final-newline sweep runs as for any plan.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

````bash
needle=$(cat <<'EOF'
`skills/tanto/` schedules them by naming this note in its verification
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 4: The diff is exactly the passage**

Run: `git diff "$(git merge-base main HEAD)" -- docs/notes/tanto-consistency-checks.md`
Expected: one hunk, nine added lines (the blank line and the eight of the
paragraph), nothing removed.

Run: `git diff "$(git merge-base main HEAD)" -- docs/notes/tanto-consistency-checks.md | grep -c '^@@'`
Expected: `1`. A task-time check.

- [ ] **Step 5: The line ending did not change**

Run: `git ls-files --eol docs/notes/tanto-consistency-checks.md`
Expected: `i/lf    w/crlf  attr/text=auto` — the same `w/crlf`, never
`w/mixed`.

- [ ] **Step 6: Lint the path**

Run: `./scripts/lint.sh docs/notes/tanto-consistency-checks.md` (Windows:
`scripts\lint.bat docs/notes/tanto-consistency-checks.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`. This file is
markdownlint-checked.

- [ ] **Step 7: Commit**

````bash
git add docs/notes/tanto-consistency-checks.md
git commit --only docs/notes/tanto-consistency-checks.md -m "docs(notes): how a passage-level plan runs the consistency pass" -m "A plan that carries passages rather than whole files has no extracted tree, so its alignment check is the per-file diff against the merge base and its lint runs on the tree after each task. Checks 1 to 8 run as for any plan; of check 9 only the trailing-whitespace and final-newline sweep applies. This keeps the note the single place a future plan's pass is described from." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 8: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 7: the consistency pass

**Files:**

- Modify: nothing. This task writes no file and makes no commit.

**Interfaces:**

- Consumes: the six files Tasks 1 to 6 edited;
  `docs/notes/tanto-consistency-checks.md` as the source of the commands, in
  the state Task 6 leaves it; and
  `.superpowers/sdd/boundary-rules/checks-baseline.md`, the recorded output of
  the same checks on the pre-edit tree. Sekkei recorded it at plan review by
  running checks 1 to 8 and check 9's second block on the pre-edit tree; it is
  untracked. If it is missing, that is a Rulings-needed item, not a reason to
  skip the comparison.
- Produces: the recorded output of every check. That output **is** the
  deliverable. This is a **verification-only task** in the sense
  `roles/jisso.md` defines: the dispatch tells the reviewer to **re-run** the
  checks rather than trust this report, because a report of a check is not the
  check.

Run the note's commands **as written** — do not paraphrase them — so that a
divergence between the note and the tree is the note's problem or the tree's,
never a transcription's. Compare every output with two things: the note's own
Expected text, and the same check's Output block in
`.superpowers/sdd/boundary-rules/checks-baseline.md`. This plan changes no
string any check counts, so every check's output must equal its baseline.

**A failing check is a Rulings-needed item in the batch report, never an edit.**
A fix outside the twelve passages would break the invariant that each file's
merge-base diff is exactly its passages. Kanri rules on it, and a ruled
correction lands in the whole-branch review's fix wave.

- [ ] **Step 1: Check 1 — every file of the layout exists**

Run the fenced `bash` block under `## 1. Every file of the layout exists` in
`docs/notes/tanto-consistency-checks.md`.
Expected: all fifteen paths listed, no `No such file or directory`. Same as the
baseline's check 1 Output block.

- [ ] **Step 2: Check 2 — every in-skill path resolves**

Run the block under
`## 2. Every in-skill path named by the contract or a role file resolves`.
Expected: thirteen `ok` lines and no `MISSING` line — `roles/jisso.md`,
`roles/kaiseki.md`, `roles/kanri.md`, `roles/sekkei.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/bug-report.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/kanri-handover.md`,
`templates/kanri.md`, `templates/roster.md`, `templates/tanto.json`. Same as
the baseline.

- [ ] **Step 3: Check 3 — every template is cited by its copier**

Run the block under `## 3. Every template is cited by the role that copies it`.
Expected: nine `ok` lines, no `UNCITED`. Same as the baseline.

- [ ] **Step 4: Check 4 — the superpowers and shoroku sentences still exist**

Run the block under
`## 4. The superpowers and shoroku sentences the skill overrides still exist`.
Expected: a nonzero count on every `grep` line, and `code-reviewer-present`.
Same as the baseline. A zero here is **not** fixed: report which line no longer
matches as a ruling needed, and record the version stamp the note's "Versions
these checks assume" section asks for.

- [ ] **Step 5: Check 5 — the two verbatim quotes**

Run the block under
`## 5. The two verbatim quotes' pinned lines are present in every copy`.
Expected: `1` on all five lines. Same as the baseline.

- [ ] **Step 6: Check 6 — the strings the roles route on**

Run all four blocks under `## 6. The strings the roles route on`.
Expected, from the first block, the twenty-seven numbers `2`, `1`, `1`, `2`,
`1`, `1`, `1`, `1`, `5`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`,
`3`, `1`, `1`, `1`, `1`, `1`, `1` in that order; then five lines each ending
`-> 1` (the triage answers); then five more each ending `-> 1` (the
human-access request line in the contract and the four role files); then three
each ending `-> 1` (the `kanri-address:` obligation sentence, flattened, in the
three peer role files). Same as the baseline. This plan's twelve passages add
and remove none of these strings, which is why the numbers must be unchanged.

- [ ] **Step 7: Check 7 — the strings that must be absent**

Run both blocks under `## 7. The strings that must be absent`.
Expected: no output from the first nine greps; the tenth read by eye for an
actual commit hash, of which there must be none; then exactly
`skills/tanto/SKILL.md:1` and `skills/tanto/README.md:1`. Same as the baseline.
The ninth grep — `skills/tanto/` inside `SKILL.md`, `roles/`, and `templates/`
— is the one this plan could have broken, since Tasks 2 to 5 added runtime
text; it must still print nothing.

- [ ] **Step 8: Check 8 — the frontmatter and the JSON parse**

Run the block under `## 8. The frontmatter and the JSON parse`.
Expected: `['argument-hint', 'description', 'name']`, then `ok`, then
`json ok`. Same as the baseline. Use `uv run --no-project`, never a bare
`python`.

- [ ] **Step 9: Check 9, the second block only — the whitespace and final-newline sweep**

Run the **second** fenced `bash` block under `## 9. Linting an extracted tree`
— the `for f in $(find skills docs -name '*.md')` loop.
Expected: `done` alone. Same as the baseline.

Do **not** run the first block of check 9. It lints a tree of blocks extracted
from a whole-file plan; this plan carries passages and extracts nothing, which
is what Task 6 wrote into the note's opening.

- [ ] **Step 10: Lint every path the plan touched, by name**

Run: `./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/templates/kanri-handover.md docs/notes/tanto-consistency-checks.md`
(Windows: the same six paths after `scripts\lint.bat`.)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Six paths, the six
of the File structure table. Naming the files matters — a directory argument
makes every hook skip and proves nothing.

- [ ] **Step 11: Every file's diff is still exactly its passages**

Run:

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/templates/kanri-handover.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/SKILL.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/README.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/sekkei.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- docs/notes/tanto-consistency-checks.md | grep -c '^@@'
git ls-files --eol skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/templates/kanri-handover.md docs/notes/tanto-consistency-checks.md
````

Expected: `7`, `1`, `1`, `1`, `1`, `1` — twelve hunks over six files, one per
passage — then `w/crlf` for `roles/kanri.md`, `roles/sekkei.md`, and the note,
`w/lf` for `SKILL.md`, `README.md`, and `templates/kanri-handover.md`, and
`w/mixed` for none. The hunk numbers are task-time checks; read the hunks
themselves against the plan's twelve passages.

- [ ] **Step 12: Every commit on the branch carries the trailer**

Run:

````bash
git log --format='%s%n%b' main..HEAD | grep -c 'Co-Authored-By: Claude'
git log --oneline main..HEAD | wc -l
````

Expected: the two numbers are **equal**. The branch also carries Sekkei's spec
and plan commits, Kanri's T1 write-out, Kanri's issue commits, and any exit
shoroku made at a boundary, so the count is larger than this plan's six task
commits; the equality is the check, not the number.

- [ ] **Step 13: Record the output**

Paste every command's actual output into the batch report's Verification
section, one line per command, and next to each say whether it matches
`.superpowers/sdd/boundary-rules/checks-baseline.md`. The report is not "all
checks passed"; it is the output. This task changes no file and makes no
commit — say so explicitly. Anything that failed goes under **Rulings needed**,
with the check number, the command, and the actual output.

---

## Batches

Two batches, seven tasks. Batch A carries the two issues whose passages stay
inside Kanri's procedure and the handover template — issue-f801, issue-c7e1,
and the fix-wave pre-flight sentence — and batch B carries issue-4ac3's rule
with both obligations, the note, and the consistency pass. Nothing in batch A
references rule 11 — a fact the rule-11 sweep in "How a batch is verified"
proves at each boundary rather than assumes — and batch B lands rule 11, the
two obligations, the README line, and the note's paragraph in three tasks
before the pass, so the tree is self-consistent at both boundaries. **The
batch A boundary is therefore the
boundary from which a role may be started or replaced** (Global Constraints);
this plan expects one Jisso throughout, so no replacement is planned at
either. `skills/tanto/roles/kanri.md` is touched in Tasks 1, 2, and 5 — three
tasks across the two batches — and each of its seven passages is written once.
Kanri edits nothing at either boundary: the roster and the ledger are
untracked, and no template this plan changes is one Kanri copies mid-run
except `kanri-handover.md`, which is copied only at a handover.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1, 2, 3 | `roles/kanri.md` with the derived topic word (Start step 5, the Kept Kanri case), the handover that waits (Timing's two paragraphs, step 6's deferred create request, step 7's cross-reference), and the fix-wave pre-flight sentence (The final batch step 2); `templates/kanri-handover.md` with the "Agents of this session still running" line | lint clean on `skills/tanto/roles/kanri.md` and `skills/tanto/templates/kanri-handover.md`, by name; every flattened new-passage grep of Tasks 1 to 3 returns `1`, every old-passage grep of a replacement returns `0`, and the anchor of each insertion still returns `1`; `git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md` and `-- skills/tanto/templates/kanri-handover.md` read hunk by hunk against the blocks, with the hunk counts the tasks state; `git ls-files --eol` shows `w/crlf` for `roles/kanri.md` and `w/lf` for the template; `git diff "$(git merge-base main HEAD)" --stat` names, among the plan's six files, only those two; every commit carries the trailer; `git status --short` prints nothing; the rule-11 sweep of "How a batch is verified" prints ` 0` on every line and then `0`, so the tree carries no reference to a rule it does not yet hold, and a role may be started or replaced from here |
| B | 4, 5, 6, 7 | `SKILL.md` with rule 11 and `README.md` naming three designs; `roles/kanri.md` recording the authority ruling when the plan lands, and `roles/sekkei.md` naming the replacement boundary; the note's passage-level paragraph; the consistency pass recorded | lint clean on each named path; `SKILL.md` passes the frontmatter hook and its `description` has no colon-space; `grep -c '^11\. ' skills/tanto/SKILL.md` is `1` and `grep -c '^12\. ' skills/tanto/SKILL.md` is `0`; the README's closing sentence names `2026-09-07-boundary-rules-design.md`; every flattened new-passage grep of Tasks 4 to 6 returns `1`, the two old-passage greps of the replacements return `0`, the anchors of the insertions still return `1`; the diffs of all six files read hunk by hunk against the blocks; `git ls-files --eol` unchanged for all six; every check in Task 7's report matches the note's Expected text and `.superpowers/sdd/boundary-rules/checks-baseline.md`, or is a Rulings-needed item; `git log --format='%s%n%b' main..HEAD \| grep -c 'Co-Authored-By: Claude'` equals `git log --oneline main..HEAD \| wc -l`; `git diff "$(git merge-base main HEAD)" --stat` names, besides the spec, this plan, and the paths under `docs/` from Kanri's own commits, exactly the six files; `git status --short` prints nothing; the rule-11 sweep prints `skills/tanto/roles/kanri.md 1` and `skills/tanto/roles/sekkei.md 1`, ` 0` on every other line, and then `1` |

The final batch — the whole-branch review's fix wave, dispatched by Kanri
after batch B — is the protocol's own and not counted here. A fix-wave list
is drafted under the same conditions as a plan: run each command it specifies
once before dispatching it (the sentence Task 2 puts into Kanri's procedure,
applied to this run by Kanri's ruling until then).

## How a batch is verified

For a Markdown-only plan of passage edits, run this checklist at every
boundary. Every dispatch says what "tests" means for its task, per
`roles/jisso.md`'s "Verification when the plan ships documents".

- [ ] **Lint the changed paths by name.** `./scripts/lint.sh <file> [<file> ...]`
      (Windows: `scripts\lint.bat <file> ...`). Every hook `Passed` or
      `Skipped`, none `Failed`. A directory argument makes every hook skip
      and proves nothing, so always name files. If a hook auto-fixes and
      fails the run, re-stage and re-run.
- [ ] **The passage checks, with needles from heredocs.** For each passage of
      the batch, on the flattened file
      (`tr -d '\r' < <file> | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"`):
      the new passage returns `1`; for a replacement the old passage returns
      `0`; for an insertion the anchor still returns `1`. The commands and
      the flattened needles are in each task.
- [ ] **The diff is exactly the passages.** `git diff "$(git merge-base main HEAD)" -- <file>`
      (the working tree against the merge base, so right before and after a
      commit), read hunk by hunk against the task's blocks. The hunk count
      `git diff "$(git merge-base main HEAD)" -- <file> | grep -c '^@@'`
      is a task-time check the task states, not an invariant: two passages
      within six unchanged lines of each other coalesce into one hunk.
- [ ] **Line endings.** `git ls-files --eol <file>` for each touched file
      shows `w/crlf` for `roles/kanri.md`, `roles/sekkei.md`, and the note,
      `w/lf` for `SKILL.md`, `README.md`, and `templates/kanri-handover.md`,
      and never `w/mixed`.
- [ ] **The whole-tree sweeps.** `git status --short` prints nothing: the
      workspace `.superpowers/sdd/` is ignored by its own `.gitignore`, and
      nothing else is untracked. `git diff "$(git merge-base main HEAD)" --stat`
      names, besides `docs/superpowers/specs/2026-09-07-boundary-rules-design.md`,
      `docs/superpowers/plans/2026-09-07-boundary-rules.md`, and paths under
      `docs/` from Kanri's own commits (the `docs(issues):` commits and the T1
      write-out), exactly the plan's files written so far: at the batch A
      boundary `skills/tanto/roles/kanri.md` and
      `skills/tanto/templates/kanri-handover.md`; at the batch B boundary all
      six.
- [ ] **The rule-11 sweep — the forward-reference check.** The one claim in
      this plan that no task-time check decides is that batch A references
      nothing batch B adds; this sweep decides it. Run as one block:

      ````bash
      for f in skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do
        printf '%s %s\n' "$f" "$(tr -d '\r' < "$f" | tr '\n' ' ' | tr -s ' ' | grep -oF 'contract rule 11' | wc -l)"
      done
      grep -c '^11\. ' skills/tanto/SKILL.md
      ````

      Expected at the batch A boundary: every line ends ` 0`, then `0` — the
      tree holds no reference to a rule it does not yet contain, which is what
      makes this boundary safe for a role start or replacement. Expected at
      the batch B boundary: `skills/tanto/roles/kanri.md 1` (When the plan
      lands step 1) and `skills/tanto/roles/sekkei.md 1` (Step 3's fourth
      bullet), ` 0` on every other line, then `1`. The count is taken on the
      flattened file because Sekkei's citation wraps across two lines in
      `roles/sekkei.md`; `SKILL.md` counts `0` at both boundaries because rule
      11 does not name itself.
- [ ] **The frontmatter hook and the colon-space check** (batch B, Task 4):
      the `check-md-frontmatter` hook passes on `skills/tanto/SKILL.md`, and
      Task 4 Step 8's PyYAML load prints
      `['argument-hint', 'description', 'name']` then `ok`.
- [ ] **Review `README.md` for drift whenever `SKILL.md` changed**, in the
      same task (Task 4) — the repo's `AGENTS.md` rule; the closing sentence
      is the one expected change.
- [ ] **Commit by explicit path with the trailer**, then confirm it:
      `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'` returns `1`.
- [ ] **At every boundary, re-run the whole set of task-time checks of the
      batch**, not only the ones the boundary asked for.
- [ ] **In batch B only**, Task 7 runs checks 1 to 8 of
      `docs/notes/tanto-consistency-checks.md` as written and check 9's
      whitespace and final-newline sweep, records every output, and compares
      each with the note's Expected text and with the pre-edit baseline
      `.superpowers/sdd/boundary-rules/checks-baseline.md`. A mismatch is a
      Rulings-needed item, never an edit. Check 9's extracted-tree lint is
      not run, for the reason Task 6 writes into the note: a passage plan has
      no extracted tree, and the lint of the real file after each task is the
      lint the hook sees.

Write-outs — T1, T2, and every exit shoroku — are outside this plan: they
write under `docs/requirements/`, `docs/design/`, `docs/decisions/`, and
`docs/issues/`, which no task touches, and their commits begin
`docs: T<n> shoroku` or `docs: exit shoroku`; the whole-branch review
package excludes exactly those subjects and keeps Task 6's note commit.

## Reporting protocol

Batch prompts and reports follow the tanto templates —
`skills/tanto/templates/batch-prompt.md` and
`skills/tanto/templates/batch-report.md` — and this plan names nothing else
about their shape. A Kaiseki brief and report follow
`skills/tanto/templates/kaiseki-brief.md` and
`skills/tanto/templates/kaiseki-report.md` the same way.

One template changes mid-plan: Task 3 adds a line to
`skills/tanto/templates/kanri-handover.md`. A handover file copied before Task 3
lands has three In flight lines, one copied after has four; the wait Task 2
writes into Timing applies either way, and a three-line copy is completed by
hand from the new template.

## Self-Review

**1. Spec coverage.** Every section and subsection of
`docs/superpowers/specs/2026-09-07-boundary-rules-design.md` maps to a task or
is named here with the reason it has none:

| Spec section | Task |
| --- | --- |
| Fixed inputs | no task: its decisions are constraints and shape, not deliverables — the passage-level blocks, the two batches, the boundary from which a role may be started or replaced, the unbounded wait, the successor proceeding from the handover file, the unchanged list. They reach the run through Global Constraints and the Batches section, which Sekkei writes |
| The handover waits for what the session owns (issue-f801) — The gap | no task: it is the measurement that motivates the rule |
| The handover waits — The rule | 2 (Timing's two paragraphs, the loop's step 6 sentence, the loop's step 7 cross-reference) |
| The handover waits — The handover file | 3 (`templates/kanri-handover.md`, the fourth In flight line) |
| The handover waits — Rejected | no task: the bounded wait is not built, and the reason is the spec's |
| The handover waits — At T2 | no task: design-4807's Handover section is a shoroku write-out, outside every plan task |
| Kanri derives the topic word (issue-c7e1) — The gap | no task: the measurement |
| Kanri derives the topic word — The rule | 1 (Start step 5 replaced whole, and the Kept Kanri case) |
| Kanri derives the topic word — Rejected | no task: the date prefix is deferred item 1 |
| Kanri derives the topic word — At T2 | no task: design-4807 and issue-c7e1's body change at T2 |
| The rule for a skill edited in place (issue-4ac3) — The hazard | no task: the measured instance that motivates the rule |
| The rule for a skill edited in place — The rule, in the contract | 4 (`SKILL.md` Rules, item 11 after item 10) |
| The rule for a skill edited in place — The obligations, in the role files | 5 (`roles/kanri.md` When the plan lands step 1; `roles/sekkei.md` Step 3's third bullet and new fourth bullet) and 4 (`README.md`'s closing sentence, which that subsection also specifies, with the drift review in the same task) |
| The rule for a skill edited in place — The successor Kanri | 4 (rule 11's first exception) and 2 (Timing's second paragraph); the spec says no new mechanism is needed beyond those two sentences |
| The rule for a skill edited in place — Rejected | no task: the skill copy is not built |
| The rule for a skill edited in place — Applied to this plan | no task in this document: the batch A boundary is the replacement point, and Sekkei states it in Global Constraints and in the Batches section |
| The rule for a skill edited in place — At T2 | no task: design-4807's three places change at T2 |
| The fix-wave pre-flight sentence (S-73) | 2 (The final batch, step 2) |
| The note | 6 (`docs/notes/tanto-consistency-checks.md`, one paragraph after "Three moments") |
| Where each change lives | the File structure table above, row for row, and the twelve passages of Tasks 1 to 6; the Task 7 sentence is its last paragraph |
| What the plan must contain | the passage-level blocks in every task; the needle rule stated once at the top of Task 1 and used in every check; seven tasks in two batches; the boundaries and Global Constraints, which Sekkei writes; the Reporting protocol section |
| Verification, items 1 to 4 | each task's anchor, flattened-passage, diff, line-ending, and lint steps |
| Verification, items 5 and 6 | 4 (Step 8, the frontmatter hook and the colon-space check; Step 9, the recorded README drift review) |
| Verification, item 7 | each task's commit and trailer steps |
| Verification, the consistency pass | 7 (checks 1 to 8, check 9's second block, the lint by name, the trailer equality, the recorded output) |
| Out of scope | no task, by construction: no task names the repo-root `README.md`, superpowers, `shoroku`, `tanto.json`, `roles/jisso.md`, `roles/kaiseki.md`, or anything under `docs/requirements/`, `docs/design/`, `docs/decisions/`, or `docs/issues/` |
| Answers to the spec inputs | no task: I-1 and I-2 are answered by the tasks above and the table adds nothing to build |
| Deferred items | no task: deferred item 1 is filed as an issue at T1, a write-out outside the plan |
| Shoroku candidates from this spec work | no task: T1, T2, and the exit shoroku write those under `docs/`, which no task touches |

**2. Placeholder scan.** No `TBD`, no `TODO`, no "implement later", no "similar
to Task N", no "add appropriate ...". Every edit step carries the anchor, the
old passage, and the new passage in full, verbatim; every verification step
names the exact command and the exact expected output. The three sections —
Global Constraints, Batches, How a batch is verified — are Sekkei's own
additions under `roles/sekkei.md` Step 3, and each is complete: the
constraints the batch prompts are built from, each batch's tasks,
deliverable, and stop conditions, and the verification checklist with its
commands.

**3. Consistency across tasks.** Checked and reconciled:

- **File paths.** The six paths in the File structure table are the same
  strings used in every task's `Files:` block, in every `grep`, `git diff`, and
  `git ls-files --eol` command, in every commit command, and in Task 7's lint
  line. No task names a seventh path.
- **Passage count.** Twelve: seven in `roles/kanri.md` (Tasks 1, 2, 5), one
  each in `templates/kanri-handover.md` (3), `SKILL.md` (4), `README.md` (4),
  `roles/sekkei.md` (5), and the note (6). The File structure table, the spec's
  "Where each change lives" table, and Task 7 Step 11's six hunk counts
  (`7 + 1 + 1 + 1 + 1 + 1`) all say twelve.
- **Hunk counts.** `roles/kanri.md` is `2` after Task 1, `6` after Task 2, and
  `7` after Task 5; every other file is `1`. Step 6 and step 7 of the batch
  loop are adjacent passages but stay two hunks, because step 7's first ten
  lines are unchanged and its changed lines sit ten lines below step 6's end.
  Every count is labeled a task-time check, and every diff step tells the
  reviewer to read the hunks, not only the number.
- **Anchors.** Each of the twelve anchors was run with `grep -cF -- "$needle"`
  against the tree before this plan was written and returned `1`. Each
  flattened old passage was run with the flattened form and returned `1`.
- **The rule number.** Task 4 inserts item `11` into `SKILL.md`'s Rules, after
  item `10`. Two passages cite it by that number and must match it: Task 5's
  Kanri step 1 and Task 5's Sekkei bullet, each ending `(contract rule 11)`.
  Task 2's second Timing paragraph, a batch A passage, deliberately does not,
  so the batch A boundary carries no forward reference — which the rule-11
  sweep in "How a batch is verified" proves at each boundary rather than
  asserts.
- **Line endings.** `roles/kanri.md`, `roles/sekkei.md`, and
  `docs/notes/tanto-consistency-checks.md` are `w/crlf`; `SKILL.md`,
  `README.md`, and `templates/kanri-handover.md` are `w/lf`. Every task's
  line-ending step names the file's own value, and no step expects `w/mixed`.
- **The trailer string.** Every commit command ends with
  `-m "Co-Authored-By: Claude <noreply@anthropic.com>"`, and every trailer
  check greps the prefix `Co-Authored-By: Claude`, which is the same string
  Task 7 Step 12 counts over the whole branch.
- **Linted versus ignored.** `SKILL.md`, `README.md`, `roles/kanri.md`,
  `roles/sekkei.md`, and the note are markdownlint-checked, and none of their
  new passages carries a bare `<placeholder>` — every angle-bracket blank in
  Task 1's Start step 5 is inside a code span, and Tasks 2, 4, 5, and 6 add
  none. `templates/kanri-handover.md` is markdownlint-ignored, so Task 3's
  bare `<...>` blanks and its long line are correct there.
- **Runtime text.** No new passage contains the string `skills/tanto/`. Task 4
  Step 7 and Task 7 Step 7 both assert it, the second over the whole skill.
