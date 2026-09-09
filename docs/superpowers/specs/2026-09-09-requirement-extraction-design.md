# Design: requirement extraction in the docs system — a stated need is a requirement even when unmet, and design names the requirement it serves

This is the first design for the docs system that `kisou` installs and
`shoroku` follows, and the third plan the resident Kanri conducts. It closes
one issue, issue-ad1a: an unmet need the human states is classified as an
issue and the requirement in it is lost, because `docs/AGENTS.md` classifies
each fragment as exactly one type and `docs/issues/AGENTS.md` defines an issue
as "something wrong or missing". The design adds one section and one bullet
to kisou's requirements template, one paragraph to its issues template, one
bullet to its design template, two rewritten steps in its `docs/AGENTS.md`
template, one sentence in `shoroku`'s `SKILL.md`, a drift check on the two
skills' READMEs, and a run of kisou's own refresh path to bring this
repository's four installed copies up to date. `tanto` gets no rule from
this: its one hook, the review brief's requirement section, landed in the
review-brief design of 2026-09-08. This document restates what it needs from
the earlier material, so that Kanri and Jisso can read it cold.

The inputs are `.superpowers/sdd/requirement-extraction/spec-inputs.md`
(I-1 with Kanri's five notes), issue-ad1a, req-1a2b, req-3c4d,
decision-1f5f, decision-ace0, decision-9f4b, decision-281f, the review-brief
design of 2026-09-08 ("What goes to kisou and shoroku"), the D-2 entry of
`.superpowers/sdd/review-brief/dialogue.md`, the dialogue record
`.superpowers/sdd/requirement-extraction/dialogue.md` (D-1 to D-4), and the
spec review `.superpowers/sdd/requirement-extraction/spec-review.md` with
Sekkei's rulings beside it. The human decided the forks in the two dialogues,
on 2026-09-08 and 2026-09-09; those decisions are fixed inputs below. Every
`I-n` and every note is answered in "Answers to the spec inputs".

## Fixed inputs

Decided before or during the dialogue, not reopened here. Each names the
requirement it serves.

- **Scope (Kanri's R-1).** issue-ad1a alone, for kisou's templates and
  shoroku. Not in scope: any `tanto` file; issues e5a2, b7d3, f2c4, 9d17.
  Serves req-1a2b (kisou owns the bundled docs system) and req-3c4d (shoroku
  follows the committed `docs/AGENTS.md`).
- **Parallel run, then a branch (R-2).** The dialogue and the drafts run
  while review-brief is in flight, as untracked files in the topic directory;
  the branch `requirement-extraction` is cut from `main` after review-brief
  merges, and this spec is committed on it while no batch is in flight.
  Serves req-04f5's checkpoint discipline; adds nothing to it.
- **The rule, the two tests, the gate, the pairing (review-brief D-2,
  2026-09-08).** A need the human states is a requirement fragment even when
  unmet; the gap it leaves is a separate issue fragment; one statement
  yielding two entries is not duplication. Two tests: the need survives a
  change of design; its reason is the human's own situation — time, trust,
  language, authority — not the system's coherence. The gate against
  over-extraction is the existing granularity rule applied to classification,
  and the human's confirmation. The requirement-to-design pairing is checked
  at the bullet level. Serves req-3c4d (classify each fragment as exactly one
  of the four types; the human's `Direction?` is the gate) — and is the
  candidate that changes it, see "Requirements".
- **The pairing is a docs-system rule, not a kisou feature (D-1).** `kisou`
  has no consistency-check mechanism today: its refresh compares a file's
  section structure against the template and never reads `docs/` content. The
  pairing check therefore lives in the template text, in `docs/AGENTS.md`'s
  Propose step and the type files' Body rules, and every classifier runs it at
  shoroku time; kisou the skill installs the text and gains no content-reading
  feature. Chosen over a `kisou migrate` scan of `docs/` (a new feature outside
  req-1a2b's scaffold-and-migrate scope, and the wrong moment — the loss
  happens at classification, where shoroku stands, not kisou) and over both.
  Serves req-1a2b (kisou's scope stays scaffold and migrate).
- **No translation rule in the docs system (D-2).** Whether shoroku's
  `Direction?` proposal should carry a requirement's or ADR's original
  wording followed by a reference translation, as tanto's escalation will
  (req-04f5, filed at review-brief's batch A boundary): no. shoroku already
  presents its proposal in the chat's language; the human sees no problem
  there today, and will raise a new request if this design's changes alter
  that behavior. The human confirmed that the tanto-side item stays, because
  Kanri has escalated wording in the original language. Serves req-3c4d as it
  stands.
- **This repository's copies are refreshed by kisou (D-3).** A plan task runs
  `kisou migrate` in docs-only scope on this repository and accepts the
  refresh items — the first dogfood of the refresh path decision-281f
  describes — with the expanded-template diff as the verification. A refresh
  that misses or mangles a section falls back to hand-mirroring the passage,
  and the miss is a finding against kisou. Chosen over hand-mirroring alone
  (the refresh path would stay unverified) and over templates-only (this
  repository's own shoroku would run on the old rule). Serves req-1a2b
  (re-running migrate refreshes toward the current template).
- **The three design sections as put (D-4).** The rule and the two tests sit
  in `docs/requirements/AGENTS.md` with a pointer from `docs/AGENTS.md`'s
  Classify step and a counterpart paragraph in `docs/issues/AGENTS.md`; the
  pairing sits in `docs/design/AGENTS.md`'s Body, `docs/requirements/AGENTS.md`'s
  Body, and `docs/AGENTS.md`'s Propose step; shoroku gets one mirroring
  sentence; one batch of four tasks. Serves req-1a2b and req-3c4d. One
  point of section 2 moved after the spec review (finding 2): the flag on a
  requirement bullet no design serves is a question — unmet, or met but not
  described — not an issue offered outright; the human sees this in the
  review brief.

## The mechanism that loses a requirement

`docs/AGENTS.md`'s shoroku step says "Classify each fragment as exactly one of
requirement / design / decision / issue (see 'design vs decisions' in the type
files for the design/decision split)". `docs/issues/AGENTS.md` opens with "An
`issues` file records a known problem or deferred decision: something is wrong
or missing, but is not being fixed right now." `docs/requirements/AGENTS.md`
says a requirements file captures "what the project must do for its users, and
why", and says nothing about a need the project does not meet yet.

A classifier reading those three passages meets an unmet need, matches
"missing", files an issue, and moves on; the "exactly one" instruction tells
it that it is done. The requirement — the part that would survive the fix —
is never written. This happened to issue-a1c9's opening statement (reading the
full translation of every spec and plan is too much; a third party should
list only the judgment points), a need about the human's own situation that
was filed as an issue and reached req-04f5 only at review-brief's T1. It
happens by the same rules when Kanri files an issue at the tanto intake.

`docs/design/AGENTS.md` has the model for the fix: its "design vs decisions"
section says a significant choice often updates design **and** adds an ADR,
and that this is not duplication. There is no "requirements vs issues"
counterpart. This design adds it, adds the exit from the issue definition
that classifiers read first, and makes the classify step point to both
splits.

## The rule and the two tests

The passages below are the plan's content, byte for byte. They go into
kisou's templates under `skills/kisou/templates/docs/`, which use `{{docs}}`,
`{{requirements}}`, `{{design}}`, `{{decisions}}`, and `{{issues}}` for the
directory names; this repository's installed copies receive the same text with
the variables expanded (`docs`, `requirements`, and so on), through the
refresh run below. No heading of a fixed section is renamed anywhere — kisou's
refresh identifies sections by heading — and no section is removed. Each
passage's shape (a replacement of an old passage, or an insertion next to an
anchor that stays) is in "Where each change lives".

### `skills/kisou/templates/docs/requirements/AGENTS.md`

A new section between `## Body` and `## Growth`, modeled on the design
template's "design vs decisions" in tone and length:

```markdown
## requirements vs issues

- `{{requirements}}/` = what the user needs and why — whether or not the
  system meets it yet (living).
- `{{issues}}/` = what is wrong or missing and is not being fixed now.
- A need the user states is a requirement fragment **even when it is unmet**.
  The gap it leaves is a separate issue fragment. One statement yielding two
  entries is not duplication: the requirement outlives the fix, the issue
  closes with it. Filing the issue alone loses the requirement.
- Two tests for "this is a requirement": the need survives a change of design
  — it would still hold if the system were built another way; and its reason
  is the user's own situation — time, trust, language, authority — not the
  system's coherence. A statement that passes neither is design or an issue.
- The granularity rule above applies to classification too: a small need folds
  into an existing topic file as one bullet under a `## Section`, or is
  design; a new file only for a new topic. Never one file per sentence.
- The user's confirmation is the gate. A requirement candidate is proposed
  and accepted at `Direction?`; it is never written on the classifier's own
  judgment.
```

"The granularity rule above" is the `## File` bullet that already reads
"Granularity: **coarse — one file per topic/area** … Do not create one file
per atomic sentence." The template says "the user" throughout for the person
the docs serve; this design keeps that word.

### `skills/kisou/templates/docs/issues/AGENTS.md`

One paragraph after the opening paragraph ("An `issues` file records …
not a frontmatter field.") and before `## Lifecycle (by directory)`:

```markdown
When the missing thing is a need the user stated, the need itself is a
requirement fragment and the issue records only the gap — see
"requirements vs issues" in `{{docs}}/{{requirements}}/AGENTS.md`. An issue
filed alone loses the requirement.
```

This is the exit placed where classifiers read first: the issue definition is
the passage that matched "missing".

### `skills/kisou/templates/docs/AGENTS.md`, the Classify step

Step 2 of "Session shoroku (excerpting)" is replaced in full. Today:

```markdown
2. **Classify** each fragment as exactly one of requirement / design /
   decision / issue (see "design vs decisions" in the type files for the
   design/decision split).
```

After:

```markdown
2. **Classify** each fragment as exactly one of requirement / design /
   decision / issue. The type files define the two splits that are easy to
   get wrong: "design vs decisions" in `{{docs}}/{{design}}/AGENTS.md`, and
   "requirements vs issues" in `{{docs}}/{{requirements}}/AGENTS.md` — a need
   the user states that the system does not meet yet is **two** fragments, a
   requirement and an issue, not one issue.
```

"Exactly one" stays: the unmet need is two fragments, each of exactly one
type. That is the wording that reconciles the rule with the existing
principle, and the plan keeps it.

## The pairing

The human's ideal, stated in the review-brief dialogue: the requirements and
the design correspond, and a requirement is the higher concept a design
serves. At file level this already holds where it was done by hand (req-04f5
and design-4807 cite each other). This design makes it a bullet-level rule
with three passages, and gives the shoroku proposal the check that surfaces a
break in it. Both flags are questions, not conclusions: a design section that
names no requirement may hide an unspoken need, or may be internal shape; a
requirement bullet no design names may be unmet — a gap, an issue by the rule
above — or met by something whose design entry was never written. The
proposal asks which; the user answers at `Direction?`.

The check runs over the entries the proposal carries, never over the standing
tree. At the moment the rule lands no existing design section names a
requirement, and a whole-tree sweep would flag every section of every design
entry and offer an issue for every requirement bullet — the mirror image of
the over-extraction the granularity gate exists to prevent. A backfill is its
own shoroku run, item by item.

### `skills/kisou/templates/docs/design/AGENTS.md`, the Body

One bullet appended to `## Body`, after "Link to a recorded choice with
`decision-<id>` where relevant.":

```markdown
- Name the requirement each `## Section` serves with `req-<id>`. A section
  that serves none says so ("serves no requirement; internal shape"), so a
  shoroku proposal can ask whether an unstated need stands behind it.
```

The explicit "serves none" is what makes the flag below work: a silent
omission and a considered "none" would otherwise look the same.

### `skills/kisou/templates/docs/requirements/AGENTS.md`, the Body

One bullet appended to `## Body`, after "State the wish and the why …":

```markdown
- A `## Section` or a bullet may name the `design-<id>` that serves it. One
  that no design names is either unmet — see "requirements vs issues" — or
  met but not yet described.
```

Optional on this side, because requirements come first and a design arrives
later; the obligation sits on the design side.

### `skills/kisou/templates/docs/AGENTS.md`, the Propose step

Step 3 of "Session shoroku (excerpting)" is replaced in full. Today:

```markdown
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. End with `Direction?` and wait.
```

After:

```markdown
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. Each `{{design}}/` entry in the
   list names the `req-<id>` it serves, or says it serves none. Of the entries
   in the list, flag the unpaired: a design section that serves no requirement
   (ask whether an unstated need stands behind it), and a requirement bullet
   no design serves (ask whether the need is unmet — an issue — or met but not
   described — a `{{design}}/` entry). The standing tree is not swept; a
   backfill is its own run. End with `Direction?` and wait.
```

The two flags are the two entry points for extraction that the old text
lacked: a design with no requirement behind it is where a need went unspoken;
a requirement with no design is where a need went unmet or a design went
unwritten.

## shoroku

`skills/shoroku/SKILL.md` is a thin shell and forbids itself to restate the
format rules. It gets one sentence as a new paragraph in Step 3, inserted
after the paragraph that ends "→ report files changed + commit hash." and
before the paragraph that begins "Parse direction flexibly:":

```markdown
Classification follows the two splits the type files define — design vs
decisions, requirements vs issues — and the proposal carries the requirement
pairing `docs/AGENTS.md`'s Propose step defines; neither is restated here.
```

The sentence names what the other side names — the two splits are the type
files' section titles, and "the Propose step" is where the pairing is defined
— so that neither file carries a term the other lacks; issue-2c4d records why
that matters between these two skills. Nothing else in the skill changes: the
trigger, the three source modes, the direction parsing, the prohibitions. The
skill's `description` frontmatter is not touched (a colon followed by a space
in it breaks the frontmatter parse; there is no reason to go near it).

`skills/shoroku/README.md` describes the flow as "classify → numbered proposal
→ you partially accept"; `skills/kisou/README.md` describes the refresh path.
Neither describes the passages this design changes, so neither is expected to
drift; the plan's task checks both against the edited `SKILL.md` and
templates, per `AGENTS.md`'s rule, and edits only if a sentence now misstates
one of the changed passages. The check covers those passages only: a
pre-existing omission — the shoroku README's "What it does" bullet names two
of the three source modes, file mode appearing only under Usage — is a shoroku
candidate for the batch report, not a task edit.

## This repository's copies: the refresh run

This repository's `docs/AGENTS.md`, `docs/requirements/AGENTS.md`,
`docs/issues/AGENTS.md`, and `docs/design/AGENTS.md` are kisou-installed
copies. Measured on 2026-09-09: each equals its template with the seven
`{{…}}` variables expanded, byte for byte apart from that. After the template
edits they diverge in exactly the passages above. This is the case kisou's
migrate mode describes as **kisou-managed → refresh toward the current
template**: "a **missing** fixed section / block → add it, template-filled; a
**diverged fixed-text section** … → show the diff and propose replacing the
stale body". The run is the first dogfood of that path (decision-281f), and
kisou's own text is not of one mind about it, so the task carries the reading
it relies on and the fallbacks. Four points of kisou's text bear on the run:

- **Whether a present doc-system is refreshed at all.** kisou's detection says
  of a `full` doc-system (this repository's case: the root `AGENTS.md` and all
  four per-type files present) "leave intact; treat the migrate scope as
  **layer-B only** unless the user asks otherwise. It is still a refresh target
  (see the Present branch below)", and its per-artifact list ends "**`docs/`
  doc-system** → write the bundle if absent; if already present, leave it
  intact and add only around it." The task follows the parenthetical — "still
  a refresh target" — together with the explicit **docs-only** scope pick,
  which is the user asking otherwise. The contradiction is a finding for the
  batch report whatever the run does.
- **Which sections count as fixed-text.** The refresh replaces "a diverged
  fixed-text section — one whose template body has **no `<...>` free-text**",
  and never flags "a free-text section (template body carrying `<...>` for
  the author to fill)". Read literally, `<id>` in "`decision-<id>`" makes the
  design template's `## Body` free-text today, and the new `req-<id>` and
  `design-<id>` would make the requirements `## Body` and the docs template's
  "Session shoroku (excerpting)" free-text too — three of the four expected
  items would never be offered. Read as intended, `<...>` means an author-fill
  placeholder such as `<topic title>`, not the `<id>` / `<slug>` / `<status>`
  notation the docs rules are written in; decision-281f's own example names
  "the `docs/AGENTS.md` document-management rules", which are saturated with
  that notation, as fixed-text. The task relies on the intended reading. A
  refresh that skips a section because its body carries `<id>` is a finding
  against kisou.
- **What a per-type `AGENTS.md`'s fingerprint is.** kisou lists fingerprints
  for `CLAUDE.md`, `AGENTS.md`, `{docs,Documents}/AGENTS.md` (the root), and
  "any layer-B file whose heading set substantially matches the template". A
  per-type `docs/<type>/AGENTS.md` matches none by name. If the run classifies
  one as not kisou-managed, kisou's branch is to rename the original to
  `<file>.bak` and write a fresh template-filled file; the implementer
  **rejects** that offer for each of the four files and hand-mirrors instead.
  No `.bak` file is left in the tree. The missing fingerprint is an issue
  candidate against kisou.
- **Where an added section lands.** kisou says "add it, template-filled" and
  nothing about position. `## requirements vs issues` must sit between
  `## Body` and `## Growth`; an append after `## Growth` passes the heading
  grep and fails only the expanded-template diff, which is why the diff, not
  the grep, decides the run.

The plan's refresh task:

- The task's implementer runs the `kisou` skill in **migrate** mode with
  **docs-only** scope on this repository, following `skills/kisou/SKILL.md`
  Step 3 (migrate). It stands in for the user at kisou's prompts under the
  batch prompt's authority: it confirms the detected values; **declines** the
  scripts-intent prompt (kisou asks once about the script slots the repository
  lacks — `setup`, `run`, `build`, `test`, `tidy` here, since `scripts/` holds
  `bootstrap` and `lint` — and every one is a decline); accepts every refresh
  item that touches the four files above; rejects any `.bak`-and-rewrite offer
  (previous bullet) and any other offer — a `notes/` or `reports/` create is
  not expected, since `docs/notes/AGENTS.md`, `docs/reports/AGENTS.md`, and
  `docs/decisions/AGENTS.md` are present and unchanged, and layer-B files are
  outside docs-only scope. It makes no commit of its own: kisou's flow ends in
  one commit, and under tanto Jisso commits at the task boundary by explicit
  path, so the implementer stops before kisou's commit step and leaves the tree
  for the batch report to describe.
- The confirmation kisou's flow asks of the user — "show diffs and ask before
  modifying existing files" (req-1a2b) — is given for these four files at the
  plan's OK: every passage they receive is verbatim in this spec and in the
  plan, the human's answers to the review brief are the confirmation
  (decision-ace0, amending decision-1f5f), and the diff reaches the human
  through the batch report. The stand-in is a one-run plan instruction; it
  changes neither kisou nor tanto, so req-04f5's "composes without modifying"
  holds by construction.
- It records kisou's numbered proposal **verbatim** in its report, so the
  human can see what the refresh path offered — this is the dogfood's
  measurement — and records, for each of the four points above, what kisou did.
- Expected refresh items, under the intended reading: `docs/AGENTS.md` — the
  "Session shoroku (excerpting)" section body diverged, replace;
  `docs/requirements/AGENTS.md` — the section `## requirements vs issues`
  missing, add, and the `## Body` body diverged, replace;
  `docs/design/AGENTS.md` — the `## Body` body diverged, replace;
  `docs/issues/AGENTS.md` — the paragraph before the first `##` heading
  diverged. The open points of the measurement are three: whether the refresh
  sees the issues preamble (kisou speaks of a "fixed section / block", and a
  preamble is a block but not a section); whether it offers the three sections
  whose bodies carry `<id>`; and where it puts the added section.
- If, after accepting, the expanded-template diff below is not empty for a
  file, the implementer applies the missing passage by hand from this spec,
  re-runs the diff, and the report names the passage the refresh missed or
  mangled. That is a finding against `kisou` for the batch report's findings
  list; Kanri carries it to T2 as an issue candidate.

The verification is one command, run on this machine on 2026-09-09 against the
unedited tree with the result `identical` for all four files:

```bash
for t in docs requirements issues design; do
  f=$([ $t = docs ] && echo docs/AGENTS.md || echo docs/$t/AGENTS.md)
  printf '%s: ' "$f"
  sed -e 's/{{docs}}/docs/g' -e 's/{{requirements}}/requirements/g' \
      -e 's/{{design}}/design/g' -e 's/{{decisions}}/decisions/g' \
      -e 's/{{issues}}/issues/g' -e 's/{{notes}}/notes/g' \
      -e 's/{{reports}}/reports/g' "skills/kisou/templates/$f" \
    | diff --strip-trailing-cr -q - "$f" >/dev/null && echo identical || echo DIFFERS
done
```

`--strip-trailing-cr` is load-bearing: the files are CRLF in the working tree
(`.gitattributes` has `* text=auto`, `core.autocrlf` is `true`), and Git
Bash's `sed` emits LF, so without it the diff reports every line. Measured
2026-09-09; `grep` strips CR on input the same way, so the anchored greps
below need nothing.

## Where each change lives

Every passage is quoted verbatim above; the table gives each its shape and
anchor, in the passage-plan convention of design-4807.

| File | Passage | Shape | Anchor | Task |
| --- | --- | --- | --- | --- |
| `skills/kisou/templates/docs/requirements/AGENTS.md` | `## requirements vs issues` section | insertion | between `## Body` and `## Growth` | 1 |
| `skills/kisou/templates/docs/requirements/AGENTS.md` | `## Body` bullet "A `## Section` or a bullet may name …" | insertion | after the bullet "State the wish and the why …" | 1 |
| `skills/kisou/templates/docs/issues/AGENTS.md` | "When the missing thing is a need …" paragraph | insertion | after the opening paragraph, before `## Lifecycle (by directory)` | 1 |
| `skills/kisou/templates/docs/AGENTS.md` | step 2 of "Session shoroku (excerpting)" | replacement | the whole step 2 item | 1 |
| `skills/kisou/templates/docs/AGENTS.md` | step 3 of "Session shoroku (excerpting)" | replacement | the whole step 3 item | 1 |
| `skills/kisou/templates/docs/design/AGENTS.md` | `## Body` bullet "Name the requirement each `## Section` serves …" | insertion | after the bullet "Link to a recorded choice with `decision-<id>` where relevant." | 1 |
| `skills/shoroku/SKILL.md` | "Classification follows the two splits …" paragraph | insertion | Step 3, after the paragraph ending "commit hash.", before "Parse direction flexibly:" | 2 |
| `skills/shoroku/README.md`, `skills/kisou/README.md` | drift check | no change expected | the changed passages only | 2 |
| `docs/AGENTS.md`, `docs/requirements/AGENTS.md`, `docs/issues/AGENTS.md`, `docs/design/AGENTS.md` | the same passages, variables expanded | refresh through `kisou migrate` docs-only; hand-mirrored where the refresh misses | the same anchors | 3 |

Nothing under `skills/tanto/`; nothing under `docs/` outside the four
installed copies — `docs/requirements/3c4d-shoroku.md`, `docs/design/e3f4-shoroku.md`,
and `docs/design/c1d2-kisou.md` are T1's and T2's to update, not the plan's.

## Requirements

This design serves req-1a2b and req-3c4d and adds to one of them. By the rule
it introduces, the design says so here rather than leaving T1 to find it.

- **req-1a2b (kisou)** is served as it stands: kisou owns the bundled template
  including the docs system (decision-9f4b), and re-running migrate refreshes a
  kisou-managed file toward the current template (decision-281f). The refresh
  run is that requirement exercised, not changed.
- **req-3c4d (shoroku)** is served by "classify fragments as exactly one of the
  four managed types" and "present a single numbered proposal … end with
  `Direction?`". Two behaviors this design requires are not in it: a need the
  user states and the system does not meet is proposed as a requirement
  fragment and an issue fragment; and the proposal names, per design entry,
  the requirement it serves and asks about a design section that serves none
  and a requirement bullet no design serves. That is one requirement
  candidate, two bullets under req-3c4d's Required behavior, for T1 — and, by
  decision-1f5f's adoption rule, for the human.
- **issue-2c4d (cross-skill bundle coordination)** is the standing record that
  `docs/AGENTS.md`'s "Session shoroku (excerpting)" section describes shoroku's
  behavior but is authored in kisou's bundle, with no automated drift check
  (decision-9f4b's consequences). This design edits that section and shoroku's
  `SKILL.md` in one plan and adds a name-level dependency between them; task
  4's sweep across templates, copies, and `SKILL.md` is the manual drift check
  the change relies on. The issue stays open; T2 may add this instance to it.
- **No ADR.** D-1's choice — a docs-system rule over a kisou feature — is a
  scope reading of req-1a2b rather than a new architectural choice; the reason
  is recorded in Fixed inputs and belongs in design-c1d2's and design-e3f4's
  T2 update. Kanri may rule otherwise at T1.

## What the plan must contain

One batch, A, of four tasks, on the branch `requirement-extraction`:

1. The four kisou templates: the six passages of "The rule and the two tests"
   and "The pairing", verbatim, at the anchors of "Where each change lives".
   The templates are exempt from markdownlint (`.markdownlint-cli2.yaml`
   ignores `skills/**/templates/**`), so the task lints the passages the way
   `docs/notes/tanto-consistency-checks.md` item 5 prescribes: apply them to
   scratch copies placed at the installed copies' relative paths under a
   scratch tree, and run the pre-commit cache's `markdownlint-cli2` there with
   the repository configuration; then run the content greps of Verification
   on the four template files.
2. shoroku's paragraph, the frontmatter parse, and the two README drift
   checks on the changed passages only.
3. The refresh run of "This repository's copies", with the expanded-template
   diff, the verbatim proposal, and the four points' outcomes in the report.
4. The whole-tree sweep: `./scripts/lint.sh` on every changed path (here
   markdownlint binds, on the installed copies), every content grep and the
   absence grep of Verification run once more across templates **and**
   installed copies, the expanded-template diff, and the check that no file
   under `skills/tanto/` changed.

Task 3 depends on task 1's template edits; the tasks run in order. Batch A is
the final batch; its boundary is where T2 runs. The plan's Global Constraints
carry the repository's `AGENTS.md` rules (commit by explicit path, lint on the
changed paths, the trailer, no edit to agent instruction files or repo-root
Markdown — the installed copies under `docs/` are not repo-root Markdown and
not agent instruction files in that rule's sense: they are the docs system's
own files, which the refresh run edits by design; the plan says so), the model
families from `tanto.json` (implementer `sonnet`, reviewer and escalation
`opus`), the no-worktree directive, and the refresh task's standing-in rule
for kisou's prompts with its declines and rejections. Rule 11 does not apply:
no file the sessions run on is edited, so a role may be started or replaced at
any boundary, and the plan says so in Global Constraints and in the Batches
section. Reports and prompts follow the tanto templates; the plan names
nothing else about them.

## Verification

At the batch boundary, every command below is run on the whole tree and
compared with the stated expectation; each except the lint was run once on
this machine on 2026-09-09 against the unedited tree, with the baseline result
noted.

- **Lint.** `./scripts/lint.sh <changed paths>` — exit 0. markdownlint binds
  on `docs/**` and `skills/shoroku/SKILL.md`, not on the templates (exempt by
  configuration; task 1's scratch lint covers them).
- **The new section, template and copy.**
  `grep -c '^## requirements vs issues$' skills/kisou/templates/docs/requirements/AGENTS.md docs/requirements/AGENTS.md`
  — `1` for each. Baseline `0`, `0`.
- **The classify pointer.**
  `grep -c 'requirements vs issues' skills/kisou/templates/docs/AGENTS.md docs/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md docs/issues/AGENTS.md`
  — at least `1` for each of the four. Baseline `0` for all.
- **The old pointer is gone.**
  `grep -rn --exclude-dir=superpowers 'in the type files for the' skills docs`
  — prints nothing. Baseline: two hits, the template and the copy, each at
  line 103 (the old sentence wraps after "for the", so the pattern stops
  there). `docs/superpowers/` is excluded because this spec and the plan quote
  the old passage.
- **The pairing bullets.**
  `grep -c 'serves no requirement; internal shape' skills/kisou/templates/docs/design/AGENTS.md docs/design/AGENTS.md`
  — `1` each;
  `grep -c 'serves no requirement' skills/kisou/templates/docs/AGENTS.md docs/AGENTS.md`
  — `1` each (the Propose step); and
  `grep -c 'may name the' skills/kisou/templates/docs/requirements/AGENTS.md docs/requirements/AGENTS.md`
  — `1` each (the requirements Body bullet). Baseline `0` for all.
- **The standing tree is not swept.**
  `grep -c 'The standing tree is not swept' skills/kisou/templates/docs/AGENTS.md docs/AGENTS.md`
  — `1` each. Baseline `0`.
- **shoroku's paragraph.**
  `grep -c 'requirements vs issues' skills/shoroku/SKILL.md` — `1`. Baseline
  `0`. And the frontmatter still parses:
  `uv run --no-project --with pyyaml python -c "import yaml,io; t=io.open('skills/shoroku/SKILL.md',encoding='utf-8').read().split('---')[1]; print(yaml.safe_load(t)['name'])"`
  — prints `shoroku`. Baseline: prints `shoroku`.
- **Headings unchanged.** For each of the four template files, `grep '^#' <file>`
  compared against `git show main:<file> | grep '^#'` differs only by the one
  added `## requirements vs issues` line in the requirements template.
  Baseline: no difference for any of the four.
- **The expanded-template diff**, as in "The refresh run" — `identical` for
  all four. Baseline `identical` for all four.
- **No tanto file changed.**
  `git diff --name-only "$(git merge-base main HEAD)" -- skills/tanto` — empty.
  The merge-base form sees uncommitted edits, which the three-dot form does not
  (`docs/notes/tanto-consistency-checks.md` item 1). Baseline: empty on the
  `requirement-extraction` branch, which is cut from `main` after review-brief
  merges; on `review-brief`, where this spec was drafted, the same command
  lists the tanto files that plan edited, so the check means something only on
  the plan's own branch.
- **Exactly one stays.**
  `grep -c 'exactly one of requirement / design' skills/kisou/templates/docs/AGENTS.md docs/AGENTS.md`
  — `1` each. Baseline `1` each.
- **No `.bak` left.** `git status --porcelain -- docs | grep -c '\.bak'` — `0`.
  Baseline `0`.

## Out of scope

- Any `tanto` file, including the intake procedure by which Kanri files an
  issue from a bug report; Kanri follows `docs/AGENTS.md` and inherits the
  rule from there.
- A translation rule for shoroku's proposal (D-2) — stays a tanto item under
  req-04f5.
- A `kisou`-side scan of `docs/` content for unpaired bullets (D-1) — not a
  kisou feature.
- Updating existing design entries so that each section names its `req-<id>`.
  The rule applies to new and edited entries from here; the backfill is a
  shoroku run's work, item by item under `Direction?`, not a plan task, and
  the Propose step says the standing tree is not swept.
- Fixing kisou's own text where the refresh run finds it ambiguous or
  self-contradictory (the four points of "The refresh run"); those are
  findings for the batch report and issue candidates at T2.
- Issues e5a2, b7d3, f2c4, 9d17, 2c4d, and the rest of the open list.

## Answers to the spec inputs

- **I-1 (the scope, issue-ad1a).** Answered by the whole design: the rule and
  the two tests in the requirements template with the issues template's exit
  and the Classify pointer; the granularity gate and the human's confirmation
  inside the new section; the pairing in the design and requirements Body
  rules and the Propose step; shoroku's one paragraph. One wording of the
  issue is superseded openly: "as a `kisou` consistency check" became a
  docs-system rule (D-1), which T2 notes when it resolves the issue.
- **Kanri's note 1 (two skills, one repository; refresh through kisou).**
  D-3: the plan refreshes the installed copies through `kisou migrate`
  docs-only, with the expanded-template diff as verification and hand-mirroring
  as the fallback; no template heading is renamed. The spec says which files
  of each skill, with shape and anchor, in "Where each change lives".
- **Note 2 (rule 11 does not apply).** Confirmed; the plan states the
  replacement boundary as any boundary. The plan is a passage plan: every
  passage is quoted verbatim here and typed in the table.
- **Note 3 (the reference translation).** D-2: no, not in the docs system; the
  tanto item stands.
- **Note 4 (the kisou-side gate on scope).** Kept: the passages say "the
  user", "shoroku proposal", and `Direction?` — the docs system's own words —
  and nothing about tanto or a shoroku run's mechanics.
- **Note 5 (no T0).** Confirmed; the D-2 decisions are Fixed inputs above,
  cited from the review-brief dialogue.

## Deferred items

1. **Backfilling `req-<id>` into existing design sections** (design-4807,
   design-c1d2, design-e3f4, design-a5b6, design-dc5d) — a shoroku run's
   work after this plan lands; the first such run also measures how many
   sections say "serves no requirement".
2. **The refresh run's three open points** — the issues preamble, the
   sections whose bodies carry `<id>`, the added section's position — measured
   by task 3; each becomes an issue against kisou only if the refresh gets it
   wrong. The two contradictions in kisou's text (a present doc-system
   refreshed or left intact; no fingerprint for a per-type `AGENTS.md`) are
   issue candidates whatever the run does.

## Shoroku candidates from this spec work

For Kanri's ledger; T1 rules on them. The spec review's own nine candidates
go to Kanri with the report and are not repeated here.

1. issue-ad1a is claimed by this plan and resolves at T2.
2. req-3c4d gains two Required-behavior bullets (see "Requirements") — a
   requirement item, for the human.
3. Design fact for design-c1d2 (kisou): the refresh path compares section
   structure against the template and reads no `docs/` content; there is no
   consistency check in kisou (measured 2026-09-09 by reading `SKILL.md`; the
   word does not occur in the skill).
4. Design fact for design-e3f4 (shoroku) at T2: the classification follows two
   named splits and the proposal carries the requirement pairing, scoped to
   the proposal's own entries.
5. Measured: Git Bash `sed` emits LF from CRLF input, so a template-versus-copy
   diff needs `--strip-trailing-cr` — a note candidate beside the existing
   Windows pitfalls, if a note carries them.
6. Rejected alternative with its reason: a kisou-side `docs/` scan (D-1) —
   the loss happens at classification, and kisou does not read content.
7. Rejected: a translation rule in shoroku's proposal (D-2) — the proposal is
   already in the chat's language; the tanto item under req-04f5 stays.
8. Rejected: hand-mirroring the installed copies (D-3) — it would leave
   decision-281f's refresh path unexercised.
9. Changed after review: the requirement-side pairing flag is a question, not
   an issue offered outright (spec review finding 2) — an observation about
   the rule's own over-extraction risk, for design-e3f4.
