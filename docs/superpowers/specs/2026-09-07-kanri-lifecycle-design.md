# Design: `tanto` kanri-lifecycle — addressing without rename, a resident Kanri, a bug intake, session-exit shoroku, three small fixes

This is the second design for the `tanto` skill, one plan under `/tanto`
itself, and the dogfood issue-770d asks for. It changes the skill in six
places: how sessions address each other (issue-1c70), how Kanri lives across
plans and hands over (issue-77a1, req-04f5), how a defect noticed in a skill
reaches the repository that ships it (spec input I-5), how a session's
knowledge reaches `docs/` before the session is closed (spec input I-6,
req-04f5), how a role reaches the human — only through Kanri's grant (spec
input I-7, req-04f5) — and three small fixes (issues 577b, 3990, 2f1b). The skill's first
design is the tanto design of 2026-09-06 and its as-built record is
design-4807; this document restates what it needs from both, so that Kanri and
Jisso can read it cold.

The inputs are `.superpowers/sdd/kanri-lifecycle/spec-inputs.md` (I-1 to
I-7), the five issues above, req-04f5, design-4807, the dogfood report of
2026-09-06, and the spec review at
`.superpowers/sdd/kanri-lifecycle/spec-review.md`, whose thirty findings are
folded in. The human decided the forks in the spec dialogue on 2026-09-06 and
2026-09-07; those decisions are fixed inputs below. Every `I-n` is answered in
"Answers to the spec inputs".

## Fixed inputs

Decided before or during the dialogue, not reopened here:

- **Design (b): no rename.** The skill never asks for a rename. A session is
  addressed by the name it was born with, the roster is the address book, and
  the only rule is that a `tanto` session is never renamed after it has
  started under `/tanto`. Chosen by the human over design (a), a mandatory
  `/rename <dir>-<role>`, because the rename is the one thing that breaks
  addresses, and because in the VS Code extension the rename does not even
  reach the tab title the human reads (the tab shows an AI-generated title or
  a name set through the extension's own UI, and nothing a skill can call
  sets it).
- **The residency line is information, not a question.** At every plan close
  Kanri reports one line and stays unless the human says otherwise.
- **Batches are cut by file, each file written once**, because a plan under
  this protocol carries the complete final content of every file it touches
  (the dogfood report's "what produced the zero fix rounds"). The batches are
  A contract and templates, B the four procedures, C the checks; this
  document presents the issues in I-1's order, and the batches close them
  jointly at B and C.
- **In a plan that edits this skill, a role replacement waits for the batch B
  boundary.** The user-level `tanto` link points into this working tree, so
  a role started at batch A's boundary would read a contract that forbids
  rename next to a role file that still demands it. Decided now (spec review
  F-5); the general hazard is deferred item 2.
- **Session-exit shoroku (I-6)**, with the three recommendations the human
  accepted: Kaiseki writes `docs/` itself at its exit; Sekkei's exit
  candidates are the delta the spec, the reviews, and T1 do not carry; at a
  handover the outgoing Kanri's exit shoroku precedes the handover file.
- **The bug intake has a requirement**, and a broad one: the human set the
  breadth ("bug reports are handled by a defined flow") after spec review
  F-8, and Kanri wrote req-04f5's bullet "Trouble reports reach the
  repository's Kanri, and Kanri answers them" at the level of intent — one
  intake, classify, file or fix or redirect or root-cause, one-line reply —
  and its checkpoint bullet now names the human's own acts (create or retire
  a session on Kanri's request; settle a triage or handover question Kanri
  cannot decide alone). Committed on `kanri-lifecycle` on 2026-09-07. Kanri
  as the intake, the five outcomes, and the hotfix lane are this design's
  choices under that requirement.
- **Human access by grant (I-7)**, accepted by the human after the plan was
  committed and folded in before Jisso is created, because this plan rewrites
  every file once: the human's counterpart is Kanri, and a role addresses the
  human directly only for what needs the human's eyes or hands, after Kanri
  grants it; req-04f5 carries the bullet "The human's counterpart is Kanri".
- **Kanri's three rulings.** R-1 one plan for the whole bundle; R-2 this run
  is the dogfood and its ledger and roster are the record; R-3 the sessions of
  this run keep their `dotskills-<role>` names for the whole run, whatever the
  spec decides for the future.
- **The two design rules** from design-4807, which the whole-branch review
  will apply again: an obligation lives in the file of the role that performs
  it; a term two or more roles route on lives in `SKILL.md`.
- **The three I-5 deviations Kanri agreed to**, with its additions, recorded
  in `.superpowers/sdd/kanri-lifecycle/sekkei-i5-deviations.md` and folded
  into "The bug intake" below.
- **What does not change.** superpowers, `shoroku`, the `docs/` system,
  `templates/tanto.json`, `templates/batch-report.md`,
  `templates/kaiseki-report.md`, the repo-root `README.md`. design-4807, the
  ADRs, req-04f5, and the issues change at T1 and T2 through the shoroku
  write-out, never through a plan task.
- **The previous plan is the model.** For anything this document leaves as
  prose rather than quoted text, the plan drafter takes the committed file
  contents in `docs/superpowers/plans/2026-09-06-tanto.md` as the model for
  shape and wording.

Names in prose: Kanri (管理), Sekkei (設計), Jisso (実装), Kaiseki (解析);
kanji at first mention, no honorific.

## Addressing without rename

Closes issue-1c70. The cause was that role names were made unique per
repository while the session name space is machine-wide; the fix is to stop
using role names as addresses at all.

### The start sequence has two steps

1. **Model check**, unchanged, decision-08bc.
2. **Handshake**, unchanged in form:
   `handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> branch=<branch> mode=<auto|unknown>`.
   `name [ref]` is what `ListAgents` prints for this session on its first
   line ("This session is `<name> [<ref>]`").

The Rename step is deleted from `SKILL.md`, and every role file's opening
sentence ("You have done the model check, asked for `/rename <role>`, and
sent the handshake") loses its middle clause. Kanri's opening paragraph and
its Start step 1 become:

> You have done the model check. You do not hand shake — you receive
> handshakes. Your start line prints your own `name [ref]` as `ListAgents`
> reports it; that is the address every lifecycle request carries, and you
> are never renamed after it.

> 1. Read `tanto.json` as `SKILL.md` describes, run `ListAgents` once for
>    your own `name [ref]`, and say your start line: the config file and
>    default keys, your `name [ref]`, and your bare name as the address.

### The address

- The address of a session is the **bare name** its handshake carried:
  `dotskills-0d`, not `kanri`. `SendMessage` delivers a bare name that matches
  exactly one live session. When it reports the name ambiguous, run
  `ListAgents` once and append the ` [ref]` from that listing.
- **An address written `<name> [<ref>]` is used as the bare `<name>`.** The
  `[ref]` is an identity, shown wherever a session is named so that the
  listing, the roster, and the handover agree on which session is meant; it
  is appended to a `to` value only after `SendMessage` reports the name
  ambiguous, and never pasted from a file. Every command line
  (`/tanto <role> <address>`), every `to` value, and every "Send to" blank
  carries the bare name.
- **Kanri's address** reaches a role in one of three ways, in this order of
  precedence: the `kanri-address:` line described under "Kanri's Start,
  reordered"; the second argument of `/tanto <role> <address>`, pasted by the
  human from Kanri's request; the first data row of
  `.superpowers/sdd/roster.md`.
- **Every other role's address** is known only to Kanri, from the handshake,
  and Kanri is the only session that sends to Jisso, Sekkei, or Kaiseki. A
  reply copies the envelope's `from` into `to` and needs no name at all.
- **No `tanto` session is renamed after it has started under `/tanto` —
  Kanri included, from its start line onward.** A rename changes the name the
  listing shows and the envelope's `from-name`, the ref does not change, and
  the old name stops delivering even with the ref attached (measured
  2026-09-06). A rename before `/tanto <role>` is the human's own choice: the
  skill neither asks for one nor forbids it, and the handshake carries
  whatever the name is.

The last bullet is rule 10 in `SKILL.md`, in those words; `roles/kanri.md`
repeats its Kanri half in the opening paragraph quoted above, because Kanri
never reads a handshake rule as its own. Rule 4 (one set of roles per
repository) is unchanged; it is now enforced by the roster alone, which is
per repository, and no longer leans on a machine-wide name.

The `kanri-address:` term, in `SKILL.md` under "Handshake and roster":

> Kanri's address is the first data row of the roster. A message whose first
> line is `kanri-address: <name> [<ref>] — handover accepted; the roster's
> first row is rewritten` comes from a successor Kanri and replaces Kanri's
> address from then on; the roster's first row says the same. A role whose
> send to Kanri errors re-reads that row.

And each of `roles/sekkei.md`, `roles/jisso.md`, and `roles/kaiseki.md`
carries the obligation as one sentence: "A message whose first line is
`kanri-address: <name> [<ref>]` replaces Kanri's address from then on; if a
send to Kanri errors, re-read the roster's first data row."

### The roster is the address book

The paragraph in `templates/roster.md` that says "a uniqueness check, not an
address book" is replaced. The roster is the address book: one row per live
role, Kanri's row first, the `Name [ref]` column being the address the row's
session answers to, used as the bare name. It stays correct because nothing
renames a session. The `[ref]` column is load-bearing now: it identifies a
session across the listing, the roster, and the handover.

The roster gains one section, **Residency**, one line rewritten in place by
Kanri at every boundary and plan close:

```text
## Residency

Kanri <name> [<ref>] since <YYYY-MM-DD>: <n> batches, <m> plans, <k> compactions noticed.
```

The counters: `<n>` increments when Kanri accepts a batch, `<m>` when a plan
closes, `<k>` when Kanri notices a compaction; all three are cumulative since
this Kanri's own start, and a declined handover leaves `<k>` incremented so
the count stays a record. It is the only cross-plan counter the skill keeps,
and it lives in the roster because the roster is the only file that outlives
a plan. A handover resets it to the successor's name and date with zero
counts.

The template's Events examples change: "a rename observed or skipped" is
removed; added are "a handover written by `<name> [<ref>]`", "a handover
accepted by `<name> [<ref>]` from `<name> [<ref>]`", "an exit shoroku
committed by `<name> [<ref>]`, or not run and what was lost", "a bug report
received, or sent to `<name> [<ref>]`", "a hotfix committed between plans".

### Kanri's checks at a handshake

Step 2 of "On a handshake" in `roles/kanri.md` becomes two checks: no live
roster row for that role, and the `name [ref]` the handshake carries appears
in `ListAgents`. The check "exactly one `ListAgents` row with that name" is
deleted; it is the check that misfired on another repository's role.

### Lifecycle requests print Kanri's real name

Every request line in the Create table carries `/tanto <role> <name>` where
`<name>` is Kanri's own bare name, and the row text says "your own bare name
as your start line printed it" instead of "your bare name". The skill's
`README.md` changes to match: in Usage, Kanri starts with `/tanto kanri`;
every other role starts with the address Kanri's request prints, shown as
`/tanto sekkei <kanri>` with a note that `<kanri>` is the bare name from the
request; the paragraph about `/rename` is deleted; "Kanri's bare name as the
address" becomes "Kanri's name as its request prints it". In What it does,
one bullet is added: "Takes bug reports about the skills this repository
ships: a report is a file and one line to Kanri, which triages it into an
issue, a redirect, a root-cause session, a one-line hotfix, or an input to a
spec in progress." The closing line names both design documents, this one
and the 2026-09-06 one. Layout lists nine templates.

### Templates: the `<kanri-address>` blank

`templates/batch-prompt.md` and `templates/kaiseki-brief.md` name `kanri` as
a literal addressee three times in total. Each becomes a blank
`<kanri-address>` that Kanri fills with its own bare name when it copies the
template: the guard line ("reply `not me` to `<kanri-address>` and stop") and
the Report section of the batch prompt, and the Report section of the brief.
The batch prompt's Setup on resume gains one line,
`- Kanri — <name> [<ref>]`, so that a Jisso resumed from the prompt after a
replacement, or a Jisso that receives its first prompt from a successor
Kanri, has the address without reading the roster. `SKILL.md`'s Invocation
line already reads `/tanto <role> [<kanri-address>]`; the token means the
same address there, pasted by the human, and both uses are deliberate — the
fixed-string check counts it per file: `batch-prompt.md` 2,
`kaiseki-brief.md` 1, `SKILL.md` 1.

The role files' "send `kanri` one line" sentences (Sekkei three sends and one
"ask `kanri`", Jisso two, Kaiseki one) become "send Kanri one line" and "ask
Kanri", meaning the address under "The address" above; Sekkei gains a fourth
send, its reply to the boundary line ("The loop, reordered", step 7). After this change the
role name is no longer an **addressee** anywhere in the skill; `kanri`
survives as a role id (the normalization table, `/tanto kanri`, the file
branch at the end of `SKILL.md`), a path component (`roles/kanri.md`,
`templates/kanri.md`, `.superpowers/sdd/<topic>/kanri.md`), a config key
(`sessions.kanri`), and the roster's Role column.

### Replacing a role

Nothing new is needed for Sekkei, Jisso, or Kaiseki: a replacement hand
shakes, Kanri rewrites the row, and Kanri is the only sender to those roles.
Only Kanri's own replacement needs the peers told, and that is the handover.
Under this plan a replacement waits for the batch B boundary (fixed inputs).

## A resident Kanri with a handover

Closes issue-77a1 and implements req-04f5's bullet "Kanri is resident and
hands over before it decays".

### The default

A plan closing does not close Kanri. The Delete table's last row becomes:
"Jisso is deleted and the ledger's Progress line says closed — this plan is
closed; Kanri stays, prints the residency line, and waits for the next
topic." The paragraph "Your default lifetime is one plan" is replaced by:

> You are resident. A plan's end is a boundary like any other, and the next
> topic starts with a new topic directory and a new ledger under the same
> roster, cold-read as if fresh. Your only exit is the handover below.

### The trigger

Two signals fire a handover, checked at every boundary:

1. **The human's word.** Always, and it overrides the residency line.
2. **A compaction noticed.** Your context now begins with a summary of
   earlier conversation instead of the conversation itself, or a ruling the
   ledger holds is one you do not remember making. State lives in files, so
   a compaction loses nothing the successor cannot read back; it is the
   harness's own signal that the session has grown long, and it is the one
   signal a session can see for itself.

Not used: the `tokens left` figure the harness prints in its reminders, whose
unit is not documented as the context window and whose presence is not
guaranteed; and a batch or plan count, for which there is one data point
(six boundaries, no compaction, on 2026-09-06). The residency counters are
recorded so that a threshold can be chosen later; that is deferred item 1.

The check runs at loop step 6 while a plan is in flight, and, between plans,
at the start of every turn Kanri gets — a message, or the human speaking.
Which of the two handover procedures follows is decided by whether a ledger
is open: "In a plan" or "Between plans" below.

### The residency line

At every plan close, and whenever the human asks, Kanri prints one of two
lines to the human. The `[<ref>]` is the identity; the human copies the bare
name into the next `/tanto <role> <name>`:

```text
Kanri stays — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed; handover not due.
Kanri hands over — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed; handover written.
```

The second form is followed by the numbered commands from the handover file.

### The handover file

`.superpowers/sdd/kanri-handover.md`, next to the roster, untracked under the
existing `.superpowers/sdd/.gitignore`. Copied from the new
`templates/kanri-handover.md`, the eighth template, whose sections are:

- **Why** — the trigger that fired and when.
- **In flight** — the plan basename and the ledger path, and the batch state
  in one of two forms: "batch `<X>` accepted, batch `<Y>` prompt not sent", or
  "between plans, last plan closed `<date>`".
- **Live peers** — one line per live roster row other than Kanri's: role,
  `name [ref]`, and what that session is waiting for.
- **Open questions for the human** — a pointer to the ledger's section, plus
  anything not yet written there.
- **Rulings the next batch inherits** — the `R-n` ids and the concrete model
  families the next prompt must restate, copied, as compaction insurance.
- **Residency** — the roster's Residency line, copied.
- **Next step** — one line: the successor's first act after its cold read.
- **Not reconstructed** — any shoroku candidate the outgoing Kanri could not
  classify or reconstruct at its exit, one line each, for the successor to
  raise at its first boundary; "none" when there is none.
- **Commands for the human** — numbered: 1. open a new session in
  `<repo path>` and run `/tanto kanri`; 2. when the new Kanri asks, delete
  this session.

Everything else is a pointer to the roster and the ledgers, never a copy.

### Timing

Only at a boundary: a batch accepted and the next prompt not yet sent, or
between plans. Never mid-batch: the rule "never replace mid-batch on
suspicion" now names Kanri itself. Because the trigger is checked before the
next prompt is written, a handover that is due stops the loop at that point
and the next prompt is the successor's to send.

### The handover, in a plan and between plans

The outgoing Kanri's steps, in `roles/kanri.md`'s Handover section:

1. **Exit shoroku first** ("Session exit" below, the Kanri case): propose to
   yourself from the ledger and the roster, not from recollection, escalate
   to the human, write, lint, commit once, mark the `S-n` rows written; what
   you cannot reconstruct goes into the handover file's "Not reconstructed"
   section. In a plan, this step is loop step 6's proposal and step 7's slot
   (b) commit, already done when the window reaches this list; between plans
   it is one act.
2. Write `.superpowers/sdd/kanri-handover.md` from its template.
3. **In a plan**: set the ledger's Progress line to "handover written".
   **Between plans**: there is no ledger, so write "handover written by
   `<name> [<ref>]`" as a roster Events line instead.
4. Print the "Kanri hands over" line with the numbered commands, and stop.
   Send nothing to any peer; answer the human if asked; do nothing else.

If the human says "continue" instead of creating the successor, delete the
handover file, record the declined handover in the roster's Events (the
`<k>` counter stays), and resume — at loop step 7 in a plan, or waiting for
the next topic between plans.

### Kanri's Start, reordered

Kanri's Start runs the branch before it asks for anything, because a
successor taking over mid-plan must not create a second ledger:

1. Read `tanto.json`, run `ListAgents` once for your own `name [ref]`, say
   the start line (quoted above).
2. Make sure `.superpowers/sdd/.gitignore` exists and holds `*`.
3. If `.superpowers/sdd/roster.md` is absent, this is the bootstrap: create it
   from `templates/roster.md` with your row first and a Residency line with
   today's date and zero counts, then go to step 5.
4. Otherwise cold-read the roster and compare your own `name [ref]` with its
   first data row, then take exactly one case:
   - **Handover** — `.superpowers/sdd/kanri-handover.md` exists. In order:
     read the handover and the ledger it names, and `progress.md` if a plan
     is in flight; from `ListAgents`, note whether the old Kanri is still
     listed; rewrite the roster — your own row first with status `live`, the
     old Kanri's row `replaced` (or `dead` if it was not listed), the
     Residency line reset to your name and today with zero counts, and one
     Events line "handover accepted by `<you>` from `<old>`"; send every live
     peer, to its bare name from the roster, one line
     `kanri-address: <name> [<ref>] — handover accepted; the roster's first row is rewritten`;
     delete the handover file, because the Events line is the record and a
     stale file must not start a false handover at the next Kanri start; ask
     the human, as a numbered list, to delete the old session; continue at
     the handover's Next step, which decides whether a plan is in flight.
   - **Kept Kanri** — no handover file, and the first data row is you: this
     is a re-invocation in the resident session; continue where the current
     ledger's Progress line says, or wait for the topic if none is open.
   - **Second Kanri** — no handover file, the first data row is another
     name, and that session is still listed: stop, tell the human there is a
     live Kanri already, and ask whether that one should hand over or this
     session should be deleted. Write nothing.
   - **Recovery** — no handover file, the first data row is another name,
     and that session is not listed: mark every row whose session is gone
     `dead`, with an Events line per row saying whether its exit shoroku ran
     and what was lost, and run the recovery section.
5. Only when no plan is in flight — the bootstrap, a kept Kanri between
   plans, or a recovery whose last ledger says closed — ask the human for the
   topic word and create `.superpowers/sdd/<topic>/kanri.md` from
   `templates/kanri.md`. When a plan is in flight, the ledger already exists
   and is named by the handover or the roster's Events.
6. Do the T0 write-out if an input document with decided items exists. Then
   wait for the human and for handshakes.

The recovery section after a VS Code restart is otherwise unchanged; it is
entered only through the Recovery case, so it says nothing about the handover
file.

### The loop, reordered

The batch loop in `roles/kanri.md` becomes, per batch:

1. Wait for the idle notice or Jisso's one-line report. Do not poll.
2. Verify the tree before reading the report (unchanged).
3. Read the report and rule; adopt or reject shoroku candidates; update the
   ledger (unchanged).
4. **Triage any bug report that arrived during the batch** ("The bug
   intake"): rule on each, send the redirects, the Kaiseki requests, and the
   relays now; an issue to file or a hotfix to make waits for the commit
   window at step 7.
5. Report one line to the human (unchanged).
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency line. If a create request is due, make it. If a delete
   or a replace of a live, coherent session is due, or a handover trigger
   has fired, run the proposal half of "Session exit" now: send the
   `exit:` lines, rule on the proposals, write the directions. Delete
   requests wait for step 7.
7. **The commit window.** One committer at a time, in this order, Jisso
   idle throughout: (a) each exiting session applies its direction and
   commits, Kanri verifies the diff and only then asks the human to delete
   that session; (b) Kanri's own edits — the hotfix, the issues from step 4,
   Kanri's own exit shoroku when a handover is due — each committed by Kanri
   in its turn; (c) **tell Sekkei the boundary is verified**, with
   `notify_when_idle: true`, and any Kaiseki create or delete since the last
   boundary, then wait for Sekkei's one-line reply — `committed <subject>` or
   `nothing to commit` — or for its idle notice, whichever comes first, and
   record in the ledger's Session events if the notice came without a reply;
   skip (c) when Sekkei is not live. If a handover is due, the window ends
   with steps 2 to 4 of "The handover, in a plan and between plans" — the
   exit shoroku was step 6's proposal and slot (b)'s commit — and the loop
   stops here; the next prompt is the successor's.
8. Write and send the next batch prompt (unchanged, now last).

Steps 4, 6, and 7 are everything that needs Jisso idle or the index free,
and they all precede the prompt that wakes Jisso. The pre-commit hooks stash
every unstaged change in the tree while they run, so nobody edits a tracked
file outside its own slot of the window, Kanri included. A hotfix taken on a
plan branch is named in Kanri's merge question, so that the human sees a fix
that has to survive the branch decision.

### The peers' obligation

The `kanri-address:` sentence under "The address", one per peer role file.

### The tables

- **Create** — unchanged in rows; the request lines print Kanri's real name
  (above).
- **Replace** — the row "Your own context decay" becomes "A handover trigger
  fired at a boundary — run the Handover section; the successor asks for
  your deletion." The rows for Jisso, Sekkei, and Kaiseki keep their symptoms
  and gain one clause each: "run 'Session exit' first if the session is alive
  and coherent; otherwise record in the roster's Events that its exit shoroku
  did not run and what was lost." Jisso gains one more row: "Jisso has
  carried the batches the plan expects of one session — replace it at the
  next boundary, exit shoroku first."
- **Delete** — every row's "Say" cell gains the precondition "after its exit
  shoroku is committed"; the last row as under "The default".
- **Batches under this plan** — the plan's Batches section names the batch B
  and batch C boundaries as the replacement points for Jisso, because the
  batch prompt's Setup on resume is what a fresh Jisso needs and the skill on
  disk is consistent there; a Kanri that judges Jisso long replaces it there
  with "resume batch X from task N".

### The measurements

The ledger template's Measurements table keeps its free rows. The cross-plan
counts live in the roster's Residency line, not in the ledger, because a
ledger is deleted when its plan closes (the human's choice on 2026-09-06).

### The live roster

`.superpowers/sdd/roster.md` exists in this repository, untracked, written
only by Kanri, on seven columns, without a Residency line. No task touches
it. The plan's Batches section carries one line for Kanri: at the batch A
boundary, bring the live roster into line with the new template — the eight
columns, the address-book paragraph, the Residency section with this Kanri's
start date and the counts so far.

## The bug intake

Spec input I-5, with the three deviations Kanri agreed to. The flow for what
a human notices while using a skill, and for a suspected defect found from
another repository, is defined from the moment Kanri receives it. The
requirement behind it is broad (fixed inputs): bug reports are handled by a
defined flow; what follows is this design's flow.

### The terms, in the shared contract

Two paragraphs in `SKILL.md` under Messages:

> A defect noticed in a skill goes to the Kanri of the repository that ships
> that skill, as a **bug report**: a file written from
> `templates/bug-report.md` and one line, `bug-report: <absolute path>`.
> Kanri is the intake, and the human supplies the intake's address. A defect
> that surfaces in a spec dialogue reaches Kanri as an `I-n` relay through
> Sekkei, not as a bug report.

> Kanri answers a bug report with one line, in one of five forms:
> `triage: issue-<id>`, `triage: redirect — <one line>`,
> `triage: kaiseki requested`, `triage: hotfix — <commit subject>`,
> `triage: relayed as I-<n>`.

Three roles route on them: Kanri as receiver and as a reporter from another
repository, and standalone Kaiseki as a reporter.

### The report

`templates/bug-report.md`, the ninth template. Sections, in order:

- **Send to** — the intake's bare name, filled by the human or left blank, so
  a report that was never sent still says where it was meant to go (D-1,
  Kanri's addition).
- **Symptom** — what was expected and what happened.
- **Reproduction** — the exact command or the exact sequence, and what it
  printed.
- **Where seen** — repository, skill, file, and the role or mode the reporter
  was in.
- **Severity guess** — one word, a hint.
- **Proposed fix** — optional, as text.
- **Reporter** — `name [ref]`, repository path, date.
- **Triage** — left blank by the reporter; Kanri fills the outcome, the
  reference (issue id, commit subject, redirect, or `I-n`), and the date.

The reporter writes the file under its own repository's `.superpowers/sdd/`
(any untracked path there) and sends the absolute path. Three reporters
exist: the human of this repository, who talks to Kanri directly and whose
words Kanri writes into the skeleton itself; another repository's Kanri; and
a standalone Kaiseki. Sekkei and Jisso keep their existing channels — the
Shoroku candidates of a review report, the batch report, the `I-n` relay —
and get no new one.

### Intake

On `bug-report: <path>`, or on the human's words, Kanri copies the file to
`.superpowers/sdd/inbox/<YYYY-MM-DD>-<slug>.md`, the slug being kebab-case
derived by Kanri from the Symptom (creating `inbox/`, untracked under the
existing `.gitignore`), and from then on reads only the copy; the reporter's
file may vanish. The inbox is the log: the Triage section is appended to the
copy, and copies are never deleted. Every receipt and every send is one line
in the roster's Events.

### The intake's address

The human supplies it (D-1). No session outside this repository can learn
this Kanri's name: `ListAgents` shows no cwd, the roster is per repository,
and the skill's runtime text never names its source location; automatic
discovery would rest on resolving the skill link's real path, which breaks
when the skill is copied. So the human, who alone sees both repositories,
tells the reporter the bare name that Kanri's start line and residency line
print. A report the reporter cannot send stays a file the human can paste
into the intake session as `bug-report: <path>`.

### Triage: five outcomes

A Kanri ruling, recorded as `R-n` in the current ledger, or in the roster's
Events when no plan is open. Exactly one of:

1. **Issue** — a defect in a skill this repository ships, larger than a
   one-line fix, or with an unknown cause that the human does not want a
   Kaiseki for: file it under `docs/issues/open/` per `docs/issues/AGENTS.md`,
   with the report's symptom and reproduction; issues are Kanri's under the
   adoption rule and the human sees the commit. The issue is then the
   tracker: `claimed_by` when a plan picks it up, `git mv` to `resolved/` at
   the T2 of the plan that lands the fix; a plan's spec names the issues it
   resolves, and that plan's T2 moves them.
2. **Redirect** — the problem belongs elsewhere (dotrepo, superpowers, Claude
   Code, the reporter's own repository): one line back, nothing written.
3. **Kaiseki** — the cause is unknown and worth a root-cause pass: ask the
   human, as a numbered list, to create a standalone Kaiseki with
   `/tanto kaiseki` and give it the inbox copy's path as its symptom and
   reproduction. Its report goes to the human in that session; the human
   brings its path back to Kanri, and the report re-enters triage as a known
   cause.
4. **Hotfix** — a one-line fix: "The hotfix lane" below.
5. **Relay** — a spec is in progress and the report is in its scope: append
   it to `.superpowers/sdd/<topic>/spec-inputs.md` as the next `I-n` with a
   note, and send Sekkei one line — the existing relay, reused.

### The hotfix lane

Open only while no batch is in flight — between batches, where the triage is
ruled at loop step 4 and the edit and commit happen in slot (b) of step 7's
commit window, or between plans — and never on a file that the in-flight
plan lists in its File structure table (D-3). In the lane Kanri edits the skill file directly,
runs lint on the changed paths by name and the README drift review if
`SKILL.md` changed, commits once by explicit path with the trailer, and
records `R-n`. No issue is filed (D-2): the commit is the durable record, so
its subject names the symptom, not only the report's slug, and its body
names where the report came from. The commit lands on the branch the tree is
on — the plan branch between batches, `main` between plans, never pushed —
in slot (b) of step 7's commit window, and a hotfix on a plan branch is
named in the merge question.

So that hotfixes reach `docs/` once (D-2, Kanri's addition), Kanri carries
them forward: when it creates a new topic's ledger, it copies the hotfix
lines recorded in the roster's Events since the previous plan into a
"Hotfixes since the previous plan" line in the new ledger's Plan section,
and at T2 it names that line in the shoroku direction so Jisso's dogfood
report carries them.

A fix to a file the in-flight plan rewrites takes one of three paths (D-3
with Kanri's refinement): if a task that rewrites the file is still ahead,
it is a cold-read question to Sekkei, which edits the plan's fenced block so
the task delivers the fix; if every rewriting task has run and only the final
batch remains, the fix joins the whole-branch review's single fix wave; if
neither Sekkei is live nor the final batch is next, it takes the issue
outcome and waits.

### Timing

Redirect, the Kaiseki request, and the relay may happen whenever the report
is read. Filing an issue and the hotfix touch tracked files and wait for
step 7's commit window or for a gap between plans. When no plan is open,
Kanri triages on arrival.

### The reply

One of the five `triage:` lines, copying the envelope's `from` into `to`, or
in chat to the human.

### Reporting from the other side

`roles/kanri.md` also carries the reporter's procedure, because a Kanri in
another repository is the reporter: on the human's request, write the report
from the template, ask the human for the intake address if it was not given,
send `bug-report: <absolute path>` to the bare name, and record the send in
the roster's Events. `roles/kaiseki.md` carries one sentence for standalone
mode: when the human asks for a defect to be reported to another repository,
write the report from `templates/bug-report.md` and send it to the address
the human gives, or leave it as a file for the human.

### Where it lives

- `SKILL.md` — the two term paragraphs; the artifacts table rows below.
- `roles/kanri.md` — a new section "Bug intake" with intake, triage, the
  hotfix lane, carrying hotfixes forward, and reporting from the other side;
  loop step 4.
- `roles/kaiseki.md` — the standalone reporter sentence.
- `templates/bug-report.md` — the skeleton.

Not in this design: automatic intake discovery, a cross-repository view
(issue-3ca4), any new report channel for Sekkei or Jisso.

## Session exit

Spec input I-6 and req-04f5's "Docs are kept current" bullet as updated on
2026-09-07: every planned exit of a session, in any role, carries its own
shoroku before the human closes it; an exit forced by a failure is the
exception, and the record says what was lost.

### The mechanism is T2's split, for every role

T2 already splits the write-out into three files because the writer cannot
talk to the human (decision-1f5f). The exit reuses it unchanged in shape,
under `SKILL.md`'s new section "Session exit", which every role reads:

> Before the human deletes a session in the normal flow, the session's
> **exit shoroku** runs. It is the T2 split applied to that session: the
> session writes its candidates as a numbered list to
> `exit-<role>[-<suffix>]-proposal.md`; Kanri rules per the adoption rule,
> escalates requirement and ADR items to the human, and answers item by item
> in `exit-<role>[-<suffix>]-direction.md`; the session applies the accepted
> subset per `docs/AGENTS.md`, lints, commits once by explicit path in the
> slot Kanri gives it, and sends Kanri one line. Kanri verifies the diff as
> for any batch, marks the `S-n` rows written, and only then asks the human
> to delete the session. An exit whose candidates carry no requirement or
> ADR item asks the human nothing; the human sees the delete request and the
> commit. Candidates are what is not yet in any file — a rejected
> alternative and its reason, a fact measured, a defect noticed, an
> observation about the run — never a restatement of a spec, a plan, a
> report, or a ledger. Kanri's own exit and a standalone Kaiseki have no
> second session to rule; each role file says how.

The lines, each sent with `notify_when_idle: true`: Kanri sends
`exit: propose your shoroku; write it to <path>`; the session answers with
one line and the path; Kanri sends `exit: direction at <path>`; the session
answers `exit write-out committed: <subject>` or
`exit write-out: nothing accepted`. A session that has not answered when its
idle notice arrives is past answering: Kanri treats the exit as forced —
the roster's Events line says the exit shoroku did not run and what was
lost, as far as Kanri knows — asks the human to delete it, and continues.
Jisso idles through another session's exit; the cost is one boundary.

The file pattern is `exit-<role>[-<suffix>]`, with the suffix the batch
letter for Jisso (`exit-jisso-B`, a Jisso leaving at batch B's boundary),
the case number for Kaiseki (`exit-kaiseki-1`), absent for Sekkei
(`exit-sekkei`), and the date for Kanri (`exit-kanri-<YYYY-MM-DD>`); the
Stage values below mirror it. The files live where the role's other files
live: Jisso's and an attached Kaiseki's under
`.superpowers/sdd/<plan-basename>/`, Sekkei's under
`.superpowers/sdd/<topic>/`, Kanri's own next to the roster. Kanri's exit
has a proposal file but no direction file, because it rules on itself. The
write-out commit's subject begins with `docs: exit shoroku` or
`docs: T<n> shoroku` (`docs: exit shoroku for jisso at B`,
`docs: T2 shoroku for <topic>`), which is the fixed prefix the whole-branch
review package excludes.

### The ledger's `S-n` table

`templates/kanri.md` gains a seventh column, **Written**, holding `no` or
the subject of the commit that wrote the row out, and its Stage column
accepts `T0`, `T1`, `T2`, and `exit:<role>[-<suffix>]` — `exit:jisso-B`,
`exit:sekkei`, `exit:kaiseki-1`, `exit:kanri-<YYYY-MM-DD>`. Every write-out,
T2 included, writes only adopted rows whose Written column says `no`, so
nothing is written twice and T2 keeps everything adopted but not yet
written.

Between plans there is no ledger, so `templates/roster.md` gains a
**Shoroku candidates** section with the same seven columns, where Kanri
records a candidate raised by a between-plans triage or by its own
between-plans exit; when a topic opens, Kanri moves the unwritten rows into
the new ledger's table and leaves the written ones in the roster as the
record.

### Per role

- **Jisso.** Its exit is the T2 procedure with the exit file names, run at
  the boundary where Kanri replaces it or where the plan ends; at plan end
  T2 is that exit. `roles/jisso.md`'s T2 section says so and adds that a
  write-out takes only rows marked `no`. The Jisso this plan runs under
  leaves through T2 as before.
- **Sekkei.** Its candidates are the delta: the proposal's first line says
  "excludes what the spec, the two review reports, and T1 already carry",
  and the items are the dialogue's rejected alternatives with their reasons,
  the facts measured during the dialogue, the observations about the
  process, and the defects noticed. Kanri rules after T1 is committed, so the
  delta is known. Sekkei's write rule gains one clause: at its exit, and only
  then, it writes the accepted subset under `docs/`, and commits it in the
  slot Kanri gives it in the commit window, ahead of its ordinary boundary
  commit. Sekkei also gains the reply to the boundary line: when Kanri says
  the boundary is verified, commit if your work is ready and answer in one
  line, `committed <subject>` or `nothing to commit`; the authorization lasts
  until you answer or until Kanri's next message, and a commit you did not
  make within that window waits for the next boundary line.
- **Kaiseki, attached.** Its candidates are its report's Shoroku candidates
  section plus every "Other defects observed" item tagged
  `blocks this task: no`, which Kanri today files at T1 or T2 and which
  Kaiseki now writes itself at its exit. Two lines change in
  `roles/kaiseki.md`'s tree discipline: "You do not commit" becomes "You
  commit once, at your exit, and only the accepted shoroku subset under
  `docs/`"; "You never write under `docs/` yourself" is deleted. The Kanri
  branch's step 5 changes to match: a `no` item goes into the `S-n` table and
  is written by Kaiseki at its exit.
- **Kaiseki, standalone.** No Kanri: before the human closes the session, run
  `shoroku` in its ordinary session mode, the human answering `Direction?`,
  and commit once.
- **Kanri.** Its exit is step 1 of the handover: propose to yourself as at
  T0 and T1, escalate to the human in this session, write, lint, commit once,
  mark the rows `exit:kanri-<YYYY-MM-DD>`, then write the handover file. Between plans
  the commit lands on `main`.
- **Forced exits.** When Kanri marks a row `dead`, or when a session does
  not answer its exit lines, the Events line says whether that session's
  exit shoroku ran and, if not, what was lost as far as Kanri knows.

### Sizing batches for one Jisso

I-6's other half: the human asked that a Jisso session never grow too long,
which makes a mid-plan replacement a planned event with an exit, not a
failure. `roles/sekkei.md` Step 3 gains one clause under Batches: batches are
sized so that one Jisso carries a batch without growing long, and the plan
says at which boundaries a planned replacement is expected, if any; and a
stop condition worded as a property of the whole tree is backed by a command
that sweeps the whole tree, not only the files the batch wrote (the general
case of plan-review F-5, a Kanri suggestion at the cold read). The Replace
table's new Jisso row ("The tables") is the trigger. This plan
expects one Jisso for its three batches — nine tasks, against the fourteen
one Jisso carried on 2026-09-06 without a compaction — and names the batch B
boundary as the point where Kanri replaces it if it judges it long.

### Where it lives

- `SKILL.md` — the "Session exit" section, the lines, the file pattern, the
  commit subject convention; the boundary-reply pair under Messages, since
  Sekkei sends it and Kanri routes on it; rule 5 gains "except the accepted
  subset of its own exit shoroku, at its exit" for Sekkei and Kaiseki; the
  roles table's Kaiseki cell becomes "never a fix; no commit but its exit
  shoroku"; Kanri's Owns cell gains the bug intake and the exit direction.
- `roles/kanri.md` — sending the lines, ruling, directing, verifying, the
  delete request only afterwards, the Kanri case; loop step 6; the Replace
  and Delete rows; the Kaiseki branch's step 5.
- `roles/sekkei.md`, `roles/jisso.md`, `roles/kaiseki.md` — each role's own
  candidates and its apply step; Sekkei's reply to the boundary line and its
  batch-sizing clause.
- `templates/kanri.md` — the Written column and the Stage values.
- `templates/roster.md` — the Events examples and the between-plans Shoroku
  candidates section.

## Human access

Spec input I-7 and req-04f5's bullet "The human's counterpart is Kanri", as
updated on 2026-09-07. The principle was already the skill's practice — the
human's three windows were Sekkei for "what to build", Kanri for "how far
along", Kaiseki for "what is going on", and Jisso was never addressed — and
this section makes it the rule, with the exceptions as grants rather than as
a list of windows.

### The principle

By default a role has no human access. Jisso and an attached Kaiseki never
address the human unless granted. A role addresses the human directly only
for what needs the human's eyes or hands — a visual check in a browser or a
GUI, an OS dialog, a credential — and only after Kanri has judged it
necessary and granted it for that scope. Whether it is truly needed is
Kanri's judgment, not the role's.

This is protocol, not enforcement. Every role has its own window, the human
can type into any of them, and nothing in the harness routes one session's
chat through another. Two things stay outside the rule, and the contract says
so: the harness's own prompts (a permission dialog, the model-mismatch stop
of the start sequence) reach the human in the role's window and cannot go
through Kanri; and a human who speaks in a role's window unprompted gets an
answer, because silence costs more than the exception — the role then sends
Kanri one line, `human-contact: <one line on what was said>`, and treats
nothing beyond that exchange as granted.

### The lines

- The request, one line to Kanri:
  `human-needed: <what the human must do> — <why no other way> — <where: this window>`.
  The role idles until the answer.
- Kanri's ruling, one line back, recorded as `R-n`:
  `human-access: granted — <scope> — <until>` or
  `human-access: denied — <alternative>`.
- On a grant Kanri tells the human, as a numbered list: 1. go to `<role>`'s
  window, `<name> [<ref>]`; 2. do `<what>`; 3. come back. The role's direct
  exchange stays within the scope and ends with one line to Kanri,
  `human-access: done — <what the human did or decided>`, which Kanri notes
  in the ledger's Session events.

### The standing grants

Two grants are given without a request, so that the two windows the human
already uses survive as grants rather than as exceptions:

- **Sekkei's spec and plan dialogue.** Given at Sekkei's creation in Kanri's
  orders line at the handshake, as
  `human-access: granted — the spec and plan dialogue — until the plan is committed and the cold read answered`,
  and given again in the line that brings a kept Sekkei its next topic.
- **An attached Kaiseki's debugging conversation.** Written by Kanri in the
  brief's new **Human access** section — "the debugging conversation in this
  window, until the report is written", or "none, and why" — because
  debugging often needs what only the human knows about the environment.

A standalone Kaiseki has no Kanri; the human in the room is its counterpart,
and the term does not apply.

### Interaction with the other sections

Every escalation of an exit shoroku already goes to the human through Kanri;
this principle makes that the rule rather than a justification per role, and
the session-exit ADR candidate follows from it. The roles table's "Talks to"
column reads `human, Sekkei, Jisso, Kaiseki` for Kanri and
`Kanri; the human by grant` for the other three. The batch prompt restates
the default to Jisso as one Rulings line, as it restates the other overrides.

### Where it lives

- `SKILL.md` — a new section "Human access" between Messages and Session
  exit: the principle, the three lines, the two standing grants, the two
  things outside the rule; the roles table's three "Talks to" cells.
- `roles/kanri.md` — a new section "Human access" after Bug intake: the
  ruling on a request, the numbered list to the human, the two standing
  grants (the orders line at the handshake, the brief's section), the
  `human-contact:` line as information; the opening paragraph says Kanri is
  the human's counterpart; "On a handshake" step 4 carries Sekkei's grant in
  the orders line; the Kaiseki branch's step 2 fills the brief's Human access
  section.
- `roles/sekkei.md`, `roles/jisso.md`, `roles/kaiseki.md` — in the paragraph
  that names whom the role talks to: the grant it holds (Sekkei the dialogue,
  Kaiseki the brief's section, Jisso none), the `human-needed:` request in
  the contract's exact spelling and idling until the answer, conduct under a
  grant and the `human-access: done` line, and the `human-contact:` sentence;
  Kaiseki's standalone sentence names the human as its counterpart, and its
  "The run" paragraph scopes the human's direct talk to the brief's grant;
  Jisso's two "cannot talk to the human" clauses become "do not talk to the
  human unless Kanri grants it". In `SKILL.md`, the Messages bullet on
  permission boundaries routes blocked work to Kanri, and the stop-classes
  closing sentence says "the only stops that reach the human".
- `templates/batch-prompt.md` — one line under Rulings: "Human access: none
  unless granted. What needs the human's eyes or hands goes to Kanri as
  `human-needed:` first; idle until the answer."
- `templates/kaiseki-brief.md` — a "Human access" section after Task.

## Three small fixes

### issue-577b — a verbatim second quote, and a home for the checks

The paragraph under "The four SDD stop classes" in `SKILL.md` is a
paraphrase with different line wrapping from the quote in `roles/jisso.md`,
so the existing fixed-string search does not reach it. It becomes the same
blockquote, byte for byte including line breaks, introduced by one sentence
("Quoted verbatim, the same bytes as `roles/jisso.md` carries, so that one
fixed-string search checks both copies against the source") and followed by
the existing sentence that under `tanto` those four plus a scope or spec
change are the only items that reach the human, through Kanri. The check is
then one `grep -cF` of the line
`that norms say you ask about first (a merge, a push to a shared branch, a`
in three files — the superpowers source, `roles/jisso.md`, `SKILL.md` — each
expected `1`.

The checks live in a new living note, `docs/notes/tanto-consistency-checks.md`,
one concern, no frontmatter, its `# H1` the title, per `docs/notes/AGENTS.md`.
Its commands are lifted from the previous plan's Task 14 (steps 1 to 5:
files exist, in-skill paths resolve, templates cited by their copier, the
superpowers 6.3.0 and `shoroku` fixed strings, the wording invariants),
adjusted for the fifteen files and nine templates, plus the checks this
design adds. It states the superpowers version the strings were taken from
and writes the plugin cache path `$HOME`-relative as that task does, with the
Windows form using a `<user>` placeholder in a code span; no user-specific
path is committed. A future `tanto` plan's consistency pass is then one line,
"run every check in the note", and adding a check is an edit to the note. The
note is a plan deliverable, created and run in batch C; it is not a shoroku
excerpt. It is not a script because the repository's dev scripts are
`.bat`/`.sh` pairs under PowerShell lint, and a dozen greps do not justify a
new artifact kind.

### issue-3990 — the standalone clause

In `roles/kaiseki.md`, the paragraph's last sentence is replaced whole:

> "Cannot reproduce" is still a report. Write it, say exactly what you tried,
> and let Kanri decide whether Jisso reruns or the human is asked about the
> environment — standalone, there is no Kanri, and the human in the room
> decides.

### issue-2f1b — verification when the plan ships documents

A new section in `roles/jisso.md`, after "Your subagent layer":

> ## Verification when the plan ships documents
>
> subagent-driven-development's dispatch templates assume a test suite. A
> plan that produces Markdown — a skill, a document set, a template pack —
> has none, and its equivalents differ in kind. Substitute these, and say so
> in every dispatch:
>
> - lint on the changed paths, each named individually — a directory
>   argument makes every hook skip and proves nothing;
> - the content greps the plan states: required headings in order, exact
>   strings later tasks depend on, strings that must be absent;
> - a real YAML load of any frontmatter, never a regex — a colon followed by
>   a space in a value breaks it silently;
> - a JSON parse of any JSON the plan writes, where no hook parses JSON.
>
> The plan's "how a batch is verified" section names the commands; the
> implementer runs the task's checks and records their output before and
> after, which is the evidence SDD asks for. A **verification-only task** —
> one whose deliverable is the recorded output of checks and which creates
> no file — inverts the reviewer's standing instruction: tell the reviewer
> to re-run the checks rather than trust the report, because the output is
> the deliverable.

Its counterpart in `roles/sekkei.md`, Step 3, one clause under "how a batch
is verified": for a plan that ships Markdown, that section names lint on the
changed paths by name, the content greps, a real YAML load of any
frontmatter, and a JSON parse of any JSON the plan writes. The obligation to
write those commands is Sekkei's; the obligation to phrase them in a dispatch
is Jisso's.

## The artifacts table

`SKILL.md`'s artifacts table gains these rows, in its existing four columns:

| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| `.superpowers/sdd/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted |
| `.superpowers/sdd/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-proposal.md`, or the topic directory for Sekkei, or `.superpowers/sdd/exit-kanri-<date>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-direction.md`, or the topic directory for Sekkei | Kanri | the exiting session | Kanri's answer, item by item |

The Templates sentence below the table gains `templates/kanri-handover.md`
and `templates/bug-report.md` and reads nine.

## Where each change lives

The plan's File structure table is built from this. Every file is written
once, in its final form. For `roles/kanri.md`, the sections of this document
map onto the file as follows: "The start sequence" and "Kanri's Start,
reordered" into the opening paragraph and Start; "Kanri's checks at a
handshake" into On a handshake; "The loop, reordered" into The batch loop;
"The trigger", "The residency line", "The handover file", "Timing", and
"The handover, in a plan and between plans" into a new section **Handover**
placed after The Kaiseki branch; "The bug intake" into a new section **Bug
intake** after Shoroku; "Human access" into a new section **Human access**
after Bug intake; "Session exit" into a new subsection of Shoroku,
**Exit shoroku**, and into the lifecycle tables; "The default", "The
tables", and the residency paragraph into Session lifecycle. For the three
peer files: Sekkei's exit candidates, apply step, and boundary reply go into
"Your write and commit rule" as a second list, and its batch-sizing and
verification clauses into Step 3; Jisso's exit sentences go into "T2 — the
shoroku write-out", whose heading becomes "T2 and the exit — the shoroku
write-out"; Kaiseki's exit candidates and the two tree-discipline lines go
into "Tree discipline", its standalone exit sentence and standalone reporter
sentence into "Two ways you are started" under Standalone, and the
`kanri-address:` obligation into the paragraph that names whom the role
talks to.

| File | Changes |
| --- | --- |
| `skills/tanto/SKILL.md` | start sequence of two steps, with the `name [ref]` sentence under the handshake form; "The address" as a subsection under Handshake and roster, and the `kanri-address:` term below it; rule 10; rule 5's exit clause; the roles table's Kaiseki and Kanri cells, and its three "Talks to" cells reading `Kanri; the human by grant`; under Messages, the boundary-reply bullet (`committed <subject>` or `nothing to commit`, the pair Sekkei sends and Kanri waits for — a term two roles route on), the two bug-report paragraphs, and "Blocked work goes to Kanri, which rules on human access"; the "Human access" section; the "Session exit" section; the artifacts rows above and the nine-template sentence; the stop classes as a verbatim quote, closing with "the only stops that reach the human" |
| `skills/tanto/README.md` | Usage without rename and with `<kanri>` as the pasted name, the handshake paragraph kept and placed before the standalone-Kaiseki line; the intake bullet in What it does; the Relationship paragraph gains "and every session at its own exit"; Layout lists nine templates; the closing line names both designs |
| `skills/tanto/templates/roster.md` | address-book paragraph; Residency section; the between-plans Shoroku candidates section; the Events examples as listed |
| `skills/tanto/templates/batch-prompt.md` | `<kanri-address>` twice; the `Kanri — <name> [<ref>]` line in Setup on resume; the human-access line under Rulings |
| `skills/tanto/templates/kaiseki-brief.md` | `<kanri-address>` once; the "Human access" section after Task |
| `skills/tanto/templates/kanri-handover.md` | new, the handover skeleton |
| `skills/tanto/templates/bug-report.md` | new, the report skeleton |
| `skills/tanto/templates/kanri.md` | the Written column and the Stage values, with one sentence below the table that every write-out takes only the adopted rows marked `no` and fills the column with the commit subject; a "Hotfixes since the previous plan" line in Plan; Progress example gains "handover written"; Session events example gains a handover, a triage, an exit shoroku, a human access grant with its `done` line, and a `human-contact:` line |
| `skills/tanto/roles/kanri.md` | as mapped above: opening paragraph, now naming Kanri as the human's counterpart; Start; handshake check, with Sekkei's standing grant in the orders line; the loop; Handover; Bug intake; Human access; Exit shoroku; request lines with the real name; the Replace and Delete rows; the residency paragraph; the Kaiseki branch's steps 2 (the brief's Human access section) and 5 |
| `skills/tanto/roles/sekkei.md` | opening sentence, with the standing grant, the `human-needed:` request, conduct under a grant, and `human-contact:`; "send Kanri" three times and "ask Kanri" once; the `kanri-address:` obligation; the Step 3 verification, batch-sizing, and whole-tree stop-condition clauses; the exit candidates and apply step; the write-rule clause; the reply to the boundary line |
| `skills/tanto/roles/jisso.md` | opening sentence, with the `human-needed:` request, conduct under a grant, and `human-contact:`; "send Kanri" twice; the obligation; the verification section; the exit sentences in T2; the two "unless Kanri grants it" clauses |
| `skills/tanto/roles/kaiseki.md` | opening sentence, with the brief's grant, the `human-needed:` request, conduct under a grant, `human-contact:`, and the standalone counterpart sentence; "send Kanri" once; the obligation; "The run" scoped to the grant; the standalone clause; the standalone reporter sentence; the exit candidates; the two tree-discipline lines; the standalone exit sentence |
| `docs/notes/tanto-consistency-checks.md` | new, the checks |
| `.superpowers/sdd/<plan-basename>/handover-run.md` | new, untracked, T9's deliverable: the handover run's procedure and pass checklist for the human |

Unchanged: `templates/batch-report.md`, `templates/kaiseki-report.md`,
`templates/tanto.json`, the repo-root `README.md`, everything under
`docs/requirements/`, `docs/design/`, `docs/decisions/`, `docs/issues/`.

## What the plan must contain

Beyond the conventions of superpowers writing-plans and design-4807's "Plan
conventions under tanto":

- **Complete file contents in fenced blocks** for every file in the table
  above, so that each task is transcription plus verification and the
  whole-branch reviewer can diff the blocks against the tree. The prose
  around the blocks is short: reasons live in this document and the plan
  points here.
- **Nine tasks in three batches.** A: T1 `SKILL.md` and `README.md`; T2
  `roster.md`, `batch-prompt.md`, `kaiseki-brief.md`; T3 `kanri-handover.md`,
  `bug-report.md`, `kanri.md` (the ledger template). B: T4 `roles/kanri.md`;
  T5 `roles/sekkei.md` and `roles/kaiseki.md`; T6 `roles/jisso.md`. C: T7 the
  note; T8 the consistency pass, a verification-only task; T9 the handover
  run's procedure and pass checklist, written to
  `.superpowers/sdd/<plan-basename>/handover-run.md` and quoted in the plan
  like any other file.
- **The boundaries.** After A, the contract and the templates say no rename
  while the four role files still say `/rename`; that is a forward reference
  to B, and no role is replaced at that boundary (fixed inputs). After B the
  whole skill is consistent, and the batch B and C boundaries are the
  replacement points; this plan expects one Jisso throughout ("Sizing
  batches for one Jisso"). After C the checks pass. At the batch A boundary
  Kanri migrates the live roster ("The live roster").
- **Write-outs are outside the plan.** T1, T2, and every exit shoroku write
  under `docs/requirements/`, `docs/design/`, `docs/decisions/`, and
  `docs/issues/`, which no plan task touches. Global Constraints says so as
  an explicit exception to "never edit the unchanged list", so that a Jisso
  replaced at a boundary is not forbidden by its own prompt from writing its
  exit; and the whole-branch review package excludes exactly the commits
  whose subject begins with `docs: T<n> shoroku` or `docs: exit shoroku`,
  and says so to the reviewer, so that the plan-alignment diff sees only the
  plan's files. The note's own commit in T7 is plan output and stays in the
  package.
- **Global Constraints** carried from the previous plan, adjusted: the
  repo's `AGENTS.md` rules; models implementer `sonnet`, reviewer `opus`,
  escalation `opus`, never `fable` in a dispatch; branch `kanri-lifecycle`,
  no worktree, no push; never edit the unchanged list above; no role
  replacement before the batch B boundary; the `check-md-frontmatter` hook
  now parses every Markdown frontmatter, so the YAML-load step is the hook
  plus a fixed-string check that `SKILL.md`'s `description:` value contains
  no colon-space; `docs/superpowers/**` and `skills/**/templates/**` are
  markdownlint-ignored, `docs/notes/` is not, so the note keeps every
  `<placeholder>` in a code span; runtime text never names `skills/tanto/`;
  no commit hashes and no user-specific paths in tracked content; the
  `/rename` string appears nowhere in `SKILL.md`, `roles/*.md`, or
  `templates/*`.
- **How a batch is verified**, as below.
- Reports and prompts follow the tanto templates; the plan names nothing
  else about their shape.

## Verification

For each batch, in the plan's "How a batch is verified":

1. Lint the changed paths by name, every hook `Passed` or `Skipped`.
2. The frontmatter hook passes on `SKILL.md`, and the `description:` value
   contains no colon-space (a fixed-string grep on that line).
3. README drift reviewed in the task that edits `SKILL.md`.
4. Content greps per task: the required headings in order; the fixed strings
   later tasks depend on — `<kanri-address>` per file (`batch-prompt.md` 2,
   `kaiseki-brief.md` 1, `SKILL.md` 1), `kanri-address:` in `SKILL.md` and
   the three peer role files, `bug-report:` and the five `triage:` forms in
   `SKILL.md`, `exit-<role>` in `SKILL.md` and `roles/kanri.md`,
   `## Residency` and `## Shoroku candidates` in `roster.md`, the `Kanri — `
   line in `batch-prompt.md`, `Written` in `templates/kanri.md`, the rule 5
   exit clause and "no commit but its exit shoroku" in `SKILL.md`,
   `nothing to commit` in `SKILL.md`, `roles/sekkei.md`, and `roles/kanri.md`,
   `human-needed:` in `SKILL.md`, the four role files, and `batch-prompt.md`,
   with the full request line byte-identical in `SKILL.md` and the four role
   files, `human-access:` in `SKILL.md` and `roles/kanri.md`,
   `human-access: done` in the three peer role files, `human-contact:` in
   `SKILL.md` and the four role files, `the human by grant` three times in
   `SKILL.md`, `## Human access` in `SKILL.md`, `roles/kanri.md`, and
   `kaiseki-brief.md`;
   the
   strings that must be absent
   (`/rename`, `four-session`, `<plan>`, "a rename observed" in
   `roster.md`, "You do not commit" and "never write under `docs/` yourself"
   in `roles/kaiseki.md`, and "Kaiseki itself never writes under `docs/`" in
   `roles/kanri.md`).
5. Commit by explicit path with the trailer, confirmed.

The consistency pass in batch C runs every check in the note, which are: all
fifteen skill files exist; every in-skill path `SKILL.md` and the role files
name resolves; every template is cited by the role that copies it (nine
mappings: `kanri-handover.md` and `bug-report.md` from `roles/kanri.md`, the
seven existing ones unchanged); the superpowers 6.3.0 fixed strings from the
previous plan's Task 14 still hit; the stop-classes line hits once each in
the source, `roles/jisso.md`, and `SKILL.md`; the four-statuses line hits in
the source and `roles/jisso.md`; the wording invariants above; the
frontmatter parses; `templates/tanto.json` parses as JSON.

### The handover run

Batch C's last task delivers the written procedure and its pass checklist;
the run itself is the **real handover** of the resident Kanri, after T2 and
the merge decision of this plan, by the human, and is not a task. The
procedure: tell the resident Kanri "hand over"; it runs its exit shoroku and
commits; it writes `.superpowers/sdd/kanri-handover.md` and stops with the
"Kanri hands over" line; open a new session in this repository and run
`/tanto kanri`; when the successor asks, delete the old session. Pass: the
exit shoroku commit exists with its trailer; the handover file was written
from the template; the successor rewrote the roster with its own row first,
the old row `replaced`, the Residency line reset, and the Events line
written; every live peer received the `kanri-address:` line; the handover
file is gone; the successor states the next step from the handover file.
The result is recorded in the roster's Events, which survives the plan; a
run that fails is a bug report to the successor.

## Out of scope

The repo-root `README.md`; superpowers and `shoroku`; the contents of
`tanto.json`; Kaiseki in a worktree (issue-0673); a cross-repository progress
view (issue-3ca4); automatic discovery of the intake address; any change to
`docs/design/`, `docs/decisions/`, `docs/requirements/`, or `docs/issues/`
by a plan task — those are T1 and T2.

## Answers to the spec inputs

| Input | Answer |
| --- | --- |
| I-1 the topic and its scope | Adopted. All five issues are in; batches are cut by file rather than by issue (fixed inputs), the plan carries complete file contents, structural counts are task-time checks. |
| I-2 the rename question | Design (b), the human's choice: "Addressing without rename". |
| I-3 what the handover needs | Adopted with two changes: the trigger is the human's word or a noticed compaction, no count threshold yet, the counts live in the roster's Residency line; the old Kanri tells peers nothing and the successor tells each live peer once, since under design (b) the old address dies with the old session. The artifact's sections are I-3's list plus the Residency line. |
| I-4 the two design rules | Applied: the `kanri-address:`, `bug-report:`, `triage:`, and exit terms are in `SKILL.md`; each obligation is in the file of the role that performs it; the loop's new steps are in Kanri's file. |
| I-5 the bug-report flow | Adopted with the three agreed deviations and Kanri's additions: "The bug intake". The tracking paragraph is under the Issue outcome; the Sekkei clause is in the term paragraph. |
| I-6 session-exit shoroku | Adopted with the three recommendations the human accepted: "Session exit". Its batch-sizing half is "Sizing batches for one Jisso" — Sekkei's Step 3 clause, the Replace table's planned-replacement row, and this plan's expectation of one Jisso. |
| I-7 the human's counterpart is Kanri | Adopted as Kanri proposed, with the two feasibility limits stated in the contract: "Human access". The standing grants are the orders line and the brief's section; the roles table's cells read as proposed. |

## Deferred items

Items 1 and 2 become issues at T1; item 3 is a measurement added to two
existing issues.

1. **A count threshold for the handover.** The Residency line records
   batches, plans, and compactions per Kanri; once a few Kanri lifetimes are
   on record, choose a batch or plan count that triggers a handover before a
   compaction, or decide none is needed.
2. **The skill is edited in place while a run uses it.** The user-level
   `tanto` link points into this working tree, so a role started mid-plan
   reads a half-edited skill. This plan waits for the batch B boundary
   (fixed inputs); the general answer — a copy of the skill for the running
   roles, or a rule for every skill-editing plan — is open.
3. **Issues 15bf and 9a68 continue.** This run adds handshakes and up to two
   concurrent strong-model sessions to their measurements, in the ledger.

## Shoroku candidates from this spec work

For Kanri's `S-n` table:

- requirements: already written — req-04f5's bullet "Trouble reports reach
  the repository's Kanri, and Kanri answers them" and its checkpoint bullet,
  committed by Kanri on 2026-09-07 (fixed inputs); nothing left for T1.
- decision, **escalated**: the human's counterpart is Kanri, and a role
  reaches the human only under Kanri's grant for what needs the human's eyes
  or hands — the principle the session-exit ADR follows from (I-7).
- decision, **escalated**: every planned session exit carries its own
  shoroku, using decision-1f5f's split because no role but Kanri reaches the
  human unless granted, with Kaiseki committing under `docs/` at its exit —
  generalizes decision-1f5f and retires design-4807's "Kaiseki never
  commits" (spec review F-38); its reasoning follows from the ADR above.
- decision: addressing by born name, no rename, the roster as the address
  book — reverses the "uniqueness check, not an address book" reasoning of
  the 2026-09-06 design and design-4807, on the measured facts (a rename
  invalidates held addresses; the VS Code tab title is out of a skill's
  reach).
- decision: Kanri resident across plans with a handover at a boundary —
  reverses the one-plan default; req-04f5 changed first, the ADR records why.
- decision: Kanri may edit and commit a skill file outside a plan, the hotfix
  lane, with D-2's no-issue rule and D-3's plan-file exclusion — reverses
  design-4807's picture of Kanri as a role that owns no source file.
- design-4807: the start sequence (two steps), "The roster and the conductor
  ledger" (address book, Residency), Kanri's loop (the reorder, steps 4, 6,
  7), the lifecycle section (residency, handover, the successor's start, the
  identity check), the templates count (nine), a new "Bug intake" section, a
  new "Session exit" section with Kaiseki writing `docs/` at its exit (its
  Kaiseki paragraphs "never commits, never fixes" and "never writes under
  `docs/`" and its skill-layout paragraph on rule 5 and the roles table
  change with it), the notes entry as the home of the consistency checks,
  and a second set under "Where the delivered skill differs from the design
  document" for this design.
- issues: the five issues this design closes — 1c70, 77a1, 577b, 3990, 2f1b
  — move to `docs/issues/resolved/` at T2, and 770d closes with the dogfood
  report; deferred items 1 and 2 are filed at T1.
- report: the dogfood of this run (issue-770d), from the conductor ledger,
  including the handover run's result and the hotfixes since the previous
  plan (D-2).
- note or report: the VS Code extension's tab title is not reachable from a
  skill, a slash command, a hook, or a setting; the rename reaches only the
  session name.
