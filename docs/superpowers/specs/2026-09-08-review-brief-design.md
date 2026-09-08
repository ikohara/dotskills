# Design: `tanto` review-brief — a brief of the judgment points, in the chat's language, before the human reads a spec or plan

This is the fourth design for the `tanto` skill and the second plan the
resident Kanri conducts. It closes one issue, issue-a1c9: before the human
reviews a spec or a plan, a third party lists, concisely and in the language
of the chat, only the points that need the human's judgment, each with a
pointer into the document, so the human confirms those and reads the rest
only where a point sends them. The design adds one template, two message
lines, one artifact Sekkei keeps during the spec dialogue, and one step each
to Sekkei's and Kanri's procedures. It also carries three plan conventions the
previous run's T2 landed in design-4807 but not in Sekkei's file. The skill's
earlier designs are the tanto design of 2026-09-06, the kanri-lifecycle design
of 2026-09-07, and the boundary-rules design of 2026-09-07; its as-built
record is design-4807. This document restates what it needs from them, so
that Kanri and Jisso can read it cold.

The inputs are `.superpowers/sdd/review-brief/spec-inputs.md` (I-1),
issue-a1c9, req-04f5, req-3c4d, decision-1f5f, decision-9a3a, design-4807,
and the dialogue record `.superpowers/sdd/review-brief/dialogue.md`, the
first of its kind, kept by hand during this dialogue because it is the
artifact this design introduces. The human decided the forks in the spec
dialogue on 2026-09-08; those decisions are fixed inputs below. Every `I-n`
is answered in "Answers to the spec inputs".

## Fixed inputs

Decided before or during the dialogue, not reopened here:

- **Scope (Kanri's R-1).** issue-a1c9 alone, with its three open questions:
  who writes the brief, what the human's answer means, where it lives. Not
  in scope: issues e5a2 and b7d3 (the next candidates), f2c4 and 9d17 (filed
  at boundary-rules' T1), and everything the dialogue routed to the kisou and
  shoroku skills (deferred items 1 and 2).
- **Parallel run, then a branch (R-2).** The dialogue and the drafts ran
  while boundary-rules was in its final batch, as untracked files in the
  topic directory; the branch `review-brief` was cut from `main` after
  boundary-rules merged, and this spec is committed on it while no batch is
  in flight.
- **Rule 11 applies (R-3).** This plan edits `roles/sekkei.md` and
  `roles/kanri.md`, so the authority for the run's sessions is the plan's
  Global Constraints, Kanri's orders line, and the batch prompts, not the
  role text on disk; the plan names the boundary from which a role may be
  started or replaced, and Kanri records the authority ruling at the landing.
  This is the first application of the rule to a plan other than the one
  that wrote it.
- **Kanri dispatches the brief writer (D-1).** A read-only subagent on
  `subagents.reviewer` writes the brief; Kanri reads it and hands the path to
  Sekkei. Chosen over Sekkei dispatching the same subagent, because the human
  asked for a third party and Kanri is the human's counterpart, and over
  Kanri pre-reading the document itself, which would spend the top family's
  context twice on every document.
- **The models stay as they are (D-1).** The human asked whether writing on
  `opus` and reviewing on `fable` would be better and cheaper. It would not be
  cheaper or faster: a review is input-heavy and short, `fable` is twice the
  price of `opus` per token on both input and output (the cached price table
  of the Claude API skill, 2026-06-24), and a top-family subagent is what a
  real run lost to a rate limit (decision-9a3a). The brief writer therefore
  runs on `subagents.reviewer`, and Kanri's read of the brief is the
  top-family pass on the human-facing points. A `fable` reviewer is an
  experiment through the personal `tanto.json` overlay, deferred item 2.
- **The answers to the brief are the confirmation (D-2).** The human's
  answers to the brief's points are the confirmation req-3c4d requires; the
  document is the referent, and the human reads it where a point sends them.
  decision-1f5f's two points — the plan's approval and the escalated shoroku
  items — stand; this design says how the first is given.
- **Requirement extraction goes to kisou and shoroku (D-2).** The dialogue
  found that requirement-shaped statements are recorded as issues because the
  docs system's "exactly one type" rule and the issue definition ("something
  missing") make an unmet need an issue, and no "requirements vs issues" rule
  exists beside "design vs decisions". The fix — the rule, a granularity gate,
  and a requirements-to-design pairing — belongs in the docs system kisou
  installs and shoroku follows; tanto adds no rule of its own for it. Its one
  tanto-side hook is the brief's requirement section, which asks the human
  two questions.
- **The dialogue stays direct, and its words are kept (D-3).** The human
  asked whether the spec dialogue should also go through Kanri. It stays in
  Sekkei's window under the standing grant — brainstorming is many short
  turns, and req-04f5 names the spec dialogue as a checkpoint — and Sekkei
  keeps `dialogue.md`, the human's answers verbatim, so that Kanri, the brief
  writer, and T1's shoroku read the human's own words rather than Sekkei's
  paraphrase.
- **Where the brief lives, how it reaches the human (D-3).**
  `.superpowers/sdd/<topic>/review-brief-spec.md` and `review-brief-plan.md`,
  untracked, next to the review reports; Sekkei puts the brief's text
  verbatim in its review request, so the human reads it in the window where
  the dialogue was and answers there.
- **The two design rules** from design-4807, applied again: an obligation
  lives in the file of the role that performs it; a term two or more roles
  route on lives in `SKILL.md`. The two lines are the terms; the brief step
  and the dialogue record are the obligations.
- **What does not change.** superpowers, `shoroku`, `kisou`, the `docs/`
  system, `templates/tanto.json` and its defaults, every other template,
  `roles/jisso.md`, `roles/kaiseki.md`, the repo-root `README.md`. design-4807,
  the ADRs, req-04f5, and the issues change at T1 and T2 through the shoroku
  write-out, never through a plan task.
- **The previous plan is the model.** The boundary-rules plan of 2026-09-07
  is the model for a passage-level plan: anchor, old passage, new passage;
  heredoc needles; the merge-base diff; lint by name. Where this document
  leaves something as prose, the drafter takes that plan for shape and
  wording, with one correction the consistency note now records: a plan does
  not encode per-file line endings as a table; `git ls-files --eol <file>`
  before and after each edit is the deciding command.

Names in prose: Kanri (管理), Sekkei (設計), Jisso (実装), Kaiseki (解析);
kanji at first mention, no honorific.

## The brief

### What it is

A selection rendered in the chat's language, not new analysis. A spec under
`tanto` already carries the material in Fixed inputs, the Rejected
subsections, Deferred items, and Shoroku candidates; a plan carries it in
Global Constraints and Batches. The brief lists, from those, only what the
human decides, each item as a question with the document's answer and a
pointer to the section that answers it — never a line number, which an edit
moves.

Five fixed sections, and a sixth for what the writer could not settle:

1. the scope and what was excluded;
2. every choice among alternatives, with the rejected ones and their reasons;
3. requirements — two questions per item: which requirement (`req-<id>`, the
   bullet) the design serves, and whether it adds to or changes a requirement
   or an ADR;
4. the deferred items;
5. for a plan: the batch cut, the boundary from which a role may be started
   or replaced, and what each batch verifies.

The chat's language is the repository's i18n convention for user-facing text
("use the language of the user's first message"); the skill never names a
language. Kanri names it in the dispatch, and every part of the brief — the
headings included — is written in it. The template is the English source the
writer renders.

### The template

`templates/review-brief.md`, the tenth template, new:

```markdown
# Review brief — <spec or plan> — <topic>

Written by the brief writer Kanri dispatches, at
`.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`,
next to the review reports and untracked under `.superpowers/sdd/.gitignore`.
Every part of the brief, these headings included, is written in the chat's
language, which the dispatch names; this template is the English source the
writer renders. The brief selects and renders; it does not analyze anew.

Document: <path> — brief written <YYYY-MM-DD> on <model family> for the chat
language <language>. Inputs read: <the document; for a spec also
spec-inputs.md and dialogue.md; for a plan also the spec>.

Each point is three parts: the question the human decides, in one sentence;
the document's answer, in one sentence; the pointer — the section heading
that answers it, never a line number.

## 1. Scope and what was excluded

1. Q: <...> — A: <...> — See: <section>

## 2. Choices among alternatives, with the rejected ones and their reasons

1. Q: <...> — A: <...> — See: <section>

## 3. Requirements

Two questions per item: which requirement this design serves, and whether it
adds to or changes a requirement or an ADR.

1. Serves: <req-<id>, the bullet> — Adds or changes: <yes: what, or no> — See: <section>

## 4. Deferred items

1. Q: <...> — A: <...> — See: <section>

## 5. For a plan: the batch cut, the replacement boundary, what each batch verifies

1. Q: <...> — A: <...> — See: <section>

## What the writer could not settle

- <a point whose answer or classification the document does not decide, one line each, or "none">
```

The template is markdownlint-ignored (`skills/**/templates/**`), so its bare
`<...>` blanks are correct; the trailing-whitespace, end-of-file, and
mixed-line-ending hooks still apply.

### The writer

A read-only subagent on `subagents.reviewer`, dispatched by Kanri with the
document's path, the chat's language, and the input set: for a spec, the
spec, `spec-inputs.md`, and `dialogue.md`; for a plan, the plan and the spec.
It writes the brief file and nothing else. Kanri reads the brief — if it
skips a section of the template or misreads the document, Kanri dispatches
again; Kanri never edits it — and sends Sekkei the path. A second brief for
the same document is written only when the human asks for one; small edits
after the human's answers do not trigger one.

## The flow

### The lines, in the contract

`SKILL.md`, section Messages, gains one bullet after the boundary-reply
bullet ("At a batch boundary Kanri has verified, Sekkei answers in one line
..."):

```markdown
- Before the human reviews a spec or a plan, Sekkei sends Kanri
  `review-ready: <path>`. Kanri dispatches the **review brief** on
  `subagents.reviewer` — a read-only subagent that writes
  `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`
  from `templates/review-brief.md`, in the chat's language — reads it, and
  answers `brief: <path>`. Sekkei puts the brief's text verbatim in its
  review request, with both paths. The human's answers to the brief's points
  are the confirmation that review asks for; the document is what the points
  point into, and the human reads it where a point sends them.
```

The two routed strings, `review-ready: <path>` and `brief: <path>`, each stay
on one line in every file that carries them, so the consistency note can pin
them with a fixed-string grep.

### Sekkei's obligations

`roles/sekkei.md`, Step 1, a paragraph after "Run superpowers brainstorming
with the human. ... not a one-liner.":

```markdown
Keep `.superpowers/sdd/<topic>/dialogue.md` as you go: each question you put
and the human's answer, verbatim, in order. Kanri may read it at any time, the
brief writer reads it, and T1's shoroku takes it as an input — under this
protocol it is the one record of the human's own words.
```

`roles/sekkei.md`, Step 2, two paragraphs appended after "... Kanri adopts
from its Shoroku candidates.":

```markdown
A passage in the spec that rewrites another role's procedure goes to that
role's session for a check before the spec is committed, when that session is
live, with the question which of its obligations it touches; Kanri's answer
comes back as an `I-n`.

Then, before the human reads the spec, send Kanri `review-ready: <spec path>`
and wait for `brief: <path>`. Put the brief's text verbatim in your review
request to the human, with the spec's path and the brief's, and record the
human's answers in `dialogue.md`. A second brief is written only when the
human asks for one.
```

`roles/sekkei.md`, Step 3, a paragraph before "The report and prompt
skeletons do **not** go in the plan.":

```markdown
A plan that carries passages rather than whole files wraps each new passage
at its destination file's column, chosen when the block is authored, and
states each passage's shape — a replacement of an old passage, or an
insertion next to an anchor that stays.
```

`roles/sekkei.md`, Step 4, the numbered list replaced whole:

```markdown
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
5. Send Kanri `review-ready: <plan path>` and wait for `brief: <path>`; put
   the brief's text verbatim in your request for the one OK, with both paths.
   On the human's OK, commit under your commit rule below.
```

Items 1, 3, and 4 are the file's current text, transcribed; items 2 and 5
change. The three conventions ride along here — the other role's check in
Step 2, the sweep in Step 4 item 2, the wrap column and the shape in Step 3 —
because the previous run's T2 put them in design-4807 and this plan edits
Sekkei's file anyway (spec input I-1, Kanri's optional note).

### Kanri's obligation

`roles/kanri.md`, section Human access, a fifth item after item 4 and before
the paragraph "The harness's own prompts ...":

```markdown
5. On `review-ready: <path>` from Sekkei, dispatch the review brief on
   `subagents.reviewer`: a read-only subagent that reads the document — for a
   spec also `spec-inputs.md` and `dialogue.md`, for a plan also the spec —
   and writes `.superpowers/sdd/<topic>/review-brief-spec.md` or
   `review-brief-plan.md` from `templates/review-brief.md`, in the chat's
   language, which you name in the dispatch. Read the brief: if it skips a
   section of the template or misreads the document, dispatch it again; never
   edit it. Then send Sekkei `brief: <path>`. The human answers the brief in
   Sekkei's window under the standing grant; the answers reach you through
   `dialogue.md` and the document, and your cold read stays where it is.
```

Kanri's cold read of the committed plan (When the plan lands, step 1) is
unchanged: the brief is the human's pre-read, the cold read is Kanri's, and
they read for different things.

### The artifacts

`SKILL.md`'s artifacts table gains two rows after the `spec-inputs.md` row:

```markdown
| `.superpowers/sdd/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, T1 | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
| `.superpowers/sdd/<topic>/review-brief-spec.md`, `.superpowers/sdd/<topic>/review-brief-plan.md` | the brief writer Kanri dispatches | Kanri, then the human through Sekkei | the review brief, from `templates/review-brief.md`, in the chat's language |
```

and its Templates sentence reads ten:

```markdown
Templates are copied and filled, never restated in prose. There are ten:
`templates/roster.md`, `templates/kanri.md`, `templates/kanri-handover.md`,
`templates/bug-report.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/review-brief.md`, and
`templates/tanto.json`.
```

### The README

`README.md`, What it does, a bullet after "Takes bug reports about the skills
this repository ships ...":

```markdown
- Puts a **review brief** in front of the human before each spec and plan
  review: the points that need the human's judgment, each with a pointer into
  the document, in the chat's language, written by a third party Kanri
  dispatches — so the human confirms those and reads the rest only where a
  point sends them.
```

Layout, the templates bullet:

```markdown
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the
  conductor ledger), `kanri-handover.md`, `bug-report.md`, `batch-prompt.md`,
  `batch-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`,
  `review-brief.md`, and `tanto.json` (the built-in expected-model defaults).
```

and the closing sentence names four designs, adding
`docs/superpowers/specs/2026-09-08-review-brief-design.md` after the
boundary-rules path. No other README drift is expected; the task that edits
`SKILL.md` records the review either way.

## What the human's answer means

The human's answers to the brief's points are the confirmation the review
asks for. For a spec, that is brainstorming's user review gate; for a plan,
the one OK req-04f5 names before the commit, which decision-1f5f keeps as the
first of req-3c4d's two points. The brief does not shorten the checkpoint's
authority; it shortens the reading. The writer owes completeness of the five
sections; a point it misses is Kanri's to catch at the cold read and Sekkei's
in its own review, as today.

## Requirements

### The two questions

Section 3 of the brief asks, for each item, which requirement the design
serves and whether it adds to or changes a requirement or an ADR. The human
answers in the chat's language; Sekkei records the answers in `dialogue.md`;
Kanri takes a "yes" as a requirement or ADR candidate for the `S-n` table,
already confirmed by the human, and escalates only the wording. This is the
one hook tanto adds for requirement extraction, and it is a question, not a
rule.

### The a1c9 need is a requirement

The statement that opened this topic — reading the full translation of every
spec and plan is too much; a third party should list only the judgment points
— is a need about the human's own situation that survives any design of the
brief. It was recorded as an issue. At T1 it becomes a bullet of req-04f5:
the human reviews a spec or plan through a brief of the judgment points, in
the chat's language, written by a third party; the human's answers to its
points are the confirmation, and the human reads the document where a point
sends them. The wording is the human's to confirm at T1.

### What goes to kisou and shoroku

The dialogue's analysis, for the issue filed at T1 (deferred item 1):

- `docs/AGENTS.md`'s shoroku step classifies each fragment as exactly one of
  four types, and `docs/issues/AGENTS.md` defines an issue as something wrong
  or missing that is not being fixed now. An unmet need matches "missing", so
  it becomes an issue and the requirement in it is lost — by shoroku, and by
  Kanri filing an issue at the intake by the same rules. `docs/design/AGENTS.md`
  has "design vs decisions" ("a significant choice often updates design and
  adds an ADR; that is not duplication"); there is no "requirements vs
  issues".
- The rule to add, in kisou's templates for `docs/requirements/AGENTS.md` and
  `docs/AGENTS.md`: a need the human states is a requirement fragment even
  when unmet; the gap it leaves is a separate issue fragment; one statement
  yielding two entries is not duplication. Two tests: the need survives a
  change of design; its reason is the human's own situation (time, trust,
  language, authority), not the system's coherence.
- The gate against over-extraction: the existing granularity rule of
  `docs/requirements/AGENTS.md` (coarse, one file per topic, never one file
  per sentence) applied to classification — a small need folds into an
  existing requirement's section as one bullet, or is design; a new file only
  for a new topic — and the human's confirmation, which the adoption rule
  already requires for every requirement item.
- The pairing: a requirement file and a design file per topic already cite
  each other (req-04f5 and design-4807 do); the check to add is bullet-level
  — a design section that names no requirement, a requirement bullet no
  design serves — as a kisou consistency check and a shoroku proposal field.
- shoroku's own `SKILL.md` defers to `docs/AGENTS.md` and needs one sentence
  at most.

## Where each change lives

Seventeen passages in six files, one of them new. A **replacement**
supersedes an old passage; an **insertion** adds text next to an anchor that
stays; the new file is one passage of its own shape.

| File | Passage | Shape | Task |
| --- | --- | --- | --- |
| `skills/tanto/SKILL.md` | Messages, the review-brief bullet after the boundary-reply bullet | insertion | 1 |
| `skills/tanto/SKILL.md` | Artifacts, two rows after the `spec-inputs.md` row | insertion | 1 |
| `skills/tanto/SKILL.md` | the Templates sentence, ten | replacement | 1 |
| `skills/tanto/README.md` | What it does, the review-brief bullet after the bug-reports bullet | insertion | 2 |
| `skills/tanto/README.md` | Layout, the templates bullet | replacement | 2 |
| `skills/tanto/README.md` | the closing sentence, four designs | replacement | 2 |
| `skills/tanto/templates/review-brief.md` | the whole file | new file | 3 |
| `skills/tanto/roles/sekkei.md` | Step 1, the `dialogue.md` paragraph after the brainstorming paragraph | insertion | 4 |
| `skills/tanto/roles/sekkei.md` | Step 2, two paragraphs appended | insertion | 4 |
| `skills/tanto/roles/sekkei.md` | Step 3, the passage-plan paragraph before "The report and prompt skeletons" | insertion | 4 |
| `skills/tanto/roles/sekkei.md` | Step 4, the numbered list | replacement | 4 |
| `skills/tanto/roles/kanri.md` | Human access, item 5 after item 4 | insertion | 5 |
| `docs/notes/tanto-consistency-checks.md` | Versions, "Sixteen skill files, ten of them templates" | replacement | 6 |
| `docs/notes/tanto-consistency-checks.md` | check 1, the `ls` gains `skills/tanto/templates/review-brief.md`, Expected says sixteen | replacement | 6 |
| `docs/notes/tanto-consistency-checks.md` | check 2, Expected says fourteen `ok` lines and lists `templates/review-brief.md` after `templates/kanri.md` | replacement | 6 |
| `docs/notes/tanto-consistency-checks.md` | check 3, the MAP gains `templates/review-brief.md skills/tanto/roles/kanri.md`, Expected says ten and seven | replacement | 6 |
| `docs/notes/tanto-consistency-checks.md` | check 6, a last block pinning `review-ready: <` and `brief: <path>`, after the orders-line block | insertion | 6 |

The note's check 6 block, new, appended as the check's last block, after the
block that pins "orders line, and the batch prompts" (the outer fence here is
four backticks because the passage itself contains a fence):

````markdown
The two lines of the review brief, each on one line where it occurs:

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/sekkei.md skills/tanto/roles/kanri.md; do
  printf '%s review-ready %s brief %s\n' "$f" "$(grep -cF 'review-ready: <' "$f")" "$(grep -cF 'brief: <path>' "$f")"
done
```

Expected: `skills/tanto/SKILL.md review-ready 1 brief 1`,
`skills/tanto/roles/sekkei.md review-ready 2 brief 2`,
`skills/tanto/roles/kanri.md review-ready 1 brief 1`.
````

Task 7 is the consistency pass and writes nothing; a failing check there is a
Rulings-needed item in its report, never an edit.

Unchanged: `roles/jisso.md`, `roles/kaiseki.md`, every other template,
`templates/tanto.json`, the repo-root `README.md`, everything under
`docs/requirements/`, `docs/design/`, `docs/decisions/`, and `docs/issues/`.

## What the plan must contain

Beyond the conventions of superpowers writing-plans and design-4807's "Plan
conventions under tanto", and following the boundary-rules plan as the model:

- **Passage-level blocks**, one anchor, one old passage, one new passage per
  passage, with the shape from the table; the new file is one block. The
  drafter reads each old passage from the tree at drafting time; this
  document gives every new passage verbatim except the note's three count
  changes, whose new text is the old with the number and the list changed as
  the table says. Needles from quoted heredocs, passed as `"$needle"`; the
  merge-base diff `git diff "$(git merge-base main HEAD)" -- <file>`; hunk
  counts as task-time checks; every fenced `bash` block in Git Bash.
- **Seven tasks in two batches.** A: Task 1 `SKILL.md`; Task 2 `README.md`,
  with the drift review recorded; Task 3 `templates/review-brief.md`. B: Task
  4 `roles/sekkei.md`; Task 5 `roles/kanri.md`; Task 6 the note; Task 7 the
  consistency pass, verification-only.
- **The boundaries.** The batch A boundary is **not** the boundary from which
  a role may be started or replaced: after A, `SKILL.md` defines
  `review-ready:` and `brief:` and the artifacts, and the README describes
  the brief, while the two role files still send neither line and keep no
  `dialogue.md` — the contract a batch ahead of the roles that act on it,
  which the Batches section names as the forward-reference set. The **batch
  B boundary** is the one from which a role may be started or replaced, and
  it is the final boundary, the case Sekkei's Step 3 bullet foresees; the
  plan says so in Global Constraints and Batches, and this plan expects one
  Jisso throughout. The sweep that decides it: a per-file flattened count of
  `review-ready: <` and `brief: <path>` over `SKILL.md`, `roles/*.md`, and
  `templates/*.md` — at the batch A boundary `SKILL.md` counts one of each
  and every other file zero; at the batch B boundary the counts of the
  note's new check 6 block.
- **Line endings**, per the consistency note: no per-file table in the plan;
  `git ls-files --eol <file>` before and after each edit shows the same
  `w/crlf` or `w/lf` and never `w/mixed`, and a passage is written with the
  file's ending as measured then. The new template takes LF, like every
  other template.
- **Write-outs are outside the plan**, with the same exception and the same
  whole-branch-review exclusion as the previous plan; Task 6's note commit is
  plan output and stays in the package; Kanri's `docs(issues):` commits on
  this branch, if any, are out of scope and named by subject.
- **Global Constraints** carried from the boundary-rules plan, adjusted:
  branch `review-brief`; models implementer `sonnet`, reviewer `opus`,
  escalation `opus`, never `fable` in a dispatch; the never-edit list above;
  the README review in the task that edits `SKILL.md`; `SKILL.md`'s
  frontmatter unchanged and its `description` free of colon-space, decided
  by the PyYAML load the previous plan's Task 4 used; markdownlint's ignored
  and linted paths; runtime text never names `skills/tanto/`; no commit
  hashes and no user-specific paths; the passage rule and the needle rule.
- **How a batch is verified**, as below.
- Reports and prompts follow the tanto templates; the plan names nothing
  else about their shape.

## Verification

Per passage, as in the boundary-rules plan: the anchor returns `1` before
the edit; after it, on the flattened file, the new passage returns `1`, a
replacement's old passage returns `0`, an insertion's anchor still returns
`1`; the merge-base diff shows the passages written so far and nothing else;
`git ls-files --eol` unchanged; lint by name; commit by explicit path with
the trailer, confirmed. For the new template: the file exists, `git ls-files
--eol` shows `w/lf`, and its headings in order are the six of the template
plus the title.

At the batch A boundary, additionally: the frontmatter hook and the PyYAML
load on `SKILL.md`; the README drift review recorded; the two-line sweep
above showing `SKILL.md` alone. At the batch B boundary: the sweep at its
final values; Task 7's run of the note's checks 1 to 8 as written and check
9's whitespace sweep, compared with the pre-edit baseline Sekkei records at
plan review — checks 1, 2, 3, and 6 are **expected to differ** from the
baseline exactly as Task 6 changes their Expected text (sixteen, fourteen,
ten and seven, the new last block of check 6), and the report says so per
check; every
other check equal to the baseline; lint on every touched path by name; the
trailer equality over `main..HEAD`.

## Out of scope

The repo-root `README.md`; superpowers, `shoroku`, and `kisou` (deferred item
1 is theirs); `templates/tanto.json` and the model defaults (deferred item 2);
whether a full `wayaku` translation is still made — the human's personal
setting, outside the skill; `roles/jisso.md` and `roles/kaiseki.md`; any
change to `docs/design/`, `docs/decisions/`, `docs/requirements/`, or
`docs/issues/` by a plan task — those are T1 and T2.

## Answers to the spec inputs

| Input | Answer |
| --- | --- |
| I-1 the scope, issue-a1c9 and its three questions | Adopted. Who writes: Kanri dispatches the writer on `subagents.reviewer`, reads the brief, hands the path to Sekkei (Kanri's third shape). What the answer means: the answers to the brief's points are the confirmation; the document is the referent. Where it lives: `.superpowers/sdd/<topic>/review-brief-spec.md` and `-plan.md`, Kanri's default, delivered verbatim in Sekkei's window. Rule 11 applied: the batch B boundary is the replacement boundary and the plan says so; Kanri records the authority ruling at the landing (R-3 already does). Two batches. The three optional conventions ride along in `roles/sekkei.md`. Beyond the note: `dialogue.md`, the human's words kept, from the dialogue's D-3. |

## Deferred items

Filed as issues at T1:

1. **Requirement extraction in the docs system** — for the kisou and shoroku
   skills: the "requirements vs issues" rule (a need the human states is a
   requirement fragment even when unmet; its gap is a separate issue
   fragment; two entries from one statement is not duplication), the two
   tests (survives a change of design; the reason is the human's own
   situation), the granularity gate (fold a small need into an existing
   requirement's section, a new file only for a new topic), the
   bullet-level requirements-to-design pairing as a consistency check and a
   shoroku proposal field, and one mirroring sentence in shoroku's
   `SKILL.md`. Raised by the human in this dialogue (D-2); the mechanism that
   lost a1c9's requirement is in "What goes to kisou and shoroku".
2. **A `fable` reviewer, measured.** Run one or two reviews on `fable`
   through the personal `tanto.json` overlay (`subagents.reviewer: fable`),
   record whether a 429 occurs and how long the review takes against the
   `opus` baseline, and only then decide whether decision-9a3a's consequence
   ("every review runs one tier below the top family") should change. Raised
   by the human in this dialogue (D-1).

## Shoroku candidates from this spec work

For Kanri's `S-n` table:

- requirement, **escalated**: req-04f5 gains the bullet in "The a1c9 need is
  a requirement" — the human reviews a spec or plan through a brief of the
  judgment points, in the chat's language, by a third party; the answers are
  the confirmation; the document is read where a point sends the human — and
  a clause that the human's own words in the spec dialogue are kept as a
  record.
- decision, **escalated**: the brief writer is dispatched by Kanri, not the
  author, on the reviewer tier, and the confirmation req-3c4d requires is
  given on the brief's points with the document as referent — the choice
  over Sekkei dispatching it and over Kanri pre-reading, and the reasons;
  amends decision-1f5f's first point by saying how the plan's approval is
  given, so it carries `amends: ["1f5f"]` and 1f5f gains `amended_by`.
- design-4807: Human access gains the brief and the dialogue record; Skill
  layout counts sixteen files and ten templates; the artifacts; "Kanri's
  loop, with its entry and its side channel" notes that the spec dialogue's
  words now reach Kanri through `dialogue.md`; a set under "Where the
  delivered skill differs" for this design only if the fix wave leaves a
  difference.
- issues: a1c9 moves to `docs/issues/resolved/` at T2; deferred items 1 and
  2 are filed at T1.
- facts from the dialogue: `fable` is twice `opus` per token on input and
  output (the Claude API skill's cached table, 2026-06-24: 10 and 50 against
  5 and 25 dollars per million); the a1c9 statement was requirement-shaped
  and was filed as an issue by the "exactly one type" rule; superpowers has
  no third-party review of a spec or plan and no explicit human approval of
  a plan beyond the execution choice, which tanto adds as the reviewer
  subagents, the one OK, and Kanri's cold read.
- observations about the process: the human's two questions (the models;
  requirement extraction) each changed the design — the first by confirming
  the defaults with a measurement issue, the second by moving the fix to
  another skill — and the second was caught only because Sekkei's answer
  named a concrete lost requirement; `dialogue.md` now makes such turns
  legible to Kanri and to T1 without Sekkei's paraphrase. The first
  `dialogue.md` was kept by hand in this run, before the rule existed.
- rejected alternatives with their reasons, each recorded above: Sekkei
  dispatching the brief writer (the author briefing its own work); Kanri
  pre-reading the document (the top family's context spent twice); `fable`
  as the reviewer now (not cheaper, not faster, the 429 history; measured
  first); routing the spec dialogue through Kanri (many short turns, a named
  checkpoint); tanto-side requirement rules (the docs system is where every
  classifier reads); the brief next to the `.wayaku/` copy (a personal
  setting's directory).
