# Design: `tanto` boundary-rules — a handover that waits, a topic word Kanri derives, and the rule for a skill edited in place

This is the third design for the `tanto` skill and the first plan the resident
Kanri conducts without a handover expected. It closes three issues, each a
rule about a boundary: a due Kanri handover waits for what the session still
owns (issue-f801); Kanri derives the topic word instead of asking the human
for it (issue-c7e1); and a plan that edits this skill's own files states where
authority lives while the files are in motion and names the boundary from
which a role may be started or replaced (issue-4ac3). One sentence from the
previous run's shoroku rides along: "a fix-wave list deserves a plan's
pre-flight", candidate S-73 of a ledger since deleted with its plan, now in
design-4807's plan conventions. The skill's first two designs are the
tanto design of 2026-09-06 and the kanri-lifecycle design of 2026-09-07; its
as-built record is design-4807. This document restates what it needs from
them, so that Kanri and Jisso can read it cold.

The inputs are `.superpowers/sdd/boundary-rules/spec-inputs.md` (I-1, I-2),
the three issues, design-4807, decision-de63, req-04f5, and the dialogue's
draft file `.superpowers/sdd/boundary-rules/sekkei-draft-passages.md`, whose
revision 2 carries the passages as the dialogue left them, and the spec
review at `.superpowers/sdd/boundary-rules/spec-review.md`, whose twenty-two
findings are folded in — the rulings are in `spec-review-rulings.md` beside
it, and the passages below supersede the draft file. The human decided the
forks in the spec dialogue on 2026-09-07; those decisions are fixed inputs
below. Every `I-n` is answered in "Answers to the spec inputs".

## Fixed inputs

Decided before or during the dialogue, not reopened here:

- **Scope (Kanri's R-1).** Three issues, in priority order: f801, c7e1, 4ac3.
  Excluded, with the reason: issue-d82b (deferred until a real case), issues
  40ed, 15bf, and 9a68 (measurement issues that close with data), issues 0673
  and 3ca4 (design-sized, would not fit one session), issues b2b5 and 2028
  (wayaku, a separate topic).
- **Session budget (R-2).** No handover is expected during this plan. Two
  batches at most; every deliverable is an edit to an existing file under
  `skills/tanto/` or `docs/`.
- **The authority ruling for this run (R-3).** The role files are plan-listed
  and this run's own sessions read them, so the authority for the sessions of
  this run is the plan's Global Constraints, Kanri's orders line, and the batch
  prompts, not the role text on disk. Recorded by Kanri before any dispatch,
  which is what the rule this design adds (rule 11) will require of every
  skill-editing plan.
- **The wait is unbounded.** A due handover waits for every background agent
  the session dispatched and for every commit line it promised a peer at that
  boundary; the only override is the human's word. Chosen by the human over a
  bounded wait, because the harness gives no signal to bound it by — no timer,
  and the token figure is deliberately unused (decision-de63) — so a bound
  would be a guess written as a rule.
- **No date in the topic word.** The topic word stays a bare slug. A date
  prefix is worth having only as the larger change that makes the topic equal
  to the plan basename (one directory, no ledger move), which is a fourth item
  beyond R-1 and would change this run's own workspace naming mid-run; it is
  deferred item 1.
- **A successor Kanri proceeds from the handover file.** When a handover falls
  due before the boundary a skill-editing plan names as safe, the handover
  proceeds; the successor reads the role file from disk but takes the authority
  ruling from the handover file's "Rulings the next batch inherits" section.
  Chosen over waiting for the safe boundary, because a compacted Kanri held for
  several batches is the worse risk.
- **Passage-level blocks, two batches, S-73 included.** The plan carries, for
  each edit, an anchor line, the old passage, and the new passage, verbatim —
  not whole files, since the largest target is 580 lines and gains seven
  passages. Batch A is issues f801 and c7e1 with S-73; batch B is issue-4ac3
  with the consistency pass. The S-73 sentence fits batch A without a third
  batch, so it is in.
- **Kanri's check (I-2).** The human asked that Kanri read the passages that
  rewrite Kanri's own role file before they went into this spec. Kanri's four
  edits are folded in: the slug is one to three words; rule 11 states the
  link premise conditionally and forbids replacement and *further* creation
  before the boundary, not creation as such; Sekkei's convention covers the
  plan whose only consistent boundary is its last; the Timing paragraph names
  the idle subscription that lapses with the session.
- **The hotfix lane stays closed on the plan-listed files** for this run, as
  decision-2f36 rules, although the reason that ADR gives — a later task
  would overwrite the fix, because the plan carries the file's complete
  content — assumes whole-file blocks and does not hold for a passage plan.
  Whether a passage plan may reopen the lane for the passages it does not
  touch is a shoroku candidate below, not a change here.
- **The two design rules** from design-4807, applied again: an obligation
  lives in the file of the role that performs it; a term two or more roles
  route on lives in `SKILL.md`. Rule 11 is the term; Kanri's recording step
  and Sekkei's plan convention are the obligations.
- **What does not change.** superpowers, `shoroku`, the `docs/` system,
  `templates/tanto.json`, every template but `kanri-handover.md`,
  `roles/jisso.md`, `roles/kaiseki.md`, the repo-root `README.md`.
  design-4807, the ADRs, req-04f5, and the issues change at T1 and T2 through
  the shoroku write-out, never through a plan task.
- **The previous plan is the model** for the shape of a task, a verification
  step, and a commit, with one deliberate difference: passages instead of
  whole files. Where this document leaves something as prose, the plan drafter
  takes `docs/superpowers/plans/2026-09-07-kanri-lifecycle.md` as the model.

Names in prose: Kanri (管理), Sekkei (設計), Jisso (実装), Kaiseki (解析);
kanji at first mention, no honorific.

## The handover waits for what the session owns (issue-f801)

### The gap

Kanri's Handover section fires on a noticed compaction and times the handover
"only at a boundary". It does not say what happens to work the session itself
still owns at that moment. Measured 2026-09-07 at the batch C boundary of the
kanri-lifecycle plan: the resident Kanri noticed a compaction while the
whole-branch reviewer it had dispatched was still running as a background
subagent of its own session, and while Sekkei was holding its exit shoroku
commit for a line Kanri had promised. A subagent belongs to its session and
dies with it; the successor inherits only the report file the agent writes,
never its completion notice, and an idle subscription (`notify_when_idle`)
lapses the same way. Kanri ruled to let the in-flight work return first (R-22
of that ledger). This design makes the ruling the rule.

### The rule

`roles/kanri.md`, section Handover, subsection Timing, gains a second
paragraph after "Only at a boundary: ... the next prompt is the successor's to
send.":

```markdown
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
```

The first paragraph is the wait; the second is Kanri's own exception to rule
11, which lives here because the obligation is Kanri's, and which does not
cite the rule by number: this passage lands in batch A and rule 11 in batch
B, and a citation would be the one forward reference across the batch A
boundary (plan review F-1). The sentence stands without it. "Between the last of
those and the handover file" scopes the prohibition: the commit window's
slot (c) line to Sekkei is an obligation the wait depends on, not a new
dispatch, and a create request that step 6 found due is deferred to the
successor rather than sent by a session about to end. Step 6's sentence gains
that exception. Old:

```markdown
If a create request is due, make it.
```

New:

```markdown
If a create request is due, make it, unless a handover trigger has fired, in
which case the successor makes it from the handover's Next step.
```

The batch loop reaches the handover through step 7, whose last sentence does
not pass through Timing. It gains a cross-reference. Old:

```markdown
   handover is due, the window ends with steps 2 to 4 of "The handover, in a
   plan and between plans" — the exit shoroku was step 6's proposal and slot
   (b)'s commit — and the loop stops here; the next prompt is the successor's.
```

New:

```markdown
   handover is due, the window ends, after the wait Timing prescribes, with
   steps 2 to 4 of "The handover, in a plan and between plans" — the exit
   shoroku was step 6's proposal and slot (b)'s commit — and the loop stops
   here; the next prompt is the successor's.
```

The plan's block for this passage is the whole of step 7 as it stands with
that sentence replaced, so that the wrap is the file's and not a guess.

### The handover file

`templates/kanri-handover.md`, section In flight, gains a fourth line after
the Batch state line:

```markdown
- Agents of this session still running — <label and what it was to deliver, one per line, or "none">; lost with this session
```

Under the rule the line normally says `none`; it exists for the handover
written on the human's word, so that a successor finding an agent listed knows
not to wait for it.

### Rejected

A bounded wait — give up on an agent after some signal — was rejected in the
dialogue: no harness signal bounds it, and a bound would be a guess. The
human's word is the override, and it already exists.

### At T2

design-4807's Handover section says the first handover "waited for the
session's own background agent to return" as a fact of that run; at T2 the
sentence becomes the rule, and the section names what a due handover waits for.

## Kanri derives the topic word (issue-c7e1)

### The gap

Step 5 of Kanri's Start says that when no plan is in flight Kanri asks the
human for "the topic word". The word is used in five places — the topic
directory, the spec and plan file names, the plan basename that names the
workspace, the branch, and the roster's Events prose — and every one of them
is reached through Kanri. Nothing about it needs the human's judgment beyond
its being a short, unique slug, and under req-04f5 the human is interrupted
only at defined checkpoints. Observed 2026-09-07: the resident Kanri asked,
and the human objected to inventing a word each time.

### The rule

`roles/kanri.md`, section Start, step 5, replaced whole:

```markdown
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
```

The Kept Kanri case under "The four cases" ends "continue where the current
ledger's Progress line says, or wait for the topic if none is open." It
becomes:

```markdown
**Kept Kanri** — no handover file, and the first data row is you. This is a
re-invocation in the resident session: continue where the current ledger's
Progress line says, or, if none is open, wait for the human to say what the
next work is and open the topic as step 5 says.
```

Three properties, each decided in the dialogue: the slug is derived and
**stated**, never asked; a Kanri with nothing said yet **waits** rather than
asks — step 6's "wait for the human" already covers it; and the override
window closes at the orders line, because from then on Sekkei's file names
carry the word. The uniqueness check is three commands against the three
places a stale word would collide — the topic directory, the spec file name,
and the branch, which Sekkei cuts from `main` under the slug and which an
abandoned topic can leave behind. The orders line to Sekkei is unchanged: it
already carries the topic.

### Rejected

A date prefix on the topic word (`YYYY-MM-DD-<slug>`), raised by the human.
The spec, the plan, and the workspace already carry a date, so a dated topic
either doubles the date in every file name or becomes the larger change in
which the topic *is* the plan basename — one directory for the topic and the
workspace, no ledger move, the branch named by the slug alone. That change is
worth making and is deferred item 1; it is not made here because it is a
fourth item beyond R-1 and would change this run's own workspace naming while
the run uses it, the very hazard issue-4ac3 names.

### At T2

design-4807's "Kanri's loop, with its entry and its side channel" opens with
"Kanri's start runs its branch before it asks for a topic"; at T2 that
paragraph says Kanri derives the topic from what the human said the next work
is, states it, and proceeds unless overridden, and records the five places
the word reaches. issue-c7e1's body says "three places only"; the move to
`docs/issues/resolved/` at T2 corrects that count in the body, so the
resolved issue does not carry a wrong measurement.

## The rule for a skill edited in place (issue-4ac3)

### The hazard

When the skill the sessions load is the working tree's own copy — in this
repository, a user-level link into it — a plan that edits `skills/tanto/`
changes the skill the run's own sessions load, and a role started mid-plan
reads whatever is on disk at that moment. The kanri-lifecycle plan answered
this for itself: no role replacement before its batch B boundary, where the
delivered skill first held together. decision-de63 records the consequence
for Kanri's successor. The general answer was open.

Two shapes were named in the issue: a copy of the skill for the running roles
(link the last landed version, run the plan on the working tree), or a rule
every skill-editing plan states. One instance is measured: Task 6 of the
previous plan rewrote `roles/jisso.md` while the Jisso session was executing
from it, the harness reported the file changing on disk mid-run, and nothing
broke — because a Kanri ruling had already put the authority in the batch
prompts. The mitigation that worked was a declaration of where authority
lives, not a copy.

### The rule, in the contract

`SKILL.md`, section Rules, gains item 11 after item 10:

```markdown
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
```

Two clauses carry Kanri's I-2, and two the spec review. The premise is
conditional because `SKILL.md` is runtime text shipped to any host, and the
link is this repository's setup. The creation clause forbids *further*
creation, not creation: Jisso is always created after the plan lands and
before any boundary, and it reads the skill as it stands then. The two
exceptions are in the rule's own text, not in commentary a runtime reader
never sees (spec review F-1, F-7): Kanri's handover is a replacement that
must not be held, since req-04f5 makes it mandatory at a boundary; and a
Kaiseki needed before the boundary is a ruling Kanri makes with the
half-edited skill in view.

### The obligations, in the role files

Kanri's, in `roles/kanri.md`, section When the plan lands, step 1, one
sentence appended so that the step reads:

```markdown
1. Cold-read the committed plan and the spec, and send Sekkei one line per open
   question. Wait for its pointer: it answers by editing the plan or the spec,
   never by explaining in a message. If the plan edits this skill's own files,
   record as `R-n`, before any batch prompt or subagent is dispatched, that
   the run's sessions follow the constraints, your orders lines, and the
   batch prompts rather than the role text on disk, and the boundary the plan
   names for a role start or replacement (contract rule 11); every batch
   prompt and a handover file then carry it.
```

Sekkei's, in `roles/sekkei.md`, Step 3, a fourth bullet after the "how a
batch is verified" bullet. That third bullet ends the list with a period, so
the passage replaces its last line, turning the period into the semicolon the
first two bullets end with, and appends the new bullet:

```markdown
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
```

The "permitted, as distinct from expected" clause keeps the new bullet from
being read as a restatement of the second, which asks the plan where a
planned replacement is expected; the two have different force.

The README's closing sentence names the designs the skill implements; it
gains this one as a third path:

```markdown
The designs this skill implements are
`docs/superpowers/specs/2026-09-06-tanto-design.md`,
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`, and
`docs/superpowers/specs/2026-09-07-boundary-rules-design.md`.
```

No other README drift is expected: rule 11 and the Kanri procedure changes
surface in none of What it does, Prerequisites, Usage, or Layout. The task
that edits `SKILL.md` records the review either way, as the repo rule
requires.

### The successor Kanri

A handover is triggered by a compaction and can fall due before the boundary
the plan names. It proceeds (fixed inputs), and both files say so: rule 11
carries the exception as the term, and the second paragraph added to Timing
under issue-f801 carries it as Kanri's obligation. The handover file's
"Rulings the next batch inherits" section copies rulings verbatim as
compaction insurance, and the authority ruling is one of them, so the
successor's cold read finds it before the successor reads anything else from
the tree. No new mechanism is needed beyond those two sentences.

### Rejected

The copy — link the last landed version of the skill and run the plan on the
working tree. Three reasons. The run would no longer dogfood what it delivers,
and the dogfood is how the previous two plans found their defects. The re-link
is a human step outside the protocol, at a moment the protocol does not mark.
And the measured instance shows the rule suffices: the file changed under a
running session and the session followed its prompt.

### Applied to this plan

Both boundaries leave the tree self-consistent. Batch A touches only Kanri's
procedure and the handover template, and nothing in it references rule 11 —
a claim the plan backs with a command at each boundary, not an assertion: a
per-file count of `contract rule 11` on the flattened text of `SKILL.md`,
`roles/*.md`, and `templates/*.md` is zero everywhere at the batch A boundary
and one each in `roles/kanri.md` (step 1) and `roles/sekkei.md` (the fourth
bullet, whose citation wraps, which is why the count is on the flattened file)
at the batch B boundary, and `grep -c '^11\. '` on `SKILL.md` returns `0` then
`1`. Batch B lands rule 11, both obligations, the
README line, and the note's paragraph together. So the boundary from which a
role may be started or replaced is the **batch A boundary**, and the plan's
Global Constraints and Batches section say so. The roles that start this plan
— Sekkei already, Jisso at the landing — read the skill as it stands then;
R-3 covers them.

### At T2

design-4807 changes in three places: the Skill layout paragraph that says the
skill "runs unchanged from a user-level link" gains the consequence and the
rule, and the same section's enumeration of `SKILL.md`'s contents says
"eleven rules" instead of ten; "Plan conventions under tanto" gains the
boundary convention and, beside its whole-file-blocks paragraph, the
passage-level alternative with its alignment check — the per-file diff
against the merge base whose hunks are exactly the passages. Its "Where the
delivered skill differs from the design documents" gains a set for this
design only if the whole-branch review's fix wave leaves the tree differing
from the plan's blocks.

## The fix-wave pre-flight sentence (S-73)

The previous run's shoroku candidate "a fix-wave list deserves a plan's
pre-flight" — S-73 in that run's ledger, which was deleted with its plan, so
the sentence and not the number is the reference — landed in design-4807's
plan conventions but not in the procedure that drafts the list.
`roles/kanri.md`, section The final batch, step 2, becomes:

```markdown
2. Turn its findings into one more batch prompt — the final batch — and send it
   to Jisso. A fix-wave list is drafted under the same conditions as a plan:
   run each command it specifies once before dispatching it. There is no
   second fix wave.
```

Nothing changes at T2: design-4807 already carries the convention.

## The note

`docs/notes/tanto-consistency-checks.md` opens by saying that three moments
in a `tanto` plan call for the extraction method — every fenced block pulled
into a scratch tree, diffed against `HEAD`, the checks run there — and check
9's first block lints that tree. A plan that carries passages has no
extracted tree. Check 9's second block, the sweep for trailing whitespace and
a missing final newline, runs on the real tree and applies to every plan. The
note's opening gains one paragraph after the "Three moments" paragraph:

```markdown
A plan that carries passages rather than whole files — an anchor line, the
old passage, the new passage, for each edit — has no extracted tree. Its
alignment check is the diff of each touched file against the merge base,
whose hunks must be exactly the plan's passages, and its lint runs on the
tree after each task, which is the file the hook will see. Checks 1 to 8 run
on the tree as for any plan; of check 9, the extracted-tree lint does not
apply to such a plan, and the trailing-whitespace and final-newline sweep
runs as for any plan.
```

This keeps the note the single place a future plan's pass is described from.

## Where each change lives

Twelve passages, each with its shape. A **replacement** has an old passage
that the new one supersedes; an **insertion** adds text next to an anchor
that stays, and its "old passage" is that anchor. The distinction decides
the verification below.

| File | Passage | Shape | Task |
| --- | --- | --- | --- |
| `skills/tanto/roles/kanri.md` | Start step 5, replaced whole | replacement | 1 |
| `skills/tanto/roles/kanri.md` | the Kept Kanri case's last sentence | replacement | 1 |
| `skills/tanto/roles/kanri.md` | Timing, two paragraphs after its first | insertion | 2 |
| `skills/tanto/roles/kanri.md` | the batch loop's step 6, the create-request sentence | replacement | 2 |
| `skills/tanto/roles/kanri.md` | the batch loop's step 7, its last sentence | replacement | 2 |
| `skills/tanto/roles/kanri.md` | The final batch, step 2 | replacement | 2 |
| `skills/tanto/templates/kanri-handover.md` | In flight, a fourth line after the Batch state line | insertion | 3 |
| `skills/tanto/SKILL.md` | Rules, item 11 after item 10 | insertion | 4 |
| `skills/tanto/README.md` | the closing sentence, three designs | replacement | 4 |
| `skills/tanto/roles/kanri.md` | When the plan lands step 1, a sentence appended; the old step is a prefix of the new | insertion | 5 |
| `skills/tanto/roles/sekkei.md` | Step 3, the third bullet's last line and a fourth bullet | replacement | 5 |
| `docs/notes/tanto-consistency-checks.md` | the opening, one paragraph after "Three moments" | insertion | 6 |

Task 7 is the consistency pass and writes nothing. A check that fails there
is a Rulings-needed item in its report, never an edit, because a fix outside
the passages would break the invariant that the diff is exactly the passages;
Kanri rules on it, and the whole-branch review's fix wave is where a ruled
correction lands.

Unchanged: `roles/jisso.md`, `roles/kaiseki.md`, every template but
`kanri-handover.md`, `templates/tanto.json`, the repo-root `README.md`,
everything under `docs/requirements/`, `docs/design/`, `docs/decisions/`, and
`docs/issues/`.

## What the plan must contain

Beyond the conventions of superpowers writing-plans and design-4807's "Plan
conventions under tanto":

- **Passage-level blocks.** For every passage in the table above, the task
  carries three things in fenced blocks: the **anchor**, one line of the old
  passage that occurs exactly once in the file, for a `grep -nF` that locates
  it; the **old passage**, verbatim, so the executor replaces exactly that and
  nothing else — for an insertion, the anchor line itself; and the **new
  passage**, verbatim, the text of this document's blocks with the file's own
  indentation and wrapping. The plan drafter reads each old passage from the
  tree at drafting time — this document quotes some and names the rest — and
  the plan states each passage's shape from the table. Each passage is
  written once. A file may be touched in both batches (`roles/kanri.md` is,
  in Tasks 1, 2, and 5), and the invariant is per passage, not per file: the
  diff of a file against the merge base,
  `git diff "$(git merge-base main HEAD)" -- <file>`, is exactly the union of
  its passages so far. That form compares the working tree with the merge
  base, so it is right both before and after a task's commit;
  `git diff main...HEAD` compares commits only and misses an uncommitted edit
  (measured in the plan's dry run).
- **Needles are never inlined in quotes.** Nearly every passage contains an
  apostrophe or a backtick, which break a single-quoted `grep -cF '...'` and
  command-substitute in a double-quoted one. Every anchor and passage check
  sets its needle from a quoted heredoc — `needle=$(cat <<'EOF'` ... `EOF)` —
  and passes it as `"$needle"`; Global Constraints says so once.
- **Seven tasks in two batches.** A: Task 1 `roles/kanri.md` Start; Task 2
  `roles/kanri.md` Handover, the loop's step 7, The final batch; Task 3
  `templates/kanri-handover.md`. B: Task 4 `SKILL.md` and `README.md`, with
  the drift review recorded; Task 5 `roles/kanri.md` When the plan lands and
  `roles/sekkei.md` Step 3; Task 6 the note; Task 7 the consistency pass, a
  verification-only task whose deliverable is the recorded output.
- **The boundaries.** Both self-consistent; the batch A boundary is the one
  from which a role may be started or replaced, and this plan expects one
  Jisso throughout. Global Constraints and the Batches section both say so.
- **Write-outs are outside the plan.** T1, T2, and every exit shoroku write
  under `docs/requirements/`, `docs/design/`, `docs/decisions/`, and
  `docs/issues/`, which no plan task touches; Global Constraints says so as an
  explicit exception to the never-edit list, and the whole-branch review
  package excludes exactly the commits whose subject begins with
  `docs: T<n> shoroku` or `docs: exit shoroku`. Task 6's note commit is plan
  output and stays in the package.
- **Global Constraints** carried from the previous plan, adjusted: the repo's
  `AGENTS.md` rules; models implementer `sonnet`, reviewer `opus`, escalation
  `opus`, never `fable` in a dispatch, every dispatch naming its model; branch
  `boundary-rules`, no worktree, no push; commit by explicit path with the
  trailer, verified; the never-edit list above and its write-out exception;
  the replacement boundary; the README review in the task that edits
  `SKILL.md`; `SKILL.md`'s frontmatter unchanged and its `description` free
  of colon-space; `docs/superpowers/**` and `skills/**/templates/**`
  markdownlint-ignored, `SKILL.md`, `README.md`, `roles/*.md`, and
  `docs/notes/**` not, so every `<placeholder>` outside a fenced block in
  those files lives in a code span; line endings per file, never mixed —
  `roles/kanri.md`, `roles/sekkei.md`, and the note are checked out CRLF,
  `SKILL.md`, `README.md`, and `templates/kanri-handover.md` LF (measured
  2026-09-07 with `git ls-files --eol`), a passage is written with its
  file's ending, and the deciding command is `git ls-files --eol <file>`
  showing the same `w/crlf` or `w/lf` as before the edit and never
  `w/mixed`; runtime text never names `skills/tanto/`; no commit hashes and
  no user-specific paths in tracked content, decided by the note's check 7
  (its commit-hash grep, read by eye, and its path greps); the passage rule
  above, stated as a constraint: an edit replaces exactly the old passage
  with the new one and the file's other bytes do not change; and the needle
  rule above.
- **How a batch is verified**, as below.
- Reports and prompts follow the tanto templates; the plan names nothing
  else about their shape.

## Verification

For each passage, in its task, with every needle set from a quoted heredoc
and passed as `"$needle"`:

1. **Before the edit**, the anchor: `grep -cF -- "$needle" <file>` with the
   anchor line returns `1`.
2. **After the edit**, on the flattened file so that wrapping cannot hide a
   mismatch — `tr -d '\r' < <file> | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"`
   with the passage flattened to single spaces: for a **replacement**, the
   new passage returns `1` and the old passage returns `0`; for an
   **insertion**, the new passage returns `1` and the anchor still returns
   `1`, and step 3 carries the "nothing else changed" burden, because the
   old text is still there by design (for "When the plan lands" step 1 it is
   a prefix of the new).
3. **The diff is exactly the passages**:
   `git diff "$(git merge-base main HEAD)" -- <file>` (the working tree
   against the merge base) shows the passages written so far and nothing
   else. The hunk count
   `git diff "$(git merge-base main HEAD)" -- <file> | grep -c '^@@'` is a
   task-time check, not an invariant: two passages separated by six or fewer
   unchanged lines coalesce into one hunk (three lines of context on each
   side; measured, five and six give one hunk and seven give two), which
   none of this plan's do, so the task states the count it expects and a
   reviewer reads the hunks.
4. **Lint the changed paths by name**, every hook `Passed` or `Skipped`.
5. **The frontmatter hook** passes on `SKILL.md` in Task 4, and its
   `description:` value contains no colon-space.
6. **README drift reviewed** in Task 4, recorded in the task.
7. **Commit by explicit path with the trailer**, confirmed by
   `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'` returning `1`.

At every boundary, re-run the whole set of task-time checks of the batch. In
batch B, Task 7 runs checks 1 to 8 of `docs/notes/tanto-consistency-checks.md`
as written and records the output, and check 9's whitespace and final-newline
sweep; the extracted-tree lint of check 9 is not run, for the reason Task 6
writes into the note. The expected outputs in the note are unchanged by this
plan — no passage above adds or removes a string a check counts, which the
spec review confirmed string by string; Sekkei records the baseline by
running the checks at plan review on the pre-edit tree, and Task 7's
post-edit run is what shows the invariance. Task 7 also lints every path the
plan touched, by name, and proves every commit on the branch carries the
trailer.

## Out of scope

The repo-root `README.md`; superpowers and `shoroku`; the contents of
`tanto.json`; `roles/jisso.md` and `roles/kaiseki.md`; the topic and plan
basename unification (deferred item 1); a count threshold for the handover
(issue-40ed); any change to `docs/design/`, `docs/decisions/`,
`docs/requirements/`, or `docs/issues/` by a plan task — those are T1 and T2.

## Answers to the spec inputs

| Input | Answer |
| --- | --- |
| I-1 the scope, from the human's direction | Adopted, with one deviation from Kanri's note. The three issues in R-1's order; two batches (R-2); the boundary from which a replacement is safe is named and is the batch A boundary (R-3); the three issues resolve at T2; the optional S-73 sentence is in, since it fits batch A. The deviation: the note expected "the extraction-and-diff method plus check 9 apply as before"; this design replaces whole-file blocks with passages, the extracted tree with a per-file merge-base diff, and drops check 9's extracted-tree lint (see "The note"), so that a 580-line file is not transcribed for seven passages. |
| I-2 Kanri's check of the draft passages | Adopted in full: "one to three words"; the conditional link premise and the corrected creation clause in rule 11; the final-boundary case in Sekkei's convention; the idle-subscription clause folded into the Timing paragraph without lengthening it. Every other passage as Kanri accepted it. |

## Deferred items

Filed as an issue at T1:

1. **The topic is the plan basename.** Make the topic word `<date>-<slug>`
   with the date of the topic's opening, name the spec `<topic>-design.md`
   and the plan `<topic>.md`, so that the topic directory and the plan's
   workspace are one directory and the ledger never moves; the branch takes
   the slug alone. Touches `SKILL.md` (the artifacts table, the ledger-move
   paragraph, the exit file locations), `roles/kanri.md` (step 5, When the
   plan lands), `roles/sekkei.md` (Where your files go), `templates/kanri.md`,
   `templates/roster.md`, and the note. Raised by the human in this dialogue;
   not made here for the reasons in "Kanri derives the topic word".

## Shoroku candidates from this spec work

For Kanri's `S-n` table:

- decision, **escalated**: a plan that edits this skill's own files runs on
  the skill it is editing, with the authority for the run's sessions in the
  constraints, the orders, and the prompts, and a named boundary for role
  starts and replacements — the rule chosen over a copy of the skill, on the
  measured instance and the two costs of the copy ("Rejected" under
  issue-4ac3). decision-de63's consequence bullet anticipates it.
- design-4807: the Handover section's wait, from a fact of one run to the
  rule; the "Kanri's loop" Start paragraph, from asking for a topic to
  deriving it, with the five places the word reaches; the Skill layout
  paragraph on the link, with rule 11's consequence, and its count "ten
  rules" becoming eleven; "Plan conventions under tanto", the boundary
  convention and the passage-level alternative with its alignment check; a
  set under "Where the delivered skill differs" for this design, only if the
  fix wave leaves a difference.
- issues: f801, c7e1, and 4ac3 move to `docs/issues/resolved/` at T2, and
  c7e1's body is corrected from "three places" to five at the move;
  deferred item 1 is filed at T1.
- issue, from the spec review: `.superpowers/sdd/` holds an unrelated run's
  litter at its root — a `progress.md` from a July run, a
  `final-fixes-report.md`, five `review-*.diff` files, eight `task-N-*.md`
  files — next to the roster, and no role's procedure sweeps the root; a
  cold Kanri told the SDD ledger is `<plan-basename>/progress.md` can misread
  the stale root-level one. Kanri classifies: an issue, or a between-plans
  cleanup the human decides.
- decision-2f36, from the spec review: the hotfix lane's exclusion of
  plan-listed files is reasoned from whole-file blocks, and a passage plan
  keeps the rule on a different reason (fixed inputs). Whether a passage plan
  may reopen the lane for untouched passages is a question for a later ADR
  or an amendment; Kanri classifies.
- report: the run's record, from the conductor ledger, if Kanri judges a
  third dogfood report worth freezing; the previous two runs each had one.
- facts, for the deferred issue's body and for the plan: the topic word
  reaches five places (the topic directory, the spec and plan names, the
  plan basename and so the workspace, the branch, the roster's Events); in
  the previous run the topic directory and the workspace differed only by
  the date prefix, and at plan close the workspace was deleted with the
  moved ledger inside it while the topic directory stayed — an asymmetry
  that argues for deferred item 1 more strongly than their coexistence did;
  `roles/kanri.md`, `roles/sekkei.md`, and the consistency note are checked
  out CRLF and `SKILL.md`, `README.md`, and the templates LF, a split nothing
  under `docs/` records and every passage-level plan needs.
- observation about the process: the human had Kanri read the passages that
  rewrite Kanri's own file before they went into the spec, through a draft
  file and an `I-n`; the protocol has no such step. It caught one
  load-bearing error (the creation clause) and missed two in the same
  passage that the spec review then caught (rule 11 forbidding Kanri's own
  handover, F-1; the Kaiseki clause stated absolutely, F-7): the role checked
  the clause it was asked about and did not re-derive the rule against its
  own lifecycle obligations. The candidate convention for `roles/sekkei.md`
  is therefore narrower — a passage that rewrites another role's procedure
  goes to that role's session, when live, with the question "which of your
  obligations does this touch", before the spec review rather than instead
  of it.
- rejected alternatives with their reasons, each recorded above: a bounded
  wait (no signal bounds it); a date prefix on the topic word (double dates,
  or the deferred unification); the skill copy (no dogfood, a human re-link
  step, the rule suffices); a successor Kanri waiting for the safe boundary
  (a compacted Kanri held for batches); whole-file blocks (a 580-line
  transcription for seven passages).
