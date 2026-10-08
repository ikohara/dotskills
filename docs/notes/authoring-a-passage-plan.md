# Authoring a passage plan

A passage plan states its own verification instead of pointing at a
whole-file diff: an anchor line, an old passage, a new passage, and a grep or
count that proves the edit landed. This note collects lessons about writing
that content well — the needles a plan pins, the entity-level sweep that
runs beside them, the counts it states, how an expectation is worded so a
failure is actually possible, the different domains its sweeps cover, and the
recipe a passage task follows on a CRLF host. Lessons about the scripts and
tests that carry out
the checking, rather than the plan text that states them, are in
`docs/notes/reviewing-an-instrument.md`; the mechanical checks a `tanto` plan
runs against the skill itself are in `docs/notes/tanto-consistency-checks.md`.

## Needles

- A ruling that names a line by number is stale the moment a passage lands
  above it; a ruling carries the text it addresses, not the line it happens
  to sit on today.
- Line-item rendering inside a numbered list is invisible to every grep a
  plan can write: a leading blank line before a list item, for instance, has
  to be verified through `cat -A`, not through a pattern search.
- A semantic removal needs a semantic check. Deleting a flag such as
  `notify_when_idle: true` while leaving behind the sentence that justified
  it — "because the idle notice is the forced-exit signal" — passes a grep
  for the flag alone; sweep for the reasoning too.
- No needle enters a plan without a non-zero `grep -cF` on the file it names,
  run by the plan's author. A needle taken from prose that wraps in its target
  measures 0 and passes vacuously — it reads as "already gone" when it was
  never findable.
- The absence sweep's expected counts are computed from the plan's **new**
  texts, not from the old tree. A replacement can reintroduce the needle it was
  written to remove, and a count derived from the tree before the edit would
  not notice.
- **A mid-sentence insertion changes what a later pronoun resolves to.** Check
  every pronoun and demonstrative that follows an insertion in the same
  sentence or paragraph: the new text supplies a nearer noun, and the reference
  silently re-points to it. Three tasks of one plan hit this shape —
  an inserted clause left "already been deleted" attached to the wrong subject,
  an inserted item split a list so a following "these" covered a different set,
  and an insertion in `skills/shoroku/SKILL.md` left "that path" reading as the
  brief path instead of the output path. The passage is correct in isolation
  every time; only the surrounding sentence breaks, which is why no needle and
  no diff finds it.
- **A disposition of `0` is a measurement on the tree the check will run
  against, never a guess.** Three `O` needles of one spec as first written —
  `one of three`, `at every stage`, and `twelve` in `roles/kanri.md` — had
  legitimate survivors, or had already been zeroed by a plan ahead of it, so
  the stated `0` was wrong in both directions at once. Stating a disposition
  without counting it on the tree the check will run against is a boundary
  failure nobody intends and no later step re-derives.
- **Run the plan's retired-string list over any text pasted from an amendment
  or a decision file, before it becomes a `P` block.** Such text describes the
  *pre-plan* tree, and pasting it verbatim installs the vocabulary the plan is
  removing. Measured on `seat-lineage`: an R-7 fold-in copied a decision file's
  own wording, "Kanri's delete requests", into text the plan installs — where
  delete requests no longer exist. `plan.review`'s scoped pass caught it before
  the commit, and the drafter's own second amendment fold, done the same way
  earlier, happened to be clean but was never swept. The sweep is the rule;
  being shown the miss is not.
- **Check every needle against the plan's own new texts before the table is
  frozen.** A needle that matches text the plan itself installs reports one
  false hit forever. Measured on `bug-report-hold`: the spec's "Old values this
  plan contradicts" table bundled `` four `##` headings ``, which is the exact
  string one of the plan's own passages writes into `skills/shoroku/SKILL.md`,
  so Task 17's sweep found a hit that was the plan working correctly. It
  surfaced only because that sweep's author investigated the surprise instead
  of assuming the script was wrong. issue-3e94 is the anchor-side sibling: a
  needle measured against its own new passage.
- **An `O` needle whose disposition is "stays" quotes the sentence it judges.**
  A disposition stated as a reason alone survives a misreading of the text it
  is about; the quotation does not. Measured on `bug-report-hold`, where a
  disposition claiming a shipped phrase was wrong went through the plan, a
  dogfood report and a batch proposal before a plain re-read of the cited
  paragraph overturned it — the neighbouring sentence, had it been quoted
  beside the claim, refutes it on sight.
- **A needle catches the literal string, not the claim.** A needle derived from
  the sentence being replaced can miss a paraphrase in a neighbouring section,
  while a needle derived from the retired *token* sweeps every literal
  occurrence. Measured: one needle swept a stale table header to zero while six
  body rows and a parenthetical kept the retired label, and the paraphrase
  elsewhere was found only by a reviewer's read of the neighbourhood.
- **Every sweep loop passes `--` before the needle:** `grep -rF -c --
  "$needle"`. Without the end-of-options marker, a needle whose own text begins
  with `-` is read as an option and the loop errors out. Found at the cold read
  of `tanto-bg-seats`'s task 23, in that task's own sweep, after two rows had
  already been drafted without it — the shape needs `--` in every sweep loop,
  not only the one that happened to draft a leading-`-` needle first.
- **A needle sweep is structurally blind to the neighbour of a passage.** The
  sentences that break are the ones sitting just outside a passage's own stated
  old-text scope, now contradicting the passage the same task has just landed:
  the passage's text is right, and the damage is in what it left standing next
  to it. No needle names such a sentence, because it was never the target of a
  passage — so no dry run, plan review, or cold read reaches it either, and
  only a reading of the neighbourhood does. `docs/notes/tanto-measured-data-points.md`
  carries the count from the batch that measured it.
- **Anchor a negation-word filter with `\b`.** The `shoki-seat` plan's
  sweep allowed a hit when a negation preceded it, as
  `(No|no|never|Never)[^.]*`, which also admits `node`, `note`, `not` and
  `now` as the negation; harmless on that tree, but a filter that passes by
  accident. The plan review asked for the `\b`-anchored form — and the
  repair, typed through a tool, landed as two literal backspace bytes that
  failed the check on correct code (issue-b873). Type `\b` where no tool
  interprets escapes, and look at the bytes.
- **Let a script decide what is findable.** The tanto-feedback spec's Old
  values list, as first written from reading, had three needles of fourteen
  that no fixed-string search could find, because the source wraps
  mid-phrase. Rebuilt from a script of about twenty lines that searches each
  needle line by line and fails on a miss, the list had 43 needles, all
  found: the count tripled once the search, not the author, decided what was
  findable. Kin issue-e13a.

## An entity-level sweep beside the phrase-level one

- A passage plan's `O` needles are the old *phrases*, and a contradiction
  can survive in a sentence that uses none of them. In the kisou-refresh
  plan, two sentences of `skills/kisou/SKILL.md` (lines 177 and 143 at the
  time) still carried the pre-instrument model in words no needle matched;
  they surfaced in the batch B report, not in the sweep, and the fix wave
  repaired them.
- So after the passages land, read each touched file whole for every
  *entity* the plan changes — who creates a file, who decides scope, what is
  offered — not only for the phrases the `O` block pins. The phrase sweep is
  mechanical and finds the closed enumerations; the entity pass is a reading
  and finds the sentences that restate the old model in new words.
- A site list built by `git grep -F` of the changed sentence's own words
  cannot find a sentence that states the same rule in other words. In the
  tanto-feedback plan, "never address a Kikaku first" (the narrowed opening)
  and "never send to Kikaku" (a later line of the same role file) share no
  term, so the site list for the task that narrowed the rule could not find
  the contradiction; the task's quality reviewer found it by reading the
  whole role file at HEAD against the new text. A site list for a rule names
  the sentences that state its scope or its negation, found by reading the
  file, and every task that narrows a rule keeps the reviewer's cross-read
  of the file at HEAD in its dispatch. A fix wave's quality review names the
  old wording as a search term for the same reason.

## Counts

- A red step's failure count is a measurement, not an inference: adding an
  assertion changes the number, so state the count from a run, the way the
  plan already requires of every other count in its prose.
- A reduction is harder to verify than a disappearance. Two needles going
  3 → 2 and 2 → 1 both read as failure on a naive nonzero check; check the
  arithmetic behind the reduction before calling either one broken.
- `git ls-files --eol` has no baseline for a file the plan creates — a
  just-written file reads `w/lf` where a checked-out file reads `w/crlf`
  under `text=auto`. Split a line-ending invariant into existing paths, which
  must hold their pre-edit value unchanged, and new paths, which must read
  `w/lf` and never `w/mixed`.
- Passage coverage is verified completely and cheaply by comparing per-file
  needle counts in the working tree against the same counts inside the plan's
  own old blocks: if the plan's blocks account for every hit the tree carries,
  no passage is missing.
- A multi-line old block is checked as a **substring** — a Node one-liner, CRLF
  normalized, count exactly 1. `grep -c` is line-based and cannot do it, so a
  multi-line block checked by grep is not checked.
- A sweep records the **before**-count at the base as well as the after-count at
  head, or it has measured an absence that may always have been there. In the
  tanto-workspace run the task-6 reviewer counted all twenty `O` needles on the
  pre-plan tree and found every one non-zero and equal to the plan's own block
  list; without that half, nineteen zeroes at head prove nothing.
- Where a check exists in both a filtered and a raw form, the filtered form is
  the invariant and the raw per-file count is only a snapshot: any later edit
  that legitimately adds the needle to a swept file invalidates the raw one
  while the filtered one still holds.
- **A sweep-and-check task that moves the consistency note's own figures needs
  an explicit carve-out**, because such a task otherwise may not add lines
  beyond its own quoted passages. The `shoroku-at-close` plan's Global
  Constraints wrote one speculatively ("Task 10's own note-figure
  correction … may add lines beyond its own quoted passages") and its Task 10
  is the first real case of it firing — twice, for two independent reasons: a
  line wrap collapsing a literal count, and an intentional retirement from an
  earlier task. That is the worked example the next task of this shape points
  at.
- **A count threshold names its tie side and its authoritative measurement.**
  The `tanto-issue-triage` spec fixed a split rule at "above fifty issues"
  and measured its round sizes (61, 76, 33, 58, 26, 54) under a matching rule
  the instrument did not yet exist to confirm; a title-only count under the
  rule as written gave 50, 79, 28, 64, 25, 62, with round 1 exactly on the
  threshold. A threshold that fixes a plan's task list states which side a
  tie falls on and which measurement decides; that plan carried a
  conditional task for the borderline round instead.
- **An `O` row's fence can sweep the whole skill directory at no cost.** All
  19 of the `shoki-seat` batch B needles counted the same over the whole of
  `skills/tanto` as over their own file. The per-file scope was the drafter's
  caution, not a measured need, and the wider scope also catches a site the
  plan did not name.

## Expectations

- A verification item that names a path outside the repository cannot fail
  for the plan that states it. Filter a plan's Verification section by
  asking, of each item, "name the edit that would make this go red" — an
  item nothing can falsify does not belong in it.
- A stop condition met by an earlier task in a batch can be undone by a later
  task in the same batch. Re-check the condition after each task, not only
  at the batch boundary, so the commit responsible for a regression is
  unambiguous.
- A recollection about a different host is the failure mode of "measure
  first": a premise checked against a plugin's cache passed because a `.js`
  payload read as "skills ship scripts" — the actual question, why that
  language, only surfaced once someone asked it directly. A measurement
  answers the question it was given, not the question that seems adjacent to
  it.
- `mise` pins a Node version the way `uv` pins a Python version
  (`mise x node@22 -- node --version` → v22.23.2, measured 2026-09-10); a
  spec briefly carried the opposite claim before this was checked.
- A repository-level tool config can break the tool it provisions: an
  untrusted `.mise.toml` fails every `node` invocation in the repository
  through the shim. A prerequisite that adds such a file also adds `mise
  trust` to the contributor steps, with a gate that runs the tool from
  inside the repository — not only `--version` from anywhere else.
- `biome check --write` strips `'use strict';` from CommonJS files. Where
  plans are authored, a skeleton that needs the pragma has to add it after
  Biome runs, or expect it gone.
- A grammar shape with no user in its own plan gets no coverage: a plan's
  `W` block shipped implemented in three functions with zero tests and zero
  call sites. A plan that specifies more grammar than it exercises says so,
  and mandates the tests that exercise it.
- `replay`'s `DIFFERS` is a literal string comparison of a command's output
  against the `Expected:` **paragraph**, so an expectation written as prose
  reports `DIFFERS` even when it is fully satisfied. Shape an `Expected:` to one
  short line wherever a machine verdict is wanted, and accept that prose leaves
  a human ruling to make: of the six `DIFFERS` in the tanto-workspace plan's
  whole-branch review, five were semantic passes adjudicated by hand.
- A **missing script path** is not a spawn failure. `node path/that/does/not/exist.js`
  starts node, which reports `MODULE_NOT_FOUND` on stderr and exits `1`, so
  `result.status` is `1` — not `null`. `null` is what a spawn that never ran at
  all would give. A verification item or test written against `status === null`
  to prove "the script is absent" therefore passes vacuously, and keeps passing
  once the script exists and merely fails. (Distinct from issue-235b, which is
  a `MODULE_NOT_FOUND` from the `node --test <directory>` form — same message,
  different cause.)
- **Before treating a fresh-start gate near a batch boundary as an extra step,
  check whether an ordinary handover already supplies it.** In the
  `shoroku-at-close` run, a plan-stated gate — a fresh `/tanto` start after
  Batch D lands, before the close's recommend and apply dispatches — and the
  conductor's own context ceiling converged by accident at the same boundary:
  a session started after Batch D's acceptance is exactly what the gate needs,
  and the handover was going to produce one anyway. A plan that states such a
  gate should say which event is expected to satisfy it, so the boundary is not
  paid for twice.
- **A queued-topic catch-up can come back empty, and one did.** The
  `tanto-project-config` catch-up found zero real drift on its first run:
  `replay --base main` exited `0`, all 57 residual `O` needles measured `0`
  hits, and both `twelve`-sites were confirmed absent. A positive data point
  for the bet that a fresh seat can follow a catch-up's written orders without
  the drafting session's memory — the orders were enough.
- **Re-run `replay` after every edit of the plan, not once at the dry run's
  start.** Measured on `seat-lineage`, where the risk of drafting against a
  moving branch materialized **twice** and the same mechanical check caught
  both: two further commits on the branch being drafted against each reworded
  text that the plan's whole-section-replace tasks quote verbatim as their old
  block. Neither drift was visible by inspection — the first surfaced only
  because `replay`'s `occurrence-count` check failed after an amendment
  fold-in, and the second was confirmed harmless the same way. A drafter who
  runs `replay` once, at the start of the dry run, commits a plan with a stale
  quote and finds out when `verify` fails mid-execution.
- **When the target file is under another plan's concurrent edits, a rigid
  anchor on today's tail goes stale; "grep, then append" is the shape that
  holds.** On `seat-lineage`, a task appending a section to
  `docs/notes/tanto-consistency-checks.md` declined the `P`-block conversion
  its plan review suggested, because that file was still being edited by
  another open plan and an anchor on its exact tail would have gone stale the
  moment that plan touched it again — which it then did, twice, before this
  plan's branch was even cut. The flexible shape held under exactly the
  condition it was designed for; the judgment is worth restating as a
  confirmed call rather than a hedge.
- **A plan large enough to rewrite its own skill has structurally more seams
  of two specific kinds, and a cold read finds them.** Nine cold-read
  questions on one `seat-lineage`-sized plan is a high count, and eight of the
  nine traced to two root causes rather than to nine independent misses. The
  first: *a passage written once and referenced from elsewhere goes stale
  exactly where it is referenced, not where it is written* — the spec's
  Amendments treatment, the Verification section's cross-reference, and a
  fresh-start check's inherited but unearned claim. The second: *a plan's own
  execution has phases the plan does not otherwise model* — the close happens
  after the plan's own last commit, and a whole-branch review's fix wave is a
  conditional extra batch that neither the Global Constraints nor the Batches
  table accounted for. Name both as a size-class observation for the next
  drafter of a plan against its own skill's lifecycle; it is not a fault of
  the run's care. (issue-7281 is a different variable — task size against
  context cost — and issue-96f2 is the tool-side of the second cause.)
- **A step that predicts what a script will find on real data states the
  prediction as a measured value, with the command that produced it, or says
  plainly that it is unmeasured.** Measured on `bug-report-hold`: a retrofit's
  date guard (`copy_date <= created`) is satisfied by a *same-day* inbox
  reference as readily as by one well after the fact, so it produced a
  `Source: inbox …` line — arguably the truer provenance — for an issue the
  plan's own narrative had assumed would fall through to `session`. The
  narrative was written from reasoning about the data rather than from a run
  against it. issue-e13a and issue-2e2b hold the sibling gaps for spec quotes
  and for dogfood stages.
- **A `P` block the formatter reflows is the one shape that reaches both
  `verify` and the boundary `diff`.** A `W` block or a plain append reaches
  neither. So the cost of "let the boundary rule on it", under the rule that
  the formatter's output is canonical because it is run, is one visible red
  check — and only in the reflowed-`P` case.
- **A fence that checks two runs agree does not check that the first was
  clean.** Measured on `tanto-diet`'s fence 4: `boundary.js record`, run on an
  untouched copy of the ledger and roster templates, writes a Measurements
  Value cell holding four of the template's placeholder fragments *plus* the
  real entry — and the fence, which asserts only that two successive runs
  produce identical output, passed over it. Idempotence and correctness are
  different properties, and a fence that tests the first says nothing about
  the second. One extra assertion — grep the written row for `<` — would have
  caught the defect the whole-branch review found instead.

## A block must survive its destination's linter

A block is written against the file it lands in, and that file's linter runs
with `--fix` before the commit. A block the linter rewrites can never match.

- **Never put a leading *or trailing* space inside an inline code span** in a
  file markdownlint lints. `MD038`'s `--fix` strips it and then reports zero
  errors, so the passage is unlandable and the failure looks like a missing
  passage. Measured twice in the tanto-workspace plan (`roles/kanri.md`,
  `roles/kaiseki.md`), with the counter-case that `skills/**/templates/**` is
  ignored by this repository's configuration and the identical span lands
  byte-exact there; and twice more in the tanto-sweep-2 run, both of them
  **trailing**, which is the side the rule originally omitted. The mechanism is
  the same on both sides and the symmetric form is the trap that makes it easy
  to miss: a span written with a space on each side of a heading marker, to
  show the marker as it appears in a heading line, renders with both trimmed,
  so what the author sees rendered is never what the passage must match.
- **Plan the suppression up front**, whenever a task or a fix specifies an
  exact text containing a code span that begins or ends with a space. Decide
  where the inline suppression comment goes while drafting the block, not after
  a `BLOCKED` report comes back. The pre-commit hook enforces `--fix` on
  **every commit attempt**, not only on a standalone `lint` call, so there is
  no path that lands such a block without the suppression — discovering it late
  costs a round trip and buys nothing.
- **The suppression pair goes *outside* the passage's own contiguous line
  range.** A `<!-- markdownlint-disable MD038 -->` / `<!-- markdownlint-enable
  MD038 -->` pair placed inside the passage breaks `passage-check.js verify`,
  whose match is exact and per line: the comment lines are text the plan's
  block does not carry, so the passage reads as absent even though it landed.
  Wrapping the whole replacement block instead costs a few suppressed lines
  that need no suppression and keeps the passage verifiable. Measured in the
  `tanto-project-config` run's Batch B, task 5, where a passage plants a
  literal leading space inside a code span
  (`` ` Project-scope copy for this repository.` ``) and the implementer had to
  place the pair by hand — the plan's own passage text said nothing about it.
  So a plan that specifies such a passage should specify the pair's placement
  too, at drafting time, together with the decision the bullet above asks for.
- Where indentation is **load-bearing content** rather than formatting, prose
  has to carry it, because a code span cannot: `config:` with an unindented
  `default: false` is two top-level keys, and markdownlint-cli2 discards the
  second — the file silences nothing.
- **Old and new texts go in fenced `text` blocks, never in code spans**, in a
  spec or plan that quotes them inline. A passage that itself holds backticks —
  a `subagent_type:` value, a placeholder — ends a single-backtick span early,
  and the rest of the line is read as Markdown. Measured on the tanto-sweep-2
  spec: a first draft written with code spans reported 95 findings (`MD033`,
  `MD038`) under markdownlint-cli2 with the repository configuration; fencing
  the same texts as `text` blocks brought it to 0.
- So the plan-time check is a `--fix` dry run of every new-passage block against
  the **destination's own** lint configuration, not against the repository's
  default. The same gap for non-Markdown targets is issue-f851.
- **A code span that opens or closes with a space cannot survive the lint.**
  A "should read" block whose code span begins or ends with a space —
  `` ` — claude attach <id>` `` — fails `MD038`, and the hook rewrites it
  silently, so the literal changes (the `shoki-seat` fix wave, Task 14). Text
  an agent is to copy puts the space in words or outside the span.

## A fence that carries its data after a heredoc fails open on a non-ASCII byte

Measured on `roster-ledger`'s plan (2026-10-07): a non-ASCII byte (an em
dash) in a bash fence of How a batch is verified cut the command short under
`boundary --plan` on this Windows host; the heredoc then ended at end of
input and fence 4 reported no residual, which reads as a pass. A fence that
carries its data after a heredoc fails open. The shape that holds: keep the
needle list in a `text` block and read it with `sed`, and build any
non-ASCII needle by `printf`, so no fence's own bytes leave ASCII.

## The instrument's domains

- When a plan changes a form an ADR describes, the plan's `O` sweep (its
  old-value absence check) runs over `docs/decisions/` too, even though the
  ADR itself is never edited — an ADR that still describes the old form is
  exactly the kind of drift the sweep exists to catch.
- A `replay-skip:` pattern is matched as a substring against the whole
  fence, so a one-word pattern (`mise`) silences every unrelated command
  sharing that fence, and the printed reason describes only the matching
  line. State a skip pattern as specific as the command it names.
- `replay`'s residual sweep covers every path a plan touches, while an `O`
  row's counts are measured over the skill directory alone; the two domains
  differ, and following a residual into that difference is what surfaces a
  stale check in `docs/notes/tanto-consistency-checks.md` rather than in the
  skill itself. A reviewer who does not know the domains differ cannot use
  either sweep to explain the other's result.
- **Rejected alternative, so it is not tried again: do not fence a `diff` call
  with a literal placeholder value.** It looks runnable — the fence carries a
  concrete base and a reader can copy it — but the value is fixed at drafting
  time while the real base is resolved later, so `replay` records `DIFFERS`
  forever and the fence becomes permanent noise. Point at "How a batch is
  verified"'s own hand-run instruction instead, which resolves the value at the
  moment it is needed.
- `diff` counts an added line as *accounted* when the plan quotes that line
  **anywhere**, not only where a passage lands it. Measured in the
  tanto-workspace fix wave: nineteen lines were added to a note and only
  thirteen read as `unaccounted-added`, because the plan's own Verification
  section quotes verbatim the two commands the new text carries. A line can
  therefore be accounted for by the prose that specified it rather than by a
  block that lands it.
- **`diff` compares literally.** An added line counts only when it equals a
  whole plan line, and a removed line only when the plan quotes it inside a
  fenced block. A plan that describes an edit in prose cannot pass `diff`: the
  exact lines must be quoted, or the boundary lists them as unaccounted.
- **A snippet quoted for a position must be quoted at that position's
  indentation** ("inside branch X, before call Y"), or `diff` lists every line
  of it as unaccounted. Prose placement and literal comparison disagree at the
  whitespace.
- **`diff --base <your own commit>`, run *after* committing, reads clean having
  compared nothing** — that range is empty by construction. The informative run
  is the one before the commit, over the batch's own range. Relatedly: a spec
  file under `docs/superpowers/specs/` carries no passage in the plan and
  legitimately reports `unaccounted-added`; that is neither coverage nor a
  defect, since the spec is the author's artifact rather than a task's output.

Each subcommand sees less than its name suggests, and the three gaps are worth
stating together, because a plan author otherwise learns them one boundary at a
time. `verify` matches a task's `P` blocks and `A` anchors present in the tree
exactly as the plan quotes them, and nothing else — no `W` block, no `before:`
value. `diff` compares a commit range against the plan's quoted lines and lists
whatever it cannot account for, which includes every authorized edit the plan
did not quote. `replay` runs the plan's fenced commands in a scratch tree, and
its exit `0` measures only the `W` / `P` / `A` / `O` needles: on one plan it
skipped 36 commands of four shapes — `.bat` files, `verify` itself, cmd's
`type`, and the git add/commit blocks — and said nothing about batch files,
lint, or the test suite.

## Scripted edits

A batch of passage edits applied by a script is subject to the replacement
language's own substitution syntax, which no lint and no needle sweep will
catch.

- **`String.prototype.replace(old, new)` expands `$'`, `$&` and `$1` inside
  `new`.** Measured on `bug-report-hold`: a new text containing
  `'^## Recommended fix$'` re-inserted the rest of the file — about 110 lines,
  twice — at the point of the match, because `$'` reads as "the text after the
  match"; a first repair then cut the wrong span, and the file had to be
  restored from `HEAD`. Use `split(old).join(new)` or a replacement *function*,
  neither of which reads a substitution pattern in the replacement.
- **Assert exactly one occurrence before writing**, since a zero-hit or
  multi-hit replacement is the failure the script cannot report afterwards.
- **Count the file's level-two headings after a batch of edits.** The
  duplication above was caught by that count and by nothing else; lint passed.
- **Match fence lengths when scripting over a plan by hand.** A block whose own
  content is fenced sits in a four-backtick fence, and a script that ends a
  fence at the first three-backtick line reads the wrong block. Measured on
  `bg-seat-ergonomics` (P13.23): a reviewer's first pass reported
  `roles/keikaku.md` line 311 as unrenamed — a false survivor — until it
  matched fence lengths. `passage-check.js`'s `readFence` already does.

The same call applies a plan's `W` and `P` blocks, so this is the drafting side
of an instrument gap, not a one-off scripting accident.

## The passage-task recipe on a CRLF host

The recipe that ran without a fix round on this host in the kisou-refresh
plan, for a Markdown target (batch B) and a YAML one (batch C) alike:

- Read/Edit tools only — never `sed -i` or a heredoc on a CRLF file.
- The checker (`verify --plan <plan> --task N`) before lint and again after
  commit, so that a fixer's rewrite between the two shows up as a passage
  moved.
- `grep -cF` per anchor before and after the edit, the count from a run.
- For a YAML target, the hook run by id, because `scripts/lint.sh` given the
  config path skips it.
- **A check that joins lines must strip `\r` first.** Every file under
  `skills/tanto` has CRLF endings, so a needle assembled by joining two or more
  source lines carries a `\r` at each join and matches nothing. Measured on the
  `tanto-context-ceiling` spec review: six of its eight "Old values" needles
  read as missing until the reader stripped `\r` before joining — six false
  absences in one pass, all from this alone. The single-line `grep -cF` case is
  unaffected, which is exactly why the failure is easy to miss.

## A rebase note predicts the passages, not the fix commits

A plan's own "Rebase note", written at drafting time before the other topic
merges, predicts which of this plan's sites the other landing will move. It is
a floor, not a ceiling.

Measured on `tanto-diet`: the note predicted four sites that
`bug-report-hold`'s landing would move. When the merge happened, **seven** had
moved — and three of the four surprises came from that plan's own **close-fix
commit**, made after its T2 shoroku to correct text its human review had
caught, rather than from any passage of the plan itself. A prediction table
authored from a plan's own passages cannot see a fix commit that lands after
it.

So the table is a starting point for the re-author pass, never a ceiling on
it: only re-running `replay` against the tree as it actually stands at
branch-cut time catches the rest. The hazard is the table's own tone — a
confident four-row list reads as more complete than it is, and a re-author
who trusts it stops early.

## Three checks for a rebase batch

Measured on `experience-layer`'s rebase batch (2026-10-01):

- **Compare a correction's Reason with `main`, not its Old text.** A
  "`main` already carries the fix" judgment on a text-correction item has to
  hold the item's Reason against `main`'s sentence. The first pass dropped two
  shusei items because `main` had renamed the same words (`t2-` to
  `shoroku-`), but the defect — a template stating file names a dispatch
  overrides — survived the rename; only the spec review caught it, because
  its brief named the rule. A rebase brief carrying correction items can ask
  the implementer to quote each item's Reason beside `main`'s text.
- **Diff the per-file delta before and after.** A cheap independent invariant:
  compare the branch's own +/- delta per file before the rebase
  (`base..old tip`) and after it (`main..new tip`). There, 91 of 98 files had
  the same delta, and the seven that differed were exactly the conflicted and
  carried files, each explained by `main`'s own edit — a per-file view that
  `git range-diff`'s `!` rows do not give. The check is a script of about 40
  lines, worth keeping as a `passage-check.js` subcommand.
- **Give carried hunks their own commit.** A conflict resolved inside a
  replayed commit can add content under the original commit's subject: two new
  expectations landed in the replayed commit whose subject names the removal
  and the repointing, and the history says nothing of them — only that batch's
  reports do. When the carried hunks are more than a repoint, consider a
  commit of their own, which the rebase brief's count rule then allows for.

## A whole-file block is run before the plan is committed

Assemble the content of a plan's `W` blocks and run it — as the real files,
against real fixtures — before the plan is committed, not at the task that
transcribes it.

Measured on `tanto-diet`, whose drafting-time claim was exactly that: the
`W1.1` and `W2.1` content was assembled and run together before the commit,
23 tests, 23 pass. The claim held up under fresh, independent re-execution
during the batch that landed it — task 1's suite failed exactly as predicted,
and task 2's implementation made all of it pass on the first real dispatch
(24 tests, after one fix round). What surfaced instead were two pre-existing
design gaps in the code the blocks carried, not transcription errors.

That is the point of the practice: running the blocks first moves everything
a run can catch out of the implementation batch, so what is left at the
boundary is design, which is what a review is for. `roles/keikaku.md` does not
name it as a general recommendation.

## A departure's reason is a test case

When a task's brief states a deliberate departure from the spec and gives its
reason — "this design choice exists because of scenario X" — the test content
that same brief mandates should include a fixture for X. Otherwise the
departure's own justification is the one thing the task never verifies.

Measured on `tanto-diet`: task 3's brief departed from the design spec's 1.5
in one sentence (measuring a wake-up's gap from the most recent *any*-
timestamped record, not only the previous `assistant` record) and gave the
exact reason — "two wake-ups can arrive with no `assistant` record between
them". No test in the plan's own verbatim-mandated `P3.8` block exercises
that scenario: every fixture is strict human/assistant alternation. The
departure was correct and went unverified.

The Expectations section above is this rule's neighbor: a stated reason is a
prediction, and a prediction a plan states is a prediction a plan should
run.

## Extend the block that already covers a span

When a finding or a needle names a span of text, check every **existing** block
whose path matches before drafting a new one. The search for "does something
already touch this text" is cheaper than drafting a new block and discovering
the overlap by a `replay` failure afterward.

Measured on `tanto-bg-seats`. The plan review's follow-up dispatch fixed two
missing passages in `roles/keikaku.md`, and its first attempt added a new,
separately numbered block over a span an existing block (`P22.11`) already
partly covered. The result doubly covered four of `P22.11`'s six lines and
broke `P22.11` itself — `occurrence-count: P22.11 — expected 1, found 0` — on
the very next `replay`. The correction was to revert the new block and extend
`P22.11` by its two missing leading lines instead.

## A stray `$scratch` is data, not an obstacle

A real-CLI measurement task's Step 1 checks `$scratch` **before** any `rm -rf`,
and reads a stray non-empty `$scratch` as evidence of an earlier, incomplete
attempt at the same task rather than as something in the way. Worth stating in
a real-CLI plan's Global Constraints, so the next task does by rule what this
one did by hand.

Measured twice in one plan — `tanto-bg-seats`'s task 9 and task 14 — where the
task's own `$scratch` path was found pre-populated with dead debris from an
earlier attempt. Both times the debris was diagnosable as dead from static
evidence alone (pid liveness, an empty `seats.json`, no completed clone),
without touching it; both times the diagnosis was done by hand because nothing
in the plan asked for it.

## A measurement batch ends by diffing the fake against what it measured

A fake written from a spec's guesses has to be re-derived from the real listing
once the real listing has been measured. Give a measurement batch one last task
whose only job is to diff the fake against the output the batch measured.

Measured on `tanto-bg-seats`: `spawner.test.js`'s fake was written from the
spec's guesses at task 1, and nine measurements later (tasks 7-15) it still
printed an ISO `startedAt`, a `Removed worktree` line, and a `shoki-<topic>`
branch — none of which the real CLI does. The divergence passed seven batches,
and reached the roster, because the per-task reviewers read the fake against
the spawner and never against the verification reports. Nothing in the plan
paired the two.

## Global Constraints name the one trailer a commit must carry

A plan's Global Constraints name the one literal trailer every commit must
carry, and say nothing that reads as a second one. The harness's own
attribution line is not a second requirement, and a sentence that mentions
both reads, on a fast pass, as if both must coexist.

Measured on `bg-seat-ergonomics`: its Global Constraints said every commit
ends with the plan's trailer and that "the harness supplies each session's own
attribution line". A Jisso's Task 8 dispatch over-read it as two required
trailers and made one avoidable empty commit before the reading was corrected
at Task 9; the binding requirement was only the plan's own trailer.

## A task that strikes one item of a multi-item issue reads the rest of it

A task that strikes one item of a multi-item issue reads the issue's severity
and closing prose for a dependency on the struck item, not only the item's own
text. A paragraph outside the task's blocks can rest on the item the task
resolves and go quietly stale.

Measured on `bg-seat-ergonomics`: Task 15 struck issue-bdad's third item and
bumped its `updated:`, while the issue's severity paragraph ("Medium because
the exit-file collision is a real path collision that has already happened
more than once…") still rests partly on that item.

## A site under a bold paragraph lead is named by the heading and the lead

A spec pinned across a moving branch names its sites by heading, not by line.
Where the skill's text uses a bold paragraph lead as a pseudo-heading —
**The census.** in `SKILL.md`'s "Handshake and roster" and in
`roles/kanri.md`'s "Session lifecycle" — the heading alone does not find the
site. Name it by the heading plus the lead's bold text, so that `grep '^#'`
and a bold-lead grep (`grep -n '^\*\*The census\.\*\*'`) together find it.

Measured on `bg-seat-fixes`: its spec review's F-13 was a site named by
heading alone that sat under such a lead.

## A path filter, not a quoted deletion, accounts for a templated rewrite

When `passage-check diff` cannot account for a removed template and its
`{{name}}`-expanded copies, filter those paths in the plan's "How a batch is
verified" and let the instrument that guards them be the real check — do not
quote the deleted text in "not an instruction" fences to satisfy `diff`.
Quoted deletions are pure duplication inside the task, and they drift.

Measured on `experience-layer` (2026-09-30): the drafter's first workaround
quoted the deleted `requirements` template (64 lines) and the copies'
expanded lines in two such fences inside Task 1 — 90 lines of duplication in
the largest task. Two path filters replaced them, with phase A's
`doc-system-check.js check` as the check on the copies, and Task 1 went from
1272 to 1174 lines.

## One Jisso carries one batch, so a task past a thousand lines is a batch alone

A batch is what one Jisso carries, so a task that alone runs to over a
thousand lines is a batch of its own, whatever letters the spec gave its
batches. Say the mapping from the spec's letters to the plan's in the plan's
Batches section, since every reader of both documents must carry it.

Measured on `experience-layer` (2026-09-30): keeping the spec's batch letters
would have given batch A four tasks with Task 1 alone at about 1170 lines, so
batch A became Task 1 alone and the spec's B and C became the plan's C and D.
The spec allowed the split ("A may be two batches").

## A boundary `diff` fence ending in `tail -1` breaks under path-wide allowances

A boundary `diff` fence that ends in `tail -1` and expects "`diff: clean` or
the count line of the last output" cannot meet its `Expected:` once a later
batch adds path-wide allowances: the last line of the output is then an
allowed-family line. A plan that adds path-wide allowances rewrites that
fence's expectation, or prints the count line by its own pattern.

Measured on `experience-layer` (2026-10-01): from batch D's path-wide
allowances on, the fence's last line was a removed line (D-8).

## A tree-state check reads what the hub owns from the hub

A plan's tree-state check reads the values the hub owns — the Cast, a
scene's dates — from the hub, or says which values a later decision may move;
it does not hard-code them. A decision during the topic can change them.

Measured on `experience-layer` (2026-10-01): the plan's check hard-coded
`cast = {"maintainer", "agent", "collaborator"}` and `created == updated`,
and the human renamed the Cast during the topic. The run survived because the
batch prompt carried a superseding line (R-10). Relevant to
`passage-plan-generation`, which will generate such snippets.

## A line-scoped grep over prose that wraps reads 0 where the recipe predicts 1

A sanity grep over rendered prose has to allow for a line wrap. A close's
shusei-batch prompt predicted that a `grep -F` for the shared tail of an
item's Old and New text would match once; the New text's own prescribed line
break split that tail across two lines, so the line-scoped grep read 0 every
time. A check of prose that may wrap is multi-line-aware (a substring count
over the file with newlines folded), or says that the tail may not survive on
one line. Measured at `tanto-bg-seats`'s close (2026-10-01).

## Repeated tasks are one template assembled by script, and a pattern edit over the copies asserts its count

`tanto-issue-triage`'s ten round tasks are one text with a name part
substituted. Having the drafter write one template and assembling the rest
by script kept them byte-identical (the reviewer confirmed it by diff) and
cost one drafter pass instead of ten. Two special cases — a conditional task
and a task that reads its part from a file — could not be generated and were
written by hand. One over-broad `printf` substitution put a replaced text into
the generated copies, which had to be reverted in nine tasks; a grep caught
it, not a check. A pattern edit across generated copies runs per task with a
count assertion.

## A spec's commands are run once before the plan inherits them

The `tanto-issue-triage` plan had to correct or choose between four places in
its spec: the commit recipe `git commit --only -- <paths> -m …` (the message
after `--` is read as a pathspec), `git diff-tree` without `-M` (no `R`
lines), an allowed-path set naming the root Markdown files against
`AGENTS.md`'s "Never do", and a note sentence placed both "at the end" of a
paragraph and after a sentence that is not its end. The plan's Self-Review
absorbed all four; a Sekkei check that runs the spec's own commands once
against a scratch repository would have found the first two before the plan
stage.

## A form slot that may hold a dash is a slot no grep can check

`tanto-issue-triage`'s brief fixed the Kept line as `<n>. [kept] — — <title>`
(target `—`, then the separator). No grep checked it: the plan's awk accepted
`[kept] — <title>` as well, and one round's implementer wrote that for 29
lines, caught only by the quality reviewer's own script. A form whose slot may
hold a dash needs a check written for that slot, or a word in the slot that
is not a dash.

## A brief reason is one short sentence; the evidence goes in the report

A brief reason built from a recommendation's Reason by "carry every clause"
runs to 300-600 characters when the Reason carries its evidence: 30 of 31
lines were over about 220 characters in one `tanto-issue-triage` round, and
the next round's implementer, told so from the start, still wrote eight over
300. The form wants one short sentence for the decision, with the evidence in
the report's judgment list.

## Two reviewers of one task get their own scratch prefix

Two reviews of one task given one scratch directory overwrite each other's
files. A file-name prefix per reviewer (`spec-`, `qual-`) avoids it.

## A form a human produces and a script consumes is pinned in one place, and the consumer stops on a line it cannot read

On `tanto-issue-triage` the plan's Global Constraints fixed a direction item
line as `<n> — <destination word> [<target>] — <the human's words verbatim>`,
while the nine direction files Kanri wrote read
`R<part>: <n> は <Word> → <target>` plus an indented `subject:` line. Three consumers — the apply task's
parse, a boundary block's regex and the last task's grep — read the plan's
form. Written to the plan's text, the apply would have dropped all 44 answers
without an error, because an unreadable line was not a stop. Pin such a form
in one place with the producer and every consumer pointed at it, and make a
consumer stop on a line it cannot read (the helper now does).

## A measurement report glosses its ledger labels and puts the command beside every figure

`tanto-issue-triage`'s dogfood report, a frozen report of recorded output,
drew two substantive findings from its quality review: terms of art and
ledger labels (`R-n`, `S-n`, kessai, round file, carrier) cited without a
gloss, and figures with no command beside them. The brief's list of fences
asked for neither. The branch review then re-derived every figure
independently and found all of them right; the report's defects were prose
about the ledger and presentation. A brief for a measurement-type deliverable
asks for a gloss of every label and for each figure's command in a fence — a
rule that would have removed most of that branch's fix-wave items.

## A reviewer prompt names the exact verify command and its expected totals

A reviewer prompt that does not name the verify command invites a false
alarm. On `tanto-issue-triage`'s fix wave the quality reviewer read the
implementer's "32 pass" against its own one-file run ("13 tests, 13 passing")
and flagged the figure as suspect; the figure was right (19 + 13, two files),
as the spec review's run of the two-file command showed. The task-reviewer
template's "Do not re-run the suite" line leaves a reviewer to run whatever it
likes; a dispatch that names the exact command and its expected totals
removes the mismatch before it is raised.

## Two halves that edit the same lines are one task

The `shoki-seat` plan's largest task (the no-first-turn notice and the
heartbeat, 792 lines in six steps) was not split, though its size argued for
it. The notice and the heartbeat share the spawner's census pass, its three
poll loops, and the test helper whose environment both need, so two tasks
would edit the same lines, and `verify` could not hold at a batch boundary
between them. A split is by the lines a task edits, not by its size.

## The boundary's preconditions sit in ignore files outside `.gitignore`

`passage-check.js boundary --plan`'s check 1 — `git status --porcelain`
prints nothing — holds only because three ignore files outside the root
`.gitignore` hide the run's own files (this repository has no root
`.gitignore`): `.tanto/.gitignore` and `.superpowers/sdd/.gitignore`, both
`*`, and `.git/info/exclude`, which carries the harness's own
`**/.claude/worktrees/` entry. A fresh clone gets the first two when
`tanto.js` and the SDD skill first write them, and the third only where the
harness has run. A plan whose fence relies on a clean status names those
files as its precondition.

## An implementer step runs the per-file suites, and the whole suite runs at the boundary

The whole tanto suite took 6 min 51 s to 7 min 10 s during `shoki-seat`,
which leaves little headroom under a foreground command's ten-minute ceiling
when an implementer's dispatch runs it. That plan's Task 10 Step 4 was moved
to the Jisso for that reason. A plan that names per-file runs in its
implementer steps and leaves the whole suite to the boundary avoids the
substitution. Kin issue-46d3.

A step that cannot run inside a dispatch names its owner. The tanto-feedback
plan's Task 2 Step 4a ran the nine-minute suite "in the background"; under
tanto an implementer's commands are foreground and inside ten minutes, so the
step fell to the Jisso after the commit instead of before Verify, as the plan
ordered it. The plan says which seat runs such a step and where in the step
order its result is read.

The contradiction recurred on `roster-ledger` (2026-10-07): the plan's Step
5/6 said "run the whole suite in the background" while the role's rule for
dispatched subagents says "never a background job". The per-file foreground
run satisfies both, and it is the shape a plan that serializes a nine-minute
suite writes in its Step 5/6.

## A wave's untouched-file fence compares against the wave's own base

A fence that compares against the merge base cannot say "this wave did not
touch a file" when an earlier batch of the same plan did: in the
`shoki-seat` fix wave, such a fence over `templates/spawn-request.md` listed
Task 7's edit from batch B. A fence that asserts what one wave left untouched
compares against the wave's own base commit, the one its prompt names. Kin
issue-f94f.

The same holds for `passage-check verify`, which a fix wave on a passage
plan turns into the instrument that finds the wave's own side effects.
Measured on `roster-ledger`'s fix wave (2026-10-08): capturing a clean
`verify` baseline for every task before the first dispatch (one loop,
eighteen one-line files) made the final comparison mechanical, and the
wave's 26 changed passages and anchors matched the union of the three task
reports' lists exactly. The fix-wave recipe for passage plans.

What the same wave's prompt and briefs taught:

- **A fix-wave prompt lists each finding in one line.** "Task 3's three
  silent inputs" in the batch prompt named a finding group by its remedy's
  parenthetical, which listed only one of the three; the diagnosis was one
  hop away in a verdict file, and the Jisso needed a reading ruling. One line
  per finding saves it.
- **A brief is the prompt's closed list, copied verbatim.** The three briefs
  were the batch prompt's closed list copied verbatim, the line ranges of the
  diagnosis files (the SDD ledger, the verdicts, the branch review) and a
  Done-when checklist, so that no implementer read the plan or the spec
  whole. F1, eight items in two scripts and their tests (about 500 changed
  lines), was one sonnet dispatch with one fix round; the brief's suggestion
  to split it into two commits was not taken because the finding groups
  share interleaved hunks, and a commit by explicit path cannot split a
  file. A closed, diagnosed list of this size is one task.
- **A second reading of dispatch size** (issue-b4e7): in the
  `residency-retention` run of another repository, a whole-branch-review fix
  wave of eleven findings over nineteen files in two areas went as one
  `task.implement`, completed in a single pass (two commits, about 250k
  subagent tokens, no blocked items), and its one scoped re-review caught
  every substantive issue there was to catch. Two waves, one dispatch each,
  of eight and eleven findings.

## A plan drafted in parallel is applied and run whole before its review

The `run-owned-seats` plan (23 tasks) was drafted by six `plan.draft`
subagents in parallel, one per file group, from one brief that fixed the
task numbers, titles and files; Keikaku wrote the head, Batches, How a batch
is verified and Self-Review, and assembled the fragments by script. Every
drafter's own `lint` and `replay` were clean; the defects were all at the
seams — a return shape read as a boolean, two tasks editing one test, a
launcher test whose premise a refusal removed — and only the assembled
plan's cumulative `replay` and a harness that applied every `P` block to a
copy of `skills/tanto/` and ran the suites found them. A plan drafted in
parallel needs that cumulative apply-and-run before the review, and the
review brief names the applied tree.

## What a parallel-drafting brief pins

Measured on `roster-ledger`'s plan (2026-10-07), three drafters in parallel:

- **The shell preamble of a Verify step.** The three drafters' parts spelled
  `$TANTO` three ways in Verify steps (bare, `$HOME/.claude`,
  `${CLAUDE_CONFIG_DIR:-$HOME/.claude}`); the brief fixed the task shape and
  the passage grammar but not the shell preamble of a Verify step, and the
  plan reviewer, not the assembly, caught it. The brief gives the one
  preamble every Verify step opens with.
- **One owner per file range and per helper name.** Drafting by parallel
  batches needed three reconciliation rounds the brief could have saved —
  shared helper names (Task 1's `headerAt` and friends, which Tasks 5, 8, 9
  call), a template two drafters both took (`spawn-request.md`), and a
  changed `seat` line that two role sites quote. A brief that lists, per
  mechanism, the one task that owns each file range and each helper name
  removes the rounds.

## A run that edits its own contract: a text defect is always the plan's

A run that edits the contract its own sessions read has a pattern worth a
name. Measured on `roster-ledger` (2026-10-08): the reviewers checked the
new text against the code, so a text defect was always the plan's, and the
Jisso could not fix it under rule 11 and the "covers exactly this plan's
passages" approval — nine such Importants (Tasks 12, 13, 16, 18) went to the
fix wave. A plan that carries the fix wave's wording ahead of time for known
plan-mandated findings would cost one round less. Where such findings go is
recorded in decision-ca6d.

## A check a plan asks a Jisso to run asserts; it does not print

A drafter's frontmatter check printed `BAD` and exited 0, so the step could
not fail. A check a plan asks a Jisso to run needs an assertion, not a
print.

## Where the needle table lives decides what a stage frame prints

The `run-owned-seats` plan's fence 4 needle table (227 rows, generated from
the plan's O blocks and the applied tree) lived inside How a batch is
verified, so `frame --stage 1` printed about 650 lines for Kanri. A table
the fence reads from a file would shrink that reading, at the cost of a file
the boundary needs on disk.

## A "replace exactly these lines" block names its occurrence

`passage-check.js` reads a block that says "replace exactly these N lines"
line by line, while an implementer's Edit tool matches a substring. Three
old texts of one `run-owned-seats` batch (`  } else {`, `  return 0;`, and a
third) matched several places as substrings, and each implementer had to
infer the right one from the brief's context. Say "whole lines, anchored",
or name the occurrence by its neighbors.

## A text moved from the spec into a contract file drops the spec's section numbers

Twice in one fix wave a contract text copied from the spec carried the
spec's section numbers: one sentence ended "(2.7)" in `SKILL.md`, which has
no such section, and another ended "(3.1)" in the spec where that section
says nothing of the subject. Both were caught only at review and fixed at a
rework. `SKILL.md` points at its own headings and C-n/P-n ids, never at the
spec's numbers; a text that moves from the spec into a contract file drops
the number or names the heading.

## A plan too large for one drafter is cut by batch, and after assembly the plan file is the source

The tanto-feedback plan (about 10,000 lines, 18 tasks) was drafted by seven
`plan.draft` runs in parallel, one per batch and one more for a file the
first pass found, from one shared brief; the head, Batches, How a batch is
verified and Self-Review were the author's, and an assembler script
concatenated the parts and generated the boundary fence's needle rows from
the `O` blocks. One drafter for the whole plan was rejected: two scripts of
1,618 and 1,901 lines had to be run green before they were quoted, so the
plan was past one turn's output, and a `W` block never run is the
placeholder the form forbids. The cut by batch also made each part lintable
and replayable alone. Part A's drafter developed its two scripts green in a
scratch directory and wrapped them into `W` blocks by script.

A drafter resumed to fix its part regenerates the part from its own source,
so an edit the author made to the part file in the meantime is lost; one
was, and was found only by the next lint. After the first assembly the plan
file is the source: later edits go to it, or are asked of the drafter by
message. Figures for the seven runs are in
`docs/notes/tanto-measured-data-points.md`.

## A fix wave's brief carries the finding's scenario beside its Fix line

A review's Fix line is a proposal, not a patch. In the tanto-feedback fix
wave, finding 1's literal condition — reuse the placed file unless the
receiving inbox holds its basename — is false on every re-run of the skill
repository's own close, since that file's destination is that inbox; and
finding 4's new text nested a code span in a code span. Both were found by
an implementer or a reviewer reading the code at HEAD, not by the review's
text. A wave's brief carries each finding's scenario and intent next to its
Fix line, and says which one wins.
