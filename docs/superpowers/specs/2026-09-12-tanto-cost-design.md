# Design: tanto-cost — the top family bought in one-shots, the resident seats on the cheaper families, and the write-outs done from files

Sekkei `dotskills-a0 [95cfbe]`, 2026-09-13; the file is dated 2026-09-12,
the day the topic opened and Kanri's orders line fixed the path, as
issue-3c7a records for a spec whose gate falls on a later day. Written from
spec input I-1
(`.tanto/2026-09-12-cost-discussion.md`, the human's cost discussion with
the previous Kanri, four passes) and from the spec dialogue Q-1 to Q-12
(`.tanto/tanto-cost/dialogue.md`). Kanri's ruling R-1 in
`.tanto/tanto-cost/kanri.md` fixes the scope this spec starts from.

The problem in one paragraph. The 2026-09-11 run cost 2.3 times the
2026-09-02 run for 1.1 times the messages; input cache misses grew five
times while hits grew two, and with the one-hour cache TTL a miss on Fable
costs eighty times a hit. The misses come from resident sessions that wait
— a session that wakes after the TTL rewrites its whole context — and the
most expensive such context was Kanri's, on the top family, used mostly
clerically. The design below moves the waiting to the cheap families, buys
the top family in subagents that read once and die, takes the document
write-outs out of every resident session's context, and adds the seats,
the config, the instruments, and the vocabulary that the change needs.

What lands, at a glance:

- seven roles instead of four — Kikaku (企画), Keikaku (計画), and Hosa
  (補佐) join Kanri, Sekkei, Jisso, and Kaiseki — with a model **and an
  effort** per role, checked at the handshake and named in every create
  request;
- twelve subagent kinds named `<object>.<act>`, each with a model and an
  effort, carried by agent definitions the roles generate under
  `~/.claude/agents/`; the top family runs in one-shots and the residents
  on `sonnet` and `fable` where judgment is paid for;
- the shoroku flow made uniform at every stage — the session that holds
  the candidates writes them; a `shoroku` subagent recommends; the human
  checks by exception; a second `shoroku` subagent applies and commits —
  which also lets a session be deleted as soon as its proposal is on disk;
- the review brief dispatched by the document's author; the cold read, the
  whole-branch review, and the recommender dispatched by Kanri;
- three subcommands of `passage-check.js` — `sections`, `frame`,
  `boundary` — so that reports are read by section, a plan's frame is
  staged, and a boundary is one command;
- the limit rule (a limit is a pause, never a model change), the resume
  word `fukki`, the `paused:` / `continue:` lines, and the template
  placeholders of issue-2872.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them
whole. Each names the dialogue question that settled it and the
requirement it serves.

1. **The scope is the seven items of R-1 plus Hosa and all three
   instruments of issue-2e52** (Q-1, A): the role matrix with Kanri on
   `sonnet` and Kikaku and Keikaku new; the ADR inverting decision-9a3a;
   the ADR turning the adoption rule into a human-checked recommendation;
   issue-2e52's `sections`, `frame`, and `boundary`; issue-5a17's and
   issue-260c's vocabulary; issue-ac9d; issue-2872; and, riding on the
   matrix, `tanto.json` widened to `{model, effort}` and the agent
   definitions that carry a kind's effort. issue-3c7a is taken whole —
   the split, the two-deep pipeline written down, the draft rule, the
   re-send rule, and the exit suffix — because I-1 names the split "the
   core of it" and the matrix has a Keikaku row; Kanri's R-1 wording lists
   the matrix and not the issue, and the review asked that the widening
   be said (spec review, scope finding 1). One plan rewrites every role
   file once, so rule 11's boundary is crossed once. Serves req-04f5,
   "Model discipline" and "A session's cost is measured, not guessed".

2. **A role's effort is checked as its model is — twice, warn only** (Q-2,
   measured): the transcript's `assistant` records carry `"effort"` and
   `"perTurnEffort"`, so a role reads its own effort from the last such
   record of the file it already takes its reading from, compares it with
   `sessions.<role>.effort` at `/tanto <role>` in its own start line —
   Kanri included, which sends no handshake — and sends it in the
   handshake as `effort=<level>` for Kanri's second check, as
   decision-08bc has the model checked at both points. Nothing switches an
   effort. Every create
   request names `/model` and `/effort` before `/tanto`, because the human
   forgets the effort more often than the model. Serves req-04f5, "Model
   discipline".

3. **The shoroku recommender is the `shoroku` skill run in a subagent
   through the skill-name key, dispatched by Kanri, on `opus` medium**
   (Q-2, A; the human's mid-turn correction from `fable` to `opus`). The
   subagent's cost is the same whoever dispatches it; what differs is
   whose resident context receives the recommendation — Kanri's on
   `sonnet`, or a role's on `fable` or `opus` — and how many hops the
   recommendation travels to the human, whose counterpart is Kanri. The
   `shoroku` skill gains the recommendation shape and the apply half as
   features of its own, useful outside tanto, so tanto still composes it
   without modifying it for tanto's sake. Serves req-04f5, "Composes
   without modifying" and "The human is interrupted only at defined
   checkpoints"; serves req-3c4d, "Present a single numbered proposal".

4. **The built-in defaults encode the second-pass matrix with the third
   pass's Q1 applied** (Q-3, A): Jisso and Kanri on `sonnet`, the
   recommender on `opus`; the third pass's further reductions (Q2) are
   the second measurement, written in section 1.4 and not in the
   defaults. One measurement changes few variables, so that the readings
   say what changed. Serves req-04f5, "A session's cost is measured, not
   guessed".

5. **`tanto.json` keys carry no prefix; agent definitions do** (Q-4): the
   file is tanto's own and only a `/tanto` session reads it, so
   `subagents.default` means nothing outside tanto; `~/.claude/agents/`
   is the harness's namespace, seen by every session of every repository,
   so the definitions are named `tanto-<object>-<act>` and their
   description says they are dispatched by name only. A definition binds a
   dispatch only when `subagent_type` names it.

6. **The agent definitions live at `~/.claude/agents/tanto-<object>-<act>.md`
   and every role generates them at its start from the merged config**
   (Q-4, A; measured): the harness loads agent definitions at session
   start — a definition written during this session was not dispatchable
   from it (`Agent type 'tanto-probe' not found`) — so the files must
   exist before the session that dispatches them is created, and the
   first session on a machine that writes them dispatches without them.
   Project scope (`<workspace>/.claude/agents/`) was rejected: tanto would
   write into the calling repository's configuration directory, which
   req-04f5 forbids, and the gitignore is not tanto's. Static definitions
   copied by the human were rejected: the effort would no longer follow
   `tanto.json`. Serves req-04f5, "tanto's own state lives in its own
   directory" — the definitions are personal configuration beside
   `tanto.json`, not repository state.

7. **The agents constraint is a new issue that blocks issue-6a29, and
   issue-6a29 stays out of scope** (Q-4 follow-up): the definitions are
   one set per user, so a project overlay of `tanto.json` cannot carry a
   per-repository effort without either being ignored or clobbering
   another repository's definitions. That is a constraint this design
   creates, recorded in Deferred items for T1.

8. **The session-resume word is `fukki` (復帰 / ふっき), `resume` stays as an
   alias, and the after-a-limit act is a Kanri line, not a `/tanto`
   argument** (Q-5, A; UX confirmed): after an editor restart the human
   types `/tanto fukki` or `/tanto resume` in Kanri's window first and
   then in every other window; after a limit the human tells Kanri in any
   words that the quota is back, and Kanri sends the paused role
   `continue: <dispatch> — same model`, bound to the `paused:` marker in
   the ledger's Measurements. The word 再開, which the human actually
   types after a limit, is kept away from the session act — the collision
   issue-5a17 measured. Resolves issue-260c and issue-5a17's vocabulary
   half.

9. **Kikaku and Hosa are seats outside the lifecycle** (Q-6, seven
   points confirmed): each has a roster row and a role file, is opened by
   the human and never requested by Kanri, has no exit shoroku, and is
   `/clear`ed by the human; Kanri reminds the human to `/clear` a Kikaku
   or Hosa, or to delete a Kaiseki after its exit shoroku, in its next
   line whenever such a session has reported and gone idle. Kikaku's
   output is `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` and one line
   `decision: <path>`; Hosa edits tracked files only in a slot Kanri
   gives. Serves req-04f5, "The human is interrupted only at defined
   checkpoints" — the human asked for the reminder — and "Kanri is
   resident, but its context cost does not grow with its tenure".

10. **The chores seat is 補佐 Hosa** (Q-7, where 庶務 shomu was chosen over
    書記, 司書, 総務, 助手, and 保守; then revised by the human to 助手 joshu
    and, after the spec commit, to 補佐 hosa): "a place to hand small jobs
    you can forget right away". It takes the human's ad-hoc small work and
    Kanri's issue filings and note updates when it is live; the hotfix
    lane's edits it makes only as Kanri's hand, in Kanri's slot, under
    Kanri's ruling (section 2.4). The shoroku write-outs are not its work
    (input 13).

11. **Keikaku owns the plan; the boundary is the spec review accepted;
    the same topic's Sekkei and Keikaku never coexist, different topics'
    may** (Q-8, with the human's correction of point 1): Sekkei exits at
    the boundary and Keikaku is created after it; Keikaku takes the
    dialogue, the spec inputs, the spec, the spec review, and the spec
    brief as its own; the role count is "0 or 1 per topic", the roster
    gains a Topic column, and Kanri's one-live-row check is per role and
    topic. Serves req-04f5, "Roles in separate sessions, at the human's
    hand"; resolves issue-3c7a's split.

12. **The spec is committed by Sekkei when no batch is in flight, and by
    Keikaku after the merge otherwise** (Q-8, point 2): a Sekkei drafting
    during another topic's batches writes `.tanto/<topic>/spec-draft.md`,
    runs the review and the gate on it, and commits nothing; the Keikaku
    created after the merge cuts the branch from `main`, commits the
    reviewed spec unchanged as the branch's first commit, and the plan
    after it. The checkout belongs to the topic whose batches are in
    flight. Serves req-04f5, "The calling repository is not assumed to
    build or run in a git worktree".

13. **The shoroku flow is the same at every stage, and the apply is a
    subagent's** (Q-10, accepted): the session that holds the candidates
    writes them (T0 the input document, T1 the spec's own sections, T2
    Jisso's proposal, an exit that session's proposal); Kanri dispatches
    the `shoroku` kind to recommend; the human answers by exception; Kanri
    writes the direction and the `S-n` rows; Kanri dispatches the `shoroku`
    kind again to apply and commit in a slot. The principle "the one who
    holds the context writes" no longer holds once the proposal is a file,
    and a fable or opus session applying frontmatter rules at `xhigh` is
    the most expensive way to do clerical work. A session is deletable as
    soon as its proposal is on disk. Serves req-04f5, "Docs are kept
    current as part of the flow" (the need: nothing a session learned is
    lost at its close) and "Kanri is resident, but its context cost does
    not grow".

14. **The review brief is dispatched by the document's author** (Q-10,
    accepted): Sekkei for the spec, Keikaku for the plan, from the fixed
    template on `brief.write`; the author checks its form; `review-ready:`
    becomes a one-line notice to Kanri carrying both paths and waits for
    nothing. A subagent shares no context with its parent, so the
    third-party property decision-ace0 wanted is kept by construction;
    the commissioner-bias argument applies to the whole-branch review
    only, which stays Kanri's, as does the cold read. Serves req-04f5,
    "The human reviews through a brief of the judgment points".

15. **Two requirement bullets change, and "who writes" is not a
    requirement** (Q-10 follow-up): "Docs are kept current" loses its
    mechanism clause ("the session that raised them writes out the
    accepted ones") and keeps the need; "The human is interrupted only at
    defined checkpoints" replaces "a shoroku item that adds to or changes
    a requirement or a decision" with the recommendation checked by
    exception at each stage. The writer moves to design-4807 and to the
    ADR's Consequences.

16. **The instruments, the config shape, the limit rule, the vocabulary,
    the template fix, and the measurement are as Q-11 states** (Q-11,
    eight points confirmed; Q-12 the kind list). Sections 3, 8, and 9
    carry them.

17. **The kind list is the twelve of Q-12**, with `brief.write` dispatched
    by the author and `shoroku` dispatched by Kanri in both of its modes.
    A definition carries `name`, `description`, and `effort`; the model
    binds through the dispatch's own `model` parameter, which the Agent
    tool documents as taking precedence over a definition's, so the
    definition does not repeat it.

18. **Rule 9 counts top-family sessions and exempts Kikaku as
    human-paced** (Q-6, point 7): Sekkei pauses while Kaiseki is active,
    as today; Keikaku and Hosa on the cheaper families do not count; the
    human does not talk to Kikaku while Sekkei and Kaiseki are both
    active, until issue-9a68 measures otherwise.

19. **Kanri's judgment moves to three subagents and to the human** (Q-9,
    six points confirmed): the cold read to `plan.coldread`; the shoroku
    adoption to the recommender and the human; the rulings that need
    judgment to the human, who may take them to Kikaku, whose answer
    returns as a `decision:` file. Kanri never messages Kikaku: Kikaku is
    the human's seat, not Kanri's subordinate. The formal rulings —
    boundary verdicts, lifecycle, slots, the five triage outcomes — stay
    Kanri's.

20. **The plan's Global Constraints carry the authority sentence and the
    replacement boundary** (contract rule 11): the run's sessions follow
    the constraints, Kanri's orders line, and the batch prompts, not the
    role text on disk, until the boundary the plan names — expected to be
    the final boundary, since every file of the skill changes.

21. **This run's plan is written by a second Sekkei on `opus`, created
    after this Sekkei exits at the spec review accepted, and Keikaku
    begins with the next topic** (spec review, finding 4 and scope finding
    2; the human decided on 2026-09-13 and told Kanri): the skill on disk
    has no `keikaku` id, and rule 11 forbids creating a further role before
    the plan's boundary, which is the final one — but a replacement Sekkei
    is not a further role, and today's Sekkei text carries Step 3 and Step
    4. So this `fable` Sekkei exits once the spec review is accepted, the
    human writes `sessions.sekkei = "opus"` into the personal `tanto.json`
    for the handshake as kisou-refresh did (issue-6a29's workaround), the
    `opus` Sekkei takes `dialogue.md`, the spec inputs, and the spec as its
    own and runs today's Step 3 and Step 4 and the handoff, and this run's
    Kanri dispatches the brief and rules on the exits as today. This is
    the split of issue-3c7a run by hand one last time, and its readings
    are the last measurement of a Sekkei that writes a plan. The
    alternative — relaxing rule 11's boundary for one role — was not
    taken: a session started on a half-edited skill is the failure rule 11
    exists for.

## 1. The role matrix

### 1.1 Sessions

Resident and advisory: the values are checked at `/tanto <role>` and at
the handshake, never switched. The human sets the effort with `/effort`
or `effortLevel`; the create request says which.

| Role | Model | Effort | Why |
| --- | --- | --- | --- |
| Kikaku (企画) | fable | xhigh | the human's consultation and the next-work decision; human-paced, small, `/clear`ed by the human |
| Kanri (管理) | sonnet | high | roster, ledger, prompts, verification, lifecycle; the judgment goes to the subagents of 1.2 or to the human |
| Sekkei (設計) | fable | high | the spec is the design judgment |
| Keikaku (計画) | sonnet | high | the plan; `lint` and `replay` catch the mechanics, the `fable` review the contracts |
| Jisso (実装) | sonnet | xhigh | the SDD orchestration and the fix-round decisions; the first measurement (I-1, third pass, Q1) |
| Kaiseki (解析) | fable | xhigh | on demand, short-lived |
| Hosa (補佐) | sonnet | medium | the human's small chores and Kanri's filings |

### 1.2 Subagents

One-shot and effective: the `model` goes into every dispatch, the `effort`
into the agent definition the roles generate (section 3.3). Kinds are
`<object>.<act>`, English, with two single-word exceptions: `default`, the
kind every role falls back to, and `shoroku`, the one key that is a skill
name on purpose; their files are `tanto-default.md` and
`tanto-shoroku.md`.

| Kind | Model | Effort | Dispatcher | Definition file |
| --- | --- | --- | --- | --- |
| `task.implement` | sonnet | high | Jisso, fix rounds 1-3 | `tanto-task-implement.md` |
| `task.escalate` | opus | high | Jisso, fix rounds 4-5 | `tanto-task-escalate.md` |
| `task.review-spec` | opus | medium | Jisso, the per-task spec-compliance review | `tanto-task-review-spec.md` |
| `task.review-quality` | opus | medium | Jisso, the per-task code-quality review and the scoped re-review | `tanto-task-review-quality.md` |
| `plan.draft` | opus | high | Keikaku | `tanto-plan-draft.md` |
| `plan.review` | fable | high | Keikaku | `tanto-plan-review.md` |
| `plan.coldread` | fable | high | Kanri | `tanto-plan-coldread.md` |
| `spec.review` | opus | high | Sekkei | `tanto-spec-review.md` |
| `branch.review` | fable | high | Kanri, the whole-branch review | `tanto-branch-review.md` |
| `brief.write` | fable | high | the document's author — Sekkei for the spec, Keikaku for the plan | `tanto-brief-write.md` |
| `shoroku` | opus | medium | Kanri, the recommend and the apply halves | `tanto-shoroku.md` |
| `default` | sonnet | medium | every role — Kaiseki's exploration, Hosa's one-offs, anything else | `tanto-default.md` |

`shoroku` is a skill-name key in the sense decision-9a3a defined and nothing
used until now: "run that skill in a subagent on that model". It moves from
personal addition to built-in default, because the flow of section 5 needs
it.

### 1.3 Fable one-shots per plan

Under 1.2 the top family runs in: the cold read, the plan review (one or
two), the spec brief and the plan brief, and the whole-branch review — five
to six per plan, each reading once. The `shoroku` kind runs twice per
stage — recommend and apply — at T1, T2, and every exit (Sekkei, Keikaku,
Jisso, Kanri, a Kaiseki when there is one), so ten to fourteen dispatches
per plan on `opus`, plus T0's two on `main`. Both counts are counted as
dispatches by kind, not as stages (section 8.4), and the Fable count
against the five-hour limit is the number the first measured run watches.

### 1.4 The second measurement

Not in the defaults; written here so that the next run knows what to change
and in which order (I-1, third pass, Q2, by confidence): `brief.write` to
`opus` high; `task.review-quality` to `sonnet` high; Kanri to `sonnet`
medium once the judgment is measured to be out; Keikaku to `sonnet` medium;
Sekkei to `opus` high with `spec.review` on `fable`; the `shoroku` apply
half on `sonnet`. Haiku is ruled out for anything that reads a plan whole
(200K window, no effort control).

## 2. The seats

### 2.1 Kikaku (企画)

The human's consultation seat: what the next work is and why. It is where a
discussion like I-1 belongs, instead of Kanri's window.

- **Start.** `/tanto kikaku [<address>]`; with no address it reads the
  roster's first data row. It does the model check and sends the
  handshake; Kanri answers with its address and the open topics, if any.
  Kanri never requests a Kikaku: the human opens one when they want to
  think.
- **Work.** Brainstorm with the human, superpowers style, on whatever the
  human brings. Kikaku reads the repository, `docs/`, and `.tanto/`; it
  writes only under `.tanto/kikaku/`, never under `docs/`, and never
  messages Sekkei, Keikaku, Jisso, Kaiseki, or Hosa.
- **Output.** When something is decided, write
  `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` from `templates/kikaku-decision.md`
  — sections: The human's words, verbatim; What was decided; What Kanri
  should do with it — and send Kanri `decision: <path>`. Kanri's handling
  is one of three: a topic in its spec stage relays it as the next `I-n`
  in that topic's `spec-inputs.md`; between plans it is a T0 input
  document; otherwise it is a source row in the `S-n` table. I-1 is the
  first file of this kind, written before the seat existed.
- **Lifecycle.** A roster row (role `kikaku`, no topic), status `live`;
  no create or delete request, no exit shoroku, no replace row. The human
  `/clear`s the window when the subject changes; the next `/tanto kikaku`
  re-handshakes with a new transcript, Kanri writes a new row and marks
  the old one `cleared`. A `/tanto fukki` after an editor restart matches
  the transcript as for any role.
- **Rule 9.** Kikaku is on the top family and human-paced; it is not
  counted, and the human keeps it quiet while Sekkei and Kaiseki are both
  active.

### 2.2 Keikaku (計画)

The plan seat. Today's `roles/sekkei.md` Step 3 (the plan), Step 4 (the
plan review), Handoff, and the write-and-commit rule move to
`roles/keikaku.md` as they stand, with these changes.

- **Start.** `/tanto keikaku <address>`, created on Kanri's request at the
  boundary "the spec review is accepted" (section 4.3). Kanri's orders
  line carries the topic, the spec path (committed or draft), the plan
  path, and the standing grant
  `human-access: granted — the plan dialogue — until the plan is committed and the cold read answered`.
- **Takes as its own.** `dialogue.md`, `spec-inputs.md`, the spec,
  `spec-review.md`, and `review-brief-spec.md`. It appends the plan
  dialogue to `dialogue.md`.
- **The branch and the spec commit.** When the spec is a draft (input 12),
  Keikaku first cuts the branch from `main`, commits the spec at its final
  path with the text unchanged, and only then drafts the plan. When the
  spec is committed, the branch exists and Keikaku continues on it.
- **The brief.** Keikaku dispatches `brief.write` for the plan brief
  (section 6).
- **The cold read.** Kanri's questions come to Keikaku, one line each; it
  answers by editing the plan or the spec and sending a pointer — the spec
  is on the branch and Sekkei is gone.
- **Models.** `plan.draft`, `plan.review`, `brief.write`, `default`.
- **Exit.** `exit-keikaku`, no suffix, at the plan's landing after the cold
  read is answered, or when the human does not want the plan now.
  decision-f496 applies: a Keikaku is never reused across topics.

### 2.3 Sekkei (設計), narrowed

`roles/sekkei.md` keeps Step 1 (the spec) and Step 2 (the spec review and
the gate), its write rule, and its exit; loses Step 3, Step 4, Handoff, and
the boundary reply's plan half.

- **The draft rule.** When Kanri's orders line says a batch is in flight,
  the spec is written to `.tanto/<topic>/spec-draft.md`, the review and the
  gate run on it, and no branch is cut and nothing is committed; the orders
  line says so explicitly, and also tells the spec reviewer that the
  in-flight plan's paths are out of scope.
- **The brief.** Sekkei dispatches `brief.write` for the spec brief
  (section 6).
- **The boundary.** Sekkei's tenure ends when the human's answers to the
  spec brief are in `dialogue.md` and the edits they asked for are
  committed or in the draft. Sekkei sends Kanri
  `spec accepted: <spec path> — <reading>`; Kanri sends `exit:`.
- **Exit.** `exit-sekkei`, no suffix. T1 has not run when Sekkei exits, so
  the proposal's first line says what it excludes — the spec, the spec
  review, and the dialogue, which T1 reads for itself — and the items are
  the dialogue's rejected alternatives, the facts measured, the
  observations, and the defects noticed. Once the proposal is on disk and
  its recommendation written, Kanri asks the human to delete the session
  (section 5.3).

### 2.4 Hosa (補佐)

A place to hand small jobs you can forget right away.

- **Start.** `/tanto hosa [<address>]`; with no address it reads the
  roster's first data row. Model check, handshake; Kanri answers with its
  address and one line, "tracked files only in a slot I give". Kanri never
  requests a Hosa.
- **Whose work.** The human's, handed directly in Hosa's window under a
  standing grant named in Kanri's answer — Hosa sends Kanri
  `chore: <one line>` when it takes one, so that Kanri knows what is in
  hand without a `human-contact:` for each; and Kanri's, sent as
  `chore: <what> — <paths> — slot: now | at the next boundary` — the issue
  filings of the bug intake, note updates, and the hotfix lane's edits
  when Kanri prefers not to hold them — for those, Hosa is Kanri's hand:
  the lane's conditions, the ruling `R-n`, and the commit subject stay
  Kanri's, and decision-2f36's "one role that edits source outside a plan"
  reads as one ruling with one hand (the fourth ADR amends that clause).
  When no Hosa is live, Kanri does its own chores as today.
- **The slot.** Untracked work and `.tanto/` any time. A tracked edit
  waits: Hosa sends `slot-needed: <what> — <paths>` and idles; Kanri
  answers `slot: now — commit and report` or `slot: at the next boundary`
  under the hotfix lane's rule — between batches or between plans, never on
  a file the in-flight plan lists. Hosa commits once by explicit path
  with the trailer and answers `committed <subject> — <reading>`. Kanri
  verifies the diff as for any commit.
- **Not Hosa's.** The shoroku write-outs (section 5). Hosa never writes
  a recommendation, a direction, or an `S-n` row.
- **Lifecycle.** A roster row, no topic; no create, delete, replace, or
  exit shoroku; `/clear`ed by the human, re-handshakes as new, the old row
  `cleared`. Hosa is on `sonnet` and does not count under rule 9.

### 2.5 Kaiseki (解析), unchanged except its exit and its dispatch key

Kaiseki's exit follows section 5.3: it writes its proposal, sends the line
with its reading, and is deleted; the apply is not its work any more. Its
subagent key is `default`. Its report template and brief template are
unchanged. An attached Kaiseki is the third top-family session rule 9 has
always counted.

## 3. `tanto.json` and the agent definitions

### 3.1 The shape

```json
{
  "sessions": {
    "kikaku": { "model": "fable", "effort": "xhigh" },
    "kanri": { "model": "sonnet", "effort": "high" },
    "sekkei": { "model": "fable", "effort": "high" },
    "keikaku": { "model": "sonnet", "effort": "high" },
    "jisso": { "model": "sonnet", "effort": "xhigh" },
    "kaiseki": { "model": "fable", "effort": "xhigh" },
    "hosa": { "model": "sonnet", "effort": "medium" }
  },
  "subagents": {
    "task.implement": { "model": "sonnet", "effort": "high" },
    "task.escalate": { "model": "opus", "effort": "high" },
    "task.review-spec": { "model": "opus", "effort": "medium" },
    "task.review-quality": { "model": "opus", "effort": "medium" },
    "plan.draft": { "model": "opus", "effort": "high" },
    "plan.review": { "model": "fable", "effort": "high" },
    "plan.coldread": { "model": "fable", "effort": "high" },
    "spec.review": { "model": "opus", "effort": "high" },
    "branch.review": { "model": "fable", "effort": "high" },
    "brief.write": { "model": "fable", "effort": "high" },
    "shoroku": { "model": "opus", "effort": "medium" },
    "default": { "model": "sonnet", "effort": "medium" }
  }
}
```

This is `templates/tanto.json` in full. A value may also be a bare string,
which means the model alone with the effort from the defaults — so today's
personal file `{"sessions":{"kanri":"sonnet"}}` stays valid and complete.
The overlay is per field: a personal `{"effort":"medium"}` under
`subagents.task.implement` changes the effort and keeps the default model.
The effort vocabulary is the harness's — `low`, `medium`, `high`, `xhigh`,
`max` — and the family vocabulary is the Agent tool's.

The ladder check becomes: `task.escalate` sits above `task.implement` on
`fable > opus > sonnet > haiku`. The five old kinds — `implementer`,
`reviewer`, `drafter`, `escalation`, `default` as a bare word — are gone,
and a personal file that still names one is reported in the start line as
`unknown key <name>, ignored` and otherwise ignored.

### 3.2 The start line

Every role says once, at start: which file it read; which keys came from
the defaults, at the granularity of a field; the ladder result if the check
failed; and the agent-definition result of 3.3 —
`agents: <n> current, <m> written, <k> not visible to this session`. A
`k` above zero is followed by the kinds, and those kinds are dispatched
in this session with `model` alone, their effort inherited from the
session's; the human is told once and not warned.

### 3.3 The agent definitions

At its start, after reading the merged config, every role writes for each
of the twelve kinds the file `~/.claude/agents/tanto-<object>-<act>.md`
(`.` to `-`; under `$CLAUDE_CONFIG_DIR/agents/` when that variable is set)
from `templates/agent.md`, when the file is absent or its content differs
from what the template renders; a file that already matches is left alone.
The rendered file is:

```markdown
---
name: tanto-task-implement
description: tanto's task.implement seat. Dispatched by a tanto role by name through subagent_type, and never to be selected from this description.
effort: high
---

Follow the prompt of the dispatch that named you. This file carries the
seat's effort; the procedure, the inputs, and the output path are in the
prompt.
```

The definition carries no `model` and no `tools` line: the dispatch's
`model` parameter binds the family and takes precedence over a definition's
by the Agent tool's own contract, and the roles need every tool their
prompts assume. The description is protocol against the harness's proactive
agent selection, not enforcement.

Then the role checks its own system prompt's list of available agent types
for the twelve names, and reports as 3.2 says. Every dispatch from then on
names `subagent_type: tanto-<object>-<act>` and `model: <family>` together,
except for a kind the session cannot see, which names `model` alone.

Measured limits, to be verified by the plan's dogfood: a definition written
during a session is not visible to that session (Fixed input 6); whether a
new session sees a file written moments before it starts is expected from
the harness's documentation and not yet measured; whether `perTurnEffort` or
`effort` is the field that follows a `/effort` change is not yet measured,
and the handshake reads `perTurnEffort` with `effort` as the fallback; and
whether a definition's `effort:` key is honored by a dispatch is documented
(I-1, second pass, from `sub-agents.md`) and not yet measured here — the
dogfood dispatches one probe on a definition with `effort: low` and reads
the effort field of that subagent's own transcript, so that the effort half
of this design is a measurement and not an assertion.

## 4. The handshake, the roster, and the create request

### 4.1 The handshake line

```text
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> effort=<level|unknown> branch=<branch> mode=<auto|unknown> transcript=<absolute path|unavailable>
```

`effort=` is read from the transcript: the last record of `type`
`assistant`, its `perTurnEffort` field, or its `effort` field when the
first is absent; `unknown` when the transcript is unavailable. The same
read is the effort half of the start sequence's model check, in every
role's own start line, Kanri's included. Kanri's check 1 compares `model=`
with `sessions.<role>.model` and `effort=` with `sessions.<role>.effort`; a
mismatch of either is reported to the human in one line and the handshake
still gets its row when only the effort differs — the effort is the
human's to change with `/effort` in that window, and the roster records
what runs. A model mismatch is refused as today.

### 4.2 The roster

Columns: Role, Topic, Name `[ref]`, cwd, Model, Effort, Branch, Mode,
Started, Status, Transcript. Topic is the topic word Kanri's orders line
gave that session, or `—` for Kanri, Kikaku, Hosa, and a standalone
Kaiseki. Status gains `cleared` for a Kikaku or Hosa row replaced by a
re-handshake after `/clear`: a handshake whose `transcript=` matches no row
and whose role is Kikaku or Hosa writes a new row and marks the old one
`cleared`, and a handshake whose name is already in the roster with a
different transcript is read the same way — I-1 says `/clear` starts a new
transcript, and whether it also changes the name is a dogfood measurement
(Deferred items), so the rule keys on the transcript, which the skill
already treats as the identity. The keeping rule "one live session per role"
becomes "one live session per role and topic; Kanri, Kikaku, and Hosa one
each". The Residency table gains the Topic column too, since two Sekkei
rows may be live. The Events list gains `cleared: <old name> → <new name>`
and `decision: <path> received from <name>`.

### 4.3 The create request

Every request Kanri makes is a numbered list the human can paste, and now
carries the model and the effort before the command, in this order:

```text
1. Open a new session in <repo path>.
2. /model <family>
3. /effort <level>
4. Make sure the session is in auto mode.
5. /tanto <role> <name>
```

Line 5 carries after the command what the Create table's third column
names for that role — the plan path and the branch for Jisso, the topic for
Sekkei, the topic and the spec path for Keikaku — as today's requests do.
The Create table gains two rows and loses none: "the spec review is
accepted → create Keikaku, `/tanto keikaku <name>`, the topic, the spec
path"; and a row saying that Kikaku and Hosa are opened by the human and
never requested. The Sekkei row's "or no plan is in flight" widens to "or
every open topic has passed its spec stage", so that a second topic's
Sekkei may be created while the first is in its plan stage or its batches.

### 4.4 The reminder

Whenever a Kikaku, Hosa, or Kaiseki row is `live` and that session has
reported to Kanri and gone idle, Kanri's next line to the human — a
boundary report, a create or delete request, any line — ends with
`— /clear <name>'s window` for Kikaku and Hosa, or
`— delete <name> after its exit shoroku` for Kaiseki. Kanri writes
`idle since <HH:MM>` in that row's Status so that the reminder is not
forgotten across a wake-up; the human asked for it explicitly (I-1, fourth
pass).

## 5. The shoroku flow

One flow at every stage — T0, T1, T2, and every exit — in four steps. The
stage word is `t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`.

Between stages nothing is adopted. A batch report's Shoroku candidates
section, a Kaiseki report's `blocks this task: no` items, and a review
report's candidates are copied into the ledger's `S-n` table at the
boundary with Adopted `pending` and Stage `t2` — the bookkeeping Kanri
already does, minus the ruling — and T2's proposal, which Jisso seeds from
that table as today, is where they are recommended and checked. The
Adopted column's values become `pending`, `yes`, and `no`; `escalated` has
no meaning once every item reaches the human.

### 5.1 The four steps

1. **Candidates.** The session that holds them writes them, and only this
   step needs a resident context. T0: the input document — a Kikaku
   decision file, or a file like I-1. T1: the spec itself, whose four
   sections Requirements, The ADRs, Deferred items, and Shoroku candidates
   from this spec work are the candidates; nothing is copied. T2: `.tanto/<topic>/shoroku-proposal.md`, written by Jisso from
   the conductor ledger's adopted rows and its own context, as today.
   Exit: `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`.
2. **Recommend.** Kanri dispatches the `shoroku` kind in the skill's
   recommend mode (section 5.4) over the candidate file — for T1, over the
   spec with the four section names — with `docs/` as the baseline, and
   names the output: `.tanto/<topic>/<stage>-recommendation.md`, or
   `.tanto/t0-recommendation.md` and Kanri's own exit at `.tanto/`. The
   file lists every item once, in three groups — recommended adopt,
   recommended reject, unsure — each item quoted in full from its source
   (so that the file stands alone as the apply's input), with its
   destination, its one-line reason, and for a `design` entry the
   `req-<id>` it serves; a requirement
   or ADR item carries the original wording followed by a reference
   translation in the chat's language, as req-04f5 requires of an
   escalation.
3. **Check.** Kanri tells the human in one line: the path, and the three
   counts. The human answers as the shoroku skill already parses —
   `OK` for "as recommended", or the numbers that go the other way, or an
   edit — and Kanri writes `<stage>-direction.md` beside the
   recommendation, item by item, with the `S-n` rows in the ledger (Stage
   the stage word, Adopted from the human's answer). No item is escalated
   apart from the rest and none is decided by Kanri alone: the human sees
   the whole list, grouped, and answers by exception. This is the ADR of
   section 13.2.
4. **Apply.** Kanri dispatches the `shoroku` kind in apply mode with the
   recommendation, the direction, and the commit subject — `docs: T<n> shoroku
   for <topic>`, `docs: exit shoroku for <role>[ at <suffix>]`, the same
   prefixes the whole-branch review package excludes — in a slot of the
   commit window under the hotfix lane's rule. The subagent writes the
   accepted subset per `docs/AGENTS.md` and the per-type files, lints the
   changed paths by name, commits once by explicit path with the trailer,
   and reports the subject. Kanri verifies the commit as it verifies any —
   `git status` clean, the diff's paths those the direction names, lint on
   them — and fills the Written column.

Where the commit lands: on the topic's branch for T1, T2, and the exits of
that topic's sessions; on `main` for T0 and for Kanri's between-plans
exit. A Sekkei exit of a topic whose branch does not exist yet waits: the
direction is written, and the apply is dispatched once Keikaku has cut the
branch, so that the topic's write-outs travel with the topic. Kanri holds
the pending apply in the ledger's Progress line.

### 5.2 What this changes for each role

- **Jisso**: T2 is the proposal only. `shoroku-direction.md` no longer
  reaches Jisso; the "Apply" paragraph of its T2 section goes, and so does
  every `exit write-out committed:` line. Jisso's exit at a batch boundary
  is the proposal and its reading; its deletion follows.
- **Sekkei, Keikaku, Kaiseki**: the same — the proposal and its reading,
  then deletion. None writes under `docs/` any more, at its exit or ever,
  and contract rule 5's exception for the exit shoroku goes.
- **Kanri**: T0 and T1 stop being "propose to yourself, apply yourself";
  they are steps 2 to 4 over the input document and over the spec. Kanri's
  own exit is steps 1 to 4 with Kanri writing the proposal and the human
  checking as at every stage, so Kanri's exit now has a recommendation and
  a direction file like every other — "no direction file, because it rules
  on itself" goes; the apply subagent commits before the handover file is
  written. Kanri writes under `docs/` only through the
  intake's filings and the hotfix lane, and hands those to Hosa when one
  is live.
- **Hosa**: not involved.

### 5.3 The exit, shortened

Kanri sends `exit: propose your shoroku; write it to <path>`; the session
writes the proposal, runs the resume self-check, and answers
`exit proposal: <path> — <reading>`; Kanri checks that the file exists and
opens with the exclusion line and a numbered list — `sections` on it, not
a read — and dispatches the recommender (step 2) at once. When the
recommendation is on disk, Kanri reads its `unsure` group by `sections`:
an item there that says the candidate could not be read as written is one
question back to the session, one line, answered by a rewrite of the
proposal; otherwise Kanri asks the human, as a numbered list, to delete the
session. The session idles through one subagent run and no longer through
the human's check and the apply. Steps 3 and 4 then run without it, and
the human's check works on the recommendation's full quotation of each
item, which is what the session would have been asked about — its
judgment was spent writing the proposal, and the file holds it (I-2,
point 1). A session that has stopped answering is treated as today: a
forced exit, an Events line saying what was lost. The one-boundary cost
Jisso paid for another session's exit shrinks to the proposal and one
recommender run.

### 5.4 The `shoroku` skill's two halves

`skills/shoroku/SKILL.md` gains, under Step 3, a subsection "Recommend and
apply — the two halves for a caller that answers `Direction?` through
files":

- **Recommend mode.** Invoked with a source (a file, or a file and section
  names) and an output path. Runs the workflow up to the proposal and
  writes it to the path instead of printing it, in the shape of 5.1 step
  2 — the numbered items grouped adopt / reject / unsure, each with its
  destination, a one-line reason, the requirement pairing for a `design`
  entry, and the original-plus-translation for a requirement or ADR item
  when the chat's language differs from the item's. It does not wait for
  `Direction?` and writes nothing under `docs/`.
- **Apply mode.** Invoked with a recommendation path, a direction path,
  and a commit subject — the recommendation quotes every item in full, so
  no third file is needed, and at T1, where the candidates are sections of
  the spec, it is the only proposal there is. Applies the accepted subset
  per the per-type `AGENTS.md`, lints the changed paths by name, commits
  once by explicit path, and reports the paths and the subject. It writes
  nothing the direction did not accept, and it never runs without a
  direction file.
- Both halves are the ordinary session flow split at `Direction?`; a
  session mode run is unchanged. The direction parsing already in the skill
  — `OK`, `2 と 5 だけ`, `3 はやめて`, an edit — is what a caller writes into
  the direction file, one line per item or one `OK`.
- Two of the skill's Prohibited actions are re-scoped so that the halves
  are not forbidden by the file that defines them: "Do NOT start a shoroku
  run without explicit user confirmation" gains "— in session mode; in
  recommend mode the caller's dispatch is the run's start and nothing is
  written under `docs/`, and in apply mode the direction file is the
  confirmation, written from the human's answers"; "Do NOT write outside
  `docs/`" gains "— except the recommendation file a caller names in
  recommend mode". The Soft nudge's "Never start a run without explicit
  confirmation" gains the same session-mode qualifier.

The shoroku README's "What it does" gains one bullet naming the two
halves. req-3c4d gains one bullet at T1 (section 12).

## 6. The brief's dispatcher

The author dispatches the brief writer: Sekkei for `review-brief-spec.md`,
Keikaku for `review-brief-plan.md`, on `brief.write`, from
`templates/review-brief.md`, naming what today's `roles/kanri.md` Human
access step 5 names — the document, its inputs, the output path, the
template, and the chat's language. The form check that step 5 describes —
eight headings in order, the four tags, the three or four parts of a
point, the `— If unanswered:` clause, the pointers as verbatim headings —
moves as it stands into `SKILL.md` under a new heading "The brief's form",
in the Messages section, so that it has one copy the two authors cite;
the author runs it, dispatches once more on a failure, and on a second
failure sends the brief as it stands with one line to the human. The
author never edits the brief. `templates/review-brief.md`'s two mentions
of Sekkei as the one who "asks for it on its own line" and "states the
recommendation with the brief" read "the author".

`review-ready: <document path>; brief: <brief path>` is then one line to
Kanri, sent before the human is asked; Kanri records it in the ledger's
Session events and does nothing else. The `brief: <path>` reply and the
idle-until-brief wait are gone from both role files. The template's header
sentence "Written by the brief writer Kanri dispatches" becomes "Written by
the brief writer the document's author dispatches".

The third-party property holds by construction — a subagent shares no
context with the session that dispatched it, and the prompt is the fixed
template. The commissioner-bias argument, which is why the whole-branch
review stays Kanri's, does not apply to a brief: the brief selects and
renders the document's own judgment points for the human, and a point that
misreads the document is caught by the human's answer or by the cold read.
This amends decision-ace0's dispatcher clause (section 13.3).

## 7. Kanri on `sonnet`

### 7.1 The cold read

On `plan committed: <plan path>; dryrun: <dry-run path> — <reading>` from
Keikaku, Kanri dispatches `plan.coldread` with: the spec path; the plan
path; the frame, as `node "$TANTO/scripts/passage-check.js" frame --plan
<path>` prints it (stage 1 and 2 together); the dry-run report's path; one
command of its own that checks every anchor the plan names against the
tree; and the output path `.tanto/<topic>/coldread.md`. The subagent reads
the spec whole and the frame, spot-checks the dry-run report, and writes a
numbered list of open questions, or `none`. Kanri reads the file by
`sections`, sends Keikaku one line per question, and records R-n for the
authority sentence as today. Kanri's own reading of the plan is
`frame --stage 1`: Global Constraints, the Batches table, How a batch is
verified, and the Self-Review — what the batch prompts and the boundary
need — and a passage block by id on demand.

### 7.2 The rulings

The formal rulings stay Kanri's: a boundary's verdict from `boundary` and
`diff`; lifecycle, slots, and the create, replace, and delete tables; the
five triage outcomes; the `paused:` and `continue:` bookkeeping. A ruling
that needs judgment — a scope or spec change, a stop class, a bug report
Kanri cannot classify — goes to the human as today, one numbered line; the
human may take it to Kikaku, and the answer returns as a `decision:` file.
Kanri never messages Kikaku.

### 7.3 The boundary

Loop step 2 becomes two commands: `boundary --plan <path>` for the plan's
own verification list and `diff --plan <path> --base <merge base>` for the
unaccounted lines, each read for its pass or fail lines and the failing
output only; `git status` and the commit trailers are the first two checks
`boundary` prints. Reports are read by `sections`, in the order the batch
prompt already prescribes — For Kanri, Rulings, Questions for the human,
Deviations from the plan, Shoroku candidates — and never whole. The
measurement check of issue-f2ec stays: when a batch carried a measurement
task, Kanri also names the Tasks and Verification sections in the same
`sections` call and reads them for an outcome that contradicts the brief's
prediction, since a report that confirms every expectation deserves a
second look; the check reads named sections, not the file (I-2, point 3).
The batch prompt's Models line restates the four kinds Jisso dispatches by
name and family.

## 8. The instruments

Three subcommands join `lint`, `replay`, `verify`, and `diff` in
`skills/tanto/scripts/passage-check.js`, with tests beside them in
`passage-check.test.js`, run as `node --test
skills/tanto/scripts/passage-check.test.js` (the file form, issue-235b).
The usage line names all seven.

### 8.1 `sections --file <path> <heading> [<heading>...]`

Prints, for each named heading, the heading line and the body down to the
next heading of the same or higher depth, in the order the names were
given; a name that matches no heading prints one line `no section
<heading>` to stderr and exits `1` after printing the rest. Matching is on
the heading text after the `#` marks, exact, trimmed. Every report,
proposal, recommendation, direction, review, and brief has a fixed
skeleton, so every reader names sections: the role files say "read a
report by its sections, never whole" wherever they said `cat` or "read
the report".

### 8.2 `frame --plan <path> [--stage 1|2] [--task <N>]`

Replaces the `awk` in `roles/kanri.md`. A task starts at a heading
matching `^##+ Task` at any depth (issue-ac9d) and its step region at the
first `- [ ] **Step` line, ending at the next heading of the task's depth
or higher; fenced blocks inside a step region are skipped whole, as the
`awk` does. With no `--stage`, it prints what the `awk` printed — everything
outside the step regions, each region replaced by `[steps: <n> lines]`.
`--stage 1` prints the headings, the Global Constraints section, the
Batches section, the How a batch is verified section, and the Self-Review
section; `--stage 2` prints each task's head — from its heading to its
first step — and the step count; `--task <N>` prints that task whole.
Sections are found by the headings the writing-plans skill and
`roles/keikaku.md` fix; a plan without one of them prints what it has.

### 8.3 `boundary --plan <path>`

Runs, in order, `git status --porcelain` (pass when empty), then every
fenced `bash` or `console` block under the plan's "How a batch is
verified" heading, each with its `Expected:` paragraph where the plan has
one, as `replay` already reads them; prints one line per check —
`pass <n>: <first line of the command>` or `fail <n>: <first line>` —
followed, for a failure only, by the command's output; exits `0` when all
pass, `1` otherwise, `2` when the plan or the heading is missing. A
`replay-skip` marker is honored as in `replay`. It is Kanri's instrument
at loop step 2, as `diff` and `verify` are Jisso's, and the plan's How a
batch is verified section is written knowing this command will run it
verbatim.

### 8.4 The measurement

The ledger's Measurements table gains three fixed rows at the plan close of
the first run on this design: the top-family one-shots per plan, counted
by kind from the Session events; each role's last reading, copied from
the Residency rows; and the day's cost, uncached input, cache miss, cache
hit, and hit rate as the human pastes them from the Claude Code Usage
extension. The dogfood report compares them with I-1's 2026-09-11 table.
Nothing is a threshold; the numbers are the record the second measurement
starts from.

## 9. The limit rule and the vocabulary

### 9.1 A limit is a pause, never a model change

One paragraph in `SKILL.md`, after "The expected-model config", with the
rule and the procedure of issue-5a17:

- No role switches its own session model or effort on a limit, and no
  dispatch is retried on a lower family; the models are what `tanto.json`
  says until the human changes the file.
- On a 429 that names a weekly or daily quota: stop retrying, commit
  nothing half-done, send Kanri
  `paused: <dispatch> on <family> — resets <time>` (or write it in the
  report's Rulings needed when a report is due), and idle with the work in
  hand. On a per-minute 429: one retry after the message's interval, then
  the same.
- Kanri records the line in the ledger's Measurements table and tells the
  human the reset time. The pause has no upper bound the skill can state;
  only the human's word ends it.
- When the human says, in Kanri's window and in any words, that the quota
  is back, Kanri may probe the family once with a trivial `default`
  subagent and then sends `continue: <the dispatch the pause named> — same
  model`; the role re-dispatches identically from where it stopped. With
  no `paused:` marker to bind to, Kanri asks the human what to continue.
  A human who speaks in the role's window instead is answered and reported
  as `human-contact:`; a bare 再開 there is ambiguous by construction and
  the role asks.
- Not detected: a `/model` or `/effort` change mid-run; the rule is
  protocol.

### 9.2 The resume word

The Invocation table gains the row `ふっき`, `復帰`, `fukki` → `fukki`,
keeps `resume` as an accepted alias of the same id, and gains the rows for
`きかく` / `企画` / `kikaku`, `けいかく` / `計画` / `keikaku`, and `ほさ` /
`補佐` / `hosa`. The unknown-word sentence lists eight ids. The
frontmatter's `argument-hint` becomes
`kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki | resume`
— every accepted argument, the alias included (issue-260c) — and
the description names the seven roles; the description must not contain a
colon followed by a space. "Resuming" and every `/tanto resume` mention
read `/tanto fukki` with `resume` named once as the alias. The English
`resume` remains in the roster's and the role files' prose where it is the
verb, not the argument.

## 10. Concurrency and the topics

- Kanri may open a second topic while the first is past its spec stage;
  `.tanto/<topic>/kanri.md` exists per topic already, the Progress line is
  per topic, and the roster's Topic column says which session belongs to
  which. The Start section's step 5 says so instead of "only when no plan
  is in flight". The Batches table and the batch loop are per topic, and
  only one topic has a Jisso and batches in flight at a time (I-1 and
  issue-3c7a: depth two, not three; the checkout belongs to the topic in
  flight).
- Rule 9 reads: at most two top-family sessions active at once, Kikaku
  excepted as human-paced — Sekkei pauses while Kaiseki is active; Keikaku
  and Hosa on the cheaper families do not count.
- The Sekkei ∥ Jisso stage of issue-3c7a is written down: the next topic's
  Sekkei drafts during the current topic's batches (Create table); its
  reviewer is told the in-flight paths are out of scope (orders line); the
  Keikaku of that topic is created only after the merge.
- A peer that receives `kanri-address:` re-sends its last unanswered line
  to the new address; the handover file's In flight section lists the
  peers the outgoing Kanri had not answered (issue-3c7a's re-send rule).
- The handover with two open ledgers (I-2, point 2): the trigger is
  checked at the boundaries of the topic whose batches are in flight and
  between plans, as today; "the plan close" is that topic's close; a topic
  in its spec or plan stage neither fires nor blocks a handover, since its
  Sekkei or Keikaku holds nothing Kanri must wait for beyond an unanswered
  line, which the re-send rule covers. The handover file's In flight
  section carries one block — Plan, Ledger, Batch state — per open ledger,
  and Live peers lists every peer of every open topic with its Topic; the
  successor sends `kanri-address:` to all of them.
- Rule 4, "One set of roles per repo", reads "one Kanri, one Kikaku, and
  one Hosa per repo; one Sekkei, one Keikaku, one Jisso, and one Kaiseki
  per topic; a session is bound to its cwd".
- decision-6dea extends without amendment: a Keikaku whose reading shows a
  compaction is replaced at its next commit as a Sekkei is; a Kikaku or
  Hosa whose reading shows one is `/clear`ed by the human on Kanri's
  reminder, its output being already on disk or committed.

## 11. The files, and what changes in each

The plan carries passages for the files that change in part and whole
files for the new ones. This section says what changes at the section
level; the plan's blocks are the wording.

### 11.1 `skills/tanto/SKILL.md`

- Frontmatter: `description` (seven roles, no `: `), `argument-hint`
  (section 9.2).
- "The roles" table: seven rows; Count per topic for Sekkei and Keikaku;
  Kikaku and Hosa rows saying "opened by the human"; Kanri's Owns column
  loses "the T0 and T1 write-outs" and gains "the recommendations and the
  directions"; Sekkei's Owns is the spec and its review; Keikaku's the
  plan, its dry run, and its review. "never the other three" → "never the
  other six".
- "Invocation": the new rows, `fukki`, eight ids, `/tanto fukki` in place
  of `/tanto resume`.
- "Start sequence" / "The expected-model config": `{model, effort}`, the
  per-field overlay, the twelve kinds, the `shoroku` key as a built-in
  skill-name key, the ladder check on `task.escalate` / `task.implement`,
  the agent definitions of 3.3, the start line of 3.2, the limit paragraph
  of 9.1. "Every subagent dispatch names a `model`" gains "and a
  `subagent_type` from the definitions, when this session sees them".
- "Handshake and roster": the handshake line of 4.1; the roster columns
  of 4.2; the sentence about Jisso waiting names Keikaku too; Kikaku and
  Hosa with no address read the roster's first row.
- "Resuming": `fukki`.
- "Messages": the boundary reply names Sekkei and Keikaku; the
  `review-ready:` paragraph is rewritten to section 6; the bug-report
  paragraph unchanged.
- "Human access": four standing grants — Sekkei's spec dialogue, Keikaku's
  plan dialogue, Kaiseki's debugging conversation, Hosa's chores; Kikaku's
  counterpart is the human by definition.
- "Session exit": section 5 — the four steps, the exit line
  `exit proposal: <path> — <reading>`, the stage words, the file pattern
  with `exit-keikaku` and no suffix for Sekkei or Keikaku, the deletion
  after the proposal, no `exit write-out committed:`; Kikaku and Hosa have
  no exit shoroku.
- "Artifacts": rows for `.tanto/kikaku/<date>-<slug>.md`,
  `.tanto/<topic>/coldread.md`, `.tanto/<topic>/spec-draft.md`,
  `<stage>-recommendation.md` and `<stage>-direction.md`,
  `~/.claude/agents/tanto-*.md`; the brief row's writer is the author's
  dispatch; the templates sentence counts thirteen and names
  `kikaku-decision.md` and `agent.md`; the script sentence names the seven
  subcommands and the roles that run them.
- "The transcript reading": the effort read of 4.1 joins the section — one
  more line in the shell block, printing `effort=<level>`, which the
  handshake and the start line take; the reading itself stays four
  figures.
- "The expected-model config": "No skill uses this today; skill-name keys
  are personal additions and are not in the built-in defaults" → "`shoroku`
  is the one built-in skill-name key; any other is a personal addition";
  "An omitted `model` inherits the session's model, which on a Kanri,
  Sekkei, or Kaiseki session is the strongest family" → "which on a
  Sekkei, Kikaku, or Kaiseki session is the strongest family" (the same
  sentence in `roles/sekkei.md`).
- "Messages": the new heading "The brief's form" (section 6); "One boss.
  Only Kanri messages Jisso. Sekkei and Kaiseki never do" and "Kanri is the
  only session that sends to Jisso, Sekkei, or Kaiseki" enumerate the
  seven.
- "Session exit": "Kanri's exit has a proposal file but no direction file,
  because it rules on itself" goes (5.2); "Jisso idles through another
  session's exit; the cost is one boundary" → "the proposal and one
  recommender run".
- "Artifacts": the plan's Writer is Keikaku; the ledger's readers are the
  six; the script sentence's "run by Sekkei in place of an agent dry run"
  → "run by Keikaku", and "`roles/sekkei.md` and `roles/jisso.md` name its
  subcommands" → "`roles/keikaku.md`, `roles/jisso.md`, and
  `roles/kanri.md`".
- "Workspace": "Sekkei cuts the branch from `main` before the spec commit"
  → "Sekkei, or Keikaku when the spec was a draft, cuts the branch from
  `main` before the first commit".
- "Rules": rule 4 as section 10; rule 5 loses the exit-shoroku exception
  and gains Keikaku, Kikaku (`.tanto/kikaku/` only), and Hosa (a slot);
  rule 6 names the definitions; rule 9 as section 10; rule 11's "Jisso at
  the plan's landing, Sekkei before it" → "Keikaku before it, Sekkei
  before that", the rest unchanged.
- "Now read your role file": seven lines, and "Read exactly one. The other
  three are not yours" → "the other six".

### 11.2 `skills/tanto/roles/kanri.md`

Start (the definitions, the start line, step 5's topic rule, the roster
columns); On a handshake (effort, topic, Kikaku's and Hosa's answers,
Keikaku's orders line, the Sekkei orders line's draft and out-of-scope
sentences); When the plan lands (the `plan.coldread` dispatch, `frame` in
place of the `awk`, T1 as section 5); The batch loop (step 2 as 7.3, step
3's adoption sentence to the recommender, step 6's reminder of 4.4, step 7's
slots naming the apply subagent and Hosa, step 8's Models line); The
final batch (`branch.review`, T2 as section 5); The Kaiseki branch (its
exit as 5.3); Handover (In flight lists the unanswered peers; the exit
shoroku as section 5; the Models line of the handover template); Shoroku
(the section rewritten to section 5 whole — the adoption rule paragraph
replaced by the recommendation and the human's check); Bug intake (filing
through Hosa when live; `paused:` / `continue:` bookkeeping under a new
"Limits" heading); Human access (step 5 removed — the brief is the
author's; the grants of 11.1); Session lifecycle (the Create table of 4.3,
the Replace table with Keikaku rows and "cleared" for Kikaku and Hosa,
the Delete table with Sekkei at the spec review accepted and Keikaku at
the plan's landing, the deletion after the recommendation; a Keikaku
compaction row and a Kikaku-or-Hosa compaction row per section 10;
Readings unchanged; Recovery with `fukki` and the seven roles). Also: the
batch loop's "A report that conflicts with the plan or the spec is a
cold-read question to Sekkei" → Keikaku, and "You stay out of `docs/` at
T2 — Jisso is the writer there" → "the apply subagent is the writer at
every stage"; "Cold-read the spec whole and the plan's frame" → the
dispatch of 7.1; the Handover's Timing and In flight per section 10.

### 11.3 `skills/tanto/roles/sekkei.md`, `roles/keikaku.md`

Sekkei as 2.3 — its opening "You own the spec, the plan, and the review of
both" → "the spec and its review"; its grant "the spec and plan dialogue"
→ "the spec dialogue"; "At most two strong-model sessions run at once" as
rule 9 reads now; "Kanri rules after T1 is committed, so the delta is
known" → the exclusion of 2.3; the Models table re-keyed to `spec.review`,
`brief.write`, `default`. Keikaku as 2.2, a new file whose Step 3, Step 4,
Handoff, write rule, and Models table are today's Sekkei text moved and
re-keyed (`plan.draft`, `plan.review`, `brief.write`, `default`), plus the
branch and spec commit of a draft, the plan brief's dispatch, and its
exit.

### 11.4 `skills/tanto/roles/kikaku.md`, `roles/hosa.md`

New files as 2.1 and 2.4, each short: who it talks to, how it starts,
what it writes and where, its lines to Kanri, what it never does, and that
it has no exit shoroku.

### 11.5 `skills/tanto/roles/jisso.md`, `roles/kaiseki.md`

Jisso: the Models table re-keyed to the four `task.*` kinds and the
`subagent_type` names; "Your subagent layer" rewritten — the definitions
tanto generates are the layer, the SDD prompts unchanged; the overrides
table's shoroku row (the recommendation and the human's check replace
"Kanri answering as the human's delegate"); T2 and the exit as 5.2; the
limit paragraph pointer. Kaiseki: its exit as 5.3 and its key `default`;
otherwise unchanged.

### 11.6 The templates

`roster.md` (columns, statuses, keeping rule, Residency header row with
Topic, the `refused` sentence, Events forms); `kanri.md` (the adoption
paragraph replaced; the Adopted column's values `pending`, `yes`, `no`; the
placeholder rows — today `| <A> | <1-4> | <planned, …` and `| S-1 | <the
report or session …` in `kanri.md`, `| S-1 | <the triage, …` in `roster.md`
— replaced by the distinct rows `| (no batch yet) | | | | | |` and
`| (no candidate yet) | | | | | | |` with the angle-bracket guidance moved
to the prose above each table, so that a scripted fill keyed on the
placeholder is unambiguous (issue-2872; the `(none yet)` form the issue
quotes is what a Kanri wrote, not what the template holds); the readers
line "Sekkei, Jisso, and Kaiseki read it" → the six; Measurements' three
fixed rows of 8.4 and the `paused:` rows); `kanri-handover.md` (In flight
per open ledger and the unanswered peers; the Models line re-keyed);
`batch-prompt.md` (the Models line
re-keyed: `task.implement`, `task.review-spec` and `task.review-quality`,
`task.escalate`, each with family and definition name); `review-brief.md`
(the header sentence and the two Sekkei mentions of section 6);
`tanto.json` (section 3.1 in full);
new `kikaku-decision.md` and `agent.md`. `batch-report.md`,
`bug-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`, and
`roster-archive.md` are unchanged.

### 11.7 `skills/tanto/scripts/passage-check.js` and its test

Section 8's three subcommands and their tests; the usage line.

### 11.8 `skills/tanto/README.md`

Seven roles; the seats the human opens; the brief written by the author's
dispatch; `fukki`; the Layout list with seven role files and thirteen
templates; the script bullet naming seven subcommands; the Relationship
paragraph — "who fills it" becomes the recommend-check-apply flow at every
stage, and "Composes, without editing them, … and `shoroku`" / "None of
those skills is edited" → "superpowers is used as it is; `shoroku`'s two
halves are its own feature, which tanto calls"; the design list gains this
spec's name and the tanto-workspace spec's.

### 11.9 `skills/shoroku/SKILL.md` and `skills/shoroku/README.md`

Section 5.4, the re-scoped prohibitions included; the README's "What it
does" bullet; and `docs/design/e3f4-shoroku.md`'s Workflow section at T2.

### 11.10 `docs/notes/tanto-consistency-checks.md`

Check 1 (the layout: seven role files, thirteen templates, the agent
template); check 3 (every template cited by the role that copies it —
`kikaku-decision.md` by Kikaku, `agent.md` by every role); check 6 (the
routing strings gain `decision:`, `chore:`, `slot-needed:`, `slot:`,
`paused:`, `continue:`, `exit proposal:`, `spec accepted:`, `cleared`;
lose `exit write-out committed:` and `brief:` as a reply); check 7 (the
absent strings gain the five old kinds as `subagents.<kind>`,
`Shomu`, `exit write-out`, `argument-hint: kanri | sekkei | jisso | kaiseki`,
`### Task` in a frame command); check 8 (the JSON parse of
`templates/tanto.json` asserts the twelve kinds and the seven roles with
both fields; a YAML load of a rendered `agent.md`); a new check for the
seven subcommands in the usage line.

## 12. The boundary, the batch cut, and rule 11

Every file the skill ships changes, and a session started mid-plan reads
whatever is on disk (rule 11). The plan names in Global Constraints and in
Batches: the authority sentence — the run's sessions follow the
constraints, Kanri's orders line, and the batch prompts, not the role text
on disk — and the boundary from which a role may be started or replaced.
Because `SKILL.md`, the role files, and the templates must agree — a
`SKILL.md` that names seven roles with four role files on disk, or a
Kanri text that dispatches `plan.coldread` with a `tanto.json` that lacks
it, is a half-edited skill — that boundary is expected to be the final
one, and the plan says so; Kanri's handover proceeds when due and its
successor takes the authority ruling from the handover file.

The batch cut the plan is expected to make, in this order, three or four
tasks each; the plan decides the exact cut and the review checks that no
cut leaves the tree inconsistent at its boundary beyond what rule 11
already covers:

- **A** — the scripts: `sections`, `frame`, `boundary`, their tests, the
  usage line; `templates/tanto.json` and `templates/agent.md`. Independent
  of every role text, testable by `node --test`, and usable by this run's
  own Kanri at the next boundary.
- **B** — `SKILL.md` whole: the contract first, so that the role files
  written after it have their vocabulary fixed.
- **C** — `roles/kanri.md`.
- **D** — `roles/sekkei.md` narrowed, `roles/keikaku.md`, `roles/kikaku.md`,
  `roles/hosa.md`, `templates/kikaku-decision.md`.
- **E** — `roles/jisso.md`, `roles/kaiseki.md`, the remaining templates,
  `README.md`.
- **F** — `skills/shoroku/SKILL.md` and its README,
  `docs/notes/tanto-consistency-checks.md`, the consistency pass over the
  whole skill (the note's checks 1 to 9 as one task), and the dogfood:
  generate the definitions on this machine, and, through a `human-needed:`
  line, have the human open one new session and report whether its
  available agent types list the twelve names.

This run's own sessions — this Sekkei, the `opus` Sekkei that writes the
plan (Fixed input 21), the Jisso to come, and Kanri `dotskills-2d` on
`sonnet` — run on the skill as it stands today: the brief is still Kanri's
dispatch, the exits still write out themselves, and the kinds are still the
five. The batch prompts say so.

## Old values this plan contradicts

One per entity the plan changes; the plan's `O` blocks are written from
this list, each needle spanning the point where the text changes, each run
as it is written.

1. **Four roles.** `SKILL.md`'s roles table (four rows), "never the other
   three", "Read exactly one. The other three are not yours", "list those
   five ids", the frontmatter's `argument-hint`, the README's role
   sentence, the Recovery section's "Sekkei only if a spec or plan is in
   progress", every "Sekkei, Jisso, and Kaiseki" and "Jisso, Sekkei, or
   Kaiseki" enumeration in `SKILL.md` ("One boss", "Kanri is the only
   session that sends to", the ledger's Artifacts row), the role files,
   and the templates (`templates/kanri.md`'s readers line), req-04f5's
   Purpose paragraph (T1).
2. **Sekkei owns the plan.** `SKILL.md` roles table, the Artifacts rows
   whose Writer is Sekkei for the plan and the dry run, the script sentence
   "run by Sekkei in place of an agent dry run" and "`roles/sekkei.md` and
   `roles/jisso.md` name its subcommands", the Workspace's "Sekkei cuts
   the branch"; `roles/sekkei.md` "You own the spec, the plan, and the
   review of both", "the spec and plan dialogue", Steps 3 and 4 and
   Handoff, "At most two strong-model sessions run at once";
   `roles/kanri.md` "When the plan lands" ("Sekkei sends you one line,
   `plan committed:`"), "a cold-read question to Sekkei", the Delete
   table's Sekkei row, the Replace table; `templates/kanri.md`'s "Branch —
   cut from main by Sekkei"; `templates/review-brief.md`'s "Sekkei asks
   for it on its own line" and "the recommendation Sekkei states with the
   brief"; the batch loop's step 7(c).
3. **The five kinds.** `implementer`, `reviewer`, `drafter`, `escalation`,
   `default` as `subagents.<kind>` in `SKILL.md`, `roles/*.md`,
   `templates/batch-prompt.md`, `templates/kanri-handover.md`; "The fixed
   kinds are"; "escalation sits above implementer"; "one `reviewer` key for
   every review"; "no `tanto` subagent runs on the top family"; "never the
   top family" (jisso.md, twice); "Every review runs on the one `reviewer`
   key" is decision-9a3a's and stays there.
4. **The value of a key is a family name.** `SKILL.md` "A value matches
   when it is a substring of that id"; "`sessions.<role>` is advisory"
   paragraphs; the README's Optional bullet.
5. **Kanri dispatches the brief.** `SKILL.md` Messages ("Kanri dispatches
   the review brief"), `roles/kanri.md` Human access step 5,
   `roles/sekkei.md` Steps 2 and 4 ("idle until `brief: <path>` arrives"),
   `templates/review-brief.md` header, the README's brief bullet,
   `docs/design/4807-tanto.md` (T2), req-04f5's brief bullet (T1).
6. **The adoption rule.** `SKILL.md` Session exit ("the adoption rule is
   that requirement and ADR items ... go to the human, and Kanri decides
   the rest"), `roles/kanri.md` "The adoption rule" and every "per the
   adoption rule", "Every report has a mandatory Shoroku candidates
   section. Adopt or reject each candidate at the batch boundary",
   `templates/kanri.md`'s adoption paragraph, `roles/jisso.md`'s overrides
   row ("Kanri answering as the human's delegate"), the batch loop's step
   3.
7. **The session writes its own exit.** `SKILL.md` Session exit ("the
   session applies the accepted subset ... commits once"), "Jisso idles
   through another session's exit; the cost is one boundary", every
   `exit write-out committed:` and `exit write-out: nothing accepted`
   (SKILL.md, kanri.md, sekkei.md, jisso.md, kaiseki.md), rule 5's
   exception clause, the Delete table's "after its exit shoroku is
   committed", `roles/jisso.md` "Apply." and "Your exit is this same
   procedure", `roles/kaiseki.md` Tree discipline's exit paragraph,
   req-04f5 (T1).
8. **Kanri writes T0 and T1, Jisso writes T2.** `roles/kanri.md` "T0 and
   T1" ("propose to yourself, apply the adoption rule ... make one
   commit"), "You may write under `docs/` at both", "You stay out of
   `docs/` at T2 — Jisso is the writer there"; the README's "Kanri at T0
   and T1, Jisso at T2".
9. **The frame is an `awk` keyed on `### Task`.** `roles/kanri.md` "The
   frame command"; issue-ac9d.
10. **Reports are read whole.** `roles/kanri.md` batch loop step 3 "Read
    the report", "never the report whole" already there for the dry run;
    the batch prompt's Report section.
11. **The boundary is hand-built.** `roles/kanri.md` batch loop step 2's
    list of checks.
12. **`/tanto resume` is the resume word.** `SKILL.md` Invocation table
    (`resume` row), "Resuming", the README, `roles/kanri.md` Recovery,
    issue-260c.
13. **Nothing about a limit.** No `paused:` or `continue:` anywhere;
    issue-5a17.
14. **Two standing grants.** `SKILL.md` Human access, `roles/kanri.md`
    Human access step 3.
15. **The roster columns.** `SKILL.md` "Columns are role, name `[ref]`,
    cwd, model, branch, mode, started, status, transcript";
    `templates/roster.md` header row and the Residency header row;
    statuses "one of `live`, `dead`, `replaced`, `refused`"; "`refused`
    records a handshake that got no row — a duplicate role, or a model
    that did not match" (a topic's second Sekkei is not a duplicate); "One
    live session per role".
16. **Eleven templates.** `SKILL.md` "There are eleven"; the README's
    Layout list.
17. **Four subcommands.** The usage line
    `<lint|replay|diff|verify>`; the README's script bullet; `SKILL.md`'s
    "its subcommands" sentence.
18. **The placeholders.** `templates/kanri.md`'s `| <A> | <1-4> |` row and
    `| S-1 | <the report or session` row, `templates/roster.md`'s
    `| S-1 | <the triage,` row; issue-2872. `(none yet)` is not in any
    template and is no needle.
19. **Kanri opens a topic only when no plan is in flight.**
    `roles/kanri.md` Start step 5.
20. **Rule 9 counts strong-model sessions.** `SKILL.md` rule 9 and rule 2
    ("the strong-model sessions"); `roles/kaiseki.md` "Sekkei pauses".
21. **The handshake has no effort.** `SKILL.md`'s handshake line;
    `roles/kanri.md` "Check `model=` against `sessions.<role>`".
22. **The create request carries the command only.** `roles/kanri.md`
    Session lifecycle's opening paragraph and the Create table.
23. **The rejected seat names.** `Shomu`, `shomu`, `Joshu`, `joshu` appear
    nowhere under `skills/`, `docs/notes/`, or `docs/design/`; this spec
    and the dialogue carry them as the record of the choice, and the sweep
    is over the skill and the living docs, not over `docs/superpowers/`.
24. **The skill-name key is personal only.** `SKILL.md` "No skill uses
    this today; skill-name keys are personal additions and are not in the
    built-in defaults".
25. **An omitted model inherits the strongest family on Kanri.** `SKILL.md`
    "which on a Kanri, Sekkei, or Kaiseki session is the strongest family";
    `roles/sekkei.md` Models "An omitted model inherits your session's,
    which is the strongest family".
26. **Kanri's exit has no direction file.** `SKILL.md` Session exit and
    Artifacts ("no direction file, because it rules on itself");
    `roles/kanri.md` "You have no second session to rule on you, so you
    rule on yourself".
27. **One set of roles per repo.** `SKILL.md` rule 4.
28. **The reading is the only thing read from the transcript.** `SKILL.md`
    "The transcript reading" — the shell block and "four figures".
29. **tanto edits none of the skills it composes.** `README.md` "Composes,
    without editing them" and "None of those skills is edited";
    req-04f5 "Composes without modifying" (T1).
30. **Sekkei's exit delta assumes T1 has run.** `roles/sekkei.md` "Kanri
    rules after T1 is committed, so the delta is known".
31. **Kanri does the cold read itself.** `roles/kanri.md` "Cold-read the
    spec whole and the plan's frame".
32. **shoroku never runs unconfirmed and never writes outside `docs/`.**
    `skills/shoroku/SKILL.md` Soft nudge "Never start a run without
    explicit confirmation", Prohibited actions "Do NOT start a shoroku run
    without explicit user confirmation" and "Do NOT write outside `docs/`".
33. **The Adopted column's `escalated`.** `templates/kanri.md` and
    `templates/roster.md` "`<yes, no, or escalated>`".
34. **Rule 11's starting roles.** `SKILL.md` rule 11 "Jisso at the plan's
    landing, Sekkei before it".

## Requirements

Settled with the human in the dialogue on 2026-09-13, verbatim, in two
rounds (W-1 to W-10; the second round rewrote W-3, W-4, W-5, W-7, and W-8 so
that each states the need and not its mechanism). T1 copies these texts;
nothing here is reworded at T1. The wording below is the English that goes
into the files.

**req-04f5, Purpose** — the sentence that names the roles, and the split's
reason:

> Kanri (管理) manages, Sekkei (設計) designs the spec, Keikaku (計画)
> writes the plan, Jisso (実装) implements, Kaiseki (解析) finds root
> causes, Kikaku (企画) is where the human thinks about what comes next,
> and Hosa (補佐) takes the small jobs. The split exists so that judgment
> stays on the strongest model, long output goes to a cheaper one, a
> session that waits holds a cheap context, and scope stays with the human,
> without any one session's context having to hold the whole run.

**req-04f5, "The human is interrupted only at defined checkpoints."** — the
clause on batch boundaries and after:

> ... batch boundaries, and there only for the stop classes of
> subagent-driven development and a scope or spec change; the shoroku
> recommendation at each stage, answered by exception — `OK` as
> recommended, or the items that go the other way; and the merge decision.

**req-04f5, "The human's counterpart is Kanri."** — one sentence appended:

> Kikaku, the seat the human opens to think in, is the exception: its
> counterpart is the human by definition, and what it decides reaches
> Kanri.

**req-04f5, "Model discipline."** — the bullet whole:

> **Model discipline.** The human decides which model, and how much effort,
> each seat and each kind of subagent runs on. A session that runs on
> something else is reported to the human and never switched silently
> (decision-08bc); a subagent never inherits a model or an effort by
> accident, so no long-output work lands on the strongest model
> (decision-9a3a).

**req-04f5, "Docs are kept current as part of the flow."** — the bullet's
body whole:

> Excerpting into the project's `docs/` happens at staged points of the
> run, not as an afterthought, and the human confirms what lands without
> having to read every item cold. Every planned exit of a session, in any
> role, carries its own shoroku before the human closes it, so that nothing
> a session learned is lost with it. An exit forced by a failure is the
> exception, and the record says what was lost.

**req-04f5, "The human reviews through a brief of the judgment points."** —
one phrase:

> a third party that shares no context with the author writes a brief

**req-04f5, "Composes without modifying."** — the bullet's body, the heading
unchanged:

> The skills tanto composes — superpowers, the `kisou` document system,
> `shoroku`, and the like — are used as they are; every override tanto
> needs is written into tanto's own files.

The recommend and apply halves of `shoroku` are `shoroku`'s own requirement
(below), so this bullet and section 5.4 do not meet.

**req-04f5, new bullet:**

> **A run is affordable to keep running.** The sessions that wait — the
> conductor, the executor between batches, a planner between reviews —
> hold the cheap families' contexts; the strongest model is used where it
> reads once and answers, and its runs per plan are counted.

**req-04f5, Out of scope:** "Custom subagent definitions." is removed; "How
the personal model config reaches the user's config directory." becomes:

> How the personal model config, and the agent definitions tanto generates
> beside it, reach the user's config directory.

**req-3c4d, the proposal bullet:**

> Present a single numbered proposal grouped by destination file. In
> session mode, end with `Direction?` and wait for partial-accept input
> (`OK` / `2 と 5 だけ` / `3 はやめて` / `全部やめ` etc.); for a caller that
> answers through files, write the proposal to the file it names, each item
> with a recommendation — adopt, reject, or unsure — and read the direction
> from a second file, applying and committing once from the two.

The writer of a write-out, the definitions that carry an effort, and the
count of roles are design; they go to design-4807 at T2 and to the ADRs'
Consequences.

## The ADRs

Decided in the dialogue; written at T1 with the requirements (the
adoption items are the human's, and the human confirmed each in the
dialogue). The human decides at the review whether the fourth and fifth
are ADRs or design.

1. **The top family is bought in one-shots, the resident seats run on the
   cheaper families, and a kind carries a model and an effort** — amends
   decision-9a3a: the five kinds become twelve `<object>.<act>` kinds with
   `{model, effort}` values; the consequence "no top-family subagent" is
   inverted — the top family is exactly what a one-shot buys, and a
   resident session is what it must not hold; the definitions carry the
   effort; the built-in `shoroku` key is a skill-name key. The rest of
   9a3a — two maps, JSON, per-key overlay, defaults in the skill, personal
   file outside — stands. decision-08bc is not amended: the effort check
   extends its model check on the same terms (checked twice, warn only,
   never switched) and the ADR says so.
2. **Adoption is a recommendation the human checks by exception, and the
   write-out is applied from files by a dispatched subagent** — amends
   decision-1f5f and decision-d831 (spec review, findings 1 and 2). From
   1f5f it replaces the adoption rule — the manager no longer answers
   `Direction?` as the human's delegate — and keeps the propose-and-apply
   split through files, which it generalizes to every stage, and the
   one-boss rejection of option (c). From d831 it replaces four clauses —
   the exiting session applies and commits, Kanri rules as the delegate,
   Kanri verifies the diff before the delete request, an attached Kaiseki
   commits its exit subset — and keeps the decision itself, that every
   planned exit carries its own shoroku with a proposal on disk before the
   deletion. 1f5f's standing `amended_by: ["ace0"]` is untouched: 1f5f
   stays accepted, so the amendment keeps its base. The `shoroku` skill's
   recommend half proposes and groups, the human answers `OK` or the
   exceptions, Kanri writes the direction, and the skill's apply half
   commits. Options: (a) the human answers every
   item cold (1f5f's rejected option), (b) the manager decides all but two
   kinds (1f5f), (c) a recommendation the human checks by exception, (d)
   each role dispatches its own recommender (rejected: a fable context
   receives the text, two extra hops, the author commissions its own
   judge). Consequences: every item passes the human's eyes; the interrupt
   is one grouped list per stage; the session that raised the candidates
   is deletable once they are on disk; the apply's family is the second
   measurement's variable.
3. **The review brief is dispatched by the document's author** — amends
   decision-ace0's dispatcher clause; the third party is the subagent's
   context isolation, not Kanri's hand; the two hops and Kanri's copy of
   the brief go. The rest of ace0 — the brief's form, its language, the
   human's answers as the confirmation — stands.
4. **Three seats join the roles — Keikaku, Kikaku, and Hosa — the spec and
   the plan are two roles, and the boundary is the spec review accepted**
   (issue-3c7a's decision; rejected alternatives: a mid-session `/model`
   switch, whose thinking blocks an older model cannot read; a shared
   Sekkei across topics, decision-f496; a tanto-own recommender template
   instead of a `shoroku` feature). Amends decision-2f36's consequence
   "Kanri becomes the one role that edits source outside a plan": the
   hotfix lane stays one ruling, Kanri's, and Hosa may be its hand in
   Kanri's slot. Consequences: a Sekkei drafting during another topic's
   batches commits nothing, and Keikaku makes the branch's first commits;
   Kikaku and Hosa have no lifecycle and are `/clear`ed; decision-6dea
   extends to Keikaku without amendment.
5. **A limit is a pause, never a model change** (issue-5a17; rejected
   alternative: continue on a lower family, measured once in another
   repository and called out by the human). Consequence: a pause may
   outlive the run, and only the human's word ends it.

The frontmatter bookkeeping the decisions rules require is part of T1's
apply: the new ids appended to `amended_by` on decision-9a3a, decision-1f5f,
decision-d831, decision-ace0, and decision-2f36 with their `updated:`
bumped; no ADR is superseded, so no `status` flips. issue-3c7a's "first
measurement is Sekkei on `fable` and Keikaku on `opus`" is replaced by the
matrix's Keikaku on `sonnet`, because I-1's matrix, written a day later
with the cost data in view, supersedes the issue's earlier guess; the
fourth ADR says so.

## What the plan must contain

- Global Constraints: the repo's `AGENTS.md` rules; the concrete families
  and efforts of section 3.1 for the run's own dispatches — under the
  five old kinds, because this run's sessions read today's skill; the
  authority sentence and the replacement boundary (section 12); the
  statement that the run's own Kanri dispatches the brief and the exits
  write out themselves until the plan lands.
- A Batches section as section 12 sketches, each batch with its stop
  conditions, and the boundary at which a role may be started or replaced
  named as the final one, with the sweep that shows it (a grep of the
  plan's own new-passage blocks for every term a later batch lands).
- How a batch is verified: lint on the changed paths by name; the content
  greps of check 6 and check 7 of the consistency note as amended in 11.10;
  a real YAML load of both skills' frontmatters and of a rendered
  `agent.md`; a JSON parse of `templates/tanto.json` asserting the twelve
  kinds and the seven roles; `node --test
  skills/tanto/scripts/passage-check.test.js` on the pinned Node; `node
  "$TANTO/scripts/passage-check.js" diff` as the boundary check; and, once
  batch A has landed, `boundary --plan <this plan>` run by Kanri as its
  own first measurement of the instrument.
- Passages in the block grammar for every file that changes in part, `W`
  blocks with `created:` declarations for the five new files
  (`roles/keikaku.md`, `roles/kikaku.md`, `roles/hosa.md`,
  `templates/kikaku-decision.md`, `templates/agent.md`; `SKILL.md` and
  `roles/kanri.md` are rewritten in passages, not whole, because their
  unchanged text is most of them), and the `O` blocks of "Old values" —
  written before the passages, one per entity, each needle spanning the
  change point and run as written.
- Every Verify step as one `verify --plan <path> --task <N>` invocation;
  the Self-Review's largest-task figures and the sweep-and-check tasks
  named (the consistency pass and the dogfood are two).
- The dogfood task's `human-needed:` line for the new-session check, and
  its measurement discipline (issue-f2ec): what the harness listed, not
  what it was expected to list.
- The T1 list for Kanri: the requirement edits of "Requirements", the five
  ADRs with their frontmatter bookkeeping, the six issues to move to
  `resolved/` (section "Issues this design closes"), and the Deferred
  items as new issues.
- The "The brief's form" section of `SKILL.md` as a passage moved verbatim
  from `roles/kanri.md`, so that the form check has one copy.
- Nothing about the report or prompt skeletons beyond "follow the tanto
  templates".

## Verification

The commands the plan's How a batch is verified section carries, so that
`boundary` can run them:

```bash
./scripts/lint.sh <changed paths, each by name>
node --test skills/tanto/scripts/passage-check.test.js
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==12)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
grep -rn -E 'subagents\.(implementer|reviewer|drafter|escalation)\b' skills/tanto | wc -l
grep -rn 'exit write-out' skills/tanto | wc -l
grep -rn 'Shomu' skills/tanto skills/shoroku docs/notes | wc -l
grep -n 'argument-hint' skills/tanto/SKILL.md
grep -c -E '^\| (Kanri|Sekkei|Keikaku|Jisso|Kaiseki|Kikaku|Hosa) \(' skills/tanto/SKILL.md
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1
```

Expected: lint clean; the tests pass; `tanto.json ok 7 12`; the old-kind
count `0`; `exit write-out` count `0`; `Shomu` count `0`; the
`argument-hint` line with nine words; the roles table count `7`; the
usage line naming seven subcommands. The consistency note's checks 1 to 9
run as one task in batch F, and the YAML loads of both `SKILL.md`
frontmatters use the real parser the note names.

## Out of scope

- issue-6a29's project overlay of `tanto.json` (Fixed input 7; the new
  issue that blocks it is in Deferred items).
- The second measurement's values (section 1.4) — written down, not
  applied.
- issue-9a68's rate-limit measurement; rule 9's exemption for Kikaku
  stands until it is measured.
- issue-4eef's `rewritten:` and `exempt:` declarations for `diff`; Hosa's
  filings do not remove the noise floor by themselves, and the plan's
  batches write under `docs/` only the consistency note, which the plan
  quotes.
- Any change to the superpowers skills, to `passage-check.js`'s existing
  four subcommands beyond the usage line, or to the `kisou` document
  system.
- A `wayaku` step: none exists in tanto (I-1, third pass, Q5), and the
  translator's model is `wayaku`'s own concern.
- Kikaku's, Hosa's, and Keikaku's readings as a replacement threshold
  (issue-40ed) — they are recorded like every reading and decided later.

## Issues this design closes

Moved to `docs/issues/resolved/` at this plan's T2, per the intake's rule
that the plan whose T2 lands the fix moves them: issue-3c7a (the split,
the pipeline, the draft rule, the re-send rule, the exit suffix — whole),
issue-2e52 (the three instruments), issue-5a17 (the limit rule and its
vocabulary), issue-260c (`fukki`, the alias, the `argument-hint`),
issue-ac9d (`frame` keyed on `^##+ Task`), issue-2872 (the placeholders).
issue-6a29 and issue-4eef stay open (Out of scope); issue-9a68 stays open
and rule 9's Kikaku exemption is what it will measure.

## Answers to the spec inputs

- **I-1** — the scope is taken whole (Fixed input 1) with the fourth
  pass's additions: the `/clear` reminder (4.4), `/clear` for Kikaku and
  Hosa and delete for Kaiseki (2.1, 2.4, 2.5), the kind name
  `candidates.recommend` superseded by the `shoroku` skill-name key (Fixed
  input 3), the resume vocabulary (9.2), and the T1 wording rule (section
  "Requirements"). The recommender's family is `opus` per the third pass's
  Q2 and the human's correction in Q-2. Shomu became Joshu and then Hosa (Q-7 and the human's word after the spec commit). I-1's
  "Kanri's assessment" is followed in every point but one: the brief
  writers stay on `fable` for the first measurement (Fixed input 4), and
  the brief is the author's dispatch (section 6), which I-1 did not
  consider.
- **I-2** — Kanri's three points on its own obligations, answered in the
  text: (1) the deletion request follows the recommendation, not the
  proposal, and an `unsure` item that says the candidate could not be read
  is one question back to the session before it goes (5.3); (2) the
  handover with two open ledgers — the trigger keyed on the batch-bearing
  topic, the In flight block per ledger, `kanri-address:` to every peer
  (section 10); (3) issue-f2ec's measurement check survives as a `sections`
  read of the Tasks and Verification sections for a batch that carried a
  measurement (7.3). The passing remark — where the create request's
  per-role extras attach — is answered in 4.3: line 5 carries them after
  the command.

## Deferred items

Each becomes an issue at T1, one to one.

1. **The agent definitions are user-scope, so a kind's effort cannot
   differ by repository, and a project overlay of `tanto.json` cannot
   carry an effort** — `blocks: ["6a29"]`; issue-6a29 gains the new id in
   `depends_on`.
2. **Four harness measurements the plan's dogfood makes** — whether a new
   session sees an agent definition written moments before it starts;
   which transcript field follows a `/effort` change; whether a
   definition's `effort:` key is honored by a dispatch that names it;
   whether `/clear` changes a session's name as well as its transcript.
   The issue closes with the dogfood report or records what was found.
3. **`boundary` runs the plan's fenced blocks and not the repo-specific
   leftovers check** (stray processes, temp directories) that loop step 2
   names in prose; a plan that needs one writes it as a fenced block.
4. **The apply half of `shoroku` on `sonnet`** — the second measurement's
   first variable, because it is the most clerical of the twelve kinds.
5. **A second live Sekkei's spec reviewer sees the first topic's draft and
   files** — the orders line pre-empts it by naming the out-of-scope paths;
   an instrument would list them from the roster's Topic column.
6. **The reminder of 4.4 depends on Kanri's next line existing** — a Kikaku
   that reports at the end of a day gets its reminder the next morning; a
   reminder line sent on its own was rejected as a wake-up that costs more
   than the miss.
7. **`docs/decisions/AGENTS.md` says nothing about what an amendment means
   once its base is retired** (spec review, candidate 2) — a gap in the
   document system, parallel to the one decision-7e21 filed; not exercised
   here, since no ADR is superseded.
8. **A composed skill's prohibitions are where a per-file change list does
   not look** (spec review, candidate 4) — the consistency note's check 3
   could extend to "every prohibition of a composed skill that a change
   relaxes"; deferred to the note's next revision.
9. **The tanto skill names one ADR in its text** (spec review, candidate 3)
   — every other decision reaches the skill as unattributed prose, so an
   ADR change is found only by a sentence sweep; a candidate for
   design-4807's notation section, deferred.

## The reviews this spec has had, and what each found

**The spec review** (2026-09-13, `opus` under today's `subagents.reviewer`,
read-only; report at `.tanto/tanto-cost/spec-review.md`, 29 findings, 27
missed old values, 5 scope findings, 6 shoroku candidates). Sekkei's
rulings, all applied in the text unless said otherwise:

- Blockers 1 and 2: decision-d831 was contradicted and unnamed, and 1f5f
  was superseded where the rules say amend — the second ADR now amends
  both and keeps what stands (section "The ADRs").
- Blocker 3: I-2 arrived after the commit and is answered ("Answers to the
  spec inputs").
- Blocker 4: this run's own Keikaku cannot exist — Fixed input 21; the
  human decided the same day: a second Sekkei on `opus` writes the plan.
- 5 to 20 accepted: the bookkeeping; decision-2f36 amended by the fourth
  ADR; decision-6dea extended (section 10); "Composes without modifying"
  and "The human's counterpart is Kanri" proposed for edit
  ("Requirements"); shoroku's prohibitions re-scoped (5.4); req-3c4d's
  bullet reworded; the dispatch counts (1.3); T1's four sections and the
  apply's inputs (5.1, 5.4); the form check moved to `SKILL.md` (6); the
  boundary candidates' `pending` row (5); the effort checked twice
  (Fixed input 2, 4.1); the nonsense command removed; the definition's
  `effort:` made a measurement (3.3).
- 21 to 29 accepted: the two single-word kinds named (1.2); issue-3c7a's
  first-measurement deviation stated ("The ADRs"); `resume` added to the
  `argument-hint` (9.2); an "Issues this design closes" section; Out of
  scope corrected; old value 23 rewritten; `/clear`'s effect on the name
  made a measurement (4.2); this section filled; the date line.
- The 27 missed old values are folded into the list — entities 1, 2, 6, 7,
  8, 15, 18 widened, entities 24 to 34 added.
- Scope findings 1 to 5 go to the human through the brief: the issue-3c7a
  widening (Fixed input 1), this run's Keikaku (Fixed input 21), the
  shoroku edit against "Composes without modifying", the ADR set, and the
  two requirement edits the reviewer read as design (dropped from
  "Requirements": the definitions sentence and the role count).
- The review's six shoroku candidates are Kanri's to adopt from the report;
  three became Deferred items 7 to 9.

**Kanri's I-2** (2026-09-13, `sonnet`, from `roles/kanri.md` on disk):
three obligations the design had not accounted for, all answered
("Answers to the spec inputs").

**The review gate** (2026-09-13; brief at `.tanto/tanto-cost/review-brief-spec.md`,
written by the `opus` brief writer Kanri dispatched, in Japanese): `all OK`;
1.2 → the plan is written by a second Sekkei on `opus` after this Sekkei
exits (Fixed input 21); the unsettled decide → the fourth and fifth are
ADRs, five in all; and the requirement wording settled in the dialogue in
two rounds and carried verbatim in "Requirements". The human's own
question in the second round — "what is the user's requirement here?" —
is what produced issue-c9df, filed by Kanri the same day from Sekkei's
draft.

## Shoroku candidates from this spec work

For Kanri's `S-n` table; the exit proposal will carry the ones not adopted
here.

1. Measured 2026-09-12: the transcript's `assistant` records carry
   `effort` and `perTurnEffort` (46 each in a 385 KB file), so a session's
   effort is readable from the same file as its reading — a fact for
   design-4807 and for the reading's documentation.
2. Measured 2026-09-12: an agent definition written to `~/.claude/agents/`
   during a session is not dispatchable from that session (`Agent type
   'tanto-probe' not found`); the harness loads definitions at session
   start — design-4807.
3. The `shoroku` skill-name key of decision-9a3a, unused since 2026-09-06,
   is the mechanism the recommender needed; a mechanism written before its
   second case found it — an observation for the ADR's Consequences.
4. Rejected: `candidates.recommend` as a tanto-own kind with a tanto-own
   template (I-1's matrix) — a skill feature serves the standalone
   `shoroku` user too.
5. Rejected: each role dispatching its own recommender — the parent's
   family, the hops, the commissioner (Q-2).
6. Rejected: 庶務 shomu, 書記 shoki, 司書 shisho, 総務 soumu, 保守 hoshu for
   the chores seat (Q-7): 補佐 hosa chosen because the seat's essence is a
   place for small jobs one forgets at once, and 庶務 read as corporate.
7. Rejected: `/tanto saikai` as the session-resume word (Q-5) — 再開 is the
   word the human types after a limit, and the two acts must not share
   one.
8. Rejected: a `/tanto` argument for the after-a-limit act (Q-5, C) — the
   role is alive; one boss; the resume is Kanri's line.
9. Rejected: project-scope agent definitions and static shipped
   definitions (Q-4).
10. Observation: the principle "the one who holds the context writes"
    (decision-1f5f) stopped holding the day the proposal became a file, and
    nobody noticed for three plans — a candidate for the report's
    observations.
11. Observation: Q-6's seven points and Q-8's eight points were confirmed
    with one correction each, and the dialogue's questions moved from
    choices to design sections at Q-6; the brainstorming skill's "present
    the design in sections" step is where a tanto spec dialogue spends
    most of its turns.
