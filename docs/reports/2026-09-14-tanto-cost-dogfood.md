# tanto-cost dogfood — what the run that landed the seven-seat design measured about itself

The `tanto-cost` plan moved the cost of a `tanto` run off the top family's
resident contexts: seven seats replacing four, twelve `<object>.<act>` subagent
kinds replacing five, the shoroku write-out done from files, and three new
subcommands of `passage-check.js`. This report records what the run that landed
it measured about its own execution — the numbers, the process findings, and
the four harness measurements the plan's own dogfood task took. Its per-batch
narrative lives in the six batch reports under `.tanto/tanto-cost/`, which this
report cites rather than absorbs; the conductor ledger at
`.tanto/tanto-cost/kanri.md` holds the rulings and the `S-n` table these
sections were excerpted from.

## 1. The run's shape, measured

Twenty-three tasks in six batches, then one whole-branch fix wave of six fixes
over seven edit sites. **One fix round in the entire run** — task 14's, at the
fifteenth task. Every other task review returned clean on its first dispatch,
including the four that returned Important findings, because those findings were
defects in the plan's own text rather than in an implementation and were ruled
rather than fixed.

Forty-eight subagent dispatches: twenty-four implementers on `sonnet` (roughly
69k–183k tokens each, most near 100k) and twenty-four reviewers on `opus`
(roughly 67k–114k each, most near 92k). No dispatch ran on the top family, and
no 429 was seen.

## 2. Jisso's own context cost, boundary by boundary

This is the measurement the whole design exists to move, and it is the first
time a `tanto` executor's growth has been recorded at every boundary of one
plan.

| boundary | bytes | records | wake-ups | compactions |
| --- | --- | --- | --- | --- |
| batch A | 1,733,294 | 362 | 12 | 0 |
| batch B | 2,502,867 | 584 | 21 | 0 |
| batch C | 3,411,084 | 852 | 30 | 0 |
| batch D | 4,178,327 | 1,068 | 39 | 0 |
| batch E | 4,957,903 | 1,274 | 48 | 0 |
| batch F | 5,892,088 | 1,545 | 60 | 0 |
| fix wave | 6,284,551 | 1,668 | 63 | 0 |

**Zero compactions across the whole run.** Growth is close to linear at roughly
780 KB and 9 wake-ups per batch, with no batch costing conspicuously more than
another despite batch C carrying forty-six passages and batch D only three
tasks. The executor never held a task's verbatim text: every task's full text
reached its implementer through `scripts/task-brief`, and the executor read the
plan's frame and the spec's binding sections only — a deliberate ruling whose
cost, had it gone the other way, was the plan's 9,838 lines.

## 3. Naming one concrete risk per dispatch

Every review dispatch named one or more **specific** things to check rather than
asking for a verdict. The reviews came back with mechanisms instead of opinions,
every time:

- task 1's vacuous seventh test, traced to `parseArgs` throwing and `run`
  folding `USAGE` into stdout so `/Usage:/` matched at RED;
- task 2's `awk` differential judged genuine because the report named
  **thirteen** plan files where the brief predicted ten, and reported the
  mismatch against the brief rather than echoing it;
- task 3's `runShell` split confirmed by the three existing call sites being
  **absent from the diff entirely**;
- task 16's verbatim blockquote checked by **hashing** it against `SKILL.md`'s
  copy rather than reading both.

The inverse also held: the two tasks whose dispatches asked the reviewer to
judge the *plan's own text* — 14 and 20 — are the two that found defects no
instrument in the plan could see.

## 4. The reconstruction method, and the hole a reviewer closed in it

A passage task's real deliverable is "these N edits and nothing else". A
reviewer comparing N passages one by one proves only the first half. Task 6's
reviewer devised the other half unprompted: parse the plan's `O`/`P` blocks,
apply them to the diff's old side, and compare against the new side. A
byte-identical match proves both halves at once.

It ran on every passage task from 6 onward — six, fourteen, seventeen, thirteen,
eleven, twelve, nine, ten, eight and five passages, a whole-section rewrite, a
140-line deletion, an insertion and a removal — and returned byte-identical
**every time**.

Then task 17's reviewer found the hole. Every run so far had reconstructed from
the **task brief**, which lives under gitignored `.superpowers/sdd/` and is a
derived artifact that could in principle have been edited to match a mistake —
making the proof circular. It parsed the blocks out of the **tracked plan**
instead, confirmed the brief matched, and reconstructed from the plan. From task
18 the dispatches asked for the plan-sourced form by default. A method is not
sound until someone asks where its inputs came from.

## 5. The first fix round came fifteen tasks in, on a defect no instrument could see

`roles/keikaku.md:83` listed the sections a plan author must write and spelled
the third `**how a batch is verified**`, lowercase, while `:106` said "Name
those sections exactly as they are named here". `FRAME_STAGE1_SECTIONS` holds
the capitalized form and `findSection` compares `heading.text === name` — exact
and case-sensitive. A Keikaku obeying the file would emit a heading
`frame --stage 1` cannot see and `boundary` exits 2 on: the conductor's
every-boundary check failing on a plan whose author followed the role file to
the letter.

It was fixed rather than filed, on a premise checked rather than assumed: the
two sibling bullets in the same list read "the **Global Constraints** section"
and "the **Batches** section", capitalized, and all ten plans in the repository
spell the heading capitalized. The re-review measured the divergence at
character level — one hunk, one `replace` of `'h'` for `'H'`.

## 6. Instrument coverage, not severity, decides what a plan may repair

The same class of defect was fixed in one file and left in another, and the
deciding factor was neither severity nor effort:

- `roles/keikaku.md:83` was **fixed**, because the path is `created:` — it
  carries no passage, so `verify` reports `no passages` for it and `diff`
  exempts it by name. The fix cost the instruments nothing.
- `roles/jisso.md:5` was **left**, though it contradicts both the contract and
  its own later section, because the file carries passages: an edit outside one
  would put an `unaccounted-added` line on `skills/tanto/` at every remaining
  boundary.
- The four findings of task 17 were **left** for the same reason.

Then the fix wave corrected pinned text on purpose and the instrument did what
it is built to do: six passages across five tasks now fail `verify`
permanently, each divergence exactly the correction and nothing more
(issue-7f2a). The principle, stated plainly: **a plan's ability to repair its
own text is decided by which instrument happens to cover the path, not by how
bad the defect is.**

## 7. Rule 11 demonstrated, not described

Task 16 rewrote `roles/jisso.md` — the executor's own role file — while that
session was conducting the plan from it. The harness noticed the change and
presented the new text mid-batch. The run continued unaltered, because rule 11
places a running session's authority in the plan's Global Constraints, the
conductor's orders line and the batch prompts rather than in the role text on
disk. The new text re-keys the reviewer seat into `task.review-spec` and
`task.review-quality`; the dispatches kept naming `model` alone with no
`subagent_type`, exactly as the batch prompt required. Rule 11 working as
designed, not a near-miss.

## 8. The dogfood's four measurements, and what they overturned

Three of the four contradicted the design, and the two the spec had itself
flagged as "not yet measured" were both among them.

1. **A new session does see a definition written moments before it started.**
   Nineteen agent types, thirteen `tanto-*` — the twelve kinds plus the probe.
   Design-validating. One free caveat from a reviewer: a dispatched subagent's
   own list carries the six built-ins and zero `tanto-*`, so "a session sees
   them" is narrower than "any context sees them".
2. **A definition's `effort:` is not confirmed honored.** The dispatch resolved
   and the model bound — meta recorded `agentType: tanto-probe-effort` and
   `claude-haiku-4-5-20251001` — but the subagent's transcript has
   `perTurnEffort: null` and no `effort` key at all. By the test the spec itself
   chose, the effort half of the design is **unverified**. The evidence leans
   negative, because the same meta block records the model twice and the effort
   never — the harness demonstrably writes down what it bound. The finding
   underneath: the instrument the spec chose is wrong. Closing this needs a
   behavioral probe — a task whose output differs by effort — not a
   transcript-field read.
3. **`/effort` moves `effort`; `perTurnEffort` stays `null`** — in the session's
   transcript and the subagent's alike, the reverse of the spec's stated read
   order. But the shipped command is right: its regex requires a quoted value,
   so an unquoted `null` never matches and the fallback carries the job. Traced
   by running it: `effort=low` on the measured record, `effort=high` when both
   are strings, `effort=unknown` when neither is. Two sentences of prose were
   wrong; the mechanism was not — and a first report concluded otherwise before
   anyone traced it.
4. **`/clear` keeps the name and the ref and changes the transcript path** — the
   inverse of a resume, which keeps the transcript and changes the name.
   `SKILL.md`'s Resuming section calls the transcript path "the identity that
   survives"; after a `/clear` it does not, and Kikaku and Hosa are exactly the
   seats the design has the human `/clear`.

## 9. A reviewer that re-runs finds what a reviewer that reads cannot

Both verification-only tasks were reviewed by **re-running** rather than
reading, inverting the standing "do not re-run the implementer's tests" rule
because the recorded output *is* the deliverable. It paid three times:

- task 22's reviewer built the needle list two independent ways and
  three-way-diffed them against the implementer's file — proving the sweep
  agreed with the plan rather than with a copy that had drifted;
- task 23's reviewer compared twelve rendered efforts against
  `templates/tanto.json` itself rather than the brief's restatement, loaded the
  personal overlay to prove it could not perturb them, and overturned a
  conclusion the report had asserted without tracing;
- the fix wave's re-review caught the run's last error — a report line
  attributing `passage-absent: P6.6` to task 5, a misreading of its own loop
  output that would have hidden six broken passages and a permanently red
  boundary check.

Each was found by checking a claim rather than reading it.
