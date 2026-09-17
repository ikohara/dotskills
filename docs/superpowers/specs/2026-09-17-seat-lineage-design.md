# Design: seat-lineage — one write-out per plan for every seat, one fresh Jisso per batch from a queue, and windows that are cleared, never closed

Written 2026-09-17 by Sekkei `dotskills-8d [0580f5]` — the opus/max trial of
`.tanto/kikaku/2026-09-17-sekkei-opus-max-trial.md` — as a draft at
`.tanto/seat-lineage/spec-draft.md`, because `shoroku-at-close` holds the
shared checkout (this topic's ledger, R-2). The Keikaku created once the
checkout is free commits this text unchanged at
`docs/superpowers/specs/2026-09-17-seat-lineage-design.md` and cuts the
branch `seat-lineage` from `main` before that commit. Nothing here is edited
or committed before then.

The topic is fifth in the order `.tanto/kikaku/2026-09-16-seat-lineage.md`
section 5 holds — after `shoroku-at-close`, before `bug-report-hold`. Its
inputs are three files, and this spec cites them by these names:

- **the decision file** — `.tanto/kikaku/2026-09-16-seat-lineage.md`, the
  primary T0 input: the rolling proposal, the Jisso queue, the four step
  names, the shelved Kanri standby, and section 6's scope;
- **the closing-line file** — `.tanto/kikaku/2026-09-17-deletable-closing-line.md`
  §1-2, the second T0 input: a seat's turn-ending text and Kanri's lines
  about a seat;
- **I-1** — `.tanto/kikaku/2026-09-17-clear-based-lifecycle.md`, relayed
  through `.tanto/seat-lineage/spec-inputs.md` during the dialogue: windows
  are `/clear`ed and reused, a `release:` line ends every exit, a `no-role` line on
  every tanto line, Kanri sends only to `live` rows.

T0 landed on `main` as `docs: T0 shoroku for seat-lineage`: three requirement
bullets in req-04f5, issue-f293 (the ungoverned turn-ending text, three
sites), deferred issue-eb47 (the Kanri standby), and a dated amendment to
issue-0239 (the exit-file collision). The dialogue is
`.tanto/seat-lineage/dialogue.md`; this spec cites its questions as Q1 to
Q3 and its design sections as D1 to D6.

The design in one paragraph: **a seat's items are written out once per
plan, at the close, whatever seat raised them and however many sessions
carried that seat** — the `pending` rows of the ledger are the lineage, and
no file rolls. A retiring Jisso's proposal is the Shoroku proposal section of
the batch report it writes anyway; Kanri's own proposal is written at every
plan close before the close's recommender runs, so the close's one check
covers Kanri too, and the between-plans write-out `shoroku-at-close` built
for Kanri goes. **Jisso is one fresh session per batch**, from a queue the
human fills at the plan's landing — N windows, N the plan's batches plus one
for the fix wave — each answered `queued: <n>` and given nothing to read until
its batch prompt, which is its orders; a Jisso retires at the boundary Kanri
accepts, and is released there. **Windows are `/clear`ed and reused, never
closed**: every exit ends with Kanri's `release: /clear this window`, sent
right after the proposal's form check; every tanto line carries the `no-role`
line as its second line, which a bare window answers `no-role`; Kanri sends
only to `live` roster rows; and the roster's "same name, new transcript" rule for Kikaku and Hosa
becomes every role's. **Every seat's turn ends with two facts** — where its
work is, and which contract step still needs it, or none.

Every change below is a passage: an old text the plan quotes exactly and a
new text that replaces it, an insertion anchored on a quoted line, or a
section replaced whole between two headings. Old and new texts sit in fenced
`text` blocks. **The old texts are the post-merge tree's** (R-2): where
`shoroku-at-close`'s plan rewrites a site this spec touches, the old text is
quoted from that plan's `→` block, and section 9 lists every such site so
that the plan's author re-quotes it from the merged tree; where it does
not, the old text is quoted from the working tree as this spec read it. A
section replaced whole is quoted by the plan from heading to heading, and
this spec gives only the new text.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them
whole. Each names the file section or the dialogue question that settled it
and the requirement bullet of req-04f5 it serves, or says that none does.

1. **The close is every seat's one write-out, and rows carry the lineage**
   (the decision file, section 1; Q1 = (b), Q2 = (A)). No proposal file rolls
   across sessions and none is renamed; a session's items become `pending`
   rows of a ledger at the moment its proposal is form-checked, and the
   close's recommender quotes them from their sources. Serves "A seat's
   replacement never waits on a document review" and "One human check per
   plan, not one per seat change" (S-1).
2. **A retiring Jisso's proposal is its batch report's Shoroku proposal
   section** (Q1 = (b)). No `exit-jisso-<X>` file, no `exit:` line to Jisso,
   no append to `shoroku-proposal.md` at a boundary; `shoroku-proposal.md` is
   written once, at T2, by the plan's last live Jisso, exactly as
   `shoroku-at-close` has it. Serves the same two bullets, and "The human is
   interrupted only at defined checkpoints".
3. **Kanri's proposal is written at every plan close, before the recommender**
   (Q2 = (A)); between plans its rows go to the roster's table and move into
   the next ledger. The between-plans recommend/check/apply lane for Kanri —
   `exit-kanri-<date>-<name>-recommendation.md`, `-brief.md`,
   `-direction.md`, the subject `docs: exit shoroku for kanri`, the `close:`
   line with `kanri` for the topic — is removed. Serves S-1.
4. **One fresh Jisso per batch, fixed rotation, from a queue filled at the
   landing** (the decision file, section 2; D2). N = the rows of the plan's
   Batches table + 1; every handshake is answered `queued: <n>`; a queued
   Jisso reads nothing until its batch prompt; the first runs the pre-flight
   scan, the others resume `progress.md`; rework stays with the same Jisso;
   the rotation is at the boundary Kanri accepts. Serves "The sessions a plan
   needs are opened while the human is present" (S-2) and "A run is
   affordable to keep running".
5. **A waiting seat holds the minimum context** (the decision file, section
   2, the human's own reason). A queued Jisso gets no `kanri-address:`
   broadcast and no other line — Kanri sends only to `live` rows (I-1 §4) —
   and its batch prompt names the Kanri that sends it. Serves "A run is
   affordable to keep running".
6. **A Jisso gone mid-batch is resumed by the next queued Jisso** (Q3 = (i)),
   after Kanri verifies the tree; the shortfall is a re-queue request at the
   next boundary. Serves "A run is affordable to keep running" — the run does
   not stall on the human's absence.
7. **The four steps are Propose, Recommend, Check, Apply; a seat's section is
   "Shoroku proposal"; the two bookkeeping tables are "Shoroku proposal
   items"** (the decision file, section 3; Q1's rider; D1). The `tanto.json`
   keys stay `shoroku.recommend` and `shoroku.apply`. Serves no bullet
   directly; it keeps the vocabulary one.
8. **Windows are `/clear`ed and reused; every exit ends with `release:`; the
   `no-role` line is the second line of every tanto line; Kanri sends only to `live`
   rows; the handshake rule generalizes; `dead` stays** (I-1 §1-8; D4).
   `release:` follows the form check directly, at every seat: the question-back
   I-1 §2 kept it behind was removed by `shoroku-at-close` (that plan's O2.5),
   so there is no recommender to wait for at an exit. Serves "A session
   resumed under a new name rejoins the run as easily as possible", "The
   sessions a plan needs are opened while the human is present", and the
   human's observation that repeated tab open/close slows the editor.
9. **A seat's turn-ending text is two facts and a negative rule** (the
   closing-line file §1; D5): where its work is, and the contract step that
   still needs the seat or `none`; never a step it is not needed for. Kanri's
   "released" line carries the second fact, and a Kanri line that speaks of a
   release and a creation keeps them in two clauses with their own times
   (§2). The wording is this spec's; the two parts and the negative rule are
   the fixed content. Serves "A seat's last words say whether the seat can be
   released" (S-3).
10. **Rule 9 does not pause an opus Sekkei for a Kaiseki** (the trial
    decision's side effect) — not this spec's to write; noted so the plan does
    not.
11. **The Kanri standby stays shelved** (the decision file, section 4;
    issue-eb47). Out of scope, with its revisit trigger where T0 put it.

## Measured while designing

Read before any wording was fixed; each is a fact this spec's text rests
on, and each is the plan's to record where "Where each change lives" says.

1. **The in-plan Kanri handover already has no check in its path.** The
   landed `shoroku-at-close` text (`SKILL.md` "Session exit"; `roles/kanri.md`
   "Handover" step 1) has a Kanri that hands over while a ledger is open
   write its proposal, record `pending` rows, and hand over; the recommender
   and the check are at the close. The decision file's measured wait — the
   exit shoroku's check, 4 to 128 minutes — was on the path only before that
   plan. What remained were the plan close and the between-plans exit, where
   that text runs a Kanri-only recommend/check/apply: two human checks per
   close. Fixed input 3 is what removes the second.
2. **The question-back is gone.** `shoroku-at-close` removed "could not be
   read as written" and "question back to the session" (its O2.5, and its
   Task 10 sweep needles). I-1 §2's "dispatch the recommender, then
   `release:`" was reasoned on the earlier flow; under the landed one nothing
   runs between a proposal's form check and the seat's release.
3. **`/clear` keeps the name and the `[ref]`, keeps the model, and resets the
   effort.** The hosa window `dotskills-1b [d12315]` was `/clear`ed on
   2026-09-16 16:22Z (transcripts `6883a717…` before, `c360a34a…` after, under
   the config directory's `projects/` for this repository): the roster's
   three post-clear rows carry the same `name [ref]`; the first assistant
   record after the clear runs `claude-sonnet-5`, as the last before it did;
   the last turn before the clear ran at effort `xhigh` and the first after it
   at `medium`, with no human command between the clear and that turn. The
   permission mode is not readable from a transcript; the three post-clear
   handshakes reported `mode=auto`, which is consistent with it being kept
   and is not a measurement of it.
4. **A tanto line sent to a cleared window's name after the clear is
   delivered into the bare conversation.** At 16:39Z the same day, Kanri
   `dotskills-1e`'s `kanri-address:` broadcast reached the bare hosa window
   (`c360a34a…` records 8-10: enqueued and dequeued under the new session
   id); the window answered the human in its own window, replied nothing to
   the sender, and did nothing else. A line enqueued **before** a clear has
   not been observed: every enqueue in the transcripts read is dequeued in
   the same millisecond, the receiver being idle, so the busy-turn case has
   not occurred. The `no-role` line (fixed input 8) covers both.
5. **Agent definitions after a `/clear`.** The post-clear start line reported
   `agents: 12 current, 0 written, 0 not visible to this session`. No window
   has yet had a definition written between its start and its clear, so
   "re-scanned at `/clear`" is consistent with the data and not proven;
   section 10's fresh-start check is where it is measured.
6. **The rename's size.** `candidate` occurs 53 times across
   `skills/tanto/SKILL.md`, the role files, and the templates, plus four
   headings `## Shoroku candidates` (`templates/batch-report.md`,
   `templates/kaiseki-report.md`, `templates/kanri.md`, `templates/roster.md`)
   and one spec section name (`Shoroku candidates from this spec work`,
   named in `SKILL.md`, `roles/kanri.md`, and `roles/sekkei.md`), and
   `docs/notes/tanto-consistency-checks.md` pins the roster heading and the
   two tables' header rows by grep. Two occurrences in `skills/shoroku/SKILL.md`
   are that skill's own vocabulary and are not touched.

## 1. The principle, and what each moment does

The `shoroku-at-close` principle stands: the human's check happens once per
topic, at its close; every other moment produces proposal items and nothing
else. This spec extends it to the two seats that outlive a session — Kanri
and Jisso — and adds the lifecycle that lets a window be reused.

| Moment | Who proposes, and where | Kanri does | The seat's window then says |
| --- | --- | --- | --- |
| a batch accepted | the retiring Jisso, in its report's **Shoroku proposal** section — the items this batch raised that no file holds | verifies the tree, reads the report by sections, records the section's items as `pending` rows, sends the next prompt to the next queued Jisso, sends the retiring one `release:` | `none — /clear this window` |
| a Jisso queued | nothing | answers `queued: <n>`, writes a `queued` row | work: none yet; still needs this seat: its batch prompt |
| a spec accepted, a plan's cold read answered | Sekkei's `exit-sekkei-proposal.md`, Keikaku's `exit-keikaku-proposal.md`, unasked, named in the report line | form check, rows, `release:` | `none — /clear this window` |
| a Kaiseki case closed | `exit-kaiseki-<n>-proposal.md`, on the `exit:` line | form check, rows, `release:` | the same |
| a Kanri handover with a ledger open | `.tanto/exit-kanri-<date>-<name>-proposal.md` | rows in the ledger of the topic whose batches are in flight, else the oldest open; the handover file; its own `/clear` prompt | "Kanri hands over — … — handover written", then `/clear this window and run /tanto kanri here or in any free window` |
| a Kanri handover between plans | the same file | rows in the roster's Shoroku proposal items table, moved into the next ledger when a topic opens | the same |
| the plan close | T2: the last live Jisso's `shoroku-proposal.md`, then Kanri's own `exit-kanri-<date>-<name>-proposal.md`, both before the recommender | the one recommend over every source the `pending` rows name, the one check, the one apply on the branch, the merge decision, the archive, the handover | Jisso: `none — /clear this window`; Kanri as above |

Three rules hold across the table:

- **Kanri sends only to `live` roster rows.** A `queued` Jisso learns Kanri's
  name from its batch prompt; a `cleared` window is nobody's; `ListAgents`
  confirms a name is listed and is not the address book.
- **Every tanto line carries the `no-role` line as its second line**, in both
  directions, and a bare window answers it `no-role`. `no-role` is the signal
  that a window was cleared under a role; a send error stays the signal that a
  session is gone.
- **A seat's turn ends with its closing line**: where its work is, and which
  contract step still needs it, or `none`. Never a step it is not needed for.

## 2. `skills/tanto/SKILL.md`

Seven sites, in file order. "Session exit" is replaced whole (2.5).

### 2.1 The roles table

Kanri's row:

```text
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake, lifecycle requests | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
```

→

```text
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake, the create requests and the `release:` lines | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
```

Jisso's row:

```text
| Jisso (実装) | 0 or 1 | the SDD run, batch reports, commits, the T2 shoroku proposal | Kanri; the human by grant |
```

→

```text
| Jisso (実装) | 1 live per topic, the plan's others queued | one batch of the SDD run each, its batch report and its commits; the last one, the T2 shoroku proposal | Kanri; the human by grant |
```

### 2.2 "Handshake and roster": Jisso waits for its prompt, and the Status vocabulary

```text
Jisso and Keikaku then **wait** for Kanri's reply. It carries the plan path
and the ledger path Jisso cannot start without, and the topic, the spec path,
and the plan path Keikaku cannot start without. Sekkei, Kikaku, Hosa, and
Kaiseki start reading while they wait — the human is in the room, and the
reply arrives as a `<cross-session-message>`.
```

→

```text
Jisso and Keikaku then **wait** for Kanri's reply. Jisso's is `queued: <n>`,
its place in the plan's queue, and Jisso then waits for its batch prompt —
the prompt is its orders, and carries the plan path, the ledger path, and the
branch — reading nothing until it arrives. Keikaku's carries the topic, the
spec path, and the plan path it cannot start without. Sekkei, Kikaku, Hosa,
and Kaiseki start reading while they wait — the human is in the room, and
the reply arrives as a `<cross-session-message>`.
```

```text
Transcript. Topic is the topic word Kanri's orders line gave that session, or
`—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Status is `live`,
`dead`, `replaced`, `refused`, or `cleared`, the last for a Kikaku or Hosa
row that a re-handshake after a `/clear` has replaced. The keeping rule is
one live session per role and topic; Kanri, Kikaku, and Hosa one each.
```

→

```text
Transcript. Topic is the topic word Kanri's orders line gave that session —
for a Jisso, the topic whose queue its handshake joined: the plan whose
batches are in flight, or, with none in flight, the plan whose landing
requested the queue, since the shared checkout carries one topic's batches
at a time and the next plan's queue opens at its predecessor's close — or
`—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Status is `queued`, `live`,
`cleared`, `replaced`, `dead`, or `refused`: `queued` a Jisso waiting for its
batch prompt; `cleared` a window Kanri released with `release:`, or whose
`/clear` a re-handshake under a new transcript or a `no-role` reply
revealed; `replaced` a Kanri that handed over; `dead` a session `ListAgents`
no longer lists — a closed tab, a crash, a restart before `/tanto fukki`;
`refused` a handshake that got no row. The keeping rule is one live session
per role and topic, the plan's other Jissos `queued`; Kanri, Kikaku, and
Hosa one each.
```

The Handshake section's sentence "A Sekkei, Keikaku, or Jisso started with no
address on the command line reads the first data row of `.tanto/roster.md`"
is unchanged; so is the handshake line itself.

### 2.3 "The address": `live` rows only, and the `[ref]` across a clear

Insert after the bullet that begins `- **Every other role's address** is
known only to Kanri` (its last line is `all.`):

```text
- **Kanri sends only to the names of `live` roster rows** — never to a
  `queued` Jisso, which learns Kanri's name from the batch prompt that makes
  it live, and never to a `cleared` one, which is a bare window. The roster
  is the address book; `ListAgents` confirms that a name is listed and
  nothing more. A window keeps its name and `[ref]` across a `/clear`
  (measured 2026-09-16), so a listed name is no evidence that a role is
  behind it.
```

### 2.4 "Messages": the `no-role` line, `release:`, and the closing line

Insert after the bullet that says a reply copies the incoming message's
`from` into `to`:

````text
- **Every tanto line carries the `no-role` line as its second line** — the
  lines this file names and the ones the role files name, in both
  directions, the handshake, the bug-report route and its `triage:` answer
  included:

  ```text
  <the tanto line>
  (tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
  ```

  A role skips the second line. A bare window — one the human `/clear`ed
  and has not yet given a role — finds in it the whole of what is asked of
  it, so "act on the teammate's request" and "do nothing" coincide. In a
  message longer than one line the `no-role` line follows the first: a
  batch prompt, whose text is what `templates/batch-prompt.md` renders,
  carries it after its title line, and the file carries it there too, so
  that a pasted file and a sent message are the same bytes; a `close:` line
  with its clauses, or a handshake with its fields, is one line. A file a
  line points at — a report, a brief, a bug report — is not a message and
  carries no such line. The
  `no-role` reply is the one word, carries no second line of its own, and
  is the signal that a window was cleared under a role; a send error stays
  the signal that a session is gone. What each side does on `no-role`: Kanri marks the
  sender's row `cleared`, writes the Events line an unrun exit shoroku gets
  — what was lost, as far as it knows — and treats the exit as forced, a
  live Jisso's after verifying the tree; a role that receives `no-role` from
  Kanri's own name is in a handover gap, holds the line it sent, and
  re-sends it when the next `kanri-address:` line arrives — this holds a
  line only for a role with an established roster row to hold one on
  behalf of. A session with no row yet — a queued Jisso's own first
  handshake, landing in the same gap — has no line to hold: it treats the
  `no-role` the way a send error is already treated, re-reads the roster's
  first data row, and re-handshakes there once a `live` Kanri answers it.
- **`release: /clear this window`** is the line that ends every exit, sent by
  Kanri right after the seat's proposal passes its form check, and the last
  line that name is ever sent: the row is `cleared` at that moment. The seat
  tells the human, in its own window, to `/clear` it, and ends its turn;
  nothing else is expected of it.
- **A seat's turn ends with its closing line**, in its own window and in the
  chat's language: two facts, and never an opinion. Where its work is — the
  paths its output went to, or the commit subject — and the contract step
  that still needs this seat, named by step and site, or `none`. A seat
  never names a step it is not needed for: the recommender's run, the human's
  check, the apply, and Kanri's verification are not waits of the seat's and
  are never listed. After `release:` the second fact is
  `none — /clear this window`. The form, rendered in the chat's language:

  ```text
  Work: <paths, or the commit subject>. Still needs this seat: <step — its site> | none.
  ```

  Two examples — a Jisso at its boundary, `Work: .tanto/<topic>/batch-B-report.md,
  commits b81f677..dba2562. Still needs this seat: the boundary's verdict —
  roles/jisso.md, "The run".`; the same Jisso after `release:`, `Work: the
  same. Still needs this seat: none — /clear this window.` This shapes the
  text the harness already requires when a turn ends; it opens no channel,
  and "Human access" stands as it is.
````

The bullet saying Kanri sends every line without an idle subscription —
"batch prompts, Kaiseki briefs, and the `exit:` lines alike" — stays: the
`queued:` and `release:` lines are two more of them.

### 2.5 "Session exit", replaced whole

Between `## Session exit` and `## Artifacts`:

```text
## Session exit

A session's items reach `docs/` once, at its topic's **close**, stage word
`t2`, after the final batch. An exit — a seat done with its work, a Kanri
handing over, a Jisso retiring at its boundary — writes those items to a
file and nothing more; nothing is recommended, checked, or applied at an
exit. `R-n` numbers Kanri's rulings and `S-n` the proposal items, both in
the conductor ledger, and every row of a ledger's `S-n` table carries Stage
`t2`, the stage that recommends it.

The close runs four steps — **propose, recommend, check, apply** — and every
other moment runs only the first:

1. **Propose.** The seat that holds the items writes them: a numbered list
   opening with the line that says what the proposal excludes, or, for a
   retiring Jisso, the **Shoroku proposal** section of the batch report it
   writes at that boundary. Only this step needs a resident context. Kanri
   checks the file's form — the exclusion line and the numbered list, or the
   report's section — records each item as a `pending` row of the ledger's
   `S-n` table whose Source names the file and the item, and sends the seat
   `release:`. The spec's four sections — Requirements, The ADRs, Deferred
   items, and Shoroku proposal from this spec work — are recorded the same
   way when the spec is accepted, four rows whose Source names the spec and
   the heading; a review report's and a Kaiseki report's items are recorded
   at the boundary that reads them. Nothing is copied: a row is one line and
   a pointer, and the rows are the lineage — however many sessions carried a
   seat, its items are in one table.
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the T2 proposal and every source the `pending` rows name — the
   spec's sections by heading, each proposal by path, each report by path
   and item — and names the output, `t2-recommendation.md`: every item once,
   quoted in full from its source, in three groups — Recommended adopt,
   Recommended reject, Unsure — each with its destination and its one-line
   reason. The same dispatch names the brief path, `t2-brief.md` beside the
   recommendation, the template `templates/shoroku-brief.md`, and the chat's
   language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
   the recommender once more on a failure and pastes the brief as it stands
   on a second, then gives the human both paths, the three counts, and the
   brief's text verbatim; the human answers by exception, in Kanri's window
   or through a Kikaku decision file whose third section names this
   recommendation and answers it; Kanri writes `t2-direction.md` beside the
   recommendation, item by item, with the `S-n` rows in the conductor
   ledger.
   <!-- markdownlint-enable MD038 -->
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
the human sees the whole recommendation, grouped, once per topic. Proposal
items are what is not yet in any file — a rejected alternative and its
reason, a fact measured, a defect noticed, an observation about the run —
never a restatement of a spec, a plan, a report, or a ledger. Kikaku and
Hosa have no exit shoroku; the human `/clear`s those windows at will. A
standalone Kaiseki has no Kanri, and its role file says how.

**Who proposes when.**

- **Jisso** proposes at every boundary, in its report's Shoroku proposal
  section, and that section is its exit shoroku: one Jisso runs one batch,
  and the boundary Kanri accepts is where it retires. No `exit:` line and no
  exit file go to a Jisso. At the close the plan's last live Jisso writes
  `.tanto/<topic>/shoroku-proposal.md` on Kanri's `T2:` line — the `pending`
  rows by number and what its own context holds that no file does — and is
  released on its form check.
- **Sekkei and Keikaku** write their proposal unasked at their own final
  boundary and name it in the report line — `spec accepted: <spec path>;
  exit proposal: <path> — <reading>` for Sekkei,
  `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`
  for Keikaku. An exit that falls away from that boundary — a compaction in
  the reading, the human not wanting the plan now — takes the `exit:` line
  like a Kaiseki's.
- **Kaiseki**, attached, is sent `exit: propose your shoroku; write it to <path>`
  when its case closes, writes the proposal, runs the resume self-check, and
  answers `exit proposal: <path> — <reading>`.
- **Kanri** writes its own proposal from the ledger and the roster, never
  from recollection, at two kinds of moment. **At every plan close**, after
  Jisso's T2 proposal and before the recommender is dispatched, so that the
  close's one check covers Kanri's items with everything else — whether or
  not the close's handover is then declined; what the close teaches after
  that file is written goes to a second file, `-2-proposal.md`, whose rows
  go to the roster's Shoroku proposal items table. **At a handover** that is
  not a close: while any ledger is open, the items are `pending` rows in the
  ledger of the topic whose batches are in flight, else the oldest open;
  between plans, with no ledger open, they are rows of the roster's table,
  which move into the next topic's ledger when it opens. No Kanri exit runs
  a recommend, a check, or an apply of its own. A topic the human ends
  before its final batch still gets its close, over what is on disk, with
  Kanri writing the T2 proposal in Jisso's absence.

**The files.** A proposal is `exit-<role>[-<suffix>]-proposal.md` in
`.tanto/<topic>/` — no suffix for Sekkei (`exit-sekkei`) and Keikaku
(`exit-keikaku`), the case number for Kaiseki (`exit-kaiseki-1`), and a
second file at the same boundary takes `-2` before `-proposal` — or, for
Kanri, `.tanto/exit-kanri-<YYYY-MM-DD>-<name>[-2]-proposal.md` next to the
roster. A Jisso has no proposal file but the close's
`.tanto/<topic>/shoroku-proposal.md`. The close's three files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the topic
directory; there are no others. The apply subagent's commit subject is
`docs: T2 shoroku for <topic>` — the one fixed prefix, `docs: T2 shoroku`,
that the whole-branch review package excludes.

**The exit itself.** Every line above is sent without an idle
subscription, like every other tanto line. Kanri checks that the proposal
exists and opens with the exclusion line and a numbered list — a direct
read, since the proposal carries no headings for `sections` to select by —
or, for a Jisso, reads the report's Shoroku proposal section with the
report's others; records the rows; and sends the seat
`release: /clear this window`, the row going `cleared` as the line goes out.
The seat's closing line says `none — /clear this window`, and Kanri tells
the human, in its own window, `<role> <name> released — its work is in
<paths>; no step needs it — /clear its window when convenient`. Nothing
waits on the human's `/clear`: the roster no longer addresses that name,
and the next `/tanto <role>` typed in that window handshakes as a new
session under the same name, which the roster's clear rule expects. A seat
that has stopped answering is past answering, and Kanri learns it the way it
learns of a missing batch report — the human says the window is gone, a
send errors, a `no-role` comes back, or Kanri's window wakes for another
reason and the answer has not arrived. Kanri then treats the exit as forced
— the roster's Events line says the exit shoroku did not run and what was
lost, as far as Kanri knows — marks the row `cleared` or `dead` as the
signal says, and continues.
```

### 2.6 The Artifacts table

Six rows change; the others stay.

```text
| `.tanto/<topic>/batch-<X>-report.md` | Jisso | Kanri | fixed skeleton |
```

→

```text
| `.tanto/<topic>/batch-<X>-report.md` | the Jisso of that batch | Kanri; the close's recommender, its Shoroku proposal section by path and item | fixed skeleton; its Shoroku proposal section is that Jisso's exit shoroku |
```

```text
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri, for its form; the close's recommender, by path | the close's proposal: the `pending` rows by number and what Jisso's own context holds that no file does, written to a file instead of printed |
```

→

```text
| `.tanto/<topic>/shoroku-proposal.md` | the plan's last live Jisso | Kanri, for its form; the close's recommender, by path | the close's proposal: the `pending` rows by number and what that Jisso's own context holds that no file does, written to a file instead of printed |
```

```text
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri, for its form; the close's recommender, by path | the exit shoroku proposal, opening with the line that says what it excludes |
```

→

```text
| `.tanto/<topic>/exit-<role>[-<suffix>][-2]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>[-2]-proposal.md` | the exiting session — Sekkei, Keikaku, an attached Kaiseki; Kanri at every plan close and at every handover; never Jisso, whose proposal is its report's section | Kanri, for its form; the close's recommender, by path | the exit shoroku proposal, opening with the line that says what it excludes; `-2` a second file at the same boundary, never a rewrite of the first |
```

```text
| `.tanto/<topic>/t2-recommendation.md`, or Kanri's between-plans exit at `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every candidate once, quoted in full from the source its `pending` row names, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
```

→

```text
| `.tanto/<topic>/t2-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every proposal item once, quoted in full from the source its `pending` row names, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
```

```text
| `.tanto/<topic>/t2-brief.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` for Kanri's between-plans exit | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

→

```text
| `.tanto/<topic>/t2-brief.md` | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

```text
| `.tanto/<topic>/t2-direction.md`, beside the recommendation, or Kanri's between-plans exit at `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-direction.md` | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
```

→

```text
| `.tanto/<topic>/t2-direction.md`, beside the recommendation | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
```

The `.tanto/roster.md` row's Content column, `one row per role`, becomes
`one row per session that handshook — a plan's queued Jissos included`. The
`.tanto/<topic>/batch-<X>-prompt.md` row's Readers column, `Jisso, human`,
becomes `the Jisso it names, human`.

### 2.7 Rules 4 and 11

```text
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, one
   Jisso, and one Kaiseki per topic. A session is bound to its cwd —
   CLAUDE.md, memory, and permissions all come from it.
```

→

```text
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, and
   one Kaiseki per topic; one **live** Jisso per topic, the plan's other
   Jissos `queued` in the roster until their batch. A session is bound to its
   cwd — CLAUDE.md, memory, and permissions all come from it.
```

Rule 11 gains, after the sentence that ends
`made with the half-edited skill in view.`, this one:

```text
    The plan's Jissos are all started at its landing and rotate one per
    batch, which is neither a replacement nor a creation under this rule —
    every one of them read the skill as it stood before batch A; a re-queue
    request the queue's fallback makes mid-plan is a creation, and waits
    for the boundary like any other.
```

The last sentence of rule 11, `The roles that start the plan — Jisso at the
plan's landing, Keikaku before it, Sekkei before that — read the skill as it
stands then`, is right as it stands: the queued Jissos start at the landing.

Rule 1 (`One boss: only Kanri messages Jisso.`), rule 5, rule 9, and
"Workspace" are unchanged. "Human access" is unchanged: the closing line
opens no channel, and a seat still answers an unprompted human with a
`human-contact:` line.

### 2.8 Five sentences the spec review found

"Invocation", the address argument:

```text
Kanri's lifecycle request. Kanri runs `/tanto kanri` with no address.
```

→

```text
Kanri's create request. Kanri runs `/tanto kanri` with no address.
```

"The expected-model config", the `ceiling` bullet's two ceiling sentences:

```text
- `ceiling` is **effective** in the sense `subagents` is: `scripts/reading.js`
  reads it, and the verdicts `roles/kanri.md` and `roles/jisso.md` act on come
  out of it. `ceiling.kanri` and `ceiling.jisso` are each
```

→

```text
- `ceiling` is **effective** in the sense `subagents` is: `scripts/reading.js`
  reads it, and the verdict `roles/kanri.md` acts on comes out of it — Jisso's
  is measured and kept, and acts on nothing, since one Jisso runs one batch.
  `ceiling.kanri` and `ceiling.jisso` are each
```

```text
  toward the share Kanri reports at the plan close. A `ceiling.<role>` for any
  role but those two is an unknown key: Kanri and Jisso are the only seats the
  ceiling replaces, because they are the two that run a whole plan of batches,
  and every other role measures and sends the five figures and is replaced on
  none of them.
```

→

```text
  toward the share Kanri reports at the plan close. A `ceiling.<role>` for any
  role but those two is an unknown key: Kanri is the one seat the ceiling
  replaces, because it is the one that runs a whole plan of batches; Jisso's
  line is kept for the archive, its rotation being its replacement; and
  every other role measures and sends the five figures and is replaced on
  none of them.
```

"Handshake and roster"'s Topic sentence is in 2.2's second passage, which
starts one line earlier than it did for that reason. "Resuming", the two
bullets:

```text
  with the same `transcript=`. Kanri matches the path, rewrites the row in
  place with the new name and `[ref]` — status `live`, no `dead` row — writes
```

→

```text
  with the same `transcript=`. Kanri matches the path, rewrites the row in
  place with the new name and `[ref]` — its status as it was, a `queued` row
  staying `queued`, no `dead` row — writes
```

```text
  and sends `kanri-address: <name> [<ref>] — resumed; the roster's first row is rewritten`
  to every live peer whose name `ListAgents` still lists. A peer not listed
```

→

```text
  and sends `kanri-address: <name> [<ref>] — resumed; the roster's first row is rewritten`
  to every `live` roster row — never to a `queued` or a `cleared` one, and
  a listed name is no evidence of a role. A peer not listed
```

## 3. `skills/tanto/roles/kanri.md`

Nine sites, in file order. "Shoroku" (3.7) and "Session lifecycle" (3.8) are
replaced whole; section 9 marks the sites `shoroku-at-close`'s plan rewrites
first.

### 3.1 "Start", the Handover case: a successor in the same window

```text
**Handover** — `.tanto/kanri-handover.md` exists. In order: read the
handover and the ledger it names, and `progress.md` if a plan is in flight;
from `ListAgents`, note whether the old Kanri is still listed; rewrite the
roster — your own row first with status `live` and your own transcript path
in its Transcript column, the old Kanri's row `replaced` (or `dead` if it was
not listed), the Residency row reset to your name and today with zero counts
and your own reading, and one Events line "handover
accepted by `<you>` from
`<old>`"; send every live peer, to its bare name from the roster, one line
`kanri-address: <name> [<ref>] — handover accepted; the roster's first row is rewritten`;
delete the handover file, because the Events line is the record and a stale
file must not start a false handover at the next Kanri start; ask the human, as
a numbered list, to delete the old session; continue at the handover's Next
step, which decides whether a plan is in flight.
```

→

```text
**Handover** — `.tanto/kanri-handover.md` exists. In order: read the
handover and the ledger it names, and `progress.md` if a plan is in flight;
note whether the roster's first row carries your own name — the outgoing
Kanri `/clear`ed its window and you started in it, so the name and the
`[ref]` are the same and only the transcript differs — or another's, and,
for another's, whether `ListAgents` still lists it; rewrite the roster —
your own row first with status `live` and your own transcript path in its
Transcript column, the old Kanri's row `replaced` (or `dead` when it is
another name and not listed), the Residency row reset to your name and today
with zero counts and your own reading, and one Events line "handover
accepted by `<you>` from `<old>`", the two names equal in the same-window
case; send every `live` peer, to its bare name from the roster, one line
`kanri-address: <name> [<ref>] — handover accepted; the roster's first row is rewritten`
— in the same-window case too, because a line a peer sent into the gap
between the `/clear` and your start got `no-role` back, and this line is
what tells it to re-send; delete the handover file, because the Events line
is the record and a stale file must not start a false handover at the next
Kanri start; when the old Kanri's name is another's, remind the human in one
line to `/clear` that window when convenient — no deletion is asked;
continue at the handover's Next step, which decides whether a plan is in
flight.
```

The four other cases are unchanged. "Second Kanri" still stops on a listed
name: a listed name may be a bare window, and the human says which.

### 3.2 "On a handshake": `queued: <n>`, the clear rule for every role, and `no-role`

Step 2:

```text
2. Check the roster and the listing — no live roster row for that role and
   topic, and the
   `name [ref]` the handshake carries appears in `ListAgents`.
```

→

```text
2. Check the roster and the listing — no live roster row for that role and
   topic, a Jisso handshake with a live Jisso row being queued rather than
   refused, and the
   `name [ref]` the handshake carries appears in `ListAgents`.
```

Step 4's Jisso bullet:

```text
   - Jisso gets
     `orders: plan=<path> ledger=<path> branch=<b>; read roles/jisso.md in the tanto skill directory`.
```

→

```text
   - Jisso gets `queued: <n>` — its place in the plan's queue, in handshake
     order — and a roster row with status `queued`. Its orders are its batch
     prompt, which the loop sends when its turn comes and which names the
     plan, the ledger, and the branch. A Jisso handshake with no plan landed
     is premature and is refused like any other.
```

The resumed-session paragraph that follows step 4 is unchanged but for its
last two lines:

```text
`resumed: <old name> → <new name>`, and send nothing but your address. Step 2's
one-live-row-per-role check does not refuse it.
```

→

```text
`resumed: <old name> → <new name>`, and send nothing but your address — a
`queued` row keeps its status, and its reply is `queued: <n>` again. Step
2's one-live-row-per-role check does not refuse it.
```

Insert after that paragraph:

```text
A handshake whose name is already on a `live` or `queued` row with a
different transcript is that window `/clear`ed and re-invoked, in any role
— the rule the roster template stated for Kikaku and Hosa, now every
role's. Mark the old row `cleared`: with the Events line an unrun exit
shoroku gets when no `release:` had been sent to it, and, when the old row
was the live Jisso's, after verifying the tree as the Replace table's first
row says, the next queued Jisso then resuming the batch. Write the new row
and answer as for any handshake. Expect nothing about which role a released
window takes next: the same, another, or your own successor.
```

```text
A second handshake for a role and topic that already has a live row, or a
model mismatch, gets **no row**: record it in the roster as `refused` with an
```

→

```text
A second handshake for a role and topic that already has a live row — a
Jisso's excepted, which joins that topic's queue while one Jisso is live —
or a model mismatch, gets **no row**: record it in the roster as `refused` with an
```

```text
Dispatch nothing to a session that has no accepted roster row.
```

→

```text
Send nothing to a name whose roster row is not `live`: a `queued` Jisso
waits for the batch prompt that makes it live, a `cleared` one is a bare
window, and a session with no accepted row is nobody's. A reply of
`no-role` from a name you sent to means that window was `/clear`ed before
your line arrived: mark its row `cleared`, write the Events line an unrun
exit shoroku gets — what was lost, as far as you know — and treat the exit
as forced; when the row was the live Jisso's, verify the tree first as the
Replace table's first row says, and send the next queued Jisso the resume
prompt.
```

### 3.3 "When the plan lands", steps 4 and 5

```text
4. Ask the human to create Jisso, as the Create table below prescribes.
5. On Jisso's handshake, reply with the orders line. Then write batch A's
   prompt from `templates/batch-prompt.md`, with
   `First batch, no previous verdict.` in its previous-batch-verdict section,
   save it as `.tanto/<topic>/batch-A-prompt.md`, and send
   the same text, without an idle subscription.
```

→

```text
4. Ask the human to queue the plan's Jissos, as the Create table below
   prescribes: N windows, N the number of rows in the plan's Batches table
   plus one for the whole-branch review's fix wave, each running
   `/tanto jisso <name>`; the human may open more, and fewer when they will
   be present to re-queue released windows.
5. Answer each handshake `queued: <n>` with a `queued` row. When the first
   is queued, write batch A's prompt from `templates/batch-prompt.md` —
   addressed to that Jisso, `First batch, no previous verdict.` in its
   previous-batch-verdict section, the first-Jisso line in its Setup on
   resume — save it as `.tanto/<topic>/batch-A-prompt.md`, send the same
   text to that name, without an idle subscription, and mark its row
   `live`. The later handshakes arrive while batch A runs and are queued
   the same way; batch A does not wait for them.
```

Step 3's `Shoroku candidates from this spec work` becomes `Shoroku
proposal from this spec work` (fixed input 7; the spec sections of specs
written before this plan lands keep their old heading, and the close's
recommender is told the heading the row names, which is what the row is
for).

### 3.4 "The batch loop", steps 3, 6, 7, and 8

Step 3's section list, `For Kanri, Rulings, Questions for the human, Deviations
from the plan, Shoroku candidates` → `For Kanri, Rulings, Questions for the
human, Deviations from the plan, Shoroku proposal`; and its sentence

```text
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   copy each shoroku candidate into the ledger's `S-n` table with Adopted
   `pending` and Stage `t2` — bookkeeping, not a ruling: nothing is adopted
```

→

```text
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   record each item of the report's Shoroku proposal section in the ledger's
   `S-n` table with Adopted `pending` and Stage `t2` — that section is this
   Jisso's exit shoroku, and this is its form check — bookkeeping, not a
   ruling: nothing is adopted
```

Step 6:

```text
   other live peer's from the reading its last line carried, as Readings
   says — each `context=` figure into that row's Context column. A verdict of `over` on your own ceiling line is
   handover signal 4; a verdict of `over` on Jisso's is a Replace symptom.
   Either one is gated on `--presence`, run on your own transcript at this
   check, and an `absent` verdict defers it rather than firing it. Write the
   Measurements per-boundary entry from the two readings, and a Measurements
   deferrals entry for anything deferred here.
```

→

```text
   other live peer's from the reading its last line carried, as Readings
   says — each `context=` figure into that row's Context column. A verdict
   of `over` on your own ceiling line is handover signal 4, gated on
   `--presence`, run on your own transcript at this check, and an `absent`
   verdict defers it rather than firing it. Jisso's verdict is recorded and
   acts on nothing: the rotation retires every Jisso at its boundary, and
   the figure is what the archive keeps. Write the Measurements per-boundary
   entry from the two readings, and a Measurements deferrals entry for a
   handover deferred here.
```

```text
   successor makes it from the handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired and is not deferred, run "Exit
   shoroku" now: send the `exit:` lines to the sessions whose proposal is not
   already named — a Sekkei or Keikaku at its own final boundary named it in
   its report line and is waiting for nothing — check each proposal's form
   and record its items as `pending` rows. A delete request goes out as soon
   as that session's proposal passes the form check ("Exit shoroku", step
   2); nothing is recommended or applied before the close.
```

→

```text
   successor makes it from the handover's Next step. Then the exits that
   fall at this boundary, per "Exit shoroku": the retiring Jisso's proposal
   is its report's Shoroku proposal section, recorded at step 3, so send it
   `release:` now and mark its row `cleared` — a batch returned for rework
   is not accepted, and its Jisso stays live for the rework prompt, and the
   last implementation batch's Jisso waits for the whole-branch review's
   verdict ("The final batch", step 2); if a
   release or a replace of another live, coherent session is due, or a
   handover trigger has fired and is not deferred, send the `exit:` lines to
   the sessions whose proposal is not already named — a Sekkei or Keikaku at
   its own final boundary named it in its report line and is waiting for
   nothing — check each proposal's form, record its items as `pending`
   rows, and send `release:` as soon as the form check passes. Nothing is
   recommended or applied before the close.
```

The paragraph that follows, on `— /clear <name>'s window` for an idle Kikaku
or Hosa and `— delete <name> after its exit shoroku` for a Kaiseki, becomes:

```text
   Whenever a Kikaku, Hosa, or Kaiseki row is `live` and that session has
   reported to you and gone idle, your next line to the human — this
   boundary's report, a create request, any line — ends with
   `— /clear <name>'s window` for a Kikaku or Hosa, or
   `— <name> is released after its exit shoroku` for a Kaiseki. Write
   `idle since <HH:MM>` in that row's Status, so that the reminder is not
   forgotten across a wake-up.
```

Step 7 (a): `Jisso has already been deleted; it waits for nothing.` → `Jisso
has already been released; it waits for nothing.`

Step 8:

```text
8. Write the next batch prompt from `templates/batch-prompt.md`, carrying the
   rulings the next tasks inherit and, on its Models line, the four kinds
   Jisso dispatches — `task.implement`, `task.review-spec`,
   `task.review-quality`, and `task.escalate` — each with the family
   `tanto.json` gives it and the definition name that family is dispatched
   with, so that the prompt still says them after a compaction. Save it as
   `.tanto/<topic>/batch-<X>-prompt.md` and send the same
   text, without an idle subscription.
```

→

```text
8. Write the next batch prompt from `templates/batch-prompt.md`, addressed
   to the next `queued` Jisso in handshake order — the prompt names it, says
   which of the plan's Jissos it is, and carries the resume line — with the
   rulings the next tasks inherit and, on its Models line, the four kinds
   Jisso dispatches — `task.implement`, `task.review-spec`,
   `task.review-quality`, and `task.escalate` — each with the family
   `tanto.json` gives it and the definition name that family is dispatched
   with, so that the prompt still says them after a compaction. Save it as
   `.tanto/<topic>/batch-<X>-prompt.md`, send the same text to that name,
   without an idle subscription, and mark its row `live`. A batch returned
   for rework goes to the Jisso that ran it, as a prompt for the same batch.
   When the queue is empty, the Create table's Jisso row's request goes out
   instead — one window, queued by the same `/tanto jisso <name>` — and the
   prompt waits for that handshake; the released windows are the ones to
   offer.
```

### 3.5 "The final batch", steps 1 to 3

Step 1:

```text
   ledger's parked and deferred-minor lines, and ask for a **Shoroku
   candidates** section at the end of its report; copy its candidates into the
   `S-n` table with Adopted `pending` and Stage `t2`, as you do a batch
```

→

```text
   ledger's parked and deferred-minor lines, and ask for a **Shoroku
   proposal** section at the end of its report; record its items in the
   `S-n` table with Adopted `pending` and Stage `t2`, as you do a batch
```

Step 2:

```text
2. Turn its findings into one more batch prompt — the final batch — and send it
   to Jisso. A fix-wave list is drafted under the same conditions as a plan:
   run each command it specifies once before dispatching it, and compare its
   output with what the list expects. There is no second fix wave.
```

→

```text
2. Turn its findings into one more batch prompt — the final batch — and send
   it to the next queued Jisso, as any batch. The Jisso that ran the last
   implementation batch is the one exception to loop step 6's release at
   the boundary: its `release:` waits for this review's verdict, and goes
   out when the fix-wave prompt goes to its successor. When the review has
   no findings there is no fix wave: that Jisso stays live and takes step
   3's `T2:` line, and the spare queued window is named in the close's
   released line for the human to `/clear`. A fix-wave list is
   drafted under the same conditions as a plan: run each command it
   specifies once before dispatching it, and compare its output with what
   the list expects. There is no second fix wave.
```

Step 3:

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
   Residual load-bearing findings reach the human in that merge question, and
   so does any hotfix you took on this branch.
```

→

```text
3. When the final batch is accepted, run the close: the four steps of
   "Shoroku" below, whose first step is two proposals. Jisso's first: send
   the live Jisso one line —
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
   — check the proposal's form, record its rows, and send it `release:`.
   Then your own: write `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`
   from the ledger and the roster, as "Exit shoroku" says for your own
   exit, and record its items as `pending` rows of this ledger — at every
   plan close, whether or not you will decline the close's handover, so that
   the close is every seat's write-out, yours included. Then the one
   recommendation over Jisso's proposal and every source the `pending` rows
   name, the human's check on the brief, the direction, and the apply on
   this branch, in that order and with Jisso gone — a live Hosa's three
   steps, by the `close:` line "Delegation to Hosa" gives, or yours. Then
   put the merge decision to the human, once the commit is verified.
   Residual load-bearing findings reach the human in that merge question, and
   so does any hotfix you took on this branch. What you learn after your
   proposal is written — at the check, the merge decision, the archive —
   goes to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-2-proposal.md`, whose
   items are rows of the roster's Shoroku proposal items table and move
   into the next topic's ledger when it opens; a proposal you have recorded
   is never rewritten.
```

### 3.6 "The Kaiseki branch", step 6

```text
   is open, run Kaiseki's exit as "Exit shoroku" below prescribes — its
   proposal, its form check, then the deletion request — or keep it if
   more of the same bug is expected. Not before: a fix that misses goes back to
```

→

```text
   is open, run Kaiseki's exit as "Exit shoroku" below prescribes — its
   proposal, its form check, then `release:` — or keep it if more of the
   same bug is expected. Not before: a fix that misses goes back to
```

### 3.7 "Handover": the handover file, the procedure, and the human's commands

"The trigger" and "Timing" are unchanged: the four signals, the presence
gate, the deferral, and the boundary list are as `shoroku-at-close` leaves
them. Three sites change.

"The handover file":

```text
whose last line you had not answered: the successor sends `kanri-address:` to
all of them, and each answers by re-sending its last unanswered line. A Sekkei
or Keikaku whose last line named an exit proposal is waiting for nothing but
its deletion, and your successor's first act for it is the delete request,
if the proposal's form check is recorded in the ledger and the request was
not sent.
```

→

```text
whose last line you had not answered: the successor sends `kanri-address:` to
all of them — the `live` rows; the `queued` Jissos are listed after them by
name and place and get nothing, since their batch prompt names the Kanri
that sends it — and each answers by re-sending its last unanswered line,
which is also what a peer does with a line that got `no-role` back in the
gap. A Sekkei or Keikaku whose last line named an exit proposal is waiting
for nothing but `release:`, and your successor's first act for it is that
line, if the proposal's form check is recorded in the ledger and the line
was not sent.
```

"The handover, in a plan and between plans", step 1 (the post-merge text,
`shoroku-at-close` P6.3):

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

→

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku". **At a plan
   close** your proposal is already written and its rows were that close's
   ("The final batch", step 3): write nothing here but the `-2-proposal.md`
   of that step for what the close taught you after it, its rows in the
   roster's Shoroku proposal items table, and go to step 2. **At every other
   handover**: write your own proposal from the ledger and the roster rather
   than from recollection, to
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`; what you cannot
   reconstruct goes into the handover file's "Not reconstructed" section.
   Then one of two. **While any ledger is open** — at a batch boundary, or in
   a topic's spec or plan stage — record the proposal's items as `pending`
   rows, Stage `t2`, Source the proposal's path and the item's number, in
   the ledger of the topic whose batches are in flight, else the oldest open
   topic's. At a batch boundary this is loop step 6's proposal and its rows,
   already done when the window reaches this list. **Between plans**, with
   no ledger open, record them as rows of the roster's Shoroku proposal
   items table, Stage `t2`, Source the same; they move into the next topic's
   ledger when it opens and are recommended at that topic's close. Nothing
   is recommended, checked, or applied at any handover.
```

Step 3's `which the delete table's row keys on` → `which the Release table's
row keys on`. Step 4:

```text
4. Print the "Kanri hands over" line with the numbered commands, and stop. Send
   nothing to any peer; answer the human if asked; do nothing else.
```

→

```text
4. Print the "Kanri hands over" line with the numbered commands, and stop
   with your closing line: your work is in the handover file, the roster,
   and the ledger; the step that still needs this seat is none — the human
   `/clear`s this window and runs `/tanto kanri` in it, or in any free
   window. Send nothing to any peer; answer the human if asked; do nothing
   else.
```

"The residency line" is unchanged.

### 3.8 "Shoroku", replaced whole

Between `## Shoroku` and `## Bug intake`:

```text
## Shoroku

One stage per topic, the **close**, stage word `t2`, in four steps —
propose, recommend, check, apply. Every other moment of the run runs the
first step only: a session's exit, a batch boundary, a review, a Kaiseki
report, the spec's acceptance, and the plan's landing each add `pending`
rows to the `S-n` table, and the close recommends and checks the whole
table at once. You rule on no item: you dispatch the recommender, the human
checks by exception, and a subagent applies. The `S-n` table's Adopted
column takes `pending`, `yes`, or `no`.

A `pending` row is one line and a pointer: Source names the file the item
lives in — a report and its item, a proposal and its number, the spec and a
section heading — and Item is the one-line rendering. The close's
recommender follows Source to quote the item in full; nothing is copied
into the ledger, and no session re-quotes another's items. The rows are
the lineage: a seat carried by three sessions has its items in one table,
and the close reads them once.

### The four steps

1. **Propose.** The session that holds the items writes them, and only this
   step needs a resident context. An exit:
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md` for Sekkei, Keikaku,
   and an attached Kaiseki, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`
   for your own. A batch boundary: the Shoroku proposal section of the
   report, which is that Jisso's exit shoroku — one Jisso runs one batch.
   The close: `.tanto/<topic>/shoroku-proposal.md`, written by the last live
   Jisso — the `pending` rows by number and what its own context holds that
   no file does — and then your own proposal, before the recommender. The
   spec's four sections — Requirements, The ADRs, Deferred items, and
   Shoroku proposal from this spec work — are four rows whose Source is the
   spec and the heading, recorded when the spec is accepted. A review
   report's and a Kaiseki report's items are rows recorded at the boundary
   that reads the report. Check every proposal's form as "Exit shoroku" step
   2 says; record its rows; then `release:`.
2. **Recommend.** At the close, dispatch `subagent_type: tanto-shoroku-recommend`
   in the skill's recommend mode over the T2 proposal and every source the
   `pending` rows name — the spec with its four section names, each proposal
   by path, each report by path and item — with `docs/` as the baseline, and
   name the output, `.tanto/<topic>/t2-recommendation.md`. The file lists
   every item once in three groups — Recommended adopt, Recommended reject,
   Unsure — each item quoted in full from its source, so that the file
   stands alone as the apply's input, with its destination, its one-line
   reason, and for a `design` entry the `req-<id>` it serves; a requirement
   or an ADR item carries the original wording followed by a reference
   translation in the chat's language. Name in the same dispatch the brief
   path — `.tanto/<topic>/t2-brief.md` — the template
   `templates/shoroku-brief.md` in the skill directory, and the chat's
   language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `4` and the
   four headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended reject`, `## Unsure`, in that order; every `### ` heading
   of the recommendation appears exactly once in the brief after `See: `, and
   the brief names no heading the recommendation lacks — count both with
   `grep '^### '` on the recommendation, each line stripped of its `### `
   marker, and `grep -cF 'See: <heading text>'` on the brief, one line per
   heading: the pointer is the heading's text, not the heading line. On a
   failure dispatch the recommender once more, naming what failed; on a
   second failure paste the brief as it stands and tell the human in one
   line what is wrong with it. Then give the human, in one message: the
   recommendation's path, the brief's path, the three counts, and the
   brief's text verbatim below them. The human answers as the `shoroku`
   skill already parses — `OK` for "as recommended", or the numbers that go
   the other way, or an edit — in your window, or through a Kikaku decision
   file whose "What Kanri should do with it" section names this
   recommendation and answers it by exception: that file is the answer,
   read whole, its item numbers the recommendation's, everything it does not
   list as recommended, every override with its reason, and you need no word
   in your own window. Write `t2-direction.md` beside the recommendation,
   item by item, with the `S-n` rows in the ledger: Adopted from the answer.
   No item is escalated apart from the rest and none is decided by you
   alone; the human sees the whole list, grouped, and answers by exception.
   <!-- markdownlint-enable MD038 -->
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

Where the commit lands: on the topic's branch, before the merge decision.
No other stage commits under `docs/` through this section.

**Between plans** there is no ledger, so record items that reach you then —
a Kikaku decision file belonging to no topic, a triage's observation, your
own exit's proposal, a close's `-2-proposal.md` — in the roster's Shoroku
proposal items table instead, and move its rows into the new ledger's
table, with Stage `t2`, when a topic opens. Nothing is written out from the
roster's table itself, so nothing is written twice.

The apply subagent is the writer at the close. You write under `docs/` only
through the intake's filings and the hotfix lane, and you hand those to Hosa
when one is live.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; an item two closes could claim is one row in the
ledger of the topic that raised it, never a compound value.

### The close

1. **Jisso proposes, then you do.** You send the `T2:` line; the live Jisso
   writes the numbered list to `.tanto/<topic>/shoroku-proposal.md` — the
   `pending` rows of the `S-n` table listed by number, and what its own
   context holds that no file does — and sends you one line. Check the
   file's form as "Exit shoroku" step 2 says, record its rows, and send it
   `release:`: the close is its exit, and it idles through nothing. Then
   write your own proposal and record its rows ("The final batch", step 3).
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

When the roster has a `live` Hosa row at a close, steps 2 to 4 are Hosa's.
After step 1 send Hosa one line, without an idle subscription:
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`.
`<topic>` is the topic word and the paths are the close's three files
under `.tanto/<topic>/`; the slot is `now` because no batch is in flight at
a close and Jisso is released. Hosa reads the ledger's `pending` rows for
the sources the recommend dispatch names, dispatches the recommender and
then the apply on their own kinds, form-checks and pastes the brief in its
own window, and writes the direction from the human's answer there; a
Kikaku decision file that answers the check reaches Hosa as
`decision: <path>`, one line from you. Hosa answers
`close done: <commit subject> — <reading>`, or `close blocked: <one line>`
when a form check fails twice or the answer does not arrive. On
`close done:` verify the commit as you verify any — `git status` clean, the
diff's paths those the direction names, lint on them — and fill Adopted
from the direction file and Written from the subject. You wait for none of
it: a close delegated is carried in the handover file's In flight block,
and the successor verifies. With no Hosa live, run the three steps
yourself, and add to your close line the suggestion to open one
(`/tanto hosa`), in the shape of the between-plans Kikaku suggestion.

**A topic the human ends before its final batch** — the plan not wanted,
the branch abandoned — still gets its close, over what is on disk: write
the T2 proposal yourself, in Jisso's absence, as you write your own — the
`pending` rows by number and what the ledger's Session events and Rulings
hold that no row does — then your own, and run steps 2 to 4; the apply
lands on the topic's branch, and the merge decision says whether that
branch lands.

### Exit shoroku

Every planned exit of a session, in any role, carries its own shoroku, and
the session is released once its proposal is on disk and form-checked: its
items are recommended and checked at the close, with the session gone.
`SKILL.md`'s "Session exit" defines the mechanism and the file pattern
`exit-<role>[-<suffix>]`; these are your steps.

1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`. The session writes it,
   runs its resume self-check, and answers
   `exit proposal: <path> — <reading>`. **Three roles are the exception**: a
   Sekkei at its own final boundary names its proposal in its
   `spec accepted:` line, and a Keikaku at its own names it in its
   `coldread answered:` line, both unasked and both without being sent
   anything, and a Jisso's proposal is the Shoroku proposal section of the
   batch report it just sent, at every boundary — for those, skip this step
   and go to step 2. A Sekkei or Keikaku whose exit falls elsewhere — a
   compaction in the reading (decision-6dea), a replacement from the
   Replace table, or the human not wanting the plan now — takes the line
   like a Kaiseki; a Jisso never does.
2. Check the file's form, not its judgment: a direct read, since the
   proposal carries no headings for `sections` to select by, for the
   exclusion line it opens with and the numbered list under it; for a Jisso,
   the report's section, read with the report's others. A file that fails
   the form is one line back to the session, answered by a rewrite; a file
   that passes is recorded — one `pending` row per item, Source the
   proposal's path and the item's number, Stage `t2`, since the close is
   what recommends it — and you send the session `release: /clear this window`,
   mark its row `cleared`, and tell the human, in your own window,
   `<role> <name> released — its work is in <paths>; no step needs it — /clear its window when convenient`.
   No recommender runs here, and no delete request goes out.
3. The rows wait for the close, where steps 2 to 4 of "The four steps" run
   over them with everything else; fill their Written column from the
   close's commit subject.

The session's judgment was spent writing the proposal, and the file holds
it: the close's recommender quotes every item in full from that file, which
is what the human checks. What another session pays for an exit is the
proposal.

A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the window is gone,
a send errors, a `no-role` comes back, or your window wakes for another
reason and the answer has not arrived. Treat the exit as forced, write a
roster Events line saying its exit shoroku did not run and what was lost as
far as you know, mark the row `cleared` on a `no-role` or `dead` on a send
error or an empty listing, and continue. The same Events line goes in
whenever you mark a row `dead`.

**Your own exit.** Propose from the ledger and the roster rather than from
recollection, to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`,
`<name>` being your own bare name, and a second file with `-2` before
`-proposal` for what a close teaches after the first is recorded. At a plan
close the proposal comes before the recommender and its rows are that
close's ("The final batch", step 3). At a handover with any ledger open, the
items are `pending` rows, Stage `t2`, in the ledger of the topic whose
batches are in flight, else the oldest open topic's, and the handover file
names the ledger. Between plans, with no ledger open, they are rows of the
roster's Shoroku proposal items table, and move into the next topic's ledger
when it opens. Nothing else runs at your exit: no recommender, no check, no
apply, no commit. Your window's last text is the "Kanri hands over" line,
the commands, and your closing line.
```

### 3.9 "Session lifecycle", replaced whole

Between `## Session lifecycle` and `### Readings`:

````text
## Session lifecycle

The human is the only actor who can give a window a role or take one away,
and you are the only role that asks. A window is `/clear`ed and reused,
never closed: a session is identified by its transcript path, a window by
its `name [ref]`, which survives `/clear` (measured 2026-09-16), and the
roster's rows tell them apart. Every create request is this numbered list,
which the human can paste, with your own bare name as your start line
printed it in place of `<name>`:

```text
1. In a free window of <repo path> — one you have /clear'ed, or a new one:
2. /model <family>
3. /effort <level>
4. Make sure the session is in auto mode.
5. /tanto <role> <name>
```

Line 5 carries, after the command, what the Create table's third column names
for that role. The family and the level are `sessions.<role>` from
`tanto.json`, and they come before the command because the human forgets the
effort more often than the model — and because `/clear` resets the effort
to the default while it keeps the model (measured 2026-09-16), so line 3 is
never redundant in a reused window. For the plan's Jissos the list is sent
once and says how many windows it is for. There is no delete request: a
seat's exit ends with your `release:` line to it, and one line to the
human in your own window — `<role> <name> released — its work is in <paths>;
no step needs it — /clear its window when convenient`. A line of yours that
speaks of a release and of a creation keeps them in two clauses with their
own times — "released now; a fresh Keikaku is requested at
`<topic>`'s merge" — never one clause for both.

### Create

| When | Ask the human to | The request line carries |
| --- | --- | --- |
| bootstrap | nothing; the human opens a session and runs `/tanto kanri` | — |
| a plan is committed and your cold read has no open questions | queue the plan's Jissos: N windows, N the rows of the plan's Batches table plus one for the fix wave; more if the human wants, fewer if they will be present to re-queue released windows | `/tanto jisso <name>`, N, the plan path, the branch |
| the queue is empty and a batch, a fix wave, or a resume needs a Jisso | queue one more Jisso — a released window serves | `/tanto jisso <name>`, the plan path, the branch |
| the spec review is accepted | create Keikaku | `/tanto keikaku <name>`, the topic, the spec path |
| the first batch of the current plan is accepted, or every open topic has passed its spec stage | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei <name>`, the topic if known |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki <name>`; the brief follows the handshake |
| — | nothing; Kikaku and Hosa are opened by the human and never requested by you | — |

### Replace

| Symptom | Action |
| --- | --- |
| the live Jisso is gone — not in `ListAgents`, `SendMessage` errors, a `no-role` came back, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); mark the row `dead`, or `cleared` on a `no-role`, with the Events line saying its exit shoroku did not run and what was lost; send the next queued Jisso the prompt for the same batch, its resume line saying `resume batch X from task N`; the queue is one short, and the next boundary's line to the human asks for one more window (the Create table's third row) |
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then the create request; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "Exit shoroku", then the create request; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
| a Kikaku's or a Hosa's reading shows a compaction | neither is replaced: remind the human to `/clear` that window, mark the row `cleared`, and let the next `/tanto kikaku` or `/tanto hosa` handshake write a new row — what the session produced is already on disk or committed |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then, if the case is open, the create request with the same brief |
| A handover trigger fired at a boundary | run the Handover section; the successor reminds the human to `/clear` your window when it starts elsewhere |
| Sekkei is gone before the spec review is accepted | the create request; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Keikaku is gone before the plan is committed | the create request; the spec on the branch and the plan draft on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; the create request; the brief and the WIP commit are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |

A Jisso's ceiling verdict and a compaction in its reading are no longer
symptoms: one Jisso runs one batch, and the rotation retires it at the
boundary. The figures are recorded in its Residency row and kept by the
archive. Never replace mid-batch on suspicion. Wait for the boundary, or
confirm the session is gone first — uncommitted work may be in the tree.

### Release

| When | Say |
| --- | --- |
| a batch is accepted at loop step 6 — the plan's last implementation batch excepted, whose Jisso waits for the whole-branch review's verdict ("The final batch", step 2) | its Jisso is done; `release:` to it, its row `cleared`, the released line to the human; the next prompt goes to the next queued Jisso |
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the exit proposal | Sekkei is done; record its proposal's items and the spec's four sections as `pending` rows and send `release:` as soon as the proposal passes the form check — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the `coldread answered:` line named the exit proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; record its proposal's items as `pending` rows and send `release:` as soon as the proposal passes the form check; a Keikaku is never reused across topics (decision-f496) |
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; record its proposal's items as `pending` rows and send `release:` as soon as the proposal passes the form check, or keep it if more of the same bug is expected |
| the final batch is accepted, T2's proposal is written and passes the form check, and leftovers are clean | the last Jisso is done; `release:` at once, T2 being its exit — the recommendation, the human's check, the apply, and the merge decision run with it gone, and a merge declined with fixes wanted is a new batch on a new Jisso either way; a queued Jisso that never ran is named in the same released line for the human to `/clear`, its row `cleared` |
| the close's apply is verified, the human has executed the merge decision, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every handshake the ledger's Session events accepted for it — Sekkei, Keikaku, every Jisso, queued ones that never ran included, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then ask the human, in one line and in the chat's language, for the Account & Usage view's own figure for the day, and record it beside the proxy — the two are compared, not equated, since that view counts every other workspace and every subagent — and a silence is an answer and a blank. Then mark `dead` the rows of any session no longer listed, move the dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |

The role is resident; the session that carries it is not. A plan's end is a
boundary like any other for the run, and the next topic starts with a new topic
directory and a new ledger under the same roster, cold-read as if fresh —
normally by your successor, because the close hands the role over
(decision-b6cb), and by you when the human declines that handover. Your only
exit is the Handover section above.

Neither `.tanto/<topic>/` nor the SDD workspace
`.superpowers/sdd/<plan-basename>/` is deleted at the close, and you ask the
human about neither. After T2 the two have the same standing: untracked,
local to one machine, and useful only for a later re-read (issue-12d3).
````

"Readings" and "Recovery after a VS Code restart" keep their procedures —
an editor restart resumes every window, `/tanto fukki` re-handshakes each,
and `dead` is for a row that neither the listing nor a re-handshake
accounts for — with the two sentences 3.10 rewrites.

### 3.10 Ten sentences the spec review found

In file order. The opening paragraph:

```text
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, the shoroku recommendations and the
directions, the exit directions, the bug intake, and every lifecycle request;
the write-out itself is the apply subagent's work, at the topic's close.
```

→

```text
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, the shoroku recommendations and the
directions, the bug intake, the create requests, and the `release:` lines;
the write-out itself is the apply subagent's work, at the topic's close.
```

"Start", the Second Kanri case:

```text
**Second Kanri** — no handover file, the first data row is another name, and
that session is still listed. Stop, tell the human there is a live Kanri
already, and ask whether that one should hand over or this session should be
deleted. Write nothing.
```

→

```text
**Second Kanri** — no handover file, the first data row is another name, and
that session is still listed. Stop, tell the human there is a live Kanri
already, and ask whether that one should hand over or this window should be
`/clear`ed. Write nothing.
```

"Start", the Resumed Kanri case:

```text
rewrite the first row in place with your new name and `[ref]`, status `live`,
send the `kanri-address:` line of `SKILL.md`'s Resuming to every listed peer,
```

→

```text
rewrite the first row in place with your new name and `[ref]`, status `live`,
send the `kanri-address:` line of `SKILL.md`'s Resuming to every `live` row,
```

"When the plan lands", step 3's parenthesis:

```text
   Delete row). Nothing is copied and nothing is recommended: the close's
```

→

```text
   Release row). Nothing is copied and nothing is recommended: the close's
```

"The batch loop", step 7 (c):

```text
   the boundary is verified, naming any Kaiseki create or delete since the
```

→

```text
   the boundary is verified, naming any Kaiseki create or release since the
```

"The Kaiseki branch", step 5:

```text
   `kaiseki-<n+1>-brief.md` sent to the **same** Kaiseki, which is not deleted
```

→

```text
   `kaiseki-<n+1>-brief.md` sent to the **same** Kaiseki, which is not released
```

"Handover", "The trigger", signal 1:

```text
   whose batches were in flight. After T2, the merge decision, the peers'
   deletion, and the archive move, the handover runs: without a threshold, and
```

→

```text
   whose batches were in flight. After T2, the merge decision, the peers'
   release, and the archive move, the handover runs: without a threshold, and
```

"The handover file", the Deferred sentence:

```text
the topic whose batches were in flight. Deferred is the ledger's Progress
clause, verbatim, when a handover or a Jisso replacement stands deferred on the
ceiling and the human's absence, and `none` otherwise: the successor re-checks
```

→

```text
the topic whose batches were in flight. Deferred is the ledger's Progress
clause, verbatim, when a handover stands deferred on the
ceiling and the human's absence, and `none` otherwise: the successor re-checks
```

"Readings", the doubted-reading list:

```text
session whose report lost a ruling with `0 compactions`, one whose ceiling
line decides a replacement, or one that sent
```

→

```text
session whose report lost a ruling with `0 compactions`, your own whose
ceiling line decides a handover, or one that sent
```

"Recovery after a VS Code restart":

```text
human says the windows are done. Verify the tree if a batch was in flight, then
ask for the roles still missing, in this order: Jisso only if a batch is in
flight, Kaiseki only if a bug is open, Keikaku only if a plan is in progress,
```

→

```text
human says the windows are done. Verify the tree if a batch was in flight, then
ask for the roles still missing, in this order: Jisso only if a batch is in
flight and no `queued` row re-handshook — the next queued Jisso resumes the
batch otherwise, as the Replace table's first row says — Kaiseki only if a
bug is open, Keikaku only if a plan is in progress,
```

## 4. `skills/tanto/roles/jisso.md`

Four sites.

### 4.1 "Start": queued, and two kinds of first prompt

```text
You have done the model check and sent the handshake. Now wait for Kanri's
orders line: it carries the plan path, the conductor ledger path, and the
branch. Do not start without it.

Then, in order:

1. Read the plan and, if it names one, the spec. The spec is the binding
   authority; the plan argues from it.
2. Run superpowers subagent-driven-development's `scripts/sdd-workspace` with
   the plan file to get this plan's workspace, and create or resume
   `progress.md` inside it exactly as that skill prescribes.
3. Read the conductor ledger at the path Kanri gave you. It is read-only for
   you — Kanri is its only writer.
4. Run SDD's pre-flight conflict scan, write its table to the SDD ledger, rule
   on everything it surfaces, and report the result in your first batch report.
```

→

```text
You have done the model check and sent the handshake. Kanri answers
`queued: <n>` — your place in this plan's queue — and nothing else until
your batch prompt. You are one of the plan's Jissos, and you run **one
batch**: the prompt names it, and it is your orders, carrying the plan
path, the conductor ledger path, the branch, and which of the plan's Jissos
you are. **Until it arrives, read nothing** — not the plan, not the spec,
not the ledger: a waiting seat holds the minimum context, because every
wake-up re-reads all of it, and yours is a window that may wait hours. Your
closing line while you wait says so: no work yet, and the step that needs
this seat is your batch prompt.

On the prompt, in order:

1. Read the plan and, if it names one, the spec. The spec is the binding
   authority; the plan argues from it.
2. Run superpowers subagent-driven-development's `scripts/sdd-workspace` with
   the plan file to get this plan's workspace, and create or resume
   `progress.md` inside it exactly as that skill prescribes — resume, for
   every Jisso but the first: the earlier batches are in it.
3. Read the conductor ledger at the path Kanri gave you. It is read-only for
   you — Kanri is its only writer.
4. **The first Jisso only:** run SDD's pre-flight conflict scan, write its
   table to the SDD ledger, rule on everything it surfaces, and report the
   result in your first batch report. Every later Jisso resumes from the
   task the prompt's resume line names and runs no scan.
```

### 4.2 "The run": the boundary is your exit

```text
A batch is the task range Kanri's prompt names. Execute those tasks, then
**stop and idle** — do not start the next task. At the boundary:
```

→

```text
A batch is the task range Kanri's prompt names. Execute those tasks, then
**stop and idle** — do not start the next task, and expect none: the next
batch is the next Jisso's. At the boundary:
```

```text
3. Idle. Kanri verifies the tree, rules, and sends the next prompt.
```

→

```text
3. Idle, with your closing line: your work is in the report and the commits;
   the step that still needs this seat is the boundary's verdict. Kanri
   verifies the tree and rules. A batch returned for rework comes back to
   you as a prompt for the same batch; a batch accepted is your exit — the
   report's Shoroku proposal section is your exit shoroku, nothing else is
   written, and Kanri's `release: /clear this window` follows. The one
   exception is the plan's last implementation batch: its Jisso waits for
   the whole-branch review's verdict, and gets either `release:` — the fix
   wave is the next Jisso's — or, when the review finds nothing, the `T2:`
   line below. On `release:`, tell the human to `/clear` this window and
   end your turn: `none — /clear this window`.
```

### 4.3 "T2 and the exit — the shoroku write-out"

```text
**Your exit** is that same proposal under the exit file names, written at the
boundary where Kanri replaces you or where the plan ends; at plan end, T2
*is* that exit. Kanri sends
`exit: propose your shoroku; write it to <path>`, the path being
`exit-jisso-<X>-proposal.md` in the topic directory, `.tanto/<topic>/`, with
`<X>` the batch letter. Write it, run the self-check of `SKILL.md`'s
Resuming, and answer `exit proposal: <path> — <reading>`. Then idle: you
apply nothing and commit nothing at your exit, and your deletion follows the
proposal.
```

→

```text
**Your exit** is a boundary. Every Jisso but the plan's last leaves at the
boundary Kanri accepts, and its report's Shoroku proposal section is its
proposal — no `exit:` line comes, no exit file is written. The last Jisso
leaves at T2: the `T2:` line, the proposal above, and `release:` on its form
check. Either way you apply nothing and commit nothing at your exit, your
release follows the form check, and the recommendation, the human's check,
and the apply run with you gone.
```

The **Propose** paragraph is as `shoroku-at-close` leaves it (P8.1) — the
last live Jisso writes the pointer list and the delta — but for its last
sentence, which 4.5 rewrites.

### 4.4 "What tanto overrides", the `shoroku` row

```text
| `shoroku` — propose in chat, wait for the human's `Direction?`, never start without their explicit confirmation | write the proposal to a file and stop there; a dispatched recommender reads it and the human checks the recommendation by exception | you do not talk to the human unless Kanri grants it, and every item reaches the human that way |
```

→

```text
| `shoroku` — propose in chat, wait for the human's `Direction?`, never start without their explicit confirmation | write the proposal to a file — the report's section at a boundary, `shoroku-proposal.md` at T2 — and stop there; a dispatched recommender reads it at the close and the human checks the recommendation by exception | you do not talk to the human unless Kanri grants it, and every item reaches the human that way |
```

The role's opening sentence, `You own the SDD run, the batch reports, the
commits, and the T2 shoroku proposal.` → `You own one batch of the SDD run,
its report, and its commits; the plan's last Jisso owns the T2 shoroku
proposal.`

### 4.5 Three sentences the spec review found

"The run", the ceiling line's reading:

```text
   You act on neither: Kanri reads the ceiling line with the report's other
   header lines, and a verdict of `over` there is a Replace symptom on Kanri's
   side, gated on the human's presence and never your own decision. When the
```

→

```text
   You act on neither: Kanri reads the ceiling line with the report's other
   header lines and records it — a verdict of `over` there acts on nothing,
   since the rotation retires you at this boundary either way. When the
```

"The final batch":

```text
Kanri dispatches the whole-branch review itself and sends you its findings as
one more batch prompt. For that batch:
```

→

```text
Kanri dispatches the whole-branch review itself and sends its findings to
the next queued Jisso as one more batch prompt. If you are that Jisso:
```

"T2 and the exit", the Propose paragraph's last sentence (the post-merge
text, `shoroku-at-close` P8.1):

```text
Then send Kanri one line with the path, and idle: your deletion follows the
form check, and the recommendation, the check, and the apply run with you
gone.
```

→

```text
Then send Kanri one line with the path, and idle with your closing line:
Kanri's `release:` follows the form check, and the recommendation, the
check, and the apply run with you gone.
```

## 5. `roles/sekkei.md`, `roles/keikaku.md`, `roles/kaiseki.md`

Each file's exit paragraph names its deletion; each now names `release:`
and its closing line. The old texts of 5.1 and 5.2 are the post-merge ones
(`shoroku-at-close` P7.5, P7.9).

### 5.1 `roles/sekkei.md`

```text
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
  there: Kanri checks the proposal's form, records its items as `pending`
  rows, and asks the human to delete you at once — no recommender runs before
  the topic's close, where your items are recommended and checked with
  everything else; the deletion may lag that ask. If more work reaches you in
  that gap — a cold-read
```

→

```text
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
  there, with your closing line — the spec, the dialogue, and the proposal
  by path; the step that still needs this seat, `none` — and wait for
  Kanri's `release: /clear this window`: Kanri checks the proposal's form,
  records its items as `pending` rows, and sends that line at once — no
  recommender runs before the topic's close, where your items are
  recommended and checked with everything else. On `release:` tell the
  human to `/clear` this window and end your turn. If more work reaches you
  before it — a cold-read
```

Section 5.4 lists the file's other sentences this design touches — the
second deletion sentence, the review report's section name, and the word
`candidates`; the rest of the file is unchanged. Its Step 1 sentence on the
dialogue's readers, `and the close's recommender takes it as an input`, is
right as it stands.

### 5.2 `roles/keikaku.md`

```text
  process, and the defects noticed. Then stop there: Kanri checks the
  proposal's form, records its items as `pending` rows, and asks the human
  to delete you at once — no recommender runs before the topic's close,
  where your items are recommended and checked with everything else; the
  deletion may lag that ask, and work that reaches you in the gap — a report
  that conflicts with
```

→

```text
  process, and the defects noticed. Then stop there, with your closing line
  — the plan, the dry run, and the proposal by path; the step that still
  needs this seat, `none` — and wait for Kanri's
  `release: /clear this window`: Kanri checks the proposal's form, records
  its items as `pending` rows, and sends that line at once — no recommender
  runs before the topic's close, where your items are recommended and
  checked with everything else. On `release:` tell the human to `/clear`
  this window and end your turn. Work that reaches you before it — a report
  that conflicts with
```

### 5.3 `roles/kaiseki.md`

```text
`SKILL.md`'s Resuming, and answer `exit proposal: <path> — <reading>`. Then
idle: your items are recommended and checked at the topic's close, with
everything else, and your deletion follows the form check.
```

→

```text
`SKILL.md`'s Resuming, and answer `exit proposal: <path> — <reading>`. Then
idle with your closing line — the report and the proposal by path; the step
that still needs this seat, `none`: your items are recommended and checked
at the topic's close, with everything else, and Kanri's
`release: /clear this window` follows the form check. On it, tell the human
to `/clear` this window and end your turn.
```

```text
Idle. If Kanri sends another brief for a `blocks this task: yes` item, you keep
your context and work it the same way. You are deleted only once Jisso's fix
has passed review and tests and no blocking item is open — and that is Kanri's
request to the human, not yours.
```

→

```text
Idle, with your closing line: the report by path, and the step that still
needs this seat — a further brief, or Kanri's `exit:` line. If Kanri sends
another brief for a `blocks this task: yes` item, you keep your context and
work it the same way. You are released only once Jisso's fix has passed
review and tests and no blocking item is open — and that is Kanri's line,
not your judgment.
```

`Your candidates are this case's **Shoroku candidates** section` → `Your
proposal items are this case's **Shoroku proposal** section`. The
standalone Kaiseki's section is unchanged.

### 5.4 Eight sentences the spec review found

`roles/sekkei.md`, Step 2's reviewer dispatch — the review report's section
is a contract with the `spec.review` kind and with Kanri's `sections` read,
so the plan renames it as a passage, not as a sweep:

```text
`.tanto/<topic>/spec-review.md` with a **Shoroku candidates** section at the
end. When a batch of another topic is in flight, tell it — as the orders line
```

→

```text
`.tanto/<topic>/spec-review.md` with a **Shoroku proposal** section at the
end. When a batch of another topic is in flight, tell it — as the orders line
```

```text
Then send Kanri one line with the report path: Kanri records its Shoroku
candidates as `pending` rows.
```

→

```text
Then send Kanri one line with the report path: Kanri records its Shoroku
proposal's items as `pending` rows.
```

`roles/sekkei.md`, the idle sentence after the `spec accepted:` line:

```text
idle. Kanri sends you no `exit:` at this boundary; it checks the proposal's
form, records its items, and asks for your deletion at once, and the
plan is Keikaku's from then on.
```

→

```text
idle. Kanri sends you no `exit:` at this boundary; it checks the proposal's
form, records its items, and sends you `release: /clear this window` at
once, and the plan is Keikaku's from then on.
```

`roles/sekkei.md`, the exit bullet's `Your candidates are the` → `Your
proposal items are the` (one line, L167 of the tree read).

`roles/keikaku.md`, Step 3's sizing sentence:

```text
  delivers, and the stop conditions at its boundary. Size the batches so that
  one Jisso carries a batch without growing long, and say at which boundaries
  a planned replacement is expected, if any. A stop condition worded as a
```

→

```text
  delivers, and the stop conditions at its boundary. Size the batches so that
  one Jisso carries one without growing long: the Batches table's row count,
  plus one for the fix wave, is what Kanri's Jisso queue is sized from, and
  every boundary rotates. A stop condition worded as a
```

`roles/keikaku.md`, the plan reviewer's dispatch, the same contract as
Sekkei's:

```text
   re-running the set, and writes `.tanto/<topic>/plan-review.md`
   with a **Shoroku candidates** section at the end; after you have ruled,
```

→

```text
   re-running the set, and writes `.tanto/<topic>/plan-review.md`
   with a **Shoroku proposal** section at the end; after you have ruled,
```

`roles/keikaku.md`, the idle sentence after the `coldread answered:` line:

```text
Then idle. Kanri sends you no `exit:` at this boundary; it checks the
proposal's form, records its items, and asks for your deletion at once. The
```

→

```text
Then idle. Kanri sends you no `exit:` at this boundary; it checks the
proposal's form, records its items, and sends you
`release: /clear this window` at once. The
```

`roles/keikaku.md`, the exit bullet's `Your candidates are the` → `Your
proposal items are the` (one line, L322 of the tree read).

`roles/kaiseki.md`, the reading's `--role` sentence:

```text
  `- Transcript — <reading>` line. You pass no `--role`: the ceiling replaces
  Kanri and Jisso only, and every other role measures the five figures, sends
  them, and is replaced on none of them.
```

→

```text
  `- Transcript — <reading>` line. You pass no `--role`: the ceiling replaces
  Kanri only — Jisso's line is measured and kept, its rotation being its
  replacement — and every other role measures the five figures, sends
  them, and is replaced on none of them.
```

## 6. `roles/hosa.md` and `roles/kikaku.md`

### 6.1 `roles/hosa.md`

"Lifecycle":

```text
You have a roster row, no topic. No create request, no delete request, no
replace row, and no exit shoroku. The human `/clear`s this window; the next
`/tanto hosa` re-handshakes as a new session, and Kanri marks the old row
`cleared`.
```

→

```text
You have a roster row, no topic. No create request, no `release:` line, no
replace row, and no exit shoroku. The human `/clear`s this window at will;
the next `/tanto` in it, in any role, re-handshakes as a new session, and
Kanri marks the old row `cleared`. Your closing line after a chore names
the commit subject and `none`; after a `close:` line, the direction file and
the step the close is at.
```

"Not yours" (post-merge, `shoroku-at-close` P8.5):

```text
The candidates and the ledger. You never write a proposal or an `S-n` row:
the session that holds the candidates writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` line, and only a subagent applies them.
```

→

```text
The proposal items and the ledger. You never write a proposal or an `S-n`
row: the session that holds the items writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` line, and only a subagent applies them.
```

"The close's." (post-merge, P8.4), the three lines after the `close:` line:

```text
— `<topic>` a topic word, or `kanri` for Kanri's own between-plans exit.
This is the topic's one shoroku stage, and you run its three dispatched
steps while Kanri goes on. Read the ledger's Shoroku candidates table for
```

→

```text
— `<topic>` a topic word. This is the topic's one shoroku stage, and you
run its three dispatched steps while Kanri goes on. Read the ledger's
Shoroku proposal items table for
```

The `close:` line itself is unchanged, byte for byte with `SKILL.md`'s and
`roles/kanri.md`'s.

### 6.2 `roles/kikaku.md`

"Lifecycle":

```text
The human `/clear`s this window when the subject changes. The next
`/tanto kikaku` re-handshakes with a new transcript, and Kanri writes a new
row and marks the old one `cleared`. A `/tanto fukki` after an editor
restart matches the transcript as for any role.
```

→

```text
The human `/clear`s this window when the subject changes. The next `/tanto`
in it, in any role, re-handshakes with a new transcript, and Kanri writes a
new row and marks the old one `cleared` — the rule every window follows. A
`/tanto fukki` after an editor restart matches the transcript as for any
role. Your `decision: <path>` line carries the `no-role` line as its second line,
like every tanto line.
```

### 6.3 Two sentences the spec review found, in `roles/kikaku.md`

```text
Kanri never requests a Kikaku. The human opens one when they want to think,
so there is no create request behind you and no deletion waiting for you.
```

→

```text
Kanri never requests a Kikaku. The human opens one when they want to think,
so there is no create request behind you and no `release:` waiting for you.
```

```text
You have a roster row — role `kikaku`, no topic — with status `live`. No
create request, no delete request, no replace row, and no exit shoroku:
```

→

```text
You have a roster row — role `kikaku`, no topic — with status `live`. No
create request, no `release:` line, no replace row, and no exit shoroku:
```

## 7. The templates

### 7.1 `templates/roster.md`

The keeping rule's first three bullets:

```text
- One row per role and topic, Kanri's own row first.
- One live session per role and topic; Kanri, Kikaku, and Hosa one each. A
  second handshake for a role and topic that already has a live row gets no
  row and is reported to the human.
- Every handshake rewrites that role's row in full. A handshake whose
  `transcript=` matches a row's Transcript column is that row's session
  resumed, and rewrites the row in place with the new name and `[ref]`, status
  `live`.
```

→

```text
- One row per session that handshook, Kanri's own row first — a plan's
  queued Jissos each have one.
- One live session per role and topic, the plan's other Jissos `queued`;
  Kanri, Kikaku, and Hosa one each. A second handshake for a role and topic
  that already has a live row gets no row and is reported to the human; a
  Jisso handshake while one is live is queued, not refused.
- Every handshake rewrites that role's row in full. A handshake whose
  `transcript=` matches a row's Transcript column is that row's session
  resumed, and rewrites the row in place with the new name and `[ref]`, its
  status unchanged. A handshake whose name is on a `live` or `queued` row
  with a different transcript is that window `/clear`ed and re-invoked, in
  any role: the old row goes `cleared`, and a new row is written.
```

The fourth and fifth bullets:

```text
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
  A dead, replaced, refused, or cleared row stays, with its Residency row,
  until the plan closes, then both move to `roster-archive.md` as one row, so
  the run stays readable after a replacement and the roster stays short.
- This is the address book: one row per live role and topic, Kanri's row
  first, the `Name [ref]` column being the address the row's session answers
  to, used as the bare name. It stays correct because nothing renames a
  session. The `[ref]` is load-bearing: it identifies a session across the
  listing, the roster, and the handover.
```

→

```text
- A row whose session is no longer listed by `ListAgents` gets status `dead`
  — a closed tab, a crash, an editor restart before `/tanto fukki`; a
  cleared window stays listed under its name, so this never detects a
  `/clear`. A dead, replaced, refused, or cleared row stays, with its
  Residency row, until the plan closes, then both move to
  `roster-archive.md` as one row, so the run stays readable after a
  replacement and the roster stays short.
- This is the address book: one row per session, Kanri's row first, the
  `Name [ref]` column being the address the row's session answers to, used
  as the bare name, and Kanri sends only to `live` rows. It stays correct
  because nothing renames a session, and a `/clear` keeps the name. The
  `[ref]` is load-bearing: it identifies a window across the listing, the
  roster, and the handover.
```

The Status paragraph:

```text
Status is one of `live`, `dead`, `replaced`, `refused`, and `cleared`.
`refused` records a handshake that got no row — a second live session for the
same role and topic, or a model that did not match `sessions.<role>` — and is
always followed by an Events line saying which; a second Sekkei or Keikaku
whose topic differs from the live one's is not a duplicate and gets its own
row. `cleared` records a Kikaku or Hosa row the human's `/clear` ended: a
handshake whose `transcript=` matches no row, or whose name is already here
with a different transcript, and whose role is Kikaku or Hosa, writes a new
row and marks the old one `cleared`.
```

→

```text
Status is one of `queued`, `live`, `cleared`, `replaced`, `dead`, and
`refused`. `queued` is a Jisso waiting for its batch prompt, in handshake
order. `cleared` records a window Kanri released — `release:` sent, the row
marked as the line goes out — or whose `/clear` came to light another way: a
handshake under a name already here with a different transcript, in any
role, or a `no-role` reply to a line Kanri sent. `replaced` is the old row
of a Kanri that handed over. `refused` records a handshake that got no row —
a second live session for the same role and topic, or a model that did not
match `sessions.<role>` — and is always followed by an Events line saying
which; a second Sekkei or Keikaku whose topic differs from the live one's is
not a duplicate and gets its own row.
```

The Residency paragraph's sentence on the archive move at the plan close is
unchanged; a queued Jisso's reading columns stay blank until its boundary,
and a queued row that never ran moves with its blanks.

`## Shoroku candidates` → `## Shoroku proposal items`; in its paragraphs,
`a candidate raised by` → `an item raised by` and `the first candidate
arrives` → `the first item arrives`; the header row
`| S-n | Source | Candidate | Destination | Adopted | Stage | Written |` →
`| S-n | Source | Item | Destination | Adopted | Stage | Written |`; the
placeholder `| (no candidate yet) |` → `| (no item yet) |`. The Stage
sentence, as `shoroku-at-close` leaves it, loses its
`exit-kanri-<YYYY-MM-DD>-<name>` clause: no Kanri exit recommends here any
more, and every row's Stage is `t2`.

The Events list gains three kinds, inserted after `cleared: <old name> → <new name>;`:

```text
  queued: <name> [<ref>] as Jisso <n> of <topic>;
  released: <name> [<ref>] — <role>, <what it left on disk>;
  no-role from <name> [<ref>] — <what was lost>;
```

and `an exit shoroku committed by <name> [<ref>], or not run and what was
lost` → `an exit shoroku proposed by <name> [<ref>], or not run and what was
lost`.

### 7.2 `templates/batch-prompt.md`

The title and the guard:

```text
# Batch <X> — tasks <N> to <M>

Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
`<repo path>` on branch `<branch>`. If that is not your workspace, reply
`not me` to `<kanri-address>` and stop.
```

→

```text
# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan

Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
`<repo path>` on branch `<branch>`, and to the Jisso named above. If that is
not your workspace or your name, reply `not me` to `<kanri-address>` and
stop.
```

"Previous batch verdict" loses its deferral lines:

```text
<When a deferral stands at this boundary, one further line, verbatim — both
when both stand:
"Kanri's handover is deferred since <batch X | the spec stage | the plan
stage> — the ceiling is crossed and the human is absent; this batch runs under
the same Kanri", and
"Your replacement is deferred since batch <X> — your ceiling is crossed and
the human is absent; run this batch and report as usual".>
```

→

```text
<When Kanri's handover stands deferred at this boundary, one further line,
verbatim: "Kanri's handover is deferred since <batch X | the spec stage | the
plan stage> — the ceiling is crossed and the human is absent; this batch runs
under the same Kanri".>
```

"Setup on resume":

```text
- <Only after a replacement: "resume batch <X> from task <N>". Otherwise drop
  this line.>
```

→

```text
- Jisso — <"the first of this plan: run Start steps 1 to 4, the pre-flight
  scan included", or "the <n>th of this plan: run Start steps 1 to 3, resume
  `progress.md` through `sdd-workspace`, and start at task <N> — no scan";
  after a Jisso gone mid-batch, "resume batch <X> from task <N>" in the
  second form>
```

The `- Kanri — <name> [<ref>]` line stays, and is what a queued Jisso learns
Kanri's name from. "Execute" and "Report" are unchanged; the report's section
list in the Report paragraph, `For Kanri, Rulings, Questions for the human,
Deviations from the plan`, is unchanged. The prompt file holds the same text
as the message, so the `no-role` line of `SKILL.md`'s Messages sits in the
file after the title line — 7.6 gives that insertion.

### 7.3 `templates/kanri-handover.md`

"Why": unchanged. "In flight", the Deferred slot:

```text
  - Deferred — <the ledger's Progress clause, verbatim, when a handover or a
    Jisso replacement stands deferred on the ceiling and the human's absence;
    "none" otherwise. The successor re-checks it at its own first check, where
    a `present` verdict runs what the outgoing session could not.>
```

→

```text
  - Deferred — <the ledger's Progress clause, verbatim, when a handover
    stands deferred on the ceiling and the human's absence; "none"
    otherwise. The successor re-checks it at its own first check, where a
    `present` verdict runs what the outgoing session could not.>
```

"Live peers":

```text
Every peer of every open topic, with its Topic as the roster carries it; the
successor sends `kanri-address:` to all of them.
```

→

```text
Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor sends `kanri-address:` to all of them. Then the `queued`
Jissos, by name and place — the successor sends them nothing; their batch
prompt names it.
```

"Not reconstructed" is as `shoroku-at-close` leaves it (P6.4); `a shoroku
candidate the outgoing Kanri could not classify or reconstruct` → `a
proposal item the outgoing Kanri could not classify or reconstruct`.
"Commands for the human":

```text
1. Open a new session in <repo path> and run `/tanto kanri`.
2. When the new Kanri asks, delete this session.
```

→

```text
1. /clear this window — or pick any free window of <repo path>.
2. /model <family> and /effort <level>, as `sessions.kanri` says; /clear
   keeps the model and resets the effort.
3. /tanto kanri
4. If the new Kanri started elsewhere, /clear this window when convenient.
```

### 7.4 `templates/batch-report.md` and `templates/kaiseki-report.md`

`templates/batch-report.md`:

```text
## Shoroku candidates

- <requirements, design, decisions, issues, notes, or reports> — <one line on
  what is worth keeping and why>
```

→

```text
## Shoroku proposal

<This section is this Jisso's exit shoroku: the items this batch raised
that no file holds — a rejected alternative and its reason, a fact measured,
a defect noticed, an observation about the run — never a restatement of the
plan, the SDD ledger, or this report. Kanri records each as a `pending` row;
the close's recommender quotes it from here. Nothing else is written at
your exit.>

- <requirements, design, decisions, issues, notes, or reports> — <one line on
  what is worth keeping and why>
```

`templates/kaiseki-report.md`: `## Shoroku candidates` → `## Shoroku
proposal`, its bullet unchanged.

### 7.5 `templates/kanri.md` and `templates/shoroku-brief.md`

`templates/kanri.md`: `## Shoroku candidates` → `## Shoroku proposal items`;
in its paragraph, `the file the candidate lives in` → `the file the item
lives in`, `Candidate, one line;` → `Item, one line;`, `until the first
candidate arrives` → `until the first item arrives`; the header row's
`Candidate` → `Item`, and the placeholder `(no candidate yet)` → `(no item
yet)`. `templates/shoroku-brief.md`: its four `<the candidate in one
sentence>` slots → `<the item in one sentence>`.

### 7.6 The template sentences the spec review found

`templates/roster.md`, the keeping rule's last bullet:

```text
- Kanri dispatches nothing to a session that has no accepted row here.
```

→

```text
- Kanri sends only to `live` rows, and dispatches nothing to a session that
  has no accepted row here.
```

`templates/roster.md`, the Topic sentence — the same words as `SKILL.md`'s
(2.2):

```text
Topic is the topic word Kanri's orders line gave that session, or `—` for
Kanri, Kikaku, Hosa, and a standalone Kaiseki. Effort is what the handshake's
`effort=` carried.
```

→

```text
Topic is the topic word Kanri's orders line gave that session — for a Jisso,
the topic whose queue its handshake joined: the plan whose batches are in
flight, or, with none in flight, the plan whose landing requested the queue
— or `—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Effort is what
the handshake's `effort=` carried.
```

`templates/roster.md`, the Residency paragraph's blank case:

```text
every place a reading lands. Kikaku sends no reading and its reading columns
stay blank: it is the human's own seat, and its cost is the human's own
pacing. The last three columns are Kanri's only — batches accepted,
```

→

```text
every place a reading lands. Kikaku sends no reading and its reading columns
stay blank: it is the human's own seat, and its cost is the human's own
pacing. A queued Jisso's stay blank until its boundary, and a queued row
that never ran moves to the archive with its blanks. The last three columns
are Kanri's only — batches accepted,
```

`templates/roster.md`, the between-plans paragraph of the items table:

```text
Between plans there is no conductor ledger, so a candidate raised by a
between-plans triage, or by Kanri's own between-plans exit, is recorded here
with the same seven columns the ledger uses. When a topic opens, Kanri moves
the rows whose Written column says `no` into the new ledger's table and leaves
the written ones here as the record.
```

→

```text
Between plans there is no conductor ledger, so an item raised then — by a
between-plans triage or a Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's `-2-proposal.md` — is recorded here with
the same seven columns the ledger uses. When a topic opens, Kanri moves the
rows into the new ledger's table; nothing is written out from this table
itself, so every row here says `no` until it moves.
```

`templates/roster-archive.md`, the two status enumerations:

```text
Kanri is the only writer, and writes it at a plan close: the roster rows whose
status is `dead`, `replaced`, or `refused`, each with its last Residency
```

→

```text
Kanri is the only writer, and writes it at a plan close: the roster rows whose
status is `dead`, `replaced`, `refused`, or `cleared` — a `queued` row that
never ran moving as `cleared` — each with its last Residency
```

```text
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, or refused> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |
```

→

```text
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, refused, or cleared> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |
```

`templates/kanri.md`, the Progress line's deferral clauses:

```text
clause `handover deferred (absent, context=<n>, since <batch X | the spec
stage | the plan stage>)` or
`Jisso replacement deferred (absent, context=<n>, since batch <X>)`, kept
until that handover or replacement runs or the plan closes; or, once a
```

→

```text
clause `handover deferred (absent, context=<n>, since <batch X | the spec
stage | the plan stage>)`, kept
until that handover runs or the plan closes; or, once a
```

`templates/kanri.md`, the Session events placeholder:

```text
- <YYYY-MM-DD HH:MM> — <a create, replace, or delete request and the human's
```

→

```text
- <YYYY-MM-DD HH:MM> — <a create request and the human's answer, a `release:`
  sent, a `queued: <n>` answered, a `no-role` received; a replace and the human's
```

`templates/kanri.md`, the Measurements table's fifth and sixth rows:

```text
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's and Jisso's at each boundary, with the delta per batch | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch letter: kanri context=<n> (+<d>), jisso context=<n> (+<d>)>, one entry per check |
| deferrals: where, the role, the context, and the presence verdict | <YYYY-MM-DD, the check> | <batch letter or stage, kanri or jisso, context=<n>, last human turn <m> min ago>, one entry per deferral, or `none` |
```

→

```text
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's at each boundary with the delta per batch, and each Jisso's at its own boundary | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch letter: kanri context=<n> (+<d>), jisso <name> context=<n>>, one entry per check |
| deferrals: where, the context, and the presence verdict | <YYYY-MM-DD, the check> | <batch letter or stage, context=<n>, last human turn <m> min ago>, one entry per deferred handover, or `none` |
```

and, in the paragraph below the table:

```text
readings of loop step 6; the sixth at any deferral, in whichever stage, and
carries `none` when a plan's Kanri and Jisso never deferred; the seventh at
```

→

```text
readings of loop step 6; the sixth at any deferred handover, in whichever
stage, and carries `none` when a plan's Kanri never deferred; the seventh at
```

`templates/shoroku-brief.md`, the four sites that name Kanri's between-plans
lane:

```text
# Shoroku check brief — <topic or Kanri's name>
```

→

```text
# Shoroku check brief — <topic>
```

```text
recommendation, at `.tanto/<topic>/t2-brief.md`, or
`.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` for Kanri's between-plans
exit, beside the recommendation and untracked under `.tanto/.gitignore`.
```

→

```text
recommendation, at `.tanto/<topic>/t2-brief.md`, beside the recommendation
and untracked under `.tanto/.gitignore`.
```

```text
Document: <the recommendation's path> — t2, or the Kanri exit's own
stage word — written <YYYY-MM-DD> on <model family> for the chat language
```

→

```text
Document: <the recommendation's path> — t2 — written <YYYY-MM-DD> on
<model family> for the chat language
```

```text
What you answer is what Kanri writes into `t2-direction.md`, or the Kanri
exit's own `-direction.md`, item by item; the apply reads that file and the
```

→

```text
What you answer is what Kanri writes into `t2-direction.md`, item by item;
the apply reads that file and the
```

`templates/batch-prompt.md`, the `no-role` line after the title — inserted
after the title line 7.2 gives, so that the prompt file is the message:

```text
# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan
```

→

```text
# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan

(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
```

`templates/kanri-handover.md`, the delegated-close line (the post-merge
text, `shoroku-at-close` P6.5):

```text
- A close delegated to Hosa — <`<topic>` or `kanri`, Hosa's `<name> [<ref>]`,
  the `close:` line's paths and subject, and whether `close done:` has
  arrived, or "none">; the successor verifies the commit on `close done:`
  and fills the ledger, or the roster for a Kanri exit
```

→

```text
- A close delegated to Hosa — <`<topic>`, Hosa's `<name> [<ref>]`, the
  `close:` line's paths and subject, and whether `close done:` has arrived,
  or "none">; the successor verifies the commit on `close done:` and fills
  the ledger
```

## 8. The READMEs, the consistency note, and the documents the plan writes

### 8.1 `skills/tanto/README.md` and `skills/shoroku/README.md`

Per `AGENTS.md`, each README is reviewed for drift after its `SKILL.md`
changes. `skills/tanto/README.md`'s passages on the roles table, the exit
shoroku, the roster's statuses, and Jisso's lifecycle follow 2.1, 2.2, and
2.5; the plan quotes the old lines from the merged tree, since
`shoroku-at-close`'s Task 9 rewrote that README first (its commit
`docs(tanto): the READMEs say the docs are filled once per topic, at its
close`). Four sentences of it this design contradicts beyond that
rewrite, at the lines of the tree the review read: L11-12, "The human
creates and deletes sessions; Kanri is the only role that asks" — the human
gives and takes a window's role, and Kanri asks with a create request or a
`release:` line; L27-32, "Holds **Kanri** and **Jisso** under a context
ceiling ... and hands the one over or replaces the other" — Kanri only, and
Jisso rotates; L96-97, "Every lifecycle role after Kanri is created when
Kanri asks the human for it" — the plan's Jissos are queued at its landing,
in one request; L122-125, "after an editor restart or a closed tab" — a
closed tab is the exception now, and a `/clear` keeps the name. The drift
review writes each as the README's own prose. `skills/shoroku/SKILL.md` is
not edited (fixed input 7 keeps its own vocabulary), so its README is
reviewed and expected unchanged.

### 8.2 `docs/notes/tanto-consistency-checks.md`

The note's check 6 greps that pin the renamed strings change with them:
`grep -c '^## Shoroku candidates$' skills/tanto/templates/roster.md` →
`grep -c '^## Shoroku proposal items$' …`; the two
`grep -cF '| S-n | Source | Candidate | Destination | Adopted | Stage | Written |'`
lines → `| S-n | Source | Item | Destination | Adopted | Stage | Written |`;
and those expected counts stay. Two counts move: `grep -cF 'exit-<role>'
skills/tanto/SKILL.md` prints `2` after 2.5 (the new "Session exit" names
the pattern twice), where the note expects `5` and the tree before this
plan prints `4` — that earlier drift is `shoroku-at-close`'s Task 10 to
settle, and this plan writes the number its own text yields; the same grep
on `roles/kanri.md` stays `3`. Check 6's route list gains the new lines —
`queued: <n>`, `release: /clear this window`, and `no-role` — each pinned
by its full string in `SKILL.md` and in the role file that sends or answers
it, and the `no-role` line's fixed text pinned in `SKILL.md` and
`templates/batch-prompt.md`, the two files that carry it. The two review
report headings (`**Shoroku proposal** section`, in `roles/sekkei.md` and
`roles/keikaku.md`, 5.4) are added to check 6 by their full strings: they
are a contract with two subagent kinds, which no check pins today. Check 7
(the strings that must be absent) gains `exit-jisso`, `docs: exit shoroku`,
`Shoroku candidates`, `orders: plan=`, `delete request`,
`ask the human to delete`, `asks for your deletion`, `your deletion follows`,
`Replace symptom`, and `Jisso replacement deferred`, each at `0` across
`skills/tanto/SKILL.md`, `skills/tanto/roles/`, and `skills/tanto/templates/`
— the three places check 7 already sweeps, never the scripts, whose tests
carry old strings as fixtures. A new check, 25, records the old-value sweep
this plan runs (section 10) over those same three places, as check 24
records `shoroku-at-close`'s.

### 8.3 Documents the plan writes under `docs/`

Written by the plan's tasks, never by this Sekkei:

- `docs/notes/claude-code-sessions-observed.md` gains one section on what
  `/clear` keeps and resets — the name and `[ref]`, the model, the effort
  reset, the message delivered to a bare window — with the transcript ids
  and the date from "Measured while designing" 3 and 4, and the unmeasured
  cases named as such.
- `docs/issues/open/0239-…` closes: no `exit-jisso-<X>` file exists to
  collide. `docs/issues/open/f293-…` closes when its three sites are
  written — the closing line, Kanri's released line carrying its second
  part, one clock per clause.
- `docs/reports/2026-09-17-seat-lineage-dogfood.md`, the dogfood report,
  as every tanto plan writes one: the sweep's counts, the fresh-start
  check's result, and the measurements section 10 names.

## 9. Sites that depend on `shoroku-at-close`'s plan

R-2: `shoroku-at-close` holds the checkout and rewrites, in its batches B to
D, sites this spec also touches. The plan's author re-quotes every old
text below from the merged tree; the rest of this spec's old texts were
read from the working tree after that plan's batch A and its Task 4 and 5
commits, and before its Task 6 commit.

| This spec's site | `shoroku-at-close` block that writes it first |
| --- | --- |
| 3.7 Handover step 1 | P6.3 |
| 3.7 the handover file's Live peers sentence | P6.2 |
| 3.9 the Release table's Sekkei, Keikaku, Kaiseki, Jisso, and plan-closed rows | P6.6 to P6.10 |
| 7.3 Not reconstructed | P6.4 |
| 7.6 the delegated-close line | P6.5 |
| 5.1 and 5.4 `roles/sekkei.md`'s exit bullet and idle sentence | P7.5, P7.3 |
| 5.2 and 5.4 `roles/keikaku.md`'s exit bullet and idle sentence | P7.9, P7.8 |
| 4.5 the Propose paragraph's last sentence | P8.1 |
| 6.1 `roles/hosa.md`'s "The close's.", "Not yours", "Models" | P8.4 to P8.6 |
| 8.1 `skills/tanto/README.md` | Task 9 |
| 8.2 the consistency note's check 24 | Task 10 |

Two named mechanisms `shoroku-at-close` fixes are inherited unchanged and
pinned by its check 24: the `close:` line, byte for byte across `SKILL.md`,
`roles/kanri.md`, and `roles/hosa.md`, and the `T2:` line. This spec removes
the words around the `close:` line that name a `kanri` topic (3.8, 6.1) and
touches neither line's bytes.

## 10. The boundary, the batch cut, and rule 11

This plan edits the skill's own files, so rule 11 applies: the run's
sessions follow the plan's Global Constraints, Kanri's orders line, and the
batch prompts rather than the role text on disk, and Kanri records that as
`R-n` at the landing. Two consequences are this plan's own.

**The plan runs on the old lifecycle.** Its Jisso is one session created
at the landing by today's create request, carrying every batch; its exits
are deletions, as the pre-plan text says; the queue, `release:`, and the
`no-role` line take effect from the first plan that lands after this one. The Global
Constraints say so in one paragraph, so that a Jisso reading a half-edited
`roles/jisso.md` mid-plan does not wait for a `release:` no Kanri sends.

**The safe boundary is the final one.** No role is started or replaced
before the last batch is accepted, since every role file changes; the
final boundary's checks include the fresh-start check: the human `/clear`s
a window that was started before this plan's definitions and template edits
and runs `/tanto` in it, and its start line says whether the permission mode
survived (the handshake's `mode=`) and whether the definitions are current
(`agents: 13 current`), which closes "Measured while designing" 5.

**The batch cut** the plan should follow, four batches by the kind of
inconsistency each leaves if interrupted:

- **A** — `SKILL.md` whole (2.1 to 2.7): the contract says queue, release,
  `no-role` line, and the names, and nothing else does yet; the note's check 7
  sweep must not run until D.
- **B** — `roles/kanri.md` (3.1 to 3.9) and its templates
  (`templates/roster.md`, `templates/kanri-handover.md`, `templates/kanri.md`).
- **C** — the other role files (4, 5, 6) and the remaining templates
  (`templates/batch-prompt.md`, `templates/batch-report.md`,
  `templates/kaiseki-report.md`, `templates/shoroku-brief.md`).
- **D** — the READMEs' drift review, the consistency note, the whole-tree
  sweep of "Old values this plan contradicts", the sessions note, the two
  issue closes, and the dogfood report.

Each batch is verified as `shoroku-at-close`'s are: one `verify --task <N>`
per task, `diff --base` clean, lint on the changed paths named individually,
`node --test skills/tanto/scripts/` passing, and the `close:` line's grep
printing `1` on each of its three files.

## Where each change lives

| File | Sections |
| --- | --- |
| `skills/tanto/SKILL.md` | 2.1 to 2.8 |
| `skills/tanto/roles/kanri.md` | 3.1 to 3.10 |
| `skills/tanto/roles/jisso.md` | 4.1 to 4.5 |
| `skills/tanto/roles/sekkei.md` | 5.1, 5.4 |
| `skills/tanto/roles/keikaku.md` | 5.2, 5.4 |
| `skills/tanto/roles/kaiseki.md` | 5.3, 5.4 |
| `skills/tanto/roles/hosa.md` | 6.1 |
| `skills/tanto/roles/kikaku.md` | 6.2, 6.3 |
| `skills/tanto/templates/roster.md` | 7.1, 7.6 |
| `skills/tanto/templates/roster-archive.md` | 7.6 |
| `skills/tanto/templates/batch-prompt.md` | 7.2, 7.6 |
| `skills/tanto/templates/kanri-handover.md` | 7.3, 7.6 |
| `skills/tanto/templates/batch-report.md`, `templates/kaiseki-report.md` | 7.4 |
| `skills/tanto/templates/kanri.md`, `templates/shoroku-brief.md` | 7.5, 7.6 |
| `skills/tanto/README.md`, `skills/shoroku/README.md` | 8.1 |
| `docs/notes/tanto-consistency-checks.md` | 8.2 |
| `docs/notes/claude-code-sessions-observed.md`, `docs/issues/open/0239-…`, `docs/issues/open/f293-…`, `docs/reports/2026-09-17-seat-lineage-dogfood.md` | 8.3 |

Not touched: `scripts/reading.js` and `scripts/passage-check.js` with their
tests (`ceiling.jisso` stays in `templates/tanto.json` and the script; its
verdict acts on nothing, Deferred 2); `templates/tanto.json`;
`templates/agent.md`; `templates/kikaku-decision.md`; `templates/bug-report.md`
(the `no-role` line is the message's second line, not the file's);
`templates/kaiseki-brief.md`; `templates/review-brief.md`;
`skills/shoroku/SKILL.md`.

## Old values this plan contradicts

Strings the sweep of batch D counts to `0` across `skills/tanto/SKILL.md`,
`skills/tanto/roles/`, and `skills/tanto/templates/` — never the scripts,
whose tests carry old strings as fixtures — unless a section above keeps
one, each with where it lives today:

| String | Where | Goes at |
| --- | --- | --- |
| `orders: plan=` | `roles/kanri.md` 3.2 | 3.2 |
| `lifecycle requests` | `SKILL.md` roles table | 2.1 |
| `the last for a Kikaku or Hosa row that a re-handshake` | `SKILL.md` | 2.2 |
| `exit-jisso` | `SKILL.md` "Session exit"; `roles/jisso.md` | 2.5, 4.3 |
| `docs: exit shoroku` | `SKILL.md`; `roles/kanri.md` | 2.5, 3.8 |
| `exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md`, `-brief.md`, `-direction.md`, and the words `the Kanri exit's own` | `SKILL.md` "Session exit" and Artifacts; `roles/kanri.md` "Shoroku" and "Handover"; `templates/shoroku-brief.md` | 2.5, 2.6, 3.7, 3.8, 7.6 |
| `for Kanri's own between-plans exit`, `for your own between-plans exit`, and the word `kanri` used as a `close:` line's topic | `roles/hosa.md` (P8.4); `roles/kanri.md`; `SKILL.md`; `templates/kanri-handover.md` (P6.5); `templates/shoroku-brief.md` | 6.1, 3.8, 2.5, 7.6 |
| `ask the human to delete`, `delete request`, `to delete the old session`, `the deletion may lag`, `asks for your deletion`, `your deletion follows`, `no deletion waiting`, `should be deleted`, `Delete row`, `create or delete`, `not deleted yet`, `The human creates and deletes` | `SKILL.md`; `roles/kanri.md`; `roles/jisso.md` (P8.1); `roles/sekkei.md` (P7.3, P7.5); `roles/keikaku.md` (P7.8, P7.9); `roles/kaiseki.md`; `roles/kikaku.md`; `templates/kanri.md`; `README.md` | 2.5, 3.1, 3.8, 3.9, 3.10, 4.5, 5.1 to 5.4, 6.3, 7.6, 8.1 |
| `delete and create` | `roles/kanri.md` Replace table | 3.9 |
| `Jisso replacement deferred`, `Your replacement is deferred`, `a Jisso replacement stands deferred` | `roles/kanri.md` loop step 6, Replace table, and the handover file; `templates/batch-prompt.md`; `templates/kanri-handover.md`; `templates/kanri.md` | 3.4, 3.9, 3.10, 7.2, 7.3, 7.6 |
| `on Jisso's is a Replace symptom`, `Replace symptom on Kanri's side`, `the ceiling replaces`, `Kanri and Jisso are the only seats`, `line decides a replacement`, `a planned replacement` | `roles/kanri.md` loop step 6 and Readings; `roles/jisso.md`; `SKILL.md` config section; `roles/kaiseki.md`; `roles/keikaku.md` Step 3; `README.md` | 3.4, 3.10, 4.5, 2.8, 5.4, 8.1 |
| `Jisso has carried the batches the plan expects of one session` | `roles/kanri.md` Replace table | 3.9 |
| `Open a new session in <repo path>`, `lifecycle request` | `roles/kanri.md`; `templates/kanri-handover.md`; `SKILL.md` Invocation | 3.9, 7.3, 2.8 |
| `When the new Kanri asks, delete this session.` | `templates/kanri-handover.md` | 7.3 |
| `1. **Candidates.**` | `SKILL.md`; `roles/kanri.md` | 2.5, 3.8 |
| `## Shoroku candidates`, `**Shoroku candidates** section` | four templates; `roles/kanri.md` "The final batch"; `roles/sekkei.md` and `roles/keikaku.md` Step 2; `roles/kaiseki.md` | 7.1, 7.4, 7.5, 3.5, 5.3, 5.4 |
| `Shoroku candidates from this spec work` | `SKILL.md`; `roles/kanri.md`; `roles/sekkei.md` | 2.5, 3.3, 3.8, 5.1 |
| `\| Candidate \|`, `(no candidate yet)` | `templates/kanri.md`, `templates/roster.md` | 7.1, 7.5 |
| `candidate`, `candidates` (prose) | every file of Measured 6 | the sweep, D |
| `Dispatch nothing to a session that has no accepted roster row.`, `every listed peer`, `every live peer whose name` | `roles/kanri.md` On a handshake and Start; `SKILL.md` Resuming | 3.2, 3.10, 2.8 |
| `the peers' deletion` | `roles/kanri.md` "The trigger" | 3.10 |
| `<dead, replaced, or refused>`, and the first paragraph's enumeration `dead`, `replaced`, or `refused`, matched as it reads in the file | `templates/roster-archive.md` | 7.6 |
| `kanri or jisso`, `Kanri and Jisso never deferred`, `jisso context=<n> (+<d>)` | `templates/kanri.md` Measurements | 7.6 |
| the Resuming bullet's words status `live`, no `dead` row, matched as they read in the file | `SKILL.md` Resuming | 2.8 |
| `only Kanri messages Jisso` | kept — rule 1 stands | — |
| `Sekkei, Keikaku, or Jisso started with no address` | kept | — |

## Requirements

Recorded at this topic's close as `S-n` rows pointing here. The three T0
bullets already in req-04f5 — a seat's last words, the sessions opened while
the human is present, a replacement that never waits on a review — are the
needs this spec serves; the design adds two:

1. **A run's windows are reused, not multiplied.** A session that has
   finished is released to be `/clear`ed and given its next role by the
   human, never closed, and the run's lines reach only the windows the
   roster says hold a role, so that a bare window is never asked to act.
2. **A seat that waits holds the minimum context.** A queued session reads
   nothing until the work that names it arrives, and is sent nothing before
   that, so that a broadcast to the run's windows costs the waiting ones
   nothing.

## The ADRs

Each decided here, with the alternative it rejects and, where an accepted
record says otherwise, the record it amends — so that the close's recommender
writes the `amends:` links `docs/decisions/AGENTS.md` asks for; recorded as
`S-n` rows pointing at this section.

1. **Rows carry a seat's lineage; no proposal file rolls** (Q1 = (b), Q2 =
   (A)). Rejected: an append per Jisso boundary to `shoroku-proposal.md` —
   the same session would write the same items twice, once in its report,
   with a form check per block; a rolling Kanri file renamed at the close —
   a rename step and a block form for a lineage the `pending` rows already
   hold.
2. **A retiring Jisso's exit shoroku is its report's Shoroku proposal
   section** (Q1 = (b)). Rejected, for now: dropping the T2 proposal too
   and naming the SDD ledger as a source (Q1's (c)) — it changes the `close:`
   line's `proposal <path>` slot, pinned byte for byte in three files that
   `shoroku-at-close` is landing; Deferred 1.
3. **Kanri's proposal is written at every plan close, before the
   recommender; there is no between-plans write-out** (Q2 = (A)). Rejected:
   the `shoroku-at-close` between-plans lane — a second human check per
   close, against S-1. Amends decision-b6cb: its "the peers' deletion" and
   "deletes the old session" become releases, and its "one session creation
   and one deletion per plan" becomes one create request at the landing and
   one `release:` per seat.
4. **One fresh Jisso per batch, from a queue of N = batches + 1 filled at
   the landing; fixed rotation; the queue is the spare for a Jisso gone
   mid-batch** (the decision file §2; Q3 = (i)). Rejected: a Jisso standby
   (a detection mode at the boundary); a ceiling-governed rotation (keeps
   the boundary decision); a create request for a gone Jisso (waits on the
   human where the queue need not). Amends decision-6dea, whose "one
   compaction in Jisso's reading means replacement at the next batch
   boundary" no longer has a case — every Jisso is replaced at its boundary;
   decision-eee2, whose "Kanri and Jisso are its subjects" becomes Kanri
   alone, Jisso's line measured and kept (Deferred 2); and decision-f496,
   whose "Jisso within a plan" reuse note ends — a Jisso is reused across
   nothing.
5. **A queued Jisso reads nothing and is sent nothing until its batch
   prompt; Kanri sends only to `live` rows** (the decision file §2, the
   human's reason; I-1 §4). Rejected: a pre-read plan (paid again at every
   broadcast), and a `kanri-address:` broadcast to queued rows (the prompt
   names Kanri).
6. **Retired Jissos are released at their boundary, not at the close's
   list** (I-1 §2 over the decision file §2). Rejected: the close's deletion
   list — with windows reused, a released window is the queue's next seat,
   and nothing is gained by holding it.
7. **`release:` follows the form check directly, at every seat** (I-1 §2,
   read against the landed text; Measured 2). Rejected: the recommender
   before `release:` — nothing runs at an exit that a session could be
   asked back for.
8. **The `no-role` line is the second line of every tanto line** (I-1 §3, its "guard").
   Rejected: a rule in the personal `CLAUDE.md`, the repository
   `AGENTS.md`, or both (the human declined all three; it cannot ride to
   other repositories); no second line, with a human promise (one forgotten word
   leaves a bare window running a batch).
9. **The clear rule is every role's; `dead` stays for the unlisted** (I-1
   §5, §8). Rejected: `cleared` limited to Kikaku and Hosa. Amends
   decision-d831 and decision-ce83 where they say a session is "deleted"
   once its proposal is on disk: it is released, and the window is kept.
10. **The names are Propose / Recommend / Check / Apply, "Shoroku proposal"
    for a seat's section, "Shoroku proposal items" for the two tables, and
    the whole skill is swept** (the decision file §3; Q1's rider). Rejected:
    renaming the step only and leaving the headings — two words for one
    thing across the files a `sections` call reads by heading.
11. **The closing line is two facts and a negative rule, rendered in the
    chat's language from an English form** (the closing-line file §1).
    Rejected there: `削除可: 今` with a `失うもの: なし` clause — a seat's
    opinion of its own necessity, which R-6 of `shoroku-at-close` showed to
    be worth little.

## What the plan must contain

- Every old text re-quoted from the merged tree, section 9's sites in
  particular, and every new text as this spec gives it; a section replaced
  whole quoted from heading to heading.
- The Global Constraints paragraph of section 10: this plan runs on the old
  lifecycle, and the safe boundary is the final one.
- The four batches of section 10, with batch D's sweep over "Old values
  this plan contradicts" and the note's new check 25.
- The fresh-start check at the final boundary, human-run, with what its
  start line must say.
- The `close:` line grep on three files at every batch boundary, unchanged
  from `shoroku-at-close`'s.
- The dogfood report's Measurements: the run's Residency rows and, since
  this plan runs on the old lifecycle, the note that the queue's own
  figures come from the first plan after it.

## Verification

- `grep -c 'exit-jisso' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md` — `0` on every file.
- `grep -c 'docs: exit shoroku' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md` — `0` on each; `grep -c 'docs: T2 shoroku' skills/tanto/SKILL.md skills/tanto/roles/kanri.md` — `1` and `1`.
- `grep -c 'Shoroku candidates' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md skills/tanto/README.md` — `0` on every file (the scripts' tests keep the string as a fixture and are not swept); `grep -c '^## Shoroku proposal items$' skills/tanto/templates/roster.md skills/tanto/templates/kanri.md` — `1` and `1`; `grep -c '^## Shoroku proposal$' skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-report.md` — `1` and `1`.
- `grep -ci 'candidate' skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md skills/tanto/README.md` — `0` on every file.
- `grep -cF 'Jisso replacement deferred' skills/tanto/templates/kanri.md` — `0`; `grep -c '<dead, replaced, refused, or cleared>' skills/tanto/templates/roster-archive.md` — `1`; `grep -cF 'the Kanri exit' skills/tanto/templates/shoroku-brief.md` — `0`.
- `grep -cF 'asks for your deletion' skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md` — `0` on each; `grep -cF 'your deletion follows' skills/tanto/roles/jisso.md` — `0`; `grep -cF 'Replace symptom' skills/tanto/roles/jisso.md skills/tanto/roles/kanri.md` — `0` on each; `grep -cF '**Shoroku proposal** section' skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md` — `1` on each (per section 8.2, only these two files carry the bold pin; `roles/kanri.md` reads the same section by its bare heading via `sections` and carries no pin of its own).
- `grep -cF 'queued: <n>' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md` — at least `1` on each; `grep -cF 'release: /clear this window' skills/tanto/SKILL.md skills/tanto/roles/kanri.md` — at least `1` on each, and `1` or more on each of `roles/sekkei.md`, `roles/keikaku.md`, `roles/kaiseki.md`, `roles/jisso.md`; the `no-role` line's fixed text, `grep -cF '(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)' skills/tanto/SKILL.md skills/tanto/templates/batch-prompt.md` — `1` on each, and the fixed text lives in no other file.
- `grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md` — `1` on each.
- `grep -c '^### Release$' skills/tanto/roles/kanri.md` — `1`; `grep -c '^### Delete$'` — `0`.
- `grep -cF 'Jisso replacement deferred' skills/tanto/roles/kanri.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/kanri-handover.md` — `0` on each.
- `mise x node@22 -- node --test skills/tanto/scripts/` — passes, unchanged.
- The consistency note's check 6 and check 7 re-run with the new lines and their expected counts, output recorded in the dogfood report.
- The fresh-start check: a `/clear`ed window's `/tanto` start line reports `mode=auto` in its handshake and `agents: 13 current`; recorded in the dogfood report and the sessions note.
- The first plan after this one: its Jissos' Residency rows show `context=` within one batch of each seat's own first turn; its Kanri handovers show no human check between the handover file and the successor's start; the human's `/clear` count per plan equals the sessions the plan used. Recorded in that plan's dogfood report.

## Out of scope

- The Kanri standby (issue-eb47) and its revisit trigger.
- `tanto-diet`'s content — what a wake-up costs.
- The presence-gate issues (1a9a, caba, 8312), which keep their own numbers.
- `scripts/reading.js`'s `ceiling.jisso` and the Jisso ceiling line's future
  (Deferred 2).
- The T2 proposal's removal (Deferred 1).
- `skills/shoroku/SKILL.md`'s vocabulary.
- Any change to `/clear` itself, or a measurement of the editor slowdown the
  human observed.

## Issues this design closes

- issue-0239 — the exit-file collision at the same batch letter: no
  `exit-jisso-<X>` file exists.
- issue-f293 — a seat's turn-ending text is ungoverned, three sites: the
  closing line (2.4 and every role file), Kanri's released line carrying its
  second part (3.9), one clock per clause (3.9).

## Answers to the spec inputs

- **I-1** — adopted whole (fixed input 8), with one reading against the
  landed text: `release:` follows the form check directly, since the
  question-back it was kept behind no longer exists (Measured 2); §10's
  measurements are Measured 3 to 5 and the fresh-start check; §6's "harmless
  if `/clear` keeps them" is answered — `/effort` is reset, so line 3 of the
  create request is required in a reused window.

## Deferred items

1. **Drop the T2 proposal and name the SDD ledger as a source** (Q1's (c)).
   With one Jisso per batch, the last Jisso's context is one batch, and the
   "delta no file holds" it writes at T2 is the fix wave's own; the pointer
   list is bookkeeping Kanri's dispatch already carries. Left for a plan
   after this one, because the `close:` line's `proposal <path>` slot is
   pinned byte for byte across three files `shoroku-at-close` is landing.
2. **Whether `ceiling.jisso` earns its keep.** The rotation makes its
   verdict act on nothing; the line stays as a measurement. If the archive's
   Jisso rows show every seat under its own ceiling for two plans, the
   config key and the `--role jisso` line can go.
3. **A line enqueued before a `/clear`, on a busy receiver.** Unobserved
   (Measured 4); the `no-role` line makes either outcome safe. Worth one measurement
   when a Jisso is cleared mid-turn by accident.
4. **A queued window's own idle cost.** N windows idle for hours; nothing
   here measures what the editor pays for them. The human's observation
   was of open/close cycles, not of open windows.

## The reviews this spec has had, and what each found

One so far: the `spec.review` seat (fable), `.tanto/seat-lineage/spec-review.md`,
over the draft at `git hash-object` `d29342de…`, read against `docs/decisions/`,
`docs/requirements/` (the T0 bullets read from `main`, since the branch
checkout lacked `02fa460`), and every file of "Where each change lives" as
the tree stood at `7edd51d`. Twenty-eight findings; every old text the
draft quoted matched the tree. The Sekkei's rulings:

- **1 (scope)** — the ADRs named no accepted record they amend. Put to the
  human with the review gate; the Amends clauses are written into "The
  ADRs" (b6cb, 6dea, eee2, f496, d831/ce83) on the reading that each
  follows from a decision the human already made, and the human's answer
  to the brief confirms or corrects that reading.
- **2 to 8 (high)** — seven sentences the design contradicts that no
  passage covered: `roles/kanri.md`'s handshake step 2 (now 3.2's first
  passage), `roles/jisso.md`'s final-batch sentence, its Propose
  paragraph's last sentence, and its ceiling sentence (4.5),
  `templates/shoroku-brief.md`'s four between-plans sites,
  `templates/kanri.md`'s Progress clause, and `templates/kanri-handover.md`'s
  delegated-close line (7.6). All accepted as passages.
- **9 to 25 (medium)** — all accepted: the second deletion sentences of
  `roles/sekkei.md` and `roles/keikaku.md` and the review-report headings
  (5.4); `roles/kanri.md`'s opening paragraph, its two "listed peer"
  broadcasts, the trigger's "peers' deletion", the handover file's Jisso
  deferral, Readings, and Recovery (3.10); `SKILL.md`'s Resuming status and
  broadcast, and the two ceiling sentences with `roles/kaiseki.md`'s (2.8,
  5.4); a queued row's Topic and the two-plans rule (2.2, 7.6); the
  between-plans intake sentence restored in 3.8 and the roster's paragraph
  (7.6); `templates/roster-archive.md` (7.6, now in scope);
  `templates/kanri.md`'s Measurements rows (7.6); the greps and the sweep
  scoped to the three swept places (Verification, Old values, 8.2); the
  `exit-<role>` count and the `no-role` line's two files (8.2); 3.7 step 1
  opened with the plan-close condition and the Why claim dropped; the
  `no-role` line's place in a multi-line message (2.4) and its insertion in
  the batch prompt (7.6); `roles/keikaku.md`'s sizing sentence (5.4).
- **26 to 28 (low)** — all accepted: the garbled sentence, the residual
  "guard", the 5.1 misquote, the scattered deletion words (3.10, 6.3, 7.6,
  2.8), the four README sentences (8.1), the queued Residency rule and the
  roster's last keeping bullet (7.6).

The review's five Shoroku candidates are Kanri's to record; the fourth —
six of the missed sentences were twins of a sentence the draft did rewrite
in another file — is the lesson this section keeps: a change list is built
from the mechanism, not the file.

The human's check, on the brief `.tanto/seat-lineage/review-brief-spec.md`
(27 points, no choose or decide point): `all OK` on 2026-09-17 — every
confirm point confirmed, the five Amends clauses included, no edit asked
for. The spec was accepted at hash `14d2b59d…` plus this paragraph.

## Amendments

`.tanto/kikaku/2026-09-17-idle-block-and-hosa-compact.md` (R-6, ruled in
`seat-lineage/kanri.md`), sections 1, 2, and 4, verbatim:

### 1. Kanri's idle block

Every turn of Kanri's ends with the block, after whatever else the turn
said. Without requests:

```text
---
shoroku-at-close: batch D in flight — Jisso dotskills-66 → whole-branch review, T2 close
seat-lineage: plan drafting — Keikaku dotskills-f0 → review-ready
for you: none
```

With requests open:

```text
---
shoroku-at-close: batch D landed, verified → Jisso's exit shoroku next
seat-lineage: plan drafting — Keikaku dotskills-f0 → review-ready
for you:
1. shoroku-at-close — delete Jisso dotskills-66 (exit proposal recorded)
2. — /clear dotskills-1c (Kikaku, idle since 13:05)
```

The four rules:

1. **At the end of every turn, fixed.** It opens with a `---` line so
   the eye finds it. "Every turn" is the human's 必ず: not only when
   something changed.
2. **Topic lines: at most three, the most recently active first.** A
   closed topic leaves the block at its close. One line each:
   `<topic>: <state> — <seat name | no seat> → <what comes next, and whom it waits on>`.
3. **`for you:` is `none` or a numbered list.** One item per act the
   human has been asked for and has not done, `<topic | —> — <the act>`,
   `—` for an act that belongs to no topic: the `/clear` of an idle
   Kikaku or Hosa window, Kanri's own handover, a quota's return, a
   Kaiseki's release after its exit shoroku, an answer Kanri waits on. An
   item is a **pointer** to the request already made — the request's own
   text stays where it was made, and a recap is never the ruling text.
   The human's "A" — the seats that would move on one act of theirs — is
   this list read from the seat's side: such a seat always has one item
   here, and its topic line's `→` names it as the one waited on.
4. **Drawn from files, never from memory** (rule 3 of the contract):
   the roster's Status column — `idle since <HH:MM>` for a Kikaku, Hosa,
   or Kaiseki that has reported and gone idle, as the loop already
   writes — and each open ledger's `## Open questions for the human`,
   which from now on holds every open act asked of the human, one line
   each, added when the request is made and removed when it is done. A
   successor Kanri prints the same block from the same files.

What it costs: some 60 to 150 output tokens per Kanri turn, against a
per-batch figure in the tens of thousands; and one ledger line per
request. What it replaces: the paragraph in the batch loop that ends
"your next line to the human" with `— /clear <name>'s window` or the
Kaiseki's release reminder — those become `for you` items, with the same
`idle since` note as their source.

### 2. A Hosa is `/compact`ed at will, between jobs

Yes, because almost nothing a Hosa holds is anywhere but on disk or in
one line: Kanri's address is the roster's first row, the chores grant is
one line of Kanri's handshake answer, and the close's three steps leave
the recommendation, the brief, and the direction on disk. `/compact`
keeps the session id, the transcript, and so the roster row — no
re-handshake, no Kanri wake-up, which is what a `/clear` costs. Three
conditions:

1. **Between jobs.** Not with a `chore:` Hosa took still open, not with a
   `slot-needed:` unanswered, not inside a `close:` before its
   `close done:` or `close blocked:` — the one thing a summary can lose
   that no file holds is the job in hand's own instruction (its paths,
   its subject).
2. **The confirmation happens in Hosa's own window.** The contract's
   compaction rule sends `compacted: <path>` to Kanri and waits for
   `confirmed:`; for a Hosa the items a summary attributes to the human
   are chores the human handed over under the standing grant, which Kanri
   never saw and cannot confirm. So the Hosa does what a standalone
   Kaiseki does: before its next job it lists, in its window, every item
   the summary attributes to the human, and the human confirms or
   corrects each there. Nothing goes to Kanri: the compaction count
   travels in the next `committed` or `close done:` reading, which is
   record enough. This also closes a gap — the rule's file path,
   `.tanto/<topic>/compaction-<role>-<n>.md`, has no `<topic>` for a Hosa.
3. **Not for Kikaku.** A Kikaku decision quotes the human verbatim, and a
   summary's words are not the human's; that window stays `/clear`-only,
   as the spec's row already says.

### 4. Placement: `seat-lineage`'s spec, amended by this file

`.tanto/seat-lineage/spec-draft.md`, accepted 2026-09-17, is the text that
would otherwise land the contrary rules, at four sites:

1. **§3.4**, the batch-loop paragraph that ends "your next line to the
   human" with `— /clear <name>'s window` for a Kikaku or Hosa and
   `— <name> is released after its exit shoroku` for a Kaiseki: replaced
   by the idle block paragraph of section 1, keeping `idle since <HH:MM>`
   in the roster's Status as its source and adding the ledger's
   `## Open questions for the human` as the other.
2. **§3.9**, the Replace table's row "a Kikaku's or a Hosa's reading
   shows a compaction — neither is replaced: remind the human to `/clear`
   that window, mark the row `cleared`...": split. The Kikaku half stays
   as written, the reminder becoming a `for you` item. The Hosa half
   becomes: nothing — the count arrives in its next reading, and the Hosa
   has confirmed its summary's human items in its own window before
   continuing.
3. **§6.1**, `roles/hosa.md`'s "Lifecycle" replacement: after "The human
   `/clear`s this window at will", the `/compact` paragraph of section 2 —
   at will between jobs, the three conditions, the confirmation in this
   window, nothing to Kanri.
4. **`SKILL.md`**, "The transcript reading", the compaction paragraph's
   sentence "Two sessions have no Kanri to answer: Kanri itself, whose own
   case is its handover file, and a standalone Kaiseki, which puts the
   items to the human in its own window": three sessions, the third a
   Hosa, whose counterpart under its chores grant is the human in its own
   window — it puts the items there before its next job, and Kanri learns
   of the compaction from the count in its next reading. The spec's §2
   does not touch this paragraph today, so this is an addition to its
   scope, one sentence.

Why here and now: the spec is accepted and its Keikaku has just begun
drafting — the cheap moment `2026-09-17-clear-based-lifecycle.md` section
9 named for the same reason; a change before `plan.review` costs a
drafter's addendum, after it a scoped re-review, and after the plan lands
a second topic on the same paragraphs.

`.tanto/kikaku/2026-09-17-closing-line-identity.md` (R-7, ruled in
`seat-lineage/kanri.md`, added at the cold read: that file's own section 5
said the spec would not be re-edited, the same as R-6 — the cold read
found the two amendments treated unevenly, since R-6 alone had reached the
spec, and this entry corrects that), sections 1, 2, and 5, verbatim (headed
here as R-7 §1, §2, §5 to avoid colliding with R-6's own "1." and "2."
above):

### R-7 §1. The form

The closing line the plan already fixes — Task 3 of
`docs/superpowers/plans/2026-09-17-seat-lineage.md`, "A seat's turn ends
with its closing line", `Work: <paths>. Still needs this seat: <step> | none.`
— gains one part in front and one optional line under it:

```text
<name> [<ref>] · <role>[/<topic>] · <family> — Work: <paths, or the commit subject>. Still needs this seat: <step — its site> | none.
sent: <the one line sent to Kanri this turn, verbatim>
```

- `<name> [<ref>]` is what the seat's own last `ListAgents` printed for it —
  at the handshake, at its latest boundary self-check, or at `/tanto fukki`.
  It is the word Kanri's idle block, Kanri's delete requests, and the roster
  use, so the window and those lines match on the same word. The uuid
  session id is the roster's Transcript column and is not shown.
- `<role>[/<topic>]`: the role id, with the topic for a Sekkei, Keikaku,
  Jisso, or attached Kaiseki — `jisso/shoroku-at-close`; bare `kanri`,
  `kikaku`, `hosa` for the topicless seats.
- `<family>` is the family word — `opus`, `fable`, `sonnet` — read from the
  seat's own system prompt, which the harness rewrites on a `/model`
  switch, so it is fresh; it is what a decision file's "which model wrote
  what" and Kanri's handshake check both key on.
- `sent:` appears only on a turn that sent Kanri a line, and carries that
  line unchanged, its reading included. In this editor a `SendMessage` is a
  collapsed row; the human reads the window, not the envelope (the measured
  case of `2026-09-17-deletable-closing-line.md`, section 0), and this line
  puts the envelope's one line in the window.
- **Kanri's idle block** (`2026-09-17-idle-block-and-hosa-compact.md`)
  gets the same identity as its first line after `---`, so that a window
  holding a Kanri says which Kanri — three were replaced today. It needs
  no `sent:`: Kanri's lines are already files (the batch prompts) or `R-n`
  text.

Two more facts, checkable against the listing and the system prompt; still
never an opinion, as the plan's passage says.

### R-7 §2. Staleness after a resume

A resumed session comes back under a new name and `[ref]`, and nothing in
its context says so until its next boundary self-check or the human's
`/tanto fukki`; until then the line shows the old name. The plan's passage
says so in one clause — the identity is as of the seat's last self-check —
and the human, who restarted the editor, knows which day that is. No
mechanism is added.

### R-7 §5. Placement, and the interim

The plan is drafted and reviewed (`.tanto/seat-lineage/plan-review.md` on
disk); the human's plan dialogue and the cold read have not run. The
change is one clause per site: the Task 3 passage — its prose, its `text`
fence, and its two examples — and the sites that restate the closing line,
as Task 3's own "Named mechanisms" paragraph lists them: `roles/kanri.md`'s
handover step 4 (Task 13), `roles/jisso.md` (Task 21), `roles/sekkei.md`
(Task 22), `roles/keikaku.md` (Task 23), `roles/kaiseki.md` (Task 24),
`roles/hosa.md` (Task 25); and the idle block's site (Task 10) for Kanri's
identity line. A drafter's addendum by the live Keikaku `dotskills-f0`, a
scoped `plan.review` on those passages, then the dialogue as planned.

## Shoroku candidates from this spec work

Recorded at the spec's acceptance as one `pending` row pointing at this
heading, which keeps the pre-plan spelling so that the Kanri of the landed
text finds it; the plan renames the heading for later specs (fixed input
7). The items are the delta beyond the requirements, the ADRs, and the
deferred items above:

1. **The in-plan handover's check was already gone** (Measured 1): the
   decision file's measured wait (4 to 128 min) was solved by
   `shoroku-at-close` for the in-plan case before this topic opened, and
   what this topic removes is the close's and the between-plans' second
   check. Destination: a fact under decision-03f9's record or design-4807's
   shoroku section, so that a later reader does not credit this topic with
   the whole of the measured gain.
2. **The question-back's removal was not visible to I-1** (Measured 2): a
   Kikaku reasoning from the pre-plan skill text kept a step behind a line
   that the landing plan had removed. Destination: an issue, low — a Kikaku
   decision that touches a mechanism in flight names the block that lands
   it, or the plan section, as the seat-lineage decision's section 5 did
   for its topic order.
3. **`/clear` resets the effort and keeps the model** (Measured 3).
   Destination: the sessions note (the plan writes it, 8.3), and a line in
   design-4807 beside the model check — the effort check's `warns only` is
   what makes a reused window safe.
4. **A tanto line reaches a bare window and is answered to the human, not
   the sender** (Measured 4). Destination: the sessions note, as the fact
   the `no-role` line rests on.
5. **The trial's first figure**: this dialogue ran four questions (Q1 to Q3
   and one re-put) and six design sections to an accepted design, with two
   riders from the human (the section name; a later-topic remark that was
   this topic's own section 2) and one request to re-explain. Destination:
   the seat-lineage ledger's Measurements row for the opus/max trial, filled
   at T2 with the review file's counts.
