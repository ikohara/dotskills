# Design: shoroku-at-close — one shoroku check per topic, at its close, and the `shoroku` kind split into recommend and apply

Written 2026-09-15 by Sekkei `dotskills-b3 [b8c258]` as a draft at
`.tanto/shoroku-at-close/spec-draft.md`, because `tanto-sweep-2` holds the
shared checkout (this topic's ledger, R-1). The Keikaku created once the
checkout is free commits this text unchanged at
`docs/superpowers/specs/2026-09-15-shoroku-at-close-design.md` and cuts the
branch `shoroku-at-close` from `main` before that commit. Nothing here is
edited or committed before then.

The topic is the fourth in the order Kikaku set on 2026-09-14 — after
`tanto-sweep-2` and `tanto-project-config`, before `passage-check-hardening`
— and its whole input is one Kikaku decision file,
`.tanto/kikaku/2026-09-14-shoroku-at-close.md`, which this spec cites as
"the decision file". No T0 stage ran for it (ledger R-2): the decision file
is what this topic's Sekkei reads, and its decided items become ADRs at this
topic's own close, with everything else — which is the design.

The design in one sentence: the human's shoroku check happens **once per
topic, at its close**; every other moment of a run — a spec accepted, a plan
landed, a session's exit, a batch boundary — produces candidates and
nothing else, recorded as `pending` rows of the ledger's `S-n` table that
point at the files where the candidates live; the one recommend runs on the
top family over every source those rows name, the one check is the human's,
on the check brief `tanto-sweep-2` ships, and the one apply lands on the
topic's branch before the merge decision. The `shoroku` kind becomes two,
`shoroku.recommend` on `fable` and `shoroku.apply` on `opus`, so that the
half whose quality the human weighs at half the reason for a second pass
gets the family that reads sources, and the clerical half does not.

Every change below is a passage: an old text the plan quotes exactly and a
new text that replaces it, an insertion anchored on a quoted line, or a
section replaced whole between two headings. Old and new texts sit in fenced
`text` blocks, as the two sweeps' specs wrote them; a block whose old text is
wrapped in the file is quoted as the file wraps it where this spec read it,
and the plan's author re-quotes every old text from the merged tree
(section 9, What the plan must contain), because two committed-or-drafted
plans rewrite several of these sites first. A section replaced whole is
quoted by the plan from heading to heading, and this spec gives only the
new text.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them
whole. Each names the decision file's section or the dialogue question that
settled it (`.tanto/shoroku-at-close/dialogue.md`) and the requirement bullet
of req-04f5 it serves, or says that none does.

1. **Approach A, all seven points, no exception** (the decision file,
   section 1; the human's one-word answer to Kikaku): the check happens at
   exactly one kind of moment, a topic's close; every other moment produces
   candidates and nothing else; nothing is adopted, recommended, or applied
   before the close. Serves "The human is interrupted only at defined
   checkpoints".
2. **The stage word stays `t2`** (Q1, A over B `close`): the commit prefix
   `docs: T2 shoroku for <topic>`, the ledger's Stage value, and every row
   already written keep their word; the oddity of a T2 with no T0 or T1 goes
   to Deferred items for `tanto-diet`, on the human's "扱って". Serves no
   bullet directly; it keeps the sweep small.
3. **The close's recommender reads the sources** (Q2, A over B Jisso
   re-quoting): the recommend dispatch names every file the `pending` rows
   point at — Jisso's proposal, the spec's four sections, each exit
   proposal, the reports — and the recommender quotes each item in full from
   where it lives; Jisso's proposal carries only what its own context holds
   and no file does. Serves "Kanri is resident, but its context cost does
   not grow with its tenure" (Jisso's context, by the same reasoning) and
   "State lives in files, not in sessions".
4. **Jisso is deleted after its proposal's form check, like every other
   seat** (Q3, A over B keeping it through the merge decision): the
   recommend, the check, the apply, and the merge decision run with Jisso
   gone. Serves "A run is affordable to keep running".
5. **The old `subagents.shoroku` key is an unknown key after the split**
   (Q4, A over B an alias): reported once in the start line as
   `unknown key subagents.shoroku, ignored`, both halves at their defaults
   until the file is edited. Serves "Model discipline".
6. **The kind split** (the decision file, section 4): `subagents.shoroku`
   becomes `subagents.shoroku.recommend`, default
   `{ "model": "fable", "effort": "high" }`, and `subagents.shoroku.apply`,
   default `{ "model": "opus", "effort": "medium" }` — the latter today's
   `shoroku` value, the one issue-52fd's sonnet measurement bears on.
   Twelve kinds become thirteen. Serves "Model discipline" and, through the
   recommend half's family, "Docs are kept current as part of the flow" —
   the human confirms what lands without reading every item cold, which a
   recommendation the human trusts is the condition for.
7. **T0 is folded into the close** (the decision file, section 2): the
   decision file is the input document Sekkei reads, named in the orders
   line, and its decided items become ADRs at the topic's close. Serves
   "The human is interrupted only at defined checkpoints".
8. **Kanri's own exit follows the principle** (the decision file, section
   3, narrowed by design section 1 of the dialogue): while any ledger is
   open, Kanri's exit writes its proposal and records its items as
   `pending` rows — in **one** ledger, the topic's whose batches are in
   flight, else the oldest open topic's, where the decision file allowed
   "every in-flight topic's ledger where the item belongs to one of them" —
   and the handover file names that ledger; between plans, with no ledger
   open, the four steps run as today and land on `main`. Serves "Kanri is
   resident, but its context cost does not grow with its tenure".
9. **A Kikaku decision file whose third section names a stage's
   recommendation and answers it by exception is that stage's Check answer**
   (the decision file, section 6): read whole by Kanri, which writes the
   direction from it and needs no word in its own window. Serves "The human
   is interrupted only at defined checkpoints".
10. **The baseline is the tree after `tanto-sweep-2` merges and
    `tanto-project-config` lands** (Kanri's orders line, 2026-09-15, stated
    up front so that no clarify round-trip was needed): the sites both
    rewrite first are quoted from their blocks and listed in section 9; the
    plan's author re-greps every old text on the merged tree. Serves "State
    lives in files, not in sessions".
11. **This is a draft** (ledger R-1): no branch, no commit, until the
    Keikaku created after the checkout frees up commits it at its final
    path.
12. **Rule 11 applies**, and the boundary from which a role may be started
    or replaced is the final one (section 10).
13. **The interim rulings end when this plan lands** (the decision file,
    section 7): `tanto-sweep-2` R-4 and `tanto-project-config` R-4 run their
    topics under approach A by ruling; this plan's landing makes the text say
    what the rulings say, and the rulings expire with it.
14. **The close's steps 2 to 4 are a live Hosa's, and so are Kanri's
    between-plans exit's** (Q5, C over A the close only and B the check's
    presentation only; the human's scope change after the spec review):
    Kanri keeps the proposal's form check and the `pending` rows, sends one
    `close:` line, and may hand over at once; Hosa dispatches the
    recommender, form-checks and pastes the brief in its own window, writes
    the direction from the human's answer, dispatches the apply in the slot
    the line gives, and answers `close done:`; Kanri, or its successor,
    verifies the commit and fills the ledger. With no Hosa live, Kanri runs
    the steps itself and its close line suggests opening one. Serves "A run
    is affordable to keep running" and "Kanri is resident, but its context
    cost does not grow with its tenure".
15. **`skills/shoroku/SKILL.md`'s recommend-mode input sentence is in
    scope** (the spec review's F-23, A over B recording the risk): "a
    source — a file, or a file and the names of the sections to read"
    becomes one or more such sources, since the close's dispatch is the
    first caller that names several files at once. Serves "Docs are kept
    current as part of the flow".

## Measured while designing

Facts read from the tree on 2026-09-15, before the dialogue; the plan's
author may cite them without re-measuring, and the reviewer re-checks the
ones marked so.

- **`scripts/reading.js` holds no list of kinds.** `grep -n "subagents\|KINDS\|Object.keys" skills/tanto/scripts/reading.js`
  finds only `CEILING_ROLES = ["kanri", "jisso"]` and the ceiling map's
  unknown-key warning; `reading.test.js`'s unknown-key test (line 263)
  covers `ceiling.sekkei` and `ceiling.kanri.window` only. The decision
  file's section 4 sentence "`scripts/reading.js`'s known-key list and its
  tests follow" names no site: the script does not read `subagents`, and the
  `unknown key <name>, ignored` line for a `sessions` or `subagents` key is
  the role's own start-line report, prose in `SKILL.md`. Neither script and
  neither test changes (section 10).
- **The kind count is asserted in one place outside prose.**
  `docs/notes/tanto-consistency-checks.md` check 8's `node -e` line asserts
  `k.length!==12` on `templates/tanto.json`'s `subagents` map (line 837 at
  the time of reading); its explanation two paragraphs below says "the
  twelve kinds", and check 8's tenth needle explanation says "`default`
  survives as one of the twelve kinds" (line 753). `tanto-project-config`'s
  draft plan (Task 7) edits check 8 first, for the project overlay.
- **`tanto-project-config`'s draft spec says "twelve" at nine places**
  (`.tanto/tanto-project-config/spec-draft.md`, lines 112, 256, 278, 309,
  415, 438, 496, 551, 563 at the time of reading), and its plan is a draft
  on disk at `docs/superpowers/plans/2026-09-15-tanto-project-config.md`,
  untracked, with eight tasks over `reading.js`, `SKILL.md`, `roles/kanri.md`,
  `templates/agent.md`, the README, and the note. It lands before this topic
  per the order, so every "twelve" it writes is an old text of this plan
  (section 9).
- **The skill directory the sessions load is the tree's own copy**:
  `cmp skills/tanto/SKILL.md "$CLAUDE_CONFIG_DIR/skills/tanto/SKILL.md"`
  is silent. Rule 11 applies as it did to both sweeps.
- **The twelve definitions on this host are current**: each
  `$CLAUDE_CONFIG_DIR/agents/tanto-<kind>.md` equals `templates/agent.md`
  rendered, modulo CRLF — the definitions are CRLF on disk, as
  `templates/agent.md` is. A comparison that renders through `sed` and
  `$(...)` on Git Bash strips the CR and reports every file as differing;
  the start sequence's "content differs" is read modulo line endings, or
  the comparison is done with `tr -d '\r'` on both sides. Worth a lesson
  entry in the note (section 8).
- **The human's personal `tanto.json` today** is
  `{"subagents": {"shoroku": "fable"}}` — a bare string, the model only,
  not the `{ "model": "fable", "effort": "high" }` the decision file's
  section 7 said the human would write. Under Fixed input 5 that key is
  reported and ignored after the split; the human edits it to
  `"shoroku.recommend"` or lets the defaults, which are the same values,
  stand.
- **The question-back path has never fired** (the decision file, section
  0, re-read from every ledger under `.tanto/` and `roster-archive.md` on
  2026-09-15): no `unsure` item saying a candidate could not be read as
  written, in any recommendation of this run.
- **Sites, counted.** `grep -c` over `skills/tanto/`, `skills/shoroku/`, and
  the note for the strings this design retires: `T0` — `SKILL.md` 2,
  `README.md` 1, `roles/kanri.md` 8, `roles/kikaku.md` 1,
  `templates/kikaku-decision.md` 1 (`reading.test.js`'s 11 are timestamps,
  `T00:`); `T1` as a word — `SKILL.md` 2, `README.md` 1, `roles/kanri.md` 7,
  `roles/keikaku.md` 1, `roles/sekkei.md` 3, the note 1; `tanto-shoroku` —
  `SKILL.md` 1, `roles/kanri.md` 3; `twelve` — `SKILL.md` 4,
  `roles/kanri.md` 1, the note 3; `once the recommendation` —
  `roles/kanri.md` 5; `question back` — `SKILL.md` 1, `roles/kanri.md` 1.
  `roles/sekkei.md`'s three are Step 1's "T1's shoroku takes it as an input"
  (line 40) and the exit bullet's two (lines 146-147, "T1 has not run when
  you exit"); `roles/keikaku.md`'s one is its dialogue sentence (line 44,
  "T1's shoroku takes it as an input"). The plan's `O` sweep is the
  complete list; these counts are its starting point.

## 1. The principle, and what each moment does

**The principle.** The human's shoroku check happens at exactly one kind of
moment: a topic's close, the stage whose word stays `t2` (Fixed input 2).
Every other moment produces candidates and nothing else. Nothing is adopted,
recommended, or applied before the close. The four steps of decision-ce83 —
candidates, recommend, check, apply — stand, and run once per topic.

**What each moment does.** This is the behavior every passage below writes
into a file; a passage that seems to say less than this list is read against
it.

- **A batch boundary, a review, a Kaiseki report** — unchanged: the report's
  Shoroku candidates, a Kaiseki report's `blocks this task: no` items, and a
  review report's candidates go into the ledger's `S-n` table as `pending`
  rows with Stage `t2`, one line each, the Source column naming the report
  file and the item — bookkeeping, never a ruling.
- **Spec accepted** (Sekkei's final boundary). Sekkei writes its exit
  proposal unasked and names it in its `spec accepted:` line, as
  decision-d538 has it. Kanri checks the proposal's **form only** — the
  exclusion line it opens with and the numbered list under it — records each
  item as a `pending` row whose Source is the proposal's path and the item's
  number, records the spec's four sections — Requirements, The ADRs,
  Deferred items, and Shoroku candidates from this spec work — as four
  `pending` rows whose Source is the spec's path and the section's heading,
  and asks the human to delete Sekkei at once. No recommender runs.
- **Plan landed** (Keikaku's final boundary). The same for Keikaku's exit
  proposal, named in its `coldread answered:` line. T1 no longer exists:
  "When the plan lands" goes from recording the landing to the Jisso create
  request. Nothing gates Jisso's start but the plan.
- **Every other exit** — a Jisso replaced mid-plan, a Kaiseki, a Sekkei or
  Keikaku leaving away from its final boundary — takes the `exit:` line as
  today, writes its proposal, answers `exit proposal: <path> — <reading>`,
  and is deleted after the form check. Its items are `pending` rows.
- **The close.** After the final batch is accepted, Kanri sends Jisso the T2
  line; Jisso writes `.tanto/<topic>/shoroku-proposal.md` — the `pending`
  rows listed by number without re-quotation, and what its own context holds
  that no file does (Fixed input 3) — and idles. Kanri checks the form and
  asks for Jisso's deletion at once (Fixed input 4). Then one recommend: the
  `shoroku.recommend` kind, dispatched over Jisso's proposal **and every
  source the `pending` rows name** — the spec's four sections by heading,
  each exit proposal by path, each report by path and item — with `docs/` as
  the baseline, writing `t2-recommendation.md` and `t2-brief.md`. One check:
  the brief, verbatim, as `tanto-sweep-2`'s section 1 has it, answered by
  exception — or by a Kikaku decision file whose third section answers it
  (Fixed input 9). One direction file, `t2-direction.md`, and the `S-n`
  rows' Adopted column filled. One apply: the `shoroku.apply` kind, on the
  topic's branch, before the merge decision — the one commit window that
  needs no juggling. Then the merge decision.
- **Who runs the close's steps 2 to 4.** A live Hosa, when there is one
  (Fixed input 14). After the form check and the rows, Kanri sends Hosa one
  line —
  `close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`
  — and is free: the slot is `now` because no batch is in flight at a close
  and Jisso is deleted. Hosa reads the ledger's `pending` rows for their
  sources, dispatches `shoroku.recommend` over the proposal and those
  sources, form-checks the brief by `grep` exactly as Kanri's step 3 says,
  pastes it to the human in its own window with both paths and the three
  counts — the human's chores grant already covers that window — writes the
  direction file from the human's answer, dispatches `shoroku.apply` with
  the subject, and answers Kanri `close done: <commit subject> — <reading>`,
  or `close blocked: <one line>` when a form check fails twice or the
  human's answer does not arrive. Kanri, or the successor it handed over to
  meanwhile, verifies the commit as any and fills the ledger's Adopted and
  Written columns from the direction file and the subject. A Kikaku
  decision file that answers the check reaches Hosa as `decision: <path>`,
  one line relayed by Kanri. With no Hosa live, Kanri runs the three steps
  itself, and its close line suggests `/tanto hosa` the way its
  between-plans line suggests a Kikaku.
- **Kanri's own exit.** While any ledger is open — a topic in its batches,
  or in its spec or plan stage — Kanri writes its proposal from the ledger
  and the roster, records its items as `pending` rows in the ledger of the
  topic whose batches are in flight, else the oldest open topic's, notes in
  the handover file's Not reconstructed section only what it could not
  write there, and hands over; the successor sends no `kanri-address:` to
  a session that was deleted, and the rows wait for that topic's close.
  Between plans, with no ledger open and the human present at the handover,
  the four steps run and the apply lands on `main` — the only stage left
  that lands there (Fixed input 8) — with steps 2 to 4 a live Hosa's by
  the same `close:` line, `kanri` in place of the topic and the Kanri exit
  file names in the paths (Fixed input 14): Kanri writes its proposal,
  delegates, writes the handover file naming the delegation, and stops; the
  successor verifies the commit on `main`. With no Hosa live, Kanri runs
  the steps itself and verifies the commit before the handover file, as
  today.
- **A topic that closes without landing.** When the human ends a topic
  before its final batch — the plan not wanted, the branch abandoned —
  Kanri runs the close over what is on disk: the `pending` rows and their
  sources, with Kanri writing the T2 proposal in Jisso's absence, as it
  writes its own. The apply lands on the topic's branch, and the human's
  merge decision says whether that branch lands.
- **A Kikaku decision file between plans, or belonging to no topic** goes
  where it goes today: an `S-n` source row in an open topic's ledger, or the
  roster's Shoroku candidates section, inherited by the next ledger. A
  decision file that is the next topic's input is named in that topic's
  orders line for its Sekkei to read (Fixed input 7).

**What is dropped.** The recommender run between a session's proposal and
its deletion, and with it the "question back to the session" path; T0; T1;
the "Sekkei exit of a topic whose branch does not exist yet waits" rule,
since nothing is applied before the close; the `<stage>` in the
recommendation's, brief's, and direction's file names for every stage but
Kanri's between-plans exit, since one stage per topic has one set.

**What is kept.** The proposal's form — the exclusion line and the numbered
list; the `S-n` table with its `pending`, `yes`, `no`; the recommendation's
three groups and full quotation; the check brief; the human's answer by
exception; the apply subagent as the only writer under `docs/`; the fixed
commit prefix the whole-branch review excludes; the forced-exit Events line.

**Cost accepted.** `docs/` reflects a topic's requirements, ADRs, and issues
only at its close. A concurrent topic's Sekkei reads the spec on the branch,
or the decision file its orders line names, for what `docs/` does not yet
hold. The human judged this acceptable (the decision file, section 1).

## 2. `skills/tanto/SKILL.md`

### 2.1 "The expected-model config": thirteen kinds, two skill-name keys, one stale definition

**The kinds list.** The `subagents.<kind>` bullet's enumeration:

```text
  agent definition below. The twelve kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `brief.write`, `shoroku`, and `default`.
```

→

```text
  agent definition below. The thirteen kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `brief.write`, `shoroku.recommend`, `shoroku.apply`, and `default`.
```

**The skill-name key.** The bullet:

```text
- A key inside `subagents` whose name is a **skill name** means "run that skill
  in a subagent on that model instead of inline". When the key is absent, the
  skill runs inline on the session's model. `shoroku` is the one built-in
  skill-name key; any other is a personal addition.
```

→

```text
- A key inside `subagents` whose `<object>` is a **skill name** and whose
  `<act>` is one of that skill's modes means "run that mode of the skill in a
  subagent on that model instead of inline". When the key is absent, the mode
  runs inline on the session's model. `shoroku.recommend` and `shoroku.apply`
  are the two built-in skill-name keys, naming the `shoroku` skill's
  recommend and apply modes; any other is a personal addition.
```

`tanto-project-config`'s section 1.6 rewrites the same bullet for the project
level first (section 9); the plan's author merges the two on the landed
text.

**The unknown-key sentence** gains its example. In the paragraph that
begins `The skill ships built-in defaults`, the sentence

```text
your start line as `unknown key <name>, ignored`, or as
```

→

```text
your start line as `unknown key <name>, ignored` — `subagents.shoroku`, the
kind's name before it was split into `shoroku.recommend` and
`shoroku.apply`, is one such key, and a personal file that still carries it
sets neither half — or as
```

**The definitions paragraph**, three edits. `write for each of the twelve
kinds the file` → `write for each of the thirteen kinds the file`. After its
last sentence, `A file that already matches is left alone.`, one sentence is
added:

```text
A file that already matches is left alone. `tanto-shoroku.md` in that
directory, the definition of the kind before it was split, is removed in the
same pass when it exists, so that no session is offered a seat the config no
longer has; the same removal runs at the project scope when that scope has
the file.
```

`tanto-project-config` writes "twelve" into this paragraph and its
neighbors at more sites than today's four — its user-scope and
project-scope passes, its removal rule ("only those twelve names are ever
removed"), its `<s>` count — and the plan's author re-measures
`grep -c twelve skills/tanto/SKILL.md` on the landed tree and writes one
passage per hit, every one to thirteen; the removal rule's "names" gains
`tanto-shoroku.md` as the one file outside the thirteen that the pass
removes.

And `the twelve names in it.` → `the thirteen names in it.`; the sentence
that follows it, as `tanto-sweep-2`'s 2.3 lands it (section 9):

```text
`subagent_type: tanto-<object>-<act>` — or `tanto-<kind>` for a kind with no
dot in its name, `tanto-shoroku` and `tanto-default`.
```

→

```text
`subagent_type: tanto-<object>-<act>` — or `tanto-<kind>` for a kind with no
dot in its name, which is `tanto-default`.
```

`tanto-project-config`'s sections 2.2 and 2.5 rewrite the count line and the
two-scope write around these sentences first (section 9); the plan quotes
the landed lines. The count that matters to it is thirteen, wherever it
lands.

**The Resuming section**: `Start sequence's twelve-definitions
write-and-count` → `Start sequence's thirteen-definitions write-and-count`
(wrapped in the file as `tanto-project-config` leaves it; the plan quotes
the line).

### 2.2 "Session exit", replaced whole

The section from `## Session exit` to the line before `## Artifacts` is
replaced. It keeps the contract's role — the mechanism, the four steps, the
file pattern, the two forms of the exit line — and says what the roles do
under the principle. `tanto-sweep-2`'s 1.6 rewrites its steps 2 and 3 and
the exit's `unsure` sentence first; this replacement supersedes those
edits, and the plan's author quotes the landed section whole (section 9).
The new text:

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
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading of the recommendation
   appearing exactly once after `See:` — dispatches the recommender once
   more on a failure and pastes the brief as it stands on a second, then
   gives the human both paths, the three counts, and the brief's text
   verbatim; the human answers by exception, in Kanri's window or through a
   Kikaku decision file whose third section names this recommendation and
   answers it; Kanri writes `t2-direction.md` beside the recommendation,
   item by item, with the `S-n` rows in the conductor ledger.
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
apply lands on `main`; while a ledger is open, its items are `pending` rows
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

### 2.3 The Artifacts table

Six rows change; the plan quotes each from the landed tree, since
`tanto-sweep-2` adds one and `tanto-project-config` edits two others in the
same table.

The `kikaku` decision row's Content column, its end:

```text
and from there a T0 input, an `I-n`, or an `S-n` source |
```

→

```text
and from there the next topic's input document, an `I-n`, an `S-n` source, or a stage's Check answer |
```

The `dialogue.md` row's Readers column: `Kanri, the brief writer, T1` →
`Kanri, the brief writer, the close's recommender`.

The `shoroku-proposal.md` row, whole:

```text
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri, the recommender | the T2 proposal, written to a file instead of printed |
```

→

```text
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri, for its form; the close's recommender, by path | the close's proposal: the `pending` rows by number and what Jisso's own context holds that no file does, written to a file instead of printed |
```

The exit-proposal row, whole (its Readers value is the same string as the
row above's, so neither is quoted alone):

```text
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri, the recommender | the exit shoroku proposal, opening with the line that says what it excludes |
```

→

```text
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri, for its form; the close's recommender, by path | the exit shoroku proposal, opening with the line that says what it excludes |
```

The recommendation row, whole:

```text
| `.tanto/<topic>/<stage>-recommendation.md`, or `.tanto/t0-recommendation.md` and Kanri's own exit at `.tanto/` | the `shoroku` recommender Kanri dispatches | Kanri, the human, the apply subagent | every candidate once, quoted in full, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
```

→

```text
| `.tanto/<topic>/t2-recommendation.md`, or Kanri's between-plans exit at `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every candidate once, quoted in full from the source its `pending` row names, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
```

The brief row, as `tanto-sweep-2`'s 1.6 adds it (section 9): its Path and
Writer columns —

```text
| `.tanto/<topic>/<stage>-brief.md`, or `.tanto/<stage>-brief.md` for T0 and Kanri's own exit | the `shoroku` recommender, in the same dispatch as the recommendation |
```

→

```text
| `.tanto/<topic>/t2-brief.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` for Kanri's between-plans exit | the `shoroku.recommend` kind, in the same dispatch as the recommendation |
```

— and its Readers and Content columns unchanged.

The direction row, whole:

```text
| `.tanto/<topic>/<stage>-direction.md`, beside the recommendation | Kanri, from the human's answer | the apply subagent | what the human accepted, item by item; the apply never runs without it |
```

→

```text
| `.tanto/<topic>/t2-direction.md`, beside the recommendation, or Kanri's between-plans exit at `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-direction.md` | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
```

The `tanto.json` row and the `~/.claude/agents/tanto-*.md` row are
unchanged in wording; `tanto-project-config` rewrites the latter, and the
count it carries, if any, is thirteen.

### 2.4 The roles table, and four sentences elsewhere in the contract

**"The roles"**, Hosa's row, its Owns column:

```text
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores and Kanri's filings, each in a slot Kanri gives | the human; Kanri |
```

→

```text
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores, Kanri's filings, and the close's recommend, check, and apply, each in a slot Kanri gives | the human; Kanri |
```

Kanri's row's `the recommendations and the directions` stays: Kanri owns
them, and hands their writing to Hosa as it hands a filing.

**"Human access"**: the fourth standing grant, `Hosa's chores, named in
Kanri's answer to its handshake`, is unchanged; the close's check is a
chore Kanri sends, and the human answers it in Hosa's window under that
grant.

**"Messages"**: the bullet saying that Kanri sends every line without an
idle subscription — batch prompts, Kaiseki briefs, and the exit lines alike
— is right and stays; the `close:` line is one more of them.

**"Rules", rule 2**: `the Kaiseki reports, and the shoroku recommendations
and directions are the only channel` is right and stays — one
recommendation and one direction per topic are still files between the
sessions.

**"Rules", rule 5**: unchanged. The decision file's section 7 asked after
"rule 5's commit timing if it names T1"; it does not — it says Kanri writes
under `docs/` only while Jisso is idle or absent, and the close's apply
runs with Jisso deleted.

**"Rules", rule 6**: unchanged; `tanto-project-config` edits it for the
scope marker, and this plan leaves it as that plan lands it.

## 3. `skills/tanto/roles/kanri.md`

Twelve sites, in file order (3.12 is the Start step the review found).
Section 9 marks the ones `tanto-sweep-2`'s plan or `tanto-project-config`'s
rewrites first.

### 3.1 "Start", step 6: no T0

```text
6. Do the T0 write-out if an input document with decided items exists (see
   "Shoroku"). Then wait for the human and for handshakes. When no next work
```

→

```text
6. Wait for the human and for handshakes. An input document with decided
   items — a Kikaku decision file — is named in Sekkei's orders line for
   Sekkei to read directly, and its decided items reach `docs/` at the
   topic's close with everything else (see "Shoroku"); nothing is written
   out before Sekkei exists. When no next work
```

### 3.2 "On a handshake": a decision file's four handlings

```text
file, and your handling is one of three: a topic in its spec stage takes it as
the next `I-n` in that topic's `spec-inputs.md`; between plans it is a T0
input document; otherwise it is a source row in the `S-n` table. Note
```

→

```text
file, and your handling is one of four: a topic in its spec stage takes it as
the next `I-n` in that topic's `spec-inputs.md`; between plans it is the
next topic's input document, named in its Sekkei's orders line; a file
whose "What Kanri should do with it" section names a stage's recommendation
and answers it by exception is that stage's Check answer, read whole (the
Check step of "Shoroku"); otherwise it is a source row in the `S-n` table. Note
```

### 3.3 "When the plan lands", step 3: the four sections recorded, no T1

```text
3. Run T1: the four steps of "Shoroku" below, whose candidates are the spec's
   own four sections — Requirements, The ADRs, Deferred items, and Shoroku
   candidates from this spec work. Nothing is copied; the recommender reads
   those four sections of the spec by name.
```

→

```text
3. Record the spec's own four sections — Requirements, The ADRs, Deferred
   items, and Shoroku candidates from this spec work — as four `pending`
   rows of the `S-n` table, Source the spec's path and the section's
   heading, Stage `t2`, if the spec's acceptance did not already (Sekkei's
   Delete row). Nothing is copied and nothing is recommended: the close's
   recommender reads those four sections of the spec by name, and Keikaku's
   exit proposal, named in the `coldread answered:` line, is form-checked
   and recorded the same way ("Exit shoroku", step 2).
```

Step 4, `Ask the human to create Jisso`, stays; nothing gates it but the
plan.

### 3.4 "The batch loop", steps 3, 6, and 7

**Step 3**, one sentence: `between stages, and the recommendation and the
human's check at T2 rule on` → `before the close, and the recommendation
and the human's check at T2 rule on` (the file wraps the sentence; the plan
quotes the line).

**Step 6**, the exit sentences, as `tanto-sweep-2`'s 2.1 leaves them
(section 9):

```text
   is due, or a handover trigger has fired and is not deferred, run the
   proposal half of "Exit
   shoroku" now: send the `exit:` lines to the sessions whose proposal is not
   already named — a Sekkei or Keikaku at its own final boundary named it in
   its report line and is waiting for nothing — check each proposal and
   dispatch its
   recommender, and write the direction once the human has answered. A delete
   request goes out as soon as that session's recommendation and brief are on
   disk ("Exit shoroku", step 3); the apply waits for step 7.
```

→

```text
   is due, or a handover trigger has fired and is not deferred, run "Exit
   shoroku" now: send the `exit:` lines to the sessions whose proposal is not
   already named — a Sekkei or Keikaku at its own final boundary named it in
   its report line and is waiting for nothing — check each proposal's form
   and record its items as `pending` rows. A delete request goes out as soon
   as that session's proposal passes the form check ("Exit shoroku", step
   2); nothing is recommended or applied before the close.
```

**Step 7 (a)**, as `tanto-sweep-2`'s 2.3 leaves it (section 9):

```text
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) The apply subagent's slot: for each stage whose direction
   is written, dispatch `subagent_type: tanto-shoroku` in apply mode with the
   recommendation, the direction, and the commit subject, and verify its
   commit as you verify any — `git status` clean, the diff's paths those the
   direction names, lint on them (or on the whole repository where the lint
   script takes no path arguments). The session whose shoroku it is has already
   been deleted; it waits for nothing. (b) Your
```

→

```text
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) The apply subagent's slot, which only the close fills: at
   the final batch's boundary, once `t2-direction.md` is written, dispatch
   `subagent_type: tanto-shoroku-apply` with the recommendation, the
   direction, and the commit subject, and verify its commit as you verify any
   — `git status` clean, the diff's paths those the direction names, lint on
   them (or on the whole repository where the lint script takes no path
   arguments). Jisso has already been deleted; it waits for nothing. At every
   other boundary this slot is empty. (b) Your
```

**Step 7's last sentence**, as the file wraps it:

```text
   steps 2 to 4 of "The handover, in a plan and between plans" — your exit
   shoroku was step 6's proposal and slot (a)'s commit — and the loop stops
   here; the next prompt is the successor's.
```

→

```text
   steps 2 to 4 of "The handover, in a plan and between plans" — your exit
   proposal was step 6's, and its items are `pending` rows in this ledger —
   and the loop stops here; the next prompt is the successor's.
```

### 3.5 "The final batch", step 3: the close

```text
3. When the final batch is accepted, run T2: the four steps of "Shoroku"
   below, whose first step is Jisso's. Send it one line —
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
   — and the recommendation, the human's check, and the apply follow as at
   every other stage. Then put the merge
   decision to the human.
```

→

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
```

### 3.6 "The Kaiseki branch", steps 5 and 6

Step 5's last clause, `here, and T2's proposal is where it is recommended
and checked.` → `here, and the close is where it is recommended and
checked.`

Step 6: `run Kaiseki's exit as "Exit shoroku" below prescribes — its
proposal, then the recommendation, then the deletion request — or keep it
if` → `run Kaiseki's exit as "Exit shoroku" below prescribes — its
proposal, its form check, then the deletion request — or keep it if`
(wrapped in the file; the plan quotes the lines).

### 3.7 "Handover": Timing's example, Live peers, and step 1

**"Timing"**, one list: `there — a T0 shoroku, a bug-report triage, the
handshakes, a resume — with no` → `there — a bug-report triage, the
handshakes, a resume — with no`.

**"The handover file"**, the Live peers sentence, as `tanto-sweep-2`'s 2.2
leaves the paragraph (section 9):

```text
or Keikaku whose last line named an exit proposal is waiting for nothing but
its deletion, and your successor's first act for it is the recommender
dispatch, if the recommendation is not already on disk.
```

→

```text
or Keikaku whose last line named an exit proposal is waiting for nothing but
its deletion, and your successor's first act for it is the delete request,
if the proposal's form check is recorded in the ledger and the request was
not sent.
```

**"The handover, in a plan and between plans", step 1**, replaced whole
(from `1. **Exit shoroku first**` to the line before `2. Write`), as
`tanto-sweep-2`'s 2.1 leaves it (section 9):

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

### 3.8 "Shoroku", replaced whole

The section from `## Shoroku` to the line before `## Bug intake`, its four
subsections included. `tanto-sweep-2`'s 1.4 rewrites its step 2, step 3, and
Exit shoroku step 3 first, and its 2.3 the dispatch name; this replacement
supersedes those edits, and the plan quotes the landed section whole
(section 9). The new text:

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
merge decision; on `main` for your own between-plans exit, the only stage
that lands there.

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

### 3.9 "Session lifecycle", the Delete table: four rows

The Say column of four rows; the When column is unchanged in each.

Sekkei's, the start of its Say column:

```text
Sekkei is done; ask for its deletion once the recommendation over its exit proposal is on disk — a Sekkei is never kept
```

→

```text
Sekkei is done; record its proposal's items and the spec's four sections as `pending` rows and ask for its deletion as soon as the proposal passes the form check — a Sekkei is never kept
```

Keikaku's:

```text
Keikaku is done; ask for its deletion once the recommendation over its exit proposal is on disk; a Keikaku
```

→

```text
Keikaku is done; record its proposal's items as `pending` rows and ask for its deletion as soon as the proposal passes the form check; a Keikaku
```

Kaiseki's:

```text
Kaiseki is done; ask for its deletion once the recommendation over its exit proposal is on disk, or keep it
```

→

```text
Kaiseki is done; record its proposal's items as `pending` rows and ask for its deletion as soon as the proposal passes the form check, or keep it
```

Jisso's, the whole row:

```text
| the final batch is accepted, T2's proposal is written, leftovers are clean, and the human has executed the merge decision | Jisso is done; ask for its deletion once the recommendation over that proposal is on disk, T2 being its exit |
```

→

```text
| the final batch is accepted, T2's proposal is written and passes the form check, and leftovers are clean | Jisso is done; ask for its deletion at once, T2 being its exit — the recommendation, the human's check, the apply, and the merge decision run with it gone, and a merge declined with fixes wanted is a new batch on a new Jisso either way |
```

The plan-closed row's When column changes, because Jisso's deletion now
comes before the close's steps 2 to 4 and the human's check between them
has no bounded latency:

```text
| Jisso is deleted and the ledger's Progress line says closed |
```

→

```text
| the close's apply is verified, the human has executed the merge decision, and the ledger's Progress line says closed |
```

Its Say column — the share, the archive move, the handover — is unchanged;
the plan's author checks that nothing in it names the recommendation or
Jisso's presence.

### 3.12 "Start", step 2: the root listing

The listing of `.tanto/` entries that are none of the known ones, as
`tanto-sweep-2`'s 6.4 landed it (section 9):

```text
   predecessors' `t0-*` and `exit-kanri-*` files; the human decides what to do
```

→

```text
   predecessors' `exit-kanri-*` files; the human decides what to do
```

A `t0-*` file left by a run before this design is then reported like any
other unknown entry, once, and the human says whether to keep it.

### 3.10 The Replace table

The five rows that say `run "Exit shoroku" first if the session is alive
and coherent` are unchanged: "Exit shoroku" is still the section, and its
steps now end at the form check.

### 3.11 "Recovery", one sentence

The sentence that marks every gone session's row dead, with an Events line
per row saying whether its exit shoroku ran and what was lost, is
unchanged: the proposal is what "ran" means.

## 4. `roles/sekkei.md` and `roles/keikaku.md`: the final boundary ends at the form check

`tanto-sweep-2`'s section 5 rewrites both files' review gates (its batch
C); none of those passages is one of these, and the plan's author re-greps
each on the landed tree (section 9).

### 4.1 `roles/sekkei.md`

**Step 1**, the dialogue sentence:

```text
brief writer reads it, and T1's shoroku takes it as an input — under this
```

→

```text
brief writer reads it, and the close's recommender takes it as an input — under this
```

**Step 2**, the report line:

```text
Then send Kanri one line with the report path: Kanri adopts from its Shoroku
candidates.
```

→

```text
Then send Kanri one line with the report path: Kanri records its Shoroku
candidates as `pending` rows.
```

(the plan quotes it as the file wraps it).

**Step 2**, the tenure paragraph's last sentences:

```text
idle. Kanri sends you no `exit:` at this boundary; it dispatches the
recommender at once, and the
plan is Keikaku's from then on.
```

→

```text
idle. Kanri sends you no `exit:` at this boundary; it checks the proposal's
form, records its items, and asks for your deletion at once, and the
plan is Keikaku's from then on.
```

**The exit bullet**, its middle:

```text
  **delta**. T1 has not run when you exit, so the proposal's first line says
  what it excludes — the spec, the spec review, and the dialogue, which T1
  reads for itself — and the items are the dialogue's rejected alternatives
```

→

```text
  **delta**. The close has not run when you exit, so the proposal's first
  line says what it excludes — the spec, the spec review, and the dialogue,
  which the close's recommender reads for itself — and the items are the
  dialogue's rejected alternatives
```

and its tail:

```text
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
  there: Kanri dispatches the recommender over your proposal, and once its
  recommendation is on disk Kanri asks the human to delete you; the deletion
  may lag that ask. If more work reaches you in that gap — a cold-read
```

→

```text
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
  there: Kanri checks the proposal's form, records its items as `pending`
  rows, and asks the human to delete you at once — no recommender runs before
  the topic's close, where your items are recommended and checked with
  everything else; the deletion may lag that ask. If more work reaches you in
  that gap — a cold-read
```

and, further down the same bullet, `a proposal you have
  named is never rewritten, because the recommender may already have read
  it.` → `a proposal you have named is never rewritten, because Kanri may
  already have recorded its items.` (the plan quotes the lines as the file
  wraps them).

### 4.2 `roles/keikaku.md`

**"What you take as your own"**, the dialogue sentence: `T1's shoroku takes
it as an input.` → `the close's recommender takes it as an input.`

**"Handoff"**, the paragraph's end:

```text
Then idle. Kanri sends you no `exit:` at this boundary. The `plan committed:`
```

→

```text
Then idle. Kanri sends you no `exit:` at this boundary; it checks the
proposal's form, records its items, and asks for your deletion at once. The
`plan committed:`
```

**The exit bullet**:

```text
  process, and the defects noticed. Then stop there: Kanri
  dispatches the recommender over your proposal, and once its recommendation
  is on disk Kanri asks the human to delete you; the deletion may lag that
  ask, and work that reaches you in the gap — a report that conflicts with
```

→

```text
  process, and the defects noticed. Then stop there: Kanri checks the
  proposal's form, records its items as `pending` rows, and asks the human
  to delete you at once — no recommender runs before the topic's close,
  where your items are recommended and checked with everything else; the
  deletion may lag that ask, and work that reaches you in the gap — a report
  that conflicts with
```

and `a proposal you have named is
  never rewritten, because the recommender may already have read it.` → the
same replacement as Sekkei's.

## 5. `roles/jisso.md` and `roles/kaiseki.md`: the proposal is a pointer list plus the delta

### 5.1 `roles/jisso.md`, "T2 and the exit"

The first paragraph's `and you do not talk to the human unless Kanri grants
it. So you write the proposal and stop there: the recommendation, the
human's check, and the apply are dispatched work of Kanri's, and none of it
waits on you.` is right and stays.

**Propose**:

```text
**Propose.** On Kanri's T2 prompt, run `shoroku` in file mode over the
conductor ledger, inline in this session, up to the proposal. Write the
numbered list to `shoroku-proposal.md` in the topic directory,
`.tanto/<topic>/`, **instead of printing it**, seeded by the conductor
ledger's adopted `S-n` rows whose Written column says `no` — so nothing is
proposed twice — and extended from your own context. Then send Kanri one line
with the path, and idle.
```

→

```text
**Propose.** On Kanri's T2 prompt, write the numbered list to
`shoroku-proposal.md` in the topic directory, `.tanto/<topic>/`, **instead
of printing it**, in two parts: first the conductor ledger's `pending`
`S-n` rows listed by number, one line each, **without re-quoting them** —
the close's recommender reads each from the source its row names, and
nothing you copy would be read twice; then, from your own context, what no
file holds — the SDD ledger's rulings, parked findings, and deferred minors
as you understood them, and what the batch reports compressed. Open with
the line that says what the proposal excludes, as every proposal does.
Then send Kanri one line with the path, and idle: your deletion follows the
form check, and the recommendation, the check, and the apply run with you
gone.
```

The paragraph that follows, **Your exit**, keeps its text; its last sentence
`Then idle: you
apply nothing and commit nothing at your exit, and your deletion follows the
proposal.` is right as it stands.

### 5.2 `roles/kaiseki.md`, the attached exit

```text
idle: the recommendation, the human's check, and the apply are dispatched
work, and your deletion follows.
```

→

```text
idle: your items are recommended and checked at the topic's close, with
everything else, and your deletion follows the form check.
```

## 6. `roles/kikaku.md` and `roles/hosa.md`

### 6.1 `roles/kikaku.md`: four handlings, and the file that answers a check

**"The output"**, the handlings paragraph:

```text
Kanri's handling is one of three, and the file's third section is where you
say which one you expect: a topic in its spec stage relays it as the next
`I-n` in that topic's `spec-inputs.md`; between plans it is a T0 input
document; otherwise it is a source row in the `S-n` table. Nothing else
carries the discussion forward, so what you leave out of the file is lost.
```

→

```text
Kanri's handling is one of four, and the file's third section is where you
say which one you expect: a topic in its spec stage relays it as the next
`I-n` in that topic's `spec-inputs.md`; between plans it is the next
topic's input document, read by that topic's Sekkei directly; a file whose
third section names a stage's recommendation and answers it by exception
is that stage's Check answer, read whole by Kanri, which writes the
direction from it — the item numbers are the recommendation's, everything
not listed is as recommended, and every override carries its reason;
otherwise it is a source row in the `S-n` table. Nothing else carries the
discussion forward, so what you leave out of the file is lost.
```

`templates/kikaku-decision.md`'s matching placeholder (section 7.5) says
the same four.

### 6.2 `roles/hosa.md`: the close is a chore

Three passages. **"Whose work you take"** gains a third paragraph after
Kanri's (anchored on the line `You make the edit and nothing around it.`):

```text
**The close's.** Sent as one line,
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`
— `<topic>` a topic word, or `kanri` for Kanri's own between-plans exit.
This is the topic's one shoroku stage, and you run its three dispatched
steps while Kanri goes on. Read the ledger's Shoroku candidates table for
the `pending` rows and the source each names; dispatch
`subagent_type: tanto-shoroku-recommend` in the `shoroku` skill's recommend
mode over the proposal and every one of those sources, with `docs/` as the
baseline, the recommendation path, the brief path, the template
`templates/shoroku-brief.md`, and the chat's language; check the brief's
form by `grep` as `roles/kanri.md`'s Check step says — the four headings
in order, every `###` heading of the recommendation once after `See:` —
and on a failure dispatch once more, then paste it as it stands; give the
human, here, the recommendation's path, the brief's path, the three
counts, and the brief's text verbatim, and take the answer as the `shoroku`
skill parses it — `OK`, the numbers that go the other way, or an edit — or
a `decision: <path>` line Kanri relays, which is the answer read whole;
write the direction file beside the recommendation, item by item; dispatch
`subagent_type: tanto-shoroku-apply` in apply mode with the recommendation,
the direction, and the subject, in the slot the line gave — no
`slot-needed:` is sent, the slot is in the line; and answer Kanri
`close done: <commit subject> — <reading>`. When the brief fails its form
twice, or the human does not answer, answer `close blocked: <one line>`
instead and idle. Kanri verifies the commit and writes the ledger; you
write neither.
```

**"Not yours"**, replaced whole:

```text
## Not yours

The candidates and the ledger. You never write a proposal or an `S-n` row:
the session that holds the candidates writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` line, and only a subagent applies them.
```

**"Models"**, replaced whole:

```text
## Models

Any subagent you dispatch takes `subagents.default`, except the close's
two: the recommender takes `subagents.shoroku.recommend` and is dispatched
as `subagent_type: tanto-shoroku-recommend`, the apply
`subagents.shoroku.apply` as `subagent_type: tanto-shoroku-apply`. You never
omit the model.
```

The role's first paragraph — "A place to hand small jobs you can forget
right away" — stays; a close is the one job that waits on the human, and
the line says so.

## 7. The templates

### 7.1 `templates/tanto.json`

The `subagents` map's line `"shoroku": { "model": "opus", "effort": "medium" },`
becomes two lines, in its place:

```text
    "shoroku.recommend": { "model": "fable", "effort": "high" },
    "shoroku.apply": { "model": "opus", "effort": "medium" },
```

Thirteen entries; the note's check 8 asserts the count (section 8.3).

### 7.2 `templates/agent.md` and the rendered set

The template is unchanged. The rendered set the start sequence writes
gains `tanto-shoroku-recommend.md` (`effort: high`) and
`tanto-shoroku-apply.md` (`effort: medium`) and loses `tanto-shoroku.md`,
which the start sequence removes (2.1). `tanto-project-config` adds a
`<scope>` slot to the template first (section 9); the rendered names are
the same under it.

### 7.3 `templates/kanri.md`

**The Shoroku candidates columns paragraph**, its Stage clause as the file
wraps it:

```text
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`, as in
`exit-jisso-B`, `exit-sekkei`, `exit-keikaku`, `exit-kaiseki-1`, and
`exit-kanri-<YYYY-MM-DD>-<name>`; Written, `no` or the subject of the commit
```

→

```text
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t2` for every row of this table, whichever moment raised
it, since the close is the one stage that recommends a ledger's rows, and
`exit-<role>[-<suffix>]` names a proposal file, never a Stage value; Written,
`no` or the subject of the commit
```

and its Source clause (one line in the file):

```text
the report or session that raised it;
```

→

```text
the file the candidate lives in and its place there — a report and its item, a proposal and its number, the spec and a section heading — so that the close's recommender can follow it;
```

**The paragraph that begins `Nothing is adopted here by a ruling.`**,
replaced whole:

```text
Nothing is adopted here by a ruling. Every row arrives `pending` — from a
batch report's Shoroku candidates, a Kaiseki report's
`blocks this task: no` items, a review report, a session's exit proposal,
the spec's four sections, or a Kanri exit that fell while this ledger was
open — and stays `pending` until the close. At the close Kanri dispatches
the `shoroku.recommend` kind over Jisso's proposal and every source these
rows name, to write `t2-recommendation.md` and `t2-brief.md`; gives the
human both paths, the three counts, and the brief verbatim; and writes
`t2-direction.md` from the human's answer, and these rows with it, Adopted
`yes` or `no` as the direction says. No item is put to the human apart from
the rest and none is settled by Kanri alone: the human sees the whole list,
grouped, once, and answers by exception.
```

**The next paragraph**, replaced whole:

```text
Every write-out, T2 included, writes only the adopted rows whose Written column
says `no`, and fills that column with the commit subject. So nothing is written
twice, and T2 keeps everything adopted but not yet written.
```

→

```text
The close writes only the adopted rows whose Written column says `no`, and
fills that column with the commit subject; a row a Kanri exit recorded here is
written by this topic's close like any other. So nothing is written twice.
```

**The Progress placeholder** is unchanged; the Session events placeholder,
as the file wraps it:

```text
  a bug report triaged and its outcome; an exit shoroku committed, or not run
  and what was lost; a human access grant and the human-access: done line that
```

→

```text
  a bug report triaged and its outcome; an exit proposal form-checked and its
  rows recorded, or an exit shoroku not run and what was lost; a human access
  grant and the human-access: done line that
```

### 7.4 `templates/kanri-handover.md`

**"Not reconstructed"**, the placeholder:

```text
- <A shoroku candidate the outgoing Kanri could not classify or reconstruct at
  its exit, one line each, for the successor to raise at its first boundary.
  Write "none" when there is none.>
```

→

```text
- <The ledger that holds the outgoing Kanri's exit rows as `pending`, by
  path, when a ledger was open at the exit; then a shoroku candidate the
  outgoing Kanri could not classify or reconstruct, one line each, for the
  successor to raise at its first boundary. Write "none" when there is
  none.>
```

**"In flight"** gains one bullet after the agents bullet, anchored on the
line that ends `lost with this session`:

```text
- A close delegated to Hosa — <`<topic>` or `kanri`, Hosa's `<name> [<ref>]`,
  the `close:` line's paths and subject, and whether `close done:` has
  arrived, or "none">; the successor verifies the commit on `close done:`
  and fills the ledger, or the roster for a Kanri exit
```

**"Live peers"**: the sentence saying the successor sends its address line
to all of them is unchanged; a Sekkei or Keikaku already deleted after its
form check is not a live peer and is not listed, and a Hosa holding a
delegated close is listed with that as what it is waiting for.

### 7.5 `templates/roster.md` and `templates/kikaku-decision.md`

`templates/roster.md`, the Shoroku candidates paragraph's Stage clause, as
the file wraps it:

```text
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word —
`t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`; and Written `no` or the subject
```

→

```text
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word —
`exit-kanri-<YYYY-MM-DD>-<name>` for a row a between-plans Kanri exit
recommends, and `t2` once a row moves into a ledger; and Written `no` or the subject
```

`templates/kikaku-decision.md`, the third section's placeholder:

```text
<Which of the three handlings you expect, and for which topic: the next
`I-n` in that topic's `spec-inputs.md` while the topic is in its spec
stage; a T0 input document between plans; or a source row in the `S-n`
table. Kanri rules; this is what you expect, and why.>
```

→

```text
<Which of the four handlings you expect, and for which topic: the next
`I-n` in that topic's `spec-inputs.md` while the topic is in its spec
stage; the next topic's input document between plans; a stage's Check
answer, when this file names that stage's recommendation and answers it by
exception — item numbers the recommendation's, everything not listed as
recommended, every override with its reason; or a source row in the `S-n`
table. Kanri rules; this is what you expect, and why.>
```

## 8. The READMEs and `docs/notes/tanto-consistency-checks.md`

### 8.1 `skills/tanto/README.md`

The prerequisite bullet:

```text
- **A `kisou`-style `docs/` system** in the target repo, for the `shoroku`
  write-out at T0, T1, and T2. Without `docs/AGENTS.md` the adopted candidates
```

→

```text
- **A `kisou`-style `docs/` system** in the target repo, for the `shoroku`
  write-out at each topic's close. Without `docs/AGENTS.md` the adopted candidates
```

"Relationship to kisou, shoroku, and superpowers", the sentence:

```text
`tanto` decides **when** it is filled and how each filling is checked: at
every stage the session holding the candidates writes them, `shoroku`
recommends in a subagent, the human answers by exception, and `shoroku`
applies and commits the accepted subset.
```

→

```text
`tanto` decides **when** it is filled and how each filling is checked: at
every exit and every boundary the session holding the candidates writes
them, and once per topic, at its close, `shoroku` recommends in a subagent
on the top family, the human answers by exception, and `shoroku` applies
and commits the accepted subset on a cheaper one.
```

The designs list at the end of that section gains this spec's path at its
end (the list stops at `2026-09-12-tanto-cost-design.md` today; whether
`tanto-context-ceiling`'s and `tanto-sweep-2`'s were added by their own
drift reviews is what the landed tree says). What else drifts — the feature bullets' "recommend and
apply halves", the definitions sentence's count — is the drift review's to
find, in the task that lands the READMEs.

### 8.2 `skills/shoroku/SKILL.md` and `skills/shoroku/README.md`

`skills/shoroku/SKILL.md`, recommend mode's first sentence (Fixed input
15):

```text
**Recommend mode.** Invoked with a source — a file, or a file and the names
of the sections to read — and an output path. Run the workflow up to the
```

→

```text
**Recommend mode.** Invoked with one or more sources — each a file, or a
file and the names of the sections to read — and an output path; a caller
that names several reads every one, since the proposal it writes is the
only proposal there is. Run the workflow up to the
```

The rest of the section, the group headings included, is unchanged; the
consistency note's check 18 pairs those headings with `tanto`'s side and
is unaffected.

`skills/shoroku/README.md`: a drift review only; the recommend/apply bullet
describes the halves without naming `tanto`'s stages or the source count,
and is expected to stand. The reviewer records "no drift" or the fix.

### 8.3 The consistency note

Five edits and one new entry.

**Check 8's `node -e` line**: `k.length!==12` → `k.length!==13`; its
Expected paragraph's `` `tanto.json ok 7 12`; `` → `` `tanto.json ok 7 13`; ``
(one line in the file); and its explanation `the twelve kinds,` → `the
thirteen kinds,`. `tanto-project-config`'s Task 7 edits check 8 first for
the project layer and leaves the count at 12 (section 9); the plan quotes
the landed lines.

**Check 8's tenth-needle explanation** (wrapped in the file; the plan quotes
the lines):

```text
`default` survives as one of the twelve kinds
```

→

```text
`default` survives as one of the thirteen kinds
```

**The write-out lane paragraph** (line 145 at the time of reading):
`T1, T2 and every exit shoroku write ADRs, design entries and issue
resolutions` → `the close of every topic writes ADRs, design entries and
issue resolutions`.

**Check 20's enumerations**: its eleven greps carry no kinds enumeration
(measured by the spec review), so nothing there moves; the plan re-runs the
check as it stands.

**A new check, `## 22. The two shoroku kinds, and the stage word that is left`**,
appended after 21 in the note's one numbering run: three `grep -c` lines
whose expected values the plan records —
`grep -c 'subagent_type: tanto-shoroku-recommend' skills/tanto/roles/kanri.md`
→ at least `1`, and `grep -c 'subagent_type: tanto-shoroku-apply' skills/tanto/roles/kanri.md`
→ at least `2` (`SKILL.md` names the kinds, not the `subagent_type`
spellings, and is not in these two);
`grep -cE 'tanto-shoroku([^-.]|$)' skills/tanto/SKILL.md skills/tanto/roles/kanri.md`
→ `0` (the `.` is excluded so that 2.1's `tanto-shoroku.md` removal
sentence is not a hit; `subagent_type: tanto-shoroku` followed by a space
or a period-and-space is);
`grep -cE '\bt[01]\b|\bT[01]\b' skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md skills/tanto/templates/*.md`
→ `0` — which 3.12 makes true for `roles/kanri.md`, whose root listing
carried `` `t0-*` `` (the note itself and `docs/` are outside the scope,
for the reason check 10's paragraph gives: a record whose subject is "we
stopped saying X" must quote X); and a fourth,
`grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md`
→ `1` in each, which pins the `close:` line's three copies to one
spelling, as check 21 asks of a named mechanism. Two lesson lines under it: from "Measured
while designing", a definition-vs-template comparison through `$(...)` on
Git Bash strips the CR and reports every CRLF file as differing, so compare
with `tr -d '\r'` on both sides; and from the spec review, a retirement
needle has to be written against the new text as well as the old — two of
this spec's first needles matched strings its own new text writes
(`tanto-shoroku.md`) or its unedited text kept (`` `t0-*` ``), and only a
run of the grep against the draft found them.

## 9. Sites that depend on the two plans ahead of this one

Two plans rewrite sites this design edits before it lands:
`docs/superpowers/plans/2026-09-15-tanto-sweep-2.md`, committed and in
flight (batch B accepted at the time of writing), and
`tanto-project-config`'s plan, a draft on disk at
`docs/superpowers/plans/2026-09-15-tanto-project-config.md` whose spec is
`.tanto/tanto-project-config/spec-draft.md`, which lands third in the
order and before this topic. For each site, the old text this spec quotes
is that plan's replacement block or that spec's section, named by id, not
today's tree; the plan's author re-reads every one on the merged tree
before drafting, and a block that no longer reads as quoted is an open
point to Kanri, not a guess. Every other site is today's text, and the
same re-grep covers it, since both plans' old-value sweeps may move a line.

| This spec's site | Rewritten first by | What this spec assumes of it |
| --- | --- | --- |
| 2.1 the `tanto-<kind>` sentence | `tanto-sweep-2` 2.3 (landed, batch B) | ends with the two names, `tanto-shoroku` and `tanto-default`, and a period |
| 2.1 the skill-name-key bullet, the definitions paragraph, the count line, the Resuming sentence | `tanto-project-config` 1.6, 2.2, 2.5, 4.1 | the kinds are still enumerated by name in the `subagents.<kind>` bullet; "twelve" is the count at every site it writes |
| 2.2 "Session exit" whole | `tanto-sweep-2` 1.6 (batch D) | steps 2 and 3 and the exit's `unsure` sentence read as that section's new texts; the section's heading and the `## Artifacts` heading after it are unchanged |
| 2.3 the recommendation row and the brief row | `tanto-sweep-2` 1.6, plan block P11.6 (batch D) | the recommendation row spells `Recommended adopt, Recommended reject, Unsure` as quoted; the brief row exists below it, with `for T0 and Kanri's own exit` in its Path column |
| 2.3 the `tanto-*.md` row and rule 6 | `tanto-project-config` 4.1 | unchanged by this spec; the count they carry, if any, becomes thirteen in the same task as 2.1 |
| 3.3 step 3 of "When the plan lands" | none | today's text |
| 3.4 step 6's exit sentences and step 7 (a) | `tanto-sweep-2` 2.1 and 2.3 (landed, batch B) | step 6 ends `("Exit shoroku", step 3); the apply waits for step 7.`; step 7 (a) names `subagent_type: tanto-shoroku` |
| 3.4 step 7's last sentence | none — `tanto-sweep-2` 2.1 names it as already right and leaves it | reads `your exit shoroku was step 6's proposal and slot (a)'s commit`, wrapped after `your exit` |
| 3.12 the root listing | `tanto-sweep-2` 6.4 (landed, batch B) | carries `` predecessors' `t0-*` and `exit-kanri-*` files `` |
| 3.7 the Live peers sentence | `tanto-sweep-2` 2.2 (landed, batch B) | the paragraph carries `marks the ones whose last line you had not answered` and ends with the recommender-dispatch sentence quoted |
| 3.7 Handover step 1 | `tanto-sweep-2` 2.1 (landed) | reads `step 7's slot (a) apply` |
| 3.8 "Shoroku" whole | `tanto-sweep-2` 1.4, 1.5, 2.3 (batches B and D) | step 2 carries the brief inputs, step 3 is the `grep` form check, Exit shoroku step 3 reads the brief's `## Unsure`; the section's heading and `## Bug intake` after it are unchanged |
| 3.9 the four Delete rows | none | today's text |
| 4.1, 4.2 the review-gate paragraphs near these passages | `tanto-sweep-2` 5.1–5.4 (batch C) | none of the quoted lines is in a passage that section rewrites; the plan re-greps each |
| 7.2 the rendered set | `tanto-project-config` 2.2, 4.4 | `templates/agent.md` carries a `<scope>` slot; the rendered names are unchanged |
| 7.3 the `Nothing is adopted here` paragraph | `tanto-sweep-2` 1.5 (batch D) | spells `Recommended adopt, Recommended reject, Unsure` |
| 8.3 check 8 | `tanto-project-config` Task 7, `tanto-sweep-2` 8.5 | the `node -e` line still asserts `k.length!==12`; the structural counts are what both plans left |
| 8.3 check 20 | `tanto-sweep-2` 8.3 (batch A, landed) | no kinds enumeration among its greps (measured); nothing to move |

## 10. The boundary, the batch cut, and rule 11

The files that change: `SKILL.md`; all seven role files (`kanri.md`,
`sekkei.md`, `keikaku.md`, `jisso.md`, `kikaku.md`, `hosa.md`, and
`kaiseki.md` for one sentence); five templates (`tanto.json`, `kanri.md`,
`kanri-handover.md`, `roster.md`, `kikaku-decision.md`) and the rendered
definition set; `skills/shoroku/SKILL.md` for one sentence; the two
READMEs; and `docs/notes/tanto-consistency-checks.md`. `templates/agent.md`,
`passage-check.js`, `reading.js`, and their tests do not change.
`docs/decisions/`, `docs/requirements/`, and `docs/issues/` are the close's,
not a task's.

This plan edits the skill its sessions run on (decision-5c8e, rule 11): a
session started mid-plan reads whatever is on disk. The plan names in its
Global Constraints and its Batches section the authority sentence and the
boundary from which a role may be started or replaced. Because the config's
kinds, the definition set, the contract's "Session exit", and Kanri's
"Shoroku" section must agree — a Kanri started between batch A and batch B
would read thirteen kinds and a Shoroku section that dispatches
`tanto-shoroku` — that boundary is the **final** one; Kanri's handover
proceeds when due and its successor takes the authority ruling from the
handover file. The run's own Kanri already runs under approach A by ruling
(`tanto-sweep-2` R-4, `tanto-project-config` R-4, and this topic's own,
which its Keikaku's landing ruling carries forward), so no stage of this run
switches form at a boundary: the text catches up with the practice.

The batch cut the plan is expected to make, three or four tasks each,
cross-file pairs in one task; the plan decides the exact cut and the review
checks that no cut leaves the tree inconsistent at its boundary beyond what
rule 11 covers:

- **A — the contract and the config**: A1 `templates/tanto.json` and the
  definitions paragraph with its removal sentence, the count lines, and the
  `tanto-<kind>` clause (2.1, 7.1, 7.2); A2 "Session exit" whole, the
  Artifacts rows, and the roles table's Hosa row (2.2, 2.3, 2.4), with
  `roles/kaiseki.md`'s one sentence (5.2), `skills/shoroku/SKILL.md`'s
  input sentence (8.2), and the note's check 8 and tenth-needle lines
  (8.3), so that the count and the assertion move together; A3 the
  skill-name-key bullet and the unknown-key example (2.1), and the note's
  write-out lane paragraph.
- **B — `roles/kanri.md` and its templates**: B1 "Shoroku" whole, its
  "Delegation to Hosa" included, with `templates/kanri.md`'s two paragraphs
  and `templates/roster.md`'s stage line (3.8, 7.3, 7.5's roster half); B2
  Start steps 2 and 6, the decision-file handlings, "When the plan lands"
  step 3, the loop's three sites, "The final batch" step 3, the Kaiseki
  branch's two (3.1–3.6, 3.12); B3 the Handover's three sites with
  `templates/kanri-handover.md`'s two edits, and the Delete table's five
  rows (3.7, 3.9, 7.4).
- **C — the other seats and the READMEs**: C1 `roles/sekkei.md` and
  `roles/keikaku.md` (4.1, 4.2); C2 `roles/jisso.md`, `roles/kikaku.md`
  with `templates/kikaku-decision.md`, and `roles/hosa.md` (5.1, 6.1, 6.2,
  7.5's decision half) — `hosa.md`'s `close:` line and `roles/kanri.md`'s
  B1 must agree byte for byte, so the review of C2 re-greps the line in
  both; C3 the two READMEs' passages and drift review (8.1, 8.2's README
  half).
- **D — the sweep, the check, and the dogfood**: D1 the whole-tree
  old-value sweep and the `O` needles (Old values below), the note's check
  22 and its lesson line, and the checks 1 to 9, 16, and 18 to 22 re-run
  with output recorded; D2 the dogfood report,
  `docs/reports/<date>-shoroku-at-close-dogfood.md`, with the three
  measurements of this run: how many exits were form-checked and their
  sessions deleted with no recommender run; the close's one recommend —
  the number of sources the dispatch named, the number of items the
  recommendation quoted, and the subagent's token count; the number of
  human shoroku checks in the topic, expected `1`; and whether the close
  was delegated to a Hosa, with the time from Kanri's `close:` line to its
  handover file against the previous close's; plus the count of issues
  closed and the readings.

## Where each change lives

| File | Sections | Batch |
| --- | --- | --- |
| `skills/tanto/SKILL.md` | 2.1, 2.2, 2.3 | A |
| `skills/tanto/templates/tanto.json` | 7.1 | A |
| the rendered definition set (`$CLAUDE_CONFIG_DIR/agents/`) | 7.2 — by the start sequence, not by a task | — |
| `skills/tanto/roles/kaiseki.md` | 5.2 | A |
| `skills/tanto/roles/kanri.md` | 3.1–3.9 | B |
| `skills/tanto/templates/kanri.md` | 7.3 | B |
| `skills/tanto/templates/kanri-handover.md` | 7.4 | B |
| `skills/tanto/templates/roster.md` | 7.5 | B |
| `skills/tanto/roles/sekkei.md` | 4.1 | C |
| `skills/tanto/roles/keikaku.md` | 4.2 | C |
| `skills/tanto/roles/jisso.md` | 5.1 | C |
| `skills/tanto/roles/kikaku.md` | 6.1 | C |
| `skills/tanto/roles/hosa.md` | 6.2 | C |
| `skills/tanto/templates/kikaku-decision.md` | 7.5 | C |
| `skills/shoroku/SKILL.md` | 8.2 | A |
| `skills/tanto/README.md`, `skills/shoroku/README.md` | 8.1, 8.2 | C |
| `docs/notes/tanto-consistency-checks.md` | 8.3 | A (check 8, the lane paragraph), D (check 22, the re-run) |
| `docs/reports/<date>-shoroku-at-close-dogfood.md` | 10 | D |

## Old values this plan contradicts

The `O` needles the plan's final sweep refuses over `skills/tanto/`,
`skills/shoroku/`, and `docs/notes/tanto-consistency-checks.md`, each with
the disposition the sweep expects. `docs/` beyond the note is outside the
sweep, for the reason the note's check 10 gives.

| Needle | Where it may survive | Disposition |
| --- | --- | --- |
| `"shoroku":` as a `subagents` key | `templates/tanto.json` | `0` |
| `tanto-shoroku` followed by neither `-` nor `.` | `SKILL.md`, `roles/kanri.md` | `0` (2.1's `tanto-shoroku.md` is the one survivor, by design) |
| `tanto.json ok 7 12` | the note | `0`; `ok 7 13` |
| `twelve kinds`, `twelve names`, `twelve-definitions`, `twelve agent` | `SKILL.md`, `roles/kanri.md`, the note, the README | `0`; `thirteen` in each place |
| `T0` as a stage (`T0 write-out`, `T0 input`, `T0 shoroku`, `T0 (`) | the contract, `roles/kanri.md`, `roles/kikaku.md`, `templates/kikaku-decision.md`, the README | `0` |
| `T1` as a stage (`Run T1`, `T1's shoroku`, `T1 has not run`, `T1 (`, `, T1`) | the contract, `roles/kanri.md`, `roles/sekkei.md`, `roles/keikaku.md`, the README, the note | `0` |
| `t0`, `t1` as stage words (backticked), and `` `t0-*` `` | the contract, `roles/kanri.md`, `templates/kanri.md`, `templates/roster.md` | `0` |
| `t0-recommendation.md`, `<stage>-recommendation.md`, `<stage>-direction.md`, `<stage>-brief.md` | the contract, `roles/kanri.md`, `templates/kanri.md` | `0`; `t2-` or the Kanri exit name in each place |
| `once the recommendation over` | `roles/kanri.md` | `0` |
| `dispatches the recommender at once`, `dispatch its recommender`, `the recommender dispatch` | the contract, `roles/kanri.md`, `roles/sekkei.md`, `roles/keikaku.md` | `0` |
| `question back to the session`, `could not be read as written` | the contract, `roles/kanri.md` | `0` |
| `Do the T0 write-out` | `roles/kanri.md` | `0` |
| `handling is one of three` and `the three handlings` | `roles/kanri.md`, `roles/kikaku.md`, `templates/kikaku-decision.md` | `0`; `one of four` (the bare `one of three` has two legitimate survivors, the hotfix lane's three paths and the contract's three ways an address reaches a role) |
| `at every stage` (of the write-out) | `templates/kanri.md`, the README, `roles/kanri.md` | `0` where it means the stages; the plan reads each hit |
| `recommendation, the human's check, and the apply are dispatched` | `roles/kaiseki.md` | `0` |
| `idles through one recommender run` | the contract, `roles/kanri.md` | `0` |
| `You never write a recommendation, a direction` | `roles/hosa.md` | `0` |
| `Invoked with a source` | `skills/shoroku/SKILL.md` | `0` |

## Requirements

This design serves req-04f5, adds no requirement, and **changes two
bullets**. Their wording after the close, for the brief and the reviewer to
confirm — the original followed by the change:

Each is quoted as the file wraps it, and each change is one clause; the
rest of the bullet stands, its bold lead included. The family the
recommend half runs on, the proposal file, and the Kikaku channel are
mechanism, not requirement, and live in the ADRs and design-4807.

"The human is interrupted only at defined checkpoints", its third clause:

> the shoroku recommendation at each stage, answered by exception — `OK` as
> recommended, or the items that go the other way; and the merge decision.

becomes

> the shoroku recommendation once per topic, at its close, answered by
> exception — `OK` as recommended, or the items that go the other way; and
> the merge decision.

"Docs are kept current as part of the flow", its first sentence:

> - **Docs are kept current as part of the flow.** Excerpting into the project's
>   `docs/` happens at staged points of the run, not as an afterthought, and the
>   human confirms what lands without having to read every item cold.

becomes

> - **Docs are kept current as part of the flow.** Excerpting into the project's
>   `docs/` happens once per topic, at its close, not as an afterthought, and the
>   human confirms what lands without having to read every item cold.

The bullet's two further sentences — every planned exit carries its own
shoroku before the human closes it, and a forced exit's record says what
was lost — are unchanged and still true: the shoroku an exit carries is
its proposal, and decision-d831 stands.

The bullets served, by section: "The human is interrupted only at defined
checkpoints" — section 1 (one check per topic), 3.2 and 6 (a decision file
as the answer); "A run is affordable to keep running" — 3.5, 3.9, 4, 5
(every seat leaves at its form check; no recommender runs but the close's);
"Model discipline" — 2.1, 7.1, 7.2 (two kinds, two definitions, the old key
reported); "State lives in files, not in sessions" — 3.8, 7.3, 5.1 (the
`pending` row is a pointer, and the proposal is a pointer list plus the
delta); "Kanri is resident, but its context cost does not grow with its
tenure" — 3.7 and the delegation in 3.8 (Kanri's in-plan exit is a file and
rows, no stage of its own, and the close's three steps and the human's
check latency leave Kanri's tenure for Hosa's); "The human's counterpart is
Kanri" — 2.4 and 6.2 (the close's check reaches the human in Hosa's window
under the chores grant Kanri gave at the handshake, which is the bullet's
own exception); "Docs are kept current as part of the flow" — the cost
accepted in section 1, the recommend half's family, and 8.2.

## The ADRs

Three decisions with rejected alternatives, for the close to write as
`decisions/` entries if the recommender agrees:

1. **The human's shoroku check runs once per topic, at its close; every
   other moment writes candidates only.** Amends decision-ce83 (the four
   steps "at every stage of the write-out — T0, T1, T2, and every exit"
   become the four steps at one stage) and decision-d538 (Kanri "dispatches
   the recommender at once" becomes "checks the form and asks for the
   deletion at once"); decision-d831 stands — every planned exit still
   carries its own shoroku, as a proposal on disk. T0 is folded in. The
   `question back to the session` path is dropped, and with it the
   recommender run before a deletion. Alternatives: B, the stages as they
   are with only the model and the brief changed (rejected: leaves six
   synchronous waits and the held applies); C, the check answered by
   silence (rejected: the reject group is then read by no one, and T1 item
   11 of 2026-09-14 shows a recommended reject can be wrong in a way only a
   source read catches — reconsider once a fable recommendation's reject
   group has been measured against the human's overrides across a few
   topics); Kikaku as the formal recommender (rejected: interactivity was
   10% of the reason, the follow-ups are small); keeping the recommender
   run before a Sekkei's or Keikaku's deletion (rejected: its only purpose
   is a path that has never fired); Jisso kept through the merge decision
   (Q3, rejected: nothing the merge needs is in Jisso's context). Cost:
   `docs/` lags a topic's spec and plan until its close. Evidence: the
   decision file's section 0 — six checks per topic, four applies held for a
   slot in one day, the question-back path's zero count, 52 KB of
   recommendation text, three checks answered through Kikaku.
2. **The `shoroku` kind is two kinds, `shoroku.recommend` on the top family
   and `shoroku.apply` on a cheaper one.** Amends decision-03f9 (the twelve
   kinds, and one `shoroku` kind carrying one model and one effort) and, in
   one clause, decision-9a3a, whose sense of a skill-name key 03f9 said
   `shoroku` had "exactly": the key's `<object>` is now the skill and its
   `<act>` the mode, so a skill with two modes has two keys.
   Alternatives: both halves on fable (rejected: the apply is a mechanical
   write of the accepted subset, one per topic and larger than today's —
   the wrong place for the top family); both on opus as today (rejected:
   the human's 50% is the recommendation's judgment, and the read that
   overturned T1 item 11 is the kind fable makes and opus did not); an alias
   for the old key (Q4, rejected: a second overlay mechanism for one line in
   one start line). Consequence: issue-52fd's measurement now bears on
   `shoroku.apply`; the definitions gain two files and lose one.
3. **A Kikaku decision file whose third section names a stage's
   recommendation and answers it by exception is that stage's Check
   answer.** Alternatives: the human's word in Kanri's window only
   (rejected: three times on 2026-09-14 the human brought the
   recommendation to Kikaku, read it there with its sources, and said
   "送って"; the ruling that took the file as the answer was improvised three
   times — R-26 in `tanto-context-ceiling`, R-3 in `tanto-sweep-2`, R-3 in
   `tanto-project-config`); Kikaku writing the direction file itself
   (rejected: Kikaku writes under `.tanto/kikaku/` and nowhere else, and the
   direction is Kanri's file beside the recommendation). Consequence: the
   handlings of a decision file are four, and the template's third section
   says so.

4. **The close's recommend, check, and apply are a live Hosa's, and Kanri
   hands over without waiting for them.** Alternatives: Kanri runs the
   three steps itself, as this spec first drafted (rejected by the human
   after the review: the human's check has unbounded latency, and every
   minute of it and every file of it sat in Kanri's tenure and context
   between the final batch and the handover — "Kanri はさっさと handover
   した方がスループットが上がる"); Hosa pastes the brief and returns the
   answer only (Q5 B, rejected: Kanri still dispatches both subagents and
   still waits); a new seat for the close (rejected: Hosa exists, is on a
   cheap family, and already holds the human's chores grant in its own
   window); Kikaku (rejected: the human's own seat, which writes under
   `.tanto/kikaku/` and nowhere else). Consequences: a Hosa is worth
   opening before a close, and Kanri's close line says so; the successor
   inherits a delegated write-out where it inherited a verified commit, and
   the handover file names it; `roles/hosa.md`'s "Not yours" narrows from
   "the shoroku write-outs" to the candidates and the ledger.

The other choices here — the stage word kept, the Source column's shape,
the close's file names, the in-plan Kanri exit's ledger, the `close:`
line's form — are consistency choices with one reasonable side and are
recorded in the plan's block rationales, not as ADRs.

## What the plan must contain

- **Every passage in this spec as a block the instrument checks**: old text
  quoted from the merged tree, new text as given here, one anchor for an
  insertion, and the two headings for a section replaced whole. The plan's
  author re-greps every old text — section 9's sites on the tree after
  `tanto-sweep-2` merges and `tanto-project-config` lands, every other site
  on today's — and a mismatch is an open point to Kanri, not a guess.
- **Global Constraints** that restate rule 11's authority sentence, the
  final boundary as the one from which a role may be started or replaced,
  the models for Jisso's four kinds, and that the run's own Kanri already
  runs under approach A by ruling, so no stage of this run switches form.
- **A batch cut** as section 10 expects, or a better one the plan
  justifies, with the review checking that every cross-file pair lands in
  one task: `tanto.json` with the count lines and check 8; "Session exit"
  with the Artifacts rows; "Shoroku" with `templates/kanri.md` and
  `templates/roster.md`; the kikaku handlings with the template.
- **The `O` sweep** as the last content task, over the three scopes named,
  with every needle's disposition recorded, and the note's checks re-run.
- **The dogfood report** with the three measurements of section 10, the
  issue closed, and the readings.
- **No task under `docs/decisions/`, `docs/requirements/`, or
  `docs/issues/`**: those are the close's.

## Verification

- Every passage block resolves exactly once on the tree it is applied to
  (`passage-check.js lint` and `replay`, Keikaku's dry run).
- At every boundary: `boundary --plan`, `diff --base <the resolved merge
  base>` clean, lint clean on the changed paths named individually,
  `mise x node@22 -- node --test skills/tanto/scripts/` passing (both
  scripts are unchanged; the suite guards that they are).
- At batch A's boundary: check 8's `node -e` line prints
  `tanto.json ok 7 13`; a fresh `/tanto` start on any role writes
  `tanto-shoroku-recommend.md` and `tanto-shoroku-apply.md` and removes
  `tanto-shoroku.md`, and its start line says `agents: 13 current` or
  `11 current, 2 written` — the human runs one and reports the line.
- At batch B's boundary: `grep -c 'tanto-shoroku-recommend\|tanto-shoroku-apply' skills/tanto/roles/kanri.md`
  is at least `2`; `grep -cE 'tanto-shoroku([^-]|$)'` on it is `0`; the
  Delete table's four rows read as 3.9.
- At batch D's boundary: every `O` needle at its stated disposition; check
  22 prints its recorded values; the dogfood report exists.
- After the plan lands, this run's own close is the first run of the text
  it wrote: one recommend over every source, one check, one apply on the
  branch; the dogfood report cannot record it (it is written before the
  close), so the ledger's Measurements table does.

## Out of scope

- `skills/shoroku/SKILL.md` beyond its recommend-mode input sentence (8.2,
  the review's F-23 resolved as A): its recommend and apply modes are what
  the two kinds dispatch, unchanged.
- The check brief's form and template — `tanto-sweep-2`'s section 1.
- `scripts/reading.js`, `scripts/passage-check.js`, and their tests.
- The project overlay of `tanto.json` and the project-scope definitions —
  `tanto-project-config`.
- The `t2` name (Deferred items).
- The external shoroku-extraction rethink Kikaku holds eighth in the order.

## Issues this design closes

- **issue-19d4** — decided by decision-d538 and landed by
  `tanto-context-ceiling`'s Tasks 11 to 13; still open in
  `docs/issues/open/`. This plan's `O` sweep confirms no site still has a
  Sekkei or Keikaku waiting for an `exit:` line at its final boundary, and
  the close moves the issue to `resolved/` with that as the resolution
  note.

## Issues already closed by earlier work

None found beyond issue-19d4; issue-52fd, issue-7ba4, issue-c17a, and
issue-e916 are `tanto-sweep-2`'s and are not touched here, except that
issue-52fd's subject becomes `shoroku.apply` (Deferred items).

## Answers to the spec inputs

No `spec-inputs.md` was written for this topic; the decision file was the
input, read directly (ledger R-2), and Kanri's orders line carried the one
point that would otherwise have been an `I-1` — the baseline is the tree
after `tanto-sweep-2` merges (Fixed input 10).

## Deferred items

- **The stage word `t2` with no T0 or T1** (Q1, "扱って"): kept here to keep
  the sweep small; `tanto-diet`, which rewrites the role text for length,
  renames it if it renames anything, with the ledgers' old rows left under
  the old word.
- **issue-52fd** stays open with its subject re-pointed: the second
  measurement's first variable is `shoroku.apply` on `sonnet`, the
  recommend half being on `fable` by this design.
- **Approach C, the check answered by silence**: reconsidered once a fable
  recommendation's reject group has been measured against the human's
  overrides across a few topics (the decision file, section 8).
- **The `docs/` lag** until a topic's close: accepted; if a concurrent
  topic's Sekkei is ever misled by a stale `docs/`, that is the case for
  landing the spec's Requirements and ADRs earlier, and it is recorded then.
- **Kanri's in-plan exit rows across several open ledgers**: this design
  puts every row in one ledger (the in-flight topic's, else the oldest
  open); an item that plainly belongs to another open topic is still
  recorded there and named `<topic> S-n` from the other, as the ledger
  rule already allows. Splitting rows by topic at the exit is not done,
  because the outgoing Kanri is the seat least able to afford the read.

## The reviews this spec has had, and what each found

**The spec review** (`spec.review` on opus, 2026-09-15,
`.tanto/shoroku-at-close/spec-review.md`, twenty-three findings over hash
`e1b11c48…`): four blocking, nine should-fix, eight minor, two scope.
Adopted and in the text: F-1 (one Stage vocabulary — `t2` for every ledger
row, the exit word names a file; 2.2, 3.7, 3.8, 7.3, 7.5), F-2 and F-3
(check 22's greps scoped and the `.` excluded; 8.3, Old values), F-4 (the
root listing, 3.12), F-5 (the recommendation row's section 9 dependency),
F-6 and F-19 (both proposal rows quoted whole with one Readers value; 2.3),
F-7 (the `one of three` needle narrowed), F-8 (check 8's Expected
paragraph), F-9 and F-10 (the two requirement bullets quoted as wrapped,
one clause each, mechanism moved out), F-11 (the two fixed prefixes), F-12
(five old texts re-quoted as the file wraps them: 3.4, 4.2, 7.3 twice,
7.5), F-13's citation half (Fixed input 8 names design section 1), F-14
(batch labels), F-15 (the README list's end), F-16 (ADR 2 amends 9a3a's
clause), F-17 (`SKILL.md`'s "twelve" re-measured after
`tanto-project-config`), F-18 (the removal at both scopes), F-20 (the
README in check 22's third grep), F-21 (rule 5 discharged in 2.4), and
F-22 (the plan-closed Delete row keys on the merge decision; 3.9 — taken
as the wording of design section 1's order, not a new decision). F-23 is
a scope finding and went to the human, who chose A: `skills/shoroku/SKILL.md`'s
input sentence is in scope (Fixed input 15, 8.2). At the same exchange the
human raised the Hosa delegation (Q5), which sections 1, 2.2, 2.4, 3.5,
3.7, 3.8, 6.2, 7.4, and ADR 4 now carry; those passages were written after
the review and have had no reviewer, which the brief says.
The reviewer confirmed forty old texts exactly once on today's tree, the
section 9 sites as assumed with the qualifications now in the table, and
check 8's arithmetic. Its six shoroku candidates are carried in "Shoroku
candidates from this spec work".

## Shoroku candidates from this spec work

1. **Measured**: `scripts/reading.js` reads only the `ceiling` map, so the
   decision file's "reading.js's known-key list follows" named no site;
   the kinds are enumerated in prose, `tanto.json`, and check 8's
   assertion. A data point for the design entry on the expected-model
   config: where the kinds are actually pinned.
2. **Measured**: the definition-vs-template comparison through `$(...)`
   on Git Bash strips the CR and reports every CRLF file as differing;
   the twelve definitions on this host were current. A lesson line in the
   note (8.3), and a candidate for `docs/notes/` on Windows Bash pitfalls.
3. **Observation**: the human's personal `tanto.json` carried
   `{"subagents": {"shoroku": "fable"}}` — the model only — where the
   decision file's section 7 said `{ "model": "fable", "effort": "high" }`;
   the interim thus ran the recommend half on fable at the default medium
   effort. A data point for the dogfood of the interim, if anyone measures
   it.
4. **Rejected alternative**: renaming the stage to `close` (Q1) — every
   site that spells `T2` joins the sweep and the old rows keep the old
   word; deferred to `tanto-diet`.
5. **Rejected alternative**: Jisso re-quoting every `pending` item into
   its T2 proposal (Q2) — the re-quotation runs through Jisso's context,
   which the split exists to avoid.
6. **Rejected alternative**: Jisso kept alive through the merge decision
   (Q3) — nothing the merge needs is in its context.
7. **Rejected alternative**: the old `shoroku` key as an alias for both
   halves (Q4) — a second overlay mechanism for one start-line line.
8. **Observation**: Kanri's orders line for this topic stated the baseline
   and the scope up front, citing `tanto-sweep-2`'s Sekkei's clarify as
   the precedent, and no clarify round-trip was needed; the orders-line
   template could carry that sentence for every topic that runs behind
   another's in-flight plan.
9. **Observation**: this is the second spec written against a tree that
   does not exist yet, and the first written against two such plans, one
   of them a draft; section 9's table names the draft's spec sections
   rather than plan block ids because the draft plan's ids may still move.
   Whether that holds is for the Keikaku's re-grep to say — a data point
   for `tanto-sweep-2`'s candidate 2.
10. **Measured** (the spec review): two of this spec's first retirement
    needles matched strings the design itself writes (`tanto-shoroku.md` in
    the removal sentence) or leaves (`` `t0-*` `` in the root listing); a
    needle has to be written against the new text as well as the old. Now a
    lesson line under check 22.
11. **Measured** (the spec review): three `O` needles as first written —
    `one of three`, `at every stage`, `twelve` in `roles/kanri.md` — had
    legitimate survivors or were already zeroed by a plan ahead; a
    disposition of `0` stated without the count measured on the tree the
    check will run against is a boundary failure nobody intended.
12. **Measured** (the spec review): the Kikaku decision file cites
    "decision-19d4's mechanism"; `19d4` is an issue, and the decision is
    d538. Corrected silently in this spec's section 1 and ADR 1; a data
    point on checking a decision file's id references before Kanri relays
    them, for Kikaku's role file or `templates/kikaku-decision.md`.
13. **Observation** (the spec review): six of about sixty quoted old texts
    did not resolve, all for one cause — a wrapped line quoted as one — and
    a mechanical pre-flight (extract every fenced `text` block, match it
    against the file its section names) found all six in under a minute. A
    candidate for the Sekkei drafting conventions, or a `lint --spec` mode
    of `passage-check.js` for `passage-check-hardening`.
14. **Observation** (the spec review): this is the first spec whose
    section 9 depends on a plan that is a draft on disk and untracked, so
    every check of that dependency read an uncommitted file and none is
    reproducible from a hash — the reading side of candidate 9.
15. **Observation** (the spec review): decision-ce83's Consequences say
    "the most clerical of the twelve kinds" and decision-03f9's name "the
    `shoroku` apply half to `sonnet`"; both go stale with this design and
    both are outside the `O` sweep. Whether an ADR's Consequences are ever
    updated in place, or only amended by a later ADR, is written nowhere —
    a candidate for `docs/decisions/AGENTS.md`.
