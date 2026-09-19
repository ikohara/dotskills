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
