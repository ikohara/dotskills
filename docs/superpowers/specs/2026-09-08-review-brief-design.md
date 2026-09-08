# Design: `tanto` review-brief — a brief of the judgment points, in the chat's language, before the human reads a spec or plan

This is the fourth design for the `tanto` skill and the second plan the
resident Kanri conducts. It closes one issue, issue-a1c9: before the human
reviews a spec or a plan, a third party lists, concisely and in the language
of the chat, only the points that need the human's judgment, each with a
pointer into the document, so the human confirms those and reads the rest
only where a point sends them. The design adds one template, two message
lines, two artifacts — the brief files, and the dialogue record Sekkei keeps
during the spec dialogue — five passages in Kanri's procedure (one for the
brief, four for I-4), five in Sekkei's, two bullets and a sentence in the
README, and the consistency note's counts with one new pinned line. It also
carries three plan conventions the previous run's T2 landed in design-4807
but not in Sekkei's file, and, on the human's word (I-4), drops Kanri's idle
subscriptions on batch prompts and briefs. The skill's
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
  real run lost to a rate limit (decision-9a3a). The write half of the
  question is already the default: `subagents.drafter` is `opus` in
  `templates/tanto.json`, and the implementers are `sonnet`; the top family
  writes only the spec, which is the design judgment itself. The brief writer
  therefore runs on `subagents.reviewer`, and Kanri's check of the brief is
  the top-family pass on the human-facing points. A `fable` reviewer is an
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
- **Kanri's check of its own passage (I-2).** Per the convention this spec
  lands in Sekkei's Step 2, the one passage that rewrites Kanri's file went to
  the live Kanri after the spec review. Kanri's two load-bearing edits are
  folded in: a brief writer is a subagent, so a due handover defers its
  dispatch to the successor and a writer still running on the human's
  override is listed under In flight; and a pointer is the document's heading
  text as it stands, untranslated, or the form check would fail a compliant
  brief. Kanri's optional recovery clause is taken on Sekkei's side: after a
  restart or a handover, Sekkei sends the line again.
- **The human's reaction to the first brief (I-3).** Kanri ran the design's
  flow by hand on this spec, and the human, before answering the brief,
  asked for two things about its form: that each point say what it asks of
  them, and that the brief show the reply shapes with an example, the way
  shoroku's Direction prompt does, so that the whole brief is answered as a
  numbered list. Both are in the template, "What it is", and the form check;
  the dogfood brief stood as written for this spec's review, and the human
  answered it "brief 異論なし".
- **Kanri stops subscribing to idle (I-4), on the human's word.** Measured on
  2026-09-09: half of Kanri's wake-ups were idle notices, most of them false.
  Batch prompts and Kaiseki briefs go out without a subscription, the report
  line is the signal, a subscription is the overdue fallback, and the exit
  lines keep theirs. In scope because it touches only files this plan already
  edits; Kanri applies it by ruling (R-4) until it lands.
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
moves. The pointer is the document's heading text as it stands, untranslated:
the one part of a point not rendered into the chat's language, so that
Kanri's form check can match it against the document.

Each point opens with what it asks of the human — **confirm**, **choose**,
**decide**, or **nothing** — and the brief opens with a "How to answer"
section: a numbered list, one line per point, the reply shapes shown (`OK`,
`→ <option>`, `→ <decision>`, `change: <what>`, `later: <reason>`, `all OK`)
and one worked example, the way shoroku's Direction prompt shows the replies
it accepts. The human answers the whole brief without composing sentences,
and Sekkei records the answers in `dialogue.md` in that shape, which makes
Kanri's T1 reading mechanical. The "could not settle" section says per line
whether an answer is needed. This is the human's reaction to the first brief
(I-3): a point did not say whether it wanted a confirmation, a choice, or
nothing, and the unsettled section read as a demand for answers.

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

## How to answer

Answer in a numbered list, one line per point, `<section>.<point>` then the
reply. The shapes: `OK` confirms the document's answer; `→ <option>` chooses
one of the options a point names; `→ <decision>` decides what the document
left open; `change: <what>` accepts with an edit; `later: <reason>` defers.
`all OK` confirms every point tagged confirm at once, and a point not
mentioned counts as confirmed. Example:

    all OK
    2.1 → (b)
    3.1 change: the bullet reads "..."
    4.2 later: measure first

Each point opens with what it asks of you: **confirm** — the document
decided, say OK or object; **choose** — the document names options, pick
one; **decide** — the document left it open, your answer decides it;
**nothing** — information, no answer needed unless you object. Then the
question, in one sentence; the document's answer, in one sentence; and the
pointer — the document's section heading that answers it, copied as it
stands in the document and not translated, never a line number; the pointer
is the one part of a point not rendered into the chat's language. At most
five points per section; what does not fit goes to the last section, one
line each. For a spec, section 5's body is the single line
`<not applicable — a spec>`.

## 1. Scope and what was excluded

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## 2. Choices among alternatives, with the rejected ones and their reasons

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## 3. Requirements

Two questions per item: which requirement this design serves — read from the
document's own `req-<id>` citations, "not stated" when it has none — and
whether it adds to or changes a requirement or an ADR. A point that adds or
changes one asks you to confirm its wording; a point that serves one and
changes nothing asks nothing.

1. [confirm | nothing] Serves: <req-<id>, the bullet, or "not stated"> — Adds or changes: <yes: what, or no> — See: <section>

## 4. Deferred items

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## 5. For a plan: the batch cut, the replacement boundary, what each batch verifies

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## What the writer could not settle

Each line says what an answer here does: "no answer needed unless you
object" for a decided item that overflowed its section, or "an answer here
decides <what>" for a gap the document leaves.

- [nothing | decide] <the point, one line> — <no answer needed unless you object | an answer here decides <what>>
```

The template is markdownlint-ignored (`skills/**/templates/**`), so its bare
`<...>` blanks are correct; the trailing-whitespace, end-of-file, and
mixed-line-ending hooks still apply.

### The writer

A read-only subagent on `subagents.reviewer`, dispatched by Kanri on arrival
of `review-ready:`, a batch in flight or not — it reads only and writes one
untracked file, so it takes no commit slot and disturbs no implementer. The
one exception is a handover that is due: Timing's wait forbids every new
subagent, so the successor dispatches the writer from the handover's Next
step, and a writer still running when a handover is written on the human's
word is listed under In flight like any agent (Kanri's I-2). The dispatch
names the document's path; the inputs (for a spec, the spec,
`spec-inputs.md`, and `dialogue.md`; for a plan, the plan and the spec); the
output path; the template path; and the chat's language, which is the
language of the human's own messages to Kanri, with `dialogue.md` as the
reference if the two windows differ. The writer writes the brief file and
nothing else.

Kanri checks the brief's **form**, not its content: the five sections, the
unsettled section, and "How to answer" present (section 5 reading "not
applicable" for a spec); every point opening with one of the four tags —
confirm, choose, decide, nothing — and every unsettled line saying whether an
answer is needed; every point in its three parts; every pointer the
document's own heading text, verbatim and untranslated, so that `grep '^#'`
on the document matches it without a read of its prose. If the form fails,
Kanri dispatches once more; if it
fails again, Kanri sends the brief as it stands and tells the human in one
line. Kanri never edits the brief and does not read the document to validate
it — that would be the pre-read the fixed inputs reject, and it would
contaminate the cold read — so a point that misreads the document is caught by
the human's answer or by Kanri's cold read after the commit. Then Kanri sends
Sekkei the path.

A new brief for the same document is written when the human asks for one, or
when the document's judgment points changed after the human's answers — a
fixed input, a rejected alternative, a deferred item, a batch cut — not when
its prose did.

## The flow

### The lines, in the contract

`SKILL.md`, section Messages: its bullet list is replaced whole, because
three bullets change at once — the review-brief bullet is new, and the
idle-subscription bullet and the boundary-reply bullet change for I-4 (see
"Kanri stops subscribing to idle"). The two paragraphs after the list (the
bug report and the five `triage:` forms) are untouched:

```markdown
- One boss. Only Kanri messages Jisso. Sekkei and Kaiseki never do — inbound
  messages queue and drain in order, and a second boss interleaves
  instructions.
- A message is one line plus a path. Report bodies, rulings, briefs, and plans
  live in files: a message dies with the session, a file survives compaction
  and a VS Code restart.
- Kanri sends batch prompts and Kaiseki briefs **without** an idle
  subscription and waits for the receiver's one-line report. It subscribes —
  a pure `notify_when_idle`, no message — only when an expected signal is
  overdue, and treats a notice that arrives before the report as a reason to
  check the workspace, never as the signal: a peer's turn ends whenever it
  dispatches a subagent, so most notices are false idles. The exit lines keep
  their `notify_when_idle: true`, because there the idle notice is the
  forced-exit signal by design.
- Never poll `ListAgents`; never send "are you done". Check the listing only
  when an expected signal did not arrive.
- A reply copies the incoming message's `from` into `to`.
- At a batch boundary Kanri has verified, Sekkei answers in one line,
  `committed <subject>` or `nothing to commit`; Kanri sends the next batch
  prompt only after that reply, or, when the reply is overdue, after the
  notice of a subscription made then.
- Before the human reviews a spec or a plan, Sekkei sends Kanri
  `review-ready: <path>`. Kanri dispatches the **review brief** on
  `subagents.reviewer` — a read-only subagent that writes
  `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`
  from `templates/review-brief.md`, in the chat's language — checks its form,
  and answers `brief: <path>`. Sekkei puts the brief's text verbatim in its
  review request, with both paths. The human's answers to the brief's points
  are the confirmation that review asks for; the document is what the points
  point into, and the human reads it where a point sends them.
- Permission boundaries are per session. Never ask a peer for work that was
  denied in your own session or would be blocked there. Blocked work goes to
  Kanri, which rules on human access.
```

The first, second, fourth, fifth, and last bullets are the file's current
text, transcribed. The two routed strings, `review-ready: <path>` and
`brief: <path>`, each stay on one line in every file that carries them, so
the consistency note can pin them with a fixed-string grep; so does
`notify_when_idle: true`, which after this plan occurs only in the exit
lines.

### Sekkei's obligations

`roles/sekkei.md`, Step 1, a paragraph after "Run superpowers brainstorming
with the human. ... not a one-liner.":

```markdown
Keep `.superpowers/sdd/<topic>/dialogue.md` as you go: each question you put
and the human's answer, verbatim, in order. Kanri may read it at any time, the
brief writer reads it, and T1's shoroku takes it as an input — under this
protocol it is the one record of the human's own words.
```

`roles/sekkei.md`, Step 1, a paragraph after "Write the spec at the path
above, self-contained. ... without a round trip.":

```markdown
In Fixed inputs, name the requirement each decision serves — `req-<id>` and
the bullet — or say that none does; the brief's third section reads it from
there. Commit the spec, then hold brainstorming's review gate: the human
reads the spec only after Step 2's brief has come back, and edits after the
human's answers are further commits.
```

`roles/sekkei.md`, Step 2, its body replaced whole (the heading stays):

```markdown
Before the review, a passage in the spec that rewrites another role's
procedure goes to that role's session for a check, when that session is live:
send Kanri the passage and the question which of its obligations it touches;
Kanri relays it and answers as an `I-n`.

Dispatch a **read-only** reviewer on `subagents.reviewer`. Give it the spec and
the repo's `docs/decisions/` and `docs/requirements/`, ask it to check the
spec against them, and have it write its report to
`.superpowers/sdd/<topic>/spec-review.md` with a **Shoroku candidates**
section at the end. Rule on every finding yourself. Scope findings go to the
human; everything else is yours. Then send Kanri one line with the report
path: Kanri adopts from its Shoroku candidates.

Then send Kanri `review-ready: <spec path>` and idle until `brief: <path>`
arrives; never poll, and send the line again if Kanri's session was replaced
meanwhile — a restart, a handover — because the writer dies with the session
that dispatched it. Put brainstorming's review gate to the human with the
brief's text verbatim, the spec's path, and the brief's, and record the
human's answers in `dialogue.md` in the brief's reply shape. A new brief is
written when the human asks
for one, or when the spec's judgment points changed after the answers — a
fixed input, a rejected alternative, a deferred item — not when its prose did.
```

The middle paragraph is the file's current Step 2, transcribed; the first and
last are new. The other-role check is routed through Kanri because Sekkei
never messages Jisso (the one-boss rule), and it comes before the review, as
design-4807's convention says. The re-send after a replaced Kanri is the
recovery Kanri's I-2 asked for, taken on Sekkei's side because Sekkei already
idles on the line and knows it is pending.

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
5. Send Kanri `review-ready: <plan path>` and idle until `brief: <path>`
   arrives, never polling (send the line again if Kanri's session was
   replaced meanwhile); put the brief's text verbatim in your request for the
   one OK, with both paths, and record the answers in `dialogue.md` in the
   brief's reply shape. On the human's OK, commit under your commit rule
   below.
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
5. On `review-ready: <path>` from Sekkei — at any time, a batch in flight or
   not, because the writer reads only and writes one untracked file; unless a
   handover is due, in which case the successor dispatches it from the
   handover's Next step, and a writer still running when a handover is
   written on the human's word is listed under In flight like any agent —
   dispatch the review brief on `subagents.reviewer`, a read-only subagent,
   naming in the dispatch: the document's path; its inputs, for a spec also
   `spec-inputs.md` and `dialogue.md`, for a plan also the spec; the output,
   `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`;
   the template, `templates/review-brief.md`; and the chat's language, which
   is the language of the human's own messages to you (`dialogue.md` is the
   reference if the two windows differ). Check the brief's form, not the
   document: the five sections, the unsettled section, and "How to answer"
   present (section 5 reads "not applicable" for a spec); every point opening
   with one of the four tags — confirm, choose, decide, nothing — and every
   unsettled line saying whether an answer is needed; every point in its
   three parts; every pointer the document's own heading text, verbatim and
   untranslated, so that `grep '^#'` on the document matches it. Dispatch
   once more if the form fails; if it fails
   again, send the brief as it stands and tell the human in one line. Never
   edit it, and do not read the document to validate it — a point that
   misreads the document is caught by the human's answer or by your cold
   read, which stays where it is. Then send Sekkei `brief: <path>`. The human
   answers in Sekkei's window under the standing grant; the answers reach you
   through `dialogue.md` and the document.
```

The routed strings stay on one line: `review-ready: <path>` once, `brief:
<path>` once, both on lines of their own. Kanri's cold read of the committed
plan (When the plan lands, step 1) is unchanged: the brief is the human's
pre-read, the cold read is Kanri's, and they read for different things.

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

and the closing sentence names four designs:

```markdown
The designs this skill implements are
`docs/superpowers/specs/2026-09-06-tanto-design.md`,
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`,
`docs/superpowers/specs/2026-09-07-boundary-rules-design.md`, and
`docs/superpowers/specs/2026-09-08-review-brief-design.md`.
```

No other README drift is expected; the task that edits `SKILL.md` records the
review either way.

## Kanri stops subscribing to idle (I-4)

### The measurement

From the session transcripts of 2026-09-09 (the review-brief ledger's
Measurements): the resident Kanri was woken 394 times since the handover of
2026-09-07, 81 of them by idle notices against 77 peer messages, and most of
the notices were false idles — Jisso had dispatched a subagent and its turn
ended. Every wake-up reads the session's whole context as input, so the
subscriptions roughly doubled Kanri's cost for no information; the report
line is the only reliable signal, as the kanri-lifecycle run had already
measured. The human asked that the change ride in this plan (I-4), and Kanri
applies it by ruling (that ledger's R-4) until it lands.

### The rule

Kanri sends batch prompts and Kaiseki briefs without an idle subscription and
waits for the receiver's one-line report. It subscribes — a pure
`notify_when_idle`, no message — only when an expected signal is overdue, and
a notice that arrives before the report is a reason to check the workspace,
never the signal. The same for the boundary line to Sekkei: Sekkei's reply
has arrived after its notice more than once (measured 2026-09-08), so slot (c)
drops its subscription too. The exit lines keep `notify_when_idle: true`: at
an exit the idle notice is the forced-exit signal by design, and nothing
there changes. Jisso's and Kaiseki's files never subscribe and are untouched.

The contract's bullet is in "The lines, in the contract" above. Kanri's
procedure changes in four passages of `roles/kanri.md`.

When the plan lands, step 5, replaced whole:

```markdown
5. On Jisso's handshake, reply with the orders line. Then write batch A's
   prompt from `templates/batch-prompt.md`, with
   `First batch, no previous verdict.` in its previous-batch-verdict section,
   save it as `.superpowers/sdd/<plan-basename>/batch-A-prompt.md`, and send
   the same text, without an idle subscription.
```

The batch loop, steps 1 to 8, replaced whole (steps 2 to 6 are the file's
current text, transcribed; 1, 7, and 8 change):

```markdown
1. Wait for Jisso's one-line report message. Do not poll; subscribe to its
   idle — a pure `notify_when_idle`, no message — only when the report is
   overdue, and check the workspace before acting on any notice: a notice
   before the report is usually a false idle, an implementer's turn ending.
2. **Verify the tree before reading the report.** `git status` clean; the
   commits and their trailers as claimed; the plan file in the state this batch
   should have left it; repo-specific leftovers such as stray processes or temp
   directories; a spot check of the claimed tests. You verify in place — there
   is no worktree.
3. Read the report. For each item under "Rulings needed": a **known cause** you
   rule on yourself, recorded as `R-n` in the ledger with what it costs if
   wrong and which later tasks inherit it; an **unknown cause** opens the
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   adopt or reject each shoroku candidate per the adoption rule, and update the
   ledger's `S-n` table, its Batches row, and its Progress line.
4. **Triage any bug report that arrived during the batch**, per "Bug intake"
   below: rule on each, and send the redirects, the Kaiseki requests, and the
   relays now. An issue to file or a hotfix to make waits for the commit window
   at step 7.
5. Report one line to the human. Ask numbered questions only for the four SDD
   stop classes and for a scope or spec change.
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency line. If a create request is due, make it, unless a
   handover trigger has fired, in which case the successor makes it from the
   handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired, run the proposal half of "Exit
   shoroku" now: send the `exit:` lines, rule on the proposals, write the
   directions. Delete requests wait for step 7.
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) Each exiting session applies its direction and commits; you
   verify the diff and only then ask the human to delete that session. (b) Your
   own edits — the hotfix, the issues from step 4, and your own exit shoroku
   when a handover is due — each committed by you in its turn. (c) Tell Sekkei
   the boundary is verified, naming any Kaiseki create or delete since the
   last boundary, then wait for Sekkei's one-line reply — `committed
   <subject>` or `nothing to commit`; subscribe to its idle only when the
   reply is overdue, and record in the ledger's Session events if a notice
   came without a reply; skip (c) when Sekkei is not live. If a handover is
   due, the window ends, after the wait Timing prescribes, with steps 2 to 4
   of "The handover, in a plan and between plans" — the exit shoroku was step
   6's proposal and slot (b)'s commit — and the loop stops here; the next
   prompt is the successor's.
8. Write the next batch prompt from `templates/batch-prompt.md`, carrying the
   rulings the next tasks inherit and the concrete model families from
   `tanto.json`. Save it as
   `.superpowers/sdd/<plan-basename>/batch-<X>-prompt.md` and send the same
   text, without an idle subscription.
```

The Kaiseki branch, step 2, replaced whole:

```markdown
2. Classify. Known cause — rule and send Jisso back to work. Unknown — ask the
   human to create Kaiseki; after its handshake, write
   `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md` from
   `templates/kaiseki-brief.md`, its Human access line filled — the debugging
   conversation in Kaiseki's window until its report is written, unless you
   judge otherwise — and send its path, without an idle subscription. If the
   human declines to create Kaiseki, rule `continue the SDD rounds`: Jisso
   resumes at round 3 with the resumed implementer, and rounds 4-5 go to
   `subagents.escalation`.
```

The Replace table, the first row, its Symptom cell: "or the idle
subscription expired with no report" becomes "or a subscription made when the
report was overdue expired with no report"; the Action cell is unchanged.

After the plan, `notify_when_idle: true` occurs twice in `SKILL.md` (the
Messages bullet's exception and the Session exit paragraph) and twice in
`roles/kanri.md` (the two exit lines), and nowhere else in the skill; the
note's new check 6 block counts it.

### At T2

design-4807's "Kanri's loop, with its entry and its side channel" says "wait
for the idle notice or the report line, never poll"; at T2 it says the report
line alone, with the subscription as the overdue fallback and the measurement
behind the change.

## What the human's answer means

The human's answers to the brief's points are the confirmation the review
asks for. For a spec, that is brainstorming's user review gate, held by Sekkei
until the brief has come back; for a plan, the one OK req-04f5 names before
the commit, which is the first of the two points at which decision-1f5f
preserves req-3c4d's confirmation. The brief does not shorten the checkpoint's
authority; it shortens the reading. The writer owes completeness of the five
sections; a point it misses is Kanri's to catch at the cold read and Sekkei's
in its own review, as today.

## Requirements

### The two questions

Section 3 of the brief asks, for each item, which requirement the design
serves and whether it adds to or changes a requirement or an ADR. The first
question is answered from the document's own `req-<id>` citations, which
Sekkei's Step 1 now requires in Fixed inputs; where the document is silent,
"not stated" is the answer and goes under "What the writer could not settle".
The human answers in the chat's language; Sekkei records the answers in
`dialogue.md`; Kanri takes a "yes" as a requirement or ADR candidate for the
`S-n` table and escalates it under decision-1f5f as it escalates every such
item — the escalation still runs; what narrows is its content, because the
human's answer in the brief already carries the substance, so the escalation
confirms the wording. This is the one hook tanto adds for requirement
extraction, and it is a question, not a rule.

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
  for a new topic — and the human's confirmation, which tanto's adoption rule
  (decision-1f5f) already requires for every requirement item and which
  shoroku's own `Direction?` gate (req-3c4d) requires outside tanto.
- The pairing: a requirement file and a design file per topic already cite
  each other (req-04f5 and design-4807 do); the check to add is bullet-level
  — a design section that names no requirement, a requirement bullet no
  design serves — as a kisou consistency check and a shoroku proposal field.
- shoroku's own `SKILL.md` defers to `docs/AGENTS.md` and needs one sentence
  at most.

## Where each change lives

Twenty-three passages in six files, one of them new. A **replacement**
supersedes an old passage; an **insertion** adds text next to an anchor that
stays; the new file is one passage of its own shape. The template comes
first, so that no task leaves `SKILL.md` naming a file that does not exist.

| File | Passage | Shape | Task |
| --- | --- | --- | --- |
| `skills/tanto/templates/review-brief.md` | the whole file | new file | 1 |
| `skills/tanto/SKILL.md` | Messages, the bullet list (the idle rule, the boundary reply, the review-brief bullet) | replacement | 2 |
| `skills/tanto/SKILL.md` | Artifacts, two rows after the `spec-inputs.md` row | insertion | 2 |
| `skills/tanto/SKILL.md` | the Templates sentence, ten | replacement | 2 |
| `skills/tanto/README.md` | What it does, the review-brief bullet after the bug-reports bullet | insertion | 3 |
| `skills/tanto/README.md` | Layout, the templates bullet | replacement | 3 |
| `skills/tanto/README.md` | the closing sentence, four designs | replacement | 3 |
| `skills/tanto/roles/sekkei.md` | Step 1, the `dialogue.md` paragraph after the brainstorming paragraph | insertion | 4 |
| `skills/tanto/roles/sekkei.md` | Step 1, the requirement-citation and review-gate paragraph after the "Write the spec" paragraph | insertion | 4 |
| `skills/tanto/roles/sekkei.md` | Step 2, the body | replacement | 4 |
| `skills/tanto/roles/sekkei.md` | Step 3, the passage-plan paragraph before "The report and prompt skeletons" | insertion | 4 |
| `skills/tanto/roles/sekkei.md` | Step 4, the numbered list | replacement | 4 |
| `skills/tanto/roles/kanri.md` | When the plan lands, step 5 | replacement | 5 |
| `skills/tanto/roles/kanri.md` | The batch loop, steps 1 to 8 | replacement | 5 |
| `skills/tanto/roles/kanri.md` | The Kaiseki branch, step 2 | replacement | 5 |
| `skills/tanto/roles/kanri.md` | Human access, item 5 after item 4 | insertion | 5 |
| `skills/tanto/roles/kanri.md` | Session lifecycle, the Replace table's first row | replacement | 5 |
| `docs/notes/tanto-consistency-checks.md` | the opening, the flattened-count sentence after the paragraph that ends "or `od -c`." | insertion | 6 |
| `docs/notes/tanto-consistency-checks.md` | Versions, "Sixteen skill files, ten of them templates" | replacement | 6 |
| `docs/notes/tanto-consistency-checks.md` | check 1, the `ls` gains `skills/tanto/templates/review-brief.md`, Expected says sixteen | replacement | 6 |
| `docs/notes/tanto-consistency-checks.md` | check 2, Expected says fourteen `ok` lines and lists `templates/review-brief.md` after `templates/kanri.md` | replacement | 6 |
| `docs/notes/tanto-consistency-checks.md` | check 3, the MAP gains `templates/review-brief.md skills/tanto/roles/kanri.md`, Expected says ten and seven | replacement | 6 |
| `docs/notes/tanto-consistency-checks.md` | check 6, a sixth and last block pinning `review-ready: <` and `brief: <path>`, anchored on the last line of check 6's final Expected paragraph | insertion | 6 |

The note's opening sentence, new, a paragraph after the one that ends "or
`od -c`.":

```markdown
A flattened `grep -cF` counts lines, so it returns `0` or `1`: it pins the
presence of a phrase that may wrap, never a per-file occurrence count. Count
the occurrences of a line that does not wrap with a raw `grep -cF` on the
file.
```

The note's check 6 block, new, the sixth and last, appended after the final
Expected paragraph of the block that pins "orders line, and the batch
prompts" (the outer fence here is four backticks because the passage itself
contains a fence):

````markdown
The two lines of the review brief, and the idle subscription that only the
exit lines keep, each on one line where it occurs, counted raw over every
Markdown file of the skill so that a stray copy fails the check:

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do
  printf '%s review-ready %s brief %s idle %s\n' "$f" "$(grep -cF 'review-ready: <' "$f")" "$(grep -cF 'brief: <path>' "$f")" "$(grep -cF 'notify_when_idle: true' "$f")"
done
```

Expected: `skills/tanto/SKILL.md review-ready 1 brief 1 idle 2`,
`skills/tanto/roles/kanri.md review-ready 1 brief 1 idle 2`,
`skills/tanto/roles/sekkei.md review-ready 2 brief 2 idle 0`, and every other
line ending `review-ready 0 brief 0 idle 0`. The two `idle` in `SKILL.md`
are the Messages bullet's exception and the Session exit paragraph; the two
in `roles/kanri.md` are the exit lines. A batch prompt or a brief sent with a
subscription would show as a third.
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
  changes (Versions, check 1, check 2, check 3), whose new text is the old
  with the number and the list changed as the table says. Needles from
  quoted heredocs, passed as `"$needle"`; the merge-base diff
  `git diff "$(git merge-base main HEAD)" -- <file>`; hunk counts as
  task-time checks; every fenced `bash` block in Git Bash.
- **Seven tasks in two batches.** A: Task 1 `templates/review-brief.md`;
  Task 2 `SKILL.md`; Task 3 `README.md`, with the drift review recorded. B:
  Task 4 `roles/sekkei.md`; Task 5 `roles/kanri.md`; Task 6 the note; Task 7
  the consistency pass, verification-only. The template comes first so that
  `SKILL.md` never names a file that is not yet in the tree.
- **The boundaries.** The batch A boundary is **not** the boundary from which
  a role may be started or replaced. After A, `SKILL.md` defines
  `review-ready:` and `brief:`, the two artifacts, and ten templates, and the
  README describes the brief, while the two role files still send neither
  line and keep no `dialogue.md`, and `roles/kanri.md` still sends every
  prompt and brief with a subscription the contract now forbids; and the note
  still expects thirteen `ok` lines from check 2 (the tree gives fourteen once
  the template exists and `SKILL.md` names it) and "Fifteen skill files, nine
  of them templates" — the contract a batch ahead of the roles and the note
  that act on it. The
  Batches section names that set as the forward-reference set and says
  checks 1 to 8 run only at the batch B boundary, in Task 7. The **batch B
  boundary** is the one from which a role may be started or replaced, and it
  is the final boundary, the case Sekkei's Step 3 bullet foresees; the plan
  says so in Global Constraints and Batches, and this plan expects one Jisso
  throughout. Two commands decide it, both named in the plan. (1) The tree
  sweep, **raw** per file — `grep -cF` counts lines, and a flattened file is
  one line — over `SKILL.md`, `roles/*.md`, and `templates/*.md` for
  `review-ready: <`, `brief: <path>`, and `notify_when_idle: true`: at the
  batch A boundary `SKILL.md` counts one, one, and two, `roles/kanri.md`
  zero, zero, and six (its four prompt-and-brief subscriptions plus the two
  exit lines, the forward reference the I-4 rule leaves until Task 5), and
  every other file zero; at the batch B boundary the values of the note's new
  check 6 block. (2) The term sweep design-4807 names: grep the plan's own
  new-passage blocks of batch A for every term batch B lands — `review-ready:
  <`, `brief: <path>`, `dialogue.md`, `templates/review-brief.md`,
  `review-brief-spec.md`, `review-brief-plan.md`, `notify_when_idle`, and the
  note's changed counts — and record the set found as the forward-reference
  set, rather than asserting it empty.
- **Line endings**, per the consistency note: no per-file table in the plan;
  `git ls-files --eol <file>` before and after each edit shows the same
  `w/crlf` or `w/lf` and never `w/mixed`, and a passage is written with the
  file's ending as measured then. The new template is written LF and checked
  **after `git add`**, because `git ls-files --eol` prints nothing for an
  untracked path: `i/lf w/lf`.
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
--eol` after `git add` shows `i/lf w/lf`, and its headings in order are the
six of the template plus the title.

At the batch A boundary, additionally: the frontmatter hook and the PyYAML
load on `SKILL.md`; the README drift review recorded; the raw tree sweep
showing `SKILL.md` alone; the term sweep over batch A's blocks with its set
recorded. Checks 1 to 8 of the note do not run at the batch A boundary — the
note is a batch B file, and its check 2 and Versions line are in the
forward-reference set. At the batch B boundary: the raw sweep at the note's
values; Task 7's run of the note's checks 1 to 8 as written and check 9's
whitespace sweep, compared with the pre-edit baseline Sekkei records at plan
review — checks 1, 2, 3, and 6 are **expected to differ** from the baseline
exactly as Task 6 changes their Expected text (sixteen, fourteen, ten and
seven, the new sixth block of check 6), and the report says so per check;
every other check equal to the baseline; lint on every touched path by name;
the trailer equality over `main..HEAD`.

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
| I-1 the scope, issue-a1c9 and its three questions | Adopted. Who writes: Kanri dispatches the writer on `subagents.reviewer`, checks the brief's form, hands the path to Sekkei (Kanri's third shape). What the answer means: the answers to the brief's points are the confirmation; the document is the referent. Where it lives: `.superpowers/sdd/<topic>/review-brief-spec.md` and `-plan.md`, Kanri's default, delivered verbatim in Sekkei's window. Rule 11 applied: the batch B boundary is the replacement boundary and the plan says so; Kanri records the authority ruling at the landing (R-3 already does). Two batches. The three optional conventions ride along in `roles/sekkei.md`. Beyond the note: `dialogue.md`, the human's words kept, from the dialogue's D-3. |
| I-2 Kanri's check of item 5 | Adopted: the handover exception in item 5 and "The writer"; the pointer as the document's heading, untranslated, in the template, item 5, and "What it is"; the recovery taken on Sekkei's side (send the line again after a replaced Kanri) in Step 2 and Step 4; the placement under Human access kept as Kanri accepted it. |
| I-3 the human's reaction to the first brief | Adopted: every point opens with its asked tag (confirm, choose, decide, nothing); the brief opens with "How to answer" — the reply shapes and one worked example, after shoroku's Direction prompt; the unsettled section says per line whether an answer is needed; Kanri's form check gains the tags and the section; Sekkei records the answers in `dialogue.md` in the reply shape. The dogfood brief stood for this review, as Kanri proposed, because the human had answered it. |
| I-4 drop Kanri's idle subscriptions | Adopted as Kanri described, with slot (c) dropping its subscription too (the cleaner rule): the Messages bullet, When the plan lands step 5, the batch loop's steps 1, 7, and 8, the Kaiseki branch's step 2, and the Replace row; the exit lines unchanged; the note's new check 6 block counts `notify_when_idle: true` so a stray subscription fails the check; design-4807 at T2. |

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
  author, on the reviewer tier; Kanri checks the brief's form and never reads
  the document for it; the confirmation req-3c4d requires is given on the
  brief's points with the document as referent; and a requirement or ADR
  item the human has already answered in the brief is still escalated under
  decision-1f5f, with the escalation confirming the wording — the choices
  over Sekkei dispatching it and over Kanri pre-reading, and the reasons.
  It amends decision-1f5f's first point by saying how the plan's approval is
  given and what the escalation of a brief-answered item carries, so it
  carries `amends: ["1f5f"]` and 1f5f gains `amended_by`.
- design-4807: Human access gains the brief and the dialogue record; Skill
  layout counts sixteen files and ten templates; the artifacts; "Kanri's
  loop, with its entry and its side channel" notes that the spec dialogue's
  words now reach Kanri through `dialogue.md`, and says the report line is
  the signal and the idle subscription the overdue fallback, with I-4's
  measurement (394 wake-ups, 81 idle notices against 77 peer messages, most
  of them false idles); a set under "Where the delivered skill differs" for
  this design only if the fix wave leaves a difference.
- issues: a1c9 moves to `docs/issues/resolved/` at T2; deferred items 1 and
  2 are filed at T1.
- facts from the dialogue: `fable` is twice `opus` per token on input and
  output (the Claude API skill's cached table, 2026-06-24: 10 and 50 against
  5 and 25 dollars per million); the a1c9 statement was requirement-shaped
  and was filed as an issue by the "exactly one type" rule; superpowers has
  no third-party review of a spec or plan and no explicit human approval of
  a plan beyond the execution choice, which tanto adds as the reviewer
  subagents, the one OK, and Kanri's cold read.
- facts from the spec review, measured 2026-09-08: two of the nine
  templates (`batch-report.md`, `kaiseki-report.md`) are checked out CRLF
  and seven LF, so "every template is LF" is false of this tree;
  `git ls-files --eol` prints nothing for an untracked path, so a new file's
  ending is checked after `git add`; a flattened `grep -cF` returns `0` or
  `1` and cannot serve as an occurrence count — the trap that produced the
  review's F-2, closed by the note's new sentence; `dialogue.md` lives
  untracked and becomes durable only through T1.
- observation about the process, from the spec review: design-4807's
  convention that a passage rewriting another role's procedure goes to that
  role's live session before the spec review was not applied by this spec
  at first — the first spec written after the convention landed — and was
  applied after the review, as I-2; a convention only in the design entry
  and not in a role file is not scheduled by anyone, which is why this plan
  lands it in `roles/sekkei.md`.
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
