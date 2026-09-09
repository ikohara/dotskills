# Design: context cost in tanto — the transcript reading, the frame read, and what a compaction changes

`tanto`'s sessions are long-lived, and the charge for one scales with its
context length first and its wake-up count second: the Account & Usage view of
2026-09-09 attributed 89% of a day's usage to sessions over 150k context, and a
resident Kanri re-reads its whole context on every message, notice, and human
turn it receives. The skill has no measure of that cost. It names one signal a
session can see about itself — a compaction already noticed — and rules out
the `tokens left` figure; the Residency line counts batches and plans, which
issue-40ed shows are not the cost; and Kanri's cold read of a plan is its
largest single input and stays in its context for the rest of the run
(issue-5830).

This design gives every session one **reading** of its own transcript — bytes,
records, wake-ups, compactions — taken at its boundaries and sent with the
lines it already sends; makes the roster's Residency a table of those readings
and adds an archive that keeps them across runs, so that a threshold can be
chosen from data later; turns Kanri's cold read into a read of the plan's
**frame** with the passage blocks taken on Sekkei's dry-run report; makes a
peer's compaction a replacement condition, as Kanri's own already is; treats
what a compaction summary attributes to the human as unverified until the
human confirms it; ends the reuse of a Sekkei across topics; and closes four
small `tanto` items on the way. The files are `skills/tanto/SKILL.md`, the
four role files, four templates and one new one, and the README.

Scope: issue-5830; issue-e5a2, proposals 2 and 3 taken and proposal 1
answered by demotion to a verification read; issue-40ed (the instrument, not
the number); issue-7d14; issue-b9a4, all three cases; issue-dc72; issue-3a33;
issue-9a68 (a Measurements row only); issue-42be, a session resumed under a
new name rejoins the run (spec input I-2); and the ruling recorded as
`context-cost S-1` in the ledger, which this spec supersedes. At T2 the plan
moves to `resolved/` issue-5830, issue-e5a2, issue-7d14, issue-b9a4,
issue-dc72, issue-3a33, and issue-42be; issue-40ed and issue-9a68 stay open
until the data they wait for exists. Not in: issue-9d17 (the human's word,
Q-6), and the rest of the small tanto items the human plans to sweep after
this topic — issue-12d3, issue-867f, issue-f2ec, issue-15bf, issue-9d17,
and issue-f2c4 are that sweep's scope. One Kanri commit rides this branch
outside the plan, "docs(issues): tanto keeps both untracked directories at a
plan close" (issue-12d3); the plan names it wherever it states what the
merge base should show.

## Fixed inputs

Decided before or during the dialogue, not reopened here. Each names the
requirement it serves.

- **Scope (Kanri's R-1; dialogue Q-1, Q-2).** The items above, at the
  human's word "推奨でいい" on Sekkei's recommendation, plus Sekkei's two
  additions the human took ("両方入れる"): the roster's Events rotate into
  an archive, and every role measures itself. Serves req-04f5 (Kanri is
  resident and hands over before it decays, "ideally by its own detection")
  — the reading is that detection.
- **Parallel run, then a branch (R-2).** The dialogue ran while
  requirement-extraction was in its final batch, as untracked files in the
  topic directory; the branch `context-cost` was cut from `main` after that
  plan merged, on Kanri's word, and this spec is committed on it while no
  batch is in flight. Serves req-04f5's checkpoint discipline; adds nothing
  to it.
- **Rule 11 applies (R-3).** The plan edits the files the run's sessions
  load. The boundary from which a role may be started or replaced is the
  final one, batch B, because Kanri's role file in batch B answers what the
  contract in batch A introduces; until then the authority is the plan's
  Global Constraints, Kanri's orders line, and the batch prompts
  (decision-5c8e: a plan that edits tanto runs on the skill it is editing).
  Serves req-04f5 (state lives in files; small batches).
- **A peer's compaction is a replacement condition (Q-3, "推奨（対称）").**
  One compaction in Jisso's reading means replacement at the next boundary,
  exit shoroku first; one in Sekkei's means replacement at its next commit;
  one in Kaiseki's, at its report. Kanri's own trigger has said this since
  decision-de63; the peers now say the same. The alternative, keeping the
  evidence-of-loss condition and only recording the compaction, was put and
  not taken. Serves req-04f5 (a replacement is a planned step, never a
  mid-batch loss).
- **The instrument is one fixed reading in the contract (Q-4, "推奨で").**
  Four figures by a grep pipeline over the session's own transcript, defined
  once in `SKILL.md`, run by every role, reported in what it already sends,
  copied by Kanri into the roster. Rejected: a script under
  `skills/tanto/scripts/` (the skill's first non-Markdown file, a lint and a
  runtime surface); Kanri reading every peer's transcript itself (the peer's
  config directory and the host's permission class are not Kanri's to
  assume — on this machine alone the transcripts of this project sit under
  two config directories). Serves req-04f5 (Claude Code only, and says so;
  composes without modifying).
- **A Sekkei is never reused across topics (D-2', the human's rule).** "Sekkei
  って、どうせ human との対話が必要になるから、再利用したって human の手が
  必要になるでしょ": reuse would spare the human nothing, since the next spec
  needs the dialogue either way, and what the old session carries — the
  previous spec, plan, and reviews — is on disk and in the spec inputs,
  while its context would be re-read at every wake-up of the new topic. The
  other reuse conditions were reviewed from the same viewpoint and stand:
  Jisso within a plan (a replacement needs the human's hands, Jisso needs
  nothing else from the human, and the in-plan state is in `progress.md`),
  Kanri across plans (req-04f5 and decision-de63; the between-plans work has
  no other owner), Kaiseki per case, and a resume after a restart, which is
  the same context under a new name and not a reuse. The ledger's S-1 ("a
  kept Sekkei is reused only when its context is short") is superseded.
  Serves req-04f5 (the human is interrupted only at defined checkpoints;
  the spec dialogue is one).
- **No threshold is chosen (dialogue Q-1, item E).** The archive's rows are
  the dataset; the number that fires a handover or a replacement on cost is
  a later ADR's, once enough sessions have ended. Serves req-04f5 as it
  stands; decision-de63's two triggers are unchanged.
- **The dry run is one record, not two (Sekkei's addition, issue-7d14).**
  Taken up because the cold read (issue-5830) needs the dry-run report as a
  named artifact anyway: Sekkei runs the plan's commands once and writes
  `plan-dryrun.md`; the plan reviewer reads that report and spot-checks
  rather than re-running the set. Added by Sekkei after the dialogue's scope
  question; the review brief puts it to the human. Serves req-04f5 (small
  batches; the human reviews through a brief).
- **Design sections D-1 to D-4 as put (dialogue, four "OK"s).** The
  instrument, the rules, the small items and the contract edits, and rule
  11 with the batches and the verification, each approved as presented and
  written out below.
- **A resumed session rejoins through `/tanto resume` and a self-check at
  its boundaries (I-2; Q-5, "じゃあ Q-5 OK").** The transcript path is the
  stable identity, the human's word per window is `/tanto resume` — the
  human's own form, "これは「/tanto resume」になる？ よね？" — and the
  self-check runs at each boundary, not at every wake-up; the alternative,
  one `ListAgents` per turn, was put and not taken. Serves req-04f5 ("A
  session resumed under a new name rejoins the run as easily as possible").
- **issue-9d17 stays out (Q-6, "推奨（外す）で").** A start-time tidiness
  check, for the small-items sweep. Serves nothing here; named so that the
  sweep's scope is the remainder.

## The cost, measured

Facts this design rests on, measured by the resident Kanri on 2026-09-09
(issue-e5a2, issue-40ed, issue-5830) and by Sekkei during this dialogue on the
same day, on this Windows host.

- **The transcript resolves.** With `CLAUDE_CONFIG_DIR` set, this Sekkei's
  transcript was at
  `C:\Users\<user>\.claude-priv\projects\c--Users-<user>-devel-dotskills\<session id>.jsonl`,
  the session id being the directory the scratchpad path names. After about
  25 minutes: 0.71 MB, 168 records, 24 records of `type: user`, of which 17
  were tool results and 7 were wake-ups. A Windows backslash path works
  unchanged in Git Bash.
- **A wake-up is a user record without a tool result.** issue-e5a2 counted
  every `type: user` record as a wake-up (618 for the kanri-lifecycle
  Kanri); a tool result is also a `type: user` record, so that figure
  over-counts by the tool calls. The corrected count is the user records
  whose line carries no `tool_result`. On that 8.6 MB transcript the grep
  reading and a JSON parse agree exactly: 618 user records, 534 tool
  results, 84 wake-ups, 1 compaction — the headline figure was seven times
  the wake-ups. On six shorter transcripts the two agree within one.
- **The compaction check must be typed.** On the seventeen transcripts of this
  project under the current config directory, the check on record type plus
  text prefix finds exactly one compaction — the 8.6 MB kanri-lifecycle Kanri
  that issue-e5a2 reports — while a plain grep for the phrase finds it in
  three uncompacted files as well, quoted in a script or a tool output. The
  phrase is `This session is being continued from a previous conversation`
  and it is the harness's.
- **The ref is not the session id.** `ListAgents` prints
  `dotskills-04 [77f43d]` for a session whose id begins `be3f768a`; nothing a
  peer can see leads to the transcript, so the path has to travel in the
  handshake.
- **Two config paths, one transcript store.** `.claude-priv` and `.claude`
  both hold this project's seventeen transcripts here, and the two copies of
  a file share one inode: one store under two paths, because the config
  directory moved during the runs. A session's own transcript is under the
  path its own environment names, and nothing a peer can see says which.
- **A resume keeps the session id and the transcript, and leaves no mark.**
  Kanri's transcript for the resumed `dotskills-e0` → `dotskills-08` is one
  file with the same `sessionId` on every record, a 32-minute silence at the
  editor restart, and no record of the resume: the only `SessionStart` hook
  records are `startup` at the true start (a compacted transcript carries
  `SessionStart:compact`). The name and the `[ref]` change; the path does
  not; and a session sees its own resume only in `ListAgents`.
- **The frame of a plan is a third of it, or less.** The frame command below,
  which keeps everything outside the task steps, prints 631 of the
  requirement-extraction plan's 1891 lines, 497 of boundary-rules' 1796, and
  582 of review-brief's 3090 — the plan issue-5830 measured at about 65k
  tokens read whole.
- **The roster is 511 lines and 36 KB** at this topic's start; every role reads
  it at its start, and Kanri rewrites it at every handshake and boundary.
  Its Events list holds four plans' worth of lines.

## The transcript reading

The reading is defined once, in `skills/tanto/SKILL.md`, as a new section
`## The transcript reading` between "Handshake and roster" and "Messages".
The text, wrapped at the file's 80 columns:

````markdown
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
````

Portable by construction: `wc`, `grep`, and `echo` only, no `stat` flag, no
JSON tool. The pipeline was run on this host against a JSON parse (see "The
cost, measured").

### Who reads, and where the reading goes

| Role | When | Where it goes |
| --- | --- | --- |
| every role | at the handshake | `transcript=<absolute path\|unavailable>` on the handshake line — the path, not the figures, since the figures at start are the baseline zero and the path is what Kanri cannot otherwise learn |
| Jisso | at every batch boundary and at its exit lines | a `- Transcript — <reading>` line in the batch report's header list, from `templates/batch-report.md`; appended to the `exit write-out` line |
| Sekkei | at every boundary reply and at its exit lines | appended to `committed <subject>` or `nothing to commit`, to the plan-committed line, and to the `exit write-out` line |
| Kaiseki | at its report and at its exit lines | a `- Transcript — <reading>` line under "Tree state on exit" in `templates/kaiseki-report.md`; appended to the `exit write-out` line |
| Kanri | at every trigger check — loop step 6 in a plan, every turn between plans | its own Residency row, and the residency lines it prints to the human |

Which files spell what: `SKILL.md` alone carries the literal line, in the
`echo` of the pipeline; every other place — the four role files, the three
report and handover templates, the residency lines — carries the placeholder
`<reading>`, and the verification below checks each copy by its own full
string (design-4807's one-spelling rule for a cross-role line). The handshake
line lives only in `SKILL.md`; no role file quotes it.

The handshake line in `SKILL.md` becomes:

```text
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> branch=<branch> mode=<permission mode|unknown> transcript=<absolute path|unavailable>
```

with one sentence after the `mode=` paragraph: `transcript=` is the path of
this session's own transcript per "The transcript reading", so that Kanri can
record it and, where its session may read that path, verify a reading it
doubts.

## The roster: a Residency table, and an archive

### `skills/tanto/templates/roster.md`, the Residency section

The one-line Residency becomes a table, one row per live session, Kanri's
first. The section's text:

```markdown
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
```

The Keeping rule's bullet "Rows are never deleted, so the run stays readable
after a replacement" becomes: a dead, replaced, or refused row stays, with its
Residency row, until the plan closes, then both move to the archive as one
row, so the run stays readable and the roster stays short. The Events section
gains one sentence: at a plan close, the closed plan's lines move to the
archive.

### `skills/tanto/templates/roster-archive.md`, new

The eleventh template, copied by Kanri at the first plan close that has
something to move:

```markdown
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
```

The roster's Name history paragraph and its Shoroku candidates table stay in
the roster: the first is short and the second is a between-plans working
table, not a record.

## Kanri's rules

All in `skills/tanto/roles/kanri.md` unless a heading says otherwise.

### The cold read reads the frame

"When the plan lands", step 1, currently reads the plan and the spec whole.
It becomes:

> Cold-read the spec whole and the plan's **frame** — everything outside the
> task steps: Global Constraints, File structure, each task's head down to its
> first step, Batches, How a batch is verified, the sweeps, and the
> Self-Review — as the frame command above prints it. The steps' passage
> blocks and commands you take on Sekkei's dry-run report,
> `.superpowers/sdd/<topic>/plan-dryrun.md`, which the plan-committed line
> names, plus one command of your own that checks every anchor the plan
> names against the tree; a plan that has no dry-run report is read whole.
> Send Sekkei one line per open question. Wait for its pointer: ...

with the rest of the step as it is. The frame command sits before the
numbered list, introduced by one sentence ("The frame command, from the
repository root, with `P` the plan path:"):

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

It prints the plan with each task's steps — from the task's first
`- [ ] **Step` line to the next heading — replaced by one `[steps: N lines]`
marker, and it tracks fences so that a heading quoted inside a block does not
end the skip. It depends on the plan shape writing-plans produces and the
passage plans of this repository keep: tasks under `### Task`, steps as
`- [ ] **Step`. A plan in another shape prints whole, which is the safe
failure.

The cut is wider than issue-5830 proposed — the whole step, not only its
fenced blocks — because a step's prose is instructions to the implementer
that the dry run and the reviewer already read, and the measured frame at a
third of the plan is what makes the read cheap. What the cold read loses:
the passage blocks and the step prose, which Sekkei's dry run verified
mechanically and the anchor check pins to the tree; what it keeps:
everything Kanri's judgment used at the two cold reads on record
(review-brief R-6, requirement-extraction R-4). The second of those is the
rule's second data point, applied by ruling before this design.

### `skills/tanto/roles/sekkei.md`, Step 4 — one dry run, one report

Step 4 becomes, in this order:

1. Run every verification command the plan states, once, on this machine, on
   scratch copies with the passages applied, and write
   `.superpowers/sdd/<topic>/plan-dryrun.md`: the application script's path,
   then each command, its output, and the plan's expectation. A command that
   has never been run is a placeholder in a command's shape; fix the plan,
   not the expectation.
2. Dispatch the read-only reviewer on `subagents.reviewer` with the
   writing-plans checklist **and the dry-run report**: it reads the report
   and spot-checks a few of its commands rather than re-running the set, and
   writes `plan-review.md` with its Shoroku candidates section; rule, then
   send Kanri the report path.
3. Check spec conformance and the batch cuts yourself (today's item 2, its
   text unchanged).
4. Lint the changed paths (unchanged).
5. `review-ready:` and the brief (unchanged).

The plan-committed line becomes
`plan committed: <plan path>; dryrun: <dry-run path> — <reading>`. The
`SKILL.md` Artifacts table gains the row for `plan-dryrun.md` (writer Sekkei;
readers the plan reviewer and Kanri; "each verification command of the plan
run once on scratch copies, with its output and the expectation").

### The trigger check takes the reading, and may verify a peer's

"The trigger" keeps its two signals. Its paragraph on what is not a signal
("Not the `tokens left` figure ... The residency counters are recorded so that
a threshold can be chosen later.") is replaced by:

> Not the `tokens left` figure the harness prints in its reminders, whose
> unit is not documented as the context window and whose presence is not
> guaranteed; not a batch or plan count, for which the data points are still
> few; and not a threshold on the reading, because none has been chosen. At
> every check take your own reading (`SKILL.md`, "The transcript reading")
> and rewrite your Residency row with it: a compactions figure of `1` where
> you noticed none is the second signal, seen in a file, and counts as
> noticed. The Residency rows, and the archive's rows across runs, are the
> data a threshold on cost will be chosen from, by an ADR, once enough
> sessions have ended (issue-40ed).

Under "Session lifecycle", a new subsection **Readings** after the Create,
Replace, and Delete tables:

> Every role sends its reading with its boundary and exit lines, and Jisso's
> and Kaiseki's reports carry it; copy each into that role's Residency row at
> loop step 6, with the boundary it was read at. A reading you doubt — a
> session whose report lost a ruling with `0 compactions`, or one that sent
> `unavailable` — you may verify with the same pipeline on the path its
> handshake carried, when that path is one your session may read; a read
> that is denied or fails leaves the self-report standing, marked
> `(unverified)`. Never ask a peer to read a transcript for you.

### A compaction in a peer

The Replace table's Jisso row and two new rows:

| Symptom | Action |
| --- | --- |
| Jisso context decay — its reading shows a compaction, two consecutive batches needed escalation, or a report says compaction lost rulings | at the batch boundary, ask the human to delete and create; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then ask the human to delete and create; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then ask the human to delete it and, if the case is open, create a new Kaiseki with the same brief |

The Delete table's Sekkei row loses its last clause. "Sekkei is done; delete
it after its exit shoroku is committed, or keep it for the next spec" becomes
"Sekkei is done; delete it after its exit shoroku is committed — a Sekkei is
never kept for the next topic: the next spec needs the human's dialogue
whether the session is old or new, what it carries is on disk and in the spec
inputs, and its context would be re-read at every wake-up of the new topic".
The Create table's Sekkei row is unchanged: a Sekkei is created when the
first batch of the current plan is accepted or no plan is in flight, and the
human may decline.

### What a compaction summary says the human said

Three rules, one per place.

**Every role** (`SKILL.md`, a closing paragraph of "The transcript reading"):

> A session whose reading shows a compaction it has not yet reported writes
> every item its summary attributes to the human — "the human said", "ruled",
> "saw", "confirmed" — one per line, to
> `.superpowers/sdd/<plan-basename>/compaction-<role>-<n>.md` (the topic
> directory for Sekkei; `<n>` one more than the highest such file for that
> role, so that a second compaction or a replaced session does not overwrite
> the first), names the file in its next line to Kanri as
> `compacted: <path>`, and until Kanri answers `confirmed: <path>` acts on
> none of those items beyond finishing the task in hand. Two sessions have no
> Kanri to answer: Kanri itself, whose own case is its handover file, and a
> standalone Kaiseki, which puts the items to the human in its own window.
> What the harness summarizes is not the human's words; the human's words
> are in the dialogue file, the ledger, and the human's own window.

**Kanri** (`roles/kanri.md`, the Readings subsection, continued):

> On `compacted: <path>` read the file, put each item to the human in your
> own window as a numbered list, record the answers as `R-n`, rewrite the file
> with `confirmed`, `corrected: <the human's words>`, or `denied` beside each
> item, and answer `confirmed: <path>`. A report's claim of the form "the
> human saw X" or "the human ruled Y" from a session whose reading shows a
> compaction is unverified until the human confirms it here, and no
> severity-high issue is filed on such a claim alone.

**Kanri's own compaction** (`templates/kanri-handover.md`, "Rulings the next
batch inherits"): a ruling known only from the compaction summary is marked
`(unverified)` on its line, and the successor puts it to the human at its
first boundary. The template's Residency section becomes "Kanri's Residency
row from the roster, verbatim, with its last reading", one row, followed by
one bullet, "The reading taken when this handover was written — <reading>",
so that the handover carries the reading in the one spelling every copy
uses.

### The residency lines to the human

"The residency line" keeps its two forms and gains the reading after the
counts:

```text
Kanri stays — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover not due.
Kanri hands over — <name> [<ref>] — <n> batches, <m> plans since <YYYY-MM-DD>, <k> compactions noticed — <reading>; handover written.
```

Its paragraph "The same counts go into the roster's Residency line, which you
rewrite at every boundary and plan close" says "row" and "table" instead.
`<k>` stays the count of compactions you noticed, incremented as today and
left incremented by a declined handover (decision-de63); the reading's
compactions figure is a separate column, and a `1` there you had not noticed
increments `<k>` when you read it.

### The plan close moves the record to the archive

The Delete table's last row ("Jisso is deleted and the ledger's Progress line
says closed") gains, in its Say column: "...prints the residency line, moves
the dead, replaced, and refused rows with their last readings and this plan's
Events lines to `roster-archive.md` — from `templates/roster-archive.md` when
the file does not exist yet — fills the ledger's Measurements fixed row, and
waits for the next topic". And because the archive is untracked and dies
with a workspace wipe, T2's direction (step 2 of "T2") carries the roster's
Residency rows of the run, so that the dogfood report's Measurements table
keeps under `docs/reports/` the readings the archive will hold — the human's
answer to the first point under "Open for the human at the review".

## A resumed session rejoins the run

The transcript path the handshake now carries is the identity that survives a
resume (see "The cost, measured"), so a resumed session can be matched to its
row without the human naming it. Four pieces.

### `SKILL.md`: the fifth invocation word, and a Resuming section

The Invocation table gains a row, `resume` → `resume`, and the sentence
"Any other word: say the role is unknown, list those four ids, and stop"
says "those five". `/tanto resume` skips the start sequence — no model check,
no first handshake — and runs the section below, placed after "The
transcript reading":

````markdown
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
````

### `templates/roster.md`: the Transcript column

The address book gains a last column, `Transcript`, holding the path the
handshake carried, `unavailable` when it carried that. The Keeping rule's
"Every handshake rewrites that role's row in full" gains: a handshake whose
`transcript=` matches a row is that row's session resumed, and rewrites the
row in place with the new name and `[ref]`, status `live`. The archive's
Sessions table does not carry the column.

### The role files: the self-check at the boundary

One sentence in each, at the point where the role sends its boundary line:
"Before the line, run the self-check of `SKILL.md`'s Resuming — one
`ListAgents`; a name that is not your row's means you were resumed, and the
handshake goes first." For Jisso that is "At the boundary" step 2, for Sekkei
the boundary reply, for Kaiseki the report's one line, for Kanri the trigger
check at loop step 6 and every turn between plans.

### `roles/kanri.md`: the fifth start case, the handshake match, the recovery

"The four cases" become five. **Resumed Kanri** — no handover file, the
first data row is another name that is not listed, and that row's
Transcript column is your own transcript path: this is your own conversation
resumed under a new name; rewrite the first row, send the `kanri-address:`
line of `SKILL.md`'s Resuming to every listed peer, and continue where the
ledger's Progress line says — no row is marked `dead`, no tree recovery
beyond `git status`. The Recovery case keeps its condition with one more
clause, "and its Transcript column is not your own path". "On a handshake"
gains the match: a handshake whose `transcript=` equals a row's Transcript
column is that session resumed; rewrite the row, write the Events line, and
send nothing but your address. "Recovery after a VS Code restart" becomes
the many-at-once procedure: the human types `/tanto resume` in your window
first, which is the Resumed Kanri case, then in each other window; mark
`dead` only a row whose session neither lists nor re-handshakes by the time
the human says the windows are done; then ask for the roles still missing,
in the order the section already gives.

## The small items

- **b9a4, the identifiers — three cases.** (1) Kanri's exit-file pattern
  gains the bare name: `SKILL.md`'s "Session exit" paragraph says "the date
  and the bare name for Kanri (`exit-kanri-<YYYY-MM-DD>-<name>`)", its
  Artifacts row and `roles/kanri.md`'s "Your own exit" paragraph use the same
  pattern, and the ledger template's Stage cell mirrors it as
  `exit:kanri-<YYYY-MM-DD>-<name>`. The evidence is on disk:
  `.superpowers/sdd/exit-kanri-2026-09-09-proposal.md` and
  `exit-kanri-2026-09-09-b-proposal.md`. The other roles' patterns are
  unchanged. (2) A reference to an `S-n` or `R-n` from outside its own
  ledger — the roster, a handover file, another ledger — names the topic
  first, `context-cost S-1`; bare numbers stay bare inside a ledger. (3) The
  Written column takes only values a filter can read: `no`, a commit subject,
  or `superseded: <topic> R-n`, the last counting as written; a candidate
  with two stages is split into two rows when the second stage is
  identified, never written as a compound value. Cases 2 and 3 are two
  sentences at the end of "The adoption rule" and the same two in the ledger
  template's paragraph under the `S-n` table.
- **dc72, the Models table.** `roles/jisso.md`'s table gains one row: "the
  review brief writer" → "`subagents.reviewer`, Kanri's dispatch and not
  yours". The table stays in `roles/jisso.md`.
- **3a33, the reference translation.** "The adoption rule" gains one sentence
  after its two-item list: an escalated item whose wording is in a language
  other than the chat's is put to the human as the original followed by a
  reference translation in the chat's language (req-04f5). The three places
  that say "ask the human the escalated items" — T0 and T1, T2 step 2, Exit
  shoroku step 2 — each gain ", original then reference translation,", so
  that the rule is read where it is applied; two of the three old passages
  wrap across lines, so the plan quotes each as it wraps and the check
  counts three.
- **9a68, the concurrency measurement.** `templates/kanri.md`'s Measurements
  table's example row, which already names this measurement, becomes the
  fixed row: "strong-model sessions active at once, the peak, and whether a
  429 was seen" — filled at the plan close, by the Delete row above, from
  the ledger's Session events, where Kanri writes one line each time a third
  strong-model session goes live. Rule 9 is unchanged; the ADR that keeps,
  relaxes, or replaces it reads the ledgers.

## Where each change lives

The table lists the passage that defines each change and every passage that
quotes the line it changes; the spec review found that a table of this kind
drifts by listing definitions and missing quotes, so the plan's whole-tree
sweep greps the terms below in every file of the skill rather than trusting
this table.

| File | Change |
| --- | --- |
| `skills/tanto/SKILL.md` | the Invocation table's `resume` row and "those five"; the section "Resuming"; the section "The transcript reading" with its closing compaction paragraph; the handshake line's `transcript=` and its sentence; the Messages bullet on the boundary reply saying the reading is appended; the Session exit paragraph's Kanri pattern and its `exit write-out committed:` line, which carries the reading; the Artifacts rows for `plan-dryrun.md`, `roster-archive.md`, `compaction-<role>-<n>.md`, and the changed Kanri exit path; "There are eleven" and `templates/roster-archive.md` in the templates list |
| `skills/tanto/roles/kanri.md` | the fifth start case and the Recovery case's added clause; the handshake match in "On a handshake"; "Recovery after a VS Code restart" as the many-at-once procedure; the self-check at loop step 6 and between plans; the frame command and step 1 of "When the plan lands", and the sentence before the list that describes the plan-committed line; the trigger paragraph; the residency lines; the Readings subsection with the `compacted:` handling; the Replace rows; the Delete rows for Sekkei and the plan close; "Your own exit"'s pattern; the adoption rule's three sentences (b9a4 cases 2 and 3, 3a33) and the three escalation clauses; the commit window's quote of Sekkei's boundary reply, which now carries the reading; the Exit shoroku step 3 quote of `exit write-out committed:`; the three places that say "Residency line" (the bootstrap step, the Handover case, loop step 6), which say "Residency row"; the human-access item that gives the dialogue grant "again when you give a kept Sekkei the next topic", which loses that clause |
| `skills/tanto/roles/sekkei.md` | the self-check before the boundary reply; Step 4 reordered with `plan-dryrun.md`; the plan-committed line; the boundary reply and exit lines carrying the reading; the opening paragraph's "given again with each new topic", which becomes "given at your creation" |
| `skills/tanto/roles/jisso.md` | the self-check at "At the boundary" step 2; the batch report's Transcript line named there; the exit line carrying the reading; the Models table row |
| `skills/tanto/roles/kaiseki.md` | the self-check before the report's one line; the report's Transcript line named under "Tree state on exit"; the exit line carrying the reading |
| `skills/tanto/templates/roster.md` | the Transcript column and the resume sentence in the Keeping rule; the Residency table; the Keeping rule bullet on dead rows; the Events sentence |
| `skills/tanto/templates/roster-archive.md` | new |
| `skills/tanto/templates/kanri.md` | the Measurements fixed row; the Stage cell's Kanri pattern; the two Written-column sentences |
| `skills/tanto/templates/batch-report.md` | `- Transcript — <reading>` in the header list |
| `skills/tanto/templates/kaiseki-report.md` | `- Transcript — <reading>` under "Tree state on exit" |
| `skills/tanto/templates/kanri-handover.md` | the `(unverified)` marking in Rulings; the Residency section as one row |
| `skills/tanto/README.md` | the templates list gains `roster-archive.md`; a sentence on the reading where the README says state lives in files; `/tanto resume` where the README lists the invocation; the list of designs the skill implements gains this spec |
| `docs/notes/tanto-consistency-checks.md` | the Versions bullet says seventeen skill files, eleven templates; check 1 lists the new template and expects seventeen; check 2 expects fifteen `ok` lines; check 3's map gains `templates/roster-archive.md skills/tanto/roles/kanri.md` and expects eleven; check 6 replaces the two Residency-line pins with pins on the new Residency table header in both files, adds `transcript=`, `compacted:`, and `confirmed:` as routed strings, and its expected number sequence and prose follow |

Not changed by the plan: `templates/batch-prompt.md`,
`templates/bug-report.md`, `templates/kaiseki-brief.md`,
`templates/review-brief.md`, `templates/tanto.json`, and every file outside
`skills/tanto/` and the note. `docs/design/4807-tanto.md`'s "ten templates,
sixteen files" and its kept-Sekkei bullet are T2's, under the adoption rule.

## Requirements

- **req-04f5, "Kanri is resident and hands over before it decays"** — served
  as it stands: "ideally by its own detection" is the reading, and the
  bullet's "always at a boundary" is unchanged.
- **req-04f5, "Escalated wording reaches the human in the chat's language
  too"** — served by the 3a33 sentences; the requirement exists, the role
  text did not.
- **req-04f5, "A session resumed under a new name rejoins the run as easily
  as possible"** — served by "A resumed session rejoins the run": one
  `/tanto resume` per window, no address, no `dead` rows.
- **Candidate bullet for the human at T1, req-04f5:** "A session's cost is
  measured, not guessed. Every role reads its own transcript at its
  boundaries, the roster keeps the readings of the current run, and the
  archive keeps them across runs." The measurement obligation only; what is
  chosen from the data is a later decision's. Kanri escalates it under the
  adoption rule; this spec does not decide it.
- **Two ADR candidates for the human at T1**, under decision-1f5f. Both meet
  `docs/decisions/AGENTS.md`'s test — a choice among real alternatives with
  lasting consequences — and the spec review found the spec's earlier claim
  of "no ADR changes" resting on a test the criterion does not have. (a) A
  peer's compaction is a replacement condition: extends decision-de63's
  second trigger to Jisso, Sekkei, and Kaiseki; the rejected alternative is
  the evidence-of-loss condition. (b) A Sekkei is never reused across
  topics: supersedes the ledger's S-1 and reverses design-4807's measured
  bullet that "a kept Sekkei given the next topic costs none"; the rejected
  alternative is reuse when the context is short. decision-de63's own two
  triggers stand. The threshold ADR is deferred, below.

## What the plan must contain

- **Global Constraints**, from the repository's `AGENTS.md` and `tanto.json`:
  American English; lint on the changed paths; commits by explicit path
  with the `Co-Authored-By` trailer; no edit to agent instruction files or
  repo-root Markdown; implementers on `sonnet`, every review on `opus`, fix
  rounds 4-5 on `opus`; and the rule 11 sentence: the final boundary, batch
  B, is the boundary from which a role may be started or replaced, and until
  then the authority for the run's sessions is these constraints, Kanri's
  orders line, and the batch prompts.
- **Two batches of four tasks, one Jisso.** Batch A, the contract and the
  peers: task 1 `SKILL.md` (the reading, Resuming, the invocation row, the
  handshake, the lines, the exit pattern, the Artifacts rows, the templates
  count); task 2 `templates/roster.md` (the Transcript column, the Residency
  table, the keeping rules) and the new `templates/roster-archive.md`; task
  3 the ledger, batch-report, kaiseki-report, and handover templates; task 4
  `roles/jisso.md`, `roles/kaiseki.md`, `roles/sekkei.md` (the self-check,
  the reading, Step 4, the Models row, the grant sentence). Batch B, Kanri's
  rules: task 5 the start cases, the handshake match, the recovery, and the
  cold read (the frame command and step 1); task 6 the trigger, the
  self-check, the residency lines, the Readings subsection; task 7 the
  Replace and Delete rows, the small items in `roles/kanri.md`, "Your own
  exit", the grant clause; task 8 the README, the consistency note, and the
  whole-tree sweep. The batch A
  boundary leaves `SKILL.md` and the peers describing a reading Kanri's
  role file does not yet take — the reason B is the safe boundary; the plan
  says a replacement waits for it.
- **Passages, not whole files**, under design-4807's conventions: each edit
  an anchor that occurs once, the old passage verbatim, the new passage
  verbatim, wrapped at the destination file's column when the block is
  authored, and its shape stated (a replacement, or an insertion next to an
  anchor that stays). The new template is the one whole-file block.
- **How a batch is verified**, the section below, named by name: the lint,
  the content greps, the YAML load, the reading and frame commands run, the
  fixed-string check of the stop classes, the note's checks 2, 3, and 8.
- **The whole-tree sweep** as task 8: every term batch B lands, grepped in
  every file batch A wrote, and the reverse — a term batch A introduced and B
  answers (`plan-dryrun.md`, `roster-archive.md`, `compaction-<role>.md`,
  `transcript=`, `(unverified)`) present in both.
- Reports and prompts follow the tanto templates; nothing else about them
  is in the plan.

## Verification

At each batch boundary every command below runs on the whole tree and is
compared with the stated expectation. Each was run once on this machine on
2026-09-09 against the unedited tree, with the baseline noted; commands in
Git Bash from the repository root.

- **Lint.** `./scripts/lint.sh <changed paths>` — exit 0. markdownlint does
  not bind on `skills/tanto/templates/**`; the note's check 9 lints an
  extracted tree for them.
- **The reading section.** `grep -c '^## The transcript reading$' skills/tanto/SKILL.md`
  — `1`. Baseline `0`.
- **The reading travels, one full string per copy.**
  `grep -cF 'echo "transcript: $b B, $r records, $w wake-ups, $c compactions"' skills/tanto/SKILL.md`
  — `1`; `grep -cF -- '— <reading>' <file>` — at least `1` in each of
  `roles/kanri.md`, `roles/sekkei.md`, `roles/jisso.md`, `roles/kaiseki.md`,
  `templates/batch-report.md`, `templates/kaiseki-report.md`, and
  `templates/kanri-handover.md`; `grep -rcF 'transcript:' skills/tanto` —
  `2`, in `SKILL.md` only (the `echo` and the `transcript: unavailable`
  fallback), so that no other file spells the literal line. Baseline `0` for
  every one.
- **No reuse, in all three places.**
  `grep -c 'keep it for the next spec' skills/tanto/roles/kanri.md` — `0`;
  `grep -c 'kept Sekkei' skills/tanto/roles/kanri.md` — `0`;
  `grep -cF 'given again with each new topic' skills/tanto/roles/sekkei.md`
  — `0`. Baseline `1`, `1`, `1`.
- **The handshake carries the path.** `grep -c 'transcript=' skills/tanto/SKILL.md`
  — at least `1`. Baseline `0`.
- **The reading runs.** The pipeline from "The transcript reading" with `T`
  the running session's own transcript prints one line matching
  `^transcript: [0-9]+ B, [0-9]+ records, [0-9]+ wake-ups, [0-9]+ compactions$`.
  Baseline: the same, from the spec's copy —
  `transcript: 749144 B, 181 records, 7 wake-ups, 0 compactions` on this
  Sekkei's transcript during the dialogue.
- **The frame command runs.** With `P` set to
  `docs/superpowers/plans/2026-09-09-requirement-extraction.md`, the frame
  command piped to `wc -l` prints `631`, and to `grep -c '^\[steps:'` prints
  `4`. Baseline, from the spec's copy: `631` and `4`; on
  `2026-09-07-boundary-rules.md`, `497` and `7`.
- **The archive.** `test -f skills/tanto/templates/roster-archive.md` — exit
  0; `grep -rcF 'roster-archive' skills/tanto` — at least `1` in `SKILL.md`,
  `roles/kanri.md`, `templates/roster.md`, `README.md`. Baseline: the file
  absent, `0` everywhere.
- **The dry-run report.** `grep -rcF 'plan-dryrun' skills/tanto` — at least
  `1` in `SKILL.md`, `roles/sekkei.md`, `roles/kanri.md`. Baseline `0`.
- **The compaction file.** `grep -rcF 'compaction-<role>' skills/tanto` — at
  least `1` in `SKILL.md` and `roles/kanri.md`. Baseline `0`.
- **Eleven templates.** `grep -c 'There are eleven' skills/tanto/SKILL.md` —
  `1`; `grep -c 'There are ten' skills/tanto/SKILL.md` — `0`. Baseline `0`
  and `1`.
- **The Kanri exit pattern.** `grep -rcF 'exit-kanri-<YYYY-MM-DD>-<name>' skills/tanto`
  — `2` in `SKILL.md`, at least `1` in `roles/kanri.md`;
  `grep -rcF 'exit-kanri-<YYYY-MM-DD>-proposal' skills/tanto` — `0`.
  Baseline `0`, and `1` in each of the two files.
- **The reference translation, in all four places.**
  `grep -c 'reference translation' skills/tanto/roles/kanri.md` — at least
  `1` (the adoption rule);
  `grep -c 'original then reference translation' skills/tanto/roles/kanri.md`
  — `3` (the three escalation points). Baseline `0` and `0`.
- **The Written convention and the cross-ledger reference.**
  `grep -c 'superseded: <topic> R-n' skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md`
  — `1` each. Baseline `0` each.
- **The Stage cell mirrors the pattern.**
  `grep -cF 'exit:kanri-<YYYY-MM-DD>-<name>' skills/tanto/templates/kanri.md skills/tanto/roles/kanri.md`
  — at least `1` each. Baseline `0` each.
- **The brief writer's row.** `grep -c '| the review brief writer |' skills/tanto/roles/jisso.md`
  — `1`. Baseline `0`.
- **Resuming.** `grep -c '^## Resuming$' skills/tanto/SKILL.md` — `1`;
  `grep -cF '| `resume` | `resume` |' skills/tanto/SKILL.md` — `1`;
  `grep -rcF '/tanto resume' skills/tanto` — at least `1` in `SKILL.md`,
  `roles/kanri.md`, and `README.md`; `grep -cF '| Transcript |' skills/tanto/templates/roster.md`
  — `1`; `grep -c 'Resumed Kanri' skills/tanto/roles/kanri.md` — at least
  `1`; `grep -rcF "SKILL.md\`'s Resuming" skills/tanto/roles` — at least
  `1` in each of the four role files. Baseline `0` for every one.
- **The stop classes are still one string.** The note's check 5 on
  `SKILL.md` and `roles/jisso.md` — the pinned lines present in both, as
  before; the check pins content, and the `SKILL.md` line number moves with
  the inserted section. Baseline: present in both.
- **The frontmatter and the JSON.** The note's check 8 — `['argument-hint',
  'description', 'name']`, `ok`, `json ok`. Baseline the same.
- **The note's counts, as the note edited by task 8 states them.** Check 1 —
  seventeen `ok`; check 2 — fifteen `ok`; check 3 with its map extended by
  `templates/roster-archive.md skills/tanto/roles/kanri.md` — eleven `ok`,
  no `UNCITED`; check 6 — its new expected sequence, with the Residency
  table header pinned once in `templates/roster.md` and once in
  `templates/kanri-handover.md`, and `transcript=`, `compacted:`, and
  `confirmed:` each found where the note says. Baseline: sixteen, fourteen,
  ten, and the old sequence.
- **One trailer per commit.**
  `git log --format=%H "$(git merge-base main HEAD)..HEAD" | while read -r h; do git show -s --format=%B "$h" | grep -c '^Co-Authored-By:'; done`
  — every line `1`.
- **No `.bak` left.** `git status --porcelain | grep -c '\.bak'` — `0`.

## Open for the human at the review

The spec review raised five points that are the human's, not text fixes.
Each carries Sekkei's recommendation; the review brief put them, and the
human answered `all OK` on 2026-09-09, with the wording of the requirement
bullet and the two ADRs left to T1's escalation. Point 1 became the sentence
in T2's direction under "The plan close moves the record to the archive".

1. **The archive is untracked and dies with a workspace wipe.** It sits under
   `.superpowers/sdd/`, ignored by git, on one machine. Recommendation: the
   plan's T2 dogfood report, and every later plan's, carries the rows the
   archive gained that plan as a Measurements table, so the dataset the
   threshold ADR reads is in `docs/reports/` — the same answer design-4807
   gives for `dialogue.md`. One sentence in the Delete row's plan-close
   entry.
2. **A peer's compaction as a replacement condition trades a cold read for a
   compaction.** A compacted session is the cheap one in context terms, and
   its replacement pays a full cold read of the plan or the spec. The human
   ruled for symmetry (Q-3); the reviewer asks whether Sekkei and Kaiseki are
   meant, not only Jisso, where the escalation evidence already exists.
   Recommendation: keep the ruling as made — the reason for symmetry is that
   a summary in place of the conversation is the loss, not its size.
3. **The compaction-confirmation loop is a new interrupt class.** Every item a
   summary attributes to the human comes back to the human as a numbered
   list in Kanri's window, outside req-04f5's checkpoint list.
   Recommendation: accept it as "what only the human can do" and let T1 add
   it to the checkpoint bullet, since the alternative is acting on words the
   human did not say.
4. **Two ADR candidates**, under "Requirements": a peer's compaction as a
   replacement condition, and no reuse of a Sekkei across topics.
   Recommendation: both, at T1 under decision-1f5f.
5. **issue-7d14 is Sekkei's addition** to the scope the human set at Q-1.
   Recommendation: keep it; the dry-run report is the artifact the cold read
   needs, so its cost is one sentence.

## Out of scope

- A threshold number for a handover or a replacement on cost, and any
  automatic handover on the reading: the archive is the dataset; the number
  is an ADR's, later.
- Kanri reading peers' transcripts as the primary source, and any reading
  that crosses a session's permission class.
- A script file under the skill, and any tool beyond `wc`, `grep`, `awk`,
  and `echo`.
- Renaming Jisso's, Sekkei's, or Kaiseki's exit files; moving the Models
  table out of `roles/jisso.md`; changing rule 9.
- Where the harness defines the compaction phrase: the rule fails safe
  (reads `0`) if the phrase changes, and issue-e5a2's open question on it
  stays open.
- The `docs/` write-outs: T1 and T2 are Kanri's and Jisso's under the
  adoption rule, not plan tasks; only the consistency note is a task, because
  its checks are what the plan's verification runs.

## Answers to the spec inputs

- **I-1, note 1 (rules vs measurements).** Sorted: the reading, the frame
  read, the replacement rows, the compaction rules, and the reuse rule are
  rules in the skill; the measured facts are in "The cost, measured" and go
  to a note or a report at T1 and T2; issue-e5a2's three proposals were
  taken one by one (Q-1 items B, C, D), with the peer-transcript read
  demoted to verification and self-report made primary (Q-2, I); issue-40ed
  delivers the instrument, not the number.
- **I-1, note 2 (rule 11).** Fixed input three; the plan names batch B.
- **I-1, note 3 (the cold read ran once by ruling).** Cited as the rule's
  second data point under "The cold read reads the frame".
- **I-1, note 4 (the kept-Sekkei rule).** Taken up and then overtaken: the
  human ruled that a Sekkei is never reused across topics (Fixed inputs,
  D-2'); S-1 is superseded.
- **I-1, note 5 (the neighbouring items).** Asked, not assumed: dc72, b9a4,
  3a33 in; 9a68 as a Measurements row; issue-7d14 added by Sekkei for the
  human's confirmation at the review.
- **I-1, note 6 (no T0).** None; the Fixed inputs carry what the dialogue
  decided.
- **I-2, note 1 (why 42be belongs here).** Taken: the transcript path the
  reading needs is the identity a resume keeps, so one plan under rule 11.
- **I-2, note 2 (the four shapes; measure the identity first).** Measured
  before asking (see "The cost, measured"): the session id and the path
  survive, the name does not, and nothing marks the resume. The subset
  taken is all four, joined: the path as the key (shape 3), the self-check
  at boundaries and on `/tanto resume` rather than at every wake-up (shape
  1, narrowed), Kanri first and the roster does the rest (shape 2), and the
  fifth start case (shape 4).
- **I-2, note 3 (the measured resumes).** Cited in "Resuming" as the
  measured fact; the seven name changes in the roster's Events are the
  record.
- **I-2, note 4 (issue-9d17).** Asked; out (Q-6).
- **I-2, note 5 (what comes after).** The sweep's remainder is named in
  Scope.

## Deferred items

- The threshold ADR (issue-40ed stays open, blocked on the archive's data;
  issue-e5a2's portability question on bytes and records is answered by
  comparing sessions with each other on one host and stays open across
  hosts).
- issue-9a68 stays open until the Measurements rows exist; rule 9 unchanged.
- The wake-up count's off-by-one: a JSON parse would be exact, at the cost of
  a tool the skill does not assume.
- The frame command's dependence on the plan shape: a plan not in
  writing-plans' shape prints whole, and no plan of this repository is.
- Jisso's exit-file pattern when a resumed Jisso leaves at the same batch
  letter as its predecessor; not seen, not fixed.

## Shoroku candidates from this spec work

1. A wake-up is a user record without a tool result; issue-e5a2's counts
   over-count by the tool calls (note or report).
2. The frame of a passage plan measured: 631 of 1891, 497 of 1796, 582 of
   3090 lines (report; issue-5830's "halves" was the review-brief case, and
   this is better).
3. The typed compaction check validated on seventeen transcripts, one true
   compaction, three plain-grep false positives (note).
4. The `[ref]` is not the session id, so the transcript path travels in the
   handshake (design).
5. The reuse rule and its reason: a Sekkei is never reused across topics
   because reuse spares the human nothing and its context is the cost
   (design, and the human's words in `dialogue.md` for T1).
6. issue-7d14 taken up by this spec (claim).
7. Two config paths resolve to one transcript store on this host (same
   inode), so the self-report is the only reliable locator (note).
8. A resume keeps the session id and the transcript file and leaves no
   record in it; `SessionStart:startup` marks a true start and
   `SessionStart:compact` a compaction (note, and the fact issue-42be's
   shape 3 waited for).
9. The whole-tree sweep is what catches the quotes a "where each change
   lives" table misses; the spec review found nine (design, a sentence on
   the table's known drift).
