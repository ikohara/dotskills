# Design: tanto's own state under `.tanto/` — one directory per topic, and the intake read from the roster

Every file `tanto` writes for itself — the roster and its archive, the
conductor ledger, the spec inputs and the dialogue, the briefs, the dry run,
the batch prompts and reports, the Kaiseki briefs and reports, the shoroku
proposals and directions, the exit and compaction files, the inbox, the
handover — sits today under `.superpowers/sdd/`, first in `<topic>/` and then
in `<plan-basename>/`, because the first design put Kanri's files "next to
Jisso's `progress.md`". That is a coupling to superpowers by location that
nothing in the contract asks for: another skill may write the spec or the
plan, and the SDD ledger is the only superpowers artifact tanto reads. This
plan moves tanto's own state to `<workspace>/.tanto/`, self-ignored and
self-lint-silenced, one directory per topic from its opening to its close, so
that the ledger move disappears; keeps the superpowers artifacts where
superpowers puts them and reaches them by pointer; and, because the roster's
path becomes fixed, lets a bug-report sender read the intake's address from
it instead of the human relaying a name by hand.

Everything here was settled in the spec dialogue
(`.superpowers/sdd/tanto-workspace/dialogue.md`, Q-1 to Q-6 and D-1 to D-3).
The plan inherits this document whole; Kanri and Jisso cold-read it. The
plan is written by a second Sekkei (ledger R-5), who cold-reads it too.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them whole.

1. **The scope is three tanto issues and one relayed input** (Q-1, A; I-2,
   Q-6 A): issue-0b97 (tanto's state under `.superpowers/sdd/`, coupled to
   superpowers by location, and the ledger move that follows), issue-6aa8
   (the editor's markdownlint flags the untracked workspace; closed from
   tanto's side), issue-f2c4 (the topic word and the plan basename name two
   directories; closed by one directory), and I-2, the bug-report sender
   reading the intake's address from the target workspace's roster
   (issue-b7d3 answered from the other side). Every other small tanto item
   Kanri's note lists (260c, 5a17, 2e52, 4f5c, 13a1, 2f17, 7c11, 58fe, 6a29)
   is out, and so is the Keikaku split (issue-3c7a). Serves req-04f5,
   "Composes without modifying" — superpowers is used as it is, and every
   override tanto needs is in tanto's own files, which now includes where
   they live — and, for I-2, "Trouble reports reach the repository's Kanri"
   and "The human is interrupted only at defined checkpoints".

2. **The layout is `<workspace>/.tanto/`, fixed, not configurable** (D-1;
   D-3): the roster, its archive, the handover, the inbox, and Kanri's own
   exit proposals at `.tanto/`; a standalone Kaiseki's reports at
   `.tanto/kaiseki/`; everything per topic at `.tanto/<topic>/`, named by
   the topic word, from the topic's opening to the plan's close. No key in
   `tanto.json` changes the name or the place: a configurable location would
   break the one lookup that has no configuration in hand, the roster's
   first row read by `/tanto resume`, a role started without an address, and
   a bug-report sender. Serves req-04f5, "State lives in files, not in
   sessions".

3. **Two files make the directory self-contained, and three writers write
   them** (D-1): `.tanto/.gitignore` holding `*`, and
   `.tanto/.markdownlint-cli2.yaml` holding `config:` and `  default: false`.
   Each is written only when absent and never overwritten. The writers are
   Kanri at its start (replacing today's check of
   `.superpowers/sdd/.gitignore`, which is superpowers' file and no longer
   tanto's business), a standalone Kaiseki when it creates `.tanto/kaiseki/`,
   and a bug-report writer placing a report under its own repository's
   `.tanto/`. The repository's own `.gitignore` is not touched, so no
   approval under `AGENTS.md` is needed, and the repository's
   `.markdownlint-cli2.yaml` is not touched either. Serves req-04f5,
   "Composes without modifying".

4. **The spec and the plan are reached by pointer; the default stays the
   superpowers convention** (Q-3, A). The contract's Artifacts table and
   Sekkei's "Where your files go" say "at the path the orders line names, by
   default `docs/superpowers/specs/<date>-<topic>-design.md`" and the same
   for the plan; Kanri's role file keeps the default and its topic-opening
   check against it; the template placeholders lose their
   `under docs/superpowers/...` qualifier. A tanto-native `docs/tanto/`
   (Q-3, B) was rejected because it widens the location coupling from
   `.superpowers/sdd/` to `docs/superpowers/`, needs a linter-configuration
   edit and a `docs/AGENTS.md` addition, and diverges from where
   brainstorming and writing-plans write by default; no default at all (Q-3,
   C) only moves the default into Kanri's head. Serves req-04f5, "Composes
   without modifying".

5. **The SDD ledger stays where the SDD skill puts it, and `<plan-basename>`
   survives only there** (D-1). `.superpowers/sdd/<plan-basename>/progress.md`
   is written by Jisso through `sdd-workspace`, read by Kanri, and named by
   path in the conductor ledger's Plan section, the batch prompt, the batch
   report, and the Kaiseki brief. Every other `<plan-basename>` path becomes
   `.tanto/<topic>/`. The ledger move at the plan's landing disappears, and
   with it the "topic directory beside the plan directory" state issue-12d3
   ruled on; the ruling itself — both stay, nobody is asked to delete either
   — stands, restated over `.tanto/<topic>/` and the SDD workspace. Serves
   req-04f5, "State lives in files, not in sessions".

6. **Only live state moves, and it moves at batch A's boundary** (Q-2, A;
   Q-5, A). When Kanri accepts batch A — the batch that lands every file a
   session loads — and before it writes batch B's prompt, it renames
   `roster.md`, `roster-archive.md`, `inbox/`, every
   `exit-kanri-*-proposal.md`, and this topic's `tanto-workspace/` from
   `.superpowers/sdd/` to `.tanto/`, writes the two files of input 3, and
   records the move in the roster's Events. The topic directories and plan
   workspaces of closed plans stay under `.superpowers/sdd/`, read-only
   records with no reason to move. From that boundary the skill's text and
   the state agree on where the state is; every later prompt and orders line
   names `.tanto/tanto-workspace/`. Copying the archive alone and
   bootstrapping fresh (Q-2, B) was rejected because it splits the archive's
   history and the inbox across two places; moving every old directory (Q-2,
   C) had no reason beyond symmetry. Moving at the close (Q-5, B) was
   rejected because a session started after batch A's boundary would read
   text that names `.tanto/roster.md` and find nothing there; moving before
   batch A (Q-5, C) inverts the same gap. Serves req-04f5, "State lives in
   files, not in sessions".

7. **The rule 11 boundary is batch A's, and "every file the plan touches" is
   read as every file a session loads** (Q-4, A). `SKILL.md`, the four role
   files, and the eleven templates are the files a session loads; the
   README and `docs/notes/tanto-consistency-checks.md` are read by people
   and by a plan's verification, never loaded by a session, and land in
   batch B. A role may be started or replaced from batch A's boundary;
   until then the authority for the run's sessions is the plan's Global
   Constraints, Kanri's orders line, and the batch prompts (contract rule
   11, ledger R-1). The plan expects no replacement at any boundary. The
   final boundary (Q-4, B) was rejected because it leaves the distinction
   between loaded and touched files unwritten, so the next plan of this
   shape asks the same question again. Serves req-04f5, "State lives in
   files, not in sessions" — a session started at the boundary reads a skill
   that agrees with itself and finds the state where it says — and rule 11
   (decision-5c8e).

8. **A bug-report sender reads the intake's address from the roster** (Q-6,
   A; I-2). The sender reads the first data row of
   `<workspace>/.tanto/roster.md` — Kanri's row — and takes the Name column
   as the intake's bare name; the human supplies the workspace's path where
   the sender does not know it, and no `readlink` route over the skill's
   link is written. Before sending, the sender checks that the name is in
   `ListAgents`; when it is not — a resumed Kanri has a new name and the row
   is rewritten only when Kanri notices — the sender asks the human for the
   address, which is today's route as the fallback. The roster stays Kanri's
   only file to write: a sender reads it and never corrects a row. A
   per-user registry (issue-b7d3 route 2, Q-6 B) was rejected because it
   adds a second address book beside the roster and a second staleness rule
   to contract rule 3. Serves req-04f5, "Trouble reports reach the
   repository's Kanri", and "The human is interrupted only at defined
   checkpoints".

9. **The plan is a passage plan, checked by the instrument, and every path
   spelling is an `O` needle** (Kanri's note 2). The `O` sweep is entity-level
   as well as phrase-level: the section "Old values this plan contradicts"
   lists the needles with the raw counts measured on 2026-09-11, and the
   plan carries them as `O` rows. Serves nothing in req-04f5 directly; it is
   how a plan of this repository is verified (decision-5c8e, issue-10bc).

10. **The design entry, the requirement, and one ADR are written by T1 and
    T2, not by a task** (D-3). Kanri's write-outs are: in design-4807, the
    section "The roster and the conductor ledger" (the ledger move and the
    dialogue's untracked location), the topic-word collision checks that K3
    changes, and the section "Bug intake", whose stated reason — no session
    outside the repository can discover Kanri's name — this plan falsifies;
    req-04f5's new bullet (the Requirements section below); and one ADR,
    "tanto's own state is decoupled from superpowers by location", whose
    Decision is that everything tanto writes for itself lives under
    `<workspace>/.tanto/`, self-ignored and self-lint-silenced, one directory
    per topic, with the artifacts of composed skills reached by pointer, and
    that the migration of 2026-09-11 moved live state only. The plan's tasks
    touch `skills/tanto/` and `docs/notes/tanto-consistency-checks.md` only.
    No dogfood report is mandated: this run is the measurement, and T2
    decides whether a report is written. Serves req-04f5, "Docs are kept
    current as part of the flow".

## 1. The layout of `.tanto/`

```text
<workspace>/.tanto/
  .gitignore                        one line: *
  .markdownlint-cli2.yaml           two lines: config: / default: false
  roster.md
  roster-archive.md
  kanri-handover.md                 while a handover is pending
  inbox/<YYYY-MM-DD>-<slug>.md      every bug report received, with its Triage
  exit-kanri-<YYYY-MM-DD>-<name>-proposal.md
  kaiseki/kaiseki-<n>.md            a standalone Kaiseki's reports
  <topic>/                          from the topic's opening to the plan's close
    kanri.md                        the conductor ledger; never moves
    spec-inputs.md
    dialogue.md
    spec-review.md
    review-brief-spec.md, review-brief-plan.md
    plan-dryrun.md
    plan-review.md
    batch-<X>-prompt.md, batch-<X>-report.md
    kaiseki-<n>-brief.md, kaiseki-<n>.md
    shoroku-proposal.md, shoroku-direction.md
    exit-<role>[-<suffix>]-proposal.md, exit-<role>[-<suffix>]-direction.md
    compaction-<role>-<n>.md
```

Rules of the layout:

- `<workspace>` is the repository root the sessions share, the cwd every
  handshake carries.
- `<topic>` is the slug Kanri derives at the topic's opening, the same word
  that names the branch and sits in the spec's and the plan's file names. It
  is bare: the `<date>-<slug>` topic word issue-f2c4 proposed is not adopted,
  because its motivation — one directory instead of two — is met by this
  layout, and the branch and the file names keep the bare word.
- Kanri creates `.tanto/<topic>/` when it opens the topic, by writing
  `kanri.md` there. Sekkei, Jisso, and an attached Kaiseki write their files
  into it; nothing in it moves when the plan lands.
- The exit-file suffix rule is unchanged (`exit-jisso-B`, `exit-kaiseki-1`,
  `exit-sekkei`, and the `-spec` / `-plan` suffixes a Kanri ruling gives a
  stage Sekkei); every session's exit and compaction files sit in the topic
  directory, so the qualifier "or the topic directory for Sekkei" that today's
  text carries in five places is gone — Sekkei's files and Jisso's are in the
  same directory.
- The SDD workspace `.superpowers/sdd/<plan-basename>/`, with `progress.md`
  inside it, is superpowers' and is created by Jisso's `sdd-workspace` run.
  tanto writes nothing under `.superpowers/`.
- After a plan's close, `.tanto/<topic>/` and the SDD workspace both stay:
  untracked, local to one machine, useful only for a later re-read
  (issue-12d3's ruling, restated).

## 2. The two files and their three writers

`.tanto/.gitignore`:

```text
*
```

`.tanto/.markdownlint-cli2.yaml`:

```yaml
config:
  default: false
```

The first is the self-ignoring trick the SDD workspace uses: nothing under
`.tanto/` is ever tracked, and the repository's `.gitignore` is not edited. The
second turns every markdownlint rule off for the directory, so the editor's
markdownlint extension — which reads the repository's configuration and lints
files the commit path never sees — stops flagging the ledgers, prompts, and
reports (the `<...>` placeholders the templates carry trip `MD033` on every
line they sit on). Today the same two-line file sits by hand under
`.superpowers/sdd/`, by nobody's rule; this makes it a rule.

Each file is written when absent and never overwritten. Three writers:

| Writer | When | Where it is written today |
| --- | --- | --- |
| Kanri | its start sequence, step 2 | `roles/kanri.md` Start, step 2, which today checks `.superpowers/sdd/.gitignore` |
| a standalone Kaiseki | when it creates `.tanto/kaiseki/` | `roles/kaiseki.md`, the Standalone paragraph |
| a bug-report writer | when it places a report under its own repository's `.tanto/` | `templates/bug-report.md`, the opening paragraph |

Kanri's step 2 no longer mentions `.superpowers/sdd/.gitignore`: the SDD
skill's `sdd-workspace` writes that on every run, and tanto never runs first
for it any more, because tanto never writes there.

## 3. The path map — the mechanical substitutions

Every occurrence of an old spelling in the files below becomes the new one,
except where section 4 rewrites the surrounding sentence. The plan's drafter
applies the map to every hit and writes each as a passage; section 4 gives
the new text where the sentence changes beyond the path.

| Old | New | Note |
| --- | --- | --- |
| `.superpowers/sdd/<topic>/<file>` | `.tanto/<topic>/<file>` | |
| `.superpowers/sdd/<plan-basename>/<file>`, `<file>` not `progress.md` | `.tanto/<topic>/<file>` | prompts, reports, briefs, proposals, directions, exit and compaction files, `kanri.md` |
| `.superpowers/sdd/<plan-basename>/progress.md` | unchanged | the SDD ledger; the one `<plan-basename>` path that survives |
| `.superpowers/sdd/roster.md`, `roster-archive.md`, `kanri-handover.md` | `.tanto/roster.md`, `.tanto/roster-archive.md`, `.tanto/kanri-handover.md` | |
| `.superpowers/sdd/inbox/<YYYY-MM-DD>-<slug>.md` | `.tanto/inbox/<YYYY-MM-DD>-<slug>.md` | |
| `.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | |
| `.superpowers/sdd/kaiseki/` | `.tanto/kaiseki/` | standalone Kaiseki |
| `.superpowers/sdd/.gitignore` | `.tanto/.gitignore` | where the sentence describes writing it, the markdownlint file joins it (section 2) |
| bare `.superpowers/sdd/` ("under `.superpowers/sdd/`", "next to the roster") | `.tanto/` | |
| `<path under docs/superpowers/plans/>`, `<path under docs/superpowers/specs/>` (template placeholders) | `<the plan's path>`, `<the spec's path>` | input 4 |
| `<.superpowers/sdd/<topic>/, kept after the ledger moves>` (`templates/kanri.md`) | `<.tanto/<topic>/>` | the Topic directory line stays; its qualifier goes |

Files the map touches, with the count of lines carrying `.superpowers` on
2026-09-11: `SKILL.md` 31, `roles/kanri.md` 24, `roles/sekkei.md` 8,
`roles/kaiseki.md` 4, `roles/jisso.md` 0 (but four passages in section 4.5),
`README.md` 1, and the templates — `batch-prompt.md` 4, `kaiseki-brief.md`
4, `kanri.md` 4, `kanri-handover.md` 3, `bug-report.md` 2, `review-brief.md`
2, `roster.md` 2, `batch-report.md` 1, `roster-archive.md` 1;
`kaiseki-report.md` and `tanto.json` 0. `docs/notes/tanto-consistency-checks.md`
carries 1 line with `.superpowers/sdd` and 1 more with `.superpowers/`
(section 4.8). `scripts/passage-check.js` and its test carry none.

After the map, `plan-basename` survives only where the next characters are
`>/progress.md`, and `.superpowers/sdd` survives only in the SDD-ledger lines
(the Artifacts table row, the batch prompt, the batch report, the Kaiseki
brief, `templates/kanri.md`'s Plan section, Jisso's step 2 is already
path-free), in the README's sentence that `sdd-workspace` owns that
directory, and in the consistency note's sentence about the two untracked
trees. That is the allowlist the verification section sweeps against.

## 4. The passages whose wording changes beyond the path

The new text is given in prose here; the plan's drafter wraps each block at
its destination file's column and writes it in the shape
`scripts/passage-check.js` parses. Where a section says "mechanical", the map
of section 3 is the whole change and no text is given.

### 4.1 `skills/tanto/SKILL.md`

**S1 — Handshake and roster, the first paragraph, and "The address", the
third precedence.** Mechanical: `.tanto/roster.md`, twice; and "The roster
lives at `.tanto/roster.md`" in the roster paragraph.

**S2 — The transcript reading, the compaction paragraph.** The path becomes
`.tanto/<topic>/compaction-<role>-<n>.md` and the parenthesis loses its
first clause: "(`<n>` one more than the highest such file for that role, so
that a second compaction or a replaced session does not overwrite the
first)". The sentence that follows, on the two sessions with no Kanri, is
unchanged.

**S3 — Messages, the bug-report paragraph.** New text:

> A defect noticed in a skill goes to the Kanri of the repository that ships
> that skill, as a **bug report**: a file written from
> `templates/bug-report.md` and one line, `bug-report: <absolute path>`.
> Kanri is the intake, and its address is read from the target workspace's
> roster: the sender reads the first data row of
> `<workspace>/.tanto/roster.md` and takes the bare `<name>` before the
> bracket of its `Name [ref]` column, the human supplying the workspace's
> path where the sender does not know it; the sender checks that name
> against `ListAgents` before sending, and asks the human for the address
> when the roster is absent — a workspace not yet migrated, or an older
> skill — or the name is not listed, since a resumed Kanri carries a new
> name until it rewrites its row. The roster is Kanri's
> to write and the sender's only to read; the read is of a file outside the
> sender's own working directory, and outside auto mode the harness may put
> a permission prompt for it in the sender's window — the harness's own
> prompt, like the model-mismatch stop, and not a failure of the route. A
> defect that surfaces in a spec dialogue reaches Kanri as an `I-n` in
> `spec-inputs.md`, not as a bug report.

**S4 — Session exit, the file-pattern paragraph.** The sentence "The files
live where the role's other files live: Jisso's and an attached Kaiseki's
under `.superpowers/sdd/<plan-basename>/`, Sekkei's under
`.superpowers/sdd/<topic>/`, Kanri's own next to the roster." becomes "The
files live in the topic directory, `.tanto/<topic>/`, for Jisso, Sekkei, and
an attached Kaiseki, and next to the roster, at `.tanto/`, for Kanri." The
rest of the paragraph is unchanged.

**S5 — Artifacts, the table.** Replaced whole. The new rows, in order:

| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| the spec, at the path the orders line names — by default `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Jisso | the spec; committed |
| the plan, at the path the orders line names — by default `docs/superpowers/plans/<date>-<topic>.md` | Sekkei | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its first data row | one row per role |
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, and refused rows with their last readings, and the closed plans' Events lines, appended at each plan close |
| `.tanto/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted |
| `.tanto/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
| `.tanto/<topic>/kanri.md` | Kanri | Sekkei, Jisso, Kaiseki | the conductor ledger; it never moves |
| `.tanto/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
| `.tanto/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, T1 | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
| `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md` | the brief writer Kanri dispatches | Kanri, then the human through Sekkei | the review brief, from `templates/review-brief.md`, in the chat's language |
| `.tanto/<topic>/plan-dryrun.md` | Sekkei | the plan reviewer, Kanri | from `lint` and `replay` — the two commands, each one's output, and Sekkei's ruling on every failure |
| `.tanto/<topic>/batch-<X>-prompt.md` | Kanri | Jisso, human | the same text as the `SendMessage`, so the human can paste it if the message did not arrive |
| `.tanto/<topic>/batch-<X>-report.md` | Jisso | Kanri | fixed skeleton |
| `.tanto/<topic>/kaiseki-<n>-brief.md` | Kanri | Kaiseki | fixed skeleton |
| `.tanto/<topic>/kaiseki-<n>.md` | Kaiseki | Kanri, Jisso | fixed skeleton |
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri | the T2 proposal, written to a file instead of printed |
| `.tanto/<topic>/shoroku-direction.md` | Kanri | Jisso | Kanri's answer to that proposal, item by item |
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
| `.tanto/<topic>/exit-<role>[-<suffix>]-direction.md` | Kanri | the exiting session | Kanri's answer, item by item |
| `.tanto/<topic>/compaction-<role>-<n>.md` | the compacted session | Kanri, or the human for Kanri itself and a standalone Kaiseki | every item a compaction summary attributes to the human, one per line, rewritten with the human's answers |
| `.tanto/kaiseki/kaiseki-<n>.md` | a standalone Kaiseki | the human | its report, outside any run |
| `.superpowers/sdd/<plan-basename>/progress.md` | Jisso, through the SDD skill | Kanri | the SDD ledger; Kanri reads it and never writes it; the one artifact tanto reads under `.superpowers/` |
| `.tanto/.gitignore` holding `*`, and `.tanto/.markdownlint-cli2.yaml` holding `config:` / `default: false` | Kanri at start, a standalone Kaiseki, or a bug-report writer — whichever finds them absent first; never overwritten | git; the editor's markdownlint | keeps everything above untracked, so nothing is ever staged, and keeps the editor quiet on files the commit path never lints |
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |

The sentence after the table, "Templates are copied and filled, never
restated in prose. There are eleven: …", is unchanged: no template is added
or removed.

**S6 — The paragraph beginning "No `<plan-basename>` exists before the plan
is committed".** Replaced whole:

> `.tanto/<topic>/` is created by Kanri when the topic opens — its first file
> is the conductor ledger — and holds every per-topic file from then to the
> plan's close; nothing in it moves when the plan lands. The SDD ledger is
> the one artifact tanto reads under `.superpowers/sdd/`: the SDD skill
> writes it there, and the conductor ledger's Plan section and every batch
> prompt name its path.

**S7 — Rules, rule 5.** "Sekkei writes only under `docs/superpowers/` and
`.superpowers/sdd/`, at any time, …" becomes "Sekkei writes only under the
spec and plan directory the orders line names — by default
`docs/superpowers/` — and `.tanto/`, at any time, …"; and "Neither writes
under the `docs/` document-management tree outside `docs/superpowers/`,
except …" becomes "Neither writes under the `docs/` document-management tree
outside that directory, except …".

**S8 — Workspace, the last paragraph.** Replaced whole:

> `.tanto/<topic>/` outlives the plan, and so does the SDD workspace
> `.superpowers/sdd/<plan-basename>/`. Jisso never deletes either, and
> nothing asks the human to delete either: after T2 the two have the same
> standing — untracked, local to one machine, useful only for a later
> re-read — and disk is the only cost (issue-12d3).

**S9 — The review-brief bullet under Messages.** Mechanical:
`.tanto/<topic>/review-brief-spec.md`.

### 4.2 `skills/tanto/roles/kanri.md`

**K1 — Start, step 2.** Replaced whole:

> 2. Make sure `.tanto/.gitignore` exists and holds `*`, and
>    `.tanto/.markdownlint-cli2.yaml` exists and holds the two lines
>    `config:` and `  default: false`. Write each only when it is absent and
>    never overwrite either: the first keeps everything under `.tanto/`
>    untracked without touching the repository's own `.gitignore`, the
>    second keeps the editor's markdownlint quiet on files the commit path
>    never lints (issue-6aa8). Nothing else writes these two files for you;
>    the SDD skill's `sdd-workspace` writes its own ignore file in its own
>    workspace on every run, and that is no longer your concern.

**K2 — Start, step 3.** Mechanical: `.tanto/roster.md`.

**K3 — Start, step 5.** "check that no `.superpowers/sdd/<slug>/`, no
`docs/superpowers/specs/*-<slug>-design.md`, and no branch `<slug>` exists"
becomes "check that no `.tanto/<slug>/`, no spec for that slug at the default
spec location (`docs/superpowers/specs/*-<slug>-design.md`), and no branch
`<slug>` exists"; and "create `.superpowers/sdd/<topic>/kanri.md`" becomes
"create `.tanto/<topic>/kanri.md`". The rest of the step is unchanged.

**K4 — The five cases, Handover.** Mechanical: `.tanto/kanri-handover.md`.

**K5 — The spec-inputs paragraph ("When the human gives you scope input").**
The path becomes `.tanto/<topic>/spec-inputs.md`, and the last sentence
"That file stays in the topic directory as the spec-phase record even after
the ledger moves." becomes "That file stays in the topic directory as the
spec-phase record."

**K6 — The cold-read paragraph naming `plan-dryrun.md`.** Mechanical.

**K7 — When the plan lands, step 2.** Replaced whole:

> 2. Record in the ledger's Plan section the plan's path and the SDD
>    ledger's, `.superpowers/sdd/<plan-basename>/progress.md`, which Jisso's
>    `sdd-workspace` run will create, and note the landing in the roster's
>    Events list. Nothing moves: the ledger stays at `.tanto/<topic>/kanri.md`.

**K8 — When the plan lands, step 5; the batch loop, step 8; the final
batch's T2 line; the Kaiseki trigger, step 2; the T2 split, steps 1 and 2;
the relay outcome; the review-brief dispatch.** Mechanical, each to
`.tanto/<topic>/…`.

**K9 — The handover file, the first paragraph, and the Handover steps, step
2.** Mechanical: `.tanto/kanri-handover.md`, "untracked under
`.tanto/.gitignore`".

**K10 — A peer's exit, step 1.** The path becomes
`.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md` and the clause ", or the
topic directory for Sekkei" is dropped.

**K11 — Kanri's own exit.** Mechanical:
`.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`.

**K12 — Intake, the first paragraph.** The path becomes
`.tanto/inbox/<YYYY-MM-DD>-<slug>.md` and "creating `inbox/` under the
existing `.gitignore`" becomes "creating `inbox/` if it is absent".

**K13 — Intake, the paragraph "The intake's address is the human's to
supply".** Replaced whole:

> The intake's address is read, not relayed. A reporter that knows this
> workspace's path reads the first data row of `<workspace>/.tanto/roster.md`
> — your row — and takes the bare `<name>` before the bracket of its
> `Name [ref]` column as your address; the human supplies the path where the
> reporter does not know it, which is the one thing only the human, who sees
> both repositories, can tell it. A resume gives you a new name and the row
> follows only when you rewrite it, so a reporter checks the name against
> `ListAgents` before sending and asks the human for the address when it is
> not listed, or when the roster is absent. You write the roster; a
> reporter only reads it, and that read, outside the reporter's own working
> directory, may draw a harness permission prompt in the reporter's window
> outside auto mode — the harness's, not a protocol failure. A report the
> reporter cannot send stays a file the human pastes to you as
> `bug-report: <path>`.

**K14 — Reporting from the other side.** Replaced whole:

> You are also a reporter: a Kanri in another repository is where a defect in
> this repository's skills is often noticed. On the human's request, write
> the report from `templates/bug-report.md`; read the intake's bare name —
> the `<name>` before the bracket of the `Name [ref]` column — from the
> first data row of `<target workspace>/.tanto/roster.md`, asking the human
> for the workspace's path if you do not know it, and expecting, outside
> auto mode, a harness permission prompt in your window for a read outside
> your working directory; check that the name is in `ListAgents`, and ask
> the human for the address when it is not, or when that roster is absent;
> send `bug-report: <absolute path>` to that bare name; and record the send
> in the roster's Events.

**K15 — Session lifecycle, the paragraph "Neither
`.superpowers/sdd/<plan-basename>/` nor the topic directory beside it is
deleted at the close".** Replaced whole:

> Neither `.tanto/<topic>/` nor the SDD workspace
> `.superpowers/sdd/<plan-basename>/` is deleted at the close, and you ask
> the human about neither. After T2 the two have the same standing:
> untracked, local to one machine, and useful only for a later re-read
> (issue-12d3).

### 4.3 `skills/tanto/roles/sekkei.md`

**E1 — Where your files go.** Replaced whole:

> - Spec — the path Kanri's orders line names; by default
>   `docs/superpowers/specs/<YYYY-MM-DD>-<topic>-design.md`
> - Plan — the path Kanri's orders line names; by default
>   `docs/superpowers/plans/<YYYY-MM-DD>-<topic>.md`
> - Your working notes — under `.tanto/<topic>/`
> - Kanri's relay of what the human said during spec work, when there is one
>   — `.tanto/<topic>/spec-inputs.md`, numbered `I-n`, each with Kanri's
>   advisory notes. Read it before the dialogue and answer every `I-n` in
>   the spec.

**E2 — Step 1's `dialogue.md`, Step 2's `spec-review.md`, Step 4's
`plan-dryrun.md` and `plan-review.md`, the exit proposal and direction.**
Mechanical, each to `.tanto/<topic>/…`.

**E3 — Your write and commit rule, the first bullet.** "You write only under
`docs/superpowers/` and `.superpowers/sdd/`, and you may write there **at
any time**." becomes "You write only under the spec and plan directory the
orders line names — by default `docs/superpowers/` — and `.tanto/`, and you
may write there **at any time**." The rest of the bullet is unchanged.

### 4.4 `skills/tanto/roles/kaiseki.md`

**A1 — The Standalone paragraph.** Replaced whole:

> **Standalone.** `/tanto kaiseki` with no address — no roster, no handshake,
> no batch loop. Ask the human for the symptom and the reproduction, and
> write your report to `.tanto/kaiseki/kaiseki-<n>.md`, creating that
> directory if it is absent, and, if they are absent too, `.tanto/.gitignore`
> holding `*` and `.tanto/.markdownlint-cli2.yaml` holding `config:` and
> `  default: false`, so the report stays untracked and unflagged. Everything
> else below is the same, with two additions. Before the human closes the
> session, run `shoroku` in its ordinary session mode, with the human
> answering `Direction?`, and commit once — there is no Kanri to rule for
> you. And when the human asks for a defect to be reported to another
> repository, write the report from `templates/bug-report.md`, read the
> intake's bare name — the `<name>` before the bracket of the `Name [ref]`
> column — from the first data row of that repository's `.tanto/roster.md`,
> the human giving you the workspace's path, check the name against
> `ListAgents`, and send `bug-report: <absolute path>` to it; when that
> roster is absent or the name is not listed, ask the human for the
> address, and a report you still cannot send stays a file the human
> carries.

**A2 — The exit proposal path, and the report's standalone numbering.**
Mechanical: `.tanto/<topic>/exit-kaiseki-<n>-proposal.md`; "already in
`.tanto/kaiseki/`".

### 4.5 `skills/tanto/roles/jisso.md`

**J1 — "What tanto overrides", the SDD Finish row on deleting the
workspace.** Its Why cell "it holds the conductor ledger, the reports, and
the T2 source; nobody deletes it at the close, and the topic directory beside
it stays on the same terms (issue-12d3)" becomes "it holds the SDD ledger;
nobody deletes it at the close, and `.tanto/<topic>/`, which holds the
conductor ledger, the reports, and the T2 source, stays on the same terms
(issue-12d3)". The other two cells are unchanged.

**J2 — the three "in the workspace" sentences** (I-3, Jisso's own reading):
the boundary step 1, "Write `batch-<X>-report.md` in the workspace from the
tanto skill's `templates/batch-report.md`"; the T2 Propose paragraph, "Write
the numbered list to `shoroku-proposal.md` in the workspace **instead of
printing it**"; and the exit paragraph, "the path being
`exit-jisso-<X>-proposal.md` in the workspace with `<X>` the batch letter".
After J1 "the workspace" is the SDD workspace, where Kanri no longer reads,
so each becomes "in the topic directory, `.tanto/<topic>/`" — the report
path the batch prompt names, the proposal path the T2 line names, and the
exit path the `exit:` line names, all already sit there. Jisso's step 2
(the `sdd-workspace` run) names no path and is unchanged. The file's
`.superpowers` line count is 0, so the section 3 file list carries it for
these four passages, not for the map.

### 4.6 The templates

**T1 — `templates/kanri.md`, the title and the opening paragraph.** The
title becomes `# Conductor ledger — <topic>`; the paragraph's second and
third sentences, "Lives at `.superpowers/sdd/<topic>/kanri.md` until the plan
is committed, then moves to `.superpowers/sdd/<plan-basename>/kanri.md` next
to Jisso's own `progress.md`. The move is recorded in the roster's Events
list." become "Lives at `.tanto/<topic>/kanri.md` from the topic's opening
to the plan's close, and never moves."

**T2 — `templates/kanri.md`, the Plan section.** The Spec and Plan lines
become `<the spec's path, or "not yet written">` and `<the plan's path, or
"not yet written">`; the Topic directory line becomes
`- Topic directory — <.tanto/<topic>/>`; the SDD ledger line,
`<.superpowers/sdd/<plan-basename>/progress.md, written by Jisso>`, is
unchanged. The Shoroku candidates paragraph's "a handover file, another
ledger" sentence is unchanged.

**T3 — `templates/roster.md`.** Line 3: "Kept by Kanri at `.tanto/roster.md`."
The Events example line's clause "the conductor ledger moved from
.superpowers/sdd/<topic>/ to .superpowers/sdd/<plan-basename>/;" becomes
"the plan landed and the SDD ledger's path recorded;". The Keeping rule's
sentence on the address book gains nothing: the bug-report sender reads the
first row as the contract says, and the rule already calls the roster the
address book.

**T4 — `templates/roster-archive.md`.** Mechanical:
`.tanto/roster-archive.md`.

**T5 — `templates/kanri-handover.md`.** The opening paragraph: "Written by
the outgoing Kanri at `.tanto/kanri-handover.md`, next to the roster and
untracked under `.tanto/.gitignore`."; the In flight section's Ledger line:
`- Ledger — <.tanto/<topic>/kanri.md, or "none">`.

**T6 — `templates/batch-prompt.md`.** The Guard: "this prompt belongs to the
tanto workspace `.tanto/<topic>/` in `<repo path>` on branch `<branch>`";
Setup on resume: `- Plan — <the plan's path>`, `- Spec — <the spec's path>`,
the SDD ledger line unchanged, `- Conductor ledger, read only —
<.tanto/<topic>/kanri.md>`; Report: "Write `.tanto/<topic>/batch-<X>-report.md`".

**T7 — `templates/batch-report.md`.** `- Plan — <the plan's path>`; the SDD
ledger line unchanged.

**T8 — `templates/kaiseki-brief.md`.** "Written by Kanri at
`.tanto/<topic>/kaiseki-<n>-brief.md`."; `- Batch report —
<.tanto/<topic>/batch-<X>-report.md>`; the SDD ledger line unchanged;
"Write `.tanto/<topic>/kaiseki-<n>.md`".

**T9 — `templates/review-brief.md`.** "at `.tanto/<topic>/review-brief-spec.md`
or `review-brief-plan.md`, next to the review reports and untracked under
`.tanto/.gitignore`."

**T10 — `templates/bug-report.md`, the opening paragraph.** Replaced whole:

> Written from the tanto skill's `templates/bug-report.md` by whoever
> noticed the defect, saved anywhere untracked under the reporter's own
> repository's `.tanto/` (whose `.gitignore` holds `*` and whose
> `.markdownlint-cli2.yaml` holds `config:` / `default: false`; create both
> if absent), and sent to the intake as one line,
> `bug-report: <absolute path>`, the intake's bare name — the `<name>`
> before the bracket of the `Name [ref]` column — read from the first data
> row of the target workspace's `.tanto/roster.md` and checked against
> `ListAgents`, or given by the human when that roster is absent or the
> name is not listed. The intake Kanri copies it to
> `.tanto/inbox/<YYYY-MM-DD>-<slug>.md` and fills Triage in the copy.

Its Send to section's placeholder becomes "<The intake's bare name, as read
from the target roster's first data row, or as the human gave it. Leave it
blank if the report was never sent, so the file still says where it was meant
to go.>".

`templates/kaiseki-report.md` and `templates/tanto.json` carry no path and
are not touched.

### 4.7 `skills/tanto/README.md`

**R1 — Prerequisites, the superpowers bullet.** Its last sentence, "Sekkei
and Jisso invoke them directly, and the SDD skill's `sdd-workspace` script
owns `.superpowers/sdd/`." becomes "Sekkei and Jisso invoke them directly.
The SDD skill's `sdd-workspace` script owns `.superpowers/sdd/`; tanto's own
state lives under `.tanto/`, which it ignores and lint-silences itself, and
the spec and the plan are wherever Kanri's orders line says, by default the
superpowers convention." The README's list of past specs under
`docs/superpowers/specs/` names real files and is unchanged. Per `AGENTS.md`,
the README is reviewed for drift after `SKILL.md` changes; this is that
review's result, written into the plan.

### 4.8 `docs/notes/tanto-consistency-checks.md`

**N1 — "Two traps of this host", the second trap.** "And the SDD workspace
under `.superpowers/sdd/` is **untracked** — its `.gitignore` is `*`, nothing
under it has ever been committed — so …" becomes "And the SDD workspace under
`.superpowers/sdd/` and tanto's own under `.tanto/` are **untracked** — each
carries a `.gitignore` of `*`, nothing under either has ever been committed
— so …".

**N2 — The extraction paragraph's last sentence, "And the editor's
markdownlint reports on files under `.superpowers/` — a plan draft, a brief —
are advisory: the commit path ignores that directory."** becomes "And the
editor's markdownlint reports on files under `.superpowers/` are advisory:
the commit path ignores that directory, and `.tanto/`, where a brief or a
draft now lives, carries its own configuration that turns every rule off."

The note's mentions of `docs/superpowers/` (the absence-grep exclusion, the
lint ignores) are about the spec and plan directory and stay, since that
default stays (input 4).

## 5. The transition at batch A's boundary — a Kanri directive

This is not a task. It is a step the plan writes into its Global Constraints
and into batch A's boundary in the Batches section, addressed to Kanri, and
Kanri performs it under rule 11's authority sentence (the prompts and the
constraints, not the role text in its context). In order, once batch A is
accepted and before batch B's prompt is written:

1. Create `.tanto/` and write the two files of section 2 into it.
2. Rename, with `mv` and never a copy: `.superpowers/sdd/roster.md`,
   `.superpowers/sdd/roster-archive.md`, `.superpowers/sdd/inbox/`, every
   `.superpowers/sdd/exit-kanri-*-proposal.md`,
   `.superpowers/sdd/kanri-handover.md` if one is pending, and
   `.superpowers/sdd/tanto-workspace/` (this topic's directory, ledger
   included) to the same names under `.tanto/`. `.superpowers/sdd/kisou-refresh/`,
   `.superpowers/sdd/2026-09-11-kisou-refresh/`, and every older topic
   directory and plan workspace stay where they are; the SDD workspace of
   this plan, `.superpowers/sdd/<this plan's basename>/`, stays too.
3. Leave `.superpowers/sdd/.gitignore` and
   `.superpowers/sdd/.markdownlint-cli2.yaml` alone: the first is
   superpowers', the second the human placed by hand and the SDD workspaces
   still there benefit from it.
4. In the moved files, rewrite the two header lines that name the old
   place: the roster's "Kept by Kanri at `.superpowers/sdd/roster.md`" to
   `.tanto/roster.md`, and the live ledger's "Lives at
   `.superpowers/sdd/<topic>/kanri.md` until the plan is committed, then
   moves …" paragraph to T1's new text. Every other file in the moved
   directory — `spec-inputs.md`'s header, `dialogue.md`'s note on where the
   draft lived, the review reports — keeps its text as the spec-phase
   record, and the ledgers of the closed plans under `.superpowers/sdd/`
   keep their old headers: historical text, and nobody "fixes" it.
5. Write one Events line in the roster, at its new path, after the `mv`:
   "live state moved from `.superpowers/sdd/` to `.tanto/` at batch A's
   boundary (tanto-workspace input 6): the roster, the archive, the inbox,
   the Kanri exit proposals, and this topic's directory; older records
   stay". Kanri's Residency row is rewritten at this boundary as at any
   other.
6. From here on, name `.tanto/tanto-workspace/` in every prompt and every
   orders line — batch B's prompt is the first — and read the roster at
   `.tanto/roster.md`. A session started after this boundary reads the new
   text and finds the state where the text says.

The step sits where Kanri's own boundary edits sit: after batch A's commit
window (loop step 7, Jisso idle) and before batch B's prompt (step 8); it
touches untracked files only and needs no commit (I-3). If a Kanri handover
falls due at this boundary, it proceeds — rule 11's "no replacement before
the boundary" is met, this being the boundary — and the handover file goes
to `.tanto/kanri-handover.md`, which the successor's new role text names.
The step has no rollback: a plan that stops between batch A and its close
leaves `.tanto/` in place, and the skill's loaded files already agree with it.

## 6. The boundary, the batch cut, and rule 11

- **Batch A** — every file a session loads. Four tasks: `SKILL.md`;
  `roles/kanri.md`; `roles/sekkei.md`, `roles/kaiseki.md`, and
  `roles/jisso.md`; the eleven templates (nine carry passages;
  `kaiseki-report.md` and `tanto.json` do not). Its boundary is the boundary
  from which a role may be started or replaced. The plan's Global
  Constraints and Batches section say so, and say that until then the
  authority for the run's sessions is the constraints, Kanri's orders line,
  and the batch prompts (rule 11). The transition of section 5 happens at
  this boundary.
- **Batch B** — the README, the consistency note, and the whole-tree
  absence sweep with its recorded output. No session loads these files, so
  a session started at batch A's boundary reads a skill that agrees with
  itself.
- **Expected replacements**: none. The plan says so in its Batches section.
  The Jisso of this plan reads `roles/jisso.md` as it stands at the plan's
  landing (the old text; its four passages are J1 and J2's three "in the
  workspace" sentences) and takes every path from the batch prompt.
- **This run's own sessions**: Kanri `dotskills-28` and this plan's Jisso
  use `.superpowers/sdd/tanto-workspace/` through batch A and
  `.tanto/tanto-workspace/` from the transition on; the paths come from the
  prompts, never from the role text.
- **The reading of rule 11** this plan records: "every file the plan
  touches agrees with every other" is met when every file a session loads
  agrees; the README and a note are read by people and by verification
  commands and cannot leave a session half-instructed. `SKILL.md`'s rule 11
  carries no definition of the boundary beyond the plan naming it, but
  decision-5c8e's Decision defines it as "the first boundary at which every
  file the plan touches agrees with every other", under which batch A's
  boundary — the README and the note still disagreeing — is not legal. So
  the reading is a narrowing of the ADR, and `docs/decisions/AGENTS.md`
  leaves two legal moves for T1: a new ADR with `amends: [5c8e]` and the
  matching `amended_by` on 5c8e, or a sentence in design-4807 with no ADR
  change, on the precedent design-4807 already records for rule 11's
  creation clause (crossed knowingly once, no defect followed). The human
  chose the second at the review (2.5, (b)): T1 writes the sentence in
  design-4807, decision-5c8e is not amended, and the reading stands in this
  spec and the plan.

## Old values this plan contradicts

Measured on 2026-09-11 against the `kisou-refresh` branch at the commit
"docs(reports): the kisou refresh dogfood", with `grep -cF` per file (a line
count). The plan carries each as an `O` row, sweeping the paths the plan
touches; the count after the plan is the disposition column.

| Needle | Where it is today (lines) | After the plan |
| --- | --- | --- |
| `.superpowers/sdd` | `SKILL.md` 31, `kanri.md` 24, `sekkei.md` 8, `kaiseki.md` 4, `README.md` 1, the note 1, templates 23 | the SDD-ledger and SDD-workspace lines only: `SKILL.md` 3 (the Artifacts row, S6, S8), `kanri.md` 2 (K7, K15), `batch-prompt.md` 1, `batch-report.md` 1, `kaiseki-brief.md` 1, `templates/kanri.md` 1, `README.md` 1 (R1), the note 1 (N1); `sekkei.md`, `kaiseki.md`, `jisso.md`, and the other templates 0. Every survivor is followed by `/<plan-basename>/` or, in S6, R1, and N1, closes the path with `/` |
| `plan-basename` | `SKILL.md` 16, `kanri.md` 9, `kaiseki.md` 1, the note 1, templates 13 | `SKILL.md` 2 (the Artifacts row, S8; S6 names the ledger in prose), `kanri.md` 2 (K7, K15), `batch-prompt.md` 1, `batch-report.md` 1, `kaiseki-brief.md` 1, `templates/kanri.md` 1, the note 1 (its own prose about the SDD workspace); every survivor is the SDD ledger's path or the SDD workspace's. The handover template's `<the plan basename, or "none">` has no hyphen and is not a hit |
| `Move the ledger`, `Only the ledger moves` | `kanri.md` 1 each | gone |
| `moves it to` | `SKILL.md` 1 | gone |
| `after the ledger moves` | `kanri.md` 1, `templates/kanri.md` 1 | gone |
| `ledger moved` | `templates/roster.md` 1 | gone |
| `ledger move` | `SKILL.md` 1, `kanri.md` 2, templates 2 | gone; the roster's Events history under `.tanto/roster.md` keeps the phrase in past lines, and that file is not in the sweep |
| `next to Jisso's own` | `templates/kanri.md` 1 | gone |
| `topic directory beside it` | `kanri.md` 1, `jisso.md` 1 | gone |
| `topic directory for Sekkei`, `or the topic directory` | `SKILL.md` 3, `kanri.md` 1 | gone |
| `in the workspace` | `jisso.md` 3 | gone (J2); `jisso.md`'s "this plan's workspace" in step 2 is not a hit |
| `when it runs first`, `only running first` | `SKILL.md` 1, `kanri.md` 1 | gone |
| `supplies the intake's address`, `human's to supply`, `ask the human for the intake address` | `SKILL.md` 1, `kanri.md` 1, `kanri.md` 1 | gone |
| `or leave it as a file for the human` | `kaiseki.md` 1 | gone (A1); the shorter `the address the human gives` wraps across two lines there and measures 0, so it is not the needle |
| `after the move` | `templates/kanri.md` 1 (the title) | gone (T1) |
| `under the existing` | `kanri.md` 1 | gone (K12) |
| `superpowers/sdd/.gitignore` | `SKILL.md` 1, `kanri.md` 2, `kaiseki.md` 1, templates 2 | gone |
| `path under docs/superpowers` | templates 5 | gone |
| `docs/superpowers/specs/<`, `docs/superpowers/plans/<` | `SKILL.md` 1 each, `sekkei.md` 1 each | the same four, each now preceded by "by default" |
| `There are eleven` | `SKILL.md` 1 | 1, unchanged — the guard that no template was added |
| `spec-phase record` | `SKILL.md` 1, `kanri.md` 1 | `SKILL.md` 0 (S6 drops it), `kanri.md` 1 (K5 keeps it) |

Needles that wrap in their target return `0` before the edit and read as
"already gone"; no needle enters the plan without a non-zero `grep -cF` on
the file it names, run by the plan's author, and the plan's `lint` checks
each needle against the plan's own new-passage text. The "After the plan"
column is computed from the section 4 texts, not from the old tree: a
replacement that reintroduces an old spelling (as K1's first draft did)
changes the allowlist, the row, and the sweep's expected count together.

## Requirements

For T1, the requirement side of the inputs, written by Kanri into
`docs/requirements/04f5-tanto.md` under "Required behavior":

- **tanto's own state lives in its own directory.** Everything a role writes
  for tanto sits under `<workspace>/.tanto/`, one directory per topic from
  its opening to its close, ignored by git and silenced for the editor's
  linter by files tanto writes itself; the repository's own configuration is
  not edited for it. The artifacts of the skills tanto composes — the SDD
  ledger, the spec, the plan — stay where those skills put them and are
  reached by the path Kanri names, so that a spec or a plan written by
  another skill changes nothing in tanto.
- The "Trouble reports" bullet gains a sentence: a reporter that knows the
  target workspace's path finds the intake's address in the workspace
  itself and asks the human only when that address is stale.

Neither is a new requirement in the sense of a new need; the first names what
"Composes without modifying" and "State lives in files" imply once tanto's
files are its own, and the second is the interrupt budget applied to the
bug-report route.

## What the plan must contain

1. **Global Constraints** with the repository's `AGENTS.md` rules, the
   concrete model families from `tanto.json`, rule 11's authority sentence,
   the boundary from which a role may be started or replaced (batch A's),
   and the transition directive of section 5 addressed to Kanri.
2. **Batches** as section 6 cuts them: A with four tasks over the loaded
   files, B with the README, the note, and the sweep; each with what it
   delivers and its boundary's stop conditions; "no replacement expected".
3. **One `O` row per needle** of the table above, written before the
   passages, with the raw count and the disposition; the sweep over every
   path the plan touches.
4. **One passage block per hit** of section 3's map, and the section 4
   blocks in full, each wrapped at its destination file's column — a table
   row stays one line, as S5's destination rows are — in the shape
   `scripts/passage-check.js` parses; one anchor step per file that states
   both values.
5. **A `verify` step per task** as one invocation of the instrument; no
   hand-written greps in a task.
6. **How a batch is verified**: the section below.
7. **Self-Review** stating the largest task's line and step counts and
   whether any task is a sweep-and-check shape (batch B's sweep task is).
8. Nothing about report or prompt skeletons beyond "they follow the tanto
   templates".

## Verification

At every boundary, Kanri runs, in this order:

1. `node "$TANTO/scripts/passage-check.js" diff --plan <path>` — every added
   and removed line in `skills/tanto` and the note is covered by a block.
2. `./scripts/lint.sh <changed paths>` — the pre-commit hooks on the changed
   paths; the templates are in the markdownlint ignore list, so the lint on
   them is the whitespace and final-newline hooks alone.
3. The absence sweep, scoped to the skill (the note's rule on scope):

   ```bash
   grep -rn '\.superpowers/sdd' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v 'sdd/<plan-basename>/'
   grep -rn 'plan-basename' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v 'sdd/<plan-basename>/'
   ```

   Expected after batch A: the first prints exactly three lines — S6's
   sentence in `SKILL.md`, the README's superpowers bullet, and the note's
   "Two traps" sentence (the last two in their old spelling until batch B
   rewrites them as R1 and N1, which keep the spelling, so the count is
   three at both boundaries); the second prints exactly one line, the
   note's own prose about the SDD workspace. Each
   line printed is placed against the allowlist of section 3; a line not on
   it is a defect. The lines the filter removes are the SDD-ledger and
   SDD-workspace paths the "Old values" table enumerates, and their count
   is checked there.
4. The entity needles of the "Old values" table, each as `grep -rcF` over
   `skills/tanto` and the note, compared with the "After the plan" column.
5. `grep -c 'There are eleven' skills/tanto/SKILL.md` prints `1`.
6. `node --test skills/tanto/scripts/` — the instrument's own tests, which
   this plan does not touch, still pass on Node 22 (`mise` pins it).
7. The four SDD stop classes: the fixed-string check that `SKILL.md`'s and
   `roles/jisso.md`'s copies still match each other, from the consistency
   note's check list, because `jisso.md` is touched.
8. After batch A's boundary only: `ls -a .tanto/` shows the two dotfiles, the
   roster, the archive, the inbox, the exit proposals, and
   `tanto-workspace/`; `git status --short` shows nothing under `.tanto/`;
   `.superpowers/sdd/roster.md` is gone.

The plan's Verification section names these by number, and the batch prompts
restate them as Kanri's own commands.

## Answered at the review

The four points the brief put to the human, and the answers of 2026-09-11
(`dialogue.md`, the gate):

1. **The `.markdownlint-cli2.yaml` content** — `config:` / `default: false`,
   the two lines, as the spec has them.
2. **The rule 11 reading** — (b): one sentence in design-4807, no ADR
   change; decision-5c8e stays as written. T1 writes the sentence, and
   section 6 above stands with that choice made.
3. **Issue-6aa8's disposition** — resolved from tanto's side by
   `.tanto/.markdownlint-cli2.yaml`; the superpowers side is **not**
   dotrepo's: the human's hand-placed `.superpowers/sdd/.markdownlint-cli2.yaml`
   is a workaround they put in for it, and the issue's resolution names both
   halves and sends nothing to dotrepo (the human's correction of the
   spec's first wording).
4. **The ADR of input 10** — its Decision sentence stands; T1 puts it to
   the human under decision-1f5f's route before writing it.

## Out of scope

- A `tanto.json` key for the directory's name or place (input 2).
- Editing the repository's `.gitignore` or `.markdownlint-cli2.yaml`. The
  `.superpowers/**` ignore that issue-6aa8 asked for is not requested of
  dotrepo either: the human's hand-placed
  `.superpowers/sdd/.markdownlint-cli2.yaml` is the workaround for the
  superpowers side, and stays.
- Moving the closed plans' records out of `.superpowers/sdd/`.
- issue-b7d3's route 2, the per-user registry, and its open questions.
- The Keikaku split (issue-3c7a) and the small tanto items Kanri's note lists.
- `scripts/passage-check.js` and its tests: no path in them changes.
- design-4807, the requirement, and the ADR: T1 and T2 write them, not a
  task.
- The accepted ADRs that name the old paths in their bodies —
  decision-de63 (`.superpowers/sdd/kanri-handover.md`) and decision-ace0
  (`.superpowers/sdd/<topic>/review-brief-spec.md`) — stay as written: an
  ADR body is immutable and is not amended for a detail, so the paths in
  them read as-of-then. T1 edits neither.
- Open issues that quote the old paths as anchors (issue-5e9c, issue-9d17,
  issue-3c7a) keep their text; the plan that picks one up re-reads the file.

## Answers to the spec inputs

- **I-1** — the scope, the layout, the two files, the pointer to the
  superpowers artifacts: inputs 1 to 5; the ledger move and issue-12d3's
  two-directory state: input 5 and section 1; Kanri's notes: rule 11 in
  inputs 7 and section 6; the instrument and the entity-level `O` sweep in
  input 9 and the "Old values" table; the small items in input 1 (none
  folded in); the in-flight kisou-refresh run and the migration in input 6
  and section 5; the branch per Kanri's R-4 — cut from `main` once
  `main is free`, and this draft moved to the spec path then.
- **I-2** — input 8, S3, K13, K14, A1, T10.
- **I-3** — Kanri's and Jisso's check of the role passages: K1's "nothing
  else writes these files"; the header lines of the moved roster and ledger
  in section 5, step 4, and the closed ledgers as historical text; the
  harness permission prompt in S3 and K13; the handover due at the
  transition boundary in section 5; J2 for Jisso's three "in the workspace"
  sentences.

## Deferred items

1. issue-b7d3's registry route, if the roster read of input 8 proves not
   enough — the case where the reporter cannot know the workspace path and
   the human is not in the room.
2. Whether the consistency note gains a check for the `.tanto/` allowlist
   (section 3's last paragraph) as a standing check rather than a
   plan-time one; this plan runs it in its Verification, and the note's
   check list is Kanri's to extend at T2 if the sweep earns a number.

## The reviews this spec has had, and what each found

1. **Kanri's and Jisso's passage check** (I-3, 2026-09-11): the role
   passages right in mechanism; four additions — K1's "nothing else writes
   these files", the moved roster's and ledger's header lines and the
   closed ledgers as historical text, the harness permission prompt on the
   cross-directory read, the handover due at the transition boundary — and
   Jisso's correction that `roles/jisso.md` carries four passages, not one
   (J2). All applied.
2. **The read-only spec reviewer** (`subagents.reviewer`, opus, 2026-09-11;
   `.superpowers/sdd/tanto-workspace/spec-review.md`, 19 findings). Its
   first dispatch died on a weekly rate limit at its first request; the
   second, after the human raised the quota and Kanri probed the model
   (tanto-workspace R-7), ran to completion. Coverage: every `.superpowers`
   line in every file maps to a passage, and 22 of 23 raw counts
   reproduce. Three blockers — the ADR of D-3 missing from the write-outs,
   K1's first text reintroducing `.superpowers/sdd/` and so falsifying the
   sweep's count, and `plan-basename`'s `SKILL.md` survivor count — and
   sixteen smaller findings, all accepted: A1's fallback aligned with S3,
   K13, and K14; the absent-roster case added to every sender text; "the
   Name column" made "the bare `<name>` before the bracket of `Name [ref]`";
   the wrapped needle replaced; two blind needles added; the note added to
   the sweep's scope; the rule 11 amendment restated as the two legal moves
   `docs/decisions/AGENTS.md` allows; decision-de63's and decision-ace0's
   old paths ruled historical; the design entry's real headings named; open
   issues' quoted anchors ruled out of scope; `ls -a`; table rows stay one
   line; one requirement citation corrected; the issue-6aa8 item marked a
   confirmation. The reviewer's Shoroku candidates go to Kanri from the
   report.

## Shoroku candidates from this spec work

1. The `<date>-<slug>` topic word of issue-f2c4 is rejected, and why (section
   1, second bullet) — an issue resolution note, not a design item.
2. The measured fact that `.superpowers/sdd` sits on 92 lines (96
   occurrences) across 15 files of the skill and the note, and
   `plan-basename` on 36 lines (40 occurrences), with `roles/jisso.md` and
   the scripts carrying none — for the dogfood record, if T2 writes one
   (the reviewer's re-measurement; the spec's first figure, 90, was neither
   count).
3. The observation that a "permitted boundary" under rule 11 is nominal
   unless the state the new text names exists at that boundary (Q-5) — a
   design-4807 sentence under rule 11, or an amendment to decision-5c8e.
