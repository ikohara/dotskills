# Design: tanto-sweep-2 — twenty-seven role-file inconsistencies in the passage-check form, and the shoroku check brief's full form

Written 2026-09-14 by Sekkei `dotskills-50 [75e6de]` as a draft at
`.tanto/tanto-sweep-2/spec-draft.md`, because `tanto-context-ceiling` holds
the shared checkout (its ledger R-1). The Keikaku created after that topic
merges commits this text unchanged at
`docs/superpowers/specs/2026-09-14-tanto-sweep-2-design.md` and cuts the
branch `tanto-sweep-2` from `main` before that commit. Nothing here is edited
or committed before the merge.

The topic is the second sweep of the `tanto` skill's prose: the first
(`docs/superpowers/specs/2026-09-10-tanto-sweep-design.md`) built the
instrument, `scripts/passage-check.js`, and fixed eleven issues in its block
grammar; this one fixes twenty-seven more in the same form and lands the one
feature the human asked for in the 2026-09-14 Kikaku window, the shoroku check
brief's full form (issue-c17a, with issue-e916's heading contract) — twenty-nine
issues closed in all. The scope was set by Kikaku's two decision
files of 2026-09-14 (`.tanto/kikaku/2026-09-14-tanto-small-items-and-next-topic.md`
item 6 and `.tanto/kikaku/2026-09-14-shoroku-check-brief-and-topic-order.md`
item 6), narrowed in the spec dialogue (`.tanto/tanto-sweep-2/dialogue.md`,
Q1 to Q4), and enumerated by two read-only surveys the dialogue names
(`.tanto/tanto-sweep-2/issue-survey.md`, `.tanto/tanto-sweep-2/fix-notes.md`).

Every change below is a passage: an old text the plan quotes exactly and a
new text that replaces it, an insertion anchored on a quoted line, or a new
file. Old and new texts sit in fenced `text` blocks, as the first sweep's
spec wrote them, so that a quote holds backticks and placeholders without
ambiguity; a block whose old text is wrapped in the file is quoted as the
file wraps it where this spec read it, and the plan's author re-quotes it
from the merged tree in every case (What the plan must contain). The plan
carries each passage once with a citable id, checks itself with
`passage-check.js`, and verifies each boundary with `diff`. This spec gives
the old text from today's tree, or from the `tanto-context-ceiling` plan's
own replacement block where that plan rewrites the site first (section 9).

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them
whole. Each names the dialogue question that settled it and the requirement
bullet of req-04f5 it serves, or says that none does.

1. **The scope is the role-file inconsistencies and issue-c17a** (Q1, A over
   B the held-edits marker, C the role-file diet, D both). The marker of
   issue-3d81 is deferred by `tanto-context-ceiling`'s R-11 "if the rule
   proves insufficient", and no run since the 2026-09-14 hotfix has shown it
   insufficient; the diet was deferred by `tanto-context-ceiling`'s Fixed
   input 7 and rewrites more than a passage sweep can quote. Both are named
   in Deferred items. Serves no bullet directly.
2. **The three kin that are not wording fixes are out** (Q2, A over B, C, D).
   issue-d0c9 is a `passage-check.js` feature and goes to
   `passage-check-hardening`; issue-e047 edits `.markdownlint-cli2.yaml`,
   which `AGENTS.md` reserves for explicit human approval and a lane of its
   own; issue-6a29 depends on the open issue-cae3. Serves no bullet.
3. **Rule 9's cap is one** (Q3, A over B keeping two with a per-topic pause
   and C dropping the number): "at most one top-family session active at
   once, Kikaku excepted as human-paced", with the Sekkei-pauses-while-Kaiseki
   rule kept as its consequence, and a second one under concurrent topics a
   Kanri ruling recorded as `R-n`. Serves "A run is affordable to keep
   running".
4. **Tasks are cut by the kind of inconsistency, a cross-file pair whose two
   halves must agree byte for byte is one task, and issue-c17a is a batch of
   its own, the last but one** (Q4, A over B by file and C c17a first). The
   first sweep's invariant is kept: the tree is self-consistent at every
   boundary beyond what rule 11 covers.
5. **The check brief's shape is Kikaku's 2026-09-14 item 3** (fixed input of
   the topic, not a dialogue question): the `shoroku` recommender writes it in
   the same dispatch as the recommendation, from a new template
   `templates/shoroku-brief.md`, in the chat's language; Kanri checks its form
   by `grep` and pastes it verbatim; no `brief.write` seat is used, because a
   `brief.write` dispatch on fable measured 115,120 subagent tokens and 262 s
   for the same day's spec brief, and the recommender already holds every
   item. Serves "The human reviews through a brief of the judgment points"
   and "Escalated wording reaches the human in the chat's language too".
6. **The baseline is the tree after `tanto-context-ceiling` merges** (Kanri's
   orders line and its confirmation of 2026-09-14). Six sites that plan
   rewrites first are quoted from its own blocks and listed in section 9;
   the plan's author re-greps every old text on the merged tree. Serves "State
   lives in files, not in sessions".
7. **This is a draft** (`tanto-sweep-2` ledger R-1): no branch, no commit,
   until the Keikaku created after the merge commits it at its final path.
8. **Rule 11 applies**, and the boundary from which a role may be started or
   replaced is the final one (section 10).
9. **Seven issues already landed or superseded, and one that
   `tanto-context-ceiling` itself fixes, are not tasks**: issue-2872,
   issue-5a17, issue-2d84, issue-5e47, issue-ac9d, issue-3c7a, issue-2e52
   (measured by the survey against today's tree) and issue-19d4 (that plan's
   Tasks 11 to 13). They are listed under "Issues already closed by earlier
   work" for T1 to move to `resolved/`; the spec reviewer re-checks the two
   "largely landed" ones, issue-3c7a and issue-2e52, and a sub-item still
   open joins section 6 as a passage.
10. **Every drift this sweep fixes gets a check in
    `docs/notes/tanto-consistency-checks.md`** where a `grep` can state it,
    and a lesson entry where it cannot (section 8). Serves "State lives in
    files, not in sessions".
11. **`skills/shoroku/SKILL.md` is edited, and req-04f5's "Composes without
    modifying" bullet is amended at T1 to say so** (Q5, A over B moving the
    text to `tanto`'s side and C a note on `shoroku`'s side only; raised by
    the spec review's F-3). The bullet names `shoroku` among the skills used
    as they are; `shoroku`'s recommend/apply section was written for `tanto`
    and edited with it twice before this spec, so the requirement and the
    practice were already apart. The third ADR records the amendment.
    Changes the bullet; serves "Docs are kept current as part of the flow".

## Measured while designing

Two facts the spec relies on, taken 2026-09-14 in this session.

- **The `unsure` read is already empty.** The two recommendations written
  that day, `.tanto/t0-recommendation.md` and
  `.tanto/exit-kanri-2026-09-14-dotskills-3b-recommendation.md`, both head
  their groups `## Recommended adopt`, `## Recommended reject`, and
  `## Unsure`; `skills/shoroku/SKILL.md` line 91 states the contract in
  lowercase; and

  ```bash
  node "$TANTO/scripts/passage-check.js" sections --file .tanto/t0-recommendation.md unsure
  node "$TANTO/scripts/passage-check.js" sections --file .tanto/t0-recommendation.md Unsure
  ```

  prints `no section unsure` for the first and the group for the second.
  Kanri's Exit shoroku step 3 and Shoroku step 3 read the `unsure` group by
  `sections`, so both read nothing today. This is the failure issue-e916
  predicted, one fix wave later.
- **The recommender already writes one `###` heading per item**, in two
  spellings: `### Item 1 — <title>` in the exit recommendation and
  `### A1 — <title>` / `### R1 — <title>` / `### U1 — <title>` in the T0
  one. The check brief's pointer needs exactly that: a heading per item that
  `grep -c '^### '` can count.

## 1. The shoroku check brief's full form (issue-c17a, issue-e916)

### 1.1 What the human sees at every shoroku stage

Today, at step 3 of every stage — T0, T1, T2, and each exit — Kanri reads the
whole recommendation once and renders its items as a numbered list in the
chat's language in its own message (the interim form of the 2026-09-14 hotfix,
`tanto-context-ceiling` R-12). After this design Kanri reads nothing of the
recommendation's prose: the recommender writes a second file beside it, the
**check brief**, already in the chat's language, and Kanri checks its form
by `grep`, then pastes it verbatim with the two paths and the three counts.
The human answers as the `shoroku` skill already parses, and the direction
file and the `S-n` rows follow as today.

### 1.2 `skills/tanto/templates/shoroku-brief.md` — a new file

The English source the recommender renders, in the shape of
`templates/review-brief.md`: every part in the chat's language except the
form markers, which stay exactly as written. The file, in full, is the plan's
to create; its parts are:

- The title line, `# Shoroku check brief — <stage> — <topic or Kanri's name>`.
- A `Document:` line: the recommendation's path, the stage word, the date,
  the model family, and the language rendered into.
- `## How to answer` — a form marker, kept in English — whose body says, in the
  chat's language: answer with `OK` for "as recommended"; with the numbers
  that go the other way (`2 と 5 だけ`, `3 はやめて`); with an edit
  (`5 の severity は high で`); an item not mentioned goes as recommended;
  the answer is what Kanri writes into `<stage>-direction.md`.
- Three group headings, form markers kept in English and spelled exactly as
  the recommendation's: `## Recommended adopt`, `## Recommended reject`,
  `## Unsure`. Each group holds one line per item of that group, in the
  recommendation's order, in this shape:

  ```text
  <n>. [adopt | reject | unsure] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's ### heading, verbatim>
  ```

  The tag word, the `<n>.` number, and `See:` are form markers. An `unsure`
  line adds, after the reason, the question the recommender could not settle,
  one clause, so that an item "could not be read as written" reaches the human
  and the session in the same line Kanri reads today from `sections`.
- No section for anything else: the brief selects and renders, it does not
  analyze anew, and the recommendation stays the file the apply reads.

An empty group keeps its heading and one rendered line, `none`, so the form
check below counts three group headings at every stage.

### 1.3 `skills/shoroku/SKILL.md` — three passages in recommend mode

Under "Recommend and apply", the **Recommend mode** paragraph changes in
three places.

**The group headings' spelling** — capitalized because that is what the
recommender writes unprompted (two of two on 2026-09-14) and what is on disk;
every `tanto` reader is changed to the same spelling in 1.5, and section 8
pins the pairing:

```text
text — `## recommended adopt`, `## recommended reject`, `## unsure` —
```

→

```text
text — `## Recommended adopt`, `## Recommended reject`, `## Unsure` —
```

**One `###` heading per item.** After the clause `each item quoted in full
from its source so that the` ... `file stands alone as the apply's input,`
the sentence gains, as the plan's author places it inside the existing
sentence:

```text
each item under its own `###` heading, `### <n> — <title>`, `<n>` being the item's number in the proposal — unique across the file, never restarted per group; where the source is not a numbered proposal, as at T1, a running number in the order the items are written — so that a reader can point at an item by its heading and the human's answer names the item by the number the proposal gave it,
```

The two spellings on disk today collapse to one, and Kanri's check (1.4)
relies on the uniqueness this states.

**The mode's inputs.** The paragraph's opening sentence names two of the
inputs Kanri's dispatch passes (issue-4b91's first half):

```text
**Recommend mode.** Invoked with a source — a file, or a file and the names
of the sections to read — and an output path. Run the workflow up to the
```

→

```text
**Recommend mode.** Invoked with a source — a file, or a file and the names
of the sections to read — an output path, and a baseline, the `docs/` tree an
item's destination and reason are judged against; and, when the caller wants
the check brief, a brief path, a template, and a chat language. Run the
workflow up to the
```

**The second output.** After the paragraph's last sentence, quoted here as it
sits in the file,

```text
translation in the chat's language. Do not wait for `Direction?`, and write
nothing under `docs/`.
```

the paragraph gains:

```text
When the caller also names a brief path, a template, and a chat language,
write the check brief from that template at that path, rendered in that
language, in the same run and from the same judgment: one line per item under
the same three headings, each ending in `See:` and the item's `###` heading
verbatim. The brief is the second and last file this mode writes.
```

The apply-mode paragraph is unchanged: it reads the recommendation and the
direction, never the brief. The "Composes without modifying" bullet of
req-04f5 names `shoroku` among the skills used as they are, and this section
and section 7 edit `skills/shoroku/SKILL.md`; the human settled it at Q5
(Fixed input 11): the bullet is amended at T1 by the third ADR below, since
`shoroku`'s recommend/apply section exists for `tanto`'s calls and has been
edited with `tanto` twice already.

### 1.4 `skills/tanto/roles/kanri.md` — the check step and the exit's step 3

**"The four steps", step 2**, gains the dispatch's three new inputs. After
its last sentence — the one ending `translation in the chat's language.` —
the step adds:

```text
Name in the same dispatch the brief path — `.tanto/<topic>/<stage>-brief.md`,
or `.tanto/<stage>-brief.md` for T0 and your own exit — the template
`templates/shoroku-brief.md` in the skill directory, and the chat's language;
the recommender writes both files in one run.
```

**Step 3, "Check"**, is replaced whole. The old text is the step as the
2026-09-14 hotfix left it, from `3. **Check.** Read the whole recommendation
once` through `and answers by exception.`, quoted by the plan from the tree.
The new text:

```text
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `4` and the
   four headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended reject`, `## Unsure`, in that order; every `### ` heading
   of the recommendation appears exactly once in the brief after `See: `, and
   the brief names no heading the recommendation lacks — count both with
   `grep -c '^### '` on the recommendation and `grep -cF 'See: <heading>'`
   on the brief, one line per heading. On a failure dispatch the recommender
   once more, naming what failed; on a second failure paste the brief as it
   stands and tell the human in one line what is wrong with it. Then give the
   human, in one message: the recommendation's path, the brief's path, the
   three counts, and the brief's text verbatim below them. The human answers
   as the `shoroku` skill already parses — `OK` for "as recommended", or the
   numbers that go the other way, or an edit — and you write
   `<stage>-direction.md` beside the recommendation, item by item, with the
   `S-n` rows in the ledger: Stage the stage word, Adopted from the human's
   answer. No item is escalated apart from the rest and none is decided by
   you alone; the human sees the whole list, grouped, and answers by
   exception.
```

**"Exit shoroku", step 3**, changes its first two sentences:

```text
3. When the recommendation is on disk, read its `unsure` group with
   `sections`. An item there saying the candidate could not be read as written
   is one question back to the session, one line, answered by a rewrite of the
   proposal. Otherwise ask the human, as a numbered list, to delete the
   session.
```

→

```text
3. When the recommendation and its brief are on disk, read the brief's
   `## Unsure` group with `sections`. A line there carrying a "could not be
   read as written" question is one question back to the session, one line,
   answered by a rewrite of the proposal. Otherwise ask the human, as a
   numbered list, to delete the session.
```

The parenthesis of today's step 3 on the `unsure` read goes with the step's
replacement; the brief's `unsure` line carries the question (1.2).

### 1.5 The spelling `Unsure` at every `tanto` reader

Every `tanto` file that names the three groups names them as the headings are
spelled, so that a reader who copies the word into `sections` gets the group.
The `sections` subcommand matches heading text exactly and is not changed
(Fixed input 2). Four sites carry the phrase; in each the old text is

```text
recommended adopt, recommended reject, unsure
```

and the new text is

```text
Recommended adopt, Recommended reject, Unsure
```

— `SKILL.md`'s "Session exit" step 2 (`in three groups — recommended adopt,
recommended reject, unsure —`, on one line), `SKILL.md`'s Artifacts row for
the recommendation (the same phrase on one line), `roles/kanri.md`'s step 2
(wrapped in the file after `recommended`, so the plan quotes its two lines),
and `templates/kanri.md`'s Shoroku candidates paragraph
(`recommended adopt, recommended reject, unsure;`). The plan quotes each
site's lines as the file wraps them.

### 1.6 `skills/tanto/SKILL.md` — "Session exit", the Artifacts row, and the template count

**"Session exit" step 2** gains, after its last sentence (`each with its
destination and its one-line reason.`):

```text
The same dispatch names the brief path, `<stage>-brief.md` beside the
recommendation, the template `templates/shoroku-brief.md`, and the chat's
language; the recommender writes both files in one run.
```

**"Session exit" step 3** is replaced whole:

```text
3. **Check.** Kanri reads the whole recommendation once and gives the human
   the path, the three counts, and under them the recommendation's items as a
   numbered list in the chat's language, grouped as the file groups them —
   one line per item: its number, its group, its destination, a one-sentence
   rendering of the candidate, and the one-line reason; the human answers by
   exception; Kanri writes `<stage>-direction.md` beside the recommendation,
   item by item, with the `S-n` rows in the conductor ledger.
```

→

```text
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading of the recommendation
   appearing exactly once after `See:` — dispatches the recommender once more
   on a failure and pastes the brief as it stands on a second, then gives the
   human both paths, the three counts, and the brief's text verbatim; the
   human answers by exception; Kanri writes `<stage>-direction.md` beside the
   recommendation, item by item, with the `S-n` rows in the conductor ledger.
```

**The Artifacts table** gains one row after the recommendation's:

```text
| `.tanto/<topic>/<stage>-brief.md`, or `.tanto/<stage>-brief.md` for T0 and Kanri's own exit | the `shoroku` recommender, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` for `## Unsure`; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

**The template count.** `Thirteen of them:` becomes `Fourteen of them:`, and
the list that follows gains `templates/shoroku-brief.md` after
`templates/review-brief.md`. The count is one of the enumerations section 3
checks, and it lands in the task that creates the template (D1).

**The exit's `unsure` read.** "Session exit" also carries the contract's copy
of Kanri's Exit shoroku step 3, in one wrapped sentence:

```text
dispatches the recommender at once. When the recommendation is on
disk, Kanri reads its `unsure` group by `sections`: an item there saying the
candidate could not be read as written is one question back to the session,
one line, answered by a rewrite of the proposal; otherwise Kanri asks the
human, as a numbered list, to delete the session. The session idles through
```

→

```text
dispatches the recommender at once. When the recommendation and its brief
are on disk, Kanri reads the brief's `## Unsure` group by `sections`: a line
there carrying a "could not be read as written" question is one question
back to the session, one line, answered by a rewrite of the proposal;
otherwise Kanri asks the human, as a numbered list, to delete the session.
The session idles through
```

It lands in the same task as 1.4's Exit shoroku step 3, and check 18 counts
the old sentence's "reads its unsure group" phrase (with the word in
backticks, as the file has it) to zero.

### 1.7 The READMEs

`skills/tanto/README.md` and `skills/shoroku/README.md` each get a drift
review in the task that lands 1.3 and 1.6: the tanto README's template list
gains `shoroku-brief.md`, and the shoroku README's recommend sentence says the
recommender also writes the check brief when asked. What else drifts is the
reviewer's to find and the task's to fix.

## 2. `roles/kanri.md`: the commit window, the handover file, and Timing (issue-7ba4, issue-f5d8, issue-c583, issue-caba)

Four disagreements inside or beside one cluster of Kanri's batch loop. Two of
the sites are rewritten by `tanto-context-ceiling` first (section 9); the
others are today's text.

### 2.1 The exit shoroku's slot is (a), and the delete request is early (issue-7ba4)

The design intent, four sites to two: Kanri's own exit shoroku is applied by
the apply subagent in **slot (a)** of the commit window, like every other
stage's, and the delete request for an exiting session goes out as soon as
the recommendation is on disk, as "Exit shoroku" step 3 already says.

**Step 7 (b)** loses its exit clause:

```text
   been deleted; it waits for nothing. (b) Your
   own edits — the hotfix, the issues from step 4, and your own exit shoroku
   when a handover is due — each committed by you in its turn, or handed to a
```

→

```text
   been deleted; it waits for nothing. (b) Your
   own edits — the hotfix and the issues from step 4 — each committed by you
   in its turn, or handed to a
```

The sentence at the end of step 7, `your exit shoroku was step 6's proposal
and slot (a)'s commit`, is already right and stays.

**"The handover, in a plan and between plans"**:

```text
   proposal and recommendation and step 7's slot (b) apply, already done when
```

→

```text
   proposal and recommendation and step 7's slot (a) apply, already done when
```

**"The hotfix lane"** — `the edit and the commit happen in slot (b) of step
7's commit window` — is right as it stands: the hotfix is Kanri's own edit,
slot (b). It is **not** changed; issue-7ba4 counts it among the wrong sites,
and the plan's block for this issue says so in its rationale.

**Step 6's last sentence**, on the post-merge text of `tanto-context-ceiling`
P9.1:

```text
Delete requests wait for step 7.
```

→

```text
A delete request goes out as soon as that session's recommendation and brief
are on disk ("Exit shoroku", step 3); the apply waits for step 7.
```

### 2.2 The handover template carries the unanswered mark under Live peers (issue-f5d8)

The role file, on its post-merge text (P9.3 and P13.6), says Live peers
"marks the ones whose last line you had not answered" and is right; the
template puts that mark under In flight. The template moves. In
`templates/kanri-handover.md`, the In flight bullet

```text
- Peers whose last line this session did not answer — <name> [<ref>] — <the
  line, one per line, or "none">; each re-sends it to the successor's
  `kanri-address:`
```

is deleted, and the Live peers bullet line

```text
- <role> — <topic> — <name> [<ref>] — <what that session is waiting for>
```

→

```text
- <role> — <topic> — <name> [<ref>] — <what that session is waiting for> —
  <"answered", or the last line it sent that this session did not answer;
  that peer re-sends it to the successor's `kanri-address:`>
```

The role file is not touched for this issue.

### 2.3 The third shoroku dispatch is named, and the naming rule covers a dotless kind (issue-c583)

**Step 7 (a)**, matching steps 2 and 4 of "The four steps":

```text
   is written, dispatch the `shoroku` kind in apply mode with the
```

→

```text
   is written, dispatch `subagent_type: tanto-shoroku` in apply mode with the
```

**`SKILL.md`, "The expected-model config"**, the sentence ending the
paragraph that begins `Then read your own system prompt's list`:

```text
dispatches without them; from then on a dispatch names its kind as
`subagent_type: tanto-<object>-<act>`.
```

→

```text
dispatches without them; from then on a dispatch names its kind as
`subagent_type: tanto-<object>-<act>` — or `tanto-<kind>` for a kind with no
dot in its name, `tanto-shoroku` and `tanto-default`.
```

The file-naming rule above it ("the kind's name with its `.` turned into a
`-`") already yields those names and is unchanged.

### 2.4 Timing governs the automatic signals; the human's word is obeyed at the next boundary of any topic (issue-caba)

On the post-merge Timing paragraph (P8.4), after the sentence

```text
Another topic's spec or plan stage supplies no
boundary of this kind and holds no handover of yours.
```

one sentence is inserted:

```text
That list governs the signals you check for yourself — the tenure, a
compaction, the ceiling; the human's word, signal 2, is obeyed at whichever
boundary comes next, of any topic, and is never deferred.
```

"The trigger" is unchanged; design-4807's "the human's word, which always
overrides, at any boundary" is what the clause restates.

## 3. Enumerations and copied strings (issue-2e19, issue-8c74, issue-e18b, issue-62e7, issue-1c9a, issue-5a2d)

The same shape six times: a list or a string spelled at one site went stale
at a second, unquoted one. Each is one passage; section 8 adds the check that
makes the next drift loud.

**The five statuses** (issue-e18b, issue-2e19). `SKILL.md`'s Artifacts row for
`roster-archive.md` and `roles/kanri.md`'s Delete row on its post-merge text
(P13.5; the plural "fixed rows" is already that plan's Task 13) each carry

```text
dead, replaced, and refused rows
```

→

```text
dead, replaced, refused, and cleared rows
```

**The five stage examples** (issue-8c74). `templates/kanri.md`:

```text
`exit-jisso-B`, `exit-sekkei`, `exit-kaiseki-1`, and
```

→

```text
`exit-jisso-B`, `exit-sekkei`, `exit-keikaku`, `exit-kaiseki-1`, and
```

**`continue:`** (issue-62e7). `roles/kanri.md`'s Limits step 2, as `SKILL.md`
spells it:

```text
   `continue: <the dispatch the pause named> — same model`. The role
```

→

```text
   `continue: <dispatch> — same model`. The role
```

**The definition name without `.md`** (issue-1c9a). `templates/kanri-handover.md`'s
Models bullet and `templates/batch-prompt.md`'s Models bullet each carry

```text
`task.implement` (sonnet, `tanto-task-implement.md`)
```

→

```text
`task.implement` (sonnet, `subagent_type: tanto-task-implement`)
```

the string a dispatch passes; the file-naming rule stays stated once, in
`SKILL.md`. The same bullets' `task.review-spec` and `task.review-quality`
clauses are read by the plan's author for the same form and changed in the
same block if they carry it.

**Jisso's opening line** (issue-5a2d). `roles/jisso.md` line 5, matching
`SKILL.md`'s roles table and the file's own T2 section:

```text
commits, and the T2 shoroku proposal and write-out.
```

→

```text
commits, and the T2 shoroku proposal.
```

**The template count**, 1.6: `Thirteen of them:` → `Fourteen of them:`,
landed in the c17a batch and checked with the others.

## 4. The two new seats (issue-3a7c, issue-c30e, issue-f902, issue-8e51)

### 4.1 Kanri receives `slot-needed:` (issue-3a7c)

`roles/hosa.md` sends `slot-needed: <what> — <paths>` and idles for
`slot: now — commit and report` or `slot: at the next boundary`; nothing in
`roles/kanri.md` receives it. Step 7 (b) of the batch loop, after

```text
   ruling and the commit subject stay yours, and you verify the diff.
```

gains:

```text
   A `slot-needed: <what> — <paths>` from Hosa is answered the moment it
   arrives: `slot: now — commit and report` when no batch is in flight and the
   paths are not the in-flight plan's, `slot: at the next boundary` otherwise,
   the slot being this step at that boundary; Hosa's
   `committed <subject> — <reading>` is verified here like a chore's.
```

### 4.2 Hosa's standing grant is given at the handshake (issue-c30e)

"On a handshake" step 4:

```text
   - Kikaku gets your address and the open topics, if any. Hosa gets your
     address and one line, "tracked files only in a slot I give". You request
```

→

```text
   - Kikaku gets your address and the open topics, if any. Hosa gets your
     address, one line, "tracked files only in a slot I give", and its
     standing grant,
     `human-access: granted — the chores the human hands you in your window — until this session ends`.
     You request
```

"Human access" step 3 already says the grant is given "in the line you answer
its handshake with" and is unchanged.

### 4.3 Kikaku's write scope is what it says (issue-f902)

`roles/kikaku.md` says "You write only under `.tanto/kikaku/`" and then has
Kikaku create `.tanto/.gitignore` and `.tanto/.markdownlint-cli2.yaml`. The
narrow reading wins: Kikaku reads the roster's first row to shake hands, so
a Kanri has started in the repository before any Kikaku, and Kanri's Start
step 2 has written both files. "The output" section's first paragraph is
deleted:

```text
Make sure `.tanto/.gitignore` exists and holds `*`, and
`.tanto/.markdownlint-cli2.yaml` exists and holds `config:` with
`default: false` indented two spaces beneath it. Write each only when it is
absent and never overwrite either: the first keeps everything under
`.tanto/` untracked, the second keeps the editor's markdownlint quiet on
files the commit path never lints.
```

`SKILL.md`'s Artifacts row for the two files, which names Kanri, a standalone
Kaiseki, and a bug-report writer as their writers, is then right and is
unchanged.

### 4.4 Kikaku restates the model rule (issue-8e51)

`roles/kikaku.md` dispatches nothing today, and is the one role file with
no model sentence; on fable, an inherited model is the costliest. After the
paragraph

```text
You read the repository, `docs/`, and `.tanto/`. You write only under
`.tanto/kikaku/`, and never under `docs/`: what is settled here reaches a
requirement, a decision, or an issue through Kanri, not by your hand.
```

one paragraph is inserted:

```text
You dispatch nothing as a rule; a read you need, you make yourself. If you
ever dispatch — an ad-hoc search — the contract's rule applies unchanged:
`subagent_type: tanto-default` with the `model` `tanto.json` gives `default`,
never an omitted `model`, which would inherit this session's fable.
```

## 5. The review gates of `roles/sekkei.md` and `roles/keikaku.md` (issue-36c0, issue-5b8e, issue-5e9c, issue-bf75)

### 5.1 The spec reviewer's third input, and "before" made exact (issue-36c0)

`roles/sekkei.md`, Step 2, two passages, both sentences the issue gives:

```text
Before the review, a passage in the spec that rewrites another role's
procedure goes to that role's session for a check, when that session is live:
```

→

```text
Before the spec commit and before the reviewer is dispatched, a passage in the
spec that rewrites another role's procedure goes to that role's session for a
check, when that session is live:
```

and

```text
`subagent_type: tanto-spec-review` and its `model` together. Give it the spec
and the repo's `docs/decisions/` and `docs/requirements/`, ask it to check the
spec against them, and have it write its report to
```

→

```text
`subagent_type: tanto-spec-review` and its `model` together. Give it the spec,
the repo's `docs/decisions/` and `docs/requirements/`, and — as a third input
— the files the spec's per-file change list touches, with the question which
sentences in them the design contradicts that the spec's Old values list does
not name; ask it to check the spec against all three, and have it write its
report to
```

The second passage shares lines with 5.2's first; the plan lands the two in
one block.

### 5.2 A read-only seat that must write names its one file (issue-5b8e)

Three dispatches call a seat read-only and hand it a file to write. Each gains
the same form, "read files; write exactly one file, the output named here".

`roles/sekkei.md` Step 2:

```text
Dispatch a **read-only** reviewer on `spec.review`, naming
```

→

```text
Dispatch a reviewer on `spec.review` — read files; write exactly one file, the
report named below — naming
```

`roles/keikaku.md` Step 4 item 3:

```text
3. Dispatch a **read-only** reviewer on `plan.review`, naming
```

→

```text
3. Dispatch a reviewer on `plan.review` — read files; write exactly one file,
   the report named below — naming
```

`SKILL.md`, Messages, the review-brief bullet:

```text
  the **review brief** on `brief.write` — a read-only subagent that writes
```

→

```text
  the **review brief** on `brief.write` — a subagent that reads, and writes
  exactly one file,
```

Kanri's cold read names no "read-only" and is unchanged.

### 5.3 A decision reaches `dialogue.md` before it reaches any document (issue-5e9c)

The issue's paragraph, verbatim, is inserted in `roles/sekkei.md` Step 1
after the paragraph that ends

```text
protocol it is the one record of the human's own words.
```

The inserted paragraph:

```text
**A decision reaches `dialogue.md` before it reaches any document.** Write the
turn — the question you put, the human's answer verbatim, and your reading of
it — and only then edit the spec, the plan, or a block. The case that breaks
this is the decision that arrives **mid-turn**, in a message answering nothing
you asked: it has no question to file it under, so file it under the work it
interrupted, and give it a `D-n` of its own. A decision you acted on and did
not record is indistinguishable, to every later reader, from one you invented
— and the reader who finds it is a reviewer filing a scope finding against
your own document.
```

The same paragraph is inserted in `roles/keikaku.md` as a paragraph of its
own after the list whose `dialogue.md` bullet ends

```text
  T1's shoroku takes it as an input.
```

— the plan's author quotes the list's last line as the anchor. Keikaku keeps
a plan dialogue in the same file and is under the same rule.

### 5.4 The document under review holds still, and the review records what it read (issue-bf75)

Two sentences in each authoring role. In `roles/sekkei.md` they are a
paragraph of their own after the reviewer dispatch's paragraph in Step 2
(prose, so a paragraph fits):

```text
Between the reviewer's dispatch and its report, and between the brief writer's
dispatch and the human's answers, you do not edit the document; a change you
need waits for the answers and is a further commit, or a further edit to the
draft. The reviewer and the brief writer each record, in their file's first
lines, the document's `git hash-object <path>` at the moment they read it, so
that a line number in a finding has a fixed referent.
```

In `roles/keikaku.md`, Step 4 is a numbered list, so the same two sentences go
inside item 3, at its indentation, after its last line, which reads
"send Kanri one line with the report path.":

```text
   Between the reviewer's dispatch and its report, and between the brief
   writer's dispatch and the human's answers, you do not edit the plan; a
   change you need waits for the answers and is a further edit before the
   commit. The reviewer and the brief writer each record, in their file's
   first lines, the plan's `git hash-object <path>` at the moment they read
   it, so that a line number in a finding has a fixed referent.
```

The dispatch prompts name that hash line as part of the output, and
`templates/review-brief.md`'s `Document:` line gains a slot for it:

```text
Document: <path> — brief written <YYYY-MM-DD> on <model family> for the chat
```

→

```text
Document: <path> — hash <git hash-object of the document as read> — brief
written <YYYY-MM-DD> on <model family> for the chat
```

## 6. Dispatch and drafting conventions (issue-63b0, issue-c2d7, issue-9d17, issue-4d8a, issue-6f3d, issue-b673, issue-d604, issue-9627)

### 6.1 `SKILL.md`: a dispatch whose deliverable is a file (issue-63b0)

The paragraph whose bold opening says that every subagent dispatch names a
`model` gains, after its last sentence (`configured one.`), two sentences:

```text
A dispatch whose deliverable is a file names the path, says the agent writes
it in its own turn, and forbids the agent from dispatching agents of its own —
a subagent that fans out ends its turn with nothing written and a reply that
reads as progress. The dispatcher verifies the file, not the reply.
```

Stated once, here; every role reads this file, and the role files' dispatch
tables point at it.

### 6.2 `SKILL.md` rule 3: a project memory rule is not a role's authority (issue-c2d7)

```text
3. State in files, not in memory: the roster and the ledgers. Memory holds at
   most a pointer to them.
```

→

```text
3. State in files, not in memory: the roster and the ledgers. Memory holds at
   most a pointer to them. A role's authority is this file, its role file,
   Kanri's lines, and the batch prompts; a project memory rule that would add
   a dispatch or a document is put to Kanri as one line before it is acted
   on, since the same memory is loaded by every session in the repository.
```

### 6.3 `SKILL.md` rule 9: at most one (issue-d604, Fixed input 3)

```text
9. At most two top-family sessions active at once, Kikaku excepted as
   human-paced: Sekkei pauses while Kaiseki is active; Keikaku and Hosa, on
   the cheaper families, do not count.
```

→

```text
9. At most one top-family session active at once, Kikaku excepted as
   human-paced: Sekkei pauses while Kaiseki is active, which is that rule's
   whole content today; Keikaku and Hosa, on the cheaper families, do not
   count. A second one under concurrent topics is a Kanri ruling, recorded as
   `R-n`.
```

`roles/sekkei.md`'s restatement in its write-and-commit rule,

```text
- You pause entirely while Kaiseki is active. At most two top-family sessions
  are active at once, Kikaku excepted as human-paced; Keikaku and Hosa, on the
  cheaper families, do not count.
```

→

```text
- You pause entirely while Kaiseki is active. At most one top-family session
  is active at once, Kikaku excepted as human-paced; Keikaku and Hosa, on the
  cheaper families, do not count.
```

Three more restatements exist (the spec review's F-5), each a passage in the
same task as rule 9, so that the five sites say "one" at one boundary.

`roles/keikaku.md`, its write-and-commit rule:

```text
- You pause while Kaiseki is active. Your family is a cheap one, so you do not
  count toward the two top-family sessions rule 9 allows, but the checkout is
  shared and that is what the pause is for.
```

→

```text
- You pause while Kaiseki is active. Your family is a cheap one, so you do not
  count toward the one top-family session rule 9 allows, but the checkout is
  shared and that is what the pause is for.
```

`roles/kikaku.md`, its closing paragraph — the second sentence names a state
the cap of one makes impossible, and goes:

```text
You are on the top family and human-paced, and you are not counted: at most
two top-family sessions are active at once, with you excepted. The human
keeps this window quiet while Sekkei and Kaiseki are both active.
```

→

```text
You are on the top family and human-paced, and you are not counted: at most
one top-family session is active at once, with you excepted.
```

`templates/kanri.md`, the paragraph under the Measurements table that says how
the peak row is filled — under a cap of one, the breach the row counts is a
second session, not a third:

```text
plan close from this ledger's Session events, where it writes one line each
time a third top-family session goes live; the second by counting those same
```

→

```text
plan close from this ledger's Session events, where it writes one line each
time a second top-family session goes live; the second by counting those same
```

Any further restatement the plan's `O` sweep finds — the needles are
`two top-family session` and `a third top-family session` — says "one" too.

### 6.4 Kanri lists the workspace root (issue-9d17)

Start step 2, after its last sentence

```text
   every run, and that is no longer your concern.
```

gains:

```text
   Then list `.tanto/` itself and report in your start line every entry that
   is none of these: `.gitignore`, `.markdownlint-cli2.yaml`, `roster.md`,
   `roster-archive.md`, `kanri-handover.md`, `inbox/`, `kikaku/`, `kaiseki/`,
   one directory per topic the roster or the archive names — open, or closed
   and kept under the Workspace section's retention rule — and your
   predecessors' `t0-*` and `exit-kanri-*` files; the human decides what to do
   with the rest, and an entry the human has once said to keep is listed
   under the ledger's Rulings and not reported again. Make the same listing
   at every plan close, in the close's own line.
```

Measured 2026-09-14 by Kanri (I-1): `.tanto/` holds four entries outside
that set today — `2026-09-12-cost-discussion.md`, `2026-09-12-tanto-workspace/`,
`tanto-workspace/`, and `tanto-cost/` — the last a closed topic's directory,
the other three older leftovers; the first listing will report the three.

### 6.5 Keikaku's drafting conventions (issue-4d8a, issue-6f3d)

`roles/keikaku.md` Step 3's bulleted list of what Keikaku adds to the plan
(the list beginning `- the **Global Constraints** section`) gains two bullets
at its end; the plan's author quotes the list's current last line as the
anchor:

```text
- a **named-mechanism** rule for the tasks: a task that introduces or changes
  a named mechanism — a slot letter, a grant clause, a status word, a section
  pointer — lists in its own text every other site in the same file, and in
  the files the plan touches, that names the same mechanism, so that its
  reviewer checks them together (issue-7ba4 and issue-c30e are what this
  catches);
- a **line-ending** rule for the tasks: a task that creates a Markdown file
  and later checks its line endings writes the restore —
  `git checkout -- <path>` after the commit, or the repository's equivalent —
  into the task's own steps, not only into the stop condition, because a
  created file lands `w/lf` on this host every time (measured five of five in
  the tanto-cost run).
```

Section 8 adds the first as a lesson entry in the consistency note; neither
is a `grep`.

### 6.6 Kanri tallies the top-family dispatches (issue-b673)

The ledger's fixed row "top-family one-shots per plan, counted by kind" has
no writer. `roles/kanri.md`, "The batch loop", step 6 on its post-merge text
(P9.1), after

```text
   Write the
   Measurements per-boundary entry from the two readings, and a Measurements
   deferrals entry for anything deferred here.
```

and before the sentence beginning `If a create request is due, make it,`,
gains:

```text
   Write a Session events line `dispatch: <kind> on <family>` for every
   dispatch since the last boundary whose kind `tanto.json` puts on the top
   family of the ladder — `fable` today, and the merged config decides, not
   the family a session happens to run on, so an `opus` `shoroku` dispatch
   does not count while a `fable` `plan.coldread` does: your own
   `plan.coldread` and `branch.review`, and the ones a peer's line implies —
   `review-ready:` is one `brief.write`, a plan-review path is one
   `plan.review`, a spec-review path is one `spec.review` if the config puts
   it there — and fill the one-shots row at the close by counting those lines
   by kind.
```

### 6.7 A pre-spec act closes when its result file exists (issue-9627)

`templates/kanri.md`'s Progress line, on its post-merge text (P10.2), gains
one more standing clause. Its end,

```text
until that handover or replacement runs or the plan closes>
```

→

```text
until that handover or replacement runs or the plan closes; and, for each
pre-spec act ruled before Sekkei's spec — a diagnosis, a dump analysis — the
clause `<act> — result: <path> (absent | present)`, rewritten to `present`
when the file lands and dropped once the spec cites it>
```

`roles/kanri.md` names the result path where it rules such an act; the
plan's author finds that sentence by `grep -n 'pre-spec' skills/tanto/roles/kanri.md`
and, if there is none, adds one sentence to the Rulings paragraph of "When
the plan lands" — an open point for Kanri, since the spec does not know the
site:

```text
A pre-spec act you rule — a diagnosis, a dump analysis, before Sekkei's spec —
names its result path in the ruling, and the ledger's Progress line carries
`<act> — result: <path> (absent | present)` until the spec cites the file.
```

## 7. `shoroku`'s baseline sentence (issue-4b91)

`skills/shoroku/SKILL.md`, "File source specifics":

```text
entries. Do **not** deduplicate against existing `docs/<type>/*.md` —
overlaps surface in the proposal and the user accepts or rejects per item.
```

→

```text
entries. Do **not** deduplicate against existing `docs/<type>/*.md` —
overlaps surface in the proposal and the user accepts or rejects per item; in
recommend mode the baseline a caller names is what an item's destination and
reason are judged against, never a filter that drops it.
```

`roles/kanri.md`'s step 2:

```text
   — with `docs/` as the baseline, and name the output:
```

→

```text
   — with `docs/` as the baseline for destinations and reasons, and name the
   output:
```

## 8. `docs/notes/tanto-consistency-checks.md`: the checks this sweep adds

The note is one numbered run of `## <n>. <title>` sections — checks 1 to 9,
lessons 10 to 15, checks 16 and 17 (the last added by
`tanto-context-ceiling`) — and its numbers are cited by plans, so nothing is
renumbered and nothing is inserted: the four entries below are appended at
the end as `## 18.` to `## 21.`, three checks and then the lesson. Every check
is a `grep` a plan can run at a boundary and the whole-branch reviewer can
re-run. The four structural counts the note keeps for its file layout move
too (8.5), in the task that creates the template.

### 8.1 `## 18. The recommendation's headings, on both sides`

```bash
grep -cF '`## Recommended adopt`, `## Recommended reject`, `## Unsure`' skills/shoroku/SKILL.md
grep -cF '## Recommended adopt' skills/tanto/templates/shoroku-brief.md
grep -cF '## Recommended reject' skills/tanto/templates/shoroku-brief.md
grep -cF '## Unsure' skills/tanto/templates/shoroku-brief.md
grep -cF 'Recommended adopt, Recommended reject, Unsure' skills/tanto/SKILL.md
grep -cF 'reject, Unsure —' skills/tanto/roles/kanri.md
grep -cF 'Recommended adopt, Recommended reject, Unsure' skills/tanto/templates/kanri.md
grep -rciF 'recommended adopt, recommended reject, unsure' skills/tanto/SKILL.md skills/tanto/templates/kanri.md skills/shoroku/SKILL.md
grep -ci 'reject, unsure —' skills/tanto/roles/kanri.md
grep -c 'reads its `unsure` group' skills/tanto/SKILL.md
```

Expected: `1 1 1 1 2 1 1`, then the two case-insensitive counts equal to the
case-sensitive ones above them (`3` and `1`) — a lowercase spelling anywhere
is the drift issue-e916 named — and `0`: the contract's lowercase read of
"Session exit" (1.6) is gone. `roles/kanri.md`'s phrase wraps after
`recommended`, so its check is on the second line's form, as check 6 pins a
wrapped line by its own text. The exact figures are the plan's to record when
it lands; this note carries what the plan measured.

### 8.2 `## 19. The check brief's form markers`

```bash
grep -c '^## How to answer$' skills/tanto/templates/shoroku-brief.md
grep -cF 'See:' skills/tanto/templates/shoroku-brief.md
grep -cF '[adopt | reject | unsure]' skills/tanto/templates/shoroku-brief.md
grep -cF 'templates/shoroku-brief.md' skills/tanto/SKILL.md
grep -cF 'templates/shoroku-brief.md' skills/tanto/roles/kanri.md
grep -cF 'shoroku-brief.md' skills/tanto/README.md
```

Expected: `1`, a non-zero count, `1`, then non-zero on the three citations —
the template exists, carries its markers, and is named where it is copied
from (check 3's rule for every other template).

### 8.3 `## 20. The enumerations the second sweep re-synchronized`

```bash
grep -c 'dead, replaced, refused, and cleared' skills/tanto/SKILL.md
grep -c 'dead, replaced, refused, and cleared' skills/tanto/roles/kanri.md
grep -rc 'dead, replaced, and refused' skills/tanto/
grep -cF '`exit-keikaku`' skills/tanto/templates/kanri.md
grep -cF '`exit-keikaku`' skills/tanto/SKILL.md
grep -rcF 'continue: <dispatch> — same model' skills/tanto/SKILL.md skills/tanto/roles/kanri.md
grep -rcF 'tanto-task-implement.md' skills/tanto/templates/
grep -cF 'Fourteen of them:' skills/tanto/SKILL.md
grep -rcF 'At most one top-family session' skills/tanto/SKILL.md skills/tanto/roles/sekkei.md
grep -rc 'two top-family session' skills/tanto/
grep -rcF 'a third top-family session' skills/tanto/
```

Expected: `1 1`, then `0` on every file of the old enumeration, `1 1`, `1 1`
for the `continue:` spelling, `0` on every template for the `.md` form, `1`,
`1 1`, then `0` on every file for the two spellings of the old cap (6.3 names
the five sites). The plan records the figures it measured, as check 18 says.

### 8.4 `## 21. A named mechanism is edited at every site that names it`

The text of section 6.5's first bullet, restated as the note's lessons are:
issue-7ba4 and issue-c30e each spanned tasks no single task's review could
catch, because the task that changed the mechanism did not list the other
sites; the convention in `roles/keikaku.md` Step 3 is the fix, and this
entry is why it exists. No `grep` states it. Numbered after the checks it
follows, as check 16's own note says the numbers are cited and never reused.

### 8.5 The structural counts, moved with the template

The note's preamble says it itself: "every plan that adds a template edits
four of them — this bullet, check 1's path list and its expected count, check
2's expected count, and check 3's map". Four passages, landed in the same
task as `templates/shoroku-brief.md`'s creation (D1), each on the note's
post-merge text, since `tanto-context-ceiling` adds two scripts and moves the
same counts first (section 9):

- The "Versions these checks assume" bullet `**Twenty-four skill files,
  thirteen of them templates**` — each count one higher than the merged note
  states (the file count, and the template count to fourteen).
- Check 1's `ls` list gains `skills/tanto/templates/shoroku-brief.md \` after
  the `review-brief.md` line, and its `Expected:` paragraph's file and
  template counts each go one higher.
- Check 2's `Expected:` count goes one higher, and its list of `ok` names
  gains `templates/shoroku-brief.md` in the list's order.
- Check 3's `MAP` gains the row
  `templates/shoroku-brief.md skills/tanto/roles/kanri.md` after the
  `kaiseki-brief.md` row; its `Expected:` paragraph's `ok` count goes one
  higher, and the tally "Eight of the twenty are Kanri's — seven templates
  Kanri copies itself" becomes nine and eight.

The plan quotes the merged note's numbers as old text and states each new
number; this spec states the increments, because the merged note's numbers
are not on disk yet.

## 9. Sites that depend on the merge

Six sites this design edits are rewritten first by
`docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md`, which is
committed and in flight but not merged. For each, the old text this spec
quotes is that plan's replacement block, named by its id, not today's tree;
the plan's author re-reads the block on the merged tree before drafting, and
a block that no longer reads as quoted is an open point to Kanri, not a
guess. The other sites are today's text, and the same re-grep covers them,
since that plan's own old-value sweep (its Task 16) may move a line.

| This spec's site | `tanto-context-ceiling` block | What this spec assumes of it |
| --- | --- | --- |
| 2.1 step 6's last sentence | P9.1 | ends `Delete requests wait for step 7.` |
| 2.2 the role file's Live peers sentence (unchanged here) | P9.3, P13.6 | says `marks the ones whose last line you had not answered` |
| 2.4 Timing | P8.4 | carries `Another topic's spec or plan stage supplies no boundary of this kind and holds no handover of yours.` |
| 3 the Delete row's archive sentence | P13.5 | reads `move the dead, replaced, and refused rows with their last readings` |
| 6.6 step 6's Measurements sentence | P9.1 | carries, mid-block, the sentence ending `and a Measurements deferrals entry for anything deferred here.`, followed by `If a create request is due, make it,` — 6.6's text goes between the two |
| 6.7 the Progress line | P10.2 | ends `kept until that handover or replacement runs or the plan closes>` |

Two more sites are near that plan's edits without being rewritten by them,
and the re-grep covers them: `SKILL.md`'s Artifacts table (its Task 5 edits
a different row) and `templates/kanri.md`'s Measurements rows (its Task 10
inserts rows above the one-shots row). And the note's four structural counts
(8.5) are moved by that plan first, for its two scripts; this spec states
increments, and the plan quotes the merged numbers.

## 10. The boundary, the batch cut, and rule 11

The files that change: `SKILL.md`; six role files (`kanri.md`, `sekkei.md`,
`keikaku.md`, `jisso.md`, `kikaku.md`, and `hosa.md` only if the plan's `O`
sweep finds a restatement there; `kaiseki.md` is untouched); four templates
(`kanri.md`, `kanri-handover.md`, `batch-prompt.md`, `review-brief.md`) and
one new one (`shoroku-brief.md`); the two READMEs; `skills/shoroku/SKILL.md`;
and `docs/notes/tanto-consistency-checks.md`. `passage-check.js`,
`reading.js`, their tests, and `tanto.json` do not change.

This plan edits the skill its sessions run on (decision-5c8e, rule 11): a
session started mid-plan reads whatever is on disk. The plan names in its
Global Constraints and its Batches section the authority sentence and the
boundary from which a role may be started or replaced. Because the check
brief's template, `shoroku`'s recommend mode, Kanri's check step, and the
contract's "Session exit" must agree, and because the enumerations of section
3 are counted across files, that boundary is the **final** one; Kanri's
handover proceeds when due and its successor takes the authority ruling from
the handover file. The run's own Kanri runs the shoroku stages that fall
before batch D lands in the interim form, and the stages after it — the exit
of Jisso, T2 — in the full form, which is how the dogfood measures the
feature on the run that ships it (Global Constraints say which stage switches).

The batch cut the plan is expected to make, three or four tasks each, cross-
file pairs in one task; the plan decides the exact cut and the review checks
that no cut leaves the tree inconsistent at its boundary beyond what rule 11
covers:

- **A — `SKILL.md` and the enumerations**: A1 rules 3 and 9 with the cap's
  four other sites, the dispatch paragraph's two sentences, the
  `tanto-<kind>` clause, and the "read-only" brief-writer bullet (6.1, 6.2,
  6.3 whole, 2.3's contract half, 5.2's contract half); A2 the enumeration
  sweep (section 3 without the template count: five passages across
  `SKILL.md`, `roles/kanri.md`, `roles/jisso.md`, two templates, and
  `templates/kanri.md`); A3 checks 20 and 21 in the note. The tree is
  consistent at this boundary: every byte-identical pair lands in one task.
- **B — `roles/kanri.md`**: B1 the commit window, the third shoroku dispatch,
  and Hosa's two lines (2.1, 2.3's role half, 4.1, 4.2); B2 Timing and the
  handover template's bullet (2.4, 2.2); B3 the root listing, the dispatch
  tally, and the Progress clause (6.4, 6.6, 6.7 with `templates/kanri.md`).
- **C — the authoring and thinking seats**: C1 `roles/sekkei.md` Steps 1 and
  2 (5.1, 5.2's Sekkei half, 5.3, 5.4 with `templates/review-brief.md`'s
  hash slot); C2 `roles/keikaku.md` (5.2's Keikaku half, 5.3, 5.4, 6.5);
  C3 `roles/kikaku.md` (4.3, 4.4) and `shoroku`'s baseline sentence with
  Kanri's (section 7).
- **D — the check brief**: D1 `templates/shoroku-brief.md`,
  `skills/shoroku/SKILL.md`, `SKILL.md`'s template count and list, and the
  note's four structural counts (1.2, 1.3, 1.6's count, 8.5); D2
  `roles/kanri.md`'s steps 2 and 3 and Exit shoroku step 3, `SKILL.md`'s
  "Session exit" whole — steps 2 and 3 and the exit's `unsure` sentence — and
  its Artifacts row, and the `Unsure` spelling at every reader (1.4, 1.5,
  1.6); D3 checks 18 and 19 in the note and both READMEs' drift review (1.7).
- **E — the sweep and the dogfood**: E1 the whole-tree old-value sweep and
  the `O` needles (Old values below), the note's checks 1 to 9 and 16 to 20
  re-run and their expected values recorded; E2 the dogfood report,
  `docs/reports/<date>-tanto-sweep-2-dogfood.md`, with the check brief as
  run at the first stage after batch D (the brief's form-check result, the
  human's answer, and the time the check step took against the interim
  form's), the count of issues closed, and the readings.

## Where each change lives

| File | Sections |
| --- | --- |
| `skills/tanto/SKILL.md` | 1.5, 1.6, 2.3, 3, 5.2, 6.1, 6.2, 6.3 |
| `skills/tanto/roles/kanri.md` | 1.4, 1.5, 2.1, 2.3, 2.4, 3, 4.1, 4.2, 6.4, 6.6, 6.7, 7 |
| `skills/tanto/roles/sekkei.md` | 5.1, 5.2, 5.3, 5.4, 6.3 |
| `skills/tanto/roles/keikaku.md` | 5.2, 5.3, 5.4, 6.3, 6.5 |
| `skills/tanto/roles/jisso.md` | 3 |
| `skills/tanto/roles/kikaku.md` | 4.3, 4.4, 6.3 |
| `skills/tanto/roles/hosa.md` | none by design; the `O` sweep only |
| `skills/tanto/templates/shoroku-brief.md` (new) | 1.2 |
| `skills/tanto/templates/kanri.md` | 1.5, 3, 6.3, 6.7 |
| `skills/tanto/templates/kanri-handover.md` | 2.2, 3 |
| `skills/tanto/templates/batch-prompt.md` | 3 |
| `skills/tanto/templates/review-brief.md` | 5.4 |
| `skills/tanto/README.md`, `skills/shoroku/README.md` | 1.7 |
| `skills/shoroku/SKILL.md` | 1.3, 7 |
| `docs/notes/tanto-consistency-checks.md` | 8.1 to 8.5 |
| `docs/reports/<date>-tanto-sweep-2-dogfood.md` (new) | 10, E2 |

## Old values this plan contradicts

The strings the whole-tree sweep (batch E) must find nowhere in
`skills/tanto/`, `skills/shoroku/`, and `docs/notes/tanto-consistency-checks.md`
once the plan lands, each an `O` needle for `passage-check.js`; the plan's
author adds to the list any restatement the re-grep of section 9 turns up.
Each needle is one line; the ones that hold backticks are in the block
below, the rest in the list under it.

```text
`## recommended adopt`, `## recommended reject`, `## unsure`
dispatch the `shoroku` kind in apply mode
`exit-jisso-B`, `exit-sekkei`, `exit-kaiseki-1`, and
Make sure `.tanto/.gitignore` exists
```

- `recommended adopt, recommended reject, unsure` in any case but the
  capitalized one (1.5)
- `Thirteen of them:` (1.6)
- `reads the whole recommendation once` (1.4, 1.6)
- `and your own exit shoroku when a handover is due` (2.1)
- `step 7's slot (b) apply` (2.1)
- `Delete requests wait for step 7.` (2.1)
- `Peers whose last line this session did not answer` (2.2)
- `dead, replaced, and refused rows` (3)
- `<the dispatch the pause named>` (3)
- `tanto-task-implement.md` (3; `SKILL.md` states the file-naming rule with
  `tanto-<object>-<act>.md` and never spells this name, so the bare needle is
  clean over the whole skill once the two templates change)
- `T2 shoroku proposal and write-out` (3)
- `tracked files only in a slot I give".` as the whole of Hosa's line (4.2)
- `read-only** reviewer` (5.2)
- `a read-only subagent that writes` (5.2)
- `Before the review, a passage` (5.1)
- `two top-family session` (6.3; matches the singular and the plural)
- `a third top-family session` (6.3)
- the phrase "reads its unsure group" with the word in backticks, as the file
  has it (1.6)

## Requirements

This design serves req-04f5, adds no requirement, and **changes one bullet**:
"Composes without modifying" (Fixed input 11). Its wording after T1, for the
brief and the reviewer to confirm — the original followed by the change:

> The skills tanto composes — superpowers, the `kisou` document system,
> `shoroku`, and the like — are used as they are; every override tanto needs
> is written into tanto's own files.

becomes

> The skills tanto composes from outside this repository — superpowers, the
> `kisou` document system, and the like — are used as they are; every
> override tanto needs is written into tanto's own files. `shoroku` is this
> repository's own skill: its recommend and apply modes exist for tanto's
> calls and are edited with tanto, under the heading contract the consistency
> note checks (decision to be numbered at T1).

The bullets served, by section:

- "The human reviews through a brief of the judgment points" and "Escalated
  wording reaches the human in the chat's language too" — section 1: the
  shoroku stages join the spec and the plan in being reviewed through a brief
  in the chat's language. The bullet's "a third party that shares no context
  with the author" is about the spec and the plan, where the author's
  selection is the risk; the check brief renders the recommender's own
  judgment, and this design does not change the bullet. **The reviewer and
  the brief read this as a question**: whether the bullet's third-party
  clause should be widened to say so, or left as it is. The spec's answer is
  to leave it: the recommendation is already a third party's read of the
  proposal, and the brief is its rendering.
- "A run is affordable to keep running" — 6.3 (the cap of one) and 6.6 (the
  count of top-family one-shots that the bullet asks for gains a writer).
- "The human's counterpart is Kanri" — 4.1 and 4.2 (Hosa's channel to Kanri
  has both directions, and its grant is given where the contract says).
- "Model discipline" — 2.3, 4.4, 6.1 (every dispatch names its kind and its
  model, Kikaku included, and a dispatch's deliverable is verified as a
  file).
- "State lives in files, not in sessions" — 3, 5.3, 5.4, 6.2, 6.7, 8 (the
  enumerations are checkable, a decision is in `dialogue.md` before the
  document, a review has a fixed referent, memory is not authority, a
  pre-spec act has a closure mark, and every drift has a check).
- "Kanri is resident, but its context cost does not grow with its tenure" —
  1.4 (Kanri stops reading recommendations whole).
- "The human is interrupted only at defined checkpoints" — 6.4 (the root
  listing is one line in Kanri's start line and at the close, not a new
  checkpoint).

## The ADRs

Three decisions with rejected alternatives, for T1 to write as `decisions/`
entries if the shoroku recommender agrees:

1. **The shoroku check brief is written by the recommender, not by a
   `brief.write` seat.** Alternatives: a `brief.write` dispatch as for the
   spec and the plan (rejected: 115,120 tokens and 262 s on fable for a
   rendering of a file the recommender already holds; the review brief's
   third party exists to select without the author's context, and a
   recommendation is not the proposer's document); Kanri rendering the list
   itself (the interim form; rejected: Kanri reads the whole recommendation
   at every stage, against its residency bullet). Consequence: the
   recommendation's item headings become a contract `tanto` checks.
2. **At most one top-family session at once, Kikaku excepted; a second is a
   ruling.** Alternatives: two with a per-topic pause (rejected: the number
   was unreachable as worded, and under concurrent topics a reachable two
   is a cost the human did not ask for); no number (rejected: Kanri's check
   is mechanical only with one). Consequence: a concurrent topic's Kaiseki
   while a Sekkei is live is an `R-n`, and the Measurements peak row records
   whether the cap held.
3. **`shoroku`'s recommend and apply modes are `tanto`'s to edit; the other
   composed skills stay as they are.** Alternatives: keeping the bullet and
   moving every `shoroku`-side sentence into `tanto`'s dispatch prompts and
   templates (rejected, Q5 B: the two skills would then spell the group
   headings differently, and the heading contract issue-e916 asks to pin
   would be pinned on one side only); keeping the bullet with a note on
   `shoroku`'s side that the section is `tanto`'s (rejected, Q5 C: the
   requirement would read as violated by every commit that touches the
   file). Consequence: req-04f5's bullet is amended as the Requirements
   section words it, and the consistency note's check 18 is the pairing's
   guard on both sides.

The other decisions here — slot (a), the template moving, the narrow Kikaku,
the `Unsure` spelling — are consistency choices with one reasonable side
and are recorded in the plan's block rationales, not as ADRs.

## What the plan must contain

- **Global Constraints** built from `AGENTS.md` and the concrete model
  families from `tanto.json`, plus: **Git Bash** as the shell every fenced
  block runs in, and `$TANTO` set in the same call as every
  `passage-check.js` command; the `created:` list; rule 11's authority
  sentence with the final boundary as the one from which a role may be
  started or replaced; the stage from which the run's own Kanri uses the
  full check brief (the first shoroku stage after batch D is accepted); and
  the stray-edit rule of `tanto-context-ceiling`'s R-11, as every plan now
  carries it.

- **The `created:` list**, verbatim, because `diff` reads it:

  ```text
  created: skills/tanto/templates/shoroku-brief.md
  created: docs/reports/<date>-tanto-sweep-2-dogfood.md
  ```

  with `<date>` the plan's own date, and the line-ending restore of 6.5
  written into each creating task's steps — the rule this plan itself lands
  applies to it.

- **The post-merge re-grep as a precondition of drafting.** Before the
  drafter is dispatched, Keikaku runs `grep -nF` for every old text this spec
  quotes — sections 1 to 7 — on the merged tree, records the result in
  `.tanto/tanto-sweep-2/old-text-check.md`, and sends Kanri one line per
  miss as an open point; the plan's blocks quote what the tree holds at that
  moment, and section 9's table says what the spec assumed. A miss is not a
  reason to guess a replacement.

- **Every byte-identical pair in one task, every semantic pair in one
  batch.** A string that must read the same in two files lands in one task:
  the `Unsure` spelling at every reader (1.5) with the contract's step 3
  (1.6) and Kanri's (1.4); the `continue:` spelling; the status enumeration;
  the two templates' `subagent_type:` form; the five cap sites of 6.3. A
  pair whose halves refer to each other without sharing bytes lands in one
  batch, and section 10's cut says which task: the template count with the
  template's creation (D1); Hosa's `slot-needed:` receiver with its grant
  line (B1); the hash slot in `templates/review-brief.md` with 5.4's
  sentences (C1). Fixed input 4 is the first rule; this bullet is where the
  second is stated.

- **Batches** as section 10 cuts them, three or four tasks each, with what
  each delivers and the boundary check named by name.

- **How a batch is verified**: lint on the changed paths individually under
  Git Bash; `node "$TANTO/scripts/passage-check.js" diff` at every boundary,
  from batch A's on — this plan's first task edits a file `diff` can read;
  the content greps of section 8's checks for the batch that lands them;
  `mise x node@22 -- node --test skills/tanto/scripts/` once per boundary,
  to show the untouched scripts still pass; `git ls-files --eol` on the
  created files; the `O` sweep in E1; and the README drift review recorded
  in D3's report.

- **No report or prompt skeletons.** Reports and prompts follow the tanto
  templates and the plan names nothing else.

## Verification

1. **Every passage is one block with an id**, the old text quoted exactly and
   `lint` and `replay` passing on the plan; `verify` at each task's end.
2. **The check brief is exercised on this run**: the dogfood report records
   the first stage run with it — the four headings counted, the `See:`
   pointers matched, the human's answer, and whether Kanri read any of the
   recommendation's prose (it must not).
3. **The `Unsure` read works again**: `sections` on a recommendation written
   after batch D, with the heading `Unsure`, prints the group; recorded in
   the dogfood report with the command.
4. **Section 8's checks pass** with their expected values recorded in the
   note, and check 4's `shoroku` line still returns `1`.
5. **Issues this design closes** are each traced to a block id in the plan's
   Self-Review, and the whole-branch reviewer re-reads each issue against
   the landed text before T2 moves it.

## Out of scope

- The held-edits marker of issue-3d81 (Fixed input 1), the role-file diet
  (Fixed input 1), issue-d0c9, issue-e047, issue-6a29 (Fixed input 2).
- `scripts/passage-check.js`, `scripts/reading.js`, and their tests: no
  change; `passage-check-hardening` follows this topic.
- The paths `tanto-context-ceiling`'s plan creates and the ceiling rule's
  wording, except where section 9 names a block as this spec's old text.
- The superpowers skills, `docs/requirements/`, and `docs/decisions/`: T1
  writes what the ADRs section proposes; this plan writes nothing there.
- The `.tanto/` files of earlier runs that 6.4's listing will surface: the
  listing reports them, the human decides.

## Issues this design closes

Twenty-nine, each by the section named: 3a7c (4.1), c30e (4.2), 7ba4 (2.1),
2e19 (3), 5a2d (3), 62e7 (3), 8c74 (3), e18b (3), f5d8 (2.2), d604 (6.3),
f902 (4.3), 8e51 (4.4), c583 (2.3), e916 (1.3, 1.5, 8), 36c0 (5.1), c17a
(1), 9627 (6.7), b673 (6.6), bf75 (5.4), 1c9a (3), c2d7 (6.2), 9d17 (6.4),
caba (2.4), 63b0 (6.1), 4b91 (7), 4d8a (6.5, 8), 5b8e (5.2), 5e9c (5.3),
6f3d (6.5). T2 moves each to `resolved/` with the block id that closed it.

## Issues already closed by earlier work

For T1 to move to `resolved/` with a note naming what closed them, measured
2026-09-14 against the `tanto-context-ceiling` branch by the survey
(`.tanto/tanto-sweep-2/issue-survey.md`): issue-2872 (the ledger template's
two placeholders now differ), issue-5a17 (the pause protocol is in `SKILL.md`
and `roles/kanri.md`), issue-2d84 (`boundary` prints `expected:`), issue-5e47
and issue-ac9d (superseded by the `frame` subcommand), issue-3c7a (the
Sekkei/Keikaku split exists) and issue-2e52 (`sections`, `frame`, and
`boundary` exist) — the last two "largely", and the spec reviewer names any
sub-item still open, which then joins section 6 as a passage; and
issue-19d4, which `tanto-context-ceiling`'s Tasks 11 to 13 implement and
which closes with that plan's merge, before this plan starts.

## Answers to the spec inputs

Kanri's orders line carried the scope, and Kikaku's two decision files are
answered by Fixed inputs 1, 2, and 5. One input was written during the spec
work:

- **I-1** — Kanri's answer to the role-procedure check on sections 1.4, 2,
  3, 4.1, 4.2, 6.4, 6.6, 6.7, and 7: no objection to any; two enumeration
  gaps of section 3 (`cleared`, `exit-keikaku`) and two missing obligations
  (6.4, 6.6) corroborated from that session's own day. Its two notes are in
  the text: 6.4's known set names a closed topic's directory, and 6.6 says
  that "top family" is the family `tanto.json` gives the kind, so an `opus`
  `shoroku` dispatch does not count. Its measurement of `.tanto/`'s four
  stray entries is under 6.4. On the Keikaku sections (5.2, 5.3, 5.4, 6.5)
  no Keikaku was live; Sekkei read `roles/keikaku.md` Steps 3 and 4 itself,
  which is where 5.4's Keikaku half moved inside Step 4 item 3.

## Deferred items

- **The held-edits marker** (issue-3d81's second half, `tanto-context-ceiling`
  R-11): taken only if R-11's rule proves insufficient in a later run; the
  issue stays open with that condition.
- **The role-file diet** (`tanto-context-ceiling` Fixed input 7): a topic of
  its own, after `passage-check-hardening` or beside it; this sweep adds
  text to `SKILL.md` and `roles/kanri.md`, which is the opposite direction,
  and the diet's author reads the measurement `reading.js` will have taken
  by then.
- **issue-d0c9** to `passage-check-hardening`; **issue-e047** to a lane the
  human opens for linter configuration; **issue-6a29** after issue-cae3.
- **The `sections` subcommand's exact-match rule**: a case-insensitive or
  normalized heading match would have hidden the `Unsure` failure instead of
  fixing the contract; left as it is on purpose, and named here so that
  `passage-check-hardening` does not "fix" it without reading section 1.5.

## The reviews this spec has had, and what each found

**The spec review** (`spec.review` on opus, 2026-09-14,
`.tanto/tanto-sweep-2/spec-review.md`, sixteen findings over hash
`ff2a5ad6…`): four blocking, seven should-fix, five minor. Adopted and in the
text: F-1 (the note's four structural counts, 8.5), F-2 (one numbering run,
`## 18.` to `## 21.`), F-4 (the contract's own `unsure` sentence, 1.6), F-5
(the cap's three other sites, 6.3), F-6 (the wrapped `roles/kanri.md` check,
8.1), F-7 (byte-identical pairs in one task, semantic pairs in one batch, and
the cut revised), F-8 (the item number unique across the file, 1.3), F-9
(the recommend mode's input sentence, 1.3), F-10 (5.4's Keikaku half inside
Step 4 item 3), F-11 (P9.1's insertion point, section 9 and 6.6), F-13, F-14,
F-15, F-16 (I-1's two notes). Rejected: F-12 — the `continue:` old text
carries one backtick as the file does; `grep -cF` on the spec's line found it
once before the review was dispatched, so the reviewer's reading was of a
rendering, not the file. F-3 is a scope finding and went to the human; its
outcome is under Requirements. The reviewer confirmed every other old text
once, the six section 9 blocks as stated, and no open sub-item of issue-3c7a
or issue-2e52 (the latter's "through context-mode when available" clause is
conditional on a plugin and is closed by the resolution note, not a passage).
Its five shoroku candidates are carried in "Shoroku candidates from this
spec work".

## Shoroku candidates from this spec work

1. **Measured**: the `## Unsure` mismatch and the empty `sections` read, with
   the two commands and their output ("Measured while designing") — a data
   point for issue-e916's record before it closes, and for a note on
   heading contracts between skills.
2. **Measured**: `tanto-context-ceiling`'s plan quotes six sites this sweep
   edits; the "old text from the other plan's block" method of section 9 is
   the first time a spec has been written against a tree that does not exist
   yet — worth a note entry if it works, an issue if it does not.
3. **Observation**: two read-only surveys on sonnet (41 issues, then 27 fix
   notes) replaced what a fable Sekkei would otherwise have read in its own
   context; their token cost against the spec's is a data point for
   req-04f5's affordability bullet.
4. **Rejected alternative**: cutting the sweep by file (Q4, B), for the
   reason the first sweep gave — a cross-file pair split across tasks leaves
   the tree inconsistent at a boundary.
5. **Rejected alternative**: c17a first (Q4, C) — the pain it removes is
   paid at stages that will have passed before this plan lands.
6. **Measured** (the spec review): `docs/notes/tanto-consistency-checks.md`
   is one `## <n>.` run in which 10 to 15 are lessons and the rest checks, so
   "check n" and "lesson n" share a namespace; its preamble does not say so.
7. **Measured** (the spec review): the note's "adds a template edits four of
   them" rule was missed by this spec's first draft, the second spec to miss
   it — a candidate for a Keikaku drafting convention, "a plan that creates a
   file under `skills/` lists the structural counts it must move".
8. **Observation** (the spec review): req-04f5's "Composes without modifying"
   bullet names `shoroku` among the skills used as they are, while
   `skills/shoroku/SKILL.md` has been edited for `tanto` twice already; the
   requirement and the practice have been out of step since the
   recommend/apply split, and no decision records it. Q5 settles what this
   spec does about it.
9. **Observation** (the spec review): `dialogue.md` carried a duplicated
   prefix from a scripted append that matched the wrong `Human:` line; found
   by the reviewer, repaired before the brief was written. A dialogue append
   is safer as a plain append than as a replace.
