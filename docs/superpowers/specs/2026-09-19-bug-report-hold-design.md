# Design: bug-report-hold — reports are received by the cheapest live seat, held untracked, and decided at a close; every issue opens with its provenance; a one-sentence repair is applied, not filed

Written 2026-09-19 by Sekkei `dotskills-49 [1ddd52]` on fable, effort high,
at `docs/superpowers/specs/2026-09-19-bug-report-hold-design.md`, on the
branch `bug-report-hold` cut from `main` before this commit — no batch was in
flight (this topic's ledger, Progress 2026-09-18). The topic is sixth in the
order `.tanto/kikaku/2026-09-19-ttl-regimes-issue-yield-and-kanri-daemon.md`
section 5 holds — after `seat-lineage`, before `tanto-diet`.

Its inputs are five files and one dialogue, and this spec cites them by
these names:

- **the decision file** — `.tanto/kikaku/2026-09-15-bug-report-hold.md`, the
  primary T0 input: the intake moves to Hosa, the one act, the close's sweep,
  the minimized template, the tracked-write rule, the hotfix lane kept, the
  interim ruling of its section 7;
- **the source-line file** — `.tanto/kikaku/2026-09-17-issue-source-line.md`:
  an issue's body opens with one `Source:` line, a closed set of kinds, a
  pointer and never a class word, checked, retrofitted;
- **the map** — `.tanto/kikaku/2026-09-17-open-issue-map.md` §2, which names
  this topic's five issues: c3a9, d45c, a79c, 59c9, 9d17;
- **the closing-line file** — `.tanto/kikaku/2026-09-17-closing-line-identity.md`,
  in force for this window's own lines; it changes nothing below;
- **the answers file** — `.tanto/kikaku/2026-09-19-ttl-regimes-issue-yield-and-kanri-daemon.md`
  §4, which answers the five points the two earlier files left to this
  Sekkei, and §2 policy change 1, the `fix` outcome this topic designs;
- **the dialogue** — `.tanto/bug-report-hold/dialogue.md`: the first
  Sekkei's Q1, answered by the answers file; this Sekkei's Q2 to Q4, cited
  as Q2, Q3, and D-1 to D-9 (Q4's nine points, answered `OK`).

No T0 stage ran (the ledger's R-1): the decision file is the input, read
directly.

The design in one paragraph: **a bug report is a file and one line, and the
line is answered by the cheapest seat that is live** — a `live` Hosa, else
Kanri — **with one act that reads nothing**: copy the file into
`.tanto/inbox/`, append one `Received` line, answer `received: <inbox path>`.
Nothing is triaged on arrival, nothing is filed, no ruling is recorded, and
Kanri's context does not grow by a report. **Every report waits, untracked,
for the next close of any topic**, whose recommender reads the untriaged
inbox copies beside the proposal items and puts each in one of the groups the
human already checks by exception; the apply writes the accepted issues,
fills each copy's Triage section so that it leaves the queue, and, new with
this topic, **applies a one-sentence repair to the skill's own text in a
second commit** instead of opening an issue for it — the `Recommended fix`
group, policy 1 of the answers file, whose outcome word `fix` is also the
hotfix lane's. **Nothing tracked names the reporter's repository**: the
template drops every identifying field at the source, and the tracked-write
rule names a report as `inbox <YYYY-MM-DD>-<slug>` and nothing more. **Every
issue under `open/` and `deferred/` opens with a `Source:` line** — `inbox`,
`shoroku`, `hotfix`, or `session`, a pointer each — written by the apply from
the item's own heading, checked by the frontmatter hook, and retrofitted once
onto the 234 issues already there from what git and the inbox copies record.
The sender's copy lives at `.tanto/sent/<YYYY-MM-DD>-<slug>.md`, dated like
the inbox's, and is kept.

Every change below is a passage: an old text the plan quotes exactly and a
new text that replaces it, an insertion anchored on a quoted line, or a
section replaced whole between two headings. Old and new texts sit in fenced
`text` blocks. **The old texts are the working tree's on `main` as of
2026-09-19**, `shoroku-at-close` and `seat-lineage` merged and R-6's hotfix
(the recommender's bar) landed; the plan's author re-quotes each from the tree
at drafting time. A section replaced whole is quoted by the plan from heading
to heading, and this spec gives only the new text.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them
whole. Each names the file section or the dialogue question that settled it
and the requirement bullet of req-04f5 or req-3c4d it serves, or says that
none does.

1. **The intake is a `live` Hosa row, else Kanri's first row** (the decision
   file §1). The sender reads the target workspace's roster, takes the bare
   name of the row whose Role is `hosa` and Status is `live`, and, when there
   is none, of the first data row; the `ListAgents` check, the ask-the-human
   fallback, and the harness's permission prompt outside auto mode are
   unchanged. Serves req-04f5 "Trouble reports reach the repository's Kanri,
   and Kanri answers them", which this spec rewrites (Requirements 1), and
   "A run is affordable to keep running" — a report is a wake-up of the
   smallest live context, not of the conductor's.
2. **The intake's one act reads nothing** (the decision file §2; the answers
   file §4, last paragraph). Copy the file to `.tanto/inbox/<YYYY-MM-DD>-<slug>.md`,
   append one line under `## Received`, answer `received: <inbox path>`.
   No triage, no `R-n`, no ledger row, no roster Events line, no filing. The
   slug is the sender's, taken from the report file's own name (section 1.2),
   so the intake derives nothing from the report's text. Serves req-04f5
   "The human is interrupted only at defined checkpoints" — a report is not
   one.
3. **The close sweeps the inbox** (the decision file §4, amended by the
   answers file §2 policy 1). Every untriaged copy is an input to the
   close's recommend dispatch beside the T2 proposal and the `pending`
   rows' sources; the outcomes are `issue`, `fix`, `redirect`, `kaiseki`,
   `relay`, and `dismissed` (D-2); the apply writes what the direction
   accepted and fills each swept copy's Triage; a copy whose Triage carries
   one of the six words is out of the queue. Serves req-04f5 "Docs are kept
   current as part of the flow" — once per topic, at its close.
4. **The template is minimized at the source; the tracked-write rule stands
   second** (the decision file §5, Q3 = (1) there; the answers file §4:
   the Reporter section is `Reported`, the date only). No repository line,
   no reporter name or path, no quotation of the reporter repository's own
   documents; a tracked file or a commit message names a report as
   `inbox <YYYY-MM-DD>-<slug>` and nothing more. Serves the new bullet
   "Nothing tracked names another repository" (Requirements 2).
5. **The hotfix lane stays, opened by the human's word only; a report opens
   nothing** (the decision file §6). Its "body names where the report came
   from" becomes the tracked-write rule; the five `triage:` forms go; a fix
   the human orders on a pending report fills that copy's Triage with `fix`
   (D-2). Serves req-04f5's checkpoints bullet.
6. **The `Source:` line: one line, first in the body, a closed set of four
   kinds, a pointer each** (the source-line file §1-2; Q1 = (a) with the
   answers file §4's two refinements). `Source: inbox <YYYY-MM-DD>-<slug>`,
   `Source: shoroku <topic>[ S-<n>]`, `Source: hotfix <commit subject>`,
   `Source: session <YYYY-MM-DD>`. A new write of the `shoroku` kind always
   carries its `S-<n>`; the check makes ` S-<n>` optional for the retrofit.
   No frontmatter field, no tag, no classification. Serves req-3c4d's new
   bullet (Requirements 3).
7. **The check lives in `scripts/check_md_frontmatter.py`, over `open/` and
   `deferred/` only; the retrofit runs before the hook changes** (the
   answers file §4; Q3 = (a)). `resolved/` is untouched and unchecked. Serves
   req-3c4d's new bullet.
8. **The retrofit writes what is derivable and `session <created>`
   otherwise** (Q1 = (a); the answers file §4). The 22 inbox-traceable issues
   from the copies' Reference lines; the T0/T1/T2 write-outs `shoroku
   <topic>` from the commit subject; the exit-shoroku write-outs `shoroku
   <topic>` where the subject names a topic, else `session <created>`; every
   other `session <created>`. By a one-off script in the plan (D-8). Serves
   req-3c4d's new bullet.
9. **The `docs/issues/AGENTS.md` sentence goes to `experience-layer`** (the
   answers file §4). Until then the rule rides in the hook and in the apply
   dispatch's text. No kisou template edit and no migrate here. Serves none;
   it is a placement.
10. **issue-c3a9 is narrowed, not resolved** (the answers file §4): the
    intake-commit trigger goes, the landing-branch check for a human-ordered
    hotfix stays and is written into the lane (section 3.6). Serves none.
11. **A `Recommended fix` group, applied in a second commit** (the answers
    file §2 policy 1; D-1). A low-severity gap or drift in the skill's own
    prose whose whole repair is a sentence and needs no decision is
    recommended `fix`, listed on the brief, and applied by the apply
    subagent to files under `skills/` in `fix: text corrections from
    <topic>'s close`, beside `docs: T2 shoroku for <topic>`. Serves the new
    bullet "A defect whose whole repair is one sentence is repaired at the
    close, not filed" (Requirements 4) and req-3c4d's fourth group
    (Requirements 5).
12. **The sender's copy is `.tanto/sent/<YYYY-MM-DD>-<slug>.md`, kept** (Q2
    = (a)). No deletion rule; `sent` is a reserved name of `.tanto/`. Serves
    req-04f5 "tanto's own state lives in its own directory".
13. **The reserved names of `.tanto/` are one list, checked by name** (D-5;
    issue-59c9). Serves req-04f5 "tanto's own state lives in its own
    directory".

## Measured while designing

Facts read from the tree and the run's files on 2026-09-19, cited below by
number; the decision file §0 and the dialogue's first part hold the earlier
measurements and are not repeated.

1. **The inbox holds 60 copies**; 39 are untriaged under the definition of
   D-2 — 29 with an empty Outcome, 4 with the interim text `held
   (untriaged), per R-8`, 5 with no Triage section, 1 with placeholder text.
   The 21 triaged ones write their Reference in several shapes:
   `issue-<id>`, `issue-<id> (<path>, commit <hash>)`, a sentence naming a
   ledger ruling. The retrofit reads the `issue-<id>` token from that line
   and nothing else of it.
2. **305 issues: 219 open, 15 deferred, 71 resolved; none carries a
   `Source:` line.** The 234 under `open/` and `deferred/` are the retrofit's
   set.
3. **The commit subjects the retrofit reads.** Every T-stage write-out's
   subject begins `docs: T0 shoroku for `, `docs: T1 shoroku for `, or
   `docs: T2 shoroku for ` and names its topic next, sometimes with a
   descriptive tail; eighteen topic words exist as plan basenames under
   `docs/superpowers/plans/` with the date prefix stripped, and one is a
   prefix of another (`tanto` of `tanto-cost`, `tanto-sweep` of
   `tanto-sweep-2`), so the retrofit takes the longest basename the subject
   contains as a whole word. Of the exit-shoroku subjects, one names a topic
   (`at tanto-sweep-2`); the rest name a role only.
4. **The hook runs on every Markdown file** (`.pre-commit-config.yaml`,
   `types: [markdown]`), so the issues check is a path test inside
   `check_md_frontmatter.py`, and no linter configuration changes.
5. **The brief's form is pinned as `4` `##` headings in four files**:
   `roles/kanri.md` (the close's Check step), `roles/hosa.md` (the `close:`
   paragraph), `skills/shoroku/SKILL.md` (recommend mode), and
   `templates/shoroku-brief.md` (its preamble and its "four headings"
   sentence). `SKILL.md`'s Session exit and Artifacts rows say "three
   groups". Every one of them changes together (section 6, 7.2, 2.4).
6. **The route's sites today**: `roles/kanri.md` "Bug intake" is 116 lines
   (L1128-1243) in four subsections; loop step 4 (L405-408); the Handover
   trigger names "a bug-report triage" (L661); the Shoroku section names "a
   triage's observation" (L993) and "the intake's filings" (L1000);
   `SKILL.md` L681-700 (the Messages paragraph and the five forms), L582,
   L906, L909, L929, and the roles table rows for Kanri and Hosa;
   `roles/hosa.md` "Whose work you take" and "Models"; `roles/kaiseki.md`
   L33-41; `templates/roster.md` L90-92 and L123-124; `templates/kanri.md`
   L94; `README.md` L36-38. `roles/sekkei.md`, `roles/keikaku.md`,
   `roles/jisso.md`, `roles/kikaku.md`, and `templates/kanri-handover.md`
   carry no bug-route text.
7. **`docs/notes/tanto-consistency-checks.md` pins the route** at L578,
   L594-595 (`bug-report:` counts) and L684-690 (the five `triage:` forms,
   each once). The plan edits those checks (section 8.3).
8. **A live Hosa exists during this spec's writing** (`dotskills-db`, roster
   row `live`), so Step 2's pre-review relay of a rewritten procedure
   applies to section 4 (Hosa) and is sent to Kanri before the reviewer.

## 1. The principle, and the five artifacts

A report is answered by the seat whose context is smallest, with an act that
reads nothing, and is decided where every other item is decided: at a close,
by the recommender the human already checks by exception. Five artifacts
carry it.

### 1.1 The inbox copy — `.tanto/inbox/<YYYY-MM-DD>-<slug>.md`

The intake's copy of the report, untracked. Its `## Received` section holds
one line, `- <envelope from-name>, <YYYY-MM-DD>`, or
`- the human, in chat, <YYYY-MM-DD>` when the report was spoken; its
`## Triage` section is blank until a close's apply fills it. **Untriaged**
means: the Triage section is absent, or its `- Outcome —` line's value is not
one of the six words `issue`, `fix`, `redirect`, `kaiseki`, `relay`,
`dismissed` (D-2) — so an empty Outcome, the interim `held (untriaged)` text,
and a placeholder all count as untriaged (Measured 1). A filled Triage is
three lines: Outcome, one of the six words; Reference — the issue id, the
commit subject of the fix, the redirect or dismissal in one line, the
`kaiseki` line, or the topic of the relay; Date. Copies are never deleted.

### 1.2 The sent copy — `.tanto/sent/<YYYY-MM-DD>-<slug>.md`

The sender's own file, written from the template, untracked under the
reporter's `.tanto/` (fixed input 12). `<YYYY-MM-DD>` is the day it is
written and `<slug>` the sender's kebab-case slug of the symptom, one to
six words. The intake copies it under the **same basename**, so the slug is
the sender's and the intake reads nothing; when the received file's name is
not of that shape — an older sender, a human's own file — the intake names
the copy with today's date and the file's basename, kebab-cased. The sent
copy is the log of the send (its Send to section says where it went) and
is kept as `.tanto/<topic>/` is kept: untracked, local, disk the only cost.

### 1.3 The `Source:` line

The first non-empty line of an issue's body under `docs/issues/open/` and
`docs/issues/deferred/`, one of:

```text
Source: inbox <YYYY-MM-DD>-<slug>
Source: shoroku <topic> S-<n>
Source: shoroku <topic>
Source: hotfix <commit subject>
Source: session <YYYY-MM-DD>
```

`inbox` points at the receiving repository's inbox copy by its basename
without `.md`; `shoroku` at the conductor ledger `.tanto/<topic>/kanri.md`
and its row — a new write always carries the row, the retrofit may not;
`hotfix` at the commit that filed the issue, by its subject; `session` at
the day of a shoroku run outside tanto, whose provenance is the session
itself. The pattern the hook checks is section 8.1's. A pointer is never a
class word: no destination topic, no theme, no severity.

### 1.4 The `Recommended fix` group

The recommendation's fourth group, between `Recommended adopt` and
`Recommended reject` (D-1). An item belongs there when it is a low-severity
gap or drift in the skill's own prose, its whole repair is one sentence or a
few adjacent ones in one file under `skills/`, and it needs no decision. Its
body carries `File:`, the current text in an `Old:` fence, the corrected
text in a `New:` fence, and the one-line reason; the brief's line renders
the corrected text. The apply replaces each accepted `Old:` with its `New:`
exactly once and commits the changed files in a second commit after the docs
commit. A `fix` item writes no issue; its record is the commit, and for an
inbox item the copy's Triage.

### 1.5 The reserved names of `.tanto/`

One list, stated once in `SKILL.md`'s Workspace section (2.6) and read by
Kanri's Start step 2 and step 5 (3.1): the directories `inbox`, `sent`,
`kikaku`, `kaiseki`; the files `roster.md`, `roster-archive.md`,
`kanri-handover.md`, `.gitignore`, `.markdownlint-cli2.yaml`; the prefixes
`exit-kanri-` and `inbox-`. A topic slug is none of them.

## 2. `skills/tanto/SKILL.md`

### 2.1 The roles table

Old, the Kanri row's Owns cell and the Hosa row's:

```text
roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake, the create requests and the `release:` lines
```

```text
the human's small chores, Kanri's filings, and the close's recommend, check, and apply, each in a slot Kanri gives
```

New:

```text
roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake when no Hosa is live, the create requests and the `release:` lines
```

```text
the human's small chores, the bug intake, Kanri's filings, and the close's recommend, check, and apply, each in a slot Kanri gives
```

### 2.2 "Messages": the bug-report paragraph and the five forms, replaced

Old — the two paragraphs from `A defect noticed in a skill goes to the Kanri
of the repository that ships that` through `` `triage: relayed as I-<n>`. `` —
are replaced by:

```text
A defect noticed in a skill goes to the repository that ships that skill, as
a **bug report**: a file written from `templates/bug-report.md` at
`.tanto/sent/<YYYY-MM-DD>-<slug>.md` under the reporter's own repository, and
one line, `bug-report: <absolute path>`. Any session may write and send one;
when the human noticed the defect, they hand it to a live Hosa as a chore, or
say it in Kanri's window. **The intake is the target repository's `live`
Hosa, else its Kanri**: the sender reads `<workspace>/.tanto/roster.md`,
takes the bare `<name>` before the bracket of the `Name [ref]` column of the
row whose Role is `hosa` and Status is `live`, or, when there is none, of the
first data row, the human supplying the workspace's path where the sender
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

### 2.3 The `no-role` bullet's enumeration

Old:

```text
  directions, the handshake, the bug-report route and its `triage:` answer
```

New:

```text
  directions, the handshake, the bug-report route and its `received:` answer
```

### 2.4 "Session exit": the recommend, check, and apply steps

Three passages in the four-step list, and one in the Hosa paragraph.

Step 2, old:

```text
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the T2 proposal and every source the `pending` rows name — the
   spec's sections by heading, each proposal by path, each report by path
   and item — and names the output, `t2-recommendation.md`: every item once,
   quoted in full from its source, in three groups — Recommended adopt,
   Recommended reject, Unsure — each with its destination and its one-line
   reason.
```

New:

```text
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the T2 proposal, every source the `pending` rows name — the
   spec's sections by heading, each proposal by path, each report by path
   and item, each with its `S-n` — and every untriaged copy under
   `.tanto/inbox/`, by path, and names the output, `t2-recommendation.md`:
   every item once, quoted in full from its source, its heading carrying the
   pointer its `Source:` line will take, in four groups — Recommended adopt,
   Recommended fix, Recommended reject, Unsure — each with its destination
   and its one-line reason. An inbox item's destination is one of `issue`,
   `fix — <file>`, `redirect — <where it belongs>`, `kaiseki — <one line>`,
   `relay — <topic>`, or `dismissed — <one line>`; a `fix` item carries the
   file, the text as it reads, and the text as it should read.
```

Step 3, old:

```text
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
```

New:

```text
3. **Check.** Kanri checks the brief's form by `grep` — the five headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
```

Step 4, old:

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

New:

```text
4. **Apply.** Kanri dispatches the `shoroku.apply` kind with the
   recommendation, the direction, and the commit subject; that subagent
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

The Hosa paragraph, old:

```text
and Hosa dispatches the recommender, form-checks and pastes the brief in
its own window under its chores grant, writes the direction from the
human's answer — or from a `decision: <path>` line Kanri relays — dispatches
the apply in that slot, and answers `close done: <commit subject> — <reading>`
or `close blocked: <one line>`; Kanri, or the successor it has handed over
to, verifies the commit and fills the ledger. With no Hosa live, Kanri runs
the three steps itself.
```

New:

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

Two more sentences in the same section. In the "Who proposes when" list's
Kanri bullet nothing changes. In "The files", old:

```text
The close's three files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the topic
directory; there are no others. The apply subagent's commit subject is
`docs: T2 shoroku for <topic>` — the one fixed prefix, `docs: T2 shoroku`,
that the whole-branch review package excludes.
```

New:

```text
The close's three files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the topic
directory; there are no others. The apply subagent's commit subjects are
`docs: T2 shoroku for <topic>` and, when a `fix` item was accepted,
`fix: text corrections from <topic>'s close` — the two fixed prefixes,
`docs: T2 shoroku` and `fix: text corrections`, that the whole-branch review
package excludes.
```

### 2.5 The Artifacts table

The `.tanto/roster.md` row's Readers cell, old `all roles; a bug-report
sender, its first data row`, new `all roles; a bug-report sender, its live
Hosa row or its first data row`.

The inbox row, old:

```text
| `.tanto/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
```

New, and one new row after it:

```text
| `.tanto/inbox/<date>-<slug>.md` | the intake — a live Hosa, else Kanri | the close's recommender, by path; the apply, for the Triage section | a bug report received, under the sender's basename, with its Received line; its Triage section is filled by the close's apply and marks the copy triaged |
| `.tanto/sent/<date>-<slug>.md` | the session that noticed the defect — any role, or Hosa from the human's words | the intake of the target workspace, by the path the `bug-report:` line carries | a bug report sent, from `templates/bug-report.md`; kept, never deleted by a rule |
| `.tanto/inbox-<date>-recommendation.md`, `-brief.md`, `-direction.md` | the between-plans inbox sweep's recommender, and Kanri or Hosa for the direction | Kanri, the human, the apply | the sweep's three files when no topic is open, beside the roster |
```

The `t2-recommendation.md` row's Content cell, old `in three groups —
Recommended adopt, Recommended reject, Unsure —`, new `in four groups —
Recommended adopt, Recommended fix, Recommended reject, Unsure —`; the
`t2-brief.md` row's Content cell keeps "grouped as the recommendation groups
them". The `.tanto/.gitignore` row's Writer cell keeps `Kanri at start, a
standalone Kaiseki, or a bug-report writer`.

### 2.6 "Workspace": the reserved names

Insert after the paragraph that begins `` `.tanto/<topic>/` outlives the plan ``:

```text
`.tanto/` reserves these names, and a topic slug is none of them: the
directories `inbox`, `sent`, `kikaku`, and `kaiseki`; the files `roster.md`,
`roster-archive.md`, `kanri-handover.md`, `.gitignore`, and
`.markdownlint-cli2.yaml`; and the prefixes `exit-kanri-` and `inbox-`.
Kanri checks a new slug against this list by name, before any directory
exists, and lists the root against the same names at every start and every
close.
```

## 3. `skills/tanto/roles/kanri.md`

### 3.1 "Start", steps 2 and 5: the reserved names

Step 2, old:

```text
   Then list `.tanto/` itself and report in your start line every entry that
   is none of these: `.gitignore`, `.markdownlint-cli2.yaml`, `roster.md`,
   `roster-archive.md`, `kanri-handover.md`, `inbox/`, `kikaku/`, `kaiseki/`,
   one directory per topic the roster or the archive names — open, or closed
   and kept under the Workspace section's retention rule — and your
   predecessors' `exit-kanri-*` files; the human decides what to do
```

New:

```text
   Then list `.tanto/` itself and report in your start line every entry that
   is none of these: the reserved names `SKILL.md`'s Workspace section lists
   — `.gitignore`, `.markdownlint-cli2.yaml`, `roster.md`,
   `roster-archive.md`, `kanri-handover.md`, `inbox/`, `sent/`, `kikaku/`,
   `kaiseki/`, your predecessors' `exit-kanri-*` files, and the between-plans
   sweep's `inbox-*` files — and
   one directory per topic the roster or the archive names — open, or closed
   and kept under the Workspace section's retention rule; the human decides what to do
```

Step 5, old:

```text
   sentence, a name — derive a kebab-case slug of one to three words, check
   that no `.tanto/<slug>/`, no spec for that slug at the default spec
   location (`docs/superpowers/specs/*-<slug>-design.md`), and no branch
   `<slug>` exists (`ls -d`, the glob, and `git branch --list <slug>`), state
```

New:

```text
   sentence, a name — derive a kebab-case slug of one to three words, check
   that it is none of the reserved names `SKILL.md`'s Workspace section
   lists, and that no `.tanto/<slug>/`, no spec for that slug at the default spec
   location (`docs/superpowers/specs/*-<slug>-design.md`), and no branch
   `<slug>` exists (`ls -d`, the glob, and `git branch --list <slug>`), state
```

### 3.2 "The batch loop", step 4

Old:

```text
4. **Triage any bug report that arrived during the batch**, per "Bug intake"
   below: rule on each, and send the redirects, the Kaiseki requests, and the
   relays now. An issue to file or a hotfix to make waits for the commit window
   at step 7.
```

New (the number is kept, so that the steps other passages name — step 7's
commit window, slot (a) and (b) — keep their numbers; renumbering is
`tanto-diet`'s, D-7):

```text
4. **Bug reports need nothing from you here.** A report received during
   the batch sits in `.tanto/inbox/`, answered `received:` by its intake, and
   is read at the close ("Bug intake" below); a fix the human orders on one
   is the hotfix lane, in slot (b) of step 7.
```

### 3.3 "Handover", the trigger's sentence

Old:

```text
there — a bug-report triage, the handshakes, a resume — with no
```

New:

```text
there — a between-plans inbox sweep, the handshakes, a resume — with no
```

### 3.4 "Shoroku": the four steps and the two paragraphs after them

Step 2, old, from `2. **Recommend.** At the close, dispatch` through `the
recommender writes both files in one run.`, is replaced by:

```text
2. **Recommend.** At the close, dispatch `subagent_type: tanto-shoroku-recommend`
   in the skill's recommend mode over the T2 proposal, every source the
   `pending` rows name — the spec with its four section names, each proposal
   by path, each report by path and item, **each named with its `S-n`** so
   that the item's heading and its `Source:` line can carry it — and **every
   untriaged copy under `.tanto/inbox/`**, by path — a copy whose Triage
   section is absent or whose Outcome is none of `issue`, `fix`, `redirect`,
   `kaiseki`, `relay`, `dismissed` — with `docs/` as the baseline, and name
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

Step 3, old:

```text
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `4` and the
   four headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended reject`, `## Unsure`, in that order; every `### ` heading
```

New:

```text
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `5` and the
   five headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended fix`, `## Recommended reject`, `## Unsure`, in that
   order; every `### ` heading
```

Step 4, old, from `4. **Apply.** Dispatch` through `and fill the Written
column.`, is replaced by:

```text
4. **Apply.** Dispatch `subagent_type: tanto-shoroku-apply` in apply mode with
   the recommendation, the direction, and the commit subject —
   `docs: T2 shoroku for <topic>` — in slot (a) of the commit window. The
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
   `spec-inputs.md` with your note and send its Sekkei one line; a `kaiseki`
   outcome is a numbered item in your close line asking the human to open a
   standalone Kaiseki with the copy's path.
```

The "Between plans" paragraph, old:

```text
**Between plans** there is no ledger, so record items that reach you then —
a Kikaku decision file belonging to no topic, a triage's observation, your
own exit's proposal, a close's `-2-proposal.md` — in the roster's Shoroku
```

New:

```text
**Between plans** there is no ledger, so record items that reach you then —
a Kikaku decision file belonging to no topic, your
own exit's proposal, a close's `-2-proposal.md` — in the roster's Shoroku
```

The paragraph after it, old:

```text
The apply subagent is the writer at the close. You write under `docs/` only
through the intake's filings and the hotfix lane, and you hand those to Hosa
when one is live.
```

New:

```text
The apply subagent is the writer at the close. You write under `docs/` only
through the hotfix lane, on the human's word, and you hand that to Hosa when
one is live.
```

### 3.5 "Delegation to Hosa": the fix commit and the between-plans sweep

Old:

```text
`close done:` verify the commit as you verify any — `git status` clean, the
diff's paths those the direction names, lint on them — and fill Adopted
from the direction file and Written from the subject. You wait for none of
it: a close delegated is carried in the handover file's In flight block,
and the successor verifies. With no Hosa live, run the three steps
yourself, and add to your close line the suggestion to open one
(`/tanto hosa`), in the shape of the between-plans Kikaku suggestion.
```

New:

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

### 3.6 "Bug intake", replaced whole

The section from `## Bug intake` to the line before `### Limits` is
replaced by the text below; "Limits" stays as it is.

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
conditions, the ruling `R-n`, and the commit subject stay yours.

So that hotfixes reach `docs/` once, carry them forward: when you create a new
topic's ledger, copy the hotfix lines recorded in the roster's Events since the
previous plan into the ledger's "Hotfixes since the previous plan" line, and at
T2 name that line in the direction so the dogfood report carries them.

A fix to a file the in-flight plan rewrites takes one of three paths. If a task
that rewrites the file is still ahead and Keikaku is still live, it is a
cold-read question to Keikaku, which edits the plan's fenced block so that the
task delivers the fix. If every rewriting task has run and only the final batch
remains, the fix joins the whole-branch review's single fix wave. If neither
holds, it waits for the close as an inbox copy the human writes in your window.

### Reporting from the other side

You are also a reporter: a Kanri in another repository is where a defect in
this repository's skills is often noticed. On the human's request, write the
report from `templates/bug-report.md` at
`.tanto/sent/<YYYY-MM-DD>-<slug>.md` under your own `.tanto/`; read the
intake's bare name — the `<name>` before the bracket of the `Name [ref]`
column — from `<target workspace>/.tanto/roster.md`, the row whose Role is
`hosa` and Status is `live`, or the first data row when there is none,
asking the human for the workspace's path if you do not know it, and
expecting, outside auto mode, a harness permission prompt in your window
for a read outside your working directory; check that the name is in
`ListAgents`, and ask the human for the address when it is not, or when
that roster is absent; send `bug-report: <absolute path>` to that bare
name. The sent copy is the record of the send, and it is kept.
```

### 3.7 Two sentences elsewhere in the file

In "Handover", the handover file's contents list names nothing of the
intake; nothing changes. In "Session lifecycle", the Readings row for Hosa
names nothing of it either. The plan's author greps the file for
`triage`, `intake`, and `filing` after the passages above and reports any
hit outside "Bug intake" as an old value (the table below).

## 4. `skills/tanto/roles/hosa.md`

### 4.1 "Whose work you take": the intake, and Kanri's chores

Old, the "Kanri's" paragraph:

```text
**Kanri's.** Sent as one line:
`chore: <what> — <paths> — slot: now | at the next boundary`. These are the
bug intake's issue filings, the note updates, and the hotfix lane's edits
when Kanri prefers not to hold them. For those you are **Kanri's hand**:
the lane's conditions, the ruling `R-n`, and the commit subject stay
Kanri's. You make the edit and nothing around it.
```

New, the paragraph and a new one before it:

```text
**The intake's.** While your roster row is `live`, every `bug-report:
<path>` line for this repository is addressed to you, from another
repository's session or from a session of this one, and you answer it with
one act that reads nothing of the report: copy the file to
`.tanto/inbox/<basename>` — the sender's `<YYYY-MM-DD>-<slug>.md`, or
today's date and the file's name kebab-cased when it is not of that shape —
creating `inbox/` if absent; append one line under the copy's `## Received`
heading, `- <the envelope's from-name>, <YYYY-MM-DD>`; answer one line,
`received: <inbox path>`, copying the envelope's `from` into `to`. Nothing
else: no `chore:` line to Kanri, no triage, no filing — the report waits in
the inbox for a close, and Kanri learns of it there. When the human hands you
a defect they noticed, in this window, write it from
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

### 4.2 The `close:` paragraph, and the `sweep:` line

Old, inside the "The close's" paragraph:

```text
Read the ledger's
Shoroku proposal items table for
the `pending` rows and the source each names; dispatch
`subagent_type: tanto-shoroku-recommend` in the `shoroku` skill's recommend
mode over the proposal and every one of those sources, with `docs/` as the
baseline, the recommendation path, the brief path, the template
`templates/shoroku-brief.md`, and the chat's language; check the brief's
form by `grep` as `roles/kanri.md`'s Check step says — the four headings
in order, every `###` heading of the recommendation once after `See:` —
```

New:

```text
Read the ledger's
Shoroku proposal items table for
the `pending` rows and the source each names, with its `S-n`; list the
untriaged copies under `.tanto/inbox/` — the Triage section absent, or its
Outcome none of `issue`, `fix`, `redirect`, `kaiseki`, `relay`, `dismissed`;
dispatch
`subagent_type: tanto-shoroku-recommend` in the `shoroku` skill's recommend
mode over the proposal, every one of those sources named with its `S-n`,
and every one of those copies by path, with `docs/` as the
baseline, the recommendation path, the brief path, the template
`templates/shoroku-brief.md`, and the chat's language; check the brief's
form by `grep` as `roles/kanri.md`'s Check step says — the five headings
in order, every `###` heading of the recommendation once after `See:` —
```

Old, the end of the same paragraph:

```text
`subagent_type: tanto-shoroku-apply` in apply mode with the recommendation,
the direction, and the subject, in the slot the line gave — no
`slot-needed:` is sent, the slot is in the line; and answer Kanri
`close done: <commit subject> — <reading>`. When the brief fails its form
twice, or the human does not answer, answer `close blocked: <one line>`
instead and idle. Kanri verifies the commit and writes the ledger; you
write neither.
```

New, and a new paragraph after it:

```text
`subagent_type: tanto-shoroku-apply` in apply mode with the recommendation,
the direction, and the subject, in the slot the line gave — no
`slot-needed:` is sent, the slot is in the line; the apply makes the docs
commit and, when a `fix` item was accepted, the fix commit after it, its
subject fixed by `roles/kanri.md`; and answer Kanri
`close done: <commit subject> — <reading>`, the docs commit's subject. When
the brief fails its form
twice, or the human does not answer, answer `close blocked: <one line>`
instead and idle. Kanri verifies the commits and writes the ledger; you
write neither.

**The inbox sweep's.** Sent between plans as one line,
`sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`.
The same three steps as a `close:` line's, over the untriaged inbox copies
alone and no ledger: the paths are `.tanto/inbox-<YYYY-MM-DD>-*.md` beside
the roster, the commits land on `main`, and you answer `close done:` or
`close blocked:` the same way.
```

### 4.3 "Models"

Old:

```text
Any subagent you dispatch takes `subagents.default`, except the close's
two: the recommender takes `subagents.shoroku.recommend` and is dispatched
```

New:

```text
Any subagent you dispatch takes `subagents.default`, except the close's and
the sweep's
two: the recommender takes `subagents.shoroku.recommend` and is dispatched
```

### 4.4 "Not yours": the sweep's input is not a row

Old:

```text
The proposal items and the ledger. You never write a proposal or an `S-n`
row: the session that holds the items writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` line, and only a subagent applies them.
```

New:

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

## 5. `skills/tanto/roles/kaiseki.md`

The standalone clause, old:

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

New:

```text
there is no Kanri to rule for you. And when the human asks for a defect to be
reported to another repository, write the report from
`templates/bug-report.md` at `.tanto/sent/<YYYY-MM-DD>-<slug>.md`, read the
intake's bare name — the `<name>` before
the bracket of the `Name [ref]` column — from that
repository's `.tanto/roster.md`, the row whose Role is `hosa` and Status is
`live`, or the first data row when there is none, the human giving you the
workspace's path,
check the name against `ListAgents`, and send `bug-report: <absolute path>`
to it; when that roster is absent or the name is not listed, ask the human
for the address, and a report you still cannot send stays a file the human
carries. An issue your own shoroku run files opens with
`Source: session <YYYY-MM-DD>`, as the `shoroku` skill's session mode
writes it.
```

## 6. `skills/shoroku/SKILL.md` and its README

### 6.1 "Step 3: Shoroku": the `session` kind

Insert after the paragraph that begins `Classification follows the two
splits`:

```text
An issue written in session, memory, or file mode opens its body with one
line, `Source: session <YYYY-MM-DD>`, the day of the run — the first
non-empty line after the frontmatter, before the narrative. In recommend and
apply mode the caller's dispatch names the kind and the pointer instead, and
the apply writes what the item's heading carries.
```

### 6.2 "Recommend mode": the fourth group, the pointer in the heading, the `fix` item

Old:

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

New:

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

Old:

```text
whole recommendation, assigned in the order the dispatch names its
sources — unique across the whole file, never restarted per group nor per
source proposal — and each heading naming which source it came from; where
the source is not a numbered proposal, as for a spec's sections, a running
number in the order the items are written — so that a reader can point at
```

New:

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

### 6.3 "Apply mode": the `Source:` line, the inbox Triage, and the second commit

Old:

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

New:

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

### 6.4 "Prohibited actions"

Old:

```text
- Do NOT write outside `docs/` — except the recommendation file a caller
  names in recommend mode. `shoroku` no longer installs or edits
  `AGENTS.md`; setting up the system is `kisou`'s job.
```

New:

```text
- Do NOT write outside `docs/` — except the recommendation and brief files
  a caller names in recommend mode, and in apply mode the inbox copies'
  Triage sections and the `Recommended fix` files the dispatch names.
  `shoroku` no longer installs or edits
  `AGENTS.md`; setting up the system is `kisou`'s job.
```

### 6.5 `skills/shoroku/README.md`

Old:

```text
  **recommend** writes the numbered proposal, each item under its own `###`
  heading and marked adopt, reject, or unsure, to a path the caller names —
```

New:

```text
  **recommend** writes the numbered proposal, each item under its own `###`
  heading and marked adopt, fix, reject, or unsure, to a path the caller names —
```

## 7. The templates

### 7.1 `templates/bug-report.md`, replaced whole

The file is replaced by the text below (a `W` block in the plan; the inner
`console` fence is part of the file, so the plan's outer fence is four
backticks):

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
whose Role is `hosa` and Status is `live`, or of the first data row when
there is none, checked against `ListAgents`, or given by the human when that
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

<Left blank by the reporter. The intake appends one line to the inbox copy.>

- <the envelope's from-name, or "the human, in chat">, <YYYY-MM-DD>

## Triage

<Left blank by the reporter and by the intake. The close's apply fills it in
the inbox copy and nowhere else; a copy whose Outcome is one of the six
words is out of the queue.>

- Outcome — <issue, fix, redirect, kaiseki, relay, or dismissed>
- Reference — <the issue id, the fix's commit subject, the redirect or
  dismissal in one line, the kaiseki line, or the relay's topic>
- Date — <YYYY-MM-DD>
````

### 7.2 `templates/shoroku-brief.md`

Three passages. The preamble's sentence, old:

```text
the exception and stay exactly as they are here: the four `##` headings, the
bracketed tag word, the `<n>.` numbers, and the label `See:` with the heading
```

New:

```text
the exception and stay exactly as they are here: the five `##` headings, the
bracketed tag word, the `<n>.` numbers, and the label `See:` with the heading
```

The line shape and the "always present" sentence, old:

```text
    <n>. [adopt | reject | unsure] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>

The numbers are the recommendation's own, one run across the whole file, never
restarted per group, and every `###` heading of the recommendation appears
after exactly one `See:`. A group with no item keeps its heading and carries
the single rendered line `none`, so that the four headings are always
present.
```

New:

```text
    <n>. [adopt | fix | reject | unsure] <destination> — <the item in one sentence> — <the one-line reason> — See: <the item's heading text, without its ### marker>

The numbers are the recommendation's own, one run across the whole file, never
restarted per group, and every `###` heading of the recommendation appears
after exactly one `See:`. A group with no item keeps its heading and carries
the single rendered line `none`, so that the five headings are always
present. A `fix` line's second part is the text as it should read, so that
the human sees the sentence that will be applied.
```

The new group, inserted between `## Recommended adopt`'s line and
`## Recommended reject`:

```text
## Recommended fix

<n>. [fix] <the file> — <the text as it should read> — <the one-line reason> — See: <the item's heading text, without its ### marker>
```

### 7.3 `templates/roster.md`

The Shoroku proposal items paragraph, old:

```text
Between plans there is no conductor ledger, so an item raised then — by a
between-plans triage or a Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's `-2-proposal.md` — is recorded here with
```

New:

```text
Between plans there is no conductor ledger, so an item raised then — by a
Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's `-2-proposal.md` — is recorded here with
```

Old:

```text
Columns as the ledger's, with Source the triage, report, or session that
```

New:

```text
Columns as the ledger's, with Source the file, report, or session that
```

The Events line, old:

```text
  proposed by <name> [<ref>], or not run and what was lost; a bug report
  received, or sent to <name> [<ref>];
  decision: <path> received from <name>;
```

New:

```text
  proposed by <name> [<ref>], or not run and what was lost;
  an inbox sweep: its three files and its commit subjects;
  decision: <path> received from <name>;
```

### 7.4 `templates/kanri.md`

The Events line, old:

```text
  a bug report triaged and its outcome; an exit proposal form-checked and its
```

New:

```text
  an exit proposal form-checked and its
```

## 8. The repository: the check, the retrofit, the note, one issue, the README

### 8.1 `scripts/check_md_frontmatter.py`: the `Source:` check

The hook already runs on every Markdown file (Measured 4); the script gains
a path test and one body check, and nothing in `.pre-commit-config.yaml`
changes. The docstring's last sentence, `Per-kind schema checks (required
keys, name formats) are not done here.`, becomes `Per-kind schema checks
(required keys, name formats) are not done here, with one exception: an
issue under docs/issues/open/ or docs/issues/deferred/ must open its body
with a Source: line.`

Module level, after `HINT`:

```python
SOURCE_RE = re.compile(
    r"^Source: (?:"
    r"inbox \d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*"
    r"|shoroku [a-z0-9]+(?:-[a-z0-9]+)*(?: S-\d+)?"
    r"|hotfix \S.*"
    r"|session \d{4}-\d{2}-\d{2}"
    r")$"
)
SOURCE_HINT = (
    "an issue's body must open with a Source: line — inbox <YYYY-MM-DD>-<slug>, "
    "shoroku <topic>[ S-<n>], hotfix <commit subject>, or session <YYYY-MM-DD>"
)


def _is_checked_issue(path: Path) -> bool:
    posix = "/" + path.as_posix()
    return "/docs/issues/open/" in posix or "/docs/issues/deferred/" in posix
```

with `import re` added to the imports. In `check()`, the mapping test's
`return [], False` becomes:

```python
    if not _is_checked_issue(path):
        return [], False
    body_index = next((i for i in range(end + 1, len(lines)) if lines[i].strip()), None)
    if body_index is None or not SOURCE_RE.match(lines[body_index].rstrip()):
        line = body_index + 1 if body_index is not None else end + 1
        return [f"{path}:{line}: {SOURCE_HINT}"], False
    return [], False
```

A file under `open/` or `deferred/` with no frontmatter is not an issue the
docs rules allow, and the existing early return leaves it alone as before:
the check binds only files that open with `---`, which every issue does.

A test file, `scripts/test_check_md_frontmatter.py`, with `unittest`:
four cases — an issue whose first body line is each kind passes; a
`shoroku` line without ` S-<n>` passes; an issue under `open/` whose first
body line is narrative fails with the hint; the same file under
`resolved/` passes; a non-issue Markdown file with frontmatter passes
untouched. Run as
`uv run --no-project --with pyyaml python -m unittest discover -s scripts -p 'test_check_md_frontmatter.py'`.

### 8.2 The retrofit, once, before the hook changes

A one-off script the plan carries as a fenced block, run by Jisso from the
scratch directory and not committed, over every file under
`docs/issues/open/` and `docs/issues/deferred/` (234 today, Measured 2). For
each file it derives one line, in this order of rules, and takes the first
that applies:

1. **`inbox`.** If any copy under `.tanto/inbox/` has a Triage Reference
   line whose text contains the token `issue-<id>` for this file's `id`,
   the line is `Source: inbox <that copy's basename without .md>`. The token
   is all it reads of the Reference (Measured 1); when two copies name the
   same issue, the older basename wins.
2. **`shoroku <topic>`.** Else, take the subject of the commit that first
   added the file (`git log --follow --diff-filter=A --format=%s -- <path>`,
   the last line). If it begins `docs: T0 shoroku for `, `docs: T1 shoroku
   for `, `docs: T2 shoroku for `, or `docs: exit shoroku`, and contains as a
   whole word one of the topic words — the basenames under
   `docs/superpowers/plans/` with the leading `<YYYY-MM-DD>-` and `.md`
   stripped — the line is `Source: shoroku <topic>`, the **longest** such
   word (Measured 3: `tanto-cost` over `tanto`, `tanto-sweep-2` over
   `tanto-sweep`). No ` S-<n>`: the ledgers do not record which row wrote
   which issue.
3. **`session <created>`.** Else, the line is `Source: session <created>`,
   the frontmatter's `created:` value.

The line is inserted as the first body line — after the closing `---`, then
one blank line, then the line, then a blank line, then the body as it was —
and `updated:` is set to the run's date, as the docs rules ask. `resolved/`
is not touched (fixed input 7). One commit,
`docs(issues): open every open and deferred issue with a Source: line`, by
explicit path. The task that changes the hook (8.1) runs **after** this
commit, so that the hook never sees an unlabelled file; the plan's Done
when for the retrofit is `grep -L '^Source: ' docs/issues/open/*.md
docs/issues/deferred/*.md` printing nothing, and a count of the four kinds
recorded in the dogfood report.

### 8.3 `docs/notes/tanto-consistency-checks.md`

The plan edits the note's checks as the passages above change the strings:
the `bug-report:` counts at L578 and L594-595 take their new values; the
five-`triage:` loop at L684-690 is replaced by a check that
`received: <inbox path>` appears once in each of `skills/tanto/SKILL.md`,
`roles/kanri.md`, and `roles/hosa.md`, and that the `sweep:` line —
`sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`
— appears once in each of the same three files; and a new check that
`grep -c '^## ' skills/tanto/templates/shoroku-brief.md` is `5` and
`grep -c '^## Recommended fix$'` on it is `1`. The note's prose around L620
("the bug-report line — each copy once") stands.

### 8.4 issue-c3a9, narrowed

The plan edits `docs/issues/open/c3a9-…md` (fixed input 10): the title
becomes `a between-plans hotfix or filing can land on a concurrent topic's
freshly cut branch instead of main`; a dated paragraph is appended:

```text
2026-09-19, `bug-report-hold`: the intake commit that triggered this no
longer exists — a report received is copied to the inbox, not filed — and
gap 1, Kanri's own check, is written into the hotfix lane ("Where the commit
lands", `roles/kanri.md`). What remains open is gap 2: nothing tells a
Sekkei or Keikaku about to cut a topic branch that a human-ordered
between-plans commit may be about to land on the shared checkout.
```

with `updated:` restamped. Its `Source:` line comes from the retrofit like
every other.

### 8.5 `skills/tanto/README.md`

Old:

```text
- Takes bug reports about the skills this repository ships: a report is a file
  and one line to Kanri, which triages it into an issue, a redirect, a
  root-cause session, a one-line hotfix, or an input to a spec in progress.
```

New:

```text
- Takes bug reports about the skills this repository ships: a report is a
  file and one line to the run's live Hosa, or to Kanri when none is live,
  which copies it and answers `received:`; every report is decided at the
  next topic's close with everything else — an issue, a one-sentence fix
  applied to the skill's text, a redirect, a root-cause session, an input to
  a spec in progress, or dismissed — and nothing tracked names the
  reporter's repository.
```

## 9. The boundary, the interim rulings, and rule 11

This plan edits the skill's own files, and the sessions that run it load the
working tree's copy (rule 11). Its Global Constraints therefore say: the
authority for the run's sessions is the plan, Kanri's orders line, and the
batch prompts, not the role text on disk; **the safe boundary is the final
one** — no role is started or replaced before it, and the Hosa that is live
while the plan runs keeps the intake act it started with, Kanri's interim act
(the decision file §7) standing until the merge. Two consequences the plan
states:

- **Senders in other repositories read the linked tree mid-plan.** A session
  of another workspace started while this plan is in flight reads whatever
  `SKILL.md` says that day, and may address a `live` Hosa row before that
  Hosa has read the new act. The plan lands the sender-side passages —
  `SKILL.md` 2.2, `roles/kaiseki.md` 5, `roles/kanri.md` "Reporting from the
  other side" — in its **final batch**, after `roles/hosa.md` 4.1, and the
  human releases the live Hosa at the final boundary and opens a new one
  after the merge, so that the first Hosa a sender reaches under the new rule
  has read it. A report that arrives at Kanri meanwhile takes the interim
  act, which is the new one in all but the address.
- **The interim rulings end at the merge.** The `R-n` the decision file §7
  asked for in every open ledger ends when this plan's branch lands on
  `main`; Kanri records that in the topic's ledger, and a handover file
  written before the merge carries the rulings as they are.

The plan's batch cut is Keikaku's; this spec asks only that the retrofit
(8.2) precede the hook (8.1) in task order, that the four brief-form sites
(Measured 5) change in one batch, and that the sender-side passages close
the plan.

## Where each change lives

| File | Sections |
| --- | --- |
| `skills/tanto/SKILL.md` | 2.1 to 2.6 |
| `skills/tanto/roles/kanri.md` | 3.1 to 3.7 |
| `skills/tanto/roles/hosa.md` | 4.1 to 4.4 |
| `skills/tanto/roles/kaiseki.md` | 5 |
| `skills/shoroku/SKILL.md` | 6.1 to 6.4 |
| `skills/shoroku/README.md` | 6.5 |
| `skills/tanto/templates/bug-report.md` | 7.1 |
| `skills/tanto/templates/shoroku-brief.md` | 7.2 |
| `skills/tanto/templates/roster.md` | 7.3 |
| `skills/tanto/templates/kanri.md` | 7.4 |
| `scripts/check_md_frontmatter.py`, `scripts/test_check_md_frontmatter.py` (new) | 8.1 |
| `docs/issues/open/*.md`, `docs/issues/deferred/*.md` (the retrofit) | 8.2 |
| `docs/notes/tanto-consistency-checks.md` | 8.3 |
| `docs/issues/open/c3a9-…md` | 8.4 |
| `skills/tanto/README.md` | 8.5 |

Not touched: `roles/sekkei.md`, `roles/keikaku.md`, `roles/jisso.md`,
`roles/kikaku.md`, `templates/kanri-handover.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/review-brief.md`,
`templates/kikaku-decision.md`, `templates/agent.md`, `templates/tanto.json`,
`templates/roster-archive.md`; `scripts/reading.js` and
`scripts/passage-check.js` with their tests; `.pre-commit-config.yaml`;
`docs/issues/AGENTS.md` (fixed input 9); `docs/issues/resolved/**` (fixed
input 7); kisou's templates. `docs/design/4807-tanto.md`'s "Bug intake" and
shoroku sections are the close's, through the recommender.

## Old values this plan contradicts

Strings the plan's final sweep counts to `0` across `skills/tanto/SKILL.md`,
`skills/tanto/roles/`, `skills/tanto/templates/`, `skills/tanto/README.md`,
and `skills/shoroku/SKILL.md` — never the scripts, whose tests carry old
strings as fixtures — unless a section above keeps one:

| String | Where | Goes at |
| --- | --- | --- |
| `triage: issue-<id>`, `triage: redirect`, `triage: kaiseki requested`, `triage: hotfix`, `triage: relayed as I-<n>`, and the word `triage:` | `SKILL.md` Messages and the `no-role` bullet; `roles/kanri.md` Bug intake | 2.2, 2.3, 3.6 |
| `Triage — five outcomes`, `Each triage is a ruling of yours` | `roles/kanri.md` | 3.6 |
| `Triage any bug report that arrived during the batch` | `roles/kanri.md` loop step 4 | 3.2 |
| `a bug-report triage` | `roles/kanri.md` Handover | 3.3 |
| `a triage's observation` | `roles/kanri.md` Shoroku; `templates/roster.md` | 3.4, 7.3 |
| `the intake's filings` | `roles/kanri.md` Shoroku | 3.4 |
| `bug intake's issue filings` | `roles/hosa.md` | 4.1 |
| `Kanri's filings` in the Hosa row | `SKILL.md` roles table | 2.1 (kept as `Kanri's filings` after `the bug intake`; the sweep counts the row's new text) |
| `Kanri is the intake` | `SKILL.md` Messages | 2.2 |
| `first data row of <workspace>/.tanto/roster.md`, `from the first data row of that repository's` | `SKILL.md`; `roles/kanri.md`; `roles/kaiseki.md`; `templates/bug-report.md` | 2.2, 3.6, 5, 7.1 |
| `its body names where the report came from` | `roles/kanri.md` hotfix lane | 3.6 |
| `Every receipt and every send is one line in the roster's Events` | `roles/kanri.md` | 3.6 |
| `a bug report received, or sent to`, `a bug report triaged and its outcome` | `templates/roster.md`; `templates/kanri.md` | 7.3, 7.4 |
| `in three groups`, `three groups`, `the four headings`, `four `##` headings`, `grep -c '^## '` on the brief is `4`` | `SKILL.md`; `roles/kanri.md`; `roles/hosa.md`; `skills/shoroku/SKILL.md`; `templates/shoroku-brief.md` | 2.4, 2.5, 3.4, 4.2, 6.2, 7.2 |
| `[adopt \| reject \| unsure]` | `templates/shoroku-brief.md` | 7.2 |
| `is grouped `Recommended reject`, with the correction` (R-6's interim form) | `skills/shoroku/SKILL.md`; `roles/kanri.md` step 2 | 6.2, 3.4 |
| `Repository — <path or name>`, `## Reporter`, `absolute path of the reporter's repository`, `The intake Kanri copies it` | `templates/bug-report.md` | 7.1 |
| `Kanri fills it in the inbox copy` | `templates/bug-report.md` | 7.1 |
| `a Kanri in another repository is where` | kept — `roles/kanri.md` 3.6 keeps the sentence | — |
| `hotfix, or relay` as the Outcome list | `templates/bug-report.md` | 7.1 |
| `triages it into an issue` | `README.md` | 8.5 |
| `marked adopt, reject, or unsure` | `skills/shoroku/README.md` | 6.5 |

## Requirements

Recorded at this topic's close as `S-n` rows pointing here. Five bullets,
three of req-04f5 and two of req-3c4d.

1. **req-04f5, the "Trouble reports" bullet, rewritten.** What a human
   notices while using a skill, and what another repository's run suspects
   is a defect in a skill this repository ships, has one intake: the
   cheapest seat that is live, which answers receipt in one line and reads
   nothing of the report. No report is lost and none is decided on arrival:
   every report is decided at the next topic's close, by the same
   recommendation the human checks by exception, into an issue, a fix
   applied, a redirect, a root-cause pass, an input to a spec, or a
   dismissal. Two workspaces running this skill report to each other through
   the skill itself: a reporter that knows the target workspace's path finds
   the intake's address in that workspace, and asks the human only when that
   address is stale.
2. **req-04f5, new: nothing tracked names another repository.** A report
   from another workspace carries nothing that identifies it — no name,
   path, session, or topic, no quotation of its documents — and a tracked
   file or commit written from a report names it by the receiving inbox's
   dated slug alone, so that what this repository commits says nothing about
   the repositories that use its skills.
3. **req-3c4d, new: every issue opens with its provenance.** An issue's body
   opens with one fixed line naming where the issue came from by pointer — a
   ledger row, an inbox copy, a hotfix commit, or a session date — from a
   closed set of kinds, checked by the repository's own hook and never a
   classification.
4. **req-04f5, new: a one-sentence repair is applied, not filed.** A gap or
   drift in a skill's own prose whose whole repair is a sentence and needs no
   decision is applied to the text at the close, in a commit of its own the
   human approved by exception, instead of opening an issue that a later
   plan must pick up.
5. **req-3c4d, the file-answering caller's bullet, amended.** The
   recommendation's items are marked adopt, fix, reject, or unsure — fix for
   a sentence the apply can put into a file the caller names — and the apply
   makes the docs commit and, for the fixes, one more.

## The ADRs

Each decided here, with the alternative it rejects and, where an accepted
record says otherwise, the record it amends — so that the close's recommender
writes the `amends:` links `docs/decisions/AGENTS.md` asks for; recorded as
`S-n` rows pointing at this section.

1. **A bug report is held untracked and decided at a close; the intake is
   the cheapest live seat, and its act reads nothing** (the decision file
   §1-2, its Q1 = (a); the answers file §4). Rejected: a one-line forward to
   Kanri while a Sekkei is live (wakes the conductor for every report during
   a spec, which is most of the time); the five-way triage on arrival with
   Hosa as executor (the status quo, which does not reduce Kanri's
   wake-ups); an idle-time sweep at any stage but the close (moot under
   decision-ce83's one check per topic). Amends decision-2f36 (the hotfix
   lane): the lane is opened by the human's word alone, never by a report's
   triage, and its commit body names no report's origin.
2. **The template drops every identifying field at the source, and the
   tracked-write rule stands second** (the decision file §5, Q3 = (1)).
   Rejected: the repository name kept in the file with the rule alone
   (leans on the apply subagent's compliance); a Sensitivity line the
   sender sets (machinery none of sixty reports needed). Amends
   decision-7e21 only in the list of what `.tanto/` holds — `sent/` joins
   `inbox/`.
3. **Provenance is one fixed body line with a closed set of four kinds and
   a pointer, checked by the frontmatter hook; no tag, no field, no
   classification** (the source-line file §1-3, §6). Rejected: a
   frontmatter `source:` field (invites the next field — a topic, a theme —
   which the tag rejection stands against; the fallback if the body check
   proved awkward, and it did not); a free sentence (not greppable; the 234
   on disk show what free prose does); the consistency note as the check's
   site (a check run by hand is where drift comes from).
4. **The retrofit writes what git and the inbox copies record and `session
   <created>` otherwise; the check binds `open/` and `deferred/`, and
   `resolved/` is left alone** (Q1 = (a) with the answers file's refinements;
   Q3 = (a)). Rejected: `session <created>` for everything but inbox and
   hotfix (loses 102 topics for nothing); a subagent reading ledgers against
   issues to recover `S-n` (the source-line file §6); a whole-tree check with
   a 305-file retrofit (a rule with no exception, bought with 71 restamps of
   near-frozen files the docs rules exclude from new reading).
5. **A `Recommended fix` group with a commit of its own, and `fix` as the
   sixth triage outcome shared with the hotfix lane** (the answers file §2
   policy 1; D-1, D-2). Rejected: `fix` as a destination word inside
   `Recommended adopt` (hides a change to the skill's behaviour behind the
   adopt count, where the human reads by exception); an issue per sentence
   (the answers file §0: most of the 105 "never states" items would have
   been sentences applied); a separate outcome word for the lane (two words
   for one act, a sentence applied on the human's word). Amends
   decision-ce83: the apply makes two commits at a close, the second for the
   fixes, and the whole-branch review's exclusion names both prefixes.
6. **The sender's copy is dated under `.tanto/sent/` and kept; no deletion
   rule** (Q2 = (a)). Rejected: a flat undated file deleted on `received:`
   (the sender then holds no record of what it reported, and the rule
   depends on a reply arriving); a dated file deleted on `received:` (the
   same, one directory later). Consistent with decision-7e21's "disk is the
   only cost".

## What the plan must contain

- Every old text re-quoted from the tree at drafting time and every new
  text as this spec gives it; a section replaced whole (3.6, 7.1) quoted
  from heading to heading, or as a `W` block for the template.
- The Global Constraints paragraph of section 9: this plan runs on the
  intake as it stands, the safe boundary is the final one, and the
  sender-side passages land in the final batch.
- The retrofit task (8.2) before the hook task (8.1), the fenced one-off
  script, its Done when, and the count of kinds for the dogfood report; the
  test file of 8.1 and its run command.
- The four brief-form sites (Measured 5) in one batch.
- The final sweep over "Old values this plan contradicts", and the
  consistency note's edits (8.3) in the same batch.
- issue-c3a9's narrowing (8.4) as a task, with its `updated:` restamp.
- The dogfood report's Measurements: the inbox's untriaged count before and
  after the first close under the new text, and how many of its items went
  `fix`.

## Verification

- `grep -c 'triage:' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md skills/tanto/templates/bug-report.md` — `0` on each; `grep -cF 'received: <inbox path>' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md` — `1` on each.
- `grep -cF 'sweep: inbox — recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md` — `1` on each.
- `grep -c '^## ' skills/tanto/templates/shoroku-brief.md` — `5`; `grep -c '^## Recommended fix$' skills/tanto/templates/shoroku-brief.md skills/shoroku/SKILL.md` — `1` and at least `1`; `grep -cF "is \`5\`" skills/tanto/roles/kanri.md` — `1`; `grep -cF 'three groups' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md skills/shoroku/SKILL.md` — `0` on each.
- `grep -cF 'fix: text corrections from <topic>' skills/tanto/SKILL.md skills/tanto/roles/kanri.md` — at least `1` on each.
- `grep -c '^## Reported$' skills/tanto/templates/bug-report.md` and `grep -c '^## Received$'` — `1` each; `grep -c 'Repository —'` — `0`; `grep -c '^## Reporter$'` — `0`.
- `grep -cF 'Source: shoroku <topic> S-<n>' skills/tanto/roles/kanri.md skills/shoroku/SKILL.md` — at least `1` on each; `grep -cF 'Source: session <YYYY-MM-DD>' skills/shoroku/SKILL.md skills/tanto/roles/kaiseki.md` — `1` on each.
- `grep -cF '`sent`' skills/tanto/SKILL.md` — at least `1`; `grep -cF 'sent/' skills/tanto/roles/kanri.md` — at least `2` (Start step 2 and Reporting from the other side).
- `grep -L '^Source: ' docs/issues/open/*.md docs/issues/deferred/*.md` — prints nothing; `grep -l '^Source: ' docs/issues/resolved/*.md | wc -l` — `0`.
- `grep -c '^Source: inbox ' docs/issues/open/*.md docs/issues/deferred/*.md | grep -vc ':0$'` — `22`, or the count the retrofit's log records with the reason for any difference.
- `uv run --no-project --with pyyaml python -m unittest discover -s scripts -p 'test_check_md_frontmatter.py'` — passes; `uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py docs/issues/open/*.md docs/issues/deferred/*.md` — exit `0`; the same on a scratch file under a path containing `docs/issues/open/` whose first body line is narrative — exit `1` with the hint.
- `./scripts/lint.sh` (or `.bat`) on every changed path — clean.
- The consistency note's edited checks re-run with their expected counts, recorded in the dogfood report.
- The first close under the new text: the recommendation carries every untriaged inbox copy as an item, the brief has five `##` headings, the apply's Triage fills leave `grep -L 'Outcome — \(issue\|fix\|redirect\|kaiseki\|relay\|dismissed\)' .tanto/inbox/*.md` printing only copies the human sent to Unsure, and the fix commit exists iff the direction accepted a `fix`. Recorded in that plan's dogfood report.

## Out of scope

- The `docs/issues/AGENTS.md` sentence and kisou's issue template
  (`experience-layer`, fixed input 9).
- Renumbering the batch loop's steps after step 4 shrinks (`tanto-diet`,
  D-7), and the Bug intake section's size as a diet input (the ledger's
  S-4).
- A pre-commit check rejecting a user-home path in a tracked file (dotrepo,
  the ledger's S-3).
- A reply to the sender beyond `received:` — the outcome stays in the
  receiving repository's inbox copy.
- Any change to `docs/design/4807-tanto.md` before the close.
- The consistency script of the answers file §2 policy 3
  (`passage-check-hardening`).

## Issues this design closes

- issue-a79c — the intake's decision point ("is a Hosa live" before "is a
  batch in flight") no longer exists: the intake writes nothing tracked, and
  the hotfix lane is the human's word in a slot.
- issue-d45c — the sender's copy has a dated place and a stated retention
  (1.2, fixed input 12).
- issue-59c9 — the reserved names of `.tanto/` are one list checked by name
  (1.5, 2.6, 3.1).
- issue-9d17 — verify at T2: Kanri's Start step 2 already lists the root at
  every start and close against the same names and names a closed topic's
  directory as a leftover under the retention rule; 3.1 points it at the one
  list.

issue-c3a9 is narrowed, not closed (8.4).

## Answers to the spec inputs

- **I-1** — Hosa's reading of section 4 (`.tanto/bug-report-hold/spec-inputs.md`):
  4.1, 4.2, and 4.3 touch the obligations Hosa named and no other; its flag
  — that "Not yours" speaks of `S-n` rows and the sweep has no ledger — is
  taken as 4.4, one passage distinguishing an inbox copy from a `pending`
  row.

## Deferred items

1. **The `S-n` on retrofitted `shoroku` lines.** The 102 write-outs carry
   the topic and not the row; a later pass could match issue titles against
   the closed ledgers' Item columns where the ledger survives under
   `.tanto/`, and write the row. Left because the ledgers are untracked and
   local, and the pointer to the ledger file is already true.
2. **A sender learning the outcome.** Under this design the reporter hears
   `received:` and nothing more; the outcome lives in the receiving
   repository's untracked inbox copy. If a run wants it, the close could
   send one line per `relay` or `issue` to the Send to name — but that name
   is a session that may have been cleared since, and the human's word is
   the surer channel. Revisit when a second repository runs closes of its
   own.
3. **The fix commit's review.** A `fix` item lands on the topic branch after
   the whole-branch review, unreviewed by a subagent; Kanri's diff
   verification and the human's brief line are its checks. If a fix ever
   breaks a pinned string, the consistency script (policy 3) is where the
   catch belongs.
4. **An inbox copy's `Old:`/`New:` shape in the report.** The Proposed fix
   section invites the sentence but does not fix its shape; the recommender
   writes the `Old:`/`New:` fences itself. A template shape could follow if
   the recommender's readings prove uneven.

## Shoroku proposal from this spec work

Recorded at the spec's acceptance as one `pending` row pointing at this
heading. The items are the delta beyond the requirements, the ADRs, and the
deferred items above — what this dialogue and this reading found that no
file holds:

1. **The start sequence's "content differs" test is byte-level, and the
   template is CRLF while the written definitions are LF** (measured at this
   session's start: all thirteen `~/.claude/agents/tanto-*.md` differed from
   the rendered template only in line endings). A session that took the test
   literally would rewrite thirteen files at every start; this one compared
   after normalizing and wrote nothing. Destination: an issue, low, against
   `SKILL.md`'s Start sequence — the comparison normalizes line endings, or
   the template is committed LF.
2. **A discarded Sekkei's `dialogue.md` was the successor's recovery point**:
   the first Sekkei's measurements and its one question were read, not
   re-measured, and the question was answered by a Kikaku file before the
   successor started. Destination: a fact under the seat-lineage design's
   section on what a seat leaves on disk — a dialogue file outlives its seat
   and is worth writing even when the seat is discarded.
3. **The inbox's Reference lines took at least four shapes under the
   interim ruling** (Measured 1) because the ruling fixed the outcome word
   and not the line; the retrofit reads only the `issue-<id>` token. The new
   template fixes the shape by listing the five references (7.1).
   Destination: a sentence in the design's Bug intake section, so that the
   next interim ruling fixes a form.
4. **The skill's linked tree is read by other repositories' senders
   mid-plan** (section 9): rule 11 speaks of this repository's own sessions,
   and the sender side of a route is the case it does not cover. Destination:
   a sentence under rule 11 in design-4807, or an issue if the recommender
   prefers a tracked gap.
5. **The route's readers were counted at design time**: the Bug intake
   section, 116 lines, becomes about 60 under 3.6, and the five `triage:`
   forms leave two files and the consistency note. Destination: the
   `tanto-diet` input row the ledger's S-4 already holds, with the figure.
