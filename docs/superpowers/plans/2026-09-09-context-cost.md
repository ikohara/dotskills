# context-cost Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every `tanto` session one measured **reading** of its own
transcript, taken at its boundaries and sent with the lines it already sends;
turn the roster's Residency into a table of those readings with an archive
that keeps them across runs; make Kanri's cold read a read of the plan's
**frame**; make a peer's compaction a replacement condition and a compaction
summary's claims about the human unverified until the human confirms them; end
the reuse of a Sekkei across topics; let a resumed session rejoin the run; and
close four small `tanto` items.

**Architecture:** Markdown only, and every edit is a **passage**, never a file.
Thirteen files carry passages — `skills/tanto/SKILL.md`, the four role files,
five templates, one new template, the skill's `README.md`, and
`docs/notes/tanto-consistency-checks.md`. For each passage the task carries the
anchor, the old passage verbatim from the tree where the shape is a
replacement, and the new passage verbatim, and changes no other byte, so the
diff of a touched file against the merge base is exactly the union of its
passages so far. `skills/tanto/templates/roster-archive.md` is the one
whole-file block. There is no executable code; the two commands the skill
gains — the reading pipeline and the frame command — are fenced blocks inside
Markdown files.

**Tech Stack:** Markdown; `pre-commit` through `scripts/lint.sh` and
`scripts\lint.bat`; the pre-commit cache's `markdownlint-cli2` for the
markdownlint-exempt templates, on an extracted tree, per
`docs/notes/tanto-consistency-checks.md` check 9; `git diff` against the merge
base, `git ls-files --eol`, `grep -cF` with every needle set from a quoted
heredoc; `uv run --no-project` with PyYAML for the `SKILL.md` frontmatter load;
`wc`, `grep`, `awk`, and `echo` for the two commands the skill gains.

**Spec:** `docs/superpowers/specs/2026-09-09-context-cost-design.md` — the
binding authority. This plan argues from it; where the plan and the spec
disagree, the spec wins, and executors read both. The spec's sections "The
transcript reading", "The roster: a Residency table, and an archive", "Kanri's
rules", "A resumed session rejoins the run", "The small items", "Where each
change lives", "What the plan must contain", and "Verification" are what the
eight tasks below implement. Branch `context-cost`, cut from `main` after
requirement-extraction merged; **no worktree**; **no push**.

## Global Constraints

- American English in every file, commit message, and comment.
- Every fenced `bash` block in this plan runs in **Git Bash**, from the
  repository root — on this Windows host, not PowerShell. Only the lint line
  has a `scripts\lint.bat` alternative; the greps, the quoted heredocs, and the
  `tr` pipelines have none.
- Lint before every commit: `./scripts/lint.sh <explicit file paths>`
  (Windows: `scripts\lint.bat <paths>`), every hook `Passed` or `Skipped`; a
  directory argument makes every hook skip, so always name files.
  `.markdownlint-cli2.yaml` ignores `skills/**/templates/**`, so on the six
  template paths the lint runs only the whitespace, final-newline,
  line-ending, and frontmatter hooks; markdownlint binds on `SKILL.md`, the
  four role files, `skills/tanto/README.md`, and
  `docs/notes/tanto-consistency-checks.md`. The note's **check 9** is where the
  template Markdown meets markdownlint, on an extracted tree at paths the
  configuration does not ignore; task 8 runs it.
- Commit by explicit path only: `git add <paths>` — needed for the one new
  file, `skills/tanto/templates/roster-archive.md`, because `--only` cannot
  pick up an untracked path — then
  `git commit --only <paths> -m "<subject>" -m "<body>" -m "Co-Authored-By: Claude <noreply@anthropic.com>"`.
  Never `git add -A` / `.` / `-u`, never a bare `git commit` or
  `git commit -a`, never `--no-verify`, never amend, never push, no worktree.
- Every commit message ends with a trailer whose line begins
  `Co-Authored-By: Claude` — verify with
  `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'` (expect `1`).
- Models for this run: implementers `sonnet`, every reviewer `opus`, fix rounds
  4-5 `opus`; never dispatch a subagent on `fable`; every dispatch names its
  `model`.
- **Rule 11 applies.** This plan edits `skills/tanto/` — the files the run's
  sessions load — so, per contract rule 11 and decision-5c8e (a plan that edits
  tanto runs on the skill it is editing): **the boundary from which a role may
  be started or replaced is the final boundary, batch B**, because Kanri's role
  file in batch B answers what the contract in batch A introduces; until then
  the authority for the run's sessions is these Global Constraints, Kanri's
  orders line, and the batch prompts, not the role text on disk. A replacement
  waits for batch B's boundary, and this plan expects **one Jisso throughout**.
  Kanri's own handover and a Kaiseki created on a Kanri ruling are rule 11's
  two standing exceptions and are unchanged by this plan.
- **Never edit**: the repo-root Markdown (`README.md`, `CONTRIBUTING.md`,
  `AGENTS.md`, `CLAUDE.md`); linter or formatter config; the superpowers
  plugin; `skills/kisou/`, `skills/shoroku/`, `skills/seisho/`,
  `skills/wayaku/`; `skills/tanto/templates/batch-prompt.md`,
  `templates/bug-report.md`, `templates/kaiseki-brief.md`,
  `templates/review-brief.md`, and `templates/tanto.json`; and anything under
  `docs/` **except** `docs/notes/tanto-consistency-checks.md`, which task 8
  edits because its checks are what this plan's verification runs.
- **The write-out exception.** T1, T2, and every exit shoroku write under
  `docs/requirements/`, `docs/design/`, `docs/decisions/`, `docs/issues/`,
  `docs/notes/`, and `docs/reports/`. No task touches those paths except
  `docs/notes/tanto-consistency-checks.md` in task 8, and "never edit" above
  does not forbid a session's own shoroku write-out. `docs/design/4807-tanto.md`
  ("ten templates, sixteen files", the kept-Sekkei bullet) is T2's under the
  adoption rule, not a task.
- **The hotfix lane stays closed on the files this plan lists**
  (decision-2f36): a defect noticed in one of them during the run is a
  Rulings-needed item in the report, not a hotfix.
- **The whole-branch review package excludes** exactly the commits whose
  subject begins `docs: T<n> shoroku` or `docs: exit shoroku`. One Kanri commit
  already on this branch is outside the plan's scope and the dispatch names it
  by subject and path: **"docs(issues): tanto keeps both untracked directories
  at a plan close"**, `docs/issues/open/12d3-*.md`. Wherever this plan states
  what the merge base should show, that commit's path and the spec at
  `docs/superpowers/specs/2026-09-09-context-cost-design.md` and this plan at
  `docs/superpowers/plans/2026-09-09-context-cost.md` are named beside the
  task's own files.
- **Passages, not files.** A task replaces exactly the old passage with the new
  one, or inserts the new passage next to its anchor, and the file's other
  bytes do not change. The diff of a file against the merge base —
  `git diff "$(git merge-base main HEAD)" -- <file>`, which sees the working
  tree and so is right before and after a task's commit — is exactly its
  passages so far. A fix outside a passage is a Rulings-needed item.
- **Needles from heredocs.** Every anchor and passage check sets its needle
  with `needle=$(cat <<'EOF'` … `EOF)` and passes it as `"$needle"`; a needle is
  never inlined in quotes. A flattened `grep -cF` (CR stripped, lines joined,
  spaces squeezed) returns `0` or `1` and pins presence; a raw `grep -cF` on
  the file counts lines.
- **Line endings per file, never mixed.** `git ls-files --eol <file>` before
  each edit says which ending the file has in this working tree; a passage is
  written with that ending; after the edit the same command shows the same
  value, never `w/mixed`. Measured 2026-09-09: `w/crlf` for
  `skills/tanto/SKILL.md`, `skills/tanto/README.md`, the four role files,
  `templates/batch-report.md`, `templates/kaiseki-report.md`, and
  `docs/notes/tanto-consistency-checks.md`; `w/lf` for `templates/roster.md`,
  `templates/kanri.md`, and `templates/kanri-handover.md`. Those values are
  dated evidence, not the rule — design-4807 records that the split is an
  artifact of how each file was written and that a fresh clone checks out
  every `.md` as CRLF — and the rule is the procedure: read the ending at edit
  time. The one new file, `templates/roster-archive.md`, takes the ending
  `git ls-files --eol skills/tanto/templates/roster.md` reports at edit time
  (`w/lf` on this tree). The index is LF (`* text=auto`), so the "LF will be
  replaced by CRLF" warning at commit is not a defect. Quote the shape of
  `git ls-files --eol` output, never its column spacing.
- **`SKILL.md`'s frontmatter is unchanged** — `name: tanto`, and a
  `description` with no colon followed by a space anywhere in its value. No
  passage goes near it; the note's **check 8** loads it through PyYAML.
- **No heading of an existing section is renamed.** Kanri's Create, Replace,
  and Delete tables, the roster's `## Residency`, `## Shoroku candidates`, and
  `## Events`, and the handover template's nine sections keep their headings.
  The one exception the spec names: `### The four cases` in
  `skills/tanto/roles/kanri.md` becomes `### The five cases`, and the reference
  to it in Start step 4 changes with it (task 5, P5.1 and P5.2). The two new
  headings this plan adds are `## The transcript reading` and `## Resuming` in
  `SKILL.md`, and `### Readings` in `roles/kanri.md`.
- **The four SDD stop classes stay byte-identical** in `skills/tanto/SKILL.md`
  and `skills/tanto/roles/jisso.md`. No passage touches either copy; the note's
  **check 5** proves it. `SKILL.md`'s line number for that quote moves with the
  inserted sections, which is why the check pins content and not a line.
- **The spec's blocks reach the tree verbatim.** A flaw found in one during
  the run is a whole-branch-review item, not a task-level edit (design-4807,
  "a flaw in the spec's own block is never a task-level edit"); none is known
  at the plan's commit — the one the drafter found (the cold-read step said
  "below" of a command placed above it) was fixed in the spec before this
  plan was committed, and P5.6 carries the corrected block.
- **A passage's wrap column belongs to the destination file.** Every block this
  plan authors is wrapped at **80 columns** for prose in every `skills/tanto/`
  file and in `docs/notes/tanto-consistency-checks.md`; table rows, fenced
  command lines, and the handshake and residency lines are unwrapped. A block
  transcribed from the spec keeps the spec's bytes, and no task re-wraps one.
- No commit hashes and no user-specific paths in tracked content. The note's
  check 7 sweeps both.

---

## File structure

Thirteen files carry a passage: one is created, twelve are modified. Each
passage's shape is stated where it is written — a **replacement** supersedes
the old passage; an **insertion** adds text next to an anchor that stays. The
table is the spec's "Where each change lives" row for row, and it names the
**quoting** locations as well as the defining ones, because the spec's own note
on that table is that a table of this kind drifts by listing definitions and
missing quotes. The whole-tree sweeps of task 8 are what decide the set, not
this table.

| File | Passages | Task |
| --- | --- | --- |
| `skills/tanto/SKILL.md` | P1.1 the Invocation table's `resume` row, "those five", and the `/tanto resume` sentence; P1.2 the handshake line's `transcript=`; P1.3 the sentence after the `mode=` paragraph; P1.4 the section `## The transcript reading` with its closing compaction paragraph; P1.5 the section `## Resuming`; P1.6 the Messages bullet on the boundary reply; P1.7 the Session exit `exit write-out committed:` line; P1.8 the Session exit file pattern's Kanri entry; P1.9 the Artifacts row for `roster-archive.md`; P1.10 the Artifacts row for `plan-dryrun.md`; P1.11 the Artifacts row for `compaction-<role>-<n>.md`; P1.12 the Artifacts row's changed Kanri exit-proposal path; P1.13 "There are eleven" and `templates/roster-archive.md` in the templates list; P8.10 the "Handshake and roster" column list gains `transcript`, added at Kanri's cold read (R-9) and landed by task 8 | 1, 8 |
| `skills/tanto/templates/roster.md` | P2.1 the Keeping rule's handshake bullet gains the resume sentence; P2.2 the Keeping rule's dead-row bullet; P2.3 the address book's `Transcript` column; P2.4 the `## Residency` section as a table; P2.5 the `## Events` sentence on the plan close | 2 |
| `skills/tanto/templates/roster-archive.md` | P2.6 the whole file, **new** | 2 |
| `skills/tanto/templates/kanri.md` | P3.1 the `S-n` table's Stage cell Kanri pattern; P3.2 the two Written-column sentences under that table; P3.3 the Measurements fixed row and its sentence | 3 |
| `skills/tanto/templates/batch-report.md` | P3.4 `- Transcript — <reading>` in the header list | 3 |
| `skills/tanto/templates/kaiseki-report.md` | P3.5 `- Transcript — <reading>` under "Tree state on exit" | 3 |
| `skills/tanto/templates/kanri-handover.md` | P3.6 the `(unverified)` marking in "Rulings the next batch inherits"; P3.7 the Residency section as one row plus the reading | 3 |
| `skills/tanto/roles/jisso.md` | P4.1 the self-check and the report's Transcript line at "At the boundary"; P4.2 the exit line carrying the reading; P4.3 the Models table's review-brief-writer row | 4 |
| `skills/tanto/roles/kaiseki.md` | P4.4 the self-check before the report's one line; P4.5 the report's Transcript line under "Tree state on exit"; P4.6 the exit line carrying the reading | 4 |
| `skills/tanto/roles/sekkei.md` | P4.7 the opening paragraph's grant clause; P4.8 Step 4 reordered with `plan-dryrun.md`; P4.9 the plan-committed line; P4.10 the boundary reply's self-check and reading; P4.11 the exit line carrying the reading | 4 |
| `skills/tanto/roles/kanri.md` | P5.1 Start step 4's reference; P5.2 the `### The five cases` heading; P5.3 the Resumed Kanri case and the Recovery case's added clause; P5.4 the handshake match in "On a handshake"; P5.5 "Recovery after a VS Code restart" as the many-at-once procedure; P5.6 the plan-committed sentence, the frame command, and step 1 of "When the plan lands"; P6.1 the trigger's boundary sentence and the self-check; P6.2 the trigger paragraph; P6.3 the bootstrap step's Residency row; P6.4 the Handover case's Residency row; P6.5 loop step 6's Residency row and reading; P6.6 the residency lines to the human; P6.7 the paragraph that follows them; P6.8 the `### Readings` subsection with the `compacted:` handling; P7.1 the Replace table's compaction rows; P7.2 the Delete table's Sekkei row; P7.3 the Delete table's plan-close row; P7.4 "Your own exit"'s pattern; P7.5 the adoption rule's reference-translation sentence; P7.6 the adoption rule's two Written-column sentences; P7.7 the T0 and T1 escalation clause; P7.8 the T2 step 2 escalation clause and the direction's Residency rows for the report; P7.9 the Exit shoroku step 2 escalation clause; P7.10 the commit window's quote of Sekkei's boundary reply; P7.11 the Exit shoroku step 3 quote of `exit write-out committed:`; P7.12 the human-access item's kept-Sekkei clause | 5, 6, 7 |
| `skills/tanto/README.md` | P8.1 the state-in-files bullet gains the reading; P8.2 `/tanto resume` in Usage; P8.3 the templates list gains `roster-archive.md`; P8.4 the designs list gains this spec | 8 |
| `docs/notes/tanto-consistency-checks.md` | P8.5 the Versions bullet; P8.6 check 1's list and count; P8.7 check 2's expected list and count; P8.8 check 3's map and count; P8.9 check 6's two Residency pins, five new routed strings, and its expected sequence and prose | 8 |

**Files that must NOT change.**

- `skills/tanto/templates/batch-prompt.md`, `templates/bug-report.md`,
  `templates/kaiseki-brief.md`, `templates/review-brief.md`, and
  `templates/tanto.json` — the spec's "Not changed by the plan". Task 8
  step 24 proves it by name.
- Everything under `docs/` except `docs/notes/tanto-consistency-checks.md`. In
  particular `docs/design/4807-tanto.md`, `docs/requirements/`,
  `docs/decisions/`, `docs/issues/`, and `docs/reports/` are T1's and T2's, not
  the plan's, and `docs/superpowers/` holds only the spec and this plan.
- Repo-root Markdown, linter and formatter configuration, the superpowers
  plugin, and every other skill under `skills/`.

Task 8 both edits files and sweeps the tree; its sweep steps write nothing and
their recorded output is part of the deliverable, so its dispatch tells the
reviewer to **re-run** the sweeps rather than trust the report — a
verification-only obligation in the sense `skills/tanto/roles/jisso.md`
defines, carried by a task that also commits.

---

### Task 1: `skills/tanto/SKILL.md` — the reading, Resuming, and the contract's lines

**Files:**

- Modify: `skills/tanto/SKILL.md` — thirteen passages, P1.1 to P1.13.

**Interfaces:**

- Consumes: nothing. The tree as it stands on the branch.
- Produces: every string the later tasks reference. They are, exactly:
  - the literal reading line, spelled **only here**, inside the pipeline's
    `echo`: `transcript: $b B, $r records, $w wake-ups, $c compactions`;
  - the placeholder `<reading>`, which every other file carries instead, and
    the form `— <reading>` in which it is appended to a line;
  - `transcript=`, the handshake blank, and `transcript: unavailable` for a
    session that cannot read its own file;
  - `compacted: <path>` and `confirmed: <path>`, the two lines of the
    compaction-confirmation loop;
  - `resumed: <old name> → <new name>`, the roster Events line of a resume;
  - `/tanto resume`, the fifth invocation word;
  - `.superpowers/sdd/<plan-basename>/compaction-<role>-<n>.md`,
    `.superpowers/sdd/<topic>/plan-dryrun.md`,
    `.superpowers/sdd/roster-archive.md`, and
    `templates/roster-archive.md`;
  - `exit-kanri-<YYYY-MM-DD>-<name>`, the Kanri exit-file pattern, which
    `templates/kanri.md` mirrors as `exit:kanri-<YYYY-MM-DD>-<name>`.
- `skills/tanto/SKILL.md` is **not** markdownlint-ignored. Its frontmatter is
  not touched by any passage; task 8 loads it through PyYAML (the note's
  check 8). The four-SDD-stop-classes quote is not touched either; the note's
  check 5 pins it by content, and the line number moves with P1.4 and P1.5.
- Long lines: `.markdownlint-cli2.yaml` does not bind MD013 here — the file
  already carries lines of 148 and 216 characters — so the reading pipeline's
  `grep -Ec` line (148 characters) and the Resuming section's two long lines
  (81 and 92 characters) are transcribed as the spec wrote them and are **not**
  re-wrapped.

**The needle form, used in every anchor and passage check of this plan.** Every
check sets its needle with a quoted heredoc and passes it as `"$needle"`; a
needle is never inlined in single or double quotes, because nearly every
passage contains an apostrophe, a backtick, or a double quote. A **raw** check
greps the file as it is — `grep -cF -- "$needle" <file>` — and counts lines, so
it pins a phrase that stays on one line. A **flattened** check strips CR, joins
the lines with spaces, and squeezes the runs —
`tr -d '\r' < <file> | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"` — so it
pins a passage that wraps, and it returns `0` or `1`, never an occurrence
count. The needle of a flattened check is written as one physical line inside
the heredoc. Every fenced `bash` block in this plan runs in **Git Bash**, from
the repository root, on this Windows host — not PowerShell.

**When a replacement's anchor is the old passage**, the pre-edit check returns
`1`, and what it returns after a correct edit depends on the shape: `0` when
the new passage supersedes the whole needle, `1` when the needle is the
passage's unchanged opening, which survives into the new passage. Every anchor
step says which — measured on the dry run's applied copies, 2026-09-09 — so
that the boundary's re-run reads each block against its own stated value; the
inversion itself is pinned by the Verify step's joined needle, which runs the
old text into what followed it and is `0` after every correct replacement.

- [ ] **Step 1: Read the file's line ending, before the first edit**

````bash
git ls-files --eol skills/tanto/SKILL.md
````

Expected: `i/lf`, `w/crlf`, `attr/text=auto` — quote the shape, not the column
spacing. Measured 2026-09-09. Every passage below is written **CRLF**.

- [ ] **Step 2: Verify the P1.1 anchor, before the edit**

Anchor — the last row of the Invocation table and the sentence under it, which
is also the old passage, so this check inverts after the edit.

````markdown
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |

Any other word: say the role is unknown, list those four ids, and stop.
````

Run:

````bash
needle=$(cat <<'EOF'
Any other word: say the role is unknown, list those four ids, and stop.
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09. After the edit this returns `0`.

- [ ] **Step 3: P1.1 — the `resume` row, "those five", and the `/tanto resume` sentence**

This is a **replacement** of the three lines above by the seven below. The
table gains one row; "four ids" becomes "five ids"; and one authored sentence
follows, saying what `/tanto resume` skips.

New passage, written CRLF:

````markdown
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |
| `resume` | `resume` |

Any other word: say the role is unknown, list those five ids, and stop.

`/tanto resume` skips the start sequence — no model check, no first
handshake — and runs "Resuming" below.
````

- [ ] **Step 4: Verify P1.1**

````bash
needle=$(cat <<'EOF'
| `かいせき`, `解析`, `kaiseki` | `kaiseki` | | `resume` | `resume` | Any other word: say the role is unknown, list those five ids, and stop. `/tanto resume` skips the start sequence — no model check, no first handshake — and runs "Resuming" below.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -cF -- '| `resume` | `resume` |' skills/tanto/SKILL.md
grep -c 'those five ids' skills/tanto/SKILL.md
grep -c 'those four ids' skills/tanto/SKILL.md
````

Expected, line by line: `1`, `1`, `1`, `0`. Baseline `0`, `0`, `0`, `1`,
measured 2026-09-09.

- [ ] **Step 5: Verify the P1.2 anchor, before the edit**

Anchor — the handshake line itself, which is the old passage, and the needle is
the passage's unchanged opening, which survives into the new passage, so this
check still returns `1` after the edit; the Verify step's joined needle pins the
inversion.

````bash
needle=$(cat <<'EOF'
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> branch=<branch> mode=<permission mode|unknown>
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 6: P1.2 — the handshake line gains `transcript=`**

This is a **replacement** of that one line inside the `text` fence by the one
below. Nothing else in the fence changes; the line is deliberately unwrapped.

New passage — the spec's block under "Which files spell what", written CRLF:

````text
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> branch=<branch> mode=<permission mode|unknown> transcript=<absolute path|unavailable>
````

- [ ] **Step 7: Verify P1.2**

````bash
needle=$(cat <<'EOF'
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> branch=<branch> mode=<permission mode|unknown> transcript=<absolute path|unavailable>
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
old=$(cat <<'EOF'
mode=<permission mode|unknown> ```
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'transcript=' skills/tanto/SKILL.md
````

Expected: `1`, then `0`, then `1`. The old line is a prefix of the new one, so
a substring test on the old text alone would still find it; the second check
pins the old line's end against the closing fence that follows it, which
only the unedited line has. The third count rises to `3` once P1.3 and P1.5
have landed. Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 8: Verify the P1.3 anchor, before the edit**

Anchor — the `mode=` paragraph, which stays exactly as it is. The new sentence
goes **after** it.

````bash
needle=$(cat <<'EOF'
system prompt says auto mode is active, otherwise `unknown`. It is advisory.
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 9: P1.3 — the sentence after the `mode=` paragraph**

This is an **insertion**: one blank line, then the paragraph below, immediately
after the anchor's last line. The paragraph that follows in the file
("Jisso then **waits** for Kanri's reply.") keeps its own blank line before it.

New passage, written CRLF:

````markdown
`transcript=` is the path of this session's own transcript per "The transcript
reading", so that Kanri can record it and, where its session may read that
path, verify a reading it doubts.
````

- [ ] **Step 10: Verify P1.3**

````bash
needle=$(cat <<'EOF'
mode is active, otherwise `unknown`. It is advisory. `transcript=` is the path of this session's own transcript per "The transcript reading", so that Kanri can record it and, where its session may read that path, verify a reading it doubts.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`. The needle carries the anchor's tail, so it pins the position
too. Baseline `0`, measured 2026-09-09.

- [ ] **Step 11: Verify the P1.4 anchor, before the edit**

Anchor — the `## Messages` heading, which occurs once and stays. P1.4 and P1.5
both go **before** it, in that order.

````bash
grep -c '^## Messages$' skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 12: P1.4 — insert the section `## The transcript reading`**

This is an **insertion** between "Handshake and roster" and "Messages": the
block below, followed by one blank line, goes immediately **before** the
`## Messages` line. The blank line that already precedes `## Messages`
separates the previous section from the new heading. No existing heading is
renamed.

The last paragraph of the block is the compaction rule for every role, which
the spec places as "a closing paragraph of 'The transcript reading'". The rest
is the spec's fenced block, byte for byte; the `grep -Ec` line is 148
characters and is **not** wrapped.

New passage — the spec's block under "The transcript reading", with its closing
compaction paragraph, written CRLF:

`````markdown
## The transcript reading

Every session can measure its own context from its transcript, the file the
harness appends to on disk as the session runs. The **reading** is four
figures from that file, taken by the session itself, and it is the only cost
signal the skill uses. The `tokens left` figure the harness prints is not one:
its unit is not documented as the context window.

Locate the file from the scratchpad path the system prompt names,
`<...>/<project slug>/<session id>/scratchpad`: the transcript is
`<config dir>/projects/<project slug>/<session id>.jsonl`, where the config
directory is `$CLAUDE_CONFIG_DIR` when set and `~/.claude` otherwise. Then, in
a POSIX shell with `T` the transcript path:

```bash
b=$(wc -c < "$T"); r=$(wc -l < "$T")
w=$(grep '"type":"user"' "$T" | grep -vc '"tool_result"')
c=$(grep '"type":"user"' "$T" | grep -v '"tool_result"' | grep -Ec '"(content|text)":"This session is being continued from a previous conversation')
echo "transcript: $b B, $r records, $w wake-ups, $c compactions"
```

- **Bytes** and **records** are the file's size and its line count, one JSON
  record per line.
- **Wake-ups** are the records of `type: user` that carry no tool result: one
  per human message, peer message, or idle notice, each the start of a turn
  that re-reads the whole context. The test is a substring of the line, so
  the count may be off by one.
- **Compactions** are the wake-ups whose text begins with the harness's
  phrase. The check is on the record type and the text's first characters; a
  plain grep for the phrase over-counts, because the phrase also appears in
  tool output and in this file. The phrase is the harness's and may change: a
  reworded one reads as `0`, and a compaction the session notices for itself
  is still the signal it always was.

The line the command prints is the reading, and it travels as it is: appended
after ` — ` to the boundary and exit lines the roles already send, and written
into the batch and Kaiseki reports where their templates have a slot. A
compaction does not shrink the file, and a tool result is stored at full size,
so bytes overstate what the context holds; the figures are compared with each
other across sessions, never with a token count.

A session whose transcript is not where this says — another host, a config
directory the environment does not name, a read the session is not permitted
— sends `transcript: unavailable — <one line why>` in its place.

A session whose reading shows a compaction it has not yet reported writes
every item its summary attributes to the human — "the human said", "ruled",
"saw", "confirmed" — one per line, to
`.superpowers/sdd/<plan-basename>/compaction-<role>-<n>.md` (the topic
directory for Sekkei; `<n>` one more than the highest such file for that
role, so that a second compaction or a replaced session does not overwrite
the first), names the file in its next line to Kanri as
`compacted: <path>`, and until Kanri answers `confirmed: <path>` acts on
none of those items beyond finishing the task in hand. Two sessions have no
Kanri to answer: Kanri itself, whose own case is its handover file, and a
standalone Kaiseki, which puts the items to the human in its own window.
What the harness summarizes is not the human's words; the human's words
are in the dialogue file, the ledger, and the human's own window.
`````

- [ ] **Step 13: Verify P1.4**

````bash
grep -c '^## The transcript reading$' skills/tanto/SKILL.md
needle=$(cat <<'EOF'
echo "transcript: $b B, $r records, $w wake-ups, $c compactions"
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
tail=$(cat <<'EOF'
A session whose transcript is not where this says — another host, a config directory the environment does not name, a read the session is not permitted — sends `transcript: unavailable — <one line why>` in its place. A session whose reading shows a compaction it has not yet reported writes every item its summary attributes to the human — "the human said", "ruled", "saw", "confirmed" — one per line, to
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$tail"
grep -rcF 'transcript:' skills/tanto
````

Expected: `1`, `1`, `1`, then one line
`skills/tanto/SKILL.md:2` and `0` for every other file of the skill — the
literal reading line and the `transcript: unavailable` fallback are spelled
in `SKILL.md` alone. Baseline `0`, `0`, `0`,
and `0` everywhere, measured 2026-09-09.

- [ ] **Step 14: P1.5 — insert the section `## Resuming`**

This is an **insertion** immediately **before** the `## Messages` line, which
now sits below the section P1.4 added, so `## Resuming` lands after "The
transcript reading" and before "Messages" — the order the spec states. The
block is followed by one blank line.

New passage — the spec's block under "`SKILL.md`: the fifth invocation word,
and a Resuming section", written CRLF. Its two long lines (81 and 92
characters) are the spec's and are **not** re-wrapped:

`````markdown
## Resuming

A Claude Code conversation that is resumed — after an editor restart, a
closed tab, an ended terminal — keeps its context, its session id, and its
transcript, and comes back under a new name and `[ref]`; nothing in the
transcript marks the resume (measured 2026-09-09). Its old address is dead
from then on. The transcript path the handshake carried is the identity that
survives, and the roster's Transcript column holds it.

`/tanto resume`, typed by the human in a window, and the self-check every
role runs at each of its boundaries are the same act: run `ListAgents` once;
find the roster row whose Transcript column is this session's own transcript
path; if the name the listing prints for this session is that row's, nothing
happened. If it differs, this session was resumed:

- A role sends its handshake line again, to the roster's first data row,
  with the same `transcript=`. Kanri matches the path, rewrites the row in
  place with the new name and `[ref]` — status `live`, no `dead` row — writes
  an Events line `resumed: <old name> → <new name>`, and answers with its own
  address. The role continues where it was; its context is the same. A row a
  recovery had already marked `dead` returns to `live` the same way, and the
  Events line corrects the earlier one.
- Kanri rewrites the roster's first data row with its new name and `[ref]`,
  and sends `kanri-address: <name> [<ref>] — resumed; the roster's first row is rewritten`
  to every live peer whose name `ListAgents` still lists. A peer not listed
  was resumed too, and re-handshakes on its own `/tanto resume`, finding the
  new first row.

After an editor restart, which resumes every window at once, the human types
`/tanto resume` in Kanri's window first and then in each other window, in any
order; no address is pasted. A session whose path matches no row is not a
resumed role: `/tanto resume` says so and stops, and the human runs
`/tanto <role> <address>` there as for a new session.

`/tanto resume` reads this file and nothing else. The role file is already in
the session's context, which is what a resume preserves.
`````

- [ ] **Step 15: Verify P1.5**

````bash
grep -c '^## Resuming$' skills/tanto/SKILL.md
needle=$(cat <<'EOF'
`/tanto <role> <address>` there as for a new session. `/tanto resume` reads this file and nothing else. The role file is already in the session's context, which is what a resume preserves. ## Messages
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -cF -- '/tanto resume' skills/tanto/SKILL.md
grep -c 'transcript=' skills/tanto/SKILL.md
````

Expected: `1`; `1` — the needle ends with `## Messages`, so it pins the
position as well as the text; `6`; `3`. Baseline `0`, `0`, `0`, `0`, measured
2026-09-09.

- [ ] **Step 16: Verify the P1.6 anchor, before the edit**

Anchor — the Messages bullet on the boundary reply, which is also the old
passage, and the needle is the passage's unchanged opening, which survives into
the new passage, so this check still returns `1` after the edit; the Verify
step's joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
- At a batch boundary Kanri has verified, Sekkei answers in one line,
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 17: P1.6 — the boundary reply carries the reading**

This is a **replacement** of the four lines below by the four that follow them.

Old passage — replace exactly these 4 lines and nothing else:

````markdown
- At a batch boundary Kanri has verified, Sekkei answers in one line,
  `committed <subject>` or `nothing to commit`; Kanri sends the next batch
  prompt only after that reply, or, when the reply is overdue, after the
  notice of a subscription made then.
````

New passage, written CRLF:

````markdown
- At a batch boundary Kanri has verified, Sekkei answers in one line,
  `committed <subject>` or `nothing to commit`, each with its reading appended
  after ` — `; Kanri sends the next batch prompt only after that reply, or,
  when the reply is overdue, after the notice of a subscription made then.
````

- [ ] **Step 18: Verify P1.6**

````bash
new=$(cat <<'EOF'
- At a batch boundary Kanri has verified, Sekkei answers in one line, `committed <subject>` or `nothing to commit`, each with its reading appended after ` — `; Kanri sends the next batch prompt only after that reply, or, when the reply is overdue, after the notice of a subscription made then.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
- At a batch boundary Kanri has verified, Sekkei answers in one line, `committed <subject>` or `nothing to commit`; Kanri sends the next batch prompt only after that reply, or, when the reply is overdue, after the notice of a subscription made then.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF 'nothing to commit' skills/tanto/SKILL.md
````

Expected: `1`, `0`, `1`. The third is the note's check 6 value for this file
and must not move. Baseline `0`, `1`, `1`, measured 2026-09-09.

- [ ] **Step 19: Verify the P1.7 anchor, before the edit**

Anchor — the two lines of the "Session exit" paragraph that carry the `exit
write-out` lines, which are the old passage, and the needle is the passage's
unchanged opening, which survives into the new passage, so this check still
returns `1` after the edit; the Verify step's joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
line and the path; Kanri sends `exit: direction at <path>`; the session answers
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 20: P1.7 — the `exit write-out` lines carry the reading**

This is a **replacement** of the two lines below by the three that follow. The
sentence continues on the file's next line (`session that has not answered …`),
which does not change.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
line and the path; Kanri sends `exit: direction at <path>`; the session answers
`exit write-out committed: <subject>` or `exit write-out: nothing accepted`. A
````

New passage, written CRLF:

````markdown
line and the path; Kanri sends `exit: direction at <path>`; the session answers
`exit write-out committed: <subject> — <reading>` or
`exit write-out: nothing accepted — <reading>`. A
````

- [ ] **Step 21: Verify P1.7**

````bash
new=$(cat <<'EOF'
line and the path; Kanri sends `exit: direction at <path>`; the session answers `exit write-out committed: <subject> — <reading>` or `exit write-out: nothing accepted — <reading>`. A session that has not answered when its idle notice arrives
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
line and the path; Kanri sends `exit: direction at <path>`; the session answers `exit write-out committed: <subject>` or `exit write-out: nothing accepted`. A
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
````

Expected: `1`, then `0`. The first needle runs on into the unchanged sentence,
so it pins the join as well as the passage. Baseline `0`, `1`, measured
2026-09-09.

- [ ] **Step 22: Verify the P1.8 anchor, before the edit**

Anchor — the two lines of the file-pattern paragraph that name Kanri's suffix,
which are the old passage, so this check inverts.

````bash
needle=$(cat <<'EOF'
the date for Kanri (`exit-kanri-<YYYY-MM-DD>`); the conductor ledger's Stage
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 23: P1.8 — Kanri's exit-file pattern gains the bare name**

This is a **replacement** of the two lines below by the three that follow. The
paragraph continues on the file's next line (`an attached Kaiseki's under …`),
which does not change.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
the date for Kanri (`exit-kanri-<YYYY-MM-DD>`); the conductor ledger's Stage
values mirror it. The files live where the role's other files live: Jisso's and
````

New passage, written CRLF:

````markdown
the date and the bare name for Kanri (`exit-kanri-<YYYY-MM-DD>-<name>`); the
conductor ledger's Stage values mirror it. The files live where the role's
other files live: Jisso's and
````

- [ ] **Step 24: Verify P1.8**

````bash
new=$(cat <<'EOF'
the date and the bare name for Kanri (`exit-kanri-<YYYY-MM-DD>-<name>`); the conductor ledger's Stage values mirror it. The files live where the role's other files live: Jisso's and an attached Kaiseki's under
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
the date for Kanri (`exit-kanri-<YYYY-MM-DD>`); the conductor ledger's Stage values mirror it. The files live where the role's other files live: Jisso's and
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF 'exit-<role>' skills/tanto/SKILL.md
````

Expected: `1`, `0`, `5`. The third is the note's check 6 value for this file
and must not move. Baseline `0`, `1`, `5`, measured 2026-09-09.

- [ ] **Step 25: Verify the P1.9 anchor, before the edit**

Anchor — the Artifacts table's roster row, which stays. The new row goes
**after** it.

````bash
needle=$(cat <<'EOF'
| `.superpowers/sdd/roster.md` | Kanri | all roles | one row per role |
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 26: P1.9 — the Artifacts row for the roster archive**

This is an **insertion**: the single table row below goes immediately after the
anchor row, with no blank line. Table rows are not wrapped.

New passage, written CRLF:

````markdown
| `.superpowers/sdd/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, and refused rows with their last readings, and the closed plans' Events lines, appended at each plan close |
````

- [ ] **Step 27: Verify P1.9**

````bash
needle=$(cat <<'EOF'
| `.superpowers/sdd/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, and refused rows with their last readings, and the closed plans' Events lines, appended at each plan close |
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
grep -cF 'roster-archive' skills/tanto/SKILL.md
````

Expected: `1`, then `1` — the second rises to `2` once P1.13 has landed.
Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 28: Verify the P1.10 anchor, before the edit**

Anchor — the Artifacts table's review-brief row, which stays. The new row goes
**after** it.

````bash
needle=$(cat <<'EOF'
the brief writer Kanri dispatches | Kanri, then the human through Sekkei
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 29: P1.10 — the Artifacts row for the dry-run report**

This is an **insertion**: the single table row below goes immediately after the
anchor row, with no blank line.

New passage, written CRLF:

````markdown
| `.superpowers/sdd/<topic>/plan-dryrun.md` | Sekkei | the plan reviewer, Kanri | each verification command of the plan run once on scratch copies, with its output and the expectation |
````

- [ ] **Step 30: Verify P1.10**

````bash
needle=$(cat <<'EOF'
| `.superpowers/sdd/<topic>/plan-dryrun.md` | Sekkei | the plan reviewer, Kanri | each verification command of the plan run once on scratch copies, with its output and the expectation |
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
grep -cF 'plan-dryrun' skills/tanto/SKILL.md
````

Expected: `1`, `1`. Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 31: Verify the P1.11 anchor, before the edit**

Anchor — the Artifacts table's exit-direction row, which stays. The new row
goes **after** it.

````bash
needle=$(cat <<'EOF'
-direction.md`, or the topic directory for Sekkei | Kanri | the exiting session
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 32: P1.11 — the Artifacts row for the compaction file**

This is an **insertion**: the single table row below goes immediately after the
anchor row, with no blank line.

New passage, written CRLF:

````markdown
| `.superpowers/sdd/<plan-basename>/compaction-<role>-<n>.md`, or the topic directory for Sekkei | the compacted session | Kanri, or the human for Kanri itself and a standalone Kaiseki | every item a compaction summary attributes to the human, one per line, rewritten with the human's answers |
````

- [ ] **Step 33: Verify P1.11**

````bash
needle=$(cat <<'EOF'
| `.superpowers/sdd/<plan-basename>/compaction-<role>-<n>.md`, or the topic directory for Sekkei | the compacted session | Kanri, or the human for Kanri itself and a standalone Kaiseki | every item a compaction summary attributes to the human, one per line, rewritten with the human's answers |
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
grep -cF 'compaction-<role>' skills/tanto/SKILL.md
````

Expected: `1`, then `2` — the row and the closing compaction paragraph P1.4
added. Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 34: Verify the P1.12 anchor, before the edit**

Anchor — the Artifacts table's exit-proposal row, which is the old passage, so
this check inverts after the edit.

````bash
needle=$(cat <<'EOF'
exit-kanri-<YYYY-MM-DD>-proposal.md
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 35: P1.12 — the exit-proposal row's Kanri path gains the bare name**

This is a **replacement** of the one table row below by the one that follows.
Only the Kanri path inside the row changes.

Old passage — replace exactly this 1 line and nothing else:

````markdown
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-proposal.md`, or the topic directory for Sekkei, or `.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
````

New passage, written CRLF:

````markdown
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-proposal.md`, or the topic directory for Sekkei, or `.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
````

- [ ] **Step 36: Verify P1.12**

````bash
new=$(cat <<'EOF'
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-proposal.md`, or the topic directory for Sekkei, or `.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
EOF
)
grep -cF -- "$new" skills/tanto/SKILL.md
old=$(cat <<'EOF'
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-proposal.md`, or the topic directory for Sekkei, or `.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
EOF
)
grep -cF -- "$old" skills/tanto/SKILL.md
grep -cF 'exit-kanri-<YYYY-MM-DD>-<name>' skills/tanto/SKILL.md
grep -cF 'exit-kanri-<YYYY-MM-DD>-proposal' skills/tanto/SKILL.md
grep -cF 'exit-<role>' skills/tanto/SKILL.md
````

Expected: `1`, `0`, `2`, `0`, `5`. The `2` is the file-pattern paragraph P1.8
wrote plus this row; the `5` is the note's check 6 value and must not move.
Baseline `0`, `1`, `0`, `1`, `5`, measured 2026-09-09.

- [ ] **Step 37: Verify the P1.13 anchor, before the edit**

Anchor — the first line of the templates paragraph, which is part of the old
passage, so this check inverts after the edit.

````bash
needle=$(cat <<'EOF'
Templates are copied and filled, never restated in prose. There are ten:
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 38: P1.13 — eleven templates, and the archive named**

This is a **replacement** of the six lines below by the six that follow.

Old passage — replace exactly these 6 lines and nothing else:

````markdown
Templates are copied and filled, never restated in prose. There are ten:
`templates/roster.md`, `templates/kanri.md`, `templates/kanri-handover.md`,
`templates/bug-report.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/review-brief.md`, and
`templates/tanto.json`.
````

New passage, written CRLF:

````markdown
Templates are copied and filled, never restated in prose. There are eleven:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/review-brief.md`, and `templates/tanto.json`.
````

- [ ] **Step 39: Verify P1.13**

````bash
new=$(cat <<'EOF'
Templates are copied and filled, never restated in prose. There are eleven: `templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`, `templates/kanri-handover.md`, `templates/bug-report.md`, `templates/batch-prompt.md`, `templates/batch-report.md`, `templates/kaiseki-brief.md`, `templates/kaiseki-report.md`, `templates/review-brief.md`, and `templates/tanto.json`.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
Templates are copied and filled, never restated in prose. There are ten: `templates/roster.md`, `templates/kanri.md`, `templates/kanri-handover.md`, `templates/bug-report.md`, `templates/batch-prompt.md`, `templates/batch-report.md`, `templates/kaiseki-brief.md`, `templates/kaiseki-report.md`, `templates/review-brief.md`, and `templates/tanto.json`.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'There are eleven' skills/tanto/SKILL.md
grep -c 'There are ten' skills/tanto/SKILL.md
````

Expected: `1`, `0`, `1`, `0`. Baseline `0`, `1`, `0`, `1`, measured
2026-09-09.

- [ ] **Step 40: The file's own content greps**

````bash
grep -c '^## The transcript reading$' skills/tanto/SKILL.md
grep -c '^## Resuming$' skills/tanto/SKILL.md
grep -cF -- '| `resume` | `resume` |' skills/tanto/SKILL.md
grep -c 'transcript=' skills/tanto/SKILL.md
grep -cF -- '/tanto resume' skills/tanto/SKILL.md
grep -cF 'compacted: <path>' skills/tanto/SKILL.md
grep -cF 'confirmed: <path>' skills/tanto/SKILL.md
grep -cF 'kanri-address:' skills/tanto/SKILL.md
grep -cF -- '— <reading>' skills/tanto/SKILL.md
````

Expected, line by line: `1`, `1`, `1`, `3`, `6`, `1`, `1`, `3`, `2`. Baseline
`0`, `0`, `0`, `0`, `0`, `0`, `0`, `2`, `0`, measured 2026-09-09. The
`kanri-address:` count rises from `2` to `3` because the Resuming section adds
the resumed form of that line; task 8 records the new value in the note's
check 6.

- [ ] **Step 41: The headings are unchanged but for the two added**

````bash
diff <(grep '^#' skills/tanto/SKILL.md) <(git show main:skills/tanto/SKILL.md | grep '^#') && echo "no difference"
````

Expected: exactly the two added headings printed with `<` and a `d` — the
working tree is the **left** side, so an *added* heading prints as a deletion
and `diff` exits 1, which means `no difference` does **not** print. The two
lines are `## The transcript reading` and `## Resuming`. No other line appears.
Baseline: `no difference`, measured 2026-09-09.

- [ ] **Step 42: The stop-classes quote is untouched**

````bash
needle=$(cat <<'EOF'
that norms say you ask about first (a merge, a push to a shared branch, a
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
grep -cF -- "$needle" skills/tanto/roles/jisso.md
````

Expected: `1` and `1` — the note's check 5, on the two copies this task could
have disturbed. Baseline the same, measured 2026-09-09.

- [ ] **Step 43: The frontmatter still loads**

````bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
````

Expected: `['argument-hint', 'description', 'name']`, then `ok` — the note's
check 8. Never a bare `python`. Baseline the same, measured 2026-09-09.

- [ ] **Step 44: The line ending is what step 1 read**

````bash
git ls-files --eol skills/tanto/SKILL.md
````

Expected: the same `i/lf`, `w/crlf`, `attr/text=auto` as step 1, and never
`w/mixed`.

- [ ] **Step 45: The diff of the file is exactly its passages**

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/SKILL.md
````

Read each hunk against the thirteen blocks above and match by text, not by
index: hunk order is file order, and `git diff` merges two changed regions when
at most six unchanged lines separate them, so no hunk count is stated here. The
merge-base form sees the working tree, so it is right both before and after the
commit; `main...HEAD` would miss an uncommitted edit. No line outside P1.1 to
P1.13 may appear.

- [ ] **Step 46: Lint the path**

````bash
./scripts/lint.sh skills/tanto/SKILL.md
````

Windows alternative: `scripts\lint.bat skills/tanto/SKILL.md`. Expected: exit
0, every hook `Passed` or `Skipped`, none `Failed`. markdownlint binds on this
path. Name the file: a directory argument makes every hook skip and proves
nothing.

- [ ] **Step 47: Commit**

````bash
git commit --only skills/tanto/SKILL.md -m "feat(tanto): the contract gains the transcript reading and Resuming" -m "Every session measures its own context from its transcript: four figures by a wc-and-grep pipeline, defined once here, taken at each boundary and appended to the lines the roles already send. The handshake carries transcript=, which is the identity a resume keeps, so a resumed session rejoins through /tanto resume and the roster's Transcript column. A compaction the session has not reported writes what its summary attributes to the human to a compaction file and waits for Kanri's confirmed: line. The Artifacts table gains the archive, the dry-run report, and the compaction file; Kanri's exit files carry the bare name; there are eleven templates." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

No `git add` is needed: the file is tracked and no new path is created here.

- [ ] **Step 48: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 2: the roster template's Residency table, and the new archive

**Files:**

- Modify: `skills/tanto/templates/roster.md` — five passages, P2.1 to P2.5.
- Create: `skills/tanto/templates/roster-archive.md` — one passage, P2.6, the
  plan's only whole-file block.

**Interfaces:**

- Consumes: task 1's strings. The Residency table's columns are the four
  figures of the reading `SKILL.md` defines; the address book's new
  `Transcript` column holds the path the handshake's `transcript=` carried; the
  Keeping rule's resume sentence is the roster side of `SKILL.md`'s Resuming.
- Produces, for tasks 3, 5, 6, 7, and 8:
  - the Residency table header, byte for byte, which
    `templates/kanri-handover.md` repeats in task 3 (P3.7) and which the note's
    check 6 pins in both files in task 8:
    `| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |`;
  - `(unverified)`, the marking a reading Kanri doubted carries, which
    `templates/kanri-handover.md` also uses for a ruling known only from a
    compaction summary;
  - the file name `roster-archive.md` and the template path
    `templates/roster-archive.md`, which task 7's Delete row names and the
    note's check 3 map gains in task 8;
  - the words the plan close acts on — dead, replaced, or refused rows and the
    closed plan's Events lines move to the archive — which task 7's plan-close
    Delete row states as Kanri's procedure.
- Both files live under `skills/**/templates/**`, which
  `.markdownlint-cli2.yaml` ignores, so `./scripts/lint.sh` runs only the
  trailing-whitespace, end-of-file, mixed-line-ending, and frontmatter hooks on
  them; the note's check 9 lints the skill's non-template Markdown and does not
  name a template. The tables here are wide by design and are never wrapped.
- The three sibling templates in this working tree are `w/lf`, so the new file
  is written **LF**. It is untracked until `git add`, which is why the commit
  step adds it before `--only` can name it.

- [ ] **Step 1: Read the file's line ending, before the first edit**

````bash
git ls-files --eol skills/tanto/templates/roster.md
````

Expected: `i/lf`, `w/lf`, `attr/text=auto`. Measured 2026-09-09. Every passage
into this file is written **LF**.

- [ ] **Step 2: Verify the P2.1 anchor, before the edit**

Anchor — the Keeping rule's handshake bullet, which is also the old passage, and
the needle is the passage's unchanged opening, which survives into the new
passage, so this check still returns `1` after the edit; the Verify step's
joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
- Every handshake rewrites that role's row in full.
EOF
)
grep -cF -- "$needle" skills/tanto/templates/roster.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 3: P2.1 — a matching `transcript=` is a resume, not a second session**

This is a **replacement** of that one bullet by the four lines below.

New passage, written LF:

````markdown
- Every handshake rewrites that role's row in full. A handshake whose
  `transcript=` matches a row's Transcript column is that row's session
  resumed, and rewrites the row in place with the new name and `[ref]`, status
  `live`.
````

- [ ] **Step 4: Verify P2.1**

````bash
new=$(cat <<'EOF'
- Every handshake rewrites that role's row in full. A handshake whose `transcript=` matches a row's Transcript column is that row's session resumed, and rewrites the row in place with the new name and `[ref]`, status `live`.
EOF
)
tr -d '\r' < skills/tanto/templates/roster.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
- Every handshake rewrites that role's row in full. - A row whose session
EOF
)
tr -d '\r' < skills/tanto/templates/roster.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
````

Expected: `1`, then `0` — the second needle is the old bullet joined to the
bullet that follows it, and it can only match while the bullet is unchanged.
Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 5: Verify the P2.2 anchor, before the edit**

Anchor — the Keeping rule's dead-row bullet, whose first line stays and whose
second line is replaced.

````bash
needle=$(cat <<'EOF'
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
EOF
)
grep -cF -- "$needle" skills/tanto/templates/roster.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 6: P2.2 — a dead row waits for the plan close, then moves**

This is a **replacement** of the two lines below by the five that follow.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
  Rows are never deleted, so the run stays readable after a replacement.
````

New passage, written LF:

````markdown
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
  A dead, replaced, or refused row stays, with its Residency row, until the
  plan closes, then both move to `roster-archive.md` as one row, so the run
  stays readable after a replacement and the roster stays short.
````

- [ ] **Step 7: Verify P2.2**

````bash
new=$(cat <<'EOF'
- A row whose session is no longer listed by `ListAgents` gets status `dead`. A dead, replaced, or refused row stays, with its Residency row, until the plan closes, then both move to `roster-archive.md` as one row, so the run stays readable after a replacement and the roster stays short.
EOF
)
tr -d '\r' < skills/tanto/templates/roster.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
- A row whose session is no longer listed by `ListAgents` gets status `dead`. Rows are never deleted, so the run stays readable after a replacement.
EOF
)
tr -d '\r' < skills/tanto/templates/roster.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
````

Expected: `1`, then `0`. Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 8: Verify the P2.3 anchor, before the edit**

Anchor — the address book's header row, which is part of the old passage, and
the needle is the passage's unchanged opening, which survives into the new
passage, so this check still returns `1` after the edit; the Verify step's
joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
| Role | Name [ref] | cwd | Model | Branch | Mode | Started | Status |
EOF
)
grep -cF -- "$needle" skills/tanto/templates/roster.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 9: P2.3 — the address book gains a `Transcript` column**

This is a **replacement** of the four table lines below by the four that
follow. The column is last, holds the path the handshake carried, and holds
`unavailable` when the handshake carried that. Table rows are never wrapped.

Old passage — replace exactly these 4 lines and nothing else:

````markdown
| Role | Name [ref] | cwd | Model | Branch | Mode | Started | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live |
| <role> | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live |
````

New passage, written LF:

````markdown
| Role | Name [ref] | cwd | Model | Branch | Mode | Started | Status | Transcript |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |
| <role> | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |
````

- [ ] **Step 10: Verify P2.3**

````bash
grep -cF -- '| Transcript |' skills/tanto/templates/roster.md
grep -c 'Started | Status |$' skills/tanto/templates/roster.md
grep -c 'HH:MM> | live |$' skills/tanto/templates/roster.md
grep -c 'live | <absolute path or unavailable> |$' skills/tanto/templates/roster.md
````

Expected, line by line: `1`, `0`, `0`, `2`. The second and third checks are
**anchored on `$`** deliberately: the old header and the old data rows are
substrings of the new ones, so an unanchored `grep -cF` for them would still
return a match after a correct edit and would decide nothing. In a basic
regular expression `|` is a literal character, so these three patterns need no
escaping. Baseline `0`, `1`, `2`, `0`, measured 2026-09-09.

- [ ] **Step 11: Verify the P2.4 anchor, before the edit**

Anchor — the `## Residency` heading, which occurs once and is the first line of
the old passage. The heading is **not** renamed; the section's body becomes a
table.

````bash
grep -c '^## Residency$' skills/tanto/templates/roster.md
needle=$(cat <<'EOF'
Kanri <name> [<ref>] since <YYYY-MM-DD>: <n> batches, <m> plans, <k> compactions noticed.
EOF
)
grep -cF -- "$needle" skills/tanto/templates/roster.md
````

Expected: `1` and `1`. Measured 2026-09-09. After the edit the second returns
`0`.

- [ ] **Step 12: P2.4 — the Residency section becomes a table**

This is a **replacement** of the ten lines below — the heading, the one-line
Residency, and the paragraph under it — by the spec's block, which opens with
the same `## Residency` heading. The blank line that separates the section from
`## Shoroku candidates` stays.

Old passage — replace exactly these 10 lines and nothing else:

````markdown
## Residency

Kanri <name> [<ref>] since <YYYY-MM-DD>: <n> batches, <m> plans, <k> compactions noticed.

One line, rewritten in place by Kanri at every boundary and plan close, and the
only cross-plan counter the skill keeps. The counts are cumulative since this
Kanri's own start: `<n>` increments when Kanri accepts a batch, `<m>` when a
plan closes, `<k>` when Kanri notices a compaction. A declined handover leaves
`<k>` incremented, so the count stays a record. A handover resets the line to
the successor's name and date with zero counts.
````

New passage — the spec's block under
"`skills/tanto/templates/roster.md`, the Residency section", written LF:

`````markdown
## Residency

| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |
| <role> | <name> [<ref>] | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | — | — | — |

One row per session of the current run, live or not, Kanri's first, rewritten
in place by Kanri at every boundary and plan close from the readings the
sessions send (`SKILL.md`, "The transcript reading"): a role's row from its
latest boundary or exit line, Kanri's own from the reading it takes at the
trigger check. The last three columns are Kanri's only — batches accepted,
plans closed, and compactions noticed by the session itself, cumulative since
its own start; a declined handover leaves Noticed incremented, so the count
stays a record, and a handover resets Kanri's row to the successor with zero
counts. A reading Kanri doubted and could not verify carries `(unverified)`
after its Compactions figure; `unavailable` stands in the four figures when
the session sent that. At the plan close every row whose session is dead,
replaced, or refused moves to `roster-archive.md`, joined with its status row
above, and it is the archive's rows across runs that a threshold for the
handover or a replacement will be read from (issue-40ed).
`````

- [ ] **Step 13: Verify P2.4**

````bash
grep -c '^## Residency$' skills/tanto/templates/roster.md
header=$(cat <<'EOF'
| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
EOF
)
grep -cF -- "$header" skills/tanto/templates/roster.md
old=$(cat <<'EOF'
Kanri <name> [<ref>] since <YYYY-MM-DD>: <n> batches, <m> plans, <k> compactions noticed.
EOF
)
grep -cF -- "$old" skills/tanto/templates/roster.md
tail=$(cat <<'EOF'
after its Compactions figure; `unavailable` stands in the four figures when the session sent that. At the plan close every row whose session is dead, replaced, or refused moves to `roster-archive.md`, joined with its status row above, and it is the archive's rows across runs that a threshold for the handover or a replacement will be read from (issue-40ed). ## Shoroku candidates
EOF
)
tr -d '\r' < skills/tanto/templates/roster.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$tail"
grep -cF '(unverified)' skills/tanto/templates/roster.md
````

Expected: `1`, `1`, `0`, `1`, `1`. The fourth needle ends with
`## Shoroku candidates`, so it pins the section's position as well as its text.
Baseline `1`, `0`, `1`, `0`, `0`, measured 2026-09-09.

- [ ] **Step 14: Verify the P2.5 anchor, before the edit**

Anchor — the `## Events` heading, which occurs once and stays. The new sentence
goes **after** it.

````bash
grep -c '^## Events$' skills/tanto/templates/roster.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 15: P2.5 — the Events section says where a closed plan's lines go**

This is an **insertion**: one blank line, the sentence below, and one blank
line, immediately after the `## Events` heading, so that the bullet that
follows keeps its own blank line above it.

New passage, written LF:

````markdown
At a plan close the closed plan's lines move to `roster-archive.md`, so this
list holds the current run.
````

- [ ] **Step 16: Verify P2.5**

````bash
needle=$(cat <<'EOF'
## Events At a plan close the closed plan's lines move to `roster-archive.md`, so this list holds the current run. - <YYYY-MM-DD HH:MM>
EOF
)
tr -d '\r' < skills/tanto/templates/roster.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -cF 'roster-archive' skills/tanto/templates/roster.md
````

Expected: `1`, then `3` — this sentence, P2.2's dead-row bullet, and the
Residency block's own mention.
The needle carries the heading and the bullet's first token, so it pins the
position. Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 17: P2.6 — create `skills/tanto/templates/roster-archive.md`**

This is the plan's one **whole-file** block: the eleventh template, written by
a quoted heredoc so that no shell expansion touches its `<...>` blanks and its
`$`-free but backtick-carrying prose. Write it **LF**, the ending its three
sibling templates have in this working tree.

New file — the spec's block under
"`skills/tanto/templates/roster-archive.md`, new":

`````markdown
# tanto roster archive

Kept by Kanri at `.superpowers/sdd/roster-archive.md`, next to the roster.
Kanri is the only writer, and writes it at a plan close: the roster rows whose
status is `dead`, `replaced`, or `refused`, each with its last Residency
reading, and the closed plan's Events lines move here, so that the roster
holds only the live run and this file holds the record across runs. Nothing
is rewritten here; rows and lines are appended in the order they arrive.

## Sessions

| Role | Name [ref] | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, or refused> | <last boundary> | <n> | <n> | <n> | <n> | <n or —> | <m or —> | <k or —> |

An archive row is the roster's status row for that session joined with its
last Residency row; the cwd and Mode columns are dropped, Ended is the date
the row's status changed.

## Events

- <YYYY-MM-DD> <the roster's Events line, moved verbatim>
`````

Run, from the repository root:

````bash
cat > skills/tanto/templates/roster-archive.md <<'EOF'
# tanto roster archive

Kept by Kanri at `.superpowers/sdd/roster-archive.md`, next to the roster.
Kanri is the only writer, and writes it at a plan close: the roster rows whose
status is `dead`, `replaced`, or `refused`, each with its last Residency
reading, and the closed plan's Events lines move here, so that the roster
holds only the live run and this file holds the record across runs. Nothing
is rewritten here; rows and lines are appended in the order they arrive.

## Sessions

| Role | Name [ref] | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, or refused> | <last boundary> | <n> | <n> | <n> | <n> | <n or —> | <m or —> | <k or —> |

An archive row is the roster's status row for that session joined with its
last Residency row; the cwd and Mode columns are dropped, Ended is the date
the row's status changed.

## Events

- <YYYY-MM-DD> <the roster's Events line, moved verbatim>
EOF
````

- [ ] **Step 18: Verify P2.6**

````bash
test -f skills/tanto/templates/roster-archive.md && echo present
head -1 skills/tanto/templates/roster-archive.md
grep -c '^## Sessions$' skills/tanto/templates/roster-archive.md
grep -c '^## Events$' skills/tanto/templates/roster-archive.md
header=$(cat <<'EOF'
| Role | Name [ref] | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
EOF
)
grep -cF -- "$header" skills/tanto/templates/roster-archive.md
grep -cF 'Transcript' skills/tanto/templates/roster-archive.md
tail -c1 skills/tanto/templates/roster-archive.md | od -An -c | tr -d ' '
````

Expected: `present`; `# tanto roster archive`; `1`; `1`; `1`; `0` — the archive
does not carry the roster's Transcript column, which is the spec's rule; and
`\n`, the final newline the end-of-file hook requires. Baseline: the file
absent, measured 2026-09-09.

- [ ] **Step 19: Stage the new file and read both line endings**

````bash
git add skills/tanto/templates/roster-archive.md
git ls-files --eol skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md
````

Expected: `i/lf`, `w/lf`, `attr/text=auto` for both, and never `w/mixed`. The
`git add` is required before `git ls-files --eol` can report an untracked path
at all, and before `git commit --only` can name it.

- [ ] **Step 20: The task's content greps**

````bash
grep -cF -- '| Transcript |' skills/tanto/templates/roster.md
grep -c '^## Residency$' skills/tanto/templates/roster.md
grep -c '^## Shoroku candidates$' skills/tanto/templates/roster.md
grep -c '^## Events$' skills/tanto/templates/roster.md
grep -cF 'Kanri <name> [<ref>] since <YYYY-MM-DD>:' skills/tanto/templates/roster.md
grep -cF '| S-n | Source | Candidate | Destination | Adopted | Stage | Written |' skills/tanto/templates/roster.md
grep -rcF 'roster-archive' skills/tanto
````

Expected, line by line: `1`; `1`; `1`; `1`; `0`; `1`; then, from the last
command, `skills/tanto/SKILL.md:2`,
`skills/tanto/templates/roster.md:2`,
`skills/tanto/templates/roster-archive.md:0`, and `0` for every other file —
`roles/kanri.md` and `README.md` join the set in tasks 7 and 8. The
`## Residency`, `## Shoroku candidates`, and `| S-n | …` values are the note's
check 6 values for this file and must not move. Baseline `0`, `1`, `1`, `1`,
`1`, `1`, and `0` everywhere for the last, measured 2026-09-09.

- [ ] **Step 21: The headings of `roster.md` are unchanged**

````bash
diff <(grep '^#' skills/tanto/templates/roster.md) <(git show main:skills/tanto/templates/roster.md | grep '^#') && echo "no difference"
````

Expected: `no difference`. This task adds no heading to `roster.md` and renames
none; the archive is a new file and has no `main` side to compare. Baseline
`no difference`, measured 2026-09-09.

- [ ] **Step 22: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: for `roster.md`, hunks holding P2.1, P2.2, P2.3, P2.4, and P2.5 and
nothing else, read against the blocks above and matched by text; for
`roster-archive.md`, the whole file as an addition. No hunk count is stated —
`git diff` merges regions separated by six or fewer unchanged lines, and P2.1
and P2.2 are adjacent.

- [ ] **Step 23: Lint both paths**

````bash
./scripts/lint.sh skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md
````

Windows alternative: `scripts\lint.bat` with the same two paths. Expected: exit
0, every hook `Passed` or `Skipped`, none `Failed`. markdownlint reports
`Skipped` or no files here — `skills/**/templates/**` is ignored by
configuration — so the hooks that decide this step are trailing whitespace,
end-of-file, and mixed line ending.

- [ ] **Step 24: Commit**

````bash
git add skills/tanto/templates/roster-archive.md
git commit --only skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md -m "feat(tanto): the roster keeps a Residency table and an archive across runs" -m "The one-line Residency becomes a table, one row per session of the current run with the four figures of its latest reading, Kanri's own first and carrying the batch, plan, and noticed counters. The address book gains a Transcript column, which is the identity a resume keeps, and a handshake whose transcript= matches a row rewrites that row in place. A dead, replaced, or refused row waits for the plan close and then moves, with its Residency row and the closed plan's Events lines, into the new eleventh template roster-archive.md, whose rows across runs are the dataset a threshold will be chosen from." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

The `git add` is repeated here because `--only` cannot pick up an untracked
path and a preceding step may have been re-run.

- [ ] **Step 25: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 3: the ledger, batch-report, kaiseki-report, and handover templates

**Files:**

- Modify: `skills/tanto/templates/kanri.md` — three passages, P3.1 to P3.3.
- Modify: `skills/tanto/templates/batch-report.md` — one passage, P3.4, an
  **insertion**.
- Modify: `skills/tanto/templates/kaiseki-report.md` — one passage, P3.5, an
  **insertion**.
- Modify: `skills/tanto/templates/kanri-handover.md` — two passages, P3.6 and
  P3.7.

**Interfaces:**

- Consumes: task 1's `<reading>` placeholder and its `— <reading>` form, task
  1's `exit-kanri-<YYYY-MM-DD>-<name>` pattern, which the ledger's Stage cell
  mirrors as `exit:kanri-<YYYY-MM-DD>-<name>`, and task 2's Residency table
  header, which `templates/kanri-handover.md` repeats byte for byte.
- Produces, for tasks 4, 7, and 8:
  - `- Transcript — <reading>`, the report line Jisso (task 4, P4.1) and
    Kaiseki (task 4, P4.5) are told to fill;
  - `superseded: <topic> R-n`, the third value the Written column takes, which
    `roles/kanri.md`'s adoption rule repeats once in task 7 (P7.6) and which
    the spec's verification counts as `1` in each of the two files;
  - `exit:kanri-<YYYY-MM-DD>-<name>`, which `roles/kanri.md`'s "Your own exit"
    repeats in task 7 (P7.4);
  - the Measurements fixed row, which task 7's plan-close Delete row (P7.3)
    tells Kanri to fill;
  - the handover's Residency table header, the second copy the note's check 6
    pins in task 8.
- All four files are markdownlint-ignored under `skills/**/templates/**`, so
  the lint that binds here is trailing whitespace, end-of-file, and mixed line
  ending. Their tables are wide by design and are never wrapped.
- Line endings differ **within this task**: `templates/kanri.md` and
  `templates/kanri-handover.md` are `w/lf`; `templates/batch-report.md` and
  `templates/kaiseki-report.md` are `w/crlf`. Step 1 reads all four; each
  passage is written with its own file's ending.

- [ ] **Step 1: Read the four files' line endings, before the first edit**

````bash
git ls-files --eol skills/tanto/templates/kanri.md skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md skills/tanto/templates/kanri-handover.md
````

Expected, quoting the shape and not the column spacing: `i/lf`, `w/lf`,
`attr/text=auto` for `templates/kanri.md` and `templates/kanri-handover.md`;
`i/lf`, `w/crlf`, `attr/text=auto` for `templates/batch-report.md` and
`templates/kaiseki-report.md`. Measured 2026-09-09.

- [ ] **Step 2: Verify the P3.1 anchor, before the edit**

Anchor — the `S-n` table's example row in `templates/kanri.md`, which is the
old passage, so this check inverts after the edit.

````bash
needle=$(cat <<'EOF'
exit:kanri-<YYYY-MM-DD>>
EOF
)
grep -cF -- "$needle" skills/tanto/templates/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 3: P3.1 — the Stage cell mirrors Kanri's new exit pattern**

This is a **replacement** of the one table row below by the one that follows.
Only the Kanri example inside the Stage cell changes; the Written cell keeps
its two values, because the third one belongs to the sentence P3.2 adds and the
spec's verification counts that string once per file.

Old passage — replace exactly this 1 line and nothing else:

````markdown
| S-1 | <the report or session that raised it> | <one line> | <requirements, design, decisions, issues, notes, or reports> | <yes, no, or escalated> | <T0, T1, T2, or exit:<role>[-<suffix>] — exit:jisso-B, exit:sekkei, exit:kaiseki-1, exit:kanri-<YYYY-MM-DD>> | <no, or the subject of the commit that wrote the row out> |
````

New passage, written LF:

````markdown
| S-1 | <the report or session that raised it> | <one line> | <requirements, design, decisions, issues, notes, or reports> | <yes, no, or escalated> | <T0, T1, T2, or exit:<role>[-<suffix>] — exit:jisso-B, exit:sekkei, exit:kaiseki-1, exit:kanri-<YYYY-MM-DD>-<name>> | <no, or the subject of the commit that wrote the row out> |
````

- [ ] **Step 4: Verify P3.1**

````bash
new=$(cat <<'EOF'
| S-1 | <the report or session that raised it> | <one line> | <requirements, design, decisions, issues, notes, or reports> | <yes, no, or escalated> | <T0, T1, T2, or exit:<role>[-<suffix>] — exit:jisso-B, exit:sekkei, exit:kaiseki-1, exit:kanri-<YYYY-MM-DD>-<name>> | <no, or the subject of the commit that wrote the row out> |
EOF
)
grep -cF -- "$new" skills/tanto/templates/kanri.md
grep -cF 'exit:kanri-<YYYY-MM-DD>-<name>' skills/tanto/templates/kanri.md
grep -c 'exit:kanri-<YYYY-MM-DD>>' skills/tanto/templates/kanri.md
grep -cF '| S-n | Source | Candidate | Destination | Adopted | Stage | Written |' skills/tanto/templates/kanri.md
grep -c '| Written |' skills/tanto/templates/kanri.md
````

Expected, line by line: `1`, `1`, `0`, `1`, `1`. The third check is written
with the closing `>` so that it cannot match the new cell, which continues
`-<name>>`; without it the old string is a substring of the new one and the
check would decide nothing. The last two are the note's check 6 values for this
file and must not move. Baseline `0`, `0`, `1`, `1`, `1`, measured 2026-09-09.

- [ ] **Step 5: Verify the P3.2 anchor, before the edit**

Anchor — the last line of the paragraph under the `S-n` table, which stays. The
new paragraph goes **after** it.

````bash
needle=$(cat <<'EOF'
twice, and T2 keeps everything adopted but not yet written.
EOF
)
grep -cF -- "$needle" skills/tanto/templates/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 6: P3.2 — the cross-ledger reference and the Written convention**

This is an **insertion**: one blank line, then the paragraph below, immediately
after the anchor line. The blank line already before `## Session events` keeps
the next heading separated.

New passage, written LF:

````markdown
A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; a candidate with two stages is split into two rows when
the second stage is identified, never written as a compound value.
````

- [ ] **Step 7: Verify P3.2**

````bash
needle=$(cat <<'EOF'
twice, and T2 keeps everything adopted but not yet written. A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a handover file, another ledger — names the topic first, `<topic> S-n`; bare numbers stay bare inside a ledger. The Written column takes only a value a filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last counting as written; a candidate with two stages is split into two rows when the second stage is identified, never written as a compound value.
EOF
)
tr -d '\r' < skills/tanto/templates/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -c 'superseded: <topic> R-n' skills/tanto/templates/kanri.md
````

Expected: `1` and `1`. The needle carries the anchor, so it pins the position.
Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 8: Verify the P3.3 anchor, before the edit**

Anchor — the Measurements table's example row, the file's last line, which is
the old passage, so this check inverts after the edit.

````bash
needle=$(cat <<'EOF'
| <what was measured, e.g. strong-model sessions active at once and whether a 429 occurred> | <YYYY-MM-DD> | <what was observed> |
EOF
)
grep -cF -- "$needle" skills/tanto/templates/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 9: P3.3 — the Measurements example becomes the fixed row**

This is a **replacement** of that one row by the four lines below: the fixed
row, a blank line, and the sentence that says who fills it and when. The file
ends after the sentence, with one final newline.

New passage, written LF:

````markdown
| strong-model sessions active at once, the peak, and whether a 429 was seen | <YYYY-MM-DD, the plan close> | <the peak count, and yes or no for the 429> |

The first row is fixed and always present. Kanri fills it at the plan close
from this ledger's Session events, where it writes one line each time a third
strong-model session goes live; further rows are added as they are measured.
````

- [ ] **Step 10: Verify P3.3**

````bash
new=$(cat <<'EOF'
| strong-model sessions active at once, the peak, and whether a 429 was seen | <YYYY-MM-DD, the plan close> | <the peak count, and yes or no for the 429> | The first row is fixed and always present. Kanri fills it at the plan close from this ledger's Session events, where it writes one line each time a third strong-model session goes live; further rows are added as they are measured.
EOF
)
tr -d '\r' < skills/tanto/templates/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
| <what was measured, e.g. strong-model sessions active at once and whether a 429 occurred> | <YYYY-MM-DD> | <what was observed> |
EOF
)
grep -cF -- "$old" skills/tanto/templates/kanri.md
grep -c 'whether a 429 was seen' skills/tanto/templates/kanri.md
tail -c1 skills/tanto/templates/kanri.md | od -An -c | tr -d ' '
````

Expected: `1`, `0`, `1`, `\n`. Baseline `0`, `1`, `0`, `\n`, measured
2026-09-09.

- [ ] **Step 11: Verify the P3.4 anchor, before the edit**

Anchor — the last bullet of the batch report's header list, which stays. The
new bullet goes **after** it.

````bash
needle=$(cat <<'EOF'
- SDD ledger — <.superpowers/sdd/<plan-basename>/progress.md>
EOF
)
grep -cF -- "$needle" skills/tanto/templates/batch-report.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 12: P3.4 — the batch report's header list carries the reading**

This is an **insertion**: the single bullet below goes immediately after the
anchor line, with no blank line between them. The blank line that separates the
list from `## Tasks` stays.

New passage, written CRLF:

````markdown
- Transcript — <reading>
````

- [ ] **Step 13: Verify P3.4**

````bash
needle=$(cat <<'EOF'
progress.md> - Transcript — <reading> ## Tasks
EOF
)
tr -d '\r' < skills/tanto/templates/batch-report.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -cF -- '- Transcript — <reading>' skills/tanto/templates/batch-report.md
````

Expected: `1` and `1`. The first needle carries the anchor's tail and the next
heading, so it pins the position. Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 14: Verify the P3.5 anchor, before the edit**

Anchor — the last bullet of the Kaiseki report's "Tree state on exit" section,
which stays. The new bullet goes **after** it.

````bash
needle=$(cat <<'EOF'
- `git status` — clean
EOF
)
grep -cF -- "$needle" skills/tanto/templates/kaiseki-report.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 15: P3.5 — "Tree state on exit" carries the reading**

This is an **insertion**: the single bullet below goes immediately after the
anchor line, with no blank line between them. The blank line that separates the
list from `## Shoroku candidates` stays.

New passage, written CRLF:

````markdown
- Transcript — <reading>
````

- [ ] **Step 16: Verify P3.5**

````bash
needle=$(cat <<'EOF'
- `git status` — clean - Transcript — <reading> ## Shoroku candidates
EOF
)
tr -d '\r' < skills/tanto/templates/kaiseki-report.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -cF -- '- Transcript — <reading>' skills/tanto/templates/kaiseki-report.md
````

Expected: `1` and `1`. Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 17: Verify the P3.6 anchor, before the edit**

Anchor — the first bullet of "Rulings the next batch inherits", which is the old
passage, and the needle is the passage's unchanged opening, which survives into
the new passage, so this check still returns `1` after the edit; the Verify
step's joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
- R-<n> — <the ruling, one line, copied verbatim as compaction insurance>
EOF
)
grep -cF -- "$needle" skills/tanto/templates/kanri-handover.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 18: P3.6 — a ruling known only from a compaction summary is `(unverified)`**

This is a **replacement** of that one bullet by the three lines below. The
bullet that follows it — the Models line — does not change.

New passage, written LF:

````markdown
- R-<n> — <the ruling, one line, copied verbatim as compaction insurance>; a
  ruling known only from a compaction summary is marked `(unverified)` on its
  line, and the successor puts it to the human at its first boundary
````

- [ ] **Step 19: Verify P3.6**

````bash
new=$(cat <<'EOF'
- R-<n> — <the ruling, one line, copied verbatim as compaction insurance>; a ruling known only from a compaction summary is marked `(unverified)` on its line, and the successor puts it to the human at its first boundary
EOF
)
tr -d '\r' < skills/tanto/templates/kanri-handover.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
compaction insurance> - Models the next prompt must restate
EOF
)
tr -d '\r' < skills/tanto/templates/kanri-handover.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF '(unverified)' skills/tanto/templates/kanri-handover.md
````

Expected: `1`, `0`, `1`. The second needle is the old bullet's tail joined to
the Models bullet, and it can only match while the bullet is unchanged.
Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 20: Verify the P3.7 anchor, before the edit**

Anchor — the handover's `## Residency` heading, which occurs once and is the
first line of the old passage. The heading is **not** renamed.

````bash
grep -c '^## Residency$' skills/tanto/templates/kanri-handover.md
needle=$(cat <<'EOF'
Kanri <name> [<ref>] since <YYYY-MM-DD>: <n> batches, <m> plans, <k> compactions noticed.
EOF
)
grep -cF -- "$needle" skills/tanto/templates/kanri-handover.md
````

Expected: `1` and `1`. Measured 2026-09-09. After the edit the second returns
`0`.

- [ ] **Step 21: P3.7 — the handover's Residency becomes one row plus the reading**

This is a **replacement** of the three lines below by the nine that follow: the
same heading, the sentence that says what the section holds, the Residency
table header and separator copied **byte for byte** from
`templates/roster.md`, Kanri's one row, and the bullet that carries the reading
taken when the handover was written. The blank line before `## Next step`
stays.

Old passage — replace exactly these 3 lines and nothing else:

````markdown
## Residency

Kanri <name> [<ref>] since <YYYY-MM-DD>: <n> batches, <m> plans, <k> compactions noticed.
````

New passage, written LF. Its table header and separator must equal
`templates/roster.md`'s, which is what the note's check 6 pins in both files:

````markdown
## Residency

Kanri's Residency row from the roster, verbatim, with its last reading.

| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |

- The reading taken when this handover was written — <reading>
````

- [ ] **Step 22: Verify P3.7**

````bash
grep -c '^## Residency$' skills/tanto/templates/kanri-handover.md
header=$(cat <<'EOF'
| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
EOF
)
grep -cF -- "$header" skills/tanto/templates/kanri-handover.md
grep -cF -- "$header" skills/tanto/templates/roster.md
old=$(cat <<'EOF'
Kanri <name> [<ref>] since <YYYY-MM-DD>: <n> batches, <m> plans, <k> compactions noticed.
EOF
)
grep -cF -- "$old" skills/tanto/templates/kanri-handover.md
tail=$(cat <<'EOF'
| kanri | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> | - The reading taken when this handover was written — <reading> ## Next step
EOF
)
tr -d '\r' < skills/tanto/templates/kanri-handover.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$tail"
grep -cF -- '— <reading>' skills/tanto/templates/kanri-handover.md
````

Expected: `1`, `1`, `1`, `0`, `1`, `1`. The second and third are the same needle
against the two files, which is what makes the pair a pair; the fifth ends with
`## Next step`, so it pins the section's position. Baseline `1`, `0`, `0`, `1`,
`0`, `0`, measured 2026-09-09.

- [ ] **Step 23: The handover's headings are unchanged**

````bash
diff <(grep '^#' skills/tanto/templates/kanri-handover.md) <(git show main:skills/tanto/templates/kanri-handover.md | grep '^#') && echo "no difference"
````

Expected: `no difference` — the handover's nine sections keep their headings.
Baseline `no difference`, measured 2026-09-09.

- [ ] **Step 24: The four files' line endings are what step 1 read**

````bash
git ls-files --eol skills/tanto/templates/kanri.md skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md skills/tanto/templates/kanri-handover.md
````

Expected: the same values as step 1 — two `w/lf`, two `w/crlf` — and never
`w/mixed`.

- [ ] **Step 25: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/templates/kanri.md skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md skills/tanto/templates/kanri-handover.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: `templates/kanri.md` — hunks holding P3.1, P3.2, and P3.3;
`templates/batch-report.md` — P3.4; `templates/kaiseki-report.md` — P3.5;
`templates/kanri-handover.md` — P3.6 and P3.7. Read each hunk against the
blocks above and match by text; no hunk count is stated.

- [ ] **Step 26: Lint the four paths**

````bash
./scripts/lint.sh skills/tanto/templates/kanri.md skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md skills/tanto/templates/kanri-handover.md
````

Windows alternative: `scripts\lint.bat` with the same four paths. Expected:
exit 0, every hook `Passed` or `Skipped`, none `Failed`. markdownlint is
skipped by configuration on all four; the hooks that decide this step are
trailing whitespace, end-of-file, and mixed line ending — the last of which is
why step 24 matters.

- [ ] **Step 27: Commit**

````bash
git commit --only skills/tanto/templates/kanri.md skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md skills/tanto/templates/kanri-handover.md -m "feat(tanto): the ledger, the reports, and the handover carry the reading" -m "The batch report's header list and the Kaiseki report's Tree state on exit each gain a Transcript line, so a role's reading reaches Kanri in what it already sends. The handover's Residency becomes Kanri's roster row verbatim, with the reading taken when the handover was written, and a ruling known only from a compaction summary is marked unverified for the successor to put to the human. The ledger's Stage cell mirrors Kanri's exit pattern with the bare name, its Measurements example becomes the fixed concurrency row filled at the plan close, and two sentences fix the cross-ledger reference form and the values the Written column takes." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 28: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 4: the three peer role files — the self-check, the reading, the dry run

**Files:**

- Modify: `skills/tanto/roles/jisso.md` — three passages, P4.1 to P4.3.
- Modify: `skills/tanto/roles/kaiseki.md` — three passages, P4.4 to P4.6.
- Modify: `skills/tanto/roles/sekkei.md` — five passages, P4.7 to P4.11.

**Interfaces:**

- Consumes: task 1's `<reading>` placeholder and its `— <reading>` form, task
  1's `SKILL.md` sections — the self-check sentence in each of the three files
  names the Resuming section of `SKILL.md` and nothing else — and task 3's
  `- Transcript — <reading>` line in `templates/batch-report.md` and
  `templates/kaiseki-report.md`, which P4.1 and P4.5 tell the role to fill.
- Produces, for tasks 5, 6, and 7:
  - `plan committed: <plan path>; dryrun: <dry-run path> — <reading>`, the line
    Kanri's "When the plan lands" quotes in task 5 (P5.6);
  - `committed <subject> — <reading>` and `nothing to commit — <reading>`, the
    boundary reply Kanri's commit window quotes in task 7 (P7.10);
  - `exit write-out committed: <subject> — <reading>`, which Kanri's Exit
    shoroku step 3 quotes in task 7 (P7.11);
  - `.superpowers/sdd/<topic>/plan-dryrun.md`, the artifact Kanri's cold read
    reads in task 5.
- All three files are markdownlint-checked. Their prose wraps at **80
  columns**, and every block this task authors is wrapped there.
- The four-SDD-stop-classes quote and the four-statuses quote in
  `roles/jisso.md` are **not** touched; the note's check 5 pins one line of
  each. The `kanri-address:` obligation sentence in all three files is not
  touched either; the note's check 6 pins it flattened.
- All three files are `w/crlf` in this working tree; step 1 confirms it.

- [ ] **Step 1: Read the three files' line endings, before the first edit**

````bash
git ls-files --eol skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/sekkei.md
````

Expected: `i/lf`, `w/crlf`, `attr/text=auto` for each of the three — quote the
shape, not the column spacing. Measured 2026-09-09. Every passage below is
written **CRLF**.

- [ ] **Step 2: Verify the P4.1 anchor, before the edit**

Anchor — the first line of "At the boundary" step 1 in `roles/jisso.md`, which
is part of the old passage, and the needle is the passage's unchanged opening,
which survives into the new passage, so this check still returns `1` after the
edit; the Verify step's joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
1. Write `batch-<X>-report.md` in the workspace from the tanto skill's
EOF
)
grep -cF -- "$needle" skills/tanto/roles/jisso.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 3: P4.1 — Jisso fills the report's Transcript line and self-checks**

This is a **replacement** of the three lines below by the seven that follow.
Step 3 of the list ("Idle. Kanri verifies the tree …") does not change.

Old passage — replace exactly these 3 lines and nothing else:

````markdown
1. Write `batch-<X>-report.md` in the workspace from the tanto skill's
   `templates/batch-report.md`.
2. Send Kanri one line with that path.
````

New passage, written CRLF:

````markdown
1. Write `batch-<X>-report.md` in the workspace from the tanto skill's
   `templates/batch-report.md`, taking your own reading (`SKILL.md`, "The
   transcript reading") into its `- Transcript — <reading>` line.
2. Before the line, run the self-check of `SKILL.md`'s Resuming — one
   `ListAgents`; a name that is not your row's means you were resumed, and the
   handshake goes first. Then send Kanri one line with that path.
````

- [ ] **Step 4: Verify P4.1**

````bash
new=$(cat <<'EOF'
1. Write `batch-<X>-report.md` in the workspace from the tanto skill's `templates/batch-report.md`, taking your own reading (`SKILL.md`, "The transcript reading") into its `- Transcript — <reading>` line. 2. Before the line, run the self-check of `SKILL.md`'s Resuming — one `ListAgents`; a name that is not your row's means you were resumed, and the handshake goes first. Then send Kanri one line with that path.
EOF
)
tr -d '\r' < skills/tanto/roles/jisso.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
1. Write `batch-<X>-report.md` in the workspace from the tanto skill's `templates/batch-report.md`. 2. Send Kanri one line with that path.
EOF
)
tr -d '\r' < skills/tanto/roles/jisso.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
needle=$(cat <<'EOF'
`SKILL.md`'s Resuming
EOF
)
grep -cF -- "$needle" skills/tanto/roles/jisso.md
````

Expected: `1`, `0`, `1`. Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 5: Verify the P4.2 anchor, before the edit**

Anchor — the exit line in "T2 and the exit", which is part of the old passage,
so this check inverts after the edit.

````bash
needle=$(cat <<'EOF'
answer `exit write-out committed: <subject>` or
EOF
)
grep -cF -- "$needle" skills/tanto/roles/jisso.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 6: P4.2 — Jisso's exit line carries the reading**

This is a **replacement** of the two lines below by the three that follow. The
sentence continues on the file's next line (`one — takes only the adopted …`),
which does not change.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
answer `exit write-out committed: <subject>` or
`exit write-out: nothing accepted`. Any write-out — this one, T2, or a later
````

New passage, written CRLF:

````markdown
answer `exit write-out committed: <subject> — <reading>` or
`exit write-out: nothing accepted — <reading>`. Any write-out — this one, T2,
or a later
````

- [ ] **Step 7: Verify P4.2**

````bash
new=$(cat <<'EOF'
answer `exit write-out committed: <subject> — <reading>` or `exit write-out: nothing accepted — <reading>`. Any write-out — this one, T2, or a later one — takes only the adopted
EOF
)
tr -d '\r' < skills/tanto/roles/jisso.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
answer `exit write-out committed: <subject>` or `exit write-out: nothing accepted`. Any write-out — this one, T2, or a later
EOF
)
tr -d '\r' < skills/tanto/roles/jisso.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF -- '— <reading>' skills/tanto/roles/jisso.md
````

Expected: `1`, `0`, `3` — the report line P4.1 named plus the two exit forms.
The first needle runs on into the unchanged sentence, so it pins the join.
Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 8: Verify the P4.3 anchor, before the edit**

Anchor — the Models table's reviewer row in `roles/jisso.md`, which stays. The
new row goes **after** it.

````bash
needle=$(cat <<'EOF'
| the spec reviewer, the plan reviewer | `subagents.reviewer`, also Sekkei's |
EOF
)
grep -cF -- "$needle" skills/tanto/roles/jisso.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 9: P4.3 — the Models table names the review brief writer**

This is an **insertion**: the single table row below goes immediately after the
anchor row, with no blank line between them. The table stays in
`roles/jisso.md`; moving it is out of the spec's scope.

New passage, written CRLF:

````markdown
| the review brief writer | `subagents.reviewer`, Kanri's dispatch and not yours |
````

- [ ] **Step 10: Verify P4.3**

````bash
grep -c '| the review brief writer |' skills/tanto/roles/jisso.md
needle=$(cat <<'EOF'
`subagents.reviewer`, also Sekkei's | | the review brief writer | `subagents.reviewer`, Kanri's dispatch and not yours |
EOF
)
tr -d '\r' < skills/tanto/roles/jisso.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1` and `1`. The second needle carries the anchor row's tail, so it
pins the position. Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 11: Verify the P4.4 anchor, before the edit**

Anchor — the first of the three lines of "The report" that carry the one line
to Kanri, which is part of the old passage, so this check inverts.

````bash
needle=$(cat <<'EOF'
already in `.superpowers/sdd/kaiseki/`. Then send Kanri one line with the
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kaiseki.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 12: P4.4 — Kaiseki self-checks before its report line**

This is a **replacement** of the three lines below by the six that follow. The
line that follows in the file (`them:`) does not change.

Old passage — replace exactly these 3 lines and nothing else:

````markdown
already in `.superpowers/sdd/kaiseki/`. Then send Kanri one line with the
path — standalone, there is no Kanri to send to, and the report goes to the
human in this session. Two sections decide what happens next, so be exact in
````

New passage, written CRLF:

````markdown
already in `.superpowers/sdd/kaiseki/`. Before the line, run the self-check of
`SKILL.md`'s Resuming — one `ListAgents`; a name that is not your row's means
you were resumed, and the handshake goes first. Then send Kanri one line with
the path — standalone, there is no Kanri to send to, and the report goes to the
human in this session. Two sections decide what happens next, so be exact in
````

- [ ] **Step 13: Verify P4.4**

````bash
new=$(cat <<'EOF'
already in `.superpowers/sdd/kaiseki/`. Before the line, run the self-check of `SKILL.md`'s Resuming — one `ListAgents`; a name that is not your row's means you were resumed, and the handshake goes first. Then send Kanri one line with the path — standalone, there is no Kanri to send to, and the report goes to the human in this session. Two sections decide what happens next, so be exact in them:
EOF
)
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
already in `.superpowers/sdd/kaiseki/`. Then send Kanri one line with the path — standalone, there is no Kanri to send to, and the report goes to the human in this session. Two sections decide what happens next, so be exact in
EOF
)
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
needle=$(cat <<'EOF'
`SKILL.md`'s Resuming
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kaiseki.md
````

Expected: `1`, `0`, `1`. Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 14: Verify the P4.5 anchor, before the edit**

Anchor — the "Tree state on exit" bullet, which is the old passage, and the
needle is the passage's unchanged opening, which survives into the new passage,
so this check still returns `1` after the edit; the Verify step's joined needle
pins the inversion.

````bash
needle=$(cat <<'EOF'
- **Tree state on exit.** Name the WIP commit by its subject, say whether
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kaiseki.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 15: P4.5 — the report's Tree state on exit names the reading**

This is a **replacement** of the two lines below by the four that follow.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
- **Tree state on exit.** Name the WIP commit by its subject, say whether
  instrumentation was removed, and confirm `git status` is clean.
````

New passage, written CRLF:

````markdown
- **Tree state on exit.** Name the WIP commit by its subject, say whether
  instrumentation was removed, confirm `git status` is clean, and take your own
  reading (`SKILL.md`, "The transcript reading") into the section's
  `- Transcript — <reading>` line.
````

- [ ] **Step 16: Verify P4.5**

````bash
new=$(cat <<'EOF'
- **Tree state on exit.** Name the WIP commit by its subject, say whether instrumentation was removed, confirm `git status` is clean, and take your own reading (`SKILL.md`, "The transcript reading") into the section's `- Transcript — <reading>` line.
EOF
)
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
- **Tree state on exit.** Name the WIP commit by its subject, say whether instrumentation was removed, and confirm `git status` is clean.
EOF
)
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
````

Expected: `1`, `0`. Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 17: Verify the P4.6 anchor, before the edit**

Anchor — Kaiseki's attached-exit line, which is part of the old passage, so
this check inverts.

````bash
needle=$(cat <<'EOF'
you, and answer `exit write-out committed: <subject>` or
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kaiseki.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 18: P4.6 — Kaiseki's exit line carries the reading**

This is a **replacement** of the two lines below by the three that follow. The
line above them (``` `docs/AGENTS.md`, lint, commit once by explicit path … ```)
does not change.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
you, and answer `exit write-out committed: <subject>` or
`exit write-out: nothing accepted`.
````

New passage, written CRLF:

````markdown
you, and answer `exit write-out committed: <subject> — <reading>` or
`exit write-out: nothing accepted — <reading>`.
````

- [ ] **Step 19: Verify P4.6**

````bash
new=$(cat <<'EOF'
in the slot Kanri gives you, and answer `exit write-out committed: <subject> — <reading>` or `exit write-out: nothing accepted — <reading>`.
EOF
)
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
you, and answer `exit write-out committed: <subject>` or `exit write-out: nothing accepted`.
EOF
)
tr -d '\r' < skills/tanto/roles/kaiseki.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF -- '— <reading>' skills/tanto/roles/kaiseki.md
````

Expected: `1`, `0`, `3` — the report line P4.5 named plus the two exit forms.
Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 20: Verify the P4.7 anchor, before the edit**

Anchor — the second line of `roles/sekkei.md`'s opening paragraph, which is the
old passage, so this check inverts.

````bash
needle=$(cat <<'EOF'
line names — the spec and plan dialogue, given again with each new topic — and
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 21: P4.7 — the standing grant is given at your creation**

This is a **replacement** of that one line by the one below. A Sekkei is never
reused across topics, so the grant is not given again with a new topic. Only
this line changes; the lines above and below it keep their bytes, which is why
the replacement is one line and not a re-wrapped paragraph.

New passage, written CRLF:

````markdown
line names — the spec and plan dialogue, given at your creation — and
````

- [ ] **Step 22: Verify P4.7**

````bash
new=$(cat <<'EOF'
Kanri's orders line names — the spec and plan dialogue, given at your creation — and to nobody else;
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
grep -cF 'given again with each new topic' skills/tanto/roles/sekkei.md
````

Expected: `1`, `0`. The first needle carries the unchanged text on both sides,
so it pins the join. Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 23: Verify the P4.8 anchor, before the edit**

Anchor — the first line of Step 4's item 1, which is part of the old passage,
so this check inverts. The `## Step 4 — plan review` heading is **not** renamed
and is not part of the passage.

````bash
grep -c '^## Step 4 — plan review$' skills/tanto/roles/sekkei.md
needle=$(cat <<'EOF'
1. Dispatch a **read-only** reviewer on `subagents.reviewer` to run the
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1` and `1`. Measured 2026-09-09.

- [ ] **Step 24: P4.8 — Step 4 becomes one dry run, one report**

This is a **replacement** of items 1 to 4 — the fifteen lines below — by the
seventeen that follow. Item 5 (`review-ready:` and the brief) does not change,
and neither does the heading. The new item 1 is the spec's own numbered item,
byte for byte; items 3 and 4 are today's items 2 and 4 renumbered, their text
unchanged.

Old passage — replace exactly these 15 lines and nothing else:

````markdown
1. Dispatch a **read-only** reviewer on `subagents.reviewer` to run the
   writing-plans checklist against the plan, writing its report to
   `.superpowers/sdd/<topic>/plan-review.md` with a **Shoroku candidates**
   section at the end; after you have ruled, send Kanri one line with the
   report path.
2. Check spec conformance and the batch cuts yourself. A cut that leaves the
   tree inconsistent at its boundary is a bad cut. When the plan names a
   boundary as safe for a role start or replacement, grep the plan's own
   new-passage blocks for every term a later batch lands; a boundary is safe
   by that sweep, not by assertion.
3. Run every verification command the plan states, once, on this machine,
   and compare its output with what the plan expects. A command that has
   never been run is a placeholder in a command's shape; fix the plan, not
   the expectation.
4. Lint the changed paths.
````

New passage, written CRLF:

````markdown
1. Run every verification command the plan states, once, on this machine, on
   scratch copies with the passages applied, and write
   `.superpowers/sdd/<topic>/plan-dryrun.md`: the application script's path,
   then each command, its output, and the plan's expectation. A command that
   has never been run is a placeholder in a command's shape; fix the plan,
   not the expectation.
2. Dispatch a **read-only** reviewer on `subagents.reviewer` to run the
   writing-plans checklist against the plan **and the dry-run report**: it
   reads the report and spot-checks a few of its commands rather than
   re-running the set, and writes `.superpowers/sdd/<topic>/plan-review.md`
   with a **Shoroku candidates** section at the end; after you have ruled,
   send Kanri one line with the report path.
3. Check spec conformance and the batch cuts yourself. A cut that leaves the
   tree inconsistent at its boundary is a bad cut. When the plan names a
   boundary as safe for a role start or replacement, grep the plan's own
   new-passage blocks for every term a later batch lands; a boundary is safe
   by that sweep, not by assertion.
4. Lint the changed paths.
````

- [ ] **Step 25: Verify P4.8**

````bash
head=$(cat <<'EOF'
1. Run every verification command the plan states, once, on this machine, on scratch copies with the passages applied, and write `.superpowers/sdd/<topic>/plan-dryrun.md`: the application script's path, then each command, its output, and the plan's expectation. A command that has never been run is a placeholder in a command's shape; fix the plan, not the expectation.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$head"
tail=$(cat <<'EOF'
3. Check spec conformance and the batch cuts yourself. A cut that leaves the tree inconsistent at its boundary is a bad cut. When the plan names a boundary as safe for a role start or replacement, grep the plan's own new-passage blocks for every term a later batch lands; a boundary is safe by that sweep, not by assertion. 4. Lint the changed paths. 5. Send Kanri `review-ready: <plan path>`
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$tail"
old=$(cat <<'EOF'
1. Dispatch a **read-only** reviewer on `subagents.reviewer` to run the writing-plans checklist against the plan, writing its report to `.superpowers/sdd/<topic>/plan-review.md` with a **Shoroku candidates** section at the end; after you have ruled, send Kanri one line with the report path.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF 'plan-dryrun' skills/tanto/roles/sekkei.md
grep -cF 'review-ready: <' skills/tanto/roles/sekkei.md
````

Expected: `1`, `1`, `0`, `1`, `2`. The second needle runs on into item 5, so it
pins the position and proves item 5 survived; the third is the old item 1,
which after a correct edit is gone. The last is the note's check 6 value for
this file and must not move. Baseline `0`, `0`, `1`, `0`, `2`, measured
2026-09-09.

- [ ] **Step 26: Verify the P4.9 anchor, before the edit**

Anchor — the sentence that closes Step 4, which is the old passage, so this
check inverts.

````bash
needle=$(cat <<'EOF'
Then send Kanri one line saying the plan is committed, with its path.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 27: P4.9 — the plan-committed line names the dry run and the reading**

This is a **replacement** of that one line by the two below.

New passage, written CRLF:

````markdown
Then send Kanri one line naming both, with your reading appended:
`plan committed: <plan path>; dryrun: <dry-run path> — <reading>`.
````

- [ ] **Step 28: Verify P4.9**

````bash
new=$(cat <<'EOF'
Then send Kanri one line naming both, with your reading appended: `plan committed: <plan path>; dryrun: <dry-run path> — <reading>`.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
Then send Kanri one line saying the plan is committed, with its path.
EOF
)
grep -cF -- "$old" skills/tanto/roles/sekkei.md
````

Expected: `1`, `0`. Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 29: Verify the P4.10 anchor, before the edit**

Anchor — the boundary-reply bullet, which is the old passage, and the needle is
the passage's unchanged opening, which survives into the new passage, so this
check still returns `1` after the edit; the Verify step's joined needle pins the
inversion.

````bash
needle=$(cat <<'EOF'
- **The boundary reply.** When Kanri says the boundary is verified, commit if
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 30: P4.10 — the boundary reply self-checks and carries the reading**

This is a **replacement** of the five lines below by the seven that follow.

Old passage — replace exactly these 5 lines and nothing else:

````markdown
- **The boundary reply.** When Kanri says the boundary is verified, commit if
  your work is ready and answer in one line, `committed <subject>` or
  `nothing to commit`. The authorization lasts until you answer or until
  Kanri's next message, and a commit you did not make within that window waits
  for the next boundary line.
````

New passage, written CRLF:

````markdown
- **The boundary reply.** When Kanri says the boundary is verified, commit if
  your work is ready and answer in one line, `committed <subject> — <reading>`
  or `nothing to commit — <reading>`. Before the line, run the self-check of
  `SKILL.md`'s Resuming — one `ListAgents`; a name that is not your row's means
  you were resumed, and the handshake goes first. The authorization lasts until
  you answer or until Kanri's next message, and a commit you did not make
  within that window waits for the next boundary line.
````

- [ ] **Step 31: Verify P4.10**

````bash
new=$(cat <<'EOF'
- **The boundary reply.** When Kanri says the boundary is verified, commit if your work is ready and answer in one line, `committed <subject> — <reading>` or `nothing to commit — <reading>`. Before the line, run the self-check of `SKILL.md`'s Resuming — one `ListAgents`; a name that is not your row's means you were resumed, and the handshake goes first. The authorization lasts until you answer or until Kanri's next message, and a commit you did not make within that window waits for the next boundary line.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
- **The boundary reply.** When Kanri says the boundary is verified, commit if your work is ready and answer in one line, `committed <subject>` or `nothing to commit`. The authorization lasts until you answer or until Kanri's next message, and a commit you did not make within that window waits for the next boundary line.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF 'nothing to commit' skills/tanto/roles/sekkei.md
needle=$(cat <<'EOF'
`SKILL.md`'s Resuming
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`, `0`, `1`, `1`. The third is the note's check 6 value for this
file and must not move — the phrase stays on one line and occurs once. Baseline
`0`, `1`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 32: Verify the P4.11 anchor, before the edit**

Anchor — Sekkei's exit line, which is the old passage, so this check inverts.

````bash
needle=$(cat <<'EOF'
  `exit write-out committed: <subject>` or `exit write-out: nothing accepted`.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 33: P4.11 — Sekkei's exit line carries the reading**

This is a **replacement** of the two lines below by the three that follow.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
  in the commit window, ahead of your ordinary boundary commit, and answer
  `exit write-out committed: <subject>` or `exit write-out: nothing accepted`.
````

New passage, written CRLF:

````markdown
  in the commit window, ahead of your ordinary boundary commit, and answer
  `exit write-out committed: <subject> — <reading>` or
  `exit write-out: nothing accepted — <reading>`.
````

- [ ] **Step 34: Verify P4.11**

````bash
new=$(cat <<'EOF'
in the commit window, ahead of your ordinary boundary commit, and answer `exit write-out committed: <subject> — <reading>` or `exit write-out: nothing accepted — <reading>`.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
in the commit window, ahead of your ordinary boundary commit, and answer `exit write-out committed: <subject>` or `exit write-out: nothing accepted`.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF -- '— <reading>' skills/tanto/roles/sekkei.md
````

Expected: `1`, `0`, `5` — the plan-committed line, the two boundary-reply
forms, and the two exit forms. Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 35: The task's content greps**

````bash
needle=$(cat <<'EOF'
`SKILL.md`'s Resuming
EOF
)
for f in skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/sekkei.md; do
  printf '%s -> %s\n' "$f" "$(grep -cF -- "$needle" "$f")"
done
grep -c '| the review brief writer |' skills/tanto/roles/jisso.md
grep -cF 'plan-dryrun' skills/tanto/roles/sekkei.md
grep -c 'given again with each new topic' skills/tanto/roles/sekkei.md
for f in skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/sekkei.md; do
  printf '%s -> %s\n' "$f" "$(grep -cF -- '— <reading>' "$f")"
done
````

Expected: three lines each ending `-> 1`; then `1`; `1`; `0`; then
`jisso.md -> 3`, `kaiseki.md -> 3`, `sekkei.md -> 5`. Baseline: three `-> 0`
lines, `0`, `0`, `1`, and three `-> 0` lines, measured 2026-09-09.

- [ ] **Step 36: The `kanri-address:` obligation sentence is untouched**

````bash
for f in skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md; do
  printf '%s -> %s\n' "$f" "$(tr -d '\r' < "$f" | tr '\n' ' ' | tr -s ' ' | grep -cF "A message whose first line is \`kanri-address: <name> [<ref>]\` replaces Kanri's address from then on; if a send to Kanri errors, re-read the roster's first data row.")"
done
````

Expected: three lines, each ending `-> 1` — the note's check 6 block, cited
here rather than copied with a change. Baseline the same, measured 2026-09-09.

- [ ] **Step 37: The headings of the three files are unchanged**

````bash
for f in skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/sekkei.md; do
  echo "== $f"
  diff <(grep '^#' "$f") <(git show main:"$f" | grep '^#') && echo "no difference"
done
````

Expected: `no difference` for all three. This task adds no heading and renames
none. Baseline `no difference` for all three, measured 2026-09-09.

- [ ] **Step 38: The three files' line endings are what step 1 read**

````bash
git ls-files --eol skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/sekkei.md
````

Expected: the same `i/lf`, `w/crlf`, `attr/text=auto` for each, and never
`w/mixed`.

- [ ] **Step 39: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/sekkei.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: `roles/jisso.md` — hunks holding P4.1, P4.3, and P4.2 in file order;
`roles/kaiseki.md` — P4.6, P4.4, and P4.5 in file order; `roles/sekkei.md` —
P4.7, P4.8, P4.9, P4.10, and P4.11. Hunk order is **file** order, not passage
order, so match each hunk to a passage by its text; no hunk count is stated.

- [ ] **Step 40: Lint the three paths**

````bash
./scripts/lint.sh skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/sekkei.md
````

Windows alternative: `scripts\lint.bat` with the same three paths. Expected:
exit 0, every hook `Passed` or `Skipped`, none `Failed`. markdownlint binds on
all three.

- [ ] **Step 41: Commit**

````bash
git commit --only skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/roles/sekkei.md -m "feat(tanto): the peers take their reading, self-check a resume, and run one dry run" -m "Jisso, Kaiseki, and Sekkei each take the contract's reading at their boundaries and send it with the lines they already send, and each runs one ListAgents self-check before that line so that a session resumed under a new name re-handshakes instead of going missing. Sekkei's Step 4 becomes one dry run and one report: it runs the plan's verification commands once on scratch copies into plan-dryrun.md, and the plan reviewer reads that report and spot-checks rather than re-running the set; the plan-committed line names it. Sekkei's standing grant is given at its creation, because a Sekkei is never reused across topics, and Jisso's Models table names the review brief writer." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 42: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 5: Kanri's start cases, the handshake match, the recovery, and the cold read

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — six passages, P5.1 to P5.6.

**Interfaces:**

- Consumes: task 1's `SKILL.md` Resuming section — the `kanri-address:` resumed
  form and the `resumed: <old name> → <new name>` Events line are defined
  there; task 2's `Transcript` column in `templates/roster.md`, which is what a
  start case and a handshake match read; task 4's plan-committed line
  `plan committed: <plan path>; dryrun: <dry-run path> — <reading>` and the
  artifact `.superpowers/sdd/<topic>/plan-dryrun.md`.
- Produces, for tasks 6, 7, and 8: the string `Resumed Kanri`, which the
  Recovery-after-restart procedure P5.5 names; the frame command, which the
  plan's verification runs against a real plan; and the heading
  `### The five cases`.
- `roles/kanri.md` is markdownlint-checked; its prose wraps at **80 columns**
  and every block this task authors is wrapped there. The file is `w/crlf`.
- Tasks 5, 6, and 7 all edit this one file, in that order. Each task's anchors
  are content that the other two do not touch, so the three commits are
  independent; the merge-base diff after task 7 is the union of P5.1 to P7.12.
- The frame command sits **before** the numbered list, introduced by the
  plan-committed sentence, and the spec's block for P5.6 says "as the frame
  command above prints it" — the two agree; the block is transcribed as the
  spec wrote it.

- [ ] **Step 1: Read the file's line ending, before the first edit**

````bash
git ls-files --eol skills/tanto/roles/kanri.md
````

Expected: `i/lf`, `w/crlf`, `attr/text=auto`. Measured 2026-09-09. Every
passage below is written **CRLF**.

- [ ] **Step 2: Verify the P5.1 anchor, before the edit**

Anchor — the second line of Start step 4, which is the old passage, so this
check inverts.

````bash
needle=$(cat <<'EOF'
   first data row, then take exactly one case from "The four cases" below.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 3: P5.1 — Start step 4 points at five cases**

This is a **replacement** of that one line by the one below.

New passage, written CRLF:

````markdown
   first data row, then take exactly one case from "The five cases" below.
````

- [ ] **Step 4: Verify P5.1**

````bash
grep -cF -- '"The five cases"' skills/tanto/roles/kanri.md
grep -cF -- '"The four cases"' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`. Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 5: Verify the P5.2 anchor, before the edit**

Anchor — the section heading, which is the old passage, so this check inverts.
This is the one heading the spec renames; every other heading in the skill
keeps its text.

````bash
grep -c '^### The four cases$' skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 6: P5.2 — the heading says five**

This is a **replacement** of that one heading line by the one below.

New passage, written CRLF:

````markdown
### The five cases
````

- [ ] **Step 7: Verify P5.2**

````bash
grep -c '^### The five cases$' skills/tanto/roles/kanri.md
grep -c '^### The four cases$' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`. Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 8: Verify the P5.3 anchor, before the edit**

Anchor — the Recovery case's first line, which is part of the old passage, so
this check inverts.

````bash
needle=$(cat <<'EOF'
**Recovery** — no handover file, the first data row is another name, and that
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 9: P5.3 — the fifth case, and the Recovery case's added clause**

This is a **replacement** of the four lines below by the fourteen that follow:
the new **Resumed Kanri** case, a blank line, and the Recovery case with one
more clause in its condition. Resumed Kanri comes first because its condition
is the narrower one — the same first-row-not-listed situation, plus a
Transcript column that is your own path.

Old passage — replace exactly these 4 lines and nothing else:

````markdown
**Recovery** — no handover file, the first data row is another name, and that
session is not listed. Mark every row whose session is gone `dead`, with an
Events line per row saying whether its exit shoroku ran and what was lost, and
run "Recovery after a VS Code restart" below.
````

New passage, written CRLF:

````markdown
**Resumed Kanri** — no handover file, the first data row is another name that
`ListAgents` does not list, and that row's Transcript column is your own
transcript path. This is your own conversation resumed under a new name:
rewrite the first row in place with your new name and `[ref]`, status `live`,
send the `kanri-address:` line of `SKILL.md`'s Resuming to every listed peer,
write the Events line `resumed: <old name> → <new name>`, and continue where
the ledger's Progress line says. No row is marked `dead`, and there is no tree
recovery beyond `git status`.

**Recovery** — no handover file, the first data row is another name, that
session is not listed, and its Transcript column is not your own path. Mark
every row whose session is gone `dead`, with an Events line per row saying
whether its exit shoroku ran and what was lost, and run "Recovery after a VS
Code restart" below.
````

- [ ] **Step 10: Verify P5.3**

````bash
new=$(cat <<'EOF'
**Resumed Kanri** — no handover file, the first data row is another name that `ListAgents` does not list, and that row's Transcript column is your own transcript path. This is your own conversation resumed under a new name: rewrite the first row in place with your new name and `[ref]`, status `live`, send the `kanri-address:` line of `SKILL.md`'s Resuming to every listed peer, write the Events line `resumed: <old name> → <new name>`, and continue where the ledger's Progress line says. No row is marked `dead`, and there is no tree recovery beyond `git status`. **Recovery** — no handover file, the first data row is another name, that session is not listed, and its Transcript column is not your own path. Mark every row whose session is gone `dead`, with an Events line per row saying whether its exit shoroku ran and what was lost, and run "Recovery after a VS Code restart" below.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
**Recovery** — no handover file, the first data row is another name, and that session is not listed. Mark every row whose session is gone `dead`, with an Events line per row saying whether its exit shoroku ran and what was lost, and run "Recovery after a VS Code restart" below.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'Resumed Kanri' skills/tanto/roles/kanri.md
needle=$(cat <<'EOF'
`SKILL.md`'s Resuming
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `1`, `1`. Baseline `0`, `1`, `0`, `0`, measured
2026-09-09. The `Resumed Kanri` count rises to `2` once P5.5 has landed.

- [ ] **Step 11: Verify the P5.4 anchor, before the edit**

Anchor — the last line of "On a handshake" step 4, which stays. The new
paragraph goes **after** it, before the paragraph beginning "A second
handshake".

````bash
needle=$(cat <<'EOF'
   Kaiseki gets the brief path, or `no brief, stop` in a smoke test.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 12: P5.4 — a handshake whose `transcript=` matches a row is a resume**

This is an **insertion**: one blank line, then the paragraph below, immediately
after the anchor line. The blank line that already precedes "A second
handshake" keeps that paragraph separated.

New passage, written CRLF:

````markdown
A handshake whose `transcript=` equals a row's Transcript column is that
session resumed under a new name, not a second session: rewrite the row in
place with the new name and `[ref]`, status `live`, write the Events line
`resumed: <old name> → <new name>`, and send nothing but your address. Step 2's
one-live-row-per-role check does not refuse it.
````

- [ ] **Step 13: Verify P5.4**

````bash
needle=$(cat <<'EOF'
`no brief, stop` in a smoke test. A handshake whose `transcript=` equals a row's Transcript column is that session resumed under a new name, not a second session: rewrite the row in place with the new name and `[ref]`, status `live`, write the Events line `resumed: <old name> → <new name>`, and send nothing but your address. Step 2's one-live-row-per-role check does not refuse it. A second handshake
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -c 'transcript=' skills/tanto/roles/kanri.md
````

Expected: `1`, `1`. The needle carries the anchor on both sides, so it pins the
position too. Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 14: Verify the P5.5 anchor, before the edit**

Anchor — the "Recovery after a VS Code restart" heading, which stays and is
**not** renamed; the paragraph under it is the old passage.

````bash
grep -c '^### Recovery after a VS Code restart$' skills/tanto/roles/kanri.md
needle=$(cat <<'EOF'
All sessions die together, and the human recreates you first. Run
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1` and `1`. Measured 2026-09-09. After the edit the second returns
`0`.

- [ ] **Step 15: P5.5 — the restart is many resumes at once**

This is a **replacement** of the five lines below by the eight that follow. The
heading above them does not change, and the paragraph is the last text of the
file, so it keeps the file's final newline.

Old passage — replace exactly these 5 lines and nothing else:

````markdown
All sessions die together, and the human recreates you first. Run
`ListAgents`, mark every roster row that is no longer listed as `dead`, verify
the tree if a batch was in flight, then ask for the missing roles in this
order: Jisso only if a batch is in flight, Kaiseki only if a bug is open,
Sekkei only if a spec or plan is in progress.
````

New passage, written CRLF:

````markdown
Every window is resumed at once rather than recreated, and the human types
`/tanto resume` in your window first — the Resumed Kanri case above — and then
in each other window, in any order; no address is pasted. Mark `dead` only a
row whose session neither `ListAgents` lists nor re-handshakes by the time the
human says the windows are done. Verify the tree if a batch was in flight, then
ask for the roles still missing, in this order: Jisso only if a batch is in
flight, Kaiseki only if a bug is open, Sekkei only if a spec or plan is in
progress.
````

- [ ] **Step 16: Verify P5.5**

````bash
new=$(cat <<'EOF'
### Recovery after a VS Code restart Every window is resumed at once rather than recreated, and the human types `/tanto resume` in your window first — the Resumed Kanri case above — and then in each other window, in any order; no address is pasted. Mark `dead` only a row whose session neither `ListAgents` lists nor re-handshakes by the time the human says the windows are done. Verify the tree if a batch was in flight, then ask for the roles still missing, in this order: Jisso only if a batch is in flight, Kaiseki only if a bug is open, Sekkei only if a spec or plan is in progress.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
All sessions die together, and the human recreates you first. Run `ListAgents`, mark every roster row that is no longer listed as `dead`, verify the tree if a batch was in flight, then ask for the missing roles in this order: Jisso only if a batch is in flight, Kaiseki only if a bug is open, Sekkei only if a spec or plan is in progress.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF -- '/tanto resume' skills/tanto/roles/kanri.md
grep -c 'Resumed Kanri' skills/tanto/roles/kanri.md
tail -c1 skills/tanto/roles/kanri.md | od -An -c | tr -d ' '
````

Expected: `1`, `0`, `1`, `2`, `\n`. The first needle carries the heading, so it
pins the position. Baseline `0`, `1`, `0`, `0`, `\n`, measured 2026-09-09.

- [ ] **Step 17: Verify the P5.6 anchor, before the edit**

Anchor — the first line of "When the plan lands", which is part of the old
passage, so this check inverts.

````bash
needle=$(cat <<'EOF'
Sekkei sends you one line saying the plan is committed, with its path. Then, in
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 18: P5.6 — the plan-committed line, the frame command, and the cold read**

This is a **replacement** of the six lines below — the section's opening
sentence and the first three lines of step 1 — by the twenty-eight that follow:
the opening sentence naming both artifacts, the frame command with the one
sentence that introduces it, `Then, in this order.`, and step 1 rewritten. Step
1 continues on the file's next line, the one beginning "record as" and naming
rule 11, which does not change, and steps 2 to 6 do not change.

The `awk` block is the spec's, byte for byte; it depends on the plan shape
writing-plans produces — tasks under `### Task`, steps as `- [ ] **Step` — and
a plan in another shape prints whole, which is the safe failure.

Old passage — replace exactly these 6 lines and nothing else:

````markdown
Sekkei sends you one line saying the plan is committed, with its path. Then, in
this order.

1. Cold-read the committed plan and the spec, and send Sekkei one line per open
   question. Wait for its pointer: it answers by editing the plan or the spec,
   never by explaining in a message. If the plan edits this skill's own files,
````

New passage, written CRLF:

`````markdown
Sekkei sends you one line,
`plan committed: <plan path>; dryrun: <dry-run path> — <reading>`, naming the
plan and the dry-run report.

The frame command, from the repository root, with `P` the plan path:

```bash
awk '{
  if (s) {
    if (f) {
      if (match($0, /^`+/) && RLENGTH == k && $0 ~ /^`+[ \t]*$/) f = 0
      n++; next
    }
    if ($0 ~ /^##/) { s = 0; print "[steps: " n " lines]" }
    else {
      if (match($0, /^`{3,}/)) { f = 1; k = RLENGTH }
      n++; next
    }
  }
  if ($0 ~ /^### Task/) t = 1; else if ($0 ~ /^## /) t = 0
  if (t && $0 ~ /^- \[ \] \*\*Step/) { s = 1; n = 1; next }
  print
} END { if (s) print "[steps: " n " lines]" }' "$P"
```

Then, in this order.

1. Cold-read the spec whole and the plan's **frame** — everything outside the
   task steps: Global Constraints, File structure, each task's head down to its
   first step, Batches, How a batch is verified, the sweeps, and the
   Self-Review — as the frame command above prints it. The steps' passage
   blocks and commands you take on Sekkei's dry-run report,
   `.superpowers/sdd/<topic>/plan-dryrun.md`, which the plan-committed line
   names, plus one command of your own that checks every anchor the plan
   names against the tree; a plan that has no dry-run report is read whole.
   Send Sekkei one line per open question. Wait for its pointer: it answers by
   editing the plan or the spec, never by explaining in a message. If the plan
   edits this skill's own files,
`````

- [ ] **Step 19: Verify P5.6**

````bash
head=$(cat <<'EOF'
Sekkei sends you one line, `plan committed: <plan path>; dryrun: <dry-run path> — <reading>`, naming the plan and the dry-run report. The frame command, from the repository root, with `P` the plan path:
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$head"
awkline=$(cat <<'EOF'
  if ($0 ~ /^### Task/) t = 1; else if ($0 ~ /^## /) t = 0
EOF
)
grep -cF -- "$awkline" skills/tanto/roles/kanri.md
tail=$(cat <<'EOF'
1. Cold-read the spec whole and the plan's **frame** — everything outside the task steps: Global Constraints, File structure, each task's head down to its first step, Batches, How a batch is verified, the sweeps, and the Self-Review — as the frame command above prints it. The steps' passage blocks and commands you take on Sekkei's dry-run report, `.superpowers/sdd/<topic>/plan-dryrun.md`, which the plan-committed line names, plus one command of your own that checks every anchor the plan names against the tree; a plan that has no dry-run report is read whole. Send Sekkei one line per open question. Wait for its pointer: it answers by editing the plan or the spec, never by explaining in a message. If the plan edits this skill's own files, record as `R-n`, before any batch prompt or subagent is dispatched
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$tail"
old=$(cat <<'EOF'
Sekkei sends you one line saying the plan is committed, with its path. Then, in this order. 1. Cold-read the committed plan and the spec, and send Sekkei one line per open question. Wait for its pointer: it answers by editing the plan or the spec, never by explaining in a message. If the plan edits this skill's own files,
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF 'plan-dryrun' skills/tanto/roles/kanri.md
grep -cF -- '— <reading>' skills/tanto/roles/kanri.md
````

Expected: `1`, `1`, `1`, `0`, `1`, `1`. The third needle runs on into the
unchanged remainder of step 1, so it pins the join. The `— <reading>` count
rises through tasks 6 and 7. Baseline `0`, `0`, `0`, `1`, `0`, `0`, measured
2026-09-09.

- [ ] **Step 20: The frame command runs, against a real plan**

The instrument is **extracted from the file this task just wrote**, never
retyped here: a copy of the command in the plan would be a second block that
can drift from the one in the tree, and running a retyped command proves
nothing about the transcription.

The extracted block is a **shell** command — `awk '…' "$P"` — not a bare `awk`
program, so it is run with `sh` and `P` given in its environment.

````bash
F=$(mktemp)
sed -n '/^The frame command, from the repository root/,/^```$/p' skills/tanto/roles/kanri.md \
  | sed -n '/^```bash$/,$p' | sed '1d;$d' > "$F"
wc -l < "$F"
P=docs/superpowers/plans/2026-09-09-requirement-extraction.md sh "$F" | wc -l
P=docs/superpowers/plans/2026-09-09-requirement-extraction.md sh "$F" | grep -c '^\[steps:'
P=docs/superpowers/plans/2026-09-07-boundary-rules.md sh "$F" | wc -l
P=docs/superpowers/plans/2026-09-07-boundary-rules.md sh "$F" | grep -c '^\[steps:'
rm -f "$F"
````

Expected, line by line: `16` — the extracted command's line count; `631` and
`4` on the requirement-extraction plan, whose own length is 1891 lines; `497`
and `7` on the boundary-rules plan, whose own length is 1796. All four figures
were measured 2026-09-09 against the spec's copy of the command. A first line
that is not `16` means the extraction picked up the wrong block, and every
figure after it is meaningless.

- [ ] **Step 21: The task's content greps**

````bash
grep -c '^### The five cases$' skills/tanto/roles/kanri.md
grep -c 'Resumed Kanri' skills/tanto/roles/kanri.md
grep -c 'transcript=' skills/tanto/roles/kanri.md
grep -cF -- '/tanto resume' skills/tanto/roles/kanri.md
grep -cF 'plan-dryrun' skills/tanto/roles/kanri.md
needle=$(cat <<'EOF'
`SKILL.md`'s Resuming
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected, line by line: `1`, `2`, `1`, `1`, `1`, `1`. Baseline `0`, `0`, `0`,
`0`, `0`, `0`, measured 2026-09-09.

- [ ] **Step 22: The headings are unchanged but for the one renamed**

````bash
diff <(grep '^#' skills/tanto/roles/kanri.md) <(git show main:skills/tanto/roles/kanri.md | grep '^#') && echo "no difference"
````

Expected: exactly one changed line — `### The five cases` on the `<` side and
`### The four cases` on the `>` side, printed as a `c` hunk, with `diff`
exiting 1 so `no difference` does not print. That is the one rename the spec
makes; no other heading moves. Baseline `no difference`, measured 2026-09-09.

- [ ] **Step 23: The line ending is what step 1 read**

````bash
git ls-files --eol skills/tanto/roles/kanri.md
````

Expected: the same `i/lf`, `w/crlf`, `attr/text=auto`, and never `w/mixed`.

- [ ] **Step 24: The diff of the file is exactly this task's passages**

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md
````

Expected: hunks holding P5.3, P5.1 and P5.2 (adjacent regions may merge), P5.4,
P5.6, and P5.5, in **file** order rather than passage order. Read each hunk
against the blocks above and match by text; no hunk count is stated, and
nothing from tasks 6 or 7 may appear yet.

- [ ] **Step 25: Lint the path**

````bash
./scripts/lint.sh skills/tanto/roles/kanri.md
````

Windows alternative: `scripts\lint.bat skills/tanto/roles/kanri.md`. Expected:
exit 0, every hook `Passed` or `Skipped`, none `Failed`. markdownlint binds
here, and the `awk` block is fenced with a language, so MD031 and MD040 hold.

- [ ] **Step 26: Commit**

````bash
git commit --only skills/tanto/roles/kanri.md -m "feat(tanto): Kanri gains a resumed start case, a handshake match, and a frame read" -m "A fifth start case recognizes Kanri's own conversation resumed under a new name by the roster's Transcript column, rewrites the first row, and continues; Recovery keeps its case with the clause that separates the two, and the VS Code restart becomes many resumes at once rather than many recreations. A handshake whose transcript= matches a row is that session resumed and rewrites the row in place. The cold read becomes a read of the plan's frame, printed by an awk command in the role file, with the step blocks taken on Sekkei's dry-run report, which the plan-committed line now names." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 27: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 6: Kanri's trigger, the self-check, the residency lines, and Readings

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — eight passages, P6.1 to P6.8.

**Interfaces:**

- Consumes: task 1's reading and its `compacted: <path>` / `confirmed: <path>`
  pair, task 1's Resuming section, task 2's Residency table and its
  `(unverified)` marking, and the readings tasks 3 and 4 make the peers send.
- Produces, for tasks 7 and 8: the `### Readings` subsection, which sits after
  the Create, Replace, and Delete tables and which task 7's Replace and Delete
  rows are read beside; the phrase `Residency row`, which replaces every
  capitalized `Residency line` in this file; and the two routed strings
  `compacted: <path>` and `confirmed: <path>`, which the note's check 6 pins in
  task 8.
- Order inside the file: P6.1 and P6.2 are in "The trigger", P6.3 in Start,
  P6.4 in the Handover case, P6.5 in the batch loop, P6.6 and P6.7 in "The
  residency line", P6.8 at the end of "Session lifecycle". Hunk order is file
  order, not passage order.
- The heading `### The residency line` is **not** renamed: it names the two
  lines Kanri prints to the human, which stay lines. Only the capitalized
  `Residency line` — the roster's section — becomes `Residency row`, in the
  four places this file uses it.

- [ ] **Step 1: Read the file's line ending, before the first edit**

````bash
git ls-files --eol skills/tanto/roles/kanri.md
````

Expected: `i/lf`, `w/crlf`, `attr/text=auto`. Measured 2026-09-09. Every
passage below is written **CRLF**.

- [ ] **Step 2: Verify the P6.1 anchor, before the edit**

Anchor — the trigger section's opening sentence, which is the old passage, and
the needle is the passage's unchanged opening, which survives into the new
passage, so this check still returns `1` after the edit; the Verify step's
joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
Two signals fire a handover. Check them at every boundary: at loop step 6 while
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 3: P6.1 — the self-check runs where the trigger check runs**

This is a **replacement** of the three lines below by the six that follow. The
two numbered signals under it do not change.

Old passage — replace exactly these 3 lines and nothing else:

````markdown
Two signals fire a handover. Check them at every boundary: at loop step 6 while
a plan is in flight, and, between plans, at the start of every turn you get — a
message, or the human speaking.
````

New passage, written CRLF:

````markdown
Two signals fire a handover. Check them at every boundary: at loop step 6 while
a plan is in flight, and, between plans, at the start of every turn you get — a
message, or the human speaking. Run the self-check of `SKILL.md`'s Resuming at
the same points — one `ListAgents`; a name that is not your row's means you
were resumed, and the roster's first row is rewritten before anything else.
````

- [ ] **Step 4: Verify P6.1**

````bash
new=$(cat <<'EOF'
Two signals fire a handover. Check them at every boundary: at loop step 6 while a plan is in flight, and, between plans, at the start of every turn you get — a message, or the human speaking. Run the self-check of `SKILL.md`'s Resuming at the same points — one `ListAgents`; a name that is not your row's means you were resumed, and the roster's first row is rewritten before anything else.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
Two signals fire a handover. Check them at every boundary: at loop step 6 while a plan is in flight, and, between plans, at the start of every turn you get — a message, or the human speaking. 1. **The human's word.**
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
````

Expected: `1`, `0`. The second needle is the old passage joined to the numbered
list that follows it, so it can only match while the passage is unchanged.
Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 5: Verify the P6.2 anchor, before the edit**

Anchor — the trigger's "what is not a signal" paragraph, which is the old
passage, so this check inverts.

````bash
needle=$(cat <<'EOF'
Not the `tokens left` figure the harness prints in its reminders, whose unit is
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 6: P6.2 — the trigger takes the reading and names no threshold**

This is a **replacement** of the four lines below by the spec's ten-line
paragraph. The sentence that follows it in the file ("Which of the two
procedures follows is decided by whether a ledger is open.") does not change.

Old passage — replace exactly these 4 lines and nothing else:

````markdown
Not the `tokens left` figure the harness prints in its reminders, whose unit is
not documented as the context window and whose presence is not guaranteed; and
not a batch or plan count, for which there is one data point so far. The
residency counters are recorded so that a threshold can be chosen later.
````

New passage — the spec's block under "The trigger check takes the reading, and
may verify a peer's", written CRLF:

````markdown
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
````

- [ ] **Step 7: Verify P6.2**

````bash
new=$(cat <<'EOF'
Not the `tokens left` figure the harness prints in its reminders, whose unit is not documented as the context window and whose presence is not guaranteed; not a batch or plan count, for which the data points are still few; and not a threshold on the reading, because none has been chosen. At every check take your own reading (`SKILL.md`, "The transcript reading") and rewrite your Residency row with it: a compactions figure of `1` where you noticed none is the second signal, seen in a file, and counts as noticed. The Residency rows, and the archive's rows across runs, are the data a threshold on cost will be chosen from, by an ADR, once enough sessions have ended (issue-40ed). Which of the two procedures follows
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
Not the `tokens left` figure the harness prints in its reminders, whose unit is not documented as the context window and whose presence is not guaranteed; and not a batch or plan count, for which there is one data point so far. The residency counters are recorded so that a threshold can be chosen later.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'Residency row' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `2`. The first needle runs on into the unchanged sentence,
so it pins the join. The third count rises to `5` once P6.3, P6.4, and P6.5
have landed. Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 8: Verify the P6.3 anchor, before the edit**

Anchor — Start step 3's second line, which is the old passage, so this check
inverts.

````bash
needle=$(cat <<'EOF'
   from `templates/roster.md` with your row first and a Residency line with
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 9: P6.3 — the bootstrap writes a Residency row**

This is a **replacement** of the two lines below by the three that follow.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
   from `templates/roster.md` with your row first and a Residency line with
   today's date and zero counts, then go to step 5.
````

New passage, written CRLF:

````markdown
   from `templates/roster.md` with your row first and a Residency row carrying
   today's date, your own reading, and zero counts, then go to step 5.
````

- [ ] **Step 10: Verify P6.3**

````bash
new=$(cat <<'EOF'
from `templates/roster.md` with your row first and a Residency row carrying today's date, your own reading, and zero counts, then go to step 5.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
from `templates/roster.md` with your row first and a Residency line with today's date and zero counts, then go to step 5.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
````

Expected: `1`, `0`. Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 11: Verify the P6.4 anchor, before the edit**

Anchor — the Handover case's clause on the roster rewrite, which is the old
passage, so this check inverts.

````bash
needle=$(cat <<'EOF'
(or `dead` if it was not listed), the Residency line reset to your name and
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 12: P6.4 — the Handover case resets a Residency row**

This is a **replacement** of the two lines below by the three that follow.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
(or `dead` if it was not listed), the Residency line reset to your name and
today with zero counts, and one Events line "handover accepted by `<you>` from
````

New passage, written CRLF:

````markdown
(or `dead` if it was not listed), the Residency row reset to your name and
today with zero counts and your own reading, and one Events line "handover
accepted by `<you>` from
````

- [ ] **Step 13: Verify P6.4**

````bash
new=$(cat <<'EOF'
(or `dead` if it was not listed), the Residency row reset to your name and today with zero counts and your own reading, and one Events line "handover accepted by `<you>` from `<old>`"; send every live peer
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
(or `dead` if it was not listed), the Residency line reset to your name and today with zero counts, and one Events line "handover accepted by `<you>` from
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
````

Expected: `1`, `0`. The first needle runs on into the unchanged remainder of
the sentence, so it pins the join. Baseline `0`, `1`, measured 2026-09-09.

- [ ] **Step 14: Verify the P6.5 anchor, before the edit**

Anchor — the batch loop's step 6, whose first two lines are the old passage, and
the needle is the passage's unchanged opening, which survives into the new
passage, so this check still returns `1` after the edit; the Verify step's
joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 15: P6.5 — loop step 6 rewrites the row from the reading**

This is a **replacement** of the two lines below by the three that follow. The
rest of step 6 continues on the file's next line and does not change.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency line. If a create request is due, make it, unless a
````

New passage, written CRLF:

````markdown
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency row from your own reading and from the readings the peers
   sent. If a create request is due, make it, unless a
````

- [ ] **Step 16: Verify P6.5**

````bash
new=$(cat <<'EOF'
6. **Check the lifecycle tables and the handover trigger.** Rewrite the roster's Residency row from your own reading and from the readings the peers sent. If a create request is due, make it, unless a handover trigger has fired, in which case
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
6. **Check the lifecycle tables and the handover trigger.** Rewrite the roster's Residency line. If a create request is due, make it, unless a
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'Residency line' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `1` — the one remaining capitalized `Residency line` is in
the paragraph P6.7 replaces. Baseline `0`, `1`, `4`, measured 2026-09-09.

- [ ] **Step 17: Verify the P6.6 anchor, before the edit**

Anchor — the first of the two residency lines, which is the old passage, so
this check inverts.

````bash
needle=$(cat <<'EOF'
Kanri stays — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed; handover not due.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 18: P6.6 — the residency lines carry the reading**

This is a **replacement** of the two lines below, inside the `text` fence, by
the two that follow. The fence itself and the paragraph above it do not change.
Both lines are deliberately unwrapped.

Old passage — replace exactly these 2 lines and nothing else:

````text
Kanri stays — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed; handover not due.
Kanri hands over — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed; handover written.
````

New passage — the spec's block under "The residency lines to the human",
written CRLF:

````text
Kanri stays — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover not due.
Kanri hands over — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover written.
````

- [ ] **Step 19: Verify P6.6**

````bash
stays=$(cat <<'EOF'
Kanri stays — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover not due.
EOF
)
grep -cF -- "$stays" skills/tanto/roles/kanri.md
hands=$(cat <<'EOF'
Kanri hands over — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover written.
EOF
)
grep -cF -- "$hands" skills/tanto/roles/kanri.md
old=$(cat <<'EOF'
Kanri stays — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed; handover not due.
EOF
)
grep -cF -- "$old" skills/tanto/roles/kanri.md
````

Expected: `1`, `1`, `0`. Baseline `0`, `0`, `1`, measured 2026-09-09.

- [ ] **Step 20: Verify the P6.7 anchor, before the edit**

Anchor — the paragraph that follows the two lines, which is the old passage, and
the needle is the passage's unchanged opening, which survives into the new
passage, so this check still returns `1` after the edit; the Verify step's
joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
The second form is followed by the numbered commands from the handover file.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 21: P6.7 — the counts go into the Residency table, in your row**

This is a **replacement** of the six lines below by the eight that follow. The
paragraph now says "table" and "row" where it said "line", and its last
sentence says what the reading's own compactions figure does to `<k>`.

Old passage — replace exactly these 6 lines and nothing else:

````markdown
The second form is followed by the numbered commands from the handover file.
The same counts go into the roster's Residency line, which you rewrite at every
boundary and plan close: `<n>` increments when you accept a batch, `<m>` when a
plan closes, `<k>` when you notice a compaction, all three cumulative since
your own start. A declined handover leaves `<k>` incremented, so the count
stays a record.
````

New passage, written CRLF:

````markdown
The second form is followed by the numbered commands from the handover file.
The same counts go into the roster's Residency table, in your own row, which
you rewrite at every boundary and plan close: `<n>` increments when you accept
a batch, `<m>` when a plan closes, `<k>` when you notice a compaction, all
three cumulative since your own start. A declined handover leaves `<k>`
incremented, so the count stays a record. The reading's compactions figure is a
separate column, and a `1` there that you had not noticed increments `<k>` when
you read it.
````

- [ ] **Step 22: Verify P6.7**

````bash
new=$(cat <<'EOF'
The second form is followed by the numbered commands from the handover file. The same counts go into the roster's Residency table, in your own row, which you rewrite at every boundary and plan close: `<n>` increments when you accept a batch, `<m>` when a plan closes, `<k>` when you notice a compaction, all three cumulative since your own start. A declined handover leaves `<k>` incremented, so the count stays a record. The reading's compactions figure is a separate column, and a `1` there that you had not noticed increments `<k>` when you read it.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
The second form is followed by the numbered commands from the handover file. The same counts go into the roster's Residency line, which you rewrite at every boundary and plan close: `<n>` increments when you accept a batch, `<m>` when a plan closes, `<k>` when you notice a compaction, all three cumulative since your own start. A declined handover leaves `<k>` incremented, so the count stays a record.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'Residency line' skills/tanto/roles/kanri.md
grep -c 'Residency row' skills/tanto/roles/kanri.md
grep -c 'Residency table' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `0`, `5`, `1`. Baseline `0`, `1`, `4`, `0`, `0`, measured
2026-09-09.

- [ ] **Step 23: Verify the P6.8 anchor, before the edit**

Anchor — the "Recovery after a VS Code restart" heading, which stays. The new
subsection goes **before** it, after everything the Delete table's prose says.

````bash
grep -c '^### Recovery after a VS Code restart$' skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 24: P6.8 — the `### Readings` subsection**

This is an **insertion** under "Session lifecycle", after the Create, Replace,
and Delete tables and the prose that follows them: the block below, followed by
one blank line, goes immediately **before** the
`### Recovery after a VS Code restart` line. The blank line that already
precedes that heading separates it from the paragraph above.

The block is the spec's two blockquotes joined — the Readings rule under "The
trigger check takes the reading, and may verify a peer's", then its
continuation under "What a compaction summary says the human said" — with the
heading this plan gives them.

New passage, written CRLF:

````markdown
### Readings

Every role sends its reading with its boundary and exit lines, and Jisso's
and Kaiseki's reports carry it; copy each into that role's Residency row at
loop step 6, with the boundary it was read at. A reading you doubt — a
session whose report lost a ruling with `0 compactions`, or one that sent
`unavailable` — you may verify with the same pipeline on the path its
handshake carried, when that path is one your session may read; a read
that is denied or fails leaves the self-report standing, marked
`(unverified)`. Never ask a peer to read a transcript for you.

On `compacted: <path>` read the file, put each item to the human in your
own window as a numbered list, record the answers as `R-n`, rewrite the file
with `confirmed`, `corrected: <the human's words>`, or `denied` beside each
item, and answer `confirmed: <path>`. A report's claim of the form "the
human saw X" or "the human ruled Y" from a session whose reading shows a
compaction is unverified until the human confirms it here, and no
severity-high issue is filed on such a claim alone.
````

- [ ] **Step 25: Verify P6.8**

````bash
grep -c '^### Readings$' skills/tanto/roles/kanri.md
head=$(cat <<'EOF'
### Readings Every role sends its reading with its boundary and exit lines, and Jisso's
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$head"
tail=$(cat <<'EOF'
On `compacted: <path>` read the file, put each item to the human in your own window as a numbered list, record the answers as `R-n`, rewrite the file with `confirmed`, `corrected: <the human's words>`, or `denied` beside each item, and answer `confirmed: <path>`. A report's claim of the form "the human saw X" or "the human ruled Y" from a session whose reading shows a compaction is unverified until the human confirms it here, and no severity-high issue is filed on such a claim alone. ### Recovery after a VS Code restart
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$tail"
grep -cF 'compacted: <path>' skills/tanto/roles/kanri.md
grep -cF 'confirmed: <path>' skills/tanto/roles/kanri.md
grep -cF '(unverified)' skills/tanto/roles/kanri.md
````

Expected: `1`, `1`, `1`, `1`, `1`, `1`. The third needle ends with the next
heading, so it pins the subsection's position. Baseline `0` for all six,
measured 2026-09-09.

- [ ] **Step 26: The task's content greps**

````bash
grep -c 'Residency line' skills/tanto/roles/kanri.md
grep -c 'Residency row' skills/tanto/roles/kanri.md
grep -c '^### Readings$' skills/tanto/roles/kanri.md
grep -cF 'compacted: <path>' skills/tanto/roles/kanri.md
grep -cF 'confirmed: <path>' skills/tanto/roles/kanri.md
grep -cF -- '— <reading>' skills/tanto/roles/kanri.md
grep -c 'the residency line' skills/tanto/roles/kanri.md
````

Expected, line by line: `0`, `6`, `1`, `1`, `1`, `3`, `2`. The last two are
deliberate: the reading appended with ` — ` is so far only in the
plan-committed line task 5 wrote and the two residency lines P6.6 rewrote, and
task 7 adds the rest; and the **lower**
case "the residency line" is the pair of lines Kanri prints to the human, which
stay lines and are not swept. Baseline `4`, `0`, `0`, `0`, `0`, `0`, `2`,
measured 2026-09-09.

- [ ] **Step 27: The headings are unchanged but for the one added**

````bash
diff <(grep '^#' skills/tanto/roles/kanri.md) <(git show main:skills/tanto/roles/kanri.md | grep '^#') && echo "no difference"
````

Expected: the `### The five cases` / `### The four cases` change from task 5,
plus `### Readings` printed with `<` and a `d`; `diff` exits 1, so
`no difference` does not print. No other line appears.

- [ ] **Step 28: The line ending is what step 1 read**

````bash
git ls-files --eol skills/tanto/roles/kanri.md
````

Expected: the same `i/lf`, `w/crlf`, `attr/text=auto`, and never `w/mixed`.

- [ ] **Step 29: The diff of the file is tasks 5 and 6's passages together**

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md
````

Expected: the union of P5.1 to P5.6 and P6.1 to P6.8, read hunk by hunk against
the blocks of both tasks and matched by text. Nothing from task 7 may appear
yet. No hunk count is stated.

- [ ] **Step 30: Lint the path**

````bash
./scripts/lint.sh skills/tanto/roles/kanri.md
````

Windows alternative: `scripts\lint.bat skills/tanto/roles/kanri.md`. Expected:
exit 0, every hook `Passed` or `Skipped`, none `Failed`.

- [ ] **Step 31: Commit**

````bash
git commit --only skills/tanto/roles/kanri.md -m "feat(tanto): Kanri takes a reading at every trigger check and rules on compactions" -m "The handover trigger keeps its two signals and loses the counters as a candidate threshold: at every check Kanri takes its own reading and rewrites its Residency row with it, and a compactions figure of one where it noticed none is the second signal seen in a file. The residency lines to the human carry the reading after the counts, and the paragraph under them says table and row. A new Readings subsection says how a peer's reading reaches the row, when Kanri may verify one it doubts, and what Kanri does with a compacted: line — the items to the human as a numbered list, the file rewritten with their answers, and confirmed: back." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 32: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 7: Kanri's Replace and Delete rows, the small items, and the grant

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — twelve passages, P7.1 to P7.12.

**Interfaces:**

- Consumes: task 2's `roster-archive.md` and `templates/roster-archive.md`,
  task 3's Measurements fixed row and its `superseded: <topic> R-n` and
  `exit:kanri-<YYYY-MM-DD>-<name>` strings, task 4's boundary reply
  `committed <subject> — <reading>` and exit line
  `exit write-out committed: <subject> — <reading>`, task 6's `### Readings`
  subsection, which the Replace rows are read beside.
- Produces, for task 8: the citation `templates/roster-archive.md` in
  `roles/kanri.md`, which the note's check 3 map gains; the four absence
  results the whole-tree sweep confirms — `keep it for the next spec`,
  `kept Sekkei`, and `exit-kanri-<YYYY-MM-DD>-proposal` gone from this file,
  and `Residency line` gone from the skill.
- This is the last task that touches `roles/kanri.md`. After its commit the
  file's merge-base diff is the union of P5.1 to P7.12 and nothing else.
- The Create table is **unchanged**: a Sekkei is still created when the first
  batch of the current plan is accepted or no plan is in flight, and the human
  may still decline. Only the Delete table's Sekkei row changes.

- [ ] **Step 1: Read the file's line ending, before the first edit**

````bash
git ls-files --eol skills/tanto/roles/kanri.md
````

Expected: `i/lf`, `w/crlf`, `attr/text=auto`. Measured 2026-09-09. Every
passage below is written **CRLF**.

- [ ] **Step 2: Verify the P7.1 anchor, before the edit**

Anchor — the Replace table's Jisso-decay row, which is the old passage, so this
check inverts.

````bash
needle=$(cat <<'EOF'
| Jisso context decay — two consecutive batches needed escalation, or a report says compaction lost rulings |
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 3: P7.1 — a compaction in a peer is a replacement condition**

This is a **replacement** of the one table row below by the spec's three rows:
Jisso's decay row with the reading added to its symptom, then Sekkei's and
Kaiseki's new rows. They sit where the old row sat, before the row beginning
"Jisso has carried the batches". Table rows are never wrapped.

Old passage — replace exactly this 1 line and nothing else:

````markdown
| Jisso context decay — two consecutive batches needed escalation, or a report says compaction lost rulings | at the batch boundary, ask the human to delete and create; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
````

New passage — the spec's rows under "A compaction in a peer", written CRLF:

````markdown
| Jisso context decay — its reading shows a compaction, two consecutive batches needed escalation, or a report says compaction lost rulings | at the batch boundary, ask the human to delete and create; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then ask the human to delete and create; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then ask the human to delete it and, if the case is open, create a new Kaiseki with the same brief |
````

- [ ] **Step 4: Verify P7.1**

````bash
new=$(cat <<'EOF'
| Jisso context decay — its reading shows a compaction, two consecutive batches needed escalation, or a report says compaction lost rulings | at the batch boundary, ask the human to delete and create; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost | | Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then ask the human to delete and create; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own | | Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then ask the human to delete it and, if the case is open, create a new Kaiseki with the same brief |
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
| Jisso context decay — two consecutive batches needed escalation, or a report says compaction lost rulings | at the batch boundary, ask the human to delete and create; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c "Sekkei's reading shows a compaction" skills/tanto/roles/kanri.md
grep -c "Kaiseki's reading shows a compaction" skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `1`, `1`. Baseline `0`, `1`, `0`, `0`, measured
2026-09-09.

- [ ] **Step 5: Verify the P7.2 anchor, before the edit**

Anchor — the Delete table's Sekkei row, which is the old passage, so this check
inverts.

````bash
needle=$(cat <<'EOF'
Sekkei is done; delete it after its exit shoroku is committed, or keep it for the next spec |
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 6: P7.2 — a Sekkei is never kept for the next topic**

This is a **replacement** of the one table row below by the one that follows.
The When column does not change.

Old passage — replace exactly this 1 line and nothing else:

````markdown
| the plan is committed, the cold-read questions are answered, and the human does not want a next spec now | Sekkei is done; delete it after its exit shoroku is committed, or keep it for the next spec |
````

New passage, written CRLF:

````markdown
| the plan is committed, the cold-read questions are answered, and the human does not want a next spec now | Sekkei is done; delete it after its exit shoroku is committed — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
````

- [ ] **Step 7: Verify P7.2**

````bash
new=$(cat <<'EOF'
| the plan is committed, the cold-read questions are answered, and the human does not want a next spec now | Sekkei is done; delete it after its exit shoroku is committed — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
EOF
)
grep -cF -- "$new" skills/tanto/roles/kanri.md
grep -c 'keep it for the next spec' skills/tanto/roles/kanri.md
grep -c 'never kept for the next topic' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `1`. Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 8: Verify the P7.3 anchor, before the edit**

Anchor — the Delete table's plan-close row, which is the old passage, so this
check inverts.

````bash
needle=$(cat <<'EOF'
this plan is closed; Kanri stays, prints the residency line, and waits for the next topic |
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 9: P7.3 — the plan close moves the record to the archive**

This is a **replacement** of the one table row below by the one that follows.

Old passage — replace exactly this 1 line and nothing else:

````markdown
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed; Kanri stays, prints the residency line, and waits for the next topic |
````

New passage, written CRLF:

````markdown
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed; Kanri stays, prints the residency line, moves the dead, replaced, and refused rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — fills the ledger's Measurements fixed row, and waits for the next topic |
````

- [ ] **Step 10: Verify P7.3**

````bash
new=$(cat <<'EOF'
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed; Kanri stays, prints the residency line, moves the dead, replaced, and refused rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — fills the ledger's Measurements fixed row, and waits for the next topic |
EOF
)
grep -cF -- "$new" skills/tanto/roles/kanri.md
grep -cF 'templates/roster-archive.md' skills/tanto/roles/kanri.md
grep -cF 'roster-archive' skills/tanto/roles/kanri.md
old=$(cat <<'EOF'
prints the residency line, and waits for the next topic |
EOF
)
grep -cF -- "$old" skills/tanto/roles/kanri.md
````

Expected: `1`, `1`, `1`, `0`. The second is what the note's check 3 map gains
in task 8. Baseline `0`, `0`, `0`, `1`, measured 2026-09-09.

- [ ] **Step 11: Verify the P7.4 anchor, before the edit**

Anchor — the "Your own exit" paragraph's first line, which is part of the old
passage, and the needle is the passage's unchanged opening, which survives into
the new passage, so this check still returns `1` after the edit; the Verify
step's joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
**Your own exit.** You have no second session to rule on you, so you rule on
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 12: P7.4 — Kanri's own exit files carry the bare name**

This is a **replacement** of the six lines below by the seven that follow.

Old passage — replace exactly these 6 lines and nothing else:

````markdown
**Your own exit.** You have no second session to rule on you, so you rule on
yourself: propose from the ledger and the roster rather than from recollection,
escalate to the human in this session, write, lint, commit once, and mark the
rows `exit:kanri-<YYYY-MM-DD>`. There is a proposal file,
`.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-proposal.md`, and no direction file.
It is step 1 of the Handover above.
````

New passage, written CRLF:

````markdown
**Your own exit.** You have no second session to rule on you, so you rule on
yourself: propose from the ledger and the roster rather than from recollection,
escalate to the human in this session, write, lint, commit once, and mark the
rows `exit:kanri-<YYYY-MM-DD>-<name>`, `<name>` being your own bare name. There
is a proposal file,
`.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`, and no direction
file. It is step 1 of the Handover above.
````

- [ ] **Step 13: Verify P7.4**

````bash
new=$(cat <<'EOF'
**Your own exit.** You have no second session to rule on you, so you rule on yourself: propose from the ledger and the roster rather than from recollection, escalate to the human in this session, write, lint, commit once, and mark the rows `exit:kanri-<YYYY-MM-DD>-<name>`, `<name>` being your own bare name. There is a proposal file, `.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`, and no direction file. It is step 1 of the Handover above.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
**Your own exit.** You have no second session to rule on you, so you rule on yourself: propose from the ledger and the roster rather than from recollection, escalate to the human in this session, write, lint, commit once, and mark the rows `exit:kanri-<YYYY-MM-DD>`. There is a proposal file, `.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-proposal.md`, and no direction file. It is step 1 of the Handover above.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF 'exit:kanri-<YYYY-MM-DD>-<name>' skills/tanto/roles/kanri.md
grep -cF 'exit-kanri-<YYYY-MM-DD>-<name>' skills/tanto/roles/kanri.md
grep -cF 'exit-kanri-<YYYY-MM-DD>-proposal' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `1`, `1`, `0`. The third and fourth are different strings —
one carries a colon after `exit`, the other a hyphen — and they sit on
different lines. Baseline `0`, `1`, `0`, `0`, `1`, measured 2026-09-09.

- [ ] **Step 14: Verify the P7.5 anchor, before the edit**

Anchor — the second item of the adoption rule's two-item list, which stays. The
new sentence goes **after** the list.

````bash
needle=$(cat <<'EOF'
2. one you cannot classify, or are unsure about.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 15: P7.5 — an escalated item reaches the human in the chat's language**

This is an **insertion**: one blank line, then the paragraph below, immediately
after the anchor line, so that it sits between the two-item list and the
paragraph beginning "Everything else". The blank line already before
"Everything else" keeps that paragraph separated.

New passage, written CRLF:

````markdown
An escalated item whose wording is in a language other than the chat's is put
to the human as the original followed by a reference translation in the chat's
language.
````

- [ ] **Step 16: Verify P7.5**

````bash
needle=$(cat <<'EOF'
2. one you cannot classify, or are unsure about. An escalated item whose wording is in a language other than the chat's is put to the human as the original followed by a reference translation in the chat's language. Everything else
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -c 'reference translation' skills/tanto/roles/kanri.md
````

Expected: `1`, `1`. The needle carries the anchor on both sides, so it pins the
position. The second count rises to `4` once P7.7, P7.8, and P7.9 have landed.
Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 17: Verify the P7.6 anchor, before the edit**

Anchor — the last line of the adoption rule's closing paragraph, which stays.
The new paragraph goes **after** it.

````bash
needle=$(cat <<'EOF'
`S-n` table, and the human sees the result in the commit.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 18: P7.6 — the cross-ledger reference and the Written convention**

This is an **insertion**: one blank line, then the paragraph below, immediately
after the anchor line, at the end of "The adoption rule" and before the
`### T0 and T1` heading. The paragraph is the same text
`templates/kanri.md` received in task 3 (P3.2), so that a reader of either file
finds the same rule; the spec's verification counts
`superseded: <topic> R-n` once in each file.

New passage, written CRLF:

````markdown
A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; a candidate with two stages is split into two rows when
the second stage is identified, never written as a compound value.
````

- [ ] **Step 19: Verify P7.6**

````bash
needle=$(cat <<'EOF'
the human sees the result in the commit. A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a handover file, another ledger — names the topic first, `<topic> S-n`; bare numbers stay bare inside a ledger. The Written column takes only a value a filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last counting as written; a candidate with two stages is split into two rows when the second stage is identified, never written as a compound value. ### T0 and T1
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -c 'superseded: <topic> R-n' skills/tanto/roles/kanri.md
grep -c 'superseded: <topic> R-n' skills/tanto/templates/kanri.md
````

Expected: `1`, `1`, `1`. The needle ends with the next heading, so it pins the
position. Baseline `0`, `0`, `1` — the third is task 3's, already landed.
Measured 2026-09-09 for the first two.

- [ ] **Step 20: Verify the P7.7 anchor, before the edit**

Anchor — the T0-and-T1 paragraph, which is the old passage, and the needle is
the passage's unchanged opening, which survives into the new passage, so this
check still returns `1` after the edit; the Verify step's joined needle pins the
inversion.

````bash
needle=$(cat <<'EOF'
At both stages you propose to yourself, apply the adoption rule, ask the human
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 21: P7.7 — T0 and T1 escalate original then reference translation**

This is a **replacement** of the three lines below by the three that follow.

Old passage — replace exactly these 3 lines and nothing else:

````markdown
At both stages you propose to yourself, apply the adoption rule, ask the human
the escalated items, apply the accepted subset per `docs/AGENTS.md` and the
per-type files, lint, and make one commit.
````

New passage, written CRLF:

````markdown
At both stages you propose to yourself, apply the adoption rule, ask the human
the escalated items, original then reference translation, apply the accepted
subset per `docs/AGENTS.md` and the per-type files, lint, and make one commit.
````

- [ ] **Step 22: Verify P7.7**

````bash
new=$(cat <<'EOF'
At both stages you propose to yourself, apply the adoption rule, ask the human the escalated items, original then reference translation, apply the accepted subset per `docs/AGENTS.md` and the per-type files, lint, and make one commit.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
At both stages you propose to yourself, apply the adoption rule, ask the human the escalated items, apply the accepted subset per `docs/AGENTS.md` and the per-type files, lint, and make one commit.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'original then reference translation' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `1` — the third rises to `3` once P7.8 and P7.9 have
landed. Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 23: Verify the P7.8 anchor, before the edit**

Anchor — T2's step 2, whose first three lines are the old passage, and the
needle is the passage's unchanged opening, which survives into the new passage,
so this check still returns `1` after the edit; the Verify step's joined needle
pins the inversion.

````bash
needle=$(cat <<'EOF'
2. **You direct.** Rule on every item per the adoption rule, record the rulings
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 24: P7.8 — T2 step 2 escalates original then reference translation**

This is a **replacement** of the five lines below — the whole of T2's step 2 —
by the eight that follow. Two things change: the escalation clause, and the
direction now carries the roster's Residency rows of the run for the dogfood
report's Measurements table (the spec's "The plan close moves the record to
the archive", the human's OK on brief point 1.3).

Old passage — replace exactly these 5 lines and nothing else:

````markdown
2. **You direct.** Rule on every item per the adoption rule, record the rulings
   in the `S-n` table, ask the human the escalated items, and write the answer
   **item by item** — accept, reject, or accept with an edit — to
   `.superpowers/sdd/<plan-basename>/shoroku-direction.md`. Then send Jisso one
   line with that path.
````

New passage, written CRLF:

````markdown
2. **You direct.** Rule on every item per the adoption rule, record the rulings
   in the `S-n` table, ask the human the escalated items,
   original then reference translation, and write the answer **item by item**
   — accept, reject, or accept with an edit — to
   `.superpowers/sdd/<plan-basename>/shoroku-direction.md`, with the roster's
   Residency rows of this run appended for the dogfood report's Measurements
   table — the readings the archive will hold, kept under `docs/reports/`
   (issue-40ed). Then send Jisso one line with that path.
````

- [ ] **Step 25: Verify P7.8**

````bash
new=$(cat <<'EOF'
2. **You direct.** Rule on every item per the adoption rule, record the rulings in the `S-n` table, ask the human the escalated items, original then reference translation, and write the answer **item by item** — accept, reject, or accept with an edit — to `.superpowers/sdd/<plan-basename>/shoroku-direction.md`, with the roster's Residency rows of this run appended for the dogfood report's Measurements table — the readings the archive will hold, kept under `docs/reports/` (issue-40ed). Then send Jisso one line with that path.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
2. **You direct.** Rule on every item per the adoption rule, record the rulings in the `S-n` table, ask the human the escalated items, and write the answer **item by item** — accept, reject, or accept with an edit — to `.superpowers/sdd/<plan-basename>/shoroku-direction.md`. Then send Jisso one line with that path.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'original then reference translation' skills/tanto/roles/kanri.md
grep -c 'Residency rows of this run' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `2`, `1`. Baseline `0`, `1`, `0`, `0`, measured 2026-09-09.

- [ ] **Step 26: Verify the P7.9 anchor, before the edit**

Anchor — Exit shoroku's step 2, whose first three lines are the old passage, and
the needle is the passage's unchanged opening, which survives into the new
passage, so this check still returns `1` after the edit; the Verify step's
joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
2. Rule on every item per the adoption rule, record the rulings in the `S-n`
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 27: P7.9 — Exit shoroku step 2 escalates original then reference translation**

This is a **replacement** of the three lines below by the four that follow. The
step continues on the file's next line, which names
`exit-<role>[-<suffix>]-direction.md`, and that line does not change — the
note's check 6 counts `exit-<role>` three times in this file.

Old passage — replace exactly these 3 lines and nothing else:

````markdown
2. Rule on every item per the adoption rule, record the rulings in the `S-n`
   table with Stage `exit:<role>[-<suffix>]`, ask the human the escalated
   items, and write the answer item by item to the matching
````

New passage, written CRLF:

````markdown
2. Rule on every item per the adoption rule, record the rulings in the `S-n`
   table with Stage `exit:<role>[-<suffix>]`, ask the human the escalated
   items, original then reference translation, and write the answer item by
   item to the matching
````

- [ ] **Step 28: Verify P7.9**

````bash
new=$(cat <<'EOF'
2. Rule on every item per the adoption rule, record the rulings in the `S-n` table with Stage `exit:<role>[-<suffix>]`, ask the human the escalated items, original then reference translation, and write the answer item by item to the matching `exit-<role>[-<suffix>]-direction.md`. Then send
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
2. Rule on every item per the adoption rule, record the rulings in the `S-n` table with Stage `exit:<role>[-<suffix>]`, ask the human the escalated items, and write the answer item by item to the matching
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'original then reference translation' skills/tanto/roles/kanri.md
grep -cF 'exit-<role>' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `3`, `3`. The last is the note's check 6 value for this
file and must not move. Baseline `0`, `1`, `0`, `3`, measured 2026-09-09.

- [ ] **Step 29: Verify the P7.10 anchor, before the edit**

Anchor — the commit window's quote of Sekkei's boundary reply, whose two lines
are the old passage, and the needle is the passage's unchanged opening, which
survives into the new passage, so this check still returns `1` after the edit;
the Verify step's joined needle pins the inversion.

````bash
needle=$(cat <<'EOF'
   last boundary, then wait for Sekkei's one-line reply —
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 30: P7.10 — the boundary reply Kanri waits for carries the reading**

This is a **replacement** of the two lines below by the three that follow. The
sentence continues on the file's next line, which begins "when the reply is
overdue", and that line does not change.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
   last boundary, then wait for Sekkei's one-line reply —
   `committed <subject>` or `nothing to commit`; subscribe to its idle only
````

New passage, written CRLF:

````markdown
   last boundary, then wait for Sekkei's one-line reply —
   `committed <subject> — <reading>` or `nothing to commit — <reading>`;
   subscribe to its idle only
````

- [ ] **Step 31: Verify P7.10**

````bash
new=$(cat <<'EOF'
last boundary, then wait for Sekkei's one-line reply — `committed <subject> — <reading>` or `nothing to commit — <reading>`; subscribe to its idle only when the reply is overdue
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
last boundary, then wait for Sekkei's one-line reply — `committed <subject>` or `nothing to commit`; subscribe to its idle only
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF 'nothing to commit' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `1`. The third is the note's check 6 value for this file
and must not move — the phrase stays on one line and on one line only.
Baseline `0`, `1`, `1`, measured 2026-09-09.

- [ ] **Step 32: Verify the P7.11 anchor, before the edit**

Anchor — Exit shoroku's step 3, whose three lines are the old passage, and the
needle is the passage's unchanged opening, which survives into the new passage,
so this check still returns `1` after the edit; the Verify step's joined needle
pins the inversion.

````bash
needle=$(cat <<'EOF'
3. The session applies the accepted subset, lints, commits once by explicit
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 33: P7.11 — the exit line Kanri expects carries the reading**

This is a **replacement** of the three lines below by the four that follow.

Old passage — replace exactly these 3 lines and nothing else:

````markdown
3. The session applies the accepted subset, lints, commits once by explicit
   path in the slot you give it in the commit window, and answers
   `exit write-out committed: <subject>` or `exit write-out: nothing accepted`.
````

New passage, written CRLF:

````markdown
3. The session applies the accepted subset, lints, commits once by explicit
   path in the slot you give it in the commit window, and answers
   `exit write-out committed: <subject> — <reading>` or
   `exit write-out: nothing accepted — <reading>`.
````

- [ ] **Step 34: Verify P7.11**

````bash
new=$(cat <<'EOF'
3. The session applies the accepted subset, lints, commits once by explicit path in the slot you give it in the commit window, and answers `exit write-out committed: <subject> — <reading>` or `exit write-out: nothing accepted — <reading>`.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
3. The session applies the accepted subset, lints, commits once by explicit path in the slot you give it in the commit window, and answers `exit write-out committed: <subject>` or `exit write-out: nothing accepted`.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF -- '— <reading>' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `6` — the plan-committed line from task 5, the two
residency lines from task 6, the boundary reply from P7.10, and the two exit
forms here, on six lines in all. Baseline `0`, `1`, `4`, measured 2026-09-09
against the tree as tasks 5 and 6 leave it.

- [ ] **Step 35: Verify the P7.12 anchor, before the edit**

Anchor — the human-access item that gives the two standing grants, whose four
lines are the old passage, so this check inverts.

````bash
needle=$(cat <<'EOF'
   when you give a kept Sekkei the next topic; an attached Kaiseki's debugging
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 36: P7.12 — the dialogue grant is given once, at Sekkei's creation**

This is a **replacement** of the four lines below by the three that follow: the
clause "and the same line again when you give a kept Sekkei the next topic"
goes, because a Sekkei is never reused across topics.

Old passage — replace exactly these 4 lines and nothing else:

````markdown
3. Two standing grants are yours to give without a request: Sekkei's spec and
   plan dialogue, in its orders line at the handshake, and the same line again
   when you give a kept Sekkei the next topic; an attached Kaiseki's debugging
   conversation, in the Human access section of its brief.
````

New passage, written CRLF:

````markdown
3. Two standing grants are yours to give without a request: Sekkei's spec and
   plan dialogue, in its orders line at the handshake; an attached Kaiseki's
   debugging conversation, in the Human access section of its brief.
````

- [ ] **Step 37: Verify P7.12**

````bash
new=$(cat <<'EOF'
3. Two standing grants are yours to give without a request: Sekkei's spec and plan dialogue, in its orders line at the handshake; an attached Kaiseki's debugging conversation, in the Human access section of its brief.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
3. Two standing grants are yours to give without a request: Sekkei's spec and plan dialogue, in its orders line at the handshake, and the same line again when you give a kept Sekkei the next topic; an attached Kaiseki's debugging conversation, in the Human access section of its brief.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'kept Sekkei' skills/tanto/roles/kanri.md
````

Expected: `1`, `0`, `0`. Baseline `0`, `1`, `1`, measured 2026-09-09.

- [ ] **Step 38: The task's content greps**

````bash
grep -c 'keep it for the next spec' skills/tanto/roles/kanri.md
grep -c 'kept Sekkei' skills/tanto/roles/kanri.md
grep -c 'reference translation' skills/tanto/roles/kanri.md
grep -c 'original then reference translation' skills/tanto/roles/kanri.md
grep -c 'superseded: <topic> R-n' skills/tanto/roles/kanri.md
grep -cF 'exit:kanri-<YYYY-MM-DD>-<name>' skills/tanto/roles/kanri.md
grep -cF 'exit-kanri-<YYYY-MM-DD>-<name>' skills/tanto/roles/kanri.md
grep -cF 'exit-kanri-<YYYY-MM-DD>-proposal' skills/tanto/roles/kanri.md
grep -cF 'templates/roster-archive.md' skills/tanto/roles/kanri.md
grep -cF -- '— <reading>' skills/tanto/roles/kanri.md
grep -cF 'exit-<role>' skills/tanto/roles/kanri.md
grep -cF 'nothing to commit' skills/tanto/roles/kanri.md
grep -c 'Residency row' skills/tanto/roles/kanri.md
````

Expected, line by line: `0`, `0`, `4`, `3`, `1`, `1`, `1`, `0`, `1`, `6`, `3`,
`1`, `7`. Baseline, against the tree as tasks 5 and 6 leave it: `1`, `1`, `0`,
`0`, `0`, `0`, `0`, `1`, `0`, `4`, `3`, `1`, `6`, measured 2026-09-09; the
last rises from `6` to `7` through P7.8's "Residency rows of this run".

- [ ] **Step 39: The headings are unchanged but for task 5's rename and task 6's addition**

````bash
diff <(grep '^#' skills/tanto/roles/kanri.md) <(git show main:skills/tanto/roles/kanri.md | grep '^#') && echo "no difference"
````

Expected: exactly the `### The five cases` / `### The four cases` change and
the added `### Readings`; `diff` exits 1, so `no difference` does not print.
This task adds and renames no heading.

- [ ] **Step 40: The line ending is what step 1 read**

````bash
git ls-files --eol skills/tanto/roles/kanri.md
````

Expected: the same `i/lf`, `w/crlf`, `attr/text=auto`, and never `w/mixed`.

- [ ] **Step 41: The diff of the file is the union of tasks 5, 6, and 7**

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md
````

Expected: the union of P5.1 to P5.6, P6.1 to P6.8, and P7.1 to P7.12 — twenty-
six passages — read hunk by hunk against the three tasks' blocks and matched by
text. Hunk order is file order, not task order, so a passage from task 7 sits
above passages from tasks 5 and 6. No hunk count is stated, and no line outside
the twenty-six passages may appear.

- [ ] **Step 42: Lint the path**

````bash
./scripts/lint.sh skills/tanto/roles/kanri.md
````

Windows alternative: `scripts\lint.bat skills/tanto/roles/kanri.md`. Expected:
exit 0, every hook `Passed` or `Skipped`, none `Failed`.

- [ ] **Step 43: Commit**

````bash
git commit --only skills/tanto/roles/kanri.md -m "feat(tanto): a peer's compaction replaces it, and no Sekkei is kept for a next topic" -m "The Replace table gains a row for Sekkei and one for Kaiseki and puts the reading into Jisso's: a compaction in a peer is a replacement at that role's next boundary, exit shoroku first, symmetric with Kanri's own trigger. The Delete table's Sekkei row says a Sekkei is never kept for the next topic and why, and its plan-close row moves the dead, replaced, and refused rows with their readings and the plan's Events lines into the archive and fills the ledger's Measurements row. Kanri's own exit files carry its bare name, an escalated item reaches the human as the original then a reference translation in three places, and the adoption rule gains the cross-ledger reference form and the Written-column values." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 44: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 8: the README, the consistency note, and the whole-tree sweeps

**Files:**

- Modify: `skills/tanto/README.md` — four passages, P8.1 to P8.4.
- Modify: `docs/notes/tanto-consistency-checks.md` — five passages, P8.5 to
  P8.9.
- Modify: `skills/tanto/SKILL.md` — one passage, P8.10, added at Kanri's cold
  read (ledger R-9): the roster column list of "Handshake and roster" gains
  `transcript`, which task 2 added to the roster and P1.5 keys the resume on.
- Modify: nothing else. Steps 22 to 30 write no file; their recorded output
  **is** part of this task's deliverable.

**Interfaces:**

- Consumes: everything tasks 1 to 7 wrote. The note's edited checks are what
  the plan's own verification runs at the batch B boundary, so this task's
  numbers must match the tree the previous seven tasks left.
- Produces: nothing a later task consumes — this is the last task.
- `skills/tanto/README.md` is the **skill's** README, not the repository root's;
  the root `README.md` is deliberately out of scope, as the note says.
  `docs/notes/tanto-consistency-checks.md` is the one path under `docs/` this
  plan edits, and it is edited because its checks are this plan's verification;
  a plan that edits the note governing its own verification licenses its own
  omission, so every count this task writes into the note is also run in this
  task's own steps and recorded.
- Both files are markdownlint-checked and both are `w/crlf`.
- **The dispatch for this task tells the reviewer to re-run the sweeps**, not
  to read them: a report of a check is not the check.

- [ ] **Step 1: Read the three files' line endings, before the first edit**

````bash
git ls-files --eol skills/tanto/README.md docs/notes/tanto-consistency-checks.md skills/tanto/SKILL.md
````

Expected: `i/lf`, `w/crlf`, `attr/text=auto` for all three. Measured
2026-09-09. Every passage below is written **CRLF**.

- [ ] **Step 2: Verify the P8.1 anchor, before the edit**

Anchor — the README's state-in-files bullet, which is the old passage, and the
needle is the passage's unchanged opening, which survives into the new passage,
so this check still returns `1` after the edit; the Verify step's joined needle
pins the inversion.

````bash
needle=$(cat <<'EOF'
- Keeps state in files rather than in messages — a roster, a conductor ledger,
EOF
)
grep -cF -- "$needle" skills/tanto/README.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 3: P8.1 — the README says a session measures itself**

This is a **replacement** of the three lines below by the seven that follow.

Old passage — replace exactly these 3 lines and nothing else:

````markdown
- Keeps state in files rather than in messages — a roster, a conductor ledger,
  batch prompts and reports, Kaiseki briefs and reports. A message is one line
  plus a path, because a message dies with the session and a file does not.
````

New passage, written CRLF:

````markdown
- Keeps state in files rather than in messages — a roster, a conductor ledger,
  batch prompts and reports, Kaiseki briefs and reports. A message is one line
  plus a path, because a message dies with the session and a file does not.
  Every session also measures its own context from its own transcript — bytes,
  records, wake-ups, compactions — and sends that reading with the lines it
  already sends, so the roster holds what the current run costs and its archive
  holds what earlier runs cost.
````

- [ ] **Step 4: Verify P8.1**

````bash
new=$(cat <<'EOF'
- Keeps state in files rather than in messages — a roster, a conductor ledger, batch prompts and reports, Kaiseki briefs and reports. A message is one line plus a path, because a message dies with the session and a file does not. Every session also measures its own context from its own transcript — bytes, records, wake-ups, compactions — and sends that reading with the lines it already sends, so the roster holds what the current run costs and its archive holds what earlier runs cost.
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
a file does not. - Takes bug reports about the skills
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
````

Expected: `1`, `0`. The old bullet is a prefix of the new one, so a test on
the old text alone would still find it; the second check pins the old
bullet's last words against the start of the bullet that follows, which are
adjacent only while the old bullet is unedited. Baseline `0`, `1`, measured
2026-09-09.

- [ ] **Step 5: Verify the P8.2 anchor, before the edit**

Anchor — the standalone-Kaiseki paragraph at the end of Usage, which stays. The
new paragraph goes **after** it.

````bash
needle=$(cat <<'EOF'
`/tanto kaiseki` with no address is standalone Kaiseki — the strong model leads
EOF
)
grep -cF -- "$needle" skills/tanto/README.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 6: P8.2 — the README lists `/tanto resume`**

This is an **insertion**: one blank line, then the paragraph below, immediately
after the anchor paragraph's second line (`one debugging session, with no
roster and no batch loop.`). The blank line already before `## Layout` keeps
that heading separated.

New passage, written CRLF:

````markdown
A window that comes back after an editor restart or a closed tab keeps its
context and its transcript but gets a new name. `/tanto resume`, typed in that
window, matches it to its roster row by that transcript path and rejoins it to
the run; no address is pasted, and Kanri's window goes first.
````

- [ ] **Step 7: Verify P8.2**

````bash
needle=$(cat <<'EOF'
one debugging session, with no roster and no batch loop. A window that comes back after an editor restart or a closed tab keeps its context and its transcript but gets a new name. `/tanto resume`, typed in that window, matches it to its roster row by that transcript path and rejoins it to the run; no address is pasted, and Kanri's window goes first. ## Layout
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
grep -cF -- '/tanto resume' skills/tanto/README.md
````

Expected: `1`, `1`. The needle carries the anchor's tail and the next heading,
so it pins the position. Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 8: Verify the P8.3 anchor, before the edit**

Anchor — the Layout section's templates bullet, which is the old passage, so
this check inverts.

````bash
needle=$(cat <<'EOF'
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the
EOF
)
grep -cF -- "$needle" skills/tanto/README.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 9: P8.3 — the templates list gains `roster-archive.md`**

This is a **replacement** of the four lines below by the five that follow.

Old passage — replace exactly these 4 lines and nothing else:

````markdown
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the
  conductor ledger), `kanri-handover.md`, `bug-report.md`, `batch-prompt.md`,
  `batch-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`,
  `review-brief.md`, and `tanto.json` (the built-in expected-model defaults).
````

New passage, written CRLF:

````markdown
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, and `tanto.json` (the built-in
  expected-model defaults).
````

- [ ] **Step 10: Verify P8.3**

````bash
new=$(cat <<'EOF'
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`, `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`, `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`, `review-brief.md`, and `tanto.json` (the built-in expected-model defaults).
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`, `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`, `review-brief.md`, and `tanto.json` (the built-in expected-model defaults).
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -cF 'roster-archive' skills/tanto/README.md
````

Expected: `1`, `0`, `1`. Baseline `0`, `1`, `0`, measured 2026-09-09.

- [ ] **Step 11: Verify the P8.4 anchor, before the edit**

Anchor — the last line of the designs list, which is the old passage, so this
check inverts.

````bash
needle=$(cat <<'EOF'
`docs/superpowers/specs/2026-09-08-review-brief-design.md`.
EOF
)
grep -cF -- "$needle" skills/tanto/README.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 12: P8.4 — the designs list gains this spec**

This is a **replacement** of the one line below by the two that follow. The
four lines above it do not change.

Old passage — replace exactly this 1 line and nothing else:

````markdown
`docs/superpowers/specs/2026-09-08-review-brief-design.md`.
````

New passage, written CRLF:

````markdown
`docs/superpowers/specs/2026-09-08-review-brief-design.md`, and
`docs/superpowers/specs/2026-09-09-context-cost-design.md`.
````

- [ ] **Step 13: Verify P8.4**

````bash
new=$(cat <<'EOF'
`docs/superpowers/specs/2026-09-08-review-brief-design.md`, and `docs/superpowers/specs/2026-09-09-context-cost-design.md`.
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
grep -cF '2026-09-09-context-cost-design.md' skills/tanto/README.md
tail -c1 skills/tanto/README.md | od -An -c | tr -d ' '
````

Expected: `1`, `1`, `\n`. Baseline `0`, `0`, `\n`, measured 2026-09-09.

- [ ] **Step 13a: Verify the P8.10 anchor, before the edit**

P8.10 was added at Kanri's cold read (ledger R-9): `SKILL.md`'s "Handshake
and roster" column list was quoted in no passage of the spec or the plan,
while P1.5's Resuming keys the resume on the roster's Transcript column and
P2.3 added that column. It lands in this task so that the last task closes
the contradiction, and its steps are numbered 13a to 13c so that every step
number the rest of the plan cites stays as it is.

Anchor — the sentence before the column list, which stays:

````bash
needle=$(cat <<'EOF'
The roster lives at `.superpowers/sdd/roster.md`, is written only by Kanri from
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
git ls-files --eol skills/tanto/SKILL.md
````

Expected: `1`, and `w/crlf`. Measured 2026-09-09, on the tree as batch A left
it. The passage is written CRLF.

- [ ] **Step 13b: P8.10 — the roster's column list gains `transcript`**

This is a **replacement** of the four lines below by the four that follow —
the column list and the `ListAgents` sentence that shares its lines,
rewrapped together; the sentence's words do not change.

Old passage — replace exactly these 4 lines and nothing else:

````markdown
`templates/roster.md`, and has Kanri's row first. Columns are role, name
`[ref]`, cwd, model, branch, mode, started, status. `ListAgents` shows name,
`[ref]`, kind, and start time — not the cwd, the model, or the role; the
handshake carries those.
````

New passage, written CRLF:

````markdown
`templates/roster.md`, and has Kanri's row first. Columns are role, name
`[ref]`, cwd, model, branch, mode, started, status, transcript. `ListAgents`
shows name, `[ref]`, kind, and start time — not the cwd, the model, or the
role; the handshake carries those.
````

- [ ] **Step 13c: Verify P8.10**

````bash
new=$(cat <<'EOF'
Columns are role, name `[ref]`, cwd, model, branch, mode, started, status, transcript. `ListAgents` shows name, `[ref]`, kind, and start time — not the cwd, the model, or the role; the handshake carries those.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$new"
old=$(cat <<'EOF'
mode, started, status. `ListAgents`
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$old"
grep -c 'started, status, transcript' skills/tanto/SKILL.md
git ls-files --eol skills/tanto/SKILL.md
````

Expected: `1`, `0`, `1`, and `w/crlf`. Baseline `0`, `1`, `0`, measured
2026-09-09 on the tree as batch A left it. The old-passage pin is the old
line's tail joined to the sentence that followed it, which only the unedited
lines have.

- [ ] **Step 14: Verify the P8.5 anchor, before the edit**

Anchor — the note's Versions bullet, which is the old passage, so this check
inverts.

````bash
needle=$(cat <<'EOF'
- **Sixteen skill files, ten of them templates**, as check 1 lists them.
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`. Measured 2026-09-09.

- [ ] **Step 15: P8.5 — seventeen skill files, eleven of them templates**

This is a **replacement** of that one line by the one below.

New passage, written CRLF:

````markdown
- **Seventeen skill files, eleven of them templates**, as check 1 lists them.
````

- [ ] **Step 16: P8.6 — check 1 lists the new template and expects seventeen**

Two **replacements** in check 1, each of one line.

The first — the `ls` line that names `templates/roster.md`. Its anchor is the
old passage, so its pre-edit check returns `1` and inverts:

````bash
needle=$(cat <<'EOF'
  skills/tanto/templates/roster.md skills/tanto/templates/kanri.md \
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected before the edit: `1`, measured 2026-09-09. Replace it with these two
lines, written CRLF — the trailing backslash on each is the shell continuation
the block depends on:

````markdown
  skills/tanto/templates/roster.md skills/tanto/templates/kanri.md \
  skills/tanto/templates/roster-archive.md \
````

The second — the Expected line. Its anchor is also the old passage:

````bash
needle=$(cat <<'EOF'
Expected: all sixteen paths listed, no `No such file or directory`.
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected before the edit: `1`, measured 2026-09-09. Replace it with, written
CRLF:

````markdown
Expected: all seventeen paths listed, no `No such file or directory`.
````

- [ ] **Step 17: Verify P8.5 and P8.6 by running check 1**

````bash
grep -c 'Seventeen skill files, eleven of them templates' docs/notes/tanto-consistency-checks.md
grep -c 'Sixteen skill files, ten of them templates' docs/notes/tanto-consistency-checks.md
grep -cF 'Expected: all seventeen paths listed' docs/notes/tanto-consistency-checks.md
ls skills/tanto/SKILL.md skills/tanto/README.md \
  skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md \
  skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md \
  skills/tanto/templates/roster.md skills/tanto/templates/kanri.md \
  skills/tanto/templates/roster-archive.md \
  skills/tanto/templates/kanri-handover.md \
  skills/tanto/templates/bug-report.md \
  skills/tanto/templates/batch-prompt.md \
  skills/tanto/templates/batch-report.md \
  skills/tanto/templates/kaiseki-brief.md \
  skills/tanto/templates/kaiseki-report.md \
  skills/tanto/templates/review-brief.md \
  skills/tanto/templates/tanto.json 2>&1 | wc -l
````

Expected: `1`, `0`, `1`, then `17` — seventeen paths listed and no
`No such file or directory`. Baseline `0`, `1`, `0`, and `16` for the old
sixteen-path form, measured 2026-09-09.

- [ ] **Step 18: P8.7 — check 2 expects fifteen `ok` lines**

This is a **replacement** of the six lines below by the eight that follow.

Anchor and old passage — its pre-edit check returns `1` and inverts:

````bash
needle=$(cat <<'EOF'
Expected: fourteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected before the edit: `1`, measured 2026-09-09.

Old passage — replace exactly these 6 lines and nothing else:

````markdown
Expected: fourteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`,
`templates/review-brief.md`, `templates/roster.md`, `templates/tanto.json` —
````

New passage, written CRLF:

````markdown
Expected: fifteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`,
`templates/review-brief.md`, `templates/roster-archive.md`,
`templates/roster.md`, and `templates/tanto.json`, whose relative order for the
two roster paths is the locale's and is not part of this check —
````

- [ ] **Step 19: Verify P8.7 by running check 2**

````bash
grep -oh 'roles/[a-z]*\.md\|templates/[a-z-]*\.md\|templates/tanto\.json\|skills/tanto/[a-z/-]*\.md\|skills/tanto/[a-z/-]*\.json' \
  skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md \
  | sed 's|^skills/tanto/||' | sort -u \
  | while read -r p; do
      if [ -f "skills/tanto/$p" ]; then echo "ok       $p"; else echo "MISSING  $p"; fi
    done
````

Expected: fifteen `ok` lines and no `MISSING` line. `templates/roster-archive.md`
is the fifteenth, and it resolves because task 1 named it in `SKILL.md`'s
templates list and task 7 named it in `roles/kanri.md`'s plan-close row.
Baseline: fourteen `ok` lines, measured 2026-09-09.

- [ ] **Step 20: P8.8 — check 3's map gains the archive and expects eleven**

Two **replacements**, each of one line.

The first — the map line for `templates/roster.md`. Anchor and old passage:

````bash
needle=$(cat <<'EOF'
templates/roster.md skills/tanto/roles/kanri.md
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected before the edit: `1`, measured 2026-09-09. Replace it with these two
lines, written CRLF:

````markdown
templates/roster.md skills/tanto/roles/kanri.md
templates/roster-archive.md skills/tanto/roles/kanri.md
````

The second — the Expected line. Anchor and old passage:

````bash
needle=$(cat <<'EOF'
Expected: ten `ok` lines, no `UNCITED`. Seven of the ten are Kanri's, because
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected before the edit: `1`, measured 2026-09-09. Replace those two lines —
that one and the `Kanri copies seven of the templates itself.` line under it —
with, written CRLF:

````markdown
Expected: eleven `ok` lines, no `UNCITED`. Eight of the eleven are Kanri's,
because Kanri copies eight of the templates itself.
````

- [ ] **Step 21: Verify P8.8 by running check 3**

````bash
while read -r tpl reader; do
  if grep -qF "$tpl" "$reader"; then echo "ok       $tpl <- $reader"; else echo "UNCITED  $tpl <- $reader"; fi
done <<'MAP'
templates/roster.md skills/tanto/roles/kanri.md
templates/roster-archive.md skills/tanto/roles/kanri.md
templates/kanri.md skills/tanto/roles/kanri.md
templates/kanri-handover.md skills/tanto/roles/kanri.md
templates/bug-report.md skills/tanto/roles/kanri.md
templates/batch-prompt.md skills/tanto/roles/kanri.md
templates/kaiseki-brief.md skills/tanto/roles/kanri.md
templates/review-brief.md skills/tanto/roles/kanri.md
templates/batch-report.md skills/tanto/roles/jisso.md
templates/kaiseki-report.md skills/tanto/roles/kaiseki.md
templates/tanto.json skills/tanto/SKILL.md
MAP
````

Expected: eleven `ok` lines, no `UNCITED`. Baseline: ten, measured 2026-09-09.
The block above is the note's own, re-read from the note after the edit rather
than retyped, if the two are ever suspected of differing:
`sed -n '/^## 3\. Every template is cited/,/^MAP$/p' docs/notes/tanto-consistency-checks.md`.

- [ ] **Step 22: P8.9 — check 6's Residency pins, five routed strings, and the sequence**

Three **replacements** inside check 6.

The first — the two Residency-line pins. Anchor and old passage:

````bash
needle=$(cat <<'EOF'
grep -cF 'Kanri <name> [<ref>] since <YYYY-MM-DD>:' skills/tanto/templates/roster.md
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected before the edit: `1`, measured 2026-09-09. Replace those two lines —
that one and the `kanri-handover.md` one under it — with, written CRLF, both
unwrapped:

````markdown
grep -cF '| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |' skills/tanto/templates/roster.md
grep -cF '| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |' skills/tanto/templates/kanri-handover.md
````

The second — five new lines at the end of the same block. Anchor, which stays:

````bash
needle=$(cat <<'EOF'
grep -cF 'bug-report: <absolute path>' skills/tanto/templates/bug-report.md
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`, measured 2026-09-09. **Insert** these five lines immediately
after it, still inside the fence, written CRLF:

````markdown
grep -cF 'transcript=<absolute path|unavailable>' skills/tanto/SKILL.md
grep -cF 'compacted: <path>' skills/tanto/SKILL.md
grep -cF 'compacted: <path>' skills/tanto/roles/kanri.md
grep -cF 'confirmed: <path>' skills/tanto/SKILL.md
grep -cF 'confirmed: <path>' skills/tanto/roles/kanri.md
````

The third — the Expected paragraph. Anchor and old passage:

````bash
needle=$(cat <<'EOF'
Expected, one number per line, in order: `2`, `1`, `1`, `2`, `1`, `1`, `1`,
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected before the edit: `1`, measured 2026-09-09.

Old passage — replace exactly these 8 lines and nothing else:

````markdown
Expected, one number per line, in order: `2`, `1`, `1`, `2`, `1`, `1`, `1`,
`1`, `5`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `3`, `1`,
`1`, `1`, `1`, `1`, `1`. The six trailing `1`s pin the three cross-file pairs
— the Residency line, the seven-column `S-n` header, and the bug-report line
— each copy once, so that a change to one copy shows up as a mismatch. The
`--` before the
`- Kanri` pattern is required: without it `grep` reads the leading `-` as an
option.
````

New passage, written CRLF:

````markdown
Expected, one number per line, in order: `2`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `5`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `3`, `1`,
`1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`. The fourth is `3` because
`SKILL.md` spells `kanri-address:` three times: the handshake section's
handover form, the Resuming section's resumed form, and the `<kanri-address>`
blank's own paragraph. The six `1`s before the last five pin the three
cross-file pairs — the Residency table header, the seven-column `S-n` header,
and the bug-report line — each copy once, so that a change to one copy shows
up as a mismatch. The last five pin the strings the reading and the compaction
rule route on: the handshake's `transcript=` blank in the contract, and
`compacted:` and `confirmed:` in the contract and in Kanri's role file. The
`--` before the
`- Kanri` pattern is required: without it `grep` reads the leading `-` as an
option.
````

- [ ] **Step 23: Verify P8.9 by running check 6's first block**

Run the check 6 block **as the note now carries it** — extracted from the note,
not retyped:

````bash
C6=$(mktemp)
sed -n '/^## 6\. The strings the roles route on$/,/^```$/p' docs/notes/tanto-consistency-checks.md \
  | sed -n '/^```bash$/,$p' | sed '1d;$d' > "$C6"
wc -l < "$C6"
sh "$C6"
rm -f "$C6"
````

Expected: `32` — the block's line count, twenty-seven lines as it stood plus
the five appended — then the thirty-two numbers of the new Expected paragraph,
one per line, in that order. The script goes to `mktemp`, outside the
repository, so that the working tree stays clean; step 30 proves
`git status --short` prints nothing.

- [ ] **Step 24: Run the rest of the note's checks — 5, 7, 8, and 9**

````bash
SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills"
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' skills/tanto/roles/jisso.md
grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' skills/tanto/SKILL.md
grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' "$SP/subagent-driven-development/SKILL.md"
grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' skills/tanto/roles/jisso.md
````

Expected: `1` on all five — the note's check 5, the four SDD stop classes and
the four statuses still byte-identical across their copies. Baseline the same,
measured 2026-09-09.

````bash
grep -rn '/rename' skills/tanto/
grep -rn -i 'four-session' skills/tanto/
grep -rn '<plan>' skills/tanto/
grep -rn 'skills/tanto/' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE '\b[0-9a-f]{7,40}\b' skills/tanto/
grep -c 'multi-session orchestration' skills/tanto/SKILL.md skills/tanto/README.md
````

Expected: no output from the first five (each exits 1) — the note's check 7,
including that no runtime file names `skills/tanto/` and that no line is a
commit hash — then `skills/tanto/SKILL.md:1` and `skills/tanto/README.md:1`.
Run the note's own check 7 block in full for the remaining patterns. Baseline
the same, measured 2026-09-09.

````bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
uv run --no-project python -c "import json;json.load(open('skills/tanto/templates/tanto.json'));print('json ok')"
````

Expected: `['argument-hint', 'description', 'name']`, `ok`, `json ok` — the
note's check 8. Never a bare `python`.

````bash
ML=$(ls ~/.cache/pre-commit/repo*/node_env-default/Scripts/markdownlint-cli2 | head -1)
"$ML" --config "$(git rev-parse --show-toplevel)/.markdownlint-cli2.yaml" skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md docs/notes/tanto-consistency-checks.md
find skills docs -name '*.md' -print0 | while IFS= read -r -d '' f; do
  [ "$(grep -c '[[:space:]]$' "$f")" != "0" ] && echo "trailing whitespace: $f"
  [ "$(tail -c1 "$f" | od -An -c | tr -d ' ')" != '\n' ] && echo "no final newline: $f"
done; echo done
````

Expected: `Summary: 0 error(s)`, then `done` alone — the note's check 9. On a
POSIX host the executable sits under `bin/` instead of `Scripts/`; the `repo*`
directory is named after the hook's `rev`, so glob for it.

- [ ] **Step 25: The forward sweep — every term batch B lands, in every file batch A wrote**

Batch B is tasks 5 to 8 and batch A is tasks 1 to 4. This sweep **prints its
hits**, so that what it decided is on the record; it is not a `wc -l`.

````bash
for t in 'Resumed Kanri' 'resumed:' 'Residency row' 'Residency table' 'original then reference translation' 'reference translation' 'superseded: <topic> R-n' 'exit:kanri-<YYYY-MM-DD>-<name>' 'roster-archive' 'compacted:' 'confirmed:' 'plan-dryrun' '(unverified)' 'status, transcript'; do
  echo "== $t"
  grep -rnF -- "$t" skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles skills/tanto/templates
done
````

Expected, read term by term against the batch A files —
`skills/tanto/SKILL.md`, `templates/roster.md`,
`templates/roster-archive.md`, `templates/kanri.md`,
`templates/batch-report.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `roles/jisso.md`, `roles/kaiseki.md`,
`roles/sekkei.md`:

- `Resumed Kanri` — `roles/kanri.md` only, twice. Batch A files carry it
  nowhere, and they do not need to: the case is Kanri's alone.
- `resumed:` — `SKILL.md` (the Events line in Resuming) and `roles/kanri.md`
  twice. A batch A file that carried it and a batch B file that did not would
  be the forward reference this sweep exists to find.
- `Residency row` / `Residency table` — `templates/roster.md` and
  `templates/kanri-handover.md` carry the **table**; `roles/kanri.md` carries
  the phrase five times and `Residency table` once.
- `original then reference translation` — `roles/kanri.md` three times, and
  nowhere else.
- `reference translation` — `roles/kanri.md` four times, and nowhere else.
- `superseded: <topic> R-n` — `templates/kanri.md` once and `roles/kanri.md`
  once: the pair.
- `exit:kanri-<YYYY-MM-DD>-<name>` — `templates/kanri.md` once and
  `roles/kanri.md` once: the pair.
- `roster-archive` — `SKILL.md` twice, `templates/roster.md` three times
  (the Keeping rule's dead-row bullet, the Residency block, and the Events
  sentence), `templates/roster-archive.md` once (its own first paragraph
  names its path), `roles/kanri.md` once, `README.md` once. Measured on the
  tree as batch A left it: the two template counts are Jisso's R-J2 and
  R-J3.
- `status, transcript` — `SKILL.md` once, P8.10's own line, and nowhere
  else: the roster's header spells the column `Transcript`, which this term
  does not match, and that is the point — the contract's prose column list
  and the template's header are the pair the sweep keeps aligned.
- `compacted:` and `confirmed:` — `SKILL.md` once each and `roles/kanri.md`
  once each: the pairs.
- `plan-dryrun` — `SKILL.md`, `roles/sekkei.md`, and `roles/kanri.md`, once
  each.
- `(unverified)` — `templates/roster.md`, `templates/kanri-handover.md`, and
  `roles/kanri.md`, once each.

- [ ] **Step 26: The backward sweep — every term batch A introduced that batch B answers**

````bash
for t in 'plan-dryrun.md' 'roster-archive.md' 'compaction-<role>-<n>.md' 'transcript=' '(unverified)' 'resumed:' '/tanto resume' 'Residency row'; do
  echo "== $t"
  grep -rnF -- "$t" skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles skills/tanto/templates
done
````

Expected: each of the eight terms present in **both** a batch A file and a
batch B file, printed:

- `plan-dryrun.md` — `SKILL.md` and `roles/sekkei.md` (A), `roles/kanri.md` (B).
- `roster-archive.md` — `SKILL.md`, `templates/roster.md` (A),
  `roles/kanri.md`, `README.md` (B).
- `compaction-<role>-<n>.md` — `SKILL.md` (A), and answered in `roles/kanri.md`
  by the `compacted:` handling (B), which names the path through
  `compacted: <path>` rather than the pattern; the pattern itself is `SKILL.md`
  twice.
- `transcript=` — `SKILL.md` three times and `templates/roster.md`'s Keeping
  rule (A), `roles/kanri.md` once (B).
- `(unverified)` — `templates/roster.md`, `templates/kanri-handover.md` (A),
  `roles/kanri.md` (B).
- `resumed:` — `SKILL.md` (A), `roles/kanri.md` twice (B).
- `/tanto resume` — `SKILL.md` six times (A), `roles/kanri.md` once and
  `README.md` once (B).
- `Residency row` — `templates/roster.md` and `templates/kanri-handover.md`
  through the table (A), `roles/kanri.md` five times (B).

A term present in an A file and absent from every B file is a forward reference
the batch A boundary would have left dangling, and is a Rulings-needed item.

- [ ] **Step 27: The absence sweeps**

Every one of these must be falsifiable at repository scope, so each is a
`grep -rn` over the skill that prints nothing. The spec's and this plan's own
copies live under `docs/superpowers/`, which is excluded because both documents
quote the passages they remove.

````bash
grep -rn --exclude-dir=superpowers 'keep it for the next spec' skills docs
grep -rn --exclude-dir=superpowers 'kept Sekkei' skills docs
grep -rn --exclude-dir=superpowers 'given again with each new topic' skills docs
grep -rn 'Residency line' skills/tanto/
grep -rn 'There are ten' skills/tanto/
grep -rnF 'exit-kanri-<YYYY-MM-DD>-proposal' skills/tanto/
grep -rnF 'compaction-<role>.md' skills/tanto/
grep -rnF 'Kanri <name> [<ref>] since <YYYY-MM-DD>:' skills/tanto/
````

Expected: no output from any of the eight; each exits 1. Baseline, measured
2026-09-09 against the unedited tree: one hit for `keep it for the next spec`
(`roles/kanri.md`), one for `kept Sekkei` (`roles/kanri.md`), one for
`given again with each new topic` (`roles/sekkei.md`), four for
`Residency line` (`roles/kanri.md`), one for `There are ten` (`SKILL.md`), one
for `exit-kanri-<YYYY-MM-DD>-proposal` (`SKILL.md`) and one in
`roles/kanri.md`, none for `compaction-<role>.md` — which is the one absence
here that could never have matched before the plan and exists to catch a
missing `-<n>` in the new text — and two for the old Residency line
(`templates/roster.md`, `templates/kanri-handover.md`).

- [ ] **Step 28: The spec's Verification section, run whole**

````bash
grep -c '^## The transcript reading$' skills/tanto/SKILL.md
needle=$(cat <<'EOF'
echo "transcript: $b B, $r records, $w wake-ups, $c compactions"
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
for f in skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md skills/tanto/templates/kanri-handover.md; do
  printf '%s -> %s\n' "$f" "$(grep -cF -- '— <reading>' "$f")"
done
grep -rcF 'transcript:' skills/tanto
grep -c 'transcript=' skills/tanto/SKILL.md
test -f skills/tanto/templates/roster-archive.md && echo archive-present
grep -rcF 'roster-archive' skills/tanto
grep -rcF 'plan-dryrun' skills/tanto
grep -rcF 'compaction-<role>' skills/tanto
grep -c 'There are eleven' skills/tanto/SKILL.md
grep -c 'There are ten' skills/tanto/SKILL.md
grep -rcF 'exit-kanri-<YYYY-MM-DD>-<name>' skills/tanto
grep -c 'reference translation' skills/tanto/roles/kanri.md
grep -c 'original then reference translation' skills/tanto/roles/kanri.md
grep -c 'superseded: <topic> R-n' skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md
grep -cF 'exit:kanri-<YYYY-MM-DD>-<name>' skills/tanto/templates/kanri.md skills/tanto/roles/kanri.md
grep -c '| the review brief writer |' skills/tanto/roles/jisso.md
grep -c '^## Resuming$' skills/tanto/SKILL.md
grep -cF -- '| `resume` | `resume` |' skills/tanto/SKILL.md
grep -rcF -- '/tanto resume' skills/tanto
grep -cF -- '| Transcript |' skills/tanto/templates/roster.md
grep -c 'Resumed Kanri' skills/tanto/roles/kanri.md
needle=$(cat <<'EOF'
`SKILL.md`'s Resuming
EOF
)
grep -rcF -- "$needle" skills/tanto/roles
````

Expected, in order: `1`; `1`; seven lines each ending `-> 1` or more —
`roles/kanri.md -> 6`, `roles/sekkei.md -> 5`, `roles/jisso.md -> 3`,
`roles/kaiseki.md -> 3`, `templates/batch-report.md -> 1`,
`templates/kaiseki-report.md -> 1`, `templates/kanri-handover.md -> 1`; then
`skills/tanto/SKILL.md:2` and `0` for every other file of the skill; `3`;
`archive-present`; at least `1` in `SKILL.md`, `roles/kanri.md`,
`templates/roster.md`, and `README.md`; at least `1` in `SKILL.md`,
`roles/sekkei.md`, and `roles/kanri.md`; at least `1` in `SKILL.md` and
`roles/kanri.md`; `1`; `0`; `2` in `SKILL.md` and at least `1` in
`roles/kanri.md`; at least `1`; `3`; `1` for each of the two files; at least
`1` for each of the two files; `1`; `1`; `1`; at least `1` in `SKILL.md`,
`roles/kanri.md`, and `README.md`; `1`; `2`; and at least `1` in each of the
four role files. Baseline for every one of them: `0`, except `There are ten`,
which was `1`, and the two `— <reading>` and `transcript:` families, which were
`0` everywhere.

- [ ] **Step 29: The reading pipeline runs, on this session's own transcript**

Extract the pipeline from the file rather than retyping it, set `T` to this
session's own transcript per `SKILL.md`'s "The transcript reading", and run it:

````bash
RD=$(mktemp)
sed -n '/^b=/,/^echo "transcript: /p' skills/tanto/SKILL.md > "$RD"
wc -l < "$RD"
T="$CLAUDE_CONFIG_DIR/projects/<project slug>/<session id>.jsonl" sh "$RD"
rm -f "$RD"
````

The `T=` line is the one blank the implementer fills: resolve the project slug
and the session id from the scratchpad path the system prompt names, exactly as
`SKILL.md` says, and use `~/.claude` when `CLAUDE_CONFIG_DIR` is unset.

Expected: `4` — the pipeline's four lines — then one line matching
`^transcript: [0-9]+ B, [0-9]+ records, [0-9]+ wake-ups, [0-9]+ compactions$`.
Baseline, from the spec's own copy of the pipeline run during the spec
dialogue: `transcript: 749144 B, 181 records, 7 wake-ups, 0 compactions`. The
figures here will differ — they are this session's — and what is checked is the
shape and that the command runs at all. A session whose transcript is not where
`SKILL.md` says reports `transcript: unavailable — <one line why>` and says so
in its report.

- [ ] **Step 30: The whole-tree sweeps**

````bash
git status --short
git diff --name-only "$(git merge-base main HEAD)"
git status --porcelain | grep -c '\.bak'
git log --format=%H "$(git merge-base main HEAD)..HEAD" | while read -r h; do git show -s --format=%B "$h" | grep -c '^Co-Authored-By:'; done
````

Expected:

- `git status --short` prints nothing — the workspace `.superpowers/sdd/` is
  ignored by its own `.gitignore`.
- `git diff --name-only` names exactly: the thirteen files this plan writes
  (`skills/tanto/SKILL.md`, `skills/tanto/README.md`, the four role files, the
  six templates including the new `templates/roster-archive.md`, and
  `docs/notes/tanto-consistency-checks.md`); the spec
  `docs/superpowers/specs/2026-09-09-context-cost-design.md`; this plan
  `docs/superpowers/plans/2026-09-09-context-cost.md`; the path of Kanri's own
  commit on this branch, `docs/issues/open/12d3-*.md`, whose subject is
  "docs(issues): tanto keeps both untracked directories at a plan close"; and
  any path written by a `docs: T<n> shoroku` or `docs: exit shoroku` commit
  that has landed by then. Nothing else. A path outside that set is a
  Rulings-needed item, not a revert: the branch carries other sessions'
  committed work, and a merge-base listing answers a different question from
  "what did this task change".
- The `.bak` count is `0`.
- The trailer loop prints `1` for **every** commit — one line per commit, each
  `1`. An aggregate count over the branch would let a commit with two trailers
  balance a commit with none, which is why the check loops.

- [ ] **Step 31: The three files' line endings are what step 1 read**

````bash
git ls-files --eol skills/tanto/README.md docs/notes/tanto-consistency-checks.md skills/tanto/SKILL.md
````

Expected: the same `i/lf`, `w/crlf`, `attr/text=auto` for all three, and
never `w/mixed`.

- [ ] **Step 32: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/README.md docs/notes/tanto-consistency-checks.md skills/tanto/SKILL.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: `README.md` — hunks holding P8.1, P8.2, P8.3, and P8.4; the note —
hunks holding P8.5 to P8.9; `SKILL.md` — hunks holding P1.1 to P1.13 and
P8.10, the last a four-line change inside "Handshake and roster". Read each
hunk against the blocks above and match by text; no hunk count is stated.

- [ ] **Step 33: Lint the three paths**

````bash
./scripts/lint.sh skills/tanto/README.md docs/notes/tanto-consistency-checks.md skills/tanto/SKILL.md
````

Windows alternative: `scripts\lint.bat` with the same three paths. Expected:
exit 0, every hook `Passed` or `Skipped`, none `Failed`. markdownlint binds on
all three.

- [ ] **Step 34: Commit**

````bash
git commit --only skills/tanto/README.md docs/notes/tanto-consistency-checks.md skills/tanto/SKILL.md -m "docs(tanto): the README and the consistency note follow the reading and the archive" -m "The README says a session measures its own context, lists /tanto resume, and names the eleventh template and this spec. The consistency note counts seventeen skill files and eleven templates: check 1 lists roster-archive.md, check 2 expects fifteen ok lines, check 3's map gains the archive against Kanri's role file and expects eleven, and check 6 pins the new Residency table header in the roster and the handover in place of the old one-line Residency, adds transcript=, compacted:, and confirmed: as routed strings, and states the new thirty-two-number sequence. SKILL.md's roster column list gains transcript, the column task 2 added and Resuming keys on (P8.10, Kanri's cold read R-9)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 35: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

## Batches

Two batches of four tasks, one Jisso throughout. **Batch A** is the contract
and the peers — tasks 1, 2, 3, 4. **Batch B** is Kanri's rules and the
tree-wide close — tasks 5, 6, 7, 8. The tasks run in order under
subagent-driven development; tasks 5, 6, and 7 all edit
`skills/tanto/roles/kanri.md`, in that order, and each names anchors the other
two do not touch.

**Batch B's boundary is the boundary from which a role may be started or
replaced, and batch A's boundary is not.** At batch A's boundary the tree is
deliberately inconsistent: `skills/tanto/SKILL.md` defines a reading, a
Resuming section, a `transcript=` handshake blank, a compaction file, and a
dry-run report, and `roles/jisso.md`, `roles/kaiseki.md`, and `roles/sekkei.md`
send and fill them — while `roles/kanri.md` still says a `Residency line`,
still has four start cases, still cold-reads the plan whole, and does not yet
take a reading, answer a `compacted:` line, or match a resumed handshake. A
Kanri started from the tree at that point would read a role file that does not
answer the contract its peers are already following. That list is
illustrative — `roster-archive`, `plan-dryrun`, the Kanri exit pattern, and
`(unverified)` are also defined in batch A and answered only in batch B — and
task 8 step 26's backward sweep is the authority on the set. So, per contract
rule 11
and decision-5c8e: until batch B's boundary the authority for the run's
sessions is this plan's Global Constraints, Kanri's orders line, and the batch
prompts, not the role text on disk; a replacement waits for batch B's boundary;
and this plan expects **one Jisso throughout**, so no replacement is planned at
all. Kanri's own handover, if it falls due, proceeds as rule 11 already allows,
and its successor takes the authority ruling from the handover file. A
compaction in Jisso during batch A does not trigger a replacement — the rule
this plan lands is not yet in force, and rule 11 holds the replacement to
batch B's boundary; only the standing evidence-of-loss condition (a report
says the compaction lost rulings) is a Kanri ruling, recorded as `R-n`. The
human decided this at the plan brief, 2026-09-09.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1, 2, 3, 4 | `SKILL.md` with `## The transcript reading` and its closing compaction paragraph, `## Resuming`, the `resume` invocation row and "those five", the handshake's `transcript=` and its sentence, the Messages boundary-reply bullet, the `exit write-out` lines and the Kanri exit pattern, the three new Artifacts rows and the changed exit-proposal path, and "There are eleven"; `templates/roster.md` with the `Transcript` column, the resume sentence, the dead-row rule, the Residency **table**, and the Events sentence; the new `templates/roster-archive.md`; `templates/kanri.md` with the Stage cell, the two Written-column sentences, and the Measurements fixed row; `templates/batch-report.md` and `templates/kaiseki-report.md` with `- Transcript — <reading>`; `templates/kanri-handover.md` with `(unverified)` and the one-row Residency; `roles/jisso.md`, `roles/kaiseki.md`, and `roles/sekkei.md` with the self-check, the reading, Sekkei's one dry run and `plan-dryrun.md`, the grant clause, and the Models row | lint clean on every changed path, by name (ten paths); every flattened new-passage grep of tasks 1 to 4 returns `1`, every Verify step's old-passage pin returns `0`, every insertion's anchor still returns `1`, and every anchor block returns the post-edit value its step states; `grep -c '^## The transcript reading$' skills/tanto/SKILL.md` and `grep -c '^## Resuming$' skills/tanto/SKILL.md` each `1`; `grep -rcF 'transcript:' skills/tanto` is `2` and only in `SKILL.md`; `grep -cF -- '— <reading>' <file>` at least `1` in `roles/sekkei.md`, `roles/jisso.md`, `roles/kaiseki.md`, `templates/batch-report.md`, `templates/kaiseki-report.md`, and `templates/kanri-handover.md`; `test -f skills/tanto/templates/roster-archive.md` exits 0; `grep -c 'There are eleven' skills/tanto/SKILL.md` is `1` and `grep -c 'There are ten'` is `0`; `grep -cF 'given again with each new topic' skills/tanto/roles/sekkei.md` is `0`; the note's checks 1, 2, 5, 8, and 9 as the **unedited** note states them, except checks 1 and 2, whose counts this batch knowingly breaks by adding the eleventh template and which task 8 repairs — that omission is licensed here and named in task 8's Interfaces; `git ls-files --eol` unchanged for all ten paths and never `w/mixed`; `git diff "$(git merge-base main HEAD)" -- <file>` for each of the ten read hunk by hunk against the blocks; `git status --short` prints nothing; `git status --porcelain \| grep -c '\.bak'` is `0`; every commit on the branch carries exactly one `Co-Authored-By:` line, checked per commit; **the tree is deliberately not self-consistent here, so no role may be started or replaced from this boundary** |
| B | 5, 6, 7, 8 | `roles/kanri.md` with the fifth start case, the Recovery clause, the handshake match, the many-at-once restart, the frame command and the frame cold read, the trigger paragraph and the self-check, the Residency rows, the residency lines, `### Readings` with the `compacted:` handling, the Replace and Delete rows, "Your own exit", the three escalation clauses, the adoption rule's three sentences, and the grant clause; `skills/tanto/README.md` with the reading, `/tanto resume`, `roster-archive.md`, and this spec; `docs/notes/tanto-consistency-checks.md` with seventeen files, eleven templates, and checks 1, 2, 3, and 6 rewritten; `SKILL.md`'s roster column list with `transcript` (P8.10); and the recorded output of the forward sweep, the backward sweep, the absence sweeps, the spec's whole Verification section, the reading pipeline, and the frame command | everything in batch A's list, re-run over the whole tree, **plus**: the note's checks 1, 2, 3, 5, 6, 7, 8, and 9 as **task 8 leaves them** — seventeen `ok`, fifteen `ok`, eleven `ok` and no `UNCITED`, the five stop-class and four-statuses `1`s, check 6's thirty-two numbers, check 7's nine silent greps and the two `multi-session orchestration` `1`s, check 8's `['argument-hint', 'description', 'name']` / `ok` / `json ok`, and check 9's `Summary: 0 error(s)` and `done`; the spec's Verification section run whole, every value as task 8 step 28 states it; the reading pipeline extracted from `SKILL.md` and run on the running session's own transcript, printing one line matching `^transcript: [0-9]+ B, [0-9]+ records, [0-9]+ wake-ups, [0-9]+ compactions$`; the frame command extracted from `roles/kanri.md` and run, printing `631` and `4` on `docs/superpowers/plans/2026-09-09-requirement-extraction.md` and `497` and `7` on `docs/superpowers/plans/2026-09-07-boundary-rules.md`; the forward sweep, the backward sweep, and the eight absence sweeps, each printing its hits and each of the absence greps printing nothing; `git diff --name-only "$(git merge-base main HEAD)"` naming exactly the thirteen files, the spec, this plan, `docs/issues/open/12d3-*.md` from the commit "docs(issues): tanto keeps both untracked directories at a plan close", and any `docs: T<n> shoroku` or `docs: exit shoroku` path; **the tree is self-consistent here, and this is the boundary from which a role may be started or replaced** |

The final batch — the whole-branch review's fix wave, dispatched by Kanri after
batch B — is the protocol's own and is not counted here; a fix-wave list is
drafted under the same conditions as a plan, each command run once and its
output compared with what the list expects before it is dispatched. The
whole-branch review package excludes exactly the commits whose subject begins
`docs: T<n> shoroku` or `docs: exit shoroku`, and the dispatch names Kanri's
own non-plan commit on this branch by subject and path.

## How a batch is verified

For a Markdown-only plan of passage edits, run this checklist at the boundary.
Every dispatch says what "tests" means for its task, per `roles/jisso.md`'s
"Verification when the plan ships documents". Every value below is a number or
a literal string, never "works". Bullets whose subject is `roles/kanri.md`,
`skills/tanto/README.md`, or the note are batch B's: at batch A's boundary,
run the set the Batches table's batch A row names, which is the authority
there, and the whole checklist at batch B's.

- [ ] **Lint the changed paths by name.** `./scripts/lint.sh <file> [<file> …]`
      (Windows: `scripts\lint.bat <file> …`) on the batch's paths — batch A:
      `skills/tanto/SKILL.md`, `templates/roster.md`,
      `templates/roster-archive.md`, `templates/kanri.md`,
      `templates/batch-report.md`, `templates/kaiseki-report.md`,
      `templates/kanri-handover.md`, `roles/jisso.md`, `roles/kaiseki.md`,
      `roles/sekkei.md`; batch B: `roles/kanri.md`, `skills/tanto/README.md`,
      `docs/notes/tanto-consistency-checks.md`. Every hook `Passed` or
      `Skipped`, none `Failed`. markdownlint does **not** bind on
      `skills/tanto/templates/**`; the note's check 9 is where the skill's
      non-template Markdown meets markdownlint, on an extracted tree.
- [ ] **The passage checks, with needles from heredocs.** For every passage of
      the batch, on the flattened file
      (`tr -d '\r' < <file> | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"`):
      the new passage returns `1`; for a replacement the Verify step's
      old-passage pin — the old text joined to what followed it — returns
      `0`; for an insertion the anchor still returns `1`. A pre-edit anchor
      that **is** the old passage inverts only when the new passage supersedes
      the whole needle; an anchor that is the passage's unchanged opening
      still returns `1`, and every anchor step states which value it returns
      after the edit.
- [ ] **The reading section, and the reading travelling.**
      `grep -c '^## The transcript reading$' skills/tanto/SKILL.md` — `1`,
      baseline `0`.
      `grep -cF 'echo "transcript: $b B, $r records, $w wake-ups, $c compactions"' skills/tanto/SKILL.md`
      — `1`, baseline `0`. `grep -cF -- '— <reading>' <file>` — at least `1` in
      each of `roles/kanri.md`, `roles/sekkei.md`, `roles/jisso.md`,
      `roles/kaiseki.md`, `templates/batch-report.md`,
      `templates/kaiseki-report.md`, and `templates/kanri-handover.md`;
      baseline `0` in each. `grep -rcF 'transcript:' skills/tanto` — `2`, in
      `SKILL.md` only (the `echo` and the `transcript: unavailable` fallback),
      so that no other file spells the literal line; baseline `0` everywhere.
- [ ] **The reading runs.** The pipeline, **extracted from `SKILL.md`** rather
      than retyped, with `T` the running session's own transcript, prints one
      line matching
      `^transcript: [0-9]+ B, [0-9]+ records, [0-9]+ wake-ups, [0-9]+ compactions$`,
      and the extraction is four lines long. Baseline, from the spec's copy run
      during the dialogue:
      `transcript: 749144 B, 181 records, 7 wake-ups, 0 compactions`.
- [ ] **The frame command runs.** The `awk` command, **extracted from
      `roles/kanri.md`** rather than retyped, is 16 lines; with `P` set to
      `docs/superpowers/plans/2026-09-09-requirement-extraction.md` it prints
      `631` lines and `4` `[steps:` markers, and on
      `docs/superpowers/plans/2026-09-07-boundary-rules.md` `497` and `7`.
      Baseline, from the spec's copy: the same four figures, measured
      2026-09-09.
- [ ] **No reuse, in all three places.**
      `grep -c 'keep it for the next spec' skills/tanto/roles/kanri.md` — `0`,
      baseline `1`; `grep -c 'kept Sekkei' skills/tanto/roles/kanri.md` — `0`,
      baseline `1`;
      `grep -cF 'given again with each new topic' skills/tanto/roles/sekkei.md`
      — `0`, baseline `1`.
- [ ] **The handshake carries the path.**
      `grep -c 'transcript=' skills/tanto/SKILL.md` — `3`, baseline `0`.
- [ ] **The archive.** `test -f skills/tanto/templates/roster-archive.md` —
      exit 0; `grep -rcF 'roster-archive' skills/tanto` — at least `1` in
      `SKILL.md`, `roles/kanri.md`, `templates/roster.md`, and `README.md`.
      Baseline: the file absent, `0` everywhere.
- [ ] **The dry-run report.** `grep -rcF 'plan-dryrun' skills/tanto` — at least
      `1` in `SKILL.md`, `roles/sekkei.md`, and `roles/kanri.md`. Baseline `0`.
- [ ] **The compaction file.** `grep -rcF 'compaction-<role>' skills/tanto` —
      at least `1` in `SKILL.md` and, through `compacted: <path>`, answered in
      `roles/kanri.md`. Baseline `0`.
- [ ] **Eleven templates.** `grep -c 'There are eleven' skills/tanto/SKILL.md`
      — `1`; `grep -c 'There are ten' skills/tanto/SKILL.md` — `0`. Baseline
      `0` and `1`.
- [ ] **The Kanri exit pattern.**
      `grep -rcF 'exit-kanri-<YYYY-MM-DD>-<name>' skills/tanto` — `2` in
      `SKILL.md`, at least `1` in `roles/kanri.md`;
      `grep -rcF 'exit-kanri-<YYYY-MM-DD>-proposal' skills/tanto` — `0`.
      Baseline `0`, and `1` in each of the two files.
- [ ] **The reference translation, in all four places.**
      `grep -c 'reference translation' skills/tanto/roles/kanri.md` — at least
      `1`, in fact `4`;
      `grep -c 'original then reference translation' skills/tanto/roles/kanri.md`
      — `3`. Baseline `0` and `0`.
- [ ] **The Written convention and the cross-ledger reference.**
      `grep -c 'superseded: <topic> R-n' skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md`
      — `1` each. Baseline `0` each.
- [ ] **The Stage cell mirrors the pattern.**
      `grep -cF 'exit:kanri-<YYYY-MM-DD>-<name>' skills/tanto/templates/kanri.md skills/tanto/roles/kanri.md`
      — at least `1` each. Baseline `0` each.
- [ ] **The brief writer's row.**
      `grep -c '| the review brief writer |' skills/tanto/roles/jisso.md` — `1`.
      Baseline `0`.
- [ ] **Resuming.** `grep -c '^## Resuming$' skills/tanto/SKILL.md` — `1`;
      ``grep -cF '| `resume` | `resume` |' skills/tanto/SKILL.md`` — `1`;
      `grep -rcF -- '/tanto resume' skills/tanto` — at least `1` in
      `SKILL.md`, `roles/kanri.md`, and `README.md`;
      ``grep -cF -- '| Transcript |' skills/tanto/templates/roster.md`` — `1`;
      `grep -c 'Resumed Kanri' skills/tanto/roles/kanri.md` — `2`; the needle
      ``` `SKILL.md`'s Resuming ``` — at least `1` in each of the four role
      files. Baseline `0` for every one.
- [ ] **The stop classes are still one string.** The note's **check 5** on
      `SKILL.md` and `roles/jisso.md` — `1` on all five lines. The check pins
      content, and `SKILL.md`'s line number for that quote moves with the two
      inserted sections. Baseline: present in both.
- [ ] **The frontmatter and the JSON.** The note's **check 8** —
      `['argument-hint', 'description', 'name']`, `ok`, `json ok`, through
      `uv run --no-project` and never a bare `python`. Baseline the same.
- [ ] **The note's counts, as task 8 leaves them.** **Check 1** — seventeen
      paths listed, no `No such file or directory` (baseline sixteen);
      **check 2** — fifteen `ok`, no `MISSING` (baseline fourteen);
      **check 3** with its map extended by
      `templates/roster-archive.md skills/tanto/roles/kanri.md` — eleven `ok`,
      no `UNCITED` (baseline ten); **check 6** — its new thirty-two-number
      sequence, with the Residency table header pinned once in
      `templates/roster.md` and once in `templates/kanri-handover.md`, and
      `transcript=`, `compacted:`, and `confirmed:` each found where the note
      says (baseline: the old twenty-seven-number sequence); **check 7** — no
      output from its nine greps, then the two `multi-session orchestration`
      lines; **check 9** — `Summary: 0 error(s)` and `done`.
- [ ] **The two sweeps and the absence sweeps**, which are task 8's steps 25,
      26, and 27: the forward sweep prints its hits for fourteen terms, the
      backward sweep prints its hits for eight, and each of the eight absence
      greps prints nothing and exits 1. A stop condition worded as a property
      of the whole tree — "no file spells the reading line twice", "the old
      Residency line is gone everywhere" — is backed by one of these
      whole-tree commands and never by a check on the batch's own files.
- [ ] **The diff is exactly the passages.**
      `git diff "$(git merge-base main HEAD)" -- <file>` for each of the
      thirteen files, read hunk by hunk against the tasks' blocks and matched
      **by text**: hunk order is file order, not task order, and `git diff`
      merges two changed regions separated by six or fewer unchanged lines, so
      no hunk count is an invariant here.
- [ ] **Reconstruct-and-compare**, the stronger alignment check design-4807
      names. For each file of the batch, take the merge-base copy
      (`git show "$(git merge-base main HEAD)":<file>`), replay the batch's
      old→new pairs onto it in task order — the pairs are the plan's own
      fenced blocks, and the dry run's application script, named in
      `.superpowers/sdd/context-cost/plan-dryrun.md`, is the replay when it
      is still on disk; otherwise a script of the same shape written from the
      blocks — and `diff --strip-trailing-cr` the result against the working
      tree: empty for every file. A difference is a byte the passages do not
      account for, and a Rulings-needed item.
- [ ] **Line endings.** `git ls-files --eol <file>` for each of the thirteen
      files shows the same value it showed before the edit and never
      `w/mixed`. Quote the shape, not the column spacing.
- [ ] **The whole-tree sweep.** `git status --short` prints nothing;
      `git status --porcelain | grep -c '\.bak'` prints `0`;
      `git diff --name-only "$(git merge-base main HEAD)"` names exactly the
      thirteen files plus the spec, this plan,
      `docs/issues/open/12d3-*.md` — from the commit "docs(issues): tanto keeps
      both untracked directories at a plan close" — and any path a
      `docs: T<n> shoroku` or `docs: exit shoroku` commit wrote. A path outside
      that set is a Rulings-needed item, not a revert.
- [ ] **One trailer per commit.**
      `git log --format=%H "$(git merge-base main HEAD)..HEAD" | while read -r h; do git show -s --format=%B "$h" | grep -c '^Co-Authored-By:'; done`
      — every line `1`. An aggregate count over the branch would let a commit
      carrying two trailers balance one carrying none, which is why this loops.
- [ ] **At the boundary, re-run the whole set of the batch's task-time checks**,
      not only the ones the boundary asked for. Each anchor block is read
      against the post-edit value its step states: the blocks whose needle the
      new passage wholly supersedes **invert** to `0`, and the blocks whose
      needle is the passage's unchanged opening still return `1` — measured on
      the dry run's applied copies, 2026-09-09, as `0` for thirty-one of the
      sixty-six anchor blocks and `1` for thirty-five (nineteen anchors that
      are a passage's opening, sixteen insertion anchors that stay); the
      Verify step beside each one pins the inversion with its joined needle.

Write-outs — T1, T2, and every exit shoroku — are outside this plan except for
`docs/notes/tanto-consistency-checks.md`, which task 8 owns. Their commits
begin `docs: T<n> shoroku` or `docs: exit shoroku`, and the whole-branch review
package excludes exactly those subjects.

## Reporting protocol

Batch prompts and reports follow the tanto templates —
`skills/tanto/templates/batch-prompt.md` and
`skills/tanto/templates/batch-report.md` — and this plan names nothing else
about their shape; a Kaiseki brief and report follow
`skills/tanto/templates/kaiseki-brief.md` and
`skills/tanto/templates/kaiseki-report.md` the same way.

## Self-Review

**1. Spec coverage.** Every section of
`docs/superpowers/specs/2026-09-09-context-cost-design.md` maps to a task or is
named here with the reason it has none:

| Spec section | Task |
| --- | --- |
| the opening paragraphs and Scope | no task: they name what the design closes and what it reads. The issue moves to `resolved/` at T2 are Kanri's and Jisso's under the adoption rule, not plan tasks |
| Fixed inputs | no task: its decisions are scope and shape. They reach the run through Global Constraints and the Batches section — rule 11 and batch B as the safe boundary, the models, the one-Jisso expectation, the parallel-run branch |
| The cost, measured | no task: the measured facts are the spec's evidence and go to a note or a report at T1 and T2. Two of them are used as this plan's baselines — the frame at `631`/`4` and the reading's shape |
| The transcript reading, with its table and the handshake line | 1 (P1.2, P1.3, P1.4), and the copies in 3 (P3.4, P3.5) and 4 (P4.1, P4.5) |
| Who reads, and where the reading goes | 1 (the placeholder and the `— <reading>` form), 3 (the two report slots), 4 (the three peers' lines), 6 (Kanri's own row and the residency lines) |
| The roster: a Residency table, and an archive | 2 (P2.1 to P2.6), with the handover's copy of the table header in 3 (P3.7) |
| The cold read reads the frame, and the frame command | 5 (P5.6) |
| `roles/sekkei.md`, Step 4 — one dry run, one report | 4 (P4.8, P4.9) |
| The trigger check takes the reading, and may verify a peer's | 6 (P6.2, P6.8) |
| A compaction in a peer | 7 (P7.1), with the Delete table's Sekkei row in 7 (P7.2) |
| What a compaction summary says the human said | 1 (P1.4's closing paragraph), 6 (P6.8's continuation), 3 (P3.6, the handover's `(unverified)`) |
| The residency lines to the human | 6 (P6.6, P6.7) |
| The plan close moves the record to the archive | 7 (P7.3) |
| A resumed session rejoins the run | 1 (P1.1, P1.2, P1.5), 2 (P2.1, P2.3), 4 (P4.1, P4.4, P4.10 — the self-check), 5 (P5.1 to P5.5) |
| The small items — b9a4, dc72, 3a33, 9a68 | 1 (P1.8, P1.12), 3 (P3.1, P3.2, P3.3), 4 (P4.3), 7 (P7.4, P7.5, P7.6, P7.7, P7.8, P7.9, P7.12) |
| Where each change lives | the File structure table above, row for row, including the quoting locations |
| Requirements | no task: req-04f5's bullets and the two ADR candidates are T1's under decision-1f5f, escalated by Kanri, not plan tasks |
| What the plan must contain | the eight tasks in two batches as the spec cuts them, the needle rule stated once in task 1, the per-task commit by explicit path with the trailer, the Reporting protocol section, and — Sekkei's to write — Global Constraints, Batches, and How a batch is verified |
| Verification | task 8 steps 24 to 30, one block per bullet, each with the spec's expectation and the measured baseline; the per-passage anchor, flattened, diff, line-ending, and lint checks inside tasks 1 to 8 |
| Open for the human at the review | the human answered `all OK` at the spec review. Point 1 (the archive's rows reach `docs/reports/` through the T2 direction) is P7.8's second sentence; point 2 (symmetry) is P7.1; point 3 (the confirmation interrupt) and point 4 (the two ADR candidates) are T1's under decision-1f5f; point 5 (issue-7d14) is P4.8 and P4.9 |
| Out of scope | no task, by construction: no threshold number and no automatic handover; no primary read of a peer's transcript; no script file under the skill and no tool beyond `wc`, `grep`, `awk`, and `echo`; no rename of Jisso's, Sekkei's, or Kaiseki's exit files; no move of the Models table; no change to rule 9; nothing about where the harness defines the compaction phrase; and no `docs/` write-out except the consistency note |
| Answers to the spec inputs, Deferred items, Shoroku candidates | no task: they are answered by the passages and the procedure above, and T1 and T2 write the candidates under `docs/`, which no task touches outside the note |

**2. Placeholder scan.** No `TBD`, no `TODO`, no "implement later", no "similar
to task N", no "add appropriate …", no "write tests for the above". Every edit
step carries its anchor, its old passage where the shape is a replacement, and
its new passage, in full and verbatim. Every verification step names the exact
command and the exact expected value — a number or a literal string — with the
measured baseline beside it; no step says "should work" or "verify it looks
right". The two authored sentences the spec described only in prose — the
`transcript=` sentence in `SKILL.md` (P1.3) and the `/tanto resume` sentence in
the Invocation section (P1.1) — are written out in the plan, in the contract's
voice, rather than left as a description. The three sections Global Constraints,
Batches, and How a batch is verified are Sekkei's own under
`skills/tanto/roles/sekkei.md` Step 3.

**3. Consistency across tasks.** Checked and reconciled:

- **File paths.** The thirteen paths of the File structure table are the same
  strings in every task's `Files:` block, in every `grep`, `diff`,
  `git ls-files --eol`, and `git diff` command, in every lint line, and in
  every commit command. No task names a fourteenth path.
- **Passage count.** Seventy-two: thirteen in task 1, six in task 2, seven in
  task 3, eleven in task 4, six in task 5, eight in task 6, twelve in task 7,
  and nine in task 8. Twenty-six of them are in `skills/tanto/roles/kanri.md`,
  spread over tasks 5, 6, and 7; the file's merge-base diff after task 7 is
  exactly that union.
- **Anchors and old passages.** Every anchor named in tasks 1 to 8 was run with
  `grep -cF -- "$needle"` against this working tree while the plan was written
  and returned `1`; each is recorded "measured 2026-09-09" at its step. Where a
  replacement's anchor **is** its old passage, the step says so and states the
  value the check returns after a correct edit — `0` when the new passage
  supersedes the whole needle, `1` when the needle is the passage's unchanged
  opening (nineteen of the anchors, found by the plan review on the dry run's
  applied copies) — the case the note warns reads as a failure when a
  boundary re-runs the batch's blocks mechanically.
- **Strings across tasks.** The reading line is spelled once, in `SKILL.md`'s
  `echo`; every other file carries `<reading>` and, where it is appended,
  `— <reading>`. The Residency table header is byte-identical in
  `templates/roster.md` (task 2) and `templates/kanri-handover.md` (task 3),
  and the note's check 6 (task 8) pins the same string against both.
  `superseded: <topic> R-n` and `exit:kanri-<YYYY-MM-DD>-<name>` each appear
  once in `templates/kanri.md` (task 3) and once in `roles/kanri.md` (task 7).
  `` `SKILL.md`'s Resuming `` is the one spelling of the self-check pointer, in
  all four role files (tasks 4 and 6). No task uses `Residency line` in new
  text; task 6 removes the four in `roles/kanri.md`, and the sweep in task 8
  decides it at repository scope.
- **Counts that move between tasks are stated where they move.** `transcript=`
  in `SKILL.md` is `1` after P1.2, `2` after P1.3, and `3` after P1.5; the
  steps say so. `— <reading>` in `roles/kanri.md` is `1` after task 5, `3`
  after task 6, and `6` after task 7. `Residency row` in `roles/kanri.md` is
  `6` after task 6 (the dry run's count). `roster-archive` in `SKILL.md` is `1`
  after P1.9 and `2` after P1.13. Each of those is a **task-time** check, not
  an invariant; only the boundary's whole-tree values are treated as final.
- **Line endings.** The procedure is the rule and the listed values are dated
  evidence. Each task's first step runs
  `git ls-files --eol` on its files and states the value it must read — `w/crlf`
  for `SKILL.md`, `README.md`, the four role files, `templates/batch-report.md`,
  `templates/kaiseki-report.md`, and the note; `w/lf` for `templates/roster.md`,
  `templates/kanri.md`, and `templates/kanri-handover.md` — and each task's
  later step expects the same value again, never `w/mixed`. Task 2 creates one
  file and writes it LF, and it runs `git add` before `git ls-files --eol` can
  report it and before `git commit --only` can name it.
- **The diff form.** Every diff command is
  `git diff "$(git merge-base main HEAD)" -- <path>`, which sees the working
  tree and so is right both before and after a task's commit; no command uses
  `main...HEAD`. No hunk count is stated anywhere, because a count is
  meaningless without the context width that produced it; every diff step tells
  the reader to match hunks to passages by text.
- **The trailer string.** Every commit command ends with
  `-m "Co-Authored-By: Claude <noreply@anthropic.com>"`, every per-task check
  greps the prefix `Co-Authored-By: Claude`, and task 8 step 30 loops over the
  branch's commits and requires `1` from each.
- **Linted versus ignored.** The six template paths are markdownlint-ignored
  under `skills/**/templates/**`, so their wide tables and `<...>` blanks are
  correct there and the note's check 9 — which names the skill's non-template
  Markdown — is where markdownlint runs. `SKILL.md`, the four role files,
  `skills/tanto/README.md`, and the note are checked; the long lines this plan
  transcribes into `SKILL.md` (148, 92, and 81 characters) are safe because
  MD013 does not bind in this repository's configuration, which the file's own
  216-character frontmatter line already demonstrates.
- **The instruments are extracted, not retyped.** The frame command (task 5
  step 20), check 6 (task 8 step 23), and the reading pipeline (task 8 step 29)
  are each pulled out of the file that carries them and then run, so that a
  transcription error cannot pass by producing the right answer from a
  different program. Task 8's dispatch tells the reviewer to re-run the sweeps
  rather than read them.
- **Task order.** Tasks 1 to 4 are batch A and 5 to 8 batch B; tasks 5, 6, and
  7 edit `roles/kanri.md` in that order and each names anchors the others do
  not touch; task 8 runs last, and it is the only task that edits the note
  whose checks the boundary runs — a plan that edits the note governing its own
  verification licenses its own omission at the batch A boundary, which is why
  batch A's stop conditions name checks 1 and 2 as knowingly broken there and
  batch B's name them repaired.
