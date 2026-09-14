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

## A block must survive its destination's linter

A block is written against the file it lands in, and that file's linter runs
with `--fix` before the commit. A block the linter rewrites can never match.

- **Never put a leading space inside an inline code span** in a file
  markdownlint lints. `MD038`'s `--fix` strips it and then reports zero errors,
  so the passage is unlandable and the failure looks like a missing passage.
  Measured twice in the tanto-workspace plan (`roles/kanri.md`,
  `roles/kaiseki.md`), with the counter-case that `skills/**/templates/**` is
  ignored by this repository's configuration and the identical span lands
  byte-exact there.
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
- `diff` counts an added line as *accounted* when the plan quotes that line
  **anywhere**, not only where a passage lands it. Measured in the
  tanto-workspace fix wave: nineteen lines were added to a note and only
  thirteen read as `unaccounted-added`, because the plan's own Verification
  section quotes verbatim the two commands the new text carries. A line can
  therefore be accounted for by the prose that specified it rather than by a
  block that lands it.

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
